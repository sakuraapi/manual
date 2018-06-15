# @Model Class Decorator

## Introduction

`@Model` is a class decorator that declares a class has various model related features mixed into it.

A model represents an entity that can be marshaled to and from JSON or to and from a database \(exclusively MongoDB, at the moment\).

For example, the following would be a simple `User` model.

```javascript
@Model()
export class User extends SapiModelMixin() {
    @Json()
    firstName: string;

    @Json()
    lastName: string;
}
```

Note that though `User` extends `SapiModelMixin`, it is not actually inheriting any of its functionality from that base class. `SapiModelMixin` exists simply to inform TypeScript of the types for the methods and properties that are being mixed in by the `@Model` decorator. You can inherit your own base class by passing it in as the parameter for `SapiModelMixin` \(e.g., `SapiModelMixin(YourBaseClass)`\).

For those who are interested, the reason SakuraApi doesn't use an interface here \(for example, `ISapiModel`\) is because some of the methods mixed in are static \(i.e., not on the prototype\), and TypeScript does not allow you to declare static members as part of your interface.

## @Model\({...options}\)

`@Model` takes an `IModelOptions` as its argument.

### dbConfig

Models are often associated with a database and collection. For example:

```javascript
@Model({
    dbConfig: {
        db: 'user',
        collection: 'users'
    }
})
export class User extends SapiModelMixin() {
    @Db('fn') @Json()
    firstName: string;

    @Db('ln') @Json()
    lastName: string;
}
```

`@Model` optionally takes a parameter of type `IModelOptions`. One of the options you can pass to `@Model` is `dbConfig`. This tells SakuraApi which database connection to use when marshaling the model to or from the database.

By convention, there's usually a `dbs.ts` file in your `src/config/bootstrap` directory that exports various database configurations so that you don't have to manually type in the string names, which is error prone. So, assuming you have a `dbs.ts` file that includes a single database configuration for the `User` model above, it would look like this:

```javascript
export const dbs = {
  donation: {
    collection: 'users',
    db: 'user'
  },
};
```

With that, you can simplify your model decoration:

```javascript
@Model({
    dbConfig: dbs.donation
})
export class User extends SapiModelMixin() {
    @Db('fn') @Json()
    firstName: string;

    @Db('ln') @Json()
    lastName: string;
}
```

In addition to eliminating the possibility of typos while you're declaring your model, the `dbs.ts` convention also gives you the convenience of being able to easily rename collections and databases as well as the convenience of using refactoring tools to rename `dbs` properties \(if your IDE support refactoring features\).

Note, however, that declaring a collection and database in the options of your `@Model` is not sufficient to configuring SakuraApi to use your database. `dbConfig` tells SakuraApi the database name and collection to use, but it does not tell SakuraApi how to connect to the database. Instead, `dbConfig` tells your `@Model` where your actual database configuration is stored in your `config/vironment` files.

For example, your `environment.ts` file might have the following section:

```javascript
const url = MONGO_DB_CONN || `mongodb://${MONGO_DB_ADDRESS}:${MONGO_DB_PORT}/user`;

module.exports = {
  dbConnections: [
    {
      mongoClientOptions: {},
      name: dbs.user.db,
      url
    }
  ]
}
```

SakuraApi's cli \(`sapi`\) will scaffold the boilerplate configuration, but you'll have to provide the database specifics.

The `dbConnections` array in your environment configuration is used by SakuraApi's `SakuraMongoDbConnection` during bootstrapping to build an internal map of MongoDB configurations. An `@Model`'s `dbConfig` uses `dbConfig.db` to look up the correct database connection and it provides `dbConfig.collection` to specify the collection to which a document should be marshaled to or from.

The `dbConnections` configuration object's `name` property is what is passed into the `@Model` `dbConfig.db` field.

### cipherKey

SakuraApi can encrypt certain fields when marshaling data to and from JSON. An example of when this might be helpful is if you have ids that could be used to correlate some secret about your data. In that case, you want to make sure that each time that id is sent to a client, that it is indistinguishable from random noise. In other words, a client could get id `1` multiple times and each time, no matter how many times that id was retrieved, it would be impossible to tell that it was related to the prior forms of that id. 

```javascript
@Model({ 
    cipherKey: '123', 
    dbConfig: dbs.user
})
export class User extends SapiModelMixin(BaseModel) {
    @Json({encrypt: true, type: 'id'})
    secretId: ObjectID;
}
```

The cipher key is the private key that's used when encrypting `secreteId` `toJson()` and `fromJson()`

`cipherKey` must be a valid AES private key.

### collation

If your particular set of data requires MongoDB's collation feature, you can set the default collation for your model with the optional `collation` property. For example:

```javascript
@Model({
    collation: { locale: 'en' },
    dbConfig: dbs.donation
})
export class User extends SapiModelMixin() {}
```

`collation` is takes an [`IMongoDBCollation`](https://sakuraapi.github.io/docs-core/develop/interfaces/imongodbcollation.html) object.  You can learn more about MongoDB collation from the [MongoDB Docs](https://docs.mongodb.com/manual/reference/collation-locales-defaults/#collation-languages-locales).

### promiscuous

By default, SakuraApi does not store fields from the model that are not decorated with `@Db`. You can override this behavior by making the `@Model` promiscuous.

```javascript
ample:
@Model({
    dbConfig: dbs.donation,
    promiscuous: true
})
export class User extends SapiModelMixin() {}
```

## Model`.toJson()`

`toJson` maps a model's properties to a new Object with its models properties mapped to their JSON equivalents \(it doesn't actually return a JSON string\). For example, consider this model:

```javascript
@Model()
export User extends SapiModelMixin() {
    @Json()
    firstName = 'John';

    @Json('ln')
    lastName = 'Adams';
}

const user = new User();
const dto = user.toJson();
```

In the above example, the resulting `dto` \(data transfer object\) would be:

```javascript
{
    firstName: 'John',
    ln: 'Adams'
}
```

This resulting object is not an instance of a User model. Rather, it is an instance of Object ready to be marshaled to a JSON string. NodeJS with Express converts this object to a JSON string when you send it back as your response body.

### Context

Model`.toJson()` optionally takes an `IContext` parameter or a context name as a string. For example:

```javascript
@Model()
export User extends SapiModelMixin() {
    @Json()
    @Json({field: 'fn', context: 'partner'})
    firstName = 'John';

    @Json()
    @Json({field: 'ln', context: 'partner'})
    lastName = 'Adams';
}

const user1 = (new User()).toJson();
const user2 = (new User()).toJson('partner');
```

In the above example, `user1` would result in:

```javascript
{
    firstName: 'John',
    lastName: 'Adams'
}
```

And `user2` would result in:

```text
{
    fn: 'John',
    ln: 'Adams'
}
```

Why is this helpful? In a simple world you would have JSON DTOs that have consistent field names. For example, assuming the following JSON user object:

```javascript
// Json source 1
{
    "fName": "John",
    "lName": "Adams"
}
```

Were the world simple, all of your Json DTOs for a user would have this shape, everyone would agree on field names and so they would be consistent regardless of their source, and woodland creatures would just be cuddly with no instinctual desire to eat you. We do not live in such a world, however. Instead, we live in a fallen world where some services return the above Json, and other services return different field names for the same kind of information. There are also many woodland creates that would like to eat you in our world, but that's off topic. Contemplate the prior json from source one while considering this second json from source two:

```javascript
// Json source 2
{
    "first_name": "John",
    "last_name": "Adams"
}
```

It would be lame if you had to define separate models in SakuraApi to account for what amount to two identical objects that only differ on the specifics of what their fields are named. Fortunately, you do not. Instead, you use the context feature to let SakuraApi know how to map to and from various json contexts. The following model demonstrates how to account for the prior source 1 and source 2 examples:

```javascript
@Model()
export User extends SapiModelMixin() {
    @Json('fname') 
    @Json('first_name', 'source2')
    firstName: string;

    @Json('lName')
    @Json('last_name', 'source2')
    lastName: string;
}

const modelFromSource1 = User.fromJson(jsonSource1);
const modelFromSource2 = User.fromJson(jsonSource2, 'source2');

const backToJson1 = modelFromSource1.toJson();
const backToJson2 = modelFromSource2.toJson('source2');
```

The resulting `modelFromSource1` and `modelFromSource2` will both properly map their respective json fields to this same `User` model. Notice that the source 2 `@Json` field decorators provide a second parameter \(`'source2'`\) and the first `@Json` decorators do not. Notice also that the source 2 `fromJson` call also provides that second `'source2'` parameter. By default, `@Json` assumes a context named `'default'`. You do not have to provide this. The second `@Json` decorators add a second mapping for their fields in the context of `'source2'`. You can call your contexts whatever you want, but you should probably pick names that are descriptive, yet not annoying to type.

You can declare an `@Json` operator with a `*` context to tell SakuraApi to apply that `@Json` decorator to any context.

## Model`.toJsonString()`

Just like `toJson`, `toJsonString` will map your model to a resulting object that has the appropriate fields for your JSON DTO. The difference is that it returns a proper JSON string rather than a JavaScript object.

## Mode`.fromJson()`

`fromJson` takes an object and maps it to a model. Like `toJson`, `fromJson` does not actually handle a JSON string. Instead, it expects an object that has already been marshaled from JSON but has yet to be transformed into a model. For example:

```javascript
/** note: you will never (rarely?) manually parse a JSON string like this since your middleware should parse incoming JSON before it gets to your handler */
const json = JSON.parse(`
    {
        "fn":"John",
        "ln":"Adams"
    }
`);

@Model()
export User extends SapiModelMixin() {
    @Json('fn')
    firstName: string;

    @Json('ln')
    lastName: string;
}

const user = User.fromJson(json);
```

The resulting `user` will be an object that is an instanceof a model with its fields properly mapped such that `firstName` has the value of `fn` \('John'\) and `lastName` has the value of `ln`.

## Model`.fromJsonArray()`

Like `fromJson` except that it takes an array of objects that result in an array of models.

## Model`.fromJsonToDb()`

You usually won't use this method. It takes an object with JSON fields and directly maps to a resulting object that has DB fields and is ready to be marshalled to MongoDB.

For exampe:

```javascript
@Model()
export User extends SapiModelMixin() {
    @Json('fName') @Db('fn')
    firstName: string;

    @Json('lName') @Db('ln')
    lastName: string;
}

/** note: you will never actually manually parse a JSON string like this since your middleware should parse incoming JSON before it gets to your handler */
const json = JSON.parse(`
    {
        "fn":"John",
        "ln":"Adams"
    }
`);

const dbObj = User.fromJsonToDb(json);
```

The resulting dbObj will be an object taking the following shape:

```javascript
{
    fn: 'John',
    ln: 'Adams'
}
```

It is not an instsance of the User model.

## @Json\(\) Property Decorator

One of the common tasks that a web server is responsible for is marshaling some internal object \(in this case a model\) to a DTO \(data transfer object\). A DTO is a representation of data that is appropriate for transport across a network intermediary like the internet. The nuance of transitioning from an internal object to a DTO is sometimes lost on us as JavaScript developers because of the seamlessness of transitioning to and from a JavaScript object to JSON. As seamless as it may be, this transformation still needs to take place.

SakuraApi models have several methods to assist with marshalling to and from Json.



## @ToJson\(\) and @FromJson\(\) Method Decorators

While the above is helpful, sometimes you need to transform incoming Json DTOs in more complicated ways. For example, conside the following DTO:

```javascript
{
    name: {
        firstName: 'John',
        lastName: 'Adams'
    },
    location: 'DC'
}
```

To allow this kind of complex Json to be flattened out \(in this scenario\) to our simpler model, you would use `@FormatFromJson` and, if you needed to transform a model back to that more complex shape, `@FormatToJson`. For example:

```javascript
@Model()
export User extends SapiModelMixin() {
    firstName: string;
    lastName: string;

    @FormatFromJson()
    flattenUser(json: any, model: any, context: string) {
        model.firstName = (json.name || {}).firstName || '';
        model.lastName = (json.name || {}).lastName || '';

        model.location = ('location' in model) ? model.location.toLowerCase() : undefined; 

        return model;
    }

    @FormatToJson()
    inflateUser(json: any, model: any, context: string) {
        json.user = json.user || {};

        json.user.firstName = model.firstName;
        json.user.lastName = model.lastName;

        json.location = ('location' in model) ? model.location.toUpperCase() : undefined;

        return json;
    }
}
```

Methods decorated with `@FormatFromJson` will be called after the regular `fromJson` marshalling from Json has taken place, so the `model` parameter will be populated, in the above case, with `location: 'DC'`. Methods decorated with `@FormatToJson` will be called after the model has been transformed to Json.

Both `@FormatFromJson` and `@FormatToJson` can be declared with a context \(e.g., `@FormatToJson('source2')`\). Both can also be declared with a `*` context so that they apply regardless of the specific context that's being marshalled.

## @Json\(\) with formatter functions

You can declare an `@Json` decorator with the optional `formatToJson` property or the optional `formatFromJson` property to allow a property level formater function or method to be declared. For example:

```javascript
@Model()
export User extends SapiModelMixin() {
    @Json({
        field: 'fn',
        toJson: (val: any, key: string) => (val || '').toLowerCase(),
        fromJson: (val: any, key: string) => (val || '').toUpperCase()
    })
    @Json({
        context: 'source2',
        field: 'fName',
        toJson: (val: any, key: string) => (val || '').toUpperCase(),
        fromJson: (val: any, key: string) => (val || '').toLowerCase()
    })
    firstName: string;
}
```

In the above example, the `IJsonOptions` object is passed into `@Json` rather than the simple field name parameter or the field name and context parameters. The `val` parameter is the value being marshalled to or from the model. The `key` is the name of the model's key \(this is provided so that you can optionally have methods that are assigned to multiple formatters with slightly different behaviors based on the actual key being manipulated\).

In any non-trivial case, you'll probably want to pass a reference to a formatter function rather than having the formatter inline as an anonymous function.

## Nested Models and Objects

### Nested Models

It is sometimes desireable to have nested models. It is often desireable in this scenario for the child object to be properly instantiated as an instance of the model it represents. For example:

```javascript
@Model()
export User extends SapiModelMixin() {
    @Json()
    street: string;
    @Json()
    zip: string;
    @Json()
    city: string;
    @Json()
    state: string;
}

@Model()
export User extends SapiModelMixin() {

    @Json()
    firstName: string;
    @Json()
    lastName: string;

    @Json({model: Address})
    address: Address;
}

/** as noted above, you wouldn't normally parse a json string like this since your middleware should be taking care of that. */
const user = User.fromJson(
    JSON.parse(`
        "firstName": "John",
        "lastName": "Adams",
        "address": {
            "street": "1600 Presidential Retirement Community Ave",
            "zip": "12345",
            "city": "Somewhere Far From Washington DC",
            "state": "HI"
        }
    `);
);
```

The optional `model` property of `@Json` takes an `@Model` decorated class. This informs SakuraApi that this property should be instantiated as that model when calling `fromJson` and when calling `toJson`, if the property is present, SakuraApi should utilize its `@Json` decorators to inform the resulting json object.

### Nested Objects \(promiscuous mode\)

The prior example is fine so long as you want to define a model for the sub-object. There may be times, however, where you just want to take the child object as-is without having to map all of its fields. In this scenario, you want SakuraApi to be a little less strict about its marshalling `fromJson`. You want it to be promiscous:

```javascript
@Model()
export User extends SapiModelMixin() {

    @Json()
    firstName: string;

    @Json()
    lastName: string;

    @Json({promiscuous: true})
    meta: any;
}

/** as noted above, you wouldn't normally parse a json string like this since your middleware should be taking care of that. */
const user = User.fromJson(
    JSON.parse(`
        "firstName": "John",
        "lastName": "Adams",
        "meta": {
            "audit_ip_address": "123.123.123.123",
            "txid": 85685785678568,
            "responding_server": "hal-9000@disovery.nasa.gov"
        }
    `);
);
```

The resulting `user` will have an `address` property with whatever value was marshalled from the json object. This is helpful, as an example, in cases where you are integrating with a third party API and they pass you some kind of meta object \(or whatever\) that has a bunch of information that you won't actually use anywhere in your code, but you want to log it for auditing purposes. Keep in mind that you'll also have to make this field promiscuous for `@Db()` if you want to persist `meta` to the datbase \(details below\).

## @Private\(\) - Protecting fields from Json

There may be fields that you never want marshalled to Json. For example:

```javascript
@Model()
export User extends SapiModelMixin() {

    @Json()
    name: string;

    @Json('pw') @Private()
    password: string;
}
```

Here a password can be marshalled from Json to this `User` model, but the password will never be marshalle dto Json.

`@Private()` supports contexts, so if you want to make a field private in all contexts, make sure you use the `*` context \(e.g., `@Private('*')`\).

If you need more complex logic for when a property may be included in your resulting Json, you can use `FormatToJson()`.


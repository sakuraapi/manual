# Introduction
This section is under active development - there's a lot more to come.

`@Model` is a decorator that declares to SakuraApi that the class being decorated should have the various model related features mixed into the class being decorated.

A model represents an entity that can be marshalled to and from JSON or to and from a Database (currently MongoDB).

For example, the following would be a simple `User` model.

```
@Model()
export class User extends SapiModelMixin() {
    @Json()
    firstName: string;

    @Json()
    lastName: string;
}
```

Note that though `User` extends `SapiModelMixin`, it is not actually inheriting any of its functionality from that base class. `SapiModelMixin` exists simply to inform TypeScript of what types are being mixed in by the `@Model` decorator. You can inherit your own base class by passing it in as the argument for `SapiModelMixin`.

# Configuration

## @Model Options
`@Model` takes an `IModelOptions` as its argument.

### dbConfig

Models are usually associated with a database and collection. For example:
```
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

`@Model` takes an `IModelOptions` as its argument. One of the options you can pass to `@Model` is `dbConfig`. This tells SakuraApi which database connection to use when connecting marshalling the model to or from the database.

By convention, there's usually a `dbs.ts` file in your `src/config/bootstrap` directory that exports various database configurations so that you don't have to manually type in the string names, which is error prone. So, assuming you have a `dbs.ts` file that includes a single database configuration for the `User` model above, it would look like this:
```
export const dbs = {
  donation: {
    collection: 'users',
    db: 'user'
  },
};
```

With that, you can simplify your model decoration:
```
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
In addition to eliminating the possibility of typos while you're declaring your model, this also gives you the convenience of being able to easily rename collection and databases as well us the convenience of using refactoring tools to rename `dbs` properties (if your IDE support refactoring features).

Note, however, that declaring a collection and database in the options of your `@Model` is not sufficient to configuring SakuraApi to use your database. `dbConfig` tells SakuraApi the database name and collection to use, but it does not tell SakuraApi how to connect to the database. Instead, `dbConfig` is a hint to `@Model` that points to your actual database configuration stored in one of your `environment` files.

For example, your `environment.ts` file might have the following section:
```
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
SakuraApi's cli (`sapi`) will scaffold the boilerplate configuration, but you'll have to provide the database specifics.

The `dbConnections` field of your environment configuration is what tells SakuraApi how to connect to your database. The `@Model` `dbConfig` is that tells your `@Model` which `dbConnections` configuration it should use.

Notice that the `dbConnections` configuration object's `name` field should be what is being passed into the `@Model` `dbConfig` `db` field.


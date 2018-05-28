# readme

## Introduction

`@Injectable()` is a decorator that declares to SakuraApi that the class being decorated should have various service related features added \(mixed in\) to the class. `@Injectable` classes are often referred to as services. Those services are "provided" to your application as needed via SakuraApi's dependency injection system.

For example:

```text
@Injectable()
class NumberService extends SapiInjectableMixin() {

    private index = 0;

    next() : number {
        return this.index++;
    }
}
```

Classes decorated with `@Injectable` must be declared when instantiating SakuraApi:

```text
const sapi = new SakuraApi({
    providers: [
        NumberService
    ]
});
```

Failure to register your `@Injectable` service will result in an error the first time you try to inject the service.

Some things to keep in mind about `@Injectable` decorated classes:

* They are singletons
* They are lazy instantiated on first use
* They can be injected into the constructors of other `@Injectable` services as well as the constructors of `@Model` decorated classes and `@Routable` decorated classes.
* You can directly retrieve an instance of an `@Injectable` class with `sapi.getProvider(NumberService)`, where here sapi would be your instance of SakuraApi and `NumberService` is the exported class that's decorated with `@Injectable` \(i.e., you're passing in the constructor function and asking SakuraApi to give you back its singleton instance of that constructor function\).
* Constructor parameters must be other `@Injectable` decorated services. Any other type of parameter will throw an error.

## SapiInjectableMixin\(\)

Note above that the `NumberService` example class is decorated with `@Injectable` and it extends `SapiInjectableMixin()`. This is how TypeScript is made aware of the typing for `NumberService` for the functionality that's mixed in when `NumberService` is instantiated.

You can find the source code for `SapiInjectableMixin` [here](https://github.com/sakuraapi/api/blob/develop/src/core/%40injectable/sapi-injectable-mixin.ts). You'll see that TypeScript is made aware of the following mixin functionality:

```text
static sapi: SakuraApi;
static sapiConfig: any;

sapi: SakuraApi;
sapiConfig: any;
```

This means you can access the `@Injectable` service's instance of SakuraApi with the `sapi` property on the constructor function or the instance:

```text
@Injectable()
class NumberService extends SapiInjectableMixin() {

    example() {
        if(this.sapi === NumberService.sapi) {
            console.log('this is true');
        }
    }
}
```

The `sapiConfig` property is just a shortcut to `sapi.config`.

## Options

`@Injectable()` has no options.

## Use

`@Injectable` classes are injected into other services, models, and routables via their constructors. For example:

```text
@Injectable()
export class NumberService extends SapiInjectableMixin() {
    private index = 0;
    next(): number {
        return index++;
    }
}

@Injectable()
export class SumService extends SapiInjectableMixin() {
    private index = 0;
    next(): number {
        return -1 * index++;
    }
}

@Injectable()
export class CombinedService extends SapiInjectableMixin() {
    constructor(private nns: NegativeNumberService,
                private ns: NumberService) {
        super();
    }

    next(): number {
        return this.nns.next() + this.ns.next();
    }
}
```

The preceding contrived example has three services: `NumberService`, `NegativeNumberService`, `SumService`. `NumberService` and `NegativeNumberService` are injected into `CombinedService` via its constructor.

Remember, `@Injectable()` services are singletons \(there will only ever be one instance of each service\), and they must each be registered with SakuraApi when it is being instantiated via its `providers` option.

You must be careful to avoid creating circular dependencies \(this is usually a bad smell that indicates some more fundamental design issue\). However, if a circular dependency is unavoidable, you can work around it by manually getting instances of your services with the SakuraApi `getProvider` method. See [Resolving Circular Dependencies](../appendices/circular-di.md).

## Overriding / Mocking Services

It is sometimes desirable to override a service with an alternative service \(for example, when mocking a service for testing\). When you do this, make sure your alternative service sufficiently meets the interface needs of the original service or you're going to have runtime errors. Here's how you override a service:

```text
const sapi = new SakuraApi({
    providers: [
        { for: SomeOriginalService, use: SomeAlternativeService }
    ]
});
```

With the code above, anywhere in your application \(or tests\) where `SomeOriginalService` is being requested, SakuraApi will provide `SomeAlternativeService` instead.

## Inheritance

`@Injectable` decorated classes can inherit from other classes or other `@Injectable` decorated services. For example:

```text
@Injectable()
export class MammalService extends SapiInjectableMixin() {
    hasHair = true;

    feedOffspring() {
        console.log('feeding');
    }
}

@Injectable()
export class DogService extends SapiInjectableMixin(MammalService) {
    hasLegs = true;

    bark() {
        console.log('woof');
    }
}

@Injectable()
export class PetService extends SapiInjectableMixin() {
    constructor(private dogService: DogService) {
    }

    run() {
        if(this.dogService.hasLegs) {
            console.log('Running!');
        } else {
            this.dogService.bark();
        }
    }

    pet() {
        if(this.dogService.hasHair) {
            console.log('the hairy dog is happy');
        } else {
            console.log('the bald dog is happy');
        }
    }
}
```

Note that the base class does not have to be decorated with `@Injectable`. The final class that will be used, however, must be decorated with `@Injectable` if you plan to use it as an injectable service. Decorators are not inherited. Also note that if you inherit from another `@Injectable` decorated class, then all classes decorated with `@Injectable` must be declared when instantiating SakuraApi via its constructor's `provider` option.


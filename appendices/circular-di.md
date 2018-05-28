# circular-di

## Overview

Imagine you have a Service `A` and you have a service `B` and `A` depends on methods of `B` and vice-versa:

```text
@Injectable()
export class A extends SapiInjectableMixin() {
    constructor(private b: B) {
        super();
    }

    doSomething() {
        console.log(this.b.someData());
    }

    someOtherData() : string {
        return 'a related data';
    }
}

@Injectable()
export class B extends SapiInjectableMixin() {
    constructor(private a: A) {
        super();
    }

    doSomething() {
        console.log(this.a.someOtherData());
    }

    someData() : string {
        return 'b related data';
    }
}
```

Depending on what version of SakuraApi you're using, you're going to get some kind of error that looks a little like this:

```text
Error: Unable to inject undefined into A. Only classes decorated with '@Injectable' can be passed into the A constructor.
```

\[Note: until [122](https://github.com/sakuraapi/api/issues/122) is resolved, it will actually throw an error stating that it cannot read property of undefined error\]

Clearly both `A` and `B` are decorated with `@Injectable`. The error indicates a possible circular dependency.

There are a few strategies for resolving a circular dependency.

## Extract Common Functionality Into A New Service

If `A` and `B` both depend on each other's functionality, but that functionality is not essential to `A` or to `B` \(i.e., the functionality can live apart from the service in which it currently lives\), then extraction is a viable solution.

Consider this:

```text
@Injectable()
export class A extends SapiInjectableMixin() {
    constructor(private b: B) {
        super();
    }

    foo() {
        console.log('foo');
    }

    doSomething() {
        this.foo();
        this.b.bar();
    }
}

@Injectable()
export class B extends SapiInjectableMixin() {

    constructor(private a: A) {
        super();
    }

    bar() {
        console.log('bar');
    }

    doSomething() {
        this.bar();
        this.a.foo();
    }

}
```

With a little work, `Foo` and `Bar` can be extracted from their respective services to form a third service \(`C`\) upon which `A` and `B` depend:

```text
@Injectable()
export class A extends SapiInjectableMixin() {
    constructor(private c: C) {
        super();
    }

    doSomething() {
        this.c.foo();
        this.c.bar();
    }
}

@Injectable()
export class B extends SapiInjectableMixin() {
    constructor(private c: C) {
        super();
    }

    doSomething() {
        this.c.foo();
        this.c.bar();
    }
}

@Injectable()
export class C extends SapiInjectableMixin() {
    bar() {
        console.log('bar');
    }

    foo() {
        console.log('foo');
    }
}
```

## Manually Injecting Dependencies

It may not always be possible to cleanly extract functionality into a third service. If that ends up being the case, you can manually inject dependencies.

Consider:

```text
@Injectable()
export class A extends SapiInjectableMixin() {
    private data = 'foo';

    constructor(private b: B) {
        super();
    }

    foo() {
        console.log(this.data);
    }

    doSomething() {
        this.foo();
        this.b.bar();
    }
}

@Injectable()
export class B extends SapiInjectableMixin() {
    private data = 'bar';

    constructor(private a: A) {
        super();
    }

    bar() {
        console.log(this.data);
    }

    doSomething() {
        this.bar();
        this.a.foo();
    }

}
```

Unlike the prior scenario, both `A` and `B`'s methods depend on internal state from their respective services.

Solution:

```text
 @Injectable()
 export class A extends SapiInjectableMixin() {
     private data = 'foo';

     foo() {
         console.log(this.data);
     }

     doSomething() {
        const b = this.sapi.getProvider(B);

        this.foo();
        b.bar();
     }
 }

 @Injectable()
 export class B extends SapiInjectableMixin() {
     private data = 'bar';

     constructor(private a: A) {
         super();
     }

     bar() {
         console.log(this.data);
     }

     doSomething() {
         const a = this.sapi.getProvider(A);

         this.bar();
         a.foo();
     }

 }
```

Since the constructors of the codependent services do not reference each other, the dependency injection system is able to instantiate the singleton instance of each Service independent of its concerns about the other service.

## Why?

When you pass a service into the constructor of an `@Injectable`, `@Model` or `@Routable` class, you are asking the dependency injection system \(DI\) to retrieve its singleton instance of the service so that it can be passed in. It's important to note that though you are passing in the constructor function for a class \(`B`\) for example, what actually gets passed in is a singleton instance of that class that's lazy instantiated buy the DI system on first use. For example:

```text
 @Injectable()
 export class A extends SapiInjectableMixin() {
     constructor(private b: B) {
         super();
     }
 }

 @Injectable()
 export class B extends SapiInjectableMixin() {
     constructor(private a: A) {
         super();
     }
 }
```

When `B` is first called upon, it will be instantiated by the DI system, which calls the constructor function. The DI system sees that `B` requires `A`, so it checks to see if it has an instance of `A`. But it doesn't yet, since `A` has never been used. So, it attempts to instantiate `A` so it can pass it into `B`. But then the DI system notices it doesn't have an instance of `B` yet, which `A` requires. And so it attempts to instantiate `B`, which requires `A`, and so the circle continues.

The extraction solution simply creates a service `C` that both `A` and `B` depend on, while not depending on them. So when `A` is instantiated, the DI system checks to see if it has an instance of `C`. It does not, so it creates its singleton for `C` then passes it into `A`. When `B` is instantiated, the DI system checks to see if it has an instance of `C`. It does, do it simply passes its singleton of `C` into B. No circles. No problem.

Manual dependency injection solves the problem by a different approach:

```text
 @Injectable()
 export class A extends SapiInjectableMixin() {
     constructor(z: Z) {
         super();
     }
 }

 @Injectable()
 export class B extends SapiInjectableMixin() {
     constructor(y: Y) {
         super();
     }
 }
```

When `A` is instantiated, its dependencies are injected following the process described above. No circular dependencies arise, so `A`'s constructor function is successful. The same occurs with `B`. The DI system now has `A` and `B` instantiated. When one of `B`'s methods manually injects `A`, even if the DI system has yet to lazy instantiate `A`, there will be no problem because `A`'s constructor has no circular references. So, `A` will be instantiated and `B` will be able to use it.

All the DI system cares about is that it is able to instantiate each service upon first use \(lazy instantiation\). It doesn't care what the order is. As your application executes, it will eventually have all of its services instantiated. So long as there are no circles or anything preventing a service's constructor function from completing, the service will be available upon first use.


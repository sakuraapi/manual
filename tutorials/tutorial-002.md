# Tutorial-002

## SakuraApi

## Lesson 2 - Coin Jar

For this lesson I created the test API that I started in the last lesson and I'm going to do something with it. You might have wondered why it was a JarAPI and what that meant. This little project is going to be a coin jar, where you can query the number of coins in the jar, and add to the jar.

This might be a reward Jar for my kids, where if they do their chores they get a virtual coin. And when we reach a threshold, we could go get a treat. ![](https://github.com/sakuraapi/manual/tree/6c9ec65cded10a6acaa838a1fc191abf62621e23/tutorials/.Tutorial-2_images/de67fc37.png)

Or this could be a swear jar. So when someone on the team lets loose with a stream of unsavory language. That person will have to put coins in the jar. And maybe when the jar reaches a certain threshold, that person has to give the team a \*&^%ing party.  
![](https://github.com/sakuraapi/manual/tree/6c9ec65cded10a6acaa838a1fc191abf62621e23/tutorials/.Tutorial-2_images/1a93b606.png)

Code for these examples are checked into [candleshine/coin-jar](https://github.com/candleshine/coin-jar)

### Adding a JarService

The Jar Service will control the data for the jar. There is only one variable, a number, we'll call it coins. There's only one method, some way to increment that number.

Here's the code for the JarService. I'm putting it in services/jar-service.ts

```typescript
import {
  Injectable,
  SakuraApi,
  SapiInjectableMixin
} from '@sakuraapi/api';
import {LogService} from './log-service';

export {SakuraApi};

@Injectable()
export class JarService extends SapiInjectableMixin() {

  coins = 0;
  private config: any;
  private log: LogService;

  constructor() {
    super();
  }

  addCoins(increment?: number) {
    this.coins += increment || 1;
    // this.log.info('Adding ' + increment + '\n total now ' + this.coins);
    return this.coins;
  }
}
```

#### Using the JarService

Let's modify our API output to use the service. That means some additions to `jar.api.ts`

```typescript
import {JarService} from '../services/jar-service';
```

and

```typescript
 async defaultHandler(req: Request, res: Response): Promise<void> {
    const locals = res.locals as IRoutableLocals;
    const jarService = new JarService(JarApi.sapi);

    try {
      locals
        .send(OK, {
          coins: jarService.coins
        });
    }
```

What we're doing here is we're declaring a variable that is an instance of the JarService called jarService. And then we'll use it.

Now when we run `npm start` we will be able to browse or Postman to `http://localhost8001/api/jar` and see a different message

```javascript
{"coins":0}
```

Did that work? It is getting the data to output from the jarService.

#### Modify JarApi to handle Post request

First we're going to modify the API to accept a POST request. The URL we'll hit will look like [http://localhost:8001/api/jar/add/1](http://localhost:8001/api/jar/add/1). The way we do that is to add a new Route to the _**jar.api.ts**_ file. It will look something like this.

```typescript
  @Route({
    method: 'post',
    path: 'add/:coins'
  })
  async postHandler(req: Request, res: Response, next: NextFunction) {
    await this.defaultHandler(req, res);
    next();
  }
```

For now we'll use the defaultHandler to process this request. Let's see if it worked. Point Postman at the new URL [http://localhost:8001/api/jar/add/1](http://localhost:8001/api/jar/add/1) and remember to change the method from **GET** to **POST**. If you forget you won't get the results you are expecting.

![](https://github.com/sakuraapi/manual/tree/6c9ec65cded10a6acaa838a1fc191abf62621e23/tutorials/.Tutorial-2_images/cb0361b9.png)

#### Modify JarApi to use increment function

Quite a few changes are going to need to happen. The JarService needs to be instantiated in the constructor of the API, not in the default handler. We're going to remove this line.

```typescript
const jarService = new JarService(JarApi.sapi);
```

This jarService variable will, instead, be a private member of the jarApi object. Let's put it above the contructor, and update the constructor to initialize it.

```typescript
  private jarService: JarService;

  constructor(private log: LogService) {
    super();
    this.jarService = new JarService(JarApi.sapi);
  }
```

Now let's add the incrementHandler.

```typescript
  async incrementHandler(req: Request, res: Response): Promise<void> {
    const locals = res.locals as IRoutableLocals;

    try {
      locals
        .send(OK, {
          coins: this.jarService.addCoins()
        });
    } catch (err) {
      locals
        .send(SERVER_ERROR, {
          error: 'SERVER_ERROR'
        });
      this.log.error(err);
    }
```

At this time we'll increment by 1, eventually we'll see if we can increment by a value.

Now let's change the postHandler to call incrementHandler instead of defaultHandler.

```typescript
 async postHandler(req: Request, res: Response, next: NextFunction) {
    await this.incrementHandler(req, res);
    next();
  }
```

#### Test increment

With the server running, visit [http://localhost:8001/api/jar/add/1](http://localhost:8001/api/jar/add/1) in Postman. Again make sure your method is POST.  
Now with each push of the **Send** button you will get a new coin into your jar. And we're that much closer to our @\#$ing party.

#### Incrememnt by more than 1

We had set the path in our post Route to be

```typescript
path: 'add/:coins'
```

That `:coins` is a Route Parameter. It should be familiar to Angular Developers. The system will accept anything in the URL and treat the stuff after `/add/` as a string. Let's store it first.

Inside the incrementHandler

```typescript
const incCoins: number = +req.params.coins;
```

That unary **+** operator is used to convert the string into a number in an elegant way. The nice thing is that non-number strings being passed into this API will be counted as '1'. If you want it to do something else with that, you'll have to implement it.

We almost forgot to use the `incCoins` variable in our `addCoins` call.

```typescript
 try {
      locals
        .send(OK, {
          coins: this.jarService.addCoins(incCoins)
        });
      }
```

#### Test new version

Postman to **\_**[http://localhost:8001/api/jar/add/1](http://localhost:8001/api/jar/add/1) works as before. **\_**[http://localhost:8001/api/jar/add/2](http://localhost:8001/api/jar/add/2) adds 2. **\_**[http://localhost:8001/api/jar/add/2million](http://localhost:8001/api/jar/add/2million) adds 1. **\_**[http://localhost:8001/api/jar/add/hi](http://localhost:8001/api/jar/add/hi) adds 1. **\_**[http://localhost:8001/api/jar/add/-5](http://localhost:8001/api/jar/add/-5) subtracts 5.

Code for a working version of this example can be found at [candleshine/coin-jar](https://github.com/candleshine/coin-jar) on the example-2 branch.

Next lesson will have us persisting the data in a MongoDB


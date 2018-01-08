# SakuraApi
# Lesson 2 - Coin Jar

For this lesson I created the test API that I started in the last lesson and I'm going to do something with it.  You might have wondered why it was a JarAPI and what that meant.   This little project is going to be a coin jar, where you can query the number of coins in the jar, and add to the jar.  

This might be a reward Jar for my kids, where if they do their chores they get a virtual coin. And when we reach a threshold, we could go get a treat. ![](.Tutorial-2_images/de67fc37.png)  

Or this could be a swear jar.  So when someone on the team lets loose with a stream of unsavory language.  That person will have to put coins in the jar. And maybe when the jar reaches a certain threshold, that person has to give the team a *&^%ing party.  
![](.Tutorial-2_images/1a93b606.png) 

Code for these examples are checked into [candleshine/coin-jar](https://github.com/candleshine/coin-jar)

## Adding a JarService

The Jar Service will control the data for the jar.  There is only one variable, a number, we'll call it coins.  There's only one method, some way to increment that number.

Here's the code for the JarService.  I'm putting it in services/jar-service.ts

```typescript
import {SakuraApi} from '@sakuraapi/api';
import {LogService} from './log-service';

export class JarService {

  coins = 0;
  private config: any;
  private log: LogService;

  constructor(private sapi: SakuraApi, options?: any) {
    this.config = this.sapi.config.jar;
  }

  addCoins(increment?: number) {
    this.coins += increment || 1;
    this.log.info('Adding ' + increment + '\n total now ' + this.coins);
  }
}

```  

Let's modify our API output to use the service.  That means some additions to `jar.api.ts`

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
```

What we're doing here is we're declaring a variable that is an instance of the JarService called jarService.  And then we'll use it.  

Now when we run `npm start` we will be able to browse or Postman to `http://localhost8001/api/jar` and see a different message

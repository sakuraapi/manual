# Webstorm-debug

_**Debug sakuraapi project right from webstorm**_

Debug from webstorm will save a lot time than traditional console logs.

Here is the list of steps to configure and debug your sakuraapi project.

1.Click on `Run` select `Edit configurations`.

![](../.gitbook/assets/image6.png)

2.Click on `+` to create a new configuration and select js.

![](../.gitbook/assets/image2.png)

3.`Name` Your configuration. Ex: "ts debug"

4.Select `Node Interpreter` configuration from drop down.

5.Select init `javascript file`. Ex: "dist/src/index.js" for sakuraapi project.

6.Click on `apply` and `ok`.

Voila! , Now your "ts debug"configuration is ready.

**How to debug a sakuraapi project from Webstorm.**

1\)Once "ts debug" is ready, start your project in debug mode by clicking on bug symbol.

![](../.gitbook/assets/image4.png)

2\)Your sakuraapi project running in debug mode.set a breakpoint by clicking on empty space beside code.

![](../.gitbook/assets/image3.png)

3\)Hit that route in browser , you can see a hit to your breakpoint

![](../.gitbook/assets/image5.png)

4\)You can see all the required information at that debug point.you can play with resume , step-in, step-out ,next-line and restart .

![](../.gitbook/assets/image1.png)

That's all folks


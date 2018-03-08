**_Debug sakuraapi project right from webstorm_**

Debug from webstorm will save a lot time than traditional console logs.

Here is the list of steps to configure and debug your sakuraapi project.

1.Click on `Run` select `Edit configurations`.

 ![](./../images/.Webstorm-debug_images/image6.png)

2.Click on `+` to create a new configuration and select js.

 ![](./../images/.Webstorm-debug_images/image2.png)


3.`Name` Your configuration. Ex: &quot;ts debug&quot;

4.Select `Node Interpreter` configuration from drop down.

5.Select init `javascript file`. Ex: &quot;dist/src/index.js&quot; for sakuraapi project.

6.Click on `apply` and `ok`.

Voila! , Now your &quot;ts debug&quot;configuration is ready.

**How to debug a sakuraapi project from Webstorm.**

1)Once &quot;ts debug&quot; is ready, start your project in debug mode by clicking on bug symbol.

 ![](./../images/.Webstorm-debug_images/image4.png)

2)Your sakuraapi project running in debug mode.set a breakpoint by clicking on empty space beside code.

 ![](./../images/.Webstorm-debug_images/image3.png)

3)Hit that route in browser , you can see a hit to your breakpoint

 ![](./../images/.Webstorm-debug_images/image5.png)

4)You can see all the required information at that debug point.you can play with resume , step-in, step-out ,next-line and restart .

 ![](./../images/.Webstorm-debug_images/image1.png)

That&#39;s all folks

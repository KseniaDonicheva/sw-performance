# Description
This an multi-page application (MPA) based on Nunjucks templating system. Usually an MPA employs servers-side rendering, where every time a navigation request is made, the HTML is rendered ready on the server and sent to the client.

The Service Worker does the precaching for static elements of the page and serves them from cache for the next request. Also the Service Worker puts together a request response by combining static and dynamic elements of the page. Additionally the response is put through the Transform Stream (represented as Readable and Writable in the code) in order to accelerate the rendering time.

# Test procedure
### Start the test
- __Important before each test (!)__ : remove the old Service Worker from browser. Or tick the option "update on reload" in Chrome. 
- Start the server: `node app.js`
- Run test file: `node runPerfTest.js`
- Test results are written to `perfData.json`
---------------------------------------
### Set-up
- User Profile: First Time User only
- Each time the app goes through the following cycle:
    - Initial request - Home Page (Cache warm-up)
    - Navigation request - Content1 (SW composite response)
---------------------------------------
- Launch localhost:3000
- Wait 5 seconds
- Await console log
- Go to localhost:3000/content1
- Wait 5 seconds
- Await console log
- Close browser
--------------------------------------
-  Each test is repeated N times (N=50)
--------------------------------------
### Metrics
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Page Load Complete 


### Test results
folder /tests


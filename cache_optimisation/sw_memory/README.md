# Description
Images are imported through <img> Element. After the reload images are served from Memory Cache.

# Test procedure
### Start the test
- Start the server: `http-server .`
- Run test file: `node runPerfTest.js`
- Test results are written to `perfData.json`
---------------------------------------
### Set-up
- __Important before each test (!)__ : remove the old Service Worker from browser. Or tick the option "update on reload" in Chrome. 
- Each test contains 2 cycles: Cache warm-up (First Time User) / Cached response (Returning User)
-----------------------
- Launch localhost:8080
- Wait 10 seconds
- Await console log
- Reload page (`waitUntil: [networkidle0]`)
- Wait 10 seconds
- Await console log
- Close Browser
-------------
- The test is repeated N times (N=50)
### Metrics

__perf.js__
- First Contentful Paint
- Resource Timing (`[ResponseEnd] - [FetchStart]`)
- Page Load Complete

### Test results
folder /tests
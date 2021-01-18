# Description
Image is served through HTML select element. Select element is used after the DOM is fully loaded. The goal of this experiment is to measure the image resource timing under different network conditions.

# Test procedure
### Start the test
- Start the server: `http-server .`
- Run test file: `node runPerfTest.js`
- Test results are written to `perfData.json`
---------------------------------------
### Set-up
- __Important before each test (!)__ : remove the old Service Worker from browser. Or tick the option "update on reload" in Chrome. 

- _1st Test: "Good" Network ( 4G )_ (`Regular4g` in Puppeteer)
- _2nd Test: "Average" Network ( 3G )_ (`Regular3g` in Puppeteer)
- _3d Test: "Bad" Network ( 2G and lower )_ (`Regular2g` in Puppeteer)

-  In case of SW regulating image loading, the images will be fetched from specified directory according to available network speed.
    - 2G: image size: 28,3KB
    - 3G: image size: 53,9KB
    - 4G: image size: 61,3KB

-  This experiment employs a case of conditioned precaching: if during the initial loading bad connection is detected, the low quality image is precached during the install event, to be served from cache if network sustaines. In case of "good" network, the image is fetched as usual.
--------------------------------------
- Launch localhot:8080 (`WaitforTarget('service_worker')`)
- Enable network throttling (`Network.emulateNetworkConditions`)
- Wait 3 seconds
- Select item
- Wait 10 seconds
- Get Resource Timing
- Await console log
- Close browser
--------------------------------------
-  Each test is repeated N times (N=50)
---------------------------------------
### Metrics
- Resource Timing (`[ResponseEnd] - [FetchStart]`)

### Test results
folder /tests
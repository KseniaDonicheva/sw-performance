# Description
This is an example of Service Worker functioning as a load balancer for multiple server instances. The system arcitecture is similar to the example from Mozilla's ServiceWorker Cookbook: https://serviceworke.rs/load-balancer.html; it is, however enhanced with a simple Round Robin distributer. That forwards request to the next server in line.  

# Test procedure
### Start the test
- __Important before each test (!)__ : remove the old Service Worker from browser. Or tick the option "update on reload" in Chrome. 
- Start the main thread: `http-server .`
- Start application server: `/server node server.js 0`. Max number of server specified in this installation - 3 (starting with 0)
- Run test file: `node runPerfTest.js`
- Test results are written to `perfData.json`

### Set-up
- Launch localhot:8080
- Wait 5 seconds
- Select item 1
- Wait 5 seconds
- Await console log
- Select item 2
- Wait 5 seconds
- Await console log
- Select item 3
- Await console log
- Close browser

### Metrics
- SW Script duration with User Timing API, measuring from fetch request (sw.js line 65), until the response is loaded (sw.js line 33)

### Test results
folder /tests

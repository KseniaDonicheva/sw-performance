window.onload = function () {
 
  function showLoadTime() {
    const observer = new window.PerformanceObserver(list => {
      var perfEntry = list.getEntries();
      list.getEntries().forEach(entry => {
        properties = ["loadEventStart", "fetchStart"];
        var loadEventEnd = entry[properties[0]];
        var navigationStart = entry[properties[1]];
        var totalLoadTime = loadEventEnd - navigationStart;
        // first rendering time + DOM parsing time + synch JS execution + resource loading time
       console.log('\n' + "Page full load time: " + totalLoadTime.toFixed(4));
      }) 

    });
    observer.observe({entryTypes: ["navigation"]})
  }
  var total = [];

  function print_PerformanceEntries() {

    // Use getEntriesByType() to just get the "resource" events
    var p = performance.getEntriesByType("resource");
    for (var i = 0; i < p.length; i++) {
      print_start_and_end_properties(p[i]);
    }
    var minTime = Math.min.apply(null, total);
    var maxTime = Math.max.apply(null, total);

   console.log('\n' +"min time:" + minTime.toFixed(4));
    console.log('\n' +"max time: " + maxTime.toFixed(4));
  }

  function print_start_and_end_properties(perfEntry) {
    if (perfEntry.initiatorType == "img") {
      // Print timestamps of the PerformanceEntry *start and *end properties 
      properties = ["connectStart", "connectEnd",
        "domainLookupStart", "domainLookupEnd",
        "fetchStart",
        "redirectStart", "redirectEnd",
        "requestStart",
        "responseStart", "responseEnd",
        "secureConnectionStart"
      ];
      var respEndValue = perfEntry[properties[9]];
      var fetchStartValue = perfEntry[properties[4]];
      var resVal = respEndValue - fetchStartValue;
      total.push(resVal);
      console.log('\n' +"resource timing:" + resVal.toFixed(4) + "ms");
    }
  }
  print_PerformanceEntries()
  showLoadTime()

}

const observer = new window.PerformanceObserver(list => {
  list.getEntries().forEach(({
    name,startTime
  }) => {
    console.log('\n' + `${name}` + " : " + `${startTime.toFixed(4)}` + "ms.");
  });
});
observer.observe({
  entryTypes: ['paint']
});
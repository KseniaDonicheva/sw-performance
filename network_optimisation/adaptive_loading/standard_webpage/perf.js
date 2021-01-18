
function print_PerformanceEntries(value) {
  // Use getEntriesByType() to just get the "resource" events
  var p = performance.getEntriesByType("resource");
  for (var i=0; i < p.length; i++) {
    print_start_and_end_properties(p[i]);
  }
  console.log(value)
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
                "secureConnectionStart"];

      console.log("resource initiator type:" + perfEntry.initiatorType)
      var respEndValue = perfEntry[properties[9]];
      var fetchStartValue = perfEntry[properties[4]];
      var resVal = respEndValue - fetchStartValue;
     console.log("resource timing:" + resVal.toFixed(4) + "ms");
     
}
}


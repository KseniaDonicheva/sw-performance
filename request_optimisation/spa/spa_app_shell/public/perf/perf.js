window.onload = function() {
function showPaintTimings() {
  if(window.performance) {
    let performance = window.performance;
    let performanceEntries = performance.getEntriesByType('paint');
    performanceEntries.forEach((performanceEntry) => {
      console.log('\n' + performanceEntry.name + " : " + performanceEntry.startTime.toFixed(4));
      });
  }

  const observer = new window.PerformanceObserver(list => {
    list.getEntries().forEach(({
      name,
      startTime
    }) => {
      //console.log('\n' + `${name}` + " : " + `${startTime.toFixed(4)}` + "ms.");
      console.log('\n' + `${startTime.toFixed(4)}`);
      // console.log('[showPaintTimingsResult]', JSON.stringify(list.getEntriesByType('paint')))
      });
    });
      observer.observe({
      entryTypes: ['paint']
      });
  }
  


function showPerEnt() {
  var perfEntries = performance.getEntriesByType("navigation");
  for (var i=0; i < perfEntries.length; i++) {
  
   // console.log("= Navigation entry[" + i + "]");
    var p = perfEntries[i];
    if (p.loadEventEnd > 0) {
      var earliestTime = p.navigationStart;
      if (earliestTime == 0) {
        earliestTime = t.fetchStart;
    }
   
    // dom Properties
    //console.log('\n' + "DOM content loaded = " + (p.domContentLoadedEventEnd - p.domContentLoadedEventStart) +'\n');
   // console.log('\n' + "DOM complete = " + p.domComplete );
    console.log('\n' + p.domComplete );
    //console.log('\n' +"DOM interactive = " + p.interactive );
    // console.log('\n' +"TTFB = " + (p.responseStart - p.fetchStart));
     console.log('\n' + (p.responseStart - p.fetchStart));
     //console.log(p.responseStart,  p.fetchStart, p.loadEventStart,  );
    // document load and unload time
    console.log('\n' + (p.loadEventStart - p.fetchStart));
    //console.log('\n' +"PageLoadTime = " + (p.loadEventStart - p.fetchStart));
    //console.log("document load = " + (p.loadEventEnd - p.loadEventStart) +'\n');
    //console.log("document unload = " + (p.unloadEventEnd - p.unloadEventStart) +'\n');
    
    // other properties
    //console.log("type = " + p.type +'\n');
    //console.log("redirectCount = " + p.redirectCount +'\n');
    //console.log('[showPerEntResult]', i, JSON.stringify(p))
  }
  else {
    setTimeout(showPerEnt, 1000);
}
  }
}


showPerEnt() 
showPaintTimings() 
  
}





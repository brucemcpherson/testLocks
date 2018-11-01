// this tests that what we wrote to both cache and properties are what we read back
function myTestcc () {
  
  var prop = PropertiesService.getScriptProperties();
  var cache = CacheService.getScriptCache();
  
  Logger.log('properties testing');
  testStuffcc ( 
    function (key, value) { 
      prop.setProperty(key,value) ; 
    } , 
    function (key) { 
      return prop.getProperty(key); 
    }
  );
  
  // test cache
  Logger.log('cache testing');
  testStuffcc ( 
    function (key, value) { 
      return cache.put(key,value); 
    } , 
    function (key) { 
      return cache.get(key); 
    }
  );
  
  // test properties

}

function testStuffcc (funcPut, funcGet) {

  var start = new Date().getTime();
  var key = "some key";
  var maxAttempts = 20;
  var waitTime = function () { return 20 + Math.random()*100 };
  
  for (var tries = 0 , attempts = 0, stale =0 ; tries < 20 ; tries ++ ) {
    // something to write
    var text = "tries " + tries + ":" + new Date().getTime();
    
    // write it out and keep trying till we get a match back

    funcPut(key,text)
    
    // keep trying till we get a match
    for (var result = "" ,i=0; text !== result && maxAttempts > i ; Utilities.sleep(waitTime()),i++) {
      result = funcGet(key);
      if (result && result !== text) { 
        stale++;
        Logger.log('stale:got ' + result + ' expected ' + text);
      }
      attempts ++;
    }
    
    if (i >= maxAttempts) Logger.log('gave up on try ' + tries + ' after ' + (i+1) + ' attempts');
  }
  Logger.log('average ms to register:' + (new Date().getTime() - start)/tries);
  Logger.log('average number of attempts:' + attempts/tries);
  Logger.log('average number of stale values:' + stale/attempts);
  
}
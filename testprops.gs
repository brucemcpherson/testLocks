// this tests that what we wrote to both cache and properties are what we read back
// I've updated this to use exponential backoff to deal with hitting prop service too hard
// library required is Mcbr-v4SsYKJP7JMohttAZyz3TLx7pV4j
function myTest () {
  
  var prop = PropertiesService.getScriptProperties();
  prop.deleteAllProperties();
  
  var cache = CacheService.getScriptCache();
  
  Logger.log('properties testing starting at ' + new Date().getTime());
  testStuff ( 
    function (key, value) { 
      prop.setProperty(key,value) ; 
    } , 
    function (key) { 
      return prop.getProperty(key); 
    }
  );
  
  // test cache
  Logger.log('cache testing starting at ' + new Date().getTime());
  testStuff ( 
    function (key, value) { 
      return cache.put(key,value); 
    } , 
    function (key) { 
      return cache.get(key); 
    }
  );
  
  // test properties

}

function testStuff (funcPut, funcGet) {

  var start = new Date().getTime();
  var key = "some key";
  var maxAttempts = 10;
  var waitTime = function () { return 20 + Math.random()*100 };
  
  for (var tries = 0 , attempts = 0, stale =0 ; tries < 50 ; tries ++ ) {
    // something to write
    var text = "tries " + tries + ":" + new Date().getTime();
    
    // write it out and keep trying till we get a match back

    cUseful.rateLimitExpBackoff(function () { 
      return funcPut(key,text);
     });
    
    // keep trying till we get a match
    for (var result = "" ,i=0; text !== result && maxAttempts > i ; Utilities.sleep(waitTime()),i++) {
      
      result = cUseful.rateLimitExpBackoff(function () { 
        return funcGet(key);
      });
      
      if (result && result !== text) { 
        stale++;
        Logger.log('stale:got ' + result + ' expected ' + text);
      }
      else if (!result) {
        Logger.log('null:got nothing expected ' + text);
      }
      else {
        //Logger.log('good:' + result);
      }
      attempts ++;
    }
    
    if (i >= maxAttempts) Logger.log('gave up on try ' + tries + ' after ' + (i+1) + ' attempts');
  }
  Logger.log('  number of attempts:' + attempts);
  Logger.log('  average ms to register:' + (new Date().getTime() - start)/tries);
  Logger.log('  average number of attempts:' + attempts/tries);
  Logger.log('  average number of stale values:' + stale/attempts);
  
  
}


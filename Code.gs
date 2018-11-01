// this tests the lock service - should run many instances of this at the same time.
// in the end the value of the property should be number of instances * LOOPS
// and every read should return a higher value than the last
function testCacheLock() {
  
  var KEY = 'testlock';
  var WAIT = 30000;
  var LOOPS = 30;
  var myIndex = 0;
  var MINWAIT = 0;
  var instance = Math.round(Math.random()*10000);
  
  // get a  lock
 
  var cache = CacheService.getScriptCache();
  var lock = LockService.getScriptLock();
  for (var i = myIndex = 0; i < LOOPS ;i++) {
     
    // wait for it - will throw an error if fails to get one
    lock.waitLock(WAIT);
  
    // this is a property that co-operating processes will update - should always be more than the last time.
    var v = parseInt(cache.get (KEY) || 0, 10);
    
    // im updating it to this
    v++;
    
    // should always be more than the last time i saw it
    if (v <= myIndex) throw 'got ' + v + ' expected more than ' + myIndex;
    myIndex = v;
    
    // write back updated value
    cache.put(KEY, myIndex);
    
    // check it wrote it
    var w = parseInt(cache.get(KEY),10);
    if (w !== myIndex) throw 'wrote ' + myIndex + ' but read ' + w;
    
    // release the lock
    lock.releaseLock();
  
    // wait some random amount of time
    Utilities.sleep(Math.random() * 100 + MINWAIT);
  }


}
function myFunction() {
  
  var KEY = 'testlock';
  var WAIT = 30000;
  var LOOPS = 20;
  var myIndex = 0;
  var MINWAIT = 0;
  var instance = Math.round(Math.random()*10000);
  
  // get a  lock
 
  var prop = PropertiesService.getScriptProperties();
  var lock = LockService.getScriptLock();
  for (var i = myIndex = 0; i < LOOPS ;i++) {
     
    // wait for it - will throw an error if fails to get one
    lock.waitLock(WAIT);
  
    // this is a property that co-operating processes will update - should always be more than the last time.
    var v = parseInt(prop.getProperty(KEY) || 0, 10);
    
    // im updating it to this
    v++;
    
    // should always be more than the last time i saw it
    if (v <= myIndex) throw 'got ' + v + ' expected more than ' + myIndex;
    myIndex = v;
    
    // write back updated value
    prop.setProperty(KEY, myIndex);

    // and record when and what
    prop.setProperty (KEY+'log'+myIndex, {index:myIndex , when: new Date().getTime(), who: instance});
    
    // check it wrote it
    var w = parseInt(prop.getProperty(KEY),10);
    if (w !== myIndex) throw 'wrote ' + myIndex + ' but read ' + w;
    
    // release the lock
    lock.releaseLock();
  
    // wait some random amount of time
    Utilities.sleep(Math.random() * 100 + MINWAIT);
  }


}
function testNamedLock() {
  
  var KEY = 'testlock';
  var WAIT = 30000;
  var LOOPS = 30;
  var myIndex = 0;
  var MINWAIT = 0;
  var instance = Math.round(Math.random()*10000);
  
  // get a  lock
 
  var namedLock = new cNamedLock.NamedLock().setKey("some lock");
  var cache = CacheService.getScriptCache();
  
  for (var i = myIndex = 0; i < LOOPS ;i++) {
      
    // wait for it - will throw an error if fails to get one
    namedLock.protect("test", function () {
      // this is a property that co-operating processes will update - should always be more than the last time.
      var v = parseInt(cache.get (KEY) || 0, 10);
    
      // im updating it to this
      v++;
    
      // should always be more than the last time i saw it
      if (v <= myIndex) throw 'got ' + v + ' expected more than ' + myIndex;
      myIndex = v;
    
      // write back updated value
      cache.put(KEY, myIndex);
    
      // check it wrote it
      var w = parseInt(cache.get(KEY),10);
      if (w !== myIndex) throw 'wrote ' + myIndex + ' but read ' + w;

    });

    // wait some random amount of time
    Utilities.sleep(Math.random() * 100 + MINWAIT);
  }


}


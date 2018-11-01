function testFill () {
  

  //do my own property store
  var propStore = PropertiesService.getScriptProperties();
  bucket.fillProperties(propStore);
  
  // do the libraries own one
  bucket.fillProperties();

  // see how much is in each
  Logger.log('library has ' + Object.keys(bucket.myPropertyStore().getProperties()).length);
  Logger.log('script has ' + Object.keys(propStore.getProperties()).length);
}

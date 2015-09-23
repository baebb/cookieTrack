  $(function(){
        //init local storage
        storage = $.localStorage;
        //retreive data from stoarge if exist
        var udata = storage.get(userid);
        var user_data = udata && typeof(udata) === 'object' ? udata : JSON.parse(storage.get(userid)) || {};
        
        $('button').each(function(index, obj){
          if (user_data)
            CheckDependentObjects(obj.id, user_data);
           $(obj).on('click', function(){
              SaveEvent(obj, user_data);     
           });           
        });
  });
    
  function SaveEvent(obj, user_data) {
    //increment event count
    if (user_data.eventObjects &&  find(user_data.eventObjects, function(e){ return e.objId == obj.id})) {
      find(user_data.eventObjects, function(e){ return e.objId == obj.id}).eventCount += 1;  
    }
    else {
      if (!user_data.eventObjects){
        user_data.eventObjects = [];
      }    
      user_data.eventObjects.push({objId: obj.id, eventCount: 1});
    }
    UpdateUserData(user_data)
    CheckDependentObjects(obj, user_data);
  }

  function UpdateUserData(data){
    $.localStorage.set(userid, JSON.stringify(data));
  }  
  
  function CheckDependentObjects(obj, user_data) {
     var depOf = filter(eventObjectData, function(d) { return d.dependentObj;});
     
     //check evenet threshold of all dependent
     $.each(depOf, function(index,dep){
        var show = true;
        $.each(dep.dependentObj, function(index,d){
          var eod = find(eventObjectData, function(e) { return e.objId === d });
          var uObj = find(user_data.eventObjects, function(e){ return e.objId === d});
          if (!uObj || uObj.eventCount < eod.threshold)
              show = false;
        });
        if (show) {
          $('#' + dep.objId).removeClass('hidden');
        }
     })
     
      
  }
    
  //utillity functions to replace underscore dependency
  function find(collection, predicate){
      if (!collection) return null;
      
      var ret = null;
      collection.forEach(function(element) {
        if (!ret && predicate(element)) {
          ret = element;
        }
      });
      return ret;
  }
  
  function filter(collection, predicate){
      if (!collection) return [];

      var ret = [];
      $.each(collection, function(index, obj){
        if (predicate(obj)) {
          ret.push(obj);
        }
      })  
      return ret;
  }


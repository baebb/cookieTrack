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
    if (user_data.eventObjects &&  _.find(user_data.eventObjects, {objId: obj.id})) {
      _.find(user_data.eventObjects, {objId: obj.id}).eventCount += 1;  
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
     var depOf =_.filter(eventObjectData, function(d) { return d.dependentObj;});
     
     //check evenet threshold of all dependent
     _.each(depOf, function(dep){
        var show = true;
        _.each(dep.dependentObj, function(d){
          var eod = _.find(eventObjectData, function(e) { return e.objId === d });
          var uObj = _.find(user_data.eventObjects, function(e){ return e.objId === d});
          if (!uObj || uObj.eventCount < eod.threshold)
              show = false;
        });
        if (show) {
          $('#' + dep.objId).removeClass('hidden');
        }
     })
     
      
  }


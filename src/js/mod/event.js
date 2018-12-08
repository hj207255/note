var EventCenter = (function(){
  // 事件中心
  var events = {}
  // 向事件中心添加模块事件和对应处理函数
  function on(evt, handler){
    events[evt] = events[evt] || []
    events[evt].push({
      handler: handler
    })
  }
  // 执行事件中心内的自定义模块事件和对应处理函数
  function fire(evt, args){
    if(!events[evt]){
      return
    }
    for(var i=0; i<events[evt].length; i++){
      events[evt][i].handler(args)
    }
  }
  return {
    on: on,
    fire: fire
  }
})()

module.exports = EventCenter
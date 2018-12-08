require('less/toast.less')

var $ = require('../lib/jquery-2.0.3.min')

// 消息提示，传入消息体和显示时间
function toast(msg, time){
  this.msg = msg
  this.dismissTime = time||1000
  this.createToast()
  this.showToast()
}
toast.prototype = {
  // 创建消息体
  createToast: function(){
    var tpl = '<div class="toast">'+this.msg+'</div>'
    this.$toast = $(tpl)
    $('body').append(this.$toast)
  },
  // 展示消息体，并在一段事件后销毁
  showToast: function(){
    var self = this // 可以使用箭头函数
    this.$toast.fadeIn(300,function(){
      setTimeout(function(){
        self.$toast.fadeOut(300,function(){
          self.$toast.remove()
        })
      }, self.dismissTime)
    })
  }
}

function Toast(msg, time){
  return new toast(msg, time)
}

module.exports.Toast = Toast
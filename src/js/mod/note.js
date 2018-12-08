require('less/note.less')

var Toast = require('./toast.js').Toast
var Event = require('mod/event.js')

function Note(opts){
  this.initOpts(opts) // 初始化传入的参数
  this.createNote() // 创建 note 标签
  this.setStyle() // 设置标签样式
  this.bindEvent() // 绑定不同事件等
}

Note.prototype = {
  // 自定义 note 头部和内容颜色
  colors: [
    ['#ea9b35','#efb04e'], // headColor, containerColor
    ['#dd598b','#e672a2'],
    ['#eee34b','#f2eb67'],
    ['#c24226','#d15a39'],
    ['#c1c341','#d0d25c'],
    ['#3f78c3','#5591d2']
  ],

  // 初始化参数
  defaultOpts: {
    id: '',
    $ct: $('#content').length>0?$('#content'):$('body'), // 判断当前content容器内是否有内容
    context: 'input here' // 初始化note内容
  },

  // 初始化
  initOpts: function (opts){
    this.opts = $.extend({}, this.defaultOpts, opts||{}) // 没添加一个note就拓展一次
    if(this.opts.id){
      this.id = this.opts.id
    }
  },

  // 创建 note 标签
  createNote: function () {
    var tpl = `<div class="note">
                <div class="note-head">
                  <div class="nhr">
                    <span class="username"></span>
                    <span class="delete">&times;</span>
                  </div>
                </div>
                <div class="note-ct" contenteditable="true"></div>
              </div>`
    this.$note = $(tpl)
    // 设置该标签的内容和用户
    this.$note.find('.note-ct').html(this.opts.context)
    this.$note.find('.username').html(this.opts.username)
    this.opts.$ct.append(this.$note)
    if(!this.id){
      this.$note.css({
        'bottom':'10px',
        'opacity':'.8'
      })
    }
  },

  // 设置标签的样式
  setStyle: function(){
    var color = this.colors[Math.floor(Math.random()*6)]
    this.$note.find('.note-head').css('background-color', color[0])
    this.$note.find('.note-ct').css('background-color', color[1])
  },

  // 设置标签的位置，瀑布流
  setLayout: function(){
    var self = this
    if(self.clk){
      clearTimeout(self.clk)
    }
    self.clk = setTimeout(function(){
      Event.fire('waterfall')
    },100)
  },

  // 绑定事件等 
  bindEvent: function (){
    var self = this,
        $note = this.$note,
        $noteHead = $note.find('.note-head'),
        $noteCt = $note.find('.note-ct'),
        $delete = $note.find('.delete')

    // 标签的删除
    $delete.on('click', function(){
      self.delete()
    })

    // 标签得到焦点
    $noteCt.on('focus', function(){
      if($noteCt.html()=='input here'){
        $noteCt.html('')
      }
      $noteCt.data('before', $noteCt.html()) // 暂时在标签内存入数据
    }).on('blur paste', function(){ // 失焦 键盘快捷键黏贴或者使用鼠标右键黏贴的时候触发
      if($noteCt.data('before')!=$noteCt.html()){
        $noteCt.data('before', $noteCt.html())
        self.setLayout()
        if(self.id){ // 排除新建标签
          self.edit($noteCt.html()) 
        }else{
          self.add($noteCt.html())
        }
      }
    })

    // 
    $noteHead.on('mousedown', function(e){ 
      var evtX = e.pageX - $note.offset().left,
          evtY = e.pageY - $note.offset().top
      $note.addClass('draggable').data('evtPos', {x:evtX, y:evtY}) // 设置标签为可移动，并且记录其位置
    }).on('mouseup', function(){
      $note.removeClass('draggable').removeData('evtPos')
    })

    // 标签移动记录其位置；标签随鼠标移动
    $('body').on('mousemove', function(e){
      $('.draggable').length && $('.draggable').offset({
        top: e.pageY-$('.draggable').data('evtPos').y,
        left: e.pageX-$('.draggable').data('evtPos').x
      })
    })
  },

  // 更新note内容
  edit: function(msg){
    var self = this
    $.post('/api/notes/edit', {
      id: this.id,
      note: msg
    }).done(function(ret){
      if(ret.status === 0){
        Toast('update success')
      }else{
        Toast(ret.errorMsg)
      }
    })
  },

  // 添加 note
  add: function(msg){
    console.log('addd...')
    var self = this
    $.post('/api/notes/add', {note: msg})
      .done(function(ret){
        if(ret.status===0){
          Toast('add success')
        }else{
          self.$note.remove()
          Event.fire('waterfall')
          Toast(ret.errorMsg)
        }
      })
  },

  // 删除 note
  delete: function(){
    var self = this
    $.post('/api/notes/delete', {id: this.id})
      .done(function(ret){
        if(ret.status===0){
          Toast('delete success')
          self.$note.remove()
          Event.fire('waterfall')
        }else{
          Toast(ret.errorMsg)
        }
      })
  }

}

module.exports.Note = Note
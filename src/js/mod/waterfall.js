/**
 * 瀑布流特点：
 * 1. 每一个单位，等宽不等高
 * 2. 且第n个在上一行最短的下一个位置上
 * 3. 每添加一个单元后要更新每一行数组的高度数组
 */


var WaterFall = (function(){
  var $ct
  var $items
  // 渲染函数
  function render($c){
    $ct = $c
    $items = $ct.children() // 获取到所有子元素
    var nodeWidth = $items.outerWidth(true), // 获取到外轮廓的宽度加margin
      colNum = Math.floor($(window).width()/nodeWidth), // 获取多少列
      colSumHeight = [] // 总高度

    console.log(nodeWidth)
    console.log($items.length)
    for(var i=0;i<$items.length;i++){
      if(i<colNum){
        $($items[i]).css({
          'left': i*nodeWidth,
          'top': '0'
        })
        colSumHeight.push($($items[i]).outerHeight(true))
        console.log(colSumHeight)
      }else{
        var minH=Math.min.apply(null,colSumHeight)
        console.log(minH)
        var indexH=colSumHeight.indexOf(minH)
        console.log(indexH)
        $($items[i]).css({
          'left': indexH*nodeWidth,
          'top': minH
        })
        colSumHeight[indexH]+=$($items[i]).outerHeight(true)
      }
    }
  }
  

  $(window).on('resize', function(){
    render($ct)
  })

  return {
    init: render
  }
})()

module.exports = WaterFall
// 模拟100条0-100的随机数，作为柱状图的高度
var data = Array.apply(0, Array(100)).map(function() { 
   return Math.random() * 100;
   });
var margin = {top: 20,right: 20,bottom: 30,left: 50},    
	width = document.body.clientWidth - margin.left - margin.right,    
	height = 500 - margin.top - margin.bottom;
	
var chart = d3.select('body') 
	.append('svg')  
	.attr('width', width + margin.left + margin.right)  
	.attr('height', height + margin.top + margin.bottom)  
	.append('g') 
	.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
	
// 计算每根柱状物体的宽度
var barWidth = width / data.length;
// 用g作每根柱状物体的容器，意义可类比div
// 前一篇文章已经介绍过selectAll的意义，即生成占位符，等待填充svg图形
var bar = chart.selectAll('g') 
	.data(data)  
	.enter() 
	.append('g')  
// 接收一个数据填充一个g元素 
// 同时为g设置位置 
	.attr('transform', function(d, i) {    
								return 'translate(' + i * barWidth + ', 0)';  });
bar.append('rect') 
// 添加一个矩形 
	.attr('y', function(d) {  
						return height - d;  })  
	.attr('height', function(d) {   
							 return d;  })
	.attr('width', barWidth - 1);
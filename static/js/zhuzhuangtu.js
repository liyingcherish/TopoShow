// JavaScript Document
//产生100个随机数作为柱状图的高度
var data = Array.apply(0,Array(100)).map(function(){
   return Math.random()*100;});
//创建SVG容器
var margin = {top: 20,right: 20,bottom: 30,left: 50};
var width = document.body.clientWidth - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

//chart是最终建立的容器
var chart = d3.select('body')
	.append('svg')
	.attr('width',document.body.clientWidth)
	.attr('height',500)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
	
//开始往容器里面放元素，画柱状图

//计算没跟柱状物体的宽度
var barWidth = width / data.length;
//用g作为没跟柱状物体的容器，意义可类比div
//selelctAll的意义：生成占位符，等待填充svg图形、
var bar = chart.selectAll('g')
    .data(data)
	.enter()
	.append('g')
//接收一个数据填充一个g 元素
//同时为g设置位置
	.attr('transform',function(d,i)
							   {
		return 'translate(' + i * barWidth + ', 0)';  });   
	
bar.append('rect')
//添加一个矩形
	.attr('y',function(d){
		return height-d;		})
	
	.attr('height',function(d)	{
		return d;		})
	.attr('width', barWidth - 1)
	.style('fill',function(d){
						   if(d>=50)
						   return 'red';
						   else if(d>40&&d<50)
						   return 'green';
						   else return 'blue';
						   
						   });
	
	
	
		

//添加坐标轴	
/*var x = d3.scale.linear()
	.domain([0,d3.max(data)])
	.range([0,width]);	
var y = d3.scale.linear()
	.domain([0,d3.max(data)])
	.range([height,0]);
var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom')
	.ticks(1);
var yAxis=d3.svg.axis()
	.scale(y)
	.orient('left');

chart.append('g')
	.attr('class','x axis')
	.attr('transform','translate(0,'+height+')')
	.call(xAxis);

chart.append('g')
	.attr('class','y axis')
	.call(yAxis)*/



    
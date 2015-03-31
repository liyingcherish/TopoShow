// JavaScript Document
//����100���������Ϊ��״ͼ�ĸ߶�
var data = Array.apply(0,Array(100)).map(function(){
   return Math.random()*100;});
//����SVG����
var margin = {top: 20,right: 20,bottom: 30,left: 50};
var width = document.body.clientWidth - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

//chart�����ս���������
var chart = d3.select('body')
	.append('svg')
	.attr('width',document.body.clientWidth)
	.attr('height',500)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
	
//��ʼ�����������Ԫ�أ�����״ͼ

//����û����״����Ŀ��
var barWidth = width / data.length;
//��g��Ϊû����״�������������������div
//selelctAll�����壺����ռλ�����ȴ����svgͼ�Ρ�
var bar = chart.selectAll('g')
    .data(data)
	.enter()
	.append('g')
//����һ���������һ��g Ԫ��
//ͬʱΪg����λ��
	.attr('transform',function(d,i)
							   {
		return 'translate(' + i * barWidth + ', 0)';  });   
	
bar.append('rect')
//���һ������
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
	
	
	
		

//���������	
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



    
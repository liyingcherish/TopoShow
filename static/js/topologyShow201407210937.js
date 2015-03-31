function Topology(ele){
    typeof(ele)=='string' && (ele=document.getElementById(ele));
    var w=ele.clientWidth,
        h=ele.clientHeight/2,
        self=this;
    this.force = d3.layout.force().gravity(0.5).distance(200).charge(-100).size([w, h]);
    this.nodes=this.force.nodes();
    this.links=this.force.links();

    this.clickFn=function(){};
    this.vis = d3.select(ele).append("svg:svg")
                 .attr("width", w).attr("height", h).attr("pointer-events", "all");

    this.force.on("tick", function(x) {
      self.vis.selectAll("g.node")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      self.vis.selectAll("line.link")
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
          
    });
	
}
var c=1;
function shijian()
{
 var timeDiv=document.getElementById("time");
 var date=new Date();
 var year=date.getFullYear();
 var month=date.getMonth();
 month=month+1;
 var day=date.getDate();

 var hours=date.getHours();
 var minutes=date.getMinutes();
 var seconds=date.getSeconds();
 if(minutes<=9)
 minutes="0"+minutes;
 if(seconds<=9)
 seconds="0"+seconds;
 timeshow="<font class='b'>"+year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds+"</font>";
 //test="nihao";
 timeDiv.innerHTML=timeshow;
 if(c==1)
 {
  setTimeout("shijian()",1000);
 }
}
shijian();





Topology.prototype.doZoom=function(){
    d3.select(this).select('g').attr("transform","translate(" + d3.event.translate + ")"+ " scale(" + d3.event.scale + ")");

}


//增加节点
Topology.prototype.addNode=function(node){
    this.nodes.push(node);
}



Topology.prototype.addNodes=function(nodes){
    if (Object.prototype.toString.call(nodes)=='[object Array]' ){
        var self=this;
        nodes.forEach(function(node){
            self.addNode(node);
        });

    }
}

//增加连线
Topology.prototype.addLink=function(source,target,color){
    this.links.push({source:this.findNode(source),target:this.findNode(target),color:color});
}

//增加多个连线
Topology.prototype.addLinks=function(links){
    if (Object.prototype.toString.call(links)=='[object Array]' ){
        var self=this;
        links.forEach(function(link){
            self.addLink(link['source'],link['target'],link['color']);
        });
    }
}


//删除节点
Topology.prototype.removeNode=function(id){
    var i=0,
        n=this.findNode(id),
        links=this.links;
    while ( i < links.length){
        links[i]['source']==n || links[i]['target'] ==n ? links.splice(i,1) : ++i;
    }
    this.nodes.splice(this.findNodeIndex(id),1);
}

//删除节点下的子节点，同时清除link信息
Topology.prototype.removeChildNodes=function(id){
    var node=this.findNode(id),
        nodes=this.nodes;
        links=this.links,
        self=this;

    var linksToDelete=[],
        childNodes=[];
    
    links.forEach(function(link,index){
        link['source']==node 
            && linksToDelete.push(index) 
            && childNodes.push(link['target']);
    });

    linksToDelete.reverse().forEach(function(index){
        links.splice(index,1);
    });

    var remove=function(node){
        var length=links.length;
        for(var i=length-1;i>=0;i--){
            if (links[i]['source'] == node ){
               var target=links[i]['target'];
               links.splice(i,1);
               nodes.splice(self.findNodeIndex(node.id),1);
               remove(target);
               
            }
        }
    }

    childNodes.forEach(function(node){
        remove(node);
    });

    //清除没有连线的节点
    for(var i=nodes.length-1;i>=0;i--){
        var haveFoundNode=false;
        for(var j=0,l=links.length;j<l;j++){
            ( links[j]['source']==nodes[i] || links[j]['target']==nodes[i] ) && (haveFoundNode=true) 
        }
        !haveFoundNode && nodes.splice(i,1);
    }
}



//查找节点
Topology.prototype.findNode=function(id){
    var nodes=this.nodes;
    for (var i in nodes){
        if (nodes[i]['id']==id ) return nodes[i];
    }
    return null;
}


//查找节点所在索引号
Topology.prototype.findNodeIndex=function(id){
    var nodes=this.nodes;
    for (var i in nodes){
        if (nodes[i]['id']==id ) return i;
    }
    return -1;
}
 
//节点点击事件
Topology.prototype.setNodeClickFn=function(callback){
    this.clickNodeFn=callback;
    
}
//连接点击事件
Topology.prototype.setLinkClickFn=function(callback){
    this.clickLinkFn=callback;
    
}
function creatDiv(obj)
{
	var queueDatas=new Array();
	var portNumbers=new Array();
	var queueData;
	
	$.ajax(
		{
		type:"GET",
		url:ip+"PortTable",
		datatype:"json",
		success:function(data){
			value=eval("("+data+")");
			//{id:'10.4.42.1',type:'router',status:1},
			for(i=0;i<value.tableSize;i++)
			{
				row=value.rows[i];
				if(row.portDp==obj.id)
				{
				
					portNumber=row.portNumber;
					portNumbers.push(portNumber);
					
					$.ajax(
						{
						type:"GET",
						url:ip+"QueueTable",
						datatype:"json",
						success:function(data1){
							//queueDatas=new Array();
							queueData=new Array();
							value1=eval("("+data1+")");
						    for(j=0;j<value1.tableSize;j++)
							{
								row1=value1.rows[j];
								if(row1.portNumber==portNumber)
								{
									queueData.push(row1.queueRate);
								}
								
							}
								queueDatas.push(queueData);
							
						},
					
						async:false
						}
							
					);
					}
					
				}
		  //var temp=value.rows;
			//showDpTable(value.rows);
		},
	
		async:false
		}
			
	);
	var topoDiv=$("#TopologyShow");
	var div=document.createElement("div");
	div.style.width=800;
	div.style.height=300;
	div.style.position="absolute";
	//div.style.left=0;
	div.style.bottom=0;
	//div.className="hello";
	div.id="queueGra";
	div.innerHTML=obj.id+"队列划分如下："
	div.style.border="1px solid #999999";
	
	
	topoDiv.append(div);

	div1=$("#queueGra");
	var queuediv=document.createElement("div");
	queuediv.style.width=300;
	queuediv.style.height=100;
	queuediv.style.position="absolute";
	queuediv.style.bottom="0px";
	queuediv.style.right="230px";
	
	
	queuediv.className="hello";
	queuediv.id="myDiv";
	div1.append(queuediv)
	
    if(queueDatas.length!=0)
	{
			var a=(1/queueDatas.length*0.95).toFixed(4);
			var childwidth=a.slice(2,4)+"."+a.slice(4,6)+"%";
			var width=a*300;
			for(k=0;k<queueDatas.length;k++)
				{
					
					var id="childDiv"+k;
					$("#myDiv").append("<div id="+id+" style='border-style:solid;border-width:1px;float:left; width:"+childwidth+";height:100px;'>");
					var childDiv=document.getElementById(id);
					childDiv.innerHTML="port"+portNumbers[k];
				if(queueDatas[k].length!=0)
				{
					    
						
						var chart=d3.select(childDiv)
						           .append('svg')
								   .attr('width',width)
								   .attr('height',100)
								   .append('g')
								   .attr('transform','translate(0,-28)');
								   
					    var bar=chart.selectAll('g')
								.data(queueDatas[k])
								.enter()
								.append('g')
								.attr('transform',function(d,i)
							   {
		                           return 'translate(' + i * 20 + ', 0)';  }); 
				               
						bar.append('rect')
						    .attr('y',function(d)
							{return 100-d/4;})
							.attr('height',function(d)
													{return d/4;})
							.attr('width',9)
							.attr('fill',function(d)
												  {
													   if(d>=1000)
													   return 'red';
													   else if(d>100&&d<1000)
													   return 'green';
													   else return 'blue';
													  
													  }
												  );
				}
							
			
	      }
	}
	
}

function removeDiv(obj)
{
	var divs = document.getElementById("TopologyShow").getElementsByTagName("div");
			for(var i = 0 ;i<divs.length;i++)
						{
				divs.item(i).remove();
				}
		
	}

//更新拓扑图状态信息
Topology.prototype.update=function(){
  var link = this.vis.selectAll("line.link")
      .data(this.links, function(d) { return d.source.id + "-" + d.target.id; })
      .attr("class", function(d){
            return d['source']['status'] && d['target']['status'] ? 'link' :'link link_error';
      });

  link.enter().insert("svg:line", "g.node")
      .attr("class", function(d){
         return d['source']['status'] && d['target']['status'] ? 'link' :'link link_error';
      })
	 .on('click',function(d){ self.clickLinkFn(d);})
	 .style("stroke",function(d)
							  {
								  return d.color;
								  })
	 .style("stroke-width","5");
	 //.on('click',function(d){ alert("点击了");});

  link.exit().remove();

  var node = this.vis.selectAll("g.node")
      .data(this.nodes, function(d) { 
								 return d.id;});

  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .call(this.force.drag);

  //增加图片，可以根据需要来修改
  var self=this;
  nodeEnter.append("svg:image")
      .attr("class", "circle")
      .attr("xlink:href", function(d){
         //根据类型来使用图片
         return d.expand ? "img/ap.png" : "img/rout.png";
      })
	  .attr("FILTER","Alpha(Opacity=50)")
      .attr("x", "-32px")
      .attr("y", "-32px")
      .attr("width", "64px")
      .attr("height", "64px")
      .on('click',function(d){ d.expand && self.clickNodeFn(d);})
	  .on('mouseover',function(d){creatDiv(d);})
	 // .on('mouseout',function(d){removeDiv(d);})

  nodeEnter.append("svg:text")
      .attr("class", "nodetext")
      .attr("dx", 15)
      .attr("dy", -35)
      .text(function(d) { return d.id });
	 
  
  node.exit().remove();

			
  this.force.start();
}

var nodes=[
	    //{id:'10.4.42.1',type:'router',status:1},
	    //{id:'10.4.43.1',type:'switch',status:1,expand:true}
	    //{id:'10.4.44.1',type:'switch',status:1,expand:true},
	    //{id:'10.4.45.1',type:'switch',status:0,expand:true}
	
	];
	
	var childNodes=[
	   // {id:'10.4.43.2',type:'switch',status:1},
	    //{id:'10.4.43.3',type:'switch',status:1}
	
	];
	
	var links=[
	    //{source:'10.4.42.1',target:'10.4.43.1',color:'red'},
	    //{source:'10.4.42.1',target:'10.4.44.1'},
	    //{source:'10.4.42.1',target:'10.4.45.1'}
	];
	
	var childLinks=[
	    //{source:'10.4.43.1',target:'10.4.43.2'},
	    //{source:'10.4.43.1',target:'10.4.43.3'},
	    //{source:'10.4.43.2',target:'10.4.43.3'}
	]

	
var topology=null;

function getDpTable(json){
	alert(json.rows);
	};

function showDpTable(data){
	$("#dpTable tr:not(:first)").empty();
		$.each(data, function (index, item) {
		     var eachrow = "<tr>"
		                 + "<td>" + item.dpStatus + "</td>"
		                 + "<td>" + item.dpNumber + "</td>"
		                 + "<td>" + item.dpTimeStamp + "</td>"
		                 + "</tr>";
		     $('#dpTable').append(eachrow);
		});

}
function showPortTable(data){
	$("#portTable tr:not(:first)").empty();
	$.each(data, function (index, item) {
		     var eachrow = "<tr>"
		                 + "<td>" + item.portStatus + "</td>"
		                 + "<td>" + item.portNumber + "</td>"
		                 + "<td>" + item.portDp + "</td>"
		                 + "<td>" + item.portTimeStamp + "</td>"
		                 + "<td>" + item.portMac + "</td>"
		                 + "<td>" + item.portRate + "</td>"
		                 + "<td>" + item.queueIDs + "</td>"
		                 + "</tr>";
		     $('#portTable').append(eachrow);
		});
	}
	
	function showQueueTable(data){
	var lastPortNumber=-1;
	var color1="#71A760";
	var color2="#84C36F";
	var color=color1;
	$("#queueTable tr:not(:first)").empty();
	$.each(data, function (index, item) {
						   
						   
			if(lastPortNumber!=-1&&lastPortNumber!=item.portNumber)
			{
				color=(color==color1)?color2:color1;
				
				}
		     var eachrow = "<tr style='background-color:"+color+"'>"
		                 + "<td>" + item.queueNumber + "</td>"
		                 + "<td>" + item.portNumber + "</td>"
		                 + "<td>" + item.minRate + "</td>"
		                 + "<td>" + item.txBytes + "</td>"
		                 + "<td>" + item.queueRate + "</td>"
		                 + "<td>" + item.queueTimeStamp + "</td>"
		                 + "</tr>";
			lastPortNumber=item.portNumber;
						 
		     $('#queueTable').append(eachrow);
		});
	}

	function showLinkTable(data){
		$("#linkTable tr:not(:first)").empty();
	$.each(data, function (index, item) {
		     var eachrow = "<tr>"
		                 + "<td>" + item.linkStatus + "</td>"
		                 + "<td>" + item.srcPort + "</td>"
		                 + "<td>" + item.srcDp + "</td>"
		                 + "<td>" + item.dstPort + "</td>"
		                 + "<td>" + item.dstDp + "</td>"
		                 + "<td>" + item.linkTimeStamp + "</td>"
		                 + "</tr>";
		     $('#linkTable').append(eachrow);
		});
	}
	
		function showFlowEntryTable(data){
	$.each(data, function (index, item) {
						   $("#flowEntry tr:not(:first)").empty();
		     var eachrow = "<tr>"
		                 + "<td>" + item.dpNumber + "</td>"
		                 + "<td>" + item.flowTableNumber + "</td>"
		                 + "<td>" + item.match + "</td>"
		                 + "<td>" + item.priority + "</td>"
		                 + "<td>" + item.flowStatus + "</td>"
		                 + "</tr>";
		     $('#flowEntryTable').append(eachrow);
		});
	}
	var ip ="http://10.108.96.129/TopoShow/";
function initTopologyShow(){
	nodes.length=0;
	links.length=0;
	document.getElementById("TopologyShow").innerHTML="";
	$.ajax(
		{
		type:"GET",
		url:ip+"DpTable",
		datatype:"json",
		success:function(data){
			value=eval("("+data+")");
			//{id:'10.4.42.1',type:'router',status:1},
			for(i=0;i<value.tableSize;i++)
			{
				row=value.rows[i];
				id=row.dpNumber;
				node={id:id,type:'swicth',status:1,expand:true}
				//nodes.push(node);
				}
		  //var temp=value.rows;
			showDpTable(value.rows);
		},
	
		async:false
		}
			
	);

	$.ajax(
		{
		type:"GET",
		url:ip+"PortTable",
		datatype:"json",
		success:function(data){
			value=eval("("+data+")");
		  //var temp=value.rows;
			showPortTable(value.rows);
		},
	
		async:false
		}
			
	);
	
		$.ajax(
		{
		type:"GET",
		url:ip+"/QueueTable",
		datatype:"json",
		success:function(data){
			
			value=eval("("+data+")");
			value.rows.sort(function(a,b){return a.portNumber-b.portNumber});
		  //var temp=value.rows;
			showQueueTable(value.rows);
		},
	
		async:false
		}
		);
		
			$.ajax(
		{
		type:"GET",
		url:ip+"FlowEntryTable",
		datatype:"json",
		success:function(data){
			value=eval("("+data+")");
		  //var temp=value.rows;
			showFlowEntryTable(value.rows);
		},
	
		async:false
		}
		);
		

		$.ajax(
		{
		type:"GET",
		url:ip+"LinkTable",
		datatype:"json",
		success:function(data){
			value=eval("("+data+")");
			//alert(value.rows[0].linkStatus);
			for (i = 0; i < value.tableSize; i++) {
				 row = value.rows[i];
				 srcDp=row.srcDp;
				 srcPort=row.srcPort;
				 dstPort=row.dstPort;
				 dstDp=row.dstDp;
				 //alert(srcDp+srcPort);
				 //{id:'10.4.42.1',type:'router',status:1}
				 //{source:'10.4.42.1',target:'10.4.43.1'},
				
				 if (row.linkStatus=="1") 
				 {
					  $.ajax(
							 {
						type:"GET",
						url:ip+"PortTable",
						datatype:"json",
						success:function(data1){
							value1=eval("("+data1+")");
							for(j=0;j<value1.tableSize;j++)
							{
								row1=value1.rows[j];
								if(row1.portNumber==srcPort||row1.portNumber==dstPort)
								{
									portRate=row1.portRate;
									break;
									
									}
									
								}
							
							
							},
							async:false
							 }
						
						);
				 	srcNode={id:srcDp,typr:'router',status:1,expand:true}
				 	nodes.push(srcNode);
				 	dstNode={id:dstDp,typr:'router',status:1,expand:true}
				 	nodes.push(dstNode);
					if(portRate<100) color="blue";
					else if(portRate>100&&portRate<1000) color="green";
					else color="red";
				 	link={source:srcDp,target:dstDp,color:color};
				 	links.push(link);
				 }
			}
			showLinkTable(value.rows);
		},
		async:false
		}
			
	);				
	
	
	
	
	
	
	
	topology=new Topology('TopologyShow');
	topology.addNodes(nodes);
	topology.addLinks(links);
	topology.setNodeClickFn(function(node){
	
		id=node.id;
			$.ajax(
		{
		type:"GET",
		url:ip+"DpTable",
		datatype:"json",
		success:function(data){
			value=eval("("+data+")");
			for(i=0;i<value.tableSize;i++){
				row = value.rows[i];
				if(row.dpNumber==id){
					
					showDpInfoDetail(row);
					break;
					}
				}
		},
	
		async:false
		}
		
			
	);
		//alert(id);
	});
	
	//点击连接事件 {source:'10.4.42.1',target:'10.4.45.1'}
	topology.setLinkClickFn(function(link){
	srcDp=link.source.id;
	dstDp=link.target.id;
	var srcPort=null;
	var dstPort=null;
	$.ajax(
		{
		type:"GET",
		url:ip+"LinkTable",
		datatype:"json",
		success:function(data){
			value=eval("("+data+")");
			for(i=0;i<value.tableSize;i++){
				row = value.rows[i];
				srcPort=row.srcPort;
				dstPort=row.dstPort;
				if((row.srcDp==srcDp)&&(row.dstDp==dstDp)){
					//alert("yes!");
					showLinkInfoDetail(row);
					break;
					}
				}
		},
	
		async:false
		}
		
			
	);
	//从json的queueTable中获取源目的端口分别对应的队列消息 
	$.ajax(
		{
		type:"GET",
		url:ip+"QueueTable",
		datatype:"json",
		success:function(data){
			value=eval("("+data+")");
			var srcQueueRows=new Array();
			var dstQueueRows=new Array();
			var j=0;
			var k=0;
			for(i=0;i<value.tableSize;i++)
			{
				row = value.rows[i];
				if(row.portNumber==srcPort)
					{
						srcQueueRows[j]=row;
						j++;
					}
				if(row.portNumber==dstPort)
					{
						dstQueueRows[k]=row	;
						k++;
					}

			}
			showSrcQueue(srcQueueRows,srcDp);
			showDstQueue(dstQueueRows,dstDp);
				//alert("success!");
		},
	
		async:false
		}		
	);
	//alert(link);	
								 
	});
	topology.update();

}

function showSrcQueue(srcQueueRows,srcDp){
	$("#srcQueueInfo tr:not(:first)").empty();
	document.getElementById("srcDp").innerHTML =srcDp;
	//$("#srcDp").innerHTML=srcDp;
	for(i=0;i<srcQueueRows.length;i++)
	{
		if(parseInt(srcQueueRows[i].queueRate)>1000)
		{
			var thisRow = "<tr>"
							  + "<td>"+ srcQueueRows[i].portNumber+"</td>"
							  + "<td>"+ srcQueueRows[i].queueNumber+"</td>"
							  + "<td style='background-color:red'>"+ srcQueueRows[i].queueRate+"</td>"
							  + "<td>"+ srcQueueRows[i].minRate+"</td>";	
		}
		else if((parseInt(srcQueueRows[i].queueRate)>100)&&(parseInt(srcQueueRows[i].queueRate)<1000))
		{
			var thisRow = "<tr>"
							  + "<td>"+ srcQueueRows[i].portNumber+"</td>"
							  + "<td>"+ srcQueueRows[i].queueNumber+"</td>"
							  + "<td style='background-color:#006633'>"+ srcQueueRows[i].queueRate+"</td>"
							  + "<td>"+ srcQueueRows[i].minRate+"</td>";	
		}
		else
		{
			var thisRow = "<tr>"
							  + "<td>"+ srcQueueRows[i].portNumber+"</td>"
							  + "<td>"+ srcQueueRows[i].queueNumber+"</td>"
							  + "<td style='background-color:#0066CC'>"+ srcQueueRows[i].queueRate+"</td>"
							  + "<td>"+ srcQueueRows[i].minRate+"</td>";	
		}
		$("#srcQueueInfo").append(thisRow);
			
		
		
	}
		
}

function showDstQueue(dstQueueRows,dstDp){
	$("#dstQueueInfo tr:not(:first)").empty();
	document.getElementById("dstDp").innerHTML =dstDp;
	for(i=0;i<dstQueueRows.length;i++)
		{
			if(parseInt(dstQueueRows[i].queueRate)>1000)
				{
					var thisRow = "<tr>"
									  + "<td>"+ dstQueueRows[i].portNumber+"</td>"
									  + "<td>"+ dstQueueRows[i].queueNumber+"</td>"
									  + "<td style='background-color:red'>"+ dstQueueRows[i].queueRate+"</td>"
									  + "<td>"+ dstQueueRows[i].minRate+"</td>";	
				}
			else if((parseInt(dstQueueRows[i].queueRate)>100)&&(parseInt(dstQueueRows[i].queueRate)<1000))
				{
					var thisRow = "<tr>"
									  + "<td>"+ dstQueueRows[i].portNumber+"</td>"
									  + "<td>"+ dstQueueRows[i].queueNumber+"</td>"
									  + "<td style='background-color:#006633'>"+ dstQueueRows[i].queueRate+"</td>"
									  + "<td>"+ dstQueueRows[i].minRate+"</td>";	
				}
			else
				{
					var thisRow = "<tr>"
									  + "<td>"+ dstQueueRows[i].portNumber+"</td>"
									  + "<td>"+ dstQueueRows[i].queueNumber+"</td>"
									  + "<td style='background-color:#0066CC'>"+ dstQueueRows[i].queueRate+"</td>"
									  + "<td>"+ dstQueueRows[i].minRate+"</td>";	
				}
			$("#dstQueueInfo").append(thisRow);
		
	
		}
		
}



function showDpInfoDetail(row){
				// $("#detailInfo  td:not(:first)").empty();
				$("#detailInfo").empty();
		     var thisCol= "<tr>"+"<td>dpNumber</td><td>" + row.dpNumber +"</td>"+"</tr>"
		                 + "<tr>" +"<td>dpStatus</td><td>"+ row.dpStatus + "</td>"+"</tr>"
		                 + "<tr>" + "<td>dpTimeStamp</td><td>"+row.dpTimeStamp +"</td>"+ "</tr>";
		                 //alert("hello");
		     $('#detailInfo').append(thisCol);

	
	}
	
function showLinkInfoDetail(row){
				// $("#detailInfo  td:not(:first)").empty();
				$("#detailInfo").empty();
		     var thisCol= "<tr>"+"<td>linkStatus</td><td>" + row.linkStatus +"</td>"+"</tr>"
		                 + "<tr>" +"<td>srcPort</td><td>"+ row.srcPort + "</td>"+"</tr>"
		                 + "<tr>" + "<td>srcDp</td><td>"+row.srcDp +"</td>"+ "</tr>"
						  + "<tr>" +"<td>dstPort</td><td>"+ row.dstPort + "</td>"+"</tr>"
			 + "<tr>" +"<td>dstDp</td><td>"+ row.dstDp + "</td>"+"</tr>"
			 + "<tr'>" +"<td>linkTimeStamp</td><td>"+ row.linkTimeStamp + "</td>"+"</tr>";
		                 //alert("hello");
		     $('#detailInfo').append(thisCol);

	
	}
	
function expandNode(id){
	
    topology.addNodes(childNodes);
    topology.addLinks(childLinks);
    topology.update();
}

function collapseNode(id){
    topology.removeChildNodes(id);
    topology.update();
}



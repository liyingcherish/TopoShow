var nodes=[
	    {id:'10.4.42.1',type:'router',status:1},
	    {id:'10.4.43.1',type:'switch',status:1}
	    //{id:'10.4.44.1',type:'switch',status:1,expand:true},
	    //{id:'10.4.45.1',type:'switch',status:0,expand:true}
	
];

	
var links=[
	    {source:0,target:1},
	    //{source:'10.4.42.1',target:'10.4.44.1'},
	    //{source:'10.4.42.1',target:'10.4.45.1'}
];
	



var queueLinks = [
 //       {"color":"red","curvature":"10","quarterPoint":quarterPoints_data[0]},
//	{"color":"blue","curvature":"20","quarterPoint":quarterPoints_data[0]},
//	{"color":"red","curvature":"10","quarterPoint":quarterPoints_data[1]}
];

//###############################################################
var nodes_data=[
        { "name": "EC2-A",   "type": "small",  "id": 3},
        { "name": "EC2-B",   "type": "micro", "id": 4}
];
   
var links_data=[
        {"source": 0, "target": 1}
    ];
var quarterPoints_data=[
					{"node":nodes_data[0],"link":links_data[0]},
					{"node":nodes_data[1],"link":links_data[0]}
];

var queueLink_data = [
	{"color":"red","curvature":"10","quarterPoint":quarterPoints_data[0]	},
	{"color":"blue","curvature":"20","quarterPoint":quarterPoints_data[0]},
	{"color":"red","curvature":"10","quarterPoint":quarterPoints_data[1]	}
];


function Topology(ele){
    typeof(ele)=='string' && (ele=document.getElementById(ele));
    var w=ele.clientWidth;
    var h=ele.clientHeight;
    self=this;
	this.clickFn=function(){};
	this.svg = d3.select(ele).append("svg:svg").attr({width: w, height: h});
	
    this.force = d3.layout.force().gravity(.05).distance(200).charge(-800).size([w, h]);
	
	
    this.nodes = null;
    this.links = null;
	this.queues = null;
	
	
}

//获得1/4点
function quarterPoint(x1,x2){
			return (3*x1+x2)/4;
}

Topology.prototype.forceOn = function(){
	self = this;
	self.force.on("tick", function(x) {
		self.links.attr({
			"x1": function(d) { return d.source.x+32; },
			"y1": function(d) { return d.source.y+32; },
			"x2": function(d) { return d.target.x+32; },
			"y2": function(d) { return d.target.y+32; }
			
		});
		
		self.nodes.attr({
			"x": function(d) { return d.x; },
			"y": function(d) { return d.y; },
		});
		
		self.queues.attr({ 
			"d": function(d){
				var a = 0.025;
				var x0 = d.quarterPoint.node.x;
				var y0 = d.quarterPoint.node.y;
				var x1 = 0;
				var y1 = 0;
				x1=(x0==d.quarterPoint.link.source.x)?quarterPoint(x0,d.quarterPoint.link.target.x):quarterPoint(x0,d.quarterPoint.link.source.x);
				y1=(y0==d.quarterPoint.link.source.y)?quarterPoint(y0,d.quarterPoint.link.target.y):quarterPoint(y0,d.quarterPoint.link.source.y);
				alert("x0="+x0+"  x1="+x1);
				var x_m = (x0+x1)/2;
				var y_m = (y0+y1)/2;
				var k = (y1-y0)/(x1-x0);
				var x = x_m+parseInt(d.curvature);
				var y = -(1/k)*(x-x_m)+y_m;
				x0 += 32;
				y0 += 32;
				x += 32;
				y += 32;
				x1 += 32;
				y1 += 32;
				var s = "M"+x0+" "+y0+" Q "+x+" "+y+" "+x1+" "+y1;
				return s;
			}
					
		});
		
		function quarterPoint(x1,x2)
		{
				return (3*x1+x2)/4;
		}
		
			 
	});
}

Topology.prototype.draw = function(nodes_data, links_data, quarterPoints_data, queueLink_data){
	self = this;
	
	self.force.nodes(nodes_data).links(links_data).start();
	
	self.links = self.svg.append('g')
			.selectAll("line.link")
			.data(self.force.links())
			.enter()
			.append("line")
			.attr("class", "link")
			.on('click',function(d){ self.clickLinkFn(d);});
			
	self.queues = self.svg.append('g')
			.selectAll("line.queue")
			.data(queueLink_data)
			.enter()
			.append("path")
			.attr("class", "queue")
			.style("fill","none")
			.style("stroke",function(d){return d.color})
			.style("stroke-width","3");
			
	self.nodes = self.svg.selectAll("image.node")
			.data(self.force.nodes())
			.enter()
			.append("image")
			.attr("class","node")
			.attr("xlink:href","img/ap.png")
			.call(self.force.drag)
			.attr("width", "64px")
     		.attr("height", "64px")
			.on('click',function(d){self.clickNodeFn(d);});
	self.forceOn();
			
}


/*##################################################################################*/	/*##################################################################################*/	
/*##################################################################################*/













//节点点击事件
Topology.prototype.setNodeClickFn=function(callback){
    this.clickNodeFn=callback;
    
}
//连接点击事件
Topology.prototype.setLinkClickFn=function(callback){
    this.clickLinkFn=callback;
    
}

//更新拓扑图状态信息
Topology.prototype.update=function(){
	self.draw(nodes_data,links_data,quarterPoints_data,queueLink_data);
}

	
	
	


function getDpTable(json){
	alert(json.rows);
	};

function showDpTable(data){
		$.each(data, function (index, item) {
		     var eachrow = "<tr class=\"success\">"
		                 + "<td>" + item.dpStatus + "</td>"
		                 + "<td>" + item.dpNumber + "</td>"
		                 + "<td>" + item.dpTimeStamp + "</td>"
		                 + "</tr>";
		     $('#dpTable').append(eachrow);
		});

}
function showPortTable(data){
	$.each(data, function (index, item) {
		     var eachrow = "<tr class=\"success\">"
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
	$.each(data, function (index, item) {
		     var eachrow = "<tr class=\"success\">"
		                 + "<td>" + item.queueNumber + "</td>"
		                 + "<td>" + item.portNumber + "</td>"
		                 + "<td>" + item.minRate + "</td>"
		                 + "<td>" + item.txBytes + "</td>"
		                 + "<td>" + item.queueRate + "</td>"
		                 + "<td>" + item.queueTimeStamp + "</td>"
		                 + "</tr>";
		     $('#queueTable').append(eachrow);
		});
	}

	function showLinkTable(data){
	$.each(data, function (index, item) {
		     var eachrow = "<tr class=\"success\">"
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
		     var eachrow = "<tr class=\"success\">"
		                 + "<td>" + item.dpNumber + "</td>"
		                 + "<td>" + item.flowTableNumber + "</td>"
		                 + "<td>" + item.match + "</td>"
		                 + "<td>" + item.priority + "</td>"
		                 + "<td>" + item.flowStatus + "</td>"
		                 + "</tr>";
		     $('#flowEntryTable').append(eachrow);
		});
	}
var ip ="http://10.108.96.129//TopoShow/";
var topology=null;
function initTopologyShow(){
	topology=new Topology('TopologyShow');
	topology.update();
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
				nodes.push(node);
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
				 if (row.linkStatus=="1") {
				 	srcNode={id:srcDp,typr:'router',status:1,expand:true}
				 	nodes.push(srcNode);
				 	dstNode={id:dstDp,typr:'router',status:1,expand:true}
				 	nodes.push(dstNode);
				 	link={source:srcDp,target:dstDp};
				 	links.push(link);
				 }
			}
			showLinkTable(value.rows);
		},
		async:false
		}
			
	);				
	
	
	
	
	
	
	
	
	
	//点击节点事件
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
				alert("success!");
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
							  + "<td>"+ srcQueueRows[i].minRate+"</td>"
							  + "<td>"+ srcQueueRows[i].txBytes+"</td>";	
		}
		else if((parseInt(srcQueueRows[i].queueRate)>100)&&(parseInt(srcQueueRows[i].queueRate)<1000))
		{
			var thisRow = "<tr>"
							  + "<td>"+ srcQueueRows[i].portNumber+"</td>"
							  + "<td>"+ srcQueueRows[i].queueNumber+"</td>"
							  + "<td style='background-color:#006633'>"+ srcQueueRows[i].queueRate+"</td>"
							  + "<td>"+ srcQueueRows[i].minRate+"</td>"
							  + "<td>"+ srcQueueRows[i].txBytes+"</td>";	
		}
		else
		{
			var thisRow = "<tr>"
							  + "<td>"+ srcQueueRows[i].portNumber+"</td>"
							  + "<td>"+ srcQueueRows[i].queueNumber+"</td>"
							  + "<td style='background-color:#0066CC'>"+ srcQueueRows[i].queueRate+"</td>"
							  + "<td>"+ srcQueueRows[i].minRate+"</td>"
							  + "<td>"+ srcQueueRows[i].txBytes+"</td>";	
		}
		$("#srcQueueInfo").append(thisRow);
			
		/*if(i==0)
		{
		
			if(srcQueueRows[i].queueRate>1000)
				{
					var thisRow = "<tr>"
								  + "<td>"+ srcQueueRows[i].portNumber+"</td>"
								  + "<td>"+ srcQueueRows[i].queueNumber+"</td>"
								  + "<td>"+ srcQueueRows[i].queueRate+"</td>"
								  + "<td>"+ srcQueueRows[i].minRate+"</td>"
								  + "<td>"+ srcQueueRows[i].txBytes+"</td>";	
						
					var thisCol= "<tr>"+"<td>portNumber</td><td>" + srcQueueRows[i].portNumber +"</td>"+"</tr>"
								 + "<tr>" + "<td>queueNumber</td><td>"+srcQueueRows[i].queueNumber +"</td>"+ "</tr>"
								 +"<tr style='background-color:red'>" +"<td>queueRate</td><td>"+ srcQueueRows[i].queueRate + "</td>"+"</tr>"
								 + "<tr>" + "<td>minRate</td><td>"+srcQueueRows[i].minRate +"</td>"+ "</tr>"
								 + "<tr>" + "<td>txBytes</td><td>"+srcQueueRows[i].txBytes +"</td>"+ "</tr>";
				}
			else if(100<srcQueueRows[i].queueRate<=1000)
				{
				
					 var thisCol= "<tr>"+"<td>portNumber</td><td>" + srcQueueRows[i].portNumber +"</td>"+"</tr>"
								 + "<tr>" + "<td>queueNumber</td><td>"+srcQueueRows[i].queueNumber +"</td>"+ "</tr>"
								 +"<tr style='background-color:green'>" +"<td>queueRate</td><td>"+ srcQueueRows[i].queueRate + "</td>"+"</tr>"
								 + "<tr>" + "<td>minRate</td><td>"+srcQueueRows[i].minRate +"</td>"+ "</tr>"
								 + "<tr>" + "<td>txBytes</td><td>"+srcQueueRows[i].txBytes +"</td>"+ "</tr>";
				}
				else
				{
				
					var thisCol= "<tr>"+"<td>portNumber</td><td>" + srcQueueRows[i].portNumber +"</td>"+"</tr>"
								 + "<tr>" + "<td>queueNumber</td><td>"+srcQueueRows[i].queueNumber +"</td>"+ "</tr>"
								 +"<tr style='background-color:blue'>" +"<td>queueRate</td><td>"+ srcQueueRows[i].queueRate + "</td>"+"</tr>"
								 + "<tr>" + "<td>minRate</td><td>"+srcQueueRows[i].minRate +"</td>"+ "</tr>"
								 + "<tr>" + "<td>txBytes</td><td>"+srcQueueRows[i].txBytes +"</td>"+ "</tr>";
								 ;
				}
			
		}
		else
		{
			
			if(srcQueueRows[i].queueRate>1000)
			{
				
				var thisCol = "<tr><td>"+srcQueueRows[i].portNumber+"</td>"+"</tr>"
							+"<tr><td>"+srcQueueRows[i].queueNumber +"</td>"+ "</tr>"
							+"<tr style='background-color:red'><td>"+srcQueueRows[i].queueRate+"</td>"+"</tr>"
							+"<tr><td>"+srcQueueRows[i].minRate+"</td>"+"</tr>"
							+"<tr><td>"+srcQueueRows[i].txBytes+"</td>"+"</tr>";	
				
			}
			else if(100<srcQueueRows[i].queueRate<=1000)
			{
				var thisCol = "<tr><td>"+srcQueueRows[i].portNumber+"</td>"+"</tr>"
							+"<tr><td>"+srcQueueRows[i].queueNumber +"</td>"+ "</tr>"
							+"<tr style='background-color:green'><td>"+srcQueueRows[i].queueRate+"</td>"+"</tr>"
							+"<tr><td>"+srcQueueRows[i].minRate+"</td>"+"</tr>"
							+"<tr><td>"+srcQueueRows[i].txBytes+"</td>"+"</tr>";	
			}
			else
			{
				var thisCol = "<tr><td>"+srcQueueRows[i].portNumber+"</td>"+"</tr>"
							+"<tr><td>"+srcQueueRows[i].queueNumber +"</td>"+ "</tr>"
							+"<tr style='background-color:blue'><td>"+srcQueueRows[i].queueRate+"</td>"+"</tr>"
							+"<tr><td>"+srcQueueRows[i].minRate+"</td>"+"</tr>"
							+"<tr><td>"+srcQueueRows[i].txBytes+"</td>"+"</tr>";		
			}
						  
			
		}
		$("#srcQueueInfo").append(thisCol);*/
		
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
									  + "<td>"+ dstQueueRows[i].minRate+"</td>"
									  + "<td>"+ dstQueueRows[i].txBytes+"</td>";	
				}
			else if((parseInt(dstQueueRows[i].queueRate)>100)&&(parseInt(dstQueueRows[i].queueRate)<1000))
				{
					var thisRow = "<tr>"
									  + "<td>"+ dstQueueRows[i].portNumber+"</td>"
									  + "<td>"+ dstQueueRows[i].queueNumber+"</td>"
									  + "<td style='background-color:#006633'>"+ dstQueueRows[i].queueRate+"</td>"
									  + "<td>"+ dstQueueRows[i].minRate+"</td>"
									  + "<td>"+ dstQueueRows[i].txBytes+"</td>";	
				}
			else
				{
					var thisRow = "<tr>"
									  + "<td>"+ dstQueueRows[i].portNumber+"</td>"
									  + "<td>"+ dstQueueRows[i].queueNumber+"</td>"
									  + "<td style='background-color:#0066CC'>"+ dstQueueRows[i].queueRate+"</td>"
									  + "<td>"+ dstQueueRows[i].minRate+"</td>"
									  + "<td>"+ dstQueueRows[i].txBytes+"</td>";	
				}
			$("#dstQueueInfo").append(thisRow);
		
	/*

		if(i==0)
		{
			
			if(dstQueueRows[i].queueRate>1000)
			{
				var thisCol= "<tr>"+"<td>portNumber</td><td>" + dstQueueRows[i].portNumber +"</td>"+"</tr>"
							 + "<tr>" + "<td>queueNumber</td><td>"+dstQueueRows[i].queueNumber +"</td>"+ "</tr>"
							 + "<tr style='background-color:red'>" +"<td>queueRate</td><td>"+ dstQueueRows[i].queueRate + "</td>"+"</tr>"
							 + "<tr>" + "<td>minRate</td><td>"+dstQueueRows[i].minRate +"</td>"+ "</tr>"
							 + "<tr>" + "<td>txBytes</td><td>"+dstQueueRows[i].txBytes +"</td>"+ "</tr>";
			}
			else if(100<dstQueueRows[i].queueRate<=1000)
			{
				var thisCol= "<tr>"+"<td>portNumber</td><td>" + dstQueueRows[i].portNumber +"</td>"+"</tr>"
							 + "<tr>" + "<td>queueNumber</td><td>"+dstQueueRows[i].queueNumber +"</td>"+ "</tr>"
							 + "<tr style='background-color:green'>" +"<td>queueRate</td><td>"+ dstQueueRows[i].queueRate + "</td>"+"</tr>"
							 + "<tr>" + "<td>minRate</td><td>"+dstQueueRows[i].minRate +"</td>"+ "</tr>"
							 + "<tr>" + "<td>txBytes</td><td>"+dstQueueRows[i].txBytes +"</td>"+ "</tr>";
			}
			else
			{
				var thisCol= "<tr>"+"<td>portNumber</td><td>" + dstQueueRows[i].portNumber +"</td>"+"</tr>"
							 + "<tr>" + "<td>queueNumber</td><td>"+dstQueueRows[i].queueNumber +"</td>"+ "</tr>"
							 + "<tr style='background-color:blue'>" +"<td>queueRate</td><td>"+ dstQueueRows[i].queueRate + "</td>"+"</tr>"
							 + "<tr>" + "<td>minRate</td><td>"+dstQueueRows[i].minRate +"</td>"+ "</tr>"
							 + "<tr>" + "<td>txBytes</td><td>"+dstQueueRows[i].txBytes +"</td>"+ "</tr>";
			}
							
		}
		else
		{
			
			if(dstQueueRows[i].queueRate>1000)
			{
				var thisCol = "<tr><td>"+dstQueueRows[i].portNumber+"</td>"+"</tr>"
							+"<tr><td>"+dstQueueRows[i].queueNumber +"</td>"+ "</tr>"
							+"<tr style='background-color:red'><td>"+dstQueueRows[i].queueRate+"</td>"+"</tr>"
							+"<tr><td>"+dstQueueRows[i].minRate+"</td>"+"</tr>"
							+"<tr><td>"+dstQueueRows[i].txBytes+"</td>"+"</tr>";
			}
			else if(100<dstQueueRows[i].queueRate<=1000)
			{
				var thisCol = "<tr><td>"+dstQueueRows[i].portNumber+"</td>"+"</tr>"
							+"<tr><td>"+dstQueueRows[i].queueNumber +"</td>"+ "</tr>"
							+"<tr style='background-color:green'><td>"+dstQueueRows[i].queueRate+"</td>"+"</tr>"
							+"<tr><td>"+dstQueueRows[i].minRate+"</td>"+"</tr>"
							+"<tr><td>"+dstQueueRows[i].txBytes+"</td>"+"</tr>";	
			}
			else
			{
				var thisCol = "<tr><td>"+dstQueueRows[i].portNumber+"</td>"+"</tr>"
							+"<tr><td>"+dstQueueRows[i].queueNumber +"</td>"+ "</tr>"
							+"<tr style='background-color:blue'><td>"+dstQueueRows[i].queueRate+"</td>"+"</tr>"
							+"<tr><td>"+dstQueueRows[i].minRate+"</td>"+"</tr>"
							+"<tr><td>"+dstQueueRows[i].txBytes+"</td>"+"</tr>";
			}
						  
			
		}
			$("#dstQueueInfo").append(thisCol);*/
		}
		
}



function showDpInfoDetail(row){
				// $("#detailInfo  td:not(:first)").empty();
				$("#detailInfo").empty();
		     var thisCol= "<tr  class='success'>"+"<td>dpNumber</td><td>" + row.dpNumber +"</td>"+"</tr>"
		                 + "<tr class='info'>" +"<td>dpStatus</td><td>"+ row.dpStatus + "</td>"+"</tr>"
		                 + "<tr class='error'>" + "<td>dpTimeStamp</td><td>"+row.dpTimeStamp +"</td>"+ "</tr>";
		                 //alert("hello");
		     $('#detailInfo').append(thisCol);

	
	}
	
function showLinkInfoDetail(row){
				// $("#detailInfo  td:not(:first)").empty();
				$("#detailInfo").empty();
		     var thisCol= "<tr  class='success'>"+"<td>linkStatus</td><td>" + row.linkStatus +"</td>"+"</tr>"
		                 + "<tr class='info'>" +"<td>srcPort</td><td>"+ row.srcPort + "</td>"+"</tr>"
		                 + "<tr class='error'>" + "<td>srcDp</td><td>"+row.srcDp +"</td>"+ "</tr>"
						  + "<tr class='info'>" +"<td>dstPort</td><td>"+ row.dstPort + "</td>"+"</tr>"
			 + "<tr class='info'>" +"<td>dstDp</td><td>"+ row.dstDp + "</td>"+"</tr>"
			 + "<tr class='info'>" +"<td>linkTimeStamp</td><td>"+ row.linkTimeStamp + "</td>"+"</tr>";
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


/*var data = [
			{
				dpNumber:"liying",
				dpStatus:"wnaghaoshuang",
				dpTimeStamp:"baby"
				
				}
			
			];
*/




/*
function getDpTable(dpJson){
		dpJson = json.dumps(table.dpTable);	 
        var tb = document.getElementById("DpTable");
        for(var i= 0;i<dpJson.rows.length;i++){
        var row = tb.insertRow(tb.rows.lenth);
        var c1 = row.insertCell(0);
        c1.innerHTML = dpJson.rows[i].dpNmuber;
        var c2 = row.insertCell(1);
        c2.innerHTML = dpJson.rows[i].dpStatus;
        var c3 = row.insertCell(2);
        c3.innerHTML = dpJson.rows[i].dpTimeStamp;
	}
*/
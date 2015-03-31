import json
import web
import ConfigParser
config = ConfigParser.SafeConfigParser()  

config.read("D:/develop/TopoShow/conf/config.ini")
path=config.get("system","path")


urls = ('/DpTable','DpTable',
				'/PortTable','PortTable',
				'/QueueTable','QueueTable',
				'/LinkTable','LinkTable',
				'/FlowEntryTable','FlowEntryTable',
				)


#store the information of all table in json string
class TableInfo:
	def __init__(self):
		#self.path = "D:/develop/TopoShow/lib/json/"
		self.path = path
		
	def openDpTable(self):
		f = open(self.path+'dpTable.json')
		self.dpTable = json.load(f)
		f.close()
		return self.dpTable
	
	def openPortTable(self):
		f = open(self.path+'portTable.json')
		self.portTable = json.load(f)
		f.close()
		return self.portTable
	
	def openQueueTable(self):
		f = open(self.path+'queueTable.json')
		self.queueTable = json.load(f)
		f.close()	
		return self.queueTable
	
	def openLinkTable(self):
		f = open(self.path+'linkTable.json')
		self.linkTable = json.load(f)
		f.close()
		return self.linkTable
	
	def openFlowEntryTable(self):
		f = open(self.path+'flowEntryTable.json')
		self.flowEntryTable = json.load(f)
		f.close()
		return self.flowEntryTable


table = TableInfo()
class DpTable:
	def GET(self):
		return json.dumps(table.openDpTable())  

        
class PortTable:
	def GET(self):
		return json.dumps(table.openPortTable())  

class QueueTable:
	def GET(self):
		return json.dumps(table.openQueueTable())  

class LinkTable:
	def GET(self):
		return json.dumps(table.openLinkTable())  
        
class FlowEntryTable:
	def GET(self):
		return json.dumps(table.openFlowEntryTable())
	

		
app = web.application(urls, globals(), autoreload=False)
application = app.wsgifunc()


		
		
		
		





		

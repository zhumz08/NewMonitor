//日志对象  及方法，添加\清空日志。
//2013年5月18日 
//jason

function Log()
{
		//清空日志区域
		this.clear=function()
		{
			$("#logdiv ul").html('');
		};
		
		//添加一条日志         格式为：   日期 时间：【信息类型】内容
		this.println=this.debug=function(logContent)
		{
			this.baseWriteLog(logContent, "信息", '');
			
		};
		this.error=function(logContent)
		{
			this.baseWriteLog(logContent, "错误", 'red');
		};
		this.warn=function(logContent)
		{
			this.baseWriteLog(logContent, "警告", 'orange');
		};
		this.baseWriteLog=function(logContent,contentpre,fontcolor)
		{
			if(!fontcolor)
			{
				fontcolor='black';
			}
			var dateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
				//target=$(parent.document.body).contents().find("#logdiv");
				
			$("#logdiv ul").html("<li class='li_log"+" "+fontcolor+"'>"+dateTime+"   "+contentpre+" : " + logContent + "</li>" + $("#logdiv ul").html());
			
			//如果日志超过50行，则清理,只保留50行
			if($("#logdiv li").length>60)
			{
				$("#logdiv li:gt(50)").remove();
			}
		};
};


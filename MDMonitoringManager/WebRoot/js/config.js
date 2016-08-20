///////////////////////////
////显示（获取）和设置本地图片、视频保存路径
//////////////////////////

$(function()
{
	//ajax获取配置路径的时候，不能有缓存，否则取到的就不是最新的path了
	$.ajaxSetup({ 
		cache: false 
		});
	
	$("#sz").click(function()
	{
		//隐藏不能正常显示的含有active控件的容器
		//$("#main").hide();
		hideActive(0);
		//初始页面时获取当前保存地址  getSavePath4AjAX()
 		$("#savepath").val(getSavePath4AjAX());
 		//显示设置窗口
		$("#configdiv").dialog("open");
	});
	
	//登陆弹出框设定
	$("#configdiv").dialog(
	{
		autoOpen : false,
		width : 280,
		height : 200,
		modal : true,
		bgiframe : true,
		title : "系统设置",
		overlay :
		{
			opacity : 0.8,
			background : "#ffffff"
		},
		close : function (event, ui)
		{
			//隐藏那些active控件
			//$("#main").show();
			hideActive(1);
			$("#configlogspan").hide();
			$("#configdiv").dialog("close");
		}
	});
	
	//选择文件夹按钮事件    --使用active方式，只能用于IE浏览器
	$("#folderChoose").click(function()
	{
		var folder,path;
		try{
			var Shell = new ActiveXObject("Shell.Application");
			folder = Shell.BrowseForFolder(0, "", 0x0040, 0x11);
		}catch(error)
		{
			alert("打开文件夹选择框失败，请将本网页ip添加到ie安全站点\n并且将安全站点的安全级别中关于activeX的项都设置为‘启用’");
		}
		
		try
		{
			path=folder.items().item().Path;
			if(path.charAt(path.length-1) != "\\"){
				path = path + "\\";
		       }
			document.getElementById("savepath").value=path;
		}catch(error)
		{
			log.debug("没有选择文件夹");
		}
		
	});
	
	
	//点击保存时，校验，并保存
	$("#savebutton").click(function()
	{
		var currpath=$("#savepath").val();
		if(currpath)
		{
			if(savePath4Ajax(currpath))
			{
				log.debug("路径保存成功.");
				$("#configlogspan").text("设置保存成功.").show();
			}else
			{
				log.debug("保存失败请重试.");
				$("#configlogspan").text("设置保存失败,请重试.").show();
			}
		}
		
	});
	
	$("#saveover").click(function()
	{
		//隐藏那些active控件
		//$("#main").show();
		hideActive(1);
		$("#configlogspan").hide();
		$("#configdiv").dialog("close");
	});
});

/**
 * 获取设置的本地录像，图片的保存路径   
 * @returns {Boolean}
 */
function getSavePath4AjAX()
{
	var answers=false;
	//获取设置的路径--需同步请求,以保证保存到最新设定的目录下
	$.ajax('./editConfig.do?method=getPathbyJSON',
	{
		async : false,
		dataType : 'json',
		success : function (date)
		{
			log.debug("获取本地视频、截图保存位置：" + date['savepath']);
			answers= date['savepath'];
		}
	});
	return answers;
}

/**
 * 保存图片，录像本地保存目录
 * @param path
 * @returns {Boolean}
 */
function savePath4Ajax(path)
{
	var answers=false;
	$.ajax('./editConfig.do?method=save&savepath='+path,
			{
				async : false,//同步调用，
				dataType : 'json',
				success : function (date)
				{
					//log.debug("保存本地视频、截图保存位置：" + (date['msg']?'成功.':'失败.'));
					answers= date['msg'];
				}
			});
	return answers;
	}
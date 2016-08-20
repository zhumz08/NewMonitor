function test()
{
	alert("通讯控件加载错误!");
}

//日志对象
var log = new Log();
var islogin = false;
//左侧 右侧窗口
var leftPage, mainPage;

var commonOcxObj = null;
//通讯组件引用
var key = 0;
var hostName = "";
var hostPort = 0;
var userName = "";
var userPwd = "";

var sessionId = 0;
//视频录像时间条空间用xml内容数组，格式：{{‘摄像头id’，几个内容,xml}，……}
var hisVideoXmlArr = new Array();

//当前摄像机编号
var currCameraId;
var currcameraName;

$(document).ready(function ()
{
	//日志对象
	log = new Log();
	//初始化通讯对象
	commonOcxObj = document.getElementById("commonOcx");
	leftPage = document.getElementById("leftNav").contentWindow;
	mainPage = document.getElementById("mainNav").contentWindow;
	
	//精准设置右侧主工作区域宽度
	var allWidth = $(document).width() - 10;
	$("#middleDiv").width(allWidth);
	//alert(allWidth);
	
	var rightwidth = $("#middleDiv").width() - $("#leftDiv").width() - $("#div_arrow").width() - 2;
	/*alert("zong:"+$("#middleDiv").width()+" zuo:"+$("#leftDiv").width()+" zhong:"+$("#div_arrow").width()+" main:"+rightwidth);*/
	$("#mainDiv").css('width', rightwidth);
	
	//var allheight=$(window).height();
	//alert(allheight);
	//var mainheight=allheight+17-50-8-3;
	//$("#middleDiv").height(mainheight);
	
	//中间收缩左侧菜单的图片事件
	$("#imgSpilit").click(function ()
	{
		if ($(this).attr('name') == 'show')
		{
			$("#leftDiv").hide();
			$("#mainDiv").css('width', '99%');
			$(this).attr('src', 'Images/icon_rightarrow.png').attr('alt', '显示左侧菜单').attr('name', 'hidden');
		}
		else
		{
			$("#leftDiv").show();
			$("#mainDiv").css('width', '81%');
			$(this).attr('src', 'Images/icon_leftarrow.png').attr('alt', '收缩左侧菜单').attr('name', 'show');
		}
	}
	);
	
	//中间收缩左侧菜单的图片事件
		$("#imgSpilitdown").click(function()
		{
			if($(this).attr('name')=='show')
			{
				$("#logdiv").hide();
				//$("#middleDiv").css('height','90%');
				$(this).attr('src','Images/icon_uparrow.png').attr('alt','显示日志').attr('name','hidden');
				//mainPage.showLayout(0,0);
			}else
			{
				$("#logdiv").show();
				//$("#middleDiv").css('height','85%');
				$(this).attr('src','Images/icon_downarrow.png').attr('alt','隐藏日志').attr('name','show');
				//mainPage.showLayout(0,0);
			}
		});
	
	
	//通讯控件事件绑定
	document.getElementById("commonOcx").attachEvent("onSDKMessage", function (lMsgType, strContent)
	{
		switch (lMsgType)
		{
			//心跳
		case 0x0000:
			{
				// log.debug("回调事件. 心跳   类型："+lMsgType);
				break;
			}
			//返回登录信息
		case 0x0002:
			{
				//log.debug("回调事件. 登录   类型："+lMsgType);
				doReturnLogina(strContent);
				break;
			}
			//收到某一个摄像机关联的Host信息
		case 1541:
			{
				// log.debug("回调事件. 收到某一个摄像机关联的Host信息   类型："+lMsgType);
				doParseHostInfor(strContent);
				break;
			}
		case 1550: // 通信控件 调用StartVod 返回结果
			{
				//log.debug("回调事件. 播放视频   类型："+lMsgType);
				doReturnStartVod(strContent);
				break;
			}
		case 1553: // 通信控件 通知时间线信息
			{
				log.debug("视频播放时间线事件：" + strContent);
				// mainPage.timeLineObj.SetPlayTimeShow(strContent);//layoutCtrl(strContent);
				break;
			}
		case 1564: // 摄像机组信息列表
			{
				log.debug("回调事件. 获取摄像机组信息   类型：" + lMsgType);
				doReturnCarmeraGroup(strContent);
				break;
			}
			// 返回实时摄像机列表
		case 1566:
			{
				log.debug("回调事件. 获取摄像机列表   类型：" + lMsgType);
				doParseCarmeraList(strContent);
				break;
			}
			// 返回某一路摄像机历史记录
		case 1568:
			{
				log.debug("回调事件. 返回相机历史记录   类型：" + lMsgType);
				doParseHistoryVideo(strContent);
				break;
			}
		default:
			//log.debug("信息类型:"+lMsgType + "信息内容:"+ strContent);
			break;
		}
	});
	
	//右上角时间显示
	$("#dayspan").text((new Date()).toString());
	window.setInterval(function ()
	{
		$("#dayspan").text((new Date()).toString());
	}, "30000");
	
	//登陆弹出框设定
	$("#logindiv").dialog(
	{
		autoOpen : false,
		width : 330,
		height : 280,
		modal : true,
		bgiframe : true,
		title : "登录系统",
		overlay :
		{
			opacity : 0.8,
			background : "black"
		},
		close : function (event, ui)
		{
			showObject(1);
			$("#loginlogspan").hide();
		}
	}
	);
	
	//登陆菜单"登陆/注销"事件，需要先切换到“直播”界面，否则登陆框无法顶层显示
	$("#welcomespan").click(function ()
	{
		$("#liveA").trigger('click');
		//延迟1秒
		window.setTimeout(function ()
		{
			if (!islogin)
			{
				$("#logindiv").dialog("open");
				showObject(0);
			}
			else
			{
				logout();
			}
		}, "1000");
	}
	);
	
	$("#configA").click(function ()
	{
		openwindow('editConfig.do?method=view', '系统设置', 500, 200);
	}
	);
	
	//登陆事件
	$("#loginButton").click(function ()
	{
		if (!loginvalidate())
		{
			return;
		}
		else
		{
			//注册通讯空间
			if (!commonOcxObj)
			{
				// 日志
				log.error("无法获取调用通信控件!");
				return;
			}
			//key = commonOcxObj.Initialize(0);
			var r = commonOcxObj.ConnectToServer(key, hostName, hostPort);
			// 连接服务器成功
			if (r != 0)
			{
				log.error("连接服务器失败！请检查服务器地址和端口");
				$("#loginlogspan").show();
				$("#loginerrlog").text("连接服务器失败！请检查服务器地址和端口");
				return;
			}
			$("#loginlogspan").hide();
			log.debug("连接服务器成功！正在登录...");
			commonOcxObj.UserLogin(key, userName, userPwd);
			
			//成功的话，关闭登陆框
			showObject(1);
			$("#logindiv").dialog("close");
		}
	});
	
	//初始化界面为登陆页面 --等待两秒，等其他页面加载完
	//window.setTimeout("$('#welcomespan').trigger('click');", 1500);
	//$('#loginA').trigger('click');
	
	//将顶部菜单与左侧菜单关联起来
	$("#liveA").click(function ()
	{
		leftPage.showsubmenus(1);
		//mainPage = document.getElementById("mainNav").contentWindow;
	}
	);
	
	$("#historyA").click(function ()
	{
		leftPage.showsubmenus(2);
		//mainPage = document.getElementById("mainNav").contentWindow;
	}
	);
	$("#managerA").click(function ()
	{
		//
	}
	);
	
}
);

//注销
function logout()
{
	if (commonOcxObj != null)
	{
		commonOcxObj.UserLogout(key);
	}
	// 清除日志
	log.clear();
	//清空左侧摄像机列表区
	leftPage.clear();
	
	$("#welcomespan").html("登&nbsp;录");
	islogin = false;
	$("#namespan").text('');
	$('#welcomespan').trigger('click');
}

//登陆验证
function loginvalidate()
{
	//ip
	var ip = $("#ip").val();
	if (!ip)
	{
		alert("ip地址不能为空");
		$("#ip").focus();
		return false;
	}
	if (ip.match(/(d+).(d+).(d+).(d+)/g))
	{
		alert("ip地址格式错误");
		return false;
	}
	var parts = ip.split(".");
	for (var i = 0, l = parts.length; i < l; i++)
	{
		if (parseInt(parts[i]) > 255)
		{
			alert("ip地址不正确");
			return false;
		}
	}
	
	//port
	var port = $("#port").val();
	if (!port)
	{
		alert("端口号不能为空");
		$("#port").focus();
		return false;
	}
	else
	{
		if (isNaN(port) || parseInt(port) > 25535 || parseInt(port) < 0)
		{
			alert("端口号信息不正确");
			$("#port").focus();
			return false;
		}
	}
	
	//用户名，密码
	var username = $("#username").val();
	if (!username)
	{
		alert("用户名不能为空");
		$("#username").focus();
		return false;
	}
	var password = $("#password").val();
	if (!password)
	{
		alert("密码不能为空");
		$("#password").focus();
		return false;
	}
	
	hostName = ip;
	hostPort = port;
	userName = username;
	userPwd = password;
	return true;
}

//获取摄像机组命令
function getCameraGroupCommand()
{
	commonOcxObj.GetCameraGroup(key);
}

// 获取摄像机列表  命令
function getCamerasCommand()
{
	commonOcxObj.GetCamera(key);
}

//返回登录信息
function doReturnLogina(content)
{
	var xmlDoc = getXMLDoc(content);
	var key = -1;
	var descption = "";
	var elements = xmlDoc.getElementsByTagName("RetUserLogin");
	for (var i = 0; i < elements.length; i++)
	{
		key = elements[i].getElementsByTagName("ret")[0].getElementsByTagName("iValue")[0].firstChild.nodeValue;
		descption = elements[i].getElementsByTagName("ret")[0].getElementsByTagName("description")[0].firstChild.nodeValue;
	}
	
	//登录成功
	if (key == 0)
	{
		log.println("登录成功 ");
		$("#welcomespan").html("注&nbsp;销");
		$("#loginlogspan").hide();
		islogin = true;
		$("#namespan").text(userName);
		//列出相机组与相机
		getCameraGroupCommand();
		getCamerasCommand();
	}
	else
	{
		//登录失败
		log.error("登录失败 ：" + descption);
		$("#loginlogspan").show();
		$("#loginerrlog").text("登录失败:" + descption);
		showObject(0);
		$("#logindiv").dialog("open");
	}
}

//解析一路摄像机信息
function doParseHostInfor(content)
{
	var xmlDoc = getXMLDoc(content);
	//var cameraId = 0;
	var wndId = 0;
	//var codeRate = 0;
	//var videoFormat = 0;
	//var codeType =0;
	//var fps = 0;
	//var resloution = 0;
	var playType = 0;
	var palyAddr = "";
	var playPort = 0;
	//var encAddr = "";
	var elements = xmlDoc.getElementsByTagName("RetStartLive");
	for (var i = 0; i < elements.length; i++)
	{
		// cameraId = elements[i].getElementsByTagName("ubiCameraId")[0].firstChild.nodeValue;
		wndId = elements[i].getElementsByTagName("ubiWndId")[0].firstChild.nodeValue;
		codeRate = elements[i].getElementsByTagName("uiCodecRate")[0].firstChild.nodeValue;
		videoFormat = elements[i].getElementsByTagName("uiVideoFormat")[0].firstChild.nodeValue;
		codeType = elements[i].getElementsByTagName("uiCodecType")[0].firstChild.nodeValue;
		fps = elements[i].getElementsByTagName("uiFPS")[0].firstChild.nodeValue;
		resloution = elements[i].getElementsByTagName("uiResloution")[0].firstChild.nodeValue;
		playType = elements[i].getElementsByTagName("uiPlayType")[0].firstChild.nodeValue;
		palyAddr = elements[i].getElementsByTagName("szPlayAddr")[0].firstChild.nodeValue;
		playPort = elements[i].getElementsByTagName("uiPlayPort")[0].firstChild.nodeValue;
		encAddr = elements[i].getElementsByTagName("szEncAddr")[0].firstChild.nodeValue;
	}
	// 调用实时播放页面播放方法
	mainPage.startRealPlay(palyAddr, playPort, playType, wndId, key);
}

function doReturnStartVod(content)
{
	var xmlDoc = getXMLDoc('<?xml version="1.0" encoding="UTF-8"?>' + content);
	
	var elements = xmlDoc.getElementsByTagName("RetStartVOD");
	sessionId = elements[0].getElementsByTagName("ubiSessionId")[0].firstChild.nodeValue;
	//var count = elements[0].getElementsByTagName("uiCount")[0].firstChild.nodeValue;
	
	var es = xmlDoc.getElementsByTagName("ResultDest");
	//var cId = 0;
	//var monitorId = 0;
	//var videoFormat = 0;
	//var codecType = 0;
	var destIp = "";
	var destPort = 0;
	cId = es[0].getElementsByTagName("ubiCameraId")[0].firstChild.nodeValue;
	monitorId = es[0].getElementsByTagName("ubiMonitorId")[0].firstChild.nodeValue;
	videoFormat = es[0].getElementsByTagName("uiVideoFormat")[0].firstChild.nodeValue;
	codecType = es[0].getElementsByTagName("uiCodecType")[0].firstChild.nodeValue;
	destIp = es[0].getElementsByTagName("szDestIP")[0].firstChild.nodeValue;
	destPort = es[0].getElementsByTagName("uiDestPort")[0].firstChild.nodeValue;
	
	// 调用  播放控件 StartVod
	mainPage.startVod(destIp, destPort, 4, 0, key);
}

//返回摄像机组信息
function doReturnCarmeraGroup(content)
{
	var xmlDoc = getXMLDoc(content);
	var key = -1;
	var elements = xmlDoc.getElementsByTagName("RetGetCameraGroup");
	key = elements[0].getElementsByTagName("ret")[0].getElementsByTagName("iValue")[0].firstChild.nodeValue;
	if (key == 0)
	{
		var groups = xmlDoc.getElementsByTagName("CameraGroupRes");
		for (var i = 0; i < groups.length; i++)
		{
			var parentId = groups[i].getElementsByTagName("ubiParentId")[0].firstChild.nodeValue;
			var groupId = groups[i].getElementsByTagName("ubiCameraGroupId")[0].firstChild.nodeValue;
			var groupName = groups[i].getElementsByTagName("szName")[0].firstChild.nodeValue;
			leftPage.inserOneGroup(parentId, groupId, groupName);
		}
	}
	else
	{
		//  登录失败
		log.error("获取摄像机组失败 " + descption);
	}
}

//解析处理摄像机列表
function doParseCarmeraList(content)
{
	var xmlDoc = getXMLDoc(content);
	var elements = xmlDoc.getElementsByTagName("CameraRes");
	for (var i = 0; i < elements.length; i++)
	{
		var groupId = elements[i].getElementsByTagName("ubiCameraGroupId")[0].firstChild.nodeValue;
		var id = elements[i].getElementsByTagName("ubiCameraId")[0].firstChild.nodeValue;
		var name = elements[i].getElementsByTagName("szName")[0].firstChild.nodeValue;
		// 页面输出展示
		leftPage.insertOneCamera(groupId, id, name);
	}
	//log.println("获取摄像机列表");
}

/**
 * 解析一路摄像机历史视频记录
 */
function doParseHistoryVideo(content)
{
	hisVideoXmlArr = new Array();
	var xmlDoc = getXMLDoc(content);
	var elements = xmlDoc.getElementsByTagName("RetGetHistory");
	var cameraId = elements[0].getElementsByTagName("ubiCameraId")[0].firstChild.nodeValue;
	var historys = xmlDoc.getElementsByTagName("sHistoryInfo");
	var videoArr = xmlDoc.getElementsByTagName("array");
	if (!videoArr || (videoArr.length > 0))
	{
		hisVideoXmlArr[0] = ["C" + cameraId, historys.length, videoArr[0].xml];
	}
	var startTime = 0;
	var endTime = 0;
	for (var i = 0; i < historys.length; i++)
	{
		startTime = historys[i].getElementsByTagName("tStartTime")[0].firstChild.nodeValue;
		endTime = historys[i].getElementsByTagName("tEndTime")[0].firstChild.nodeValue;
		codecType = historys[i].getElementsByTagName("uiCodecType")[0].firstChild.nodeValue;
		videoFormat = historys[i].getElementsByTagName("uiVideoFormat")[0].firstChild.nodeValue;
		// 输出 展示  时间要X1000，返回的是秒，不是毫秒
		leftPage.insertOneHistoryVideo(cameraId, cameraId + "摄像机", startTime * 1000, endTime * 1000);
		hisVideoXmlArr[hisVideoXmlArr.length] = [cameraId + "_" + (startTime * 1000) + "_" + (endTime * 1000), 1, "<array>" + historys[i].xml + "</array>"];
		log.debug(historys[i].xml);
	}
	//(long lCamIndex, LPCTSTR strCamName, LPCTSTR strCamId, LPCTSTR strHisData, long lRecCount)
	//	top.mainPage.timeLineObj.SetCamHisInfo(1,currcameraName, cameraId,,	historys.length);
}

//解析处理XML
function getXMLDoc(xmlString)
{
	var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
	for (var i = 0; i < xmlDomVersions.length; i++)
	{
		try
		{
			xmlDoc = new ActiveXObject(xmlDomVersions[i]);
			xmlDoc.async = false;
			xmlDoc.loadXML(xmlString);
			return xmlDoc;
		}
		catch (e)
		{
			// 暂时屏蔽异常
			//log.println(e);
		}
	}
}

//根据摄像机ID 调用 通信控件播放方法
function getCameraStartLiveCommand(cameraId)
{
	currCameraId = cameraId = cameraId.substring(1, cameraId.length);
	var versionId = 0; // 版本号
	var playType = 4; //1: UDP组播; 2: UDP单播; 3: TCP服务端; 4: TCP客户端
	var reviceIpAddr = ""; //接收端码流 若uiPlayType为TCP客户端，该值可忽略，填空
	var revicePort = 0; //若uiPlayType为TCP客户端，该值可忽略，填0
	var playStreamType = 0; //0: 自动分配码流; 1: 码流1; 2: 码流2;  3: 码流3
	commonOcxObj.startLive(key, cameraId, mainPage.wndId, versionId, playType, reviceIpAddr, revicePort, playStreamType);
}

//关闭\刷新页面时，强制注销
function confirmclose()
{
	if (islogin)
	{
		//强制注销，以免引起所有用户都都占用的情况
		//event.returnValue="确定离开当前页面吗？";
		logout();
		return true;
	};
};

//登陆弹出层 无法遮挡自定义控件object,所以需要隐藏起来，在登录完成（关闭登陆框）后再显示。
function showObject(isshow)
{
	isshow = (isshow == '1' ? 'block' : 'none');
	leftPage.document.getElementById("ptzDiv").style.display = isshow;
	mainPage.document.getElementById("playdivs").style.display = isshow;
}

//系统设置弹出窗口
function openwindow(url, name, iWidth, iHeight)
{
	var iTop = (window.screen.availHeight - 30 - iHeight) / 2; //获得窗口的垂直位置;
	var iLeft = (window.screen.availWidth - 10 - iWidth) / 2; //获得窗口的水平位置;
	window.open(url, name, 'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
}

/**
 * 显示时间线？
 */
function setPlayTimeShow(time)
{
	mainPage.timeLineObj.SetPlayTimeShow(time);
}

/**
 * 一键切换
 * --根据摄像头数量与当前窗口播放器数量，自动匹配
 */
function autoMapping()
{
	//获取当前根节点的所有子节点，以，分割
	var noteids = leftPage.realTree.getAllSubItems(1);
	var noteArr = noteids.split(',');
	var index = 0;
	var tmpcameraid = '';
	for (var i = 0, len = noteArr.length; i < len; i++)
	{
		// c开头的id才是真实摄像机id ，否则跳过
		if (noteArr[i].indexOf('C') != 0)
		{
			continue;
		}
		else
		{
			tmpcameraid = noteArr[i].substring(1, noteArr[i].length);
			//如果是单屏，有可能当前窗口不是原始的1号窗口
			if (mainPage.winNum == 1)
			{
				index = mainPage.wndId;
			}
			else
			{
				index++;
			}
			commonOcxObj.startLive(key, tmpcameraid, index, 0, 4, '', 0, 0);
			//当前窗口铺满则停止
			if (index == mainPage.winNum)
			{
				return;
			}
		}
	}
}

//是否全屏
var iffulldocument = false;
var mainAreaHeight = 0;
var mainAreaWidth = 0;
/**
 *全屏事件
 **/
function fullDocument()
{
	
	//恢复原始窗口分布
	if (iffulldocument)
	{
		log.debug("退出全屏");
		iffulldocument = false;
		$("#topDiv,#div_arrow_down,#leftDiv,#div_arrow").show();
		$("#mainDiv").height(mainAreaHeight).width(mainAreaWidth);
		$("#mainDiv");
	}
	//全屏
	else
	{
		log.debug("全屏");
		iffulldocument = true;
		mainAreaHeight = $("#mainDiv").height();
		mainAreaWidth = $("#mainDiv").width();
		$("#topDiv,#div_arrow_down,#leftDiv,#div_arrow").hide();
		//变换为隐藏日志模式
		$("#imgSpilitdown").attr('name', 'show');
		$("#imgSpilitdown").trigger('click');
		
		$("#mainDiv").height($(window).height()).width("100%"); //？？？高度不够精确
	}
}

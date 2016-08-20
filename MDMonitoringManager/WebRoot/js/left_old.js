//日志对象
var realTree;
var treeInFind;
var historyVideoTree;
//PTZ  对象
var ptzObj;
var log;
var livetreeheight;

$(function ()
{
	log = top.log;
	//初始化摄像头列表
	initRealCamera();
	// 初始化 检索区域 摄像机
	initCameraInFind();
	// 初始化 历史视频文件
	initHistoryVideo();
	// PTZ 控件初始化
	ptzObj = document.getElementById("ptzObj");
	ptzObj.EnablePtzOp(1);
	// ptzObj.Invalidate();
	//ptzObj.Visible = true;
	
	//精准设置右侧主工作区域宽度
	livetreeheight = $(window).height() - $("#leftmenu").height() - $("#ptzDiv").height();
	$("#CameraLiveTreeDiv").css('height', livetreeheight);
	
	$(window).resize(function ()
	{
		livetreeheight = $(window).height() - $("#leftmenu").height() - $("#ptzDiv").height();
		$("#CameraLiveTreeDiv").css('height', livetreeheight);
	}
	);
	
	$(".left_title>ul>li").click(function ()
	{
		$(".left_title>ul>li").css('background', '#97cbff');
		$(this).css('background', '#cbcbff');
	}
	);
	
	//opt 方向控制事件注册
	ptzObj.attachEvent('PtzOperater', function (x, XSpeed, y, YSpeed)
	{
		var preXSpeed = preYSpeed = 0;
		var action = 0;
		// log.debug("PTZ操作：方向操作  代码：XDirection:"+x+" XSpeed:"+XSpeed+" YDirection:"+y+" YSpeed:"+YSpeed);
		
		//x轴控制
		//向左
		if (x < 0 && preXSpeed != XSpeed)
		{
			action = 2;
		}
		//向右
		else if (x > 0 && preXSpeed != XSpeed)
		{
			action = 1;
		}
		realPTZOperator(action, XSpeed);
		preXSpeed = XSpeed;
		
		//y轴控制  上3  下4
		if (y < 0 && preYSpeed != YSpeed)
		{
			action = 4;
		}
		//向右
		else if (y > 0 && preYSpeed != YSpeed)
		{
			action = 3;
		}
		realPTZOperator(action, YSpeed);
		preYSpeed = YSpeed;
		
	}
	);
	
	//opt 控件事件注册
	document.getElementById("ptzObj").attachEvent('PtzButtonOperater', function (MsgType, bEnable)
	{
		log.debug(MsgType);
		switch (MsgType)
		{
		case 9: //  9 true 9 false 放大
			//bEnable 按下（放大），弹起（停止放大），
			log.debug("PTZ操作：" + (bEnable ? '放大' : '停止放大'));
			realPTZOperator(9, bEnable ? 1 : 0);
			break;
		case 10: //  10 true  10 false 缩小
			log.debug("PTZ操作：" + (bEnable ? '缩小' : '停止缩小'));
			realPTZOperator(10, bEnable ? 1 : 0);
			break;
		case 11: // 11 true  11 false  近焦
			log.debug("PTZ操作：" + (bEnable ? '近调焦' : '停止近调焦'));
			realPTZOperator(11, bEnable ? 1 : 0);
			break;
		case 12: // 12 true  12  false 远焦
			log.debug("PTZ操作：" + (bEnable ? '远调焦' : '停止远调焦'));
			realPTZOperator(12, bEnable ? 1 : 0);
			break;
		case 13: // 13 true  13  false 光圈大
			log.debug("PTZ操作：" + (bEnable ? '光圈大' : '停止光圈大'));
			realPTZOperator(13, bEnable ? 1 : 0);
			break;
		case 14: //  14 true  14 false 光圈小
			log.debug("PTZ操作：" + (bEnable ? '光圈大' : '停止光圈大'));
			realPTZOperator(14, bEnable ? 1 : 0);
			break;
		case 15: // 15 true 15 false  设置预置位
			log.debug("PTZ操作：" + '设置预置位');
			realPTZOperator(15, 1);
			break;
		case 16: // 16 true 16 false  调用预置位
			log.debug("PTZ操作：调用预置位");
			realPTZOperator(16, 1);
			break;
		case 17: //  17 true 17 false 灯开关
			log.debug("PTZ操作：" + (bEnable ? '开灯' : '关灯'));
			realPTZOperator(17, bEnable ? 1 : 0);
			break;
		default:
			break;
		}
	}
	);
	
}
);

//实际PTZ控制
function realPTZOperator(action, speed)
{
	var result = top.commonOcxObj.ReqPTZ(top.key, top.currCameraId, action, speed, 0);
	if (result != 0)
	{
		log.warn("PZT 操作失败 .   错误代码：" + result);
	}
}

//左侧树区域  点击事件
function showsubmenus(num)
{
	// 主页面 切换
	if (num == 1)
	{
		$("#liveDiv").show();
		$("#content_2").hide();
		parent.document.getElementById("mainNav").src = "video/live.html";
	}
	else if (num == 2)
	{
		$("#liveDiv").hide();
		$("#content_2").show();
		top.document.getElementById("mainNav").src = "video/history.html";
	}
}

// 初始化 实时播放区域
function initRealCamera()
{
	realTree = new dhtmlXTreeObject("CameraLiveTreeDiv", "100%", "100%", 0);
	realTree.setImagePath("./javascript/codebase/imgs/csh_bluefolders/");
	realTree.enableCheckBoxes(0);
	realTree.insertNewChild(0, 1, "摄像机列表");
	//添加点击事件  根据摄像机ID 获取Host信息
	realTree.attachEvent("onClick", function (nodeId)
	{
		// 该id包含 标识符 c 需要取消c 才是真实摄像机id
		if (nodeId)
		{
			var v = nodeId.indexOf('C');
			if (v != 0)
			{
				return;
			}
			log.debug("尝试播放摄像头视频   摄像机：" + realTree.getItemText(nodeId));
			top.currcameraName = realTree.getItemText(nodeId);
			parent.getCameraStartLiveCommand(nodeId);
		}
	});
}

// 初始化 检索区域 摄像机
function initCameraInFind()
{
	treeInFind = new dhtmlXTreeObject("cameraHisTreeDiv", "100%", "100%", 0);
	treeInFind.setImagePath("./javascript/codebase/imgs/csh_bluefolders/");
	// 支持多选
	treeInFind.enableCheckBoxes(1);
	treeInFind.insertNewChild(0, 1, "摄像机列表");
	
	// 选择事件注册--列出该摄像头的历史视频记录列表
	treeInFind.setOnCheckHandler(function ()
	{
		//清除所有子节点数据
		historyVideoTree.deleteChildItems(1);
		// 返回被选择的 Id集合 以 逗号分隔
		var selectIds = treeInFind.getAllChecked() + ""; // 转换为字符串
		
		if (selectIds.length <= 0)
			return;
		var ids = new Array();
		ids = selectIds.split(",");
		
		//* 否则会形成循环
		for (var i = 0; i < ids.length; i++)
		{
			// 显示 节点
			var cameraName = treeInFind.getItemText(ids[i]);
			historyVideoTree.insertNewChild(1, ids[i], cameraName); // 新建摄像机ID节点
			top.currCameraId = ids[i];
			top.currcameraName = cameraName;
			getHistoryVideoCommand(ids[i]);
		}
	}
	);
}

//历史视频
function initHistoryVideo()
{
	var myheight = $(window).height() - $("#leftmenu").height() - $("#cameraHisTreeDiv").height() - 5;
	$("#videoTreeDiv").height(myheight + "px");
	$(".containerTableStyle").height("100%");
	historyVideoTree = new dhtmlXTreeObject("videoTreeDiv", "100%", livetreeheight + "px", 0);
	historyVideoTree.setImagePath("./javascript/codebase/imgs/csh_bluefolders/");
	// 支持多选
	historyVideoTree.enableCheckBoxes(0);
	historyVideoTree.insertNewChild(0, 1, "录像列表");
	//添加事件 单击播放
	historyVideoTree.attachEvent("onClick", function (nodeId)
	{
		log.debug("播放摄像头视频录像：" + nodeId);
		// 该nodeid 格式 :摄像机_开始时间_结束时间        ???????双击摄像头（父节点）时，有问题
		var temp = new Array();
		if (nodeId.indexOf('_') == -1)
		{
			return;
		}
		temp = nodeId.split("_");
		if (temp.length != 3)
			return;
		var cameraId = temp[0];
		var startTime = temp[1];
		var endTime = temp[2];
		var port = 0; // 默认为0
		var widId = 0; // 窗口编号
		top.commonOcxObj.StartVOD(top.key, startTime, endTime, port, cameraId, widId);
		
		var tmpxmlcontent = '';
		var conttentcnt = 1;
		for (var i = 0; i < top.hisVideoXmlArr.length; i++)
		{
			if (top.hisVideoXmlArr[i][0] == nodeId)
			{
				//xml内容，包含开始时间，结束时间
				tmpxmlcontent = top.hisVideoXmlArr[i][2];
				//几个视频片段
				conttentcnt = top.hisVideoXmlArr[i][1];
				break;
			}
			
		}
		//去掉xml文档中的\t\n\r
		tmpxmlcontent = tmpxmlcontent.replace(/\r/g, "").replace(/\n/g, "").replace(/\t/g, '');
		//(long lCamIndex, LPCTSTR strCamName, LPCTSTR strCamId, LPCTSTR strHisData, long lRecCount)
		top.mainPage.timeLineObj.SetCamHisInfo(1, historyVideoTree.getItemText("C" + cameraId), cameraId, tmpxmlcontent, conttentcnt);
		//top.setPlayTimeShow(endTime-startTime);
	}
	);
}

// 插入一个摄像机
function insertOneCamera(groupId, cameraId, cameraName)
{
	var groupIdT = 0;
	// 为防止重复 将  摄像机组ID 摄像机id 进行转换处理
	// 如果 等于 0 没有分组   在页面祖节点 为1 所以进行转换
	if (groupId != 0)
	{
		groupIdT = "G" + groupId;
	}
	else
	{
		groupIdT = 1;
	}
	var cameraIdT = "C" + cameraId;
	realTree.insertNewChild(groupIdT, cameraIdT, cameraName);
	// 检索区域输出
	treeInFind.insertNewChild(groupIdT, cameraIdT, cameraName);
	
}

// 插入一个摄像机组
function inserOneGroup(parentId, groupId, groupName)
{
	var groupIdT = "G" + groupId;
	realTree.insertNewChild(1, groupIdT, groupName);
	//检索区域输出
	treeInFind.insertNewChild(1, groupIdT, groupName);
}

// 显示 一条 摄像机 历史视频
function insertOneHistoryVideo(carmeId, carmeName, startTime, endTime)
{
	var s = new Date();
	s.setTime(startTime);
	// 转换拼接为  年月日 时分秒 格式
	var start = s.format('yyyy-MM-dd hh:mm:ss');
	
	var e = new Date();
	e.setTime(endTime);
	var end = e.format('yyyy-MM-dd hh:mm:ss');
	var ids = historyVideoTree.getSubItems(1) + ""; // 转换为字符串
	var idArray = ids.split(",");
	var flag = false; // 不存在该节点
	for (var i = 0; i < ids.length; i++)
	{
		id = idArray[i]; // 节点id
		if (id == "C" + carmeId)
		{
			flag = true;
			break;
		}
	}
	if (flag)
	{
		historyVideoTree.insertNewChild("C" + carmeId, carmeId + "_" + startTime + "_" + endTime, start + "_" + end);
	}
}

// 发送获取摄像机历史视频  命令
function getHistoryVideoCommand(cameraId)
{
	if (!cameraId)
	{
		return;
	}
	// 判断是否以 C 开头 c开头摄像机编号
	var v = cameraId.indexOf('C');
	if (v != 0)
	{
		return;
	}
	cameraId = cameraId.substring(1, cameraId.length);
	var videoTagId = 0; //帧标记 默认为 0
	var startTime = 0; //
	var endTime = 0; // 开始结束时间 默认为0 检索该摄像机全部
	top.commonOcxObj.GetHistory(top.key, videoTagId, cameraId, startTime, endTime);
}

//清空全部树控件数据
function clear()
{
	realTree.deleteChildItems(1);
	treeInFind.deleteChildItems(1);
	historyVideoTree.deleteChildItems(1);
}

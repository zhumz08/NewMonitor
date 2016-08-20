//////////////////
///左侧菜单，树的功能部分
//////////////////
//实时摄像头列表树
var realTree;
//历史视频摄像头列表树
var hisTree;
//历史视频列表树
var videoTree;

//PTZ  对象
var ptzObj;

$(function()
{
	//初始化树形菜单
	initRealTree();
	//视频列表树
	initVideoTree();
	//初始化 视频列表树
	initHistoryTree();
	
	//检索 菜单点击时显示“PTZ”
	$("#jiansuoLi").click(function()
	{
		$("#ptzDiv").hide();
		$("#videoListDiv").show();
	});
	
	//“摄像机”时  显示历史摄像头树，隐藏ptz
	$("#shexiangjili").click(function()
	{
		$("#ptzDiv").show();
		$("#videoListDiv").hide();
	});
	
	//预制位数字区域点击事件
	$(".figure_a").click(function()
	{
		var yuzhiwei=$("#yuzhiwei");
		var tmpkey=$(this).text();
		var max=yuzhiwei.attr("max");
		if(isNaN(tmpkey))
		{
			if(tmpkey=='C')
			{
				yuzhiwei.val('');
			}else
			{
				var aa=yuzhiwei.val();
				if(aa.length>0)
				{
					yuzhiwei.val(aa.substring(0,aa.length-1));
				}
			}
		}else
		{
			//预知为最长只能输入5位数
			if(parseInt(yuzhiwei.val()+tmpkey)<parseInt(max))
			{
				yuzhiwei.val(yuzhiwei.val()+tmpkey);
			}
		}
	});
	
	$("#yuzhiwei").change(function()
	{
		var yuzhiwei=$(this).val();
		if(isNaN(yuzhiwei))
		{
			$("#yuzhiwei").val(1);
			return;
		}else
		{
			yuzhiwei=parseInt(yuzhiwei);
			if(yuzhiwei<1)
			{
				$("#yuzhiwei").val(1);
			}else
			{
				$("#yuzhiwei").val(yuzhiwei);
			}
			
		}
		
	});
	
	//预制位左右按钮事件，加一，减一
	$(".turning").click(function()
	{
		var yuzhiwei=$("#yuzhiwei");
		var yuzhiweiV=yuzhiwei.val();
		var min=parseInt(yuzhiwei.attr("min"));
		var max=parseInt(yuzhiwei.attr("max"));
		if(isNaN(yuzhiweiV))
		{
			yuzhiwei.val(min);
			return;
		};
		yuzhiweiV=parseInt(yuzhiweiV);
		if($(this).attr('id')=='prevA')
		{
			if(yuzhiweiV>min)
			{
				yuzhiwei.val(yuzhiweiV-1);
				return;
			}
		}else
		{
			if(yuzhiweiV<max)
			{
				yuzhiwei.val(yuzhiweiV+1);
				return;
			}
		}
	});
	
	//PTZ操作
	$(".icons-left-bg").mousedown(function()
	{
		PTZOperator($(this).attr('name'), 'down')
	}).mouseup(function()
	{
		PTZOperator($(this).attr('name'), 'up')
	});
	
	/**
	 * 数字预制位调用
	 */
	$("#dyzwA").click(function()
	{
		var yzwNo=$("#yuzhiwei").val();
		if(yzwNo&&currCameraId)
		{
			log.debug("调用预制位："+yzwNo);
			var result =commonOcxObj.ReqPTZ(userKey, currCameraId, 16, yzwNo, 0);
			if (result != 0)
			{
				log.warn("PZT 操作失败 .   错误代码：" + result+" 预制位不存在？");
			}
		}
	});
});

//ptz 动作对应日志   格式为  [action,'第二次/停止动作前缀','开始/第一次动作前缀','动作']
var ptz=[
         ['1','停止','','向右'],
         ['2','停止','','向左'],
         ['3','停止','','向上'],
         ['4','停止','','向下'],
         ['9','停止','','放大'],
         ['10','停止','','缩小'],
         ['11','停止','','近调焦'],
         ['12','停止','','远调焦'],
         ['13','停止','','光圈大'],
         ['14','停止','','光圈小'],
         ['15','','','设置预置位'],
         ['16','','','调用预置位'],
         ['17','关灯','开灯',''],
         ['20','关闭','开启','雨刷']
         ];

//闪光灯状态
var lightOpen=0;

/**
*PTZ事件
*@param action 事件类型
*@param speed 速度/开关
*/
function PTZOperator(action, speed)
{
	
	//鼠标按下 为1 ‘开’、开始调用，鼠标抬起为 0“停止调用”
	if(speed=='down')
	{
		speed=1;
		//预制位设置，调用，需要提取参数 预制位号码
		if(action==15||action==16)
		{
			speed=$("#yuzhiwei").val();
			if(!speed)
			{
				speed=1;
				$("#yuzhiwei").val('1');
			}
		}
		
		//闪光灯的操作为点一下开，再点一下关
		if(action==17)
		{
			if(!lightOpen)
			{
				lightOpen=1;
			}else
			{
				lightOpen=0;
				speed=0;
			}
		}
	}else
	{
		speed=0;
		//闪光灯，预制位 操作，没有抬起操作
		if(action>=15&&action<20)
		{
			return ;
		}
	}
	realPTZOperator(action, speed)
	
}

 
 /**
  * 实际PTZ控制
  * @param action
  * @param speed
  */
function realPTZOperator(action, speed)
{
	
	if((action<=4)&&(speed==1))
	{
		speed=50;
	}
	//log.debug('动作：'+action+" speed:"+speed);
	var result=0;
	
	for(var i=0,len=ptz.length;i<len;i++)
	{
		if(ptz[i][0]==action)
		{
			log.debug("PTZ操作："+ptz[i][speed>=1?2:1]+ptz[i][3]);
			break;
		}
	}
	if(action)
	{
		 result = commonOcxObj.ReqPTZ(userKey, currCameraId, action, speed, 0);
	}
	
	if (result != 0)
	{
		log.error("PZT 操作失败 .   错误代码：" + result);
	}
}

/**
 * 插入一个摄像机组
 */ 
function inserOneGroup(parentId, groupId, groupName)
{
	var groupIdT = "G" + groupId;
	var parentIdT = parentId==0?1:("G" + parentId);
	//实时摄像头区域插入节点
	realTree.insertNewChild(parentIdT, groupIdT, groupName);
	//检索区域插入节点
	hisTree.insertNewChild(parentIdT, groupIdT, groupName);
}

/**
 * 插入一个摄像机
 */
function insertOneCamera(groupId, cameraId, cameraName)
{
	var groupIdT = 0;
	// 为防止重复 将  摄像机组ID加前缀G 摄像机id加前缀C
	groupId=(groupId==0?1:"G"+groupId);
	cameraId="C"+cameraId;
	
	//实时摄像头区域
	realTree.insertNewChild(groupId,cameraId, cameraName);
	// 检索区域输出
	hisTree.insertNewChild(groupId, cameraId, cameraName);
}

/**
 * 初始化 实时播放树形菜单
 */
function initRealTree()
{
	realTree = new dhtmlXTreeObject("cameraLiveTreeDiv", "100%", "100%", 0);
	realTree.setImagePath("./js/codebase/imgs/csh_bluefolders/");
	realTree.enableCheckBoxes(0);
	//realTree.insertNewChild(0, 1, "摄像机列表 (单击播放)");
	//添加单击事件  根据摄像机ID 获取Host信息
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
			log.debug("播放摄像头视频   摄像机ID：" + realTree.getItemText(nodeId));
			currCameraName = realTree.getItemText(nodeId);
			currCameraId =nodeId.substring(1, nodeId.length);
			//保存当前窗口绑定的摄像头信息
			winInfoArr[currWinNo]=[currCameraId,currCameraName];
			//getCameraStartLiveCommand(nodeId);
			playCarmVideo(currCameraId);
		}
	});
}

/**
 * 初始化历史视频摄像头树
 */
function initHistoryTree()
{
	hisTree = new dhtmlXTreeObject("cameraHisTreeDiv", "100%", "100%", 0);
	hisTree.setImagePath("./js/codebase/imgs/csh_bluefolders/");
	// 支持多选
	hisTree.enableCheckBoxes(1);
	//hisTree.insertNewChild(0, 1, "摄像机列表(勾选检索历史视频)");
	
	// 选择事件注册--列出该摄像头的历史视频记录列表 添加到视频列表树中
	hisTree.setOnCheckHandler(function ()
	{
		//清除所有子节点数据
		videoTree.deleteChildItems(1);
		// 返回被选择的 Id集合 以 逗号分隔
		var selectIds = hisTree.getAllChecked() + ""; // 转换为字符串
		
		if (selectIds.length <= 0)
			return;
		var ids = new Array();
		ids = selectIds.split(",");
		
		for (var i = 0; i < ids.length; i++)
		{
			// 显示 节点
			videoTree.insertNewChild(1, ids[i], hisTree.getItemText(ids[i])); // 新建摄像机ID节点
			
			var v = ids[i].indexOf('C');
			if (v != 0)
			{
				return;
			}
			var videoTagId = 0; //帧标记 默认为 0
			var startTime = 0; //
			var endTime = 0; // 开始结束时间 默认为0 检索该摄像机全部
			commonOcxObj.GetHistory(userKey, videoTagId, ids[i].substring(1, ids[i].length), startTime, endTime);
		}
	});	
}

/**
 * 单个摄像头历史视频列表
 */
function initVideoTree()
{
	videoTree = new dhtmlXTreeObject("VideoTreeDiv", "100%", "100%", 0);
	videoTree.setImagePath("./js/codebase/imgs/csh_bluefolders/");
	// 支持多选
	videoTree.enableCheckBoxes(0);
	videoTree.insertNewChild(0, 1, "录像列表 (单击播放视频)");
	//添加事件 单击播放
	videoTree.attachEvent("onClick", function (nodeId)
	{
		// 该nodeid 格式 :摄像机_开始时间_结束时间        ???????双击摄像头（父节点）时，有问题
		var temp = new Array();
		if (nodeId.indexOf('_') == -1)
		{
			return;
		}
		log.debug("播放摄像头视频录像：" + nodeId);
		temp = nodeId.split("_");
		if (temp.length != 3)
			return;
		var cameraId = temp[0];
		var startTime = temp[1];
		var endTime = temp[2];
		var port = 0; // 默认为0
		var widId = 0; // 窗口编号--视频只有一个端口
		commonOcxObj.StartVOD(userKey, startTime/1000, endTime/1000, port, cameraId, widId);
		
		var tmpxmlcontent = '';
		var conttentcnt = 1;
		for (var i = 0; i < top.hisVideoXmlArr.length; i++)
		{
			if (top.hisVideoXmlArr[i][0] == nodeId)
			{
				//xml内容，包含开始时间，结束时间
				tmpxmlcontent = hisVideoXmlArr[i][2];
				//几个视频片段
				conttentcnt = hisVideoXmlArr[i][1];
				break;
			}
		}
		//去掉xml文档中的\t\n\r
		tmpxmlcontent = tmpxmlcontent.replace(/\r/g, "").replace(/\n/g, "").replace(/\t/g, '');
		//(long lCamIndex, LPCTSTR strCamName, LPCTSTR strCamId, LPCTSTR strHisData, long lRecCount)
		timeLineObj.SetCamHisInfo(1, videoTree.getItemText("C" + cameraId), cameraId, tmpxmlcontent, conttentcnt);
		//top.setPlayTimeShow(endTime-startTime);
	});
}


/**
 * 添加 一条 摄像机 历史视频
 */
function insertOneHistoryVideo(carmeId, carmeName, startTime, endTime)
{
	var s = new Date();
	s.setTime(startTime);
	// 转换拼接为  年月日 时分秒 格式
	var start = s.format('yyyy-MM-dd hh:mm:ss');
	
	var e = new Date();
	e.setTime(endTime);
	var end = e.format('yyyy-MM-dd hh:mm:ss');
	var ids = videoTree.getSubItems(1) + ""; // 转换为字符串
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
		videoTree.insertNewChild("C" + carmeId, carmeId + "_" + startTime + "_" + endTime, start + "_" + end);
	}
}

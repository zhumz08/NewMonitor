var log;
var playOcx = document.getElementById("realPlay1");
leftPage = top.document.getElementById("leftNav").contentWindow;

//当前播放窗口
var wndId = 1;
//当前播放窗口数量
var winNum = 1;

var deviceType = 1;
var formatType = 0;
var playMode = 0; // 直播模式 0    本地文件 1
var key = 0; // 句柄

//是否满屏
var isfullscreem = false;

//截图，录像保存路径
var savepath = '';
window.onresize = function ()
{
	showLayout(0, 0);
};
$(function ()
{
	winNum = 1;
	log = top.log;
	playOcx = document.getElementById("realPlay1");
	$("div[id^='show']").attr('class', 'liveAreaDiv');
	
	$("#zoominA").click(function ()
	{
		log.debug(wndId + "号窗口单屏");
		showLayout(1, wndId);
	}
	);
	
	//占满整个屏幕
	$("#fullScreemA").click(function ()
	{
		log.debug("满屏");
		//第一个参数 是否满屏，第二个参数备用
		document.getElementById("realPlay" + wndId).SetFullScreenMode(1, 0);
	}
	);
	
	//占满整个浏览器可视区域
	$("#fullDocumentA").click(function ()
	{
		top.fullDocument();
	}
	);
	
	$("#autoMappingA").click(function ()
	{
		log.debug("一键切换.");
		top.autoMapping();
	}
	);
	
	//fullWidthScreemA
	
	//初始化布局
	showLayout(1);
	
	// 绑定解码器事件
	$("#playdivs object[id^='realPlay']").each(function ()
	{
		//开启解码器  ptz操作功能
		$(this).get(0).PTZControlCS(2, 1, 1, 0);
		
		// 绑定解码器事件
		var myobj = $(this);
		$(this).get(0).attachEvent('WindowProc', function (message, pram1, pram2)
		{
			//log.error(message);
			switch (message)
			{
				//l button down
			case 0x201:
				{
					//当前窗口背景变红
					var tmpwinid = myobj.attr('id').substring(8, myobj.attr('id').length);
					if (this.wndId != tmpwinid)
					{
						this.wndId = tmpwinid;
						log.debug("当前活动播放窗口:" + this.wndId);
						for (var i = 1; i <= 16; i++)
						{
							document.getElementById("realPlay" + i).colorBackGround = "0";
						}
						myobj[0].colorBackGround = "255";
						break;
					}
				}
			}
			
		}
		);
		
		//播放器pzt操作
		$(this).get(0).attachEvent('PTZEvent', function (lDirection, lRate)
		{
			//log.debug("lDirection:"+lDirection+" lRate"+(lRate & 0XF));
			var type = lDirection >> 4;
			//1-抬起，0-按下
			var state = (lDirection & 0XF);
			var action = 0;
			var action2 = 0;
			var speed = (lRate + 1) * 51;
			if (state)
			{
				speed = 0;
			}
			switch (type)
			{
			case 1: //上
				action = 3;
				break;
			case 2: //下
				action = 4;
				break;
			case 3: //左
				action = 2;
				break;
			case 4: //右
				action = 1;
				break;
			case 5: //左上
				action = 2;
				action2 = 3;
				break;
			case 6: //右上
				action = 1;
				action2 = 3;
				break;
			case 7: //左下
				action = 2;
				action2 = 4;
				break;
			case 8: //右下
				action = 1;
				action2 = 4;
				break;
			case 9: //放大
				action = 9;
				break;
			case 10: //缩小
				action = 10;
				break;
			default:
				break;
			}
			leftPage.realPTZOperator(action, speed);
			if (action2)
			{
				leftPage.realPTZOperator(action2, lDirection);
			}
			//放大或缩小要在稍后停止，否则会一直持续
			if (type == 9 || type == 10)
			{
				window.setTimeout("leftPage.realPTZOperator(" + action + ",0);", 600);
			}
		}
		);
		
	}
	);
	
	/**
	 * 停止事实视频播放
	 */
	$("#stopliveA").click(function ()
	{
		log.debug("停止当前摄像头直播");
		top.commonOcxObj.StopLive(top.key, top.currCameraId, wndId);
	}
	);
	
	/**
	 * 截图按钮事件
	 */
	$("#savePicA").click(function ()
	{
		savePicture2Local();
	}
	);
	
	/**
	 * 开始/停止 本地录像按钮事件
	 */
	$("#localVideoA").click(function ()
	{
		var statue = $(this).attr('name');
		//开始录像
		if (statue == 'end')
		{
			startSaveLocalVideo();
			$(this).attr('name', 'start');
			$("#localVideoA > img").attr('src', '../Images/video/stop.jpg').attr('title', '停止本地录像');
		}
		else
		{
			endSaveLocalVideo();
			$(this).attr('name', 'end');
			$("#localVideoA > img").attr('src', '../Images/video/start.jpg').attr('title', '开始本地录像');
		}
	}
	);
	
}
);

/**
 * 播放视频
 * @param palyAddr
 * @param playPort
 * @param playType
 * @param wndId
 * @param key
 */
function startRealPlay(palyAddr, playPort, playType, wndId, key)
{
	// 获取当前窗口播放器控件
	playOcx = document.getElementById("realPlay" + wndId);
	var initValue = playOcx
		.Initialize(deviceType, formatType, playMode, key, 0);
	if (initValue != 0)
	{
		log.error("初始化播放器软解控件失败");
		return;
	}
	var openValue = playOcx.OpenStream(palyAddr, playPort, playType, wndId, 0);
	if (openValue == 0)
	{
		log.println("播放IP" + palyAddr + "端口" + playPort + "成功");
	}
	else
	{
		log.warn("播放IP" + palyAddr + "端口" + playPort + "失败");
	}
}

/**
 * 页面展示布局 调整
 * @param num  当前屏幕分几块
 * @param index  要放大的是第几块，下标从1开始（当前窗口全屏功能需要）
 */
function showLayout(num, index)
{
	
	if (!num)
	{
		num = winNum;
	}
	else
	{
		winNum = num;
		//log.debug(num+"分屏");
	}
	var tmpnum = Math.sqrt(num);
	var tmpWidth = $("#playdivs").width() / tmpnum - tmpnum;
	var tmpHeight = $("#playdivs").height() / tmpnum - tmpnum; ;
	
	$("div[id^=show]:lt(" + num + ")").css(
	{
		'float' : 'left',
		'width' : tmpWidth,
		'height' : tmpHeight
	}
	);
	$("div[id^=show]:gt(" + (num - 1) + ")").width(0).height(0);
	if (num == 1 && index)
	{
		$("#show1").width(0).height(0);
		$("#show" + index).width(tmpWidth).height(tmpHeight);
	}
}

/**
 * 保存视频到本地
 */
function startSaveLocalVideo()
{
	getsavepath();
	if (!savepath)
	{
		alert("请先设置录像保存路径.");
		return false;
	}
	var playOcx = document.getElementById("realPlay" + wndId);
	var fileName = "Camera" + top.currCameraId + "_" + top.currcameraName + new Date().format(' yyyyMMddhhmmss') + ".mdm";
	var store = "";
	var reservered = 0; //备用
	var returnV = playOcx.StartRecord(savepath, fileName, store, reservered);
	if (0 == returnV)
	{
		log.debug("开始本地录像成功. 录像文件： " + savepath + fileName);
	}
	else
	{
		log.error("开始本地录像失败. 录像文件： " + savepath + fileName);
	}
}

/**
 * 停止本地录像
 */
function endSaveLocalVideo()
{
	var playOcx = document.getElementById("realPlay" + wndId);
	var returnV = playOcx.StopRecord(0);
	if (0 == returnV)
	{
		log.debug("停止本地录像成功 ");
	}
	else
	{
		log.error("停止本地录像失败");
	}
}

/**
 *视频截图到本地
 */
function savePicture2Local()
{
	getsavepath();
	if (!savepath)
	{
		alert("请先设置截图保存路径.");
		return false;
	}
	var playOcx = document.getElementById("realPlay" + wndId);
	var path = savepath;
	path += "Camera" + top.currCameraId + "_" + top.currcameraName + new Date().format(' yyyyMMddhhmmss') + ".bmp";
	var reservered = 0; //备用
	var returnV = playOcx.GrabPicture(path, reservered);
	if (0 == returnV)
	{
		log.debug("保存图像成功. 保存路径： " + path);
	}
	else
	{
		log.error("保存图像失败. 保存路径: " + path);
	}
	
}

function getsavepath()
{
	//获取设置的路径--需同步请求,以保证保存到最新设定的目录下
	$.ajax('../editConfig.do?method=getPathbyJSON',
	{
		async : false,
		dataType : 'json',
		success : function (date)
		{
			log.debug("获取本地视频、截图保存位置：" + date['savepath']);
			savepath = date['savepath'];
		}
	}
	);
}

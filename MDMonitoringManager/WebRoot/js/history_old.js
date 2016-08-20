var log;
var timeLineObj, playControlObj, realplay;

$(function ()
{
	log = top.log;
	timeLineObj = document.getElementById("timeLine");
	playControlObj = document.getElementById("playControl");
	realplay = document.getElementById("realPlay1");
	//播放控制圆盘事件注册
	playControlObj.attachEvent('PlayBackAction', function (lMsgType,
			DataContent, exData)
	{
		switch (lMsgType)
		{
			//DataContent true 是键按下  false 是键 起来
		case 1: // 播放1 1   加速 1 2
			if (DataContent)
			{
				if ((lMsgType == 1) && (exData == 1))
				{
					start();
				}
				else
				{
					speedUp();
				}
			}
			break;
		case 2: // 倒播 2 1  减速 2 2
			if (DataContent)
			{
				if ((lMsgType == 2) && (exData == 1))
				{
					playback();
				}
				else
				{
					speedDwon();
				}
			}
			break;
		case 4: // ͣ停止播放 4 1
			if (DataContent)
			{
				if ((lMsgType == 4) && (exData == 1))
				{
					stop();
				}
			}
			break;
		case 5: // 单帧正播放 5 :1
			if (DataContent)
			{
				if ((lMsgType == 5) && (exData == 1))
				{
					speedUpFrame();
				}
			}
			break;
		case 6: // 单帧倒播放 6 :1
			if (DataContent)
			{
				if ((lMsgType == 6) && (exData == 1))
				{
					speedDownFrame();
				}
			}
			break;
		case 7: //暂停
			if (DataContent)
			{
				if (lMsgType == 7)
				{
					pause();
				}
			}
			break;
		}
	});
});

// 播放器控件
var deviceType = 1;
var formatType = 0;
var playMode = 0; // 直播模式 0    本地文件 1
var key = 0; // 句柄

function startVod(palyAddr, playPort, playType, wndId, key)
{
	//playControlObj=document.getElementById("playControl");
	//初始化播放控件
	var initValue = realplay.Initialize(deviceType, formatType, playMode, key,
			0);
	if (initValue != 0)
	{
		log.error("播放历史视频文件 ,初始化播放器控件失败");
		return;
	}
	var openValue = realplay.OpenStream(palyAddr, playPort, playType, wndId, 0);
	if (openValue == 0)
	{
		log.debug("播放历史视频文件  IP" + palyAddr + "端口" + playPort + "成功");
	}
	else
	{
		log.warn("播放历史视频文件  IP" + palyAddr + "端口" + playPort + "失败");
	}
}

// 时间控制线相关方法
function setPlayTimeShow(time)
{
	timeLineObj.SetPlayTimeShow(time);
	timeLineObj.AboutBox();
}
function setCamera(cameraId)
{
	timeLineObj.setCamera(cameraId);
}
function clearTimeLine()
{
	timeLineObj.clearTimeLine();
}
function setSpeed(speed, type)
{
	timeLineObj.SetSpeed(speed, type);
}

function layoutCtrl()
{
	log.debug("adsf");
	timeLineObj.LayoutCtl();
}

// startVod 控制相关调用
//
// 播放1 1   加速 1 2

// 倒播 2 1  减速 2 2
// ͣ停止播放 4 1
// 单帧正播放 5 :1
// 单帧倒播放 6 :1
//暂停 7
// 开始
function start()
{
	var type = 1;
	var speed = 1;
	var position = 0;
	operateVOD(type, speed, position);
}
// 倒播
function playback()
{
	var type = 2;
	var speed = 1;
	var position = 0;
	operateVOD(type, speed, position);
}
var speedControl = 1;
// 正常加速
function speedUp()
{
	log.debug("加速播放");
	var type = 1;
	var speed = speedControl * 2;
	var position = 0;
	operateVOD(type, speed, position);
	
}
// 帧加速
function speedUpFrame()
{
	log.debug("单帧正播");
	var type = 5;
	var speed = 0.125;
	var position = 0;
	operateVOD(type, speed, position);
}

function speedDwon()
{
	log.debug("减速播放");
	var type = 2;
	var speed = speedControl / 2;
	var position = 0;
	operateVOD(type, speed, position);
}

function speedDownFrame()
{
	log.debug("单帧倒播");
	var type = 6;
	var speed = 0.125;
	var position = 0;
	operateVOD(type, speed, position);
}

function stop()
{
	log.debug("停止播放");
	var type = 4;
	var speed = 0;
	var position = 0;
	operateVOD(type, speed, position);
}
function pause()
{
	log.debug("暂停播放");
	var type = 7;
	var speed = 0;
	var position = 0;
	operateVOD(type, speed, position);
}
function operateVOD(type, speed, position)
{
	if (top.sessionId == 0)
		return;
	top.commonOcxObj.OperateVOD(top.key, top.sessionId, type, speed, position);
	//时间线
	timeLineObj.SetSpeed(speed, type);
}

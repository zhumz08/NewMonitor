///////////////////////
//摄像头历史视频播放
/////////////////////////
//时间线                       //播放控制器         //播放窗口
var timeLineObj, playControlObj, realplay;

var currSpeed=1;


$(function()
{
	timeLineObj=document.getElementById("timeLineObj");
	playControlObj=document.getElementById("playControlObj");
	realplay=document.getElementById("hisPlayObj");
	
	//播放控制圆盘事件注册
	addEvent(playControlObj,'PlayBackAction',function (lMsgType,
			DataContent, exData)
			{
	//playControlObj.attachEvent('PlayBackAction', function (lMsgType,
	//		DataContent, exData)
	//{
		//DataContent true 是键按下  false 是键 起来 
		if (!DataContent)
			{
				return ;
			}
		var speed,position=0;
		
		switch (lMsgType)
		{
			case 1: // 播放1 1   加速 1 2
				if (exData == 1)
				{
					log.debug("播放");
					speed=currSpeed=1;
				}
				else
				{
					log.debug("播放加速");
					//加速为当前速度的两倍
					speed=currSpeed=currSpeed*2;
				}
				break;
			case 2: // 倒播 2 1  减速 2 2
				if (exData == 1)
				{
					log.debug("倒序播放");
					speed=currSpeed=1;
				}
				else
				{
					log.debug("减速播放");
					speed=currSpeed=currSpeed/2;
				}
				break;
			case 4: // ͣ停止播放 4 1
				log.debug("播放停止");
				break;
			case 5: // 单帧正播放 5 :1
				log.debug("单帧播放");
				break;
			case 6: // 单帧倒播放 6 :1
				log.debug("单帧倒叙播放");
				break;
			case 7: //暂停
				log.debug("暂停播放");
				break;
		}
		
		operateVOD(lMsgType, speed, position);
	});
	
	
});

/**
 * 播放历史视频 
 * @param
 */
function startVod(palyAddr, playPort)
{
	//设备类型，默认设置为1
	var deviceType = 1;
	//码流格式类型，默认设置为0
	var formatType = 0;
	// 直播模式 0    本地文件 1
	var playMode = 0; 
	
	// 开始播放
	operateVOD(1, 1, 0);
	
	//初始化播放控件  第四个参数  登录句柄。设为0
	var initValue = realplay.Initialize(deviceType, formatType, playMode, 0,0);
	if (initValue != 0)
	{
		log.error("播放历史视频文件 ,初始化播放器控件失败");
		return;
	}
	
	//  打开码流 开始播放   第三个参数——4: TCP客户端 码流通道号，第四个参数 默认设置为0 
	var openValue = realplay.OpenStream(palyAddr, playPort, 4, 0, 0);
	if (openValue == 0)
	{
		log.debug("播放历史视频文件  IP：" + palyAddr + "端口：" + playPort + "成功");
	}
	else
	{
		log.warn("播放历史视频文件  IP：" + palyAddr + "端口：" + playPort + "失败");
	}
}

function operateVOD(type, speed, position)
{
	if (top.sessionId == 0)
		return;
	var nRet = top.commonOcxObj.OperateVOD(top.userKey, top.sessionId, type, speed, position);
	//时间线
	timeLineObj.SetSpeed(speed, type);
}

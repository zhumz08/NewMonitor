///////////////////////
//live直播页面部分js
//////////////////////


$(function()
{
	//视频回放布局调整
	$("#sphfli").click(function()
	{
		var h=$("#content-right .turn").height();
		$("#yshfDiv").height((h-149-3)+"px");
	});
	
	/**
	*当前窗口单屏事件
	*/
	$("#zoominA").click(function ()
	{
		showLayout(1, currWinNo);
	});
	
	/**
	 * 全屏事件 占满整个浏览器可视区域
	 */
	$("#fullDocumentA").click(function ()
	{
		fullDocument();
	});
	
	/**
	 * 满屏事件  占满整个屏幕
	 */
	$("#fullScreemA").click(function ()
	{
		log.debug("满屏");
		//第一个参数 是否满屏，第二个参数备用
		document.getElementById("realPlay" + currWinNo).SetFullScreenMode(1, 0);
	});
	
	/**
	 * 开始/停止 本地录像按钮事件
	 */
	$("#localVideoA").click(function ()
	{
		var statue = $(this).attr('name');
		//开始录像
		if (statue == 'start')
		{
			log.debug("开始本地录像");
			if(startSaveLocalVideo())
			{
				$(this).attr('name', 'end').attr('class', 'icons-right-bg play play-13').attr('title', '停止本地录像');
			}
		}
		else
		{
			log.debug("停止本地录像");
			if(endSaveLocalVideo())
			{
				$(this).attr('name', 'start').attr('class', 'icons-right-bg play play-12').attr('title', '本地录像')
			}
		}
	});
	
	/**
	 * 截图按钮事件
	 */
	$("#savePicA").click(function ()
	{
		savePicture2Local();
	});
	
	//开始实时视频播放      -----无用
	$("#startliveA").click(function()
		{
			log.debug("开始当前摄像头直播");
			if(!currCameraId)
			{
				log.warn("还没有选择摄像头");
				return false;
			}
			playCarmVideo(currCameraId);
		});
	
	//开始服务器录像
	$("#hisVideoA").click(function()
	{
		if(!(commonOcxObj&&currCameraId))
		{
			log.error("没有登录或者没有选中摄像头");
			return ;
		}
		if($(this).attr('name')=='start')
		{
			log.debug("请求服务器录像");
			commonOcxObj.StartRecord(userKey,currCameraId);
			$(this).attr('name','end').attr('class', 'icons-right-bg play play-13').attr('title', '停止服务器录像');
		}else
		{
			log.debug("请求停止服务器录像");
			commonOcxObj.StopRecord(userKey,currCameraId);
			$(this).attr('name','start').attr('class', 'icons-right-bg play play-14').attr('title', '服务器录像');
		}
	});
	
	/**
	 * 停止实时视频播放
	 */
	$("#stopliveA").click(function ()
	{
		log.debug("停止当前摄像头直播");
		if(!currCameraId)
		{
			log.warn("还没有选择摄像头");
			return false;
		}
		commonOcxObj.StopLive(userKey,currCameraId, currWinNo);
	});
	
	/**
	 * 停止摄像头直播
	 */
	$("#stopLiveA").click(function()
	{
		log.debug("停止当前摄像头直播");
		commonOcxObj.StopLive(userKey, currCameraId, currWinNo);
		//初始化软解窗口，否则窗口一致保持最后画面，而不是黑屏
		document.getElementById("realPlay" + currWinNo).Initialize(1,0,0,0,0);
	});
	
	
	/**
	*播放窗口单击事件绑定
	*/
	$("#playdivs object[id^='realPlay']").each(function (index,item)
	{
		//开启解码器  ptz操作功能
		$(this).get(0).PTZControlCS(2, 1, 1, 0);
		
		// 绑定解码器事件
		var myobj = $(this);
		addEvent($(this).get(0),'WindowProc',function(message, pram1, pram2){
		//.attachEvent('WindowProc', function (message, pram1, pram2)
		
			//单击--选中事件
			if (message==0x201)
			{
				//log.debug(message);
				//当前窗口背景变红
				var tmpwinid = myobj.attr('id').substring(8, myobj.attr('id').length);
				if (currWinNo != tmpwinid)
				{
					currWinNo = tmpwinid;
					log.debug("当前活动播放窗口:" + currWinNo);
					for (var i = 1; i <= 16; i++)
					{
						document.getElementById("realPlay" + i).colorBackGround = "0";
					}
					myobj[0].colorBackGround = "255";
					
					//提取保存到当前选中窗口的摄像头信息
					var wininfo=winInfoArr[currWinNo];//=[currCameraId,currCameraName];
					if(wininfo)
					{
						currCameraId=wininfo[0];
						currCameraName=wininfo[1];
					}
				}
			}
		});
		
		
		//播放器pzt操作 事件注册
		addEvent($(this).get(0),'PTZEvent',function (lDirection, lRate){
		//$(this).get(0).attachEvent('PTZEvent', function (lDirection, lRate)
		//{
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
			realPTZOperator(action, speed);
			if (action2)
			{
				realPTZOperator(action2, lDirection);
			}
			//放大或缩小要在稍后停止，否则会一直持续
			if (type == 9 || type == 10)
			{
				window.setTimeout("realPTZOperator(" + action + ",0);", 600);
			}
		});
		
	});

    //添加按钮，按钮高亮，兄弟节点去除高亮！
    var index,currentIndex;
    $("#play-about a:lt(9)").click(function(){
        var index=0;
        var currentIndex=0;
        $("#play-about a:lt(9)").each(function(){
            index=$(this).index()+1;
            if(index>5){
                index++;
            }
           $(this).removeClass("current-"+index);
        });
        currentIndex=$(this).index();
        currentIndex=currentIndex+1;
        if(currentIndex>5){
            currentIndex++;
        }
        $(this).addClass("current-"+currentIndex);
    });
});

/**
 * 页面展示布局 调整
 * @param num  当前屏幕分几块
 * @param index  要放大的是第几块，下标从1开始（当前窗口全屏功能需要）
 */

function showLayout(num,index) 
{
	//6,8分屏需要特殊处理
	if($.inArray(num,[1,4,9,16])!=-1)
	{
		//X分屏按钮连续点击不响应  不是单屏， X窗口单屏，同一窗口同一动作不响应
		//if((index&&winNum==1)||((winNum==num)&&(!index)))
		//{
		//	return ;
		//}
		
		if(index)
		{
			log.debug(index + "号窗口单屏");
			//在9窗口中选中7窗口，切换为4窗口，然后点单屏
			if(index>winNum)
			{
				log.warn("请先选中要单屏的窗口");
				return ;
			}
		}
		
		if(!num)
		{
			num=winNum;
		}else
		{
			if(!index)
			{
				log.debug(num+"分屏");
			}
			winNum=num;
		}
		var tmpnum=Math.sqrt(num);
		var p,q,k;
		//可分屏区域宽度--- 注意播放窗口mergin 右，下各1px,需要提前减掉
		p=$("#content-right").width()-tmpnum;
		//可分平区域高度-工具条高度
		q=$("#content-right .turn").height()-$("#play-about").height()-tmpnum;
		var tmpWidth=p/tmpnum;
		var tmpHeight=q/tmpnum;
		
		$("div[id^=show]:lt("+num+")").css({'float':'left','width':tmpWidth,'height':tmpHeight}).show();
		$("div[id^=show]:gt("+(num-1)+")").width(0).height(0).hide();//.css("display","none");
		if(num==1&&index)
		{
			$("#show1").width(0).height(0);
			$("#show"+index).width(tmpWidth).height(tmpHeight);
		}
	}
	else
	{
		log.debug(num+"分屏");
		var w=$("#content-right").width()-2;
		//可分平区域高度-工具条高度
		var h=$("#content-right .turn").height()-$("#play-about").height()-2;
		$("div[id^=show]:gt("+(1)+")").width(0).height(0).hide();
		if(num==6)
		{
			$("#show1").css({'float':'left'}).width(w*2/3-1).height(h*2/3-1);
			$("#show2,#show3").css({'float':'left','width':w/3,'height':(h-1)/3}).show();
			$("#show4,#show5,#show6 ").css({'float':'left','width':(w-1)/3,'height':h/3}).show();
			winNum=num;
		}
		if(num==8)
		{
			$("#show1").css({'float':'left'}).width(w*3/4 - 1).height(h*3/4 - 1);
			$("#show2,#show3,#show4").css({'float':'left','width':w/4,'height':(h-2)/4}).show();
			$("#show5,#show6,#show7,#show8").css({'float':'left','width':(w-2)/4,'height':h/4}).show();
			winNum=num;
		}
	}
}

/**
 *全屏事件
 **/
function fullDocument()
{
	var flag=$("#logdiv").is(":visible");
	//恢复原始窗口分布
	if (iffulldocument)
	{
		log.debug("退出全屏");
		iffulldocument = false;
		$("#content-left,#info-bar").show();
		if(f){
			$("#info-bar").height(69);
		}else{
			$("#info-bar").height(24);
		}
		$("#content-left").width(300);
		$("#content").css("paddingLeft",300);
		sizeContent();
		
	}
	//全屏
	else
	{
		f=flag;
		log.debug("全屏");
		iffulldocument = true;
		$("#info-bar").height(0);
		$("#content-left").width(0);
		$("#content-left,#info-bar").hide();
		$("#content").css("paddingLeft",0);
		sizeContent();
		if(flag){
			$("#info-bar").show();
		}
		else{
			$("#info-bar").hide();
		}
	}
	showLayout();
}


/**
 * 保存视频到本地
 * @returns boolean 是否成功
 */
function startSaveLocalVideo()
{
	var savepath=getSavePath4AjAX();
	if (!savepath)
	{
		alert('请先在"设置"中设置本地录像保存路径.');
		log.error("本地录像失败——没有有效的本地录像保存路径");
		return false;
	}
	var playOcx = document.getElementById("realPlay" + currWinNo);
	if(!currCameraId)
	{
		log.error("本地录像保存错误——还没有开始播放视频？");
		return false;
	}
	var fileName = "Camera" + currCameraId + "_" + currCameraName +"_"+ new Date().format(' yyyyMMddhhmmss') + ".mdm";
	var reservered = 0; //备用
	var returnV = playOcx.StartRecord(savepath, fileName, '', reservered);
	if (0 == returnV)
	{
		log.debug("本地录像成功. 录像文件： " + savepath + fileName);
		return true;
	}
	else
	{
		log.error("本地录像失败. 录像文件： ");
		return false;
	}
}

/**
 * 停止本地录像
 */
function endSaveLocalVideo()
{
	var playOcx = document.getElementById("realPlay" + currWinNo);
	if(!isLogin)
	{
		log.warn("尚未登录");
		return false;
	}
	if (0 == playOcx.StopRecord(0))
	{
		log.debug("停止本地录像 ");
		return true;
	}
	else
	{
		log.error("停止本地录像失败");
		return false;
	}
}

/**
 *视频截图到本地
 *@returns savepath
 */
function savePicture2Local()
{
	var savepath=getSavePath4AjAX();
	if (!savepath)
	{
		alert('请先在"设置"中设置本地录像/截屏保存路径.');
		log.error("视频截图失败——没有有效的本地截图保存路径");
		return false;
	}
	if(!currCameraId)
	{
		log.error("截图保存错误——还没有开始播放视频？");
		return false;
	}
	var playOcx = document.getElementById("realPlay" + currWinNo);
	var path = savepath+"Camera" + currCameraId + "_" + currCameraName +"_"+ new Date().format('yyyyMMddhhmmss') + ".bmp";
	var reservered = 0; //备用
	var returnV = playOcx.GrabPicture(path, reservered);
	if (0 == returnV)
	{
		log.debug("保存图像成功. 保存路径： " +" <a href='"+path+"' target='_blank'>"+path+"</a>");
		return true;
	}
	else
	{
		log.error("保存图像失败. ");
		return false;
	}
}

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
	playOcx = document.getElementById("realPlay" + currWinNo);
	var initValue = playOcx.Initialize(1, 0, 0, 0, 0);
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


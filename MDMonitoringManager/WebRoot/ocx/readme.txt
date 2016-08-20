ocx 控件一共四个。2013年8月24日
注意：注册控件最好复制到windows/system32中或者，给所在目录添加环境变量path

playerocx 播放控件（软解？）
vodctl 时间线控件
vasapiocx  通讯控件
PlayBack.ocx 视频控制(播放，快进，后腿……)

当前文件夹下三个，点击reg.bat进行ocx注册。

注册方法：regsvr32  "%cd%\vasapiocx.ocx"

/通讯控件/文件夹下一个，reg.bat注册。

推荐全部复制到不包含中文的路径下进行注册；


使用时，请将要访问的该网站加入到安全可信站点，
并修改可信站点的安全选项，讲active的所有设置均设置为‘启用“。
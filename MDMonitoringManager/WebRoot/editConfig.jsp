<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://struts.apache.org/tags-bean" prefix="bean"%> 
<%@ taglib uri="http://struts.apache.org/tags-html" prefix="html"%>
<%@ taglib uri="http://struts.apache.org/tags-logic" prefix="logic"%>
<html> 
	<head>
		<title>系统设置</title>
		<script type="text/javascript">
 			<%--选择文件夹，使用active方式，只能用于IE浏览器 --%>
			function chooseFloder()
			{
				var Shell = new ActiveXObject("Shell.Application");
				var folder = Shell.BrowseForFolder(0, "", 0x0040, 0x11);
				var path=folder.items().item().Path;
				if(path.charAt(path.length-1) != "\\"){
					path = path + "\\";
			       }
				document.getElementById("savepath").value=path;
			}
		</script>
	</head>
	<body>
		<form action="editConfig.do" method="post">
		<input type="hidden" name="method" value='save'/>
		
		<div align="center" style="margin-top:45px;">
			<p style="font-size:85%;color:red">
				<logic:present name="msg">
					<bean:write name="msg"/>
				</logic:present>
			</p>
			<p>
				截图、录像保存路径：<input type="text" name="savepath" readonly="readonly" id="savepath" onclick="chooseFloder();" value='<bean:write name="savepath"/>'/>
				<input type="button"  onclick="chooseFloder();" value="选择"/>
			</p>
			<p>
			<input type="submit" value="保存设置"/>&nbsp;&nbsp;&nbsp;&nbsp;
			<input type="button" onclick="window.close();" value="完成设置"/>
			</p>
		</div>
	</form>
	</body>
</html>


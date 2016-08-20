
package com.mingding.struts.action;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.actions.DispatchAction;
import org.json.JSONObject;

import com.mingding.Utils.Utils;

/** 
 * 保存系统设置action
 * Creation date: 06-04-2013
 * 
 * XDoclet definition:
 * @struts.action path="/editConfig" name="editConfigForm" input="editConfig.jsp" parameter="method" scope="request"
 * @struts.action-forward name="success" path="/editConfig.jsp"
 */
public class EditConfigAction extends DispatchAction
{
	

	/** 
	 * Method save 保存修改设计 ajax方式
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return ActionForward
	 */
	@SuppressWarnings("deprecation")
	public ActionForward save(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
	{
		
		 String configfilepath=request.getRealPath("/")+"/WEB-INF/classes/config.properties";
		 JSONObject object=new JSONObject();
		Properties prop=new Properties();
		InputStream input=null;
		try
		{
			input = new FileInputStream(configfilepath);
			prop.load(input);
			
			String savepath=request.getParameter("savepath");
			System.out.println("savepath:"+savepath);
			if(!Utils.isEmpty(savepath))
			{
				prop.setProperty("savepath", savepath);
			}
			FileOutputStream   out   =   new   FileOutputStream(configfilepath);   
	        prop.store(out,"");
			out.close();
			input.close();
			object.put("msg",'1');
		} catch (Exception e)
		{
			e.printStackTrace();
			object.put("msg",'0');
		}
		finally
		{
			try
			{
				response.getWriter().write(object.toString());
			} catch (IOException e)
			{
				e.printStackTrace();
			}
		}
		System.out.println("保存地址成功："+object.toString());
		return null;
	}
	
	/**
	 * 查看配置
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward view(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)throws Exception
	{
		 @SuppressWarnings("deprecation")
		String configfilepath=request.getRealPath("/")+"/WEB-INF/classes/config.properties";
		Properties prop=new Properties();
		InputStream input=new FileInputStream(configfilepath);
		prop.load(input);
		request.setAttribute("savepath", prop.get("savepath"));
		return mapping.findForward("success");
	}
	
	
	/**
	 * json格式输出保存路径
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("deprecation")
	public ActionForward getPathbyJSON(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)throws Exception
	{
		
		 String configfilepath=request.getRealPath("/")+"/WEB-INF/classes/config.properties";
		Properties prop=new Properties();
		InputStream input=new FileInputStream(configfilepath);
		prop.load(input);
		
		request.setAttribute("savepath", prop.get("savepath"));
		
		JSONObject object=new JSONObject();
		object.put("savepath", prop.get("savepath"));
		input.close();
		response.getWriter().write(object.toString());
		System.out.println("获取保存地址成功："+object.toString());
		return null;
	}
}

/**
 * 
 */
package com.mingding.Utils;

/**
 * 工具类
 * @author Jason
 * @version 2013年6月5日
 */
public class Utils
{

	/**
	 * 字符串对象是不是空的
	 * @param Str
	 * @return 是 true;否 false
	 */
	public static boolean isEmpty(Object Str)
	{
		boolean answer=false;
		if(Str==null)
		{
			answer=true;
		}else if("".equals(Str.toString().trim())) 
		{
			answer=true;
		}
		return answer;
	}
	
}

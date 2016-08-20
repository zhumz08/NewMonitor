package com.mingding.struts.action;

import java.util.Date;

public class Helloword
{

	/**
	 * @param args
	 */
	public static void main(String[] args)
	{
		// TODO Auto-generated method stub
		System.out.println(System.currentTimeMillis());
		Date date=new Date(1372481399000l);
		System.out.println(date.toLocaleString());
		date=new Date(1372491870142l);
		System.out.println(date.toLocaleString());
	}

}

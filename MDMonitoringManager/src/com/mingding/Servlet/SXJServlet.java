package com.mingding.Servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.mingding.model.SXJ;
import com.mingding.service.SXJService;

public class SXJServlet extends HttpServlet {
	
	private SXJService sxjServie;
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		sxjServie = new SXJService();
		List<SXJ> list = sxjServie.querySXJ();
		System.out.println(list.size());
	}

}

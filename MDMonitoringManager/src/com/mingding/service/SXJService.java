package com.mingding.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import com.mingding.Utils.DBUtil;
import com.mingding.model.SXJ;

public class SXJService {
	
	public List<SXJ> querySXJ() {
		Connection con = DBUtil.openConn("MySQL", "15.32.12.224", "3306", "mvp10", "admin", "admin");
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		List<SXJ> list = new ArrayList<SXJ>();
		try {
			 pstmt = con.prepareStatement("select * from Tbl_SXJ");
			 rs = pstmt.executeQuery();
			 while(rs.next()){
				 SXJ sxj = new SXJ(rs.getInt(1),rs.getString(2),rs.getString(3),rs.getString(4),rs.getString(5),rs.getString(6),rs.getString(7),rs.getString(8),rs.getInt(9));
				 list.add(sxj);
			 }
			 System.out.println("listSize"+list.size());
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return list;
		
	}
	public static void main(String[] args) {
		System.out.println(12);
	}

}

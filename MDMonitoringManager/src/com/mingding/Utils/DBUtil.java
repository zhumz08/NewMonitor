package com.mingding.Utils;

import java.sql.Connection;
import java.sql.DriverManager;


public class DBUtil {

    public static Connection openConn(String type, String host, String port, String name, String username, String password) {
        Connection conn = null;
        try {
            String driver;
            String url;
            if (type.equalsIgnoreCase("MySQL")) {
                driver = "com.mysql.jdbc.Driver";
                url = "jdbc:mysql://" + host + ":" + port + "/" + name;
            } else if (type.equalsIgnoreCase("Oracle")) {
                driver = "oracle.jdbc.driver.OracleDriver";
                url = "jdbc:oracle:thin:@" + host + ":" + port + ":" + name;
            } else if (type.equalsIgnoreCase("SQLServer")) {
                driver = "com.microsoft.jdbc.sqlserver.SQLServerDriver";
                url = "jdbc:sqlserver://" + host + ":" + port + ";databaseName=" + name;
            } else {
                throw new RuntimeException();
            }
            Class.forName(driver);
            conn = DriverManager.getConnection(url, username, password);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return conn;
    }

    // 关闭数据库连接
    public static void closeConn(Connection conn) {
        try {
            if (conn != null) {
                conn.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

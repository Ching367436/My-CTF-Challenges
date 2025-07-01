<%@ page import="java.sql.Connection" %>
<%@ page import="java.sql.DriverManager" %>
<%@ page import="java.sql.SQLException" %>
<%@ page import="java.sql.Statement" %>

<%
    String jdbcURL = "jdbc:mysql://localhost:3306/";
    String dbName = "Board";
    String username = "yourDatabaseUsername";  // Replace with your MySQL username
    String password = "yourDatabasePassword";  // Replace with your MySQL password

    Connection conn = null;
    Statement stmt = null;

    try {
        // Load the JDBC driver
        Class.forName("com.mysql.cj.jdbc.Driver");

        // Establish a connection
        conn = DriverManager.getConnection(jdbcURL, username, password);
    } catch (ClassNotFoundException e) {
        out.println("JDBC Driver not found: " + e.getMessage());
    } catch (SQLException e) {
        out.println("Database error: " + e.getMessage());
    } finally {
        // Close resources
        try { if (stmt != null) stmt.close(); } catch (SQLException ex) {}
        try { if (conn != null) conn.close(); } catch (SQLException ex) {}
    }
%>
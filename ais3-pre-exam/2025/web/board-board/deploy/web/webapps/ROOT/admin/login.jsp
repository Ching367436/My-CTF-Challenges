<%
if (session.getAttribute("username") != null) {
    response.sendRedirect("info.php");
}
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Login</title>
    <link rel="stylesheet" href="../styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <% if ("GET".equalsIgnoreCase(request.getMethod())) { %>
        <%@include file="includes/loginForm.jsp" %>
    <% } else { 
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        
        if (username == null || password == null) {
            response.sendRedirect("https://youtu.be/GXC_7LWOjmI");
        }
        
        if (username.equals("admin")) {
            session.setAttribute("username", username);
            response.sendRedirect("info.php");
        } else {
            response.sendRedirect("?msg=Invalid credential");
        }
        %>
    <% } %>
</body>
</html>
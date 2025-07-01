<%@include file="../includes/databaseWrapper.jsp" %>
<% dbw.loadDatabase(); %>
<%
if (session.getAttribute("username") == null) {
    response.sendRedirect("/admin/login.php");
}
String username = (String) session.getAttribute("username");
// get the id of the post to delete
int id = Integer.parseInt(request.getParameter("id"));
dbw.db.posts.remove(id);
dbw.saveDatabase();
response.sendRedirect("/admin/posts.php");
%>
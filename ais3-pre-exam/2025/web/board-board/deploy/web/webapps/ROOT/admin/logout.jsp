<%-- delete the session and redirect to home page --%>
<%
    session.invalidate();
    response.sendRedirect("/");
%>
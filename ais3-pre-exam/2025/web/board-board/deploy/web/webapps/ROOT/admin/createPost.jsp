<%@ page import="java.time.LocalDateTime" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@include file="../includes/databaseWrapper.jsp" %>
<% dbw.loadDatabase(); %>
<%
if (session.getAttribute("username") == null) {
    response.sendRedirect("/admin/login.php");
}
String username = (String) session.getAttribute("username");

if ("POST".equalsIgnoreCase(request.getMethod())) {
    String title = request.getParameter("title");
    String content = request.getParameter("content");
    if (title == null || content == null) {
        response.sendRedirect("https://youtu.be/FG7pCu6ka-E");
    }
    LocalDateTime myObj = LocalDateTime.now();
    dbw.db.addPost(dbw.db.posts.size(), myObj.toString(), 0, username, new String[]{}, title, content);
    dbw.saveDatabase();
    response.sendRedirect("/admin/posts.php");
} else { 
}
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Create Post</title>
    <link rel="stylesheet" href="../styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<main class="container">
    <h2>Add New Post</h2>
    <form method="POST">
        <div class="input_box">
            <label>Title</label>
            <input name="title" id="draft" rows="1" cols="50" placeholder="Title" required></input><br><br>
            <label>Content</label>
            <textarea name="content" id="draft" rows="4" cols="50" placeholder="Write your post here..." required></textarea><br><br>
            <button type="submit" class="big_button" id="go">Post</button>
        </div>
    </form>

    <a href="/"><button  class="big_button">Home</button></a>
</main>
</body>
</html>
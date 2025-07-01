<%@include file="includes/databaseWrapper.jsp" %>
<% dbw.loadDatabase(); %>
<% 
    int id = Integer.parseInt(request.getParameter("id"));
    if (id < 0 || id >= dbw.db.posts.size()) {
        response.sendRedirect("https://youtu.be/_l6fAIBDxFQ");
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Announcements</title>
    <link rel="stylesheet" href="styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<main class="container">
    <h2>Announcements</h2>

    <div class="box">
        <h2><a href="post.php?id=<%= id %>" class="post"><%= dbw.db.posts.get(id).title %></a></h2>
        <p><small>Posted on: <%= dbw.db.posts.get(id).date %></small></p>
        <hr><br>
        <p><%= dbw.db.posts.get(id).content %></p>
    </div>

    <a href="/"><button class="big_button">Home</button></a>
</main>
</body>
</html>
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


    <%@include file="includes/databaseWrapper.jsp" %>
    <% dbw.loadDatabase(); %>
    <% for (int i = 0; i < dbw.db.posts.size(); i++) { %>
        <div class="box">
            <p><small>Posted on: <%= dbw.db.posts.get(i).date %></small></p>
            <a href="post.php?id=<%= i %>" class="post"><%= dbw.db.posts.get(i).title %></a>
        </div>
    <% } %>

    <a href="admin/info.php"><button class="big_button">Manage</button></a>
</main>
</body>
</html>
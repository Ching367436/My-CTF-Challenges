<!DOCTYPE html>
<html lang="en">
<head>
    <title>[Admin] Posts</title>
    <link rel="stylesheet" href="../styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<main class="container">
    <h2>Manage Posts</h2>
    <%@include file="../includes/databaseWrapper.jsp" %>
    <% dbw.loadDatabase(); %>
    <% for (int i = 0; i < dbw.db.posts.size(); i++) { %>
        <div class="box">
            <p><small>Posted on: <%= dbw.db.posts.get(i).date %></small></p>
            <a href="editPost.php?id=<%= i %>" class="post"><%= dbw.db.posts.get(i).title %></a>
        </div>
    <% } %>

    <a href="info.php"><button class="big_button">System Info</button></a>
</main>
</body>
</html>
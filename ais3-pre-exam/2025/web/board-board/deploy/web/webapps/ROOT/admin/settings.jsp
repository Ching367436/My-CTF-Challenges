<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
if (session.getAttribute("username") == null) {
    response.sendRedirect("/admin/login.php");
}
String username = (String) session.getAttribute("username");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Settings</title>
    <link rel="stylesheet" href="../styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<main class="container">
    <h2>Welcome, <c:out value="${username}" /></h2>
    <!-- Form for creating a post -->
    <form method="POST" action="ChangePassword">
        <h2>Change Password</h2>
        <div class="input_box">
            <label for="oldPassword">Old Password</label>
            <input type="text" name="oldPassword" id="oldPassword" required>
        </div>
        <div class="input_box">
            <label for="newPassword">New Password</label>
            <input type="newPassword" name="newPassword" id="newPassword" required>
            <p class="error">Note: DO NOT CONTAIN ANY '</p>
        </div>
        <button type="submit" id="login" class="big_button">Change Password</button>

        <% if (request.getParameter("msg") != null) { %>
            <p class="error"><c:out value="${param.msg}" /> </p>
        <% } %>
    </form>
    <a href="posts.php"><button  class="big_button">Posts</button></a>
    <a href="createPost.php"><button  class="big_button">Create Post</button></a>
    <a href="settings.php"><button  class="big_button">Settings</button></a>
    <a href="logout.php"><button  class="big_button">Logout</button></a>
</main>
</body>
</html>
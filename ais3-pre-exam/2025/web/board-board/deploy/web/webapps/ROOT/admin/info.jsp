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
    <title>System Info</title>
    <link rel="stylesheet" href="../styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<main class="container">
    <h2>Welcome, <c:out value="${username}" /></h2>
    <!-- Form for creating a post -->
    <div class="input_box">
        <button  class="big_button2">System Version: v0.0.1</button>
        <button  class="big_button2">System Author: Ching367436</button>
    </div>
    <a href="/"><button  class="big_button">Home</button></a>
    <a href="posts.php"><button  class="big_button">Posts</button></a>
    <a href="createPost.php"><button  class="big_button">Create Post</button></a>
    <a href="settings.php"><button  class="big_button">Settings</button></a>
    <a href="logout.php"><button  class="big_button">Logout</button></a>
</main>
</body>
</html>
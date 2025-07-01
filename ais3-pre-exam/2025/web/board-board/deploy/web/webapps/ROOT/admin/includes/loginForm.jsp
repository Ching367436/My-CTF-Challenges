<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!-- Login/Register Form -->
<main class="container">
    <form method="POST">
        <h2>Login or Register</h2>
        <div class="input_box">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" required>
        </div>
        <div class="input_box">
            <label for="password">Password</label>
            <input type="password" name="password" id="password" required>
        </div>
        <button type="submit" id="login" class="big_button">Login / Register</button>

        <% if (request.getParameter("msg") != null) { %>
            <p class="error"><c:out value="${param.msg}" /> </p>
        <% } %>
    </form>
</main>
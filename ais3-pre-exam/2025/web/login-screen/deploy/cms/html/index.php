<?php
include("init.php");

// if already logged in, redirect to dashboard
if (isset($_SESSION['username'])) {
    header('Location: dashboard.php');
    die();
}

// Handle form submission (both login and registration)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Validation: Ensure both fields are filled
    if (empty($username) || empty($password)) {
        echo "Please enter both username and password.";
    } else {
        // Check if the username already exists
        $stmt = $db->prepare("SELECT * FROM Users WHERE username = '$username'");
        $result = $stmt->execute();
        $user = $result->fetchArray();

        if ($user) {
            // If user exists, login logic (verify password)
            if (password_verify($password, $user['password'])) {
                // Start session for the user
                $_SESSION['username'] = $username;
                $_SESSION['verified'] = 0; // Set verified to 0
                
                // redirect to dashboard
                header('Location: 2fa.php');
                die();
            } else {
                die("Invalid username or password.");
            }
        } else {
            // If user does not exist, 
            die("Invalid username or password.");
        }
    }
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <title>Login Screen | Login</title>
    <link rel="stylesheet" href="styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

    <!-- Login Form -->
    <main class="container">
    <form method="POST" action="index.php">
        <h2>Login Screen</h2>
        <div class="input_box">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" required>
        </div>
        <div class="input_box">
            <label for="password">Password</label>
            <input type="password" name="password" id="password" required>
        </div>
        <button type="submit" id="login" class="big_button">Login</button>
        <a>You can log in as guest/guest</a>
    </form>
    </main>

</body>
</html>

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
        $stmt = $db->prepare('SELECT * FROM users WHERE username = :username');
        $stmt->bindValue(':username', $username, SQLITE3_TEXT);
        $result = $stmt->execute();
        $user = $result->fetchArray();

        if ($user) {
            // If user exists, login logic (verify password)
            if (password_verify($password, $user['password'])) {
                // Start session for the user
                $_SESSION['username'] = $username;
                
                // redirect to dashboard
                header('Location: dashboard.php');
                die();
            } else {
                die("Invalid username or password.");
            }
        } else {
            // If user does not exist, register the user
            // Hash the password before saving
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            // Insert new user into the database
            $stmt = $db->prepare('INSERT INTO users (username, password) VALUES (:username, :password)');
            $stmt->bindValue(':username', $username, SQLITE3_TEXT);
            $stmt->bindValue(':password', $hashed_password, SQLITE3_TEXT);
            $stmt->execute();

            $_SESSION['username'] = $username;  // Start session after registration

            // redirect to dashboard
            header('Location: dashboard.php');
            die();
        }
    }
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <title>Login or Register</title>
    <link rel="stylesheet" href="styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

    <!-- Login/Register Form -->
    <main class="container">
    <form method="POST" action="index.php">
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
        <a href="report.php">Report to admin</a>
    </form>
    </main>

</body>
</html>

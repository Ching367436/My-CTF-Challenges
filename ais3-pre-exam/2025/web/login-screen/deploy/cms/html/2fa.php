<?php
include("init.php");

// if already logged in, redirect to dashboard
if (isset($_SESSION['username']) && isset($_SESSION['verified']) && $_SESSION['verified'] == 1) {
    header('Location: dashboard.php');
    die();
}

// if not logged in, redirect to login page
if (!isset($_SESSION['username'])) {
    header('Location: index.php');
    die();
}

// Handle form submission (both login and registration)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $code = $_POST['code'];
    $username = $_SESSION['username'];
    $result = $db->exec("SELECT * FROM users WHERE username = '$username'");

    // Validation: Ensure both fields are filled
    if (empty($code)) {
        echo "Please enter the 2FA code.";
    } else if (preg_match('/[^0-9]/', $code)) {
        echo "Invalid 2FA code.";
    } else {
        // Check if the username already exists
        $stmt = $db->prepare("SELECT * FROM Users WHERE username = '$username'");
        $result = $stmt->execute();
        $user = $result->fetchArray();

        if ($user) {
            // If user exists, login logic (verify password)
            if ($code == $user['code']) {
                // Start session for the user
                $_SESSION['code'] = 1;
                
                // redirect to dashboard
                header('Location: dashboard.php');
                die();
            } else {
                die("Invalid 2FA code.");
            }
        } else {
            // If user does not exist, which is not possible in this context 
            header('Location: https://youtu.be/jWvuUeUyyKU');
            die("https://youtu.be/jWvuUeUyyKU");
        }
    }
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <title>Login Screen | 2FA</title>
    <link rel="stylesheet" href="styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

    <!-- 2FA Form -->
    <main class="container">
    <form method="POST" action="2fa.php">
        <h2>2FA Code</h2>
        <div class="input_box">
            <label for="username">Please enter the 2FA code.</label>
            <input type="text" name="code" id="code" required>
        </div>
        <button type="submit" id="go" class="big_button">Go</button>
        <a>The 2FA code for guest will always be `000000`</a>
    </form>
    </main>

</body>
</html>

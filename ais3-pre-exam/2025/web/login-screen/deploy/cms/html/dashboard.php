<?php
include("init.php");

// if not logged in, redirect to login page
if (!isset($_SESSION['username'])) {
    header('Location: index.php');
} else if (!isset($_SESSION['code']) || $_SESSION['code'] != 1) {
    // if not verified, redirect to 2fa page
    header('Location: 2fa.php');
}

// Get the user's ID from the session
$username = $_SESSION['username'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Dashboard</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js"></script>
    <link rel="stylesheet" href="styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<main class="container">
    <h2>Welcome, <?php echo htmlspecialchars($username); ?>!</h2>

    <h3>Your Previous Posts</h3>

    <?php
    // if the user is admin, show this post
    if ($_SESSION['username'] == "admin") { ?>
        <div class='box'><strong>2025-05-05</strong><div id='post1' class='post'>Just watched this excellent technical breakdown: https://youtu.be/jWvuUeUyyKU - it's a must-see if you're into cybersecurity, reverse engineering, or low-level internals. The explanations are clear, insightful, and packed with practical takeaways. Highly recommended for anyone looking to deepen their understanding or just enjoy quality analysis.</div></div>;
        <div class='box'><strong>2025-05-06</strong><div id='post2' class='post'><?= getenv('FLAG1') ?></div></div>;
    <?php }
    // if the user is guest, show this post
    else {
        echo "<div class='box'><strong>2025-05-05</strong><div id='post1' class='post'>Only admin and view the flag.</div></div>";
    }
    ?>
    </article>
    <a href="logout.php"><button  class="big_button">Logout</button></a>
</main>
</body>
</html>

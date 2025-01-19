<?php
include("init.php");

// Get the username from the GET parameter
if (isset($_GET['username'])) {
    $username = $_GET['username'];

    // Fetch the user's ID
    $stmt = $db->prepare('SELECT id FROM users WHERE username = :username');
    $stmt->bindValue(':username', $username, SQLITE3_TEXT);
    $userResult = $stmt->execute();
    $user = $userResult->fetchArray();

    if ($user) {
        // Fetch posts for the given username
        $stmt = $db->prepare('SELECT content, created_at FROM posts WHERE user_id = :user_id ORDER BY created_at DESC');
        $stmt->bindValue(':user_id', $user['id'], SQLITE3_INTEGER);
        $postsResult = $stmt->execute();
    } else {
        $error = "User not found.";
    }
} else {
    $error = "No username provided.";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Posts</title>
    <link rel="stylesheet" href="styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<main class="container">
    <h2>Posts by <?php echo htmlspecialchars($username ?? 'Unknown'); ?></h2>

    <?php
    if (isset($error)) {
        echo "<p style='color: red;'>$error</p>";
    } else {
        // Display posts
        $i = 0;
        if ($postsResult->numColumns() > 0) {
            while ($post = $postsResult->fetchArray()) {
                $i++;
                echo "<div class='box'><strong>Posted on: " . $post['created_at'] . "</strong><div id='post$i' class='post'>".$post['content']."</div></div>";
            }
        } else {
            echo "<p>This user has not made any posts yet.</p>";
        }
    }
    ?>

    <a href="index.php"><button class="big_button">Back to Home</button></a>
</main>
</body>
</html>

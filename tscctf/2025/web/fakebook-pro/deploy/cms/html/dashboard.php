<?php
include("init.php");

// if not logged in, redirect to login page
if (!isset($_SESSION['username'])) {
    header('Location: index.php');
    die();
}

// Get the user's ID from the session
$username = $_SESSION['username'];
$stmt = $db->prepare('SELECT id FROM users WHERE username = :username');
$stmt->bindValue(':username', $username, SQLITE3_TEXT);
$result = $stmt->execute();
$user = $result->fetchArray();

// Handle form submission (post creation)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $content = $_POST['content'];

    if (empty($content)) {
        echo "Please enter some content for your post.";
    } else {
        // Insert post into the database
        $stmt = $db->prepare('INSERT INTO posts (user_id, content) VALUES (:user_id, :content)');
        $stmt->bindValue(':user_id', $user['id'], SQLITE3_INTEGER);
        $stmt->bindValue(':content', $content, SQLITE3_TEXT);
        $stmt->execute();
    }
}

// Fetch the user's previous posts
$stmt = $db->prepare('SELECT content, created_at FROM posts WHERE user_id = :user_id ORDER BY created_at DESC');
$stmt->bindValue(':user_id', $user['id'], SQLITE3_INTEGER);
$result = $stmt->execute();
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

    <!-- Form for creating a post -->
    <form method="POST" action="dashboard.php">
        <div class="input_box">
            <label>Create a New Post</label>
            <textarea name="content" id="draft" rows="4" cols="50" placeholder="Write your post here..." required></textarea><br><br>
            <button type="submit" class="big_button" id="go">Post</button>
        </div>
    </form>

    <article>
    <h3>Your Previous Posts</h3>

    <!-- Display the user's previous posts -->
    <?php
    if ($result->numColumns() > 0) {
        $i = 0;
        while ($post = $result->fetchArray()) {
            $i++;
            echo "<div class='box'><strong>Posted on: " . $post['created_at'] . "</strong><div id='post$i' class='post'></div></div>";
            echo "
                <script>
                    post = \"".remove_quotes($post['content'])."\";
                    document.getElementById('post$i').innerHTML = DOMPurify.sanitize(post);
                </script>
            ";    
        }
    } else {
        echo "<p>You haven't made any posts yet.</p>";
    }
    ?>
    </article>

    <a href="logout.php"><button  class="big_button">Logout</button></a>
</main>
</body>
</html>

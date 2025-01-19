<?php
include("init.php");



function build_url(array $parts) {
    return (isset($parts['scheme']) ? "{$parts['scheme']}:" : '') .
           ((isset($parts['user']) || isset($parts['host'])) ? '//' : '') .
           (isset($parts['user']) ? "{$parts['user']}" : '') .
           (isset($parts['pass']) ? ":{$parts['pass']}" : '') .
           (isset($parts['user']) ? '@' : '') .
           (isset($parts['host']) ? "{$parts['host']}" : '') .
           (isset($parts['port']) ? ":{$parts['port']}" : '') .
           (isset($parts['path']) ? "{$parts['path']}" : '') .
           (isset($parts['query']) ? "?{$parts['query']}" : '') .
           (isset($parts['fragment']) ? "#{$parts['fragment']}" : '');
}

function sendUrlToBot($url) {
    $botHost = getenv('BOT_HOST');
    $botPort = getenv('BOT_PORT');

    try {
        // Connect to the server
        $client = stream_socket_client("tcp://$botHost:$botPort", $errno, $errstr, 30);
        if (!$client) {
            throw new Exception("Failed to connect: $errstr ($errno)");
        }

        // Write the URL to the server
        fwrite($client, $url);

        // Read the response from the server
        $result = '';
        while (!feof($client)) {
            $result .= fgets($client, 1024);
        }

        // Close the connection
        fclose($client);

        // Return success response
        return ['success' => true, 'data' => $result];
    } catch (Exception $e) {
        // Return error response
        return ['success' => false, 'message' => 'Internal server error', 'error' => $e->getMessage()];
    }
}

// if already logged in, redirect to dashboard
if (isset($_SESSION['username'])) {
    header('Location: dashboard.php');
    die();
}

// if $_POST['url'] is not set, show the form
if (!isset($_POST['url'])) { ?>
    <link rel="stylesheet" href="styles.css">
    <main class="container">
        <form method="POST" action="report.php">
            <h2>Report to Admin</h2>
            <div class="input_box">
                <label for="url">URL</label>
                <input type="text" name="url" id="url" required>
            </div>
            <button type="submit" id="login" class="big_button">Submit</button>
        </form>
    </main>
 
<?php
} else {
    $URL = parse_url($_POST['url']);
    $URL['scheme'] = 'http';
    $URL['host'] = 'cms';
    $URL['port'] = 80;

    $URL = build_url($URL);
    $res = sendUrlToBot($URL);

    echo $res['data'];
}


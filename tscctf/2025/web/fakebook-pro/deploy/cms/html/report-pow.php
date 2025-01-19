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

$POW_RES = "366";
$POW_PREFIX_LEN = strlen($POW_RES);

// if $_POST['url'] is not set, show the form
if (!isset($_POST['url'])) { 
    $pow_prefix = rand(0, 100000000); 
    $_SESSION['pow_prefix'] = $pow_prefix;
    ?>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.jsdelivr.net/npm/hash-wasm"></script>
    <main class="container">
        <form method="POST" action="report.php">
            <h2>Report to Admin</h2>
            <div class="input_box">
                <label for="url">URL</label>
                <input type="text" name="url" id="url" required>
            </div>
            <div class="input_box">
                <label for="pow">md5("<?=$pow_prefix?>"+?).substr(0, <?=$POW_PREFIX_LEN?>) === "<?=$POW_RES?>"</label>
                <input type="text" name="pow" id="pow" required>
                <code>pow_prefix="<?=$pow_prefix?>"; for i in {0..999999}; do [[ $(echo -n "${pow_prefix}${i}" | md5sum | cut -c1-<?=$POW_PREFIX_LEN?>) == "<?=$POW_RES?>" ]] && echo "Found: $i" && break; done</code>
            </div>
            <button type="submit" id="login" class="big_button">Submit</button>
        </form>
    </main>
 
<?php
} else {
    // ####### PoW #######
    if (!isset($_SESSION['pow_prefix']) || !isset($_POST['pow']) || !is_string($_POST['pow'])) {
        die("Invalid PoW");
    }
    $pow_prefix = $_SESSION['pow_prefix'];
    $pow = $_POST['pow'];
    if (substr(md5($pow_prefix.$pow), 0, $POW_PREFIX_LEN) !== $POW_RES) {
        die("Invalid PoW");
    }

    // renew PoW
    $_SESSION['pow_prefix'] = rand(0, 100000000);
    // ####### END PoW #######

    $URL = parse_url($_POST['url']);
    $URL['scheme'] = 'http';
    $URL['host'] = 'cms';
    $URL['port'] = 80;

    $URL = build_url($URL);
    $res = sendUrlToBot($URL);

    echo $res['data'];
}


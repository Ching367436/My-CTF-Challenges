<?php
// start session
session_start();

// Code stolen from https://chummy.tw/
function check_domain($url) {
    $DOMAIN_SUFFIX = "\.tscctf-2025\.ctftime\.uk";
    $pattern = "/^https?:\/\/.?.?[a-zA-Z0-9-]+".$DOMAIN_SUFFIX."\/.*$/";
    if (preg_match($pattern, $url)) {
        return true;
    }
    die("Good Hacker");

}

function proxy($service) {
    // $service = "switchrange";
    // $service = "previewsite";
    // $service = "越獄";
    $requestUri = $_SERVER['REQUEST_URI'];
    $parsedUrl = parse_url($requestUri);
    $options = array(
        CURLOPT_RETURNTRANSFER => true,   // return web page
        CURLOPT_HEADER         => false,  // don't return headers
        CURLOPT_FOLLOWLOCATION => false,   // follow redirects
        CURLOPT_MAXREDIRS      => 2,     // stop after 10 redirects
        CURLOPT_ENCODING       => "",     // handle compressed
        CURLOPT_USERAGENT      => "FLAG{not_flag}", // name of client
        CURLOPT_AUTOREFERER    => true,   // set referrer on redirect
        CURLOPT_CONNECTTIMEOUT => 10,    // time-out on connect
        CURLOPT_TIMEOUT        => 10,    // time-out on response
    );

    // the len must be less than 50
    if (strlen($service) > 50) {
        die("Service name is too long.");
    }

    $port = 80;

    setcookie("service", $service);
    setcookie("port", $port);
    $ch = curl_init();
    curl_setopt_array($ch, $options);
    // No more redirect QQ.
    // curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    $filter = '!$%^&*()=+[]{}|;\'",<>?_-/#:.\\@';
    $fixeddomain = trim(trim($service, $filter).".cggc.chummy.tw:".$port, $filter);
    $fixeddomain = idn_to_ascii($fixeddomain);
    $fixeddomain = preg_replace('/[^0-9a-zA-Z-.:_]/', '', $fixeddomain);

    $url = 'http://'.$fixeddomain.$parsedUrl['path'].'?'.$_SERVER['QUERY_STRING'];
    check_domain($url);
    curl_setopt($ch, CURLOPT_URL, $url);
    $response = curl_exec($ch);
    curl_close($ch);
    // if session admin is not true, redirect to rickroll
    if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
        header("Location: https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    }
    // if "please_give_me_flag_QQ" in response, then echo flag
    if (strpos($response, "please_give_me_flag_QQ") !== false) {
        echo getenv('FLAG');
    }
    curl_close($ch);
}
if (isset($_GET['service']))
    proxy($_GET['service']);
else
    // print source code
    highlight_file(__FILE__);
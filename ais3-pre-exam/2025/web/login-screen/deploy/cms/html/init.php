<?php
// Disable PHP error reporting and set some security headers
ini_set('expose_php', '0'); // Don't expose PHP in the HTTP header
ini_set('session.cookie_httponly', 1); // Set the session cookie to be accessible only through the HTTP protocol
ini_set('default_charset', ''); // Don't set a default charset
ini_set('max_execution_time', '5'); // Set the maximum execution time to 5 seconds
ini_set('max_input_time', '5'); // Set the maximum input time to 5 seconds
ini_set('max_input_vars', '1000'); // Set the maximum input variables to 1000

// Mimic Node Express server
header('Content-Type: text/html'); // Set the content type to HTML
header('X-Powered-By: Express'); // Set the X-Powered-By header to Express
header('ETag: W/"86f-oSPkbf9oIjxXhokikR8tx7FSWXs"'); // Set the ETag header
header('Connection: keep-alive'); // Set the Connection header to keep-alive
header('Keep-Alive: timeout=5'); // Set the Keep-Alive header

// Database setup
$db = new SQLite3('users.db'); // Create a new SQLite3 database
// Create the users and posts tables if they don't exist
$db->exec("CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    code TEXT NOT NULL
)");
// Create the posts table if it doesn't exist
$db->exec("CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
)");
// insert admin user if not exist
// $db->exec("INSERT OR IGNORE INTO users (username, password, code) VALUES ('admin', '" . password_hash('<redacted>', PASSWORD_BCRYPT) . "', '<redacted>')");
// insert guest user if not exist
// $db->exec("INSERT OR IGNORE INTO users (username, password, code) VALUES ('guest', '" . password_hash('guest', PASSWORD_BCRYPT) . "', '000000')");

// Start the session
session_start();

function remove_quotes($str) {
    // remove \
    $str = str_replace("\\", "", $str);
    // replace ' with \'
    $str = str_replace("\"", "\\\"", $str);
    // remove <
    $str = str_replace("<", "", $str);
    // remove >
    $str = str_replace(">", "", $str);
    // remove \n
    $str = str_replace("\n", "", $str);
    // remove \r
    $str = str_replace("\r", "", $str);
    return $str;
}
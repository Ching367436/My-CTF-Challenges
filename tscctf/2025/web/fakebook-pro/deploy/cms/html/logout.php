<?php
include("init.php");

// if not logged in, redirect to login page
if (!isset($_SESSION['username'])) {
    header('Location: index.php');
    die();
}

// if not an admin, deny access
if (isset($_COOKIE['admin'])) {
    die("You are not authorized to access this page.");
}

// destroy the session
session_destroy();

// redirect to login page
header('Location: index.php');
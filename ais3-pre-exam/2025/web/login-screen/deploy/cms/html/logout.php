<?php
include("init.php");

// if not logged in, redirect to login page
if (!isset($_SESSION['username'])) {
    header('Location: index.php');
    die();
}

// destroy the session
session_destroy();

// redirect to login page
header('Location: index.php');
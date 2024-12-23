<?php
session_start();

header('Content-Type: application/json');

// Check if the user token exists in the session
if (isset($_SESSION['token'])) {
    echo json_encode([
        'token' => $_SESSION['token'],
        'userName' => $_SESSION['userName'],
        'email' => $_SESSION['email']
    ]);
} else {
    echo json_encode(['token' => null]);
}

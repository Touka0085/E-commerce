<?php

session_start();
// Unset all session variables
session_unset();
// Destroy the current session
session_destroy();

header("Location: ../index.html");
exit();

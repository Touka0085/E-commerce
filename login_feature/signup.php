<?php

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $password = $_POST["password"];
    $rePassword = $_POST["rePassword"];
    $phone = $_POST["phone"];

    // URL to send the POST request to
    $url = "https://ecommerce.routemisr.com/api/v1/auth/signup";
    // Initialize cURL session
    $ch = curl_init($url);
    // Data to send in the POST request
    $data = [
        "name" => $name,
        "email" => $email,
        "password" => $password,
        "rePassword" => $rePassword,
        "phone" => $phone
    ];

    // Encode data as JSON
    $jsonData = json_encode($data);

    // Set cURL options
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return response as a string
    curl_setopt($ch, CURLOPT_POST, true);           // Use POST method
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",          // Set content type to JSON
        "Content-Length: " . strlen($jsonData)     // Specify content length
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData); // Attach the JSON data
    // header("Content-Type: application/json");
    // Execute the request
    $response = curl_exec($ch);
    // echo $response;
    // Check for errors
    if (curl_errno($ch)) {
        echo "cURL error: " . curl_error($ch);
    } else {
        // Decode JSON response into an associative array
        $responseData = json_decode($response, true);
        // Check if the response contains the 'token'
        if (isset($responseData['token'])) {
            // Extract the token
            session_start();
            // Assign the token to the session
            $_SESSION['token'] = $responseData['token'];
            $_SESSION['userName'] = $responseData['user']['name'];
            $_SESSION['email'] = $responseData['user']['email'];
        }
    }


    // Close the cURL session
    curl_close($ch);
    // Redirect to the index page
    header("Location: ../index.html");
}

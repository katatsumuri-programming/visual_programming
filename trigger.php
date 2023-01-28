<?php

// Load config
require_once(dirname(__FILE__).'/config.php');

$header    = getallheaders();
$post_data = file_get_contents('php://input');
$hmac      = hash_hmac('sha1', $post_data, $SECRET_KEY);
$date      = date("[Y-m-d H:i:s]")

if (isset($header['X-Hub-Signature']) && $header['X-Hub-Signature'] === "sha1={$hmac}") {
  $payload = json_decode($post_data, true); // Request body (JSON)

  foreach ($COMMANDS as $branch => $command) {
    // Detect target branch
    if ($payload['ref'] == $branch) {
      if ($command !== '') {
        // Execute
        exec($command);
        file_put_contents(
          $LOG_FILE,
          "{$date} {$_SERVER['REMOTE_ADDR']} {$branch} {$payload['commits'][0]['message']}\n",
          FILE_APPEND|LOCK_EX
        );
      }
    }
  }
}
else {
  // Auth failure
  file_put_contents(
    $LOG_FILE_ERR,
    "{$date} invalid access: {$_SERVER['REMOTE_ADDR']}\n",
    FILE_APPEND|LOCK_EX
  );
}
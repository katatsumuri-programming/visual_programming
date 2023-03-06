<?php
// phpinfo();
// 接続
$link = mysqli_connect('localhost', 'testuser', 'kmRzqrHewN9U', 'visualprogramming');

if (!$link) {
    echo "データベース接続失敗" . PHP_EOL;
    echo "errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}

echo 'データベース接続成功';

// 切断
mysqli_close($link);

?>
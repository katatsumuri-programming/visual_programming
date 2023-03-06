<?php
$data = json_decode(file_get_contents("php://input"), true);
// 接続
$link = mysqli_connect('localhost', 'testuser', 'kmRzqrHewN9U', 'visualprogramming');
if (!$link) {
    echo "error";
    exit;
}
if ($data['process'] == 'set') {
    $query = "UPDATE share_projects SET block_xml=?, code=?, console=?, project_name=? WHERE id=?";
    $id = $data['id'];
    $block_xml = $data['block_xml'];
    $code = $data['code'];
    $console = $data['console_output'];
    $project_name = $data['project_name'];
    $stmt  = mysqli_prepare($link, $query);
    mysqli_stmt_bind_param( $stmt, 'sssss', $block_xml, $code, $console, $project_name, $id);
    mysqli_stmt_execute($stmt);

    echo json_encode(["success"]);
} else if ($data['process'] == 'add') {
    $query = "INSERT INTO share_projects VALUES (?, ?, ?, ?, ?)";
    $id = preg_replace_callback(
        '/x|y/',
        function($m) {
          return dechex($m[0] === 'x' ? random_int(0, 15) : random_int(8, 11));
        },
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      );
    $block_xml = $data['block_xml'];
    $code = $data['code'];
    $console = $data['console_output'];
    $project_name = $data['project_name'];
    $stmt  = mysqli_prepare($link, $query);
    mysqli_stmt_bind_param( $stmt, 'sssss', $id, $block_xml, $code, $console, $project_name);
    mysqli_stmt_execute($stmt);

    echo json_encode(["id" => $id]);
} else if ($data['process'] == 'get') {
    $query = "SELECT * FROM share_projects WHERE id=?";

    $stmt  = mysqli_prepare($link, $query);
    mysqli_stmt_bind_param( $stmt, 's', $data['id']);

    mysqli_stmt_bind_result($stmt,$id, $block_xml, $code, $console, $project_name);
    mysqli_stmt_execute($stmt);
    $dataArray = [];
    while(mysqli_stmt_fetch($stmt)){
        $dataArray = array(
            'id' => $id,
            'block_xml' => $block_xml,
            'code' => $code,
            'console_output' => $console,
            'project_name' => $project_name
        );
    }
    echo json_encode($dataArray);
}
?>
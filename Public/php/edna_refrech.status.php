<?php
include_once('database.php');

date_default_timezone_set('Europe/Moscow');

$sql = mysqli_query($GLOBALS['LINK_DB'], "SELECT * FROM `send_wa` WHERE `status`= 0 OR `status`= 1  ORDER BY `id` DESC LIMIT 1000;");
$rows = mysqli_fetch_all($sql, MYSQLI_ASSOC);
// mysqli_fetch_array_all();

$result = [];
foreach($rows as $row){
    // print_r($rows);
    // exit;
    // $datBase = explode(' ', $row["date"]);

    // $d = array_reverse(explode('.', $datBase[0])); //**  раскладываем дату в массив [ 2000, 12 , 23 ]
    // $t = explode(':', $datBase[1]); //**раскладываем время в массив [ 23, 59 , 59 ]*/

    // //! Переводим дату и время в мс и вычетаем 3 часа так как у нас установлен часовой пояс Europe/Moscow
    // $ms = mktime(intval($t[0]), intval($t[1]), intval($t[2]), intval($d[1]), intval($d[2]), intval($d[0])) - 10800;

    // $ToDate = date('Y-m-d', $ms + 10);
    // $ToTime = date('H:i:s', $ms + 10);

    // $fromDate = date('Y-m-d', $ms - 10);
    // $fromTime = date('H:i:s', $ms - 10);
    $result[] = $row['telefone'];
    // echo'<br>';
}

$d =  date('Y-d-m');
$t = date("H:i:s");
$request = check($result, $d, '00:00:00' , $d, $t);

print_r($request);





function check($telefon, $dateFrom, $timeFrom, $dateTo, $timeTo){
    // set_time_limit(20);
    $data = new stdClass();
    $data->subscriberFilter = new stdClass();
    $data->subscriberFilter->address = $telefon;
    $data->subscriberFilter->type = 'PHONE';
    $data->channelTypes = ["WHATSAPP"];
    $data->subjectId = 1941;
    $data->trafficType = ["HSM"];
    $data->dateFrom = $dateFrom . 'T' . $timeFrom . 'Z';
    $data->dateTo = $dateTo . 'T' . $timeTo . 'Z';
    $data->limit = 1;
    $data->offset = 0;
    // $SORTOBJ = new stdClass();
    // $SORTOBJ->property = "messageId";
    // $SORTOBJ->direction = "DESC";
    // $data ->sort = [$SORTOBJ];
    // include_once('database.php');
    $SQL_ENDA = mysqli_fetch_assoc(mysqli_query($GLOBALS['LINK_DB'], "SELECT  `cascade_id`, `api_key`, `working` FROM `enda_account` WHERE `id` = '1' "));
    $url = 'https://app.edna.ru/api/messages/history';  // Адрес, куда шлем запрос
    $headers = ['Content-Type: application/json', 'x-api-key:' . $SQL_ENDA['api_key']]; // заголовки нашего запроса
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_VERBOSE, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, true);
    $result = curl_exec($curl); // результат POST запроса */
    // mysqli_close($link);
    return $result;
}

?>
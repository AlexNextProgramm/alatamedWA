<?php
// function check_request($telefon, $dateFrom, $timeFrom, $dateTo, $timeTo){
//     $data = new stdClass();
//     $data->subscriberFilter = new stdClass();
//     $data->subscriberFilter->address = $telefon;
//     $data->subscriberFilter->type = 'PHONE';
//     $data->channelTypes = ["WHATSAPP"];
//     $data->subjectId = 1941;
//     $data->trafficType = ["HSM"];
//     $data ->dateFrom = $dateFrom.'T'.$timeFrom.'Z';
//     $data ->dateTo = $dateTo.'T'.$timeTo.'Z';
//     $data ->limit = 1;
//     $data ->offset = 0;
//     $SORTOBJ = new stdClass();
//     $SORTOBJ->property = "messageId";
//     $SORTOBJ->direction = "DESC";
//     $data ->sort = [$SORTOBJ];
//     include '../database.php';
//     $SQL_ENDA = mysqli_fetch_assoc(mysqli_query($link, "SELECT  `cascade_id`, `api_key`, `working` FROM `enda_account` WHERE `id` = '1' "));
//     $url = 'https://app.edna.ru/api/messages/history';  // Адрес, куда шлем запрос
//     $headers = ['Content-Type: application/json', 'x-api-key:'.$SQL_ENDA['api_key']]; // заголовки нашего запроса
//     $curl = curl_init();
//     curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
//     curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
//     curl_setopt($curl, CURLOPT_VERBOSE, 1);
//     curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
//     curl_setopt($curl, CURLOPT_URL, $url);
//     curl_setopt($curl, CURLOPT_POST, true); 
//     $result = curl_exec($curl); // результат POST запроса */
//     // $request = is_json($result);
//     return $result;
//  }

// //  $post = json_decode($_POST['get-status']);
// //  $d = explode('-', $post->fromDate);
// //  $t = explode(':', $post->fromTime);

// //  $sek = mktime(intval($t[0]), intval($t[1]), intval($t[2]), intval($d[1]), intval($d[2]), intval($d[0]) );
// //  $ToDate = date('Y-m-d', $sek);
// //  $ToTime = date('H:i:s', $sek - 60);13:49:25
// // 20.01.2024 10:11:07
//  $request = check_request('79775956853', '2024-01-21', '13:11:00','2024-01-21', '13:11:20');
// //  $request = check_request('79775956853', '2024-01-20', '06:00:00','2024-01-20', '14:00:00');
//   print_r(json_decode($request));
// //  DELIVERED - Доставлено
// // READ - прочитано
echo md5('2323Las')
?>
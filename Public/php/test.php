<?php


function check_request($telefon, $dateFrom, $timeFrom, $dateTo, $timeTo)
{
  $data = new stdClass();
  $data->subscriberFilter = new stdClass();
  $data->subscriberFilter->address = $telefon;
  $data->subscriberFilter->type = 'PHONE';
  $data->channelTypes = ["WHATSAPP"];
  $data->direction = "IN";
  $data->subjectId = 1941;
  $data->trafficType = ["HSM"];
  $data->dateFrom = $dateFrom . 'T' . $timeFrom . 'Z';
  $data->dateTo = $dateTo . 'T' . $timeTo . 'Z';
  $data->limit = 1;
  $data->offset = 0;
  $SORTOBJ = new stdClass();
  $SORTOBJ->property = "messageId";
  $SORTOBJ->direction = "ASC";
  // $data->sort = [$SORTOBJ];
  // var_dump($data);
  // echo json_encode($data);


  $url = 'https://app.edna.ru/api/messages/history';  // Адрес, куда шлем запрос
  $headers = ['Content-Type: application/json', 'x-api-key: 2c12de9c-ec51-4929-ad16-96e7fb02e6ad']; // заголовки нашего запроса
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
print_r(check_request('79775956853', '2024-06-04', '09:40:17', '2024-06-04','09:41:37'));


?>
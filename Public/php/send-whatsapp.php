<?php
date_default_timezone_set('Europe/Moscow');
/*
!формат запроса от клиента 
 *{
 *  telefon: "+7(977)882-30-52"
   *sample:"Текст шаблона уже с заменеными переменными "
  TODO bitton-"id(кнопки)":"тело значение или ссылка" - может не иметься в запросе 
  TODO buttonName-"id(кнопки)":"Имя кнопки которое может не иметься в запросе"
  *examination:"0-Не проверять номер 1-спрашивать 2- Не отправлять повторно"
 *}
   !Все остальные переменные уже вставлены в шаблон
*/
function open_response($status, $text = '', $exits = false){
   $open = new stdClass();
   $open->status = $status;
   $open->text = $text;
   echo json_encode($open);
   if($exits) exit;
}


// !Требования
// TODO Сохранить данные по отправки сообщения в базу 
// !=Дата и время отправки= =Телефон клиента= =Отправляемое сообщение=  =Кто отправил сообщение= =>
// !=Роль отправителя= =Статус отправки сообщения= 
// TODO Обязательно выслать статус ответа сервера по отправки сообщения 
// TODO Написать дополнительную проверку по шаблонам чтобы вдуг не отправить сообщение с незаполнеными переменными
// TODO Написать дополнительную проверку телефона по отправки сообшения 
// TODO Написать отдельный лог ошибок по отправки сообщений если ответ сервера по отправки
// TODO присылает ошибку то падает в одельный лог (на этапе разработки поможет разобраться с проблемами)
// TODO Проверка секретного ключа при отправки сообщения от несанкцанированных запросов на случай взлома сайта 

class  WhatsApp{

   static function send($post){

      // !Если нет секретного ключа отправляем код 511 для аунтентификации
      if (!array_key_exists('key', $_COOKIE)) open_response(511, 'Не верный секретный ключ.', true);
      $KEY_SECRET  = explode('/', url_decrypt($_COOKIE['key']));

      if (!count($KEY_SECRET) == 10) open_response(511, 'Не верный секретный ключ.', true);
      $id_base = $KEY_SECRET[7]; // id базы из секретного ключа
      $ROLE =  $KEY_SECRET[9];

      // !отправляем запрос в базу 
      $SQL = mysqli_fetch_assoc(mysqli_query($GLOBALS['LINK_DB'], "SELECT  `id`, `password`, `telefone`, `name`, `autetificator`, `role`, `count_message` FROM `unclude` WHERE `id`= '$id_base' "));

      $count_message = $SQL['count_message'];

      $KEY_SECRET_SQL =  explode('/', url_decrypt($SQL['autetificator']));
      $date = explode('-', $KEY_SECRET_SQL[3]); // достаем из ключа дату
      $time = explode(':', $KEY_SECRET_SQL[1]); // время из секретно ключа
      if (date('Y') != $date[0] && date('m') != $date[1] && $date[2] <= date('d') && $KEY_SECRET_SQL[5] != $KEY_SECRET[5]) {
         open_response(511, '', true);
         exit;
      }

      $post->telefon = str_replace(['+', '-', '(', ')', ' '], '', $post->telefon);

      // ! проверка шаблона на заполненость перед отправкой 
      if (strripos($post->sample, '{{') || strripos($post->sample, '}}')) open_response(203, '', true);
      // !=============================
      // !ПРОВЕРКА по examination
      // ** examination - это зашита от повторных отправок */
      // ** examination = 0  - Не проверять*/
      // ** examination = 1  - Спросить отправить повторно*/
      // ** examination = 2  - Категорически не отправлять */


      if (intval($post->examination) > 0) {
         $DATA_EXAMIN_SQL = mysqli_query($GLOBALS['LINK_DB'], "SELECT  `date`, `filial`, `message`  FROM `send_wa` WHERE `telefone`= '$post->telefon' AND `NameSample`= '$post->NameSample' ");
         while ($D_E_S = mysqli_fetch_assoc($DATA_EXAMIN_SQL)) {

            if ($D_E_S['message'] == $post->sample && intval($post->examination) == 2 && $D_E_S['filial'] == $_COOKIE['clinic']) {
               if (property_exists($post, 'examination_day')) {
                  $dm = explode('.', explode(' ', $D_E_S['date'])[0]);
                  if (mktime(0, 0, 0, date('m'), date('d'), date('Y')) < mktime(0, 0, 0, $dm[1], $dm[0] + intval($post->examination_day), $dm[2])) {
                     open_response(
                        511,
                        'Сообщение уже было отправлено ' . implode('.', $dm) . '. Повторная отправка возможна только ' . date('d.m.Y', mktime(0, 0, 0, $dm[1], $dm[0] + intval($post->examination_day) + 1, $dm[2]))
                     );
                     exit;
                  }
               } else {
                  open_response(201, 'Этому абоненту уже отправляли данное сообщение. Повторная отправка запрещена политикой компании.');
                  exit;
               }
            }


            if (intval($post->examination) == 1 && $D_E_S['filial'] == $_COOKIE['clinic']) {
               if ($D_E_S['message'] == $post->sample) {
                  open_response(400, $D_E_S['date'], true);
               }
            }
         }
      }

      // !===============================
      // ! ПРОВЕРКА КНОПОК
      $BTN = [];
      foreach ($post as $buttonkey => $value) {

         if (strripos($buttonkey, 'button') !== false && strripos($buttonkey, 'buttonName') === false && strripos($buttonkey, 'buttonType') === false) {
            $ID_BTN = explode('-', $buttonkey);
            $B = new stdClass();
            $B->text = $post->{"buttonName-" . $ID_BTN[1]};
            $B->buttonType = $post->{"buttonType-" . $ID_BTN[1]};

            if (strripos($buttonkey, 'setlink') !== false) { //! Запрос на отзыв
               include_once('_setlink.php');
               $url_button = newSetlink($_COOKIE['clinic'], $post->{$buttonkey}, $post->telefon);
               $B->{strtolower($B->buttonType)} = $url_button;
            } else {
               $B->{strtolower($B->buttonType)} = $post->{$buttonkey};
            }
            array_push($BTN, $B);
         }


         // ** кнопки QUICK_REPLY
         if (strripos($buttonkey, 'payload') !== false && strripos($buttonkey, 'payloadText') === false) {
            $ID_BTN = explode('-', $buttonkey);
            $B = new stdClass();
            $B->text = $post->{"payloadText-" . $ID_BTN[1]};
            $B->payload = $post->{$buttonkey};
            $B->buttonType = "QUICK_REPLY"; //**Тут заполнить тип кнопки как будет известно */
            array_push($BTN, $B);
         }
      }

      $headerWA = null;
      $footerWA = null;
      $NameSender = '';
      if (property_exists($post, 'header')) $headerWA = $post->header;
      if (property_exists($post, 'footer')) $footerWA = $post->footer;
      if (property_exists($post, 'NameSender')) $NameSender = $post->NameSender;


      $request  = null;
      if (count($BTN) > 0) {
         $request  = send_whatsapp($post->telefon, $post->sample, $headerWA, $footerWA, $BTN);
      } else {
         $request  = send_whatsapp($post->telefon, $post->sample, $headerWA, $footerWA, $BTN);
      }

      $count_message = $count_message + 1;
      mysqli_query($GLOBALS['LINK_DB'], "UPDATE `unclude` SET `count_message`='$count_message' WHERE `id`='$id_base' ");

      // // **Записываем лог сообщений Все попытки отправки сообщений 
      $file =  fopen("log_All_send_messange.txt", "a+");
      $date_send = date('d.m.Y H:i:s');
      $name_user = $SQL['name'];
      fwrite($file, '>>> TIME: ' . $date_send . ' ROLE: ' . $SQL['role'] . " NAME: " . $name_user . ' TELEFON-SEND: ' . $post->telefon . ' REQUEST-STATUS: ' . json_encode($request) . "\n");
      fclose($file);
      // //   если сообщение не отправлено по каким то причинам 
      $serilise_request = serialize($request);
      $request = '{"requestId":"'.$request->requestId.'"}';
      $errors = 0;
      // if (gettype($request) == 'object' && property_exists($request, 'requestId')) {
         open_response(200, $request);
      // } else {
      //    $errors = 1;
      //    open_response(500, $request);
      // }

      $filial = 'Не определены куки';

      if(array_key_exists('clinic', $_COOKIE)) $filial = $_COOKIE['clinic'];

      mysqli_query($GLOBALS['LINK_DB'], "INSERT INTO `send_wa`(`id`, `date`,`sender_name`,`telefone`,`filial`,`id_user`,`name_user`,`role_user`,`NameSample`,`message`,`Error`,`requestId`, `status`, `json`)
                                     VALUES (NULL, '$date_send','$NameSender','$post->telefon', '$filial' ,'$id_base', '$name_user', '$ROLE','$post->NameSample','$post->sample', '$errors','','0', '$serilise_request')");

   }




   static function getStatus($post){
         print_r($post);
         $sql = mysqli_query($GLOBALS['LINK_DB'], "SELECT `status` FROM `send_wa` WHERE `id` = $post->id_base");
          $rows = mysqli_fetch_assoc($sql);
         if(count($rows) != 0 ){
            echo $rows['status'];
         }
   //    $d = explode('-', $post->fromDate); //**  раскладываем дату в массив [ 2000, 12 , 23 ]
   //    $t = explode(':', $post->fromTime); //**раскладываем время в массив [ 23, 59 , 59 ]*/

   //    //! Переводим дату и время в мс и вычетаем 3 часа так как у нас установлен часовой пояс Europe/Moscow
   //    $ms = mktime(intval($t[0]), intval($t[1]), intval($t[2]), intval($d[1]), intval($d[2]), intval($d[0])) - 10800;

   //    $ToDate = date('Y-m-d', $ms + 10);
   //    $ToTime = date('H:i:s', $ms + 10);
   //    $post->fromDate = date('Y-m-d', $ms - 10);
   //    $post->fromTime = date('H:i:s', $ms - 10);

   //    // print_r($post);
   //    //*Делаем запрос в edna
     
   //    $request = check_request($post->telefon, $post->fromDate, $post->fromTime, $ToDate, $ToTime);

   //    // !Должны получить json но все равно проверим что строка являеться json
   //    if (json_decode($request, true)) {

   //       $obj_request = json_decode($request);

   //       // !проверяем что объект не пустой 
   //       if (gettype($obj_request) == 'object' && property_exists($obj_request, 'content') && count($obj_request->content) > 0) {
   //          // include 'database.php';
   //          // $f =  fopen("log_statuses.txt", "a+");
   //          // fwrite($f, 'Status: '.$obj_request->content[0]->deliveryStatus." telefon: ".$post->telefon." countResponse:".count($obj_request->content)."ID-BASE: ".$post->id_base."\n");
   //          // fclose($f);
   //          $st = 'undefined';
   //          if (gettype($obj_request->content[0]) == 'object' && property_exists($obj_request->content[0], 'deliveryStatus')) $st = $obj_request->content[0]->deliveryStatus;
   //          switch ($st) {
   //             case 'DELIVERED':
   //                mysqli_query($GLOBALS['LINK_DB'], "UPDATE `send_wa` SET `status`='1' WHERE `id` = $post->id_base");
   //                echo '1';
   //                break;
   //             case 'SENT':
   //                echo '0';
   //                break;
   //             case 'ENQUEUED':
   //                echo '0';
   //                break;
   //             case 'READ':
   //                mysqli_query($GLOBALS['LINK_DB'], "UPDATE `send_wa` SET `status`='2' WHERE `id` = $post->id_base");
   //                echo '2';
   //                break;
   //             case 'UNDELIVERED':
   //                mysqli_query($GLOBALS['LINK_DB'], "UPDATE `send_wa` SET `status`='3' WHERE `id` = $post->id_base");
   //                echo '3';
   //                break;
   //             default:
   //                echo 'undefined';
   //          }
   //       } else {
   //          echo 'NaN';
   //       }
   //    } else {

   //       // ! Если ответ из edna был не json выведем в консоле ошибку 
   //       echo $request;
   //    }
   }
}


// ** Функция отправки сообщения в ватсап параметры(телефон в формате 79261881687 , текст-собщения , Заголовок по умолчанию NULL, Кнопки по умолчанию NULL)
//  =======================================================================================================================================================
function send_whatsapp($tel, $text, $headerWA = null, $footerWA = null, $buttons = null){
   // include_once('database.php');
   $SQL_ENDA = mysqli_fetch_assoc(mysqli_query($GLOBALS['LINK_DB'], "SELECT  `cascade_id`, `api_key`, `working` FROM `enda_account` WHERE `id` = '1' "));
   // $url = 'https://app.edna.ru/api/cascade/schedule';
   // $headers = ['Content-Type: application/json', 'x-api-key:'.$SQL_ENDA['api_key']];

   // создаем объект  отпрвки сообщения 
   $data = new stdClass();
   $data->requestId = uniqid();
   $data->cascadeId = $SQL_ENDA['cascade_id'];
   $data->subscriberFilter = new stdClass();
   $data->subscriberFilter->address = $tel;
   $data->subscriberFilter->type = 'PHONE';
   $data->content = new stdClass();

   $data->content-> whatsappContent = new stdClass();
   $data->content-> whatsappContent -> contentType = 'TEXT';
   $data->content-> whatsappContent ->text = $text;

    if($headerWA){
      $data->content-> whatsappContent ->header = new stdClass();
      $data->content-> whatsappContent ->header = $headerWA;
    }
    if($footerWA){
      $data->content-> whatsappContent ->footer = new stdClass();
      $data->content-> whatsappContent ->footer = $footerWA;
    }

   if($buttons){
      $data->content-> whatsappContent->keyboard = new stdClass();
      $data->content-> whatsappContent->keyboard->rows = [];
      $rows = new stdClass();
      $rows->buttons = [];
      foreach($buttons as $but){
         array_push($rows->buttons, $but);
      }
      array_push($data->content-> whatsappContent ->keyboard->rows, $rows);
     
      // !тут пропишем кнопки  написать объект структуру отправки кнопок 
      // === понять какакие ньюансы ждать по отправки кнопок 
      // TODO требуються ли какието другие параметры кнопок кроме Тела и Имя 
   }
   //          $curl = curl_init();
	// 			curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
	// 			curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	// 			curl_setopt($curl, CURLOPT_VERBOSE, 1);
	// 			curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
	// 			curl_setopt($curl, CURLOPT_URL, $url);
	// 			curl_setopt($curl, CURLOPT_POST, true); 
	// 			$result = curl_exec($curl); // результат POST запроса */
	// 			$request = is_json($result);
   //          // file_put_contents('../Json/post.json', json_encode($data,  JSON_UNESCAPED_UNICODE));
   //          // return json_decode( '{"requestId":"'.$data->requestId.'"}');
            return $data;
 }




//  **=================================КОНЕЦ ФУНКЦИИ ОТПРАВКИ В ВАТСАП=====================================================================================================================
// ========================================================================================================================================================================================
// Формат даты строковое 2023-06-01
// Формат время строковое 00:00:00
// Формат телефона 79979998899
// function check_request($telefon, $dateFrom, $timeFrom, $dateTo, $timeTo){
//    set_time_limit(30);
//    $data = new stdClass();
//    $data->subscriberFilter = new stdClass();
//    $data->subscriberFilter->address = $telefon;
//    $data->subscriberFilter->type = 'PHONE';
//    $data->channelTypes = ["WHATSAPP"];
//    $data->subjectId = 1941;
//    $data->trafficType = ["HSM"];
//    $data ->dateFrom = $dateFrom.'T'.$timeFrom.'Z';
//    $data ->dateTo = $dateTo.'T'.$timeTo.'Z';
//    $data ->limit = 1;
//    $data ->offset = 0;
//    // $SORTOBJ = new stdClass();
//    // $SORTOBJ->property = "messageId";
//    // $SORTOBJ->direction = "DESC";
//    // $data ->sort = [$SORTOBJ];
//    // include_once('database.php');
//    $SQL_ENDA = mysqli_fetch_assoc(mysqli_query($GLOBALS['LINK_DB'], "SELECT  `cascade_id`, `api_key`, `working` FROM `enda_account` WHERE `id` = '1' "));
//    // mysqli_close($GLOBALS['LINK_DB']);

//    $url = 'https://app.edna.ru/api/messages/history';  // Адрес, куда шлем запрос
//    $headers = ['Content-Type: application/json', 'x-api-key:'.$SQL_ENDA['api_key']]; // заголовки нашего запроса
  
//    $curl = curl_init();
//    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
//    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
//    curl_setopt($curl, CURLOPT_VERBOSE, 1);
//    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
//    curl_setopt($curl, CURLOPT_URL, $url);
//    curl_setopt($curl, CURLOPT_POST, true); 
//    $result = curl_exec($curl); // результат POST запроса */
   
//    return $result;
// }

// Проверка перед декодом чтобы не выдовало ошибку 
function is_json($string){
   if(json_decode($string, true)){
       return json_decode($string);
   }else{
       return $string;
   }
}


if(error_get_last()){
   $Arr =  error_get_last(); // получаем массив ошбки
   $f =  fopen("log_error.txt", "a+"); //открываем файл для записи курсов в конце на новой строке
   // вписывам когда  в каком файле на какой строке и что произошло 
   fwrite($f, '>>> TIME: '.date('d.m.Y H:i:s').' FILE: '.$Arr['file']." LINE: ".$Arr['line'].' ERROR: '.$Arr['message']."\n");
   fclose($f); // закрваем файл
 }

?>
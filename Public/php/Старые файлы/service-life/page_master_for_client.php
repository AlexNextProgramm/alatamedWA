<?php
date_default_timezone_set('Europe/Moscow'); // Time zone по умолчанию
include '../library/error.php';
include '../library/library.php';
include '../library/date-time.php';

if(!is_dir('../../Json/master')){ // проверяем деррикторию
    mkdir('../../Json/master', 0777, true); // создаем дерикторию
}


if(array_key_exists('get-master-for-client', $_POST)){
  $id  =  $_POST['get-master-for-client'];
  if(file_exists('../../Json/master/'.$id.'.json')){
  $master = json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
  include '../database.php';
  $control = true;
  if(array_key_exists('id_client', $_COOKIE)){
    $client = json_decode(file_get_contents('../../Json/client/'. $_COOKIE['id_client'].'.json'));
    if(count($master->base) != 0){
      for($n = 0; $n < count($master->base); $n++){ //ищем запись
        if(property_exists($master->base[$n], 'IDClient') && $master->base[$n]->IDClient == $_COOKIE['id_client']){
          for($bc = 0; $bc < count($client->base); $bc++){
            if($master->base[$n]->IDClient ==$client->base[$bc]->IDMaster && $client->base[$bc]->visit == true){
              $result = mysqli_fetch_assoc(mysqli_query($link, "SELECT * FROM `master` WHERE `id` = '$master->id' "));
              $master->name = $result['name'];
              $master->telefone = str_replace( [')', '(', '-', ' ', '+'],"", $result['telefone']);
              $control = false;
            }
          }

        }
      }
    }
  }
    // если зашел гость 
    if($control){
      $name =  mysqli_fetch_assoc(mysqli_query($link, "SELECT `name` FROM `master` WHERE `id` = '$id' "));
      $master->name = explode(" ", $name['name'])[1];
    }
    echo json_encode($master);
  
  }else{
    error('404', 'Нет такого мастера');
  }
}

if(array_key_exists('record-client', $_POST)){
  $post = json_decode($_POST['record-client']);
  $post->record->telefone =  str_replace( [')', '(', '-', ' ', '+'],"", $post->record->telefone);
  // print_r($post);

  $master = json_decode(file_get_contents('../../Json/master/'.$post->masterID.'.json'));
  // тут нужно провести проверку на свободное время если его нет остановить запись
  if(!bool_record($master->timetable, $post->record->date, $post->record->time, $post->record->interval)){
    error('600', "Запись уже занята");
    exit;
  }
  for($i = 0; $i < count($master->timetable); $i++){
    if($master->timetable[$i]->date == $post->record->date){

      // Добавляем телефон для обратной связи если клиент авторизован
      if(property_exists( $post->record, 'clientID')){
        // include '../database.php';
        // $idClient = $post->record->clientID;
        // $telefone_sql = mysqli_fetch_assoc(mysqli_query($link, "SELECT `telefone` FROM `client` WHERE `id` = '$idClient'"));
        $contr_base = true;
        for($b = 0; $b < count($master->base); $b++){
          if($master->base[$b]->IDClient  == $post->record->clientID){
           if(property_exists($master->base[$b], 'name')){
              $post->record->name = $master->base[$b]->name;
            }
            $master->base[$b]->dateVisit = $post->record->date;
            $contr_base = false;
          }
        }
        
        if($contr_base){
          $new_base = new stdClass();
          $new_base->IDClient =  $post->record->clientID;
          $new_base->dateVisit =  $post->record->date;
          array_push( $master->base, $new_base); 
        }
    }else{
      $contr_base = true;
      for($b = 0; $b < count($master->base); $b++){
        if(property_exists($master->base[$b], 'telefone')){
          $tel = trim(str_replace([')', '(', '-', ' ', '+'],"", $post->record->telefone));
        if(trim($master->base[$b]->telefone) == $tel){
          $post->record->name = $master->base[$b]->name;
          $master->base[$b]->dateVisit = $post->record->date;
          $contr_base = false;
        }
      }
      }
      
      if($contr_base){
        $new_base = new stdClass();
        $new_base->name = $post->record->name;
        $new_base->telefone = trim(str_replace([')', '(', '-', ' ', '+'],"", $post->record->telefone));
        $new_base->dateVisit =  $post->record->date;
        array_push($master->base, $new_base); 
      }
     
    }
    array_push( $master->timetable[$i]->record, $post->record);  
    }
  }
  if(property_exists($post->record, 'clientID')){
    // Запись в базу клиента
    
    // тут записываем запись к клиенту 
   $client = json_decode(file_get_contents('../../Json/client/'.$post->record->clientID.'.json'));
   $record = new stdClass();
   $record->date = $post->record->date;
   $record->time = $post->record->time;
   $record->price = $post->record->price;
   $record->service = $post->record->service;
   $record->interval = $post->record->interval;
   $record->note = $post->record->note;
   include '../database.php';
   $id = $post->masterID;
   $name_sql =  mysqli_fetch_assoc(mysqli_query($link, "SELECT `name` FROM `master` WHERE `id` = '$id' "));
   $names = explode(" ", $name_sql['name'])[1];
   $record->name = $names;
   $record->typeMaster = $master->specialist;
   $record->IDMaster = $id;
  //  Вносим в базу для клиента
  $control_base = true;
  for($b = 0; $b < count($client->base); $b++){
    if($client->base[$b]->IDMaster ==  $post->masterID){
      $control_base = false;
    }
  }
  if($control_base){
    $base = new stdClass();
    $base->name = $names;
    $base->IDMaster = $post->masterID;
    $base->typeMaster = $master->specialist;
    $base->visit = false;
    array_push($client->base, $base);
  }
   array_push($client->recording, $record);
   file_put_contents('../../Json/client/'.$post->record->clientID.'.json', json_encode($client, JSON_UNESCAPED_UNICODE), LOCK_EX);
  }

  array_push($master->news, news('У вас новая запись! '.strFormatDate($post->record->date). '  в '.format_milliseconds_two($post->record->time) ));
  // Добовляем активити
  if($master->activity > 0){
    $master->activity++;
  }
  puts($master, $post->masterID );
  error("OK", "Вы успешно записались");
}


if(array_key_exists('record-reg-client', $_POST)){
  $post = json_decode($_POST['record-reg-client']);
  include '../database.php';
 
  $result = mysqli_query($link, "SELECT * FROM `client`");
   $i=0;
    $USER = []; // масив пользователей
    // находим id и записываем куки
    while($USER[$i] = mysqli_fetch_assoc($result)){
      if(mb_strtolower($USER[$i]['email'], 'UTF-8') == mb_strtolower($post->email, 'UTF-8')){ // Сравниваем на существование 
          error('309', 'Такой пользователь существует');
          exit;
      }
      $i++;
    }
    
    
    $control = -1;
  
    $new = new stdClass(); //создакм объект регистрации
    $new->newRegClient = [];

      if(!is_dir('../../Json/new-reg')){ // проверяем деррикторию
        mkdir('../../Json/new-reg', 0777, true); // создаем дерикторию
      }else{

      if(file_exists('../../Json/new-reg/registration.json')){ // файл существует
        $new = json_decode(file_get_contents('../../Json/new-reg/registration.json'));
        if(property_exists($new, 'newRegClient')){

        // проверяем наличие в ожидаемой регистрации Клиентов
        for($n = 0; $n < count($new->newRegClient); $n++){
          if(mb_strtolower($new->newRegClient[$n]->email, 'UTF-8') == mb_strtolower($post->email, 'UTF-8')){
            $control = $n;
            break;
          }
        }

      }else{
        $new->newRegClient = [];
      }
      
    }
    }



     

      $send = new stdClass();
      $post->record->name = trim($post->record->name);//убираем пробелы
      $send->lastName = explode(' ', trim($post->record->name))[0];
      $arrName = explode(' ', trim($post->record->name));
      if(count($arrName) > 1){
        $send->firstName = explode(' ', trim($post->record->name))[1];
      }else{
        $send->firstName = '';
      }

      $send->telefone = $post->record->telefone;
      $send->email = $post->email;
      $send->password = $post->password;
      $send->uniqid = uniqid();
      $send->record = $post->record;
      $send->record->IDMaster = $post->masterID;

      
    if($control == -1){
      array_push($new->newRegClient, $send);
    }else{
      $new->newRegClient[$control] = $send;
    }

    file_put_contents('../../Json/new-reg/registration.json', json_encode($new, JSON_UNESCAPED_UNICODE));

    include '../library/email.php';
    sendMail(trim($post->email),'<a href="https://service-live.ru/confirmclient'.$send->uniqid.'">Перейдите по ссылке чтобы зарегистрироваться</a>
    <br> Это автоматическое сообщение на него не нужно отвечать
    <br>С уважением Service-Life
    <br> <p> Техническая поддержка info@service-life.ru</p>
    ', "Подтверждение регистрации пользователя"
    );
    // льпровляем ответ
    error('new-reg',
    'Подтвердите вашу регистрацию! На указаной электронной почте, пeрейдите по ссылке, письмо может храниться в спаме!');
     exit;
}

function bool_record($timetable, $dateRecord, $timeRecord, $Interval){
  for($t = 0; $t < count($timetable); $t++ ){
    if($timetable[$t]->date == $dateRecord){
      for($r = 0; $r < count($timetable[$t]->record); $r++){
        // Если накладывается начало
        if($timeRecord >= $timetable[$t]->record[$r]->time  &&
          $timeRecord < ($timetable[$t]->record[$r]->time + $timetable[$t]->record[$r]->interval)  ){
            // попадос
            return false;
        }
        // Если накладываеться конец записи
        if(($timeRecord + $Interval) <= ($timetable[$t]->record[$r]->time + $timetable[$t]->record[$r]->interval) &&
        ($timetable[$t]->record[$r]->time ) < ($timeRecord + $Interval)){
          return false;
          
        }
        // Если отрезок записи вхходит в запись
        if($timeRecord <= $timetable[$t]->record[$r]->time && ($timeRecord + $Interval)>= $timetable[$t]->record[$r]->time){
          return false;
        }
      }
    }
  }
  return true;

}


// ==========================================ВОПРОС МАСТЕРУ===================
if(array_key_exists('question', $_POST)){

  include '../database.php';


  $post = json_decode($_POST['question']);

  if(file_exists('../../Json/master/'.$post->IDMaster.'.json')){

    $master = json_decode(file_get_contents('../../Json/master/'.$post->IDMaster.'.json'));

    array_push($master->news, news($post->text. ' Email: '.$post->email, ' Вам задали вопрос от '.$post->name));

    file_put_contents('../../Json/master/'.$post->IDMaster.'.json', json_encode($master, JSON_UNESCAPED_UNICODE), LOCK_EX);

    $sql =  mysqli_fetch_assoc(mysqli_query($link, "SELECT `email` FROM `master` WHERE `id` = '$post->IDMaster' "));

    include '../library/email.php';

    sendMail($sql['email'],'
    <h1>'.$post->name.'</h1>
    <h2> Email:  '.$post->email.'</h2>
    <h4> Вопрос: '.$post->text.'</h4>
    <br> Это автоматическое сообщение на него не нужно отвечать
    <br> С уважением Service-Life
    <br> <p> Техническая поддержка info@service-life.ru</p>
    ',"Вопрос от клиента"
    );
    error("OK", "Отправлено");
    exit;

  }


  error("300", "Потерян файл json мастера");
}



function puts($mast, $id){
  file_put_contents('../../Json/master/'.$id.'.json', json_encode($mast, JSON_UNESCAPED_UNICODE), LOCK_EX);
}

?>
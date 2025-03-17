<?php
include '../database.php';
include '../library/crypt/crypt.php';
include '../library/error.php';
include '../library/library.php';



// Регистрация мастера
if(array_key_exists('reg-master',$_POST)){
    $post = json_decode($_POST['reg-master']);
    $result = mysqli_query($link, "SELECT * FROM `master`");
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
      // формируем отправку на сервер
      if(!is_dir('../../Json/new-reg')){ // проверяем деррикторию
        mkdir('../../Json/new-reg', 0777, true); // создаем дерикторию
       
      }
        if(file_exists('../../Json/new-reg/registration.json')){
        $new = json_decode(file_get_contents('../../Json/new-reg/registration.json'));
          if($new == NULL || !property_exists($new, 'newReg')){
            $new = new stdClass();
            $new->newReg = [];
          }else{
          // проверяем наличие в ожидаемой регистрации
          for($n = 0; $n < count($new->newReg); $n++){
            if(mb_strtolower($new->newReg[$n]->email, 'UTF-8') == mb_strtolower($post->email, 'UTF-8')){
              $control = $n;
              break;
             }
           }
          }
      }else{
        $new = new stdClass();
        $new->newReg = [];
      }
      
      $post->uniqid = uniqid();
      if($control == -1){
        array_push($new->newReg, $post);
      }else{
        $new->newReg[$control] = $post;
      }
      file_put_contents('../../Json/new-reg/registration.json', json_encode($new, JSON_UNESCAPED_UNICODE));
      include '../library/email.php';
      sendMail($post->email,'<a href="https://service-live.ru/confirmation'.$post->uniqid.'">Перейдите по ссылке чтобы зарегистрироваться</a>
      <br> Это автоматическое сообщение на него не нужно отвечать
      <br>С уважением Service-Life
      <br> <p> Техническая поддержка info@service-life.ru</p>
      ', "Подтверждение регистрации пользователя"
      );

      error('OK',
      'Подтвердите вашу регистрацию! На указаной электронной почте, пeрейдите по ссылке, письмо может храниться в спаме!');
       exit;
}

// Подтверждение регистрации 
if(array_key_exists('confirmation',$_POST)){
    $uniqid = json_decode($_POST['confirmation'])->uniqid;
    if(!is_dir('../../Json/new-reg')){ // проверяем деррикторию
      mkdir('../../Json/new-reg', 0777, true); // создаем дерикторию
    }
    $new = json_decode(file_get_contents('../../Json/new-reg/registration.json'));
    $controle = 0;
    for($i=0; $i < count($new->newReg); $i++){
      $control = 1;
      if($new->newReg[$i]->uniqid == $uniqid){
        $control = 2;
        $id = RegistrationMaster($new->newReg[$i]);

        if($id){
          $new->newReg = array_delete($new->newReg, $i);
          file_put_contents('../../Json/new-reg/registration.json', json_encode($new, JSON_UNESCAPED_UNICODE));
          setcookie('uniqid', '' , -1,'/' );
          error('OK', $id);
          exit;
        }
    }
  }
  if($control == 2) error('400', 'Ошибка при регистрации поробуйте еще раз');
  if($control == 1) error('401', 'Почтовый ящик не подтвержден ссылка не действительна, попробуйте еще раз');
  if($control == 0)error('404', 'Такой ссылки не существует');
    exit;
}
//Аунтотификация мастера и клиента при входе в кабинет
if(array_key_exists('authentication',$_POST)){
      $post = json_decode($_POST['authentication']);

        if($post->type == 'master'){

        if(array_key_exists('key_secure', $_COOKIE)){

          $key = decrypt($_COOKIE['key_secure']);// раскодируем id

          $USER =  mysqli_fetch_assoc(mysqli_query($link, "SELECT * FROM `master` WHERE `id` = '$post->id'"));
          if(!$USER){
            echo error('404','Нет такого кабинета в базе');
            exit;
          } 
            if($post->id == $USER['id'] &&  trim(strval($USER['autetificator'])) == trim(strval($key))){ // Сравниваем на существование 

                setcookie('key_secure', encrypt($USER['autetificator']) ,  time()+3600*24*10,'/' );
                include 'online.php';
                online($USER['id'], false);
                // тут отдаем данные
                echo error('OK', $USER['id']);
                exit;

            }else{
              echo error('300', 'Не ваш кабинет');
            }
          
        }else{
          echo error('800', 'Требуется авторизация');
        }

    }



    if($post->type == 'client'){
      $result = mysqli_query($link, "SELECT * FROM `client`");
      $i=0;
      $USER = []; // масив пользователей`
    
      if(array_key_exists('key_secure', $_COOKIE)){
        $key = decrypt($_COOKIE['key_secure']);// раскодируем key
        $USER =  mysqli_fetch_assoc(mysqli_query($link, "SELECT * FROM `client` WHERE `id` = '$post->id'"));
        if(!$USER){
          echo error('404','Нет такого кабинета в базе');
          exit;
        } 

        while($USER[$i] = mysqli_fetch_assoc($result)){

          if($post->id == $USER[$i]['id'] &&  trim(strval($USER[$i]['autetificator'])) == trim(strval($key))){ // Сравниваем на существование 
              setcookie('key_secure', encrypt($USER[$i]['autetificator']) ,  time()+3600*24*10,'/' );
              // тут отдаем данные
              echo error('OK', $USER['id']);
              exit;
          }


          $i++;
        }

        error('300','Не ваш кабинет');
      }else{
      error('800', 'Требуется авторизация');
      }
  }
}

// Вход в кабинет Мастеров И клиентов

    if(array_key_exists('enter',$_POST)){
      $post = json_decode($_POST['enter']);


      if($post->type == 'master'){


        $result = mysqli_query($link, "SELECT * FROM `master`");
        $i = 0;
        $USER = []; // масив пользователей

        // находим id и записываем куки
        $control = 'Неверный емайл';

        while($USER[$i] = mysqli_fetch_assoc($result)){
          if(mb_strtolower($USER[$i]['email'], 'UTF-8') == mb_strtolower($post->email, 'UTF-8')){
            $control = 'Неверный пароль';
            // var_dump($post->password == $USER[$i]['password']);
            if($USER[$i]['password'] == md5($post->password)){
            // Сравниваем на существование 
              $id = $USER[$i]['id'];
              setcookie('id_master',$USER[$i]['id']  ,time() +3600*24*360,'/');
              setcookie('key_secure', encrypt($USER[$i]['autetificator']) ,  time()+3600*24*10,'/' );
              echo 'enter';
              exit;
            }
          }
          $i++;
        }
        echo $control;
    }





    if($post->type == 'client'){


      $result = mysqli_query($link, "SELECT * FROM `client`");
      $i = 0;
      $USER = []; // масив пользователей

      // находим id и записываем куки
      $control = 'Неверный емайл';

      while($USER[$i] = mysqli_fetch_assoc($result)){
        if(mb_strtolower($USER[$i]['email'], 'UTF-8') == mb_strtolower($post->email, 'UTF-8')){
          $control = 'Неверный пароль';
          // var_dump($post->password == $USER[$i]['password']);
          if($USER[$i]['password'] == md5($post->password)){
          // Сравниваем на существование 
            $id = $USER[$i]['id'];
            setcookie('id_client',$USER[$i]['id']  ,time() +3600*24*660,'/');
            setcookie('key_secure', encrypt($USER[$i]['autetificator']) ,  time()+3600*24*360,'/' );
            echo 'enter';
            exit;
          }
        }
        $i++;
      }
      echo $control;
  }


  }






// Функция Регистрации Пользователя Мастера
  function RegistrationMaster($post){
    include '../database.php';
    
    $options = json_decode(file_get_contents('../../Json/options1.json'));
    $spec = lowercase_first_letter($post->Master->specialist);
    // проверяем на наличие спецов город тут не вноситься 
    if(!in_array($spec, $options->specialist)){
      array_push($options->specialist, $spec);
      array_multisort($options->specialist, SORT_STRING); // сортируем
      file_put_contents('../../Json/options1.json', json_encode($options, JSON_UNESCAPED_UNICODE)); //записываем в опции
    }
   


    $password = md5($post->password);
    $telefone = $post->Master->telefone;
    $post->Master->telefone = '';
    $autetificator =  uniqid();
    $name = $post->Master->name;


    // проверка на наличие мыла
    $email  = mb_strtolower($post->email, 'UTF-8');
    $row =  mysqli_fetch_assoc(mysqli_query($link, "SELECT `name`, `password`, `email`, `telefone`, `autetificator`, `id` FROM `master` WHERE `email` = '$email' "));
    if($row){
      return false; //Запрещаем дальнейшую регистрацию
    }else{
      mysqli_query($link, "INSERT INTO `master`(`id`, `email`, `password`, `telefone`, `autetificator`, `name`) VALUES ( Null,'$email','$password','$telefone',' $autetificator', '$name')");
    }



    $result = mysqli_query($link, "SELECT * FROM `master`");
    $i = 0;
    $USER = [];
    while($USER[$i] = mysqli_fetch_assoc($result)){
      if(mb_strtolower($USER[$i]['email'], 'UTF-8') == mb_strtolower($post->email, 'UTF-8')){ // Сравниваем на существование 
        setcookie('id_master', $USER[$i]['id'],   time()+3600*24*360,'/', );
        setcookie('key_secure', encrypt($autetificator) ,  time()+3600*24*10,'/' );
        // создаем файл
        if(!is_dir('../../Json/master')){ // проверяем деррикторию
          mkdir('../../Json/master', 0777, true); // создаем дерикторию
        }

        $post->Master->id = $USER[$i]['id'];
        file_put_contents('../../Json/master/'.$USER[$i]['id'].'.json', json_encode($post->Master,  JSON_UNESCAPED_UNICODE));
       return $USER[$i]['id'];
      }
      $i++;
    }
    return false;
  }


// ==========================================Востановление пароля=============================================================
// =========================================
// ===========================================================================================================================



  if(array_key_exists('restore', $_POST)){
    $post = json_decode($_POST['restore']);

    // ВОСТАНОВЛЕНИЕ ПАРОЛЯ ДЛЯ МАСТЕРОВ
    if($post->type == 'master'){


      $result = mysqli_query($link, "SELECT * FROM `master`");
      $i = 0;
      $USER = [];
      while($USER[$i] = mysqli_fetch_assoc($result)){
        if($USER[$i]['email'] == $post->email){

          $cart = ['!', "#", "<", ">", "/", "-","=", "+", "&", "*"];
          $uniqid  = str_replace($cart,"0",md5(md5(uniqid())));

          include '../library/email.php';
          sendMail($post->email,'<h5><a href="https://service-live.ru/restore'.$uniqid.'">Перейдите по ссылке чтобы востановить пароль</a></h5>
          <br> Это автоматическое сообщение на него не нужно отвечать
          <br> С уважением Service-Life
          <br> <p> Техническая поддержка info@service-life.ru</p>
          ', "Восстановление пароля"
          );
          setcookie('uniqid',  $uniqid,  time()+3600*24*10,'/' );
          $control = true;


          if(!is_dir('../../Json/restore')){ // проверяем деррикторию
            mkdir('../../Json/restore', 0777, true); // создаем дерикторию
            $restore_json = new stdClass();
            $restore_json->ref_restore_ = [];
          }else{
            $restore_json = json_decode(file_get_contents('../../Json/restore/restore.json'));
         
            if($restore_json != NULL && property_exists($restore_json, 'ref_restore_')){
            for($n = 0; $n < count($restore_json->ref_restore_); $n++){
              if($restore_json->ref_restore_[$n]->id ==  $USER[$i]['id']){
                $restore_json->ref_restore_[$n]->uniqid = $uniqid;
                $control = false;
                break;
              }
            }
          }else{
            $restore_json = new stdClass();
            $restore_json->ref_restore_ = [];
          }
          }


          if($control){
          $ref_restore_ = new stdClass();
          $ref_restore_ -> id = $USER[$i]['id'];
          $ref_restore_ ->type = 'master';
          $ref_restore_->uniqid = $uniqid;
          array_push($restore_json->ref_restore_ , $ref_restore_ );
          }
          file_put_contents('../../Json/restore/restore.json', json_encode($restore_json,  JSON_UNESCAPED_UNICODE));
          error('OK', 'Перейдите на почту для восстановления пароля');
          exit;

        }
      }
      echo error('308', 'Такого пользователя не существует');
      exit;
    }

    // ВОССТАНОВЛЕНИЕ ДЛЯ КЛИЕНТОВ


    if($post->type == 'client'){

      $result = mysqli_query($link, "SELECT * FROM `client`");
      $i = 0;
      $USER = [];
      while($USER[$i] = mysqli_fetch_assoc($result)){
        if($USER[$i]['email'] == $post->email){

          $cart = ['!', "#", "<", ">", "/", "-","=", "+", "&", "*"];
          $uniqid  = str_replace($cart,"0",md5(md5(uniqid())));

          include '../library/email.php';
          sendMail($post->email,'<h5><a href="https://service-live.ru/restore'.$uniqid.'">Перейдите по ссылке чтобы востановить пароль</a></h5>
          <br> Это автоматическое сообщение на него не нужно отвечать
          <br> С уважением Service-Life
          <br> <p> Техническая поддержка info@service-life.ru</p>
          ', "Восстановление пароля на Service-Live"
          );

          $control = true;


          if(!is_dir('../../Json/restore')){ // проверяем деррикторию
            mkdir('../../Json/restore', 0777, true); // создаем дерикторию
            $restore_json = new stdClass();
            $restore_json->ref_restore_ = [];
          }else{
            $restore_json = json_decode(file_get_contents('../../Json/restore/restore.json'));
         
            if($restore_json != NULL && property_exists($restore_json, 'ref_restore_')){
            for($n = 0; $n < count($restore_json->ref_restore_); $n++){
              if($restore_json->ref_restore_[$n]->id ==  $USER[$i]['id']){
                $restore_json->ref_restore_[$n]->uniqid = $uniqid;
                $control = false;
                break;
              }
            }
          }else{
            $restore_json = new stdClass();
            $restore_json->ref_restore_ = [];
          }
          }


          if($control){
          $ref_restore_ = new stdClass();
          $ref_restore_ -> id = $USER[$i]['id'];
          $ref_restore_ ->type = 'client';
          $ref_restore_->uniqid = $uniqid;
          array_push($restore_json->ref_restore_ , $ref_restore_ );
          }
          file_put_contents('../../Json/restore/restore.json', json_encode($restore_json,  JSON_UNESCAPED_UNICODE));
          error('OK', 'Перейдите на почту для восстановления пароля');
          exit;

        }
      }

      echo error('308', 'Такого пользователя не существует');
      exit;

    }

    error('404', 'Внутренняя ошибка сервера. Не определен тип пользователя');



  }


// ====================ЗАПРОС ПО ССЫЛКЕ НА ВОСТАНОВЛЕНИЕ ПАРОЛЯ ================================



  // Востановление пароля
  if(array_key_exists('restore-finish', $_POST)){
    $post  = json_decode($_POST['restore-finish']);
    
    if(!is_dir('../../Json/restore')){ // проверяем деррикторию
      mkdir('../../Json/restore', 0777, true); // создаем дерикторию
    }

    if(file_exists('../../Json/restore/restore.json')){
      $restore_json = json_decode(file_get_contents('../../Json/restore/restore.json'));
    }else{
      error('333', 'Потерян Файл востановления пароля попробуте перезагрузить страницу выполниь востановление с начала ');
    }

    if($restore_json == NULL || !property_exists($restore_json, 'ref_restore_')){
      $restore_json = new stdClass();
      $restore_json->ref_restore_ = [];
      file_put_contents('../../Json/restore/restore.json', json_encode($restore_json,  JSON_UNESCAPED_UNICODE));
      error('332', 'Сломался файл restore.json  не правильная структура, перезагрузите страницу и повторите процедуру с начала');
    }

    $control = 0;

    for($i = 0; $i < count($restore_json->ref_restore_); $i++){



      if($restore_json->ref_restore_[$i]->uniqid == $post->uniqid){

        $control = 1;

       
        if($restore_json->ref_restore_[$i]->type == 'master'){
          $id = $restore_json->ref_restore_[$i]->id;
          $password = md5($post->password);
          mysqli_query($link, "UPDATE `master` SET `password`='$password' WHERE `id` = '$id' ");
          // include '../library/library.php';
          $restore_json->ref_restore_ = array_delete($restore_json->ref_restore_, $i);
          file_put_contents('../../Json/restore/restore.json', json_encode($restore_json,  JSON_UNESCAPED_UNICODE));
          error('OK', '');
          exit;
        }


        if($restore_json->ref_restore_[$i]->type == 'client'){
          $id = $restore_json->ref_restore_[$i]->id;
          $password = md5($post->password);
          mysqli_query($link, "UPDATE `client` SET `password`='$password' WHERE `id` = '$id' ");
          // include '../library/library.php';
          $restore_json->ref_restore_ = array_delete($restore_json->ref_restore_, $i);
          file_put_contents('../../Json/restore/restore.json', json_encode($restore_json,  JSON_UNESCAPED_UNICODE));
          error('OK', '');
          exit;
        }
      }



    }



    if($control == 1) error('401', 'Ссылка  не пернадлежин  ни одному из типов пользователя');
    if($control == 0) error('404', 'Такой ссылки не найдено');
  }





  // Регистрация клиента на сервере
  if(array_key_exists('reg-client', $_POST)){
    $post = json_decode($_POST['reg-client']);
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
      // Формируем отправку на почту
      if(!is_dir('../../Json/new-reg')){ // проверяем деррикторию
        mkdir('../../Json/new-reg', 0777, true); // создаем дерикторию
        $new = new stdClass();
        $new->newRegClient = [];
      }else{
        if(file_exists('../../Json/new-reg/registration.json')){
          $new = json_decode(file_get_contents('../../Json/new-reg/registration.json'));
        }
        if(property_exists($new, 'newRegClient')){
        // проверяем наличие в ожидаемой регистрации Клиентов
        for($n = 0; $n < count($new->newRegClient); $n++){
          if(mb_strtolower($new->newRegClient[$n]->email, 'UTF-8') == mb_strtolower($post->email, 'UTF-8')){
            $control = $n;
            break;
          }
        }
      }else{
        $new = new stdClass();
        $new->newRegClient = [];
      }
    }



      $post->uniqid = uniqid();
      if($control == -1){
        array_push($new->newRegClient, $post);
      }else{
        $new->newRegClient[$control] = $post;
      }
      file_put_contents('../../Json/new-reg/registration.json', json_encode($new, JSON_UNESCAPED_UNICODE));
      include '../library/email.php';
      sendMail($post->email,'<a href="https://service-live.ru/confirmclient'.$post->uniqid.'">Перейдите по ссылке чтобы зарегистрироваться</a>
      <br> Это автоматическое сообщение на него не нужно отвечать
      <br> С уважением Service-Life
      <br> <p> Техническая поддержка info@service-life.ru</p>
      ', "Подтверждение регистрации пользователя"
      );
    
      error('OK',
      'Подтвердите вашу регистрацию! На указаной электронной почте, пeрейдите по ссылке, письмо может храниться в спаме!');
       exit;
  }

  if(array_key_exists('confirmationclient', $_POST)){

    $uniqid = json_decode($_POST['confirmationclient'])->uniqid;

    $new = json_decode(file_get_contents('../../Json/new-reg/registration.json'));
    $control = 0;
    for($i = 0; $i < count($new->newRegClient); $i++){
      $control = 1;
      if($new->newRegClient[$i]->uniqid == $uniqid){
        $control = 2;
        $idClient  = RegistrationClient($new->newRegClient[$i]);
        if($idClient){
          $new->newRegClient = array_delete($new->newRegClient, $i);
          file_put_contents('../../Json/new-reg/registration.json', json_encode($new, JSON_UNESCAPED_UNICODE));
          setcookie('uniqid', '' , -1, '/' );
          error('OK', $idClient);
          exit;
        }
    }
  }
  if($control == 2) error('400', 'Ошибка при регистрации поробуйте еще раз');
  if($control == 1) error('401', 'Почтовый ящик не подтвержден ссылка не действительна, попробуйте еще раз');
  if($control == 0)error('404', 'Такой ссылки не существует');
    exit;
}
// ИЗМЕМНение пароля
if(array_key_exists('update-password',$_POST )){
  $post = json_decode($_POST['update-password']);
  // var_dump($post);
  if($post->type == 'master'){
    $id = $_COOKIE['id_master'];
    $autetificator_mysqli = mysqli_fetch_assoc(mysqli_query($link, " SELECT  `autetificator` FROM `master` WHERE `id`= '$id'"));
    $autetificator_master = decrypt($_COOKIE['key_secure']);
      if($autetificator_master == $autetificator_mysqli['autetificator']){
        $password = md5($post->password);
        mysqli_query($link, "UPDATE `master` SET `password`='$password' WHERE `id`= '$id'");
        error("OK", "Вы изменили пароль");
      }
    }

}


// Регистрация клиента
function RegistrationClient($post){
  include '../database.php';

  $password = md5($post->password); //хешируем пароль
  $telefone = $post->telefone;
  $autetificator =  uniqid();// создаем аунтетификатор
  $nameClient = trim($post->lastName.' '.$post->firstName);

  if(!is_dir('../../Json/client')){ // проверяем деррикторию
    mkdir('../../Json/client', 0777, true); // создаем дерикторию
  }
  //  Проверяем перед регистрацией 
  $email  = strtolower($post->email);
  $row =  mysqli_fetch_assoc(mysqli_query($link, "SELECT `name`, `password`, `email`, `telefone`, `autetificator`, `id` FROM `client` WHERE `email` = '$email' "));
  if($row){
    return false;
  }else{
    mysqli_query($link, "INSERT INTO `client` ( `name`, `password`, `email`, `telefone`, `autetificator`, `id`) VALUES ('$nameClient','$password','$post->email','$telefone','$autetificator', null)");
  }

  $result = mysqli_query($link, "SELECT * FROM `client`");
  $i = 0;
  $USER = [];

        while($USER[$i] = mysqli_fetch_assoc($result)){
          if(mb_strtolower($USER[$i]['email'], 'UTF-8') == mb_strtolower($post->email, 'UTF-8')){ // Сравниваем на существование 
            setcookie('id_client', $USER[$i]['id'],   time()+3600*24*360,'/', );
            setcookie('key_secure', encrypt($autetificator) ,  time()+3600*24*10,'/' );
            // создаем файл 
            if(!file_exists('../../Json/client/'.$USER[$i]['id'].'.json')){
              $new = new stdClass();//создаем обект клиента
              $new->name = '';
              $new->telefone = '';
              $new->base = [];
              $new->recording = [];
              $new->news = [];
              // Если потребуется тут нужно будет добавлять 
              // Если клиент регистрировался через запись 
              if(property_exists($post, 'record') ){

                $IDMaster = $post->record->IDMaster;
                $master = json_decode(file_get_contents('../../Json/master/'.$IDMaster.'.json'));
                // Проверка записи у мастера
                  if(bool_record($master->timetable, $post->record->date, $post->record->time, $post->record->interval)){// проверяем время

                    $record = new stdClass();
                    $record->date = $post->record->date;
                    $record->time = $post->record->time;
                    $record->price = $post->record->price;
                    $record->service = $post->record->service;
                    $record->interval = $post->record->interval;

                    include '../database.php';
                    // спрашиваем у базы имя и проверяем
                    $name_sql =  mysqli_fetch_assoc(mysqli_query($link, "SELECT `name` FROM `master` WHERE `id` = '$IDMaster' "));
                    $ArrName = explode(" ", $name_sql['name']);
                    if(count($ArrName) > 1){
                      $record->name = explode(" ", $name_sql['name'])[1];
                    }else{
                      $record->name =  explode(" ", $name_sql['name'])[0];
                    }

                    $record->typeMaster = $master->specialist;
                    $record->IDMaster = $IDMaster;

                    array_push($new->recording, $record);

                    //  Вносим в базу для клиента
                      $base = new stdClass();
                      $base->name = $record->name;
                      $base->IDMaster = $IDMaster;
                      $base->typeMaster = $master->specialist;
                      $base->visit = false;

                      array_push($new->base, $base);

                      // вносим запись мастеру
                      $record_master = new stdClass();
                      $record_master->name = $nameClient;
                      $record_master->date = $post->record->date;
                      $record_master->time = $post->record->time;
                      $record_master->price = $post->record->price;
                      $record_master->service = $post->record->service;
                      $record_master->interval = $post->record->interval;
                      $record_master->basketID = $post->record->basketID;
                      $record_master->note = $post->record->note;
                      $record_master->clientID =  $USER[$i]['id'];
                      $record_master->telefone =  str_replace( [')', '(', '-', ' ', '+'],"", $telefone);
                      // вНОСИМ ЗАПИСЬ 
                      for($t = 0; $t < count($master->timetable); $t++){

                        if($master->timetable[$t]->date == $record_master->date){
                          // вносим в базу мастера
                          $new_base = new stdClass();
                          $new_base->IDClient = $USER[$i]['id'];
                          $new_base->dateVisit = $record_master->date;

                          array_push( $master->base, $new_base); 
                          array_push($master->timetable[$t]->record, $record_master);

                          if($master->activity != 0){
                        
                            $master->activity++;
                          }
                          file_put_contents('../../Json/master/'.$IDMaster.'.json', json_encode($master, JSON_UNESCAPED_UNICODE));
                          
                      }
                    }

                }else{
                  array_push($new->news, news('Запись уже занята попробуйте записаться снова', 'Запись не зарегистрировалась!'));
                }
                }
              
                $new->email = '';
                $new->id = $USER[$i]['id'];
                
                file_put_contents('../../Json/client/'.$USER[$i]['id'].'.json', json_encode($new, JSON_UNESCAPED_UNICODE),  LOCK_EX);
                return $USER[$i]['id'];
              }
          }
        $i++;
      }
return false;
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

  mysqli_close($link);
?>
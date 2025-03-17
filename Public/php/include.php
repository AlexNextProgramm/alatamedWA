<?php
date_default_timezone_set('Europe/Moscow');

class Auth{



   static function inSystem($post){
      // return $post;
      
      // exit;
    $tel = trim(str_replace(['+', ' ', '(', ')', '-'], '', $post->tel));
    $SQL = mysqli_fetch_assoc(mysqli_query($GLOBALS['LINK_DB'], "SELECT  `id`, `old`, `password`, `telefone`, `name`, `autetificator`, `role`, `bool_notif`, `notification` FROM `unclude` WHERE `telefone`= '$tel' "));

    if ($SQL) {
      // проверяем роли
      $roles = explode('/', $SQL['role']);
      $contrRole = false;
      foreach ($roles as $or) {
        if ($or == $post->role) $contrRole = true;
      }

      if (!$contrRole) {
        echo 'У вас нет доступа к этому разделу';
        exit;
      }

      //   если роли схожи сверяем пароли 
      if ($contrRole &&  $SQL['password'] == md5($post->password)) {
        $id_SQL = $SQL['id'];
        //   создаем ключ
        $key = 'time/' . date('H:i:s', mktime(date('H'), date('i'), date('s'), date("m"), date("d"), date("Y"))) . '/date/' . date('Y-m-d', mktime(date('H'), date('i'), date('s'), date("m"), date("d") + 1, date("Y"))) . '/id-key/' . uniqid() . '/id_base/' . $id_SQL . '/role/' . $post->role;
        $base_key = url_encrypt($key);
        // ПРОписываем в лог вход
        $f =  fopen("log_include.txt", "a+"); //открываем файл для записи курсов в конце на новой строке
        fwrite($f,  $SQL['name'] . ': time: ' . date('H:i:s', mktime(date('H'), date('i'), date('s'), date("m"), date("d"), date("Y"))) . ' date: ' . date('Y-m-d', mktime(date('H'), date('i'), date('s'), date("m"), date("d"), date("Y"))) . ' id_base: ' . $id_SQL . ' role: ' . $post->role . "\n");
        fclose($f); // закрваем файл
        mysqli_query($GLOBALS['LINK_DB'], "UPDATE `unclude` SET `autetificator`= '$base_key' WHERE `id`= '$id_SQL' ");
        setcookie('key', url_encrypt($key), time() + 3600 * 24 * 360, '/');
        setcookie('role', $post->role, time() + 3600 * 24 * 360, '/');
        if ($SQL['bool_notif'] != 1) setcookie('notification', $SQL['notification'], time() + 3600 * 24 * 360, '/');

        if (!array_key_exists('status_refresh', $_COOKIE)) setcookie('status_refresh', '0', time() + 3600 * 24 * 360, '/');
        $otv = new stdClass();
        $otv->status = 'ok';
        $otv->text = $post->role;
        setcookie('old_user', $SQL['old'], time() + 3600 * 24 * 360, '/');
        setcookie('name_user', $SQL['name'], time() + 3600 * 24 * 360, '/');
        echo json_encode($otv);
      } else {
        echo 'Не верный пароль';
      }
    } else {
      echo  'Нет такого пользователя';
    }
   }




   static function updatePassword($post){

    // $post =  json_decode($_POST['update-form-start-password']);
    $tel = trim(str_replace(['+', ' ', '(', ')', '-'], '', $post->tel));
    $SQL = mysqli_fetch_assoc(mysqli_query($GLOBALS['LINK_DB'], "SELECT  `id`, `old`, `password`, `update_password_date`,`telefone`, `name`, `autetificator`, `role`, `count_update` FROM `unclude` WHERE `telefone`= '$tel' "));
    if ($SQL) {
      $roles = explode('/', $SQL['role']);
      $contrRole = false;
      foreach ($roles as $or) {
        if ($or == $post->role) $contrRole = true;
      }


      if (!$contrRole) {
        echo 'У вас нет доступа к этому разделу';
        exit;
      }

      if ($SQL['update_password_date'] ==  date('Y-m-d')) {
        echo 'Повторное востановление через сутки обратитесь к системному администратору';
      } else {


        $password = gen_password();
        $pas = md5($password);
        $date_update_password = date('Y-m-d');
        $count_update = $SQL['count_update'] + 1;
        mysqli_query($GLOBALS['LINK_DB'], "UPDATE `unclude` SET `update_password_date`= '$date_update_password', `password`='$pas', `old`= '0', `count_update` = '$count_update' WHERE `telefone` = '$tel'");
        $header = new stdClass();
        $header->headerType = 'TEXT';
        $header->text = 'Временный пароль';
        $responce = send_whatsapp($tel, 'Пароль для первого входа в *систему отправки быстрых сообщений*: ' . $password, $header);
       
       
        // Прописываем лог
        $f =  fopen("log_include.txt", "a+"); //открываем файл для записи курсов в конце на новой строке
        fwrite($f,  $SQL['name'] . ': time: ' . date('H:i:s', mktime(date('H'), date('i'), date('s'), date("m"), date("d"), date("Y"))) . ' date: ' . date('Y-m-d', mktime(date('H'), date('i'), date('s'), date("m"), date("d"), date("Y"))) . ' id_base: ' . $SQL['id'] . ' role: ' . $_COOKIE['role'] . 'massenge: Воccтановлени пароля' . "\n");
        fclose($f);
        if (property_exists($responce, 'requestId')) {
          echo 'ok';
        } else {
          echo 'Error send whatsApp:' . json_encode($responce);
        }
      }
    }
   }
}




function gen_password()
{
  $length = rand(6, 10);
  $password = '';
  $arr = array(
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm',
    'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M',
    'N',  'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '1', '2', '3', '4', '5', '6', '7', '8', '9',
  );

  for ($i = 0; $i < $length; $i++) {
    $password .= $arr[rand(0, count($arr) - 1)];
  }
  return $password;
}


?>
<?php
include 'database.php';
// $result = mysqli_query($link, "SELECT * FROM `user-client`");


if(array_key_exists('reg',$_POST)){
   $post = json_decode($_POST['reg']);
  if($post->type == 'Студент'){
   $result = mysqli_query($link, "SELECT * FROM `student`");
  }else{
   $result = mysqli_query($link, "SELECT * FROM `teacher`");
  }
   if(security($post, $result)){
      $password = md5($post->password);
      if($post->type == 'Студент'){
         mysqli_query($link, "INSERT INTO `student`( `id`, `name`, `password`, `telefone`, `email`) VALUES (NULL, '$post->name', '$password', '$post->telefon', '$post->email')");
         $result = mysqli_query($link, "SELECT * FROM `student`");
      }else{
         mysqli_query($link, "INSERT INTO `teacher`( `id`, `name`, `password`, `telefone`, `email`) VALUES (NULL, '$post->name', '$password', '$post->telefon', '$post->email')");
         $result = mysqli_query($link, "SELECT * FROM `teacher`");
      };
      $i=0;
      $USER = [];
      // находим id и записываем куки
      while($USER[$i] = mysqli_fetch_assoc($result)){
         if($USER[$i]['email']== $post->email){
            setcookie('id', $USER[$i]['id'],time() +3600*24*360,'/');
            setcookie('email', $USER[$i]['email'],time() +3600*24*360,'/');
            setcookie('name', $USER[$i]['name'],time() +3600*24*360,'/');
            setcookie('telefone', $USER[$i]['telefone'],time() +3600*24*360,'/');
            setcookie('type',$post->type,time() +3600*24*360,'/');
            echo 'OK';
            exit;
         }

      }
   }else{
      echo 'Такой пользователь существует';
   }
}
if(array_key_exists('avt',$_POST)){
   $post = json_decode($_POST['avt']);
   if($post->type == 'Студент'){
      $result = mysqli_query($link, "SELECT * FROM `student`");
     }else{
      $result = mysqli_query($link, "SELECT * FROM `teacher`");
     }
   
     if(!security($post, $result)){
      if($post->type == 'Студент'){
         $result = mysqli_query($link, "SELECT * FROM `student`");
        }else{
         $result = mysqli_query($link, "SELECT * FROM `teacher`");
        }
      $i=0;
      $USER = [];
      while($USER[$i] = mysqli_fetch_array($result)){
         if($USER[$i]['email']== $post->email && $USER[$i]['password']== md5($post->password)){
            setcookie('id', $USER[$i]['id'],time() +3600*24*360,'/');
            setcookie('email', $USER[$i]['email'],time() +3600*24*360,'/');
            setcookie('name', $USER[$i]['name'],time() +3600*24*360,'/');
            setcookie('telefone', $USER[$i]['telefone'],time() +3600*24*360,'/');
            setcookie('type',$post->type,time() +3600*24*360,'/');
            echo 'OK';
            exit;
         }
      }
      echo' Неверный email или password';
     }else{
      echo 'Такой пользователь не существует';
     }


}
if(array_key_exists('restore',$_POST)){
   $client = json_decode($_POST['restore']);
   $type = 'student';
   $result;
   if($client->type == 'Студент'){
      $result = mysqli_query($link, "SELECT * FROM `student`");
     }else{
      $result = mysqli_query($link, "SELECT * FROM `teacher`");
      $type = 'teacher';
     }
     if(!security($client, $result)){
       echo Return_password($client->email, GeneratePassword(), $type);
     }else{
       echo 'Такой пользователь не существует зарегистрируйтесь';
     }

}

// проверяте пользователя на существование 
function security($post, $result){
   $i=0;
   $USER = [];
   while($USER[$i] = mysqli_fetch_assoc($result)){
      if($USER[$i]['email']== $post->email){
         return false;
         exit;
      }
      $i++;
   }
 return true;
}
// Функция востановления пароля 
function Return_password($email, $NewPassword, $type){
   $USER = [];
   $i = 0;
   include 'database.php';
   $result = mysqli_query($link, "SELECT * FROM `$type`");
               while($USER[$i] = mysqli_fetch_assoc($result)){
                  if($USER[$i]['email'] == $email){
                     $id =  $USER[$i]['id'];
                     $hash =  md5($NewPassword);
                     mysqli_query($link,"UPDATE `$type` SET `password` = '$hash' WHERE `$type`.`id` = $id;");
                     client_email( $email, ' Ваш новый пароль:'.$NewPassword);
                     return 'Новый пароль сгенерирован на вашей электронной почте';
                  }
                  $i++;
               }
   return 'Такой пользователь не существует зарегистрируйтесь N';
   mysqli_close($link);
}

// Функция отправки на почту клиента
function client_email($email, $body_client){
   $body = '<h3 style ="color: red;"> '.$body_client. '</h3>';
   $to  = $email;
   $fromMail= "info@fascia-doctor.ru";
   $fromName ='академ-тест.рф';
   $date = date(DATE_RFC2822);
   $subject = '=?utf-8?b?'. base64_encode("Смена пароля на академ-тест.рф") .'?=';
   $messageId='<'.time().'-'.md5($fromMail.$to).'@'.$_SERVER['SERVER_NAME'].'>';
   $headers  = 'MIME-Version: 1.0' . "\r\n";
   $headers .= "Content-type: text/html; charset=utf-8". "\r\n";
   $headers .= "From: ". $fromName ." <". $fromMail ."> \r\n";
   $headers .= "Date: ". $date ." \r\n";
   $headers .= "Message-ID: ". $messageId ." \r\n";
   mail($to,$subject,$body,$headers);
   mail($to,$subject,$body,$headers);
}
// функция генерации пароля
function GeneratePassword(){
$randMass = ['a','b','v','c','v','x','we','tr','sa','df','rt','rt','r','q','sd','wyu','w','e','xkj','s','dfr','srt'];
$randREGISTR=['A','B','C','D','F','G','J','T','R','E','W','Z','R','O','P','N','Q','Y','X','M','U','H'];
$randSubol = ['!','@','#','$','^','?','*','№'];
$NewPass = $randMass[rand(0,21)].rand(0,100).$randREGISTR[rand(0,21)].$randSubol[rand(0,7)].rand(10,1000);
return $NewPass;
}
mysqli_close($link);

// if(array_key_exists('Author',$_POST)){
// $Post = json_decode($_POST['Author']);

// $USER = [];
// $i=0;
//           while($USER[$i] = mysqli_fetch_assoc($result)){
//              if($USER[$i]['login']==$Post->email){
//                 if( $USER[$i]['password'] == md5($Post->password)){
//                  $user_author = new stdClass();
//                  setcookie('id', $USER[$i]['id'],time() +3600*24*360,'/');
//                  setcookie('email', $USER[$i][''],time() +3600*24*360,'/');
//                  setcookie('name', $USER[$i]['name'],time() +3600*24*360,'/');
//                  setcookie('telefone', $USER[$i]['telefone'],time() +3600*24*360,'/');
//                  setcookie('email', $USER[$i]['login'],time() +3600*24*360,'/');
//                  echo 'Вы успешно авторизовались';
//                  exit;
//                 }
                
//                 echo 'Неверный пароль';
//                 exit;
//              }

//              $i++;
//           }
//           echo 'Такого пользователя не существует! Зарегистрируйтесь';
//  }


//  if(array_key_exists('Return',$_POST)){
//     $email = json_decode($_POST['Return']);
//     echo Return_password($email->email, GeneratePassword());
//  }
//  функция регистрации

//  function Registration($name_clients, $email, $telefone, $password_clients){
//       include 'database.php';
//       $result = mysqli_query($link, "SELECT * FROM `user-client`");
//       $USER = [];
//       $i=0;
//                   while($USER[$i] = mysqli_fetch_assoc($result)){
//                      if($USER[$i]['login']==$email || $USER[$i]['telefone'] == $telefone){
//                      return 'Такой пользователь существует попробуте Авторизоваться';
//                      // exit;
//                      }
//                      $i++;
//                   }
                  

//                $POSTemail = $email;
//                $POSTPassword = md5($password_clients);
//                $POSTtel = $telefone;
//                $POSTSurname = $name_clients;
//                My_mail($POSTemail,$POSTtel,$POSTSurname);
//                client_email($email, 'Ваш новый пароль:'.$password_clients);
//                mysqli_query($link, "INSERT INTO `user-client`( `id`, `login`, `password`, `telefone`, `name`) VALUES (NULL, '$POSTemail', '$POSTPassword', '$POSTtel', '$POSTSurname')");
//                $result = mysqli_query($link, "SELECT * FROM `user-client`");
//                 while($USER[$i] = mysqli_fetch_assoc($result)){
//                     if($USER[$i]['login']== $email || $USER[$i]['telefone'] == $telefone){
//                         setcookie('id', $USER[$i]['id'],time() +3600*24*360,'/');
//                         setcookie('name', $USER[$i]['name'],time() +3600*24*360,'/');
//                         setcookie('telefone', $USER[$i]['telefone'],time() +3600*24*360,'/');
//                         setcookie('login', $USER[$i]['login'],time() +3600*24*360,'/');
//                         $id =  (int)$USER[$i]['id'];
//                         sample_overwrite($id,$name_clients,$telefone);
//                            return $id;
//                     }else{
//                         $error = 'Не прошла регистрация';
//                     }
//                     $i++;
//                  }
               
               
//                 mysqli_close($link);
              
//                 return $error;
               
//  }

//  функция отправки на мою почту

//  function My_mail( $POSTemail,$POSTtel, $POSTSurname){
//    $body = '<h3 style ="color: red;">'.$POSTemail.'<br>'.$POSTtel.' <br>'.$POSTSurname.'</h3>';
//    $to  = "info@fascia-doctor.ru";
//    $fromMail= "info@fascia-doctor.ru";
//    $fromName ='fascia-doctor.ru';
//    $date = date(DATE_RFC2822);
//    $subject = '=?utf-8?b?'. base64_encode("Регистрация-Основная") .'?=';
//    $messageId='<'.time().'-'.md5($fromMail.$to).'@'.$_SERVER['SERVER_NAME'].'>';
//    $headers  = 'MIME-Version: 1.0' . "\r\n";
//    $headers .= "Content-type: text/html; charset=utf-8". "\r\n";
//    $headers .= "From: ". $fromName ." <". $fromMail ."> \r\n";
//    $headers .= "Date: ". $date ." \r\n";
//    $headers .= "Message-ID: ". $messageId ." \r\n";
//    // mail($to,$subject,$body,$headers);
//  }


// функция изменения в шаблоне при регистрации 
// function sample_overwrite($id,$name_clients,$telefone){

//    // проверяем шаблоны и вписываем в шаблон зарегистрированного пациента
//    $samlple_base = json_decode(file_get_contents('../Json/sample_base_clients.json'));
//     for($i = 0; $i < count($samlple_base ->sample_client); $i++){
//       if($samlple_base ->sample_client[$i]->telefone == $telefone){
//         $samlple_base->sample_client[$i] -> name = $name_clients;
//         $samlple_base->sample_client[$i] -> id = $id;
//         file_put_contents('../Json/sample_base_clients.json', json_encode($samlple_base,  JSON_UNESCAPED_UNICODE));
//       }
//     }

// }

?>
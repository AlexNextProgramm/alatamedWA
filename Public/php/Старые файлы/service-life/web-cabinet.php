<?php
include '../library/error.php';
include '../library/library.php';
include '../library/date-time.php';
include '../database.php';
include 'online.php';
// include 'page_master_for_client.php';
date_default_timezone_set('Europe/Moscow'); // Time zone по умолчанию
if(array_key_exists('get-web', $_POST)){
       $id = json_decode($_POST['get-web']);
      //  тут надо написать проверку по ключу
      if(!file_exists('../../Json/master/'.$id.'.json')){
        echo error('150', 'Нет Json файла кабинета');
        exit;
      }
      $mast_json = json_decode(file_get_contents('../../Json/master/'.$id.'.json'));

      // include '../database.php';
      $master_base = mysqli_fetch_assoc(mysqli_query($link, "SELECT * FROM `master` WHERE `id`= '$id'"));
      if(!$master_base){
        error('404', 'Нет такого мастера в базе');
        exit;
      }
      if($mast_json->online == false){
        include 'online.php';
        online($id, $mast_json);
      }
      $mast_json->name = $master_base['name'];
      $sumbol = [')', '(', '-', ' ', '+'];
      $mast_json->telefone = str_replace($sumbol,"", $master_base['telefone']);
      $mast_json->id = $id;
       error('OK', $mast_json);
}



// Редактирование 

if(array_key_exists('new-avatar', $_FILES)){
  if(!is_dir('../../images/avatar')){
    mkdir('../../images/avatar', 0777, true);
  }
   
   $mast_json = json_decode(file_get_contents('../../Json/master/'.$_POST['post'].'.json'));
   online($mast_json->id, $mast_json);
   if($mast_json->avatar != './images/avatar/no-avatar.png'){
    if(file_exists('../.'.$mast_json->avatar)) unlink('../.'.$mast_json->avatar);
   }
   $Path = './images/avatar/'.uniqid().'_'.$_FILES['new-avatar']['name'];
   $mast_json->avatar = $Path;
    puts($mast_json, $_POST['post']);
    activity_card($mast_json, $_POST['post']);
    move_uploaded_file($_FILES['new-avatar']['tmp_name'],'../.'. $Path);
    echo $Path; // возвращаем путь к дериктории
}

// ИЗМЕНЕНИЕ БАЗОВЫХ ДАННЫХ О МАСТЕРЕ 
if(array_key_exists('base-data', $_POST)){
    $id = $_COOKIE['id_master'];
    $post = json_decode($_POST['base-data']);
    $mast_json = json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
    online($mast_json->id, $mast_json);
    foreach($mast_json as $key => $value){
      if(property_exists($post, $key)){
        if($mast_json->{$key} != $post->{$key}){
          $mast_json->{$key} = $post->{$key};
        }
      }
    }

    
    //  Прописываем адресс
    foreach($mast_json->address as $key => $value){
      if(property_exists($post, $key)){
        if($mast_json->address->{$key} != $post->{$key}){
          $mast_json->address->{$key} = lowercase_first_letter($post->{$key});

          if($key == 'city'){

            $options = json_decode(file_get_contents('../../Json/options1.json')); // достаем опции
            $city = lowercase_first_letter($post->{$key}); // приводим слово в порядок 

            if(!in_array($city, $options->city) && $city != '' && $city != null ){

              array_push($options->city, $city);
              array_multisort($options->city, SORT_STRING); // сортируем
              file_put_contents('../../Json/options1.json', json_encode($options, JSON_UNESCAPED_UNICODE)); //записываем в опции

            }


          }
        }
      }
    }

    $telefone = mysqli_fetch_assoc(mysqli_query($link, "SELECT `telefone` FROM `master` WHERE `id`= '$id'"));
    $name = mysqli_fetch_assoc(mysqli_query($link, "SELECT `name` FROM `master` WHERE `id`= '$id'"));
    $telefone = str_replace([')', '(', '-', ' ', '+'],"", $telefone);
    $tel_new = str_replace([')', '(', '-', ' ', '+'],"", $post->telefon);
    $new_names = trim($post->names);


    if($telefone != $tel_new) mysqli_query($link, "UPDATE `master` SET `telefone`= '$post->telefon'  WHERE `id`= '$id'");

    if($name != $new_names) mysqli_query($link, "UPDATE `master` SET `name`= '$new_names'  WHERE `id`= '$id'");
    $mast_json = activity_card($mast_json, $id);
    puts($mast_json, $id);
    echo error('OK', 'Вы изменили данные');
}




if(array_key_exists('update-time', $_POST)){
 $post = json_decode($_POST['update-time']);
 $id = $_COOKIE['id_master'];
 $mast_json = json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
 online($id, $mast_json);
    if(property_exists($post, "interval")){
        for($i = 0; $i < count($mast_json->timetable); $i++){
          if($mast_json->timetable[$i]->date == $post->date){
            $mast_json->timetable[$i]->step = $post->interval;
          }
        }
      }

    if(property_exists($post, "break")){
      for($i = 0; $i < count($mast_json->timetable); $i++){
        if($mast_json->timetable[$i]->date == $post->date){
          $mast_json->timetable[$i]->break = $post->break;
        }
      }
    }

      if(property_exists($post, "work_end")){
        for($i = 0; $i < count($mast_json->timetable); $i++){
          if($mast_json->timetable[$i]->date == $post->date){
            $mast_json->timetable[$i]->end = $post->work_end;
          }
        }
      }

      if(property_exists($post, "work_start")){
        for($i = 0; $i < count($mast_json->timetable); $i++){
          if($mast_json->timetable[$i]->date == $post->date){
            $mast_json->timetable[$i]->start = $post->work_start;
          }
        }
      };

      if(property_exists($post, "new_pause")){
        for($i = 0; $i < count($mast_json->timetable); $i++){
          if($mast_json->timetable[$i]->date == $post->date){
            array_push($mast_json->timetable[$i]->pause, $post->new_pause);
            error("timetable",  $mast_json->timetable[$i]);
          }
        }
      };
      if(property_exists($post, "delete_pause")){
        for($i = 0; $i < count($mast_json->timetable); $i++){
          if($mast_json->timetable[$i]->date == $post->date){
           $mast_json->timetable[$i]->pause = array_delete($mast_json->timetable[$i]->pause, $post->delete_pause);
           error("timetable",  $mast_json->timetable[$i]);
          }
        }
      };

      foreach($post as $key => $value){
        $strKey = explode('_', $key);
        if(count($strKey) == 3){
          $index = intval($strKey[2]);
          if($strKey[1] == 'start'){
            for($i = 0; $i < count($mast_json->timetable); $i++){
                  if($mast_json->timetable[$i]->date == $post->date){
                    $mast_json->timetable[$i]->pause[$index]->start = $value;
                    error("timetable",  $mast_json->timetable[$i]);
                  }
                }
          }
          if($strKey[1] == 'end'){
            for($i = 0; $i < count($mast_json->timetable); $i++){
              if($mast_json->timetable[$i]->date == $post->date){
                $mast_json->timetable[$i]->pause[$index]->end = $value;
                error("timetable",  $mast_json->timetable[$i]);
              }
            }
          }
        }
      }
     

      // if(property_exists($post, "pause_end")){
      //     for($i = 0; $i < count($mast_json->timetable); $i++){
      //       if($mast_json->timetable[$i]->date == $post->date){
      //         $mast_json->timetable[$i]->pause->end = $post->pause_end;
      //       }
      //     }
      //   }

puts($mast_json, $id);

}




if(array_key_exists('service', $_POST)){
  $post = json_decode($_POST['service']);
  $id = $_COOKIE['id_master'];
  $mast_json = json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
  online($id, $mast_json);

  if(property_exists($post, 'delete')){
    for($i = 0; $i < count($mast_json->service);$i++){
      if($mast_json->service[$i]->id == $post->id){
        $mast_json->service = array_delete($mast_json->service, $i);
        puts($mast_json, $id);
        echo error('OK', 'Вы удалили услугу '.$post->name);
        exit;
      }
    }
  }
  
  if(property_exists($post, 'id')){
    for($i = 0; $i < count($mast_json->service);$i++){
      if($mast_json->service[$i]->id == $post->id){
        foreach($post as $key => $value){
          if($value != ''){
            $mast_json->service[$i]->{$key} = $value;
          }
        }
        puts($mast_json, $id);
        echo error('OK', 'Изменили услугу '.$post->name);
        exit;
      }
    }
  }


  if(!property_exists($post, 'id') && !property_exists($post, 'delete')){
    $post->id = strval(uniqid());
    array_push($mast_json->service, $post );
    $mast_json = activity_card($mast_json);
    puts($mast_json, $id);
    echo error('OK', 'Вы добавили новую услугу '.$post->name);
        exit;
  }
}

if(array_key_exists('new-file-portfolio', $_FILES)){
  $id = $_COOKIE['id_master'];
  if(!is_dir('../../images/portfolio')){
    mkdir('../../images/portfolio', 0777, true);
  }
  $mast_json = json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
  online($id, $mast_json);
   $Path = './images/portfolio/'.uniqid().'_'.$_FILES['new-file-portfolio']['name'];
   $Path = './images/portfolio/'.uniqid().'_'.$_FILES['new-file-portfolio']['name'];
   array_push($mast_json->portfolio, $Path);
    puts($mast_json, $id);
   $mast_json = activity_card($mast_json, $id);
   
    move_uploaded_file($_FILES['new-file-portfolio']['tmp_name'],'../.'. $Path);
    echo $Path; // возвращаем путь к дериктории
}

 


if(array_key_exists('open-day', $_POST)){
  $post = json_decode($_POST['open-day']);
  $id = $_COOKIE['id_master'];
  $mast_json = json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
  online($id, $mast_json);
  $control = false;
  for($i = 0; $i < count($mast_json->timetable); $i++){
    if($mast_json->timetable[$i]->date == $post->date){
      $control = true;
    }
  }
  if($control){
    echo error('99', 'Дата существует');
    exit;
  }
  array_push($mast_json->timetable, $post);
  puts($mast_json, $id);
  echo error('OK', 'Добавлен новый рабочий день');
}



if(array_key_exists('close-day', $_POST)){
  $date = $_POST['close-day'];
  $id = $_COOKIE['id_master'];
  $mast_json = json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
  online($id, $mast_json);
  for($i = 0; $i < count($mast_json->timetable); $i++){
    if($mast_json->timetable[$i]->date == $date ){
      if(count($mast_json->timetable[$i]->record) > 0 ){
        // Тут проверка не посещенных записей
        echo error('99'," Существуют записи в этом дне");
        exit;
      }
      $mast_json->timetable = array_delete($mast_json->timetable, $i);
    }
  }
  puts($mast_json, $id);
  echo error('OK', strFormatDate($date). " удален рабочий день");
}





if(array_key_exists('delete-my-otvet', $_POST)){
  $post  = json_decode($_POST['delete-my-otvet']);
  $id = $_COOKIE['id_master'];
  $mast_json = json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
  for($i = 0; $i < count($mast_json->review); $i++ ){
    if($mast_json->review[$i]->id == $post->id){
      $obj = $mast_json->review[$i];
      $mast_json->review[$i]= new stdClass();
      $mast_json->review[$i]->date = $obj->date;
      $mast_json->review[$i]->like = $obj->like;
      $mast_json->review[$i]->messange = $obj->messange;
      $mast_json->review[$i]->id = $post->id;
      if(property_exists( $obj, 'IDClient')){
        $mast_json->review[$i]->IDClient = $obj->IDClient;
      }
    }}
    puts($mast_json, $id);
    echo error("OK", "Ваш ответ удален");
  }


  if(array_key_exists('my-otvet', $_POST)){
    $post  = json_decode($_POST['my-otvet']);
    $id = $_COOKIE['id_master'];
    $mast_json = json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
    online($id, $mast_json);
    for($i = 0; $i < count($mast_json->review); $i++ ){
      if($mast_json->review[$i]->id == $post->id){
        $mast_json->review[$i]->comment = new stdClass();
        $mast_json->review[$i]->comment -> date =  $post->date;
        $mast_json->review[$i]->comment  -> messange = $post->messange;
      }
    }
    puts($mast_json, $id);
    echo error("OK", "Ваш ответ на комментарий успешно добавлен");
  }

  // Ответ на отзыв мастер
$my_otvet = function($post, $master, $id, $name){
  for($i = 0; $i < count($master->review); $i++ ){
    if($master->review[$i]->id == $post->id){
      $master->review[$i]->comment = new stdClass();
      $master->review[$i]->comment -> date =  $post->date;
      $master->review[$i]->comment  -> messange = $post->messange;
      $client = json_decode(file_get_contents('../../Json/client/'.$master->review[$i]->IDClient.'.json'));
      array_push($client->news, news($post->messange, $name.'Оставил вам ответ на отзыв'));
      file_put_contents('../../Json/client/'.$master->review[$i]->IDClient.'.json', json_encode($client, JSON_UNESCAPED_UNICODE), LOCK_EX);
    }
  }
};


  
  $about = function($responce, $master){
    $master->about = $responce->about;
    echo error("OK", "Вы добавили о себе");
    $master = activity_card($master);
    return $master;
  };




  // Удаление записи
$delete_record = function($post, $master){
 $control = false;
 for($i = 0; $i < count($master->timetable); $i++){


  if($master->timetable[$i]->date == $post->date){


    for($t = 0; $t < count($master->timetable[$i]->record); $t++){
      if($master->timetable[$i]->record[$t]->time == $post->time){


         // Проверяем запись у клиента если клиент авторизован и отправляем ему сообщение об удалении
         //           // записи
        if(property_exists($master->timetable[$i]->record[$t], 'clientID')){
          $clientID = $master->timetable[$i]->record[$t]->clientID;
          $client = json_decode(file_get_contents('../../Json/client/'.$clientID.'.json'));


          for($cl = 0; $cl < count($client->recording); $cl++){

            if($client->recording[$cl]->date ==  $post->date && $client->recording[$cl]->time == $post->time){
              $news = new stdClass(); // создаем объект сообщения для клиента об удалении
              $news->date = date("Y-m-d"); 
              $news->time = date("H:i:s");
              $news->header = "Удаление записи";
              $news->id = uniqid();
              $news->messange = $master->specialist.' удалил вашу запись за '.strFormatDate($post->date).' '.format_milliseconds_two($client->recording[$cl]->time);
              $client->recording = array_delete($client->recording, $cl);
              array_push($client->news, $news);
              file_put_contents('../../Json/client/'.$clientID.'.json', json_encode($client, JSON_UNESCAPED_UNICODE), LOCK_EX);
            }

          }


        }

        // Удаляем запись у мастера
        $master->timetable[$i]->record = array_delete($master->timetable[$i]->record, $t);
        $control = true;
      }



    }
  }
 }

//  ответ от сервера об выполненни
 if($control){
    echo error('OK', 'Вы удалили клиента из записи');
  }else{
    echo error('99', 'Не удалось удалить!');
  }
   return $master;
};


$clear_about = function($responce, $master){
    $master->about = "";
    error("OK", "Очищено");
  return $master;
  };

function activity_card($card){
  if( $card->activity == 0){
  if( $card->address->street != '' &&
      $card->address->house != '' &&
      $card->experience != 0 &&
      $card->about != ''&&
      count($card->portfolio) != 0 &&
      count($card->service) != 0 &&
      count($card->timetable) != 0 &&
      $card->avatar != './images/avatar/no-avatar.png'){
          $card->activity = 1;
      }
    }
      return $card;
}

 $delete_img_portfolio = function($post, $master){
    if(file_exists('../.'.$post->path)){
      unlink('../.'.$post->path);
    }
    for($i = 0; $i < count($master->portfolio); $i++){
      if($master->portfolio[$i] == $post->path){
        $master->portfolio = array_delete($master->portfolio, $i);
      }
    }
    error('OK', 'Фото удалено');
    return $master;
 };


//  Удаление Уведомлений
$delete_notice = function($post, $master){

  for($n = 0; $n < count($master->news); $n++){
      if($n == intval($post->count)){
          $master->news = array_delete($master->news, $n);
          error('OK', '');
          return $master;
      }
  }
};



// Получить базу клиентов
$get_base_client = function($post, $master){
 $Arr = [];
 include '../database.php';
    for($b = 0; $b < count($master->base); $b++){
     
      if(property_exists($master->base[$b], 'IDClient') ){
       
        $base = new stdClass();
        // echo $base->name;
        $id = $master->base[$b]->IDClient;
        $sql = mysqli_fetch_assoc(mysqli_query($link, "SELECT `name`, `telefone` FROM `client` WHERE `id`= '$id'"));
        if($sql){
        if(!property_exists($master->base[$b], 'name')){
          $base->name = $sql['name'];
        }else{
          $base->name = $master->base[$b]->name;
        }
        
        $base->telefone = trim(str_replace([')', '(', '-', ' ', '+'],"", $sql['telefone']));
        // $std = $master->base[$b];
        // property_exists($base, 'name')
        $base->dateVisit = $master->base[$b]->dateVisit;
        array_push($Arr,$base);
      }else{
        // если нет в базе 
        array_push($Arr, $master->base[$b]);
      }
      }else{
        array_push($Arr, $master->base[$b]);
      }
    }
if(count($Arr) > 2){
    usort( $Arr ,function($ob1, $ob2){
      if($ob1->dateVisit == $ob2->dateVisit) return 0;
      return (DateInsecond($ob1->dateVisit) > DateInsecond($ob2->dateVisit)) ? -1 : 1;}
 );
}
 error('OK', $Arr);
  return false;
};

// НЕ МОЖЕТ СПРАШИВАТЬСЯ ЧЕЕЗ COOKIE
if(array_key_exists('close-online', $_POST)){
  $post = json_decode($_POST['close-online']);
  closeOnline($post->IDMaster, false);
  error("OK", "");
}

$redact_base_client = function($post, $master){
  // print_r($post);
  for($b = 0; $b < count($master->base); $b++){
    if($b == $post->count){
       $master->base[$b]->{'name'} = $post->name;
       for($t = 0; $t < count($master->timetable); $t++){
        for($r = 0; $r < count($master->timetable[$t]->record); $r++){
          if(property_exists($master->base[$b], "IDClient") && property_exists($master->timetable[$t]->record[$r], 'clientID')){
            if($master->timetable[$t]->record[$r]->clientID == $master->base[$b]->IDClient){
              $master->timetable[$t]->record[$r]->name = $post->name;
            }
          }
          if(!property_exists($master->base[$b], "IDClient") && property_exists($master->base[$b], "telefone")){
            if(trim($master->timetable[$t]->record[$r]->telefone) == trim($master->base[$b]->telefone)){
              $master->timetable[$t]->record[$r]->name = $post->name;
            }
          }
        }
       }
       error("OK", "");
      return $master;
    }
  }
};
$delete_base_client = function($post, $master){
  // print_r($post);
  for($b = 0; $b < count($master->base); $b++){
    if($b == $post->count){
       $master->base = array_delete($master->base, $b);
       error("OK", "");
      return $master;
    }
  }
};

POST_JSON_MASTER('new-about', $about);
POST_JSON_MASTER('clear-about', $clear_about);
POST_JSON_MASTER('delete-record', $delete_record);
POST_JSON_MASTER('delete-img-portfolio', $delete_img_portfolio);
POST_JSON_MASTER('delete-notice', $delete_notice);
POST_JSON_MASTER('my-otvet', $my_otvet);
POST_JSON_MASTER('get-base-client', $get_base_client);
POST_JSON_MASTER('redact-base-client', $redact_base_client);
POST_JSON_MASTER('delete-base-client', $delete_base_client);

function puts($mast, $id){
  file_put_contents('../../Json/master/'.$id.'.json', json_encode($mast, JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function POST_JSON_MASTER($name, $next){
  if(array_key_exists($name, $_POST)){
      $responce = json_decode($_POST[$name]);
      $id = $_COOKIE['id_master'];
      $master = json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
      online($id, $master);
      include '../database.php';
      $sql = mysqli_fetch_assoc(mysqli_query($link, "SELECT `name`, `telefone` FROM `master` WHERE `id`= '$id'"));
      $telefone = str_replace([')', '(', '-', ' ', '+'],"", $sql['telefone']);
      $master = $next($responce, $master, $id, $sql['name'], $telefone);

      if(gettype($master) == 'object'){
        $master = activity_card($master);
        $master->name = '';
        $master->telefone = '';
        // $master->email = '';
      file_put_contents('../../Json/master/'.$id.'.json', json_encode($master, JSON_UNESCAPED_UNICODE), LOCK_EX);
      };
  }
}

?>
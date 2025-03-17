<?php

include '../library/error.php';
include '../library/library.php';
include '../database.php';
include '../library/date-time.php';
date_default_timezone_set('Europe/Moscow'); // Time zone по умолчанию
$get = function($responce, $client, $id, $name, $telefone, $email){
    $client->name = $name;
    $client->email = $email;
    $client->telefone = $telefone;
    // Формирование базы мастеров для клиента 
    $control = false;
    if(count($client->base) != 0){
        for($b = 0; $b < count($client->base); $b++){
            if($client->base[$b]->visit == false){
                for($r = 0; $r < count($client->recording); $r++){
                    // тут надо подумать чтобы можно было оставить отзыв сразу после записи
                   
                    if(DateInsecond($client->recording[$r]->date, format_milliseconds($client->recording[$r]->time + $client->recording[$r]->interval)) <= mktime( date('H'), date('i'), 0, date("m")  , date("d"), date("Y"))){
                        if($client->recording[$r]->IDMaster == $client->base[$b]->IDMaster){
                            $id = $client->base[$b]->IDMaster;
                            // include '../database.php';
                            // $sql = mysqli_fetch_assoc(mysqli_query($link, "SELECT `name`, `telefone`, `name`, `email` FROM `master` WHERE `id`= '$id'"));
                            // $client->base[$b]->telefone
                        $client->base[$b]->visit = true;
                        $control = true;
                     }
                    }
                }
            }
        }
    }
     error('OK', $client);
    if($control) return $client;
    return false;
};


// Отмена записи клиентом
$cancel_record = function($post, $client, $idClient, $nameClient){
    $control = false;
 for($t=0; $t < count($client->recording); $t++){

    if($client->recording[$t]->date == $post->date && $client->recording[$t]->time == $post->time ){
        $id = $post->IDMaster;
        $master = json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
        for($i=0; $i < count($master->timetable);$i++){
            if($master->timetable[$i]->date == $post->date){
                for($r = 0; $r < count($master->timetable[$i]->record); $r++){

                    if($master->timetable[$i]->record[$r]->time == $post->time ){
                        $news = new stdClass(); // создаем объект сообщения для Мастера об удалении
                        $news->date = date("Y-m-d"); 
                        $news->time = date("H:i:s");
                        $news->header = "Отмена записи клиентом";
                        $news->id = uniqid();
                        $news->messange = $nameClient.' отменил вашу запись за '.strFormatDate($post->date).' '.format_milliseconds_two($post->time);
                        $master->timetable[$i]->record = array_delete($master->timetable[$i]->record, $r);
                        array_push($master->news, $news);
                        file_put_contents('../../Json/master/'.$id.'.json', json_encode($master, JSON_UNESCAPED_UNICODE), LOCK_EX);
                    }

                }
            }
        }
        $control = true;
        $client->recording = array_delete($client->recording, $t);

    }
 }
 if($control){
    error('OK', 'Запись отменена на '.strFormatDate($post->date));
 }else{
    error('300', 'Не удалось отменить запись');
 }

    return $client;
};


$review = function($post, $clinet, $idClient, $name){
    $id = $post->IDMaster;
    $master = json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
    $review_new = new stdClass();
    $review_new->name = $name;
    $review_new->date = date("Y-m-d");
    $review_new->messange = $post->body->messange;
    $review_new->IDClient = $idClient;
    $review_new->id = count($master->review);
    
    $Like = 0;
    $countLike = count($master->review);
    if($countLike != 0){
    for($r = 0; $r < $countLike; $r++){
        $Like = $Like + intval($master->review[$r]->like);
    }
    }
    $Like = $Like + intval($post->body->like);

    $countLike++;
    $master->like = strval(round($Like/$countLike, 1));
    $review_new->like = strval($post->body->like);
    array_push($master->review, $review_new);
    array_push($master->news, news('У вас новый отзыв вы можете ответить на него!'));
    file_put_contents('../../Json/master/'.$id.'.json', json_encode($master, JSON_UNESCAPED_UNICODE), LOCK_EX);
    error('OK', 'Вы добавили отзыв '.$master->specialist, 'Отзыв');
    return false;
};

$delete_review = function($post){
    $id = $post->IDMaster;
    $master = json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
    $master->review = array_delete($master->review, intval($post->body->count));
    $Like = 0;
    $countLike = count($master->review);
    if($countLike != 0){
    for($r = 0; $r < $countLike; $r++){
            $Like = $Like + intval($master->review[$r]->like);
    }
    }
    if($countLike == 0){
        $master->like = strval($Like);
    }else{
        $master->like = strval(round($Like/$countLike, 1));
    }
    file_put_contents('../../Json/master/'.$id.'.json', json_encode($master, JSON_UNESCAPED_UNICODE), LOCK_EX);
    error('OK', 'Вы удалили отзыв');
    return false;
};

$redact_review = function($post){
    $id = $post->IDMaster;
    $master = json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
    $master->review[$post->body->count]->messange = $post->body->messange;
    $master->review[$post->body->count]->like = strval($post->body->like);
    $Like = 0;
    $countLike = count($master->review);
    if($countLike != 0){
    for($r = 0; $r < $countLike; $r++){
        if($r != $post->body->count){
            $Like = $Like + intval($master->review[$r]->like);
        }
    }
    }
    $Like = $Like + intval($post->body->like);
    $master->like = strval(round($Like/$countLike, 1));
    file_put_contents('../../Json/master/'.$id.'.json', json_encode($master, JSON_UNESCAPED_UNICODE), LOCK_EX);
    error('OK', 'Вы изменили отзыв');
    return false;
};


$delete_base = function($post, $client){
    
 for($b = 0 ; $b < count($client->base); $b++){
    if($client->base[$b]->IDMaster == $post->IDMaster){
        $client->base = array_delete($client->base, $b);
        error("OK", "Вы удалили из базы мастера");
        return $client;
        exit;
    }
 }
 error("300", "Не найдено мастера в базе перезагрузите страницу");
 return false;
};

$get_setting = function($post, $client, $id, $name, $telefone, $email ){
 $setting  = new stdClass();
 $setting->telefone = $telefone;
 $setting->email = $email;
 $setting->name = $name;
 error("OK", $setting);
};
// $get_base = function($post){
    
//     return false;
// };

// Удалить Уведомление
$delete_notice = function($post, $client){

    for( $n = 0; $n < count($client->news); $n++){
        if($n == intval($post->count)){
            $client->news = array_delete($client->news, $n);
            error('OK', '');
            return $client;
        }
    }
};


// Изменить настройки данных
if(array_key_exists('set-setting', $_POST)){
    $id = $_COOKIE['id_client'];
    $post = json_decode($_POST[$name]);
    mysqli_query($link, "UPDATE `client` SET `name`= '$post->name', `telefone`='$post->tel' WHERE `id`= '$id'");
}


POST_JSON_CLIENT('get-web', $get);
POST_JSON_CLIENT('get-setting', $get_setting);

POST_JSON_CLIENT('cancel-record', $cancel_record);
POST_JSON_CLIENT('review', $review);
POST_JSON_CLIENT('delete-review', $delete_review);
POST_JSON_CLIENT('redact-review', $redact_review);
POST_JSON_CLIENT('delete-base', $delete_base);
POST_JSON_CLIENT('delete-notice', $delete_notice);
// POST_JSON_CLIENT('get-base', $get_base);
// функции
function POST_JSON_CLIENT($name, $next){
    if(array_key_exists($name, $_POST)){
        $responce = json_decode($_POST[$name]);
        $id = $_COOKIE['id_client'];
        if(!file_exists('../../Json/client/'.$id.'.json')){
            error('150', 'Нет Json файла кабинета');
            exit;
          }
        $client = json_decode(file_get_contents('../../Json/client/'.$id.'.json'));
        include '../database.php';
        $sql = mysqli_fetch_assoc(mysqli_query($link, "SELECT `name`, `telefone`, `email` FROM `client` WHERE `id`= '$id'"));
        $telefone = str_replace([')', '(', '-', ' ', '+'],"", $sql['telefone']);
        $client = $next($responce, $client, $id, $sql['name'], $telefone, $sql['email']);
        // var_dump(gettype($client) == 'object');
        if(gettype($client) == 'object'){
            $client->name = '';
            $client->telefone = '';
            $client->email = '';
            file_put_contents('../../Json/client/'.$id.'.json', json_encode($client, JSON_UNESCAPED_UNICODE), LOCK_EX);
        };
        
    }
  }
?>
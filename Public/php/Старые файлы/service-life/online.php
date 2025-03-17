<?php
date_default_timezone_set('Europe/Moscow');

function online($id, $master = false){
if(!$master){
    $master =  json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
}
$online = new stdClass();
if(file_exists('../../Json/online.json')){
    $online = json_decode(file_get_contents('../../Json/online.json'));
}
$online->{$id} = time() + 60;
$master->online = true;
// print_r($master);
file_put_contents('../../Json/online.json', json_encode($online, JSON_UNESCAPED_UNICODE), LOCK_EX);
file_put_contents('../../Json/master/'.$id.'.json', json_encode($master, JSON_UNESCAPED_UNICODE), LOCK_EX);
}


function closeOnline($id, $master){
    if(!$master){
        
        $master =  json_decode(file_get_contents('../../Json/master/'.$id.'.json'));
    }
    $online = json_decode(file_get_contents('../../Json/online.json'));
   
    if(property_exists($online, $master->id)){
        unset($online->{$id});
        file_put_contents('../../Json/online.json', json_encode($online, JSON_UNESCAPED_UNICODE), LOCK_EX);
    }
    $master->online = false;
    file_put_contents('../../Json/master/'.$id.'.json', json_encode($master, JSON_UNESCAPED_UNICODE), LOCK_EX);
}
?>
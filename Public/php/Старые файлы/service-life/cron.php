<?php
if(file_exists('../../Json/online.json')){
$online = json_decode(file_get_contents('../../Json/online.json'));
if($online && $online != new stdClass()){
    foreach($online as $key => $value){
        if($value < time()){
                if(file_exists('../../Json/master/'.$key.'.json')){
                    include 'online.php';
                    closeOnline($key, false);
                }else{
                    if(property_exists($online, $key)){
                        unset($online->{$key});
                        file_put_contents('../../Json/online.json', json_encode($online, JSON_UNESCAPED_UNICODE), LOCK_EX);
                    }
                }
        }
    }
}
}



?>
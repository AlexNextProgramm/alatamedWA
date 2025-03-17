<?php 

if(array_key_exists('new-visit', $_POST)){
   $setting = get();
       $setting -> statistic ->{'new-visit'} += 1;
       setcookie('old_', 'yes',time() +3600*24*360,'/');
      put($setting);

}
if(array_key_exists('time_setting', $_POST)){
    $setting = get();
    $time_new = json_decode($_POST['time_setting']);
    if(is_object($time_new)){
        $setting ->setting_time = new stdClass();
        $setting ->setting_time->start = $time_new->start;
        $setting ->setting_time->end = $time_new->end;
        $setting ->setting_time->interval = $time_new->interval;
    }
    put($setting);
}



// Получение и запись файла
function get(){
    return json_decode(file_get_contents('../Json/setting_web.json'));
}
function put($setting){
    file_put_contents('../Json/setting_web.json', json_encode($setting,  JSON_UNESCAPED_UNICODE));

}
?>
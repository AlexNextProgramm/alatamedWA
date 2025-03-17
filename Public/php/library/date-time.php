<?php

//функция форматируте 2023-10-11 в 11.10.2023
function strFormatDate($stringDate){
$dateArr = explode('-',$stringDate);
return $dateArr[2].'.'.$dateArr[1].'.'.$dateArr[0];
};

// преобразует мс 45846000 в 12:44:00
function format_milliseconds($ms){
    $H = explode('.',strval($ms / (1000 * 60* 60)))[0];
    $M = strval(round($ms / (1000 * 60) - (intval($H)*60)));
    if(intval($M) < 10) $M = '0'.$M;
    if(intval($H) < 10) $H = '0'.$H;
    if(intval($M) == 0) $M = '00';
    if(intval($H) == 0) $H = '00';
    return $H.':'.$M.':00';
}

// преобразует мс 45846000 в 12:44
function format_milliseconds_two($ms){
    $H = explode('.',strval($ms / (1000 * 60* 60)))[0];
    $M = strval(round($ms / (1000 * 60) - (intval($H)*60)));
    if(intval($M) < 10) $M = '0'.$M;
    if(intval($H) < 10) $H = '0'.$H;
    if(intval($M) == 0) $M = '00';
    if(intval($H) == 0) $H = '00';
    return $H.':'.$M;
}

// преобразует Unix 2023-10-11 && в сек 1717177171
function DateInsecond($stringDate, $stringTime = '00:00:00'){
    date_default_timezone_set('Europe/Moscow');
    $explode = explode('-', $stringDate);
    $Y = intval($explode[0]);
    $M = intval($explode[1]);
    $D = intval($explode[2]);
    $explodeTime = explode(':', $stringTime);
    $h = intval($explodeTime[0]);
    $m = intval($explodeTime[1]);
    $s = intval($explodeTime[2]);
    return mktime($h,$m,$s, $M, $D, $Y);
}
// '00:01:00' преобразует в мс 60000

 function TimeMS($stringTime = '00:00:00'){
    $explodeTime = explode(':', $stringTime);
    $h = intval($explodeTime[0]);
    $m = intval($explodeTime[1]);
    $s = intval($explodeTime[2]);
    return mktime($h + 1, $m,$s, 1, 1, 1970) * 1000;
 }

//  $master = json_decode(file_get_contents('../../Json/master/26.json'));


//   var_dump(TimeMS("09:10:00"));

//  bool_record($master->timetable, "2023-12-03", TimeMS('09:01:00'), TimeMS('00:03:00'))



?>
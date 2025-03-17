<?php

function array_delete($array, $key){
 $AR = [];
 if(count($array) == 1) return $AR;
 for($i = 0; $i < count($array); $i++){
    if($i != $key) array_push($AR, $array[$i]);
 }
 return $AR;
}
// Проиводит к первого слова в строке в верхний регистр
function lowercase_first_letter($str){
   $Array = explode(" ", $str);
   $first = mb_convert_case($Array[0], MB_CASE_TITLE_SIMPLE , "UTF-8");
   foreach($Array as $key => $value){
      if($key != 0){
         $first = $first.' '.mb_strtolower($value, 'UTF-8');
      }
   }
   return $first;
}


function obj_key_delete($Object, $key){
   $Obj = new stdClass();
   foreach($Object as $keys => $value){
      if( $keys != $key ){
         $Obj->{$keys} = $value;
      }
   }
   return $Obj;
}
?>
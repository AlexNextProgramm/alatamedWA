<?php

if(array_key_exists('IMAGE', $_FILES )){
    if(!is_dir('../images')){
        mkdir('../images', 0777, true);
      }

      $Path = 'images/IMAGE-SAMPLE/'.uniqid().'_'.$_FILES['IMAGE']['name'];
      move_uploaded_file($_FILES['IMAGE']['tmp_name'],'../'.$Path);
      echo $Path;
}
// echo 'ok' ;



if(error_get_last()){
    $Arr =  error_get_last(); // получаем массив ошбки
    $f =  fopen("log_error.txt", "a+"); //открываем файл для записи курсов в конце на новой строке
    // вписывам когда  в каком файле на какой строке и что произошло 
    fwrite($f, '>>> TIME: '.date('d.m.Y H:i:s').' FILE: '.$Arr['file']." LINE: ".$Arr['line'].' ERROR: '.$Arr['message']."\n");
    fclose($f); // закрваем файл
  }
?>
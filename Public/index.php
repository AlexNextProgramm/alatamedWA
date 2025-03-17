<?php
include './php/securyti.php';

if($SECURYTI){
  if(array_key_exists('old', $_GET) && $_GET['old'] == '0' && $SQL['old'] == 0){
     header('Location: ./page/'.$_COOKIE['role'].'.php?old=0');
     }else{
     header('Location: ./page/'.$_COOKIE['role'].'.php');
    }
}else{

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="shortcut icon" type="image/png" href="./images/favicon.ico">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
    <title>Altamed WhatsApp</title>
<script defer="defer" src="./JS/index8b759436954c71c1359a.js"></script><link href="./CSS/index8b759436954c71c1359a.css" rel="stylesheet"></head>
    <body>
    </body>
</html>

<?php } 
if(error_get_last()){
  $Arr =  error_get_last(); // получаем массив ошбки
  $f =  fopen("./php/log_error.txt", "a+"); //открываем файл для записи курсов в конце на новой строке
  // вписывам когда  в каком файле на какой строке и что произошло 
  fwrite($f, '>>> TIME: '.date('d.m.Y H:i:s').' FILE: '.$Arr['file']." LINE: ".$Arr['line'].' ERROR: '.$Arr['message']."\n");
  fclose($f); // закрваем файл
}

?>
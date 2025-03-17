<?php
include_once('./../php/securyti.php');
if ($SECURYTI) {
?>
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/png" href="./../images/favicon.ico">
    <script src="https://cdn.jsdelivr.net/gh/linways/table-to-excel@v1.0.4/dist/tableToExcel.js"></script>
    <title>Altamed WhatsApp</title>
  </head>

  <body>
  </body>

  </html>
<?php } else {
  header('Location: ./../index.php');
}


if (error_get_last()) {
  $Arr =  error_get_last(); // получаем массив ошбки
  $f =  fopen("./../php/log_error.txt", "a+"); //открываем файл для записи курсов в конце на новой строке
  // вписывам когда  в каком файле на какой строке и что произошло 
  fwrite($f, '>>> TIME: ' . date('d.m.Y H:i:s') . ' FILE: ' . $Arr['file'] . " LINE: " . $Arr['line'] . ' ERROR: ' . $Arr['message'] . "\n");
  fclose($f); // закрваем файл
}

?>
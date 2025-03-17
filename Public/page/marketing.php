<?php
include_once('./../php/securyti.php');
if ($SECURYTI) {
?>
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="shortcut icon" type="image/png" href="./../images/favicon.ico">
    <script src="https://cdn.jsdelivr.net/gh/linways/table-to-excel@v1.0.4/dist/tableToExcel.js"></script>
    <title>Altamed WhatsApp</title>
  <script defer="defer" src=".././JS/marketing8b759436954c71c1359a.js"></script><link href=".././CSS/marketing8b759436954c71c1359a.css" rel="stylesheet"></head>

  <body>
  </body>

  </html>
<?php } else {
  header('Location: ./../index.php');
}


?>
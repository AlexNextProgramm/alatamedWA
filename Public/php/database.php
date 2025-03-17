<?php
$server = "localhost";
$log  = "root";
$password = "";
$name = "whatsapp unclude";
$link = mysqli_connect($server,$log,$password,$name);

$LINK_DB = $link;


if ($link == false){
    echo "Соединение не установлено";
}



?>
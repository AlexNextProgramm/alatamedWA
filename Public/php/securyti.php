<?php
date_default_timezone_set('Europe/Moscow');

$SECURYTI = false;
$SQL = false;
$ROLE = '';
$id_base = '';

if(array_key_exists('key', $_COOKIE)){
        include_once('crypt.php');
        include_once('database.php');
        $key = [];
         if(url_decrypt($_COOKIE['key'])) $key  = explode('/', url_decrypt($_COOKIE['key']));
          if(count($key) == 10){
              $id_base = $key[7];
              $ROLE = $key[9];
              $SQL = mysqli_fetch_assoc(mysqli_query($link, "SELECT  `id`, `password`, `telefone`, `old`,`name`, `autetificator`, `role`, `bool_notif`, `notification` FROM `unclude` WHERE `id`= '$id_base' "));
              $key_sql =  explode('/', url_decrypt($SQL['autetificator']));
              $dat = explode('-',$key_sql[3]);
              $time = explode(':', $key_sql[1]);

              if(mktime(0, 0, 0, date('m'), date('d'), date('Y')) < mktime(0, 0, 0, $dat[1], $dat[2], $dat[0]) && $key_sql[5] == $key[5]){
                $SECURYTI = true;
                if($SQL['bool_notif'] != 1) setcookie('notification', $SQL['notification'] ,time() +3600*24*360,'/');
                if(file_exists('../Json/news.json')){
                  $countNews = 0;
                  $newsFile = json_decode(file_get_contents("../Json/news.json"));
                  foreach($newsFile->news as $key=>$Nvalue){
                    if(!in_array( $SQL['id'], $Nvalue->user)) $countNews++;
                  }
                  setcookie('news_count', $countNews , time() + 3600 * 24 * 360, '/');
                }
                setcookie('id_user', $SQL['id'], time() + 3600 * 24 * 360, '/');
            }
            
          }
}

?>

<?php
$samlple_base = json_decode(file_get_contents('../Json/sample_base_clients.json'));
$responce = false;
if(array_key_exists('new_sample', $_POST)){
    $post = json_decode( $_POST['new_sample']);
   
   array_push($samlple_base->sample_client, $post);
  }

file_put_contents('../Json/sample_base_clients.json', json_encode($samlple_base,  JSON_UNESCAPED_UNICODE));
?>
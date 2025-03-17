<?php
function error($number, $text){
    $post = new stdClass();
    $post->status = $number;
    $post->text = $text;
    echo json_encode($post);
}

function news($messange, $header = null){
    $News = new stdClass();
    $News->date = date('Y-m-d');
    $News->messange = $messange;
    $News->id = uniqid();
    if($header != null) $News->header = $header;
    $News->time = date('H:i:s');
    return $News;
  }
?>
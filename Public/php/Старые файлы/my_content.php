<?php
if(file_exists('../Json/content_about_my.json')){
    $Paper = json_decode(file_get_contents('../Json/content_about_my.json'));
}else{
    $Paper = new stdClass();
    $Paper -> content = [];
}
 
// Добавление блока
if(array_key_exists('Добавить', $_POST)){
    $new_post = json_decode($_POST['Добавить']);
    if(is_object($new_post)){
        $new_post->id = uniqid();
       array_push( $Paper->content, $new_post);
    }
}
// изменение блока
if(array_key_exists('Изменить', $_POST)){
 $new_post = json_decode($_POST['Изменить']);
 if(is_object($new_post)){
    for($i = 0;$i < count($Paper->content); $i++){
        if($Paper->content[$i]->id == $new_post->id){
            foreach($Paper->content[$i] as $key => $value){
                if($Paper->content[$i]->{$key} != $new_post->{$key}){
                    if($key == 'file'){
                        $Path = '.'.$Paper->content[$i]->file;
                        if($Path!='.' && $Path != '..' && is_readable($Path)){
                            print_r(is_readable($Path));
                            unlink($Path);
                        }
                    }
                    $Paper->content[$i]->{$key} = $new_post->{$key};
                }
            }
        }
    }
 }
}
// Удаление блока 
if(array_key_exists('delete', $_POST)){
    include 'library/library.php';
  $id = $_POST['delete'];
  for($i = 0;$i < count($Paper->content); $i++){

    if($Paper->content[$i]->id == $id){
        $Path = '.'.$Paper->content[$i]->file;

         if($Path!='.' && $Path != '..' && is_readable($Path)){
            unlink($Path);
         }
         $Paper->content = array_delete($Paper->content, $i);
    }
  }
//   $Paper->content = array($array);
}
file_put_contents('../Json/content_about_my.json', json_encode($Paper,  JSON_UNESCAPED_UNICODE));
?>
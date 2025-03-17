<?php

if(array_key_exists('files', $_FILES)){

    if(!is_dir('../'.$_POST['URL'])){ // проверяем деррикторию
        mkdir('../'.$_POST['URL'], 0777, true); // создаем дерикторию
    }
    $Path = './'.$_POST['URL'].'/'.uniqid().'_'.$_FILES['files']['name'];
echo $Path; // возвращаем путь к дериктории
move_uploaded_file($_FILES['files']['tmp_name'],'.'. $Path);
}




?>
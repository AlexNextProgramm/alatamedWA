<?php
 include '../database.php';
if(!is_dir('../../Json/master')){ // проверяем деррикторию
    mkdir('../../Json/master', 0777, true); // создаем дерикторию
}
$cards = []; // создаем массив
foreach (glob('../../Json/master/*.json') as $filename) {
    if(file_exists($filename)){
      array_push($cards, json_decode(file_get_contents($filename)));
    }
}

// сортируем обекты по активности в сети
 usort($cards,function($ob1, $ob2){
                     if($ob1->activity == $ob2->activity) return 0;
                     return ($ob1->activity > $ob2->activity) ? -1 : 1;}
                );


if(array_key_exists('get-card', $_POST)){
    $source = json_decode($_POST['get-card']);
    $mastrs = [];
    for($i = 0; $i < count($cards); $i++ ){
        if($cards[$i]->activity != '' && $cards[$i]->activity != null && $cards[$i]->activity != '0' && $cards[$i]->activity != 0){
        if($source ->city == $cards[$i]->address->city && 
           $source ->specialist ==  $cards[$i]->specialist ){
            $id = $cards[$i]->id;
            $name_sql = mysqli_fetch_assoc(mysqli_query($link, "SELECT `name` FROM `master` WHERE `id`= '$id'"));
            $cards[$i]->name = $name_sql['name'];
            if(count($mastrs) == $source->amount){
                echo json_encode($mastrs);
                exit;
            }
                array_push($mastrs, $cards[$i]);
            }
        }
    }
    if(count($mastrs) == 0){
        for($i=0; $i < count($cards); $i++ ){
            $ArrAbaut = explode(' ',  $cards[$i]->about);
            $ArrSource = explode(' ', $source ->specialist );
            if(sooorce(explode(' ',  $cards[$i]->about), explode(' ', $source ->specialist ))){
                if($source ->city == $cards[$i]->address->city){
                    if($cards[$i]->activity != '' && $cards[$i]->activity != null && $cards[$i]->activity != '0' && $cards[$i]->activity != 0){
                        $id = $cards[$i]->id;
                        $name_sql = mysqli_fetch_assoc(mysqli_query($link, "SELECT `name` FROM `master` WHERE `id`= '$id'"));
                        $cards[$i]->name =  $name_sql['name'];
                        array_push($mastrs, $cards[$i]);
                    }
                }
            }
        }
    }
    echo json_encode($mastrs);
}

function sooorce($ArrAbaut, $ArrSource){
    foreach($ArrAbaut as $valA){
        foreach($ArrSource as $valS){
        //    echo mb_strtoupper($valA).' '.mb_strtoupper($valS)."\n";
            if(mb_strtoupper($valA) == mb_strtoupper($valS) ){
                return true;
                break;
            }
        }
    }
    return false;

}

if(array_key_exists('top-cards', $_POST)){
    $top = $_POST['top-cards'];
    $mastrs = [];
    for($i = 0; $i < count($cards); $i++){
        if($i <= $top){
            if($cards[$i]->activity != '' && $cards[$i]->activity != null && $cards[$i]->activity != '0' && $cards[$i]->activity > 0){
               
                $id = $cards[$i]->id;
                 $name_sql = mysqli_fetch_assoc(mysqli_query($link, "SELECT `name` FROM `master` WHERE `id`= '$id'"));
                 $cards[$i]->name = $name_sql['name'];
                array_push($mastrs, $cards[$i]);
            }
        }
    }
    echo json_encode($mastrs);
}








// function put_file($card){
    // file_put_contents('../../Json/master.json', json_encode($card,  JSON_UNESCAPED_UNICODE));
// }
?>
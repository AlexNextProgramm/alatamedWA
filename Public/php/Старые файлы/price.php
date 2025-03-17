<?php
 
 if(file_exists('../Json/price.json')){
    $price = json_decode((file_get_contents('../Json/price.json')));
}else{
    $price = new stdClass();
}
if(array_key_exists('like',$_POST)){
    $id =  $_POST['like'];
    while ($name = current($price)) {
       for($i=0; $i < count($price ->{key($price)}); $i++){
            if($price->{key($price)}[$i]->{'id'} == $id){
                $price->{key($price)}[$i]->{'like'}++;
            }
       }
        next($price);
    }

}
if(array_key_exists('new-service',$_POST)){
    $rasdel_admin = json_decode($_POST['new-service']);
    $rasdel_admin ->like = 1;
    $rasdel_admin ->id = uniqid();
//  print_r($_POST['new-service']);
    if(property_exists($price, $rasdel_admin->chapter)){
         array_push($price->{$rasdel_admin->chapter}, $rasdel_admin);
    }else{
        $price->{$rasdel_admin->chapter} = [$rasdel_admin]; 
    }
    foreach($price as $key => $rasdel){
            if($key == $rasdel_admin){
            }
    }
}
if(array_key_exists('redact-service',$_POST)){
    $rasdel_admin = json_decode($_POST['redact-service']);
    if(!property_exists( $rasdel_admin, 'imgURL')){
     $rasdel_admin->imgURL = null;
    }
    foreach($price->{$rasdel_admin ->chapter} as $key => $service){
        if($service->id == $rasdel_admin->id){
        //    разбираемся с картинками потом все остальное
        print_r($rasdel_admin->imgURL);

        if($service->imgURL != $rasdel_admin->imgURL || $rasdel_admin->imgURL == null){
            $Path = '.'.$service->imgURL;
            if($Path!='.' && $Path != '..' && is_readable($Path)){
                unlink($Path);
            }
        }
        
        foreach($rasdel_admin as $header => $n){
           $price->{$rasdel_admin->chapter}[$key]->{$header} = $n;
        }
        }
    }
    echo 'изменения приняты';

}

if(array_key_exists('delete-service',$_POST)){
    include 'library/library.php';
    $new  = new stdClass($price);
    $id = json_decode($_POST['delete-service'])->id;
     foreach($price as $key => $value){
       for($i = 0; $i < count($price->{$key}) ;$i++){
           if(property_exists($price->{$key}[$i], 'imgURL')){
               if($price->{$key}[$i]->id == $id){
                   $Path = '.'.$price->{$key}[$i]->imgURL;
                   if($Path!='.' && $Path != '..' && is_readable($Path)){
                       unlink($Path);
                   }
           }

            $new->{$key} = array_delete($price->{$key}, $i);

            if( count($new->{$key}) == 0){
              
               $new =  obj_key_delete($price, $key);
            }
        }
       }
     }
 
     $price = $new;
    echo 'Удалено';
}

file_put_contents('../Json/price.json', json_encode($price,  JSON_UNESCAPED_UNICODE));
?>
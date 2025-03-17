<?php

class Sample{
    
    static function getSample($post){
         echo file_get_contents('../Json/sample.json');
     }
    static function getVariable(){
         echo file_get_contents('../Json/variable.json');
     }
    static function contants(){
         echo file_get_contents('../Json/constants.json');
     }
    static function setContants($post){
        file_put_contents('../Json/constants.json',$post);
     }



     static function getSampleVariable(){
    
         $send = new stdClass();
         $send->sample =json_decode(file_get_contents('../Json/sample.json'));
         $send->variable = json_decode(file_get_contents('../Json/variable.json'));
         $send->constns = json_decode(file_get_contents('../Json/constants.json'));
         echo json_encode($send);
     
     }

    static function setVariableNew($post){
         $vaiable =  json_decode(file_get_contents('../Json/variable.json'));
         $post->html_input = json_decode($post->html_input);
         if($post->id == '-1'){
             $post->id = uniqid();
             array_push($vaiable->variable, $post);
             echo $post->id;
         }else{
             // // **Редактирование переменных
             // $sample = json_decode(file_get_contents('../Json/sample.json'));
             for($v= 0 ; $v < count($vaiable->variable); $v++){
                 if($post->id == $vaiable->variable[$v]->id){
                     $vaiable->variable[$v] = $post;
                     echo $vaiable->variable[$v]->id;
                 }
             }
         }
         file_put_contents('../Json/variable.json', json_encode($vaiable,  JSON_UNESCAPED_UNICODE));
     }

     // ! Удаление переменной 
    static function DeleleVariable($post){
         $vaiable =  json_decode(file_get_contents('../Json/variable.json'));
         $post = json_decode($_POST['variable-del']);
         $ArSample = [];
         $sample = json_decode(file_get_contents('../Json/sample.json'));
     
     
         for($s = 0; $s < count($sample->buttons); $s++){
             if(strripos($sample->buttons[$s]->{"massenge-sample"}, "{{".$post->nameInput."}}")){
                 array_push($ArSample, $sample->buttons[$s]->name);
             }
         }
     
         if(count($ArSample) == 0){
             for($i = 0; $i < count($vaiable->variable); $i++){
                 if($post->id == $vaiable->variable[$i]->id){
                     $vaiable->variable = array_delete($vaiable->variable, $i);
                 }
             }
             file_put_contents('../Json/variable.json', json_encode($vaiable,  JSON_UNESCAPED_UNICODE));
         }else{
             echo json_encode($ArSample);
         }
     }

     static function set($post){
         $sample = json_decode(file_get_contents('../Json/sample.json'));
        
         if($post->id == '0'){
             $post->id = uniqid();
             array_push($sample->buttons, $post);
             // echo $post->id;
         }else{
             for($i = 0; $i < count($sample->buttons); $i++){
                 if($sample->buttons[$i]->id == $post->id){
                             $sample->buttons[$i] = $post;
                      }
                 }
             }
         
         file_put_contents('../Json/sample.json', json_encode($sample,  JSON_UNESCAPED_UNICODE));
     }

    static function del($post){

        $sample = json_decode(file_get_contents('../Json/sample.json'));
        for ($i = 0; $i < count($sample->buttons); $i++) {
            if ($sample->buttons[$i]->id == $_POST['del']) {
                $sample->buttons = array_delete($sample->buttons, $i);
            }
        }

        file_put_contents('../Json/sample.json', json_encode($sample,  JSON_UNESCAPED_UNICODE));

    }

    static function images($files){
        if(!is_dir('../images/IMAGE-SAMPLE')){
            mkdir('../images/IMAGE-SAMPLE', 0777, true);
          }
       
          $Path = 'images/IMAGE-SAMPLE/'.uniqid().'_'.$files['name'];
          move_uploaded_file($files['tmp_name'],'../'.$Path);
          echo $Path;

    }
 }


?>
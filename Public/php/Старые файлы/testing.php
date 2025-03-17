<?php
if(!is_dir('../Json')){ // проверяем деррикторию
    mkdir('../Json', 0777, true); // создаем дерикторию
}
if(file_exists('../Json/testing.json')){
    $test = json_decode(file_get_contents('../Json/testing.json'));
}else{
    $test = new stdClass();
    $test -> test = [];
}


// запись нового теста
if(array_key_exists('new-test', $_POST)){
 $testing  = json_decode($_POST['new-test']);
 $testing ->indetifier = uniqid();
 array_push($test->test, $testing );
 echo $testing ->indetifier;
 put_file($test);
}
// заполнение таблицы преподователя
if(array_key_exists('table-teacher', $_POST)){
    $id = $_POST['table-teacher'];
    $teacher = [];
  if(count($test->test) == 0){
    echo false;
  }else{
for($i = 0; $i < count($test->test); $i++){
    if($test->test[$i]->teacher->id == $id){
     array_push($teacher,$test->test[$i]);
    }
   
   }
   echo json_encode($teacher);
   
  }
}


// удаление теста
if(array_key_exists('del-test', $_POST)){
  $id = $_POST['del-test'];
  
  for($i = 0; $i < count($test->test); $i++){
    if($test->test[$i]->indetifier == $id){
      include './library/library.php';
     $test->test = array_delete($test->test, $i);
      echo 'OK';
      put_file($test);
      exit;
    }
  }
}
// Оставляем след что студент начал тест
if(array_key_exists('student-trail', $_POST)){
   $send_ts = json_decode($_POST['student-trail']);
   for($i = 0; $i < count($test->test); $i++){
      if($test->test[$i]->indetifier == $send_ts->indetifier){
        array_push($test->test[$i]->student, $send_ts->student);
      }
    }
    put_file($test);
}

// получить тест без ответов для студента
if(array_key_exists('new-test-student', $_POST)){
  // for($i = 0; $i < count($test->test); $i++){
  //   if()
  // }

$id = $_POST['new-test-student'];
$student_test = [];
$attempt = 0;
for($i = 0; $i < count($test->test); $i++){
  if($test->test[$i]->indetifier == $id){
    // Считаем количество попыток
    for($c = 0; $c < count($test->test[$i]->student); $c++){
      if($test->test[$i]->student[$c]->id == $_COOKIE['id']){
        $attempt++;
      }
    }
 if($test->test[$i]->option->attempt <= $attempt){
  echo 'Превышено количество попыток';
  exit;
 }



    // print_r($test->test[$i]->testing);
    $student_test = $test->test[$i]->testing;
    for($v = 0; $v < count($student_test); $v++){
      $cont = 0;
      for($o = 0; $o < count($student_test[$v]->answer); $o++){
        if($student_test[$v]->answer[$o]->reside){ $cont++;}
        $student_test[$v]->answer[$o]->reside = false;
      }
      if($cont > 1 ){
        $student_test[$v]->control = true;
      }else{
        $student_test[$v]->control = false;
      }
    }
    echo json_encode($student_test);
    exit;
  }
}
if(count($student_test) == 0){
  echo 'Такой тест не существует, под таким кодом. Введите другой код теста';
}
}


// Проверка теста от студента 
if(array_key_exists('test-verification', $_POST)){
$verriTest = json_decode($_POST['test-verification']);
$errors_student = 0;

$ArrNewer = [];
$option = false;
for($i = 0; $i < count($test->test); $i++){
  if($test->test[$i]->indetifier == $verriTest->indetifier){


     for($t = 0; $t < count($test->test[$i]->testing); $t++){
      for($s = 0; $s < count($verriTest->testing); $s++){

        if($test->test[$i]->testing[$t]->id == $verriTest->testing[$s]->id){
          
          $nevern = 0;
          for($a = 0; $a < count($test->test[$i]->testing[$t]->answer); $a++){
            for($as = 0; $as < count($verriTest->testing[$s]->answer); $as++){
              if($test->test[$i]->testing[$t]->answer[$a]->variant == $verriTest->testing[$s]->answer[$as]->variant){
                if($test->test[$i]->testing[$t]->answer[$a]->reside != $verriTest->testing[$s]->answer[$as]->reside ){
                  $nevern++;
            
                }
              }
            }
          }
           
              if($nevern > 0){
                $errors_student++;
                $resul_st = new stdClass();
                if($test->test[$i]->option->question == true && $test->test[$i]->option->answer == false ){
                 array_push($ArrNewer,$test->test[$i]->testing[$t]->question);
                 $option = true;
                }
                if($test->test[$i]->option->question == true && $test->test[$i]->option->answer == true){
                  $resul_st->variant = [];
                  for($p = 0; $p < count($test->test[$i]->testing[$t]->answer); $p++){
                    if($test->test[$i]->testing[$t]->answer[$p]->reside == true){
                   array_push($resul_st->variant, $test->test[$i]->testing[$t]->answer[$p]->variant);
                    }
                  }
                  $resul_st->loyal = [];
                  for($ss = 0; $ss < count($verriTest->testing[$s]->answer); $ss++){
                    if($verriTest->testing[$s]->answer[$ss]->reside == true){
                      array_push($resul_st->loyal, $verriTest->testing[$s]->answer[$ss]->variant);
                    }
                  }
                  $resul_st->question = $test->test[$i]->testing[$t]->question;
                  array_push($ArrNewer,$resul_st);
                  $option = true;
                }
              }
             
           
          }

        }

      }
      // тут сохранем результат
      $verriTest->student->result = (count($verriTest->testing) - $errors_student).'/'.count($verriTest->testing);
      for($st = 0; $st < count($test->test[$i]->student); $st++){
        if($test->test[$i]->student[$st]->date_time == $verriTest->student->date_time && $test->test[$i]->student[$st]->id == $verriTest->student->id){
          $test->test[$i]->student[$st] = $verriTest->student;
        }
      }
      put_file($test);
    }
  }
  // Если есть опции
  if($option){
    $res = new stdClass();
    $res ->ar = $ArrNewer;
    $res->result =  $verriTest->student->result;
    echo json_encode($res);
  }else{
    echo $verriTest->student->result;
  }

}

if(array_key_exists('table-st-test', $_POST)){
  $id  = $_POST['table-st-test'];
  $Array = [];
 
  for($i = 0; $i < count($test->test); $i++){
    $n = 0;
    for($st = count($test->test[$i]->student) - 1; $st >= 0; $st--){
      if($test->test[$i]->student[$st]->id == $id && $n == 0){
        $stClass = new stdClass();
        $stClass ->indetifier = $test->test[$i]->indetifier;
        $stClass ->result = $test->test[$i]->student[$st]->result;
        $stClass->date_time = $test->test[$i]->student[$st]->date_time;
        $stClass->speed = $test->test[$i]->student[$st]->speed;
        $n = 1;
       array_push($Array, $stClass);
      }
    }
  }
  if(count($Array) > 0){
    echo json_encode($Array);
  }else{
    echo 'нет пройденых тестов';
  }
}



function put_file($test){
    file_put_contents('../Json/testing.json', json_encode($test,  JSON_UNESCAPED_UNICODE));
}
?>
<?php
include_once('database.php');

$CLINIC = [
    '117'=>'Альтамед+ на Союзной',
    '118'=>'Альтамед+ на Комсомольской',
    '119'=>'Альтамед+ на Неделина',
    '120'=>'Альтамед+ Дубки'
];

if(array_key_exists('get-table', $_POST)){
    
    $post = json_decode($_POST['get-table']);
    $BASE = [];

    if(property_exists($post, 'famyli')){

        $resultBase = mysqli_query($link, "SELECT * FROM `nalog` ");

        while ($row = mysqli_fetch_assoc($resultBase)) {
            $pos = strripos(mb_strtolower($row['name']), mb_strtolower($post->famyli));

            if($pos === false){

                $pos = strripos(mb_strtolower($row['nameNalog']), mb_strtolower($post->famyli));

                if ($pos !== false) array_push($BASE, $row);
            }else{

                array_push($BASE, $row);
            }

        }


        echo json_encode($BASE);
        exit;
    }

    $stDate = explode('.', $post->st);
    $enDate = explode('.', $post->en);
    $stDate =  mktime(0, 0, 0, $stDate[1], $stDate[0], $stDate[2]);
    $enDate =  mktime(0, 0, 0, $enDate[1], $enDate[0], $enDate[2]);

    // Если есть номер заявки
    if(property_exists($post, 'bid')){
        $resultBase = mysqli_query($link, "SELECT * FROM `nalog` WHERE `id` = '$post->bid'");
        while ($row = mysqli_fetch_assoc($resultBase)) {array_push($BASE, $row);}
        echo json_encode($BASE);
        exit;
    }

    // Если есть номер телефона
    if(property_exists($post, 'telefon')) {
        $post->telefon = str_replace([" ", "-", "+", "(", ")"], "", $post->telefon);
        $resultBase = mysqli_query($link, "SELECT * FROM `nalog` WHERE `telefon` = '$post->telefon'");
        while ($row = mysqli_fetch_assoc($resultBase)) { array_push($BASE, $row) ;}
        echo json_encode($BASE);
        exit;
    }

    // Показать все не закрытые
    if (property_exists($post, 'position')) {
        $resultBase = mysqli_query($link, "SELECT * FROM `nalog` WHERE  `status` = '0'");
        while ($row = mysqli_fetch_assoc($resultBase)) {
            array_push($BASE, $row);
        }
        echo json_encode($BASE);
        exit;
    }
    
    // Показать все не выданные
    if (property_exists($post, 'nevidan')) {
        $resultBase = mysqli_query($link, "SELECT * FROM `nalog` WHERE  `status` = '1'");
        while ($row = mysqli_fetch_assoc($resultBase)) {
            array_push($BASE, $row);
        }
        echo json_encode($BASE);
        exit;
    }

    $resultBase = mysqli_query($link, "SELECT * FROM `nalog`");
    $i = 0;

    while ($row = mysqli_fetch_assoc($resultBase)) {

        $Date = explode('-', explode(' ', $row['date'])[0]);
        $Date =  mktime(0, 0, 0, $Date[1], $Date[2], $Date[0]);

        if ($stDate <= $Date && $Date <= $enDate) {
            array_push($BASE, $row);
        }
        
        
    }

    echo json_encode($BASE);
    // delete_file_admin();
}



if (array_key_exists('set-hire', $_POST)) {
   $post = json_decode($_POST['set-hire']);
   $res = mysqli_fetch_assoc(mysqli_query($link, "SELECT  `clinic` FROM `nalog` WHERE `id` = '$post->bid'"));
   $cl = json_decode($res['clinic']);
   $cl->{$post->clinic}->status = 1;
   $cl->{$post->clinic}->adminID = $post->adminID;
   $cl->{$post->clinic}->adminName = $post->adminName;
   $cl = json_encode($cl, JSON_UNESCAPED_UNICODE);
   mysqli_query($link, "UPDATE `nalog` SET `clinic` = '$cl' WHERE `id` ='$post->bid'");
}

if (array_key_exists('set-file', $_POST)) {
    $post = json_decode($_POST['set-file']);
    $res = mysqli_fetch_assoc(mysqli_query($link, "SELECT  `clinic` FROM `nalog` WHERE `id` = '$post->bid'"));
    $cl = json_decode($res['clinic']);
    if(property_exists($cl->{$post->clinic}, 'file')){
        foreach($post->file as $fil){
            array_push($cl->{$post->clinic}->file, $fil);
        }
    }else{
        $cl->{$post->clinic}->file = $post->file;
    }
    $cl = json_encode($cl, JSON_UNESCAPED_UNICODE);
    mysqli_query($link, "UPDATE `nalog` SET `clinic` = '$cl' WHERE `id` ='$post->bid'");
}


if (array_key_exists('file', $_FILES)) {
    if (!is_dir('../document/')) mkdir('../document/', 0777, true);
    $Path = 'document/' . uniqid() . '_' . str_replace(" ", "_", $_FILES['file']['name']);
    move_uploaded_file($_FILES['file']['tmp_name'], '../' . $Path);
    echo $Path;
}


if (array_key_exists('close-hire', $_POST)) {
    $post = json_decode($_POST['close-hire']);
    $res = mysqli_fetch_assoc(mysqli_query($link, "SELECT `clinic` FROM `nalog` WHERE `id` = '$post->bid'"));
    $cl = json_decode($res['clinic']);
    $cl->{$post->clinic}->status = 2;

    if(globalStatus($post->bid, $cl)){
        $i = 0;
        foreach($cl as $vl){$i++;}
        echo strval($i);
       
    }

    $cl = json_encode($cl, JSON_UNESCAPED_UNICODE);
    mysqli_query($link, "UPDATE `nalog` SET `clinic` = '$cl' WHERE `id` ='$post->bid'");
     // пишем функцию проверки всех статусов и отправка на почту 
    
}


if (array_key_exists('return-status', $_POST)) {

    $post = json_decode($_POST['return-status']);
    $res = mysqli_fetch_assoc(mysqli_query($link, "SELECT  `clinic` FROM `nalog` WHERE `id` = '$post->bid'"));
    $cl = json_decode($res['clinic']);

    $cl->{$post->clinic}->status = 0;
    $cl->{$post->clinic}->adminID = null;
    $cl->{$post->clinic}->adminName = null;

    
    $cld = json_encode($cl, JSON_UNESCAPED_UNICODE);
    
    mysqli_query($link, "UPDATE `nalog` SET `clinic` = '$cld' WHERE `id`='$post->bid'");
    globalStatusReturn($post->bid, $cl);
    
}

if(array_key_exists('wa-status', $_POST)){
    $post = json_decode($_POST['wa-status']);
    mysqli_query($link, "UPDATE `nalog` SET `send_wa` = '1' WHERE `id`='$post->bid'");
}





use setasign\Fpdi\Fpdi;

if (array_key_exists('print-all-files', $_POST)) {

    $post = json_decode($_POST['print-all-files']);
    $res = mysqli_fetch_assoc(mysqli_query($link, "SELECT * FROM `nalog` WHERE `id` = '$post->bid'"));
    $cl = json_decode($res['clinic']);
    $CLINICL = json_decode('{"Альтамед+ на Неделина":"./licenses/odinmedplus.pdf","Альтамед+ на Союзной":"./licenses/Altamed.pdf","Альтамед+ на Комсомольской":"./licenses/odinmed.pdf","Альтамед+ Дубки":"./licenses/dubki.pdf","Альтамед+ Верхне-Пролетарская":"./licenses/Altamed.pdf" }');
    
    require_once('./libpdf/fpdf.php');
    require_once('./libpdf/vendor/setasign/fpdi/src/autoload.php');
    include_once('./library/tFPDF/sample.php');
    function marge($files, $pathOut, $dublePrint = false)
    {
        $error = '';
        $pdf = new FPDI();

        foreach ($files as $file) {
            $pageCount = $pdf->setSourceFile($file);
            if (gettype($pageCount) == 'array') {
                $error = $pageCount;
                continue;
            } else {

            for ($i = 0; $i < $pageCount; $i++) {
                $tpl = $pdf->importPage($i + 1, '/MediaBox');
                $pdf->addPage();
                $pdf->useTemplate($tpl);
            }

            if($dublePrint && $pageCount % 2 != 0 ){
                $pdf->setSourceFile('./licenses/1.pdf');
                $tpl = $pdf->importPage(1, '/MediaBox');
                $pdf->addPage();
                $pdf->useTemplate($tpl);
            }
        }
        }
        $pdf->Output('F', $pathOut);
         return $error;
        
    }


    
   
    $ALL_PATCH_FILES_PDF = [];
    $ALL_PATCH_FILES_OTHER = [];

    if ($res['RELATION_DEGREE'] == 139) $rod = false;
    else $rod = true;
    
    foreach($cl as $clinic => $v){
        
        $filename = sample(
            $res['nameNalog'],
            $res['email'],
            $res['telefon'],
            $res['name'],
            $res['date-birth'],
            $res['date-season'],
            $res['INN'],
            $rod,
            $CLINIC[$res['place']],
            $clinic
        );
        

        array_push($ALL_PATCH_FILES_PDF, '../sample/'.$filename);
        
        foreach($v->file as $FilePatch){
            
            $nameFILE = array_reverse(explode('/', $FilePatch))[0];
            $type = array_reverse(explode('.',$nameFILE))[0];
            
            if(strtolower($type) == 'pdf'){
                array_push($ALL_PATCH_FILES_PDF, '../document/'.$nameFILE);

            }else{
                array_push($ALL_PATCH_FILES_OTHER, 'document/'.$nameFILE);
            }
        }
        array_push($ALL_PATCH_FILES_PDF, $CLINICL->{$clinic});
    }
    // print_r($ALL_PATCH_FILES_PDF);
    //слеиваем файлы
   $new_fil = 'document/marge_'.$post->bid.'.pdf';
   $error = marge($ALL_PATCH_FILES_PDF,  '../'.$new_fil, $post->dublePrint);
    // marge($ALL_PATCH_FILES_PDF,  '../pt_' . $new_fil);
    $stcl = new stdClass();
    $stcl->pdf = $ALL_PATCH_FILES_PDF;
    $stcl->all = $ALL_PATCH_FILES_OTHER;
    $stcl->marge = $new_fil;

    if($error != ''){
        $stcl->error = $error["file"];
    }else{
        $stcl->error = '';
    }
    echo json_encode($stcl,JSON_UNESCAPED_UNICODE);
    $date = date('d.m.Y', mktime(0,0, 0, date('m'), date('d'), date('Y')));
    // mysqli_query($link, "UPDATE `nalog` SET `data-done` = '$date', `status` = '2' WHERE `id`='$post->bid'");
}
if (array_key_exists('set-status-2', $_POST)) {
    $post = json_decode($_POST['set-status-2']);
    mysqli_query($link, "UPDATE `nalog` SET `data-done` = '$date', `status` = '2' WHERE `id`='$post->bid'");
}



if (array_key_exists('del-file', $_POST)) {
    $post = json_decode($_POST['del-file']);
    $res = mysqli_fetch_assoc(mysqli_query($link, "SELECT  `clinic` FROM `nalog` WHERE `id` = '$post->bid'"));
    $cl = json_decode($res['clinic']);
    $cl->{$post->clinic}->file = array_delete($cl->{$post->clinic}->file, array_search($post->urlFile, $cl->{$post->clinic}->file));

    if(count($cl->{$post->clinic}->file) == 0){
        $cl->{$post->clinic} = obj_key_delete($cl->{$post->clinic}, 'file');
    }

    $cl = json_encode($cl, JSON_UNESCAPED_UNICODE);
    mysqli_query($link, "UPDATE `nalog` SET `clinic` = '$cl' WHERE `id` ='$post->bid'");
    if(is_dir('./../document')){
        if(file_exists('./../document/'.$post->nameFile)){
            unlink('./../document/'.$post->nameFile);
        }
    }
}

if(array_key_exists('get-zayavlenie', $_POST)){
    $post = json_decode($_POST['get-zayavlenie']);
    $res = mysqli_fetch_assoc(mysqli_query($link, "SELECT * FROM `nalog` WHERE `id` = '$post->id'"));
    include_once('./library/tFPDF/sample.php');
    // print_r($res);
    if ($res['RELATION_DEGREE'] == 139) $rod = false; else $rod = true;

 $filename = sample(
        $res['nameNalog'],
        $res['email'],
        $res['telefon'],
        $res['name'],
        $res['date-birth'],
        $res['date-season'],
        $res['INN'],
        $rod,
        $CLINIC[$res['place']],
        $post->clBoss
    );

    if(is_dir('../sample')) {
        $files = scandir('../sample');
        foreach($files as $file){
            if($file != '.' && $file != '..' && $file != $filename){
                unlink('../sample/'.$file);
            }
        }
     }
    //   echo $post->clBoss;
     echo $filename;
}


if (array_key_exists('send-no-clinic', $_POST)) {
    $post = json_decode($_POST['send-no-clinic']);
    $res = mysqli_fetch_assoc(mysqli_query($link, "SELECT * FROM `nalog` WHERE `id` = '$post->bid'"));
    $cl = json_decode($res['clinic']);
    include_once('./library/tFPDF/sample.php');

    $date = explode(' ', $res['date'])[0];
    $dateformat = explode('-', $date)[2].".".explode('-', $date)[1].".".explode('-', $date)[0];
    $file = sample_no_clinic(
        $post->clinic,
        $res['date-season'],
        $post->bid,
        $dateformat,
        './../document/'
    );
    $file = array_reverse(explode('/', $file))[0];
    echo 'document/'.$file;

}





// Удаляет файлы админов
function delete_file_admin(){
    include_once('./database.php');
    // $setting = json_decode(file_put_contents('../Json/setting_file.json'));

    $date = mktime(0, 0, 0, date('m'), date('d'), date('Y'));

    $rowBase = mysqli_query($link, "SELECT  `clinic`, `data-done` FROM `nalog`");

    $FILE_DELETE = [];  // Массив имен файлов на удаление 
    $FILE_ALL = [];
    while($row = mysqli_fetch_assoc($rowBase)){

      
    

           

                $cl = json_decode($row['clinic']);
                foreach($cl as $v){
                    if($v->status == 2 && property_exists($v, 'file')){

                        foreach($v->file as $file){
                            if ($row['data-done'] != '') {

                                $dateRow = explode('.', $row['data-done']);
                                $dateRow = mktime(0, 0, 0, $dateRow[1], $dateRow[0] + 20, $dateRow[2]);
                                $name = array_reverse(explode('/', $file))[0]; // получаем имя файла

                                if ($date >= $dateRow) { // если текущая дата больше 
                                    array_push($FILE_DELETE, $name);
                                }
                            }
                        }
                        
                    }

                    if(property_exists($v, 'file')){
                        foreach ($v->file as $file) {
                            $name = array_reverse(explode('/', $file))[0];
                            array_push($FILE_ALL, $name);
                        }
                    }

                }

            
        
    }
   
   $FILES_DIR = array_diff(scandir('../document/'), array('..', '.', '.htaccess'));

    foreach($FILE_DELETE as $file){
        if(in_array($file , $FILES_DIR)){
            unlink('../document/'.$file); // Удаляем файлы
        }
    }

    // Удаляем файлы которые не индексируються в базе 
        $FIL = array_diff($FILES_DIR, $FILE_ALL);
        foreach($FIL as $file){
            if (date('d.m.Y', filemtime('./document/' . $file)) != date('d.m.Y', mktime(0, 0, 0, date('m'), date('d'), date('Y')))) {
                unlink('./document/' . $file);
            }
        }
    
    // Записываем отчет по удаленным файлам 
}























function globalStatus($bid, $cl){
    include_once('database.php');
    $control = true;
    foreach($cl as $clinic => $value){
        if($value->status != 2) $control = false;
    }

    if($control){
        mysqli_query($link, "UPDATE `nalog` SET `status` = '1' WHERE `id` = '$bid'");
    }
    return $control;
}

function globalStatusReturn($bid, $cl){
    include_once('database.php');

    $control = false;

    foreach ($cl as $clinic => $value) {
        if ($value->status != 2) $control = true;
    }

    if($control){
        mysqli_query($link, "UPDATE `nalog` SET `status` = '0' WHERE `id` = '$bid'");
    }
}




function array_delete($array, $key)
{
    $AR = [];
    if (count($array) == 1) return $AR;
    for ($i = 0;
        $i < count($array);
        $i++
    ) {
        if ($i != $key
        ) array_push($AR, $array[$i]);
    }
    return $AR;
}
function obj_key_delete($Object, $key)
{
    $Obj = new stdClass();
    foreach ($Object as $keys => $value) {
        if ($keys != $key) {
            $Obj->{$keys} = $value;
        }
    }
    return $Obj;
}

?>
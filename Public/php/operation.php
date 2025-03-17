<?php
include_once('securyti.php');
include_once('database.php');

class Operations{

    static function newUser($post){

        $roles_st = new stdClass();
        $roles_st->admin = "Администратор клиники";
        $roles_st->senior_admin = "Старший Администратор";
        $roles_st->doctor = "Врач";
        $roles_st->marketing = "Маркетинг";
        $roles_st->system_admin = "Системный администратор";

        // $post = json_decode($_POST['new-user']);
        $send = new stdClass();
        // Приводим в норму для загрузки в базу 
        foreach ($post as $key => $val) {
            if ($key != 'name' && $key != 'tel' && $post->{$key} != false) {
                if (property_exists($send, 'role')) {
                    $send->role = $send->role . '/' . $key;
                } else {
                    $send->role = $key;
                }
            } else {
                if ($key == 'tel') {
                    $send->tel = str_replace(['+', ' ', '(', ')', '-'], '', $post->{$key});
                }
                if ($key == 'name') {
                    $send->name = $post->name;
                }
            }
        }

        
        $password = gen_password();
        $hesh_pass = md5($password);

        $SQL_check = mysqli_fetch_assoc(mysqli_query($GLOBALS['LINK_DB'], "SELECT  `id`, `old`, `password`, `telefone`, `name`, `autetificator`, `role` FROM `unclude` WHERE `telefone`= '$send->tel' "));
        if (!$SQL_check) {
            mysqli_query($GLOBALS['LINK_DB'], "INSERT INTO `unclude`(`id`, `password`, `old`, `telefone`, `name`, `autetificator`, `role`) VALUES ( NULL,'$hesh_pass','0','$send->tel','$send->name', 'нет', '$send->role')");
            // Тут отпрвка сообщения 
            // $send-tel
            // $password
            $header = new stdClass();
            $header->headerType = 'TEXT';
            $header->text = 'Временный пароль';
            include_once('send-whatsapp.php');
            $responce = send_whatsapp($send->tel, 'Пароль для первого входа в *систему отправки быстрых сообщений*: ' . $password, $header);




            if (property_exists($responce, 'requestId')) {
                echo 'ok';
            } else {
                echo 'Error send whatsApp:' . json_encode($responce);
            }
        } else {
            $new_send = new stdClass();
            $new_send->status = "Такой пользователь существует";
            $roles =  explode('/', $SQL_check["role"]);
            $nameroel = '';
            foreach ($roles as $key) {
                if (property_exists($roles_st, $key)) {
                    $nameroel = $nameroel . ' ' . $roles_st->{$key};
                }
            }
            $new_send->role = $nameroel;
            $new_send->role_key = $roles;
            echo json_encode($new_send);
        }
    }




    static function updatePassword($post){
        $id_base = $GLOBALS['SQL']['id'];
        $hesh_pass = md5($post->password);
        mysqli_query($GLOBALS['LINK_DB'], "UPDATE `unclude` SET `password`='$hesh_pass',`old`='1' WHERE `id`= '$id_base'");
        setcookie('old_user', '1', time() + 3600 * 24 * 360, '/');
        echo 'ok';
    }

    static function updateRole($post){

        $post->tel = str_replace(['+', ' ', '(', ')', '-'], '', $post->tel);
        $nameRole = '';
        $SQL_check = mysqli_fetch_assoc(mysqli_query($GLOBALS['LINK_DB'], "SELECT  `id`, `old`, `password`, `telefone`, `name`, `autetificator`, `role` FROM `unclude` WHERE `telefone`= '$post->tel' "));
        $id = $SQL_check['id'];
        foreach ($post as $key => $val) {
            if ($key != 'name' && $key != 'tel') {
                if ($nameRole == '') {
                    $nameRole = $key;
                } else {
                    $nameRole = $nameRole . '/' . $key;
                }
            }
        }
        mysqli_query($GLOBALS['LINK_DB'], "UPDATE `unclude` SET `role`='$nameRole' WHERE `telefone` = '$post->tel'");
        if (property_exists($post, 'name')) {
            if ($post->name != '') {
                mysqli_query($GLOBALS['LINK_DB'], "UPDATE `unclude` SET `name`='$post->name' WHERE `id` = '$id'");
            }
        }

        echo 'ok';
    }


    static function getBase($period){

        $stDate = explode('.', $period->start);
        $enDate = explode('.', $period->end);
        // print_r($enDate);
        $stDate =  mktime(0, 0, 0, $stDate[1], $stDate[0], $stDate[2]);
        $enDate =  mktime(0, 0, 0, $enDate[1], $enDate[0], $enDate[2]);
        $resultBase = mysqli_query($GLOBALS['LINK_DB'], "SELECT * FROM `send_wa`");
        $BASE = [];
        $i = 0;

        while ($row = mysqli_fetch_assoc($resultBase)) {

            $Date = explode('.', explode(' ', $row['date'])[0]);
            $Date =  mktime(0, 0, 0, $Date[1], $Date[0], $Date[2]);

            if ($stDate <= $Date && $Date <= $enDate) {
                if ($GLOBALS['ROLE']  == 'system_admin' || $GLOBALS['ROLE']== 'senior_admin') { //! Доступ ко всей базе сообщений 
                    array_push($BASE, $row);
                } else {
                    if ($row['id_user'] == $GLOBALS['SQL']['id']) {
                        array_push($BASE, $row);
                    }
                }
            }
        }
        echo json_encode($BASE);

    }


    static function getBaseNew($period){
        // $period = json_decode($_POST['get-base-new']);
        $stDate = explode('.', $period->st);
        $enDate = explode('.', $period->en);
        // print_r($enDate);
        $stDate =  mktime(0, 0, 0, $stDate[1], $stDate[0], $stDate[2]);
        $enDate =  mktime(0, 0, 0, $enDate[1], $enDate[0], $enDate[2]);
        $sort = [];
        $sortStr = '';

        if (property_exists($period, "telefon")) {
            $period->telefon = str_replace(['+', ' ', '(', ')', '-'], '', $period->telefon);
            array_push($sort, "`telefone`='$period->telefon'");
        }

        if (property_exists($period, "NameSample")) {
            array_push($sort, "`NameSample`='$period->NameSample'");
        }
        if (property_exists($period, "sender")) {
            array_push($sort, "`id_user`='$period->sender'");
        }

        if (property_exists($period, "clinic")) {
            array_push($sort, "`filial`='$period->clinic'");
        }



        if (count($sort) > 1) {
            $sortStr = implode(" AND ", $sort);
        } else {
            if (count($sort) == 1) $sortStr =  $sort[0];
        }

        if ($sortStr != '') {
            $resultBase = mysqli_query($GLOBALS['LINK_DB'], "SELECT * FROM `send_wa` WHERE " . $sortStr);
        } else {
            $resultBase = mysqli_query($GLOBALS['LINK_DB'], "SELECT * FROM `send_wa`");
        }





        $BASE = [];
        $i = 0;
        while ($row = mysqli_fetch_assoc($resultBase)) {

            $Date = explode('.', explode(' ', $row['date'])[0]);
            $Date =  mktime(0, 0, 0, $Date[1], $Date[0], $Date[2]);

            if ($stDate <= $Date && $Date <= $enDate) {
                if ($GLOBALS['ROLE']  == 'system_admin' || $GLOBALS['ROLE']== 'senior_admin') { //! Доступ ко всей базе сообщений 
                    array_push($BASE, $row);
                } else {
                    if ($row['id_user'] == $GLOBALS['SQL']['id']) {
                        array_push($BASE, $row);
                    }
                }
            }
        }

        echo json_encode($BASE);

    }


    static function getBaseSender(){
        $sql = mysqli_query($GLOBALS['LINK_DB'], "SELECT `id`, `name` FROM `unclude`");
        echo json_encode(mysqli_fetch_all($sql, MYSQLI_ASSOC), JSON_UNESCAPED_UNICODE);
    }

    static function getUser(){
        $sql = mysqli_query($GLOBALS['LINK_DB'], "SELECT * FROM `unclude`");
        echo json_encode(mysqli_fetch_all($sql, MYSQLI_ASSOC), JSON_UNESCAPED_UNICODE);
    }

    static function setNotif($post){
        mysqli_query($GLOBALS['LINK_DB'], "UPDATE `unclude` SET `bool_notif`='0',`notification`='$post->text';");
        echo 'ok';
    }

    static function setBooleanNotif(){
        $id_base = $GLOBALS['id_base'];
        mysqli_query($GLOBALS['LINK_DB'], "UPDATE `unclude` SET `bool_notif`='1' WHERE `id`='$id_base';");
        setcookie('notification', '', time() + 3600 * 24 * 360, '/');
    }

    static function getBaseForStatus($period){
        $stDate = explode('.', $period->start);
        $enDate = explode('.', $period->end);
        // print_r($enDate);
        $stDate =  mktime(0, 0, 0, $stDate[1], $stDate[0], $stDate[2]);
        $enDate =  mktime(0, 0, 0, $enDate[1], $enDate[0], $enDate[2]);
        $resultBase = mysqli_query($GLOBALS['LINK_DB'], "SELECT * FROM `send_wa`");
        $BASE = [];
        $i = 0;

        while ($row = mysqli_fetch_assoc($resultBase)) {
            $Date = explode('.', explode(' ', $row['date'])[0]);
            $Date =  mktime(0, 0, 0, $Date[1], $Date[0], $Date[2]);

            if ($stDate <= $Date && $Date <= $enDate) {
                if ($row['id_user'] == $GLOBALS['SQL']['id']) {
                    array_push($BASE, $row);
                }
            }
        }
        echo json_encode($BASE);

    }
    static function newNews($post)
    {
        $post->author = $GLOBALS['SQL']['name'];
        $post->id = uniqid();
        if (file_exists('../Json/news.json')) {
            $news = json_decode(file_get_contents('../Json/news.json'));
        } else {
            $news = new stdClass();
            $news->news = [];
        }
        array_push($news->news, $post);
        file_put_contents('../Json/news.json', json_encode($news, JSON_UNESCAPED_UNICODE));
        echo "Новость опубликована";

    }



    static function getNews($post)
    {
        if (file_exists("../Json/news.json")) {
            $news = json_decode(file_get_contents('../Json/news.json'));
            // foreach($news->news as $nvalue) if(!in_array($SQL['id'], $nvalue->user)) setcookie('news_count', $countNews, time() + 3600 * 24 * 360, '/');
            echo json_encode($news);
        }
    }




    static function setRead($post){
        if (file_exists("../Json/news.json")) {
            $news = json_decode(file_get_contents('../Json/news.json'));
            foreach ($news->news as $key => $nvalue) {
                if ($nvalue->id == $post && !in_array($GLOBALS['SQL']['id'], $news->news[$key]->user)) {
                    array_push($news->news[$key]->user, $GLOBALS['SQL']['id']);
                    file_put_contents('../Json/news.json', json_encode($news, JSON_UNESCAPED_UNICODE));
                    setcookie('news_count', $GLOBALS['countNews'] - 1, time() + 3600 * 24 * 360, '/');
                    echo '1';
                    exit;
                }
            }
        }
        echo '0';
    }


    static function deleteNews($post)
        {
            if (file_exists("../Json/news.json")) {
                $news = json_decode(file_get_contents('../Json/news.json'));
                foreach ($news->news as $key => $nvalue) {
                    if ($nvalue->id == $post) {
                        $news->news = array_delete($news->news, $key);
                        file_put_contents('../Json/news.json', json_encode($news, JSON_UNESCAPED_UNICODE));
                        echo '1';
                        exit;
                    }
                }
            }
            echo '0';
        }

        static function updateNews($post){

                $newCount = 0;
                if (file_exists("../Json/news.json")) {
                    $news = json_decode(file_get_contents('../Json/news.json'));
                    foreach ($news->news as $key => $nvalue) {
                        if (!in_array($_COOKIE['id_user'], $nvalue->user)) $newCount++;
                    }
                    if ($newCount != $post) {
                        // setcookie('news_count', $newCount, time() + 3600 * 24 * 360, '/');
                        echo '1';
                        exit;
                    }
                }
                echo '0';

        }

}



?>
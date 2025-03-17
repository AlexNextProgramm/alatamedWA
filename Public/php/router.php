<?php
use Router\Router;

include_once('autoload.php');

// запросы шаблона
Router::post('sample', 'Sample::getSample' );
Router::post('variable', 'Sample::getVariable');
Router::post('constants-get', 'Sample::contants');
Router::post('constants-set', 'Sample::setContants');
Router::post('sample-variable', 'Sample::getSampleVariable');
Router::post('variable-new', 'Sample::setVariableNew');
Router::post('variable-del', 'Sample::DeleteVariable');
Router::post('set', 'Sample::set' );
Router::post('del', 'Sample::del');
Router::files('IMAGE-SAMPLE', 'Sample::images');

// запросы Whatsapp
Router::post('send-wa', 'WhatsApp::send');
Router::post('get-status', 'WhatsApp::getStatus');

// Запросы входа
Router::post('include', 'Auth::inSystem' );
Router::post('update-form-start-password', 'Auth::updatePassword');


// Разные опрации
Router::post('new-user', 'Operations::newUser');
Router::post('update-password', 'Operations::updatePassword');
Router::post('update-role', 'Operations::updateRole');
Router::post('get-base', 'Operations::getBase');
Router::post('get-base-new', 'Operations::getBaseNew');
Router::post('get-base-sender', 'Operations::getBaseSender');
Router::post('get-user', 'Operations::getUser');
Router::post('set-notif','Operations::setNotif');
Router::post('set_bool_notif', 'Operations::setBooleanNotif');
Router::post('get-base-for-status', 'Operations::getBaseForStatus');
Router::post('new-news', 'Operations::newNews');
Router::post('get-news', 'Operations::getNews');
Router::post('set-read', 'Operations::setRead');
Router::post('del-news', 'Operations::deleteNews');
Router::post('update-news', 'Operations::updateNews');





mysqli_close($GLOBALS['LINK_DB']);




if (error_get_last()) {
    $Arr =  error_get_last(); // получаем массив ошбки
    $f =  fopen("./../php/log_error.txt", "a+"); //открываем файл для записи курсов в конце на новой строке
    // вписывам когда  в каком файле на какой строке и что произошло 
    fwrite($f, '>>> TIME: ' . date('d.m.Y H:i:s') . ' FILE: ' . $Arr['file'] . " LINE: " . $Arr['line'] . ' ERROR: ' . $Arr['message'] . "\n");
    fclose($f); // закрваем файл
}
?>
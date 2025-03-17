<?php
//  $ch = curl_init('https://kdl.ru/api/tests-results?__csrf=1640348031&orderNumber=9112716656&phoneNumber=89261881687&stage=requestSmsCode');
//         curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);//запрос не выводить на страницу а сохранить в переменную $response
//         curl_setopt($ch, CURLOPT_HEADER, false); //заголовки сервер напишет автоматически 
//         curl_setopt($ch, CURLOPT_POST, 1); // определяем что это пост запрос
//         curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1); //запрос https
//         $response = curl_exec($ch); // получаем данные из запроса
//         echo $response;

function GET($URL)
{
    // // $sPD = "name=Jacob&bench=150"; // Данные POST
    $HTTPS = array(
            'https' => // Обертка, которая будет использоваться
            array(
                'method'  => 'GET', // Метод запроса
                // Ниже задаются заголовки запроса
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n".
                "Cookie: spid=1712316933589_550fcb10f7807933c3965cb30c78b7be_x69j2v4sim59nn6j; FusionCMS=hah1vul6ll7kc4u61o7fi5o2or; FusionCMS_region=1; _gcl_au=1.1.388076427.1712316935; _ym_uid=1712306938767511003; _ym_d=1712316935; FusionCMS_utm_clientID=1712306938767511003; tmr_lvid=33e1a1e59b1fe3db87f0f3ab24624281; tmr_lvidTS=1712306937905; _ga=GA1.2.1862123992.1712316938; _gid=GA1.2.542752638.1712316938; _ym_isad=2; cted=modId%3D04e32658%3Bclient_id%3D1862123992.1712316938%3Bya_client_id%3D1712306938767511003; _ym_visorc=b; _ct_ids=04e32658%3A20783%3A1635730247; _ct_session_id=1635730247; _ct_site_id=20783; _ct=700000001624841375; _ct_client_global_id=58ed7c57-d0b5-55c3-97bd-1a263b3940fb; _ga_QEGFVJKPFT=GS1.2.1712316942.1.1.1712316957.45.0.0; call_s=%3C!%3E%7B%2204e32658%22%3A%5B1712318757%2C1635730247%2C%7B%22108497%22%3A%22344690%22%2C%22108498%22%3A%22583098%22%2C%22108499%22%3A%22344692%22%2C%22108500%22%3A%22344693%22%2C%22108501%22%3A%22344694%22%2C%22108502%22%3A%22344695%22%2C%22108503%22%3A%22344696%22%2C%22108504%22%3A%22344697%22%2C%22108505%22%3A%22344698%22%2C%22108506%22%3A%22344699%22%2C%22108507%22%3A%22344700%22%2C%22108508%22%3A%22583425%22%2C%22108509%22%3A%22344702%22%2C%22108510%22%3A%22344703%22%2C%22108511%22%3A%22344704%22%2C%22108512%22%3A%22344705%22%2C%22108513%22%3A%22344706%22%2C%22108514%22%3A%22872041%22%2C%22108515%22%3A%22344708%22%2C%22108516%22%3A%22583105%22%2C%22108517%22%3A%22344710%22%2C%22108518%22%3A%22344711%22%2C%22108519%22%3A%22916853%22%2C%22108520%22%3A%22344713%22%2C%22108521%22%3A%22916876%22%2C%22138888%22%3A%22431014%22%2C%22168705%22%3A%22517794%22%2C%22201312%22%3A%22619189%22%2C%22206518%22%3A%22633296%22%2C%22278452%22%3A%22826145%22%7D%5D%2C%22d%22%3A2%7D%3C!%3E; tmr_detect=0%7C1712316960563; FusionCMS_regionConfirmed=1\r\n".
                "Origin: https://kdl.ru\r\n".
                "Referer: https://kdl.ru/\r\n",
                
                // 'content' => $
            )
        );
    $context = stream_context_create($HTTPS);
    return file_get_contents($URL, false, $context);
}
echo GET('https://kdl.ru/api/tests-results?__csrf=1640348031&orderNumber=9112716656&phoneNumber=89261881687&stage=requestSmsCode');
?>
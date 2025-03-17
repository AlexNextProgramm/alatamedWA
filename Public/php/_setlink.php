<?php 

function myCRC($uri){
	$c = crc32($uri);
	if ($c > 0x7FFFFFFF)
		$c = -(0xFFFFFFFF - $c + 1);
	return $c;
	}

// Функция кодирования числа base64 для создания короткой ссылки
function base62_encode($base, $chars) {
	$val=str_replace(".","",strval(microtime(true)));
	$val=substr($val,-10); // обрезаем до 10 символов, чтобы не было ошибки

    // can't handle numbers larger than 2^31-1 = 2147483647
    $str = '';
    do {
        $i = $val % $base;
        $str = $chars[$i] . $str;
        $val = ($val - $i) / $base;
    } while($val > 0);
	$str="~".$str;
    return $str;
}

function newSetlink($clinic, $uip, $new_phone){
	$URL = 'https://www.altamedplus.ru/';
switch ($clinic){
	case 'Altamed':
			$short = SetLink("ap","clinic","whatsapp",$uip,$new_phone, 301);
			return $URL.$short;
			break;
	case 'Odinmed':
			$short=SetLink("om","clinic","whatsapp",$uip,$new_phone, 301);
			return $URL.$short;
			break;
	case 'Odinmedplus':
			$short = SetLink("omp","clinic","whatsapp",$uip,$new_phone, 301);
			return $URL.$short;
			break;
	case 'Dubki':
			$short = SetLink("da","clinic","whatsapp",$uip,$new_phone, 301);
			return $URL.$short;
			break;
	case 'Proletarka':
			$short = SetLink("vp","clinic","whatsapp",$uip,$new_phone, 301);
			return $URL.$short;
			break;
	case 'AltamedBeauty':
			$short = SetLink("ab","clinic","whatsapp",$uip,$new_phone, 301);
			return $URL.$short;
			break;
	
}
}

function SetLink($utm_clinic, $utm_source, $utm_medium, $utm_uip, $utm_phone, $status_uri){
	$path="otzyv"; // путь до скрипта отзывов
	// Обработка входящих данных и формирование длинной ссылки
	$utm_clinic = htmlspecialchars($utm_clinic);
	$utm_source = htmlspecialchars($utm_source);
	$utm_medium = htmlspecialchars($utm_medium);
	$utm_uip = htmlspecialchars($utm_uip);
	$utm_phone = htmlspecialchars($utm_phone);
	
	$utm_phone=dechex((1687 + $utm_phone * 2) * 3); // Кодируем телефон
	
	$host="www.altamedplus.ru";
	$long_link="https://".$host."/".$path."/?"."utm_clinic=".$utm_clinic."&utm_source=".$utm_source."&utm_medium=".$utm_medium."&utm_phone=".$utm_phone."&utm_uip=".$utm_uip;

	//Формируем короткую уникальную ссылку по Base64 на основе microtime
	$short_link=base62_encode(64, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
	
	//подготовка данных для внесения в БД
	$modified = date("Y-m-d H:i:s");
	$life_time=date("Y-m-d H:i:s" ,strtotime("+30 days")); // формируем срок действия ссылки +30дней от текущего времени
	$uri_crc=myCRC($long_link);
	$short_uri_crc=myCRC($short_link);

	//echo "long_link=".$long_link;
	//echo "<br>modified=".$modified;
	//echo "<br>short=".$short_link;
	//echo "<br>new_short=".$sh;
	
	$DBHost = "localhost";
	$DBName = "ci99420_itrack";
	$DBLogin = "ci99420_itrack";
	$DBPassword = "2s6T7!fuC68!";

	$link_new = mysqli_connect($DBHost, $DBLogin, $DBPassword, $DBName);
	if (mysqli_connect_errno()) { printf("<!-- Ошибка соединения с БД: %s\n  -->", mysqli_connect_error());exit();	}
	
	$sql="SELECT ID FROM b_short_uri WHERE SHORT_URI_CRC=".$short_link;
	$result=mysqli_query($link_new, $sql);

	
	if ($result) {
	// если найдена подобная короткая ссылка...
	}
	else {
	$sql="INSERT INTO b_short_uri (URI, URI_CRC, SHORT_URI,SHORT_URI_CRC,STATUS,MODIFIED, LIFETIME) VALUES ('".$long_link."','".$uri_crc."','".$short_link."','".$short_uri_crc."',".$status_uri.",'".$modified."', '".$life_time."')";
	
	
	if (mysqli_query($link_new, $sql)) { }
			else {echo "<!-- Error inserting record: " .$sql. mysqli_error($link_new)." -->";}
			
	}
	
	mysqli_close($link_new);
	
	return $short_link;
}

if(error_get_last()){
	$Arr =  error_get_last(); // получаем массив ошбки
	$f =  fopen("log_error.txt", "a+"); //открываем файл для записи курсов в конце на новой строке
	// вписывам когда  в каком файле на какой строке и что произошло 
	fwrite($f, '>>> TIME: '.date('d.m.Y H:i:s').' FILE: '.$Arr['file']." LINE: ".$Arr['line'].' ERROR: '.$Arr['message']."\n");
	fclose($f); // закрваем файл
}

	
?>
<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");

include ("../bitrix/php_interface/dbconn.php");
$link = mysqli_connect($DBHost, $DBLogin, $DBPassword,$DBName);
if (mysqli_connect_errno()) { printf("Не удалось подключиться: %s\n", mysqli_connect_error()); exit(); }

use Bitrix\Main\Loader; 
use Bitrix\Highloadblock as HL; 
use Bitrix\Main\Entity;

// получим элементы каталога клиник
 $clinics = \Bitrix\Iblock\Elements\ElementclinicsTable::getList([
    'select' =>['ID',
    'NAME', 'CODE', 'PREVIEW_TEXT', 
    'ADDRESS' => 'ADDRESS',
    'TOWN' => 'TOWN', 
    'PHONE_YML'=>'PHONE_YML'
],
    'limit' => 20
])->fetchAll(); 


// Функция обработки текста от тегов и спецсимволов: текст, 0/1 подстановка тире перед пунктами
function format_text($d_detail,$add_nbsp){
	if ($add_nbsp==1) {
		$txt = str_replace('<li', '-<li', $d_detail); 	// добавим минусы в списке
		}
		else{ $txt=$d_detail;}
	//$txt = str_replace('nbsp;', ' ', $d_detail1);		
			
	$txt = strip_tags($txt); 						// уберем теги
	$rows_det = explode("\n", $txt); 				// разобьем на строки
	$rows_det = array_map('trim', $rows_det); 		// уберем пробелы в начале и конце
	$rows_det = array_filter($rows_det); 			// уберем пустые строки
	$d_detail=implode("\n", $rows_det);  			// склеим строки снова в текст	
		
	$pos=strripos($d_detail,'";s:4:"TYPE"');	 
	$d_detail=substr($d_detail,0,$pos);
	
	$pos1=stripos($d_detail,'"');
	$pos2=stripos($d_detail,'"',$pos1+1);
	$pos3=stripos($d_detail,'"',$pos2+1);
	$d_detail=substr($d_detail,$pos3+1,strlen($d_detail));
	$d_detail = trim(htmlentities($d_detail, ENT_XML1));
	//$d_detail=$d_desc."\r\n ".$d_detail;
	
	return $d_detail;
	}

// Функция обработки мест работы от тегов и спецсимволов
function format_job($d_detail){
	
	

	//$pos=strripos($d_detail,'";s:4:"TYPE"');	 
	//$d_detail=substr($d_detail,0,$pos);
	
	//$pos1=stripos($d_detail,'"');
	//$pos2=stripos($d_detail,'"',$pos1+1);
	//$pos3=stripos($d_detail,'"',$pos2+1);
	//$d_detail=substr($d_detail,$pos3+1,strlen($d_detail));
	
	$txt=$d_detail;
			
	$txt = strip_tags($txt); 						// уберем теги
	$rows_det = explode("\n", $txt); 				// разобьем на строки
	$rows_det = array_map('trim', $rows_det); 		// уберем пробелы в начале и конце
	$rows_det = array_filter($rows_det); 			// уберем пустые строки
	//print_r($row_det);
	//$d_detail=implode("\n", $rows_det);  			// склеим строки снова в текст	
		
		//$d_detail = trim(htmlentities($d_detail, ENT_XML1));
	//$d_detail=$d_desc."\r\n ".$d_detail;
	
	return $d_detail;
	}

function find_clinic($clinics, $id_clinic){

	$count = 0;
	$Arr = [];

	foreach($id_clinic as $id_c){

		foreach ($clinics as $id => $items){
			
			if (array_search($id_c, $items)){
				$count++;
				$name_clinic = $items['NAME'];
				$town_clinic = $items['TOWNVALUE'];
				$phone_clinic = $items['PHONE_YMLVALUE'];
				$address_clinic = $items['ADDRESSVALUE'];		
				array_push($Arr,array( $name_clinic, $town_clinic, $phone_clinic, $address_clinic, $count));
				}
			}

	}
		return $Arr;
	}


$xml        = new SimpleXMLElement("<?xml version=\"1.0\" encoding=\"utf-8\" ?><yml_catalog date=\"".date("Y-m-d H:i")."\"></yml_catalog>");
$shop       = $xml->addChild('shop');
$name       = $shop->addChild('name', 'Альтамед+');
$company    = $shop->addChild('company', 'ООО "Альтамед+"');
$url        = $shop->addChild('url', 'https://altamedplus.ru/doctors/');
$email      = $shop->addChild('email', 'altamedplus@mail.ru');
$picture    = $shop->addChild('picture', 'https://altamedplus.ru/local/templates/altamed/img/logo_svg.svg');
$description= $shop->addChild('description', 'У нас работают лучшие врачи! Доктора стажируются и развиваются, идут в ногу со временем, используют новейшие методики в сочетании с многолетним опытом работы. Используя фильтр, Вы можете выбрать необходимую специальность врача и быстро записаться онлайн или по телефону.');
$cats       = $shop->addChild('categories');
$cats1		= $cats->addChild('category', 'Врач');
$cats1		= $cats1->addAttribute('id', 1);
$sets       = $shop->addChild('sets');


// специализация старое
/* $query_spec = "SELECT UF_NAME, UF_XML_ID from b_hlbd_specialization ";
$result_spec = mysqli_query($link, $query_spec);

while ($row_spec = mysqli_fetch_array($result_spec)) {
	
	$set = $sets->addChild('set');
	$set->addAttribute('id', $row_spec['UF_XML_ID']);
	$name = $set->addChild('name', $row_spec['UF_NAME']);
    $urlVector = "https://altamedplus.ru/doctors/?spec={$row_spec['UF_XML_ID']}";
    $urlSet = $set->addChild('url', $urlVector );	
	}
	mysqli_free_result($result_spec); */
	
// формируем массив всех возможных специализаций
$query_spec = "SELECT UF_NAME, UF_XML_ID from b_hlbd_specialization ";
$result_spec = mysqli_query($link, $query_spec);
$hlbd_arr=array();

while ($row_spec = mysqli_fetch_array($result_spec)) {
	$hlbd_arr[$row_spec['UF_XML_ID']]=$row_spec['UF_NAME'];
	}
	mysqli_free_result($result_spec);	

// находим все специализации врачей (из карточек врача)

$query = "SELECT ID from b_iblock_element where IBLOCK_ID=2 AND ACTIVE='Y'";
$result = mysqli_query($link, $query);
$spec_arr=array();

while ($row = mysqli_fetch_array($result)) {
	
	$d_id=$row['ID'];
	
	// Вытаскиваем специализацию врача
	$query2 = "SELECT ID, IBLOCK_PROPERTY_ID, VALUE from b_iblock_element_property where IBLOCK_ELEMENT_ID='".$d_id."'";
	$result2 = mysqli_query($link, $query2);
	
	while ($row2 = mysqli_fetch_array($result2)) {
		if ($row2['IBLOCK_PROPERTY_ID']==20)  {
			if (array_search($row2['VALUE'], $spec_arr)===false){
				array_push($spec_arr,$row2['VALUE']); // пишем массив
				}
			}
		}
}

mysqli_free_result($result);
mysqli_free_result($result2);
	
foreach ($spec_arr as $elem){
	$set = $sets->addChild('set');
	$set->addAttribute('id', $elem);
	$name = $set->addChild('name', $hlbd_arr[$elem]);
    $urlVector = "https://altamedplus.ru/doctors/?spec={$elem}";
    $urlSet = $set->addChild('url', $urlVector );
}
	//print_r($spec_arr);
	
	
	$offers = $shop->addChild('offers');
	
// доктора
$query = "SELECT ID, NAME, PREVIEW_TEXT, DETAIL_PICTURE, CODE from b_iblock_element where IBLOCK_ID=2 AND ACTIVE='Y'";
$result = mysqli_query($link, $query);

while ($row = mysqli_fetch_array($result)) {
	
	$d_id=$row['ID'];
	$d_name=$row['NAME'];
	$FIO = explode(" ", $d_name);
	$d_url="https://www.altamedplus.ru/doctors/".$row['CODE']."/";

	// Вытаскиваем путь до картинки детального изображения врача
	$query_img = "SELECT SUBDIR, FILE_NAME FROM b_file WHERE ID = ".$row['DETAIL_PICTURE'];
	$result_img = mysqli_query($link, $query_img);
	while ($row_img = mysqli_fetch_array($result_img)) {
		$subdir=$row_img["SUBDIR"];
		$file_name=$row_img["FILE_NAME"];
		$d_img_path="https://www.altamedplus.ru/upload/".$subdir."/".$file_name;
		}
	mysqli_free_result($result_img);
				
	

	// Вытаскиваем свойства врача
	$query2 = "SELECT ID, IBLOCK_PROPERTY_ID, VALUE from b_iblock_element_property where IBLOCK_ELEMENT_ID='".$d_id."'";
	$result2 = mysqli_query($link, $query2);
	
	while ($row2 = mysqli_fetch_array($result2)) {
	
		if ($row2['IBLOCK_PROPERTY_ID']==20)  {if (!empty($d_spec)) {$t=", ";} else {$t="";} $d_spec.=$t.$row2['VALUE']; }
		if ($row2['IBLOCK_PROPERTY_ID']==113) {$d_cost=$row2['VALUE']; }
		if ($row2['IBLOCK_PROPERTY_ID']==25)  {$d_stazh=$row2['VALUE']; }
		if ($row2['IBLOCK_PROPERTY_ID']==73)  {$d_adult=$row2['VALUE']; if($d_adult>0) {$d_adult_val="Взрослый врач";} else {$d_adult_val="";}}
		if ($row2['IBLOCK_PROPERTY_ID']==21) {$d_child=$row2['VALUE']; if($d_child>0) {$d_child_val="Детский врач";} else {$d_child_val="";}}
		if ($row2['IBLOCK_PROPERTY_ID']==291) {$d_quot=$row2['VALUE']; $d_quot=format_text($d_quot,1);}  // цитата врача
		if ($row2['IBLOCK_PROPERTY_ID']==22) {$d_detail=$row2['VALUE']; $d_detail=format_text($d_detail,1);} // Описание врача
		if ($row2['IBLOCK_PROPERTY_ID']==23) {$d_edu=$row2['VALUE']; 	} //инфо об образовании
		if ($row2['IBLOCK_PROPERTY_ID']==258) {$d_sert=$row2['VALUE']; 	} //инфо о сертификатах	
		if ($row2['IBLOCK_PROPERTY_ID']==24) {$d_job=$row2['VALUE']; 	} //Инфо о работе
		if ($row2['IBLOCK_PROPERTY_ID']==242) {$d_clinic_id[]=$row2['VALUE']; }	// Клиника приема, может быть одна, может несколько
		
		
		
		
		if ($row2['IBLOCK_PROPERTY_ID']==5 && !empty($row2['VALUE'])) {
			$d_categ=$row2['VALUE']; 
	
			//$d_stepen - кандидат наук, доктор
			//$d_zvanie - профессор, заслуженный работник здравоохранения
			//$d_category - высшая категория, первая, вторая

			// разбор написанного
			if (stripos($d_categ,"андидат")==true OR stripos($d_categ,"доктор")==true) { $d_stepen=$d_categ;}
			if (stripos($d_categ,"офессор")==true || stripos($d_categ,"аботник")==true) { $d_zvanie=$d_categ;}
			if (stripos($d_categ,"тегории")==true) { //$d_category="ok";
				if(stripos($d_categ,"ервой")==true) {$d_category="Первая категория";}
				if(stripos($d_categ,"торой")==true) {$d_category="Вторая категория";}
				if(stripos($d_categ,"ысшей")==true) {$d_category="Высшая категория";}
				}
		}
	}
	
	// Вытаскиваем цену приёма
	$query_price = "SELECT value FROM b_iblock_element_property WHERE iblock_element_ID = ".$d_cost." AND IBLOCK_PROPERTY_ID=96";
	$result_price = mysqli_query($link, $query_price);
	if ($result_price!==false) {
	while ($row_price = mysqli_fetch_array($result_price)) {	$d_price=$row_price["value"];	}
	mysqli_free_result($result_price);
	}
	else {
		$d_price="";
	}
	

	$d_stazh_year=(int)date("Y")-(int)$d_stazh;
	$d_nachalo=$d_stazh."-01-01";
	$d_clinic1 = find_clinic($clinics, $d_clinic_id);
	// if (count($d_clinic_id) > 1 ) {	$d_clinic1 = find_clinic($clinics, 151);}
	// else {$d_clinic1 = find_clinic($clinics, $d_clinic_id[0]);}

	$offer = $offers->addChild('offer');
    $offer->addAttribute('id', $d_id);
	$offer->addChild('name', $FIO[0]." ".$FIO[1]." ".$FIO[2]);    
    $offer->addChild('url', $d_url );
	$offer->addChild('price', $d_price);
	$offer->price->addAttribute('from', "true"); 
    $offer->addChild('currencyId', 'RUB');
    $offer->addChild('set-ids', $d_spec); //специальности через запятую 
    $offer->addChild('picture', $d_img_path);
	
		
	
	if (!empty($d_detail)) { 
		if (!empty($d_quot)) {
			$d_detail=$d_detail.' О себе:"'.$d_quot.'"';}
		$offer->addChild('description', $d_detail); 
		
		
		}
	
    $offer->addChild('categoryId', '1');
    $param = $offer->addChild('param', $FIO[0]);
    $param->addAttribute('name', 'Фамилия');

	$param = $offer->addChild('param', $FIO[1]);
    $param->addAttribute('name', 'Имя');

    $param = $offer->addChild('param', $FIO[2]);
    $param->addAttribute('name', 'Отчество');

    $param = $offer->addChild('param', $d_stazh_year);
    $param->addAttribute('name', 'Годы опыта');	
	
    $param = $offer->addChild('param', $d_nachalo);
    $param->addAttribute('name', 'Начало карьеры');
	// for ($i = 0; $i < count($d_clinic1); $i++) {
		$param = $offer->addChild('param', $d_clinic1[0][1]);
		$param->addAttribute('name', 'Город');
	// }
	
	if ($d_adult_val!="") {
		$param = $offer->addChild('param', 'true');
		$param->addAttribute('name', 'Взрослый врач');
		}
	
	if ($d_child_val!="") {
		$param = $offer->addChild('param','true');
		$param->addAttribute('name', 'Детский врач');	
		}
	
	$param = $offer->addChild('param', '5'); // СТАТИКА!!!
    $param->addAttribute('name', 'Средняя оценка');


	
	if(!empty($d_stepen)) {
		$param = $offer->addChild('param', $d_stepen);
		$param->addAttribute('name', 'Степень');
		}
		
	if(!empty($d_zvanie)) {
		$param = $offer->addChild('param', $d_zvanie);
		$param->addAttribute('name', 'Звание');
		}
		
	if(!empty($d_category)) {
		$param = $offer->addChild('param', $d_category);
		$param->addAttribute('name', 'Категория');
		}

    for($i = 0; $i < count($d_clinic1); $i++){

		$param = $offer->addChild('param', $d_clinic1[$i][1]);
		$param->addAttribute('name', 'Город клиники - '.$d_clinic1[$i][4]);
		
		$param = $offer->addChild('param', $d_clinic1[$i][3]);
		$param->addAttribute('name', 'Адрес клиники - '.$d_clinic1[$i][4] );
		
		$param = $offer->addChild('param', $d_clinic1[$i][0]);
		$param->addAttribute('name', 'Название клиники - '. $d_clinic1[$i][4]);
		
		$param = $offer->addChild('param', $d_clinic1[$i][2]);
		$param->addAttribute('name', 'Телефон для записи - ' . $d_clinic1[$i][4] );
		
	}
	
	$param = $offer->addChild('param', 'true');
    $param->addAttribute('name', 'Возможность записи');
	
	$param = $offer->addChild('param', 'true');
    $param->addAttribute('name', 'Онлайн-расписание');
	
	if (!empty($d_edu)) { 
	
		$txt1=$d_edu;
		$txt1 = strip_tags($txt1); 						// уберем теги
		$rows_det1 = explode("\n", $txt1); 				// разобьем на строки
		$rows_det1 = array_map('trim', $rows_det1); 		// уберем пробелы в начале и конце
		$count_rows_det1=count($rows_det1);
		$rows_det1 = array_filter($rows_det1); 			// уберем пустые строки
		
		$i1=0;
		$j1=1;
		if ($count_rows_det1>12) {$count_rows_det1=12;}
		for ($i1=1;$i1<$count_rows_det1-1;$i1++){
			
			if ($rows_det1[$i1] != ''){
				$job_text1 = trim(htmlentities($rows_det1[$i1], ENT_XML1));
			
				//обработка строки мета работы
				$job_years1=substr($rows_det1[$i1], 0, stripos($rows_det1[$i1]," "));
				$job_text1=substr($job_text1,stripos($rows_det1[$i1]," "), strlen($rows_det1[$i1])); //вытаскиваем год
				
				$ins1=stripos($job_text1,"- ")+1;
				$job_text1=trim(substr($job_text1, $ins1, strlen($job_text1))); // берем все что после "- "
				
			
				$param = $offer->addChild('param', $job_years1);
				$param->addAttribute('name', 'Образование - '.$j1.'');	
				$param->addAttribute('unit', 'Дата');	
				
				$param = $offer->addChild('param', $job_text1);
				$param->addAttribute('name', 'Образование - '.$j1.'');	
				$param->addAttribute('unit', 'Организация');	
					
				$j1++;}
			}
		}

	if (!empty($d_sert)) { 
	
		$txt2=$d_sert;
		$txt2 = strip_tags($txt2); 						// уберем теги
		$rows_det2 = explode("\n", $txt2); 				// разобьем на строки
		$rows_det2 = array_map('trim', $rows_det2); 		// уберем пробелы в начале и конце
		$count_rows_det2=count($rows_det2);
		$rows_det2 = array_filter($rows_det2); 			// уберем пустые строки
		
		$i2=0;
		$j2=1;
		if ($count_rows_det2>12) {$count_rows_det2=12;}
		for ($i2=1;$i2<$count_rows_det2-1;$i2++){
			
			if ($rows_det2[$i] != ''){
				$job_text2 = trim(htmlentities($rows_det2[$i2], ENT_XML1));
			
				//обработка строки мета работы
				$job_years2=substr($rows_det2[$i2], 0, stripos($rows_det2[$i2]," "));
				$job_text2=substr($job_text2,stripos($rows_det2[$i2]," "), strlen($rows_det2[$i2])); //вытаскиваем год
				
				$ins2=stripos($job_text2,"- ")+1;
				$job_text2=trim(substr($job_text2, $ins2, strlen($job_text2))); // берем все что после "- "
				
			
				$param = $offer->addChild('param', $job_years2);
				$param->addAttribute('name', 'Сертификат - '.$j2.'');	
				$param->addAttribute('unit', 'Дата');	
				
				$param = $offer->addChild('param', $job_text2);
				$param->addAttribute('name', 'Сертификат - '.$j2.'');	
				$param->addAttribute('unit', 'Название');	
					
				$j2++;}
			}
		}
	
	if (!empty($d_job)) { 
	
		$txt=$d_job;
		$txt = strip_tags($txt); 						// уберем теги
		$rows_det = explode("\n", $txt); 				// разобьем на строки
		$rows_det = array_map('trim', $rows_det); 		// уберем пробелы в начале и конце
		$count_rows_det=count($rows_det);
		$rows_det = array_filter($rows_det); 			// уберем пустые строки
		
		$i=0;
		$j=1;
		if ($count_rows_det>12) {$count_rows_det=12;}
		for ($i=1;$i<$count_rows_det-1;$i++){
			
			if ($rows_det[$i] != ''){
				$job_text = trim(htmlentities($rows_det[$i], ENT_XML1));
			
				//обработка строки мета работы
				$job_years=substr($rows_det[$i], 0, stripos($rows_det[$i]," "));
				$job_text=substr($job_text,stripos($rows_det[$i]," "), strlen($rows_det[$i])); //вытаскиваем год
				
				$ins=stripos($job_text,"- ")+1;
				$job_text=trim(substr($job_text, $ins, strlen($job_text))); // берем все что после "- "
				
			
				$param = $offer->addChild('param', $job_years);
				$param->addAttribute('name', 'Место работы - '.$j.'');	
				$param->addAttribute('unit', 'Дата');	
				
				$param = $offer->addChild('param', $job_text);
				$param->addAttribute('name', 'Место работы - '.$j.'');	
				$param->addAttribute('unit', 'Организация');	
					
				$j++;}
			}
		}
	
		// Вытаскиваем количество отзывов
 	$query_review = "SELECT IBLOCK_ELEMENT_ID FROM b_iblock_element_property WHERE IBLOCK_PROPERTY_ID = 78 AND VALUE=".$d_id;
	$result_review = mysqli_query($link, $query_review);
	$d_review_count=0;
	$s=1;
	while ($row_review = mysqli_fetch_array($result_review)) {
		$otzyv=$row_review['IBLOCK_ELEMENT_ID'];
		
		$query_review1 = "SELECT VALUE FROM b_iblock_element_property WHERE IBLOCK_ELEMENT_ID = ".$otzyv." AND VALUE='14'";
		$result_review1 = mysqli_query($link, $query_review1);
		
		while ($row_review1 = mysqli_fetch_array($result_review1)) {
			$d_review_count++;
			
			$query_review2 = "SELECT NAME, DATE_CREATE, PREVIEW_TEXT FROM b_iblock_element WHERE IBLOCK_ID = 20 AND ID=".$otzyv;
			$result_review2 = mysqli_query($link, $query_review2);
			
			
			while ($row_review2 = mysqli_fetch_array($result_review2)) {
				if ($s==999) {break;} else {
					//echo "s=".$s.'<br>';
					//echo "Name=".$row_review2['NAME']."<br>";
					//echo "Review=".$row_review2['PREVIEW_TEXT']."<br>";
					//echo "<hr>	";
					
					//Заменяем автора отзыва Продокторов на Пациент
					$string=$row_review2['NAME'];
					$charset = mb_detect_encoding($string);
					$unicodeString = iconv($charset, "UTF-8", $string);
					$new_name=trim(str_replace("Отзыв с ПроДокторов","Пациент",$unicodeString));
				
					$param = $offer->addChild('param', $new_name);
					$param->addAttribute('name', 'Отзыв - '.$s);
					$param->addAttribute('unit', 'Автор');
					
					$new_date=date("d.m.Y H:i:s", strtotime( $row_review2['DATE_CREATE']));
					$param = $offer->addChild('param', $new_date);
					$param->addAttribute('name', 'Отзыв - '.$s);
					$param->addAttribute('unit', 'Дата');

					$param = $offer->addChild('param', 'true');
					$param->addAttribute('name', 'Отзыв - '.$s);
					$param->addAttribute('unit', 'Отзыв проверен');					

					$param = $offer->addChild('param', 'true');
					$param->addAttribute('name', 'Отзыв - '.$s);
					$param->addAttribute('unit', 'Отзыв участвует в рейтинге');					
					
					$review_text=$row_review2['PREVIEW_TEXT'];
					//$text2=format_text($text1,0);
					$review_text = strip_tags($review_text); 						// уберем теги
	
					$rows_det = explode("\n", $review_text); 				// разобьем на строки
					$rows_det = array_map('trim', $rows_det); 		// уберем пробелы в начале и конце
					$rows_det = array_filter($rows_det); 			// уберем пустые строки
					$review_text=implode("\n", $rows_det);  			// склеим строки снова в текст	
						
					$review_text = trim(htmlentities($review_text, ENT_XML1));
	
					
					
					//$text2=call_user_func('format_text', $text1, 0);
					//echo $text2."<br>";
					$param = $offer->addChild('param', $review_text);
					$param->addAttribute('name', 'Отзыв - '.$s);
					$param->addAttribute('unit', 'Понравилось');							
					
					$s++;
					}
				}
			}
		}
	//mysqli_free_result($result_review2); 
	//mysqli_free_result($result_review1); 
	mysqli_free_result($result_review); 
	
	$param = $offer->addChild('param', $d_review_count);  
    $param->addAttribute('name', 'Число отзывов');	
	
	$d_spec='';$d_cost='';$d_stazh='';$d_adult='';$d_child='';$D_detail='';$d_edu='';$d_quot='';$d_categ='';$d_category='';$d_zvanie='';$d_stepen="";$d_job='';$d_detail='';$d_edu='';$d_review_count='';$d_clinic_id=array();$txt='';$d_adult_val="";$d_child_val="";$d_sert='';
	
}  

mysqli_free_result($result);
mysqli_free_result($result2);


Header('Content-type: text/xml');
print($xml->asXML());

?>
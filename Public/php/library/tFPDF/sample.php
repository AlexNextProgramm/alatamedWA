<?php
require('tfpdf.php');
function sample($name, $mail, $telefon, $namePaz, $date_B_Paz, $YearNalog, $INN, $rod = false, $Clinic, $clBoss)
{
    $NAMEBOS = [
    'Альтамед+ на Союзной'=>'Гребцова И.Б.',
    'Альтамед+ на Комсомольской' => 'Гребцова И.Б.',
    'Альтамед+ на Неделина' => 'Гребцова Г.М.',
    'Альтамед+ Дубки'=>'Гребцова И.Б.',
    'Альтамед+ Верхне-Пролетарская' => 'Гребцова Г.М.'
    ];
    $YORCL = [
        // 'Альтамед+ на Союзной' => 'ООО «Дубки-Альтамед»',
        'Альтамед+ на Союзной' => 'OOO «Альтамед+»',
        'Альтамед+ на Комсомольской' => 'OOO «Одинмед»',
        'Альтамед+ на Неделина' => 'OOO «Одинмед+»',
        'Альтамед+ Дубки' => 'ООО «Дубки-Альтамед»',
        'Альтамед+ Верхне-Пролетарская' => 'OOO «Одинмед+»'
    ];

   

    $pdf = new tFPDF();
    $pdf->AddPage();

    // Add a Unicode font (uses UTF-8)
    $pdf->AddFont('Tinos-Regular', '', 'Tinos-Regular.ttf', true);
    $pdf->AddFont('Tinos-Bold', '', 'Tinos-Bold.ttf', true);
    $pdf->AddFont('Tinos-Italic', '', 'Tinos-Italic.ttf', true);
    $pdf->SetFont('Tinos-Regular', '', 14);

    if($YORCL[$clBoss] == 'ООО «Дубки-Альтамед»'){

        $pdf->Cell(122, 10, "Генеральному директору", 0, 0, 'R');
        
        $pdf->SetFont('Tinos-Bold', '', 14);
        $pdf->Cell(58, 10,  $YORCL[$clBoss], 0, 1, 'R');
    }else{
        $pdf->Cell(138, 10, "Генеральному директору", 0, 0, 'R');
        $pdf->SetFont('Tinos-Bold', '', 14);
        $pdf->Cell(43, 10,  $YORCL[$clBoss], 0, 1, 'R');
    }

    $pdf->Cell(180, 3, str_replace("а", "ой", $NAMEBOS[$clBoss]), 0, 1, 'R');

    if (getDifference(new DateTime($date_B_Paz)) >= 18) {
        $pdf->Cell(180, 8, "от " . $namePaz, 0, 1, 'R');
    } else {
        $pdf->Cell(180, 8, "от " . $name, 0, 1, 'R');
    }
    $pdf->Cell(180, 4, "Эл., почта : " . $mail, 0, 1, 'R');
    $pdf->Cell(180, 8, "Телефон: " . $telefon, 0, 1, 'R');





    $pdf->SetFont('Tinos-Bold', '', 18);
    $pdf->Cell(200, 20, " ", 0, 1, 'C');
    $pdf->Cell(200, 20, "Заявление", 0, 1, 'C');

    $pdf->SetFont('Tinos-Bold', '', 14);
    $pdf->Cell(200, 0, "о выдаче справки об оплате оказанных медицинских услуг", 0, 1, 'C');

    $pdf->SetFont('Tinos-Regular', '', 14);
    $pdf->Cell(200, 10, " ", 0, 1, 'C');
    $pdf->Cell(170, 8, "Прошу предоставить справку об оплате оказанных медицинских услуг ", 0, 1, 'C');
    $pdf->Cell(5, 20, " ", 0, 0, 'C');
    $pdf->Cell(21, 8, "пациенту ", 0, 0, 'L');

    $pdf->SetFont('Tinos-Bold', '', 14);
    $pdf->Cell(100, 8,  $namePaz . ", " . $date_B_Paz . " г.р.  ", 0, 1, 'L');

    $pdf->SetFont('Tinos-Regular', '', 14);
    $pdf->Cell(5, 20, " ", 0, 0, 'C');
    $pdf->Cell(8, 12, "за   " , 0, 0, 'L');
    $pdf->SetFont('Tinos-Bold', '', 14);
    $pdf->Cell(30, 12, $YearNalog , 0, 0, 'L');
    $pdf->SetFont('Tinos-Regular', '', 14);
    $pdf->Cell(50, 12, "                      год/годы", 0, 1, 'L');

    $pdf->Cell(5, 20, " ", 0, 0, 'C');
    $pdf->Cell(200, 8, "для предоставления в налоговые органы РФ (необходимые документы прилагаю).", 0, 1, 'L');

    if ($rod) {
        $pdf->Cell(5, 20, " ", 0, 0, 'C');
        $pdf->Cell(200, 8, "Справку для получения налогового вычета сформировать на имя ", 0, 1, 'L');
        $pdf->Cell(5, 20, " ", 0, 0, 'C');
        $pdf->SetFont('Tinos-Bold', '', 14);
        $pdf->Cell(200, 8, $name . ", ИНН " . $INN, 0, 1, 'L');
        $pdf->SetFont('Tinos-Regular', '', 14);
    } else {

        $pdf->Cell(5, 20, " ", 0, 0, 'C');
        $pdf->SetFont('Tinos-Bold', '', 14);
        $pdf->Cell(200, 8, "ИНН " . $INN, 0, 1, 'L');
        $pdf->SetFont('Tinos-Regular', '', 14);
    }

    $pdf->Cell(200, 10, " ", 0, 1, 'C');
    $pdf->Cell(5, 20, " ", 0, 0, 'C');
    $pdf->Cell(78, 8,  "Справку прошу передать в клинику ", 0, 0, 'L');
    // $pdf->SetFont('Tinos-Bold', '', 14);
    $pdf->Cell(50, 8,  $Clinic . ".", 0, 1, 'L');

    $pdf->Cell(200, 10, " ", 0, 1, 'C');
    $pdf->SetFont('Tinos-Italic', '', 14);
    $pdf->Cell(5, 20, " ", 0, 0, 'C');
    $pdf->Cell(200, 8,  "Запрашивая справку в целях получения налогового вычета на лечение ", 0, 1, 'L');
    $pdf->Cell(5, 20, " ", 0, 0, 'C');
    $pdf->Cell(200, 8,  "ребенка в возрасте от 18 до 24 лет, настоящим гарантирую, что ребенок  ", 0, 1, 'L');
    $pdf->Cell(5, 20, " ", 0, 0, 'C');
    $pdf->Cell(200, 8,  "является обучающимся по очной форме обучения в организации, ", 0, 1, 'L');
    $pdf->Cell(5, 20, " ", 0, 0, 'C');
    $pdf->Cell(200, 8,  "осуществляющей образовательную деятельность. ", 0, 1, 'L');


    $pdf->SetFont('Tinos-Regular', '', 14);
    $pdf->Cell(200, 10, " ", 0, 1, 'C');
    $pdf->Cell(5, 20, " ", 0, 0, 'C');

    if (getDifference(new DateTime($date_B_Paz)) >= 18) {
        $pdf->Cell(200, 8,  "Ф.И.О. " . $namePaz, 0, 1, 'L');
    } else {
        $pdf->Cell(200, 8,  "Ф.И.О. " . $name, 0, 1, 'L');
    }





    $pdf->Cell(5, 20, " ", 0, 0, 'C');
    $pdf->Cell(200, 8,  "Дата " . date('d.m.Y'), 0, 1, 'L');
    $pdf->Cell(5, 20, " ", 0, 0, 'C');
    $pdf->Cell(200, 8,  "Подпись ___________", 0, 1, 'L');
    $namefile = uniqid();
    if (!is_dir('../sample')) mkdir('../sample', 0777, true);
    $pdf->Output("F", "../sample/".$namefile.".pdf");
    return  $namefile.".pdf";
}




function sample_no_clinic( $clinic, $dateNalog, $Number, $dateZayvki, $path){
    
    $NAMEBOS = [
        'Альтамед+ на Союзной' => 'Гребцова И.Б.',
        'Альтамед+ на Комсомольской' => 'Гребцова И.Б.',
        'Альтамед+ на Неделина' => 'Гребцова Г.М.',
        'Альтамед+ Дубки' => 'Гребцова И.Б.',
        'Альтамед+ Верхне-Пролетарская' => 'Гребцова Г.М.'
    ];

    $YORCL = [
        'Альтамед+ на Союзной' => 'OOO «Альтамед+»',
        'Альтамед+ на Комсомольской' => 'OOO «Одинмед»',
        'Альтамед+ на Неделина' => 'OOO «Одинмед+»',
        'Альтамед+ Дубки' => 'ООО «Дубки-Альтамед»',
        'Альтамед+ Верхне-Пролетарская' => 'OOO «Одинмед+»'
    ];

    $ADDRESS = [
        'Альтамед+ на Союзной' => 'г.Одинцово, ул.Союзная, д. 32Б',
        'Альтамед+ на Комсомольской' => 'г.Одинцово, ул.Комсомольская, д.16, корп.3.',
        'Альтамед+ на Неделина' => 'г.Одинцово, ул.Маршала Неделина, д.9',
        'Альтамед+ Дубки' => 'Одинцовский р-н, пос. ВНИИССОК (Дубки), ул.Рябиновая, дом 2',
        'Альтамед+ Верхне-Пролетарская' => 'г.Одинцово, ул.Верхне-Пролетарская, д.35'
    ];

    $PRINT = [
        'Альтамед+ на Союзной' =>[
            'PRINT'=>'./images/Altamed.png',
            'SING'=> './images/sing.png',
            'HEADER'=> './images/header_a.jpg'
        ],
        'Альтамед+ на Комсомольской' => 
        [
            'PRINT'=>'./images/odinmed.png',
            'SING'=> './images/sing.png',
            'HEADER'=> './images/header_o.jpg'
        ],
        'Альтамед+ на Неделина' => [
            'PRINT'=> './images/odinmedplus.png',
            'SING'=> './images/sing.png',
            'HEADER'=> './images/header_n.jpg'
        ],
        'Альтамед+ Дубки' => 
        [
            'PRINT'=> './images/dubki.png',
            'SING' => './images/sing.png',
            'HEADER'=> './images/header_d.jpg'
        ],
        'Альтамед+ Верхне-Пролетарская' =>   [
            'PRINT'=> './images/odinmedplus.png',
            'SING' => './images/sing.png',
            'HEADER'=> './images/header_n.jpg'
        ],
    ];

   

    $pdf = new tFPDF();
    $pdf->AddPage();
    $pdf->Image($PRINT[$clinic]['HEADER'], 0, 3, 213, 32);

    // Add a Unicode font (uses UTF-8)
    $pdf->AddFont('Tinos-Regular', '', 'Tinos-Regular.ttf', true);
    $pdf->AddFont('Tinos-Bold', '', 'Tinos-Bold.ttf', true);
    $pdf->AddFont('Tinos-Italic', '', 'Tinos-Italic.ttf', true);
    // $pdf->SetFont('Tinos-Regular', '', 14);

    $pdf->SetFont('Tinos-Bold', '', 14);
    $pdf->Cell(200, 55, " ", 0, 1, 'C');
    $pdf->Cell(10, 10, "", 0, 0, 'L');
    
    $pdf->Cell(200, 10, "СПРАВКА", 0, 1, 'C');
    
    $pdf->SetFont('Tinos-Regular', '', 14);
    $pdf->Cell(10, 10, "", 0, 0, 'L');
    $pdf->Cell(200, 10, "Рассмотрев ваше обращение № ".$Number." от ".$dateZayvki."  заявляем, что платные медицинские ", 0, 1, 'L');
    $pdf->Cell(10, 10, "", 0, 0, 'L');
    $pdf->Cell(200, 10, "услуги за ".$dateNalog. " г. в медицинском центре ".$YORCL[$clinic]. " по адресу", 0, 1, 'L');
    $pdf->Cell(10, 10, "", 0, 0, 'L');
    $pdf->Cell(200, 10,  $ADDRESS[$clinic]." не оказывались.", 0, 1, 'L');
    $pdf->Cell(200, 20, "", 0, 1, 'L');
    $pdf->Cell(10, 10, "", 0, 0, 'L');
    $pdf->Cell(200, 10, "Генеральный директор  ".$YORCL[$clinic], 0, 1, 'L');
    $pdf->Cell(10, 10, "", 0, 0, 'L');
    $pdf->Cell(200, 10, $NAMEBOS[$clinic].'                       ' . date('d.m.Y'), 0, 1, 'L');
    // $pdf->Cell(200, 10, , 0, 1, 'R');
    $pdf->Image( $PRINT[$clinic]['PRINT'], 125, 115, 50, 50);
    $pdf->Image($PRINT[$clinic]['SING'], 140, 120, 20, 20);
    // $pdf->Cell(10, 10, "", 0, 1, 'R');
    $path = $path.uniqid().'_Не_посещал.pdf';
    $pdf->Output("F", $path);
    // $pdf->Output("I", 'test.pdf');
    return $path;
}


// sample_no_clinic(
//     "Альтамед+ на Союзной",
//     "2023",
//     "155",
//     "04.04.2024",
//     "./document/"
// );

// sample("Лашина Александра Александровича", 
//  "lachin@gmail.com",
//  "79775956853",
//  "Лашин Александр Леонидович",
//  "09.04.1963",
//  "2023",
//  "56577473767",
//  true,
//  "Альтамед+ на Союзной"
// );

// Дата рождения
function getDifference(DateTime $startDate)
{
    $currentDate = new DateTime();
    $Diff = $currentDate->diff($startDate);
    return $Diff->y;
}

?>

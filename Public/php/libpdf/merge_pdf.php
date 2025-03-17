<?php


require_once('fpdf.php');
// require('./vendor/setasign/fpdi/src/autoload.php');
// function marge($files, $pathOut){
//     $pdf = new FPDI();
//     foreach ($files as $file) {
//         $pageCount = $pdf->setSourceFile($file);
//         for ($i = 0; $i < $pageCount; $i++) {

//             $tpl = $pdf->importPage($i + 1, '/MediaBox');
//             $pdf->addPage();
//             if($i == $pageCount - 1) $pdf->Image('Altamed.png', 140, 200, 50, 50, 'PNG' );
//             $pdf->useTemplate($tpl);
//         }
//     }
//     $pdf->Output('F', $pathOut);
// }
// $files = ['../licenses/odinmedplus.pdf'];
// marge($files, 'res.pdf');
require_once("fpdf.php");
class pdf extends Fpdf
{
    function __construct()
    {
        parent::FPDF();
    }
}
// $pdf = new FPDF('P', 'mm', 'A4');
$pdf->AddPage();
$pdf->SetFont('', 'B', 16);
$pdf->Cell(40, 10, 'Hello World !', 1);
$pdf->Cell(60, 10, 'Powered by FPDF.', 0, 1, 'C');
$pdf->Output();


?>
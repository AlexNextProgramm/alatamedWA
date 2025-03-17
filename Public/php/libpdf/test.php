<?php


// require_once('./php/libpdf/fpdf.php');
// require_once('./php/libpdf/vendor/setasign/fpdi/src/autoload.php');
require('./php/libpdf/fpdf.php');
require('./php/libpdf/vendor/setasign/fpdi/src/autoload.php');
$files = [
    // "./document/65fd9201416e8_ШАМОВА.pdf",
    // "./document/65fd92011d208_шамова_1.pdf",
    // "./document/65fc60d1b5afa_шамова_договор.pdf",
    // "./document/65fc5b741f5dc_шамова_справка.pdf"
    "./php/licenses/Altamed.pdf",
    "./php/licenses/dubki.pdf"

];

$pdf = new FPDI();

// foreach ($files as $file) {
//     $pageCount = $pdf->setSourceFile($file);
//     for ($i = 0; $i < $pageCount; $i++) {
//         $tpl = $pdf->importPage($i + 1, '/MediaBox');
//         $pdf->addPage();
//         $pdf->useTemplate($tpl);
//     }

//     // if ($pageCount % 2 != 0) {
//     //     $pdf->setSourceFile('./licenses/1.pdf');
//     //     $tpl = $pdf->importPage(1, '/MediaBox');
//     //     $pdf->addPage();
//     //     $pdf->useTemplate($tpl);
//     // }
// }

// $pdf->Output('F', './test.pdf');

print_r($files);

?>
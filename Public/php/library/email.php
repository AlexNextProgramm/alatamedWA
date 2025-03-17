<?php
 function sendMail($email, $message, $subject)
 {
     $to  = $email;      
     $subject = '=?utf-8?b?'. base64_encode($subject) .'?=';
     $fromMail = 'info@service-live.ru';
     $fromName = 'service-live.ru';
     $date = date(DATE_RFC2822);
     $messageId='<'.time().'-'.md5($fromMail.$to).'@'.$_SERVER['SERVER_NAME'].'>';
     $headers  = 'MIME-Version: 1.0' . "\r\n";
     $headers .= "Content-type: text/html; charset=utf-8". "\r\n";
     $headers .= "From: ". $fromName ." <". $fromMail ."> \r\n";
     $headers .= "Date: ". $date ." \r\n";
     $headers .= "Message-ID: ". $messageId ." \r\n";
    //  return mail($to, $subject, $message, $headers); 
 }
?>
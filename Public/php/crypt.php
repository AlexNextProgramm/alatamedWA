<?php 
// echo hash('sha256', '23051991G');



const KEY = 'e1oX//YN6MhqdcNhXhlUfqgUmOBXpl0b1ao3M0aZMDnu2AIHaeMxacD0nfEWaJARSyNCDhpqWpr+86bo0Yc5YEcO+lmNugOyUrUyI9ehCULnP6QfOGWEOOn+kVzLiCObca/EaKsjMAfA0owDbIYA6amNLtjZzZA8wssVhtvRvBI9X2rzpEkimN42/4k7BdKJ';
$key = '';
const cryptMethod = 'AES-128-CBC';
const hachAlgoritm = 'sha256';
const hashLength = 32;



function encrypt($str){
        $ivlen = openssl_cipher_iv_length(cryptMethod);
        $iv = openssl_random_pseudo_bytes($ivlen);
        $cipherText = openssl_encrypt($str, cryptMethod, KEY, OPENSSL_RAW_DATA, $iv );
        $hmac = hash_hmac(hachAlgoritm, $cipherText, KEY ,true);
        return base64_encode($iv.$hmac.$cipherText);
}



function decrypt($str){
        if(strlen($str) >= 16){
        $crypt_str_all = base64_decode($str);
        $ivlen = openssl_cipher_iv_length(cryptMethod);
        $iv = substr($crypt_str_all, 0,  $ivlen);
        $hmac = substr($crypt_str_all, $ivlen, hashLength);
        $ciphertext_raw = substr($crypt_str_all, $ivlen+hashLength);
        $original_plaintext = openssl_decrypt($ciphertext_raw, cryptMethod, KEY, OPENSSL_RAW_DATA, $iv);
        $calcmac = hash_hmac(hachAlgoritm, $ciphertext_raw, KEY, true);
        // echo $original_plaintext;
        if(hash_equals($hmac, $calcmac)) return $original_plaintext;
        return false;
        }else{
                return false;
        }
    }

        function url_decrypt($str){
                        $string =  str_replace(" ", "+", urldecode($str));
                        return urldecode(decrypt($string));
        }

        function url_encrypt($str){
                        return encrypt(urlencode($str));
                }


                
        if(error_get_last()){
                $Arr =  error_get_last(); // получаем массив ошбки
                $f =  fopen("log_error.txt", "a+"); //открываем файл для записи курсов в конце на новой строке
                                        // вписывам когда  в каком файле на какой строке и что произошло 
                fwrite($f, '>>> TIME: '.date('d.m.Y H:i:s').' FILE: '.$Arr['file']." LINE: ".$Arr['line'].' ERROR: '.$Arr['message']."\n");
                fclose($f); // закрваем файл
        }

?>

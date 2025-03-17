<?php
namespace Router;

class Router{

    static function get($key = null, $arg = null){
        if(!$key || !$arg ) return "Not router parametr"; 
        if(array_key_exists($key, $_GET)){
                Router::isJson($_GET[$key]) ? $arg(array($_GET[$key])) : $arg($_GET[$key]);
        }
    }

    static function post($key = null, $arg = null)
    {
        if (!$key || !$arg) return "Not router parametr";
        if (array_key_exists($key, $_POST)) {
            Router::isJson($_POST[$key]) ? $arg(json_decode($_POST[$key])) : $arg(array($_POST[$key]));
        }
    }

    static function files($key = null, $arg = null)
    {
        if (!$key || !$arg) return "Not router parametr";
        if (array_key_exists($key, $_FILES)) {
           $arg($_FILES[$key]); 
        }
    }

    static function isJson(string $data):bool{
        json_decode($data, true);
        return json_last_error() == JSON_ERROR_NONE;
    }
}
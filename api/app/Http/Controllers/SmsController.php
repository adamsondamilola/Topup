<?php

namespace App\Http\Controllers;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class SmsController extends Controller
{
    public function sendSms($from, $to, $msg)
    {
        $smsGateWay = "https://account.kudisms.net/api/";
        $username = "adamsondamilola@gmail.com";
        $password = "secuRED123@";
        $apiUrl = $smsGateWay."?username=".$username."&password=".$password."&message=".$msg."&sender=".$from."&mobiles=234".ltrim($to, $to[0]);

try {
    $service_url = $apiUrl;
    $curl            = curl_init($service_url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_POST, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    $curl_response   = curl_exec($curl);
    curl_close($curl);
    $json_objekat  = json_decode($curl_response);
    $data          = $json_objekat->data->status;

    if($data == "OK"){
    return true;
    }else{
    return false;
    }
} catch (\Throwable $th) {
    //throw $th;
    return false;
}

    }
}

<?php

namespace App\Http\Controllers\Api\V1;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\SmsController;


class RemLoanLendSquareController extends Controller
{

    public function sendSms($from, $to, $msg)
    {
        //$mailer = new SmsController;
        //$mailer->sendSms($from, $to, $msg);

                $smsGateWay = "https://account.kudisms.net/api/";
        $username = "adamsondamilola@gmail.com";
        $password = "secuRED123@";
        $apiUrl = $smsGateWay."?username=".$username."&password=".$password."&message=".$msg."&sender=".$from."&mobiles=234".ltrim($to, $to[0]);

try {
    $data = "";
    $service_url = $apiUrl;
    $curl            = curl_init($service_url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_POST, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    $get_data = file_get_contents($apiUrl);
    //$curl_response   = curl_exec($curl);
    //curl_close($curl);
    $json_objekat  = json_decode($get_data);
    $data          = $json_objekat;

    if($data->status == "OK"){
    return true;
    }else{
    return false; //$data->error ;
    }
} catch (\Throwable $th) {
    //throw $th;
    return false;
}

    }

public function remErrorLogs(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'error' => 'required|string',
            'device' => 'required|string',
            'channel' => 'required|string'
        ]);

        $insert_data =  DB::insert('insert into rem_error_logs (
            error,
            device,
            channel
            )
            values (?, ?, ?)',[
                $request->error,
                $request->device,
                $request->channel
        ]);

        if($insert_data){
$status=1;
$message = "Error message saved!";
}
else{
    $message = "An error occurred, please try again.";
}

    }

    public function onboardNewUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'device' => 'required|string'
        ]);


date_default_timezone_set("Africa/Lagos");
//return "The time in " . date_default_timezone_get() . " is " . date("H:i:s");
$currentHour = date("H");

        $status=0;
        $message="";
        $phone = $request->phone;
        $otp = rand(00000,99999); //Str::random(5);
        $ifPhoneExists = DB::table('rem_users')
        ->Where('phone', $phone)
        ->count();
/*
        if((int)$currentHour < 8){
    $message = "Sorry, new users can not sign up at this time, kindly try again between 8:05AM and 6:30PM.";
}
        else if((int)$currentHour > 18){
    $message = "Sorry, new users can not sign up at this time, kindly try again between 8:05AM and 6:30PM.";
}*/

        if($phone == ""){
            $message = "Please, enter phone number";
            }
            else if($phone[0] != "0"){
                $message = "Phone number should start with 0";
                }
                else if(strlen($phone) <> 11){
                $message = "Invalid hone number format";
                }
                else if(!is_numeric($phone)){
                    $message = "Phone number not valid";
                    }
else{

//send otp
/*$sendOtp = $this->sendSms("eLaundry", $phone, "You are welcome onboard. Kindly use ".$otp." to proceed with your onboarding.");
if($sendOtp == false){
    $message = "An error occurred, please try again.";
}*/
// if($ifPhoneExists < 1){
        $insert_data =  DB::insert('insert into rem_users (
            phone,
            device,
            otp
            )
            values (?, ?, ?)',[
                $phone,
                $request->device,
                $otp
        ]);
if($insert_data){
$status=1;
$message = "To get your OTP, please send the word OTP to +2349032323684 from your WhatsApp or click the OPEN WHATSAPP button below. Kindly enter the OTP below to proceed.";
}
else{
    $message = "An error occurred, please try again.";
}
/* }
else{
    $message = "Phone number already in use or registered on another device.";
} */
}

//json response
if($status==0){
    return response()->json(['Status' => $status, 'Message' => $message], 401);
}
else{
    return response()->json(['Status' => $status, 'Message' => $message], 200);
}

    }

    public function verifyPhoneNumber(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'otp' => 'required|string'
        ]);

        $status=0;
        $message="";

        $ifOTPIsCorrect = DB::table('rem_users')
        ->Where('phone', $request->phone)
        ->Where('otp', $request->otp)
        ->count();

        if($ifOTPIsCorrect > 0){
          $update = DB::update('update rem_users set otp = ? where phone = ?',['', $request->phone]);
        if($update){
        $status=1;
        $message = "Phone number verified!";
        }
        else
        {
        $message = "An error occured, please try again.";
        }
        }
        else
        {
        $message = "Wrong OTP.";
        }


//json response
if($status==0){
    return response()->json(['Status' => $status, 'Message' => $message], 401);
}
else{
    return response()->json(['Status' => $status, 'Message' => $message], 200);
}
    }

    public function saveNewUserLocation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'latitude' => 'required|double',
            'longitude' => 'required|double'
        ]);

        $status=0;
        $message="";

        $phone = $request->phone;
        $latitude = $request->latitude;
        $longitude = $request->longitude;

        if($latitude == "" || $longitude == ""){
        $message = "Location not found. Please try again.";
        }
        else if($phone == ""){
        $message = "Phone number not found!";
        }
        /*else if($validator->fails()){
            $message = "Application error. Please try again.";
        }*/
        else{

            $user = DB::table('rem_users')
            ->Where('phone', $request->phone)
            ->orderBy('id', 'desc')
           ->first();

        $update = DB::update('update rem_users set latitude = ?, longitude = ? where id = ?',[$request->latitude, $request->longitude, $user->id]);
        if($update){
        $status=1;
        $message = "Location updated!";
        }
        else if($user->latitude == $request->latitude){
            $status=1;
        $message = "Location already updated!";
        }
        else{
        $message = "Location update failed, please try again. ";
        }
        }



//json response
if($status==0){
    return response()->json(['Status' => $status, 'Message' => $message], 401);
}
else{
    return response()->json(['Status' => $status, 'Message' => $message], 200);
}
    }

    public function saveNewUserContacts(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'contacts' => 'required|string'
        ]);

        $status=0;
        $message="";


$user = DB::table('rem_users')
    ->Where('phone', $request->phone)
    ->orderBy('id', 'desc')
   ->first();

        $update = DB::update('update rem_users set contacts = ? where id = ?',[$request->contacts, $user->id]);
        if($update){
        $status=1;
        $message = "Contact updated!";
        }
        else if($user->contacts == $request->contacts){
            $status=1;
        $message = "Contact already updated!";
        }
        else
        {
        $message = "An error occured, please try again.";
        }
//json response
if($status==0){
    return response()->json(['Status' => $status, 'Message' => $message], 401);
}
else{
    return response()->json(['Status' => $status, 'Message' => $message], 200);
}
    }


}

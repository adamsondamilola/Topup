<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;


class MonnifyController extends Controller
{

    public function login(Request $request)
    {

        $token_check = 1;
        if($token_check != 0)
        {
        $api_keys = DB::table('api_keys')
        ->Where('api_provider', 'monnify')
        ->first();

//$apiurl="https://sandbox.monnify.com/api/v1";
$apiurl=$api_keys->end_point;

        $url = $apiurl."/auth/login/";

        $login = $api_keys->public_key;
$password = $api_keys->api_secret_key;

$curl = curl_init();
curl_setopt_array($curl, array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_HTTPHEADER => array(
    "Content-Type: application/json",
    "Authorization: Basic ".base64_encode($login.":".$password)
    ),
    ));

$response = curl_exec($curl);
$json_obj   = json_decode($response);
// Close cURL session
curl_close($curl);
//return response()->json(['status' => 1, 'message' => $json_obj], 200);
if($json_obj == null){
    return response()->json(['status' => 0, 'message' => "An error occured", 'token' => ""], 401);
}
else if($json_obj->responseMessage == "success"){
    return response()->json(['status' => 1, 'message' => "Successful", 'token' => $json_obj->responseBody->accessToken], 200);
}else{
    return response()->json(['status' => 0, 'message' => "Access Denied!", "Error" =>$json_obj, 'token' => ""], 401);
}

    }

    }

    public function reserveAccount(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'email' => 'required|string',
            'token' => 'required|string'
        ]);

        $user = DB::table('users')
        ->Where('username', $request->username)
        ->first();

        $monnify = DB::table('monnify')
        ->Where('username', $request->username)
        ->count();

       if($monnify < 1)
        {
        $api_keys = DB::table('api_keys')
        ->Where('api_provider', 'monnify')
        ->first();

        $apiurl=$api_keys->end_point;

        $url = $apiurl."/bank-transfer/reserved-accounts";

        $login = $api_keys->public_key;
        $password = $api_keys->api_secret_key;

        $data = [
            "accountReference" => Str::random(25),
	"accountName" => $user->first_name.' '.$user->last_name,
	"currencyCode" => "NGN",
	"contractCode" => $api_keys->contract_code,
	"customerEmail" => $request->email,
//	"bvn" => $api_keys->bvn,
	"customerName" => $user->first_name.' '.$user->last_name,
//	"getAllAvailableBanks" => true
        ];

// Initializes a new cURL session
$curl = curl_init($url);
// Set the CURLOPT_RETURNTRANSFER option to true
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
// Set the CURLOPT_POST option to true for POST request
curl_setopt($curl, CURLOPT_POST, true);
// Set the request data as JSON using json_encode function
curl_setopt($curl, CURLOPT_POSTFIELDS,  json_encode($data));
// Set custom headers for RapidAPI Auth and Content-Type header
curl_setopt($curl, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer '.$request->token
  ]);
// Execute cURL request with all previous settings
$response = curl_exec($curl);
$json_obj   = json_decode($response);
              //$response = $json_obj->status;
// Close cURL session
curl_close($curl);

//return response()->json(['status' => 1, 'message' => $json_obj], 200);

if($json_obj == null){
    return response()->json(['status' => 0, 'message' => "Access Denied!"], 401);
}

else if($json_obj->responseMessage == "success"){

    DB::insert('insert into monnify (
        username,
        bank_name,
        bank_code,
        account_name,
        account_number,
        account_reference
        )
    values (?, ?, ?, ?, ?, ?)', [
        $request->username,
        $json_obj->responseBody->bankName,
        $json_obj->responseBody->bankCode,
        $json_obj->responseBody->customerName,
        $json_obj->responseBody->accountNumber,
        $json_obj->responseBody->accountReference,

    ]);

    return response()->json(['status' => 1, 'message' => "Account Created!"], 200);
}
else{
    return response()->json(['status' => 0, 'message' => "Access Denied!", "Error" => $json_obj], 401);
}

    }
    else{
        return response()->json(['status' => 0, 'message' => "Account already created!"], 401);
    }

    }

    public function successful_transfer_webhook(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'eventType' => 'required|string',
            'eventData' => 'nullable|json'
        ]);

//return response()->json(['status' => 0, 'request' => $request->eventData["amount"]], 401);
if($request->eventType){
$amount=0;
//$isFlaged = $eventData->flagged;
$amount = $request->eventData["amountPaid"];
$transactionRef = $request->eventData["transactionReference"];
$transactionStatus=$request->eventData["paymentStatus"];
$email =$request->eventData["customer"]["email"];

$monnify_transactions_count = DB::table('monnify_transactions')
        ->Where('transaction_id', $transactionRef)
        ->Where('status', 1)
        ->count();

if($transactionStatus == "PAID" && $monnify_transactions_count < 1){

    $user = DB::table('users')
    ->Where('email', $email)
    ->first();

    $wallet = DB::table('wallet')
    ->Where('username', $user->username)
    ->first();

    $amount_removed = 50;

    if($amount <= $amount_removed){
        $amount = 0;
    }
    else{
        $amount = $amount - $amount_removed;
    }

    $total_balance = $wallet->total_balance + $amount;
    $main_balance = $wallet->main_wallet + $amount;
  $update_wallet = DB::update('update wallet set total_balance = ?, main_wallet = ?
    where username = ?',[$total_balance, $main_balance, $user->username]);

if($update_wallet){
    DB::insert('insert into monnify_transactions (
        username,
        email,
        transaction_id,
        type,
        amount,
        status
        )
    values (?, ?, ?, ?, ?, ?)', [
        $user->username,
        $email,
        $transactionRef,
        'Deposit',
        $amount,
        1
    ]);

    DB::insert('insert into transactions (
        username,
        transaction_id,
        type,
        amount,
        discount,
        status
        )
    values (?, ?, ?, ?, ?, ?)', [
        $user->username,
        $transactionRef,
        'Deposit',
        $amount,
        0,
        1
    ]);

    return response()->json(['status' => 1,
    'message' => 'Transaction Completed'], 200);

}else{
    return response()->json(['status' => 0,
    'message' => 'Transaction Failed'], 401);
}

}

}else{
    return response()->json(['status' => 0,
    'message' => 'No Request'], 401);
}
    }


    public function check_pending_transfer(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'user_reference' => 'required|string',
            'token' => 'required|string'
        ]);

        $api_keys = DB::table('api_keys')
        ->Where('api_provider', 'monnify')
        ->first();

        $service_url = $api_keys->end_point.'/bank-transfer/reserved-accounts/transactions?accountReference='.$request->user_reference.'&page=0&size=10';
        $curl = curl_init($service_url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer '.$request->token
          ]);
        $curl_response   = curl_exec($curl);
        curl_close($curl);
        $json_objekat    = json_decode($curl_response);
        $data  = $json_objekat;

if($data->responseMessage == "success"){

    $content = $data->responseBody->content[0];
$isFlaged = $content->flagged;
$fee = $content->fee;
$method = $content->paymentMethod;
$amount = $content->amountPaid;
$transactionRef = $content->transactionReference;
$transactionStatus=$content->paymentStatus;
$email =$content->customerEmail;
/*
$fee = $fee + 0.1;
$amount_removed = $fee/100;
$amount_removed = $amount * $amount_removed;
*/
$amount_removed = 50;

if($amount <= $amount_removed){
    $amount = 0;
}
else{
    $amount = $amount - $amount_removed;
}

$monnify_transactions_count = DB::table('monnify_transactions')
        ->Where('transaction_id', $transactionRef)
        ->Where('status', 1)
        ->count();

if($isFlaged){
    return response()->json(['status' => 0,
    'message' => 'Transaction Flagged'], 401);
}

        else if($transactionStatus == "PAID" && $monnify_transactions_count < 1){

            $user = DB::table('users')
            ->Where('email', $email)
            ->first();

            $wallet = DB::table('wallet')
            ->Where('username', $user->username)
            ->first();

            $total_balance = $wallet->total_balance + $amount;
            $main_balance = $wallet->main_wallet + $amount;
          $update_wallet = DB::update('update wallet set total_balance = ?, main_wallet = ?
            where username = ?',[$total_balance, $main_balance, $user->username]);

        if($update_wallet){
            DB::insert('insert into monnify_transactions (
                username,
                email,
                transaction_id,
                type,
                amount,
                status
                )
            values (?, ?, ?, ?, ?, ?)', [
                $user->username,
                $email,
                $transactionRef,
                'Deposit',
                $amount,
                1
            ]);

            DB::insert('insert into transactions (
                username,
                transaction_id,
                type,
                amount,
                discount,
                status
                )
            values (?, ?, ?, ?, ?, ?)', [
                $user->username,
                $transactionRef,
                'Deposit',
                $amount,
                0,
                1
            ]);

            return response()->json(['status' => 1,
            'message' => 'Transaction Completed'], 200);

        }else{
            return response()->json(['status' => 0,
            'message' => 'Transaction Failed'], 401);
        }

        }else{
            return response()->json(['status' => 0,
            'message' => "Transaction already checked or invalid"], 401);
        }

}else{
    return response()->json(['status' => 0,
    'message' => "No data"], 401);
}

    }


}

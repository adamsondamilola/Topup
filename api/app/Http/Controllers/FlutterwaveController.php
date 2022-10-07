<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;


class FlutterwaveController extends Controller
{


    public function reserveFlutterwaveAccount(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'email' => 'required|string',
            'phone' => 'required|string',
        ]);

        $user = DB::table('users')
        ->Where('username', $request->username)
        ->first();

        $request->phone = $user->phone;

        $monnify = DB::table('monnify')
        ->Where('username', $request->username)
        ->count();

        $flutterwave = DB::table('flutterwave_accounts')
        ->Where('username', $request->username)
        ->count();
/*
if($validator->fails()){
  //return $validator->errors();
            return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
        }*/
 if(!$user)
{
 return response()->json(['status' => 0, 'message' => "Username not found"], 401);
}
       else if($user && $monnify < 1 && $flutterwave < 1)
        {
        $api_keys = DB::table('api_keys')
        ->Where('api_provider', 'flutterwave')
        ->first();

        $apiurl=$api_keys->end_point;

        $url = $apiurl."/virtual-account-numbers";

        $password = $api_keys->api_secret_key;

        $fname = $user->first_name;
        $lname = $user->last_name;

        if($lname == null || $lname == "")
        {
          //$fname = "WhatsApp";
          $lname = "Topup";
        }

        $data = [
            "tx_ref" => Str::random(25),
  "email" => $request->email,
  "phonenumber" => $request->phone,
	"bvn" => $api_keys->bvn,
  "firstname" => $fname,
  "lastname" => $lname,
  "narration" => $fname.' '.$lname,
	"is_permanent" => true
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
    'Authorization: Bearer '.$password
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

else if($json_obj->status == "success"){

    DB::insert('insert into flutterwave_accounts (
        username,
        bank_name,
        bank_code,
        account_name,
        account_number,
        account_reference
        )
    values (?, ?, ?, ?, ?, ?)', [
        $request->username,
        $json_obj->data->bank_name,
        $json_obj->data->response_code,
        $fname.' '.$lname,
        $json_obj->data->account_number,
        $json_obj->data->order_ref,

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

    public function FlutterwaveSuccessfulTransferWebhook(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'event' => 'required|string',
            'data' => 'nullable|json'
        ]);

//return response()->json(['status' => 0, 'request' => $request->data["amount"]], 401);
if($request->data){
$amount=0;
//$isFlaged = $data->flagged;
$amount = $request->data["amount"];
$transactionRef = $request->data["tx_ref"];
$transactionStatus=$request->data["status"];
$email =$request->data["customer"]["email"];

$transactions_count = DB::table('flutterwave_accounts_transactions')
        ->Where('transaction_id', $transactionRef)
        ->Where('status', 1)
        ->count();

if($transactionStatus == "successful" && $transactions_count < 1){

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
    DB::insert('insert into flutterwave_accounts_transactions (
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


}

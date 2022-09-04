<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Http\Controllers\EncryptController;

class AirtimeRechargeController extends Controller
{

  public function check_login_token($login_token){
      $token_check = DB::table('login_logs')
      ->Where('login_token', $login_token)
      ->Where('is_token_valid', 1)->first();
      if(!$token_check)
      {
          return 0;
      }
      else
      {
          return $token_check->user_id;
      }
  }

    public function verify_input(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'network' => 'required|string',
            'amount' => 'required|numeric',
            'phone' => 'required|string|min:7',
            'username' => 'required|string'
        ]);

        $network = $request->network;
        $amount = $request->amount;

        if(!is_numeric($request->phone)){
            return response()->json(['status' => 0, 'message' => 'Phone number must be in digits.'], 401);
        }
        if(!is_numeric($request->amount)){
            return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
        }
        else if($request->phone[0] != 0){
            return response()->json(['status' => 0, 'message' => 'Phone number must start with zero (0).'], 401);
        }
        else if(strlen($request->phone) < 11){
            return response()->json(['status' => 0, 'message' => 'Phone number too short.'], 401);
        }
        else if(strlen($request->phone) > 11){
            return response()->json(['status' => 0, 'message' => 'Phone number too long.'], 401);
        }
        else if($amount < 50){
            return response()->json(['status' => 0, 'message' => 'Amount is too low.'], 401);
        }
        else if($network == null){
            return response()->json(['status' => 0, 'message' => 'No service selected.'], 401);
        }
        else if($validator->fails()){
  //return $validator->errors();
            return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
        }
        else
        {

            $commission = 0.0;
            $cash_back=0.0;
            $purchase_cost=0.0;

/*
            $user_pack = DB::table('transactions')
            ->Where('username', $request->username)
            ->Where('type', 'Package')
            ->Where('status', 1)
            ->first(); */

            $user_pack = DB::table('users')
            ->Where('username', $request->username)
            //->Where('package', '!=', 'Free Account')
            //->Where('package_status', 1)
            ->first();

            if($user_pack)
{

                    $settings = [];
                    if($user_pack->package_status == 1){
                        $settings = DB::table('network_commission')
                        ->Where('id', 1)
                        ->first();
                    }
                    else
                    {
                        $settings = DB::table('free_users_network_commission')
                        ->Where('id', 1)
                        ->first();
                    }

                    if($network == "mtn_custom"){
                        $commission = $settings->mtn_airtime;
                        }else{
                            if(str_contains($network, "mtn")){
                                $commission = $settings->mtn_data;
                                }
                        }

                        if($network == "glo_custom"){
                            $commission = $settings->glo_airtime;
                            }else{
                                if(str_contains($network, "glo")){
                                    $commission = $settings->glo_data;
                                    }
                            }

                            if($network == "airtel_custom"){
                                $commission = $settings->airtel_airtime;
                                }else{
                                    if(str_contains($network, "airtel")){
                                        $commission = $settings->airtel_data;
                                        }
                                }

                                if($network == "9mobile_custom"){
                                    $commission = $settings->nmobile_airtime;
                                    }else{
                                        if(str_contains($network, "9mobile")){
                                            $commission = $settings->nmobile_data;
                                            }
                                    }

                                    if(str_contains($network, "data_share")){
                                        $commission = $settings->mtn_data_share;
                                        }

                                    if($commission > 0){
            $convert = $commission/100;
            $cash_back = $amount * $convert;
            $purchase_cost = $amount - $cash_back;
                                    }

}

return response()->json(['status' => 1, 'message' => 'Details OK.',
            'amount' => $amount,
            'commission' => $commission,
            'cash_back' => $cash_back,
            'purchase_cost' => $purchase_cost], 200);

        }
    }


    public function verify_airtime_input(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'network' => 'required|string',
            'amount' => 'required|numeric',
            'network_code' => 'required|numeric',
            'username' => 'required|string'
        ]);

        $network = $request->network;
        $amount = $request->amount;

        if(!is_numeric($request->amount)){
            return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
        }
        else if(strlen($request->network_code) < 1 || strlen($request->network) < 1 ){
            return response()->json(['status' => 0, 'message' => 'Please, select a network.'], 401);
        }
        else if($amount < 100){
            return response()->json(['status' => 0, 'message' => 'Amount is too low.'], 401);
        }
        else if($amount > 500){
            return response()->json(['status' => 0, 'message' => 'Amount is too high.'], 401);
        }
        else if($network == null){
            return response()->json(['status' => 0, 'message' => 'No service selected.'], 401);
        }
        else if($validator->fails()){
    //return $validator->errors();
            return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
        }
        else
        {

            $commission = 0.0;
            $cash_back=0.0;
            $purchase_cost=0.0;

/*
            $user_pack = DB::table('transactions')
            ->Where('username', $request->username)
            ->Where('type', 'Package')
            ->Where('status', 1)
            ->first(); */

            $user_pack = DB::table('users')
            ->Where('username', $request->username)
            //->Where('package', '!=', 'Free Account')
            //->Where('package_status', 1)
            ->first();

            if($user_pack)
    {
                   // $commission = [];
                    if($user_pack->package_status == 1){
                        $commission = DB::table('airtime_print_commission')
                        ->Where('id', 1)
                        ->first();
                    }
                    else
                    {
                        $commission = DB::table('free_users_airtime_print_commission')
                        ->Where('id', 1)
                        ->first();
                    }


                    if($network == "MTN"){
                        $commission = $commission->mtn;
                        }

                        if($network == "GLO"){
                            $commission = $commission->glo;
                            }

                            if($network == "AIRTEL"){
                                $commission = $commission->airtel;
                                }

                                if($network == "9MOBILE"){
                                    $commission = $commission->nmobile;
                                    }

                                    if($commission > 0){
            $convert = $commission/100;
            $cash_back = $amount * $convert;
            $purchase_cost = $amount - $cash_back;
                                    }

    }


    return response()->json(['status' => 1, 'message' => 'Details OK.',
                'amount' => $amount,
                'commission' => $commission,
                'cash_back' => $cash_back,
                'purchase_cost' => $purchase_cost], 200);

            }
        }


    public function buy_airtime(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'network' => 'required|string',
            'amount' => 'required|numeric',
            'phone' => 'required|string|min:7',
            'pin' => 'required|numeric',
            'username' => 'required|string',
        ]);

        $network = $request->network;
        $amount = $request->amount;

        $checkWallet = DB::table('wallet')
        ->Where('username', $request->username)
        ->first();

//get pin
$getPin = DB::table('users')
            ->where('status', 1)
            ->where('username', $request->username)
            ->value('pin');


        if(!is_numeric($request->phone)){
            return response()->json(['status' => 0, 'message' => 'Phone number must be in digits.'], 401);
        }
        else if(!is_numeric($request->amount)){
            return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
        }
        else if($request->amount > $checkWallet->main_wallet){
            return response()->json(['status' => 0, 'message' => 'Amount is beyond the amount in main wallet. Add fund to continue with transaction.'], 401);
        }
        else if(!is_numeric($request->amount)){
            return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
        }
        else if($request->phone[0] != 0){
            return response()->json(['status' => 0, 'message' => 'Phone number must start with zero (0).'], 401);
        }
        else if(strlen($request->phone) < 11){
            return response()->json(['status' => 0, 'message' => 'Phone number too short.'], 401);
        }
        else if(strlen($request->phone) > 11){
            return response()->json(['status' => 0, 'message' => 'Phone number too long.'], 401);
        }
        else if($amount < 50){
            return response()->json(['status' => 0, 'message' => 'Amount is too low.'], 401);
        }
        else if($network == null){
            return response()->json(['status' => 0, 'message' => 'No service selected.'], 401);
        }
else if(!(Hash::check($request->pin, $getPin))){
    return response()->json(['status' => 0, 'message' => 'Incorrect PIN.'], 401);
}
        else if($validator->fails()){
  //return $validator->errors();
            return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
        }
        else
        {
            $commission = 0.0;
            $cash_back=0.0;
            $purchase_cost=0.0;

            /*$user_pack = DB::table('transactions')
            ->Where('username', $request->username)
            ->Where('type', 'Package')
            ->Where('status', 1)
            ->first();*/
            $user_pack = DB::table('users')
            ->Where('username', $request->username)
            //->Where('package', '!=', 'Free Account')
            //->Where('package_status', 1)
            ->first();

            $api_keys = DB::table('api_keys')
                      ->Where('api_provider', 'toprecharge')
                      ->first();

            if($user_pack)
{

    $settings = [];
    if($user_pack->package_status == 1){
        $settings = DB::table('network_commission')
        ->Where('id', 1)
        ->first();
    }
    else
    {
        $settings = DB::table('free_users_network_commission')
        ->Where('id', 1)
        ->first();
    }

                    if($network == "mtn_custom"){
                        $commission = $settings->mtn_airtime;
                        }

                        if($network == "glo_custom"){
                            $commission = $settings->glo_airtime;
                            }

                            if($network == "airtel_custom"){
                                $commission = $settings->airtel_airtime;
                                }

                                if($network == "9mobile_custom"){
                                    $commission = $settings->nmobile_airtime;
                                    }


                                    if($commission > 0){
            $convert = $commission/100;
            $cash_back = $amount * $convert;
            $purchase_cost = $amount - $cash_back;
                                    }

}

//Load recharge card
$service_url     = $api_keys->end_point.'/airtime/?api_key='.$api_keys->public_key.'&product_code='.$request->network.'&phone='.$request->phone.'&amount='.$request->amount.'&callback=https%3A%2F%2Ftopupearn.com%2Fcallback.php/';
        $curl            = curl_init($service_url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        $curl_response   = curl_exec($curl);
        curl_close($curl);
        $json_objekat    = json_decode($curl_response);
        $data          = $json_objekat->status;


if($data == true){
    $wallet = DB::table('wallet')
    ->Where('username', $request->username)
    ->first();

    $main_wallet = $wallet->main_wallet - $amount;
    $total_balance = $wallet->total_balance + $cash_back - $amount;
    $cashback_balance = $wallet->cashback_balance + $cash_back;
    DB::update('update wallet set total_balance = ?, cashback_balance = ?, main_wallet=?
    where username = ?',[$total_balance, $cashback_balance, $main_wallet, $request->username]);
    //Insert transaction
    DB::insert('insert into transactions (
    username,
    type,
    amount,
    phone,
    network,
    discount,
    cash_back,
    package,
    status
    )
    values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
    $request->username,
    'Airtime',
    $amount,
    $request->phone,
    $request->network,
    $cash_back,
    $cash_back,
    'Airtime',
    1
    ]);

    return response()->json(['status' => 1, 'message' => 'Transaction Successful!'], 200);
}else{
    return response()->json(['status' => 0, 'message' => 'Transaction failed. Please try again later.'. $data], 401);
}

    }

    }


    public function print_airtime(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'network' => 'required|string',
            'quantity' => 'required|numeric',
            'amount' => 'required|numeric',
            'pin' => 'required|numeric',
            'token' => 'required|string',
            'username' => 'string|nullable',
        ]);


        $api_keys = DB::table('api_keys')
        ->Where('api_provider', 'clubkonnect')
        ->first();

        $network = $request->network;
        $amount = (int)$request->amount * (int)$request->quantity;
        $quantity = (int)$request->quantity;

        $token_check = $this->check_login_token($request->token);
        if($token_check != 0)
        {
          $user = DB::table('users')
          ->Where('id', $token_check)
          ->first();

          $request->username = $user->username;

        $checkWallet = DB::table('wallet')
        ->Where('username', $request->username)
        ->first();

//get pin
$getPin = DB::table('users')
            ->where('status', 1)
            ->where('username', $request->username)
            ->value('pin');


        if(strlen($request->network) < 1 ){
            return response()->json(['status' => 0, 'message' => 'Please, select a network.'], 401);
        }
        else if($request->quantity > 50){
            return response()->json(['status' => 0, 'message' => 'Sorry, 50 is the maximum number of cards you can print.'], 401);
        }
        else if(!is_numeric($request->amount)){
            return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
        }
        else if($request->amount > $checkWallet->main_wallet){
            return response()->json(['status' => 0, 'message' => 'Amount is beyond the amount in main wallet. Add fund to continue with transaction.'], 401);
        }
        else if(!is_numeric($request->amount)){
            return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
        }
        else if($amount < 100){
            return response()->json(['status' => 0, 'message' => 'Amount is too low.'], 401);
        }
        else if($network == null){
            return response()->json(['status' => 0, 'message' => 'No service selected.'], 401);
        }
else if(!(Hash::check($request->pin, $getPin))){
    return response()->json(['status' => 0, 'message' => 'Incorrect PIN.'], 401);
}
        else if($validator->fails()){
  //return $validator->errors();
            return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled. ' ], 401);
        }
        else
        {
            $commission = 0.0;
            $cash_back=0.0;
            $purchase_cost=0.0;


            $user_pack = DB::table('users')
            ->Where('username', $request->username)
            ->first();

            if($user_pack)
{

    $commission_ = [];
    if($user_pack->package_status == 1){
        $commission_ = DB::table('airtime_print_commission')
        ->Where('id', 1)
        ->first();
    }
    else
    {
        $commission_ = DB::table('free_users_airtime_print_commission')
        ->Where('id', 1)
        ->first();
    }
//return response()->json(['status' => 0, 'message' => $network], 401);
                    if($network == "MTN"){
                        $commission = $commission_->mtn;
                        }

                        if($network == "GLO"){
                            $commission = $commission_->glo;
                            }

                            if($network == "AIRTEL"){
                                $commission = $commission_->airtel;
                                }

                                if($network == "9MOBILE"){
                                    $commission = $commission_->nmobile;
                                    }

                                    if($commission > 0){
            $convert = $commission/100;
            $cash_back = $amount * $convert;
            $purchase_cost = $amount - $cash_back;
                                    }

}


         $available_airtime = DB::table('airtime_pins')
         ->Where('status', 1)
         ->Where('amount', $request->amount)
         ->Where('network', $network)
         ->count();

         if($available_airtime < $quantity && $available_airtime > 0)
         {
           return response()->json(['status' => 0, 'message' => 'Airtime not available. Please try less quantity.'], 401);
         }
         else if($available_airtime < $quantity)
         {
           return response()->json(['status' => 0, 'message' => 'Airtime not available. Please try again later or try another network if error persists. '.$request->amount ], 401);
         }
         else if($request->amount < 1)
         {
           return response()->json(['status' => 0, 'message' => 'Amount is too low. ' ], 401);
         }
         else
         {

           $wallet = DB::table('wallet')
           ->Where('username', $request->username)
           ->first();

           $main_wallet = $wallet->main_wallet - $amount;
           $total_balance = $wallet->total_balance + $cash_back - $amount;
           $cashback_balance = $wallet->cashback_balance + $cash_back;
           DB::update('update wallet set total_balance = ?, cashback_balance = ?, main_wallet=?
           where username = ?',[$total_balance, $cashback_balance, $main_wallet, $request->username]);

           $unique_id = Str::random(80);

           for ($x = 1; $x <= $quantity; $x++) {
           //  return $x;
           //  echo "The number is: $x <br>";
             DB::update('update airtime_pins set status = ?, purchased_by = ?, unique_id = ?
             where amount = ? and network = ? and status = ? limit 1 ',[0, $request->username, $unique_id, $request->amount, $network, 1]);
           }

           $generated_airtime = DB::table('airtime_pins')
           ->Select('pin', 'serial_number', 'amount', 'network')
           ->Where('status', 0)
           ->Where('unique_id', $unique_id)
           ->get();

           $decrypt = new EncryptController;
           foreach($generated_airtime as $pin)
           {
             $pin->pin = $decrypt->decryptString($pin->pin);
           }

//insert airtime json result
          $amt_per_item = 0;
          $amt_per_item = $amount/$request->quantity;
          $insert_data =  DB::insert('insert into airtime_vouchers (
          username,
          network,
          quantity,
          amount,
          total_amount,
          json_data
          )
          values (?, ?, ?, ?, ?, ?)',[
            $request->username,
            $request->network,
            $request->quantity,
            $amt_per_item,
            $amount,
            $generated_airtime
          ]);

          $recentlyInsertedId = 0;
          if($insert_data){
            $recentlyInsertedId = DB::table('airtime_vouchers')
            ->Where('username', $request->username)
            ->orderBy('id', 'desc')
            ->first();
          }

              //Insert transaction
              DB::insert('insert into transactions (
              username,
              type,
              amount,
              network,
              discount,
              cash_back,
              package,
              status
              )
              values (?, ?, ?, ?, ?, ?, ?, ?)', [
              $request->username,
              'Airtime Print',
              $amount,
              $request->network,
              $cash_back,
              $cash_back,
              'Airtime Print',
              1
              ]);

              return response()->json(['status' => 1, 'message' => 'Transaction successful', 'transactionId' => $unique_id, 'epin' => $generated_airtime, 'quantity' => $quantity, 'airtime_id' => $recentlyInsertedId->id ], 200);

}

    }

  }
  else
  {
    return response()->json(['status' => 0, 'message' => 'Access Denied!.'], 401);
  }

    }

    public function buy_sme_data(Request $request){

    }

    public function buy_none_sme_data(Request $request){

        $validator = Validator::make($request->all(), [
            'network' => 'required|string',
            'network_desc' => 'required|string',
            'amount' => 'required|numeric',
            'phone' => 'required|string|min:7',
            'pin' => 'required|numeric',
            'username' => 'required|string',
        ]);



        $network = $request->network;
        $amount = $request->amount;

        $checkWallet = DB::table('wallet')
        ->Where('username', $request->username)
        ->first();

//get pin
$getPin = DB::table('users')
            ->where('status', 1)
            ->where('username', $request->username)
            ->value('pin');


        if(!is_numeric($request->phone)){
            return response()->json(['status' => 0, 'message' => 'Phone number must be in digits.'], 401);
        }
        else if(!is_numeric($request->amount)){
            return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
        }
        else if($request->amount > $checkWallet->main_wallet){
            return response()->json(['status' => 0, 'message' => 'Amount is beyond the amount in main wallet. Add fund to continue with transaction.'], 401);
        }
        else if(!is_numeric($request->amount)){
            return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
        }
        else if($request->phone[0] != 0){
            return response()->json(['status' => 0, 'message' => 'Phone number must start with zero (0).'], 401);
        }
        else if(strlen($request->phone) < 11){
            return response()->json(['status' => 0, 'message' => 'Phone number too short.'], 401);
        }
        else if(strlen($request->phone) > 11){
            return response()->json(['status' => 0, 'message' => 'Phone number too long.'], 401);
        }
        else if($amount < 50){
            return response()->json(['status' => 0, 'message' => 'Amount is too low.'], 401);
        }
        else if($network == null){
            return response()->json(['status' => 0, 'message' => 'No service selected.'], 401);
        }
else if(!(Hash::check($request->pin, $getPin))){
    return response()->json(['status' => 0, 'message' => 'Incorrect PIN.'], 401);
}
        else if($validator->fails()){
  //return $validator->errors();
            return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
        }
        else
        {
            $commission = 0.0;
            $cash_back=0.0;
            $purchase_cost=0.0;

/*
            $user_pack = DB::table('transactions')
            ->Where('username', $request->username)
            ->Where('type', 'Package')
            ->Where('status', 1)
            ->first();
            */

            $user_pack = DB::table('users')
            ->Where('username', $request->username)
            //->Where('package', '!=', 'Free Account')
            //->Where('package_status', 1)
            ->first();

            if($user_pack)
{

    $settings = [];
    if($user_pack->package_status == 1){
        $settings = DB::table('network_commission')
        ->Where('id', 1)
        ->first();
    }
    else
    {
        $settings = DB::table('free_users_network_commission')
        ->Where('id', 1)
        ->first();
    }

                        if(str_contains($network, "mtn")){
                        $commission = $settings->mtn_data;
                        }
                        if(str_contains($network, "glo")){
                            $commission = $settings->glo_data;
                            }
                            if(str_contains($network, "airtel")){
                                $commission = $settings->airtel_data;
                                }
                                if(str_contains($network, "9mobile")){
                                    $commission = $settings->nmobile_data;
                                    }

                                    if($commission > 0){
            $convert = $commission/100;
            $cash_back = $amount * $convert;
            $purchase_cost = $amount - $cash_back;
                                    }

}

//Load recharge card
$api_keys = DB::table('api_keys')
->Where('api_provider', 'toprecharge')
->first();
$service_url     = 'https://toprecharge.ng/api/v2/directdata/?api_key='.$api_keys->public_key.'&product_code='.$request->network.'&phone='.$request->phone.'&callback=https%3A%2F%2Ftopupearn.com%2Fcallback.php/';
        $curl            = curl_init($service_url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        $curl_response   = curl_exec($curl);
        curl_close($curl);
        $json_objekat    = json_decode($curl_response);
        $data          = $json_objekat->status;


if($data == true){
    $wallet = DB::table('wallet')
    ->Where('username', $request->username)
    ->first();

    $main_wallet = $wallet->main_wallet - $amount;
    $total_balance = $wallet->total_balance + $cash_back - $amount;
    $cashback_balance = $wallet->cashback_balance + $cash_back;
    DB::update('update wallet set total_balance = ?, cashback_balance = ?, main_wallet=?
    where username = ?',[$total_balance, $cashback_balance, $main_wallet, $request->username]);
    //Insert transaction
    DB::insert('insert into transactions (
    username,
    type,
    amount,
    phone,
    network,
    discount,
    cash_back,
    package,
    status
    )
    values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
    $request->username,
    $request->network_desc,
    $amount,
    $request->phone,
    $request->network,
    $cash_back,
    $cash_back,
    'Data',
    1
    ]);

    return response()->json(['status' => 1, 'message' => 'Transaction Successful!'], 200);
}else{
    return response()->json(['status' => 0, 'message' => 'Transaction failed. Please try again later.'], 401);
}

    }

    }


    public function mtn_sme_data(Request $request){

        $validator = Validator::make($request->all(), [
            'network' => 'required|string',
            'network_desc' => 'required|string',
            'amount' => 'required|numeric',
            'phone' => 'required|string|min:7',
            'pin' => 'required|numeric',
            'username' => 'required|string',
        ]);


        $network = $request->network;
        $amount = $request->amount;

        $checkWallet = DB::table('wallet')
        ->Where('username', $request->username)
        ->first();

//get pin
$getPin = DB::table('users')
            ->where('status', 1)
            ->where('username', $request->username)
            ->value('pin');


        if(!is_numeric($request->phone)){
            return response()->json(['status' => 0, 'message' => 'Phone number must be in digits.'], 401);
        }
        else if(!is_numeric($request->amount)){
            return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
        }
        else if($request->amount > $checkWallet->main_wallet){
            return response()->json(['status' => 0, 'message' => 'Amount is beyond the amount in main wallet. Add fund to continue with transaction.'], 401);
        }
        else if(!is_numeric($request->amount)){
            return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
        }
        else if($request->phone[0] != 0){
            return response()->json(['status' => 0, 'message' => 'Phone number must start with zero (0).'], 401);
        }
        else if(strlen($request->phone) < 11){
            return response()->json(['status' => 0, 'message' => 'Phone number too short.'], 401);
        }
        else if(strlen($request->phone) > 11){
            return response()->json(['status' => 0, 'message' => 'Phone number too long.'], 401);
        }
        else if($amount < 50){
            return response()->json(['status' => 0, 'message' => 'Amount is too low.'], 401);
        }
        else if($network == null){
            return response()->json(['status' => 0, 'message' => 'No service selected.'], 401);
        }
else if(!(Hash::check($request->pin, $getPin))){
    return response()->json(['status' => 0, 'message' => 'Incorrect PIN.'], 401);
}
        else if($validator->fails()){
  //return $validator->errors();
            return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
        }
        else
        {
            $commission = 0.0;
            $cash_back=0.0;
            $purchase_cost=0.0;

/*
            $user_pack = DB::table('transactions')
            ->Where('username', $request->username)
            ->Where('type', 'Package')
            ->Where('status', 1)
            ->first(); */

            $user_pack = DB::table('users')
            ->Where('username', $request->username)
            //->Where('package', '!=', 'Free Account')
            //->Where('package_status', 1)
            ->first();

            if($user_pack)
{

    $settings = [];
    if($user_pack->package_status == 1){
        $settings = DB::table('network_commission')
        ->Where('id', 1)
        ->first();
    }
    else
    {
        $settings = DB::table('free_users_network_commission')
        ->Where('id', 1)
        ->first();
    }
                        if(str_contains($network, "data_share")){
                        $commission = $settings->mtn_data_share;
                        }

                         if($commission > 0){
            $convert = $commission/100;
            $cash_back = $amount * $convert;
            $purchase_cost = $amount - $cash_back;
                                    }

}

$api_keys = DB::table('api_keys')
->Where('api_provider', 'toprecharge')
->first();

//Load recharge card
$service_url     = $api_keys->end_point.'/datashare/?api_key='.$api_keys->public_key.'&product_code='.$request->network.'&phone='.$request->phone.'&callback=https%3A%2F%2Ftopupearn.com%2Fcallback.php/';
        $curl            = curl_init($service_url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        $curl_response   = curl_exec($curl);
        curl_close($curl);
        $json_objekat    = json_decode($curl_response);
        $data  = $json_objekat->status;


if($data == true){
    $wallet = DB::table('wallet')
    ->Where('username', $request->username)
    ->first();

    $main_wallet = $wallet->main_wallet - $amount;
    $total_balance = $wallet->total_balance + $cash_back - $amount;
    $cashback_balance = $wallet->cashback_balance + $cash_back;
    DB::update('update wallet set total_balance = ?, cashback_balance = ?, main_wallet=?
    where username = ?',[$total_balance, $cashback_balance, $main_wallet, $request->username]);
    //Insert transaction
    DB::insert('insert into transactions (
    username,
    type,
    amount,
    phone,
    network,
    discount,
    cash_back,
    package,
    status
    )
    values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
    $request->username,
    $request->network_desc,
    $amount,
    $request->phone,
    $request->network,
    $cash_back,
    $cash_back,
    'SME Data',
    1
    ]);

    return response()->json(['status' => 1, 'message' => 'Transaction Successful!'], 200);
}else{
    return response()->json(['status' => 0, 'message' => 'Transaction failed. Please try again later.'], 401);
}

    }

    }


    public function getDataBillingList(Request $request){
                $data_billing = DB::table('data_billing')
                ->orderBy('data_amount', 'asc')
               ->get()
                ->all();
                return response()->json(['status' => 1,
                'message' => 'Data Billings', 'result' => $data_billing], 200);

    }

    public function get_airtime_details(Request $request, $login_token, $id){
        $token_check = $this->check_login_token($login_token);
        if($token_check != 0)
        {
            $user = DB::table('users')
            ->Where('id', $token_check)
            ->first();

            $airtime_vouchers = DB::table('airtime_vouchers')
            ->Where('username', $user->username)
            ->Where('id', $id)
            ->orderBy('id', 'desc')
            ->first();

            $airtime_vouchers->json_data = json_decode($airtime_vouchers->json_data);

            return response()->json(['status' => 1,
            'message' => 'Access Granted!',
            'result' => $airtime_vouchers], 200);
        }
        else
        {
            return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
        }
    }

//for whatsapp chatbot
    public function get_airtime_details_public(Request $request, $token, $id){

            $x = DB::table('whatsapp_airtime_epin')
            ->Where('token', $token)
            ->Where('status', 1)
            ->count();

            if($x > 0)
            {
              $airtime_vouchers = DB::table('airtime_vouchers')
              ->Where('id', $id)
              ->orderBy('id', 'desc')
              ->first();

              $airtime_vouchers->json_data = json_decode($airtime_vouchers->json_data);

              return response()->json(['status' => 1,
              'message' => 'Access Granted!',
              'result' => $airtime_vouchers], 200);
            }
            else
            {
                return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
            }

    }

    public function get_airtime_list(Request $request, $login_token){
        $token_check = $this->check_login_token($login_token);
        if($token_check != 0)
        {
            $user = DB::table('users')
            ->Where('id', $token_check)
            ->first();

            $airtime_vouchers = DB::table('airtime_vouchers')
            ->Where('username', $user->username)
            ->orderBy('id', 'desc')
            ->take(20)
            ->get();

            foreach($airtime_vouchers as $airtime)
            {
              $airtime->json_data = json_decode($airtime->json_data);
            }

            return response()->json(['status' => 1,
            'message' => 'Access Granted!',
            'result' => $airtime_vouchers], 200);
        }
        else
        {
            return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
        }
    }



}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class ElectricityBillController extends Controller
{
  public function check_login_token(){
      if(!Auth::check())
      {
          return 0;
      }
      else
      {
          return $token_check->user_id;
      }
  }

  public function verify_electricity_data(Request $request)
  {
      $validator = Validator::make($request->all(), [
          'product' => 'required|string',
          'meter_number' => 'required|numeric',
          'amount' => 'required|numeric',
          'product_code' => 'required|string',
          'username' => 'required|string'
      ]);

      $meter_number = $request->meter_number;
      $product = $request->product;
      $amount = $request->amount;

      //verify meter_number
      $api_keys = DB::table('api_keys')
      ->Where('api_provider', 'toprecharge')
      ->first();

      $checkWallet = DB::table('wallet')
      ->Where('username', $request->username)
      ->first();


              if(!is_numeric($request->amount)){
                  return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
              }
              else if(strlen($request->product_code) < 1 || strlen($request->product) < 1 ){
                  return response()->json(['status' => 0, 'message' => 'Please, select a product.'], 401);
              }
              else if($request->product_code == null || $request->product_code == '' ){
                  return response()->json(['status' => 0, 'message' => 'Please, select a product.'], 401);
              }
      else if($product == null || $product  == ""){
          return response()->json(['status' => 0, 'message' => 'No service selected.'], 401);
      }
      else if($meter_number == null){
          return response()->json(['status' => 0, 'message' => 'Meter number is invalid or empty.'], 401);
      }
      else if($request->amount+50 > $checkWallet->main_wallet){
              return response()->json(['status' => 0, 'message' => 'Amount is beyond the amount in main wallet. Add fund to continue with transaction.'], 401);
          }
      else if($request->amount < 500){
              return response()->json(['status' => 0, 'message' => 'Minimum amount is 500 NGN.'], 401);
          }

      else if($validator->fails()){
  //return $validator->errors();
          return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
      }
      else
      {
//        return response()->json(['status' => 0, 'message' => 'Hey, I got here.' ], 401);

        //check meter_number
        $service_url = $api_keys->end_point.'/electric/?api_key='.$api_keys->public_key.'&meter_number='.$meter_number.'&product_code='.$request->product_code.'&task=verify';
                $curl = curl_init($service_url);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($curl, CURLOPT_POST, false);
                curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
                $curl_response   = curl_exec($curl);
                curl_close($curl);
                $json_objekat    = json_decode($curl_response);
                $data  = $json_objekat->status;

                if($data == false){
  return response()->json(['status' => 0, 'message' => 'Meter Number verification failed, please try again.'], 401);
}
else
//return response()->json(['status' => 0, 'message' => 'Hey, I got here.' ], 401);
{          $commission = 0.0;
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
    $commission_ = [];
    if($user_pack->package_status == 1){
        $commission_ = DB::table('electricitiy_commission')
        ->Where('id', 1)
        ->first();
    }
    else
    {
        $commission_ = DB::table('free_users_electricitiy_commission')
        ->Where('id', 1)
        ->first();
    }

                  $commission = $commission_->commission;

                  if($commission > 0)
                  {
                  $convert = $commission/100;
                  $cash_back = $amount * $convert;
                  $purchase_cost = $amount - $cash_back;
                  }

  }

  return response()->json(['status' => 1, 'message' => 'Details OK.',
              'amount' => $amount,
              'commission' => $commission,
              'cash_back' => $cash_back,
              'purchase_cost' => $purchase_cost,
            'name' => $json_objekat->data->name], 200);
            }

          }
      }


      public function electricity_subscription(Request $request){

          $validator = Validator::make($request->all(), [
            'product' => 'required|string',
            'meter_number' => 'required|numeric',
            'amount' => 'required|numeric',
            'product_code' => 'required|string',
            'username' => 'required|string',
              'pin' => 'required|numeric'
                      ]);

                      $meter_number = $request->meter_number;
                      $product = $request->product;
                      $amount = $request->amount;

                      //verify meter_number
                      $api_keys = DB::table('api_keys')
                      ->Where('api_provider', 'toprecharge')
                      ->first();

          $checkWallet = DB::table('wallet')
          ->Where('username', $request->username)
          ->first();

  //get pin
  $getPin = DB::table('users')
              ->where('status', 1)
              ->where('username', $request->username)
              ->value('pin');

              if(!is_numeric($request->amount)){
                  return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
              }
              else if(strlen($request->product_code) < 1 || strlen($request->product) < 1 ){
                  return response()->json(['status' => 0, 'message' => 'Please, select a product.'], 401);
              }
              else if($request->product_code == null || $request->product_code == '' ){
                  return response()->json(['status' => 0, 'message' => 'Please, select a product.'], 401);
              }
      else if($product == null || $product  == ""){
          return response()->json(['status' => 0, 'message' => 'No service selected.'], 401);
      }
      else if($meter_number == null){
          return response()->json(['status' => 0, 'message' => 'Meter Number is invalid or empty.'], 401);
      }

      else if($request->amount+50 > $checkWallet->main_wallet){
              return response()->json(['status' => 0, 'message' => 'Amount is beyond the amount in main wallet. Add fund to continue with transaction.'], 401);
          }

          else if($request->amount < 500){
                  return response()->json(['status' => 0, 'message' => 'Minimum amount is 500 NGN.'], 401);
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

              $user_pack = DB::table('users')
              ->Where('username', $request->username)
              //->Where('package', '!=', 'Free Account')
              //->Where('package_status', 1)
              ->first();

              if($user_pack)
  {

    $commission_ = [];
    if($user_pack->package_status == 1){
        $commission_ = DB::table('electricitiy_commission')
        ->Where('id', 1)
        ->first();
    }
    else
    {
        $commission_ = DB::table('free_users_electricitiy_commission')
        ->Where('id', 1)
        ->first();
    }

    $commission = $commission_->commission;

              if($commission > 0)
              {
              $convert = $commission/100;
              $cash_back = $amount * $convert;
              $purchase_cost = $amount - $cash_back;
              }

  }

  $api_keys = DB::table('api_keys')
  ->Where('api_provider', 'toprecharge')
  ->first();

  //Load tv
  $service_url = $api_keys->end_point.'/electric/?api_key='.$api_keys->public_key.'&product_code='.$request->product_code.'&meter_number='.$meter_number.'&amount='.$request->amount;
          $curl = curl_init($service_url);
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

      $main_wallet = $wallet->main_wallet - $amount+50;
      $total_balance = $wallet->total_balance + $cash_back - $amount+50;
      $cashback_balance = $wallet->cashback_balance + $cash_back;
      DB::update('update wallet set total_balance = ?, cashback_balance = ?, main_wallet=?
      where username = ?',[$total_balance, $cashback_balance, $main_wallet, $request->username]);


      //Insert token
      $insert_data = DB::insert('insert into electricity_tokens (
      username,
      service,
      amount,
      token,
      meter_number,
      meter_name,
      status
      )
      values (?, ?, ?, ?, ?, ?, ?)', [
      $request->username,
      $request->product,
      $amount,
      $json_objekat->data->token,
      $meter_number,
      $json_objekat->data->customer_name,
      1
      ]);
      $recentlyInsertedId = 0;
               if($insert_data){
                 $recentlyInsertedId = DB::table('electricity_tokens')
                 ->Where('username', $request->username)
                 ->orderBy('id', 'desc')
                 ->first();
               }

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
      $request->product,
      $amount,
      $request->meter_number,
      $request->product,
      $cash_back,
      $cash_back,
      'Electricity Bill',
      1
      ]);

      return response()->json(['status' => 1, 'message' => 'Transaction Successful!', 'token' => $json_objekat->data->token, 'insertedTokenId' => $recentlyInsertedId->id], 200);
  }else{
      return response()->json(['status' => 0, 'message' => 'Transaction failed. Please try again later.'], 401);
  }

      }

      }

      public function getElectricityBillingList(Request $request){
                  $electricity_billing = DB::table('electricity_billing')
                  ->orderBy('id', 'asc')
                 ->get();
                  return response()->json(['status' => 1,
                  'message' => 'Electricy Billing',
                  'result' => $electricity_billing], 200);
      }

      public function get_electricity_details(Request $request, $login_token, $id){
          $token_check = $this->check_login_token($login_token);
          if($token_check != 0)
          {
              $user = DB::table('users')
              ->Where('id', $token_check)
              ->first();

              $electricity_tokens = DB::table('electricity_tokens')
              ->Where('username', $user->username)
              ->Where('id', $id)
              ->orderBy('id', 'desc')
              ->first();

              return response()->json(['status' => 1,
              'message' => 'Access Granted!',
              'result' => $electricity_tokens], 200);
          }
          else
          {
              return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
          }
      }


      public function get_token_list(Request $request, $login_token){
          $token_check = $this->check_login_token($login_token);
          if($token_check != 0)
          {
              $user = DB::table('users')
              ->Where('id', $token_check)
              ->first();

              $electricity_tokens = DB::table('electricity_tokens')
              ->Where('username', $user->username)
              ->orderBy('id', 'desc')
              ->take(20)
              ->get();

              return response()->json(['status' => 1,
              'message' => 'Access Granted!',
              'result' => $electricity_tokens], 200);
          }
          else
          {
              return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
          }
      }

}

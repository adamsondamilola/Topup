<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;


class CableController extends Controller
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

  public function verify_cable_data(Request $request)
  {
      $validator = Validator::make($request->all(), [
          'product' => 'required|string',
          'iuc' => 'required|numeric',
          'amount' => 'required|numeric',
          'product_code' => 'required|string',
          'username' => 'required|string'
      ]);

      $iuc = $request->iuc;
      $product = $request->product;
      $amount = $request->amount;

      //verify iuc
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
      else if($request->amount+50 > $checkWallet->main_wallet){
          return response()->json(['status' => 0, 'message' => 'Amount is beyond the amount in main wallet. Add fund to continue with transaction.'], 401);
      }
      else if($iuc == null){
          return response()->json(['status' => 0, 'message' => 'IUC is invalid or empty.'], 401);
      }

      else if($validator->fails()){
  //return $validator->errors();
          return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
      }
      else
      {
//        return response()->json(['status' => 0, 'message' => 'Hey, I got here.' ], 401);

        //check iuc
        $service_url = $api_keys->end_point.'/tv/?api_key='.$api_keys->public_key.'&smartcard_number='.$iuc.'&product_code='.$request->product_code.'&task=verify';
                $curl = curl_init($service_url);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($curl, CURLOPT_POST, false);
                curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
                $curl_response   = curl_exec($curl);
                curl_close($curl);
                $json_objekat    = json_decode($curl_response);
                $data  = $json_objekat->status;

                if($data == false){
  return response()->json(['status' => 0, 'message' => 'IUC verification failed, please try again.'], 401);
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
                      $commission_ = DB::table('cable_commission')
                      ->Where('id', 1)
                      ->first();
                  }
                  else
                  {
                      $commission_ = DB::table('free_users_cable_commission')
                      ->Where('id', 1)
                      ->first();
                  }

                  if($product == "DSTV"){
                      $commission = $commission_->dstv;
                      }

                      if($product == "GOTV"){
                          $commission = $commission_->gotv;
                          }

                          if($product == "STARTIMES"){
                              $commission = $commission_->startimes;
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
              'purchase_cost' => $purchase_cost,
            'name' => $json_objekat->data->name], 200);
            }

          }
      }


      public function cable_subscription(Request $request){

          $validator = Validator::make($request->all(), [
            'product' => 'required|string',
            'iuc' => 'required|numeric',
            'amount' => 'required|numeric',
            'product_code' => 'required|string',
            'username' => 'required|string',
              'pin' => 'required|numeric',
              'network_desc' => 'required|string'
                      ]);

                      $iuc = $request->iuc;
                      $product = $request->product;
                      $amount = $request->amount;

                      //verify iuc
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
      else if($iuc == null){
          return response()->json(['status' => 0, 'message' => 'IUC is invalid or empty.'], 401);
      }
          else if($request->amount+50 > $checkWallet->main_wallet){
              return response()->json(['status' => 0, 'message' => 'Amount is beyond the amount in main wallet. Add fund to continue with transaction.'], 401);
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
             // ->Where('package', '!=', 'Free Account')
              //->Where('package_status', 1)
              ->first();

              if($user_pack)
  {

    $commission_ = [];
    if($user_pack->package_status == 1){
        $commission_ = DB::table('cable_commission')
        ->Where('id', 1)
        ->first();
    }
    else
    {
        $commission_ = DB::table('free_users_cable_commission')
        ->Where('id', 1)
        ->first();
    }


    if($product == "DSTV"){
        $commission = $commission_->dstv;
        }

        if($product == "GOTV"){
            $commission = $commission_->gotv;
            }

            if($product == "STARTIMES"){
                $commission = $commission_->startimes;
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

  //Load tv
  $service_url = $api_keys->end_point.'/tv/?api_key='.$api_keys->public_key.'&product_code='.$request->product_code.'&smartcard_number='.$iuc.'&callback=https%3A%2F%2Ftopupearn.com%2Fcallback.php';
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
      $request->iuc,
      $request->product,
      $cash_back,
      $cash_back,
      'Cable TV',
      1
      ]);

      return response()->json(['status' => 1, 'message' => 'Transaction Successful!'], 200);
  }else{
      return response()->json(['status' => 0, 'message' => 'Transaction failed. Please try again later.'], 401);
  }

      }

      }

      public function getCableBillingList(Request $request){
                  $cable_billing = DB::table('cable_billing')
                  ->orderBy('service_amount', 'asc')
                 ->get();
                  return response()->json(['status' => 1,
                  'message' => 'Cable Billing',
                  'result' => $cable_billing], 200);
      }

}

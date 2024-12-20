<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

use App\Http\Controllers\Api\V1\VerifyApiController;

class CableApiController extends Controller
{

  public function check_login_token($login_token){
    $verify = new VerifyApiController;
    return $verify->check_api_token($login_token);
  }

  public function verify_cable_data(Request $request)
  {
      $validator = Validator::make($request->all(), [
          'iuc' => 'required|numeric',
          'product_code' => 'required|string',
          'token' => 'required|string'
      ]);

      $iuc = $request->iuc;
      $product = $request->product;
      $amount = $request->amount;

      //verify iuc
      $api_keys = DB::table('api_keys')
      ->Where('api_provider', 'toprecharge')
      ->first();

      $token_check = $this->check_login_token($request->token);
      if($token_check != 0)
      {

        $user = DB::table('users')
        ->Where('id', $token_check)
        ->first();

        $checkWallet = DB::table('wallet')
        ->Where('username', $user->username)
        ->first();

                 if(strlen($request->product_code) < 1 )
                {
                    return response()->json(['status' => 0, 'message' => 'Please, select a product.'], 401);
                }
                else if($request->product_code == null || $request->product_code == '' ){
                    return response()->json(['status' => 0, 'message' => 'Please, select a product.'], 401);
                }
        else if($iuc == null){
            return response()->json(['status' => 0, 'message' => 'IUC is invalid or empty.'], 401);
        }

        else if($validator->fails()){
    //return $validator->errors();
            return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
        }else
        {

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
            ->Where('username', $user->username)
            ->Where('type', 'Package')
            ->Where('status', 1)
            ->first(); */

            $user_pack = DB::table('users')
            ->Where('username', $user->username)
            //->Where('package', '!=', 'Free Account')
            //->Where('package_status', 1)
            ->first();

    return response()->json(['status' => 1, 'message' => 'Details OK.',
              'name' => $json_objekat->data->name], 200);
              }

            }
      }
      else
      {
        return response()->json(['status' => 0, 'message' => 'Access Denied!.'], 401);
      }


      }


      public function cable_subscription(Request $request){

          $validator = Validator::make($request->all(), [
            'iuc' => 'required|numeric',
            'product_code' => 'required|string',
              'token' => 'required|string'
                      ]);

                      $iuc = $request->iuc;
                      

                     // $amount = 0;
                      $bill = DB::table('cable_billing')
                      ->Where('service_code', $request->product_code)
                      ->first();
                      $amount = $request->amount = $bill->service_amount;

                      $api_keys = DB::table('api_keys')
                      ->Where('api_provider', 'toprecharge')
                      ->first();

                      $token_check = $this->check_login_token($request->token);
                      if($token_check != 0)
                      {
                        $user = DB::table('users')
                        ->Where('id', $token_check)
                        ->first();

                        $checkWallet = DB::table('wallet')
                        ->Where('username', $user->username)
                        ->first();

                        if(!is_numeric($request->amount)){
                            return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
                        }
                        else if(strlen($request->product_code) < 1 ){
                            return response()->json(['status' => 0, 'message' => 'Please, select a product.'], 401);
                        }
                        else if($request->product_code == null || $request->product_code == '' ){
                            return response()->json(['status' => 0, 'message' => 'Please, select a product.'], 401);
                        }
                else if($iuc == null){
                    return response()->json(['status' => 0, 'message' => 'IUC is invalid or empty. Please, try again.'], 401);
                }
                    else if($request->amount+50 > $checkWallet->main_wallet){
                        return response()->json(['status' => 0, 'message' => 'Amount is beyond the amount in main wallet. Add fund to continue with transaction.'], 401);
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
                        ->Where('username', $user->username)
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


              if(str_contains($request->product_code, "dstv")){
                  $commission = $commission_->dstv;
                  }

                  if(str_contains($request->product_code, "gotv")){
                      $commission = $commission_->gotv;
                      }

                      if(str_contains($request->product_code, "startimes")){
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
                ->Where('username', $user->username)
                ->first();

                $main_wallet = $wallet->main_wallet - $amount+50;
                $total_balance = $wallet->total_balance + $cash_back - $amount+50;
                $cashback_balance = $wallet->cashback_balance + $cash_back;
                DB::update('update wallet set total_balance = ?, cashback_balance = ?, main_wallet=?
                where username = ?',[$total_balance, $cashback_balance, $main_wallet, $user->username]);
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
                $user->username,
                $request->product_code,
                $amount,
                $request->iuc,
                $request->product_code,
                $cash_back,
                $cash_back,
                'Cable TV',
                1
                ]);

                return response()->json(['status' => 1, 'message' => 'Transaction Successful!'], 200);
            }
            else
            {
                return response()->json(['status' => 0, 'message' => 'Transaction failed. Please try again later.'], 401);
            }

                }

                      }
                      else
                      {
                        return response()->json(['status' => 0, 'message' => 'Access Denied!.'], 401);
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

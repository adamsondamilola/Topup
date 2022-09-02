<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

use App\Http\Controllers\ActivationController;

class CouponController extends Controller
{

  public function calculate_commission_and_points($upline_username, $my_username, $my_package)
  {
    $activation = new ActivationController;
    return $activation->activateAccount($upline_username, $my_username, $my_package);
}

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

    public function activate_with_coupon(Request $request)
    {

        $settings = DB::table('settings')
        ->Where('id', 1)
        ->first();

        $validator = Validator::make($request->all(), [
            'coupon' => 'required|string',
            'username' => 'required|string',
            'package' => 'required|string'
        ]);

        $coupon = $request->coupon;
        $username = $request->username;
        $package = $request->package;

        $ifCouponIsValid = DB::table('coupons')
        ->Where('coupon', $coupon)
        ->Where('package', $package)
        ->Where('status', 0)
        ->count();

        $ifUserExists = DB::table('users')
        ->Where('username', $username)
        ->count();

        $ifUsed = DB::table('coupons')
        ->Where('coupon', $coupon)
        ->Where('status', 1)
        ->first();

        if($ifUsed){
            return response()->json(['status' => 0,
            'message' => 'Coupon code has already been used'], 401);
        }

        else if($ifCouponIsValid < 1)
        {
            return response()->json(['status' => 0,
            'message' => 'Invalid coupon code'], 401);
        }
        else if($ifUserExists < 1)
        {
            return response()->json(['status' => 0, 'message' => 'Account activation failed'], 401);
        }
        else if($validator->fails())
        {
  //return $validator->errors();
            return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
        }
        else
        {

//check if referral is available
                $get_ref = DB::table('users')
                ->Where('username', $username)
                ->first();

DB::update('update coupons set status = ?, user = ?
where coupon = ?',[1, $username, $coupon]);


DB::update('update transactions set status = ?, username = ?
            where status = ? and package = ?',[1, $username, 0, $package]);

if($this->calculate_commission_and_points($get_ref->referral, $username, $package) == true ){
  return response()->json(['status' => 1, 'message' => 'Package Activated'], 200);
}else{
  return response()->json(['status' => 0, 'message' => 'Package Activation failed. Please try again.'], 401);
}


        }
    }

    public function fund_with_coupon(Request $request)
    {

        $settings = DB::table('settings')
        ->Where('id', 1)
        ->first();

        $validator = Validator::make($request->all(), [
            'coupon' => 'required|string',
            'username' => 'required|string'
        ]);

        $coupon = $request->coupon;
        $username = $request->username;
        $package = "Fund";

        $getCoupon = DB::table('coupons')
        ->Where('coupon', $coupon)
        ->Where('package', $package)
        ->Where('status', 0)
        ->first();

        $ifUsed = DB::table('coupons')
        ->Where('coupon', $coupon)
        ->Where('status', 1)
        ->first();

        $ifUserExists = DB::table('users')
        ->Where('username', $username)
        ->count();

        if($ifUsed){
            return response()->json(['status' => 0,
            'message' => 'Coupon code has already been used'], 401);
        }
        else if(!$getCoupon)
        {
            return response()->json(['status' => 0,
            'message' => 'Invalid coupon code'], 401);
        }
        else if($ifUserExists < 1)
        {
            return response()->json(['status' => 0, 'message' => 'Account activation failed'], 401);
        }
        else if($validator->fails())
        {
  //return $validator->errors();
            return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
        }
        else
        {

//Insert transaction
$inert_transaction = DB::insert('insert into transactions (
    username,
    type,
    amount,
    discount,
    status
    )
values (?, ?, ?, ?, ?)', [
    $username,
    'Fund Wallet',
    $getCoupon->amount,
    0,
    1
]);

//Fund wallet
$user_wallet = DB::table('wallet')
                ->Where('username', $username)
                ->first();
                $total_balance = $user_wallet->total_balance + $getCoupon->amount;
                $main_wallet = $user_wallet->main_wallet + $getCoupon->amount;
                DB::update('update wallet set total_balance = ?, main_wallet = ?
                where username = ?',[$total_balance, $main_wallet, $username]);

            DB::update('update coupons set status = ?, user = ?
            where coupon = ?',[1, $username, $coupon]);

            return response()->json(['status' => 1, 'message' => 'Fund Added.'], 200);
        }
    }


//////////////////// PACKAGE COUPON //////////////////////////

public function returnAmount($package){
  $web_settings = DB::table('website_settings')
  ->Where('id', 1)
  ->first();

  $package = DB::table('packages')
  ->Where('type', $web_settings->package_type)
  ->Where('package', $package)
  ->first();

  $amount = $package->amount;
  $points = $package->points;

  return $amount;

  }

public function package_coupons(Request $request, $login_token){

    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
        $user = DB::table('users')
        ->Where('id', $token_check)
        ->first();

        $coupons = DB::table('coupons')
        ->Where('package', '!=', 'Fund')
        ->Where('author', $user->username)
        ->orderBy('id', 'desc')
        ->take(50)
       ->get()->all();

        return response()->json(['status' => 1,
        'message' => 'Coupons',
        'result' => $coupons], 200);

    }
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
    }

  }


  public function search_coupon(Request $request, $login_token, $coupon){

    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
        $user = DB::table('users')
        ->Where('id', $token_check)
        ->first();



        $coupons = DB::table('coupons')
        ->Where('author', $user->username)
        ->Where('coupon', $coupon)
        ->orWhere('user', $coupon)
        ->orderBy('id', 'desc')
        ->take(50)
       ->get()->all();

if($coupons){
        return response()->json(['status' => 1,
        'message' => 'Coupons',
        'result' => $coupons], 200);
}
else{
  return response()->json(['status' => 0,
  'message' => 'Record not found'], 401);
}
    }
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
    }

  }

  public function create_package_pin(Request $request){

    $validator = Validator::make($request->all(), [
        'package' => 'required|string',
        'numbers' => 'required|numeric',
        'username' => 'required|string',
                 ]);

                 $wallet = DB::table('wallet')
                 ->Where('username', $request->username)
                 ->first();

                 $total_amount = 0;
                 $total_amount = $request->numbers * $this->returnAmount($request->package);

                 if($validator->fails())
                 {
                     return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
                 }
                 else if($total_amount > $wallet->main_wallet){
                    return response()->json(['status' => 0, 'message' => 'Main wallet balance too low.', 'result' => 'Empty'], 401);
                    }

                  else
                {

                    $total_balance = $wallet->total_balance - $total_amount;
                    $main_balance = $wallet->main_wallet - $total_amount;
                  $update_wallet = DB::update('update wallet set total_balance = ?, main_wallet = ?
                    where username = ?',[$total_balance, $main_balance, $request->username]);

if($update_wallet){
    for ($x = 0; $x < $request->numbers; $x++)
    {
      $coupon = Str::random(10);
      DB::insert('insert into coupons (
          author,
          coupon,
          package
          )
      values (?, ?, ?)', [
          $request->username,
          "PCK".$coupon,
          $request->package
      ]);
    }

    return response()->json(['status' => 1, 'message' => 'Successful! New Coupon code has been added below.' ], 200);

}else{
    return response()->json(['status' => 0, 'message' => 'Transaction failed. Please try again.' ], 401);
}

                }
}

///////////////////////////WALLET COUPON///////////////////////////////////////////
public function wallet_coupons(Request $request, $login_token){

    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
        $user = DB::table('users')
        ->Where('id', $token_check)
        ->first();

        $coupons = DB::table('coupons')
        ->Where('author', $user->username)
        ->Where('package', 'Fund')
        ->orderBy('id', 'desc')
        ->take(50)
       ->get()->all();

        return response()->json(['status' => 1,
        'message' => 'Coupons',
        'result' => $coupons], 200);

    }
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
    }

  }


  public function create_wallet_pin(Request $request){

      $validator = Validator::make($request->all(), [
          'amount' => 'required|numeric',
          'numbers' => 'required|numeric',
          'username' => 'required|string',
                   ]);

                   $wallet = DB::table('wallet')
                   ->Where('username', $request->username)
                   ->first();

                   $total_amount = 0;
                   $total_amount = $request->numbers * $request->amount;

                   if($validator->fails())
                   {
                       return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
                   }
                   else if($request->amount < 1)
                   {
                       return response()->json(['status' => 0, 'message' => 'Invalid amount.' ], 401);
                   }
                   else if(!is_numeric($request->amount)){
                    return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
                }
                   else if($total_amount > $wallet->main_wallet){
                      return response()->json(['status' => 0, 'message' => 'Main wallet balance too low.', 'result' => 'Empty'], 401);
                      }

                  else
                  {

                    $total_balance = $wallet->total_balance - $total_amount;
                    $main_balance = $wallet->main_wallet - $total_amount;
                  $update_wallet = DB::update('update wallet set total_balance = ?, main_wallet = ?
                    where username = ?',[$total_balance, $main_balance, $request->username]);

if($update_wallet){
    for ($x = 0; $x < $request->numbers; $x++)
    {
      $coupon = Str::random(10);
      DB::insert('insert into coupons (
          author,
          coupon,
          package,
          amount
          )
      values (?, ?, ?, ?)', [
          $request->username,
          "WLT".$coupon,
          'Fund',
          $request->amount
      ]);
    }
           return response()->json(['status' => 1, 'message' => 'Successful! New Coupon code has been added below.' ], 200);
}else{
    return response()->json(['status' => 0, 'message' => 'Transaction failed. Please try again.' ], 401);
}


                  }
  }

}

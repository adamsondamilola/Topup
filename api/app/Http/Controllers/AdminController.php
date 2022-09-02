<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

use App\Http\Controllers\ActivationController;

class AdminController extends Controller
{

  public function check_login_token($login_token){
      $token_check = DB::table('login_logs')
      ->Where('login_token', $login_token)
      ->Where('is_token_valid', 1)
      ->first();

      if(!$token_check)
      {
          return 0;
      }
      else
      {
        $usr = DB::table('users')
        ->Where('id', $token_check->user_id)
        ->Where('status', 1)
        ->Where('role', 'Admin')
        ->first();

        if($usr){
          return $token_check->user_id;
        }else {
          return 0;
        }


      }
  }

  public function createDatabase(Request $request){

  }

  ////////////////////// Referral Commission ///////////////////////
  public function calculate_commission_and_points($upline_username, $my_username, $my_package)
  {
    $activation = new ActivationController;
    return $activation->activateAccount($upline_username, $my_username, $my_package);
}
  ///////////////////// Referral Commission ///////////////////////

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

  public function website_setting(Request $request){
    $web_settings = DB::table('website_settings')
      ->Where('id', 1)
      ->first();

      if($web_settings)
    {
        return response()->json(['status' => 1,
        'message' => 'Coupons',
        'result' => $web_settings], 200);
    }
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!', 'result' => []], 401);
    }

  }

  public function create_package_pin(Request $request){

      $validator = Validator::make($request->all(), [
          'package' => 'required|string',
//          'amount' => 'required|numeric',
          'numbers' => 'required|numeric',
          'username' => 'required|string',
                   ]);

                if($validator->fails())
                  {
                      return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
                  }
                  else
                  {

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

                        //  DB::update('update users set pin = ? where username = ?',[Hash::make($request->password), $request->username]);
                          return response()->json(['status' => 1, 'message' => 'Successful! New Coupon code has been added below.' ], 200);

                  }
  }


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

                if($validator->fails())
                  {
                      return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
                  }
                  else
                  {

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

                        //  DB::update('update users set pin = ? where username = ?',[Hash::make($request->password), $request->username]);
                          return response()->json(['status' => 1, 'message' => 'Successful! New Coupon code has been added below.' ], 200);

                  }
  }


  public function site_stats(Request $request, $login_token){

    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
        $user = DB::table('users')
        ->Where('id', $token_check)
        ->Where('role', 'Admin')
        ->first();

        if($user){

        $total_users = DB::table('users')
        ->count();

        $inactive_users = DB::table('users')
          ->Where('package_status', 0)
          ->count();

          $active_users = DB::table('users')
            ->Where('package_status', 1)
            ->count();

            $package_revenue = DB::table('transactions')
            ->Where('status', 1)
            ->Where('type', 'Package')
            ->sum('amount');

            $pending_package_revenue = DB::table('transactions')
            ->Where('status', 0)
            ->Where('type', 'Package')
            ->sum('amount');


            $wallet_balances = DB::table('wallet')->get();
            $cashback_balance = $wallet_balances->sum('cashback_balance');
            $referral_balance = $wallet_balances->sum('referral_balance');
            $referral_withdrawn = $wallet_balances->sum('referral_withdrawn');
            $cashback_withdrawn = $wallet_balances->sum('cashback_withdrawn');
            $main_wallet = $wallet_balances->sum('main_wallet');
            /*
            foreach($wallet_balances as $balances){
                $cashback_balance += $balances->cashback_balance;
            }*/


    return response()->json(['status' => 1,
        'message' => 'Stats',
        'result' => [
        'total_users' => $total_users,
        'inactive_users' => $inactive_users,
        'active_users' => $active_users,
    'package_revenue' => $package_revenue,
    'pending_package_revenue' => $pending_package_revenue,
    'cashback_balance' => $cashback_balance,
    'referral_balance' => $referral_balance,
    'referral_withdrawn' => $referral_withdrawn,
    'cashback_withdrawn' => $cashback_withdrawn,
    'main_wallet' => $main_wallet
    ]
  ], 200);
}
    }
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
    }

  }


  public function airtimePrintAmountStats(Request $request, $login_token){

    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
        $user = DB::table('users')
        ->Where('id', $token_check)
        ->Where('role', 'Admin')
        ->first();

        if($user){


        $available_airtime_total_amount = DB::table('airtime_pins')
            ->Where('status', 1)->get()
            ->sum('amount');

            $purchased_airtime_total_amount = DB::table('airtime_pins')
            ->Where('status', 0)->get()
            ->sum('amount');

            $total_airtime_amount = $available_airtime_total_amount + $purchased_airtime_total_amount;


    return response()->json(['status' => 1,
        'message' => 'Stats',
        'result' => [
        'available_airtime_total_amount' => $available_airtime_total_amount,
        'purchased_airtime_total_amount' => $purchased_airtime_total_amount,
        'total_airtime_amount' => $total_airtime_amount
    ]
  ], 200);
}
    }
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
    }

  }

  public function availableAirtimeStats(Request $request, $login_token, $network){

    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
        $user = DB::table('users')
        ->Where('id', $token_check)
        ->Where('role', 'Admin')
        ->first();

        if($user){

          $amt100_available_airtime = DB::table('airtime_pins')
          ->Where('status', 1)
          ->Where('network', $network)
          ->Where('amount', "100")
          ->count();

          $amt200_available_airtime = DB::table('airtime_pins')
          ->Where('status', 1)
          ->Where('network', $network)
          ->Where('amount', "200")
          ->count();

          $amt400_available_airtime = DB::table('airtime_pins')
          ->Where('status', 1)
          ->Where('network', $network)
          ->Where('amount', "400")
          ->count();

          $amt500_available_airtime = DB::table('airtime_pins')
          ->Where('status', 1)
          ->Where('network', $network)
          ->Where('amount', "500")
          ->count();

          $amt1000_available_airtime = DB::table('airtime_pins')
          ->Where('status', 1)
          ->Where('network', $network)
          ->Where('amount', "1000")
          ->count();

    return response()->json(['status' => 1,
        'message' => 'Stats',
        'result' => [
        'amt100_available_airtime' => $amt100_available_airtime,
        'amt200_available_airtime' => $amt200_available_airtime,
        'amt400_available_airtime' => $amt400_available_airtime,
        'amt500_available_airtime' => $amt500_available_airtime,
        'amt1000_available_airtime' => $amt1000_available_airtime,
    ]
  ], 200);
}
    }
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
    }

  }

  public function usedAirtimeStats(Request $request, $login_token, $network){

    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
        $user = DB::table('users')
        ->Where('id', $token_check)
        ->Where('role', 'Admin')
        ->first();

        if($user){

          $amt100_used_airtime = DB::table('airtime_pins')
          ->Where('status', 0)
          ->Where('network', $network)
          ->Where('amount', "100")
          ->count();

          $amt200_used_airtime = DB::table('airtime_pins')
          ->Where('status', 0)
          ->Where('network', $network)
          ->Where('amount', "200")
          ->count();

          $amt400_used_airtime = DB::table('airtime_pins')
          ->Where('status', 0)
          ->Where('network', $network)
          ->Where('amount', "400")
          ->count();

          $amt500_used_airtime = DB::table('airtime_pins')
          ->Where('status', 0)
          ->Where('network', $network)
          ->Where('amount', "500")
          ->count();

          $amt1000_used_airtime = DB::table('airtime_pins')
          ->Where('status', 0)
          ->Where('network', $network)
          ->Where('amount', "1000")
          ->count();

    return response()->json(['status' => 1,
        'message' => 'Stats',
        'result' => [
        'amt100_used_airtime' => $amt100_used_airtime,
        'amt200_used_airtime' => $amt200_used_airtime,
        'amt400_used_airtime' => $amt400_used_airtime,
        'amt500_used_airtime' => $amt500_used_airtime,
        'amt1000_used_airtime' => $amt1000_used_airtime,
    ]
  ], 200);
}
    }
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
    }

  }



  public function returnAmount($package){

    $web_settings = DB::table('website_settings')
    ->Where('id', 1)
    ->first();

    $package_ = DB::table('packages')
    ->Where('type', $web_settings->package_type)
    ->Where('package', $package)
    ->first();

    $amount = $package_->amount;
    $points = $package_->points;

    if($web_settings->package_type == "affiliate")
    {
      return 0;
    }
    else
    {
      return $amount * 0.25;
    }


  }

  public function returnPoints($package){
    $web_settings = DB::table('website_settings')
    ->Where('id', 1)
    ->first();

    $package_ = DB::table('packages')
    ->Where('type', $web_settings->package_type)
    ->Where('package', $package)
    ->first();

    $amount = $package_->amount;
    $points = $package_->points;

    if($web_settings->package_type == "affiliate")
    {
      return 0;
    }
    else
    {
      return $points;
    }

  }

  public function ifAlreadyEarned($username, $my_username, $my_package){

    $commission_status = DB::table('package_admitted')
    ->Where('commission_owner', $username)
    ->Where('commission_giver', $my_username)
    ->Where('package', $my_package)
    ->Where('status', 1)
    ->first();

    if($commission_status){
      return 1;

    }else{
      return 0;
    }

  }

  public function balance_restore(Request $request){

        $users = DB::table('users')
        ->get();

        foreach ($users as $user){

          //if package is not active, make all values in wallet zero
          if($user->package_status == 0){
          $update_wallet = DB::update('update wallet set
            total_balance = ?,
            main_wallet = ?,
            points = ?,
            referral_balance = ?
            where username = ?',[0, 0, 0, 0, $user->username]);
          }

          $referrals = DB::table('referrals')
          ->Where('referrer', $user->username)
          ->Where('status', 1)
          ->get();

          if($referrals)
          {

            $pck_amount = 0;
            $pck_points = 0;

            foreach($referrals as $ref){
//if not inserted in package_admitted
$checkRef = $this->ifAlreadyEarned($ref->username, $ref->referrer, $ref->package);
if($checkRef == 0){

  $upline_wallet = DB::table('wallet')
      ->Where('username', $ref->referrer)
      ->first();

      $total_balance = $upline_wallet->main_wallet + $this->returnAmount($ref->package);
      $referral_balance = $this->returnAmount($ref->package);
      $points_ = $this->returnPoints($ref->package);
    /*  $total_balance = $upline_wallet->total_balance + $this->returnAmount($ref->package);
      $referral_balance = $upline_wallet->referral_balance + $this->returnAmount($ref->package);
      $points_ = $upline_wallet->points + $this->returnPoints($ref->package);
      */
      DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
      where username = ?',[$total_balance, $referral_balance, $points_, $ref->referrer]);

  /////
  DB::insert('insert into package_admitted (
      commission_owner,
      commission_giver,
      commission_amount,
      package
      )
  values (?, ?, ?, ?)', [
      $ref->referrer,
      $ref->username,
      $this->returnAmount($ref->package),
      $ref->package
  ]);

  }
}
}
}

  return response()->json(['status' => 1, 'message' => 'DONE!' ], 200);

}


public function point_restore(Request $request){

      $users = DB::table('users')
      ->get();

      foreach ($users as $user){

        $referrals = DB::table('referrals')
        ->Where('referrer', $user->username)
        ->Where('status', 1)
        ->first();

        if($referrals)
        {

$upline_wallet = DB::table('wallet')
    ->Where('username', $user->username)
    ->first();

    $points_ = $upline_wallet->points + $this->returnPoints($user->package);

    DB::update('update wallet set points = ?
    where username = ?',[$points_, $user->username]);

}
}

return response()->json(['status' => 1, 'message' => 'DONE!' ], 200);

}


public function update_user_profile(Request $request)
{
    $validator = Validator::make($request->all(), [
      'username' => 'required|string',
      'first_name' => 'required|string|min:3',
      'last_name' => 'required|string|min:3',
      'email' => 'required|string|min:3',
      'phone' => 'required|string|min:6',
        'token' => 'required|string'
    ]);

    $ifEmailExists = DB::table('users')
    ->Where('email', $request->email)
    ->count();

    $ifPhoneExists = DB::table('users')
    ->Where('phone', $request->phone)
    ->Where('username', '!=', $request->username)
    ->count();


    if($ifEmailExists > 1){
        return response()->json(['status' => 0, 'message' => 'Email address already in Use'], 401);
    }
     if($ifPhoneExists > 1){
        return response()->json(['status' => 0, 'message' => 'Phone number already in Use'], 401);
    }
    else if(!is_numeric($request->phone)){
        return response()->json(['status' => 0, 'message' => 'Phone number must be in digits.'], 401);
    }
    else if($request->phone[0] == 0){
        return response()->json(['status' => 0, 'message' => 'Phone number can not start with zero (0).'], 401);
    }
    else if($request->phone[0] != "+"){
        return response()->json(['status' => 0, 'message' => 'Phone number should be in international format (e.g. +1234567890).'], 401);
    }
    else if(strlen($request->phone) < 11){
        return response()->json(['status' => 0, 'message' => 'Phone number too short.'], 401);
    }
    else if($validator->fails()){
//return $validator->errors();
        return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
    }
    else
    {

      $token_check = $this->check_login_token($request->token);

      if($token_check != 0)
      {
          $user = DB::table('users')
          ->Where('id', $token_check)
          ->Where('role', 'Admin')
          ->first();

          if($user)
          {


          $update = DB::update('update users set first_name = ?, last_name = ?, phone = ?, email = ?
          where username = ?',[$request->first_name, $request->last_name, $request->phone, $request->email, $request->username]);

if($update)
      {
        return response()->json(['status' => 1, 'message' => 'Account updated.'], 200);
      }else{
        return response()->json(['status' => 0, 'message' => 'Account updated failed.'], 401);
      }
}
        }else{
          return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
        }

    }
}

public function update_user_wallet(Request $request){

  $validator = Validator::make($request->all(), [
      'username' => 'required|string',
      'total_balance' => 'required|numeric',
      'main_wallet' => 'required|numeric',
      'points' => 'required|numeric',
      'referral_balance' => 'required|numeric',
      'referral_withdrawn' => 'required|numeric',
      'cashback_balance' => 'required|numeric',
      'cashback_withdrawn' => 'required|numeric',
      'token' => 'required|string'
               ]);

            if($validator->fails())
              {
                  return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
              }
              else{

                $token_check = $this->check_login_token($request->token);

                if($token_check != 0)
                {
                    $user = DB::table('users')
                    ->Where('id', $token_check)
                    ->Where('role', 'Admin')
                    ->first();

                    if($user)
                    {
                      //update wallet
                      $update_wallet = DB::update('update wallet set
                        total_balance = ?,
                        main_wallet = ?,
                        points = ?,
                        referral_balance = ?,
                        referral_withdrawn = ?,
                        cashback_balance = ?,
                        cashback_withdrawn = ?
                        where username = ?',[$request->total_balance,
                        $request->main_wallet,
                        $request->points,
                        $request->referral_balance,
                        $request->referral_withdrawn,
                        $request->cashback_balance,
                        $request->cashback_withdrawn,
                        $request->username]);

                        if($update_wallet){
                          return response()->json(['status' => 1, 'message' => 'Wallet updated.' ], 200);
                        }

                    }else{
                      return response()->json(['status' => 0, 'message' => 'Access denied.' ], 401);
                    }
                  }
              }
}

public function user_details(Request $request, $login_token, $username){
    $token_check = $this->check_login_token($login_token);
    $user_id=$token_check;

    if($token_check != 0)
    {

      $admin = DB::table('users')
      ->Where('id', $user_id)
      ->Where('role', 'Admin')
      ->first();

      if($admin){

        $user = DB::table('users')
        ->Where('username', $username)
        ->first();

        $wallet = DB::table('wallet')
        ->Where('username', $user->username)
        ->first();

        $bank = DB::table('bank_account')
        ->Where('username', $user->username)
        ->first();

        $referrals = DB::table('referrals')
        ->Where('referrer', $user->username)
        ->count();

        $referrals_list = DB::table('referrals')
        ->Where('referrer', $user->username)
        ->get();

        return response()->json(['status' => 1,
        'message' => 'Access Granted!',
        'result' => [
            'user' => $user,
            'referrals' => $referrals,
            'referrals_list' => $referrals_list,
            'wallet' => $wallet,
            'bank' => $bank
            ]], 200);
          }
    }
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
    }
}

public function search_user(Request $request, $login_token, $username){

  $token_check = $this->check_login_token($login_token);
  if($token_check != 0)
  {
      $admin = DB::table('users')
      ->Where('id', $token_check)
      ->Where('role', 'Admin')
      ->first();

if($admin){
      $users = DB::table('users')
      ->Where('username', $username)
      ->orWhere('email', $username)
      ->get();

if($users){
      return response()->json(['status' => 1,
      'message' => 'Coupons',
      'result' => $users], 200);
}
else{
return response()->json(['status' => 0,
'message' => 'Record not found'], 401);
}
}else{
  return response()->json(['status' => 0,
  'message' => 'Access Denied!'], 401);
}
  }
  else
  {
      return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
  }

}


public function list_users(Request $request, $login_token){

  $token_check = $this->check_login_token($login_token);
  if($token_check != 0)
  {
      $admin = DB::table('users')
      ->Where('id', $token_check)
      ->Where('role', 'Admin')
      ->first();

if($admin){
  $users = DB::table('users')
  ->orderBy('id', 'desc')
  ->take(20)
 ->get()->all();

 $active_users = DB::table('users')
 ->Where('package_status', 1)
 ->orderBy('id', 'desc')
 ->take(20)
->get()->all();

$inactive_users = DB::table('users')
->Where('package_status', 0)
->orderBy('id', 'desc')
->take(20)
->get()->all();

$total_active_users = DB::table('users')
->Where('package_status', 1)
->count();

$total_inactive_users = DB::table('users')
->Where('package_status', 0)
->count();

$total_users = DB::table('users')
->count();

if($users){
      return response()->json(['status' => 1,
      'message' => 'Coupons',
      'result' => $users,
      'inactive_users' => $inactive_users,
      'active_users' => $active_users,
      'total_inactive_users' => $total_inactive_users,
      'total_active_users' => $total_active_users,
    'total_users' => $total_users], 200);
}
else{
return response()->json(['status' => 0,
'message' => 'Record not found'], 401);
}
}else{
  return response()->json(['status' => 0,
  'message' => 'Access Denied!'], 401);
}
  }
  else
  {
      return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
  }

}

public function transactions(Request $request, $login_token, $username, $num){
  $token_check = $this->check_login_token($login_token);
  if($token_check != 0)
  {
      $admin = DB::table('users')
      ->Where('id', $token_check)
      ->Where('role', 'Admin')
      ->first();

if($admin){

        $transactions = DB::table('transactions')
        ->Where('username', $username)
        ->orderBy('id', 'desc')
        ->take($num)
        ->get();

        return response()->json(['status' => 1,
        'message' => 'Transactions', 'result' => $transactions], 200);
    }
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!', 'result' => []], 401);
    }
  }
}

public function transfer_transactions(Request $request, $login_token, $username, $num){
    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
        $admin = DB::table('users')
        ->Where('id', $token_check)
        ->Where('role', 'Admin')
        ->first();

  if($admin){

          $transactions = DB::table('transactions')
          ->Where('type', 'Transfer')
          ->Where('sender', $username)
          ->OrWhere('receiver', $username)
          ->orderBy('id', 'desc')
          ->take($num)
          ->get();

          return response()->json(['status' => 1,
          'message' => 'Transactions', 'result' => $transactions], 200);
      }
      else
      {
          return response()->json(['status' => 0, 'message' => 'Access Denied!', 'result' => []], 401);
      }
    }
  }

public function transfer(Request $request, $username){
    $validator = Validator::make($request->all(), [
      'login_token' => 'required|string',
      'sender' => 'required|string',
        'receiver' => 'required|string',
        'amount' => 'required|numeric',
        'pin' => 'required|numeric',
    ]);

    $settings = DB::table('settings')
    ->Where('id', 1)
    ->first();

    $sender = $request->sender;
    $receiver = $request->receiver;
    $pin = $request->pin;
    $amount = $request->amount;

    $checkWallet = DB::table('wallet')
    ->Where('username', $sender)
    ->first();

        //get pin
        $getPin = DB::table('users')
        ->where('username', $sender)
        ->value('pin');

        $receiverAccount = DB::table('users')
        ->Where('email', $receiver)
        ->orWhere('username', $receiver)
        ->first();

    if(!is_numeric($amount)){
        return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
    }
    else if(!(Hash::check($request->pin, $getPin)))
    {
        return response()->json(['status' => 0, 'message' => 'Incorrect PIN.'], 401);
    }
    else if(!$receiverAccount)
    {
        return response()->json(['status' => 0, 'message' => 'Receiver account not found!'], 401);
    }
    else if($receiverAccount->username == $sender)
    {
        return response()->json(['status' => 0, 'message' => 'You can not transfer to self'], 401);
    }
    else if($validator->fails()){
        //return $validator->errors();
                  return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
              }
    else
    {
      $token_check = $this->check_login_token($request->login_token);
      $user_id=$token_check;

      if($token_check != 0)
      {
          $user = DB::table('users')
          ->Where('id', $user_id)
          ->first();

          $sender =  $user->username;

          $wallet = DB::table('wallet')
          ->Where('username', $sender)
          ->first();

            //Carry out transaction;

                $receiver_wallet = DB::table('wallet')
                ->Where('username', $receiverAccount->username)
                ->first();

              //  $main_wallet = $wallet->main_wallet - $amount;
              //  $total_balance = $wallet->total_balance - $amount;

                $receiver_main_wallet = $receiver_wallet->main_wallet + $amount;
                $receiver_total_balance = $receiver_wallet->total_balance + $amount;

            //decduct from sender
                //DB::update('update wallet set main_wallet = ?, total_balance = ?
                //where username = ?',[$main_wallet, $total_balance, $sender]);
                //Insert transaction
                DB::insert('insert into transactions (
                username,
                type,
                amount,
                status,
                sender,
                receiver
                )
                values (?, ?, ?, ?, ?, ?)', [
                $sender,
                'Transfer',
                $amount,
                1,
                $sender,
                $receiver
                ]);

            //////////
                DB::update('update wallet set main_wallet = ?, total_balance = ?
                where username = ?',[$receiver_main_wallet, $receiver_total_balance, $receiver]);
                //Insert transaction
                DB::insert('insert into transactions (
                username,
                type,
                amount,
                status,
                sender,
                receiver
                )
                values (?, ?, ?, ?, ?, ?)', [
                $receiver,
                'Transfer',
                $amount,
                1,
                $sender,
                $receiver
                ]);

                return response()->json(['status' => 1, 'message' => 'Transaction Successful!'], 200);


        }else{
          return response()->json(['status' => 0, 'message' => 'Transfer failed.'], 401);
        }


}
}

public function deactivate_activate_account(Request $request, $login_token, $username){
  $token_check = $this->check_login_token($login_token);
  if($token_check != 0)
  {
    $user = DB::table('users')
    ->Where('username', $username)
    ->first();

    if($user->status == 0){
      DB::update('update users set status = ? where username = ?',[1, $username]);
        return response()->json(['status' => 1, 'message' => 'Account Suspension Removed!'], 200);
    }

    else if($user->status == 1){
      DB::update('update users set status = ? where username = ?',[0, $username]);
        return response()->json(['status' => 1, 'message' => 'Account Suspended!'], 200);
    }
    else
    {
        return response()->json(['status' => 0, 'message' => 'Operation Failed!'], 401);
    }

  }
  else
  {
      return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
  }
}

public function delete_account(Request $request, $login_token, $username){
  $token_check = $this->check_login_token($login_token);
  if($token_check != 0)
  {
    $delete_user = DB::table('users')
    ->Where('username', $username)
    ->delete();

    $delete_user_wallet = DB::table('wallet')
    ->Where('username', $username)
    ->delete();

    $delete_user_transactions = DB::table('transactions')
    ->Where('username', $username)
    ->delete();

    if($delete_user_transactions){
        return response()->json(['status' => 1, 'message' => 'Account Deleted!'], 200);
    }

    else
    {
        return response()->json(['status' => 0, 'message' => 'Operation Failed!'], 401);
    }

  }
  else
  {
      return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
  }
}


public function payment_approval(Request $request, $login_token, $id, $status){
    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
      $user = DB::table('transactions')
      ->Where('id', $id)
      ->first();

      if($status == 0){
        DB::update('update transactions set status = ? where id = ?',[$status, $id]);
          return response()->json(['status' => 1, 'message' => 'Payment In Pending!'], 200);
      }
      else if($status == 1){
        DB::update('update transactions set status = ? where id = ?',[$status, $id]);
          return response()->json(['status' => 1, 'message' => 'Payment Approved!'], 200);
      }
      else if($status == 2){
        DB::update('update transactions set status = ? where id = ?',[$status, $id]);
          return response()->json(['status' => 1, 'message' => 'Payment Declined!'], 200);
      }
      else
      {
          return response()->json(['status' => 0, 'message' => 'Operation Failed!'], 401);
      }

    }
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
    }
  }

  public function bank_withdrawal_transactions(Request $request, $login_token, $num){
    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
        $admin = DB::table('users')
        ->Where('id', $token_check)
        ->Where('role', 'Admin')
        ->first();

  if($admin){

    $transactions = DB::table('transactions')
    ->Where('type', 'Withdraw to bank')
    ->orderBy('id', 'desc')
    ->take($num)
    ->get();

    $pending_withdrawal = DB::table('transactions')
    ->Where('type', 'Withdraw to bank')
    ->Where('status', 0)
    ->count();

    return response()->json(['status' => 1,
          'message' => 'Bank Withdrawal Transactions', 'transactions' => $transactions, 'pending_withdrawal' => $pending_withdrawal], 200);
      }
      else
      {
          return response()->json(['status' => 0, 'message' => 'Access Denied!', 'result' => []], 401);
      }
    }
  }


public function upgrade_downgrade(Request $request, $login_token, $username){
//return  $this->calculate_commission_and_points(null, $username, $request->package);
  $token_check = $this->check_login_token($login_token);
  if($token_check != 0)
  {
    $validator = Validator::make($request->all(), [
        'package' => 'required|string',
        'username' => 'required|string',
        'action' => 'required|string'
    ]);

    $package_amount = 0;
    $points = 0;

    $web_settings = DB::table('website_settings')
    ->Where('id', 1)
    ->first();

    $package = DB::table('packages')
    ->Where('type', $web_settings->package_type)
    ->Where('package', $request->package)
    ->first();

    $package_amount = $package->amount;
    $points = $package->points;

    $user = DB::table('users')
    ->Where('username', $username)
    ->first();

    if($validator->fails()){
//return $validator->errors();
        return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
    }
    else
    {
      //decline all pending package if available
      DB::update('update transactions set status = ?
      where type = ? and status = ? and username = ?',[2, 'Package', 0, $username]);

//insert new package transaction
      DB::insert('insert into transactions (
          username,
          type,
          amount,
          discount,
          package
          )
      values (?, ?, ?, ?, ?)', [
          $username,
          'Package',
          $package_amount,
          0,
          $request->package
      ]);

        DB::update('update users set package = ?, package_amount = ?, package_status = ?, package_downlines = ?
        where username = ?',[$request->package, $package_amount, 0, 0, $username]);

        if($request->action == "Activate"){
          //check if referral is available
                          $get_ref = DB::table('users')
                          ->Where('username', $username)
                          ->first();

          DB::update('update transactions set status = ?, username = ?
                      where status = ? and package = ?',[1, $username, 0, $request->package]);

          if($this->calculate_commission_and_points($get_ref->referral, $username, $request->package) == true ){
            return response()->json(['status' => 1, 'message' => 'Package Activated'], 200);
          }else{
            return response()->json(['status' => 0, 'message' => 'Package Activation failed. Please try again. '], 401);
          }

        }
        else{
        return response()->json(['status' => 1, 'message' => 'Package Changed!'], 200);
        }

    }

  }else
  {
      return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
  }
}

public function reset_password(Request $request, $login_token, $username){
  $token_check = $this->check_login_token($login_token);
  if($token_check != 0)
  {
    $validator = Validator::make($request->all(), [
      'login_token' => 'required|string',
      'password1' => 'required|string',
        'password2' => 'required|string'
                 ]);

              if(strlen($request->password1) < 6)
                {
                   return response()->json(['status' => 0, 'message' => 'Password should be at least 6 characters long.'], 401);
               }
                else if($request->password1 != $request->password2)
                {
                    return response()->json(['status' => 0, 'message' => 'Passwords do not match.'], 401);
                }
                else if($validator->fails())
                {
                    return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
                }
                else
                {
                            DB::update('update users set password = ? where username = ?',[Hash::make($request->password1), $username]);
                            return response()->json(['status' => 1, 'message' => 'Password reset successfully.' ], 200);
                }
  }else
  {
      return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
  }
}

public function reset_pin(Request $request, $login_token, $username){
  $token_check = $this->check_login_token($login_token);
  if($token_check != 0)
  {
    $validator = Validator::make($request->all(), [
      'login_token' => 'required|string',
      'password1' => 'required|string',
        'password2' => 'required|string'
                 ]);

              if(strlen($request->password1) < 4)
                {
                   return response()->json(['status' => 0, 'message' => 'Pin should be 4-digits.'], 401);
                }
                else if(!is_numeric($request->password1))
                {
                    return response()->json(['status' => 0, 'message' => 'Pin should be numeric.'], 401);
                }
                else if($request->password1 != $request->password2)
                {
                    return response()->json(['status' => 0, 'message' => 'Pins do not match.'], 401);
                }
                else if($validator->fails())
                {
                    return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
                }
                else
                {

                            DB::update('update users set pin = ? where username = ?',[Hash::make($request->password1), $username]);
                            return response()->json(['status' => 1, 'message' => 'PIN reset successfully.' ], 200);

                }
  }else
  {
      return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
  }
}

/*
public function transactions(Request $request, $login_token, $username){
  $token_check = $this->check_login_token($login_token);
  if($token_check != 0)
  {

  }else
  {
      return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
  }
}
*/


}

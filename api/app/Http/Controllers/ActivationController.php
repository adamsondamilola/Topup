<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class ActivationController extends Controller
{

    public function if_user_has_upline_and_same_pck($username, $my_package)
    {
      $user = DB::table('users')
      ->Where('username', $username)
     // ->Where('package', $my_package)
      ->Where('package_status', 1)
      ->first();
      if($user){
        return $user->username;
    //    return $user->referral;
      }else{
        return null;
      }
    }

    public function commissioner($username, $my_username, $my_package){

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

    public function calculate_affiliate_earnings($my_username, $my_package)
    {

  $amount = 0;
  $points = 0;

  $package = DB::table('packages')
  ->Where('type', 'affiliate')
  ->Where('package', $my_package)
  ->first();

  $amount = $package->amount;
//  $points = $package->points;

$f1 = 0;
$f1 = 40/100;
$f1 = $amount * $f1;

$my_share = 0;
if($amount == 5000){
  $my_share = 600;
}
//$my_share = $my_share * $amount;

$_user = DB::table('users')->where('username', $my_username)->where('package_status', 0)->first();
//return "hello";
//  return response()->json(['status' => 0]);
if($_user && $_user->package_status == 0)
{
  $my_wallet = DB::table('wallet')
    ->Where('username', $my_username)
    ->first();

  //Bonus
    $points_ = $my_wallet->points + $points;
    $main_wallet = $my_wallet->main_wallet + $my_share;
    $total_balance = $my_wallet->total_balance + $my_share;
  DB::update('update wallet set points = ?, main_wallet = ?, total_balance = ?
  where username = ?',[$points_, $main_wallet, $total_balance, $my_username]);

  $inert_transaction = DB::insert('insert into transactions (
    username,
    type,
    amount,
    discount,
    package,
    status
    )
  values (?, ?, ?, ?, ?, ?)', [
    $my_username,
    'Package Bonus',
    $my_share,
    0,
    $my_package,
    1
  ]);

  DB::update('update users set package_status = ?
  where username = ?',[1, $my_username]);


  $upline = DB::table('users')
  ->Where('username', $_user->referral)
  ->Where('package_status', 1)
  ->first();

  if($upline){

    DB::update('update referrals set status = ?
    where username = ?',[1, $my_username]);


    if($this->commissioner($upline->username, $my_username, $my_package) == 0)
    {
      $upline_wallet = DB::table('wallet')
          ->Where('username', $upline->username)
          ->first();
          $total_balance = $upline_wallet->total_balance + $f1;
          $referral_balance = $upline_wallet->referral_balance + $f1;
          $points_ = $upline_wallet->points + $points;
          DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
          where username = ?',[$total_balance, $referral_balance, $points_, $upline->username]);

           $userx = DB::table('users')
            ->Where('username', $upline->username)
            ->Where('package_status', 1)
            ->first();

          $downlines = $userx->package_downlines + 1;
            DB::update('update users set package_downlines = ?
            where username = ?',[$downlines, $upline->username]);

      $inert_transaction = DB::insert('insert into transactions (
              username,
              type,
              amount,
              discount,
              package,
              status
              )
          values (?, ?, ?, ?, ?, ?)', [
              $upline->username,
              'Referral Commission',
              $f1,
              0,
              $my_package,
              1
          ]);

          //add commission table
          if($inert_transaction){
          DB::insert('insert into package_admitted (
              commission_owner,
              commission_giver,
              commission_amount,
              package
              )
          values (?, ?, ?, ?)', [
              $upline->username,
              $my_username,
              $f1,
              $my_package
          ]);}
  }
  }

    return true;
}
else
{
  return false;
}

}

    public function calculate_multi_level_earnings($upline_username, $my_username, $my_package)
    {

  $amount = 0;
  $points = 0;

  $package = DB::table('packages')
  ->Where('type', 'multi_level')
  ->Where('package', $my_package)
  ->first();

  $amount = $package->amount;
  $points = $package->points;

      $f1 = 0;
      $f1 = 25/100;
      $f1 = $amount * $f1;

      $f2 = 0;
      $f2 = 10/100;
      $f2 = $amount * $f2;

      $f3 = 0;
      $f3 = 5/100;
      $f3 = $amount * $f3;

      $f4 = 0;
      $f4 = 2.5/100;
      $f4 = $amount * $f4;

      $f5 = 0;
      $f5 = 1.25/100;
      $f5 = $amount * $f5;

      $f6 = 0;
      $f6 = 1/100;
      $f6 = $amount * $f6;

      $my_share = 12/100;
      $my_share = $my_share * $amount;
      //check user package if the same


      //add point and 12% to main wallet of user

        $_user = DB::table('users')
        ->Where('username', $my_username)
        ->Where('package_status', 0)
        ->first();

  if($_user && $_user->package_status == 0){

    $my_wallet = DB::table('wallet')
      ->Where('username', $my_username)
      ->first();

  //Bonus
      $points_ = $my_wallet->points + $points;
      $main_wallet = $my_wallet->main_wallet + $my_share;
      $total_balance = $my_wallet->total_balance + $my_share;
  DB::update('update wallet set points = ?, main_wallet = ?, total_balance = ?
  where username = ?',[$points_, $main_wallet, $total_balance, $my_username]);

  $inert_transaction = DB::insert('insert into transactions (
      username,
      type,
      amount,
      discount,
      package,
      status
      )
  values (?, ?, ?, ?, ?, ?)', [
      $my_username,
      'Package Bonus',
      $my_share,
      0,
      $my_package,
      1
  ]);


  $upline = DB::table('users')
  ->Where('username', $_user->referral)
  //->Where('username', $_user->username)
  // ->Where('package', $my_package)
  ->Where('package_status', 1)
  ->first();



  DB::update('update users set package_status = ?
  where username = ?',[1, $my_username]);

      if($upline)
      {

        DB::update('update referrals set status = ?
        where username = ?',[1, $my_username]);

        if($upline)
        {

                    if($this->commissioner($upline->username, $my_username, $my_package) == 0)
                    {
                      $upline_wallet = DB::table('wallet')
                          ->Where('username', $upline->username)
                          ->first();
                          $total_balance = $upline_wallet->total_balance + $f1;
                          $referral_balance = $upline_wallet->referral_balance + $f1;
                          $points_ = $upline_wallet->points + $points;
                          DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
                          where username = ?',[$total_balance, $referral_balance, $points_, $upline->username]);

                           $userx = DB::table('users')
                            ->Where('username', $upline->username)
                            ->Where('package_status', 1)
                            ->first();

                          $downlines = $userx->package_downlines + 1;
                            DB::update('update users set package_downlines = ?
                            where username = ?',[$downlines, $upline->username]);

                      $inert_transaction = DB::insert('insert into transactions (
                              username,
                              type,
                              amount,
                              discount,
                              package,
                              status
                              )
                          values (?, ?, ?, ?, ?, ?)', [
                              $upline->username,
                              'Referral Commission',
                              $f1,
                              0,
                              $my_package,
                              1
                          ]);

                          //add commission table
                          if($inert_transaction){
                          DB::insert('insert into package_admitted (
                              commission_owner,
                              commission_giver,
                              commission_amount,
                              package
                              )
                          values (?, ?, ?, ?)', [
                              $upline->username,
                              $my_username,
                              $f1,
                              $my_package
                          ]);}
  }

  $userx = DB::table('users')
   ->Where('username', $upline->username)
   ->Where('package_status', 1)
   ->first();

  //2nd upline
                          if($userx && $this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null && $upline->username != $userx->referral )
                          {
                            $upline_username = $this->if_user_has_upline_and_same_pck($userx->referral, $my_package);
                            $upline_wallet = DB::table('wallet')
                              ->Where('username', $upline_username)
                              ->first();

                              $userx = DB::table('users')
                                ->Where('username', $upline_username)
                                ->Where('package_status', 1)
                                ->first();

                                if($this->commissioner($upline_username, $my_username, $my_package) == 0){

                              $total_balance = $upline_wallet->total_balance + $f2;
                              $referral_balance = $upline_wallet->referral_balance + $f2;
                              $points_ = $upline_wallet->points + $points;
                              DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
                              where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

                              $inert_transaction = DB::insert('insert into transactions (
                                  username,
                                  type,
                                  amount,
                                  discount,
                                  package,
                                  status
                                  )
                              values (?, ?, ?, ?, ?, ?)', [
                                  $upline_username,
                                  'Referral Commission',
                                  $f2,
                                  0,
                                  $my_package,
                                  1
                              ]);




                              //add commission table
                              if($inert_transaction){
                              DB::insert('insert into package_admitted (
                                  commission_owner,
                                  commission_giver,
                                  commission_amount,
                                  package
                                  )
                              values (?, ?, ?, ?)', [
                                  $upline_username,
                                  $my_username,
                                  $f2,
                                  $my_package
                              ]);}

                            }

                              //3rd upline gen
                              if($userx && $this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null && $upline_username != $userx->referral){
                              //if($this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null){
                                $upline_username = if_user_has_upline_and_same_pck($userx->referral, $my_package);
                                $upline_wallet = DB::table('wallet')
                                  ->Where('username', $upline_username)
                                  ->first();

                                  $userx = DB::table('users')
                                    ->Where('username', $upline_username)
                                    ->Where('package_status', 1)
                                    ->first();
  if($this->commissioner($upline_username, $my_username, $my_package) == 0){
                                  $total_balance = $upline_wallet->total_balance + $f3;
                                  $referral_balance = $upline_wallet->referral_balance + $f3;
                                  $points_ = $upline_wallet->points + $points;
                                  DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
                                  where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

                                  $inert_transaction = DB::insert('insert into transactions (
                                      username,
                                      type,
                                      amount,
                                      discount,
                                      package,
                                      status
                                      )
                                  values (?, ?, ?, ?, ?, ?)', [
                                      $upline_username,
                                      'Referral Commission',
                                      $f3,
                                      0,
                                      $my_package,
                                      1
                                  ]);

                                  //add commission table
                                  if($inert_transaction){
                                  DB::insert('insert into package_admitted (
                                      commission_owner,
                                      commission_giver,
                                      commission_amount,
                                      package
                                      )
                                  values (?, ?, ?, ?)', [
                                      $upline_username,
                                      $my_username,
                                      $f3,
                                      $my_package
                                  ]);
                                }

  }
                                  //4th gen
                                  if($userx && $this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null && $upline_username != $userx->referral){
                                    $upline_username = if_user_has_upline_and_same_pck($userx->referral, $my_package);

                                    $upline_wallet = DB::table('wallet')
                                      ->Where('username', $upline_username)
                                      ->first();

                                      $userx = DB::table('users')
                                        ->Where('username', $upline_username)
                                        ->Where('package_status', 1)
                                        ->first();
  if($this->commissioner($upline_username, $my_username, $my_package) == 0){
                                      $total_balance = $upline_wallet->total_balance + $f4;
                                      $referral_balance = $upline_wallet->referral_balance + $f4;
                                      $points_ = $upline_wallet->points + $points;
                                      DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
                                      where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

                                      $inert_transaction = DB::insert('insert into transactions (
                                          username,
                                          type,
                                          amount,
                                          discount,
                                          package,
                                          status
                                          )
                                      values (?, ?, ?, ?, ?, ?)', [
                                          $upline_username,
                                          'Referral Commission',
                                          $f4,
                                          0,
                                          $my_package,
                                          1
                                      ]);

                                      //add commission table
                                      if($inert_transaction){
                                      DB::insert('insert into package_admitted (
                                          commission_owner,
                                          commission_giver,
                                          commission_amount,
                                          package
                                          )
                                      values (?, ?, ?, ?)', [
                                          $upline_username,
                                          $my_username,
                                          $f4,
                                          $my_package
                                      ]);
  }
                                    }
  //5th
                                      if($userx && $this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null && $upline_username != $userx->referral){
                                          $upline_username = if_user_has_upline_and_same_pck($userx->referral, $my_package);

                                        $upline_wallet = DB::table('wallet')
                                          ->Where('username', $upline_username)
                                          ->first();

                                          $userx = DB::table('users')
                                            ->Where('username', $upline_username)
                                            ->Where('package_status', 1)
                                            ->first();

  if($this->commissioner($upline_username, $my_username, $my_package) == 0){
                                          $total_balance = $upline_wallet->total_balance + $f5;
                                          $referral_balance = $upline_wallet->referral_balance + $f5;
                                          $points_ = $upline_wallet->points + $points;
                                          DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
                                          where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

                                          $inert_transaction = DB::insert('insert into transactions (
                                              username,
                                              type,
                                              amount,
                                              discount,
                                              package,
                                              status
                                              )
                                          values (?, ?, ?, ?, ?, ?)', [
                                              $upline_username,
                                              'Referral Commission',
                                              $f5,
                                              0,
                                              $my_package,
                                              1
                                          ]);

                                          //add commission table
                                          if($inert_transaction){
                                          DB::insert('insert into package_admitted (
                                              commission_owner,
                                              commission_giver,
                                              commission_amount,
                                              package
                                              )
                                          values (?, ?, ?, ?)', [
                                              $upline_username,
                                              $my_username,
                                              $f5,
                                              $my_package
                                          ]);
  }
                                        }

  //6th gen
  if($userx && $this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null && $upline_username != $userx->referral){
    $upline_username = if_user_has_upline_and_same_pck($userx->referral, $my_package);

    $upline_wallet = DB::table('wallet')
      ->Where('username', $upline_username)
      ->first();
  /*
      $userx = DB::table('users')
        ->Where('username', $upline_username)
        ->first();
        */
        if($this->commissioner($upline_username, $my_username, $my_package) == 0)
        {
      $total_balance = $upline_wallet->total_balance + $f6;
      $referral_balance = $upline_wallet->referral_balance + $f6;
      $points_ = $upline_wallet->points + $points;
      DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
      where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

      $inert_transaction = DB::insert('insert into transactions (
          username,
          type,
          amount,
          discount,
          package,
          status
          )
      values (?, ?, ?, ?, ?, ?)', [
          $upline_username,
          'Referral Commission',
          $f6,
          0,
          $my_package,
          1
      ]);

      //add commission table
      if($inert_transaction){
      DB::insert('insert into package_admitted (
          commission_owner,
          commission_giver,
          commission_amount,
          package
          )
      values (?, ?, ?, ?)', [
          $upline_username,
          $my_username,
          $f6,
          $my_package
      ]);
  }
    }

  }
                                      }
                                  }

                              }

                          }

        }


        else if($upline->package_downlines > 9 && $upline->package_downlines < 100){


  if($this->commissioner($upline->username, $my_username, $my_package) == 0){
                        //1st get
                        $upline_wallet = DB::table('wallet')
                          ->Where('username', $upline_username)
                          ->first();
                          $total_balance = $upline_wallet->total_balance + $f2;
                          $referral_balance = $upline_wallet->referral_balance + $f2;
                          $points_ = $upline_wallet->points + $points;
                          DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
                          where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

                          $userx = DB::table('users')
                            ->Where('username', $upline_username)
                            ->Where('package_status', 1)
                            ->first();
                          $downlines = $userx->package_downlines + 1;
                            DB::update('update users set package_downlines = ?
                            where username = ?',[$downlines, $upline_username]);

                            $inert_transaction = DB::insert('insert into transactions (
                                username,
                                type,
                                amount,
                                discount,
                                package,
                                status
                                )
                            values (?, ?, ?, ?, ?, ?)', [
                                $upline_username,
                                'Referral Commission',
                                $f2,
                                0,
                                $my_package,
                                1
                            ]);

                            //add commission table
                            if($inert_transaction){
                            DB::insert('insert into package_admitted (
                                commission_owner,
                                commission_giver,
                                commission_amount,
                                package
                                )
                            values (?, ?, ?, ?)', [
                                $upline_username,
                                $my_username,
                                $f2,
                                $my_package
                            ]);
                          }
  }

  $userx = DB::table('users')
    ->Where('username', $upline->username)
    ->Where('package_status', 1)
    ->first();

  //2nd upline
                            if($userx && $this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null && $upline_username != $userx->referral){
                            $upline_username = if_user_has_upline_and_same_pck($userx->referral, $my_package);

                            $upline_wallet = DB::table('wallet')
                              ->Where('username', $upline_username)
                              ->first();

                              $userx = DB::table('users')
                                ->Where('username', $upline_username)
                                ->Where('package_status', 1)
                                ->first();

  if($this->commissioner($upline_username, $my_username, $my_package) == 0){
                              $total_balance = $upline_wallet->total_balance + $f3;
                              $referral_balance = $upline_wallet->referral_balance + $f3;
                              $points_ = $upline_wallet->points + $points;
                              DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
                              where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

                              $inert_transaction = DB::insert('insert into transactions (
                                  username,
                                  type,
                                  amount,
                                  discount,
                                  package,
                                  status
                                  )
                              values (?, ?, ?, ?, ?, ?)', [
                                  $upline_username,
                                  'Referral Commission',
                                  $f3,
                                  0,
                                  $my_package,
                                  1
                              ]);

                              //add commission table
                              if($inert_transaction){
                              DB::insert('insert into package_admitted (
                                  commission_owner,
                                  commission_giver,
                                  commission_amount,
                                  package
                                  )
                              values (?, ?, ?, ?)', [
                                  $upline_username,
                                  $my_username,
                                  $f3,
                                  $my_package
                              ]);

  }

  }

                              //3rd upline gen
                              if($userx && $this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null && $upline_username != $userx->referral){
                                $upline_username = if_user_has_upline_and_same_pck($userx->referral, $my_package);

                                $upline_wallet = DB::table('wallet')
                                  ->Where('username', $upline_username)
                                  ->first();

                                  $userx = DB::table('users')
                                    ->Where('username', $upline_username)
                                    ->Where('package_status', 1)
                                    ->first();

  if($this->commissioner($upline_username, $my_username, $my_package) == 0){
                                  $total_balance = $upline_wallet->total_balance + $f4;
                                  $referral_balance = $upline_wallet->referral_balance + $f4;
                                  $points_ = $upline_wallet->points + $points;
                                  DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
                                  where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

                                  $inert_transaction = DB::insert('insert into transactions (
                                      username,
                                      type,
                                      amount,
                                      discount,
                                      package,
                                      status
                                      )
                                  values (?, ?, ?, ?, ?, ?)', [
                                      $upline_username,
                                      'Referral Commission',
                                      $f4,
                                      0,
                                      $my_package,
                                      1
                                  ]);

                                  //add commission table
                                  if($inert_transaction){
                                  DB::insert('insert into package_admitted (
                                      commission_owner,
                                      commission_giver,
                                      commission_amount,
                                      package
                                      )
                                  values (?, ?, ?, ?)', [
                                      $upline_username,
                                      $my_username,
                                      $f4,
                                      $my_package
                                  ]);
  }
   }

                                  //4th gen
                                  if($userx && $this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null && $upline_username != $userx->referral){
                                    $upline_username = if_user_has_upline_and_same_pck($userx->referral, $my_package);

                                    $upline_wallet = DB::table('wallet')
                                      ->Where('username', $upline_username)
                                      ->first();

                                      $userx = DB::table('users')
                                        ->Where('username', $upline_username)
                                        ->Where('package_status', 1)
                                        ->first();

  if($this->commissioner($upline_username, $my_username, $my_package) == 0){
                                      $total_balance = $upline_wallet->total_balance + $f5;
                                      $referral_balance = $upline_wallet->referral_balance + $f5;
                                      $points_ = $upline_wallet->points + $points;
                                      DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
                                      where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

                                      $inert_transaction = DB::insert('insert into transactions (
                                          username,
                                          type,
                                          amount,
                                          discount,
                                          package,
                                          status
                                          )
                                      values (?, ?, ?, ?, ?, ?)', [
                                          $upline_username,
                                          'Referral Commission',
                                          $f5,
                                          0,
                                          $my_package,
                                          1
                                      ]);

                                      //add commission table
                                      if($inert_transaction){
                                      DB::insert('insert into package_admitted (
                                          commission_owner,
                                          commission_giver,
                                          commission_amount,
                                          package
                                          )
                                      values (?, ?, ?, ?)', [
                                          $upline_username,
                                          $my_username,
                                          $f5,
                                          $my_package
                                      ]);
  }
  }

  //5th
                                      if($userx && $this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null && $upline_username != $userx->referral){
                                        $upline_username = if_user_has_upline_and_same_pck($userx->referral, $my_package);

                                        $upline_wallet = DB::table('wallet')
                                          ->Where('username', $upline_username)
                                          ->first();

                                          $userx = DB::table('users')
                                            ->Where('username', $upline_username)
                                            ->Where('package_status', 1)
                                            ->first();

  if($this->commissioner($upline_username, $my_username, $my_package) == 0){
                                          $total_balance = $upline_wallet->total_balance + $f6;
                                          $referral_balance = $upline_wallet->referral_balance + $f6;
                                          $points_ = $upline_wallet->points + $points;
                                          DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
                                          where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

                                          $inert_transaction = DB::insert('insert into transactions (
                                              username,
                                              type,
                                              amount,
                                              discount,
                                              package,
                                              status
                                              )
                                          values (?, ?, ?, ?, ?, ?)', [
                                              $upline_username,
                                              'Referral Commission',
                                              $f6,
                                              0,
                                              $my_package,
                                              1
                                          ]);

                                          //add commission table
                                          if($inert_transaction){
                                          DB::insert('insert into package_admitted (
                                              commission_owner,
                                              commission_giver,
                                              commission_amount,
                                              package
                                              )
                                          values (?, ?, ?, ?)', [
                                              $upline_username,
                                              $my_username,
                                              $f6,
                                              $my_package
                                          ]);
  }
  }

  //6th gen
  if($userx && $this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null && $upline_username != $userx->referral){
    $upline_username = if_user_has_upline_and_same_pck($userx->referral, $my_package);
    $upline_wallet = DB::table('wallet')
      ->Where('username', $upline_username)
      ->first();

  if($this->commissioner($upline_username, $my_username, $my_package) == 0){
      $total_balance = $upline_wallet->total_balance + $f6;
      $referral_balance = $upline_wallet->referral_balance + $f6;
      $points_ = $upline_wallet->points + $points;
      DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
      where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

      $inert_transaction = DB::insert('insert into transactions (
          username,
          type,
          amount,
          discount,
          package,
          status
          )
      values (?, ?, ?, ?, ?, ?)', [
          $upline_username,
          'Referral Commission',
          $f6,
          0,
          $my_package,
          1
      ]);

      //add commission table
      if($inert_transaction){
      DB::insert('insert into package_admitted (
          commission_owner,
          commission_giver,
          commission_amount,
          package
          )
      values (?, ?, ?, ?)', [
          $upline_username,
          $my_username,
          $f6,
          $my_package
      ]);
    }
  }

  }
                                      }
                                  }

                              }

                          }


        }

  //LEVEL 3
        else if($upline->package_downlines > 99 && $upline->package_downlines < 1000){

                        //1st get
                        $upline_wallet = DB::table('wallet')
                          ->Where('username', $upline_username)
                          ->first();

                          if($this->commissioner($upline->username, $my_username, $my_package) == 0){
                          $total_balance = $upline_wallet->total_balance + $f3;
                          $referral_balance = $upline_wallet->referral_balance + $f3;
                          $points_ = $upline_wallet->points + $points;
                          DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
                          where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

                          $inert_transaction = DB::insert('insert into transactions (
                              username,
                              type,
                              amount,
                              discount,
                              package,
                              status
                              )
                          values (?, ?, ?, ?, ?, ?)', [
                              $upline_username,
                              'Referral Commission',
                              $f3,
                              0,
                              $my_package,
                              1
                          ]);

                          //add commission table
                          if($inert_transaction){
                          DB::insert('insert into package_admitted (
                              commission_owner,
                              commission_giver,
                              commission_amount,
                              package
                              )
                          values (?, ?, ?, ?)', [
                              $upline_username,
                              $my_username,
                              $f3,
                              $my_package
                          ]);
                        }

  }

  $userx = DB::table('users')
    ->Where('username', $upline->username)
    ->Where('package_status', 1)
    ->first();

  //2nd upline

  if($userx && $this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null && $upline_username != $userx->referral){
    $upline_username = if_user_has_upline_and_same_pck($userx->referral, $my_package);
                            $upline_wallet = DB::table('wallet')
                              ->Where('username', $upline_username)
                              ->first();

                              if($this->commissioner($upline_username, $my_username, $my_package) == 0){
                              $total_balance = $upline_wallet->total_balance + $f4;
                              $referral_balance = $upline_wallet->referral_balance + $f4;
                              $points_ = $upline_wallet->points + $points;
                              DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
                              where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

                              $userx = DB::table('users')
                                ->Where('username', $upline_username)
                                ->Where('package_status', 1)
                                ->first();
                              $downlines = $userx->package_downlines + 1;
                                DB::update('update users set package_downlines = ?
                                where username = ?',[$downlines, $upline_username]);

                                $inert_transaction = DB::insert('insert into transactions (
                                    username,
                                    type,
                                    amount,
                                    discount,
                                    package,
                                    status
                                    )
                                values (?, ?, ?, ?, ?, ?)', [
                                    $upline_username,
                                    'Referral Commission',
                                    $f4,
                                    0,
                                    $my_package,
                                    1
                                ]);

                                //add commission table
                                if($inert_transaction){
                                DB::insert('insert into package_admitted (
                                    commission_owner,
                                    commission_giver,
                                    commission_amount,
                                    package
                                    )
                                values (?, ?, ?, ?)', [
                                    $upline_username,
                                    $my_username,
                                    $f4,
                                    $my_package
                                ]);}

  }

  $userx = DB::table('users')
    ->Where('username', $upline_username)
    ->Where('package_status', 1)
    ->first();

                              //3rd upline gen
                              if($userx && $this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null && $upline_username != $userx->referral){
                                $upline_username = if_user_has_upline_and_same_pck($userx->referral, $my_package);

                                $upline_wallet = DB::table('wallet')
                                  ->Where('username', $upline_username)
                                  ->first();


  if($this->commissioner($upline_username, $my_username, $my_package) == 0){
                                  $total_balance = $upline_wallet->total_balance + $f5;
                                  $referral_balance = $upline_wallet->referral_balance + $f5;
                                  $points_ = $upline_wallet->points + $points;
                                  DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
                                  where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

                                  $inert_transaction = DB::insert('insert into transactions (
                                      username,
                                      type,
                                      amount,
                                      discount,
                                      package,
                                      status
                                      )
                                  values (?, ?, ?, ?, ?, ?)', [
                                      $upline_username,
                                      'Referral Commission',
                                      $f5,
                                      0,
                                      $my_package,
                                      1
                                  ]);

                                  //add commission table
                                  if($inert_transaction){
                                  DB::insert('insert into package_admitted (
                                      commission_owner,
                                      commission_giver,
                                      commission_amount,
                                      package
                                      )
                                  values (?, ?, ?, ?)', [
                                      $upline_username,
                                      $my_username,
                                      $f5,
                                      $my_package
                                  ]);
                                }
  }

  $userx = DB::table('users')
    ->Where('username', $upline_username)
    ->Where('package_status', 1)
    ->first();

                              //4th gen
                                  if($userx && $this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null && $upline_username != $userx->referral){
                                    $upline_username = if_user_has_upline_and_same_pck($userx->referral, $my_package);
                                    $upline_wallet = DB::table('wallet')
                                      ->Where('username', $upline_username)
                                      ->first();

                                      if($this->commissioner($upline_username, $my_username, $my_package) == 0){
                                      $total_balance = $upline_wallet->total_balance + $f6;
                                      $referral_balance = $upline_wallet->referral_balance + $f6;
                                      $points_ = $upline_wallet->points + $points;
                                      DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
                                      where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

                                      $inert_transaction = DB::insert('insert into transactions (
                                          username,
                                          type,
                                          amount,
                                          discount,
                                          package,
                                          status
                                          )
                                      values (?, ?, ?, ?, ?, ?)', [
                                          $upline_username,
                                          'Referral Commission',
                                          $f6,
                                          0,
                                          $my_package,
                                          1
                                      ]);

                                      //add commission table
                                      if($inert_transaction){
                                      DB::insert('insert into package_admitted (
                                          commission_owner,
                                          commission_giver,
                                          commission_amount,
                                          package
                                          )
                                      values (?, ?, ?, ?)', [
                                          $upline_username,
                                          $my_username,
                                          $f6,
                                          $my_package
                                      ]);
  }
                                    }

                                    $userx = DB::table('users')
                                      ->Where('username', $upline_username)
                                      ->Where('package_status', 1)
                                      ->first();

  //5th
  if($userx && $this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null && $upline_username != $userx->referral){
    $upline_username = if_user_has_upline_and_same_pck($userx->referral, $my_package);

                                        $upline_wallet = DB::table('wallet')
                                          ->Where('username', $upline_username)
                                          ->first();

                                          $userx = DB::table('users')
                                            ->Where('username', $upline_username)
                                            ->Where('package_status', 1)
                                            ->first();

  if($this->commissioner($upline_username, $my_username, $my_package) == 0){
                                          $total_balance = $upline_wallet->total_balance + $f6;
                                          $referral_balance = $upline_wallet->referral_balance + $f6;
                                          $points_ = $upline_wallet->points + $points;
                                          DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
                                          where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);


                                          $inert_transaction = DB::insert('insert into transactions (
                                              username,
                                              type,
                                              amount,
                                              discount,
                                              package,
                                              status
                                              )
                                          values (?, ?, ?, ?, ?, ?)', [
                                              $upline_username,
                                              'Referral Commission',
                                              $f6,
                                              0,
                                              $my_package,
                                              1
                                          ]);

                                          //add commission table
                                          if($inert_transaction){
                                          DB::insert('insert into package_admitted (
                                              commission_owner,
                                              commission_giver,
                                              commission_amount,
                                              package
                                              )
                                          values (?, ?, ?, ?)', [
                                              $upline_username,
                                              $my_username,
                                              $f6,
                                              $my_package
                                          ]);

  }
  }
  //6th gen

  $userx = DB::table('users')
    ->Where('username', $upline_username)
    ->Where('package_status', 1)
    ->first();

  if($userx && $this->if_user_has_upline_and_same_pck($userx->referral, $my_package) != null && $upline_username != $userx->referral){
    $upline_username = if_user_has_upline_and_same_pck($userx->referral, $my_package);
    $upline_wallet = DB::table('wallet')
      ->Where('username', $upline_username)
      ->first();

      if($this->commissioner($upline_username, $my_username, $my_package) == 0){
      $total_balance = $upline_wallet->total_balance + $f6;
      $referral_balance = $upline_wallet->referral_balance + $f6;
      $points_ = $upline_wallet->points + $points;
      DB::update('update wallet set total_balance = ?, referral_balance = ?, points = ?
      where username = ?',[$total_balance, $referral_balance, $points_, $upline_username]);

      $inert_transaction = DB::insert('insert into transactions (
          username,
          type,
          amount,
          discount,
          package,
          status
          )
      values (?, ?, ?, ?, ?, ?)', [
          $upline_username,
          'Referral Commission',
          $f6,
          0,
          $my_package,
          1
      ]);

      //add commission table
      if($inert_transaction){
      DB::insert('insert into package_admitted (
          commission_owner,
          commission_giver,
          commission_amount,
          package
          )
      values (?, ?, ?, ?)', [
          $upline_username,
          $my_username,
          $f6,
          $my_package
      ]);
  }
  }

  }
                                      }
                                  }

                              }

                          }


        }
  }

return true;

}
else
{
  return false;
}

return false;

  }

public function activateAccount($upline_username, $my_username, $my_package)
{
  $web_settings = DB::table('website_settings')
  ->Where('id', 1)
  ->first();
  if($web_settings->package_type == "affiliate")
  {
    return $this->calculate_affiliate_earnings($my_username, $my_package);
  }
  else
  {
    return $this->calculate_multi_level_earnings($upline_username, $my_username, $my_package);
  }
}




}

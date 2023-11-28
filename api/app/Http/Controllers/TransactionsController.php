<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\ActivationController;
class TransactionsController extends Controller
{

    public function __construct()
    {
        # By default we are using here auth:api middleware
        $this->middleware('auth:api', ['except' => ['']]);
    }

  public function calculate_commission_and_points($upline_username, $my_username, $my_package)
  {
    $activation = new ActivationController;
    return $activation->activateAccount($upline_username, $my_username, $my_package);
}


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


    public function transactions(Request $request, $num){
        $token_check = $this->check_login_token();
        $user_id=$token_check;

        if($token_check != 0)
        {
            $user = DB::table('users')
            ->Where('id', $user_id)
            ->first();

            $transactions = DB::table('transactions')
            ->Where('username', auth()->user()->username)
            ->orderBy('id', 'desc')
            ->take($num)
            ->get();

            return response()->json(['status' => 1,
            'message' => 'Pending Payment', 'result' => $transactions], 200);
        }
        else
        {
            return response()->json(['status' => 0, 'message' => 'Access Denied!', 'result' => []], 401);
        }
    }


    public function search_transactions(Request $request, $search){
        $token_check = $this->check_login_token();
        $user_id=$token_check;

        $num = 100;

        if($token_check != 0)
        {
            $user = DB::table('users')
            ->Where('id', $user_id)
            ->first();

            $transactions = DB::table('transactions')
            ->Where('username', auth()->user()->username)
            ->Where('type', $search)
            ->orderBy('id', 'desc')
            ->take($num)
            ->get();

            if(strlen($transactions) < 3){
                $transactions = DB::table('transactions')
                ->Where('username', auth()->user()->username)
                ->Where('phone', $search)
                ->orderBy('id', 'desc')
                ->take($num)
                ->get();
                if(strlen($transactions) < 3){
                    $transactions = DB::table('transactions')
                    ->Where('username', auth()->user()->username)
                    ->Where('sender', $search)
                    ->orderBy('id', 'desc')
                    ->take($num)
                    ->get();
                    if(strlen($transactions) < 3){
                        $transactions = DB::table('transactions')
                        ->Where('username', auth()->user()->username)
                        ->Where('receiver', $search)
                        ->orderBy('id', 'desc')
                        ->take($num)
                        ->get();
                        if(strlen($transactions) < 3){
                            $transactions = DB::table('transactions')
                            ->Where('username', auth()->user()->username)
                            ->Where('amount', $search)
                            ->orderBy('id', 'desc')
                            ->take($num)
                            ->get();
                            if(strlen($transactions) < 3){
                                $transactions = DB::table('transactions')
                                ->Where('username', auth()->user()->username)
                                ->Where('package', $search)
                                ->orderBy('id', 'desc')
                                ->take($num)
                                ->get();
                                if(strlen($transactions) < 3){
                                    $transactions = DB::table('transactions')
                                    ->Where('username', auth()->user()->username)
                                    ->Where('phone', $search)
                                    ->orderBy('id', 'desc')
                                    ->take($num)
                                    ->get();
                                }
                            }
                        }
                    }
                }
            }

                                    return response()->json(['status' => 1,
            'message' => 'Pending Payment', 'result' => $transactions], 200);
        }
        else
        {
            return response()->json(['status' => 0, 'message' => 'Access Denied!', 'result' => []], 401);
        }
    }

    public function view_transactions(Request $request, $id){
        $token_check = $this->check_login_token();
        $user_id=$token_check;

        $num = 100;

        if($token_check != 0)
        {
            $user = DB::table('users')
            ->Where('id', $user_id)
            ->first();

            $transactions = DB::table('transactions')
            ->Where('username', auth()->user()->username)
            ->Where('id', $id)
            ->first();

            return response()->json(['status' => 1,
            'message' => 'Pending Payment', 'result' => $transactions], 200);
        }
        else
        {
            return response()->json(['status' => 0, 'message' => 'Access Denied!', 'result' => []], 401);
        }
    }


    public function cashback_transactions(Request $request, $num){
        $token_check = $this->check_login_token();
        $user_id=$token_check;

        if($token_check != 0)
        {
            $user = DB::table('users')
            ->Where('id', $user_id)
            ->first();

            $transactions = DB::table('transactions')
            ->Where('username', auth()->user()->username)
            ->Where('cash_back', '>', 0)
            ->orderBy('id', 'desc')
            ->take($num)
            ->get();

            return response()->json(['status' => 1,
            'message' => 'Pending Payment', 'result' => $transactions], 200);
        }
        else
        {
            return response()->json(['status' => 0, 'message' => 'Access Denied!', 'result' => []], 401);
        }
    }


    public function transfer(Request $request){
        $validator = Validator::make($request->all(), [
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

            /* if($receiverAccount)
            {

            } */

        if(!is_numeric($amount)){
            return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
        }
        else if($amount > $checkWallet->main_wallet)
        {
            return response()->json(['status' => 0, 'message' => 'Amount is beyond the amount in main wallet. Add fund to continue with transaction.'], 401);
        }
        else if(!is_numeric($amount))
        {
            return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
        }
        else if($amount < 50)
        {
            return response()->json(['status' => 0, 'message' => 'Amount is too low. Minimum is 50'], 401);
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

              $sender =  auth()->user()->username;

              $wallet = DB::table('wallet')
              ->Where('username', $sender)
              ->first();

              if($amount > $wallet->main_wallet)
              {
                  return response()->json(['status' => 0, 'message' => 'Amount is beyond the amount in main wallet. Add fund to continue with transaction.'], 401);
              }
              else
              {
                //Carry out transaction;

                    $receiver_wallet = DB::table('wallet')
                    ->Where('username', $receiverAccount->username)
                    ->first();

                    $main_wallet = $wallet->main_wallet - $amount;
                    $total_balance = $wallet->total_balance - $amount;

                    $receiver_main_wallet = $receiver_wallet->main_wallet + $amount;
                    $receiver_total_balance = $receiver_wallet->total_balance + $amount;

                //decduct from sender
                    DB::update('update wallet set main_wallet = ?, total_balance = ?
                    where username = ?',[$main_wallet, $total_balance, $sender]);
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

              }


            }else{
              return response()->json(['status' => 0, 'message' => 'Transfer failed.'], 401);
            }


}

    }

    public function verify_transaction(Request $request, $transaction_id){

      $api = DB::table('api_keys')
      ->Where('api_provider', 'flutterwave')
      ->first();

      $amount = 0;

      //flutterwave
      $service_url     = $api->end_point.'/transactions/'.$transaction_id.'/verify';
              $curl            = curl_init($service_url);
              //curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
              //curl_setopt($curl, CURLOPT_HTTPHEADER, array('Authorization: Bearer '.$api->api_secret_key.''));
              curl_setopt($curl, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json',
  'Authorization: Bearer '.$api->api_secret_key.''
]);
              curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
              curl_setopt($curl, CURLOPT_POST, false);
              curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
              $curl_response   = curl_exec($curl);
              curl_close($curl);
              $json_objekat    = json_decode($curl_response);
              $data          = $json_objekat->status;
              if($data != "error"){
                $amount = $json_objekat->data->amount;
              }
            //

//return response()->json(['status' => 0, 'message' =>$data], 401);

        $token_check = $this->check_login_token();
        $user_id=$token_check;

        $settings = DB::table('settings')
        ->Where('id', 1)
        ->first();

        $transactions_check = DB::table('transactions')
        ->Where('transaction_id', $transaction_id)
        ->Where('status', 1)
        ->count();

        if($token_check != 0 && $transactions_check < 1 && $data == "success")
        {
            $user = DB::table('users')
            ->Where('id', $user_id)
            ->first();

            if($user->package_status == 0 && $user->package_amount == $amount){

//share bonus and activate account
            //  if($user->referral != null && $user->referral != ''){
              //}

              $transactions = DB::table('transactions')
              ->Where('username', auth()->user()->username)
              ->Where('package', $user->package)
              ->Where('status', 0)
              ->first();

              DB::update('update transactions set status = ?, network = ?
              where status = ? and package = ? and username = ?',[1, "ATM Card", 0, $user->package, auth()->user()->username]);


              $this->calculate_commission_and_points($user->referral, auth()->user()->username, $user->package);


              //add to main wallet and deduct package amount
              $user_wallet = DB::table('wallet')
                ->Where('username', auth()->user()->username)
                ->first();

/* if($user_wallet){
  $amount_remaining = $amount - $user->package_amount;
  $total_balance = $user_wallet->total_balance + $amount_remaining;
  $main_balance = $user_wallet->main_wallet + $amount_remaining;
  DB::update('update wallet set total_balance = ?, main_wallet = ?
  where username = ?',[$total_balance, $main_balance, auth()->user()->username]);

} */

            }

            else
            {
              $user_wallet = DB::table('wallet')
                ->Where('username', auth()->user()->username)
                ->first();
              $total_balance = $user_wallet->total_balance + $amount;
              $main_balance = $user_wallet->main_wallet + $amount;
              DB::update('update wallet set total_balance = ?, main_wallet = ?
              where username = ?',[$total_balance, $main_balance, auth()->user()->username]);
            }

//inset
            DB::insert('insert into transactions (
                username,
                transaction_id,
                type,
                amount,
                discount,
                status
                )
            values (?, ?, ?, ?, ?, ?)', [
                auth()->user()->username,
                $transaction_id,
                'Deposit',
                $amount,
                0,
                1
            ]);

            return response()->json(['status' => 1,
            'message' => 'Transaction Completed'], 200);
        }
        else
        {
            return response()->json(['status' => 0, 'message' => 'Invalid Transaction!', 'result' => null], 401);
        }
    }

    public function activate_package_from_wallet(Request $request){

      $api = DB::table('api_keys')
      ->Where('api_provider', 'flutterwave')
      ->first();

      $amount = 0;

        $token_check = $this->check_login_token();
        $user_id=$token_check;

        $settings = DB::table('settings')
        ->Where('id', 1)
        ->first();

        if($token_check != 0)
        {
            $user = DB::table('users')
            ->Where('id', $user_id)
            ->first();

            $amount = $user->package_amount;

            $wallet = DB::table('wallet')
            ->Where('username', auth()->user()->username)
            ->first();


            if($user->package_status == 0){

    if($amount > $wallet->main_wallet){
    return response()->json(['status' => 0, 'message' => 'Main wallet balance too low.', 'result' => 'Empty'], 401);
    }
    else{
      //share bonus and activate account

                $transactions = DB::table('transactions')
                ->Where('username', auth()->user()->username)
                ->Where('package', $user->package)
                ->Where('status', 0)
                ->first();

                DB::update('update transactions set status = ?
                where status = ? and package = ? and username = ?',[1, 0, $user->package, auth()->user()->username]);


                $this->calculate_commission_and_points($user->referral, auth()->user()->username, $user->package);


                //add to main wallet and deduct package amount
                $user_wallet = DB::table('wallet')
                  ->Where('username', auth()->user()->username)
                  ->first();
      if($user_wallet){
    //  $amount_remaining = $amount - $user->package_amount;
      $total_balance = $user_wallet->total_balance - $amount;
      $main_balance = $user_wallet->main_wallet - $amount;
      DB::update('update wallet set total_balance = ?, main_wallet = ?
      where username = ?',[$total_balance, $main_balance, auth()->user()->username]);

      }

      DB::insert('insert into transactions (
          username,
          type,
          amount,
          discount,
          status
          )
      values (?, ?, ?, ?, ?)', [
          auth()->user()->username,
          'Withdrawn',
          $amount,
          0,
          1
      ]);

      return response()->json(['status' => 1,
      'message' => 'Package Activated'], 200);

    }


            }
            else
            {
              return response()->json(['status' => 0, 'message' => 'Package already activated', 'result' => null], 401);
            }

        }
        else
        {
            return response()->json(['status' => 0, 'message' => 'Invalid Transaction!', 'result' => null], 401);
        }
    }

    public function verify_withdrawal_input(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'network' => 'required|string',
            'wallet' => 'required|string',
            'amount' => 'required|numeric',
            'username' => 'required|string'
        ]);

        $network = $request->network;
        $wallet = $request->wallet;
        $amount = $request->amount;

        if(!is_numeric($request->amount))
        {
            return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
        }

        else if($network == "Bank" && $amount < 5000)
        {
            return response()->json(['status' => 0, 'message' => 'Amount is too low. Minimum is 5000.'], 401);
        }
        else if($amount < 50)
        {
            return response()->json(['status' => 0, 'message' => 'Amount is too low. Minimum is 50.'], 401);
        }
        else if($network == null){
            return response()->json(['status' => 0, 'message' => 'No withdrawal method selected.'], 401);
        }
        else if($wallet == null){
            return response()->json(['status' => 0, 'message' => 'No wallet selected.'], 401);
        }
        else if($validator->fails()){
  //return $validator->errors();
            return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
        }
        else
        {

            $user_pack = DB::table('users')
            ->Where('username', $request->username)
            ->Where('package', '!=', 'Free Account')
            ->Where('package_status', 1)
            ->first();

            if($user_pack)
{
                    $settings = DB::table('settings')
                    ->Where('id', 1)
                    ->first();

}

return response()->json(['status' => 1, 'message' => 'Details OK.',
            'amount' => $amount], 200);

        }
    }

    public function withdraw(Request $request){

        $validator = Validator::make($request->all(), [
            'network' => 'required|string',
            'network_desc' => 'required|string',
            'amount' => 'required|numeric',
            'pin' => 'required|numeric',
            'slug' => 'required|string',
            'username' => 'required|string',
        ]);

        $settings = DB::table('settings')
        ->Where('id', 1)
        ->first();

        $slug = $request->slug;
        $network = $request->network;
        $amount = $request->amount;
        $network_desc=$request->network_desc;

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
        else if($slug == "cash_back" && $request->amount > $checkWallet->cashback_balance){
            return response()->json(['status' => 0, 'message' => 'Amount is beyond the amount in cash back wallet.'], 401);
        }
        else if($slug == "referral" && $request->amount > $checkWallet->referral_balance){
            return response()->json(['status' => 0, 'message' => 'Amount is beyond the amount in referral commission wallet.'], 401);
        }
        else if(!is_numeric($request->amount)){
            return response()->json(['status' => 0, 'message' => 'Amount is invalid.'], 401);
        }
        else if($network == "Bank" && $amount < 5000)
        {
            return response()->json(['status' => 0, 'message' => 'Amount is too low. Minimum is 5000.'], 401);
        }
        else if($amount < 50){
            return response()->json(['status' => 0, 'message' => 'Amount is too low.'], 401);
        }
        else if($network == null){
            return response()->json(['status' => 0, 'message' => 'No package selected.'], 401);
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

     $data  = true;


if($data == true){
    $wallet = DB::table('wallet')
    ->Where('username', $request->username)
    ->first();
    $new_main_balance=0;
    $new_total_balance=0;
    $withdrawn=0;
    $new_selected_wallet_balance=0;

    if($slug == "cash_back" && $network == "Main Wallet"){
    $new_main_balance = $wallet->main_wallet + $amount;
    $new_selected_wallet_balance = $wallet->cashback_balance - $amount;
    $new_total_balance = $wallet->total_balance - $amount;
    $withdrawn=$wallet->cashback_withdrawn + $amount;
    DB::update('update wallet set total_balance = ?, cashback_balance = ?, main_wallet = ?, cashback_withdrawn = ?
    where username = ?',[$new_total_balance, $new_selected_wallet_balance, $new_main_balance, $withdrawn, $request->username]);
}

else if($slug == "referral" && $network == "Main Wallet"){
    $new_main_balance = $wallet->main_wallet + $amount;
    $new_selected_wallet_balance = $wallet->referral_balance - $amount;
    $new_total_balance = $wallet->total_balance - $amount;
    $withdrawn=$wallet->referral_withdrawn + $amount;
    DB::update('update wallet set total_balance = ?, referral_balance = ?, main_wallet = ?, referral_withdrawn = ?
    where username = ?',[$new_total_balance, $new_selected_wallet_balance, $new_main_balance, $withdrawn, $request->username]);
}

else if($slug == "referral" && $network == "Bank"){
    //$new_main_balance = $wallet->main_wallet + $amount;
    $new_selected_wallet_balance = $wallet->referral_balance - $amount;
    $new_total_balance = $wallet->total_balance - $amount;
    $withdrawn=$wallet->referral_withdrawn + $amount;
    DB::update('update wallet set total_balance = ?, referral_balance = ?, referral_withdrawn = ?
    where username = ?',[$new_total_balance, $new_selected_wallet_balance, $withdrawn, $request->username]);
}
else if($slug == "cash_back" && $network == "Bank"){
//    $new_main_balance = $wallet->main_wallet + $amount;
    $new_selected_wallet_balance = $wallet->cashback_balance - $amount;
    $new_total_balance = $wallet->total_balance - $amount;
    $withdrawn=$wallet->cashback_withdrawn + $amount;
    DB::update('update wallet set total_balance = ?, cashback_balance = ?, cashback_withdrawn = ?
    where username = ?',[$new_total_balance, $new_selected_wallet_balance, $withdrawn, $request->username]);
}

if($network == "Main Wallet"){
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
    "",
    $request->network,
    0,
    0,
    'Withdraw',
    1
    ]);
    return response()->json(['status' => 1, 'message' => 'Transaction Successful!'], 200);
}
else if($network == "Bank"){
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
    "",
    $request->network,
    0,
    0,
    'Withdraw',
    0
    ]);
    return response()->json(['status' => 1, 'message' => 'Transaction successful and pending approval. We will review and get back as soon as possible.'], 200);
}
else
{
    return response()->json(['status' => 0, 'message' => 'Transaction failed. Please try again later or select another mode of withdrawal.'], 401);
}

}
else
{
    return response()->json(['status' => 0, 'message' => 'Transaction failed. Please try again later.'], 401);
}

    }

    }


}

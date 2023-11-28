<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\MailerController ;

class UsersController extends Controller
{

    public function __construct()
    {
        # By default we are using here auth:api middleware
        $this->middleware('auth:api', ['except' => ['']]);
    }

    public function sendMail($subject, $to, $from, $msg)
    {
        $mailer = new MailerController;
        $mailer->sendMail($subject, $to, $msg);
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

    public function get_user_details(Request $request){
        $token_check = $this->check_login_token();
        $user_id=$token_check;
        if($token_check != 0)
        {
            $user = DB::table('users')
            ->Where('id', $user_id)
            ->first();

            $wallet = DB::table('wallet')
            ->Where('username', auth()->user()->username)
            ->get();

            $bank = DB::table('bank_account')
            ->Where('username', auth()->user()->username)
            ->first();


            $referrals = DB::table('referrals')
            ->Where('referrer', auth()->user()->username)
            ->count();

            return response()->json(['status' => 1,
            'message' => 'Access Granted!',
            'result' => [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'phone' => $user->phone,
                'email' => $user->email,
                'package' => $user->package,
                'country' => $user->country,
                'package_amount' => $user->package_amount,
                'package_status' => $user->package_status,
                'username' => auth()->user()->username,
                'referrals' => $referrals,
                'pin' => $user->pin,
                'role' => $user->role

              ], 'wallet' => $wallet, 'bank' => $bank], 200);
        }
        else
        {
            return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
        }
    }

    public function virtual_account_details(Request $request){
        $token_check = $this->check_login_token();
        $user_id=$token_check;
        if($token_check != 0)
        {
            $user = DB::table('users')
            ->Where('id', $user_id)
            ->first();

            $monnify = DB::table('monnify')
            ->Where('username', auth()->user()->username)
            ->first();

            $flutterwave = DB::table('flutterwave_accounts')
            ->Where('username', auth()->user()->username)
            ->first();

            if($monnify && $monnify != null){
                return response()->json(['status' => 1,
                'message' => 'Access Granted!',
                'result' => $monnify], 200);
            }
            else if($flutterwave && $flutterwave != null){
                return response()->json(['status' => 1,
                'message' => 'Access Granted!',
                'result' => $flutterwave], 200);
            }
else{
    return response()->json(['status' => 0, 'message' => 'Virtual Account not found!'], 401);
}


        }
        else
        {
            return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
        }

    }

    public function check_pending_package(Request $request){
        $token_check = $this->check_login_token();
        $user_id=$token_check;

        if($token_check != 0)
        {
            $user = DB::table('users')
            ->Where('id', $user_id)
            ->Where('package', '!=', 'Free Account')
            ->Where('package', '!=', '')
            ->Where('package_status', 0)
            ->first();

            if($user && $user->package != "Free Account")
            {

              $transactions = DB::table('transactions')
              ->Where('username', auth()->user()->username)
              ->Where('type', 'Package')
              ->Where('status', 0)
              ->first();
              if(!$transactions){
                //$transactions = [];
                return response()->json(['status' => 0, 'message' => 'No pending package found!'], 401);
              }else{
                return response()->json(['status' => 1,
                'message' => 'Pending Payment', 'result' => $transactions], 200);
              }


            }
            else
            {
              return response()->json(['status' => 0, 'message' => 'No pending package found!'], 401);
            }


        }
        else
        {
            return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
        }
    }

    public function update_user_account(Request $request)
    {
        $validator = Validator::make($request->all(), [
          'login_token' => 'required|string|min:3',
          'first_name' => 'required|string|min:3',
            'last_name' => 'required|string|min:3',
            'phone' => 'required|string|min:7'
        ]);
/*
        $ifEmailExists = DB::table('users')
        ->Where('email', $request->email)
        ->count(); */


/*
        if($ifEmailExists > 1){
            return response()->json(['status' => 0, 'message' => 'Email address already in Use'], 401);
        } */
          if(!is_numeric($request->phone)){
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

          $token_check = $this->check_login_token();
          $user_id=$token_check;

          if($token_check != 0)
          {
              $user = DB::table('users')
              ->Where('id', $user_id)
              ->first();


                      $ifPhoneExists = DB::table('users')
                      ->Where('phone', $request->phone)
                      ->Where('username', '!=', auth()->user()->username)
                      ->count();

              if($ifPhoneExists > 1){
                 return response()->json(['status' => 0, 'message' => 'Phone number already in Use'], 401);
             }
             else{
               $update = DB::update('update users set first_name = ?, last_name = ?, phone = ?
               where username = ?',[$request->first_name, $request->last_name, $request->phone, auth()->user()->username]);

          if($update)
           {
             return response()->json(['status' => 1, 'message' => 'Account updated.'], 200);
           }
           else
           {
             return response()->json(['status' => 0, 'message' => 'Account updated failed.'], 401);
           }

             }

            }else{
              return response()->json(['status' => 0, 'message' => 'Access Denied!.'], 401);
            }

        }
    }


    public function upgrade(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'package' => 'required|string',

        ]);

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
        ->Where('username', auth()->user()->username)
        ->first();

        if($user->package_amount >= $package_amount){
            return response()->json(['status' => 0, 'message' => 'Select a higher package to upgrade'], 401);
        }
        else if($validator->fails()){
  //return $validator->errors();
            return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
        }
        else
        {

          //decline all pending package if available
          DB::update('update transactions set status = ?
          where type = ? and status = ? and username = ?',[2, 'Package', 0, auth()->user()->username]);

//insert new package transaction
          DB::insert('insert into transactions (
              username,
              type,
              amount,
              discount,
              package
              )
          values (?, ?, ?, ?, ?)', [
              auth()->user()->username,
              'Package',
              $package_amount,
              0,
              $request->package
          ]);

            DB::update('update users set package = ?, package_amount = ?, package_status = ?, package_downlines = ?
            where username = ?',[$request->package, $package_amount, 0, 0, auth()->user()->username]);

            return response()->json(['status' => 1, 'message' => 'Package Changed!'], 200);
        }
    }

    public function activate_with_wallet(Request $request)
    {

        $settings = DB::table('settings')
        ->Where('id', 1)
        ->first();

        $validator = Validator::make($request->all(), [
            'package' => 'required|string'
        ]);

        $username = auth()->user()->username;
        $package = $request->package;


        $user = DB::table('users')
        ->Where('username', $username)
        ->count();

        if(!$user)
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
                $ref = DB::table('referrals')
                ->Where('username', $username)
//                ->Where('status', 0)
                ->first();

    if($ref){
    DB::update('update referrals set status = ?
    where username = ?',[1, $username]);

    //calculate 25% ref commission
    $package_amount = DB::table('users')
                ->Where('username', $username)
                ->value('package_amount');

    $rate = 100 / $settings->referral_commission;
    $rate = $rate * $package_amount;
    //referrer wallet

    $ref_wallet = DB::table('wallet')
                ->Where('username', $ref->referrer)
                ->first();
                $total_balance = $ref_wallet->total_balance + $rate;
                $referral_balance = $ref_wallet->referral_balance + $rate;
                DB::update('update wallet set total_balance = ?, referral_balance = ?
                where username = ?',[$total_balance, $referral_balance, $ref->referrer]);

    //Insert transaction
    DB::insert('insert into transactions (
    username,
    type,
    amount,
    discount,
    package,
    status
    )
    values (?, ?, ?, ?, ?, ?)', [
    $ref->referrer,
    'Ref Commission',
    $rate,
    0,
    $package,
    1
    ]);

    }


    DB::update('update coupons set status = ?, user = ?
    where coupon = ?',[1, $username, $coupon]);

    DB::update('update users set package_status = ?
    where username = ?',[1, $username]);

    DB::update('update transactions set status = ?, username = ?
            where status = ? and package = ?',[1, $username, 0, $package]);

            return response()->json(['status' => 1, 'message' => 'Package Activated.'], 200);
        }
    }

    public function referral_list(Request $request, $num){
        $token_check = $this->check_login_token();
        $user_id=$token_check;

        if($token_check != 0)
        {
            $user = DB::table('users')
            ->Where('id', $user_id)
            ->first();

            $referrals = DB::table('referrals')
            ->Where('referrer', auth()->user()->username)
            ->orderBy('id', 'desc')
            ->take($num)
            ->get();

            return response()->json(['status' => 1,
            'message' => 'Pending Payment', 'result' => $referrals], 200);
        }
        else
        {
            return response()->json(['status' => 0, 'message' => 'Access Denied!', 'result' => []], 401);
        }
    }

    public function verify_bank_account(Request $request, $account_number, $bank_code)
    {
        $token_check = $this->check_login_token();
        $user_id=$token_check;
        if($token_check != 0)
        {

        $api_keys = DB::table('api_keys')
        ->Where('api_provider', 'flutterwave')
        ->first();

        $url = $api_keys->end_point."/accounts/resolve";

        $data = [
            "account_number" => $account_number,
            "account_bank" => $bank_code
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
    'Authorization: Bearer '.$api_keys->api_secret_key.''
  ]);
// Execute cURL request with all previous settings
$response = curl_exec($curl);
$json_obj   = json_decode($response);
              $response = $json_obj->status;
// Close cURL session
curl_close($curl);

if($json_obj->status == "success"){
        //return $result;
        return response()->json(['status' => 1,
        'message' => "Successful",
        'account_name' => $json_obj->data->account_name,
        'account_number' => $json_obj->data->account_number], 200);
    }
    else{
        return response()->json(['status' => 0, 'message' => "Account number not verified. Please try again."], 401);
    }
    }
    else{
        return response()->json(['status' => 0, 'message' => "Access Denied!"], 401);
    }

    }

    public function add_bank_account(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'bank_name' => 'required|string',
            'bank_code' => 'required|string',
            'account_name' => 'required|string',
            'account_number' => 'required|string',

        ]);

        $ifAccountNumberExists = DB::table('bank_account')
        ->Where('bank_name', $request->bank_name)
        ->Where('account_number', $request->account_number)
        ->count();

        $ifAccountUserExists = DB::table('bank_account')
        ->Where('username', auth()->user()->username)
        ->count();

        if( $ifAccountUserExists > 0){
            return response()->json(['status' => 0, 'message' => 'Sorry, you can not add more account'], 401);
        }

        else if( $ifAccountNumberExists > 0){
            return response()->json(['status' => 0, 'message' => 'Account already exists'], 401);
        }
        else if($validator->fails())
        {
            return response()->json(['status' => 0, 'message' => 'An error occured, please try again'], 401);
        }
        else {

                        $user = DB::table('users')
                        ->where('username', auth()->user()->username)
                        ->first();
                        $user_agent = $_SERVER['HTTP_USER_AGENT'];
                        $ip_address = $_SERVER['REMOTE_ADDR'];
                        DB::insert('insert into bank_account (
                            username,
                            bank_name,
                            bank_code,
                            account_name,
                            account_number
                            )
                        values (?, ?, ?, ?, ?)', [
                            auth()->user()->username,
                            $request->bank_name,
                            $request->bank_code,
                            $request->account_name,
                            $request->account_number
                        ]);
                        $message = "Hi ".$user->first_name.",<br>You recently added a bank account to your profile on topupearn. If this is not from you, kindly contact us as soon as possible.<br><br>Regards!";
                        $send_mail = $this->sendMail("topupearn Bank Account", $user->email, "no_reply@topupearn.com", $message);
                        return response()->json(['status' => 1, 'message' => 'Your bank account has been successfully added.'], 200);
                    }

    }



}

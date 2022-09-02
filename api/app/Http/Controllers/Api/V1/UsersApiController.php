<?php

namespace App\Http\Controllers\Api\V1; //namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

use App\Http\Controllers\MailerController;

use App\Http\Controllers\Api\V1\VerifyApiController;

class UsersApiController extends Controller
{

    public function sendMail($subject, $to, $from, $msg)
    {
        $mailer = new MailerController;
        $mailer->sendMail($subject, $to, $msg);
    }


    public function check_login_token($login_token){
      $verify = new VerifyApiController;
      return $verify->check_api_token($login_token);
    }

    public function get_user_details(Request $request, $login_token){
        $token_check = $this->check_login_token($login_token);
        $user_id=$token_check;
        if($token_check != 0)
        {
            $user = DB::table('users')
            ->Where('id', $user_id)
            ->first();

            $wallet = DB::table('wallet')
            ->Where('username', $user->username)
            ->get();

            $bank = DB::table('bank_account')
            ->Where('username', $user->username)
            ->first();


            $referrals = DB::table('referrals')
            ->Where('referrer', $user->username)
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
                'username' => $user->username,
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

    public function virtual_account_details(Request $request, $login_token){
        $token_check = $this->check_login_token($login_token);
        $user_id=$token_check;
        if($token_check != 0)
        {
            $user = DB::table('users')
            ->Where('id', $user_id)
            ->first();

            $monnify = DB::table('monnify')
            ->Where('username', $user->username)
            ->first();

if($monnify && $monnify != null){
    return response()->json(['status' => 1,
    'message' => 'Access Granted!',
    'monnify' => $monnify], 200);
}
else{
    return response()->json(['status' => 0, 'message' => 'Monnify Account not found!'], 401);
}


        }
        else
        {
            return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
        }

    }




}

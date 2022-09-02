<?php

namespace App\Http\Controllers;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

use App\Http\Controllers\MailerController ;

class AuthController extends Controller
{

    public function sendMail($subject, $to, $from, $msg)
    {
        $mailer = new MailerController;
        $mailer->sendMail($subject, $to, $msg);
    }

    public function signup(Request $request)
    {
      $role = "User";
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|min:3',
            'last_name' => 'required|string|min:3',
            'phone' => 'required|string|min:7',
            'email' => 'required|email',
            'username' => 'required|string',
            'country' => 'required|string|min:3',
            'package' => 'required|string',
            'password' => 'required|string|min:6',
            'password2' => 'required|string|min:6'
        ]);

        $ifEmailExists = DB::table('users')
        ->Where('email', $request->email)
        ->count();

        $ifPhoneExists = DB::table('users')
        ->Where('phone', $request->phone)
        ->count();

        $ifUsernameExists = DB::table('users')
        ->Where('username', $request->username)
        ->count();

        $ifFirstUser = DB::table('users')->count();

        $referral_ok = 1;
        if(strlen($request->referral) > 0){
            $ifReferralExists = DB::table('users')
            ->Where('username', $request->referral)
            ->count();
            if($ifReferralExists < 1)
            {
                $referral_ok = 0;
            }
        }

        //make admin if user is first to signup
        if($ifFirstUser < 1){
          $role = "Admin";
        }

        if($ifEmailExists > 0){
            return response()->json(['status' => 0, 'message' => 'Email address already in Use'], 401);
        }
        else if($ifPhoneExists > 0){
            return response()->json(['status' => 0, 'message' => 'Phone number already in Use'], 401);
        }
        else if($ifUsernameExists > 0){
            return response()->json(['status' => 0, 'message' => 'Username already in Use'], 401);
        }
        else if ($request->country == null) {
            return response()->json(['status' => 0, 'message' => 'Country not selected'], 401);
        }
        else if (strpbrk($request->username, ' ') !== false) {
            return response()->json(['status' => 0, 'message' => 'Username should not have white space'], 401);
        }
        else if($request->phone[0] == 0){
            return response()->json(['status' => 0, 'message' => 'Phone number can not start with zero (0).'], 401);
        }
        else if(!is_numeric($request->phone)){
            return response()->json(['status' => 0, 'message' => 'Phone number must be in digits.'], 401);
        }
        else if(strlen($request->phone) < 7){
            return response()->json(['status' => 0, 'message' => 'Phone number too short.'], 401);
        }
        else if (!filter_var($request->email, FILTER_VALIDATE_EMAIL)){
            return response()->json(['status' => 0, 'message' => 'Email address not accepted.'], 401);
        }
        else if(strlen($request->password) < 6){
            return response()->json(['status' => 0, 'message' => 'Password should be at least 6 characters long.'], 401);
        }
        else if($request->password != $request->password2){
            return response()->json(['status' => 0, 'message' => 'Passwords do not match.'], 401);
        }
        else if($validator->fails()){
//return $validator->errors();
            return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
        }
        else if ($referral_ok == 0) {
            return response()->json(['status' => 0, 'message' => 'Sponsor username does not exist.'], 401);
        }
        else
        {

          $web_settings = DB::table('website_settings')
          ->Where('id', 1)
          ->first();

          $package_amount = 0;
          $points = 0;

          $package = DB::table('packages')
          ->Where('type', $web_settings->package_type)
          ->Where('package', $request->package)
          ->first();

          $package_amount = $package->amount;
          $points = $package->points;



            $user_agent = $_SERVER['HTTP_USER_AGENT'];
            $ip_address = $_SERVER['REMOTE_ADDR'];
            DB::insert('insert into users (
                first_name,
                last_name,
                email,
                phone,
                username,
                referral,
                device_info,
                ip_address,
                country,
                password,
                package,
                package_amount,
                role
                )
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                $request->first_name,
                $request->last_name,
                $request->email,
                $request->phone,
                $request->username,
                $request->referral,
                $user_agent,
                $ip_address,
                $request->country,
                Hash::make($request->password),
                $request->package,
                $package->amount,
                $role
            ]);

//Create wallet
DB::insert('insert into wallet (username)values (?)', [$request->username]);

if( $package_amount > 0){
    DB::insert('insert into transactions (
        username,
        type,
        amount,
        discount,
        package
        )
    values (?, ?, ?, ?, ?)', [
        $request->username,
        'Package',
        $package->amount,
        0,
        $request->package
    ]);
}

             if(strlen($request->referral) > 0){
                $ifReferralExists = DB::table('users')
                ->Where('username', $request->referral)
                ->count();
                if($ifReferralExists > 0)
                {
                    DB::insert('insert into referrals (
                      package,
                      referrer,
                        username,
                        status
                        )
                    values (?, ?, ?, ?)', [
                      $request->package,
                      $request->referral,
                        $request->username,
                        0
                    ]);
                }
            }

            $message = "Hi ".$request->first_name."<br>We are indeed glad to have you onboard. Leverage on opportunities in local & global telecom sectors & digital economy.<br>Regards!";
            $send_mail = $this->sendMail("Welcome to ".$web_settings->title."", $request->email, $web_settings->mailer, $message);
            return response()->json(['status' => 1, 'message' => 'Account Created'], 200);
        }
    }
    public function testText(Request $request)
    {
        return response()->json(['status' => 1, 'message' => 'Account Created'], 200);
    }
    public function login(Request $request){

        $validator = Validator::make($request->all(), [
                'email' => 'required|string',
                'password' => 'required|string'
            ]);

            $getPassword = DB::table('users')
            ->where('status', 1)
            ->where('username', $request->email)
            ->value('password');

            if(strlen($getPassword) < 2 ){
                $getPassword = DB::table('users')
                ->where('status', 1)
                ->where('email', $request->email)
                ->value('password');
            }

            if($validator->fails())
            {
                return response()->json(['status' => 0,'message' => 'An error occured, please try again'], 401);
            }
            else if (Hash::check($request->password, $getPassword))
            {
                $token = Str::random(60);
                $token = hash('sha256', $token);

                $user = DB::table('users')
                ->where('email', $request->email)
                ->orWhere('username', $request->email)
                ->first();

                $user_agent = $_SERVER['HTTP_USER_AGENT'];
                $ip_address = $_SERVER['REMOTE_ADDR'];
                DB::insert('insert into login_logs (
                    user_id,
                    device,
                    ip_address,
                    login_token,
                    is_token_valid,
                    status
                    )
                values (?, ?, ?, ?, ?, ?)', [
                    $user->id,
                    $user_agent,
                    $ip_address,
                    $token,
                    1,
                    1
                ]);
/*DB::table('login_logs')
->where('user_id', )*/
                DB::update('update login_logs set is_token_valid = ? where user_id = ? and login_token != ? and login_type = ?',[0, $user->id, $token, "website"]);
                return response()->json(['status' => 1, 'message' => 'Login successful.', 'login_token' => $token, 'role' => $user->role ], 200);
            }
            else{
                return response()->json(['status' => 0, 'message' => 'Incorrect login details.' ], 401);
            }
    }

    public function password_reset(Request $request)
    {
        $validator = Validator::make($request->all(), [
           'email' => 'required|string',
                    ]);

                    $ifEmailOrUsernameExists = DB::table('users')
                    ->Where('email', $request->email)
                    ->orWhere('username', $request->email)
                    ->count();

                    if($ifEmailOrUsernameExists > 0){
                        $code = Str::random(5);
                        $user = DB::table('users')
                        ->where('email', $request->email)
                        ->orWhere('username', $request->email)
                        ->first();
                        $user_agent = $_SERVER['HTTP_USER_AGENT'];
                        $ip_address = $_SERVER['REMOTE_ADDR'];
                        DB::insert('insert into password_reset (
                            user_id,
                            phone,
                            email,
                            device,
                            ip_address,
                            code,
                            is_code_valid
                            )
                        values (?, ?, ?, ?, ?, ?, ?)', [
                            $user->id,
                            $user->phone,
                            $user->email,
                            $user_agent,
                            $ip_address,
                            $code,
                            1
                        ]);

                        $web_settings = DB::table('website_settings')
                        ->Where('id', 1)
                        ->first();

                        $message = "Hi ".$user->first_name."<br>Use the code below for reset<br>Code: <b>".$code."</b>.<br><br>Regards!";
                        $send_mail = $this->sendMail($web_settings->title." Reset", $user->email, $web_settings->mailer, $message);
                    }

                    if($validator->fails())
                    {
                        return response()->json(['status' => 0, 'message' => 'An error occured, please try again'], 401);
                    }
                    else
                    {
                        return response()->json(['status' => 1, 'message' => 'You will receive a mail soon if you have an account with us. The mail will contain a code which can be used for reset.'], 200);
                    }

    }

    public function confirm_password_reset(Request $request){

        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
            'password2' => 'required|string',
            'code' => 'required|string|max:10'
                     ]);

                     if(strlen($request->password) < 6)
                     {
                        return response()->json(['status' => 0, 'message' => 'Password should be at least 6 characters long.'], 401);
                    }
                    else if($request->password != $request->password2)
                    {
                        return response()->json(['status' => 0, 'message' => 'Passwords do not match.'], 401);
                    }
                    else if($validator->fails())
                    {
                        return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
                    }
                    else
                    {
                        $ifCodeExists = DB::table('password_reset')
                        ->Where('is_code_valid', 1)
                        ->Where('code', $request->code)
                        ->count();

                        if($ifCodeExists > 0)
                        {
                            $userDetails = DB::table('password_reset')
                            ->Where('is_code_valid', 1)
                            ->Where('code', $request->code)
                            ->first();

                            $web_settings = DB::table('website_settings')
                            ->Where('id', 1)
                            ->first();

                            DB::update('update password_reset set is_code_valid = ? where user_id = ?',[0, $userDetails->user_id]);
                            DB::update('update login_logs set is_token_valid = ? where user_id = ?',[0, $userDetails->user_id]);
                            DB::update('update users set password = ? where id = ?',[Hash::make($request->password), $userDetails->user_id]);
                            $message = "Hi, <br>Your ".$web_settings->title." account password have been successfully reset. Contact us if you did not initiated the password reset<br><br>Regards!";
                            $send_mail = $this->sendMail($web_settings->title." Password Reset", $userDetails->email, $web_settings->mailer, $message);
                            return response()->json(['status' => 1, 'message' => 'Password reset successful.' ], 200);
                        }
                        else
                        {
                            return response()->json(['status' => 0, 'message' => 'Password reset failed.' ], 401);
                        }

                    }
    }

    public function confirm_pin_reset(Request $request){

        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
            'password2' => 'required|string',
            'code' => 'required|string|max:10'
                     ]);

                     if(strlen($request->password) < 4)
                     {
                        return response()->json(['status' => 0, 'message' => 'PIN should be 4-digits.'], 401);
                    }
                    else if(!is_numeric($request->password))
                    {
                       return response()->json(['status' => 0, 'message' => 'PIN should be numbers.'], 401);
                   }
                    else if($request->password != $request->password2)
                    {
                        return response()->json(['status' => 0, 'message' => 'PIN do not match.'], 401);
                    }
                    else if($validator->fails())
                    {
                        return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
                    }
                    else
                    {
                        $ifCodeExists = DB::table('password_reset')
                        ->Where('is_code_valid', 1)
                        ->Where('code', $request->code)
                        ->count();

                        if($ifCodeExists > 0)
                        {
                            $userDetails = DB::table('password_reset')
                            ->Where('is_code_valid', 1)
                            ->Where('code', $request->code)
                            ->first();

                            $web_settings = DB::table('website_settings')
                            ->Where('id', 1)
                            ->first();

                            DB::update('update password_reset set is_code_valid = ? where user_id = ?',[0, $userDetails->user_id]);
                            //DB::update('update login_logs set is_token_valid = ? where user_id = ?',[0, $userDetails->user_id]);
                            DB::update('update users set pin = ? where id = ?',[Hash::make($request->password), $userDetails->user_id]);
                            $message = "Hi, <br>Your ".$web_settings->title." account PIN have been successfully reset. Contact us if you did not initiated the PIN reset.<br><br>Regards!";
                            $send_mail = $this->sendMail($web_settings->title." Password Reset", $userDetails->email, $web_settings->mailer, $message);
                            return response()->json(['status' => 1, 'message' => 'Pin reset successful.' ], 200);
                        }
                        else
                        {
                            return response()->json(['status' => 0, 'message' => 'Password reset failed.' ], 401);
                        }

                    }
    }

    public function create_pin(Request $request){

        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
            'password2' => 'required|string',
            'username' => 'required|string'
                     ]);

                     if(strlen($request->password) < 4)
                     {
                        return response()->json(['status' => 0, 'message' => 'Pin should be 4-digits.'], 401);
                    }
                    else if(strlen($request->password) > 4)
                     {
                        return response()->json(['status' => 0, 'message' => 'Pin should be 4-digits.'], 401);
                    }
                    else if($request->password != $request->password2)
                    {
                        return response()->json(['status' => 0, 'message' => 'Pin do not match.'], 401);
                    }
                    else if($validator->fails())
                    {
                        return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
                    }
                    else
                    {
                            DB::update('update users set pin = ? where username = ?',[Hash::make($request->password), $request->username]);
                            return response()->json(['status' => 1, 'message' => 'Pin successfully set.' ], 200);

                    }
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

    public function verify_login_token(Request $request, $login_token){
        $token_check = DB::table('login_logs')
        ->Where('login_token', $login_token)
        ->Where('is_token_valid', 1)->first();
        if(!$token_check)
        {
            return response()->json(['status' => 0, 'message' => 'Login Failed.'], 401);
        }
        else
        {
            return response()->json(['status' => 1, 'message' => 'Login Failed.'], 200);
        }
    }

    public function update_password(Request $request){

        $validator = Validator::make($request->all(), [
          'login_token' => 'required|string',
          'password' => 'required|string',
          'password1' => 'required|string',
            'password2' => 'required|string'
                     ]);

                     if(strlen($request->password) < 6)
                     {
                        return response()->json(['status' => 0, 'message' => 'Password should be at least 6 characters long.'], 401);
                    }
                    else if(strlen($request->password1) < 6)
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
                      $token_check = $this->check_login_token($request->login_token);
                      $user_id=$token_check;

                      if($token_check != 0)
                      {
                          $user = DB::table('users')
                          ->Where('id', $user_id)
                          ->first();

                          $getPassword = DB::table('users')
                          ->where('username', $user->username)
                          ->value('password');

                          if (Hash::check($request->password, $getPassword)){

                                DB::update('update users set password = ? where username = ?',[Hash::make($request->password1), $user->username]);
                                return response()->json(['status' => 1, 'message' => 'Password change successfully.' ], 200);
                            }
                            else
                            {
                                return response()->json(['status' => 0, 'message' => 'Password change failed.' ], 401);
                            }

                        }else{
                          return response()->json(['status' => 0, 'message' => 'Account updated failed.'], 401);
                        }


                    }
    }


    public function update_pin(Request $request){

        $validator = Validator::make($request->all(), [
          'login_token' => 'required|string',
          'password' => 'required|string',
          'password1' => 'required|string',
            'password2' => 'required|string'
                     ]);

                     if(strlen($request->password) < 4)
                     {
                        return response()->json(['status' => 0, 'message' => 'Pin should be 4-digits.'], 401);
                    }
                    else if(strlen($request->password1) < 4)
                    {
                       return response()->json(['status' => 0, 'message' => 'Pin should be 4-digits.'], 401);
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
                      $token_check = $this->check_login_token($request->login_token);
                      $user_id=$token_check;

                      if($token_check != 0)
                      {
                          $user = DB::table('users')
                          ->Where('id', $user_id)
                          ->first();

                          $getPassword = DB::table('users')
                          ->where('username', $user->username)
                          ->value('pin');

                          if (Hash::check($request->password, $getPassword)){

                                DB::update('update users set pin = ? where username = ?',[Hash::make($request->password1), $user->username]);
                                return response()->json(['status' => 1, 'message' => 'PIN change successfully.' ], 200);
                            }
                            else
                            {
                                return response()->json(['status' => 0, 'message' => 'Pin change failed.' ], 401);
                            }

                        }else{
                          return response()->json(['status' => 0, 'message' => 'Account updated failed.'], 401);
                        }


                    }
    }


}

<?php

namespace App\Http\Controllers;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class ApiController extends Controller
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

  public function getUserApi(Request $request, $login_token){
    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
      $token_check_ = DB::table('login_logs')
      ->Where('user_id', $token_check)
      ->Where('login_type', "api")
      ->Where('is_token_valid', 1)->first();
      if($token_check_)
      {
        return response()->json(['status' => 1,'message' => 'API Found!', 'api' => $token_check_->login_token], 401);
      }
      else
      {
        return response()->json(['status' => 0,'message' => 'No active API found'], 401);
      }
    }
    else
    {
      return response()->json(['status' => 0,'message' => 'An error occured, please try again'], 401);
    }

  }

  public function CreateNewApiToken(Request $request){

      $validator = Validator::make($request->all(), [
              'username' => 'required|string',
              'login_token' => 'required|string'
          ]);

        $login_token = $request->login_token;
        $token_check = $this->check_login_token($login_token);

          if($validator->fails())
          {
              return response()->json(['status' => 0,'message' => 'An error occured, please try again'], 401);
          }
          else if($token_check != 0)
          {
            $user = DB::table('users')
            ->Where('id', $token_check)
            ->Where('username', $request->username)
            ->first();

              $token = Str::random(80);
              $token = hash('sha256', $token);

              $user_agent = $_SERVER['HTTP_USER_AGENT'];
              $ip_address = $_SERVER['REMOTE_ADDR'];
              DB::insert('insert into login_logs (
                  user_id,
                  device,
                  ip_address,
                  login_token,
                  login_type,
                  is_token_valid,
                  status
                  )
              values (?, ?, ?, ?, ?, ?, ?)', [
                  $user->id,
                  $user_agent,
                  $ip_address,
                  $token,
                  "api",
                  1,
                  1
              ]);

              DB::update('update login_logs set is_token_valid = ? where user_id = ? and login_token != ? and login_type = ?',[0, $user->id, $token, "api"]);
              return response()->json(['status' => 1, 'message' => 'API Created!', 'token' => $token, 'role' => $user->role ], 200);
          }
          else{
              return response()->json(['status' => 0, 'message' => 'Incorrect details.' ], 401);
          }
  }
}

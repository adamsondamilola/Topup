<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

use App\Http\Controllers\MailerController ;

class VerifyApiController extends Controller
{

  public function check_api_token($login_token){
      $token_check = DB::table('login_logs')
      ->Where('login_token', $login_token)
      ->Where('login_type', "api")
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


}

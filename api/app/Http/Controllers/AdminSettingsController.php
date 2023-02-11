<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

use App\Http\Controllers\EncryptController;



class AdminSettingsController extends Controller
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

    public function update_website_settings(Request $request){

        $validator = Validator::make($request->all(), [
            'maintain' => 'required|numeric',
            'title' => 'required|string',
            'sub_title' => 'required|string',
            'logo' => 'string|nullable',
            'dashboard_logo' => 'string|nullable',
            'url' => 'required|string',
            'email' => 'required|string',
            'mailer' => 'required|string',
            'office_address' => 'required|string',
            'twitter_username' => 'required|string',
            'tawkto_url' => 'string|nullable',
            'facebook_username' => 'required|string',
            'phone' => 'required|string',
            'whatsapp' => 'required|string',
            'business_reg' => 'string|nullable',
            'token' => 'required|string'
                     ]);

                  if($validator->fails())
                    {
                        return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled. ' ], 401);
                    }
                    else
                    {

                        $web_settings = DB::table('website_settings')
                        ->Where('id', 1)
                        ->first();

                        if(strlen($request->dashboard_logo) < 5 ){
                            $request->dashboard_logo = $web_settings->dashboard_logo;
                        }
                        if(strlen($request->logo) < 5 ){
                            $request->logo = $web_settings->logo;
                        }

                      $token_check = $this->check_login_token($request->token);

                      if($token_check != 0)
                      {
                          $user = DB::table('users')
                          ->Where('id', $token_check)
                          ->Where('role', 'Admin')
                          ->first();

                          if($user)
                          {
                            DB::update('update website_settings set
                            maintain = ?,
                            title = ?,
                            sub_title = ?,
                            logo = ?,
                            dashboard_logo = ?,
                            url = ?,
                            email = ?,
                            mailer = ?,
                            office_address = ?,
                            twitter_username = ?,
                            facebook_username = ?,
                            tawkto_url = ?,
                            whatsapp = ?,
                            phone = ?,
                            business_reg = ?
                            where id = ?',[
                              $request->maintain,
                              $request->title,
                              $request->sub_title,
                              $request->logo,
                              $request->dashboard_logo,
                              $request->url,
                              $request->email,
                              $request->mailer,
                              $request->office_address,
                              $request->twitter_username,
                              $request->facebook_username,
                              $request->tawkto_url,
                              $request->whatsapp,
                              $request->phone,
                              $request->business_reg,
                              1]);

                            return response()->json(['status' => 1, 'message' => 'Settings Updated.' ], 200);
                          }
                          else
                          {
                            return response()->json(['status' => 0, 'message' => 'Access Denied!' ], 401);
                          }
                     }

                    }
    }

    public function listAdmin(Request $request, $login_token){
        $token_check = $this->check_login_token($login_token);
        if($token_check != 0)
        {
            $admin = DB::table('users')
            ->Where('id', $token_check)
            ->Where('role', 'Admin')
            ->first();

      if($admin){

        $admin_ = DB::table('users')
        ->Where('role', 'Admin')
        ->orderBy('id', 'desc')
        ->take(20)
       ->get()->all();

      if($admin_){
            return response()->json(['status' => 1,
            'message' => 'Admin List',
            'result' => $admin_], 200);
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

      public function makeAdmin(Request $request, $login_token, $username){
        $token_check = $this->check_login_token($login_token);
        if($token_check != 0)
        {
          $user = DB::table('users')
          ->Where('username', $username)
          ->first();

          if($user->role != 'Admin'){
            DB::update('update users set role = ? where username = ?',["Admin", $username]);
              return response()->json(['status' => 1, 'message' => 'Admin Added!'], 200);
          }

          else if($user->role == 'Admin'){
            DB::update('update users set role = ? where username = ?',["User", $username]);
            return response()->json(['status' => 1, 'message' => 'Admin Removed!'], 200);
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

      public function listApi(Request $request, $login_token){
        $token_check = $this->check_login_token($login_token);
        if($token_check != 0)
        {
            $admin = DB::table('users')
            ->Where('id', $token_check)
            ->Where('role', 'Admin')
            ->first();

      if($admin){

        $api = DB::table('api_keys')
        ->orderBy('id', 'desc')
        ->take(20)
       ->get()->all();

      if($api){
            return response()->json(['status' => 1,
            'message' => 'Api List',
            'result' => $api], 200);
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

      public function ApiDetails(Request $request, $login_token, $id){
        $token_check = $this->check_login_token($login_token);
        if($token_check != 0)
        {
            $admin = DB::table('users')
            ->Where('id', $token_check)
            ->Where('role', 'Admin')
            ->first();

      if($admin){

        $api = DB::table('api_keys')
        ->Where('id', $id)
            ->first();

      if($api){
            return response()->json(['status' => 1,
            'message' => 'Api Details',
            'result' => $api], 200);
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

      public function updateApi(Request $request, $id){
        $validator = Validator::make($request->all(), [
            'login_token' => 'required|string',
            'api_provider' => 'required|string',
              'public_key' => 'required|string',
              'api_secret_key' => 'string|nullable',
              'contract_code' => 'string|nullable',
               'end_point' => 'required|string',
          ]);

          $token_check = $this->check_login_token($request->login_token);
           if($validator->fails()){
            //return $validator->errors();
                      return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled. ' ], 401);
                  }
        else if($token_check != 0)
        {
          $update = DB::update('update api_keys set api_provider = ?, public_key = ?, api_secret_key = ?,contract_code = ?, end_point = ?
          where id = ? ',[$request->api_provider, $request->public_key, $request->api_secret_key ,$request->contract_code, $request->end_point, $id]);

         if($update){
            return response()->json(['status' => 1, 'message' => 'API  Updated!'], 200);
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

      public function addApi(Request $request){
        $validator = Validator::make($request->all(), [
            'login_token' => 'required|string',
            'api_provider' => 'required|string',
              'public_key' => 'required|string',
              'api_secret_key' => 'string|nullable',
              'contract_code' => 'string|nullable',
               'end_point' => 'required|string',
          ]);

          $api = DB::table('api_keys')
          ->Where('api_provider', $request->api_provider)
              ->first();

          $token_check = $this->check_login_token($request->login_token);
           if($validator->fails()){
            //return $validator->errors();
                      return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
                  }
else if($api){
    return response()->json(['status' => 0, 'message' => 'Provider already exists' ], 401);
}
        else if($token_check != 0)
        {

            $add =  DB::insert('insert into api_keys (
                api_provider, public_key, api_secret_key, contract_code, end_point
                )
                values (?, ?, ?, ?, ?)', [
                    $request->api_provider, $request->public_key, $request->api_secret_key ,$request->contract_code, $request->end_point
                ]);

         if($add){
            return response()->json(['status' => 1, 'message' => 'API  Added!'], 200);
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

      public function deleteApi(Request $request, $login_token, $id){
        $token_check = $this->check_login_token($login_token);
        if($token_check != 0)
        {
          $delete_api = DB::table('api_keys')
          ->Where('id', $id)
          ->delete();

         if($delete_api){
              return response()->json(['status' => 1, 'message' => 'Api Deleted!'], 200);
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

///////////// Update Commission Start////////////////

public function CommissionDetails(Request $request, $login_token){
    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
        $admin = DB::table('users')
        ->Where('id', $token_check)
        ->Where('role', 'Admin')
        ->first();

  if($admin){

    $com = DB::table('network_commission')
    ->Where('id', 1)
    ->first();

    $electric_com = DB::table('electricitiy_commission')
    ->Where('id', 1)
    ->first();

    $airtime_print_com = DB::table('airtime_print_commission')
    ->Where('id', 1)
    ->first();

    $cable_com = DB::table('cable_commission')
    ->Where('id', 1)
    ->first();

  if($com){
        return response()->json(['status' => 1,
        'message' => 'Network Commission Details',
        'vtu_data' => $com,
        'electric_com' => $electric_com,
        'airtime_print_com' => $airtime_print_com,
        'cable_com' => $cable_com,], 200);
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

  public function updateNetworkCommission(Request $request){
    $validator = Validator::make($request->all(), [
        'login_token' => 'required|string',
        'mtn_airtime' => 'required|numeric',
          'glo_airtime' => 'required|numeric',
          'airtel_airtime' => 'required|numeric',
          'nmobile_airtime' => 'required|numeric',
          'mtn_data' => 'required|numeric',
          'mtn_data_share' => 'required|numeric',
            'glo_data' => 'required|numeric',
            'airtel_data' => 'required|numeric',
            'nmobile_data' => 'required|numeric'
      ]);

      $token_check = $this->check_login_token($request->login_token);
       if($validator->fails()){
        //return $validator->errors();
                  return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
              }
    else if($token_check != 0)
    {
      $update = DB::update('update network_commission set
      mtn_airtime = ?,
      glo_airtime = ?,
      airtel_airtime = ?,
      nmobile_airtime = ?,
      mtn_data = ?,
      mtn_data_share = ?,
      glo_data = ?,
      airtel_data = ?,
      nmobile_data = ?
      where id = ? ',[$request->mtn_airtime,
      $request->glo_airtime,
      $request->airtel_airtime ,
      $request->nmobile_airtime,
      $request->mtn_data,
      $request->mtn_data_share,
      $request->glo_data,
      $request->airtel_data,
      $request->nmobile_data, 1]);

     if($update){
        return response()->json(['status' => 1, 'message' => 'Commission Updated!'], 200);
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

  public function updateAirtimePrintCommission(Request $request){
    $validator = Validator::make($request->all(), [
        'login_token' => 'required|string',
        'mtn' => 'required|numeric',
          'glo' => 'required|numeric',
          'airtel' => 'required|numeric',
          'nmobile' => 'required|numeric'
      ]);

      $token_check = $this->check_login_token($request->login_token);
       if($validator->fails()){
        //return $validator->errors();
                  return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
              }
    else if($token_check != 0)
    {
      $update = DB::update('update airtime_print_commission set
      mtn = ?,
      glo = ?,
      airtel = ?,
      nmobile = ?
      where id = ? ',[$request->mtn,
      $request->glo,
      $request->airtel,
      $request->nmobile, 1]);

     if($update){
        return response()->json(['status' => 1, 'message' => 'Commission Updated!'], 200);
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

  public function updateCableCommission(Request $request){
    $validator = Validator::make($request->all(), [
        'login_token' => 'required|string',
        'dstv' => 'required|numeric',
          'gotv' => 'required|numeric',
          'startimes' => 'required|numeric'
      ]);

      $token_check = $this->check_login_token($request->login_token);
       if($validator->fails()){
        //return $validator->errors();
                  return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
              }
    else if($token_check != 0)
    {
      $update = DB::update('update cable_commission set
      dstv = ?,
      gotv = ?,
      startimes = ?
      where id = ? ',[$request->dstv,
      $request->gotv,
      $request->startimes, 1]);

     if($update){
        return response()->json(['status' => 1, 'message' => 'Commission Updated!'], 200);
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

  public function updateElectricityCommission(Request $request){
    $validator = Validator::make($request->all(), [
        'login_token' => 'required|string',
        'commission' => 'required|numeric'
      ]);

      $token_check = $this->check_login_token($request->login_token);
       if($validator->fails()){
        //return $validator->errors();
                  return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
              }
    else if($token_check != 0)
    {
      $update = DB::update('update electricitiy_commission set
      commission = ?
      where id = ? ',[$request->commission, 1]);

     if($update){
        return response()->json(['status' => 1, 'message' => 'Commission Updated!'], 200);
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

//////////////Update Commission End/////////////////



///////////// Update Free users Commission Start////////////////

public function FreeUsersCommissionDetails(Request $request, $login_token){
    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
        $admin = DB::table('users')
        ->Where('id', $token_check)
        ->Where('role', 'Admin')
        ->first();

  if($admin){

    $com = DB::table('free_users_network_commission')
    ->Where('id', 1)
    ->first();

    $electric_com = DB::table('free_users_electricitiy_commission')
    ->Where('id', 1)
    ->first();

    $airtime_print_com = DB::table('free_users_airtime_print_commission')
    ->Where('id', 1)
    ->first();

    $cable_com = DB::table('free_users_cable_commission')
    ->Where('id', 1)
    ->first();

  if($com){
        return response()->json(['status' => 1,
        'message' => 'Network Commission Details',
        'vtu_data' => $com,
        'electric_com' => $electric_com,
        'airtime_print_com' => $airtime_print_com,
        'cable_com' => $cable_com,], 200);
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

  public function FreeUsersUpdateNetworkCommission(Request $request){
    $validator = Validator::make($request->all(), [
        'login_token' => 'required|string',
        'mtn_airtime' => 'required|numeric',
          'glo_airtime' => 'required|numeric',
          'airtel_airtime' => 'required|numeric',
          'nmobile_airtime' => 'required|numeric',
          'mtn_data' => 'required|numeric',
          'mtn_data_share' => 'required|numeric',
            'glo_data' => 'required|numeric',
            'airtel_data' => 'required|numeric',
            'nmobile_data' => 'required|numeric'
      ]);

      $token_check = $this->check_login_token($request->login_token);
       if($validator->fails()){
        //return $validator->errors();
                  return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
              }
    else if($token_check != 0)
    {
      $update = DB::update('update free_users_network_commission set
      mtn_airtime = ?,
      glo_airtime = ?,
      airtel_airtime = ?,
      nmobile_airtime = ?,
      mtn_data = ?,
      mtn_data_share = ?,
      glo_data = ?,
      airtel_data = ?,
      nmobile_data = ?
      where id = ? ',[$request->mtn_airtime,
      $request->glo_airtime,
      $request->airtel_airtime ,
      $request->nmobile_airtime,
      $request->mtn_data,
      $request->mtn_data_share,
      $request->glo_data,
      $request->airtel_data,
      $request->nmobile_data, 1]);

     if($update){
        return response()->json(['status' => 1, 'message' => 'Commission Updated!'], 200);
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

  public function FreeUsersUpdateAirtimePrintCommission(Request $request){
    $validator = Validator::make($request->all(), [
        'login_token' => 'required|string',
        'mtn' => 'required|numeric',
          'glo' => 'required|numeric',
          'airtel' => 'required|numeric',
          'nmobile' => 'required|numeric'
      ]);

      $token_check = $this->check_login_token($request->login_token);
       if($validator->fails()){
        //return $validator->errors();
                  return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
              }
    else if($token_check != 0)
    {
      $update = DB::update('update free_users_airtime_print_commission set
      mtn = ?,
      glo = ?,
      airtel = ?,
      nmobile = ?
      where id = ? ',[$request->mtn,
      $request->glo,
      $request->airtel,
      $request->nmobile, 1]);

     if($update){
        return response()->json(['status' => 1, 'message' => 'Commission Updated!'], 200);
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

  public function FreeUsersUpdateCableCommission(Request $request){
    $validator = Validator::make($request->all(), [
        'login_token' => 'required|string',
        'dstv' => 'required|numeric',
          'gotv' => 'required|numeric',
          'startimes' => 'required|numeric'
      ]);

      $token_check = $this->check_login_token($request->login_token);
       if($validator->fails()){
        //return $validator->errors();
                  return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
              }
    else if($token_check != 0)
    {
      $update = DB::update('update free_users_cable_commission set
      dstv = ?,
      gotv = ?,
      startimes = ?
      where id = ? ',[$request->dstv,
      $request->gotv,
      $request->startimes, 1]);

     if($update){
        return response()->json(['status' => 1, 'message' => 'Commission Updated!'], 200);
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

  public function FreeUsersUpdateElectricityCommission(Request $request){
    $validator = Validator::make($request->all(), [
        'login_token' => 'required|string',
        'commission' => 'required|numeric'
      ]);

      $token_check = $this->check_login_token($request->login_token);
       if($validator->fails()){
        //return $validator->errors();
                  return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
              }
    else if($token_check != 0)
    {
      $update = DB::update('update free_users_electricitiy_commission set
      commission = ?
      where id = ? ',[$request->commission, 1]);

     if($update){
        return response()->json(['status' => 1, 'message' => 'Commission Updated!'], 200);
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

//////////////Update Free Users Commission End/////////////////


//////////////Services Price Start/////////////////

public function ServicesDetails(Request $request, $login_token){
    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
        $admin = DB::table('users')
        ->Where('id', $token_check)
        ->Where('role', 'Admin')
        ->first();

  if($admin){

    $cable_billing = DB::table('cable_billing')->get()->all();

    $data_billing = DB::table('data_billing')->get()->all();

    $electricity_billing = DB::table('electricity_billing')->get()->all();

  if($cable_billing){
        return response()->json(['status' => 1,
        'message' => 'Details',
        'cable_billing' => $cable_billing,
        'data_billing' => $data_billing,
        'electricity_billing' => $electricity_billing ], 200);
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

  public function addDataPrice(Request $request){
    $validator = Validator::make($request->all(), [
        'login_token' => 'required|string',
        'network' => 'required|string',
        'data_description' => 'required|string',
        'days' => 'required|numeric',
        'data_amount' => 'required|numeric',
        'data_type' => 'required|string',
        'data_code' => 'required|string'
      ]);

      $data_description = DB::table('data_billing')
      ->Where('data_description', $request->data_description)
          ->first();

      $token_check = $this->check_login_token($request->login_token);
       if($validator->fails()){
        //return $validator->errors();
                  return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
              }
              else if($data_description){
                return response()->json(['status' => 0, 'message' => 'Service already exists' ], 401);
            }
    else if($token_check != 0)
    {

        $add =  DB::insert('insert into data_billing (
        network, data_description, days, data_amount, data_type, data_code
        )
        values (?, ?, ?, ?, ?, ?)', [
            $request->network, $request->data_description, $request->days, $request->data_amount, $request->data_type, $request->data_code
        ]);

     if($add){
        return response()->json(['status' => 1, 'message' => 'Service Added!'], 200);
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

  public function addCablePrice(Request $request){
    $validator = Validator::make($request->all(), [
        'login_token' => 'required|string',
        'service_amount' => 'required|numeric',
        'service_description' => 'required|string',
        'service_code' => 'required|string',
        'serviceID' => 'required|string'
      ]);

      $service_description = DB::table('cable_billing')
      ->Where('service_description', $request->service_description)
          ->first();

      $token_check = $this->check_login_token($request->login_token);
       if($validator->fails()){
        //return $validator->errors();
                  return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
              }
              else if($service_description){
                return response()->json(['status' => 0, 'message' => 'Service already exists' ], 401);
            }
    else if($token_check != 0)
    {

        $add =  DB::insert('insert into cable_billing (
            service_amount, service_description, service_code, serviceID
        )
        values (?, ?, ?, ?)', [
            $request->service_amount, $request->service_description, $request->service_code, $request->serviceID
        ]);

     if($add){
        return response()->json(['status' => 1, 'message' => 'Service Added!'], 200);
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

  public function addElectricityPrice(Request $request){
    $validator = Validator::make($request->all(), [
        'login_token' => 'required|string',
        'product' => 'required|string',
        'product_code' => 'required|string',
        'transaction_charges' => 'required|numeric'
      ]);

      $product_code = DB::table('electricity_billing')
      ->Where('product_code', $request->product_code)
          ->first();

      $token_check = $this->check_login_token($request->login_token);
       if($validator->fails()){
        //return $validator->errors();
                  return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
              }
              else if($product_code){
                return response()->json(['status' => 0, 'message' => 'Service already exists' ], 401);
            }
    else if($token_check != 0)
    {
        $add =  DB::insert('insert into electricity_billing (
            product, product_code, transaction_charges
        )
        values (?, ?, ?)', [
            $request->product, $request->product_code, $request->transaction_charges
        ]);

     if($add){
        return response()->json(['status' => 1, 'message' => 'Service Added!'], 200);
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

//delete data service
public function deleteDataService(Request $request, $login_token, $id){
    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
      $delete = DB::table('data_billing')
      ->Where('id', $id)
      ->delete();

     if($delete){
          return response()->json(['status' => 1, 'message' => 'Service Deleted!'], 200);
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

//delete electricity service
public function deleteElectricityService(Request $request, $login_token, $id){
    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
      $delete = DB::table('electricity_billing')
      ->Where('id', $id)
      ->delete();

     if($delete){
          return response()->json(['status' => 1, 'message' => 'Service Deleted!'], 200);
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

//delete cable service
public function deleteCableService(Request $request, $login_token, $id){
    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
      $delete = DB::table('cable_billing')
      ->Where('serial', $id)
      ->delete();

     if($delete){
          return response()->json(['status' => 1, 'message' => 'Service Deleted!'], 200);
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

//////////////Services Price End/////////////////

/////////////////// FAQ /////////////////////

//list questions
public function listQuestions(Request $request, $login_token){
    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
        $admin = DB::table('users')
        ->Where('id', $token_check)
        ->Where('role', 'Admin')
        ->first();

  if($admin){

    $faq = DB::table('faq')->get()->all();

  if($faq){
        return response()->json(['status' => 1,
        'message' => 'FAQ List',
        'result' => $faq], 200);
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

public function addQuestion(Request $request){
  $validator = Validator::make($request->all(), [
      'login_token' => 'required|string',
      'question' => 'required|string',
      'answer' => 'required|string'
    ]);

    $faq = DB::table('faq')
    ->Where('question', $request->question)
        ->first();

    $token_check = $this->check_login_token($request->login_token);
     if($validator->fails()){
      //return $validator->errors();
                return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
            }
            else if($faq){
              return response()->json(['status' => 0, 'message' => 'Question already exists' ], 401);
          }
  else if($token_check != 0)
  {
      $add =  DB::insert('insert into faq (
          question, answer
      )
      values (?, ?)', [
          $request->question, $request->answer
      ]);

   if($add){
      return response()->json(['status' => 1, 'message' => 'FAQ Added!'], 200);
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

//delete question
public function deleteQuestion(Request $request, $login_token, $id){
    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
      $delete = DB::table('faq')
      ->Where('id', $id)
      ->delete();

     if($delete){
          return response()->json(['status' => 1, 'message' => 'FAQ Deleted!'], 200);
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

////////////////// FAQ /////////////////////


////////////////////////// AIRTIME PRINTING //////////////

public function addAirtimePin(Request $request){
  $validator = Validator::make($request->all(), [
      'login_token' => 'required|string',
      'pin' => 'required|string',
      'serial_number' => 'required|numeric',
      'network' => 'required|string',
      'amount' => 'required|numeric'
    ]);

    $request->pin = str_replace("-", "", $request->pin);
    $original_pin = $request->pin;


    $network = $request->network;
    $encrypt = new EncryptController;
    $request->pin = $encrypt->encryptString($request->pin);

    $check_pin = DB::table('airtime_pins')
    ->Where('pin', $request->pin)
        ->first();

        $check_serial_number = DB::table('airtime_pins')
        ->Where('serial_number', $request->serial_number)
            ->first();

            $network_code = "0";
            $pin_length = 0;
            if($network == "MTN"){
                $network_code = "01";
                $pin_length = 17;
                }

                if($network == "GLO"){
                    $network_code = "02";
                    $pin_length = 15;
                    }

                    if($network == "AIRTEL"){
                        $network_code = "04";
                        $pin_length = 16;
                        }

                        if($network == "9MOBILE"){
                            $network_code = "03";
                            $pin_length = 15;
                            }

    $token_check = $this->check_login_token($request->login_token);

             if(!is_numeric($original_pin)){
              return response()->json(['status' => 0, 'message' => 'PIN is not numeric' ], 401);
          }
          else if($check_pin){
              return response()->json(['status' => 0, 'message' => 'PIN already exists' ], 401);
          }
          else if($check_serial_number){
            return response()->json(['status' => 0, 'message' => 'Serial Number already exists' ], 401);
        }
        else if(strlen($original_pin) > $pin_length || strlen($original_pin) < $pin_length){
          return response()->json(['status' => 0, 'message' => $network.' should not be more or less than '.$pin_length ], 401);
      }
      else if($validator->fails()){
      //return $validator->errors();
                return response()->json(['status' => 0, 'message' => 'An error occured, please try again. Make sure all fields are correctly filled.' ], 401);
            }
  else if($token_check != 0)
  {

    $user = DB::table('users')
    ->Where('id', $token_check)
    ->first();

    if($user->role == "Admin" || $user->role == "Staff")
    {


        $add =  DB::insert('insert into airtime_pins (
            pin, serial_number, amount, network, network_code, created_by
        )
        values (?, ?, ?, ?, ?, ?)', [
            $request->pin, $request->serial_number, $request->amount, $request->network, $network_code, $user->username
        ]);

     if($add){
        return response()->json(['status' => 1, 'message' => 'Airtime Added!'], 200);
      }
      else
      {
          return response()->json(['status' => 0, 'message' => 'Operation Failed!'], 401);
      }

    }
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!', 'result' => []], 401);
    }

  }
  else
  {
      return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
  }
}

public function airtime_pins(Request $request, $login_token, $num){
    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
        $user = DB::table('users')
        ->Where('id', $token_check)
        ->first();

        if($user->role == "Admin" || $user->role == "Staff")
        {
          $pins = DB::table('airtime_pins')
          ->Where('created_by', $user->username)
          ->orderBy('id', 'desc')
          ->take($num)
          ->get();

          $decrypt = new EncryptController;

          foreach($pins as $pin)
          {
            $pin->pin = $decrypt->decryptString($pin->pin);
          }

          return response()->json(['status' => 1,
          'message' => 'Access Granted!',
          'result' => $pins], 200);
        }
        else
        {
            return response()->json(['status' => 0, 'message' => 'Access Denied!', 'result' => []], 401);
        }

    }
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
    }
}

public function admin_airtime_pins(Request $request, $login_token, $num){
    $token_check = $this->check_login_token($login_token);
    if($token_check != 0)
    {
        $user = DB::table('users')
        ->Where('id', $token_check)
        ->first();

        if($user->role == "Admin")
        {
          $pins = DB::table('airtime_pins')
          ->orderBy('id', 'desc')
          ->take($num)
          ->get();

          $decrypt = new EncryptController;

          foreach($pins as $pin)
          {
            $pin->pin = $decrypt->decryptString($pin->pin);
          }

          return response()->json(['status' => 1,
          'message' => 'Access Granted!',
          'result' => $pins], 200);
        }
        else
        {
            return response()->json(['status' => 0, 'message' => 'Access Denied!', 'result' => []], 401);
        }

    }
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!'], 401);
    }
}

public function search_airtime_pins(Request $request, $login_token, $search){
    $token_check = $this->check_login_token($login_token);
    $user_id=$token_check;

    $num = 100;

    if($token_check != 0)
    {
        $user = DB::table('users')
        ->Where('id', $user_id)
        ->first();

        if($user->role == "Admin" || $user->role == "Staff")
        {

          $pins = DB::table('airtime_pins')
        ->Where('created_by', $user->username)
          ->Where('pin', $search)
          ->orderBy('id', 'desc')
          ->take($num)
          ->get();

          if(strlen($pins) < 3){
              $pins = DB::table('airtime_pins')
              ->Where('created_by', $user->username)
              ->Where('serial_number', $search)
              ->orderBy('id', 'desc')
              ->take($num)
              ->get();
              if(strlen($pins) < 3){
                  $pins = DB::table('airtime_pins')
                  ->Where('created_by', $user->username)
                  ->Where('network', $search)
                  ->orderBy('id', 'desc')
                  ->take($num)
                  ->get();
                  if(strlen($pins) < 3){
                      $pins = DB::table('airtime_pins')
                      ->Where('created_by', $user->username)
                      ->Where('purchased_by', $search)
                      ->orderBy('id', 'desc')
                      ->take($num)
                      ->get();
                      if(strlen($pins) < 3){
                          $pins = DB::table('airtime_pins')
                          ->Where('created_by', $user->username)
                          ->Where('amount', $search)
                          ->orderBy('id', 'desc')
                          ->take($num)
                          ->get();
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
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!', 'result' => []], 401);
    }
}


public function admin_search_airtime_pins(Request $request, $login_token, $search){
    $token_check = $this->check_login_token($login_token);
    $user_id=$token_check;

    $num = 100;

    if($token_check != 0)
    {
        $user = DB::table('users')
        ->Where('id', $user_id)
        ->first();

        if($user->role == "Admin")
        {

          $pins = DB::table('airtime_pins')
          ->Where('pin', $search)
          ->orderBy('id', 'desc')
          ->take($num)
          ->get();

          if(strlen($pins) < 3){
              $pins = DB::table('airtime_pins')
              ->Where('serial_number', $search)
              ->orderBy('id', 'desc')
              ->take($num)
              ->get();
              if(strlen($pins) < 3){
                  $pins = DB::table('airtime_pins')
                  ->Where('network', $search)
                  ->orderBy('id', 'desc')
                  ->take($num)
                  ->get();
                  if(strlen($pins) < 3){
                      $pins = DB::table('airtime_pins')
                      ->Where('purchased_by', $search)
                      ->orderBy('id', 'desc')
                      ->take($num)
                      ->get();
                      if(strlen($pins) < 3){
                          $pins = DB::table('airtime_pins')
                          ->Where('amount', $search)
                          ->orderBy('id', 'desc')
                          ->take($num)
                          ->get();
                          if(strlen($pins) < 3){
                              $pins = DB::table('airtime_pins')
                              ->Where('created_by', $user->username)
                              ->orderBy('id', 'desc')
                              ->take($num)
                              ->get();
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
    else
    {
        return response()->json(['status' => 0, 'message' => 'Access Denied!', 'result' => []], 401);
    }
}
///////////////////////// AIRTIME PRINTING ///////////////

////////////////////////TRANSFER//////////////////////////
public function transfer(Request $request){
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

          $sender =  $user->username;

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
///////////////////////TRANSFER//////////////////////////
}

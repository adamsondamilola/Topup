<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Http\Controllers\EncryptController;
use App\Http\Controllers\MailerController ;

class WABAMessageTemplateController extends Controller
{

  private $topUpDomain = "https://topupearn.com/";
  private $topUpDomainApi = "https://api.topupearn.com/api/v1/";
  private $topUpDomainApi2 = "https://api.topupearn.com/api/";
  private $globalStatus = 0;

  //create new account
  public function signup($phone, $name, $message_id, $msg)
  {
    $role = "User";

    $email = substr($phone, 3);
    $email = "0".$email;

      $package = "Free Account";
      $username = Str::random(15);
      $phone = "+".$phone;

      $ifPhoneExists = DB::table('users')
      ->Where('phone', $phone)
      ->count();

      $ifUsernameExists = DB::table('users')
      ->Where('username', $username)
      ->count();

      if($ifUsernameExists > 0)
      {
        return 'Registration failed. Please, try again';

      }
      else if($ifPhoneExists > 0){
      return "Phone number already exists";
      }
      else
      {

        $web_settings = DB::table('website_settings')
        ->Where('id', 1)
        ->first();

        $package_amount = 0;
        $points = 0;
/*
        $package = DB::table('packages')
        ->Where('type', $web_settings->package_type)
        ->Where('package', $package)
        ->first();
        */

        $package_amount = 0;
        $points = 0;

          DB::insert('insert into users (
              first_name,
              phone,
              email,
              username,
              device_info,
              country,
              package,
              package_amount,
              role
              )
          values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
              $name,
              $phone,
              $email,
              $username,
              "Whatsapp",
              "Nigeria",
              $package,
              0,
              $role
          ]);

//Create wallet
DB::insert('insert into wallet (username)values (?)', [$username]);

if( $package_amount > 0){
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
      0,
      0,
      $package
  ]);
}

//create bank account
if($this->createBankAccount($username) == "Account Created!")
{

  $flutterwave = DB::table('flutterwave_accounts')
  ->Where('username', $username)
  ->first();

  $message = "Hi ".$name."\n\nWe are indeed glad to have you onboard. \n\nTransactions on our chatbot does not take more a minute to get processed\n\nTo fund your wallet, kindly use the account details below\n\n";
  $message .= "*Bank Account Details*\n";
  $message .= "Account Number: *".$flutterwave->account_number."*\n";
  $message .= "Account Name: *".$flutterwave->account_name."*\n";
  $message .= "Bank Name: *".$flutterwave->bank_name."*\n\n";
  $message .= "Kind Regards!";
  return $message;
}
else
{
    /*
    $ifUsernameExists = DB::table('users')
      ->Where('username', $username)
      ->count();
      */

  return "Account created, but we are unable to create a bank account for you at the moment."; ////$this->createBankAccount($username); //
}

      }
  }


  public function createBankAccount($username)
  {

      $data = [
          "username" => $username,
          'email' => "support@topupearn.com"
      ];

if($username != "")
{
$url = $this->topUpDomainApi2."flutterwave/reserveFlutterwaveAccount";
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
        //  'Authorization: Bearer '.$this->accessToken
        ]);
      // Execute cURL request with all previous settings
      $response = curl_exec($curl);
      $json_obj   = json_decode($response);
      curl_close($curl);

      if($json_obj == null){
           return $response;
      }
      else if($json_obj->status == 1){
           return $json_obj->message;
      }
      else
      {
          return $json_obj->message;
      }
 }
 else{
     return "Failed to create bank account number. Please try again.";
 }
  }


      public function checkForRepetition($message, $phone)
      {
              $last_message_out = DB::table('whatsapp_cloud_messages')
              ->Where('phone', $phone)
              ->Where('message_type', 'outbound')
              ->orderBy('id', 'desc')
              ->first();
              if($last_message_out->message != $message)
              {
                  return $message;
              }
              else
              {
                  return null;
              }

      }


      public function buyAirtimeVtuApi($beneficiary, $amount, $network, $phone, $token)
      {

          $data = [
              "network" => $network,
              'amount' => $amount,
              'phone' => $beneficiary,
              'token' => $token
          ];

          //last vtu order
          $pending_vtu = DB::table('whatsapp_vtu')
          ->Where('beneficiary', $beneficiary)
          ->Where('phone', $phone)
          ->Where('status', 0)
          ->orderBy('id', 'desc')
          ->first();

          //delete other pending orders
          DB::table('whatsapp_vtu')
          ->Where('status', 0)
          ->Where('phone', $phone)
          ->Where('id', '!=', $pending_vtu->id)
          ->delete();
    //return "text test";
    if($pending_vtu->status == 0)
    {
    $url = $this->topUpDomainApi."recharge/buy_airtime";
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
            //  'Authorization: Bearer '.$this->accessToken
            ]);
          // Execute cURL request with all previous settings
          $response = curl_exec($curl);
          $json_obj   = json_decode($response);
                        //$response = $json_obj->status;
          // Close cURL session
          curl_close($curl);

          if($json_obj->status == 1){
               DB::update('update whatsapp_vtu set status = ? where id = ? and beneficiary = ? limit 1',[1, $pending_vtu->id, $beneficiary]);
               return $json_obj->message;
          }
          else
          {
              //$send_mail = $this->sendMail("WABA Error", $this->email, "no_reply@topupearn.com", $json_obj->message);
              return $json_obj->message;
          }
     }
     else{
         return "Transaction failed. Please try again.";
     }

      }


    public function buyAirtimePinApi($quantity, $amount, $network, $phone, $token)
    {

        $data = [
            "network" => $network,
            'amount' => $amount,
            'quantity' => $quantity,
            'token' => $token
        ];

        //last vtu order
        $pending_airtime_epin = DB::table('whatsapp_airtime_epin')
        ->Where('phone', $phone)
        ->Where('quantity', $quantity)
        ->Where('status', 0)
        ->orderBy('id', 'desc')
        ->first();

        //delete other pending orders
        DB::table('whatsapp_airtime_epin')
        ->Where('phone', $phone)
        ->Where('status', 0)
        ->Where('id', '!=', $pending_airtime_epin->id)
        ->delete();
  //return "text test";
  if($pending_airtime_epin->status == 0)
  {
  $url = $this->topUpDomainApi."recharge/print_airtime";
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
          //  'Authorization: Bearer '.$this->accessToken
          ]);
        // Execute cURL request with all previous settings
        $response = curl_exec($curl);
        $json_obj   = json_decode($response);
                      //$response = $json_obj->status;
        // Close cURL session
        curl_close($curl);

        if($json_obj->status == 1){

$token = Str::random(80);

             DB::update('update whatsapp_airtime_epin set status = ?, token = ? where id = ? and phone = ? limit 1',[1, $token, $pending_airtime_epin->id, $phone]);
$message = "";
$decrypt = new EncryptController;

$message .= $json_obj->pins;
$message .= "To print airtime PIN, kindly click the link below.\n";
$message .= $this->topUpDomain."user/".$json_obj->airtime_id."/".$token."/airtime/print";

             return $message;

        }
        else
        {
            //$send_mail = $this->sendMail("WABA Error", $this->email, "no_reply@topupearn.com", $json_obj->message);
            return $json_obj->message;
        }
   }
   else
   {
       return "Transaction failed. Please try again.";
   }

    }


    public function buyNormalDataApi($beneficiary, $amount, $network, $phone, $token)
    {

        $data = [
            "network" => $network,
            'amount' => $amount,
            'phone' => $beneficiary,
            'token' => $token
        ];

        //last vtu order
        $pending_vtu = DB::table('whatsapp_vtu')
        ->Where('beneficiary', $beneficiary)
        ->Where('phone', $phone)
        ->Where('status', 0)
        ->orderBy('id', 'desc')
        ->first();

        //delete other pending orders
        DB::table('whatsapp_vtu')
        ->Where('status', 0)
        ->Where('phone', $phone)
        ->Where('id', '!=', $pending_vtu->id)
        ->delete();
    //return "text test";
    if($pending_vtu->status == 0)
    {
    $url = $this->topUpDomainApi."recharge/buy_data";
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
          //  'Authorization: Bearer '.$this->accessToken
          ]);
        // Execute cURL request with all previous settings
        $response = curl_exec($curl);
        $json_obj   = json_decode($response);
                      //$response = $json_obj->status;
        // Close cURL session
        curl_close($curl);

        if($json_obj->status == 1){
             DB::update('update whatsapp_vtu set status = ? where id = ? and beneficiary = ? limit 1',[1, $pending_vtu->id, $beneficiary]);
             return $json_obj->message;
        }
        else
        {
            //$send_mail = $this->sendMail("WABA Error", $this->email, "no_reply@topupearn.com", $json_obj->message);
            return $json_obj->message;
        }
    }
    else{
       return "Transaction failed. Please try again.";
    }

    }

    public function buyMtnSmeDataApi($beneficiary, $amount, $network, $phone, $token)
    {

        $data = [
            "network" => $network,
            "network_desc" => "Data",
            'amount' => $amount,
            'phone' => $beneficiary,
            'token' => $token
        ];

        //last vtu order
        $pending_vtu = DB::table('whatsapp_vtu')
        ->Where('beneficiary', $beneficiary)
        ->Where('phone', $phone)
        ->Where('status', 0)
        ->orderBy('id', 'desc')
        ->first();

        //delete other pending orders
        DB::table('whatsapp_vtu')
        ->Where('status', 0)
        ->Where('phone', $phone)
        ->Where('id', '!=', $pending_vtu->id)
        ->delete();
    //return "text test";
    if($pending_vtu->status == 0)
    {

    $url = $this->topUpDomainApi."recharge/mtn_sme_data";
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
          //  'Authorization: Bearer '.$this->accessToken
          ]);
        // Execute cURL request with all previous settings
        $response = curl_exec($curl);
        $json_obj   = json_decode($response);
                      //$response = $json_obj->status;
        // Close cURL session
        curl_close($curl);

        if($json_obj->status == 1){
             DB::update('update whatsapp_vtu set status = ? where id = ? and beneficiary = ? limit 1',[1, $pending_vtu->id, $beneficiary]);
             return $json_obj->message;
        }
        else
        {
            //$send_mail = $this->sendMail("WABA Error", $this->email, "no_reply@topupearn.com", $json_obj->error->message);
            return $json_obj->message;
        }
    }
    else{
       return "Transaction failed. Please try again.";
    }

    }

//pay electricity bills
//verify meter
public function verifyMeter($meter_number, $product_code, $token)
{

  $data = [
    'meter_number' => $meter_number,
    'product_code' => $product_code,
    'token' => $token
  ];

$url = $this->topUpDomainApi."recharge/verify_meter";
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
    //  'Authorization: Bearer '.$this->accessToken
    ]);
  // Execute cURL request with all previous settings
  $response = curl_exec($curl);
  $json_obj   = json_decode($response);
                //$response = $json_obj->status;
  // Close cURL session
  curl_close($curl);

  if($json_obj->status == 1){
      $this->globalStatus = 1;
       return $json_obj->name;
  }
  else
  {
      //$send_mail = $this->sendMail("WABA Error", $this->email, "no_reply@topupearn.com", $json_obj->message);
      return $json_obj->message;
  }
}

//buy power token
    public function buyPowerTokenApi($beneficiary, $amount, $network, $phone, $token)
    {
      $type = "Electricity";
        $data = [
          'meter_number' => $beneficiary,
            "product_code" => $network,
            'amount' => $amount,
            'token' => $token
        ];

        $pending_bill = DB::table('whatsapp_utility_bills')
        ->Where('beneficiary', $beneficiary)
        ->Where('phone', $phone)
        ->Where('type', $type)
        ->Where('status', 0)
        ->orderBy('id', 'desc')
        ->first();

        //delete other pending orders
        DB::table('whatsapp_utility_bills')
        ->Where('status', 0)
        ->Where('phone', $phone)
        ->Where('id', '!=', $pending_bill->id)
        ->delete();

    if($pending_bill->status == 0)
    {

    $url = $this->topUpDomainApi."recharge/electricity_subscription";
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
          //  'Authorization: Bearer '.$this->accessToken
          ]);
        // Execute cURL request with all previous settings
        $response = curl_exec($curl);
        $json_obj   = json_decode($response);
                      //$response = $json_obj->status;
        // Close cURL session
        curl_close($curl);

        if($json_obj->status == 1){
             DB::update('update whatsapp_utility_bills set status = ? where id = ? and beneficiary = ? limit 1',[1, $pending_bill->id, $beneficiary]);
             return "Transaction Successful. Below is your token \n\n".$json_obj->token;
        }
        else
        {
           // $send_mail = $this->sendMail("WABA Error", $this->email, "no_reply@topupearn.com", $json_obj->message);
            return $json_obj->message;
        }
    }
    else{
       return "Transaction failed. Please try again.";
    }

    }


    //pay cable  bills
    //verify cable
    public function verifyCableTv($beneficiary, $product_code, $token)
    {

      $data = [
        'iuc' => $beneficiary,
        'product_code' => $product_code,
        'token' => $token
      ];

    $url = $this->topUpDomainApi."recharge/verify_cable";
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
        //  'Authorization: Bearer '.$this->accessToken
        ]);
      // Execute cURL request with all previous settings
      $response = curl_exec($curl);
      $json_obj   = json_decode($response);
                    //$response = $json_obj->status;
      // Close cURL session
      curl_close($curl);

      if($json_obj->status == 1){
           $this->globalStatus = 1;
          return $json_obj->name;
      }
      else if($json_obj->status == 0)
      {
          //$send_mail = $this->sendMail("WABA Error", $this->email, "no_reply@topupearn.com", $json_obj->message);
          return $json_obj->message;
      }
      else
      {
          return "Unknown error occurred, please try again.";
      }
    }

    //buy cable tv sub
        public function buyCableSubApi($beneficiary, $amount, $network, $phone, $token)
        {
          $type = "TV";
            $data = [
              'iuc' => $beneficiary,
                "product_code" => $network,
                'token' => $token
            ];

            $pending_bill = DB::table('whatsapp_utility_bills')
            ->Where('beneficiary', $beneficiary)
            ->Where('phone', $phone)
            ->Where('type', $type)
            ->Where('status', 0)
            ->orderBy('id', 'desc')
            ->first();

            //delete other pending orders
            DB::table('whatsapp_utility_bills')
            ->Where('status', 0)
            ->Where('phone', $phone)
            ->Where('id', '!=', $pending_bill->id)
            ->delete();

        if($pending_bill->status == 0)
        {

        $url = $this->topUpDomainApi."recharge/cable_subscription";
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
              //  'Authorization: Bearer '.$this->accessToken
              ]);
            // Execute cURL request with all previous settings
            $response = curl_exec($curl);
            $json_obj   = json_decode($response);
                          //$response = $json_obj->status;
            // Close cURL session
            curl_close($curl);

            if($json_obj->status == 1){
                 DB::update('update whatsapp_utility_bills set status = ? where id = ? limit 1',[1, $pending_bill->id]);
                 return $json_obj->message;
            }
            else if($json_obj->status == 0)
            {
                //$send_mail = $this->sendMail("WABA Error", $this->email, "no_reply@topupearn.com", $json_obj->message);
                return $json_obj->message;
            }
            else
            {
                return "Operation failed, please try again.";
            }
        }
        else{
           return "Transaction failed. Please try again.";
        }

        }

    //get user details
    public function getUserDetailsByPhone($phone)
    {

      $service_url     = $this->topUpDomainApi."user/".$this->getUserApiTokenByPhone($phone)."/user_details";
              $curl    = curl_init($service_url);
              curl_setopt($curl, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json',
  //'Authorization: Bearer '.$api->api_secret_key.''
  ]);
              curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
              curl_setopt($curl, CURLOPT_POST, false);
              curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
              $curl_response   = curl_exec($curl);
              curl_close($curl);
              $json_objekat    = json_decode($curl_response);
              $data          = $json_objekat;
              if($data->status == 0){
                return $data->message;
              }
              else if($data->status == 1)
              {
                $message = "Main Wallet: *".$data->wallet[0]->main_wallet." NGN*\n";
                $message .= "Cash-back: *".$data->wallet[0]->cashback_balance." NGN*\n";
                $message .= "Cash-back Withdrawn: *".$data->wallet[0]->cashback_withdrawn." NGN*\n";
                $message .= "Commission: *".$data->wallet[0]->referral_balance." NGN*\n";
                $message .= "Commission Withdrawn: *".$data->wallet[0]->referral_withdrawn." NGN*\n";
                $message .= "Points: *".$data->wallet[0]->points." NGN*\n";
                $message .= "\n*Bank Account Details*\n";
                $message .= "Account Number: *".$data->bankAccount->account_number."*\n";
                $message .= "Account Name: *".$data->bankAccount->account_name."*\n";
                $message .= "Bank Name: *".$data->bankAccount->bank_name."*";
                return $message;
              }
              else
              {
                return "Operation failed!";
              }
    }

  public function saveMessage($phone, $name, $message, $message_id)
  {
    DB::insert('insert into whatsapp_cloud_messages (
        phone, name, message, message_id, message_type
        )
    values (?, ?, ?, ?, ?)', [
        $phone, $name, $message, $message_id, "outbound"
    ]);
  }

  public function getUsernameByphone($phone)
  {
      $phone = "+".$phone;
    $user = DB::table('users')
    ->Where('phone', $phone)
    ->Where('status', 1)
    ->first();
    return $user->username;
  }

  public function checkUserByphone($phone)
  {
      $phone = "+".$phone;
    //$phone = ltrim($phone, $str[0]);
    $user = DB::table('users')
    ->Where('phone', $phone)
    ->Where('status', 1)
    ->count();

    if($user > 0) return true;
    else return false;
  }

  public function getUserApiTokenByPhone($phone)
  {
    $phone = "+".$phone;

    $user = DB::table('users')
    ->Where('phone', $phone)
    ->first();

    //check if user has api
    $api = DB::table('login_logs')
    ->Where('user_id', $user->id)
    ->Where('login_type', "api")
    ->Where('is_token_valid', 1)
    ->first();

    if(!$api)
    {

    //Create api token
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

      return $token;

    }
    else
    {
        return $api->login_token;
    }
  }

  public function trackLaundryOrderById($id)
  {

    $service_url     = "https://polar-bastion-77939.herokuapp.com/api/".$id."/order_details";
            $curl            = curl_init($service_url);
            curl_setopt($curl, CURLOPT_HTTPHEADER, [
'Content-Type: application/json',
//'Authorization: Bearer '.$api->api_secret_key.''
]);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_POST, false);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            $curl_response   = curl_exec($curl);
            curl_close($curl);
            $json_objekat    = json_decode($curl_response);
            $data          = $json_objekat->status;
            if($data == false){
              return "No order found for *".$id."*. Kindly note that order ID is case sensitive. \nEnter 2 to try again";
            }
            else
            {
              if($json_objekat->message->status == 0) return "Your order is pending pickup. A representative will contact you for pickup.";
              if($json_objekat->message->status == 1) return "Your order has been picked up";
              if($json_objekat->message->status == 2) return "We are processing your order and will be delivered when done.";
              if($json_objekat->message->status == 3) return "Your laundry order is done and we are processing it for delivery.";
              if($json_objekat->message->status == 4) return "Laundry service for the order ID *".$id."* has been delivered!";
              if($json_objekat->message->status == 5) return "Order Rejected!";
            }
  }

  public function newUserMessage($phone, $name, $message_id)
  {
      $message = "Hi ".$name.", \nit seems its your first time here. We are indeed glad to have you onboard and we hope you will have a wonderful experience.";
      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }

  public function responseToGreeting($phone, $name, $message_id)
  {
    $message = "Hi, Thanks for contacting us. Kindly respond with a number associated with the service you need.\n";
    $message .= "1. *Laundry Service*\n";
    $message .= "2. *Track Laundry Order*\n";
    $message .= "3. *Internet Data*\n";
    $message .= "4. *SME Data*\n";
    $message .= "5. *Airtime (VTU)*\n";
    $message .= "6. *Print Airtime*\n";
    $message .= "7. *Cable TV*\n";
    $message .= "8. *Electricity Bills*\n";
    $message .= "9. *Topup Wallet*\n";
    $message .= "10. *Open Topup Account*\n";
    $message .= "11. *Shortcuts*\n";

    $this->saveMessage($phone, $name, $message, $message_id);

      return $message;
  }

  public function shortcutKeys($phone, $name, $message_id)
  {
    $message = "You can use the words in lowercase below to request for the listed services.";
    $message .= "\n_laundry_ - *Laundry Service*";
    $message .= "\n_track_ - *Track Laundry Order*";
    $message .= "\n_data_ - *Internet Data*";
    $message .= "\n_sme_ - *SME Data*";
    $message .= "\n_airtime_ - *Airtime (VTU)*";
    $message .= "\n_print_ - *Print Airtime*";
    $message .= "\n_tv_ - *Cable TV*";
    $message .= "\n_power_ - *Electricity Bills*";
    $message .= "\n_wallet_ - *Topup Wallet*";
    $message .= "\n_new_ - *Open Topup Account*";
    $message .= "\n_shortcut_ - *Shortcut*";

    $this->saveMessage($phone, $name, $message, $message_id);

      return $message;
  }

  public function noTopupearnAccount($phone, $name, $message_id)
  {
      $message = "Opps!!! Seems its your first time using this service. \n\nKindly wait for 1 minute while we create an account for you....\n\nYou won't go through this stress again.\n\n";
      $message .= "Enter *1* to proceed or ignore if you do not want to open an account.\n";
      $message .= "1. *Proceed*";
      //$this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }

  public function openTopupearnAccount($phone, $name, $message_id)
  {
    $message = "Kindly wait for 1 minute while we create an account for you...\n\n";
    $message .= "Enter *1* to proceed or ignore if you do not want to open an account.\n";
      $message .= "1. *Proceed*";
      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }

  public function laundryService($phone, $name, $message_id)
  {
    $message = "For new laundry service, kindly click the link below. To track your laundry order, enter 2. \n\n";
    $message .= "https://elaundry.ng";
    $message .= "\n\nYou can also download our App from Apple and Google stores";
    $message .= "\n\nAndroid: https://play.google.com/store/apps/details?id=ng.elaundry.laundry&fbclid=IwAR11y3Ao4b5lxR9OZmMVuIzEn6mtMt8FC662IxUA3wf4ckO7PTTBvcwVFa8";
    $message .= "\n\niOS: https://apps.apple.com/tt/app/elaundry-nigeria/id1620559074";
      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }

  public function trackLaundry($phone, $name, $message_id, $msg)
  {
    $message = "";

    //last response from us
        $last_message_out = DB::table('whatsapp_cloud_messages')
        ->Where('phone', $phone)
        ->Where('message_type', 'outbound')
        ->orderBy('id', 'desc')
        ->first();

        //last response from user
            $last_message_in = DB::table('whatsapp_cloud_messages')
            ->Where('phone', $phone)
            ->Where('message_type', 'inbound')
            ->orderBy('id', 'desc')
            ->first();

    if($msg == "2" || $msg == "track")
    {
      $message = "Please enter your laundry tracking ID";
    }

    if($last_message_out->message == "Please enter your laundry tracking ID" && $last_message_in->message != "2" && $last_message_in->message != "track")
    {
      $message = $this->trackLaundryOrderById($last_message_in->message);
    }

      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }

//buy airtime
  public function buyAirtimeVTU($phone, $name, $message_id, $msg)
  {
    $message = "";
    $network = "";
    $amount = "";
    $benefitiary = "";

    //last response from us
        $last_message_out = DB::table('whatsapp_cloud_messages')
        ->Where('phone', $phone)
        ->Where('message_type', 'outbound')
        ->orderBy('id', 'desc')
        ->first();

        //last response from user
            $last_message_in = DB::table('whatsapp_cloud_messages')
            ->Where('phone', $phone)
            ->Where('message_type', 'inbound')
            ->orderBy('id', 'desc')
            ->first();

            if($msg == "5" || $msg == "airtime")
            {
                if($this->checkUserByphone($phone))
                {
                      $message = "Enter a number from the list of networks below";
                      $message .= "\n1. *MTN*";
                      $message .= "\n2. *GLO*";
                      $message .= "\n3. *AIRTEL*";
                      $message .= "\n4. *9MOBILE*";
                }
                else
                {


                   $message = $this->noTopupearnAccount($phone, $name, $message_id);
                }

            }

            if(str_contains($last_message_out->message, "Enter a number from the list of networks below") && $last_message_in->message != "5" && $last_message_in->message != "airtime")
            {
                $network = "";
              if(trim($last_message_in->message) == "1") $network = "MTN";
              else if(trim($last_message_in->message) == "2") $network = "GLO";
              else if(trim($last_message_in->message) == "3") $network = "AIRTEL";
              else if(trim($last_message_in->message) == "4") $network = "9MOBILE";
              //else return "You entered an invalid command";

//insert order for whatsapp vtu
              DB::insert('insert into whatsapp_vtu (
                  phone, network
                  )
              values (?, ?)', [
                  $phone, $network
              ]);

              $message = "You selected *".$network." VTU*. Please, enter amount";

            }

            if(str_contains($last_message_out->message, "VTU*. Please, enter amount"))
{
  $amount = $last_message_in->message;
  if(!is_numeric($amount))
  {
    $message = "You entered an invalid amount. Please, try again.";
  }
  else
  {
    //last vtu order
        $pending_vtu = DB::table('whatsapp_vtu')
        ->Where('phone', $phone)
        ->Where('status', 0)
        ->orderBy('id', 'desc')
        ->first();

    DB::update('update whatsapp_vtu set amount = ? where id = ?',[$amount, $pending_vtu->id]);

    $message = "Type *self* if you want to recharge ".$phone." or enter phone number of beneficiary for airtime VTU.";
  }
}

if(str_contains($last_message_out->message, " or enter phone number of beneficiary for airtime VTU"))
{
$beneficiary = $last_message_in->message;
if(trim(strtolower($beneficiary)) != "self" && !is_numeric($beneficiary))
{
$message = "You entered an invalid phone number.";
}
else if(is_numeric($beneficiary))
{
  //last vtu order
      $pending_vtu = DB::table('whatsapp_vtu')
      ->Where('phone', $phone)
      ->Where('status', 0)
      ->orderBy('id', 'desc')
      ->first();

  DB::update('update whatsapp_vtu set beneficiary = ? where id = ?',[$beneficiary, $pending_vtu->id]);
$message = "You are about to send airtime ( *".$pending_vtu->network."* VTU ) of *".$pending_vtu->amount." NGN* to *".$beneficiary."*.\nEnter 1 to proceed, 2 to cancel\n";
$message .= "1. *Proceed*\n";
$message .= "2. *Cancel*";
}
else if(trim(strtolower($beneficiary)) == "self")
{
  $beneficiary = substr($phone, 3);
  $beneficiary = "0".$beneficiary;
  //last vtu order
      $pending_vtu = DB::table('whatsapp_vtu')
      ->Where('phone', $phone)
      ->Where('status', 0)
      ->orderBy('id', 'desc')
      ->first();

  DB::update('update whatsapp_vtu set beneficiary = ? where id = ?',[$beneficiary, $pending_vtu->id]);
$message = "You are about to send airtime ( *".$pending_vtu->network."* VTU ) of *".$pending_vtu->amount." NGN* to *".$beneficiary."*.\nEnter 1 to proceed, 2 to cancel\n";
$message .= "1. *Proceed*\n";
$message .= "2. *Cancel*";
}
else
{
$message = "Sorry, we are unable to process your order.";
}
}

if(str_contains($last_message_out->message, "You are about to send airtime") && $last_message_in->message == "1")
  {
    $pending_vtu = DB::table('whatsapp_vtu')
    ->Where('phone', $phone)
    ->Where('status', 0)
    ->orderBy('id', 'desc')
    ->first();

    $message = $this->buyAirtimeVtuApi($pending_vtu->beneficiary, $pending_vtu->amount, $pending_vtu->network, $phone, $this->getUserApiTokenByPhone($phone));

  }
else if(str_contains($last_message_out->message, "You are about to send airtime") && $last_message_in->message == "2")
    {
      $message = "You canceled your order. If you need more services, simply say *Hi*.";
    }

      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }

  public function buyAirtimePin($phone, $name, $message_id, $msg)
  {
    $message = "";
    $network = "";
    $amount = "";
    $quantity = "";

    //last response from us
        $last_message_out = DB::table('whatsapp_cloud_messages')
        ->Where('phone', $phone)
        ->Where('message_type', 'outbound')
        ->orderBy('id', 'desc')
        ->first();

        //last response from user
            $last_message_in = DB::table('whatsapp_cloud_messages')
            ->Where('phone', $phone)
            ->Where('message_type', 'inbound')
            ->orderBy('id', 'desc')
            ->first();

            if($msg == "6" || $msg == "print")
            {
                if($this->checkUserByphone($phone))
                {
                      $message = "Enter a number of the network PIN you want to generate from the list below";
                      $message .= "\n1. *MTN*";
                      $message .= "\n2. *GLO*";
                      $message .= "\n3. *AIRTEL*";
                      $message .= "\n4. *9MOBILE*";
                }
                else
                {
                   $message = $this->noTopupearnAccount($phone, $name, $message_id);
                }

            }

            if(str_contains($last_message_out->message, "Enter a number of the network PIN you want to generate from the list below") && $last_message_in->message != "6" && $last_message_in->message != "print")
            {
                $network = "";
              if(trim($last_message_in->message) == "1") $network = "MTN";
              else if(trim($last_message_in->message) == "2") $network = "GLO";
              else if(trim($last_message_in->message) == "3") $network = "AIRTEL";
              else if(trim($last_message_in->message) == "4") $network = "9MOBILE";
              //else return "You entered an invalid command";

//insert order for whatsapp vtu
              DB::insert('insert into whatsapp_airtime_epin (
                  phone, network
                  )
              values (?, ?)', [
                  $phone, $network
              ]);

              $message = "You selected *".$network." airtime pin*. Please, enter amount\n";
              $message .= "*100*\n";
              $message .= "*200*\n";
              //$message .= "*400* (MTN ONLY)\n";
              $message .= "*500*\n";
              $message .= "*1000*\n";

            }

            if(str_contains($last_message_out->message, "airtime pin*. Please, enter amount"))
{
  $amount = $last_message_in->message;
  if(!is_numeric($amount))
  {
    $message = "You entered an invalid amount. Please, try again.";
  }
  else
  {
    //last vtu order
        $pending_pin = DB::table('whatsapp_airtime_epin')
        ->Where('phone', $phone)
        ->Where('status', 0)
        ->orderBy('id', 'desc')
        ->first();

    DB::update('update whatsapp_airtime_epin set amount = ? where id = ?',[$amount, $pending_pin->id]);

    $message = "Enter the quantity of airtime pins you want. It ranges from 1 - 100.";
  }
}

if(str_contains($last_message_out->message, "Enter the quantity of airtime pins you want"))
{
$quantity = $last_message_in->message;
if(!is_numeric($quantity))
{
$message = "You entered an invalid number.";
}
else if(is_numeric($quantity))
{
  //last vtu order
      $pending_pin = DB::table('whatsapp_airtime_epin')
      ->Where('phone', $phone)
      ->Where('status', 0)
      ->orderBy('id', 'desc')
      ->first();

  DB::update('update whatsapp_airtime_epin set quantity = ? where id = ?',[$quantity, $pending_pin->id]);
$message = "You are about to purchase airtime ( *".$pending_pin->network."* PIN ) of *".$pending_pin->amount." NGN* per unit.\nQuantity: ".$quantity."\nEnter 1 to proceed, 2 to cancel\n";
$message .= "1. *Proceed*\n";
$message .= "2. *Cancel*";
}
else
{
$message = "Sorry, we are unable to process your order.";
}
}

if(str_contains($last_message_out->message, "You are about to purchase airtime") && $last_message_in->message == "1")
  {
    $pending_pin = DB::table('whatsapp_airtime_epin')
    ->Where('phone', $phone)
    ->Where('status', 0)
    ->orderBy('id', 'desc')
    ->first();

    $message = $this->buyAirtimePinApi($pending_pin->quantity, $pending_pin->amount, $pending_pin->network, $phone, $this->getUserApiTokenByPhone($phone));

  }
else if(str_contains($last_message_out->message, "You are about to purchase airtime") && $last_message_in->message == "2")
    {
      $message = "You canceled your order. If you need more services, simply say *Hi*.";
    }

      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }


  //buy data ---
  public function buyData($phone, $name, $message_id, $msg)
  {
    $message = "";
    $network = "";
    $amount = "";
    $benefitiary = "";

    //last response from us
        $last_message_out = DB::table('whatsapp_cloud_messages')
        ->Where('phone', $phone)
        ->Where('message_type', 'outbound')
        ->orderBy('id', 'desc')
        ->first();

        //last response from user
            $last_message_in = DB::table('whatsapp_cloud_messages')
            ->Where('phone', $phone)
            ->Where('message_type', 'inbound')
            ->orderBy('id', 'desc')
            ->first();

            if($msg == "3" || $msg == "data")
            {
                if($this->checkUserByphone($phone))
                {
                      $message = "Enter a number from the list of data providers below";
                      $message .= "\n1. *MTN*";
                      $message .= "\n2. *GLO*";
                      $message .= "\n3. *AIRTEL*";
                      $message .= "\n4. *9MOBILE*";
                }
                else
                {
                   $message = $this->noTopupearnAccount($phone, $name, $message_id);
                }

            }

            if(str_contains($last_message_out->message, "Enter a number from the list of data providers below"))
            {
                $network = "";
              if(trim($last_message_in->message) == "1") $network = "MTN";
              else if(trim($last_message_in->message) == "2") $network = "GLO";
              else if(trim($last_message_in->message) == "3") $network = "AIRTEL";
              else if(trim($last_message_in->message) == "4") $network = "9MOBILE";

//insert order for whatsapp vtu
              DB::insert('insert into whatsapp_vtu (
                  phone, network
                  )
              values (?, ?)', [
                  $phone, $network
              ]);

if(!is_numeric(trim($last_message_in->message))) $message = "You entered an invalid command. Please try again.";
else
{
  $pending_vtu = DB::table('whatsapp_vtu')
  ->Where('phone', $phone)
  ->Where('status', 0)
  ->orderBy('id', 'desc')
  ->first();

  $data_billing = DB::table('data_billing')
  ->Where('data_type', 'NORMAL')
  ->Where('network', $pending_vtu->network)
  ->orderBy('id', 'asc')
 ->get()
  ->all();

  $message = "You selected *".$network." Data*. Please, select a package below by entering the number of the package\n\n";
  foreach($data_billing as $packages)
  {
    $message .= $packages->id.". *".$packages->data_description."*\n";
    $message .= "Amount: *".$packages->data_amount."* NGN\n";
    if($packages->days == "1") $message .= "Duration: *24 Hours*\n\n";
    if($packages->days != "1") $message .= "Duration: *".$packages->days." Days*\n\n";
  }

}

            }

            if(str_contains($last_message_out->message, "Data*. Please, select a package"))
{

  $package = $last_message_in->message;
  if(!is_numeric($package))
  {
    $message = "You entered an invalid command. Please, try again.";
  }
  else
  {
    $data_billing = DB::table('data_billing')
    ->Where('data_type', 'NORMAL')
    ->Where('id', $package)
   ->first();
if($data_billing)
{
  //last data order
        $pending_vtu = DB::table('whatsapp_vtu')
        ->Where('phone', $phone)
        ->Where('status', 0)
        ->orderBy('id', 'desc')
        ->first();

        DB::update('update whatsapp_vtu set network = ?, amount = ? where id = ?',[$data_billing->data_code, $data_billing->data_amount, $pending_vtu->id]);

    $message = "Type *self* if you want to recharge ".$phone." or enter phone number of beneficiary for data share.";
}
else
{
    $message = "Operation failed. Please try again.";
}

  }
}

if(str_contains($last_message_out->message, " or enter phone number of beneficiary for data share"))
{
$beneficiary = $last_message_in->message;
if(trim(strtolower($beneficiary)) != "self" && !is_numeric($beneficiary))
{
$message = "You entered an invalid phone number.";
}
else if(is_numeric($beneficiary))
{
  //last vtu order
      $pending_vtu = DB::table('whatsapp_vtu')
      ->Where('phone', $phone)
      ->Where('status', 0)
      ->orderBy('id', 'desc')
      ->first();

  DB::update('update whatsapp_vtu set beneficiary = ? where id = ?',[$beneficiary, $pending_vtu->id]);
$message = "You are about to send data worth of *".$pending_vtu->amount." NGN* to *".$beneficiary."*.\nEnter 1 to proceed, 2 to cancel\n";
$message .= "1. *Proceed*\n";
$message .= "2. *Cancel*";
}
else if(trim(strtolower($beneficiary)) == "self")
{
  $beneficiary = substr($phone, 3);
  $beneficiary = "0".$beneficiary;
  //last vtu order
      $pending_vtu = DB::table('whatsapp_vtu')
      ->Where('phone', $phone)
      ->Where('status', 0)
      ->orderBy('id', 'desc')
      ->first();

  DB::update('update whatsapp_vtu set beneficiary = ? where id = ?',[$beneficiary, $pending_vtu->id]);
$message = "You are about to send data worth of *".$pending_vtu->amount." NGN* to *".$beneficiary."*.\nEnter 1 to proceed, 2 to cancel\n";
$message .= "1. *Proceed*\n";
$message .= "2. *Cancel*";
}
else
{
$message = "Sorry, we are unable to process your order.";
}
}

if(str_contains($last_message_out->message, "You are about to send data worth of") && $last_message_in->message == "1")
  {
    $pending_vtu = DB::table('whatsapp_vtu')
    ->Where('phone', $phone)
    ->Where('status', 0)
    ->orderBy('id', 'desc')
    ->first();

    $message = $this->buyNormalDataApi($pending_vtu->beneficiary, $pending_vtu->amount, $pending_vtu->network, $phone, $this->getUserApiTokenByPhone($phone));

  }
else if(str_contains($last_message_out->message, "You are about to send data worth of") && $last_message_in->message == "2")
    {
      $message = "You canceled your order. If you need more services, simply say *Hi*.";
    }

      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }
  //buy data -->



  //buy sme data ---
  public function buyMtnSmeData($phone, $name, $message_id, $msg)
  {
    $message = "";
    $network = "";
    $amount = "";
    $benefitiary = "";

    //last response from us
        $last_message_out = DB::table('whatsapp_cloud_messages')
        ->Where('phone', $phone)
        ->Where('message_type', 'outbound')
        ->orderBy('id', 'desc')
        ->first();

        //last response from user
            $last_message_in = DB::table('whatsapp_cloud_messages')
            ->Where('phone', $phone)
            ->Where('message_type', 'inbound')
            ->orderBy('id', 'desc')
            ->first();


            if($msg == "4" || $msg == "sme")
            {
                if($this->checkUserByphone($phone))
                {
                      $message = "Enter a number from the list of SME Data providers below";
                      $message .= "\n1. *MTN*";
                      $message .= "\n2. *AIRTEL*";
                }
                else
                {
                   $message = $this->noTopupearnAccount($phone, $name, $message_id);
                }


            }


            if(str_contains($last_message_out->message, "Enter a number from the list of SME Data providers below"))
            {
              if(trim($last_message_in->message) == "1") $network = "MTN";
              //else if(trim($last_message_in->message) == "2") $network = "GLO";
              else if(trim($last_message_in->message) == "2") $network = "AIRTEL";
              //else if(trim($last_message_in->message) == "4") $network = "9MOBILE";

              //else return "You entered an invalid command";

  //insert order for whatsapp vtu
          $insert =  DB::insert('insert into whatsapp_vtu (
                  phone, network
                  )
              values (?, ?)', [
                  $phone, $network
              ]);

if($insert)
{
  $pending_vtu = DB::table('whatsapp_vtu')
  ->Where('phone', $phone)
  ->Where('status', 0)
  ->orderBy('id', 'desc')
  ->first();

  $data_billing = DB::table('data_billing')
  ->Where('data_type', 'SME')
  ->Where('network', $pending_vtu->network)
  ->orderBy('id', 'asc')
  ->get()
  ->all();

  $message = "You selected *".$network." Data (SME)*. Please, select a package below by entering the number of the package\n\n";
  foreach($data_billing as $packages)
  {
    $message .= $packages->id.". *".$packages->data_description."*\n";
    $message .= "Amount: *".$packages->data_amount." NGN*\n";
    if($packages->days == "1") $message .= "*Duration: 24 Hours*\n\n";
    if($packages->days != "1") $message .= "Duration: *".$packages->days." Days*\n\n";
  }
}
else
  {
    $message = "Package not found. Please try again.";
  }


            }

if(str_contains($last_message_out->message, "Data (SME)*. Please, select a package"))
  {

  $package = $last_message_in->message;
  if(!is_numeric($package))
  {
    $message = "You entered an invalid command. Please, try again.";
  }
  else
  {
    $data_billing = DB::table('data_billing')
    ->Where('data_type', 'SME')
    ->Where('id', $package)
   ->first();
  if($data_billing)
  {
  //last data order
        $pending_vtu = DB::table('whatsapp_vtu')
        ->Where('phone', $phone)
        ->Where('status', 0)
        ->orderBy('id', 'desc')
        ->first();

        DB::update('update whatsapp_vtu set network = ?, amount = ? where id = ?',[$data_billing->data_code, $data_billing->data_amount, $pending_vtu->id]);

    $message = "Type *self* if you want to recharge ".$phone." or enter phone number of beneficiary for the SME data.";
  }
  else
{
  $message = "Operation failed. Please try again.";
}

  }
  }

  if(str_contains($last_message_out->message, " or enter phone number of beneficiary for the SME data"))
  {
  $beneficiary = $last_message_in->message;
  if(trim(strtolower($beneficiary)) != "self" && !is_numeric($beneficiary))
  {
  $message = "You entered an invalid phone number.";
  }
  else if(is_numeric($beneficiary))
  {
  //last vtu order
      $pending_vtu = DB::table('whatsapp_vtu')
      ->Where('phone', $phone)
      ->Where('status', 0)
      ->orderBy('id', 'desc')
      ->first();

  DB::update('update whatsapp_vtu set beneficiary = ? where id = ?',[$beneficiary, $pending_vtu->id]);
  $message = "You are about to send SME data worth of *".$pending_vtu->amount." NGN* to *".$beneficiary."*.\nEnter 1 to proceed, 2 to cancel\n";
  $message .= "1. *Proceed*\n";
  $message .= "2. *Cancel*";
  }
  else if(trim(strtolower($beneficiary)) == "self")
  {
  $beneficiary = substr($phone, 3);
  $beneficiary = "0".$beneficiary;
  //last vtu order
      $pending_vtu = DB::table('whatsapp_vtu')
      ->Where('phone', $phone)
      ->Where('status', 0)
      ->orderBy('id', 'desc')
      ->first();

  DB::update('update whatsapp_vtu set beneficiary = ? where id = ?',[$beneficiary, $pending_vtu->id]);
  $message = "You are about to send SME data worth of *".$pending_vtu->amount." NGN* to *".$beneficiary."*.\nEnter 1 to proceed, 2 to cancel\n";
  $message .= "1. *Proceed*\n";
  $message .= "2. *Cancel*";
  }
  else
  {
  $message = "Sorry, we are unable to process your order.";
  }
  }

  if(str_contains($last_message_out->message, "You are about to send SME data worth of") && $last_message_in->message == "1")
  {
    $pending_vtu = DB::table('whatsapp_vtu')
    ->Where('phone', $phone)
    ->Where('status', 0)
    ->orderBy('id', 'desc')
    ->first();

    $message = $this->buyMtnSmeDataApi($pending_vtu->beneficiary, $pending_vtu->amount, $pending_vtu->network, $phone, $this->getUserApiTokenByPhone($phone));

  }
  else if(str_contains($last_message_out->message, "You are about to send SME data worth of") && $last_message_in->message == "2")
    {
      $message = "You canceled your order. If you need more services, simply say *Hi*.";
    }

      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }
  //buy sme data -->


  //buy electricity ---
  public function buyPowerToken($phone, $name, $message_id, $msg)
  {
    $message = "";
    $network = "";
    $amount = "";
    $benefitiary = "";

    //last response from us
        $last_message_out = DB::table('whatsapp_cloud_messages')
        ->Where('phone', $phone)
        ->Where('message_type', 'outbound')
        ->orderBy('id', 'desc')
        ->first();

        //last response from user
            $last_message_in = DB::table('whatsapp_cloud_messages')
            ->Where('phone', $phone)
            ->Where('message_type', 'inbound')
            ->orderBy('id', 'desc')
            ->first();


            if($msg == "8" || $msg == "power")
            {

if($this->checkUserByphone($phone))
                {
                      DB::insert('insert into whatsapp_utility_bills (
                      phone, type
                      )
                  values (?, ?)', [
                      $phone, "Electricity"
                  ]);

  $billing = DB::table('electricity_billing')
  ->orderBy('id', 'asc')
  ->get()
  ->all();

  $message = "To purchase electricity bill; Please, select a package below by entering the number of the package\n\n";
  foreach($billing as $packages)
  {
    $message .= $packages->id.". *".$packages->product."*\n\n";
  }

                }
                else
                {
                   $message = $this->noTopupearnAccount($phone, $name, $message_id);
                }


}



if(str_contains($last_message_out->message, "To purchase electricity bill; Please"))
  {

  $package = $last_message_in->message;
  if(!is_numeric($package))
  {
    $message = "You entered an invalid command. Please, try again.";
  }
  else
  {

    $billing = DB::table('electricity_billing')
    ->Where('id', $package)
   ->first();
  if($billing)
  {
  //last data order
        $pending_bill = DB::table('whatsapp_utility_bills')
        ->Where('phone', $phone)
        ->Where('status', 0)
        ->orderBy('id', 'desc')
        ->first();

        DB::update('update whatsapp_utility_bills set network = ? where id = ?',[$billing->product_code, $pending_bill->id]);

    $message = "Enter meter number.";
  }
  else
{
  $message = "Operation failed. Please try again.";
}

  }
  }

  if(str_contains($last_message_out->message, "Enter meter number"))
  {

  $beneficiary = $last_message_in->message;

  $pending_bill = DB::table('whatsapp_utility_bills')
  ->Where('phone', $phone)
  ->Where('status', 0)
  ->orderBy('id', 'desc')
  ->first();

  $verify = $this->verifyMeter($beneficiary, $pending_bill->network, $this->getUserApiTokenByPhone($phone));

  if(trim(!is_numeric($beneficiary)))
  {
  $message = "You entered an invalid meter number.";
  }
  else if($this->globalStatus == 0)
  {
    $message = $verify;
  }
  else if(is_numeric($beneficiary))
  {
  //last vtu order
      $pending_bill = DB::table('whatsapp_utility_bills')
      ->Where('phone', $phone)
      ->Where('status', 0)
      ->orderBy('id', 'desc')
      ->first();

  DB::update('update whatsapp_utility_bills set beneficiary = ? where id = ?',[$beneficiary, $pending_bill->id]);
  $message = "Enter the amount of electricity token you want to purchase.";

  }

  else
  {
  $message = "Sorry, we are unable to process your order.";
  }
  }

  if(str_contains($last_message_out->message, "Enter the amount of electricity token you want to purchase"))
  {
$amount = $last_message_in->message;

if(!is_numeric($amount))
{
    $message = "You entered an invalid amount";
}
else
{
  $pending_bill = DB::table('whatsapp_utility_bills')
  ->Where('phone', $phone)
  ->Where('status', 0)
  ->orderBy('id', 'desc')
  ->first();

  DB::update('update whatsapp_utility_bills set amount = ? where id = ?',[$amount, $pending_bill->id]);
  $verify = $this->verifyMeter($pending_bill->beneficiary, $pending_bill->network, $this->getUserApiTokenByPhone($phone));
  $name = $verify;

  $message = "You are about to purchase electricity token worth of *".$amount." NGN* for meter number *".$pending_bill->beneficiary."* with account holder name, *".$name."*.\nEnter 1 to proceed, 2 to cancel\n";
  $message .= "1. *Proceed*\n";
  $message .= "2. *Cancel*";
}


    //$message = $this->buyMtnSmeDataApi($pending_vtu->beneficiary, $pending_vtu->amount, $pending_vtu->network, $phone, $this->getUserApiTokenByPhone($phone));

  }

  if(str_contains($last_message_out->message, "You are about to purchase electricity token worth of") && $last_message_in->message == "1")
  {
    $pending_bill = DB::table('whatsapp_utility_bills')
    ->Where('phone', $phone)
    ->Where('status', 0)
    ->orderBy('id', 'desc')
    ->first();

    $message = $this->buyPowerTokenApi($pending_bill->beneficiary, $pending_bill->amount, $pending_bill->network, $phone, $this->getUserApiTokenByPhone($phone));

  }
  else if(str_contains($last_message_out->message, "You are about to purchase electricity token worth of") && $last_message_in->message == "2")
    {
      $message = "You canceled your order. If you need more services, simply say *Hi*.";
    }

      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }
  //}
  //}
  //buy electricity -->


  //buy cable ---
  public function buyCableSub($phone, $name, $message_id, $msg)
  {
    $message = "";
    $network = "";
    $amount = "";
    $benefitiary = "";

    //last response from us
        $last_message_out = DB::table('whatsapp_cloud_messages')
        ->Where('phone', $phone)
        ->Where('message_type', 'outbound')
        ->orderBy('id', 'desc')
        ->first();

        //last response from user
            $last_message_in = DB::table('whatsapp_cloud_messages')
            ->Where('phone', $phone)
            ->Where('message_type', 'inbound')
            ->orderBy('id', 'desc')
            ->first();

            if(($msg == "7" && !str_contains($last_message_out->message, "Cable*. Please, select a package")) || $msg == "tv")
            {
                if($this->checkUserByphone($phone))
                {
                      $message = "Enter a number from the list of cable TV providers below";
                      $message .= "\n1. *DSTV*";
                      $message .= "\n2. *GOTV*";
                      $message .= "\n3. *STARTIMES*";
                }
                else
                {
                   $message = $this->noTopupearnAccount($phone, $name, $message_id);
                }

            }

           else if(str_contains($last_message_out->message, "Enter a number from the list of cable TV providers below"))
            {
                $network = "";
              if(trim($last_message_in->message) == "1") $network = "DSTV";
              else if(trim($last_message_in->message) == "2") $network = "GOTV";
              else if(trim($last_message_in->message) == "3") $network = "STARTIMES";

//insert order for whatsapp vtu
              DB::insert('insert into whatsapp_utility_bills (
                  phone, network
                  )
              values (?, ?)', [
                  $phone, $network
              ]);

if(!is_numeric(trim($last_message_in->message))) $message = "You entered an invalid command. Please try again.";
else
{
    if(is_numeric($last_message_in->message)){
        $pending_bill = DB::table('whatsapp_utility_bills')
  ->Where('phone', $phone)
  ->Where('status', 0)
  ->orderBy('id', 'desc')
  ->first();


  $billing = DB::table('cable_billing')
  ->Where('serviceID', "$pending_bill->network")
  ->orderBy('serial', 'asc')
 ->get()
  ->all();


  $message = "You selected *".$network." Cable*. Please, select a package below by entering the number of the package\n\n";
  foreach($billing as $packages)
  {
    $message .= $packages->serial.". *".$packages->service_description."*\n";
    $message .= "Amount: *".$packages->service_amount." NGN*\n\n";
  }
    }
else
{
    $message = "Invalid selection";
}


}

            }

            else if(str_contains($last_message_out->message, "Cable*. Please, select a package"))
{

  $package = $last_message_in->message;
  if(!is_numeric($package))
  {
    $message = "You entered an invalid command. Please, try again.";
  }
  else
  {
    $billing = DB::table('cable_billing')
    ->Where('serial', $package)
   ->first();
if($billing)
{
  //last data order
        $pending_bill = DB::table('whatsapp_utility_bills')
        ->Where('phone', $phone)
        ->Where('status', 0)
        ->orderBy('id', 'desc')
        ->first();

        DB::update('update whatsapp_utility_bills set network = ?, amount = ? where id = ?',[$billing->service_code, $billing->service_amount, $pending_bill->id]);

    $message = "Enter IUC number.";
}
else
{
    $message = "Operation failed. Please try again.";
}

  }
}

else if(str_contains($last_message_out->message, "Enter IUC number"))
{

$beneficiary = $last_message_in->message;

$pending_bill = DB::table('whatsapp_utility_bills')
->Where('phone', $phone)
->Where('status', 0)
->orderBy('id', 'desc')
->first();

$verify = $this->verifyCableTv($beneficiary, $pending_bill->network, $this->getUserApiTokenByPhone($phone));

if(trim(!is_numeric($beneficiary)))
{
$message = "You entered an invalid number.";
}
else if($this->globalStatus == 0)
{
  $message = $verify;
}
else if(is_numeric($beneficiary))
{
//last vtu order
    $pending_bill = DB::table('whatsapp_utility_bills')
    ->Where('phone', $phone)
    ->Where('status', 0)
    ->orderBy('id', 'desc')
    ->first();

DB::update('update whatsapp_utility_bills set beneficiary = ?, type = ? where id = ?',[$beneficiary, "TV", $pending_bill->id]);
$message = "You are about to subscribe to a cable TV package worth of *".$pending_bill->amount." NGN* to *".$beneficiary."* with account name ".$verify.".\nEnter 1 to proceed, 2 to cancel\n";
$message .= "1. *Proceed*\n";
$message .= "2. *Cancel*";

}

else
{
$message = "Sorry, we are unable to process your order.";
}
}


else if(str_contains($last_message_out->message, "You are about to subscribe to a cable TV package worth of") && $last_message_in->message == "1")
  {
    $pending_bill = DB::table('whatsapp_utility_bills')
    ->Where('phone', $phone)
    ->Where('status', 0)
    ->orderBy('id', 'desc')
    ->first();

    $message = $this->buyCableSubApi($pending_bill->beneficiary, $pending_bill->amount, $pending_bill->network, $phone, $this->getUserApiTokenByPhone($phone));

  }
else if(str_contains($last_message_out->message, "You are about to subscribe to a cable TV package worth of") && $last_message_in->message == "2")
    {
      $message = "You canceled your order. If you need more services, simply say *Hi*.";
    }

      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }
  //buy cable  -->


  //Topup Wallet---
  public function topupWallet($phone, $name, $message_id)
  {
    if($this->checkUserByphone($phone))
    {
      $message = "Below is your account balance details on ".$this->topUpDomain.". To credit your account, you can simply transfer to the account details provided below. Please, read our frequently asked questions for more details ".$this->topUpDomain."faq.\n\n";
      $message .= $this->getUserDetailsByPhone($phone);
    }
    else
    {
       $message = $this->noTopupearnAccount($phone, $name, $message_id);
    }

      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }
  //Topup wallet -->

  public function invalidCommand($phone, $name, $message_id)
  {
    $message = "Invalid Command. Just say *Hi* if you need my help.";
      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }
  public function responseToThanks($phone, $name, $message_id)
  {
    $message = "Thanks for choosing us. Just say *Hi* if you need any of our services.";
      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }

}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

use App\Http\Controllers\MailerController ;

class WABAMessageTemplateController extends Controller
{

  public function buyAirtimeVtuApi($beneficiary, $amount, $network, $token)
  {

      $data = [
          "network" => $network,
          'amount' => $amount,
          'phone' => $beneficiary,
          'token' => $token
      ];

$url = "https://api.topupearn.com/api/v1/recharge/buy_airtime";
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

      if($json_obj == null){
          return "Sorry, we are unable to complete your transaction.";
      }

      else if($json_obj->status == 0 ?? null){
          //$send_mail = $this->sendMail("WABA Error", $this->email, "no_reply@topupearn.com", $json_obj->error->message);
          return $json_obj->message;
      }
      else{
        return $json_obj->message;
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

  public function checkUserByphone($phone)
  {
    $phone = ltrim($phone, $str[0]);
    $user = DB::table('users')
    ->Where('phone', $phone)
    ->count();

    if($user > 0) return true;
    else { return false; }
  }

  public function getUserApiTokenByPhone($phone)
  {
    $phone = ltrim($phone, $str[0]);

    $user = DB::table('users')
    ->Where('phone', $phone)
    ->first();

    //check if user has api
    $api = DB::table('login_logs')
    ->Where('username', $user->username)
    ->Where('login_type', "api")
    ->Where('is_token_valid', 1)->first();

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
    //flutterwave
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
    $message .= "4. *MTN SME Data*\n";
    $message .= "5. *Airtime (VTU)*\n";
    $message .= "6. *Print Airtime*\n";
    $message .= "7. *Electricity Bills*\n";
    $message .= "8. *Topup Earn Wallet Balance*\n";
    $message .= "9. *Open Topup Earn Account*\n";
    $message .= "10. *Shortcut keys*\n";

    $this->saveMessage($phone, $name, $message, $message_id);

      return $message;
  }

  public function shortcutKeys($phone, $name, $message_id)
  {
    $message = "You can use the short keys below to request for the list services.";
    $message .= "\nlaundry - *Laundry Service*";
    $message .= "\ntrack - *Track Laundry Order*";
    $message .= "\ndata - *Internet Data*";
    $message .= "\nsme - *MTN SME Data*";
    $message .= "\nairtime - *Airtime (VTU)*";
    $message .= "\nprint - *Print Airtime*";
    $message .= "\npower *Electricity Bills*";
    $message .= "\ntopupwallet *Topup Earn Wallet Balance*";
    $message .= "\nshortcut - *Shortcut keys*";

    $this->saveMessage($phone, $name, $message, $message_id);

      return $message;
  }

  public function noTopupearnAccount($phone, $name, $message_id)
  {
      $message = "Sorry, no top up earn account is linked to this number. Kindly signup or request for your phone number update if you already have an account.\n\n";
      $message .= "https://topupearn.com/register";
      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }

  public function openTopupearnAccount($phone, $name, $message_id)
  {
    $message = "Topup earn is an online bill payment platform. You will be able to use this service if you have an account registered with this *".$phone."*. Kindly click the link below to get started. \n\n";
    $message .= "https://topupearn.com/register";

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
              $message = "Enter a number from the list of networks below";
              $message = "\n1. *MTN*";
              $message = "\n2. *GLO*";
              $message = "\n3. *AIRTEL*";
              $message = "\n4. *9MOBILE*";
            }

            if($last_message_out->message == "Enter a number from the list of networks below" && $last_message_in->message != "5" && $last_message_in->message != "airtime")
            {
              if(trim($last_message_in->message) == "1") $network = "MTN";
              else if(trim($last_message_in->message) == "2") $network = "GLO";
              else if(trim($last_message_in->message) == "3") $network = "AIRTEL";
              else if(trim($last_message_in->message) == "4") $network = "9MOBILE";
              //else return "You entered an invalid command";
              $message = "You selected *".$network." VTU*. Please, enter amount";

//insert order for whatsapp vtu
              DB::insert('insert into whatsapp_vtu (
                  phone, network
                  )
              values (?, ?)', [
                  $phone, $network
              ]);

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

$message = "You are about to send *".$pending_vtu->network."* VTU airtime of *".$pending_vtu->amount." NGN* to *".$beneficiary."*.\nEnter 1 to proceed, 2 to cancel\n";
$message .= "1. Proceed";
$message .= "2. Cancel";
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
$message = "You are about to send airtime (*".$pending_vtu->network."* VTU) of *".$pending_vtu->amount." NGN* to *".$beneficiary."*.\nEnter 1 to proceed, 2 to cancel\n";
$message .= "1. Proceed";
$message .= "2. Cancel";
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

    $message = $this->buyAirtimeVtuApi($pending_vtu->beneficiary, $pending_vtu->amount, $pending_vtu->network, $this->getUserApiTokenByPhone($phone));

  }
else if(str_contains($last_message_out->message, "You are about to send airtime") && $last_message_in->message == "2")
    {
      $message = "You canceled your order. If you need more services, simply say *Hi*.";
    }

      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }

  public function invalidCommand($phone, $name, $message_id)
  {
    $message = "Invalid Command. Just say *Hi* if you need my help.";
      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }
  public function responseToThanks($phone, $name, $message_id)
  {
    $message = "Thanks for choosing us. Just say *Hi* if you need our services.";
      $this->saveMessage($phone, $name, $message, $message_id);
      return $message;
  }


}

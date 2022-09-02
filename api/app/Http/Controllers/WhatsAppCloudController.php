<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Input;

use App\Http\Controllers\MailerController;
use App\Http\Controllers\WABAMessageTemplateController;

class WhatsAppCloudController extends Controller
{
  private $email = "adamsondamilola@gmail.com";
  private $version = "v13.0";
  private $messagingProduct = "whatsapp";
  private $recipientType = "individual";
  private $businessId = "432041555402309";
  private $phoneNumberId = "104470072401342";
  private $accessToken = "EAAWLn07CoDgBAMhJTwYepFGcF1g4SAM4ly6tR4qfHdYQtINjP7i6J1EgHgZB0UkQAvg7tF41lehXerQx4UZCejrAHfUWClb7PQP0fcNTVZCEiSH0H5eVajzNerZCZCJrNdAB30f4hBLXi0xmkqcZCG3njZCDUOij8qe6wJyZAxz8FnYCkY8PK9QKOAlUbu2mdhjc8elW0vZBmGQZDZD";
  private $wABAId = "103383822512018"; //Whatsapp business account ID

  public function sendMail($subject, $to, $from, $msg)
  {
      $mailer = new MailerController;
      $mailer->sendMail($subject, $to, $msg);
  }

  public function SendTextMessage($text, $phone, $withUrl)
  {
      $data = [
          "messaging_product" => $this->messagingProduct,
          'recipient_type' => $this->recipientType,
          'to' => $phone,
          'type' => 'text',
          'text' => array(
        'preview_url' => $withUrl,
        'body' => $text
        )
      ];

$url = "https://graph.facebook.com/".$this->version."/".$this->phoneNumberId."/messages";
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
          'Authorization: Bearer '.$this->accessToken
        ]);
      // Execute cURL request with all previous settings
      $response = curl_exec($curl);
      $json_obj   = json_decode($response);
                    //$response = $json_obj->status;
      // Close cURL session
      curl_close($curl);

      //return response()->json(['status' => 1, 'message' => $json_obj], 200);

      if($json_obj == null){
          return false;
      }

      else if($json_obj->error ?? null){
          $send_mail = $this->sendMail("WABA Error", $this->email, "no_reply@topupearn.com", $json_obj->error->message);
          return false;
      }

      else{
        return true;
      }
      /*
      else if($json_obj->messages[0]["id"])
      {

        DB::insert('insert into whatsapp_cloud_messages (
            phone, message, message_id, message_type
            )
        values (?, ?, ?, ?)', [
            $phone, $text, $json_obj->messages->id, "outbound"
        ]);


        return true;
      }*/
  }

  public function SendTemplateMessage($text, $phone, $template_name)
  {
      $data = [
          "messaging_product" => $this->messagingProduct,
          'recipient_type' => $this->recipientType,
          'to' => $phone,
          'type' => 'template',
          'template' => array(
        'name' => $template_name,
        'language' => array(
           'code' => 'en_US'
        )
        )
      ];

$url = "https://graph.facebook.com/".$this->version."/".$this->phoneNumberId."/messages";
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
          'Authorization: Bearer '.$this->accessToken
        ]);
      // Execute cURL request with all previous settings
      $response = curl_exec($curl);
      $json_obj   = json_decode($response);
                    //$response = $json_obj->status;
      // Close cURL session
      curl_close($curl);


      if($json_obj == null){
          return false;
      }

      else if($json_obj->error ?? null){
          $send_mail = $this->sendMail("WABA Error", $this->email, "no_reply@topupearn.com", $json_obj->error->message);
          return false;
      }
      else{
        return true;
      }
      /*
      else
      {

        DB::insert('insert into whatsapp_cloud_messages (
            phone, message, message_id, message_type
            )
        values (?, ?, ?, ?)', [
            $phone, $text, $json_obj->messages[0]["id"], "outbound"
        ]);

        return true;
      }*/
  }

  public function MessagesWebhook(Request $request)
  {

      if ($request->isMethod('get')) {

          $accessToken = '4wdresecuRED123@re';
          $fb_verify_token = $request->get('hub_verify_token');
          if($accessToken == $fb_verify_token)
          {
           return $request->get('hub_challenge');
          }
   return response()->json(['status' => 0, 'message' => "Failed Get Request!"], 401);
      }


if($request->isMethod('post'))
{


$messagesRes = new WABAMessageTemplateController;

$validator = Validator::make($request->all(), [
      'object' => 'required|string',
      'entry' => 'nullable|json'
  ]);

  if($request->entry)
  {

    $messageType = "";
    $message_id = "";
    $message = "";
    $messageSent = "";
    $phone = "";
    $name = "";
    $message_type = "";

/*
  if($request->entry[0]["changes"][0]["value"]["statuses"][0]["status"] ?? null)
    {
       // return entry[0]["changes"][0]["value"]["statuses"][0]["status"];
      $messageType = "outbound";
    }
*/
   if($request->entry[0]["changes"][0]["value"]["messages"][0]["from"] ?? null)
    {
    //    return entry[0]["changes"][0]["value"]["messages"][0]["from"];
      $messageType = "inbound";
    }




if($messageType == "inbound")
{
   // $send_mail = $this->sendMail("Message Initiated", $this->email, "no_reply@topupearn.com", "In bound");

  $message_id = $request->entry[0]["changes"][0]["value"]["messages"][0]["id"];
  $message = $request->entry[0]["changes"][0]["value"]["messages"][0]["text"]["body"];
  $phone = $request->entry[0]["changes"][0]["value"]["messages"][0]["from"];
  $name = $request->entry[0]["changes"][0]["value"]["contacts"][0]["profile"]["name"];
  $message_type = $messageType;

//insert new message from user
//check if message already exists before insert
$checkMsg = DB::table('whatsapp_cloud_messages')
->Where('phone', $phone)
->Where('message_id', $message_id)
->Where('message_type', "inbound")
->count();
if($checkMsg < 1)
{
  DB::insert('insert into whatsapp_cloud_messages (
      phone, message, message_id, message_type
      )
  values (?, ?, ?, ?)', [
      $phone, $message, $message_id, "inbound"
  ]);

}


$whatsapp_user_count = DB::table('whatsapp_cloud_users')
  ->Where('phone', $phone)
  ->count();

  //check if we already replied
  $alreadyReplied = false;
  $ifReplied = DB::table('whatsapp_cloud_messages')
  ->Where('phone', $phone)
  ->Where('message_id', $message_id)
  ->count();
  if($ifReplied > 1){
    $alreadyReplied = true;
  }

  //last response from us
      $last_message_out = DB::table('whatsapp_cloud_messages')
      ->Where('phone', $phone)
      ->Where('message_type', 'outbound')
      ->orderBy('id', 'desc')
      ->first();

      //last response from us count
          $last_message_out_count = DB::table('whatsapp_cloud_messages')
          ->Where('phone', $phone)
          ->Where('message_type', 'outbound')
          ->count();

      //last response from user
          $last_message_in = DB::table('whatsapp_cloud_messages')
          ->Where('phone', $phone)
          ->Where('message_type', 'inbound')
          ->orderBy('id', 'desc')
          ->first();

  //insert new user
          if($whatsapp_user_count < 1)
          {

            DB::insert('insert into whatsapp_cloud_users (
                phone, name
                )
            values (?, ?)', [
                $phone, $name
            ]);

            $this->SendTextMessage($messagesRes->newUserMessage($phone, $name, $message_id), $phone, false);

          }

          if(trim(strtolower($message)) == "hello" || trim(strtolower($message)) == "hi" || trim(strtolower($message)) == "help")
          {
            if(!$alreadyReplied)
            {
              $this->SendTextMessage($messagesRes->responseToGreeting($phone, $name, $message_id), $phone, false);
            }
          }


          //Track laundry --
                    else if($last_message_out->message == "Please enter your laundry tracking ID" && $message != "2" && strtolower($message) != "track")
                    {
                      $msg = trim(strtolower($message));
                      if(!$alreadyReplied)
                      {
                        $this->SendTextMessage($messagesRes->trackLaundry($phone, $name, $message_id, $msg), $phone, false);
                      }
                    }
          //Track laundry -->


          //airtime vtu --
                    else if(str_contains($last_message_out->message, "Enter a number from the list of networks below") && $last_message_in->message != "5" && $last_message_in->message != "airtime")
                    {
                      $msg = trim(strtolower($message));
                      if(!$alreadyReplied)
                      {
                        $this->SendTextMessage($messagesRes->buyAirtimeVTU($phone, $name, $message_id, $msg), $phone, false);
                      }
                    }
                    else if(str_contains($last_message_out->message, "VTU*. Please, enter amount"))
                    {
                      $msg = trim(strtolower($message));
                      if(!$alreadyReplied)
                      {
                        $this->SendTextMessage($messagesRes->buyAirtimeVTU($phone, $name, $message_id, $msg), $phone, false);
                      }
                    }
                    else if(str_contains($last_message_out->message, " or enter phone number of beneficiary for airtime VTU"))
                    {
                      $msg = trim(strtolower($message));
                      if(!$alreadyReplied)
                      {
                        $this->SendTextMessage($messagesRes->buyAirtimeVTU($phone, $name, $message_id, $msg), $phone, false);
                      }
                    }
                    else if(str_contains($last_message_out->message, "You are about to send airtime") && $last_message_in->message == "1")
                    {
                      $msg = trim(strtolower($message));
                      if(!$alreadyReplied)
                      {
                        $this->SendTextMessage($messagesRes->buyAirtimeVTU($phone, $name, $message_id, $msg), $phone, false);
                      }
                    }
          //airtime vtu -->


          else if(str_contains(strtolower($message), 'thanks') || str_contains(strtolower($message), 'thank you') || str_contains(strtolower($message), 'thank'))
          {
            if(!$alreadyReplied)
            {
              $this->SendTextMessage($messagesRes->responseToThanks($phone, $name, $message_id), $phone, false);
            }
          }

        else if(trim($message) == "1" || trim(strtolower($message)) == "laundry")
          {
            if(!$alreadyReplied)
            {
              $this->SendTextMessage($messagesRes->laundryService($phone, $name, $message_id), $phone, true);
            }
          }

          else if(trim(strtolower($message)) == "2" || trim(strtolower($message)) == "track")
                    {
                      $msg = trim(strtolower($message));
                      if(!$alreadyReplied)
                      {
                        $this->SendTextMessage($messagesRes->trackLaundry($phone, $name, $message_id, $msg), $phone, false);
                      }
                    }

           else if(trim(strtolower($message)) == "5" || trim(strtolower($message)) == "airtime")
                    {
                      $msg = trim(strtolower($message));
                      if(!$alreadyReplied)
                      {
                        $this->SendTextMessage($messagesRes->buyAirtimeVTU($phone, $name, $message_id, $msg), $phone, false);
                      }
                    }

            else if(trim(strtolower($message)) == "shortcut" || trim($message) == "10")
          {
            if(!$alreadyReplied)
            {
              $this->SendTextMessage($messagesRes->shortcutKeys($phone, $name, $message_id), $phone, false);
            }
          }
          else{
            if(!$alreadyReplied)
            {
              $this->SendTextMessage($messagesRes->invalidCommand($phone, $name, $message_id), $phone, false);
            }
          }

return response()->json(['status' => 1, 'message' => "Task Completed"], 200);

}

/*
else if($messageType == "outbound")
{

//$send_mail = $this->sendMail("Message Initiated", $this->email, "no_reply@topupearn.com", "Out bound");

  //save message in db if sent only
  if($request->entry[0]["changes"][0]["value"]["statuses"][0]["status"] == "sent")
{

  $message_id = $request->entry[0]["changes"][0]["value"]["statuses"][0]["id"];

  DB::update('update whatsapp_cloud_messages set message_status = ?
    where message_id = ?',["sent", $message_id]);

}
return response()->json(['status' => 1, 'message' => "Task Completed"], 200);
}
*/
else
{
return response()->json(['status' => 0, 'message' => "Failed"], 401);
}

  }

return response()->json(['status' => 1, 'message' => "Passed Validation!"], 200);
}

  }


}

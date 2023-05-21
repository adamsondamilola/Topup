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

class WhatsAppChatCloudController extends Controller
{
//7035415663
  private $email = "adamsondamilola@gmail.com";
  private $version = "v14.0";
  private $messagingProduct = "whatsapp";
  private $recipientType = "individual";
  private $businessId = "432041555402309";
  private $phoneNumberId = "105974352248264";
  private $accessToken = "EAAWLn07CoDgBAMAmtgYea2a8yZC2mAZC1dduZAu6TBuOLbWPPsgPyiZBH3e0OTcZBCA06203eyLB2i4wad4XiXWebMQzGqiJrP006hHHiVDWldxWubZAO19Lc6et8rMEglJsiZAM0yZBf1Otvxjo2x3BBeTmZBvaCm0OAjZADLU5dQt3GiZAL7qlZCjMSmFDBDHmcn89QgpPgW8iogZDZD";
  private $wABAId = "105830162263209"; //Whatsapp business account ID




  public function userSendTextMessage($text, $phone, $withUrl)
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

        $agent="";
/*        $agent = DB::table('whatsapp_cloud_chats')
        ->Where('phone', $phone)
        ->Where('message_type', "outbound")
        ->orderBy('id', 'desc')
        ->first()->conversation_with;

        DB::update('update whatsapp_cloud_chats set conversation_with = ? where phone = ? limit 1',[$agent, $phone]);
*/
        DB::insert('insert into whatsapp_cloud_chats (
            phone, message, message_id, message_type
            )
        values (?, ?, ?, ?)', [
            $phone, $text, $json_obj->messages->id, "inbound"
        ]);

        return true;
      }
  }

  public function agentSendTextMessage($agent, $text, $phone, $message_id)
  {
      $data = [
          "messaging_product" => $this->messagingProduct,
          'recipient_type' => $this->recipientType,
          'to' => $phone,
          'type' => 'text',
          'text' => array(
        'preview_url' => true,
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

        DB::update('update whatsapp_cloud_chats set message_status = ?, conversation_with = ? where phone = ? and message_status = ? limit 1',["Replied", $agent, $phone, "Pending"]);

        DB::insert('insert into whatsapp_cloud_chats (
            phone, message, message_id, message_type, conversation_with
            )
        values (?, ?, ?, ?, ?)', [
            $phone, $text, $message_id, "outbound", $agent
        ]);

        return true;
      }
  }

    public function continueConversation($agent, $text, $phone, $message_id)
  {


        DB::update('update whatsapp_cloud_chats set message_status = ?, conversation_with = ? where phone = ? and message_status = ? limit 1',["Replied", $agent, $phone, null]);

        DB::insert('insert into whatsapp_cloud_chats (
            phone, message, message_id, message_type, conversation_with
            )
        values (?, ?, ?, ?, ?)', [
            $phone, $text, $message_id, "inbound", $agent
        ]);

        return true;

  }


}

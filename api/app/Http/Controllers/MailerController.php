<?php

namespace App\Http\Controllers;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class MailerController extends Controller
{
    public function sendMail($subject, $to, $msg)
    {

        $web_settings = DB::table('website_settings')
        ->Where('id', 1)
        ->first();

        $message = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';
        $message .= '<html xmlns="http://www.w3.org/1999/xhtml"
               xmlns:v="urn:schemas-microsoft-com:vml"
               xmlns:o="urn:schemas-microsoft-com:office:office">
              <head>';

        $message .= '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- So that mobile will display zoomed in -->
                <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- enable media queries for windows phone 8 -->
                <meta name="format-detection" content="date=no"> <!-- disable auto date linking in iOS 7-9 -->
                <meta name="format-detection" content="telephone=no"> <!-- disable auto telephone linking in iOS 7-9 -->
                <title>Message</title>';

        $message .= '<style type="text/css">
              body {
                margin: 0;
                padding: 0;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
              }
              table {
                border-spacing: 0;
              }
              table td {
                border-collapse: collapse;
              }
              .ExternalClass {
                width: 100%;
              }
              .ExternalClass,
              .ExternalClass p,
              .ExternalClass span,
              .ExternalClass font,
              .ExternalClass td,
              .ExternalClass div {
                line-height: 100%;
              }
              .ReadMsgBody {
                width: 100%;
                background-color: #ebebeb;
              }
              table {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
              }
              img {
                -ms-interpolation-mode: bicubic;
              }
              .yshortcuts a {
                border-bottom: none !important;
              }
              @media screen and (max-width: 599px) {
                .force-row,
                .container {
                  width: 100% !important;
                  max-width: 100% !important;
                }
              }
              @media screen and (max-width: 400px) {
                .container-padding {
                  padding-left: 12px !important;
                  padding-right: 12px !important;
                }
              }
              .ios-footer a {
                color: #aaaaaa !important;
                text-decoration: underline;
              }
              .button {
          background-color: #4CAF50; /* Green */
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
            }
              a[href^="x-apple-data-detectors:"],
              a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
              }
              </style>';
        $message .= '</head>';

        $message .= '<body style="margin:0; padding:0;" bgcolor="#F0F0F0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">';

        $message .=  '<table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#F0F0F0">
                <tr>
                  <td align="center" valign="top" bgcolor="#F0F0F0" style="background-color: #F0F0F0;">
                    <br>
                    <!-- 600px container (white background) -->
                    <table border="0" width="600" cellpadding="0" cellspacing="0" class="container" style="width:600px;max-width:600px">
                      <tr>
                        <td class="container-padding header" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;padding-bottom:12px;color:#DF4726;padding-left:24px;padding-right:24px">
                          '.$web_settings->title.'
                        </td>
                      </tr>
                      <tr>
                        <td class="container-padding content" align="left" style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#ffffff">
                          <br>
              <div class="title" style="font-family:Helvetica, Arial, sans-serif;font-size:18px;font-weight:600;color:#374550">'.$web_settings->title.'</div>
              <br>';
        $message .= '<div class="body-text" style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#333333">';
        $message .= $msg;
        $message .= '</div></td></tr>';
        $message .= '<tr><td class="container-padding footer-text" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px"><br><br>All rights reserved: © 2022.';
        $message .= '<br><br>';
        $message .= 'You are receiving this email because you opted in on our website. Update your <a href="#" style="color:#aaaaaa">email preferences</a> or <a href="#" style="color:#aaaaaa">unsubscribe</a>.';
        $message .= '<br><br>';
        $message .= '<strong>'.$web_settings->title.'.</strong><br>';
      //  $message .=  '<span class="ios-footer">Head Office Address.<br>Springfield, MA 12345<br></span>';
        $message .=  '<a href="'.$web_settings->url.'" style="color:#aaaaaa">'.$web_settings->url.'</a><br>';
        $message .= '<br><br>';
        $message .= '</td></tr>';
        $message .= '</table>';
        $message .= '</td></tr>';
        $message .= '</table>';
        $message .= '</body></html>';

try {

    $to = $to;
    $subject = $subject;
    $from = $web_settings->mailer;
    $msg = $msg;

    // To send HTML mail, the Content-type header must be set
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

    // Create email headers
    $headers .= 'From: '.$from."\r\n".
        'Reply-To: '.$from."\r\n" .
        'X-Mailer: PHP/' . phpversion();

    // Compose a simple HTML email message

    // Sending email
    mail($to, $subject, $message, $headers);

    //return true;

} catch (\Throwable $th) {
  //  return false;
}
    }

}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class EncryptController extends Controller
{

  public function encryptString($string)
  {
    // Store the cipher method
$ciphering = "AES-128-CTR";
// Use OpenSSl Encryption method
$iv_length = openssl_cipher_iv_length($ciphering);
$options = 0;

// Non-NULL Initialization Vector for encryption
$encryption_iv = '1234567890132456';

// Store the encryption key
$encryption_key = "gfrt4567hfewgdt76yuds`~";

// Use openssl_encrypt() function to encrypt the data
$encryption = openssl_encrypt($string, $ciphering,
            $encryption_key, $options, $encryption_iv);

return $encryption;
  }

  public function decryptString($string)
  {
    // Store the cipher method
  $ciphering = "AES-128-CTR";
  // Use OpenSSl Encryption method
  $iv_length = openssl_cipher_iv_length($ciphering);
  $options = 0;

  // Non-NULL Initialization Vector for encryption
  $decryption_iv = '1234567890132456';

  // Store the encryption key
  $decryption_key = "gfrt4567hfewgdt76yuds`~";

            $decryption = openssl_decrypt ($string, $ciphering,
                  $decryption_key, $options, $decryption_iv);

  return $decryption;
  }

}

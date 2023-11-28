import 'dart:convert';

import 'package:crypto/crypto.dart';
import 'package:encrypt/encrypt.dart';
import 'package:nigeria_airtime_app/Components/popup_message.dart';

class EncryptData{
//for AES Algorithms

  static String token = "2trDg65G&hf@ed09&^fVfw4#@!qas6tg";
  static final key = Key.fromUtf8(token);
  static final iv = IV.fromLength(16);
  static final encrypter = Encrypter(AES(key));

  static String encryptAES(plainText){
    final encrypted = encrypter.encrypt(plainText, iv: iv);
    return encrypted.base64;
  }

  static String decryptAES(enctyptedText){
    try{
      final Encrypted encrypted = Encrypted.fromBase64(enctyptedText);
      final decrypted = encrypter.decrypt(encrypted, iv: iv);
      return decrypted;
    }
    catch(e){
      print(e);
      //PopupMessage('Please try again', false);
      return "";
    }
  }

}
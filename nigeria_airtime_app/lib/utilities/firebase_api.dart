import 'dart:convert';

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:http/http.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/endpoints.dart';

class FirebaseApi {

final _firebaseMessaging = FirebaseMessaging.instance;

Future<void> handleBackgroundMessage(RemoteMessage message) async {
  print('Title: ${message.notification?.title}');
  print('Body: ${message.notification?.body}');
  print('Playload: ${message.data}');
}

Future<void> iniNotifications() async {
  await _firebaseMessaging.requestPermission();
  final fCMToken = await _firebaseMessaging.getToken();
  //print('Token $fCMToken');
  final prefs = await SharedPreferences.getInstance();
  prefs.setString('fCMToken', '$fCMToken');
  FirebaseMessaging.onBackgroundMessage(handleBackgroundMessage);
}

Future<void> createPushNotificationAcct(String email) async {
  try {
    final prefs = await SharedPreferences.getInstance();
    Response response = await post(
        Uri.parse('$mainEndpoint/push/notification/create'),
        body: {
    'email' : email,
    'platform' : 'firebase',
    'device_id' : prefs.getString('fCMToken'),
    }
    );

    if(response.statusCode == 200){
      var data = jsonDecode(response.body.toString());
      //final data = jsonDecode(response.body);
      print('push reg successful');
    }
    else {
      print('push reg failed or already exists');
    }

  }
  catch(e){
    print('failed');
  }
}

}
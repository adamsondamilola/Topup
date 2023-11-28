import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart';
import 'package:local_auth/local_auth.dart';
import 'package:overlay_loading_progress/overlay_loading_progress.dart';
import 'package:nigeria_airtime_app/Components/popup_message.dart';
import 'package:nigeria_airtime_app/Screens/Auth/Components/already_have_an_account_acheck.dart';
import 'package:nigeria_airtime_app/Screens/Auth/forgot_password.dart';
import 'package:nigeria_airtime_app/Screens/Auth/sign_up.dart';
import 'package:nigeria_airtime_app/Screens/Dashboard/dashboard_screen.dart';
import 'package:nigeria_airtime_app/constants/endpoints.dart';
import 'package:nigeria_airtime_app/utilities/encrypt_decrypt.dart';
import 'package:nigeria_airtime_app/utilities/firebase_api.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../constants/colors_consts.dart';
import 'package:local_auth/error_codes.dart' as auth_error;
import 'dart:convert';
//import 'package:http/http.dart' as http;

bool isBioSet = false;

class DefaultResponse {
  final int status;
  final String message;

  const DefaultResponse({required this.status, required this.message});

  factory DefaultResponse.fromJson(Map<String, dynamic> json) {
    return DefaultResponse(
      status: json['status'] as int,
      message: json['message'] as String,
    );
  }
}

class CreatePinForm extends StatefulWidget {
  const CreatePinForm({super.key});

  @override
  State<CreatePinForm> createState() {
    return _CreatePinForm();
  }
}

class _CreatePinForm extends State<CreatePinForm> {
  TextEditingController passwordController = TextEditingController();
  TextEditingController confirmPasswordController = TextEditingController();
  bool isLoginSuccessful = false;




  void createPin() async {

    SharedPreferences prefs = await SharedPreferences.getInstance();
    const storage = FlutterSecureStorage();
    try{
      var token = await storage.read(key: 'access_token');
      Response response = await post(
          Uri.parse('$mainEndpoint/auth/create_pin'),
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer $token',
          },
          body: {
            'password' : passwordController.text.toString(),
            'password2': confirmPasswordController.text.toString()
          }
      );

      if(response.statusCode == 200){
        var data = jsonDecode(response.body.toString());
        String encr = EncryptData.encryptAES(passwordController.text);
//        prefs.setString('pin', encr);
        await storage.write(key: 'pin', value: encr);
        
        //final data = jsonDecode(response.body);
        PopupMessage('PIN created successfully', true);
        print('Login successfully');
        OverlayLoadingProgress.stop();
        //await FirebaseApi().createPushNotificationAcct(email);
        
          Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const DashboardScreen())
          ); 

        //OverlayLoadingProgress.stop();
      }else {
        var data = jsonDecode(response.body.toString());
        PopupMessage(data['message'], false);
        print('failed');
        OverlayLoadingProgress.stop();
      }
    }catch(e){
      print(e.toString());
      PopupMessage("Internal server error", false);
      OverlayLoadingProgress.stop();
    }
  }


  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {

    return Form(
      child: Column(
        children: [
         TextFormField(
            controller: passwordController,
            textInputAction: TextInputAction.next,
            keyboardType: TextInputType.number,
            maxLength: 4,
            obscureText: true,
            cursorColor: kPrimaryLightColor,
            style: const TextStyle(color: kTextColor),
            decoration: const InputDecoration(
              labelText: "New PIN",
              prefixIcon: Padding(
                padding:  EdgeInsets.all(defaultPadding),
                child: Icon(Icons.lock),
              ),
            ),
          ),

          Padding(
            padding: const EdgeInsets.symmetric(vertical: defaultPadding),
            child: TextFormField(
              controller: confirmPasswordController,
              textInputAction: TextInputAction.done,
              obscureText: true,
              keyboardType: TextInputType.number,
              maxLength: 4,
              cursorColor: kPrimaryLightColor,
              style: const TextStyle(color: kTextColor),
              decoration: const InputDecoration(
                labelText: "Confirm PIN",
                prefixIcon: Padding(
                  padding:  EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.lock),
                ),
              ),
            ),
          ),
           
          const SizedBox(height: defaultPadding),
          Hero(
            tag: "pin_btn",
            child: ElevatedButton(
              onPressed: () {
                OverlayLoadingProgress.start(context, barrierDismissible: false);
                createPin();
              },
              child: Text(
                "Create Transactions PIN".toUpperCase(),
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
         Container(height: 10,),
          
        ],
      ),
    );
  }
}

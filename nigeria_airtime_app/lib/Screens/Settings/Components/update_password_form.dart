import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:overlay_loading_progress/overlay_loading_progress.dart';
import 'package:nigeria_airtime_app/Components/popup_message.dart';
import 'package:nigeria_airtime_app/Screens/Settings/Components/set_bio.dart';
import 'package:nigeria_airtime_app/constants/endpoints.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../utilities/encrypt_decrypt.dart';
import '../../Auth/Components/already_have_an_account_acheck.dart';
import '../../../constants/colors_consts.dart';
import 'package:nigeria_airtime_app/Screens/Dashboard/dashboard_screen.dart';
import '../../Auth/log_in.dart';

class UpdatePasswordForm extends StatefulWidget {
  const UpdatePasswordForm({super.key});

  @override
  State<UpdatePasswordForm> createState() {
    return _UpdatePasswordForm();
  }
}

class _UpdatePasswordForm extends State<UpdatePasswordForm> {
  TextEditingController oldPasswordController = TextEditingController();
  TextEditingController newPasswordController = TextEditingController();
  TextEditingController confirmPasswordController = TextEditingController();

  bool isLoginSuccessful = false;

  void updatePassword() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    try{
      const storage = FlutterSecureStorage();
      var token = await storage.read(key: 'access_token');
      Response response = await post(
          Uri.parse('$mainEndpoint/auth/update-password'),
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer $token',
          },
          body: {
            'oldPassword' : oldPasswordController.text.toString(),
            'newPassword' : newPasswordController.text.toString(),
            'confirmPassword': confirmPasswordController.text.toString()
          }
      );

      if(response.statusCode == 200){
        SharedPreferences prefs = await SharedPreferences.getInstance();
        prefs.setString('password', EncryptData.encryptAES(confirmPasswordController.text.toString()));
        var data = jsonDecode(response.body.toString());
        PopupMessage(data['message'], true);
        setState(() {
          oldPasswordController.text = "";
          newPasswordController.text = "";
          confirmPasswordController.text = "";
        });
        OverlayLoadingProgress.stop();
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
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: kPrimaryColor,
        foregroundColor: Colors.white,
        title: const Row(
          children: [
            Padding(padding:  EdgeInsets.all(defaultPadding),
                child: Text('Authentication', style: TextStyle(fontSize: 15, color: Colors.white))
            )
          ],
        ),
        centerTitle: true,
      ),
      body:  Padding(padding:  EdgeInsets.all(defaultPadding),
        child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Form(
                child: Column(
                  children: [
                    TextFormField(
                      controller: oldPasswordController,
                      textInputAction: TextInputAction.next,
                      obscureText: true,
                      cursorColor: kPrimaryLightColor,
                      style: const TextStyle(color: kTextColor),
                      decoration: const InputDecoration(
                        labelText: "Current Password",
                        prefixIcon: Padding(
                          padding:  EdgeInsets.all(defaultPadding),
                          child: Icon(Icons.lock),
                        ),
                      ),
                    ),

                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: defaultPadding),
                      child: TextFormField(
                        controller: newPasswordController,
                        textInputAction: TextInputAction.done,
                        obscureText: true,
                        cursorColor: kPrimaryLightColor,
                        style: const TextStyle(color: kTextColor),
                        decoration: const InputDecoration(
                          labelText: "New Password",
                          prefixIcon: Padding(
                            padding:  EdgeInsets.all(defaultPadding),
                            child: Icon(Icons.lock),
                          ),
                        ),
                      ),
                    ),
                    TextFormField(
                      controller: confirmPasswordController,
                      textInputAction: TextInputAction.done,
                      obscureText: true,
                      cursorColor: kPrimaryLightColor,
                      style: const TextStyle(color: kTextColor),
                      decoration: const InputDecoration(
                        labelText: "Confirm Password",
                        prefixIcon: Padding(
                          padding:  EdgeInsets.all(defaultPadding),
                          child: Icon(Icons.lock),
                        ),
                      ),
                    ),
                    const SizedBox(height: defaultPadding / 2),
                    ElevatedButton(
                      onPressed: () {
                        OverlayLoadingProgress.start(context, barrierDismissible: false);
                        updatePassword();
                      },
                      child: Text("Update Password".toUpperCase(), style: TextStyle(color: Colors.white)),
                    ),
                    const SizedBox(height: defaultPadding),
                    const SetBioAuth(),
                  ],
                ),
              )
            ],
          ),
      ),
    );
  }
}
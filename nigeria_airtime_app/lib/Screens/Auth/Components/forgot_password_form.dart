import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:overlay_loading_progress/overlay_loading_progress.dart';
import 'package:nigeria_airtime_app/Components/popup_message.dart';
import 'package:nigeria_airtime_app/constants/endpoints.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../Auth/Components/already_have_an_account_acheck.dart';
import '../../../constants/colors_consts.dart';
import 'package:nigeria_airtime_app/Screens/Dashboard/dashboard_screen.dart';
import '../../Auth/log_in.dart';

class ForgotPasswordForm extends StatefulWidget {
  const ForgotPasswordForm({super.key});

  @override
  State<ForgotPasswordForm> createState() {
    return _ForgotPasswordForm();
  }
}

class _ForgotPasswordForm extends State<ForgotPasswordForm> {
  TextEditingController codeController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController confirmPasswordController = TextEditingController();

  bool isLoginSuccessful = false;
  bool isPasswordResetSuccessful = false;

  Future<bool> resetPassword() async {
    bool result = false;
    try{
      SharedPreferences prefs = await SharedPreferences.getInstance();
      Response response = await post(
          Uri.parse('$mainEndpoint/auth/password/reset'),
          body: {
            'email' : emailController.text.toString(),
          }
      );
      if(response.statusCode == 200){
        var data = jsonDecode(response.body.toString());
        PopupMessage(data['message'], true);
        OverlayLoadingProgress.stop();
        setState(() {
          isPasswordResetSuccessful = true;
        });
        result = true;
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
    return result;
  }

  void setNewPassword() async {
    try{
      SharedPreferences prefs = await SharedPreferences.getInstance();
      Response response = await post(
          Uri.parse('$mainEndpoint/auth/password/reset/confirm'),
          body: {
            'password' : passwordController.text.toString(),
            'password2' : confirmPasswordController.text.toString(),
            'code' : codeController.text.toString(),
          }
      );
      if(response.statusCode == 200){

        var data = jsonDecode(response.body.toString());
        PopupMessage(data['message'], true);

            Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const LoginScreen())
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
  Widget build(BuildContext context) {
    return Form(
      child: isPasswordResetSuccessful?
      Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: defaultPadding),
            child: TextFormField(
              controller: codeController,
              keyboardType: TextInputType.text,
              textInputAction: TextInputAction.next,
              cursorColor: kPrimaryLightColor,
              style: const TextStyle(color: kTextColor),
              decoration: const InputDecoration(
                labelText: "Code",
                prefixIcon: Padding(
                  padding: EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.lock_clock_rounded),
                ),
              ),
            ),
          ),


          TextFormField(
            controller: passwordController,
            textInputAction: TextInputAction.next,
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

          Padding(
            padding: const EdgeInsets.symmetric(vertical: defaultPadding),
            child: TextFormField(
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
          ),
          const SizedBox(height: defaultPadding / 2),
          ElevatedButton(
            onPressed: () {
              OverlayLoadingProgress.start(context, barrierDismissible: false);
              setNewPassword();
            },
            child: Text("Create New Password".toUpperCase(), style: TextStyle(color: Colors.white)),
          ),
          const SizedBox(height: defaultPadding),
        ],
      )

      :

      Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: defaultPadding),
            child: TextFormField(
              controller: emailController,
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.next,
              cursorColor: kPrimaryLightColor,
              style: const TextStyle(color: kTextColor),
              onSaved: (email) {},
              decoration: const InputDecoration(
                labelText: "Email",
                prefixIcon: Padding(
                  padding: EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.email),
                ),
              ),
            ),
          ),
          const SizedBox(height: defaultPadding / 2),
          ElevatedButton(
            onPressed: () {
              OverlayLoadingProgress.start(context, barrierDismissible: false);
              resetPassword();
            },
            child: Text("Reset Password".toUpperCase(), style: TextStyle(color: Colors.white)),
          ),
          const SizedBox(height: defaultPadding),
        ],
      ),
    );
  }
}
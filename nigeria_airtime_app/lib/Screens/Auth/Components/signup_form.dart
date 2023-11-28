import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:nigeria_airtime_app/Screens/Auth/create_pin_screen.dart';
import 'package:overlay_loading_progress/overlay_loading_progress.dart';
import 'package:nigeria_airtime_app/Components/popup_message.dart';
import 'package:nigeria_airtime_app/constants/endpoints.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../utilities/encrypt_decrypt.dart';
import '../../../utilities/firebase_api.dart';
import '../../Auth/Components/already_have_an_account_acheck.dart';
import '../../../constants/colors_consts.dart';
import 'package:nigeria_airtime_app/Screens/Dashboard/dashboard_screen.dart';
import '../../Auth/log_in.dart';

class SignUpForm extends StatefulWidget {
  const SignUpForm({super.key});

  @override
  State<SignUpForm> createState() {
    return _SignUpForm();
  }
}

class _SignUpForm extends State<SignUpForm> {
  TextEditingController firstNameController = TextEditingController();
  TextEditingController lastNameController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController confirmPasswordController = TextEditingController();
  TextEditingController phoneController = TextEditingController();
  TextEditingController referralIdController = TextEditingController();

  bool isLoginSuccessful = false;

  void login(String email , password) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    final storage = const FlutterSecureStorage();
    try{
      Response response = await post(
          Uri.parse('$mainEndpoint/auth/login'),
          body: {
            'email' : email,
            'password' : password
          }
      );

      if(response.statusCode == 200){
        var data = jsonDecode(response.body.toString());
        //final data = jsonDecode(response.body);
        String access_token = data['message']['original']['access_token'];
        //print(data);
        await storage.write(key: 'access_token', value: access_token);
        prefs.setString('email', data['message']['original']['user']['email']);
        prefs.setString('password', EncryptData.encryptAES(passwordController.text));
        prefs.setString('firstName', data['message']['original']['user']['first_name']);
        prefs.setString('lastName', data['message']['original']['user']['last_name']);
        //PopupMessage('Log in successful', true);
        PopupMessage('Please wait...', true);
        print('Login successfully');

        //add device to firebase push notification
        //FirebaseApi().createPushNotificationAcct(emailController.text.toString());

        Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const CreatePinScreen()));

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

  void Signup() async {

    try{
      SharedPreferences prefs = await SharedPreferences.getInstance();
      Response response = await post(
          Uri.parse('$mainEndpoint/auth/register'),
          body: {
            'first_name' : firstNameController.text.toString(),
            'last_name' : lastNameController.text.toString(),
            'email' : emailController.text.toString(),
            'phone' : phoneController.text.toString(),
            'referral' : referralIdController.text.toString(),
            'password' : passwordController.text.toString(),
            'password2': confirmPasswordController.text.toString()
          }
      );
      if(response.statusCode == 200){
        prefs.setString('firstName', firstNameController.text.toString());
        prefs.setString('lastName', lastNameController.text.toString());
        login(emailController.text.toString(), passwordController.text.toString());
        var data = jsonDecode(response.body.toString());
        PopupMessage(data['message'], true);
        print('Signup successfully');
        setState(() {
          if(isLoginSuccessful){
            Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const DashboardScreen()));
          }
        });


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
      child: Column(
        children: [

          Padding(
            padding: const EdgeInsets.symmetric(vertical: defaultPadding),
            child: TextFormField(
              controller: firstNameController,
              keyboardType: TextInputType.name,
              textInputAction: TextInputAction.next,
              cursorColor: kPrimaryLightColor,
              style: const TextStyle(color: kTextColor),
              decoration: const InputDecoration(
                labelText: "First Name",
                prefixIcon: Padding(
                  padding:  EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.person),
                ),
              ),
            ),
          ),

          TextFormField(
            controller: lastNameController,
            keyboardType: TextInputType.name,
            textInputAction: TextInputAction.next,
            cursorColor: kPrimaryLightColor,
            style: const TextStyle(color: kTextColor),
            decoration: const InputDecoration(
              labelText: "Last Name",
              prefixIcon: Padding(
                padding:  EdgeInsets.all(defaultPadding),
                child: Icon(Icons.person),
              ),
            ),
          ),

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


TextFormField(
            controller: phoneController,
            textInputAction: TextInputAction.next,
            maxLength: 11,
            keyboardType: TextInputType.phone,
            cursorColor: kPrimaryLightColor,
            style: const TextStyle(color: kTextColor),
            decoration: const InputDecoration(
              labelText: "Phone",
              prefixIcon: Padding(
                padding:  EdgeInsets.all(defaultPadding),
                child: Icon(Icons.phone_android),
              ),
            ),
          ),

Padding(
            padding: const EdgeInsets.symmetric(vertical: defaultPadding),
            child: TextFormField(
              controller: referralIdController,
              textInputAction: TextInputAction.next,
              cursorColor: kPrimaryLightColor,
              style: const TextStyle(color: kTextColor),
              decoration: const InputDecoration(
                labelText: "Referral ID (Optional)",
                prefixIcon: Padding(
                  padding:  EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.person_4),
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
              labelText: "Password",
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
              Signup();
            },
            child: Text("Register".toUpperCase(), style: TextStyle(color: Colors.white)),
          ),
          const SizedBox(height: defaultPadding),
          AlreadyHaveAnAccountCheck(
            login: false,
            press: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) {
                    return LoginScreen();
                  },
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
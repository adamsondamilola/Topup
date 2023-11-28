import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart';
import 'package:local_auth/local_auth.dart';
import 'package:nigeria_airtime_app/Screens/Auth/create_pin_screen.dart';
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
bool isPinSet = false;
const storage = FlutterSecureStorage();


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

class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  State<LoginForm> createState() {
    return _LoginForm();
  }
}

class _LoginForm extends State<LoginForm> {
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController pinController = TextEditingController();
  bool isLoginSuccessful = false;

  //check if logged in
  void checkIfLoggedIn() async {
    OverlayLoadingProgress.start(context, barrierDismissible: false);
    try{
      var token = await storage.read(key: 'access_token');
      Response response = await get(
          Uri.parse('$mainEndpoint/auth/logged/user'),
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer $token',
          }
      );

        var data = jsonDecode(response.body.toString());

      if(response.statusCode == 200){
        OverlayLoadingProgress.stop();
        Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const DashboardScreen())
        );
      }
      else{
        /*setState(() {
          isPinSet = false;
        });*/
        PopupMessage(data['message'], false);
        OverlayLoadingProgress.stop();
      }
    }catch(e){
      print(e.toString());
      OverlayLoadingProgress.stop();
    }
  }

  //login with bio

  void IsBioSet() async{
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      isBioSet = prefs.getBool('bioAuth') ?? false;
    });
  }

  void IsPinSet() async{
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      String isPinSet_ = prefs.getString('pin') ?? "";
      if(isPinSet_ == "") {isPinSet = false;}
      else {isPinSet = true;}
    });
  }

  Future<void> loginWithBio() async {


       //login(email, password);
      try {
        final LocalAuthentication auth = LocalAuthentication();
        SharedPreferences prefs = await SharedPreferences.getInstance();

        String email = prefs.getString('email') ?? "";
        String password = prefs.getString('password') ?? "";
        password = EncryptData.decryptAES(password) ?? "";

        final bool isAuthenticated = await auth.authenticate(
            localizedReason: 'Log in using Biometrics',
            options: const AuthenticationOptions(useErrorDialogs: false, stickyAuth: true)
        );
        if(isAuthenticated){
         // OverlayLoadingProgress.start(context, barrierDismissible: false);
          login(email, password);
        }
      }on PlatformException catch (e) {
        if (e.code == auth_error.notAvailable) {
          PopupMessage('Biometrics not supported on device', false);
          OverlayLoadingProgress.stop();
        } else if (e.code == auth_error.notEnrolled) {
          PopupMessage('Device not yet enrolled for biometrics', false);
          OverlayLoadingProgress.stop();
        } else {
          PopupMessage('Biometrics log in attempt failed', false);
          OverlayLoadingProgress.stop();
        }
      }

  }

    void loginWithPin(String pin) async {

    try{
      var token = await storage.read(key: 'access_token');
      Response response = await post(
          Uri.parse('$mainEndpoint/auth/verify_pin'),
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer $token',
          },
          body: {
            'password' : pinController.text.toString(),
          }
      );

      if(response.statusCode == 200){
        var data = jsonDecode(response.body.toString());

        OverlayLoadingProgress.stop();

        //final data = jsonDecode(response.body);
        PopupMessage(data['message'], true);

//check is session is still active, else login
        checkIfLoggedIn();

      }else {
        var data = jsonDecode(response.body.toString());
        if(data['message'] != 'Unauthenticated.'){
          PopupMessage(data['message'], false);
        }
        else{
          setState(() {
            isPinSet = false;
          });
        }
        
        print('failed');
        OverlayLoadingProgress.stop();
      }
    }catch(e){
      print(e.toString());
      PopupMessage("Internal server error", false);
      OverlayLoadingProgress.stop();
    }
    
  }

  void login(String email , password) async {

    SharedPreferences prefs = await SharedPreferences.getInstance();
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
        final pin = data['message']['original']['user']['pin'];
        //print(data);
        await storage.write(key: 'access_token', value: access_token);
        prefs.setString('email', data['message']['original']['user']['email']);
         await storage.write(key: 'password', value: passwordController.text);
//        prefs.setString('password', EncryptData.encryptAES(passwordController.text));
        prefs.setString('firstName', data['message']['original']['user']['first_name']);
        prefs.setString('lastName', data['message']['original']['user']['last_name']);
        PopupMessage('Log in was successful', true);
        print('Login successfully');

        //await FirebaseApi().createPushNotificationAcct(email);
        if(pin == null){
          Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const CreatePinScreen())
          );
        }
        else{
         Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const DashboardScreen())
          );
        }
         

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

//class LoginForm extends StatefulWidget {
 /* const LoginForm({
    Key? key,
  }) : super(key: key); */

  @override
  void initState() {
    super.initState();
    IsBioSet();
    IsPinSet();
    //loginWithBio();

  }

  @override
  Widget build(BuildContext context) {

    return Form(
      child: isPinSet? 
      
      Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: defaultPadding),
            child: TextFormField(
              controller: pinController,
              textInputAction: TextInputAction.done,
              keyboardType: TextInputType.number,
              maxLength: 4, 
              obscureText: true,
              cursorColor: kPrimaryLightColor,
              style: const TextStyle(color: kTextColor),
              decoration: const InputDecoration(
                labelText: "Enter PIN",
                prefixIcon: Padding(
                  padding: EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.lock),
                ),
              ),
            ),
          ),
          Container(
            alignment: Alignment.topLeft,
            child:  GestureDetector(
              onTap: (){
               setState(() {
                 isPinSet = false;
               });
              },
                child: const Text(
              'Use email and password Instead?',
              textAlign: TextAlign.left,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(color: kPrimaryColor,
                //fontWeight: FontWeight.bold,
              ),
            )
            ),
          ),
           
          const SizedBox(height: defaultPadding),
          Hero(
            tag: "pin_btn",
            child: ElevatedButton(
              onPressed: () {
                OverlayLoadingProgress.start(context, barrierDismissible: false);
                loginWithPin(pinController.text.toString());
              },
              child: Text(
                "Log in".toUpperCase(),
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
         
        ],
      )

      :
      
       Column(
        children: [
          TextFormField(
            controller: emailController,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
            cursorColor: kPrimaryLightColor,
            style: const TextStyle(color: kTextBlackColor),
            onSaved: (email) {},
            decoration: const InputDecoration(
              labelText: "Enter Email",
              prefixIcon: Padding(
                padding:  EdgeInsets.all(defaultPadding),
                child: Icon(Icons.email),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: defaultPadding),
            child: TextFormField(
              controller: passwordController,
              textInputAction: TextInputAction.done,
              obscureText: true,
              cursorColor: kPrimaryLightColor,
              style: const TextStyle(color: kTextColor),
              decoration: const InputDecoration(
                labelText: "Enter Password",
                prefixIcon: Padding(
                  padding: EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.lock),
                ),
              ),
            ),
          ),
          Container(
            alignment: Alignment.topLeft,
            child:  GestureDetector(
              onTap: (){
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) {
                      return ForgotPasswordScreen();
                    },
                  ),
                );
              },
                child: const Text(
              'Forgot Password?',
              textAlign: TextAlign.left,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(color: kPrimaryColor,
                //fontWeight: FontWeight.bold,
              ),
            )
            ),
          ),
           
          const SizedBox(height: defaultPadding),
          Hero(
            tag: "login_btn",
            child: ElevatedButton(
              onPressed: () {
                OverlayLoadingProgress.start(context, barrierDismissible: false);
                login(emailController.text.toString(), passwordController.text.toString());
              },
              child: Text(
                "Log in".toUpperCase(),
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
         Container(height: 10,),
         Container(child: isBioSet? GestureDetector(onTap: (){loginWithBio();}, child: Icon(Icons.fingerprint, size: 50, color: kPrimaryColor,)) : Container()),
         const SizedBox(height: defaultPadding),
          AlreadyHaveAnAccountCheck(
            press: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) {
                    return SignUpScreen();
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

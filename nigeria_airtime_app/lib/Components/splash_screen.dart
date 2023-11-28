import 'dart:async';

import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/Screens/Auth/log_in.dart';
import 'package:nigeria_airtime_app/constants/colors_consts.dart';
import 'package:nigeria_airtime_app/constants/images.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../Screens/Welcome/intro_screen.dart';
import '../constants/app_info.dart';

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}
class _SplashScreenState extends State<SplashScreen> {


  bool show = true;
  void onboarding() async {
    WidgetsFlutterBinding.ensureInitialized();
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      show = prefs.getBool('ON_BOARDING') ?? true;
    });
  }

  @override
  void initState() {
    super.initState();
    onboarding();
    Timer ( Duration(seconds: 5),
      ()=>Navigator.pushReplacement(context,MaterialPageRoute(builder:(context) => show? IntroScreen() : const LoginScreen() ))
    );
  }
  @override
  Widget build(BuildContext context) {
    return Container(color:
      Colors.white,
    child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(logo, height: 100, width: 100),
            Container(height: 10,),
            Padding(padding: EdgeInsets.all(20),
            child: Text(appName, style: TextStyle(color: kPrimaryColor, fontSize: 15),)
            )

          ],
        )
    ));
  }
}
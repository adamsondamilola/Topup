import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/Screens/Auth/Components/already_have_an_account_acheck.dart';
import 'package:nigeria_airtime_app/Screens/Auth/log_in.dart';
import 'package:nigeria_airtime_app/Screens/Auth/sign_up.dart';

import '../../Components/admob_google_ads.dart';
import '../../constants/app_info.dart';
import '../../constants/colors_consts.dart';
import '../../constants/images.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: null,
      body:  Center(
        child: Padding(
          padding:  EdgeInsets.all(defaultPadding),
          child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(logo),
            Text(appName, style: TextStyle(fontSize: 25, color: kPrimaryColor),),
            Container(height: 20,),
            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [Icon(Icons.sports_basketball_outlined, size: 50, color: kTextColor),
                Icon(Icons.sports_football_outlined, size: 50, color: kTextColor),
                Icon(Icons.golf_course_outlined, size: 50, color: kTextColor),
                Icon(Icons.sports_soccer_outlined, size: 50, color: kTextColor),
                Icon(Icons.sports_tennis_outlined, size: 50, color: kTextColor),
              ],
            ),
            Container(
              height: 10,
            ),
            Hero(
              tag: "login_btn",
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (context) => const LoginScreen())
                  );
                },
                child: Text(
                  "Log in".toUpperCase(),
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
            Container(
              height: 10,
            ),
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
            )
          ],
        ),
      ),
      ),
       // bottomNavigationBar: const GoogleAdmobBanner()
    );
  }
}
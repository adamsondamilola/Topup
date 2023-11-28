import 'package:firebase_core/firebase_core.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/Components/splash_screen.dart';
import 'package:nigeria_airtime_app/Screens/Auth/log_in.dart';
import 'package:nigeria_airtime_app/Screens/Dashboard/dashboard_screen.dart';
import 'package:nigeria_airtime_app/Screens/Welcome/intro_screen.dart';
import 'package:nigeria_airtime_app/constants/app_info.dart';
import 'package:nigeria_airtime_app/constants/colors_consts.dart';
import 'package:nigeria_airtime_app/utilities/firebase_api.dart';
import 'package:shared_preferences/shared_preferences.dart';

//void main() => runApp(const MyApp());
bool show = true;
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  //firebase notification
  //await Firebase.initializeApp();
  //await FirebaseApi().iniNotifications();

 //google admob
  //MobileAds.instance.initialize(); 

  final prefs = await SharedPreferences.getInstance();
  show = prefs.getBool('ON_BOARDING') ?? true;
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);
  @override
  State<MyApp> createState() {
    return _MyApp();
  }
}

//class _MyApp extends StatelessWidget
class _MyApp extends State<MyApp> {

  @override
  void initState() {
    super.initState();
    // Load ads.
  }

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: appName,
      theme: ThemeData(
          primarySwatch: kPrimaryColor,
          primaryColor: kTextColor,
          scaffoldBackgroundColor: Colors.white,
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              elevation: 0,
              backgroundColor: kPrimaryColor,
              shape: const StadiumBorder(),
              maximumSize: const Size(double.infinity, 56),
              minimumSize: const Size(double.infinity, 56),
            ),
          ),
          inputDecorationTheme: const InputDecorationTheme(
            filled: true,
            fillColor: Colors.white,
            iconColor: kTextColor,
            prefixIconColor: kTextColor,
            focusColor: kSecondaryColor,
            labelStyle: TextStyle(color: kTextColor),
            contentPadding: EdgeInsets.symmetric(
                horizontal: defaultPadding, vertical: defaultPadding),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.all(Radius.circular(20)),
              borderSide: BorderSide(color: kTextColor),
          
              //borderSide: BorderSide.none,
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.all(Radius.circular(20)),
              borderSide: BorderSide(color: kTextColor),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.all(Radius.circular(20)),
              borderSide: BorderSide(color: kTextColor))
          )),
      //home: show? IntroScreen() : const LoginScreen(),
      home: SplashScreen(),
      //home: const DashboardScreen(),
    );
  }
}

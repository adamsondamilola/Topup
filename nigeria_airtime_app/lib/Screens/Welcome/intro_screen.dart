import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/Screens/Auth/log_in.dart';
import 'package:nigeria_airtime_app/Screens/Auth/sign_up.dart';
import 'package:nigeria_airtime_app/Screens/Welcome/welcome_screen.dart';
import 'package:introduction_screen/introduction_screen.dart';
import 'package:nigeria_airtime_app/constants/app_info.dart';
import 'package:nigeria_airtime_app/constants/colors_consts.dart';
import 'package:nigeria_airtime_app/constants/images.dart';
import 'package:shared_preferences/shared_preferences.dart';

class IntroScreen extends StatelessWidget {
  IntroScreen({Key? key}) : super(key: key);

  ///Changed a little bit of buttons styling and text for the thumbnail lol
  ///Thanks for coming here :-)
  final List<PageViewModel> pages = [
    PageViewModel(
      title: 'Nigeria Artime',
      body: 'Our platforms supports 9mobile, Airtel, Glo, and MTN, which are the 4 Nigeria most popular networks',
      footer: const SizedBox(
        height: 45,
        width: 300,
        child: Text(
          ' ',
        ),
      ),
      image: Center(
        child: Image.asset(logo, width: 150, height: 150,),
      ),
      decoration: const PageDecoration(
        titleTextStyle: TextStyle(
          fontSize: 25.0,
          fontWeight: FontWeight.bold,
        )
      )
    ),
    PageViewModel(
        title: 'Easy Top Up & Print',
        body: 'You can either top up phone number directly or generate airtime PIN instead. Its absolutely easy to use',
        footer: const SizedBox(
          height: 45,
          width: 300,
          child: Text(
            '',
          ),
        ),
        image: Center(
          child: Image.asset(logo, width: 150, height: 150,),
        ),
        decoration: const PageDecoration(
            titleTextStyle: TextStyle(
              fontSize: 25.0,
              fontWeight: FontWeight.bold,
            )
        )
    ),
    PageViewModel(
        title: 'Create Account',
        body: 'To keep track of your transactions, its important you register an account and its seamless',
        footer: const SizedBox(
          height: 45,
          width: 300,
          child: Text(
            '',
          ),
        ),
        image: Center(
          child: Image.asset(logo, width: 150, height: 150,),
        ),
        decoration: const PageDecoration(
            titleTextStyle: TextStyle(
              fontSize: 25.0,
              fontWeight: FontWeight.bold,
            )
        )
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: null,
      body: Padding(
        padding: const EdgeInsets.fromLTRB(12, 80, 12, 12),
        child: IntroductionScreen(
          pages: pages,
          dotsDecorator: const DotsDecorator(
            size: Size(10,10),
            color: Colors.black38,
            activeSize: Size.square(15),
            activeColor: kPrimaryColor,
          ),
          showDoneButton: true,
          done: const Text('Done', style: TextStyle(fontSize: 20),),
          showSkipButton: true,
          skip: const Text('Skip', style: TextStyle(fontSize: 20, color: kPrimaryColor),),
          showNextButton: true,
          next: const Icon(Icons.arrow_forward, size: 25, color: kPrimaryColor,),
          onDone: () => onDone(context),
          curve: Curves.bounceOut,
        ),
      ),
    );
  }

  void onDone(context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('ON_BOARDING', false);
    Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const SignUpScreen()));
  }
}

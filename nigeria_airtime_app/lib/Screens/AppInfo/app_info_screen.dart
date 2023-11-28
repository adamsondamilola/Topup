import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/Screens/Dashboard/dashboard_screen.dart';
import 'package:nigeria_airtime_app/constants/app_info.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../constants/colors_consts.dart';

final Uri _url = Uri.parse('https://www.begambleaware.org/');
void _launchUrl() async {
  if (!await launchUrl(_url)) {
    throw Exception('Could not launch $_url');
  }
}

class AppInfoScreen extends StatelessWidget {
  const AppInfoScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: kPrimaryColor,
        foregroundColor: Colors.white,
        title: const Row(
          children: [
            Padding(padding:  EdgeInsets.all(defaultPadding),
              child: Text('Information', style: TextStyle(fontSize: 15, color: Colors.white))
            )
          ],
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
          padding:  EdgeInsets.fromLTRB(0, 0, 0, 50),
        child:  Column(
            children: [
             const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.all(defaultPadding),
                      child: Text(
                        "$appName is a prediction platform for football, basketball, hockey, boxing, and lots more.",
                        style: TextStyle(fontSize: 20),
                      ),
                    ),
                  ),
                ],
              ),
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.all(defaultPadding),
                      child: Text(
                        "Time Zone: +1 GMT",
                        style: TextStyle(fontSize: 20),
                      ),
                    ),
                  ),
                ],
              ),
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.all(defaultPadding),
                      child: Text(
                        "Some Tips Meaning",
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.fromLTRB(16,3,0,0),
                      child: Text(
                        "1 = Home team wins",
                        style: TextStyle(fontSize: 15),
                      ),
                    ),
                  ),
                ],
              ),
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.fromLTRB(16,3,0,0),
                      child: Text(
                        "2 = Away team wins or draw",
                        style: TextStyle(fontSize: 15),
                      ),
                    ),
                  ),
                ],
              ),
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.fromLTRB(16,3,0,0),
                      child: Text(
                        "1X = Home team wins or draw",
                        style: TextStyle(fontSize: 15),
                      ),
                    ),
                  ),
                ],
              ),
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.fromLTRB(16,3,0,0),
                      child: Text(
                        "X2 = Away team wins or draw",
                        style: TextStyle(fontSize: 15),
                      ),
                    ),
                  ),
                ],
              ),
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.fromLTRB(16,3,0,0),
                      child: Text(
                        "12 = Either team wins",
                        style: TextStyle(fontSize: 15),
                      ),
                    ),
                  ),
                ],
              ),
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.fromLTRB(16,3,0,0),
                      child: Text(
                        "BTTS = Both teams to score",
                        style: TextStyle(fontSize: 15),
                      ),
                    ),
                  ),
                ],
              ),
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.fromLTRB(16,3,0,0),
                      child: Text(
                        "O1.5 = Over 1.5 goals. Goals will be 2 or more",
                        style: TextStyle(fontSize: 15),
                      ),
                    ),
                  ),
                ],
              ),
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.fromLTRB(16,3,0,0),
                      child: Text(
                        "O2.5 = Over 2.5 goals. Goals will be 3 or more",
                        style: TextStyle(fontSize: 15),
                      ),
                    ),
                  ),
                ],
              ),
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.fromLTRB(16,3,0,0),
                      child: Text(
                        "O3.5 = Over 3.5 goals. Goals will be 4 or more",
                        style: TextStyle(fontSize: 15),
                      ),
                    ),
                  ),
                ],
              ),
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.all(defaultPadding),
                      child: Text(
                        "Kindly disregard anyone asking you for money claiming to be from us. We do not sell games and this App is absolutely free. We will communicate whenever we start offering premium games",
                        style: TextStyle(fontSize: 20),
                      ),
                    ),
                  )
                ],
              )
              ,
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.all(defaultPadding),
                      child: Text(
                        "It is important to note that no game predicting website or forecaster can be 100% accurate. If you must play bet, play responsibly.",
                        style: TextStyle(fontSize: 20),
                      ),
                    ),
                  )
                ],
              ),
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.all(defaultPadding),
                      child: Text(
                        "Betting is fun, so we encourage people to only stake money they can do without. Do not borrow money or look for money at all cost to play games posted on this platform.",
                        style: TextStyle(fontSize: 20),
                      ),
                    ),
                  )
                ],
              ),
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.all(defaultPadding),
                      child: Text(
                        "If you found out that you have been addicted to betting and you want help, please visit begambleaware.org for counseling.",
                        style: TextStyle(fontSize: 20),
                      ),
                    ),
                  ),
                ],
              ),
               Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Padding(padding:  EdgeInsets.all(defaultPadding),
                    child: GestureDetector(
                      onTap: () {
                        _launchUrl();
                      },
                      child: const Text('Be Gamble Aware', style: TextStyle(fontSize: 15, color: kPrimaryColor))
                  ),
                    )
                ],
              ),
              const Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.all(defaultPadding),
                      child: Text(
                        "Thanks for using $appName!",
                        style: TextStyle(fontSize: 20),
                      ),
                    ),
                  )
                ],
              )
            ],
          ),
      )
    );
  }
}
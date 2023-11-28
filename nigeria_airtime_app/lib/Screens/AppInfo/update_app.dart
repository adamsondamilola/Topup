import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/Screens/Dashboard/dashboard_screen.dart';
import 'package:nigeria_airtime_app/constants/app_info.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../constants/colors_consts.dart';

 void _launchUrl(String _url) async {
  final Uri _uri = Uri.parse(_url);
  if (!await launchUrl(_uri)) {
    throw Exception('Could not launch $_url');
  }
}

bool newVersionAvailable = false;

class AppUpdateScreen extends StatelessWidget {
  //const AppUpdateScreen({Key? key}) : super(key: key);

  final String buttonText;
  final String title;
  final String info;
  final String linkRe;
  final void Function()? onTap;

  const AppUpdateScreen({
    super.key,
    required this.buttonText,
    required this.title,
    required this.info,
    required this.linkRe,
    this.onTap
  });


  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: kPrimaryColor,
          foregroundColor: Colors.white,
          title: const Row(
            children: [
              Padding(padding:  EdgeInsets.all(defaultPadding),
                  child: Text('App Update', style: TextStyle(fontSize: 15, color: Colors.white))
              )
            ],
          ),
          centerTitle: true,
        ),
        body: SingleChildScrollView(
          padding:  EdgeInsets.fromLTRB(0, 50, 0, 50),
          child:  Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
               Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.all(defaultPadding),
                      child: Text(
                        title,
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
               Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.all(defaultPadding),
                      child: Text(
                        info,
                        style: TextStyle(fontSize: 20),
                      ),
                    ),
                  ),
                ],
              ),
               Row(
                children: [
                  Flexible(
                    child: Padding(padding:  EdgeInsets.all(defaultPadding),
                      child: Hero(
                        tag: "login_btn",
                        child: ElevatedButton(
                          onPressed: () {
                            _launchUrl(linkRe);
                          },
                          child: Text(
                            buttonText.toUpperCase(),
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        )
    );
  }
}
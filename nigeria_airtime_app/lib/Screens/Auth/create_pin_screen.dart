import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/Screens/Auth/Components/pin_form.dart';
import 'package:nigeria_airtime_app/Screens/Dashboard/dashboard_screen.dart';
import 'package:nigeria_airtime_app/constants/app_info.dart';
import 'package:overlay_loading_progress/overlay_loading_progress.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../constants/colors_consts.dart';

 void _launchUrl(String _url) async {
  final Uri _uri = Uri.parse(_url);
  if (!await launchUrl(_uri)) {
    throw Exception('Could not launch $_url');
  }
}

bool newVersionAvailable = false;

class CreatePinScreen extends StatelessWidget {
  const CreatePinScreen({Key? key}) : super(key: key);
  
  
  @override
  Widget build(BuildContext context) {
    OverlayLoadingProgress.stop();

    return Scaffold(
        appBar: AppBar(
          backgroundColor: kPrimaryColor,
          foregroundColor: Colors.white,
          title: const Row(
            children: [
              Padding(padding:  EdgeInsets.all(defaultPadding),
                  child: Text('Create New PIN', style: TextStyle(fontSize: 15, color: Colors.white))
              )
            ],
          ),
          centerTitle: true,
        ),
        body: const Padding(
          padding: EdgeInsets.all(defaultPadding),
            child:  Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
               Center(
                child: CreatePinForm()
               )
            ],
          ),
        )
    );
  }
}
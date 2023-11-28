import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:overlay_loading_progress/overlay_loading_progress.dart';
import 'package:nigeria_airtime_app/Components/popup_message.dart';
import 'package:nigeria_airtime_app/constants/colors_consts.dart';
import 'package:nigeria_airtime_app/constants/endpoints.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:slider_button/slider_button.dart';
import 'package:local_auth/local_auth.dart';

class SetBioAuth extends StatefulWidget {
  const SetBioAuth({super.key});

  @override
  State<SetBioAuth> createState() {
    return _SetBioAuth();
  }
}

class _SetBioAuth extends State<SetBioAuth> {
  final LocalAuthentication auth = LocalAuthentication();

  TextEditingController oldPasswordController = TextEditingController();
  TextEditingController newPasswordController = TextEditingController();
  TextEditingController confirmPasswordController = TextEditingController();

  bool isBioSet = false;

  void enableBioAuth() async {
    try{
      SharedPreferences prefs = await SharedPreferences.getInstance();
      //check bio auth is available on device
      final bool canAuthenticateWithBiometrics = await auth.canCheckBiometrics;
      final bool canAuthenticate =
          canAuthenticateWithBiometrics || await auth.isDeviceSupported();
      if(!canAuthenticate){
        PopupMessage("Biometrics not found", false);
      }
      else {
        prefs.setBool('bioAuth', true);
        PopupMessage("Biometrics successfully enrolled", true);
        /*
        final List<BiometricType> availableBiometrics =
        await auth.getAvailableBiometrics();

        if (availableBiometrics.isNotEmpty) {
          // Some biometrics are enrolled.
          prefs.setBool('bioAuth', true);
          PopupMessage("Biometrics successfully enrolled", true);
        } */
      }
    }catch(e){
      print(e.toString());
      PopupMessage("An error occurred", false);
      OverlayLoadingProgress.stop();
    }
  }

  void disableBioAuth() async {
    try{
      SharedPreferences prefs = await SharedPreferences.getInstance();
      prefs.setBool('bioAuth', false);
      PopupMessage("Biometrics successfully disabled", true);

    }catch(e){
      print(e.toString());
      PopupMessage("An error occurred", false);
      OverlayLoadingProgress.stop();
    }
  }

 void IsBioSet() async{
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      isBioSet = prefs.getBool('bioAuth') ?? false;
    });
  }

  @override
  void initState() {
    super.initState();
    IsBioSet();
  }
  /*
  Widget build(BuildContext context) {
    return const Center();
  }*/

  Widget build(BuildContext context) {
    return Center(child: SliderButton(
      backgroundColor: kPrimaryColor,
      baseColor: Colors.white,
      highlightedColor: kPrimaryColor,
      action: () {
        isBioSet? disableBioAuth() : enableBioAuth();
      },
      label: Text(
        isBioSet? "Cancel Bio Log In" : "Enable Bio Log In",
        style: TextStyle(
            color: Colors.white, fontWeight: FontWeight.w500, fontSize: 17),
      ),
      icon: isBioSet? Icon(Icons.fingerprint, size: 50, color: Colors.red,) : Icon(Icons.fingerprint, size: 50, color: kPrimaryColor,),

    ));
  }
}
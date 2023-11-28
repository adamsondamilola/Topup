import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:overlay_loading_progress/overlay_loading_progress.dart';
import 'package:nigeria_airtime_app/Screens/Dashboard/Components/games_card.dart';
import 'package:nigeria_airtime_app/Components/popup_message.dart';
import 'package:nigeria_airtime_app/Screens/Settings/Components/set_bio.dart';
import 'package:nigeria_airtime_app/constants/endpoints.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../Components/admob_google_ads.dart';
import '../../constants/colors_consts.dart';
import '../Settings/update_password_screen.dart';
import 'Components/profile_cards.dart';


class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});
  @override
  State<ProfileScreen> createState() => _ProfileScreen();
}

class _ProfileScreen extends State<ProfileScreen> {
   String firstName = "";
   String lastName = "";
   String email = "";
   String coins = "0";
  List<dynamic> games = [];

  @override
  void initState() {
    fetchProfileInfo();
    super.initState();
  }


  void fetchProfileInfo() async {
    try{
      SharedPreferences prefs = await SharedPreferences.getInstance();
      setState(() {
        firstName = prefs.getString("firstName") ?? "";
        lastName = prefs.getString("lastName") ?? "";
        email = prefs.getString("email") ?? "";
        coins = prefs.getDouble("coins").toString();
        if(coins == "null") coins = "0";
      });
    }catch(e){
      print(e.toString());
      PopupMessage("Internal server error", false);
      OverlayLoadingProgress.stop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: kPrimaryColor,
        foregroundColor: Colors.white,
        title: const Row(
          children: [
            Padding(padding:  EdgeInsets.all(defaultPadding),
                child: Text('Profile', style: TextStyle(fontSize: 15, color: Colors.white))
            )
          ],
        ),
        centerTitle: true,
      ),
      body: Padding(padding:  EdgeInsets.all(defaultPadding),
        child:  Column(
      children: [

        ProfileCard(icon: Icons.person, title: "First Name", info: firstName),
            ProfileCard(icon: Icons.person, title: "Last Name", info: lastName),
            ProfileCard(icon: Icons.email, title: "Email", info: email),
        ProfileCard(icon: Icons.circle, title: "Coins", info: coins),

        const SizedBox(height: defaultPadding),
        ElevatedButton(
          onPressed: () {
            Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const UpdatePasswordScreen())
            );
          },
          child: Text("Update Password".toUpperCase(), style: TextStyle(color: Colors.white),),
        ),
        const SizedBox(height: defaultPadding),
        const SetBioAuth(),
      ],
    ),
    ),
      //bottomNavigationBar: const GoogleAdmobBanner(),
    );
  }

}
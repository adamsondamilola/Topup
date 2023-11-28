import 'dart:convert';
import 'dart:ffi';
import 'dart:io';
import 'package:nigeria_airtime_app/Screens/Airtimes/airtimes_screen.dart';
import 'package:nigeria_airtime_app/Screens/Networks/Components/airtime_card_summary.dart';
import 'package:nigeria_airtime_app/Screens/Transactions/Components/airtime_card_transaction.dart';
import 'package:nigeria_airtime_app/Screens/Networks/Components/purchase_airtime_tabs.dart';
import 'package:nigeria_airtime_app/Screens/Transactions/transactions_screen.dart';
import 'package:share_plus/share_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:http/http.dart';
import 'package:overlay_loading_progress/overlay_loading_progress.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:nigeria_airtime_app/Components/bottom_modal.dart';
import 'package:nigeria_airtime_app/Screens/AppInfo/app_info_screen.dart';
import 'package:nigeria_airtime_app/Screens/AppInfo/update_app.dart';
import 'package:nigeria_airtime_app/Screens/Auth/log_in.dart';
import 'package:nigeria_airtime_app/Screens/Dashboard/Components/games_by_date.dart';
import 'package:nigeria_airtime_app/Screens/Profile/profile_screen.dart';
import 'package:nigeria_airtime_app/Screens/Settings/update_password_screen.dart';
import 'package:nigeria_airtime_app/Screens/Welcome/welcome_screen.dart';
import 'package:nigeria_airtime_app/constants/app_info.dart';
import 'package:nigeria_airtime_app/constants/colors_consts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../Components/admob_google_ads.dart';
import '../../Components/popup_message.dart';
import '../../constants/endpoints.dart';
import '../../constants/images.dart';
import '../../utilities/ad_helper.dart';

Future<void> _launchUrl(String _url) async {
  final Uri _uri = Uri.parse(_url);
  if (!await launchUrl(_uri)) {
    throw Exception('Could not launch $_url');
  }
}

Future<void> _Share(String message, subject) async {
 await Share.share(message, subject: subject);
}

bool newVersionAvailable = false;
int loadVersionController = 0;
String appStoreUrl = "";
double coins = 0.0;
bool isLoggedOut = false;


class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() {
    return _DashboardScreen();
  }
}

class _DashboardScreen extends State<DashboardScreen> {

  void getCoins() async {
    try{
      SharedPreferences prefs = await SharedPreferences.getInstance();
      //setState(() {
        coins = prefs.getDouble('coins') ?? 0;
      //});
    }catch(e){
      print(e.toString());
    }
  }

  void addCoins(double coin) async {
    try{
      SharedPreferences prefs = await SharedPreferences.getInstance();
      double userCoin = prefs.getDouble('coins') ?? 0;
      userCoin += coin;
      prefs.setDouble('coins', userCoin);
      setState(() {
        coins = prefs.getDouble('coins') ?? 0;
      });
      PopupMessage("You earned 2 coins", true);

    }catch(e){
      print(e.toString());
      PopupMessage("Reward failed, please try again", false);
    }
  }

  List<dynamic> todayGames = [];
  List<dynamic> tomorrowGames = [];
  List<dynamic> yesterdayGames = [];

  //check if new version is available
  void checkAppVersion() async {
    try{
      PackageInfo packageInfo = await PackageInfo.fromPlatform();
      String version = packageInfo.version;
      String code = packageInfo.buildNumber;
    print("Version: $version");
      Response response = await get(
          Uri.parse('$mainEndpoint/settings/app/version-control')
      );
      if(response.statusCode == 200){

        var data = jsonDecode(response.body.toString());
        if(Platform.isIOS){
          setState(() {
            appStoreUrl = data["ios_link"];
          });
          if(data["iosVersion"] != version){
            PopupMessage('New version is available', true);
            setState(() {
              newVersionAvailable = true;
            });
            String urlIos = appStoreUrl;
            Navigator.push(
                context,
                MaterialPageRoute(builder: (context) =>  AppUpdateScreen(buttonText: "Update App", title: "New Version Available", info: "A new version of $appName is now available. Kindly click the button below to update app or visit your app store.", linkRe: "$urlIos"))
            );
          }
        }

        if(Platform.isAndroid){
          setState(() {
            appStoreUrl = data["android_link"];
          });
          if(data["androidVersion"] != version){
            PopupMessage('New version is available', true);
            setState(() {
              newVersionAvailable = true;
            });
            final String url = data["android_link"];
            Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => AppUpdateScreen(buttonText: "Update App", title: "New Version Available", info: "A new version of $appName is now available. Kindly click the button below or visit your app store to update.", linkRe: "$url"))
            );
          }
        }


      }
    }catch(e){
      print(e.toString());
    }
    setState(() {
      loadVersionController +=1;
    });
  }

  void logOut() async {
    const storage = FlutterSecureStorage();
    try{
      var token = await storage.read(key: 'access_token');
      Response response = await post(
          Uri.parse("$mainEndpoint/auth/logout"),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer $token',
          }
      );
      if(response.statusCode == 200){
        var data = jsonDecode(response.body.toString());
        OverlayLoadingProgress.stop();
        //isLoggedOut = true;
        PopupMessage(data['message'], true);
        Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const WelcomeScreen())
        );
      }else {
        var data = jsonDecode(response.body.toString());
        print('failed');
        OverlayLoadingProgress.stop();
        PopupMessage(data['message'], false);
      }
    }catch(e){
      print(e.toString());
      //PopupMessage("Internal server error", false);
      OverlayLoadingProgress.stop();
    }
    await storage.write(key: 'access_token', value: "");
  }

  //check if logged in
  void checkIfLoggedIn() async {
    try{
      const storage = FlutterSecureStorage();
      var token = await storage.read(key: 'access_token');
      Response response = await get(
          Uri.parse('$mainEndpoint/auth/logged/user'),
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer $token',
          }
      );
      if(response.statusCode != 200){
        Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const LoginScreen())
        );
        OverlayLoadingProgress.stop();
      }
    }catch(e){
      print(e.toString());
      OverlayLoadingProgress.stop();
    }
  }

  int selectedTabIndex = 0;
  Color selectedTabColor = kPrimaryColor;

  @override
  void initState() {
    super.initState();
    checkAppVersion();
    getCoins();
    OverlayLoadingProgress.stop();
//
    //_loadRewardedAd();
  }



  void refreshGames() async {
    PopupMessage('Refreshing...', true);
    getCoins();
    setState(() {

    });
  }

  @override
  Widget build(BuildContext context) {

    if(loadVersionController < 1){
      //checkIfLoggedIn();

    }
    //OverlayLoadingProgress.start(context, barrierDismissible: false);
    String _selectedValue = '1';
    return DefaultTabController(length: 5, initialIndex: 0,
        child: Scaffold(
          appBar: AppBar(
            automaticallyImplyLeading: false,
            backgroundColor: selectedTabColor,
            foregroundColor: Colors.white,
            title: Row(
              children: [
                GestureDetector(
                onTap: () {
                  _Share('check out this great sports forecasting app. Its absolutely free $appStoreUrl', 'Chick This App Out!');
                 // _launchUrl(appStoreUrl);
                },
                  child: Icon(Icons.share_outlined)
                ),


                Padding(padding: const EdgeInsets.all(defaultPadding),
                  child: GestureDetector(
                      onTap: () {
                        refreshGames();
                      },
                      child: Icon(Icons.refresh)
                  ),
                ),
                GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) {
                              return AppInfoScreen();
                            },
                          ),
                        );
                      },
                      child: Icon(Icons.info_outline_rounded)
                  ),
                /*Padding(padding: const EdgeInsets.all(defaultPadding),
                  child: GestureDetector(
                      onTap: () {

                      },
                      child: Text('REMOVE ADS', style: TextStyle(fontSize: 15, color: Colors.white))
                  ),
                )*/
                Padding(padding: const EdgeInsets.all(defaultPadding),
                  child: GestureDetector(
                      onTap: () {

                      },
                      child: Text('₦$coins', style: TextStyle(fontSize: 18, color: Colors.white))
                  ),
                )
              ],
            ),
            actions: [
              PopupMenuButton<String>(
                color: Colors.white,
                  onSelected: (String value) {
                    setState(() {
                      _selectedValue = value;
                    });
                  },
                  itemBuilder: (BuildContext context) => [
                    PopupMenuItem(
                      value: '1',
                      child: Row(children: [Icon(Icons.person, color: selectedTabColor,), Text(' Profile', style: TextStyle(color: selectedTabColor),)]),
                      onTap: () async {
                       await Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const ProfileScreen())
                        );
                      },
                    ),
                    PopupMenuItem(
                      value: '2',
                      child: Row(children: [Icon(Icons.settings, color: selectedTabColor,), Text(' Settings', style: TextStyle(color: selectedTabColor),)]),
                      onTap: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => const UpdatePasswordScreen())
                          );
                      },
                    ),
                    PopupMenuItem(
                      value: '3',
                      child: Row(children: [Icon(Icons.phone_android, color: selectedTabColor,), Text(' Airtimes', style: TextStyle(color: selectedTabColor),)]),
                      onTap: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const AirtimeScreen())
                        );
                      },
                    ),
                    PopupMenuItem(
                      value: '4',
                      child: Row(children: [Icon(Icons.list, color: selectedTabColor,), Text(' Transactions', style: TextStyle(color: selectedTabColor),)]),
                      onTap: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const TransactionsScreen())
                        );
                      },
                    ),
                    PopupMenuItem(
                      value: '5',
                      child: Row(children: [Icon(Icons.logout, color: selectedTabColor,), Text(' Log Out', style: TextStyle(color: selectedTabColor),)]),
                      onTap: () {
                       // logOut();
                        Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(builder: (context) => const LoginScreen())
                        );
                      },
                    ),
                  ],
              )
            ],
            bottom:  TabBar(
              unselectedLabelColor: Colors.white60,
              dividerColor: Colors.white,
              indicatorColor: Colors.white,
              labelColor: Colors.white,
              onTap: (index) { setState(() {
      selectedTabIndex = index;
      selectedTabIndex == 1? selectedTabColor = const Color.fromARGB(255, 249, 19, 3) 
      : selectedTabIndex == 3? selectedTabColor = Color.fromARGB(255, 206, 165, 2) 
      : selectedTabIndex == 2? selectedTabColor = Colors.green 
      : selectedTabIndex == 0? selectedTabColor = Color.fromARGB(255, 28, 121, 3) 
      : selectedTabColor = kPrimaryColor;
    });},
              tabs:  [
                Tab(text: "9MOBILE"),
                Tab(text: "AIRTEL"),
                Tab(text: "GLO"),
                Tab(text: "MTN"),
              ],
            ),
            //title: Text('Tabs Demo'),
          ),
          body:    SafeArea(child: Stack(
            children: [
              TabBarView(
                children: [
                 PurchaseAirtimeTabBar(selectedTabColor_: selectedTabColor, selectedNetwork: '9MOBILE', selectedLogo: nmobileLogo, ),
                  PurchaseAirtimeTabBar(selectedTabColor_: selectedTabColor, selectedNetwork: 'AIRTEL', selectedLogo: airtelLogo),
            PurchaseAirtimeTabBar(selectedTabColor_: selectedTabColor, selectedNetwork: 'GLO', selectedLogo: gloLogo),
             PurchaseAirtimeTabBar(selectedTabColor_: selectedTabColor, selectedNetwork: 'MTN', selectedLogo: mtnLogo),
                ],
              ),
            ],
          )),

         // bottomNavigationBar: const GoogleAdmobBanner(),
        )
    );
  }
}
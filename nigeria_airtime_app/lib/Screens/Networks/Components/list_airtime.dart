import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:nigeria_airtime_app/Screens/Networks/Components/airtime_card_summary.dart';
import 'package:overlay_loading_progress/overlay_loading_progress.dart';
import 'package:nigeria_airtime_app/Screens/Dashboard/Components/games_card.dart';
import 'package:nigeria_airtime_app/Components/popup_message.dart';
import 'package:nigeria_airtime_app/constants/colors_consts.dart';
import 'package:nigeria_airtime_app/constants/endpoints.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> addCoins(double coin) async {
  try{
    SharedPreferences prefs = await SharedPreferences.getInstance();
    double userCoin = prefs.getDouble('coins') ?? 0;
    userCoin += coin;
    prefs.setDouble('coins', userCoin);
    PopupMessage("You earned $userCoin coins", true);

  }catch(e){
    print(e.toString());
    PopupMessage("Reward failed, please try again", false);
  }
}

class ListAirtimeWidget extends StatefulWidget {
  const ListAirtimeWidget({super.key});

  @override
  State<ListAirtimeWidget> createState() => _ListAirtimeWidget();

}

class _ListAirtimeWidget extends State<ListAirtimeWidget> {
  List<dynamic> games = [];
  @override
  void initState() {
    super.initState();
    fetchAirtime("today");
  }

  void fetchAirtime(String gameDay) async {
    OverlayLoadingProgress.start(context, barrierDismissible: false);
    try{
      Response response = await get(
          Uri.parse("$mainEndpoint/game/$gameDay/get_games")
      );
      if(response.statusCode == 200){
        var data = jsonDecode(response.body.toString());
        print("done");
        setState(() {
          games = data['message'];
          OverlayLoadingProgress.stop();
        });

      }else {
        var data = jsonDecode(response.body.toString());
        print('failed');
        OverlayLoadingProgress.stop();
        PopupMessage(data['message'], false);
      }
    }catch(e){
      print(e.toString());
      PopupMessage("Internal server error", false);
      OverlayLoadingProgress.stop();
    }
  }

  void voteGames(String Id, voteType) async {
//    addCoins(2);
    try{
      //OverlayLoadingProgress.start(context, barrierDismissible: false);
      PopupMessage('Thanks for voting. You will get feedback soon', true);
      const storage = FlutterSecureStorage();
      var token = await storage.read(key: 'access_token');
      Response response = await get(
          Uri.parse("$mainEndpoint/game/$Id/$voteType/game_vote"),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer $token',
          }
      );
      if(response.statusCode == 200){
        var data = jsonDecode(response.body.toString());
        PopupMessage(data['message'], true);
        addCoins(2);
        fetchAirtime("today");
        OverlayLoadingProgress.stop();

      }else {
        var data = jsonDecode(response.body.toString());
        print('failed');
        OverlayLoadingProgress.stop();
        PopupMessage(data['message'], false);
      }
    }catch(e){
      print(e.toString());
      PopupMessage("Internal server error", false);
      OverlayLoadingProgress.stop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
        itemCount: games.length,
        itemBuilder: (context,index) {
          final itemData = games[index];
          final id = itemData['id'].toString();
          final network = itemData['network'].toString();
          final totalAmount = itemData['total_amount'].toString();
          final quantity = itemData['quantity'].toString();
          final createdAt = itemData['created_at'].toString();

          if(games.isNotEmpty)  {
            return GestureDetector(
              child: AirtimeCard(id: id, network: network, totalAmount: totalAmount, quantity: quantity, createdAt: createdAt, onTapCard:() { voteGames("gameId", "upvote"); }),
            );
          }
          else {
              return const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Center(
                      child: Padding(padding: EdgeInsets.all(defaultPadding),
                          child: Text(
                            'Experts are working on new games',
                            style: TextStyle(fontSize: 20, color: kTextBlackColor),
                          )
                      )
                  )
                ],
              );
          }


        });
  }

}


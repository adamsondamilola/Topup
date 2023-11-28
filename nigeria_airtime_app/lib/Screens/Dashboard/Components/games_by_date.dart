import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
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

class TodayGamesWidget extends StatefulWidget {
  const TodayGamesWidget({super.key});

  @override
  State<TodayGamesWidget> createState() => _TodayGamesWidget();

}

class _TodayGamesWidget extends State<TodayGamesWidget> {
  List<dynamic> games = [];
  @override
  void initState() {
    super.initState();
    fetchGames("today");
  }

  void fetchGames(String gameDay) async {
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
        fetchGames("today");
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
          final country = itemData['country'].toString();
          final countryCode = itemData['country_code'].toString();
          final league = itemData['league'].toString();
          final homeTeam = itemData['home_team'].toString();
          final homeLogo = itemData['home_logo'].toString();
          final awayTeam = itemData['away_team'].toString();
          final awayLogo = itemData['away_logo'].toString();
          final prediction = itemData['prediction'].toString();
          final result = itemData['result'].toString();
          final gameType = itemData['game_type'].toString();
          final gameId = itemData['id'].toString();
          final gameTime = itemData['game_time'].toString();
          final upVotes = itemData['upvotes'].toString();
          final downVotes = itemData['downvotes'].toString();
          final winOrLose = itemData['win_or_lose'].toString();

          if(games.isNotEmpty)  {
            return GestureDetector(
              child: GamesCard(country: country, countryCode: countryCode, gameType: gameType, gameLeague: league, gameTime: gameTime, gameTips: prediction, teamA: homeTeam, teamB: awayTeam, teamALogo: homeLogo, teamBLogo: awayLogo, prediction: prediction, result: result, winOrLose: winOrLose, upVotes: upVotes, downVotes: downVotes, id: gameId, onTapUpVote:() { voteGames(gameId, "upvote"); }, onTapDownVote:() { voteGames(gameId, "downvote"); }),
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

//tomorrow games
class TomorrowGamesWidget extends StatefulWidget {
  const TomorrowGamesWidget({super.key});

  @override
  State<TomorrowGamesWidget> createState() => _TomorrowGamesWidget();

}

class _TomorrowGamesWidget extends State<TomorrowGamesWidget> {
  List<dynamic> gamesTom = [];

  @override
  void initState() {
    super.initState();
    fetchGames("tomorrow");
  }

  void fetchGames(String gameDay) async {
    OverlayLoadingProgress.start(context, barrierDismissible: false);
    try{
      Response response = await get(
          Uri.parse("$mainEndpoint/game/$gameDay/get_games")
      );
      if(response.statusCode == 200){
        var data = jsonDecode(response.body.toString());
        print("done");
        setState(() {
          gamesTom = data['message'];
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
        fetchGames("tomorrow");
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
        itemCount: gamesTom.length,
        itemBuilder: (context,index) {
          final itemData = gamesTom[index];
          final country = itemData['country'].toString();
          final countryCode = itemData['country_code'].toString();
          final league = itemData['league'].toString();
          final homeTeam = itemData['home_team'].toString();
          final homeLogo = itemData['home_logo'].toString();
          final awayTeam = itemData['away_team'].toString();
          final awayLogo = itemData['away_logo'].toString();
          final prediction = itemData['prediction'].toString();
          final result = itemData['result'].toString();
          final gameType = itemData['game_type'].toString();
          final gameId = itemData['id'].toString();
          final gameTime = itemData['game_time'].toString();
          final upVotes = itemData['upvotes'].toString();
          final downVotes = itemData['downvotes'].toString();
          final winOrLose = itemData['win_or_lose'].toString();
          if(gamesTom.isEmpty) {
            return const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Center(
                    child: Padding(padding: EdgeInsets.all(defaultPadding),
                        child: Text(
                          'We are working on new games',
                          style: TextStyle(fontSize: 20, color: kTextBlackColor),
                        )
                    )
                )
              ],
            );
          }
          else {
            return GestureDetector(
              onTap: () {

              },
              child: GamesCard(country: country, countryCode: countryCode, gameType: gameType, gameLeague: league, gameTime: gameTime, gameTips: prediction, teamA: homeTeam, teamB: awayTeam, teamALogo: homeLogo, teamBLogo: awayLogo, prediction: prediction, result: result, winOrLose: winOrLose, upVotes: upVotes, downVotes: downVotes, id: gameId, onTapUpVote:() { voteGames(gameId, "upvote"); }, onTapDownVote:() { voteGames(gameId, "downvote"); }),
            );
          }

        });
  }

}


//yesterday games
class YesterdayGamesWidget extends StatefulWidget {
  const YesterdayGamesWidget({super.key});

  @override
  State<YesterdayGamesWidget> createState() => _YesterdayGamesWidget();

}

class _YesterdayGamesWidget extends State<YesterdayGamesWidget> {
  List<dynamic> gamesYest = [];

  @override
  void initState() {
    super.initState();
    fetchGames("yesterday");
  }

  void fetchGames(String gameDay) async {
    OverlayLoadingProgress.start(context, barrierDismissible: false);
    try{
      Response response = await get(
          Uri.parse("$mainEndpoint/game/$gameDay/get_games")
      );
      if(response.statusCode == 200){
        var data = jsonDecode(response.body.toString());
        print("done");
        setState(() {
          if(data['message'].length > 0){
            gamesYest = data['message'];
          }
          else {
            gamesYest = [];
          }

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
        fetchGames("yesterday");
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
        itemCount: gamesYest.length,
        itemBuilder: (context,index) {
          final itemData = gamesYest[index];
          final country = itemData['country'].toString();
          final countryCode = itemData['country_code'].toString();
          final league = itemData['league'].toString();
          final homeTeam = itemData['home_team'].toString();
          final homeLogo = itemData['home_logo'].toString();
          final awayTeam = itemData['away_team'].toString();
          final awayLogo = itemData['away_logo'].toString();
          final prediction = itemData['prediction'].toString();
          final result = itemData['result'].toString();
          final gameType = itemData['game_type'].toString();
          final gameId = itemData['id'].toString();
          final gameTime = itemData['game_time'].toString();
          final upVotes = itemData['upvotes'].toString();
          final downVotes = itemData['downvotes'].toString();
          final winOrLose = itemData['win_or_lose'].toString();
          if(gamesYest.isEmpty) {
            return const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Center(
                    child: Padding(padding: EdgeInsets.all(defaultPadding),
                        child: Text(
                          'Today games will appear here tomorrow',
                          style: TextStyle(fontSize: 20, color: kTextBlackColor),
                        )
                    )
                )
              ],
            );
          }
          else {
            return GestureDetector(
              onTap: () {

              },
              child: GamesCard(country: country, countryCode: countryCode, gameType: gameType, gameLeague: league, gameTime: gameTime, gameTips: prediction, teamA: homeTeam, teamB: awayTeam, teamALogo: homeLogo, teamBLogo: awayLogo, prediction: prediction, result: result, winOrLose: winOrLose, upVotes: upVotes, downVotes: downVotes, id: gameId, onTapUpVote:() { voteGames(gameId, "upvote"); }, onTapDownVote:() { voteGames(gameId, "downvote"); }),
            );
          }

        });
  }

}

//yesterday games
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart';
import 'package:nigeria_airtime_app/Components/popup_message.dart';
import 'package:nigeria_airtime_app/constants/app_info.dart';
import 'package:nigeria_airtime_app/constants/colors_consts.dart';
import 'package:nigeria_airtime_app/constants/endpoints.dart';
import 'package:nigeria_airtime_app/constants/images.dart';
import 'package:overlay_loading_progress/overlay_loading_progress.dart';

class PrintCardWidget extends StatefulWidget {

  final String cardsId;

  const PrintCardWidget({
    required this.cardsId,
    super.key});

  @override
  State<PrintCardWidget> createState() => _PrintCardWidget();

}

class _PrintCardWidget extends State<PrintCardWidget> {
  List<dynamic> cards = [];

  late String companyName = "";
  late String network = "";

  @override
  void initState() {
    super.initState();
    setState(() {
      fetchCards();
    });
  }

  void fetchCards() async {
    OverlayLoadingProgress.start(context, barrierDismissible: false);
    try{
      const storage = FlutterSecureStorage();
      var token = await storage.read(key: 'access_token');
      Response response = await get(
          Uri.parse("$mainEndpoint/recharge/"+widget.cardsId+"/get_airtime_details"),
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer $token',
          },
      );
      if(response.statusCode == 200){
        var data = jsonDecode(response.body.toString());
        print("done");

        setState(() {
          network = data['result']['network'];
          cards = data['result']['json_data'];
        });
        
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
        itemCount: cards.length,
        itemBuilder: (context,index) {
          final itemData = cards[index];
          final amount = itemData['amount'].toString();
          final pin = itemData['pin'].toString();
          final serialNumber = itemData['serial_number'].toString();
          
            return Card(
      // Set the shape of the card using a rounded rectangle border with a 8 pixel radius
        shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      // Set the clip behavior of the card
      clipBehavior: Clip.antiAliasWithSaveLayer,
      // Define the child widgets of the card
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          // Display an image at the top of the card that fills the width of the card and has a height of 160 pixels
          
          Container(
            padding: const EdgeInsets.fromLTRB(15, 15, 15, 0),
            height: 50,
            child: Column(
              children: <Widget>[
                // Add a spacer to push the buttons to the right side of the card
                const Spacer(),
                // Add a text button labeled "SHARE" with transparent foreground color and an accent color for the text
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child:
                      Image.asset(network == "MTN"? mtnLogo : network == "GLO"? gloLogo : network == "AIRTEL"? airtelLogo : network == "9MOBILE"? nmobileLogo : '', width: 30, height: 30,)
                      /*Text(
                        network,
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                        textAlign: TextAlign.end,
                      ),*/
                    ),
                    const Spacer(),
                    Center(
                      child: Text(
                        network,
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                        textAlign: TextAlign.end,
                      ),
                    ),
                    const Spacer(),
                    Center(
                      child: Text(
                        currencySymbol+amount,
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                        textAlign: TextAlign.end,
                      ),
                    ),
                  ],
                ),
                // Add a text button labeled "EXPLORE" with transparent foreground color and an accent color for the text
              ],
            ),
          ),

                    Container(
            padding: const EdgeInsets.fromLTRB(15, 15, 15, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                SizedBox(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                     Text(
                          companyName == "" || companyName == "null"? appName : companyName,
                          style: TextStyle(
                            fontSize: 15,
                            color: Colors.grey[700],
                          ),
                        ),
                    ],
                  ),
                ),
                // Add a row with two buttons spaced apart and aligned to the right side of the card
               
              ],
            ),
          ),

          
                   Container(
            padding: const EdgeInsets.fromLTRB(15, 15, 15, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                SizedBox(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                     Text(
                          "S/N",
                          style: TextStyle(
                            fontSize: 15,
                            color: Colors.grey[700],
                          ),
                        ),
                      const Spacer(),
                      Text(
                        serialNumber,
                        style: TextStyle(
                          fontSize: 15,
                          color: Colors.grey[700],
                        ),
                      ),
                    ],
                  ),
                ),
                // Add a row with two buttons spaced apart and aligned to the right side of the card
               
              ],
            ),
          ),
 // Add a container with padding that contains the card's title, text, and buttons
          Container(
            padding: const EdgeInsets.fromLTRB(15, 15, 15, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                SizedBox(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                     Text(
                          "PIN",
                          style: TextStyle(
                            fontSize: 15,
                            color: Colors.grey[700],
                          ),
                        ),
                      const Spacer(),
                      Text(
                        pin,
                        style: TextStyle(
                          fontSize: 18,
                            fontWeight: FontWeight.bold,
                          color: Colors.grey[700],
                        ),
                      ),
                    ],
                  ),
                ),
                // Add a row with two buttons spaced apart and aligned to the right side of the card
               
              ],
            ),
          ),
          

          Container(
            padding: const EdgeInsets.fromLTRB(15, 15, 15, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                SizedBox(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                     Text(
                          "Dial",
                          style: TextStyle(
                            fontSize: 15,
                            color: Colors.grey[700],
                          ),
                        ),
                      const Spacer(),
                      Text(
                        "*311*$pin#",
                        style: TextStyle(
                          fontSize: 15,
                          color: Colors.grey[700],
                        ),
                      ),
                    ],
                  ),
                ),
                // Add a row with two buttons spaced apart and aligned to the right side of the card
               
              ],
            ),
          ),

          // Add a small space between the card and the next widget
          Container(height: 5),
        ],
      ),
    );
          

        });
  }

}

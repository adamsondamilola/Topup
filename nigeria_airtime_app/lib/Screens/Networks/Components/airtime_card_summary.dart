import 'package:country_flags/country_flags.dart';
import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/constants/colors_consts.dart';

class AirtimeCard extends StatelessWidget {
  final String id;
  final String network;
  final String totalAmount;
  final String quantity;
  final String createdAt;
  final void Function()? onTapCard;

  const AirtimeCard({
    super.key,
    required this.id,
    required this.network,
    required this.totalAmount,
    required this.quantity,
    required this.createdAt,
    required this.onTapCard,
  });

  @override
  Widget build(BuildContext context) {
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
                      CountryFlag.fromCountryCode(
                        "NG",
                        height: 25,
                        width: 25,
                        borderRadius: 8,
                      ),
                    ),
                    const Spacer(),
                    Center(
                      child: Text(
                        "Test".toUpperCase(),
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
          // Add a container with padding that contains the card's title, text, and buttons
          Container(
            padding: const EdgeInsets.fromLTRB(15, 15, 15, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                // Display the card's title using a font size of 24 and a dark grey color
                // Add a space between the title and the text
                // Display the card's text using a font size of 15 and a light grey color
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(defaultPadding),
                        child: Text(
                          "teamA",
                          style: TextStyle(
                            fontSize: 20,
                            color: Colors.grey[800],
                          ),
                        ),
                      ),
                      TextButton(
                        style: TextButton.styleFrom(
                          backgroundColor: Colors.white70,
                        ),
                        child: Row(
                          children: [
                            Text(
                              "hello",
                              style: TextStyle(
                                fontSize: 20,
                                color: Colors.grey[800],
                              ),
                            ),
                          ],
                        ),
                        onPressed: () {},
                      ),
                      Padding(
                        padding: const EdgeInsets.all(defaultPadding),
                        child: Text(
                          "teamB",
                          style: TextStyle(
                            fontSize: 20,
                            color: Colors.grey[800],
                          ),
                        ),
                      )
                    ],
                  ),
                ),
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(defaultPadding),
                        child: Text(
                          "gameType",
                          style: TextStyle(
                            fontSize: 20,
                            color: Colors.grey[700],
                          ),
                        ),
                      ),
                      const Spacer(),
                      Text(
                        "gameTime",
                        style: TextStyle(
                          fontSize: 20,
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
  }
}

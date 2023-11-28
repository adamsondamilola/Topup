import 'package:country_flags/country_flags.dart';
import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/constants/app_info.dart';
import 'package:nigeria_airtime_app/constants/colors_consts.dart';
import 'package:nigeria_airtime_app/constants/images.dart';

class AirtimeCardTransaction extends StatelessWidget {
  final String id;
  final String network;
  final String totalAmount;
  final String quantity;
  final String createdAt;
  final void Function()? onTapCard;

  const AirtimeCardTransaction({
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
                      Image.asset(mtnLogo, width: 30, height: 30,)
                      /*Text(
                        network,
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                        textAlign: TextAlign.end,
                      ),*/
                    ),
                    const Spacer(),
                    Center(
                      child: Text(
                        "₦$totalAmount",
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
                SizedBox(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                     Text(
                          createdAt,
                          style: TextStyle(
                            fontSize: 20,
                            color: Colors.grey[700],
                          ),
                        ),
                      const Spacer(),
                      Text(
                        quantity,
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


class AirtimePurchaseDetailsCard extends StatelessWidget {
  final String amount;
  final String network;
  final String logo;
  final String totalAmount;
  final String quantity;
  final String cashBack;

  const AirtimePurchaseDetailsCard({
    super.key,
    required this.amount,
    required this.network,
    required this.logo,
    required this.totalAmount,
    required this.quantity,
    required this.cashBack,
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
                      Image.asset(logo, width: 30, height: 30,)
                      /*Text(
                        network,
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                        textAlign: TextAlign.end,
                      ),*/
                    ),
                    const Spacer(),
                    Center(
                      child: Text(
                        "₦$amount",
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
                SizedBox(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                     Text(
                          "Quantity",
                          style: TextStyle(
                            fontSize: 20,
                            color: Colors.grey[700],
                          ),
                        ),
                      const Spacer(),
                      Text(
                        quantity,
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
                          "Amount",
                          style: TextStyle(
                            fontSize: 20,
                            color: Colors.grey[700],
                          ),
                        ),
                      const Spacer(),
                      Text(
                        currencySymbol+amount,
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
                          "Total Amount",
                          style: TextStyle(
                            fontSize: 20,
                            color: Colors.grey[700],
                          ),
                        ),
                      const Spacer(),
                      Text(
                        currencySymbol+totalAmount,
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
                          "Cash-back",
                          style: TextStyle(
                            fontSize: 20,
                            color: Colors.grey[700],
                          ),
                        ),
                      const Spacer(),
                      Text(
                        currencySymbol+cashBack,
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

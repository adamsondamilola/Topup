import 'package:country_flags/country_flags.dart';
import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/constants/colors_consts.dart';

class ProfileCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String info;

  const ProfileCard({
    super.key,
    required this.icon,
    required this.title,
    required this.info
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      // Set the clip behavior of the card
      clipBehavior: Clip.antiAliasWithSaveLayer,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(15, 15, 15, 0),
            height: 80,
            child: Column(
              children: <Widget>[
                // Add a spacer to push the buttons to the right side of the card
                // Add a text button labeled "SHARE" with transparent foreground color and an accent color for the text
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Padding(
                padding: const EdgeInsets.all(defaultPadding),
            child: Icon(
                        icon,
                        color: kPrimaryColor,
                      ),
    ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                            title,
                            style: TextStyle(fontSize: 15, color: kTextColor),
                            textAlign: TextAlign.start,
                          ),
                        Text(
                            info,
                            textAlign: TextAlign.start,
                          overflow: TextOverflow.fade,
                          maxLines: 1,
                          softWrap: false,
                          style: TextStyle(fontSize: 20),
                          ),

                      ],
                    ),
                  ],
                ),
                // Add a text button labeled "EXPLORE" with transparent foreground color and an accent color for the text
              ],
            ),
          )
        ],
      )
    );
  }

}
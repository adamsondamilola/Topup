import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/Screens/Dashboard/dashboard_screen.dart';
import 'package:nigeria_airtime_app/Screens/Transactions/Components/airtime_card_transaction.dart';
import 'package:nigeria_airtime_app/constants/app_info.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../constants/colors_consts.dart';


bool newVersionAvailable = false;

class TransactionsScreen extends StatelessWidget {
  const TransactionsScreen({Key? key}) : super(key: key);


  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: kPrimaryColor,
          foregroundColor: Colors.white,
          title: const Row(
            children: [
              Padding(padding:  EdgeInsets.all(defaultPadding),
                  child: Text('Recent Transactions', style: TextStyle(fontSize: 15, color: Colors.white))
              )
            ],
          ),
          centerTitle: true,
        ),
        body: SingleChildScrollView(
          padding:  EdgeInsets.fromLTRB(0, 10, 0, 10),
          child:  AirtimeCardTransaction(id: "1", network: "MTN", totalAmount: "1000", quantity: "10", createdAt: "11-11-2022", onTapCard: (){}),
        )
    );
  }
}
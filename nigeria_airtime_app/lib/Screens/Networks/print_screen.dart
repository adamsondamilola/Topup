import 'package:bluetooth_print/bluetooth_print.dart';
//import 'package:bluetooth_thermal_printer/bluetooth_thermal_printer.dart';
//import 'package:esc_pos_utils/esc_pos_utils.dart';
import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/Screens/Networks/Components/print_widget.dart';
import '../../constants/colors_consts.dart';

BluetoothPrint bluetoothPrint = BluetoothPrint.instance;

bool newVersionAvailable = false;

class PrintCardScreen extends StatefulWidget {

  final String cardsId;

  const PrintCardScreen({
    required this.cardsId,
    super.key});

  @override
  State<PrintCardScreen> createState() => _PrintCardScreen();

}

class _PrintCardScreen extends State<PrintCardScreen> {
//class _PrintCardScreen extends StatelessWidget {
  //const PrintCardScreen({Key? key}) : super(key: key);

//  final String cardsId;
/*
  const PrintCardScreen({
    super.key,
    required this.cardsId
  });
  */


void scanForPrinter(){
  
}

  void printCard(){
  }

@override
  void initState() {
    super.initState();
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
                  child: Text('Print Airtime', style: TextStyle(fontSize: 15, color: Colors.white))
              )
            ],
          ),
          centerTitle: true,
        ),
        body: PrintCardWidget(cardsId: widget.cardsId),
           
        bottomNavigationBar: Container(
          alignment: Alignment.bottomCenter,
          height: 50,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                SizedBox(
                  child:  Row(children: [ 
              GestureDetector(
                onTap: (){
                  printCard();
                },
                child: Icon(Icons.print_sharp, size: 50, color: kPrimaryColor),
              ),
              Spacer(),
              Icon(Icons.arrow_back, size: 30, color: kPrimaryColor),
            ],),
                ),
                // Add a row with two buttons spaced apart and aligned to the right side of the card
               
              ],
            ),
          ),
    );
  }
}
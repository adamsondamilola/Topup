import 'dart:convert';
import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:nigeria_airtime_app/Screens/Transactions/Components/airtime_card_transaction.dart';
import 'package:nigeria_airtime_app/Screens/Networks/print_screen.dart';
import 'package:nigeria_airtime_app/constants/app_info.dart';
import 'package:overlay_loading_progress/overlay_loading_progress.dart';
import 'package:nigeria_airtime_app/Components/popup_message.dart';
import 'package:nigeria_airtime_app/constants/endpoints.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../Auth/Components/already_have_an_account_acheck.dart';
import '../../../constants/colors_consts.dart';
import 'package:nigeria_airtime_app/Screens/Dashboard/dashboard_screen.dart';
import '../../Auth/log_in.dart';

class PrintAirtimeForm extends StatefulWidget {
  final Color selectedTabColor_;
  final String selectedNetwork;
  final String selectedLogo;
  
  const PrintAirtimeForm({
    required this.selectedTabColor_,
    required this.selectedNetwork,
    required this.selectedLogo,
    super.key});    

  @override
  State<PrintAirtimeForm> createState() {
    return _PrintAirtimeForm();
  }
}

class _PrintAirtimeForm extends State<PrintAirtimeForm> {
  TextEditingController codeController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController quantityController = TextEditingController();
  TextEditingController cashBackController = TextEditingController();

  TextEditingController networkController = TextEditingController();
  TextEditingController amountController = TextEditingController();


   String selectedAmount = "0";
   late int cardsId;
   bool enterPin = false;
   

    void authorizeAirtimePurchase() async {
    OverlayLoadingProgress.start(context, barrierDismissible: false);
    try{
      const storage = FlutterSecureStorage();
      var token = await storage.read(key: 'access_token');
      Response response = await post(
          Uri.parse('$mainEndpoint/recharge/print_airtime'),
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer $token',
          },
          body: {
            'network' : widget.selectedNetwork,
            'quantity' : quantityController.text.toString(),
            'amount' : selectedAmount,
            'pin' : codeController.text.toString()
          }
      );

      if(response.statusCode == 200){
        var data = jsonDecode(response.body.toString());

        OverlayLoadingProgress.stop();

        setState(() {
          enterPin = false;
          codeController.text = "";
          cardsId = data['airtime_id'];
        });

        Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) {
                      return PrintCardScreen(cardsId: cardsId.toString());
                    },
                  ),
                );

        

        //final data = jsonDecode(response.body);
        PopupMessage(data['message'], true);

      }else {
        var data = jsonDecode(response.body.toString());
        PopupMessage(data['message'], false);

        setState(() {
          codeController.text = "";
        });

        OverlayLoadingProgress.stop();
      }
    }catch(e){
      print(e.toString());
      PopupMessage("Internal server error", false);
      OverlayLoadingProgress.stop();
    }
    
  }

   void proceedToNextView (){
if(int.parse(selectedAmount) < 100)
{
  PopupMessage('Select amount', false);
}
else if(int.parse(quantityController.text.toString()) < 1 )
{
PopupMessage('No quantity entered', false);
}
else{
  PopupMessage("Please wait...", true);
  setState(() {
    enterPin = true;
  });
}
   }
 
   void purchaseAirtime(){

   }

    void setAmount(String amt){
setState(() {
  selectedAmount = amt;
});
PopupMessage("Selected Amount: $currencySymbol$amt", true);
    }

  bool isLoginSuccessful = false;
  bool isPasswordResetSuccessful = false;


  Future<bool> resetPassword() async {
    bool result = false;
    try{
      SharedPreferences prefs = await SharedPreferences.getInstance();
      Response response = await post(
          Uri.parse('$mainEndpoint/auth/password/reset'),
          body: {
            'email' : emailController.text.toString(),
          }
      );
      if(response.statusCode == 200){
        var data = jsonDecode(response.body.toString());
        PopupMessage(data['message'], true);
        OverlayLoadingProgress.stop();
        setState(() {
          isPasswordResetSuccessful = true;
        });
        result = true;
      }else {
        var data = jsonDecode(response.body.toString());
        PopupMessage(data['message'], false);
        print('failed');
        OverlayLoadingProgress.stop();
      }
    }catch(e){
      print(e.toString());
      PopupMessage("Internal server error", false);
      OverlayLoadingProgress.stop();
    }
    return result;
  }

 @override
  void initState() {
    super.initState();
    // Load ads.
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(child: enterPin?
    Column(
      children: [
        Row(children: [
          Container(
            alignment: Alignment.center,
        height: 250,
        width: MediaQuery.of(context).size.width*0.9,
        child: 
          AirtimePurchaseDetailsCard(logo: widget.selectedLogo, amount: selectedAmount, network: widget.selectedNetwork, totalAmount: (int.parse(selectedAmount) * int.parse(quantityController.text.toString())).toString(), quantity: quantityController.text.toString(), cashBack: (double.parse(selectedAmount) * double.parse(quantityController.text.toString()) * 0.05).toString())
          ),
        ]),
        Row(children: [
          Container(
        alignment: Alignment.center,
        height: 100,
        width: 200,
        child: 
        TextFormField(
              controller: codeController,
              textInputAction: TextInputAction.done,
              keyboardType: TextInputType.number,
              maxLength: 4,
              obscureText: true,
              cursorColor: kPrimaryLightColor,
              style: const TextStyle(color: kTextColor),
              decoration: const InputDecoration(
                counterText: "",
                labelText: "Enter PIN",
                prefixIcon: Padding(
                  padding:  EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.lock),
                ),
              ),
            ),
      ),

const Spacer(),

      Container(
        alignment: Alignment.center,
        height: 100,
        width: 120,
        child: 
       ElevatedButton(
        style: ElevatedButton.styleFrom(backgroundColor: widget.selectedTabColor_ ?? kPrimaryColor),
                          onPressed: () {
                            authorizeAirtimePurchase();
                          },
                          child: 
                          //Icon(Icons.arrow_forward, color: Colors.white)
                          Text('Confirm'.toUpperCase(), style: TextStyle(color: Colors.white),),
                        ),
      )
        ],)
      ],
    )
    :
    
    Column(
                  children: [
                    
                    Row(
                  children: [
                    
                    GestureDetector(
      onTap: (){
        setAmount("100");
      },
                      child: Card(
                        color: selectedAmount == "100"? widget.selectedTabColor_ : Colors.white,
                        shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      // Set the clip behavior of the card
      clipBehavior: Clip.antiAliasWithSaveLayer,
      // Define the child widgets of the card
      child: Container(
        alignment: Alignment.center,
        height: 50,
        width: 80,
        child: Text("100", style: TextStyle(color: selectedAmount == "100"? Colors.white : kTextColor, fontSize: 25),),
      ),
      )
      ),

const Spacer(),

      GestureDetector(
      onTap: (){
        setAmount("200");
      },
                      child: Card(
                        color: selectedAmount == "200"? widget.selectedTabColor_ : Colors.white,
                        shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      // Set the clip behavior of the card
      clipBehavior: Clip.antiAliasWithSaveLayer,
      // Define the child widgets of the card
      child: Container(
        alignment: Alignment.center,
        height: 50,
        width: 80,
        child: Text("200", style: TextStyle(color: selectedAmount == "200"? Colors.white : kTextColor, fontSize: 25),),
      ),
      )
      ),

const Spacer(),

      GestureDetector(
      onTap: (){
        setAmount("500");
      },
                      child: Card(
                        color: selectedAmount == "500"? widget.selectedTabColor_ : Colors.white,
                        shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      // Set the clip behavior of the card
      clipBehavior: Clip.antiAliasWithSaveLayer,
      // Define the child widgets of the card
      child: Container(
        alignment: Alignment.center,
        height: 50,
        width: 80,
        child: Text("500", style: TextStyle(color: selectedAmount == "500"? Colors.white : kTextColor, fontSize: 25),),
      ),
      )
      )
           ],
                ),

                Row(
                  children: [
                    
                    GestureDetector(
      onTap: (){
        setAmount("1000");
      },
                      child: Card(
                        color: selectedAmount == "1000"? widget.selectedTabColor_ : Colors.white,
                        shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      // Set the clip behavior of the card
      clipBehavior: Clip.antiAliasWithSaveLayer,
      // Define the child widgets of the card
      child: Container(
        alignment: Alignment.center,
        height: 50,
        width: 215,
        child: Text("1000", style: TextStyle(color: selectedAmount == "1000"? Colors.white : kTextColor, fontSize: 25),),
      ),
      )
      ),

const Spacer(),

      GestureDetector(
      onTap: (){
        setState(() {
          selectedAmount = "0";
        });
      },
                      child: Card(
                        color: Colors.white,
                        shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      // Set the clip behavior of the card
      clipBehavior: Clip.antiAliasWithSaveLayer,
      // Define the child widgets of the card
      child: Container(
        alignment: Alignment.center,
        height: 50,
        width: 80,
        child: Icon(Icons.cancel, color: kTextColor, size: 25,),
      ),
      )
      )
           ],
                ),


                Row(children: [

Container(
        alignment: Alignment.center,
        height: 100,
        width: 200,
        child: 
        TextFormField(
              controller: quantityController,
              textInputAction: TextInputAction.done,
              keyboardType: TextInputType.number,
              cursorColor: kPrimaryLightColor,
              style: const TextStyle(color: kTextColor),
              decoration: const InputDecoration(
                labelText: "Quantity",
                prefixIcon: Padding(
                  padding:  EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.lock),
                ),
              ),
            ),
      ),

const Spacer(),

      Container(
        alignment: Alignment.center,
        height: 100,
        width: 120,
        child: 
       ElevatedButton(
        style: ElevatedButton.styleFrom(backgroundColor: widget.selectedTabColor_ ?? kPrimaryColor),
                          onPressed: () {
                            proceedToNextView();
                          },
                          child: 
                          Icon(Icons.arrow_forward, color: Colors.white)
                          //Text('Confirm'.toUpperCase(), style: TextStyle(color: Colors.white),),
                        ),
      ),


                ],)

                  ],
                ),
    );
  }
}
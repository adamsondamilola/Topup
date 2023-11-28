import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:nigeria_airtime_app/constants/colors_consts.dart';
void PopupMessage(String message, bool error){
  Fluttertoast.showToast(
    msg: message,
    toastLength: Toast.LENGTH_SHORT,
    timeInSecForIosWeb: 2,
    backgroundColor: error? kPrimaryColor : Colors.red,
    textColor: Colors.white,
    fontSize: 16.0,
  );
}
import 'package:flutter/material.dart';

import '../constants/colors_consts.dart';

class DialogWithActionModal extends StatelessWidget {
  final String buttonText;
  final String title;
  final String info;
  final void Function()? onTap;

  const DialogWithActionModal({
    super.key,
    required this.buttonText,
    required this.title,
    required this.info,
    this.onTap
  });

  //const DialogWithActionModal({Key? key}) : super(key: key);


  @override
  Widget build(BuildContext context) {

    return Container(

    );

  }
}
import 'package:flutter/material.dart';

import '../constants/colors_consts.dart';

class ModalBottomSheet extends StatelessWidget {
  final IconData icon;
  final String title;
  final String info;
  final void Function()? onTap;

  const ModalBottomSheet({
    super.key,
    required this.icon,
    required this.title,
    required this.info,
    this.onTap
  });
  
  //const ModalBottomSheet({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
    child: const Text('showModalBottomSheet'),
        onPressed: () {
        // when raised button is pressed
        // we display showModalBottomSheet
        showModalBottomSheet<void>(
        // context and builder are
        // required properties in this widget
        context: context,
        builder: (BuildContext context) {
        // we set up a container inside which
        // we create center column and display text

        // Returning SizedBox instead of a Container
        return SizedBox(
        height: 200,
        child: Center(
        child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Row(
    children: [
      Icon(
        icon,
        color: kPrimaryColor,
      ),
      Flexible(
        child: Padding(padding:  EdgeInsets.all(defaultPadding),
          child: Text(
            title,
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
          ),
        ),
      ),
      Flexible(
        child: Padding(padding:  EdgeInsets.all(defaultPadding),
          child: Text(
            info,
            style: TextStyle(fontSize: 20),
          ),
        ),
      ),
    ],
          )
        ],
        ),
        ),
        );
        },
        );
        },
        );
  }
}
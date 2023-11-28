import 'package:flutter/material.dart';
class WelcomeScreenBottomBtn extends StatelessWidget {
  const WelcomeScreenBottomBtn({Key? key}) : super(key: key);
    @override 
Widget build(BuildContext context) { 
  return Center(
    child: Row(
children: [
  Column(
    children: [
      Hero(
            tag: "signin_btn",
            child: ElevatedButton(
              onPressed: () {},
              child: Text(
                "Sign In".toUpperCase(),
              ),
            ),
          ),
    ],
  ),
  Column(
    children: [
      Hero(
            tag: "signup_btn",
            child: ElevatedButton(
              onPressed: () {},
              child: Text(
                "Sign Up".toUpperCase(),
              ),
            ),
          ),
    ],
  )
],
    ),
  );
}
}

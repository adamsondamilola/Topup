import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/constants/images.dart';

class AuthBackground extends StatelessWidget {
  final Widget child;
  const AuthBackground({
    Key? key,
    required this.child,
    this.topImage = "assets/images/pngtree-abstract-liquid-element-graphic-gradient-flat-style-design-isolated-on-white-png-image_1544963.jpeg",
    this.bottomImage = "assets/images/login_bottom.png",
  }) : super(key: key);

  final String topImage, bottomImage;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: SingleChildScrollView(
          padding:  EdgeInsets.fromLTRB(0, 0, 0, 50),
        child: Container(
        width: double.infinity,
        height: MediaQuery.of(context).size.height,
        child: Stack(
          alignment: Alignment.center,
          children: <Widget>[
           /* Positioned(
              top: 50,
              child: Image.asset(
                logo,
                width: 100,
              ),
            ),*/
            // Positioned(
            //   bottom: 0,
            //   right: 0,
            //   child: Image.asset(bottomImage, width: 120),
            // ),
            SafeArea(child: child),
          ],
        ),
      ),
      ),
    );
  }
}
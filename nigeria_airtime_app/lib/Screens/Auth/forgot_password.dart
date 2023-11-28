import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/Screens/Auth/Components/forgot_password_form.dart';
import 'package:nigeria_airtime_app/constants/auth_background.dart';
import '../../constants/responsive.dart';
import '../../constants/background.dart';

import 'components/login_form.dart';

class ForgotPasswordScreen extends StatelessWidget {
  const ForgotPasswordScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const AuthBackground(
      child: SingleChildScrollView(
        child: Responsive(
          mobile: const MobileForgotPasswordScreen(),
          desktop: Row(
            children: [
              /* const Expanded(
                child: ForgotPasswordScreenTopImage(),
              ),*/
              Expanded(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SizedBox(
                      width: 450,
                      child: ForgotPasswordForm(),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class MobileForgotPasswordScreen extends StatelessWidget {
  const MobileForgotPasswordScreen({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        //const ForgotPasswordScreenTopImage(),
        Row(
          children: const [
            Spacer(),
            Expanded(
              flex: 8,
              child: ForgotPasswordForm(),
            ),
            Spacer(),
          ],
        ),
      ],
    );
  }
}

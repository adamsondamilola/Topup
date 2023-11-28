import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/Screens/Settings/Components/update_password_form.dart';
import 'package:nigeria_airtime_app/constants/colors_consts.dart';
import '../../constants/responsive.dart';
import '../../constants/background.dart';

class UpdatePasswordScreen extends StatelessWidget {
  const UpdatePasswordScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: UpdatePasswordForm(),
    );
  }
}


import 'package:flutter/material.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:overlay_loading_progress/overlay_loading_progress.dart';
import 'package:nigeria_airtime_app/constants/colors_consts.dart';

class StartOverlayLoader extends StatelessWidget {
//  final Widget child;
  const StartOverlayLoader({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return OverlayLoadingProgress.start(context);
  }
}

class StopOverlayLoader extends StatelessWidget {
//  final Widget child;
  const StopOverlayLoader({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return OverlayLoadingProgress.stop();
  }
}
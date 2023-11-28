import 'dart:io';

class AdHelper {

  static String get bannerAdUnitId {
    if (Platform.isAndroid) {
      return "ca-app-pub-3940256099942544/6300978111";
      return 'ca-app-pub-5456249080816285/5747836495';
    } else if (Platform.isIOS) {
      //return 'ca-app-pub-3940256099942544/2934735716';
      return 'ca-app-pub-5456249080816285/2933932903';
    } else {
      throw new UnsupportedError('Unsupported platform');
    }
  }

  static String get interstitialAdUnitId {
    if (Platform.isAndroid) {
      return "ca-app-pub-3940256099942544/1033173712";
    } else if (Platform.isIOS) {
      return "ca-app-pub-3940256099942544/4411468910";
    } else {
      throw new UnsupportedError("Unsupported platform");
    }
  }

  static String get rewardedAdUnitId {
    if (Platform.isAndroid) {
      return "ca-app-pub-3940256099942544/5224354917";
      return "ca-app-pub-5456249080816285/8356460602";
    } else if (Platform.isIOS) {
      //return "ca-app-pub-3940256099942544/1712485313";
      return "ca-app-pub-5456249080816285/4314069979";
    } else {
      throw new UnsupportedError("Unsupported platform");
    }
  }
}
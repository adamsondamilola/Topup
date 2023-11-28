import 'dart:io';

import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import '../../utilities/ad_helper.dart';


class GoogleAdmobBanner extends StatefulWidget {
  const GoogleAdmobBanner({super.key});

  @override
  State<GoogleAdmobBanner> createState() {
    return _GoogleAdmobBanner();
  }
}

class _GoogleAdmobBanner extends State<GoogleAdmobBanner> {

  Future<InitializationStatus> _initGoogleMobileAds() {
    // TODO: Initialize Google Mobile Ads SDK
    WidgetsFlutterBinding.ensureInitialized();
    return MobileAds.instance.initialize();
  }

  // TODO: Add _bannerAd
  BannerAd? _bannerAd;

  @override
  void initState() {
    super.initState();

    //_initGoogleMobileAds();
    // TODO: Load a banner ad
    BannerAd(
      adUnitId: AdHelper.bannerAdUnitId,
      request: AdRequest(),
      size: AdSize.banner,
      listener: BannerAdListener(
        onAdLoaded: (ad) {
          setState(() {
            _bannerAd = ad as BannerAd;
          });
        },
        onAdFailedToLoad: (ad, err) {
          print('Failed to load a banner ad: ${err.message}');
          ad.dispose();
        },
      ),
    ).load();
  }

  void dispose() {
    // TODO: Dispose a BannerAd object
    _bannerAd?.dispose();
    super.dispose();
  }

  @override
  /*
  Widget bannerAdWidget() {
    return StatefulBuilder(
      builder: (context, setState) => Container(
        child: AdWidget(ad: _bannerAd!),
        width: _bannerAd!.size.width.toDouble(),
        height: 100.0,
        alignment: Alignment.center,
      ),
    );
  }*/

 Widget build(BuildContext context) {

    return Container(
      height: _bannerAd == null? 0 : 50,
      child: _bannerAd == null?
      Container() :
      Align(
        alignment: Alignment.bottomCenter,
        child: SizedBox(
          width: _bannerAd!.size.width.toDouble(),
          height: _bannerAd!.size.height.toDouble(),
          child: AdWidget(ad: _bannerAd!),
        ),
      ),
    );
  }
}


class GoogleAdmobReward extends StatefulWidget {
  const GoogleAdmobReward({super.key});

  @override
  State<GoogleAdmobReward> createState() {
    return _GoogleAdmobReward();
  }
}

class _GoogleAdmobReward extends State<GoogleAdmobReward> {


  // TODO: Add _rewardedAd
  RewardedAd? _rewardedAd;
  // TODO: Implement _loadRewardedAd()

  void loadAd() {
    RewardedAd.load(
        adUnitId: AdHelper.rewardedAdUnitId,
        request: const AdRequest(),
        rewardedAdLoadCallback: RewardedAdLoadCallback(
          // Called when an ad is successfully received.
          onAdLoaded: (ad) {
            ad.fullScreenContentCallback = FullScreenContentCallback(
              // Called when the ad showed the full screen content.
                onAdShowedFullScreenContent: (ad) {},
                // Called when an impression occurs on the ad.
                onAdImpression: (ad) {},
                // Called when the ad failed to show full screen content.
                onAdFailedToShowFullScreenContent: (ad, err) {
                  // Dispose the ad here to free resources.
                  ad.dispose();
                },
                // Called when the ad dismissed full screen content.
                onAdDismissedFullScreenContent: (ad) {
                  // Dispose the ad here to free resources.
                  //ad.dispose();
                  setState(() {
                    ad.dispose();
                    _rewardedAd = null;
                  });
                },
                // Called when a click is recorded for an ad.
                onAdClicked: (ad) {});

            debugPrint('$ad loaded.');
            // Keep a reference to the ad so you can show it later.
            setState(() {
              _rewardedAd = ad;
            });
          },
          // Called when an ad request failed.
          onAdFailedToLoad: (LoadAdError error) {
            debugPrint('RewardedAd failed to load: $error');
          },
        ));
  }

  @override
  void initState() {
    super.initState();
    loadAd();
  }

  @override
  void dispose() {
    // TODO: Dispose a RewardedAd object
    _rewardedAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

    return Container(
      child: _rewardedAd == null?
      Container() :
      Align(),
    );
  }
}
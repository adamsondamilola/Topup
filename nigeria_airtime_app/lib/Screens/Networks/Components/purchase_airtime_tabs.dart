import 'package:flutter/material.dart';
import 'package:nigeria_airtime_app/Screens/Networks/Components/print_airtime.dart';

class PurchaseAirtimeTabBar extends StatefulWidget {
  final Color selectedTabColor_;
  final String selectedNetwork;
  final String selectedLogo;

  PurchaseAirtimeTabBar({required this.selectedTabColor_, required this.selectedNetwork, required this.selectedLogo});
  @override
  _PurchaseAirtimeTabBarState createState() => _PurchaseAirtimeTabBarState();
}
class _PurchaseAirtimeTabBarState extends State<PurchaseAirtimeTabBar>
    with TickerProviderStateMixin {
  late TabController _nestedTabController;

  @override
  void initState() {
    super.initState();
    _nestedTabController = new TabController(length: 2, vsync: this);
  }
  @override
  void dispose() {
    super.dispose();
    _nestedTabController.dispose();
  }
  @override
  Widget build(BuildContext context) {
    double screenHeight = MediaQuery.of(context).size.height;
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: <Widget>[
        TabBar(
          tabAlignment: TabAlignment.center,
          controller: _nestedTabController,
          indicatorColor: widget.selectedTabColor_,
          labelColor: widget.selectedTabColor_,
          unselectedLabelColor: Colors.black54,
          isScrollable: true,
          tabs: <Widget>[
            Tab(
              text: "Print Airtime",
            ),
            Tab(
              text: "Top Up",
            ),

          ],
        ),
        Container(
          height: screenHeight * 0.70,
          margin: EdgeInsets.only(left: 16.0, right: 16.0),
          child: TabBarView(
            controller: _nestedTabController,
            children: <Widget>[
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8.0),
                  color: Colors.white,
                ),
                child: PrintAirtimeForm(selectedTabColor_: widget.selectedTabColor_, selectedNetwork: widget.selectedNetwork, selectedLogo: widget.selectedLogo),
              ),
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8.0),
                  color: Colors.white,
                ),
              ),

            ],
          ),
        )
      ],
    );
  }
}
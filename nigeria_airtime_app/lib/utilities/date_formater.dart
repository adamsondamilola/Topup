import 'package:intl/intl.dart';

class DateFormater {

static String dateTimeToWord (String date_){
  var dateTime = DateTime.parse(date_);
  final DateFormat format = DateFormat('d MMM, y');
  final String result = format.format(dateTime);
  return result;
}

}
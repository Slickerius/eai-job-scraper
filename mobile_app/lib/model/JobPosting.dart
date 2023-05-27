import 'dart:convert';
import 'package:intl/intl.dart';

class JobPostingModel {
  String id;
  String title;
  String company;
  String location;
  String publicationDate;
  String source;
  String url;

  JobPostingModel(
      {required this.id,
      required this.title,
      required this.company,
      required this.location,
      required this.source,
      required this.url,
      required this.publicationDate});

  factory JobPostingModel.fromJson(Map<String, dynamic> json) {
    var publicationDate = json['publicationDate'];
    if(publicationDate != null) {
      var time = DateTime.parse(json['publicationDate']);
      publicationDate = DateFormat("EEEE, dd MMMM yyyy").format(time);
    }
    return JobPostingModel(
      id: json["id"],
      title: json["title"],
      company: json["company"],
      location: json["location"],
      source: json['source'],
      url: json['url'],
      publicationDate: publicationDate ?? "No Date"
    );
  }

  Map<String, dynamic> toJson() => {};
}

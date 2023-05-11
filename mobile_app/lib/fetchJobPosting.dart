import 'package:http/http.dart' as http;
import 'package:mobile_app/model/JobPosting.dart';
import 'dart:async';
import 'dart:convert';

Future<List<JobPostingModel>> fetchJobPostings(
    String title, String company, String location) async {
  var response;
  try {
    response = await http.get(
      Uri.http("localhost:8000", '',
          {"title": title, "company": company, "location": location}),
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to load appointments');
    }
    var data = jsonDecode(utf8.decode(response.bodyBytes));

    // melakukan konversi data json menjadi object MyWatchlist
    List<JobPostingModel> listJobPosting = [];
    for (var d in data) {
      if (d != null) {
        listJobPosting.add(JobPostingModel.fromJson(d));
      }
    }
    return listJobPosting;
  } on Exception catch (exception) {
    print("Exception");
    print(exception);
  } catch (error) {
    print("Error");
    print(error.toString());
  }

  return [];
}

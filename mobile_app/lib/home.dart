import 'package:flutter/material.dart';
import 'package:mobile_app/fetchJobPosting.dart';
import 'package:mobile_app/model/JobPosting.dart';
import 'dart:async';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;
  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  List<JobPostingModel> _data = [];
  int _number = 0;

  @override
  void initState() {
    super.initState();
    setState(() {
      _title = "";
      _location = "";
      _company = "";
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _findJob();
    });
  }

  late String _title;
  late String _company;
  late String _location;

  void _findJob() async {
    List<JobPostingModel> _fetchedData =
        await fetchJobPostings(_title, _company, _location);
    setState(() {
      _data = _fetchedData;
      _number = _fetchedData.length;
    });
  }

  Widget _buildTitle() {
    return TextFormField(
      decoration: InputDecoration(
        hintText: "Contoh: Programmer",
        labelText: "Pekerjaan",
        icon: const Icon(Icons.work),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(5.0)),
      ),
      onChanged: (value) => {
        _title = value
      },
    );
  }

  Widget _buildCompany() {
    return TextFormField(
      decoration: InputDecoration(
        hintText: "Contoh: Mandiri",
        labelText: "Perusahaan",
        icon: const Icon(Icons.business_outlined),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(5.0)),
      ),
      onChanged: (value) {
        _company = value;
      },
    );
  }

  Widget _buildLocation() {
    return TextFormField(
      decoration: InputDecoration(
        hintText: "Contoh: Jakarta",
        labelText: "Lokasi",
        icon: const Icon(Icons.place),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(5.0)),
      ),
      onChanged: (value) {
        _location = value;
      },
    );
  }

  EdgeInsets padding = const EdgeInsets.all(8.0);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: ListView(
          children: [
            Padding(
              padding: const EdgeInsets.all(12),
              child: Text(
                "Cari Pekerjaan",
                textAlign: TextAlign.center,
                style: TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 20,
                    color: Colors.blue[700]),
              ),
            ),
            Padding(padding: padding, child: _buildTitle()),
            Padding(padding: padding, child: _buildCompany()),
            Padding(padding: padding, child: _buildLocation()),
            Padding(
                padding: padding,
                child: Text(
                  'Ditemukan $_number Pekerjaan Terkait',
                )),
            ..._data
                .map((JobPostingModel e) => Card(
                        child: Padding(
                      padding: EdgeInsets.all(20),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            e.title,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(
                            height: 10,
                          ),
                          Text('Perusahaan: ${e.company}'),
                          Text('Lokasi: ${e.location}'),
                          Text('Sumber: ${e.source}'),
                          Text('Dipublikasi: ${e.publicationDate}')
                        ],
                      ),
                    )))
                .toList()
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _findJob,
        tooltip: 'Cari Pekerjaan',
        child: const Icon(Icons.search),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}

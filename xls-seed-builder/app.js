// load dependencies
if(typeof require !== 'undefined') {
  XLS = require('xlsjs');
  jsonQ = require('jsonQ');
  fs = require('fs');
  request = require('sync-request');
}

// to_json converts xls sheet to json
function to_json(workbook) {
  var result = {};
  workbook.SheetNames.forEach(function(sheetName) {
    var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    if(roa.length > 0){
      result[sheetName] = roa;
    }
  });
  return result;
};

var xlsWorkbook = XLS.readFile("plan.xls");
var xls = jsonQ(to_json(xlsWorkbook));
var xlsDate = xls.find('Date').parent();

var outputJS = ""
xlsDate.each(function(index, path, value) {
  var resPsalm = request('GET', 'http://labs.bible.org/api/?passage='+
                 encodeURI("Psalm " + value.Psalm)+'&type=json&formatting=plain');
  console.log(res.getBody());

  outputJS += "Plans.insert({chapterName: '"+ value.chapterName +
    "',chapterNumber: "+ value.chapterNum+
    ",date: '"+value.Date+
    "',readingShort: '"+ value.Readings +
    "',psalm: '"+ value.Psalm +
    "',rating: 0});\n";

});
console.log(outputJS);
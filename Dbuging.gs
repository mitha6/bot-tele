function myFunction() {
  // var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Laporan')
  // sheet.deleteRow(2);
  // sheet.appendRow(["abc", "bcd", "cde"])

  // var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
  // // rows[0].concat("wow")
  // Logger.log(rows[1][1] == "-2")

  var search = SpreadsheetApp.openById(ssId).getRange("Laporan!A1:J").getValues()
  for (var i = 0; i < search.length; i++) {
    if(search[i][0] == "LAPOR-1683728524") {
      Logger.log(typeof search[21.0][0])
    } 
  }

  // Logger.log(rows.getValues())

}

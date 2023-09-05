var ssId = "1BlM8nLg7DNRQJPbgvkV_LHlTsJvxfayZ1rYJxXRgnx4";
// var code_status = 0;


function doGet(e) {
  return tg.util.outputText("Hanya data POST yang kita proses yak!");
}


function doPost(e) {
  let update = tg.doPost(e);

  if (update.callback_query) {
    
    var cb = update.callback_query
    var msg = update.callback_query.message;

    if (/lapor_kasus/i.exec(cb.data)) {
      tg.sendMsg(msg, "Halo, " + cb.from.first_name + ". Selamat datang di menu lapor kasus.\n\nSilahkan ikuti langkah-langkah pelaporan kasus, pastikan data mu diisi dengan benar!")

      var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
      sheet.appendRow([msg.chat.id, 0])

      return tg.sendMsg(msg, "Masukkan NIM-mu!")
    }
    else if (/scheduling_s/i.exec(cb.data)) {
      tg.sendMsg(msg, "Halo, " + cb.from.first_name + ". Selamat datang di menu scheduling.\n\nKamu akan terhubung dengan admin kami untuk proses scheduling pertemuan!")

        var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
        sheet.appendRow([msg.chat.id, -20])

        return tg.sendMsg(msg, "Masukkan NIM-mu!")
    }
    else if (/cek_status/i.exec(cb.data)) {
      return tg.sendMsg(msg, "🙋‍♂️ Halo, selamat datang di menu cek status, untuk mengecek status laporan gunakan command \"/cekstatus\"\n\nTulis ID di samping command \"/ceklstatus\" [ID Laporan]\n\nContoh: /cekstatus LAPOR-3921213")
    }


    
    var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
    for (var i = 0; i < rows.length; i++) {
      if(rows[i][0]==msg.chat.id) {
        if (rows[i][1] == "-1") {
          if(/iya_nim/i.exec(cb.data)) {
            var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
            for (var i = 0; i < rows.length; i++) {
              if(rows[i][0]==msg.chat.id) {
                if (rows[i][1] == -1){
                  var copy = rows[i]
                  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                  sheet.deleteRow(i+1)
                  sheet.appendRow([copy[0], -10, "-", copy[3]])
                  return tg.sendMsg (msg, "Tuliskan Laporan-mu!")
                }
              }
            }
          }
          else if (/tidak_nim/i.exec(cb.data)) {
            var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
            for (var i = 0; i < rows.length; i++) {
              if(rows[i][0]==msg.chat.id) {
                if (rows[i][1] == -1){
                  var copy = rows[i]
                  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                  sheet.deleteRow(i+1)
                  sheet.appendRow([copy[0], -2])
                  break;
                }
              }
            }
            return tg.sendMsg(msg, "Perbarui data diri kamu dengan format\n[NIM];[Nama];[Jenis Kelamin];[Program Studi];[Nomor Handphone]\n\nContoh: 123;James;Laki-laki;Teknik Motor;08123456789\n\n🚨Khusus NIM jangan di rubah!🚨")
          }
        }
        else if (rows[i][1] == "-25") {
          if (/setuju_status/i.exec(cb.data)) {
            var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
            for (var i = 0; i < rows.length; i++) {
              if(rows[i][0]==msg.chat.id) {
                if (rows[i][1] == "-25"){

                  var search = SpreadsheetApp.openById(ssId).getRange("Laporan!A1:J").getValues();
                  for (var j = 0; j < search.length; j++) {
                    if(search[j][0]==rows[i][2]) {
                      var copy = search[j]
                      var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Laporan')
                      sheet.deleteRow(j+1)
                      copy[9] = "Sudah terkonfirmasi"
                      sheet.appendRow(copy)
                    }
                  }

                  var copy = rows[i]
                  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                  sheet.deleteRow(i+1)


                  return tg.sendMsg(msg, "Terima kasih telah mengkonfirmasi laporan ini")
                }
              }
            }
          }
          else if (/tidak_status/i.exec(cb.data)) {
            var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
            for (var i = 0; i < rows.length; i++) {
              if(rows[i][0]==msg.chat.id) {
                if (rows[i][1] == "-25"){

                  var copy = rows[i]
                  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                  sheet.deleteRow(i+1)

                  return tg.sendMsg(msg, "Terima kasih telah mengkonfirmasi laporan ini. Gunakan menu /scheduling untuk menjadwalkan ulang pertemuan")
                }
              }
            }
          }
        }
        else {
          try {
            prosesLapor(update, rows[i][1], rows[i][2]);
          }
          catch (e) {
            tg.sendMessage(adminBot, e.message);
          }
          return; 
        }
      }
      
    }
  }

  else if (update.message) {
    var msg = update.message;
    var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
    for (var i = 0; i < rows.length; i++) {
      if(rows[i][0]==msg.chat.id) {
        if (rows[i][1] == 0) {
          var mhsTable = SpreadsheetApp.openById(ssId).getRange("Data Mhs!A1:E").getValues();
          for (var i = 0; i < mhsTable.length; i++) {
            if(mhsTable[i][0]==msg.text) {
              tg.sendMsg(msg, "🧑‍🎓 Data diri kamu\n\nNIM: " + mhsTable[i][0] + "\nNama: " + mhsTable[i][1] + "\nJenis Kelamin: " + mhsTable[i][2] + "\nProgram Studi: " + mhsTable[i][3] + "\nNomor Handphone: " + mhsTable[i][4])


              var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
              for (var j = 0; j < rows.length; j++) {
                if(rows[j][0]==msg.chat.id) {
                  if (rows[j][1] == 0){
                    var copy = rows[j]
                    var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                    sheet.deleteRow(j+1)
                    sheet.appendRow([copy[0], -1, "-", mhsTable[i][0]])
                    break;
                  }
                }
              }
              var keyboard = []
              keyboard[0] = [
                tg.button.text("Iya", 'iya_nim')
              ]
              keyboard[1] = [
                tg.button.text('Tidak', 'tidak_nim')
              ]
              return tg.sendMsgKeyboardInline(msg, "Apakah data kamu benar?", keyboard, 'HTML')
              
              // return tg.sendMsg(msg, "Apakah data kamu benar?\n/iya\n/tidak")
            }
          }
          var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
          for (var i = 0; i < rows.length; i++) {
            if(rows[i][0]==msg.chat.id) {
              if (rows[i][1] == 0){
                var copy = rows[i]
                var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                sheet.deleteRow(i+1)
                break;
              }
            }
          }
          return tg.sendMsg(msg, "Data tidak ditemukan, coba cek lagi. Ketik \"/lapor\" untuk mencoba lagi")
        }
        
        else if (rows[i][1] == "-2") {
          var newData = msg.text.split(";")
          var mhsTable = SpreadsheetApp.openById(ssId).getRange("Data Mhs!A1:E").getValues();
          for (var i = 0; i < mhsTable.length; i++) {
            if(mhsTable[i][0]==newData[0]) {
              var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Data Mhs')
              sheet.deleteRow(i+1)
              newData[4] = "'"+newData[4];
              sheet.appendRow(newData)
              var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
              for (var i = 0; i < rows.length; i++) {
                if(rows[i][0]==msg.chat.id) {
                  if (rows[i][1] == -2){
                    var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                    sheet.deleteRow(i+1)
                    break;
                  }
                }
              }
              return tg.sendMsg(msg, "Data diri berhasil diperbarui!")
            }
          }
        }
        else if (rows[i][1] == "-10") {
          return prosesAwalLapor(update, rows[i][3])
        }
        else if (rows[i][1] == "-20") {
          var mhsTable = SpreadsheetApp.openById(ssId).getRange("Data Mhs!A1:E").getValues();
          for (var i = 0; i < mhsTable.length; i++) {
            if(mhsTable[i][0]==msg.text) {
              tg.sendMsg(msg, "🧑‍🎓 Data diri kamu\n\nNIM: " + mhsTable[i][0] + "\nNama: " + mhsTable[i][1] + "\nJenis Kelamin: " + mhsTable[i][2] + "\nProgram Studi: " + mhsTable[i][3] + "\nNomor Handphone: " + mhsTable[i][4])


              var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
              for (var j = 0; j < rows.length; j++) {
                if(rows[j][0]==msg.chat.id) {
                  if (rows[j][1] == "-20"){
                    var copy = rows[j]
                    var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                    sheet.deleteRow(j+1)
                    sheet.appendRow([copy[0], -21, "-", mhsTable[i][0]])
                    sheet.appendRow([adminBot, -22, "-", msg.chat.id])
                    break;
                  }
                }
              }

              
              tg.sendMsg(msg, "📱 Kamu akan segera terhubung dengan admin!")
              return tg.sendMessage(adminBot, "Scheduling dengan " + msg.from.first_name + "\n\nKetik \/balas untuk membalas")
            }
          }
          var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
          for (var i = 0; i < rows.length; i++) {
            if(rows[i][0]==msg.chat.id) {
              if (rows[i][1] == 0){
                var copy = rows[i]
                var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                sheet.deleteRow(i+1)
                break;
              }
            }
          }
          return tg.sendMsg(msg, "Data tidak ditemukan, coba cek lagi. Ketik \"/lapor\" untuk mencoba lagi")
        }
        else if (rows[i][1] == "-21") {
          if(msg.text != "/disconnect") {
            return tg.sendMessage(adminBot, msg.text)
          }
          else if (msg.text == "/disconnect") {
            tg.sendMessage(adminBot, msg.from.first_name+" keluar dari chat!")
            tg.sendMsg(msg, "Kamu keluar dari chat!")
            var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
            for (var i = 0; i < rows.length; i++) {
              if(rows[i][0]== adminBot) {
                if (rows[i][1] == "-23"){
                  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                  sheet.deleteRow(i+1)
                }
              }
            }
            for (var i = 0; i < rows.length; i++) {
              if (rows[i][0] == msg.chat.id) {
                if (rows[i][1] == "-21"){
                  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                  sheet.deleteRow(i+1)
                }
              }
            }
          }
        }
        else if (rows[i][1] == "-22") {
          if (msg.text == "/balas") {
            var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
            for (var i = 0; i < rows.length; i++) {
              if(rows[i][0]==msg.chat.id) {
                if (rows[i][1] == "-22"){
                  var copy = rows[i]
                  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                  sheet.deleteRow(i+1)
                  sheet.appendRow([adminBot, -23, "-", copy[3]])
                  tg.sendMessage(copy[3], "Sudah terhubung dengan admin " + msg.from.first_name + ". Ketik /disconnect untuk keluar chat")
                }
              }
            }
            
            
            return tg.sendMsg(msg, "Sudah terhubung! /disconnect untuk keluar chat")
          }
        }
        else if (rows[i][1] == "-23") {
          if(msg.text != "/disconnect") {
            return tg.sendMessage(rows[i][3], msg.text)
          }
          else if (msg.text == "/disconnect") {
            tg.sendMessage(rows[i][3], "Admin keluar dari chat!")
            tg.sendMsg(msg, "Kamu keluar dari chat!")
            var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
            for (var i = 0; i < rows.length; i++) {
              if(rows[i][0]==adminBot) {
                
                for (var j = 0; j < rows.length; j++) {
                  if (rows[j][0] == rows[i][3]) {
                    if (rows[j][1] == "-21"){
                      var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                      sheet.deleteRow(j+1)
                      sheet.deleteRow(i)
                    }
                  }
                }
                
              }
            }
            for (var i = 0; i < rows.length; i++) {
              if(rows[i][0]== msg.chat.id) {
                if (rows[i][1] == "-23"){
                  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                  sheet.deleteRow(i+1)
                }
              }
            }
            
          }
        }
        else if (rows[i][1] == "-25") {
          if (msg.text == "/setuju") {
            var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
            for (var i = 0; i < rows.length; i++) {
              if(rows[i][0]==msg.chat.id) {
                if (rows[i][1] == "-25"){

                  var search = SpreadsheetApp.openById(ssId).getRange("Laporan!A1:J").getValues();
                  for (var j = 0; j < search.length; j++) {
                    if(search[j][0]==rows[i][2]) {
                      var copy = search[j]
                      var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Laporan')
                      sheet.deleteRow(j+1)
                      copy[9] = "Sudah terkonfirmasi"
                      sheet.appendRow(copy)
                    }
                  }

                  var copy = rows[i]
                  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                  sheet.deleteRow(i+1)


                  return tg.sendMsg(msg, "Terima kasih telah mengkonfirmasi laporan ini")
                }
              }
            }
          }
          else if (msg.text == "/tidak") {
            var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
            for (var i = 0; i < rows.length; i++) {
              if(rows[i][0]==msg.chat.id) {
                if (rows[i][1] == "-25"){

                  var copy = rows[i]
                  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                  sheet.deleteRow(i+1)

                  return tg.sendMsg(msg, "Terima kasih telah mengkonfirmasi laporan ini. Gunakan menu /scheduling untuk menjadwalkan ulang pertemuan")
                }
              }
            }
          }
        }
        else {
          try {
            prosesLapor(update, rows[i][1], rows[i][2]);
          }
          catch (e) {
            tg.sendMessage(adminBot, e.message);
          }
          return; 
        }
      }
    }
  }
  

  try {
    if (debug) return tg.sendMessage(adminBot, JSON.stringify(update, null, 2))
    
    prosesPesan(update)
  } catch (e) {
    tg.sendMessage(adminBot, e.message)
  }
  
}

function prosesAwalLapor (update, nim) {
  var msg = update.message;
  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Laporan')
  var randIDLapor = "LAPOR-"+msg.date
  sheet.appendRow([randIDLapor, nim, new Date(), msg.chat.first_name, msg.text])

  var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:D").getValues();
  for (var i = 0; i < rows.length; i++) {
    if(rows[i][0]==msg.chat.id) {
      if (rows[i][1] == -10){
        var copy = rows[i]
        var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
        sheet.deleteRow(i+1)
        sheet.appendRow([copy[0], 1, randIDLapor, copy[3]])
        return tg.sendMsg(msg, "Laporan diterima, masukkan nama pelaku!")
      }
    }
  }
  
}

function prosesLapor(update, tahap, laporID) {
  if (update.callback_query) {
    if (tahap == 2) {
      // if (msg.text != "/mahasiswa_s1" && msg.text != "/mahasiswa_s2" && msg.text != "/mahasiswa_s3" && msg.text != "/tenaga_pendidik" && msg.text != "/warga_kampus") {
      //   return tg.sendMsg(msg, "Tidak dikenali, pilih status pelaku\n\n 🧑‍🎓 /mahasiswa_s1\n 👩‍🎓 /mahasiswa_s2\n 🧑‍🔬 /mahasiswa_s3\n 🧑‍🏫 /tenaga_pendidik\n 👯/warga_kampus")
      // }
      // else {
        
      // }
      var cb = update.callback_query
      var msg = update.callback_query.message
      
      var search = SpreadsheetApp.openById(ssId).getRange("Laporan!A1:F").getValues();
      for (var i = 0; i < search.length; i++) {
        if(search[i][0]==laporID) {
          var copy = search[i]
          var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Laporan')
          sheet.deleteRow(i+1)
          // copy.append(msg.text)
          var status = ""
          if (/mhs_s1/i.exec(cb.data)) {
            status = "Mahasiswa S1"
          }
          else if (/mhs_s2/i.exec(cb.data)) {
            status = "Mahasiswa S2"
          }
          else if (/mhs_s3/i.exec(cb.data)) {
            status = "Mahasiswa S3"
          }
          else if (/tenaga_pendidik/i.exec(cb.data)) {
            status = "Tenaga Pendidik"
          }
          else if (/warga_kampus/i.exec(cb.data)) {
            status = "Warga Kampus"
          }
          sheet.appendRow(copy.concat(status))
          
          
          var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:C").getValues();
          for (var i = 0; i < rows.length; i++) {
            if(rows[i][0]==msg.chat.id) {
              if (rows[i][1] == 2){
                var copy = rows[i]
                var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                sheet.deleteRow(i+1)
                sheet.appendRow([copy[0], 3, laporID])
              }
            }
          }

          tg.sendMsg(msg, "Status pelaku sudah diterima!")
          return tg.sendMsg(msg, "Upload gambar bukti (jika ada). Jika tidak ada gambar, /submit untuk menyelesaikan proses laporan")
        }
      }

    }
  }
  if (update.message) {
    var msg = update.message;

    if (tahap == 1) {
      var search = SpreadsheetApp.openById(ssId).getRange("Laporan!A1:E").getValues();
      for (var i = 0; i < search.length; i++) {
        if(search[i][0]==laporID) {
          var copy = search[i]
          var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Laporan')
          sheet.deleteRow(i+1)
          sheet.appendRow(copy.concat(msg.text))
          
          
          var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:C").getValues();
          for (var i = 0; i < rows.length; i++) {
            if(rows[i][0]==msg.chat.id) {
              if (rows[i][1] == 1){
                var copy = rows[i]
                var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                sheet.deleteRow(i+1)
                sheet.appendRow([copy[0], 2, laporID])
              }
            }
          }

          var keyboard = []
          keyboard[0] = [
            tg.button.text("🧑‍🎓 Mahasiswa S1", 'mhs_s1'),
            tg.button.text("👩‍🎓 Mahasiswa S2", 'mhs_s2'),
          ]
          keyboard[1] = [
            tg.button.text("🧑‍🔬 Mahasiswa S3", 'mhs_s3'),
            tg.button.text("🧑‍🏫 Tenaga Pendidik", 'tenaga_pendidik'),
          ]
          keyboard[2] = [
            tg.button.text("🧑‍🔬 Warga Kampus", 'warga_kampus')
          ]
          return tg.sendMsgKeyboardInline(msg, "Nama Pelaku diterima!\n\nPilih status pelaku!", keyboard, 'HTML')

          // tg.sendMsg(msg, "Nama Pelaku diterima!")
          // return tg.sendMsg(msg, "Pilih status pelaku\n\n 🧑‍🎓 /mahasiswa_s1\n 👩‍🎓 /mahasiswa_s2\n 🧑‍🔬 /mahasiswa_s3\n 🧑‍🏫 /tenaga_pendidik\n 👯/warga_kampus")
        }
      }
    }
    else if (tahap == 2) {
      if (msg.text != "/mahasiswa_s1" && msg.text != "/mahasiswa_s2" && msg.text != "/mahasiswa_s3" && msg.text != "/tenaga_pendidik" && msg.text != "/warga_kampus") {
        return tg.sendMsg(msg, "Tidak dikenali, pilih status pelaku\n\n 🧑‍🎓 /mahasiswa_s1\n 👩‍🎓 /mahasiswa_s2\n 🧑‍🔬 /mahasiswa_s3\n 🧑‍🏫 /tenaga_pendidik\n 👯/warga_kampus")
      }
      else {
        var search = SpreadsheetApp.openById(ssId).getRange("Laporan!A1:F").getValues();
        for (var i = 0; i < search.length; i++) {
          if(search[i][0]==laporID) {
            var copy = search[i]
            var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Laporan')
            sheet.deleteRow(i+1)
            // copy.append(msg.text)
            var status = ""
            if (msg.text == "/mahasiswa_s1") {
              status = "Mahasiswa S1"
            }
            else if (msg.text == "/mahasiswa_s2") {
              status = "Mahasiswa S2"
            }
            else if (msg.text == "/mahasiswa_s3") {
              status = "Mahasiswa S3"
            }
            else if (msg.text == "/tenaga_pendidik") {
              status = "Tenaga Pendidik"
            }
            else if (msg.text == "/warga_kampus") {
              status = "Warga Kampus"
            }
            sheet.appendRow(copy.concat(status))
            
            
            var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:C").getValues();
            for (var i = 0; i < rows.length; i++) {
              if(rows[i][0]==msg.chat.id) {
                if (rows[i][1] == 2){
                  var copy = rows[i]
                  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                  sheet.deleteRow(i+1)
                  sheet.appendRow([copy[0], 3, laporID])
                }
              }
            }

            tg.sendMsg(msg, "Status pelaku sudah diterima!")
            return tg.sendMsg(msg, "Upload gambar bukti (jika ada). Jika tidak ada gambar, /submit untuk menyelesaikan proses laporan")
          }
        }
      }
    }
    else if (tahap == 3) {
      
      if (msg.text == "/submit") {
        var search = SpreadsheetApp.openById(ssId).getRange("Laporan!A1:G").getValues();
        for (var i = 0; i < search.length; i++) {
          if(search[i][0]==laporID) {
            var copy = search[i]
            var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Laporan')
            sheet.deleteRow(i+1)
            
            sheet.appendRow(copy.concat("-", "Sedang di konfirmasi oleh admin", "Sedang di tangani"))
                        
            var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:C").getValues();
            for (var i = 0; i < rows.length; i++) {
              if(rows[i][0]==msg.chat.id) {
                if (rows[i][1] == 3){
                  var copy = rows[i]
                  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                  sheet.deleteRow(i+1)
                  // sheet.appendRow([copy[0], 3, laporID])
                }
              }
            }

            return tg.sendMsg(msg, "🚨Laporan sudah di terima!🚨\n\n🎫 ID Pelaporan: "+ laporID + "\nPantau status secara berkala dengan, /cekstatus [id laporan]. \n\n Terima Kasih telah menggunakan Bot ini.")
            
          }
        }

      }
      else if (msg.photo) {
        var search = SpreadsheetApp.openById(ssId).getRange("Laporan!A1:G").getValues();
        for (var i = 0; i < search.length; i++) {
          if(search[i][0]==laporID) {
            var copy = search[i]
            var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Laporan')
            sheet.deleteRow(i+1)
            
            sheet.appendRow(copy.concat(msg.photo[0].file_id, "Sedang di konfirmasi oleh admin", "Sedang di tangani"))
            
            
            var rows = SpreadsheetApp.openById(ssId).getRange("Bool!A1:C").getValues();
            for (var i = 0; i < rows.length; i++) {
              if(rows[i][0]==msg.chat.id) {
                if (rows[i][1] == 3){
                  var copy = rows[i]
                  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                  sheet.deleteRow(i+1)
                  // sheet.appendRow([copy[0], 3, laporID])
                }
              }
            }

            return tg.sendMsg(msg, "🚨Laporan sudah di terima!🚨\n\n🎫 ID Pelaporan: "+ laporID + "\n\nPantau status secara berkala dengan,\n/cekstatus [id laporan]. \n\n Terima Kasih telah menggunakan Bot ini.")
            
          }
        }
      }
      else if (msg.text != "/submit") {
        return tg.sendMsg(msg, "Upload gambar bukti (jika ada). Jika tidak ada gambar, /submit untuk menyelesaikan proses laporan")
      }
    }
  }
}


function prosesPesan(update) {  

  // if (update.callback_query) {
  //   // proses di halaman berikutnya, biar gak terlalu panjang     
  //   return prosesCallback(update.callback_query)
  // }


  if (update.message) { 
    var msg = update.message;
    if (msg.text) {

      var pola = /\/start/i
      if (pola.exec(msg.text)) {
        var nama = msg.from.first_name
        if (msg.from.last_name)
          nama += ' ' + msg.from.last_name
        // perhatikan, ini menggunakan sendMsg bukan sendMessage
        var pesan = "🙋Halo, <b>" + tg.util.clearHTML(nama) + "</b>, selamat datang di Bot Laporan!\n"
        pesan += ` Ada yang bisa kami bantu? Gunakan command dibawah ini!`
        pesan += "\n\n👮 Untuk melapor kasus pelecehan,"
        pesan += "\n/lapor"
        pesan += "\n\n💻 Untuk mengecek status laporan-mu,"
        pesan += "\n /cekstatus [id laporan]."
        pesan += "\n\n📞 Untuk menghubungi admin untuk merubah jadwal pertemuan,"
        pesan += "\n/scheduling"

        var keyboard = []
        keyboard[0] = [
          tg.button.text("🚨 Lapor Kasus", 'lapor_kasus')
        ]
        keyboard[1] = [
          tg.button.text('💻 Cek status laporan', 'cek_status')
        ]
        keyboard[2] = [
          tg.button.text('📱 Scheduling', 'scheduling_s')
        ]
        return tg.sendMsgKeyboardInline(msg, pesan, keyboard, 'HTML')
      }

      var pola = /^([\/!](lapor))/i
      if ( cocok = pola.exec(msg.text) ) {
        tg.sendMsg(msg, "Halo, " + msg.from.first_name + ". Selamat datang di menu lapor kasus.\n\nSilahkan ikuti langkah-langkah pelaporan kasus, pastikan data mu diisi dengan benar!")

        var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
        sheet.appendRow([msg.chat.id, 0])

        return tg.sendMsg(msg, "Masukkan NIM-mu!")
      }

      var pola = /^([\/!](cekstatus))/i
      if ( cocok = pola.exec(msg.text) ) {
        var pesan = msg.text.replace(cocok[1], '')
        
        pesan = pesan.trim()
        
        if (pesan.length<1) {
          return tg.sendMsg(msg, "😣 Tidak ada ID Laporan yang diterima. Tulis ID di samping command \"/ceklstatus\" [ID Laporan]\n\nContoh: /cekstatus LAPOR-3921213")
        }

        var search = SpreadsheetApp.openById(ssId).getRange("Laporan!A1:J").getValues();
        for (var i = 0; i < search.length; i++) {
          if(search[i][0] == pesan) {
            if (search[i][9] == "Sedang di tangani") {
              var mhsTable = SpreadsheetApp.openById(ssId).getRange("Data Mhs!A1:E").getValues();
              for (var j = 0; j < mhsTable.length; j++) {
                if(mhsTable[j][0] == search[i][1]) {
                  tg.sendMsg(msg, "Berikut status laporan dengan ID Laporan " + pesan + "\n\nTanggal Lapor: " + search[i][2] + "\nUsername: " + search[i][3] + "\nNIM: " + search[i][1] + "\nNama: " + mhsTable[j][1] + "\nJenis Kelamin: " + mhsTable[j][2] + "\nProgram Studi: " + mhsTable[j][3] + "\nNomor Handphone: " + mhsTable[j][4] + "\nKasus Laporan: " + search[i][4] + "\nNama pelaku: " + search[i][5] + "\nStatus pelaku: " + search[i][6] + "\nTempat dan Tanggal Pertemuan: " + search[i][8] + "\n\nStatus Laporan: " + search[i][9])

                  if (search[i][7] != "-") {
                    return tg.sendPhoto(msg.chat.id, search[i][7]);
                  }
                  else {
                    return ;
                  }
                }
              }
              return;
            }
            else if (search[i][9] == "Sudah selesai") {
              var mhsTable = SpreadsheetApp.openById(ssId).getRange("Data Mhs!A1:E").getValues();
              for (var j = 0; j < mhsTable.length; j++) {
                if(mhsTable[j][0] == search[i][1]) {
                  tg.sendMsg(msg, "Berikut status laporan dengan ID Laporan " + pesan + "\n\nTanggal Lapor: " + search[i][2] + "\nUsername: " + search[i][3] + "\nNIM: " + search[i][1] + "\nNama: " + mhsTable[j][1] + "\nJenis Kelamin: " + mhsTable[j][2] + "\nProgram Studi: " + mhsTable[j][3] + "\nNomor Handphone: " + mhsTable[j][4] + "\nKasus Laporan: " + search[i][4] + "\nNama pelaku: " + search[i][5] + "\nStatus pelaku: " + search[i][6] + "\nTempat dan Tanggal Pertemuan: " + search[i][8] + "\n\nStatus Laporan: " + search[i][9])

                  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
                  sheet.appendRow([msg.chat.id, -25, pesan])

                  if (search[i][7] != "-") {
                    tg.sendPhoto(msg.chat.id, search[i][7]);
                    var keyboard = []
                    keyboard[0] = [
                      tg.button.text("Selesai", 'setuju_status')
                    ]
                    keyboard[1] = [
                      tg.button.text('Belum selesai', 'tidak_status')
                    ]
                    return tg.sendMsgKeyboardInline(msg, "✅ Laporan mu telah selesai di proses.\n\nSilahkan konfirmasi", keyboard, 'HTML')
                    // return tg.sendMsg(msg, "✅ Laporan mu telah selesai di proses.\n\nSilahkan konfirmasi menggunakan command berikut:\n\n/setuju\n/tidak");
                  }
                  else {
                    var keyboard = []
                    keyboard[0] = [
                      tg.button.text("Selesai", 'setuju_status')
                    ]
                    keyboard[1] = [
                      tg.button.text('Belum selesai', 'tidak_status')
                    ]
                    return tg.sendMsgKeyboardInline(msg, "✅ Laporan mu telah selesai di proses.\n\nSilahkan konfirmasi", keyboard, 'HTML')
                  }
                }
              }
            }
            else {
              var mhsTable = SpreadsheetApp.openById(ssId).getRange("Data Mhs!A1:E").getValues();
              for (var j = 0; j < mhsTable.length; j++) {
                if(mhsTable[j][0] == search[i][1]) {
                  return tg.sendMsg(msg, "✅ Laporan Sudah Terkonfirmasi ✅\n\nBerikut status laporan dengan ID Laporan " + pesan + "\n\nTanggal Lapor: " + search[i][2] + "\nUsername: " + search[i][3] + "\nNIM: " + search[i][1] + "\nNama: " + mhsTable[j][1] + "\nJenis Kelamin: " + mhsTable[j][2] + "\nProgram Studi: " + mhsTable[j][3] + "\nNomor Handphone: " + mhsTable[j][4] + "\nKasus Laporan: " + search[i][4] + "\nNama pelaku: " + search[i][5] + "\nStatus pelaku: " + search[i][6] + "\nTempat dan Tanggal Pertemuan: " + search[i][8] + "\n\nStatus Laporan: " + search[i][9])

                }
              }
            }
          }
        }
        return tg.sendMsg(msg, "😣 Tidak ada ID Laporan yang ditemukan. Coba cek kembali")
      }


      var pola = /\/scheduling/i
      if (pola.exec(msg.text)) {
        tg.sendMsg(msg, "Halo, " + msg.from.first_name + ". Selamat datang di menu scheduling.\n\nKamu akan terhubung dengan admin kami untuk proses scheduling pertemuan!")

        var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Bool')
        sheet.appendRow([msg.chat.id, -20])

        return tg.sendMsg(msg, "Masukkan NIM-mu!")
      }
      

      

      
      
      var pola = /^([\/!](admin))/i
      if ( cocok = pola.exec(msg.text) ) {
        if (msg.chat.id == adminBot) {
          var pesan = msg.text.replace(cocok[1], '')
        
          pesan = pesan.trim()
          if (pesan.length<1) {
            return tg.sendMsg(msg, "😣 Tidak ada id gambar, masukkan lagi, /admin [id-gambar]")
          }

          return tg.sendPhoto(msg.chat.id, pesan);
        }
      }

      return tg.sendMsg(msg, "😢 Maaf saya belum mengerti maksudnya, ketik /start untuk melihat apa yang bot ini bisa lakukan")

    }
  }

  
}

// masukkan TOKEN BOT dari BOT Father
const token = '6403981003:AAGkPmQ-8kDsTMSFAwUSrOTvT8hBx3gQJAY'

const tg = new telegram.daftar(token)

// masukkan ID kamu, jika belum tau cek di @strukturbot
const adminBot = 1683238396

const debug = false

function getMe(){
  let me = tg.getMe()
  return Logger.log(me)
}

  function setWebhook() {
    var url = "34.101.67.34"
    var r = tg.setWebhook(url)
    return Logger.log(r)
  }

function getWebhookInfo() {
  let hasil = tg.getWebhookInfo()
  return Logger.log(hasil)
}

function deleteWebhook() {
  let hasil = tg.deleteWebhook()
  return Logger.log(hasil)
  
}



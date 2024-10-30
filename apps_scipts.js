// BOT'S FUNDAMENTAL VARIABLES 
const token = "9999999999:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // obtained from Telegram's BotFather
const telegramUrl = "https://api.telegram.org/bot" + token;
const webappUrl = "https://script.google.com/macros/s/AAAAAAAAAAAAAAAAAA-BBBBBBBBBBBBBBBBBBBB-CCCCCCCCCCCCCCCCCCCCCCC-DDDDDDDDDD/exec"; // must be updated at every Deploy

// SPREADSHEET VARIABLES
const ssId = "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ";
const sheet = SpreadsheetApp.openById(ssId).getSheetByName("Birthdays");

// BOT ACTIONS
function setWebhook() {  // must be executed at every Deploy
  const url = telegramUrl + "/setWebhook?url=" + webappUrl;
  const response = UrlFetchApp.fetch(url);
}

function sendMessage(userId, text) {
  const data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(userId),
      text: text,
      parse_mode: "Markdown" // or "HTML"
    }
  };
  const url = telegramUrl + '/'
  const response = UrlFetchApp.fetch(url, data);
}

// YEAR ALIGMENT
function updateCellYear(currentYear, cellDateValue, row) {
  const cellDate = new Date(cellDateValue);
  const cellYear = String(cellDate.getFullYear());
  if (cellYear != currentYear) {
    cellDate.setFullYear(currentYear);
    sheet.getRange(row, 2).setValue(cellDate);
  }
  return cellDate
}

function checkBirthday() {
  const dataRange = sheet.getDataRange();
  const allRowsList = dataRange.getValues();
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const currentYear = String(currentDate.getFullYear());
  const nextWeekDate = new Date();
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);
  nextWeekDate.setFullYear(currentYear); // for last week of the year
  nextWeekDate.setHours(0, 0, 0, 0);
  Logger.log(nextWeekDate)
  for (let i = 1; i < allRowsList.length; i++) {
    const cellDateValue = allRowsList[i][1];
    if (cellDateValue) {
      date = updateCellYear(currentYear, cellDateValue, i+1)
      if (date.getTime() === currentDate.getTime()) {
        const celebtrated = allRowsList[i][0];
        const birthYear = allRowsList[i][2];
        if (birthYear) {
          age = currentYear - birthYear
          sendMessage(000000000, "Today " + celebtrated + " turns " + age +  "!")
        } else {
          sendMessage(000000000, "Today " + celebtrated + " celebtrates the birthday!")
        }
      } else if (date.getTime() === nextWeekDate.getTime() && allRowsList[i][3] != "Business") {
        celebtrated = allRowsList[i][0];
        sendMessage(000000000, " Next Week " + celebtrated + "  has their birthday")
      }
    }
  }
}
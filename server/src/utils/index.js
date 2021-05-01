const fs = require("fs");
const http = require("http");
const https = require("https");
const sharp = require("sharp");

function commonPropertiesPercent(target, obj) {
  if (!target || !obj) return 0;
  const targetSize = target.length;
  const objSize = obj.length;
  const cross = new Set([...target, ...obj]);
  const crossSize = cross.size;
  return Number(((Math.abs(crossSize - objSize - targetSize) / targetSize) * 100).toFixed(0));
}

function formatSessionDate(date) {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();
  return `${dd < 10 ? "0" : ""}${dd}-${mm < 10 ? "0" : ""}${mm}-${yyyy}`;
}

function transformDaySessionToWeekSession(session) {
  const sessionSplit = session.split("-");
  const date = new Date(sessionSplit[2], sessionSplit[1] - 1, sessionSplit[0]);
  return formatSessionWeek(date);
}

function formatSessionHour(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  return `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}`;
}

function formatSessionWeek(date) {
  const w = getWeekNumber(date);
  const yyyy = date.getFullYear();
  return `${w}-${yyyy}`;
}

function formatSessionPrevWeek(date) {
  const w = getWeekNumber(date) - 1;
  const yyyy = date.getFullYear();
  return `${w}-${yyyy}`;
}

function getWeekNumber(date) {
  const dayNum = date.getDay() || 7;
  date.setDate(date.getDate() + 4 - dayNum);
  const yearStart = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
}

async function downloadFile(url, filePath) {
  if (!url || !filePath) return;
  const protocol = !url.charAt(4).localeCompare("s") ? https : http;
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    let fileInfo = null;

    const request = protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      fileInfo = {
        mime: response.headers["content-type"],
        size: parseInt(response.headers["content-length"], 10),
      };
      response.pipe(file);
    });

    // The destination stream is ended by the time it's called
    file.on("close", () => {
      convertImage(filePath);
      resolve();
    });

    request.on("error", (err) => {
      fs.unlink(filePath, () => reject(err));
    });

    file.on("error", (err) => {
      fs.unlink(filePath, () => reject(err));
    });

    request.end();
  });
}

function convertImage(filePath) {
  fs.access(filePath, (err) => {
    if (!err) {
      // file.png exist
      const newFilePath = filePath.replace(/.png/, ".webp");
      // if file.webp doesnt exist, create
      sharp(filePath).resize(300, 300).toFile(newFilePath);
    }
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

module.exports = {
  commonPropertiesPercent,
  formatSessionDate,
  formatSessionHour,
  formatSessionWeek,
  formatSessionPrevWeek,
  transformDaySessionToWeekSession,
  downloadFile,
  getWeekNumber,
  shuffleArray,
};

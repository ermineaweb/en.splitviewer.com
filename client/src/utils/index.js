function normalize(value, xMin, xMax) {
  const xNew = (value - xMin) / (xMax - xMin) + 1;
  return xNew > 25 ? 25 : xNew;
}

function getFrDay(date) {
  const equivalence = { 0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };
  return equivalence[date.getDay()];
}

function formatSessionDate(date) {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();
  return `${dd < 10 ? "0" : ""}${dd}-${mm < 10 ? "0" : ""}${mm}-${yyyy}`;
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

function shuffleArray(array) {
  if (array && array.length > 0) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
}

function kFormatter(num) {
  if (!num) return "0";
  switch (true) {
    case num > 999999:
      return Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + " M";
    case num > 999:
      return Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + " k";
    default:
      return num.toFixed(0).toString();
  }
}

function randomItemInArray(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export { formatSessionDate, formatSessionPrevWeek, getFrDay, shuffleArray, normalize, kFormatter, randomItemInArray };

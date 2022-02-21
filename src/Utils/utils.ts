import moment, { Moment } from "moment";

const durationLength = process.env.NODE_ENV === "development" ? "s" : "m";
const convertTime = (type: "m" | "s") => {
  let multiplier = 1000;
  if (type === "m") {
    multiplier *= 60;
  }
  return multiplier;
}

function checkDailyWeek(input: Moment) {

  if (input.isSame(moment(), "day")) {
    return "day"
  } else if (input.isSame(moment(), "week")) {
    return "week"
  } else {
    return "none"
  }
}

function weekOfMonth(input = moment()) {
  const firstDayOfMonth = input.clone().startOf('month');
  const firstDayOfWeek = firstDayOfMonth.clone().startOf('week');

  const offset = firstDayOfMonth.diff(firstDayOfWeek, 'days');

  return Math.ceil((input.date() + offset) / 7);
}

export {
  checkDailyWeek,
  weekOfMonth,
  durationLength,
  convertTime
}
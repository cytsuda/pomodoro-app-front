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

type HistoryFormatProps = {
  pomoArray: PomoType[];
  value: number;
}
function historyFormat({ pomoArray, value }: HistoryFormatProps) {
  let scopeHistoryDate: ScopeHistoryDateType[] = [];
  let dayPomo = 0;
  let weekPomo = 0;
  let totalDays = 0;
  let totalWeeks: string[] = [];

  pomoArray.forEach((pomo: PomoType, index: number) => {
    const check = checkDailyWeek(moment(pomo.attributes.start));
    if (check === "day") {
      dayPomo += 1;
      weekPomo += 1;
    } else if (check === "week") {
      weekPomo += 1;
    }

    if (index === 0) {
      scopeHistoryDate.push({
        day: moment(pomo.attributes.start).format('YYYY-MM-DD'),
        week: weekOfMonth(moment(pomo.attributes.start)).toString(),
        pomos: [pomo],
      });
      totalDays += 1;
      totalWeeks.push(weekOfMonth(moment(pomo.attributes.start)).toString());
    } else {
      let scopeIndex = scopeHistoryDate.findIndex((item: ScopeHistoryDateType) => item.day === moment(pomo.attributes.start).format('YYYY-MM-DD'))
      if (scopeIndex === -1) {
        scopeHistoryDate.push({
          day: moment(pomo.attributes.start).format('YYYY-MM-DD'),
          week: weekOfMonth(moment(pomo.attributes.start)).toString(),
          pomos: [pomo],
        });
        totalDays += 1;
        const weekScopeIndex = totalWeeks.findIndex((item: string) => item === weekOfMonth(moment(pomo.attributes.start)).toString());
        if (weekScopeIndex === -1) {
          totalWeeks.push(weekOfMonth(moment(pomo.attributes.start)).toString());
        }
      } else {
        scopeHistoryDate[scopeIndex].pomos.push(pomo)
      }
    }
  });
  const currentHistory: CurrentHistoryType = {
    dailyPomos: dayPomo,
    weekPomos: weekPomo,
    monthPomos: value,
    totalDays: totalDays,
    totalWeeks: totalWeeks.length,
  }
  return {
    historyArray: scopeHistoryDate,
    info: currentHistory
  }
}

export {
  historyFormat,
  checkDailyWeek,
  weekOfMonth,
  durationLength,
  convertTime
}
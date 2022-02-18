import moment, { Moment } from "moment";

const durationLength = process.env.NODE_ENV === "development" ? "s" : "m";
const convertTime = (type: "m" | "s") => {
  let multiplier = 1000;
  if (type === "m") {
    multiplier *= 60;
  }
  return multiplier;
}

type GetAllPomoUtilType = {
  array: PomoType[];
  date: Moment;
  total: number;
}
type DatePomosType = {
  date: string;
  pomos: PomoType[]
}

const getAllPomosUtil = ({ array, date, total }: GetAllPomoUtilType) => {
  let totalDays: DatePomosType[] = [];
  let totalWeeks: DatePomosType[] = [];
  array.forEach((pomo: PomoType, index: number) => {
    if (index === 0) {
      totalDays.push({
        date: moment(pomo.attributes.start).format("YYYY-MM-DDD"),
        pomos: [pomo]
      });
      totalWeeks.push({
        date: moment(pomo.attributes.start).format("YYYY-MM-DDD"),
        pomos: [pomo]
      });
    } else {
      // Days
      const dayIndex = totalDays.findIndex(item => moment(item.date).isSame(moment(pomo.attributes.start), "day"));
      if (dayIndex === -1) {
        totalDays.push({
          date: moment(pomo.attributes.start).format("YYYY-MM-DD"),
          pomos: [pomo]
        });
      } else {
        totalDays[dayIndex].pomos.push(pomo);
      }
      // Week
      const weekIndex = totalWeeks.findIndex(item => moment(item.date).isSame(moment(pomo.attributes.start), "week"));
      if (weekIndex === -1) {
        totalWeeks.push({
          date: moment(pomo.attributes.start).format("YYYY-MM-DD"),
          pomos: [pomo]
        });
      } else {
        totalWeeks[weekIndex].pomos.push(pomo);
      }
    }
  });

  const data = {
    month: date.format("YYYY-MM-DD"),
    pomos: array,
    dailyPomos: array.filter((item: PomoType) => moment(item.attributes.start).isSame(moment(date), "day")).length,
    numDays: totalDays.length,
    weekPomos: array.filter((item: PomoType) => moment(item.attributes.start).isSame(moment(date), "week")).length,
    numWeeks: totalWeeks.length,
    monthPomos: total,
  }
  return data;
}

export {
  getAllPomosUtil,
  durationLength,
  convertTime
}
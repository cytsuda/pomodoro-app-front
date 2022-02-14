const durationLength = process.env.NODE_ENV === "development" ? "s" : "m";
const convertTime = (type: "m" | "s") => {
  let multiplier = 1000;
  if (type === "m") {
    multiplier *= 60;
  }
  return multiplier;
}

export {
  durationLength,
  convertTime
}
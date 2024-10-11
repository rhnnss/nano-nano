export const greetings = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  if (currentHour >= 5 && currentHour < 11) {
    return "pagi";
  } else if (currentHour >= 11 && currentHour < 15) {
    return "siang";
  } else if (currentHour >= 15 && currentHour < 18) {
    return "sore";
  } else {
    return "malam";
  }
};

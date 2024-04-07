import moment from "moment";
import { Availability } from "../ListingCard/ListingCard";

export const getSpotAvailability = (availability: Availability[]) => {
  const today = moment().format("dddd");
  const currentTime = moment();
  let nextAvailable;

  for (let dayInfo of availability) {
    if (dayInfo.day === today && dayInfo.isAvailable) {
      for (let hours of dayInfo.availableHours) {
        const [start, end] = hours.split("-");
        const startTime = moment(start, "HH:mm");
        const endTime = moment(end, "HH:mm");

        if (currentTime.isBetween(startTime, endTime) || currentTime.isBefore(startTime)) {
          nextAvailable = { day: today, time: hours };
          break;
        }
      }
    }
    if (nextAvailable) break;
  }

  if (!nextAvailable) {
    for (let i = 1; i <= 7; i++) {
      const nextDay = moment().add(i, "days").format("dddd");
      const nextDayInfo = availability.find((dayInfo) => dayInfo.day === nextDay && dayInfo.isAvailable);
      if (nextDayInfo) {
        nextAvailable = { day: nextDay, time: nextDayInfo.availableHours[0] };
        break;
      }
    }
  }

  return nextAvailable;
};

export const convertToHour = (timeRange: string) => {
  const [startTime, endTime] = timeRange.split("-");

  const convertTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const isPM = hour >= 12;
    const adjustedHour = isPM ? hour - 12 : hour === 0 ? 12 : hour;
    return `${adjustedHour}:${minutes} ${isPM ? "PM" : "AM"}`;
  };

  const convertedStartTime = convertTime(startTime);
  const convertedEndTime = convertTime(endTime);
  
  return `${convertedStartTime} - ${convertedEndTime}`;
};

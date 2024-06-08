import moment from "moment";
import { Availability } from "../ListingCard/ListingCard";
import * as datefns from "date-fns";

export const getAvailabilityFromIntervals = (intervals: Interval[]): Interval | undefined => {
  for (const interval of intervals) {
    if (datefns.isBefore(Date.now(), interval.start)) {
      return interval;
    }
  }
}

export const convertToHour = (timeRange: string) => {
  const [[startHours, startMinutes], [endHours, endMinutes]] = timeRangeStrToNumbers(timeRange);
  const getAmPmString = (hour: number, minutes: number) => {
    const isPM = hour >= 12;
    const adjustedHour = isPM ? hour - 12 : hour === 0 ? 12 : hour;
    const adjustedMinutes = minutes < 10 ? `0${minutes}` : String(minutes);
    return `${adjustedHour}:${adjustedMinutes} ${isPM ? "PM" : "AM"}`;
  }
  const convertedStartTime = getAmPmString(startHours, startMinutes);
  const convertedEndTime = getAmPmString(endHours, endMinutes);
  
  return `${convertedStartTime} - ${convertedEndTime}`;
};

export const timeRangeStrToNumbers = (timeRange: string) => {
  const [startTime, endTime] = timeRange.split("-");
  const convertTime = (time: string) => {
    const [hourStr, minuteStr] = time.split(":");
    const hours = Number(hourStr);
    const minutes = Number(minuteStr);
    return [hours, minutes]
  };

  return [convertTime(startTime), convertTime(endTime)]
}

export const timeStampToStr = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`
}

export const intervalToStr = (interval: Interval) => {
  const start = timeStampToStr(interval.start.getTime());
  const end = timeStampToStr(interval.end.getTime());
  const timeRange = `${start}-${end}`;
  return convertToHour(timeRange);
}

export const truncateTitle = (city: string, state: string, length: number = 20) => {
  let fullTitle = `${city}, ${state}`;
  if (fullTitle.length > length) {
    const cityLength = city.length;
    const stateLength = state.length;
    if (cityLength >= length) {
      return `${city.slice(0, length - 2)}..`;
    } else if (cityLength + 2 <= length) {
      const remainingLength = length - cityLength - 2;
      return `${city}, ${state.slice(0, remainingLength - 2)}..`;
    } else {
      return `${city.slice(0, length - 2)}..`;
    }
  }
  return fullTitle;
};
import dayjs from "dayjs";

function isCurrentTimeWithinShift(
  shiftStartTime: string,
  shiftEndTime: string
) {
  const currentTimeStr = dayjs().format("HH:mm:ss");
  const [startHour, startMinute, startSecond] = shiftStartTime
    .split(/[:.]/)
    .map(Number);
  const [endHour, endMinute, endSecond] = shiftEndTime
    .split(/[:.]/)
    .map(Number);
  const [currentHour, currentMinute, currentSecond] = currentTimeStr
    .split(":")
    .map(Number);

  const shiftStart = dayjs()
    .set("hour", startHour)
    .set("minute", startMinute)
    .set("second", startSecond);
  // .set("millisecond", startMillisecond);
  const shiftEnd = dayjs()
    .set("hour", endHour)
    .set("minute", endMinute)
    .set("second", endSecond);
  // .set("millisecond", endMillisecond);
  const currentTime = dayjs()
    .set("hour", currentHour)
    .set("minute", currentMinute)
    .set("second", currentSecond);
  // .set("millisecond", 0);

  return currentTime.isAfter(shiftStart) && currentTime.isBefore(shiftEnd);
}

const shiftStandAndStop = (start_time: string, end_time: string) => {
  const [startHour, startMinute] = start_time!.split(/[:.]/).map(Number);

  const [endHour, endMinute] = end_time!.split(/[:.]/).map(Number);

  const shiftEnd = dayjs()
    .set("hour", endHour)
    .set("minute", endMinute)
    .format("HH:mm");

  const shiftStart = dayjs()
    .set("hour", startHour)
    .set("minute", startMinute)
    .format("HH:mm");
  return { shiftStart, shiftEnd };
};

export { isCurrentTimeWithinShift, shiftStandAndStop };

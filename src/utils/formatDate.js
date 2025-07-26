import React from "react";

export default function formatDate(datestring) {
  const padZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };
  const date = new Date(datestring);
  const formattedDate = `${date.getFullYear()}-${padZero(
    date.getMonth() + 1
  )}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(
    date.getMinutes()
  )}:${padZero(date.getSeconds())}`;
  return formattedDate;
}

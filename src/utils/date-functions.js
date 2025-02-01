export const date = (dateTime) => {
  return dateTime.split("T")[0];
};

export const hour = (dateTime) => {
  return dateTime.split("T")[1].substring(0, 5);
};

module.exports = (time) => {
  const timeZoneOffsetMilliseconds = new Date().getTimezoneOffset() * 60000;
  const localTime = new Date(time.getTime() - timeZoneOffsetMilliseconds);
  return localTime;
};

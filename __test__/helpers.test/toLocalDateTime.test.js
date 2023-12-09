// toLocalDatetime.test.js
const toLocalDatetime = require("../../helpers/toLocalDateTime");

describe("toLocalDatetime", () => {
  test("should convert UTC time to local time", () => {
    // Mock the current timezone offset for the test
    const originalTimeZoneOffset = Date.prototype.getTimezoneOffset;
    Date.prototype.getTimezoneOffset = jest.fn(() => 300); // Example offset of UTC+5:00

    // Set up a test date in UTC
    const utcTime = new Date("2023-01-01T12:00:00Z");

    // Call the function
    const localTime = toLocalDatetime(utcTime);

    // Restore the original timezone offset function
    Date.prototype.getTimezoneOffset = originalTimeZoneOffset;

    // Assert the result
    expect(localTime).toEqual(new Date("2023-01-01T17:00:00Z")); // UTC+5:00
  });

  test("should handle negative timezone offset", () => {
    // Mock the current timezone offset for the test
    const originalTimeZoneOffset = Date.prototype.getTimezoneOffset;
    Date.prototype.getTimezoneOffset = jest.fn(() => -240); // Example offset of UTC-4:00

    // Set up a test date in UTC
    const utcTime = new Date("2023-01-01T12:00:00Z");

    // Call the function
    const localTime = toLocalDatetime(utcTime);

    // Restore the original timezone offset function
    Date.prototype.getTimezoneOffset = originalTimeZoneOffset;

    // Assert the result
    expect(localTime).toEqual(new Date("2023-01-01T08:00:00Z")); // UTC-4:00
  });
});

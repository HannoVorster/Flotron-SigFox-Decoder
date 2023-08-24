function decode(loggerType, payload, analogMin, analogMax, batteryMin = 0, batteryMax = 3600) {
  let battArr = [];
  let analogArr = [];
  let digitalArr = [];

  let loggerTypeArr = loggerType.split("");

  // Loop through string to get all data
  let strCount = 0;
  while (strCount < payload.length - 1) {
    let loggerTypeChar = loggerTypeArr.shift();

    switch (loggerTypeChar) {
      // Append Battery
      case "B":
        battArr.push(parseInt(payload.substring(strCount, strCount + 4), 16));
        strCount += 4;
        break;

      case "A":
        // Append Analog
        analogArr.push(parseInt(payload.substring(strCount, strCount + 4), 16));
        strCount += 4;
        break;

      case "D":
        // Append Digital
        digitalArr.push(parseInt(payload.substring(strCount, strCount + 8), 16));
        strCount += 8;
        break;
    }

    loggerTypeArr.push(loggerTypeChar);
  }

  // Average all readings
  let battery = battArr.reduce((acc, num) => acc + num, 0) / battArr.length;
  if (battery > batteryMax) battery = batteryMax;

  let analog = analogArr.reduce((acc, num) => acc + num, 0) / analogArr.length;
  analog = ((analog - 819) / (4095 - 819)) * (20 - 4) + 4;
  analog = ((analog - 4) * (analogMax - analogMin)) / (20 - 4) + analogMin;

  let digital = digitalArr.reduce((acc, num) => acc + num, 0) / digitalArr.length;

  return {
    Battery: isNaN(battery) ? null : battery,
    Analog: isNaN(analog) ? null : analog,
    Digital: isNaN(digital) ? null : analog,
  };
}

module.exports = decode;

let sunRise_sunSetApi = "https://api.sunrisesunset.io/json?";
let latitude = 0;
let longitude = 0;
let ifterTimeDisplay=document.querySelector("#ifterTime");

window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      await getSunsetTime();
    }, (error) => {
      console.error(error);
      // Handle error gracefully
    },{ enableHighAccuracy: true });
  } else {
    // Handle case where geolocation is not supported
  }
});

let ifterTime;
let currentTime;

async function getSunsetTime() {
  let fullUrl = `${sunRise_sunSetApi}lat=${latitude}&lng=${longitude}`;
  try {
    let response = await fetch(fullUrl);
    let data = await response.json();
    ifterTimeDisplay.innerHTML=data.results.sunset; 
    ifterTime=parseTimeString(data.results.sunset);
    startAlarmCheck();
  } catch (error) {
    console.error(error);
  }
}


function parseTimeString(timeString) {
  // Split the time string by colon and AM/PM
  const [time, modifier] = timeString.split(/(?=[AP]M)/);
  let [hours, minutes, seconds] = time.split(':');

  // Convert hours to 24-hour format if necessary
  hours = (modifier === 'PM' && hours !== '12') ? parseInt(hours, 10) + 12 : hours;
  hours = (modifier === 'AM' && hours === '12') ? '00' : hours;

  // Create a new Date object with the current date and parsed time
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);

  return date;
}

function checkAlarm() {
  currentTime = new Date();
  if (currentTime.getHours() === ifterTime.getHours() &&
      currentTime.getMinutes() === ifterTime.getMinutes() &&
      currentTime.getSeconds() === ifterTime.getSeconds()) {
    document.getElementById('alarmSound').play();
  } 
  document.querySelector("#remaining").innerHTML=calculateTimeDifference(currentTime,ifterTime);
}

function startAlarmCheck() {
  setInterval(checkAlarm, 1000);
}

function calculateTimeDifference(startTime, endTime) {
  // Parse the time strings into Date objects
  var start = new Date(startTime);
  var end = new Date(endTime);

  // Calculate the difference in milliseconds
  var difference = end - start;

  // Convert milliseconds into hours, minutes, and seconds
  var hours = Math.floor(difference / 36e5),
      minutes = Math.floor((difference % 36e5) / 60000),
      seconds = Math.floor((difference % 60000) / 1000);

  return hours + '   : ' + minutes + ' : ' + seconds + '';
}

// Example usage:
var time1 = "Sat Mar 16 2024 19:13:38 GMT-0700 (Pacific Daylight Time)";
var time2 = "Sun Mar 17 2024 21:47:22 GMT-0700 (Pacific Daylight Time)";
console.log(calculateTimeDifference(time1, time2));

// for video play:
let baseUrl="https://www.youtube.com/embed/";
let currVideo=quranLearn[0];
let comUrl=`${baseUrl}${currVideo}`;
document.querySelector(".video").src=comUrl;

let sunRise_sunSetApi = "https://api.sunrisesunset.io/json?";
let latitude = 0;
let longitude = 0;
let ifterTimeDisplay=document.querySelector("#ifterTime");
let remainingTimeDisplay=  document.querySelector("#remaining");

// window.addEventListener('load', () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(async (position) => {
//       latitude = position.coords.latitude;
//       longitude = position.coords.longitude;
//       console.log(latitude);
//       console.log(longitude);
//       await getSunsetTime();
//     }, (error) => {
//       console.error(error);
//       // Handle error gracefully
//     },{ enableHighAccuracy: true });
//   } else {
//     // Handle case where geolocation is not supported
//   }
// });

// let apiURL="http://ip-api.com/json/?fields";
let apiURL="https://ipinfo.io/json?"
async function locatin(){
  let respons= await fetch(apiURL);
  let data= await respons.json();
  let loc=data.loc.split(',');
 latitude=loc[0];
 longitude=loc[1];
 console.log(latitude);
 console.log(longitude)
 getSunsetTime();
}
locatin();

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
remainingTimeDisplay.innerHTML=calculateTimeDifference(currentTime,ifterTime);
}

function startAlarmCheck() {
  setInterval(checkAlarm, 1000);
}

function calculateTimeDifference(startTime, endTime) {
  // Parse the time strings into Date objects
  var start = new Date(startTime);
  var end = new Date(endTime);

  // Calculate the difference in milliseconds
  let difference=(end-start<0)?start-end:end-start;

  // Convert milliseconds into hours, minutes, and seconds
  var hours = Math.floor(difference / 36e5),
      minutes = Math.floor((difference % 36e5) / 60000),
      seconds = Math.floor((difference % 60000) / 1000);
  if(end-start<0){
  return hours + '   : ' + minutes + ' : ' + seconds + ' min past';
  }else{
    return hours + '   : ' + minutes + ' : ' + seconds;
  }

}


// for video play:
function playVideo(currVideo) {
  let baseUrl = "https://www.youtube.com/embed/";
  let comUrl = `${baseUrl}${currVideo}?autoplay=1`;
  document.querySelector(".video").src = comUrl;
}

function playVideosSequentially(videos, index = 0) {
  if (index < videos.length) {
    playVideo(videos[index]);
    setTimeout(() => playVideosSequentially(videos, index + 1), 100000);
  }
}

// Assuming quranLearn is an array of video IDs
playVideosSequentially(quranLearn);


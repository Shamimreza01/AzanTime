let sunRise_sunSetApi = "https://api.sunrisesunset.io/json?";
let latitude = 0;
let longitude = 0;
let ifterTimeDisplay=document.querySelector("#ifterTime");
let remainingTimeDisplay=  document.querySelector("#remaining");
let location_access_btn=document.querySelector(".location");
let ifterTime;
let currentTime;
if(localStorage.getItem('latitude')!=null && localStorage.getItem('longitude')!=null){
window.addEventListener('load', function() {
  getAllTime(localStorage.getItem('latitude'), localStorage.getItem('longitude'));
  getLocationName(localStorage.getItem('latitude'), localStorage.getItem('longitude'));
});
}else{
  window.addEventListener('load',async ()=>{
    getLocation();
  })
}

function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(async (position)=>{
     let latitude=position.coords.latitude;
     let longitude=position.coords.longitude;
     localStorage.setItem("latitude",`${latitude}`);
     localStorage.setItem("longitude",`${longitude}`);
     await getAllTime(latitude,longitude);
     await getLocationName(latitude,longitude);
    },
    (error)=>{
      console.log(error);
    })
  }
}

function getCurrentTime() {
  setInterval(() => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
    let date = new Date();
    let day=date.getDate();
    let month=date.getMonth();
    let year=date.getFullYear();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    let last=(hour>=12)?'PM':'AM';
    hour=(hour>12)?hour-12:hour;
    hour=(hour===0)?12:hour;
    min=(min<10)?`0${min}`:min;
    sec=(sec<10)?`0${sec}`:sec;
    document.querySelector(".currentTime").textContent = `${hour}:${min}:${sec} ${last}`;
    document.querySelector(".englishDate").textContent =`${day} ${monthNames[month]} ${year}`;
    arabicDate();
  }, 1000);
}
window.addEventListener('load',getCurrentTime);


async function getAllTime(latitude,longitude){
  let fullUrl=`${sunRise_sunSetApi}lat=${latitude}&lng=${longitude}`
  let response=await fetch(fullUrl);
  let data=await response.json();
  console.log(data);
  document.querySelector(".sunrise").innerHTML=data.results.sunrise;
  document.querySelector(".sunset").innerHTML=data.results.sunset;
  document.querySelector(".firstLight").innerHTML=data.results.first_light;
  document.querySelector(".dhuhr").innerHTML=data.results.solar_noon;
  document.querySelector(".isha").innerHTML=data.results.last_light;
  document.querySelector(".dayLength").innerHTML=data.results.day_length;
  document.querySelector(".suhoorTime").innerHTML=data.results.first_light;
  document.querySelector(".ifterTime").innerHTML=data.results.sunset;
  ifterTime=parseTimeString(data.results.sunset);

}
function arabicDate(){
const date = new Date();
date.setDate(date.getDate() - 1);
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', calendar: 'islamic' };
let arabicDate = new Intl.DateTimeFormat('en-TN-u-ca-islamic', options).format(date);
arabicDate=arabicDate.split(',');
document.querySelector(".arabicDate").textContent=`${arabicDate[1]} ${arabicDate[2]}`;
}

async function getLocationName(latitude,longitude){
  let url=`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=4691c68537bb4dffacaac11c785ac3a0`;
  let response=await fetch(url);
  let data= await response.json();
  console.log(data.results);
  document.querySelector(".locationText").textContent=`${data.results[0].county}, ${data.results[0].city}  ${data.results[0].address_line1}`;
}

document.querySelector(".location").addEventListener('click',async()=>{
  getLocation();
})

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



// Call the function to display the Arabic date in Bangla
// Call the function to display the Arabic date in Bangla
 // Call the function to display the Arabic date in Bangla

// if(localStorage.getItem('longitude'===null && 'latutude'===null)){

// //geting the geolocation from user 
// location_access_btn.addEventListener('click', () => {
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
//   console.log("you click me");
// });

//  //let apiURL="http://ip-api.com/json/?fields";

//  //let apiURL="https://ipinfo.io/json?"
// async function locatin(){
//   let respons= await fetch(apiURL);
//   let data= await respons.json();
  
//   let loc=data.loc.split(',');
//  latitude=loc[0];
//  longitude=loc[1];
//  localStorage.setItem('latitude',`${latitude}`);
//  localStorage.setItem('longitude',`${longitude}`);
//  console.log("i am running 1st");
//  getSunsetTime();
// }
// locatin();
// }else{
//   longitude=localStorage.getItem('longitude');
//   latitude=localStorage.getItem('latitude');
//   getSunsetTime();

// async function getSunsetTime() {
//   let fullUrl = `${sunRise_sunSetApi}lat=${latitude}&lng=${longitude}`;
//   try {
//     let response = await fetch(fullUrl);
//     let data = await response.json();
//     ifterTimeDisplay.innerHTML=data.results.sunset; 
//     
//     startAlarmCheck();
//   } catch (error) {
//     console.error(error);
//   }
// }
// console.log(" i get data from local storage ");
// }

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

// function checkAlarm() {
//   currentTime = new Date();
//   if (currentTime.getHours() === ifterTime.getHours() &&
//       currentTime.getMinutes() === ifterTime.getMinutes() &&
//       currentTime.getSeconds() === ifterTime.getSeconds()) {
//     document.getElementById('alarmSound').play();
//   } 
// remainingTimeDisplay.innerHTML=calculateTimeDifference(currentTime,ifterTime);
// }

// function startAlarmCheck() {
//   setInterval(checkAlarm, 1000);
// }

// function calculateTimeDifference(startTime, endTime) {
//   // Parse the time strings into Date objects
//   var start = new Date(startTime);
//   var end = new Date(endTime);

//   // Calculate the difference in milliseconds
//   let difference=(end-start<0)?start-end:end-start;

//   // Convert milliseconds into hours, minutes, and seconds
//   var hours = Math.floor(difference / 36e5),
//       minutes = Math.floor((difference % 36e5) / 60000),
//       seconds = Math.floor((difference % 60000) / 1000);
//   if(end-start<0){
//   return hours + '   : ' + minutes + ' : ' + seconds + ' min past';
//   }else{
//     return hours + '   : ' + minutes + ' : ' + seconds;
//   }

// }


// // for video play:
// function playVideo(currVideo) {
//   let baseUrl = "https://www.youtube.com/embed/";
//   let comUrl = `${baseUrl}${currVideo}?autoplay=1`;
//   document.querySelector(".video").src = comUrl;
// }

// function playVideosSequentially(videos, index = 0) {
//   if (index < videos.length) {
//     playVideo(videos[index]);
//     setTimeout(() => playVideosSequentially(videos, index + 1), 1000000);
//   }
// }

// // Assuming quranLearn is an array of video IDs
// playVideosSequentially(quranLearn);





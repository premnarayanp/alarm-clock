var hourBtn = document.getElementById('hour');
var minuteBtn = document.getElementById('minute');
var secondBtn = document.getElementById('second');
var am_pmBtn = document.getElementById('am-pm');

var hourList = document.getElementById('hour-list');
var minuteList = document.getElementById('minute-list');
var secondList = document.getElementById('second-list');
var AM_PMList = document.getElementById('am-pm-list');

const currentTimeTag = document.getElementById('current-time');

var timeList = document.getElementsByClassName('timeList');

var ringAudio = new Audio('./assets/alarmRing.mp3');

const alarmsKey = '_myAlarms_';

var alarmList = [];
//var alarmList={ hour: 0, minute: 0,second: 0, am_pm: '', alarmOnTime: 0, alarmId: '12345'}

// get current time in hour,minutes,second and AM or PM
function getCurrentTime() {
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let am_pm = (hour >= 12 && hour < 24) ? 'PM' : 'AM';
    //console.log(date.getDate());

    hour = (hour > 12) ? hour - 12 : hour;
    if (hour == 0) {
        hour = 12;
    }
    // console.log(hour + " " + minute + " " + second + " " + am_pm);
    let currentTime = {
        hour: hour,
        minute: minute,
        second: second,
        am_pm: am_pm,
    };
    return currentTime;
}

// set current time in hour,minutes,second and AM or PM in web page in <h1> tag
function setCurrentTime() {
    setInterval(() => {
        let currentTime = getCurrentTime();
        //currentTimeTag.innerText = currentTime.hour + ":" + currentTime.minute + ":" + currentTime.second + ' ' + currentTime.am_pm;

        let hour = currentTime.hour;
        hour = hour < 10 ? "0" + hour : hour;
        let minute = currentTime.minute;
        minute = minute < 10 ? "0" + minute : minute;
        let second = currentTime.second;
        second = second < 10 ? "0" + second : second;
        let am_pm = currentTime.am_pm;

        currentTimeTag.innerText = hour + ":" + minute + ":" + second + ' ' + am_pm;
    }, 1000);
}
// when page load then start setCurrentTime()
setCurrentTime();
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

//================Feature-2-CreateDropDownList & pick and show during onclick==============

// clear hour,minutes ,second , am_pm picker DropdownList
function clearAnotherTimeList() {
    for (let i = 0; i < 4; i++) {
        timeList[i].innerHTML = ' ';
        timeList[i].style = 'overflow-y: none';
    }
    // OR
    // hourList.innerHTML = ' ';
    // minuteList.innerHTML = ' ';
    // secondList.innerHTML = ' ';
    // AM_PMList.innerHTML = ' ';
}

// set current picked time (second/minute/hour/AM-PM ) in current picked button from DropdownList
// means set picked alarm time
function setPickedTime(e) {
    let value = e.target.innerText;
    //console.log(value);
    //console.log(e.target.className);

    if (e.target.className == 'hour-value') {
        hourBtn.innerText = value;
    } else if (e.target.className == 'minute-value') {
        minuteBtn.innerText = value;
    } else if (e.target.className == 'second-value') {
        secondBtn.innerText = value;
    } else {
        am_pmBtn.innerText = value;
    }

    clearAnotherTimeList();
}

// create Dropdown List and 
// pick times second/minute/hour/AM or PM from DropDown List
function createDropdownList(e) {
    let currentList;
    let size;
    let target = e.target;

    if (target.id == 'hour') {
        currentList = hourList;
        size = 12;

    } else if (target.id == 'minute') {
        currentList = minuteList;
        size = 60;
    } else if (target.id == 'second') {
        currentList = secondList;
        size = 60;
    } else {
        currentList = AM_PMList;
        size = -1;
    }

    //if reClick then toggle DropDownList, don,t need to again create DropdownList & render
    if (currentList.innerHTML !== ' ') {
        currentList.innerText = ' ';
        currentList.style = 'overflow-y: none';
        return;
    }

    // close another open Dropdown list
    clearAnotherTimeList();

    //if Dropdown list have element then set scrolled
    if (size != -1) {
        currentList.style = 'overflow-y: scroll';
    }

    //create particulars  DropDown List on current target like hour,minutes ..etc
    for (var i = target.id === 'hour' ? 1 : 0; i <= size; i++) {
        let li = document.createElement('li');
        // let li = `<li></li>`;
        if (i <= 9) {
            li.innerText = "0" + i;
        } else {
            li.innerText = i;
        }
        li.setAttribute('onclick', "setPickedTime(event)");
        li.className = target.id + '-' + 'value';
        // console.log(li);
        currentList.appendChild(li);
    }

    // create AM PM list
    if (size == -1) {
        let am = document.createElement('li');
        let pm = document.createElement('li');
        am.innerText = 'AM'
        am.setAttribute('onclick', "setPickedTime(event)");
        am.className = target.id + '-' + 'value';

        pm.innerText = 'PM'
        pm.setAttribute('onclick', "setPickedTime(event)");
        pm.className = target.id + '-' + 'value';
        // console.log(am);

        currentList.appendChild(am);
        currentList.appendChild(pm);
    }

}
//Done
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

//======Feature-3-ReadyToCrateAlarm ,Fetch picked time, check uniq,uniqID==============

//generate uniq alarmId like alarms set as (02:30:50 AM) then id is "02305012"
//'02'+'30'+'50'+'12'="02305012"
function getUniQId(hour, minute, second, am_pm) {
    // console.log("...alarm in uniq", alarm)
    let alarmId = hour.toString() + minute.toString() + second.toString();
    alarmId += am_pm === 'AM' ? 12 : 24;
    return alarmId;
}


//if we create same times alarm and within 60 second range again  then show alert and return
//because no sense for more then 1 alarms for same time or within 60 second range
function checkAlarmExist(alarmID, hour, minute, second, am_pm) {
    let size = alarmList.length;
    if (size == 0) {
        return {
            isExist: false,
            isValidGap: true
        };
    }
    //check alarm on basis alarmId
    for (let i = 0; i < size; i++) {
        let alarm = alarmList[i];
        //if(alarm.am_pm==am_pm && alarm.hour==alarm.hour && alarm.minute==minute){
        if (alarm.alarmID == alarmID) {
            return {
                isExist: true,
                isValidGap: false,
            };
        } else if (alarm.am_pm == am_pm && alarm.hour == hour) {
            let totalSecond1 = minute * 60 + second;
            let totalSecond2 = alarm.minute * 60 + alarm.second;

            let diff = totalSecond1 > totalSecond2 ? (totalSecond1 - totalSecond2) : totalSecond2 - totalSecond1;

            if (diff < 60) {
                return { isExist: false, isValidGap: false, alarm: alarm, diff: diff }
            }
        }
    }

    return { isExist: false, isValidGap: true }
}

//init points for alarm to create
//fetch picked time hour/minute/second/AM/PM  from..
function readyToCreateAlarm() {
    let hour = parseInt(hourBtn.innerText);
    let minute = parseInt(minuteBtn.innerText);
    let second = parseInt(secondBtn.innerText);
    let am_pm = am_pmBtn.innerText;
    //console.log(hour,minute,second,am_pm);

    const alarmID = getUniQId(hour, minute, second, am_pm);

    // don,t create more then 1 alarm and within 60 second/1 minutes  
    let checkAlarm = checkAlarmExist(alarmID, hour, minute, second, am_pm);
    // console.log("checkAlarm=", checkAlarm);
    if (checkAlarm.isExist) {
        alert('Alarm already exist');
    } else {
        if (checkAlarm.isValidGap) {
            let isUpdateIndex = -1;
            setAlarm(hour, minute, second, am_pm, alarmID, isUpdateIndex);
        } else {
            let alarm = checkAlarm.alarm;
            alert(`Already Exist alarm:[${alarm.hour}:${alarm.minute}:${alarm.second} ${alarm.am_pm}] in 60 second range And diff is:${checkAlarm.diff} Second`);
        }
    }
}

//======Feature-4- find alarmOnTime for setAlarm using getTimeInSecond and getAlarmOnTime ==========
//convert hour+minutes+second into seconds
function getTimeInSecond(hour, minute, second, ) {
    let totalTime = 0;
    totalTime += hour * 60 * 60;
    totalTime += minute * 60;
    totalTime += second;
    return totalTime;
}

// fined alarmOnTime means time gap between current time and alarm set time
//that find time for delay setTimeOut(), which time alarms need to play
function getAlarmOnTime(pickedTimeInSecond, am_pm) {
    let alarmOnTime = 0;
    let currentTime = getCurrentTime();
    let currentTimeInSecond = getTimeInSecond(currentTime.hour, currentTime.minute, currentTime.second);


    if (currentTime.am_pm === am_pm) {
        if (pickedTimeInSecond < currentTimeInSecond) {
            alarmOnTime = 24 * 60 * 60 - currentTimeInSecond - pickedTimeInSecond;
        } else {
            alarmOnTime = pickedTimeInSecond - currentTimeInSecond;
        }

    } else {
        alarmOnTime = 12 * 60 * 60 - currentTimeInSecond + pickedTimeInSecond;
    }
    return alarmOnTime;
}

// set alarm ...provide all requirement to create alarm
function setAlarm(hour, minute, second, am_pm, alarmID, isUpdateIndex) {

    let timeInSecond = getTimeInSecond(hour, minute, second);
    let alarmOnTime = getAlarmOnTime(timeInSecond, am_pm);
    let alarmOnTimeInMS = alarmOnTime * 1000;
    //console.log(alarmOnTime);

    createAlarm({ hour, minute, second, am_pm, alarmOnTimeInMS, alarmID }, isUpdateIndex);

    //renderAlarm(alarmList.length - 1);
    //renderAlarm(alarmID);
}

//=========Feature-5- create alarm using setTimeout=======================
//finally create alarm using setTimeout and show alert/animation & audio Ring
function createAlarm({...alarm }, isUpdateIndex) {

    let stopTimeId = setTimeout(() => {
        //alert("alarm is om..........");
        playRing(alarm.alarmID);
    }, alarm.alarmOnTimeInMS);

    alarm.stopTimeId = stopTimeId;

    //if alarm create/off then we need to create/update ,so it again alert on same time
    //but don,t need to render because already in <ul> list
    if (isUpdateIndex != -1) {
        alarmList[isUpdateIndex] = alarm;
        storeAlarmsInLocalStorage(alarmsKey, alarmList);

    } else {
        //new alarm also need render/upend in <ul> list
        alarmList.push(alarm);
        //console.log(alarmList);
        storeAlarmsInLocalStorage(alarmsKey, alarmList);
        let index = alarmList.length - 1;
        renderAlarm(index);
    }

}

//=========Feature-6- upend single alarm in <ul> and show =======================
//when alarm create then need to upend single alarm in <ul>
//function renderAlarm(alarmID, index) {
function renderAlarm(index) {
    document.getElementById('alarm-list-heading').innerText = "Alarms"
    let alarmUlList = document.getElementById('alarm-list');
    let alarm = alarmList[index];
    let li = document.createElement('li');
    const hour = alarm.hour < 10 ? '0' + alarm.hour : alarm.hour;
    const minute = alarm.minute < 10 ? '0' + alarm.minute : alarm.minute;
    const second = alarm.second < 10 ? '0' + alarm.second : alarm.second;

    li.innerHTML = `<span class="alarm-times">
                              ${hour+ ":" + minute + ":" +second +'  ' + alarm.am_pm} 
                           </span>
                           <button class="alarm-delete-btn" onclick="deleteAlarm(${index})" >Delete</button>
                        `;

    alarmUlList.appendChild(li);

    //if alarm created and size > 4 in list then ,set <u> scroll behavior as "scroll"
    if (alarmList.length > 4) {
        document.getElementById('alarm-list').style = "overflow-y:scroll";
    }
}


//======Feature-7- delete alarm From list by renderListOfAlarm() and also clearSetTimeOut()=========
//when alarm delete then need to render all Alarms in <ul> where index of alarm also change

function renderListOfAlarm(alarmList) {
    let alarmUlList = document.getElementById('alarm-list');
    alarmUlList.innerHTML = "";

    //if alarm deleted/render  and size <= 4 in list then ,set <u> scroll behavior none/scroll
    if (alarmList.length <= 4) {
        document.getElementById('alarm-list').style = "overflow-y: none";
    } else if (alarmList.length > 4) {
        document.getElementById('alarm-list').style = "overflow-y:scroll";
    }

    alarmList.forEach((alarm) => {
        let li = document.createElement('li');
        let index = alarmList.indexOf(alarm);
        const hour = alarm.hour < 10 ? '0' + alarm.hour : alarm.hour;
        const minute = alarm.minute < 10 ? '0' + alarm.minute : alarm.minute;
        const second = alarm.second < 10 ? '0' + alarm.second : alarm.second;

        li.innerHTML = `<span class="alarm-times">
        ${hour+ ":" + minute + ":" +second +'  ' + alarm.am_pm}  
                               </span>
                               <button class="alarm-delete-btn" onclick="deleteAlarm(${index})" >Delete</button>
                             `;
        alarmUlList.appendChild(li);
    });

}

//Delete the alarm
//function deleteAlarm(alarmID) {
function deleteAlarm(index) {
    let newAlarmList = [];

    newAlarmList = alarmList.filter((alarm) => alarmList.indexOf(alarm) != index);
    // newAlarmList = alarmList.filter((alarm) => alarm.alarmID != alarmID);
    //console.log("newList", newAlarmList);

    clearTimeout(alarmList[index].stopTimeId);
    alarmList = newAlarmList;

    if (alarmList.length == 0) {
        document.getElementById('alarm-list-heading').innerText = "No Alarms"
        document.getElementById('alarm-list').innerHTML = "";
        localStorage.removeItem(alarmsKey);
        console.log("alarm key Deleted from localStorage");
        return;
    }

    storeAlarmsInLocalStorage(alarmsKey, alarmList);
    renderListOfAlarm(newAlarmList);
}




// =========Feature-8-OFF alarm after alert and Reset alarm to again fire on same time=========
// Notes:- when delete Alarm then Permanently delete but ,but after fire alarm ,it show 
// properly in list so need to reset to fire on same time again & again ,till not deleted

// function alarmOff(alarmID) {
//     console.log("Off");

//     alarmList.forEach((alarm) => {
//         if (alarm.alarmID == alarmID) {
//             index = alarmList.indexOf(alarm);
//             console.log("index=", index);
//             setAlarm(alarm.hour, alarm.minute, alarm.second, alarm.am_pm, alarm.alarmID, index);
//             return;
//         }
//     });

// }



//===Extra(Feature-8)-when Alarm on ,Show Animated OFF Button & Play/Pause Ring Audio Ringtone=======

//Play ring when Alarm is fired
//Show Animated  OFF Button 
function playRing(alarmId) {
    console.log("played");
    ringAudio.play();

    const alarmOFFBtn = document.getElementById('alarm-off-btn');
    alarmOFFBtn.style = 'display: block';

    let stopRingId = setTimeout(() => {
        alarmOff(stopRingId, alarmId);
    }, 1000 * 30);

    // if we want OFF alarm ring before 30 second ,then click on OFF btn
    alarmOFFBtn.setAttribute('onclick', `alarmOff(${stopRingId}, ${alarmId})`);

}


//===Extra(Feature-9)-alarmOff OFF alarm/pause Ring audio/close Animated Button & reset Alarm========
// Notes:- when delete Alarm then Permanently delete but ,but after fire alarm ,it show 
// properly in list so need to reset to fire on same time again & again ,till not deleted

//close ringAudio and close animation ...
function alarmOff(stopRingId, alarmID) {
    const alarmOFFBtn = document.getElementById('alarm-off-btn');
    alarmOFFBtn.style = 'display: none';
    ringAudio.pause();
    ringAudio.currentTime = 0;
    clearTimeout(stopRingId);
    console.log("paused");

    alarmList.forEach((alarm) => {
        //console.log(alarm.alarmID == alarmID);
        // after off Alarm ,recreate/reUpdate alarm, so alarm again play after 24 hour, on same time

        if (alarm.alarmID == alarmID) {
            index = alarmList.indexOf(alarm);
            console.log("index=", index);
            setAlarm(alarm.hour, alarm.minute, alarm.second, alarm.am_pm, alarm.alarmID, index);
            return;
        }
    });

    //this is mor redundant and not suitable..
    //let index=alarmList.indexOf(alarm);
    //deleteAlarm(alarmList.indexOf(alarm));
    // let hour = alarm.hour;                         
    // let minute = alarm.minute;
    // let second = alarm.second;
    // let am_pm = alarm.am_pm;

    // const index = alarmList.indexOf(alarm);
    // console.log(index);
    // deleteAlarm(index);
    // setAlarm(hour, minute, second, am_pm);
}


//Extra(Feature-10)-set alarmList in LocalStorage and get saved alarm after reloading===========
// store the list of Alarm in LocalStorage ,so after reloading we get
function storeAlarmsInLocalStorage(key, alarmList) {
    let alarmListString = JSON.stringify(alarmList);
    localStorage.setItem(key, alarmListString);
    console.log("Alarms Stored successfully");
}

// get the list of Alarm from LocalStorage ,so we get our saved Alarm
function getAlarmsFromLocalStorage(key) {
    let alarmListString = localStorage.getItem(key);
    let alarmList = JSON.parse(alarmListString);
    console.log("Alarms get successfully");
    return alarmList;
}


// create and render the list of saved Alarm that saved in LocalStorage
//because when refresh ,all alarms destroyed but alarm data also saved in localStorage
//so we need recreate the alarms using saved data/times and render it.
function recreateAndRenderAlarm() {
    let alarms = getAlarmsFromLocalStorage(alarmsKey);
    if (alarms == null) {
        document.getElementById('alarm-list-heading').innerText = "No Alarms"
        return;
    }


    let isUpdateIndex = -1;
    // there isUpdateIndex = -1; means we don't want to update,means we create new alarm and need to append in <u> list

    alarms.forEach((alarm) => {
        setAlarm(alarm.hour, alarm.minute, alarm.second, alarm.am_pm, alarm.alarmID, isUpdateIndex);
    });
    // renderListOfAlarm(alarms);

    //Notes:-
    // we Don't need to call renderListOfAlarm(), because there are two function for render alarms
    // first is renderListOfAlarm(); and second is renderAlarm();
    // renderListOfAlarm(); is needed when  we delete alarms, that rendered all alarms but
    // renderAlarm() that append single alarm in current <ul> list and 
    // called after when  alarm created,that render single alarm
    // there we iterate alarms and we just create  single-single alarm and again called renderAlarm() for Each
}


//when reload then auto called recreateAndRenderAlarm(), that create saved alarm and render in UI <ul>
recreateAndRenderAlarm();
const currentTimeTag = document.getElementById('current-time');


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
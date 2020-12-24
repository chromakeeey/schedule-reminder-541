'use strict'
const lessonToHtml = (lesson, index) => {
    const hourStart = timeToString(lesson.timeStart[0]);
    const minuteStart = timeToString(lesson.timeStart[1]);

    const hourEnd = timeToString(lesson.timeEnd[0]);
    const minuteEnd = timeToString(lesson.timeEnd[1]);

    const namesString = lessonNamesToDiv(lesson.name)

    return (
        `
        <div style="background-color: rgba(0, 0, 0, 0.2); color: white; font-weight: 900; padding-left: 5px" >${index}</div>
        <div style="border-width: 2px; border-color: black;" >
            <div style="font-weight: 500">${namesString}</div>
            <h4>${hourStart}:${minuteStart} - ${hourEnd}:${minuteEnd}</h4>
            <div style="height: 2px; background-color: rgba(0, 0, 0, 0.1); margin-bottom: 5px" ></div>
        </div>
        `
    )
} 

// dayType - destination or not
const dayToHtml = (day, dayName, dayType) => {

    let lessonsString = ``;
    let lessonIndex = 1;

    day.forEach(lesson => {
        lessonsString += lessonToHtml(lesson, lessonIndex)
        lessonIndex ++;
    })

    return (
        `<div style="float: left; margin: 3px; height: 500px" >
            <div style="border-width: 5px; border-color: black; padding: 5px; text-align: center; background-color: black; color: white; font-weight: 800" >
                ${dayName} 
                <div>(${dayType})</div>
            </div>
            <div style="border-width: 5px; border-color: black; background-color: rgba(0, 0, 0, 0.1); padding: 5px; ${shadowStyle}">
                ${lessonsString}
            </div>
        </div>
        `
    )
}

const weekToHtml = (week, dayNames, dayTypes) => {
    let html = ``
    let dayIndex = 0;

    week.forEach((day) => {
        let isLessons = (day.length != 0)
        
        if (isLessons) {
            html += dayToHtml(day, dayNames[dayIndex], dayTypes[dayIndex])
        }
        
        dayIndex ++;
    })

    return (
        `
         <style type="text/css">
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
         </style>
         <body style="width: 1300px; height: 800px; justify-content: center; display: flex; font-family: 'Montserrat', sans-serif;">
            <div style="display: flex" >
                ${html}
            </div>
         </body>
        `
    )
}

const lessonNamesToDiv = (names) => {
    let divString = ``;

    names.forEach(name => {
        divString = `${divString}<div>${name}</div>`
    });

    if (names.length === 1 ) {
        divString = `${divString}<div style="color: rgba(0, 0, 0, 0.1)"> - </div>`
    }
    

    return divString;
}

const timeToString = (time) => {
    return ((
        time >= 0 && time <= 9
        ? `0${time}`
        : time
    ))
}

const shadowStyle = '-webkit-box-shadow: 0px 0px 80px -49px rgba(0,0,0,0.75); -moz-box-shadow: 0px 0px 80px -49px rgba(0,0,0,0.75); box-shadow: 0px 0px 80px -49px rgba(0,0,0,0.75);'

module.exports = {
    lessonToHtml,
    dayToHtml,
    weekToHtml
};
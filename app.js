require('dotenv').config();


const { weekToHtml } = require('./src/HtmlParser');

const TelegramBot = require('node-telegram-bot-api');
const nodeHtmlToImage = require('node-html-to-image');
const fileScript = require('fs')

const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true})

const groupLesson = (name, group) => {
    return `${name} (${group} п/гр.)`
}

const names = {
    web: 'Web-технології',
    net: '.NET',
    db: 'Осн. проект. розподіл. баз. даних',
    lan: 'Організація комп\'ютерних мереж',
    met: 'Чисельні методи',
    engsoft: 'Конструюв. програм. забезпеч.',
    pract: 'Проектний практикум',
    mobile: 'Осн. програм. для мобіл. пристр.',
    mov: 'Фізичне виховання',
    economic: 'Економічне виховання',
    psyc: 'Етика та психолог. ділов. спілк.',
    vih: 'Виховна година'
}

const lessonsSunday = [];

// subota
const lessonsSaturday = [
    { timeStart: [8, 30], timeEnd: [9, 50], name: [names.mov] },
    { timeStart: [10, 5], timeEnd: [11, 25], name: [names.web] },
    { timeStart: [11, 40], timeEnd: [13, 0], name: [names.web] },
    { timeStart: [13, 15], timeEnd: [14, 35], name: [names.met] },
    // { timeStart: [14, 50], timeEnd: [16, 10], name: [groupLesson(names.met, 2)] },
];

const lessonsMonday = [
    // { timeStart: [8, 30], timeEnd: [9, 50], name: [groupLesson(names.mobile, 1)] },
    // { timeStart: [10, 5], timeEnd: [11, 25], name: [groupLesson(names.web, 1), groupLesson(names.net, 2)] },
    // { timeStart: [12, 0], timeEnd: [13, 20], name: [names.lan] },
    // { timeStart: [13, 35], timeEnd: [14, 55], name: [groupLesson(names.net, 1), groupLesson(names.web, 2)] },
    // { timeStart: [15, 10], timeEnd: [16, 30], name: [groupLesson(names.mobile, 2)] }
]

const lessonsTuesday = [
    { timeStart: [8, 30], timeEnd: [9, 50], name: [names.lan] },
    { timeStart: [10, 5], timeEnd: [11, 25], name: [names.psyc] },
    { timeStart: [11, 40], timeEnd: [13, 0], name: [names.db] },
    { timeStart: [13, 15], timeEnd: [14, 35], name: [names.engsoft] },
    // { timeStart: [14, 50], timeEnd: [16, 10], name: [groupLesson(names.met, 2)] },
]

const lessonsWednesday = [
    { timeStart: [8, 30], timeEnd: [9, 50], name: [groupLesson(names.engsoft, 1)] },
    { timeStart: [10, 5], timeEnd: [11, 25], name: [groupLesson(names.pract, 1), groupLesson(names.net, 1)] },
    { timeStart: [11, 40], timeEnd: [13, 0], name: [groupLesson(names.net, 1), groupLesson(names.pract, 2)] },
    { timeStart: [13, 15], timeEnd: [14, 35], name: [groupLesson(names.engsoft, 2)] },
    // { timeStart: [14, 50], timeEnd: [16, 10], name: [groupLesson(names.met, 2)] },
];

const lessonsThursday = [
    { timeStart: [8, 30], timeEnd: [9, 50], name: [groupLesson(names.engsoft, 1)] },
    { timeStart: [10, 5], timeEnd: [11, 25], name: [groupLesson(names.pract, 1), groupLesson(names.net, 1)] },
    { timeStart: [11, 40], timeEnd: [13, 0], name: [groupLesson(names.net, 1), groupLesson(names.pract, 2)] },
    { timeStart: [13, 15], timeEnd: [14, 35], name: [groupLesson(names.engsoft, 2)] },
    // { timeStart: [14, 50], timeEnd: [16, 10], name: [groupLesson(names.met, 2)] },
]

const lessonsFriday = [
    { timeStart: [8, 30], timeEnd: [9, 50], name: [groupLesson(names.mov, 1)] },
    { timeStart: [10, 5], timeEnd: [11, 25], name: [groupLesson(names.mobile, 1), groupLesson(names.engsoft, 2)] },
    { timeStart: [11, 40], timeEnd: [13, 0], name: [groupLesson(names.engsoft, 1), groupLesson(names.mobile, 2)] },
    { timeStart: [13, 15], timeEnd: [14, 35], name: [groupLesson(names.db, 1), groupLesson(names.db, 2)] },
    // { timeStart: [14, 50], timeEnd: [16, 10], name: [groupLesson(names.met, 2)] },
]

const lessons = [
    lessonsSunday, lessonsMonday, lessonsTuesday, 
    lessonsWednesday, lessonsThursday, lessonsFriday, 
    lessonsSaturday
]

const lessonsType = [ 'Відсутньо', 'Відсутньо', 'Дистанційно', 'Очно', 'Очно', 'Очно', 'Дистанційно' ]
const daysName = [ 'Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четверг', 'П\'ятниця', 'Суббота' ]
const daysNameParams = [ 'Неділю', 'Понеділок', 'Вівторок', 'Середу', 'Четверг', 'П\'ятницю', 'Субботу' ]

setInterval(() => {
    let date = new Date();
    let dayWeek = date.getDay();
    let currentDay = lessons[dayWeek];
    
    let hourNow = date.getHours();
    let minuteNow = date.getMinutes();
    let secondNow = date.getSeconds();

    if (secondNow == 0) {
        currentDay.forEach((lesson) => {

            const _hour = lesson.timeStart[0];
            const _minute = lesson.timeStart[1];

            const _hourEnd = lesson.timeEnd[0];
            const _minuteEnd = lesson.timeEnd[1];

            const isNewLesson = (hourNow == _hour && minuteNow == _minute);
            const isEndLesson = (hourNow == _hourEnd && minuteNow == _minuteEnd)

            /*
            console.log('------------------')
            console.log(`start: ${hourNow} ${minuteNow} ${secondNow}`)
            console.log(`end: ${_hour} : ${_minute} : 0`)
            console.log(`result: ${isNewLesson}`)
            console.log('------------------')
            */


            if (isNewLesson) {
                onLessonDetected(lesson)
            }

            if (isEndLesson) {
                onEndLesson(lesson)
            }
        })
    }

}, 1000)

const onEndLesson = (lesson) => {
    const localPath = `./${'chatids'}.json`;
    let chatIds;  

    fileScript.readFile(localPath, 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        
        chatIds = JSON.parse(jsonString)
        console.log(chatIds)

        let stringMessage = `✅\n*Пара закінчилась!*\n\n`;

        lesson.name.forEach((name) => {
            stringMessage = `${stringMessage}${name}`;
        })
    
        //stringMessage = `${stringMessage}\n🕐\nПочаток - _${lesson.timeStart[0]}:${lesson.timeStart[1]}_`;
        //stringMessage = `${stringMessage}\nКінець - _${lesson.timeEnd[0]}:${lesson.timeEnd[1]}_`;
    
        if (chatIds != undefined) {
            chatIds.Chats.forEach((chatId) => {
                bot.sendMessage(chatId, stringMessage, {parse_mode: "Markdown"});
            })
        }
    })
}

const isChatIdExists = (chatId, allIds) => {
    let result = false;

    allIds.Chats.forEach((id) => {
        if (chatId == id) {
            result = true;
            return;
        }
    })

    return result;
}

const addChatId = (chatId) => {
    const localPath = "./chatids.json"

    fileScript.readFile(localPath, 'utf8', (error, outputString) => {
        if (error) {
            console.log("File read failed:", error)

            const _chatIds = {
                Chats: [chatId]
            }

            writeJsonFile('chatids', _chatIds)

            return
        }

        let chatIds = JSON.parse(outputString)

        const isExists = isChatIdExists(chatId, chatIds)
        console.log(isExists)

        if (isExists) {
            console.log("ChatId already exists - ", error)
            return
        }

        chatIds.Chats.push(chatId)
        writeJsonFile('chatids', chatIds)
    })
} 

const removeChatId = (chatId) => {
    const localPath = "./chatids.json"

    fileScript.readFile(localPath, 'utf8', (error, outputString) => {
        if (error) {
            console.log("File read failed:", error)
            return
        }

        let chatIds = JSON.parse(outputString)

        chatIds.Chats = chatIds.Chats.filter(i => i != chatId)
        writeJsonFile('chatids', chatIds)
    })
}
 
const readJsonFile = (title) => {
    const localPath = `./${title}.json`;
    let _json = undefined;

    fileScript.readFile(localPath, 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        
        const json = JSON.parse(jsonString)
        console.log(json)

        _json = json;
    })

    return _json;
}

const onLessonDetected = (lesson) => {


    const localPath = `./${'chatids'}.json`;
    let chatIds;

    

    fileScript.readFile(localPath, 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        
        chatIds = JSON.parse(jsonString)
        console.log(chatIds)

        let stringMessage = `🆘\n*Пара почалась!*\n\n`;

        lesson.name.forEach((name) => {
            stringMessage = `${stringMessage}${name}\n`;
        })
    
        stringMessage = `${stringMessage}\n🕐\nПочаток - _${lesson.timeStart[0]}:${lesson.timeStart[1]}_`;
        stringMessage = `${stringMessage}\nКінець - _${lesson.timeEnd[0]}:${lesson.timeEnd[1]}_`;
    
        if (chatIds != undefined) {
            chatIds.Chats.forEach((chatId) => {
                bot.sendMessage(chatId, stringMessage, {parse_mode: "Markdown"});
            })
        }
    })
}


const writeJsonFile = (title, json) => {
    const localPath = `./${title}.json`;
    const jsonString = JSON.stringify(json)

    fileScript.writeFile(localPath, jsonString, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}

bot.on('polling_error', (error) => {
    console.log(error.code);
})

bot.on('message', (msg) => {
    
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, '✅ Оповіщення про пари: *ВКЛЮЧЕНО*', {parse_mode: 'Markdown'});
    addChatId(chatId)
});

bot.onText(/\/stop/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, '⛔️ Оповіщення про пари: *ВИКЛЮЧЕНО*', {parse_mode: 'Markdown'});
    removeChatId(chatId)
});

bot.onText(/\/now/, (msg) => {
    const chatId = msg.chat.id;

    let date = new Date();
    let dayWeek = date.getDay();
    let currentDay = lessons[dayWeek];

    let isHave = false;
    
    currentDay.forEach((lesson) => {
        const hourStart = lesson.timeStart[0];
        const minuteStart = lesson.timeStart[1];

        const hourEnd = lesson.timeEnd[0];
        const minuteEnd = lesson.timeEnd[1];

        const dateNow = new Date()
        const dateStart = new Date()
        const dateEnd = new Date()

        dateStart.setHours(hourStart)
        dateStart.setMinutes(minuteStart)
        dateStart.setSeconds(0)

        dateEnd.setHours(hourEnd)
        dateEnd.setMinutes(minuteEnd)
        dateEnd.setSeconds(0)

        //dateNow.setSeconds(0)
        
        if (dateStart <= dateNow && dateNow <= dateEnd) {
            lesson.name.forEach((name) => {
                bot.sendMessage(chatId, `🛑 У даний момент - *${name}*`, {parse_mode: 'Markdown'})
            })

            console.log('is have')
            isHave = true;
        }
    })

    if (!isHave) {
        bot.sendMessage(chatId, '✅ У даний момент пар немає!')
    }
});

const lessonToString = (lesson) => {
    let string = ``

    lesson.name.forEach((name) => {
        string = `${string}*${name}*\n`
    })

    const timeToString = (time) => {
        return ((
            time >= 0 && time <= 9
            ? `0${time}`
            : time
        ))
    }

    const hourStart = lesson.timeStart[0];
    const minuteStart = lesson.timeStart[1];

    const hourEnd = lesson.timeEnd[0];
    const minuteEnd = lesson.timeEnd[1];

    string = `${string}_${timeToString(hourStart)}:${timeToString(minuteStart)} - ${timeToString(hourEnd)}:${timeToString(minuteEnd)}_`

    return string;
}

bot.onText(/\/nextday/, (msg) => {
    const chatId = msg.chat.id;

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      }

    let date = new Date();
    date = addDays(date, 1)

    let dayWeek = date.getDay();
    let currentDay = lessons[dayWeek];

    let isDayHaveLessons = false;
    let lessonIndex = 1;

    let outputString = `\`🧾 Розклад на ${daysNameParams[dayWeek]} (${lessonsType[dayWeek]})\n\n\``

    currentDay.forEach((lesson) => {
        isDayHaveLessons = true;
        const lessonString = lessonToString(lesson)
        

        outputString = `${outputString}${lessonString}\n\n`
        lessonIndex ++;
    })

    if (isDayHaveLessons) {
        bot.sendMessage(chatId, outputString, {parse_mode: 'Markdown'})

        

    } else {
        bot.sendMessage(chatId, '✅ Завтра пар немає!')
    }
})


bot.onText(/\/day/, (msg) => {
    const chatId = msg.chat.id;

    let date = new Date();
    let dayWeek = date.getDay();
    let currentDay = lessons[dayWeek];

    let isDayHaveLessons = false;
    let lessonIndex = 1;

    let outputString = `\`🧾 Розклад на сьогодні (${lessonsType[dayWeek]})\n\n\``
    
    currentDay.forEach((lesson) => {
        isDayHaveLessons = true;
        const lessonString = lessonToString(lesson)
        

        outputString = `${outputString}${lessonString}\n\n`
        lessonIndex ++;
    })

    if (isDayHaveLessons) {
        bot.sendMessage(chatId, outputString, {parse_mode: 'Markdown'})

        

    } else {
        bot.sendMessage(chatId, '✅ Сьогодні пар немає!')
    }
});

bot.onText(/\/week/, (msg) => {
    const chatId = msg.chat.id;
    // bot.sendMessage(chatId, '🥳\nПар не буде до *24.01.2021*', { parse_mode: 'Markdown' });


    let message = bot.sendMessage(chatId, '🕐 *Очікуйте, бот формує зображення.*', { parse_mode: 'Markdown' });
    let html = weekToHtml(lessons, daysName, lessonsType);
    let dateStart = new Date();

    nodeHtmlToImage({
        output: './image.png',
        html: html,
        type: 'png',
        puppeteerArgs: {
            headless: true,
            args: ['--no-sandbox']
        }
    })
        .then(() => {
            bot.sendPhoto(chatId, 'image.png', { caption: '🧾 *Розклад на тиждень*', parse_mode: 'Markdown' })

            let dateEnd = new Date();
            let final = dateEnd - dateStart;

            console.log((final / 1000))
            bot.deleteMessage(chatId, message._rejectionHandler0.message_id)
        })
});


bot.on("text", (msg) => {
    if (msg.text.toLowerCase() === '/next' || msg.text.toLowerCase() === '/next@lessons_541_bot') {
        const chatId = msg.chat.id;

        let date = new Date();
        let dayWeek = date.getDay();
        let currentDay = lessons[dayWeek];

        let minTimeLesson = null;
        let minTimeDate = null;

        currentDay.forEach(lesson => {
            const hourStart = lesson.timeStart[0];
            const minuteStart = lesson.timeStart[1];

            const dateNow = new Date()
            const dateStart = new Date()

            dateStart.setHours(hourStart)
            dateStart.setMinutes(minuteStart)
            dateStart.setSeconds(0)

            if (dateStart >= dateNow) {
                if (minTimeLesson === null) {
                    minTimeLesson = lesson;
                    minTimeDate = dateStart;
                } else {
                    if (minTimeDate > dateStart) {
                        minTimeLesson = lesson;
                        minTimeDate = dateStart;
                    }
                }
            } 
        })

    if (minTimeLesson === null) {
        bot.sendMessage(chatId, '✅ На сьогодні більше пар немає!')
    } else {

        const timeToString = (time) => {
            return ((
                time >= 0 && time <= 9
                ? `0${time}`
                : time
            ))
        }

        const h = timeToString(minTimeLesson.timeStart[0]);
        const m = timeToString(minTimeLesson.timeStart[1]);

        minTimeLesson.name.forEach((name) => {
            bot.sendMessage(chatId, `🛑 Наступна пара - *${name}*\nПочаток в - _${h}:${m}_`, {parse_mode: 'Markdown'})
        })
    }
    }
})
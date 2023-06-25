function getVal(val, data) {
    return data[val][Math.floor(Math.random() * data[val].length)];
}

function messageProbability(userMessage, recognizedWords, singleResponse = false, requiredWords = []) {
let messageCertainty = 0;
let hasRequiredWords = true;

for (let i = 0; i < userMessage.length; i++) {
    if (recognizedWords.includes(userMessage[i])) {
        messageCertainty += 1;
    }
}

const percentage = messageCertainty / recognizedWords.length;

for (let i = 0; i < requiredWords.length; i++) {
    if (!userMessage.includes(requiredWords[i])) {
        hasRequiredWords = false;
        break;
    }
}

if (hasRequiredWords || singleResponse) {
    return Math.floor(percentage * 100);
} else {
    return 0;
}
}

function checkAllMessages(message, data) {
    let highestProbList = {};

        function response(botResponse, listOfWords, singleResponse = false, requiredWords = []) {
            highestProbList[botResponse] = messageProbability(message, listOfWords, requiredWords);
        }

    response("No!", ["shutup", "shut"], requiredWords = ["shutup", "shut"]);
    response(getVal('hello', data), ["hello", 'ello', "hi", "heyo", "sup", "hey", "yo", "heya"], true);
    response(getVal("how_are_you", data), ["how", "are", "you", "doing", "what's up", "hru"], requiredWords = ["how", "what's up", "hru"]);
    response(getVal("alive", data), ["alive"], requiredWords = ["alive"]);
    response(getVal("help", data), ["help","need"], requiredWords = ["help", "assistance"]);
    response(getVal("nyan", data), ["meow", "nya", "nyan"], requiredWords = ["meow", "nya"]);
    response(getVal("eat", data), ["eat", "ate"], requiredWords = ["eat", "ate"]);
    response(getVal("disappear", data), ["go away", "go", "away", "disappear"], requiredWords = ["go away", "disappear"]);
    response(getVal("self", data), ["alexa", "siri"], requiredWords = ["alexa"]);
    response(getVal("nvm", data), ["nvm", "nevermind"], requiredWords = ["nvm", "nevermind"]);
    response(getVal("bye", data), ["bye", "goodbye", "farewell"], requiredWords = ["bye", "goodbye", "farewell"]);
    response(getVal("who", data), ["playing", "who"], requiredWords = ["playing", "who"]);
    response(getVal("morning", data), ["good", "morning"], requiredWords = ["morning"]);
    response(getVal("evening", data), ["good", "evening", "night"], requiredWords = ["night", "evening"]);

    const bestMatch = Object.keys(highestProbList).reduce((a, b) => highestProbList[a] > highestProbList[b] ? a : b);

    if (highestProbList[bestMatch] < 1) {
        return getVal("invalid", data);
    } else {
        return bestMatch;
    }
}

function getResponse(userInput, data) {
    const splitMessage = userInput.split(/\s+|[,;?!.-]/);
    const response = checkAllMessages(splitMessage, data);
    return response;
}

function handleResponse(message, data) {
    const msg = message.trim();

    if (msg === "i") {
        return getVal("i", data);
    } else if (getResponse(msg, data) === "nope") {
        const logs = localStorage.getItem("logs.txt") || "";
        localStorage.setItem("logs.txt", logs + "\n" + msg);
        return getVal("nope", data);
    } else {
        return getResponse(msg, data);
    }
}

// Fetch the intents.json file
fetch('./intents.json')
.then(response => response.json())
.then(data => {
        const msg = document.querySelector("[data-msg]");
        const container = document.querySelector("[data-messages]");
        
        msg.addEventListener('keypress', (event) => {
            if (event.key == 'Enter'){
                let message = msg.value;
                let p = document.createElement("p");
                p.classList.add("user");
                let span = document.createElement("span");
                span.innerHTML = message;
                p.appendChild(span);
                container.appendChild(p);
                
                const response = handleResponse(message, data);
                let bot_p =  document.createElement("p");
                bot_p.classList.add("bot");
                let bot_span = document.createElement("span");
                bot_span.innerHTML = response;
                bot_p.appendChild(bot_span);
                container.appendChild(bot_p);

                msg.value = "";

            }
    });
})
.catch(error => {
    console.error(error);
});

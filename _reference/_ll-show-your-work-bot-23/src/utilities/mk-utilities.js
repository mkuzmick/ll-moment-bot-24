var colors = require('colors')

module.exports.blue = (thing) => {
    if (typeof thing == "string") {
        console.log(colors.blue(thing))
    } else {
        console.log(colors.blue(JSON.stringify(thing, null, 4)))
    }
}

module.exports.cyan = (thing) => {
    if (typeof thing == "string") {
        console.log(colors.cyan(thing))
    } else {
        console.log(colors.cyan(JSON.stringify(thing, null, 4)))
    }
}

module.exports.red = (thing) => {
    if (typeof thing == "string") {
        console.log(colors.red(thing))
    } else {
        console.log(colors.red(JSON.stringify(thing, null, 4)))
    }
}

module.exports.yellow = (thing) => {
    if (typeof thing == "string") {
        console.log(colors.yellow(thing))
    } else {
        console.log(colors.yellow(JSON.stringify(thing, null, 4)))
    }
}

module.exports.magenta = (thing) => {
    if (typeof thing == "string") {
        console.log(colors.magenta(thing))
    } else {
        console.log(colors.magenta(JSON.stringify(thing, null, 4)))
    }
}

module.exports.grey = (thing) => {
    if (typeof thing == "string") {
        console.log(colors.grey(thing))
    } else {
        console.log(colors.grey(JSON.stringify(thing, null, 4)))
    }
}

module.exports.divider = "######################################################\n######################################################\n######################################################"

module.exports.wait = (timeToDelay) => {
    new Promise((resolve) => setTimeout(resolve, timeToDelay));
}

module.exports.isValidUrl = (string) => {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:";
}
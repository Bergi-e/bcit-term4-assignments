// Displays the message itself, gathering the date/time from utils.js
class Lang {
    constructor() {
        this.greeting = 
        "Hello %1, What a beautiful day." 
        + " Server current date and time is ";
    }
}

module.exports = new Lang();
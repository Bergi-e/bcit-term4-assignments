// Gather the date server-side
class Utils {
    static getDate() {
        const date = new Date();
        return date.toString();
    }
}

module.exports = Utils;
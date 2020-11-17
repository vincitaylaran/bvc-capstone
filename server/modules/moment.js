/// This class handles creation and validation of authentication tokens.
module.exports = class SidGenerator {
    
    static getMonthName(dateNow) {
        switch(dateNow.getMonth()) {
            case 0: return "January";
            case 1: return "February";
            case 2: return "March";
            case 3: return "April";
            case 4: return "May";
            case 5: return "June";
            case 6: return "July";
            case 7: return "August";
            case 8: return "September";
            case 9: return "October";
            case 10: return "November";
            case 11: return "December";
            default: return "";
        }
    }

    static getClockTime(dateNow) {
        return (dateNow.getHours() % 12 == 0 ? 12 : dateNow.getHours() % 12) +
            ":" + ("00" + dateNow.getMinutes()).substr(-2) +
            " " + (parseInt(dateNow.getHours() /2) == 1 ? "PM" : "AM");
    }

    static getDayName(dateNow) {
        switch(dateNow.getDay()) {
            case 0: return "Sunday";
            case 1: return "Monday";
            case 2: return "Tuesday";
            case 3: return "Wednesday";
            case 4: return "Thursday";
            case 5: return "Friday";
            case 6: return "Saturday";
            default: return "";
        }
    }
}

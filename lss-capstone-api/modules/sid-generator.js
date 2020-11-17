/// This class handles creation and validation of authentication tokens.
module.exports = class SidGenerator {
    static userSid(email) {
        let sid = email.replace(/[^0-9a-zA-Z]/g, '');
        
        while(sid.indexOf("  ") > 0) {
            sid = sid.replace("  ", " ");
        }

        if (sid.length > 3)
            sid = sid.substring(0,3);

        const num = new Date().getTime();
        sid = sid + num.toString(32);
        return sid.toLowerCase();
    }

    static titleSid(title) {
        let str = title.replace(/[^0-9a-zA-Z\W]/g, '');

        while(str.indexOf("  ") > 0) {
            str = str.replace("  ", " ");
        }
        
        const arr = str.split(" ");
        let sid = "";

        if (arr.length >= 3) {
            sid = arr[0].substring(0,1) + 
                arr[1].substring(0,1) + 
                arr[2].substring(0,1);
        }
        else if (arr.length == 2) {
            sid = arr[0].substring(0,1) + 
                arr[1].substring(0,1);
        }
        else if (arr[0].length > 3){
            sid = arr[0].substring(0,3);
        }
        else {
            sid = arr[0];
        }

        const num = new Date().getTime();
        sid = sid + num.toString(32);
        return sid.toLowerCase();
    }
}

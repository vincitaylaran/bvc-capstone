import { observable } from 'mobx';
import { ModelService } from './model-sub.js';
import { ModelDisplay } from './model-display.js';

/// Base model of the app. Holds values taken from the jwt token.
export const ModelMain = observable({
    logged: false,
    jwt: "jwt",
    sub: "sub",
    name : "name",
    services: [],
    privileges: [],
    service : ModelService,
    display : []
});

ModelMain.IsLogged = function() {
    return this.logged;
}

ModelMain.getSub = function() {
    return this.sub;
}

ModelMain.setSub = function(value) {
    this.sub = value;
}

ModelMain.getService = function() {
    return this.service;
}

ModelMain.setService = function(value) {
    this.service = value;
    //this.service_str = JSON.stringify(value);
    //console.log(this.service_str);
}

///
ModelMain.login = async function() {
    const endpoint = "http://localhost:54321/login";

    var data = new URLSearchParams();
    data.append("username", "admin.asc@mybvc.ca");
    data.append("password", "admin123");

    try {
        const reply = await fetch(endpoint, { method: "POST", body: data });
        const result = await reply.json();

        console.log(result);
    }
    catch (e) {
        console.log(`model-waitlist Exception! e --> ${e}`);
    }

}

ModelMain.getDisplay = function() {
    return this.display;
}

ModelMain.loadDisplay = async function() {
    const endpoint = "http://localhost:54321/display?s=CTTutor,PNTutor,ELL,Reboot";

    try {
        const reply = await fetch(endpoint, { method: "GET" });
        const result = await reply.json();

        //this.display = JSON.stringify(result);
        this.display = result.map(element => {
            const disp = Object.assign({}, ModelDisplay);
            disp.SetDisplayValues(element);
            return disp;
        });
        
        //console.log(this.display);
    }
    catch (e) {
        console.log(e);
    }
}



import { observable } from 'mobx';
import { ModelDisplayRow } from './model-display-row.js';

/// Function for service page.
export const ModelDisplay = observable({
    code: "",
    desc: "",
    schedule: [],
    tutees: []
});

ModelDisplay.getCode = function() {
    return this.code;
}

ModelDisplay.getDesc = function() {
    return this.desc;
}

ModelDisplay.getSchedule = function() {
    return this.schedule;
}

ModelDisplay.getTutees = function() {
    return this.tutees;
}

ModelDisplay.SetDisplayValues = function(value) {
    this.code = value.code;
    this.desc = value.desc;
    this.schedule = value.schedule.map(el => { return el; });
    this.tutees = value.list.map(el => {
        const tutee = Object.assign({}, ModelDisplayRow);
        tutee.setName(el.name);
        tutee.setQueue(el.queue);
        tutee.setStatus(el.status);
        return tutee;
    });
}


import { observable } from 'mobx';

/// Function for service page.
export const ModelDisplayRow = observable({
    name: "",
    queue: 0,
    status: ""
});

ModelDisplayRow.getName = function() {
    return this.name;
}

ModelDisplayRow.setName = function(value) {
    this.name = value;
}

ModelDisplayRow.getQueue = function() {
    return this.queue;
}

ModelDisplayRow.setQueue = function(value) {
    this.queue = value;
}

ModelDisplayRow.getStatus = function() {
    return this.status;
}

ModelDisplayRow.setStatus = function(value) {
    this.status = value;
}


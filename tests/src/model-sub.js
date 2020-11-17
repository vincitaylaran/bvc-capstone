import { observable } from 'mobx';

/// Function for service page.
export const ModelService = observable({
    code: "CTTutor",
    desc: "Description"
});

ModelService.getCode = function() {
    return this.code;
}

ModelService.setCode = function(value) {
    this.code = value;
}

ModelService.getDesc = function() {
    return this.desc;
}

ModelService.setDesc = function(value) {
    this.desc = value;
}

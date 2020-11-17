import { observable } from "mobx";

/// Function for service page.
export const ModelProgress = observable({
  openState: false,
  nextHandler: null
});

ModelProgress.getOpenState = function() {
    return this.openState;
}

ModelProgress.show = function() {
    if (!this.openState) {
        this.openState = true;
    }
}

ModelProgress.hide = function(duration) {
    if (ModelProgress.openState) {
        let d = (duration ? duration : 1000);
        setTimeout(() => { ModelProgress.openState = false; }, d);
    }
}

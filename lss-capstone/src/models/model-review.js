import { observable } from "mobx";
import config  from "../config.json";
import axios from "axios";
const qs = require("querystring");

export const ModelReview = observable({
    desc: "",
    review: ""

});

ModelReview.PostReview = async function(Course, Message){
    const endpoint = config.api + "/review";


  try {
      
    var data = {course: this.desc, message: this.review};
    const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };
      axios
        .post(endpoint, qs.stringify(data), config)
  }
  catch (e) {
      console.error(`model-review Exeption! e --> ${e}`);
  }
}

ModelReview.setDesc = function(newValue){
    this.desc = newValue;
}

ModelReview.setReview = function(newValue){
    this.review = newValue
}
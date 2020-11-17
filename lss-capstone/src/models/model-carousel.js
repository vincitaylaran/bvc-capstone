import { observable } from "mobx";
import config  from "../config.json";

const modelGetCarousel = observable({
  time: config.waitlist_time,
  index:0,
  display:"",
  oneFetch:[""],
  courses:[],
  waitlists:"",
  courslist:"",
  selectedlist: [],
  currentIndex : 0,
  currentDisplay: null,
  nextDisplay : null
});

modelGetCarousel.reset = function() {
  this.index = 0;
  this.display = "";
  this.oneFetch = [""];
  this.courses = [];
  this.waitlists = "";
  this.courslist = "";
  this.selectedlist = [];
  this.currentIndex = 0;
  this.currentDisplay = null;
  this.nextDisplay = null;
}

modelGetCarousel.getTime = function() {
  return this.time;
}

modelGetCarousel.getSelectedList = function() {
  return this.selectedlist;
}

modelGetCarousel.getCurrentDisplay = function() {
  return this.currentDisplay;
}

modelGetCarousel.getNextDisplay = function() {
  return this.nextDisplay;
}

/// This function fetches the list of Tutees and the course they are wating for
/// Params: 
///    @data:the result given by the Api call 
modelGetCarousel.getCarousel = async function() {

  const token = localStorage.getItem(config.authkey);
  const endpoint = config.api + "/display?s="+this.oneFetch[this.index];

  try {
      const reply = await fetch(endpoint, 
        { method: "GET", headers: { Authorization: token } }
      ); 
      
      const result = await reply.json();
      let data = result;
        //let tempObj ={status:element.status, name:element.desc, queue:element.schedule};
        this.waitlists = JSON.stringify(data[0].list);
        this.courslist = data[0].desc;
  }
  catch (e) {
      console.error(`model-waitlist Exception! e --> ${e}`);
  }

}

modelGetCarousel.makeCheckboxState = function(value){
  
}

/// This function sets the courses to be waitlistsed on the carousel
/// Params: 
///    @NewValue:the user input for courslistes to be waitlistsed
modelGetCarousel.setWaitLists = function(NewValue)
{
  this.waitlists = NewValue;
}

/// This function retrives each waiting list individualy
/// Params: 
modelGetCarousel.getWaitListData = function()
{
  return (this.waitlists);
}

/// This function retrives each course name individualy
/// Params: 
modelGetCarousel.getdescData = function()
{
  return (this.courslist);
}

/// This funcion syncronizes and iterate through index
/// Params: 
modelGetCarousel.setIndex = function()
{
    if(this.index < this.oneFetch.length -1)
      this.index++;
    else
      this.index = 0;
}

// /// This function retrives each course name individualy
// /// Params: 
// modelGetCarousel.getNumberOfCourses = function()
// {
//   return (this.courses.length);
// }

modelGetCarousel.getCoursesforCheckbox = function()
{
  return this.courses;
}

modelGetCarousel.checkboxStateChanger = function(value, selected)
{
  for(let i = 0; i<this.courses.length; i++)
  {
    if(this.courses[i].sid === value)
    {
      this.courses[i].state = selected;
      break;
    }
  }
}

modelGetCarousel.changeDisplay = function()
{
  let j =0;
  for(let i = 0; i<this.courses.length; i++)
  {
    if(this.courses[i].state === true)
    {
      this.oneFetch[j]=this.courses[i].code;
      j++;
    }
  }

}

/// Connects to the database to get all services.
modelGetCarousel.getDisplayServices = async () => {
  const endpoint = config.api + "/display_services";
  const token = localStorage.getItem(config.authkey);

  let apiResponse = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: token },
  });

  let Reply = await apiResponse.json();
  if (Reply.success) {
    modelGetCarousel.courses = Reply.result.map(s => {
      return {
        sid : s.sid,
        desc : s.desc,
        state: true }
    });
  }
};

/// Connects to the database to get all services.
modelGetCarousel.getSelectedSids = function() {
  let selected = [];
  this.courses.forEach(s=>{
    if (s.state) {
      selected.push(s.sid);
    }
  });

  this.selectedlist = selected;
  return selected;
};

modelGetCarousel.moveIndex = function() {
  if (this.currentIndex + 1 === this.selectedlist.length) {
    this.currentIndex = 0;
  }
  else {
    this.currentIndex++;
  }
}

modelGetCarousel.loadToCurrent = async function() {
  this.currentDisplay = Object.assign({}, this.nextDisplay);
}

/// Connects to the database to get all services.
modelGetCarousel.loadIndexedDisplay = async function() {
  const sid = this.selectedlist[this.currentIndex];
  const endpoint = config.api + "/display_walkin?s=" + sid;
  const token = localStorage.getItem(config.authkey);

  let apiResponse = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: token },
  });

  let reply = await apiResponse.json();
  if (reply.success) {
    this.nextDisplay = Object.assign({}, reply);
  }
};

export default modelGetCarousel;







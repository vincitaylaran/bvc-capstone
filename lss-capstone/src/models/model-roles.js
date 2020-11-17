import { observable } from "mobx";
import config from "../config.json";

export const ModelRole = observable({
  id: "",
  code: "", // SID / URL.
  desc: "",
  privs: ["brd"], //by default, each user has dashboard,
  servs: [],
  req: "",
  findRoleString: "",
  paging: {
    page: 1,
    row: 5
  },
  roles: [],
  selectedRoles: []
});

/******************************
     Get and Set functions
 ******************************/
ModelRole.setId = function(value) {
  this.id = value;
};

ModelRole.getId = function() {
  return this.id;
};

ModelRole.setCode = function(value) {
  this.code = value;
};

ModelRole.getCode = function() {
  return this.code;
};

ModelRole.setDesc = function(value) {
  this.desc = value;
};

ModelRole.getDesc = function() {
  return this.desc;
};

ModelRole.setPrivs = function(value) {
  this.privs = value;
};

ModelRole.getPrivs = function() {
  return this.privs;
};

ModelRole.setServs = function(value) {
  this.servs.push(value);
};

ModelRole.getServs = function() {
  return this.servs;
};

/***********
 * Methods *
 ***********/

// Clear the model.
ModelRole.clearAll = function() {
  this.id = "";
  this.code = "";
  this.desc = "";
  this.privs = ["brd"]; // user has dashboard by default;
  this.servs = [];
};

/***************
 * Roles table *
 ***************/

ModelRole.resetTable = function() {
  this.paging = { page: 1, row: 5 };
  this.findRoleString = "";
  this.selectedRoles = [];
}

ModelRole.setPageNumber = function(value) {
  this.paging.page = this.paging.page + value;
};

ModelRole.getPageNumber = function() {
  return this.paging.page;
};

ModelRole.setPageRow = function(value) {
  if (value === -1) this.paging.row = this.roles.length;
  else this.paging.row = value;

  this.paging.page = 1;
};

ModelRole.getPageRow = function() {
  return this.paging.row;
};

ModelRole.getRoles = function() {
  return this.roles;
};

ModelRole.getfindRole = function() {
  return this.findRoleString;
};

ModelRole.setfindRole = function(value) {
  this.findRoleString = value;
  let temRow = [];
  this.roles.forEach(element => {
    if (
      element.description
        .toLowerCase()
        .includes(this.findRoleString.toLowerCase())
    ) {
      temRow.push(element);
    }
  });
  this.roles = temRow;
};

ModelRole.getRoleData = async function() {
  this.paging.page = 1;
  const endpoint = config.api + "/roles";

  const token = localStorage.getItem(config.authkey);

  let apiResponse = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: token }
  });
  let Reply = await apiResponse.json();
  if (Reply.success) {
    this.roles.clear();
    this.roles = Reply.result;
      // //this data is for testing the tabel The real return Replay will be used after demonstration
      // Reply.result.forEach(element => {
      //   this.roles.push(element);
      // });
    
    return Reply;
  }
};

ModelRole.getSelectedRoles = function() {
  return this.selectedRoles;
}

ModelRole.setSelectedRoles = function(value) {
  this.selectedRoles = value;
}

ModelRole.addRemoveSelectedRole = function(add, role) {
  const json = JSON.parse(role);
  if (add) {
    this.selectedRoles.push(json);
  }
  else {
    let i = 0;
    while(i < this.selectedRoles.length) {
      if (this.selectedRoles[i].code === json.code) {
        this.selectedRoles.splice(i, 1);
        break;
      }
      i++;
    }
  }
}

/*****************
 * Adding a Role *
 *****************/

ModelRole.addPriv = function(priv) {
  this.privs.push(priv);
};

ModelRole.removePriv = function(priv) {
  let i = 0;
  while(i < this.privs.length)  {
    if (this.privs[i] === priv) {
      this.privs.splice(i, 1);
      break;
    }
    i++;
  }
};

ModelRole.addServ = function(serv) {
  this.servs.push(serv);
};

ModelRole.removeServ = function(serv) {
  let i = 0;
  while(i < this.servs.length)  {
    if (this.servs[i] === serv) {
      this.servs.splice(i, 1);
      break;
    }
    i++;
  }
};

ModelRole.addAllServ = function(services) {
  const svc = ["*"];
  services.forEach(s => {
    svc.push(s.getCode());
  });

  this.servs = svc;
}

ModelRole.removeAllServ = function() {
  this.servs = [];
}

ModelRole.getRole = async function() {
  try{
    const endpoint = config.api + "/role?r=" + this.code;

    const token = localStorage.getItem(config.authkey);
  
    let apiResponse = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: token }
    });
    let reply = await apiResponse.json();
    
    if (reply.success) {
      this.code = reply.result.code;
      this.desc = reply.result.description;
      this.privs = reply.result.privs;
      this.servs = reply.result.servs;
    }
    
    return reply;

  }
  catch(e) {
    console.error('model-roles Exception!', e);
  }

  return { success: false, severity: 2, 
    message: "An error ocurred in getting Role."};
  
}

/// Connect to API to save data.
ModelRole.saveRoleData = async function(isUpdate){
  if (ModelRole.desc.trim() === "") {
    return { success: false, severity: 1, message: "Role Title required." };
  }

  try {
    const endpoint = config.api + "/role";

    const token = localStorage.getItem(config.authkey);

    const data = new URLSearchParams();
    data.append("code", ModelRole.code);
    data.append("desc", ModelRole.desc);
    data.append("privileges", JSON.stringify(ModelRole.privs));
    data.append("services", JSON.stringify(ModelRole.servs));
    data.append("token", token);

    let init = {method: "POST",body: data};
    if (isUpdate) {
      init.method = "PUT";
    }

    let apiResponse = await fetch(endpoint, init);
    let reply = await apiResponse.json();
    return reply;
  }
  catch(e) {
    console.error(`model-roles Exception! e --> ${e}`);
  }
  return { success: false, severity: 2, message: "An error ocurred. Role could not be saved."};
};


ModelRole.getRoleServices = async function(code) {
  try{
    const endpoint = config.api + "/role_services?r=" + code;
    const token = localStorage.getItem(config.authkey);
  
    let apiResponse = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: token }
    });
    let reply = await apiResponse.json();
    
    if (reply.success) {
      return reply.result;
    }
  }
  catch(e) {
    console.error('model-roles Exception!', e);
  }

  return [];
}

ModelRole.getRolePrivileges = async function(code) {
  try{
    const endpoint = config.api + "/role_privileges?r=" + code;
    const token = localStorage.getItem(config.authkey);
  
    let apiResponse = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: token }
    });
    let reply = await apiResponse.json();
    
    if (reply.success) {
      return reply.result;
    }
  }
  catch(e) {
    console.error('model-roles Exception!', e);
  }

  return [];
}

export default ModelRole;
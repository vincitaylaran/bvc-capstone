import React, { Component } from "react";
import { observer } from "mobx-react";

import LoadingComponent from "./component-loading.js";

import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import "../styles/form-addRoles.css";

///
/// Props:
///   model: MainModel which holds every other model.
///   roleSid: sid of role passed from parent component.
///   onSuccess: event handler after successfully adding a role.
///   onSuccessParam: parameter for onSuccess.
///
export default observer(
  class AddRoleForm extends Component {
    constructor(props) {
      super(props);
      this.state = { loading: true };
    }

    async componentDidMount() {
      await this.props.model.serviceModel.getServicesData();
      
      if (this.props.roleSid) {
        await this.props.model.roleModel.setCode(this.props.roleSid);
        await this.props.model.roleModel.getRole();
      }
      else {
        await this.props.model.roleModel.clearAll();
      }

      this.setState({loading: false});
    }

    onSuccess = () => {
      if (this.props.onSuccess) {
        if (this.props.onSuccessParam) {
          this.props.onSuccess(this.props.onSuccessParam);
        }
        else {
          this.props.onSuccess();
        }
      }
    }

    /// Save the role into the database.
    saveRole = async (e) => {
      e.preventDefault();
      this.props.model.showProgress();

      const result = await this.props.model.roleModel.saveRoleData(this.props.roleSid);
      // Show result and remove progress bar.
      this.props.model.toastResult(result);
      this.props.model.hideProgress();

      if(result.success) {
        this.props.model.roleModel.clearAll();
        this.onSuccess();
      }
    };

    /// Save the name of the new role into the model.
    saveRoleName = (e) => {
      this.props.model.roleModel.setDesc(e.target.value);
    };

    /// Save the array of privliges into the model.
    /// Params:
    ///   value: the privlige to push into the model's privileges array.
    savePrivileges = e => {
      if (e.target.checked) {
        this.props.model.roleModel.addPriv(e.target.value);
      }
      else {
        this.props.model.roleModel.removePriv(e.target.value);
      }
    };

    /// Saves the array of services into the model.
    /// Params:
    ///   value: the services to push into the model's services array.
    saveServices = e => {
      if (e.target.checked) {
        this.props.model.roleModel.addServ(e.target.value);
      }
      else {
        this.props.model.roleModel.removeServ(e.target.value);
        this.props.model.roleModel.removeServ("*");
      }
    };

    allServices = (e) => {
      const svcList = this.props.model.serviceModel.getServicesList();

      if (e.target.checked) {
        this.props.model.roleModel.addAllServ(svcList);
      }
      else {
        this.props.model.roleModel.removeAllServ();
      }
    }

    /// Retreive all services to put into an array of checkboxes to be displayed.
    getServicesChecklist = () => {
      // Retreive all services from the backend.
      // Put services into array of MUI checkboxes.
      let roleSvc = this.props.model.roleModel.getServs();

      const svcList = this.props.model.serviceModel.getServicesList();

      const fArray = svcList.map((s,i) => {
        return <div className="role-input">
          <FormControlLabel
            control={<Checkbox checked={roleSvc.includes(s.getCode())}
              value={s.getCode()} 
              onChange={this.saveServices} />}
            label={s.getDesc()}
          />
        </div>
      })

      return fArray;
    };

    ///
    render() {
      const privs = this.props.model.roleModel.getPrivs();
      const servs = this.props.model.roleModel.getServs();
      const desc = this.props.model.roleModel.getDesc();
      const loadingText = `Loading Role ${desc}...`;

      const adm = privs.includes("adm");
      const brd = privs.includes("brd");
      const lst = privs.includes("lst");
      const rpt = privs.includes("rpt");
      const svc = privs.includes("svc");
      const rol = privs.includes("rol");
      const usr = privs.includes("usr");

      const availableServices = this.getServicesChecklist();

      return (
        this.state.loading
        ? <LoadingComponent text={loadingText} />
        : <form className="role-base-form" onSubmit={this.saveRole}>
            <FormControl className="section role-title">
              <TextField 
                fullWidth required
                type="text" 
                label="Role Title"
                value={desc} 
                variant="outlined"
                onChange={this.saveRoleName} />
            </FormControl>


            <FormControl component="fieldset" className="section">
              <FormLabel component="legend">
                  <Typography variant="h5">Privileges</Typography>
              </FormLabel>
              <FormGroup row>
                <div className="role-input">
                  <FormControlLabel
                    control={<Checkbox value="adm" checked={adm}
                      onChange={this.savePrivileges} />}
                    label="Site Administrator"
                  />
                </div>
                <div className="role-input">
                  <FormControlLabel
                    control={<Checkbox disabled value="brd" checked={brd}
                      onChange={this.savePrivileges}/>}
                    label="View dashboard"
                  />
                </div>
                <div className="role-input">
                  <FormControlLabel
                    control={<Checkbox value="lst" checked={lst}
                      onChange={this.savePrivileges}/>}
                    label="Display public list"
                  />              
                </div>
                <div className="role-input">
                  <FormControlLabel
                    control={<Checkbox value="rpt" checked={rpt}
                      onChange={this.savePrivileges} />}
                    label="View analytics"
                  />
                </div>
                <div className="role-input">
                  <FormControlLabel
                    control={<Checkbox value="svc" checked={svc}
                      onChange={this.savePrivileges}/>}
                    label="Add/modify services"
                  />
                </div>
                <div className="role-input">
                  <FormControlLabel
                    control={<Checkbox value="rol" checked={rol}
                      onChange={this.savePrivileges} />}
                    label="Add/modify roles"
                  />
                </div>
                <div className="role-input">
                  <FormControlLabel
                    control={<Checkbox value="usr" checked={usr}
                      onChange={this.savePrivileges}/>}
                    label="Add/modify users"
                  />
                </div>
              </FormGroup>
            </FormControl>

            <FormControl component="fieldset" className="section">
              <FormLabel component="legend">
                <Typography variant="h5">Services</Typography>
              </FormLabel>
              <FormGroup row>
                <div className="role-input">
                  <FormControlLabel
                    control={<Checkbox value="*"
                      checked={servs.includes("*")}
                      onChange={this.allServices} />}
                    label="All Services"
                  />
                </div>
                {availableServices}
              </FormGroup>
            </FormControl>

            <div className="section">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
              >
                Save role
              </Button>
            </div>
          </form>
      );
    }
  }
)

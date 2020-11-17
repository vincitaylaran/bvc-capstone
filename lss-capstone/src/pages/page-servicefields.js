import React, { Component } from "react";
import { observer } from "mobx-react";

import HeaderMenu from "../components/menu-header.js";
import CustomServiceField from "../components/field-customService.js";
import ModalServiceField from "../components/modal-serviceField.js";
import LoadingComponent from "../components/component-loading.js";

import Container from "@material-ui/core/Container";
import Button from '@material-ui/core/Button';
import SaveIcon from "@material-ui/icons/Save";

///
/// This is the page that will set the fields that will appear when booking.
///
/// PROPS
///     @model: MainModel which holds every other model.
///
export default observer(
  class ServiceFields extends Component {
    constructor(props) {
      super(props);

      this.new = false;

      this.state = { loading: true};
    }

    ///On component mount, get sid and load service and fields.
    async componentDidMount() {
      const {sid} = await this.props.match.params;
      await this.props.model.serviceModel.getServiceData(sid);
      this.setState({loading: false});
    }

    headerLinks = () => {
      let headerArray = [];
      
      const canServices = this.props.model.getCanServices();
      const code = this.props.model.serviceModel.getSid();
      const desc = this.props.model.serviceModel.getDesc();
      const serviceUrl = "/service/" + code;

      headerArray.push(
        { 
          visible: canServices,
          label: desc,
          url: serviceUrl
        }
      );

      headerArray.push(
        { 
          visible: canServices,
          label: "List of Services",
          url: "/services"
        }
      );
      
      return headerArray;
    }

    // Show a toast message for a user's action.
    showToast = (result) => {
      this.props.model.toastResult(result);
      if (result.success) {
        this.props.model.serviceModel.setCustomFieldPopup(false);
      }
    }

    /// Add field button will open a modal dialog.
    addField = () => {
      this.new = true;
      this.props.model.serviceModel.createNewField();
      this.props.model.serviceModel.setCustomFieldPopup(true);
    }

    /// 
    modifyField = (field) => {
      this.new = false;
      this.props.model.serviceModel.setEditField(field);
      this.props.model.serviceModel.setCustomFieldPopup(true);
    }

    /// Function called when a remove field is called.
    removeField = async (field) => {
      
      const fnRemove = this.props.model.serviceModel.removeField;
      const fnToast = this.showToast;

      const fn = async function() {
        const result = await fnRemove(field);
        fnToast(result);
      }

      /// Call confirm dialog.
      await this.props.model.showConfirmDialog("Remove Field", 
        "Proceed removing this field?",
        "OK", "Cancel",
        fn);
    }

    saveNewField = async() => {
      const result = await this.props.model.serviceModel.addNewField()
      this.showToast(result);
    }

    updateField = async(field) => {
      const fnUpdate = this.props.model.serviceModel.updateField;
      const fnToast = this.showToast;

      const fn = async function() {
        const result = await fnUpdate();
        fnToast(result);
      }

      /// Call confirm dialog.
      await this.props.model.showConfirmDialog("Update Field", 
        "Proceed updating this field?",
        "OK", "Cancel",
        fn);
    }

    checkChange = async (field) => {
      await this.props.model.serviceModel.setEditField(field);
      const result = await this.props.model.serviceModel.updateField();
      this.showToast(result);
    }

    closePopup = () => {
      this.props.model.serviceModel.setCustomFieldPopup(false);
    }

    render() {
      const links = this.headerLinks();

      const desc = this.props.model.serviceModel.getDesc();
      const fieldsArray = this.props.model.serviceModel.getFields();
      const open = this.props.model.serviceModel.getCustomFieldPopup();

      return (
        <Container>
          <HeaderMenu drawer={true}
            title="Services" 
            page={desc + " Fields"}
            menu={links}
            model={this.props.model.menuModel} />

          <div className="page">
            { this.state.loading
            ? <LoadingComponent text="Loading Service Fields..."/>
            : <div className="custom-field-table basic-table">
                {
                  fieldsArray.map((f,i) => {
                    return <CustomServiceField key={i} model={f} index={i}
                      modify={this.modifyField}
                      remove={this.removeField}
                      check={this.checkChange} />
                  })
                }
              </div>
            }
            <div>
              <Button variant="contained" color="primary" startIcon={<SaveIcon />}
                onClick={this.addField}>Add New Field</Button>
            </div>
          </div>
          <ModalServiceField model={this.props.model.serviceModel.getNewField()} 
            close={this.closePopup} openstate={open} new={this.new}
            create={this.saveNewField} update={this.updateField} />
        </Container>
      );
    }
  }
);

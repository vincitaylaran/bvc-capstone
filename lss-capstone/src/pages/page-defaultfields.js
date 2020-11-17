import React, { Component } from "react";
import { observer } from "mobx-react";

import CustomServiceField from "../components/field-customService.js";
import ModalServiceField from "../components/modal-serviceField.js";
import HeaderMenu from "../components/menu-header.js";
import LoadingComponent from "../components/component-loading.js";

import Container from "@material-ui/core/Container";
// import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
// import Divider from '@material-ui/core/Divider';

///
/// This is the page that will serve as "home" for the currently logged user.
///
/// PROPS
///     @model: MainModel which holds every other model.
///
export default observer(
  class DefaultFieldsPage extends Component {
    constructor() {
      super();

      this.new = false;
      this.state = { loading: true };
    }

    ///On component mount, get sid and load service and fields.
    async componentDidMount() {
      await this.props.model.defaultsModel.getDefaultFields();
      this.setState({loading: false});
    }

    headerLinks = () => {
      let headerArray = [];
      
      const canAdmin = this.props.model.getCanAdmin();

      headerArray.push(
        { 
          visible: canAdmin,
          label: "System Configuration",
          url: "/admin"
        }
      );
      
      return headerArray;
    }
  
    // Show a toast message for a user's action.
    showToast = (result) => {
      this.props.model.toastResult(result);
      if (result.success) {
        this.props.model.defaultsModel.setCustomFieldPopup(false);
      }
    }
  
    /// Add field button will open a modal dialog.
    addField = () => {
      this.new = true;
      this.props.model.defaultsModel.createNewField();
      this.props.model.defaultsModel.setCustomFieldPopup(true);
    }
  
    /// 
    modifyField = (field) => {
      this.new = false;
      this.props.model.defaultsModel.setEditField(field);
      this.props.model.defaultsModel.setCustomFieldPopup(true);
    }
  
    /// Function called when a remove field is called.
    removeField = async (field) => {
    
      const fnRemove = this.props.model.defaultsModel.removeField;
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
      const result = await this.props.model.defaultsModel.addNewField()
      this.showToast(result);
    }
  
    updateField = async(field) => {
      const fnUpdate = this.props.model.defaultsModel.updateField;
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
      await this.props.model.defaultsModel.setEditField(field);
      const result = await this.props.model.defaultsModel.updateField();
      this.showToast(result);
    }
  
    closePopup = () => {
      this.props.model.defaultsModel.setCustomFieldPopup(false);
    }

    render() {
      const links = this.headerLinks();
      const fieldsArray = this.props.model.defaultsModel.getFields();
      const open = this.props.model.defaultsModel.getCustomFieldPopup();

      return (
        <Container>
          <HeaderMenu drawer={true}
            title="Admin" 
            page="Set Default Fields" 
            menu={links}
            model={this.props.model.menuModel} />

          <div className="page">
            { this.state.loading
              ? <LoadingComponent text="Loading Default Fields" />
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
              <Button variant="contained" color="primary"
                onClick={this.addField}>Add New Field</Button>
            </div>
          </div>

          <ModalServiceField model={this.props.model.defaultsModel.getNewField()} 
            close={this.closePopup} openstate={open} new={this.new}
            create={this.saveNewField} update={this.updateField} />
          
        </Container>
      );
    }
  }
);

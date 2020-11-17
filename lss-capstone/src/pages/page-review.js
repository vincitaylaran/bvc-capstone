import React, { Component } from "react";
import { observer } from "mobx-react";
import config  from "../config.json";

import HeaderMenu from "../components/menu-header.js";

import Container from "@material-ui/core/Container";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MailIcon from '@material-ui/icons/Mail';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
    },
}));

export default observer(
  class Review extends Component {

    async componentDidMount(){
        const endpoint = config.api + "/review";

        try {
            const reply = await fetch(endpoint, { method: "POST" }); 
            const result = await reply.json();
        }
        catch (e){
            console.error("Error",e);
        }
    }

    headerLinks = () => {
      let headerArray = [];
      
      headerArray.push(
        { 
          visible: true,
          label: "Back to Login",
          url: "/"
        }
      );
      
      return headerArray;
    }

    sendData=()=>{
        this.props.model.reviewModel.PostReview();
    }

    handleDropDownChange = name => event => {
        this.props.model.reviewModel.setDesc(event.target.value);
      };

    handleTextInputChange = (myValue) => {
        
    }
    render() {
      const links = this.headerLinks();
      const appName = this.props.model.getAppName();

      return (
        <Container>
          <HeaderMenu drawer={false}
            title={appName}
            page="" 
            menu={links}
            model={this.props.model.menuModel} />

          <div className="page">
            <FormControl variant="filled">
                <InputLabel id="demo-simple-select-filled-label">Tutorials</InputLabel>
                <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    name="course"
                >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                <MenuItem value={"ELL"} >English Language Learning </MenuItem>
                <MenuItem value={"CTTutor"}>Creative Technology Tutorials</MenuItem>
                <MenuItem value={"PNTutor"}>Practical Nursing</MenuItem>
                <MenuItem value={"Reboot"}>Reboot</MenuItem>
                </Select>

                <TextField 
                id="outlined-multiline-static"
                label="Feedback"
                multiline
                rows="5"
                variant="outlined"
                />
            </FormControl>
            <Button variant="contained" color="primary" size="small" className={useStyles.button} startIcon={<MailIcon />} onClick={()=>this.sendData()}> Send </Button>
              
          </div>
        </Container>
      );
    }
  }
);

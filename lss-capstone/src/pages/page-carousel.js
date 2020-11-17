import React, { Component, Fragment } from "react";

import { observer } from "mobx-react";

import DisplayTable from "../components/TutorWaitlistForCarousel";
import HeaderMenu from "../components/menu-header.js";
import LoadingComponent from "../components/component-loading.js";

import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

export default observer(
  class Carousel extends Component {
    constructor(props) {
      super(props);
      this.rotate = null;
      this.state = {loading:true};
    }

    async componentDidMount() {
      const sids = await this.props.model.displayModel.getSelectedSids();
      if (sids.length === 0) {
        this.props.history.push("/selectdisplay");
        this.props.model.toastError("No service selected.");
      }
      else{
        await this.props.model.displayModel.loadIndexedDisplay();
        await this.props.model.displayModel.loadToCurrent();
        await this.props.model.displayModel.moveIndex();
        await this.props.model.displayModel.loadIndexedDisplay();

        const rotateTime = this.props.model.displayModel.getTime();

        this.rotate = async function() { await setTimeout(await this.displayNext, rotateTime); }
        this.rotate();
        this.setState({loading:false});
      }
    }

    displayNext = async() => {
      await this.props.model.displayModel.loadToCurrent();
      await this.props.model.displayModel.moveIndex();
      await this.props.model.displayModel.loadIndexedDisplay();
      
      if (this.rotate) {
        this.rotate();
      }
      
    }

    componentWillUnmount()
    {
      this.rotate = null;
    }
    
    goBack = () => {
      this.rotate = null;
      this.props.history.replace("/selectdisplay");
    }

    render() {
      const appName = "Learner Success Services";
      const current = this.props.model.displayModel.getCurrentDisplay();
      
      return(
        this.state.loading
        ? <div className="page">
            <LoadingComponent text="Loading Waitlist.." />
          </div>
        :
          <div>
            <HeaderMenu
              drawer={false}
              title={appName}
              page={current.desc}
              model={this.props.model.menuModel}
              nameCentered={true} />
            <div id={current.colour} className="page booking-page">
            
              <Button className="oneButton" onClick={this.goBack} variant="contained"
                  color="primary" startIcon={<ArrowBackIcon/>}>Back</Button>

              <div className="fader">
                <div>
                  <Container>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography variant="h6">Queue</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">Name</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">Status</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      {
                        current.list.map((el, i) => {
                          return <DisplayTable key={i} model={el} />
                        })
                      }
                    </Table>
                  </Container>
                </div>
              </div>
            </div>
          </div>
      );
    }
  }
);

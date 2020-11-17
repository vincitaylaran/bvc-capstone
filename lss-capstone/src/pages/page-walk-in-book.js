import React, { Component } from "react";
import { observer } from "mobx-react";

import WalkInField from "../components/fields-walkin.js";
import HeaderMenu from "../components/menu-header.js";
import LoadingComponent from "../components/component-loading.js";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

export default observer(
  class WalkInBook extends Component {
    constructor(props) {
      super(props);

      this.state = { loading: true };
    }

    async componentDidMount() {
      const { sid } = await this.props.match.params;
      await this.props.model.walkinModel.getServiceData(sid);
      this.setState({loading: false});
    }

    book = async (e) => {
      e.preventDefault();

      const result = await this.props.model.walkinModel.bookService();
      this.props.model.toastResult(result);

      if (result.success) {
        this.props.model.walkinModel.resetFields();
      }
    }

    render() {
      const appName = "Learner Success Services";
      const desc = this.props.model.walkinModel.getDesc();
      const colour = this.props.model.walkinModel.getColour();
      const fieldsarray = this.props.model.walkinModel.getFields();
      
      return (
        <div>
          <HeaderMenu
            drawer={false}
            title={appName}
            page={desc}
            model={this.props.model.menuModel}
            nameCentered={true} />
          <div id={colour} className="page booking-page">
            <Container>
              {
              this.state.loading
              ? <LoadingComponent text="Loading Booking page..." />
              :
                <form className="booking-form" onSubmit={this.book}>
                  <Divider />
                  <Typography>
                    * required field(s)
                  </Typography>
                  <Divider />
                  {fieldsarray.map(f => {
                    return <WalkInField model={f} key={f.getCode()}></WalkInField>;
                  })}
                  <Divider></Divider>
                  <div className="booking-button">
                    <Button fullWidth variant="contained" size="large"
                      color="default" type="submit">Book</Button>
                  </div>
                </form>
              }
            </Container>
          </div>
        </div>
      );
    }
  }
);

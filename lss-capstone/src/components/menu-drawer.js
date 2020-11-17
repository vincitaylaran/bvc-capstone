import React, { Component } from "react";
import { observer } from "mobx-react";

import { Link } from "react-router-dom";

import "../styles/menu-drawer.css";

/* Material-UI stuff */
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TvIcon from '@material-ui/icons/Tv';
import AssessmentIcon from '@material-ui/icons/Assessment';
import TabletMacIcon from '@material-ui/icons/TabletMac';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import FaceIcon from '@material-ui/icons/Face';
import BuildIcon from '@material-ui/icons/Build';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <Link to={to} ref={ref} {...itemProps} />),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

export default observer(
    class DrawerMenu extends Component {
      handleDrawer = () => {
        this.props.model.menuModel.toggle();
      }

      logout =  (e) => {
        e.preventDefault();
        if(this.props.logout) {
          this.props.logout();
        }
      }

      render() {
        const canDashboard = this.props.model.getCanDashboard();
        const canReports = this.props.model.getCanReports();
        const canServices = this.props.model.getCanServices();
        const canRoles = this.props.model.getCanRoles();
        const canUsers = this.props.model.getCanUsers();
        const canAdmin = this.props.model.getCanAdmin();
        const isLogged = this.props.model.isLogged();
        const isOpen = this.props.model.menuModel.getOpen();
        const drawerClass = this.props.model.menuModel.getMenuCss();

        return (
          isLogged 
          ? <div className={drawerClass}>
                <div className="toolbar">
                {
                    isOpen 
                    ? <IconButton onClick={this.handleDrawer}>
                        <ChevronLeftIcon />
                      </IconButton>
                    : <IconButton onClick={this.handleDrawer}>
                        <MenuIcon />
                      </IconButton>
                }
                </div>
                <Divider />
                <List>
                    
                  {canDashboard && (                    
                    <ListItemLink to="/" primary="Dashboard" icon={<TvIcon />} />
                  )}

                  {canReports && (
                    <ListItemLink to="/reports" primary="Analytics" icon={<AssessmentIcon />} />
                  )}

                  {canServices && (
                    <ListItemLink to="/services" primary="Services" icon={<TabletMacIcon />} />
                  )}

                  {canRoles && (
                    <ListItemLink to="/roles" primary="Roles" icon={<AssignmentIndIcon />} />
                  )}

                  {canUsers && (
                    <ListItemLink to="/users" primary="Users" icon={<FaceIcon />} />
                  )}

                  {canAdmin && (
                    <ListItemLink to="/admin" primary="Admin" icon={<BuildIcon />} />
                  )}
                </List>

                <Divider />

                <List>
                  
                  {canDashboard && (
                    <ListItemLink to="/profile" primary="Profile" icon={<AccountCircleIcon />} />
                  )}

                  <ListItem button key="Logout" onClick={this.logout}>
                    <ListItemIcon><CancelPresentationIcon /></ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItem>

                </List>
            </div>
          : <div></div>
        )
      }
    }
  );
  
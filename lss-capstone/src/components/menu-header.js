import React, { Component } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";

// Material UI Components
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from "@material-ui/core/Typography";
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import "../styles/menu-header.css";

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <Link to={to} ref={ref} {...itemProps} />),
    [to],
  );

  return (
    <ListItem button component={renderLink}>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
    </ListItem>
  );
}

///
/// HeaderMenu - serves as the header of each page
///   Props:
///     drawer - true if there is a drawer-menu
///     title - menu category
///     page - page name
///     nameCentered - place page name in center. Use this only if
///       there is no menu.
///     menu - array of links
///       .visible - privilege needed
///       .label - link label
///       .url - where to redirect
export default observer(
  class HeaderMenu extends Component {
    createMenu = (menu) => {
      const itemCount = menu.filter(v => v.visible).length;
      
      const open = this.props.model.getHeaderOpen();
      
      let css= "header-menu-content";
      // Just additional checking
      if (open) {
        switch(itemCount) {
          case 2:
            css += " header-menu-open-2";
            break;
          case 3:
            css += " header-menu-open-3";
            break;
          case 4:
            css += " header-menu-open-4";
            break;
          default:
            css += "";
        }
      }
      
      const toggle = this.props.model.toggleHeader;

      
      if (this.props.drawer) {
      
        if (itemCount <= 1) {
          return menu[0].visible &&
          <div className="header-menu">
            <div className="header-menu-content">
              <div className="header-menu-head">
                <List>
                  <ListItemLink to={menu[0].url} primary={menu[0].label} icon={<ChevronRightIcon />} />
                </List>
              </div>
            </div>
          </div>
        }
        else {
          const icon = open ? <ExpandLessIcon /> :<MenuIcon />;
          const text = open ? "Hide Links" : "Show Links";

          return <div className="header-menu">
            <div className={css}>
              <div className="header-menu-head">
                <ListItem button onClick={toggle}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              </div>
              { menu.map(i => {
                return i.visible && <div>
                    <List>
                      <ListItemLink to={i.url} primary={i.label} icon={<ChevronRightIcon />} />
                    </List>
                  </div>
                })
              }
            </div>
          </div>
        }
        
      }
      else {
        
        return <div className="header-menu-vertical">
          { menu.map((i, index) => {
          return i.visible && <div key={index}>
              <ListItemLink to={i.url} primary={i.label} icon={<ChevronRightIcon />} />
            </div>
          }) }
          </div>
      }
    }

    render() {
      const title = this.props.title;
      const page = this.props.page;
      const menu = this.props.menu;
      const css = (this.props.drawer 
        ? this.props.model.getHeaderCss()
        : "header");
      const pagecss = (this.props.nameCentered 
        ? "header-page header-page-centered"
        : "header-page");

      return(
        <div className={css}>
          <div className="header-title">
            <Typography variant="h3">{title}</Typography>
          </div>
          <div className={pagecss}>
            <Typography variant="h4">{page}</Typography>
            {
              menu 
              ? this.createMenu(menu)
              : null
            }
          </div>
        </div>
      );
    }
  }
);
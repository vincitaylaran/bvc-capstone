///
/// ModelMenu - Serves as a model for menu-drawer.
///
import { observable } from "mobx";

/// Model for logging-in.
export const ModelMenu = observable({
    open: true,
    headerOpen: true,
    menuCss: "drawer drawerOpen",
    pageCss: "content",
    headerCss: "header header-drawer-open",
});

ModelMenu.getOpen = function() {
    return this.open;
}

ModelMenu.getMenuCss = function() {
    return this.menuCss;
}

ModelMenu.getPageCss = function() {
    return this.pageCss;
}

ModelMenu.toggle = function() {
    this.open = !this.open;
    this.menuCss = (this.open ? "drawer drawerOpen" : "drawer drawerClose");
    this.pageCss = (this.open ? "content" : "content content-min");
    this.headerCss = (this.open ? "header header-drawer-open" : "header header-drawer-min");
}

/**********
 * Header *
 **********/

ModelMenu.getHeaderOpen = function() {
    return this.headerOpen;
}

ModelMenu.getHeaderCss = function() {
    return this.headerCss;
}

ModelMenu.toggleHeader = function() {
    ModelMenu.headerOpen = !ModelMenu.headerOpen;
}
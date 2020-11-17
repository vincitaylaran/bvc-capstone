import React, { Component } from "react";
import { observer } from "mobx-react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles/app.css";

// Dashboard/List group
import Dashboard from "./pages/page-home.js";
import Waitlist from "./pages/page-waitlist";
import Carousel from "./pages/page-carousel";
import PreCarousel from "./pages/page-precarousel";

// Analytics group
import ReportsPage from "./pages/page-report.js";

// Services group
import ServicesPage from "./pages/page-services.js";
import AddServicePage from "./pages/page-service-add.js";
import ServicePage from "./pages/page-service.js";
import ServiceFields from "./pages/page-servicefields.js";

// Roles group
import RolesPage from "./pages/page-roles.js";
import AddRoles from "./pages/page-role-add.js";
import UpdateRoles from "./pages/page-role-update.js";

// Users group
import UsersPage from "./pages/page-users.js";
import AddUserPage from "./pages/page-user-add.js";
import UserPage from "./pages/page-user.js";
import UserSchedulePage from "./pages/page-user-schedule.js";

// Administrative group
import AdministrationPage from "./pages/page-administration.js";
import DefaultFieldsPage from "./pages/page-defaultfields.js";

// Booking group
import Appointment from "./pages/page-appointment";

import WalkInBook from "./pages/page-walk-in-book";
import OfferedServicesPageV2 from "./pages/page-offered-services";

// Account group
import LoginPage from "./pages/page-login.js";
import ResetPage from "./pages/page-reset.js";
import ForgotPage from "./pages/page-forgot.js";
import Profile from "./pages/page-profile";
import MySchedulePage from "./pages/page-schedule.js";
import Suggestion from "./pages/page-suggestion";
import InvitePage from "./pages/page-invite.js"

// Others
import ErrorPage from "./pages/page-error.js";
import DrawerMenu from "./components/menu-drawer.js";
import ModalAlert from "./components/modal-alert.js";
import ModalProgress from "./components/modal-progress.js";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast.css";
import CloseIcon from "@material-ui/icons/Close";

///
/// App - the main body of the front-end.
/// Props
///   @model - ModelMain which holds all other models.
///
export default observer(
  class App extends Component {
    // On mount, check if there is a token. If there is a token and
    //  user currently not logged, log using the token.
    componentDidMount() {
      // Key used in saving to local storage.
      const key = this.props.model.loginModel.getTokenKey();

      // Token saved in local storage.
      const token = localStorage.getItem(key);

      // Check if user is currently logged.
      const isLogged = this.props.model.isLogged();

      // Set credentials if not log and token existing.
      if (token && !isLogged) {
        this.props.model.setCredentials(token);
      }
    }

    // On logout, clear token and reset all models.
    logout = (e) => {
      // Clear storage
      const key = this.props.model.loginModel.getTokenKey();
      localStorage.removeItem(key);

      // Reset models
      this.props.model.reset();
    };

    // Render event of react life-cycle.
    render() {
      const canDashboard = this.props.model.getCanDashboard();
      const canList = this.props.model.getCanLists();
      const canReports = this.props.model.getCanReports();
      const canServices = this.props.model.getCanServices();
      const canRoles = this.props.model.getCanRoles();
      const canUsers = this.props.model.getCanUsers();
      const canAdmin = this.props.model.getCanAdmin();
      const isLogged = this.props.model.isLogged();
      const pageClass = this.props.model.menuModel.getPageCss();

      return (
        <Router>
          <Switch>
            {/* DASHBOARD/LIST */}
            <Route
              exact
              path="/"
              render={(props) =>
                isLogged ? (
                  canDashboard ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <Dashboard model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/waitlist"
              render={(props) =>
                isLogged ? (
                  canDashboard ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <Waitlist model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/selectdisplay"
              render={(props) =>
                isLogged ? (
                  canList ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <PreCarousel model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/rotatedisplay"
              render={(props) =>
                isLogged ? (
                  canList ? (
                    <Carousel model={this.props.model} {...props} />
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            {/* ANALYTICS */}
            <Route
              exact
              path="/reports"
              render={(props) =>
                isLogged ? (
                  canReports ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <ReportsPage model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            {/* SERVICES */}

            <Route
              exact
              path="/services"
              render={(props) =>
                isLogged ? (
                  canServices ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <ServicesPage model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/service"
              render={(props) =>
                isLogged ? (
                  canServices ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <AddServicePage model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/service/:sid"
              render={(props) =>
                isLogged ? (
                  canServices ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <ServicePage model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/servicefields/:sid"
              render={(props) =>
                isLogged ? (
                  canServices ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <ServiceFields model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            {/* ROLES */}

            <Route
              exact
              path="/roles"
              render={(props) =>
                isLogged ? (
                  canRoles ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <RolesPage model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/role"
              render={(props) =>
                isLogged ? (
                  canRoles ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <AddRoles model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/role/:sid"
              render={(props) =>
                isLogged ? (
                  canRoles ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <UpdateRoles model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            {/* USERS */}

            <Route
              exact
              path="/users"
              render={(props) =>
                isLogged ? (
                  canUsers ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <UsersPage model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/user"
              render={(props) =>
                isLogged ? (
                  canUsers ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <AddUserPage model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/user/:sid"
              render={(props) =>
                isLogged ? (
                  canServices ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <UserPage model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/userschedule/:sid"
              render={(props) =>
                isLogged ? (
                  canServices ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <UserSchedulePage model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            {/* ADMINISTRATIVE */}

            <Route
              exact
              path="/admin"
              render={(props) =>
                isLogged ? (
                  canAdmin ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <AdministrationPage
                          model={this.props.model}
                          {...props}
                        />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/defaultfields"
              render={(props) =>
                isLogged ? (
                  canAdmin ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <DefaultFieldsPage
                          model={this.props.model}
                          {...props}
                        />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            {/* BOOKING */}

            <Route
              exact
              path="/walkinbook/:sid"
              render={(props) => (
                <WalkInBook {...props} model={this.props.model} />
              )}
            />

            <Route
              exact
              path="/appointment/:sid"
              render={(props) => (
                <Appointment model={this.props.model} {...props} />
              )}
            />
            <Route
              exact
              path="/feedback"
              render={(props) => <Suggestion model={this.props.model} {...props} />}
            />

            {/* Temporary name for the future look of the offered services page. */}
            <Route
              exact
              path="/offeredservices"
              render={(props) => (
                <OfferedServicesPageV2 model={this.props.model} {...props} />
              )}
            />

            {/* ACCOUNT */}

            <Route
              exact
              path="/profile"
              render={(props) =>
                isLogged ? (
                  canDashboard ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <Profile model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/feedback"
              render={(props) =>
                isLogged ? (
                  canDashboard ? (
                    <div>
                      <DrawerMenu
                        model={this.props.model}
                        logout={this.logout}
                      />
                      <div className={pageClass}>
                        <Suggestion model={this.props.model} {...props} />
                      </div>
                    </div>
                  ) : (
                    <ErrorPage model={this.props.model} {...props} />
                  )
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/myschedule"
              render={(props) =>
                isLogged ? (
                  <div>
                    <DrawerMenu model={this.props.model} logout={this.logout} />
                    <div className={pageClass}>
                      <MySchedulePage model={this.props.model} {...props} />
                    </div>
                  </div>
                ) : (
                  <LoginPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/forgot"
              render={(props) =>
                !isLogged ? (
                  <ForgotPage model={this.props.model} {...props} />
                ) : (
                  <ErrorPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/reset/:sid"
              render={(props) =>
                !isLogged ? (
                  <ResetPage model={this.props.model} {...props} />
                ) : (
                  <ErrorPage model={this.props.model} {...props} />
                )
              }
            />

            <Route
              exact
              path="/invite/:sid"
              render={(props) =>
                <InvitePage model={this.props.model} {...props} logout={this.logout} />
              }
            />

            {/* OTHERS */}
            <Route
              render={(props) => (
                <ErrorPage model={this.props.model} {...props} />
              )}
            />
          </Switch>

          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
            toastClassName="toast-container"
            closeButton={<CloseIcon />}
          />

          <ModalAlert model={this.props.model} />
          <ModalProgress model={this.props.model.progressModel} />
        </Router>
      );
    }
  }
);

import React from "react";
import {
  Button,
  Layout,
  Menu,
  Breadcrumb,
  Avatar,
  Row,
  Col,
  PageHeader,
  Popover,
} from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
  UnorderedListOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import logo from "../logo.svg";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import SDCForm from "./SDCForm.js";
import SDCViewForm from "./SDCViewForm.js";
import XMLUploader from "../components/XMLUploader";
import LoginPage from "../components/LoginPage";
import FormList from "../components/FormList";
import SignUpPage from "../components/SignUpPage";
import HomePage from "../components/HomePage";
import PreviousFormsCompleted from "../components/PreviousFormsCompleted";
import { authenticate, getAccessToken, getUsername } from "../Authenticater";
import Cookies from "js-cookie";

const { Header, Content, Footer, Sider } = Layout;

class MainSider extends React.Component {
  /*************************************************/
  /*             LOCAL PROPERTIES                 */
  /***********************************************/
  state = {
    isAuthenticated: false,
    collapsed: false,
    breadcrumbNameMap: {
      "/home": "Home",
      "/forms": "Forms",
      "/forms/new": "New",
      "/login": "Login",
      "/register": "SignUp",
      "/previousforms": "PreviousFormsCompleted",
    },
    routes: {
      "/home": "1",
      "/forms": "2",
      "/forms/new": "3",
      "/login": "4",
      "/register": "5",
      "/previousforms": "6",
    },
    username: "",
    access_token: "",
    selectedKeys: [],
    loading: false,
    iconLoading: false,
  };

  enterLoading = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 8000);
  };

  enterIconLoading = () => {
    this.setState({ iconLoading: true });
    setTimeout(() => {
      this.setState({ iconLoading: false });
    }, 8000);
  };

  /*************************************************/
  /*              REQUEST METHODS                 */
  /***********************************************/

  checkLoggedIn = () => {
    authenticate().then((res) => {
      if (res.isAuthenticated) {
        this.setState({
          isAuthenticated: res.isAuthenticated,
          username: getUsername(),
          access_token: getAccessToken(),
        });
        console.log("hi");
      } else {
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register"
        ) {
          window.location.pathname = "/login";
        }
      }
    });
  };

  /*************************************************/
  /*              EVENT HANDLERS                  */
  /***********************************************/

  componentDidMount() {
    // Authenticate before doing anything
    this.checkLoggedIn();

    // We select the Menu Item for the current page (so it is highlighted)
    for (var key in this.state.routes) {
      if (key.length > 1 && window.location.href.includes(key)) {
        this.setState({ selectedKeys: [this.state.routes[key]] });
      }
    }
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  /*************************************************/
  /*                  RENDER                      */
  /***********************************************/

  renderBreadcrumbs = () => {
    /* For each path component in the URL, we display a navigational breadcrump */
    window.location.pathname.split("/").map((v, index) => {
      if (v.trim() !== "") {
        const pathSnippets = window.location.pathname
          .split("/")
          .filter((i) => i);
        const url = `/${pathSnippets.slice(0, index).join("/")}`;
        //console.log("url", url);
        return (
          <Breadcrumb.Item key={url}>
            <a href={url}>
              {url in this.state.breadcrumbNameMap
                ? this.state.breadcrumbNameMap[url]
                : url.substr(url.lastIndexOf("/") + 1)}
            </a>
          </Breadcrumb.Item>
        );
      }

      return "";
    });
  };

  renderUserAvatar = (size = 32) => {
    return (
      <Avatar
        size={size}
        icon={<UserOutlined />}
        style={{ background: "#f56a00" }}
      />
    );
  };

  render() {
    // Card to display when the user avater is clicked in the header
    let userCard = (
      <div style={{ width: 300, borderRadius: 0 }}>
        <Row type="flex" justify="center" align="middle">
          {this.renderUserAvatar(48)}
        </Row>
        <Row type="flex" justify="center" align="middle">
          <PageHeader
            title={this.state.username}
            style={{ paddingRight: 12 }}
          />
        </Row>
        <Row type="flex" justify="center" align="middle">
          <Button
            loading={this.state.loading}
            onClick={() => {
              this.enterLoading();
              Cookies.remove("access_token");
              Cookies.remove("username");
              window.location.href = "/login";
            }}
          >
            Log Out
          </Button>
        </Row>
      </div>
    );

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo">
            <img src={logo} className="App-logo" alt="logo" />
          </div>

          <Menu mode="inline" selectedKeys={this.state.selectedKeys}>
            <Menu.Item
              key="1"
              onClick={() => {
                window.location.href = "/home";
              }}
            >
              <DesktopOutlined />
              <span>Home</span>
            </Menu.Item>
            <Menu.Item
              key="2"
              onClick={() => {
                window.location.href = "/forms";
              }}
            >
              <UnorderedListOutlined />
              <span>Forms</span>
            </Menu.Item>
            <Menu.Item
              key="6"
              onClick={() => {
                window.location.href = "/previousforms";
              }}
            >
              <FileSearchOutlined />
              <span>Previous Forms</span>
            </Menu.Item>
            <Menu.Item
              key="3"
              onClick={() => {
                window.location.href = "/forms/new";
              }}
            >
              <PieChartOutlined />
              <span>Upload Form</span>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout className="site-layout" theme="dark">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <Row type="flex">
              <Col span={22}>
                <PageHeader title="Medical Form Centre" />
              </Col>

              {
                /* Only display the avater if there is a username*/
                this.state.username != "" ? (
                  <Col span={2}>
                    <Popover content={userCard} overlayClassName="poppy">
                      {this.renderUserAvatar()}
                    </Popover>
                  </Col>
                ) : (
                  ""
                )
              }
            </Row>
          </Header>
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              {this.renderBreadcrumbs()}
            </Breadcrumb>

            <BrowserRouter>
              <div
                className="site-layout-background"
                style={{ padding: 24, minHeight: 360 }}
              >
                <Switch>
                  <Route
                    path="/forms/view/:session_id"
                    render={(props) => <SDCViewForm {...props} />}
                  />
                  <Route
                    path="/forms/form/:id"
                    render={(props) => <SDCForm {...props} />}
                  />
                  <Route path="/forms/new" component={XMLUploader} />
                  <Route
                    path="/forms"
                    render={(props) => (
                      <FormList
                        {...props}
                        access_token={this.state.access_token}
                      />
                    )}
                  />
                  <Route
                    path="/previousforms"
                    render={(props) => (
                      <PreviousFormsCompleted
                        {...props}
                        access_token={this.state.access_token}
                      />
                    )}
                  />
                  <Route path="/login" component={LoginPage} />
                  <Route path="/register" component={SignUpPage} />
                  <Route path="/" component={HomePage} />
                </Switch>
              </div>
            </BrowserRouter>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            CSC302 Project Phase 2 ©2020 Created by FellowDevs
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default MainSider;

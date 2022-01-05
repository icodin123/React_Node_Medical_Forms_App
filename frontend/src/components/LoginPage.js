import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  PageHeader,
  Divider,
  Row,
  Col,
  Checkbox,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import authenticate from "../Authenticater";

class LoginPage extends Component {
  state = {
    username: null,
    password: null,
    isLoadingLogin: false,
  };

  layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  setUsername = (e) => {
    this.setState({ username: e.target.value });
  };

  setPassword = (e) => {
    this.setState({ password: e.target.value });
  };

  onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  onSubmit = async (e) => {
    if (this.state.username && this.state.password) {
      this.setState({ isLoadingLogin: true });

      const res = await authenticate(this.state.username, this.state.password);

      this.setState({ isLoadingLogin: false });

      if (res.isAuthenticated) {
        window.location.pathname = "/home";
      }
    }
  };

  render() {
    return (
      <div>
        <Row type="flex" justify="center">
          <PageHeader className="big-page-header" title="Login" />
        </Row>
        <Divider />

        <Form {...this.layout}>
          <Row type="flex" justify="center">
            <Col span={5}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Enter your username" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  onChange={(e) => this.setUsername(e)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row type="flex" justify="center">
            <Col span={5}>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Enter your password" }]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="Password"
                  placeholder="Password"
                  onChange={(e) => this.setPassword(e)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row type="flex" justify="center">
            <Col span={5} offset={5}>
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Row type="flex" justify="center">
            <Col span={5}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={this.state.isLoadingLogin}
                  onClick={(e) => {
                    this.onSubmit(e);
                  }}
                >
                  Log in
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Row type="flex" justify="center">
            <a href="/register">Create account </a>
          </Row>
        </Form>
      </div>
    );
  }
}

export default LoginPage;

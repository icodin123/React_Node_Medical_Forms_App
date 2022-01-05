import React, { Component } from "react";

import { Form, Input, Button, PageHeader, Divider, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

class SignUpPage extends Component {
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

  redirectToLogin = () => {
    window.location.href = "login";
  };

  // valid password should contain at least one number and at least one
  // letter and should be at least 4 characters long
  isValidPassword = (password) => {
    if (password.length < 4) {
      return false;
    } else if (password.search(/[a-zA-Z]/) == -1) {
      return false;
    } else if (password.search(/\d/) == -1) {
      return false;
    }
    return true;
  };

  // valid username should be at least 2 characters long and should contain
  // only lowercase letters
  isValidUsername = (username) => {
    if (username.length < 2) {
      return false;
    } else if (username != username.toLowerCase()) {
      return false;
    }
    return true;
  };

  onSubmit = async (e) => {
    if (this.state.username && this.state.password) {
      if (!this.isValidUsername(this.state.username)) {
        alert(
          "Username should be at least 2 characters long and contain only lowercase letters"
        );
        return;
      }
      if (!this.isValidPassword(this.state.password)) {
        alert(
          "Password should contain at least one number, at least one letter and be at least 4 characters long"
        );
        return;
      }

      this.setState({ isLoadingLogin: true });

      fetch("http://localhost:8080/register", {
        method: "post",
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status == 200) {
            // redirect to the login page
            this.redirectToLogin();
          } else {
            alert(
              "Could not create account. User with provided username already exists."
            );
            console.log("Cound not create account");
            response.json().then((data) => {
              console.log("Error", data);
            });
          }

          this.setState({ isLoadingLogin: false });
        })
        .catch((error) => {
          console.log("Error", error);
          console.log("cannot connect to the server");
        });
    }
  };

  render() {
    return (
      <div>
        <Row type="flex" justify="center">
          <PageHeader className="big-page-header" title="Register" />
        </Row>
        <Divider />

        <Form
          {...this.layout}
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
        >
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
                  Sign Up
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Row type="flex" justify="center">
            <a href="/login">Already have an account?</a>
          </Row>
        </Form>
      </div>
    );
  }
}

export default SignUpPage;

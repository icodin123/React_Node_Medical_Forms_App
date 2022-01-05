import React, { Component } from "react";
import { Button, PageHeader, Divider, Row, Col, Typography, Steps } from "antd";
import { getAccessToken, getUsername } from "../Authenticater";

const { Title } = Typography;
const { Step } = Steps;

const steps = [
  {
    title: "Select form to fill",
    content: "https://i.imgur.com/irJ7pnS.png",
  },
  {
    title: "Fill form",
    content: "https://i.imgur.com/AC2TRnQ.png",
  },
  {
    title: "Submit it",
    content: "https://i.imgur.com/iwIuFQI.png",
  },
  {
    title: "Review completed forms",
    content: "https://i.imgur.com/nMNIRKU.png",
  },
];

const steps2 = [
  {
    title: "Upload Form",
    content: "https://i.imgur.com/unNYFqd.png",
  },
  {
    title: "View Form",
    content: "https://i.imgur.com/4fnvCPi.png",
  },
];

class HomePage extends Component {
  state = {
    formList: [],
    completedForms: [],
    current: 0,
    current2: 0,
  };

  layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  next2() {
    const current2 = this.state.current2 + 1;
    this.setState({ current2 });
  }

  prev2() {
    const current2 = this.state.current2 - 1;
    this.setState({ current2 });
  }

  async componentDidMount() {
    this.setState({ formList: [], username: null });

    const request1 = new Request("http://localhost:8080/form", {
      method: "GET",
      headers: {
        "x-access-token": getAccessToken(),
      },
    });

    const response = await fetch(request1);
    const data = await response.json();
    const username = getUsername();
    this.setState({ formList: data.forms });
    this.setState({ username: username });

    const request2 = new Request(
      "http://localhost:8080/sessions" + "/" + username,
      {
        method: "GET",
        headers: {
          "x-access-token": getAccessToken(),
        },
      }
    );
    const response2 = await fetch(request2);
    const data2 = await response2.json();
    console.log(data2.result);

    //Get only forms that have been submitted
    var submittedData = [];
    for (let i = 0; i < data2.result.length; i++) {
      if (data2.result[i].submitted) {
        submittedData.push(data2.result[i]);
      }
    }

    this.setState({ completedForms: submittedData });
  }

  render() {
    var divStyle = { "font-size": "50px" };

    return (
      <div>
        <Row type="flex" justify="center">
          <h1 style={divStyle}>Welcome back {this.state.username}!</h1>
        </Row>
        <Divider />

        <Row gutter={[100, 0]}>
          <Col offset={7} span={5}>
            <h1>Forms Available</h1>
            <br />
            <Row type="flex" justify="center">
              <Title level={1}>
                {" "}
                {this.state.formList ? this.state.formList.length : 0}
              </Title>
            </Row>
          </Col>

          <Col span={6}>
            <h1>Forms Completed</h1>
            <br />
            <Row type="flex" justify="center">
              <Title level={1}>
                {this.state.completedForms
                  ? this.state.completedForms.length
                  : 0}
              </Title>
            </Row>
          </Col>
        </Row>
        <br />
        <br />
        <Col>
          <PageHeader title="How to upload a form" style={{ paddingLeft: 0 }} />
          <br />
        </Col>
        <Steps current={this.state.current2}>
          {steps2.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">
          <img src={[steps2[this.state.current2].content]} />
        </div>
        <div className="steps-action">
          {this.state.current2 < steps2.length - 1 && (
            <Button type="primary" onClick={() => this.next2()}>
              Next
            </Button>
          )}
          {this.state.current2 === steps2.length - 1}
          {this.state.current2 > 0 && (
            <Button style={{ margin: 8 }} onClick={() => this.prev2()}>
              Previous
            </Button>
          )}
        </div>
        <br />
        <br />
        <Col>
          <PageHeader title="How to fill a form" style={{ paddingLeft: 0 }} />
          <br />
        </Col>
        <Steps current={this.state.current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">
          <img src={[steps[this.state.current].content]} />
        </div>
        <div className="steps-action">
          {this.state.current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next()}>
              Next
            </Button>
          )}
          {this.state.current === steps.length - 1}
          {this.state.current > 0 && (
            <Button style={{ margin: 8 }} onClick={() => this.prev()}>
              Previous
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default HomePage;

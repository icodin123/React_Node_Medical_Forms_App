import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  PageHeader,
  Divider,
  Row,
  Col,
  Radio,
  Spin,
  Result,
} from "antd";
import { getAccessToken, getUsername } from "../Authenticater";

class SDCForm extends Component {
  state = {
    title: "",
    id: "",
    session_id: "",
    sections: [],
    submit: false,
  };

  layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  /*************************************************/
  /*              REQUEST METHODS                 */
  /***********************************************/

  getForm = async () => {
    // Get the form
    let request = new Request("http://localhost:8080/form/" + this.state.id, {
      method: "GET",
      headers: {
        "x-access-token": getAccessToken(),
      },
    });
    let res = await fetch(request);
    const formData = await res.json();
    console.log("RES: ", formData);

    this.setState({ sections: formData.forms[0].form.sections });
    this.setState({ title: formData.forms[0].name });

    // We also want to request a session
    request = new Request("http://localhost:8080/session", {
      method: "post",
      body: JSON.stringify({
        formId: this.state.id,
        userId: getUsername(),
      }),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": getAccessToken(),
      },
    });
    res = await fetch(request);
    const sessionData = await res.json();
    this.setState({ session_id: sessionData.result[0].session_id });
  };

  sendForm = async (form_values) => {
    // Collect all the answers to send in request
    let answers = [];
    for (let key in form_values) {
      answers.push({
        formId: this.state.id,
        questionId: key,
        userId: getUsername(),
        sessionId: this.state.session_id,
        answer: form_values[key],
      });
    }

    // Send the answers
    let request = new Request("http://localhost:8080/answers", {
      method: "post",
      body: JSON.stringify(answers),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": getAccessToken(),
      },
    });
    let res = await fetch(request);

    // Set the submit state to true to show the success screen
    if (res.status === 200) {
      // Submit the session (toggle submission)
      request = new Request("http://localhost:8080/toggle-submit-session", {
        method: "post",
        body: JSON.stringify({ session_id: this.state.session_id }),
        headers: {
          "Content-Type": "application/json",
          "x-access-token": getAccessToken(),
        },
      });
      res = await fetch(request);

      if (res.status == 200) this.setState({ submit: true });
    }
  };

  /*************************************************/
  /*              EVENT HANDLERS                  */
  /***********************************************/

  async componentDidMount() {
    await this.setState({ id: this.props.match.params.id });
    this.getForm();
  }

  onFinish = (values) => {
    this.sendForm(values);
  };

  /*************************************************/
  /*                  RENDER                      */
  /***********************************************/

  renderSections = (sections) => {
    return sections.map((section) => {
      return (
        <div key={section.section_id}>
          <Row type="flex" justify="center" align="middle">
            <PageHeader title={section.section_title} />
          </Row>
          {this.renderQuestions(section.questions)}
          {section.subsections.length > 0
            ? this.renderSections(section.subsections)
            : ""}
          <Divider />
        </div>
      );
    });
  };

  renderQuestions(questions) {
    return questions.map((element) => {
      if (element["question_type"] === "ResponseField") {
        return (
          <Form.Item
            key={element["question_id"]}
            name={element["question_id"]}
            label={element["question"]}
            rules={[{ required: false, message: "This field is required" }]}
          >
            <Input placeholder={element["question"].replace(":", "")} />
          </Form.Item>
        );
      } else if (element["question_type"] === "ListField") {
        return (
          <Form.Item
            key={element["question_id"]}
            name={element["question_id"]}
            label={element["question"]}
            rules={[{ required: false, message: "This field is required" }]}
          >
            <Radio.Group style={{ display: "block", overflow: "auto" }}>
              {element["potential_answers"].map((pa, i) => {
                return (
                  <Radio key={i} value={pa.answer}>
                    {pa.answer}
                  </Radio>
                );
              })}
            </Radio.Group>
          </Form.Item>
        );
      } else {
        return "";
      }
    });
  }

  render() {
    let form = (
      <div>
        <Row type="flex" justify="center" align="middle">
          <PageHeader className="big-page-header" title={this.state.title} />
        </Row>
        <Divider />

        <Spin spinning={this.state.sections <= 0}>
          <Form {...this.layout} onFinish={this.onFinish}>
            <Row type="flex" justify="center" align="middle">
              <Col span={14}>{this.renderSections(this.state.sections)}</Col>
            </Row>

            <Row type="flex" justify="center" align="middle">
              <Button type="primary" htmlType="submit" style={{ width: "20%" }}>
                Submit
              </Button>
            </Row>
          </Form>
        </Spin>
      </div>
    );

    let result = (
      <Result
        status="success"
        title={"Successfully Submitted " + this.state.title + " Form"}
        subTitle={"Session ID: " + this.state.session_id}
        extra={[
          <Button
            type="primary"
            key="console"
            onClick={() => (window.location.href = "/forms")}
          >
            Go to Forms
          </Button>,
          <Button
            key="review"
            onClick={() => {
              window.location.href = "/forms/view/" + this.state.session_id;
            }}
          >
            View Submitted Form
          </Button>,
        ]}
      />
    );

    return !this.state.submit ? form : result;
  }
}

export default SDCForm;

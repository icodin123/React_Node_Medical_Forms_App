import React, { Component } from "react";
import { Form, PageHeader, Divider, Row, Col, Radio, Spin } from "antd";
import { getAccessToken } from "../Authenticater";

class SDCViewForm extends Component {
  state = {
    title: "",
    session_id: "",
    sections: [],
    answers: [],
  };

  layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  /*************************************************/
  /*              REQUEST METHODS                 */
  /***********************************************/

  getForm = async () => {
    // Get the session
    let request = new Request(
      "http://localhost:8080/session/" + this.state.session_id,
      {
        method: "GET",
        headers: {
          "x-access-token": getAccessToken(),
        },
      }
    );
    let res = await fetch(request);
    const sessionData = await res.json();
    console.log("SES: ", sessionData);

    let formId = sessionData.result[0].form_id;

    // Get the form
    request = new Request("http://localhost:8080/form/" + formId, {
      method: "GET",
      headers: {
        "x-access-token": getAccessToken(),
      },
    });
    res = await fetch(request);
    const formData = await res.json();
    this.setState({ sections: formData.forms[0].form.sections });
    this.setState({ title: formData.forms[0].name });

    // Get the ansewers
    request = new Request(
      "http://localhost:8080/answers/" + this.state.session_id,
      {
        method: "GET",
        headers: {
          "x-access-token": getAccessToken(),
        },
      }
    );
    res = await fetch(request);
    const answerData = await res.json();
    console.log("ANSWER: ", answerData);
    this.setState({ answers: answerData.result });
  };

  /*************************************************/
  /*              EVENT HANDLERS                  */
  /***********************************************/

  async componentDidMount() {
    await this.setState({ session_id: this.props.match.params.session_id });
    this.getForm();
  }

  onFinish = (values) => {
    console.log("Received values of form: ", values);
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
          <Form.Item key={element["question_id"]} label={element["question"]}>
            {this.state.answers
              .filter((i) => i.question_id == element["question_id"])
              .map((f) => f.answer)}
          </Form.Item>
        );
      } else if (element["question_type"] === "ListField") {
        return (
          <Form.Item key={element["question_id"]} label={element["question"]}>
            <Radio.Group
              style={{
                display: "block",
                overflowX: "auto",
                overflowY: "hidden",
              }}
            >
              {element["potential_answers"].map((pa, i) => {
                return (
                  <Radio
                    key={i}
                    value={i}
                    disabled={false}
                    checked={
                      this.state.answers
                        .filter((i) => i.question_id == element["question_id"])
                        .map((f) => f.answer == pa.answer)[0]
                    }
                  >
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
    return (
      <div>
        <Row type="flex" justify="center" align="middle">
          <PageHeader className="big-page-header" title={this.state.title} />
        </Row>
        <Divider />

        <Spin spinning={this.state.sections <= 0}>
          <Form
            {...this.layout}
            ref={this.formRef}
            onFinish={this.onFinish}
            style={{ backgroundColor: "#242528" }}
          >
            <Row type="flex" justify="center" align="middle">
              <Col span={14}>{this.renderSections(this.state.sections)}</Col>
            </Row>
          </Form>
        </Spin>
      </div>
    );
  }
}

export default SDCViewForm;

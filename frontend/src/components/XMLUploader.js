import React from "react";
import { Form, Upload, Button, PageHeader, Divider, Row } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { getAccessToken } from "../Authenticater";

class XMLUploader extends React.Component {
  state = {
    files: [],
  };

  render() {
    return (
      <div>
        <Row type="flex" justify="center" align="middle">
          <PageHeader className="big-page-header" title="Upload XML Form" />
        </Row>
        <Divider />

        <Form id="xmlForm">
          <Row type="flex" justify="center" align="middle">
            <Form.Item>
              <Form.Item name="dragger">
                <Upload.Dragger name="files" beforeUpload={this.docUpdate}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text" style={{ padding: 10 }}>
                    Click or drag XML files here to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload.
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Button
              form="xmlForm"
              type="primary"
              key="submit"
              htmlType="submit"
              onClick={this.onFormSubmit}
              style={{ width: "20%" }}
            >
              Upload
            </Button>
          </Row>
        </Form>
      </div>
    );
  }

  // send file to the back-end server
  sendFile = async (xml) => {
    const formData = new FormData();
    formData.append("xmlfile", xml);
    formData.append("name", xml.name.slice(0, -4));

    let request = new Request("http://localhost:8080/form", {
      method: "post",
      body: formData,
      headers: {
        "x-access-token": getAccessToken(),
      },
    });

    let res = await fetch(request);
    if (res.status == 201) {
      alert("Form was successfully uploaded to the server.");
    } else {
      alert("Could not upload form. Please check your internet connection.");
    }
  };

  // gets called when file changes
  docUpdate = (file) => {
    this.setState({ files: [...this.state.files, file] });
    return false;
  };

  // gets caled when file is uploaded
  onFormSubmit = (e) => {
    if (this.state.files) {
      e.preventDefault();
      this.sendFile(this.state.files[0]);
    }
  };
}

function xmlUpload() {
  return (
    <React.Fragment>
      <XMLUploader />
    </React.Fragment>
  );
}

export default xmlUpload;

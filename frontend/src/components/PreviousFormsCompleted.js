import React, { Component } from "react";
import { getAccessToken, getUsername } from "../Authenticater";

import {
  Radio,
  Button,
  PageHeader,
  Divider,
  Row,
  List,
  Avatar,
  Spin,
  Input,
} from "antd";
import InfiniteScroll from "react-infinite-scroller";
const { Search } = Input;

class PreviousFormsCompleted extends Component {
  state = {
    formList: [],
    search: "",
    previousFormList: [],
    flag: true,
    loading: true,
    value: 1,
  };

  layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  async componentDidMount() {
    const request = new Request(
      "http://localhost:8080/sessions" + "/" + getUsername(),
      {
        method: "GET",
        headers: {
          "x-access-token": getAccessToken(),
        },
      }
    );
    const response = await fetch(request);
    const data = await response.json();

    //adding form name attribute to each session
    for (let i = 0; i < data.result.length; i++) {
      const req = new Request(
        "http://localhost:8080/form/" + data.result[i].form_id,
        {
          method: "GET",
          headers: {
            "x-access-token": getAccessToken(),
          },
        }
      );
      const res = await fetch(req);
      const d = await res.json();
      var name = d.forms[0].name;

      data.result[i]["name"] = name;
    }

    //Get only forms that have been submitted
    var submittedData = [];
    for (let i = 0; i < data.result.length; i++) {
      if (data.result[i].submitted) {
        submittedData.push(data.result[i]);
      }
    }

    this.setState({ previousFormList: submittedData });
  }

  // Called when search type selected
  updateRadio = (e) => {
    console.log("radio checked", e.target.value);
    this.setState({
      value: e.target.value,
    });
  };

  updateSearch(event) {
    this.setState({ search: event.target.value.substr(0, 50) });
  }

  stopLoading() {
    this.setState({ loading: false });
  }

  render() {
    // Filter list of forms based on search bar value
    let filteredFormList = this.state.previousFormList.filter((item) => {
      if (item && item.name && item.session_id) {
        if (this.state.value === 1) {
          return (
            item.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !==
            -1
          );
        } else {
          return (
            item.session_id
              .toLowerCase()
              .indexOf(this.state.search.toLowerCase()) !== -1
          );
        }
      }
    });
    return (
      <div>
        <Row type="flex" justify="center">
          <PageHeader className="big-page-header" title="Completed Forms" />
        </Row>
        <Divider />
        <Search
          placeholder="Search for forms"
          value={this.state.search}
          onChange={this.updateSearch.bind(this)}
          size="large"
        />
        <br />
        <br />
        <Radio.Group onChange={this.updateRadio} value={this.state.value}>
          <Radio value={1}>By Name</Radio>
          <Radio value={2}>By Session</Radio>
        </Radio.Group>
        <br />
        <br />
        <InfiniteScroll pageStart={0}>
          <List
            dataSource={filteredFormList}
            renderItem={(item) => (
              <List.Item key={item.form_id}>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://www.seekpng.com/png/full/445-4453053_form-checkmark-password-icon-png-green.png" />
                  }
                  title={item.name + " (session_id: " + item.session_id + ")"}
                  description={item.last_updated}
                />
                <div>
                  <Button
                    onClick={() => {
                      window.location.href = "/forms/view/" + item.session_id;
                    }}
                  >
                    Review
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button
                    type="dashed"
                    onClick={() => {
                      window.location.href = "/forms/form/" + item.form_id;
                    }}
                  >
                    New
                  </Button>
                </div>
              </List.Item>
            )}
          >
            {this.state.loading && this.state.hasMore && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
    );
  }
}

export default PreviousFormsCompleted;

import React, { Component } from "react";
import { getAccessToken } from "../Authenticater";

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

class FormList extends Component {
  state = {
    formList: [],
    search: "",
    value: 1,
  };

  layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  async componentDidMount() {
    const request = new Request("http://localhost:8080/form", {
      method: "GET",
      headers: {
        "x-access-token": getAccessToken(),
      },
    });
    const response = await fetch(request);
    const data = await response.json();
    console.log(data.forms);
    this.setState({ formList: data.forms });
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

  render() {
    // Filter list of forms based on search bar value
    let filteredFormList = this.state.formList.filter((item) => {
      if (item && item.name && item.id) {
        if (this.state.value === 1) {
          return (
            item.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !==
            -1
          );
        } else {
          return (
            item.id.toLowerCase().indexOf(this.state.search.toLowerCase()) !==
            -1
          );
        }
      }
    });
    return (
      <div>
        <Row type="flex" justify="center">
          <PageHeader className="big-page-header" title="Medical Forms" />
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
          <Radio value={2}>By ID</Radio>
        </Radio.Group>
        <br />
        <br />
        <InfiniteScroll pageStart={0}>
          <List
            dataSource={filteredFormList}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://www.iconsdb.com/icons/preview/white/report-3-xxl.png" />
                  }
                  title={item.name}
                  description={item.id}
                />
                <div>
                  <Button
                    type="primary"
                    onClick={() => {
                      window.location.href = "/forms/form/" + item.id;
                    }}
                  >
                    Fill Out
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

export default FormList;

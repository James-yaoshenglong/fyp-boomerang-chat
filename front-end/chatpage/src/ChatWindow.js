/*global chrome*/
import React from 'react';
import { MessageList, Input, Button } from 'react-chat-elements';
import { ChatList } from "react-chat-elements"
// import { Payload, PayloadWithRes } from './ssnet_pb';
// import { SSNetServiceClient } from './ssnet_grpc_web_pb.js'


class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        user: null,
        msgDataList: [],
        sendMsg: "",
        display: false,
        chatListSource: []
    };
    this.sendButtonClick = this.sendButtonClick.bind(this); //need to bind this in init
    this.chatItemClick = this.chatItemClick.bind(this);
    this.recv = this.recv.bind(this);
    this.addButtonClick = this.addButtonClick.bind(this)

    chrome.runtime.onMessage.addListener(this.recv);
  }

  recv(request, sender, sendResponse){
    let list = this.state.msgDataList;
    list.push({
      position: 'left',
      type: 'text',
      text: request.message,
      date: new Date(),
    });
    this.setState({msgDataList: list});
  }

  send(text){
    // let client = new SSNetServiceClient(('http://localhost:8080'));
    // let request = new PayloadWithRes();
    // // request.setReserved(1234);
    // request.setData("abcded");
    // client.sendMsg(request, {}, function(err, response) {
    //   console.log('123');
    //   console.log(response.getData());
    // });

    // var bg = chrome.extension.getBackgroundPage();
    // console.log(bg);
    // bg.send();
    chrome.runtime.sendMessage({
      action: 'send',
      msg: text
    });
  }

  sendButtonClick() {
    let list = this.state.msgDataList;
    list.push({
      position: 'right',
      type: 'text',
      text: this.state.sendMsg,
      date: new Date(),
    });
    this.setState({msgDataList: list});
    this.send(this.state.sendMsg);
    this.setState({
      sendMsg: "",
    });
  }

  addButtonClick() {
    let name = prompt("Please input your friend's name");
    let list = this.state.chatListSource;
    if (name === "Alice"){
      list.push({
        avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
        alt: name+'_avatar',
        title: 'Alice',
        subtitle: "",
        date: new Date(),
        unread: 0,
      });
    }
    else {
      list.push({
        avatar: 'https://avatars.githubusercontent.com/u/41473129?v=4',
        alt: name+'_avatar',
        title: name,
        subtitle: "",
        date: new Date(),
        unread: 0,
      });
    }
    this.setState({chatListSource: list});
    chrome.runtime.sendMessage({
      action: 'add',
      title: name
    });
  }

  chatItemClick(item) {
    // console.log("the clicked item is ", item);
    let key = prompt("Please enter shared secret key with this friend");
    chrome.runtime.sendMessage({
      action: 'key',
      msg: key,
      title: item.title
    });
    this.setState({display: true});
  }

  render() {
    let content = '';
    if (this.state.display === true) {
      content = (
        <div>
          <MessageList
            className='message-list'
            lockable={true}
            toBottomHeight={'100%'}
            dataSource={this.state.msgDataList}
          />
          <div className='bottom-div'>
            <Input
              onChange={ (e) => {this.setState({sendMsg: e.target.value});} }
              placeholder="Type here..."
              multiline={true}
            />
            <Button text={"Send"} onClick={this.sendButtonClick} title="Send" />
          </div>
        </div>
      )
    }
    return (
      <div className='chat-window'>
        <div className='chat-list-container'>
          <Button className='add-button' text={"Add"} onClick={this.addButtonClick} title="Add" />
          <ChatList
            className='chat-list'
            onClick={this.chatItemClick}
            dataSource= {this.state.chatListSource}
          />
        </div>
        <div className='chat-container'>
          {content}
        </div>
      </div>
    );
  }
}

export default ChatWindow;
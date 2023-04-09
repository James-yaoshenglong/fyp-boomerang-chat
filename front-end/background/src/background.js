import { Payload, PayloadWithRes, Empty } from './ssnet_pb';
import { SSNetServiceClient } from './ssnet_grpc_web_pb.js';

let CryptoJS = require("crypto-js");
let key_phase = "testing_key";
let package_id = Math.floor(Math.random() * 10000);

let client = new SSNetServiceClient(('http://localhost:8080'));
let send_id_list = {};
send_id_list["random"] = Math.floor(Math.random() * 100000);
let current_sender = "random";

let startTime = new Date();
let next10sec = (10 - (startTime.getSeconds() % 10) ) * 1000 + 1000-startTime.getMilliseconds();

let msgQueue = [];

function send(){
    let request = new PayloadWithRes();
    let msg;
    if(msgQueue.length > 0){
        // console.log("what is the current msg to sent");
        msg = msgQueue[0];
        // console.log(msg)
    }
    else{
        msg = 'Empty';
    }

    let enc_msg = CryptoJS.AES.encrypt(msg, key_phase).toString();

    request.setData(enc_msg);
    request.setPackageid(package_id);
    request.setSendid(send_id_list[current_sender]);
    request.setRecvid(send_id_list[current_sender]);

    console.log("Send Message out", new Date());
    client.sendMsg(request, {}, function(err, response) {
        // console.log('123');
        // console.log(response);
        let request = new PayloadWithRes();
        request.setData("Empty");
        request.setPackageid(package_id);
        request.setSendid(send_id_list[current_sender]);
        request.setRecvid(send_id_list[current_sender]);
        setTimeout(() => {
            client.recvMsg(request, {}, function(err, response) {
                // console.log('321');
                // console.log("received msg is ", response.getData());
                // console.log("msg is ", msg);
                let res_data = response.getData();
                if (res_data) {
                    res_data = CryptoJS.AES.decrypt(res_data, key_phase).toString(CryptoJS.enc.Utf8);
                    // console.log("res_data is ", res_data);
                    if(res_data === msg){
                        console.log("Get fake response, boomerang");
                    } 
                    else{
                        console.log("Get real response");
                        msgQueue.shift();
                        if(res_data != "Empty" && res_data != null){
                            chrome.runtime.sendMessage({ message: res_data});
                        }
                    }
                }
            });
        }, 1000);
    });
}

function updateMsgQueue(msg){
    msgQueue.push(msg);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'send') {
      updateMsgQueue(request.msg);
    }
    else if (request.action === 'key') {
        current_sender = request.title;
        key_phase = request.msg;
        package_id = parseInt(CryptoJS.MD5(request.msg).toString().substring(0,5), 16);
    }
    else if (request.action === 'add') {
        let name = request.title
        send_id_list[name] = Math.floor(Math.random() * 100000);
    }
});


setTimeout(() => {
    console.log("Round sync to ", new Date());
    setInterval(send, 10000);
  }, next10sec);
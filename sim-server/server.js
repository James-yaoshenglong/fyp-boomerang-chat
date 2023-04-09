var PROTO_PATH = __dirname + '/ssnet.proto';

var assert = require('assert');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var ssnet = protoDescriptor.ssnet;

// var currentMsg;
var messageList = {};

function doSayHello(call, callback) {
  let package_id = call.request.packageId;
  // currentMsg = call.request.data;
  let send_id = call.request.sendId;
  if (!messageList.hasOwnProperty(package_id)){
    messageList[package_id] = {};
  }
  if(messageList.hasOwnProperty(package_id)){
    if(Object.keys(messageList[package_id]).length === 0){
      messageList[package_id][send_id] = call.request.data;
    }
    else if(Object.keys(messageList[package_id]).length === 1){
      let temp = messageList[package_id][Object.keys(messageList[package_id])[0]];
      messageList[package_id][Object.keys(messageList[package_id])[0]] = call.request.data;
      messageList[package_id][send_id] = temp;
    }
  }

  console.log("Received message from sender", send_id, "with content", call.request.data);

  callback(null, {
  });
}

function reply(call, callback) {
  let currentMsg;
  let package_id = call.request.packageId;
  let send_id = call.request.sendId;
  if(package_id in messageList){
    currentMsg = messageList[package_id][send_id];
    delete messageList[package_id][send_id];
  }
  console.log("Rely to ", send_id, "with content", currentMsg);
  callback(null, {
    data: currentMsg
  });
}

function getServer() {
  var server = new grpc.Server();
  server.addService(ssnet.SSNetService.service, {
    sendMsg: doSayHello,
    recvMsg: reply
  });
  return server;
}

if (require.main === module) {
  var server = getServer();
  server.bindAsync(
    '0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
      assert.ifError(err);
      server.start();
  });
  console.log("Boomerang simulation server starts\n");
}

exports.getServer = getServer;
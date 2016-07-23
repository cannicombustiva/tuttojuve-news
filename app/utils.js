'use strict'

const fs = require('fs')

let receivedMessage = (event) => {
  let senderID = event.sender.id;
  let recipientID = event.recipient.id;
  let timeOfMessage = event.timestamp;
  let message = event.message;


  let dataToAppend = "Received message for user" + senderID + " and page " + recipientID +" at " + timeOfMessage + " with message: " + JSON.stringify(message)
  fs.appendFile('fb.log', dataToAppend, (err) => {

  })

  let messageId = message.mid;

  // You may get a text or attachment but not both
  let messageText = message.text;
  let messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    switch (messageText) {
      case 'image':
        //sendImageMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

let sendTextMessage = (recipientId, messageText) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

let callSendAPI = (messageData) => {
  const PAGE_ACCESS_TOKEN = 'EAAZAmMSjBQXoBADNwB62kYUJX9Kdhm4zbvAOfkLdYRKROOv96rN5tpKGE4F7WCoLOB4WZCmvDLCiFydY1BtE0ID2JnXLMUn9ivo4HMv5N6hOo9j9MjQvhtUOpCeXZAMULgnTyhy8ZAZCEFV7FImMw5CGVyzoK1dzZAwUL42vvFLQZDZD'
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      let recipientId = body.recipient_id
      let messageId = body.message_id

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId)
    } else {

      let dataToAppend = "Unable to send message."
      fs.appendFile('fb.log', dataToAppend, (err) => {
    
      })
      console.error("Unable to send message.")
      console.error(response)
      console.error(error)
    }
  })
}

module.exports = receivedMessage

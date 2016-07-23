'use strict'

const express = require('express')
const app = express()

const fs = require('fs')

let utils = require('./utils.js')



const PORT = 80
const VALIDATION_TOKEN = 'a7wyrs7835ysoritu94w8tsv9iu9o'

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
       req.query['hub.verify_token'] === VALIDATION_TOKEN) {
     console.log("Validating webhook")
     res.status(200).send(req.query['hub.challenge'])
   } else {
     console.error("Failed validation. Make sure the validation tokens match.")
     res.sendStatus(403)
   }
})

app.post('/webhook', (req, res) => {
  let data = req.body

  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach((pageEntry) => {
      let pageID = pageEntry.id
      let timeOfEvent = pageEntry.time

      // Iterate over each messaging event
      pageEntry.messaging.forEach((messagingEvent) => {
         if (messagingEvent.message) {
          utils.receivedMessage(messagingEvent)
        } else {
          let dataToAppend = "Webhook received unknown messagingEvent: " + messagingEvent
          fs.appendFile('fb.log', dataToAppend, (err) => {

          })

        }
      })
    })

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200)
  }
})

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT + '!')
})

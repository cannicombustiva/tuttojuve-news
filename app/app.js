'use strict'

const express = require('express')
const app = express()

const fs = require('fs')
let bugsnag = require("bugsnag")
let utils = require('./utils.js')
bugsnag.register("c0788fc5ba05eab7756c33f96f8f1912")
app.use(bugsnag.requestHandler)
app.use(bugsnag.errorHandler)


const bodyParser = require('body-parser')
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// Process application/json
app.use(bodyParser.json())



const PORT = 80
const VALIDATION_TOKEN = 'a7wyrs7835ysoritu94w8tsv9iu9o'

app.get('/webhook', (req, res) => {
    bugsnag.autoNotify(() => {
        if (req.query['hub.mode'] === 'subscribe' &&
            req.query['hub.verify_token'] === VALIDATION_TOKEN) {
            console.log("Validating webhook")
            res.status(200).send(req.query['hub.challenge'])
        } else {
            console.error("Failed validation. Make sure the validation tokens match.")
            res.sendStatus(403)
        }
    })

})

app.post('/webhook', (req, res) => {
    bugsnag.autoNotify(() => {
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
})

app.listen(PORT, () => {
    console.log('Example app listening on port ' + PORT + '!')
})

'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const router = express.Router()
const aliveTime = new Date().getTime()
const PORT = process.env.PORT || 3002; 
const Handler = require("./index")

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', (req, res) => {
  req.json({ aliveTime })
})

router.use(async function(req, res){
  const event = {
    "resource": req.path,
    "path": req.path,
    "httpMethod": req.method,
    "headers": req.headers,
    "queryStringParameters": req.query,
    "pathParameters": req.params,
    "stageVariables": null,
    "body": JSON.stringify(req.body),
    "isBase64Encoded": false,
    "requestContext": {
      "authorizer": {}
    }
  }

  try{
    const response = await Handler.handler(event)
    res
      .set(response.headers)
      .status(response.statusCode)
    
    const data = response.body
      
    if(req.path.indexOf("render") < 0){
      res.send(JSON.parse(data))
    }else{
      res.send(data)
    }

  }catch(e){
    console.error(e)
    res.status(500).send(e)
  }
})

app.use('/v1/', router)
app.listen(PORT)

console.log(`Listen on http://0.0.0.0:${PORT}`)
module.exports = app
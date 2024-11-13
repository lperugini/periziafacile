const express = require("express");
const app = express();
const amqp = require("amqplib");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/", (req, res) => {
  res.send("Real-Time Application");
});

amqp
  .connect("amqp://localhost")
  .then((connection) => connection.createChannel())
  .then((channel) => {
    // Channel is ready for use
    channel.assertExchange("direct_exchange", "direct", { durable: false });
    channel.assertQueue("chat_messages", { durable: false });
    channel.bindQueue("chat_messages", "direct_exchange", "chat");
  })
  .catch((error) => {
    console.error("Error connecting to RabbitMQ", error);
  });

app.post("/message", jsonParser, (req, res) => {
  console.log(req.body);
  /*   const message = req.body.message;

  // Publish the message to RabbitMQ
  channel.publish("direct_exchange", "chat", Buffer.from(message));
 */
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

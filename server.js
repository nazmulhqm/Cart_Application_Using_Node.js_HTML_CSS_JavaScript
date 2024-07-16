var express = require("express");
var app = express();

app.use(express.static(__dirname + "/public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

var port = 1234;
app.listen(port);
console.log("Listening on port: " + port);

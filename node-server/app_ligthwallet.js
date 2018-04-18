var express = require("express")
var app = express()

app.use(express.static("public-ligthwallet"))

app.get("/", function(req, res){
	res.sendFile(__dirname + "/public-ligthwallet/html/index.html");
})

app.listen(3000)
console.log('Server is running')
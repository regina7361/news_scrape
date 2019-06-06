//require dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

//set up port to be either host's designated port or 3000
var PORT = process.env.PORT || 3000;

//Instantiate express app
var app = express();

//set up express router
var router = express.Router();

//Require routes files pass router object
require("./config/routes")(router);

//designate public folder as a static directory
app.use(express.static(__dirname + "/public"));

//connect handlebars to express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//use bodyparser 
app.use(bodyParser.urlencoded({
    extended: false
}));

//have requests go through router middleware
app.use(router);

//If deployed, use the deployed database; otherwise, use the local mongoHeadlines DB
var db = process.env.MONGODB_URI || "mongodb://localhost/Regina_DB";

//Connect mongoose to the database
mongoose.connect(db, { 
    useNewUrlParser: true 
    },
function(error){
    if (error) {
        console.log(error);
    }
    else {
        console.log("mongoose connection is successful");
    }
});

//Listen on the port
app.listen(PORT, function() {
    console.log("Listening on port: " + PORT);
});

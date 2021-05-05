const bodyparser = require('body-parser')
const express = require("express")
const path = require('path')
const app = express()

var PORT = process.env.port || 3000

// View Engine Setup
app.set("views", path.join(__dirname))
app.set("view engine", "html")

// Body-parser middleware
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/AirlineMainPage.html'));
});

app.get("/createflight", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/FlightCreate.html'));
});

app.get("/searchflight", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/FlightSearch.html'));
});

app.get("/addcustomer", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/CustomerCreate.html'));
});

app.get("/addairport", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/AirportCreate.html'));
});

app.get("/addpilot", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/PilotCreate.html'));
});

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/FlightCreate.html'));
});

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/FlightCreate.html'));
});
app.post('/', (req, res) => {

    console.log("Using Body-parser: ", req.body)
})

app.listen(PORT, function(error){
    if (error) throw error
    console.log("Server created Successfully on PORT", PORT)
})
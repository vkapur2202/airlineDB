const { Pool} = require('pg')
require('dotenv').config();
const connectionString = process.env.CONNECTION_STRING
const pool = new Pool({
    connectionString,
})

const bodyparser = require('body-parser')
const express = require("express")
const path = require('path')
const app = express()
app.use(express.static('public'));
var PORT = process.env.port || 3000

// View Engine Setup
app.set("views", path.join(__dirname))
app.set("view engine", "ejs")

// Body-parser middleware
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/AirlineMainPage.html'));
});

app.get("/createflight", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/FlightCreate.html'));
});

app.get("/searchflights", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/FlightSearch.html'));
});

app.get("/addcustomer", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/CustomerCreate.html'));
});

app.post("/searchflights", function(req, res){
    //const cid = parseInt(request.params.cid)

    const { depAirport, arrAirport, depDate, arrDate} = req.body

    pool.query('SELECT * FROM flight WHERE startaid = $1 AND destinationaid = $2', [depAirport, arrAirport], (error, results) => {
        if (error) {
            throw error
        }
        console.log(results)
        //res.status(200).json(results.rows)
        res.render('DynamicFile/FlightSearch', {data: results})
    })
});
app.get("/addcustomeronflight", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/CustomerFlightRegistration.html'));
});

app.get("/addairport", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/AirportCreate.html'));
});

app.get("/addpilot", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/PilotCreate.html'));
});

app.post('/addpilot', (req, res) => {
    const { pname} = req.body

    pool.query('INSERT INTO pilot (pname) VALUES ($1) RETURNING pilotid', [pname], (error, results) => {
        if (error) {
            throw error
        }
        console.log(results)
        res.status(201).send(`Pilot added with ID: ${results.rows[0].pilotid}`)
    })
})

app.post('/addairport', (req, res) => {
    const { aname, city, numgates} = req.body

    pool.query('INSERT INTO airport (aname, city, numgates) VALUES ($1, $2, $3) RETURNING aid', [aname, city, numgates], (error, results) => {
        if (error) {
            throw error
        }
        console.log(results)
        res.status(201).send(`Airport added with ID: ${results.rows[0].aid}`)
    })
})

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/AirlineMainPage.html'));
});
app.post('/createflight', (req, res) => {
    const { pid, arrivalGate, pilotid, startaid, destinationaid, departuregate } = req.body

    pool.query('INSERT INTO flight (pid, pilotid, startaid, destinationaid, distance, departuregate, arrivalgate) VALUES ($1, $3, $4, $5, $7, $6, $2)', [pid, arrivalGate, pilotid, startaid, destinationaid, departuregate, 500], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Flight added with ID: ${result.insertId}`)
    })
    console.log("Using Body-parser: ", req.body)
})

app.post('/addcustomer', (req, res) => {
    const { cname, username, password } = req.body

    pool.query('INSERT INTO passenger (cname, username, password) VALUES ($1, $2, $3) RETURNING cid', [cname, username, password], (error, results) => {
        if (error) {
            throw error
        }
        console.log(results)
        res.status(201).send(`Passenger added with ID: ${results.rows[0].cid}`)
    })
})

app.listen(PORT, function(error){
    if (error) throw error
    console.log("Server created Successfully on PORT", PORT)
})
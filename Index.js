const { Pool} = require('pg')
require('dotenv').config();
const connectionString = process.env.CONNECTION_STRING
const pool = new Pool({
    connectionString,
})
let ejs = require('ejs');
const bodyparser = require('body-parser')
const express = require("express")
const path = require('path')
const router = express.Router()
const app = express()
app.use(express.static(__dirname + "/public"))
var PORT = process.env.port || 3000

// View Engine Setup
app.set("views", path.join(__dirname))
app.set("view engine", "ejs")
//app.engine('html', require('ejs').renderFile)
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
    pool.query('SELECT * FROM flight', (error, results) => {
        if (error) {
            throw error
        }
        //res.status(200).json(results.rows)
        //res.sendFile(path.join(__dirname, '/Pages/CustomerFlightRegistration.html'));
        //res.render('DynamicFile/FlightSearch');
        res.render('DynamicFile/FlightSearch', {data: results.rows});

    })
});

app.delete('/searchflightdetail', (req, res) => {
    const { detailfid } = req.body

    pool.query('DELETE FROM trip WHERE fid = $1', [detailfid], (error, results) => {
        if (error) {
            throw error
        }
        pool.query('DELETE FROM flight WHERE fid = $1', [detailfid], (error, results) => {
            if (error) {
                throw error
            }
            console.log("PLEASE WORK")
            res.status(201).send(`Flight successfully deleted`)
        })
    })
})

app.get("/searchairports", function(req, res){
    pool.query('SELECT * FROM airport', (error, results) => {
        if (error) {
            throw error
        }
        //res.status(200).json(results.rows)
        //res.sendFile(path.join(__dirname, '/Pages/CustomerFlightRegistration.html'));
        //res.render('DynamicFile/FlightSearch');
        res.render('DynamicFile/AirportSearch', {data: results.rows});

    })
});

app.post("/searchflights/search", function(req, res){
    console.log(req.body)
    const { depAirport, arrAirport, depDate, arrDate} = req.body
    pool.query('SELECT * FROM flight WHERE startaid = $1 AND destinationaid = $2 AND departureDate > $3 AND departureDate < $4',
        [arrAirport, depAirport, depDate, arrDate], (error, results) => {
        if (error) {
            throw error
        }
        //res.status(200).json(results.rows)
        //res.sendFile(path.join(__dirname, '/Pages/CustomerFlightRegistration.html'));
        //res.render('DynamicFile/FlightSearch');
        console.log("Finished", results.rows)
        res.render('DynamicFile/FlightSearch', {data: results.rows});

    })
});

app.post("/searchflightdetail", function(req, res){
    console.log(req.body)
    const { detailfid } = req.body
    pool.query('SELECT * FROM flight WHERE fid = $1', [detailfid], (error, results) => {

        //res.status(200).json(results.rows)
        //res.sendFile(path.join(__dirname, '/Pages/CustomerFlightRegistration.html'));
        //res.render('DynamicFile/FlightSearch');
        console.log("Finished", results.rows)
        res.render('DynamicFile/FlightDetail', {data: results.rows[0]});

    })
});

app.post("/searchairports/search", function(req, res){
    console.log(req.body)
    const { name, city, country} = req.body
    pool.query("SELECT * FROM airport WHERE aname = $1 AND city = $2 AND country = $3", [name, city, country],(error, results) => {
        if (error) {
            throw error
        }
        res.render('DynamicFile/AirportSearch', {data: results.rows});

    })
});


app.get("/addcustomer", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/CustomerCreate.html'));
});


app.get("/image", function(req, res){
    res.sendFile(path.join(__dirname, '/Images/customer.png'));
});


app.get("/flightdetail", function(req, res){
        res.render('Pages/FlightDetail');
});

app.get("/searchflighthopefully", function(req, res){
    res.sendFile(path.join(__dirname, '/Pages/CustomerFlightRegistration.html'));
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
    const { pid, pilotid, startaid, destinationaid, departuregate, arrivalgate, departuredate, arrivaldate} = req.body
    pool.query('INSERT INTO flight (pid, pilotid, startaid, destinationaid, departuregate, arrivalgate, departuredate, arrivaldate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING fid', [pid, pilotid, startaid, destinationaid, departuregate, arrivalgate, departuredate, arrivaldate], (error, results) => {
        if (error) {
            res.status(403).send(`Error: ${error}`)
            return;
        }
        console.log(results)
        res.status(201).send(`Flight added with ID: ${results.rows[0].fid}`)
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
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
var PORT = process.env.PORT || 3000

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
            res.status(403).send(`Error: ${error}`)
            return;
        }
        res.render('DynamicFile/FlightSearch', {data: results.rows});

    })
});

app.delete('/searchflightdetail', (req, res) => {
    const { detailfid } = req.body

    pool.query('DELETE FROM trip WHERE fid = $1', [detailfid], (error, results) => {
        if (error) {
            res.status(403).send(`Error: ${error}`)
            return;
        }
        pool.query('DELETE FROM flight WHERE fid = $1', [detailfid], (error, results) => {
            if (error) {
                res.status(403).send(`Error: ${error}`)
                return;
            }
            res.status(201).send(`Flight successfully deleted`)
        })
    })
})

app.delete('/searchtripdetail', (req, res) => {
    const { tid } = req.body

    pool.query('DELETE FROM trip WHERE tid = $1', [parseInt(tid)], (error, results) => {
        if (error) {
            res.status(403).send(`Error: ${error}`)
            return;
        }
        res.status(201).send(`Flight successfully deleted`)
    })
})

app.post("/searchtrips/search", function(req, res){
    const { cid, fid} = req.body
    if((cid == "") && (fid != "")){
        pool.query('SELECT * FROM trip WHERE fid = $1',
            [parseInt(fid)], (error, results) => {
                if (error) {
                    res.status(403).send(`Error: ${error}`)
                    return;
                }
                res.render('DynamicFile/TripSearch', {data: results.rows});

            })
    }
    else if((cid != "") && (fid == "")){
        pool.query("SELECT * FROM trip WHERE cid = $1", [parseInt(cid)],(error, results) => {
            if (error) {
                res.status(403).send(`Error: ${error}`)
                return;
            }
            res.render('DynamicFile/TripSearch', {data: results.rows});

        })
    }
    else{
        pool.query("SELECT * FROM trip WHERE cid = $1 AND fid = $2", [parseInt(cid), parseInt(fid)],(error, results) => {
            if (error) {
                res.status(403).send(`Error: ${error}`)
                return;
            }
            res.render('DynamicFile/TripSearch', {data: results.rows});

        })
    }
});

app.get("/searchtrips", function(req, res){
    pool.query('SELECT * FROM trip', (error, results) => {
        if (error) {
            res.status(403).send(`Error: ${error}`)
            return;
        }
        res.render('DynamicFile/TripSearch', {data: results.rows});

    })
});

app.post("/searchcustomers/search", function(req, res){
    console.log(req.body)
    const { cemail, cfirstname, clastname} = req.body
    if((cemail == "") && (cfirstname != "" && clastname != "")){
        pool.query('SELECT * FROM passenger WHERE firstname = $1 AND lastname = $2',
            [cfirstname, clastname], (error, results) => {
                if (error) {
                    res.status(403).send(`Error: ${error}`)
                    return;
                }
                res.render('DynamicFile/CustomerSearch', {data: results.rows});

            })
    }
    else if((cemail != "") && (cfirstname == "" || clastname == "")){
        pool.query("SELECT * FROM passenger WHERE username = $1", [cemail],(error, results) => {
            if (error) {
                res.status(403).send(`Error: ${error}`)
                return;
            }
            res.render('DynamicFile/CustomerSearch', {data: results.rows});

        })
    }
    else{
        pool.query("SELECT * FROM passenger WHERE firstname = $1 AND lastname = $2 AND username = $3", [cfirstname, clastname, cemail],(error, results) => {
            if (error) {
                res.status(403).send(`Error: ${error}`)
                return;
            }
            res.render('DynamicFile/CustomerSearch', {data: results.rows});

        })
    }
});

app.get("/searchcustomers", function(req, res){
    pool.query('SELECT * FROM passenger', (error, results) => {
        if (error) {
            res.status(403).send(`Error: ${error}`)
            return;
        }
        res.render('DynamicFile/CustomerSearch', {data: results.rows});

    })
});

app.get("/searchairports", function(req, res){
    pool.query('SELECT * FROM airport', (error, results) => {
        if (error) {
            res.status(403).send(`Error: ${error}`)
            return;
        }
        res.render('DynamicFile/AirportSearch', {data: results.rows});

    })
});

app.get("/searchpilots", function(req, res){
    pool.query('SELECT * FROM pilot', (error, results) => {
        if (error) {
            res.status(403).send(`Error: ${error}`)
            return;
        }
        res.render('DynamicFile/PilotSearch', {data: results.rows});

    })
});

app.post("/searchflights/search", function(req, res){
    console.log(req.body)
    const { depAirport, arrAirport, depDate, arrDate} = req.body
    if((depAirport == "" || arrAirport == "") && (depDate != "" && arrDate != "")){
        pool.query('SELECT * FROM flight WHERE departureDate > $1 AND departureDate < $2',
            [depDate, arrDate], (error, results) => {
                if (error) {
                    res.status(403).send(`Error: ${error}`)
                    return;
                }
                res.render('DynamicFile/FlightSearch', {data: results.rows});

            })
    }
    else if((depAirport != "" && arrAirport != "") && (depDate == "" || arrDate == "")){
        pool.query('SELECT * FROM flight WHERE startaid = $1 AND destinationaid = $2',
            [parseInt(depAirport), parseInt(arrAirport)], (error, results) => {
                if (error) {
                    res.status(403).send(`Error: ${error}`)
                    return;
                }
                res.render('DynamicFile/FlightSearch', {data: results.rows});

            })
    }
    else if((depAirport != "" && arrAirport != "") && (depDate != "" && arrDate != "")) {
        pool.query('SELECT * FROM flight WHERE startaid = $1 AND destinationaid = $2 AND departureDate > $3 AND departureDate < $4',
            [parseInt(depAirport), parseInt(arrAirport), depDate, arrDate], (error, results) => {
                if (error) {
                    res.status(403).send(`Error: ${error}`)
                    return;
                }
                res.render('DynamicFile/FlightSearch', {data: results.rows});
        })
    }
    else{

    }
});

app.post("/searchpilots/search", function(req, res){
    const { firstname, lastname} = req.body
    pool.query('SELECT * FROM pilot WHERE firstname = $1 AND lastname = $2',
        [firstname, lastname], (error, results) => {
            if (error) {
                res.status(403).send(`Error: ${error}`)
                return;
            }
            console.log("Finished", results.rows)
            res.render('DynamicFile/PilotSearch', {data: results.rows});

        })
});

app.post("/searchflightdetail", function(req, res){
    const { detailfid } = req.body
    pool.query('SELECT * FROM flight WHERE fid = $1', [detailfid], (error, results) => {
        res.render('DynamicFile/FlightDetail', {data: results.rows[0]});

    })
});

app.post("/searchtripdetail", function(req, res){
    const { tid } = req.body
    pool.query('SELECT * FROM trip WHERE tid = $1', [tid], (error, results) => {
        console.log(results.rows)
        res.render('DynamicFile/TripDetail', {data: results.rows[0]});

    })
});

app.post("/searchairports/search", function(req, res){
    console.log(req.body)
    const { name, city, country} = req.body
    if((name == "") && (city != "" && country != "")){
        pool.query('SELECT * FROM airport WHERE city = $1 AND country = $2',
            [city, country], (error, results) => {
                if (error) {
                    res.status(403).send(`Error: ${error}`)
                    return;
                }
                res.render('DynamicFile/AirportSearch', {data: results.rows});

            })
    }
    else if((name != "") && (city == "" || country == "")){
        pool.query("SELECT * FROM airport WHERE aname = $1", [name],(error, results) => {
            if (error) {
                res.status(403).send(`Error: ${error}`)
                return;
            }
            res.render('DynamicFile/AirportSearch', {data: results.rows});

        })
    }
    else{
        pool.query("SELECT * FROM airport WHERE aname = $1 AND city = $2 AND country = $3", [name, city, country],(error, results) => {
            if (error) {
                res.status(403).send(`Error: ${error}`)
                return;
            }
            res.render('DynamicFile/AirportSearch', {data: results.rows});

        })
    }
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
    const { pfname, plname, puname} = req.body

    pool.query('INSERT INTO pilot (firstname, lastname, username) VALUES ($1, $2, $3) RETURNING pilotid', [pfname, plname, puname], (error, results) => {
        if (error) {
            res.status(403).send(`Error: ${error}`)
            return;
        }
        console.log(results)
        res.status(201).send(`Pilot added with ID: ${results.rows[0].pilotid}`)
    })
})

app.post('/addairport', (req, res) => {
    const { aname, city, numgates, country} = req.body

    pool.query('INSERT INTO airport (aname, city, numgates, country) VALUES ($1, $2, $3, $4) RETURNING aid', [aname, city, numgates, country], (error, results) => {
        if (error) {
            res.status(403).send(`Error: ${error}`)
            return;
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
        res.status(201).send(`Flight added with ID: ${results.rows[0].fid}`)
    })
    console.log("Using Body-parser: ", req.body)
})

app.post('/addcustomer', (req, res) => {
    const { cuname, cfname, clname } = req.body

    pool.query('INSERT INTO passenger (username, firstname, lastname) VALUES ($1, $2, $3) RETURNING cid', [cuname, cfname, clname], (error, results) => {
        if (error) {
            res.status(403).send(`Error: ${error}`)
            return;
        }
        console.log(results)
        res.status(201).send(`Passenger added with ID: ${results.rows[0].cid}`)
    })
})

app.listen(PORT, function(error){
    if (error) throw error
    console.log(`Server is running on http://localhost:${PORT} 🚀`)
})
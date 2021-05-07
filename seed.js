const { Pool } = require('pg')
require('dotenv').config()
var Fakerator = require("fakerator");
var fakerator = Fakerator();
const connectionString = process.env.CONNECTION_STRING
const pool = new Pool({
  connectionString,
})
;(async () => {
  // note: we don't try/catch this because if connecting throws an exception
  // we don't need to dispose of the client (it will be undefined)
  const client = await pool.connect()
  try {
    await client.query("DELETE FROM trip")
    await client.query("DELETE FROM flight")
    await client.query("DELETE FROM passenger")
    await client.query("DELETE FROM pilot")
    await client.query("DELETE FROM plane")
    await client.query("DELETE FROM airport")

    const cids = []
    for (i = 0; i < 200; i++){    
      const cid_query = "INSERT INTO passenger (firstname, lastname, username) VALUES ($1, $2, $3) RETURNING cid"
      const cid_values = []
      const fname = fakerator.names.firstName()
      cid_values.push(fname)
      const lname = fakerator.names.lastName()
      cid_values.push(lname)
      cid_values.push(fakerator.internet.email(fname, lname + String(fakerator.random.number(9999))))

      const cid = await client.query(cid_query, cid_values)
      cids.push(cid.rows[0].cid)
    }
    const pilotids = []
    for (i = 0; i < 200; i++){    
      const pilotid_query = "INSERT INTO pilot (firstname, lastname, username) VALUES ($1, $2, $3) RETURNING pilotid"
      const pilotid_values = []
      const fname = fakerator.names.firstName()
      pilotid_values.push(fname)
      const lname = fakerator.names.lastName()
      pilotid_values.push(lname)
      pilotid_values.push(fakerator.internet.email(fname, lname + String(fakerator.random.number(9999))))
      const pilotid = await client.query(pilotid_query, pilotid_values)
      pilotids.push(pilotid.rows[0].pilotid)
    }
    const pids =[]
    const model_nums = ['737', '747', '767', '777', '787', 'A380', 'A350', 'A320']
    for (i = 0; i < 200; i++){ 
      const pid_query = "INSERT INTO plane (model, nobusinessseats, noeconomyseats, carryoncapacity, checkincapacity, maxweight, range) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING pid"
      const pid_values = []
      
      pid_values.push(fakerator.random.arrayElement(model_nums))
      pid_values.push(fakerator.random.number(5, 100))
      pid_values.push(fakerator.random.number(100, 300))
      pid_values.push(fakerator.random.number(100, 400))
      pid_values.push(fakerator.random.number(500, 5000))
      pid_values.push(fakerator.random.number(2000, 20000))
      pid_values.push(fakerator.random.number(500, 10000))

      const pid = await client.query(pid_query, pid_values)
      pids.push(pid.rows[0].pid)
    }
    const aids = []
    for (i = 0; i < 200; i++){ 
      const aid_query = "INSERT INTO airport (aname, city, country, numgates) VALUES ($1, $2, $3, $4) RETURNING aid"
      const aid_values = []
      aid_values.push(fakerator.random.letter() + fakerator.random.letter() + fakerator.random.letter() + String(fakerator.random.number(9999)))
      aid_values.push(fakerator.address.city())
      aid_values.push(fakerator.address.country())
      aid_values.push(fakerator.random.number(100, 200))

      const aid = await client.query(aid_query, aid_values)
      aids.push(aid.rows[0].aid)
    }

    const today = new Date()
    const fids =[]
    for (i = 0; i < 200; i++){ 
      const fid_query = "INSERT INTO flight (pid, pilotid, startaid, destinationaid, departuregate, arrivalgate, departuredate, arrivaldate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING fid"
      const fid_values = []
      fid_values.push(fakerator.random.arrayElement(pids))
      fid_values.push(fakerator.random.arrayElement(pilotids))
      fid_values.push(fakerator.random.arrayElement(aids))
      fid_values.push(fakerator.random.arrayElement(aids))
      fid_values.push(fakerator.random.number(100))
      fid_values.push(fakerator.random.number(100))
      const date = fakerator.date.future(2, today)
      fid_values.push(date)
      fid_values.push(fakerator.date.future(0, date))
      const fid = await client.query(fid_query, fid_values)
      fids.push(fid.rows[0].fid)
    }
    
    const tids = []
    for (i = 0; i < 200; i++){ 
      const tid_query = "INSERT INTO trip (fid, cid, ticketPrice) VALUES ($1, $2, $3) RETURNING tid"
      const tid_values = []
      
      tid_values.push(fakerator.random.arrayElement(fids))
      tid_values.push(fakerator.random.arrayElement(cids))
      tid_values.push(fakerator.random.number(50, 2000))

      const tid = await client.query(tid_query, tid_values)
      tids.push(tid.rows[0].tid)
    }
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
})().catch(e => console.error(e.stack))
const { Pool } = require('pg')
require('dotenv').config();
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

    const cid_query = "INSERT INTO passenger (cname, username, password) VALUES ('vivek', 'vkapur', 'password'), ('sanhita', 'skumari', 'password2'),('orion', 'ofollett', 'password3'),('alex', 'abradley', 'password4'), ('john', 'jking', 'password5') RETURNING cid"
    const cids = await client.query(cid_query)

    const cid1 = await cids.rows[0].cid
    const cid2 = await cids.rows[2].cid
    const cid3 = await cids.rows[4].cid

    const pilotid_query = "INSERT INTO pilot (pname) VALUES ('Jack'), ('Jill'), ('Rick'), ('Morty'), ('Jenna'), ('Hugh') RETURNING pilotid"
    const pilotids = await client.query(pilotid_query)

    const pilotid1 = await pilotids.rows[0].pilotid
    const pilotid2 = await pilotids.rows[1].pilotid
    const pilotid3 = await pilotids.rows[2].pilotid
    const pilotid4 = await pilotids.rows[3].pilotid

    const pid_query = "INSERT INTO plane (model, nobusinessseats, noeconomyseats, carryoncapacity, checkincapacity, maxweight, range) VALUES ('737', 26, 187, 4000, 8000, 15000, 1800), ('747', 20, 168, 3000, 7000, 13000, 1200), ('A320', 32, 241, 6000, 9300, 18000, 2600), ('777', 12, 123, 2650, 5900, 11000, 1500), ('757', 40, 160, 4600, 8300, 16000, 2000) RETURNING pid"
    const pids = await client.query(pid_query)

    const pid1 = await pids.rows[0].pid
    const pid2 = await pids.rows[1].pid
    const pid3 = await pids.rows[2].pid
    const pid4 = await pids.rows[3].pid

    const aid_query = "INSERT INTO airport (aname, city, numgates) VALUES ('JFK', 'New York', 89), ('ORD', 'Chicago', 67), ('DEN', 'Denver', 56), ('LAX', 'Los Angelos', 120), ('LAS', 'Las Vegas', 87), ('SEA', 'Seattle', 63), ('PHX', 'Phoenix', 87), ('DTW', 'Detroit', 46) RETURNING aid"
    const aids = await client.query(aid_query)

    const aid1 = await aids.rows[0].aid
    const aid2 = await aids.rows[1].aid
    const aid3 = await aids.rows[2].aid
    const aid4 = await aids.rows[3].aid
    const aid5 = await aids.rows[4].aid
    const aid6 = await aids.rows[5].aid
    const aid7 = await aids.rows[6].aid
    const aid8 = await aids.rows[7].aid

    const fid_query = "INSERT INTO flight (pid, pilotid, startaid, destinationaid, distance, departuregate, arrivalgate) VALUES ($1, $5, $9, $10, 678, 7, 19), ($2, $6, $11, $12, 394, 18, 39), ($3, $7, $13, $14, 924, 2, 73), ($4, $8, $15, $16, 567, 38, 61) RETURNING fid"
    const fid_values = [pid1, pid2, pid3, pid4, pilotid1, pilotid2, pilotid3, pilotid4, aid1, aid2, aid3, aid4, aid5, aid6, aid7, aid8]
    const fids = await client.query(fid_query, fid_values)

    const fid1 = await fids.rows[0].fid
    const fid2 = await fids.rows[1].fid
    const fid3 = await fids.rows[2].fid
    const fid4 = await fids.rows[3].fid

    const tid_query = "INSERT INTO trip (fid, cid, ticketPrice) VALUES ($1, $5, 100), ($2, $6, 147), ($3, $7, 319), ($4, $6, 229) RETURNING tid"
    const tid_values = [fid1, fid2, fid3, fid4, cid1, cid2, cid3]
    const tids = await client.query(tid_query, tid_values)

    const tid1 = await tids.rows[0].tid
    const tid2 = await tids.rows[0].tid
    const tid3 = await tids.rows[0].tid
    const tid4 = await tids.rows[0].tid

  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
})().catch(e => console.error(e.stack))
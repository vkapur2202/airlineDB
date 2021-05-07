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

    const cid_query = "INSERT INTO passenger (firstname, lastname, username) VALUES ('vivek', 'kapur', 'vkk9@case.edu'), ('sanhita', 'kumari', 'sxk1409@case.edu'),('orion', 'follett', 'oxf21@case.edu'),('alex', 'bradley', 'ach159@case.edu'), ('john', 'king', 'jking@gmail.com') RETURNING cid"
    const cids = await client.query(cid_query)

    const cid1 = await cids.rows[0].cid
    const cid2 = await cids.rows[2].cid
    const cid3 = await cids.rows[4].cid

    const pilotid_query = "INSERT INTO pilot (firstname, lastname, username) VALUES ('Jack', 'Smith', 'jsmith@gmail.com'), ('Jill', 'James', 'jjames@gmail.com'), ('Rick', 'Alexander', 'ralexander@gmail.com'), ('Morty', 'Hardy', 'mhardy@gmail.com'), ('Jenna', 'Marbles', 'jmarbles@gmail.com'), ('Hugh', 'Grant', 'hgrant@gmail.com') RETURNING pilotid"
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

    const aid_query = "INSERT INTO airport (aname, city, country, numgates) VALUES ('JFK', 'New York', 'USA', 89), ('ORD', 'Chicago', 'USA', 67), ('DEN', 'Denver', 'USA', 56), ('LAX', 'Los Angelos', 'USA', 120), ('LAS', 'Las Vegas', 'USA', 87), ('SEA', 'Seattle', 'USA', 63), ('PHX', 'Phoenix', 'USA', 87), ('DTW', 'Detroit', 'USA', 46) RETURNING aid"
    const aids = await client.query(aid_query)

    const aid1 = await aids.rows[0].aid
    const aid2 = await aids.rows[1].aid
    const aid3 = await aids.rows[2].aid
    const aid4 = await aids.rows[3].aid
    const aid5 = await aids.rows[4].aid
    const aid6 = await aids.rows[5].aid
    const aid7 = await aids.rows[6].aid
    const aid8 = await aids.rows[7].aid

    const day1 = new Date('December 17, 2021 03:24:00');
    const day2 = new Date('December 17, 2021 06:11:00');
    const day3 = new Date('May 19, 2021 18:42:00');
    const day4 = new Date('May 20, 2021 00:26:00');
    const day5 = new Date('July 4, 2021 08:32:00');
    const day6 = new Date('July 4, 2021 11:59:00');
    const day7 = new Date('June 11, 2021 23:24:00');
    const day8 = new Date('July 12, 2021 02:51:00');
    const fid_query = "INSERT INTO flight (pid, pilotid, startaid, destinationaid, departuregate, arrivalgate, departuredate, arrivaldate) VALUES ($1, $5, $9, $10, 7, 19, $17, $18), ($2, $6, $11, $12, 18, 39, $19, $20), ($3, $7, $13, $14, 2, 73, $21, $22), ($4, $8, $15, $16, 38, 61, $23, $24) RETURNING fid"
    const fid_values = [pid1, pid2, pid3, pid4, pilotid1, pilotid2, pilotid3, pilotid4, aid1, aid2, aid3, aid4, aid5, aid6, aid7, aid8, day1, day2, day3, day4, day5, day6, day7, day8]
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
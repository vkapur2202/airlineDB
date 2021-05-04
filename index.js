const { Pool, Client } = require('pg')
require('dotenv').config();
const connectionString = process.env.CONNECTION_STRING
const pool = new Pool({
  connectionString,
})

pool.query("INSERT INTO passenger (cname, username, password) VALUES ('vivek', 'vkapur', 'password'), ('sanhita', 'skumari', 'password2'),('orion', 'ofollett', 'password3'),('alex', 'abradley', 'password4'), ('john', 'jking', 'password5') RETURNING cid", (err, res) => {
  console.log(err, res)
})

pool.query("INSERT INTO pilot (pname) VALUES ('Jack'), ('Jill'), ('Rick'), ('Morty'), ('Jenna') RETURNING pilotid", (err, res) => {
  console.log(err, res)
})

 pool.query("INSERT INTO trip (fid, cid) VALUES ($1, $2), ($2, $1), ($3, $4), ($4, $5), ($5, $3)  RETURNING cid", [fid, cid], (err, res) => {
   console.log(err, res)
})
// pool.query("INSERT INTO customer (cname, username, password) VALUES ('vivek', 'vkapur', 'password')", (err, res) => {
//   console.log(err, res)
//   pool.end()
// })
pool.query('SELECT * FROM passenger', (err, res) => {
  console.log(err, res)
  pool.end()
})
// const client = new Client({
//   connectionString,
// })
// client.connect()
// client.query('SELECT *', (err, res) => {
//   console.log(err, res)
//   client.end()
// })


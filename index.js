const { Pool, Client } = require('pg')
require('dotenv').config();
const connectionString = process.env.CONNECTION_STRING
const pool = new Pool({
  connectionString,
})
pool.query("INSERT INTO customer (cname, username, password) VALUES ('vivek', 'vkapur', 'password') RETURNING cid", (err, res) => {
  console.log(err, res)
})
// pool.query("INSERT INTO customer (cname, username, password) VALUES ('vivek', 'vkapur', 'password')", (err, res) => {
//   console.log(err, res)
//   pool.end()
// })
pool.query('SELECT * FROM customer', (err, res) => {
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


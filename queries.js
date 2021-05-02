const { Pool} = require('pg')
require('dotenv').config();
const connectionString = process.env.CONNECTION_STRING
const pool = new Pool({
  connectionString,
})

const getCustomers = (request, response) => {
  pool.query('SELECT * FROM customers ORDER BY cid ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCustomerById = (request, response) => {
  const cid = parseInt(request.params.cid)

  pool.query('SELECT * FROM customers WHERE cid = $1', [cid], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createCustomer = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO customers (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Customer added with ID: ${result.insertId}`)
  })
}

const updateCustomer = (request, response) => {
  const cid = parseInt(request.params.cid)
  const { name, email } = request.body

  pool.query(
    'UPDATE customers SET name = $1, email = $2 WHERE cid = $3',
    [name, email, cid],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Customer modified with ID: ${cid}`)
    }
  )
}

const deleteCustomer = (request, response) => {
  const cid = parseInt(request.params.cid)

  pool.query('DELETE FROM customers WHERE cid = $1', [cid], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Customers deleted with ID: ${cid}`)
  })
}

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
}
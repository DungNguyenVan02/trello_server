/* eslint-disable no-console */
import express from 'express'

const app = express()

const localhost = process.env.APP_HOST || 'localhost'
const port = process.env.APP_PORT || 8017

app.get('/', async (req, res) => {
  res.end('<h1>Hello World!</h1><hr>')
})

app.listen(port, localhost, () => {
  // eslint-disable-next-line no-console
  console.log(`Hello Dung Nguyen Dev, I am running at http://localhost:${port}/`)
})

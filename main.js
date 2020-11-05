// import lib
const express = require('express')
const handlebars = require('express-handlebars')
const mysql = require('mysql2/promise')

//declare const
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000
const SQL_GET_TV_SHOWS = 'select * from tv_shows order by ? limit ?'
const SQL_GET_TV_SHOWS_DETAILS = 'select * from tv_shows where tvid = ?'

//declare database, create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: 'leisure',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: 4,
    timezone: '+08:00'
})

//express
const app = express()

//hbs
app.engine('hbs', handlebars({ defaultLayout: 'default.hbs' }))
app.set('view engine', 'hbs')

//application
app.get('/', async (req, res) => {
    //get list of tv shows
    const conn = await pool.getConnection()
    try {
        const sqlQuery = await pool.query(SQL_GET_TV_SHOWS, ['name', 20])
        conn.release()

        res.status(200)
        res.type('text/html')
        res.render('index', { results: sqlQuery[0] })
    }

    catch (e) {
        res.status(500)
        res.type('text/html')
        res.send('error')
        return Promise.reject(e)
    }

})

app.get('/shows/:tvid', async (req, res) => {
    const conn = await pool.getConnection()
    try {
        const sqlQuery = await pool.query(SQL_GET_TV_SHOWS_DETAILS, 6)
        conn.release()

        res.status(200)
        res.type('text/html')
        res.render('shows', { results: sqlQuery[0] })

    }
    catch (e) {
        res.status(200)
        res.type('text/html')
        res.send('error')
        return Promise.reject(e)
    }

})

//start server
app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`)
})
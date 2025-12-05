const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'taskflow_user',
  password: 'TaskflowPass123!',
  database: 'taskflow_db'
});

module.exports = pool;

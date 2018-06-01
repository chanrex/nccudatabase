var mysql = require('mysql');

var connection = mysql.createConnection({
  host: '140.119.163.105',
  user: 'jack',
  password: 'jack850912',
  database: 'facility_service',
});

connection.connect(function(err) {
  if (err) {
    console.log('Error while connecting with database');
  } else {
    console.log('success connect to database');
  }
});

function doquery(query, data = []) {
  return new Promise(function(resolve, reject) {
    connection.query(query, data, function(err, output) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(output);
    });
  });
}

module.exports = doquery;

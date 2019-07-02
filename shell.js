var express = require('express');
var app = express();
var path = require('path');
var server = app.listen(PORT || 8000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('DES app listening at http://%s:%s',  host, port);
});

app.use(express.static(path.join(__dirname, 'dist')));


app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
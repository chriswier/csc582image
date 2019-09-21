const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
var fs = require('fs');
//const Data = require('./data');
//const testSearch = require('./testSearch');

// based loosely on https://medium.com/javascript-in-plain-english/full-stack-mongodb-react-node-js-express-js-in-one-simple-app-6cc8ed6de274

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// this is our get method
// this method fetches all available data in our database
router.get('/pics/:number', (req, res) => {
  var picnum = req.params.number;

  // testing
  res.writeHead(200, { 'Content-Type': 'image/jpeg' });
  var readStream = fs.createReadStream('./8386547111_e1739d3f98_z.jpg');
  // This will wait until we know the readable stream is actually valid before piping
  readStream.on('open', function () {
    // This just pipes the read stream to the response object (which goes to the client)
    readStream.pipe(res);
  });

  // This catches any errors that happen while creating the readable stream (usually invalid names)
  readStream.on('error', function(err) {
    res.end(err);
  });

//   Data.picture((err, picnum) => {
//     if (err) return res.json({ success: false, error: err });
//     return res.json({ success: true, data: data });
//   });
});

router.post('/search', (req, res) => {
  const { id, update } = req.body;

  // testing
  var testSearch = require('./testSearch.json');
  return res.json({ success: true, data: testSearch});

//   Data.findByIdAndUpdate(id, update, (err) => {
//     if (err) return res.json({ success: false, error: err });
//     return res.json({ success: true });
//   });
});

router.get('/search', (req, res) => {
  const { id, update } = req.body;

  // testing
  var testSearch = require('./testSearch.json');
  return res.json({ success: true, data: testSearch});

//   Data.findByIdAndUpdate(id, update, (err) => {
//     if (err) return res.json({ success: false, error: err });
//     return res.json({ success: true });
//   });
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
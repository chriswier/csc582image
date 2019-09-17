// Reference: 4NodeJS #4, #5, #6, #7
var http = require('http'),
    url = require('url'),
    oracledb = require('oracledb');

// force all BLOBS to be returned as Buffers
oracledb.fetchAsBuffer = [ oracledb.BLOB ];

// async function to start everything up
async function init() {
  try {
    await oracledb.createPool({
      user          : 'coco',
      password      : 'coco',
      connectString : 'localhost/cwiering1.csc582.umflint.edu'
    });
    console.log('Oracle connection pool started.');

    // Startup HTTP server
    const server = http.createServer();
    server.on('error', (err) => {
      throw err;
    });
    server.on('request',(req,res) => {
      handleRequest(req,res);
    });
    await server.listen(3333);
    console.log("HTTP Server running.  Try this:  http://141.216.24.220:3333/pics/<number>");
  } catch (err) {
    console.error('init() error: ' + err.message);
  }
}

// Handle each web request
async function handleRequest(request, response) { 
  // use the url to parse the requested url and get the image name
  var query = url.parse(request.url,true);
  var picnum = query.pathname.substring(query.pathname.lastIndexOf('/')+1);

  if (query.pathname.match(/^\/pics\//)) {
    console.log("Finding pictures " + picnum);

    // oracle lookup
    let connection;

    try {
      connection = await oracledb.getConnection();  // gets connection from the 'default' connection pool
      const result = await connection.execute(
        `SELECT image from imagefiles WHERE ID = :id`,
        { id: picnum }
      );

      // if no rows, write a 404
      if(result.rows.length === 0) {
        throw new Error("No results found for " + picnum);
      } 
    
      // I have a row; grab the result and stream it out
      else {
        var blob = result.rows[0][0];
        if(blob === null) {
          throw new Error("BLOB from db was null.");
        }

        response.writeHead(200, { 'Content-Type': 'image/jpeg' });
        response.end(blob); // write the image out
      } 
    } catch (err) {
      console.error(err);
    } finally { 
      if (connection) {
        try { 
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }

  } else {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end("404 File not found.<br />");
  }
}

async function closePoolAndExit() {
  console.log('\nTerminating');
  try {
    // Get the pool from the pool cache and close it when no
    // connections are in use, or force it closed after 10 seconds
    // If this hangs, you may need DISABLE_OOB=ON in a sqlnet.ora file
    await oracledb.getPool().close(10);
    console.log('Pool closed');
    process.exit(0);
  } catch(err) {
    console.error(err.message);
    process.exit(1);
  }
}

process
  .once('SIGTERM', closePoolAndExit)
  .once('SIGINT',  closePoolAndExit);

init();

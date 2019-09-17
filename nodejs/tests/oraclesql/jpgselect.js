// References: NodeJS #3 and #4

const fs = require('fs');
const oracledb = require('oracledb');
//const dbConfig = require('./dbconfig.js');

const blobOutFileName = 'lobselectout.jpg';

// force all BLOBS to be returned as Buffers
oracledb.fetchAsBuffer = [ oracledb.BLOB ];

async function run() {

  let connection;
 
  try {
    connection = await oracledb.getConnection({
      user          : 'coco',
      password      : 'coco',
      connectString : 'localhost/cwiering1.csc582.umflint.edu'
    });

    let result;
    result = await connection.execute(
      `SELECT image from imagefiles WHERE ID = '479400'`
    );

    if(result.rows.length === 0)
      throw new Error("No results.");

    const blob = result.rows[0][0];
    console.log('Writing BLOB to lobselectout.jpg');
    fs.writeFileSync(blobOutFileName, blob);

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
}

run(); 

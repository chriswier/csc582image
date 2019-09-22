// Reference: 4NodeJS #4, #5, #6, #7
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var oracledb = require('oracledb');

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

    // Startup Express server
    const app = express();
    app.use(cors());
    const router = express.Router();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use('/api', router);
    app.listen(3001, () => console.log(`LISTENING ON PORT 3001`));

    // Deal with appropriate routes, sending them to functions
    router.get('/pics/:number', (req, res) => {
      handlePicRequest(req,res);
    });

    router.post('/search', (req, res) => {
      handleSearchRequest(req,res);
    });

    router.get('/search', (req, res) => {
      handleGetSearchRequest(req,res);
    });

  } 

  // handle initialization errors
  catch (err) {
    console.error('init() error: ' + err.message);
  }
}

// Handle each web request
async function handlePicRequest(request, response) { 
  let picnum = request.params.number;
  //console.log("/pic - Finding pictures " + picnum);

  // oracle lookup
  let connection;
  try {
    connection = await oracledb.getConnection(); 
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
}

// function to deal with gets; this shouldn't ever get used outside of testing
async function handleGetSearchRequest(request, response) {
  //console.log("/search - get - return nothing");
  response.json({ success: true, data: { size: 0, maxSize: 0, offset: 0, images: [ ] }});
}

// main function to deal with posts
async function handleSearchRequest(request, response) {
  //console.log("/search - request");
  //console.log(request.body);

  // make a default response
  let reply = {
    offset: 0,
    size: 0,
    maxSize: 0,
    images: [ ],
  }

  // image variable to store results
  let images = [];

  // check for size and offset being set. update basic reply
  if(typeof request.body.searchsize !== 'undefined' &&
     request.body.searchsize !== null) {
    var size = request.body.searchsize;
    reply['size'] = request.body.searchsize;
  }
  if(typeof request.body.offset !== 'undefined' &&
     request.body.offset !== null) {
    var offset = request.body.offset;
    reply['offset'] = request.body.offset;
  }

  // get some variables - check if NOTHING was sent; if so, return them all!
  if(typeof request.body.searchvalue === 'undefined' || 
     request.body.searchvalue === null
  ) {
    response.json(reply);
    return;
  }

  // if an empty search string was sent, then search for them all
  else if(request.body.searchvalue === '') {
    images = await getAllImageIds();
    //console.log("/search - getAllimageIds return: " + images);
  }
 
  // if I have a search string, then search the captions for my searchvalue
  else {
    images = await searchCaptions(request.body.searchvalue);
    //console.log("/search - searchCaptions returned: " + images);
  }

  // check if null; return default response if I have no images
  if(typeof images !== 'undefined' && images === null) {
    response.json(reply);
    return;
  }

  // process the image ids returned
  reply['maxSize'] = Number(images.length);
  //console.log(reply);

  // loop through the images from offset to offset+size
  let imagesArray = [];
  let maxLoopVal = Number(offset) + Number(size);  
  if(Number(maxLoopVal) > Number(images.length)) { 
    maxLoopVal = Number(images.length); 
  }
  //console.log("offset: " + offset + " maxLoopVal: " + maxLoopVal);

  for(var i = offset; i < maxLoopVal; i++ ) {
    let imageinfo = await getImageInformation(Number(images[i]));
    imagesArray.push(imageinfo);
  }

  // update the images part of the reply
  reply['images'] = imagesArray;
  //console.log('imagesArray: ' + JSON.stringify(imagesArray));
  //console.log("Updated reply: " + JSON.stringify(reply));

  // return everything back
  response.json(reply);
}

// function to get information on certain image
async function getImageInformation(imageId) {

  //console.log("getImageInformation for imageId: " + imageId);
  // oracle lookup
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT * from webinfo WHERE id = :id`,
      { id: imageId }
    );

    // if no rows, return an empty set
    if(result.rows.length === 0) {
      //console.log("getImageCaptions - No results found for " + imageId);
      return null;
    }

    else {

      // build the imageinfo hash to pass back
      let imageInfo = {};
      let count = 0;
      let rowheaders = ['id','width','height','file_name','license','licenseUrl','flickerUrl','cocoUrl','date_captured','file_size']

      rowheaders.forEach(function(e) {
        imageInfo[e] = result.rows[0][count];
        count += 1;
      });

      // manipulate the date
      let dateGiven = new Date(Date.parse(imageInfo['date_captured']));
      let formatted_date = dateGiven.getFullYear() + "-" + (dateGiven.getMonth() + 1) + "-" + dateGiven.getDate() + " " + dateGiven.getHours() + ":" + dateGiven.getMinutes() + ":" + dateGiven.getSeconds();
      imageInfo['date_captured'] = formatted_date;


      // grab the captions as well
      let myCaptions = await getImageCaptions(imageId);
      imageInfo['captions'] = myCaptions;

      //console.log("getImageInformation imageinfo:" + JSON.stringify(imageInfo));
      return imageInfo;
    }
  } catch(err) {
    console.error(err.message);
    //process.exit(1);
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

// function to lookup captions for a specific imageId
async function getImageCaptions(imageId) {
  // oracle lookup
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT caption from caption WHERE image_id = :id`,
      { id: imageId }
    );

    // if no rows, return an empty set
    if(result.rows.length === 0) {
      //console.log("getImageCaptions - No results found for " + imageId);
      return null;
    }

    else {

      var myCaptions = [];
      for(i = 0; i < result.rows.length; i++) {
        myCaptions.push(result.rows[i]);
      }
      //console.log("getImageCaptions(): " + JSON.stringify(myCaptions));
      return myCaptions;
    }
  } catch(err) {
    console.error(err.message);
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

// function to search all captions for a specific set of words
async function searchCaptions(searchvalue) {

  // deal with massaging the search values
  let formattedSearchValue = searchvalue.split(' ').join(' AND ');
  //console.log("searchCaptions - formattedSearchValue: " + formattedSearchValue);

  // oracle lookup
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT unique(image_id) from caption WHERE CONTAINS(caption,:searchterm,1) > 0 ORDER BY image_id ASC`,
      { searchterm: formattedSearchValue }
    );

    // if no rows, return an empty set
    if(result.rows.length === 0) {
      console.log("searchCaptions - No results found for " + formattedSearchValue);
      return null;
    }
    else {
      return result.rows;
    }
  } catch(err) {
    console.error(err.message);
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

// function to get all image IDs
async function getAllImageIds() {

  // oracle lookup
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT unique(id) from image ORDER BY id ASC`
    );

    // if no rows, return an empty set
    if(result.rows.length === 0) {
      //console.log("getAllImageIds - No results found for " + formattedSearchValue);
      return null;
    }
    else {
      return result.rows;
    }
  } catch(err) {
    console.error(err.message);
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


async function closePoolAndExit() {
  console.log('\nTerminating');
  try {
    // Get the pool from the pool cache and close it when no
    // connections are in use, or force it closed after 10 seconds
    // If this hangs, you may need DISABLE_OOB=ON in a sqlnet.ora file
    await oracledb.getPool().close(10);
    console.log('Oracle Pool closed');
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

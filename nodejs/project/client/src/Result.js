import React from 'react';
//const util = require('util');

function ResultEntry(props) {

    // variables
    //let filename = util.format("%d.jpg",props.data.id);
    let filename = props.data.file_name;
    //let imageUrl = "http://localhost:3001/api/pics/" + props.data.id;
    let imageUrl = "http://141.216.24.220:3001/api/pics/" + props.data.id;
    
    // css styling
    const imageStyle = {
        width: '300px',
        height: 'auto'
    }    

    const spanDescriptionName = {
        fontWeight: 'bold',
    }

    const resultDiv = {
          backgroundColor: '#f7f7f7',
          borderColor: '#e5e5e5',
          borderStyle: 'solid',
          borderWidth: 'thin',
          borderRadius: 8,
          display: 'inline-block',
          //color: '#ffcd05',
          fontFamily: 'Georgia',
          fontSize: 16,
          textDecoration: 'none',
          width: '100%',
          //margin: '5px',
          marginBottom: '5px',
    }

    const figureStyle = {
        float: 'left',
        marginRight: '15px',
        marginLeft: '10px',
        marginTop: '10px',
    }

    // pre-render the captions
    const myCaptions = props.data.captions.map((indcaption) => {
        let keyval = "cap" + Math.floor(Math.random() * 2000000000); // generate a high unique key
        return(
            <span style={{marginLeft: '10px', fontStyle: 'italic'}} key={keyval}>- {indcaption}<br /></span>
        );
    })

    // return everything
    return(
        <div style={resultDiv}>
          <figure style={figureStyle}>
            <img src={imageUrl} alt={props.data.id} style={imageStyle}/>
            <figcaption align="center"><a href={imageUrl}>{filename}</a></figcaption>
          </figure>
          <div style={{paddingTop: '10px', marginLeft: '0px', float: 'left', overflowWrap: 'break-word'}}>
              <span style={spanDescriptionName}>Captions:</span><br />
              {myCaptions}
              <span style={spanDescriptionName}>Flicker URL: </span><a href={props.data.flickerUrl}>{props.data.flickerUrl}</a><br />
              <span style={spanDescriptionName}>COCO URL: </span><a href={props.data.cocoUrl}>{props.data.cocoUrl}</a><br />
              <span style={spanDescriptionName}>Image Width: </span>{props.data.width}<br />
              <span style={spanDescriptionName}>Image Height: </span>{props.data.height}<br /> 
              <span style={spanDescriptionName}>Date Captured: </span>{props.data.date_captured}<br /> 
              <span style={spanDescriptionName}>Image Size (bytes): </span>{props.data.file_size}<br /> 
              <span style={spanDescriptionName}>License: </span><a href={props.data.licenseUrl}>{props.data.license}</a><br />
          </div>
        </div>
    )
}

class Result extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }

  render() {
    //console.log("Result-render(props)" + JSON.stringify(this.props));

    // bail out if this is too early
    if(typeof this.props.data === 'undefined' ||
       typeof this.props.data.size === 'undefined' ||
       this.props.data.size === null
    ) {
        return null;
    }

    // data from super
    const data = this.props.data;
    let offset = Number(data.offset);
    let maxSize = Number(data.maxSize);
    let maxResult = Number(data.offset) + Number(data.size);
    if(maxResult > maxSize) { maxResult = maxSize; }

    //console.log("Result: " + data)
    //console.log("Size: " + data.size)

    // if no results, then just return a "Not Found" message
    if(data.maxSize <= 0) {
        return (
            <h3>No results found. :-(</h3>
        );
    }

    // Map all the images in the data variable
    else {
        const myResults = data.images.map((dat) => {
            return(<ResultEntry data={dat} key={dat.id}/>);
        })

        return (
            <div>
                <h3 style={{paddingLeft: '10px'}}>Displaying results {offset} - {maxResult} of {maxSize} total results.</h3>
                {myResults}
            </div>
        );
    }
  }
}



// Export it
export default Result

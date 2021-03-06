import React from 'react';
//const util = require('util');

function ResultEntry(props) {

    // variables
    //let filename = util.format("%d.jpg",props.data.id);
    let filename = props.data.file_name;
    //let imageUrl = "http://localhost:3001/api/pics/" + props.data.id;
    let imageUrl = "http://141.216.24.220:3001/api/pics/" + props.data.id;
    let imageUrlFixedWidth300 = "http://141.216.24.220:3001/api/pics/" + props.data.id + '?width=300';
    let imageUrlResize200 = "http://141.216.24.220:3001/api/pics/" + props.data.id + '?resize=200';
    let imageUrlResize50 = "http://141.216.24.220:3001/api/pics/" + props.data.id + '?resize=50';
    let imageUrlGrey = "http://141.216.24.220:3001/api/pics/" + props.data.id + '?greyscale=true';
    
    // css styling
    const imageStyle = {
        width: '300px',
        height: 'auto'
    }    

    const spanDescriptionName = {
        fontWeight: 'bold',
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
        <div className="result">
          <figure style={figureStyle}>
            <img src={imageUrlFixedWidth300} alt={props.data.id} style={imageStyle}/>
            <figcaption align="center"><a href={imageUrl} target="_blank" rel="noopener noreferrer">{filename}</a></figcaption>
          </figure>
          <div className="resultInfo">
              <span style={spanDescriptionName}>Captions:</span><br />
              {myCaptions}
              <span style={spanDescriptionName}>Flicker URL: </span><a href={props.data.flickerUrl} target="_blank" rel="noopener noreferrer">{props.data.flickerUrl}</a><br />
              <span style={spanDescriptionName}>COCO URL: </span><a href={props.data.cocoUrl} target="_blank" rel="noopener noreferrer">{props.data.cocoUrl}</a><br />
              <span style={spanDescriptionName}>Image Width: </span>{props.data.width}<br />
              <span style={spanDescriptionName}>Image Height: </span>{props.data.height}<br /> 
              <span style={spanDescriptionName}>Date Captured: </span>{props.data.date_captured}<br /> 
              <span style={spanDescriptionName}>Image Size (bytes): </span>{props.data.file_size}<br /> 
              <span style={spanDescriptionName}>NodeJS Image Manipulations: </span>Size <a href={imageUrlResize50} target="_blank" rel="noopener noreferrer">50%</a> <a href={imageUrl} target="_blank" rel="noopener noreferrer">100%</a> <a href={imageUrlResize200} target="_blank" rel="noopener noreferrer">200%</a> - <a href={imageUrlGrey} target="_blank" rel="noopener noreferrer">Greyscale</a><br />
              <span style={spanDescriptionName}>License: </span><a href={props.data.licenseUrl} target="_blank" rel="noopener noreferrer">{props.data.license}</a><br />
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
    let realnum = Number(data.offset) + 1;
    let maxSize = Number(data.maxSize);
    let maxResult = Number(data.offset) + Number(data.size);
    if(maxResult > maxSize) { maxResult = maxSize; }

    //console.log("Result: " + data)
    //console.log("Size: " + data.size)
    //console.log("initial: " + this.props.initial);

    // if no results, then just return a "Not Found" message
    if(this.props.initial === 1) { return(<span>&nbsp;</span>); }

    else if(this.props.searchinprogress === 1) { return(<span>Searching...</span>); }

    else if(data.maxSize <= 0) {
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
                <h3 style={{paddingLeft: '10px'}}>Displaying results {realnum} - {maxResult} of {maxSize} total results.</h3>
                {myResults}
            </div>
        );
    }
  }
}



// Export it
export default Result

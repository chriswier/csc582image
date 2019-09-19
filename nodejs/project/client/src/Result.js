import React from 'react';
const util = require('util');

function ResultEntry(props) {

    // variables
    let filename = util.format("%d.jpg",props.data.id);
    let imageUrl = "http://localhost:3001/api/pics/" + props.data.id;
    
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
          borderRadius: 8,
          display: 'inline-block',
          //color: '#ffcd05',
          fontFamily: 'Georgia',
          fontSize: 16,
          textDecoration: 'none',
          width: '100%',
          margin: '5px',
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
          <div style={{paddingTop: '10px', marginLeft: '-25px'}}>
              <span style={spanDescriptionName}>Captions:</span><br />
              {myCaptions}
              <span style={spanDescriptionName}>Flicker URL: </span><a href={props.data.flickerUrl}>{props.data.flickerUrl}</a><br />
              <span style={spanDescriptionName}>COCO URL: </span><a href={props.data.cocoUrl}>{props.data.cocoUrl}</a><br />
              <span style={spanDescriptionName}>Image Width: </span>{props.data.width}<br />
              <span style={spanDescriptionName}>Image Height: </span>{props.data.height}<br /> 
              <span style={spanDescriptionName}>License: </span>{props.data.license}<br />
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

    // bail out if this is too early
    if(typeof this.props.data.size === 'undefined') {
        //console.log("Early rendering; no data.  Return null")
        return null;
    }

    // data from super
    const data = this.props.data;
    //console.log(data)
    //console.log("Size: " + data.size)

    // if no results, then just return a "Not Found" message
    if(data.size <= 0) {
        return (
            <h3>No results found. &#9785;</h3>
        );
    }

    // Map all the images in the data variable
    else {
        const myResults = data.images.map((dat) => {
            return(<ResultEntry data={dat} key={dat.id}/>);
        })

        return (
            <div>
                <h3 style={{paddingLeft: '10px'}}>Displaying results {data.offset * data.size} - {data.size} of {data.maxSize}.</h3>
                {myResults}
            </div>
        );
    }
  }
}



// Export it
export default Result

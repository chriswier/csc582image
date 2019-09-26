import React, { Component } from 'react';
import SearchForm from './SearchForm.js';
import Result from './Result.js';
import logo from './CSIS.Stamp.Vert.eps200x200.jpg';
import './index.css';

// Based loosely on https://medium.com/javascript-in-plain-english/full-stack-mongodb-react-node-js-express-js-in-one-simple-app-6cc8ed6de274

// global vars
var host = '141.216.24.220';


// define react
class App extends Component {

  constructor(props) {
    super(props);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.onNavPrev = this.onNavPrev.bind(this);
    this.onNavNext = this.onNavNext.bind(this);
    this.getDBData = this.getDBData.bind(this);


    // initialize the state
    this.state = {
      data: {
        size: 0,
        offset: 0,
        maxSize: 0,
      },
      searchvalue: null,
      searchsize: 5,
      searchinprogress: 0,
      // width: null,
      // widthoperator: null,
      // height: null,
      // heightoperator: null,
      initial: 1,
      message: 'Please enter a search term above.',
    };
  } 


  // when the component mounts, first thing it does is fetch all existing data
  // in our db.  after that we put in polling logic to see if the db has changed
  // and update our UI
  componentDidMount() { }

  // kill processes when we are done with it
  componentWillUnmount() { }

  handleSizeChange(value) {
    //console.log('handleSizeChange: ' + value);
    this.setState({ searchsize: value });
    this.getDBData(this.state.data.offset,value);
  }

  onNavPrev(value) {
    let newOffset = Number(this.state.data.offset);
    let oldOffset = Number(this.state.data.offset);
    let currentSize = Number(this.state.data.size);

    if(oldOffset - currentSize >= 0) {
      newOffset = oldOffset - currentSize;
    }

    let newData = this.state.data;
    newData['offset'] = newOffset;
    this.setState({ data: newData });
    // console.log("handleNavPrev newOffset: " + this.state.data.offset + " oldOffset: " + oldOffset + " currentSize: " + currentSize);

    // call the getDBData function
    this.getDBData(newOffset,currentSize);
  }

  onNavNext(value) {
    let newOffset = Number(this.state.data.offset);
    let oldOffset = Number(this.state.data.offset);
    let currentSize = Number(this.state.data.size);
    let maxSize = Number(this.state.data.maxSize);

    if(oldOffset + currentSize <= maxSize) {
      newOffset = oldOffset + currentSize;
    }
    let newData = this.state.data;
    newData['offset'] = newOffset;
    this.setState({ data: newData });
    // console.log("handleNavNext newOffset: " + this.state.data.offset + " oldOffset: " + oldOffset + " currentSize: " + currentSize + " maxSize: " + maxSize);

    // call the getDBData function
    this.getDBData(newOffset,currentSize);
  }

  handleSearchSubmit(e) {

    // check for null value
    if(typeof this.state.searchvalue === 'undefined' || 
       this.state.searchvalue == null) {
       //console.log("handleSearchSubmit(): empty search submitted.");
       this.setState({ message: 'Please enter a non-empty search term above.' });
       return;
    }

    // set searchInProgress, initial, and message
    this.setState({ initial: 0, message : null, searchinprogress: 1 });
    //console.log("handleSearchSubmit(): searching for " + this.state.searchvalue);

    // localvariables
    let offset = 0;  // reset since this is a new search

    // call the getDBData function
    this.getDBData(offset,this.state.searchsize);
  }

  // main function to get all the data
  getDBData(offset,size) {
    //console.log("getDBData: offset " + offset + " size: " + size);

    // check for null value in search again
    if(typeof this.state.searchvalue === 'undefined' || 
       this.state.searchvalue == null) {
       console.log("getDBData: returning due to null");
       return;
    }

    // make the data to upload
    let uploaddata = {
      searchvalue: this.state.searchvalue,
      searchsize: size,
      offset: offset,
    };

    //console.log("getDBData: uploaddata " + JSON.stringify(uploaddata));

    fetch('http://' + host + ':3001/api/search', {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploaddata),
    })
    .then((data) => data.json())
    .then((res) => this.setState({ data: res, searchinprogress: 0 }));

    //console.log("getDBData returns");
  }

  // deal with searchNum change
  handleSearchChange(value) {
    this.setState({ searchvalue: value });
  }

  render() {

    // css declarations
    const logoFloatLeft = {
      float: 'left',
      backgroundColor: 'white',
      padding: 5,
      margin: 5,
      marginRight: 10,
      marginTop: 8,
      marginLeft: 8,
    }

    const spanbold = {
      fontWeight: 'bold',
      fontSize: 26,
      paddingTop: 10,
    }

    // main UI return
    return (
      <div>
        <div style={{ float: 'left' }}>
          <img src={logo} style={logoFloatLeft} alt="UMFlint CSIS Logo" />
        </div>
        <div class="headerBanner">
          <span style={spanbold}>CSC582 SQL Image and NodeJS Project &nbsp; <a href="https://github.com/chriswier/csc582image" target="_blank" rel="noopener noreferrer">(Github)</a></span><br />
          Chris Wieringa cwiering@umich.edu<br />
          Fall 2019 Semester<br />
          Professor: Dr. Halil Bisgin<br /><br />
          Provides a searchable interface to the <a href="http://cocodataset.org" target="_blank" rel="noopener noreferrer">COCO Dataset</a> 2017 training images (118,287 images/~19GB data).  All data is stored in Oracle SQL 2019 Standard Edition, and queried via NodeJS React frontend and an Node Express API backend. Images are stored as BLOBs and captions are indexed. <a href="usage.html" target="_blank" rel="noopener noreferrer">COCO Dataset Terms and Usage</a> 
          </div>
        <div className="searchBar">
          <SearchForm searchvalue={this.searchvalue} onSearchChange={this.handleSearchChange} onSearchSubmit={this.handleSearchSubmit} onSizeChange={this.handleSizeChange} onNavNext={this.onNavNext} onNavPrev={this.onNavPrev} data={this.state.data} />
        </div>
        <div style={{padding: 5}}>
        {this.state.message}
        </div>
        <div>
          <Result data={this.state.data} initial={this.state.initial} searchinprogress={this.state.searchinprogress} />
        </div>
      </div>
    );
  }
}

export default App;

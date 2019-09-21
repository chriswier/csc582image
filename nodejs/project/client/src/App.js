import React, { Component } from 'react';
import SearchForm from './SearchForm.js';
import Result from './Result.js';
import logo from './CSIS.Stamp.Vert.eps200x200.jpg';
//import axios from 'axios';

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
    this.getDataFromBackend = this.getDataFromBackend.bind(this);

    // initialize the state
    this.state = {
      data: [],
      navigation: "<<< Navigation >>>",
      searchvalue: null,
      searchsize: 5,
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
  componentDidMount() {
//    this.getDataFromBackend();
    
  }

  // kill processes when we are done with it
  componentWillUnmount() {

  }

  // get the data from the Backend
  getDataFromBackend = () => {
    console.log("getDataFromBackend");
      //fetch('http://localhost:3001/api/search')
      fetch('http://' + host + ':3001/api/search')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));

    // recalculate the navigation bar
    if (this.state.data.size === 0 || typeof this.state.data.size === 'undefined') {
      this.setState({ navigation: null });
    } else {

      var previous, next;
      if (this.state.data.offset <= 0) {
        previous += "&lt;&lt;&lt;";
      } else {
        previous += "<a href='blah'>&lt;&lt;&lt;</a>";
      }

      if (this.state.data.offset + this.state.data.size >= this.state.data.maxSize) {
        next += "&gt;&gt;&gt;"
      } else {
        next += "<a href='next'>&gt;&gt;&gt;&gt;</a>";
      }

      let nav = previous + " Navigation " + next;
      this.setState({ navigation: nav });
      console.log("Nav: " + this.state.navigation)
    }
  }

  handleSearchChange(value) {
    this.setState({ searchvalue: value });
  }

  handleSizeChange(value) {
    //console.log('handleSizeChange: ' + value);
    this.setState({ searchsize: value });
  }

  handleSearchSubmit(e) {

    // check for null value
    if(typeof this.state.searchvalue === 'undefined' || 
       this.state.searchvalue == null) {
       //console.log("handleSearchSubmit(): empty search submitted.");
       this.setState({ message: 'Please enter a non-empty search term above.' });
       return;
    }

    // otherwise, continue on
    this.setState({ initial: 0, message : null });
    //console.log("handleSearchSubmit(): searching for " + this.state.searchvalue);

    // localvariables
    let offset = 0;
    if(typeof this.state.data.offset !== 'undefined' &&
       this.state.data.offset !== null
    ) { 
      offset = this.state.data.offset;
    }

    // make the data to upload
    let uploaddata = {
      searchvalue: this.state.searchvalue,
      searchsize: this.state.searchsize,
      offset: offset,
    };

    fetch('http://' + host + ':3001/api/search', {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploaddata),
    })
    .then((data) => data.json())
    .then((res) => this.setState({ data: res }));

    //console.log("afterpost: " + JSON.stringify(this.state));
  }

  render() {

    //const util = require('util');
    //const myData = util.inspect(this.state.data, false, null, true);

    const headercss = {
      height: 180,
      backgroundColor: '#00274c',
      fontFamily: "Georgia",
      fontSize: 18,
      color: '#FFCB05',
      marginTop: 5,
      paddingTop: 5,
    }

    const searchcss = {
      backgroundColor: '#FFCB05',
      fontFamily: "Georgia",
      fontSize: 18,
      color: '#00274c',
      height: 45,
      paddingTop: 5,
      paddingLeft: 5,
    }

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

    return (
      <div>
        <div style={{ float: 'left' }}>
          <img src={logo} style={logoFloatLeft} alt="UMFlint CSIS Logo" />
        </div>
        <div style={headercss}>
          <span style={spanbold}>CSC582 SQL Image and NodeJS Project</span><br />
          Chris Wieringa (cwiering@umich.edu)<br />
          Fall 2019 Semester<br />
          Professor: Dr. Halil Bisgin<br /><br />
          Provides a searchable interface to the COCO Dataset images.  All images are stored in Oracle SQL as BLOBs, and queried via NodeJS React frontend and an Node Express API backend. <a href="usage.html">COCO Dataset Terms and Usage</a>
          </div>
        <div style={searchcss}>
          <SearchForm searchvalue={this.searchvalue} onSearchChange={this.handleSearchChange} onSearchSubmit={this.handleSearchSubmit} onSizeChange={this.handleSizeChange} navigation={this.state.navigation} />
        </div>
        <div style={{padding: 5}}>
        {this.state.message}
        </div>
        <div>
          <Result data={this.state.data} />
        </div>
      </div>
    );
  }
}

export default App;

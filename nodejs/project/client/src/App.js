import React, { Component } from 'react';
import SearchForm from './SearchForm.js';
import Result from './Result.js';
import logo from './CSIS.Stamp.Vert.eps200x200.jpg';
// import axios from 'axios';

// Based loosely on https://medium.com/javascript-in-plain-english/full-stack-mongodb-react-node-js-express-js-in-one-simple-app-6cc8ed6de274

class App extends Component {

  constructor(props) {
    super(props);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.getDataFromBackend = this.getDataFromBackend.bind(this);

    // initialize the state
    this.state = {
      data: [],
      navigation: null,
      searchvalue: null,
      // width: null,
      // widthoperator: null,
      // height: null,
      // heightoperator: null,
      initial: 1,
    };
  }

  // when the component mounts, first thing it does is fetch all existing data
  // in our db.  after that we put in polling logic to see if the db has changed
  // and update our UI
  componentDidMount() {
    this.getDataFromBackend();
  }

  // kill processes when we are done with it
  componentWillUnmount() {

  }

  // get the data from the Backend
  getDataFromBackend = () => {
    console.log("getDataFromBackend");
    fetch('http://localhost:3001/api/search')
      //fetch('http://141.216.24.220:3001/api/search')
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

  handleSearchSubmit(e) {
    this.setState({ initial: 0 });
    console.log("Submit function");
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

    const footercss = {
      fontSize: 12,
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
          Provides a searchable interface to the COCO Dataset images.  All images are stored in Oracle SQL as BLOBs, and queried via NodeJS React frontend and an Node Express API backend.
          </div>
        <div style={searchcss}>
          <SearchForm searchvalue={this.searchvalue} onSearchChange={this.handleSearchChange} onSearchSubmit={this.handleSearchSubmit} navigation={this.state.navigation} />
        </div>
        <div>
          <Result data={this.state.data} />
        </div>

        <div style={footercss}>
          <hr />
          All images and dataset captions, etc are provided from the <a href="http://cocodataset.org">COCO Consortium</a> and are used under Creative Commons Attribution 4.0 License.  The COCO Consortium does not own the copyright of the images. Use of the images must abide by the <a href="https://info.yahoo.com/legal/us/yahoo/utos/utos-173.html">Flickr Terms of Use</a>. The users of the images accept full responsibility for the use of the dataset, including but not limited to the use of any copies of copyrighted images that they may create from the dataset. As required, the following copyright notice is served.<hr />
          Copyright (c) 2015, COCO Consortium. All rights reserved. Redistribution and use software in source and binary form, with or without modification, are permitted provided that the following conditions are met:

          <ul>
            <li>Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.</li>
            <li>Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.</li>
            <li>Neither the name of the COCO Consortium nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.</li>
          </ul>THIS SOFTWARE AND ANNOTATIONS ARE PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        </div>
      </div>
    );
  }
}

export default App;

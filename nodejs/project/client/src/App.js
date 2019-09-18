import React, { Component } from 'react';
import logo from './CSIS.Stamp.Vert.eps200x200.jpg';

// Based loosely on https://medium.com/javascript-in-plain-english/full-stack-mongodb-react-node-js-express-js-in-one-simple-app-6cc8ed6de274

class App extends Component {
  render() {

    const headercss = {
      height: 173,
      backgroundColor: '#00274c',
      fontFamily: "Georgia",
      fontSize: 18,
      color: '#FFCB05',
      marginTop: 10,
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

    const imageFloat = {
      float: 'left',
      backgroundColor: 'white',
      padding: 5,
      margin: 5,
      marginRight: 10,
    }

    const spanbold = {
      fontWeight: 'bold',
      fontSize: 26,
      paddingTop: 10,
    }

    return (
      <div>
        <div style={{ float: 'left' }}>
          <img src={logo} style={imageFloat} alt="UMFlint CSIS Logo" />
        </div>
        <div style={headercss}>
          <span style={spanbold}>CSC582 SQL Image and NodeJS Project</span><br />
          Chris Wieringa (cwiering@umich.edu)<br />
          Fall 2019 Semester<br />
          Professor: Dr. Halil Bisgin<br /><br />
          Provides a searchable interface to the COCO Dataset images.  All images are stored in Oracle SQL as BLOBs, and queried via NodeJS React and an Express API.
          </div>
        <div style={searchcss}>
          Search
        </div>
        <div style={{height: 600 }}>Response content</div>

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

import React from 'react';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
  }

  // event handlers
  handleChange(event) {
    this.props.onSearchChange(event.target.value);
  }

  handleSizeChange(event) {
    this.props.onSizeChange(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSearchSubmit();
  }

  render() {

    // searchvalue from super
    const searchvalue = this.props.searchvalue;
    const sizevalue = this.props.size;
    const navigation = this.props.navigation;

    // css styles
    const spansearch = {
          backgroundColor: '#00274c',
          borderRadius: 8,
          display: 'inline-block',
          //color: '#ffcd05',
          color: 'white',
          fontFamily: 'Georgia',
          fontSize: 16,
          fontWeight: 'bold',
          padding: '10px 20px',
          textDecoration: 'none',
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <span style={spansearch}>Search: &nbsp;
          <input type="text" value={searchvalue} onChange={this.handleChange} /> &nbsp; 
          <input type="submit" value="Submit" />
          &nbsp; &nbsp;Results Shown: &nbsp;
          <select value={sizevalue} onChange={this.handleSizeChange}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          &nbsp; &nbsp;{navigation}
        </span>
      </form>
    );
  }
}

// Export it
export default SearchForm

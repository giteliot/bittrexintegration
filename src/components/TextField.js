import React, { Component } from 'react';

class TextField extends React.Component {
	constructor() {
	    super();
	    this.state = {value : ''}
	}

	handleChange = (e) =>{ 
	    this.setState({value: e.target.value});
	}

	handleKeyPress = (event) => {
		 if(event.key == 'Enter'){
		   console.log(this.state.value)
		 }
		}

	render() {
		var style = {
			padding: "1em",
			textAlign: "center"
	    };

		return (
			<div style={style}>
			<input onKeyPress={this.handleKeyPress} 
			       value={this.state.value} 
			       onChange={this.handleChange} 
			       type="text"/>
			</div>
			);
	} 
}

export default TextField;
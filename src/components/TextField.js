import React, { Component } from 'react';

class TextField extends React.Component {
	render() {
		var style = {
			padding: "1em",
			textAlign: "center"
	    };

		return (
			<div style={style}>
			<input  type="text"/>
			</div>
			);
	} 
}

export default TextField;
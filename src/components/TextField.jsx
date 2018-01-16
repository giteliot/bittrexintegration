import React from 'react';

class TextField extends React.Component {
	constructor() {
	    super();
	    this.state = {value : ''}
	}

	handleChange = (e) =>{ 
	    this.setState({value: e.target.value});
	}

	handleKeyPress = (event) => {
		 if(event.key === 'Enter'){
		 	this.setState({value : ''});
			this.props.parentKeyPress(this.state.value)
		 }
		}
	

	render() {
		const style = {
			padding: "1em",
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
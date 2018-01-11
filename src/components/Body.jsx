import React from 'react';
import TextField from './TextField';
import GainsSection from './GainsSection';

class Body extends React.Component {
	constructor() {
		super();
		this.state = {pairs: []};
	}

	addPair(pair) {
		this.state.pairs.push(pair);
		this.setState({
			pairs: this.state.pairs
		}); 
		console.log("Added "+pair);
	}

	removePair(pair) {
		this.state.pairs.splice(this.state.pairs.indexOf(pair),1);
		this.setState({
			pairs: this.state.pairs
		}); 
		console.log("Removed "+pair);
	}

	render() {
		var xbtn = {
			height: "24px",
			width: "24px",
		}

		const float = {
			float: "left",
		};

		return (
				<div>
				 <div className="App-intro">
			      Welcome to The Good Boi Bot
			     </div>
        		 <GainsSection/>
	       		</div>
			);

	}
}

export default Body
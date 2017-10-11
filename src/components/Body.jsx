import React from 'react';
import TextField from './TextField';
import PercentageRow from './PercentageRow';

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
		return (
				<div>
				 <div className="App-intro">
			      Welcome to the Money Maker
			      </div>
				 <TextField parentKeyPress={this.addPair.bind(this)}/>
	       		 <ul>
          		  {this.state.pairs.map(function(pair){
            	   return <li key={pair}><img onClick = {this.removePair.bind(this,pair)} src={require('../cancel-button.png')} height="24" width = "24" alt="X"/><PercentageRow pair = {pair}/></li>;
          		  }, this)}
        		 </ul>
	       		</div>
			);

	}
}

export default Body
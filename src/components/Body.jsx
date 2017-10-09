import React from 'react';
import TextField from './TextField';
import TextBlock from './TextBlock';

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

	render() {
		return (
				<div>
				 <div className="App-intro">
			      Welcome to the Money Maker
			      </div>
				 <TextField parentKeyPress={this.addPair.bind(this)}/>
	       		 <ul>
          		  {this.state.pairs.map(function(pair){
            	   return <li key = {pair}><TextBlock txt = {pair}/></li>;
          		  })}
        		 </ul>
	       		</div>
			);

	}
}

export default Body
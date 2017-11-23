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
			      Welcome to the Money Maker
			      </div>
				 <TextField parentKeyPress={this.addPair.bind(this)}/>
	       	 {/*<ul>
          		  {this.state.pairs.map(function(pair,i){
            	   return <li key={i}>
            	   		   <div style={float}>
		            	   <img onClick = {this.removePair.bind(this,pair)} src={require('../cancel-button.png')} style={xbtn} alt="X"/>
		            	   <PercentageRow pair = {pair}/>
		            	   </div>
		            	  </li>;
          		  }, this)}
        		 </ul>*/}
        		 <div style={float}>
        		 <PercentageRow pair = "BTC-ETH"/>
        		 </div>
	       		</div>
			);

	}
}

export default Body
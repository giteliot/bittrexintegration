import React from 'react';
import TextBlock from './TextBlock';

class PercentageRow extends React.Component {
	constructor() {
		super();
		this.state = {percentages: []}
	}

	componentDidMount() {
	    /*setInterval(function() {
	    	console.log("Updating value of "+this.props.pair);
	    }.bind(this), 60000);*/
		fetch('/api/v1/update')
		  .then(function(response) {
		    console.log(response)
		  }).fail(function(error) {
		    console.log(error);
		  });
	}

	render() {
		const bold = {
			fontWeight: "bold",
		};

		const float = {
			float: "right",
			paddingTop: "0.2em",
		};


		return (
				<div style={float}>
				<span style={bold}><TextBlock txt = {this.props.pair+":"}/></span>
				{this.state.percentages.map((perc,i) =>
					 <TextBlock color={perc>0?"green":"red"} key = {i} txt = {perc+"%"}/>
			    )}
			    </div>
			);
	}
}

export default PercentageRow;
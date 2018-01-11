import React from 'react';
import TitleBlock from './TitleBlock';

class GainsSection extends React.Component {
	constructor() {
		super();
		this.state = {ethGain: 0, btcGain: 0}
	}

	componentDidMount() {
	    /*setInterval(function() {
	    	console.log("Updating value of "+this.props.pair);
	    }.bind(this), 60000);*/
	    const _this = this;
		fetch('/api/v1/trade/gains')
		  .then(function(response) {
		    return response.json();
		  }).then(function(json) {
		    _this.setState({ethGain: json.netEth+"  ( "+json.ethGain+" - "+json.ethOutstanding+" )", 
		    			    btcGain: json.netBtc+"  ( "+json.btcGain+" - "+json.btcOutstanding+" )"});
		  });
	}

	render() {
		const txt = this.props.txt;

		const padding = {
			paddingLeft: "1.5em",
			paddingTop: "1em",
			fontSize: "0.8em",
		}

		const bold = {
			fontWeight: "bold",
		};

		return (
			<div>
			<TitleBlock txt = "Gains"/>
			<div style= {padding}>
			<span style = {bold}>ETH: </span><span>{this.state.ethGain}</span>
			</div>
			<div style= {padding}>
			<span style = {bold}>BTC: </span><span>{this.state.btcGain}</span>
			</div>
			</div>
			);
	}

}

export default GainsSection;
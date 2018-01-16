import React from 'react';
import TitleBlock from './TitleBlock';

class GainsSection extends React.Component {
	constructor() {
		super();
		this.state = {ethGain: 0, btcGain: 0}
	}

	componentDidMount() {

	    const _this = this;
		fetch('/api/v1/trade/gains')
		  .then(function(response) {
		    return response.json();
		  }).then(function(json) {
		  	if (json && json.netEth && json.netBtc)
		    _this.setState({ethGain: json.netEth+"  ( "+json.ethGain+" - "+json.ethOutstanding+" )", 
		    			    btcGain: json.netBtc+"  ( "+json.btcGain+" - "+json.btcOutstanding+" )"});
		  });
	}

	render() {

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
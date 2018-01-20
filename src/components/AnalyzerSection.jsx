import React from 'react';
import TitleBlock from './TitleBlock';
import TextField from './TextField';
import KeyValueBlock from './KeyValueBlock';
import TransactionItem from './TransactionItem';

class AnalyzerSection extends React.Component {
	constructor() {
		super();
		this.state = {}
	}

	handleKeyPress(value) {
		const _this = this;
		_this.setState({});

		fetch('/api/v1/data/analyzepair/'+value)
		  .then(function(response) {
		    return response.json();
		  }).then(function(json) {
		  	if (json && json.pair)
		  		console.log(json)
		    	_this.setState(json);
		  });
	}

	componentDidMount() {

		
	}

	render() {

		const padding = {
			paddingLeft: "1.5em",
			paddingTop: "1em",
			fontSize: "0.8em",
		}

		const _this = this;
		const _state = _this.state;
		if (!_state.spikes)
			_state.spikes = [];

		return (
			<div>
			<TitleBlock txt = "Analyze"/>
			<TextField parentKeyPress = {this.handleKeyPress.bind(this)}/>
			{ 
				_this.state.analysis && (
					<div>
					<KeyValueBlock txt = "Market: " val = {this.state.pair}/>
					<KeyValueBlock txt = "Buyable: " val = {""+this.state.analysis.buyable}/>
					<KeyValueBlock txt = "Alert Rank: " val = {this.state.analysis.rank}/>
					<KeyValueBlock txt = "Ratio Rank: " val = {this.state.analysis.ratiorank}/>
					<KeyValueBlock txt = "Spikes: " val = {this.state.analysis.switch+" (sw); "+this.state.analysis.upswing+" (up); "+this.state.analysis.downswing+" (down)"}/>
					<KeyValueBlock txt = "Total Value: " val = {this.state.analysis.spikeValues}/>
					</div>
				)
				
			}
			<div style = {padding}>
			{_state.spikes.map((spike,i) =>
					 <TransactionItem key = {i} orderId = {_state.spikes.length-i} time = {spike.date} market = {spike.perc} result = {spike.value}/>
			    )}
			</div>
			</div>
			);
	}

}

export default AnalyzerSection;
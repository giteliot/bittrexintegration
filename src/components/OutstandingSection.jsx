import React from 'react';
import TitleBlock from './TitleBlock';
import TransactionItem from './TransactionItem';


class OustandingSection extends React.Component {
	constructor() {
		super();
		this.state = {outstanding : [

	    ]};
	}

	componentDidMount() {

		const reverse = function(arr) {
		   var result = [],
		       ii = arr.length;
		   for (var i = ii - 1;i > -1;i--) {
		       result.push(arr[i]);
		   }
		   return result;
		}

	    const _this = this;
		fetch('/api/v1/trade/outstanding')
		  .then(function(response) {
		    return response.json();
		  }).then(function(json) {
		  	if (json && json.length > 0)
		    _this.setState({outstanding: reverse(json)});
		  });

	}

	render() {

		const padding = {
			paddingLeft: "1.5em",
			paddingTop: "1em",
			fontSize: "0.8em",
		}

		const _state = this.state;

		return (
			<div>
			<TitleBlock txt = "Oustanding"/>
			<div style={padding}>
				{_state.outstanding.map((buy,i) =>
					 <TransactionItem key = {i} orderId = {_state.outstanding.length-i} time = {buy.date} market = {buy.market} result = {buy.price}/>
			    )}
			    </div>
			</div>
			);
	}

}

export default OustandingSection;
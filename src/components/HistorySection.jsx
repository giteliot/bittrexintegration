import React from 'react';
import TitleBlock from './TitleBlock';
import TransactionItem from './TransactionItem';


class HistorySection extends React.Component {
	constructor() {
		super();
		this.state = {transactions : [

	    ]};

	    
	}

	componentDidMount() {

		const reverse = function(arr) {
		   var result = [],
		       ii = arr.length;
		   for (var i = ii - 1;i !== 0;i--) {
		       result.push(arr[i]);
		   }
		   return result;
		}

	    const _this = this;
		fetch('/api/v1/trade/history')
		  .then(function(response) {
		    return response.json();
		  }).then(function(json) {
		  	if (json && json.length > 0)
		    _this.setState({transactions: reverse(json)});
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
			<TitleBlock txt = "History"/>
			<div style={padding}>
				{_state.transactions.map((tr,i) =>
					 <TransactionItem key = {i} orderId = {_state.transactions.length-i} time = {tr.date} market = {tr.market} result = {tr.gain}/>
			    )}
			    </div>
			</div>
			);
	}

}

export default HistorySection;
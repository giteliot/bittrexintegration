import React from 'react';
import TextBlock from './TextBlock';

class PercentageRow extends React.Component {
	constructor() {
		super();
		this.state = {percentages: []}
	}

	render() {
		return (
			<TextBlock txt = {this.props.pair}/>
			);
	}
}

export default PercentageRow;
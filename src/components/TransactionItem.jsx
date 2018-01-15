import React from 'react';

class TextBlock extends React.Component {
	render() {
		const id = this.props.orderId;
		const time = this.props.time;
		const market = this.props.market;
		const result = this.props.result;

		const bold = {
			fontWeight: "bold",
		}

		return (
			<div>
			<span>{id+". "}</span><span>({time}) </span><span style = {bold}>{market}: </span><span>{result}</span>
			</div>
			);
	}
}

export default TextBlock;
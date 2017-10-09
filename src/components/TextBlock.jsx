import React from 'react';

class TextBlock extends React.Component {
	constructor() {
		super();
	}
	render() {
		const style = {
			padding: "1em",
		}

		const txt = this.props.txt;

		return (
				<div style={style}>
				 <span>{txt}</span>
				</div>
			);

	}
}

export default TextBlock;
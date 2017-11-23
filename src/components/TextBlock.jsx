import React from 'react';

class TextBlock extends React.Component {
	render() {
		const txt = this.props.txt;
		const color = this.props.color? this.props.color : "black";

		const style = {
			padding: "1em",
			color: color,
		}

		return <span style={style}>{txt}</span>;
	}
}

export default TextBlock;
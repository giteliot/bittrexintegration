import React from 'react';

class TextBlock extends React.Component {
	render() {
		const style = {
			padding: "1em",
		}

		const txt = this.props.txt;

		return <span style={style}>{txt}</span>;
	}
}

export default TextBlock;
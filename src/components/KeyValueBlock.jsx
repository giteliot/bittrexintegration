import React from 'react';

class TextBlock extends React.Component {
	render() {
		const txt = this.props.txt;
		const val = this.props.val;

		const padding = {
			paddingLeft: "1.5em",
			paddingTop: "1em",
			fontSize: "0.8em",
		}

		const bold = {
			fontWeight: "bold",
		};

		return (
			<div style={padding}>
			<span style={bold}>{txt}</span><span>{val}</span>
			</div>
			);
	}
}

export default TextBlock;
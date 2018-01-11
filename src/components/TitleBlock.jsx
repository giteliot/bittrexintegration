import React from 'react';

class TitleBlock extends React.Component {

	render() {
		const txt = this.props.txt;

		const style = {
			padding: "1em",
			fontWeight: "bold",
		}

		return (
			<div>
			<hr/>
			<span style={style}>{txt}</span>
			</div>
			);
	}

}

export default TitleBlock;
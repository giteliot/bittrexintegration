import React from 'react';

class TextBlock extends React.Component {
	render() {
		var style = {
			padding: "1em",
	    };

		return (
				<div style={style}>
				 <span>20%</span>
				</div>
			);

	}
}

export default TextBlock;
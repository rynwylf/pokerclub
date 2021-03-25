import React from 'react';

import './Block.scss';

const Block = ( props ) =>
    <div className="block">
		<h2>{props.title}</h2>
		{props.children}
    </div>


export default Block;

import React from 'react';

import './Movement.scss';

const Standings = ( props ) =>
    <div className={"movement " + ( props.value > 0 ? "up" : ( props.value < 0 ? "down" : "flat" ) : "flat" ) }>
		<span className="number">{Math.abs(props.value)}</span>
    </div>


export default Standings;

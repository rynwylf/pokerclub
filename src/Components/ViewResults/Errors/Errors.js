import React from 'react';

import './Errors.scss';

const Errors = ( props ) =>

    <div className="errors">
		<h2>There Were {props.errors.length} Errors Parsing the File</h2>
		<ul>
			{props.errors.map ( ( error, index ) => <li key={index}>{error.text}</li> )}
		</ul>
    </div>


export default Errors;

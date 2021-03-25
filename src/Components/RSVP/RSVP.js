import React from 'react';

import Block from '../Block/Block';

import './RSVP.scss';

const RSVP = ( props ) =>
	<Block title="RSVP">
		<p>1-Apr-2021</p>
		<table>
			<tr>
				<th>Place</th>
				<th>Reserved</th>
			</tr>
			<tr>
				<td>1</td>
				<td>Gordon</td>
			</tr>
		</table>
    </Block>


export default RSVP;

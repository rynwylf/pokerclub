import React from 'react';

import Block from '../Block/Block';
import Movement from './Movement/Movement';

import './Standings.scss';

const Standings = ( props ) =>
	<Block title="Standings">
		<table>
			<tr>
				<td><Movement value={2} /></td>
				<td>1</td>
				<td>Gordon</td>
			</tr>
			<tr>
				<td><Movement value={-2} /></td>
				<td>2</td>
				<td>David</td>
			</tr>
			<tr>
				<td><Movement value={0} /></td>
				<td>3</td>
				<td>Mark</td>
			</tr>
			<tr>
				<td><Movement value={0} /></td>
				<td>4</td>
				<td>James</td>
			</tr>
			<tr>
				<td><Movement value={-1} /></td>
				<td>5</td>
				<td>Mat</td>
			</tr>
			<tr>
				<td><Movement value={1} /></td>
				<td>6</td>
				<td>Kent</td>
			</tr>
		</table>
    </Block>


export default Standings;

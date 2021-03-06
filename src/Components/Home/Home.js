import React from 'react';
import { Link } from 'react-router-dom';

import './Home.scss';

const Home = ( props ) =>
    <div className="home">
		<h1>Options</h1>
		<Link to='/results/1-apr-21'>
			<button>1-April-2021</button>
		</Link>

		<Link to='/upload'>
			<button>View Game Log</button>
		</Link>
    </div>


export default Home;

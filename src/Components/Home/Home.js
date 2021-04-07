import React from 'react';
import { Link } from 'react-router-dom';

import './Home.scss';

const Home = ( props ) =>
    <div className="home">
		<Link to='/results/1-apr-21'>
			<button>1-April-2021</button>
		</Link>
		
		<Link to='/upload'>
			<button>Upload Game Log</button>
		</Link>
    </div>


export default Home;

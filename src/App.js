import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Heading from './Components/Heading/Heading';
import Home from './Components/Home/Home';
import UploadResults from './Components/UploadResults/UploadResults';
import Apr12021 from './Components/ViewResults/Apr12021';

import './App.scss';

function App() {
	return (
		<div className="container">
			<Heading />
  	  		<BrowserRouter>
      			<Switch>
					<Route path='/upload' component={UploadResults} />
					<Route path='/results/1-apr-21' component={Apr12021} />
	  				<Route path='/' component={Home} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;

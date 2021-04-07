import React, { useState } from 'react';
import { CSVReader } from 'react-papaparse';

import { parseFile } from '../../Parser/PokerGames';
import ViewResults from '../ViewResults/ViewResults';

import './UploadResults.scss';

const UploadResults = () =>
{
	const [error, setError] = useState ( null );
	const [data, setData] = useState(null);

	if ( data )
	{
		return <ViewResults data={data} showStyles={true}/>
	}
	else if ( error )
	{
		return <div className="upload-results"> <p>{JSON.stringify(error)}</p></div>
	}
	else
	{
		return <div className="upload-results">
					<CSVReader onDrop={(data) => setData ( parseFile ( data ) ) }
							style={{ display: "block"}}
							onError={(error) => {setError(error)}}>
							<span>Drop CSV file here or click to upload.</span>
					</CSVReader>
				</div>
	}
}


export default UploadResults;

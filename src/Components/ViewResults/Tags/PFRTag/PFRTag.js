import React from 'react';


const toText = pfr =>
{
	if ( pfr < 5 )
	{
		return "Very Passive";
	}
	else if ( pfr < 15 )
	{
		return "Passive";
	}
	else if ( pfr >= 35 )
	{
		return "Aggressive";
	}
	else if ( pfr >= 5 )
	{
		return "Very Aggressive";
	}
}

const PFRTag = props => <span>{toText(props.pfr)}</span>

export default PFRTag;

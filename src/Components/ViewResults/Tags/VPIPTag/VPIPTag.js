import React from 'react';


const toText = vpip =>
{
	if ( vpip <= 10 )
	{
		return "Very Tight";
	}
	else if ( vpip <= 15 )
	{
		return "Tight";
	}
	else if ( vpip >= 50 )
	{
		return "Very Loose";
	}
	else if ( vpip >= 30 )
	{
		return "Loose";
	}
}

const VPIPTag = props => <span>{toText(props.vpip)}</span>

export default VPIPTag;

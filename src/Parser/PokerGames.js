
import Parser from './PokerParser.js';

//const EVENT_ADMIN_UPDATED_STACK_ADD_QUEUED = "ADMIN_UPDATED_STACK_ADD_QUEUED";
//const EVENT_ADMIN_UPDATED_STACK_REMOVE_QUEUED = "ADMIN_UPDATED_STACK_REMOVE_QUEUED";
const EVENT_ADMIN_UPDATED_STACK = "ADMIN_UPDATED_STACK";
//const EVENT_ADMIN_UPDATED_STACK_RESET_QUEUED = "ADMIN_UPDATED_STACK_RESET_QUEUED";
//const EVENT_BIG_BLIND_CHANGE = "BIG_BLIND_CHANGE";
//const EVENT_SMALL_BLIND_CHANGE = "SMALL_BLIND_CHANGE";
//const EVENT_DEAD_SMALL_BLIND = "DEAD_SMALL_BLIND";
//const EVENT_IMPORTANT_MESSAGE = "IMPORTANT_MESSAGE";
const EVENT_JOIN = "JOIN";
//const EVENT_REQUEST = "REQUEST";
//const EVENT_REJECT_SEAT_REQUEST = "REJECT_SEAT_REQUEST";
//const EVENT_CANCEL_REQUEST = "CANCEL_REQUEST";
const EVENT_REMOVAL = "REMOVAL";
const EVENT_QUIT = "QUIT";
const EVENT_STAND = "STAND";
const EVENT_SIT = "SIT";
//const EVENT_APPROVED = "APPROVED";
//const EVENT_CHANGE_ID = "CHANGE_ID";
const EVENT_STACKS = "STACKS";
const EVENT_FLOP = "FLOP";
const EVENT_TURN = "TURN";
const EVENT_RIVER = "RIVER";
const EVENT_HAND_START = "HAND_START";
const EVENT_HAND_END = "HAND_END";
//const EVENT_YOUR_HAND = "YOUR_HAND";
const EVENT_POST_SMALL_BLIND = "POST_SMALL_BLIND";
const EVENT_POST_BIG_BLIND = "POST_BIG_BLIND";
const EVENT_FOLD = "FOLD";
const EVENT_CALL = "CALL";
const EVENT_CHECK = "CHECK";
const EVENT_BET = "BET";
const EVENT_RAISE = "RAISE";
//const EVENT_SHOW = "SHOW";
const EVENT_UNCALLED_BET_RETURNED = "UNCALLED_BET_RETURNED";
const EVENT_WIN = "WIN";

/**
 * Parse a row and create an object
 */
const parseCommand = ( entry ) =>
{
	try
	{
		return { text: entry[0], error: false, outcome: Parser.parse ( entry[0] ), dateTime: new Date ( entry[1] ), sequence: entry[2] };
	}
	catch ( error )
	{
		return { text: entry[0], error: true, errorValue: error, dateTime: entry[1], sequence: entry[2] };
	}
};

/**
 * Return true if the event at the index is a new deal with joins for each player in a stacks call that follows
 * Pattern for new game is
 * EVENT_HAND_START
 * JOIN for each player
 * STACKS with same amount of players as joined
 */
const newGame = ( events, index ) => {
	let outcome = false;

	if ( events[index].outcome.event === EVENT_HAND_START )
	{
		let joinCount = 0;

		for ( var j = index + 1; j < events.length; j ++ )
		{
			if ( events[j].outcome.event === EVENT_STACKS )
			{
				outcome = ( joinCount === events[j].outcome.stacks.length );
				break;
			}
			else if ( events[j].outcome.event !== EVENT_JOIN )
			{
				outcome = false;
				break;
			}
			else
			{
				joinCount ++;
			}
		}
	}

	return outcome;
};

/**
 *
 */
const addPlayerToGame = ( game, player ) => {

	for ( var i = 0; i < game.players.length; i ++ )
	{
		if ( game.players[i].code === player.code )
		{
			// Add a rebuy if the previous stacks with the player has 0 points
			let lastChips = 0;

			for ( var j = 0; j < game.stacks.length; j++ )
			{
				if ( game.stacks[j][player.code] >= 0 )
				{
					lastChips = game.stacks[j][player.code];
				}
			}

			if ( lastChips === 0 )
			{
				game.players[i].rebuys++;
			}

			return;
		}
	}

	game.players.push ( { ...player, rebuys: 0 } );
};

// /**
//  * Adds a final stacks to the game's events
//  */
// const finalStacks = ( currentGame, lastStacks, quits, lastChipTotal ) => {
//
// 	let values = {};
// 	lastStacks.forEach ( stack => { values[stack.player.code] = lastChipTotal } );
//
// 	let quitValues = {};
// 	quits.forEach ( quit => { values[quit.player.code] = quit.stack } );
//
// 	lastStacks = { dateTime: currentGame.events[currentGame.events.length - 1].dateTime, ...values, ...quitValues };
// 	currentGame.stacks.push ( lastStacks );
// }

/**
 * Determines the place in the game
 */
const determinePlace = ( game ) => {

	// Winner is the player at the last stacks with non-zero chips
	let finalStacks = game.stacks[game.stacks.length - 1];
	game.players.forEach ( player => { if ( finalStacks[player.code] > 0 ) player.place = 1 } );
	game.players.forEach ( player => { if ( finalStacks[player.code] === 0 ) player.place = 2 } );

	// Assign increasing places as players report 0 chips
	let place = 2;

	for ( var i = game.stacks.length - 2; i >= 0; i -- )
	{
		let stacks = game.stacks[i];
		let placeUsed = false;

		for ( var j = 0; j < game.players.length; j ++ )
		{
			let player = game.players[j];

			if ( stacks[player.code] === 0 && !player.place )
			{
				if ( !placeUsed )
				{
					place ++;
				}

				player.place = place;
			}
		}
	}
}

const getAdminStackChange = ( game, playerCode, startDateTime, endDateTime ) => {

	let change = 0;

	for ( var i = 0; i < game.events.length; i ++ )
	{
		let event = game.events[i];

		if ( event.dateTime >= startDateTime && event.dateTime <= endDateTime &&
				event.outcome.event === EVENT_ADMIN_UPDATED_STACK &&
				event.outcome.player.code === playerCode )
		{
			let delta = event.outcome.to - event.outcome.from;
			change += delta;
		}
	}

	return change;
}

const calculateStackShift = ( game, previous, current ) => {

	let output = {};

	for ( var code in current )
	{
		if ( code !== "dateTime" && previous && previous[code] )
		{
			let adminChange = getAdminStackChange ( game, code, previous.dateTime, current.dateTime );
			let delta = current[code] - ( previous[code] + adminChange );

			output[code] = {
					previous: previous[code],
					current: current[code],
					delta: delta,
					change: delta < 0 ? "LOSS" : ( delta > 0 ? "WIN" : "NONE" ),
					status: ( previous[code] + delta ) <= 0 ? "OUT" : ( previous[code] + delta + adminChange <= 0 ? "REMOVED" : "IN" )
				};
		}
	}

	return output;
}

/**
 * Returns true if the player was removed between the datetime
 */
const playerWasRemoved = ( game, player, startDateTime, endDateTime ) => {

	for ( var i = 0; i < game.events.length; i ++ )
	{
		let event = game.events[i];

		if ( event.dateTime >= startDateTime && event.dateTime <= endDateTime &&
				event.outcome.event === EVENT_REMOVAL &&
				event.outcome.player.code === player.code )
		{
			return true;
		}
	}

	return false;
}

/**
 * Determines the knockouts
 */
const determineKnockOuts = ( game ) => {

	let lastStacks = null;
	let knockOuts = [];

	for ( var i = 0; i < game.stacks.length; i ++ )
	{
		let stacks = game.stacks[i];

		var stackShift = calculateStackShift ( game, lastStacks, stacks );

		for ( var k = 0; k < game.players.length; k ++ )
		{
			if ( stackShift[game.players[k].code] &&
				stackShift[game.players[k].code].previous > stackShift[game.players[k].code].current &&
				stackShift[game.players[k].code].change === "LOSS" && stackShift[game.players[k].code].status === "OUT" &&
				!playerWasRemoved ( game, game.players[k], lastStacks.dateTime, stacks.dateTime ) )
			{
				// Who did it
				let by = [];

				for ( var l = 0; l < game.players.length; l ++ )
				{
					if ( stackShift[game.players[l].code] &&
						stackShift[game.players[l].code].previous >= stackShift[game.players[k].code].previous &&
						stackShift[game.players[l].code].change === "WIN" )
					{
						by.push ( game.players[l] );
					}
				}

				knockOuts.push ( { knockedOut: game.players[k], dateTime: stacks.dateTime, by: by } );
			}
		}

		lastStacks = stacks;
	}

	game.knockOuts = knockOuts;
}

const countKnockOuts = ( game, player ) => {

	let count = 0;

	for ( var i = 0; i < game.knockOuts.length; i ++ )
	{
		for ( var k = 0; k < game.knockOuts[i].by.length; k ++ )
		{
			var p = game.knockOuts[i].by[k];

			if ( player.code === p.code )
			{
				count ++;
			}
		}
	}

	return count;
}

/**
 * Assign points for the game
 */
const determinePoints = ( game ) => {

	const count = game.players.length;

	game.players.forEach ( player => player.knockOuts = countKnockOuts ( game, player ) );
	game.players.forEach ( player => player.points = ( 2 + ( count - player.place ) * 2 ) + ( player.place === 1 ? 2 : 0 ) + ( player.rebuys > 0 ? -1 : 0 ) + player.knockOuts );
}

const determineHighHand = ( games ) => {

	let highHands = [];

	for ( var i = 0; i < games.length; i ++ )
	{
		let gameHighHands = determineGameHighHand ( games[i] );

		if ( highHands.length === 0 || highHands[0].hand.value === gameHighHands[0].hand.value )
		{
			highHands = highHands.concat ( gameHighHands );
		}
		else if ( highHands[0].hand.value < gameHighHands[0].hand.value )
		{
			highHands = [];
			highHands = highHands.concat ( gameHighHands );
		}
	}

	return highHands;
}

const determineGameHighHand = ( game ) => {

	let highHands = [];

	for ( var i = 0; i < game.events.length; i ++ )
	{
		var event = game.events[i].outcome;

		if ( event.event === EVENT_WIN && event.hand !== null )
		{
			if ( highHands.length === 0 || highHands[0].hand.value === event.hand.value )
			{
				highHands.push ( event );
			}
			else if ( highHands[0].hand.value < event.hand.value )
			{
				highHands = [];
				highHands.push ( event );
			}
		}
	}

	return highHands;
}

const calculateVPIPForHand = ( game, number ) => {

	var inHand = false;
	var vpip = {};
	var bigBlindPlayer = null;

	game.players.forEach ( player => vpip[player.code] = { counts: false, paid: false } );

	for ( var i = 0; i < game.events.length; i ++ )
	{
		var event = game.events[i].outcome;

		if ( event.event === EVENT_HAND_START && event.number === number )
		{
			inHand = true;
		}
		else if ( event.event === EVENT_POST_BIG_BLIND && inHand === true )
		{
			bigBlindPlayer = event.player.code;
		}
		else if ( event.event === EVENT_FLOP )
		{
			inHand = false;
		}
		else if ( event.event === EVENT_CALL && inHand === true)
		{
			vpip[event.player.code] = { paid: true, counts: true };
		}
		else if ( event.event === EVENT_RAISE && inHand === true )
		{
			vpip[event.player.code] = { paid: true, counts: true };
		}
		else if ( event.event === EVENT_FOLD && inHand === true )
		{
			if ( vpip[event.player.code].paid !== true )
			{
				vpip[event.player.code] = { paid: false, counts: true };
			}
		}
		else if ( event.event === EVENT_CHECK && inHand === true )
		{
			if ( event.player.code === bigBlindPlayer && vpip[event.player.code].paid !== true )
			{
				// When big blind walks, doesn't count as wouldn't voluntarily put money in
				vpip[event.player.code] = { paid: false, counts: false };
			}
		}
		else if ( event.event === EVENT_BET && inHand === true )
		{
			vpip[event.player.code] = { paid: true, counts: true };
		}
		else if ( event.event === EVENT_HAND_END )
		{
			inHand = false;
		}
	}

	return vpip;
}

const calculateVPIP = ( game ) => {

	let playerCounts = {};

	game.players.forEach ( player => playerCounts[player.code] = { totalHandsMinusNumberOfWalks: 0, totalHandsVoluntarilyPaidInto: 0 } );

	for ( var i = 0; i < game.events.length; i ++ )
	{
		let event = game.events[i].outcome;

		if ( event.event === EVENT_HAND_START )
		{
			let vpip = calculateVPIPForHand ( game, event.number );

			if ( vpip != null )
			{
				game.players.forEach ( player => {
						if ( vpip[player.code] && vpip[player.code].counts === true )
						{
							playerCounts[player.code].totalHandsMinusNumberOfWalks++;
							playerCounts[player.code].totalHandsVoluntarilyPaidInto += vpip[player.code].paid === true ? 1 : 0;
						}
					} );
			}
		}
	}

	game.vpip = playerCounts;

	game.players.forEach ( player => player.vpip = playerCounts[player.code].totalHandsVoluntarilyPaidInto / playerCounts[player.code].totalHandsMinusNumberOfWalks );
}

const calculatePFRForHand = ( game, number ) => {

	var inHand = false;
	var pfr = {};

	game.players.forEach ( player => pfr[player.code] = { raisedPreFlop: false, dealtHand: false } );

	for ( var i = 0; i < game.events.length; i ++ )
	{
		var event = game.events[i].outcome;

		if ( event.event === EVENT_HAND_START && event.number === number )
		{
			inHand = true;
		}
		else if ( event.event === EVENT_FLOP )
		{
			inHand = false;
		}
		else if ( event.event === EVENT_POST_SMALL_BLIND && inHand === true )
		{
			pfr[event.player.code].dealtHand = true;
		}
		else if ( event.event === EVENT_POST_BIG_BLIND && inHand === true )
		{
			pfr[event.player.code].dealtHand = true;
		}
		else if ( event.event === EVENT_CALL && inHand === true)
		{
			pfr[event.player.code].dealtHand = true;
		}
		else if ( event.event === EVENT_RAISE && inHand === true )
		{
			pfr[event.player.code].dealtHand = true;
			pfr[event.player.code].raisedPreFlop = true;
		}
		else if ( event.event === EVENT_FOLD && inHand === true )
		{
			pfr[event.player.code].dealtHand = true;
		}
		else if ( event.event === EVENT_HAND_END )
		{
			inHand = false;
		}
	}

	return pfr;
}

const calculatePFR = ( game ) => {

	let playerCounts = {};

	game.players.forEach ( player => playerCounts[player.code] = { totalHandsDealt: 0, totalHandsRaisedPreFlop: 0 } );

	for ( var i = 0; i < game.events.length; i ++ )
	{
		let event = game.events[i].outcome;

		if ( event.event === EVENT_HAND_START )
		{
			let pfr = calculatePFRForHand ( game, event.number );

			if ( pfr != null )
			{
				game.players.forEach ( player => {
						if ( pfr[player.code].dealtHand === true )
						{
							playerCounts[player.code].totalHandsDealt++;
							playerCounts[player.code].totalHandsRaisedPreFlop += pfr[player.code].raisedPreFlop === true ? 1 : 0;
						}
					} );
			}
		}
	}

	game.pfr = playerCounts;

	game.players.forEach ( player => player.pfr = playerCounts[player.code].totalHandsRaisedPreFlop / playerCounts[player.code].totalHandsDealt );
}

/**
 * Assign a numerical value to a hand
 * https://stackoverflow.com/questions/42380183/algorithm-to-give-a-value-to-a-5-card-poker-hand
 */
const calculateHandValue = ( hand ) => {

	let value = 0;

	if ( hand.type === "ROYAL_FLUSH" )
	{
		value = 9;
	}
	else if ( hand.type === "STRAIGHT_FLUSH" )
	{
		value = 8;
	}
	else if ( hand.type === "FOUR_OF_A_KIND" )
	{
		value = 7;
	}
	else if ( hand.type === "FULL_HOUSE" )
	{
		value = 6;
	}
	else if ( hand.type === "FLUSH" )
	{
		value = 5;
	}
	else if ( hand.type === "STRAIGHT" )
	{
		value = 4;
	}
	else if ( hand.type === "THREE_OF_A_KIND" )
	{
		value = 3;
	}
	else if ( hand.type === "TWO_PAIR" )
	{
		value = 2;
	}
	else if ( hand.type === "ONE_PAIR" )
	{
		value = 1;
	}
	else if ( hand.type === "HIGH_CARD" )
	{
		value = 0;
	}

	for ( var i = 0; i < 5; i ++ )
	{
		value = ( value << 4 ) + calculateOrdinalValue ( hand.cards[i].ordinal );
	}

	return value;
}

const calculateOrdinalValue = ( ordinal ) => {

	if ( ordinal === "A" )
	{
		return 12;
	}
	else if ( ordinal === "K" )
	{
		return 11;
	}
	else if ( ordinal === "Q" )
	{
		return 10;
	}
	else if ( ordinal === "J" )
	{
		return 9;
	}
	else if ( ordinal === "10" )
	{
		return 8;
	}
	else if ( ordinal === "9" )
	{
		return 7;
	}
	else if ( ordinal === "8" )
	{
		return 6;
	}
	else if ( ordinal === "7" )
	{
		return 5;
	}
	else if ( ordinal === "6" )
	{
		return 4;
	}
	else if ( ordinal === "5" )
	{
		return 3;
	}
	else if ( ordinal === "4" )
	{
		return 2;
	}
	else if ( ordinal === "3" )
	{
		return 1;
	}
	else if ( ordinal === "2" )
	{
		return 0;
	}

}

const pushPreviousStacksIfRequired = ( currentGame, lastStackDateTime, stackValues, currentDateTime ) =>
{
	if ( currentDateTime > lastStackDateTime )
	{
		currentGame.stacks.push ( { ...stackValues, dateTime: currentDateTime } );
	}
}

/**
 * Interprets the rows from a CSV log from pokernow into game objects with events
 */
export const parseFile = ( data ) => {

	// Remove header row
	data.shift ();

	// Remove blank last row
	if ( data[data.length-1].data[0].length === 0)
	{
		data.pop ();
	}

	// Sort by sequence assending
	data.sort ( ( rowA, rowB ) => Number(rowA.data[2]) - Number(rowB.data[2]) );

	// Parse each row
	let parsed = data.map(entry => parseCommand(entry.data));

	let preGameEvents = [];
	let postGameEvents = [];
	let games = [];
	let currentGame = null;
	//let quits = [];
	//let lastChipTotal = 0;
	//let lastStacks = null;
	let away = {};

	// stack attributes
	let stackDateTime = null;
	let stackValues = {};
	let overTheLineValues = {};

	for ( var i = 0; i < parsed.length; i ++ )
	{
		if ( !parsed[i].outcome )
		{
			console.log ( parsed[i] );
			alert ( "Error" );
		}
		else if ( parsed[i].outcome.event === EVENT_HAND_START )
		{
			if ( newGame ( parsed, i ) )
			{
				// if ( currentGame !== null )
				// {
				// 	finalStacks ( currentGame, lastStacks, quits, lastChipTotal );
				// }
				stackDateTime = parsed[i].dateTime;
				currentGame = { number: games.length + 1, events: [], stacks: [], players: [], exits: new Map (), start: parsed[i].dateTime };
				games.push ( currentGame );
				//quits = [];
			}

			// Remove away players from stack values
			for ( var k in away )
			{
				delete stackValues[k];
			}
		}
		else if ( currentGame !== null && (
							parsed[i].outcome.event === EVENT_JOIN ||
						 	parsed[i].outcome.event === EVENT_SIT ) )
		{
			addPlayerToGame ( currentGame, parsed[i].outcome.player );

			pushPreviousStacksIfRequired ( currentGame, stackDateTime, stackValues, parsed[i].dateTime );
			stackDateTime = parsed[i].dateTime;
			stackValues[parsed[i].outcome.player.code] = parsed[i].outcome.stack;

			delete away[parsed[i].outcome.player.code];
		}
		else if ( currentGame !== null && (
							parsed[i].outcome.event === EVENT_POST_SMALL_BLIND ||
							parsed[i].outcome.event === EVENT_POST_BIG_BLIND ||
							parsed[i].outcome.event === EVENT_CALL ||
							parsed[i].outcome.event === EVENT_BET ||
							parsed[i].outcome.event === EVENT_RAISE ) )
		{
			overTheLineValues[parsed[i].outcome.player.code] = -parsed[i].outcome.value;
		}
		else if ( currentGame !== null && (
							parsed[i].outcome.event === EVENT_FLOP ||
							parsed[i].outcome.event === EVENT_TURN ||
							parsed[i].outcome.event === EVENT_RIVER ||
							parsed[i].outcome.event === EVENT_HAND_END ) )
		{
			for ( var l in overTheLineValues )
			{
				stackValues[l] += overTheLineValues[l];
				overTheLineValues[l] = 0;
			}

			if ( parsed[i].outcome.event === EVENT_HAND_END )
			{
				pushPreviousStacksIfRequired ( currentGame, stackDateTime, stackValues, parsed[i].dateTime );
				stackDateTime = parsed[i].dateTime;
			}
		}
		else if ( currentGame !== null && (
							parsed[i].outcome.event === EVENT_UNCALLED_BET_RETURNED ||
							parsed[i].outcome.event === EVENT_WIN ) )
		{
			stackValues[parsed[i].outcome.player.code] += parsed[i].outcome.value;

			if ( parsed[i].outcome.hand )
			{
				parsed[i].outcome.hand.value = calculateHandValue ( parsed[i].outcome.hand );
			}
		}
		else if ( currentGame !== null && parsed[i].outcome.event === EVENT_STACKS )
		{
			if ( currentGame.stacks.length === 0 )
			{
				pushPreviousStacksIfRequired ( currentGame, null, stackValues, parsed[i].dateTime );
				stackDateTime = parsed[i].dateTime;
			}
		}
		else if ( currentGame !== null && (
							parsed[i].outcome.event === EVENT_STAND ||
							parsed[i].outcome.event === EVENT_QUIT ) )
		{
			pushPreviousStacksIfRequired ( currentGame, stackDateTime, stackValues, parsed[i].dateTime );
			stackDateTime = parsed[i].dateTime;
			stackValues[parsed[i].outcome.player.code] += parsed[i].outcome.stack;

			away[parsed[i].outcome.player.code] = parsed[i].outcome.stack;

			if ( parsed[i].outcome.event === EVENT_QUIT )
			{
				currentGame.exits.set ( parsed[i].outcome.player.code, parsed[i].dateTime );
			}
		}
		else if ( currentGame !== null && parsed[i].outcome.event === EVENT_ADMIN_UPDATED_STACK )
		{
			pushPreviousStacksIfRequired ( currentGame, stackDateTime, stackValues, parsed[i].dateTime );
			stackDateTime = parsed[i].dateTime;
			stackValues[parsed[i].outcome.player.code] += parsed[i].outcome.to;
		}
		// else if ( currentGame !== null && parsed[i].outcome.event === EVENT_STACKS )
		// {
		// 	let values = {};
		// 	parsed[i].outcome.stacks.forEach ( stack => values[stack.player.code] = stack.stack );
		//
		// 	lastChipTotal = parsed[i].outcome.stacks.reduce ( ( total, stack ) => total + stack.stack, 0 );
		//
		// 	let quitValues = {};
		// 	quits.forEach ( quit => { values[quit.player.code] = 0 } );
		//
		// 	lastStacks = parsed[i].outcome.stacks;
		// 	currentGame.stacks.push ( { dateTime: parsed[i].dateTime, ...values, ...quitValues, ...away } );
		//
		// 	quits = [];
		// }

		if ( currentGame === null && games.length === 0 )
		{
			preGameEvents.push ( parsed[i] );
		}
		else if ( currentGame !== null )
		{
			currentGame.events.push ( parsed[i] );
		}
		else
		{
			postGameEvents.push ( parsed[i] );
		}
	}

	// if ( currentGame !== null && lastStacks !== null )
	// {
	// 	finalStacks ( currentGame, lastStacks, quits, lastChipTotal );
	// }

	games.forEach ( game => { game.end = game.events[game.events.length - 1].dateTime } );
	games.forEach ( game => determinePlace ( game ) );
	games.forEach ( game => determineKnockOuts ( game ) );
	games.forEach ( game => determinePoints ( game ) );
	games.forEach ( game => calculateVPIP ( game ) );
	games.forEach ( game => calculatePFR ( game ) );

	return {
			start: games.length > 0 ? ( games[0].events.length > 0 ? games[0].events[0].dateTime : null ) : null,
			end: games.length > 0 ? ( games[games.length-1].events.length > 0 ? games[games.length-1].events[games[games.length-1].events.length - 1].dateTime : null ) : null,
			preGameEvents: preGameEvents,
			games: games,
			postGameEvents: postGameEvents,
			highHands: determineHighHand ( games )
		};
};

export default { parseFile };

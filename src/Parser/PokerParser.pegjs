Message = Join / Request / Quit / Approved / ChangeId / RemovePlayer / CancelRequest / Reject /
		  Stand / Sit /
		  BigBlindChange / SmallBlindChange / DeadSmallBlind /
          Important / Stacks /
          Flop / Turn / River /
          StartingHand / EndingHand /
		  YourHand /
		  PostSmallBlind / PostSmallBlindAllIn / PostBigBlind / PostBigBlindAllIn /
		  Fold / Call / Check / Bet / Raise / BetAllIn / RaiseAllIn / CallAllIn /
		  Show / Uncalled / Collect / CollectWin /
		  AdminStackQueueAdd / AdminStackQueueRemove / AdminStackUpdate / AdminStackReset

AdminStackQueueAdd = "WARNING: the admin queued the stack change for the player " player:Player " adding " value:Value " chips in the next hand."
	{ return { event: "ADMIN_UPDATED_STACK_ADD_QUEUED", player: player, value: value }; }

AdminStackQueueRemove = "WARNING: the admin queued the stack change for the player " player:Player " removing " value:Value " chips in the next hand."
	{ return { event: "ADMIN_UPDATED_STACK_REMOVE_QUEUED", player: player, value: -value }; }

AdminStackUpdate = "The admin updated the player " player:Player " stack from " from:Value " to " to:Value "."
	{ return { event: "ADMIN_UPDATED_STACK", player: player, from: from, to: to }; }

AdminStackReset = "WARNING: the admin queued the stack change for the player " player:Player " reseting to " value:Value " chips in the next hand."
	{ return { event: "ADMIN_UPDATED_STACK_RESET_QUEUED", player: player, stack: value }; }

BigBlindChange = "The game's big blind was changed from " from:Value " to " to:Value "."
	{ return { event: "BIG_BLIND_CHANGE", from: from, to: to }; }

SmallBlindChange = "The game's small blind was changed from " from:Value " to " to:Value "."
	{ return { event: "SMALL_BLIND_CHANGE", from: from, to: to }; }

DeadSmallBlind = "Dead Small Blind"
	{ return { event: "DEAD_SMALL_BLIND" }; }

Important = "IMPORTANT: " message:$(.)*
	{ return { event: "IMPORTANT_MESSAGE", message: message }; }

Join = "The player " player:Player " joined the game with a stack of " value:Value "."
	{ return { event: "JOIN", player: player, stack: value }; }

Request = "The player " player:Player " requested a seat."
	{ return { event: "REQUEST", player: player }; }

Reject = "The admin " admin:Player " rejected the seat request from the player " player:Player "."
	{ return { event: "REJECT_SEAT_REQUEST", player: player, admin: admin}; }

CancelRequest = "The player " player:Player " canceled the seat request."
	{ return { event: "CANCEL_REQUEST", player: player }; }

RemovePlayer = "The admin " admin:Player " enqueued the removal of the player " player:Player "."
	{ return { event: "REMOVAL", player: player, admin: admin }; }

Stand = "The player " player:Player " stand up with the stack of " value:Value "."
	{ return { event: "STAND", player: player, stack: value }; }

Sit = "The player " player:Player " sit back with the stack of " value:Value "."
	{ return { event: "SIT", player: player, stack: value }; }

Quit = "The player " player:Player " quits the game with a stack of " value:Value "."
	{ return { event: "QUIT", player: player, stack: value }; }

Approved = "The admin approved the player " player:Player " participation with a stack of " value:Value "."
	{ return { event: "APPROVED", player: player, stack: value }; }

ChangeId = "The player " player:Player " changed the ID from " guest:ID " to " auth:ID " because authenticated login."
	{ return { event: "CHANGE_ID", player: player, guest: guest, auth: auth }; }

Player = QUOTE name:Name NAME_DELIMITER code:Code QUOTE
	{ return { name: name, code: code }; }

Stacks = "Player stacks:" stacks:Stack+
	{ return { event: "STACKS", stacks: stacks }; }

Stack = " #" seat:Value " " player: Player " (" stack:Value ")" (" |")?
	{ return { player: player, seat: seat, stack: stack }; }

Flop = "Flop:" (" ")* "[" card1:Card ", " card2:Card ", " card3:Card "]"
	{ return { event: "FLOP", cards: [ card1, card2, card3 ] }; }

Turn = "Turn:" (" ")* card1:Card ", " card2:Card ", " card3:Card " [" card4:Card "]"
	{ return { event: "TURN", cards: [ card1, card2, card3, card4 ] }; }

River = "River:" (" ")* card1:Card ", " card2:Card ", " card3:Card ", " card4:Card " [" card5:Card "]"
	{ return { event: "RIVER", cards: [ card1, card2, card3, card4, card5 ] }; }

Card = ordinal:Ordinal suit:Suit
	{ return { ordinal: ordinal, suit: suit }; }

StartingHand = StartingHandDealer / StartingHandDeadButton

StartingHandDealer = "-- starting hand #" number:Value (" ")+ "(No Limit Texas Hold'em) (dealer: " dealer:Player ") --"
	{ return { event: "HAND_START", dealer: dealer, number: number }; }

StartingHandDeadButton = "-- starting hand #" number:Value (" ")+ "(No Limit Texas Hold'em) (dead button) --"
	{ return { event: "HAND_START", dealer: null, number: number }; }

EndingHand = "-- ending hand #" number:Value " --"
	{ return { event: "HAND_END", number: number }; }

YourHand = "Your hand is " card1:Card ", " card2:Card
	{ return { event: "YOUR_HAND", card1: card1, card2: card2 }; }

PostSmallBlind = player:Player " posts a small blind of " value:Value [ ]* !"and go all in" [ ]*
	{ return { event: "POST_SMALL_BLIND", player: player, value: value, allIn: false }; }

PostSmallBlindAllIn = player:Player " posts a small blind of " value:Value [ ]* "and go all in" [ ]*
	{ return { event: "POST_SMALL_BLIND", player: player, value: value, allIn: true }; }

PostBigBlind = player:Player " posts a big blind of " value:Value [ ]* !"and go all in" [ ]*
	{ return { event: "POST_BIG_BLIND", player: player, value: value, allIn: false }; }

PostBigBlindAllIn = player:Player " posts a big blind of " value:Value [ ]* "and go all in" [ ]*
	{ return { event: "POST_BIG_BLIND", player: player, value: value, allIn: true }; }

Fold = player:Player " folds"
	{ return { event: "FOLD", player: player }; }

Call = player:Player " calls " value:Value !" and go all in"
	{ return { event: "CALL", player: player, value: value, allIn: false }; }

CallAllIn = player:Player " calls " value:Value " and go all in"
	{ return { event: "CALL", player: player, value: value, allIn: true }; }

Check = player:Player " checks"
	{ return { event: "CHECK", player: player }; }

Bet = player:Player " bets " value:Value !" and go all in"
	{ return { event: "BET", player: player, value: value, allIn: false }; }

BetAllIn = player:Player " bets " value:Value " and go all in"
	{ return { event: "BET", player: player, value: value, allIn: true }; }

Raise = player:Player " raises to " value:Value !" and go all in"
	{ return { event: "RAISE", player: player, value: value, allIn: false }; }

RaiseAllIn = player:Player " raises to " value:Value " and go all in"
	{ return { event: "RAISE", player: player, value: value, allIn: true }; }

Show = player:Player " shows a " card1:Card ", " card2:Card "."
	{ return { event: "SHOW", player: player, card1: card1, card2: card2 }; }

Uncalled = "Uncalled bet of " value:Value " returned to " player:Player
	{ return { event: "UNCALLED_BET_RETURNED", player: player, value: value }; }

Collect = player:Player " collected " value:Value " from pot" !(" with")
	{ return { event: "WIN", player: player, value: value, hand: null }; }

CollectWin = player:Player " collected " value:Value " from pot with " handCombination: HandCombination
	{ return { event: "WIN", player: player, value: value, hand: handCombination }; }

HandCombination = handType:HandType " (combination: " card1:Card ", " card2:Card ", " card3:Card ", " card4:Card ", " card5:Card  ( ", " Card )* ")"
	{ return { ...handType, cards: [ card1, card2, card3, card4, card5 ] }; }

HandType = RoyalFlush / StraightFlush / FourOfAKind / FullHouse / Flush / Straight / ThreeOfAKind / TwoPair / OnePair / HighCard

RoyalFlush = "Royal Flush, " highCard:Ordinal suit:SuitCharacter " High"
	{ return { type: "ROYAL_FLUSH", suit: suit, highCard: highCard }; }

StraightFlush = "Straight Flush, " highCard:Ordinal suit:SuitCharacter " High"
	{ return { type: "STRAIGHT_FLUSH", suit: suit, highCard: highCard }; }

FourOfAKind = "Four of a Kind, " ordinal:Ordinals
	{ return { type: "FOUR_OF_A_KIND", four: ordinal }; }

Flush = "Flush, " ordinal:Ordinal suit:SuitCharacter " High"
	{ return { type: "FLUSH", suit: suit, highCard: ordinal }; }

Straight = "Straight, " ordinal:Ordinal " High"
	{ return { type: "STRAIGHT", highCard: ordinal }; }

FullHouse = "Full House, " three:Ordinals " over " two:Ordinals
	{ return { type: "FULL_HOUSE", three: three, two: two }; }

ThreeOfAKind = "Three of a Kind, " ordinal:Ordinals
	{ return { type: "THREE_OF_A_KIND", ordinal: ordinal }; }

TwoPair = "Two Pair, " ordinal1:Ordinals " & " ordinal2:Ordinals
	{ return { type: "TWO_PAIR", ordinal1: ordinal1, ordinal2: ordinal2 }; }

OnePair = "Pair, " ordinal:Ordinals
	{ return { type: "ONE_PAIR", ordinal: ordinal }; }

HighCard = ordinal:Ordinal " High"
	{ return { type: "HIGH_CARD", highCard: ordinal }; }

Ordinals = ordinal:Ordinal "'s"
	{ return ordinal; }

Ordinal = "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" / "10" / "J" / "Q" / "K" / "A"

Suit = "♣" / "♥" / "♠" / "♦"

SuitCharacter = suit:( DiamondCharacter / HeartCharacter / SpadeCharacter / ClubCharacter )
	{ return suit; }

ClubCharacter = "c"
	{ return "♣"; }

HeartCharacter = "h"
	{ return "♥"; }

SpadeCharacter = "s"
	{ return "♠"; }

DiamondCharacter = "d"
	{ return "♦"; }

Value = val:ValueMatch
	{ return Number(val); }

ValueMatch = $([0-9])+

Name = $(!NAME_DELIMITER .)+
Code = $(!QUOTE .)+
ID = $(![ ]+ .)+

NAME_DELIMITER = " @ "
QUOTE = "\""

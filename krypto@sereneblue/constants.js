// setting keys
var PREF_FIAT = "krypto-prefs-fiat-index";
var PREF_UPDATE_SEC = "krypto-prefs-update";
var PREF_DISTRACTION_MIN = "krypto-prefs-distraction";
var PREF_NUM_DISPLAY = "krypto-prefs-num";
var PREF_DELIMITER = "krypto-prefs-delim";

var DELIMS = ["|", "·", "•", "◈", "~"];

var CRYPTOCURRENCIES = [
	{ name: "Augur", 					setting: "krypto-prefs-rep", 	symbol: "REP"},
	{ name: "Basic Attention Token", 	setting: "krypto-prefs-bat", 	symbol: "BAT"},
	{ name: "Binance Coin", 			setting: "krypto-prefs-bnb", 	symbol: "BNB"},
	{ name: "Bitcoin", 					setting: "krypto-prefs-btc", 	symbol: "BTC"},
	{ name: "Bitcoin Cash", 			setting: "krypto-prefs-bch", 	symbol: "BCH"},
	{ name: "Cardano", 					setting: "krypto-prefs-ada", 	symbol: "ADA"},
	{ name: "Chainlink", 				setting: "krypto-prefs-link", 	symbol: "LINK"},
	{ name: "Dash", 					setting: "krypto-prefs-dash", 	symbol: "DASH"},
	{ name: "Decred", 					setting: "krypto-prefs-dcr", 	symbol: "DCR"},
	{ name: "Dogecoin", 				setting: "krypto-prefs-doge", 	symbol: "DOGE"},
	{ name: "EOS", 						setting: "krypto-prefs-eos", 	symbol: "EOS"},
	{ name: "Ethereum", 				setting: "krypto-prefs-eth", 	symbol: "ETH"},
	{ name: "Ethereum Classic", 		setting: "krypto-prefs-etc", 	symbol: "ETC"},
	{ name: "IOTA", 					setting: "krypto-prefs-iota", 	symbol: "MIOTA"},
	{ name: "Lisk", 					setting: "krypto-prefs-lsk", 	symbol: "LSK"},
	{ name: "Litecoin", 				setting: "krypto-prefs-ltc", 	symbol: "LTC"},
	{ name: "Maker", 					setting: "krypto-prefs-mkr", 	symbol: "MKR"},
	{ name: "Monero", 					setting: "krypto-prefs-xmr", 	symbol: "XMR"},
	{ name: "Nano", 					setting: "krypto-prefs-nano", 	symbol: "NANO"},
	{ name: "NEM", 						setting: "krypto-prefs-xem", 	symbol: "XEM"},
	{ name: "NEO", 						setting: "krypto-prefs-neo", 	symbol: "NEO"},
	{ name: "Nxt", 						setting: "krypto-prefs-nxt", 	symbol: "NXT"},
	{ name: "Ripple", 					setting: "krypto-prefs-xrp", 	symbol: "XRP"},
	{ name: "Stratis", 					setting: "krypto-prefs-strat", 	symbol: "STRAT"},
	{ name: "Tezos", 					setting: "krypto-prefs-xtz", 	symbol: "XTZ"},
	{ name: "Vechain", 					setting: "krypto-prefs-vet", 	symbol: "VET"},
	{ name: "Zcash", 					setting: "krypto-prefs-zec", 	symbol: "ZEC"}
];

var FIAT = [
	{ abbr: "AUD", symbol: "A$" },
	{ abbr: "BRL", symbol: "R$" },
	{ abbr: "CAD", symbol: "C$" },
	{ abbr: "CHF", symbol: "Fr." },
	{ abbr: "CNY", symbol: "¥" },
	{ abbr: "EUR", symbol: "€" },
	{ abbr: "GBP", symbol: "£" },
	{ abbr: "HKD", symbol: "HK$" },
	{ abbr: "INR", symbol: "₹" },
	{ abbr: "JPY", symbol: "¥" },
	{ abbr: "MXN", symbol: "Mex$" },
	{ abbr: "NZD", symbol: "NZ$" },
	{ abbr: "RUB", symbol: "₽" },
	{ abbr: "SGD", symbol: "S$" },
	{ abbr: "USD", symbol: "$" }
];
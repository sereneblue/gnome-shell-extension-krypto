// setting keys
var PREF_FIAT = "krypto-prefs-fiat-index";
var PREF_UPDATE_SEC = "krypto-prefs-update";
var PREF_DISTRACTION_MIN = "krypto-prefs-distraction";
var PREF_NUM_DISPLAY = "krypto-prefs-num";
var PREF_DELIMITER = "krypto-prefs-delim";
var PREF_POSITION = "krypto-prefs-pos";

var DELIMS = ["|", "·", "•", "◈", "~"];

var CRYPTOCURRENCIES = [
	{ name: "0x", 						setting: "krypto-prefs-zrx", 	symbol: "ZRX"},
	{ name: "Aave", 					setting: "krypto-prefs-aave", 	symbol: "AAVE"},
	{ name: "Akash Network",			setting: "krypto-prefs-akt",	symbol: "AKT" },
	{ name: "Augur", 					setting: "krypto-prefs-rep", 	symbol: "REP"},
	{ name: "Arpa",                     setting: "krypto-prefs-arpa",   symbol: "ARPA"},
	{ name: "Avalanche",				setting: "krypto-prefs-avax",	symbol: "AVAX"},
	{ name: "Axie Infinity Shards",		setting: "krypto-prefs-axs",	symbol: "AXS"},
	{ name: "Basic Attention Token", 	setting: "krypto-prefs-bat", 	symbol: "BAT"},
	{ name: "Binance Coin", 			setting: "krypto-prefs-bnb", 	symbol: "BNB"},
	{ name: "Bitcoin", 					setting: "krypto-prefs-btc", 	symbol: "BTC"},
	{ name: "Bitcoin Cash", 			setting: "krypto-prefs-bch", 	symbol: "BCH"},
	{ name: "BitTorrent", 				setting: "krypto-prefs-btt", 	symbol: "BTT"},
	{ name: "Cardano", 					setting: "krypto-prefs-ada", 	symbol: "ADA"},
	{ name: "Chainlink", 				setting: "krypto-prefs-link", 	symbol: "LINK"},
	{ name: "Cosmos",			 		setting: "krypto-prefs-atom", 	symbol: "ATOM"},
	{ name: "Crypto.com Coin", 			setting: "krypto-prefs-cro", 	symbol: "CRO"},
	{ name: "Dash", 					setting: "krypto-prefs-dash", 	symbol: "DASH"},
	{ name: "Decred", 					setting: "krypto-prefs-dcr", 	symbol: "DCR"},
	{ name: "DeFi Kingdoms",			setting: "krypto-prefs-jewel",	symbol: "JEWEL" },
	{ name: "Dogecoin", 				setting: "krypto-prefs-doge", 	symbol: "DOGE"},
	{ name: "dYdX",						setting: "krypto-prefs-dydx",	symbol: "DYDX"},
	{ name: "EOS", 						setting: "krypto-prefs-eos", 	symbol: "EOS"},
	{ name: "Ethereum", 				setting: "krypto-prefs-eth", 	symbol: "ETH"},
	{ name: "Ethereum Classic", 		setting: "krypto-prefs-etc", 	symbol: "ETC"},
	{ name: "Fantom",					setting: "krypto-prefs-ftm",	symbol: "FTM" },
	{ name: "Filecoin",			 		setting: "krypto-prefs-fil", 	symbol: "FIL"},
	{ name: "FTX Token",			 	setting: "krypto-prefs-ftx", 	symbol: "FTX"},
	{ name: "Harmony",					setting: "krypto-prefs-one",	symbol: "ONE"},
	{ name: "IOTA", 					setting: "krypto-prefs-iota", 	symbol: "MIOTA"},
	{ name: "Kitty Inu",				setting: "krypto-prefs-kitty",	symbol: "KITTY"},
	{ name: "Klaytn",			 		setting: "krypto-prefs-klay", 	symbol: "KLAY"},
	{ name: "Lisk", 					setting: "krypto-prefs-lsk", 	symbol: "LSK"},
	{ name: "Litecoin", 				setting: "krypto-prefs-ltc", 	symbol: "LTC"},
	{ name: "Loopring",					setting: "krypto-prefs-lrc",	symbol: "LRC"},
	{ name: "Maker", 					setting: "krypto-prefs-mkr", 	symbol: "MKR"},
	{ name: "Monero", 					setting: "krypto-prefs-xmr", 	symbol: "XMR"},
	{ name: "Nano", 					setting: "krypto-prefs-nano", 	symbol: "NANO"},
	{ name: "Near",						setting: "krypto-prefs-near",	symbol: "NEAR" },
	{ name: "NEM", 						setting: "krypto-prefs-xem", 	symbol: "XEM"},
	{ name: "NEO", 						setting: "krypto-prefs-neo", 	symbol: "NEO"},
	{ name: "Nxt", 						setting: "krypto-prefs-nxt", 	symbol: "NXT"},
        { name: "Ontology",					setting: "krypto-prefs-ont",	symbol: "ONT" },
        { name: "Ontology Gas",					setting: "krypto-prefs-ong",	symbol: "ONGAS" },
	{ name: "Osmosis",					setting: "krypto-prefs-osmo",	symbol: "OSMO" },
	{ name: "PancakeSwap", 				setting: "krypto-prefs-cake", 	symbol: "CAKE"},
	{ name: "Persistence",				setting: "krypto-prefs-xprt",	symbol: "XPRT" },
	{ name: "Polygon",					setting: "krypto-prefs-matic",	symbol: "MATIC" },
	{ name: "Polkadot", 				setting: "krypto-prefs-dot", 	symbol: "DOT"},
	{ name: "Ripple", 					setting: "krypto-prefs-xrp", 	symbol: "XRP"},
	{ name: "Rose", 		            setting: "krypto-prefs-rose",   symbol: "ROSE"},
	{ name: "Saito",					setting: "krypto-prefs-saito",	symbol: "SAITO"},
	{ name: "Secret",					setting: "krypto-prefs-scrt",	symbol: "SCRT" },
	{ name: "Sentinel",					setting: "krypto-prefs-dvpn",	symbol: "DVPN" },
	{ name: "Shiba Inu",				setting: "krypto-prefs-shib",	symbol: "SHIB"},
	{ name: "Sifchain", 				setting: "krypto-prefs-erowan", 	symbol: "EROWAN"},
	{ name: "Solana", 					setting: "krypto-prefs-sol", 	symbol: "SOL"},
	{ name: "Stellar", 					setting: "krypto-prefs-xlm", 	symbol: "XLM"},
	{ name: "Stratis", 					setting: "krypto-prefs-strat", 	symbol: "STRAT"},
	{ name: "SushiSwap", 				setting: "krypto-prefs-sushi", 	symbol: "SUSHI"},
	{ name: "Terra", 					setting: "krypto-prefs-luna", 	symbol: "LUNA"},
	{ name: "Tether", 					setting: "krypto-prefs-usdt", 	symbol: "USDT"},
	{ name: "Tezos", 					setting: "krypto-prefs-xtz", 	symbol: "XTZ"},
	{ name: "THETA", 					setting: "krypto-prefs-theta", 	symbol: "THETA"},
	{ name: "Trader Joe",				setting: "krypto-prefs-joe",	symbol: "JOE"},
	{ name: "TRON", 					setting: "krypto-prefs-trx", 	symbol: "TRX"},
	{ name: "Uniswap", 					setting: "krypto-prefs-uni", 	symbol: "UNI"},
	{ name: "VeChain", 					setting: "krypto-prefs-vet", 	symbol: "VET"},
	{ name: "VeChainThor",				setting: "krypto-prefs-vtho",	symbol: "VTHO"},
        { name: "Wing Finance",					setting: "krypto-prefs-wing",	symbol: "WING" },
	{ name: "WOO",						setting: "krypto-prefs-woo",	symbol: "WOO"},
	{ name: "yearn.finance", 			setting: "krypto-prefs-yfi", 	symbol: "YFI"},
	{ name: "Zcash", 					setting: "krypto-prefs-zec", 	symbol: "ZEC"},
	{ name: "Zilliqa", 					setting: "krypto-prefs-zil", 	symbol: "ZIL"}
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
	{ abbr: "KRW", symbol: "₩" },
	{ abbr: "MXN", symbol: "Mex$" },
	{ abbr: "NZD", symbol: "NZ$" },
	{ abbr: "RUB", symbol: "₽" },
	{ abbr: "SEK", symbol: "kr" },
	{ abbr: "SGD", symbol: "S$" },
	{ abbr: "TRY", symbol: "₺" },
	{ abbr: "USD", symbol: "$" },
	{ abbr: "ZAR", symbol: "R"}
];

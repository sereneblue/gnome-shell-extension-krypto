# krypto

![krypto version](https://img.shields.io/badge/version-20-brightgreen.svg)
![GPL v3 License](https://img.shields.io/badge/license-GPL%20v3-blue.svg)

<p align="center">
<img src="https://user-images.githubusercontent.com/14242625/114322214-e0d5cf00-9aec-11eb-9082-f2b3331e931d.png">
</p>

A cryptocurrency utility for gnome-shell.

# Installation

### From extensions.gnome.org

Visit [extensions.gnome.org](https://extensions.gnome.org/extension/1913/krypto/) and click on the switch to install krypto.

### Using the install script
```
$ wget -O install.sh https://raw.githubusercontent.com/sereneblue/gnome-shell-extension-krypto/master/install.sh
$ chmod +x install.sh
$ ./install.sh
```

### From source code
```
$ git clone https://github.com/sereneblue/gnome-shell-extension-krypto.git
$ cd gnome-shell-extension-krypto
$ mv krypto@sereneblue $HOME/.local/share/gnome-shell/extensions/krypto@sereneblue
```

If you're using Wayland, you'll need to logout to see the changes.

# Configuration

![krypto display preferences](https://user-images.githubusercontent.com/14242625/114322116-7f156500-9aec-11eb-889d-73034a38527f.png)

![krypto currency configuration](https://user-images.githubusercontent.com/14242625/114322300-5f327100-9aed-11eb-8795-2a40d11a5235.png)

krypto can be configured from the Extensions app.

#### Cryptocurrencies

There are 70 supported cryptocurrencies:

	0x
	Aave
	Akash Network
	Augur
	Arpa
	Avalanche
	Axie Infinity Shards
	Basic Attention Token
	Binance Coin
	Bitcoin
	Bitcoin Cash
	BitTorrent
	Cardano
	Chainlink
	Cosmos
	Crypto.com Coin
	Dash
	Decred
	DeFi Kingdoms
	Dogecoin
	dYdX
	EOS
	Ethereum
	Ethereum Classic
	Fantom
	Filecoin
	FTX Token
	Harmony
	IOTA
	Kitty Inu
	Klaytn
	Lisk
	Litecoin
	Loopring
	Maker
	Monero
	Nano
	Near
	NEM
	NEO
	Nxt
	Osmosis
	PancakeSwap
	Persistence
	Polygon
	Polkadot
	Ripple
	Rose
	Saito
	Secret
	Sentinel
	Shiba Inu
	Sifchain
	Solana
	Stellar
	Stratis
	SushiSwap
	Terra
	Tether
	Tezos
	THETA
	Trader Joe
	TRON
	Uniswap
	VeChain
	VeChainThor
	WOO
	yearn.finance
	Zcash
	Zilliqa

#### Fiat Currencies
There are currently 19 supported fiat currencies. If you'd like a specific currency added, please submit an issue or feel free to submit a merge request.

#### Distraction Free Mode
It's probably not healthy to have cryptocurrency prices in front of you 24/7. Distraction Free Mode will prevent krypto from displaying prices for a certain amount of time that you specify. Default value is 10 minutes. Prices will continue to be updated in the background and you still have access to the calculator. ;)

![krypto distraction free mode](https://user-images.githubusercontent.com/14242625/114322248-111d6d80-9aed-11eb-8297-7e9c0afdc343.png)

#### Configure number of currencies displayed in the Top Bar
Limit how many currencies are shown in the top bar. Currencies that aren't shown in the Top Bar are displayed in the popup menu.

#### Update Interval
Change how frequently you'd like the prices to refresh. Minimum value is 30 seconds.

#### Delimiter
Change the delimiter that separates the currencies in the top bar.

# Update

If you want to update the extension, install it by following the process above. Your settings will be preserved (excluding any deprecated options). You may need to restart your session for changes to appear.

# Credits

Samuel Masue for [gnome-shell-tw](https://github.com/smasue/gnome-shell-tw) which this extension is built on.

[Cryptocompare.com](https://www.cryptocompare.com/api/) for the API.

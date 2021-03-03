# krypto

![krypto version](https://img.shields.io/badge/version-3-brightgreen.svg)
![GPL v3 License](https://img.shields.io/badge/license-GPL%20v3-blue.svg)

<p align="center"> 
<img src="https://user-images.githubusercontent.com/14242625/60378536-d3238800-99f1-11e9-8a3f-0fdd0d46bd9a.png">
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

You'll have to manually enable it via Gnome Tweak Tool.

If you're using Wayland, you'll need to logout to see the changes.

# Configuration

![krypto configuration](https://user-images.githubusercontent.com/14242625/60378329-09abd380-99ef-11e9-806b-298774194e2c.png)

krypto can be configured from Gnome Tweak Tool.

#### Cryptocurrencies

There are 27 supported cryptocurrencies:

	Augur
	Basic Attention Token
	Binance Coin
	Bitcoin
	Bitcoin Cash
	Cardano
	Chainlink
	Dash
	Decred
	Dogecoin
	EOS
	Ethereum
	Ethereum Classic
	IOTA
	Lisk
	Litecoin
	Maker
	Monero
	Nano
	NEM
	NEO
	Nxt
	Ripple
	Stratis
	Tezos
	Vechain
	Zcash

#### Fiat Currencies
There are currently 14 supported fiat currencies. If you'd like a specific currency added, please submit an issue or feel free to submit a merge request.

#### Distraction Free Mode
It's probably not healthy to have cryptocurrency prices in front of you 24/7. Distraction Free Mode will prevent krypto from displaying prices for a certain amount of time that you specify. Default value is 10 minutes. Prices will continue to be updated in the background and you still have access to the calculator. ;)

![krypto distraction free mode](https://user-images.githubusercontent.com/14242625/60378529-bab36d80-99f1-11e9-99e1-1d6adfeaeeb3.png)

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

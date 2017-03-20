# krypto

![gnome-shell-extension-krypto](https://raw.githubusercontent.com/sereneblue/gnome-shell-extension-krypto/master/screenshot.png?raw=true)

Simple cryptocurrency ticker for gnome-shell inspired from my previous project [krypto](https://github.com/sereneblue/krypto). Updates every thirty seconds.

Tested on Ubuntu & gnome-shell 3.18.5.

# Installation

`git clone https://github.com/sereneblue/gnome-shell-extension-krypto.git`

`cd gnome-shell-extension-krypto`

Edit these variables in `extensions.js`. Add desired cryptocurrencies to the CRYPTO array.

	const CRYPTO = ['BTC'];
	const SYM = "$";
	const FIAT  = "USD";

`mv krypto@sereneblue ~/.local/share/gnome-shell/extensions/krypto@sereneblue`

Then press `Alt` + `F2`, type `r` and hit enter to restart gnome-shell. If that doesn't work, open the Tweak Tool -> Extensions and manually enable it.

# Credits

Samuel Masue for [gnome-shell-tw](https://github.com/smasue/gnome-shell-tw) which this extension is built on.

[Cryptocompare.com](https://www.cryptocompare.com/api/) for the API.
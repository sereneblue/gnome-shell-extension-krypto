# krypto

![gnome-shell-extension-krypto](https://raw.githubusercontent.com/sereneblue/gnome-shell-extension-krypto/master/screenshot.png?raw=true)

A cryptocurrency utility for gnome-shell.

Tested on Ubuntu 16.04 & gnome-shell 3.18.5.

# Installation

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

# Configuration

![krypto configuration](https://raw.githubusercontent.com/sereneblue/gnome-shell-extension-krypto/master/configuration.png?raw=true)

krypto can be configured with the Gnome Tweak Tool.

#### Cryptocurrencies
There are only 9 supported cryptocurrencies: BTC, DASH, DCR, DOGE, ETH, ETC, LTC, XMR, and XRP. More can be added in the future.

#### Fiat Currencies
There are currently 14 supported fiat currencies. If you'd like a specific currency added, please submit an issue or feel free to submit a merge request.

![krypto distraction free mode](https://raw.githubusercontent.com/sereneblue/gnome-shell-extension-krypto/master/distraction_free_mode.png?raw=true)

#### Distraction Free Mode Time
It's probably not healthy to have cryptocurrency prices in front of you 24/7. Distraction Free Mode will prevent krypto from displaying prices for a certain amount of time that you specify. Default value is 10 minutes. Prices will continue to be updated in the background and you still have access to the calculator. ;)

#### Number of currencies displayed in the Top Bar
Limit how many currencies are shown in the top bar. Currencies that aren't shown in the Top Bar are displayed in the popup menu.

#### Update Interval
Change how frequently you'd like the prices to refresh. Default value is 30 seconds.

#### Delimiter
Change the delimiter that separates the currencies in the top bar.

# Credits

Samuel Masue for [gnome-shell-tw](https://github.com/smasue/gnome-shell-tw) which this extension is built on.

[Cryptocompare.com](https://www.cryptocompare.com/api/) for the API.

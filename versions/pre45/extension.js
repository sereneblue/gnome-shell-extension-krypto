const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Soup = imports.gi.Soup;
const St = imports.gi.St;
const Mainloop = imports.mainloop;
const Clutter = imports.gi.Clutter;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const Config = imports.misc.config;
const [major] = Config.PACKAGE_VERSION.split('.');
const SHELL_VER = Number.parseInt(major);

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Settings = Me.imports.constants;

const krypto = GObject.registerClass({ GTypeName: 'krypto'},
    class krypto extends PanelMenu.Button {
        _init () {
            super._init(0.0, "krypto", false);
            this._base_url = "https://min-api.cryptocompare.com/data/pricemulti?fsyms="
            this._txt_label = "Loading...";
            this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.krypto');
            this._currency_data = {};
            this._httpSession = new Soup.Session();

            if (SHELL_VER >= 43) {
                this._decoder = new TextDecoder();
            }

            this.buttonText = new St.Label({
              text: this._txt_label,
              y_align: Clutter.ActorAlign.CENTER
            });
            this.add_child(this.buttonText);
            this._createMenu();
            this._refresh();

	    this._pos_changed = this._settings.connect('changed::'+Settings.PREF_POSITION, this._positionInPanelChanged.bind(this));

        }
        _calculatePrice() {
            // use regex to get user input
            let text = this._calculator_input.get_text();
            let res = text.match(/[0-9]*\.?[0-9]+\s*[a-zA-Z]{3,5}/i);

            if (res) {
                let num = res[0].match(/[0-9]*\.?[0-9]+/)[0];
                let currency = res[0].match(/[a-zA-Z]{3,5}/)[0].toUpperCase();
                if (Object.keys(this._currency_data).indexOf(currency) > -1) {
                    let price = num * this._currency_data[currency];
                    this._calculated_price.set_text(this._getSymbol() + price.toFixed(2).toString());
                    this._crypto_amount.set_text(`${num} ${currency} = `);
                    return;
                }
            }
            this._calculated_price.set_text("");
            this._crypto_amount.set_text("");
        }
        _createMenu() {
            this._distraction_mode_switch = new PopupMenu.PopupSwitchMenuItem('Distraction Free Mode:', false);
            this._prices_menu = new PopupMenu.PopupSubMenuMenuItem('More Prices');

            // add calculator related widgets to menu
            this._calculator_divider = new PopupMenu.PopupMenuItem('', {reactive: false});
            this._calculated_crypto = new PopupMenu.PopupMenuItem('', {reactive: false});
            this._calculator_fiat = new PopupMenu.PopupMenuItem('', {reactive: false});
            this._calculator_area = new PopupMenu.PopupMenuItem('', {reactive: false});

            // upper value (crypto)
            this._crypto_amount = new St.Label({
                text: '',
                styleClass: 'display-text',
            });
            // lower value (fiat)
            this._calculated_price = new St.Label({
                text: '',
                styleClass: 'display-text',
            });

            this._calculator_input = new St.Entry({
                can_focus: true,
                track_hover: true,
                hint_text: "Enter amount... (1 btc)",
                styleClass: 'calculator-input'
            });

	    this._prefs_button = new St.Button({
		style_class: 'button prefs-button'
            });
	    this._prefs_button.child = new St.Icon({
		icon_name: 'preferences-system-symbolic'
            });

            this._distraction_mode_switch.connect('activate', this._enableDistractionFreeMode.bind(this));
            this._calculator_input.clutter_text.connect('key-release-event', this._calculatePrice.bind(this));
            this._prefs_button.connect('clicked', () => {
		this.menu._getTopMenu().close();
		ExtensionUtils.openPrefs();
            });

            // add the st widgets to menu items
            // price calculator separator
            this._calculator_divider.actor.add_child(new St.Label({
                text: 'Price Calculator',
                styleClass: 'calculator-text',
            }));
            this._calculated_crypto.actor.add_child(this._crypto_amount);
            this._calculator_fiat.actor.add_child(this._calculated_price);
            this._calculator_area.actor.add_child(this._calculator_input);
	    this._calculator_area.actor.add_child(this._prefs_button);

            this.menu.addMenuItem(this._distraction_mode_switch);
            this.menu.addMenuItem(this._prices_menu);
            this.menu.addMenuItem(this._calculator_divider);
            this.menu.addMenuItem(this._calculated_crypto);
            this.menu.addMenuItem(this._calculator_fiat);
            this.menu.addMenuItem(this._calculator_area);

	    this.menu.connect('open-state-changed', (menu, open) => {
		this._prices_menu.setSubmenuShown(open);
	    });
        }
        _disableDistractionFreeMode() {
            this._distraction_mode_switch.actor.reactive = true;
            this._distraction_mode_switch.toggle();
            this._setLabelText();
        }
        _enableDistractionFreeMode() {
            this._distraction_timeout = Mainloop.timeout_add_seconds(this._getDistractionTime(), this._disableDistractionFreeMode.bind(this));
            // disable changing distraction free mode ;)
            this._distraction_mode_switch.actor.reactive = false;
            this._setLabelText();
        }
        _getDistractionTime() {
            return 60 * this._settings.get_int(Settings.PREF_DISTRACTION_MIN);
        }
        _getUpdateSec() {
            return this._settings.get_int(Settings.PREF_UPDATE_SEC) || 30;
        }
        _getDelim() {
            return Settings.DELIMS[this._settings.get_int(Settings.PREF_DELIMITER)];
        }
        _getFiatAAbbr() {
            return Settings.FIAT[this._settings.get_int(Settings.PREF_FIAT)].abbr;
        }
        _getSymbol() {
            return Settings.FIAT[this._settings.get_int(Settings.PREF_FIAT)].symbol;
        }
        _refresh() {
            this._loadData(this._refreshUI);
            this._removeTimeout();
            this._timeout = Mainloop.timeout_add_seconds(this._getUpdateSec(), this._refresh.bind(this));
            return true;
        }
        _loadData() {
            let params = {};
            let url = this._urlBuilder();

            if (url) {
                let message = Soup.Message.new('GET', url);

                if (SHELL_VER <= 42) {
                    this._httpSession.queue_message(message, (session, msg) => {
                        if (msg.status_code !== 200) return;
                        let json = JSON.parse(msg.response_body.data);
                        this._refreshUI(json);
                    });
                } else {
                    this._httpSession.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null, function (session, res) {
                        let data = session.send_and_read_finish(res);

                        if (data) {
                            data = this._decoder.decode(data.toArray())

                            this._refreshUI(JSON.parse(data));
                        }
                    }.bind(this));
                }
            } else {
                this._txt_label = "";
                this._setLabelText();
            }
        }

        _refreshUI(data) {
            let delim_count = 0;
            let txt_label = "";
            let keys = Object.keys(data);

            let topBarKeys = {};

            for (let i = 0; i < Settings.CRYPTOCURRENCIES.length; i++) {
                if (this._settings.get_boolean(Settings.CRYPTOCURRENCIES[i].setting + "-topbar")) {
                    topBarKeys[Settings.CRYPTOCURRENCIES[i].symbol] = true;
                }
            }

            if (keys.length > 0) {
                // clear the price menu & reset internal rate
                this._prices_menu.menu.removeAll();
                this._currency_data = {};

                for (let i = 0; i < keys.length; i++){
                    // save the response data for price calculations
                    let price = data[keys[i]][this._getFiatAAbbr()];
                    this._currency_data[keys[i]] = price;

                    if (topBarKeys[keys[i]]) {
                      txt_label += `${delim_count > 0 ? ' ' + this._getDelim() + ' ' : '' }${keys[i]} ${this._getSymbol()}${price}`;
                      delim_count++;
                    } else {
                      let txt = `${keys[i]} ${this._getSymbol()}${data[keys[i]][this._getFiatAAbbr()]}`;
			this._prices_menu.menu.addMenuItem(new PopupMenu.PopupMenuItem(txt, {reactive: false}));
                    }
                }

                this._txt_label = txt_label;
                this._setLabelText();
            }
        }

        _removeTimeout() {
            if (this._timeout) {
                Mainloop.source_remove(this._timeout);
                this._timeout = null;
            }
        }

        _setLabelText() {
            if (this._distraction_mode_switch._switch.state) {
                this._prices_menu.menu.removeAll();
                this.buttonText.set_text("krypto [zzz]");
            } else {
                this.buttonText.set_text(this._txt_label);
            }
        }

        _urlBuilder() {
            let crypto_array = [];

            for (let i = 0; i < Settings.CRYPTOCURRENCIES.length; i++) {
                if (this._settings.get_boolean(Settings.CRYPTOCURRENCIES[i].setting)) {
                    crypto_array.push(Settings.CRYPTOCURRENCIES[i].symbol);
                }
            }

            if (crypto_array.length) {
                let index = this._settings.get_int(Settings.PREF_FIAT) == null ? Settings.FIAT.findIndex(f => f.abbr === "USD" ) : this._settings.get_int(Settings.PREF_FIAT);

                return this._base_url + crypto_array.join(',') + ('&tsyms=' + Settings.FIAT[index].abbr);
            }

            return null;
        }

	_positionInPanel() {
            let alignment = '';
	    let gravity = 0;
	    let arrow_pos = 0;

	    switch (this._settings.get_int(Settings.PREF_POSITION)) {
	    case 0: // far left
		alignment = 'left';
		gravity = 0;
		arrow_pos = 1;
		break;
	    case 1: // left
		alignment = 'left';
		gravity = -1;
		arrow_pos = 1;
		break;
	    case 2: // center
		alignment = 'center';
		gravity = -1;
		arrow_pos = 0.5;
		break;
	    case 3: // right
		alignment = 'right';
		gravity = 0;
		arrow_pos = 0;
		break;
	    case 4: // far right
		alignment = 'right';
		gravity = -1;
		arrow_pos = 0;
		break;
	    }

            this.menu._arrowAlignment = arrow_pos;

            return [alignment, gravity];
	}

	_positionInPanelChanged()
	{
	    this.container.get_parent().remove_actor(this.container);
	    let position = this._positionInPanel();
	    let boxes = {
		left: Main.panel._leftBox,
		center: Main.panel._centerBox,
		right: Main.panel._rightBox
	    };
	    boxes[position[0]].insert_child_at_index(this.container, position[1]);
	}

        destroy() {
            if (this._httpSession !== undefined)
                this._httpSession.abort();
                this._httpSession = undefined;

            if (this._timeout) {
                Mainloop.source_remove(this._timeout);
                this._timeout = undefined;

                this.menu.removeAll();
            }

            if (this._distraction_timeout) {
                Mainloop.source_remove(this._distraction_timeout);
                this._distraction_timeout = undefined;
            }

            this._settings.disconnect(this._pos_changed);

            super.destroy();
        }
    })

let ticker;

function enable() {
    ticker = new krypto;
    let position = ticker._positionInPanel();
    Main.panel.addToStatusArea('krypto', ticker, position[1], position[0]);
}

function disable() {
    ticker.destroy();
    ticker = null;
}

const Main = imports.ui.main;
const GObject = imports.gi.GObject;
const Soup = imports.gi.Soup;
const St = imports.gi.St;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const Clutter = imports.gi.Clutter;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Settings = Me.imports.constants;

let _httpSession;
const krypto = GObject.registerClass({ GTypeName: 'krypto'},
    class krypto extends PanelMenu.Button {
        _init () {
            super._init(0.0, "krypto", false);
            this._base_url = "https://min-api.cryptocompare.com/data/pricemulti?fsyms="
            this._txt_label = "Loading...";
            this._settings = Convenience.getSettings('org.gnome.shell.extensions.krypto');
            this._currency_data = {};

            this.buttonText = new St.Label({
              text: this._txt_label,
              y_align: Clutter.ActorAlign.CENTER
            });
            this.actor.add_actor(this.buttonText);
            this._createMenu();
            this._refresh();
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

            this._distraction_mode_switch.connect('activate', Lang.bind(this, this._enableDistractionFreeMode));
            this._calculator_input.clutter_text.connect('key-release-event', Lang.bind(this, this._calculatePrice));

            // add the st widgets to menu items
            // price calculator separator
            this._calculator_divider.actor.add_child(new St.Label({
                text: 'Price Calculator',
                styleClass: 'calculator-text',
            }));
            this._calculated_crypto.actor.add_child(this._crypto_amount);
            this._calculator_fiat.actor.add_child(this._calculated_price);
            this._calculator_area.actor.add_child(this._calculator_input);

            this.menu.addMenuItem(this._distraction_mode_switch);
            this.menu.addMenuItem(this._prices_menu);
            this.menu.addMenuItem(this._calculator_divider);
            this.menu.addMenuItem(this._calculated_crypto);
            this.menu.addMenuItem(this._calculator_fiat);
            this.menu.addMenuItem(this._calculator_area);
        }
        _disableDistractionFreeMode() {
            this._distraction_mode_switch.actor.reactive = true;
            this._distraction_mode_switch.toggle();
            this._setLabelText();
        }
        _enableDistractionFreeMode() {
            this._distraction_timeout = Mainloop.timeout_add_seconds(this._getDistractionTime(), Lang.bind(this, this._disableDistractionFreeMode));
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
            this._timeout = Mainloop.timeout_add_seconds(this._getUpdateSec(), Lang.bind(this, this._refresh));
            return true;
        }
        _loadData() {
            let params = {};
            let url = this._urlBuilder();

            if (url) {
                let message = Soup.Message.new('GET', url);
                
                _httpSession = new Soup.SessionAsync();
                _httpSession.queue_message(message, Lang.bind(this, function (_httpSession, message) {
                    if (message.status_code !== 200) return;
                    let json = JSON.parse(message.response_body.data);
                    this._refreshUI(json);
                }));
            }
        }

        _refreshUI(data) {
            let txt_label = "";
            let keys = Object.keys(data);

            if (keys.length > 0) {
                // clear the price menu & reset internal rate
                this._prices_menu.menu.removeAll();
                this._currency_data = {};

                for (let i = 0; i < keys.length; i++){
                    // save the response data for price calculations
                    let price = data[keys[i]][this._getFiatAAbbr()];
                    this._currency_data[keys[i]] = price;

                    if (i < this._settings.get_int(Settings.PREF_NUM_DISPLAY)) {
                      txt_label += (keys[i] + " " + this._getSymbol() + price.toString() + " " + this._getDelim() + " ");
                    } else {
                      let txt = keys[i] + " " + this._getSymbol() + data[keys[i]][this._getFiatAAbbr()].toString();
                      this._prices_menu.menu.addMenuItem(new PopupMenu.PopupMenuItem(txt, {reactive: false}));
                    }
                }

                this._txt_label = txt_label.substring(0, txt_label.length - 2);
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

        stop() {
            if (_httpSession !== undefined)
                _httpSession.abort();
                _httpSession = undefined;

            if (this._timeout) {
                Mainloop.source_remove(this._timeout);
                this._timeout = undefined;

                this.menu.removeAll();
            }
        }
    })

let ticker;

function enable() {
    ticker = new krypto;
    Main.panel.addToStatusArea('krypto', ticker);
}

function disable() {
    ticker.stop();
    ticker.destroy();
}
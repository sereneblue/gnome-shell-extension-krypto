import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Soup from 'gi://Soup';
import St from 'gi://St';

import * as CONSTANTS from './constants.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import {extensionManager} from 'resource:///org/gnome/shell/ui/main.js';

const krypto = GObject.registerClass({ GTypeName: 'krypto'},
    class krypto extends PanelMenu.Button {
        _init () {
            super._init(0.0, "krypto", false);
            this._base_url = "https://min-api.cryptocompare.com/data/pricemulti?fsyms="
            this._txt_label = "Loading...";
            this._currency_data = {};
            this._httpSession = new Soup.Session();
            this._decoder = new TextDecoder();

            this.buttonText = new St.Label({
                text: this._txt_label,
                y_align: Clutter.ActorAlign.CENTER
            });
            this.add_child(this.buttonText);
            this._createMenu();
        }

        _setSettings(settings) {
            this._settings = settings;

            this._pos_changed = this._settings.connect('changed::' + CONSTANTS.PREF_POSITION, this._positionInPanelChanged.bind(this));
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
                extensionManager.openExtensionPrefs('krypto@sereneblue', '', {})
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
            this._distraction_timeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, this._getDistractionTime(), this._disableDistractionFreeMode.bind(this));
            // disable changing distraction free mode ;)
            this._distraction_mode_switch.actor.reactive = false;
            this._setLabelText();
        }

        _getDistractionTime() {
            return 60 * this._settings.get_int(CONSTANTS.PREF_DISTRACTION_MIN);
        }

        _getUpdateSec() {
            return this._settings.get_int(CONSTANTS.PREF_UPDATE_SEC) || 30;
        }

        _getDelim() {
            return CONSTANTS.DELIMS[this._settings.get_int(CONSTANTS.PREF_DELIMITER)];
        }

        _getFiatAAbbr() {
            return CONSTANTS.FIAT[this._settings.get_int(CONSTANTS.PREF_FIAT)].abbr;
        }

        _getSymbol() {
            return CONSTANTS.FIAT[this._settings.get_int(CONSTANTS.PREF_FIAT)].symbol;
        }

        _refresh() {
            this._loadData(this._refreshUI);
            this._removeTimeout();
            this._timeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, this._getUpdateSec(), this._refresh.bind(this));
            return true;
        }

        _loadData() {
            let params = {};
            let url = this._urlBuilder();

            if (url) {
                let message = Soup.Message.new('GET', url);

                this._httpSession.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null, function (session, res) {
                    let data = session.send_and_read_finish(res);

                    if (data) {
                        data = this._decoder.decode(data.toArray())

                        this._refreshUI(JSON.parse(data));
                    }
                }.bind(this));
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

            for (let i = 0; i < CONSTANTS.CRYPTOCURRENCIES.length; i++) {
                if (this._settings.get_boolean(CONSTANTS.CRYPTOCURRENCIES[i].setting + "-topbar")) {
                    topBarKeys[CONSTANTS.CRYPTOCURRENCIES[i].symbol] = true;
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
                GLib.Source.remove(this._timeout);
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

            for (let i = 0; i < CONSTANTS.CRYPTOCURRENCIES.length; i++) {
                if (this._settings.get_boolean(CONSTANTS.CRYPTOCURRENCIES[i].setting)) {
                    crypto_array.push(CONSTANTS.CRYPTOCURRENCIES[i].symbol);
                }
            }

            if (crypto_array.length) {
                let index = this._settings.get_int(CONSTANTS.PREF_FIAT) == null ? CONSTANTS.FIAT.findIndex(f => f.abbr === "USD" ) : this._settings.get_int(CONSTANTS.PREF_FIAT);

                return this._base_url + crypto_array.join(',') + ('&tsyms=' + CONSTANTS.FIAT[index].abbr);
            }

            return null;
        }

        _positionInPanel() {
            let alignment = '';
            let gravity = 0;
            let arrow_pos = 0;

            switch (this._settings.get_int(CONSTANTS.PREF_POSITION)) {
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

        _positionInPanelChanged() {
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
                GLib.Source.remove(this._timeout);
                this._timeout = undefined;

                this.menu.removeAll();
            }

            if (this._distraction_timeout) {
                GLib.Source.remove(this._distraction_timeout);
                this._distraction_timeout = undefined;
            }

            this._settings.disconnect(this._pos_changed);

            super.destroy();
        }
})

export default class KryptoExtension extends Extension {
    init() {}

    enable() {
        this.ticker = new krypto;
        this.ticker._setSettings(this.getSettings("org.gnome.shell.extensions.krypto"))
        this.ticker._refresh();

        let position = this.ticker._positionInPanel();

        Main.panel.addToStatusArea('krypto', this.ticker, position[1], position[0]);
    }

    disable() {
        this.ticker.destroy();
        this.ticker = null;
    }
}
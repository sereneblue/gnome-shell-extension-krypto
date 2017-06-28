const St = imports.gi.St;
const Main = imports.ui.main;
const Soup = imports.gi.Soup;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const Clutter = imports.gi.Clutter;
const PanelMenu = imports.ui.panelMenu;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Settings = Me.imports.constants;

let _httpSession;
const krypto = new Lang.Class({
  Name: 'krypto',
  Extends: PanelMenu.Button,

  _init: function () {
    this.parent(0.0, "krypto", false);
    this._base_url = "https://min-api.cryptocompare.com/data/pricemulti?fsyms="
    this._display_text = "";
    this._settings = Convenience.getSettings('org.gnome.shell.extensions.krypto');
    this._currency_data = null;

    this.buttonText = new St.Label({
      text: _("Loading..."),
      y_align: Clutter.ActorAlign.CENTER
    });
    this.actor.add_actor(this.buttonText);
    this._refresh();
  },

  _getUpdateSec: function () {
    if (!this._settings.get_int(Settings.UPDATE_SEC)) return 30;
    return this._settings.get_int(Settings.UPDATE_SEC);
  },

  _getFiatSymbol: function () {
    return Settings.FIAT_SYMBOLS[this._settings.get_int(Settings.FIAT)];
  },

  _getSymbol: function () {
    return Settings.SYMBOLS[this._settings.get_int(Settings.FIAT)];
  },

  _refresh: function () {
    this._loadData(this._refreshUI);
    this._removeTimeout();
    this._timeout = Mainloop.timeout_add_seconds(this._getUpdateSec(), Lang.bind(this, this._refresh));
    return true;
  },

  _loadData: function () {
    let params = {};
    _httpSession = new Soup.SessionAsync();
    let message = Soup.Message.new('GET', this._urlBuilder());
    _httpSession.queue_message(message, Lang.bind(this, function (_httpSession, message) {
        if (message.status_code !== 200) return;
          let json = JSON.parse(message.response_body.data);
          this._refreshUI(json);
        }
      )
    );
  },

  _refreshUI: function (data) {
  	var txt_label = "";
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++){
      if (i < this._settings.get_int(Settings.NUM_DISPLAY)) {
        txt_label += (keys[i] + " " + this._getSymbol() + data[keys[i]][this._getFiatSymbol()].toString() + " | ");
      } else {
        // put the rest of the currencies in popup menu TODO
      }
    }
    txt_label = txt_label.substring(0, txt_label.length - 2);
    this.buttonText.set_text(txt_label);
  },

  _removeTimeout: function () {
    if (this._timeout) {
      Mainloop.source_remove(this._timeout);
      this._timeout = null;
    }
  },

  _urlBuilder: function () {
    // get the enabled cryptocurrencies
    var crypto_array = [];
    for (var i = 0; i < Settings.CRYPTOS.length; i++) {
      if (this._settings.get_boolean(Settings.ENABLED_CRYPTOS[i])) {
        crypto_array.push(Settings.CRYPTOS[i]);
      }
    }

    // check for no values set
    if (crypto_array.length < 1) crypto_array.push("BTC");

    // 13 is the default (USD) index
    var index = this._settings.get_int(Settings.FIAT) ? this._settings.get_int(Settings.FIAT) : this._settings.get_default_value(Settings.FIAT);
    return this._base_url + crypto_array.join(',') + ('&tsyms=' + Settings.FIAT_SYMBOLS[index]);
  },

  stop: function () {
    if (_httpSession !== undefined)
      _httpSession.abort();
    _httpSession = undefined;

    if (this._timeout)
      Mainloop.source_remove(this._timeout);
    this._timeout = undefined;

    this.menu.removeAll();
  }
});

let ticker;

function init() {
}

function enable() {
	ticker = new krypto;
	Main.panel.addToStatusArea('krypto', ticker);
}

function disable() {
	ticker.stop();
	ticker.destroy();
}
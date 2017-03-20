const St = imports.gi.St;
const Main = imports.ui.main;
const Soup = imports.gi.Soup;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const Clutter = imports.gi.Clutter;
const PanelMenu = imports.ui.panelMenu;

//Edit your settings here
const CRYPTO = ['BTC'];
const SYM = "$";
const FIAT  = "USD";

let CC_URL = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=';
let txt_label = "";
CC_URL += CRYPTO.join(',');
CC_URL += ('&tsyms=' + FIAT);

let _httpSession;
const krypto = new Lang.Class({
  Name: 'krypto',
  Extends: PanelMenu.Button,

  _init: function () {
    this.parent(0.0, "krypto-ticker", false);
    this.buttonText = new St.Label({
      text: _("Loading..."),
      y_align: Clutter.ActorAlign.CENTER
    });
    this.actor.add_actor(this.buttonText);
    this._refresh();
  },

  _refresh: function () {
    this._loadData(this._refreshUI);
    this._removeTimeout();
    this._timeout = Mainloop.timeout_add_seconds(30, Lang.bind(this, this._refresh));
    return true;
  },

  _loadData: function () {
    let params = {};
    _httpSession = new Soup.SessionAsync();
    let message = Soup.Message.new('GET', CC_URL);
    _httpSession.queue_message(message, Lang.bind(this, function (_httpSession, message) {
          if (message.status_code !== 200) return;
          let json = JSON.parse(message.response_body.data);
          this._refreshUI(json);
        }
      )
    );
  },

  _refreshUI: function (data) {
  	txt_label = "";
    for (var k in data){
  		txt_label += (k + " " + SYM + data[k][FIAT].toString() + " | ");
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
	Main.panel.addToStatusArea('krypto-ticker', ticker);
}

function disable() {
	ticker.stop();
	ticker.destroy();
}
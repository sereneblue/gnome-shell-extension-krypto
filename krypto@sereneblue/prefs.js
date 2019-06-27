/* -*- mode: js; js-basic-offset: 4; indent-tabs-mode: nil -*- */

const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

const Gettext = imports.gettext.domain('krypto@sereneblue');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Lib = Me.imports.convenience;
const Settings = Me.imports.constants;

function init() {
	Lib.initTranslations('krypto@sereneblue');
}

const krypto_widget = new GObject.Class({
    Name: 'krypto.Prefs.Widget',
    GTypeName: 'kryptoSettingsWidget',
    Extends: Gtk.Box,

    _init: function(params) {
        this.parent(params);

        this.orientation = Gtk.Orientation.VERTICAL;
        this.spacing = 0;

        // creates the settings
        this.settings = Lib.getSettings("org.gnome.shell.extensions.krypto");

        // creates the ui builder and add the main resource file
        let uiFilePath = Me.path + "/krypto_prefs.gtkbuilder";
        let builder = new Gtk.Builder();

        if (builder.add_from_file(uiFilePath) === 0) {
            let label = new Gtk.Label({
                label: _('Could not load the preferences UI file'),
                vexpand: true
            });

            this.pack_start(label, true, true, 0);
		} else {
			// gets the interesting builder objects
        	let main_container = builder.get_object("Main_Container");

        	// packs the main table
        	this.pack_start(main_container, true, true, 0);

	        let prefs_combo_fiat = builder.get_object("prefs_combo_fiat");
	        let prefs_combo_delim = builder.get_object("prefs_combo_delim");
	        let prefs_spin_update = builder.get_object("prefs_spin_update");
	        let prefs_spin_distraction = builder.get_object("prefs_spin_distraction");
	        let prefs_spin_num = builder.get_object("prefs_spin_num");
	        let prefs_crypto_ada = builder.get_object("prefs_crypto_ada");
	        let prefs_crypto_bat = builder.get_object("prefs_crypto_bat");
	        let prefs_crypto_bch = builder.get_object("prefs_crypto_bch");
	        let prefs_crypto_bnb = builder.get_object("prefs_crypto_bnb");
	        let prefs_crypto_btc = builder.get_object("prefs_crypto_btc");
	        let prefs_crypto_dash = builder.get_object("prefs_crypto_dash");
	        let prefs_crypto_dcr = builder.get_object("prefs_crypto_dcr");
	        let prefs_crypto_doge = builder.get_object("prefs_crypto_doge");
	        let prefs_crypto_eos = builder.get_object("prefs_crypto_eos");
	        let prefs_crypto_eth = builder.get_object("prefs_crypto_eth");
	        let prefs_crypto_etc = builder.get_object("prefs_crypto_etc");
	        let prefs_crypto_iota = builder.get_object("prefs_crypto_iota");
	        let prefs_crypto_link = builder.get_object("prefs_crypto_link");
	        let prefs_crypto_lsk = builder.get_object("prefs_crypto_lsk");
	        let prefs_crypto_ltc = builder.get_object("prefs_crypto_ltc");
			let prefs_crypto_mkr = builder.get_object("prefs_crypto_mkr");
			let prefs_crypto_nano = builder.get_object("prefs_crypto_nano");
	        let prefs_crypto_neo = builder.get_object("prefs_crypto_neo");
	        let prefs_crypto_nxt = builder.get_object("prefs_crypto_nxt");
	        let prefs_crypto_rep = builder.get_object("prefs_crypto_rep");
	        let prefs_crypto_strat = builder.get_object("prefs_crypto_strat");
	        let prefs_crypto_vet = builder.get_object("prefs_crypto_vet");
	        let prefs_crypto_xem = builder.get_object("prefs_crypto_xem");
	        let prefs_crypto_xmr = builder.get_object("prefs_crypto_xmr");
	        let prefs_crypto_xrp = builder.get_object("prefs_crypto_xrp");
	        let prefs_crypto_xtz = builder.get_object("prefs_crypto_xtz");
	        let prefs_crypto_zec = builder.get_object("prefs_crypto_zec");

	        // bind settings
	        this.settings.bind(Settings.FIAT, prefs_combo_fiat, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.UPDATE_SEC, prefs_spin_update, "value", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.DISTRACTION_MIN, prefs_spin_distraction, "value", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.NUM_DISPLAY, prefs_spin_num, "value", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.DELIMITER, prefs_combo_delim, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.ADA_ENABLED, prefs_crypto_ada, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.BAT_ENABLED, prefs_crypto_bat, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.BCH_ENABLED, prefs_crypto_bch, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.BNB_ENABLED, prefs_crypto_bnb, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.BTC_ENABLED, prefs_crypto_btc, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.DASH_ENABLED, prefs_crypto_dash, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.DCR_ENABLED, prefs_crypto_dcr, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.DOGE_ENABLED, prefs_crypto_doge, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.EOS_ENABLED, prefs_crypto_eos, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.ETH_ENABLED, prefs_crypto_eth, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.ETC_ENABLED, prefs_crypto_etc, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.IOTA_ENABLED, prefs_crypto_iota, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.LINK_ENABLED, prefs_crypto_link, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.LSK_ENABLED, prefs_crypto_lsk, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.LTC_ENABLED, prefs_crypto_ltc, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.MKR_ENABLED, prefs_crypto_mkr, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.NANO_ENABLED, prefs_crypto_nano, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.NEO_ENABLED, prefs_crypto_neo, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.NXT_ENABLED, prefs_crypto_nxt, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.REP_ENABLED, prefs_crypto_rep, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.STRAT_ENABLED, prefs_crypto_strat, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.VET_ENABLED, prefs_crypto_vet, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.XEM_ENABLED, prefs_crypto_xem, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.XMR_ENABLED, prefs_crypto_xmr, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.XRP_ENABLED, prefs_crypto_xrp, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.XTZ_ENABLED, prefs_crypto_xtz, "active", Gio.SettingsBindFlags.DEFAULT);
	        this.settings.bind(Settings.ZEC_ENABLED, prefs_crypto_zec, "active", Gio.SettingsBindFlags.DEFAULT);
	    }
    }
});

function buildPrefsWidget() {
    let widget = new krypto_widget();
    widget.show_all();

    return widget;
}
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

const krypto_widget = GObject.registerClass({ GTypeName: 'kryptoSettingsWidget' },
    class krypto_widget extends Gtk.Box {
        _init(params) {
            super._init(params);

            this.orientation = Gtk.Orientation.VERTICAL;
            this.spacing = 0;

            // creates the settings
            this._settings = Lib.getSettings("org.gnome.shell.extensions.krypto");

            // creates the ui builder and add the main resource file
            let preferencesUI = Me.path + "/ui/preferences.ui";
            let builder = new Gtk.Builder();

            if (builder.add_from_file(preferencesUI) === 0) {
                let label = new Gtk.Label({
                    label: _('Could not load the preferences UI file'),
                    vexpand: true
                });

                this.append(label);
            } else {
                const main_container = builder.get_object("Main_Container");

                this._cryptoList = builder.get_object("crypto-list");
                this._enabledList = builder.get_object("enabled-crypto-list");

                this._cryptoList.set_sort_func(this._sortList.bind(this));
                this._enabledList.set_sort_func(this._sortList.bind(this));

                for (let i = 0; i < Settings.CRYPTOCURRENCIES.length; i++) {
                    this._addCryptoRow(
                        Settings.CRYPTOCURRENCIES[i], 
                        this._settings
                    );
                }

                this.append(main_container);

                let prefs_combo_fiat = builder.get_object("prefs_combo_fiat");
                let prefs_combo_delim = builder.get_object("prefs_combo_delim");
                let prefs_spin_update = builder.get_object("prefs_spin_update");
                let prefs_spin_distraction = builder.get_object("prefs_spin_distraction");
                let prefs_spin_num = builder.get_object("prefs_spin_num");

                for (let i = 0; i < Settings.FIAT.length; i++) {
                    prefs_combo_fiat.append(i.toString(), Settings.FIAT[i].abbr);
                }

                // bind preferences settings
                this._settings.bind(Settings.PREF_FIAT, prefs_combo_fiat, "active", Gio.SettingsBindFlags.DEFAULT);
                this._settings.bind(Settings.PREF_UPDATE_SEC, prefs_spin_update, "value", Gio.SettingsBindFlags.DEFAULT);
                this._settings.bind(Settings.PREF_DISTRACTION_MIN, prefs_spin_distraction, "value", Gio.SettingsBindFlags.DEFAULT);
                this._settings.bind(Settings.PREF_NUM_DISPLAY, prefs_spin_num, "value", Gio.SettingsBindFlags.DEFAULT);
                this._settings.bind(Settings.PREF_DELIMITER, prefs_combo_delim, "active", Gio.SettingsBindFlags.DEFAULT);
            }
        }

        _addCryptoRow(currency, settings) {
            let row = new CryptoCurrencyRow(currency, settings, this._moveRow.bind(this));

            if (row.enabled) {
                this._enabledList.append(row);
            } else {
                this._cryptoList.append(row);
            }
        }

        _moveRow(currency, wasEnabled) {
            let row = [
                ...this._cryptoList,
                ...this._enabledList,
            ].find(c => c.name === currency.name);

            if (row) {
                row.get_parent().remove(row);

                if (wasEnabled) {
                    this._enabledList.append(row);
                } else {
                    this._cryptoList.append(row);
                }
            }
        }

        _sortList(a, b) {
            return a.name.localeCompare(b.name);
        }
    });


const CryptoCurrencyRow = GObject.registerClass({
    GTypeName: 'CryptoCurrencyRow',
    Template: 'file:///' + Me.path + "/ui/crypto-row.ui",
    InternalChildren: [
        'currencyLabel',
        'currencySwitch'
    ],
}, class ExtensionRow extends Gtk.ListBoxRow {
    _init(currency, settings, callback) {
        super._init();

        this._app = Gio.Application.get_default();
        this._cryptocurrency = currency;
        this._settings = settings;
        this._switchCallback = callback;

        this._currencyLabel.label = this._cryptocurrency.name;
        this._currencySwitch.connect("notify::active", this._on_cryptoSwitch_changed.bind(this));

        this._settings.bind(this._cryptocurrency.setting, this._currencySwitch, "active", Gio.SettingsBindFlags.DEFAULT);
    }

    get enabled() {
        return this._settings.get_boolean(this._cryptocurrency.setting);
    }

    get name() {
        return this._cryptocurrency.name;
    }

    _on_cryptoSwitch_changed(state) {
        let enabled = state.get_active();

        this._switchCallback(this._cryptocurrency, enabled);
    }
});


function buildPrefsWidget() {
    let widget = new krypto_widget();
    widget.show();

    return widget;
}
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

import Adw from 'gi://Adw';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import * as CONSTANTS from './constants.js';

const EXT_PATH = import.meta.url;

class Preferences {
    constructor(window, settings) {
        this._builder = new Gtk.Builder();

        this._settings = settings;

        this._builder.add_from_file(EXT_PATH.replace('prefs.js', "ui/preferences.ui").replace('file://', ''))
        this._prefsPage = this._builder.get_object("preferences_page");
        this._currenciesPage = this._builder.get_object("currency-page");

        this._bootstrap();

        window.add(this._prefsPage);
        window.add(this._currenciesPage);
    }

    _bootstrap() {
        this._cryptoList = this._builder.get_object("crypto-list");
        this._enabledList = this._builder.get_object("enabled-crypto-list");

        this._cryptoList.set_sort_func(this._sortList.bind(this));
        this._enabledList.set_sort_func(this._sortList.bind(this));

        for (let i = 0; i < CONSTANTS.CRYPTOCURRENCIES.length; i++) {
            this._addCryptoRow(
                CONSTANTS.CRYPTOCURRENCIES[i],
                this._settings
            );
        }

        this._migrate();
        this._updateCheckboxes(true);

        let prefs_combo_fiat = this._builder.get_object("prefs_combo_fiat");
        let prefs_combo_delim = this._builder.get_object("prefs_combo_delim");
        let prefs_combo_pos = this._builder.get_object("prefs_combo_pos");
        let prefs_spin_update = this._builder.get_object("prefs_spin_update");
        let prefs_spin_distraction = this._builder.get_object("prefs_spin_distraction");
        let prefs_spin_num = this._builder.get_object("prefs_spin_num");

        for (let i = 0; i < CONSTANTS.FIAT.length; i++) {
            prefs_combo_fiat.append(i.toString(), CONSTANTS.FIAT[i].abbr);
        }

        prefs_spin_num.connect("value-changed", this._on_numDisplay_changed.bind(this));

        // bind preferences settings
        this._settings.bind(CONSTANTS.PREF_FIAT, prefs_combo_fiat, "active", Gio.SettingsBindFlags.DEFAULT);
        this._settings.bind(CONSTANTS.PREF_UPDATE_SEC, prefs_spin_update, "value", Gio.SettingsBindFlags.DEFAULT);
        this._settings.bind(CONSTANTS.PREF_DISTRACTION_MIN, prefs_spin_distraction, "value", Gio.SettingsBindFlags.DEFAULT);
        this._settings.bind(CONSTANTS.PREF_NUM_DISPLAY, prefs_spin_num, "value", Gio.SettingsBindFlags.DEFAULT);
        this._settings.bind(CONSTANTS.PREF_DELIMITER, prefs_combo_delim, "active", Gio.SettingsBindFlags.DEFAULT);
        this._settings.bind(CONSTANTS.PREF_POSITION, prefs_combo_pos, "active", Gio.SettingsBindFlags.DEFAULT);
    }

    _addCryptoRow(currency, settings) {
        let row = new CryptoCurrencyRow(currency, settings, this._moveRow.bind(this), this._updateCheckboxes.bind(this));

        if (row.enabled) {
            this._enabledList.append(row);
        } else {
            this._cryptoList.append(row);
        }
    }

    _migrate() {
        let activeList = [
            ...this._enabledList
        ];

        let numActiveTopBar = activeList.filter(r => r.topBarEnabled).length;

        if (numActiveTopBar == 0 && activeList.length) {
            let maxActive = this._settings.get_int(CONSTANTS.PREF_NUM_DISPLAY)
            let numToUpdate = activeList.length > maxActive ? maxActive : activeList.length;

            for (let i = 0; i < numToUpdate; i++) {
                activeList[i].topBarEnabled = true;
            }
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

                let activeTotal = [
                    ...this._enabledList
                ].filter(r => r.topBarEnabled).length;
                let maxActive = this._settings.get_int(CONSTANTS.PREF_NUM_DISPLAY)

                if (activeTotal < maxActive) {
                    row.topBarEnabled = true;
                }
            } else {
                this._cryptoList.append(row);
                row.topBarEnabled = false;
            }
        }

        this._updateCheckboxes(wasEnabled)
    }

    _sortList(a, b) {
        return a.name.localeCompare(b.name);
    }

    _updateCheckboxes(toggled, maxActive=null) {
        let activeTotal = [
            ...this._enabledList
        ].filter(r => r.topBarEnabled).length;

        let inactiveList = [
            ...this._enabledList
        ].filter(r => !r.topBarEnabled);

        maxActive = maxActive || this._settings.get_int(CONSTANTS.PREF_NUM_DISPLAY)
        if (toggled) {
            if (activeTotal == maxActive) {
                for (let i = 0; i < inactiveList.length; i++) {
                    inactiveList[i]._currencyEnabledInTopBar.set_sensitive(false)
                }

                return
            }
        }

        if (activeTotal < maxActive) {
            for (let i = 0; i < inactiveList.length; i++) {
                inactiveList[i]._currencyEnabledInTopBar.set_sensitive(true)
            }
        }
    }

    _on_numDisplay_changed(state) {
        let val = state.get_value();

        let activeList = [
            ...this._enabledList
        ].filter(r => r.topBarEnabled);

        if (activeList.length >= val) {
            let diff = activeList.length - val;

            for (let i = 0; i < diff; i++) {
                activeList[activeList.length - (1 + i)].topBarEnabled = false;
            }

            this._updateCheckboxes(true, val);
        } else if (val > activeList.length) {
            let diff = val - activeList.length;

            this._updateCheckboxes(false, val);
        }
    }
};

const CryptoCurrencyRow = GObject.registerClass({
    GTypeName: 'CryptoCurrencyRow',
    Template: EXT_PATH.replace('prefs.js', "ui/crypto-row.ui"),
    InternalChildren: [
        'currencyLabel',
        'currencyEnabledInTopBar',
        'currencySwitch'
    ]
}, class ExtensionRow extends Gtk.ListBoxRow {
    _init(currency, settings, callback, secondCallback) {
        super._init();

        this._app = Gio.Application.get_default();
        this._cryptocurrency = currency;
        this._settings = settings;
        this._switchCallback = callback;
        this._checkboxCallback = secondCallback;

        this._currencyLabel.label = this._cryptocurrency.name;
        this._currencySwitch.connect("notify::active", this._on_cryptoSwitch_changed.bind(this));

        this._currencyEnabledInTopBar.set_visible(this._settings.get_boolean(this._cryptocurrency.setting));
        this._currencyEnabledInTopBar.connect("toggled", this._on_currencyEnabledInTopBar_changed.bind(this));

        this._settings.bind(this._cryptocurrency.setting, this._currencySwitch, "active", Gio.SettingsBindFlags.DEFAULT);
        this._settings.bind(this._cryptocurrency.setting + "-topbar", this._currencyEnabledInTopBar, "active", Gio.SettingsBindFlags.DEFAULT);
    }

    get enabled() {
        return this._settings.get_boolean(this._cryptocurrency.setting);
    }

    get name() {
        return this._cryptocurrency.name;
    }

    get topBarEnabled() {
        return this._currencyEnabledInTopBar.get_active();
    }

    set topBarEnabled(enabled) {
        this._currencyEnabledInTopBar.set_active(enabled);
    }

    _on_currencyEnabledInTopBar_changed(state) {
        let enabled = state.get_active();

        this._checkboxCallback(enabled);
    }

    _on_cryptoSwitch_changed(state) {
        let enabled = state.get_active();

        this._currencyEnabledInTopBar.set_visible(enabled);
        this._currencyEnabledInTopBar.set_sensitive(enabled);

        this._switchCallback(this._cryptocurrency, enabled);
    }
});

export default class KryptoPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        let preferences = new Preferences(window, this.getSettings("org.gnome.shell.extensions.krypto"));
    }
}
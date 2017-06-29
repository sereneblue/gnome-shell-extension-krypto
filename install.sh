#!/bin/bash
# Install krypto extension for GNOME

EXTENSION_PATH="$HOME/.local/share/gnome-shell/extensions";
EXTENSION_UUID="krypto@sereneblue";
URL="https://github.com/sereneblue/gnome-shell-extension-krypto/archive/master.zip";

wget --header='Accept-Encoding:none' -O /tmp/krypto_extension.zip "${URL}"

#Make directory and extract archive to it
mkdir -p "${EXTENSION_PATH}/${EXTENSION_UUID}";
unzip -q /tmp/krypto_extension.zip -d ${EXTENSION_PATH}/${EXTENSION_UUID};
cp -r ${EXTENSION_PATH}/${EXTENSION_UUID}/gnome-shell-extension-krypto-master/krypto@sereneblue/* ${EXTENSION_PATH}/${EXTENSION_UUID}

# Remove repo directory and extra files
rm -r ${EXTENSION_PATH}/${EXTENSION_UUID}/gnome-shell-extension-krypto-master;

# List enabled extensions
EXTENSION_LIST=$(gsettings get org.gnome.shell enabled-extensions | sed 's/^.\(.*\).$/\1/');

# Check if extension enabled
EXTENSION_ENABLED=$(echo ${EXTENSION_LIST} | grep ${EXTENSION_UUID});

if [ "$EXTENSION_ENABLED" = "" ]; then
	gsettings set org.gnome.shell enabled-extensions "[${EXTENSION_LIST},'${EXTENSION_UUID}']"
	# Extension is now available
	echo "krypto has been enabled. Restart your desktop to take effect (Alt+F2 then 'r')."
fi

# remove temporary files
rm -f /tmp/krypto_extension.zip
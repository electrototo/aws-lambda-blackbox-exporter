#!/bin/bash

# If the bundle directory exists, then just copy the bootsrap file
# this is to avoid downloading multiple times the blackbox exporter
if test -d bundle; then
    cp lambda/bootstrap bundle/
    exit 0
fi

# Otherwise, create the dir and download the assets
mkdir bundle/

# Download the exporter, and copy the required files
wget "$BLACKBOX_DOWNLOAD_URL" -O bundle/exporter.tar.gz
cp lambda/bootstrap bundle/

# Unzip the binary and delete original zip
cd bundle/
tar -xzvf exporter.tar.gz --strip-components 1
rm exporter.tar.gz
#!/bin/sh -v
sudo curl -L git.io/weave -o /usr/local/bin/weave
sudo chmod +x /usr/local/bin/weave
sudo mkdir -p /opt/cni/bin
sudo mkdir -p /etc/cni/net.d
sudo weave setup
sudo weave launch
sudo weave expose

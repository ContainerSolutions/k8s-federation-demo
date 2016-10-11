#!/bin/sh -v

MASTER_INTERNAL_IP=$1

sudo curl -L git.io/weave -o /usr/local/bin/weave
sudo chmod +x /usr/local/bin/weave
sudo mkdir -p /opt/cni/bin
sudo mkdir -p /etc/cni/net.d
sudo weave setup
sudo weave launch $MASTER_INTERNAL_IP
sudo weave expose

sudo perl -pi -e 's/--babysit-daemons=true +\"/--babysit-daemons=true --network-plugin=cni --network-plugin-dir=\/etc\/cni\/net.d\"/g' /etc/sysconfig/kubelet
curl -L -O https://github.com/containernetworking/cni/releases/download/v0.3.0/cni-v0.3.0.tgz 
sudo tar xvf cni-v0.3.0.tgz -C /opt/cni/bin/
sudo service kubelet restart



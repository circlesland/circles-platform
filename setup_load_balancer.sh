#!/bin/bash
# Script arguments:
# ----------------------------
# $1: your (sub)domain
#
# Other requirements:
# ----------------------------
# * DNS A-record pointing to the server's IP.

# Create a working directory in the user's home directory (probably root)
cd ~ || exit
mkdir .omo-central-loadbalancer
cd .omo-central-loadbalancer || exit

# Install docker.io and certbot
apt-get update
apt-get install -y docker.io certbot

# Download utility scripts
wget https://raw.githubusercontent.com/circlesland/circles-platform/dev/generate_loadbalancer_config.sh
chmod +x ./generate_loadbalancer_config.sh

# Generate a config file for nginx
./generate_loadbalancer_config.sh \
  $1 \
  http://omo-central-server:8989/graphql

# Generate a new certificate
certbot certonly --standalone --preferred-challenges http -d $1

# Run the loadbalancer
currentWorkingDir=$(pwd)
docker run -d \
  --restart unless-stopped \
  --name loadbalancer \
  -v $currentWorkingDir/default.conf:/etc/nginx/nginx.conf:ro \
  -v /etc/letsencrypt/archive/$1:/tls:ro \
  -p 443:443 \
  nginx

# configure restart of nginx when the certificate was updated
cat <<EOF > on_letsencrypt_renewal.sh
docker stop loadbalancer
docker rm loadbalancer
docker run -d \
  --restart unless-stopped \
  --name loadbalancer \
  -v $currentWorkingDir/default.conf:/etc/nginx/nginx.conf:ro \
  -v /etc/letsencrypt/archive/$1:/tls:ro \
  -p 443:443 \
  nginx
EOF

# make executable
chmod +x on_letsencrypt_renewal.sh

# Register the hook
echo "renew_hook = $currentWorkingDir/on_letsencrypt_renewal.sh" >> /etc/letsencrypt/renewal/$3.conf
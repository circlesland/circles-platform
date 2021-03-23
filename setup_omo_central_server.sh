#!/bin/bash
# Script arguments:
# ----------------------------
# $1: github username
# $2: github access token with rights to access the image repository
# $3: your (sub)domain
# $4 db username
# $5 db password
# $6 db port
# $7 db name
# $8 db host
#
# Other requirements:
# ----------------------------
# * DNS A-record pointing to the server's IP.

# Create a working directory in the user's home directory (probably root)
cd ~ || exit
mkdir .omo-central-server
cd .omo-central-server || exit

# Install docker.io and certbot
apt-get update
apt-get install -y docker.io certbot

# Authenticate at github's image repository
docker login https://docker.pkg.github.com \
  -u $1 \
  -p $2 || exit

# Pull all images
docker pull docker.pkg.github.com/circlesland/circles-platform/omo-central-server:1616368251
docker pull containrrr/watchtower
docker pull nginx

# Download utility scripts
wget https://raw.githubusercontent.com/circlesland/circles-platform/dev/generate_proxy_config.sh
chmod +x ./generate_proxy_config.sh

# Generate a config file for nginx
./generate_proxy_config.sh \
  $3 \
  http://omo-central-server:8989/graphql

# Create a new docker network
docker network create --driver bridge omo-central-server

# Run omo-central-server
docker run -d \
	--restart unless-stopped \
	--name omo-central-server \
	--net omo-central-server \
	-e AUTH_POSTGRES_USER=$4 \
	-e AUTH_POSTGRES_PASSWORD=$5 \
	-e AUTH_POSTGRES_PORT=$6 \
	-e AUTH_POSTGRES_DB=$7 \
	-e AUTH_POSTGRES_HOST=$8 \
	docker.pkg.github.com/circlesland/circles-platform/omo-central-server

# Run watchtower to keep omo-central-server up to date
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /etc/timezone:/etc/timezone:ro \
  containrrr/watchtower \
  --include-restarting=true \
  --interval=3600 \
  omo-central-server

# Generate a new certificate
certbot certonly --standalone --preferred-challenges http -d $3

# Run the proxy
currentWorkingDir=$(pwd)
docker run -d \
  --restart unless-stopped \
  --name proxy \
  --net omo-central-server \
  -v $currentWorkingDir/default.conf:/etc/nginx/nginx.conf:ro \
  -v /etc/letsencrypt/archive/$3:/tls:ro \
  -p 443:443 \
  nginx

# configure restart of nginx when the certificate was updated
cat <<EOF > on_letsencrypt_renewal.sh
docker stop proxy
docker rm proxy
docker run -d \
  --restart unless-stopped \
  --name proxy \
  -net omo-central-server \
  -net bridge \
  -v $currentWorkingDir/default.conf:/etc/nginx/nginx.conf:ro \
  -v /etc/letsencrypt/archive/$3:/tls:ro \
  -p 443:443 \
  nginx
EOF

# make executable
chmod +x on_letsencrypt_renewal.sh

# Register the hook
echo "renew_hook = $currentWorkingDir/on_letsencrypt_renewal.sh" >> /etc/letsencrypt/renewal/$3.conf
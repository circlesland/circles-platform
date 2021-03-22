# omo-central-server
Provides a user directory and marketplace api via a graphql endpoint.  
See the [api schema](https://github.com/circlesland/circles-platform/blob/dev/packages/omo-central-interfaces/src/schema.graphql) for details.

## Run
We build a docker container for development purposes that you can run locally.  
You will need a running postgresql-server on which you can create a new database for the server.  

### 1. Deploy the database
```shell
# Create a new directory as working space
mkdir omo-central-server-db
cd omo-central-server-db

# Get the schema
wget https://raw.githubusercontent.com/circlesland/circles-platform/dev/packages/omo-central-server/schema_template.prisma

# Insert your connection string
yourConnectionString="[your connection string goes here]"
sedArgument="s/REPLACE_ME_WITH_THE_CONNECTION_STRING/${yourConnectionString//\//\\/}/g"
sed -i "${sedArgument}" schema_template.prisma

# Install prisma cli
npm i prisma

# Deploy to your server using prisma cli
npx --no-install prisma db push --schema schema_template.prisma  --preview-feature
```

### 2. Run the docker image
```shell
docker run -d \
	--restart unless-stopped \
	--name omo-central-server \
	-e AUTH_POSTGRES_USER='[db user]' \
	-e AUTH_POSTGRES_PASSWORD='[db password]' \
	-e AUTH_POSTGRES_PORT='[db port]' \
	-e AUTH_POSTGRES_DB='[db name]' \
	-e AUTH_POSTGRES_HOST='[db host]' \
	-p 8989:8989 \
	docker.pkg.github.com/circlesland/circles-platform/omo-central-server
```

### [optional] Pull and run a new image when available
You can use a tool like [watchtower](https://containrrr.dev/watchtower/) to automatically run the newest version of an image:
```shell
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /etc/timezone:/etc/timezone:ro \
  containrrr/watchtower \
  --include-restarting=true \
  --interval=60 \
  omo-central-server
```
If you pull the image from a private repository consider adding the following volume to the container:
```shell
    -v ~/.docker/config.json:/config.json:ro
```

### [production] Use nginx proxy with let's encrypt cerificate
If you already ran the above steps then clean up first:
```shell
docker stop omo-central-server
docker rm omo-central-server

docker stop watchtower
docker rm watchtower
```
Then generate the proxy configuration for your host:
```shell
# Download the script that generates the nginx config (or write one yourself)
wget https://raw.githubusercontent.com/circlesland/circles-platform/dev/generate_proxy_config.sh

# Make the script executable
chmod +x ./generate_proxy_config.sh

# Generate a nginx proxy config in the current directory.
./generate_proxy_config.sh \
  [your-domain.com] \
  omo-central-server:8989/graphql
  
# Optional: Copy the config to any location on your docker host (or leve it where it is)
cp default.conf /home/omo-central/proxy/default.conf
```
Install and run certbot on the docker host:
```shell
# install certbot
apt-get install certbot
# generate a certificate for the domain
certbot certonly --standalone --preferred-challenges http -d [your-domain.com]
```
Then create a new docker network for 'omo-central-server' and 'proxy' ..
```shell
docker network create --driver bridge omo-central-server
```
.. and (re)start 'omo-central-service' in the new network.
```shell
docker run -d \
	--restart unless-stopped \
	--name omo-central-server \
	--net omo-central-server \
	-e AUTH_POSTGRES_USER='[db user]' \
	-e AUTH_POSTGRES_PASSWORD='[db password]' \
	-e AUTH_POSTGRES_PORT='[db port]' \
	-e AUTH_POSTGRES_DB='[db name]' \
	-e AUTH_POSTGRES_HOST='[db host]' \
	docker.pkg.github.com/circlesland/circles-platform/omo-central-server
	
# If you want to use 'watchtower' to keep the container up to date then also run the following:
# docker run -d \
#   --name watchtower \
#   -v /var/run/docker.sock:/var/run/docker.sock \
#   -v /etc/timezone:/etc/timezone:ro \
#   containrrr/watchtower \
#   --include-restarting=true \
#   --interval=60 \
#   omo-central-server
	
```
Finally, start the proxy:
```shell
# Start nginx with the previously generated config and the certificates as volume
docker run -d \
  --restart unless-stopped \
  --name proxy \
  -net omo-central-server \
  -net bridge \
  -v /home/omo-central/proxy/default.conf:/etc/nginx/nginx.conf:ro \
  -v /etc/letsencrypt/archive/[your-domain.com]:/tls:ro \
  -p 443:443 \
  nginx
```
Certbot will renew the certificate automatically however we also need to restart the container whenever the
certificate got renewed.  
The following snippet creates a script that can be used with the renew-hook.
```shell
cat <<EOF > on_letsencrypt_renewal.sh
docker stop omo-central-server
docker rm omo-central-server
docker run -d \
	--restart unless-stopped \
	--name omo-central-server \
	--net omo-central-server \
	-e AUTH_POSTGRES_USER='[db user]' \
	-e AUTH_POSTGRES_PASSWORD='[db password]' \
	-e AUTH_POSTGRES_PORT='[db port]' \
	-e AUTH_POSTGRES_DB='[db name]' \
	-e AUTH_POSTGRES_HOST='[db host]' \
	docker.pkg.github.com/circlesland/circles-platform/omo-central-server
EOF

# make executable
chmod +x on_letsencrypt_renewal.sh
```
Then add it to '/etc/letsencrypt/renewal/[your-domain].conf': 
```shell
echo "renew_hook = wherever/your/script/is/on_letsencrypt_renewal.sh" >> /etc/letsencrypt/renewal/[your-domain].conf
```
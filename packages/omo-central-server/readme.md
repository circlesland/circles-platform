# omo-central-server
Provides a user directory and marketplace api via a graphql endpoint.  
See the [api schema](https://github.com/circlesland/circles-platform/blob/dev/packages/omo-central-interfaces/src/schema.graphql) for details.

## Run
We build a docker container for development purposes that you can run locally.  
You will need a running postgresql-server on which you can create a new database for the server.  

### 1. Deploy the database
```shell
# Create a new direcotry as working space
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
npx --no-install prisma push --schema schema_template.prisma  --preview-feature
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
Install certbot on the docker host:
```shell
# install certbot
apt-get install certbot
# generate a certificate for the domain
certbot certonly --standalone --preferred-challenges http -d [your-domain.com]
```
Certbot will renew the cerificate automatically however, we also need to restart the container whenever the 
certificate got renewed:
```shell
echo "renew_hook = docker stop proxy && docker rm proxy && docker run -d --restart unless-stopped --name proxy -v /etc/letsencrypt/archive/[your-domain.com]:/tls proxy" >> /etc/letsencrypt/renewal/[your-domain].conf
```
Then build and start the proxy (*working dir must be the repository root*).   
The nginx config can be found in 'generate_proxy_config.sh'. This script is executed on build and generates the nginx config file.
```shell
# Build the container
docker build . --file proxy.Dockerfile --build-arg DOMAIN=[your-domain.com] -t proxy

# Run the container and include a volume with the certs
docker run -d \
  --restart unless-stopped \
  --name proxy \
  -v /etc/letsencrypt/archive/[your-domain.com]:/tls \
  proxy
```
SET_HEADER_BLOCK=`cat << 'EOF'
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Host $http_host;
    proxy_set_header Cookie $http_cookie;
EOF`

RATE_LIMITING=`cat << 'EOF'
limit_req_zone $binary_remote_addr zone=zone1:10m rate=2r/s;
limit_req_zone $binary_remote_addr zone=zone2:10m rate=4r/s;
limit_req_zone $binary_remote_addr zone=zone3:10m rate=8r/s;
EOF`

TEMPLATE=`cat << EOF
$RATE_LIMITING

server {
  listen 443 ssl;
  server_name  ${DOMAIN};
  ssl_certificate /tls/fullchain1.pem;
  ssl_certificate_key /tls/privkey1.pem;

  location /api {
    limit_req zone=zone2 burst=16 nodelay;
$SET_HEADER_BLOCK
    proxy_pass http://omo-central-server:8989;
  }
}
EOF`
echo "$TEMPLATE" > default.conf

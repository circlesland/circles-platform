RATE_LIMITING=`cat << 'EOF'
limit_req_zone $binary_remote_addr zone=zone1:10m rate=4r/s;
EOF`

TEMPLATE=`cat << EOF
http {
  $RATE_LIMITING

  server {
    listen 443 ssl;
    server_name $1;

    ssl_certificate /tls/fullchain1.pem;
    ssl_certificate_key /tls/privkey1.pem;

    location /graphql {
      limit_req zone=zone1 burst=16 nodelay;

      proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto \\$scheme;
      proxy_set_header X-Real-IP \\$remote_addr;
      proxy_set_header Host \\$http_host;
      proxy_set_header Cookie \\$http_cookie;
      proxy_set_header Upgrade \\$http_upgrade;
      proxy_set_header Connection "upgrade";

      proxy_pass $2;
      proxy_http_version 1.1;
      proxy_read_timeout 86400s;
      proxy_send_timeout 86400s;
    }
  }
}
EOF`
echo "$TEMPLATE" > default.conf

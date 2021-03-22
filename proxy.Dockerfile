FROM nginx:latest

ARG DOMAIN
ENV DOMAIN="$DOMAIN"

COPY generate_proxy_config.sh /etc/nginx/conf.d/generate_proxy_config.sh

RUN chmod +x /etc/nginx/conf.d/generate_proxy_config.sh
RUN cd /etc/nginx/conf.d/ && /etc/nginx/conf.d/generate_proxy_config.sh
RUN cat /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/conf.d/default.sh

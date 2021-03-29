#!/bin/bash
# Script arguments:
# ----------------------------
# $1: api key
# $2: domain
# $3: subdomain
# $4 a-record
apt-get install -y jq curl

#Get the current Zone for the provided domain
CURRENT_ZONE_HREF=$(curl -s -H "X-Api-Key: $1" https://dns.api.gandi.net/api/v5/domains/$2 | jq -r '.zone_records_href')

# Update the A Record of the subdomain using PUT
curl -D- -X PUT -H "Content-Type: application/json" \
        -H "X-Api-Key: $1" \
        -d "{\"rrset_name\": \"$3\",
             \"rrset_type\": \"A\",
             \"rrset_ttl\": 1200,
             \"rrset_values\": [\"$4\"]}" \
        $CURRENT_ZONE_HREF/$3/A

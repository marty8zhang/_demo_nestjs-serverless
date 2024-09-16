#!/bin/bash
set -Eeuo pipefail

# Use `realpath` in case this script is run via a symbolic link.
source "$(dirname "$(realpath "${BASH_SOURCE[0]}")")/get-database-credential.sh"

username=$(get-database-credential username)
password=$(get-database-credential password)
dbname=$(get-database-credential dbname)

docker run \
  --publish 27017:27017 \
  --volume /egghdz/_demo_nestjs-serverless/mongo-data:/data/db \
  --env MONGO_INITDB_ROOT_USERNAME="$username" \
  --env MONGO_INITDB_ROOT_PASSWORD="$password" \
  --env MONGO_INITDB_DATABASE="$dbname" \
  --detach \
  --rm \
  --name demo_nestjs-serverless_mongo \
  mongo:7-jammy

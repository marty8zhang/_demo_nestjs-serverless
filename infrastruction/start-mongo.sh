#!/bin/bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/get-database-credential.sh"

docker run \
  --publish 27017:27017 \
  --volume /egghdz/_demo_nestjs-serverless/mongo-data:/data/db \
  --env MONGO_INITDB_ROOT_USERNAME=$(get-database-credential username) \
  --env MONGO_INITDB_ROOT_PASSWORD=$(get-database-credential password) \
  --env MONGO_INITDB_DATABASE=$(get-database-credential dbname) \
  --detach \
  --rm \
  --name demo_nestjs-serverless_mongo \
  mongo:7-jammy
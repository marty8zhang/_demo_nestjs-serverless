#!/bin/bash
set -Eeuo pipefail

# First two `dirname` are used to locate the (grand)parent folder.
source "$(dirname "$(dirname "$(dirname "$(realpath "${BASH_SOURCE[0]}")")")")/.env"

# By setting a permanent password, the user's status will also be updated to
# `Confirmed`.
# See https://awscli.amazonaws.com/v2/documentation/api/latest/reference/cognito-idp/admin-set-user-password.html.
aws cognito-idp admin-set-user-password \
  --user-pool-id "$AWS_COGNITO_USER_POOL_ID" \
  --username "$AWS_COGNITO_USER_POOL_USERNAME" \
  --password "$AWS_COGNITO_USER_POOL_PASSWORD" \
  --permanent

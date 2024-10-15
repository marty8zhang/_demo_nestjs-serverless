#!/bin/bash
set -Eeuo pipefail

# Load the environment variables that cannot be easily determined by code.
source "$(dirname "$(dirname "$(realpath "${BASH_SOURCE[0]}")")")/.env"

SLS_DEPLOYMENT_NAME="$SLS_STAGE_NAME-$SLS_SERVICE_NAME"

AWS_COGNITO_USER_POOL_ID=$(aws cognito-idp list-user-pools \
  --max-results 10 \
  --query "UserPools[?Name=='$SLS_DEPLOYMENT_NAME'].Id" \
  --output text)
printf "Obtained User Pool Id: %s\n" "$AWS_COGNITO_USER_POOL_ID"

AWS_COGNITO_CLIENT_ID=$(aws cognito-idp list-user-pool-clients \
  --user-pool-id "$AWS_COGNITO_USER_POOL_ID" \
  --query UserPoolClients[0].ClientId \
  --output text)
printf "Obtained User Pool Client Id: %s\n" "$AWS_COGNITO_CLIENT_ID"

AWS_API_GATEWAY_REST_API_ID=$(aws apigateway get-rest-apis \
  --query "items[?name=='$SLS_DEPLOYMENT_NAME'].id" \
  --output text)
printf "Obtained API Gateway Rest API Id: %s\n" "$AWS_API_GATEWAY_REST_API_ID"
AWS_API_GATEWAY_REST_API_BASE_URL="https://$AWS_API_GATEWAY_REST_API_ID.execute-api.$AWS_REGION.amazonaws.com/$SLS_STAGE_NAME"
printf "Constructed API Gateway Rest API base URL: %s\n" \
  "$AWS_API_GATEWAY_REST_API_BASE_URL"

ENV_FILE="$(dirname "$(dirname "$(realpath "${BASH_SOURCE[0]}")")")/.env"
sed -i "s/\(AWS_COGNITO_USER_POOL_ID=\).*/\1$AWS_COGNITO_USER_POOL_ID/" "$ENV_FILE"
sed -i "s/\(AWS_COGNITO_CLIENT_ID=\).*/\1$AWS_COGNITO_CLIENT_ID/" "$ENV_FILE"
sed -i "s|\(AWS_API_GATEWAY_REST_API_BASE_URL=\).*|\1$AWS_API_GATEWAY_REST_API_BASE_URL|" "$ENV_FILE"

printf "\nUpdated \`.env\`:\n"
printf -- "---------- Begin of File ----------\n"
cat "$ENV_FILE"
printf -- "---------- End of File ----------\n"

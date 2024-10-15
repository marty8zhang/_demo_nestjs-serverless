#!/bin/bash
set -Eeuo pipefail

AWS_COGNITO_USER_POOL_ID=$(aws cognito-idp list-user-pools --max-results 10 \
 --query "UserPools[?Name == 'dev-demo-nestjs-serverless'].Id" --output text)
printf "Obtained User Pool Id: %s\n" "$AWS_COGNITO_USER_POOL_ID"

AWS_COGNITO_CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id ap-southeast-2_qxu5qxutg --output text --query UserPoolClients[0].ClientId)
printf "Obtained User Pool Client Id: %s\n" "$AWS_COGNITO_CLIENT_ID"

ENV_FILE="$(dirname "$(dirname "$(realpath "${BASH_SOURCE[0]}")")")/.env"
sed -i "s/\(AWS_COGNITO_USER_POOL_ID=\).*/\1$AWS_COGNITO_USER_POOL_ID/" "$ENV_FILE"
sed -i "s/\(AWS_COGNITO_CLIENT_ID=\).*/\1$AWS_COGNITO_CLIENT_ID/" "$ENV_FILE"

printf "\nUpdated \`.env\`:\n"
printf -- "---------- Begin of File ----------\n"
cat "$ENV_FILE"
printf -- "---------- End of File ----------\n"

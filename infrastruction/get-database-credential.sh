#!/bin/bash
set -euo pipefail

function get-database-credential() {
  if [ $# -eq 0 ]
    then
      printf "Error: A key name must be supplied.\n"
      printf "Usage: get-database-credential <key-name>\n"
      printf "Example: get-database-credential username"
      exit 1
  fi

  result=$(aws secretsmanager get-secret-value \
    --secret-id prod/earthquake-list/mongo \
    --query SecretString \
    --output text \
    --profile profile-egghdz-demo \
    | jq --raw-output ".$1")

  if [ "$result" = "null" ]
    then
      printf "Error: No value found for \`%s\`." "$1"
      exit 1
  fi

  echo "$result"
}

function get-database-credential() {
  if [ $# -eq 0 ]
    then
      printf "Error: A key name hasn't been supplied.\n" 1>&2
      printf "Usage: get-database-credential <key-name>\n" 1>&2
      printf "Example: get-database-credential username\n" 1>&2
      exit 1
  fi

  result=$(aws secretsmanager get-secret-value \
    --secret-id "$AWS_SM_SECRET_ID_DATABASE" \
    --query SecretString \
    --output text \
    --profile profile-egghdz-demo \
    | jq --raw-output ".$1") || exit 1

  if [ "$result" = "null" ]
    then
      printf "Error: No value found for \`%s\`.\n" "$1" 1>&2
      exit 1
  fi

  echo "$result"
}

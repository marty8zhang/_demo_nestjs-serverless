# Infrastructure

- [Serverless Framework](https://www.serverless.com) integrated with AWS.
    - AWS account credentials are managed via [IAM Identity Center](https://aws.amazon.com/iam/identity-center) and
      `aws sso`.
- Serverless [NestJS](https://nestjs.com) acts as the backend and runs as a Lambda function, which has been given the
  access to resources in the target VPC that the database sits in.
    - `webpack` is used to transpile the source code into a single JavaScript file for deployment.
- Dockerised MongoDB server manually ran in a private EC2 instance.
    - See `infrastruction/start-mongo.sh` for the example starting script.
    - Database credentials stored in [Secrets Manager](https://aws.amazon.com/secrets-manager/).
- A Public NAT gateway, deployed by Serverless Framework, provides the existing private EC2 instance with Internet
  access.
    - See `docs/public-nat-gateway.drawio` for details.

# Compile & Run

```bash
$ pnpm install
```

The local development environment relies on a local MongoDB server. Docker
Compose can be used to spin it up.
**Note:** Before starting the local development environment, comment these lines
out in `serverless.yml`, because we don't want to use the "live" database
credentials from AWS Secrets Manager. Instead, database credentials will be
loaded from `.env` locally.

```yaml
DB_HOST: ${self:custom.db-credentials.host}
DB_PORT: ${self:custom.db-credentials.port}
DB_USERNAME: ${self:custom.db-credentials.username}
DB_PASSWORD: ${self:custom.db-credentials.password}
DB_DBNAME: ${self:custom.db-credentials.dbname}
```

```bash
$ docker compose up -d
```

```bash
# Local testing - start the Serverless Framework offline mode
$ pnpm sls:start
```

# Lint & Format

```bash
$ pnpm lint && pnpm format
```

# Run Tests

```bash
# Unit tests
$ pnpm run test
```

```bash
# E2E tests
$ pnpm run test:e2e
```

```bash
# Test coverage
$ pnpm run test:cov
```

# Deployment

```bash
$ aws sso login
```

```bash
$ pnpm sls:deploy
```

```bash
# Remove the deployment and release all resources.
$ pnpm sls:remove
```

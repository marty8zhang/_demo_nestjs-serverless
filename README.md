# TODOs

- A simple frontend that works with backend API authentication/authorisation.

# Infrastructure

- This project integrates
  with [Serverless Framework](https://www.serverless.com) and AWS.
    - AWS account credentials are managed
      via [IAM Identity Center](https://aws.amazon.com/iam/identity-center) and
      `aws sso`.
- Serverless [NestJS](https://nestjs.com) acts as the backend and runs as a
  Lambda function.
    - The Lambda function has been provided with the access to resources in the
      target VPC, where the database sits in, via `serverless.yml`.
    - `webpack` is used to transpile the source code into a single JavaScript
      file for deployment. [This drastically improves the cold start time of
      Lambda.](https://docs.nestjs.com/faq/serverless#benchmarks)
    - The backend is made public accessible via API Gateway with a Cognito
      authoriser. Cognito ID token (rather than access token) should be used for
      authentication/authorisation in the current configuration.
- A Dockerised MongoDB server, which provides the backend database, is manually
  run in a private EC2 instance.
    - Database credentials are stored
      in [Secrets Manager](https://aws.amazon.com/secrets-manager/).
    - A Public NAT gateway, also deployed by Serverless Framework, provides the
      existing private EC2 instance with Internet access. See
      `docs/public-nat-gateway.drawio` for details.
      **Note:** The Internet access isn't for hosting the database server, but
      for installing dependencies and retrieving AWS Secrets Manager secrets
      inside the private EC2 instance, etc.

# Preparation

1. Install Node.js dependencies first:
   ```bash
   $ pnpm install
   ```
2. Start a new or existing private EC2 instance.
3. Copy `.env.example` as `.env` and fill in the missing values. Fill in `AWS_*`
   values according to the actual AWS resources; fill in `DB_*` values for local
   development (Serverless Offline mode) only.
   **Note:** Some `AWS_*` values can only be obtained after deployment.
4. Create a secret in AWS Secrets Manager with the key names and values of the
   MongoDB database credentials as shown below:
   ```json
   {
     "username": "...",
     "password": "...",
     "host": "...",
     "port": "...",
     "dbname": "..."
   }
   ```
   **Note:** The `host` should be the private IP address of the private EC2
   instance.
5. Deploy the project by running: `pnpm sls:deploy`. Check out
   the [Deployment](#deployment) section below for more details.
6. Use the same database credentials set in the previous step and set up a
   MongoDB server inside the private EC2 instance and expose the service within
   the VPC, e.g., with correct Security Group configurations and so on.
    - Security Group needs to be set up manually.
    - Some shell scripts have already been written to help with running a
      Dockerised MongoDB server in the instance. They can be found in
      `infrastructure/mongo`, but some manual work is still required. E.g.,
      copying the scripts into the instance, making them executable, setting up
      the environment variable, etc.
7. Run `infrastructure/cognito/activate-demo-user.sh`.

## Local Development Environment

The local development environment relies on a local MongoDB server. Docker
Compose can be used to spin it up.
**Note:** Before starting the local development environment, comment these lines
out in `serverless.yml`, because the "live" database credentials from AWS
Secrets Manager should not be used. Instead, database credentials will be loaded
from `.env` locally.

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

# Run - Local Development & Testing

Compile the source code and start the Serverless Framework offline mode:

```bash
$ pnpm sls:start
```

# Lint & Format

```bash
$ pnpm lint && pnpm format
```

# Run Tests

```bash
# Unit tests.
$ pnpm run test
```

```bash
# E2E tests.
$ pnpm run test:e2e
```

```bash
# Test coverage.
$ pnpm run test:cov
```

# Deployment

If an AWS SSO profile hasn't been configured before, run:

```bash
$ aws configure sso
```

Log in with the profile created in the previous step, so that the "live"
database credentials can be retrieved and set during the deployment process:

```bash
$ aws sso login --profile your-profile-name
```

Compile and deploy:

```bash
$ pnpm sls:deploy
```

Remove the deployment and release all AWS resources:

```bash
$ pnpm sls:remove
```

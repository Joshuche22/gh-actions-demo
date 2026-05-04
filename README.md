# CI/CD Pipeline — GitHub Actions

A production-grade CI/CD pipeline built with GitHub Actions

## Pipeline Overview
Push/PR → Test → Security Scan → Build & Push → Deploy to ECS
↓
Terraform Plan (PRs only)
↓
Slack notification on failure

## Pipeline Jobs

| Job | Trigger | Purpose |
|-----|---------|---------|
| Test | Push + PR | Runs Node.js tests and linting |
| Security Scan | After test | Trivy scans image for CRITICAL/HIGH CVEs |
| Build and Push | Main branch only | Builds Docker image and pushes to Amazon ECR |
| Terraform Plan | PRs only | Runs terraform plan and posts output as PR comment |
| Deploy to ECS | Main branch only | Updates ECS task definition and deploys |
| Notify | On failure | Sends Slack alert with branch, commit and author |

## Key Features

### Trivy security scanning
Every image is scanned for vulnerabilities before it reaches the registry. The pipeline fails on CRITICAL or HIGH severity findings, preventing vulnerable images from being deployed.

### Terraform plan on PRs
When a pull request is opened, the pipeline automatically runs `terraform plan` and posts the output as a PR comment. Engineers can review infrastructure changes alongside code changes before merging.

### ECR instead of public registry
Images are pushed to Amazon ECR — a private, encrypted registry — rather than a public Docker Hub repository. Access is controlled via IAM.

### Docker layer caching
GitHub Actions cache is used to speed up Docker builds. Only changed layers are rebuilt, reducing build times significantly on repeated runs.

### ECS rolling deployment
The pipeline updates the ECS task definition with the new image tag and waits for service stability before marking the deployment as successful. If the service fails to stabilise, the pipeline fails and triggers a Slack alert.

### Environment protection
The deploy job uses a GitHub Actions environment called `dev` — this allows environment-specific secrets and optional manual approval gates before deployment.

## Tech Stack

- Node.js 18
- Docker
- Amazon ECR
- Amazon ECS
- Terraform >= 1.5.0
- GitHub Actions
- Trivy (Aqua Security)
- Slack

## Secrets Required

| Secret | Purpose |
|--------|---------|
| `AWS_ACCESS_KEY_ID` | AWS authentication |
| `AWS_SECRET_ACCESS_KEY` | AWS authentication |
| `DOCKERHUB_USERNAME` | Docker Hub fallback |
| `DOCKERHUB_TOKEN` | Docker Hub fallback |
| `SLACK_WEBHOOK_URL` | Failure notifications |
> **Note:** The Test and Security Scan stages run without AWS credentials. The Build, Push, Deploy and Notify stages require valid AWS credentials and a Slack webhook to pass end-to-end.
## Author

Benedict Korie — [LinkedIn](https://linkedin.com/in/benedict-chijindu-korie-4b29a837b) · [GitHub](https://github.com/Joshuche22)
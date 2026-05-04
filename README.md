# CI/CD Pipeline — GitHub Actions

A production-grade CI/CD pipeline built with GitHub Actions, demonstrating an automated workflow for a containerised Node.js application.

## Pipeline Overview
Push/PR → Test → Security Scan → Build & Push to Docker Hub → Deploy

## Pipeline Jobs

| Job | Trigger | Purpose |
|-----|---------|---------|
| Test | Push + PR | Runs Node.js unit tests with Jest and linting with ESLint |
| Security Scan | After test | Trivy scans the Docker image for CRITICAL/HIGH CVEs |
| Build and Push | Main branch only | Builds Docker image and pushes to Docker Hub |
| Terraform Plan | PRs only | Runs terraform validate against ECS infrastructure |
| Deploy | Main branch only | Confirms deployed image tag and deployment details |

## Key Features

### Trivy security scanning
Every image is scanned for vulnerabilities before it reaches the registry. The pipeline reports CRITICAL and HIGH severity findings without blocking the build — giving full visibility of any vulnerabilities in the base image.

### Real Jest test suite
Five test suites cover every application endpoint — verifying status codes, response shapes, and content types. Coverage reporting is enabled on every run.

### Docker Hub image registry
Images are built and pushed to Docker Hub with two tags — latest and the commit SHA. The SHA tag ensures every deployment is traceable back to an exact commit.

### Terraform validation on PRs
When a pull request is opened, the pipeline initialises and validates the Terraform configuration in the terraform/ directory — catching infrastructure errors before they reach main.

### Production-ready Node.js application
The application exposes four endpoints following production service contracts:

| Endpoint | Purpose |
|----------|---------|
| GET / | Returns service name and version |
| GET /health | Health check — used by load balancers |
| GET /ready | Readiness check — signals service is ready for traffic |
| GET /metrics | Prometheus-format metrics |

### Hardened Dockerfile
- node:18-alpine base image — minimal attack surface
- Non-root user — container runs as appuser not root
- HEALTHCHECK instruction — orchestrator-native health monitoring
- Production-only dependencies — dev tools excluded from image

## Tech Stack

- Node.js 18
- Jest + Supertest
- Docker
- Docker Hub
- Terraform >= 1.5.0
- GitHub Actions
- Trivy (Aqua Security)
- ESLint

## Secrets Required

| Secret | Purpose |
|--------|---------|
| `DOCKERHUB_USERNAME` | Docker Hub authentication |
| `DOCKERHUB_TOKEN` | Docker Hub authentication |

## Project Structure
gh-actions-demo/
├── .github/workflows/ci-cd.yml  # Pipeline definition
├── terraform/                    # ECS infrastructure
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── app.js                        # Node.js service
├── app.test.js                   # Jest test suite
├── Dockerfile                    # Hardened container image
└── package.json

## Author

Benedict Korie — [LinkedIn](https://linkedin.com/in/benedict-chijindu-korie-4b29a837b) · [GitHub](https://github.com/Joshuche22)
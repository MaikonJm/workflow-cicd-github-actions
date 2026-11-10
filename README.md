# CI/CD Pipeline with GitHub Actions: Node.js API

> A small Node.js API taken through a full **CI/CD** flow: automated tests on every change, a Docker image smoke-tested in the pipeline, and publication to **GitHub Container Registry** from `main`. The API exposes **Prometheus metrics** out of the box.

![Node.js](https://img.shields.io/badge/Node.js_20-339933?logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white)
![CI/CD](https://github.com/MaikonJm/workflow-cicd-github-actions/actions/workflows/ci-cd.yml/badge.svg)

## TL;DR

| | |
|---|---|
| **What** | Express API (`/health`, `/data`, `/metrics`) with Jest + Supertest tests and a two-stage pipeline |
| **Stack** | Node.js 20 · Express · Jest · Docker · GitHub Actions · GHCR · prom-client |
| **Result** | Every push/PR is tested and its container is smoke-tested; `main` publishes a versioned image (`:<sha>` + `:latest`) |

## Pipeline

```text
push / PR ──► test ─────────────► build-and-push
              npm ci                docker build
              jest                  smoke test (/health, /metrics)
                                    push to GHCR  ← only on main
```

### Key design decisions

- **Two jobs with `needs`.** The image is only built if tests pass.
- **Smoke test the real container.** Unit tests prove the code works; running the image and curling `/health` and `/metrics` proves the *artifact* works.
- **Publish only from `main`.** Pull requests run the full validation but never push images.
- **Images tagged with the commit SHA.** Every deployed version is traceable back to its exact commit; `latest` is just a convenience pointer.
- **`GITHUB_TOKEN` with least privilege.** `contents: read` by default; `packages: write` only for the job that pushes.
- **Lean, non-root image.** `node:20-alpine`, production dependencies only via `npm ci --omit=dev`, runs as the `node` user, with a Docker `HEALTHCHECK`.

## API

| Endpoint | Description |
|---|---|
| `GET /health` | Liveness check, returns `OK` |
| `GET /data` | Sample JSON payload |
| `GET /metrics` | Prometheus metrics (process CPU, memory, event loop, GC) |

## How to run

```bash
# local
npm ci
npm test
npm start            # http://localhost:3000

# docker
docker build -t node-api .
docker run -p 3000:3000 node-api
curl localhost:3000/metrics
```

Pull the published image:

```bash
docker pull ghcr.io/maikonjm/node-api-cicd:latest
```

## Monitoring

The `/metrics` endpoint is ready to be scraped by Prometheus:

```yaml
scrape_configs:
  - job_name: node-api
    static_configs:
      - targets: ["localhost:3000"]
```

A Prometheus + Grafana stack is not included in this repository yet (see Roadmap).

## Roadmap

- [ ] `docker-compose.yml` with Prometheus + Grafana and a ready dashboard
- [ ] Custom metrics (request count and latency per route)
- [ ] Deploy stage (e.g. AWS App Runner or ECS) with manual approval
- [ ] Image vulnerability scan (Trivy) in the pipeline

---

**Maikon Marquez** · Cloud & DevOps Engineer · [LinkedIn](https://www.linkedin.com/in/maikon-marquez) · [Medium](https://medium.com/@maikonjm)

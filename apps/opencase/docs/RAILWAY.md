# Railway — CASE server only

Deploy **just** the OpenCASE publishing API (`apps/opencase`). Same shape as a
typical “dev” API-only deploy: **no** Traefik, Editor, Mailpit, or Keycloak
sidecar.

The process starts and serves CASE routes with file storage under
`CASE_DATA_DIR`. Keycloak is **not required** for the server to listen.

| Include | Skip |
|---------|------|
| `apps/opencase` + production `Dockerfile` | Root monorepo `docker-compose*.yml` |
| Volume at `/app/data` | Editor / Traefik / Mailpit / Keycloak |

## Railway setup

1. New project → deploy from GitHub → repo `DigiCred-Holdings/OpenCASE`.
2. **Root Directory:** `apps/opencase`.
3. Build via `railway.toml` → production `Dockerfile` (source baked in).
4. Volume mounted at `/app/data`.
5. Env (minimal):

| Variable | Value |
|----------|--------|
| `PORT` | Set by Railway |
| `CASE_DATA_DIR` | `/app/data` |
| `NODE_ENV` | `production` (set by the Dockerfile) — **skips Keycloak bootstrap by default** |

With `NODE_ENV=production`, the server does **not** wait on Keycloak. You should see
`KEYCLOAK_BOOTSTRAP_ENABLED=false — skipping Keycloak bootstrap` (or the equivalent
default) and then `CASE provider listening` almost immediately.

To force bootstrap against an external Keycloak, set `KEYCLOAK_BOOTSTRAP_ENABLED=true`.

### When you add auth later

Management routes (`/management/...`, including CFPackage import) need a Bearer
JWT from an OIDC issuer. Then set `OIDC_ISSUER_URL` (and Keycloak admin vars if
you use Keycloak for tenant provisioning), and set
`KEYCLOAK_BOOTSTRAP_ENABLED=true` if that issuer should be bootstrapped on boot.

### Health

```
GET https://<your-railway-domain>/health
```

### Import marketplace CFPackages (needs auth)

```bash
export OPENCASE_BASE_URL=https://<your-railway-domain>
export OPENCASE_TENANT_ID=<tenantId>
export OPENCASE_TOKEN=<bearer>

scripts/case-export/.venv/bin/python scripts/case-export/import_opencase.py
```

## Local check (API only)

```bash
cd apps/opencase
docker build -t opencase-api .
docker run --rm -p 8080:8080 \
  -e PORT=8080 \
  -e CASE_DATA_DIR=/app/data \
  -e KEYCLOAK_BOOTSTRAP_ENABLED=false \
  -v opencase-data:/app/data \
  opencase-api
```

type AppConfig = {
  opencaseBaseUrl: string
  oidcAuthority: string
  oidcClientIdPrefix: string
  /** When set, skip tenant lookup and sign in directly with this tenant. */
  defaultTenantId: string | null
  /**
   * When true, skip OIDC and treat the user as signed in as `defaultTenantId`
   * (or "demo"). Pair with OpenCASE ALLOW_ANONYMOUS_MANAGEMENT=true to save.
   */
  anonymousAuth: boolean
}

function readRequiredEnv(key: string, fallback?: string): string {
  const value = (import.meta.env[key] as unknown as string | undefined) ?? fallback
  if (!value) throw new Error(`Missing required env var: ${key}`)
  return value
}

function readOptionalEnv(key: string): string | null {
  const value = (import.meta.env[key] as unknown as string | undefined) ?? null
  return value?.trim() || null
}

function readBoolEnv(key: string, fallback = false): boolean {
  const raw = (import.meta.env[key] as unknown as string | undefined)?.trim().toLowerCase()
  if (raw === undefined || raw === '') return fallback
  return raw === 'true' || raw === '1' || raw === 'yes'
}

export function getAppConfig(): AppConfig {
  const anonymousAuth = readBoolEnv('VITE_ANONYMOUS_AUTH', false)
  return {
    // Defaults match `docs/backend_intro.md` for local dev.
    opencaseBaseUrl: readRequiredEnv('VITE_OPENCASE_BASE_URL', 'http://localhost:8080'),
    // OIDC authority unused when anonymousAuth is on — keep a placeholder for config shape.
    oidcAuthority: readRequiredEnv(
      'VITE_OIDC_AUTHORITY',
      anonymousAuth ? 'http://localhost/anonymous' : 'http://localhost:8081/realms/opencase',
    ),
    oidcClientIdPrefix: readRequiredEnv('VITE_OIDC_CLIENT_ID_PREFIX', 'tenant-'),
    defaultTenantId: readOptionalEnv('VITE_DEFAULT_TENANT_ID'),
    anonymousAuth,
  }
}


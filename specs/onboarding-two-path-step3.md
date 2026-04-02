# Spec: Two-Path Step 3 Onboarding ("AI Assistant" vs "Automation Platform")

## Context

Step 3 of the LinkMCP onboarding (`/org/{orgId}/setup`) currently shows tabs for MCP clients (Claude Desktop, Claude Code, Cursor, Windsurf, Codex). Users coming from automation platforms like n8n, Make, or Zapier need a **Personal Access Token (PAT)**, not the MCP server URL. They currently have no path through onboarding — they must skip setup, find Settings > API Tokens (which doesn't exist in the UI yet), and figure it out themselves.

## Goal

Replace the single tab row in step 3 with a two-path selector:
- **Path A: "AI Assistant"** — existing MCP client flow (Claude, Cursor, etc.)
- **Path B: "Automation Platform"** — generates a PAT inline, one-click copy

Also support a `?from=` query parameter so external links (e.g., from the n8n credential modal) can auto-select the correct path.

## Files to Modify

| File | Change |
|------|--------|
| `frontend/src/app/org/[orgId]/setup/page.tsx` | Read `?from=` param, pass to QuickConnect |
| `frontend/src/components/quick-connect.tsx` | Add two-path selector above existing tabs |
| `frontend/src/hooks/use-auth.ts` | Add `useCreateToken()` and `useTokens()` hooks |
| `frontend/src/app/org/[orgId]/setup/page.tsx` | Update completion detection for PAT path |

### New files

| File | Purpose |
|------|---------|
| `frontend/src/components/api-token-connect.tsx` | The "Automation Platform" path component |

## Detailed Implementation

### 1. Read `?from=` query parameter

**File:** `frontend/src/app/org/[orgId]/setup/page.tsx`

Read the `from` query parameter from the URL. Pass it down to the step 3 content.

```typescript
// In the SetupPage component
const searchParams = useSearchParams();
const fromParam = searchParams.get("from"); 
// Expected values: "n8n", "make", "zapier", or null
```

Map known `from` values to the correct initial path:

```typescript
const initialPath: "ai" | "automation" | null = 
  fromParam && ["n8n", "make", "zapier", "pipedream", "activepieces"].includes(fromParam)
    ? "automation"
    : null; // null = let user choose
```

Pass `initialPath` to the QuickConnect component.

### 2. Two-path selector in QuickConnect

**File:** `frontend/src/components/quick-connect.tsx`

Replace the current direct-to-tabs layout with a path selector screen.

**State:**
```typescript
const [selectedPath, setSelectedPath] = useState<"ai" | "automation" | null>(
  props.initialPath ?? null
);
```

**When `selectedPath` is null**, show two cards:

```
┌──────────────────────────┐  ┌──────────────────────────┐
│  🤖 AI Assistant         │  │  ⚡ Automation Platform   │
│                          │  │                          │
│  Claude, Cursor,         │  │  n8n, Make, Zapier,      │
│  Windsurf, Codex         │  │  or any API client       │
│                          │  │                          │
│  Uses MCP protocol       │  │  Uses API token          │
└──────────────────────────┘  └──────────────────────────┘
```

Use the existing card/button styling from the codebase. Each card is a clickable area that sets `selectedPath`.

**When `selectedPath === "ai"`**, show the existing tabs UI (Claude Desktop, Claude Code, Cursor, Windsurf, Codex) exactly as today. Add a "< Back" link above to return to path selection.

**When `selectedPath === "automation"`**, render the new `<ApiTokenConnect />` component. Add a "< Back" link above to return to path selection.

**When `initialPath` is set** (from `?from=` param), skip the card selector and go directly to the appropriate path. Still show the "< Back" link.

### 3. New ApiTokenConnect component

**File:** `frontend/src/components/api-token-connect.tsx`

This component handles the entire PAT creation flow inline — no navigation needed.

**Props:**
```typescript
interface ApiTokenConnectProps {
  from?: string | null; // "n8n", "make", etc. — for contextual messaging
}
```

**States:**
1. **Initial** — show "Generate Token" button
2. **Token created** — show token value + copy button + success message

**UI (initial state):**
```
Your API token lets you connect LinkMCP to automation platforms.

[Generate API Token]
```

If `from` is provided, show contextual text:
```
Your API token lets you connect LinkMCP to n8n.

[Generate API Token]
```

**UI (after token creation):**
```
Your API token (shown once — copy it now):

┌─────────────────────────────────────────┐
│ lmcp_a7x9Bk2m...Q2mF                   │  [📋 Copy]
└─────────────────────────────────────────┘

✅ Token copied!

Paste this token into your n8n LinkMCP credential, then click Save.

[Generate another token]
```

The contextual message adapts based on `from`:
- `from=n8n`: "Paste this token into your **n8n** LinkMCP credential, then click Save."
- `from=make`: "Paste this token into your **Make** LinkMCP connection."
- `from=zapier`: "Paste this token into your **Zapier** LinkMCP connection."
- `from=null` or unknown: "Paste this token into your automation platform's LinkMCP credential."

**Token creation logic:**
```typescript
import { useCreateToken } from "@/hooks/use-auth";

const createToken = useCreateToken();

const handleCreate = async () => {
  const result = await createToken.mutateAsync({
    name: from ? `${from} integration` : "Automation integration",
    expiresIn: "1y",
  });
  setToken(result.token); // the plaintext token, shown only once
};
```

**Copy button:** Use `navigator.clipboard.writeText(token)` with a brief "Copied!" confirmation state.

### 4. New auth hooks for token management

**File:** `frontend/src/hooks/use-auth.ts`

Add two new hooks using the existing `apiClient` and React Query patterns in the file:

```typescript
// Create a new PAT
export function useCreateToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; expiresIn: string }) => {
      const response = await apiClient.post<{
        id: string;
        name: string;
        token: string; // plaintext, shown only once
        prefix: string;
        expiresAt: string;
      }>("/tokens", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
    },
  });
}

// List existing tokens (for future settings page)
export function useTokens() {
  return useQuery({
    queryKey: ["tokens"],
    queryFn: () =>
      apiClient.get<{
        tokens: Array<{
          id: string;
          name: string;
          prefix: string;
          expiresAt: string;
          lastUsedAt: string | null;
          createdAt: string;
        }>;
      }>("/tokens"),
  });
}
```

The backend endpoints already exist:
- `POST /api/v1/tokens` — creates a PAT, returns plaintext token once
- `GET /api/v1/tokens` — lists user's tokens (prefix only, not plaintext)
- `DELETE /api/v1/tokens/:tokenId` — revokes a token

### 5. Step 3 completion detection for automation path

**File:** `frontend/src/app/org/[orgId]/setup/page.tsx`

Currently, step 3 completion is detected by polling MCP activity (checking if `status !== "never_connected"`). For the automation path, the step should be marked complete when a token has been created.

Update the completion logic:

```typescript
// Existing: MCP activity polling for AI assistant path
const { data: mcpStatus } = useMcpActivity({ enabled: step3IsActive });
const aiToolConnected = mcpStatus?.status !== "never_connected";

// New: Token creation for automation path
const [tokenCreated, setTokenCreated] = useState(false);

// Step 3 is complete if either path succeeds
const step3Complete = aiToolConnected || tokenCreated;
```

Pass `setTokenCreated` callback to `<ApiTokenConnect onTokenCreated={() => setTokenCreated(true)} />`.

### 6. Update n8n credential link

**File:** (in the n8n-nodes-linkmcp repo, already done separately)

The credential notice link should include `?from=n8n`:

```
https://app.linkmcp.io/login?from=n8n
```

The `from` parameter needs to survive the login flow. Two approaches:

**Option A (simpler):** Store `from` in `sessionStorage` on the login page, retrieve it on the setup page.

In `frontend/src/app/login/page.tsx`:
```typescript
const searchParams = useSearchParams();
const from = searchParams.get("from");
if (from) {
  sessionStorage.setItem("linkmcp_from", from);
}
```

In `frontend/src/app/org/[orgId]/setup/page.tsx`:
```typescript
const fromParam = searchParams.get("from") 
  ?? (typeof window !== "undefined" ? sessionStorage.getItem("linkmcp_from") : null);

// Clean up after reading
useEffect(() => {
  if (fromParam) sessionStorage.removeItem("linkmcp_from");
}, []);
```

**Option B:** Pass `from` through the redirect chain as a query parameter. This is more explicit but requires threading it through login → verify → create-org → setup. Option A is simpler and the codebase already uses sessionStorage for the OAuth flow (`linkmcp_oauth_session`).

## Visual Design

### Path selector (step 3 initial state)

```
Step 3: Add LinkMCP to your tool

Pick how you'll connect:

┌──────────────────────────┐  ┌──────────────────────────┐
│                          │  │                          │
│       🤖                 │  │       ⚡                  │
│                          │  │                          │
│   AI Assistant           │  │   Automation Platform    │
│                          │  │                          │
│   Claude, Cursor,        │  │   n8n, Make, Zapier,     │
│   Windsurf, Codex        │  │   or any API client      │
│                          │  │                          │
└──────────────────────────┘  └──────────────────────────┘
```

Use the same card styling as used elsewhere in the setup flow. Hover state, selected state with border highlight.

### Automation path (after selecting)

```
← Back

Your API token lets you connect LinkMCP to n8n.

┌────────────────────────────────────┐
│  [Generate API Token]              │
└────────────────────────────────────┘
```

After token creation:

```
← Back

Your API token (shown once — copy it now):

┌──────────────────────────────────────────────────┐
│ lmcp_a7x9Bk2mXpQ...                    [📋 Copy]│
└──────────────────────────────────────────────────┘

✅ Copied to clipboard!

Paste this token into your n8n LinkMCP credential, then click Save.
```

## Edge Cases

1. **User already has tokens:** Still allow generating a new one. The new one gets a contextual name (e.g., "n8n integration").

2. **Token creation fails (e.g., max 10 active tokens):** Show error inline: "You have too many active tokens. Go to Settings → API Tokens to revoke old ones." (Note: the settings page doesn't exist yet, so for now just show the error message from the API.)

3. **User switches paths:** Clicking "< Back" and selecting the other path works freely. No state is lost — any created token stays valid.

4. **`from` param with unknown value:** Treat as automation path but with generic messaging.

5. **Step 3 already complete (aiToolConnected is true):** Still allow the user to interact with both paths — they might want both an MCP connection AND a PAT.

## Testing

1. Visit `/org/{orgId}/setup` with no query params → see two-card selector
2. Visit `/org/{orgId}/setup?from=n8n` → skip to automation path, "n8n" in messaging
3. Select "AI Assistant" → see existing tabs (no regression)
4. Select "Automation Platform" → generate token → copy → verify token works
5. Click "< Back" from either path → return to card selector
6. Visit `/login?from=n8n` → complete login → arrive at setup → automation path auto-selected

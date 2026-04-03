# LinkMCP n8n Node — Demo Video Script

**Purpose:** Required for n8n manual review / verification  
**Length:** Under 5 minutes, no cuts, one take  
**Tool:** Loom or similar screen recorder  
**Voice-over:** Optional but recommended

## Pre-recording setup

- Local n8n running (`npx n8n-node dev`)
- LinkMCP credential already saved (PAT)
- A LinkedIn profile URL ready (e.g., your own)

---

## Scene 1: Install the node (~30s)

**Action:** Show the node is available — search "linkmcp" in the node panel.

**Voice:** "The LinkMCP community node is installed from npm. The package name is n8n-nodes-linkmcp."

> Since you're using `npx n8n-node dev`, it's already loaded. Just show it appearing in search.

---

## Scene 2: Create workflow + add node (~30s)

**Action:** Create new workflow. Click "+", search "linkmcp", show the actions list.

**Voice:** "LinkMCP for LinkedIn shows up with 24 actions across 8 resources — profiles, companies, search, messaging, connections, posts, enrichment, and account."

---

## Scene 3: Set up credential (~45s)

**Action:** Select "Get account info" (Who Am I). Click "Set up credential".

**Voice:** "Setting up credentials. You need a LinkMCP Personal Access Token. The notice shows the three steps: create a free account, connect your LinkedIn, then create an API token in Settings."

**Action:** Paste your PAT, click Save. Show the credential test succeeding (green checkmark).

**Voice:** "Credential saved and verified."

---

## Scene 4: Test Who Am I (~20s)

**Action:** Click "Execute step". Show the output.

**Voice:** "Who Am I returns my connected LinkedIn account details. The credential works."

---

## Scene 5: Test Get Profile (~45s)

**Action:** Add a new LinkMCP node after the trigger. Select Profile → Get. Paste a LinkedIn URL. Execute.

**Voice:** "Now let's look up a LinkedIn profile. I'll paste a profile URL and execute. We get the full profile back — name, headline, experience, education, skills, and company details."

**Action:** Scroll through the output briefly to show the data richness.

---

## Scene 6: Test Get Company (~30s)

**Action:** Add another LinkMCP node. Select Company → Get. Paste a company URL. Execute.

**Voice:** "Same for companies. Paste a company URL, execute, and we get the full company page data."

---

## Scene 7: Test Find Email (~30s)

**Action:** Add another node. Select Enrichment → Find Email. Fill in first name, last name, company domain. Execute.

**Voice:** "LinkMCP also does contact enrichment. I'll search for a work email by name and company domain. There it is — verified email address returned."

---

## Scene 8: Show as AI agent tool (~45s)

**Action:** Create a new workflow. Add an AI Agent node (or Chat trigger). Connect a LinkMCP node as a tool.

**Voice:** "LinkMCP is also usable as a tool for n8n's AI agents. I'll add it as a tool to an AI agent. The agent can now research LinkedIn profiles, send messages, and search for people — all based on natural language instructions."

**Action:** Show the node connected as a tool (just showing the connection is enough per the requirements).

---

## Scene 9: Wrap up (~15s)

**Action:** Show the full workflow on canvas.

**Voice:** "That's LinkMCP for n8n — 25 LinkedIn tools, profiles, messages, search, enrichment, all from your n8n workflows."

---

## Tips

- No cuts allowed — record in one take
- Move deliberately, don't rush
- If something loads slowly, just wait silently
- Voice-over is optional but speeds up their review
- Total estimated time: ~4 minutes

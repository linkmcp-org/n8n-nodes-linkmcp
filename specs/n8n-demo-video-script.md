# LinkMCP n8n Node — Demo Video Script

**Purpose:** Required for n8n manual review / verification  
**Length:** Under 5 minutes, no cuts, one take  
**Tool:** Loom or similar screen recorder  
**Voice-over:** Optional but recommended

## Pre-recording setup

- Fresh n8n running (node NOT pre-installed — you'll install it on camera)
- LinkMCP PAT ready to paste
- A LinkedIn profile URL ready (someone who has recent posts and a company on their profile)

---

## Scene 1: Install from npm (~30s)

*n8n requirement: "Open your n8n instance and install your node from npm."*

**Action:** Open n8n. Go to Settings → Community Nodes → Install. Type `n8n-nodes-linkmcp`. Click Install. Wait for confirmation.

**Voice:** "Installing the LinkMCP community node from npm. Package name is n8n-nodes-linkmcp, version 0.1.2."

**Action:** Show the installed node in the list.

---

## Scene 2: Create workflow + show the node (~20s)

*n8n requirement: "Create a new workflow and insert your node."*

**Action:** Go back to workflows. Create a new workflow. Click "+", type "linkmcp". Click into the node to show the actions list.

**Voice:** "Here it is — LinkMCP for LinkedIn. 24 actions across profiles, companies, search, messaging, connections, posts, enrichment, and account."

---

## Scene 3: Credentials (~40s)

*n8n requirement: "Set up a new credential and demonstrate that the credential test works."*

**Action:** Pick "Get account info". The node opens. Click "Set up credential."

**Voice:** "You need a Personal Access Token from LinkMCP. Sign up, connect your LinkedIn, create a token in Settings. I already have mine."

**Action:** Paste the PAT. Click Save. Green checkmark appears.

**Voice:** "Credential verified."

**Action:** Click "Execute step." Output shows your account.

**Voice:** "And there's my connected LinkedIn account. Let me build something real."

**Action:** Close the panel, back to canvas.

---

## Scene 4: The pipeline (~2 min)

*n8n requirement: "Demonstrate the functionality of the node by performing the most common actions."*

*One profile lookup feeds two parallel branches — company details and recent posts.*

### 4a — Look up a profile

**Action:** Click "+" after the trigger, add "Get a LinkedIn profile." Paste a profile URL. Execute.

**Voice:** "I'll start with a person. Paste their LinkedIn URL, run it — and I get the full profile. Name, headline, experience, education, skills. And notice — it also gives me their company's LinkedIn URL."

**Action:** Scroll the output briefly. Point at the company URL field.

### 4b — Branch 1: their company

**Action:** Click "+" after the profile node. Add "Get a company profile." Wire the company URL from the previous output using an expression. Execute.

**Voice:** "I'll take that company URL and feed it straight into a company lookup. No copy-paste — the data flows from the previous step. Now I have the company too. Industry, headcount, specialties."

**Action:** Show the company data briefly.

### 4c — Branch 2: their posts

**Action:** Go back to the profile node on canvas. Click its "+" to create a second branch. Add "Get a person's posts." Wire the identifier from the profile output. Execute.

**Voice:** "And from the same profile, a second branch — their recent posts. What they're talking about, how much engagement they're getting."

**Action:** Show the posts output. Scroll to show a few posts with engagement numbers.

### 4d — The full picture

**Action:** Zoom out to show the full workflow on canvas.

**Voice:** "One profile lookup, two automatic branches. Company details and content activity. Everything you'd need to prepare personalized outreach — and it took about a minute to build."

---

## Scene 5: AI agent tool (~30s)

*n8n requirement: "Demonstrate that it can be used as a tool for an AI agent (showing one example action when used as a tool suffices)."*

**Action:** On the canvas, add an AI Agent node. Click "+" on its Tool input. Search "linkmcp". Select "Get a LinkedIn profile." Show it connected to the agent.

**Voice:** "Every LinkMCP action is also available as a tool for n8n's AI agents. I'll connect profile lookup as a tool. The agent can call it based on natural language — you add as many operations as you need."

**Action:** Show the tool node connected to the agent on canvas.

---

## Scene 6: Wrap up (~5s)

**Voice:** "That's LinkMCP for n8n."

---

## Total: ~4 minutes

## Requirements checklist

- [x] 1. Install node from npm (Scene 1)
- [x] 2. Create workflow, insert node (Scene 2)
- [x] 3. Set up credential, show test works (Scene 3)
- [x] 4. Demonstrate most common actions (Scene 4 — profile, company, posts)
- [x] 5. Show as AI agent tool (Scene 5)
- [x] No cuts, one take
- [x] Screen recording with voice-over

## Tips

- Move deliberately, let things load
- Use a real person with recent posts for authentic output
- The branching moment (4c) is the highlight — pause to let it land
- For Scene 5, don't worry about the error triangle on Chat Model — you're just showing the wiring

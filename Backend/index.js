require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uiVersions = new Map();

// --- AGENT PROMPTS (Isolated & Specific) ---

const PLANNER_PROMPT = `You are a UI Planner. Your job is to analyze intent and create a structural blueprint.
AVAILABLE COMPONENTS: Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart.

RULES:
1. Only use the components listed above.
2. Output a JSON object with: layout (grid/flex/sidebar), components (type, props, content), and reasoning.
3. Do not write any code.

User request: {USER_REQUEST}`;

const GENERATOR_PROMPT = `You are a UI Code Generator. Convert the following plan into a valid React component.
PLAN: {PLAN}

RULES:
1. Use ONLY: import { Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart } from './UI'
2. Create a functional component named 'GeneratedUI'.
3. NO inline styles, NO className, NO Tailwind.
4. Return ONLY the code inside markdown blocks.`;

const MODIFIER_PROMPT = `You are a UI Modifier. Incremental changes are preferred over full rewrites.
Current code: {CURRENT_CODE}
Modification request: {USER_REQUEST}

RULES:
1. Preserve existing component logic where possible.
2. Output JSON: { "modifiedCode": "...", "changes": "description of what changed" }.`;

// --- HELPER FUNCTIONS ---

async function callClaude(prompt) {
    try {
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: 4000,
                messages: [{ role: 'user', content: prompt }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                }
            }
        );
        return response.data.content[0].text;
    } catch (error) {
        // Log the actual error for Render monitoring
        console.error("Claude API Error:", error.response?.data || error.message);
        throw new Error(`AI Gateway Error: ${error.response?.data?.error?.message || error.message}`);
    }
}

function parseJSON(text) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('AI failed to return valid structural JSON.');
    return JSON.parse(match[0]);
}

function extractCode(text) {
    const match = text.match(/```(?:jsx|javascript)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : text.trim();
}

function validateUI(code) {
    const allowed = ['Button', 'Card', 'Input', 'Table', 'Modal', 'Sidebar', 'Navbar', 'Chart'];
    const componentRegex = /<([A-Z][a-zA-Z]*)/g;
    const matches = [...code.matchAll(componentRegex)];

    for (const match of matches) {
        if (!allowed.includes(match[1])) {
            throw new Error(`Security Violation: Forbidden component <${match[1]}> detected.`);
        }
    }
    if (/style=|className=/.test(code)) {
        throw new Error('Design Violation: Manual styling is prohibited. Use component props only.');
    }
}

// --- API ENDPOINTS ---

app.post('/api/generate', async (req, res) => {
    try {
        const { userIntent, sessionId } = req.body;
        if (!userIntent) return res.status(400).json({ error: 'Intent is required' });

        // Step 1: Planning
        const planText = await callClaude(PLANNER_PROMPT.replace('{USER_REQUEST}', userIntent));
        const plan = parseJSON(planText);

        // Step 2: Generation
        const codeText = await callClaude(GENERATOR_PROMPT.replace('{PLAN}', JSON.stringify(plan)));
        const code = extractCode(codeText);

        validateUI(code);

        const version = {
            id: Date.now().toString(),
            code,
            explanation: plan.reasoning,
            timestamp: new Date().toISOString()
        };

        if (!uiVersions.has(sessionId)) uiVersions.set(sessionId, []);
        uiVersions.get(sessionId).push(version);

        res.json(version);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/modify', async (req, res) => {
    try {
        const { currentCode, userRequest, sessionId } = req.body;
        
        const responseText = await callClaude(
            MODIFIER_PROMPT.replace('{CURRENT_CODE}', currentCode).replace('{USER_REQUEST}', userRequest)
        );
        const result = parseJSON(responseText);
        const code = extractCode(result.modifiedCode);

        validateUI(code);

        const version = {
            id: Date.now().toString(),
            code,
            explanation: result.changes,
            timestamp: new Date().toISOString()
        };

        if (!uiVersions.has(sessionId)) uiVersions.set(sessionId, []);
        uiVersions.get(sessionId).push(version);

        res.json(version);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/versions/:sessionId', (req, res) => {
    res.json(uiVersions.get(req.params.sessionId) || []);
});

// Ensure the server listens on 0.0.0.0 for Render deployment
app.listen(PORT, '0.0.0.0', () => console.log(`Backend active on port ${PORT}`));
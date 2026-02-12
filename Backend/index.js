require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory storage for UI versions
const uiVersions = new Map();

// --- Agent Prompts (Constants) ---
const PLANNER_PROMPT = `You are a UI Planner. Analyze the user's intent and create a structured plan.
AVAILABLE COMPONENTS: Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart.
RULES: 
1. Only use listed components. 
2. Output JSON: { "layout": "", "components": [], "reasoning": "" }.
User request: {USER_REQUEST}`;

const GENERATOR_PROMPT = `You are a UI Code Generator.
RULES:
1. Use ONLY: import { Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart } from './UI'
2. Export a functional component called GeneratedUI.
3. No inline styles, no custom CSS.
Plan: {PLAN}`;

const MODIFIER_PROMPT = `You are a UI Modifier. 
Modify the code based on: {USER_REQUEST}
Current code: {CURRENT_CODE}
Output JSON: { "modifiedCode": "...", "changes": "..." }`;

// --- Helper Functions ---
async function callClaude(prompt, systemPrompt = '') {
    try {
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-5-sonnet-20240620', // Updated to current stable version
                max_tokens: 4000,
                messages: [{ role: 'user', content: prompt }],
                system: systemPrompt
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
        throw new Error(`Claude API Error: ${error.response?.data?.error?.message || error.message}`);
    }
}

function extractJSON(text) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No valid JSON found in response');
    return JSON.parse(match[0]);
}

function cleanCode(text) {
    // Removes markdown code blocks if present
    return text.replace(/```(?:jsx|javascript|tsx)?\n?([\s\S]*?)```/g, '$1').trim();
}

function validateComponents(code) {
    const allowed = ['Button', 'Card', 'Input', 'Table', 'Modal', 'Sidebar', 'Navbar', 'Chart'];
    const componentRegex = /<([A-Z][a-zA-Z]*)/g;
    const matches = [...code.matchAll(componentRegex)];

    for (const match of matches) {
        if (!allowed.includes(match[1])) {
            throw new Error(`Forbidden component: ${match[1]}`);
        }
    }
    if (code.includes('style=') || code.includes('className=')) {
        throw new Error('Custom styling is strictly prohibited.');
    }
}

// --- API Endpoints ---

app.post('/api/generate', async (req, res) => {
    try {
        const { userIntent, sessionId } = req.body;
        if (!userIntent || !sessionId) return res.status(400).json({ error: 'Missing parameters' });

        const planText = await callClaude(PLANNER_PROMPT.replace('{USER_REQUEST}', userIntent));
        const plan = extractJSON(planText);

        const rawCode = await callClaude(GENERATOR_PROMPT.replace('{PLAN}', JSON.stringify(plan)));
        const code = cleanCode(rawCode);

        validateComponents(code);

        const version = {
            id: Date.now().toString(),
            code,
            plan,
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
        const result = extractJSON(responseText);
        const code = cleanCode(result.modifiedCode);

        validateComponents(code);

        const version = {
            id: Date.now().toString(),
            code,
            changes: result.changes,
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

app.listen(PORT, () => console.log(`Backend active on port ${PORT}`));
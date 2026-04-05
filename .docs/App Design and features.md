


# The Vision: A rhythmic assistant

It's a stateful AI agent that lives on your phone. It understands the messy way in which humans talk about their time and converts it into a structured graph of habits, health, and reflections. 

## Tech Stack

- React Native (Expo)
	- Access to haptics, voice (STT via **Deepgram** through the Python API), and push notifications
- Orchestration: **LangGraph**
- Primary DB: Supabase (PostgreSQL)
- Vector Engine: pgvector (for semantic search across old journal entries)
- Brain: Neo4j (GraphDB)
	- maps correlations (e.g. strength training -> mood: high -> focus: 1 hour)
- Groq (Llama 3.1 70B) — ultra-low latency for a snappy chat experience
- Python **FastAPI** service (agent, STT relay); **Fly.io** recommended for hosting the API (optional for local-only dev)

## AI Pipeline: 

### Intent and Entity extraction: 
- User says "Spent an hour lifting, felt decent"
- pydantic forces the model in to a strict schema
	- entities: Activity: Strength training, Duration: 60m, Sentiment: 0.7
	- normalization: The AI must resolve "an hour" into an integer and "lifting" into a standardized category. 
### Temporal Grounding
- If the user logs at 11 pm "I went for a run in the morning", AI calculates the exact timestamp for "this morning" based on the user's local timezone. This prevents the "log drift" common in basic apps. 

### Graph ingestion 
- Instead of just a row in a table, the AI creates a Node in Neo4j. Entry could be linked to the Monday, Physical Health and Strength Training nodes. 
- "How does my sleep duration on Sunday nights affect my lifting performance on Monday afternoons?"

### Active feedback loop
- If the input is ambiguous, the **LangGraph** agent triggers a follow-up. 

## Mobile architecture and UX:

- Voice-first interface: large **Record** control; audio streams through the **API** to **Deepgram**; transcript updates in real time as the user speaks
- Haptic affirmations: "tick" sensation when the AI successfully parses an entry. 
- Home screen widget that displays a rhythm score, summarizing the AI's current understanding of your day

##  Budget Architecture: 
| **Component**     | **Technology**        | **Monthly Cost** | **Why this one?**                                    |
| ----------------- | --------------------- | ---------------- | ---------------------------------------------------- |
| **Graph DB**      | **Neo4j Aura (Free)** | **$0**           | Best-in-class for causal "Habit → Mood" mapping.     |
| **App Framework** | Expo (React Native)   | $0               | Native mobile feel + easy deployment.                |
| **Backend/DB**    | Supabase (Postgres)   | $0               | Relational integrity for your core metrics.          |
| **Logic**         | LangGraph             | $0               | Handles the "agentic" loops of a personal assistant. |
| **LLM**           | Groq (Llama 3.1)      | $0               | The speed makes the AI feel like a real person.      |
| **Voice-to-Text** | Deepgram              | $0*              | _(Using initial developer credits)._                 |
| **TOTAL**         |                       | **$0.00**        |                                                      |

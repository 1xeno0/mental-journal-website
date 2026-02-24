# **Technical Task: Build "Serene" – An AI-Powered Mental Wellness Journal**

## **Role Overview**

We are looking for a **pragmatic, high-velocity Full Stack Engineer** who treats AI (Cursor, Claude, v0.dev) as a force multiplier. In the Mental Health space, UX must be "calm," and data must be secure. Your mission is to build a functional MVP that demonstrates your ability to ship polished, empathetic software at record speed.

## **1\. Product Requirements Document (Mini-PRD)**

**Product Name:** Serene

**Core Value:** A private, aesthetically pleasing space for users to log their moods and reflections, receiving immediate, empathetic AI-driven insights.

### **A. Landing Page & Onboarding**

* **Hero Section:** High-converting landing page with a "calm" aesthetic. Clearly state the USP (Unique Selling Proposition).  
* **Authentication:** Full Sign-up/Login flow (Email/Password or Social Auth).  
* **Privacy First:** Users must only be able to access their own private journal entries after logging in.

### **B. Mood Journaling & Analytics**

* **Interactive Mood Entry:**  
  * **Mood Selector:** A visual UI (icons/cards) to pick a current state (e.g., Happy, Anxious, Calm, Overwhelmed).  
  * **Contextual Tags:** Multi-select chips for activities (Work, Sleep, Relationships, Fitness, Hobbies).  
  * **Reflective Note:** A text area for the user to write their thoughts (min. 50 characters to trigger AI).  
* **Dynamic Timeline:**  
  * A feed of past entries grouped by date (Today, Yesterday, Last Week).  
  * Color-coded cards based on the logged mood.  
  * Full CRUD: Ability to view, edit, or delete previous entries.  
* **Visual Insights:** A simple weekly summary (e.g., a bar chart showing mood distribution) to help users see patterns.

### **C. AI "Vibe Check"** 

* **Empathetic Analysis:** Upon saving a note, the app sends the text \+ mood \+ tags to an LLM (OpenAI/Anthropic).  
* **System Prompting:** Configure the AI to act as a supportive, non-clinical companion. It should provide a 1-2 sentence "vibe check" or encouragement.  
* **Streaming UI:** Ideally, the AI response should stream in real-time (optional but highly valued).  
* **Safety Guardrails:** Implement basic logic to handle empty/gibberish inputs or highly sensitive "trigger" words with a standard disclaimer.

## **2\. Technical Requirements**

* **Docker:** You **must** include a `Dockerfile` and `docker-compose.yaml` in the root. A reviewer should be able to run `docker-compose up` and have the full environment (App \+ Local DB) running immediately.  
* **Environment Variables:** Provide a `.env.example` file.  
* **README.md:**   
  * Setup instructions (Local & Docker).  
  * Brief architectural and tech stack overview

## **3\. Deliverables**

Please submit the following:

1. **GitHub Repository:** Public repo with a clean, modular structure and commit history.  
2. **Live Demo URL (Optional):** A deployed version of the app 


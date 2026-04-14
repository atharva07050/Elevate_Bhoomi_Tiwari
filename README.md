# Elevate: AI Tech Recruiter & Career Assistant

Elevate is a cutting-edge AI-powered dashboard designed to help technical recruiters intelligently evaluate student performance and automatically generate highly personalized, actionable mentorship and study plans to address core technical weaknesses. Built natively with React and Vite, the platform directly integrates with **Google Gemini 2.5 Flash** to provide dynamically driven reports and remediation steps.

## Features
- **Intelligent Evaluation:** Evaluates candidates and predicts hiring readiness via automated heuristics and deep AI analysis.
- **Dynamic Mentorship Generation:** Automatically provisions a granular syllabus mapping "Risk Levels" against technical weaknesses.
- **AI-driven Formatting Check:** Implements strict machine-readable responses directly mapping from pure natural language inferences leveraging `@google/genai`.
- **Hot Replacement / Fallbacks:** Built-in data-safe rendering that supports zero-downtime mock evaluations when the API drops out.
- **Elegant UI/UX:** Styled natively using robust, modern CSS without bloat, incorporating seamless micro-animations.

## Getting Started

1. **Clone the repository.**
2. **Install dependencies:**  
   `npm install`
3. **Set up API Keys:**  
   Create a `.env` file at the root of the project and add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. **Run the local development server:**  
   `npm run dev`

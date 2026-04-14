// Simulated AI Service to provide a recruiter evaluation
import { GoogleGenAI } from '@google/genai';

const MOCK_DELAY = 1500;

export const generateEvaluation = async (data) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY not set. Falling back to mock data.");
    return new Promise((resolve) => {
      setTimeout(() => {
        // Calculate basic scores
        const aptitude = Number(data.aptitude_score) || 0;
        const technical = Number(data.technical_score) || 0;
        const interview = Number(data.interview_score) || 0;

        // Skill Score Calculation (Aptitude + Technical + Interview weighted)
        const skillScore = Math.round((aptitude * 0.3) + (technical * 0.5) + (interview * 0.2));
        
        // Rough problem solving based on tech + aptitude
        const problemSolvingScore = Math.round((aptitude + technical) / 2);
        
        // Communication score heuristic
        let commScore = interview;
        if (data.communication_feedback?.toLowerCase().includes('good') || data.communication_feedback?.toLowerCase().includes('clear')) {
            commScore = Math.min(100, commScore + 10);
        } else if (data.communication_feedback?.toLowerCase().includes('poor') || data.communication_feedback?.toLowerCase().includes('fast')) {
            commScore = Math.max(0, commScore - 10);
        }

        // Determine hiring status
        let status = "Ready for Placement";
        if (skillScore < 60 || problemSolvingScore < 60) {
            status = "High Risk Candidate";
        } else if (skillScore < 75) {
            status = "Needs Improvement";
        }

        // Format strengths & weaknesses nicely
        const strengths = (data.strong_topics || "").split(',').map(s => s.trim()).filter(Boolean);
        const weaknesses = (data.weak_topics || "").split(',').map(s => s.trim()).filter(Boolean);

        // Construct dynamic summary
        let summary = `The candidate has achieved an overall technical and aptitude skill score of ${skillScore}/100. `;
        if (status === "Ready for Placement") {
            summary += "They demonstrate a strong command of foundational concepts and are extremely capable problem solvers. They communicate effectively and show great promise for immediate deployment in mid-to-senior technical roles.";
        } else if (status === "Needs Improvement") {
            summary += "While they have demonstrated some capability, there are specific areas regarding technical execution and concept mastery that need further refinement before they are fully placement-ready.";
        } else {
            summary += "The candidate struggles with core technical concepts. Considerable remedial effort is necessary before they can be considered for placement opportunities.";
        }

        // Extract improvements
        const improvements = weaknesses.length 
          ? weaknesses.map(w => `Focus heavily on mastering ${w} concepts and edge cases.`)
          : ["Continue exploring advanced system scaling paradigms"];

        resolve({
            name: data.name || "Candidate",
            role: data.role || "Software Engineer",
            subtitle: "Placement Readiness Assessment",
            tagline: "This report provides an AI-driven evaluation of the candidate's placement readiness.",
            
            skillScore,
            communicationScore: commScore,
            problemSolvingScore: problemSolvingScore,
            
            scoreInterpretations: {
              skill: skillScore >= 80 ? "Exceptional grasp of core competencies." : skillScore >= 60 ? "Solid foundation, requires minor polish." : "Needs substantial technical foundation work.",
              communication: commScore >= 80 ? "Articulate and structured." : commScore >= 60 ? "Clear, but lacks advanced presentation skills." : "Often unclear or disjointed.",
              problemSolving: problemSolvingScore >= 80 ? "Rapid and highly optimized logic." : problemSolvingScore >= 60 ? "Capable, but relies on brute force." : "Struggles with algorithmic logic."
            },

            summary,
            strengths: strengths.length ? strengths : ["Algorithm Execution", "System Logic"],
            weaknesses: weaknesses.length ? weaknesses : ["Architectural Design", "Advanced Tooling"],
            improvementSuggestions: improvements,
            
            detailedAnalysis: {
              technical: `The candidate performed with a technical score of ${data.technical_score||0}, showing proficiency in expected syntaxes but demonstrating gaps in deep conceptual abstraction.`,
              communication: `Feedback indicates the candidate is '${data.communication_feedback || "communicative"}'. They should focus on structuring extended technical explanations more securely.`,
              problemSolving: `Achieved an aptitude evaluation of ${data.aptitude_score||0}, which points to an adequate baseline for analytical challenges, though optimizations could be faster.`
            },

            recommendations: {
              shortTerm: ["Complete 3 mock interviews prioritizing structured communication.", "Review the fundamental theory for identified weak topics.", "Attempt 5 easy-level architectural design problems."],
              longTerm: ["Build a full-stack side project implementing CI/CD pipelines.", "Contribute to an open source project to understand large codebases.", "Consistently practice medium-level algorithmic questions."]
            },

            hiringStatus: status,
            hiringDecisionJustification: status === "Ready for Placement" ? "Strong aggregate performance across all vital engineering requirements." : "Significant technical and conceptual gaps prevent operational deployment at this level."
        });
      }, MOCK_DELAY);
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
You are an expert AI Tech Recruiter.
Analyze the following student performance data and generate a professional, structured recruiter evaluation report.

Student Data:
${JSON.stringify(data, null, 2)}

Provide your output as a valid JSON object matching the following structure exactly:
{
  "name": "string",
  "role": "string",
  "subtitle": "Placement Readiness Assessment",
  "tagline": "This report provides an AI-driven evaluation of the candidate's placement readiness.",
  "skillScore": number (0-100),
  "communicationScore": number (0-100),
  "problemSolvingScore": number (0-100),
  "scoreInterpretations": {
    "skill": "string",
    "communication": "string",
    "problemSolving": "string"
  },
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "improvementSuggestions": ["string"],
  "detailedAnalysis": {
    "technical": "string",
    "communication": "string",
    "problemSolving": "string"
  },
  "recommendations": {
    "shortTerm": ["string", "string"],
    "longTerm": ["string"]
  },
  "hiringStatus": "Ready for Placement" | "Needs Improvement" | "High Risk Candidate",
  "hiringDecisionJustification": "string"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Evaluation failed, falling back", error);
    throw error;
  }
};

export const generateMentorPlan = async (weakTopicsString) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const topics = weakTopicsString ? weakTopicsString.split(',').map(s => s.trim()).filter(Boolean) : [];

  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY not set. Falling back to mock data.");
    return new Promise((resolve) => {
      setTimeout(() => {
        const plans = topics.map((topic) => {
          return {
            topic: topic,
            weaknessLevel: "High",
            reason: `A highly critical area in most modern software engineering technical interviews. Getting comfortable with ${topic} is paramount for placement success.`,
            resources: [
              {
                title: `YouTube Tutorials for ${topic}`,
                url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' interview prep tutorial')}`
              },
              {
                title: "Practice Problems on LeetCode",
                url: "https://leetcode.com/problemset/all/"
              }
            ]
          };
        });
        resolve(plans);
      }, MOCK_DELAY);
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
You are an intelligent career assistant integrated into Saarthi AI.

Your task is to analyze a student's performance data, identify weak topics, and recommend high-quality learning resources.

Instructions:
1. Analyze the student's weak areas from:
   - DSA (Data Structures & Algorithms)
   - Frontend Development
   - Other technical domains if available

2. For each weak topic:
   - Suggest 2–3 trusted learning resources
   - Prefer official and high-quality platforms like:
     - LeetCode (for DSA practice)
     - MDN Web Docs (for frontend concepts)
     - W3Schools (for basics)
     - GeeksforGeeks (for explanations)
     - YouTube (only high-quality tutorials)

3. Output format:
   - Topic Name
   - Weakness Level (Low / Medium / High)
   - Recommended Resources (with direct links)
   - Short reason why this resource is helpful

4. Personalization:
   - If student is beginner → suggest basics
   - If intermediate → suggest practice problems
   - If advanced → suggest real-world challenges

5. Keep response:
   - Short
   - Actionable
   - Structured

Below are the student's weak topics to analyze: "${weakTopicsString}"

OUTPUT INSTRUCTIONS:
Despite the example format above, you MUST return a valid JSON array matching this exact schema:
[
  {
    "topic": "string",
    "weaknessLevel": "Low | Medium | High",
    "resources": [
      {
        "title": "string",
        "url": "string"
      }
    ],
    "reason": "string"
  }
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsedResponse = JSON.parse(response.text);
    return Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse];
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback if API fails
    return topics.map(topic => ({
      topic,
      weaknessLevel: "High",
      reason: "Error generating dynamic plan. Study this core topic thoroughly.",
      resources: [
        { title: "Search on YouTube", url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}` }
      ]
    }));
  }
};

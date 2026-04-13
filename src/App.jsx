import React, { useState } from 'react';
import EvaluationForm from './components/EvaluationForm';
import ReportCard from './components/ReportCard';
import { generateEvaluation } from './services/aiService';

function App() {
  const [report, setReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate calling the AI LLM using the provided prompt layout
      const aiResponse = await generateEvaluation(data);
      setReport(aiResponse);
    } catch (error) {
      console.error("Evaluation failed", error);
      alert("Failed to generate AI evaluation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setReport(null);
  };

  return (
    <>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient hover:scale-105 transition" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          AI Tech Recruiter
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Automated Candidate Evaluation System
        </p>
      </header>

      <main>
        {!report ? (
          <EvaluationForm onSubmit={handleSubmitForm} isSubmitting={isSubmitting} />
        ) : (
          <ReportCard report={report} onReset={resetForm} />
        )}
      </main>
    </>
  );
}

export default App;

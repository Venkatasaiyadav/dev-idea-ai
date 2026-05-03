import { useState } from 'react';
import { generateIdeas } from './gemini';
import { Sparkles, Code2, Target, Lightbulb, Zap, Rocket, Coins, BarChart, Settings, Loader2 } from 'lucide-react';
import './index.css';

function App() {
  const [techStack, setTechStack] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!techStack.trim()) {
      setError('Please enter your tech stack first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setIdeas([]);

    try {
      const generatedIdeas = await generateIdeas(techStack);
      setIdeas(generatedIdeas);
    } catch (err) {
      console.error(err);
      setError('Failed to generate ideas. Make sure your API key is set in .env correctly or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Background ambient glow */}
      <div className="ambient-glow bg-primary"></div>
      <div className="ambient-glow bg-secondary"></div>

      <main className="main-content">
        <header className="header">
          <div className="logo-container">
            <div className="logo-icon-bg">
              <Lightbulb className="logo-icon" size={32} />
            </div>
            <h1 className="title">Dev<span className="text-gradient">Idea</span> AI</h1>
          </div>
          <p className="subtitle">
            Generate high-quality software project ideas instantly based on your specific tech stack.
          </p>
        </header>

        <section className="input-section">
          <div className="input-wrapper">
            <Code2 className="input-icon" size={20} />
            <textarea
              className="tech-input"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="Enter your tech stack (e.g., React, Spring Boot, MongoDB)"
              rows={3}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            className={`generate-btn ${isLoading ? 'loading' : ''}`}
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="spinner" size={20} />
                <span>Generating Magic...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate Ideas</span>
              </>
            )}
          </button>
        </section>

        {ideas.length > 0 && (
          <section className="output-section">
            <div className="ideas-grid">
              {ideas.map((idea, index) => (
                <div key={index} className="idea-card fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="card-header">
                    <h2 className="project-name">{idea.projectName}</h2>
                    <span className={`difficulty-badge ${idea.difficultyLevel.toLowerCase()}`}>
                      {idea.difficultyLevel}
                    </span>
                  </div>
                  
                  <div className="card-content">
                    <div className="content-block">
                      <h3 className="block-title"><Target size={16} /> Problem Statement</h3>
                      <p>{idea.problemStatement}</p>
                    </div>

                    <div className="content-block">
                      <h3 className="block-title"><Lightbulb size={16} /> Solution Overview</h3>
                      <p>{idea.solutionOverview}</p>
                    </div>

                    <div className="content-block">
                      <h3 className="block-title"><Zap size={16} /> Key Features</h3>
                      <ul className="features-list">
                        {idea.keyFeatures.map((feature, fIndex) => (
                          <li key={fIndex}>
                            <div className="feature-dot"></div>
                            {feature.replace(/^- /, '')}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid-2-col">
                      <div className="content-block">
                        <h3 className="block-title"><Rocket size={16} /> Target Users</h3>
                        <p>{idea.targetUsers}</p>
                      </div>

                      <div className="content-block">
                        <h3 className="block-title"><Coins size={16} /> Monetization</h3>
                        <p>{idea.monetizationStrategy}</p>
                      </div>
                    </div>

                    <div className="content-block">
                      <h3 className="block-title"><Settings size={16} /> Tech Enhancements</h3>
                      <p className="enhancements-text">{idea.suggestedTechEnhancements}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;

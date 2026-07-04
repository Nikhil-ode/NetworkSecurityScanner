import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="hero" style={{ textAlign: 'center' }}>
        <h1>Network Security Scanner</h1>
        <p>Comprehensive vulnerability detection and network analysis</p>

        {user ? (
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Get Started
          </Link>
        )}
      </div>

      <div className="features" style={{ maxWidth: '48rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="feature-card">
          <h3>Port Scanning</h3>
          <p>Identify open ports and services on target systems</p>
        </div>

        <div className="feature-card">
          <h3>Vulnerability Detection</h3>
          <p>Detect known vulnerabilities and security weaknesses</p>
        </div>

        <div className="feature-card">
          <h3>Detailed Reports</h3>
          <p>Generate comprehensive security reports in multiple formats</p>
        </div>

        <div className="feature-card">
          <h3>Real-time Monitoring</h3>
          <p>Track scan progress and view results in real-time</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

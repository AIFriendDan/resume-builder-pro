require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '🚀 Resume Builder API is running!',
    version: '1.0.0',
    features: [
      'AI Bullet Enhancement',
      'Job Tailoring',
      'ATS Checker',
      'Version Management'
    ]
  });
});

// AI Enhancement endpoint (placeholder)
app.post('/api/enhance-bullet', async (req, res) => {
  const { bullet } = req.body;
  
  if (!bullet) {
    return res.status(400).json({ error: 'Bullet point required' });
  }

  // TODO: Add OpenAI integration
  res.json({ 
    original: bullet,
    enhanced: `${bullet} (AI enhancement coming soon!)`,
    method: 'STAR'
  });
});

// Job Tailoring endpoint (placeholder)
app.post('/api/tailor-resume', async (req, res) => {
  const { jobDescription, resumeData } = req.body;
  
  if (!jobDescription) {
    return res.status(400).json({ error: 'Job description required' });
  }

  // TODO: Add OpenAI integration
  res.json({
    matchScore: 75,
    suggestions: ['Add keywords', 'Highlight relevant skills'],
    keywords: ['JavaScript', 'React', 'Node.js']
  });
});

// ATS Check endpoint (placeholder)
app.post('/api/ats-check', (req, res) => {
  const { resumeData } = req.body;
  
  // Simple validation logic
  const score = 65;
  const checks = [
    { item: 'Contact info present', passed: true },
    { item: 'Summary length appropriate', passed: true },
    { item: 'Quantifiable achievements', passed: false }
  ];

  res.json({ score, checks });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔗 Test: http://localhost:${PORT}/api/test`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});
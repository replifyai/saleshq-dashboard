// Mock data for testing the module system without backend

export const mockModules = [
  {
    id: 'module-1',
    name: 'Introduction to AI',
    description: 'A comprehensive module covering the basics of artificial intelligence'
  },
  {
    id: 'module-2',
    name: 'Machine Learning Fundamentals',
    description: 'Learn the core concepts and algorithms of machine learning'
  },
  {
    id: 'module-3',
    name: 'Deep Learning',
    description: 'Explore neural networks and deep learning architectures'
  },
  {
    id: 'module-4',
    name: 'Natural Language Processing',
    description: 'Understanding and processing human language with AI'
  },
  {
    id: 'module-5',
    name: 'Computer Vision',
    description: 'Teaching computers to understand and interpret visual information'
  }
];

export const mockFiles = {
  'module-1': [
    {
      id: 'file-1',
      name: 'Chapter 1 - Introduction to AI',
      type: 'pdf' as const,
      location: 'https://storage.googleapis.com/replify-9f49f.firebasestorage.app/uploads%2FgrxfKaCX4ARFDc14DQ6zhfaR7DZ2%2Ffacc3ddb-586a-4616-92ea-dbef88389be4-Aero%20Mesh%20Chair%20Marketing%20brief%20.pdf',
      createdAt: Date.now()
    },
    {
      id: 'file-2',
      name: 'Chapter 2 - History of AI',
      type: 'pdf' as const,
      location: 'mock/history-of-ai.pdf',
      createdAt: Date.now()
    },
    {
      id: 'quiz-1',
      name: 'Introduction to AI Quiz',
      type: 'quiz' as const,
      questionsCount: 20,
      createdAt: Date.now()
    }
  ],
  'module-2': [
    {
      id: 'file-3',
      name: 'ML Algorithms Overview',
      type: 'pdf' as const,
      location: 'mock/ml-algorithms.pdf',
      createdAt: Date.now()
    },
    {
      id: 'quiz-2',
      name: 'Machine Learning Basics Quiz',
      type: 'quiz' as const,
      questionsCount: 25,
      createdAt: Date.now()
    }
  ]
};

export const mockQuizQuestions = {
  'quiz-1': [
    {
      id: 'q1',
      question: 'What does AI stand for?',
      options: [
        'Automated Intelligence',
        'Artificial Intelligence',
        'Advanced Integration',
        'Augmented Information'
      ],
      answer: 'Artificial Intelligence',
      order: 1,
      createdAt: Date.now()
    },
    {
      id: 'q2',
      question: 'Who is considered the father of artificial intelligence?',
      options: [
        'Alan Turing',
        'John McCarthy',
        'Marvin Minsky',
        'Geoffrey Hinton'
      ],
      answer: 'John McCarthy',
      order: 2,
      createdAt: Date.now()
    },
    {
      id: 'q3',
      question: 'What year was the term "Artificial Intelligence" first coined?',
      options: [
        '1943',
        '1956',
        '1969',
        '1980'
      ],
      answer: '1956',
      order: 3,
      createdAt: Date.now()
    },
    {
      id: 'q4',
      question: 'Which of the following is NOT a type of machine learning?',
      options: [
        'Supervised Learning',
        'Unsupervised Learning',
        'Reinforcement Learning',
        'Compiled Learning'
      ],
      answer: 'Compiled Learning',
      order: 4,
      createdAt: Date.now()
    },
    {
      id: 'q5',
      question: 'What is the Turing Test designed to evaluate?',
      options: [
        'Computer processing speed',
        'Machine intelligence',
        'Memory capacity',
        'Network connectivity'
      ],
      answer: 'Machine intelligence',
      order: 5,
      createdAt: Date.now()
    }
  ],
  'quiz-2': [
    {
      id: 'q6',
      question: 'What is the primary goal of supervised learning?',
      options: [
        'To find hidden patterns in data',
        'To learn from labeled examples',
        'To maximize rewards',
        'To cluster similar data points'
      ],
      answer: 'To learn from labeled examples',
      order: 1,
      createdAt: Date.now()
    },
    {
      id: 'q7',
      question: 'Which algorithm is commonly used for classification tasks?',
      options: [
        'K-means',
        'Linear Regression',
        'Decision Trees',
        'PCA'
      ],
      answer: 'Decision Trees',
      order: 2,
      createdAt: Date.now()
    },
    {
      id: 'q8',
      question: 'What does "overfitting" mean in machine learning?',
      options: [
        'The model is too simple',
        'The model performs well on training data but poorly on new data',
        'The model takes too long to train',
        'The model uses too much memory'
      ],
      answer: 'The model performs well on training data but poorly on new data',
      order: 3,
      createdAt: Date.now()
    }
  ]
};
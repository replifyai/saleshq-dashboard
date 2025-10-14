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

// Mock nested module structure for testing - supports unlimited nesting
export const mockNestedModules = {
  'module-1': [
    {
      id: 'submodule-1-1',
      name: 'AI History and Evolution',
      description: 'The development of AI from its inception to modern times',
      subModules: [
        {
          id: 'submodule-1-1-1',
          name: 'Early AI Pioneers',
          description: 'The founding fathers of artificial intelligence',
          subModules: [
            {
              id: 'submodule-1-1-1-1',
              name: 'Alan Turing Contributions',
              description: 'Turing machines and computational theory'
            },
            {
              id: 'submodule-1-1-1-2',
              name: 'John McCarthy Legacy',
              description: 'LISP and symbolic AI development'
            }
          ]
        },
        {
          id: 'submodule-1-1-2',
          name: 'Modern AI Era',
          description: 'AI developments from 2000s onwards',
          subModules: [
            {
              id: 'submodule-1-1-2-1',
              name: 'Deep Learning Revolution',
              description: 'The rise of neural networks and deep learning'
            }
          ]
        }
      ]
    },
    {
      id: 'submodule-1-2',
      name: 'AI Applications',
      description: 'Real-world applications of artificial intelligence',
      subModules: [
        {
          id: 'submodule-1-2-1',
          name: 'Healthcare AI',
          description: 'AI applications in medical diagnosis and treatment',
          subModules: [
            {
              id: 'submodule-1-2-1-1',
              name: 'Medical Imaging',
              description: 'AI-powered radiology and diagnostics'
            },
            {
              id: 'submodule-1-2-1-2',
              name: 'Drug Discovery',
              description: 'AI in pharmaceutical research and development'
            }
          ]
        },
        {
          id: 'submodule-1-2-2',
          name: 'Autonomous Systems',
          description: 'Self-driving cars and robotics',
          subModules: [
            {
              id: 'submodule-1-2-2-1',
              name: 'Self-Driving Cars',
              description: 'Autonomous vehicle technology and challenges'
            }
          ]
        }
      ]
    }
  ],
  'module-2': [
    {
      id: 'submodule-2-1',
      name: 'Supervised Learning',
      description: 'Learning with labeled data',
      subModules: [
        {
          id: 'submodule-2-1-1',
          name: 'Classification Algorithms',
          description: 'Algorithms for categorical predictions',
          subModules: [
            {
              id: 'submodule-2-1-1-1',
              name: 'Decision Trees',
              description: 'Tree-based classification methods'
            },
            {
              id: 'submodule-2-1-1-2',
              name: 'Random Forests',
              description: 'Ensemble methods for improved accuracy'
            }
          ]
        },
        {
          id: 'submodule-2-1-2',
          name: 'Regression Algorithms',
          description: 'Algorithms for continuous value predictions'
        }
      ]
    },
    {
      id: 'submodule-2-2',
      name: 'Unsupervised Learning',
      description: 'Finding patterns in unlabeled data',
      subModules: [
        {
          id: 'submodule-2-2-1',
          name: 'Clustering Methods',
          description: 'Grouping similar data points together'
        },
        {
          id: 'submodule-2-2-2',
          name: 'Dimensionality Reduction',
          description: 'Reducing data complexity while preserving information'
        }
      ]
    }
  ],
  'module-3': [
    {
      id: 'submodule-3-1',
      name: 'Neural Networks',
      description: 'Foundation of deep learning',
      subModules: [
        {
          id: 'submodule-3-1-1',
          name: 'Perceptrons',
          description: 'Basic building blocks of neural networks',
          subModules: [
            {
              id: 'submodule-3-1-1-1',
              name: 'Single Layer Perceptrons',
              description: 'Simplest form of neural networks'
            },
            {
              id: 'submodule-3-1-1-2',
              name: 'Multi-Layer Perceptrons',
              description: 'Networks with hidden layers'
            }
          ]
        },
        {
          id: 'submodule-3-1-2',
          name: 'Backpropagation',
          description: 'Training neural networks through gradient descent'
        }
      ]
    }
  ]
};

export const mockFiles = {
  'module-1': [
    {
      id: 'file-1',
      name: 'Chapter 1 - Introduction to AI',
      type: 'pdf' as const,
      location: 'https://storage.googleapis.com/SalesHQ-9f49f.firebasestorage.app/uploads%2FgrxfKaCX4ARFDc14DQ6zhfaR7DZ2%2Ffacc3ddb-586a-4616-92ea-dbef88389be4-Aero%20Mesh%20Chair%20Marketing%20brief%20.pdf',
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
  'module-1/submodule-1-1': [
    {
      id: 'file-1-1-1',
      name: 'AI Timeline Overview',
      type: 'pdf' as const,
      location: 'mock/ai-timeline.pdf',
      createdAt: Date.now()
    },
    {
      id: 'quiz-1-1',
      name: 'AI History Quiz',
      type: 'quiz' as const,
      questionsCount: 15,
      createdAt: Date.now()
    }
  ],
  'module-1/submodule-1-1/submodule-1-1-1': [
    {
      id: 'file-1-1-1-1',
      name: 'Pioneers Biography',
      type: 'pdf' as const,
      location: 'mock/ai-pioneers.pdf',
      createdAt: Date.now()
    },
    {
      id: 'quiz-1-1-1',
      name: 'AI Pioneers Quiz',
      type: 'quiz' as const,
      questionsCount: 12,
      createdAt: Date.now()
    }
  ],
  'module-1/submodule-1-1/submodule-1-1-1/submodule-1-1-1-1': [
    {
      id: 'file-1-1-1-1-1',
      name: 'Turing Machine Theory',
      type: 'pdf' as const,
      location: 'mock/turing-machines.pdf',
      createdAt: Date.now()
    }
  ],
  'module-1/submodule-1-2': [
    {
      id: 'file-1-2-1',
      name: 'AI Applications Guide',
      type: 'pdf' as const,
      location: 'mock/ai-applications.pdf',
      createdAt: Date.now()
    }
  ],
  'module-1/submodule-1-2/submodule-1-2-1': [
    {
      id: 'file-1-2-1-1',
      name: 'Healthcare AI Overview',
      type: 'pdf' as const,
      location: 'mock/healthcare-ai.pdf',
      createdAt: Date.now()
    },
    {
      id: 'quiz-1-2-1',
      name: 'Healthcare AI Quiz',
      type: 'quiz' as const,
      questionsCount: 18,
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
  ],
  'module-2/submodule-2-1': [
    {
      id: 'file-2-1-1',
      name: 'Supervised Learning Guide',
      type: 'pdf' as const,
      location: 'mock/supervised-learning.pdf',
      createdAt: Date.now()
    }
  ],
  'module-2/submodule-2-1/submodule-2-1-1': [
    {
      id: 'file-2-1-1-1',
      name: 'Classification Methods',
      type: 'pdf' as const,
      location: 'mock/classification.pdf',
      createdAt: Date.now()
    }
  ],
  'module-3': [
    {
      id: 'file-4',
      name: 'Deep Learning Fundamentals',
      type: 'pdf' as const,
      location: 'mock/deep-learning.pdf',
      createdAt: Date.now()
    }
  ],
  'module-3/submodule-3-1': [
    {
      id: 'file-3-1-1',
      name: 'Neural Networks Basics',
      type: 'pdf' as const,
      location: 'mock/neural-networks.pdf',
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
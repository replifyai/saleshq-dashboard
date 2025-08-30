/**
 * Mock Organization Data for Testing
 * Comprehensive mock data demonstrating unlimited hierarchy capabilities
 */

import type { 
  OrganizationNode, 
  OrganizationUser, 
  OrganizationHierarchy 
} from '@/types/organization';

// Mock Users Data
export const mockUsers: OrganizationUser[] = [
  {
    id: 'user_001',
    name: 'Emily Foster',
    email: 'emily.foster@SalesHQ.ai',
    role: 'ceo',
    title: 'Chief Executive Officer',
    status: 'active',
    joinedAt: '2024-01-01T00:00:00Z',
    nodeIds: ['node_001'],
    managerId: 'user_001', // Self-managed CEO
  },
  {
    id: 'user_002',
    name: 'David Thompson',
    email: 'david.thompson@SalesHQ.ai',
    role: 'vp',
    title: 'VP of Sales',
    status: 'active',
    joinedAt: '2024-01-01T00:00:00Z',
    nodeIds: ['node_002'],
    managerId: 'user_001', // Reports to CEO
  },
  {
    id: 'user_003',
    name: 'Jennifer Wang',
    email: 'jennifer.wang@SalesHQ.ai',
    role: 'director',
    title: 'Enterprise Sales Director',
    status: 'active',
    joinedAt: '2024-01-01T00:00:00Z',
    nodeIds: ['node_003'],
    managerId: 'user_002', // Reports to VP of Sales
  },
  {
    id: 'user_004',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@SalesHQ.ai',
    role: 'manager',
    title: 'Regional Sales Manager',
    status: 'active',
    joinedAt: '2024-01-01T00:00:00Z',
    nodeIds: ['node_004'],
    managerId: 'user_003', // Reports to Enterprise Sales Director
  },
  {
    id: 'user_005',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@SalesHQ.ai',
    role: 'manager',
    title: 'Fortune 500 Sales Manager',
    status: 'active',
    joinedAt: '2024-01-01T00:00:00Z',
    nodeIds: ['node_005'],
    managerId: 'user_004', // Reports to Regional Sales Manager
  },
  {
    id: 'user_006',
    name: 'Alex Chen',
    email: 'alex.chen@SalesHQ.ai',
    role: 'specialist',
    title: 'Tech Sector Sales Specialist',
    status: 'active',
    joinedAt: '2024-01-01T00:00:00Z',
    nodeIds: ['node_006'],
    managerId: 'user_005', // Reports to Fortune 500 Sales Manager
  },
  {
    id: 'user_007',
    name: 'Rachel Green',
    email: 'rachel.green@SalesHQ.ai',
    role: 'manager',
    title: 'SMB Sales Manager',
    status: 'active',
    joinedAt: '2024-01-15T00:00:00Z',
    nodeIds: ['node_007'],
    managerId: 'user_002', // Reports to VP of Sales
  },
  {
    id: 'user_008',
    name: 'Kevin Brown',
    email: 'kevin.brown@SalesHQ.ai',
    role: 'member',
    title: 'Sales Representative',
    status: 'active',
    joinedAt: '2024-02-01T00:00:00Z',
    nodeIds: ['node_007'],
    managerId: 'user_007', // Reports to SMB Sales Manager
  },
  {
    id: 'user_009',
    name: 'Lisa Zhang',
    email: 'lisa.zhang@SalesHQ.ai',
    role: 'member',
    title: 'Junior Sales Rep',
    status: 'active',
    joinedAt: '2024-02-15T00:00:00Z',
    nodeIds: ['node_007'],
    managerId: 'user_007', // Reports to SMB Sales Manager
  },
  {
    id: 'user_010',
    name: 'James Wilson',
    email: 'james.wilson@SalesHQ.ai',
    role: 'manager',
    title: 'VP of Engineering',
    status: 'active',
    joinedAt: '2024-01-01T00:00:00Z',
    nodeIds: ['node_008'],
    managerId: 'user_001', // Reports to CEO
  },
];

// Available users (not yet assigned)
export const mockAvailableUsers: OrganizationUser[] = [
  {
    id: 'user_011',
    name: 'Robert Kim',
    email: 'robert.kim@SalesHQ.ai',
    role: 'member',
    title: 'Sales Representative',
    status: 'active',
    joinedAt: '2024-03-01T00:00:00Z',
    nodeIds: [],
  },
  {
    id: 'user_012',
    name: 'Amanda Davis',
    email: 'amanda.davis@SalesHQ.ai',
    role: 'analyst',
    title: 'Sales Analyst',
    status: 'active',
    joinedAt: '2024-03-15T00:00:00Z',
    nodeIds: [],
  },
  {
    id: 'user_013',
    name: 'Daniel Lee',
    email: 'daniel.lee@SalesHQ.ai',
    role: 'member',
    title: 'Software Engineer',
    status: 'pending',
    joinedAt: '2024-04-01T00:00:00Z',
    nodeIds: [],
  },
  {
    id: 'user_014',
    name: 'Sophie Martinez',
    email: 'sophie.martinez@SalesHQ.ai',
    role: 'member',
    title: 'Product Manager',
    status: 'active',
    joinedAt: '2024-04-10T00:00:00Z',
    nodeIds: [],
  },
];

// Mock Organization Hierarchy with Unlimited Depth
export const mockOrganizationNodes: OrganizationNode[] = [
  {
    id: 'node_001',
    name: 'SalesHQ Corporation',
    type: 'Company',
    parentId: null,
    level: 0,
    path: 'SalesHQ Corporation',
    order: 0,
    description: 'AI-powered sales platform company revolutionizing how sales teams interact with product knowledge',
    managerId: 'user_001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    metadata: {
      budget: 50000000,
      headcount: 150,
      targetHeadcount: 200,
      location: 'Global',
      costCenter: 'CC000',
      timezone: 'UTC',
    },
    children: [
      {
        id: 'node_002',
        name: 'Sales Division',
        type: 'Division',
        parentId: 'node_001',
        level: 1,
        path: 'SalesHQ Corporation/Sales Division',
        order: 0,
        description: 'Global sales operations focused on customer acquisition and revenue growth',
        managerId: 'user_002',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        metadata: {
          budget: 15000000,
          headcount: 80,
          targetHeadcount: 100,
          location: 'Global',
          costCenter: 'CC001',
        },
        children: [
          {
            id: 'node_003',
            name: 'Enterprise Sales',
            type: 'Department',
            parentId: 'node_002',
            level: 2,
            path: 'SalesHQ Corporation/Sales Division/Enterprise Sales',
            order: 0,
            description: 'Large enterprise client acquisition and account management',
            managerId: 'user_003',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            metadata: {
              budget: 8000000,
              headcount: 35,
              targetHeadcount: 45,
              location: 'North America, Europe',
              costCenter: 'CC002',
            },
            children: [
              {
                id: 'node_004',
                name: 'North America Enterprise',
                type: 'Regional Team',
                parentId: 'node_003',
                level: 3,
                path: 'SalesHQ Corporation/Sales Division/Enterprise Sales/North America Enterprise',
                order: 0,
                description: 'Enterprise sales for North American market',
                managerId: 'user_004',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                metadata: {
                  budget: 4500000,
                  headcount: 20,
                  targetHeadcount: 25,
                  location: 'USA, Canada',
                  costCenter: 'CC003',
                  timezone: 'America/New_York',
                },
                children: [
                  {
                    id: 'node_005',
                    name: 'Fortune 500 Accounts',
                    type: 'Specialized Team',
                    parentId: 'node_004',
                    level: 4,
                    path: 'SalesHQ Corporation/Sales Division/Enterprise Sales/North America Enterprise/Fortune 500 Accounts',
                    order: 0,
                    description: 'Top-tier enterprise accounts with $10M+ revenue potential',
                    managerId: 'user_005',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                    metadata: {
                      budget: 2000000,
                      headcount: 8,
                      targetHeadcount: 10,
                      location: 'New York, San Francisco',
                      costCenter: 'CC004',
                    },
                    children: [
                      {
                        id: 'node_006',
                        name: 'Tech Sector Focus',
                        type: 'Sub-team',
                        parentId: 'node_005',
                        level: 5,
                        path: 'SalesHQ Corporation/Sales Division/Enterprise Sales/North America Enterprise/Fortune 500 Accounts/Tech Sector Focus',
                        order: 0,
                        description: 'Technology companies specialization (Software, Cloud, AI)',
                        managerId: 'user_006',
                        createdAt: '2024-01-01T00:00:00Z',
                        updatedAt: '2024-01-01T00:00:00Z',
                        metadata: {
                          budget: 800000,
                          headcount: 3,
                          targetHeadcount: 5,
                          location: 'Silicon Valley',
                          costCenter: 'CC005',
                          customFields: {
                            verticalFocus: ['SaaS', 'Cloud Infrastructure', 'AI/ML'],
                            targetCompanies: ['FAANG', 'Unicorns', 'Growth Companies'],
                          },
                        },
                        children: [],
                        users: [mockUsers[5]], // Alex Chen
                      },
                    ],
                    users: [mockUsers[4]], // Sarah Johnson
                  },
                ],
                users: [mockUsers[3]], // Michael Rodriguez
              },
            ],
            users: [mockUsers[2]], // Jennifer Wang
          },
          {
            id: 'node_007',
            name: 'SMB Sales',
            type: 'Department',
            parentId: 'node_002',
            level: 2,
            path: 'SalesHQ Corporation/Sales Division/SMB Sales',
            order: 1,
            description: 'Small and medium business sales operations',
            managerId: 'user_007',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            metadata: {
              budget: 3000000,
              headcount: 25,
              targetHeadcount: 35,
              location: 'North America',
              costCenter: 'CC006',
            },
            children: [],
            users: [mockUsers[6], mockUsers[7], mockUsers[8]], // Rachel, Kevin, Lisa
          },
        ],
        users: [mockUsers[1]], // David Thompson
      },
      {
        id: 'node_008',
        name: 'Engineering Division',
        type: 'Division',
        parentId: 'node_001',
        level: 1,
        path: 'SalesHQ Corporation/Engineering Division',
        order: 1,
        description: 'Product development and engineering operations',
        managerId: 'user_010',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        metadata: {
          budget: 20000000,
          headcount: 60,
          targetHeadcount: 80,
          location: 'Global',
          costCenter: 'CC007',
        },
        children: [],
        users: [mockUsers[9]], // James Wilson
      },
    ],
    users: [mockUsers[0]], // Emily Foster
  },
];

// Create flat nodes array for search and utilities
const flattenNodes = (nodes: OrganizationNode[]): OrganizationNode[] => {
  const result: OrganizationNode[] = [];
  
  const traverse = (node: OrganizationNode) => {
    result.push(node);
    node.children.forEach(traverse);
  };
  
  nodes.forEach(traverse);
  return result;
};

export const mockFlatNodes = flattenNodes(mockOrganizationNodes);

// Mock Organization Hierarchy Response
export const mockOrganizationHierarchy: OrganizationHierarchy = {
  nodes: mockOrganizationNodes,
  flatNodes: mockFlatNodes,
  totalUsers: mockUsers.length,
  totalNodes: mockFlatNodes.length,
  maxDepth: 5,
  nodeTypes: ['Company', 'Division', 'Department', 'Regional Team', 'Specialized Team', 'Sub-team'],
  lastUpdated: new Date().toISOString(),
};

// Helper function to get mock data based on filters
export const getMockHierarchy = (filters?: any): OrganizationHierarchy => {
  // In a real implementation, this would apply filters
  console.log('Loading mock organization hierarchy...', { filters });
  return mockOrganizationHierarchy;
};

// Helper function to find node by ID
export const findMockNodeById = (id: string): OrganizationNode | null => {
  return mockFlatNodes.find(node => node.id === id) || null;
};

// Helper function to get available managers
export const getMockAvailableManagers = (): { id: string; name: string; title?: string }[] => {
  return mockUsers
    .filter(user => ['manager', 'director', 'vp', 'ceo'].includes(user.role))
    .map(user => ({
      id: user.id,
      name: user.name,
      title: user.title,
    }));
};

export default {
  mockOrganizationHierarchy,
  mockUsers,
  mockAvailableUsers,
  mockOrganizationNodes,
  mockFlatNodes,
  getMockHierarchy,
  findMockNodeById,
  getMockAvailableManagers,
};
/**
 * API Request/Response Types
 */

import type {
  User,
  Conversation,
  Message,
  LinearTeam,
  LinearProject,
  LinearCycle,
  LinearMember,
  LinearIssue,
  LinearTask,
} from './models';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: Record<string, any>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export namespace AuthAPI {
  export interface LoginResponse {
    user: User;
    redirectUrl?: string;
  }
  export interface MeResponse {
    user: User;
  }
  export interface LogoutResponse {
    success: boolean;
  }
}

export namespace ConversationAPI {
  export interface ListRequest extends PaginationParams {
    search?: string;
  }
  export interface ListResponse extends PaginatedResponse<Conversation> {}
  export interface CreateRequest {
    firstMessage?: string;
  }
  export interface CreateResponse {
    conversation: Conversation;
  }
  export interface GetResponse {
    conversation: Conversation;
    messages: Message[];
  }
}

export namespace MessageAPI {
  export interface SendRequest {
    conversationId: string;
    content: string;
  }
  export interface SendResponse {
    userMessage: Message;
    assistantMessage: Message;
  }
  export interface StreamEvent {
    type: 'chunk' | 'done' | 'error';
    content?: string;
    message?: Message;
    error?: string;
  }
}

export namespace LinearAPI {
  export interface ListTeamsResponse {
    teams: LinearTeam[];
  }
  export interface ListProjectsResponse {
    projects: LinearProject[];
  }
  export interface ListCyclesResponse {
    cycles: LinearCycle[];
  }
  export interface ListMembersResponse {
    members: LinearMember[];
  }
  export interface CreateIssueRequest {
    teamId: string;
    title: string;
    description: string;
    priority?: number;
    projectId?: string;
    cycleId?: string;
    assigneeId?: string;
    labels?: string[];
  }
  export interface CreateIssueResponse {
    issue: LinearIssue;
  }
  export interface SearchIssuesResponse extends PaginatedResponse<LinearIssue> {}
}

export namespace AnalyticsAPI {
  export interface CostSummaryResponse {
    totalCost: number;
    totalTokens: number;
    conversationCount: number;
  }
  export interface TaskHistoryResponse {
    tasks: LinearTask[];
    total: number;
  }
}

export type {
  User,
  Conversation,
  Message,
  LinearTeam,
  LinearProject,
  LinearCycle,
  LinearMember,
  LinearIssue,
  LinearTask,
};
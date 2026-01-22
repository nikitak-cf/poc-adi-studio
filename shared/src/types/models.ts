/**
 * Domain Model Types
 */

export interface User {
  id: string;
  linearId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  userId: string;
  linearToken: string;
  email: string;
  name: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title?: string;
  lastActivity: Date;
  createdAt: Date;
  messageCount?: number;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  tokenCount?: number;
  metadata?: MessageMetadata;
  createdAt: Date;
}

export interface MessageMetadata {
  taskPreview?: TaskPreview;
  linearTaskId?: string;
  searchResults?: LinearIssue[];
  [key: string]: any;
}

export interface LinearTask {
  id: string;
  userId: string;
  linearIssueId: string;
  conversationId?: string;
  title: string;
  createdAt: Date;
}

export interface TaskPreview {
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  labels?: string[];
  assigneeId?: string;
  teamId: string;
  projectId?: string;
  cycleId?: string;
  subTasks?: SubTask[];
}

export interface SubTask {
  title: string;
  description?: string;
}

export type TaskType = 'FEATURE' | 'BUG' | 'TASK' | 'SPIKE';
export type TaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELED';

export interface LinearTeam {
  id: string;
  name: string;
  key: string;
}

export interface LinearProject {
  id: string;
  name: string;
  description?: string;
  teamId: string;
}

export interface LinearCycle {
  id: string;
  number: number;
  name: string;
  startsAt: Date;
  endsAt: Date;
  isCurrent: boolean;
}

export interface LinearMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface LinearIssue {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  priority: number;
  status: TaskStatus;
  assignee?: LinearMember;
  creator: LinearMember;
  team: LinearTeam;
  project?: LinearProject;
  cycle?: LinearCycle;
  labels?: string[];
  createdAt: Date;
  updatedAt: Date;
  url: string;
}

export interface TokenUsage {
  id: string;
  userId: string;
  conversationId: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  createdAt: Date;
}
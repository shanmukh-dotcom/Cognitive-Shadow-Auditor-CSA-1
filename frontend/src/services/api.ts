// In production, the backend and frontend are unified, so we use relative paths (empty string).
const API_BASE_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PrimaryResult {
  verdict: string;
  confidence: number;
  reasoning: string;
  key_factors: string[];
}

export interface ShadowResult {
  counter_verdict: string;
  challenge_strength: number;
  counter_reasoning: string;
  bias_flags: string[];
  missed_factors: string[];
}

export interface DecisionResponse {
  decision_id: string;
  domain: string;
  input_data: Record<string, any>;
  context: string;
  primary_response: PrimaryResult;
  shadow_response: ShadowResult;
  tension_score: number;
  final_verdict: string;
  escalate_flag: boolean;
  created_at: string;
}

export interface AuditRecord {
  decision_id: string;
  domain: string;
  input_data: Record<string, any>;
  context?: string;
  primary_verdict?: string;
  primary_confidence?: number;
  primary_reasoning?: string;
  primary_key_factors?: string[];
  shadow_verdict?: string;
  shadow_challenge_strength?: number;
  shadow_reasoning?: string;
  shadow_bias_flags?: string[];
  shadow_missed_factors?: string[];
  tension_score?: number;
  final_verdict?: string;
  escalate_flag: boolean;
  resolved_by_human: boolean;
  human_verdict?: string;
  reviewer_notes?: string;
  created_at?: string;
  resolved_at?: string;
}

export interface PaginatedDecisions {
  page: number;
  limit: number;
  total: number;
  decisions: AuditRecord[];
}

export const api = {
  async decide(domain: string, inputData: Record<string, any>, context: string): Promise<DecisionResponse> {
    const response = await fetch(`${API_BASE_URL}/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, input_data: inputData, context }),
    });
    const result: APIResponse<DecisionResponse> = await response.json();
    if (!result.success) throw new Error(result.error || 'Decision failed');
    return result.data!;
  },

  async getDecisions(page = 1, limit = 20): Promise<PaginatedDecisions> {
    const response = await fetch(`${API_BASE_URL}/decisions?page=${page}&limit=${limit}`);
    const result: APIResponse<PaginatedDecisions> = await response.json();
    if (!result.success) throw new Error(result.error || 'Failed to fetch decisions');
    return result.data!;
  },

  async getAudit(id: string): Promise<AuditRecord> {
    const response = await fetch(`${API_BASE_URL}/audit/${id}`);
    const result: APIResponse<AuditRecord> = await response.json();
    if (!result.success) throw new Error(result.error || 'Failed to fetch audit record');
    return result.data!;
  },

  async resolve(id: string, humanVerdict: string, notes: string) {
    const response = await fetch(`${API_BASE_URL}/resolve/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ human_verdict: humanVerdict, reviewer_notes: notes }),
    });
    const result: APIResponse = await response.json();
    if (!result.success) throw new Error(result.error || 'Failed to resolve escalation');
    return result.data;
  },

  async escalate(id: string) {
    const response = await fetch(`${API_BASE_URL}/escalate/${id}`, {
      method: 'POST',
    });
    const result: APIResponse = await response.json();
    if (!result.success) throw new Error(result.error || 'Failed to escalate');
    return result.data;
  }
};

import { apiRequest } from "@/lib/api"

export type ShiftProposalFields = {
  jobProfileId: number; locationId: number; startsOn: string; startTime: string;
  endTime: string; peopleNeeded: number; hourlyRate: number | null
}
export type AgentProposal = {
  id: string; kind: "create_shift" | "apply"; status: string; version: number;
  fields: ShiftProposalFields | { shiftId: number }; summary: Record<string, unknown>;
  expiresAtUtc: string; resultId: number | null
}
export type AgentRun = {
  id: string; conversationId: string; status: string; prompt: string; answer: string | null;
  errorCode: string | null; createdAtUtc: string; modelCalls: number; toolCalls: number; proposals: AgentProposal[]
}
export type Conversation = { id: string; agent: "employer" | "professional"; expiresAtUtc: string; runs: AgentRun[] }
const root = "/api/ai/agent"
export const agentApi = {
  status: (signal?: AbortSignal) => apiRequest<{ enabled: boolean; agent: Conversation["agent"] }>(`${root}/status`, { signal }),
  list: (signal?: AbortSignal) => apiRequest<Omit<Conversation, "runs">[]>(`${root}/conversations`, { signal }),
  create: (signal?: AbortSignal) => apiRequest<Omit<Conversation, "runs">>(`${root}/conversations`, { method: "POST", signal }),
  get: (id: string, signal?: AbortSignal) => apiRequest<Conversation>(`${root}/conversations/${id}`, { signal }),
  send: (id: string, message: string, requestKey: string, signal?: AbortSignal) => apiRequest<AgentRun>(`${root}/conversations/${id}/messages`, { method: "POST", body: { message, requestKey }, signal }),
  cancel: (id: string) => apiRequest(`${root}/conversations/${id}/cancel`, { method: "POST" }),
  delete: (id: string) => apiRequest(`${root}/conversations/${id}`, { method: "DELETE" }),
  revise: (p: AgentProposal, fields: ShiftProposalFields) => apiRequest<AgentProposal>(`${root}/proposals/${p.id}`, { method: "PUT", body: { version: p.version, fields } }),
  approve: (p: AgentProposal) => apiRequest<AgentProposal>(`${root}/proposals/${p.id}/approve`, { method: "POST", body: { version: p.version } }),
  dismiss: (p: AgentProposal) => apiRequest<AgentProposal>(`${root}/proposals/${p.id}/dismiss`, { method: "POST", body: { version: p.version } }),
  proposal: (id: string) => apiRequest<AgentProposal>(`${root}/proposals/${id}`),
}

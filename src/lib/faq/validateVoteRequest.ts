interface VoteRequest {
  faqId: number
  isHelpful: boolean
  sessionId?: string
}

export function validateVoteRequest(data: unknown): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' }
  }

  const req = data as Partial<VoteRequest>

  if (typeof req.faqId !== 'number' || req.faqId <= 0) {
    return { valid: false, error: 'Invalid FAQ ID' }
  }

  if (typeof req.isHelpful !== 'boolean') {
    return { valid: false, error: 'Invalid vote value' }
  }

  return { valid: true }
}

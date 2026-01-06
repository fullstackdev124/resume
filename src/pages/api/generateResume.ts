import type { NextApiRequest, NextApiResponse } from 'next'

type Req = {
  account: string
  jobDesc: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { account, jobDesc, resumeText } = req.body as Req & { resumeText?: string }

  // Placeholder: here you'd call Claude API with the account resume and jobDesc
  // For now, return a simple patched resume including the provided resumeText
  const updated = `Updated resume for ${account}\n\nExisting resume:\n${resumeText || 'N/A'}\n\nJob fit:\n${jobDesc}\n\n(Generated content would appear here)`

  res.status(200).json({ resume: updated })
}

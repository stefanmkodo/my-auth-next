// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import * as Tokens from "@/backend/domain/tokens";

export default function handler(req, res) {
  const request = req.query;
  console.log(request);
  
  if (!request.clientId) {
    res.status(400).json({ok: false, error: "No clientId provided"});
    return;
  }
  
  const tokens = Tokens.getTokens(request.clientId);
  
  res.status(200).json({tokens: tokens});
}

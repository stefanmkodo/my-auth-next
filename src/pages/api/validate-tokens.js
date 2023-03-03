// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import * as Status from "@/backend/domain/status";

export default function handler(req, res) {
  console.log("req.body", req.body.tokens);
  
  if(!req.body.tokens) {
    res.status(400).json({ok: false, error: "No tokens provided"});
    return;
  }
  
  const result = Status.validateTokens(req.body.tokens);
  
  res.status(200).json({ok: true, result: result});
}

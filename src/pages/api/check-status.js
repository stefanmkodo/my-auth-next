// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import * as Status from "@/backend/domain/status";

export default function handler(req, res) {
  const request = req.query;
  
  if (!request.clientId) {
    res.status(400).json({ok: false, error: "No clientId provided"});
    return;
  }
  
  res.status(200).json({ok: true, status: Status.checkStatus(request.clientId)});
}

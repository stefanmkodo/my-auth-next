// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {generateClientId} from "@/backend/utils/generate";

export default function handler(req, res) {
  res.status(200).json({ok: true, clientId: generateClientId()});
}

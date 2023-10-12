// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {generateClientId, generatePassKey} from "@/backend/utils/generate";

export default function handler(req, res) {
  res.status(200).json({ ok: true, clientId: generateClientId(), passKey: generatePassKey(), hashedIP: "10161922A8042F8CC293BEF71803A66B2A300D0408CC0454E8685A668A02010A" });
}

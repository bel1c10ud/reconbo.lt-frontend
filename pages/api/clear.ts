import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("set-cookie", [
    `access_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict;`,
    `expiry_timestamp=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict;`,
    `region_code=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict;`,
  ]);
  res.status(200).send(`
  <!doctype html>
  <html>
    <head>
      <meta http-equiv="refresh" content="0;URL='/'" />
    </head>
    <body>
      <div hidden>${Date.now()}</div>
    </body>
  </html>
  `);
}

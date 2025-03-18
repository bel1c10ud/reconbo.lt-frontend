import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValorantOfficialWeb } from "@/type";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const reqLang = (await req.query.hasOwnProperty("lang"))
    ? req.query.lang instanceof Array
      ? req.query.lang[0]
      : req.query.lang
    : "en-US";
  const reqPageData = await axios({
    url: `https://playvalorant.com/page-data/${reqLang}/page-data.json`,
  });

  const data = await (reqPageData.data as ValorantOfficialWeb.PageData).result;

  res.status(200).json(data);
}

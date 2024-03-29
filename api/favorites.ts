import { VercelRequest, VercelResponse } from "@vercel/node";
import superagent, { ResponseError } from "superagent";
import {
  allowCorsRequest,
  setResponseHeaders,
  setSuperagentHeaders,
} from "../util";

export default async (req: VercelRequest, res: VercelResponse) => {
  if (!(await allowCorsRequest(req, res))) {
    return;
  }
  try {
    const id = Number(req.body.post_id);
    if (req.method === "POST" && id > 0) {
      const response = await setSuperagentHeaders(
        superagent.post("https://e621.net/favorites.json").send({
          post_id: id,
        }),
        req
      );
      return res.status(response.status).send(response.text);
    }
  } catch (e) {
    const error = e as ResponseError;
    return res.status(error.status).send(error.response?.text);
  }
  res.status(404).end();
};

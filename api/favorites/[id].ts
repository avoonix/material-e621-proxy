import { VercelRequest, VercelResponse } from "@vercel/node";
import superagent, { ResponseError } from "superagent";
import {
  allowCorsRequest,
  setResponseHeaders,
  setSuperagentHeaders,
} from "../../util";

export default async (req: VercelRequest, res: VercelResponse) => {
  if (!(await allowCorsRequest(req, res))) {
    return;
  }
  setResponseHeaders(res);
  try {
    if (req.method === "DELETE") {
      const id = Number(req.query.id);
      const response = await setSuperagentHeaders(
        superagent.delete(`https://e621.net/favorites/${id}.json`),
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

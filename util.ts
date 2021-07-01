import { VercelResponse, VercelRequest } from "@vercel/node";
import auth from "basic-auth";
import { Request } from "superagent";

export const setSuperagentHeaders = (agent: Request, req: VercelRequest) => {
  const ip = String(req.headers["x-real-ip"]);
  const user = auth(req);
  return agent
    .set("X-Forwarded-For", ip)
    .set(
      "User-Agent",
      `github.com/avoonix/material-e621-proxy (by Avoonix on e621) - forwarded for ${ip}`
    )
    .auth(user.name, user.pass)
    .accept("json");
};

export const setResponseHeaders = (res: VercelResponse) => {
  res.setHeader("Content-Type", "application/json");
};

export const allowCorsRequest = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  const allowedOrigins = [
    "https://material-e621.vercel.app",
    "http://localhost:8080",
  ];
  if (allowedOrigins.indexOf(req.headers.origin) === -1) {
    res.status(500).end();
    return false;
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return false;
  }
  return true;
};

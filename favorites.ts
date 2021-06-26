import { VercelResponse, VercelRequest } from "@vercel/node";

export default (req: VercelRequest, res: VercelResponse) => {
  return res.json({ message: "Test" });
};

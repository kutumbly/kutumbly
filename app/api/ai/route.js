import { runGAP } from "@/lib/ai/gap/gap-engine";

export async function POST(req) {
  const { input } = await req.json();

  const output = await runGAP(input);

  return Response.json({ output });
}

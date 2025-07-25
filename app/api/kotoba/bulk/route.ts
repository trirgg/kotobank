import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseClient"; 
const supabase = createServerClient()

export async function POST(req: NextRequest) {
  const kotobaList = await req.json();

  const { data, error } = await supabase.from("kotoba").insert(kotobaList);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Success", data });
}

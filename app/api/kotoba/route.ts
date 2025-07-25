import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseClient';
// import type { Database } from '@/types/supabase'; // optional

const supabase = createServerClient();    

export async function POST(req: Request) {
  const body = await req.json();

  const { kanji, kana, meaning, level, description , type, deck} = body;

  if (!kanji || !kana || !meaning || !level) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('kotoba')
    .insert([{ kanji, kana, meaning, level, description , type, deck}])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: 'Saved', data });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const deck = searchParams.get("deck");

  let query = supabase.from("kotoba").select("*");

  if (deck) {
    query = query.eq("deck", deck);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

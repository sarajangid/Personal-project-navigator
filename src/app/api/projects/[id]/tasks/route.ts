import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../../lib/supabaseClient';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { name } = await req.json();

  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Invalid task name' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ name, status: 'To Do', project_id: id }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

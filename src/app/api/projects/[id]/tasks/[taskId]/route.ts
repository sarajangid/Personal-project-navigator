import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../../../lib/supabaseClient';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  const { id, taskId } = params;
  const body = await req.json().catch(() => ({}));

  if (!body.status) {
    return NextResponse.json({ error: 'No status provided' }, { status: 400 });
  }

  // Update the task status only if task belongs to the project
  const { data, error } = await supabase
    .from('tasks')
    .update({ status: body.status })
    .eq('id', taskId)
    .eq('project_id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // not found
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  const { id, taskId } = params;

  // Delete only if task belongs to project
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('project_id', id);

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Task deleted' });
}

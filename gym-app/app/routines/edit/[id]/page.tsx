// app/routines/edit/[id]/page.tsx
import RoutineEditor from '@/components/RoutinesEditComponents/RoutineEditor';

export default async function Page(context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return <RoutineEditor routineId={id} />;
}

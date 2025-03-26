import prisma from '../../lib/prisma';

export default async function Dashboard() {
  const exercises = await prisma.exercise.findMany();

  return (
    
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Ejercicios en la base de datos: {exercises.length}</p>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id}>{exercise.name} - {exercise.description}</li>
        ))}
      </ul>
      
    </div>
  );
}
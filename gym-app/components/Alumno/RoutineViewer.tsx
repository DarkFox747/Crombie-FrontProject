'use client';
import { useState, useEffect, useRef } from 'react';
import VideoModal from './VideoModal';
import { useRouter } from 'next/navigation';
import {
  RoutineHistory,
  RoutineExercise,
  RoutineSet,
  Exercise,
} from '@prisma/client';

interface RoutineViewerProps {
  routine: RoutineHistory & {
    routineExercises: (RoutineExercise & {
      sets: RoutineSet[];
      exercise: Exercise; // Asegura que venga la info del ejercicio
    })[];
  };
  isEditable?: boolean;
}

export default function RoutineViewer({ routine, isEditable = true }: RoutineViewerProps) {
  const [weights, setWeights] = useState<Record<string, number | null>>({});
  const [videoUrl, setVideoUrl] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const timersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const loadingTimersRef = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    if (routine?.routineExercises) {
      const initialWeights: Record<string, number> = {};
      routine.routineExercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          if (set.weight !== null && set.weight !== undefined) {
            initialWeights[set.id] = set.weight;
          }
        });
      });
      setWeights(initialWeights);
    }
  }, [routine]);

  const handleWeightChange = (routineSetId: string, value: string) => {
    if (!isEditable) return;

    const numericValue = parseFloat(value);
    if (isNaN(numericValue) && value !== '') return;

    setWeights((prev) => ({ ...prev, [routineSetId]: value === '' ? null : numericValue }));

    if (timersRef.current[routineSetId]) {
      clearTimeout(timersRef.current[routineSetId]);
    }

    if (loadingTimersRef.current[routineSetId]) {
      clearTimeout(loadingTimersRef.current[routineSetId]);
      setIsLoading((prev) => ({ ...prev, [routineSetId]: false }));
    }

    timersRef.current[routineSetId] = setTimeout(async () => {
      if (value === '') return;

      setIsLoading((prev) => ({ ...prev, [routineSetId]: true }));

      try {
        const response = await fetch('/api/alumno/peso', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ routineSetId, weight: numericValue }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el peso');
        }

        router.refresh();
      } catch (error) {
        console.error('Error:', error);
        const prevValue = routine.routineExercises
          .flatMap((ex) => ex.sets)
          .find((set) => set.id === routineSetId)?.weight;

        setWeights((prev) => ({ ...prev, [routineSetId]: prevValue?? null }));
      } finally {
        loadingTimersRef.current[routineSetId] = setTimeout(() => {
          setIsLoading((prev) => ({ ...prev, [routineSetId]: false }));
          delete loadingTimersRef.current[routineSetId];
        }, 300);

        delete timersRef.current[routineSetId];
      }
    }, 800);
  };

  useEffect(() => {
    return () => {
      //eslint-disable-next-line
      Object.values(timersRef.current).forEach((timer) => clearTimeout(timer));
      //eslint-disable-next-line
      Object.values(loadingTimersRef.current).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const openVideo = (url: string) => {
    if (!url) return;
    setVideoUrl(url);
    setModalOpen(true);
  };

  const groupedByDay = routine.routineExercises.reduce((acc, ex) => {
    const dayName = ex.dayOfWeek;
    acc[dayName] = acc[dayName] || [];
    acc[dayName].push(ex);
    return acc;
  }, {} as Record<string, (RoutineExercise & { sets: RoutineSet[]; exercise: Exercise })[]>);

  const groupExercisesBySet = (
    exercises: (RoutineExercise & { sets: RoutineSet[]; exercise: Exercise })[]
  ) => {
    const setsMap = new Map();

    exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        const setKey = `Set ${set.sets}x${set.reps}`;
        if (!setsMap.has(setKey)) {
          setsMap.set(setKey, []);
        }
        setsMap.get(setKey).push({
          exercise: ex.exercise,
          setData: set,
        });
      });
    });

    return Array.from(setsMap.entries());
  };

  return (
    <>
      {!isEditable && (
        <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 text-yellow-200 px-4 py-2 rounded-lg mb-4">
          <p className="text-sm">Esta rutina está en modo visualización y no puede ser modificada.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedByDay).map(([day, exercises]) => (
          <div key={day} className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <h3 className="text-yellow-400 font-bold text-lg mb-3">{day}</h3>

            {groupExercisesBySet(exercises).map(([setName, exercisesInSet]) => (
              <div key={setName} className="mb-4">
                <h4 className="text-white font-medium mb-2">{setName}</h4>

                <ul className="space-y-2">
                  {exercisesInSet.map(({ exercise, setData }:{exercise:Exercise; setData:Exercise}) => (
                    <li key={`${exercise.id}-${setData.id}`} className="bg-gray-700 p-3 rounded-lg">
                      <button
                        onClick={() => openVideo(exercise.videoUrl || '')}
                        className="text-white font-medium hover:underline text-left w-full"
                        disabled={!exercise.videoUrl}
                      >
                        {exercise.name}
                        {exercise.videoUrl && (
                          <span className="ml-2 text-yellow-400 text-xs">(Ver video)</span>
                        )}
                      </button>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-gray-300 text-sm">Peso:</span>
                        <div className="relative w-28">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            placeholder="kg"
                            value={weights[setData.id] ?? ''}
                            onChange={(e) => handleWeightChange(setData.id, e.target.value)}
                            className={`p-1.5 rounded bg-gray-500 text-white w-full border ${
                              isEditable
                                ? 'border-yellow-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
                                : 'border-gray-600 opacity-80'
                            }`}
                            disabled={!isEditable || isLoading[setData.id]}
                            readOnly={!isEditable}
                          />
                          {isLoading[setData.id] && (
                            <div className="absolute inset-0 bg-gray-700 bg-opacity-50 rounded flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>

      <VideoModal open={modalOpen} onClose={() => setModalOpen(false)} videoUrl={videoUrl} />
    </>
  );
}

'use client';
import { useState } from 'react';
import VideoModal from './VideoModal';

export default function RoutineViewer({ routine }) {
  const [weights, setWeights] = useState({});
  const [videoUrl, setVideoUrl] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleWeightChange = async (exerciseId, value) => {
    setWeights((prev) => ({ ...prev, [exerciseId]: value }));
    await fetch('/api/alumno/peso', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ routineExerciseId: exerciseId, weight: value }),
    });
  };
  

  const openVideo = (url) => {
    setVideoUrl(url);
    setModalOpen(true);
  };

  const grouped = routine.routineExercises.reduce((acc, ex) => {
    acc[ex.dayOfWeek] = acc[ex.dayOfWeek] || [];
    acc[ex.dayOfWeek].push(ex);
    return acc;
  }, {});

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(grouped).map(([day, exercises]) => (
          <div key={day} className="bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="text-yellow-400 font-bold mb-2">{day}</h3>
            <ul className="space-y-3">
              {exercises.map((ex) => (
                <li key={ex.id} className="bg-gray-700 p-3 rounded flex flex-col gap-2">
                  <button
                    onClick={() => openVideo(ex.exercise.videoUrl)}
                    className="text-white text-left font-medium hover:underline"
                  >
                    {ex.exercise.name}
                  </button>
                  <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <p className="text-sm text-gray-300">
                      {ex.sets}x{ex.reps}
                    </p>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      placeholder="Peso (kg)"
                      value={weights[ex.id] || ex.weight || ''}
                      onChange={(e) => handleWeightChange(ex.id, e.target.value)}
                      className="p-1 rounded bg-gray-600 text-white w-full sm:w-28 text-sm border border-yellow-500"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <VideoModal open={modalOpen} onClose={() => setModalOpen(false)} videoUrl={videoUrl} />
    </>
  );
}

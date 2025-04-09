"use client";
import { useState } from 'react';

export default function RoutineGrid({ routine, exercises, onSave }) {
  const [days, setDays] = useState(
    routine.routineExercises.reduce((acc, re) => {
      if (!acc[re.dayOfWeek]) acc[re.dayOfWeek] = [];
      acc[re.dayOfWeek].push({ id: re.id, exerciseId: re.exerciseId, sets: re.sets, reps: re.reps });
      return acc;
    }, {})
  );
  const [newDay, setNewDay] = useState('');
  const [searchTerms, setSearchTerms] = useState({});
  const [openDropdowns, setOpenDropdowns] = useState({});

  const filteredExercises = (searchTerm) =>
    exercises.filter((ex) => ex.name.toLowerCase().includes((searchTerm || '').toLowerCase()));

  const addDay = () => {
    const trimmedDay = newDay.trim();
    if (trimmedDay && !days[trimmedDay]) {
      setDays((prev) => ({
        ...prev,
        [trimmedDay]: []
      }));
      setNewDay('');
    }
  };

  const removeDay = (dayToRemove) => {
    setDays((prev) => {
      const updatedDays = { ...prev };
      delete updatedDays[dayToRemove];
      return updatedDays;
    });
  };

  const addExercise = (day) => {
    setDays((prev) => ({
      ...prev,
      [day]: [...prev[day], { exerciseId: '', sets: 3, reps: 10 }],
    }));
  };

  const removeLastExercise = (day) => {
    if (days[day].length > 0) {
      setDays((prev) => ({
        ...prev,
        [day]: prev[day].slice(0, -1),
      }));
    }
  };

  const updateExercise = (day, index, exerciseId) => {
    setDays((prev) => {
      const updatedDay = prev[day].map((ex, i) =>
        i === index ? { ...ex, exerciseId } : ex
      );
      return { ...prev, [day]: updatedDay };
    });
    setSearchTerms((prev) => ({ ...prev, [`${day}-${index}`]: '' }));
    setOpenDropdowns((prev) => ({ ...prev, [`${day}-${index}`]: false }));
  };

  const updateSets = (day, index, field, value) => {
    setDays((prev) => {
      const updatedDay = prev[day].map((ex, i) =>
        i === index ? { ...ex, [field]: parseInt(value) || 0 } : ex
      );
      return { ...prev, [day]: updatedDay };
    });
  };

  const handleSave = () => {
    const updatedRoutineExercises = Object.entries(days).flatMap(([day, exercises]) =>
      exercises.map((ex) => ({
        dayOfWeek: day,
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
      }))
    );
    onSave(updatedRoutineExercises);
  };

  return (
    <div className="p-6 bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-lg">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Editar Rutina</h2>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={newDay}
          onChange={(e) => setNewDay(e.target.value)}
          placeholder="Nuevo día (ej. Lunes)"
          className="p-2 rounded-lg bg-gray-700 text-white border border-yellow-500 flex-grow"
        />
        <button
          onClick={addDay}
          className="ml-2 bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-400"
        >
          Agregar Día
        </button>
      </div>

      {/* Días sin ejercicios */}
      {Object.keys(days).filter(day => days[day].length === 0).map(day => (
        <div key={`empty-${day}`} className="mb-4 p-3 bg-gray-700 rounded-lg flex justify-between items-center">
          <div>
            <span className="text-yellow-400 font-semibold">{day}</span>
            <span className="ml-2 text-gray-400">(Sin ejercicios)</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => addExercise(day)}
              className="bg-yellow-500 text-gray-900 px-2 py-1 rounded-lg hover:bg-yellow-400"
            >
              + Ejercicio
            </button>
            <button
              onClick={() => removeDay(day)}
              className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
            >
              Eliminar día
            </button>
          </div>
        </div>
      ))}

      {/* Grilla - Solo días con ejercicios */}
      {Object.keys(days).filter(day => days[day].length > 0).length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-200">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-3 text-yellow-400">Días</th>
                <th className="p-3 text-yellow-400">Ejercicios</th>
                <th className="p-3 text-yellow-400">Sets</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(days)
                .filter(([_, dayExercises]) => dayExercises.length > 0)
                .flatMap(([day, dayExercises]) =>
                  dayExercises.map((ex, index) => {
                    const rowKey = `${day}-${index}`;
                    const searchTerm = searchTerms[rowKey] || '';
                    return (
                      <tr key={rowKey} className="border-b border-gray-600">
                        {index === 0 && (
                          <td className="p-3" rowSpan={dayExercises.length}>
                            <input
                              type="text"
                              value={day}
                              onChange={(e) => {
                                const newDayName = e.target.value.trim();
                                if (newDayName && !days[newDayName] && newDayName !== day) {
                                  setDays(prev => {
                                    const newDays = { ...prev };
                                    newDays[newDayName] = newDays[day];
                                    delete newDays[day];
                                    return newDays;
                                  });
                                }
                              }}
                              className="bg-gray-700 text-white border border-yellow-500 rounded p-1 w-full"
                            />
                            <div className="flex space-x-2 mt-2">
                              <button
                                onClick={() => addExercise(day)}
                                className="bg-yellow-500 text-gray-900 px-2 py-1 rounded-lg hover:bg-yellow-400"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeLastExercise(day)}
                                className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                              >
                                −
                              </button>
                            </div>
                          </td>
                        )}
                        <td className="p-3 relative">
                          <input
                            type="text"
                            value={searchTerm || exercises.find((e) => e.id === ex.exerciseId)?.name || ''}
                            onChange={(e) => {
                              setSearchTerms({ ...searchTerms, [rowKey]: e.target.value });
                              setOpenDropdowns({ ...openDropdowns, [rowKey]: true });
                            }}
                            onFocus={() => setOpenDropdowns({ ...openDropdowns, [rowKey]: true })}
                            onBlur={() => setTimeout(() => setOpenDropdowns({ ...openDropdowns, [rowKey]: false }), 200)}
                            placeholder="Buscar ejercicio..."
                            className="w-full p-1 bg-gray-700 text-white border border-yellow-500 rounded"
                          />
                          {openDropdowns[rowKey] && (
                            <ul className="absolute z-20 mt-1 max-h-40 overflow-y-auto bg-gray-700 rounded-lg w-full shadow-lg">
                              {filteredExercises(searchTerm).map((exercise) => (
                                <li
                                  key={exercise.id}
                                  onClick={() => updateExercise(day, index, exercise.id)}
                                  className="p-2 hover:bg-yellow-500 hover:text-gray-900 cursor-pointer"
                                >
                                  {exercise.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={ex.sets}
                            onChange={(e) => updateSets(day, index, 'sets', e.target.value)}
                            className="w-16 p-1 bg-gray-700 text-white border border-yellow-500 rounded mr-2"
                          />
                          x
                          <input
                            type="number"
                            value={ex.reps}
                            onChange={(e) => updateSets(day, index, 'reps', e.target.value)}
                            className="w-16 p-1 bg-gray-700 text-white border border-yellow-500 rounded ml-2"
                          />
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleSave}
        className="mt-4 bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-400"
      >
        Guardar Cambios
      </button>
    </div>
  );
}
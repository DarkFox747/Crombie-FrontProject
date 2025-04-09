"use client";
import { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function RoutineGrid({ routine, exercises, onSave }) {
  const [days, setDays] = useState(
    routine.routineExercises.reduce((acc, re) => {
      if (!acc[re.dayOfWeek]) acc[re.dayOfWeek] = [];
      acc[re.dayOfWeek].push({
        id: re.id,
        exerciseId: re.exerciseId,
        sets: [{ sets: re.sets, reps: re.reps, weight: re.weight || '' }],
      });
      return acc;
    }, {})
  );
  const [newDay, setNewDay] = useState('');
  const [searchTerms, setSearchTerms] = useState({});
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [weightErrors, setWeightErrors] = useState({});

  const filteredExercises = (searchTerm) =>
    exercises.filter((ex) => ex.name.toLowerCase().includes((searchTerm || '').toLowerCase()));

  const addDay = () => {
    const trimmedDay = newDay.trim();
    if (trimmedDay && !days[trimmedDay]) {
      setDays((prev) => ({ ...prev, [trimmedDay]: [] }));
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
      [day]: [...prev[day], { exerciseId: '', sets: prev[day][0]?.sets.map(() => ({ sets: 3, reps: 10, weight: '' })) || [{ sets: 3, reps: 10, weight: '' }] }],
    }));
  };

  const removeExercise = (day, index) => {
    setDays((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
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

  const updateSetHeader = (day, setIndex, field, value) => {
    setDays((prev) => {
      const updatedDay = prev[day].map((ex) => ({
        ...ex,
        sets: ex.sets.map((set, i) =>
          i === setIndex ? { ...set, [field]: parseInt(value) || 0 } : set
        ),
      }));
      return { ...prev, [day]: updatedDay };
    });
  };

  const updateWeight = (day, exerciseIndex, setIndex, value) => {
    const numValue = value === '' ? '' : parseFloat(value);
    const errorKey = `${day}-${exerciseIndex}-${setIndex}`;
    if (value !== '' && isNaN(numValue)) {
      setWeightErrors((prev) => ({ ...prev, [errorKey]: 'Solo números' }));
    } else {
      setWeightErrors((prev) => ({ ...prev, [errorKey]: null }));
      setDays((prev) => {
        const updatedDay = prev[day].map((ex, i) =>
          i === exerciseIndex
            ? {
                ...ex,
                sets: ex.sets.map((set, j) =>
                  j === setIndex ? { ...set, weight: numValue } : set
                ),
              }
            : ex
        );
        return { ...prev, [day]: updatedDay };
      });
    }
  };

  const addSetColumn = (day) => {
    setDays((prev) => {
      const updatedDay = prev[day].map((ex) => ({
        ...ex,
        sets: [...ex.sets, { sets: 3, reps: 10, weight: '' }],
      }));
      return { ...prev, [day]: updatedDay };
    });
  };

  const removeSetColumn = (day, setIndex) => {
    setDays((prev) => {
      const updatedDay = prev[day].map((ex) => ({
        ...ex,
        sets: ex.sets.filter((_, i) => i !== setIndex),
      }));
      return { ...prev, [day]: updatedDay };
    });
  };

  const handleSave = () => {
    const updatedRoutineExercises = Object.entries(days).flatMap(([day, exercises]) =>
      exercises.map((ex) =>
        ex.sets.map((set) => ({
          dayOfWeek: day,
          exerciseId: ex.exerciseId,
          sets: set.sets,
          reps: set.reps,
          weight: set.weight === '' ? null : set.weight,
        }))
      )
    ).flat();
    onSave(updatedRoutineExercises);
  };

  return (
    <div className="p-6 bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-lg">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Editar Rutina</h2>
      <div className="mb-6 flex items-center">
        <input
          type="text"
          value={newDay}
          onChange={(e) => setNewDay(e.target.value)}
          placeholder="Nuevo día (ej. Lunes)"
          className="p-2 rounded-lg bg-gray-700 text-white border border-yellow-500 flex-grow"
        />
        <button
          onClick={addDay}
          className="ml-2 bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Agregar Día
        </button>
      </div>

      {/* Lista de días */}
      {Object.entries(days).map(([day, dayExercises]) => (
        <div key={day} className="mb-6 p-4 bg-gray-700 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3">
            <input
              type="text"
              value={day}
              onChange={(e) => {
                const newDayName = e.target.value;
                if (newDayName && !days[newDayName] && newDayName !== day) {
                  setDays((prev) => {
                    const newDays = { ...prev };
                    newDays[newDayName] = newDays[day];
                    delete newDays[day];
                    return newDays;
                  });
                }
              }}
              onKeyDown={(e) => e.stopPropagation()}
              className="text-xl font-semibold text-yellow-400 bg-gray-700 border border-yellow-500 rounded p-1 w-1/2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={() => removeDay(day)}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
              title="Eliminar Día"
            >
              <FaTrash />
            </button>
          </div>
          <button
            onClick={() => addExercise(day)}
            className="mb-3 bg-yellow-500 text-gray-900 px-3 py-1 rounded-lg hover:bg-yellow-400 transition-colors flex items-center space-x-1"
          >
            <FaPlus />
            <span>Agregar Ejercicio</span>
          </button>

          {/* Tabla de ejercicios */}
          {dayExercises.length === 0 ? (
            <div className="text-gray-400 italic">Sin ejercicios</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-500">
                <thead>
                  <tr className="bg-gray-600 text-yellow-400">
                    <th className="border border-gray-500 p-2 text-left">Ejercicios</th>
                    {dayExercises[0].sets.map((_, setIndex) => (
                      <th key={setIndex} className="border border-gray-500 p-2">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              value={dayExercises[0].sets[setIndex].sets}
                              onChange={(e) => updateSetHeader(day, setIndex, 'sets', e.target.value)}
                              className="w-12 p-1 bg-gray-500 text-white border border-yellow-500 rounded text-center"
                              placeholder="Sets"
                            />
                            <span>x</span>
                            <input
                              type="number"
                              value={dayExercises[0].sets[setIndex].reps}
                              onChange={(e) => updateSetHeader(day, setIndex, 'reps', e.target.value)}
                              className="w-12 p-1 bg-gray-500 text-white border border-yellow-500 rounded text-center"
                              placeholder="Reps"
                            />
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => removeSetColumn(day, setIndex)}
                              className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                              title="Eliminar Columna"
                            >
                              <FaTrash size={12} />
                            </button>
                            {setIndex === dayExercises[0].sets.length - 1 && (
                              <button
                                onClick={() => addSetColumn(day)}
                                className="bg-yellow-500 text-gray-900 p-1 rounded hover:bg-yellow-400 transition-colors"
                                title="Agregar Columna"
                              >
                                <FaPlus size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dayExercises.map((ex, exerciseIndex) => {
                    const rowKey = `${day}-${exerciseIndex}`;
                    const searchTerm = searchTerms[rowKey] || '';
                    return (
                      <tr key={rowKey} className="border border-gray-500">
                        <td className="border border-gray-500 p-2 relative">
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
                            className="w-full p-1 bg-gray-600 text-white border border-yellow-500 rounded"
                          />
                          {openDropdowns[rowKey] && (
                            <ul className="absolute z-30 mt-1 max-h-40 overflow-y-auto bg-gray-700 rounded-lg w-full shadow-lg">
                              {filteredExercises(searchTerm).map((exercise) => (
                                <li
                                  key={exercise.id}
                                  onClick={() => updateExercise(day, exerciseIndex, exercise.id)}
                                  className="p-2 hover:bg-yellow-500 hover:text-gray-900 cursor-pointer"
                                >
                                  {exercise.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                        {ex.sets.map((set, setIndex) => {
                          const weightKey = `${day}-${exerciseIndex}-${setIndex}`;
                          return (
                            <td key={setIndex} className="border border-gray-500 p-2">
                              <input
                                type="number"
                                step="0.1"
                                value={set.weight}
                                onChange={(e) => updateWeight(day, exerciseIndex, setIndex, e.target.value)}
                                className="w-full p-1 bg-gray-600 text-white border border-yellow-500 rounded text-center"
                                placeholder="Peso (kg)"
                              />
                              {weightErrors[weightKey] && (
                                <span className="text-red-500 text-sm block mt-1">{weightErrors[weightKey]}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleSave}
        className="mt-4 bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
      >
        Guardar Cambios
      </button>
    </div>
  );
}
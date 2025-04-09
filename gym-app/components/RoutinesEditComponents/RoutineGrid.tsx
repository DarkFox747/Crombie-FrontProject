"use client";
import { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

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
      [day]: [...prev[day], { exerciseId: '', sets: 3, reps: 10 }],
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
              onKeyDown={(e) => e.stopPropagation()} // Evitar pérdida de foco
              className="text-xl font-semibold text-yellow-400 bg-gray-700 border border-yellow-500 rounded p-1 w-1/2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => addExercise(day)}
                className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-lg hover:bg-yellow-400 transition-colors flex items-center space-x-1"
                title="Agregar Ejercicio"
              >
                <FaPlus />
                <span>Agregar Ejercicio</span>
              </button>
              <button
                onClick={() => removeDay(day)}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                title="Eliminar Día"
              >
                <FaTrash />
              </button>
            </div>
          </div>

          {/* Ejercicios */}
          {dayExercises.length === 0 ? (
            <div className="text-gray-400 italic">Sin ejercicios</div>
          ) : (
            dayExercises.map((ex, index) => {
              const rowKey = `${day}-${index}`;
              const searchTerm = searchTerms[rowKey] || '';
              return (
                <div key={rowKey} className="flex items-center space-x-4 mb-2">
                  <div className="flex-grow relative">
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
                      className="w-full p-2 bg-gray-600 text-white border border-yellow-500 rounded"
                    />
                    {openDropdowns[rowKey] && (
                      <ul className="absolute z-30 mt-1 max-h-40 overflow-y-auto bg-gray-700 rounded-lg w-full shadow-lg">
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
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={ex.sets}
                      onChange={(e) => updateSets(day, index, 'sets', e.target.value)}
                      className="w-16 p-2 bg-gray-600 text-white border border-yellow-500 rounded"
                    />
                    <span className="text-yellow-400">x</span>
                    <input
                      type="number"
                      value={ex.reps}
                      onChange={(e) => updateSets(day, index, 'reps', e.target.value)}
                      className="w-16 p-2 bg-gray-600 text-white border border-yellow-500 rounded"
                    />
                  </div>
                  <button
                    onClick={() => removeExercise(day, index)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    title="Eliminar Ejercicio"
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })
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
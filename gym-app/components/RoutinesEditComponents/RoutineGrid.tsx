"use client";
import { useState, useEffect } from 'react';

export default function RoutineGrid({ routine, exercises, onSave }) {
  const [days, setDays] = useState(
    routine.routineExercises.reduce((acc, re) => {
      if (!acc[re.dayOfWeek]) acc[re.dayOfWeek] = [];
      acc[re.dayOfWeek].push({ id: re.id, exerciseId: re.exerciseId, sets: re.sets, reps: re.reps });
      return acc;
    }, {})
  );
  const [newDay, setNewDay] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addDay = () => {
    if (newDay && !days[newDay.trim()]) { // Verificar que no esté vacío y no exista
      setDays({ ...days, [newDay.trim()]: [] });
      setNewDay('');
    }
  };

  const addExercise = (day) => {
    setDays({
      ...days,
      [day]: [...days[day], { exerciseId: '', sets: 3, reps: 10 }],
    });
  };

  const updateExercise = (day, index, exerciseId) => {
    const updatedDay = days[day].map((ex, i) =>
      i === index ? { ...ex, exerciseId } : ex
    );
    setDays({ ...days, [day]: updatedDay });
    setSearchTerm(''); // Resetear búsqueda al seleccionar
    setIsDropdownOpen(false);
  };

  const updateSets = (day, index, field, value) => {
    const updatedDay = days[day].map((ex, i) =>
      i === index ? { ...ex, [field]: parseInt(value) || 0 } : ex
    );
    setDays({ ...days, [day]: updatedDay });
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

      {/* Grilla */}
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
            {Object.entries(days).flatMap(([day, dayExercises], dayIndex) =>
              dayExercises.map((ex, index) => (
                <tr key={`${day}-${index}`} className="border-b border-gray-600">
                  {index === 0 && (
                    <td className="p-3" rowSpan={dayExercises.length}>
                      <input
                        type="text"
                        value={day}
                        onChange={(e) => {
                          const newDayName = e.target.value.trim();
                          if (newDayName && !days[newDayName]) {
                            const newDays = { ...days };
                            newDays[newDayName] = newDays[day];
                            delete newDays[day];
                            setDays(newDays);
                          }
                        }}
                        className="bg-gray-700 text-white border border-yellow-500 rounded p-1 w-full"
                      />
                      <button
                        onClick={() => addExercise(day)}
                        className="mt-2 bg-yellow-500 text-gray-900 px-2 py-1 rounded-lg hover:bg-yellow-400"
                      >
                        +
                      </button>
                    </td>
                  )}
                  <td className="p-3 relative">
                    <input
                      type="text"
                      value={
                        searchTerm && day === Object.keys(days)[dayIndex] && index === dayExercises.length - 1
                          ? searchTerm
                          : exercises.find((e) => e.id === ex.exerciseId)?.name || ''
                      }
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder="Buscar ejercicio..."
                      className="w-full p-1 bg-gray-700 text-white border border-yellow-500 rounded"
                    />
                    {isDropdownOpen && searchTerm && (
                      <ul className="absolute z-10 mt-1 max-h-40 overflow-y-auto bg-gray-700 rounded-lg w-full">
                        {filteredExercises.map((exercise) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSave}
        className="mt-4 bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-400"
      >
        Guardar Cambios
      </button>
    </div>
  );
}
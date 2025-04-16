"use client";
import { useState } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

export default function RoutineGrid({ routine, exercises, onSave }) {
  const [days, setDays] = useState(() => {
    const grouped = routine.routineExercises.reduce((acc, re) => {
      if (!acc[re.dayOfWeek]) acc[re.dayOfWeek] = [];
      
      // Mapea correctamente los sets desde Prisma
      acc[re.dayOfWeek].push({
        id: re.id,
        exerciseId: re.exerciseId,
        sets: re.sets.map(s => ({
          sets: s.sets,
          reps: s.reps,
          weight: s.weight ?? ''
        }))
      });
      
      return acc;
    }, {} as Record<string, any[]>);
    
    return grouped;
  });
  
  const [newDay, setNewDay] = useState('');
  const [searchTerms, setSearchTerms] = useState({});
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [weightErrors, setWeightErrors] = useState({});
  const [editingDay, setEditingDay] = useState(null);

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
    // Establecemos el searchTerm como undefined para que se muestre el ejercicio seleccionado
    setSearchTerms((prev) => ({ ...prev, [`${day}-${index}`]: undefined }));
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
    const updatedRoutineExercises = Object.entries(days).map(([day, exercises]) =>
      exercises.map((ex) => ({
        dayOfWeek: day,
        exerciseId: ex.exerciseId,
        sets: ex.sets.map((set) => ({
          sets: set.sets,
          reps: set.reps,
          weight: set.weight === '' ? null : set.weight,
        })),
      }))
    ).flat();
  
    onSave(updatedRoutineExercises);
  };
  

  return (
    <div className="p-4 md:p-6 bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl">
      <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-4 flex items-center">
        Editar Rutina
      </h2>
      
      {/* Añadir día */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-2">
        <input
          type="text"
          value={newDay}
          onChange={(e) => setNewDay(e.target.value)}
          placeholder="Nuevo día (ej. Lunes)"
          className="p-2 rounded-lg bg-gray-700 text-white border border-yellow-500 w-full md:w-auto flex-grow"
          onKeyDown={(e) => e.key === 'Enter' && addDay()}
        />
        <button
          onClick={addDay}
          className="w-full md:w-auto bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center"
        >
          <FaPlus className="mr-2" /> Agregar Día
        </button>
      </div>

      {/* Lista de días */}
      <div className="space-y-6 relative">
        {Object.entries(days).length === 0 ? (
          <div className="p-8 text-center bg-gray-700 rounded-lg text-gray-300">
            <p className="text-lg">No hay días configurados</p>
            <p className="text-sm mt-2">Agrega un día para comenzar tu rutina</p>
          </div>
        ) : (
          Object.entries(days).map(([day, dayExercises]) => (
            <div key={day} className="bg-gray-700 rounded-lg shadow-md overflow-hidden">
              {/* Encabezado del día */}
              <div className="bg-gray-600 p-3 flex flex-wrap justify-between items-center gap-2">
                {editingDay === day ? (
                  <input
                    type="text"
                    value={day}
                    autoFocus
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
                    onBlur={() => setEditingDay(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setEditingDay(null);
                      }
                      e.stopPropagation();
                    }}
                    className="text-lg font-semibold text-yellow-400 bg-gray-700 border border-yellow-500 rounded p-1 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                ) : (
                  <div className="flex items-center">
                    <h3 className="text-lg md:text-xl font-semibold text-yellow-400">{day}</h3>
                    <button
                      onClick={() => setEditingDay(day)}
                      className="ml-2 text-gray-300 hover:text-yellow-400"
                    >
                      <FaEdit size={16} />
                    </button>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => addExercise(day)}
                    className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-lg hover:bg-yellow-400 transition-colors flex items-center"
                  >
                    <FaPlus size={12} className="mr-1" /> Ejercicio
                  </button>
                  <button
                    onClick={() => removeDay(day)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    title="Eliminar Día"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>

              {/* Contenido de ejercicios */}
              <div className="p-3">
                {dayExercises.length === 0 ? (
                  <div className="text-gray-400 italic p-4 text-center">
                    Sin ejercicios. Agrega uno para comenzar.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
{/* Vista móvil - Cards con form */}
<form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="md:hidden space-y-4">
  {dayExercises.map((ex, exerciseIndex) => {
    const rowKey = `${day}-${exerciseIndex}`;
    const searchTerm = searchTerms[rowKey];
    const exerciseName = exercises.find((e) => e.id === ex.exerciseId)?.name || '';

    return (
      <fieldset key={rowKey} className="bg-gray-800 rounded-lg p-3 relative border border-yellow-500">
        <legend className="text-yellow-400 font-semibold mb-2">Ejercicio #{exerciseIndex + 1}</legend>

        <div className="flex justify-between items-center mb-3">
          <div className="relative w-full">
            <label htmlFor={`exercise-${rowKey}`} className="sr-only">Buscar ejercicio</label>
            <input
              id={`exercise-${rowKey}`}
              type="text"
              value={searchTerm !== undefined ? searchTerm : exerciseName}
              onChange={(e) => {
                setSearchTerms((prev) => ({ ...prev, [rowKey]: e.target.value }));
                setOpenDropdowns((prev) => ({ ...prev, [rowKey]: true }));
              }}
              onFocus={() => {
                if (searchTerm === undefined) {
                  setSearchTerms((prev) => ({ ...prev, [rowKey]: '' }));
                }
                setOpenDropdowns((prev) => ({ ...prev, [rowKey]: true }));
              }}
              onBlur={() => setTimeout(() => {
                if (!searchTerms[rowKey]) {
                  setSearchTerms((prev) => ({ ...prev, [rowKey]: undefined }));
                }
                setOpenDropdowns((prev) => ({ ...prev, [rowKey]: false }));
              }, 200)}
              placeholder="Buscar ejercicio..."
              className="w-full p-2 bg-gray-700 text-white border border-yellow-500 rounded-lg"
            />
            {openDropdowns[rowKey] && (
              <ul className="absolute z-50 mt-1 max-h-64 overflow-y-auto bg-gray-700 rounded-lg w-full shadow-lg border border-yellow-400">
                {filteredExercises(searchTerm).length > 0 ? (
                  filteredExercises(searchTerm).map((exercise) => (
                    <li
                      key={exercise.id}
                      onClick={() => updateExercise(day, exerciseIndex, exercise.id)}
                      className="p-2 hover:bg-yellow-500 hover:text-gray-900 cursor-pointer"
                    >
                      {exercise.name}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-400 italic">No se encontraron ejercicios</li>
                )}
              </ul>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeExercise(day, exerciseIndex)}
            className="ml-2 bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 transition-colors"
            aria-label="Eliminar ejercicio"
          >
            <FaTrash size={12} />
          </button>
        </div>

        {ex.sets.map((set, setIndex) => {
          const weightKey = `${day}-${exerciseIndex}-${setIndex}`;
          return (
            <div key={setIndex} className="bg-gray-700 p-2 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-yellow-400 font-medium">Serie {setIndex + 1}</label>
                {ex.sets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSetColumn(day, setIndex)}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                    aria-label="Eliminar serie"
                  >
                    <FaTrash size={10} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor={`sets-${rowKey}-${setIndex}`} className="text-xs text-gray-400 block">Series</label>
                  <input
                    id={`sets-${rowKey}-${setIndex}`}
                    type="number"
                    value={set.sets}
                    onChange={(e) => updateSetHeader(day, setIndex, 'sets', e.target.value)}
                    className="w-full p-1 bg-gray-600 text-white border border-yellow-500 rounded text-center"
                  />
                </div>
                <div>
                  <label htmlFor={`reps-${rowKey}-${setIndex}`} className="text-xs text-gray-400 block">Reps</label>
                  <input
                    id={`reps-${rowKey}-${setIndex}`}
                    type="number"
                    value={set.reps}
                    onChange={(e) => updateSetHeader(day, setIndex, 'reps', e.target.value)}
                    className="w-full p-1 bg-gray-600 text-white border border-yellow-500 rounded text-center"
                  />
                </div>
                <div>
                  <label htmlFor={`weight-${rowKey}-${setIndex}`} className="text-xs text-gray-400 block">Peso (kg)</label>
                  <input
                    id={`weight-${rowKey}-${setIndex}`}
                    type="number"
                    step="0.1"
                    value={set.weight}
                    onChange={(e) => updateWeight(day, exerciseIndex, setIndex, e.target.value)}
                    className="w-full p-1 bg-gray-600 text-white border border-yellow-500 rounded text-center"
                  />
                  {weightErrors[weightKey] && (
                    <span className="text-red-500 text-xs">{weightErrors[weightKey]}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => addSetColumn(day)}
          className="mt-3 w-full bg-gray-600 text-yellow-400 p-2 rounded-lg hover:bg-gray-500 transition-colors flex items-center justify-center"
        >
          <FaPlus size={12} className="mr-1" /> Agregar Serie
        </button>
      </fieldset>
    );
  })}
</form>

                    
                    {/* Vista desktop - Tabla */}
                    <div className="hidden md:block">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-600 text-yellow-400">
                            <th className="border border-gray-500 p-2 text-left min-w-48">Ejercicios</th>
                            {dayExercises[0].sets.map((_, setIndex) => (
                              <th key={setIndex} className="border border-gray-500 p-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex space-x-2 items-center">
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
                                    {dayExercises[0].sets.length > 1 && (
                                      <button
                                        onClick={() => removeSetColumn(day, setIndex)}
                                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                                        title="Eliminar Columna"
                                      >
                                        <FaTrash size={12} />
                                      </button>
                                    )}
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
                            <th className="border border-gray-500 p-2 w-12"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {dayExercises.map((ex, exerciseIndex) => {
                            const rowKey = `${day}-${exerciseIndex}`;
                            const searchTerm = searchTerms[rowKey];
                            return (
                              <tr key={rowKey} className="border border-gray-500 hover:bg-gray-600">
                                <td className="border border-gray-500 p-2 relative">
                                  <input
                                    type="text"
                                    value={searchTerm !== undefined ? searchTerm : exercises.find((e) => e.id === ex.exerciseId)?.name || ''}
                                    onChange={(e) => {
                                      setSearchTerms((prev) => ({ ...prev, [rowKey]: e.target.value }));
                                      setOpenDropdowns((prev) => ({ ...prev, [rowKey]: true }));
                                    }}
                                    onFocus={(e) => {
                                      // Al enfocar, siempre usamos el searchTerm actual y no el nombre del ejercicio
                                      if (searchTerm === undefined) {
                                        setSearchTerms((prev) => ({ ...prev, [rowKey]: '' }));
                                      }
                                      setOpenDropdowns((prev) => ({ ...prev, [rowKey]: true }));
                                    }}
                                    onBlur={() => setTimeout(() => {
                                      if (!searchTerms[rowKey]) {
                                        // Si no hay término de búsqueda al perder el foco, mostrar el ejercicio seleccionado
                                        setSearchTerms((prev) => ({ ...prev, [rowKey]: undefined }));
                                      }
                                      setOpenDropdowns((prev) => ({ ...prev, [rowKey]: false }));
                                    }, 200)}
                                    placeholder="Buscar ejercicio..."
                                    className="w-full p-1 bg-gray-600 text-white border border-yellow-500 rounded"
                                  />
                                  {openDropdowns[rowKey] && (
                                    <ul className="fixed z-50 mt-1 max-h-64 overflow-y-auto bg-gray-700 rounded-lg shadow-lg border border-yellow-400 w-64">
                                      {filteredExercises(searchTerm).length > 0 ? (
                                        filteredExercises(searchTerm).map((exercise) => (
                                          <li
                                            key={exercise.id}
                                            onClick={() => updateExercise(day, exerciseIndex, exercise.id)}
                                            className="p-2 hover:bg-yellow-500 hover:text-gray-900 cursor-pointer"
                                          >
                                            {exercise.name}
                                          </li>
                                        ))
                                      ) : (
                                        <li className="p-2 text-gray-400 italic">No se encontraron ejercicios</li>
                                      )}
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
                                        <span className="text-red-500 text-xs block mt-1">{weightErrors[weightKey]}</span>
                                      )}
                                    </td>
                                  );
                                })}
                                <td className="border border-gray-500 p-2 text-center">
                                  <button
                                    onClick={() => removeExercise(day, exerciseIndex)}
                                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                                    title="Eliminar Ejercicio"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSave}
          className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg flex items-center"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
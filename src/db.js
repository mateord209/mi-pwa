const API = 'http://localhost:3000/api';

export async function listarTareas() {
  const res = await fetch(`${API}/tareas`);
  if (!res.ok) throw new Error('Error al cargar tareas');
  return res.json();
}

export async function agregarTarea(titulo) {
  const res = await fetch(`${API}/tareas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo })
  });
  if (!res.ok) throw new Error('Error al guardar la tarea');
}

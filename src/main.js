import { registerSW } from 'virtual:pwa-register';
import { listarTareas, agregarTarea } from './db.js';

registerSW({ immediate: true });

document.querySelector('#app').innerHTML = `
  <h1>Tareas</h1>
  <input id="titulo" placeholder="Nueva tarea" />
  <button id="agregar">Agregar</button>
  <p id="aviso" style="color:red"></p>
  <ul id="lista"></ul>
`;

const aviso = document.querySelector('#aviso');

function escapar(texto) {
  const d = document.createElement('div');
  d.textContent = texto;
  return d.innerHTML;
}

async function cargar() {
  try {
    const tareas = await listarTareas();
    document.querySelector('#lista').innerHTML = tareas
      .map(t => `<li>${escapar(t.titulo)}</li>`)
      .join('');
    aviso.textContent = '';
  } catch (e) {
    aviso.textContent = 'No se pudo conectar con el servidor.';
  }
}

document.querySelector('#agregar').onclick = async () => {
  const input = document.querySelector('#titulo');
  if (!input.value.trim()) return;
  try {
    await agregarTarea(input.value.trim());
    input.value = '';
    cargar();
  } catch (e) {
    aviso.textContent = 'No se pudo guardar la tarea.';
  }
};

cargar();

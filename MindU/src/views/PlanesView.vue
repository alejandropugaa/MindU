<template>
  <div class="container my-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">📆 Tu Plan Diario</h2>
      <span class="badge bg-success fs-6">{{ hoy }}</span>
    </div>

    <div class="card shadow-lg border-0">
      <div class="card-body p-4">
        <div class="progress mb-4" style="height: 25px;">
          <div 
            class="progress-bar bg-gradient-success" 
            role="progressbar" 
            :style="{ width: progreso + '%' }"
          >
            {{ progreso }}%
          </div>
        </div>

        <ul class="list-group list-group-flush">
          <li 
            class="list-group-item py-3 d-flex align-items-center" 
            v-for="(tarea, index) in tareas" 
            :key="index"
          >
            <input 
              class="form-check-input me-3 fs-4" 
              type="checkbox" 
              v-model="tarea.completado"
              :id="'task-'+index"
            >
            <div class="flex-grow-1">
              <label 
                :for="'task-'+index" 
                class="fs-5"
                :class="{ 'text-decoration-line-through text-muted': tarea.completado }"
              >
                {{ tarea.texto }}
              </label>
              <div class="small text-muted">{{ tarea.categoria }}</div>
            </div>
            <span v-if="tarea.completado" class="badge bg-primary rounded-pill">¡Hecho!</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

const tareas = ref([
  { texto: "Escribir 3 cosas positivas", categoria: "Journaling", completado: false },
  { texto: "Respiración profunda (5 min)", categoria: "Mindfulness", completado: false },
  { texto: "Beber 2 litros de agua", categoria: "Físico", completado: false },
  { texto: "Caminar al aire libre", categoria: "Físico", completado: false },
  { texto: "Desconexión digital (1 hora)", categoria: "Mental", completado: false }
]);

const progreso = computed(() => {
  const completados = tareas.value.filter(t => t.completado).length;
  return Math.round((completados / tareas.value.length) * 100);
});
</script>

<style scoped>
.bg-gradient-success {
  background: linear-gradient(90deg, #42e695 0%, #3bb2b8 100%);
}
</style>
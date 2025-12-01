<template>
  <div class="container my-5">
    <div class="row mb-5 align-items-center">
      <div class="col-md-8">
        <h2 class="fw-bold">👋 Hola, {{ userData.anonId || 'Participante' }}</h2>
        <p class="text-muted mb-0">
          Estás en el <span class="badge bg-primary fs-6">Día {{ diaActual }} de 14</span> del programa.
        </p>
        <div class="progress mt-2" style="height: 10px;">
          <div class="progress-bar progress-bar-striped progress-bar-animated" 
               :style="{ width: (diaActual/14)*100 + '%' }"></div>
        </div>
      </div>
      <div class="col-md-4 text-end mt-3 mt-md-0">
        <div class="card bg-light border-0">
          <div class="card-body py-2">
            <small class="text-uppercase text-muted fw-bold" style="font-size: 0.7rem;">Tu Versión:</small>
            <div class="fw-bold text-primary">{{ descripcionGrupo }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <h4 class="mb-4">Tu Camino de Bienestar</h4>
      </div>

      <div class="col-md-6 col-lg-4 mb-4" v-for="(mod, index) in listaModulos" :key="mod.id">
        <div class="card h-100 border-0 shadow-sm" :class="{ 'opacity-50': esBloqueado(index) }">
          <div class="card-body p-4 position-relative">
            
            <div class="d-flex justify-content-between align-items-start mb-3">
              <span class="badge rounded-pill" 
                :class="esCompletado(mod.id) ? 'bg-success' : (esBloqueado(index) ? 'bg-secondary' : 'bg-primary')">
                {{ esCompletado(mod.id) ? 'Completado' : (esBloqueado(index) ? 'Bloqueado' : 'Disponible') }}
              </span>
              <span class="text-muted small">⏱ {{ mod.duracion }}</span>
            </div>

            <h5 class="card-title fw-bold">{{ mod.titulo }}</h5>
            <p class="card-text text-muted small">{{ mod.desc }}</p>

            <button 
              v-if="!esBloqueado(index)" 
              @click="irAModulo(mod.id)"
              class="btn w-100 mt-3"
              :class="esCompletado(mod.id) ? 'btn-outline-success' : 'btn-primary'"
            >
              {{ esCompletado(mod.id) ? 'Repasar Módulo' : 'Comenzar' }}
            </button>
            <button v-else disabled class="btn btn-light w-100 mt-3 text-muted">
              🔒 Completa el anterior
            </button>

          </div>
        </div>
      </div>
    </div>

    <div v-if="diaActual >= 15" class="alert alert-success text-center py-5 mt-4">
      <h3 class="fw-bold">🎉 ¡Has completado el programa!</h3>
      <p>Es momento de ver cuánto has avanzado.</p>
      <button @click="$router.push('/post-test')" class="btn btn-success btn-lg px-5">
        Realizar Evaluación Final
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebaseConfig';

const router = useRouter();
const userData = ref({});
const modulosCompletados = ref([]);
const diaActual = ref(1);

// Definición estática de los 7 módulos
const listaModulos = [
  { id: 1, titulo: "Introducción", duracion: "5 min", desc: "¿Qué es la salud mental y por qué importa?" },
  { id: 2, titulo: "La Ansiedad", duracion: "7 min", desc: "Comprendiendo los mecanismos del miedo." },
  { id: 3, titulo: "La Depresión", duracion: "7 min", desc: "Diferencia entre tristeza y depresión." },
  { id: 4, titulo: "Manejo del Estrés", duracion: "10 min", desc: "Técnicas para bajar la presión." },
  { id: 5, titulo: "Respiración", duracion: "5 min", desc: "El poder del diafragma." },
  { id: 6, titulo: "Relajación Muscular", duracion: "8 min", desc: "Soltando la tensión física." },
  { id: 7, titulo: "Pensamientos", duracion: "10 min", desc: "Identificando trampas mentales." }
];

onMounted(() => {
  // 1. Cargar datos locales (rápido)
  const localData = localStorage.getItem('mindu_data');
  
  if (!localData) {
    // Si no hay datos, forzar Pre-Test
    router.push('/pre-test');
    return;
  }

  userData.value = JSON.parse(localData);
  modulosCompletados.value = userData.value.modulosCompletados || [];

  // 2. Calcular Día Actual
  const fechaInicio = new Date(userData.value.fechaInicio);
  const hoy = new Date();
  const diffTime = Math.abs(hoy - fechaInicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  // TOPE: Si es el primer día marca 1, máximo 15
  diaActual.value = diffDays < 1 ? 1 : diffDays;
  
  // TRUCO PARA PRUEBAS (Descomenta esto para simular que es el día 15):
  diaActual.value = 15; 
});

// Lógica de visualización del grupo
const descripcionGrupo = computed(() => {
  const g = userData.value.grupo || '';
  if (g.includes('A+')) return "Versión Interactiva";
  return "Versión Lectura";
});

// Helpers de estado
const esCompletado = (id) => modulosCompletados.value.includes(id);

const esBloqueado = (index) => {
  if (index === 0) return false; // El primero siempre abierto
  // Está bloqueado si el ANTERIOR no está en la lista de completados
  const idAnterior = listaModulos[index - 1].id;
  return !modulosCompletados.value.includes(idAnterior);
};

const irAModulo = (id) => {
  router.push(`/modulo/${id}`);
};
</script>
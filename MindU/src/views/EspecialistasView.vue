<template>
  <div class="container my-5">
    <div class="text-center mb-5">
      <h2 class="fw-bold">🤝 Nuestros Especialistas</h2>
      <p class="text-muted">Profesionales certificados listos para escucharte.</p>
    </div>

    <div class="row">
      <div class="col-md-6 col-lg-4 mb-4" v-for="(doc, index) in doctores" :key="index">
        <div class="card border-0 shadow h-100 hover-shadow">
          <div class="card-body text-center p-4">
            <div class="avatar bg-light text-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 80px; height: 80px; font-size: 2rem;">
              {{ doc.emoji }}
            </div>
            <h5 class="card-title fw-bold">{{ doc.nombre }}</h5>
            <span class="badge bg-primary mb-3">{{ doc.especialidad }}</span>
            <p class="card-text text-muted small">{{ doc.descripcion }}</p>
            
            <div class="d-grid gap-2 mt-4">
              <a :href="'mailto:' + doc.email" class="btn btn-outline-primary">📧 Enviar Correo</a>
              <button class="btn btn-success">📞 Agendar Cita</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const doctores = ref([
  { 
    nombre: "Dra. Maria Gonzalez", 
    emoji: "👩‍⚕️",
    especialidad: "Psicología Clínica", 
    email: "maria@mindu.com", 
    descripcion: "Experta en terapia cognitivo-conductual para el manejo de ansiedad y depresión." 
  },
  { 
    nombre: "Dr. Roberto Diaz", 
    emoji: "👨‍⚕️",
    especialidad: "Psiquiatría", 
    email: "roberto@mindu.com", 
    descripcion: "Especialista en diagnóstico clínico y tratamiento farmacológico cuando es necesario." 
  },
  { 
    nombre: "Lic. Ana Torres", 
    emoji: "🧘‍♀️",
    especialidad: "Terapeuta Holística", 
    email: "ana@mindu.com", 
    descripcion: "Enfoque en mindfulness y gestión emocional para situaciones de estrés laboral." 
  }
]);
</script>

<style scoped>
.hover-shadow:hover {
  box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
  transition: 0.3s;
}
</style>
<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        
        <div v-if="!resultado" class="card shadow border-0">
          <div class="card-header bg-primary text-white text-center py-4">
            <h3>🧠 Chequeo de Bienestar</h3>
            <p class="mb-0">Responde con honestidad pensando en las últimas 2 semanas.</p>
          </div>
          
          <div class="card-body p-4">
            <form @submit.prevent="calcularResultado">
              <div class="mb-4" v-for="(pregunta, index) in preguntas" :key="index">
                <label class="fw-bold mb-2">{{ index + 1 }}. {{ pregunta.texto }}</label>
                <div class="d-flex flex-wrap gap-3">
                  <div class="form-check" v-for="opcion in opciones" :key="opcion.valor">
                    <input 
                      class="form-check-input" 
                      type="radio" 
                      :name="'p' + index" 
                      :value="opcion.valor" 
                      v-model="respuestas[index]" 
                      required
                    >
                    <label class="form-check-label">{{ opcion.texto }}</label>
                  </div>
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-100 btn-lg">Ver mis resultados</button>
            </form>
          </div>
        </div>

        <div v-else class="card shadow border-0 text-center">
          <div :class="['card-header py-4 text-white', colorClase]">
            <h2 class="mb-0">Nivel de Riesgo: {{ resultado.nivel }}</h2>
          </div>
          <div class="card-body p-5">
            <h4 class="card-title mb-3">Tu puntaje: {{ puntajeTotal }} / 24</h4>
            <p class="lead text-muted mb-4">{{ resultado.mensaje }}</p>

            <hr>

            <h5 class="mb-3">Recomendaciones para ti:</h5>
            
            <div class="d-grid gap-2 col-md-8 mx-auto">
              
              <router-link v-if="resultado.tipo === 'alto'" to="/especialistas" class="btn btn-danger btn-lg">
                🚑 Contactar Especialista Ahora
              </router-link>

              <router-link v-if="['medio', 'alto'].includes(resultado.tipo)" to="/planes" class="btn btn-outline-dark">
                📅 Crear Plan de Rutina
              </router-link>

              <router-link to="/meditacion" class="btn btn-success">
                🎧 Ir a Ejercicios de Relajación
              </router-link>
            
            </div>

            <button @click="reiniciar" class="btn btn-link text-muted mt-4">Volver a realizar el test</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const respuestas = ref({});
const resultado = ref(null);
const puntajeTotal = ref(0);

// Escala simplificada de medición (0-3)
const opciones = [
  { texto: "Nunca", valor: 0 },
  { texto: "Varios días", valor: 1 },
  { texto: "Más de la mitad de los días", valor: 2 },
  { texto: "Casi todos los días", valor: 3 }
];

const preguntas = [
  { texto: "¿Te has sentido nervioso, ansioso o con los nervios de punta?" },
  { texto: "¿No has sido capaz de parar o controlar tus preocupaciones?" },
  { texto: "¿Te has sentido decaído, deprimido o sin esperanza?" },
  { texto: "¿Has tenido poco interés o placer en hacer cosas?" },
  { texto: "¿Has tenido dificultad para dormir o dormir demasiado?" },
  { texto: "¿Te has sentido cansado o con poca energía?" },
  { texto: "¿Has tenido poco apetito o has comido en exceso?" },
  { texto: "¿Te has sentido mal contigo mismo o que has fallado?" }
];

const calcularResultado = () => {
  // Sumar valores del objeto respuestas
  let total = 0;
  for (let i = 0; i < preguntas.length; i++) {
    total += respuestas.value[i];
  }
  puntajeTotal.value = total;

  // Lógica de Niveles de Riesgo
  if (total <= 8) {
    resultado.value = {
      nivel: "Bajo",
      tipo: "bajo",
      mensaje: "Parece que estás manejando bien tus emociones. Para mantener este estado, te recomendamos ejercicios de mindfulness y mantener tu diario."
    };
  } else if (total <= 14) {
    resultado.value = {
      nivel: "Moderado",
      tipo: "medio",
      mensaje: "Estás experimentando síntomas leves de estrés o ansiedad. Es buen momento para establecer una rutina de bienestar y monitorear tu progreso."
    };
  } else {
    resultado.value = {
      nivel: "Alto",
      tipo: "alto",
      mensaje: "Tus respuestas indican un nivel elevado de malestar. Es muy importante que no pases esto por alto. Te recomendamos fuertemente hablar con uno de nuestros especialistas."
    };
  }
};

const colorClase = computed(() => {
  if (!resultado.value) return '';
  if (resultado.value.tipo === 'bajo') return 'bg-success';
  if (resultado.value.tipo === 'medio') return 'bg-warning';
  return 'bg-danger';
});

const reiniciar = () => {
  resultado.value = null;
  respuestas.value = {};
  puntajeTotal.value = 0;
};
</script>
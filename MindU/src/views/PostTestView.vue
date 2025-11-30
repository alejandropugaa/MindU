<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow border-0">
          <div class="card-header bg-success text-white text-center py-4">
            <h3>🏁 Evaluación Final</h3>
            <p class="mb-0">¡Felicidades por completar los 14 días!</p>
          </div>
          
          <div class="card-body p-5">
            <p class="mb-4">Para finalizar, por favor responde nuevamente estas preguntas pensando en cómo te has sentido <strong>la última semana</strong>.</p>

            <form @submit.prevent="guardarPostTest">
              <h6 class="text-success mt-4">Parte A: Ansiedad</h6>
              <div v-for="(item, index) in gad7Items" :key="'gad'+index" class="mb-3 bg-light p-3 rounded">
                <label class="mb-2 fw-bold">{{ item }}</label>
                <div class="d-flex justify-content-between px-3">
                  <div v-for="val in 4" :key="val" class="form-check">
                    <input class="form-check-input" type="radio" :name="'gad'+index" :value="val-1" v-model="respuestasGAD7[index]" required>
                    <label class="form-check-label">{{ val-1 }}</label>
                  </div>
                </div>
              </div>

              <h6 class="text-success mt-4">Parte B: Depresión</h6>
              <div v-for="(item, index) in phq9Items" :key="'phq'+index" class="mb-3 bg-light p-3 rounded">
                <label class="mb-2 fw-bold">{{ item }}</label>
                <div class="d-flex justify-content-between px-3">
                  <div v-for="val in 4" :key="val" class="form-check">
                    <input class="form-check-input" type="radio" :name="'phq'+index" :value="val-1" v-model="respuestasPHQ9[index]" required>
                    <label class="form-check-label">{{ val-1 }}</label>
                  </div>
                </div>
              </div>

              <button type="submit" class="btn btn-success w-100 btn-lg mt-4">Ver Mis Resultados 📊</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db, auth } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const router = useRouter();
const respuestasGAD7 = ref({});
const respuestasPHQ9 = ref({});
const userData = ref({});

const gad7Items = [
  "Nerviosismo, ansiedad o sensación de estar al límite",
  "No poder dejar de preocuparse ni controlar la preocupación",
  "Preocuparse demasiado por diferentes cosas",
  "Dificultad para relajarse",
  "Estar tan inquieto que cuesta quedarse quieto",
  "Irritarse o enfadarse fácilmente",
  "Sentir miedo como si algo terrible fuera a suceder"
];

const phq9Items = [
  "Poco interés o placer en hacer cosas",
  "Sentirse desanimado, deprimido o sin esperanza",
  "Problemas para dormir o dormir demasiado",
  "Sentirse cansado o con poca energía",
  "Poco apetito o comer en exceso",
  "Sentirse mal con uno mismo (fracaso)",
  "Dificultad para concentrarse",
  "Moverse/hablar lento o estar inquieto",
  "Pensamientos de estar mejor muerto o lastimarse"
];

onMounted(() => {
  const localData = localStorage.getItem('mindu_data');
  if (localData) {
    userData.value = JSON.parse(localData);
  }
});

const guardarPostTest = async () => {
  const totalGAD7 = Object.values(respuestasGAD7.value).reduce((a, b) => a + b, 0);
  const totalPHQ9 = Object.values(respuestasPHQ9.value).reduce((a, b) => a + b, 0);

  // Guardar datos
  const user = auth.currentUser;
  if (user) {
    // Actualizar Firestore
    await updateDoc(doc(db, "participantes", user.uid), {
      gad7_post: totalGAD7,
      phq9_post: totalPHQ9,
      fechaFin: new Date().toISOString(),
      estado: 'COMPLETADO'
    });

    // Actualizar LocalStorage para mostrar resultados inmediatos
    userData.value.gad7_post = totalGAD7;
    userData.value.phq9_post = totalPHQ9;
    localStorage.setItem('mindu_data', JSON.stringify(userData.value));

    router.push('/resultados');
  }
};
</script>
<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow border-0">
          <div class="card-header bg-primary text-white text-center py-4">
            <h3>📋 Evaluación Inicial</h3>
            <p class="mb-0">Paso 1 de 2: Conociendo tu punto de partida</p>
          </div>
          
          <div class="card-body p-5">
            <div v-if="step === 1">
              <h5 class="mb-4">Datos Generales</h5>
              <div class="mb-3">
                <label>ID Anónimo (Crea tu código)</label>
                <input v-model="form.anonId" class="form-control" placeholder="Ej: MA05RO (Madre-Día-Color)" required>
                <small class="text-muted">Esto asegura que tus datos sean confidenciales.</small>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label>Edad</label>
                  <input v-model.number="form.edad" type="number" class="form-control">
                </div>
                <div class="col-md-6 mb-3">
                  <label>Semestre</label>
                  <select v-model="form.semestre" class="form-select">
                    <option v-for="n in 12" :key="n" :value="n">{{ n }}° Semestre</option>
                  </select>
                </div>
              </div>
              <button @click="step++" class="btn btn-primary w-100 mt-3">Siguiente</button>
            </div>

            <div v-if="step === 2">
              <h5 class="mb-3">Durante las últimas 2 semanas, ¿con qué frecuencia te has sentido molesto por...?</h5>
              <p class="text-muted small">0=Nunca, 1=Varios días, 2=Más de la mitad, 3=Casi todos los días</p>

              <form @submit.prevent="finalizarPreTest">
                <h6 class="text-primary mt-4">Parte A</h6>
                <div v-for="(item, index) in gad7Items" :key="'gad'+index" class="mb-3 bg-light p-3 rounded">
                  <label class="mb-2 fw-bold">{{ item }}</label>
                  <div class="d-flex justify-content-between px-3">
                    <div v-for="val in 4" :key="val" class="form-check">
                      <input class="form-check-input" type="radio" :name="'gad'+index" :value="val-1" v-model="respuestasGAD7[index]" required>
                      <label class="form-check-label">{{ val-1 }}</label>
                    </div>
                  </div>
                </div>

                <h6 class="text-primary mt-4">Parte B</h6>
                <div v-for="(item, index) in phq9Items" :key="'phq'+index" class="mb-3 bg-light p-3 rounded">
                  <label class="mb-2 fw-bold">{{ item }}</label>
                  <div class="d-flex justify-content-between px-3">
                    <div v-for="val in 4" :key="val" class="form-check">
                      <input class="form-check-input" type="radio" :name="'phq'+index" :value="val-1" v-model="respuestasPHQ9[index]" required>
                      <label class="form-check-label">{{ val-1 }}</label>
                    </div>
                  </div>
                </div>

                <div class="alert alert-warning mt-3">
                  <small>Al hacer clic en Finalizar, aceptas participar en el estudio bajo los términos de confidencialidad.</small>
                </div>
                
                <button type="submit" class="btn btn-success w-100 btn-lg">Finalizar y Comenzar</button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { db, auth } from '../firebaseConfig';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

const router = useRouter();
const step = ref(1);
const form = reactive({ anonId: '', edad: '', semestre: '' });
const respuestasGAD7 = ref({});
const respuestasPHQ9 = ref({});

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
  "Pensamientos de estar mejor muerto o lastimarse" // Ítem crítico #9
];

const finalizarPreTest = async () => {
  // 1. Calcular Puntajes
  const totalGAD7 = Object.values(respuestasGAD7.value).reduce((a, b) => a + b, 0);
  const totalPHQ9 = Object.values(respuestasPHQ9.value).reduce((a, b) => a + b, 0);
  const itemCrisis = respuestasPHQ9.value[8] || 0; // El índice 8 es la pregunta 9

  // 2. Protocolo de Seguridad (Crisis)
  if (itemCrisis >= 2) {
    // Si marca 'Más de la mitad' o 'Casi todos los días' en suicidio
    await registrarCrisis(totalGAD7, totalPHQ9);
    router.push('/alerta-crisis');
    return;
  }

  // 3. Asignación Aleatoria de Grupo (Algoritmo simple)
  // Grupos: 'A+B+', 'A+B-', 'A-B+', 'A-B-'
  const grupos = ['A+B+', 'A+B-', 'A-B+', 'A-B-'];
  const grupoAsignado = grupos[Math.floor(Math.random() * grupos.length)];

  // 4. Guardar en Firestore y LocalStorage
  const user = auth.currentUser;
  if (user) {
    const data = {
      ...form,
      gad7_pre: totalGAD7,
      phq9_pre: totalPHQ9,
      grupo: grupoAsignado,
      fechaInicio: new Date().toISOString(),
      modulosCompletados: []
    };

    // Guardar en Firestore
    await setDoc(doc(db, "participantes", user.uid), data);
    
    // Guardar en LocalStorage para acceso rápido
    localStorage.setItem('mindu_data', JSON.stringify(data));
    
    // 5. Ir al Dashboard
    router.push('/dashboard');
  }
};

const registrarCrisis = async (gad, phq) => {
  const user = auth.currentUser;
  if(user) {
    await setDoc(doc(db, "alertas_crisis", user.uid), {
      uid: user.uid,
      email: user.email,
      fecha: new Date().toISOString(),
      puntaje_phq9: phq,
      nivel_riesgo: 'ALTO'
    });
  }
};
</script>
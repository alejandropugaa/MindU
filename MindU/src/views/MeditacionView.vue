<template>
  <div class="container my-5">
    <div class="row align-items-center mb-5">
      <div class="col-md-6">
        <h2 class="fw-bold">🎧 Sala de Meditación</h2>
        <p class="text-muted">Encuentra la calma en medio del caos. Selecciona un audio y relájate.</p>
      </div>
      <div class="col-md-6 text-end d-none d-md-block">
        <span style="font-size: 4rem;">🌿</span>
      </div>
    </div>

    <div class="row">
      <div class="col-12" v-for="(audio, index) in audios" :key="index">
        <div class="card mb-3 shadow-sm border-0">
          <div class="card-body d-flex align-items-center">
            <button class="btn btn-primary rounded-circle me-3 p-3" @click="playAudio(index)">
               ▶
            </button>
            <div class="flex-grow-1">
              <h5 class="mb-0">{{ audio.titulo }}</h5>
              <small class="text-muted">{{ audio.duracion }} • {{ audio.categoria }}</small>
            </div>
            <audio :id="'audio-'+index" :src="audio.url"></audio>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const audios = ref([
  { titulo: "Respiración de 5 minutos", duracion: "5:00", categoria: "Estrés", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { titulo: "Calma para dormir", duracion: "12:00", categoria: "Sueño", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { titulo: "Alivio de Ansiedad Rápido", duracion: "08:30", categoria: "Ansiedad", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
]);

const playAudio = (index) => {
  // Pausar todos los demás primero
  audios.value.forEach((_, i) => {
    const el = document.getElementById('audio-' + i);
    if (el) el.pause();
  });
  
  // Reproducir el seleccionado
  const player = document.getElementById('audio-' + index);
  if (player) player.play();
};
</script>
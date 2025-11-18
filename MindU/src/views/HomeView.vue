<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
      <div class="container">
        <router-link class="navbar-brand fw-bold text-primary" to="/home">MindU</router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item"><router-link class="nav-link" to="/home">Inicio</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/test-salud">📝 Test de Salud</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/meditacion">🎧 Meditación</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/planes">📆 Planes</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/especialistas">🤝 Especialistas</router-link></li>
          </ul>

          <div class="dropdown">
            <button class="btn btn-outline-primary dropdown-toggle" type="button" id="userMenu" data-bs-toggle="dropdown">
              👤 Mi Cuenta
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><button class="dropdown-item text-danger" @click="logout">Cerrar sesión</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <section class="hero text-center text-white">
      <h1 class="display-4 fw-bold">Bienvenido a MindU</h1>
      <p class="lead">Tu espacio seguro. ¿Cómo te sientes hoy?</p>
      <router-link to="/test-salud" class="btn btn-light btn-lg mt-3 fw-bold text-primary">
        Realizar chequeo emocional
      </router-link>
    </section>

    <section class="container my-5">
      <div class="row g-4">
        <div class="col-md-4">
          <div class="card h-100 shadow-sm border-0 text-center p-4 hover-card">
            <div class="display-4 mb-3">🧘</div>
            <h3>Zona Zen</h3>
            <p class="text-muted">Audios guiados para reducir el estrés en minutos.</p>
            <router-link to="/meditacion" class="btn btn-outline-primary stretched-link">Ir a Meditación</router-link>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 shadow-sm border-0 text-center p-4 hover-card">
            <div class="display-4 mb-3">📊</div>
            <h3>Evaluación</h3>
            <p class="text-muted">Mide tu nivel de ansiedad y obtén recomendaciones.</p>
            <router-link to="/test-salud" class="btn btn-outline-success stretched-link">Hacer Test</router-link>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 shadow-sm border-0 text-center p-4 hover-card">
            <div class="display-4 mb-3">👩‍⚕️</div>
            <h3>Ayuda Profesional</h3>
            <p class="text-muted">Contacta con especialistas certificados.</p>
            <router-link to="/especialistas" class="btn btn-outline-danger stretched-link">Ver Directorio</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";

export default {
  name: "HomeView",
  methods: {
    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth);
        this.$router.push("/login");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    },
  },
};
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px;
}
.hover-card {
  transition: transform 0.3s ease;
}
.hover-card:hover {
  transform: translateY(-5px);
}
</style>
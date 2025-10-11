
  // Función para mostrar el collage y hacer scroll suave
  function mostrarCollage() {
    const collage = document.getElementById('collage');
    collage.style.display = 'block';
    window.scrollTo({ top: collage.offsetTop, behavior: 'smooth' });
    alert('Gracias por compartir este momento conmigo 🥰');
  }

  // Frases bonitas para mostrar en la carta
  const frases = [
    "Eres mi persona favorita.",
    "Cada momento contigo es mi favorito.",
    "Tú haces que todo valga la pena.",
    "No necesito nada más si te tengo a ti.",
    "Te amo más de lo que las palabras pueden decir.",
    "Gracias por existir en mi vida."
  ];

  function mostrarFrase() {
    const random = frases[Math.floor(Math.random() * frases.length)];
    const fraseCaja = document.getElementById('cajaFrase');
    document.getElementById('fraseAmor').textContent = random;
    fraseCaja.style.display = 'block';
    window.scrollTo({ top: fraseCaja.offsetTop, behavior: 'smooth' });
  }



  // Fondo animado con pochaccos que caen
  function crearPochacco() {
    const img = document.createElement('img');
    img.src = 'img/pochacco.webp';
    img.className = 'pochacco';
    img.style.left = Math.random() * 100 + 'vw';
    img.style.width = (Math.random() * 40 + 30) + 'px';
    img.style.animationDuration = (Math.random() * 5 + 5) + 's';
    document.getElementById('fondoCorazones').appendChild(img);
    setTimeout(() => img.remove(), 10000);
  }
  setInterval(crearPochacco, 700);

  // Esperar a que el DOM esté listo para iniciar el juego
  document.addEventListener('DOMContentLoaded', () => {

    // Recuerdos con imagen y texto para el minijuego
    const recuerdos = [
      {
        src: 'img/IAMGEN4.jpeg',  // Corregido el nombre aquí
        texto: 'Nuestras primeras veces saliendo con mis papás 💘'
      },
      {
        src: 'img/IMAGEN5.jpeg',
        texto: 'Las fotos random 💕'
      },
      {
        src: 'img/IMAGEN6.jpeg',
        texto: 'Ir a tu casa era una rutina muy bonita ✨'
      },
      {
        src: 'img/IMAGEN7.jpeg',
        texto: 'Nuestra primera vez yendo a la playa, un día muy bonito  💗'
      },
      {
        src: 'img/IMAGEN8.jpeg',
        texto: 'Cuando fuimos al parque, te veías muy linda en esta foto ❤️'
      },
      {
        src: 'img/IMAGEN9.jpeg',
        texto: 'Tener un hogar donde volver y tenerte fue lo mejor que pude haber hecho 💖'
      },
    ];

    const fotoBorrosa = document.getElementById('fotoBorrosa');
    const opcionesDiv = document.getElementById('opciones');
    const resultado = document.getElementById('resultado');
    const reiniciarBtn = document.getElementById('reiniciarJuego');

    let estadoJuego = {
      actual: 0,
      terminado: false
    };

    // Función para mezclar un array (Fisher-Yates)
    function mezclarArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Carga el estado del juego actual
    function cargarJuego() {
      estadoJuego.terminado = false;
      resultado.textContent = '';
      reiniciarBtn.style.display = 'none';
      opcionesDiv.innerHTML = '';

      const actualRecuerdo = recuerdos[estadoJuego.actual];
      fotoBorrosa.src = actualRecuerdo.src;
      fotoBorrosa.style.filter = 'blur(8px)';

      // Construir opciones: texto correcto + 3 textos aleatorios distintos
      let opcionesTexto = [actualRecuerdo.texto];

      // Obtener otras frases excluyendo la actual
      const otrasFrases = recuerdos
        .filter((_, idx) => idx !== estadoJuego.actual)
        .map(r => r.texto);

      mezclarArray(otrasFrases);

      opcionesTexto = opcionesTexto.concat(otrasFrases.slice(0, 3));

      // Mezclar las opciones para que la correcta no esté siempre en la misma posición
      mezclarArray(opcionesTexto);

      // Crear botones para las opciones
      opcionesTexto.forEach(texto => {
        const btn = document.createElement('button');
        btn.className = 'opcion-btn';
        btn.textContent = texto;
        btn.onclick = () => manejarClick(btn, actualRecuerdo.texto);
        opcionesDiv.appendChild(btn);
      });
    }

    // Maneja el click en una opción
    function manejarClick(boton, textoCorrecto) {
      if (estadoJuego.terminado) return;
      estadoJuego.terminado = true;

      const botones = document.querySelectorAll('.opcion-btn');
      botones.forEach(btn => btn.disabled = true);

      if (boton.textContent === textoCorrecto) {
        resultado.textContent = '¡Correcto! ❤️';
        resultado.style.color = '#008000';
        fotoBorrosa.style.filter = 'none';
      } else {
        resultado.textContent = '¡Casi! Intenta otra vez.';
        resultado.style.color = '#cc0000';
      }

      reiniciarBtn.style.display = 'inline-block';
    }

    // Al hacer click en reiniciar, avanzar al siguiente recuerdo
    reiniciarBtn.addEventListener('click', () => {
      estadoJuego.actual = (estadoJuego.actual + 1) % recuerdos.length;
      cargarJuego();
    });

    // Cargar juego al inicio
    cargarJuego();
  });


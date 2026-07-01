const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const IMG_DIR = path.join(__dirname, 'img');
const DATOS_FILE = path.join(__dirname, 'datos', 'cartas.json');

if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });
if (!fs.existsSync(path.dirname(DATOS_FILE))) fs.mkdirSync(path.dirname(DATOS_FILE), { recursive: true });

const storage = multer.diskStorage({
  destination: IMG_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const name = 'upload-' + Date.now() + ext;
    cb(null, name);
  }
});
const upload = multer({ storage });

app.use(express.static(__dirname));

app.get('/api/fotos', (req, res) => {
  fs.readdir(IMG_DIR, (err, files) => {
    if (err) return res.json([]);
    const images = files.filter(f => /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(f)).sort();
    res.json(images);
  });
});

app.post('/api/subir', upload.array('fotos', 20), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No se subieron archivos' });
  }
  const nombres = req.files.map(f => f.filename);
  res.json({ ok: true, archivos: nombres });
});

app.post('/api/eliminar', express.json(), (req, res) => {
  const archivo = req.body.archivo;
  if (!archivo) return res.status(400).json({ error: 'Falta archivo' });
  const ruta = path.join(IMG_DIR, path.basename(archivo));
  fs.unlink(ruta, (err) => {
    if (err) return res.status(404).json({ error: 'No encontrado' });
    res.json({ ok: true });
  });
});

const CARTAS_INICIALES = {
  "para-mi": [],
  "otras": [
    { "id": "ot1", "titulo": "Mi primera cartita", "mensaje": "Amor mío,\n\nNo existen palabras que describan lo especial que eres para mí.\nMi corazón siempre late por ti, y cada abrazo tuyo me hace sentir en casa.\nGracias por cada sonrisa, cada detalle y por ser como eres.\nTe adoro con todo mi ser. ❤️", "fecha": "", "deco": "tulipanes" },
    { "id": "ot2", "titulo": "Mi cartita 2", "mensaje": "Corazon,\n\nSiempre me has apoyado en las cosas que me propongo.\nMe gusta compartir mi vida contigo y sueño con cumplir logros contigo.\nEspero ser mejor persona y pareja aunque tenga mis defectos.\nAlgun dia espero que seas feliz conmigo\ny siempre te sientas conforme estando a mi lado. ❤️", "fecha": "", "deco": "margaritas" },
    { "id": "ot3", "titulo": "Mi cartita 3", "mensaje": "Esto parece una continuacion de la otra,\npero no por eso es una mas especial que la otra.\nSolo quiero transmitir contigo lo que siento\naunque seas la persona mas mañosa del mundo.\nTe seguire amando y nunca te dejare ir\neres prisionera de todo el amor que te tengo. ❤️", "fecha": "", "deco": "mixto" },
    { "id": "ot4", "titulo": "Mi cartita 4", "mensaje": "Eres lo mas apreciado que tengo disfruto estar contigo cuando no estas enojada jeje.\nPero aunque a veces peleemos, siempre buscaré una manera de arreglarlo.\nMe da pena no tener plata aveces para poder comprarte algun regalo\ny demostrar lo mucho que te amo pero siempre buscare una forma de hacerte feliz.\nMe gusta pasar mi vida contigo eres la mejor y te amo mucho potito.❤️", "fecha": "", "deco": "rosas" },
    { "id": "ot5", "titulo": "Mi cartita 5", "mensaje": "Yo se que capaz me tarde con la pagina\nSimplemente entre como en una costumbre de dejarlas pasar\nY me doy cuenta hoy que no estaba bien ya que es algo y a ti te gustan\nA mi no me cuestan nada hacerlas para ti y te pido perdon por eso.", "fecha": "", "deco": "girasoles" },
    { "id": "ot6", "titulo": "Mi cartita 6", "mensaje": "Esta carta la escribo para decir lo mucho que te amo\nTu no me creeras pero tu eres mi persona favorita del mundo\nEstoy agradecido con la vida de habernos encontrado independientemente de los malos ratos\nYo siempre sabre que no me equivoque en elegirte a ti como mi compañera de vida.❤️", "fecha": "", "deco": "lavanda" },
    { "id": "ot7", "titulo": "Mi cartita 7", "mensaje": "Ya sobran las palabras para decirte lo mucho te amo\nSiempre he tratado de dejartelo en claro y espero que con esto lo entiendas\nYo siempre te amare y espero algun dia que tengas la suficiente confianza en mi para poder ser felices al maximo\nYo siempre estare orgulloso de ti y espero poder compartir\nTodos los momentos contigo sean buenos o malos yo quiero estar para siempre al lado tuyo.❤️", "fecha": "", "deco": "tulipanes" },
    { "id": "ot8", "titulo": "Mi cartita 8", "mensaje": "Esta ultima carta es un recordatorio de vida\nAquellos momentos que quiero transmitir las peleas que me han llevado a ser mejor persona\nGracias a ti soy una persona mas considerada me haces ver mis propios errores\nEres como un angel para mi aparte de ser la mujer mas hermosa del mundo\nMi guia para ser mejor persona y aspiro a convertirme en algo de lo que tu estes orgullosa y amada.❤️", "fecha": "", "deco": "rosas" }
  ]
};

app.get('/api/cartas', (req, res) => {
  fs.readFile(DATOS_FILE, 'utf8', (err, data) => {
    if (err) return res.json(CARTAS_INICIALES);
    try { res.json(JSON.parse(data)); }
    catch(e) { res.json(CARTAS_INICIALES); }
  });
});

app.post('/api/cartas', express.json({ limit: '10mb' }), (req, res) => {
  const data = req.body;
  if (!data || typeof data !== 'object') return res.status(400).json({ error: 'Datos inválidos' });
  fs.writeFile(DATOS_FILE, JSON.stringify(data, null, 2), 'utf8', (err) => {
    if (err) return res.status(500).json({ error: 'Error al guardar' });
    res.json({ ok: true });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
  console.log('Desde el móvil (misma red WiFi): http://' + getIP() + ':' + PORT);
});

function getIP() {
  const os = require('os');
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return 'localhost';
}

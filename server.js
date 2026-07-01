const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const IMG_DIR = path.join(__dirname, 'img');

if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

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

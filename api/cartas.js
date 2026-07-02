const CARTAS_INICIALES = {
  'para-mi': [],
  'otras': [
    { id: 'ot1', titulo: 'Mi primera cartita', mensaje: 'Amor mío,\n\nNo existen palabras que describan lo especial que eres para mí.\nMi corazón siempre late por ti, y cada abrazo tuyo me hace sentir en casa.\nGracias por cada sonrisa, cada detalle y por ser como eres.\nTe adoro con todo mi ser. ❤️', fecha: '', deco: 'tulipanes' },
    { id: 'ot2', titulo: 'Mi cartita 2', mensaje: 'Corazon,\n\nSiempre me has apoyado en las cosas que me propongo.\nMe gusta compartir mi vida contigo y sueño con cumplir logros contigo.\nEspero ser mejor persona y pareja aunque tenga mis defectos.\nAlgun dia espero que seas feliz conmigo\ny siempre te sientas conforme estando a mi lado. ❤️', fecha: '', deco: 'margaritas' },
    { id: 'ot3', titulo: 'Mi cartita 3', mensaje: 'Esto parece una continuacion de la otra,\npero no por eso es una mas especial que la otra.\nSolo quiero transmitir contigo lo que siento\naunque seas la persona mas mañosa del mundo.\nTe seguire amando y nunca te dejare ir\neres prisionera de todo el amor que te tengo. ❤️', fecha: '', deco: 'mixto' },
    { id: 'ot4', titulo: 'Mi cartita 4', mensaje: 'Eres lo mas apreciado que tengo disfruto estar contigo cuando no estas enojada jeje.\nPero aunque a veces peleemos, siempre buscaré una manera de arreglarlo.\nMe da pena no tener plata aveces para poder comprarte algun regalo\ny demostrar lo mucho que te amo pero siempre buscare una forma de hacerte feliz.\nMe gusta pasar mi vida contigo eres la mejor y te amo mucho potito.❤️', fecha: '', deco: 'rosas' },
    { id: 'ot5', titulo: 'Mi cartita 5', mensaje: 'Yo se que capaz me tarde con la pagina\nSimplemente entre como en una costumbre de dejarlas pasar\nY me doy cuenta hoy que no estaba bien ya que es algo y a ti te gustan\nA mi no me cuestan nada hacerlas para ti y te pido perdon por eso.', fecha: '', deco: 'girasoles' },
    { id: 'ot6', titulo: 'Mi cartita 6', mensaje: 'Esta carta la escribo para decir lo mucho que te amo\nTu no me creeras pero tu eres mi persona favorita del mundo\nEstoy agradecido con la vida de habernos encontrado independientemente de los malos ratos\nYo siempre sabre que no me equivoque en elegirte a ti como mi compañera de vida.❤️', fecha: '', deco: 'lavanda' },
    { id: 'ot7', titulo: 'Mi cartita 7', mensaje: 'Ya sobran las palabras para decirte lo mucho te amo\nSiempre he tratado de dejartelo en claro y espero que con esto lo entiendas\nYo siempre te amare y espero algun dia que tengas la suficiente confianza en mi para poder ser felices al maximo\nYo siempre estare orgulloso de ti y espero poder compartir\nTodos los momentos contigo sean buenos o malos yo quiero estar para siempre al lado tuyo.❤️', fecha: '', deco: 'tulipanes' },
    { id: 'ot8', titulo: 'Mi cartita 8', mensaje: 'Esta ultima carta es un recordatorio de vida\nAquellos momentos que quiero transmitir las peleas que me han llevado a ser mejor persona\nGracias a ti soy una persona mas considerada me haces ver mis propios errores\nEres como un angel para mi aparte de ser la mujer mas hermosa del mundo\nMi guia para ser mejor persona y aspiro a convertirme en algo de lo que tu estes orgullosa y amada.❤️', fecha: '', deco: 'rosas' }
  ]
};

function getRepoParts() {
  const repo = process.env.GITHUB_REPO || '';
  const parts = repo.split('/');
  return { owner: parts[0] || '', repoName: parts[1] || '' };
}

function headers() {
  return {
    Authorization: 'Bearer ' + process.env.GITHUB_TOKEN,
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github.v3+json'
  };
}

module.exports = async (req, res) => {
  const { owner, repoName } = getRepoParts();
  if (!owner || !repoName || !process.env.GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub no configurado.' });
  }
  const filePath = 'datos/cartas.json';
  const h = headers();
  try {
    if (req.method === 'GET') {
      const getRes = await fetch('https://api.github.com/repos/' + owner + '/' + repoName + '/contents/' + filePath, { headers: h });
      if (!getRes.ok) return res.json(CARTAS_INICIALES);
      const data = await getRes.json();
      const content = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
      return res.json(content);
    }
    if (req.method === 'POST') {
      const newData = req.body;
      if (!newData) return res.status(400).json({ error: 'Datos inválidos' });
      const content = Buffer.from(JSON.stringify(newData, null, 2)).toString('base64');
      const getRes = await fetch('https://api.github.com/repos/' + owner + '/' + repoName + '/contents/' + filePath, { headers: h });
      let sha = null;
      if (getRes.ok) { const existing = await getRes.json(); sha = existing.sha; }
      const putRes = await fetch('https://api.github.com/repos/' + owner + '/' + repoName + '/contents/' + filePath, {
        method: 'PUT', headers: h,
        body: JSON.stringify({ message: 'Actualizar cartas.json', content, sha: sha, branch: 'main' })
      });
      if (!putRes.ok) { const err = await putRes.json(); return res.status(500).json({ error: err.message }); }
      return res.json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

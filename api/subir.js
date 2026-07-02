const GITHUB_API = 'https://api.github.com';

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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { owner, repoName } = getRepoParts();
  if (!owner || !repoName || !process.env.GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub no configurado' });
  }
  const { nombre, data: base64Data } = req.body || {};
  if (!nombre || !base64Data) return res.status(400).json({ error: 'Falta nombre o data' });
  try {
    const content = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const filePath = 'img/' + nombre;
    const h = headers();
    const check = await fetch(GITHUB_API + '/repos/' + owner + '/' + repoName + '/contents/' + filePath, { headers: h });
    let sha = null;
    if (check.ok) { const e = await check.json(); sha = e.sha; }
    const body = { message: sha ? 'Actualizar ' + nombre : 'Agregar ' + nombre, content, branch: 'main' };
    if (sha) body.sha = sha;
    const put = await fetch(GITHUB_API + '/repos/' + owner + '/' + repoName + '/contents/' + filePath, {
      method: 'PUT', headers: h, body: JSON.stringify(body)
    });
    if (!put.ok) { const err = await put.json(); return res.status(500).json({ error: err.message }); }
    const putData = await put.json();
    return res.json({ ok: true, archivos: [{ nombre: nombre, url: putData.content.download_url }] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

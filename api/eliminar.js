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
    return res.status(500).json({ error: 'GitHub no configurado.' });
  }
  const { archivo } = req.body || {};
  if (!archivo) return res.status(400).json({ error: 'Falta archivo' });
  try {
    const h = headers();
    const filePath = 'img/' + archivo;
    const getRes = await fetch('https://api.github.com/repos/' + owner + '/' + repoName + '/contents/' + filePath, { headers: h });
    if (!getRes.ok) return res.status(404).json({ error: 'No encontrado' });
    const data = await getRes.json();
    const delRes = await fetch('https://api.github.com/repos/' + owner + '/' + repoName + '/contents/' + filePath, {
      method: 'DELETE', headers: h,
      body: JSON.stringify({ message: 'Eliminar ' + archivo, sha: data.sha, branch: 'main' })
    });
    if (!delRes.ok) { const err = await delRes.json(); return res.status(500).json({ error: err.message }); }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

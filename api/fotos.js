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
  const { owner, repoName } = getRepoParts();
  if (!owner || !repoName || !process.env.GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub no configurado. Seteá GITHUB_REPO y GITHUB_TOKEN en Vercel.' });
  }
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const r = await fetch(GITHUB_API + '/repos/' + owner + '/' + repoName + '/contents/img', { headers: headers() });
    if (!r.ok) return res.json([]);
    const data = await r.json();
    return res.json(data.filter(f => f.type === 'file').map(f => ({ nombre: f.name, url: f.download_url })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const $ = (sel) => document.querySelector(sel);
const ownerInput = $('#owner');
const fetchBtn = $('#fetch');
const results = $('#results');
const ownerTitle = $('#ownerTitle');
const repoList = $('#repoList');
const message = $('#message');

let chart;

function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? 'message error' : 'message';
}

function renderRepos(owner, repos) {
  ownerTitle.textContent = `${owner} — ${repos.length} repos`;
  repoList.innerHTML = '';
  const langCount = {};
  repos.forEach((r) => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${r.html_url}" target="_blank">${r.full_name}</a> — ⭐ ${r.stargazers_count} — ${r.language || '—'}`;
    repoList.appendChild(li);
    const lang = r.language || 'Unknown';
    langCount[lang] = (langCount[lang] || 0) + 1;
  });

  const labels = Object.keys(langCount);
  const data = Object.values(langCount);

  // safe reference to Chart constructor loaded from CDN
  const ChartCtor = window.Chart;
  if (!ChartCtor) {
    showMessage('Chart.js not loaded — language chart unavailable', false);
    return;
  }

  const ctx = document.getElementById('langChart').getContext('2d');
  if (chart) chart.destroy();
  chart = new ChartCtor(ctx, {
    type: 'pie',
    data: { labels, datasets: [{ data, backgroundColor: labels.map((_, i) => `hsl(${(i*60)%360} 70% 50%)`) }] },
  });
}

async function fetchRepos() {
  const owner = ownerInput.value.trim();
  if (!owner) return showMessage('Please enter an owner', true);
  showMessage('Loading...');
  try {
    const res = await fetch(`/api/repos/${encodeURIComponent(owner)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || res.statusText || 'Failed');
    }
    const body = await res.json();
    const repos = body.data || [];
    if (!repos.length) showMessage('No repos found', false);
    results.classList.remove('hidden');
    renderRepos(owner, repos);
    showMessage(body.cached ? 'From cache' : 'Fresh data');
  } catch (err) {
    showMessage('Error: ' + (err.message || err), true);
  }
}

fetchBtn.addEventListener('click', fetchRepos);
ownerInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') fetchRepos(); });

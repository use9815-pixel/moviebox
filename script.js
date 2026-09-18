document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const searchInput = document.getElementById('searchInput');
  const appCards = document.querySelectorAll('.app-card');
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  /* ==========================================================================
     DIRECT DOWNLOAD LINKS CONFIGURATION
     Paste your direct 1-click download URLs below (MediaFire, Google Drive, 
     Dropbox, Catbox, Archive.org, etc.).
     Users will NOT be redirected to external websites—downloads start in 1 click!
     ========================================================================== */
  const DIRECT_DOWNLOAD_LINKS = {
    // App 1: MovieBox Pro Mod 1
    mod1: "https://www.dropbox.com/scl/fi/0kmr5ilb1odytxfurwm9e/MovieBox-Pro-Mod-1-v4.0.02.0903.02.apk?rlkey=6f8pbqpcgcwg3oldv209aza5t&st=b078b2b9&dl=0", // e.g. "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" or "https://dl.dropboxusercontent.com/s/..."

    // App 2: MovieBox Pro Mod 2
    mod2: "https://www.dropbox.com/scl/fi/h0rwwgem18rvc7x6a0ipq/MovieBox-Pro-Mod-2-v4.0.02.0903.02.apk?rlkey=8qeoavto4jkyycqx8pod8y9vv&st=2jv3iplc&dl=0", // e.g. "https://archive.org/download/your-item/MovieBox_Mod2.apk"

    // App 3: MovieBoxTV Pro
    tv: "https://www.dropbox.com/scl/fi/f35ilymyqes42bty9rhpk/MovieBoxTV-Pro-v1.1.10.0901.03.apk?rlkey=v39pz7xfaagu9gi3bqzi1g3ml&st=mbdumqd6&dl=0"  // e.g. "https://files.catbox.moe/xxxxxx.apk"
  };

  // Apply Direct Download Links to buttons if configured
  const mod1Btn = document.getElementById('download-mod1');
  const mod2Btn = document.getElementById('download-mod2');
  const tvBtn = document.getElementById('download-tv');

  if (mod1Btn && DIRECT_DOWNLOAD_LINKS.mod1.trim() !== "") {
    mod1Btn.href = DIRECT_DOWNLOAD_LINKS.mod1;
    mod1Btn.removeAttribute('download'); // allow cross-origin direct download
  }

  if (mod2Btn && DIRECT_DOWNLOAD_LINKS.mod2.trim() !== "") {
    mod2Btn.href = DIRECT_DOWNLOAD_LINKS.mod2;
    mod2Btn.removeAttribute('download');
  }

  if (tvBtn && DIRECT_DOWNLOAD_LINKS.tv.trim() !== "") {
    tvBtn.href = DIRECT_DOWNLOAD_LINKS.tv;
    tvBtn.removeAttribute('download');
  }

  // Interactive Live Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let visibleCount = 0;

      appCards.forEach(card => {
        const title = card.getAttribute('data-title') || '';
        const tags = card.getAttribute('data-tags') || '';
        const desc = card.querySelector('.app-description')?.textContent || '';
        const textToSearch = `${title} ${tags} ${desc}`.toLowerCase();

        if (textToSearch.includes(query)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const noResults = document.getElementById('noResults');
      if (noResults) {
        noResults.style.display = (visibleCount === 0) ? 'block' : 'none';
      }
    });
  }

  // Installation Accordion Guide Toggle
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Copy Direct Link to Clipboard
  window.copyLink = function (appId, fallbackFilename, appName) {
    let linkToCopy = DIRECT_DOWNLOAD_LINKS[appId];

    if (!linkToCopy || linkToCopy.trim() === "") {
      const btn = document.getElementById(`download-${appId}`);
      linkToCopy = btn ? btn.href : new URL(fallbackFilename, window.location.href).href;
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(linkToCopy).then(() => {
        showToast(`Copied direct download link for ${appName}!`);
      }).catch(() => {
        fallbackCopy(linkToCopy, appName);
      });
    } else {
      fallbackCopy(linkToCopy, appName);
    }
  };

  function fallbackCopy(text, appName) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied direct download link for ${appName}!`);
    } catch (err) {
      showToast('Failed to copy link');
    }
    document.body.removeChild(textArea);
  }

  function showToast(msg) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
});

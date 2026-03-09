const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const newJS = `function runTelemetry(duration) {
  const stream = document.getElementById('hudDataStream');
  if (!stream) return;
  
  const end = Date.now() + duration;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
  
  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      stream.innerHTML = 'SYS: READY<br>MEM: OK<br>TARGET ACQUIRED<br>AWAITING ML INIT';
      return;
    }
    let txt = '';
    for(let i=0; i<5; i++) {
        txt += 'SEQ_' + Math.floor(Math.random()*999) + ': ';
        for(let j=0; j<8; j++) txt += chars[Math.floor(Math.random()*chars.length)];
        txt += '<br>';
    }
    stream.innerHTML = txt;
  }, 100);
}

function handleFile(file) {
  if (!file.type.startsWith('image/')) return alert('Please upload an image file.');
  if (file.size > 10 * 1024 * 1024) return alert('File too large. Maximum 10MB.');
  const reader = new FileReader();
  reader.onload = e => {
    uploadedImage = e.target.result;
    const preview = document.getElementById('uploadPreview');
    const placeholder = document.getElementById('uploadPlaceholder');
    const previewImg = document.getElementById('previewImage');
    
    if (previewImg) previewImg.src = uploadedImage;
    if (placeholder) placeholder.style.display = 'none';
    if (preview) {
      preview.style.display = 'flex';
      
      const container = document.querySelector('.hud-scanner-container');
      if (container) {
          container.classList.add('scanning');
          container.classList.remove('scanned');
          runTelemetry(2500);
      }
      
      document.getElementById('diagReadiness').textContent = 'PERFORMING INITIAL SCAN...';
      document.getElementById('diagReadiness').style.color = 'var(--accent-secondary)';
      
      setTimeout(() => {
        if (container) {
            container.classList.remove('scanning');
            container.classList.add('scanned');
        }
        checkAnalysisReadiness();
        document.getElementById('diagReadiness').textContent = 'IMAGE REGISTERED. READY.';
        document.getElementById('diagReadiness').style.color = 'var(--accent-primary)';
      }, 2500);
    }
  };
  reader.readAsDataURL(file);
}

function removeUploadedImage() {
  uploadedImage = null;
  document.getElementById('uploadPreview').style.display = 'none';
  document.getElementById('uploadPlaceholder').style.display = 'block';
  document.getElementById('fileInput').value = '';
  
  const container = document.querySelector('.hud-scanner-container');
  if (container) {
      container.classList.remove('scanning');
      container.classList.remove('scanned');
  }
  
  const stream = document.getElementById('hudDataStream');
  if (stream) stream.innerHTML = 'WAITING FOR INPUT...<br>SYS: READY<br>MEM: OK';
  
  document.getElementById('diagReadiness').textContent = 'AWAITING DATA';
  document.getElementById('diagReadiness').style.color = 'var(--text-muted)';
  
  checkAnalysisReadiness();
}`;

// Replace everything from handleFile declaration down to removeUploadedImage function block.
app = app.replace(/function handleFile\(file\)\s*\{[\s\S]*?function removeUploadedImage\(\)\s*\{[\s\S]*?checkAnalysisReadiness\(\);\s*\}/, newJS);

fs.writeFileSync('app.js', app);
console.log('App.js patched with HUD telemetry functions!');

/**
 * Complexo Inscrições - Frontend logic
 * Handles form validation, local storage of inscriptions, and mock Pix generation.
 * Security: all user input is escaped before display; no eval/innerHTML with raw data.
 */
(function () {
  'use strict';

  const form = document.getElementById('form-inscricao');
  const resultado = document.getElementById('resultado');
  const protocoloEl = document.getElementById('protocolo');
  const pixCodeEl = document.getElementById('pix-code');
  const btnCopiar = document.getElementById('btn-copiar');
  const btnSubmit = document.getElementById('btn-submit');

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function generateProtocol() {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CJ-${ts}-${rand}`;
  }

  /** Mock Pix payload (EMV-like simplified for demo). Real integration would call a payment gateway. */
  function generateMockPix(valorCentavos, nomeRecebedor, cidade, protocolo) {
    // Simplified static demo code — in production use a real PSP (Mercado Pago, PagSeguro, etc.)
    const valor = (valorCentavos / 100).toFixed(2);
    return `00020126580014BR.GOV.BCB.PIX0136complexoinscricoes@demo.com520400005303986540${valor.length}${valor}5802BR5913${nomeRecebedor.substring(0, 13)}6008${cidade.substring(0, 8)}62070503***6304ABCD`;
  }

  function saveInscricao(data) {
    try {
      const key = 'complexo_inscricoes';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.push({ ...data, createdAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      console.warn('Não foi possível salvar no localStorage:', e.message);
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Processando...';

    const nome = form.nome.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const telefone = form.telefone.value.trim();
    const categoria = form.categoria.value;
    const observacoes = form.observacoes.value.trim();

    // Basic client-side sanitization / length checks (backend would re-validate)
    if (nome.length < 3 || nome.length > 120) {
      alert('Nome inválido.');
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Confirmar Inscrição e Gerar Pagamento';
      return;
    }

    const protocolo = generateProtocol();
    const pix = generateMockPix(8000, 'Complexo Insc', 'SAOPAULO', protocolo);

    const inscricao = {
      protocolo,
      nome,
      email,
      telefone,
      categoria,
      observacoes,
      valor: 80.0,
      status: 'aguardando_pagamento'
    };

    saveInscricao(inscricao);

    // Show result (escaped)
    protocoloEl.textContent = protocolo;
    pixCodeEl.textContent = pix;
    resultado.classList.remove('hidden');
    resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });

    form.reset();
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Confirmar Inscrição e Gerar Pagamento';
  });

  btnCopiar.addEventListener('click', async function () {
    const code = pixCodeEl.textContent;
    try {
      await navigator.clipboard.writeText(code);
      btnCopiar.textContent = 'Copiado!';
      setTimeout(() => { btnCopiar.textContent = 'Copiar código Pix'; }, 2000);
    } catch {
      // Fallback
      const range = document.createRange();
      range.selectNode(pixCodeEl);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      btnCopiar.textContent = 'Copiado!';
      setTimeout(() => { btnCopiar.textContent = 'Copiar código Pix'; }, 2000);
    }
  });
})();

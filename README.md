# Complexo Inscrições

Site de inscrições para o **Campeonato do Junim – Copa Presida**.

- **Categoria base:** Iniciante / Aprendiz  
- **Premiação:** R$ 1.500,00  
- **Valor inscrição (lote promocional):** R$ 80,00  

## Stack

| Camada     | Tecnologia                          |
|------------|-------------------------------------|
| Frontend   | HTML5 + Tailwind CSS (CDN) + JS vanilla |
| Backend    | Python 3 + Flask + SQLite + Flask-WTF |
| Deploy     | Netlify (frontend estático) + GitHub |

## Estrutura

```
complexoinscricoes/
├── index.html              # Frontend estático (Netlify)
├── static/
│   └── js/app.js           # Lógica do formulário + mock Pix
├── backend/
│   ├── app.py              # API Flask completa
│   ├── requirements.txt
│   └── inscricoes.db       # gerado em runtime
├── templates/              # (opcional) templates Jinja2
└── README.md
```

## Como rodar o backend localmente

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export SECRET_KEY="sua-chave-secreta-forte"
python app.py
```

Acesse http://localhost:5000

## Frontend estático

Abra `index.html` no navegador ou sirva com qualquer servidor estático. Os dados ficam no `localStorage` do navegador (demo). O backend real persiste em SQLite.

## Pagamento

O código Pix gerado é **mock** (demonstração). Em produção, integre com Mercado Pago, PagSeguro, Stripe ou similar e substitua a função `generate_mock_pix` / `generateMockPix`.

## Segurança (checklist aplicado)

- Validação de entrada (tamanho, formato e-mail, telefone)
- Queries parametrizadas (sem SQL injection)
- CSRF protection no Flask
- Escape automático de saída (Jinja2 / textContent)
- Sem eval / innerHTML com dados do usuário
- SECRET_KEY via variável de ambiente

## Repositório

https://github.com/opkzin177/complexoinscricoes

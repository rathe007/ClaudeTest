# Deployment auf GitHub Pages – Schritte

## Erledigt
- ✅ GitHub Actions Workflow (`.github/workflows/deploy.yml`) mit Build aus `auslastung/` und Base-Pfad für Pages
- ✅ Vite nutzt `BASE_PATH` im CI, lokal bleibt `base: './'`
- ✅ Supabase-Umgebungsvariablen im Workflow eingetragen (werden aus Secrets gelesen)
- ✅ Git-Repo initialisiert, Branch `main`, Commit mit allen Dateien

---

## 1. GitHub Pages auf „GitHub Actions“ umstellen

1. Repo auf GitHub öffnen (z. B. `https://github.com/DEIN-USERNAME/ClaudeTest`).
2. **Settings** → links **Pages**.
3. Unter **Build and deployment** bei **Source**: **GitHub Actions** wählen.

Damit wird das Deployment über den Workflow gesteuert.

---

## 2. Supabase-Secrets (falls du Supabase nutzt)

1. Im Repo: **Settings** → **Secrets and variables** → **Actions**.
2. **New repository secret** für:
   - Name: `VITE_SUPABASE_URL`, Value: deine Supabase-URL
   - Name: `VITE_SUPABASE_ANON_KEY`, Value: dein Anon Key

Ohne diese Secrets baut der Workflow trotzdem; die App hat dann nur keine Supabase-Anbindung.

---

## 3. Ersten Deploy auslösen

**Falls das Repo schon auf GitHub existiert:**

```bash
cd "c:\Users\PatrickRatheiser\CodingProjects\Projects\ClaudeTest"
git remote add origin https://github.com/DEIN-USERNAME/REPO-NAME.git
git push -u origin main
```

**Falls du das Repo erst anlegen musst:**

1. Auf GitHub: **New repository** (z. B. `ClaudeTest`), **ohne** README/ .gitignore initialisieren.
2. Dann im Projektordner:

```bash
git remote add origin https://github.com/DEIN-USERNAME/ClaudeTest.git
git push -u origin main
```

Nach dem Push läuft der Workflow unter **Actions**. Die App ist danach z. B. unter:

**https://DEIN-USERNAME.github.io/ClaudeTest/**

(Repo-Name ggf. anpassen.)

---

## Vercel

- Im Repo-Root liegt **`vercel.json`**: baut aus `auslastung/`, Output `auslastung/dist`, SPA-Rewrite auf `index.html`. Wenn Vercel mit **Repo-Root** verbunden ist, wird das automatisch genutzt.
- **Alternative (empfohlen):** Im Vercel-Dashboard **Settings → General**:
  - **Root Directory:** `auslastung` (dann wird `auslastung/vercel.json` genutzt)
  - **Output Directory:** `dist`
  - **Build Command:** `npm run build`
- **Environment Variables** (Settings → Environment Variables): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` für Production (und ggf. Preview) eintragen, danach **Redeploy**.

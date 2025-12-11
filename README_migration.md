```markdown
# Migration notes: PHP -> Static HTML + JS (progress plan)

This file documents the migration approach and the steps to follow when converting PHP templates to static HTML + client-side JavaScript.

## Goals
- Remove inline PHP rendering in favor of client-side rendering.
- Make UI static assets (HTML/CSS/JS) that call JSON APIs for dynamic data.
- Keep server-side logic as lightweight API endpoints if necessary.

## Steps

1. Inventory
   - List all files: `find . -name '*.php'`
   - Categorize files: templates, endpoints, shared includes.

2. Identify shared fragments (headers, footers)
   - Convert to client-side includes or use single-page layout with modular DOM.

3. Convert templates
   - Example pattern:
     - PHP: <?php foreach($items as $i): ?><div><?=htmlspecialchars($i['name'])?></div><?php endforeach; ?>
     - JS: fetch('/api/items').then(r=>r.json()).then(renderItems)

4. Forms
   - Replace HTML form POST to server with fetch() POST to `/api/...`.
   - Keep server validating inputs.

5. APIs
   - Create or adapt endpoints that return JSON.
   - `/api/items` GET for list
   - `/api/items` POST to create

6. Authentication
   - For session-based apps, either:
     - Keep session on the server and use cookie-based authenticated API calls (ensure SameSite and secure cookies), OR
     - Move to token-based auth and store tokens securely (httpOnly cookies recommended).

7. Testing
   - Manual smoke tests
   - E2E tests for flows (form submit, list display)
   - Linting for JS/HTML/CSS

8. Deployment
   - Static files: host on Vercel/Netlify/GitHub Pages
   - API: host on the server or cloud function

## Security & Accessibility
- Always escape/validate server-side inputs.
- Use textContent to avoid XSS when inserting text.
- Use ARIA and semantic HTML for accessibility.

```
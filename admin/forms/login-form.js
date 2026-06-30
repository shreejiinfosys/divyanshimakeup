/**
 * admin/forms/login-form
 * Handles the login screen: credential submit, error display, and
 * revealing the main app shell on success.
 */
import { login as apiLogin, logout as apiLogout } from '../services/api.service.js';
import { setToken, clearToken } from '../services/auth.service.js';
import { qs } from '../utils/dom.js';

export function initLoginForm(onSuccess) {
  const userInput = qs('#l-user');
  const passInput = qs('#l-pass');
  const errEl = qs('#l-err');
  const loginScreen = qs('#login-screen');
  const app = qs('#app');

  async function doLogin() {
    errEl.style.display = 'none';
    const username = userInput.value.trim();
    const password = passInput.value;

    try {
      const { token } = await apiLogin(username, password);
      setToken(token);
      loginScreen.style.display = 'none';
      app.style.display = 'flex';
      onSuccess();
    } catch {
      errEl.style.display = 'block';
      passInput.value = '';
    }
  }

  qs('.login-card .btn-g')?.addEventListener('click', doLogin);
  passInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });

  window.doLogout = async function () {
    try { await apiLogout(); } catch { /* ignore network errors on logout */ }
    clearToken();
    location.reload();
  };

  return { doLogin };
}

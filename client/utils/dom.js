/** client/utils/dom — tiny DOM helpers used across components. */
export const qs  = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
export const on  = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);

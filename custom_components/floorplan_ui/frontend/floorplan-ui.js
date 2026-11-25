/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ii = globalThis, Dn = ii.ShadowRoot && (ii.ShadyCSS === void 0 || ii.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Nn = Symbol(), cr = /* @__PURE__ */ new WeakMap();
let ua = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Nn) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Dn && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = cr.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && cr.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Es = (a) => new ua(typeof a == "string" ? a : a + "", void 0, Nn), ga = (a, ...t) => {
  const e = a.length === 1 ? a[0] : t.reduce((i, n, r) => i + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + a[r + 1], a[0]);
  return new ua(e, a, Nn);
}, Ls = (a, t) => {
  if (Dn) a.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), n = ii.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = e.cssText, a.appendChild(i);
  }
}, ur = Dn ? (a) => a : (a) => a instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Es(e);
})(a) : a;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Vs, defineProperty: Ts, getOwnPropertyDescriptor: $s, getOwnPropertyNames: Hs, getOwnPropertySymbols: Rs, getPrototypeOf: Os } = Object, Gt = globalThis, gr = Gt.trustedTypes, Fs = gr ? gr.emptyScript : "", on = Gt.reactiveElementPolyfillSupport, De = (a, t) => a, si = { toAttribute(a, t) {
  switch (t) {
    case Boolean:
      a = a ? Fs : null;
      break;
    case Object:
    case Array:
      a = a == null ? a : JSON.stringify(a);
  }
  return a;
}, fromAttribute(a, t) {
  let e = a;
  switch (t) {
    case Boolean:
      e = a !== null;
      break;
    case Number:
      e = a === null ? null : Number(a);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(a);
      } catch {
        e = null;
      }
  }
  return e;
} }, In = (a, t) => !Vs(a, t), fr = { attribute: !0, type: String, converter: si, reflect: !1, useDefault: !1, hasChanged: In };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Gt.litPropertyMetadata ?? (Gt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let _e = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = fr) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(t, i, e);
      n !== void 0 && Ts(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: n, set: r } = $s(this.prototype, t) ?? { get() {
      return this[e];
    }, set(s) {
      this[e] = s;
    } };
    return { get: n, set(s) {
      const o = n == null ? void 0 : n.call(this);
      r == null || r.call(this, s), this.requestUpdate(t, o, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? fr;
  }
  static _$Ei() {
    if (this.hasOwnProperty(De("elementProperties"))) return;
    const t = Os(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(De("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(De("properties"))) {
      const e = this.properties, i = [...Hs(e), ...Rs(e)];
      for (const n of i) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, n] of e) this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const n = this._$Eu(e, i);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const n of i) e.unshift(ur(n));
    } else t !== void 0 && e.push(ur(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ls(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var r;
    const i = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, i);
    if (n !== void 0 && i.reflect === !0) {
      const s = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : si).toAttribute(e, i.type);
      this._$Em = t, s == null ? this.removeAttribute(n) : this.setAttribute(n, s), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, s;
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = i.getPropertyOptions(n), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((r = o.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? o.converter : si;
      this._$Em = n;
      const d = l.fromAttribute(e, o.type);
      this[n] = d ?? ((s = this._$Ej) == null ? void 0 : s.get(n)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, n = !1, r) {
    var s;
    if (t !== void 0) {
      const o = this.constructor;
      if (n === !1 && (r = this[t]), i ?? (i = o.getPropertyOptions(t)), !((i.hasChanged ?? In)(r, e) || i.useDefault && i.reflect && r === ((s = this._$Ej) == null ? void 0 : s.get(t)) && !this.hasAttribute(o._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: n, wrapped: r }, s) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, s ?? e ?? this[t]), r !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, s] of this._$Ep) this[r] = s;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [r, s] of n) {
        const { wrapped: o } = s, l = this[r];
        o !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, s, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((n) => {
        var r;
        return (r = n.hostUpdate) == null ? void 0 : r.call(n);
      }), this.update(e)) : this._$EM();
    } catch (n) {
      throw t = !1, this._$EM(), n;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var n;
      return (n = i.hostUpdated) == null ? void 0 : n.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
_e.elementStyles = [], _e.shadowRootOptions = { mode: "open" }, _e[De("elementProperties")] = /* @__PURE__ */ new Map(), _e[De("finalized")] = /* @__PURE__ */ new Map(), on == null || on({ ReactiveElement: _e }), (Gt.reactiveElementVersions ?? (Gt.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ne = globalThis, pr = (a) => a, oi = Ne.trustedTypes, mr = oi ? oi.createPolicy("lit-html", { createHTML: (a) => a }) : void 0, fa = "$lit$", It = `lit$${Math.random().toFixed(9).slice(2)}$`, pa = "?" + It, Ds = `<${pa}>`, te = document, Ie = () => te.createComment(""), Ge = (a) => a === null || typeof a != "object" && typeof a != "function", Gn = Array.isArray, Ns = (a) => Gn(a) || typeof (a == null ? void 0 : a[Symbol.iterator]) == "function", ln = `[ 	
\f\r]`, He = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _r = /-->/g, yr = />/g, Xt = RegExp(`>|${ln}(?:([^\\s"'>=/]+)(${ln}*=${ln}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), br = /'/g, vr = /"/g, ma = /^(?:script|style|textarea|title)$/i, Is = (a) => (t, ...e) => ({ _$litType$: a, strings: t, values: e }), V = Is(1), ve = Symbol.for("lit-noChange"), ct = Symbol.for("lit-nothing"), Cr = /* @__PURE__ */ new WeakMap(), Jt = te.createTreeWalker(te, 129);
function _a(a, t) {
  if (!Gn(a) || !a.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return mr !== void 0 ? mr.createHTML(t) : t;
}
const Gs = (a, t) => {
  const e = a.length - 1, i = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = He;
  for (let o = 0; o < e; o++) {
    const l = a[o];
    let d, c, p = -1, f = 0;
    for (; f < l.length && (s.lastIndex = f, c = s.exec(l), c !== null); ) f = s.lastIndex, s === He ? c[1] === "!--" ? s = _r : c[1] !== void 0 ? s = yr : c[2] !== void 0 ? (ma.test(c[2]) && (n = RegExp("</" + c[2], "g")), s = Xt) : c[3] !== void 0 && (s = Xt) : s === Xt ? c[0] === ">" ? (s = n ?? He, p = -1) : c[1] === void 0 ? p = -2 : (p = s.lastIndex - c[2].length, d = c[1], s = c[3] === void 0 ? Xt : c[3] === '"' ? vr : br) : s === vr || s === br ? s = Xt : s === _r || s === yr ? s = He : (s = Xt, n = void 0);
    const g = s === Xt && a[o + 1].startsWith("/>") ? " " : "";
    r += s === He ? l + Ds : p >= 0 ? (i.push(d), l.slice(0, p) + fa + l.slice(p) + It + g) : l + It + (p === -2 ? o : g);
  }
  return [_a(a, r + (a[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Be {
  constructor({ strings: t, _$litType$: e }, i) {
    let n;
    this.parts = [];
    let r = 0, s = 0;
    const o = t.length - 1, l = this.parts, [d, c] = Gs(t, e);
    if (this.el = Be.createElement(d, i), Jt.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = Jt.nextNode()) !== null && l.length < o; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(fa)) {
          const f = c[s++], g = n.getAttribute(p).split(It), u = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: r, name: u[2], strings: g, ctor: u[1] === "." ? Us : u[1] === "?" ? zs : u[1] === "@" ? js : gi }), n.removeAttribute(p);
        } else p.startsWith(It) && (l.push({ type: 6, index: r }), n.removeAttribute(p));
        if (ma.test(n.tagName)) {
          const p = n.textContent.split(It), f = p.length - 1;
          if (f > 0) {
            n.textContent = oi ? oi.emptyScript : "";
            for (let g = 0; g < f; g++) n.append(p[g], Ie()), Jt.nextNode(), l.push({ type: 2, index: ++r });
            n.append(p[f], Ie());
          }
        }
      } else if (n.nodeType === 8) if (n.data === pa) l.push({ type: 2, index: r });
      else {
        let p = -1;
        for (; (p = n.data.indexOf(It, p + 1)) !== -1; ) l.push({ type: 7, index: r }), p += It.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = te.createElement("template");
    return i.innerHTML = t, i;
  }
}
function Ce(a, t, e = a, i) {
  var s, o;
  if (t === ve) return t;
  let n = i !== void 0 ? (s = e._$Co) == null ? void 0 : s[i] : e._$Cl;
  const r = Ge(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== r && ((o = n == null ? void 0 : n._$AO) == null || o.call(n, !1), r === void 0 ? n = void 0 : (n = new r(a), n._$AT(a, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = n : e._$Cl = n), n !== void 0 && (t = Ce(a, n._$AS(a, t.values), n, i)), t;
}
class Bs {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? te).importNode(e, !0);
    Jt.currentNode = n;
    let r = Jt.nextNode(), s = 0, o = 0, l = i[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let d;
        l.type === 2 ? d = new je(r, r.nextSibling, this, t) : l.type === 1 ? d = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (d = new Ws(r, this, t)), this._$AV.push(d), l = i[++o];
      }
      s !== (l == null ? void 0 : l.index) && (r = Jt.nextNode(), s++);
    }
    return Jt.currentNode = te, n;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class je {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, n) {
    this.type = 2, this._$AH = ct, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = Ce(this, t, e), Ge(t) ? t === ct || t == null || t === "" ? (this._$AH !== ct && this._$AR(), this._$AH = ct) : t !== this._$AH && t !== ve && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ns(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== ct && Ge(this._$AH) ? this._$AA.nextSibling.data = t : this.T(te.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Be.createElement(_a(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === n) this._$AH.p(e);
    else {
      const s = new Bs(n, this), o = s.u(this.options);
      s.p(e), this.T(o), this._$AH = s;
    }
  }
  _$AC(t) {
    let e = Cr.get(t.strings);
    return e === void 0 && Cr.set(t.strings, e = new Be(t)), e;
  }
  k(t) {
    Gn(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, n = 0;
    for (const r of t) n === e.length ? e.push(i = new je(this.O(Ie()), this.O(Ie()), this, this.options)) : i = e[n], i._$AI(r), n++;
    n < e.length && (this._$AR(i && i._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const n = pr(t).nextSibling;
      pr(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class gi {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, n, r) {
    this.type = 1, this._$AH = ct, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = ct;
  }
  _$AI(t, e = this, i, n) {
    const r = this.strings;
    let s = !1;
    if (r === void 0) t = Ce(this, t, e, 0), s = !Ge(t) || t !== this._$AH && t !== ve, s && (this._$AH = t);
    else {
      const o = t;
      let l, d;
      for (t = r[0], l = 0; l < r.length - 1; l++) d = Ce(this, o[i + l], e, l), d === ve && (d = this._$AH[l]), s || (s = !Ge(d) || d !== this._$AH[l]), d === ct ? t = ct : t !== ct && (t += (d ?? "") + r[l + 1]), this._$AH[l] = d;
    }
    s && !n && this.j(t);
  }
  j(t) {
    t === ct ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Us extends gi {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === ct ? void 0 : t;
  }
}
class zs extends gi {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== ct);
  }
}
class js extends gi {
  constructor(t, e, i, n, r) {
    super(t, e, i, n, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = Ce(this, t, e, 0) ?? ct) === ve) return;
    const i = this._$AH, n = t === ct && i !== ct || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== ct && (i === ct || n);
    n && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ws {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Ce(this, t);
  }
}
const dn = Ne.litHtmlPolyfillSupport;
dn == null || dn(Be, je), (Ne.litHtmlVersions ?? (Ne.litHtmlVersions = [])).push("3.3.2");
const Ks = (a, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let n = i._$litPart$;
  if (n === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = n = new je(t.insertBefore(Ie(), r), r, void 0, e ?? {});
  }
  return n._$AI(a), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = globalThis;
class ye extends _e {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ks(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return ve;
  }
}
var ca;
ye._$litElement$ = !0, ye.finalized = !0, (ca = Qt.litElementHydrateSupport) == null || ca.call(Qt, { LitElement: ye });
const hn = Qt.litElementPolyfillSupport;
hn == null || hn({ LitElement: ye });
(Qt.litElementVersions ?? (Qt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ys = { attribute: !0, type: String, converter: si, reflect: !1, hasChanged: In }, Xs = (a = Ys, t, e) => {
  const { kind: i, metadata: n } = e;
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), i === "setter" && ((a = Object.create(a)).wrapped = !0), r.set(e.name, a), i === "accessor") {
    const { name: s } = e;
    return { set(o) {
      const l = t.get.call(this);
      t.set.call(this, o), this.requestUpdate(s, l, a, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(s, void 0, a, o), o;
    } };
  }
  if (i === "setter") {
    const { name: s } = e;
    return function(o) {
      const l = this[s];
      t.call(this, o), this.requestUpdate(s, l, a, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Me(a) {
  return (t, e) => typeof e == "object" ? Xs(a, t, e) : ((i, n, r) => {
    const s = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, i), s ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(a, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function tt(a) {
  return Me({ ...a, state: !0, attribute: !1 });
}
const ya = /* @__PURE__ */ new Set([
  "on",
  "open",
  "playing",
  "heat",
  "cool",
  "heat_cool",
  "cleaning",
  "unlocked"
]);
function* ba(a, t, e, i) {
  const n = /* @__PURE__ */ new Set();
  for (const r of [e, i])
    for (const s of r) {
      if (!a || s.area_id !== a || n.has(s.entity_id)) continue;
      n.add(s.entity_id);
      const o = t[s.entity_id];
      o && o.state !== "unknown" && o.state !== "unavailable" && (yield o);
    }
}
function Zs(a) {
  const t = ee(a.entity_id);
  return t === "binary_sensor" ? a.state === "on" && ["door", "window", "opening", "garage_door"].includes(String(a.attributes.device_class)) : (t === "cover" || t === "lock") && (a.state === "open" || a.state === "opening");
}
function qs(a, t, e, i, n = []) {
  let r = 0, s = 0, o = 1 / 0, l = -1 / 0;
  const d = /* @__PURE__ */ new Set(), c = ["avg", "sum", "min", "max"].includes(a.aggregation);
  for (const _ of ba(t, e, i, n))
    if (!(a.domain && ee(_.entity_id) !== a.domain) && !(a.device_class && _.attributes.device_class !== a.device_class) && !(a.aggregation === "count_on" && !ya.has(_.state)) && !(a.aggregation === "count_open" && !Zs(_))) {
      if (c) {
        const y = a.attr ? _.attributes[a.attr] : _.state;
        if (typeof y != "number" && !(typeof y == "string" && y.trim())) continue;
        const v = Number(y);
        if (!Number.isFinite(v)) continue;
        s += v, o = Math.min(o, v), l = Math.max(l, v), a.attr || d.add(_.attributes.unit_of_measurement);
      }
      r++;
    }
  if (c && !r) return "";
  const f = { avg: s / r, sum: s, min: o, max: l, count: r, count_on: r, count_open: r }[a.aggregation], g = String(
    ["avg", "sum"].includes(a.aggregation) ? Number(f.toFixed(1)) : f
  );
  if (a.format !== void 0) return a.format.split("{value}").join(g);
  const [u] = d;
  return d.size === 1 && typeof u == "string" && u.trim() ? g + " " + u.trim() : g;
}
function Js(a, t, e, i, n = []) {
  for (const r of ba(a, e, i, n))
    if (ya.has(r.state) && (!(t != null && t.length) || t.includes(ee(r.entity_id))))
      return !0;
  return !1;
}
const va = ["unavailable", "unknown"];
function ee(a) {
  return a.split(".", 1)[0] ?? "";
}
function Qs(a, t, e) {
  const i = t == null ? void 0 : t.attributes.friendly_name;
  return typeof i == "string" && i.trim() ? i : e != null && e.name ? e.name : a.entity_id;
}
function Ca(a, t, e) {
  return a.label_mode === "off" ? "" : a.label_mode === "short" ? a.entity_id.split(".").at(-1) ?? a.entity_id : Qs(a, t, e);
}
function wa(a, t) {
  var n;
  if (!a) return "";
  if (!t || va.includes(t.state)) return "Unavailable";
  const e = a.source === "attr" && a.attr ? t.attributes[a.attr] : t.state;
  if (e == null || e === "")
    return "Unavailable";
  const i = String(e);
  return (n = a.format) != null && n.includes("{value}") ? a.format.split("{value}").join(i) : i;
}
function wr(a, t, e = "primary") {
  return wa(a.bind[e], t);
}
function li(a, t, e) {
  return a ? a.mode === "aggregate" ? e != null && e.areaId ? qs(
    a,
    e.areaId,
    t,
    e.entities ?? [],
    e.markers ?? []
  ) : "" : wa(a, t[a.entity_id]) : "";
}
function Aa(a, t) {
  return (a ?? []).filter((e) => {
    var i;
    return ((i = t[e.entity_id]) == null ? void 0 : i.state) === e.when.state_is;
  });
}
function Sa(a, t) {
  if (!t) return !0;
  const { domains: e, tags: i, area_ids: n } = t.filters ?? {};
  return !(e != null && e.length && !e.includes(ee(a.entity_id)) || i != null && i.length && !i.some((r) => a.tags.includes(r)) || n != null && n.length && (!a.area_id || !n.includes(a.area_id)));
}
function xa(a) {
  return !a || va.includes(a.state) ? "#9e9e9e" : ["on", "open", "playing", "home", "heat"].includes(a.state) ? "#ffb300" : "#1976d2";
}
function to(a) {
  const t = {
    binary_sensor: "B",
    climate: "T",
    device_tracker: "N",
    light: "L",
    media_player: "M",
    sensor: "S",
    switch: "P"
  }, e = ee(a);
  return t[e] ?? e.slice(0, 1).toUpperCase() ?? "?";
}
function eo(a) {
  const t = ee(a);
  return t === "climate" ? ["heating"] : t === "device_tracker" ? ["network"] : [];
}
const Ar = {
  "panel.emptyDescription3d": "Upload a PNG, JPEG, SVG or 3D GLB file.",
  "panel.assetTypeError": "Choose a PNG, JPEG, SVG or GLB file.",
  "panel.modelTooLarge": "The 3D model exceeds the upload limit.",
  "panel.modelLoadError": "Could not load the 3D model.",
  "panel.modelUploadFailed": "Could not upload the 3D model.",
  "panel.webglUnavailable": "WebGL is unavailable in this browser.",
  "panel.webglContextLost": "The WebGL context was lost.",
  "editor.bindMesh": "Bind mesh",
  "editor.addAnchor3d": "Add 3D anchor",
  "editor.cameraPreset": "Camera preset",
  "editor.presetIso": "Isometric",
  "editor.presetTop": "Top",
  "editor.presetFront": "Front",
  "editor.cameraOrtho": "Orthographic",
  "editor.cameraPerspective": "Perspective",
  "editor.savePreset": "Save current camera",
  "editor.deletePreset": "Delete preset",
  "editor.applyPreset": "Apply",
  "editor.shadows": "Shadows",
  "editor.lighting3d": "Live lighting",
  "editor.plan3dSettings": "3D plan settings",
  "editor.meshName": "Mesh name",
  "editor.pickMeshHint": "Choose the model mesh for this area.",
  "editor.position3d": "3D position",
  "editor.viewCameraPreset": "View camera preset",
  "editor.defaultCamera": "Default camera",
  "editor.icon": "Icon",
  "editor.iconHint": "Leave blank to use the entity icon.",
  "editor.iconPlaceholder": "mdi:lightbulb",
  "editor.overlayMode": "Overlay mode",
  "editor.modeEntity": "Entity",
  "editor.modeAggregate": "Aggregate",
  "editor.aggregation": "Aggregation",
  "editor.aggCountOn": "Count on",
  "editor.aggCountOpen": "Count open",
  "editor.aggCount": "Count",
  "editor.aggAvg": "Average",
  "editor.aggMin": "Minimum",
  "editor.aggMax": "Maximum",
  "editor.aggSum": "Sum",
  "editor.deviceClass": "Device class",
  "editor.aggregateHint": "Calculate a value from matching entities in each Home Assistant area.",
  "editor.viewStyle": "View styling",
  "editor.dimInactiveAreas": "Dim inactive areas",
  "editor.inactiveOpacity": "Inactive opacity",
  "editor.highlightActiveAreas": "Highlight active areas",
  "editor.activeFill": "Active fill",
  "editor.activeStroke": "Active outline",
  "editor.activeOpacity": "Active opacity",
  "editor.viewStyleHint": "Adjust how active and inactive areas appear in this view.",
  "editor.helpArea": "Link a drawing to a Home Assistant area.",
  "editor.helpMarker": "Choose what the marker displays and what happens when tapped.",
  "editor.helpViewOverlay": "Choose which values appear over each area.",
  "editor.help3d": "Save the current camera position to return to it later.",
  "editor.badgesHint": "Use entity=state:label, separated by commas.",
  "warnings.title": "Configuration warnings",
  "warnings.button": "Warnings ({count})",
  "warnings.empty": "No configuration warnings.",
  "warnings.close": "Close",
  "warnings.jumpTo": "Go to item",
  "warnings.error": "Error",
  "warnings.warning": "Warning",
  "diagnostics.missing_entity": "Entity {entityId} is missing.",
  "diagnostics.unavailable_entity": "Entity {entityId} is unavailable.",
  "diagnostics.unbound_area": "Area {targetId} has no Home Assistant area assigned.",
  "diagnostics.missing_area": "Home Assistant area {areaId} is missing.",
  "diagnostics.invalid_binding": "Attribute {attr} is missing on {entityId}.",
  "diagnostics.missing_background": "Plan {planName} has no background.",
  "diagnostics.missing_mesh": "Mesh {meshName} is missing from the model.",
  "diagnostics.overlay_missing_entity": "Overlay entity {entityId} is missing.",
  "panel.title": "Floorplan",
  "panel.plan": "Plan:",
  "panel.views": "Views",
  "panel.emptyViewer": "An administrator can add a floorplan here.",
  "panel.selectPlan": "Select plan",
  "panel.all": "All",
  "panel.edit": "Edit",
  "panel.done": "Done",
  "panel.viewOnly": "View only",
  "panel.loading": "Loading floorplan…",
  "panel.pending": "Changes pending…",
  "panel.saving": "Saving changes…",
  "panel.emptyTitle": "No floorplan configured",
  "panel.emptyDescription": "Upload a PNG or JPEG floorplan to get started.",
  "panel.upload": "Upload floorplan",
  "panel.canvas": "Interactive floorplan canvas",
  "panel.zoomOut": "Zoom out",
  "panel.zoomIn": "Zoom in",
  "panel.mapContents": "Areas {areas} · Markers {markers}",
  "panel.editContents": "All plan objects",
  "panel.fit": "Fit plan",
  "panel.objects": "Objects on the current floorplan",
  "panel.areaObject": "Area {id}",
  "panel.markerObject": "Marker for {entity}",
  "panel.changesSaved": "Changes saved.",
  "panel.saveFailed": "Changes could not be saved.",
  "panel.retry": "Retry",
  "panel.conflict": "A newer configuration is available. Reload before continuing.",
  "panel.reload": "Reload latest",
  "panel.loadError": "Floorplan configuration could not be loaded.",
  "panel.planNamed": "Plan “{name}”",
  "panel.canvasInitError": "The floorplan canvas could not be initialized.",
  "panel.imageRenderError": "The floorplan image could not be rendered.",
  "panel.imageLoadError": "The floorplan image could not be loaded.",
  "panel.registryLoadError": "Home Assistant areas and entities could not be loaded.",
  "panel.selectExistingEntity": "Select an existing Home Assistant entity.",
  "panel.defaultView": "“{name}” is the default view.",
  "panel.exported": "Configuration and images exported.",
  "panel.exportFailed": "Export failed.",
  "panel.configTooLarge": "The backup file must not exceed 128 MB.",
  "panel.invalidConfig": "The file is not a valid configuration.",
  "panel.importFailed": "Import failed: {message}",
  "panel.imported": "Configuration imported and saved.",
  "panel.imageTypeError": "Only PNG and JPEG floorplans are supported.",
  "panel.imageTooLarge": "The floorplan image must not exceed 4 MB.",
  "panel.imageUploadFailed": "The selected image could not be uploaded.",
  "panel.actionFailed": "The entity could not be toggled.",
  "editor.selectTool": "Select",
  "editor.rectangle": "Rectangle",
  "editor.polygon": "Polygon",
  "editor.library": "Library",
  "editor.inspector": "Inspector",
  "editor.settings": "Settings",
  "editor.libraryHint": "Choose an entity, then tap the plan. You can also drag it into place.",
  "editor.showMore": "Show more entities",
  "editor.noResults": "No matching entities.",
  "editor.placeHint": "Tap to place · Enter for center",
  "editor.title": "Edit floorplan",
  "editor.quickActions": "Add to plan",
  "editor.selectHint": "Select an area or marker on the plan to edit its properties.",
  "editor.filters": "Filter entities",
  "editor.entities": "Entities",
  "editor.planView": "Plan and views",
  "editor.viewOverlay": "View and overlays",
  "editor.upload": "Add floorplan",
  "editor.replaceImage": "Replace plan image",
  "editor.undo": "Undo",
  "editor.redo": "Redo",
  "editor.renamePlan": "Rename plan",
  "editor.deletePlan": "Delete plan",
  "editor.addRectangle": "Add rectangle",
  "editor.addPolygon": "Add polygon",
  "editor.addView": "Add view",
  "editor.renameView": "Rename view",
  "editor.previousView": "Previous view",
  "editor.nextView": "Next view",
  "editor.setDefault": "Set default",
  "editor.deleteView": "Delete view",
  "editor.export": "Export JSON",
  "editor.import": "Import JSON",
  "editor.searchEntity": "Search entity:",
  "editor.domain": "Domain:",
  "editor.haArea": "HA area:",
  "editor.allDomains": "All domains",
  "editor.allAreas": "All areas",
  "editor.selectEntity": "Select entity ({count})",
  "editor.addMarker": "Add marker",
  "editor.dragEntity": "Drag entity onto plan:",
  "editor.dragHint": "Drag onto the floorplan. On touch, press briefly, then drag.",
  "editor.viewFilters": "View “{name}” filters:",
  "editor.domains": "Domains:",
  "editor.tags": "Tags:",
  "editor.areaIds": "Area IDs:",
  "editor.areaOverlay": "Area overlay:",
  "editor.primaryEntity": "Primary entity:",
  "editor.secondaryEntity": "Secondary entity:",
  "editor.source": "Source:",
  "editor.state": "State",
  "editor.attribute": "Attribute:",
  "editor.attributeOption": "Attribute",
  "editor.format": "Format:",
  "editor.secondaryBadges": "Secondary / badges:",
  "editor.badges": "Badges:",
  "editor.selectedArea": "Selected area:",
  "editor.selectedMarker": "Selected marker:",
  "editor.unbound": "Unbound",
  "editor.fill": "Fill:",
  "editor.stroke": "Stroke:",
  "editor.opacity": "Opacity:",
  "editor.strokeWidth": "Stroke width:",
  "editor.deleteArea": "Delete area",
  "editor.label": "Label:",
  "editor.markerAction": "When tapped",
  "editor.actionDetails": "Show entity details",
  "editor.actionToggle": "Toggle entity",
  "editor.actionNone": "Do nothing",
  "editor.auto": "Auto",
  "editor.short": "Short",
  "editor.full": "Full",
  "editor.off": "Off",
  "editor.primary": "Primary:",
  "editor.secondary": "Secondary:",
  "editor.removeSecondary": "Remove secondary",
  "editor.addSecondary": "Add secondary",
  "editor.deleteMarker": "Delete marker",
  "dialog.cancel": "Cancel",
  "dialog.save": "Save",
  "dialog.confirmTitle": "Please confirm",
  "dialog.confirm": "Confirm",
  "dialog.reloadMessage": "Reload the server version and replace your local unsaved changes?",
  "dialog.reload": "Reload",
  "dialog.renamePlan": "Rename plan",
  "dialog.deletePlanMessage": "Delete the current plan and its areas and markers?",
  "dialog.deleteAreaMessage": "Delete the selected area?",
  "dialog.deleteMarkerMessage": "Delete selected marker?",
  "dialog.newView": "New view name",
  "dialog.renameView": "Rename view",
  "dialog.deleteViewMessage": "Delete the current view?",
  "dialog.replacePlanKindMessage": "Switching between a 2D image and a 3D model will clear existing areas, markers, and camera presets on this plan. Continue?",
  "dialog.importMessage": "Import {plans} plan(s) and {views} view(s)?",
  "dialog.import": "Import"
}, io = {
  "panel.emptyDescription3d": "Lade eine PNG-, JPEG-, SVG- oder 3D-GLB-Datei hoch.",
  "panel.assetTypeError": "Wähle eine PNG-, JPEG-, SVG- oder GLB-Datei.",
  "panel.modelTooLarge": "Das 3D-Modell überschreitet die Uploadgrenze.",
  "panel.modelLoadError": "Das 3D-Modell konnte nicht geladen werden.",
  "panel.modelUploadFailed": "Das 3D-Modell konnte nicht hochgeladen werden.",
  "panel.webglUnavailable": "WebGL ist in diesem Browser nicht verfügbar.",
  "panel.webglContextLost": "Der WebGL-Kontext wurde verloren.",
  "editor.bindMesh": "Mesh verknüpfen",
  "editor.addAnchor3d": "3D-Anker hinzufügen",
  "editor.cameraPreset": "Kameraposition",
  "editor.presetIso": "Isometrisch",
  "editor.presetTop": "Von oben",
  "editor.presetFront": "Von vorne",
  "editor.cameraOrtho": "Orthografisch",
  "editor.cameraPerspective": "Perspektivisch",
  "editor.savePreset": "Aktuelle Kameraposition speichern",
  "editor.deletePreset": "Kameraposition löschen",
  "editor.applyPreset": "Anwenden",
  "editor.shadows": "Schatten",
  "editor.lighting3d": "Dynamische Beleuchtung",
  "editor.plan3dSettings": "3D-Planeinstellungen",
  "editor.meshName": "Mesh-Name",
  "editor.pickMeshHint": "Wähle das Mesh des Modells für diesen Bereich.",
  "editor.position3d": "3D-Position",
  "editor.viewCameraPreset": "Kameraposition der Ansicht",
  "editor.defaultCamera": "Standardkamera",
  "editor.icon": "Symbol",
  "editor.iconHint": "Leer lassen, um das Entitätssymbol zu verwenden.",
  "editor.iconPlaceholder": "mdi:lightbulb",
  "editor.overlayMode": "Overlay-Modus",
  "editor.modeEntity": "Entität",
  "editor.modeAggregate": "Aggregat",
  "editor.aggregation": "Aggregation",
  "editor.aggCountOn": "Eingeschaltete zählen",
  "editor.aggCountOpen": "Geöffnete zählen",
  "editor.aggCount": "Anzahl",
  "editor.aggAvg": "Durchschnitt",
  "editor.aggMin": "Minimum",
  "editor.aggMax": "Maximum",
  "editor.aggSum": "Summe",
  "editor.deviceClass": "Geräteklasse",
  "editor.aggregateHint": "Berechnet für jeden Home-Assistant-Bereich einen Wert aus den passenden Entitäten.",
  "editor.viewStyle": "Ansichtsstil",
  "editor.dimInactiveAreas": "Inaktive Bereiche abdunkeln",
  "editor.inactiveOpacity": "Deckkraft inaktiver Bereiche",
  "editor.highlightActiveAreas": "Aktive Bereiche hervorheben",
  "editor.activeFill": "Füllfarbe aktiver Bereiche",
  "editor.activeStroke": "Konturfarbe aktiver Bereiche",
  "editor.activeOpacity": "Deckkraft aktiver Bereiche",
  "editor.viewStyleHint": "Passe die Darstellung aktiver und inaktiver Bereiche in dieser Ansicht an.",
  "editor.helpArea": "Verknüpfe die Zeichnung mit einem Home-Assistant-Bereich.",
  "editor.helpMarker": "Lege Anzeige und Tippaktion des Markers fest.",
  "editor.helpViewOverlay": "Wähle die Werte, die über jedem Bereich erscheinen.",
  "editor.help3d": "Speichere die aktuelle Kameraposition, um sie später wieder aufzurufen.",
  "editor.badgesHint": "Nutze Entität=Zustand:Text und trenne Einträge durch Kommas.",
  "warnings.title": "Konfigurationswarnungen",
  "warnings.button": "Warnungen ({count})",
  "warnings.empty": "Keine Konfigurationswarnungen.",
  "warnings.close": "Schließen",
  "warnings.jumpTo": "Zum Eintrag",
  "warnings.error": "Fehler",
  "warnings.warning": "Warnung",
  "diagnostics.missing_entity": "Entität {entityId} fehlt.",
  "diagnostics.unavailable_entity": "Entität {entityId} ist nicht verfügbar.",
  "diagnostics.unbound_area": "Bereich {targetId} ist keinem Home-Assistant-Bereich zugeordnet.",
  "diagnostics.missing_area": "Home-Assistant-Bereich {areaId} fehlt.",
  "diagnostics.invalid_binding": "Attribut {attr} fehlt bei {entityId}.",
  "diagnostics.missing_background": "Plan {planName} hat keinen Hintergrund.",
  "diagnostics.missing_mesh": "Mesh {meshName} fehlt im Modell.",
  "diagnostics.overlay_missing_entity": "Overlay-Entität {entityId} fehlt.",
  "panel.title": "Grundriss",
  "panel.plan": "Plan:",
  "panel.views": "Ansichten",
  "panel.emptyViewer": "Eine Administratorin oder ein Administrator kann hier einen Grundriss hinzufügen.",
  "panel.selectPlan": "Plan auswählen",
  "panel.all": "Alle",
  "panel.edit": "Bearbeiten",
  "panel.done": "Fertig",
  "panel.viewOnly": "Nur ansehen",
  "panel.loading": "Grundriss wird geladen…",
  "panel.pending": "Änderungen ausstehend…",
  "panel.saving": "Änderungen werden gespeichert…",
  "panel.emptyTitle": "Kein Grundriss konfiguriert",
  "panel.emptyDescription": "Lade zum Start einen PNG- oder JPEG-Grundriss hoch.",
  "panel.upload": "Grundriss hochladen",
  "panel.canvas": "Interaktive Grundrissfläche",
  "panel.zoomOut": "Verkleinern",
  "panel.zoomIn": "Vergrößern",
  "panel.mapContents": "Flächen {areas} · Marker {markers}",
  "panel.editContents": "Alle Planobjekte",
  "panel.fit": "Plan einpassen",
  "panel.objects": "Objekte im aktuellen Grundriss",
  "panel.areaObject": "Bereich {id}",
  "panel.markerObject": "Marker für {entity}",
  "panel.changesSaved": "Änderungen gespeichert.",
  "panel.saveFailed": "Änderungen konnten nicht gespeichert werden.",
  "panel.retry": "Erneut versuchen",
  "panel.conflict": "Eine neuere Konfiguration ist verfügbar. Lade sie vor dem Fortfahren neu.",
  "panel.reload": "Neuesten Stand laden",
  "panel.loadError": "Die Grundrisskonfiguration konnte nicht geladen werden.",
  "panel.planNamed": "Plan „{name}“",
  "panel.canvasInitError": "Die Grundrissfläche konnte nicht initialisiert werden.",
  "panel.imageRenderError": "Das Grundrissbild konnte nicht dargestellt werden.",
  "panel.imageLoadError": "Das Grundrissbild konnte nicht geladen werden.",
  "panel.registryLoadError": "Home-Assistant-Bereiche und -Entitäten konnten nicht geladen werden.",
  "panel.selectExistingEntity": "Wähle eine vorhandene Home-Assistant-Entität aus.",
  "panel.defaultView": "„{name}“ ist die Standardansicht.",
  "panel.exported": "Konfiguration und Bilder wurden exportiert.",
  "panel.exportFailed": "Export fehlgeschlagen.",
  "panel.configTooLarge": "Die Sicherungsdatei darf höchstens 128 MB groß sein.",
  "panel.invalidConfig": "Die Datei enthält keine gültige Konfiguration.",
  "panel.importFailed": "Import fehlgeschlagen: {message}",
  "panel.imported": "Konfiguration importiert und gespeichert.",
  "panel.imageTypeError": "Es werden nur PNG- und JPEG-Grundrisse unterstützt.",
  "panel.imageTooLarge": "Das Grundrissbild darf höchstens 4 MB groß sein.",
  "panel.imageUploadFailed": "Das ausgewählte Bild konnte nicht hochgeladen werden.",
  "panel.actionFailed": "Die Entität konnte nicht umgeschaltet werden.",
  "editor.selectTool": "Auswahl",
  "editor.rectangle": "Rechteck",
  "editor.polygon": "Polygon",
  "editor.library": "Entitäten",
  "editor.inspector": "Eigenschaften",
  "editor.settings": "Einstellungen",
  "editor.libraryHint": "Entität wählen und auf den Plan tippen oder die Entität an die gewünschte Stelle ziehen.",
  "editor.showMore": "Weitere Entitäten anzeigen",
  "editor.noResults": "Keine passenden Entitäten.",
  "editor.placeHint": "Zum Platzieren tippen · Eingabe für Mitte",
  "editor.title": "Grundriss bearbeiten",
  "editor.quickActions": "Zum Plan hinzufügen",
  "editor.selectHint": "Wähle einen Bereich oder Marker im Plan, um seine Eigenschaften zu bearbeiten.",
  "editor.filters": "Entitäten filtern",
  "editor.entities": "Entität platzieren",
  "editor.planView": "Plan und Ansichten",
  "editor.viewOverlay": "Ansicht und Overlays",
  "editor.upload": "Grundriss hinzufügen",
  "editor.replaceImage": "Grundrissbild ersetzen",
  "editor.undo": "Rückgängig",
  "editor.redo": "Wiederholen",
  "editor.renamePlan": "Plan umbenennen",
  "editor.deletePlan": "Plan löschen",
  "editor.addRectangle": "Rechteck hinzufügen",
  "editor.addPolygon": "Polygon hinzufügen",
  "editor.addView": "Ansicht hinzufügen",
  "editor.renameView": "Ansicht umbenennen",
  "editor.previousView": "Vorherige Ansicht",
  "editor.nextView": "Nächste Ansicht",
  "editor.setDefault": "Als Standard setzen",
  "editor.deleteView": "Ansicht löschen",
  "editor.export": "JSON exportieren",
  "editor.import": "JSON importieren",
  "editor.searchEntity": "Entität suchen:",
  "editor.domain": "Domäne:",
  "editor.haArea": "HA-Bereich:",
  "editor.allDomains": "Alle Domänen",
  "editor.allAreas": "Alle Bereiche",
  "editor.selectEntity": "Entität auswählen ({count})",
  "editor.addMarker": "Marker hinzufügen",
  "editor.dragEntity": "Entität auf dem Plan platzieren:",
  "editor.dragHint": "Auf den Grundriss ziehen. Bei Touch kurz halten, dann ziehen.",
  "editor.viewFilters": "Filter der Ansicht „{name}“:",
  "editor.domains": "Domänen:",
  "editor.tags": "Tags:",
  "editor.areaIds": "Bereichs-IDs:",
  "editor.areaOverlay": "Bereichs-Overlay:",
  "editor.primaryEntity": "Primäre Entität:",
  "editor.secondaryEntity": "Sekundäre Entität:",
  "editor.source": "Quelle:",
  "editor.state": "Status",
  "editor.attribute": "Attribut:",
  "editor.attributeOption": "Attribut",
  "editor.format": "Format:",
  "editor.secondaryBadges": "Sekundärwert / Badges:",
  "editor.badges": "Badges:",
  "editor.selectedArea": "Ausgewählter Bereich:",
  "editor.selectedMarker": "Ausgewählter Marker:",
  "editor.unbound": "Nicht gebunden",
  "editor.fill": "Füllung:",
  "editor.stroke": "Kontur:",
  "editor.opacity": "Deckkraft:",
  "editor.strokeWidth": "Konturstärke:",
  "editor.deleteArea": "Bereich löschen",
  "editor.label": "Beschriftung:",
  "editor.markerAction": "Beim Antippen",
  "editor.actionDetails": "Entitätsdetails anzeigen",
  "editor.actionToggle": "Entität umschalten",
  "editor.actionNone": "Keine Aktion",
  "editor.auto": "Automatisch",
  "editor.short": "Kurz",
  "editor.full": "Vollständig",
  "editor.off": "Aus",
  "editor.primary": "Primär:",
  "editor.secondary": "Sekundär:",
  "editor.removeSecondary": "Sekundärwert entfernen",
  "editor.addSecondary": "Sekundärwert hinzufügen",
  "editor.deleteMarker": "Marker löschen",
  "dialog.cancel": "Abbrechen",
  "dialog.save": "Speichern",
  "dialog.confirmTitle": "Bitte bestätigen",
  "dialog.confirm": "Bestätigen",
  "dialog.reloadMessage": "Serverstand laden und lokale ungespeicherte Änderungen ersetzen?",
  "dialog.reload": "Neu laden",
  "dialog.renamePlan": "Plan umbenennen",
  "dialog.deletePlanMessage": "Den aktuellen Plan mit seinen Bereichen und Markern löschen?",
  "dialog.deleteAreaMessage": "Den ausgewählten Bereich löschen?",
  "dialog.deleteMarkerMessage": "Ausgewählten Marker löschen?",
  "dialog.newView": "Name der neuen Ansicht",
  "dialog.renameView": "Ansicht umbenennen",
  "dialog.deleteViewMessage": "Aktuelle Ansicht löschen?",
  "dialog.replacePlanKindMessage": "Beim Wechsel zwischen 2D-Bild und 3D-Modell werden vorhandene Bereiche, Marker und Kamerapositionen dieses Plans zurückgesetzt. Fortfahren?",
  "dialog.importMessage": "{plans} Plan/Pläne und {views} Ansicht(en) importieren?",
  "dialog.import": "Importieren"
};
function no(a) {
  const t = a != null && a.toLowerCase().startsWith("de") ? io : Ar;
  return (e, i = {}) => {
    let n = t[e] ?? Ar[e] ?? String(e);
    for (const [r, s] of Object.entries(i))
      n = n.split(`{${r}}`).join(String(s));
    return n;
  };
}
function ro(a) {
  return structuredClone(a);
}
function Ma(a) {
  var e;
  const t = ro(a);
  for (const i of Array.isArray(t.plans) ? t.plans : [])
    (e = i == null ? void 0 : i.background) != null && e.asset_id && delete i.background.url;
  return t;
}
async function ao(a) {
  return a.callWS({
    type: "floorplan_ui/get_config"
  });
}
async function so(a, t, e) {
  return (await a.callWS({
    type: "floorplan_ui/save_config",
    base_revision: e,
    config: Ma(t)
  })).revision;
}
async function ka(a, t) {
  try {
    return (await a.callWS({
      type: "floorplan_ui/validate_config",
      config: Ma(t)
    })).config;
  } catch (e) {
    throw e && typeof e == "object" && "message" in e && typeof e.message == "string" ? e instanceof Error ? e : Object.assign(new Error(e.message), e) : e;
  }
}
async function oo(a) {
  return a.callWS({
    type: "floorplan_ui/list_registry"
  });
}
function lo(a) {
  var e;
  if (!a || typeof a != "object")
    return;
  const t = a;
  return typeof t.code == "string" ? t.code : typeof ((e = t.error) == null ? void 0 : e.code) == "string" ? t.error.code : void 0;
}
const Bn = 25e6, Mn = "model/gltf-binary", ho = 1179937895, co = 1313821514, Sr = 12, cn = 8, uo = /* @__PURE__ */ new Set([
  "EXT_materials_bump",
  "EXT_mesh_gpu_instancing",
  "EXT_texture_webp",
  "KHR_lights_punctual",
  "KHR_materials_anisotropy",
  "KHR_materials_clearcoat",
  "KHR_materials_diffuse_roughness",
  "KHR_materials_dispersion",
  "KHR_materials_emissive_strength",
  "KHR_materials_ior",
  "KHR_materials_iridescence",
  "KHR_materials_sheen",
  "KHR_materials_specular",
  "KHR_materials_transmission",
  "KHR_materials_unlit",
  "KHR_materials_volume",
  "KHR_mesh_quantization",
  "KHR_texture_transform"
]);
function go(a) {
  return /\.(glb)$/i.test(a);
}
function un(a) {
  return typeof a == "object" && a !== null && !Array.isArray(a);
}
function fo(a) {
  const { byteLength: t } = a;
  if (t < 28) return { valid: !1, reason: "The GLB file is too short." };
  if (t > Bn)
    return { valid: !1, reason: "The GLB file exceeds 25 MB." };
  const e = new DataView(a);
  if (e.getUint32(0, !0) !== ho)
    return { valid: !1, reason: "The GLB signature is missing." };
  if (e.getUint32(4, !0) !== 2)
    return { valid: !1, reason: "Only GLB version 2 is supported." };
  if (e.getUint32(8, !0) !== t)
    return { valid: !1, reason: "The GLB length does not match its header." };
  if (e.getUint32(16, !0) !== co)
    return { valid: !1, reason: "The first GLB chunk must contain JSON." };
  for (let r = Sr; r < t; ) {
    if (r + cn > t)
      return { valid: !1, reason: "A GLB chunk header is truncated." };
    const s = e.getUint32(r, !0);
    if (r += cn + s, r > t || s % 4 !== 0)
      return { valid: !1, reason: "A GLB chunk is truncated or misaligned." };
  }
  let i;
  try {
    const r = new Uint8Array(
      a,
      Sr + cn,
      e.getUint32(12, !0)
    );
    i = JSON.parse(new TextDecoder("utf-8", { fatal: !0 }).decode(r));
  } catch {
    return { valid: !1, reason: "The GLB JSON chunk is invalid." };
  }
  if (!un(i) || !un(i.asset) || typeof i.asset.version != "string" || !i.asset.version.startsWith("2."))
    return { valid: !1, reason: "The GLB must contain a glTF 2.x asset." };
  for (const r of ["buffers", "images"]) {
    const s = i[r];
    if (s !== void 0) {
      if (!Array.isArray(s) || s.some((o) => !un(o)))
        return { valid: !1, reason: `The GLB ${r} list is invalid.` };
      if (r === "buffers" && s.some((o) => "uri" in o))
        return { valid: !1, reason: "GLB buffers must use the BIN chunk without a URI." };
      if (r === "images" && s.some(
        ({ uri: o }) => o !== void 0 && (typeof o != "string" || !/^data:/i.test(o))
      ))
        return { valid: !1, reason: "The GLB must embed its images." };
    }
  }
  const n = i.extensionsRequired;
  if (n !== void 0) {
    if (!Array.isArray(n) || !n.every((s) => typeof s == "string"))
      return { valid: !1, reason: "GLB extensionsRequired must be a list of strings." };
    const r = n.filter((s) => !uo.has(s));
    if (r.length)
      return {
        valid: !1,
        reason: `GLB requires unsupported extension(s): ${r.join(", ")}`
      };
  }
  return { valid: !0 };
}
const Pa = 4e6, Ea = 128e6, kn = ["image/png", "image/jpeg", "image/svg+xml"], Un = "/api/floorplan_ui/assets";
function La(a) {
  return structuredClone(a);
}
function po(a) {
  return new Promise((t, e) => {
    const i = new FileReader();
    i.onload = () => t(String(i.result)), i.onerror = () => e(i.error ?? new Error("The image could not be read.")), i.readAsDataURL(a);
  });
}
async function mo(a) {
  const t = await fetch(a);
  if (!t.ok) throw new Error("An embedded image could not be decoded.");
  const e = await t.blob(), [i] = e.type.split(";", 1);
  return e.type === i ? e : e.slice(0, e.size, i);
}
function Va(a) {
  return !a.type && "name" in a && typeof a.name == "string" && /\.svg$/i.test(a.name) ? "image/svg+xml" : a.type;
}
async function Ta(a, t) {
  const e = Va(t), i = kn.find((n) => n === e);
  if (!i)
    throw new Error("Only PNG, JPEG and SVG floorplans are supported.");
  if (t.size > Pa)
    throw new Error("The floorplan image must not exceed 4 MB.");
  return $a(a, t, i, kn);
}
async function _o(a, t) {
  if (t.size > Bn)
    throw new Error("The GLB file exceeds 25 MB.");
  const e = fo(await t.arrayBuffer());
  if (!e.valid) throw new Error(e.reason);
  return $a(a, t, Mn, [Mn]);
}
async function $a(a, t, e, i) {
  const n = e === Mn ? "Model upload failed." : "Image upload failed.", r = n + " The server returned an invalid response.", s = await a.fetchWithAuth(Un, {
    method: "POST",
    headers: { "Content-Type": e },
    body: t
  });
  let o;
  try {
    o = await s.json();
  } catch {
    throw new Error(r);
  }
  if (!o || typeof o != "object" || Array.isArray(o))
    throw new Error(r);
  if (!s.ok)
    throw new Error(
      "error" in o && typeof o.error == "string" && o.error ? o.error : n
    );
  const l = "content_type" in o ? o.content_type : void 0, d = i.find((c) => c === l);
  if (!("asset_id" in o) || typeof o.asset_id != "string" || !/^[0-9a-f]{64}$/.test(o.asset_id) || !d || !("url" in o) || typeof o.url != "string" || !o.url.trim())
    throw new Error(r);
  return { asset_id: o.asset_id, content_type: d, url: o.url };
}
async function Ha(a, t) {
  const e = t.asset_id ? await a.fetchWithAuth(`${Un}/${encodeURIComponent(t.asset_id)}`) : await fetch(t.url ?? "");
  if (!e.ok) throw new Error("The floorplan image could not be loaded.");
  return e.blob();
}
async function yo(a, t) {
  const e = t.asset_id ? await a.fetchWithAuth(`${Un}/${encodeURIComponent(t.asset_id)}`) : t.url ? await fetch(t.url) : void 0;
  if (!(e != null && e.ok)) throw new Error("The floorplan model could not be loaded.");
  return e.arrayBuffer();
}
function xr(a) {
  const t = a == null ? void 0 : a.trim().match(/^([+-]?(?:\d*\.\d+|\d+\.?\d*)(?:e[+-]?\d+)?)(?:px)?$/i);
  return t ? Number(t[1]) : NaN;
}
const bo = 5e4, vo = 4e3;
function Mr(a, t) {
  const e = Math.max(a, t);
  if (e <= bo) return { width: a, height: t };
  const i = vo / e;
  return {
    width: Math.max(1e-4, Number((a * i).toFixed(4))),
    height: Math.max(1e-4, Number((t * i).toFixed(4)))
  };
}
async function Co(a) {
  var e;
  if (Va(a) !== "image/svg+xml") {
    const i = await createImageBitmap(a);
    try {
      return { width: i.width, height: i.height };
    } finally {
      i.close();
    }
  }
  const t = new DOMParser().parseFromString(await a.text(), "image/svg+xml").documentElement;
  if (t.localName === "svg") {
    const i = xr(t.getAttribute("width")), n = xr(t.getAttribute("height"));
    if (Number.isFinite(i) && Number.isFinite(n) && i > 0 && n > 0)
      return Mr(i, n);
    const r = (e = t.getAttribute("viewBox")) == null ? void 0 : e.trim().split(/[\s,]+/).map(Number);
    if ((r == null ? void 0 : r.length) === 4 && r.every(Number.isFinite) && r[2] > 0 && r[3] > 0)
      return Mr(r[2], r[3]);
  }
  return { width: 1e3, height: 800 };
}
async function wo(a, t) {
  const e = La(t), i = /* @__PURE__ */ new Map();
  for (const n of e.plans) {
    const r = n.background;
    if (r.type === "model") {
      delete r.url;
      continue;
    }
    if (!r.asset_id)
      continue;
    let s = i.get(r.asset_id);
    s || (s = await po(await Ha(a, r)), i.set(r.asset_id, s)), r.url = s, delete r.asset_id, delete r.content_type;
  }
  return e;
}
async function Ao(a, t) {
  const e = La(t), i = /* @__PURE__ */ new Map();
  for (const s of Array.isArray(e.plans) ? e.plans : []) {
    const o = s == null ? void 0 : s.background;
    (o == null ? void 0 : o.type) !== "model" && typeof (o == null ? void 0 : o.url) == "string" && o.url.startsWith("data:") && (i.set(s.plan_id, o.url), delete o.url, delete o.asset_id, delete o.content_type);
  }
  const n = await ka(a, e), r = /* @__PURE__ */ new Map();
  for (const s of n.plans) {
    const o = s.background, l = i.get(s.plan_id);
    if (o.type !== "image" || !l)
      continue;
    let d = r.get(l);
    d || (d = await Ta(a, await mo(l)), r.set(l, d)), s.background = {
      type: "image",
      asset_id: d.asset_id,
      content_type: d.content_type,
      url: d.url,
      width: o.width,
      height: o.height
    };
  }
  return n;
}
class So {
  constructor(t, e) {
    this._save = t, this._callbacks = e, this._revision = 0, this._pending = null, this._failed = null, this._running = !1, this._generation = 0;
  }
  reset(t) {
    var e;
    this._generation += 1;
    for (const i of ((e = this._pending) == null ? void 0 : e.waiters) ?? [])
      i(!1);
    this._revision = t, this._pending = null, this._failed = null, this._callbacks.onStatus({ state: "idle", dirty: !1 });
  }
  enqueue(t) {
    const e = structuredClone(t);
    this._failed = null;
    const i = new Promise((n) => {
      this._pending ? (this._pending.config = e, this._pending.waiters.push(n)) : this._pending = { config: e, waiters: [n] };
    });
    return this._callbacks.onStatus({ state: "pending", dirty: !0 }), this._drain(), i;
  }
  retry() {
    return this._failed ? this.enqueue(this._failed) : Promise.resolve(!0);
  }
  async _drain() {
    if (!this._running) {
      this._running = !0;
      try {
        for (; this._pending; ) {
          const t = this._generation, e = this._pending;
          this._pending = null, this._callbacks.onStatus({ state: "saving", dirty: !0 });
          try {
            const i = await this._save(e.config, this._revision);
            if (t !== this._generation) {
              for (const n of e.waiters) n(!1);
              continue;
            }
            this._revision = i, this._callbacks.onSaved(this._revision);
            for (const n of e.waiters)
              n(!0);
          } catch (i) {
            if (t !== this._generation) {
              for (const s of e.waiters) s(!1);
              continue;
            }
            const n = this._pending;
            this._failed = (n == null ? void 0 : n.config) ?? e.config;
            const r = (n == null ? void 0 : n.waiters) ?? [];
            this._pending = null;
            for (const s of [...e.waiters, ...r])
              s(!1);
            this._callbacks.onStatus({ state: "failed", dirty: !0, error: i });
            return;
          }
        }
        this._callbacks.onStatus({ state: "idle", dirty: !1 });
      } finally {
        this._running = !1;
      }
    }
  }
}
class xo {
  constructor(t = 50) {
    this._limit = t, this._undo = [], this._redo = [];
  }
  get canUndo() {
    return this._undo.length > 0;
  }
  get canRedo() {
    return this._redo.length > 0;
  }
  reset() {
    this._undo = [], this._redo = [];
  }
  record(t) {
    this._undo = [...this._undo.slice(-(this._limit - 1)), structuredClone(t)], this._redo = [];
  }
  undo(t) {
    const e = this._undo.at(-1);
    return e ? (this._undo = this._undo.slice(0, -1), this._redo = [...this._redo.slice(-(this._limit - 1)), structuredClone(t)], structuredClone(e)) : null;
  }
  redo(t) {
    const e = this._redo.at(-1);
    return e ? (this._redo = this._redo.slice(0, -1), this._undo = [...this._undo.slice(-(this._limit - 1)), structuredClone(t)], structuredClone(e)) : null;
  }
}
function Mo(a, t, e) {
  return {
    ...a,
    plans: a.plans.map(
      (i) => i.plan_id === t ? { ...i, markers: [...i.markers, e] } : i
    )
  };
}
function Ra(a, t, e, i) {
  return {
    ...a,
    plans: a.plans.map(
      (n) => n.plan_id === t ? {
        ...n,
        markers: n.markers.map(
          (r) => r.id === e ? { ...r, ...i } : r
        )
      } : n
    )
  };
}
function ko(a, t, e) {
  return {
    ...a,
    plans: a.plans.map(
      (i) => i.plan_id === t ? {
        ...i,
        markers: i.markers.filter((n) => n.id !== e)
      } : i
    )
  };
}
function ni(a) {
  return (a == null ? void 0 : a.background.type) === "model";
}
function Oa(a) {
  const t = { minZoom: 0.1, maxZoom: 5 };
  return a === "model" ? { ...t, shadows: !1, lighting: !0, camera_mode: "ortho" } : t;
}
function Po(a, t, e) {
  return {
    plan_id: a,
    name: t.replace(/\.[^.]+$/, ""),
    background: e,
    areas: [],
    markers: [],
    view: Oa(e.type)
  };
}
function Eo(a, t) {
  return {
    ...a,
    plans: [...a.plans, t]
  };
}
function Lo(a, t, e) {
  return {
    ...a,
    plans: a.plans.map((i) => i.plan_id === t ? { ...i, name: e } : i)
  };
}
function Vo(a, t, e) {
  return fi(a, t.plan_id, () => {
    const i = { ...t, background: e };
    if (e.type !== t.background.type) {
      const { minZoom: n, maxZoom: r } = t.view;
      return {
        ...i,
        view: { ...Oa(e.type), minZoom: n, maxZoom: r },
        markers: [],
        areas: []
      };
    }
    if (e.type === "image" && t.background.type === "image") {
      const n = e.width / t.background.width, r = e.height / t.background.height;
      return To(i, n, r);
    }
    return i;
  });
}
function To(a, t, e) {
  const i = a.markers.map((r) => ({
    ...r,
    pos: { ...r.pos, x: r.pos.x * t, y: r.pos.y * e }
  })), n = a.areas.map((r) => {
    const { shape: s } = r;
    switch (s.type) {
      case "rect":
        return {
          ...r,
          shape: {
            ...s,
            x: s.x * t,
            y: s.y * e,
            width: s.width * t,
            height: s.height * e
          }
        };
      case "polygon":
        return {
          ...r,
          shape: {
            ...s,
            x: (s.x ?? 0) * t,
            y: (s.y ?? 0) * e,
            points: s.points.map((o, l) => o * (l % 2 ? e : t))
          }
        };
      default:
        return r;
    }
  });
  return { ...a, markers: i, areas: n };
}
function fi(a, t, e) {
  const i = a.plans.findIndex((o) => o.plan_id === t);
  if (i === -1) return a;
  const n = a.plans[i], r = e(n);
  if (r === n) return a;
  const s = [...a.plans];
  return s[i] = r, { ...a, plans: s };
}
function $o(a, t, e) {
  return fi(a, t, (i) => ({ ...i, view: { ...i.view, ...e } }));
}
function Ho(a, t, e) {
  return fi(a, t, (i) => {
    const n = i.view.camera_presets ?? [];
    return n.length >= 20 || n.some(({ id: r }) => r === e.id) ? i : { ...i, view: { ...i.view, camera_presets: [...n, e] } };
  });
}
function Ro(a, t, e) {
  return fi(a, t, (i) => {
    const n = i.view.camera_presets ?? [], r = n.filter(({ id: s }) => s !== e);
    return r.length === n.length ? i : { ...i, view: { ...i.view, camera_presets: r } };
  });
}
function Oo(a, t) {
  var i;
  const e = a.plans.filter((n) => n.plan_id !== t);
  return e.length === a.plans.length ? null : {
    config: { ...a, plans: e },
    nextPlanId: ((i = e[0]) == null ? void 0 : i.plan_id) ?? null
  };
}
function Fo(a, t, e) {
  return zn(
    a,
    t === "polygon" ? {
      type: "polygon",
      x: e.x,
      y: e.y,
      points: [-120, -70, 100, -90, 140, 60, -80, 90]
    } : {
      type: "rect",
      x: e.x - 120,
      y: e.y - 80,
      width: 240,
      height: 160
    }
  );
}
function Do(a, t, e) {
  return zn(a, {
    type: "mesh",
    mesh_name: t,
    ...e && { anchor: { ...e } }
  });
}
function gn(a, t) {
  return zn(a, { ...t, type: "anchor3d" });
}
function zn(a, t) {
  return {
    id: a,
    area_id: "",
    shape: t,
    tags: [],
    style: {
      fillOpacity: 0.4,
      strokeWidth: 2,
      fill: "#2196f3",
      stroke: "#2196f3"
    }
  };
}
function No(a, t, e) {
  return {
    ...a,
    plans: a.plans.map(
      (i) => i.plan_id === t ? { ...i, areas: [...i.areas, e] } : i
    )
  };
}
function Fa(a, t, e, i) {
  return {
    ...a,
    plans: a.plans.map(
      (n) => n.plan_id === t ? {
        ...n,
        areas: n.areas.map((r) => r.id === e ? i(r) : r)
      } : n
    )
  };
}
function Io(a, t, e, i) {
  return Fa(a, t, e, (n) => {
    if ("type" in i)
      return n.shape.type !== "mesh" && n.shape.type !== "anchor3d" ? n : { ...n, shape: i };
    if (n.shape.type === "rect") {
      const { x: l, y: d, width: c, height: p } = i;
      return {
        ...n,
        shape: {
          ...n.shape,
          ...l === void 0 ? {} : { x: l },
          ...d === void 0 ? {} : { y: d },
          ...c === void 0 ? {} : { width: c },
          ...p === void 0 ? {} : { height: p }
        }
      };
    }
    if (n.shape.type !== "polygon") return n;
    const { x: r, y: s, points: o } = i;
    return {
      ...n,
      shape: {
        ...n.shape,
        ...r === void 0 ? {} : { x: r },
        ...s === void 0 ? {} : { y: s },
        ...o && o.length >= 6 ? { points: o } : {}
      }
    };
  });
}
function Go(a, t, e) {
  return {
    ...a,
    plans: a.plans.map(
      (i) => i.plan_id === t ? { ...i, areas: i.areas.filter((n) => n.id !== e) } : i
    )
  };
}
var kr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Bo(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var jn = { exports: {} }, pi = {}, Da = {}, B = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a._registerNode = a.Konva = a.glob = void 0;
  const t = Math.PI / 180;
  function e() {
    return typeof window < "u" && ({}.toString.call(window) === "[object Window]" || {}.toString.call(window) === "[object global]");
  }
  a.glob = typeof kr < "u" ? kr : typeof window < "u" ? window : typeof WorkerGlobalScope < "u" ? self : {}, a.Konva = {
    _global: a.glob,
    version: "9.3.22",
    isBrowser: e(),
    isUnminified: /param/.test((function(n) {
    }).toString()),
    dblClickWindow: 400,
    getAngle(n) {
      return a.Konva.angleDeg ? n * t : n;
    },
    enableTrace: !1,
    pointerEventsEnabled: !0,
    autoDrawEnabled: !0,
    hitOnDragEnabled: !1,
    capturePointerEventsEnabled: !1,
    _mouseListenClick: !1,
    _touchListenClick: !1,
    _pointerListenClick: !1,
    _mouseInDblClickWindow: !1,
    _touchInDblClickWindow: !1,
    _pointerInDblClickWindow: !1,
    _mouseDblClickPointerId: null,
    _touchDblClickPointerId: null,
    _pointerDblClickPointerId: null,
    _fixTextRendering: !1,
    pixelRatio: typeof window < "u" && window.devicePixelRatio || 1,
    dragDistance: 3,
    angleDeg: !0,
    showWarnings: !0,
    dragButtons: [0, 1],
    isDragging() {
      return a.Konva.DD.isDragging;
    },
    isTransforming() {
      var n;
      return (n = a.Konva.Transformer) === null || n === void 0 ? void 0 : n.isTransforming();
    },
    isDragReady() {
      return !!a.Konva.DD.node;
    },
    releaseCanvasOnDestroy: !0,
    document: a.glob.document,
    _injectGlobal(n) {
      a.glob.Konva = n;
    }
  };
  const i = (n) => {
    a.Konva[n.prototype.getClassName()] = n;
  };
  a._registerNode = i, a.Konva._injectGlobal(a.Konva);
})(B);
var ot = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Util = a.Transform = void 0;
  const t = B;
  class e {
    constructor(m = [1, 0, 0, 1, 0, 0]) {
      this.dirty = !1, this.m = m && m.slice() || [1, 0, 0, 1, 0, 0];
    }
    reset() {
      this.m[0] = 1, this.m[1] = 0, this.m[2] = 0, this.m[3] = 1, this.m[4] = 0, this.m[5] = 0;
    }
    copy() {
      return new e(this.m);
    }
    copyInto(m) {
      m.m[0] = this.m[0], m.m[1] = this.m[1], m.m[2] = this.m[2], m.m[3] = this.m[3], m.m[4] = this.m[4], m.m[5] = this.m[5];
    }
    point(m) {
      const b = this.m;
      return {
        x: b[0] * m.x + b[2] * m.y + b[4],
        y: b[1] * m.x + b[3] * m.y + b[5]
      };
    }
    translate(m, b) {
      return this.m[4] += this.m[0] * m + this.m[2] * b, this.m[5] += this.m[1] * m + this.m[3] * b, this;
    }
    scale(m, b) {
      return this.m[0] *= m, this.m[1] *= m, this.m[2] *= b, this.m[3] *= b, this;
    }
    rotate(m) {
      const b = Math.cos(m), A = Math.sin(m), M = this.m[0] * b + this.m[2] * A, C = this.m[1] * b + this.m[3] * A, k = this.m[0] * -A + this.m[2] * b, x = this.m[1] * -A + this.m[3] * b;
      return this.m[0] = M, this.m[1] = C, this.m[2] = k, this.m[3] = x, this;
    }
    getTranslation() {
      return {
        x: this.m[4],
        y: this.m[5]
      };
    }
    skew(m, b) {
      const A = this.m[0] + this.m[2] * b, M = this.m[1] + this.m[3] * b, C = this.m[2] + this.m[0] * m, k = this.m[3] + this.m[1] * m;
      return this.m[0] = A, this.m[1] = M, this.m[2] = C, this.m[3] = k, this;
    }
    multiply(m) {
      const b = this.m[0] * m.m[0] + this.m[2] * m.m[1], A = this.m[1] * m.m[0] + this.m[3] * m.m[1], M = this.m[0] * m.m[2] + this.m[2] * m.m[3], C = this.m[1] * m.m[2] + this.m[3] * m.m[3], k = this.m[0] * m.m[4] + this.m[2] * m.m[5] + this.m[4], x = this.m[1] * m.m[4] + this.m[3] * m.m[5] + this.m[5];
      return this.m[0] = b, this.m[1] = A, this.m[2] = M, this.m[3] = C, this.m[4] = k, this.m[5] = x, this;
    }
    invert() {
      const m = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]), b = this.m[3] * m, A = -this.m[1] * m, M = -this.m[2] * m, C = this.m[0] * m, k = m * (this.m[2] * this.m[5] - this.m[3] * this.m[4]), x = m * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
      return this.m[0] = b, this.m[1] = A, this.m[2] = M, this.m[3] = C, this.m[4] = k, this.m[5] = x, this;
    }
    getMatrix() {
      return this.m;
    }
    decompose() {
      const m = this.m[0], b = this.m[1], A = this.m[2], M = this.m[3], C = this.m[4], k = this.m[5], x = m * M - b * A, P = {
        x: C,
        y: k,
        rotation: 0,
        scaleX: 0,
        scaleY: 0,
        skewX: 0,
        skewY: 0
      };
      if (m != 0 || b != 0) {
        const E = Math.sqrt(m * m + b * b);
        P.rotation = b > 0 ? Math.acos(m / E) : -Math.acos(m / E), P.scaleX = E, P.scaleY = x / E, P.skewX = (m * A + b * M) / x, P.skewY = 0;
      } else if (A != 0 || M != 0) {
        const E = Math.sqrt(A * A + M * M);
        P.rotation = Math.PI / 2 - (M > 0 ? Math.acos(-A / E) : -Math.acos(A / E)), P.scaleX = x / E, P.scaleY = E, P.skewX = 0, P.skewY = (m * A + b * M) / x;
      }
      return P.rotation = a.Util._getRotation(P.rotation), P;
    }
  }
  a.Transform = e;
  const i = "[object Array]", n = "[object Number]", r = "[object String]", s = "[object Boolean]", o = Math.PI / 180, l = 180 / Math.PI, d = "#", c = "", p = "0", f = "Konva warning: ", g = "Konva error: ", u = "rgb(", _ = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 132, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 255, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 203],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [119, 128, 144],
    slategrey: [119, 128, 144],
    snow: [255, 255, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    transparent: [255, 255, 255, 0],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 5]
  }, y = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
  let v = [];
  const w = typeof requestAnimationFrame < "u" && requestAnimationFrame || function(h) {
    setTimeout(h, 60);
  };
  a.Util = {
    _isElement(h) {
      return !!(h && h.nodeType == 1);
    },
    _isFunction(h) {
      return !!(h && h.constructor && h.call && h.apply);
    },
    _isPlainObject(h) {
      return !!h && h.constructor === Object;
    },
    _isArray(h) {
      return Object.prototype.toString.call(h) === i;
    },
    _isNumber(h) {
      return Object.prototype.toString.call(h) === n && !isNaN(h) && isFinite(h);
    },
    _isString(h) {
      return Object.prototype.toString.call(h) === r;
    },
    _isBoolean(h) {
      return Object.prototype.toString.call(h) === s;
    },
    isObject(h) {
      return h instanceof Object;
    },
    isValidSelector(h) {
      if (typeof h != "string")
        return !1;
      const m = h[0];
      return m === "#" || m === "." || m === m.toUpperCase();
    },
    _sign(h) {
      return h === 0 || h > 0 ? 1 : -1;
    },
    requestAnimFrame(h) {
      v.push(h), v.length === 1 && w(function() {
        const m = v;
        v = [], m.forEach(function(b) {
          b();
        });
      });
    },
    createCanvasElement() {
      const h = document.createElement("canvas");
      try {
        h.style = h.style || {};
      } catch {
      }
      return h;
    },
    createImageElement() {
      return document.createElement("img");
    },
    _isInDocument(h) {
      for (; h = h.parentNode; )
        if (h == document)
          return !0;
      return !1;
    },
    _urlToImage(h, m) {
      const b = a.Util.createImageElement();
      b.onload = function() {
        m(b);
      }, b.src = h;
    },
    _rgbToHex(h, m, b) {
      return ((1 << 24) + (h << 16) + (m << 8) + b).toString(16).slice(1);
    },
    _hexToRgb(h) {
      h = h.replace(d, c);
      const m = parseInt(h, 16);
      return {
        r: m >> 16 & 255,
        g: m >> 8 & 255,
        b: m & 255
      };
    },
    getRandomColor() {
      let h = (Math.random() * 16777215 << 0).toString(16);
      for (; h.length < 6; )
        h = p + h;
      return d + h;
    },
    getRGB(h) {
      let m;
      return h in _ ? (m = _[h], {
        r: m[0],
        g: m[1],
        b: m[2]
      }) : h[0] === d ? this._hexToRgb(h.substring(1)) : h.substr(0, 4) === u ? (m = y.exec(h.replace(/ /g, "")), {
        r: parseInt(m[1], 10),
        g: parseInt(m[2], 10),
        b: parseInt(m[3], 10)
      }) : {
        r: 0,
        g: 0,
        b: 0
      };
    },
    colorToRGBA(h) {
      return h = h || "black", a.Util._namedColorToRBA(h) || a.Util._hex3ColorToRGBA(h) || a.Util._hex4ColorToRGBA(h) || a.Util._hex6ColorToRGBA(h) || a.Util._hex8ColorToRGBA(h) || a.Util._rgbColorToRGBA(h) || a.Util._rgbaColorToRGBA(h) || a.Util._hslColorToRGBA(h);
    },
    _namedColorToRBA(h) {
      const m = _[h.toLowerCase()];
      return m ? {
        r: m[0],
        g: m[1],
        b: m[2],
        a: 1
      } : null;
    },
    _rgbColorToRGBA(h) {
      if (h.indexOf("rgb(") === 0) {
        h = h.match(/rgb\(([^)]+)\)/)[1];
        const m = h.split(/ *, */).map(Number);
        return {
          r: m[0],
          g: m[1],
          b: m[2],
          a: 1
        };
      }
    },
    _rgbaColorToRGBA(h) {
      if (h.indexOf("rgba(") === 0) {
        h = h.match(/rgba\(([^)]+)\)/)[1];
        const m = h.split(/ *, */).map((b, A) => b.slice(-1) === "%" ? A === 3 ? parseInt(b) / 100 : parseInt(b) / 100 * 255 : Number(b));
        return {
          r: m[0],
          g: m[1],
          b: m[2],
          a: m[3]
        };
      }
    },
    _hex8ColorToRGBA(h) {
      if (h[0] === "#" && h.length === 9)
        return {
          r: parseInt(h.slice(1, 3), 16),
          g: parseInt(h.slice(3, 5), 16),
          b: parseInt(h.slice(5, 7), 16),
          a: parseInt(h.slice(7, 9), 16) / 255
        };
    },
    _hex6ColorToRGBA(h) {
      if (h[0] === "#" && h.length === 7)
        return {
          r: parseInt(h.slice(1, 3), 16),
          g: parseInt(h.slice(3, 5), 16),
          b: parseInt(h.slice(5, 7), 16),
          a: 1
        };
    },
    _hex4ColorToRGBA(h) {
      if (h[0] === "#" && h.length === 5)
        return {
          r: parseInt(h[1] + h[1], 16),
          g: parseInt(h[2] + h[2], 16),
          b: parseInt(h[3] + h[3], 16),
          a: parseInt(h[4] + h[4], 16) / 255
        };
    },
    _hex3ColorToRGBA(h) {
      if (h[0] === "#" && h.length === 4)
        return {
          r: parseInt(h[1] + h[1], 16),
          g: parseInt(h[2] + h[2], 16),
          b: parseInt(h[3] + h[3], 16),
          a: 1
        };
    },
    _hslColorToRGBA(h) {
      if (/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(h)) {
        const [m, ...b] = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(h), A = Number(b[0]) / 360, M = Number(b[1]) / 100, C = Number(b[2]) / 100;
        let k, x, P;
        if (M === 0)
          return P = C * 255, {
            r: Math.round(P),
            g: Math.round(P),
            b: Math.round(P),
            a: 1
          };
        C < 0.5 ? k = C * (1 + M) : k = C + M - C * M;
        const E = 2 * C - k, T = [0, 0, 0];
        for (let O = 0; O < 3; O++)
          x = A + 1 / 3 * -(O - 1), x < 0 && x++, x > 1 && x--, 6 * x < 1 ? P = E + (k - E) * 6 * x : 2 * x < 1 ? P = k : 3 * x < 2 ? P = E + (k - E) * (2 / 3 - x) * 6 : P = E, T[O] = P * 255;
        return {
          r: Math.round(T[0]),
          g: Math.round(T[1]),
          b: Math.round(T[2]),
          a: 1
        };
      }
    },
    haveIntersection(h, m) {
      return !(m.x > h.x + h.width || m.x + m.width < h.x || m.y > h.y + h.height || m.y + m.height < h.y);
    },
    cloneObject(h) {
      const m = {};
      for (const b in h)
        this._isPlainObject(h[b]) ? m[b] = this.cloneObject(h[b]) : this._isArray(h[b]) ? m[b] = this.cloneArray(h[b]) : m[b] = h[b];
      return m;
    },
    cloneArray(h) {
      return h.slice(0);
    },
    degToRad(h) {
      return h * o;
    },
    radToDeg(h) {
      return h * l;
    },
    _degToRad(h) {
      return a.Util.warn("Util._degToRad is removed. Please use public Util.degToRad instead."), a.Util.degToRad(h);
    },
    _radToDeg(h) {
      return a.Util.warn("Util._radToDeg is removed. Please use public Util.radToDeg instead."), a.Util.radToDeg(h);
    },
    _getRotation(h) {
      return t.Konva.angleDeg ? a.Util.radToDeg(h) : h;
    },
    _capitalize(h) {
      return h.charAt(0).toUpperCase() + h.slice(1);
    },
    throw(h) {
      throw new Error(g + h);
    },
    error(h) {
    },
    warn(h) {
      t.Konva.showWarnings;
    },
    each(h, m) {
      for (const b in h)
        m(b, h[b]);
    },
    _inRange(h, m, b) {
      return m <= h && h < b;
    },
    _getProjectionToSegment(h, m, b, A, M, C) {
      let k, x, P;
      const E = (h - b) * (h - b) + (m - A) * (m - A);
      if (E == 0)
        k = h, x = m, P = (M - b) * (M - b) + (C - A) * (C - A);
      else {
        const T = ((M - h) * (b - h) + (C - m) * (A - m)) / E;
        T < 0 ? (k = h, x = m, P = (h - M) * (h - M) + (m - C) * (m - C)) : T > 1 ? (k = b, x = A, P = (b - M) * (b - M) + (A - C) * (A - C)) : (k = h + T * (b - h), x = m + T * (A - m), P = (k - M) * (k - M) + (x - C) * (x - C));
      }
      return [k, x, P];
    },
    _getProjectionToLine(h, m, b) {
      const A = a.Util.cloneObject(h);
      let M = Number.MAX_VALUE;
      return m.forEach(function(C, k) {
        if (!b && k === m.length - 1)
          return;
        const x = m[(k + 1) % m.length], P = a.Util._getProjectionToSegment(C.x, C.y, x.x, x.y, h.x, h.y), E = P[0], T = P[1], O = P[2];
        O < M && (A.x = E, A.y = T, M = O);
      }), A;
    },
    _prepareArrayForTween(h, m, b) {
      const A = [], M = [];
      if (h.length > m.length) {
        const k = m;
        m = h, h = k;
      }
      for (let k = 0; k < h.length; k += 2)
        A.push({
          x: h[k],
          y: h[k + 1]
        });
      for (let k = 0; k < m.length; k += 2)
        M.push({
          x: m[k],
          y: m[k + 1]
        });
      const C = [];
      return M.forEach(function(k) {
        const x = a.Util._getProjectionToLine(k, A, b);
        C.push(x.x), C.push(x.y);
      }), C;
    },
    _prepareToStringify(h) {
      let m;
      h.visitedByCircularReferenceRemoval = !0;
      for (const b in h)
        if (h.hasOwnProperty(b) && h[b] && typeof h[b] == "object") {
          if (m = Object.getOwnPropertyDescriptor(h, b), h[b].visitedByCircularReferenceRemoval || a.Util._isElement(h[b]))
            if (m.configurable)
              delete h[b];
            else
              return null;
          else if (a.Util._prepareToStringify(h[b]) === null)
            if (m.configurable)
              delete h[b];
            else
              return null;
        }
      return delete h.visitedByCircularReferenceRemoval, h;
    },
    _assign(h, m) {
      for (const b in m)
        h[b] = m[b];
      return h;
    },
    _getFirstPointerId(h) {
      return h.touches ? h.changedTouches[0].identifier : h.pointerId || 999;
    },
    releaseCanvas(...h) {
      t.Konva.releaseCanvasOnDestroy && h.forEach((m) => {
        m.width = 0, m.height = 0;
      });
    },
    drawRoundedRectPath(h, m, b, A) {
      let M = 0, C = 0, k = 0, x = 0;
      typeof A == "number" ? M = C = k = x = Math.min(A, m / 2, b / 2) : (M = Math.min(A[0] || 0, m / 2, b / 2), C = Math.min(A[1] || 0, m / 2, b / 2), x = Math.min(A[2] || 0, m / 2, b / 2), k = Math.min(A[3] || 0, m / 2, b / 2)), h.moveTo(M, 0), h.lineTo(m - C, 0), h.arc(m - C, C, C, Math.PI * 3 / 2, 0, !1), h.lineTo(m, b - x), h.arc(m - x, b - x, x, 0, Math.PI / 2, !1), h.lineTo(k, b), h.arc(k, b - k, k, Math.PI / 2, Math.PI, !1), h.lineTo(0, M), h.arc(M, M, M, Math.PI, Math.PI * 3 / 2, !1);
    }
  };
})(ot);
var at = {}, wt = {}, Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.HitContext = Tt.SceneContext = Tt.Context = void 0;
const Na = ot, Uo = B;
function zo(a) {
  const t = [], e = a.length, i = Na.Util;
  for (let n = 0; n < e; n++) {
    let r = a[n];
    i._isNumber(r) ? r = Math.round(r * 1e3) / 1e3 : i._isString(r) || (r = r + ""), t.push(r);
  }
  return t;
}
const Pr = ",", jo = "(", Wo = ")", Ko = "([", Yo = "])", Xo = ";", Zo = "()", qo = "=", Er = [
  "arc",
  "arcTo",
  "beginPath",
  "bezierCurveTo",
  "clearRect",
  "clip",
  "closePath",
  "createLinearGradient",
  "createPattern",
  "createRadialGradient",
  "drawImage",
  "ellipse",
  "fill",
  "fillText",
  "getImageData",
  "createImageData",
  "lineTo",
  "moveTo",
  "putImageData",
  "quadraticCurveTo",
  "rect",
  "roundRect",
  "restore",
  "rotate",
  "save",
  "scale",
  "setLineDash",
  "setTransform",
  "stroke",
  "strokeText",
  "transform",
  "translate"
], Jo = [
  "fillStyle",
  "strokeStyle",
  "shadowColor",
  "shadowBlur",
  "shadowOffsetX",
  "shadowOffsetY",
  "letterSpacing",
  "lineCap",
  "lineDashOffset",
  "lineJoin",
  "lineWidth",
  "miterLimit",
  "direction",
  "font",
  "textAlign",
  "textBaseline",
  "globalAlpha",
  "globalCompositeOperation",
  "imageSmoothingEnabled"
], Qo = 100;
class mi {
  constructor(t) {
    this.canvas = t, Uo.Konva.enableTrace && (this.traceArr = [], this._enableTrace());
  }
  fillShape(t) {
    t.fillEnabled() && this._fill(t);
  }
  _fill(t) {
  }
  strokeShape(t) {
    t.hasStroke() && this._stroke(t);
  }
  _stroke(t) {
  }
  fillStrokeShape(t) {
    t.attrs.fillAfterStrokeEnabled ? (this.strokeShape(t), this.fillShape(t)) : (this.fillShape(t), this.strokeShape(t));
  }
  getTrace(t, e) {
    let i = this.traceArr, n = i.length, r = "", s, o, l, d;
    for (s = 0; s < n; s++)
      o = i[s], l = o.method, l ? (d = o.args, r += l, t ? r += Zo : Na.Util._isArray(d[0]) ? r += Ko + d.join(Pr) + Yo : (e && (d = d.map((c) => typeof c == "number" ? Math.floor(c) : c)), r += jo + d.join(Pr) + Wo)) : (r += o.property, t || (r += qo + o.val)), r += Xo;
    return r;
  }
  clearTrace() {
    this.traceArr = [];
  }
  _trace(t) {
    let e = this.traceArr, i;
    e.push(t), i = e.length, i >= Qo && e.shift();
  }
  reset() {
    const t = this.getCanvas().getPixelRatio();
    this.setTransform(1 * t, 0, 0, 1 * t, 0, 0);
  }
  getCanvas() {
    return this.canvas;
  }
  clear(t) {
    const e = this.getCanvas();
    t ? this.clearRect(t.x || 0, t.y || 0, t.width || 0, t.height || 0) : this.clearRect(0, 0, e.getWidth() / e.pixelRatio, e.getHeight() / e.pixelRatio);
  }
  _applyLineCap(t) {
    const e = t.attrs.lineCap;
    e && this.setAttr("lineCap", e);
  }
  _applyOpacity(t) {
    const e = t.getAbsoluteOpacity();
    e !== 1 && this.setAttr("globalAlpha", e);
  }
  _applyLineJoin(t) {
    const e = t.attrs.lineJoin;
    e && this.setAttr("lineJoin", e);
  }
  setAttr(t, e) {
    this._context[t] = e;
  }
  arc(t, e, i, n, r, s) {
    this._context.arc(t, e, i, n, r, s);
  }
  arcTo(t, e, i, n, r) {
    this._context.arcTo(t, e, i, n, r);
  }
  beginPath() {
    this._context.beginPath();
  }
  bezierCurveTo(t, e, i, n, r, s) {
    this._context.bezierCurveTo(t, e, i, n, r, s);
  }
  clearRect(t, e, i, n) {
    this._context.clearRect(t, e, i, n);
  }
  clip(...t) {
    this._context.clip.apply(this._context, t);
  }
  closePath() {
    this._context.closePath();
  }
  createImageData(t, e) {
    const i = arguments;
    if (i.length === 2)
      return this._context.createImageData(t, e);
    if (i.length === 1)
      return this._context.createImageData(t);
  }
  createLinearGradient(t, e, i, n) {
    return this._context.createLinearGradient(t, e, i, n);
  }
  createPattern(t, e) {
    return this._context.createPattern(t, e);
  }
  createRadialGradient(t, e, i, n, r, s) {
    return this._context.createRadialGradient(t, e, i, n, r, s);
  }
  drawImage(t, e, i, n, r, s, o, l, d) {
    const c = arguments, p = this._context;
    c.length === 3 ? p.drawImage(t, e, i) : c.length === 5 ? p.drawImage(t, e, i, n, r) : c.length === 9 && p.drawImage(t, e, i, n, r, s, o, l, d);
  }
  ellipse(t, e, i, n, r, s, o, l) {
    this._context.ellipse(t, e, i, n, r, s, o, l);
  }
  isPointInPath(t, e, i, n) {
    return i ? this._context.isPointInPath(i, t, e, n) : this._context.isPointInPath(t, e, n);
  }
  fill(...t) {
    this._context.fill.apply(this._context, t);
  }
  fillRect(t, e, i, n) {
    this._context.fillRect(t, e, i, n);
  }
  strokeRect(t, e, i, n) {
    this._context.strokeRect(t, e, i, n);
  }
  fillText(t, e, i, n) {
    n ? this._context.fillText(t, e, i, n) : this._context.fillText(t, e, i);
  }
  measureText(t) {
    return this._context.measureText(t);
  }
  getImageData(t, e, i, n) {
    return this._context.getImageData(t, e, i, n);
  }
  lineTo(t, e) {
    this._context.lineTo(t, e);
  }
  moveTo(t, e) {
    this._context.moveTo(t, e);
  }
  rect(t, e, i, n) {
    this._context.rect(t, e, i, n);
  }
  roundRect(t, e, i, n, r) {
    this._context.roundRect(t, e, i, n, r);
  }
  putImageData(t, e, i) {
    this._context.putImageData(t, e, i);
  }
  quadraticCurveTo(t, e, i, n) {
    this._context.quadraticCurveTo(t, e, i, n);
  }
  restore() {
    this._context.restore();
  }
  rotate(t) {
    this._context.rotate(t);
  }
  save() {
    this._context.save();
  }
  scale(t, e) {
    this._context.scale(t, e);
  }
  setLineDash(t) {
    this._context.setLineDash ? this._context.setLineDash(t) : "mozDash" in this._context ? this._context.mozDash = t : "webkitLineDash" in this._context && (this._context.webkitLineDash = t);
  }
  getLineDash() {
    return this._context.getLineDash();
  }
  setTransform(t, e, i, n, r, s) {
    this._context.setTransform(t, e, i, n, r, s);
  }
  stroke(t) {
    t ? this._context.stroke(t) : this._context.stroke();
  }
  strokeText(t, e, i, n) {
    this._context.strokeText(t, e, i, n);
  }
  transform(t, e, i, n, r, s) {
    this._context.transform(t, e, i, n, r, s);
  }
  translate(t, e) {
    this._context.translate(t, e);
  }
  _enableTrace() {
    let t = this, e = Er.length, i = this.setAttr, n, r;
    const s = function(o) {
      let l = t[o], d;
      t[o] = function() {
        return r = zo(Array.prototype.slice.call(arguments, 0)), d = l.apply(t, arguments), t._trace({
          method: o,
          args: r
        }), d;
      };
    };
    for (n = 0; n < e; n++)
      s(Er[n]);
    t.setAttr = function() {
      i.apply(t, arguments);
      const o = arguments[0];
      let l = arguments[1];
      (o === "shadowOffsetX" || o === "shadowOffsetY" || o === "shadowBlur") && (l = l / this.canvas.getPixelRatio()), t._trace({
        property: o,
        val: l
      });
    };
  }
  _applyGlobalCompositeOperation(t) {
    const e = t.attrs.globalCompositeOperation;
    !e || e === "source-over" || this.setAttr("globalCompositeOperation", e);
  }
}
Tt.Context = mi;
Jo.forEach(function(a) {
  Object.defineProperty(mi.prototype, a, {
    get() {
      return this._context[a];
    },
    set(t) {
      this._context[a] = t;
    }
  });
});
class tl extends mi {
  constructor(t, { willReadFrequently: e = !1 } = {}) {
    super(t), this._context = t._canvas.getContext("2d", {
      willReadFrequently: e
    });
  }
  _fillColor(t) {
    const e = t.fill();
    this.setAttr("fillStyle", e), t._fillFunc(this);
  }
  _fillPattern(t) {
    this.setAttr("fillStyle", t._getFillPattern()), t._fillFunc(this);
  }
  _fillLinearGradient(t) {
    const e = t._getLinearGradient();
    e && (this.setAttr("fillStyle", e), t._fillFunc(this));
  }
  _fillRadialGradient(t) {
    const e = t._getRadialGradient();
    e && (this.setAttr("fillStyle", e), t._fillFunc(this));
  }
  _fill(t) {
    const e = t.fill(), i = t.getFillPriority();
    if (e && i === "color") {
      this._fillColor(t);
      return;
    }
    const n = t.getFillPatternImage();
    if (n && i === "pattern") {
      this._fillPattern(t);
      return;
    }
    const r = t.getFillLinearGradientColorStops();
    if (r && i === "linear-gradient") {
      this._fillLinearGradient(t);
      return;
    }
    const s = t.getFillRadialGradientColorStops();
    if (s && i === "radial-gradient") {
      this._fillRadialGradient(t);
      return;
    }
    e ? this._fillColor(t) : n ? this._fillPattern(t) : r ? this._fillLinearGradient(t) : s && this._fillRadialGradient(t);
  }
  _strokeLinearGradient(t) {
    const e = t.getStrokeLinearGradientStartPoint(), i = t.getStrokeLinearGradientEndPoint(), n = t.getStrokeLinearGradientColorStops(), r = this.createLinearGradient(e.x, e.y, i.x, i.y);
    if (n) {
      for (let s = 0; s < n.length; s += 2)
        r.addColorStop(n[s], n[s + 1]);
      this.setAttr("strokeStyle", r);
    }
  }
  _stroke(t) {
    const e = t.dash(), i = t.getStrokeScaleEnabled();
    if (t.hasStroke()) {
      if (!i) {
        this.save();
        const r = this.getCanvas().getPixelRatio();
        this.setTransform(r, 0, 0, r, 0, 0);
      }
      this._applyLineCap(t), e && t.dashEnabled() && (this.setLineDash(e), this.setAttr("lineDashOffset", t.dashOffset())), this.setAttr("lineWidth", t.strokeWidth()), t.getShadowForStrokeEnabled() || this.setAttr("shadowColor", "rgba(0,0,0,0)"), t.getStrokeLinearGradientColorStops() ? this._strokeLinearGradient(t) : this.setAttr("strokeStyle", t.stroke()), t._strokeFunc(this), i || this.restore();
    }
  }
  _applyShadow(t) {
    var e, i, n;
    const r = (e = t.getShadowRGBA()) !== null && e !== void 0 ? e : "black", s = (i = t.getShadowBlur()) !== null && i !== void 0 ? i : 5, o = (n = t.getShadowOffset()) !== null && n !== void 0 ? n : {
      x: 0,
      y: 0
    }, l = t.getAbsoluteScale(), d = this.canvas.getPixelRatio(), c = l.x * d, p = l.y * d;
    this.setAttr("shadowColor", r), this.setAttr("shadowBlur", s * Math.min(Math.abs(c), Math.abs(p))), this.setAttr("shadowOffsetX", o.x * c), this.setAttr("shadowOffsetY", o.y * p);
  }
}
Tt.SceneContext = tl;
class el extends mi {
  constructor(t) {
    super(t), this._context = t._canvas.getContext("2d", {
      willReadFrequently: !0
    });
  }
  _fill(t) {
    this.save(), this.setAttr("fillStyle", t.colorKey), t._fillFuncHit(this), this.restore();
  }
  strokeShape(t) {
    t.hasHitStroke() && this._stroke(t);
  }
  _stroke(t) {
    if (t.hasHitStroke()) {
      const e = t.getStrokeScaleEnabled();
      if (!e) {
        this.save();
        const r = this.getCanvas().getPixelRatio();
        this.setTransform(r, 0, 0, r, 0, 0);
      }
      this._applyLineCap(t);
      const i = t.hitStrokeWidth(), n = i === "auto" ? t.strokeWidth() : i;
      this.setAttr("lineWidth", n), this.setAttr("strokeStyle", t.colorKey), t._strokeFuncHit(this), e || this.restore();
    }
  }
}
Tt.HitContext = el;
Object.defineProperty(wt, "__esModule", { value: !0 });
wt.HitCanvas = wt.SceneCanvas = wt.Canvas = void 0;
const di = ot, Ia = Tt, Ga = B;
let qe;
function il() {
  if (qe)
    return qe;
  const a = di.Util.createCanvasElement(), t = a.getContext("2d");
  return qe = function() {
    const e = Ga.Konva._global.devicePixelRatio || 1, i = t.webkitBackingStorePixelRatio || t.mozBackingStorePixelRatio || t.msBackingStorePixelRatio || t.oBackingStorePixelRatio || t.backingStorePixelRatio || 1;
    return e / i;
  }(), di.Util.releaseCanvas(a), qe;
}
class Wn {
  constructor(t) {
    this.pixelRatio = 1, this.width = 0, this.height = 0, this.isCache = !1;
    const i = (t || {}).pixelRatio || Ga.Konva.pixelRatio || il();
    this.pixelRatio = i, this._canvas = di.Util.createCanvasElement(), this._canvas.style.padding = "0", this._canvas.style.margin = "0", this._canvas.style.border = "0", this._canvas.style.background = "transparent", this._canvas.style.position = "absolute", this._canvas.style.top = "0", this._canvas.style.left = "0";
  }
  getContext() {
    return this.context;
  }
  getPixelRatio() {
    return this.pixelRatio;
  }
  setPixelRatio(t) {
    const e = this.pixelRatio;
    this.pixelRatio = t, this.setSize(this.getWidth() / e, this.getHeight() / e);
  }
  setWidth(t) {
    this.width = this._canvas.width = t * this.pixelRatio, this._canvas.style.width = t + "px";
    const e = this.pixelRatio;
    this.getContext()._context.scale(e, e);
  }
  setHeight(t) {
    this.height = this._canvas.height = t * this.pixelRatio, this._canvas.style.height = t + "px";
    const e = this.pixelRatio;
    this.getContext()._context.scale(e, e);
  }
  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }
  setSize(t, e) {
    this.setWidth(t || 0), this.setHeight(e || 0);
  }
  toDataURL(t, e) {
    try {
      return this._canvas.toDataURL(t, e);
    } catch {
      try {
        return this._canvas.toDataURL();
      } catch (n) {
        return di.Util.error("Unable to get data URL. " + n.message + " For more info read https://konvajs.org/docs/posts/Tainted_Canvas.html."), "";
      }
    }
  }
}
wt.Canvas = Wn;
class nl extends Wn {
  constructor(t = { width: 0, height: 0, willReadFrequently: !1 }) {
    super(t), this.context = new Ia.SceneContext(this, {
      willReadFrequently: t.willReadFrequently
    }), this.setSize(t.width, t.height);
  }
}
wt.SceneCanvas = nl;
class rl extends Wn {
  constructor(t = { width: 0, height: 0 }) {
    super(t), this.hitCanvas = !0, this.context = new Ia.HitContext(this), this.setSize(t.width, t.height);
  }
}
wt.HitCanvas = rl;
var _i = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.DD = void 0;
  const t = B, e = ot;
  a.DD = {
    get isDragging() {
      let i = !1;
      return a.DD._dragElements.forEach((n) => {
        n.dragStatus === "dragging" && (i = !0);
      }), i;
    },
    justDragged: !1,
    get node() {
      let i;
      return a.DD._dragElements.forEach((n) => {
        i = n.node;
      }), i;
    },
    _dragElements: /* @__PURE__ */ new Map(),
    _drag(i) {
      const n = [];
      a.DD._dragElements.forEach((r, s) => {
        const { node: o } = r, l = o.getStage();
        l.setPointersPositions(i), r.pointerId === void 0 && (r.pointerId = e.Util._getFirstPointerId(i));
        const d = l._changedPointerPositions.find((c) => c.id === r.pointerId);
        if (d) {
          if (r.dragStatus !== "dragging") {
            const c = o.dragDistance();
            if (Math.max(Math.abs(d.x - r.startPointerPos.x), Math.abs(d.y - r.startPointerPos.y)) < c || (o.startDrag({ evt: i }), !o.isDragging()))
              return;
          }
          o._setDragPosition(i, r), n.push(o);
        }
      }), n.forEach((r) => {
        r.fire("dragmove", {
          type: "dragmove",
          target: r,
          evt: i
        }, !0);
      });
    },
    _endDragBefore(i) {
      const n = [];
      a.DD._dragElements.forEach((r) => {
        const { node: s } = r, o = s.getStage();
        if (i && o.setPointersPositions(i), !o._changedPointerPositions.find((c) => c.id === r.pointerId))
          return;
        (r.dragStatus === "dragging" || r.dragStatus === "stopped") && (a.DD.justDragged = !0, t.Konva._mouseListenClick = !1, t.Konva._touchListenClick = !1, t.Konva._pointerListenClick = !1, r.dragStatus = "stopped");
        const d = r.node.getLayer() || r.node instanceof t.Konva.Stage && r.node;
        d && n.indexOf(d) === -1 && n.push(d);
      }), n.forEach((r) => {
        r.draw();
      });
    },
    _endDragAfter(i) {
      a.DD._dragElements.forEach((n, r) => {
        n.dragStatus === "stopped" && n.node.fire("dragend", {
          type: "dragend",
          target: n.node,
          evt: i
        }, !0), n.dragStatus !== "dragging" && a.DD._dragElements.delete(r);
      });
    }
  }, t.Konva.isBrowser && (window.addEventListener("mouseup", a.DD._endDragBefore, !0), window.addEventListener("touchend", a.DD._endDragBefore, !0), window.addEventListener("touchcancel", a.DD._endDragBefore, !0), window.addEventListener("mousemove", a.DD._drag), window.addEventListener("touchmove", a.DD._drag), window.addEventListener("mouseup", a.DD._endDragAfter, !1), window.addEventListener("touchend", a.DD._endDragAfter, !1), window.addEventListener("touchcancel", a.DD._endDragAfter, !1));
})(_i);
var U = {}, N = {};
Object.defineProperty(N, "__esModule", { value: !0 });
N.RGBComponent = al;
N.alphaComponent = sl;
N.getNumberValidator = ol;
N.getNumberOrArrayOfNumbersValidator = ll;
N.getNumberOrAutoValidator = dl;
N.getStringValidator = hl;
N.getStringOrGradientValidator = cl;
N.getFunctionValidator = ul;
N.getNumberArrayValidator = gl;
N.getBooleanValidator = fl;
N.getComponentValidator = pl;
const $t = B, lt = ot;
function Ht(a) {
  return lt.Util._isString(a) ? '"' + a + '"' : Object.prototype.toString.call(a) === "[object Number]" || lt.Util._isBoolean(a) ? a : Object.prototype.toString.call(a);
}
function al(a) {
  return a > 255 ? 255 : a < 0 ? 0 : Math.round(a);
}
function sl(a) {
  return a > 1 ? 1 : a < 1e-4 ? 1e-4 : a;
}
function ol() {
  if ($t.Konva.isUnminified)
    return function(a, t) {
      return lt.Util._isNumber(a) || lt.Util.warn(Ht(a) + ' is a not valid value for "' + t + '" attribute. The value should be a number.'), a;
    };
}
function ll(a) {
  if ($t.Konva.isUnminified)
    return function(t, e) {
      let i = lt.Util._isNumber(t), n = lt.Util._isArray(t) && t.length == a;
      return !i && !n && lt.Util.warn(Ht(t) + ' is a not valid value for "' + e + '" attribute. The value should be a number or Array<number>(' + a + ")"), t;
    };
}
function dl() {
  if ($t.Konva.isUnminified)
    return function(a, t) {
      return lt.Util._isNumber(a) || a === "auto" || lt.Util.warn(Ht(a) + ' is a not valid value for "' + t + '" attribute. The value should be a number or "auto".'), a;
    };
}
function hl() {
  if ($t.Konva.isUnminified)
    return function(a, t) {
      return lt.Util._isString(a) || lt.Util.warn(Ht(a) + ' is a not valid value for "' + t + '" attribute. The value should be a string.'), a;
    };
}
function cl() {
  if ($t.Konva.isUnminified)
    return function(a, t) {
      const e = lt.Util._isString(a), i = Object.prototype.toString.call(a) === "[object CanvasGradient]" || a && a.addColorStop;
      return e || i || lt.Util.warn(Ht(a) + ' is a not valid value for "' + t + '" attribute. The value should be a string or a native gradient.'), a;
    };
}
function ul() {
  if ($t.Konva.isUnminified)
    return function(a, t) {
      return lt.Util._isFunction(a) || lt.Util.warn(Ht(a) + ' is a not valid value for "' + t + '" attribute. The value should be a function.'), a;
    };
}
function gl() {
  if ($t.Konva.isUnminified)
    return function(a, t) {
      const e = Int8Array ? Object.getPrototypeOf(Int8Array) : null;
      return e && a instanceof e || (lt.Util._isArray(a) ? a.forEach(function(i) {
        lt.Util._isNumber(i) || lt.Util.warn('"' + t + '" attribute has non numeric element ' + i + ". Make sure that all elements are numbers.");
      }) : lt.Util.warn(Ht(a) + ' is a not valid value for "' + t + '" attribute. The value should be a array of numbers.')), a;
    };
}
function fl() {
  if ($t.Konva.isUnminified)
    return function(a, t) {
      return a === !0 || a === !1 || lt.Util.warn(Ht(a) + ' is a not valid value for "' + t + '" attribute. The value should be a boolean.'), a;
    };
}
function pl(a) {
  if ($t.Konva.isUnminified)
    return function(t, e) {
      return t == null || lt.Util.isObject(t) || lt.Util.warn(Ht(t) + ' is a not valid value for "' + e + '" attribute. The value should be an object with properties ' + a), t;
    };
}
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Factory = void 0;
  const t = ot, e = N, i = "get", n = "set";
  a.Factory = {
    addGetterSetter(r, s, o, l, d) {
      a.Factory.addGetter(r, s, o), a.Factory.addSetter(r, s, l, d), a.Factory.addOverloadedGetterSetter(r, s);
    },
    addGetter(r, s, o) {
      const l = i + t.Util._capitalize(s);
      r.prototype[l] = r.prototype[l] || function() {
        const d = this.attrs[s];
        return d === void 0 ? o : d;
      };
    },
    addSetter(r, s, o, l) {
      const d = n + t.Util._capitalize(s);
      r.prototype[d] || a.Factory.overWriteSetter(r, s, o, l);
    },
    overWriteSetter(r, s, o, l) {
      const d = n + t.Util._capitalize(s);
      r.prototype[d] = function(c) {
        return o && c !== void 0 && c !== null && (c = o.call(this, c, s)), this._setAttr(s, c), l && l.call(this), this;
      };
    },
    addComponentsGetterSetter(r, s, o, l, d) {
      const c = o.length, p = t.Util._capitalize, f = i + p(s), g = n + p(s);
      r.prototype[f] = function() {
        const _ = {};
        for (let y = 0; y < c; y++) {
          const v = o[y];
          _[v] = this.getAttr(s + p(v));
        }
        return _;
      };
      const u = (0, e.getComponentValidator)(o);
      r.prototype[g] = function(_) {
        const y = this.attrs[s];
        l && (_ = l.call(this, _, s)), u && u.call(this, _, s);
        for (const v in _)
          _.hasOwnProperty(v) && this._setAttr(s + p(v), _[v]);
        return _ || o.forEach((v) => {
          this._setAttr(s + p(v), void 0);
        }), this._fireChangeEvent(s, y, _), d && d.call(this), this;
      }, a.Factory.addOverloadedGetterSetter(r, s);
    },
    addOverloadedGetterSetter(r, s) {
      const o = t.Util._capitalize(s), l = n + o, d = i + o;
      r.prototype[s] = function() {
        return arguments.length ? (this[l](arguments[0]), this) : this[d]();
      };
    },
    addDeprecatedGetterSetter(r, s, o, l) {
      t.Util.error("Adding deprecated " + s);
      const d = i + t.Util._capitalize(s), c = s + " property is deprecated and will be removed soon. Look at Konva change log for more information.";
      r.prototype[d] = function() {
        t.Util.error(c);
        const p = this.attrs[s];
        return p === void 0 ? o : p;
      }, a.Factory.addSetter(r, s, l, function() {
        t.Util.error(c);
      }), a.Factory.addOverloadedGetterSetter(r, s);
    },
    backCompat(r, s) {
      t.Util.each(s, function(o, l) {
        const d = r.prototype[l], c = i + t.Util._capitalize(o), p = n + t.Util._capitalize(o);
        function f() {
          d.apply(this, arguments), t.Util.error('"' + o + '" method is deprecated and will be removed soon. Use ""' + l + '" instead.');
        }
        r.prototype[o] = f, r.prototype[c] = f, r.prototype[p] = f;
      });
    },
    afterSetFilter() {
      this._filterUpToDate = !1;
    }
  };
})(U);
Object.defineProperty(at, "__esModule", { value: !0 });
at.Node = void 0;
const ge = wt, vt = _i, We = U, Dt = B, z = ot, ut = N, ri = "absoluteOpacity", Je = "allEventListeners", Lt = "absoluteTransform", Lr = "absoluteScale", Zt = "canvas", ml = "Change", _l = "children", yl = "konva", Pn = "listening", bl = "mouseenter", vl = "mouseleave", Cl = "pointerenter", wl = "pointerleave", Al = "touchenter", Sl = "touchleave", Vr = "set", Tr = "Shape", ai = " ", $r = "stage", Nt = "transform", xl = "Stage", En = "visible", Ml = [
  "xChange.konva",
  "yChange.konva",
  "scaleXChange.konva",
  "scaleYChange.konva",
  "skewXChange.konva",
  "skewYChange.konva",
  "rotationChange.konva",
  "offsetXChange.konva",
  "offsetYChange.konva",
  "transformsEnabledChange.konva"
].join(ai);
let kl = 1;
class I {
  constructor(t) {
    this._id = kl++, this.eventListeners = {}, this.attrs = {}, this.index = 0, this._allEventListeners = null, this.parent = null, this._cache = /* @__PURE__ */ new Map(), this._attachedDepsListeners = /* @__PURE__ */ new Map(), this._lastPos = null, this._batchingTransformChange = !1, this._needClearTransformCache = !1, this._filterUpToDate = !1, this._isUnderCache = !1, this._dragEventId = null, this._shouldFireChangeEvents = !1, this.setAttrs(t), this._shouldFireChangeEvents = !0;
  }
  hasChildren() {
    return !1;
  }
  _clearCache(t) {
    (t === Nt || t === Lt) && this._cache.get(t) ? this._cache.get(t).dirty = !0 : t ? this._cache.delete(t) : this._cache.clear();
  }
  _getCache(t, e) {
    let i = this._cache.get(t);
    return (i === void 0 || (t === Nt || t === Lt) && i.dirty === !0) && (i = e.call(this), this._cache.set(t, i)), i;
  }
  _calculate(t, e, i) {
    if (!this._attachedDepsListeners.get(t)) {
      const n = e.map((r) => r + "Change.konva").join(ai);
      this.on(n, () => {
        this._clearCache(t);
      }), this._attachedDepsListeners.set(t, !0);
    }
    return this._getCache(t, i);
  }
  _getCanvasCache() {
    return this._cache.get(Zt);
  }
  _clearSelfAndDescendantCache(t) {
    this._clearCache(t), t === Lt && this.fire("absoluteTransformChange");
  }
  clearCache() {
    if (this._cache.has(Zt)) {
      const { scene: t, filter: e, hit: i, buffer: n } = this._cache.get(Zt);
      z.Util.releaseCanvas(t, e, i, n), this._cache.delete(Zt);
    }
    return this._clearSelfAndDescendantCache(), this._requestDraw(), this;
  }
  cache(t) {
    const e = t || {};
    let i = {};
    (e.x === void 0 || e.y === void 0 || e.width === void 0 || e.height === void 0) && (i = this.getClientRect({
      skipTransform: !0,
      relativeTo: this.getParent() || void 0
    }));
    let n = Math.ceil(e.width || i.width), r = Math.ceil(e.height || i.height), s = e.pixelRatio, o = e.x === void 0 ? Math.floor(i.x) : e.x, l = e.y === void 0 ? Math.floor(i.y) : e.y, d = e.offset || 0, c = e.drawBorder || !1, p = e.hitCanvasPixelRatio || 1;
    if (!n || !r) {
      z.Util.error("Can not cache the node. Width or height of the node equals 0. Caching is skipped.");
      return;
    }
    const f = Math.abs(Math.round(i.x) - o) > 0.5 ? 1 : 0, g = Math.abs(Math.round(i.y) - l) > 0.5 ? 1 : 0;
    n += d * 2 + f, r += d * 2 + g, o -= d, l -= d;
    const u = new ge.SceneCanvas({
      pixelRatio: s,
      width: n,
      height: r
    }), _ = new ge.SceneCanvas({
      pixelRatio: s,
      width: 0,
      height: 0,
      willReadFrequently: !0
    }), y = new ge.HitCanvas({
      pixelRatio: p,
      width: n,
      height: r
    }), v = u.getContext(), w = y.getContext(), h = new ge.SceneCanvas({
      width: u.width / u.pixelRatio + Math.abs(o),
      height: u.height / u.pixelRatio + Math.abs(l),
      pixelRatio: u.pixelRatio
    }), m = h.getContext();
    return y.isCache = !0, u.isCache = !0, this._cache.delete(Zt), this._filterUpToDate = !1, e.imageSmoothingEnabled === !1 && (u.getContext()._context.imageSmoothingEnabled = !1, _.getContext()._context.imageSmoothingEnabled = !1), v.save(), w.save(), m.save(), v.translate(-o, -l), w.translate(-o, -l), m.translate(-o, -l), h.x = o, h.y = l, this._isUnderCache = !0, this._clearSelfAndDescendantCache(ri), this._clearSelfAndDescendantCache(Lr), this.drawScene(u, this, h), this.drawHit(y, this), this._isUnderCache = !1, v.restore(), w.restore(), c && (v.save(), v.beginPath(), v.rect(0, 0, n, r), v.closePath(), v.setAttr("strokeStyle", "red"), v.setAttr("lineWidth", 5), v.stroke(), v.restore()), this._cache.set(Zt, {
      scene: u,
      filter: _,
      hit: y,
      buffer: h,
      x: o,
      y: l
    }), this._requestDraw(), this;
  }
  isCached() {
    return this._cache.has(Zt);
  }
  getClientRect(t) {
    throw new Error('abstract "getClientRect" method call');
  }
  _transformedRect(t, e) {
    const i = [
      { x: t.x, y: t.y },
      { x: t.x + t.width, y: t.y },
      { x: t.x + t.width, y: t.y + t.height },
      { x: t.x, y: t.y + t.height }
    ];
    let n = 1 / 0, r = 1 / 0, s = -1 / 0, o = -1 / 0;
    const l = this.getAbsoluteTransform(e);
    return i.forEach(function(d) {
      const c = l.point(d);
      n === void 0 && (n = s = c.x, r = o = c.y), n = Math.min(n, c.x), r = Math.min(r, c.y), s = Math.max(s, c.x), o = Math.max(o, c.y);
    }), {
      x: n,
      y: r,
      width: s - n,
      height: o - r
    };
  }
  _drawCachedSceneCanvas(t) {
    t.save(), t._applyOpacity(this), t._applyGlobalCompositeOperation(this);
    const e = this._getCanvasCache();
    t.translate(e.x, e.y);
    const i = this._getCachedSceneCanvas(), n = i.pixelRatio;
    t.drawImage(i._canvas, 0, 0, i.width / n, i.height / n), t.restore();
  }
  _drawCachedHitCanvas(t) {
    const e = this._getCanvasCache(), i = e.hit;
    t.save(), t.translate(e.x, e.y), t.drawImage(i._canvas, 0, 0, i.width / i.pixelRatio, i.height / i.pixelRatio), t.restore();
  }
  _getCachedSceneCanvas() {
    let t = this.filters(), e = this._getCanvasCache(), i = e.scene, n = e.filter, r = n.getContext(), s, o, l, d;
    if (t) {
      if (!this._filterUpToDate) {
        const c = i.pixelRatio;
        n.setSize(i.width / i.pixelRatio, i.height / i.pixelRatio);
        try {
          for (s = t.length, r.clear(), r.drawImage(i._canvas, 0, 0, i.getWidth() / c, i.getHeight() / c), o = r.getImageData(0, 0, n.getWidth(), n.getHeight()), l = 0; l < s; l++) {
            if (d = t[l], typeof d != "function") {
              z.Util.error("Filter should be type of function, but got " + typeof d + " instead. Please check correct filters");
              continue;
            }
            d.call(this, o), r.putImageData(o, 0, 0);
          }
        } catch (p) {
          z.Util.error("Unable to apply filter. " + p.message + " This post my help you https://konvajs.org/docs/posts/Tainted_Canvas.html.");
        }
        this._filterUpToDate = !0;
      }
      return n;
    }
    return i;
  }
  on(t, e) {
    if (this._cache && this._cache.delete(Je), arguments.length === 3)
      return this._delegate.apply(this, arguments);
    const i = t.split(ai);
    for (let n = 0; n < i.length; n++) {
      const s = i[n].split("."), o = s[0], l = s[1] || "";
      this.eventListeners[o] || (this.eventListeners[o] = []), this.eventListeners[o].push({ name: l, handler: e });
    }
    return this;
  }
  off(t, e) {
    let i = (t || "").split(ai), n = i.length, r, s, o, l, d, c;
    if (this._cache && this._cache.delete(Je), !t)
      for (s in this.eventListeners)
        this._off(s);
    for (r = 0; r < n; r++)
      if (o = i[r], l = o.split("."), d = l[0], c = l[1], d)
        this.eventListeners[d] && this._off(d, c, e);
      else
        for (s in this.eventListeners)
          this._off(s, c, e);
    return this;
  }
  dispatchEvent(t) {
    const e = {
      target: this,
      type: t.type,
      evt: t
    };
    return this.fire(t.type, e), this;
  }
  addEventListener(t, e) {
    return this.on(t, function(i) {
      e.call(this, i.evt);
    }), this;
  }
  removeEventListener(t) {
    return this.off(t), this;
  }
  _delegate(t, e, i) {
    const n = this;
    this.on(t, function(r) {
      const s = r.target.findAncestors(e, !0, n);
      for (let o = 0; o < s.length; o++)
        r = z.Util.cloneObject(r), r.currentTarget = s[o], i.call(s[o], r);
    });
  }
  remove() {
    return this.isDragging() && this.stopDrag(), vt.DD._dragElements.delete(this._id), this._remove(), this;
  }
  _clearCaches() {
    this._clearSelfAndDescendantCache(Lt), this._clearSelfAndDescendantCache(ri), this._clearSelfAndDescendantCache(Lr), this._clearSelfAndDescendantCache($r), this._clearSelfAndDescendantCache(En), this._clearSelfAndDescendantCache(Pn);
  }
  _remove() {
    this._clearCaches();
    const t = this.getParent();
    t && t.children && (t.children.splice(this.index, 1), t._setChildrenIndices(), this.parent = null);
  }
  destroy() {
    return this.remove(), this.clearCache(), this;
  }
  getAttr(t) {
    const e = "get" + z.Util._capitalize(t);
    return z.Util._isFunction(this[e]) ? this[e]() : this.attrs[t];
  }
  getAncestors() {
    let t = this.getParent(), e = [];
    for (; t; )
      e.push(t), t = t.getParent();
    return e;
  }
  getAttrs() {
    return this.attrs || {};
  }
  setAttrs(t) {
    return this._batchTransformChanges(() => {
      let e, i;
      if (!t)
        return this;
      for (e in t)
        e !== _l && (i = Vr + z.Util._capitalize(e), z.Util._isFunction(this[i]) ? this[i](t[e]) : this._setAttr(e, t[e]));
    }), this;
  }
  isListening() {
    return this._getCache(Pn, this._isListening);
  }
  _isListening(t) {
    if (!this.listening())
      return !1;
    const i = this.getParent();
    return i && i !== t && this !== t ? i._isListening(t) : !0;
  }
  isVisible() {
    return this._getCache(En, this._isVisible);
  }
  _isVisible(t) {
    if (!this.visible())
      return !1;
    const i = this.getParent();
    return i && i !== t && this !== t ? i._isVisible(t) : !0;
  }
  shouldDrawHit(t, e = !1) {
    if (t)
      return this._isVisible(t) && this._isListening(t);
    const i = this.getLayer();
    let n = !1;
    vt.DD._dragElements.forEach((s) => {
      s.dragStatus === "dragging" && (s.node.nodeType === "Stage" || s.node.getLayer() === i) && (n = !0);
    });
    const r = !e && !Dt.Konva.hitOnDragEnabled && (n || Dt.Konva.isTransforming());
    return this.isListening() && this.isVisible() && !r;
  }
  show() {
    return this.visible(!0), this;
  }
  hide() {
    return this.visible(!1), this;
  }
  getZIndex() {
    return this.index || 0;
  }
  getAbsoluteZIndex() {
    let t = this.getDepth(), e = this, i = 0, n, r, s, o;
    function l(c) {
      for (n = [], r = c.length, s = 0; s < r; s++)
        o = c[s], i++, o.nodeType !== Tr && (n = n.concat(o.getChildren().slice())), o._id === e._id && (s = r);
      n.length > 0 && n[0].getDepth() <= t && l(n);
    }
    const d = this.getStage();
    return e.nodeType !== xl && d && l(d.getChildren()), i;
  }
  getDepth() {
    let t = 0, e = this.parent;
    for (; e; )
      t++, e = e.parent;
    return t;
  }
  _batchTransformChanges(t) {
    this._batchingTransformChange = !0, t(), this._batchingTransformChange = !1, this._needClearTransformCache && (this._clearCache(Nt), this._clearSelfAndDescendantCache(Lt)), this._needClearTransformCache = !1;
  }
  setPosition(t) {
    return this._batchTransformChanges(() => {
      this.x(t.x), this.y(t.y);
    }), this;
  }
  getPosition() {
    return {
      x: this.x(),
      y: this.y()
    };
  }
  getRelativePointerPosition() {
    const t = this.getStage();
    if (!t)
      return null;
    const e = t.getPointerPosition();
    if (!e)
      return null;
    const i = this.getAbsoluteTransform().copy();
    return i.invert(), i.point(e);
  }
  getAbsolutePosition(t) {
    let e = !1, i = this.parent;
    for (; i; ) {
      if (i.isCached()) {
        e = !0;
        break;
      }
      i = i.parent;
    }
    e && !t && (t = !0);
    const n = this.getAbsoluteTransform(t).getMatrix(), r = new z.Transform(), s = this.offset();
    return r.m = n.slice(), r.translate(s.x, s.y), r.getTranslation();
  }
  setAbsolutePosition(t) {
    const { x: e, y: i, ...n } = this._clearTransform();
    this.attrs.x = e, this.attrs.y = i, this._clearCache(Nt);
    const r = this._getAbsoluteTransform().copy();
    return r.invert(), r.translate(t.x, t.y), t = {
      x: this.attrs.x + r.getTranslation().x,
      y: this.attrs.y + r.getTranslation().y
    }, this._setTransform(n), this.setPosition({ x: t.x, y: t.y }), this._clearCache(Nt), this._clearSelfAndDescendantCache(Lt), this;
  }
  _setTransform(t) {
    let e;
    for (e in t)
      this.attrs[e] = t[e];
  }
  _clearTransform() {
    const t = {
      x: this.x(),
      y: this.y(),
      rotation: this.rotation(),
      scaleX: this.scaleX(),
      scaleY: this.scaleY(),
      offsetX: this.offsetX(),
      offsetY: this.offsetY(),
      skewX: this.skewX(),
      skewY: this.skewY()
    };
    return this.attrs.x = 0, this.attrs.y = 0, this.attrs.rotation = 0, this.attrs.scaleX = 1, this.attrs.scaleY = 1, this.attrs.offsetX = 0, this.attrs.offsetY = 0, this.attrs.skewX = 0, this.attrs.skewY = 0, t;
  }
  move(t) {
    let e = t.x, i = t.y, n = this.x(), r = this.y();
    return e !== void 0 && (n += e), i !== void 0 && (r += i), this.setPosition({ x: n, y: r }), this;
  }
  _eachAncestorReverse(t, e) {
    let i = [], n = this.getParent(), r, s;
    if (!(e && e._id === this._id)) {
      for (i.unshift(this); n && (!e || n._id !== e._id); )
        i.unshift(n), n = n.parent;
      for (r = i.length, s = 0; s < r; s++)
        t(i[s]);
    }
  }
  rotate(t) {
    return this.rotation(this.rotation() + t), this;
  }
  moveToTop() {
    if (!this.parent)
      return z.Util.warn("Node has no parent. moveToTop function is ignored."), !1;
    const t = this.index, e = this.parent.getChildren().length;
    return t < e - 1 ? (this.parent.children.splice(t, 1), this.parent.children.push(this), this.parent._setChildrenIndices(), !0) : !1;
  }
  moveUp() {
    if (!this.parent)
      return z.Util.warn("Node has no parent. moveUp function is ignored."), !1;
    const t = this.index, e = this.parent.getChildren().length;
    return t < e - 1 ? (this.parent.children.splice(t, 1), this.parent.children.splice(t + 1, 0, this), this.parent._setChildrenIndices(), !0) : !1;
  }
  moveDown() {
    if (!this.parent)
      return z.Util.warn("Node has no parent. moveDown function is ignored."), !1;
    const t = this.index;
    return t > 0 ? (this.parent.children.splice(t, 1), this.parent.children.splice(t - 1, 0, this), this.parent._setChildrenIndices(), !0) : !1;
  }
  moveToBottom() {
    if (!this.parent)
      return z.Util.warn("Node has no parent. moveToBottom function is ignored."), !1;
    const t = this.index;
    return t > 0 ? (this.parent.children.splice(t, 1), this.parent.children.unshift(this), this.parent._setChildrenIndices(), !0) : !1;
  }
  setZIndex(t) {
    if (!this.parent)
      return z.Util.warn("Node has no parent. zIndex parameter is ignored."), this;
    (t < 0 || t >= this.parent.children.length) && z.Util.warn("Unexpected value " + t + " for zIndex property. zIndex is just index of a node in children of its parent. Expected value is from 0 to " + (this.parent.children.length - 1) + ".");
    const e = this.index;
    return this.parent.children.splice(e, 1), this.parent.children.splice(t, 0, this), this.parent._setChildrenIndices(), this;
  }
  getAbsoluteOpacity() {
    return this._getCache(ri, this._getAbsoluteOpacity);
  }
  _getAbsoluteOpacity() {
    let t = this.opacity();
    const e = this.getParent();
    return e && !e._isUnderCache && (t *= e.getAbsoluteOpacity()), t;
  }
  moveTo(t) {
    return this.getParent() !== t && (this._remove(), t.add(this)), this;
  }
  toObject() {
    let t = this.getAttrs(), e, i, n, r, s;
    const o = {
      attrs: {},
      className: this.getClassName()
    };
    for (e in t)
      i = t[e], s = z.Util.isObject(i) && !z.Util._isPlainObject(i) && !z.Util._isArray(i), !s && (n = typeof this[e] == "function" && this[e], delete t[e], r = n ? n.call(this) : null, t[e] = i, r !== i && (o.attrs[e] = i));
    return z.Util._prepareToStringify(o);
  }
  toJSON() {
    return JSON.stringify(this.toObject());
  }
  getParent() {
    return this.parent;
  }
  findAncestors(t, e, i) {
    const n = [];
    e && this._isMatch(t) && n.push(this);
    let r = this.parent;
    for (; r; ) {
      if (r === i)
        return n;
      r._isMatch(t) && n.push(r), r = r.parent;
    }
    return n;
  }
  isAncestorOf(t) {
    return !1;
  }
  findAncestor(t, e, i) {
    return this.findAncestors(t, e, i)[0];
  }
  _isMatch(t) {
    if (!t)
      return !1;
    if (typeof t == "function")
      return t(this);
    let e = t.replace(/ /g, "").split(","), i = e.length, n, r;
    for (n = 0; n < i; n++)
      if (r = e[n], z.Util.isValidSelector(r) || (z.Util.warn('Selector "' + r + '" is invalid. Allowed selectors examples are "#foo", ".bar" or "Group".'), z.Util.warn('If you have a custom shape with such className, please change it to start with upper letter like "Triangle".'), z.Util.warn("Konva is awesome, right?")), r.charAt(0) === "#") {
        if (this.id() === r.slice(1))
          return !0;
      } else if (r.charAt(0) === ".") {
        if (this.hasName(r.slice(1)))
          return !0;
      } else if (this.className === r || this.nodeType === r)
        return !0;
    return !1;
  }
  getLayer() {
    const t = this.getParent();
    return t ? t.getLayer() : null;
  }
  getStage() {
    return this._getCache($r, this._getStage);
  }
  _getStage() {
    const t = this.getParent();
    return t ? t.getStage() : null;
  }
  fire(t, e = {}, i) {
    return e.target = e.target || this, i ? this._fireAndBubble(t, e) : this._fire(t, e), this;
  }
  getAbsoluteTransform(t) {
    return t ? this._getAbsoluteTransform(t) : this._getCache(Lt, this._getAbsoluteTransform);
  }
  _getAbsoluteTransform(t) {
    let e;
    if (t)
      return e = new z.Transform(), this._eachAncestorReverse(function(i) {
        const n = i.transformsEnabled();
        n === "all" ? e.multiply(i.getTransform()) : n === "position" && e.translate(i.x() - i.offsetX(), i.y() - i.offsetY());
      }, t), e;
    {
      e = this._cache.get(Lt) || new z.Transform(), this.parent ? this.parent.getAbsoluteTransform().copyInto(e) : e.reset();
      const i = this.transformsEnabled();
      if (i === "all")
        e.multiply(this.getTransform());
      else if (i === "position") {
        const n = this.attrs.x || 0, r = this.attrs.y || 0, s = this.attrs.offsetX || 0, o = this.attrs.offsetY || 0;
        e.translate(n - s, r - o);
      }
      return e.dirty = !1, e;
    }
  }
  getAbsoluteScale(t) {
    let e = this;
    for (; e; )
      e._isUnderCache && (t = e), e = e.getParent();
    const n = this.getAbsoluteTransform(t).decompose();
    return {
      x: n.scaleX,
      y: n.scaleY
    };
  }
  getAbsoluteRotation() {
    return this.getAbsoluteTransform().decompose().rotation;
  }
  getTransform() {
    return this._getCache(Nt, this._getTransform);
  }
  _getTransform() {
    var t, e;
    const i = this._cache.get(Nt) || new z.Transform();
    i.reset();
    const n = this.x(), r = this.y(), s = Dt.Konva.getAngle(this.rotation()), o = (t = this.attrs.scaleX) !== null && t !== void 0 ? t : 1, l = (e = this.attrs.scaleY) !== null && e !== void 0 ? e : 1, d = this.attrs.skewX || 0, c = this.attrs.skewY || 0, p = this.attrs.offsetX || 0, f = this.attrs.offsetY || 0;
    return (n !== 0 || r !== 0) && i.translate(n, r), s !== 0 && i.rotate(s), (d !== 0 || c !== 0) && i.skew(d, c), (o !== 1 || l !== 1) && i.scale(o, l), (p !== 0 || f !== 0) && i.translate(-1 * p, -1 * f), i.dirty = !1, i;
  }
  clone(t) {
    let e = z.Util.cloneObject(this.attrs), i, n, r, s, o;
    for (i in t)
      e[i] = t[i];
    const l = new this.constructor(e);
    for (i in this.eventListeners)
      for (n = this.eventListeners[i], r = n.length, s = 0; s < r; s++)
        o = n[s], o.name.indexOf(yl) < 0 && (l.eventListeners[i] || (l.eventListeners[i] = []), l.eventListeners[i].push(o));
    return l;
  }
  _toKonvaCanvas(t) {
    t = t || {};
    const e = this.getClientRect(), i = this.getStage(), n = t.x !== void 0 ? t.x : Math.floor(e.x), r = t.y !== void 0 ? t.y : Math.floor(e.y), s = t.pixelRatio || 1, o = new ge.SceneCanvas({
      width: t.width || Math.ceil(e.width) || (i ? i.width() : 0),
      height: t.height || Math.ceil(e.height) || (i ? i.height() : 0),
      pixelRatio: s
    }), l = o.getContext(), d = new ge.SceneCanvas({
      width: o.width / o.pixelRatio + Math.abs(n),
      height: o.height / o.pixelRatio + Math.abs(r),
      pixelRatio: o.pixelRatio
    });
    return t.imageSmoothingEnabled === !1 && (l._context.imageSmoothingEnabled = !1), l.save(), (n || r) && l.translate(-1 * n, -1 * r), this.drawScene(o, void 0, d), l.restore(), o;
  }
  toCanvas(t) {
    return this._toKonvaCanvas(t)._canvas;
  }
  toDataURL(t) {
    t = t || {};
    const e = t.mimeType || null, i = t.quality || null, n = this._toKonvaCanvas(t).toDataURL(e, i);
    return t.callback && t.callback(n), n;
  }
  toImage(t) {
    return new Promise((e, i) => {
      try {
        const n = t == null ? void 0 : t.callback;
        n && delete t.callback, z.Util._urlToImage(this.toDataURL(t), function(r) {
          e(r), n == null || n(r);
        });
      } catch (n) {
        i(n);
      }
    });
  }
  toBlob(t) {
    return new Promise((e, i) => {
      try {
        const n = t == null ? void 0 : t.callback;
        n && delete t.callback, this.toCanvas(t).toBlob((r) => {
          e(r), n == null || n(r);
        }, t == null ? void 0 : t.mimeType, t == null ? void 0 : t.quality);
      } catch (n) {
        i(n);
      }
    });
  }
  setSize(t) {
    return this.width(t.width), this.height(t.height), this;
  }
  getSize() {
    return {
      width: this.width(),
      height: this.height()
    };
  }
  getClassName() {
    return this.className || this.nodeType;
  }
  getType() {
    return this.nodeType;
  }
  getDragDistance() {
    return this.attrs.dragDistance !== void 0 ? this.attrs.dragDistance : this.parent ? this.parent.getDragDistance() : Dt.Konva.dragDistance;
  }
  _off(t, e, i) {
    let n = this.eventListeners[t], r, s, o;
    for (r = 0; r < n.length; r++)
      if (s = n[r].name, o = n[r].handler, (s !== "konva" || e === "konva") && (!e || s === e) && (!i || i === o)) {
        if (n.splice(r, 1), n.length === 0) {
          delete this.eventListeners[t];
          break;
        }
        r--;
      }
  }
  _fireChangeEvent(t, e, i) {
    this._fire(t + ml, {
      oldVal: e,
      newVal: i
    });
  }
  addName(t) {
    if (!this.hasName(t)) {
      const e = this.name(), i = e ? e + " " + t : t;
      this.name(i);
    }
    return this;
  }
  hasName(t) {
    if (!t)
      return !1;
    const e = this.name();
    return e ? (e || "").split(/\s/g).indexOf(t) !== -1 : !1;
  }
  removeName(t) {
    const e = (this.name() || "").split(/\s/g), i = e.indexOf(t);
    return i !== -1 && (e.splice(i, 1), this.name(e.join(" "))), this;
  }
  setAttr(t, e) {
    const i = this[Vr + z.Util._capitalize(t)];
    return z.Util._isFunction(i) ? i.call(this, e) : this._setAttr(t, e), this;
  }
  _requestDraw() {
    if (Dt.Konva.autoDrawEnabled) {
      const t = this.getLayer() || this.getStage();
      t == null || t.batchDraw();
    }
  }
  _setAttr(t, e) {
    const i = this.attrs[t];
    i === e && !z.Util.isObject(e) || (e == null ? delete this.attrs[t] : this.attrs[t] = e, this._shouldFireChangeEvents && this._fireChangeEvent(t, i, e), this._requestDraw());
  }
  _setComponentAttr(t, e, i) {
    let n;
    i !== void 0 && (n = this.attrs[t], n || (this.attrs[t] = this.getAttr(t)), this.attrs[t][e] = i, this._fireChangeEvent(t, n, i));
  }
  _fireAndBubble(t, e, i) {
    e && this.nodeType === Tr && (e.target = this);
    const n = [
      bl,
      vl,
      Cl,
      wl,
      Al,
      Sl
    ];
    if (!(n.indexOf(t) !== -1 && (i && (this === i || this.isAncestorOf && this.isAncestorOf(i)) || this.nodeType === "Stage" && !i))) {
      this._fire(t, e);
      const s = n.indexOf(t) !== -1 && i && i.isAncestorOf && i.isAncestorOf(this) && !i.isAncestorOf(this.parent);
      (e && !e.cancelBubble || !e) && this.parent && this.parent.isListening() && !s && (i && i.parent ? this._fireAndBubble.call(this.parent, t, e, i) : this._fireAndBubble.call(this.parent, t, e));
    }
  }
  _getProtoListeners(t) {
    var e, i, n;
    const r = (e = this._cache.get(Je)) !== null && e !== void 0 ? e : {};
    let s = r == null ? void 0 : r[t];
    if (s === void 0) {
      s = [];
      let o = Object.getPrototypeOf(this);
      for (; o; ) {
        const l = (n = (i = o.eventListeners) === null || i === void 0 ? void 0 : i[t]) !== null && n !== void 0 ? n : [];
        s.push(...l), o = Object.getPrototypeOf(o);
      }
      r[t] = s, this._cache.set(Je, r);
    }
    return s;
  }
  _fire(t, e) {
    e = e || {}, e.currentTarget = this, e.type = t;
    const i = this._getProtoListeners(t);
    if (i)
      for (let r = 0; r < i.length; r++)
        i[r].handler.call(this, e);
    const n = this.eventListeners[t];
    if (n)
      for (let r = 0; r < n.length; r++)
        n[r].handler.call(this, e);
  }
  draw() {
    return this.drawScene(), this.drawHit(), this;
  }
  _createDragElement(t) {
    const e = t ? t.pointerId : void 0, i = this.getStage(), n = this.getAbsolutePosition();
    if (!i)
      return;
    const r = i._getPointerById(e) || i._changedPointerPositions[0] || n;
    vt.DD._dragElements.set(this._id, {
      node: this,
      startPointerPos: r,
      offset: {
        x: r.x - n.x,
        y: r.y - n.y
      },
      dragStatus: "ready",
      pointerId: e
    });
  }
  startDrag(t, e = !0) {
    vt.DD._dragElements.has(this._id) || this._createDragElement(t);
    const i = vt.DD._dragElements.get(this._id);
    i.dragStatus = "dragging", this.fire("dragstart", {
      type: "dragstart",
      target: this,
      evt: t && t.evt
    }, e);
  }
  _setDragPosition(t, e) {
    const i = this.getStage()._getPointerById(e.pointerId);
    if (!i)
      return;
    let n = {
      x: i.x - e.offset.x,
      y: i.y - e.offset.y
    };
    const r = this.dragBoundFunc();
    if (r !== void 0) {
      const s = r.call(this, n, t);
      s ? n = s : z.Util.warn("dragBoundFunc did not return any value. That is unexpected behavior. You must return new absolute position from dragBoundFunc.");
    }
    (!this._lastPos || this._lastPos.x !== n.x || this._lastPos.y !== n.y) && (this.setAbsolutePosition(n), this._requestDraw()), this._lastPos = n;
  }
  stopDrag(t) {
    const e = vt.DD._dragElements.get(this._id);
    e && (e.dragStatus = "stopped"), vt.DD._endDragBefore(t), vt.DD._endDragAfter(t);
  }
  setDraggable(t) {
    this._setAttr("draggable", t), this._dragChange();
  }
  isDragging() {
    const t = vt.DD._dragElements.get(this._id);
    return t ? t.dragStatus === "dragging" : !1;
  }
  _listenDrag() {
    this._dragCleanup(), this.on("mousedown.konva touchstart.konva", function(t) {
      if (!(!(t.evt.button !== void 0) || Dt.Konva.dragButtons.indexOf(t.evt.button) >= 0) || this.isDragging())
        return;
      let n = !1;
      vt.DD._dragElements.forEach((r) => {
        this.isAncestorOf(r.node) && (n = !0);
      }), n || this._createDragElement(t);
    });
  }
  _dragChange() {
    if (this.attrs.draggable)
      this._listenDrag();
    else {
      if (this._dragCleanup(), !this.getStage())
        return;
      const e = vt.DD._dragElements.get(this._id), i = e && e.dragStatus === "dragging", n = e && e.dragStatus === "ready";
      i ? this.stopDrag() : n && vt.DD._dragElements.delete(this._id);
    }
  }
  _dragCleanup() {
    this.off("mousedown.konva"), this.off("touchstart.konva");
  }
  isClientRectOnScreen(t = { x: 0, y: 0 }) {
    const e = this.getStage();
    if (!e)
      return !1;
    const i = {
      x: -t.x,
      y: -t.y,
      width: e.width() + 2 * t.x,
      height: e.height() + 2 * t.y
    };
    return z.Util.haveIntersection(i, this.getClientRect());
  }
  static create(t, e) {
    return z.Util._isString(t) && (t = JSON.parse(t)), this._createNode(t, e);
  }
  static _createNode(t, e) {
    let i = I.prototype.getClassName.call(t), n = t.children, r, s, o;
    e && (t.attrs.container = e), Dt.Konva[i] || (z.Util.warn('Can not find a node with class name "' + i + '". Fallback to "Shape".'), i = "Shape");
    const l = Dt.Konva[i];
    if (r = new l(t.attrs), n)
      for (s = n.length, o = 0; o < s; o++)
        r.add(I._createNode(n[o]));
    return r;
  }
}
at.Node = I;
I.prototype.nodeType = "Node";
I.prototype._attrsAffectingSize = [];
I.prototype.eventListeners = {};
I.prototype.on.call(I.prototype, Ml, function() {
  if (this._batchingTransformChange) {
    this._needClearTransformCache = !0;
    return;
  }
  this._clearCache(Nt), this._clearSelfAndDescendantCache(Lt);
});
I.prototype.on.call(I.prototype, "visibleChange.konva", function() {
  this._clearSelfAndDescendantCache(En);
});
I.prototype.on.call(I.prototype, "listeningChange.konva", function() {
  this._clearSelfAndDescendantCache(Pn);
});
I.prototype.on.call(I.prototype, "opacityChange.konva", function() {
  this._clearSelfAndDescendantCache(ri);
});
const et = We.Factory.addGetterSetter;
et(I, "zIndex");
et(I, "absolutePosition");
et(I, "position");
et(I, "x", 0, (0, ut.getNumberValidator)());
et(I, "y", 0, (0, ut.getNumberValidator)());
et(I, "globalCompositeOperation", "source-over", (0, ut.getStringValidator)());
et(I, "opacity", 1, (0, ut.getNumberValidator)());
et(I, "name", "", (0, ut.getStringValidator)());
et(I, "id", "", (0, ut.getStringValidator)());
et(I, "rotation", 0, (0, ut.getNumberValidator)());
We.Factory.addComponentsGetterSetter(I, "scale", ["x", "y"]);
et(I, "scaleX", 1, (0, ut.getNumberValidator)());
et(I, "scaleY", 1, (0, ut.getNumberValidator)());
We.Factory.addComponentsGetterSetter(I, "skew", ["x", "y"]);
et(I, "skewX", 0, (0, ut.getNumberValidator)());
et(I, "skewY", 0, (0, ut.getNumberValidator)());
We.Factory.addComponentsGetterSetter(I, "offset", ["x", "y"]);
et(I, "offsetX", 0, (0, ut.getNumberValidator)());
et(I, "offsetY", 0, (0, ut.getNumberValidator)());
et(I, "dragDistance", void 0, (0, ut.getNumberValidator)());
et(I, "width", 0, (0, ut.getNumberValidator)());
et(I, "height", 0, (0, ut.getNumberValidator)());
et(I, "listening", !0, (0, ut.getBooleanValidator)());
et(I, "preventDefault", !0, (0, ut.getBooleanValidator)());
et(I, "filters", void 0, function(a) {
  return this._filterUpToDate = !1, a;
});
et(I, "visible", !0, (0, ut.getBooleanValidator)());
et(I, "transformsEnabled", "all", (0, ut.getStringValidator)());
et(I, "size");
et(I, "dragBoundFunc");
et(I, "draggable", !1, (0, ut.getBooleanValidator)());
We.Factory.backCompat(I, {
  rotateDeg: "rotate",
  setRotationDeg: "setRotation",
  getRotationDeg: "getRotation"
});
var ie = {};
Object.defineProperty(ie, "__esModule", { value: !0 });
ie.Container = void 0;
const ke = U, fn = at, yi = N;
class ne extends fn.Node {
  constructor() {
    super(...arguments), this.children = [];
  }
  getChildren(t) {
    const e = this.children || [];
    return t ? e.filter(t) : e;
  }
  hasChildren() {
    return this.getChildren().length > 0;
  }
  removeChildren() {
    return this.getChildren().forEach((t) => {
      t.parent = null, t.index = 0, t.remove();
    }), this.children = [], this._requestDraw(), this;
  }
  destroyChildren() {
    return this.getChildren().forEach((t) => {
      t.parent = null, t.index = 0, t.destroy();
    }), this.children = [], this._requestDraw(), this;
  }
  add(...t) {
    if (t.length === 0)
      return this;
    if (t.length > 1) {
      for (let i = 0; i < t.length; i++)
        this.add(t[i]);
      return this;
    }
    const e = t[0];
    return e.getParent() ? (e.moveTo(this), this) : (this._validateAdd(e), e.index = this.getChildren().length, e.parent = this, e._clearCaches(), this.getChildren().push(e), this._fire("add", {
      child: e
    }), this._requestDraw(), this);
  }
  destroy() {
    return this.hasChildren() && this.destroyChildren(), super.destroy(), this;
  }
  find(t) {
    return this._generalFind(t, !1);
  }
  findOne(t) {
    const e = this._generalFind(t, !0);
    return e.length > 0 ? e[0] : void 0;
  }
  _generalFind(t, e) {
    const i = [];
    return this._descendants((n) => {
      const r = n._isMatch(t);
      return r && i.push(n), !!(r && e);
    }), i;
  }
  _descendants(t) {
    let e = !1;
    const i = this.getChildren();
    for (const n of i) {
      if (e = t(n), e)
        return !0;
      if (n.hasChildren() && (e = n._descendants(t), e))
        return !0;
    }
    return !1;
  }
  toObject() {
    const t = fn.Node.prototype.toObject.call(this);
    return t.children = [], this.getChildren().forEach((e) => {
      t.children.push(e.toObject());
    }), t;
  }
  isAncestorOf(t) {
    let e = t.getParent();
    for (; e; ) {
      if (e._id === this._id)
        return !0;
      e = e.getParent();
    }
    return !1;
  }
  clone(t) {
    const e = fn.Node.prototype.clone.call(this, t);
    return this.getChildren().forEach(function(i) {
      e.add(i.clone());
    }), e;
  }
  getAllIntersections(t) {
    const e = [];
    return this.find("Shape").forEach((i) => {
      i.isVisible() && i.intersects(t) && e.push(i);
    }), e;
  }
  _clearSelfAndDescendantCache(t) {
    var e;
    super._clearSelfAndDescendantCache(t), !this.isCached() && ((e = this.children) === null || e === void 0 || e.forEach(function(i) {
      i._clearSelfAndDescendantCache(t);
    }));
  }
  _setChildrenIndices() {
    var t;
    (t = this.children) === null || t === void 0 || t.forEach(function(e, i) {
      e.index = i;
    }), this._requestDraw();
  }
  drawScene(t, e, i) {
    const n = this.getLayer(), r = t || n && n.getCanvas(), s = r && r.getContext(), o = this._getCanvasCache(), l = o && o.scene, d = r && r.isCache;
    if (!this.isVisible() && !d)
      return this;
    if (l) {
      s.save();
      const c = this.getAbsoluteTransform(e).getMatrix();
      s.transform(c[0], c[1], c[2], c[3], c[4], c[5]), this._drawCachedSceneCanvas(s), s.restore();
    } else
      this._drawChildren("drawScene", r, e, i);
    return this;
  }
  drawHit(t, e) {
    if (!this.shouldDrawHit(e))
      return this;
    const i = this.getLayer(), n = t || i && i.hitCanvas, r = n && n.getContext(), s = this._getCanvasCache();
    if (s && s.hit) {
      r.save();
      const l = this.getAbsoluteTransform(e).getMatrix();
      r.transform(l[0], l[1], l[2], l[3], l[4], l[5]), this._drawCachedHitCanvas(r), r.restore();
    } else
      this._drawChildren("drawHit", n, e);
    return this;
  }
  _drawChildren(t, e, i, n) {
    var r;
    const s = e && e.getContext(), o = this.clipWidth(), l = this.clipHeight(), d = this.clipFunc(), c = typeof o == "number" && typeof l == "number" || d, p = i === this;
    if (c) {
      s.save();
      const g = this.getAbsoluteTransform(i);
      let u = g.getMatrix();
      s.transform(u[0], u[1], u[2], u[3], u[4], u[5]), s.beginPath();
      let _;
      if (d)
        _ = d.call(this, s, this);
      else {
        const y = this.clipX(), v = this.clipY();
        s.rect(y || 0, v || 0, o, l);
      }
      s.clip.apply(s, _), u = g.copy().invert().getMatrix(), s.transform(u[0], u[1], u[2], u[3], u[4], u[5]);
    }
    const f = !p && this.globalCompositeOperation() !== "source-over" && t === "drawScene";
    f && (s.save(), s._applyGlobalCompositeOperation(this)), (r = this.children) === null || r === void 0 || r.forEach(function(g) {
      g[t](e, i, n);
    }), f && s.restore(), c && s.restore();
  }
  getClientRect(t = {}) {
    var e;
    const i = t.skipTransform, n = t.relativeTo;
    let r, s, o, l, d = {
      x: 1 / 0,
      y: 1 / 0,
      width: 0,
      height: 0
    };
    const c = this;
    (e = this.children) === null || e === void 0 || e.forEach(function(g) {
      if (!g.visible())
        return;
      const u = g.getClientRect({
        relativeTo: c,
        skipShadow: t.skipShadow,
        skipStroke: t.skipStroke
      });
      u.width === 0 && u.height === 0 || (r === void 0 ? (r = u.x, s = u.y, o = u.x + u.width, l = u.y + u.height) : (r = Math.min(r, u.x), s = Math.min(s, u.y), o = Math.max(o, u.x + u.width), l = Math.max(l, u.y + u.height)));
    });
    const p = this.find("Shape");
    let f = !1;
    for (let g = 0; g < p.length; g++)
      if (p[g]._isVisible(this)) {
        f = !0;
        break;
      }
    return f && r !== void 0 ? d = {
      x: r,
      y: s,
      width: o - r,
      height: l - s
    } : d = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, i ? d : this._transformedRect(d, n);
  }
}
ie.Container = ne;
ke.Factory.addComponentsGetterSetter(ne, "clip", [
  "x",
  "y",
  "width",
  "height"
]);
ke.Factory.addGetterSetter(ne, "clipX", void 0, (0, yi.getNumberValidator)());
ke.Factory.addGetterSetter(ne, "clipY", void 0, (0, yi.getNumberValidator)());
ke.Factory.addGetterSetter(ne, "clipWidth", void 0, (0, yi.getNumberValidator)());
ke.Factory.addGetterSetter(ne, "clipHeight", void 0, (0, yi.getNumberValidator)());
ke.Factory.addGetterSetter(ne, "clipFunc");
var Ba = {}, Ut = {};
Object.defineProperty(Ut, "__esModule", { value: !0 });
Ut.getCapturedShape = El;
Ut.createEvent = Kn;
Ut.hasPointerCapture = Ll;
Ut.setPointerCapture = Vl;
Ut.releaseCapture = za;
const Pl = B, Ue = /* @__PURE__ */ new Map(), Ua = Pl.Konva._global.PointerEvent !== void 0;
function El(a) {
  return Ue.get(a);
}
function Kn(a) {
  return {
    evt: a,
    pointerId: a.pointerId
  };
}
function Ll(a, t) {
  return Ue.get(a) === t;
}
function Vl(a, t) {
  za(a), t.getStage() && (Ue.set(a, t), Ua && t._fire("gotpointercapture", Kn(new PointerEvent("gotpointercapture"))));
}
function za(a, t) {
  const e = Ue.get(a);
  if (!e)
    return;
  const i = e.getStage();
  i && i.content, Ue.delete(a), Ua && e._fire("lostpointercapture", Kn(new PointerEvent("lostpointercapture")));
}
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Stage = a.stages = void 0;
  const t = ot, e = U, i = ie, n = B, r = wt, s = _i, o = B, l = Ut, d = "Stage", c = "string", p = "px", f = "mouseout", g = "mouseleave", u = "mouseover", _ = "mouseenter", y = "mousemove", v = "mousedown", w = "mouseup", h = "pointermove", m = "pointerdown", b = "pointerup", A = "pointercancel", M = "lostpointercapture", C = "pointerout", k = "pointerleave", x = "pointerover", P = "pointerenter", E = "contextmenu", T = "touchstart", O = "touchend", $ = "touchmove", Z = "touchcancel", H = "wheel", D = 5, j = [
    [_, "_pointerenter"],
    [v, "_pointerdown"],
    [y, "_pointermove"],
    [w, "_pointerup"],
    [g, "_pointerleave"],
    [T, "_pointerdown"],
    [$, "_pointermove"],
    [O, "_pointerup"],
    [Z, "_pointercancel"],
    [u, "_pointerover"],
    [H, "_wheel"],
    [E, "_contextmenu"],
    [m, "_pointerdown"],
    [h, "_pointermove"],
    [b, "_pointerup"],
    [A, "_pointercancel"],
    [k, "_pointerleave"],
    [M, "_lostpointercapture"]
  ], G = {
    mouse: {
      [C]: f,
      [k]: g,
      [x]: u,
      [P]: _,
      [h]: y,
      [m]: v,
      [b]: w,
      [A]: "mousecancel",
      pointerclick: "click",
      pointerdblclick: "dblclick"
    },
    touch: {
      [C]: "touchout",
      [k]: "touchleave",
      [x]: "touchover",
      [P]: "touchenter",
      [h]: $,
      [m]: T,
      [b]: O,
      [A]: Z,
      pointerclick: "tap",
      pointerdblclick: "dbltap"
    },
    pointer: {
      [C]: C,
      [k]: k,
      [x]: x,
      [P]: P,
      [h]: h,
      [m]: m,
      [b]: b,
      [A]: A,
      pointerclick: "pointerclick",
      pointerdblclick: "pointerdblclick"
    }
  }, R = (yt) => yt.indexOf("pointer") >= 0 ? "pointer" : yt.indexOf("touch") >= 0 ? "touch" : "mouse", K = (yt) => {
    const S = R(yt);
    if (S === "pointer")
      return n.Konva.pointerEventsEnabled && G.pointer;
    if (S === "touch")
      return G.touch;
    if (S === "mouse")
      return G.mouse;
  };
  function st(yt = {}) {
    return (yt.clipFunc || yt.clipWidth || yt.clipHeight) && t.Util.warn("Stage does not support clipping. Please use clip for Layers or Groups."), yt;
  }
  const he = "Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);";
  a.stages = [];
  class kt extends i.Container {
    constructor(S) {
      super(st(S)), this._pointerPositions = [], this._changedPointerPositions = [], this._buildDOM(), this._bindContentEvents(), a.stages.push(this), this.on("widthChange.konva heightChange.konva", this._resizeDOM), this.on("visibleChange.konva", this._checkVisibility), this.on("clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva", () => {
        st(this.attrs);
      }), this._checkVisibility();
    }
    _validateAdd(S) {
      const L = S.getType() === "Layer", F = S.getType() === "FastLayer";
      L || F || t.Util.throw("You may only add layers to the stage.");
    }
    _checkVisibility() {
      if (!this.content)
        return;
      const S = this.visible() ? "" : "none";
      this.content.style.display = S;
    }
    setContainer(S) {
      if (typeof S === c) {
        let L;
        if (S.charAt(0) === ".") {
          const F = S.slice(1);
          S = document.getElementsByClassName(F)[0];
        } else
          S.charAt(0) !== "#" ? L = S : L = S.slice(1), S = document.getElementById(L);
        if (!S)
          throw "Can not find container in document with id " + L;
      }
      return this._setAttr("container", S), this.content && (this.content.parentElement && this.content.parentElement.removeChild(this.content), S.appendChild(this.content)), this;
    }
    shouldDrawHit() {
      return !0;
    }
    clear() {
      const S = this.children, L = S.length;
      for (let F = 0; F < L; F++)
        S[F].clear();
      return this;
    }
    clone(S) {
      return S || (S = {}), S.container = typeof document < "u" && document.createElement("div"), i.Container.prototype.clone.call(this, S);
    }
    destroy() {
      super.destroy();
      const S = this.content;
      S && t.Util._isInDocument(S) && this.container().removeChild(S);
      const L = a.stages.indexOf(this);
      return L > -1 && a.stages.splice(L, 1), t.Util.releaseCanvas(this.bufferCanvas._canvas, this.bufferHitCanvas._canvas), this;
    }
    getPointerPosition() {
      const S = this._pointerPositions[0] || this._changedPointerPositions[0];
      return S ? {
        x: S.x,
        y: S.y
      } : (t.Util.warn(he), null);
    }
    _getPointerById(S) {
      return this._pointerPositions.find((L) => L.id === S);
    }
    getPointersPositions() {
      return this._pointerPositions;
    }
    getStage() {
      return this;
    }
    getContent() {
      return this.content;
    }
    _toKonvaCanvas(S) {
      S = S || {}, S.x = S.x || 0, S.y = S.y || 0, S.width = S.width || this.width(), S.height = S.height || this.height();
      const L = new r.SceneCanvas({
        width: S.width,
        height: S.height,
        pixelRatio: S.pixelRatio || 1
      }), F = L.getContext()._context, nt = this.children;
      return (S.x || S.y) && F.translate(-1 * S.x, -1 * S.y), nt.forEach(function(Q) {
        if (!Q.isVisible())
          return;
        const ht = Q._toKonvaCanvas(S);
        F.drawImage(ht._canvas, S.x, S.y, ht.getWidth() / ht.getPixelRatio(), ht.getHeight() / ht.getPixelRatio());
      }), L;
    }
    getIntersection(S) {
      if (!S)
        return null;
      const L = this.children, F = L.length, nt = F - 1;
      for (let Q = nt; Q >= 0; Q--) {
        const ht = L[Q].getIntersection(S);
        if (ht)
          return ht;
      }
      return null;
    }
    _resizeDOM() {
      const S = this.width(), L = this.height();
      this.content && (this.content.style.width = S + p, this.content.style.height = L + p), this.bufferCanvas.setSize(S, L), this.bufferHitCanvas.setSize(S, L), this.children.forEach((F) => {
        F.setSize({ width: S, height: L }), F.draw();
      });
    }
    add(S, ...L) {
      if (arguments.length > 1) {
        for (let nt = 0; nt < arguments.length; nt++)
          this.add(arguments[nt]);
        return this;
      }
      super.add(S);
      const F = this.children.length;
      return F > D && t.Util.warn("The stage has " + F + " layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group."), S.setSize({ width: this.width(), height: this.height() }), S.draw(), n.Konva.isBrowser && this.content.appendChild(S.canvas._canvas), this;
    }
    getParent() {
      return null;
    }
    getLayer() {
      return null;
    }
    hasPointerCapture(S) {
      return l.hasPointerCapture(S, this);
    }
    setPointerCapture(S) {
      l.setPointerCapture(S, this);
    }
    releaseCapture(S) {
      l.releaseCapture(S, this);
    }
    getLayers() {
      return this.children;
    }
    _bindContentEvents() {
      n.Konva.isBrowser && j.forEach(([S, L]) => {
        this.content.addEventListener(S, (F) => {
          this[L](F);
        }, { passive: !1 });
      });
    }
    _pointerenter(S) {
      this.setPointersPositions(S);
      const L = K(S.type);
      L && this._fire(L.pointerenter, {
        evt: S,
        target: this,
        currentTarget: this
      });
    }
    _pointerover(S) {
      this.setPointersPositions(S);
      const L = K(S.type);
      L && this._fire(L.pointerover, {
        evt: S,
        target: this,
        currentTarget: this
      });
    }
    _getTargetShape(S) {
      let L = this[S + "targetShape"];
      return L && !L.getStage() && (L = null), L;
    }
    _pointerleave(S) {
      const L = K(S.type), F = R(S.type);
      if (!L)
        return;
      this.setPointersPositions(S);
      const nt = this._getTargetShape(F), Q = !(n.Konva.isDragging() || n.Konva.isTransforming()) || n.Konva.hitOnDragEnabled;
      nt && Q ? (nt._fireAndBubble(L.pointerout, { evt: S }), nt._fireAndBubble(L.pointerleave, { evt: S }), this._fire(L.pointerleave, {
        evt: S,
        target: this,
        currentTarget: this
      }), this[F + "targetShape"] = null) : Q && (this._fire(L.pointerleave, {
        evt: S,
        target: this,
        currentTarget: this
      }), this._fire(L.pointerout, {
        evt: S,
        target: this,
        currentTarget: this
      })), this.pointerPos = null, this._pointerPositions = [];
    }
    _pointerdown(S) {
      const L = K(S.type), F = R(S.type);
      if (!L)
        return;
      this.setPointersPositions(S);
      let nt = !1;
      this._changedPointerPositions.forEach((Q) => {
        const ht = this.getIntersection(Q);
        if (s.DD.justDragged = !1, n.Konva["_" + F + "ListenClick"] = !0, !ht || !ht.isListening()) {
          this[F + "ClickStartShape"] = void 0;
          return;
        }
        n.Konva.capturePointerEventsEnabled && ht.setPointerCapture(Q.id), this[F + "ClickStartShape"] = ht, ht._fireAndBubble(L.pointerdown, {
          evt: S,
          pointerId: Q.id
        }), nt = !0;
        const bt = S.type.indexOf("touch") >= 0;
        ht.preventDefault() && S.cancelable && bt && S.preventDefault();
      }), nt || this._fire(L.pointerdown, {
        evt: S,
        target: this,
        currentTarget: this,
        pointerId: this._pointerPositions[0].id
      });
    }
    _pointermove(S) {
      const L = K(S.type), F = R(S.type);
      if (!L || (n.Konva.isDragging() && s.DD.node.preventDefault() && S.cancelable && S.preventDefault(), this.setPointersPositions(S), !(!(n.Konva.isDragging() || n.Konva.isTransforming()) || n.Konva.hitOnDragEnabled)))
        return;
      const Q = {};
      let ht = !1;
      const bt = this._getTargetShape(F);
      this._changedPointerPositions.forEach((Ft) => {
        const it = l.getCapturedShape(Ft.id) || this.getIntersection(Ft), ce = Ft.id, Pt = { evt: S, pointerId: ce }, ue = bt !== it;
        if (ue && bt && (bt._fireAndBubble(L.pointerout, { ...Pt }, it), bt._fireAndBubble(L.pointerleave, { ...Pt }, it)), it) {
          if (Q[it._id])
            return;
          Q[it._id] = !0;
        }
        it && it.isListening() ? (ht = !0, ue && (it._fireAndBubble(L.pointerover, { ...Pt }, bt), it._fireAndBubble(L.pointerenter, { ...Pt }, bt), this[F + "targetShape"] = it), it._fireAndBubble(L.pointermove, { ...Pt })) : bt && (this._fire(L.pointerover, {
          evt: S,
          target: this,
          currentTarget: this,
          pointerId: ce
        }), this[F + "targetShape"] = null);
      }), ht || this._fire(L.pointermove, {
        evt: S,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id
      });
    }
    _pointerup(S) {
      const L = K(S.type), F = R(S.type);
      if (!L)
        return;
      this.setPointersPositions(S);
      const nt = this[F + "ClickStartShape"], Q = this[F + "ClickEndShape"], ht = {};
      let bt = !1;
      this._changedPointerPositions.forEach((Ft) => {
        const it = l.getCapturedShape(Ft.id) || this.getIntersection(Ft);
        if (it) {
          if (it.releaseCapture(Ft.id), ht[it._id])
            return;
          ht[it._id] = !0;
        }
        const ce = Ft.id, Pt = { evt: S, pointerId: ce };
        let ue = !1;
        n.Konva["_" + F + "InDblClickWindow"] ? (ue = !0, clearTimeout(this[F + "DblTimeout"])) : s.DD.justDragged || (n.Konva["_" + F + "InDblClickWindow"] = !0, clearTimeout(this[F + "DblTimeout"])), this[F + "DblTimeout"] = setTimeout(function() {
          n.Konva["_" + F + "InDblClickWindow"] = !1;
        }, n.Konva.dblClickWindow), it && it.isListening() ? (bt = !0, this[F + "ClickEndShape"] = it, it._fireAndBubble(L.pointerup, { ...Pt }), n.Konva["_" + F + "ListenClick"] && nt && nt === it && (it._fireAndBubble(L.pointerclick, { ...Pt }), ue && Q && Q === it && it._fireAndBubble(L.pointerdblclick, { ...Pt }))) : (this[F + "ClickEndShape"] = null, n.Konva["_" + F + "ListenClick"] && this._fire(L.pointerclick, {
          evt: S,
          target: this,
          currentTarget: this,
          pointerId: ce
        }), ue && this._fire(L.pointerdblclick, {
          evt: S,
          target: this,
          currentTarget: this,
          pointerId: ce
        }));
      }), bt || this._fire(L.pointerup, {
        evt: S,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id
      }), n.Konva["_" + F + "ListenClick"] = !1, S.cancelable && F !== "touch" && F !== "pointer" && S.preventDefault();
    }
    _contextmenu(S) {
      this.setPointersPositions(S);
      const L = this.getIntersection(this.getPointerPosition());
      L && L.isListening() ? L._fireAndBubble(E, { evt: S }) : this._fire(E, {
        evt: S,
        target: this,
        currentTarget: this
      });
    }
    _wheel(S) {
      this.setPointersPositions(S);
      const L = this.getIntersection(this.getPointerPosition());
      L && L.isListening() ? L._fireAndBubble(H, { evt: S }) : this._fire(H, {
        evt: S,
        target: this,
        currentTarget: this
      });
    }
    _pointercancel(S) {
      this.setPointersPositions(S);
      const L = l.getCapturedShape(S.pointerId) || this.getIntersection(this.getPointerPosition());
      L && L._fireAndBubble(b, l.createEvent(S)), l.releaseCapture(S.pointerId);
    }
    _lostpointercapture(S) {
      l.releaseCapture(S.pointerId);
    }
    setPointersPositions(S) {
      const L = this._getContentPosition();
      let F = null, nt = null;
      S = S || window.event, S.touches !== void 0 ? (this._pointerPositions = [], this._changedPointerPositions = [], Array.prototype.forEach.call(S.touches, (Q) => {
        this._pointerPositions.push({
          id: Q.identifier,
          x: (Q.clientX - L.left) / L.scaleX,
          y: (Q.clientY - L.top) / L.scaleY
        });
      }), Array.prototype.forEach.call(S.changedTouches || S.touches, (Q) => {
        this._changedPointerPositions.push({
          id: Q.identifier,
          x: (Q.clientX - L.left) / L.scaleX,
          y: (Q.clientY - L.top) / L.scaleY
        });
      })) : (F = (S.clientX - L.left) / L.scaleX, nt = (S.clientY - L.top) / L.scaleY, this.pointerPos = {
        x: F,
        y: nt
      }, this._pointerPositions = [{ x: F, y: nt, id: t.Util._getFirstPointerId(S) }], this._changedPointerPositions = [
        { x: F, y: nt, id: t.Util._getFirstPointerId(S) }
      ]);
    }
    _setPointerPosition(S) {
      t.Util.warn('Method _setPointerPosition is deprecated. Use "stage.setPointersPositions(event)" instead.'), this.setPointersPositions(S);
    }
    _getContentPosition() {
      if (!this.content || !this.content.getBoundingClientRect)
        return {
          top: 0,
          left: 0,
          scaleX: 1,
          scaleY: 1
        };
      const S = this.content.getBoundingClientRect();
      return {
        top: S.top,
        left: S.left,
        scaleX: S.width / this.content.clientWidth || 1,
        scaleY: S.height / this.content.clientHeight || 1
      };
    }
    _buildDOM() {
      if (this.bufferCanvas = new r.SceneCanvas({
        width: this.width(),
        height: this.height()
      }), this.bufferHitCanvas = new r.HitCanvas({
        pixelRatio: 1,
        width: this.width(),
        height: this.height()
      }), !n.Konva.isBrowser)
        return;
      const S = this.container();
      if (!S)
        throw "Stage has no container. A container is required.";
      S.innerHTML = "", this.content = document.createElement("div"), this.content.style.position = "relative", this.content.style.userSelect = "none", this.content.className = "konvajs-content", this.content.setAttribute("role", "presentation"), S.appendChild(this.content), this._resizeDOM();
    }
    cache() {
      return t.Util.warn("Cache function is not allowed for stage. You may use cache only for layers, groups and shapes."), this;
    }
    clearCache() {
      return this;
    }
    batchDraw() {
      return this.getChildren().forEach(function(S) {
        S.batchDraw();
      }), this;
    }
  }
  a.Stage = kt, kt.prototype.nodeType = d, (0, o._registerNode)(kt), e.Factory.addGetterSetter(kt, "container"), n.Konva.isBrowser && document.addEventListener("visibilitychange", () => {
    a.stages.forEach((yt) => {
      yt.batchDraw();
    });
  });
})(Ba);
var Ke = {}, ft = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Shape = a.shapes = void 0;
  const t = B, e = ot, i = U, n = at, r = N, s = B, o = Ut, l = "hasShadow", d = "shadowRGBA", c = "patternImage", p = "linearGradient", f = "radialGradient";
  let g;
  function u() {
    return g || (g = e.Util.createCanvasElement().getContext("2d"), g);
  }
  a.shapes = {};
  function _(k) {
    const x = this.attrs.fillRule;
    x ? k.fill(x) : k.fill();
  }
  function y(k) {
    k.stroke();
  }
  function v(k) {
    const x = this.attrs.fillRule;
    x ? k.fill(x) : k.fill();
  }
  function w(k) {
    k.stroke();
  }
  function h() {
    this._clearCache(l);
  }
  function m() {
    this._clearCache(d);
  }
  function b() {
    this._clearCache(c);
  }
  function A() {
    this._clearCache(p);
  }
  function M() {
    this._clearCache(f);
  }
  class C extends n.Node {
    constructor(x) {
      super(x);
      let P;
      for (; P = e.Util.getRandomColor(), !(P && !(P in a.shapes)); )
        ;
      this.colorKey = P, a.shapes[P] = this;
    }
    getContext() {
      return e.Util.warn("shape.getContext() method is deprecated. Please do not use it."), this.getLayer().getContext();
    }
    getCanvas() {
      return e.Util.warn("shape.getCanvas() method is deprecated. Please do not use it."), this.getLayer().getCanvas();
    }
    getSceneFunc() {
      return this.attrs.sceneFunc || this._sceneFunc;
    }
    getHitFunc() {
      return this.attrs.hitFunc || this._hitFunc;
    }
    hasShadow() {
      return this._getCache(l, this._hasShadow);
    }
    _hasShadow() {
      return this.shadowEnabled() && this.shadowOpacity() !== 0 && !!(this.shadowColor() || this.shadowBlur() || this.shadowOffsetX() || this.shadowOffsetY());
    }
    _getFillPattern() {
      return this._getCache(c, this.__getFillPattern);
    }
    __getFillPattern() {
      if (this.fillPatternImage()) {
        const P = u().createPattern(this.fillPatternImage(), this.fillPatternRepeat() || "repeat");
        if (P && P.setTransform) {
          const E = new e.Transform();
          E.translate(this.fillPatternX(), this.fillPatternY()), E.rotate(t.Konva.getAngle(this.fillPatternRotation())), E.scale(this.fillPatternScaleX(), this.fillPatternScaleY()), E.translate(-1 * this.fillPatternOffsetX(), -1 * this.fillPatternOffsetY());
          const T = E.getMatrix(), O = typeof DOMMatrix > "u" ? {
            a: T[0],
            b: T[1],
            c: T[2],
            d: T[3],
            e: T[4],
            f: T[5]
          } : new DOMMatrix(T);
          P.setTransform(O);
        }
        return P;
      }
    }
    _getLinearGradient() {
      return this._getCache(p, this.__getLinearGradient);
    }
    __getLinearGradient() {
      const x = this.fillLinearGradientColorStops();
      if (x) {
        const P = u(), E = this.fillLinearGradientStartPoint(), T = this.fillLinearGradientEndPoint(), O = P.createLinearGradient(E.x, E.y, T.x, T.y);
        for (let $ = 0; $ < x.length; $ += 2)
          O.addColorStop(x[$], x[$ + 1]);
        return O;
      }
    }
    _getRadialGradient() {
      return this._getCache(f, this.__getRadialGradient);
    }
    __getRadialGradient() {
      const x = this.fillRadialGradientColorStops();
      if (x) {
        const P = u(), E = this.fillRadialGradientStartPoint(), T = this.fillRadialGradientEndPoint(), O = P.createRadialGradient(E.x, E.y, this.fillRadialGradientStartRadius(), T.x, T.y, this.fillRadialGradientEndRadius());
        for (let $ = 0; $ < x.length; $ += 2)
          O.addColorStop(x[$], x[$ + 1]);
        return O;
      }
    }
    getShadowRGBA() {
      return this._getCache(d, this._getShadowRGBA);
    }
    _getShadowRGBA() {
      if (!this.hasShadow())
        return;
      const x = e.Util.colorToRGBA(this.shadowColor());
      if (x)
        return "rgba(" + x.r + "," + x.g + "," + x.b + "," + x.a * (this.shadowOpacity() || 1) + ")";
    }
    hasFill() {
      return this._calculate("hasFill", [
        "fillEnabled",
        "fill",
        "fillPatternImage",
        "fillLinearGradientColorStops",
        "fillRadialGradientColorStops"
      ], () => this.fillEnabled() && !!(this.fill() || this.fillPatternImage() || this.fillLinearGradientColorStops() || this.fillRadialGradientColorStops()));
    }
    hasStroke() {
      return this._calculate("hasStroke", [
        "strokeEnabled",
        "strokeWidth",
        "stroke",
        "strokeLinearGradientColorStops"
      ], () => this.strokeEnabled() && this.strokeWidth() && !!(this.stroke() || this.strokeLinearGradientColorStops()));
    }
    hasHitStroke() {
      const x = this.hitStrokeWidth();
      return x === "auto" ? this.hasStroke() : this.strokeEnabled() && !!x;
    }
    intersects(x) {
      const P = this.getStage();
      if (!P)
        return !1;
      const E = P.bufferHitCanvas;
      return E.getContext().clear(), this.drawHit(E, void 0, !0), E.context.getImageData(Math.round(x.x), Math.round(x.y), 1, 1).data[3] > 0;
    }
    destroy() {
      return n.Node.prototype.destroy.call(this), delete a.shapes[this.colorKey], delete this.colorKey, this;
    }
    _useBufferCanvas(x) {
      var P;
      if (!((P = this.attrs.perfectDrawEnabled) !== null && P !== void 0 ? P : !0))
        return !1;
      const T = x || this.hasFill(), O = this.hasStroke(), $ = this.getAbsoluteOpacity() !== 1;
      if (T && O && $)
        return !0;
      const Z = this.hasShadow(), H = this.shadowForStrokeEnabled();
      return !!(T && O && Z && H);
    }
    setStrokeHitEnabled(x) {
      e.Util.warn("strokeHitEnabled property is deprecated. Please use hitStrokeWidth instead."), x ? this.hitStrokeWidth("auto") : this.hitStrokeWidth(0);
    }
    getStrokeHitEnabled() {
      return this.hitStrokeWidth() !== 0;
    }
    getSelfRect() {
      const x = this.size();
      return {
        x: this._centroid ? -x.width / 2 : 0,
        y: this._centroid ? -x.height / 2 : 0,
        width: x.width,
        height: x.height
      };
    }
    getClientRect(x = {}) {
      let P = !1, E = this.getParent();
      for (; E; ) {
        if (E.isCached()) {
          P = !0;
          break;
        }
        E = E.getParent();
      }
      const T = x.skipTransform, O = x.relativeTo || P && this.getStage() || void 0, $ = this.getSelfRect(), H = !x.skipStroke && this.hasStroke() && this.strokeWidth() || 0, D = $.width + H, j = $.height + H, G = !x.skipShadow && this.hasShadow(), R = G ? this.shadowOffsetX() : 0, K = G ? this.shadowOffsetY() : 0, st = D + Math.abs(R), he = j + Math.abs(K), kt = G && this.shadowBlur() || 0, yt = st + kt * 2, S = he + kt * 2, L = {
        width: yt,
        height: S,
        x: -(H / 2 + kt) + Math.min(R, 0) + $.x,
        y: -(H / 2 + kt) + Math.min(K, 0) + $.y
      };
      return T ? L : this._transformedRect(L, O);
    }
    drawScene(x, P, E) {
      const T = this.getLayer(), O = x || T.getCanvas(), $ = O.getContext(), Z = this._getCanvasCache(), H = this.getSceneFunc(), D = this.hasShadow();
      let j;
      const G = P === this;
      if (!this.isVisible() && !G)
        return this;
      if (Z) {
        $.save();
        const R = this.getAbsoluteTransform(P).getMatrix();
        return $.transform(R[0], R[1], R[2], R[3], R[4], R[5]), this._drawCachedSceneCanvas($), $.restore(), this;
      }
      if (!H)
        return this;
      if ($.save(), this._useBufferCanvas()) {
        j = this.getStage();
        const R = E || j.bufferCanvas, K = R.getContext();
        K.clear(), K.save(), K._applyLineJoin(this);
        const st = this.getAbsoluteTransform(P).getMatrix();
        K.transform(st[0], st[1], st[2], st[3], st[4], st[5]), H.call(this, K, this), K.restore();
        const he = R.pixelRatio;
        D && $._applyShadow(this), $._applyOpacity(this), $._applyGlobalCompositeOperation(this), $.drawImage(R._canvas, R.x || 0, R.y || 0, R.width / he, R.height / he);
      } else {
        if ($._applyLineJoin(this), !G) {
          const R = this.getAbsoluteTransform(P).getMatrix();
          $.transform(R[0], R[1], R[2], R[3], R[4], R[5]), $._applyOpacity(this), $._applyGlobalCompositeOperation(this);
        }
        D && $._applyShadow(this), H.call(this, $, this);
      }
      return $.restore(), this;
    }
    drawHit(x, P, E = !1) {
      if (!this.shouldDrawHit(P, E))
        return this;
      const T = this.getLayer(), O = x || T.hitCanvas, $ = O && O.getContext(), Z = this.hitFunc() || this.sceneFunc(), H = this._getCanvasCache(), D = H && H.hit;
      if (this.colorKey || e.Util.warn("Looks like your canvas has a destroyed shape in it. Do not reuse shape after you destroyed it. If you want to reuse shape you should call remove() instead of destroy()"), D) {
        $.save();
        const G = this.getAbsoluteTransform(P).getMatrix();
        return $.transform(G[0], G[1], G[2], G[3], G[4], G[5]), this._drawCachedHitCanvas($), $.restore(), this;
      }
      if (!Z)
        return this;
      if ($.save(), $._applyLineJoin(this), !(this === P)) {
        const G = this.getAbsoluteTransform(P).getMatrix();
        $.transform(G[0], G[1], G[2], G[3], G[4], G[5]);
      }
      return Z.call(this, $, this), $.restore(), this;
    }
    drawHitFromCache(x = 0) {
      const P = this._getCanvasCache(), E = this._getCachedSceneCanvas(), T = P.hit, O = T.getContext(), $ = T.getWidth(), Z = T.getHeight();
      O.clear(), O.drawImage(E._canvas, 0, 0, $, Z);
      try {
        const H = O.getImageData(0, 0, $, Z), D = H.data, j = D.length, G = e.Util._hexToRgb(this.colorKey);
        for (let R = 0; R < j; R += 4)
          D[R + 3] > x ? (D[R] = G.r, D[R + 1] = G.g, D[R + 2] = G.b, D[R + 3] = 255) : D[R + 3] = 0;
        O.putImageData(H, 0, 0);
      } catch (H) {
        e.Util.error("Unable to draw hit graph from cached scene canvas. " + H.message);
      }
      return this;
    }
    hasPointerCapture(x) {
      return o.hasPointerCapture(x, this);
    }
    setPointerCapture(x) {
      o.setPointerCapture(x, this);
    }
    releaseCapture(x) {
      o.releaseCapture(x, this);
    }
  }
  a.Shape = C, C.prototype._fillFunc = _, C.prototype._strokeFunc = y, C.prototype._fillFuncHit = v, C.prototype._strokeFuncHit = w, C.prototype._centroid = !1, C.prototype.nodeType = "Shape", (0, s._registerNode)(C), C.prototype.eventListeners = {}, C.prototype.on.call(C.prototype, "shadowColorChange.konva shadowBlurChange.konva shadowOffsetChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", h), C.prototype.on.call(C.prototype, "shadowColorChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", m), C.prototype.on.call(C.prototype, "fillPriorityChange.konva fillPatternImageChange.konva fillPatternRepeatChange.konva fillPatternScaleXChange.konva fillPatternScaleYChange.konva fillPatternOffsetXChange.konva fillPatternOffsetYChange.konva fillPatternXChange.konva fillPatternYChange.konva fillPatternRotationChange.konva", b), C.prototype.on.call(C.prototype, "fillPriorityChange.konva fillLinearGradientColorStopsChange.konva fillLinearGradientStartPointXChange.konva fillLinearGradientStartPointYChange.konva fillLinearGradientEndPointXChange.konva fillLinearGradientEndPointYChange.konva", A), C.prototype.on.call(C.prototype, "fillPriorityChange.konva fillRadialGradientColorStopsChange.konva fillRadialGradientStartPointXChange.konva fillRadialGradientStartPointYChange.konva fillRadialGradientEndPointXChange.konva fillRadialGradientEndPointYChange.konva fillRadialGradientStartRadiusChange.konva fillRadialGradientEndRadiusChange.konva", M), i.Factory.addGetterSetter(C, "stroke", void 0, (0, r.getStringOrGradientValidator)()), i.Factory.addGetterSetter(C, "strokeWidth", 2, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(C, "fillAfterStrokeEnabled", !1), i.Factory.addGetterSetter(C, "hitStrokeWidth", "auto", (0, r.getNumberOrAutoValidator)()), i.Factory.addGetterSetter(C, "strokeHitEnabled", !0, (0, r.getBooleanValidator)()), i.Factory.addGetterSetter(C, "perfectDrawEnabled", !0, (0, r.getBooleanValidator)()), i.Factory.addGetterSetter(C, "shadowForStrokeEnabled", !0, (0, r.getBooleanValidator)()), i.Factory.addGetterSetter(C, "lineJoin"), i.Factory.addGetterSetter(C, "lineCap"), i.Factory.addGetterSetter(C, "sceneFunc"), i.Factory.addGetterSetter(C, "hitFunc"), i.Factory.addGetterSetter(C, "dash"), i.Factory.addGetterSetter(C, "dashOffset", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(C, "shadowColor", void 0, (0, r.getStringValidator)()), i.Factory.addGetterSetter(C, "shadowBlur", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(C, "shadowOpacity", 1, (0, r.getNumberValidator)()), i.Factory.addComponentsGetterSetter(C, "shadowOffset", ["x", "y"]), i.Factory.addGetterSetter(C, "shadowOffsetX", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(C, "shadowOffsetY", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(C, "fillPatternImage"), i.Factory.addGetterSetter(C, "fill", void 0, (0, r.getStringOrGradientValidator)()), i.Factory.addGetterSetter(C, "fillPatternX", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(C, "fillPatternY", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(C, "fillLinearGradientColorStops"), i.Factory.addGetterSetter(C, "strokeLinearGradientColorStops"), i.Factory.addGetterSetter(C, "fillRadialGradientStartRadius", 0), i.Factory.addGetterSetter(C, "fillRadialGradientEndRadius", 0), i.Factory.addGetterSetter(C, "fillRadialGradientColorStops"), i.Factory.addGetterSetter(C, "fillPatternRepeat", "repeat"), i.Factory.addGetterSetter(C, "fillEnabled", !0), i.Factory.addGetterSetter(C, "strokeEnabled", !0), i.Factory.addGetterSetter(C, "shadowEnabled", !0), i.Factory.addGetterSetter(C, "dashEnabled", !0), i.Factory.addGetterSetter(C, "strokeScaleEnabled", !0), i.Factory.addGetterSetter(C, "fillPriority", "color"), i.Factory.addComponentsGetterSetter(C, "fillPatternOffset", ["x", "y"]), i.Factory.addGetterSetter(C, "fillPatternOffsetX", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(C, "fillPatternOffsetY", 0, (0, r.getNumberValidator)()), i.Factory.addComponentsGetterSetter(C, "fillPatternScale", ["x", "y"]), i.Factory.addGetterSetter(C, "fillPatternScaleX", 1, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(C, "fillPatternScaleY", 1, (0, r.getNumberValidator)()), i.Factory.addComponentsGetterSetter(C, "fillLinearGradientStartPoint", [
    "x",
    "y"
  ]), i.Factory.addComponentsGetterSetter(C, "strokeLinearGradientStartPoint", [
    "x",
    "y"
  ]), i.Factory.addGetterSetter(C, "fillLinearGradientStartPointX", 0), i.Factory.addGetterSetter(C, "strokeLinearGradientStartPointX", 0), i.Factory.addGetterSetter(C, "fillLinearGradientStartPointY", 0), i.Factory.addGetterSetter(C, "strokeLinearGradientStartPointY", 0), i.Factory.addComponentsGetterSetter(C, "fillLinearGradientEndPoint", [
    "x",
    "y"
  ]), i.Factory.addComponentsGetterSetter(C, "strokeLinearGradientEndPoint", [
    "x",
    "y"
  ]), i.Factory.addGetterSetter(C, "fillLinearGradientEndPointX", 0), i.Factory.addGetterSetter(C, "strokeLinearGradientEndPointX", 0), i.Factory.addGetterSetter(C, "fillLinearGradientEndPointY", 0), i.Factory.addGetterSetter(C, "strokeLinearGradientEndPointY", 0), i.Factory.addComponentsGetterSetter(C, "fillRadialGradientStartPoint", [
    "x",
    "y"
  ]), i.Factory.addGetterSetter(C, "fillRadialGradientStartPointX", 0), i.Factory.addGetterSetter(C, "fillRadialGradientStartPointY", 0), i.Factory.addComponentsGetterSetter(C, "fillRadialGradientEndPoint", [
    "x",
    "y"
  ]), i.Factory.addGetterSetter(C, "fillRadialGradientEndPointX", 0), i.Factory.addGetterSetter(C, "fillRadialGradientEndPointY", 0), i.Factory.addGetterSetter(C, "fillPatternRotation", 0), i.Factory.addGetterSetter(C, "fillRule", void 0, (0, r.getStringValidator)()), i.Factory.backCompat(C, {
    dashArray: "dash",
    getDashArray: "getDash",
    setDashArray: "getDash",
    drawFunc: "sceneFunc",
    getDrawFunc: "getSceneFunc",
    setDrawFunc: "setSceneFunc",
    drawHitFunc: "hitFunc",
    getDrawHitFunc: "getHitFunc",
    setDrawHitFunc: "setHitFunc"
  });
})(ft);
Object.defineProperty(Ke, "__esModule", { value: !0 });
Ke.Layer = void 0;
const Et = ot, pn = ie, fe = at, Yn = U, Hr = wt, Tl = N, $l = ft, Hl = B, Rl = "#", Ol = "beforeDraw", Fl = "draw", ja = [
  { x: 0, y: 0 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 }
], Dl = ja.length;
class Pe extends pn.Container {
  constructor(t) {
    super(t), this.canvas = new Hr.SceneCanvas(), this.hitCanvas = new Hr.HitCanvas({
      pixelRatio: 1
    }), this._waitingForDraw = !1, this.on("visibleChange.konva", this._checkVisibility), this._checkVisibility(), this.on("imageSmoothingEnabledChange.konva", this._setSmoothEnabled), this._setSmoothEnabled();
  }
  createPNGStream() {
    return this.canvas._canvas.createPNGStream();
  }
  getCanvas() {
    return this.canvas;
  }
  getNativeCanvasElement() {
    return this.canvas._canvas;
  }
  getHitCanvas() {
    return this.hitCanvas;
  }
  getContext() {
    return this.getCanvas().getContext();
  }
  clear(t) {
    return this.getContext().clear(t), this.getHitCanvas().getContext().clear(t), this;
  }
  setZIndex(t) {
    super.setZIndex(t);
    const e = this.getStage();
    return e && e.content && (e.content.removeChild(this.getNativeCanvasElement()), t < e.children.length - 1 ? e.content.insertBefore(this.getNativeCanvasElement(), e.children[t + 1].getCanvas()._canvas) : e.content.appendChild(this.getNativeCanvasElement())), this;
  }
  moveToTop() {
    fe.Node.prototype.moveToTop.call(this);
    const t = this.getStage();
    return t && t.content && (t.content.removeChild(this.getNativeCanvasElement()), t.content.appendChild(this.getNativeCanvasElement())), !0;
  }
  moveUp() {
    if (!fe.Node.prototype.moveUp.call(this))
      return !1;
    const e = this.getStage();
    return !e || !e.content ? !1 : (e.content.removeChild(this.getNativeCanvasElement()), this.index < e.children.length - 1 ? e.content.insertBefore(this.getNativeCanvasElement(), e.children[this.index + 1].getCanvas()._canvas) : e.content.appendChild(this.getNativeCanvasElement()), !0);
  }
  moveDown() {
    if (fe.Node.prototype.moveDown.call(this)) {
      const t = this.getStage();
      if (t) {
        const e = t.children;
        t.content && (t.content.removeChild(this.getNativeCanvasElement()), t.content.insertBefore(this.getNativeCanvasElement(), e[this.index + 1].getCanvas()._canvas));
      }
      return !0;
    }
    return !1;
  }
  moveToBottom() {
    if (fe.Node.prototype.moveToBottom.call(this)) {
      const t = this.getStage();
      if (t) {
        const e = t.children;
        t.content && (t.content.removeChild(this.getNativeCanvasElement()), t.content.insertBefore(this.getNativeCanvasElement(), e[1].getCanvas()._canvas));
      }
      return !0;
    }
    return !1;
  }
  getLayer() {
    return this;
  }
  remove() {
    const t = this.getNativeCanvasElement();
    return fe.Node.prototype.remove.call(this), t && t.parentNode && Et.Util._isInDocument(t) && t.parentNode.removeChild(t), this;
  }
  getStage() {
    return this.parent;
  }
  setSize({ width: t, height: e }) {
    return this.canvas.setSize(t, e), this.hitCanvas.setSize(t, e), this._setSmoothEnabled(), this;
  }
  _validateAdd(t) {
    const e = t.getType();
    e !== "Group" && e !== "Shape" && Et.Util.throw("You may only add groups and shapes to a layer.");
  }
  _toKonvaCanvas(t) {
    return t = t || {}, t.width = t.width || this.getWidth(), t.height = t.height || this.getHeight(), t.x = t.x !== void 0 ? t.x : this.x(), t.y = t.y !== void 0 ? t.y : this.y(), fe.Node.prototype._toKonvaCanvas.call(this, t);
  }
  _checkVisibility() {
    this.visible() ? this.canvas._canvas.style.display = "block" : this.canvas._canvas.style.display = "none";
  }
  _setSmoothEnabled() {
    this.getContext()._context.imageSmoothingEnabled = this.imageSmoothingEnabled();
  }
  getWidth() {
    if (this.parent)
      return this.parent.width();
  }
  setWidth() {
    Et.Util.warn('Can not change width of layer. Use "stage.width(value)" function instead.');
  }
  getHeight() {
    if (this.parent)
      return this.parent.height();
  }
  setHeight() {
    Et.Util.warn('Can not change height of layer. Use "stage.height(value)" function instead.');
  }
  batchDraw() {
    return this._waitingForDraw || (this._waitingForDraw = !0, Et.Util.requestAnimFrame(() => {
      this.draw(), this._waitingForDraw = !1;
    })), this;
  }
  getIntersection(t) {
    if (!this.isListening() || !this.isVisible())
      return null;
    let e = 1, i = !1;
    for (; ; ) {
      for (let n = 0; n < Dl; n++) {
        const r = ja[n], s = this._getIntersection({
          x: t.x + r.x * e,
          y: t.y + r.y * e
        }), o = s.shape;
        if (o)
          return o;
        if (i = !!s.antialiased, !s.antialiased)
          break;
      }
      if (i)
        e += 1;
      else
        return null;
    }
  }
  _getIntersection(t) {
    const e = this.hitCanvas.pixelRatio, i = this.hitCanvas.context.getImageData(Math.round(t.x * e), Math.round(t.y * e), 1, 1).data, n = i[3];
    if (n === 255) {
      const r = Et.Util._rgbToHex(i[0], i[1], i[2]), s = $l.shapes[Rl + r];
      return s ? {
        shape: s
      } : {
        antialiased: !0
      };
    } else if (n > 0)
      return {
        antialiased: !0
      };
    return {};
  }
  drawScene(t, e, i) {
    const n = this.getLayer(), r = t || n && n.getCanvas();
    return this._fire(Ol, {
      node: this
    }), this.clearBeforeDraw() && r.getContext().clear(), pn.Container.prototype.drawScene.call(this, r, e, i), this._fire(Fl, {
      node: this
    }), this;
  }
  drawHit(t, e) {
    const i = this.getLayer(), n = t || i && i.hitCanvas;
    return i && i.clearBeforeDraw() && i.getHitCanvas().getContext().clear(), pn.Container.prototype.drawHit.call(this, n, e), this;
  }
  enableHitGraph() {
    return this.hitGraphEnabled(!0), this;
  }
  disableHitGraph() {
    return this.hitGraphEnabled(!1), this;
  }
  setHitGraphEnabled(t) {
    Et.Util.warn("hitGraphEnabled method is deprecated. Please use layer.listening() instead."), this.listening(t);
  }
  getHitGraphEnabled(t) {
    return Et.Util.warn("hitGraphEnabled method is deprecated. Please use layer.listening() instead."), this.listening();
  }
  toggleHitCanvas() {
    if (!this.parent || !this.parent.content)
      return;
    const t = this.parent;
    !!this.hitCanvas._canvas.parentNode ? t.content.removeChild(this.hitCanvas._canvas) : t.content.appendChild(this.hitCanvas._canvas);
  }
  destroy() {
    return Et.Util.releaseCanvas(this.getNativeCanvasElement(), this.getHitCanvas()._canvas), super.destroy();
  }
}
Ke.Layer = Pe;
Pe.prototype.nodeType = "Layer";
(0, Hl._registerNode)(Pe);
Yn.Factory.addGetterSetter(Pe, "imageSmoothingEnabled", !0);
Yn.Factory.addGetterSetter(Pe, "clearBeforeDraw", !0);
Yn.Factory.addGetterSetter(Pe, "hitGraphEnabled", !0, (0, Tl.getBooleanValidator)());
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
bi.FastLayer = void 0;
const Nl = ot, Il = Ke, Gl = B;
class Xn extends Il.Layer {
  constructor(t) {
    super(t), this.listening(!1), Nl.Util.warn('Konva.Fast layer is deprecated. Please use "new Konva.Layer({ listening: false })" instead.');
  }
}
bi.FastLayer = Xn;
Xn.prototype.nodeType = "FastLayer";
(0, Gl._registerNode)(Xn);
var Ee = {};
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.Group = void 0;
const Bl = ot, Ul = ie, zl = B;
class Zn extends Ul.Container {
  _validateAdd(t) {
    const e = t.getType();
    e !== "Group" && e !== "Shape" && Bl.Util.throw("You may only add groups and shapes to groups.");
  }
}
Ee.Group = Zn;
Zn.prototype.nodeType = "Group";
(0, zl._registerNode)(Zn);
var Le = {};
Object.defineProperty(Le, "__esModule", { value: !0 });
Le.Animation = void 0;
const mn = B, Rr = ot, _n = function() {
  return mn.glob.performance && mn.glob.performance.now ? function() {
    return mn.glob.performance.now();
  } : function() {
    return (/* @__PURE__ */ new Date()).getTime();
  };
}();
class St {
  constructor(t, e) {
    this.id = St.animIdCounter++, this.frame = {
      time: 0,
      timeDiff: 0,
      lastTime: _n(),
      frameRate: 0
    }, this.func = t, this.setLayers(e);
  }
  setLayers(t) {
    let e = [];
    return t && (e = Array.isArray(t) ? t : [t]), this.layers = e, this;
  }
  getLayers() {
    return this.layers;
  }
  addLayer(t) {
    const e = this.layers, i = e.length;
    for (let n = 0; n < i; n++)
      if (e[n]._id === t._id)
        return !1;
    return this.layers.push(t), !0;
  }
  isRunning() {
    const e = St.animations, i = e.length;
    for (let n = 0; n < i; n++)
      if (e[n].id === this.id)
        return !0;
    return !1;
  }
  start() {
    return this.stop(), this.frame.timeDiff = 0, this.frame.lastTime = _n(), St._addAnimation(this), this;
  }
  stop() {
    return St._removeAnimation(this), this;
  }
  _updateFrameObject(t) {
    this.frame.timeDiff = t - this.frame.lastTime, this.frame.lastTime = t, this.frame.time += this.frame.timeDiff, this.frame.frameRate = 1e3 / this.frame.timeDiff;
  }
  static _addAnimation(t) {
    this.animations.push(t), this._handleAnimation();
  }
  static _removeAnimation(t) {
    const e = t.id, i = this.animations, n = i.length;
    for (let r = 0; r < n; r++)
      if (i[r].id === e) {
        this.animations.splice(r, 1);
        break;
      }
  }
  static _runFrames() {
    const t = {}, e = this.animations;
    for (let i = 0; i < e.length; i++) {
      const n = e[i], r = n.layers, s = n.func;
      n._updateFrameObject(_n());
      const o = r.length;
      let l;
      if (s ? l = s.call(n, n.frame) !== !1 : l = !0, !!l)
        for (let d = 0; d < o; d++) {
          const c = r[d];
          c._id !== void 0 && (t[c._id] = c);
        }
    }
    for (const i in t)
      t.hasOwnProperty(i) && t[i].batchDraw();
  }
  static _animationLoop() {
    const t = St;
    t.animations.length ? (t._runFrames(), Rr.Util.requestAnimFrame(t._animationLoop)) : t.animRunning = !1;
  }
  static _handleAnimation() {
    this.animRunning || (this.animRunning = !0, Rr.Util.requestAnimFrame(this._animationLoop));
  }
}
Le.Animation = St;
St.animations = [];
St.animIdCounter = 0;
St.animRunning = !1;
var Wa = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Easings = a.Tween = void 0;
  const t = ot, e = Le, i = at, n = B, r = {
    node: 1,
    duration: 1,
    easing: 1,
    onFinish: 1,
    yoyo: 1
  }, s = 1, o = 2, l = 3, d = ["fill", "stroke", "shadowColor"];
  let c = 0;
  class p {
    constructor(u, _, y, v, w, h, m) {
      this.prop = u, this.propFunc = _, this.begin = v, this._pos = v, this.duration = h, this._change = 0, this.prevPos = 0, this.yoyo = m, this._time = 0, this._position = 0, this._startTime = 0, this._finish = 0, this.func = y, this._change = w - this.begin, this.pause();
    }
    fire(u) {
      const _ = this[u];
      _ && _();
    }
    setTime(u) {
      u > this.duration ? this.yoyo ? (this._time = this.duration, this.reverse()) : this.finish() : u < 0 ? this.yoyo ? (this._time = 0, this.play()) : this.reset() : (this._time = u, this.update());
    }
    getTime() {
      return this._time;
    }
    setPosition(u) {
      this.prevPos = this._pos, this.propFunc(u), this._pos = u;
    }
    getPosition(u) {
      return u === void 0 && (u = this._time), this.func(u, this.begin, this._change, this.duration);
    }
    play() {
      this.state = o, this._startTime = this.getTimer() - this._time, this.onEnterFrame(), this.fire("onPlay");
    }
    reverse() {
      this.state = l, this._time = this.duration - this._time, this._startTime = this.getTimer() - this._time, this.onEnterFrame(), this.fire("onReverse");
    }
    seek(u) {
      this.pause(), this._time = u, this.update(), this.fire("onSeek");
    }
    reset() {
      this.pause(), this._time = 0, this.update(), this.fire("onReset");
    }
    finish() {
      this.pause(), this._time = this.duration, this.update(), this.fire("onFinish");
    }
    update() {
      this.setPosition(this.getPosition(this._time)), this.fire("onUpdate");
    }
    onEnterFrame() {
      const u = this.getTimer() - this._startTime;
      this.state === o ? this.setTime(u) : this.state === l && this.setTime(this.duration - u);
    }
    pause() {
      this.state = s, this.fire("onPause");
    }
    getTimer() {
      return (/* @__PURE__ */ new Date()).getTime();
    }
  }
  class f {
    constructor(u) {
      const _ = this, y = u.node, v = y._id, w = u.easing || a.Easings.Linear, h = !!u.yoyo;
      let m, b;
      typeof u.duration > "u" ? m = 0.3 : u.duration === 0 ? m = 1e-3 : m = u.duration, this.node = y, this._id = c++;
      const A = y.getLayer() || (y instanceof n.Konva.Stage ? y.getLayers() : null);
      A || t.Util.error("Tween constructor have `node` that is not in a layer. Please add node into layer first."), this.anim = new e.Animation(function() {
        _.tween.onEnterFrame();
      }, A), this.tween = new p(b, function(M) {
        _._tweenFunc(M);
      }, w, 0, 1, m * 1e3, h), this._addListeners(), f.attrs[v] || (f.attrs[v] = {}), f.attrs[v][this._id] || (f.attrs[v][this._id] = {}), f.tweens[v] || (f.tweens[v] = {});
      for (b in u)
        r[b] === void 0 && this._addAttr(b, u[b]);
      this.reset(), this.onFinish = u.onFinish, this.onReset = u.onReset, this.onUpdate = u.onUpdate;
    }
    _addAttr(u, _) {
      const y = this.node, v = y._id;
      let w, h, m, b, A;
      const M = f.tweens[v][u];
      M && delete f.attrs[v][M][u];
      let C = y.getAttr(u);
      if (t.Util._isArray(_))
        if (w = [], h = Math.max(_.length, C.length), u === "points" && _.length !== C.length && (_.length > C.length ? (b = C, C = t.Util._prepareArrayForTween(C, _, y.closed())) : (m = _, _ = t.Util._prepareArrayForTween(_, C, y.closed()))), u.indexOf("fill") === 0)
          for (let k = 0; k < h; k++)
            if (k % 2 === 0)
              w.push(_[k] - C[k]);
            else {
              const x = t.Util.colorToRGBA(C[k]);
              A = t.Util.colorToRGBA(_[k]), C[k] = x, w.push({
                r: A.r - x.r,
                g: A.g - x.g,
                b: A.b - x.b,
                a: A.a - x.a
              });
            }
        else
          for (let k = 0; k < h; k++)
            w.push(_[k] - C[k]);
      else d.indexOf(u) !== -1 ? (C = t.Util.colorToRGBA(C), A = t.Util.colorToRGBA(_), w = {
        r: A.r - C.r,
        g: A.g - C.g,
        b: A.b - C.b,
        a: A.a - C.a
      }) : w = _ - C;
      f.attrs[v][this._id][u] = {
        start: C,
        diff: w,
        end: _,
        trueEnd: m,
        trueStart: b
      }, f.tweens[v][u] = this._id;
    }
    _tweenFunc(u) {
      const _ = this.node, y = f.attrs[_._id][this._id];
      let v, w, h, m, b, A, M, C;
      for (v in y) {
        if (w = y[v], h = w.start, m = w.diff, C = w.end, t.Util._isArray(h))
          if (b = [], M = Math.max(h.length, C.length), v.indexOf("fill") === 0)
            for (A = 0; A < M; A++)
              A % 2 === 0 ? b.push((h[A] || 0) + m[A] * u) : b.push("rgba(" + Math.round(h[A].r + m[A].r * u) + "," + Math.round(h[A].g + m[A].g * u) + "," + Math.round(h[A].b + m[A].b * u) + "," + (h[A].a + m[A].a * u) + ")");
          else
            for (A = 0; A < M; A++)
              b.push((h[A] || 0) + m[A] * u);
        else d.indexOf(v) !== -1 ? b = "rgba(" + Math.round(h.r + m.r * u) + "," + Math.round(h.g + m.g * u) + "," + Math.round(h.b + m.b * u) + "," + (h.a + m.a * u) + ")" : b = h + m * u;
        _.setAttr(v, b);
      }
    }
    _addListeners() {
      this.tween.onPlay = () => {
        this.anim.start();
      }, this.tween.onReverse = () => {
        this.anim.start();
      }, this.tween.onPause = () => {
        this.anim.stop();
      }, this.tween.onFinish = () => {
        const u = this.node, _ = f.attrs[u._id][this._id];
        _.points && _.points.trueEnd && u.setAttr("points", _.points.trueEnd), this.onFinish && this.onFinish.call(this);
      }, this.tween.onReset = () => {
        const u = this.node, _ = f.attrs[u._id][this._id];
        _.points && _.points.trueStart && u.points(_.points.trueStart), this.onReset && this.onReset();
      }, this.tween.onUpdate = () => {
        this.onUpdate && this.onUpdate.call(this);
      };
    }
    play() {
      return this.tween.play(), this;
    }
    reverse() {
      return this.tween.reverse(), this;
    }
    reset() {
      return this.tween.reset(), this;
    }
    seek(u) {
      return this.tween.seek(u * 1e3), this;
    }
    pause() {
      return this.tween.pause(), this;
    }
    finish() {
      return this.tween.finish(), this;
    }
    destroy() {
      const u = this.node._id, _ = this._id, y = f.tweens[u];
      this.pause(), this.anim && this.anim.stop();
      for (const v in y)
        delete f.tweens[u][v];
      delete f.attrs[u][_], f.tweens[u] && (Object.keys(f.tweens[u]).length === 0 && delete f.tweens[u], Object.keys(f.attrs[u]).length === 0 && delete f.attrs[u]);
    }
  }
  a.Tween = f, f.attrs = {}, f.tweens = {}, i.Node.prototype.to = function(g) {
    const u = g.onFinish;
    g.node = this, g.onFinish = function() {
      this.destroy(), u && u();
    }, new f(g).play();
  }, a.Easings = {
    BackEaseIn(g, u, _, y) {
      return _ * (g /= y) * g * ((1.70158 + 1) * g - 1.70158) + u;
    },
    BackEaseOut(g, u, _, y) {
      return _ * ((g = g / y - 1) * g * ((1.70158 + 1) * g + 1.70158) + 1) + u;
    },
    BackEaseInOut(g, u, _, y) {
      let v = 1.70158;
      return (g /= y / 2) < 1 ? _ / 2 * (g * g * (((v *= 1.525) + 1) * g - v)) + u : _ / 2 * ((g -= 2) * g * (((v *= 1.525) + 1) * g + v) + 2) + u;
    },
    ElasticEaseIn(g, u, _, y, v, w) {
      let h = 0;
      return g === 0 ? u : (g /= y) === 1 ? u + _ : (w || (w = y * 0.3), !v || v < Math.abs(_) ? (v = _, h = w / 4) : h = w / (2 * Math.PI) * Math.asin(_ / v), -(v * Math.pow(2, 10 * (g -= 1)) * Math.sin((g * y - h) * (2 * Math.PI) / w)) + u);
    },
    ElasticEaseOut(g, u, _, y, v, w) {
      let h = 0;
      return g === 0 ? u : (g /= y) === 1 ? u + _ : (w || (w = y * 0.3), !v || v < Math.abs(_) ? (v = _, h = w / 4) : h = w / (2 * Math.PI) * Math.asin(_ / v), v * Math.pow(2, -10 * g) * Math.sin((g * y - h) * (2 * Math.PI) / w) + _ + u);
    },
    ElasticEaseInOut(g, u, _, y, v, w) {
      let h = 0;
      return g === 0 ? u : (g /= y / 2) === 2 ? u + _ : (w || (w = y * (0.3 * 1.5)), !v || v < Math.abs(_) ? (v = _, h = w / 4) : h = w / (2 * Math.PI) * Math.asin(_ / v), g < 1 ? -0.5 * (v * Math.pow(2, 10 * (g -= 1)) * Math.sin((g * y - h) * (2 * Math.PI) / w)) + u : v * Math.pow(2, -10 * (g -= 1)) * Math.sin((g * y - h) * (2 * Math.PI) / w) * 0.5 + _ + u);
    },
    BounceEaseOut(g, u, _, y) {
      return (g /= y) < 1 / 2.75 ? _ * (7.5625 * g * g) + u : g < 2 / 2.75 ? _ * (7.5625 * (g -= 1.5 / 2.75) * g + 0.75) + u : g < 2.5 / 2.75 ? _ * (7.5625 * (g -= 2.25 / 2.75) * g + 0.9375) + u : _ * (7.5625 * (g -= 2.625 / 2.75) * g + 0.984375) + u;
    },
    BounceEaseIn(g, u, _, y) {
      return _ - a.Easings.BounceEaseOut(y - g, 0, _, y) + u;
    },
    BounceEaseInOut(g, u, _, y) {
      return g < y / 2 ? a.Easings.BounceEaseIn(g * 2, 0, _, y) * 0.5 + u : a.Easings.BounceEaseOut(g * 2 - y, 0, _, y) * 0.5 + _ * 0.5 + u;
    },
    EaseIn(g, u, _, y) {
      return _ * (g /= y) * g + u;
    },
    EaseOut(g, u, _, y) {
      return -_ * (g /= y) * (g - 2) + u;
    },
    EaseInOut(g, u, _, y) {
      return (g /= y / 2) < 1 ? _ / 2 * g * g + u : -_ / 2 * (--g * (g - 2) - 1) + u;
    },
    StrongEaseIn(g, u, _, y) {
      return _ * (g /= y) * g * g * g * g + u;
    },
    StrongEaseOut(g, u, _, y) {
      return _ * ((g = g / y - 1) * g * g * g * g + 1) + u;
    },
    StrongEaseInOut(g, u, _, y) {
      return (g /= y / 2) < 1 ? _ / 2 * g * g * g * g * g + u : _ / 2 * ((g -= 2) * g * g * g * g + 2) + u;
    },
    Linear(g, u, _, y) {
      return _ * g / y + u;
    }
  };
})(Wa);
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Konva = void 0;
  const t = B, e = ot, i = at, n = ie, r = Ba, s = Ke, o = bi, l = Ee, d = _i, c = ft, p = Le, f = Wa, g = Tt, u = wt;
  a.Konva = e.Util._assign(t.Konva, {
    Util: e.Util,
    Transform: e.Transform,
    Node: i.Node,
    Container: n.Container,
    Stage: r.Stage,
    stages: r.stages,
    Layer: s.Layer,
    FastLayer: o.FastLayer,
    Group: l.Group,
    DD: d.DD,
    Shape: c.Shape,
    shapes: c.shapes,
    Animation: p.Animation,
    Tween: f.Tween,
    Easings: f.Easings,
    Context: g.Context,
    Canvas: u.Canvas
  }), a.default = a.Konva;
})(Da);
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
vi.Arc = void 0;
const Ci = U, jl = ft, Or = B, wi = N, Wl = B;
class Rt extends jl.Shape {
  _sceneFunc(t) {
    const e = Or.Konva.getAngle(this.angle()), i = this.clockwise();
    t.beginPath(), t.arc(0, 0, this.outerRadius(), 0, e, i), t.arc(0, 0, this.innerRadius(), e, 0, !i), t.closePath(), t.fillStrokeShape(this);
  }
  getWidth() {
    return this.outerRadius() * 2;
  }
  getHeight() {
    return this.outerRadius() * 2;
  }
  setWidth(t) {
    this.outerRadius(t / 2);
  }
  setHeight(t) {
    this.outerRadius(t / 2);
  }
  getSelfRect() {
    const t = this.innerRadius(), e = this.outerRadius(), i = this.clockwise(), n = Or.Konva.getAngle(i ? 360 - this.angle() : this.angle()), r = Math.cos(Math.min(n, Math.PI)), s = 1, o = Math.sin(Math.min(Math.max(Math.PI, n), 3 * Math.PI / 2)), l = Math.sin(Math.min(n, Math.PI / 2)), d = r * (r > 0 ? t : e), c = s * e, p = o * (o > 0 ? t : e), f = l * (l > 0 ? e : t);
    return {
      x: d,
      y: i ? -1 * f : p,
      width: c - d,
      height: f - p
    };
  }
}
vi.Arc = Rt;
Rt.prototype._centroid = !0;
Rt.prototype.className = "Arc";
Rt.prototype._attrsAffectingSize = [
  "innerRadius",
  "outerRadius",
  "angle",
  "clockwise"
];
(0, Wl._registerNode)(Rt);
Ci.Factory.addGetterSetter(Rt, "innerRadius", 0, (0, wi.getNumberValidator)());
Ci.Factory.addGetterSetter(Rt, "outerRadius", 0, (0, wi.getNumberValidator)());
Ci.Factory.addGetterSetter(Rt, "angle", 0, (0, wi.getNumberValidator)());
Ci.Factory.addGetterSetter(Rt, "clockwise", !1, (0, wi.getBooleanValidator)());
var Ai = {}, Ye = {};
Object.defineProperty(Ye, "__esModule", { value: !0 });
Ye.Line = void 0;
const Si = U, Kl = B, Yl = ft, Ka = N;
function Ln(a, t, e, i, n, r, s) {
  const o = Math.sqrt(Math.pow(e - a, 2) + Math.pow(i - t, 2)), l = Math.sqrt(Math.pow(n - e, 2) + Math.pow(r - i, 2)), d = s * o / (o + l), c = s * l / (o + l), p = e - d * (n - a), f = i - d * (r - t), g = e + c * (n - a), u = i + c * (r - t);
  return [p, f, g, u];
}
function Fr(a, t) {
  const e = a.length, i = [];
  for (let n = 2; n < e - 2; n += 2) {
    const r = Ln(a[n - 2], a[n - 1], a[n], a[n + 1], a[n + 2], a[n + 3], t);
    isNaN(r[0]) || (i.push(r[0]), i.push(r[1]), i.push(a[n]), i.push(a[n + 1]), i.push(r[2]), i.push(r[3]));
  }
  return i;
}
class zt extends Yl.Shape {
  constructor(t) {
    super(t), this.on("pointsChange.konva tensionChange.konva closedChange.konva bezierChange.konva", function() {
      this._clearCache("tensionPoints");
    });
  }
  _sceneFunc(t) {
    const e = this.points(), i = e.length, n = this.tension(), r = this.closed(), s = this.bezier();
    if (!i)
      return;
    let o = 0;
    if (t.beginPath(), t.moveTo(e[0], e[1]), n !== 0 && i > 4) {
      const l = this.getTensionPoints(), d = l.length;
      for (o = r ? 0 : 4, r || t.quadraticCurveTo(l[0], l[1], l[2], l[3]); o < d - 2; )
        t.bezierCurveTo(l[o++], l[o++], l[o++], l[o++], l[o++], l[o++]);
      r || t.quadraticCurveTo(l[d - 2], l[d - 1], e[i - 2], e[i - 1]);
    } else if (s)
      for (o = 2; o < i; )
        t.bezierCurveTo(e[o++], e[o++], e[o++], e[o++], e[o++], e[o++]);
    else
      for (o = 2; o < i; o += 2)
        t.lineTo(e[o], e[o + 1]);
    r ? (t.closePath(), t.fillStrokeShape(this)) : t.strokeShape(this);
  }
  getTensionPoints() {
    return this._getCache("tensionPoints", this._getTensionPoints);
  }
  _getTensionPoints() {
    return this.closed() ? this._getTensionPointsClosed() : Fr(this.points(), this.tension());
  }
  _getTensionPointsClosed() {
    const t = this.points(), e = t.length, i = this.tension(), n = Ln(t[e - 2], t[e - 1], t[0], t[1], t[2], t[3], i), r = Ln(t[e - 4], t[e - 3], t[e - 2], t[e - 1], t[0], t[1], i), s = Fr(t, i);
    return [n[2], n[3]].concat(s).concat([
      r[0],
      r[1],
      t[e - 2],
      t[e - 1],
      r[2],
      r[3],
      n[0],
      n[1],
      t[0],
      t[1]
    ]);
  }
  getWidth() {
    return this.getSelfRect().width;
  }
  getHeight() {
    return this.getSelfRect().height;
  }
  getSelfRect() {
    let t = this.points();
    if (t.length < 4)
      return {
        x: t[0] || 0,
        y: t[1] || 0,
        width: 0,
        height: 0
      };
    this.tension() !== 0 ? t = [
      t[0],
      t[1],
      ...this._getTensionPoints(),
      t[t.length - 2],
      t[t.length - 1]
    ] : t = this.points();
    let e = t[0], i = t[0], n = t[1], r = t[1], s, o;
    for (let l = 0; l < t.length / 2; l++)
      s = t[l * 2], o = t[l * 2 + 1], e = Math.min(e, s), i = Math.max(i, s), n = Math.min(n, o), r = Math.max(r, o);
    return {
      x: e,
      y: n,
      width: i - e,
      height: r - n
    };
  }
}
Ye.Line = zt;
zt.prototype.className = "Line";
zt.prototype._attrsAffectingSize = ["points", "bezier", "tension"];
(0, Kl._registerNode)(zt);
Si.Factory.addGetterSetter(zt, "closed", !1);
Si.Factory.addGetterSetter(zt, "bezier", !1);
Si.Factory.addGetterSetter(zt, "tension", 0, (0, Ka.getNumberValidator)());
Si.Factory.addGetterSetter(zt, "points", [], (0, Ka.getNumberArrayValidator)());
var Ve = {}, Ya = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.t2length = a.getQuadraticArcLength = a.getCubicArcLength = a.binomialCoefficients = a.cValues = a.tValues = void 0, a.tValues = [
    [],
    [],
    [
      -0.5773502691896257,
      0.5773502691896257
    ],
    [
      0,
      -0.7745966692414834,
      0.7745966692414834
    ],
    [
      -0.33998104358485626,
      0.33998104358485626,
      -0.8611363115940526,
      0.8611363115940526
    ],
    [
      0,
      -0.5384693101056831,
      0.5384693101056831,
      -0.906179845938664,
      0.906179845938664
    ],
    [
      0.6612093864662645,
      -0.6612093864662645,
      -0.2386191860831969,
      0.2386191860831969,
      -0.932469514203152,
      0.932469514203152
    ],
    [
      0,
      0.4058451513773972,
      -0.4058451513773972,
      -0.7415311855993945,
      0.7415311855993945,
      -0.9491079123427585,
      0.9491079123427585
    ],
    [
      -0.1834346424956498,
      0.1834346424956498,
      -0.525532409916329,
      0.525532409916329,
      -0.7966664774136267,
      0.7966664774136267,
      -0.9602898564975363,
      0.9602898564975363
    ],
    [
      0,
      -0.8360311073266358,
      0.8360311073266358,
      -0.9681602395076261,
      0.9681602395076261,
      -0.3242534234038089,
      0.3242534234038089,
      -0.6133714327005904,
      0.6133714327005904
    ],
    [
      -0.14887433898163122,
      0.14887433898163122,
      -0.4333953941292472,
      0.4333953941292472,
      -0.6794095682990244,
      0.6794095682990244,
      -0.8650633666889845,
      0.8650633666889845,
      -0.9739065285171717,
      0.9739065285171717
    ],
    [
      0,
      -0.26954315595234496,
      0.26954315595234496,
      -0.5190961292068118,
      0.5190961292068118,
      -0.7301520055740494,
      0.7301520055740494,
      -0.8870625997680953,
      0.8870625997680953,
      -0.978228658146057,
      0.978228658146057
    ],
    [
      -0.1252334085114689,
      0.1252334085114689,
      -0.3678314989981802,
      0.3678314989981802,
      -0.5873179542866175,
      0.5873179542866175,
      -0.7699026741943047,
      0.7699026741943047,
      -0.9041172563704749,
      0.9041172563704749,
      -0.9815606342467192,
      0.9815606342467192
    ],
    [
      0,
      -0.2304583159551348,
      0.2304583159551348,
      -0.44849275103644687,
      0.44849275103644687,
      -0.6423493394403402,
      0.6423493394403402,
      -0.8015780907333099,
      0.8015780907333099,
      -0.9175983992229779,
      0.9175983992229779,
      -0.9841830547185881,
      0.9841830547185881
    ],
    [
      -0.10805494870734367,
      0.10805494870734367,
      -0.31911236892788974,
      0.31911236892788974,
      -0.5152486363581541,
      0.5152486363581541,
      -0.6872929048116855,
      0.6872929048116855,
      -0.827201315069765,
      0.827201315069765,
      -0.9284348836635735,
      0.9284348836635735,
      -0.9862838086968123,
      0.9862838086968123
    ],
    [
      0,
      -0.20119409399743451,
      0.20119409399743451,
      -0.3941513470775634,
      0.3941513470775634,
      -0.5709721726085388,
      0.5709721726085388,
      -0.7244177313601701,
      0.7244177313601701,
      -0.8482065834104272,
      0.8482065834104272,
      -0.937273392400706,
      0.937273392400706,
      -0.9879925180204854,
      0.9879925180204854
    ],
    [
      -0.09501250983763744,
      0.09501250983763744,
      -0.2816035507792589,
      0.2816035507792589,
      -0.45801677765722737,
      0.45801677765722737,
      -0.6178762444026438,
      0.6178762444026438,
      -0.755404408355003,
      0.755404408355003,
      -0.8656312023878318,
      0.8656312023878318,
      -0.9445750230732326,
      0.9445750230732326,
      -0.9894009349916499,
      0.9894009349916499
    ],
    [
      0,
      -0.17848418149584785,
      0.17848418149584785,
      -0.3512317634538763,
      0.3512317634538763,
      -0.5126905370864769,
      0.5126905370864769,
      -0.6576711592166907,
      0.6576711592166907,
      -0.7815140038968014,
      0.7815140038968014,
      -0.8802391537269859,
      0.8802391537269859,
      -0.9506755217687678,
      0.9506755217687678,
      -0.9905754753144174,
      0.9905754753144174
    ],
    [
      -0.0847750130417353,
      0.0847750130417353,
      -0.2518862256915055,
      0.2518862256915055,
      -0.41175116146284263,
      0.41175116146284263,
      -0.5597708310739475,
      0.5597708310739475,
      -0.6916870430603532,
      0.6916870430603532,
      -0.8037049589725231,
      0.8037049589725231,
      -0.8926024664975557,
      0.8926024664975557,
      -0.9558239495713977,
      0.9558239495713977,
      -0.9915651684209309,
      0.9915651684209309
    ],
    [
      0,
      -0.16035864564022537,
      0.16035864564022537,
      -0.31656409996362983,
      0.31656409996362983,
      -0.46457074137596094,
      0.46457074137596094,
      -0.600545304661681,
      0.600545304661681,
      -0.7209661773352294,
      0.7209661773352294,
      -0.8227146565371428,
      0.8227146565371428,
      -0.9031559036148179,
      0.9031559036148179,
      -0.96020815213483,
      0.96020815213483,
      -0.9924068438435844,
      0.9924068438435844
    ],
    [
      -0.07652652113349734,
      0.07652652113349734,
      -0.22778585114164507,
      0.22778585114164507,
      -0.37370608871541955,
      0.37370608871541955,
      -0.5108670019508271,
      0.5108670019508271,
      -0.636053680726515,
      0.636053680726515,
      -0.7463319064601508,
      0.7463319064601508,
      -0.8391169718222188,
      0.8391169718222188,
      -0.912234428251326,
      0.912234428251326,
      -0.9639719272779138,
      0.9639719272779138,
      -0.9931285991850949,
      0.9931285991850949
    ],
    [
      0,
      -0.1455618541608951,
      0.1455618541608951,
      -0.2880213168024011,
      0.2880213168024011,
      -0.4243421202074388,
      0.4243421202074388,
      -0.5516188358872198,
      0.5516188358872198,
      -0.6671388041974123,
      0.6671388041974123,
      -0.7684399634756779,
      0.7684399634756779,
      -0.8533633645833173,
      0.8533633645833173,
      -0.9200993341504008,
      0.9200993341504008,
      -0.9672268385663063,
      0.9672268385663063,
      -0.9937521706203895,
      0.9937521706203895
    ],
    [
      -0.06973927331972223,
      0.06973927331972223,
      -0.20786042668822127,
      0.20786042668822127,
      -0.34193582089208424,
      0.34193582089208424,
      -0.469355837986757,
      0.469355837986757,
      -0.5876404035069116,
      0.5876404035069116,
      -0.6944872631866827,
      0.6944872631866827,
      -0.7878168059792081,
      0.7878168059792081,
      -0.8658125777203002,
      0.8658125777203002,
      -0.926956772187174,
      0.926956772187174,
      -0.9700604978354287,
      0.9700604978354287,
      -0.9942945854823992,
      0.9942945854823992
    ],
    [
      0,
      -0.1332568242984661,
      0.1332568242984661,
      -0.26413568097034495,
      0.26413568097034495,
      -0.3903010380302908,
      0.3903010380302908,
      -0.5095014778460075,
      0.5095014778460075,
      -0.6196098757636461,
      0.6196098757636461,
      -0.7186613631319502,
      0.7186613631319502,
      -0.8048884016188399,
      0.8048884016188399,
      -0.8767523582704416,
      0.8767523582704416,
      -0.9329710868260161,
      0.9329710868260161,
      -0.9725424712181152,
      0.9725424712181152,
      -0.9947693349975522,
      0.9947693349975522
    ],
    [
      -0.06405689286260563,
      0.06405689286260563,
      -0.1911188674736163,
      0.1911188674736163,
      -0.3150426796961634,
      0.3150426796961634,
      -0.4337935076260451,
      0.4337935076260451,
      -0.5454214713888396,
      0.5454214713888396,
      -0.6480936519369755,
      0.6480936519369755,
      -0.7401241915785544,
      0.7401241915785544,
      -0.820001985973903,
      0.820001985973903,
      -0.8864155270044011,
      0.8864155270044011,
      -0.9382745520027328,
      0.9382745520027328,
      -0.9747285559713095,
      0.9747285559713095,
      -0.9951872199970213,
      0.9951872199970213
    ]
  ], a.cValues = [
    [],
    [],
    [1, 1],
    [
      0.8888888888888888,
      0.5555555555555556,
      0.5555555555555556
    ],
    [
      0.6521451548625461,
      0.6521451548625461,
      0.34785484513745385,
      0.34785484513745385
    ],
    [
      0.5688888888888889,
      0.47862867049936647,
      0.47862867049936647,
      0.23692688505618908,
      0.23692688505618908
    ],
    [
      0.3607615730481386,
      0.3607615730481386,
      0.46791393457269104,
      0.46791393457269104,
      0.17132449237917036,
      0.17132449237917036
    ],
    [
      0.4179591836734694,
      0.3818300505051189,
      0.3818300505051189,
      0.27970539148927664,
      0.27970539148927664,
      0.1294849661688697,
      0.1294849661688697
    ],
    [
      0.362683783378362,
      0.362683783378362,
      0.31370664587788727,
      0.31370664587788727,
      0.22238103445337448,
      0.22238103445337448,
      0.10122853629037626,
      0.10122853629037626
    ],
    [
      0.3302393550012598,
      0.1806481606948574,
      0.1806481606948574,
      0.08127438836157441,
      0.08127438836157441,
      0.31234707704000286,
      0.31234707704000286,
      0.26061069640293544,
      0.26061069640293544
    ],
    [
      0.29552422471475287,
      0.29552422471475287,
      0.26926671930999635,
      0.26926671930999635,
      0.21908636251598204,
      0.21908636251598204,
      0.1494513491505806,
      0.1494513491505806,
      0.06667134430868814,
      0.06667134430868814
    ],
    [
      0.2729250867779006,
      0.26280454451024665,
      0.26280454451024665,
      0.23319376459199048,
      0.23319376459199048,
      0.18629021092773426,
      0.18629021092773426,
      0.1255803694649046,
      0.1255803694649046,
      0.05566856711617366,
      0.05566856711617366
    ],
    [
      0.24914704581340277,
      0.24914704581340277,
      0.2334925365383548,
      0.2334925365383548,
      0.20316742672306592,
      0.20316742672306592,
      0.16007832854334622,
      0.16007832854334622,
      0.10693932599531843,
      0.10693932599531843,
      0.04717533638651183,
      0.04717533638651183
    ],
    [
      0.2325515532308739,
      0.22628318026289723,
      0.22628318026289723,
      0.2078160475368885,
      0.2078160475368885,
      0.17814598076194574,
      0.17814598076194574,
      0.13887351021978725,
      0.13887351021978725,
      0.09212149983772845,
      0.09212149983772845,
      0.04048400476531588,
      0.04048400476531588
    ],
    [
      0.2152638534631578,
      0.2152638534631578,
      0.2051984637212956,
      0.2051984637212956,
      0.18553839747793782,
      0.18553839747793782,
      0.15720316715819355,
      0.15720316715819355,
      0.12151857068790319,
      0.12151857068790319,
      0.08015808715976021,
      0.08015808715976021,
      0.03511946033175186,
      0.03511946033175186
    ],
    [
      0.2025782419255613,
      0.19843148532711158,
      0.19843148532711158,
      0.1861610000155622,
      0.1861610000155622,
      0.16626920581699392,
      0.16626920581699392,
      0.13957067792615432,
      0.13957067792615432,
      0.10715922046717194,
      0.10715922046717194,
      0.07036604748810812,
      0.07036604748810812,
      0.03075324199611727,
      0.03075324199611727
    ],
    [
      0.1894506104550685,
      0.1894506104550685,
      0.18260341504492358,
      0.18260341504492358,
      0.16915651939500254,
      0.16915651939500254,
      0.14959598881657674,
      0.14959598881657674,
      0.12462897125553388,
      0.12462897125553388,
      0.09515851168249279,
      0.09515851168249279,
      0.062253523938647894,
      0.062253523938647894,
      0.027152459411754096,
      0.027152459411754096
    ],
    [
      0.17944647035620653,
      0.17656270536699264,
      0.17656270536699264,
      0.16800410215645004,
      0.16800410215645004,
      0.15404576107681028,
      0.15404576107681028,
      0.13513636846852548,
      0.13513636846852548,
      0.11188384719340397,
      0.11188384719340397,
      0.08503614831717918,
      0.08503614831717918,
      0.0554595293739872,
      0.0554595293739872,
      0.02414830286854793,
      0.02414830286854793
    ],
    [
      0.1691423829631436,
      0.1691423829631436,
      0.16427648374583273,
      0.16427648374583273,
      0.15468467512626524,
      0.15468467512626524,
      0.14064291467065065,
      0.14064291467065065,
      0.12255520671147846,
      0.12255520671147846,
      0.10094204410628717,
      0.10094204410628717,
      0.07642573025488905,
      0.07642573025488905,
      0.0497145488949698,
      0.0497145488949698,
      0.02161601352648331,
      0.02161601352648331
    ],
    [
      0.1610544498487837,
      0.15896884339395434,
      0.15896884339395434,
      0.15276604206585967,
      0.15276604206585967,
      0.1426067021736066,
      0.1426067021736066,
      0.12875396253933621,
      0.12875396253933621,
      0.11156664554733399,
      0.11156664554733399,
      0.09149002162245,
      0.09149002162245,
      0.06904454273764123,
      0.06904454273764123,
      0.0448142267656996,
      0.0448142267656996,
      0.019461788229726478,
      0.019461788229726478
    ],
    [
      0.15275338713072584,
      0.15275338713072584,
      0.14917298647260374,
      0.14917298647260374,
      0.14209610931838204,
      0.14209610931838204,
      0.13168863844917664,
      0.13168863844917664,
      0.11819453196151841,
      0.11819453196151841,
      0.10193011981724044,
      0.10193011981724044,
      0.08327674157670475,
      0.08327674157670475,
      0.06267204833410907,
      0.06267204833410907,
      0.04060142980038694,
      0.04060142980038694,
      0.017614007139152118,
      0.017614007139152118
    ],
    [
      0.14608113364969041,
      0.14452440398997005,
      0.14452440398997005,
      0.13988739479107315,
      0.13988739479107315,
      0.13226893863333747,
      0.13226893863333747,
      0.12183141605372853,
      0.12183141605372853,
      0.10879729916714838,
      0.10879729916714838,
      0.09344442345603386,
      0.09344442345603386,
      0.0761001136283793,
      0.0761001136283793,
      0.057134425426857205,
      0.057134425426857205,
      0.036953789770852494,
      0.036953789770852494,
      0.016017228257774335,
      0.016017228257774335
    ],
    [
      0.13925187285563198,
      0.13925187285563198,
      0.13654149834601517,
      0.13654149834601517,
      0.13117350478706238,
      0.13117350478706238,
      0.12325237681051242,
      0.12325237681051242,
      0.11293229608053922,
      0.11293229608053922,
      0.10041414444288096,
      0.10041414444288096,
      0.08594160621706773,
      0.08594160621706773,
      0.06979646842452049,
      0.06979646842452049,
      0.052293335152683286,
      0.052293335152683286,
      0.03377490158481415,
      0.03377490158481415,
      0.0146279952982722,
      0.0146279952982722
    ],
    [
      0.13365457218610619,
      0.1324620394046966,
      0.1324620394046966,
      0.12890572218808216,
      0.12890572218808216,
      0.12304908430672953,
      0.12304908430672953,
      0.11499664022241136,
      0.11499664022241136,
      0.10489209146454141,
      0.10489209146454141,
      0.09291576606003515,
      0.09291576606003515,
      0.07928141177671895,
      0.07928141177671895,
      0.06423242140852585,
      0.06423242140852585,
      0.04803767173108467,
      0.04803767173108467,
      0.030988005856979445,
      0.030988005856979445,
      0.013411859487141771,
      0.013411859487141771
    ],
    [
      0.12793819534675216,
      0.12793819534675216,
      0.1258374563468283,
      0.1258374563468283,
      0.12167047292780339,
      0.12167047292780339,
      0.1155056680537256,
      0.1155056680537256,
      0.10744427011596563,
      0.10744427011596563,
      0.09761865210411388,
      0.09761865210411388,
      0.08619016153195327,
      0.08619016153195327,
      0.0733464814110803,
      0.0733464814110803,
      0.05929858491543678,
      0.05929858491543678,
      0.04427743881741981,
      0.04427743881741981,
      0.028531388628933663,
      0.028531388628933663,
      0.0123412297999872,
      0.0123412297999872
    ]
  ], a.binomialCoefficients = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]];
  const t = (s, o, l) => {
    let d, c;
    const f = l / 2;
    d = 0;
    for (let g = 0; g < 20; g++)
      c = f * a.tValues[20][g] + f, d += a.cValues[20][g] * i(s, o, c);
    return f * d;
  };
  a.getCubicArcLength = t;
  const e = (s, o, l) => {
    l === void 0 && (l = 1);
    const d = s[0] - 2 * s[1] + s[2], c = o[0] - 2 * o[1] + o[2], p = 2 * s[1] - 2 * s[0], f = 2 * o[1] - 2 * o[0], g = 4 * (d * d + c * c), u = 4 * (d * p + c * f), _ = p * p + f * f;
    if (g === 0)
      return l * Math.sqrt(Math.pow(s[2] - s[0], 2) + Math.pow(o[2] - o[0], 2));
    const y = u / (2 * g), v = _ / g, w = l + y, h = v - y * y, m = w * w + h > 0 ? Math.sqrt(w * w + h) : 0, b = y * y + h > 0 ? Math.sqrt(y * y + h) : 0, A = y + Math.sqrt(y * y + h) !== 0 ? h * Math.log(Math.abs((w + m) / (y + b))) : 0;
    return Math.sqrt(g) / 2 * (w * m - y * b + A);
  };
  a.getQuadraticArcLength = e;
  function i(s, o, l) {
    const d = n(1, l, s), c = n(1, l, o), p = d * d + c * c;
    return Math.sqrt(p);
  }
  const n = (s, o, l) => {
    const d = l.length - 1;
    let c, p;
    if (d === 0)
      return 0;
    if (s === 0) {
      p = 0;
      for (let f = 0; f <= d; f++)
        p += a.binomialCoefficients[d][f] * Math.pow(1 - o, d - f) * Math.pow(o, f) * l[f];
      return p;
    } else {
      c = new Array(d);
      for (let f = 0; f < d; f++)
        c[f] = d * (l[f + 1] - l[f]);
      return n(s - 1, o, c);
    }
  }, r = (s, o, l) => {
    let d = 1, c = s / o, p = (s - l(c)) / o, f = 0;
    for (; d > 1e-3; ) {
      const g = l(c + p), u = Math.abs(s - g) / o;
      if (u < d)
        d = u, c += p;
      else {
        const _ = l(c - p), y = Math.abs(s - _) / o;
        y < d ? (d = y, c -= p) : p /= 2;
      }
      if (f++, f > 500)
        break;
    }
    return c;
  };
  a.t2length = r;
})(Ya);
Object.defineProperty(Ve, "__esModule", { value: !0 });
Ve.Path = void 0;
const Xl = U, Zl = B, ql = ft, pe = Ya;
class gt extends ql.Shape {
  constructor(t) {
    super(t), this.dataArray = [], this.pathLength = 0, this._readDataAttribute(), this.on("dataChange.konva", function() {
      this._readDataAttribute();
    });
  }
  _readDataAttribute() {
    this.dataArray = gt.parsePathData(this.data()), this.pathLength = gt.getPathLength(this.dataArray);
  }
  _sceneFunc(t) {
    const e = this.dataArray;
    t.beginPath();
    let i = !1;
    for (let n = 0; n < e.length; n++) {
      const r = e[n].command, s = e[n].points;
      switch (r) {
        case "L":
          t.lineTo(s[0], s[1]);
          break;
        case "M":
          t.moveTo(s[0], s[1]);
          break;
        case "C":
          t.bezierCurveTo(s[0], s[1], s[2], s[3], s[4], s[5]);
          break;
        case "Q":
          t.quadraticCurveTo(s[0], s[1], s[2], s[3]);
          break;
        case "A":
          const o = s[0], l = s[1], d = s[2], c = s[3], p = s[4], f = s[5], g = s[6], u = s[7], _ = d > c ? d : c, y = d > c ? 1 : d / c, v = d > c ? c / d : 1;
          t.translate(o, l), t.rotate(g), t.scale(y, v), t.arc(0, 0, _, p, p + f, 1 - u), t.scale(1 / y, 1 / v), t.rotate(-g), t.translate(-o, -l);
          break;
        case "z":
          i = !0, t.closePath();
          break;
      }
    }
    !i && !this.hasFill() ? t.strokeShape(this) : t.fillStrokeShape(this);
  }
  getSelfRect() {
    let t = [];
    this.dataArray.forEach(function(l) {
      if (l.command === "A") {
        const d = l.points[4], c = l.points[5], p = l.points[4] + c;
        let f = Math.PI / 180;
        if (Math.abs(d - p) < f && (f = Math.abs(d - p)), c < 0)
          for (let g = d - f; g > p; g -= f) {
            const u = gt.getPointOnEllipticalArc(l.points[0], l.points[1], l.points[2], l.points[3], g, 0);
            t.push(u.x, u.y);
          }
        else
          for (let g = d + f; g < p; g += f) {
            const u = gt.getPointOnEllipticalArc(l.points[0], l.points[1], l.points[2], l.points[3], g, 0);
            t.push(u.x, u.y);
          }
      } else if (l.command === "C")
        for (let d = 0; d <= 1; d += 0.01) {
          const c = gt.getPointOnCubicBezier(d, l.start.x, l.start.y, l.points[0], l.points[1], l.points[2], l.points[3], l.points[4], l.points[5]);
          t.push(c.x, c.y);
        }
      else
        t = t.concat(l.points);
    });
    let e = t[0], i = t[0], n = t[1], r = t[1], s, o;
    for (let l = 0; l < t.length / 2; l++)
      s = t[l * 2], o = t[l * 2 + 1], isNaN(s) || (e = Math.min(e, s), i = Math.max(i, s)), isNaN(o) || (n = Math.min(n, o), r = Math.max(r, o));
    return {
      x: e,
      y: n,
      width: i - e,
      height: r - n
    };
  }
  getLength() {
    return this.pathLength;
  }
  getPointAtLength(t) {
    return gt.getPointAtLengthOfDataArray(t, this.dataArray);
  }
  static getLineLength(t, e, i, n) {
    return Math.sqrt((i - t) * (i - t) + (n - e) * (n - e));
  }
  static getPathLength(t) {
    let e = 0;
    for (let i = 0; i < t.length; ++i)
      e += t[i].pathLength;
    return e;
  }
  static getPointAtLengthOfDataArray(t, e) {
    let i, n = 0, r = e.length;
    if (!r)
      return null;
    for (; n < r && t > e[n].pathLength; )
      t -= e[n].pathLength, ++n;
    if (n === r)
      return i = e[n - 1].points.slice(-2), {
        x: i[0],
        y: i[1]
      };
    if (t < 0.01)
      return e[n].command === "M" ? (i = e[n].points.slice(0, 2), {
        x: i[0],
        y: i[1]
      }) : {
        x: e[n].start.x,
        y: e[n].start.y
      };
    const s = e[n], o = s.points;
    switch (s.command) {
      case "L":
        return gt.getPointOnLine(t, s.start.x, s.start.y, o[0], o[1]);
      case "C":
        return gt.getPointOnCubicBezier((0, pe.t2length)(t, gt.getPathLength(e), (_) => (0, pe.getCubicArcLength)([s.start.x, o[0], o[2], o[4]], [s.start.y, o[1], o[3], o[5]], _)), s.start.x, s.start.y, o[0], o[1], o[2], o[3], o[4], o[5]);
      case "Q":
        return gt.getPointOnQuadraticBezier((0, pe.t2length)(t, gt.getPathLength(e), (_) => (0, pe.getQuadraticArcLength)([s.start.x, o[0], o[2]], [s.start.y, o[1], o[3]], _)), s.start.x, s.start.y, o[0], o[1], o[2], o[3]);
      case "A":
        const l = o[0], d = o[1], c = o[2], p = o[3], f = o[5], g = o[6];
        let u = o[4];
        return u += f * t / s.pathLength, gt.getPointOnEllipticalArc(l, d, c, p, u, g);
    }
    return null;
  }
  static getPointOnLine(t, e, i, n, r, s, o) {
    s = s ?? e, o = o ?? i;
    const l = this.getLineLength(e, i, n, r);
    if (l < 1e-10)
      return { x: e, y: i };
    if (n === e)
      return { x: s, y: o + (r > i ? t : -t) };
    const d = (r - i) / (n - e), c = Math.sqrt(t * t / (1 + d * d)) * (n < e ? -1 : 1), p = d * c;
    if (Math.abs(o - i - d * (s - e)) < 1e-10)
      return { x: s + c, y: o + p };
    const f = ((s - e) * (n - e) + (o - i) * (r - i)) / (l * l), g = e + f * (n - e), u = i + f * (r - i), _ = this.getLineLength(s, o, g, u), y = Math.sqrt(t * t - _ * _), v = Math.sqrt(y * y / (1 + d * d)) * (n < e ? -1 : 1), w = d * v;
    return { x: g + v, y: u + w };
  }
  static getPointOnCubicBezier(t, e, i, n, r, s, o, l, d) {
    function c(y) {
      return y * y * y;
    }
    function p(y) {
      return 3 * y * y * (1 - y);
    }
    function f(y) {
      return 3 * y * (1 - y) * (1 - y);
    }
    function g(y) {
      return (1 - y) * (1 - y) * (1 - y);
    }
    const u = l * c(t) + s * p(t) + n * f(t) + e * g(t), _ = d * c(t) + o * p(t) + r * f(t) + i * g(t);
    return { x: u, y: _ };
  }
  static getPointOnQuadraticBezier(t, e, i, n, r, s, o) {
    function l(g) {
      return g * g;
    }
    function d(g) {
      return 2 * g * (1 - g);
    }
    function c(g) {
      return (1 - g) * (1 - g);
    }
    const p = s * l(t) + n * d(t) + e * c(t), f = o * l(t) + r * d(t) + i * c(t);
    return { x: p, y: f };
  }
  static getPointOnEllipticalArc(t, e, i, n, r, s) {
    const o = Math.cos(s), l = Math.sin(s), d = {
      x: i * Math.cos(r),
      y: n * Math.sin(r)
    };
    return {
      x: t + (d.x * o - d.y * l),
      y: e + (d.x * l + d.y * o)
    };
  }
  static parsePathData(t) {
    if (!t)
      return [];
    let e = t;
    const i = [
      "m",
      "M",
      "l",
      "L",
      "v",
      "V",
      "h",
      "H",
      "z",
      "Z",
      "c",
      "C",
      "q",
      "Q",
      "t",
      "T",
      "s",
      "S",
      "a",
      "A"
    ];
    e = e.replace(new RegExp(" ", "g"), ",");
    for (let p = 0; p < i.length; p++)
      e = e.replace(new RegExp(i[p], "g"), "|" + i[p]);
    const n = e.split("|"), r = [], s = [];
    let o = 0, l = 0;
    const d = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
    let c;
    for (let p = 1; p < n.length; p++) {
      let f = n[p], g = f.charAt(0);
      for (f = f.slice(1), s.length = 0; c = d.exec(f); )
        s.push(c[0]);
      const u = [];
      for (let _ = 0, y = s.length; _ < y; _++) {
        if (s[_] === "00") {
          u.push(0, 0);
          continue;
        }
        const v = parseFloat(s[_]);
        isNaN(v) ? u.push(0) : u.push(v);
      }
      for (; u.length > 0 && !isNaN(u[0]); ) {
        let _ = "", y = [];
        const v = o, w = l;
        let h, m, b, A, M, C, k, x, P, E;
        switch (g) {
          case "l":
            o += u.shift(), l += u.shift(), _ = "L", y.push(o, l);
            break;
          case "L":
            o = u.shift(), l = u.shift(), y.push(o, l);
            break;
          case "m":
            const T = u.shift(), O = u.shift();
            if (o += T, l += O, _ = "M", r.length > 2 && r[r.length - 1].command === "z") {
              for (let $ = r.length - 2; $ >= 0; $--)
                if (r[$].command === "M") {
                  o = r[$].points[0] + T, l = r[$].points[1] + O;
                  break;
                }
            }
            y.push(o, l), g = "l";
            break;
          case "M":
            o = u.shift(), l = u.shift(), _ = "M", y.push(o, l), g = "L";
            break;
          case "h":
            o += u.shift(), _ = "L", y.push(o, l);
            break;
          case "H":
            o = u.shift(), _ = "L", y.push(o, l);
            break;
          case "v":
            l += u.shift(), _ = "L", y.push(o, l);
            break;
          case "V":
            l = u.shift(), _ = "L", y.push(o, l);
            break;
          case "C":
            y.push(u.shift(), u.shift(), u.shift(), u.shift()), o = u.shift(), l = u.shift(), y.push(o, l);
            break;
          case "c":
            y.push(o + u.shift(), l + u.shift(), o + u.shift(), l + u.shift()), o += u.shift(), l += u.shift(), _ = "C", y.push(o, l);
            break;
          case "S":
            m = o, b = l, h = r[r.length - 1], h.command === "C" && (m = o + (o - h.points[2]), b = l + (l - h.points[3])), y.push(m, b, u.shift(), u.shift()), o = u.shift(), l = u.shift(), _ = "C", y.push(o, l);
            break;
          case "s":
            m = o, b = l, h = r[r.length - 1], h.command === "C" && (m = o + (o - h.points[2]), b = l + (l - h.points[3])), y.push(m, b, o + u.shift(), l + u.shift()), o += u.shift(), l += u.shift(), _ = "C", y.push(o, l);
            break;
          case "Q":
            y.push(u.shift(), u.shift()), o = u.shift(), l = u.shift(), y.push(o, l);
            break;
          case "q":
            y.push(o + u.shift(), l + u.shift()), o += u.shift(), l += u.shift(), _ = "Q", y.push(o, l);
            break;
          case "T":
            m = o, b = l, h = r[r.length - 1], h.command === "Q" && (m = o + (o - h.points[0]), b = l + (l - h.points[1])), o = u.shift(), l = u.shift(), _ = "Q", y.push(m, b, o, l);
            break;
          case "t":
            m = o, b = l, h = r[r.length - 1], h.command === "Q" && (m = o + (o - h.points[0]), b = l + (l - h.points[1])), o += u.shift(), l += u.shift(), _ = "Q", y.push(m, b, o, l);
            break;
          case "A":
            A = u.shift(), M = u.shift(), C = u.shift(), k = u.shift(), x = u.shift(), P = o, E = l, o = u.shift(), l = u.shift(), _ = "A", y = this.convertEndpointToCenterParameterization(P, E, o, l, k, x, A, M, C);
            break;
          case "a":
            A = u.shift(), M = u.shift(), C = u.shift(), k = u.shift(), x = u.shift(), P = o, E = l, o += u.shift(), l += u.shift(), _ = "A", y = this.convertEndpointToCenterParameterization(P, E, o, l, k, x, A, M, C);
            break;
        }
        r.push({
          command: _ || g,
          points: y,
          start: {
            x: v,
            y: w
          },
          pathLength: this.calcLength(v, w, _ || g, y)
        });
      }
      (g === "z" || g === "Z") && r.push({
        command: "z",
        points: [],
        start: void 0,
        pathLength: 0
      });
    }
    return r;
  }
  static calcLength(t, e, i, n) {
    let r, s, o, l;
    const d = gt;
    switch (i) {
      case "L":
        return d.getLineLength(t, e, n[0], n[1]);
      case "C":
        return (0, pe.getCubicArcLength)([t, n[0], n[2], n[4]], [e, n[1], n[3], n[5]], 1);
      case "Q":
        return (0, pe.getQuadraticArcLength)([t, n[0], n[2]], [e, n[1], n[3]], 1);
      case "A":
        r = 0;
        const c = n[4], p = n[5], f = n[4] + p;
        let g = Math.PI / 180;
        if (Math.abs(c - f) < g && (g = Math.abs(c - f)), s = d.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], c, 0), p < 0)
          for (l = c - g; l > f; l -= g)
            o = d.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], l, 0), r += d.getLineLength(s.x, s.y, o.x, o.y), s = o;
        else
          for (l = c + g; l < f; l += g)
            o = d.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], l, 0), r += d.getLineLength(s.x, s.y, o.x, o.y), s = o;
        return o = d.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], f, 0), r += d.getLineLength(s.x, s.y, o.x, o.y), r;
    }
    return 0;
  }
  static convertEndpointToCenterParameterization(t, e, i, n, r, s, o, l, d) {
    const c = d * (Math.PI / 180), p = Math.cos(c) * (t - i) / 2 + Math.sin(c) * (e - n) / 2, f = -1 * Math.sin(c) * (t - i) / 2 + Math.cos(c) * (e - n) / 2, g = p * p / (o * o) + f * f / (l * l);
    g > 1 && (o *= Math.sqrt(g), l *= Math.sqrt(g));
    let u = Math.sqrt((o * o * (l * l) - o * o * (f * f) - l * l * (p * p)) / (o * o * (f * f) + l * l * (p * p)));
    r === s && (u *= -1), isNaN(u) && (u = 0);
    const _ = u * o * f / l, y = u * -l * p / o, v = (t + i) / 2 + Math.cos(c) * _ - Math.sin(c) * y, w = (e + n) / 2 + Math.sin(c) * _ + Math.cos(c) * y, h = function(x) {
      return Math.sqrt(x[0] * x[0] + x[1] * x[1]);
    }, m = function(x, P) {
      return (x[0] * P[0] + x[1] * P[1]) / (h(x) * h(P));
    }, b = function(x, P) {
      return (x[0] * P[1] < x[1] * P[0] ? -1 : 1) * Math.acos(m(x, P));
    }, A = b([1, 0], [(p - _) / o, (f - y) / l]), M = [(p - _) / o, (f - y) / l], C = [(-1 * p - _) / o, (-1 * f - y) / l];
    let k = b(M, C);
    return m(M, C) <= -1 && (k = Math.PI), m(M, C) >= 1 && (k = 0), s === 0 && k > 0 && (k = k - 2 * Math.PI), s === 1 && k < 0 && (k = k + 2 * Math.PI), [v, w, o, l, A, k, c, s];
  }
}
Ve.Path = gt;
gt.prototype.className = "Path";
gt.prototype._attrsAffectingSize = ["data"];
(0, Zl._registerNode)(gt);
Xl.Factory.addGetterSetter(gt, "data");
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.Arrow = void 0;
const xi = U, Jl = Ye, Xa = N, Ql = B, Dr = Ve;
class re extends Jl.Line {
  _sceneFunc(t) {
    super._sceneFunc(t);
    const e = Math.PI * 2, i = this.points();
    let n = i;
    const r = this.tension() !== 0 && i.length > 4;
    r && (n = this.getTensionPoints());
    const s = this.pointerLength(), o = i.length;
    let l, d;
    if (r) {
      const f = [
        n[n.length - 4],
        n[n.length - 3],
        n[n.length - 2],
        n[n.length - 1],
        i[o - 2],
        i[o - 1]
      ], g = Dr.Path.calcLength(n[n.length - 4], n[n.length - 3], "C", f), u = Dr.Path.getPointOnQuadraticBezier(Math.min(1, 1 - s / g), f[0], f[1], f[2], f[3], f[4], f[5]);
      l = i[o - 2] - u.x, d = i[o - 1] - u.y;
    } else
      l = i[o - 2] - i[o - 4], d = i[o - 1] - i[o - 3];
    const c = (Math.atan2(d, l) + e) % e, p = this.pointerWidth();
    this.pointerAtEnding() && (t.save(), t.beginPath(), t.translate(i[o - 2], i[o - 1]), t.rotate(c), t.moveTo(0, 0), t.lineTo(-s, p / 2), t.lineTo(-s, -p / 2), t.closePath(), t.restore(), this.__fillStroke(t)), this.pointerAtBeginning() && (t.save(), t.beginPath(), t.translate(i[0], i[1]), r ? (l = (n[0] + n[2]) / 2 - i[0], d = (n[1] + n[3]) / 2 - i[1]) : (l = i[2] - i[0], d = i[3] - i[1]), t.rotate((Math.atan2(-d, -l) + e) % e), t.moveTo(0, 0), t.lineTo(-s, p / 2), t.lineTo(-s, -p / 2), t.closePath(), t.restore(), this.__fillStroke(t));
  }
  __fillStroke(t) {
    const e = this.dashEnabled();
    e && (this.attrs.dashEnabled = !1, t.setLineDash([])), t.fillStrokeShape(this), e && (this.attrs.dashEnabled = !0);
  }
  getSelfRect() {
    const t = super.getSelfRect(), e = this.pointerWidth() / 2;
    return {
      x: t.x,
      y: t.y - e,
      width: t.width,
      height: t.height + e * 2
    };
  }
}
Ai.Arrow = re;
re.prototype.className = "Arrow";
(0, Ql._registerNode)(re);
xi.Factory.addGetterSetter(re, "pointerLength", 10, (0, Xa.getNumberValidator)());
xi.Factory.addGetterSetter(re, "pointerWidth", 10, (0, Xa.getNumberValidator)());
xi.Factory.addGetterSetter(re, "pointerAtBeginning", !1);
xi.Factory.addGetterSetter(re, "pointerAtEnding", !0);
var Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
Mi.Circle = void 0;
const t1 = U, e1 = ft, i1 = N, n1 = B;
class Te extends e1.Shape {
  _sceneFunc(t) {
    t.beginPath(), t.arc(0, 0, this.attrs.radius || 0, 0, Math.PI * 2, !1), t.closePath(), t.fillStrokeShape(this);
  }
  getWidth() {
    return this.radius() * 2;
  }
  getHeight() {
    return this.radius() * 2;
  }
  setWidth(t) {
    this.radius() !== t / 2 && this.radius(t / 2);
  }
  setHeight(t) {
    this.radius() !== t / 2 && this.radius(t / 2);
  }
}
Mi.Circle = Te;
Te.prototype._centroid = !0;
Te.prototype.className = "Circle";
Te.prototype._attrsAffectingSize = ["radius"];
(0, n1._registerNode)(Te);
t1.Factory.addGetterSetter(Te, "radius", 0, (0, i1.getNumberValidator)());
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.Ellipse = void 0;
const qn = U, r1 = ft, Za = N, a1 = B;
class jt extends r1.Shape {
  _sceneFunc(t) {
    const e = this.radiusX(), i = this.radiusY();
    t.beginPath(), t.save(), e !== i && t.scale(1, i / e), t.arc(0, 0, e, 0, Math.PI * 2, !1), t.restore(), t.closePath(), t.fillStrokeShape(this);
  }
  getWidth() {
    return this.radiusX() * 2;
  }
  getHeight() {
    return this.radiusY() * 2;
  }
  setWidth(t) {
    this.radiusX(t / 2);
  }
  setHeight(t) {
    this.radiusY(t / 2);
  }
}
ki.Ellipse = jt;
jt.prototype.className = "Ellipse";
jt.prototype._centroid = !0;
jt.prototype._attrsAffectingSize = ["radiusX", "radiusY"];
(0, a1._registerNode)(jt);
qn.Factory.addComponentsGetterSetter(jt, "radius", ["x", "y"]);
qn.Factory.addGetterSetter(jt, "radiusX", 0, (0, Za.getNumberValidator)());
qn.Factory.addGetterSetter(jt, "radiusY", 0, (0, Za.getNumberValidator)());
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.Image = void 0;
const yn = ot, ae = U, s1 = ft, o1 = B, Xe = N;
let xt = class qa extends s1.Shape {
  constructor(t) {
    super(t), this._loadListener = () => {
      this._requestDraw();
    }, this.on("imageChange.konva", (e) => {
      this._removeImageLoad(e.oldVal), this._setImageLoad();
    }), this._setImageLoad();
  }
  _setImageLoad() {
    const t = this.image();
    t && t.complete || t && t.readyState === 4 || t && t.addEventListener && t.addEventListener("load", this._loadListener);
  }
  _removeImageLoad(t) {
    t && t.removeEventListener && t.removeEventListener("load", this._loadListener);
  }
  destroy() {
    return this._removeImageLoad(this.image()), super.destroy(), this;
  }
  _useBufferCanvas() {
    const t = !!this.cornerRadius(), e = this.hasShadow();
    return t && e ? !0 : super._useBufferCanvas(!0);
  }
  _sceneFunc(t) {
    const e = this.getWidth(), i = this.getHeight(), n = this.cornerRadius(), r = this.attrs.image;
    let s;
    if (r) {
      const o = this.attrs.cropWidth, l = this.attrs.cropHeight;
      o && l ? s = [
        r,
        this.cropX(),
        this.cropY(),
        o,
        l,
        0,
        0,
        e,
        i
      ] : s = [r, 0, 0, e, i];
    }
    (this.hasFill() || this.hasStroke() || n) && (t.beginPath(), n ? yn.Util.drawRoundedRectPath(t, e, i, n) : t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this)), r && (n && t.clip(), t.drawImage.apply(t, s));
  }
  _hitFunc(t) {
    const e = this.width(), i = this.height(), n = this.cornerRadius();
    t.beginPath(), n ? yn.Util.drawRoundedRectPath(t, e, i, n) : t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this);
  }
  getWidth() {
    var t, e;
    return (t = this.attrs.width) !== null && t !== void 0 ? t : (e = this.image()) === null || e === void 0 ? void 0 : e.width;
  }
  getHeight() {
    var t, e;
    return (t = this.attrs.height) !== null && t !== void 0 ? t : (e = this.image()) === null || e === void 0 ? void 0 : e.height;
  }
  static fromURL(t, e, i = null) {
    const n = yn.Util.createImageElement();
    n.onload = function() {
      const r = new qa({
        image: n
      });
      e(r);
    }, n.onerror = i, n.crossOrigin = "Anonymous", n.src = t;
  }
};
Pi.Image = xt;
xt.prototype.className = "Image";
(0, o1._registerNode)(xt);
ae.Factory.addGetterSetter(xt, "cornerRadius", 0, (0, Xe.getNumberOrArrayOfNumbersValidator)(4));
ae.Factory.addGetterSetter(xt, "image");
ae.Factory.addComponentsGetterSetter(xt, "crop", ["x", "y", "width", "height"]);
ae.Factory.addGetterSetter(xt, "cropX", 0, (0, Xe.getNumberValidator)());
ae.Factory.addGetterSetter(xt, "cropY", 0, (0, Xe.getNumberValidator)());
ae.Factory.addGetterSetter(xt, "cropWidth", 0, (0, Xe.getNumberValidator)());
ae.Factory.addGetterSetter(xt, "cropHeight", 0, (0, Xe.getNumberValidator)());
var we = {};
Object.defineProperty(we, "__esModule", { value: !0 });
we.Tag = we.Label = void 0;
const Ei = U, l1 = ft, d1 = Ee, Jn = N, Ja = B, Qa = [
  "fontFamily",
  "fontSize",
  "fontStyle",
  "padding",
  "lineHeight",
  "text",
  "width",
  "height",
  "pointerDirection",
  "pointerWidth",
  "pointerHeight"
], h1 = "Change.konva", c1 = "none", Vn = "up", Tn = "right", $n = "down", Hn = "left", u1 = Qa.length;
class Qn extends d1.Group {
  constructor(t) {
    super(t), this.on("add.konva", function(e) {
      this._addListeners(e.child), this._sync();
    });
  }
  getText() {
    return this.find("Text")[0];
  }
  getTag() {
    return this.find("Tag")[0];
  }
  _addListeners(t) {
    let e = this, i;
    const n = function() {
      e._sync();
    };
    for (i = 0; i < u1; i++)
      t.on(Qa[i] + h1, n);
  }
  getWidth() {
    return this.getText().width();
  }
  getHeight() {
    return this.getText().height();
  }
  _sync() {
    let t = this.getText(), e = this.getTag(), i, n, r, s, o, l, d;
    if (t && e) {
      switch (i = t.width(), n = t.height(), r = e.pointerDirection(), s = e.pointerWidth(), d = e.pointerHeight(), o = 0, l = 0, r) {
        case Vn:
          o = i / 2, l = -1 * d;
          break;
        case Tn:
          o = i + s, l = n / 2;
          break;
        case $n:
          o = i / 2, l = n + d;
          break;
        case Hn:
          o = -1 * s, l = n / 2;
          break;
      }
      e.setAttrs({
        x: -1 * o,
        y: -1 * l,
        width: i,
        height: n
      }), t.setAttrs({
        x: -1 * o,
        y: -1 * l
      });
    }
  }
}
we.Label = Qn;
Qn.prototype.className = "Label";
(0, Ja._registerNode)(Qn);
class se extends l1.Shape {
  _sceneFunc(t) {
    const e = this.width(), i = this.height(), n = this.pointerDirection(), r = this.pointerWidth(), s = this.pointerHeight(), o = this.cornerRadius();
    let l = 0, d = 0, c = 0, p = 0;
    typeof o == "number" ? l = d = c = p = Math.min(o, e / 2, i / 2) : (l = Math.min(o[0] || 0, e / 2, i / 2), d = Math.min(o[1] || 0, e / 2, i / 2), p = Math.min(o[2] || 0, e / 2, i / 2), c = Math.min(o[3] || 0, e / 2, i / 2)), t.beginPath(), t.moveTo(l, 0), n === Vn && (t.lineTo((e - r) / 2, 0), t.lineTo(e / 2, -1 * s), t.lineTo((e + r) / 2, 0)), t.lineTo(e - d, 0), t.arc(e - d, d, d, Math.PI * 3 / 2, 0, !1), n === Tn && (t.lineTo(e, (i - s) / 2), t.lineTo(e + r, i / 2), t.lineTo(e, (i + s) / 2)), t.lineTo(e, i - p), t.arc(e - p, i - p, p, 0, Math.PI / 2, !1), n === $n && (t.lineTo((e + r) / 2, i), t.lineTo(e / 2, i + s), t.lineTo((e - r) / 2, i)), t.lineTo(c, i), t.arc(c, i - c, c, Math.PI / 2, Math.PI, !1), n === Hn && (t.lineTo(0, (i + s) / 2), t.lineTo(-1 * r, i / 2), t.lineTo(0, (i - s) / 2)), t.lineTo(0, l), t.arc(l, l, l, Math.PI, Math.PI * 3 / 2, !1), t.closePath(), t.fillStrokeShape(this);
  }
  getSelfRect() {
    let t = 0, e = 0, i = this.pointerWidth(), n = this.pointerHeight(), r = this.pointerDirection(), s = this.width(), o = this.height();
    return r === Vn ? (e -= n, o += n) : r === $n ? o += n : r === Hn ? (t -= i * 1.5, s += i) : r === Tn && (s += i * 1.5), {
      x: t,
      y: e,
      width: s,
      height: o
    };
  }
}
we.Tag = se;
se.prototype.className = "Tag";
(0, Ja._registerNode)(se);
Ei.Factory.addGetterSetter(se, "pointerDirection", c1);
Ei.Factory.addGetterSetter(se, "pointerWidth", 0, (0, Jn.getNumberValidator)());
Ei.Factory.addGetterSetter(se, "pointerHeight", 0, (0, Jn.getNumberValidator)());
Ei.Factory.addGetterSetter(se, "cornerRadius", 0, (0, Jn.getNumberOrArrayOfNumbersValidator)(4));
var Ze = {};
Object.defineProperty(Ze, "__esModule", { value: !0 });
Ze.Rect = void 0;
const g1 = U, f1 = ft, p1 = B, m1 = ot, _1 = N;
class Li extends f1.Shape {
  _sceneFunc(t) {
    const e = this.cornerRadius(), i = this.width(), n = this.height();
    t.beginPath(), e ? m1.Util.drawRoundedRectPath(t, i, n, e) : t.rect(0, 0, i, n), t.closePath(), t.fillStrokeShape(this);
  }
}
Ze.Rect = Li;
Li.prototype.className = "Rect";
(0, p1._registerNode)(Li);
g1.Factory.addGetterSetter(Li, "cornerRadius", 0, (0, _1.getNumberOrArrayOfNumbersValidator)(4));
var Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
Vi.RegularPolygon = void 0;
const ts = U, y1 = ft, es = N, b1 = B;
class oe extends y1.Shape {
  _sceneFunc(t) {
    const e = this._getPoints();
    t.beginPath(), t.moveTo(e[0].x, e[0].y);
    for (let i = 1; i < e.length; i++)
      t.lineTo(e[i].x, e[i].y);
    t.closePath(), t.fillStrokeShape(this);
  }
  _getPoints() {
    const t = this.attrs.sides, e = this.attrs.radius || 0, i = [];
    for (let n = 0; n < t; n++)
      i.push({
        x: e * Math.sin(n * 2 * Math.PI / t),
        y: -1 * e * Math.cos(n * 2 * Math.PI / t)
      });
    return i;
  }
  getSelfRect() {
    const t = this._getPoints();
    let e = t[0].x, i = t[0].y, n = t[0].x, r = t[0].y;
    return t.forEach((s) => {
      e = Math.min(e, s.x), i = Math.max(i, s.x), n = Math.min(n, s.y), r = Math.max(r, s.y);
    }), {
      x: e,
      y: n,
      width: i - e,
      height: r - n
    };
  }
  getWidth() {
    return this.radius() * 2;
  }
  getHeight() {
    return this.radius() * 2;
  }
  setWidth(t) {
    this.radius(t / 2);
  }
  setHeight(t) {
    this.radius(t / 2);
  }
}
Vi.RegularPolygon = oe;
oe.prototype.className = "RegularPolygon";
oe.prototype._centroid = !0;
oe.prototype._attrsAffectingSize = ["radius"];
(0, b1._registerNode)(oe);
ts.Factory.addGetterSetter(oe, "radius", 0, (0, es.getNumberValidator)());
ts.Factory.addGetterSetter(oe, "sides", 0, (0, es.getNumberValidator)());
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.Ring = void 0;
const is = U, v1 = ft, ns = N, C1 = B, Nr = Math.PI * 2;
class le extends v1.Shape {
  _sceneFunc(t) {
    t.beginPath(), t.arc(0, 0, this.innerRadius(), 0, Nr, !1), t.moveTo(this.outerRadius(), 0), t.arc(0, 0, this.outerRadius(), Nr, 0, !0), t.closePath(), t.fillStrokeShape(this);
  }
  getWidth() {
    return this.outerRadius() * 2;
  }
  getHeight() {
    return this.outerRadius() * 2;
  }
  setWidth(t) {
    this.outerRadius(t / 2);
  }
  setHeight(t) {
    this.outerRadius(t / 2);
  }
}
Ti.Ring = le;
le.prototype.className = "Ring";
le.prototype._centroid = !0;
le.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"];
(0, C1._registerNode)(le);
is.Factory.addGetterSetter(le, "innerRadius", 0, (0, ns.getNumberValidator)());
is.Factory.addGetterSetter(le, "outerRadius", 0, (0, ns.getNumberValidator)());
var $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
$i.Sprite = void 0;
const de = U, w1 = ft, A1 = Le, rs = N, S1 = B;
class Mt extends w1.Shape {
  constructor(t) {
    super(t), this._updated = !0, this.anim = new A1.Animation(() => {
      const e = this._updated;
      return this._updated = !1, e;
    }), this.on("animationChange.konva", function() {
      this.frameIndex(0);
    }), this.on("frameIndexChange.konva", function() {
      this._updated = !0;
    }), this.on("frameRateChange.konva", function() {
      this.anim.isRunning() && (clearInterval(this.interval), this._setInterval());
    });
  }
  _sceneFunc(t) {
    const e = this.animation(), i = this.frameIndex(), n = i * 4, r = this.animations()[e], s = this.frameOffsets(), o = r[n + 0], l = r[n + 1], d = r[n + 2], c = r[n + 3], p = this.image();
    if ((this.hasFill() || this.hasStroke()) && (t.beginPath(), t.rect(0, 0, d, c), t.closePath(), t.fillStrokeShape(this)), p)
      if (s) {
        const f = s[e], g = i * 2;
        t.drawImage(p, o, l, d, c, f[g + 0], f[g + 1], d, c);
      } else
        t.drawImage(p, o, l, d, c, 0, 0, d, c);
  }
  _hitFunc(t) {
    const e = this.animation(), i = this.frameIndex(), n = i * 4, r = this.animations()[e], s = this.frameOffsets(), o = r[n + 2], l = r[n + 3];
    if (t.beginPath(), s) {
      const d = s[e], c = i * 2;
      t.rect(d[c + 0], d[c + 1], o, l);
    } else
      t.rect(0, 0, o, l);
    t.closePath(), t.fillShape(this);
  }
  _useBufferCanvas() {
    return super._useBufferCanvas(!0);
  }
  _setInterval() {
    const t = this;
    this.interval = setInterval(function() {
      t._updateIndex();
    }, 1e3 / this.frameRate());
  }
  start() {
    if (this.isRunning())
      return;
    const t = this.getLayer();
    this.anim.setLayers(t), this._setInterval(), this.anim.start();
  }
  stop() {
    this.anim.stop(), clearInterval(this.interval);
  }
  isRunning() {
    return this.anim.isRunning();
  }
  _updateIndex() {
    const t = this.frameIndex(), e = this.animation(), i = this.animations(), n = i[e], r = n.length / 4;
    t < r - 1 ? this.frameIndex(t + 1) : this.frameIndex(0);
  }
}
$i.Sprite = Mt;
Mt.prototype.className = "Sprite";
(0, S1._registerNode)(Mt);
de.Factory.addGetterSetter(Mt, "animation");
de.Factory.addGetterSetter(Mt, "animations");
de.Factory.addGetterSetter(Mt, "frameOffsets");
de.Factory.addGetterSetter(Mt, "image");
de.Factory.addGetterSetter(Mt, "frameIndex", 0, (0, rs.getNumberValidator)());
de.Factory.addGetterSetter(Mt, "frameRate", 17, (0, rs.getNumberValidator)());
de.Factory.backCompat(Mt, {
  index: "frameIndex",
  getIndex: "getFrameIndex",
  setIndex: "setFrameIndex"
});
var Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.Star = void 0;
const tr = U, x1 = ft, er = N, M1 = B;
class Wt extends x1.Shape {
  _sceneFunc(t) {
    const e = this.innerRadius(), i = this.outerRadius(), n = this.numPoints();
    t.beginPath(), t.moveTo(0, 0 - i);
    for (let r = 1; r < n * 2; r++) {
      const s = r % 2 === 0 ? i : e, o = s * Math.sin(r * Math.PI / n), l = -1 * s * Math.cos(r * Math.PI / n);
      t.lineTo(o, l);
    }
    t.closePath(), t.fillStrokeShape(this);
  }
  getWidth() {
    return this.outerRadius() * 2;
  }
  getHeight() {
    return this.outerRadius() * 2;
  }
  setWidth(t) {
    this.outerRadius(t / 2);
  }
  setHeight(t) {
    this.outerRadius(t / 2);
  }
}
Hi.Star = Wt;
Wt.prototype.className = "Star";
Wt.prototype._centroid = !0;
Wt.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"];
(0, M1._registerNode)(Wt);
tr.Factory.addGetterSetter(Wt, "numPoints", 5, (0, er.getNumberValidator)());
tr.Factory.addGetterSetter(Wt, "innerRadius", 0, (0, er.getNumberValidator)());
tr.Factory.addGetterSetter(Wt, "outerRadius", 0, (0, er.getNumberValidator)());
var $e = {};
Object.defineProperty($e, "__esModule", { value: !0 });
$e.Text = void 0;
$e.stringToArray = qt;
const Rn = ot, _t = U, k1 = ft, bn = B, Kt = N, P1 = B;
function qt(a) {
  return [...a].reduce((t, e, i, n) => {
    if (new RegExp("\\p{Emoji}", "u").test(e)) {
      const r = n[i + 1];
      r && new RegExp("\\p{Emoji_Modifier}|\\u200D", "u").test(r) ? (t.push(e + r), n[i + 1] = "") : t.push(e);
    } else new RegExp("\\p{Regional_Indicator}{2}", "u").test(e + (n[i + 1] || "")) ? t.push(e + n[i + 1]) : i > 0 && new RegExp("\\p{Mn}|\\p{Me}|\\p{Mc}", "u").test(e) ? t[t.length - 1] += e : e && t.push(e);
    return t;
  }, []);
}
const me = "auto", E1 = "center", as = "inherit", Re = "justify", L1 = "Change.konva", V1 = "2d", Ir = "-", ss = "left", T1 = "text", $1 = "Text", H1 = "top", R1 = "bottom", Gr = "middle", os = "normal", O1 = "px ", Qe = " ", F1 = "right", Br = "rtl", D1 = "word", N1 = "char", Ur = "none", vn = "…", ls = [
  "direction",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontVariant",
  "padding",
  "align",
  "verticalAlign",
  "lineHeight",
  "text",
  "width",
  "height",
  "wrap",
  "ellipsis",
  "letterSpacing"
], I1 = ls.length;
function G1(a) {
  return a.split(",").map((t) => {
    t = t.trim();
    const e = t.indexOf(" ") >= 0, i = t.indexOf('"') >= 0 || t.indexOf("'") >= 0;
    return e && !i && (t = `"${t}"`), t;
  }).join(", ");
}
let ti;
function Cn() {
  return ti || (ti = Rn.Util.createCanvasElement().getContext(V1), ti);
}
function B1(a) {
  a.fillText(this._partialText, this._partialTextX, this._partialTextY);
}
function U1(a) {
  a.setAttr("miterLimit", 2), a.strokeText(this._partialText, this._partialTextX, this._partialTextY);
}
function z1(a) {
  return a = a || {}, !a.fillLinearGradientColorStops && !a.fillRadialGradientColorStops && !a.fillPatternImage && (a.fill = a.fill || "black"), a;
}
class dt extends k1.Shape {
  constructor(t) {
    super(z1(t)), this._partialTextX = 0, this._partialTextY = 0;
    for (let e = 0; e < I1; e++)
      this.on(ls[e] + L1, this._setTextData);
    this._setTextData();
  }
  _sceneFunc(t) {
    const e = this.textArr, i = e.length;
    if (!this.text())
      return;
    let n = this.padding(), r = this.fontSize(), s = this.lineHeight() * r, o = this.verticalAlign(), l = this.direction(), d = 0, c = this.align(), p = this.getWidth(), f = this.letterSpacing(), g = this.fill(), u = this.textDecoration(), _ = u.indexOf("underline") !== -1, y = u.indexOf("line-through") !== -1, v;
    l = l === as ? t.direction : l;
    let w = s / 2, h = Gr;
    if (bn.Konva._fixTextRendering) {
      const m = this.measureSize("M");
      h = "alphabetic", w = (m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 + s / 2;
    }
    for (l === Br && t.setAttr("direction", l), t.setAttr("font", this._getContextFont()), t.setAttr("textBaseline", h), t.setAttr("textAlign", ss), o === Gr ? d = (this.getHeight() - i * s - n * 2) / 2 : o === R1 && (d = this.getHeight() - i * s - n * 2), t.translate(n, d + n), v = 0; v < i; v++) {
      let m = 0, b = 0;
      const A = e[v], M = A.text, C = A.width, k = A.lastInParagraph;
      if (t.save(), c === F1 ? m += p - C - n * 2 : c === E1 && (m += (p - C - n * 2) / 2), _) {
        t.save(), t.beginPath();
        const x = bn.Konva._fixTextRendering ? Math.round(r / 4) : Math.round(r / 2), P = m, E = w + b + x;
        t.moveTo(P, E);
        const T = c === Re && !k ? p - n * 2 : C;
        t.lineTo(P + Math.round(T), E), t.lineWidth = r / 15;
        const O = this._getLinearGradient();
        t.strokeStyle = O || g, t.stroke(), t.restore();
      }
      if (y) {
        t.save(), t.beginPath();
        const x = bn.Konva._fixTextRendering ? -Math.round(r / 4) : 0;
        t.moveTo(m, w + b + x);
        const P = c === Re && !k ? p - n * 2 : C;
        t.lineTo(m + Math.round(P), w + b + x), t.lineWidth = r / 15;
        const E = this._getLinearGradient();
        t.strokeStyle = E || g, t.stroke(), t.restore();
      }
      if (l !== Br && (f !== 0 || c === Re)) {
        const x = M.split(" ").length - 1, P = qt(M);
        for (let E = 0; E < P.length; E++) {
          const T = P[E];
          T === " " && !k && c === Re && (m += (p - n * 2 - C) / x), this._partialTextX = m, this._partialTextY = w + b, this._partialText = T, t.fillStrokeShape(this), m += this.measureSize(T).width + f;
        }
      } else
        f !== 0 && t.setAttr("letterSpacing", `${f}px`), this._partialTextX = m, this._partialTextY = w + b, this._partialText = M, t.fillStrokeShape(this);
      t.restore(), i > 1 && (w += s);
    }
  }
  _hitFunc(t) {
    const e = this.getWidth(), i = this.getHeight();
    t.beginPath(), t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this);
  }
  setText(t) {
    const e = Rn.Util._isString(t) ? t : t == null ? "" : t + "";
    return this._setAttr(T1, e), this;
  }
  getWidth() {
    return this.attrs.width === me || this.attrs.width === void 0 ? this.getTextWidth() + this.padding() * 2 : this.attrs.width;
  }
  getHeight() {
    return this.attrs.height === me || this.attrs.height === void 0 ? this.fontSize() * this.textArr.length * this.lineHeight() + this.padding() * 2 : this.attrs.height;
  }
  getTextWidth() {
    return this.textWidth;
  }
  getTextHeight() {
    return Rn.Util.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height."), this.textHeight;
  }
  measureSize(t) {
    var e, i, n, r, s, o, l, d, c, p, f;
    let g = Cn(), u = this.fontSize(), _;
    g.save(), g.font = this._getContextFont(), _ = g.measureText(t), g.restore();
    const y = u / 100;
    return {
      actualBoundingBoxAscent: (e = _.actualBoundingBoxAscent) !== null && e !== void 0 ? e : 71.58203125 * y,
      actualBoundingBoxDescent: (i = _.actualBoundingBoxDescent) !== null && i !== void 0 ? i : 0,
      actualBoundingBoxLeft: (n = _.actualBoundingBoxLeft) !== null && n !== void 0 ? n : -7.421875 * y,
      actualBoundingBoxRight: (r = _.actualBoundingBoxRight) !== null && r !== void 0 ? r : 75.732421875 * y,
      alphabeticBaseline: (s = _.alphabeticBaseline) !== null && s !== void 0 ? s : 0,
      emHeightAscent: (o = _.emHeightAscent) !== null && o !== void 0 ? o : 100 * y,
      emHeightDescent: (l = _.emHeightDescent) !== null && l !== void 0 ? l : -20 * y,
      fontBoundingBoxAscent: (d = _.fontBoundingBoxAscent) !== null && d !== void 0 ? d : 91 * y,
      fontBoundingBoxDescent: (c = _.fontBoundingBoxDescent) !== null && c !== void 0 ? c : 21 * y,
      hangingBaseline: (p = _.hangingBaseline) !== null && p !== void 0 ? p : 72.80000305175781 * y,
      ideographicBaseline: (f = _.ideographicBaseline) !== null && f !== void 0 ? f : -21 * y,
      width: _.width,
      height: u
    };
  }
  _getContextFont() {
    return this.fontStyle() + Qe + this.fontVariant() + Qe + (this.fontSize() + O1) + G1(this.fontFamily());
  }
  _addTextLine(t) {
    this.align() === Re && (t = t.trim());
    const i = this._getTextWidth(t);
    return this.textArr.push({
      text: t,
      width: i,
      lastInParagraph: !1
    });
  }
  _getTextWidth(t) {
    const e = this.letterSpacing(), i = t.length;
    return Cn().measureText(t).width + e * i;
  }
  _setTextData() {
    let t = this.text().split(`
`), e = +this.fontSize(), i = 0, n = this.lineHeight() * e, r = this.attrs.width, s = this.attrs.height, o = r !== me && r !== void 0, l = s !== me && s !== void 0, d = this.padding(), c = r - d * 2, p = s - d * 2, f = 0, g = this.wrap(), u = g !== Ur, _ = g !== N1 && u, y = this.ellipsis();
    this.textArr = [], Cn().font = this._getContextFont();
    const v = y ? this._getTextWidth(vn) : 0;
    for (let w = 0, h = t.length; w < h; ++w) {
      let m = t[w], b = this._getTextWidth(m);
      if (o && b > c)
        for (; m.length > 0; ) {
          let A = 0, M = qt(m).length, C = "", k = 0;
          for (; A < M; ) {
            const x = A + M >>> 1, P = qt(m), E = P.slice(0, x + 1).join(""), T = this._getTextWidth(E);
            (y && l && f + n > p ? T + v : T) <= c ? (A = x + 1, C = E, k = T) : M = x;
          }
          if (C) {
            if (_) {
              const E = qt(m), T = qt(C), O = E[T.length], $ = O === Qe || O === Ir;
              let Z;
              if ($ && k <= c)
                Z = T.length;
              else {
                const H = T.lastIndexOf(Qe), D = T.lastIndexOf(Ir);
                Z = Math.max(H, D) + 1;
              }
              Z > 0 && (A = Z, C = E.slice(0, A).join(""), k = this._getTextWidth(C));
            }
            if (C = C.trimRight(), this._addTextLine(C), i = Math.max(i, k), f += n, this._shouldHandleEllipsis(f)) {
              this._tryToAddEllipsisToLastLine();
              break;
            }
            if (m = qt(m).slice(A).join("").trimLeft(), m.length > 0 && (b = this._getTextWidth(m), b <= c)) {
              this._addTextLine(m), f += n, i = Math.max(i, b);
              break;
            }
          } else
            break;
        }
      else
        this._addTextLine(m), f += n, i = Math.max(i, b), this._shouldHandleEllipsis(f) && w < h - 1 && this._tryToAddEllipsisToLastLine();
      if (this.textArr[this.textArr.length - 1] && (this.textArr[this.textArr.length - 1].lastInParagraph = !0), l && f + n > p)
        break;
    }
    this.textHeight = e, this.textWidth = i;
  }
  _shouldHandleEllipsis(t) {
    const e = +this.fontSize(), i = this.lineHeight() * e, n = this.attrs.height, r = n !== me && n !== void 0, s = this.padding(), o = n - s * 2;
    return !(this.wrap() !== Ur) || r && t + i > o;
  }
  _tryToAddEllipsisToLastLine() {
    const t = this.attrs.width, e = t !== me && t !== void 0, i = this.padding(), n = t - i * 2, r = this.ellipsis(), s = this.textArr[this.textArr.length - 1];
    !s || !r || (e && (this._getTextWidth(s.text + vn) < n || (s.text = s.text.slice(0, s.text.length - 3))), this.textArr.splice(this.textArr.length - 1, 1), this._addTextLine(s.text + vn));
  }
  getStrokeScaleEnabled() {
    return !0;
  }
  _useBufferCanvas() {
    const t = this.textDecoration().indexOf("underline") !== -1 || this.textDecoration().indexOf("line-through") !== -1, e = this.hasShadow();
    return t && e ? !0 : super._useBufferCanvas();
  }
}
$e.Text = dt;
dt.prototype._fillFunc = B1;
dt.prototype._strokeFunc = U1;
dt.prototype.className = $1;
dt.prototype._attrsAffectingSize = [
  "text",
  "fontSize",
  "padding",
  "wrap",
  "lineHeight",
  "letterSpacing"
];
(0, P1._registerNode)(dt);
_t.Factory.overWriteSetter(dt, "width", (0, Kt.getNumberOrAutoValidator)());
_t.Factory.overWriteSetter(dt, "height", (0, Kt.getNumberOrAutoValidator)());
_t.Factory.addGetterSetter(dt, "direction", as);
_t.Factory.addGetterSetter(dt, "fontFamily", "Arial");
_t.Factory.addGetterSetter(dt, "fontSize", 12, (0, Kt.getNumberValidator)());
_t.Factory.addGetterSetter(dt, "fontStyle", os);
_t.Factory.addGetterSetter(dt, "fontVariant", os);
_t.Factory.addGetterSetter(dt, "padding", 0, (0, Kt.getNumberValidator)());
_t.Factory.addGetterSetter(dt, "align", ss);
_t.Factory.addGetterSetter(dt, "verticalAlign", H1);
_t.Factory.addGetterSetter(dt, "lineHeight", 1, (0, Kt.getNumberValidator)());
_t.Factory.addGetterSetter(dt, "wrap", D1);
_t.Factory.addGetterSetter(dt, "ellipsis", !1, (0, Kt.getBooleanValidator)());
_t.Factory.addGetterSetter(dt, "letterSpacing", 0, (0, Kt.getNumberValidator)());
_t.Factory.addGetterSetter(dt, "text", "", (0, Kt.getStringValidator)());
_t.Factory.addGetterSetter(dt, "textDecoration", "");
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.TextPath = void 0;
const wn = ot, At = U, j1 = ft, Oe = Ve, An = $e, ds = N, W1 = B, K1 = "", hs = "normal";
function cs(a) {
  a.fillText(this.partialText, 0, 0);
}
function us(a) {
  a.strokeText(this.partialText, 0, 0);
}
class pt extends j1.Shape {
  constructor(t) {
    super(t), this.dummyCanvas = wn.Util.createCanvasElement(), this.dataArray = [], this._readDataAttribute(), this.on("dataChange.konva", function() {
      this._readDataAttribute(), this._setTextData();
    }), this.on("textChange.konva alignChange.konva letterSpacingChange.konva kerningFuncChange.konva fontSizeChange.konva fontFamilyChange.konva", this._setTextData), this._setTextData();
  }
  _getTextPathLength() {
    return Oe.Path.getPathLength(this.dataArray);
  }
  _getPointAtLength(t) {
    if (!this.attrs.data)
      return null;
    const e = this.pathLength;
    return t - 1 > e ? null : Oe.Path.getPointAtLengthOfDataArray(t, this.dataArray);
  }
  _readDataAttribute() {
    this.dataArray = Oe.Path.parsePathData(this.attrs.data), this.pathLength = this._getTextPathLength();
  }
  _sceneFunc(t) {
    t.setAttr("font", this._getContextFont()), t.setAttr("textBaseline", this.textBaseline()), t.setAttr("textAlign", "left"), t.save();
    const e = this.textDecoration(), i = this.fill(), n = this.fontSize(), r = this.glyphInfo;
    e === "underline" && t.beginPath();
    for (let s = 0; s < r.length; s++) {
      t.save();
      const o = r[s].p0;
      t.translate(o.x, o.y), t.rotate(r[s].rotation), this.partialText = r[s].text, t.fillStrokeShape(this), e === "underline" && (s === 0 && t.moveTo(0, n / 2 + 1), t.lineTo(n, n / 2 + 1)), t.restore();
    }
    e === "underline" && (t.strokeStyle = i, t.lineWidth = n / 20, t.stroke()), t.restore();
  }
  _hitFunc(t) {
    t.beginPath();
    const e = this.glyphInfo;
    if (e.length >= 1) {
      const i = e[0].p0;
      t.moveTo(i.x, i.y);
    }
    for (let i = 0; i < e.length; i++) {
      const n = e[i].p1;
      t.lineTo(n.x, n.y);
    }
    t.setAttr("lineWidth", this.fontSize()), t.setAttr("strokeStyle", this.colorKey), t.stroke();
  }
  getTextWidth() {
    return this.textWidth;
  }
  getTextHeight() {
    return wn.Util.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height."), this.textHeight;
  }
  setText(t) {
    return An.Text.prototype.setText.call(this, t);
  }
  _getContextFont() {
    return An.Text.prototype._getContextFont.call(this);
  }
  _getTextSize(t) {
    const i = this.dummyCanvas.getContext("2d");
    i.save(), i.font = this._getContextFont();
    const n = i.measureText(t);
    return i.restore(), {
      width: n.width,
      height: parseInt(`${this.fontSize()}`, 10)
    };
  }
  _setTextData() {
    const { width: t, height: e } = this._getTextSize(this.attrs.text);
    if (this.textWidth = t, this.textHeight = e, this.glyphInfo = [], !this.attrs.data)
      return null;
    const i = this.letterSpacing(), n = this.align(), r = this.kerningFunc(), s = Math.max(this.textWidth + ((this.attrs.text || "").length - 1) * i, 0);
    let o = 0;
    n === "center" && (o = Math.max(0, this.pathLength / 2 - s / 2)), n === "right" && (o = Math.max(0, this.pathLength - s));
    const l = (0, An.stringToArray)(this.text());
    let d = o;
    for (let c = 0; c < l.length; c++) {
      const p = this._getPointAtLength(d);
      if (!p)
        return;
      let f = this._getTextSize(l[c]).width + i;
      if (l[c] === " " && n === "justify") {
        const w = this.text().split(" ").length - 1;
        f += (this.pathLength - s) / w;
      }
      const g = this._getPointAtLength(d + f);
      if (!g)
        return;
      const u = Oe.Path.getLineLength(p.x, p.y, g.x, g.y);
      let _ = 0;
      if (r)
        try {
          _ = r(l[c - 1], l[c]) * this.fontSize();
        } catch {
          _ = 0;
        }
      p.x += _, g.x += _, this.textWidth += _;
      const y = Oe.Path.getPointOnLine(_ + u / 2, p.x, p.y, g.x, g.y), v = Math.atan2(g.y - p.y, g.x - p.x);
      this.glyphInfo.push({
        transposeX: y.x,
        transposeY: y.y,
        text: l[c],
        rotation: v,
        p0: p,
        p1: g
      }), d += f;
    }
  }
  getSelfRect() {
    if (!this.glyphInfo.length)
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    const t = [];
    this.glyphInfo.forEach(function(d) {
      t.push(d.p0.x), t.push(d.p0.y), t.push(d.p1.x), t.push(d.p1.y);
    });
    let e = t[0] || 0, i = t[0] || 0, n = t[1] || 0, r = t[1] || 0, s, o;
    for (let d = 0; d < t.length / 2; d++)
      s = t[d * 2], o = t[d * 2 + 1], e = Math.min(e, s), i = Math.max(i, s), n = Math.min(n, o), r = Math.max(r, o);
    const l = this.fontSize();
    return {
      x: e - l / 2,
      y: n - l / 2,
      width: i - e + l,
      height: r - n + l
    };
  }
  destroy() {
    return wn.Util.releaseCanvas(this.dummyCanvas), super.destroy();
  }
}
Ri.TextPath = pt;
pt.prototype._fillFunc = cs;
pt.prototype._strokeFunc = us;
pt.prototype._fillFuncHit = cs;
pt.prototype._strokeFuncHit = us;
pt.prototype.className = "TextPath";
pt.prototype._attrsAffectingSize = ["text", "fontSize", "data"];
(0, W1._registerNode)(pt);
At.Factory.addGetterSetter(pt, "data");
At.Factory.addGetterSetter(pt, "fontFamily", "Arial");
At.Factory.addGetterSetter(pt, "fontSize", 12, (0, ds.getNumberValidator)());
At.Factory.addGetterSetter(pt, "fontStyle", hs);
At.Factory.addGetterSetter(pt, "align", "left");
At.Factory.addGetterSetter(pt, "letterSpacing", 0, (0, ds.getNumberValidator)());
At.Factory.addGetterSetter(pt, "textBaseline", "middle");
At.Factory.addGetterSetter(pt, "fontVariant", hs);
At.Factory.addGetterSetter(pt, "text", K1);
At.Factory.addGetterSetter(pt, "textDecoration", "");
At.Factory.addGetterSetter(pt, "kerningFunc", void 0);
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.Transformer = void 0;
const J = ot, X = U, zr = at, Y1 = ft, X1 = Ze, jr = Ee, Ct = B, Yt = N, Z1 = B, gs = "tr-konva", q1 = [
  "resizeEnabledChange",
  "rotateAnchorOffsetChange",
  "rotateEnabledChange",
  "enabledAnchorsChange",
  "anchorSizeChange",
  "borderEnabledChange",
  "borderStrokeChange",
  "borderStrokeWidthChange",
  "borderDashChange",
  "anchorStrokeChange",
  "anchorStrokeWidthChange",
  "anchorFillChange",
  "anchorCornerRadiusChange",
  "ignoreStrokeChange",
  "anchorStyleFuncChange"
].map((a) => a + `.${gs}`).join(" "), Wr = "nodesRect", J1 = [
  "widthChange",
  "heightChange",
  "scaleXChange",
  "scaleYChange",
  "skewXChange",
  "skewYChange",
  "rotationChange",
  "offsetXChange",
  "offsetYChange",
  "transformsEnabledChange",
  "strokeWidthChange"
], Q1 = {
  "top-left": -45,
  "top-center": 0,
  "top-right": 45,
  "middle-right": -90,
  "middle-left": 90,
  "bottom-left": -135,
  "bottom-center": 180,
  "bottom-right": 135
}, td = "ontouchstart" in Ct.Konva._global;
function ed(a, t, e) {
  if (a === "rotater")
    return e;
  t += J.Util.degToRad(Q1[a] || 0);
  const i = (J.Util.radToDeg(t) % 360 + 360) % 360;
  return J.Util._inRange(i, 315 + 22.5, 360) || J.Util._inRange(i, 0, 22.5) ? "ns-resize" : J.Util._inRange(i, 45 - 22.5, 45 + 22.5) ? "nesw-resize" : J.Util._inRange(i, 90 - 22.5, 90 + 22.5) ? "ew-resize" : J.Util._inRange(i, 135 - 22.5, 135 + 22.5) ? "nwse-resize" : J.Util._inRange(i, 180 - 22.5, 180 + 22.5) ? "ns-resize" : J.Util._inRange(i, 225 - 22.5, 225 + 22.5) ? "nesw-resize" : J.Util._inRange(i, 270 - 22.5, 270 + 22.5) ? "ew-resize" : J.Util._inRange(i, 315 - 22.5, 315 + 22.5) ? "nwse-resize" : (J.Util.error("Transformer has unknown angle for cursor detection: " + i), "pointer");
}
const hi = [
  "top-left",
  "top-center",
  "top-right",
  "middle-right",
  "middle-left",
  "bottom-left",
  "bottom-center",
  "bottom-right"
];
function id(a) {
  return {
    x: a.x + a.width / 2 * Math.cos(a.rotation) + a.height / 2 * Math.sin(-a.rotation),
    y: a.y + a.height / 2 * Math.cos(a.rotation) + a.width / 2 * Math.sin(a.rotation)
  };
}
function fs(a, t, e) {
  const i = e.x + (a.x - e.x) * Math.cos(t) - (a.y - e.y) * Math.sin(t), n = e.y + (a.x - e.x) * Math.sin(t) + (a.y - e.y) * Math.cos(t);
  return {
    ...a,
    rotation: a.rotation + t,
    x: i,
    y: n
  };
}
function nd(a, t) {
  const e = id(a);
  return fs(a, t, e);
}
function rd(a, t, e) {
  let i = t;
  for (let n = 0; n < a.length; n++) {
    const r = Ct.Konva.getAngle(a[n]), s = Math.abs(r - t) % (Math.PI * 2);
    Math.min(s, Math.PI * 2 - s) < e && (i = r);
  }
  return i;
}
let On = 0;
class W extends jr.Group {
  constructor(t) {
    super(t), this._movingAnchorName = null, this._transforming = !1, this._createElements(), this._handleMouseMove = this._handleMouseMove.bind(this), this._handleMouseUp = this._handleMouseUp.bind(this), this.update = this.update.bind(this), this.on(q1, this.update), this.getNode() && this.update();
  }
  attachTo(t) {
    return this.setNode(t), this;
  }
  setNode(t) {
    return J.Util.warn("tr.setNode(shape), tr.node(shape) and tr.attachTo(shape) methods are deprecated. Please use tr.nodes(nodesArray) instead."), this.setNodes([t]);
  }
  getNode() {
    return this._nodes && this._nodes[0];
  }
  _getEventNamespace() {
    return gs + this._id;
  }
  setNodes(t = []) {
    this._nodes && this._nodes.length && this.detach();
    const e = t.filter((n) => n.isAncestorOf(this) ? (J.Util.error("Konva.Transformer cannot be an a child of the node you are trying to attach"), !1) : !0);
    return this._nodes = t = e, t.length === 1 && this.useSingleNodeRotation() ? this.rotation(t[0].getAbsoluteRotation()) : this.rotation(0), this._nodes.forEach((n) => {
      const r = () => {
        this.nodes().length === 1 && this.useSingleNodeRotation() && this.rotation(this.nodes()[0].getAbsoluteRotation()), this._resetTransformCache(), !this._transforming && !this.isDragging() && this.update();
      };
      if (n._attrsAffectingSize.length) {
        const s = n._attrsAffectingSize.map((o) => o + "Change." + this._getEventNamespace()).join(" ");
        n.on(s, r);
      }
      n.on(J1.map((s) => s + `.${this._getEventNamespace()}`).join(" "), r), n.on(`absoluteTransformChange.${this._getEventNamespace()}`, r), this._proxyDrag(n);
    }), this._resetTransformCache(), !!this.findOne(".top-left") && this.update(), this;
  }
  _proxyDrag(t) {
    let e;
    t.on(`dragstart.${this._getEventNamespace()}`, (i) => {
      e = t.getAbsolutePosition(), !this.isDragging() && t !== this.findOne(".back") && this.startDrag(i, !1);
    }), t.on(`dragmove.${this._getEventNamespace()}`, (i) => {
      if (!e)
        return;
      const n = t.getAbsolutePosition(), r = n.x - e.x, s = n.y - e.y;
      this.nodes().forEach((o) => {
        if (o === t || o.isDragging())
          return;
        const l = o.getAbsolutePosition();
        o.setAbsolutePosition({
          x: l.x + r,
          y: l.y + s
        }), o.startDrag(i);
      }), e = null;
    });
  }
  getNodes() {
    return this._nodes || [];
  }
  getActiveAnchor() {
    return this._movingAnchorName;
  }
  detach() {
    this._nodes && this._nodes.forEach((t) => {
      t.off("." + this._getEventNamespace());
    }), this._nodes = [], this._resetTransformCache();
  }
  _resetTransformCache() {
    this._clearCache(Wr), this._clearCache("transform"), this._clearSelfAndDescendantCache("absoluteTransform");
  }
  _getNodeRect() {
    return this._getCache(Wr, this.__getNodeRect);
  }
  __getNodeShape(t, e = this.rotation(), i) {
    const n = t.getClientRect({
      skipTransform: !0,
      skipShadow: !0,
      skipStroke: this.ignoreStroke()
    }), r = t.getAbsoluteScale(i), s = t.getAbsolutePosition(i), o = n.x * r.x - t.offsetX() * r.x, l = n.y * r.y - t.offsetY() * r.y, d = (Ct.Konva.getAngle(t.getAbsoluteRotation()) + Math.PI * 2) % (Math.PI * 2), c = {
      x: s.x + o * Math.cos(d) + l * Math.sin(-d),
      y: s.y + l * Math.cos(d) + o * Math.sin(d),
      width: n.width * r.x,
      height: n.height * r.y,
      rotation: d
    };
    return fs(c, -Ct.Konva.getAngle(e), {
      x: 0,
      y: 0
    });
  }
  __getNodeRect() {
    if (!this.getNode())
      return {
        x: -1e8,
        y: -1e8,
        width: 0,
        height: 0,
        rotation: 0
      };
    const e = [];
    this.nodes().map((d) => {
      const c = d.getClientRect({
        skipTransform: !0,
        skipShadow: !0,
        skipStroke: this.ignoreStroke()
      }), p = [
        { x: c.x, y: c.y },
        { x: c.x + c.width, y: c.y },
        { x: c.x + c.width, y: c.y + c.height },
        { x: c.x, y: c.y + c.height }
      ], f = d.getAbsoluteTransform();
      p.forEach(function(g) {
        const u = f.point(g);
        e.push(u);
      });
    });
    const i = new J.Transform();
    i.rotate(-Ct.Konva.getAngle(this.rotation()));
    let n = 1 / 0, r = 1 / 0, s = -1 / 0, o = -1 / 0;
    e.forEach(function(d) {
      const c = i.point(d);
      n === void 0 && (n = s = c.x, r = o = c.y), n = Math.min(n, c.x), r = Math.min(r, c.y), s = Math.max(s, c.x), o = Math.max(o, c.y);
    }), i.invert();
    const l = i.point({ x: n, y: r });
    return {
      x: l.x,
      y: l.y,
      width: s - n,
      height: o - r,
      rotation: Ct.Konva.getAngle(this.rotation())
    };
  }
  getX() {
    return this._getNodeRect().x;
  }
  getY() {
    return this._getNodeRect().y;
  }
  getWidth() {
    return this._getNodeRect().width;
  }
  getHeight() {
    return this._getNodeRect().height;
  }
  _createElements() {
    this._createBack(), hi.forEach((t) => {
      this._createAnchor(t);
    }), this._createAnchor("rotater");
  }
  _createAnchor(t) {
    const e = new X1.Rect({
      stroke: "rgb(0, 161, 255)",
      fill: "white",
      strokeWidth: 1,
      name: t + " _anchor",
      dragDistance: 0,
      draggable: !0,
      hitStrokeWidth: td ? 10 : "auto"
    }), i = this;
    e.on("mousedown touchstart", function(n) {
      i._handleMouseDown(n);
    }), e.on("dragstart", (n) => {
      e.stopDrag(), n.cancelBubble = !0;
    }), e.on("dragend", (n) => {
      n.cancelBubble = !0;
    }), e.on("mouseenter", () => {
      const n = Ct.Konva.getAngle(this.rotation()), r = this.rotateAnchorCursor(), s = ed(t, n, r);
      e.getStage().content && (e.getStage().content.style.cursor = s), this._cursorChange = !0;
    }), e.on("mouseout", () => {
      e.getStage().content && (e.getStage().content.style.cursor = ""), this._cursorChange = !1;
    }), this.add(e);
  }
  _createBack() {
    const t = new Y1.Shape({
      name: "back",
      width: 0,
      height: 0,
      draggable: !0,
      sceneFunc(e, i) {
        const n = i.getParent(), r = n.padding();
        e.beginPath(), e.rect(-r, -r, i.width() + r * 2, i.height() + r * 2), e.moveTo(i.width() / 2, -r), n.rotateEnabled() && n.rotateLineVisible() && e.lineTo(i.width() / 2, -n.rotateAnchorOffset() * J.Util._sign(i.height()) - r), e.fillStrokeShape(i);
      },
      hitFunc: (e, i) => {
        if (!this.shouldOverdrawWholeArea())
          return;
        const n = this.padding();
        e.beginPath(), e.rect(-n, -n, i.width() + n * 2, i.height() + n * 2), e.fillStrokeShape(i);
      }
    });
    this.add(t), this._proxyDrag(t), t.on("dragstart", (e) => {
      e.cancelBubble = !0;
    }), t.on("dragmove", (e) => {
      e.cancelBubble = !0;
    }), t.on("dragend", (e) => {
      e.cancelBubble = !0;
    }), this.on("dragmove", (e) => {
      this.update();
    });
  }
  _handleMouseDown(t) {
    if (this._transforming)
      return;
    this._movingAnchorName = t.target.name().split(" ")[0];
    const e = this._getNodeRect(), i = e.width, n = e.height, r = Math.sqrt(Math.pow(i, 2) + Math.pow(n, 2));
    this.sin = Math.abs(n / r), this.cos = Math.abs(i / r), typeof window < "u" && (window.addEventListener("mousemove", this._handleMouseMove), window.addEventListener("touchmove", this._handleMouseMove), window.addEventListener("mouseup", this._handleMouseUp, !0), window.addEventListener("touchend", this._handleMouseUp, !0)), this._transforming = !0;
    const s = t.target.getAbsolutePosition(), o = t.target.getStage().getPointerPosition();
    this._anchorDragOffset = {
      x: o.x - s.x,
      y: o.y - s.y
    }, On++, this._fire("transformstart", { evt: t.evt, target: this.getNode() }), this._nodes.forEach((l) => {
      l._fire("transformstart", { evt: t.evt, target: l });
    });
  }
  _handleMouseMove(t) {
    let e, i, n;
    const r = this.findOne("." + this._movingAnchorName), s = r.getStage();
    s.setPointersPositions(t);
    const o = s.getPointerPosition();
    let l = {
      x: o.x - this._anchorDragOffset.x,
      y: o.y - this._anchorDragOffset.y
    };
    const d = r.getAbsolutePosition();
    this.anchorDragBoundFunc() && (l = this.anchorDragBoundFunc()(d, l, t)), r.setAbsolutePosition(l);
    const c = r.getAbsolutePosition();
    if (d.x === c.x && d.y === c.y)
      return;
    if (this._movingAnchorName === "rotater") {
      const w = this._getNodeRect();
      e = r.x() - w.width / 2, i = -r.y() + w.height / 2;
      let h = Math.atan2(-i, e) + Math.PI / 2;
      w.height < 0 && (h -= Math.PI);
      const b = Ct.Konva.getAngle(this.rotation()) + h, A = Ct.Konva.getAngle(this.rotationSnapTolerance()), C = rd(this.rotationSnaps(), b, A) - w.rotation, k = nd(w, C);
      this._fitNodesInto(k, t);
      return;
    }
    const p = this.shiftBehavior();
    let f;
    p === "inverted" ? f = this.keepRatio() && !t.shiftKey : p === "none" ? f = this.keepRatio() : f = this.keepRatio() || t.shiftKey;
    let g = this.centeredScaling() || t.altKey;
    if (this._movingAnchorName === "top-left") {
      if (f) {
        const w = g ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".bottom-right").x(),
          y: this.findOne(".bottom-right").y()
        };
        n = Math.sqrt(Math.pow(w.x - r.x(), 2) + Math.pow(w.y - r.y(), 2));
        const h = this.findOne(".top-left").x() > w.x ? -1 : 1, m = this.findOne(".top-left").y() > w.y ? -1 : 1;
        e = n * this.cos * h, i = n * this.sin * m, this.findOne(".top-left").x(w.x - e), this.findOne(".top-left").y(w.y - i);
      }
    } else if (this._movingAnchorName === "top-center")
      this.findOne(".top-left").y(r.y());
    else if (this._movingAnchorName === "top-right") {
      if (f) {
        const w = g ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".bottom-left").x(),
          y: this.findOne(".bottom-left").y()
        };
        n = Math.sqrt(Math.pow(r.x() - w.x, 2) + Math.pow(w.y - r.y(), 2));
        const h = this.findOne(".top-right").x() < w.x ? -1 : 1, m = this.findOne(".top-right").y() > w.y ? -1 : 1;
        e = n * this.cos * h, i = n * this.sin * m, this.findOne(".top-right").x(w.x + e), this.findOne(".top-right").y(w.y - i);
      }
      var u = r.position();
      this.findOne(".top-left").y(u.y), this.findOne(".bottom-right").x(u.x);
    } else if (this._movingAnchorName === "middle-left")
      this.findOne(".top-left").x(r.x());
    else if (this._movingAnchorName === "middle-right")
      this.findOne(".bottom-right").x(r.x());
    else if (this._movingAnchorName === "bottom-left") {
      if (f) {
        const w = g ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".top-right").x(),
          y: this.findOne(".top-right").y()
        };
        n = Math.sqrt(Math.pow(w.x - r.x(), 2) + Math.pow(r.y() - w.y, 2));
        const h = w.x < r.x() ? -1 : 1, m = r.y() < w.y ? -1 : 1;
        e = n * this.cos * h, i = n * this.sin * m, r.x(w.x - e), r.y(w.y + i);
      }
      u = r.position(), this.findOne(".top-left").x(u.x), this.findOne(".bottom-right").y(u.y);
    } else if (this._movingAnchorName === "bottom-center")
      this.findOne(".bottom-right").y(r.y());
    else if (this._movingAnchorName === "bottom-right" && f) {
      const w = g ? {
        x: this.width() / 2,
        y: this.height() / 2
      } : {
        x: this.findOne(".top-left").x(),
        y: this.findOne(".top-left").y()
      };
      n = Math.sqrt(Math.pow(r.x() - w.x, 2) + Math.pow(r.y() - w.y, 2));
      const h = this.findOne(".bottom-right").x() < w.x ? -1 : 1, m = this.findOne(".bottom-right").y() < w.y ? -1 : 1;
      e = n * this.cos * h, i = n * this.sin * m, this.findOne(".bottom-right").x(w.x + e), this.findOne(".bottom-right").y(w.y + i);
    }
    if (g = this.centeredScaling() || t.altKey, g) {
      const w = this.findOne(".top-left"), h = this.findOne(".bottom-right"), m = w.x(), b = w.y(), A = this.getWidth() - h.x(), M = this.getHeight() - h.y();
      h.move({
        x: -m,
        y: -b
      }), w.move({
        x: A,
        y: M
      });
    }
    const _ = this.findOne(".top-left").getAbsolutePosition();
    e = _.x, i = _.y;
    const y = this.findOne(".bottom-right").x() - this.findOne(".top-left").x(), v = this.findOne(".bottom-right").y() - this.findOne(".top-left").y();
    this._fitNodesInto({
      x: e,
      y: i,
      width: y,
      height: v,
      rotation: Ct.Konva.getAngle(this.rotation())
    }, t);
  }
  _handleMouseUp(t) {
    this._removeEvents(t);
  }
  getAbsoluteTransform() {
    return this.getTransform();
  }
  _removeEvents(t) {
    var e;
    if (this._transforming) {
      this._transforming = !1, typeof window < "u" && (window.removeEventListener("mousemove", this._handleMouseMove), window.removeEventListener("touchmove", this._handleMouseMove), window.removeEventListener("mouseup", this._handleMouseUp, !0), window.removeEventListener("touchend", this._handleMouseUp, !0));
      const i = this.getNode();
      On--, this._fire("transformend", { evt: t, target: i }), (e = this.getLayer()) === null || e === void 0 || e.batchDraw(), i && this._nodes.forEach((n) => {
        var r;
        n._fire("transformend", { evt: t, target: n }), (r = n.getLayer()) === null || r === void 0 || r.batchDraw();
      }), this._movingAnchorName = null;
    }
  }
  _fitNodesInto(t, e) {
    const i = this._getNodeRect(), n = 1;
    if (J.Util._inRange(t.width, -this.padding() * 2 - n, n)) {
      this.update();
      return;
    }
    if (J.Util._inRange(t.height, -this.padding() * 2 - n, n)) {
      this.update();
      return;
    }
    const r = new J.Transform();
    if (r.rotate(Ct.Konva.getAngle(this.rotation())), this._movingAnchorName && t.width < 0 && this._movingAnchorName.indexOf("left") >= 0) {
      const f = r.point({
        x: -this.padding() * 2,
        y: 0
      });
      t.x += f.x, t.y += f.y, t.width += this.padding() * 2, this._movingAnchorName = this._movingAnchorName.replace("left", "right"), this._anchorDragOffset.x -= f.x, this._anchorDragOffset.y -= f.y;
    } else if (this._movingAnchorName && t.width < 0 && this._movingAnchorName.indexOf("right") >= 0) {
      const f = r.point({
        x: this.padding() * 2,
        y: 0
      });
      this._movingAnchorName = this._movingAnchorName.replace("right", "left"), this._anchorDragOffset.x -= f.x, this._anchorDragOffset.y -= f.y, t.width += this.padding() * 2;
    }
    if (this._movingAnchorName && t.height < 0 && this._movingAnchorName.indexOf("top") >= 0) {
      const f = r.point({
        x: 0,
        y: -this.padding() * 2
      });
      t.x += f.x, t.y += f.y, this._movingAnchorName = this._movingAnchorName.replace("top", "bottom"), this._anchorDragOffset.x -= f.x, this._anchorDragOffset.y -= f.y, t.height += this.padding() * 2;
    } else if (this._movingAnchorName && t.height < 0 && this._movingAnchorName.indexOf("bottom") >= 0) {
      const f = r.point({
        x: 0,
        y: this.padding() * 2
      });
      this._movingAnchorName = this._movingAnchorName.replace("bottom", "top"), this._anchorDragOffset.x -= f.x, this._anchorDragOffset.y -= f.y, t.height += this.padding() * 2;
    }
    if (this.boundBoxFunc()) {
      const f = this.boundBoxFunc()(i, t);
      f ? t = f : J.Util.warn("boundBoxFunc returned falsy. You should return new bound rect from it!");
    }
    const s = 1e7, o = new J.Transform();
    o.translate(i.x, i.y), o.rotate(i.rotation), o.scale(i.width / s, i.height / s);
    const l = new J.Transform(), d = t.width / s, c = t.height / s;
    this.flipEnabled() === !1 ? (l.translate(t.x, t.y), l.rotate(t.rotation), l.translate(t.width < 0 ? t.width : 0, t.height < 0 ? t.height : 0), l.scale(Math.abs(d), Math.abs(c))) : (l.translate(t.x, t.y), l.rotate(t.rotation), l.scale(d, c));
    const p = l.multiply(o.invert());
    this._nodes.forEach((f) => {
      var g;
      const u = f.getParent().getAbsoluteTransform(), _ = f.getTransform().copy();
      _.translate(f.offsetX(), f.offsetY());
      const y = new J.Transform();
      y.multiply(u.copy().invert()).multiply(p).multiply(u).multiply(_);
      const v = y.decompose();
      f.setAttrs(v), (g = f.getLayer()) === null || g === void 0 || g.batchDraw();
    }), this.rotation(J.Util._getRotation(t.rotation)), this._nodes.forEach((f) => {
      this._fire("transform", { evt: e, target: f }), f._fire("transform", { evt: e, target: f });
    }), this._resetTransformCache(), this.update(), this.getLayer().batchDraw();
  }
  forceUpdate() {
    this._resetTransformCache(), this.update();
  }
  _batchChangeChild(t, e) {
    this.findOne(t).setAttrs(e);
  }
  update() {
    var t;
    const e = this._getNodeRect();
    this.rotation(J.Util._getRotation(e.rotation));
    const i = e.width, n = e.height, r = this.enabledAnchors(), s = this.resizeEnabled(), o = this.padding(), l = this.anchorSize(), d = this.find("._anchor");
    d.forEach((p) => {
      p.setAttrs({
        width: l,
        height: l,
        offsetX: l / 2,
        offsetY: l / 2,
        stroke: this.anchorStroke(),
        strokeWidth: this.anchorStrokeWidth(),
        fill: this.anchorFill(),
        cornerRadius: this.anchorCornerRadius()
      });
    }), this._batchChangeChild(".top-left", {
      x: 0,
      y: 0,
      offsetX: l / 2 + o,
      offsetY: l / 2 + o,
      visible: s && r.indexOf("top-left") >= 0
    }), this._batchChangeChild(".top-center", {
      x: i / 2,
      y: 0,
      offsetY: l / 2 + o,
      visible: s && r.indexOf("top-center") >= 0
    }), this._batchChangeChild(".top-right", {
      x: i,
      y: 0,
      offsetX: l / 2 - o,
      offsetY: l / 2 + o,
      visible: s && r.indexOf("top-right") >= 0
    }), this._batchChangeChild(".middle-left", {
      x: 0,
      y: n / 2,
      offsetX: l / 2 + o,
      visible: s && r.indexOf("middle-left") >= 0
    }), this._batchChangeChild(".middle-right", {
      x: i,
      y: n / 2,
      offsetX: l / 2 - o,
      visible: s && r.indexOf("middle-right") >= 0
    }), this._batchChangeChild(".bottom-left", {
      x: 0,
      y: n,
      offsetX: l / 2 + o,
      offsetY: l / 2 - o,
      visible: s && r.indexOf("bottom-left") >= 0
    }), this._batchChangeChild(".bottom-center", {
      x: i / 2,
      y: n,
      offsetY: l / 2 - o,
      visible: s && r.indexOf("bottom-center") >= 0
    }), this._batchChangeChild(".bottom-right", {
      x: i,
      y: n,
      offsetX: l / 2 - o,
      offsetY: l / 2 - o,
      visible: s && r.indexOf("bottom-right") >= 0
    }), this._batchChangeChild(".rotater", {
      x: i / 2,
      y: -this.rotateAnchorOffset() * J.Util._sign(n) - o,
      visible: this.rotateEnabled()
    }), this._batchChangeChild(".back", {
      width: i,
      height: n,
      visible: this.borderEnabled(),
      stroke: this.borderStroke(),
      strokeWidth: this.borderStrokeWidth(),
      dash: this.borderDash(),
      x: 0,
      y: 0
    });
    const c = this.anchorStyleFunc();
    c && d.forEach((p) => {
      c(p);
    }), (t = this.getLayer()) === null || t === void 0 || t.batchDraw();
  }
  isTransforming() {
    return this._transforming;
  }
  stopTransform() {
    if (this._transforming) {
      this._removeEvents();
      const t = this.findOne("." + this._movingAnchorName);
      t && t.stopDrag();
    }
  }
  destroy() {
    return this.getStage() && this._cursorChange && this.getStage().content && (this.getStage().content.style.cursor = ""), jr.Group.prototype.destroy.call(this), this.detach(), this._removeEvents(), this;
  }
  toObject() {
    return zr.Node.prototype.toObject.call(this);
  }
  clone(t) {
    return zr.Node.prototype.clone.call(this, t);
  }
  getClientRect() {
    return this.nodes().length > 0 ? super.getClientRect() : { x: 0, y: 0, width: 0, height: 0 };
  }
}
Oi.Transformer = W;
W.isTransforming = () => On > 0;
function ad(a) {
  return a instanceof Array || J.Util.warn("enabledAnchors value should be an array"), a instanceof Array && a.forEach(function(t) {
    hi.indexOf(t) === -1 && J.Util.warn("Unknown anchor name: " + t + ". Available names are: " + hi.join(", "));
  }), a || [];
}
W.prototype.className = "Transformer";
(0, Z1._registerNode)(W);
X.Factory.addGetterSetter(W, "enabledAnchors", hi, ad);
X.Factory.addGetterSetter(W, "flipEnabled", !0, (0, Yt.getBooleanValidator)());
X.Factory.addGetterSetter(W, "resizeEnabled", !0);
X.Factory.addGetterSetter(W, "anchorSize", 10, (0, Yt.getNumberValidator)());
X.Factory.addGetterSetter(W, "rotateEnabled", !0);
X.Factory.addGetterSetter(W, "rotateLineVisible", !0);
X.Factory.addGetterSetter(W, "rotationSnaps", []);
X.Factory.addGetterSetter(W, "rotateAnchorOffset", 50, (0, Yt.getNumberValidator)());
X.Factory.addGetterSetter(W, "rotateAnchorCursor", "crosshair");
X.Factory.addGetterSetter(W, "rotationSnapTolerance", 5, (0, Yt.getNumberValidator)());
X.Factory.addGetterSetter(W, "borderEnabled", !0);
X.Factory.addGetterSetter(W, "anchorStroke", "rgb(0, 161, 255)");
X.Factory.addGetterSetter(W, "anchorStrokeWidth", 1, (0, Yt.getNumberValidator)());
X.Factory.addGetterSetter(W, "anchorFill", "white");
X.Factory.addGetterSetter(W, "anchorCornerRadius", 0, (0, Yt.getNumberValidator)());
X.Factory.addGetterSetter(W, "borderStroke", "rgb(0, 161, 255)");
X.Factory.addGetterSetter(W, "borderStrokeWidth", 1, (0, Yt.getNumberValidator)());
X.Factory.addGetterSetter(W, "borderDash");
X.Factory.addGetterSetter(W, "keepRatio", !0);
X.Factory.addGetterSetter(W, "shiftBehavior", "default");
X.Factory.addGetterSetter(W, "centeredScaling", !1);
X.Factory.addGetterSetter(W, "ignoreStroke", !1);
X.Factory.addGetterSetter(W, "padding", 0, (0, Yt.getNumberValidator)());
X.Factory.addGetterSetter(W, "nodes");
X.Factory.addGetterSetter(W, "node");
X.Factory.addGetterSetter(W, "boundBoxFunc");
X.Factory.addGetterSetter(W, "anchorDragBoundFunc");
X.Factory.addGetterSetter(W, "anchorStyleFunc");
X.Factory.addGetterSetter(W, "shouldOverdrawWholeArea", !1);
X.Factory.addGetterSetter(W, "useSingleNodeRotation", !0);
X.Factory.backCompat(W, {
  lineEnabled: "borderEnabled",
  rotateHandlerOffset: "rotateAnchorOffset",
  enabledHandlers: "enabledAnchors"
});
var Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.Wedge = void 0;
const Di = U, sd = ft, od = B, ps = N, ld = B;
class Ot extends sd.Shape {
  _sceneFunc(t) {
    t.beginPath(), t.arc(0, 0, this.radius(), 0, od.Konva.getAngle(this.angle()), this.clockwise()), t.lineTo(0, 0), t.closePath(), t.fillStrokeShape(this);
  }
  getWidth() {
    return this.radius() * 2;
  }
  getHeight() {
    return this.radius() * 2;
  }
  setWidth(t) {
    this.radius(t / 2);
  }
  setHeight(t) {
    this.radius(t / 2);
  }
}
Fi.Wedge = Ot;
Ot.prototype.className = "Wedge";
Ot.prototype._centroid = !0;
Ot.prototype._attrsAffectingSize = ["radius"];
(0, ld._registerNode)(Ot);
Di.Factory.addGetterSetter(Ot, "radius", 0, (0, ps.getNumberValidator)());
Di.Factory.addGetterSetter(Ot, "angle", 0, (0, ps.getNumberValidator)());
Di.Factory.addGetterSetter(Ot, "clockwise", !1);
Di.Factory.backCompat(Ot, {
  angleDeg: "angle",
  getAngleDeg: "getAngle",
  setAngleDeg: "setAngle"
});
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.Blur = void 0;
const Kr = U, dd = at, hd = N;
function Yr() {
  this.r = 0, this.g = 0, this.b = 0, this.a = 0, this.next = null;
}
const cd = [
  512,
  512,
  456,
  512,
  328,
  456,
  335,
  512,
  405,
  328,
  271,
  456,
  388,
  335,
  292,
  512,
  454,
  405,
  364,
  328,
  298,
  271,
  496,
  456,
  420,
  388,
  360,
  335,
  312,
  292,
  273,
  512,
  482,
  454,
  428,
  405,
  383,
  364,
  345,
  328,
  312,
  298,
  284,
  271,
  259,
  496,
  475,
  456,
  437,
  420,
  404,
  388,
  374,
  360,
  347,
  335,
  323,
  312,
  302,
  292,
  282,
  273,
  265,
  512,
  497,
  482,
  468,
  454,
  441,
  428,
  417,
  405,
  394,
  383,
  373,
  364,
  354,
  345,
  337,
  328,
  320,
  312,
  305,
  298,
  291,
  284,
  278,
  271,
  265,
  259,
  507,
  496,
  485,
  475,
  465,
  456,
  446,
  437,
  428,
  420,
  412,
  404,
  396,
  388,
  381,
  374,
  367,
  360,
  354,
  347,
  341,
  335,
  329,
  323,
  318,
  312,
  307,
  302,
  297,
  292,
  287,
  282,
  278,
  273,
  269,
  265,
  261,
  512,
  505,
  497,
  489,
  482,
  475,
  468,
  461,
  454,
  447,
  441,
  435,
  428,
  422,
  417,
  411,
  405,
  399,
  394,
  389,
  383,
  378,
  373,
  368,
  364,
  359,
  354,
  350,
  345,
  341,
  337,
  332,
  328,
  324,
  320,
  316,
  312,
  309,
  305,
  301,
  298,
  294,
  291,
  287,
  284,
  281,
  278,
  274,
  271,
  268,
  265,
  262,
  259,
  257,
  507,
  501,
  496,
  491,
  485,
  480,
  475,
  470,
  465,
  460,
  456,
  451,
  446,
  442,
  437,
  433,
  428,
  424,
  420,
  416,
  412,
  408,
  404,
  400,
  396,
  392,
  388,
  385,
  381,
  377,
  374,
  370,
  367,
  363,
  360,
  357,
  354,
  350,
  347,
  344,
  341,
  338,
  335,
  332,
  329,
  326,
  323,
  320,
  318,
  315,
  312,
  310,
  307,
  304,
  302,
  299,
  297,
  294,
  292,
  289,
  287,
  285,
  282,
  280,
  278,
  275,
  273,
  271,
  269,
  267,
  265,
  263,
  261,
  259
], ud = [
  9,
  11,
  12,
  13,
  13,
  14,
  14,
  15,
  15,
  15,
  15,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24
];
function gd(a, t) {
  const e = a.data, i = a.width, n = a.height;
  let r, s, o, l, d, c, p, f, g, u, _, y, v, w, h, m, b, A, M, C;
  const k = t + t + 1, x = i - 1, P = n - 1, E = t + 1, T = E * (E + 1) / 2, O = new Yr(), $ = cd[t], Z = ud[t];
  let H = null, D = O, j = null, G = null;
  for (let R = 1; R < k; R++)
    D = D.next = new Yr(), R === E && (H = D);
  D.next = O, o = s = 0;
  for (let R = 0; R < n; R++) {
    y = v = w = h = l = d = c = p = 0, f = E * (m = e[s]), g = E * (b = e[s + 1]), u = E * (A = e[s + 2]), _ = E * (M = e[s + 3]), l += T * m, d += T * b, c += T * A, p += T * M, D = O;
    for (let K = 0; K < E; K++)
      D.r = m, D.g = b, D.b = A, D.a = M, D = D.next;
    for (let K = 1; K < E; K++)
      r = s + ((x < K ? x : K) << 2), l += (D.r = m = e[r]) * (C = E - K), d += (D.g = b = e[r + 1]) * C, c += (D.b = A = e[r + 2]) * C, p += (D.a = M = e[r + 3]) * C, y += m, v += b, w += A, h += M, D = D.next;
    j = O, G = H;
    for (let K = 0; K < i; K++)
      e[s + 3] = M = p * $ >> Z, M !== 0 ? (M = 255 / M, e[s] = (l * $ >> Z) * M, e[s + 1] = (d * $ >> Z) * M, e[s + 2] = (c * $ >> Z) * M) : e[s] = e[s + 1] = e[s + 2] = 0, l -= f, d -= g, c -= u, p -= _, f -= j.r, g -= j.g, u -= j.b, _ -= j.a, r = o + ((r = K + t + 1) < x ? r : x) << 2, y += j.r = e[r], v += j.g = e[r + 1], w += j.b = e[r + 2], h += j.a = e[r + 3], l += y, d += v, c += w, p += h, j = j.next, f += m = G.r, g += b = G.g, u += A = G.b, _ += M = G.a, y -= m, v -= b, w -= A, h -= M, G = G.next, s += 4;
    o += i;
  }
  for (let R = 0; R < i; R++) {
    v = w = h = y = d = c = p = l = 0, s = R << 2, f = E * (m = e[s]), g = E * (b = e[s + 1]), u = E * (A = e[s + 2]), _ = E * (M = e[s + 3]), l += T * m, d += T * b, c += T * A, p += T * M, D = O;
    for (let st = 0; st < E; st++)
      D.r = m, D.g = b, D.b = A, D.a = M, D = D.next;
    let K = i;
    for (let st = 1; st <= t; st++)
      s = K + R << 2, l += (D.r = m = e[s]) * (C = E - st), d += (D.g = b = e[s + 1]) * C, c += (D.b = A = e[s + 2]) * C, p += (D.a = M = e[s + 3]) * C, y += m, v += b, w += A, h += M, D = D.next, st < P && (K += i);
    s = R, j = O, G = H;
    for (let st = 0; st < n; st++)
      r = s << 2, e[r + 3] = M = p * $ >> Z, M > 0 ? (M = 255 / M, e[r] = (l * $ >> Z) * M, e[r + 1] = (d * $ >> Z) * M, e[r + 2] = (c * $ >> Z) * M) : e[r] = e[r + 1] = e[r + 2] = 0, l -= f, d -= g, c -= u, p -= _, f -= j.r, g -= j.g, u -= j.b, _ -= j.a, r = R + ((r = st + E) < P ? r : P) * i << 2, l += y += j.r = e[r], d += v += j.g = e[r + 1], c += w += j.b = e[r + 2], p += h += j.a = e[r + 3], j = j.next, f += m = G.r, g += b = G.g, u += A = G.b, _ += M = G.a, y -= m, v -= b, w -= A, h -= M, G = G.next, s += i;
  }
}
const fd = function(t) {
  const e = Math.round(this.blurRadius());
  e > 0 && gd(t, e);
};
Ni.Blur = fd;
Kr.Factory.addGetterSetter(dd.Node, "blurRadius", 0, (0, hd.getNumberValidator)(), Kr.Factory.afterSetFilter);
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
Ii.Brighten = void 0;
const Xr = U, pd = at, md = N, _d = function(a) {
  const t = this.brightness() * 255, e = a.data, i = e.length;
  for (let n = 0; n < i; n += 4)
    e[n] += t, e[n + 1] += t, e[n + 2] += t;
};
Ii.Brighten = _d;
Xr.Factory.addGetterSetter(pd.Node, "brightness", 0, (0, md.getNumberValidator)(), Xr.Factory.afterSetFilter);
var Gi = {};
Object.defineProperty(Gi, "__esModule", { value: !0 });
Gi.Contrast = void 0;
const Zr = U, yd = at, bd = N, vd = function(a) {
  const t = Math.pow((this.contrast() + 100) / 100, 2), e = a.data, i = e.length;
  let n = 150, r = 150, s = 150;
  for (let o = 0; o < i; o += 4)
    n = e[o], r = e[o + 1], s = e[o + 2], n /= 255, n -= 0.5, n *= t, n += 0.5, n *= 255, r /= 255, r -= 0.5, r *= t, r += 0.5, r *= 255, s /= 255, s -= 0.5, s *= t, s += 0.5, s *= 255, n = n < 0 ? 0 : n > 255 ? 255 : n, r = r < 0 ? 0 : r > 255 ? 255 : r, s = s < 0 ? 0 : s > 255 ? 255 : s, e[o] = n, e[o + 1] = r, e[o + 2] = s;
};
Gi.Contrast = vd;
Zr.Factory.addGetterSetter(yd.Node, "contrast", 0, (0, bd.getNumberValidator)(), Zr.Factory.afterSetFilter);
var Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.Emboss = void 0;
const Bt = U, Ui = at, Cd = ot, ms = N, wd = function(a) {
  const t = this.embossStrength() * 10, e = this.embossWhiteLevel() * 255, i = this.embossDirection(), n = this.embossBlend(), r = a.data, s = a.width, o = a.height, l = s * 4;
  let d = 0, c = 0, p = o;
  switch (i) {
    case "top-left":
      d = -1, c = -1;
      break;
    case "top":
      d = -1, c = 0;
      break;
    case "top-right":
      d = -1, c = 1;
      break;
    case "right":
      d = 0, c = 1;
      break;
    case "bottom-right":
      d = 1, c = 1;
      break;
    case "bottom":
      d = 1, c = 0;
      break;
    case "bottom-left":
      d = 1, c = -1;
      break;
    case "left":
      d = 0, c = -1;
      break;
    default:
      Cd.Util.error("Unknown emboss direction: " + i);
  }
  do {
    const f = (p - 1) * l;
    let g = d;
    p + g < 1 && (g = 0), p + g > o && (g = 0);
    const u = (p - 1 + g) * s * 4;
    let _ = s;
    do {
      const y = f + (_ - 1) * 4;
      let v = c;
      _ + v < 1 && (v = 0), _ + v > s && (v = 0);
      const w = u + (_ - 1 + v) * 4, h = r[y] - r[w], m = r[y + 1] - r[w + 1], b = r[y + 2] - r[w + 2];
      let A = h;
      const M = A > 0 ? A : -A, C = m > 0 ? m : -m, k = b > 0 ? b : -b;
      if (C > M && (A = m), k > M && (A = b), A *= t, n) {
        const x = r[y] + A, P = r[y + 1] + A, E = r[y + 2] + A;
        r[y] = x > 255 ? 255 : x < 0 ? 0 : x, r[y + 1] = P > 255 ? 255 : P < 0 ? 0 : P, r[y + 2] = E > 255 ? 255 : E < 0 ? 0 : E;
      } else {
        let x = e - A;
        x < 0 ? x = 0 : x > 255 && (x = 255), r[y] = r[y + 1] = r[y + 2] = x;
      }
    } while (--_);
  } while (--p);
};
Bi.Emboss = wd;
Bt.Factory.addGetterSetter(Ui.Node, "embossStrength", 0.5, (0, ms.getNumberValidator)(), Bt.Factory.afterSetFilter);
Bt.Factory.addGetterSetter(Ui.Node, "embossWhiteLevel", 0.5, (0, ms.getNumberValidator)(), Bt.Factory.afterSetFilter);
Bt.Factory.addGetterSetter(Ui.Node, "embossDirection", "top-left", void 0, Bt.Factory.afterSetFilter);
Bt.Factory.addGetterSetter(Ui.Node, "embossBlend", !1, void 0, Bt.Factory.afterSetFilter);
var zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.Enhance = void 0;
const qr = U, Ad = at, Sd = N;
function Sn(a, t, e, i, n) {
  const r = e - t, s = n - i;
  if (r === 0)
    return i + s / 2;
  if (s === 0)
    return i;
  let o = (a - t) / r;
  return o = s * o + i, o;
}
const xd = function(a) {
  const t = a.data, e = t.length;
  let i = t[0], n = i, r, s = t[1], o = s, l, d = t[2], c = d, p;
  const f = this.enhance();
  if (f === 0)
    return;
  for (let h = 0; h < e; h += 4)
    r = t[h + 0], r < i ? i = r : r > n && (n = r), l = t[h + 1], l < s ? s = l : l > o && (o = l), p = t[h + 2], p < d ? d = p : p > c && (c = p);
  n === i && (n = 255, i = 0), o === s && (o = 255, s = 0), c === d && (c = 255, d = 0);
  let g, u, _, y, v, w;
  if (f > 0)
    g = n + f * (255 - n), u = i - f * (i - 0), _ = o + f * (255 - o), y = s - f * (s - 0), v = c + f * (255 - c), w = d - f * (d - 0);
  else {
    const h = (n + i) * 0.5;
    g = n + f * (n - h), u = i + f * (i - h);
    const m = (o + s) * 0.5;
    _ = o + f * (o - m), y = s + f * (s - m);
    const b = (c + d) * 0.5;
    v = c + f * (c - b), w = d + f * (d - b);
  }
  for (let h = 0; h < e; h += 4)
    t[h + 0] = Sn(t[h + 0], i, n, u, g), t[h + 1] = Sn(t[h + 1], s, o, y, _), t[h + 2] = Sn(t[h + 2], d, c, w, v);
};
zi.Enhance = xd;
qr.Factory.addGetterSetter(Ad.Node, "enhance", 0, (0, Sd.getNumberValidator)(), qr.Factory.afterSetFilter);
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.Grayscale = void 0;
const Md = function(a) {
  const t = a.data, e = t.length;
  for (let i = 0; i < e; i += 4) {
    const n = 0.34 * t[i] + 0.5 * t[i + 1] + 0.16 * t[i + 2];
    t[i] = n, t[i + 1] = n, t[i + 2] = n;
  }
};
ji.Grayscale = Md;
var Wi = {};
Object.defineProperty(Wi, "__esModule", { value: !0 });
Wi.HSL = void 0;
const Ae = U, ir = at, nr = N;
Ae.Factory.addGetterSetter(ir.Node, "hue", 0, (0, nr.getNumberValidator)(), Ae.Factory.afterSetFilter);
Ae.Factory.addGetterSetter(ir.Node, "saturation", 0, (0, nr.getNumberValidator)(), Ae.Factory.afterSetFilter);
Ae.Factory.addGetterSetter(ir.Node, "luminance", 0, (0, nr.getNumberValidator)(), Ae.Factory.afterSetFilter);
const kd = function(a) {
  const t = a.data, e = t.length, i = 1, n = Math.pow(2, this.saturation()), r = Math.abs(this.hue() + 360) % 360, s = this.luminance() * 127, o = i * n * Math.cos(r * Math.PI / 180), l = i * n * Math.sin(r * Math.PI / 180), d = 0.299 * i + 0.701 * o + 0.167 * l, c = 0.587 * i - 0.587 * o + 0.33 * l, p = 0.114 * i - 0.114 * o - 0.497 * l, f = 0.299 * i - 0.299 * o - 0.328 * l, g = 0.587 * i + 0.413 * o + 0.035 * l, u = 0.114 * i - 0.114 * o + 0.293 * l, _ = 0.299 * i - 0.3 * o + 1.25 * l, y = 0.587 * i - 0.586 * o - 1.05 * l, v = 0.114 * i + 0.886 * o - 0.2 * l;
  let w, h, m, b;
  for (let A = 0; A < e; A += 4)
    w = t[A + 0], h = t[A + 1], m = t[A + 2], b = t[A + 3], t[A + 0] = d * w + c * h + p * m + s, t[A + 1] = f * w + g * h + u * m + s, t[A + 2] = _ * w + y * h + v * m + s, t[A + 3] = b;
};
Wi.HSL = kd;
var Ki = {};
Object.defineProperty(Ki, "__esModule", { value: !0 });
Ki.HSV = void 0;
const Se = U, rr = at, ar = N, Pd = function(a) {
  const t = a.data, e = t.length, i = Math.pow(2, this.value()), n = Math.pow(2, this.saturation()), r = Math.abs(this.hue() + 360) % 360, s = i * n * Math.cos(r * Math.PI / 180), o = i * n * Math.sin(r * Math.PI / 180), l = 0.299 * i + 0.701 * s + 0.167 * o, d = 0.587 * i - 0.587 * s + 0.33 * o, c = 0.114 * i - 0.114 * s - 0.497 * o, p = 0.299 * i - 0.299 * s - 0.328 * o, f = 0.587 * i + 0.413 * s + 0.035 * o, g = 0.114 * i - 0.114 * s + 0.293 * o, u = 0.299 * i - 0.3 * s + 1.25 * o, _ = 0.587 * i - 0.586 * s - 1.05 * o, y = 0.114 * i + 0.886 * s - 0.2 * o;
  for (let v = 0; v < e; v += 4) {
    const w = t[v + 0], h = t[v + 1], m = t[v + 2], b = t[v + 3];
    t[v + 0] = l * w + d * h + c * m, t[v + 1] = p * w + f * h + g * m, t[v + 2] = u * w + _ * h + y * m, t[v + 3] = b;
  }
};
Ki.HSV = Pd;
Se.Factory.addGetterSetter(rr.Node, "hue", 0, (0, ar.getNumberValidator)(), Se.Factory.afterSetFilter);
Se.Factory.addGetterSetter(rr.Node, "saturation", 0, (0, ar.getNumberValidator)(), Se.Factory.afterSetFilter);
Se.Factory.addGetterSetter(rr.Node, "value", 0, (0, ar.getNumberValidator)(), Se.Factory.afterSetFilter);
var Yi = {};
Object.defineProperty(Yi, "__esModule", { value: !0 });
Yi.Invert = void 0;
const Ed = function(a) {
  const t = a.data, e = t.length;
  for (let i = 0; i < e; i += 4)
    t[i] = 255 - t[i], t[i + 1] = 255 - t[i + 1], t[i + 2] = 255 - t[i + 2];
};
Yi.Invert = Ed;
var Xi = {};
Object.defineProperty(Xi, "__esModule", { value: !0 });
Xi.Kaleidoscope = void 0;
const ci = U, _s = at, Jr = ot, ys = N, Ld = function(a, t, e) {
  const i = a.data, n = t.data, r = a.width, s = a.height, o = e.polarCenterX || r / 2, l = e.polarCenterY || s / 2;
  let d = Math.sqrt(o * o + l * l), c = r - o, p = s - l;
  const f = Math.sqrt(c * c + p * p);
  d = f > d ? f : d;
  const g = s, u = r, _ = 360 / u * Math.PI / 180;
  for (let y = 0; y < u; y += 1) {
    const v = Math.sin(y * _), w = Math.cos(y * _);
    for (let h = 0; h < g; h += 1) {
      c = Math.floor(o + d * h / g * w), p = Math.floor(l + d * h / g * v);
      let m = (p * r + c) * 4;
      const b = i[m + 0], A = i[m + 1], M = i[m + 2], C = i[m + 3];
      m = (y + h * r) * 4, n[m + 0] = b, n[m + 1] = A, n[m + 2] = M, n[m + 3] = C;
    }
  }
}, Vd = function(a, t, e) {
  const i = a.data, n = t.data, r = a.width, s = a.height, o = e.polarCenterX || r / 2, l = e.polarCenterY || s / 2;
  let d = Math.sqrt(o * o + l * l), c = r - o, p = s - l;
  const f = Math.sqrt(c * c + p * p);
  d = f > d ? f : d;
  const g = s, u = r, _ = 0;
  let y, v;
  for (c = 0; c < r; c += 1)
    for (p = 0; p < s; p += 1) {
      const w = c - o, h = p - l, m = Math.sqrt(w * w + h * h) * g / d;
      let b = (Math.atan2(h, w) * 180 / Math.PI + 360 + _) % 360;
      b = b * u / 360, y = Math.floor(b), v = Math.floor(m);
      let A = (v * r + y) * 4;
      const M = i[A + 0], C = i[A + 1], k = i[A + 2], x = i[A + 3];
      A = (p * r + c) * 4, n[A + 0] = M, n[A + 1] = C, n[A + 2] = k, n[A + 3] = x;
    }
}, Td = function(a) {
  const t = a.width, e = a.height;
  let i, n, r, s, o, l, d, c, p, f, g = Math.round(this.kaleidoscopePower());
  const u = Math.round(this.kaleidoscopeAngle()), _ = Math.floor(t * (u % 360) / 360);
  if (g < 1)
    return;
  const y = Jr.Util.createCanvasElement();
  y.width = t, y.height = e;
  const v = y.getContext("2d").getImageData(0, 0, t, e);
  Jr.Util.releaseCanvas(y), Ld(a, v, {
    polarCenterX: t / 2,
    polarCenterY: e / 2
  });
  let w = t / Math.pow(2, g);
  for (; w <= 8; )
    w = w * 2, g -= 1;
  w = Math.ceil(w);
  let h = w, m = 0, b = h, A = 1;
  for (_ + w > t && (m = h, b = 0, A = -1), n = 0; n < e; n += 1)
    for (i = m; i !== b; i += A)
      r = Math.round(i + _) % t, p = (t * n + r) * 4, o = v.data[p + 0], l = v.data[p + 1], d = v.data[p + 2], c = v.data[p + 3], f = (t * n + i) * 4, v.data[f + 0] = o, v.data[f + 1] = l, v.data[f + 2] = d, v.data[f + 3] = c;
  for (n = 0; n < e; n += 1)
    for (h = Math.floor(w), s = 0; s < g; s += 1) {
      for (i = 0; i < h + 1; i += 1)
        p = (t * n + i) * 4, o = v.data[p + 0], l = v.data[p + 1], d = v.data[p + 2], c = v.data[p + 3], f = (t * n + h * 2 - i - 1) * 4, v.data[f + 0] = o, v.data[f + 1] = l, v.data[f + 2] = d, v.data[f + 3] = c;
      h *= 2;
    }
  Vd(v, a, {});
};
Xi.Kaleidoscope = Td;
ci.Factory.addGetterSetter(_s.Node, "kaleidoscopePower", 2, (0, ys.getNumberValidator)(), ci.Factory.afterSetFilter);
ci.Factory.addGetterSetter(_s.Node, "kaleidoscopeAngle", 0, (0, ys.getNumberValidator)(), ci.Factory.afterSetFilter);
var Zi = {};
Object.defineProperty(Zi, "__esModule", { value: !0 });
Zi.Mask = void 0;
const Qr = U, $d = at, Hd = N;
function ei(a, t, e) {
  let i = (e * a.width + t) * 4;
  const n = [];
  return n.push(a.data[i++], a.data[i++], a.data[i++], a.data[i++]), n;
}
function Fe(a, t) {
  return Math.sqrt(Math.pow(a[0] - t[0], 2) + Math.pow(a[1] - t[1], 2) + Math.pow(a[2] - t[2], 2));
}
function Rd(a) {
  const t = [0, 0, 0];
  for (let e = 0; e < a.length; e++)
    t[0] += a[e][0], t[1] += a[e][1], t[2] += a[e][2];
  return t[0] /= a.length, t[1] /= a.length, t[2] /= a.length, t;
}
function Od(a, t) {
  const e = ei(a, 0, 0), i = ei(a, a.width - 1, 0), n = ei(a, 0, a.height - 1), r = ei(a, a.width - 1, a.height - 1), s = t || 10;
  if (Fe(e, i) < s && Fe(i, r) < s && Fe(r, n) < s && Fe(n, e) < s) {
    const o = Rd([i, e, r, n]), l = [];
    for (let d = 0; d < a.width * a.height; d++) {
      const c = Fe(o, [
        a.data[d * 4],
        a.data[d * 4 + 1],
        a.data[d * 4 + 2]
      ]);
      l[d] = c < s ? 0 : 255;
    }
    return l;
  }
}
function Fd(a, t) {
  for (let e = 0; e < a.width * a.height; e++)
    a.data[4 * e + 3] = t[e];
}
function Dd(a, t, e) {
  const i = [1, 1, 1, 1, 0, 1, 1, 1, 1], n = Math.round(Math.sqrt(i.length)), r = Math.floor(n / 2), s = [];
  for (let o = 0; o < e; o++)
    for (let l = 0; l < t; l++) {
      const d = o * t + l;
      let c = 0;
      for (let p = 0; p < n; p++)
        for (let f = 0; f < n; f++) {
          const g = o + p - r, u = l + f - r;
          if (g >= 0 && g < e && u >= 0 && u < t) {
            const _ = g * t + u, y = i[p * n + f];
            c += a[_] * y;
          }
        }
      s[d] = c === 255 * 8 ? 255 : 0;
    }
  return s;
}
function Nd(a, t, e) {
  const i = [1, 1, 1, 1, 1, 1, 1, 1, 1], n = Math.round(Math.sqrt(i.length)), r = Math.floor(n / 2), s = [];
  for (let o = 0; o < e; o++)
    for (let l = 0; l < t; l++) {
      const d = o * t + l;
      let c = 0;
      for (let p = 0; p < n; p++)
        for (let f = 0; f < n; f++) {
          const g = o + p - r, u = l + f - r;
          if (g >= 0 && g < e && u >= 0 && u < t) {
            const _ = g * t + u, y = i[p * n + f];
            c += a[_] * y;
          }
        }
      s[d] = c >= 255 * 4 ? 255 : 0;
    }
  return s;
}
function Id(a, t, e) {
  const i = [0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111], n = Math.round(Math.sqrt(i.length)), r = Math.floor(n / 2), s = [];
  for (let o = 0; o < e; o++)
    for (let l = 0; l < t; l++) {
      const d = o * t + l;
      let c = 0;
      for (let p = 0; p < n; p++)
        for (let f = 0; f < n; f++) {
          const g = o + p - r, u = l + f - r;
          if (g >= 0 && g < e && u >= 0 && u < t) {
            const _ = g * t + u, y = i[p * n + f];
            c += a[_] * y;
          }
        }
      s[d] = c;
    }
  return s;
}
const Gd = function(a) {
  const t = this.threshold();
  let e = Od(a, t);
  return e && (e = Dd(e, a.width, a.height), e = Nd(e, a.width, a.height), e = Id(e, a.width, a.height), Fd(a, e)), a;
};
Zi.Mask = Gd;
Qr.Factory.addGetterSetter($d.Node, "threshold", 0, (0, Hd.getNumberValidator)(), Qr.Factory.afterSetFilter);
var qi = {};
Object.defineProperty(qi, "__esModule", { value: !0 });
qi.Noise = void 0;
const ta = U, Bd = at, Ud = N, zd = function(a) {
  const t = this.noise() * 255, e = a.data, i = e.length, n = t / 2;
  for (let r = 0; r < i; r += 4)
    e[r + 0] += n - 2 * n * Math.random(), e[r + 1] += n - 2 * n * Math.random(), e[r + 2] += n - 2 * n * Math.random();
};
qi.Noise = zd;
ta.Factory.addGetterSetter(Bd.Node, "noise", 0.2, (0, Ud.getNumberValidator)(), ta.Factory.afterSetFilter);
var Ji = {};
Object.defineProperty(Ji, "__esModule", { value: !0 });
Ji.Pixelate = void 0;
const ea = U, jd = ot, Wd = at, Kd = N, Yd = function(a) {
  let t = Math.ceil(this.pixelSize()), e = a.width, i = a.height, n = Math.ceil(e / t), r = Math.ceil(i / t), s = a.data;
  if (t <= 0) {
    jd.Util.error("pixelSize value can not be <= 0");
    return;
  }
  for (let o = 0; o < n; o += 1)
    for (let l = 0; l < r; l += 1) {
      let d = 0, c = 0, p = 0, f = 0;
      const g = o * t, u = g + t, _ = l * t, y = _ + t;
      let v = 0;
      for (let w = g; w < u; w += 1)
        if (!(w >= e))
          for (let h = _; h < y; h += 1) {
            if (h >= i)
              continue;
            const m = (e * h + w) * 4;
            d += s[m + 0], c += s[m + 1], p += s[m + 2], f += s[m + 3], v += 1;
          }
      d = d / v, c = c / v, p = p / v, f = f / v;
      for (let w = g; w < u; w += 1)
        if (!(w >= e))
          for (let h = _; h < y; h += 1) {
            if (h >= i)
              continue;
            const m = (e * h + w) * 4;
            s[m + 0] = d, s[m + 1] = c, s[m + 2] = p, s[m + 3] = f;
          }
    }
};
Ji.Pixelate = Yd;
ea.Factory.addGetterSetter(Wd.Node, "pixelSize", 8, (0, Kd.getNumberValidator)(), ea.Factory.afterSetFilter);
var Qi = {};
Object.defineProperty(Qi, "__esModule", { value: !0 });
Qi.Posterize = void 0;
const ia = U, Xd = at, Zd = N, qd = function(a) {
  const t = Math.round(this.levels() * 254) + 1, e = a.data, i = e.length, n = 255 / t;
  for (let r = 0; r < i; r += 1)
    e[r] = Math.floor(e[r] / n) * n;
};
Qi.Posterize = qd;
ia.Factory.addGetterSetter(Xd.Node, "levels", 0.5, (0, Zd.getNumberValidator)(), ia.Factory.afterSetFilter);
var tn = {};
Object.defineProperty(tn, "__esModule", { value: !0 });
tn.RGB = void 0;
const ui = U, sr = at, Jd = N, Qd = function(a) {
  const t = a.data, e = t.length, i = this.red(), n = this.green(), r = this.blue();
  for (let s = 0; s < e; s += 4) {
    const o = (0.34 * t[s] + 0.5 * t[s + 1] + 0.16 * t[s + 2]) / 255;
    t[s] = o * i, t[s + 1] = o * n, t[s + 2] = o * r, t[s + 3] = t[s + 3];
  }
};
tn.RGB = Qd;
ui.Factory.addGetterSetter(sr.Node, "red", 0, function(a) {
  return this._filterUpToDate = !1, a > 255 ? 255 : a < 0 ? 0 : Math.round(a);
});
ui.Factory.addGetterSetter(sr.Node, "green", 0, function(a) {
  return this._filterUpToDate = !1, a > 255 ? 255 : a < 0 ? 0 : Math.round(a);
});
ui.Factory.addGetterSetter(sr.Node, "blue", 0, Jd.RGBComponent, ui.Factory.afterSetFilter);
var en = {};
Object.defineProperty(en, "__esModule", { value: !0 });
en.RGBA = void 0;
const ze = U, nn = at, th = N, eh = function(a) {
  const t = a.data, e = t.length, i = this.red(), n = this.green(), r = this.blue(), s = this.alpha();
  for (let o = 0; o < e; o += 4) {
    const l = 1 - s;
    t[o] = i * s + t[o] * l, t[o + 1] = n * s + t[o + 1] * l, t[o + 2] = r * s + t[o + 2] * l;
  }
};
en.RGBA = eh;
ze.Factory.addGetterSetter(nn.Node, "red", 0, function(a) {
  return this._filterUpToDate = !1, a > 255 ? 255 : a < 0 ? 0 : Math.round(a);
});
ze.Factory.addGetterSetter(nn.Node, "green", 0, function(a) {
  return this._filterUpToDate = !1, a > 255 ? 255 : a < 0 ? 0 : Math.round(a);
});
ze.Factory.addGetterSetter(nn.Node, "blue", 0, th.RGBComponent, ze.Factory.afterSetFilter);
ze.Factory.addGetterSetter(nn.Node, "alpha", 1, function(a) {
  return this._filterUpToDate = !1, a > 1 ? 1 : a < 0 ? 0 : a;
});
var rn = {};
Object.defineProperty(rn, "__esModule", { value: !0 });
rn.Sepia = void 0;
const ih = function(a) {
  const t = a.data, e = t.length;
  for (let i = 0; i < e; i += 4) {
    const n = t[i + 0], r = t[i + 1], s = t[i + 2];
    t[i + 0] = Math.min(255, n * 0.393 + r * 0.769 + s * 0.189), t[i + 1] = Math.min(255, n * 0.349 + r * 0.686 + s * 0.168), t[i + 2] = Math.min(255, n * 0.272 + r * 0.534 + s * 0.131);
  }
};
rn.Sepia = ih;
var an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
an.Solarize = void 0;
const nh = function(a) {
  const t = a.data, e = a.width, i = a.height, n = e * 4;
  let r = i;
  do {
    const s = (r - 1) * n;
    let o = e;
    do {
      const l = s + (o - 1) * 4;
      let d = t[l], c = t[l + 1], p = t[l + 2];
      d > 127 && (d = 255 - d), c > 127 && (c = 255 - c), p > 127 && (p = 255 - p), t[l] = d, t[l + 1] = c, t[l + 2] = p;
    } while (--o);
  } while (--r);
};
an.Solarize = nh;
var sn = {};
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.Threshold = void 0;
const na = U, rh = at, ah = N, sh = function(a) {
  const t = this.threshold() * 255, e = a.data, i = e.length;
  for (let n = 0; n < i; n += 1)
    e[n] = e[n] < t ? 0 : 255;
};
sn.Threshold = sh;
na.Factory.addGetterSetter(rh.Node, "threshold", 0.5, (0, ah.getNumberValidator)(), na.Factory.afterSetFilter);
Object.defineProperty(pi, "__esModule", { value: !0 });
pi.Konva = void 0;
const ra = Da, oh = vi, lh = Ai, dh = Mi, hh = ki, ch = Pi, aa = we, uh = Ye, gh = Ve, fh = Ze, ph = Vi, mh = Ti, _h = $i, yh = Hi, bh = $e, vh = Ri, Ch = Oi, wh = Fi, Ah = Ni, Sh = Ii, xh = Gi, Mh = Bi, kh = zi, Ph = ji, Eh = Wi, Lh = Ki, Vh = Yi, Th = Xi, $h = Zi, Hh = qi, Rh = Ji, Oh = Qi, Fh = tn, Dh = en, Nh = rn, Ih = an, Gh = sn;
pi.Konva = ra.Konva.Util._assign(ra.Konva, {
  Arc: oh.Arc,
  Arrow: lh.Arrow,
  Circle: dh.Circle,
  Ellipse: hh.Ellipse,
  Image: ch.Image,
  Label: aa.Label,
  Tag: aa.Tag,
  Line: uh.Line,
  Path: gh.Path,
  Rect: fh.Rect,
  RegularPolygon: ph.RegularPolygon,
  Ring: mh.Ring,
  Sprite: _h.Sprite,
  Star: yh.Star,
  Text: bh.Text,
  TextPath: vh.TextPath,
  Transformer: Ch.Transformer,
  Wedge: wh.Wedge,
  Filters: {
    Blur: Ah.Blur,
    Brighten: Sh.Brighten,
    Contrast: xh.Contrast,
    Emboss: Mh.Emboss,
    Enhance: kh.Enhance,
    Grayscale: Ph.Grayscale,
    HSL: Eh.HSL,
    HSV: Lh.HSV,
    Invert: Vh.Invert,
    Kaleidoscope: Th.Kaleidoscope,
    Mask: $h.Mask,
    Noise: Hh.Noise,
    Pixelate: Rh.Pixelate,
    Posterize: Oh.Posterize,
    RGB: Fh.RGB,
    RGBA: Dh.RGBA,
    Sepia: Nh.Sepia,
    Solarize: Ih.Solarize,
    Threshold: Gh.Threshold
  }
});
var Bh = jn.exports;
Object.defineProperty(Bh, "__esModule", { value: !0 });
const Uh = pi;
jn.exports = Uh.Konva;
var zh = jn.exports;
const rt = /* @__PURE__ */ Bo(zh), bs = /* @__PURE__ */ new Map([
  [
    "lightbulb",
    "M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z"
  ],
  [
    "lightbulb-on",
    "M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63Z"
  ],
  [
    "lightbulb-outline",
    "M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z"
  ],
  ["lamp", "M8,2H16L20,14H4L8,2M11,15H13V20H18V22H6V20H11V15Z"],
  ["ceiling-light", "M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z"],
  ["floor-lamp", "M15,2L17,9H7L9,2M11,10H13V20H16V22H8V20H11V10Z"],
  [
    "led-strip",
    "M2.81,8.46L14.83,20.5L15.54,19.78L16.95,21.19L18.36,19.78L16.95,18.36L18.36,16.95L19.78,18.36L21.19,16.95L19.78,15.54L20.5,14.83L8.46,2.81L2.81,8.46M5.64,8.46L8.46,5.64L17.66,14.83L14.83,17.66L5.64,8.46M7.05,8.46L8.46,9.88L9.88,8.46L8.46,7.05L7.05,8.46M9.17,10.59L10.59,12L12,10.59L10.59,9.17L9.17,10.59M11.29,12.71L12.71,14.12L14.12,12.71L12.71,11.29L11.29,12.71M13.41,14.83L14.83,16.24L16.24,14.83L14.83,13.41L13.41,14.83Z"
  ],
  [
    "power-plug",
    "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z"
  ],
  [
    "power-socket-eu",
    "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"
  ],
  [
    "toggle-switch",
    "M17,7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7M17,15A3,3 0 0,1 14,12A3,3 0 0,1 17,9A3,3 0 0,1 20,12A3,3 0 0,1 17,15Z"
  ],
  ["flash", "M7,2V13H10V22L17,10H13L17,2H7Z"],
  ["lightning-bolt", "M11 15H6L13 1V9H18L11 23V15Z"],
  [
    "thermometer",
    "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"
  ],
  [
    "water-percent",
    "M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z"
  ],
  [
    "radiator",
    "M7.95,3L6.53,5.19L7.95,7.4H7.94L5.95,10.5L4.22,9.6L5.64,7.39L4.22,5.19L6.22,2.09L7.95,3M13.95,2.89L12.53,5.1L13.95,7.3L13.94,7.31L11.95,10.4L10.22,9.5L11.64,7.3L10.22,5.1L12.22,2L13.95,2.89M20,2.89L18.56,5.1L20,7.3V7.31L18,10.4L16.25,9.5L17.67,7.3L16.25,5.1L18.25,2L20,2.89M2,22V14A2,2 0 0,1 4,12H20A2,2 0 0,1 22,14V22H20V20H4V22H2M6,14A1,1 0 0,0 5,15V17A1,1 0 0,0 6,18A1,1 0 0,0 7,17V15A1,1 0 0,0 6,14M10,14A1,1 0 0,0 9,15V17A1,1 0 0,0 10,18A1,1 0 0,0 11,17V15A1,1 0 0,0 10,14M14,14A1,1 0 0,0 13,15V17A1,1 0 0,0 14,18A1,1 0 0,0 15,17V15A1,1 0 0,0 14,14M18,14A1,1 0 0,0 17,15V17A1,1 0 0,0 18,18A1,1 0 0,0 19,17V15A1,1 0 0,0 18,14Z"
  ],
  [
    "fire",
    "M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z"
  ],
  [
    "snowflake",
    "M20.79,13.95L18.46,14.57L16.46,13.44V10.56L18.46,9.43L20.79,10.05L21.31,8.12L19.54,7.65L20,5.88L18.07,5.36L17.45,7.69L15.45,8.82L13,7.38V5.12L14.71,3.41L13.29,2L12,3.29L10.71,2L9.29,3.41L11,5.12V7.38L8.5,8.82L6.5,7.69L5.92,5.36L4,5.88L4.47,7.65L2.7,8.12L3.22,10.05L5.55,9.43L7.55,10.56V13.45L5.55,14.58L3.22,13.96L2.7,15.89L4.47,16.36L4,18.12L5.93,18.64L6.55,16.31L8.55,15.18L11,16.62V18.88L9.29,20.59L10.71,22L12,20.71L13.29,22L14.7,20.59L13,18.88V16.62L15.5,15.17L17.5,16.3L18.12,18.63L20,18.12L19.53,16.35L21.3,15.88L20.79,13.95M9.5,10.56L12,9.11L14.5,10.56V13.44L12,14.89L9.5,13.44V10.56Z"
  ],
  [
    "fan",
    "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z"
  ],
  [
    "air-conditioner",
    "M6.59,0.66C8.93,-1.15 11.47,1.06 12.04,4.5C12.47,4.5 12.89,4.62 13.27,4.84C13.79,4.24 14.25,3.42 14.07,2.5C13.65,0.35 16.06,-1.39 18.35,1.58C20.16,3.92 17.95,6.46 14.5,7.03C14.5,7.46 14.39,7.89 14.16,8.27C14.76,8.78 15.58,9.24 16.5,9.06C18.63,8.64 20.38,11.04 17.41,13.34C15.07,15.15 12.53,12.94 11.96,9.5C11.53,9.5 11.11,9.37 10.74,9.15C10.22,9.75 9.75,10.58 9.93,11.5C10.35,13.64 7.94,15.39 5.65,12.42C3.83,10.07 6.05,7.53 9.5,6.97C9.5,6.54 9.63,6.12 9.85,5.74C9.25,5.23 8.43,4.76 7.5,4.94C5.37,5.36 3.62,2.96 6.59,0.66M5,16H7A2,2 0 0,1 9,18V24H7V22H5V24H3V18A2,2 0 0,1 5,16M5,18V20H7V18H5M12.93,16H15L12.07,24H10L12.93,16M18,16H21V18H18V22H21V24H18A2,2 0 0,1 16,22V18A2,2 0 0,1 18,16Z"
  ],
  [
    "hvac",
    "M8.58 14C8.3 13.55 8.11 13.03 8.06 12.5H15.94C15.89 13.03 15.7 13.55 15.47 14H8.58M12 16C10.97 16 10.08 15.61 9.38 15H14.63C13.92 15.61 13.03 16 12 16M12 8C13.03 8 13.92 8.39 14.63 9H9.38C10.08 8.39 10.97 8 12 8M8.58 10H15.42C15.7 10.45 15.89 10.97 15.94 11.5H8.06C8.11 10.97 8.3 10.45 8.58 10M3 3V21H21V3H3M12 18C8.67 18 6 15.33 6 12S8.67 6 12 6 18 8.67 18 12 15.33 18 12 18Z"
  ],
  [
    "gauge",
    "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.81,9.77L11.71,10C11,10.13 10.41,10.6 10.14,11.26C9.73,12.29 10.23,13.45 11.26,13.86C12.29,14.27 13.45,13.77 13.86,12.74C14.12,12.08 14,11.32 13.57,10.76L13.67,10.5L14.96,7.29L14.97,7.26C15.17,6.75 14.92,6.17 14.41,5.96C14.28,5.91 14.15,5.89 14,5.89M10,6A1,1 0 0,0 9,7A1,1 0 0,0 10,8A1,1 0 0,0 11,7A1,1 0 0,0 10,6M7,9A1,1 0 0,0 6,10A1,1 0 0,0 7,11A1,1 0 0,0 8,10A1,1 0 0,0 7,9M17,9A1,1 0 0,0 16,10A1,1 0 0,0 17,11A1,1 0 0,0 18,10A1,1 0 0,0 17,9Z"
  ],
  [
    "weather-sunny",
    "M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z"
  ],
  [
    "weather-cloudy",
    "M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z"
  ],
  [
    "weather-rainy",
    "M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59"
  ],
  [
    "weather-night",
    "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z"
  ],
  [
    "door",
    "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z"
  ],
  [
    "door-open",
    "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z"
  ],
  [
    "door-closed",
    "M16,11H18V13H16V11M12,3H19C20.11,3 21,3.89 21,5V19H22V21H2V19H10V5C10,3.89 10.89,3 12,3M12,5V19H19V5H12Z"
  ],
  [
    "window-closed-variant",
    "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z"
  ],
  [
    "window-open-variant",
    "M21 20V2H3V20H1V23H23V20M19 4V11H17V4M5 4H7V11H5M5 20V13H7V20M9 20V4H15V20M17 20V13H19V20Z"
  ],
  [
    "blinds",
    "M3,2H21A1,1 0 0,1 22,3V5A1,1 0 0,1 21,6H20V13A1,1 0 0,1 19,14H13V16.17C14.17,16.58 15,17.69 15,19A3,3 0 0,1 12,22A3,3 0 0,1 9,19C9,17.69 9.83,16.58 11,16.17V14H5A1,1 0 0,1 4,13V6H3A1,1 0 0,1 2,5V3A1,1 0 0,1 3,2M12,18A1,1 0 0,0 11,19A1,1 0 0,0 12,20A1,1 0 0,0 13,19A1,1 0 0,0 12,18Z"
  ],
  [
    "blinds-open",
    "M3 2H21C21.55 2 22 2.45 22 3V5C22 5.55 21.55 6 21 6H20V7C20 7.55 19.55 8 19 8H13V10.17C14.17 10.58 15 11.7 15 13C15 14.66 13.66 16 12 16C10.34 16 9 14.66 9 13C9 11.69 9.84 10.58 11 10.17V8H5C4.45 8 4 7.55 4 7V6H3C2.45 6 2 5.55 2 5V3C2 2.45 2.45 2 3 2M12 12C11.45 12 11 12.45 11 13C11 13.55 11.45 14 12 14C12.55 14 13 13.55 13 13C13 12.45 12.55 12 12 12Z"
  ],
  [
    "garage",
    "M19,20H17V11H7V20H5V9L12,5L19,9V20M8,12H16V14H8V12M8,15H16V17H8V15M16,18V20H8V18H16Z"
  ],
  ["garage-open", "M19,20H17V11H7V20H5V9L12,5L19,9V20M8,12H16V14H8V12Z"],
  [
    "lock",
    "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"
  ],
  [
    "lock-open",
    "M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10A2,2 0 0,1 6,8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,17A2,2 0 0,0 14,15A2,2 0 0,0 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17Z"
  ],
  [
    "shield-home",
    "M11,13H13V16H16V11H18L12,6L6,11H8V16H11V13M12,1L21,5V11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1Z"
  ],
  [
    "shield-alert",
    "M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5M11,7H13V13H11M11,15H13V17H11"
  ],
  [
    "motion-sensor",
    "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z"
  ],
  [
    "run",
    "M13.5,5.5C14.59,5.5 15.5,4.58 15.5,3.5C15.5,2.38 14.59,1.5 13.5,1.5C12.39,1.5 11.5,2.38 11.5,3.5C11.5,4.58 12.39,5.5 13.5,5.5M9.89,19.38L10.89,15L13,17V23H15V15.5L12.89,13.5L13.5,10.5C14.79,12 16.79,13 19,13V11C17.09,11 15.5,10 14.69,8.58L13.69,7C13.29,6.38 12.69,6 12,6C11.69,6 11.5,6.08 11.19,6.08L6,8.28V13H8V9.58L9.79,8.88L8.19,17L3.29,16L2.89,18L9.89,19.38Z"
  ],
  [
    "smoke-detector",
    "M12,18A6,6 0 0,0 18,12C18,8.68 15.31,6 12,6C8.68,6 6,8.68 6,12A6,6 0 0,0 12,18M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19M8,12A4,4 0 0,1 12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12Z"
  ],
  [
    "water-alert",
    "M10 3.25C10 3.25 16 10 16 14C16 17.31 13.31 20 10 20S4 17.31 4 14C4 10 10 3.25 10 3.25M20 7V13H18V7H20M18 17H20V15H18V17Z"
  ],
  [
    "bell",
    "M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"
  ],
  [
    "cctv",
    "M6.03 12.03L8.03 15.5L5.5 18.68L2 12.62L6.03 12.03M17 18V15.29C17.88 14.9 18.5 14.03 18.5 13C18.5 12.43 18.3 11.9 17.97 11.5L19.94 10.35C20.95 9.76 21.3 8.47 20.71 7.46L19.33 5.06C18.74 4.05 17.45 3.7 16.44 4.28L8.31 9C7.36 9.53 7.03 10.75 7.58 11.71L9.08 14.31C9.63 15.26 10.86 15.59 11.81 15.04L13.69 13.96C13.94 14.55 14.41 15.03 15 15.29V18C15 19.1 15.9 20 17 20H22V18H17Z"
  ],
  [
    "video",
    "M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z"
  ],
  [
    "television",
    "M21,17H3V5H21M21,3H3A2,2 0 0,0 1,5V17A2,2 0 0,0 3,19H8V21H16V19H21A2,2 0 0,0 23,17V5A2,2 0 0,0 21,3Z"
  ],
  [
    "speaker",
    "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z"
  ],
  [
    "cast",
    "M1,10V12A9,9 0 0,1 10,21H12C12,14.92 7.07,10 1,10M1,14V16A5,5 0 0,1 6,21H8A7,7 0 0,0 1,14M1,18V21H4A3,3 0 0,0 1,18M21,3H3C1.89,3 1,3.89 1,5V8H3V5H21V19H14V21H21A2,2 0 0,0 23,19V5C23,3.89 22.1,3 21,3Z"
  ],
  [
    "music",
    "M21,3V15.5A3.5,3.5 0 0,1 17.5,19A3.5,3.5 0 0,1 14,15.5A3.5,3.5 0 0,1 17.5,12C18.04,12 18.55,12.12 19,12.34V6.47L9,8.6V17.5A3.5,3.5 0 0,1 5.5,21A3.5,3.5 0 0,1 2,17.5A3.5,3.5 0 0,1 5.5,14C6.04,14 6.55,14.12 7,14.34V6L21,3Z"
  ],
  ["play", "M8,5.14V19.14L19,12.14L8,5.14Z"],
  ["pause", "M14,19H18V5H14M6,19H10V5H6V19Z"],
  [
    "wifi",
    "M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z"
  ],
  [
    "router-wireless",
    "M20.2,5.9L21,5.1C19.6,3.7 17.8,3 16,3C14.2,3 12.4,3.7 11,5.1L11.8,5.9C13,4.8 14.5,4.2 16,4.2C17.5,4.2 19,4.8 20.2,5.9M19.3,6.7C18.4,5.8 17.2,5.3 16,5.3C14.8,5.3 13.6,5.8 12.7,6.7L13.5,7.5C14.2,6.8 15.1,6.5 16,6.5C16.9,6.5 17.8,6.8 18.5,7.5L19.3,6.7M19,13H17V9H15V13H5A2,2 0 0,0 3,15V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V15A2,2 0 0,0 19,13M8,18H6V16H8V18M11.5,18H9.5V16H11.5V18M15,18H13V16H15V18Z"
  ],
  [
    "lan",
    "M10,2C8.89,2 8,2.89 8,4V7C8,8.11 8.89,9 10,9H11V11H2V13H6V15H5C3.89,15 3,15.89 3,17V20C3,21.11 3.89,22 5,22H9C10.11,22 11,21.11 11,20V17C11,15.89 10.11,15 9,15H8V13H16V15H15C13.89,15 13,15.89 13,17V20C13,21.11 13.89,22 15,22H19C20.11,22 21,21.11 21,20V17C21,15.89 20.11,15 19,15H18V13H22V11H13V9H14C15.11,9 16,8.11 16,7V4C16,2.89 15.11,2 14,2H10M10,4H14V7H10V4M5,17H9V20H5V17M15,17H19V20H15V17Z"
  ],
  [
    "server",
    "M4,1H20A1,1 0 0,1 21,2V6A1,1 0 0,1 20,7H4A1,1 0 0,1 3,6V2A1,1 0 0,1 4,1M4,9H20A1,1 0 0,1 21,10V14A1,1 0 0,1 20,15H4A1,1 0 0,1 3,14V10A1,1 0 0,1 4,9M4,17H20A1,1 0 0,1 21,18V22A1,1 0 0,1 20,23H4A1,1 0 0,1 3,22V18A1,1 0 0,1 4,17M9,5H10V3H9V5M9,13H10V11H9V13M9,21H10V19H9V21M5,3V5H7V3H5M5,11V13H7V11H5M5,19V21H7V19H5Z"
  ],
  [
    "nas",
    "M4,5C2.89,5 2,5.89 2,7V17C2,18.11 2.89,19 4,19H20C21.11,19 22,18.11 22,17V7C22,5.89 21.11,5 20,5H4M4.5,7A1,1 0 0,1 5.5,8A1,1 0 0,1 4.5,9A1,1 0 0,1 3.5,8A1,1 0 0,1 4.5,7M7,7H20V17H7V7M8,8V16H11V8H8M12,8V16H15V8H12M16,8V16H19V8H16M9,9H10V10H9V9M13,9H14V10H13V9M17,9H18V10H17V9Z"
  ],
  [
    "laptop",
    "M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z"
  ],
  [
    "desktop-classic",
    "M6,2C4.89,2 4,2.89 4,4V12C4,13.11 4.89,14 6,14H18C19.11,14 20,13.11 20,12V4C20,2.89 19.11,2 18,2H6M6,4H18V12H6V4M4,15C2.89,15 2,15.89 2,17V20C2,21.11 2.89,22 4,22H20C21.11,22 22,21.11 22,20V17C22,15.89 21.11,15 20,15H4M8,17H20V20H8V17M9,17.75V19.25H13V17.75H9M15,17.75V19.25H19V17.75H15Z"
  ],
  [
    "cellphone",
    "M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z"
  ],
  [
    "home-assistant",
    "M21.8,13H20V21H13V17.67L15.79,14.88L16.5,15C17.66,15 18.6,14.06 18.6,12.9C18.6,11.74 17.66,10.8 16.5,10.8A2.1,2.1 0 0,0 14.4,12.9L14.5,13.61L13,15.13V9.65C13.66,9.29 14.1,8.6 14.1,7.8A2.1,2.1 0 0,0 12,5.7A2.1,2.1 0 0,0 9.9,7.8C9.9,8.6 10.34,9.29 11,9.65V15.13L9.5,13.61L9.6,12.9A2.1,2.1 0 0,0 7.5,10.8A2.1,2.1 0 0,0 5.4,12.9A2.1,2.1 0 0,0 7.5,15L8.21,14.88L11,17.67V21H4V13H2.25C1.83,13 1.42,13 1.42,12.79C1.43,12.57 1.85,12.15 2.28,11.72L11,3C11.33,2.67 11.67,2.33 12,2.33C12.33,2.33 12.67,2.67 13,3L17,7V6H19V9L21.78,11.78C22.18,12.18 22.59,12.59 22.6,12.8C22.6,13 22.2,13 21.8,13M7.5,12A0.9,0.9 0 0,1 8.4,12.9A0.9,0.9 0 0,1 7.5,13.8A0.9,0.9 0 0,1 6.6,12.9A0.9,0.9 0 0,1 7.5,12M16.5,12C17,12 17.4,12.4 17.4,12.9C17.4,13.4 17,13.8 16.5,13.8A0.9,0.9 0 0,1 15.6,12.9A0.9,0.9 0 0,1 16.5,12M12,6.9C12.5,6.9 12.9,7.3 12.9,7.8C12.9,8.3 12.5,8.7 12,8.7C11.5,8.7 11.1,8.3 11.1,7.8C11.1,7.3 11.5,6.9 12,6.9Z"
  ],
  [
    "washing-machine",
    "M14.83,11.17C16.39,12.73 16.39,15.27 14.83,16.83C13.27,18.39 10.73,18.39 9.17,16.83L14.83,11.17M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M10,4A1,1 0 0,0 9,5A1,1 0 0,0 10,6A1,1 0 0,0 11,5A1,1 0 0,0 10,4M12,8A6,6 0 0,0 6,14A6,6 0 0,0 12,20A6,6 0 0,0 18,14A6,6 0 0,0 12,8Z"
  ],
  [
    "dishwasher",
    "M18,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V4A2,2 0 0,0 18,2M10,4A1,1 0 0,1 11,5A1,1 0 0,1 10,6A1,1 0 0,1 9,5A1,1 0 0,1 10,4M7,4A1,1 0 0,1 8,5A1,1 0 0,1 7,6A1,1 0 0,1 6,5A1,1 0 0,1 7,4M18,20H6V8H18V20M14.67,15.33C14.69,16.03 14.41,16.71 13.91,17.21C12.86,18.26 11.15,18.27 10.09,17.21C9.59,16.71 9.31,16.03 9.33,15.33C9.4,14.62 9.63,13.94 10,13.33C10.37,12.5 10.81,11.73 11.33,11L12,10C13.79,12.59 14.67,14.36 14.67,15.33"
  ],
  [
    "fridge",
    "M7,2H17A2,2 0 0,1 19,4V9H5V4A2,2 0 0,1 7,2M19,19A2,2 0 0,1 17,21V22H15V21H9V22H7V21A2,2 0 0,1 5,19V10H19V19M8,5V7H10V5H8M8,12V15H10V12H8Z"
  ],
  [
    "stove",
    "M6,14H8L11,17H9L6,14M4,4H5V3A1,1 0 0,1 6,2H10A1,1 0 0,1 11,3V4H13V3A1,1 0 0,1 14,2H18A1,1 0 0,1 19,3V4H20A2,2 0 0,1 22,6V19A2,2 0 0,1 20,21V22H17V21H7V22H4V21A2,2 0 0,1 2,19V6A2,2 0 0,1 4,4M18,7A1,1 0 0,1 19,8A1,1 0 0,1 18,9A1,1 0 0,1 17,8A1,1 0 0,1 18,7M14,7A1,1 0 0,1 15,8A1,1 0 0,1 14,9A1,1 0 0,1 13,8A1,1 0 0,1 14,7M20,6H4V10H20V6M4,19H20V12H4V19M6,7A1,1 0 0,1 7,8A1,1 0 0,1 6,9A1,1 0 0,1 5,8A1,1 0 0,1 6,7M13,14H15L18,17H16L13,14Z"
  ],
  [
    "coffee-maker",
    "M18 6V4H20V2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H20V20H15.97C17.2 19.09 18 17.64 18 16V11H8V16C8 17.64 8.81 19.09 10.03 20H6V4H8V6C8 6.55 8.45 7 9 7H17C17.55 7 18 6.55 18 6M13 8C13.55 8 14 8.45 14 9S13.55 10 13 10 12 9.55 12 9 12.45 8 13 8Z"
  ],
  [
    "robot-vacuum",
    "M12,2C14.65,2 17.19,3.06 19.07,4.93L17.65,6.35C16.15,4.85 14.12,4 12,4C9.88,4 7.84,4.84 6.35,6.35L4.93,4.93C6.81,3.06 9.35,2 12,2M3.66,6.5L5.11,7.94C4.39,9.17 4,10.57 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,10.57 19.61,9.17 18.88,7.94L20.34,6.5C21.42,8.12 22,10.04 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12C2,10.04 2.58,8.12 3.66,6.5M12,6A6,6 0 0,1 18,12C18,13.59 17.37,15.12 16.24,16.24L14.83,14.83C14.08,15.58 13.06,16 12,16C10.94,16 9.92,15.58 9.17,14.83L7.76,16.24C6.63,15.12 6,13.59 6,12A6,6 0 0,1 12,6M12,8A1,1 0 0,0 11,9A1,1 0 0,0 12,10A1,1 0 0,0 13,9A1,1 0 0,0 12,8Z"
  ],
  [
    "solar-power",
    "M11.45,2V5.55L15,3.77L11.45,2M10.45,8L8,10.46L11.75,11.71L10.45,8M2,11.45L3.77,15L5.55,11.45H2M10,2H2V10C2.57,10.17 3.17,10.25 3.77,10.25C7.35,10.26 10.26,7.35 10.27,3.75C10.26,3.16 10.17,2.57 10,2M17,22V16H14L19,7V13H22L17,22Z"
  ],
  [
    "battery",
    "M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z"
  ],
  [
    "battery-charging",
    "M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.66C6,21.4 6.6,22 7.33,22H16.66C17.4,22 18,21.4 18,20.67V5.33C18,4.6 17.4,4 16.67,4M11,20V14.5H9L13,7V12.5H15"
  ],
  [
    "ev-station",
    "M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M8,18V13.5H6L10,6V11H12L8,18Z"
  ],
  [
    "meter-electric",
    "M12 2C7.04 2 3 6.04 3 11C3 14.91 5.5 18.24 9 19.47V22H11V19.94C11.33 20 11.66 20 12 20S12.67 20 13 19.94V22H15V19.47C18.5 18.23 21 14.9 21 11C21 6.04 16.96 2 12 2M14.25 14L11.25 17L9.75 15.5L11 14.25L9.75 13L12.75 10L14.25 11.5L13 12.75L14.25 14M16 9H8V7H16V9Z"
  ],
  ["water", "M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z"],
  [
    "trash-can",
    "M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M9,8H11V17H9V8M13,8H15V17H13V8Z"
  ],
  ["home", "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"],
  [
    "sofa",
    "M12.5 7C12.5 5.89 13.39 5 14.5 5H18C19.1 5 20 5.9 20 7V9.16C18.84 9.57 18 10.67 18 11.97V14H12.5V7M6 11.96V14H11.5V7C11.5 5.89 10.61 5 9.5 5H6C4.9 5 4 5.9 4 7V9.15C5.16 9.56 6 10.67 6 11.96M20.66 10.03C19.68 10.19 19 11.12 19 12.12V15H5V12C5 10.9 4.11 10 3 10S1 10.9 1 12V17C1 18.1 1.9 19 3 19V21H5V19H19V21H21V19C22.1 19 23 18.1 23 17V12C23 10.79 21.91 9.82 20.66 10.03Z"
  ],
  [
    "bed",
    "M19,7H11V14H3V5H1V20H3V17H21V20H23V11A4,4 0 0,0 19,7M7,13A3,3 0 0,0 10,10A3,3 0 0,0 7,7A3,3 0 0,0 4,10A3,3 0 0,0 7,13Z"
  ],
  [
    "shower",
    "M21,14V15C21,16.91 19.93,18.57 18.35,19.41L19,22H17L16.5,20C16.33,20 16.17,20 16,20H8C7.83,20 7.67,20 7.5,20L7,22H5L5.65,19.41C4.07,18.57 3,16.91 3,15V14H2V12H20V5A1,1 0 0,0 19,4C18.5,4 18.12,4.34 18,4.79C18.63,5.33 19,6.13 19,7H13A3,3 0 0,1 16,4C16.06,4 16.11,4 16.17,4C16.58,2.84 17.69,2 19,2A3,3 0 0,1 22,5V14H21V14M19,14H5V15A3,3 0 0,0 8,18H16A3,3 0 0,0 19,15V14Z"
  ],
  [
    "silverware-fork-knife",
    "M11,9H9V2H7V9H5V2H3V9C3,11.12 4.66,12.84 6.75,12.97V22H9.25V12.97C11.34,12.84 13,11.12 13,9V2H11V9M16,6V14H18.5V22H21V2C18.24,2 16,4.24 16,6Z"
  ],
  [
    "desk",
    "M3 6H21C21.55 6 22 6.45 22 7C22 7.55 21.55 8 21 8V19H19V17H15V19H13V8H5V19H3V8C2.45 8 2 7.55 2 7C2 6.45 2.45 6 3 6M16 10.5V11H18V10.5C18 10.22 17.78 10 17.5 10H16.5C16.22 10 16 10.22 16 10.5M16 14.5V15H18V14.5C18 14.22 17.78 14 17.5 14H16.5C16.22 14 16 14.22 16 14.5Z"
  ],
  ["stairs", "M15,5V9H11V13H7V17H3V20H10V16H14V12H18V8H22V5H15Z"],
  [
    "flower",
    "M3,13A9,9 0 0,0 12,22C12,17 7.97,13 3,13M12,5.5A2.5,2.5 0 0,1 14.5,8A2.5,2.5 0 0,1 12,10.5A2.5,2.5 0 0,1 9.5,8A2.5,2.5 0 0,1 12,5.5M5.6,10.25A2.5,2.5 0 0,0 8.1,12.75C8.63,12.75 9.12,12.58 9.5,12.31C9.5,12.37 9.5,12.43 9.5,12.5A2.5,2.5 0 0,0 12,15A2.5,2.5 0 0,0 14.5,12.5C14.5,12.43 14.5,12.37 14.5,12.31C14.88,12.58 15.37,12.75 15.9,12.75C17.28,12.75 18.4,11.63 18.4,10.25C18.4,9.25 17.81,8.4 16.97,8C17.81,7.6 18.4,6.74 18.4,5.75C18.4,4.37 17.28,3.25 15.9,3.25C15.37,3.25 14.88,3.41 14.5,3.69C14.5,3.63 14.5,3.56 14.5,3.5A2.5,2.5 0 0,0 12,1A2.5,2.5 0 0,0 9.5,3.5C9.5,3.56 9.5,3.63 9.5,3.69C9.12,3.41 8.63,3.25 8.1,3.25A2.5,2.5 0 0,0 5.6,5.75C5.6,6.74 6.19,7.6 7.03,8C6.19,8.4 5.6,9.25 5.6,10.25M12,22A9,9 0 0,0 21,13C16,13 12,17 12,22Z"
  ],
  [
    "car",
    "M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"
  ],
  [
    "account",
    "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
  ],
  ["alert", "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z"],
  [
    "check-circle",
    "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
  ],
  ["circle", "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"],
  [
    "help-circle",
    "M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"
  ],
  [
    "eye",
    "M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"
  ],
  [
    "clock",
    "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"
  ],
  [
    "calendar",
    "M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"
  ],
  [
    "cog",
    "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
  ],
  [
    "map-marker",
    "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"
  ],
  [
    "eye-outline",
    "M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"
  ],
  [
    "temperature-celsius",
    "M16.5,5C18.05,5 19.5,5.47 20.69,6.28L19.53,9.17C18.73,8.44 17.67,8 16.5,8C14,8 12,10 12,12.5C12,15 14,17 16.5,17C17.53,17 18.47,16.66 19.23,16.08L20.37,18.93C19.24,19.61 17.92,20 16.5,20A7.5,7.5 0 0,1 9,12.5A7.5,7.5 0 0,1 16.5,5M6,3A3,3 0 0,1 9,6A3,3 0 0,1 6,9A3,3 0 0,1 3,6A3,3 0 0,1 6,3M6,5A1,1 0 0,0 5,6A1,1 0 0,0 6,7A1,1 0 0,0 7,6A1,1 0 0,0 6,5Z"
  ]
]), vs = /* @__PURE__ */ new Map(), jh = Array.from(
  bs.keys(),
  (a) => "mdi:" + a
);
function or(a) {
  const t = a.trim().replace(/^mdi:/, "");
  return bs.get(t) ?? vs.get(t) ?? null;
}
const sa = new Map(
  Object.entries({
    temperature: "thermometer",
    humidity: "water-percent",
    moisture: "water-alert",
    motion: "motion-sensor",
    occupancy: "account",
    smoke: "smoke-detector",
    heat: "fire",
    battery: "battery",
    power: "flash",
    energy: "meter-electric",
    pressure: "gauge",
    illuminance: "weather-sunny",
    plug: "power-plug",
    speaker: "speaker"
  })
), Wh = new Map(
  Object.entries({
    switch: "toggle-switch",
    climate: "hvac",
    media_player: "television",
    camera: "cctv",
    vacuum: "robot-vacuum",
    person: "account",
    device_tracker: "map-marker",
    binary_sensor: "eye",
    sensor: "gauge",
    fan: "fan",
    alarm_control_panel: "shield-home",
    sun: "weather-sunny",
    button: "circle",
    weather: "weather-cloudy"
  })
);
function Cs(a, t, e, i) {
  for (const l of [a, t == null ? void 0 : t.attributes.icon, e == null ? void 0 : e.icon])
    if (typeof l == "string" && l.trim()) return l.trim();
  const n = ee(i ?? (t == null ? void 0 : t.entity_id) ?? (e == null ? void 0 : e.entity_id) ?? ""), r = String((t == null ? void 0 : t.attributes.device_class) ?? ""), s = ["on", "open", "opening"].includes((t == null ? void 0 : t.state) ?? "");
  let o = Wh.get(n) ?? "help-circle";
  return n === "lock" ? o = (t == null ? void 0 : t.state) === "unlocked" ? "lock-open" : "lock" : n === "light" ? o = s ? "lightbulb-on" : "lightbulb" : n === "cover" || n === "binary_sensor" ? r === "garage" || r === "garage_door" ? o = s ? "garage-open" : "garage" : r === "door" || r === "opening" ? o = s ? "door-open" : "door-closed" : r === "window" ? o = s ? "window-open-variant" : "window-closed-variant" : n === "cover" ? o = s ? "blinds-open" : "blinds" : o = sa.get(r) ?? o : o = sa.get(r) ?? o, "mdi:" + o;
}
function ws(a) {
  var e;
  const t = (e = a.querySelector("svg path[d]")) == null ? void 0 : e.getAttribute("d");
  if (t) return t;
  for (const i of a.querySelectorAll("*"))
    if (i.shadowRoot) {
      const n = ws(i.shadowRoot);
      if (n) return n;
    }
  return null;
}
const xn = /* @__PURE__ */ new Map();
async function Kh(a) {
  var e;
  let t;
  try {
    if (!((e = globalThis.customElements) != null && e.get("ha-icon")) || !document.body) return null;
    t = document.createElement("ha-icon"), Object.assign(t, { icon: "mdi:" + a }), t.style.cssText = "position:fixed;left:-10000px;pointer-events:none", t.setAttribute("aria-hidden", "true"), document.body.append(t);
    for (let i = 0; i <= 20; i++) {
      const n = ws(t.shadowRoot ?? t);
      if (n)
        return vs.set(a, n), n;
      i < 20 && await new Promise((r) => setTimeout(r, 50));
    }
    return null;
  } catch {
    return null;
  } finally {
    t == null || t.remove();
  }
}
async function Yh(a) {
  const t = or(a);
  if (t) return t;
  const e = a.trim().replace(/^mdi:/, "");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(e)) return null;
  const i = xn.get(e);
  if (i) return i;
  const n = Kh(e).finally(() => xn.delete(e));
  return xn.set(e, n), n;
}
function Xh(a) {
  var o;
  const { layer: t, plan: e, shapes: i } = a;
  if (t.destroyChildren(), i.clear(), !e) return;
  const n = e.markers ?? [];
  for (const l of e.areas ?? []) {
    if (!a.editMode && !As(l, a.view)) continue;
    const d = Zh(l, a, n);
    d && (d.on("click tap", (c) => {
      var p;
      c.cancelBubble = !0, a.editMode && !((p = c.evt) != null && p.defaultPrevented) && a.onSelect(l.id);
    }), d.on("dragend", () => {
      if (!a.editMode) return;
      const c = d.position();
      a.onUpdateShape(l.id, { x: c.x, y: c.y }), a.onRerender();
    }), t.add(d), i.set(l.id, d), qh(l, d, a, n));
  }
  if (!a.editMode || !a.selectedAreaId) return;
  const r = i.get(a.selectedAreaId), s = (o = e.areas) == null ? void 0 : o.find((l) => l.id === a.selectedAreaId);
  (s == null ? void 0 : s.shape.type) === "polygon" && r instanceof rt.Line ? Jh(t, s, r, a) : (s == null ? void 0 : s.shape.type) === "rect" && r instanceof rt.Rect && Qh(t, s.id, r, a);
}
function As(a, t) {
  var n, r;
  const e = (n = t == null ? void 0 : t.filters) == null ? void 0 : n.area_ids;
  if (e != null && e.length && (!a.area_id || !e.includes(a.area_id)))
    return !1;
  const i = (r = t == null ? void 0 : t.filters) == null ? void 0 : r.tags;
  return !(i != null && i.length) || i.some((s) => a.tags.includes(s));
}
function Zh(a, { editMode: t, view: e, states: i, entities: n = [] }, r) {
  var c, p;
  const { shape: s, style: o } = a;
  if (s.type === "mesh" || s.type === "anchor3d") return null;
  const l = {
    fill: o.fill ?? "#2196f3",
    stroke: o.stroke ?? "#1976d2",
    strokeWidth: o.strokeWidth ?? 2,
    opacity: o.fillOpacity ?? 0.4,
    draggable: t
  }, d = e == null ? void 0 : e.style;
  if (!t && (d != null && d.highlight_active_areas || d != null && d.dim_inactive_areas)) {
    const f = !!a.area_id && Js(a.area_id, (c = e == null ? void 0 : e.filters) == null ? void 0 : c.domains, i, n, r);
    f && d.highlight_active_areas ? (l.fill = d.active_area_fill ?? l.fill, l.stroke = d.active_area_stroke ?? l.stroke, l.opacity = d.active_area_opacity ?? l.opacity) : !f && d.dim_inactive_areas && (l.opacity = d.inactive_area_opacity ?? 0.15);
  }
  return s.type === "polygon" && (((p = s.points) == null ? void 0 : p.length) ?? 0) >= 6 ? new rt.Line({
    x: s.x ?? 0,
    y: s.y ?? 0,
    points: s.points,
    closed: !0,
    ...l
  }) : s.type === "rect" ? new rt.Rect({
    x: s.x ?? 0,
    y: s.y ?? 0,
    width: s.width ?? 100,
    height: s.height ?? 80,
    ...l
  }) : null;
}
function qh(a, t, { layer: e, view: i, states: n, areas: r, entities: s = [] }, o) {
  var _, y, v, w;
  const l = [], d = (_ = r.find((h) => h.id === a.area_id)) == null ? void 0 : _.name;
  a.area_id && l.push(d ?? a.area_id);
  const c = { areaId: a.area_id, entities: s, markers: o }, p = li((y = i == null ? void 0 : i.area_overlay) == null ? void 0 : y.primary, n, c), f = li((v = i == null ? void 0 : i.area_overlay) == null ? void 0 : v.secondary, n, c);
  p && l.push(p), f && l.push(f);
  for (const h of Aa((w = i == null ? void 0 : i.area_overlay) == null ? void 0 : w.badges, n))
    l.push(`${h.icon ? `${h.icon} ` : ""}${h.label ?? h.entity_id}`);
  if (!l.length) return;
  const g = t.getClientRect({ relativeTo: e }), u = new rt.Label({
    x: g.x + 8,
    y: g.y + 8,
    listening: !1
  });
  u.add(
    new rt.Tag({
      fill: "rgba(255,255,255,0.88)",
      cornerRadius: 4,
      shadowColor: "rgba(0,0,0,0.25)",
      shadowBlur: 3
    }),
    new rt.Text({
      text: l.join(`
`),
      fontSize: 13,
      fontStyle: "bold",
      fill: "#0d47a1",
      padding: 5,
      lineHeight: 1.2
    })
  ), e.add(u);
}
function Jh(a, t, e, i) {
  if (t.shape.type !== "polygon") return;
  const n = [...t.shape.points], r = t.shape.x ?? 0, s = t.shape.y ?? 0;
  for (let o = 0; o < n.length; o += 2) {
    const l = new rt.Circle({
      x: r + n[o],
      y: s + n[o + 1],
      radius: 7,
      fill: "#ffffff",
      stroke: "#d32f2f",
      strokeWidth: 3,
      draggable: !0
    });
    l.on("dragmove", () => {
      n[o] = l.x() - r, n[o + 1] = l.y() - s, e.points(n), a.batchDraw();
    }), l.on("dragend", () => {
      i.onUpdateShape(t.id, { points: [...n] }), i.onRerender();
    }), a.add(l);
  }
}
function Qh(a, t, e, i) {
  const n = Math.min(20, e.width()), r = Math.min(20, e.height()), s = new rt.Transformer({
    nodes: [e],
    rotateEnabled: !1,
    keepRatio: !1,
    flipEnabled: !1,
    ignoreStroke: !0,
    anchorSize: 9,
    boundBoxFunc: (o, l) => {
      const d = a.getAbsoluteScale();
      return l.width < n * d.x || l.height < r * d.y ? o : l;
    }
  });
  e.on("transformend", () => {
    const o = Math.max(n, e.width() * e.scaleX()), l = Math.max(r, e.height() * e.scaleY());
    e.scale({ x: 1, y: 1 }), i.onUpdateShape(t, {
      x: e.x(),
      y: e.y(),
      width: o,
      height: l
    }), i.onRerender();
  }), a.add(s);
}
function tc(a) {
  var e, i, n, r;
  const t = new Map((((e = a.plan) == null ? void 0 : e.areas) ?? []).map((s) => [s.id, s]));
  for (const [s, o] of a.areaShapes.entries()) {
    o.draggable(a.editMode);
    const l = ((i = t.get(s)) == null ? void 0 : i.style.strokeWidth) ?? 2;
    o.strokeWidth(l + (a.selectedAreaId === s ? 2 : 0));
  }
  for (const [s, o] of a.markerGroups.entries()) {
    o.draggable(a.editMode);
    const l = o.findOne(".marker-dot");
    l == null || l.strokeWidth(a.selectedMarkerId === s ? 4 : 2);
  }
  (n = a.areasLayer) == null || n.batchDraw(), (r = a.markersLayer) == null || r.batchDraw();
}
function ec(a) {
  var s, o;
  const { layer: t, plan: e, groups: i } = a;
  if (t.destroyChildren(), i.clear(), (s = a.stage) == null || s.off("scaleXChange.markerSize"), !e) return;
  const n = () => {
    var d;
    const l = 1 / (((d = a.stage) == null ? void 0 : d.scaleX()) || 1);
    for (const c of i.values()) c.scale({ x: l, y: l });
  };
  (o = a.stage) == null || o.on("scaleXChange.markerSize", n);
  const r = new Map(a.entities.map((l) => [l.entity_id, l]));
  for (const l of e.markers ?? []) {
    if (!a.editMode && !Sa(l, a.view)) continue;
    const d = a.states[l.entity_id], c = r.get(l.entity_id), p = ic(l, d, c, a);
    p.on("click tap", (f) => {
      var g;
      f.cancelBubble = !0, !((g = f.evt) != null && g.defaultPrevented) && (a.editMode ? a.onSelect(l.id) : a.onActivate(l));
    }), p.on("dragend", () => {
      a.editMode && a.onMove(l.id, p.position());
    }), p.on("mouseenter", () => {
      a.stage && (a.stage.container().style.cursor = "pointer");
    }), p.on("mouseleave", () => {
      a.stage && (a.stage.container().style.cursor = "default");
    }), t.add(p), i.set(l.id, p), Ss(t, p, l, d, c);
  }
  n(), t.batchDraw();
}
function ic(a, t, e, i) {
  var r;
  const n = new rt.Group({
    x: a.pos.x,
    y: a.pos.y,
    draggable: i.editMode
  });
  return n.add(
    new rt.Circle({
      name: "marker-dot",
      radius: 16,
      fill: xa(t),
      stroke: "#ffffff",
      strokeWidth: i.selectedMarkerId === a.id ? 4 : 2,
      shadowColor: "#000000",
      shadowBlur: 5,
      shadowOpacity: 0.25
    }),
    new rt.Rect({
      name: "marker-plate",
      x: 17,
      y: -18,
      fill: "#202a30",
      cornerRadius: 5,
      stroke: "#fff",
      strokeWidth: 1,
      listening: !1
    }),
    new rt.Text({
      name: "marker-label",
      x: 21,
      y: -17,
      text: a.label_mode === "off" ? "" : Ca(a, t, e),
      fill: "#ffffff",
      fontSize: 13,
      fontStyle: "bold",
      padding: 2,
      listening: !1
    }),
    new rt.Text({
      name: "marker-value",
      x: 21,
      y: 1,
      text: Ms(
        a,
        t,
        i.view,
        i.states,
        i.entities,
        ((r = i.plan) == null ? void 0 : r.markers) ?? []
      ),
      fill: "#e0e8ed",
      fontSize: 12,
      padding: 2,
      listening: !1
    })
  ), xs(n), n;
}
const oa = /* @__PURE__ */ new WeakMap();
function Ss(a, t, e, i, n) {
  var d, c;
  const r = Cs(e.icon, i, n, e.entity_id);
  if (oa.get(t) === r) return;
  oa.set(t, r), (d = t.findOne(".marker-icon-path")) == null || d.destroy(), (c = t.findOne(".marker-icon-glyph")) == null || c.destroy();
  const s = (p) => {
    t.add(
      new rt.Path({
        name: "marker-icon-path",
        x: -9,
        y: -9,
        scale: { x: 0.75, y: 0.75 },
        data: p,
        fill: "#ffffff",
        listening: !1
      })
    );
  }, o = or(r);
  if (o) {
    s(o);
    return;
  }
  const l = new rt.Text({
    name: "marker-icon-glyph",
    x: -10,
    y: -7,
    width: 20,
    align: "center",
    text: to(e.entity_id),
    fill: "#ffffff",
    fontSize: 14,
    fontStyle: "bold",
    listening: !1
  });
  t.add(l), Yh(r).then((p) => {
    !p || t.getLayer() !== a || l.getParent() !== t || (l.destroy(), s(p), a.batchDraw());
  });
}
function xs(a) {
  const t = a.findOne(".marker-plate"), e = a.findOne(".marker-label"), i = a.findOne(".marker-value"), n = !!e.text(), r = n ? -18 : -i.height() / 2 - 2;
  t.y(r), i.y(n ? 0 : r + 2), t.size({
    width: Math.max(n ? e.width() : 0, i.width()) + 8,
    height: i.y() - r + i.height() + 3
  });
}
function nc(a) {
  const t = new Map(a.entities.map((e) => [e.entity_id, e]));
  for (const e of a.plan.markers ?? []) {
    const i = a.groups.get(e.id);
    if (!i) continue;
    const n = a.states[e.entity_id], r = t.get(e.entity_id), s = i.findOne(".marker-dot"), o = i.findOne(".marker-value"), l = i.findOne(".marker-label");
    s == null || s.fill(xa(n)), o == null || o.text(
      Ms(
        e,
        n,
        a.view,
        a.states,
        a.entities,
        a.plan.markers ?? []
      )
    ), l == null || l.text(e.label_mode === "off" ? "" : Ca(e, n, r)), Ss(a.layer, i, e, n, r), xs(i);
  }
  a.layer.batchDraw();
}
function Ms(a, t, e, i, n, r) {
  const s = e == null ? void 0 : e.marker_overlay, o = n.find((p) => p.entity_id === a.entity_id), l = {
    areaId: a.area_id ?? (o == null ? void 0 : o.area_id) ?? null,
    entities: n,
    markers: r
  }, d = [
    s != null && s.primary ? li(s.primary, i, l) : wr(a, t),
    s != null && s.secondary ? li(s.secondary, i, l) : wr(a, t, "secondary")
  ].filter(Boolean).join(" · "), c = Aa(s == null ? void 0 : s.badges, i).map(
    (p) => `${p.icon ? `${p.icon} ` : ""}${p.label ?? p.entity_id}`
  );
  return [d, ...c].filter(Boolean).join(`
`);
}
function rc(a, t, e) {
  a.add(
    new rt.Rect({
      x: 0,
      y: 0,
      width: t,
      height: e,
      fill: "#fff3e0"
    })
  );
  const i = new rt.Text({
    x: t / 2,
    y: e / 2 - 10,
    text: "Failed to load floorplan image",
    fontSize: 18,
    fontStyle: "bold",
    fill: "#e65100"
  });
  i.offsetX(i.width() / 2), a.add(i);
  const n = new rt.Text({
    x: t / 2,
    y: e / 2 + 20,
    text: "Try re-uploading the image in Edit mode.",
    fontSize: 14,
    fill: "#e65100"
  });
  n.offsetX(n.width() / 2), a.add(n);
}
function ac(a, t) {
  const e = a.getBoundingClientRect(), i = new rt.Stage({
    container: a,
    width: e.width || 400,
    height: e.height || 300,
    draggable: !0
  }), n = new rt.Layer({ listening: !1 }), r = new rt.Layer(), s = new rt.Layer();
  i.add(n), i.add(r), i.add(s), i.on("click tap", (u) => {
    var _;
    t.isEditing() && u.target === i && !((_ = u.evt) != null && _.defaultPrevented) && t.onEmptyCanvasClick();
  }), i.on("wheel", (u) => {
    u.evt.preventDefault();
    const _ = i.getPointerPosition();
    if (!_ || u.evt.deltaY === 0) return;
    const y = i.scaleX(), v = {
      x: (_.x - i.x()) / y,
      y: (_.y - i.y()) / y
    }, { minZoom: w, maxZoom: h } = t.getZoomLimits(), m = u.evt.deltaY > 0 ? y / 1.1 : y * 1.1, b = Math.max(w, Math.min(h, m));
    i.scale({ x: b, y: b }), i.position({
      x: _.x - v.x * b,
      y: _.y - v.y * b
    });
  });
  let o = !1, l = null, d = 0;
  const c = (u) => {
    const _ = u.touches[0], y = u.touches[1];
    if (!o && !y) return;
    if (u.preventDefault(), u.stopPropagation(), !_ || !y) {
      l = null;
      return;
    }
    o || (o = !0, i.draggable(!1));
    const v = i.getContent().getBoundingClientRect(), w = { x: _.clientX - v.left, y: _.clientY - v.top }, h = { x: y.clientX - v.left, y: y.clientY - v.top }, m = {
      x: (w.x + h.x) / 2,
      y: (w.y + h.y) / 2
    }, b = Math.hypot(h.x - w.x, h.y - w.y);
    if (!l || d === 0) {
      l = m, d = b;
      return;
    }
    const A = i.scaleX(), M = {
      x: (l.x - i.x()) / A,
      y: (l.y - i.y()) / A
    }, { minZoom: C, maxZoom: k } = t.getZoomLimits(), x = A * (b / d), P = Math.max(C, Math.min(k, x));
    i.scale({ x: P, y: P }), i.position({
      x: m.x - M.x * P,
      y: m.y - M.y * P
    }), l = m, d = b;
  }, p = (u) => {
    o && (u.preventDefault(), l = null, u.touches.length === 0 && (o = !1, i.draggable(!0)));
  }, f = { capture: !0, passive: !1 };
  a.addEventListener("touchstart", c, f), a.addEventListener("touchmove", c, f), a.addEventListener("touchend", p, f), a.addEventListener("touchcancel", p, f);
  const g = new ResizeObserver(([u]) => {
    if (!u) return;
    const { width: _, height: y } = u.contentRect;
    _ > 0 && y > 0 && (i.position({
      x: i.x() + (_ - i.width()) / 2,
      y: i.y() + (y - i.height()) / 2
    }), i.size({ width: _, height: y }));
  });
  return g.observe(a), {
    stage: i,
    backgroundLayer: n,
    areasLayer: r,
    markersLayer: s,
    destroy: () => {
      a.removeEventListener("touchstart", c, f), a.removeEventListener("touchmove", c, f), a.removeEventListener("touchend", p, f), a.removeEventListener("touchcancel", p, f), g.disconnect(), i.destroy();
    }
  };
}
function sc(a, t, e, i = { minZoom: 0.1, maxZoom: 5 }) {
  if (![t, e, a.width(), a.height()].every(
    (s) => Number.isFinite(s) && s > 0
  ))
    return;
  const n = Math.min(a.width() / t, a.height() / e) * 0.9, r = Math.max(i.minZoom, Math.min(i.maxZoom, n));
  a.scale({ x: r, y: r }), a.position({
    x: (a.width() - t * r) / 2,
    y: (a.height() - e * r) / 2
  });
}
function oc(a) {
  return a.getAbsoluteTransform().copy().invert().point({
    x: a.width() / 2,
    y: a.height() / 2
  });
}
class lc {
  constructor(t, e, i, n) {
    this.shapes = e, this.groups = i, this.callbacks = n, this.imageGeneration = 0, this.imageLoading = !1, this.pendingFocus = null, this.controller = ac(t, {
      isEditing: n.isEditing,
      getZoomLimits: () => {
        var s;
        const r = (s = n.getPlan()) == null ? void 0 : s.view;
        return { minZoom: (r == null ? void 0 : r.minZoom) ?? 0.1, maxZoom: (r == null ? void 0 : r.maxZoom) ?? 5 };
      },
      onEmptyCanvasClick: n.onEmptyCanvasClick
    });
  }
  get stage() {
    return this.controller.stage;
  }
  destroy() {
    this.imageGeneration++;
    const t = this.stage.getContent();
    this.controller.destroy(), t == null || t.remove(), this.shapes.clear(), this.groups.clear();
  }
  renderPlan(t, e) {
    var c;
    const { backgroundLayer: i, areasLayer: n, markersLayer: r } = this.controller, s = ++this.imageGeneration;
    this.pendingFocus = null, this.imageLoading = !1, i.destroyChildren(), this.renderMarkers(e), this.renderAreas(e), i.batchDraw(), n.batchDraw(), r.batchDraw();
    const o = (c = e.plan) == null ? void 0 : c.background;
    if ((o == null ? void 0 : o.type) !== "image" || !(o.asset_id || o.url)) return;
    this.imageLoading = !0;
    const l = () => {
      var p, f, g;
      return s === this.imageGeneration && ((p = this.callbacks.getPlan()) == null ? void 0 : p.plan_id) === ((f = e.plan) == null ? void 0 : f.plan_id) && ((g = this.callbacks.getPlan()) == null ? void 0 : g.background) === o;
    }, d = (p) => {
      l() && (this.imageLoading = !1, this.pendingFocus = null, i.destroyChildren(), rc(i, this.stage.width(), this.stage.height()), this.callbacks.onImageError(p));
    };
    Ha(t, o).then((p) => {
      if (!l()) return;
      const f = URL.createObjectURL(p), g = new Image();
      g.onerror = () => {
        URL.revokeObjectURL(f), d("load");
      }, g.onload = () => {
        if (URL.revokeObjectURL(f), !!l())
          try {
            const u = new rt.Image({
              x: 0,
              y: 0,
              image: g,
              width: o.width || g.width,
              height: o.height || g.height
            });
            i.add(u), i.batchDraw(), this.fitToScreen(u.width(), u.height()), this.imageLoading = !1;
            const _ = this.pendingFocus;
            this.pendingFocus = null, _ && this.focusObject(_.kind, _.id);
          } catch {
            d("render");
          }
      }, g.src = f;
    }).catch(() => d("load"));
  }
  fitToScreen(t, e) {
    var i;
    sc(this.stage, t, e, (i = this.callbacks.getPlan()) == null ? void 0 : i.view);
  }
  center() {
    return oc(this.stage);
  }
  clientPoint(t, e, i = this.stage.container()) {
    const n = i.getBoundingClientRect();
    return this.stage.getAbsoluteTransform().copy().invert().point({
      x: t - n.left,
      y: e - n.top
    });
  }
  zoomBy(t) {
    var s;
    const { stage: e } = this, i = (s = this.callbacks.getPlan()) == null ? void 0 : s.view;
    if (!i) return;
    const n = this.center(), r = Math.min(i.maxZoom, Math.max(i.minZoom, e.scaleX() * t));
    e.scale({ x: r, y: r }), e.position({
      x: e.width() / 2 - n.x * r,
      y: e.height() / 2 - n.y * r
    });
  }
  focusObject(t, e) {
    const i = (t === "area" ? this.shapes : this.groups).get(e);
    if (!i) return;
    this.imageLoading && (this.pendingFocus = { kind: t, id: e });
    const { stage: n } = this, r = i.getAbsolutePosition();
    n.position({
      x: n.x() + n.width() / 2 - r.x,
      y: n.y() + n.height() / 2 - r.y
    });
  }
  renderAreas(t) {
    Xh({
      ...t,
      view: t.view,
      layer: this.controller.areasLayer,
      shapes: this.shapes,
      onSelect: (e) => this.callbacks.select("area", e),
      onUpdateShape: this.callbacks.resize,
      onRerender: () => this.renderAreas(this.callbacks.getState())
    }), this.syncCanvasInteractivity(t);
  }
  renderMarkers(t) {
    ec({
      ...t,
      view: t.view,
      layer: this.controller.markersLayer,
      stage: this.stage,
      groups: this.groups,
      onSelect: (e) => this.callbacks.select("marker", e),
      onActivate: this.callbacks.activate,
      onMove: this.callbacks.move
    });
  }
  refreshMarkerLiveValues(t) {
    t.plan && nc({
      ...t,
      view: t.view,
      plan: t.plan,
      layer: this.controller.markersLayer,
      groups: this.groups
    });
  }
  syncCanvasInteractivity(t) {
    tc({
      ...t,
      areasLayer: this.controller.areasLayer,
      markersLayer: this.controller.markersLayer,
      areaShapes: this.shapes,
      markerGroups: this.groups
    });
  }
}
const dc = ga`
  :host {
    display: block;
    height: 100vh;
    height: 100dvh;
    background: var(--primary-background-color, #fafafa);
    color: var(--primary-text-color, #212121);
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .workspace {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    flex: 1;
    min-height: 0;
  }

  .workspace.editing {
    grid-template-columns: minmax(0, 1fr) clamp(320px, 24vw, 390px);
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    gap: 12px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    border-bottom: 1px solid var(--divider-color, #ddd);
    min-height: 48px;
    box-sizing: border-box;
  }

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }

  .plan-select {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    max-width: 100%;
    color: inherit;
    font-size: 14px;
  }

  .plan-select select {
    min-width: 0;
    max-width: 100%;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid var(--divider-color, #d7d7d7);
    background: var(--card-background-color, #fff);
    color: inherit;
    font-size: 14px;
  }

  .views-bar {
    min-width: 0;
    padding: 0 16px;
    background: var(--card-background-color, #fff);
    border-bottom: 1px solid var(--divider-color, #ddd);
  }

  .view-tabs {
    display: flex;
    gap: 4px;
    overflow-x: auto;
  }

  .view-tab {
    flex: none;
    max-width: min(260px, calc(100vw - 40px));
    min-height: 44px;
    overflow: hidden;
    padding: 6px 12px;
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: var(--secondary-text-color, #555);
    cursor: pointer;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .view-tab:hover {
    background: var(--secondary-background-color, #eee);
  }

  .view-tab.active {
    border-bottom-color: var(--primary-color, #03a9f4);
    color: var(--primary-text-color, #212121);
  }

  .edit-toggle {
    min-height: 36px;
    padding: 6px 16px;
    border: 1px solid var(--divider-color, #d7d7d7);
    border-radius: 6px;
    background: var(--card-background-color, #fff);
    color: inherit;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
  }

  .edit-toggle:hover,
  .edit-toggle.active {
    background: var(--secondary-background-color, #eee);
  }

  .canvas-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 0;
    background: var(--secondary-background-color, #f5f5f5);
  }

  .canvas-wrapper {
    position: absolute;
    inset: 0;
  }

  .loading,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
    color: var(--secondary-text-color, #666);
    text-align: center;
    padding: 20px;
  }

  .empty-state {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    background: var(--secondary-background-color, #f5f5f5);
  }

  .empty-state h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    color: var(--primary-text-color, #333);
  }

  .empty-state p {
    margin: 0;
    font-size: 16px;
    max-width: 400px;
  }

  .empty-state .upload-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    background: var(--primary-text-color, #212121);
    color: var(--card-background-color, #fff);
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
  }

  .empty-state .upload-btn:hover {
    opacity: 0.9;
  }

  .canvas-fit,
  .empty-state .import-btn {
    min-height: 44px;
    padding: 0 12px;
    border: 1px solid var(--divider-color, #d7d7d7);
    border-radius: 6px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    cursor: pointer;
    font-size: 14px;
  }

  .canvas-fit {
    position: absolute;
    inset-inline-end: 12px;
    bottom: 12px;
  }

  .file-input,
  .config-file-input {
    display: none;
  }

  .editor-panel {
    min-width: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 14px;
    box-sizing: border-box;
    border-inline-start: 1px solid var(--divider-color, #d7d7d7);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    scrollbar-gutter: stable;
  }

  .editor-panel-header {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0 2px 14px;
  }

  .editor-panel-header span {
    color: var(--secondary-text-color, #616161);
    font-size: 12px;
    font-weight: 600;
  }

  .editor-panel-header strong {
    overflow: hidden;
    color: var(--primary-text-color, #212121);
    font-size: 18px;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .editor-card {
    min-width: 0;
    margin: 0 0 12px;
    padding: 12px;
    box-sizing: border-box;
    border: 1px solid var(--divider-color, #d7d7d7);
    border-radius: 10px;
    background: var(--primary-background-color, #fafafa);
    box-shadow: var(--ha-card-box-shadow, 0 1px 2px rgba(0, 0, 0, 0.08));
  }

  .editor-card h2,
  .editor-card h3 {
    margin: 0 0 10px;
    color: var(--primary-text-color, #212121);
    font-size: 14px;
    line-height: 1.35;
  }

  details.editor-card {
    padding: 0;
  }

  details.editor-card > summary {
    min-height: 44px;
    padding: 12px;
    box-sizing: border-box;
    color: var(--primary-text-color, #212121);
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
  }

  details.editor-card[open] > summary {
    border-bottom: 1px solid var(--divider-color, #d7d7d7);
  }

  .editor-card-body {
    padding: 12px;
  }

  .editor-actions,
  .editor-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    min-width: 0;
  }

  .editor-panel button,
  .editor-panel input,
  .editor-panel select {
    min-width: 0;
    min-height: 40px;
    box-sizing: border-box;
    border: 1px solid var(--input-idle-line-color, var(--divider-color, #bdbdbd));
    border-radius: 6px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    font: inherit;
  }

  .editor-panel button {
    padding: 8px 10px;
    cursor: pointer;
    font-size: 13px;
    line-height: 1.25;
  }

  .editor-panel button:hover:not(:disabled) {
    border-color: var(--primary-color, #03a9f4);
    background: var(--secondary-background-color, #f3f3f3);
  }

  .editor-panel button:disabled {
    background: var(--secondary-background-color, #eeeeee);
    color: var(--disabled-text-color, #757575);
    cursor: not-allowed;
    opacity: 1;
  }

  .editor-panel input,
  .editor-panel select {
    width: 100%;
    padding: 7px 9px;
  }

  .editor-fields label {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 5px;
    color: var(--secondary-text-color, #616161);
    font-size: 12px;
    font-weight: 500;
  }

  .editor-field-wide {
    grid-column: 1 / -1;
  }

  .editor-helper {
    display: block;
    margin: 12px 0 6px;
    color: var(--secondary-text-color, #616161);
    font-size: 12px;
  }

  .entity-palette {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;
    max-height: 168px;
    min-width: 0;
    overflow-y: auto;
    padding-inline-end: 3px;
  }

  .entity-card {
    display: flex;
    min-width: 0;
    flex-direction: column;
    padding: 8px 10px;
    box-sizing: border-box;
    border: 1px solid var(--divider-color, #bdbdbd);
    border-radius: 6px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    cursor: grab;
    font-size: 12px;
    touch-action: none;
    user-select: none;
  }

  .entity-card strong,
  .entity-card span,
  .editor-selection-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .entity-card span {
    color: var(--secondary-text-color, #616161);
  }

  .editor-subsection + .editor-subsection {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--divider-color, #d7d7d7);
  }

  .editor-selection {
    border-inline-start: 3px solid var(--primary-color, #03a9f4);
  }

  .editor-selection-name {
    display: block;
    margin: -4px 0 10px;
    color: var(--secondary-text-color, #616161);
    font-size: 12px;
  }

  .editor-danger {
    border-color: var(--error-color, #db4437) !important;
    color: var(--error-color, #b3261e) !important;
  }

  .canvas-container.drag-target {
    outline: 3px dashed var(--primary-color, #03a9f4);
    outline-offset: -6px;
  }

  .panel-feedback {
    position: absolute;
    z-index: 1;
    top: 12px;
    inset-inline: 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    pointer-events: none;
  }

  .status {
    padding: 6px 12px;
    border-radius: 6px;
    background: #e8f5e9;
    color: #1b5e20;
    font-size: 13px;
  }

  .status.error {
    background: #ffebee;
    color: #b71c1c;
  }

  .status button {
    margin-inline-start: 8px;
    pointer-events: auto;
  }

  .viewer-note {
    font-size: 12px;
    opacity: 0.85;
  }

  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  details > summary:focus-visible,
  .canvas-container:focus-visible {
    outline: 3px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
  }

  .canvas-container {
    touch-action: none;
  }

  .canvas-accessibility {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .editor-selection-hint {
    margin: 0 2px 12px;
    color: var(--secondary-text-color, #616161);
    font-size: 13px;
    line-height: 1.5;
  }

  .entity-filters {
    margin: 8px 0;
  }

  .entity-filters summary {
    display: list-item;
    cursor: pointer;
    font-size: 14px;
    padding: 12px 0;
    min-height: 44px;
    box-sizing: border-box;
  }

  :host {
    --frame: var(--primary-background-color, #f4f6f7);
    --sheet: var(--card-background-color, #fff);
    --rule: var(--divider-color, #d8dfe2);
    --muted: var(--secondary-text-color, #526269);
    --ink: var(--primary-text-color, #19282e);
    font-family: var(--ha-font-family-body, Roboto, system-ui, sans-serif);
  }
  .container {
    background: var(--frame);
  }
  .toolbar {
    background: var(--frame);
    border: 0;
    padding: 10px 20px 4px;
  }
  h1 {
    font-size: 18px;
    letter-spacing: -0.03em;
  }
  .plan-select {
    border-inline-start: 1px solid var(--rule);
    padding-inline-start: 16px;
  }
  .plan-select span {
    color: var(--muted);
  }
  .plan-select select {
    background: var(--sheet);
    color: var(--ink);
    font-weight: 600;
  }
  .edit-toggle,
  .edit-toggle.active {
    background: var(--ink);
    color: var(--sheet);
  }
  .edit-toggle:hover {
    background: var(--ink);
    opacity: 0.88;
  }
  .views-bar {
    background: var(--frame);
    border: 0;
    padding-inline: 12px;
  }
  .view-tabs {
    gap: 0;
  }
  .view-tab.active {
    font-weight: 650;
  }
  .workspace {
    margin: 8px;
    gap: 8px;
  }
  .canvas-container,
  .editor-panel {
    border-radius: 16px;
    box-shadow: inset 0 0 0 1px var(--rule);
  }
  .canvas-container {
    background: var(--secondary-background-color, #e7ecee);
  }
  .workspace-title {
    flex: none;
  }
  .save-indicator.status {
    display: block;
    border: 0;
    padding: 0;
    border-radius: 0;
    background: transparent;
    color: var(--muted);
    font-size: 11px;
  }
  .canvas-accessibility:focus-within {
    inset-inline-start: 12px;
    bottom: 70px;
    width: auto;
    height: auto;
    max-height: 50%;
    max-width: calc(100% - 24px);
    overflow: auto;
    clip: auto;
    border: 1px solid var(--rule);
    background: var(--sheet);
    border-radius: 8px;
    padding: 8px;
  }
  .canvas-accessibility ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .canvas-accessibility button {
    color: var(--ink);
    background: var(--sheet);
    border: none;
    padding: 8px;
  }
  .map-dock {
    position: absolute;
    bottom: 12px;
    inset-inline: 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 8px;
    pointer-events: none;
  }
  .map-caption,
  .map-zoom {
    background: var(--sheet);
    border: 1px solid var(--rule);
    border-radius: 8px;
  }
  .map-caption {
    min-width: 0;
    display: grid;
    gap: 2px;
    padding: 6px 10px;
    font-size: 13px;
  }
  .map-caption strong {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .map-caption span {
    color: var(--muted);
    font-size: 12px;
  }
  .map-zoom {
    display: flex;
    flex: none;
    overflow: hidden;
    pointer-events: auto;
  }
  .map-zoom button {
    cursor: pointer;
    background: var(--sheet);
    color: var(--ink);
    border: 0;
    font-size: 20px;
    min-width: 44px;
    min-height: 44px;
  }
  .map-zoom button:focus-visible {
    outline-offset: -3px;
  }
  .map-zoom button:hover {
    background: var(--frame);
  }
  .map-zoom .canvas-fit {
    position: static;
    font-size: 13px;
    font-weight: 600;
    border-inline-start: 1px solid var(--rule);
    border-radius: 0;
  }
  .status {
    background: var(--sheet);
    color: var(--ink);
    border: 1px solid var(--rule);
  }
  .status.error {
    color: var(--error-color, #ae342d);
  }
  .editor-panel {
    border: 0;
    padding: 0 16px 16px;
    background: var(--sheet);
  }
  .editor-panel-header {
    margin: 0 -15px 12px;
    padding: 10px 14px 0;
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--sheet);
    gap: 10px;
    border-bottom: 1px solid var(--rule);
  }
  .editor-heading,
  .history-actions,
  .map-tools,
  .editor-nav {
    display: flex;
    align-items: center;
  }
  .editor-heading {
    justify-content: space-between;
    gap: 8px;
  }
  .history-actions button {
    border: 0;
    font-size: 22px;
    min-width: 38px;
  }
  .history-actions button:disabled {
    background: var(--sheet);
  }
  .map-tools {
    position: absolute;
    top: 12px;
    inset-inline-start: 12px;
    padding: 3px;
    background: var(--sheet);
    border: 1px solid var(--rule);
    border-radius: 8px;
    gap: 2px;
  }
  .map-tools button {
    border: 0;
    background: transparent;
    color: var(--ink);
    border-radius: 5px;
    padding: 0 10px;
    min-height: 40px;
    font: inherit;
    font-size: 13px;
    cursor: pointer;
  }
  .map-tools button[aria-pressed="true"] {
    background: var(--ink);
    color: var(--sheet);
  }
  .editor-nav button {
    border: 0;
    border-radius: 0;
    flex: 1;
    padding-inline: 3px;
  }
  .editor-nav button[aria-current="page"] {
    box-shadow: inset 0 -2px var(--primary-color, #037c96);
    font-weight: 650;
  }
  .editor-card {
    background: var(--sheet);
    border: 0;
    padding: 4px 0;
    border-radius: 0;
    box-shadow: none;
  }
  .editor-card h2 {
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .editor-card small {
    color: var(--muted);
    font-size: 12px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
  .add-plan {
    margin: 0 0 12px;
  }
  .editor-helper {
    font-weight: 400;
    line-height: 1.45;
  }
  .entity-palette {
    gap: 0;
    max-height: max(180px, calc(100dvh - 460px));
  }
  .entity-palette .entity-card {
    position: relative;
    border: 0;
    border-bottom: 1px solid var(--rule);
    border-radius: 0;
    text-align: start;
    gap: 4px;
    padding: 10px 28px 10px 4px;
    cursor: grab;
  }
  .entity-card::after {
    content: "+";
    position: absolute;
    inset-inline-end: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: var(--muted);
  }
  .entity-card[aria-pressed="true"] {
    background: var(--frame);
  }
  .entity-card span {
    font:
      11px ui-monospace,
      monospace;
  }
  .placement-surface {
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
    background: transparent;
    border: 0;
    cursor: crosshair;
  }
  .placement-surface:focus-visible {
    outline-offset: -4px;
  }
  .placement-prompt {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    max-width: calc(100% - 28px);
    width: max-content;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 8px;
    background: var(--ink);
    color: var(--sheet);
    font-size: 13px;
  }
  .placement-prompt div {
    display: grid;
    gap: 4px;
    min-width: 0;
  }
  .placement-prompt strong {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .placement-prompt button {
    background: transparent;
    color: inherit;
    border: 1px solid currentColor;
    border-radius: 4px;
    cursor: pointer;
    padding: 6px;
  }
  .canvas-container .panel-feedback {
    top: auto;
    bottom: 64px;
  }
  .narrow .workspace.editing {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(230px, 1fr) minmax(260px, 45%);
    gap: 0;
    margin: 0;
    align-content: start;
    overflow-y: auto;
  }

  .narrow .editor-panel-header {
    position: static;
  }
  .narrow .editor-panel {
    border-inline-start: 0;
    border-top: 1px solid var(--divider-color, #d7d7d7);
  }

  .narrow button,
  .narrow select,
  .narrow input {
    min-height: 44px;
  }

  @media (max-width: 900px) {
    .editor-panel-header {
      position: static;
    }
    .workspace.editing {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: minmax(230px, 1fr) minmax(260px, 45%);
      gap: 0;
      margin: 0;
      align-content: start;
      overflow-y: auto;
    }

    .editor-panel,
    .canvas-container {
      border-radius: 0;
    }
    .editor-panel {
      border-inline-start: 0;
      border-top: 1px solid var(--divider-color, #d7d7d7);
    }

    .map-tools button,
    .toolbar button,
    .toolbar select,
    .editor-panel button,
    .editor-panel select,
    .editor-panel input,
    .editor-panel .entity-card {
      min-height: 44px;
    }
  }

  @media (max-width: 520px) {
    .toolbar {
      padding: 8px 12px;
    }

    .toolbar-left {
      gap: 8px;
    }

    .plan-select span {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
    }

    .edit-toggle {
      padding-inline: 10px;
    }

    .editor-actions,
    .editor-fields {
      grid-template-columns: minmax(0, 1fr);
    }

    .editor-field-wide {
      grid-column: auto;
    }

    .toolbar-left {
      flex: 1;
    }
    .plan-select {
      padding-inline-start: 6px;
    }
  }

  .entity-palette {
    overflow-anchor: none;
  }

  .entity-palette > [aria-hidden="true"] {
    pointer-events: none;
  }

  .editor-fields label:has(input[list="floorplan-mdi-icons"]) {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
  }
  .editor-fields label:has(input[list="floorplan-mdi-icons"]) > input {
    grid-column: 1 / -1;
  }

  .map-dock[data-3d] {
    flex-wrap: wrap;
  }
  .map-dock[data-3d] .map-zoom {
    flex: 0 1 auto;
    flex-wrap: wrap;
    max-width: 100%;
  }
  .map-zoom .camera-tool {
    padding-inline: 7px;
    font-size: 12px;
    font-weight: 600;
  }
  .canvas-wrapper .floorplan-three-chip[data-interactive] {
    min-height: 44px;
    box-shadow: 0 2px 6px rgb(0 0 0 / 18%);
  }

  .warning-center button {
    min-height: 44px;
  }
  .warning-badge,
  .warning-center button {
    padding: 4px 8px;
    border: 1px solid var(--rule);
    border-radius: 6px;
    background: var(--sheet);
    color: var(--ink);
    cursor: pointer;
  }
  .warning-badge {
    white-space: nowrap;
    font-weight: 600;
  }
  .warning-badge.has-errors {
    border-color: var(--error-color, #b42318);
  }

  .warning-center {
    position: absolute;
    background: var(--sheet);
    z-index: 5;
    inset-block-start: 54px;
    inset-inline-end: 12px;
    width: min(420px, calc(100% - 24px));
    max-height: calc(100% - 68px);
    overflow: auto;
    box-sizing: border-box;
    box-shadow: 0 8px 24px rgb(0 0 0 / 20%);
  }
  .warning-center header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .warning-center ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .warning-center li {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 6px 8px;
    padding-block: 8px;
    border-top: 1px solid var(--rule);
    overflow-wrap: anywhere;
  }
  .warning-center li small {
    grid-column: 2;
    color: var(--muted);
  }
  .warning-center li button {
    grid-column: 2;
    justify-self: start;
  }

  .narrow .map-dock button,
  .narrow .placement-prompt button {
    min-height: 44px;
  }

  @media (max-width: 899px) {
    .map-dock button,
    .placement-prompt button,
    .canvas-container .empty-state button,
    .canvas-container .panel-feedback button {
      min-height: 44px;
    }
  }
`;
var hc = Object.defineProperty, lr = (a, t, e, i) => {
  for (var n = void 0, r = a.length - 1, s; r >= 0; r--)
    (s = a[r]) && (n = s(t, e, n) || n);
  return n && hc(t, e, n), n;
};
const dr = class dr extends ye {
  constructor() {
    super(...arguments), this.dialog = null, this.cancelLabel = "Cancel", this._value = "";
  }
  willUpdate(t) {
    var e;
    t.has("dialog") && (this._value = ((e = this.dialog) == null ? void 0 : e.value) ?? "");
  }
  updated(t) {
    var e;
    if (t.has("dialog") && this.dialog) {
      const i = this.renderRoot.querySelector("dialog");
      i && !i.open && i.showModal(), (e = this.renderRoot.querySelector(this.dialog.kind === "text" ? "input" : "button")) == null || e.focus();
    }
  }
  _resolve(t) {
    var e;
    (e = this.renderRoot.querySelector("dialog")) == null || e.close(), this.dispatchEvent(
      new CustomEvent("floorplan-dialog-resolve", {
        detail: t,
        bubbles: !0,
        composed: !0
      })
    );
  }
  _confirm() {
    this.dialog && (this.dialog.kind === "text" && !this._value.trim() || this._resolve(this.dialog.kind === "text" ? this._value : !0));
  }
  _onKeydown(t) {
    var e;
    if (t.key === "Tab") {
      const i = Array.from(
        this.renderRoot.querySelectorAll("input, button:not([disabled])")
      ), n = i[0], r = i.at(-1), s = (e = this.shadowRoot) == null ? void 0 : e.activeElement;
      t.shiftKey && s === n ? (t.preventDefault(), r == null || r.focus()) : !t.shiftKey && s === r && (t.preventDefault(), n == null || n.focus());
      return;
    }
    t.key === "Enter" && t.target instanceof HTMLInputElement && !t.isComposing && (t.preventDefault(), this._confirm());
  }
  render() {
    const t = this.dialog;
    return t ? V`
      <dialog
        aria-label=${t.title}
        @cancel=${(e) => {
      e.preventDefault(), this._resolve(null);
    }}
        @click=${(e) => {
      if (e.target !== e.currentTarget) return;
      const i = e.currentTarget.getBoundingClientRect();
      (e.clientX < i.left || e.clientX > i.right || e.clientY < i.top || e.clientY > i.bottom) && this._resolve(null);
    }}
        @keydown=${this._onKeydown}
      >
        <h2>${t.title}</h2>
        ${t.message ? V`<p>${t.message}</p>` : ct}
        ${t.kind === "text" ? V`
              <input
                .value=${this._value}
                @input=${(e) => {
      this._value = e.target.value;
    }}
              />
            ` : ct}
        <div class="actions">
          <button type="button" @click=${() => this._resolve(null)}>${this.cancelLabel}</button>
          <button
            type="button"
            class=${t.destructive ? "destructive" : ""}
            ?disabled=${t.kind === "text" && !this._value.trim()}
            @click=${this._confirm}
          >
            ${t.confirmLabel}
          </button>
        </div>
      </dialog>
    ` : ct;
  }
};
dr.styles = ga`
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }

    dialog {
      box-sizing: border-box;
      width: min(440px, calc(100% - 40px));
      padding: 20px;
      border: none;
      border-radius: 8px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    h2 {
      margin: 0 0 12px;
      font-size: 20px;
    }

    p {
      margin: 0 0 16px;
    }

    input {
      box-sizing: border-box;
      width: 100%;
      margin-bottom: 18px;
      padding: 9px 10px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    button {
      padding: 8px 16px;
    }

    .destructive {
      border-color: #b71c1c;
      background: #b71c1c;
      color: #fff;
    }
  `;
let xe = dr;
lr([
  Me({ attribute: !1 })
], xe.prototype, "dialog");
lr([
  Me()
], xe.prototype, "cancelLabel");
lr([
  tt()
], xe.prototype, "_value");
customElements.get("floorplan-dialog") || customElements.define("floorplan-dialog", xe);
const la = 6, cc = 250;
class uc {
  constructor(t) {
    this.callbacks = t, this._entityPointerDrag = null, this.skipNextClick = !1, this.onCanvasDragOver = (e) => {
      this.callbacks.isEnabled() && (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"), e.currentTarget.classList.add("drag-target"));
    }, this.onCanvasDragLeave = (e) => {
      e.currentTarget.classList.remove("drag-target");
    }, this.onCanvasDrop = (e) => {
      var r, s;
      e.preventDefault();
      const i = e.currentTarget;
      if (i.classList.remove("drag-target"), !this.callbacks.isEnabled()) return;
      const n = ((r = e.dataTransfer) == null ? void 0 : r.getData("application/x-floorplan-entity")) || ((s = e.dataTransfer) == null ? void 0 : s.getData("text/plain"));
      n && this.callbacks.onDropEntity(n, e.clientX, e.clientY, i);
    }, this.onEntityDragStart = (e, i) => {
      i.dataTransfer && (this.cancel(), i.dataTransfer.setData("application/x-floorplan-entity", e), i.dataTransfer.setData("text/plain", e), i.dataTransfer.effectAllowed = "copy");
    }, this.onEntityPointerDown = (e, i) => {
      if (!this.callbacks.isEnabled() || !i.isPrimary || i.button !== 0)
        return;
      this.cancel(), this.skipNextClick = !1;
      const n = i.currentTarget, r = n.closest(".entity-palette");
      if (this._entityPointerDrag = {
        entityId: e,
        pointerId: i.pointerId,
        pointerType: i.pointerType,
        target: n,
        palette: r,
        startX: i.clientX,
        startY: i.clientY,
        startScrollTop: (r == null ? void 0 : r.scrollTop) ?? 0,
        ready: i.pointerType !== "touch",
        scrolling: !1,
        holdTimer: null,
        active: !1
      }, i.pointerType === "touch") {
        const s = i.pointerId;
        this._entityPointerDrag.holdTimer = window.setTimeout(() => {
          const o = this._entityPointerDrag;
          (o == null ? void 0 : o.pointerId) === s && !o.scrolling && (o.ready = !0);
        }, cc);
      }
      try {
        n.setPointerCapture(i.pointerId);
      } catch {
      }
    }, this.onEntityPointerMove = (e) => {
      const i = this._entityPointerDrag;
      if (!i || i.pointerId !== e.pointerId) return;
      const n = e.clientX - i.startX, r = e.clientY - i.startY, s = Math.hypot(n, r);
      if (i.pointerType === "touch" && !i.ready) {
        e.preventDefault(), s >= la && (i.scrolling = !0, i.holdTimer !== null && (window.clearTimeout(i.holdTimer), i.holdTimer = null), i.palette && (i.palette.scrollTop = i.startScrollTop - r));
        return;
      }
      if (!i.active && s >= la && (i.active = !0), !i.active) return;
      e.preventDefault();
      const o = this.callbacks.getCanvasContainer();
      o == null || o.classList.toggle(
        "drag-target",
        this._clientPointIsInside(o, e.clientX, e.clientY)
      );
    }, this.onEntityPointerUp = (e) => {
      const i = this._entityPointerDrag;
      if (!i || i.pointerId !== e.pointerId) return;
      const n = this.callbacks.getCanvasContainer();
      this.skipNextClick = i.active || i.scrolling;
      const r = this.callbacks.isEnabled() && i.active && this._clientPointIsInside(n, e.clientX, e.clientY);
      this.cancel(), r && n && this.callbacks.onDropEntity(i.entityId, e.clientX, e.clientY, n);
    }, this.onEntityPointerCancel = (e) => {
      var i;
      ((i = this._entityPointerDrag) == null ? void 0 : i.pointerId) === e.pointerId && this.cancel();
    };
  }
  attach() {
    window.addEventListener("pointermove", this.onEntityPointerMove, { passive: !1 }), window.addEventListener("pointerup", this.onEntityPointerUp), window.addEventListener("pointercancel", this.onEntityPointerCancel);
  }
  detach() {
    window.removeEventListener("pointermove", this.onEntityPointerMove), window.removeEventListener("pointerup", this.onEntityPointerUp), window.removeEventListener("pointercancel", this.onEntityPointerCancel), this.cancel(), this.skipNextClick = !1;
  }
  _clientPointIsInside(t, e, i) {
    if (!t) return !1;
    const n = t.getBoundingClientRect();
    return e >= n.left && e <= n.right && i >= n.top && i <= n.bottom;
  }
  cancel() {
    var e;
    (e = this.callbacks.getCanvasContainer()) == null || e.classList.remove("drag-target");
    const t = this._entityPointerDrag;
    if (t) {
      t.holdTimer !== null && window.clearTimeout(t.holdTimer);
      try {
        t.target.hasPointerCapture(t.pointerId) && t.target.releasePointerCapture(t.pointerId);
      } catch {
      }
    }
    this._entityPointerDrag = null;
  }
}
async function gc(a, t) {
  const e = await wo(a, t), i = URL.createObjectURL(
    new Blob([JSON.stringify(e)], { type: "application/json" })
  );
  try {
    const n = document.createElement("a");
    n.href = i, n.download = `floorplan-ui-config-v${t.version}.json`, n.click();
  } finally {
    URL.revokeObjectURL(i);
  }
}
async function fc(a, t, e, i) {
  if (t.size > Ea) throw new Error(i("panel.configTooLarge"));
  const n = JSON.parse(await t.text());
  if (!n || typeof n != "object" || Array.isArray(n))
    throw new Error(i("panel.invalidConfig"));
  const r = "plans" in n && Array.isArray(n.plans) ? n.plans.length : 0, s = "views" in n && Array.isArray(n.views) ? n.views.length : 0;
  return await e(r, s) ? ka(
    a,
    await Ao(a, n)
  ) : null;
}
function pc(a, t) {
  const e = a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "view";
  let i = e, n = 2;
  for (; t.some((r) => r.id === i); )
    i = `${e}-${n++}`;
  return { id: i, name: a, filters: {} };
}
function ks(a, t, e) {
  return {
    ...a,
    views: a.views.map((i) => i.id === t ? e(i) : i)
  };
}
function mc(a, t, e) {
  const i = a.views.findIndex((s) => s.id === t), n = i + e;
  if (i < 0 || n < 0 || n >= a.views.length)
    return null;
  const r = [...a.views];
  return [r[i], r[n]] = [r[n], r[i]], { ...a, views: r };
}
function _c(a, t) {
  var n;
  const e = a.views.filter((r) => r.id !== t);
  if (e.length === a.views.length || e.length === 0)
    return null;
  const i = ((n = e.find((r) => r.id === "all")) == null ? void 0 : n.id) ?? e[0].id;
  return {
    nextViewId: i,
    config: {
      ...a,
      default_view: a.default_view === t ? i : a.default_view,
      views: e
    }
  };
}
function da(a) {
  var i;
  const t = a.target, e = (i = t.files) == null ? void 0 : i[0];
  return t.value = "", e;
}
class yc {
  constructor(t) {
    this.host = t;
  }
  get t() {
    return this.host.localize();
  }
  async confirmDelete(t) {
    return this.host.confirm(
      this.t(`dialog.delete${t}Message`),
      this.t(`editor.delete${t}`),
      !0
    );
  }
  async renamePlan(t) {
    var n;
    if (!t || !this.host.editableConfig()) return;
    const e = (n = await this.host.askText(this.t("dialog.renamePlan"), t.name)) == null ? void 0 : n.trim(), i = this.host.editableConfig();
    i && e && e !== t.name && this.host.commit(Lo(i, t.plan_id, e));
  }
  async deletePlan(t) {
    if (!t || !this.host.editableConfig() || !await this.confirmDelete("Plan")) return;
    const e = this.host.editableConfig(), i = e && Oo(e, t.plan_id);
    i && (this.host.selectPlan(i.nextPlanId), this.host.commit(i.config));
  }
  async deleteObject(t, e, i) {
    if (!e || !i || !this.host.editableConfig() || !await this.confirmDelete(t === "area" ? "Area" : "Marker"))
      return;
    const n = this.host.editableConfig();
    if (!n) return;
    const r = t === "area" ? Go : ko;
    this.host.commit(r(n, e.plan_id, i));
  }
  async addView() {
    var n;
    if (!this.host.editableConfig()) return;
    const t = (n = await this.host.askText(this.t("dialog.newView"))) == null ? void 0 : n.trim(), e = this.host.editableConfig();
    if (!e || !t) return;
    const i = pc(t, e.views);
    this.host.commit({ ...e, views: [...e.views, i] }), this.host.selectView(i.id);
  }
  async renameView(t) {
    var n;
    if (!t || !this.host.editableConfig()) return;
    const e = (n = await this.host.askText(this.t("dialog.renameView"), t.name)) == null ? void 0 : n.trim(), i = this.host.editableConfig();
    i && e && e !== t.name && this.host.commit(ks(i, t.id, (r) => ({ ...r, name: e })));
  }
  moveView(t, e) {
    const i = this.host.editableConfig(), n = i && mc(i, t, e);
    n && this.host.commit(n);
  }
  setDefaultView(t) {
    const e = this.host.editableConfig();
    !e || !t || (this.host.commit({ ...e, default_view: t.id }), this.host.notice(this.t("panel.defaultView", { name: t.name })));
  }
  async deleteView(t) {
    const e = this.host.editableConfig();
    if (!e || t === "all" || e.views.length <= 1 || !await this.confirmDelete("View"))
      return;
    const i = this.host.editableConfig(), n = i && _c(i, t);
    n && (this.host.commit(n.config), this.host.selectView(n.nextViewId));
  }
  updatePlan3DSettings(t, e, i) {
    const n = this.host.editableConfig();
    if (!n || (t == null ? void 0 : t.background.type) !== "model") return;
    const r = i.target, s = e === "camera_mode" ? r.value : r.checked;
    this.host.commit($o(n, t.plan_id, { [e]: s }));
  }
  deleteCameraPreset(t, e) {
    const i = this.host.editableConfig();
    if (!i || !t) return;
    const n = Ro(i, t.plan_id, e);
    if (n === i) return;
    const r = n.views.map(
      (s) => s.camera_preset_id === e ? { ...s, camera_preset_id: void 0 } : s
    );
    this.host.commit({ ...n, views: r });
  }
  async exportConfig(t) {
    if (t)
      try {
        await gc(this.host.hass(), t), this.host.notice(this.t("panel.exported"));
      } catch (e) {
        this.host.error(e instanceof Error ? e.message : this.t("panel.exportFailed"));
      }
  }
  async importConfig(t) {
    var i, n, r;
    if (!this.host.editableConfig()) return;
    const e = da(t);
    if (e) {
      if (e.size > Ea) {
        this.host.error(this.t("panel.configTooLarge"));
        return;
      }
      try {
        const s = await fc(
          this.host.hass(),
          e,
          (l, d) => this.host.confirm(
            this.t("dialog.importMessage", { plans: l, views: d }),
            this.t("dialog.import")
          ),
          this.t
        );
        if (!s || !this.host.editableConfig()) return;
        this.host.onImport(), this.host.selectPlan(((i = s.plans[0]) == null ? void 0 : i.plan_id) ?? null);
        const o = this.host.commit(s);
        this.host.selectView(
          ((n = s.views.find(({ id: l }) => l === s.default_view)) == null ? void 0 : n.id) ?? ((r = s.views[0]) == null ? void 0 : r.id) ?? "all"
        ), await o && this.host.notice(this.t("panel.imported"));
      } catch (s) {
        const o = s instanceof Error ? s.message : this.t("panel.invalidConfig");
        this.host.error(this.t("panel.importFailed", { message: o }));
      }
    }
  }
  async uploadAsset(t, e) {
    var l;
    if (!this.host.editableConfig()) return;
    const i = da(t);
    if (!i) return;
    const n = i.type === "model/gltf-binary" || go(i.name), r = /\.svg$/i.test(i.name), s = kn.some((d) => d === i.type) || r, o = !n && !s ? "panel.assetTypeError" : i.size > (n ? Bn : Pa) ? n ? "panel.modelTooLarge" : "panel.imageTooLarge" : null;
    if (o) {
      this.host.error(this.t(o));
      return;
    }
    try {
      const d = this.host.hass(), c = r && i.type && i.type !== "image/svg+xml" ? new File([i], i.name, { type: "image/svg+xml", lastModified: i.lastModified }) : i, p = n ? { type: "model", ...await _o(d, i) } : {
        type: "image",
        ...await Ta(d, c),
        ...await Co(c)
      }, f = this.host.editableConfig();
      if (!f) return;
      if (e) {
        const g = f.plans.find(({ plan_id: y }) => y === e);
        if (!g) return;
        const u = g.background.type !== p.type, _ = g.areas.length > 0 || g.markers.length > 0 || (((l = g.view.camera_presets) == null ? void 0 : l.length) ?? 0) > 0;
        if (u && _ && !await this.host.confirm(
          this.t("dialog.replacePlanKindMessage"),
          this.t("editor.replaceImage"),
          !0
        ))
          return;
        this.host.onReplaceBackground(g.plan_id), await this.host.commit(Vo(f, g, p));
      } else {
        const g = Po(this.host.newPlanId(), i.name, p);
        this.host.commit(Eo(f, g)), this.host.selectPlan(g.plan_id);
      }
    } catch (d) {
      this.host.error(
        n ? this.t("panel.modelUploadFailed") : d instanceof Error ? d.message : this.t("panel.imageUploadFailed")
      );
    }
  }
}
function Fn(a) {
  return [
    ...new Set(
      a.split(",").map((t) => t.trim()).filter(Boolean)
    )
  ];
}
function bc(a, t, e) {
  const i = Fn(e);
  return { ...a, filters: { ...a.filters, [t]: i.length ? i : void 0 } };
}
function Ps(a, t, e) {
  const i = { ...a, [t]: e || void 0 };
  return i.source === "attr" && !i.attr && (i.attr = "friendly_name"), i;
}
function be(a, t, e) {
  const i = { ...a.area_overlay };
  return e ? i[t] = e : delete i[t], { ...a, area_overlay: i };
}
function vc(a, t, e, i) {
  var s;
  const n = i.trim(), r = (s = a.area_overlay) == null ? void 0 : s[t];
  return e === "entity_id" ? n ? be(a, t, {
    ...(r == null ? void 0 : r.mode) === "entity" ? r : { mode: "entity", source: "state" },
    entity_id: n
  }) : be(a, t) : (r == null ? void 0 : r.mode) === "entity" ? be(a, t, Ps(r, e, n)) : a;
}
function Cc(a, t, e) {
  return e === "aggregate" ? be(a, t, { mode: e, aggregation: "count_on" }) : be(a, t);
}
function wc(a, t, e, i) {
  var r;
  const n = (r = a.area_overlay) == null ? void 0 : r[t];
  return (n == null ? void 0 : n.mode) === "aggregate" ? be(a, t, { ...n, [e]: i.trim() || void 0 }) : a;
}
function Ac(a, t) {
  const e = t.split(",").flatMap((i) => {
    const [n, r] = i.trim().split(":", 2), [s, o] = n.split("=", 2).map((l) => l.trim());
    return !s || !o ? [] : [{ entity_id: s, when: { state_is: o }, ...(r == null ? void 0 : r.trim()) && { label: r.trim() } }];
  });
  return {
    ...a,
    area_overlay: { ...a.area_overlay, badges: e.length ? e : void 0 }
  };
}
function Sc(a, t, e) {
  if (t === "active_area_opacity" || t === "inactive_area_opacity") {
    const i = Number(e);
    if (!Number.isFinite(i)) return a;
    const n = e === "" ? void 0 : Math.max(0, Math.min(1, i));
    return { ...a, style: { ...a.style, [t]: n } };
  }
  return { ...a, style: { ...a.style, [t]: e === "" ? void 0 : e } };
}
function xc(a, t, e) {
  const i = t === "fillOpacity" || t === "strokeWidth";
  if (i && !Number.isFinite(Number(e))) return a;
  const n = i ? Math.max(0, Math.min(t === "fillOpacity" ? 1 : 50, Number(e))) : e;
  return { ...a, style: { ...a.style, [t]: n } };
}
function Mc(a, t, e, i) {
  const n = Ps(a.bind[t] ?? { source: "state" }, e, i);
  return { ...a.bind, [t]: n };
}
function kc(a, t, e, i, n) {
  return V`
    <section class="editor-card editor-selection">
      <h2 title=${n("editor.helpArea")}>${n("editor.selectedArea")}</h2>
      <strong class="editor-selection-name">${a.id}</strong>
      <div class="editor-fields">
        ${a.shape.type === "mesh" ? V`<label title=${n("editor.pickMeshHint")}
              >${n("editor.meshName")}<select @change=${i.updateAreaMesh}>
                ${[.../* @__PURE__ */ new Set([a.shape.mesh_name, ...e])].map(
    (r) => V`<option
                      .selected=${a.shape.type === "mesh" && a.shape.mesh_name === r}
                      value=${r}
                    >
                      ${r}
                    </option>`
  )}
              </select></label
            >` : a.shape.type === "anchor3d" ? V`<span
                >${n("editor.position3d")} (${a.shape.x}, ${a.shape.y}, ${a.shape.z})</span
              >` : ""}
        <label>
          ${n("editor.haArea")}
          <select @change=${i.bindArea} .value=${a.area_id ?? ""}>
            <option value="">${n("editor.unbound")}</option>
            ${t.map(
    (r) => V`<option value=${r.id}>${r.name}</option>`
  )}
          </select>
        </label>
        <label>
          ${n("editor.tags")}
          <input
            .value=${a.tags.join(", ")}
            @change=${i.updateAreaTags}
            placeholder="downstairs, heating"
          />
        </label>
        <label>
          ${n("editor.fill")}
          <input
            type="color"
            .value=${a.style.fill ?? "#2196f3"}
            @change=${(r) => i.updateAreaStyle("fill", r)}
          />
        </label>
        <label>
          ${n("editor.stroke")}
          <input
            type="color"
            .value=${a.style.stroke ?? "#1976d2"}
            @change=${(r) => i.updateAreaStyle("stroke", r)}
          />
        </label>
        <label>
          ${n("editor.opacity")}
          <input
            type="number"
            min="0"
            max="1"
            step="0.05"
            .value=${String(a.style.fillOpacity)}
            @change=${(r) => i.updateAreaStyle("fillOpacity", r)}
          />
        </label>
        <label>
          ${n("editor.strokeWidth")}
          <input
            type="number"
            min="0"
            max="20"
            step="1"
            .value=${String(a.style.strokeWidth)}
            @change=${(r) => i.updateAreaStyle("strokeWidth", r)}
          />
        </label>
        <button class="editor-danger editor-field-wide" type="button" @click=${i.deleteArea}>
          ${n("editor.deleteArea")}
        </button>
      </div>
    </section>
  `;
}
function Pc(a, t, e, i, n) {
  var s;
  const r = (o) => or(Cs(o, void 0, void 0, a.entity_id)) ?? "";
  return V`
    <section class="editor-card editor-selection">
      <h2 title=${n("editor.helpMarker")}>${n("editor.selectedMarker")}</h2>
      <strong class="editor-selection-name">${a.entity_id}</strong>
      <div class="editor-fields">
        ${e ? V`<span
              >${n("editor.position3d")} (${a.pos.x}, ${a.pos.y},
              ${a.pos.z ?? 0})</span
            >` : ""}
        <label title=${n("editor.iconHint")}
          >${n("editor.icon")}
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d=${r(a.icon)}></path>
          </svg>
          <input
            list="floorplan-mdi-icons"
            .value=${a.icon ?? ""}
            placeholder=${n("editor.iconPlaceholder")}
            @input=${(o) => {
    var d, c;
    const l = o.currentTarget;
    (c = (d = l.parentElement) == null ? void 0 : d.querySelector("path")) == null || c.setAttribute("d", r(l.value));
  }}
            @change=${i.updateMarkerIcon}
        /></label>
        <datalist id="floorplan-mdi-icons">
          ${jh.map((o) => V`<option value=${o}></option>`)}
        </datalist>
        <label>
          ${n("editor.tags")}
          <input
            .value=${a.tags.join(", ")}
            @change=${i.updateMarkerTags}
            placeholder="heating, downstairs"
          />
        </label>
        <label>
          ${n("editor.haArea")}
          <select .value=${a.area_id ?? ""} @change=${i.updateMarkerArea}>
            <option value="">${n("editor.unbound")}</option>
            ${t.map((o) => V`<option value=${o.id}>${o.name}</option>`)}
          </select>
        </label>
        <label>
          ${n("editor.label")}
          <select .value=${a.label_mode} @change=${i.updateMarkerLabelMode}>
            <option value="auto">${n("editor.auto")}</option>
            <option value="short">${n("editor.short")}</option>
            <option value="full">${n("editor.full")}</option>
            <option value="off">${n("editor.off")}</option>
          </select>
        </label>
        <label>
          ${n("editor.markerAction")}
          <select .value=${((s = a.action) == null ? void 0 : s.tap) ?? "more-info"} @change=${i.updateMarkerAction}>
            <option value="more-info">${n("editor.actionDetails")}</option>
            <option value="toggle">${n("editor.actionToggle")}</option>
            <option value="none">${n("editor.actionNone")}</option>
          </select>
        </label>
        <label>
          ${n("editor.primary")}
          <select
            .value=${a.bind.primary.source}
            @change=${(o) => i.updateMarkerBinding("primary", "source", o)}
          >
            <option value="state">${n("editor.state")}</option>
            <option value="attr">${n("editor.attributeOption")}</option>
          </select>
        </label>
        <label>
          ${n("editor.attribute")}
          <input
            .value=${a.bind.primary.attr ?? ""}
            @change=${(o) => i.updateMarkerBinding("primary", "attr", o)}
          />
        </label>
        <label>
          ${n("editor.format")}
          <input
            .value=${a.bind.primary.format ?? ""}
            @change=${(o) => i.updateMarkerBinding("primary", "format", o)}
            placeholder="{value} °C"
          />
        </label>
        ${a.bind.secondary ? V`
              <label>
                ${n("editor.secondary")}
                <select
                  .value=${a.bind.secondary.source}
                  @change=${(o) => i.updateMarkerBinding("secondary", "source", o)}
                >
                  <option value="state">${n("editor.state")}</option>
                  <option value="attr">${n("editor.attributeOption")}</option>
                </select>
              </label>
              <label>
                ${n("editor.attribute")}
                <input
                  .value=${a.bind.secondary.attr ?? ""}
                  @change=${(o) => i.updateMarkerBinding("secondary", "attr", o)}
                />
              </label>
              <label>
                ${n("editor.format")}
                <input
                  .value=${a.bind.secondary.format ?? ""}
                  @change=${(o) => i.updateMarkerBinding("secondary", "format", o)}
                />
              </label>
              <button type="button" @click=${i.removeMarkerSecondaryBinding}>
                ${n("editor.removeSecondary")}
              </button>
            ` : V`
              <button type="button" @click=${i.addMarkerSecondaryBinding}>
                + ${n("editor.addSecondary")}
              </button>
            `}
        <button
          class="editor-danger editor-field-wide"
          type="button"
          @click=${i.deleteMarker}
        >
          ${n("editor.deleteMarker")}
        </button>
      </div>
    </section>
  `;
}
function Ec(a, t, e) {
  var l, d, c, p, f;
  const { currentPlan: i, currentView: n, currentViewId: r } = a, s = (i == null ? void 0 : i.background.type) === "model", o = (i == null ? void 0 : i.view.camera_presets) ?? [];
  return V`
    <button class="add-plan" type="button" @click=${t.uploadImage}>
      ${e("editor.upload")}
    </button>
    <details class="editor-card editor-plan-view">
      <summary>${e("editor.planView")}</summary>
      <div class="editor-card-body editor-actions">
        <button type="button" ?disabled=${!i} @click=${t.renamePlan}>
          ${e("editor.renamePlan")}
        </button>
        <button type="button" ?disabled=${!i} @click=${t.replaceImage}>
          ${e("editor.replaceImage")}
        </button>
        <button type="button" ?disabled=${!i} @click=${t.deletePlan}>
          ${e("editor.deletePlan")}
        </button>
        <button type="button" @click=${t.addView}>+ ${e("editor.addView")}</button>
        <button type="button" @click=${t.renameView}>${e("editor.renameView")}</button>
        <button type="button" @click=${() => t.moveView(-1)}>
          ← ${e("editor.previousView")}
        </button>
        <button type="button" @click=${() => t.moveView(1)}>${e("editor.nextView")} →</button>
        <button type="button" @click=${t.setDefaultView}>${e("editor.setDefault")}</button>
        <button type="button" ?disabled=${r === "all"} @click=${t.deleteView}>
          ${e("editor.deleteView")}
        </button>
        <button type="button" @click=${t.exportConfig}>${e("editor.export")}</button>
        <button type="button" @click=${t.importConfig}>${e("editor.import")}</button>
      </div>
    </details>

    ${s && i ? Lc(i, t, e) : ""}
    <details class="editor-card editor-advanced">
      <summary>${e("editor.viewOverlay")}</summary>
      <div class="editor-card-body">
        <section class="editor-subsection">
          <h3>${e("editor.viewFilters", { name: (n == null ? void 0 : n.name) ?? r })}</h3>
          <div class="editor-fields">
            <label>
              ${e("editor.domains")}
              <input
                .value=${((l = n == null ? void 0 : n.filters.domains) == null ? void 0 : l.join(", ")) ?? ""}
                @change=${(g) => t.updateViewFilter("domains", g)}
                placeholder="light, switch"
              />
            </label>
            <label>
              ${e("editor.tags")}
              <input
                .value=${((d = n == null ? void 0 : n.filters.tags) == null ? void 0 : d.join(", ")) ?? ""}
                @change=${(g) => t.updateViewFilter("tags", g)}
                placeholder="heating"
              />
            </label>
            <label>
              ${e("editor.areaIds")}
              <input
                .value=${((c = n == null ? void 0 : n.filters.area_ids) == null ? void 0 : c.join(", ")) ?? ""}
                @change=${(g) => t.updateViewFilter("area_ids", g)}
                placeholder="living_room"
              />
            </label>
          </div>
        </section>
        ${s && o.length ? V`<label
              >${e("editor.viewCameraPreset")}<select @change=${t.updateViewCameraPreset}>
                <option value="" .selected=${!(n != null && n.camera_preset_id)}>
                  ${e("editor.defaultCamera")}
                </option>
                ${o.map(
    (g) => V`<option value=${g.id} .selected=${g.id === (n == null ? void 0 : n.camera_preset_id)}>
                      ${g.name}
                    </option>`
  )}
              </select></label
            >` : ""}
        ${Vc((n == null ? void 0 : n.style) ?? {}, t, e)}
        ${["primary", "secondary"].map(
    (g) => {
      var u;
      return Tc(g, (u = n == null ? void 0 : n.area_overlay) == null ? void 0 : u[g], t, e);
    }
  )}
        <section class="editor-subsection">
          <div class="editor-fields">
            <label class="editor-field-wide">
              ${e("editor.badges")}<small>${e("editor.badgesHint")}</small>
              <input
                class="grow"
                .value=${((f = (p = n == null ? void 0 : n.area_overlay) == null ? void 0 : p.badges) == null ? void 0 : f.map(
    (g) => `${g.entity_id}=${g.when.state_is}${g.label ? `:${g.label}` : ""}`
  ).join(", ")) ?? ""}
                @change=${t.updateAreaBadges}
                placeholder="binary_sensor.window=on:Window open"
              />
            </label>
          </div>
        </section>
      </div>
    </details>
  `;
}
function Lc(a, t, e) {
  var i;
  return V`<details class="editor-card editor-3d-settings">
    <summary title=${e("editor.help3d")}>${e("editor.plan3dSettings")}</summary>
    <div class="editor-card-body editor-fields">
      ${["shadows", "lighting"].map(
    (n) => V`<label
            ><input
              type="checkbox"
              .checked=${a.view[n] ?? n === "lighting"}
              @change=${(r) => {
      var s;
      return (s = t.updatePlan3DSettings) == null ? void 0 : s.call(t, n, r);
    }}
            />${e(n === "lighting" ? "editor.lighting3d" : "editor.shadows")}</label
          >`
  )}
      <label
        >${e("editor.defaultCamera")}<select
          @change=${(n) => {
    var r;
    return (r = t.updatePlan3DSettings) == null ? void 0 : r.call(t, "camera_mode", n);
  }}
        >
          ${["ortho", "perspective"].map(
    (n) => V`<option value=${n} .selected=${n === (a.view.camera_mode ?? "ortho")}>
                ${e(n === "ortho" ? "editor.cameraOrtho" : "editor.cameraPerspective")}
              </option>`
  )}
        </select></label
      >
      ${(i = a.view.camera_presets) == null ? void 0 : i.map(
    (n) => V`<div>
            ${n.name}
            <button type="button" @click=${() => {
      var r;
      return (r = t.applyCameraPreset) == null ? void 0 : r.call(t, n.id);
    }}>
              ${e("editor.applyPreset")}</button
            ><button type="button" @click=${() => {
      var r;
      return (r = t.deleteCameraPreset) == null ? void 0 : r.call(t, n.id);
    }}>
              ${e("editor.deletePreset")}
            </button>
          </div>`
  )}
      <button type="button" @click=${t.saveCameraPreset}>+ ${e("editor.savePreset")}</button>
    </div>
  </details>`;
}
function Vc(a, t, e) {
  return V`<section class="editor-subsection">
    <h3>${e("editor.viewStyle")}</h3>
    <p class="editor-helper">${e("editor.viewStyleHint")}</p>
    <div class="editor-fields">
      ${[
    ["dim_inactive_areas", "editor.dimInactiveAreas"],
    ["highlight_active_areas", "editor.highlightActiveAreas"]
  ].map(
    ([i, n]) => V`<label
            ><input
              type="checkbox"
              .checked=${a[i] ?? !1}
              @change=${(r) => {
      var s;
      return (s = t.updateViewStyle) == null ? void 0 : s.call(t, i, r);
    }}
            />${e(n)}</label
          >`
  )}
      ${[
    ["inactive_area_opacity", "editor.inactiveOpacity"],
    ["active_area_opacity", "editor.activeOpacity"]
  ].map(
    ([i, n]) => V`<label
            >${e(n)}<input
              type="number"
              min="0"
              max="1"
              step="0.05"
              .value=${String(a[i] ?? "")}
              @change=${(r) => {
      var s;
      return (s = t.updateViewStyle) == null ? void 0 : s.call(t, i, r);
    }}
          /></label>`
  )}
      ${[
    ["active_area_fill", "editor.activeFill", "#2196f3"],
    ["active_area_stroke", "editor.activeStroke", "#1976d2"]
  ].map(
    ([i, n, r]) => V`<label
            >${e(n)}<input
              type="color"
              .value=${a[i] ?? r}
              @change=${(s) => {
      var o;
      return (o = t.updateViewStyle) == null ? void 0 : o.call(t, i, s);
    }}
          /></label>`
  )}
    </div>
  </section>`;
}
function Tc(a, t, e, i) {
  const n = (t == null ? void 0 : t.mode) === "aggregate" ? t : void 0, r = (t == null ? void 0 : t.mode) === "entity" ? t : void 0;
  return V`<section class="editor-subsection">
    <h3 title=${i("editor.helpViewOverlay")}>
      ${i(a === "primary" ? "editor.areaOverlay" : "editor.secondaryBadges")}
    </h3>
    <div class="editor-fields">
      <label
        >${i("editor.overlayMode")}<select
          @change=${(s) => {
    var o;
    return (o = e.updateAreaOverlayMode) == null ? void 0 : o.call(e, a, s);
  }}
        >
          <option value="entity" .selected=${!n}>${i("editor.modeEntity")}</option>
          <option value="aggregate" .selected=${!!n}>${i("editor.modeAggregate")}</option>
        </select></label
      >
      ${n ? V`<label
              >${i("editor.aggregation")}<select
                @change=${(s) => {
    var o;
    return (o = e.updateAreaOverlayAggregate) == null ? void 0 : o.call(e, a, "aggregation", s);
  }}
              >
                ${[
    ["count_on", "editor.aggCountOn"],
    ["count_open", "editor.aggCountOpen"],
    ["count", "editor.aggCount"],
    ["avg", "editor.aggAvg"],
    ["min", "editor.aggMin"],
    ["max", "editor.aggMax"],
    ["sum", "editor.aggSum"]
  ].map(
    ([s, o]) => V`<option value=${s} .selected=${n.aggregation === s}>
                      ${i(o)}
                    </option>`
  )}
              </select></label
            >
            ${[
    ["domain", "editor.domain", "light, sensor"],
    ["device_class", "editor.deviceClass", "temperature, window"]
  ].map(
    ([s, o, l]) => V`<label
                  >${i(o)}<input
                    .value=${n[s] ?? ""}
                    placeholder=${l}
                    @change=${(d) => {
      var c;
      return (c = e.updateAreaOverlayAggregate) == null ? void 0 : c.call(e, a, s, d);
    }}
                /></label>`
  )}
            <p class="editor-helper">${i("editor.aggregateHint")}</p>` : V`<label
              >${i(a === "primary" ? "editor.primaryEntity" : "editor.secondaryEntity")}<input
                .value=${(r == null ? void 0 : r.entity_id) ?? ""}
                placeholder="sensor.living_room_temperature"
                @change=${(s) => e.updateAreaOverlay(a, "entity_id", s)}
            /></label>
            <label
              >${i("editor.source")}<select
                .value=${(r == null ? void 0 : r.source) ?? "state"}
                @change=${(s) => e.updateAreaOverlay(a, "source", s)}
              >
                <option value="state">${i("editor.state")}</option>
                <option value="attr">${i("editor.attributeOption")}</option>
              </select></label
            >`}
      ${["attr", "format"].map(
    (s) => V`<label
            >${i(s === "attr" ? "editor.attribute" : "editor.format")}<input
              .value=${(t == null ? void 0 : t[s]) ?? ""}
              placeholder=${s === "format" ? "{value} °C" : ""}
              @change=${(o) => {
      var l;
      return n ? (l = e.updateAreaOverlayAggregate) == null ? void 0 : l.call(e, a, s, o) : e.updateAreaOverlay(a, s, o);
    }}
          /></label>`
  )}
    </div>
  </section>`;
}
function Vt(a) {
  return Number.isFinite(a) ? Math.max(0, a) : 0;
}
function $c(a, t, e) {
  return Math.min(
    Vt(a),
    Math.max(0, Vt(t) - Vt(e))
  );
}
function Hc({
  totalCount: a,
  scrollTop: t,
  viewportHeight: e,
  itemHeight: i = 52,
  overscan: n = 15,
  minRenderedItems: r = 35
}) {
  const s = Math.floor(Vt(a)), o = Vt(i) || 52, l = Math.floor(Vt(n)), d = s * o, c = Vt(e), p = $c(t, d, c);
  let f = Math.max(0, Math.floor(p / o) - l);
  const g = Math.min(
    s,
    Math.max(
      Math.ceil((p + c) / o) + l,
      f + Math.floor(Vt(r))
    )
  );
  return f = Math.max(
    0,
    Math.min(f, g - Math.floor(Vt(r)))
  ), {
    startIndex: f,
    endIndex: g,
    topSpacerPx: f * o,
    bottomSpacerPx: (s - g) * o,
    totalHeightPx: d
  };
}
function Rc(a, t, e) {
  const { currentPlan: i, selectedArea: n, selectedMarker: r } = a, s = Hc({
    totalCount: a.entityOptions.length,
    scrollTop: a.entityScrollTop ?? 0,
    viewportHeight: a.entityViewportHeight ?? 180,
    minRenderedItems: t.onEntityScroll ? 35 : a.entityOptions.length
  });
  return V`
    <aside class="editor-panel" aria-label=${e("editor.title")}>
      <header class="editor-panel-header">
        <div class="editor-heading">
          <strong>${e("editor.title")}</strong>
          <div class="history-actions">
            <button
              type="button"
              aria-label=${e("editor.undo")}
              title=${e("editor.undo")}
              ?disabled=${!a.canUndo}
              @click=${t.undo}
            >
              ↶
            </button>
            <button
              type="button"
              aria-label=${e("editor.redo")}
              title=${e("editor.redo")}
              ?disabled=${!a.canRedo}
              @click=${t.redo}
            >
              ↷
            </button>
          </div>
        </div>
        <nav class="editor-nav" aria-label=${e("editor.title")}>
          ${["entities", "inspector", "settings"].map(
    (o) => V`<button
                type="button"
                aria-current=${a.tab === o ? "page" : "false"}
                @click=${() => t.switchTab(o)}
              >
                ${e(
      o === "entities" ? "editor.library" : o === "inspector" ? "editor.inspector" : "editor.settings"
    )}
              </button>`
  )}
        </nav>
      </header>
      ${a.tab === "inspector" ? V`
            ${n ? kc(n, a.areas, a.availableMeshes ?? [], t, e) : ""}
            ${r ? Pc(
    r,
    a.areas,
    (i == null ? void 0 : i.background.type) === "model",
    t,
    e
  ) : ""}
            ${!n && !r ? V`<p class="editor-selection-hint">${e("editor.selectHint")}</p>` : ""}
          ` : a.tab === "entities" ? V`
              <section class="editor-card editor-entities">
                <h2>
                  ${e("editor.entities")}
                  <small>${a.matchCount} / ${a.entityCount}</small>
                </h2>
                <div class="editor-fields">
                  <label class="editor-field-wide">
                    ${e("editor.searchEntity")}
                    <input
                      class="grow"
                      type="search"
                      .value=${a.entitySearch}
                      @input=${(o) => t.setEntitySearch(o.target.value)}
                      placeholder="light.kitchen"
                    />
                  </label>
                </div>
                <details class="entity-filters">
                  <summary>${e("editor.filters")}</summary>
                  <div class="editor-fields">
                    <label>
                      ${e("editor.domain")}
                      <select
                        .value=${a.entityDomainFilter}
                        @change=${(o) => t.setEntityDomainFilter(o.target.value)}
                      >
                        <option value="">${e("editor.allDomains")}</option>
                        ${a.entityDomains.map(
    (o) => V`<option value=${o}>${o}</option>`
  )}
                      </select>
                    </label>
                    <label>
                      ${e("editor.haArea")}
                      <select
                        .value=${a.entityAreaFilter}
                        @change=${(o) => t.setEntityAreaFilter(o.target.value)}
                      >
                        <option value="">${e("editor.allAreas")}</option>
                        ${a.areas.map(
    (o) => V`<option value=${o.id}>${o.name}</option>`
  )}
                      </select>
                    </label>
                  </div>
                </details>
                <p class="editor-helper">${e("editor.libraryHint")}</p>
                <div
                  class="entity-palette"
                  @scroll=${(o) => {
    var d;
    const l = o.currentTarget;
    (d = t.onEntityScroll) == null || d.call(t, l.scrollTop, l.clientHeight);
  }}
                >
                  <div aria-hidden="true" style=${"height:" + s.topSpacerPx + "px"}></div>
                  ${a.entityOptions.slice(s.startIndex, s.endIndex).map(
    (o) => V`
                      <button
                        type="button"
                        ?disabled=${!i}
                        aria-pressed=${a.entityToAdd === o.entity_id}
                        @click=${(l) => t.setEntityToAdd(o.entity_id, l)}
                        class="entity-card"
                        style="height:52px"
                        draggable="true"
                        @dragstart=${(l) => t.startEntityDrag(o.entity_id, l)}
                        @pointerdown=${(l) => t.startEntityPointerDrag(o.entity_id, l)}
                        title=${e("editor.dragHint")}
                      >
                        <strong>${o.name ?? o.entity_id}</strong>
                        <span>${o.entity_id}</span>
                      </button>
                    `
  )}
                  <div
                    aria-hidden="true"
                    style=${"height:" + s.bottomSpacerPx + "px"}
                  ></div>
                </div>
                ${t.showMore && a.matchCount > a.entityOptions.length ? V`<button type="button" @click=${t.showMore}>
                      ${e("editor.showMore")}
                    </button>` : ""}
                ${a.entityOptions.length ? "" : V`<p>${e("editor.noResults")}</p>`}
              </section>
            ` : Ec(a, t, e)}
    </aside>
  `;
}
function mt(a) {
  return a.target.value;
}
function Oc(a) {
  return a.target.checked;
}
function Fc(a, t, e, i) {
  const n = t.trim().toLowerCase();
  return a.filter(
    ({ entity_id: r, name: s, domain: o, area_id: l }) => (!n || r.toLowerCase().includes(n) || (s == null ? void 0 : s.toLowerCase().includes(n))) && (!e || o === e) && (!i || l === i)
  );
}
function Dc(a, t, e, i) {
  return {
    updateViewFilter: (n, r) => t((s) => bc(s, n, mt(r))),
    updateAreaOverlay: (n, r, s) => t((o) => vc(o, n, r, mt(s))),
    updateAreaOverlayMode: (n, r) => t((s) => Cc(s, n, mt(r))),
    updateAreaOverlayAggregate: (n, r, s) => t(
      (o) => wc(o, n, r, mt(s))
    ),
    updateAreaBadges: (n) => t((r) => Ac(r, mt(n))),
    updateViewStyle: (n, r) => t(
      (s) => Sc(
        s,
        n,
        r.target.type === "checkbox" ? Oc(r) : mt(r)
      )
    ),
    updateViewCameraPreset: (n) => {
      t((r) => ({ ...r, camera_preset_id: mt(n) || void 0 }));
    },
    bindArea: (n) => e((r) => ({ ...r, area_id: mt(n) })),
    updateAreaTags: (n) => e((r) => ({ ...r, tags: Fn(mt(n)) })),
    updateAreaStyle: (n, r) => e((s) => xc(s, n, mt(r))),
    updateAreaMesh: (n) => e((r) => {
      const s = mt(n).trim();
      return r.shape.type === "mesh" && s ? { ...r, shape: { type: "mesh", mesh_name: s } } : r;
    }),
    updateMarkerIcon: (n) => i({ icon: mt(n).trim() || void 0 }),
    updateMarkerTags: (n) => i({ tags: Fn(mt(n)) }),
    updateMarkerArea: (n) => i({ area_id: mt(n) || null }),
    updateMarkerLabelMode: (n) => i({ label_mode: mt(n) }),
    updateMarkerAction: (n) => {
      const r = mt(n);
      (r === "more-info" || r === "toggle" || r === "none") && i({ action: { ...a == null ? void 0 : a.action, tap: r } });
    },
    updateMarkerBinding: (n, r, s) => {
      a && i({
        bind: Mc(a, n, r, mt(s))
      });
    }
  };
}
function Nc(a, t) {
  const e = /* @__PURE__ */ new Map();
  for (const i of Object.values(a)) {
    const { friendly_name: n, icon: r } = i.attributes;
    e.set(i.entity_id, {
      entity_id: i.entity_id,
      name: typeof n == "string" ? n : null,
      icon: typeof r == "string" ? r : null,
      domain: i.entity_id.split(".", 1)[0],
      area_id: null,
      device_id: null
    });
  }
  for (const i of t) {
    const n = e.get(i.entity_id);
    e.set(i.entity_id, {
      ...i,
      name: i.name ?? (n == null ? void 0 : n.name) ?? null,
      icon: i.icon ?? (n == null ? void 0 : n.icon) ?? null
    });
  }
  return [...e.values()].sort(
    (i, n) => i.entity_id.localeCompare(n.entity_id, void 0, { numeric: !0 })
  );
}
function Ic({ plan: a, view: t, areas: e, entities: i, selectedAreaId: n, selectedMarkerId: r }, s, o, l, d, c) {
  const p = (a == null ? void 0 : a.areas.find(({ id: v }) => v === n)) ?? null, f = (a == null ? void 0 : a.markers.find(({ id: v }) => v === r)) ?? null, g = Fc(
    i,
    s.entitySearch,
    s.entityDomainFilter,
    s.entityAreaFilter
  ), u = (v) => {
    const w = l();
    w && t && d(ks(w, t.id, v));
  }, _ = (v) => {
    const w = l();
    w && a && p && d(Fa(w, a.plan_id, p.id, v));
  }, y = (v) => {
    const w = l();
    w && a && f && d(Ra(w, a.plan_id, f.id, v));
  };
  return Rc(
    {
      ...s,
      currentPlan: a,
      currentView: t,
      areas: e,
      selectedArea: p,
      selectedMarker: f,
      entityCount: i.length,
      matchCount: g.length,
      entityOptions: g,
      entityDomains: [...new Set(i.map(({ domain: v }) => v))].sort()
    },
    {
      ...o,
      ...Dc(f, u, _, y),
      addMarkerSecondaryBinding: () => {
        f && !f.bind.secondary && y({ bind: { ...f.bind, secondary: { source: "state" } } });
      },
      removeMarkerSecondaryBinding: () => {
        f && y({ bind: { primary: f.bind.primary } });
      }
    },
    c
  );
}
function Gc({
  plans: a,
  views: t,
  states: e,
  entities: i,
  haAreas: n,
  availableMeshesByPlan: r
}) {
  var f, g, u;
  const s = [], o = new Set(n.map((_) => _.id)), l = new Set(i.map((_) => _.entity_id)), d = Object.keys(e).length > 0, c = (_) => !Object.prototype.hasOwnProperty.call(e, _) && (d || !l.has(_));
  function p(_, y, v = {}, w = "") {
    const h = JSON.stringify([
      y.planId,
      y.viewId,
      y.targetType,
      y.targetId,
      _,
      w
    ]), m = _ === "missing_background" || _ === "missing_entity" ? "error" : "warning";
    s.push({
      id: h,
      category: _,
      severity: m,
      ...y,
      ...v,
      messageKey: "diagnostics." + _,
      params: { ...y, ...v, ...w ? { slot: w } : {} }
    });
  }
  for (const _ of a) {
    const y = { planId: _.plan_id, planName: _.name };
    !_.background.asset_id && !_.background.url && p("missing_background", { ...y, targetType: "plan", targetId: _.plan_id });
    const v = r == null ? void 0 : r.get(_.plan_id), w = v && new Set(v);
    for (const h of _.areas) {
      const m = { ...y, targetType: "area", targetId: h.id };
      (f = h.area_id) != null && f.trim() ? o.size && !o.has(h.area_id) && p("missing_area", m, { areaId: h.area_id }) : p("unbound_area", m), h.shape.type === "mesh" && w && !w.has(h.shape.mesh_name ?? "") && p("missing_mesh", m, { meshName: h.shape.mesh_name ?? "" });
    }
    for (const h of _.markers) {
      const m = { ...y, targetType: "marker", targetId: h.id }, b = h.entity_id;
      h.area_id && o.size && !o.has(h.area_id) && p("missing_area", m, { areaId: h.area_id });
      const A = e[b];
      if (c(b)) p("missing_entity", m, { entityId: b });
      else if (A)
        if (["unavailable", "unknown"].includes(A.state))
          p("unavailable_entity", m, { entityId: b });
        else
          for (const M of ["primary", "secondary"]) {
            const C = (g = h.bind) == null ? void 0 : g[M];
            (C == null ? void 0 : C.source) === "attr" && !Object.prototype.hasOwnProperty.call(A.attributes, C.attr ?? "") && p("invalid_binding", m, { entityId: b, attr: C.attr ?? "" }, M);
          }
    }
  }
  for (const _ of t) {
    const y = {
      viewId: _.id,
      viewName: _.name,
      targetType: "view",
      targetId: _.id
    };
    for (const v of ["area_overlay", "marker_overlay"]) {
      const w = _[v];
      if (w) {
        for (const h of ["primary", "secondary"]) {
          const m = w[h];
          (m == null ? void 0 : m.mode) === "entity" && c(m.entity_id ?? "") && p(
            "overlay_missing_entity",
            y,
            { entityId: m.entity_id ?? "" },
            v + "." + h
          );
        }
        (u = w.badges) == null || u.forEach((h, m) => {
          c(h.entity_id) && p(
            "overlay_missing_entity",
            y,
            { entityId: h.entity_id },
            v + ".badges." + m
          );
        });
      }
    }
  }
  return s;
}
function Bc(a, t, e, i, n) {
  return V`<button
    type="button"
    class="warning-badge ${t ? "has-errors" : ""}"
    aria-expanded=${String(e)}
    aria-controls="floorplan-warnings"
    @click=${i}
  >
    ${n("warnings.button", { count: a })}
  </button>`;
}
function Uc(a, t, e, i) {
  if (!t) return V``;
  const n = [...a].sort(
    (r, s) => +(s.severity === "error") - +(r.severity === "error")
  );
  return V`<section
    class="warning-center editor-card"
    id="floorplan-warnings"
    aria-label=${i("warnings.title")}
  >
    <header>
      <h2>${i("warnings.title")}</h2>
      <button type="button" @click=${e.onClose}>${i("warnings.close")}</button>
    </header>
    ${n.length ? V`<ul>
          ${n.map(
    (r) => V`<li class=${r.severity}>
                <span
                  role="img"
                  aria-label=${i(r.severity === "error" ? "warnings.error" : "warnings.warning")}
                  >${r.severity === "error" ? "⛔" : "⚠"}</span
                >
                ${i(r.messageKey, r.params)}
                <small
                  >${[r.planName ?? r.planId, r.viewName ?? r.viewId].filter(Boolean).join(" / ")}</small
                >
                <button type="button" @click=${() => e.onSelectDiagnostic(r)}>
                  ${i("warnings.jumpTo")}
                </button>
              </li>`
  )}
        </ul>` : V`<p>${i("warnings.empty")}</p>`}
  </section>`;
}
const ha = {
  rect: "editor.rectangle",
  polygon: "editor.polygon",
  mesh: "editor.bindMesh",
  anchor3d: "editor.addAnchor3d"
}, zc = [
  ["isometric", "Iso", "editor.presetIso"],
  ["top", "Top", "editor.presetTop"],
  ["front", "Front", "editor.presetFront"]
];
function jc(a, t, e) {
  const {
    narrow: i,
    editMode: n,
    hass: r,
    config: s,
    canEdit: o,
    currentViewId: l,
    loading: d,
    notice: c,
    error: p,
    loadFailed: f,
    saveState: g,
    saveConflict: u,
    shape: _,
    entityToAdd: y,
    selectedAreaId: v,
    selectedMarkerId: w,
    dialog: h,
    warningsOpen: m,
    currentPlan: b,
    currentView: A,
    cameraMode: M,
    diagnostics: C,
    editor: k
  } = a, x = (s == null ? void 0 : s.plans) ?? [], P = (s == null ? void 0 : s.views) ?? [], E = ni(b), T = (b == null ? void 0 : b.areas.filter((H) => n || As(H, A))) ?? [], O = (b == null ? void 0 : b.markers.filter((H) => n || Sa(H, A))) ?? [], $ = y ? a.entities.find((H) => H.entity_id === y) : void 0, Z = g === "pending" ? e("panel.pending") : g === "saving" ? e("panel.saving") : c === e("panel.changesSaved") ? c : "";
  return V`
    <div class="container ${i ? "narrow" : ""}">
      <div class="toolbar">
        <div class="toolbar-left">
          ${i ? V`<ha-menu-button .hass=${r} .narrow=${i}></ha-menu-button>` : ""}
          <div class="workspace-title">
            <h1>${e("panel.title")}</h1>
            <span
              class="save-indicator ${Z ? "status" : ""}"
              role="status"
              aria-live="polite"
              >${Z}</span
            >
          </div>
          ${b ? V`<label class="plan-select">
                <span>${e("panel.plan")}</span>
                <select @change=${t.selectPlan}>
                  ${x.map(
    (H) => V`
                      <option
                        value=${H.plan_id}
                        ?selected=${(b == null ? void 0 : b.plan_id) === H.plan_id}
                      >
                        ${H.name}
                      </option>
                    `
  )}
                </select>
              </label>` : ""}
        </div>
        <div class="toolbar-right">
          ${C.length ? Bc(
    C.length,
    C.filter(({ severity: H }) => H === "error").length,
    m,
    t.toggleWarnings,
    e
  ) : ""}
          ${o && s ? V`
                <button
                  class="edit-toggle ${n ? "active" : ""}"
                  aria-pressed=${n ? "true" : "false"}
                  @click=${t.toggleEditMode}
                >
                  ${e(n ? "panel.done" : "panel.edit")}
                </button>
              ` : o ? "" : V`<span class="viewer-note">${e("panel.viewOnly")}</span>`}
        </div>
      </div>
      ${b ? V`<nav class="views-bar" aria-label=${e("panel.views")}>
            <div class="view-tabs">
              ${P.map(
    (H) => V`
                  <button
                    class="view-tab ${l === H.id ? "active" : ""}"
                    type="button"
                    aria-pressed=${l === H.id ? "true" : "false"}
                    @click=${() => t.setView(H.id)}
                  >
                    ${H.id === (s == null ? void 0 : s.default_view) ? "★ " : ""}${H.name}
                  </button>
                `
  )}
            </div>
          </nav>` : ""}
      <div class="workspace ${n ? "editing" : ""}">
        <input
          type="file"
          class="file-input"
          aria-label=${e("panel.upload")}
          accept="image/png,image/jpeg,image/svg+xml,.svg,.glb,model/gltf-binary"
          @change=${t.handleFileUpload}
        />
        <input
          type="file"
          class="config-file-input"
          aria-label=${e("editor.import")}
          accept="application/json,.json"
          @change=${t.handleConfigImport}
        />

        <div
          class="canvas-container"
          role="application"
          tabindex="0"
          aria-label=${e("panel.canvas")}
          @keydown=${t.onCanvasKeydown}
          @dragover=${t.onCanvasDragOver}
          @dragleave=${t.onCanvasDragLeave}
          @drop=${t.onCanvasDrop}
        >
          ${d ? V`<div class="loading" role="status">${e("panel.loading")}</div>` : V`<div class="canvas-wrapper"></div>`}
          ${n && b && (_ || y) ? V` ${!E && _ !== "mesh" ? V`<button
                      class="placement-surface"
                      aria-label=${e("editor.placeHint")}
                      @click=${t.place}
                    ></button>` : ""}
                <div class="placement-prompt">
                  <div>
                    <strong
                      >${($ == null ? void 0 : $.name) || y || _ && e(ha[_])}</strong
                    ><span>${e("editor.placeHint")}</span>
                  </div>
                  <button @click=${() => t.cancelPlacement()}>${e("dialog.cancel")}</button>
                </div>` : ""}
          ${n && b && !y && !_ ? V`<div class="map-tools" role="group" aria-label=${e("editor.quickActions")}>
                <button
                  type="button"
                  aria-pressed="true"
                  @click=${() => t.switchTab("inspector")}
                >
                  ${e("editor.selectTool")}
                </button>
                ${(E ? ["mesh", "anchor3d"] : ["rect", "polygon"]).map(
    (H) => V`<button type="button" @click=${() => t.armPlacement(H)}>
                      ${e(ha[H])}
                    </button>`
  )}
              </div>` : ""}
          <div class="panel-feedback">
            ${c && c !== e("panel.changesSaved") ? V`<div class="status" role="status">${c}</div>` : ""}
            ${p ? V`
                  <div class="status error" role="alert">
                    ${p}
                    ${f ? V`<button type="button" @click=${t.loadConfig}>
                          ${e("panel.retry")}
                        </button>` : g === "failed" ? u ? V`
                              <button type="button" @click=${t.reloadAfterConflict}>
                                ${e("panel.reload")}
                              </button>
                            ` : V`<button type="button" @click=${t.retrySave}>
                              ${e("panel.retry")}
                            </button>` : ""}
                  </div>
                ` : ""}
          </div>
          ${b && !d ? V`<div class="map-dock" ?data-3d=${E}>
                <div class="map-caption">
                  <strong>${n ? e("panel.editContents") : A == null ? void 0 : A.name}</strong>
                  <span
                    >${e("panel.mapContents", {
    areas: T.length,
    markers: O.length
  })}</span
                  >
                </div>
                <div class="map-zoom" role="group" aria-label=${e("panel.canvas")}>
                  ${E ? V`
                        ${zc.map(
    ([H, D, j]) => V`<button
                              type="button"
                              class="camera-tool"
                              aria-label=${e(j)}
                              title=${e(j)}
                              @click=${() => t.applyCameraPreset(H)}
                            >
                              ${D}
                            </button>`
  )}
                        <button
                          type="button"
                          class="camera-tool"
                          aria-label=${e(
    M === "ortho" ? "editor.cameraOrtho" : "editor.cameraPerspective"
  )}
                          @click=${t.toggleCameraMode}
                        >
                          ${M === "ortho" ? "Ortho" : "Persp"}
                        </button>
                      ` : ""}
                  <button
                    type="button"
                    aria-label=${e("panel.zoomOut")}
                    title=${e("panel.zoomOut")}
                    @click=${() => t.zoomBy(0.8)}
                  >
                    −
                  </button>
                  <button
                    type="button"
                    aria-label=${e("panel.zoomIn")}
                    title=${e("panel.zoomIn")}
                    @click=${() => t.zoomBy(1.25)}
                  >
                    +
                  </button>
                  <button class="canvas-fit" type="button" @click=${t.fitCurrentPlan}>
                    ${e("panel.fit")}
                  </button>
                </div>
              </div>` : ""}
          ${!d && !f && !b ? V`<div class="empty-state">
                <h2>${e("panel.emptyTitle")}</h2>
                <p>${e(o ? "panel.emptyDescription3d" : "panel.emptyViewer")}</p>
                ${o ? V`<button
                        class="upload-btn"
                        type="button"
                        @click=${() => t.triggerFileUpload()}
                      >
                        ${e("panel.upload")}
                      </button>
                      <button
                        class="import-btn"
                        type="button"
                        @click=${t.triggerConfigImport}
                      >
                        ${e("editor.import")}
                      </button>` : ""}
              </div>` : ""}
          <section class="canvas-accessibility" aria-label=${e("panel.objects")}>
            <ul>
              ${T.map(
    (H) => V`
                  <li>
                    ${n ? V`<button
                          type="button"
                          aria-pressed=${v === H.id ? "true" : "false"}
                          @click=${() => t.selectCanvasObject("area", H.id)}
                        >
                          ${e("panel.areaObject", { id: H.id })}
                        </button>` : e("panel.areaObject", { id: H.id })}
                  </li>
                `
  )}
              ${O.map(
    (H) => V`
                  <li>
                    <button
                      type="button"
                      aria-pressed=${n && w === H.id ? "true" : "false"}
                      @click=${() => n ? t.selectCanvasObject("marker", H.id) : t.activateMarker(H)}
                    >
                      ${e("panel.markerObject", { entity: H.entity_id })}
                    </button>
                  </li>
                `
  )}
            </ul>
          </section>
        </div>
        ${n && s ? k : ""}
      </div>
      ${Uc(
    C,
    n && m,
    {
      onToggle: t.toggleWarnings,
      onClose: t.closeWarnings,
      onSelectDiagnostic: t.jumpToWarning
    },
    e
  )}
      <floorplan-dialog
        .dialog=${h}
        .cancelLabel=${e("dialog.cancel")}
        @floorplan-dialog-resolve=${(H) => t.resolveDialog(H.detail)}
      ></floorplan-dialog>
    </div>
  `;
}
var Wc = Object.defineProperty, q = (a, t, e, i) => {
  for (var n = void 0, r = a.length - 1, s; r >= 0; r--)
    (s = a[r]) && (n = s(t, e, n) || n);
  return n && Wc(t, e, n), n;
};
const Kc = 500, Yc = (a) => a.target.value, hr = class hr extends ye {
  constructor() {
    super(...arguments), this.narrow = !1, this._config = null, this._loading = !0, this._loadFailed = !1, this._editMode = !1, this._currentView = "all", this._currentPlanId = null, this._selectedAreaId = null, this._selectedMarkerId = null, this._haAreas = [], this._haEntities = [], this._entityScrollTop = 0, this._entityViewportHeight = 180, this._warningsOpen = !1, this._cameraMode = "ortho", this._tab = "entities", this._shape = null, this._entityToAdd = "", this._entitySearch = "", this._entityDomainFilter = "", this._entityAreaFilter = "", this._notice = "", this._error = "", this._saveState = "idle", this._saveDirty = !1, this._saveConflict = !1, this._dialog = null, this._stage = null, this._konva = null, this._areaShapes = /* @__PURE__ */ new Map(), this._markerGroups = /* @__PURE__ */ new Map(), this._renderGeneration = 0, this._liveRefreshTimer = null, this._threeViewport = null, this._pending3DFocus = null, this._availableMeshesByPlan = /* @__PURE__ */ new Map(), this._drag = new uc({
      isEnabled: () => this._editMode && this._canEdit && !!this._getCurrentPlan(),
      getCanvasContainer: () => this._canvasContainer(),
      onDropEntity: (t, e, i, n) => this._addMarkerAtClientPoint(t, e, i, n)
    }), this._edits = new yc({
      hass: () => this.hass,
      editableConfig: () => this._canEdit ? this._config : null,
      commit: (t) => this._commitConfig(t),
      selectPlan: (t) => this._changePlan(t),
      selectView: (t) => this._setView(t),
      onReplaceBackground: (t) => {
        this._availableMeshesByPlan.delete(t), t === this._currentPlanId && this._clearSelection();
      },
      onImport: () => this._availableMeshesByPlan.clear(),
      newPlanId: () => this._newId("plan"),
      localize: () => this._t,
      askText: (t, e) => this._askText(t, e),
      confirm: (t, e, i) => this._askConfirm(t, e, i),
      notice: (t) => this._setNotice(t),
      error: (t) => this._setError(t)
    }), this._replacePlanId = null, this._history = new xo(), this._dialogResolver = null, this._saveQueue = new So(
      (t, e) => so(this.hass, t, e),
      {
        onStatus: (t) => this._onSaveStatus(t),
        onSaved: (t) => {
          this._config && (this._config = { ...this._config, revision: t }), this._setNotice(this._t("panel.changesSaved"));
        }
      }
    ), this._beforeUnload = (t) => {
      this._saveDirty && (t.preventDefault(), t.returnValue = "");
    };
  }
  get _canEdit() {
    var t, e;
    return ((e = (t = this.hass) == null ? void 0 : t.user) == null ? void 0 : e.is_admin) === !0;
  }
  get _t() {
    var t;
    return no((t = this.hass) == null ? void 0 : t.language);
  }
  async connectedCallback() {
    super.connectedCallback(), window.addEventListener("beforeunload", this._beforeUnload), this._drag.attach(), await this._loadConfig(), this._canEdit && await this._loadRegistry();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("beforeunload", this._beforeUnload), this._drag.detach(), this._resolveDialog(null), this._liveRefreshTimer !== null && (window.clearTimeout(this._liveRefreshTimer), this._liveRefreshTimer = null), this._destroyStage(), this._destroyThreeViewport();
  }
  async _loadConfig() {
    var t;
    this._destroyStage(), this._destroyThreeViewport(), this._availableMeshesByPlan.clear(), this._loading = !0, this._loadFailed = !1;
    try {
      this._config = await ao(this.hass), this._saveQueue.reset(this._config.revision), this._history.reset(), this._saveConflict = !1, this._error = "", this._notice = "", this._changePlan(((t = this._config.plans[0]) == null ? void 0 : t.plan_id) ?? null);
      const e = this._config.views.find(({ id: i }) => {
        var n;
        return i === ((n = this._config) == null ? void 0 : n.default_view);
      });
      e && (this._currentView = e.id), this._reconcileSelection();
    } catch {
      this._config = null, this._loadFailed = !0, this._saveQueue.reset(0), this._history.reset(), this._setError(this._t("panel.loadError"));
    }
    this._loading = !1;
  }
  async saveConfig() {
    return !this._config || !this._canEdit ? !1 : this._saveQueue.enqueue(this._config);
  }
  _commitConfig(t, e = !0) {
    return !this._canEdit || t === this._config ? Promise.resolve(!1) : (e && this._config && this._history.record(this._config), this._config = t, this._reconcileSelection(), this._saveQueue.enqueue(t));
  }
  _undo() {
    if (!this._config) return;
    const t = this._history.undo(this._config);
    t && (this._commitConfig(t, !1), this._clearSelection());
  }
  _redo() {
    if (!this._config) return;
    const t = this._history.redo(this._config);
    t && (this._commitConfig(t, !1), this._clearSelection());
  }
  _onSaveStatus(t) {
    this._saveState = t.state, this._saveDirty = t.dirty, (t.state === "pending" || t.state === "saving") && (this._notice = "", this._error = "", this._saveConflict = !1), t.state === "failed" && (this._saveConflict = lo(t.error) === "config_conflict", this._setError(this._t(this._saveConflict ? "panel.conflict" : "panel.saveFailed")));
  }
  updated(t) {
    var f, g, u;
    if (t.has("hass") && (!this._canEdit && this._editMode && this._toggleEditMode(), this._scheduleLiveRefresh()), this._loading || !this.isConnected) return;
    const e = t.has("_config") ? t.get("_config") : this._config, i = e == null ? void 0 : e.plans.find(({ plan_id: _ }) => _ === this._currentPlanId), n = this._getCurrentPlan();
    if (t.has("_loading") || t.has("_currentPlanId") || (i == null ? void 0 : i.background) !== (n == null ? void 0 : n.background)) {
      this._renderFloorplan();
      return;
    }
    const r = t.get("_currentView") ?? this._currentView, s = e == null ? void 0 : e.views.find(({ id: _ }) => _ === r), o = this._getCurrentView(), l = t.has("_haAreas") || t.has("_haEntities"), d = t.has("_editMode"), c = t.has("_selectedAreaId") || t.has("_selectedMarkerId");
    if (this._threeViewport) {
      (i !== n || s !== o || d || l || c || t.has("_shape") || t.has("_entityToAdd")) && this._sync3DState(), (n == null ? void 0 : n.view.camera_mode) !== (i == null ? void 0 : i.view.camera_mode) && this._setCameraMode((n == null ? void 0 : n.view.camera_mode) ?? "ortho"), o != null && o.camera_preset_id && (t.has("_currentView") || o.camera_preset_id !== (s == null ? void 0 : s.camera_preset_id)) && this._applyCameraPreset(o.camera_preset_id);
      return;
    }
    const p = this._getCanvasState();
    ((i == null ? void 0 : i.markers) !== (n == null ? void 0 : n.markers) || s !== o || d || l) && ((f = this._konva) == null || f.renderMarkers(p)), ((i == null ? void 0 : i.areas) !== (n == null ? void 0 : n.areas) || (i == null ? void 0 : i.markers) !== (n == null ? void 0 : n.markers) || s !== o || d || l || t.has("_selectedAreaId")) && ((g = this._konva) == null || g.renderAreas(p)), (c || d) && ((u = this._konva) == null || u.syncCanvasInteractivity(p));
  }
  _scheduleLiveRefresh() {
    this._liveRefreshTimer === null && (this._liveRefreshTimer = window.setTimeout(() => {
      var e, i;
      this._liveRefreshTimer = null;
      const t = this._getCanvasState();
      (e = this._konva) == null || e.refreshMarkerLiveValues(t), this._editMode || (i = this._konva) == null || i.renderAreas(t), this._sync3DState();
    }, Kc));
  }
  _setNotice(t) {
    this._error = "", this._notice = t;
  }
  _setError(t) {
    this._notice = "", this._error = t;
  }
  _askText(t, e = "") {
    var i;
    return (i = this._dialogResolver) == null || i.call(this, null), this._dialog = {
      kind: "text",
      title: t,
      value: e,
      confirmLabel: this._t("dialog.save"),
      destructive: !1
    }, new Promise((n) => {
      this._dialogResolver = (r) => n(typeof r == "string" ? r : null);
    });
  }
  _askConfirm(t, e = this._t("dialog.confirm"), i = !1) {
    var n;
    return (n = this._dialogResolver) == null || n.call(this, null), this._dialog = {
      kind: "confirm",
      title: this._t("dialog.confirmTitle"),
      message: t,
      value: "",
      confirmLabel: e,
      destructive: i
    }, new Promise((r) => {
      this._dialogResolver = (s) => r(s === !0);
    });
  }
  _resolveDialog(t) {
    const e = this._dialogResolver;
    this._dialogResolver = null, this._dialog = null, e == null || e(t);
  }
  _retrySave() {
    this._saveQueue.retry();
  }
  async _reloadAfterConflict() {
    await this._askConfirm(this._t("dialog.reloadMessage"), this._t("dialog.reload"), !0) && await this._loadConfig();
  }
  _initializeStage() {
    const t = this.renderRoot.querySelector(".canvas-wrapper");
    if (!t) {
      this._setError(this._t("panel.canvasInitError"));
      return;
    }
    this._konva = new lc(t, this._areaShapes, this._markerGroups, {
      isEditing: () => this._editMode,
      getPlan: () => this._getCurrentPlan(),
      getState: () => this._getCanvasState(),
      select: (e, i) => this._selectCanvasObject(e, i),
      activate: (e) => void this._activateMarker(e),
      move: (e, i) => this._updateMarker(e, { pos: i }),
      resize: (e, i) => this._updateAreaShape(e, i),
      onEmptyCanvasClick: () => this._clearSelection(),
      onImageError: (e) => this._setError(
        this._t(e === "load" ? "panel.imageLoadError" : "panel.imageRenderError")
      )
    }), this._stage = this._konva.stage;
  }
  _getCanvasState() {
    return {
      plan: this._getCurrentPlan(),
      view: this._getCurrentView(),
      states: this.hass.states,
      entities: this._haEntities,
      areas: this._haAreas,
      editMode: this._editMode,
      selectedAreaId: this._selectedAreaId,
      selectedMarkerId: this._selectedMarkerId
    };
  }
  _destroyStage() {
    var t;
    (t = this._konva) == null || t.destroy(), this._konva = null, this._stage = null;
  }
  _getCurrentPlan() {
    var t;
    return ((t = this._config) == null ? void 0 : t.plans.find((e) => e.plan_id === this._currentPlanId)) ?? null;
  }
  _reconcileSelection() {
    var e, i;
    if (!this._config) return;
    this._config.plans.some((n) => n.plan_id === this._currentPlanId) || (this._currentPlanId = ((e = this._config.plans[0]) == null ? void 0 : e.plan_id) ?? null, this._selectedAreaId = null, this._selectedMarkerId = null);
    const t = this._getCurrentPlan();
    this._selectedAreaId && !(t != null && t.areas.some(({ id: n }) => n === this._selectedAreaId)) && (this._selectedAreaId = null), this._selectedMarkerId && !(t != null && t.markers.some(({ id: n }) => n === this._selectedMarkerId)) && (this._selectedMarkerId = null), this._config.views.some((n) => n.id === this._currentView) || (this._currentView = this._config.default_view ?? ((i = this._config.views[0]) == null ? void 0 : i.id) ?? "all");
  }
  async _renderFloorplan() {
    var e, i, n, r;
    const t = this._getCurrentPlan();
    if ((t == null ? void 0 : t.background.type) === "model") {
      this._destroyStage(), this._destroyThreeViewport();
      const s = this._renderGeneration, o = this.renderRoot.querySelector(".canvas-wrapper");
      if (!o) return;
      const l = t.background;
      this._availableMeshesByPlan.delete(t.plan_id);
      const d = () => {
        var c;
        return s === this._renderGeneration && this.isConnected && this._currentPlanId === t.plan_id && ((c = this._getCurrentPlan()) == null ? void 0 : c.background) === l;
      };
      try {
        const { createThreeViewport: c } = await import("./chunks/three-viewport-MI4GvKCR.js");
        if (!d()) return;
        const p = ((e = this._getCurrentPlan()) == null ? void 0 : e.view.camera_mode) ?? "ortho";
        this._cameraMode = p;
        const f = c(o, {
          ...this._get3DState(),
          loadModelBuffer: () => yo(this.hass, l),
          cameraMode: p,
          cameraPreset: (i = this._getCurrentView()) == null ? void 0 : i.camera_preset_id,
          messages: {
            webglUnavailable: this._t("panel.webglUnavailable"),
            modelLoadError: this._t("panel.modelLoadError"),
            webglContextLost: this._t("panel.webglContextLost")
          },
          onPlaceMarker: (g, { x: u, y: _, z: y }) => this._addMarkerAt(g, { x: u, y: _, z: y }),
          onSelectMarker: (g) => this._selectCanvasObject("marker", g),
          onMoveMarker: (g, u) => this._updateMarker(g, { pos: u }),
          onActivateMarker: (g) => void this._activateMarker(g),
          onPickMesh: (g, u) => this._addDrawnArea(Do(this._newId("area"), g, u)),
          onPlaceAnchor: (g) => this._addDrawnArea(gn(this._newId("area"), g)),
          onSelectArea: (g) => this._selectCanvasObject("area", g),
          onEmptyCanvasClick: () => this._clearSelection(),
          onError: () => {
            d() && this._setError(this._t("panel.modelLoadError"));
          }
        });
        this._threeViewport = f, await f.ready && d() && (this._availableMeshesByPlan.set(t.plan_id, f.getAvailableMeshes()), this._cameraMode = ((n = f.getCameraPreset()) == null ? void 0 : n.mode) ?? this._cameraMode, this._pending3DFocus && (this._pending3DFocus.kind === "area" ? f.focusArea(this._pending3DFocus.id) : f.focusMarker(this._pending3DFocus.id)), this._pending3DFocus = null, this.requestUpdate());
      } catch {
        d() && this._setError(this._t("panel.modelLoadError"));
      }
      return;
    }
    this._destroyThreeViewport(), this._stage || this._initializeStage(), (r = this._konva) == null || r.renderPlan(this.hass, this._getCanvasState());
  }
  _destroyThreeViewport() {
    var t;
    this._renderGeneration += 1, (t = this._threeViewport) == null || t.destroy(), this._threeViewport = null;
  }
  _get3DState() {
    const { plan: t, areas: e, ...i } = this._getCanvasState();
    return {
      ...i,
      markers: t == null ? void 0 : t.markers,
      areas: t == null ? void 0 : t.areas,
      hassAreas: e,
      shadows: (t == null ? void 0 : t.view.shadows) ?? !1,
      lighting: (t == null ? void 0 : t.view.lighting) ?? !0,
      camera_presets: t == null ? void 0 : t.view.camera_presets,
      meshPickMode: this._shape === "mesh",
      anchorPickMode: this._shape === "anchor3d",
      armedEntityId: this._entityToAdd || null
    };
  }
  _sync3DState() {
    var t;
    (t = this._threeViewport) == null || t.update(this._get3DState());
  }
  _fitCurrentPlan() {
    var e;
    const t = this._getCurrentPlan();
    this._threeViewport ? this._threeViewport.fit() : (t == null ? void 0 : t.background.type) === "image" && ((e = this._konva) == null || e.fitToScreen(t.background.width, t.background.height));
  }
  _zoomBy(t) {
    var e;
    if (this._threeViewport) {
      t > 1 ? this._threeViewport.zoomIn() : this._threeViewport.zoomOut();
      return;
    }
    (e = this._konva) == null || e.zoomBy(t);
  }
  _toggleEditMode() {
    !this._canEdit && !this._editMode || (this._switchTab("entities"), this._editMode = !this._editMode, this._editMode || (this._drag.cancel(), this._warningsOpen = !1, this._clearSelection()));
  }
  _selectPlan(t) {
    this._changePlan(Yc(t) || null);
  }
  _changePlan(t) {
    this._switchTab("entities"), this._clearSelection(), this._currentPlanId = t;
  }
  _clearSelection() {
    this._selectedAreaId = null, this._selectedMarkerId = null, this._pending3DFocus = null;
  }
  _switchTab(t) {
    t !== this._tab && this._resetEntityScroll(), this._shape = null, this._entityToAdd = "", this._tab = t;
  }
  _armPlacement(t, e = "") {
    this._shape = t, this._entityToAdd = e, this.updateComplete.then(
      () => {
        var i;
        return (i = this.renderRoot.querySelector(".placement-surface") ?? this._canvasContainer()) == null ? void 0 : i.focus({ preventScroll: !0 });
      }
    );
  }
  _place(t) {
    var i, n, r, s, o;
    if (!this._editMode || !this._canEdit) return;
    if (ni(this._getCurrentPlan())) {
      const l = t.currentTarget.getBoundingClientRect(), d = (i = this._threeViewport) == null ? void 0 : i.raycastClientPoint(
        t.detail ? t.clientX : l.left + l.width / 2,
        t.detail ? t.clientY : l.top + l.height / 2
      );
      if (!d) return;
      const { x: c, y: p, z: f } = d;
      this._shape === "anchor3d" ? this._addDrawnArea(gn(this._newId("area"), { x: c, y: p, z: f })) : this._entityToAdd && this._addMarkerAt(this._entityToAdd, { x: c, y: p, z: f }), (n = this._canvasContainer()) == null || n.focus({ preventScroll: !0 });
      return;
    }
    const e = (t.detail ? (r = this._konva) == null ? void 0 : r.clientPoint(t.clientX, t.clientY) : (s = this._konva) == null ? void 0 : s.center()) ?? { x: 0, y: 0 };
    this._shape === "rect" || this._shape === "polygon" ? this._addDrawnArea(Fo(this._newId("area"), this._shape, e)) : this._entityToAdd && this._addMarkerAt(this._entityToAdd, e), (o = this._canvasContainer()) == null || o.focus({ preventScroll: !0 });
  }
  _addDrawnArea(t) {
    const e = this._getCurrentPlan();
    !this._canEdit || !this._editMode || !this._config || !e || (this._commitConfig(No(this._config, e.plan_id, t)), this._selectCanvasObject("area", t.id));
  }
  _updateAreaShape(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._getCurrentPlan();
    i && this._commitConfig(Io(this._config, i.plan_id, t, e));
  }
  async _loadRegistry() {
    if (!this._canEdit) return;
    let t = [];
    try {
      const e = await oo(this.hass);
      ({ areas: this._haAreas, entities: t } = e);
    } catch {
      this._haAreas = [], this._setError(this._t("panel.registryLoadError"));
    }
    this._haEntities = Nc(this.hass.states, t);
  }
  _deleteSelectedArea() {
    return this._edits.deleteObject("area", this._getCurrentPlan(), this._selectedAreaId);
  }
  _addMarkerAt(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._getCurrentPlan();
    if (!i) return;
    const n = this._haEntities.find((s) => s.entity_id === t);
    if (!n && !this.hass.states[t]) {
      this._setError(this._t("panel.selectExistingEntity"));
      return;
    }
    const r = {
      id: this._newId("marker"),
      entity_id: t,
      area_id: (n == null ? void 0 : n.area_id) ?? null,
      pos: e,
      icon: (n == null ? void 0 : n.icon) ?? void 0,
      label_mode: "auto",
      tags: eo(t),
      bind: { primary: { source: "state" } }
    };
    this._commitConfig(Mo(this._config, i.plan_id, r)), this._selectCanvasObject("marker", r.id);
  }
  _canvasContainer() {
    return this.renderRoot.querySelector(".canvas-container");
  }
  _addMarkerAtClientPoint(t, e, i, n) {
    var s;
    if (this._threeViewport) {
      this._threeViewport.dropAt(e, i, t);
      return;
    }
    const r = (s = this._konva) == null ? void 0 : s.clientPoint(e, i, n);
    r && this._addMarkerAt(t, r);
  }
  _updateMarker(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._getCurrentPlan();
    i && this._commitConfig(Ra(this._config, i.plan_id, t, e));
  }
  _deleteSelectedMarker() {
    return this._edits.deleteObject("marker", this._getCurrentPlan(), this._selectedMarkerId);
  }
  async _activateMarker(t) {
    var i;
    const e = ((i = t.action) == null ? void 0 : i.tap) ?? "more-info";
    if (e !== "none") {
      if (e === "toggle") {
        try {
          await this.hass.callService("homeassistant", "toggle", { entity_id: t.entity_id });
        } catch {
          this._setError(this._t("panel.actionFailed"));
        }
        return;
      }
      this._openMoreInfo(t.entity_id);
    }
  }
  _openMoreInfo(t) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: !0,
        composed: !0,
        detail: { entityId: t }
      })
    );
  }
  _selectCanvasObject(t, e) {
    !this._canEdit || !this._editMode || (this._switchTab("inspector"), this._selectedAreaId = t === "area" ? e : null, this._selectedMarkerId = t === "marker" ? e : null);
  }
  _onCanvasKeydown(t) {
    var e, i;
    if (!(!this._canEdit || !this._editMode)) {
      if (t.key === "Escape") {
        this._switchTab(this._tab), (e = this._canvasContainer()) == null || e.focus();
        return;
      }
      if ((t.ctrlKey || t.metaKey) && t.key.toLowerCase() === "z") {
        t.preventDefault(), t.shiftKey ? this._redo() : this._undo();
        return;
      }
      if (t.key === "Enter" && ni(this._getCurrentPlan()) && (this._entityToAdd || this._shape === "anchor3d")) {
        if (t.target instanceof Element && t.target.closest("button, input, select, textarea, a, [role='button']"))
          return;
        const n = this._canvasContainer();
        if (!n) return;
        t.preventDefault();
        const r = n.getBoundingClientRect(), s = (i = this._threeViewport) == null ? void 0 : i.raycastClientPoint(
          r.left + r.width / 2,
          r.top + r.height / 2
        );
        if (!s) return;
        const { x: o, y: l, z: d } = s;
        this._shape === "anchor3d" ? this._addDrawnArea(gn(this._newId("area"), { x: o, y: l, z: d })) : this._entityToAdd && this._addMarkerAt(this._entityToAdd, { x: o, y: l, z: d });
        return;
      }
      t.key !== "Delete" && t.key !== "Backspace" || (this._selectedAreaId ? (t.preventDefault(), this._deleteSelectedArea()) : this._selectedMarkerId && (t.preventDefault(), this._deleteSelectedMarker()));
    }
  }
  _getCurrentView() {
    var t;
    return (t = this._config) == null ? void 0 : t.views.find((e) => e.id === this._currentView);
  }
  _setView(t) {
    this._switchTab(this._tab), this._clearSelection(), this._currentView = t;
  }
  _deleteCurrentView() {
    return this._edits.deleteView(this._currentView);
  }
  _triggerConfigImport() {
    var t;
    this._canEdit && ((t = this.renderRoot.querySelector(".config-file-input")) == null || t.click());
  }
  _handleFileUpload(t) {
    const e = this._replacePlanId;
    return this._replacePlanId = null, this._edits.uploadAsset(t, e);
  }
  _triggerFileUpload(t = null) {
    var e;
    this._canEdit && (this._replacePlanId = t, (e = this.renderRoot.querySelector(".file-input")) == null || e.click());
  }
  _newId(t) {
    const e = crypto.getRandomValues(new Uint32Array(4)), i = Array.from(e, (n) => n.toString(16).padStart(8, "0")).join("");
    return `${t}_${i}`;
  }
  _resetEntityScroll() {
    this._entityScrollTop = 0;
    const t = this.renderRoot.querySelector(".entity-palette");
    t && (t.scrollTop = 0);
  }
  _setCameraMode(t) {
    var e;
    (e = this._threeViewport) == null || e.setCameraMode(t), this._cameraMode = t;
  }
  _toggleCameraMode() {
    this._setCameraMode(this._cameraMode === "ortho" ? "perspective" : "ortho");
  }
  _applyCameraPreset(t) {
    var e, i;
    (e = this._threeViewport) != null && e.applyCameraPreset(t) && (this._cameraMode = ((i = this._threeViewport.getCameraPreset()) == null ? void 0 : i.mode) ?? this._cameraMode);
  }
  async _saveCameraPreset() {
    var r;
    const t = this._getCurrentPlan(), e = this._threeViewport;
    if (!this._canEdit || !t || !e) return;
    const i = e.getCameraPreset();
    if (!i) return;
    const n = (r = await this._askText(this._t("editor.savePreset"))) == null ? void 0 : r.trim();
    !this._config || !n || this._threeViewport !== e || this._commitConfig(
      Ho(this._config, t.plan_id, {
        ...i,
        id: this._newId("camera"),
        name: n,
        mode: i.mode ?? this._cameraMode
      })
    );
  }
  async _jumpToWarning({ planId: t, viewId: e, targetId: i, targetType: n }) {
    var r, s;
    this._warningsOpen = !1, t && t !== this._currentPlanId && this._changePlan(t), e && this._setView(e), this._clearSelection(), i && (n === "area" || n === "marker") ? (this._selectCanvasObject(n, i), ni(this._getCurrentPlan()) && (this._pending3DFocus = { kind: n, id: i }), await this.updateComplete, this._pending3DFocus && this._threeViewport && (this._pending3DFocus.kind === "area" ? this._threeViewport.focusArea(this._pending3DFocus.id) : this._threeViewport.focusMarker(this._pending3DFocus.id)) && (this._pending3DFocus = null), (r = this._konva) == null || r.focusObject(n, i)) : (this._switchTab("settings"), await this.updateComplete), (s = this.renderRoot.querySelector('.editor-nav [aria-current="page"]')) == null || s.focus();
  }
  _renderEditor(t, e) {
    return Ic(
      this._getCanvasState(),
      {
        tab: this._tab,
        currentViewId: this._currentView,
        availableMeshes: t ? this._availableMeshesByPlan.get(t.plan_id) : void 0,
        entityToAdd: this._entityToAdd,
        entitySearch: this._entitySearch,
        entityDomainFilter: this._entityDomainFilter,
        entityAreaFilter: this._entityAreaFilter,
        entityScrollTop: this._entityScrollTop,
        entityViewportHeight: this._entityViewportHeight,
        canUndo: this._history.canUndo,
        canRedo: this._history.canRedo
      },
      {
        uploadImage: () => this._triggerFileUpload(),
        replaceImage: () => this._triggerFileUpload(t == null ? void 0 : t.plan_id),
        undo: () => this._undo(),
        redo: () => this._redo(),
        renamePlan: () => this._edits.renamePlan(t),
        deletePlan: () => this._edits.deletePlan(t),
        onEntityScroll: (i, n) => {
          this._entityScrollTop = i, this._entityViewportHeight = n;
        },
        addView: () => this._edits.addView(),
        renameView: () => this._edits.renameView(e),
        moveView: (i) => this._edits.moveView(this._currentView, i),
        setDefaultView: () => this._edits.setDefaultView(e),
        deleteView: () => this._deleteCurrentView(),
        exportConfig: () => this._edits.exportConfig(this._config),
        importConfig: () => this._triggerConfigImport(),
        setEntitySearch: (i) => {
          this._resetEntityScroll(), this._entitySearch = i;
        },
        setEntityDomainFilter: (i) => {
          this._resetEntityScroll(), this._entityDomainFilter = i;
        },
        setEntityAreaFilter: (i) => {
          this._resetEntityScroll(), this._entityAreaFilter = i;
        },
        setEntityToAdd: (i, n) => {
          (!this._drag.skipNextClick || !n.detail) && this._armPlacement(null, i), this._drag.skipNextClick = !1;
        },
        switchTab: (i) => this._switchTab(i),
        startEntityDrag: this._drag.onEntityDragStart,
        startEntityPointerDrag: this._drag.onEntityPointerDown,
        updatePlan3DSettings: (i, n) => this._edits.updatePlan3DSettings(t, i, n),
        saveCameraPreset: () => void this._saveCameraPreset(),
        applyCameraPreset: (i) => this._applyCameraPreset(i),
        deleteCameraPreset: (i) => this._edits.deleteCameraPreset(t, i),
        deleteArea: () => this._deleteSelectedArea(),
        deleteMarker: () => this._deleteSelectedMarker()
      },
      () => this._config,
      (i) => this._commitConfig(i),
      this._t
    );
  }
  render() {
    var r, s;
    const t = this._getCurrentPlan(), e = this._getCurrentView(), i = this._t, n = this._editMode ? Gc({
      plans: ((r = this._config) == null ? void 0 : r.plans) ?? [],
      views: ((s = this._config) == null ? void 0 : s.views) ?? [],
      states: this.hass.states,
      entities: this._haEntities,
      haAreas: this._haAreas,
      availableMeshesByPlan: this._availableMeshesByPlan
    }) : [];
    return jc(
      {
        narrow: this.narrow,
        editMode: this._editMode,
        hass: this.hass,
        entities: this._haEntities,
        config: this._config,
        canEdit: this._canEdit,
        currentViewId: this._currentView,
        loading: this._loading,
        notice: this._notice,
        error: this._error,
        loadFailed: this._loadFailed,
        saveState: this._saveState,
        saveConflict: this._saveConflict,
        shape: this._shape,
        entityToAdd: this._entityToAdd,
        selectedAreaId: this._selectedAreaId,
        selectedMarkerId: this._selectedMarkerId,
        dialog: this._dialog,
        warningsOpen: this._warningsOpen,
        currentPlan: t,
        currentView: e,
        cameraMode: this._cameraMode,
        diagnostics: n,
        editor: this._editMode && this._config ? this._renderEditor(t, e) : ""
      },
      {
        selectPlan: this._selectPlan.bind(this),
        toggleEditMode: this._toggleEditMode.bind(this),
        setView: this._setView.bind(this),
        handleFileUpload: this._handleFileUpload.bind(this),
        handleConfigImport: (o) => this._edits.importConfig(o),
        onCanvasKeydown: this._onCanvasKeydown.bind(this),
        onCanvasDragOver: this._drag.onCanvasDragOver,
        onCanvasDragLeave: this._drag.onCanvasDragLeave,
        onCanvasDrop: this._drag.onCanvasDrop,
        place: this._place.bind(this),
        cancelPlacement: () => this._switchTab(this._tab),
        switchTab: this._switchTab.bind(this),
        armPlacement: this._armPlacement.bind(this),
        loadConfig: this._loadConfig.bind(this),
        reloadAfterConflict: this._reloadAfterConflict.bind(this),
        retrySave: this._retrySave.bind(this),
        zoomBy: this._zoomBy.bind(this),
        fitCurrentPlan: this._fitCurrentPlan.bind(this),
        triggerFileUpload: this._triggerFileUpload.bind(this),
        triggerConfigImport: this._triggerConfigImport.bind(this),
        selectCanvasObject: this._selectCanvasObject.bind(this),
        activateMarker: this._activateMarker.bind(this),
        resolveDialog: this._resolveDialog.bind(this),
        applyCameraPreset: this._applyCameraPreset.bind(this),
        toggleCameraMode: this._toggleCameraMode.bind(this),
        toggleWarnings: () => {
          this._warningsOpen = !this._warningsOpen;
        },
        closeWarnings: () => {
          this._warningsOpen = !1;
        },
        jumpToWarning: this._jumpToWarning.bind(this)
      },
      i
    );
  }
};
hr.styles = dc;
let Y = hr;
q([
  Me({ attribute: !1 })
], Y.prototype, "hass");
q([
  Me({ type: Boolean })
], Y.prototype, "narrow");
q([
  Me({ type: Object })
], Y.prototype, "panel");
q([
  tt()
], Y.prototype, "_config");
q([
  tt()
], Y.prototype, "_loading");
q([
  tt()
], Y.prototype, "_loadFailed");
q([
  tt()
], Y.prototype, "_editMode");
q([
  tt()
], Y.prototype, "_currentView");
q([
  tt()
], Y.prototype, "_currentPlanId");
q([
  tt()
], Y.prototype, "_selectedAreaId");
q([
  tt()
], Y.prototype, "_selectedMarkerId");
q([
  tt()
], Y.prototype, "_haAreas");
q([
  tt()
], Y.prototype, "_haEntities");
q([
  tt()
], Y.prototype, "_entityScrollTop");
q([
  tt()
], Y.prototype, "_entityViewportHeight");
q([
  tt()
], Y.prototype, "_warningsOpen");
q([
  tt()
], Y.prototype, "_cameraMode");
q([
  tt()
], Y.prototype, "_tab");
q([
  tt()
], Y.prototype, "_shape");
q([
  tt()
], Y.prototype, "_entityToAdd");
q([
  tt()
], Y.prototype, "_entitySearch");
q([
  tt()
], Y.prototype, "_entityDomainFilter");
q([
  tt()
], Y.prototype, "_entityAreaFilter");
q([
  tt()
], Y.prototype, "_notice");
q([
  tt()
], Y.prototype, "_error");
q([
  tt()
], Y.prototype, "_saveState");
q([
  tt()
], Y.prototype, "_saveDirty");
q([
  tt()
], Y.prototype, "_saveConflict");
q([
  tt()
], Y.prototype, "_dialog");
customElements.get("floorplan-ui-panel") || customElements.define("floorplan-ui-panel", Y);
export {
  or as a,
  Yh as b,
  to as c,
  wr as d,
  Qs as e,
  Aa as f,
  Ca as g,
  wa as h,
  qs as i,
  Js as j,
  Sa as m,
  Cs as r,
  fo as v
};

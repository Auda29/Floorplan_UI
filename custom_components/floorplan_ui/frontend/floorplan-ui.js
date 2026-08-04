/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ze = globalThis, kr = Ze.ShadowRoot && (Ze.ShadyCSS === void 0 || Ze.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ar = Symbol(), Xr = /* @__PURE__ */ new WeakMap();
let Wn = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Ar) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (kr && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Xr.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Xr.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ua = (a) => new Wn(typeof a == "string" ? a : a + "", void 0, Ar), jn = (a, ...t) => {
  const e = a.length === 1 ? a[0] : t.reduce((i, r, n) => i + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + a[n + 1], a[0]);
  return new Wn(e, a, Ar);
}, Ba = (a, t) => {
  if (kr) a.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = Ze.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, a.appendChild(i);
  }
}, qr = kr ? (a) => a : (a) => a instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Ua(e);
})(a) : a;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Va, defineProperty: Ha, getOwnPropertyDescriptor: za, getOwnPropertyNames: Wa, getOwnPropertySymbols: ja, getPrototypeOf: Ya } = Object, It = globalThis, Qr = It.trustedTypes, Ka = Qr ? Qr.emptyScript : "", tr = It.reactiveElementPolyfillSupport, Oe = (a, t) => a, ii = { toAttribute(a, t) {
  switch (t) {
    case Boolean:
      a = a ? Ka : null;
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
} }, Pr = (a, t) => !Va(a, t), Jr = { attribute: !0, type: String, converter: ii, reflect: !1, useDefault: !1, hasChanged: Pr };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), It.litPropertyMetadata ?? (It.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let ge = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Jr) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && Ha(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: n } = za(this.prototype, t) ?? { get() {
      return this[e];
    }, set(s) {
      this[e] = s;
    } };
    return { get: r, set(s) {
      const o = r == null ? void 0 : r.call(this);
      n == null || n.call(this, s), this.requestUpdate(t, o, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Jr;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Oe("elementProperties"))) return;
    const t = Ya(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Oe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Oe("properties"))) {
      const e = this.properties, i = [...Wa(e), ...ja(e)];
      for (const r of i) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, r] of e) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const r = this._$Eu(e, i);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) e.unshift(qr(r));
    } else t !== void 0 && e.push(qr(t));
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
    return Ba(t, this.constructor.elementStyles), t;
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
    var n;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const s = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : ii).toAttribute(e, i.type);
      this._$Em = t, s == null ? this.removeAttribute(r) : this.setAttribute(r, s), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, s;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = i.getPropertyOptions(r), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? o.converter : ii;
      this._$Em = r;
      const h = l.fromAttribute(e, o.type);
      this[r] = h ?? ((s = this._$Ej) == null ? void 0 : s.get(r)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, n) {
    var s;
    if (t !== void 0) {
      const o = this.constructor;
      if (r === !1 && (n = this[t]), i ?? (i = o.getPropertyOptions(t)), !((i.hasChanged ?? Pr)(n, e) || i.useDefault && i.reflect && n === ((s = this._$Ej) == null ? void 0 : s.get(t)) && !this.hasAttribute(o._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: n }, s) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, s ?? e ?? this[t]), n !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [n, s] of this._$Ep) this[n] = s;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, s] of r) {
        const { wrapped: o } = s, l = this[n];
        o !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, s, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var r;
      return (r = i.hostUpdated) == null ? void 0 : r.call(i);
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
ge.elementStyles = [], ge.shadowRootOptions = { mode: "open" }, ge[Oe("elementProperties")] = /* @__PURE__ */ new Map(), ge[Oe("finalized")] = /* @__PURE__ */ new Map(), tr == null || tr({ ReactiveElement: ge }), (It.reactiveElementVersions ?? (It.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const De = globalThis, Zr = (a) => a, ri = De.trustedTypes, tn = ri ? ri.createPolicy("lit-html", { createHTML: (a) => a }) : void 0, Yn = "$lit$", Gt = `lit$${Math.random().toFixed(9).slice(2)}$`, Kn = "?" + Gt, Xa = `<${Kn}>`, Jt = document, Ne = () => Jt.createComment(""), Le = (a) => a === null || typeof a != "object" && typeof a != "function", Er = Array.isArray, qa = (a) => Er(a) || typeof (a == null ? void 0 : a[Symbol.iterator]) == "function", er = `[ 	
\f\r]`, Te = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, en = /-->/g, rn = />/g, Yt = RegExp(`>|${er}(?:([^\\s"'>=/]+)(${er}*=${er}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), nn = /'/g, an = /"/g, Xn = /^(?:script|style|textarea|title)$/i, Qa = (a) => (t, ...e) => ({ _$litType$: a, strings: t, values: e }), Y = Qa(1), _e = Symbol.for("lit-noChange"), dt = Symbol.for("lit-nothing"), sn = /* @__PURE__ */ new WeakMap(), qt = Jt.createTreeWalker(Jt, 129);
function qn(a, t) {
  if (!Er(a) || !a.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return tn !== void 0 ? tn.createHTML(t) : t;
}
const Ja = (a, t) => {
  const e = a.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = Te;
  for (let o = 0; o < e; o++) {
    const l = a[o];
    let h, u, f = -1, p = 0;
    for (; p < l.length && (s.lastIndex = p, u = s.exec(l), u !== null); ) p = s.lastIndex, s === Te ? u[1] === "!--" ? s = en : u[1] !== void 0 ? s = rn : u[2] !== void 0 ? (Xn.test(u[2]) && (r = RegExp("</" + u[2], "g")), s = Yt) : u[3] !== void 0 && (s = Yt) : s === Yt ? u[0] === ">" ? (s = r ?? Te, f = -1) : u[1] === void 0 ? f = -2 : (f = s.lastIndex - u[2].length, h = u[1], s = u[3] === void 0 ? Yt : u[3] === '"' ? an : nn) : s === an || s === nn ? s = Yt : s === en || s === rn ? s = Te : (s = Yt, r = void 0);
    const _ = s === Yt && a[o + 1].startsWith("/>") ? " " : "";
    n += s === Te ? l + Xa : f >= 0 ? (i.push(h), l.slice(0, f) + Yn + l.slice(f) + Gt + _) : l + Gt + (f === -2 ? o : _);
  }
  return [qn(a, n + (a[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Ge {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let n = 0, s = 0;
    const o = t.length - 1, l = this.parts, [h, u] = Ja(t, e);
    if (this.el = Ge.createElement(h, i), qt.currentNode = this.el.content, e === 2 || e === 3) {
      const f = this.el.content.firstChild;
      f.replaceWith(...f.childNodes);
    }
    for (; (r = qt.nextNode()) !== null && l.length < o; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const f of r.getAttributeNames()) if (f.endsWith(Yn)) {
          const p = u[s++], _ = r.getAttribute(f).split(Gt), c = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: n, name: c[2], strings: _, ctor: c[1] === "." ? ts : c[1] === "?" ? es : c[1] === "@" ? is : li }), r.removeAttribute(f);
        } else f.startsWith(Gt) && (l.push({ type: 6, index: n }), r.removeAttribute(f));
        if (Xn.test(r.tagName)) {
          const f = r.textContent.split(Gt), p = f.length - 1;
          if (p > 0) {
            r.textContent = ri ? ri.emptyScript : "";
            for (let _ = 0; _ < p; _++) r.append(f[_], Ne()), qt.nextNode(), l.push({ type: 2, index: ++n });
            r.append(f[p], Ne());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Kn) l.push({ type: 2, index: n });
      else {
        let f = -1;
        for (; (f = r.data.indexOf(Gt, f + 1)) !== -1; ) l.push({ type: 7, index: n }), f += Gt.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const i = Jt.createElement("template");
    return i.innerHTML = t, i;
  }
}
function me(a, t, e = a, i) {
  var s, o;
  if (t === _e) return t;
  let r = i !== void 0 ? (s = e._$Co) == null ? void 0 : s[i] : e._$Cl;
  const n = Le(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((o = r == null ? void 0 : r._$AO) == null || o.call(r, !1), n === void 0 ? r = void 0 : (r = new n(a), r._$AT(a, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = me(a, r._$AS(a, t.values), r, i)), t;
}
class Za {
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
    const { el: { content: e }, parts: i } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? Jt).importNode(e, !0);
    qt.currentNode = r;
    let n = qt.nextNode(), s = 0, o = 0, l = i[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let h;
        l.type === 2 ? h = new Be(n, n.nextSibling, this, t) : l.type === 1 ? h = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (h = new rs(n, this, t)), this._$AV.push(h), l = i[++o];
      }
      s !== (l == null ? void 0 : l.index) && (n = qt.nextNode(), s++);
    }
    return qt.currentNode = Jt, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class Be {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = dt, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    t = me(this, t, e), Le(t) ? t === dt || t == null || t === "" ? (this._$AH !== dt && this._$AR(), this._$AH = dt) : t !== this._$AH && t !== _e && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : qa(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== dt && Le(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Jt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Ge.createElement(qn(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(e);
    else {
      const s = new Za(r, this), o = s.u(this.options);
      s.p(e), this.T(o), this._$AH = s;
    }
  }
  _$AC(t) {
    let e = sn.get(t.strings);
    return e === void 0 && sn.set(t.strings, e = new Ge(t)), e;
  }
  k(t) {
    Er(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const n of t) r === e.length ? e.push(i = new Be(this.O(Ne()), this.O(Ne()), this, this.options)) : i = e[r], i._$AI(n), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = Zr(t).nextSibling;
      Zr(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class li {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, n) {
    this.type = 1, this._$AH = dt, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = dt;
  }
  _$AI(t, e = this, i, r) {
    const n = this.strings;
    let s = !1;
    if (n === void 0) t = me(this, t, e, 0), s = !Le(t) || t !== this._$AH && t !== _e, s && (this._$AH = t);
    else {
      const o = t;
      let l, h;
      for (t = n[0], l = 0; l < n.length - 1; l++) h = me(this, o[i + l], e, l), h === _e && (h = this._$AH[l]), s || (s = !Le(h) || h !== this._$AH[l]), h === dt ? t = dt : t !== dt && (t += (h ?? "") + n[l + 1]), this._$AH[l] = h;
    }
    s && !r && this.j(t);
  }
  j(t) {
    t === dt ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ts extends li {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === dt ? void 0 : t;
  }
}
class es extends li {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== dt);
  }
}
class is extends li {
  constructor(t, e, i, r, n) {
    super(t, e, i, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = me(this, t, e, 0) ?? dt) === _e) return;
    const i = this._$AH, r = t === dt && i !== dt || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== dt && (i === dt || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class rs {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    me(this, t);
  }
}
const ir = De.litHtmlPolyfillSupport;
ir == null || ir(Ge, Be), (De.litHtmlVersions ?? (De.litHtmlVersions = [])).push("3.3.2");
const ns = (a, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = r = new Be(t.insertBefore(Ne(), n), n, void 0, e ?? {});
  }
  return r._$AI(a), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = globalThis;
class pe extends ge {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ns(e, this.renderRoot, this.renderOptions);
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
    return _e;
  }
}
var zn;
pe._$litElement$ = !0, pe.finalized = !0, (zn = Qt.litElementHydrateSupport) == null || zn.call(Qt, { LitElement: pe });
const rr = Qt.litElementPolyfillSupport;
rr == null || rr({ LitElement: pe });
(Qt.litElementVersions ?? (Qt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const as = { attribute: !0, type: String, converter: ii, reflect: !1, hasChanged: Pr }, ss = (a = as, t, e) => {
  const { kind: i, metadata: r } = e;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), i === "setter" && ((a = Object.create(a)).wrapped = !0), n.set(e.name, a), i === "accessor") {
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
function we(a) {
  return (t, e) => typeof e == "object" ? ss(a, t, e) : ((i, r, n) => {
    const s = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), s ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(a, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ut(a) {
  return we({ ...a, state: !0, attribute: !1 });
}
var on = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function os(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var Mr = { exports: {} }, hi = {}, Qn = {}, U = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a._registerNode = a.Konva = a.glob = void 0;
  const t = Math.PI / 180;
  function e() {
    return typeof window < "u" && ({}.toString.call(window) === "[object Window]" || {}.toString.call(window) === "[object global]");
  }
  a.glob = typeof on < "u" ? on : typeof window < "u" ? window : typeof WorkerGlobalScope < "u" ? self : {}, a.Konva = {
    _global: a.glob,
    version: "9.3.22",
    isBrowser: e(),
    isUnminified: /param/.test((function(r) {
    }).toString()),
    dblClickWindow: 400,
    getAngle(r) {
      return a.Konva.angleDeg ? r * t : r;
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
      var r;
      return (r = a.Konva.Transformer) === null || r === void 0 ? void 0 : r.isTransforming();
    },
    isDragReady() {
      return !!a.Konva.DD.node;
    },
    releaseCanvasOnDestroy: !0,
    document: a.glob.document,
    _injectGlobal(r) {
      a.glob.Konva = r;
    }
  };
  const i = (r) => {
    a.Konva[r.prototype.getClassName()] = r;
  };
  a._registerNode = i, a.Konva._injectGlobal(a.Konva);
})(U);
var at = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Util = a.Transform = void 0;
  const t = U;
  class e {
    constructor(g = [1, 0, 0, 1, 0, 0]) {
      this.dirty = !1, this.m = g && g.slice() || [1, 0, 0, 1, 0, 0];
    }
    reset() {
      this.m[0] = 1, this.m[1] = 0, this.m[2] = 0, this.m[3] = 1, this.m[4] = 0, this.m[5] = 0;
    }
    copy() {
      return new e(this.m);
    }
    copyInto(g) {
      g.m[0] = this.m[0], g.m[1] = this.m[1], g.m[2] = this.m[2], g.m[3] = this.m[3], g.m[4] = this.m[4], g.m[5] = this.m[5];
    }
    point(g) {
      const b = this.m;
      return {
        x: b[0] * g.x + b[2] * g.y + b[4],
        y: b[1] * g.x + b[3] * g.y + b[5]
      };
    }
    translate(g, b) {
      return this.m[4] += this.m[0] * g + this.m[2] * b, this.m[5] += this.m[1] * g + this.m[3] * b, this;
    }
    scale(g, b) {
      return this.m[0] *= g, this.m[1] *= g, this.m[2] *= b, this.m[3] *= b, this;
    }
    rotate(g) {
      const b = Math.cos(g), x = Math.sin(g), P = this.m[0] * b + this.m[2] * x, v = this.m[1] * b + this.m[3] * x, E = this.m[0] * -x + this.m[2] * b, k = this.m[1] * -x + this.m[3] * b;
      return this.m[0] = P, this.m[1] = v, this.m[2] = E, this.m[3] = k, this;
    }
    getTranslation() {
      return {
        x: this.m[4],
        y: this.m[5]
      };
    }
    skew(g, b) {
      const x = this.m[0] + this.m[2] * b, P = this.m[1] + this.m[3] * b, v = this.m[2] + this.m[0] * g, E = this.m[3] + this.m[1] * g;
      return this.m[0] = x, this.m[1] = P, this.m[2] = v, this.m[3] = E, this;
    }
    multiply(g) {
      const b = this.m[0] * g.m[0] + this.m[2] * g.m[1], x = this.m[1] * g.m[0] + this.m[3] * g.m[1], P = this.m[0] * g.m[2] + this.m[2] * g.m[3], v = this.m[1] * g.m[2] + this.m[3] * g.m[3], E = this.m[0] * g.m[4] + this.m[2] * g.m[5] + this.m[4], k = this.m[1] * g.m[4] + this.m[3] * g.m[5] + this.m[5];
      return this.m[0] = b, this.m[1] = x, this.m[2] = P, this.m[3] = v, this.m[4] = E, this.m[5] = k, this;
    }
    invert() {
      const g = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]), b = this.m[3] * g, x = -this.m[1] * g, P = -this.m[2] * g, v = this.m[0] * g, E = g * (this.m[2] * this.m[5] - this.m[3] * this.m[4]), k = g * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
      return this.m[0] = b, this.m[1] = x, this.m[2] = P, this.m[3] = v, this.m[4] = E, this.m[5] = k, this;
    }
    getMatrix() {
      return this.m;
    }
    decompose() {
      const g = this.m[0], b = this.m[1], x = this.m[2], P = this.m[3], v = this.m[4], E = this.m[5], k = g * P - b * x, M = {
        x: v,
        y: E,
        rotation: 0,
        scaleX: 0,
        scaleY: 0,
        skewX: 0,
        skewY: 0
      };
      if (g != 0 || b != 0) {
        const T = Math.sqrt(g * g + b * b);
        M.rotation = b > 0 ? Math.acos(g / T) : -Math.acos(g / T), M.scaleX = T, M.scaleY = k / T, M.skewX = (g * x + b * P) / k, M.skewY = 0;
      } else if (x != 0 || P != 0) {
        const T = Math.sqrt(x * x + P * P);
        M.rotation = Math.PI / 2 - (P > 0 ? Math.acos(-x / T) : -Math.acos(x / T)), M.scaleX = k / T, M.scaleY = T, M.skewX = 0, M.skewY = (g * x + b * P) / k;
      }
      return M.rotation = a.Util._getRotation(M.rotation), M;
    }
  }
  a.Transform = e;
  const i = "[object Array]", r = "[object Number]", n = "[object String]", s = "[object Boolean]", o = Math.PI / 180, l = 180 / Math.PI, h = "#", u = "", f = "0", p = "Konva warning: ", _ = "Konva error: ", c = "rgb(", y = {
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
  }, m = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
  let S = [];
  const w = typeof requestAnimationFrame < "u" && requestAnimationFrame || function(d) {
    setTimeout(d, 60);
  };
  a.Util = {
    _isElement(d) {
      return !!(d && d.nodeType == 1);
    },
    _isFunction(d) {
      return !!(d && d.constructor && d.call && d.apply);
    },
    _isPlainObject(d) {
      return !!d && d.constructor === Object;
    },
    _isArray(d) {
      return Object.prototype.toString.call(d) === i;
    },
    _isNumber(d) {
      return Object.prototype.toString.call(d) === r && !isNaN(d) && isFinite(d);
    },
    _isString(d) {
      return Object.prototype.toString.call(d) === n;
    },
    _isBoolean(d) {
      return Object.prototype.toString.call(d) === s;
    },
    isObject(d) {
      return d instanceof Object;
    },
    isValidSelector(d) {
      if (typeof d != "string")
        return !1;
      const g = d[0];
      return g === "#" || g === "." || g === g.toUpperCase();
    },
    _sign(d) {
      return d === 0 || d > 0 ? 1 : -1;
    },
    requestAnimFrame(d) {
      S.push(d), S.length === 1 && w(function() {
        const g = S;
        S = [], g.forEach(function(b) {
          b();
        });
      });
    },
    createCanvasElement() {
      const d = document.createElement("canvas");
      try {
        d.style = d.style || {};
      } catch {
      }
      return d;
    },
    createImageElement() {
      return document.createElement("img");
    },
    _isInDocument(d) {
      for (; d = d.parentNode; )
        if (d == document)
          return !0;
      return !1;
    },
    _urlToImage(d, g) {
      const b = a.Util.createImageElement();
      b.onload = function() {
        g(b);
      }, b.src = d;
    },
    _rgbToHex(d, g, b) {
      return ((1 << 24) + (d << 16) + (g << 8) + b).toString(16).slice(1);
    },
    _hexToRgb(d) {
      d = d.replace(h, u);
      const g = parseInt(d, 16);
      return {
        r: g >> 16 & 255,
        g: g >> 8 & 255,
        b: g & 255
      };
    },
    getRandomColor() {
      let d = (Math.random() * 16777215 << 0).toString(16);
      for (; d.length < 6; )
        d = f + d;
      return h + d;
    },
    getRGB(d) {
      let g;
      return d in y ? (g = y[d], {
        r: g[0],
        g: g[1],
        b: g[2]
      }) : d[0] === h ? this._hexToRgb(d.substring(1)) : d.substr(0, 4) === c ? (g = m.exec(d.replace(/ /g, "")), {
        r: parseInt(g[1], 10),
        g: parseInt(g[2], 10),
        b: parseInt(g[3], 10)
      }) : {
        r: 0,
        g: 0,
        b: 0
      };
    },
    colorToRGBA(d) {
      return d = d || "black", a.Util._namedColorToRBA(d) || a.Util._hex3ColorToRGBA(d) || a.Util._hex4ColorToRGBA(d) || a.Util._hex6ColorToRGBA(d) || a.Util._hex8ColorToRGBA(d) || a.Util._rgbColorToRGBA(d) || a.Util._rgbaColorToRGBA(d) || a.Util._hslColorToRGBA(d);
    },
    _namedColorToRBA(d) {
      const g = y[d.toLowerCase()];
      return g ? {
        r: g[0],
        g: g[1],
        b: g[2],
        a: 1
      } : null;
    },
    _rgbColorToRGBA(d) {
      if (d.indexOf("rgb(") === 0) {
        d = d.match(/rgb\(([^)]+)\)/)[1];
        const g = d.split(/ *, */).map(Number);
        return {
          r: g[0],
          g: g[1],
          b: g[2],
          a: 1
        };
      }
    },
    _rgbaColorToRGBA(d) {
      if (d.indexOf("rgba(") === 0) {
        d = d.match(/rgba\(([^)]+)\)/)[1];
        const g = d.split(/ *, */).map((b, x) => b.slice(-1) === "%" ? x === 3 ? parseInt(b) / 100 : parseInt(b) / 100 * 255 : Number(b));
        return {
          r: g[0],
          g: g[1],
          b: g[2],
          a: g[3]
        };
      }
    },
    _hex8ColorToRGBA(d) {
      if (d[0] === "#" && d.length === 9)
        return {
          r: parseInt(d.slice(1, 3), 16),
          g: parseInt(d.slice(3, 5), 16),
          b: parseInt(d.slice(5, 7), 16),
          a: parseInt(d.slice(7, 9), 16) / 255
        };
    },
    _hex6ColorToRGBA(d) {
      if (d[0] === "#" && d.length === 7)
        return {
          r: parseInt(d.slice(1, 3), 16),
          g: parseInt(d.slice(3, 5), 16),
          b: parseInt(d.slice(5, 7), 16),
          a: 1
        };
    },
    _hex4ColorToRGBA(d) {
      if (d[0] === "#" && d.length === 5)
        return {
          r: parseInt(d[1] + d[1], 16),
          g: parseInt(d[2] + d[2], 16),
          b: parseInt(d[3] + d[3], 16),
          a: parseInt(d[4] + d[4], 16) / 255
        };
    },
    _hex3ColorToRGBA(d) {
      if (d[0] === "#" && d.length === 4)
        return {
          r: parseInt(d[1] + d[1], 16),
          g: parseInt(d[2] + d[2], 16),
          b: parseInt(d[3] + d[3], 16),
          a: 1
        };
    },
    _hslColorToRGBA(d) {
      if (/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(d)) {
        const [g, ...b] = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(d), x = Number(b[0]) / 360, P = Number(b[1]) / 100, v = Number(b[2]) / 100;
        let E, k, M;
        if (P === 0)
          return M = v * 255, {
            r: Math.round(M),
            g: Math.round(M),
            b: Math.round(M),
            a: 1
          };
        v < 0.5 ? E = v * (1 + P) : E = v + P - v * P;
        const T = 2 * v - E, A = [0, 0, 0];
        for (let F = 0; F < 3; F++)
          k = x + 1 / 3 * -(F - 1), k < 0 && k++, k > 1 && k--, 6 * k < 1 ? M = T + (E - T) * 6 * k : 2 * k < 1 ? M = E : 3 * k < 2 ? M = T + (E - T) * (2 / 3 - k) * 6 : M = T, A[F] = M * 255;
        return {
          r: Math.round(A[0]),
          g: Math.round(A[1]),
          b: Math.round(A[2]),
          a: 1
        };
      }
    },
    haveIntersection(d, g) {
      return !(g.x > d.x + d.width || g.x + g.width < d.x || g.y > d.y + d.height || g.y + g.height < d.y);
    },
    cloneObject(d) {
      const g = {};
      for (const b in d)
        this._isPlainObject(d[b]) ? g[b] = this.cloneObject(d[b]) : this._isArray(d[b]) ? g[b] = this.cloneArray(d[b]) : g[b] = d[b];
      return g;
    },
    cloneArray(d) {
      return d.slice(0);
    },
    degToRad(d) {
      return d * o;
    },
    radToDeg(d) {
      return d * l;
    },
    _degToRad(d) {
      return a.Util.warn("Util._degToRad is removed. Please use public Util.degToRad instead."), a.Util.degToRad(d);
    },
    _radToDeg(d) {
      return a.Util.warn("Util._radToDeg is removed. Please use public Util.radToDeg instead."), a.Util.radToDeg(d);
    },
    _getRotation(d) {
      return t.Konva.angleDeg ? a.Util.radToDeg(d) : d;
    },
    _capitalize(d) {
      return d.charAt(0).toUpperCase() + d.slice(1);
    },
    throw(d) {
      throw new Error(_ + d);
    },
    error(d) {
    },
    warn(d) {
      t.Konva.showWarnings;
    },
    each(d, g) {
      for (const b in d)
        g(b, d[b]);
    },
    _inRange(d, g, b) {
      return g <= d && d < b;
    },
    _getProjectionToSegment(d, g, b, x, P, v) {
      let E, k, M;
      const T = (d - b) * (d - b) + (g - x) * (g - x);
      if (T == 0)
        E = d, k = g, M = (P - b) * (P - b) + (v - x) * (v - x);
      else {
        const A = ((P - d) * (b - d) + (v - g) * (x - g)) / T;
        A < 0 ? (E = d, k = g, M = (d - P) * (d - P) + (g - v) * (g - v)) : A > 1 ? (E = b, k = x, M = (b - P) * (b - P) + (x - v) * (x - v)) : (E = d + A * (b - d), k = g + A * (x - g), M = (E - P) * (E - P) + (k - v) * (k - v));
      }
      return [E, k, M];
    },
    _getProjectionToLine(d, g, b) {
      const x = a.Util.cloneObject(d);
      let P = Number.MAX_VALUE;
      return g.forEach(function(v, E) {
        if (!b && E === g.length - 1)
          return;
        const k = g[(E + 1) % g.length], M = a.Util._getProjectionToSegment(v.x, v.y, k.x, k.y, d.x, d.y), T = M[0], A = M[1], F = M[2];
        F < P && (x.x = T, x.y = A, P = F);
      }), x;
    },
    _prepareArrayForTween(d, g, b) {
      const x = [], P = [];
      if (d.length > g.length) {
        const E = g;
        g = d, d = E;
      }
      for (let E = 0; E < d.length; E += 2)
        x.push({
          x: d[E],
          y: d[E + 1]
        });
      for (let E = 0; E < g.length; E += 2)
        P.push({
          x: g[E],
          y: g[E + 1]
        });
      const v = [];
      return P.forEach(function(E) {
        const k = a.Util._getProjectionToLine(E, x, b);
        v.push(k.x), v.push(k.y);
      }), v;
    },
    _prepareToStringify(d) {
      let g;
      d.visitedByCircularReferenceRemoval = !0;
      for (const b in d)
        if (d.hasOwnProperty(b) && d[b] && typeof d[b] == "object") {
          if (g = Object.getOwnPropertyDescriptor(d, b), d[b].visitedByCircularReferenceRemoval || a.Util._isElement(d[b]))
            if (g.configurable)
              delete d[b];
            else
              return null;
          else if (a.Util._prepareToStringify(d[b]) === null)
            if (g.configurable)
              delete d[b];
            else
              return null;
        }
      return delete d.visitedByCircularReferenceRemoval, d;
    },
    _assign(d, g) {
      for (const b in g)
        d[b] = g[b];
      return d;
    },
    _getFirstPointerId(d) {
      return d.touches ? d.changedTouches[0].identifier : d.pointerId || 999;
    },
    releaseCanvas(...d) {
      t.Konva.releaseCanvasOnDestroy && d.forEach((g) => {
        g.width = 0, g.height = 0;
      });
    },
    drawRoundedRectPath(d, g, b, x) {
      let P = 0, v = 0, E = 0, k = 0;
      typeof x == "number" ? P = v = E = k = Math.min(x, g / 2, b / 2) : (P = Math.min(x[0] || 0, g / 2, b / 2), v = Math.min(x[1] || 0, g / 2, b / 2), k = Math.min(x[2] || 0, g / 2, b / 2), E = Math.min(x[3] || 0, g / 2, b / 2)), d.moveTo(P, 0), d.lineTo(g - v, 0), d.arc(g - v, v, v, Math.PI * 3 / 2, 0, !1), d.lineTo(g, b - k), d.arc(g - k, b - k, k, 0, Math.PI / 2, !1), d.lineTo(E, b), d.arc(E, b - E, E, Math.PI / 2, Math.PI, !1), d.lineTo(0, P), d.arc(P, P, P, Math.PI, Math.PI * 3 / 2, !1);
    }
  };
})(at);
var rt = {}, St = {}, Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.HitContext = Tt.SceneContext = Tt.Context = void 0;
const Jn = at, ls = U;
function hs(a) {
  const t = [], e = a.length, i = Jn.Util;
  for (let r = 0; r < e; r++) {
    let n = a[r];
    i._isNumber(n) ? n = Math.round(n * 1e3) / 1e3 : i._isString(n) || (n = n + ""), t.push(n);
  }
  return t;
}
const ln = ",", ds = "(", cs = ")", us = "([", fs = "])", gs = ";", ps = "()", _s = "=", hn = [
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
], ms = [
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
], ys = 100;
class di {
  constructor(t) {
    this.canvas = t, ls.Konva.enableTrace && (this.traceArr = [], this._enableTrace());
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
    let i = this.traceArr, r = i.length, n = "", s, o, l, h;
    for (s = 0; s < r; s++)
      o = i[s], l = o.method, l ? (h = o.args, n += l, t ? n += ps : Jn.Util._isArray(h[0]) ? n += us + h.join(ln) + fs : (e && (h = h.map((u) => typeof u == "number" ? Math.floor(u) : u)), n += ds + h.join(ln) + cs)) : (n += o.property, t || (n += _s + o.val)), n += gs;
    return n;
  }
  clearTrace() {
    this.traceArr = [];
  }
  _trace(t) {
    let e = this.traceArr, i;
    e.push(t), i = e.length, i >= ys && e.shift();
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
  arc(t, e, i, r, n, s) {
    this._context.arc(t, e, i, r, n, s);
  }
  arcTo(t, e, i, r, n) {
    this._context.arcTo(t, e, i, r, n);
  }
  beginPath() {
    this._context.beginPath();
  }
  bezierCurveTo(t, e, i, r, n, s) {
    this._context.bezierCurveTo(t, e, i, r, n, s);
  }
  clearRect(t, e, i, r) {
    this._context.clearRect(t, e, i, r);
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
  createLinearGradient(t, e, i, r) {
    return this._context.createLinearGradient(t, e, i, r);
  }
  createPattern(t, e) {
    return this._context.createPattern(t, e);
  }
  createRadialGradient(t, e, i, r, n, s) {
    return this._context.createRadialGradient(t, e, i, r, n, s);
  }
  drawImage(t, e, i, r, n, s, o, l, h) {
    const u = arguments, f = this._context;
    u.length === 3 ? f.drawImage(t, e, i) : u.length === 5 ? f.drawImage(t, e, i, r, n) : u.length === 9 && f.drawImage(t, e, i, r, n, s, o, l, h);
  }
  ellipse(t, e, i, r, n, s, o, l) {
    this._context.ellipse(t, e, i, r, n, s, o, l);
  }
  isPointInPath(t, e, i, r) {
    return i ? this._context.isPointInPath(i, t, e, r) : this._context.isPointInPath(t, e, r);
  }
  fill(...t) {
    this._context.fill.apply(this._context, t);
  }
  fillRect(t, e, i, r) {
    this._context.fillRect(t, e, i, r);
  }
  strokeRect(t, e, i, r) {
    this._context.strokeRect(t, e, i, r);
  }
  fillText(t, e, i, r) {
    r ? this._context.fillText(t, e, i, r) : this._context.fillText(t, e, i);
  }
  measureText(t) {
    return this._context.measureText(t);
  }
  getImageData(t, e, i, r) {
    return this._context.getImageData(t, e, i, r);
  }
  lineTo(t, e) {
    this._context.lineTo(t, e);
  }
  moveTo(t, e) {
    this._context.moveTo(t, e);
  }
  rect(t, e, i, r) {
    this._context.rect(t, e, i, r);
  }
  roundRect(t, e, i, r, n) {
    this._context.roundRect(t, e, i, r, n);
  }
  putImageData(t, e, i) {
    this._context.putImageData(t, e, i);
  }
  quadraticCurveTo(t, e, i, r) {
    this._context.quadraticCurveTo(t, e, i, r);
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
  setTransform(t, e, i, r, n, s) {
    this._context.setTransform(t, e, i, r, n, s);
  }
  stroke(t) {
    t ? this._context.stroke(t) : this._context.stroke();
  }
  strokeText(t, e, i, r) {
    this._context.strokeText(t, e, i, r);
  }
  transform(t, e, i, r, n, s) {
    this._context.transform(t, e, i, r, n, s);
  }
  translate(t, e) {
    this._context.translate(t, e);
  }
  _enableTrace() {
    let t = this, e = hn.length, i = this.setAttr, r, n;
    const s = function(o) {
      let l = t[o], h;
      t[o] = function() {
        return n = hs(Array.prototype.slice.call(arguments, 0)), h = l.apply(t, arguments), t._trace({
          method: o,
          args: n
        }), h;
      };
    };
    for (r = 0; r < e; r++)
      s(hn[r]);
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
Tt.Context = di;
ms.forEach(function(a) {
  Object.defineProperty(di.prototype, a, {
    get() {
      return this._context[a];
    },
    set(t) {
      this._context[a] = t;
    }
  });
});
class bs extends di {
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
    const r = t.getFillPatternImage();
    if (r && i === "pattern") {
      this._fillPattern(t);
      return;
    }
    const n = t.getFillLinearGradientColorStops();
    if (n && i === "linear-gradient") {
      this._fillLinearGradient(t);
      return;
    }
    const s = t.getFillRadialGradientColorStops();
    if (s && i === "radial-gradient") {
      this._fillRadialGradient(t);
      return;
    }
    e ? this._fillColor(t) : r ? this._fillPattern(t) : n ? this._fillLinearGradient(t) : s && this._fillRadialGradient(t);
  }
  _strokeLinearGradient(t) {
    const e = t.getStrokeLinearGradientStartPoint(), i = t.getStrokeLinearGradientEndPoint(), r = t.getStrokeLinearGradientColorStops(), n = this.createLinearGradient(e.x, e.y, i.x, i.y);
    if (r) {
      for (let s = 0; s < r.length; s += 2)
        n.addColorStop(r[s], r[s + 1]);
      this.setAttr("strokeStyle", n);
    }
  }
  _stroke(t) {
    const e = t.dash(), i = t.getStrokeScaleEnabled();
    if (t.hasStroke()) {
      if (!i) {
        this.save();
        const n = this.getCanvas().getPixelRatio();
        this.setTransform(n, 0, 0, n, 0, 0);
      }
      this._applyLineCap(t), e && t.dashEnabled() && (this.setLineDash(e), this.setAttr("lineDashOffset", t.dashOffset())), this.setAttr("lineWidth", t.strokeWidth()), t.getShadowForStrokeEnabled() || this.setAttr("shadowColor", "rgba(0,0,0,0)"), t.getStrokeLinearGradientColorStops() ? this._strokeLinearGradient(t) : this.setAttr("strokeStyle", t.stroke()), t._strokeFunc(this), i || this.restore();
    }
  }
  _applyShadow(t) {
    var e, i, r;
    const n = (e = t.getShadowRGBA()) !== null && e !== void 0 ? e : "black", s = (i = t.getShadowBlur()) !== null && i !== void 0 ? i : 5, o = (r = t.getShadowOffset()) !== null && r !== void 0 ? r : {
      x: 0,
      y: 0
    }, l = t.getAbsoluteScale(), h = this.canvas.getPixelRatio(), u = l.x * h, f = l.y * h;
    this.setAttr("shadowColor", n), this.setAttr("shadowBlur", s * Math.min(Math.abs(u), Math.abs(f))), this.setAttr("shadowOffsetX", o.x * u), this.setAttr("shadowOffsetY", o.y * f);
  }
}
Tt.SceneContext = bs;
class vs extends di {
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
        const n = this.getCanvas().getPixelRatio();
        this.setTransform(n, 0, 0, n, 0, 0);
      }
      this._applyLineCap(t);
      const i = t.hitStrokeWidth(), r = i === "auto" ? t.strokeWidth() : i;
      this.setAttr("lineWidth", r), this.setAttr("strokeStyle", t.colorKey), t._strokeFuncHit(this), e || this.restore();
    }
  }
}
Tt.HitContext = vs;
Object.defineProperty(St, "__esModule", { value: !0 });
St.HitCanvas = St.SceneCanvas = St.Canvas = void 0;
const ni = at, Zn = Tt, ta = U;
let Ye;
function Ss() {
  if (Ye)
    return Ye;
  const a = ni.Util.createCanvasElement(), t = a.getContext("2d");
  return Ye = function() {
    const e = ta.Konva._global.devicePixelRatio || 1, i = t.webkitBackingStorePixelRatio || t.mozBackingStorePixelRatio || t.msBackingStorePixelRatio || t.oBackingStorePixelRatio || t.backingStorePixelRatio || 1;
    return e / i;
  }(), ni.Util.releaseCanvas(a), Ye;
}
class Tr {
  constructor(t) {
    this.pixelRatio = 1, this.width = 0, this.height = 0, this.isCache = !1;
    const i = (t || {}).pixelRatio || ta.Konva.pixelRatio || Ss();
    this.pixelRatio = i, this._canvas = ni.Util.createCanvasElement(), this._canvas.style.padding = "0", this._canvas.style.margin = "0", this._canvas.style.border = "0", this._canvas.style.background = "transparent", this._canvas.style.position = "absolute", this._canvas.style.top = "0", this._canvas.style.left = "0";
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
      } catch (r) {
        return ni.Util.error("Unable to get data URL. " + r.message + " For more info read https://konvajs.org/docs/posts/Tainted_Canvas.html."), "";
      }
    }
  }
}
St.Canvas = Tr;
class ws extends Tr {
  constructor(t = { width: 0, height: 0, willReadFrequently: !1 }) {
    super(t), this.context = new Zn.SceneContext(this, {
      willReadFrequently: t.willReadFrequently
    }), this.setSize(t.width, t.height);
  }
}
St.SceneCanvas = ws;
class Cs extends Tr {
  constructor(t = { width: 0, height: 0 }) {
    super(t), this.hitCanvas = !0, this.context = new Zn.HitContext(this), this.setSize(t.width, t.height);
  }
}
St.HitCanvas = Cs;
var ci = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.DD = void 0;
  const t = U, e = at;
  a.DD = {
    get isDragging() {
      let i = !1;
      return a.DD._dragElements.forEach((r) => {
        r.dragStatus === "dragging" && (i = !0);
      }), i;
    },
    justDragged: !1,
    get node() {
      let i;
      return a.DD._dragElements.forEach((r) => {
        i = r.node;
      }), i;
    },
    _dragElements: /* @__PURE__ */ new Map(),
    _drag(i) {
      const r = [];
      a.DD._dragElements.forEach((n, s) => {
        const { node: o } = n, l = o.getStage();
        l.setPointersPositions(i), n.pointerId === void 0 && (n.pointerId = e.Util._getFirstPointerId(i));
        const h = l._changedPointerPositions.find((u) => u.id === n.pointerId);
        if (h) {
          if (n.dragStatus !== "dragging") {
            const u = o.dragDistance();
            if (Math.max(Math.abs(h.x - n.startPointerPos.x), Math.abs(h.y - n.startPointerPos.y)) < u || (o.startDrag({ evt: i }), !o.isDragging()))
              return;
          }
          o._setDragPosition(i, n), r.push(o);
        }
      }), r.forEach((n) => {
        n.fire("dragmove", {
          type: "dragmove",
          target: n,
          evt: i
        }, !0);
      });
    },
    _endDragBefore(i) {
      const r = [];
      a.DD._dragElements.forEach((n) => {
        const { node: s } = n, o = s.getStage();
        if (i && o.setPointersPositions(i), !o._changedPointerPositions.find((u) => u.id === n.pointerId))
          return;
        (n.dragStatus === "dragging" || n.dragStatus === "stopped") && (a.DD.justDragged = !0, t.Konva._mouseListenClick = !1, t.Konva._touchListenClick = !1, t.Konva._pointerListenClick = !1, n.dragStatus = "stopped");
        const h = n.node.getLayer() || n.node instanceof t.Konva.Stage && n.node;
        h && r.indexOf(h) === -1 && r.push(h);
      }), r.forEach((n) => {
        n.draw();
      });
    },
    _endDragAfter(i) {
      a.DD._dragElements.forEach((r, n) => {
        r.dragStatus === "stopped" && r.node.fire("dragend", {
          type: "dragend",
          target: r.node,
          evt: i
        }, !0), r.dragStatus !== "dragging" && a.DD._dragElements.delete(n);
      });
    }
  }, t.Konva.isBrowser && (window.addEventListener("mouseup", a.DD._endDragBefore, !0), window.addEventListener("touchend", a.DD._endDragBefore, !0), window.addEventListener("touchcancel", a.DD._endDragBefore, !0), window.addEventListener("mousemove", a.DD._drag), window.addEventListener("touchmove", a.DD._drag), window.addEventListener("mouseup", a.DD._endDragAfter, !1), window.addEventListener("touchend", a.DD._endDragAfter, !1), window.addEventListener("touchcancel", a.DD._endDragAfter, !1));
})(ci);
var B = {}, L = {};
Object.defineProperty(L, "__esModule", { value: !0 });
L.RGBComponent = xs;
L.alphaComponent = ks;
L.getNumberValidator = As;
L.getNumberOrArrayOfNumbersValidator = Ps;
L.getNumberOrAutoValidator = Es;
L.getStringValidator = Ms;
L.getStringOrGradientValidator = Ts;
L.getFunctionValidator = Rs;
L.getNumberArrayValidator = $s;
L.getBooleanValidator = Fs;
L.getComponentValidator = Os;
const Rt = U, st = at;
function $t(a) {
  return st.Util._isString(a) ? '"' + a + '"' : Object.prototype.toString.call(a) === "[object Number]" || st.Util._isBoolean(a) ? a : Object.prototype.toString.call(a);
}
function xs(a) {
  return a > 255 ? 255 : a < 0 ? 0 : Math.round(a);
}
function ks(a) {
  return a > 1 ? 1 : a < 1e-4 ? 1e-4 : a;
}
function As() {
  if (Rt.Konva.isUnminified)
    return function(a, t) {
      return st.Util._isNumber(a) || st.Util.warn($t(a) + ' is a not valid value for "' + t + '" attribute. The value should be a number.'), a;
    };
}
function Ps(a) {
  if (Rt.Konva.isUnminified)
    return function(t, e) {
      let i = st.Util._isNumber(t), r = st.Util._isArray(t) && t.length == a;
      return !i && !r && st.Util.warn($t(t) + ' is a not valid value for "' + e + '" attribute. The value should be a number or Array<number>(' + a + ")"), t;
    };
}
function Es() {
  if (Rt.Konva.isUnminified)
    return function(a, t) {
      return st.Util._isNumber(a) || a === "auto" || st.Util.warn($t(a) + ' is a not valid value for "' + t + '" attribute. The value should be a number or "auto".'), a;
    };
}
function Ms() {
  if (Rt.Konva.isUnminified)
    return function(a, t) {
      return st.Util._isString(a) || st.Util.warn($t(a) + ' is a not valid value for "' + t + '" attribute. The value should be a string.'), a;
    };
}
function Ts() {
  if (Rt.Konva.isUnminified)
    return function(a, t) {
      const e = st.Util._isString(a), i = Object.prototype.toString.call(a) === "[object CanvasGradient]" || a && a.addColorStop;
      return e || i || st.Util.warn($t(a) + ' is a not valid value for "' + t + '" attribute. The value should be a string or a native gradient.'), a;
    };
}
function Rs() {
  if (Rt.Konva.isUnminified)
    return function(a, t) {
      return st.Util._isFunction(a) || st.Util.warn($t(a) + ' is a not valid value for "' + t + '" attribute. The value should be a function.'), a;
    };
}
function $s() {
  if (Rt.Konva.isUnminified)
    return function(a, t) {
      const e = Int8Array ? Object.getPrototypeOf(Int8Array) : null;
      return e && a instanceof e || (st.Util._isArray(a) ? a.forEach(function(i) {
        st.Util._isNumber(i) || st.Util.warn('"' + t + '" attribute has non numeric element ' + i + ". Make sure that all elements are numbers.");
      }) : st.Util.warn($t(a) + ' is a not valid value for "' + t + '" attribute. The value should be a array of numbers.')), a;
    };
}
function Fs() {
  if (Rt.Konva.isUnminified)
    return function(a, t) {
      return a === !0 || a === !1 || st.Util.warn($t(a) + ' is a not valid value for "' + t + '" attribute. The value should be a boolean.'), a;
    };
}
function Os(a) {
  if (Rt.Konva.isUnminified)
    return function(t, e) {
      return t == null || st.Util.isObject(t) || st.Util.warn($t(t) + ' is a not valid value for "' + e + '" attribute. The value should be an object with properties ' + a), t;
    };
}
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Factory = void 0;
  const t = at, e = L, i = "get", r = "set";
  a.Factory = {
    addGetterSetter(n, s, o, l, h) {
      a.Factory.addGetter(n, s, o), a.Factory.addSetter(n, s, l, h), a.Factory.addOverloadedGetterSetter(n, s);
    },
    addGetter(n, s, o) {
      const l = i + t.Util._capitalize(s);
      n.prototype[l] = n.prototype[l] || function() {
        const h = this.attrs[s];
        return h === void 0 ? o : h;
      };
    },
    addSetter(n, s, o, l) {
      const h = r + t.Util._capitalize(s);
      n.prototype[h] || a.Factory.overWriteSetter(n, s, o, l);
    },
    overWriteSetter(n, s, o, l) {
      const h = r + t.Util._capitalize(s);
      n.prototype[h] = function(u) {
        return o && u !== void 0 && u !== null && (u = o.call(this, u, s)), this._setAttr(s, u), l && l.call(this), this;
      };
    },
    addComponentsGetterSetter(n, s, o, l, h) {
      const u = o.length, f = t.Util._capitalize, p = i + f(s), _ = r + f(s);
      n.prototype[p] = function() {
        const y = {};
        for (let m = 0; m < u; m++) {
          const S = o[m];
          y[S] = this.getAttr(s + f(S));
        }
        return y;
      };
      const c = (0, e.getComponentValidator)(o);
      n.prototype[_] = function(y) {
        const m = this.attrs[s];
        l && (y = l.call(this, y, s)), c && c.call(this, y, s);
        for (const S in y)
          y.hasOwnProperty(S) && this._setAttr(s + f(S), y[S]);
        return y || o.forEach((S) => {
          this._setAttr(s + f(S), void 0);
        }), this._fireChangeEvent(s, m, y), h && h.call(this), this;
      }, a.Factory.addOverloadedGetterSetter(n, s);
    },
    addOverloadedGetterSetter(n, s) {
      const o = t.Util._capitalize(s), l = r + o, h = i + o;
      n.prototype[s] = function() {
        return arguments.length ? (this[l](arguments[0]), this) : this[h]();
      };
    },
    addDeprecatedGetterSetter(n, s, o, l) {
      t.Util.error("Adding deprecated " + s);
      const h = i + t.Util._capitalize(s), u = s + " property is deprecated and will be removed soon. Look at Konva change log for more information.";
      n.prototype[h] = function() {
        t.Util.error(u);
        const f = this.attrs[s];
        return f === void 0 ? o : f;
      }, a.Factory.addSetter(n, s, l, function() {
        t.Util.error(u);
      }), a.Factory.addOverloadedGetterSetter(n, s);
    },
    backCompat(n, s) {
      t.Util.each(s, function(o, l) {
        const h = n.prototype[l], u = i + t.Util._capitalize(o), f = r + t.Util._capitalize(o);
        function p() {
          h.apply(this, arguments), t.Util.error('"' + o + '" method is deprecated and will be removed soon. Use ""' + l + '" instead.');
        }
        n.prototype[o] = p, n.prototype[u] = p, n.prototype[f] = p;
      });
    },
    afterSetFilter() {
      this._filterUpToDate = !1;
    }
  };
})(B);
Object.defineProperty(rt, "__esModule", { value: !0 });
rt.Node = void 0;
const de = St, bt = ci, Ve = B, Nt = U, V = at, ct = L, ti = "absoluteOpacity", Ke = "allEventListeners", Mt = "absoluteTransform", dn = "absoluteScale", Kt = "canvas", Ds = "Change", Ns = "children", Ls = "konva", pr = "listening", Gs = "mouseenter", Is = "mouseleave", Us = "pointerenter", Bs = "pointerleave", Vs = "touchenter", Hs = "touchleave", cn = "set", un = "Shape", ei = " ", fn = "stage", Lt = "transform", zs = "Stage", _r = "visible", Ws = [
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
].join(ei);
let js = 1;
class G {
  constructor(t) {
    this._id = js++, this.eventListeners = {}, this.attrs = {}, this.index = 0, this._allEventListeners = null, this.parent = null, this._cache = /* @__PURE__ */ new Map(), this._attachedDepsListeners = /* @__PURE__ */ new Map(), this._lastPos = null, this._batchingTransformChange = !1, this._needClearTransformCache = !1, this._filterUpToDate = !1, this._isUnderCache = !1, this._dragEventId = null, this._shouldFireChangeEvents = !1, this.setAttrs(t), this._shouldFireChangeEvents = !0;
  }
  hasChildren() {
    return !1;
  }
  _clearCache(t) {
    (t === Lt || t === Mt) && this._cache.get(t) ? this._cache.get(t).dirty = !0 : t ? this._cache.delete(t) : this._cache.clear();
  }
  _getCache(t, e) {
    let i = this._cache.get(t);
    return (i === void 0 || (t === Lt || t === Mt) && i.dirty === !0) && (i = e.call(this), this._cache.set(t, i)), i;
  }
  _calculate(t, e, i) {
    if (!this._attachedDepsListeners.get(t)) {
      const r = e.map((n) => n + "Change.konva").join(ei);
      this.on(r, () => {
        this._clearCache(t);
      }), this._attachedDepsListeners.set(t, !0);
    }
    return this._getCache(t, i);
  }
  _getCanvasCache() {
    return this._cache.get(Kt);
  }
  _clearSelfAndDescendantCache(t) {
    this._clearCache(t), t === Mt && this.fire("absoluteTransformChange");
  }
  clearCache() {
    if (this._cache.has(Kt)) {
      const { scene: t, filter: e, hit: i, buffer: r } = this._cache.get(Kt);
      V.Util.releaseCanvas(t, e, i, r), this._cache.delete(Kt);
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
    let r = Math.ceil(e.width || i.width), n = Math.ceil(e.height || i.height), s = e.pixelRatio, o = e.x === void 0 ? Math.floor(i.x) : e.x, l = e.y === void 0 ? Math.floor(i.y) : e.y, h = e.offset || 0, u = e.drawBorder || !1, f = e.hitCanvasPixelRatio || 1;
    if (!r || !n) {
      V.Util.error("Can not cache the node. Width or height of the node equals 0. Caching is skipped.");
      return;
    }
    const p = Math.abs(Math.round(i.x) - o) > 0.5 ? 1 : 0, _ = Math.abs(Math.round(i.y) - l) > 0.5 ? 1 : 0;
    r += h * 2 + p, n += h * 2 + _, o -= h, l -= h;
    const c = new de.SceneCanvas({
      pixelRatio: s,
      width: r,
      height: n
    }), y = new de.SceneCanvas({
      pixelRatio: s,
      width: 0,
      height: 0,
      willReadFrequently: !0
    }), m = new de.HitCanvas({
      pixelRatio: f,
      width: r,
      height: n
    }), S = c.getContext(), w = m.getContext(), d = new de.SceneCanvas({
      width: c.width / c.pixelRatio + Math.abs(o),
      height: c.height / c.pixelRatio + Math.abs(l),
      pixelRatio: c.pixelRatio
    }), g = d.getContext();
    return m.isCache = !0, c.isCache = !0, this._cache.delete(Kt), this._filterUpToDate = !1, e.imageSmoothingEnabled === !1 && (c.getContext()._context.imageSmoothingEnabled = !1, y.getContext()._context.imageSmoothingEnabled = !1), S.save(), w.save(), g.save(), S.translate(-o, -l), w.translate(-o, -l), g.translate(-o, -l), d.x = o, d.y = l, this._isUnderCache = !0, this._clearSelfAndDescendantCache(ti), this._clearSelfAndDescendantCache(dn), this.drawScene(c, this, d), this.drawHit(m, this), this._isUnderCache = !1, S.restore(), w.restore(), u && (S.save(), S.beginPath(), S.rect(0, 0, r, n), S.closePath(), S.setAttr("strokeStyle", "red"), S.setAttr("lineWidth", 5), S.stroke(), S.restore()), this._cache.set(Kt, {
      scene: c,
      filter: y,
      hit: m,
      buffer: d,
      x: o,
      y: l
    }), this._requestDraw(), this;
  }
  isCached() {
    return this._cache.has(Kt);
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
    let r = 1 / 0, n = 1 / 0, s = -1 / 0, o = -1 / 0;
    const l = this.getAbsoluteTransform(e);
    return i.forEach(function(h) {
      const u = l.point(h);
      r === void 0 && (r = s = u.x, n = o = u.y), r = Math.min(r, u.x), n = Math.min(n, u.y), s = Math.max(s, u.x), o = Math.max(o, u.y);
    }), {
      x: r,
      y: n,
      width: s - r,
      height: o - n
    };
  }
  _drawCachedSceneCanvas(t) {
    t.save(), t._applyOpacity(this), t._applyGlobalCompositeOperation(this);
    const e = this._getCanvasCache();
    t.translate(e.x, e.y);
    const i = this._getCachedSceneCanvas(), r = i.pixelRatio;
    t.drawImage(i._canvas, 0, 0, i.width / r, i.height / r), t.restore();
  }
  _drawCachedHitCanvas(t) {
    const e = this._getCanvasCache(), i = e.hit;
    t.save(), t.translate(e.x, e.y), t.drawImage(i._canvas, 0, 0, i.width / i.pixelRatio, i.height / i.pixelRatio), t.restore();
  }
  _getCachedSceneCanvas() {
    let t = this.filters(), e = this._getCanvasCache(), i = e.scene, r = e.filter, n = r.getContext(), s, o, l, h;
    if (t) {
      if (!this._filterUpToDate) {
        const u = i.pixelRatio;
        r.setSize(i.width / i.pixelRatio, i.height / i.pixelRatio);
        try {
          for (s = t.length, n.clear(), n.drawImage(i._canvas, 0, 0, i.getWidth() / u, i.getHeight() / u), o = n.getImageData(0, 0, r.getWidth(), r.getHeight()), l = 0; l < s; l++) {
            if (h = t[l], typeof h != "function") {
              V.Util.error("Filter should be type of function, but got " + typeof h + " instead. Please check correct filters");
              continue;
            }
            h.call(this, o), n.putImageData(o, 0, 0);
          }
        } catch (f) {
          V.Util.error("Unable to apply filter. " + f.message + " This post my help you https://konvajs.org/docs/posts/Tainted_Canvas.html.");
        }
        this._filterUpToDate = !0;
      }
      return r;
    }
    return i;
  }
  on(t, e) {
    if (this._cache && this._cache.delete(Ke), arguments.length === 3)
      return this._delegate.apply(this, arguments);
    const i = t.split(ei);
    for (let r = 0; r < i.length; r++) {
      const s = i[r].split("."), o = s[0], l = s[1] || "";
      this.eventListeners[o] || (this.eventListeners[o] = []), this.eventListeners[o].push({ name: l, handler: e });
    }
    return this;
  }
  off(t, e) {
    let i = (t || "").split(ei), r = i.length, n, s, o, l, h, u;
    if (this._cache && this._cache.delete(Ke), !t)
      for (s in this.eventListeners)
        this._off(s);
    for (n = 0; n < r; n++)
      if (o = i[n], l = o.split("."), h = l[0], u = l[1], h)
        this.eventListeners[h] && this._off(h, u, e);
      else
        for (s in this.eventListeners)
          this._off(s, u, e);
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
    const r = this;
    this.on(t, function(n) {
      const s = n.target.findAncestors(e, !0, r);
      for (let o = 0; o < s.length; o++)
        n = V.Util.cloneObject(n), n.currentTarget = s[o], i.call(s[o], n);
    });
  }
  remove() {
    return this.isDragging() && this.stopDrag(), bt.DD._dragElements.delete(this._id), this._remove(), this;
  }
  _clearCaches() {
    this._clearSelfAndDescendantCache(Mt), this._clearSelfAndDescendantCache(ti), this._clearSelfAndDescendantCache(dn), this._clearSelfAndDescendantCache(fn), this._clearSelfAndDescendantCache(_r), this._clearSelfAndDescendantCache(pr);
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
    const e = "get" + V.Util._capitalize(t);
    return V.Util._isFunction(this[e]) ? this[e]() : this.attrs[t];
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
        e !== Ns && (i = cn + V.Util._capitalize(e), V.Util._isFunction(this[i]) ? this[i](t[e]) : this._setAttr(e, t[e]));
    }), this;
  }
  isListening() {
    return this._getCache(pr, this._isListening);
  }
  _isListening(t) {
    if (!this.listening())
      return !1;
    const i = this.getParent();
    return i && i !== t && this !== t ? i._isListening(t) : !0;
  }
  isVisible() {
    return this._getCache(_r, this._isVisible);
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
    let r = !1;
    bt.DD._dragElements.forEach((s) => {
      s.dragStatus === "dragging" && (s.node.nodeType === "Stage" || s.node.getLayer() === i) && (r = !0);
    });
    const n = !e && !Nt.Konva.hitOnDragEnabled && (r || Nt.Konva.isTransforming());
    return this.isListening() && this.isVisible() && !n;
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
    let t = this.getDepth(), e = this, i = 0, r, n, s, o;
    function l(u) {
      for (r = [], n = u.length, s = 0; s < n; s++)
        o = u[s], i++, o.nodeType !== un && (r = r.concat(o.getChildren().slice())), o._id === e._id && (s = n);
      r.length > 0 && r[0].getDepth() <= t && l(r);
    }
    const h = this.getStage();
    return e.nodeType !== zs && h && l(h.getChildren()), i;
  }
  getDepth() {
    let t = 0, e = this.parent;
    for (; e; )
      t++, e = e.parent;
    return t;
  }
  _batchTransformChanges(t) {
    this._batchingTransformChange = !0, t(), this._batchingTransformChange = !1, this._needClearTransformCache && (this._clearCache(Lt), this._clearSelfAndDescendantCache(Mt)), this._needClearTransformCache = !1;
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
    const r = this.getAbsoluteTransform(t).getMatrix(), n = new V.Transform(), s = this.offset();
    return n.m = r.slice(), n.translate(s.x, s.y), n.getTranslation();
  }
  setAbsolutePosition(t) {
    const { x: e, y: i, ...r } = this._clearTransform();
    this.attrs.x = e, this.attrs.y = i, this._clearCache(Lt);
    const n = this._getAbsoluteTransform().copy();
    return n.invert(), n.translate(t.x, t.y), t = {
      x: this.attrs.x + n.getTranslation().x,
      y: this.attrs.y + n.getTranslation().y
    }, this._setTransform(r), this.setPosition({ x: t.x, y: t.y }), this._clearCache(Lt), this._clearSelfAndDescendantCache(Mt), this;
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
    let e = t.x, i = t.y, r = this.x(), n = this.y();
    return e !== void 0 && (r += e), i !== void 0 && (n += i), this.setPosition({ x: r, y: n }), this;
  }
  _eachAncestorReverse(t, e) {
    let i = [], r = this.getParent(), n, s;
    if (!(e && e._id === this._id)) {
      for (i.unshift(this); r && (!e || r._id !== e._id); )
        i.unshift(r), r = r.parent;
      for (n = i.length, s = 0; s < n; s++)
        t(i[s]);
    }
  }
  rotate(t) {
    return this.rotation(this.rotation() + t), this;
  }
  moveToTop() {
    if (!this.parent)
      return V.Util.warn("Node has no parent. moveToTop function is ignored."), !1;
    const t = this.index, e = this.parent.getChildren().length;
    return t < e - 1 ? (this.parent.children.splice(t, 1), this.parent.children.push(this), this.parent._setChildrenIndices(), !0) : !1;
  }
  moveUp() {
    if (!this.parent)
      return V.Util.warn("Node has no parent. moveUp function is ignored."), !1;
    const t = this.index, e = this.parent.getChildren().length;
    return t < e - 1 ? (this.parent.children.splice(t, 1), this.parent.children.splice(t + 1, 0, this), this.parent._setChildrenIndices(), !0) : !1;
  }
  moveDown() {
    if (!this.parent)
      return V.Util.warn("Node has no parent. moveDown function is ignored."), !1;
    const t = this.index;
    return t > 0 ? (this.parent.children.splice(t, 1), this.parent.children.splice(t - 1, 0, this), this.parent._setChildrenIndices(), !0) : !1;
  }
  moveToBottom() {
    if (!this.parent)
      return V.Util.warn("Node has no parent. moveToBottom function is ignored."), !1;
    const t = this.index;
    return t > 0 ? (this.parent.children.splice(t, 1), this.parent.children.unshift(this), this.parent._setChildrenIndices(), !0) : !1;
  }
  setZIndex(t) {
    if (!this.parent)
      return V.Util.warn("Node has no parent. zIndex parameter is ignored."), this;
    (t < 0 || t >= this.parent.children.length) && V.Util.warn("Unexpected value " + t + " for zIndex property. zIndex is just index of a node in children of its parent. Expected value is from 0 to " + (this.parent.children.length - 1) + ".");
    const e = this.index;
    return this.parent.children.splice(e, 1), this.parent.children.splice(t, 0, this), this.parent._setChildrenIndices(), this;
  }
  getAbsoluteOpacity() {
    return this._getCache(ti, this._getAbsoluteOpacity);
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
    let t = this.getAttrs(), e, i, r, n, s;
    const o = {
      attrs: {},
      className: this.getClassName()
    };
    for (e in t)
      i = t[e], s = V.Util.isObject(i) && !V.Util._isPlainObject(i) && !V.Util._isArray(i), !s && (r = typeof this[e] == "function" && this[e], delete t[e], n = r ? r.call(this) : null, t[e] = i, n !== i && (o.attrs[e] = i));
    return V.Util._prepareToStringify(o);
  }
  toJSON() {
    return JSON.stringify(this.toObject());
  }
  getParent() {
    return this.parent;
  }
  findAncestors(t, e, i) {
    const r = [];
    e && this._isMatch(t) && r.push(this);
    let n = this.parent;
    for (; n; ) {
      if (n === i)
        return r;
      n._isMatch(t) && r.push(n), n = n.parent;
    }
    return r;
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
    let e = t.replace(/ /g, "").split(","), i = e.length, r, n;
    for (r = 0; r < i; r++)
      if (n = e[r], V.Util.isValidSelector(n) || (V.Util.warn('Selector "' + n + '" is invalid. Allowed selectors examples are "#foo", ".bar" or "Group".'), V.Util.warn('If you have a custom shape with such className, please change it to start with upper letter like "Triangle".'), V.Util.warn("Konva is awesome, right?")), n.charAt(0) === "#") {
        if (this.id() === n.slice(1))
          return !0;
      } else if (n.charAt(0) === ".") {
        if (this.hasName(n.slice(1)))
          return !0;
      } else if (this.className === n || this.nodeType === n)
        return !0;
    return !1;
  }
  getLayer() {
    const t = this.getParent();
    return t ? t.getLayer() : null;
  }
  getStage() {
    return this._getCache(fn, this._getStage);
  }
  _getStage() {
    const t = this.getParent();
    return t ? t.getStage() : null;
  }
  fire(t, e = {}, i) {
    return e.target = e.target || this, i ? this._fireAndBubble(t, e) : this._fire(t, e), this;
  }
  getAbsoluteTransform(t) {
    return t ? this._getAbsoluteTransform(t) : this._getCache(Mt, this._getAbsoluteTransform);
  }
  _getAbsoluteTransform(t) {
    let e;
    if (t)
      return e = new V.Transform(), this._eachAncestorReverse(function(i) {
        const r = i.transformsEnabled();
        r === "all" ? e.multiply(i.getTransform()) : r === "position" && e.translate(i.x() - i.offsetX(), i.y() - i.offsetY());
      }, t), e;
    {
      e = this._cache.get(Mt) || new V.Transform(), this.parent ? this.parent.getAbsoluteTransform().copyInto(e) : e.reset();
      const i = this.transformsEnabled();
      if (i === "all")
        e.multiply(this.getTransform());
      else if (i === "position") {
        const r = this.attrs.x || 0, n = this.attrs.y || 0, s = this.attrs.offsetX || 0, o = this.attrs.offsetY || 0;
        e.translate(r - s, n - o);
      }
      return e.dirty = !1, e;
    }
  }
  getAbsoluteScale(t) {
    let e = this;
    for (; e; )
      e._isUnderCache && (t = e), e = e.getParent();
    const r = this.getAbsoluteTransform(t).decompose();
    return {
      x: r.scaleX,
      y: r.scaleY
    };
  }
  getAbsoluteRotation() {
    return this.getAbsoluteTransform().decompose().rotation;
  }
  getTransform() {
    return this._getCache(Lt, this._getTransform);
  }
  _getTransform() {
    var t, e;
    const i = this._cache.get(Lt) || new V.Transform();
    i.reset();
    const r = this.x(), n = this.y(), s = Nt.Konva.getAngle(this.rotation()), o = (t = this.attrs.scaleX) !== null && t !== void 0 ? t : 1, l = (e = this.attrs.scaleY) !== null && e !== void 0 ? e : 1, h = this.attrs.skewX || 0, u = this.attrs.skewY || 0, f = this.attrs.offsetX || 0, p = this.attrs.offsetY || 0;
    return (r !== 0 || n !== 0) && i.translate(r, n), s !== 0 && i.rotate(s), (h !== 0 || u !== 0) && i.skew(h, u), (o !== 1 || l !== 1) && i.scale(o, l), (f !== 0 || p !== 0) && i.translate(-1 * f, -1 * p), i.dirty = !1, i;
  }
  clone(t) {
    let e = V.Util.cloneObject(this.attrs), i, r, n, s, o;
    for (i in t)
      e[i] = t[i];
    const l = new this.constructor(e);
    for (i in this.eventListeners)
      for (r = this.eventListeners[i], n = r.length, s = 0; s < n; s++)
        o = r[s], o.name.indexOf(Ls) < 0 && (l.eventListeners[i] || (l.eventListeners[i] = []), l.eventListeners[i].push(o));
    return l;
  }
  _toKonvaCanvas(t) {
    t = t || {};
    const e = this.getClientRect(), i = this.getStage(), r = t.x !== void 0 ? t.x : Math.floor(e.x), n = t.y !== void 0 ? t.y : Math.floor(e.y), s = t.pixelRatio || 1, o = new de.SceneCanvas({
      width: t.width || Math.ceil(e.width) || (i ? i.width() : 0),
      height: t.height || Math.ceil(e.height) || (i ? i.height() : 0),
      pixelRatio: s
    }), l = o.getContext(), h = new de.SceneCanvas({
      width: o.width / o.pixelRatio + Math.abs(r),
      height: o.height / o.pixelRatio + Math.abs(n),
      pixelRatio: o.pixelRatio
    });
    return t.imageSmoothingEnabled === !1 && (l._context.imageSmoothingEnabled = !1), l.save(), (r || n) && l.translate(-1 * r, -1 * n), this.drawScene(o, void 0, h), l.restore(), o;
  }
  toCanvas(t) {
    return this._toKonvaCanvas(t)._canvas;
  }
  toDataURL(t) {
    t = t || {};
    const e = t.mimeType || null, i = t.quality || null, r = this._toKonvaCanvas(t).toDataURL(e, i);
    return t.callback && t.callback(r), r;
  }
  toImage(t) {
    return new Promise((e, i) => {
      try {
        const r = t == null ? void 0 : t.callback;
        r && delete t.callback, V.Util._urlToImage(this.toDataURL(t), function(n) {
          e(n), r == null || r(n);
        });
      } catch (r) {
        i(r);
      }
    });
  }
  toBlob(t) {
    return new Promise((e, i) => {
      try {
        const r = t == null ? void 0 : t.callback;
        r && delete t.callback, this.toCanvas(t).toBlob((n) => {
          e(n), r == null || r(n);
        }, t == null ? void 0 : t.mimeType, t == null ? void 0 : t.quality);
      } catch (r) {
        i(r);
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
    return this.attrs.dragDistance !== void 0 ? this.attrs.dragDistance : this.parent ? this.parent.getDragDistance() : Nt.Konva.dragDistance;
  }
  _off(t, e, i) {
    let r = this.eventListeners[t], n, s, o;
    for (n = 0; n < r.length; n++)
      if (s = r[n].name, o = r[n].handler, (s !== "konva" || e === "konva") && (!e || s === e) && (!i || i === o)) {
        if (r.splice(n, 1), r.length === 0) {
          delete this.eventListeners[t];
          break;
        }
        n--;
      }
  }
  _fireChangeEvent(t, e, i) {
    this._fire(t + Ds, {
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
    const i = this[cn + V.Util._capitalize(t)];
    return V.Util._isFunction(i) ? i.call(this, e) : this._setAttr(t, e), this;
  }
  _requestDraw() {
    if (Nt.Konva.autoDrawEnabled) {
      const t = this.getLayer() || this.getStage();
      t == null || t.batchDraw();
    }
  }
  _setAttr(t, e) {
    const i = this.attrs[t];
    i === e && !V.Util.isObject(e) || (e == null ? delete this.attrs[t] : this.attrs[t] = e, this._shouldFireChangeEvents && this._fireChangeEvent(t, i, e), this._requestDraw());
  }
  _setComponentAttr(t, e, i) {
    let r;
    i !== void 0 && (r = this.attrs[t], r || (this.attrs[t] = this.getAttr(t)), this.attrs[t][e] = i, this._fireChangeEvent(t, r, i));
  }
  _fireAndBubble(t, e, i) {
    e && this.nodeType === un && (e.target = this);
    const r = [
      Gs,
      Is,
      Us,
      Bs,
      Vs,
      Hs
    ];
    if (!(r.indexOf(t) !== -1 && (i && (this === i || this.isAncestorOf && this.isAncestorOf(i)) || this.nodeType === "Stage" && !i))) {
      this._fire(t, e);
      const s = r.indexOf(t) !== -1 && i && i.isAncestorOf && i.isAncestorOf(this) && !i.isAncestorOf(this.parent);
      (e && !e.cancelBubble || !e) && this.parent && this.parent.isListening() && !s && (i && i.parent ? this._fireAndBubble.call(this.parent, t, e, i) : this._fireAndBubble.call(this.parent, t, e));
    }
  }
  _getProtoListeners(t) {
    var e, i, r;
    const n = (e = this._cache.get(Ke)) !== null && e !== void 0 ? e : {};
    let s = n == null ? void 0 : n[t];
    if (s === void 0) {
      s = [];
      let o = Object.getPrototypeOf(this);
      for (; o; ) {
        const l = (r = (i = o.eventListeners) === null || i === void 0 ? void 0 : i[t]) !== null && r !== void 0 ? r : [];
        s.push(...l), o = Object.getPrototypeOf(o);
      }
      n[t] = s, this._cache.set(Ke, n);
    }
    return s;
  }
  _fire(t, e) {
    e = e || {}, e.currentTarget = this, e.type = t;
    const i = this._getProtoListeners(t);
    if (i)
      for (let n = 0; n < i.length; n++)
        i[n].handler.call(this, e);
    const r = this.eventListeners[t];
    if (r)
      for (let n = 0; n < r.length; n++)
        r[n].handler.call(this, e);
  }
  draw() {
    return this.drawScene(), this.drawHit(), this;
  }
  _createDragElement(t) {
    const e = t ? t.pointerId : void 0, i = this.getStage(), r = this.getAbsolutePosition();
    if (!i)
      return;
    const n = i._getPointerById(e) || i._changedPointerPositions[0] || r;
    bt.DD._dragElements.set(this._id, {
      node: this,
      startPointerPos: n,
      offset: {
        x: n.x - r.x,
        y: n.y - r.y
      },
      dragStatus: "ready",
      pointerId: e
    });
  }
  startDrag(t, e = !0) {
    bt.DD._dragElements.has(this._id) || this._createDragElement(t);
    const i = bt.DD._dragElements.get(this._id);
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
    let r = {
      x: i.x - e.offset.x,
      y: i.y - e.offset.y
    };
    const n = this.dragBoundFunc();
    if (n !== void 0) {
      const s = n.call(this, r, t);
      s ? r = s : V.Util.warn("dragBoundFunc did not return any value. That is unexpected behavior. You must return new absolute position from dragBoundFunc.");
    }
    (!this._lastPos || this._lastPos.x !== r.x || this._lastPos.y !== r.y) && (this.setAbsolutePosition(r), this._requestDraw()), this._lastPos = r;
  }
  stopDrag(t) {
    const e = bt.DD._dragElements.get(this._id);
    e && (e.dragStatus = "stopped"), bt.DD._endDragBefore(t), bt.DD._endDragAfter(t);
  }
  setDraggable(t) {
    this._setAttr("draggable", t), this._dragChange();
  }
  isDragging() {
    const t = bt.DD._dragElements.get(this._id);
    return t ? t.dragStatus === "dragging" : !1;
  }
  _listenDrag() {
    this._dragCleanup(), this.on("mousedown.konva touchstart.konva", function(t) {
      if (!(!(t.evt.button !== void 0) || Nt.Konva.dragButtons.indexOf(t.evt.button) >= 0) || this.isDragging())
        return;
      let r = !1;
      bt.DD._dragElements.forEach((n) => {
        this.isAncestorOf(n.node) && (r = !0);
      }), r || this._createDragElement(t);
    });
  }
  _dragChange() {
    if (this.attrs.draggable)
      this._listenDrag();
    else {
      if (this._dragCleanup(), !this.getStage())
        return;
      const e = bt.DD._dragElements.get(this._id), i = e && e.dragStatus === "dragging", r = e && e.dragStatus === "ready";
      i ? this.stopDrag() : r && bt.DD._dragElements.delete(this._id);
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
    return V.Util.haveIntersection(i, this.getClientRect());
  }
  static create(t, e) {
    return V.Util._isString(t) && (t = JSON.parse(t)), this._createNode(t, e);
  }
  static _createNode(t, e) {
    let i = G.prototype.getClassName.call(t), r = t.children, n, s, o;
    e && (t.attrs.container = e), Nt.Konva[i] || (V.Util.warn('Can not find a node with class name "' + i + '". Fallback to "Shape".'), i = "Shape");
    const l = Nt.Konva[i];
    if (n = new l(t.attrs), r)
      for (s = r.length, o = 0; o < s; o++)
        n.add(G._createNode(r[o]));
    return n;
  }
}
rt.Node = G;
G.prototype.nodeType = "Node";
G.prototype._attrsAffectingSize = [];
G.prototype.eventListeners = {};
G.prototype.on.call(G.prototype, Ws, function() {
  if (this._batchingTransformChange) {
    this._needClearTransformCache = !0;
    return;
  }
  this._clearCache(Lt), this._clearSelfAndDescendantCache(Mt);
});
G.prototype.on.call(G.prototype, "visibleChange.konva", function() {
  this._clearSelfAndDescendantCache(_r);
});
G.prototype.on.call(G.prototype, "listeningChange.konva", function() {
  this._clearSelfAndDescendantCache(pr);
});
G.prototype.on.call(G.prototype, "opacityChange.konva", function() {
  this._clearSelfAndDescendantCache(ti);
});
const J = Ve.Factory.addGetterSetter;
J(G, "zIndex");
J(G, "absolutePosition");
J(G, "position");
J(G, "x", 0, (0, ct.getNumberValidator)());
J(G, "y", 0, (0, ct.getNumberValidator)());
J(G, "globalCompositeOperation", "source-over", (0, ct.getStringValidator)());
J(G, "opacity", 1, (0, ct.getNumberValidator)());
J(G, "name", "", (0, ct.getStringValidator)());
J(G, "id", "", (0, ct.getStringValidator)());
J(G, "rotation", 0, (0, ct.getNumberValidator)());
Ve.Factory.addComponentsGetterSetter(G, "scale", ["x", "y"]);
J(G, "scaleX", 1, (0, ct.getNumberValidator)());
J(G, "scaleY", 1, (0, ct.getNumberValidator)());
Ve.Factory.addComponentsGetterSetter(G, "skew", ["x", "y"]);
J(G, "skewX", 0, (0, ct.getNumberValidator)());
J(G, "skewY", 0, (0, ct.getNumberValidator)());
Ve.Factory.addComponentsGetterSetter(G, "offset", ["x", "y"]);
J(G, "offsetX", 0, (0, ct.getNumberValidator)());
J(G, "offsetY", 0, (0, ct.getNumberValidator)());
J(G, "dragDistance", void 0, (0, ct.getNumberValidator)());
J(G, "width", 0, (0, ct.getNumberValidator)());
J(G, "height", 0, (0, ct.getNumberValidator)());
J(G, "listening", !0, (0, ct.getBooleanValidator)());
J(G, "preventDefault", !0, (0, ct.getBooleanValidator)());
J(G, "filters", void 0, function(a) {
  return this._filterUpToDate = !1, a;
});
J(G, "visible", !0, (0, ct.getBooleanValidator)());
J(G, "transformsEnabled", "all", (0, ct.getStringValidator)());
J(G, "size");
J(G, "dragBoundFunc");
J(G, "draggable", !1, (0, ct.getBooleanValidator)());
Ve.Factory.backCompat(G, {
  rotateDeg: "rotate",
  setRotationDeg: "setRotation",
  getRotationDeg: "getRotation"
});
var Zt = {};
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.Container = void 0;
const Ce = B, nr = rt, ui = L;
class te extends nr.Node {
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
    return this._descendants((r) => {
      const n = r._isMatch(t);
      return n && i.push(r), !!(n && e);
    }), i;
  }
  _descendants(t) {
    let e = !1;
    const i = this.getChildren();
    for (const r of i) {
      if (e = t(r), e)
        return !0;
      if (r.hasChildren() && (e = r._descendants(t), e))
        return !0;
    }
    return !1;
  }
  toObject() {
    const t = nr.Node.prototype.toObject.call(this);
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
    const e = nr.Node.prototype.clone.call(this, t);
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
    const r = this.getLayer(), n = t || r && r.getCanvas(), s = n && n.getContext(), o = this._getCanvasCache(), l = o && o.scene, h = n && n.isCache;
    if (!this.isVisible() && !h)
      return this;
    if (l) {
      s.save();
      const u = this.getAbsoluteTransform(e).getMatrix();
      s.transform(u[0], u[1], u[2], u[3], u[4], u[5]), this._drawCachedSceneCanvas(s), s.restore();
    } else
      this._drawChildren("drawScene", n, e, i);
    return this;
  }
  drawHit(t, e) {
    if (!this.shouldDrawHit(e))
      return this;
    const i = this.getLayer(), r = t || i && i.hitCanvas, n = r && r.getContext(), s = this._getCanvasCache();
    if (s && s.hit) {
      n.save();
      const l = this.getAbsoluteTransform(e).getMatrix();
      n.transform(l[0], l[1], l[2], l[3], l[4], l[5]), this._drawCachedHitCanvas(n), n.restore();
    } else
      this._drawChildren("drawHit", r, e);
    return this;
  }
  _drawChildren(t, e, i, r) {
    var n;
    const s = e && e.getContext(), o = this.clipWidth(), l = this.clipHeight(), h = this.clipFunc(), u = typeof o == "number" && typeof l == "number" || h, f = i === this;
    if (u) {
      s.save();
      const _ = this.getAbsoluteTransform(i);
      let c = _.getMatrix();
      s.transform(c[0], c[1], c[2], c[3], c[4], c[5]), s.beginPath();
      let y;
      if (h)
        y = h.call(this, s, this);
      else {
        const m = this.clipX(), S = this.clipY();
        s.rect(m || 0, S || 0, o, l);
      }
      s.clip.apply(s, y), c = _.copy().invert().getMatrix(), s.transform(c[0], c[1], c[2], c[3], c[4], c[5]);
    }
    const p = !f && this.globalCompositeOperation() !== "source-over" && t === "drawScene";
    p && (s.save(), s._applyGlobalCompositeOperation(this)), (n = this.children) === null || n === void 0 || n.forEach(function(_) {
      _[t](e, i, r);
    }), p && s.restore(), u && s.restore();
  }
  getClientRect(t = {}) {
    var e;
    const i = t.skipTransform, r = t.relativeTo;
    let n, s, o, l, h = {
      x: 1 / 0,
      y: 1 / 0,
      width: 0,
      height: 0
    };
    const u = this;
    (e = this.children) === null || e === void 0 || e.forEach(function(_) {
      if (!_.visible())
        return;
      const c = _.getClientRect({
        relativeTo: u,
        skipShadow: t.skipShadow,
        skipStroke: t.skipStroke
      });
      c.width === 0 && c.height === 0 || (n === void 0 ? (n = c.x, s = c.y, o = c.x + c.width, l = c.y + c.height) : (n = Math.min(n, c.x), s = Math.min(s, c.y), o = Math.max(o, c.x + c.width), l = Math.max(l, c.y + c.height)));
    });
    const f = this.find("Shape");
    let p = !1;
    for (let _ = 0; _ < f.length; _++)
      if (f[_]._isVisible(this)) {
        p = !0;
        break;
      }
    return p && n !== void 0 ? h = {
      x: n,
      y: s,
      width: o - n,
      height: l - s
    } : h = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, i ? h : this._transformedRect(h, r);
  }
}
Zt.Container = te;
Ce.Factory.addComponentsGetterSetter(te, "clip", [
  "x",
  "y",
  "width",
  "height"
]);
Ce.Factory.addGetterSetter(te, "clipX", void 0, (0, ui.getNumberValidator)());
Ce.Factory.addGetterSetter(te, "clipY", void 0, (0, ui.getNumberValidator)());
Ce.Factory.addGetterSetter(te, "clipWidth", void 0, (0, ui.getNumberValidator)());
Ce.Factory.addGetterSetter(te, "clipHeight", void 0, (0, ui.getNumberValidator)());
Ce.Factory.addGetterSetter(te, "clipFunc");
var ea = {}, Bt = {};
Object.defineProperty(Bt, "__esModule", { value: !0 });
Bt.getCapturedShape = Ks;
Bt.createEvent = Rr;
Bt.hasPointerCapture = Xs;
Bt.setPointerCapture = qs;
Bt.releaseCapture = ra;
const Ys = U, Ie = /* @__PURE__ */ new Map(), ia = Ys.Konva._global.PointerEvent !== void 0;
function Ks(a) {
  return Ie.get(a);
}
function Rr(a) {
  return {
    evt: a,
    pointerId: a.pointerId
  };
}
function Xs(a, t) {
  return Ie.get(a) === t;
}
function qs(a, t) {
  ra(a), t.getStage() && (Ie.set(a, t), ia && t._fire("gotpointercapture", Rr(new PointerEvent("gotpointercapture"))));
}
function ra(a, t) {
  const e = Ie.get(a);
  if (!e)
    return;
  const i = e.getStage();
  i && i.content, Ie.delete(a), ia && e._fire("lostpointercapture", Rr(new PointerEvent("lostpointercapture")));
}
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Stage = a.stages = void 0;
  const t = at, e = B, i = Zt, r = U, n = St, s = ci, o = U, l = Bt, h = "Stage", u = "string", f = "px", p = "mouseout", _ = "mouseleave", c = "mouseover", y = "mouseenter", m = "mousemove", S = "mousedown", w = "mouseup", d = "pointermove", g = "pointerdown", b = "pointerup", x = "pointercancel", P = "lostpointercapture", v = "pointerout", E = "pointerleave", k = "pointerover", M = "pointerenter", T = "contextmenu", A = "touchstart", F = "touchend", $ = "touchmove", q = "touchcancel", K = "wheel", N = 5, W = [
    [y, "_pointerenter"],
    [S, "_pointerdown"],
    [m, "_pointermove"],
    [w, "_pointerup"],
    [_, "_pointerleave"],
    [A, "_pointerdown"],
    [$, "_pointermove"],
    [F, "_pointerup"],
    [q, "_pointercancel"],
    [c, "_pointerover"],
    [K, "_wheel"],
    [T, "_contextmenu"],
    [g, "_pointerdown"],
    [d, "_pointermove"],
    [b, "_pointerup"],
    [x, "_pointercancel"],
    [E, "_pointerleave"],
    [P, "_lostpointercapture"]
  ], I = {
    mouse: {
      [v]: p,
      [E]: _,
      [k]: c,
      [M]: y,
      [d]: m,
      [g]: S,
      [b]: w,
      [x]: "mousecancel",
      pointerclick: "click",
      pointerdblclick: "dblclick"
    },
    touch: {
      [v]: "touchout",
      [E]: "touchleave",
      [k]: "touchover",
      [M]: "touchenter",
      [d]: $,
      [g]: A,
      [b]: F,
      [x]: q,
      pointerclick: "tap",
      pointerdblclick: "dbltap"
    },
    pointer: {
      [v]: v,
      [E]: E,
      [k]: k,
      [M]: M,
      [d]: d,
      [g]: g,
      [b]: b,
      [x]: x,
      pointerclick: "pointerclick",
      pointerdblclick: "pointerdblclick"
    }
  }, O = (mt) => mt.indexOf("pointer") >= 0 ? "pointer" : mt.indexOf("touch") >= 0 ? "touch" : "mouse", z = (mt) => {
    const C = O(mt);
    if (C === "pointer")
      return r.Konva.pointerEventsEnabled && I.pointer;
    if (C === "touch")
      return I.touch;
    if (C === "mouse")
      return I.mouse;
  };
  function nt(mt = {}) {
    return (mt.clipFunc || mt.clipWidth || mt.clipHeight) && t.Util.warn("Stage does not support clipping. Please use clip for Layers or Groups."), mt;
  }
  const oe = "Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);";
  a.stages = [];
  class At extends i.Container {
    constructor(C) {
      super(nt(C)), this._pointerPositions = [], this._changedPointerPositions = [], this._buildDOM(), this._bindContentEvents(), a.stages.push(this), this.on("widthChange.konva heightChange.konva", this._resizeDOM), this.on("visibleChange.konva", this._checkVisibility), this.on("clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva", () => {
        nt(this.attrs);
      }), this._checkVisibility();
    }
    _validateAdd(C) {
      const R = C.getType() === "Layer", D = C.getType() === "FastLayer";
      R || D || t.Util.throw("You may only add layers to the stage.");
    }
    _checkVisibility() {
      if (!this.content)
        return;
      const C = this.visible() ? "" : "none";
      this.content.style.display = C;
    }
    setContainer(C) {
      if (typeof C === u) {
        let R;
        if (C.charAt(0) === ".") {
          const D = C.slice(1);
          C = document.getElementsByClassName(D)[0];
        } else
          C.charAt(0) !== "#" ? R = C : R = C.slice(1), C = document.getElementById(R);
        if (!C)
          throw "Can not find container in document with id " + R;
      }
      return this._setAttr("container", C), this.content && (this.content.parentElement && this.content.parentElement.removeChild(this.content), C.appendChild(this.content)), this;
    }
    shouldDrawHit() {
      return !0;
    }
    clear() {
      const C = this.children, R = C.length;
      for (let D = 0; D < R; D++)
        C[D].clear();
      return this;
    }
    clone(C) {
      return C || (C = {}), C.container = typeof document < "u" && document.createElement("div"), i.Container.prototype.clone.call(this, C);
    }
    destroy() {
      super.destroy();
      const C = this.content;
      C && t.Util._isInDocument(C) && this.container().removeChild(C);
      const R = a.stages.indexOf(this);
      return R > -1 && a.stages.splice(R, 1), t.Util.releaseCanvas(this.bufferCanvas._canvas, this.bufferHitCanvas._canvas), this;
    }
    getPointerPosition() {
      const C = this._pointerPositions[0] || this._changedPointerPositions[0];
      return C ? {
        x: C.x,
        y: C.y
      } : (t.Util.warn(oe), null);
    }
    _getPointerById(C) {
      return this._pointerPositions.find((R) => R.id === C);
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
    _toKonvaCanvas(C) {
      C = C || {}, C.x = C.x || 0, C.y = C.y || 0, C.width = C.width || this.width(), C.height = C.height || this.height();
      const R = new n.SceneCanvas({
        width: C.width,
        height: C.height,
        pixelRatio: C.pixelRatio || 1
      }), D = R.getContext()._context, it = this.children;
      return (C.x || C.y) && D.translate(-1 * C.x, -1 * C.y), it.forEach(function(Q) {
        if (!Q.isVisible())
          return;
        const ht = Q._toKonvaCanvas(C);
        D.drawImage(ht._canvas, C.x, C.y, ht.getWidth() / ht.getPixelRatio(), ht.getHeight() / ht.getPixelRatio());
      }), R;
    }
    getIntersection(C) {
      if (!C)
        return null;
      const R = this.children, D = R.length, it = D - 1;
      for (let Q = it; Q >= 0; Q--) {
        const ht = R[Q].getIntersection(C);
        if (ht)
          return ht;
      }
      return null;
    }
    _resizeDOM() {
      const C = this.width(), R = this.height();
      this.content && (this.content.style.width = C + f, this.content.style.height = R + f), this.bufferCanvas.setSize(C, R), this.bufferHitCanvas.setSize(C, R), this.children.forEach((D) => {
        D.setSize({ width: C, height: R }), D.draw();
      });
    }
    add(C, ...R) {
      if (arguments.length > 1) {
        for (let it = 0; it < arguments.length; it++)
          this.add(arguments[it]);
        return this;
      }
      super.add(C);
      const D = this.children.length;
      return D > N && t.Util.warn("The stage has " + D + " layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group."), C.setSize({ width: this.width(), height: this.height() }), C.draw(), r.Konva.isBrowser && this.content.appendChild(C.canvas._canvas), this;
    }
    getParent() {
      return null;
    }
    getLayer() {
      return null;
    }
    hasPointerCapture(C) {
      return l.hasPointerCapture(C, this);
    }
    setPointerCapture(C) {
      l.setPointerCapture(C, this);
    }
    releaseCapture(C) {
      l.releaseCapture(C, this);
    }
    getLayers() {
      return this.children;
    }
    _bindContentEvents() {
      r.Konva.isBrowser && W.forEach(([C, R]) => {
        this.content.addEventListener(C, (D) => {
          this[R](D);
        }, { passive: !1 });
      });
    }
    _pointerenter(C) {
      this.setPointersPositions(C);
      const R = z(C.type);
      R && this._fire(R.pointerenter, {
        evt: C,
        target: this,
        currentTarget: this
      });
    }
    _pointerover(C) {
      this.setPointersPositions(C);
      const R = z(C.type);
      R && this._fire(R.pointerover, {
        evt: C,
        target: this,
        currentTarget: this
      });
    }
    _getTargetShape(C) {
      let R = this[C + "targetShape"];
      return R && !R.getStage() && (R = null), R;
    }
    _pointerleave(C) {
      const R = z(C.type), D = O(C.type);
      if (!R)
        return;
      this.setPointersPositions(C);
      const it = this._getTargetShape(D), Q = !(r.Konva.isDragging() || r.Konva.isTransforming()) || r.Konva.hitOnDragEnabled;
      it && Q ? (it._fireAndBubble(R.pointerout, { evt: C }), it._fireAndBubble(R.pointerleave, { evt: C }), this._fire(R.pointerleave, {
        evt: C,
        target: this,
        currentTarget: this
      }), this[D + "targetShape"] = null) : Q && (this._fire(R.pointerleave, {
        evt: C,
        target: this,
        currentTarget: this
      }), this._fire(R.pointerout, {
        evt: C,
        target: this,
        currentTarget: this
      })), this.pointerPos = null, this._pointerPositions = [];
    }
    _pointerdown(C) {
      const R = z(C.type), D = O(C.type);
      if (!R)
        return;
      this.setPointersPositions(C);
      let it = !1;
      this._changedPointerPositions.forEach((Q) => {
        const ht = this.getIntersection(Q);
        if (s.DD.justDragged = !1, r.Konva["_" + D + "ListenClick"] = !0, !ht || !ht.isListening()) {
          this[D + "ClickStartShape"] = void 0;
          return;
        }
        r.Konva.capturePointerEventsEnabled && ht.setPointerCapture(Q.id), this[D + "ClickStartShape"] = ht, ht._fireAndBubble(R.pointerdown, {
          evt: C,
          pointerId: Q.id
        }), it = !0;
        const yt = C.type.indexOf("touch") >= 0;
        ht.preventDefault() && C.cancelable && yt && C.preventDefault();
      }), it || this._fire(R.pointerdown, {
        evt: C,
        target: this,
        currentTarget: this,
        pointerId: this._pointerPositions[0].id
      });
    }
    _pointermove(C) {
      const R = z(C.type), D = O(C.type);
      if (!R || (r.Konva.isDragging() && s.DD.node.preventDefault() && C.cancelable && C.preventDefault(), this.setPointersPositions(C), !(!(r.Konva.isDragging() || r.Konva.isTransforming()) || r.Konva.hitOnDragEnabled)))
        return;
      const Q = {};
      let ht = !1;
      const yt = this._getTargetShape(D);
      this._changedPointerPositions.forEach((Dt) => {
        const tt = l.getCapturedShape(Dt.id) || this.getIntersection(Dt), le = Dt.id, Pt = { evt: C, pointerId: le }, he = yt !== tt;
        if (he && yt && (yt._fireAndBubble(R.pointerout, { ...Pt }, tt), yt._fireAndBubble(R.pointerleave, { ...Pt }, tt)), tt) {
          if (Q[tt._id])
            return;
          Q[tt._id] = !0;
        }
        tt && tt.isListening() ? (ht = !0, he && (tt._fireAndBubble(R.pointerover, { ...Pt }, yt), tt._fireAndBubble(R.pointerenter, { ...Pt }, yt), this[D + "targetShape"] = tt), tt._fireAndBubble(R.pointermove, { ...Pt })) : yt && (this._fire(R.pointerover, {
          evt: C,
          target: this,
          currentTarget: this,
          pointerId: le
        }), this[D + "targetShape"] = null);
      }), ht || this._fire(R.pointermove, {
        evt: C,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id
      });
    }
    _pointerup(C) {
      const R = z(C.type), D = O(C.type);
      if (!R)
        return;
      this.setPointersPositions(C);
      const it = this[D + "ClickStartShape"], Q = this[D + "ClickEndShape"], ht = {};
      let yt = !1;
      this._changedPointerPositions.forEach((Dt) => {
        const tt = l.getCapturedShape(Dt.id) || this.getIntersection(Dt);
        if (tt) {
          if (tt.releaseCapture(Dt.id), ht[tt._id])
            return;
          ht[tt._id] = !0;
        }
        const le = Dt.id, Pt = { evt: C, pointerId: le };
        let he = !1;
        r.Konva["_" + D + "InDblClickWindow"] ? (he = !0, clearTimeout(this[D + "DblTimeout"])) : s.DD.justDragged || (r.Konva["_" + D + "InDblClickWindow"] = !0, clearTimeout(this[D + "DblTimeout"])), this[D + "DblTimeout"] = setTimeout(function() {
          r.Konva["_" + D + "InDblClickWindow"] = !1;
        }, r.Konva.dblClickWindow), tt && tt.isListening() ? (yt = !0, this[D + "ClickEndShape"] = tt, tt._fireAndBubble(R.pointerup, { ...Pt }), r.Konva["_" + D + "ListenClick"] && it && it === tt && (tt._fireAndBubble(R.pointerclick, { ...Pt }), he && Q && Q === tt && tt._fireAndBubble(R.pointerdblclick, { ...Pt }))) : (this[D + "ClickEndShape"] = null, r.Konva["_" + D + "ListenClick"] && this._fire(R.pointerclick, {
          evt: C,
          target: this,
          currentTarget: this,
          pointerId: le
        }), he && this._fire(R.pointerdblclick, {
          evt: C,
          target: this,
          currentTarget: this,
          pointerId: le
        }));
      }), yt || this._fire(R.pointerup, {
        evt: C,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id
      }), r.Konva["_" + D + "ListenClick"] = !1, C.cancelable && D !== "touch" && D !== "pointer" && C.preventDefault();
    }
    _contextmenu(C) {
      this.setPointersPositions(C);
      const R = this.getIntersection(this.getPointerPosition());
      R && R.isListening() ? R._fireAndBubble(T, { evt: C }) : this._fire(T, {
        evt: C,
        target: this,
        currentTarget: this
      });
    }
    _wheel(C) {
      this.setPointersPositions(C);
      const R = this.getIntersection(this.getPointerPosition());
      R && R.isListening() ? R._fireAndBubble(K, { evt: C }) : this._fire(K, {
        evt: C,
        target: this,
        currentTarget: this
      });
    }
    _pointercancel(C) {
      this.setPointersPositions(C);
      const R = l.getCapturedShape(C.pointerId) || this.getIntersection(this.getPointerPosition());
      R && R._fireAndBubble(b, l.createEvent(C)), l.releaseCapture(C.pointerId);
    }
    _lostpointercapture(C) {
      l.releaseCapture(C.pointerId);
    }
    setPointersPositions(C) {
      const R = this._getContentPosition();
      let D = null, it = null;
      C = C || window.event, C.touches !== void 0 ? (this._pointerPositions = [], this._changedPointerPositions = [], Array.prototype.forEach.call(C.touches, (Q) => {
        this._pointerPositions.push({
          id: Q.identifier,
          x: (Q.clientX - R.left) / R.scaleX,
          y: (Q.clientY - R.top) / R.scaleY
        });
      }), Array.prototype.forEach.call(C.changedTouches || C.touches, (Q) => {
        this._changedPointerPositions.push({
          id: Q.identifier,
          x: (Q.clientX - R.left) / R.scaleX,
          y: (Q.clientY - R.top) / R.scaleY
        });
      })) : (D = (C.clientX - R.left) / R.scaleX, it = (C.clientY - R.top) / R.scaleY, this.pointerPos = {
        x: D,
        y: it
      }, this._pointerPositions = [{ x: D, y: it, id: t.Util._getFirstPointerId(C) }], this._changedPointerPositions = [
        { x: D, y: it, id: t.Util._getFirstPointerId(C) }
      ]);
    }
    _setPointerPosition(C) {
      t.Util.warn('Method _setPointerPosition is deprecated. Use "stage.setPointersPositions(event)" instead.'), this.setPointersPositions(C);
    }
    _getContentPosition() {
      if (!this.content || !this.content.getBoundingClientRect)
        return {
          top: 0,
          left: 0,
          scaleX: 1,
          scaleY: 1
        };
      const C = this.content.getBoundingClientRect();
      return {
        top: C.top,
        left: C.left,
        scaleX: C.width / this.content.clientWidth || 1,
        scaleY: C.height / this.content.clientHeight || 1
      };
    }
    _buildDOM() {
      if (this.bufferCanvas = new n.SceneCanvas({
        width: this.width(),
        height: this.height()
      }), this.bufferHitCanvas = new n.HitCanvas({
        pixelRatio: 1,
        width: this.width(),
        height: this.height()
      }), !r.Konva.isBrowser)
        return;
      const C = this.container();
      if (!C)
        throw "Stage has no container. A container is required.";
      C.innerHTML = "", this.content = document.createElement("div"), this.content.style.position = "relative", this.content.style.userSelect = "none", this.content.className = "konvajs-content", this.content.setAttribute("role", "presentation"), C.appendChild(this.content), this._resizeDOM();
    }
    cache() {
      return t.Util.warn("Cache function is not allowed for stage. You may use cache only for layers, groups and shapes."), this;
    }
    clearCache() {
      return this;
    }
    batchDraw() {
      return this.getChildren().forEach(function(C) {
        C.batchDraw();
      }), this;
    }
  }
  a.Stage = At, At.prototype.nodeType = h, (0, o._registerNode)(At), e.Factory.addGetterSetter(At, "container"), r.Konva.isBrowser && document.addEventListener("visibilitychange", () => {
    a.stages.forEach((mt) => {
      mt.batchDraw();
    });
  });
})(ea);
var He = {}, gt = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Shape = a.shapes = void 0;
  const t = U, e = at, i = B, r = rt, n = L, s = U, o = Bt, l = "hasShadow", h = "shadowRGBA", u = "patternImage", f = "linearGradient", p = "radialGradient";
  let _;
  function c() {
    return _ || (_ = e.Util.createCanvasElement().getContext("2d"), _);
  }
  a.shapes = {};
  function y(E) {
    const k = this.attrs.fillRule;
    k ? E.fill(k) : E.fill();
  }
  function m(E) {
    E.stroke();
  }
  function S(E) {
    const k = this.attrs.fillRule;
    k ? E.fill(k) : E.fill();
  }
  function w(E) {
    E.stroke();
  }
  function d() {
    this._clearCache(l);
  }
  function g() {
    this._clearCache(h);
  }
  function b() {
    this._clearCache(u);
  }
  function x() {
    this._clearCache(f);
  }
  function P() {
    this._clearCache(p);
  }
  class v extends r.Node {
    constructor(k) {
      super(k);
      let M;
      for (; M = e.Util.getRandomColor(), !(M && !(M in a.shapes)); )
        ;
      this.colorKey = M, a.shapes[M] = this;
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
      return this._getCache(u, this.__getFillPattern);
    }
    __getFillPattern() {
      if (this.fillPatternImage()) {
        const M = c().createPattern(this.fillPatternImage(), this.fillPatternRepeat() || "repeat");
        if (M && M.setTransform) {
          const T = new e.Transform();
          T.translate(this.fillPatternX(), this.fillPatternY()), T.rotate(t.Konva.getAngle(this.fillPatternRotation())), T.scale(this.fillPatternScaleX(), this.fillPatternScaleY()), T.translate(-1 * this.fillPatternOffsetX(), -1 * this.fillPatternOffsetY());
          const A = T.getMatrix(), F = typeof DOMMatrix > "u" ? {
            a: A[0],
            b: A[1],
            c: A[2],
            d: A[3],
            e: A[4],
            f: A[5]
          } : new DOMMatrix(A);
          M.setTransform(F);
        }
        return M;
      }
    }
    _getLinearGradient() {
      return this._getCache(f, this.__getLinearGradient);
    }
    __getLinearGradient() {
      const k = this.fillLinearGradientColorStops();
      if (k) {
        const M = c(), T = this.fillLinearGradientStartPoint(), A = this.fillLinearGradientEndPoint(), F = M.createLinearGradient(T.x, T.y, A.x, A.y);
        for (let $ = 0; $ < k.length; $ += 2)
          F.addColorStop(k[$], k[$ + 1]);
        return F;
      }
    }
    _getRadialGradient() {
      return this._getCache(p, this.__getRadialGradient);
    }
    __getRadialGradient() {
      const k = this.fillRadialGradientColorStops();
      if (k) {
        const M = c(), T = this.fillRadialGradientStartPoint(), A = this.fillRadialGradientEndPoint(), F = M.createRadialGradient(T.x, T.y, this.fillRadialGradientStartRadius(), A.x, A.y, this.fillRadialGradientEndRadius());
        for (let $ = 0; $ < k.length; $ += 2)
          F.addColorStop(k[$], k[$ + 1]);
        return F;
      }
    }
    getShadowRGBA() {
      return this._getCache(h, this._getShadowRGBA);
    }
    _getShadowRGBA() {
      if (!this.hasShadow())
        return;
      const k = e.Util.colorToRGBA(this.shadowColor());
      if (k)
        return "rgba(" + k.r + "," + k.g + "," + k.b + "," + k.a * (this.shadowOpacity() || 1) + ")";
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
      const k = this.hitStrokeWidth();
      return k === "auto" ? this.hasStroke() : this.strokeEnabled() && !!k;
    }
    intersects(k) {
      const M = this.getStage();
      if (!M)
        return !1;
      const T = M.bufferHitCanvas;
      return T.getContext().clear(), this.drawHit(T, void 0, !0), T.context.getImageData(Math.round(k.x), Math.round(k.y), 1, 1).data[3] > 0;
    }
    destroy() {
      return r.Node.prototype.destroy.call(this), delete a.shapes[this.colorKey], delete this.colorKey, this;
    }
    _useBufferCanvas(k) {
      var M;
      if (!((M = this.attrs.perfectDrawEnabled) !== null && M !== void 0 ? M : !0))
        return !1;
      const A = k || this.hasFill(), F = this.hasStroke(), $ = this.getAbsoluteOpacity() !== 1;
      if (A && F && $)
        return !0;
      const q = this.hasShadow(), K = this.shadowForStrokeEnabled();
      return !!(A && F && q && K);
    }
    setStrokeHitEnabled(k) {
      e.Util.warn("strokeHitEnabled property is deprecated. Please use hitStrokeWidth instead."), k ? this.hitStrokeWidth("auto") : this.hitStrokeWidth(0);
    }
    getStrokeHitEnabled() {
      return this.hitStrokeWidth() !== 0;
    }
    getSelfRect() {
      const k = this.size();
      return {
        x: this._centroid ? -k.width / 2 : 0,
        y: this._centroid ? -k.height / 2 : 0,
        width: k.width,
        height: k.height
      };
    }
    getClientRect(k = {}) {
      let M = !1, T = this.getParent();
      for (; T; ) {
        if (T.isCached()) {
          M = !0;
          break;
        }
        T = T.getParent();
      }
      const A = k.skipTransform, F = k.relativeTo || M && this.getStage() || void 0, $ = this.getSelfRect(), K = !k.skipStroke && this.hasStroke() && this.strokeWidth() || 0, N = $.width + K, W = $.height + K, I = !k.skipShadow && this.hasShadow(), O = I ? this.shadowOffsetX() : 0, z = I ? this.shadowOffsetY() : 0, nt = N + Math.abs(O), oe = W + Math.abs(z), At = I && this.shadowBlur() || 0, mt = nt + At * 2, C = oe + At * 2, R = {
        width: mt,
        height: C,
        x: -(K / 2 + At) + Math.min(O, 0) + $.x,
        y: -(K / 2 + At) + Math.min(z, 0) + $.y
      };
      return A ? R : this._transformedRect(R, F);
    }
    drawScene(k, M, T) {
      const A = this.getLayer(), F = k || A.getCanvas(), $ = F.getContext(), q = this._getCanvasCache(), K = this.getSceneFunc(), N = this.hasShadow();
      let W;
      const I = M === this;
      if (!this.isVisible() && !I)
        return this;
      if (q) {
        $.save();
        const O = this.getAbsoluteTransform(M).getMatrix();
        return $.transform(O[0], O[1], O[2], O[3], O[4], O[5]), this._drawCachedSceneCanvas($), $.restore(), this;
      }
      if (!K)
        return this;
      if ($.save(), this._useBufferCanvas()) {
        W = this.getStage();
        const O = T || W.bufferCanvas, z = O.getContext();
        z.clear(), z.save(), z._applyLineJoin(this);
        const nt = this.getAbsoluteTransform(M).getMatrix();
        z.transform(nt[0], nt[1], nt[2], nt[3], nt[4], nt[5]), K.call(this, z, this), z.restore();
        const oe = O.pixelRatio;
        N && $._applyShadow(this), $._applyOpacity(this), $._applyGlobalCompositeOperation(this), $.drawImage(O._canvas, O.x || 0, O.y || 0, O.width / oe, O.height / oe);
      } else {
        if ($._applyLineJoin(this), !I) {
          const O = this.getAbsoluteTransform(M).getMatrix();
          $.transform(O[0], O[1], O[2], O[3], O[4], O[5]), $._applyOpacity(this), $._applyGlobalCompositeOperation(this);
        }
        N && $._applyShadow(this), K.call(this, $, this);
      }
      return $.restore(), this;
    }
    drawHit(k, M, T = !1) {
      if (!this.shouldDrawHit(M, T))
        return this;
      const A = this.getLayer(), F = k || A.hitCanvas, $ = F && F.getContext(), q = this.hitFunc() || this.sceneFunc(), K = this._getCanvasCache(), N = K && K.hit;
      if (this.colorKey || e.Util.warn("Looks like your canvas has a destroyed shape in it. Do not reuse shape after you destroyed it. If you want to reuse shape you should call remove() instead of destroy()"), N) {
        $.save();
        const I = this.getAbsoluteTransform(M).getMatrix();
        return $.transform(I[0], I[1], I[2], I[3], I[4], I[5]), this._drawCachedHitCanvas($), $.restore(), this;
      }
      if (!q)
        return this;
      if ($.save(), $._applyLineJoin(this), !(this === M)) {
        const I = this.getAbsoluteTransform(M).getMatrix();
        $.transform(I[0], I[1], I[2], I[3], I[4], I[5]);
      }
      return q.call(this, $, this), $.restore(), this;
    }
    drawHitFromCache(k = 0) {
      const M = this._getCanvasCache(), T = this._getCachedSceneCanvas(), A = M.hit, F = A.getContext(), $ = A.getWidth(), q = A.getHeight();
      F.clear(), F.drawImage(T._canvas, 0, 0, $, q);
      try {
        const K = F.getImageData(0, 0, $, q), N = K.data, W = N.length, I = e.Util._hexToRgb(this.colorKey);
        for (let O = 0; O < W; O += 4)
          N[O + 3] > k ? (N[O] = I.r, N[O + 1] = I.g, N[O + 2] = I.b, N[O + 3] = 255) : N[O + 3] = 0;
        F.putImageData(K, 0, 0);
      } catch (K) {
        e.Util.error("Unable to draw hit graph from cached scene canvas. " + K.message);
      }
      return this;
    }
    hasPointerCapture(k) {
      return o.hasPointerCapture(k, this);
    }
    setPointerCapture(k) {
      o.setPointerCapture(k, this);
    }
    releaseCapture(k) {
      o.releaseCapture(k, this);
    }
  }
  a.Shape = v, v.prototype._fillFunc = y, v.prototype._strokeFunc = m, v.prototype._fillFuncHit = S, v.prototype._strokeFuncHit = w, v.prototype._centroid = !1, v.prototype.nodeType = "Shape", (0, s._registerNode)(v), v.prototype.eventListeners = {}, v.prototype.on.call(v.prototype, "shadowColorChange.konva shadowBlurChange.konva shadowOffsetChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", d), v.prototype.on.call(v.prototype, "shadowColorChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", g), v.prototype.on.call(v.prototype, "fillPriorityChange.konva fillPatternImageChange.konva fillPatternRepeatChange.konva fillPatternScaleXChange.konva fillPatternScaleYChange.konva fillPatternOffsetXChange.konva fillPatternOffsetYChange.konva fillPatternXChange.konva fillPatternYChange.konva fillPatternRotationChange.konva", b), v.prototype.on.call(v.prototype, "fillPriorityChange.konva fillLinearGradientColorStopsChange.konva fillLinearGradientStartPointXChange.konva fillLinearGradientStartPointYChange.konva fillLinearGradientEndPointXChange.konva fillLinearGradientEndPointYChange.konva", x), v.prototype.on.call(v.prototype, "fillPriorityChange.konva fillRadialGradientColorStopsChange.konva fillRadialGradientStartPointXChange.konva fillRadialGradientStartPointYChange.konva fillRadialGradientEndPointXChange.konva fillRadialGradientEndPointYChange.konva fillRadialGradientStartRadiusChange.konva fillRadialGradientEndRadiusChange.konva", P), i.Factory.addGetterSetter(v, "stroke", void 0, (0, n.getStringOrGradientValidator)()), i.Factory.addGetterSetter(v, "strokeWidth", 2, (0, n.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillAfterStrokeEnabled", !1), i.Factory.addGetterSetter(v, "hitStrokeWidth", "auto", (0, n.getNumberOrAutoValidator)()), i.Factory.addGetterSetter(v, "strokeHitEnabled", !0, (0, n.getBooleanValidator)()), i.Factory.addGetterSetter(v, "perfectDrawEnabled", !0, (0, n.getBooleanValidator)()), i.Factory.addGetterSetter(v, "shadowForStrokeEnabled", !0, (0, n.getBooleanValidator)()), i.Factory.addGetterSetter(v, "lineJoin"), i.Factory.addGetterSetter(v, "lineCap"), i.Factory.addGetterSetter(v, "sceneFunc"), i.Factory.addGetterSetter(v, "hitFunc"), i.Factory.addGetterSetter(v, "dash"), i.Factory.addGetterSetter(v, "dashOffset", 0, (0, n.getNumberValidator)()), i.Factory.addGetterSetter(v, "shadowColor", void 0, (0, n.getStringValidator)()), i.Factory.addGetterSetter(v, "shadowBlur", 0, (0, n.getNumberValidator)()), i.Factory.addGetterSetter(v, "shadowOpacity", 1, (0, n.getNumberValidator)()), i.Factory.addComponentsGetterSetter(v, "shadowOffset", ["x", "y"]), i.Factory.addGetterSetter(v, "shadowOffsetX", 0, (0, n.getNumberValidator)()), i.Factory.addGetterSetter(v, "shadowOffsetY", 0, (0, n.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternImage"), i.Factory.addGetterSetter(v, "fill", void 0, (0, n.getStringOrGradientValidator)()), i.Factory.addGetterSetter(v, "fillPatternX", 0, (0, n.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternY", 0, (0, n.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillLinearGradientColorStops"), i.Factory.addGetterSetter(v, "strokeLinearGradientColorStops"), i.Factory.addGetterSetter(v, "fillRadialGradientStartRadius", 0), i.Factory.addGetterSetter(v, "fillRadialGradientEndRadius", 0), i.Factory.addGetterSetter(v, "fillRadialGradientColorStops"), i.Factory.addGetterSetter(v, "fillPatternRepeat", "repeat"), i.Factory.addGetterSetter(v, "fillEnabled", !0), i.Factory.addGetterSetter(v, "strokeEnabled", !0), i.Factory.addGetterSetter(v, "shadowEnabled", !0), i.Factory.addGetterSetter(v, "dashEnabled", !0), i.Factory.addGetterSetter(v, "strokeScaleEnabled", !0), i.Factory.addGetterSetter(v, "fillPriority", "color"), i.Factory.addComponentsGetterSetter(v, "fillPatternOffset", ["x", "y"]), i.Factory.addGetterSetter(v, "fillPatternOffsetX", 0, (0, n.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternOffsetY", 0, (0, n.getNumberValidator)()), i.Factory.addComponentsGetterSetter(v, "fillPatternScale", ["x", "y"]), i.Factory.addGetterSetter(v, "fillPatternScaleX", 1, (0, n.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternScaleY", 1, (0, n.getNumberValidator)()), i.Factory.addComponentsGetterSetter(v, "fillLinearGradientStartPoint", [
    "x",
    "y"
  ]), i.Factory.addComponentsGetterSetter(v, "strokeLinearGradientStartPoint", [
    "x",
    "y"
  ]), i.Factory.addGetterSetter(v, "fillLinearGradientStartPointX", 0), i.Factory.addGetterSetter(v, "strokeLinearGradientStartPointX", 0), i.Factory.addGetterSetter(v, "fillLinearGradientStartPointY", 0), i.Factory.addGetterSetter(v, "strokeLinearGradientStartPointY", 0), i.Factory.addComponentsGetterSetter(v, "fillLinearGradientEndPoint", [
    "x",
    "y"
  ]), i.Factory.addComponentsGetterSetter(v, "strokeLinearGradientEndPoint", [
    "x",
    "y"
  ]), i.Factory.addGetterSetter(v, "fillLinearGradientEndPointX", 0), i.Factory.addGetterSetter(v, "strokeLinearGradientEndPointX", 0), i.Factory.addGetterSetter(v, "fillLinearGradientEndPointY", 0), i.Factory.addGetterSetter(v, "strokeLinearGradientEndPointY", 0), i.Factory.addComponentsGetterSetter(v, "fillRadialGradientStartPoint", [
    "x",
    "y"
  ]), i.Factory.addGetterSetter(v, "fillRadialGradientStartPointX", 0), i.Factory.addGetterSetter(v, "fillRadialGradientStartPointY", 0), i.Factory.addComponentsGetterSetter(v, "fillRadialGradientEndPoint", [
    "x",
    "y"
  ]), i.Factory.addGetterSetter(v, "fillRadialGradientEndPointX", 0), i.Factory.addGetterSetter(v, "fillRadialGradientEndPointY", 0), i.Factory.addGetterSetter(v, "fillPatternRotation", 0), i.Factory.addGetterSetter(v, "fillRule", void 0, (0, n.getStringValidator)()), i.Factory.backCompat(v, {
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
})(gt);
Object.defineProperty(He, "__esModule", { value: !0 });
He.Layer = void 0;
const Et = at, ar = Zt, ce = rt, $r = B, gn = St, Qs = L, Js = gt, Zs = U, to = "#", eo = "beforeDraw", io = "draw", na = [
  { x: 0, y: 0 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 }
], ro = na.length;
class xe extends ar.Container {
  constructor(t) {
    super(t), this.canvas = new gn.SceneCanvas(), this.hitCanvas = new gn.HitCanvas({
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
    ce.Node.prototype.moveToTop.call(this);
    const t = this.getStage();
    return t && t.content && (t.content.removeChild(this.getNativeCanvasElement()), t.content.appendChild(this.getNativeCanvasElement())), !0;
  }
  moveUp() {
    if (!ce.Node.prototype.moveUp.call(this))
      return !1;
    const e = this.getStage();
    return !e || !e.content ? !1 : (e.content.removeChild(this.getNativeCanvasElement()), this.index < e.children.length - 1 ? e.content.insertBefore(this.getNativeCanvasElement(), e.children[this.index + 1].getCanvas()._canvas) : e.content.appendChild(this.getNativeCanvasElement()), !0);
  }
  moveDown() {
    if (ce.Node.prototype.moveDown.call(this)) {
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
    if (ce.Node.prototype.moveToBottom.call(this)) {
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
    return ce.Node.prototype.remove.call(this), t && t.parentNode && Et.Util._isInDocument(t) && t.parentNode.removeChild(t), this;
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
    return t = t || {}, t.width = t.width || this.getWidth(), t.height = t.height || this.getHeight(), t.x = t.x !== void 0 ? t.x : this.x(), t.y = t.y !== void 0 ? t.y : this.y(), ce.Node.prototype._toKonvaCanvas.call(this, t);
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
      for (let r = 0; r < ro; r++) {
        const n = na[r], s = this._getIntersection({
          x: t.x + n.x * e,
          y: t.y + n.y * e
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
    const e = this.hitCanvas.pixelRatio, i = this.hitCanvas.context.getImageData(Math.round(t.x * e), Math.round(t.y * e), 1, 1).data, r = i[3];
    if (r === 255) {
      const n = Et.Util._rgbToHex(i[0], i[1], i[2]), s = Js.shapes[to + n];
      return s ? {
        shape: s
      } : {
        antialiased: !0
      };
    } else if (r > 0)
      return {
        antialiased: !0
      };
    return {};
  }
  drawScene(t, e, i) {
    const r = this.getLayer(), n = t || r && r.getCanvas();
    return this._fire(eo, {
      node: this
    }), this.clearBeforeDraw() && n.getContext().clear(), ar.Container.prototype.drawScene.call(this, n, e, i), this._fire(io, {
      node: this
    }), this;
  }
  drawHit(t, e) {
    const i = this.getLayer(), r = t || i && i.hitCanvas;
    return i && i.clearBeforeDraw() && i.getHitCanvas().getContext().clear(), ar.Container.prototype.drawHit.call(this, r, e), this;
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
He.Layer = xe;
xe.prototype.nodeType = "Layer";
(0, Zs._registerNode)(xe);
$r.Factory.addGetterSetter(xe, "imageSmoothingEnabled", !0);
$r.Factory.addGetterSetter(xe, "clearBeforeDraw", !0);
$r.Factory.addGetterSetter(xe, "hitGraphEnabled", !0, (0, Qs.getBooleanValidator)());
var fi = {};
Object.defineProperty(fi, "__esModule", { value: !0 });
fi.FastLayer = void 0;
const no = at, ao = He, so = U;
class Fr extends ao.Layer {
  constructor(t) {
    super(t), this.listening(!1), no.Util.warn('Konva.Fast layer is deprecated. Please use "new Konva.Layer({ listening: false })" instead.');
  }
}
fi.FastLayer = Fr;
Fr.prototype.nodeType = "FastLayer";
(0, so._registerNode)(Fr);
var ke = {};
Object.defineProperty(ke, "__esModule", { value: !0 });
ke.Group = void 0;
const oo = at, lo = Zt, ho = U;
class Or extends lo.Container {
  _validateAdd(t) {
    const e = t.getType();
    e !== "Group" && e !== "Shape" && oo.Util.throw("You may only add groups and shapes to groups.");
  }
}
ke.Group = Or;
Or.prototype.nodeType = "Group";
(0, ho._registerNode)(Or);
var Ae = {};
Object.defineProperty(Ae, "__esModule", { value: !0 });
Ae.Animation = void 0;
const sr = U, pn = at, or = function() {
  return sr.glob.performance && sr.glob.performance.now ? function() {
    return sr.glob.performance.now();
  } : function() {
    return (/* @__PURE__ */ new Date()).getTime();
  };
}();
class Ct {
  constructor(t, e) {
    this.id = Ct.animIdCounter++, this.frame = {
      time: 0,
      timeDiff: 0,
      lastTime: or(),
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
    for (let r = 0; r < i; r++)
      if (e[r]._id === t._id)
        return !1;
    return this.layers.push(t), !0;
  }
  isRunning() {
    const e = Ct.animations, i = e.length;
    for (let r = 0; r < i; r++)
      if (e[r].id === this.id)
        return !0;
    return !1;
  }
  start() {
    return this.stop(), this.frame.timeDiff = 0, this.frame.lastTime = or(), Ct._addAnimation(this), this;
  }
  stop() {
    return Ct._removeAnimation(this), this;
  }
  _updateFrameObject(t) {
    this.frame.timeDiff = t - this.frame.lastTime, this.frame.lastTime = t, this.frame.time += this.frame.timeDiff, this.frame.frameRate = 1e3 / this.frame.timeDiff;
  }
  static _addAnimation(t) {
    this.animations.push(t), this._handleAnimation();
  }
  static _removeAnimation(t) {
    const e = t.id, i = this.animations, r = i.length;
    for (let n = 0; n < r; n++)
      if (i[n].id === e) {
        this.animations.splice(n, 1);
        break;
      }
  }
  static _runFrames() {
    const t = {}, e = this.animations;
    for (let i = 0; i < e.length; i++) {
      const r = e[i], n = r.layers, s = r.func;
      r._updateFrameObject(or());
      const o = n.length;
      let l;
      if (s ? l = s.call(r, r.frame) !== !1 : l = !0, !!l)
        for (let h = 0; h < o; h++) {
          const u = n[h];
          u._id !== void 0 && (t[u._id] = u);
        }
    }
    for (const i in t)
      t.hasOwnProperty(i) && t[i].batchDraw();
  }
  static _animationLoop() {
    const t = Ct;
    t.animations.length ? (t._runFrames(), pn.Util.requestAnimFrame(t._animationLoop)) : t.animRunning = !1;
  }
  static _handleAnimation() {
    this.animRunning || (this.animRunning = !0, pn.Util.requestAnimFrame(this._animationLoop));
  }
}
Ae.Animation = Ct;
Ct.animations = [];
Ct.animIdCounter = 0;
Ct.animRunning = !1;
var aa = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Easings = a.Tween = void 0;
  const t = at, e = Ae, i = rt, r = U, n = {
    node: 1,
    duration: 1,
    easing: 1,
    onFinish: 1,
    yoyo: 1
  }, s = 1, o = 2, l = 3, h = ["fill", "stroke", "shadowColor"];
  let u = 0;
  class f {
    constructor(c, y, m, S, w, d, g) {
      this.prop = c, this.propFunc = y, this.begin = S, this._pos = S, this.duration = d, this._change = 0, this.prevPos = 0, this.yoyo = g, this._time = 0, this._position = 0, this._startTime = 0, this._finish = 0, this.func = m, this._change = w - this.begin, this.pause();
    }
    fire(c) {
      const y = this[c];
      y && y();
    }
    setTime(c) {
      c > this.duration ? this.yoyo ? (this._time = this.duration, this.reverse()) : this.finish() : c < 0 ? this.yoyo ? (this._time = 0, this.play()) : this.reset() : (this._time = c, this.update());
    }
    getTime() {
      return this._time;
    }
    setPosition(c) {
      this.prevPos = this._pos, this.propFunc(c), this._pos = c;
    }
    getPosition(c) {
      return c === void 0 && (c = this._time), this.func(c, this.begin, this._change, this.duration);
    }
    play() {
      this.state = o, this._startTime = this.getTimer() - this._time, this.onEnterFrame(), this.fire("onPlay");
    }
    reverse() {
      this.state = l, this._time = this.duration - this._time, this._startTime = this.getTimer() - this._time, this.onEnterFrame(), this.fire("onReverse");
    }
    seek(c) {
      this.pause(), this._time = c, this.update(), this.fire("onSeek");
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
      const c = this.getTimer() - this._startTime;
      this.state === o ? this.setTime(c) : this.state === l && this.setTime(this.duration - c);
    }
    pause() {
      this.state = s, this.fire("onPause");
    }
    getTimer() {
      return (/* @__PURE__ */ new Date()).getTime();
    }
  }
  class p {
    constructor(c) {
      const y = this, m = c.node, S = m._id, w = c.easing || a.Easings.Linear, d = !!c.yoyo;
      let g, b;
      typeof c.duration > "u" ? g = 0.3 : c.duration === 0 ? g = 1e-3 : g = c.duration, this.node = m, this._id = u++;
      const x = m.getLayer() || (m instanceof r.Konva.Stage ? m.getLayers() : null);
      x || t.Util.error("Tween constructor have `node` that is not in a layer. Please add node into layer first."), this.anim = new e.Animation(function() {
        y.tween.onEnterFrame();
      }, x), this.tween = new f(b, function(P) {
        y._tweenFunc(P);
      }, w, 0, 1, g * 1e3, d), this._addListeners(), p.attrs[S] || (p.attrs[S] = {}), p.attrs[S][this._id] || (p.attrs[S][this._id] = {}), p.tweens[S] || (p.tweens[S] = {});
      for (b in c)
        n[b] === void 0 && this._addAttr(b, c[b]);
      this.reset(), this.onFinish = c.onFinish, this.onReset = c.onReset, this.onUpdate = c.onUpdate;
    }
    _addAttr(c, y) {
      const m = this.node, S = m._id;
      let w, d, g, b, x;
      const P = p.tweens[S][c];
      P && delete p.attrs[S][P][c];
      let v = m.getAttr(c);
      if (t.Util._isArray(y))
        if (w = [], d = Math.max(y.length, v.length), c === "points" && y.length !== v.length && (y.length > v.length ? (b = v, v = t.Util._prepareArrayForTween(v, y, m.closed())) : (g = y, y = t.Util._prepareArrayForTween(y, v, m.closed()))), c.indexOf("fill") === 0)
          for (let E = 0; E < d; E++)
            if (E % 2 === 0)
              w.push(y[E] - v[E]);
            else {
              const k = t.Util.colorToRGBA(v[E]);
              x = t.Util.colorToRGBA(y[E]), v[E] = k, w.push({
                r: x.r - k.r,
                g: x.g - k.g,
                b: x.b - k.b,
                a: x.a - k.a
              });
            }
        else
          for (let E = 0; E < d; E++)
            w.push(y[E] - v[E]);
      else h.indexOf(c) !== -1 ? (v = t.Util.colorToRGBA(v), x = t.Util.colorToRGBA(y), w = {
        r: x.r - v.r,
        g: x.g - v.g,
        b: x.b - v.b,
        a: x.a - v.a
      }) : w = y - v;
      p.attrs[S][this._id][c] = {
        start: v,
        diff: w,
        end: y,
        trueEnd: g,
        trueStart: b
      }, p.tweens[S][c] = this._id;
    }
    _tweenFunc(c) {
      const y = this.node, m = p.attrs[y._id][this._id];
      let S, w, d, g, b, x, P, v;
      for (S in m) {
        if (w = m[S], d = w.start, g = w.diff, v = w.end, t.Util._isArray(d))
          if (b = [], P = Math.max(d.length, v.length), S.indexOf("fill") === 0)
            for (x = 0; x < P; x++)
              x % 2 === 0 ? b.push((d[x] || 0) + g[x] * c) : b.push("rgba(" + Math.round(d[x].r + g[x].r * c) + "," + Math.round(d[x].g + g[x].g * c) + "," + Math.round(d[x].b + g[x].b * c) + "," + (d[x].a + g[x].a * c) + ")");
          else
            for (x = 0; x < P; x++)
              b.push((d[x] || 0) + g[x] * c);
        else h.indexOf(S) !== -1 ? b = "rgba(" + Math.round(d.r + g.r * c) + "," + Math.round(d.g + g.g * c) + "," + Math.round(d.b + g.b * c) + "," + (d.a + g.a * c) + ")" : b = d + g * c;
        y.setAttr(S, b);
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
        const c = this.node, y = p.attrs[c._id][this._id];
        y.points && y.points.trueEnd && c.setAttr("points", y.points.trueEnd), this.onFinish && this.onFinish.call(this);
      }, this.tween.onReset = () => {
        const c = this.node, y = p.attrs[c._id][this._id];
        y.points && y.points.trueStart && c.points(y.points.trueStart), this.onReset && this.onReset();
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
    seek(c) {
      return this.tween.seek(c * 1e3), this;
    }
    pause() {
      return this.tween.pause(), this;
    }
    finish() {
      return this.tween.finish(), this;
    }
    destroy() {
      const c = this.node._id, y = this._id, m = p.tweens[c];
      this.pause(), this.anim && this.anim.stop();
      for (const S in m)
        delete p.tweens[c][S];
      delete p.attrs[c][y], p.tweens[c] && (Object.keys(p.tweens[c]).length === 0 && delete p.tweens[c], Object.keys(p.attrs[c]).length === 0 && delete p.attrs[c]);
    }
  }
  a.Tween = p, p.attrs = {}, p.tweens = {}, i.Node.prototype.to = function(_) {
    const c = _.onFinish;
    _.node = this, _.onFinish = function() {
      this.destroy(), c && c();
    }, new p(_).play();
  }, a.Easings = {
    BackEaseIn(_, c, y, m) {
      return y * (_ /= m) * _ * ((1.70158 + 1) * _ - 1.70158) + c;
    },
    BackEaseOut(_, c, y, m) {
      return y * ((_ = _ / m - 1) * _ * ((1.70158 + 1) * _ + 1.70158) + 1) + c;
    },
    BackEaseInOut(_, c, y, m) {
      let S = 1.70158;
      return (_ /= m / 2) < 1 ? y / 2 * (_ * _ * (((S *= 1.525) + 1) * _ - S)) + c : y / 2 * ((_ -= 2) * _ * (((S *= 1.525) + 1) * _ + S) + 2) + c;
    },
    ElasticEaseIn(_, c, y, m, S, w) {
      let d = 0;
      return _ === 0 ? c : (_ /= m) === 1 ? c + y : (w || (w = m * 0.3), !S || S < Math.abs(y) ? (S = y, d = w / 4) : d = w / (2 * Math.PI) * Math.asin(y / S), -(S * Math.pow(2, 10 * (_ -= 1)) * Math.sin((_ * m - d) * (2 * Math.PI) / w)) + c);
    },
    ElasticEaseOut(_, c, y, m, S, w) {
      let d = 0;
      return _ === 0 ? c : (_ /= m) === 1 ? c + y : (w || (w = m * 0.3), !S || S < Math.abs(y) ? (S = y, d = w / 4) : d = w / (2 * Math.PI) * Math.asin(y / S), S * Math.pow(2, -10 * _) * Math.sin((_ * m - d) * (2 * Math.PI) / w) + y + c);
    },
    ElasticEaseInOut(_, c, y, m, S, w) {
      let d = 0;
      return _ === 0 ? c : (_ /= m / 2) === 2 ? c + y : (w || (w = m * (0.3 * 1.5)), !S || S < Math.abs(y) ? (S = y, d = w / 4) : d = w / (2 * Math.PI) * Math.asin(y / S), _ < 1 ? -0.5 * (S * Math.pow(2, 10 * (_ -= 1)) * Math.sin((_ * m - d) * (2 * Math.PI) / w)) + c : S * Math.pow(2, -10 * (_ -= 1)) * Math.sin((_ * m - d) * (2 * Math.PI) / w) * 0.5 + y + c);
    },
    BounceEaseOut(_, c, y, m) {
      return (_ /= m) < 1 / 2.75 ? y * (7.5625 * _ * _) + c : _ < 2 / 2.75 ? y * (7.5625 * (_ -= 1.5 / 2.75) * _ + 0.75) + c : _ < 2.5 / 2.75 ? y * (7.5625 * (_ -= 2.25 / 2.75) * _ + 0.9375) + c : y * (7.5625 * (_ -= 2.625 / 2.75) * _ + 0.984375) + c;
    },
    BounceEaseIn(_, c, y, m) {
      return y - a.Easings.BounceEaseOut(m - _, 0, y, m) + c;
    },
    BounceEaseInOut(_, c, y, m) {
      return _ < m / 2 ? a.Easings.BounceEaseIn(_ * 2, 0, y, m) * 0.5 + c : a.Easings.BounceEaseOut(_ * 2 - m, 0, y, m) * 0.5 + y * 0.5 + c;
    },
    EaseIn(_, c, y, m) {
      return y * (_ /= m) * _ + c;
    },
    EaseOut(_, c, y, m) {
      return -y * (_ /= m) * (_ - 2) + c;
    },
    EaseInOut(_, c, y, m) {
      return (_ /= m / 2) < 1 ? y / 2 * _ * _ + c : -y / 2 * (--_ * (_ - 2) - 1) + c;
    },
    StrongEaseIn(_, c, y, m) {
      return y * (_ /= m) * _ * _ * _ * _ + c;
    },
    StrongEaseOut(_, c, y, m) {
      return y * ((_ = _ / m - 1) * _ * _ * _ * _ + 1) + c;
    },
    StrongEaseInOut(_, c, y, m) {
      return (_ /= m / 2) < 1 ? y / 2 * _ * _ * _ * _ * _ + c : y / 2 * ((_ -= 2) * _ * _ * _ * _ + 2) + c;
    },
    Linear(_, c, y, m) {
      return y * _ / m + c;
    }
  };
})(aa);
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Konva = void 0;
  const t = U, e = at, i = rt, r = Zt, n = ea, s = He, o = fi, l = ke, h = ci, u = gt, f = Ae, p = aa, _ = Tt, c = St;
  a.Konva = e.Util._assign(t.Konva, {
    Util: e.Util,
    Transform: e.Transform,
    Node: i.Node,
    Container: r.Container,
    Stage: n.Stage,
    stages: n.stages,
    Layer: s.Layer,
    FastLayer: o.FastLayer,
    Group: l.Group,
    DD: h.DD,
    Shape: u.Shape,
    shapes: u.shapes,
    Animation: f.Animation,
    Tween: p.Tween,
    Easings: p.Easings,
    Context: _.Context,
    Canvas: c.Canvas
  }), a.default = a.Konva;
})(Qn);
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
gi.Arc = void 0;
const pi = B, co = gt, _n = U, _i = L, uo = U;
class Ft extends co.Shape {
  _sceneFunc(t) {
    const e = _n.Konva.getAngle(this.angle()), i = this.clockwise();
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
    const t = this.innerRadius(), e = this.outerRadius(), i = this.clockwise(), r = _n.Konva.getAngle(i ? 360 - this.angle() : this.angle()), n = Math.cos(Math.min(r, Math.PI)), s = 1, o = Math.sin(Math.min(Math.max(Math.PI, r), 3 * Math.PI / 2)), l = Math.sin(Math.min(r, Math.PI / 2)), h = n * (n > 0 ? t : e), u = s * e, f = o * (o > 0 ? t : e), p = l * (l > 0 ? e : t);
    return {
      x: h,
      y: i ? -1 * p : f,
      width: u - h,
      height: p - f
    };
  }
}
gi.Arc = Ft;
Ft.prototype._centroid = !0;
Ft.prototype.className = "Arc";
Ft.prototype._attrsAffectingSize = [
  "innerRadius",
  "outerRadius",
  "angle",
  "clockwise"
];
(0, uo._registerNode)(Ft);
pi.Factory.addGetterSetter(Ft, "innerRadius", 0, (0, _i.getNumberValidator)());
pi.Factory.addGetterSetter(Ft, "outerRadius", 0, (0, _i.getNumberValidator)());
pi.Factory.addGetterSetter(Ft, "angle", 0, (0, _i.getNumberValidator)());
pi.Factory.addGetterSetter(Ft, "clockwise", !1, (0, _i.getBooleanValidator)());
var mi = {}, ze = {};
Object.defineProperty(ze, "__esModule", { value: !0 });
ze.Line = void 0;
const yi = B, fo = U, go = gt, sa = L;
function mr(a, t, e, i, r, n, s) {
  const o = Math.sqrt(Math.pow(e - a, 2) + Math.pow(i - t, 2)), l = Math.sqrt(Math.pow(r - e, 2) + Math.pow(n - i, 2)), h = s * o / (o + l), u = s * l / (o + l), f = e - h * (r - a), p = i - h * (n - t), _ = e + u * (r - a), c = i + u * (n - t);
  return [f, p, _, c];
}
function mn(a, t) {
  const e = a.length, i = [];
  for (let r = 2; r < e - 2; r += 2) {
    const n = mr(a[r - 2], a[r - 1], a[r], a[r + 1], a[r + 2], a[r + 3], t);
    isNaN(n[0]) || (i.push(n[0]), i.push(n[1]), i.push(a[r]), i.push(a[r + 1]), i.push(n[2]), i.push(n[3]));
  }
  return i;
}
class Vt extends go.Shape {
  constructor(t) {
    super(t), this.on("pointsChange.konva tensionChange.konva closedChange.konva bezierChange.konva", function() {
      this._clearCache("tensionPoints");
    });
  }
  _sceneFunc(t) {
    const e = this.points(), i = e.length, r = this.tension(), n = this.closed(), s = this.bezier();
    if (!i)
      return;
    let o = 0;
    if (t.beginPath(), t.moveTo(e[0], e[1]), r !== 0 && i > 4) {
      const l = this.getTensionPoints(), h = l.length;
      for (o = n ? 0 : 4, n || t.quadraticCurveTo(l[0], l[1], l[2], l[3]); o < h - 2; )
        t.bezierCurveTo(l[o++], l[o++], l[o++], l[o++], l[o++], l[o++]);
      n || t.quadraticCurveTo(l[h - 2], l[h - 1], e[i - 2], e[i - 1]);
    } else if (s)
      for (o = 2; o < i; )
        t.bezierCurveTo(e[o++], e[o++], e[o++], e[o++], e[o++], e[o++]);
    else
      for (o = 2; o < i; o += 2)
        t.lineTo(e[o], e[o + 1]);
    n ? (t.closePath(), t.fillStrokeShape(this)) : t.strokeShape(this);
  }
  getTensionPoints() {
    return this._getCache("tensionPoints", this._getTensionPoints);
  }
  _getTensionPoints() {
    return this.closed() ? this._getTensionPointsClosed() : mn(this.points(), this.tension());
  }
  _getTensionPointsClosed() {
    const t = this.points(), e = t.length, i = this.tension(), r = mr(t[e - 2], t[e - 1], t[0], t[1], t[2], t[3], i), n = mr(t[e - 4], t[e - 3], t[e - 2], t[e - 1], t[0], t[1], i), s = mn(t, i);
    return [r[2], r[3]].concat(s).concat([
      n[0],
      n[1],
      t[e - 2],
      t[e - 1],
      n[2],
      n[3],
      r[0],
      r[1],
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
    let e = t[0], i = t[0], r = t[1], n = t[1], s, o;
    for (let l = 0; l < t.length / 2; l++)
      s = t[l * 2], o = t[l * 2 + 1], e = Math.min(e, s), i = Math.max(i, s), r = Math.min(r, o), n = Math.max(n, o);
    return {
      x: e,
      y: r,
      width: i - e,
      height: n - r
    };
  }
}
ze.Line = Vt;
Vt.prototype.className = "Line";
Vt.prototype._attrsAffectingSize = ["points", "bezier", "tension"];
(0, fo._registerNode)(Vt);
yi.Factory.addGetterSetter(Vt, "closed", !1);
yi.Factory.addGetterSetter(Vt, "bezier", !1);
yi.Factory.addGetterSetter(Vt, "tension", 0, (0, sa.getNumberValidator)());
yi.Factory.addGetterSetter(Vt, "points", [], (0, sa.getNumberArrayValidator)());
var Pe = {}, oa = {};
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
    let h, u;
    const p = l / 2;
    h = 0;
    for (let _ = 0; _ < 20; _++)
      u = p * a.tValues[20][_] + p, h += a.cValues[20][_] * i(s, o, u);
    return p * h;
  };
  a.getCubicArcLength = t;
  const e = (s, o, l) => {
    l === void 0 && (l = 1);
    const h = s[0] - 2 * s[1] + s[2], u = o[0] - 2 * o[1] + o[2], f = 2 * s[1] - 2 * s[0], p = 2 * o[1] - 2 * o[0], _ = 4 * (h * h + u * u), c = 4 * (h * f + u * p), y = f * f + p * p;
    if (_ === 0)
      return l * Math.sqrt(Math.pow(s[2] - s[0], 2) + Math.pow(o[2] - o[0], 2));
    const m = c / (2 * _), S = y / _, w = l + m, d = S - m * m, g = w * w + d > 0 ? Math.sqrt(w * w + d) : 0, b = m * m + d > 0 ? Math.sqrt(m * m + d) : 0, x = m + Math.sqrt(m * m + d) !== 0 ? d * Math.log(Math.abs((w + g) / (m + b))) : 0;
    return Math.sqrt(_) / 2 * (w * g - m * b + x);
  };
  a.getQuadraticArcLength = e;
  function i(s, o, l) {
    const h = r(1, l, s), u = r(1, l, o), f = h * h + u * u;
    return Math.sqrt(f);
  }
  const r = (s, o, l) => {
    const h = l.length - 1;
    let u, f;
    if (h === 0)
      return 0;
    if (s === 0) {
      f = 0;
      for (let p = 0; p <= h; p++)
        f += a.binomialCoefficients[h][p] * Math.pow(1 - o, h - p) * Math.pow(o, p) * l[p];
      return f;
    } else {
      u = new Array(h);
      for (let p = 0; p < h; p++)
        u[p] = h * (l[p + 1] - l[p]);
      return r(s - 1, o, u);
    }
  }, n = (s, o, l) => {
    let h = 1, u = s / o, f = (s - l(u)) / o, p = 0;
    for (; h > 1e-3; ) {
      const _ = l(u + f), c = Math.abs(s - _) / o;
      if (c < h)
        h = c, u += f;
      else {
        const y = l(u - f), m = Math.abs(s - y) / o;
        m < h ? (h = m, u -= f) : f /= 2;
      }
      if (p++, p > 500)
        break;
    }
    return u;
  };
  a.t2length = n;
})(oa);
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.Path = void 0;
const po = B, _o = U, mo = gt, ue = oa;
class ft extends mo.Shape {
  constructor(t) {
    super(t), this.dataArray = [], this.pathLength = 0, this._readDataAttribute(), this.on("dataChange.konva", function() {
      this._readDataAttribute();
    });
  }
  _readDataAttribute() {
    this.dataArray = ft.parsePathData(this.data()), this.pathLength = ft.getPathLength(this.dataArray);
  }
  _sceneFunc(t) {
    const e = this.dataArray;
    t.beginPath();
    let i = !1;
    for (let r = 0; r < e.length; r++) {
      const n = e[r].command, s = e[r].points;
      switch (n) {
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
          const o = s[0], l = s[1], h = s[2], u = s[3], f = s[4], p = s[5], _ = s[6], c = s[7], y = h > u ? h : u, m = h > u ? 1 : h / u, S = h > u ? u / h : 1;
          t.translate(o, l), t.rotate(_), t.scale(m, S), t.arc(0, 0, y, f, f + p, 1 - c), t.scale(1 / m, 1 / S), t.rotate(-_), t.translate(-o, -l);
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
        const h = l.points[4], u = l.points[5], f = l.points[4] + u;
        let p = Math.PI / 180;
        if (Math.abs(h - f) < p && (p = Math.abs(h - f)), u < 0)
          for (let _ = h - p; _ > f; _ -= p) {
            const c = ft.getPointOnEllipticalArc(l.points[0], l.points[1], l.points[2], l.points[3], _, 0);
            t.push(c.x, c.y);
          }
        else
          for (let _ = h + p; _ < f; _ += p) {
            const c = ft.getPointOnEllipticalArc(l.points[0], l.points[1], l.points[2], l.points[3], _, 0);
            t.push(c.x, c.y);
          }
      } else if (l.command === "C")
        for (let h = 0; h <= 1; h += 0.01) {
          const u = ft.getPointOnCubicBezier(h, l.start.x, l.start.y, l.points[0], l.points[1], l.points[2], l.points[3], l.points[4], l.points[5]);
          t.push(u.x, u.y);
        }
      else
        t = t.concat(l.points);
    });
    let e = t[0], i = t[0], r = t[1], n = t[1], s, o;
    for (let l = 0; l < t.length / 2; l++)
      s = t[l * 2], o = t[l * 2 + 1], isNaN(s) || (e = Math.min(e, s), i = Math.max(i, s)), isNaN(o) || (r = Math.min(r, o), n = Math.max(n, o));
    return {
      x: e,
      y: r,
      width: i - e,
      height: n - r
    };
  }
  getLength() {
    return this.pathLength;
  }
  getPointAtLength(t) {
    return ft.getPointAtLengthOfDataArray(t, this.dataArray);
  }
  static getLineLength(t, e, i, r) {
    return Math.sqrt((i - t) * (i - t) + (r - e) * (r - e));
  }
  static getPathLength(t) {
    let e = 0;
    for (let i = 0; i < t.length; ++i)
      e += t[i].pathLength;
    return e;
  }
  static getPointAtLengthOfDataArray(t, e) {
    let i, r = 0, n = e.length;
    if (!n)
      return null;
    for (; r < n && t > e[r].pathLength; )
      t -= e[r].pathLength, ++r;
    if (r === n)
      return i = e[r - 1].points.slice(-2), {
        x: i[0],
        y: i[1]
      };
    if (t < 0.01)
      return e[r].command === "M" ? (i = e[r].points.slice(0, 2), {
        x: i[0],
        y: i[1]
      }) : {
        x: e[r].start.x,
        y: e[r].start.y
      };
    const s = e[r], o = s.points;
    switch (s.command) {
      case "L":
        return ft.getPointOnLine(t, s.start.x, s.start.y, o[0], o[1]);
      case "C":
        return ft.getPointOnCubicBezier((0, ue.t2length)(t, ft.getPathLength(e), (y) => (0, ue.getCubicArcLength)([s.start.x, o[0], o[2], o[4]], [s.start.y, o[1], o[3], o[5]], y)), s.start.x, s.start.y, o[0], o[1], o[2], o[3], o[4], o[5]);
      case "Q":
        return ft.getPointOnQuadraticBezier((0, ue.t2length)(t, ft.getPathLength(e), (y) => (0, ue.getQuadraticArcLength)([s.start.x, o[0], o[2]], [s.start.y, o[1], o[3]], y)), s.start.x, s.start.y, o[0], o[1], o[2], o[3]);
      case "A":
        const l = o[0], h = o[1], u = o[2], f = o[3], p = o[5], _ = o[6];
        let c = o[4];
        return c += p * t / s.pathLength, ft.getPointOnEllipticalArc(l, h, u, f, c, _);
    }
    return null;
  }
  static getPointOnLine(t, e, i, r, n, s, o) {
    s = s ?? e, o = o ?? i;
    const l = this.getLineLength(e, i, r, n);
    if (l < 1e-10)
      return { x: e, y: i };
    if (r === e)
      return { x: s, y: o + (n > i ? t : -t) };
    const h = (n - i) / (r - e), u = Math.sqrt(t * t / (1 + h * h)) * (r < e ? -1 : 1), f = h * u;
    if (Math.abs(o - i - h * (s - e)) < 1e-10)
      return { x: s + u, y: o + f };
    const p = ((s - e) * (r - e) + (o - i) * (n - i)) / (l * l), _ = e + p * (r - e), c = i + p * (n - i), y = this.getLineLength(s, o, _, c), m = Math.sqrt(t * t - y * y), S = Math.sqrt(m * m / (1 + h * h)) * (r < e ? -1 : 1), w = h * S;
    return { x: _ + S, y: c + w };
  }
  static getPointOnCubicBezier(t, e, i, r, n, s, o, l, h) {
    function u(m) {
      return m * m * m;
    }
    function f(m) {
      return 3 * m * m * (1 - m);
    }
    function p(m) {
      return 3 * m * (1 - m) * (1 - m);
    }
    function _(m) {
      return (1 - m) * (1 - m) * (1 - m);
    }
    const c = l * u(t) + s * f(t) + r * p(t) + e * _(t), y = h * u(t) + o * f(t) + n * p(t) + i * _(t);
    return { x: c, y };
  }
  static getPointOnQuadraticBezier(t, e, i, r, n, s, o) {
    function l(_) {
      return _ * _;
    }
    function h(_) {
      return 2 * _ * (1 - _);
    }
    function u(_) {
      return (1 - _) * (1 - _);
    }
    const f = s * l(t) + r * h(t) + e * u(t), p = o * l(t) + n * h(t) + i * u(t);
    return { x: f, y: p };
  }
  static getPointOnEllipticalArc(t, e, i, r, n, s) {
    const o = Math.cos(s), l = Math.sin(s), h = {
      x: i * Math.cos(n),
      y: r * Math.sin(n)
    };
    return {
      x: t + (h.x * o - h.y * l),
      y: e + (h.x * l + h.y * o)
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
    for (let f = 0; f < i.length; f++)
      e = e.replace(new RegExp(i[f], "g"), "|" + i[f]);
    const r = e.split("|"), n = [], s = [];
    let o = 0, l = 0;
    const h = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
    let u;
    for (let f = 1; f < r.length; f++) {
      let p = r[f], _ = p.charAt(0);
      for (p = p.slice(1), s.length = 0; u = h.exec(p); )
        s.push(u[0]);
      const c = [];
      for (let y = 0, m = s.length; y < m; y++) {
        if (s[y] === "00") {
          c.push(0, 0);
          continue;
        }
        const S = parseFloat(s[y]);
        isNaN(S) ? c.push(0) : c.push(S);
      }
      for (; c.length > 0 && !isNaN(c[0]); ) {
        let y = "", m = [];
        const S = o, w = l;
        let d, g, b, x, P, v, E, k, M, T;
        switch (_) {
          case "l":
            o += c.shift(), l += c.shift(), y = "L", m.push(o, l);
            break;
          case "L":
            o = c.shift(), l = c.shift(), m.push(o, l);
            break;
          case "m":
            const A = c.shift(), F = c.shift();
            if (o += A, l += F, y = "M", n.length > 2 && n[n.length - 1].command === "z") {
              for (let $ = n.length - 2; $ >= 0; $--)
                if (n[$].command === "M") {
                  o = n[$].points[0] + A, l = n[$].points[1] + F;
                  break;
                }
            }
            m.push(o, l), _ = "l";
            break;
          case "M":
            o = c.shift(), l = c.shift(), y = "M", m.push(o, l), _ = "L";
            break;
          case "h":
            o += c.shift(), y = "L", m.push(o, l);
            break;
          case "H":
            o = c.shift(), y = "L", m.push(o, l);
            break;
          case "v":
            l += c.shift(), y = "L", m.push(o, l);
            break;
          case "V":
            l = c.shift(), y = "L", m.push(o, l);
            break;
          case "C":
            m.push(c.shift(), c.shift(), c.shift(), c.shift()), o = c.shift(), l = c.shift(), m.push(o, l);
            break;
          case "c":
            m.push(o + c.shift(), l + c.shift(), o + c.shift(), l + c.shift()), o += c.shift(), l += c.shift(), y = "C", m.push(o, l);
            break;
          case "S":
            g = o, b = l, d = n[n.length - 1], d.command === "C" && (g = o + (o - d.points[2]), b = l + (l - d.points[3])), m.push(g, b, c.shift(), c.shift()), o = c.shift(), l = c.shift(), y = "C", m.push(o, l);
            break;
          case "s":
            g = o, b = l, d = n[n.length - 1], d.command === "C" && (g = o + (o - d.points[2]), b = l + (l - d.points[3])), m.push(g, b, o + c.shift(), l + c.shift()), o += c.shift(), l += c.shift(), y = "C", m.push(o, l);
            break;
          case "Q":
            m.push(c.shift(), c.shift()), o = c.shift(), l = c.shift(), m.push(o, l);
            break;
          case "q":
            m.push(o + c.shift(), l + c.shift()), o += c.shift(), l += c.shift(), y = "Q", m.push(o, l);
            break;
          case "T":
            g = o, b = l, d = n[n.length - 1], d.command === "Q" && (g = o + (o - d.points[0]), b = l + (l - d.points[1])), o = c.shift(), l = c.shift(), y = "Q", m.push(g, b, o, l);
            break;
          case "t":
            g = o, b = l, d = n[n.length - 1], d.command === "Q" && (g = o + (o - d.points[0]), b = l + (l - d.points[1])), o += c.shift(), l += c.shift(), y = "Q", m.push(g, b, o, l);
            break;
          case "A":
            x = c.shift(), P = c.shift(), v = c.shift(), E = c.shift(), k = c.shift(), M = o, T = l, o = c.shift(), l = c.shift(), y = "A", m = this.convertEndpointToCenterParameterization(M, T, o, l, E, k, x, P, v);
            break;
          case "a":
            x = c.shift(), P = c.shift(), v = c.shift(), E = c.shift(), k = c.shift(), M = o, T = l, o += c.shift(), l += c.shift(), y = "A", m = this.convertEndpointToCenterParameterization(M, T, o, l, E, k, x, P, v);
            break;
        }
        n.push({
          command: y || _,
          points: m,
          start: {
            x: S,
            y: w
          },
          pathLength: this.calcLength(S, w, y || _, m)
        });
      }
      (_ === "z" || _ === "Z") && n.push({
        command: "z",
        points: [],
        start: void 0,
        pathLength: 0
      });
    }
    return n;
  }
  static calcLength(t, e, i, r) {
    let n, s, o, l;
    const h = ft;
    switch (i) {
      case "L":
        return h.getLineLength(t, e, r[0], r[1]);
      case "C":
        return (0, ue.getCubicArcLength)([t, r[0], r[2], r[4]], [e, r[1], r[3], r[5]], 1);
      case "Q":
        return (0, ue.getQuadraticArcLength)([t, r[0], r[2]], [e, r[1], r[3]], 1);
      case "A":
        n = 0;
        const u = r[4], f = r[5], p = r[4] + f;
        let _ = Math.PI / 180;
        if (Math.abs(u - p) < _ && (_ = Math.abs(u - p)), s = h.getPointOnEllipticalArc(r[0], r[1], r[2], r[3], u, 0), f < 0)
          for (l = u - _; l > p; l -= _)
            o = h.getPointOnEllipticalArc(r[0], r[1], r[2], r[3], l, 0), n += h.getLineLength(s.x, s.y, o.x, o.y), s = o;
        else
          for (l = u + _; l < p; l += _)
            o = h.getPointOnEllipticalArc(r[0], r[1], r[2], r[3], l, 0), n += h.getLineLength(s.x, s.y, o.x, o.y), s = o;
        return o = h.getPointOnEllipticalArc(r[0], r[1], r[2], r[3], p, 0), n += h.getLineLength(s.x, s.y, o.x, o.y), n;
    }
    return 0;
  }
  static convertEndpointToCenterParameterization(t, e, i, r, n, s, o, l, h) {
    const u = h * (Math.PI / 180), f = Math.cos(u) * (t - i) / 2 + Math.sin(u) * (e - r) / 2, p = -1 * Math.sin(u) * (t - i) / 2 + Math.cos(u) * (e - r) / 2, _ = f * f / (o * o) + p * p / (l * l);
    _ > 1 && (o *= Math.sqrt(_), l *= Math.sqrt(_));
    let c = Math.sqrt((o * o * (l * l) - o * o * (p * p) - l * l * (f * f)) / (o * o * (p * p) + l * l * (f * f)));
    n === s && (c *= -1), isNaN(c) && (c = 0);
    const y = c * o * p / l, m = c * -l * f / o, S = (t + i) / 2 + Math.cos(u) * y - Math.sin(u) * m, w = (e + r) / 2 + Math.sin(u) * y + Math.cos(u) * m, d = function(k) {
      return Math.sqrt(k[0] * k[0] + k[1] * k[1]);
    }, g = function(k, M) {
      return (k[0] * M[0] + k[1] * M[1]) / (d(k) * d(M));
    }, b = function(k, M) {
      return (k[0] * M[1] < k[1] * M[0] ? -1 : 1) * Math.acos(g(k, M));
    }, x = b([1, 0], [(f - y) / o, (p - m) / l]), P = [(f - y) / o, (p - m) / l], v = [(-1 * f - y) / o, (-1 * p - m) / l];
    let E = b(P, v);
    return g(P, v) <= -1 && (E = Math.PI), g(P, v) >= 1 && (E = 0), s === 0 && E > 0 && (E = E - 2 * Math.PI), s === 1 && E < 0 && (E = E + 2 * Math.PI), [S, w, o, l, x, E, u, s];
  }
}
Pe.Path = ft;
ft.prototype.className = "Path";
ft.prototype._attrsAffectingSize = ["data"];
(0, _o._registerNode)(ft);
po.Factory.addGetterSetter(ft, "data");
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.Arrow = void 0;
const bi = B, yo = ze, la = L, bo = U, yn = Pe;
class ee extends yo.Line {
  _sceneFunc(t) {
    super._sceneFunc(t);
    const e = Math.PI * 2, i = this.points();
    let r = i;
    const n = this.tension() !== 0 && i.length > 4;
    n && (r = this.getTensionPoints());
    const s = this.pointerLength(), o = i.length;
    let l, h;
    if (n) {
      const p = [
        r[r.length - 4],
        r[r.length - 3],
        r[r.length - 2],
        r[r.length - 1],
        i[o - 2],
        i[o - 1]
      ], _ = yn.Path.calcLength(r[r.length - 4], r[r.length - 3], "C", p), c = yn.Path.getPointOnQuadraticBezier(Math.min(1, 1 - s / _), p[0], p[1], p[2], p[3], p[4], p[5]);
      l = i[o - 2] - c.x, h = i[o - 1] - c.y;
    } else
      l = i[o - 2] - i[o - 4], h = i[o - 1] - i[o - 3];
    const u = (Math.atan2(h, l) + e) % e, f = this.pointerWidth();
    this.pointerAtEnding() && (t.save(), t.beginPath(), t.translate(i[o - 2], i[o - 1]), t.rotate(u), t.moveTo(0, 0), t.lineTo(-s, f / 2), t.lineTo(-s, -f / 2), t.closePath(), t.restore(), this.__fillStroke(t)), this.pointerAtBeginning() && (t.save(), t.beginPath(), t.translate(i[0], i[1]), n ? (l = (r[0] + r[2]) / 2 - i[0], h = (r[1] + r[3]) / 2 - i[1]) : (l = i[2] - i[0], h = i[3] - i[1]), t.rotate((Math.atan2(-h, -l) + e) % e), t.moveTo(0, 0), t.lineTo(-s, f / 2), t.lineTo(-s, -f / 2), t.closePath(), t.restore(), this.__fillStroke(t));
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
mi.Arrow = ee;
ee.prototype.className = "Arrow";
(0, bo._registerNode)(ee);
bi.Factory.addGetterSetter(ee, "pointerLength", 10, (0, la.getNumberValidator)());
bi.Factory.addGetterSetter(ee, "pointerWidth", 10, (0, la.getNumberValidator)());
bi.Factory.addGetterSetter(ee, "pointerAtBeginning", !1);
bi.Factory.addGetterSetter(ee, "pointerAtEnding", !0);
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
vi.Circle = void 0;
const vo = B, So = gt, wo = L, Co = U;
class Ee extends So.Shape {
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
vi.Circle = Ee;
Ee.prototype._centroid = !0;
Ee.prototype.className = "Circle";
Ee.prototype._attrsAffectingSize = ["radius"];
(0, Co._registerNode)(Ee);
vo.Factory.addGetterSetter(Ee, "radius", 0, (0, wo.getNumberValidator)());
var Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.Ellipse = void 0;
const Dr = B, xo = gt, ha = L, ko = U;
class Ht extends xo.Shape {
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
Si.Ellipse = Ht;
Ht.prototype.className = "Ellipse";
Ht.prototype._centroid = !0;
Ht.prototype._attrsAffectingSize = ["radiusX", "radiusY"];
(0, ko._registerNode)(Ht);
Dr.Factory.addComponentsGetterSetter(Ht, "radius", ["x", "y"]);
Dr.Factory.addGetterSetter(Ht, "radiusX", 0, (0, ha.getNumberValidator)());
Dr.Factory.addGetterSetter(Ht, "radiusY", 0, (0, ha.getNumberValidator)());
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
wi.Image = void 0;
const lr = at, ie = B, Ao = gt, Po = U, We = L;
let xt = class da extends Ao.Shape {
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
    const e = this.getWidth(), i = this.getHeight(), r = this.cornerRadius(), n = this.attrs.image;
    let s;
    if (n) {
      const o = this.attrs.cropWidth, l = this.attrs.cropHeight;
      o && l ? s = [
        n,
        this.cropX(),
        this.cropY(),
        o,
        l,
        0,
        0,
        e,
        i
      ] : s = [n, 0, 0, e, i];
    }
    (this.hasFill() || this.hasStroke() || r) && (t.beginPath(), r ? lr.Util.drawRoundedRectPath(t, e, i, r) : t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this)), n && (r && t.clip(), t.drawImage.apply(t, s));
  }
  _hitFunc(t) {
    const e = this.width(), i = this.height(), r = this.cornerRadius();
    t.beginPath(), r ? lr.Util.drawRoundedRectPath(t, e, i, r) : t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this);
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
    const r = lr.Util.createImageElement();
    r.onload = function() {
      const n = new da({
        image: r
      });
      e(n);
    }, r.onerror = i, r.crossOrigin = "Anonymous", r.src = t;
  }
};
wi.Image = xt;
xt.prototype.className = "Image";
(0, Po._registerNode)(xt);
ie.Factory.addGetterSetter(xt, "cornerRadius", 0, (0, We.getNumberOrArrayOfNumbersValidator)(4));
ie.Factory.addGetterSetter(xt, "image");
ie.Factory.addComponentsGetterSetter(xt, "crop", ["x", "y", "width", "height"]);
ie.Factory.addGetterSetter(xt, "cropX", 0, (0, We.getNumberValidator)());
ie.Factory.addGetterSetter(xt, "cropY", 0, (0, We.getNumberValidator)());
ie.Factory.addGetterSetter(xt, "cropWidth", 0, (0, We.getNumberValidator)());
ie.Factory.addGetterSetter(xt, "cropHeight", 0, (0, We.getNumberValidator)());
var ye = {};
Object.defineProperty(ye, "__esModule", { value: !0 });
ye.Tag = ye.Label = void 0;
const Ci = B, Eo = gt, Mo = ke, Nr = L, ca = U, ua = [
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
], To = "Change.konva", Ro = "none", yr = "up", br = "right", vr = "down", Sr = "left", $o = ua.length;
class Lr extends Mo.Group {
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
    const r = function() {
      e._sync();
    };
    for (i = 0; i < $o; i++)
      t.on(ua[i] + To, r);
  }
  getWidth() {
    return this.getText().width();
  }
  getHeight() {
    return this.getText().height();
  }
  _sync() {
    let t = this.getText(), e = this.getTag(), i, r, n, s, o, l, h;
    if (t && e) {
      switch (i = t.width(), r = t.height(), n = e.pointerDirection(), s = e.pointerWidth(), h = e.pointerHeight(), o = 0, l = 0, n) {
        case yr:
          o = i / 2, l = -1 * h;
          break;
        case br:
          o = i + s, l = r / 2;
          break;
        case vr:
          o = i / 2, l = r + h;
          break;
        case Sr:
          o = -1 * s, l = r / 2;
          break;
      }
      e.setAttrs({
        x: -1 * o,
        y: -1 * l,
        width: i,
        height: r
      }), t.setAttrs({
        x: -1 * o,
        y: -1 * l
      });
    }
  }
}
ye.Label = Lr;
Lr.prototype.className = "Label";
(0, ca._registerNode)(Lr);
class re extends Eo.Shape {
  _sceneFunc(t) {
    const e = this.width(), i = this.height(), r = this.pointerDirection(), n = this.pointerWidth(), s = this.pointerHeight(), o = this.cornerRadius();
    let l = 0, h = 0, u = 0, f = 0;
    typeof o == "number" ? l = h = u = f = Math.min(o, e / 2, i / 2) : (l = Math.min(o[0] || 0, e / 2, i / 2), h = Math.min(o[1] || 0, e / 2, i / 2), f = Math.min(o[2] || 0, e / 2, i / 2), u = Math.min(o[3] || 0, e / 2, i / 2)), t.beginPath(), t.moveTo(l, 0), r === yr && (t.lineTo((e - n) / 2, 0), t.lineTo(e / 2, -1 * s), t.lineTo((e + n) / 2, 0)), t.lineTo(e - h, 0), t.arc(e - h, h, h, Math.PI * 3 / 2, 0, !1), r === br && (t.lineTo(e, (i - s) / 2), t.lineTo(e + n, i / 2), t.lineTo(e, (i + s) / 2)), t.lineTo(e, i - f), t.arc(e - f, i - f, f, 0, Math.PI / 2, !1), r === vr && (t.lineTo((e + n) / 2, i), t.lineTo(e / 2, i + s), t.lineTo((e - n) / 2, i)), t.lineTo(u, i), t.arc(u, i - u, u, Math.PI / 2, Math.PI, !1), r === Sr && (t.lineTo(0, (i + s) / 2), t.lineTo(-1 * n, i / 2), t.lineTo(0, (i - s) / 2)), t.lineTo(0, l), t.arc(l, l, l, Math.PI, Math.PI * 3 / 2, !1), t.closePath(), t.fillStrokeShape(this);
  }
  getSelfRect() {
    let t = 0, e = 0, i = this.pointerWidth(), r = this.pointerHeight(), n = this.pointerDirection(), s = this.width(), o = this.height();
    return n === yr ? (e -= r, o += r) : n === vr ? o += r : n === Sr ? (t -= i * 1.5, s += i) : n === br && (s += i * 1.5), {
      x: t,
      y: e,
      width: s,
      height: o
    };
  }
}
ye.Tag = re;
re.prototype.className = "Tag";
(0, ca._registerNode)(re);
Ci.Factory.addGetterSetter(re, "pointerDirection", Ro);
Ci.Factory.addGetterSetter(re, "pointerWidth", 0, (0, Nr.getNumberValidator)());
Ci.Factory.addGetterSetter(re, "pointerHeight", 0, (0, Nr.getNumberValidator)());
Ci.Factory.addGetterSetter(re, "cornerRadius", 0, (0, Nr.getNumberOrArrayOfNumbersValidator)(4));
var je = {};
Object.defineProperty(je, "__esModule", { value: !0 });
je.Rect = void 0;
const Fo = B, Oo = gt, Do = U, No = at, Lo = L;
class xi extends Oo.Shape {
  _sceneFunc(t) {
    const e = this.cornerRadius(), i = this.width(), r = this.height();
    t.beginPath(), e ? No.Util.drawRoundedRectPath(t, i, r, e) : t.rect(0, 0, i, r), t.closePath(), t.fillStrokeShape(this);
  }
}
je.Rect = xi;
xi.prototype.className = "Rect";
(0, Do._registerNode)(xi);
Fo.Factory.addGetterSetter(xi, "cornerRadius", 0, (0, Lo.getNumberOrArrayOfNumbersValidator)(4));
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.RegularPolygon = void 0;
const fa = B, Go = gt, ga = L, Io = U;
class ne extends Go.Shape {
  _sceneFunc(t) {
    const e = this._getPoints();
    t.beginPath(), t.moveTo(e[0].x, e[0].y);
    for (let i = 1; i < e.length; i++)
      t.lineTo(e[i].x, e[i].y);
    t.closePath(), t.fillStrokeShape(this);
  }
  _getPoints() {
    const t = this.attrs.sides, e = this.attrs.radius || 0, i = [];
    for (let r = 0; r < t; r++)
      i.push({
        x: e * Math.sin(r * 2 * Math.PI / t),
        y: -1 * e * Math.cos(r * 2 * Math.PI / t)
      });
    return i;
  }
  getSelfRect() {
    const t = this._getPoints();
    let e = t[0].x, i = t[0].y, r = t[0].x, n = t[0].y;
    return t.forEach((s) => {
      e = Math.min(e, s.x), i = Math.max(i, s.x), r = Math.min(r, s.y), n = Math.max(n, s.y);
    }), {
      x: e,
      y: r,
      width: i - e,
      height: n - r
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
ki.RegularPolygon = ne;
ne.prototype.className = "RegularPolygon";
ne.prototype._centroid = !0;
ne.prototype._attrsAffectingSize = ["radius"];
(0, Io._registerNode)(ne);
fa.Factory.addGetterSetter(ne, "radius", 0, (0, ga.getNumberValidator)());
fa.Factory.addGetterSetter(ne, "sides", 0, (0, ga.getNumberValidator)());
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.Ring = void 0;
const pa = B, Uo = gt, _a = L, Bo = U, bn = Math.PI * 2;
class ae extends Uo.Shape {
  _sceneFunc(t) {
    t.beginPath(), t.arc(0, 0, this.innerRadius(), 0, bn, !1), t.moveTo(this.outerRadius(), 0), t.arc(0, 0, this.outerRadius(), bn, 0, !0), t.closePath(), t.fillStrokeShape(this);
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
Ai.Ring = ae;
ae.prototype.className = "Ring";
ae.prototype._centroid = !0;
ae.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"];
(0, Bo._registerNode)(ae);
pa.Factory.addGetterSetter(ae, "innerRadius", 0, (0, _a.getNumberValidator)());
pa.Factory.addGetterSetter(ae, "outerRadius", 0, (0, _a.getNumberValidator)());
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.Sprite = void 0;
const se = B, Vo = gt, Ho = Ae, ma = L, zo = U;
class kt extends Vo.Shape {
  constructor(t) {
    super(t), this._updated = !0, this.anim = new Ho.Animation(() => {
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
    const e = this.animation(), i = this.frameIndex(), r = i * 4, n = this.animations()[e], s = this.frameOffsets(), o = n[r + 0], l = n[r + 1], h = n[r + 2], u = n[r + 3], f = this.image();
    if ((this.hasFill() || this.hasStroke()) && (t.beginPath(), t.rect(0, 0, h, u), t.closePath(), t.fillStrokeShape(this)), f)
      if (s) {
        const p = s[e], _ = i * 2;
        t.drawImage(f, o, l, h, u, p[_ + 0], p[_ + 1], h, u);
      } else
        t.drawImage(f, o, l, h, u, 0, 0, h, u);
  }
  _hitFunc(t) {
    const e = this.animation(), i = this.frameIndex(), r = i * 4, n = this.animations()[e], s = this.frameOffsets(), o = n[r + 2], l = n[r + 3];
    if (t.beginPath(), s) {
      const h = s[e], u = i * 2;
      t.rect(h[u + 0], h[u + 1], o, l);
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
    const t = this.frameIndex(), e = this.animation(), i = this.animations(), r = i[e], n = r.length / 4;
    t < n - 1 ? this.frameIndex(t + 1) : this.frameIndex(0);
  }
}
Pi.Sprite = kt;
kt.prototype.className = "Sprite";
(0, zo._registerNode)(kt);
se.Factory.addGetterSetter(kt, "animation");
se.Factory.addGetterSetter(kt, "animations");
se.Factory.addGetterSetter(kt, "frameOffsets");
se.Factory.addGetterSetter(kt, "image");
se.Factory.addGetterSetter(kt, "frameIndex", 0, (0, ma.getNumberValidator)());
se.Factory.addGetterSetter(kt, "frameRate", 17, (0, ma.getNumberValidator)());
se.Factory.backCompat(kt, {
  index: "frameIndex",
  getIndex: "getFrameIndex",
  setIndex: "setFrameIndex"
});
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.Star = void 0;
const Gr = B, Wo = gt, Ir = L, jo = U;
class zt extends Wo.Shape {
  _sceneFunc(t) {
    const e = this.innerRadius(), i = this.outerRadius(), r = this.numPoints();
    t.beginPath(), t.moveTo(0, 0 - i);
    for (let n = 1; n < r * 2; n++) {
      const s = n % 2 === 0 ? i : e, o = s * Math.sin(n * Math.PI / r), l = -1 * s * Math.cos(n * Math.PI / r);
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
Ei.Star = zt;
zt.prototype.className = "Star";
zt.prototype._centroid = !0;
zt.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"];
(0, jo._registerNode)(zt);
Gr.Factory.addGetterSetter(zt, "numPoints", 5, (0, Ir.getNumberValidator)());
Gr.Factory.addGetterSetter(zt, "innerRadius", 0, (0, Ir.getNumberValidator)());
Gr.Factory.addGetterSetter(zt, "outerRadius", 0, (0, Ir.getNumberValidator)());
var Me = {};
Object.defineProperty(Me, "__esModule", { value: !0 });
Me.Text = void 0;
Me.stringToArray = Xt;
const wr = at, _t = B, Yo = gt, hr = U, Wt = L, Ko = U;
function Xt(a) {
  return [...a].reduce((t, e, i, r) => {
    if (new RegExp("\\p{Emoji}", "u").test(e)) {
      const n = r[i + 1];
      n && new RegExp("\\p{Emoji_Modifier}|\\u200D", "u").test(n) ? (t.push(e + n), r[i + 1] = "") : t.push(e);
    } else new RegExp("\\p{Regional_Indicator}{2}", "u").test(e + (r[i + 1] || "")) ? t.push(e + r[i + 1]) : i > 0 && new RegExp("\\p{Mn}|\\p{Me}|\\p{Mc}", "u").test(e) ? t[t.length - 1] += e : e && t.push(e);
    return t;
  }, []);
}
const fe = "auto", Xo = "center", ya = "inherit", Re = "justify", qo = "Change.konva", Qo = "2d", vn = "-", ba = "left", Jo = "text", Zo = "Text", tl = "top", el = "bottom", Sn = "middle", va = "normal", il = "px ", Xe = " ", rl = "right", wn = "rtl", nl = "word", al = "char", Cn = "none", dr = "…", Sa = [
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
], sl = Sa.length;
function ol(a) {
  return a.split(",").map((t) => {
    t = t.trim();
    const e = t.indexOf(" ") >= 0, i = t.indexOf('"') >= 0 || t.indexOf("'") >= 0;
    return e && !i && (t = `"${t}"`), t;
  }).join(", ");
}
let qe;
function cr() {
  return qe || (qe = wr.Util.createCanvasElement().getContext(Qo), qe);
}
function ll(a) {
  a.fillText(this._partialText, this._partialTextX, this._partialTextY);
}
function hl(a) {
  a.setAttr("miterLimit", 2), a.strokeText(this._partialText, this._partialTextX, this._partialTextY);
}
function dl(a) {
  return a = a || {}, !a.fillLinearGradientColorStops && !a.fillRadialGradientColorStops && !a.fillPatternImage && (a.fill = a.fill || "black"), a;
}
class ot extends Yo.Shape {
  constructor(t) {
    super(dl(t)), this._partialTextX = 0, this._partialTextY = 0;
    for (let e = 0; e < sl; e++)
      this.on(Sa[e] + qo, this._setTextData);
    this._setTextData();
  }
  _sceneFunc(t) {
    const e = this.textArr, i = e.length;
    if (!this.text())
      return;
    let r = this.padding(), n = this.fontSize(), s = this.lineHeight() * n, o = this.verticalAlign(), l = this.direction(), h = 0, u = this.align(), f = this.getWidth(), p = this.letterSpacing(), _ = this.fill(), c = this.textDecoration(), y = c.indexOf("underline") !== -1, m = c.indexOf("line-through") !== -1, S;
    l = l === ya ? t.direction : l;
    let w = s / 2, d = Sn;
    if (hr.Konva._fixTextRendering) {
      const g = this.measureSize("M");
      d = "alphabetic", w = (g.fontBoundingBoxAscent - g.fontBoundingBoxDescent) / 2 + s / 2;
    }
    for (l === wn && t.setAttr("direction", l), t.setAttr("font", this._getContextFont()), t.setAttr("textBaseline", d), t.setAttr("textAlign", ba), o === Sn ? h = (this.getHeight() - i * s - r * 2) / 2 : o === el && (h = this.getHeight() - i * s - r * 2), t.translate(r, h + r), S = 0; S < i; S++) {
      let g = 0, b = 0;
      const x = e[S], P = x.text, v = x.width, E = x.lastInParagraph;
      if (t.save(), u === rl ? g += f - v - r * 2 : u === Xo && (g += (f - v - r * 2) / 2), y) {
        t.save(), t.beginPath();
        const k = hr.Konva._fixTextRendering ? Math.round(n / 4) : Math.round(n / 2), M = g, T = w + b + k;
        t.moveTo(M, T);
        const A = u === Re && !E ? f - r * 2 : v;
        t.lineTo(M + Math.round(A), T), t.lineWidth = n / 15;
        const F = this._getLinearGradient();
        t.strokeStyle = F || _, t.stroke(), t.restore();
      }
      if (m) {
        t.save(), t.beginPath();
        const k = hr.Konva._fixTextRendering ? -Math.round(n / 4) : 0;
        t.moveTo(g, w + b + k);
        const M = u === Re && !E ? f - r * 2 : v;
        t.lineTo(g + Math.round(M), w + b + k), t.lineWidth = n / 15;
        const T = this._getLinearGradient();
        t.strokeStyle = T || _, t.stroke(), t.restore();
      }
      if (l !== wn && (p !== 0 || u === Re)) {
        const k = P.split(" ").length - 1, M = Xt(P);
        for (let T = 0; T < M.length; T++) {
          const A = M[T];
          A === " " && !E && u === Re && (g += (f - r * 2 - v) / k), this._partialTextX = g, this._partialTextY = w + b, this._partialText = A, t.fillStrokeShape(this), g += this.measureSize(A).width + p;
        }
      } else
        p !== 0 && t.setAttr("letterSpacing", `${p}px`), this._partialTextX = g, this._partialTextY = w + b, this._partialText = P, t.fillStrokeShape(this);
      t.restore(), i > 1 && (w += s);
    }
  }
  _hitFunc(t) {
    const e = this.getWidth(), i = this.getHeight();
    t.beginPath(), t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this);
  }
  setText(t) {
    const e = wr.Util._isString(t) ? t : t == null ? "" : t + "";
    return this._setAttr(Jo, e), this;
  }
  getWidth() {
    return this.attrs.width === fe || this.attrs.width === void 0 ? this.getTextWidth() + this.padding() * 2 : this.attrs.width;
  }
  getHeight() {
    return this.attrs.height === fe || this.attrs.height === void 0 ? this.fontSize() * this.textArr.length * this.lineHeight() + this.padding() * 2 : this.attrs.height;
  }
  getTextWidth() {
    return this.textWidth;
  }
  getTextHeight() {
    return wr.Util.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height."), this.textHeight;
  }
  measureSize(t) {
    var e, i, r, n, s, o, l, h, u, f, p;
    let _ = cr(), c = this.fontSize(), y;
    _.save(), _.font = this._getContextFont(), y = _.measureText(t), _.restore();
    const m = c / 100;
    return {
      actualBoundingBoxAscent: (e = y.actualBoundingBoxAscent) !== null && e !== void 0 ? e : 71.58203125 * m,
      actualBoundingBoxDescent: (i = y.actualBoundingBoxDescent) !== null && i !== void 0 ? i : 0,
      actualBoundingBoxLeft: (r = y.actualBoundingBoxLeft) !== null && r !== void 0 ? r : -7.421875 * m,
      actualBoundingBoxRight: (n = y.actualBoundingBoxRight) !== null && n !== void 0 ? n : 75.732421875 * m,
      alphabeticBaseline: (s = y.alphabeticBaseline) !== null && s !== void 0 ? s : 0,
      emHeightAscent: (o = y.emHeightAscent) !== null && o !== void 0 ? o : 100 * m,
      emHeightDescent: (l = y.emHeightDescent) !== null && l !== void 0 ? l : -20 * m,
      fontBoundingBoxAscent: (h = y.fontBoundingBoxAscent) !== null && h !== void 0 ? h : 91 * m,
      fontBoundingBoxDescent: (u = y.fontBoundingBoxDescent) !== null && u !== void 0 ? u : 21 * m,
      hangingBaseline: (f = y.hangingBaseline) !== null && f !== void 0 ? f : 72.80000305175781 * m,
      ideographicBaseline: (p = y.ideographicBaseline) !== null && p !== void 0 ? p : -21 * m,
      width: y.width,
      height: c
    };
  }
  _getContextFont() {
    return this.fontStyle() + Xe + this.fontVariant() + Xe + (this.fontSize() + il) + ol(this.fontFamily());
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
    return cr().measureText(t).width + e * i;
  }
  _setTextData() {
    let t = this.text().split(`
`), e = +this.fontSize(), i = 0, r = this.lineHeight() * e, n = this.attrs.width, s = this.attrs.height, o = n !== fe && n !== void 0, l = s !== fe && s !== void 0, h = this.padding(), u = n - h * 2, f = s - h * 2, p = 0, _ = this.wrap(), c = _ !== Cn, y = _ !== al && c, m = this.ellipsis();
    this.textArr = [], cr().font = this._getContextFont();
    const S = m ? this._getTextWidth(dr) : 0;
    for (let w = 0, d = t.length; w < d; ++w) {
      let g = t[w], b = this._getTextWidth(g);
      if (o && b > u)
        for (; g.length > 0; ) {
          let x = 0, P = Xt(g).length, v = "", E = 0;
          for (; x < P; ) {
            const k = x + P >>> 1, M = Xt(g), T = M.slice(0, k + 1).join(""), A = this._getTextWidth(T);
            (m && l && p + r > f ? A + S : A) <= u ? (x = k + 1, v = T, E = A) : P = k;
          }
          if (v) {
            if (y) {
              const T = Xt(g), A = Xt(v), F = T[A.length], $ = F === Xe || F === vn;
              let q;
              if ($ && E <= u)
                q = A.length;
              else {
                const K = A.lastIndexOf(Xe), N = A.lastIndexOf(vn);
                q = Math.max(K, N) + 1;
              }
              q > 0 && (x = q, v = T.slice(0, x).join(""), E = this._getTextWidth(v));
            }
            if (v = v.trimRight(), this._addTextLine(v), i = Math.max(i, E), p += r, this._shouldHandleEllipsis(p)) {
              this._tryToAddEllipsisToLastLine();
              break;
            }
            if (g = Xt(g).slice(x).join("").trimLeft(), g.length > 0 && (b = this._getTextWidth(g), b <= u)) {
              this._addTextLine(g), p += r, i = Math.max(i, b);
              break;
            }
          } else
            break;
        }
      else
        this._addTextLine(g), p += r, i = Math.max(i, b), this._shouldHandleEllipsis(p) && w < d - 1 && this._tryToAddEllipsisToLastLine();
      if (this.textArr[this.textArr.length - 1] && (this.textArr[this.textArr.length - 1].lastInParagraph = !0), l && p + r > f)
        break;
    }
    this.textHeight = e, this.textWidth = i;
  }
  _shouldHandleEllipsis(t) {
    const e = +this.fontSize(), i = this.lineHeight() * e, r = this.attrs.height, n = r !== fe && r !== void 0, s = this.padding(), o = r - s * 2;
    return !(this.wrap() !== Cn) || n && t + i > o;
  }
  _tryToAddEllipsisToLastLine() {
    const t = this.attrs.width, e = t !== fe && t !== void 0, i = this.padding(), r = t - i * 2, n = this.ellipsis(), s = this.textArr[this.textArr.length - 1];
    !s || !n || (e && (this._getTextWidth(s.text + dr) < r || (s.text = s.text.slice(0, s.text.length - 3))), this.textArr.splice(this.textArr.length - 1, 1), this._addTextLine(s.text + dr));
  }
  getStrokeScaleEnabled() {
    return !0;
  }
  _useBufferCanvas() {
    const t = this.textDecoration().indexOf("underline") !== -1 || this.textDecoration().indexOf("line-through") !== -1, e = this.hasShadow();
    return t && e ? !0 : super._useBufferCanvas();
  }
}
Me.Text = ot;
ot.prototype._fillFunc = ll;
ot.prototype._strokeFunc = hl;
ot.prototype.className = Zo;
ot.prototype._attrsAffectingSize = [
  "text",
  "fontSize",
  "padding",
  "wrap",
  "lineHeight",
  "letterSpacing"
];
(0, Ko._registerNode)(ot);
_t.Factory.overWriteSetter(ot, "width", (0, Wt.getNumberOrAutoValidator)());
_t.Factory.overWriteSetter(ot, "height", (0, Wt.getNumberOrAutoValidator)());
_t.Factory.addGetterSetter(ot, "direction", ya);
_t.Factory.addGetterSetter(ot, "fontFamily", "Arial");
_t.Factory.addGetterSetter(ot, "fontSize", 12, (0, Wt.getNumberValidator)());
_t.Factory.addGetterSetter(ot, "fontStyle", va);
_t.Factory.addGetterSetter(ot, "fontVariant", va);
_t.Factory.addGetterSetter(ot, "padding", 0, (0, Wt.getNumberValidator)());
_t.Factory.addGetterSetter(ot, "align", ba);
_t.Factory.addGetterSetter(ot, "verticalAlign", tl);
_t.Factory.addGetterSetter(ot, "lineHeight", 1, (0, Wt.getNumberValidator)());
_t.Factory.addGetterSetter(ot, "wrap", nl);
_t.Factory.addGetterSetter(ot, "ellipsis", !1, (0, Wt.getBooleanValidator)());
_t.Factory.addGetterSetter(ot, "letterSpacing", 0, (0, Wt.getNumberValidator)());
_t.Factory.addGetterSetter(ot, "text", "", (0, Wt.getStringValidator)());
_t.Factory.addGetterSetter(ot, "textDecoration", "");
var Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
Mi.TextPath = void 0;
const ur = at, wt = B, cl = gt, $e = Pe, fr = Me, wa = L, ul = U, fl = "", Ca = "normal";
function xa(a) {
  a.fillText(this.partialText, 0, 0);
}
function ka(a) {
  a.strokeText(this.partialText, 0, 0);
}
class pt extends cl.Shape {
  constructor(t) {
    super(t), this.dummyCanvas = ur.Util.createCanvasElement(), this.dataArray = [], this._readDataAttribute(), this.on("dataChange.konva", function() {
      this._readDataAttribute(), this._setTextData();
    }), this.on("textChange.konva alignChange.konva letterSpacingChange.konva kerningFuncChange.konva fontSizeChange.konva fontFamilyChange.konva", this._setTextData), this._setTextData();
  }
  _getTextPathLength() {
    return $e.Path.getPathLength(this.dataArray);
  }
  _getPointAtLength(t) {
    if (!this.attrs.data)
      return null;
    const e = this.pathLength;
    return t - 1 > e ? null : $e.Path.getPointAtLengthOfDataArray(t, this.dataArray);
  }
  _readDataAttribute() {
    this.dataArray = $e.Path.parsePathData(this.attrs.data), this.pathLength = this._getTextPathLength();
  }
  _sceneFunc(t) {
    t.setAttr("font", this._getContextFont()), t.setAttr("textBaseline", this.textBaseline()), t.setAttr("textAlign", "left"), t.save();
    const e = this.textDecoration(), i = this.fill(), r = this.fontSize(), n = this.glyphInfo;
    e === "underline" && t.beginPath();
    for (let s = 0; s < n.length; s++) {
      t.save();
      const o = n[s].p0;
      t.translate(o.x, o.y), t.rotate(n[s].rotation), this.partialText = n[s].text, t.fillStrokeShape(this), e === "underline" && (s === 0 && t.moveTo(0, r / 2 + 1), t.lineTo(r, r / 2 + 1)), t.restore();
    }
    e === "underline" && (t.strokeStyle = i, t.lineWidth = r / 20, t.stroke()), t.restore();
  }
  _hitFunc(t) {
    t.beginPath();
    const e = this.glyphInfo;
    if (e.length >= 1) {
      const i = e[0].p0;
      t.moveTo(i.x, i.y);
    }
    for (let i = 0; i < e.length; i++) {
      const r = e[i].p1;
      t.lineTo(r.x, r.y);
    }
    t.setAttr("lineWidth", this.fontSize()), t.setAttr("strokeStyle", this.colorKey), t.stroke();
  }
  getTextWidth() {
    return this.textWidth;
  }
  getTextHeight() {
    return ur.Util.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height."), this.textHeight;
  }
  setText(t) {
    return fr.Text.prototype.setText.call(this, t);
  }
  _getContextFont() {
    return fr.Text.prototype._getContextFont.call(this);
  }
  _getTextSize(t) {
    const i = this.dummyCanvas.getContext("2d");
    i.save(), i.font = this._getContextFont();
    const r = i.measureText(t);
    return i.restore(), {
      width: r.width,
      height: parseInt(`${this.fontSize()}`, 10)
    };
  }
  _setTextData() {
    const { width: t, height: e } = this._getTextSize(this.attrs.text);
    if (this.textWidth = t, this.textHeight = e, this.glyphInfo = [], !this.attrs.data)
      return null;
    const i = this.letterSpacing(), r = this.align(), n = this.kerningFunc(), s = Math.max(this.textWidth + ((this.attrs.text || "").length - 1) * i, 0);
    let o = 0;
    r === "center" && (o = Math.max(0, this.pathLength / 2 - s / 2)), r === "right" && (o = Math.max(0, this.pathLength - s));
    const l = (0, fr.stringToArray)(this.text());
    let h = o;
    for (let u = 0; u < l.length; u++) {
      const f = this._getPointAtLength(h);
      if (!f)
        return;
      let p = this._getTextSize(l[u]).width + i;
      if (l[u] === " " && r === "justify") {
        const w = this.text().split(" ").length - 1;
        p += (this.pathLength - s) / w;
      }
      const _ = this._getPointAtLength(h + p);
      if (!_)
        return;
      const c = $e.Path.getLineLength(f.x, f.y, _.x, _.y);
      let y = 0;
      if (n)
        try {
          y = n(l[u - 1], l[u]) * this.fontSize();
        } catch {
          y = 0;
        }
      f.x += y, _.x += y, this.textWidth += y;
      const m = $e.Path.getPointOnLine(y + c / 2, f.x, f.y, _.x, _.y), S = Math.atan2(_.y - f.y, _.x - f.x);
      this.glyphInfo.push({
        transposeX: m.x,
        transposeY: m.y,
        text: l[u],
        rotation: S,
        p0: f,
        p1: _
      }), h += p;
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
    this.glyphInfo.forEach(function(h) {
      t.push(h.p0.x), t.push(h.p0.y), t.push(h.p1.x), t.push(h.p1.y);
    });
    let e = t[0] || 0, i = t[0] || 0, r = t[1] || 0, n = t[1] || 0, s, o;
    for (let h = 0; h < t.length / 2; h++)
      s = t[h * 2], o = t[h * 2 + 1], e = Math.min(e, s), i = Math.max(i, s), r = Math.min(r, o), n = Math.max(n, o);
    const l = this.fontSize();
    return {
      x: e - l / 2,
      y: r - l / 2,
      width: i - e + l,
      height: n - r + l
    };
  }
  destroy() {
    return ur.Util.releaseCanvas(this.dummyCanvas), super.destroy();
  }
}
Mi.TextPath = pt;
pt.prototype._fillFunc = xa;
pt.prototype._strokeFunc = ka;
pt.prototype._fillFuncHit = xa;
pt.prototype._strokeFuncHit = ka;
pt.prototype.className = "TextPath";
pt.prototype._attrsAffectingSize = ["text", "fontSize", "data"];
(0, ul._registerNode)(pt);
wt.Factory.addGetterSetter(pt, "data");
wt.Factory.addGetterSetter(pt, "fontFamily", "Arial");
wt.Factory.addGetterSetter(pt, "fontSize", 12, (0, wa.getNumberValidator)());
wt.Factory.addGetterSetter(pt, "fontStyle", Ca);
wt.Factory.addGetterSetter(pt, "align", "left");
wt.Factory.addGetterSetter(pt, "letterSpacing", 0, (0, wa.getNumberValidator)());
wt.Factory.addGetterSetter(pt, "textBaseline", "middle");
wt.Factory.addGetterSetter(pt, "fontVariant", Ca);
wt.Factory.addGetterSetter(pt, "text", fl);
wt.Factory.addGetterSetter(pt, "textDecoration", "");
wt.Factory.addGetterSetter(pt, "kerningFunc", void 0);
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.Transformer = void 0;
const X = at, j = B, xn = rt, gl = gt, pl = je, kn = ke, vt = U, jt = L, _l = U, Aa = "tr-konva", ml = [
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
].map((a) => a + `.${Aa}`).join(" "), An = "nodesRect", yl = [
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
], bl = {
  "top-left": -45,
  "top-center": 0,
  "top-right": 45,
  "middle-right": -90,
  "middle-left": 90,
  "bottom-left": -135,
  "bottom-center": 180,
  "bottom-right": 135
}, vl = "ontouchstart" in vt.Konva._global;
function Sl(a, t, e) {
  if (a === "rotater")
    return e;
  t += X.Util.degToRad(bl[a] || 0);
  const i = (X.Util.radToDeg(t) % 360 + 360) % 360;
  return X.Util._inRange(i, 315 + 22.5, 360) || X.Util._inRange(i, 0, 22.5) ? "ns-resize" : X.Util._inRange(i, 45 - 22.5, 45 + 22.5) ? "nesw-resize" : X.Util._inRange(i, 90 - 22.5, 90 + 22.5) ? "ew-resize" : X.Util._inRange(i, 135 - 22.5, 135 + 22.5) ? "nwse-resize" : X.Util._inRange(i, 180 - 22.5, 180 + 22.5) ? "ns-resize" : X.Util._inRange(i, 225 - 22.5, 225 + 22.5) ? "nesw-resize" : X.Util._inRange(i, 270 - 22.5, 270 + 22.5) ? "ew-resize" : X.Util._inRange(i, 315 - 22.5, 315 + 22.5) ? "nwse-resize" : (X.Util.error("Transformer has unknown angle for cursor detection: " + i), "pointer");
}
const ai = [
  "top-left",
  "top-center",
  "top-right",
  "middle-right",
  "middle-left",
  "bottom-left",
  "bottom-center",
  "bottom-right"
];
function wl(a) {
  return {
    x: a.x + a.width / 2 * Math.cos(a.rotation) + a.height / 2 * Math.sin(-a.rotation),
    y: a.y + a.height / 2 * Math.cos(a.rotation) + a.width / 2 * Math.sin(a.rotation)
  };
}
function Pa(a, t, e) {
  const i = e.x + (a.x - e.x) * Math.cos(t) - (a.y - e.y) * Math.sin(t), r = e.y + (a.x - e.x) * Math.sin(t) + (a.y - e.y) * Math.cos(t);
  return {
    ...a,
    rotation: a.rotation + t,
    x: i,
    y: r
  };
}
function Cl(a, t) {
  const e = wl(a);
  return Pa(a, t, e);
}
function xl(a, t, e) {
  let i = t;
  for (let r = 0; r < a.length; r++) {
    const n = vt.Konva.getAngle(a[r]), s = Math.abs(n - t) % (Math.PI * 2);
    Math.min(s, Math.PI * 2 - s) < e && (i = n);
  }
  return i;
}
let Cr = 0;
class H extends kn.Group {
  constructor(t) {
    super(t), this._movingAnchorName = null, this._transforming = !1, this._createElements(), this._handleMouseMove = this._handleMouseMove.bind(this), this._handleMouseUp = this._handleMouseUp.bind(this), this.update = this.update.bind(this), this.on(ml, this.update), this.getNode() && this.update();
  }
  attachTo(t) {
    return this.setNode(t), this;
  }
  setNode(t) {
    return X.Util.warn("tr.setNode(shape), tr.node(shape) and tr.attachTo(shape) methods are deprecated. Please use tr.nodes(nodesArray) instead."), this.setNodes([t]);
  }
  getNode() {
    return this._nodes && this._nodes[0];
  }
  _getEventNamespace() {
    return Aa + this._id;
  }
  setNodes(t = []) {
    this._nodes && this._nodes.length && this.detach();
    const e = t.filter((r) => r.isAncestorOf(this) ? (X.Util.error("Konva.Transformer cannot be an a child of the node you are trying to attach"), !1) : !0);
    return this._nodes = t = e, t.length === 1 && this.useSingleNodeRotation() ? this.rotation(t[0].getAbsoluteRotation()) : this.rotation(0), this._nodes.forEach((r) => {
      const n = () => {
        this.nodes().length === 1 && this.useSingleNodeRotation() && this.rotation(this.nodes()[0].getAbsoluteRotation()), this._resetTransformCache(), !this._transforming && !this.isDragging() && this.update();
      };
      if (r._attrsAffectingSize.length) {
        const s = r._attrsAffectingSize.map((o) => o + "Change." + this._getEventNamespace()).join(" ");
        r.on(s, n);
      }
      r.on(yl.map((s) => s + `.${this._getEventNamespace()}`).join(" "), n), r.on(`absoluteTransformChange.${this._getEventNamespace()}`, n), this._proxyDrag(r);
    }), this._resetTransformCache(), !!this.findOne(".top-left") && this.update(), this;
  }
  _proxyDrag(t) {
    let e;
    t.on(`dragstart.${this._getEventNamespace()}`, (i) => {
      e = t.getAbsolutePosition(), !this.isDragging() && t !== this.findOne(".back") && this.startDrag(i, !1);
    }), t.on(`dragmove.${this._getEventNamespace()}`, (i) => {
      if (!e)
        return;
      const r = t.getAbsolutePosition(), n = r.x - e.x, s = r.y - e.y;
      this.nodes().forEach((o) => {
        if (o === t || o.isDragging())
          return;
        const l = o.getAbsolutePosition();
        o.setAbsolutePosition({
          x: l.x + n,
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
    this._clearCache(An), this._clearCache("transform"), this._clearSelfAndDescendantCache("absoluteTransform");
  }
  _getNodeRect() {
    return this._getCache(An, this.__getNodeRect);
  }
  __getNodeShape(t, e = this.rotation(), i) {
    const r = t.getClientRect({
      skipTransform: !0,
      skipShadow: !0,
      skipStroke: this.ignoreStroke()
    }), n = t.getAbsoluteScale(i), s = t.getAbsolutePosition(i), o = r.x * n.x - t.offsetX() * n.x, l = r.y * n.y - t.offsetY() * n.y, h = (vt.Konva.getAngle(t.getAbsoluteRotation()) + Math.PI * 2) % (Math.PI * 2), u = {
      x: s.x + o * Math.cos(h) + l * Math.sin(-h),
      y: s.y + l * Math.cos(h) + o * Math.sin(h),
      width: r.width * n.x,
      height: r.height * n.y,
      rotation: h
    };
    return Pa(u, -vt.Konva.getAngle(e), {
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
    this.nodes().map((h) => {
      const u = h.getClientRect({
        skipTransform: !0,
        skipShadow: !0,
        skipStroke: this.ignoreStroke()
      }), f = [
        { x: u.x, y: u.y },
        { x: u.x + u.width, y: u.y },
        { x: u.x + u.width, y: u.y + u.height },
        { x: u.x, y: u.y + u.height }
      ], p = h.getAbsoluteTransform();
      f.forEach(function(_) {
        const c = p.point(_);
        e.push(c);
      });
    });
    const i = new X.Transform();
    i.rotate(-vt.Konva.getAngle(this.rotation()));
    let r = 1 / 0, n = 1 / 0, s = -1 / 0, o = -1 / 0;
    e.forEach(function(h) {
      const u = i.point(h);
      r === void 0 && (r = s = u.x, n = o = u.y), r = Math.min(r, u.x), n = Math.min(n, u.y), s = Math.max(s, u.x), o = Math.max(o, u.y);
    }), i.invert();
    const l = i.point({ x: r, y: n });
    return {
      x: l.x,
      y: l.y,
      width: s - r,
      height: o - n,
      rotation: vt.Konva.getAngle(this.rotation())
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
    this._createBack(), ai.forEach((t) => {
      this._createAnchor(t);
    }), this._createAnchor("rotater");
  }
  _createAnchor(t) {
    const e = new pl.Rect({
      stroke: "rgb(0, 161, 255)",
      fill: "white",
      strokeWidth: 1,
      name: t + " _anchor",
      dragDistance: 0,
      draggable: !0,
      hitStrokeWidth: vl ? 10 : "auto"
    }), i = this;
    e.on("mousedown touchstart", function(r) {
      i._handleMouseDown(r);
    }), e.on("dragstart", (r) => {
      e.stopDrag(), r.cancelBubble = !0;
    }), e.on("dragend", (r) => {
      r.cancelBubble = !0;
    }), e.on("mouseenter", () => {
      const r = vt.Konva.getAngle(this.rotation()), n = this.rotateAnchorCursor(), s = Sl(t, r, n);
      e.getStage().content && (e.getStage().content.style.cursor = s), this._cursorChange = !0;
    }), e.on("mouseout", () => {
      e.getStage().content && (e.getStage().content.style.cursor = ""), this._cursorChange = !1;
    }), this.add(e);
  }
  _createBack() {
    const t = new gl.Shape({
      name: "back",
      width: 0,
      height: 0,
      draggable: !0,
      sceneFunc(e, i) {
        const r = i.getParent(), n = r.padding();
        e.beginPath(), e.rect(-n, -n, i.width() + n * 2, i.height() + n * 2), e.moveTo(i.width() / 2, -n), r.rotateEnabled() && r.rotateLineVisible() && e.lineTo(i.width() / 2, -r.rotateAnchorOffset() * X.Util._sign(i.height()) - n), e.fillStrokeShape(i);
      },
      hitFunc: (e, i) => {
        if (!this.shouldOverdrawWholeArea())
          return;
        const r = this.padding();
        e.beginPath(), e.rect(-r, -r, i.width() + r * 2, i.height() + r * 2), e.fillStrokeShape(i);
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
    const e = this._getNodeRect(), i = e.width, r = e.height, n = Math.sqrt(Math.pow(i, 2) + Math.pow(r, 2));
    this.sin = Math.abs(r / n), this.cos = Math.abs(i / n), typeof window < "u" && (window.addEventListener("mousemove", this._handleMouseMove), window.addEventListener("touchmove", this._handleMouseMove), window.addEventListener("mouseup", this._handleMouseUp, !0), window.addEventListener("touchend", this._handleMouseUp, !0)), this._transforming = !0;
    const s = t.target.getAbsolutePosition(), o = t.target.getStage().getPointerPosition();
    this._anchorDragOffset = {
      x: o.x - s.x,
      y: o.y - s.y
    }, Cr++, this._fire("transformstart", { evt: t.evt, target: this.getNode() }), this._nodes.forEach((l) => {
      l._fire("transformstart", { evt: t.evt, target: l });
    });
  }
  _handleMouseMove(t) {
    let e, i, r;
    const n = this.findOne("." + this._movingAnchorName), s = n.getStage();
    s.setPointersPositions(t);
    const o = s.getPointerPosition();
    let l = {
      x: o.x - this._anchorDragOffset.x,
      y: o.y - this._anchorDragOffset.y
    };
    const h = n.getAbsolutePosition();
    this.anchorDragBoundFunc() && (l = this.anchorDragBoundFunc()(h, l, t)), n.setAbsolutePosition(l);
    const u = n.getAbsolutePosition();
    if (h.x === u.x && h.y === u.y)
      return;
    if (this._movingAnchorName === "rotater") {
      const w = this._getNodeRect();
      e = n.x() - w.width / 2, i = -n.y() + w.height / 2;
      let d = Math.atan2(-i, e) + Math.PI / 2;
      w.height < 0 && (d -= Math.PI);
      const b = vt.Konva.getAngle(this.rotation()) + d, x = vt.Konva.getAngle(this.rotationSnapTolerance()), v = xl(this.rotationSnaps(), b, x) - w.rotation, E = Cl(w, v);
      this._fitNodesInto(E, t);
      return;
    }
    const f = this.shiftBehavior();
    let p;
    f === "inverted" ? p = this.keepRatio() && !t.shiftKey : f === "none" ? p = this.keepRatio() : p = this.keepRatio() || t.shiftKey;
    let _ = this.centeredScaling() || t.altKey;
    if (this._movingAnchorName === "top-left") {
      if (p) {
        const w = _ ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".bottom-right").x(),
          y: this.findOne(".bottom-right").y()
        };
        r = Math.sqrt(Math.pow(w.x - n.x(), 2) + Math.pow(w.y - n.y(), 2));
        const d = this.findOne(".top-left").x() > w.x ? -1 : 1, g = this.findOne(".top-left").y() > w.y ? -1 : 1;
        e = r * this.cos * d, i = r * this.sin * g, this.findOne(".top-left").x(w.x - e), this.findOne(".top-left").y(w.y - i);
      }
    } else if (this._movingAnchorName === "top-center")
      this.findOne(".top-left").y(n.y());
    else if (this._movingAnchorName === "top-right") {
      if (p) {
        const w = _ ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".bottom-left").x(),
          y: this.findOne(".bottom-left").y()
        };
        r = Math.sqrt(Math.pow(n.x() - w.x, 2) + Math.pow(w.y - n.y(), 2));
        const d = this.findOne(".top-right").x() < w.x ? -1 : 1, g = this.findOne(".top-right").y() > w.y ? -1 : 1;
        e = r * this.cos * d, i = r * this.sin * g, this.findOne(".top-right").x(w.x + e), this.findOne(".top-right").y(w.y - i);
      }
      var c = n.position();
      this.findOne(".top-left").y(c.y), this.findOne(".bottom-right").x(c.x);
    } else if (this._movingAnchorName === "middle-left")
      this.findOne(".top-left").x(n.x());
    else if (this._movingAnchorName === "middle-right")
      this.findOne(".bottom-right").x(n.x());
    else if (this._movingAnchorName === "bottom-left") {
      if (p) {
        const w = _ ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".top-right").x(),
          y: this.findOne(".top-right").y()
        };
        r = Math.sqrt(Math.pow(w.x - n.x(), 2) + Math.pow(n.y() - w.y, 2));
        const d = w.x < n.x() ? -1 : 1, g = n.y() < w.y ? -1 : 1;
        e = r * this.cos * d, i = r * this.sin * g, n.x(w.x - e), n.y(w.y + i);
      }
      c = n.position(), this.findOne(".top-left").x(c.x), this.findOne(".bottom-right").y(c.y);
    } else if (this._movingAnchorName === "bottom-center")
      this.findOne(".bottom-right").y(n.y());
    else if (this._movingAnchorName === "bottom-right" && p) {
      const w = _ ? {
        x: this.width() / 2,
        y: this.height() / 2
      } : {
        x: this.findOne(".top-left").x(),
        y: this.findOne(".top-left").y()
      };
      r = Math.sqrt(Math.pow(n.x() - w.x, 2) + Math.pow(n.y() - w.y, 2));
      const d = this.findOne(".bottom-right").x() < w.x ? -1 : 1, g = this.findOne(".bottom-right").y() < w.y ? -1 : 1;
      e = r * this.cos * d, i = r * this.sin * g, this.findOne(".bottom-right").x(w.x + e), this.findOne(".bottom-right").y(w.y + i);
    }
    if (_ = this.centeredScaling() || t.altKey, _) {
      const w = this.findOne(".top-left"), d = this.findOne(".bottom-right"), g = w.x(), b = w.y(), x = this.getWidth() - d.x(), P = this.getHeight() - d.y();
      d.move({
        x: -g,
        y: -b
      }), w.move({
        x,
        y: P
      });
    }
    const y = this.findOne(".top-left").getAbsolutePosition();
    e = y.x, i = y.y;
    const m = this.findOne(".bottom-right").x() - this.findOne(".top-left").x(), S = this.findOne(".bottom-right").y() - this.findOne(".top-left").y();
    this._fitNodesInto({
      x: e,
      y: i,
      width: m,
      height: S,
      rotation: vt.Konva.getAngle(this.rotation())
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
      Cr--, this._fire("transformend", { evt: t, target: i }), (e = this.getLayer()) === null || e === void 0 || e.batchDraw(), i && this._nodes.forEach((r) => {
        var n;
        r._fire("transformend", { evt: t, target: r }), (n = r.getLayer()) === null || n === void 0 || n.batchDraw();
      }), this._movingAnchorName = null;
    }
  }
  _fitNodesInto(t, e) {
    const i = this._getNodeRect(), r = 1;
    if (X.Util._inRange(t.width, -this.padding() * 2 - r, r)) {
      this.update();
      return;
    }
    if (X.Util._inRange(t.height, -this.padding() * 2 - r, r)) {
      this.update();
      return;
    }
    const n = new X.Transform();
    if (n.rotate(vt.Konva.getAngle(this.rotation())), this._movingAnchorName && t.width < 0 && this._movingAnchorName.indexOf("left") >= 0) {
      const p = n.point({
        x: -this.padding() * 2,
        y: 0
      });
      t.x += p.x, t.y += p.y, t.width += this.padding() * 2, this._movingAnchorName = this._movingAnchorName.replace("left", "right"), this._anchorDragOffset.x -= p.x, this._anchorDragOffset.y -= p.y;
    } else if (this._movingAnchorName && t.width < 0 && this._movingAnchorName.indexOf("right") >= 0) {
      const p = n.point({
        x: this.padding() * 2,
        y: 0
      });
      this._movingAnchorName = this._movingAnchorName.replace("right", "left"), this._anchorDragOffset.x -= p.x, this._anchorDragOffset.y -= p.y, t.width += this.padding() * 2;
    }
    if (this._movingAnchorName && t.height < 0 && this._movingAnchorName.indexOf("top") >= 0) {
      const p = n.point({
        x: 0,
        y: -this.padding() * 2
      });
      t.x += p.x, t.y += p.y, this._movingAnchorName = this._movingAnchorName.replace("top", "bottom"), this._anchorDragOffset.x -= p.x, this._anchorDragOffset.y -= p.y, t.height += this.padding() * 2;
    } else if (this._movingAnchorName && t.height < 0 && this._movingAnchorName.indexOf("bottom") >= 0) {
      const p = n.point({
        x: 0,
        y: this.padding() * 2
      });
      this._movingAnchorName = this._movingAnchorName.replace("bottom", "top"), this._anchorDragOffset.x -= p.x, this._anchorDragOffset.y -= p.y, t.height += this.padding() * 2;
    }
    if (this.boundBoxFunc()) {
      const p = this.boundBoxFunc()(i, t);
      p ? t = p : X.Util.warn("boundBoxFunc returned falsy. You should return new bound rect from it!");
    }
    const s = 1e7, o = new X.Transform();
    o.translate(i.x, i.y), o.rotate(i.rotation), o.scale(i.width / s, i.height / s);
    const l = new X.Transform(), h = t.width / s, u = t.height / s;
    this.flipEnabled() === !1 ? (l.translate(t.x, t.y), l.rotate(t.rotation), l.translate(t.width < 0 ? t.width : 0, t.height < 0 ? t.height : 0), l.scale(Math.abs(h), Math.abs(u))) : (l.translate(t.x, t.y), l.rotate(t.rotation), l.scale(h, u));
    const f = l.multiply(o.invert());
    this._nodes.forEach((p) => {
      var _;
      const c = p.getParent().getAbsoluteTransform(), y = p.getTransform().copy();
      y.translate(p.offsetX(), p.offsetY());
      const m = new X.Transform();
      m.multiply(c.copy().invert()).multiply(f).multiply(c).multiply(y);
      const S = m.decompose();
      p.setAttrs(S), (_ = p.getLayer()) === null || _ === void 0 || _.batchDraw();
    }), this.rotation(X.Util._getRotation(t.rotation)), this._nodes.forEach((p) => {
      this._fire("transform", { evt: e, target: p }), p._fire("transform", { evt: e, target: p });
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
    this.rotation(X.Util._getRotation(e.rotation));
    const i = e.width, r = e.height, n = this.enabledAnchors(), s = this.resizeEnabled(), o = this.padding(), l = this.anchorSize(), h = this.find("._anchor");
    h.forEach((f) => {
      f.setAttrs({
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
      visible: s && n.indexOf("top-left") >= 0
    }), this._batchChangeChild(".top-center", {
      x: i / 2,
      y: 0,
      offsetY: l / 2 + o,
      visible: s && n.indexOf("top-center") >= 0
    }), this._batchChangeChild(".top-right", {
      x: i,
      y: 0,
      offsetX: l / 2 - o,
      offsetY: l / 2 + o,
      visible: s && n.indexOf("top-right") >= 0
    }), this._batchChangeChild(".middle-left", {
      x: 0,
      y: r / 2,
      offsetX: l / 2 + o,
      visible: s && n.indexOf("middle-left") >= 0
    }), this._batchChangeChild(".middle-right", {
      x: i,
      y: r / 2,
      offsetX: l / 2 - o,
      visible: s && n.indexOf("middle-right") >= 0
    }), this._batchChangeChild(".bottom-left", {
      x: 0,
      y: r,
      offsetX: l / 2 + o,
      offsetY: l / 2 - o,
      visible: s && n.indexOf("bottom-left") >= 0
    }), this._batchChangeChild(".bottom-center", {
      x: i / 2,
      y: r,
      offsetY: l / 2 - o,
      visible: s && n.indexOf("bottom-center") >= 0
    }), this._batchChangeChild(".bottom-right", {
      x: i,
      y: r,
      offsetX: l / 2 - o,
      offsetY: l / 2 - o,
      visible: s && n.indexOf("bottom-right") >= 0
    }), this._batchChangeChild(".rotater", {
      x: i / 2,
      y: -this.rotateAnchorOffset() * X.Util._sign(r) - o,
      visible: this.rotateEnabled()
    }), this._batchChangeChild(".back", {
      width: i,
      height: r,
      visible: this.borderEnabled(),
      stroke: this.borderStroke(),
      strokeWidth: this.borderStrokeWidth(),
      dash: this.borderDash(),
      x: 0,
      y: 0
    });
    const u = this.anchorStyleFunc();
    u && h.forEach((f) => {
      u(f);
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
    return this.getStage() && this._cursorChange && this.getStage().content && (this.getStage().content.style.cursor = ""), kn.Group.prototype.destroy.call(this), this.detach(), this._removeEvents(), this;
  }
  toObject() {
    return xn.Node.prototype.toObject.call(this);
  }
  clone(t) {
    return xn.Node.prototype.clone.call(this, t);
  }
  getClientRect() {
    return this.nodes().length > 0 ? super.getClientRect() : { x: 0, y: 0, width: 0, height: 0 };
  }
}
Ti.Transformer = H;
H.isTransforming = () => Cr > 0;
function kl(a) {
  return a instanceof Array || X.Util.warn("enabledAnchors value should be an array"), a instanceof Array && a.forEach(function(t) {
    ai.indexOf(t) === -1 && X.Util.warn("Unknown anchor name: " + t + ". Available names are: " + ai.join(", "));
  }), a || [];
}
H.prototype.className = "Transformer";
(0, _l._registerNode)(H);
j.Factory.addGetterSetter(H, "enabledAnchors", ai, kl);
j.Factory.addGetterSetter(H, "flipEnabled", !0, (0, jt.getBooleanValidator)());
j.Factory.addGetterSetter(H, "resizeEnabled", !0);
j.Factory.addGetterSetter(H, "anchorSize", 10, (0, jt.getNumberValidator)());
j.Factory.addGetterSetter(H, "rotateEnabled", !0);
j.Factory.addGetterSetter(H, "rotateLineVisible", !0);
j.Factory.addGetterSetter(H, "rotationSnaps", []);
j.Factory.addGetterSetter(H, "rotateAnchorOffset", 50, (0, jt.getNumberValidator)());
j.Factory.addGetterSetter(H, "rotateAnchorCursor", "crosshair");
j.Factory.addGetterSetter(H, "rotationSnapTolerance", 5, (0, jt.getNumberValidator)());
j.Factory.addGetterSetter(H, "borderEnabled", !0);
j.Factory.addGetterSetter(H, "anchorStroke", "rgb(0, 161, 255)");
j.Factory.addGetterSetter(H, "anchorStrokeWidth", 1, (0, jt.getNumberValidator)());
j.Factory.addGetterSetter(H, "anchorFill", "white");
j.Factory.addGetterSetter(H, "anchorCornerRadius", 0, (0, jt.getNumberValidator)());
j.Factory.addGetterSetter(H, "borderStroke", "rgb(0, 161, 255)");
j.Factory.addGetterSetter(H, "borderStrokeWidth", 1, (0, jt.getNumberValidator)());
j.Factory.addGetterSetter(H, "borderDash");
j.Factory.addGetterSetter(H, "keepRatio", !0);
j.Factory.addGetterSetter(H, "shiftBehavior", "default");
j.Factory.addGetterSetter(H, "centeredScaling", !1);
j.Factory.addGetterSetter(H, "ignoreStroke", !1);
j.Factory.addGetterSetter(H, "padding", 0, (0, jt.getNumberValidator)());
j.Factory.addGetterSetter(H, "nodes");
j.Factory.addGetterSetter(H, "node");
j.Factory.addGetterSetter(H, "boundBoxFunc");
j.Factory.addGetterSetter(H, "anchorDragBoundFunc");
j.Factory.addGetterSetter(H, "anchorStyleFunc");
j.Factory.addGetterSetter(H, "shouldOverdrawWholeArea", !1);
j.Factory.addGetterSetter(H, "useSingleNodeRotation", !0);
j.Factory.backCompat(H, {
  lineEnabled: "borderEnabled",
  rotateHandlerOffset: "rotateAnchorOffset",
  enabledHandlers: "enabledAnchors"
});
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.Wedge = void 0;
const $i = B, Al = gt, Pl = U, Ea = L, El = U;
class Ot extends Al.Shape {
  _sceneFunc(t) {
    t.beginPath(), t.arc(0, 0, this.radius(), 0, Pl.Konva.getAngle(this.angle()), this.clockwise()), t.lineTo(0, 0), t.closePath(), t.fillStrokeShape(this);
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
Ri.Wedge = Ot;
Ot.prototype.className = "Wedge";
Ot.prototype._centroid = !0;
Ot.prototype._attrsAffectingSize = ["radius"];
(0, El._registerNode)(Ot);
$i.Factory.addGetterSetter(Ot, "radius", 0, (0, Ea.getNumberValidator)());
$i.Factory.addGetterSetter(Ot, "angle", 0, (0, Ea.getNumberValidator)());
$i.Factory.addGetterSetter(Ot, "clockwise", !1);
$i.Factory.backCompat(Ot, {
  angleDeg: "angle",
  getAngleDeg: "getAngle",
  setAngleDeg: "setAngle"
});
var Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.Blur = void 0;
const Pn = B, Ml = rt, Tl = L;
function En() {
  this.r = 0, this.g = 0, this.b = 0, this.a = 0, this.next = null;
}
const Rl = [
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
], $l = [
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
function Fl(a, t) {
  const e = a.data, i = a.width, r = a.height;
  let n, s, o, l, h, u, f, p, _, c, y, m, S, w, d, g, b, x, P, v;
  const E = t + t + 1, k = i - 1, M = r - 1, T = t + 1, A = T * (T + 1) / 2, F = new En(), $ = Rl[t], q = $l[t];
  let K = null, N = F, W = null, I = null;
  for (let O = 1; O < E; O++)
    N = N.next = new En(), O === T && (K = N);
  N.next = F, o = s = 0;
  for (let O = 0; O < r; O++) {
    m = S = w = d = l = h = u = f = 0, p = T * (g = e[s]), _ = T * (b = e[s + 1]), c = T * (x = e[s + 2]), y = T * (P = e[s + 3]), l += A * g, h += A * b, u += A * x, f += A * P, N = F;
    for (let z = 0; z < T; z++)
      N.r = g, N.g = b, N.b = x, N.a = P, N = N.next;
    for (let z = 1; z < T; z++)
      n = s + ((k < z ? k : z) << 2), l += (N.r = g = e[n]) * (v = T - z), h += (N.g = b = e[n + 1]) * v, u += (N.b = x = e[n + 2]) * v, f += (N.a = P = e[n + 3]) * v, m += g, S += b, w += x, d += P, N = N.next;
    W = F, I = K;
    for (let z = 0; z < i; z++)
      e[s + 3] = P = f * $ >> q, P !== 0 ? (P = 255 / P, e[s] = (l * $ >> q) * P, e[s + 1] = (h * $ >> q) * P, e[s + 2] = (u * $ >> q) * P) : e[s] = e[s + 1] = e[s + 2] = 0, l -= p, h -= _, u -= c, f -= y, p -= W.r, _ -= W.g, c -= W.b, y -= W.a, n = o + ((n = z + t + 1) < k ? n : k) << 2, m += W.r = e[n], S += W.g = e[n + 1], w += W.b = e[n + 2], d += W.a = e[n + 3], l += m, h += S, u += w, f += d, W = W.next, p += g = I.r, _ += b = I.g, c += x = I.b, y += P = I.a, m -= g, S -= b, w -= x, d -= P, I = I.next, s += 4;
    o += i;
  }
  for (let O = 0; O < i; O++) {
    S = w = d = m = h = u = f = l = 0, s = O << 2, p = T * (g = e[s]), _ = T * (b = e[s + 1]), c = T * (x = e[s + 2]), y = T * (P = e[s + 3]), l += A * g, h += A * b, u += A * x, f += A * P, N = F;
    for (let nt = 0; nt < T; nt++)
      N.r = g, N.g = b, N.b = x, N.a = P, N = N.next;
    let z = i;
    for (let nt = 1; nt <= t; nt++)
      s = z + O << 2, l += (N.r = g = e[s]) * (v = T - nt), h += (N.g = b = e[s + 1]) * v, u += (N.b = x = e[s + 2]) * v, f += (N.a = P = e[s + 3]) * v, m += g, S += b, w += x, d += P, N = N.next, nt < M && (z += i);
    s = O, W = F, I = K;
    for (let nt = 0; nt < r; nt++)
      n = s << 2, e[n + 3] = P = f * $ >> q, P > 0 ? (P = 255 / P, e[n] = (l * $ >> q) * P, e[n + 1] = (h * $ >> q) * P, e[n + 2] = (u * $ >> q) * P) : e[n] = e[n + 1] = e[n + 2] = 0, l -= p, h -= _, u -= c, f -= y, p -= W.r, _ -= W.g, c -= W.b, y -= W.a, n = O + ((n = nt + T) < M ? n : M) * i << 2, l += m += W.r = e[n], h += S += W.g = e[n + 1], u += w += W.b = e[n + 2], f += d += W.a = e[n + 3], W = W.next, p += g = I.r, _ += b = I.g, c += x = I.b, y += P = I.a, m -= g, S -= b, w -= x, d -= P, I = I.next, s += i;
  }
}
const Ol = function(t) {
  const e = Math.round(this.blurRadius());
  e > 0 && Fl(t, e);
};
Fi.Blur = Ol;
Pn.Factory.addGetterSetter(Ml.Node, "blurRadius", 0, (0, Tl.getNumberValidator)(), Pn.Factory.afterSetFilter);
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.Brighten = void 0;
const Mn = B, Dl = rt, Nl = L, Ll = function(a) {
  const t = this.brightness() * 255, e = a.data, i = e.length;
  for (let r = 0; r < i; r += 4)
    e[r] += t, e[r + 1] += t, e[r + 2] += t;
};
Oi.Brighten = Ll;
Mn.Factory.addGetterSetter(Dl.Node, "brightness", 0, (0, Nl.getNumberValidator)(), Mn.Factory.afterSetFilter);
var Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.Contrast = void 0;
const Tn = B, Gl = rt, Il = L, Ul = function(a) {
  const t = Math.pow((this.contrast() + 100) / 100, 2), e = a.data, i = e.length;
  let r = 150, n = 150, s = 150;
  for (let o = 0; o < i; o += 4)
    r = e[o], n = e[o + 1], s = e[o + 2], r /= 255, r -= 0.5, r *= t, r += 0.5, r *= 255, n /= 255, n -= 0.5, n *= t, n += 0.5, n *= 255, s /= 255, s -= 0.5, s *= t, s += 0.5, s *= 255, r = r < 0 ? 0 : r > 255 ? 255 : r, n = n < 0 ? 0 : n > 255 ? 255 : n, s = s < 0 ? 0 : s > 255 ? 255 : s, e[o] = r, e[o + 1] = n, e[o + 2] = s;
};
Di.Contrast = Ul;
Tn.Factory.addGetterSetter(Gl.Node, "contrast", 0, (0, Il.getNumberValidator)(), Tn.Factory.afterSetFilter);
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.Emboss = void 0;
const Ut = B, Li = rt, Bl = at, Ma = L, Vl = function(a) {
  const t = this.embossStrength() * 10, e = this.embossWhiteLevel() * 255, i = this.embossDirection(), r = this.embossBlend(), n = a.data, s = a.width, o = a.height, l = s * 4;
  let h = 0, u = 0, f = o;
  switch (i) {
    case "top-left":
      h = -1, u = -1;
      break;
    case "top":
      h = -1, u = 0;
      break;
    case "top-right":
      h = -1, u = 1;
      break;
    case "right":
      h = 0, u = 1;
      break;
    case "bottom-right":
      h = 1, u = 1;
      break;
    case "bottom":
      h = 1, u = 0;
      break;
    case "bottom-left":
      h = 1, u = -1;
      break;
    case "left":
      h = 0, u = -1;
      break;
    default:
      Bl.Util.error("Unknown emboss direction: " + i);
  }
  do {
    const p = (f - 1) * l;
    let _ = h;
    f + _ < 1 && (_ = 0), f + _ > o && (_ = 0);
    const c = (f - 1 + _) * s * 4;
    let y = s;
    do {
      const m = p + (y - 1) * 4;
      let S = u;
      y + S < 1 && (S = 0), y + S > s && (S = 0);
      const w = c + (y - 1 + S) * 4, d = n[m] - n[w], g = n[m + 1] - n[w + 1], b = n[m + 2] - n[w + 2];
      let x = d;
      const P = x > 0 ? x : -x, v = g > 0 ? g : -g, E = b > 0 ? b : -b;
      if (v > P && (x = g), E > P && (x = b), x *= t, r) {
        const k = n[m] + x, M = n[m + 1] + x, T = n[m + 2] + x;
        n[m] = k > 255 ? 255 : k < 0 ? 0 : k, n[m + 1] = M > 255 ? 255 : M < 0 ? 0 : M, n[m + 2] = T > 255 ? 255 : T < 0 ? 0 : T;
      } else {
        let k = e - x;
        k < 0 ? k = 0 : k > 255 && (k = 255), n[m] = n[m + 1] = n[m + 2] = k;
      }
    } while (--y);
  } while (--f);
};
Ni.Emboss = Vl;
Ut.Factory.addGetterSetter(Li.Node, "embossStrength", 0.5, (0, Ma.getNumberValidator)(), Ut.Factory.afterSetFilter);
Ut.Factory.addGetterSetter(Li.Node, "embossWhiteLevel", 0.5, (0, Ma.getNumberValidator)(), Ut.Factory.afterSetFilter);
Ut.Factory.addGetterSetter(Li.Node, "embossDirection", "top-left", void 0, Ut.Factory.afterSetFilter);
Ut.Factory.addGetterSetter(Li.Node, "embossBlend", !1, void 0, Ut.Factory.afterSetFilter);
var Gi = {};
Object.defineProperty(Gi, "__esModule", { value: !0 });
Gi.Enhance = void 0;
const Rn = B, Hl = rt, zl = L;
function gr(a, t, e, i, r) {
  const n = e - t, s = r - i;
  if (n === 0)
    return i + s / 2;
  if (s === 0)
    return i;
  let o = (a - t) / n;
  return o = s * o + i, o;
}
const Wl = function(a) {
  const t = a.data, e = t.length;
  let i = t[0], r = i, n, s = t[1], o = s, l, h = t[2], u = h, f;
  const p = this.enhance();
  if (p === 0)
    return;
  for (let d = 0; d < e; d += 4)
    n = t[d + 0], n < i ? i = n : n > r && (r = n), l = t[d + 1], l < s ? s = l : l > o && (o = l), f = t[d + 2], f < h ? h = f : f > u && (u = f);
  r === i && (r = 255, i = 0), o === s && (o = 255, s = 0), u === h && (u = 255, h = 0);
  let _, c, y, m, S, w;
  if (p > 0)
    _ = r + p * (255 - r), c = i - p * (i - 0), y = o + p * (255 - o), m = s - p * (s - 0), S = u + p * (255 - u), w = h - p * (h - 0);
  else {
    const d = (r + i) * 0.5;
    _ = r + p * (r - d), c = i + p * (i - d);
    const g = (o + s) * 0.5;
    y = o + p * (o - g), m = s + p * (s - g);
    const b = (u + h) * 0.5;
    S = u + p * (u - b), w = h + p * (h - b);
  }
  for (let d = 0; d < e; d += 4)
    t[d + 0] = gr(t[d + 0], i, r, c, _), t[d + 1] = gr(t[d + 1], s, o, m, y), t[d + 2] = gr(t[d + 2], h, u, w, S);
};
Gi.Enhance = Wl;
Rn.Factory.addGetterSetter(Hl.Node, "enhance", 0, (0, zl.getNumberValidator)(), Rn.Factory.afterSetFilter);
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
Ii.Grayscale = void 0;
const jl = function(a) {
  const t = a.data, e = t.length;
  for (let i = 0; i < e; i += 4) {
    const r = 0.34 * t[i] + 0.5 * t[i + 1] + 0.16 * t[i + 2];
    t[i] = r, t[i + 1] = r, t[i + 2] = r;
  }
};
Ii.Grayscale = jl;
var Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.HSL = void 0;
const be = B, Ur = rt, Br = L;
be.Factory.addGetterSetter(Ur.Node, "hue", 0, (0, Br.getNumberValidator)(), be.Factory.afterSetFilter);
be.Factory.addGetterSetter(Ur.Node, "saturation", 0, (0, Br.getNumberValidator)(), be.Factory.afterSetFilter);
be.Factory.addGetterSetter(Ur.Node, "luminance", 0, (0, Br.getNumberValidator)(), be.Factory.afterSetFilter);
const Yl = function(a) {
  const t = a.data, e = t.length, i = 1, r = Math.pow(2, this.saturation()), n = Math.abs(this.hue() + 360) % 360, s = this.luminance() * 127, o = i * r * Math.cos(n * Math.PI / 180), l = i * r * Math.sin(n * Math.PI / 180), h = 0.299 * i + 0.701 * o + 0.167 * l, u = 0.587 * i - 0.587 * o + 0.33 * l, f = 0.114 * i - 0.114 * o - 0.497 * l, p = 0.299 * i - 0.299 * o - 0.328 * l, _ = 0.587 * i + 0.413 * o + 0.035 * l, c = 0.114 * i - 0.114 * o + 0.293 * l, y = 0.299 * i - 0.3 * o + 1.25 * l, m = 0.587 * i - 0.586 * o - 1.05 * l, S = 0.114 * i + 0.886 * o - 0.2 * l;
  let w, d, g, b;
  for (let x = 0; x < e; x += 4)
    w = t[x + 0], d = t[x + 1], g = t[x + 2], b = t[x + 3], t[x + 0] = h * w + u * d + f * g + s, t[x + 1] = p * w + _ * d + c * g + s, t[x + 2] = y * w + m * d + S * g + s, t[x + 3] = b;
};
Ui.HSL = Yl;
var Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.HSV = void 0;
const ve = B, Vr = rt, Hr = L, Kl = function(a) {
  const t = a.data, e = t.length, i = Math.pow(2, this.value()), r = Math.pow(2, this.saturation()), n = Math.abs(this.hue() + 360) % 360, s = i * r * Math.cos(n * Math.PI / 180), o = i * r * Math.sin(n * Math.PI / 180), l = 0.299 * i + 0.701 * s + 0.167 * o, h = 0.587 * i - 0.587 * s + 0.33 * o, u = 0.114 * i - 0.114 * s - 0.497 * o, f = 0.299 * i - 0.299 * s - 0.328 * o, p = 0.587 * i + 0.413 * s + 0.035 * o, _ = 0.114 * i - 0.114 * s + 0.293 * o, c = 0.299 * i - 0.3 * s + 1.25 * o, y = 0.587 * i - 0.586 * s - 1.05 * o, m = 0.114 * i + 0.886 * s - 0.2 * o;
  for (let S = 0; S < e; S += 4) {
    const w = t[S + 0], d = t[S + 1], g = t[S + 2], b = t[S + 3];
    t[S + 0] = l * w + h * d + u * g, t[S + 1] = f * w + p * d + _ * g, t[S + 2] = c * w + y * d + m * g, t[S + 3] = b;
  }
};
Bi.HSV = Kl;
ve.Factory.addGetterSetter(Vr.Node, "hue", 0, (0, Hr.getNumberValidator)(), ve.Factory.afterSetFilter);
ve.Factory.addGetterSetter(Vr.Node, "saturation", 0, (0, Hr.getNumberValidator)(), ve.Factory.afterSetFilter);
ve.Factory.addGetterSetter(Vr.Node, "value", 0, (0, Hr.getNumberValidator)(), ve.Factory.afterSetFilter);
var Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
Vi.Invert = void 0;
const Xl = function(a) {
  const t = a.data, e = t.length;
  for (let i = 0; i < e; i += 4)
    t[i] = 255 - t[i], t[i + 1] = 255 - t[i + 1], t[i + 2] = 255 - t[i + 2];
};
Vi.Invert = Xl;
var Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.Kaleidoscope = void 0;
const si = B, Ta = rt, $n = at, Ra = L, ql = function(a, t, e) {
  const i = a.data, r = t.data, n = a.width, s = a.height, o = e.polarCenterX || n / 2, l = e.polarCenterY || s / 2;
  let h = Math.sqrt(o * o + l * l), u = n - o, f = s - l;
  const p = Math.sqrt(u * u + f * f);
  h = p > h ? p : h;
  const _ = s, c = n, y = 360 / c * Math.PI / 180;
  for (let m = 0; m < c; m += 1) {
    const S = Math.sin(m * y), w = Math.cos(m * y);
    for (let d = 0; d < _; d += 1) {
      u = Math.floor(o + h * d / _ * w), f = Math.floor(l + h * d / _ * S);
      let g = (f * n + u) * 4;
      const b = i[g + 0], x = i[g + 1], P = i[g + 2], v = i[g + 3];
      g = (m + d * n) * 4, r[g + 0] = b, r[g + 1] = x, r[g + 2] = P, r[g + 3] = v;
    }
  }
}, Ql = function(a, t, e) {
  const i = a.data, r = t.data, n = a.width, s = a.height, o = e.polarCenterX || n / 2, l = e.polarCenterY || s / 2;
  let h = Math.sqrt(o * o + l * l), u = n - o, f = s - l;
  const p = Math.sqrt(u * u + f * f);
  h = p > h ? p : h;
  const _ = s, c = n, y = 0;
  let m, S;
  for (u = 0; u < n; u += 1)
    for (f = 0; f < s; f += 1) {
      const w = u - o, d = f - l, g = Math.sqrt(w * w + d * d) * _ / h;
      let b = (Math.atan2(d, w) * 180 / Math.PI + 360 + y) % 360;
      b = b * c / 360, m = Math.floor(b), S = Math.floor(g);
      let x = (S * n + m) * 4;
      const P = i[x + 0], v = i[x + 1], E = i[x + 2], k = i[x + 3];
      x = (f * n + u) * 4, r[x + 0] = P, r[x + 1] = v, r[x + 2] = E, r[x + 3] = k;
    }
}, Jl = function(a) {
  const t = a.width, e = a.height;
  let i, r, n, s, o, l, h, u, f, p, _ = Math.round(this.kaleidoscopePower());
  const c = Math.round(this.kaleidoscopeAngle()), y = Math.floor(t * (c % 360) / 360);
  if (_ < 1)
    return;
  const m = $n.Util.createCanvasElement();
  m.width = t, m.height = e;
  const S = m.getContext("2d").getImageData(0, 0, t, e);
  $n.Util.releaseCanvas(m), ql(a, S, {
    polarCenterX: t / 2,
    polarCenterY: e / 2
  });
  let w = t / Math.pow(2, _);
  for (; w <= 8; )
    w = w * 2, _ -= 1;
  w = Math.ceil(w);
  let d = w, g = 0, b = d, x = 1;
  for (y + w > t && (g = d, b = 0, x = -1), r = 0; r < e; r += 1)
    for (i = g; i !== b; i += x)
      n = Math.round(i + y) % t, f = (t * r + n) * 4, o = S.data[f + 0], l = S.data[f + 1], h = S.data[f + 2], u = S.data[f + 3], p = (t * r + i) * 4, S.data[p + 0] = o, S.data[p + 1] = l, S.data[p + 2] = h, S.data[p + 3] = u;
  for (r = 0; r < e; r += 1)
    for (d = Math.floor(w), s = 0; s < _; s += 1) {
      for (i = 0; i < d + 1; i += 1)
        f = (t * r + i) * 4, o = S.data[f + 0], l = S.data[f + 1], h = S.data[f + 2], u = S.data[f + 3], p = (t * r + d * 2 - i - 1) * 4, S.data[p + 0] = o, S.data[p + 1] = l, S.data[p + 2] = h, S.data[p + 3] = u;
      d *= 2;
    }
  Ql(S, a, {});
};
Hi.Kaleidoscope = Jl;
si.Factory.addGetterSetter(Ta.Node, "kaleidoscopePower", 2, (0, Ra.getNumberValidator)(), si.Factory.afterSetFilter);
si.Factory.addGetterSetter(Ta.Node, "kaleidoscopeAngle", 0, (0, Ra.getNumberValidator)(), si.Factory.afterSetFilter);
var zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.Mask = void 0;
const Fn = B, Zl = rt, th = L;
function Qe(a, t, e) {
  let i = (e * a.width + t) * 4;
  const r = [];
  return r.push(a.data[i++], a.data[i++], a.data[i++], a.data[i++]), r;
}
function Fe(a, t) {
  return Math.sqrt(Math.pow(a[0] - t[0], 2) + Math.pow(a[1] - t[1], 2) + Math.pow(a[2] - t[2], 2));
}
function eh(a) {
  const t = [0, 0, 0];
  for (let e = 0; e < a.length; e++)
    t[0] += a[e][0], t[1] += a[e][1], t[2] += a[e][2];
  return t[0] /= a.length, t[1] /= a.length, t[2] /= a.length, t;
}
function ih(a, t) {
  const e = Qe(a, 0, 0), i = Qe(a, a.width - 1, 0), r = Qe(a, 0, a.height - 1), n = Qe(a, a.width - 1, a.height - 1), s = t || 10;
  if (Fe(e, i) < s && Fe(i, n) < s && Fe(n, r) < s && Fe(r, e) < s) {
    const o = eh([i, e, n, r]), l = [];
    for (let h = 0; h < a.width * a.height; h++) {
      const u = Fe(o, [
        a.data[h * 4],
        a.data[h * 4 + 1],
        a.data[h * 4 + 2]
      ]);
      l[h] = u < s ? 0 : 255;
    }
    return l;
  }
}
function rh(a, t) {
  for (let e = 0; e < a.width * a.height; e++)
    a.data[4 * e + 3] = t[e];
}
function nh(a, t, e) {
  const i = [1, 1, 1, 1, 0, 1, 1, 1, 1], r = Math.round(Math.sqrt(i.length)), n = Math.floor(r / 2), s = [];
  for (let o = 0; o < e; o++)
    for (let l = 0; l < t; l++) {
      const h = o * t + l;
      let u = 0;
      for (let f = 0; f < r; f++)
        for (let p = 0; p < r; p++) {
          const _ = o + f - n, c = l + p - n;
          if (_ >= 0 && _ < e && c >= 0 && c < t) {
            const y = _ * t + c, m = i[f * r + p];
            u += a[y] * m;
          }
        }
      s[h] = u === 255 * 8 ? 255 : 0;
    }
  return s;
}
function ah(a, t, e) {
  const i = [1, 1, 1, 1, 1, 1, 1, 1, 1], r = Math.round(Math.sqrt(i.length)), n = Math.floor(r / 2), s = [];
  for (let o = 0; o < e; o++)
    for (let l = 0; l < t; l++) {
      const h = o * t + l;
      let u = 0;
      for (let f = 0; f < r; f++)
        for (let p = 0; p < r; p++) {
          const _ = o + f - n, c = l + p - n;
          if (_ >= 0 && _ < e && c >= 0 && c < t) {
            const y = _ * t + c, m = i[f * r + p];
            u += a[y] * m;
          }
        }
      s[h] = u >= 255 * 4 ? 255 : 0;
    }
  return s;
}
function sh(a, t, e) {
  const i = [0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111], r = Math.round(Math.sqrt(i.length)), n = Math.floor(r / 2), s = [];
  for (let o = 0; o < e; o++)
    for (let l = 0; l < t; l++) {
      const h = o * t + l;
      let u = 0;
      for (let f = 0; f < r; f++)
        for (let p = 0; p < r; p++) {
          const _ = o + f - n, c = l + p - n;
          if (_ >= 0 && _ < e && c >= 0 && c < t) {
            const y = _ * t + c, m = i[f * r + p];
            u += a[y] * m;
          }
        }
      s[h] = u;
    }
  return s;
}
const oh = function(a) {
  const t = this.threshold();
  let e = ih(a, t);
  return e && (e = nh(e, a.width, a.height), e = ah(e, a.width, a.height), e = sh(e, a.width, a.height), rh(a, e)), a;
};
zi.Mask = oh;
Fn.Factory.addGetterSetter(Zl.Node, "threshold", 0, (0, th.getNumberValidator)(), Fn.Factory.afterSetFilter);
var Wi = {};
Object.defineProperty(Wi, "__esModule", { value: !0 });
Wi.Noise = void 0;
const On = B, lh = rt, hh = L, dh = function(a) {
  const t = this.noise() * 255, e = a.data, i = e.length, r = t / 2;
  for (let n = 0; n < i; n += 4)
    e[n + 0] += r - 2 * r * Math.random(), e[n + 1] += r - 2 * r * Math.random(), e[n + 2] += r - 2 * r * Math.random();
};
Wi.Noise = dh;
On.Factory.addGetterSetter(lh.Node, "noise", 0.2, (0, hh.getNumberValidator)(), On.Factory.afterSetFilter);
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.Pixelate = void 0;
const Dn = B, ch = at, uh = rt, fh = L, gh = function(a) {
  let t = Math.ceil(this.pixelSize()), e = a.width, i = a.height, r = Math.ceil(e / t), n = Math.ceil(i / t), s = a.data;
  if (t <= 0) {
    ch.Util.error("pixelSize value can not be <= 0");
    return;
  }
  for (let o = 0; o < r; o += 1)
    for (let l = 0; l < n; l += 1) {
      let h = 0, u = 0, f = 0, p = 0;
      const _ = o * t, c = _ + t, y = l * t, m = y + t;
      let S = 0;
      for (let w = _; w < c; w += 1)
        if (!(w >= e))
          for (let d = y; d < m; d += 1) {
            if (d >= i)
              continue;
            const g = (e * d + w) * 4;
            h += s[g + 0], u += s[g + 1], f += s[g + 2], p += s[g + 3], S += 1;
          }
      h = h / S, u = u / S, f = f / S, p = p / S;
      for (let w = _; w < c; w += 1)
        if (!(w >= e))
          for (let d = y; d < m; d += 1) {
            if (d >= i)
              continue;
            const g = (e * d + w) * 4;
            s[g + 0] = h, s[g + 1] = u, s[g + 2] = f, s[g + 3] = p;
          }
    }
};
ji.Pixelate = gh;
Dn.Factory.addGetterSetter(uh.Node, "pixelSize", 8, (0, fh.getNumberValidator)(), Dn.Factory.afterSetFilter);
var Yi = {};
Object.defineProperty(Yi, "__esModule", { value: !0 });
Yi.Posterize = void 0;
const Nn = B, ph = rt, _h = L, mh = function(a) {
  const t = Math.round(this.levels() * 254) + 1, e = a.data, i = e.length, r = 255 / t;
  for (let n = 0; n < i; n += 1)
    e[n] = Math.floor(e[n] / r) * r;
};
Yi.Posterize = mh;
Nn.Factory.addGetterSetter(ph.Node, "levels", 0.5, (0, _h.getNumberValidator)(), Nn.Factory.afterSetFilter);
var Ki = {};
Object.defineProperty(Ki, "__esModule", { value: !0 });
Ki.RGB = void 0;
const oi = B, zr = rt, yh = L, bh = function(a) {
  const t = a.data, e = t.length, i = this.red(), r = this.green(), n = this.blue();
  for (let s = 0; s < e; s += 4) {
    const o = (0.34 * t[s] + 0.5 * t[s + 1] + 0.16 * t[s + 2]) / 255;
    t[s] = o * i, t[s + 1] = o * r, t[s + 2] = o * n, t[s + 3] = t[s + 3];
  }
};
Ki.RGB = bh;
oi.Factory.addGetterSetter(zr.Node, "red", 0, function(a) {
  return this._filterUpToDate = !1, a > 255 ? 255 : a < 0 ? 0 : Math.round(a);
});
oi.Factory.addGetterSetter(zr.Node, "green", 0, function(a) {
  return this._filterUpToDate = !1, a > 255 ? 255 : a < 0 ? 0 : Math.round(a);
});
oi.Factory.addGetterSetter(zr.Node, "blue", 0, yh.RGBComponent, oi.Factory.afterSetFilter);
var Xi = {};
Object.defineProperty(Xi, "__esModule", { value: !0 });
Xi.RGBA = void 0;
const Ue = B, qi = rt, vh = L, Sh = function(a) {
  const t = a.data, e = t.length, i = this.red(), r = this.green(), n = this.blue(), s = this.alpha();
  for (let o = 0; o < e; o += 4) {
    const l = 1 - s;
    t[o] = i * s + t[o] * l, t[o + 1] = r * s + t[o + 1] * l, t[o + 2] = n * s + t[o + 2] * l;
  }
};
Xi.RGBA = Sh;
Ue.Factory.addGetterSetter(qi.Node, "red", 0, function(a) {
  return this._filterUpToDate = !1, a > 255 ? 255 : a < 0 ? 0 : Math.round(a);
});
Ue.Factory.addGetterSetter(qi.Node, "green", 0, function(a) {
  return this._filterUpToDate = !1, a > 255 ? 255 : a < 0 ? 0 : Math.round(a);
});
Ue.Factory.addGetterSetter(qi.Node, "blue", 0, vh.RGBComponent, Ue.Factory.afterSetFilter);
Ue.Factory.addGetterSetter(qi.Node, "alpha", 1, function(a) {
  return this._filterUpToDate = !1, a > 1 ? 1 : a < 0 ? 0 : a;
});
var Qi = {};
Object.defineProperty(Qi, "__esModule", { value: !0 });
Qi.Sepia = void 0;
const wh = function(a) {
  const t = a.data, e = t.length;
  for (let i = 0; i < e; i += 4) {
    const r = t[i + 0], n = t[i + 1], s = t[i + 2];
    t[i + 0] = Math.min(255, r * 0.393 + n * 0.769 + s * 0.189), t[i + 1] = Math.min(255, r * 0.349 + n * 0.686 + s * 0.168), t[i + 2] = Math.min(255, r * 0.272 + n * 0.534 + s * 0.131);
  }
};
Qi.Sepia = wh;
var Ji = {};
Object.defineProperty(Ji, "__esModule", { value: !0 });
Ji.Solarize = void 0;
const Ch = function(a) {
  const t = a.data, e = a.width, i = a.height, r = e * 4;
  let n = i;
  do {
    const s = (n - 1) * r;
    let o = e;
    do {
      const l = s + (o - 1) * 4;
      let h = t[l], u = t[l + 1], f = t[l + 2];
      h > 127 && (h = 255 - h), u > 127 && (u = 255 - u), f > 127 && (f = 255 - f), t[l] = h, t[l + 1] = u, t[l + 2] = f;
    } while (--o);
  } while (--n);
};
Ji.Solarize = Ch;
var Zi = {};
Object.defineProperty(Zi, "__esModule", { value: !0 });
Zi.Threshold = void 0;
const Ln = B, xh = rt, kh = L, Ah = function(a) {
  const t = this.threshold() * 255, e = a.data, i = e.length;
  for (let r = 0; r < i; r += 1)
    e[r] = e[r] < t ? 0 : 255;
};
Zi.Threshold = Ah;
Ln.Factory.addGetterSetter(xh.Node, "threshold", 0.5, (0, kh.getNumberValidator)(), Ln.Factory.afterSetFilter);
Object.defineProperty(hi, "__esModule", { value: !0 });
hi.Konva = void 0;
const Gn = Qn, Ph = gi, Eh = mi, Mh = vi, Th = Si, Rh = wi, In = ye, $h = ze, Fh = Pe, Oh = je, Dh = ki, Nh = Ai, Lh = Pi, Gh = Ei, Ih = Me, Uh = Mi, Bh = Ti, Vh = Ri, Hh = Fi, zh = Oi, Wh = Di, jh = Ni, Yh = Gi, Kh = Ii, Xh = Ui, qh = Bi, Qh = Vi, Jh = Hi, Zh = zi, td = Wi, ed = ji, id = Yi, rd = Ki, nd = Xi, ad = Qi, sd = Ji, od = Zi;
hi.Konva = Gn.Konva.Util._assign(Gn.Konva, {
  Arc: Ph.Arc,
  Arrow: Eh.Arrow,
  Circle: Mh.Circle,
  Ellipse: Th.Ellipse,
  Image: Rh.Image,
  Label: In.Label,
  Tag: In.Tag,
  Line: $h.Line,
  Path: Fh.Path,
  Rect: Oh.Rect,
  RegularPolygon: Dh.RegularPolygon,
  Ring: Nh.Ring,
  Sprite: Lh.Sprite,
  Star: Gh.Star,
  Text: Ih.Text,
  TextPath: Uh.TextPath,
  Transformer: Bh.Transformer,
  Wedge: Vh.Wedge,
  Filters: {
    Blur: Hh.Blur,
    Brighten: zh.Brighten,
    Contrast: Wh.Contrast,
    Emboss: jh.Emboss,
    Enhance: Yh.Enhance,
    Grayscale: Kh.Grayscale,
    HSL: Xh.HSL,
    HSV: qh.HSV,
    Invert: Qh.Invert,
    Kaleidoscope: Jh.Kaleidoscope,
    Mask: Zh.Mask,
    Noise: td.Noise,
    Pixelate: ed.Pixelate,
    Posterize: id.Posterize,
    RGB: rd.RGB,
    RGBA: nd.RGBA,
    Sepia: ad.Sepia,
    Solarize: sd.Solarize,
    Threshold: od.Threshold
  }
});
var ld = Mr.exports;
Object.defineProperty(ld, "__esModule", { value: !0 });
const hd = hi;
Mr.exports = hd.Konva;
var dd = Mr.exports;
const Z = /* @__PURE__ */ os(dd);
function Wr(a) {
  return a.split(".", 1)[0] ?? "";
}
function cd(a, t, e) {
  const i = t == null ? void 0 : t.attributes.friendly_name;
  return typeof i == "string" && i.trim() ? i : e != null && e.name ? e.name : a.entity_id;
}
function $a(a, t, e) {
  return a.label_mode === "off" ? "" : a.label_mode === "short" ? a.entity_id.split(".").at(-1) ?? a.entity_id : cd(a, t, e);
}
function Fa(a, t) {
  var r;
  if (!a) return "";
  if (!t) return "Unavailable";
  const e = a.source === "attr" && a.attr ? t.attributes[a.attr] : t.state;
  if (e == null || e === "")
    return "Unavailable";
  const i = String(e);
  return (r = a.format) != null && r.includes("{value}") ? a.format.split("{value}").join(i) : i;
}
function Un(a, t, e = "primary") {
  return Fa(a.bind[e], t);
}
function Bn(a, t) {
  return a != null && a.entity_id ? Fa(a, t[a.entity_id]) : "";
}
function ud(a, t) {
  return (a ?? []).filter((e) => {
    var i;
    return ((i = t[e.entity_id]) == null ? void 0 : i.state) === e.when.state_is;
  });
}
function fd(a, t) {
  if (!t) return !0;
  const { domains: e, tags: i, area_ids: r } = t.filters;
  return !(e != null && e.length && !e.includes(Wr(a.entity_id)) || i != null && i.length && !i.some((n) => a.tags.includes(n)) || r != null && r.length && (!a.area_id || !r.includes(a.area_id)));
}
function Oa(a) {
  return !a || ["unavailable", "unknown"].includes(a.state) ? "#9e9e9e" : ["on", "open", "playing", "home", "heat"].includes(a.state) ? "#ffb300" : "#1976d2";
}
function gd(a) {
  const t = {
    binary_sensor: "B",
    climate: "T",
    device_tracker: "N",
    light: "L",
    media_player: "M",
    sensor: "S",
    switch: "P"
  }, e = Wr(a);
  return t[e] ?? e.slice(0, 1).toUpperCase() ?? "?";
}
function pd(a) {
  const t = Wr(a);
  return t === "climate" ? ["heating"] : t === "device_tracker" ? ["network"] : [];
}
const Vn = {
  "panel.title": "Floorplan",
  "panel.plan": "Plan:",
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
  "panel.configTooLarge": "The configuration file must not exceed 20 MB.",
  "panel.invalidConfig": "The file is not a valid configuration.",
  "panel.importFailed": "Import failed: {message}",
  "panel.imported": "Configuration imported and saved.",
  "panel.imageTypeError": "Only PNG and JPEG floorplans are supported.",
  "panel.imageTooLarge": "The floorplan image must not exceed 4 MB.",
  "panel.imageUploadFailed": "The selected image could not be uploaded.",
  "editor.title": "Edit floorplan",
  "editor.quickActions": "Quick actions",
  "editor.entities": "Entities",
  "editor.planView": "Plan and views",
  "editor.viewOverlay": "View and overlays",
  "editor.upload": "Upload image",
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
  "dialog.deletePlanMessage": "Delete current plan? This cannot be undone.",
  "dialog.deleteAreaMessage": "Delete selected area? This cannot be undone.",
  "dialog.deleteMarkerMessage": "Delete selected marker?",
  "dialog.newView": "New view name",
  "dialog.renameView": "Rename view",
  "dialog.deleteViewMessage": "Delete the current view?",
  "dialog.importMessage": "Import {plans} plan(s) and {views} view(s)?",
  "dialog.import": "Import"
}, _d = {
  "panel.title": "Grundriss",
  "panel.plan": "Plan:",
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
  "panel.configTooLarge": "Die Konfigurationsdatei darf höchstens 20 MB groß sein.",
  "panel.invalidConfig": "Die Datei enthält keine gültige Konfiguration.",
  "panel.importFailed": "Import fehlgeschlagen: {message}",
  "panel.imported": "Konfiguration importiert und gespeichert.",
  "panel.imageTypeError": "Es werden nur PNG- und JPEG-Grundrisse unterstützt.",
  "panel.imageTooLarge": "Das Grundrissbild darf höchstens 4 MB groß sein.",
  "panel.imageUploadFailed": "Das ausgewählte Bild konnte nicht hochgeladen werden.",
  "editor.title": "Grundriss bearbeiten",
  "editor.quickActions": "Schnellaktionen",
  "editor.entities": "Entitäten",
  "editor.planView": "Plan und Ansichten",
  "editor.viewOverlay": "Ansicht und Overlays",
  "editor.upload": "Bild hochladen",
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
  "dialog.deletePlanMessage": "Aktuellen Plan unwiderruflich löschen?",
  "dialog.deleteAreaMessage": "Ausgewählten Bereich unwiderruflich löschen?",
  "dialog.deleteMarkerMessage": "Ausgewählten Marker löschen?",
  "dialog.newView": "Name der neuen Ansicht",
  "dialog.renameView": "Ansicht umbenennen",
  "dialog.deleteViewMessage": "Aktuelle Ansicht löschen?",
  "dialog.importMessage": "{plans} Plan/Pläne und {views} Ansicht(en) importieren?",
  "dialog.import": "Importieren"
};
function md(a) {
  const t = a != null && a.toLowerCase().startsWith("de") ? _d : Vn;
  return (e, i = {}) => {
    let r = t[e] ?? Vn[e] ?? String(e);
    for (const [n, s] of Object.entries(i))
      r = r.split(`{${n}}`).join(String(s));
    return r;
  };
}
const yd = 3, bd = 2e7;
function vd(a) {
  return structuredClone(a);
}
function Da(a) {
  const t = vd(a);
  for (const e of t.plans)
    e.background.asset_id && delete e.background.url;
  return t;
}
async function Sd(a) {
  return a.callWS({
    type: "floorplan_ui/get_config"
  });
}
async function wd(a, t, e) {
  return (await a.callWS({
    type: "floorplan_ui/save_config",
    base_revision: e,
    config: Da(t)
  })).revision;
}
async function Cd(a, t) {
  return (await a.callWS({
    type: "floorplan_ui/validate_config",
    config: Da(t)
  })).config;
}
async function xd(a) {
  return a.callWS({
    type: "floorplan_ui/list_registry"
  });
}
function kd(a) {
  var e;
  if (!a || typeof a != "object")
    return;
  const t = a;
  return typeof t.code == "string" ? t.code : typeof ((e = t.error) == null ? void 0 : e.code) == "string" ? t.error.code : void 0;
}
const Na = 4e6, Ad = "/api/floorplan_ui/assets";
function La(a) {
  return structuredClone(a);
}
function Pd(a) {
  return new Promise((t, e) => {
    const i = new FileReader();
    i.onload = () => t(String(i.result)), i.onerror = () => e(i.error ?? new Error("The image could not be read.")), i.readAsDataURL(a);
  });
}
function Ed(a) {
  return fetch(a).then((t) => {
    if (!t.ok)
      throw new Error("An embedded image could not be decoded.");
    return t.blob();
  });
}
async function Ga(a, t) {
  if (!["image/png", "image/jpeg"].includes(t.type))
    throw new Error("Only PNG and JPEG floorplans are supported.");
  if (t.size > Na)
    throw new Error("The floorplan image must not exceed 4 MB.");
  const e = await a.fetchWithAuth(Ad, {
    method: "POST",
    headers: { "Content-Type": t.type },
    body: t
  }), i = await e.json();
  if (!e.ok || !("asset_id" in i))
    throw new Error("error" in i && i.error ? i.error : "Image upload failed.");
  return i;
}
async function Md(a) {
  const t = La(a);
  for (const e of t.plans) {
    const i = e.background;
    if (!i.asset_id || !i.url)
      continue;
    const r = await fetch(i.url);
    if (!r.ok)
      throw new Error(`The image for "${e.name}" could not be exported.`);
    const n = await r.blob();
    i.url = await Pd(n), delete i.asset_id, delete i.content_type;
  }
  return t;
}
async function Td(a, t) {
  var i;
  const e = La(t);
  for (const r of e.plans ?? []) {
    const n = r.background;
    if (!((i = n == null ? void 0 : n.url) != null && i.startsWith("data:")))
      continue;
    const s = await Ga(a, await Ed(n.url));
    r.background = {
      type: "image",
      asset_id: s.asset_id,
      content_type: s.content_type,
      url: s.url,
      width: n.width,
      height: n.height
    };
  }
  return e;
}
class Rd {
  constructor(t, e) {
    this._save = t, this._callbacks = e, this._revision = 0, this._pending = null, this._failed = null, this._running = !1;
  }
  reset(t) {
    var e;
    for (const i of ((e = this._pending) == null ? void 0 : e.waiters) ?? [])
      i(!1);
    this._revision = t, this._pending = null, this._failed = null, this._callbacks.onStatus({ state: "idle", dirty: !1 });
  }
  enqueue(t) {
    const e = structuredClone(t);
    this._failed = null;
    const i = new Promise((r) => {
      this._pending ? (this._pending.config = e, this._pending.waiters.push(r)) : this._pending = { config: e, waiters: [r] };
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
          const t = this._pending;
          this._pending = null, this._callbacks.onStatus({ state: "saving", dirty: !0 });
          try {
            this._revision = await this._save(t.config, this._revision), this._callbacks.onSaved(this._revision);
            for (const e of t.waiters)
              e(!0);
          } catch (e) {
            const i = this._pending;
            this._failed = (i == null ? void 0 : i.config) ?? t.config;
            const r = (i == null ? void 0 : i.waiters) ?? [];
            this._pending = null;
            for (const n of [...t.waiters, ...r])
              n(!1);
            this._callbacks.onStatus({ state: "failed", dirty: !0, error: e });
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
class $d {
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
function Fd(a, t) {
  const e = a.getBoundingClientRect(), i = new Z.Stage({
    container: a,
    width: Math.max(e.width, 400),
    height: Math.max(e.height, 300),
    draggable: !0
  }), r = new Z.Layer(), n = new Z.Layer(), s = new Z.Layer();
  i.add(r), i.add(n), i.add(s), i.on("click", (f) => {
    t.isEditing() && f.target === i && t.onEmptyCanvasClick();
  }), i.on("wheel", (f) => {
    f.evt.preventDefault();
    const p = i.getPointerPosition();
    if (!p) return;
    const _ = i.scaleX(), c = {
      x: (p.x - i.x()) / _,
      y: (p.y - i.y()) / _
    }, { minZoom: y, maxZoom: m } = t.getZoomLimits(), S = f.evt.deltaY > 0 ? _ / 1.1 : _ * 1.1, w = Math.max(y, Math.min(m, S));
    i.scale({ x: w, y: w }), i.position({
      x: p.x - c.x * w,
      y: p.y - c.y * w
    });
  });
  let o = null, l = 0;
  const h = () => {
    o = null, l = 0, i.draggable(!0);
  };
  i.on("touchmove", (f) => {
    const p = f.evt.touches[0], _ = f.evt.touches[1];
    if (!p || !_) {
      h();
      return;
    }
    f.evt.preventDefault(), i.draggable(!1);
    const c = a.getBoundingClientRect(), y = { x: p.clientX - c.left, y: p.clientY - c.top }, m = { x: _.clientX - c.left, y: _.clientY - c.top }, S = {
      x: (y.x + m.x) / 2,
      y: (y.y + m.y) / 2
    }, w = Math.hypot(m.x - y.x, m.y - y.y);
    if (!o || l === 0) {
      o = S, l = w;
      return;
    }
    const d = i.scaleX(), g = {
      x: (o.x - i.x()) / d,
      y: (o.y - i.y()) / d
    }, { minZoom: b, maxZoom: x } = t.getZoomLimits(), P = d * (w / l), v = Math.max(b, Math.min(x, P));
    i.scale({ x: v, y: v }), i.position({
      x: S.x - g.x * v,
      y: S.y - g.y * v
    }), o = S, l = w;
  }), i.on("touchend", (f) => {
    f.evt.touches.length < 2 && h();
  });
  const u = new ResizeObserver(([f]) => {
    if (!f) return;
    const { width: p, height: _ } = f.contentRect;
    p > 0 && _ > 0 && i.size({ width: p, height: _ });
  });
  return u.observe(a), {
    stage: i,
    backgroundLayer: r,
    areasLayer: n,
    markersLayer: s,
    destroy: () => {
      u.disconnect(), i.destroy();
    }
  };
}
function Od(a, t, e) {
  const i = Math.min(a.width() / t, a.height() / e) * 0.9;
  a.scale({ x: i, y: i }), a.position({
    x: (a.width() - t * i) / 2,
    y: (a.height() - e * i) / 2
  });
}
function Dd(a) {
  return a.getAbsoluteTransform().copy().invert().point({
    x: a.width() / 2,
    y: a.height() / 2
  });
}
function Nd(a, t) {
  const e = a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "view";
  let i = e, r = 2;
  for (; t.some((n) => n.id === i); )
    i = `${e}-${r++}`;
  return { id: i, name: a, filters: {} };
}
function Je(a, t, e) {
  return {
    ...a,
    views: a.views.map((i) => i.id === t ? e(i) : i)
  };
}
function Ld(a, t, e) {
  const i = a.views.findIndex((s) => s.id === t), r = i + e;
  if (i < 0 || r < 0 || r >= a.views.length)
    return null;
  const n = [...a.views];
  return [n[i], n[r]] = [n[r], n[i]], { ...a, views: n };
}
function Gd(a, t) {
  var r;
  const e = a.views.filter((n) => n.id !== t);
  if (e.length === a.views.length || e.length === 0)
    return null;
  const i = ((r = e.find((n) => n.id === "all")) == null ? void 0 : r.id) ?? e[0].id;
  return {
    nextViewId: i,
    config: {
      ...a,
      default_view: a.default_view === t ? i : a.default_view,
      views: e
    }
  };
}
function Id(a, t, e) {
  return {
    ...a,
    plans: a.plans.map(
      (i) => i.plan_id === t ? { ...i, markers: [...i.markers, e] } : i
    )
  };
}
function Ud(a, t, e, i) {
  return {
    ...a,
    plans: a.plans.map(
      (r) => r.plan_id === t ? {
        ...r,
        markers: r.markers.map(
          (n) => n.id === e ? { ...n, ...i } : n
        )
      } : r
    )
  };
}
function Bd(a, t, e) {
  return {
    ...a,
    plans: a.plans.map(
      (i) => i.plan_id === t ? {
        ...i,
        markers: i.markers.filter((r) => r.id !== e)
      } : i
    )
  };
}
function Vd(a, t, e) {
  return {
    plan_id: a,
    name: t.replace(/\.[^.]+$/, ""),
    background: e,
    areas: [],
    markers: [],
    view: { minZoom: 0.1, maxZoom: 5 }
  };
}
function Hd(a, t) {
  return {
    ...a,
    plans: [...a.plans, t]
  };
}
function zd(a, t, e) {
  return {
    ...a,
    plans: a.plans.map((i) => i.plan_id === t ? { ...i, name: e } : i)
  };
}
function Wd(a, t) {
  var i;
  const e = a.plans.filter((r) => r.plan_id !== t);
  return e.length === a.plans.length ? null : {
    config: { ...a, plans: e },
    nextPlanId: ((i = e[0]) == null ? void 0 : i.plan_id) ?? null
  };
}
function jd(a, t, e) {
  return {
    id: a,
    area_id: "",
    shape: t === "polygon" ? {
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
    },
    tags: [],
    style: {
      fillOpacity: 0.4,
      strokeWidth: 2,
      fill: "#2196f3",
      stroke: "#2196f3"
    }
  };
}
function Yd(a, t, e) {
  return {
    ...a,
    plans: a.plans.map(
      (i) => i.plan_id === t ? { ...i, areas: [...i.areas, e] } : i
    )
  };
}
function xr(a, t, e, i) {
  return {
    ...a,
    plans: a.plans.map(
      (r) => r.plan_id === t ? {
        ...r,
        areas: r.areas.map((n) => n.id === e ? i(n) : n)
      } : r
    )
  };
}
function Kd(a, t, e, i) {
  return xr(a, t, e, (r) => {
    if (r.shape.type === "rect") {
      const { x: l, y: h, width: u, height: f } = i;
      return {
        ...r,
        shape: {
          ...r.shape,
          ...l === void 0 ? {} : { x: l },
          ...h === void 0 ? {} : { y: h },
          ...u === void 0 ? {} : { width: u },
          ...f === void 0 ? {} : { height: f }
        }
      };
    }
    const { x: n, y: s, points: o } = i;
    return {
      ...r,
      shape: {
        ...r.shape,
        ...n === void 0 ? {} : { x: n },
        ...s === void 0 ? {} : { y: s },
        ...o && o.length >= 6 ? { points: o } : {}
      }
    };
  });
}
function Xd(a, t, e) {
  return {
    ...a,
    plans: a.plans.map(
      (i) => i.plan_id === t ? { ...i, areas: i.areas.filter((r) => r.id !== e) } : i
    )
  };
}
function qd(a) {
  const { layer: t, plan: e, shapes: i } = a;
  if (t.destroyChildren(), i.clear(), !!e)
    for (const r of e.areas ?? []) {
      if (!Qd(r, a.view)) continue;
      const n = Jd(r, a.editMode);
      n && (n.on("click", (s) => {
        s.cancelBubble = !0, a.editMode && a.onSelect(r.id);
      }), n.on("dragend", () => {
        if (!a.editMode) return;
        const s = n.position();
        a.onUpdateShape(r.id, { x: s.x, y: s.y }), a.onRerender();
      }), t.add(n), i.set(r.id, n), Zd(t, r, n, a.view, a.states, a.areas), a.editMode && a.selectedAreaId === r.id && (r.shape.type === "polygon" && n instanceof Z.Line ? tc(t, r, n, a) : r.shape.type === "rect" && n instanceof Z.Rect && ec(t, r.id, n, a)));
    }
}
function Qd(a, t) {
  const e = t == null ? void 0 : t.filters.area_ids;
  if (e != null && e.length && (!a.area_id || !e.includes(a.area_id)))
    return !1;
  const i = t == null ? void 0 : t.filters.tags;
  return !(i != null && i.length) || i.some((r) => a.tags.includes(r));
}
function Jd(a, t) {
  var r;
  const { shape: e, style: i } = a;
  return e.type === "polygon" && (((r = e.points) == null ? void 0 : r.length) ?? 0) >= 6 ? new Z.Line({
    x: e.x ?? 0,
    y: e.y ?? 0,
    points: e.points,
    closed: !0,
    fill: i.fill ?? "#2196f3",
    stroke: i.stroke ?? "#1976d2",
    strokeWidth: i.strokeWidth ?? 2,
    opacity: i.fillOpacity ?? 0.4,
    draggable: t
  }) : e.type === "rect" ? new Z.Rect({
    x: e.x ?? 0,
    y: e.y ?? 0,
    width: e.width ?? 100,
    height: e.height ?? 80,
    fill: i.fill ?? "#2196f3",
    stroke: i.stroke ?? "#1976d2",
    strokeWidth: i.strokeWidth ?? 2,
    opacity: i.fillOpacity ?? 0.4,
    draggable: t
  }) : null;
}
function Zd(a, t, e, i, r, n) {
  var p, _, c, y;
  const s = [], o = (p = n.find((m) => m.id === t.area_id)) == null ? void 0 : p.name;
  t.area_id && s.push(o ?? t.area_id);
  const l = Bn((_ = i == null ? void 0 : i.area_overlay) == null ? void 0 : _.primary, r), h = Bn((c = i == null ? void 0 : i.area_overlay) == null ? void 0 : c.secondary, r);
  l && s.push(l), h && s.push(h);
  for (const m of ud((y = i == null ? void 0 : i.area_overlay) == null ? void 0 : y.badges, r))
    s.push(`${m.icon ? `${m.icon} ` : ""}${m.label ?? m.entity_id}`);
  if (!s.length) return;
  const u = e.getClientRect({ relativeTo: a }), f = new Z.Label({
    x: u.x + 8,
    y: u.y + 8,
    listening: !1
  });
  f.add(
    new Z.Tag({
      fill: "rgba(255,255,255,0.88)",
      cornerRadius: 4,
      shadowColor: "rgba(0,0,0,0.25)",
      shadowBlur: 3
    }),
    new Z.Text({
      text: s.join(`
`),
      fontSize: 13,
      fontStyle: "bold",
      fill: "#0d47a1",
      padding: 5,
      lineHeight: 1.2
    })
  ), a.add(f);
}
function tc(a, t, e, i) {
  if (t.shape.type !== "polygon") return;
  const r = [...t.shape.points], n = t.shape.x ?? 0, s = t.shape.y ?? 0;
  for (let o = 0; o < r.length; o += 2) {
    const l = new Z.Circle({
      x: n + r[o],
      y: s + r[o + 1],
      radius: 7,
      fill: "#ffffff",
      stroke: "#d32f2f",
      strokeWidth: 3,
      draggable: !0
    });
    l.on("dragmove", () => {
      r[o] = l.x() - n, r[o + 1] = l.y() - s, e.points(r), a.batchDraw();
    }), l.on("dragend", () => {
      i.onUpdateShape(t.id, { points: [...r] }), i.onRerender();
    }), a.add(l);
  }
}
function ec(a, t, e, i) {
  const r = new Z.Transformer({
    nodes: [e],
    rotateEnabled: !1,
    keepRatio: !1,
    anchorSize: 9,
    boundBoxFunc: (n, s) => s.width < 20 || s.height < 20 ? n : s
  });
  e.on("transformend", () => {
    const n = Math.max(20, e.width() * e.scaleX()), s = Math.max(20, e.height() * e.scaleY());
    e.scale({ x: 1, y: 1 }), i.onUpdateShape(t, {
      x: e.x(),
      y: e.y(),
      width: n,
      height: s
    }), i.onRerender();
  }), a.add(r);
}
function ic(a) {
  var e, i, r, n;
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
  (r = a.areasLayer) == null || r.batchDraw(), (n = a.markersLayer) == null || n.batchDraw();
}
function rc(a) {
  const { layer: t, plan: e, groups: i } = a;
  if (t.destroyChildren(), i.clear(), !e) return;
  const r = new Map(a.entities.map((n) => [n.entity_id, n]));
  for (const n of e.markers ?? []) {
    if (!fd(n, a.view)) continue;
    const s = a.states[n.entity_id], o = r.get(n.entity_id), l = nc(n, s, o, a);
    l.on("click", (h) => {
      h.cancelBubble = !0, a.editMode ? a.onSelect(n.id) : a.onOpenMoreInfo(n.entity_id);
    }), l.on("dragend", () => {
      a.editMode && a.onMove(n.id, l.position());
    }), l.on("mouseenter", () => {
      a.stage && (a.stage.container().style.cursor = "pointer");
    }), l.on("mouseleave", () => {
      a.stage && (a.stage.container().style.cursor = "default");
    }), t.add(l), i.set(n.id, l);
  }
  t.batchDraw();
}
function nc(a, t, e, i) {
  const r = new Z.Group({
    x: a.pos.x,
    y: a.pos.y,
    draggable: i.editMode
  });
  return r.add(
    new Z.Circle({
      name: "marker-dot",
      radius: 19,
      fill: Oa(t),
      stroke: "#ffffff",
      strokeWidth: i.selectedMarkerId === a.id ? 4 : 2,
      shadowColor: "#000000",
      shadowBlur: 5,
      shadowOpacity: 0.25
    }),
    new Z.Text({
      x: -10,
      y: -10,
      width: 20,
      align: "center",
      text: gd(a.entity_id),
      fill: "#ffffff",
      fontSize: 16,
      fontStyle: "bold",
      listening: !1
    }),
    new Z.Text({
      name: "marker-label",
      x: 26,
      y: -17,
      text: a.label_mode === "off" ? "" : $a(a, t, e),
      fill: "#212121",
      fontSize: 13,
      fontStyle: "bold",
      padding: 2,
      listening: !1
    }),
    new Z.Text({
      name: "marker-value",
      x: 26,
      y: 1,
      text: Ia(a, t),
      fill: "#424242",
      fontSize: 12,
      padding: 2,
      listening: !1
    })
  ), r;
}
function ac(a) {
  const t = new Map(a.entities.map((e) => [e.entity_id, e]));
  for (const e of a.plan.markers ?? []) {
    const i = a.groups.get(e.id);
    if (!i) continue;
    const r = a.states[e.entity_id], n = i.findOne(".marker-dot"), s = i.findOne(".marker-value"), o = i.findOne(".marker-label");
    n == null || n.fill(Oa(r)), s == null || s.text(Ia(e, r)), o == null || o.text(
      e.label_mode === "off" ? "" : $a(e, r, t.get(e.entity_id))
    );
  }
  a.layer.batchDraw();
}
function Ia(a, t) {
  return [Un(a, t), Un(a, t, "secondary")].filter(Boolean).join(" · ");
}
function sc(a, t, e) {
  a.add(
    new Z.Rect({
      x: 0,
      y: 0,
      width: t,
      height: e,
      fill: "#f5f5f5"
    })
  );
  const i = new Z.Text({
    x: t / 2,
    y: e / 2 - 50,
    text: "🏠",
    fontSize: 48
  });
  i.offsetX(i.width() / 2), a.add(i);
  const r = new Z.Text({
    x: t / 2,
    y: e / 2 + 10,
    text: "No Floorplan Loaded",
    fontSize: 20,
    fontStyle: "bold",
    fill: "#333"
  });
  r.offsetX(r.width() / 2), a.add(r);
  const n = new Z.Text({
    x: t / 2,
    y: e / 2 + 40,
    text: 'Click "Edit" → "Upload Image" to get started',
    fontSize: 14,
    fill: "#666"
  });
  n.offsetX(n.width() / 2), a.add(n);
}
function oc(a, t, e) {
  a.add(
    new Z.Rect({
      x: 0,
      y: 0,
      width: t,
      height: e,
      fill: "#fff3e0"
    })
  );
  const i = new Z.Text({
    x: t / 2,
    y: e / 2 - 10,
    text: "Failed to load floorplan image",
    fontSize: 18,
    fontStyle: "bold",
    fill: "#e65100"
  });
  i.offsetX(i.width() / 2), a.add(i);
  const r = new Z.Text({
    x: t / 2,
    y: e / 2 + 20,
    text: "Try re-uploading the image in Edit mode.",
    fontSize: 14,
    fill: "#e65100"
  });
  r.offsetX(r.width() / 2), a.add(r);
}
const lc = jn`
  :host {
    display: block;
    height: 100%;
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
    flex: 1;
    min-height: 0;
  }

  .workspace.editing {
    grid-template-columns: clamp(320px, 24vw, 390px) minmax(0, 1fr);
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--app-header-background-color, #03a9f4);
    color: var(--app-header-text-color, #fff);
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
    font-weight: 500;
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
    border-radius: 4px;
    border: none;
    font-size: 14px;
  }

  .view-tabs {
    display: flex;
    gap: 4px;
    min-width: 0;
  }

  .view-tab {
    min-width: 0;
    max-width: min(260px, calc(100vw - 40px));
    overflow: hidden;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.2);
    color: inherit;
    cursor: pointer;
    font-size: 14px;
    text-overflow: ellipsis;
    transition: background 0.2s;
    white-space: nowrap;
  }

  .view-tab:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .view-tab.active {
    background: rgba(255, 255, 255, 0.95);
    color: var(--app-header-background-color, #03a9f4);
  }

  .edit-toggle {
    padding: 6px 16px;
    border: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 4px;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
  }

  .edit-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .edit-toggle.active {
    background: rgba(255, 255, 255, 0.95);
    color: var(--app-header-background-color, #03a9f4);
    border-color: transparent;
  }

  .canvas-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: #f5f5f5;
    min-height: 400px;
  }

  .canvas-wrapper {
    width: 100%;
    height: 100%;
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

  .empty-state h2 {
    margin: 0;
    font-size: 24px;
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
    background: var(--primary-color, #03a9f4);
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
  }

  .empty-state .upload-btn:hover {
    opacity: 0.9;
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
    border-inline-end: 1px solid var(--divider-color, #d7d7d7);
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
    letter-spacing: 0.04em;
    text-transform: uppercase;
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

  .editor-add-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
    margin-top: 8px;
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

  .status {
    padding: 6px 16px;
    background: #e8f5e9;
    color: #1b5e20;
    font-size: 13px;
  }

  .status.error {
    background: #ffebee;
    color: #b71c1c;
  }

  .status button {
    margin-left: 12px;
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

  .narrow .toolbar,
  .narrow .toolbar-left {
    align-items: stretch;
    flex-wrap: wrap;
  }

  .narrow .toolbar,
  .narrow .toolbar-left {
    gap: 8px;
  }

  .narrow .toolbar-left {
    width: 100%;
    flex: 1 1 100%;
  }

  .narrow .plan-select {
    flex: 1 1 220px;
  }

  .narrow .view-tabs {
    width: 100%;
    overflow-x: auto;
  }

  .narrow .workspace.editing {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(260px, 45vh) minmax(400px, 1fr);
    align-content: start;
    overflow-y: auto;
  }

  .narrow .editor-panel {
    border-inline-end: 0;
    border-bottom: 1px solid var(--divider-color, #d7d7d7);
  }

  .narrow button,
  .narrow select,
  .narrow input {
    min-height: 44px;
  }

  @media (max-width: 900px) {
    .toolbar,
    .toolbar-left {
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .workspace.editing {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: minmax(260px, 45vh) minmax(400px, 1fr);
      align-content: start;
      overflow-y: auto;
    }

    .editor-panel {
      border-inline-end: 0;
      border-bottom: 1px solid var(--divider-color, #d7d7d7);
    }

    .toolbar button,
    .toolbar select,
    .editor-panel button,
    .editor-panel select,
    .editor-panel input,
    .editor-panel .entity-card {
      min-height: 44px;
    }

    .view-tabs {
      flex-wrap: wrap;
    }
  }

  @media (max-width: 520px) {
    .editor-actions,
    .editor-fields {
      grid-template-columns: minmax(0, 1fr);
    }

    .editor-field-wide {
      grid-column: auto;
    }

    .editor-add-row {
      grid-template-columns: minmax(0, 1fr);
    }
  }
`;
function hc(a, t, e) {
  var l, h, u, f, p, _, c, y, m, S, w, d, g, b, x, P, v, E, k, M, T;
  const { currentPlan: i, currentView: r, currentViewId: n, selectedArea: s, selectedMarker: o } = a;
  return Y`
    <aside class="editor-panel" aria-label=${e("editor.title")}>
      <header class="editor-panel-header">
        <span>${e("editor.title")}</span>
        <strong>${(i == null ? void 0 : i.name) ?? e("panel.selectPlan")}</strong>
      </header>

      <section class="editor-card">
        <h2>${e("editor.quickActions")}</h2>
        <div class="editor-actions">
          <button type="button" @click=${t.uploadImage}>${e("editor.upload")}</button>
          <button type="button" ?disabled=${!a.canUndo} @click=${t.undo}>
            ${e("editor.undo")}
          </button>
          <button type="button" ?disabled=${!a.canRedo} @click=${t.redo}>
            ${e("editor.redo")}
          </button>
          <button type="button" ?disabled=${!i} @click=${t.addAreaRect}>
            + ${e("editor.addRectangle")}
          </button>
          <button type="button" ?disabled=${!i} @click=${t.addAreaPolygon}>
            + ${e("editor.addPolygon")}
          </button>
        </div>
      </section>

      ${s ? dc(s, a.areas, t, e) : ""}
      ${o ? cc(o, a.areas, t, e) : ""}

      <section class="editor-card editor-entities">
        <h2>${e("editor.entities")}</h2>
        <div class="editor-fields">
          <label>
            ${e("editor.searchEntity")}
            <input
              class="grow"
              type="search"
              .value=${a.entitySearch}
              @input=${(A) => t.setEntitySearch(A.target.value)}
              placeholder="light.kitchen"
            />
          </label>
          <label>
            ${e("editor.domain")}
            <select
              .value=${a.entityDomainFilter}
              @change=${(A) => t.setEntityDomainFilter(A.target.value)}
            >
              <option value="">${e("editor.allDomains")}</option>
              ${a.entityDomains.map(
    (A) => Y`<option value=${A}>${A}</option>`
  )}
            </select>
          </label>
          <label>
            ${e("editor.haArea")}
            <select
              .value=${a.entityAreaFilter}
              @change=${(A) => t.setEntityAreaFilter(A.target.value)}
            >
              <option value="">${e("editor.allAreas")}</option>
              ${a.areas.map((A) => Y`<option value=${A.id}>${A.name}</option>`)}
            </select>
          </label>
        </div>
        <div class="editor-add-row">
          <select
            aria-label=${e("editor.selectEntity", { count: a.entityCount })}
            .value=${a.entityToAdd}
            @change=${(A) => t.setEntityToAdd(A.target.value)}
          >
            <option value="">${e("editor.selectEntity", { count: a.entityCount })}</option>
            ${a.entityOptions.map(
    (A) => Y`
                <option value=${A.entity_id}>
                  ${A.entity_id}${A.name ? ` — ${A.name}` : ""}
                </option>
              `
  )}
          </select>
          <button
            type="button"
            ?disabled=${!i || !a.entityToAdd}
            @click=${t.addMarker}
          >
            + ${e("editor.addMarker")}
          </button>
        </div>
        <strong class="editor-helper">${e("editor.dragEntity")}</strong>
        <div class="entity-palette">
          ${a.entityOptions.slice(0, 80).map(
    (A) => Y`
              <div
                class="entity-card"
                draggable="true"
                @dragstart=${(F) => t.startEntityDrag(A.entity_id, F)}
                @pointerdown=${(F) => t.startEntityPointerDrag(A.entity_id, F)}
                title=${e("editor.dragHint")}
              >
                <strong>${A.name ?? A.entity_id}</strong>
                <span>${A.entity_id}</span>
              </div>
            `
  )}
        </div>
      </section>

      <details class="editor-card editor-plan-view">
        <summary>${e("editor.planView")}</summary>
        <div class="editor-card-body editor-actions">
          <button type="button" ?disabled=${!i} @click=${t.renamePlan}>
            ${e("editor.renamePlan")}
          </button>
          <button type="button" ?disabled=${!i} @click=${t.deletePlan}>
            ${e("editor.deletePlan")}
          </button>
          <button type="button" @click=${t.addView}>+ ${e("editor.addView")}</button>
          <button type="button" @click=${t.renameView}>${e("editor.renameView")}</button>
          <button type="button" @click=${() => t.moveView(-1)}>
            ← ${e("editor.previousView")}
          </button>
          <button type="button" @click=${() => t.moveView(1)}>
            ${e("editor.nextView")} →
          </button>
          <button type="button" @click=${t.setDefaultView}>${e("editor.setDefault")}</button>
          <button type="button" ?disabled=${n === "all"} @click=${t.deleteView}>
            ${e("editor.deleteView")}
          </button>
          <button type="button" @click=${t.exportConfig}>${e("editor.export")}</button>
          <button type="button" @click=${t.importConfig}>${e("editor.import")}</button>
        </div>
      </details>

      <details class="editor-card editor-advanced">
        <summary>${e("editor.viewOverlay")}</summary>
        <div class="editor-card-body">
          <section class="editor-subsection">
            <h3>${e("editor.viewFilters", { name: (r == null ? void 0 : r.name) ?? n })}</h3>
            <div class="editor-fields">
              <label>
                ${e("editor.domains")}
                <input
                  .value=${((l = r == null ? void 0 : r.filters.domains) == null ? void 0 : l.join(", ")) ?? ""}
                  @change=${(A) => t.updateViewFilter("domains", A)}
                  placeholder="light, switch"
                />
              </label>
              <label>
                ${e("editor.tags")}
                <input
                  .value=${((h = r == null ? void 0 : r.filters.tags) == null ? void 0 : h.join(", ")) ?? ""}
                  @change=${(A) => t.updateViewFilter("tags", A)}
                  placeholder="heating"
                />
              </label>
              <label>
                ${e("editor.areaIds")}
                <input
                  .value=${((u = r == null ? void 0 : r.filters.area_ids) == null ? void 0 : u.join(", ")) ?? ""}
                  @change=${(A) => t.updateViewFilter("area_ids", A)}
                  placeholder="living_room"
                />
              </label>
            </div>
          </section>
          <section class="editor-subsection">
            <h3>${e("editor.areaOverlay")}</h3>
            <div class="editor-fields">
              <label>
                ${e("editor.primaryEntity")}
                <input
                  .value=${((p = (f = r == null ? void 0 : r.area_overlay) == null ? void 0 : f.primary) == null ? void 0 : p.entity_id) ?? ""}
                  @change=${(A) => t.updateAreaOverlay("primary", "entity_id", A)}
                  placeholder="sensor.living_room_temperature"
                />
              </label>
              <label>
                ${e("editor.source")}
                <select
                  .value=${((c = (_ = r == null ? void 0 : r.area_overlay) == null ? void 0 : _.primary) == null ? void 0 : c.source) ?? "state"}
                  @change=${(A) => t.updateAreaOverlay("primary", "source", A)}
                >
                  <option value="state">${e("editor.state")}</option>
                  <option value="attr">${e("editor.attributeOption")}</option>
                </select>
              </label>
              <label>
                ${e("editor.attribute")}
                <input
                  .value=${((m = (y = r == null ? void 0 : r.area_overlay) == null ? void 0 : y.primary) == null ? void 0 : m.attr) ?? ""}
                  @change=${(A) => t.updateAreaOverlay("primary", "attr", A)}
                />
              </label>
              <label>
                ${e("editor.format")}
                <input
                  .value=${((w = (S = r == null ? void 0 : r.area_overlay) == null ? void 0 : S.primary) == null ? void 0 : w.format) ?? ""}
                  @change=${(A) => t.updateAreaOverlay("primary", "format", A)}
                  placeholder="{value} °C"
                />
              </label>
            </div>
          </section>
          <section class="editor-subsection">
            <h3>${e("editor.secondaryBadges")}</h3>
            <div class="editor-fields">
              <label>
                ${e("editor.secondaryEntity")}
                <input
                  .value=${((g = (d = r == null ? void 0 : r.area_overlay) == null ? void 0 : d.secondary) == null ? void 0 : g.entity_id) ?? ""}
                  @change=${(A) => t.updateAreaOverlay("secondary", "entity_id", A)}
                />
              </label>
              <label>
                ${e("editor.source")}
                <select
                  .value=${((x = (b = r == null ? void 0 : r.area_overlay) == null ? void 0 : b.secondary) == null ? void 0 : x.source) ?? "state"}
                  @change=${(A) => t.updateAreaOverlay("secondary", "source", A)}
                >
                  <option value="state">${e("editor.state")}</option>
                  <option value="attr">${e("editor.attributeOption")}</option>
                </select>
              </label>
              <label>
                ${e("editor.attribute")}
                <input
                  .value=${((v = (P = r == null ? void 0 : r.area_overlay) == null ? void 0 : P.secondary) == null ? void 0 : v.attr) ?? ""}
                  @change=${(A) => t.updateAreaOverlay("secondary", "attr", A)}
                />
              </label>
              <label>
                ${e("editor.format")}
                <input
                  .value=${((k = (E = r == null ? void 0 : r.area_overlay) == null ? void 0 : E.secondary) == null ? void 0 : k.format) ?? ""}
                  @change=${(A) => t.updateAreaOverlay("secondary", "format", A)}
                />
              </label>
              <label class="editor-field-wide">
                ${e("editor.badges")}
                <input
                  class="grow"
                  .value=${((T = (M = r == null ? void 0 : r.area_overlay) == null ? void 0 : M.badges) == null ? void 0 : T.map(
    (A) => `${A.entity_id}=${A.when.state_is}${A.label ? `:${A.label}` : ""}`
  ).join(", ")) ?? ""}
                  @change=${t.updateAreaBadges}
                  placeholder="binary_sensor.window=on:Window open"
                />
              </label>
            </div>
          </section>
        </div>
      </details>
    </aside>
  `;
}
function dc(a, t, e, i) {
  return Y`
    <section class="editor-card editor-selection">
      <h2>${i("editor.selectedArea")}</h2>
      <strong class="editor-selection-name">${a.id}</strong>
      <div class="editor-fields">
        <label>
          ${i("editor.haArea")}
          <select @change=${e.bindArea} .value=${a.area_id ?? ""}>
            <option value="">${i("editor.unbound")}</option>
            ${t.map(
    (r) => Y`<option value=${r.id}>${r.name}</option>`
  )}
          </select>
        </label>
        <label>
          ${i("editor.tags")}
          <input
            .value=${a.tags.join(", ")}
            @change=${e.updateAreaTags}
            placeholder="downstairs, heating"
          />
        </label>
        <label>
          ${i("editor.fill")}
          <input
            type="color"
            .value=${a.style.fill ?? "#2196f3"}
            @change=${(r) => e.updateAreaStyle("fill", r)}
          />
        </label>
        <label>
          ${i("editor.stroke")}
          <input
            type="color"
            .value=${a.style.stroke ?? "#1976d2"}
            @change=${(r) => e.updateAreaStyle("stroke", r)}
          />
        </label>
        <label>
          ${i("editor.opacity")}
          <input
            type="number"
            min="0"
            max="1"
            step="0.05"
            .value=${String(a.style.fillOpacity)}
            @change=${(r) => e.updateAreaStyle("fillOpacity", r)}
          />
        </label>
        <label>
          ${i("editor.strokeWidth")}
          <input
            type="number"
            min="0"
            max="20"
            step="1"
            .value=${String(a.style.strokeWidth)}
            @change=${(r) => e.updateAreaStyle("strokeWidth", r)}
          />
        </label>
        <button class="editor-danger editor-field-wide" type="button" @click=${e.deleteArea}>
          ${i("editor.deleteArea")}
        </button>
      </div>
    </section>
  `;
}
function cc(a, t, e, i) {
  return Y`
    <section class="editor-card editor-selection">
      <h2>${i("editor.selectedMarker")}</h2>
      <strong class="editor-selection-name">${a.entity_id}</strong>
      <div class="editor-fields">
        <label>
          ${i("editor.tags")}
          <input
            .value=${a.tags.join(", ")}
            @change=${e.updateMarkerTags}
            placeholder="heating, downstairs"
          />
        </label>
        <label>
          ${i("editor.haArea")}
          <select .value=${a.area_id ?? ""} @change=${e.updateMarkerArea}>
            <option value="">${i("editor.unbound")}</option>
            ${t.map((r) => Y`<option value=${r.id}>${r.name}</option>`)}
          </select>
        </label>
        <label>
          ${i("editor.label")}
          <select .value=${a.label_mode} @change=${e.updateMarkerLabelMode}>
            <option value="auto">${i("editor.auto")}</option>
            <option value="short">${i("editor.short")}</option>
            <option value="full">${i("editor.full")}</option>
            <option value="off">${i("editor.off")}</option>
          </select>
        </label>
        <label>
          ${i("editor.primary")}
          <select
            .value=${a.bind.primary.source}
            @change=${(r) => e.updateMarkerBinding("primary", "source", r)}
          >
            <option value="state">${i("editor.state")}</option>
            <option value="attr">${i("editor.attributeOption")}</option>
          </select>
        </label>
        <label>
          ${i("editor.attribute")}
          <input
            .value=${a.bind.primary.attr ?? ""}
            @change=${(r) => e.updateMarkerBinding("primary", "attr", r)}
          />
        </label>
        <label>
          ${i("editor.format")}
          <input
            .value=${a.bind.primary.format ?? ""}
            @change=${(r) => e.updateMarkerBinding("primary", "format", r)}
            placeholder="{value} °C"
          />
        </label>
        ${a.bind.secondary ? Y`
              <label>
                ${i("editor.secondary")}
                <select
                  .value=${a.bind.secondary.source}
                  @change=${(r) => e.updateMarkerBinding("secondary", "source", r)}
                >
                  <option value="state">${i("editor.state")}</option>
                  <option value="attr">${i("editor.attributeOption")}</option>
                </select>
              </label>
              <label>
                ${i("editor.attribute")}
                <input
                  .value=${a.bind.secondary.attr ?? ""}
                  @change=${(r) => e.updateMarkerBinding("secondary", "attr", r)}
                />
              </label>
              <label>
                ${i("editor.format")}
                <input
                  .value=${a.bind.secondary.format ?? ""}
                  @change=${(r) => e.updateMarkerBinding("secondary", "format", r)}
                />
              </label>
              <button type="button" @click=${e.removeMarkerSecondaryBinding}>
                ${i("editor.removeSecondary")}
              </button>
            ` : Y`
              <button type="button" @click=${e.addMarkerSecondaryBinding}>
                + ${i("editor.addSecondary")}
              </button>
            `}
        <button
          class="editor-danger editor-field-wide"
          type="button"
          @click=${e.deleteMarker}
        >
          ${i("editor.deleteMarker")}
        </button>
      </div>
    </section>
  `;
}
var uc = Object.defineProperty, jr = (a, t, e, i) => {
  for (var r = void 0, n = a.length - 1, s; n >= 0; n--)
    (s = a[n]) && (r = s(t, e, r) || r);
  return r && uc(t, e, r), r;
};
const Yr = class Yr extends pe {
  constructor() {
    super(...arguments), this.dialog = null, this.cancelLabel = "Cancel", this._value = "";
  }
  willUpdate(t) {
    var e;
    t.has("dialog") && (this._value = ((e = this.dialog) == null ? void 0 : e.value) ?? "");
  }
  updated(t) {
    var e, i;
    t.has("dialog") && ((e = this.dialog) == null ? void 0 : e.kind) === "text" && ((i = this.renderRoot.querySelector("input")) == null || i.focus());
  }
  _resolve(t) {
    this.dispatchEvent(
      new CustomEvent("floorplan-dialog-resolve", {
        detail: t,
        bubbles: !0,
        composed: !0
      })
    );
  }
  _confirm() {
    this.dialog && this._resolve(this.dialog.kind === "text" ? this._value : !0);
  }
  _onKeydown(t) {
    t.key === "Escape" ? (t.preventDefault(), this._resolve(null)) : t.key === "Enter" && (t.preventDefault(), this._confirm());
  }
  render() {
    const t = this.dialog;
    return t ? Y`
      <div
        class="backdrop"
        @click=${(e) => {
      e.target === e.currentTarget && this._resolve(null);
    }}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-label=${t.title}
          @keydown=${this._onKeydown}
        >
          <h2>${t.title}</h2>
          ${t.message ? Y`<p>${t.message}</p>` : dt}
          ${t.kind === "text" ? Y`
                <input
                  .value=${this._value}
                  @input=${(e) => {
      this._value = e.target.value;
    }}
                />
              ` : dt}
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
        </section>
      </div>
    ` : dt;
  }
};
Yr.styles = jn`
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: grid;
      place-items: center;
      padding: 20px;
      background: rgba(0, 0, 0, 0.5);
    }

    section {
      width: min(440px, 100%);
      padding: 20px;
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
let Se = Yr;
jr([
  we({ attribute: !1 })
], Se.prototype, "dialog");
jr([
  we()
], Se.prototype, "cancelLabel");
jr([
  ut()
], Se.prototype, "_value");
customElements.get("floorplan-dialog") || customElements.define("floorplan-dialog", Se);
var fc = Object.defineProperty, lt = (a, t, e, i) => {
  for (var r = void 0, n = a.length - 1, s; n >= 0; n--)
    (s = a[n]) && (r = s(t, e, r) || r);
  return r && fc(t, e, r), r;
};
const gc = 500, Hn = 6, pc = 250, Kr = class Kr extends pe {
  constructor() {
    super(...arguments), this.narrow = !1, this._config = null, this._loading = !0, this._editMode = !1, this._currentView = "all", this._currentPlanId = null, this._selectedAreaId = null, this._selectedMarkerId = null, this._haAreas = [], this._haEntities = [], this._entityToAdd = "", this._entitySearch = "", this._entityDomainFilter = "", this._entityAreaFilter = "", this._notice = "", this._error = "", this._saveState = "idle", this._saveDirty = !1, this._saveConflict = !1, this._dialog = null, this._stage = null, this._backgroundLayer = null, this._areasLayer = null, this._markersLayer = null, this._stageController = null, this._areaShapes = /* @__PURE__ */ new Map(), this._markerGroups = /* @__PURE__ */ new Map(), this._renderGeneration = 0, this._liveRefreshTimer = null, this._entityPointerDrag = null, this._history = new $d(), this._dialogResolver = null, this._saveQueue = new Rd(
      (t, e) => wd(this.hass, t, e),
      {
        onStatus: (t) => this._onSaveStatus(t),
        onSaved: (t) => {
          this._config && (this._config = { ...this._config, revision: t }), this._setNotice(this._t("panel.changesSaved"));
        }
      }
    ), this._beforeUnload = (t) => {
      this._saveDirty && (t.preventDefault(), t.returnValue = "");
    }, this._entityPointerMove = (t) => this._onEntityPointerMove(t), this._entityPointerUp = (t) => this._onEntityPointerUp(t), this._entityPointerCancel = (t) => this._onEntityPointerCancel(t);
  }
  get _canEdit() {
    var t, e;
    return ((e = (t = this.hass) == null ? void 0 : t.user) == null ? void 0 : e.is_admin) === !0;
  }
  get _t() {
    var t;
    return md((t = this.hass) == null ? void 0 : t.language);
  }
  async connectedCallback() {
    super.connectedCallback(), window.addEventListener("beforeunload", this._beforeUnload), window.addEventListener("pointermove", this._entityPointerMove, { passive: !1 }), window.addEventListener("pointerup", this._entityPointerUp), window.addEventListener("pointercancel", this._entityPointerCancel), await this._loadConfig(), this._canEdit && await this._loadRegistry();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("beforeunload", this._beforeUnload), window.removeEventListener("pointermove", this._entityPointerMove), window.removeEventListener("pointerup", this._entityPointerUp), window.removeEventListener("pointercancel", this._entityPointerCancel), this._finishEntityPointerDrag(), this._resolveDialog(null), this._liveRefreshTimer !== null && (window.clearTimeout(this._liveRefreshTimer), this._liveRefreshTimer = null), this._destroyStage();
  }
  async _loadConfig() {
    var t;
    this._loading = !0;
    try {
      this._config = await Sd(this.hass), this._saveQueue.reset(this._config.revision), this._history.reset(), this._currentPlanId = ((t = this._config.plans[0]) == null ? void 0 : t.plan_id) ?? null, this._config.default_view && this._config.views.some((e) => {
        var i;
        return e.id === ((i = this._config) == null ? void 0 : i.default_view);
      }) && (this._currentView = this._config.default_view);
    } catch {
      this._config = {
        version: yd,
        revision: 0,
        plans: [],
        views: []
      }, this._saveQueue.reset(0), this._history.reset(), this._setError(this._t("panel.loadError"));
    }
    this._loading = !1;
  }
  async saveConfig() {
    return !this._config || !this._canEdit ? !1 : this._saveQueue.enqueue(this._config);
  }
  _commitConfig(t, e = !0) {
    return this._canEdit ? (e && this._config && this._history.record(this._config), this._config = t, this._saveQueue.enqueue(t)) : Promise.resolve(!1);
  }
  _undo() {
    if (!this._config) return;
    const t = this._history.undo(this._config);
    t && (this._commitConfig(t, !1), this._selectedAreaId = null, this._selectedMarkerId = null, this._renderFloorplan(), this.requestUpdate());
  }
  _redo() {
    if (!this._config) return;
    const t = this._history.redo(this._config);
    t && (this._commitConfig(t, !1), this._selectedAreaId = null, this._selectedMarkerId = null, this._renderFloorplan(), this.requestUpdate());
  }
  _onSaveStatus(t) {
    if (this._saveState = t.state, this._saveDirty = t.dirty, (t.state === "pending" || t.state === "saving") && (this._notice = "", this._error = "", this._saveConflict = !1), t.state === "failed") {
      if (kd(t.error) === "config_conflict") {
        this._saveConflict = !0, this._setError(this._t("panel.conflict"));
        return;
      }
      this._saveConflict = !1, this._setError(this._t("panel.saveFailed"));
    }
  }
  updated(t) {
    t.has("_loading") && !this._loading && !this._stage && this._initializeStage(), t.has("_currentPlanId") && this._stage && (this._selectedAreaId = null, this._selectedMarkerId = null, this._renderFloorplan()), t.has("_currentView") && this._stage && (this._renderAreas(this._getCurrentPlan()), this._renderMarkers(this._getCurrentPlan())), t.has("hass") && (!this._canEdit && this._editMode && (this._editMode = !1, this._selectedAreaId = null, this._selectedMarkerId = null, this._syncCanvasInteractivity()), this._scheduleLiveRefresh());
  }
  _scheduleLiveRefresh() {
    this._liveRefreshTimer === null && (this._liveRefreshTimer = window.setTimeout(() => {
      this._liveRefreshTimer = null, this._refreshMarkerLiveValues(), this._editMode || this._renderAreas(this._getCurrentPlan());
    }, gc));
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
    }, this.updateComplete.then(() => {
      var r;
      (r = this.renderRoot.querySelector(".dialog input")) == null || r.focus();
    }), new Promise((r) => {
      this._dialogResolver = (n) => r(typeof n == "string" ? n : null);
    });
  }
  _askConfirm(t, e = this._t("dialog.confirm"), i = !1) {
    var r;
    return (r = this._dialogResolver) == null || r.call(this, null), this._dialog = {
      kind: "confirm",
      title: this._t("dialog.confirmTitle"),
      message: t,
      value: "",
      confirmLabel: e,
      destructive: i
    }, new Promise((n) => {
      this._dialogResolver = (s) => n(s === !0);
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
    await this._askConfirm(this._t("dialog.reloadMessage"), this._t("dialog.reload"), !0) && (await this._loadConfig(), this._renderFloorplan());
  }
  _initializeStage() {
    const t = this.renderRoot.querySelector(".canvas-wrapper");
    if (!t) {
      this._setError(this._t("panel.canvasInitError"));
      return;
    }
    this._stageController = Fd(t, {
      isEditing: () => this._editMode,
      getZoomLimits: () => {
        const e = this._getCurrentPlan();
        return {
          minZoom: (e == null ? void 0 : e.view.minZoom) ?? 0.1,
          maxZoom: (e == null ? void 0 : e.view.maxZoom) ?? 5
        };
      },
      onEmptyCanvasClick: () => {
        this._selectedAreaId = null, this._selectedMarkerId = null, this._renderAreas(this._getCurrentPlan()), this._syncCanvasInteractivity();
      }
    }), this._stage = this._stageController.stage, this._backgroundLayer = this._stageController.backgroundLayer, this._areasLayer = this._stageController.areasLayer, this._markersLayer = this._stageController.markersLayer, this._renderFloorplan();
  }
  _destroyStage() {
    var t;
    this._renderGeneration += 1, (t = this._stageController) == null || t.destroy(), this._stageController = null, this._stage = null, this._backgroundLayer = null, this._areasLayer = null, this._markersLayer = null, this._areaShapes.clear(), this._markerGroups.clear();
  }
  _getCurrentPlan() {
    if (!this._config || !this._currentPlanId) return null;
    const t = this._config.plans.find((e) => e.plan_id === this._currentPlanId) || null;
    return !t && this._config.plans.length > 0 ? (this._currentPlanId = this._config.plans[0].plan_id, this._config.plans[0]) : t;
  }
  _renderFloorplan() {
    var n, s, o, l, h;
    if (!this._stage || !this._backgroundLayer) return;
    const t = ++this._renderGeneration;
    this._backgroundLayer.destroyChildren(), (n = this._areasLayer) == null || n.destroyChildren(), (s = this._markersLayer) == null || s.destroyChildren(), this._areaShapes.clear(), this._markerGroups.clear();
    const e = this._getCurrentPlan(), i = this._stage.width(), r = this._stage.height();
    if (!e)
      this._drawEmptyState(i, r);
    else if ((o = e.background) != null && o.url) {
      this._renderAreas(e), this._renderMarkers(e);
      const u = new Image();
      u.onload = () => {
        if (t !== this._renderGeneration || e.plan_id !== this._currentPlanId)
          return;
        const f = new Z.Image({
          x: 0,
          y: 0,
          image: u,
          width: e.background.width || u.width,
          height: e.background.height || u.height
        });
        this._backgroundLayer.add(f);
        try {
          this._backgroundLayer.batchDraw(), this._fitToScreen(f.width(), f.height());
        } catch {
          this._backgroundLayer.destroyChildren(), this._drawImageErrorState(i, r), this._setError(this._t("panel.imageRenderError"));
        }
      }, u.onerror = () => {
        t === this._renderGeneration && (this._backgroundLayer.destroyChildren(), this._drawImageErrorState(i, r), this._setError(this._t("panel.imageLoadError")));
      }, u.src = e.background.url;
    } else e && (this._renderAreas(e), this._renderMarkers(e));
    this._backgroundLayer.batchDraw(), (l = this._areasLayer) == null || l.batchDraw(), (h = this._markersLayer) == null || h.batchDraw();
  }
  _fitToScreen(t, e) {
    this._stage && Od(this._stage, t, e);
  }
  _toggleEditMode() {
    this._canEdit && (this._editMode = !this._editMode, this._editMode || (this._finishEntityPointerDrag(), this._selectedAreaId = null, this._selectedMarkerId = null), this._renderAreas(this._getCurrentPlan()), this._syncCanvasInteractivity());
  }
  _selectPlan(t) {
    if (!this._config) return;
    const i = t.target.value || null;
    this._currentPlanId = i;
  }
  async _renameCurrentPlan() {
    if (!this._canEdit || !this._config || !this._currentPlanId) return;
    const t = this._currentPlanId, e = this._config.plans.find((n) => n.plan_id === t);
    if (!e) return;
    const i = await this._askText(this._t("dialog.renamePlan"), e.name);
    if (!i) return;
    const r = i.trim();
    !r || r === e.name || this._commitConfig(zd(this._config, t, r));
  }
  async _deleteCurrentPlan() {
    if (!this._canEdit || !this._config || !this._currentPlanId) return;
    const t = this._currentPlanId;
    if (!await this._askConfirm(
      this._t("dialog.deletePlanMessage"),
      this._t("editor.deletePlan"),
      !0
    ))
      return;
    const e = Wd(this._config, t);
    e && (this._commitConfig(e.config), this._currentPlanId = e.nextPlanId, this._renderFloorplan());
  }
  _renderAreas(t) {
    this._areasLayer && (qd({
      layer: this._areasLayer,
      plan: t,
      view: this._getCurrentView(),
      states: this.hass.states,
      areas: this._haAreas,
      editMode: this._editMode,
      selectedAreaId: this._selectedAreaId,
      shapes: this._areaShapes,
      onSelect: (e) => this._onAreaSelected(e),
      onUpdateShape: (e, i) => this._updateAreaShape(e, i),
      onRerender: () => this._renderAreas(this._getCurrentPlan())
    }), this._syncCanvasInteractivity());
  }
  _syncCanvasInteractivity() {
    ic({
      areasLayer: this._areasLayer,
      markersLayer: this._markersLayer,
      plan: this._getCurrentPlan(),
      editMode: this._editMode,
      selectedAreaId: this._selectedAreaId,
      selectedMarkerId: this._selectedMarkerId,
      areaShapes: this._areaShapes,
      markerGroups: this._markerGroups
    });
  }
  _drawEmptyState(t, e) {
    this._backgroundLayer && sc(this._backgroundLayer, t, e);
  }
  _drawImageErrorState(t, e) {
    this._backgroundLayer && oc(this._backgroundLayer, t, e);
  }
  _onAreaSelected(t) {
    this._selectedAreaId = t, this._selectedMarkerId = null, this._renderAreas(this._getCurrentPlan()), this._syncCanvasInteractivity();
  }
  _addAreaRect() {
    this._addAreaShape("rect");
  }
  _addAreaPolygon() {
    this._addAreaShape("polygon");
  }
  _addAreaShape(t) {
    if (!this._canEdit || !this._config) return;
    const e = this._getCurrentPlan();
    if (!e) return;
    const i = this._newId("area"), r = jd(i, t, this._getVisibleCanvasCenter());
    this._commitConfig(Yd(this._config, e.plan_id, r)), this._selectedAreaId = i, this._selectedMarkerId = null, this._renderFloorplan();
  }
  _updateAreaShape(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._getCurrentPlan();
    i && this._commitConfig(Kd(this._config, i.plan_id, t, e));
  }
  async _loadRegistry() {
    if (this._canEdit)
      try {
        const t = await xd(this.hass);
        this._haAreas = t.areas, this._haEntities = t.entities.sort(
          (e, i) => e.entity_id.localeCompare(i.entity_id)
        );
      } catch {
        this._haAreas = [], this._haEntities = [], this._setError(this._t("panel.registryLoadError"));
      }
  }
  _getSelectedArea() {
    if (!this._config || !this._selectedAreaId) return null;
    const t = this._getCurrentPlan();
    return t ? (t.areas ?? []).find((e) => e.id === this._selectedAreaId) ?? null : null;
  }
  _onBindAreaChange(t) {
    if (!this._canEdit || !this._config || !this._selectedAreaId) return;
    const e = t.target, i = this._getCurrentPlan();
    i && (this._commitConfig(
      xr(this._config, i.plan_id, this._selectedAreaId, (r) => ({
        ...r,
        area_id: e.value
      }))
    ), this._renderAreas(this._getCurrentPlan()));
  }
  _onAreaTagsChange(t) {
    const e = this._getSelectedArea(), i = this._getCurrentPlan();
    if (!e || !i || !this._config) return;
    const r = t.target.value.split(",").map((n) => n.trim()).filter(Boolean);
    this._commitConfig(
      xr(this._config, i.plan_id, e.id, (n) => ({
        ...n,
        tags: [...new Set(r)]
      }))
    ), this._renderAreas(this._getCurrentPlan());
  }
  async _deleteSelectedArea() {
    if (!this._canEdit || !this._config || !this._selectedAreaId) return;
    const t = this._getCurrentPlan();
    t && await this._askConfirm(
      this._t("dialog.deleteAreaMessage"),
      this._t("editor.deleteArea"),
      !0
    ) && (this._commitConfig(Xd(this._config, t.plan_id, this._selectedAreaId)), this._selectedAreaId = null, this._renderFloorplan());
  }
  _renderMarkers(t) {
    this._markersLayer && rc({
      layer: this._markersLayer,
      stage: this._stage,
      plan: t,
      view: this._getCurrentView(),
      states: this.hass.states,
      entities: this._haEntities,
      editMode: this._editMode,
      selectedMarkerId: this._selectedMarkerId,
      groups: this._markerGroups,
      onSelect: (e) => {
        this._selectedMarkerId = e, this._selectedAreaId = null, this._syncCanvasInteractivity();
      },
      onOpenMoreInfo: (e) => this._openMoreInfo(e),
      onMove: (e, i) => this._updateMarker(e, { pos: i })
    });
  }
  _refreshMarkerLiveValues() {
    const t = this._getCurrentPlan();
    !t || !this._markersLayer || ac({
      layer: this._markersLayer,
      plan: t,
      states: this.hass.states,
      entities: this._haEntities,
      groups: this._markerGroups
    });
  }
  _getSelectedMarker() {
    var t;
    return this._selectedMarkerId ? ((t = this._getCurrentPlan()) == null ? void 0 : t.markers.find((e) => e.id === this._selectedMarkerId)) ?? null : null;
  }
  _addMarker() {
    !this._canEdit || !this._config || !this._entityToAdd.trim() || this._addMarkerAt(this._entityToAdd.trim(), this._getVisibleCanvasCenter());
  }
  _addMarkerAt(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._getCurrentPlan();
    if (!i) return;
    const r = this._haEntities.find((s) => s.entity_id === t);
    if (!r && !this.hass.states[t]) {
      this._setError(this._t("panel.selectExistingEntity"));
      return;
    }
    const n = {
      id: this._newId("marker"),
      entity_id: t,
      area_id: (r == null ? void 0 : r.area_id) ?? null,
      pos: e,
      icon: (r == null ? void 0 : r.icon) ?? "mdi:circle",
      label_mode: "auto",
      tags: pd(t),
      bind: { primary: { source: "state" } }
    };
    this._commitConfig(Id(this._config, i.plan_id, n)), this._selectedMarkerId = n.id, this._selectedAreaId = null, this._entityToAdd = "", this._renderMarkers(this._getCurrentPlan());
  }
  _onCanvasDragOver(t) {
    !this._editMode || !this._getCurrentPlan() || (t.preventDefault(), t.dataTransfer && (t.dataTransfer.dropEffect = "copy"), t.currentTarget.classList.add("drag-target"));
  }
  _onCanvasDragLeave(t) {
    t.currentTarget.classList.remove("drag-target");
  }
  _onCanvasDrop(t) {
    var r, n;
    t.preventDefault();
    const e = t.currentTarget;
    if (e.classList.remove("drag-target"), !this._editMode || !this._stage) return;
    const i = ((r = t.dataTransfer) == null ? void 0 : r.getData("application/x-floorplan-entity")) || ((n = t.dataTransfer) == null ? void 0 : n.getData("text/plain"));
    i && this._addMarkerAtClientPoint(i, t.clientX, t.clientY, e);
  }
  _onEntityDragStart(t, e) {
    e.dataTransfer && (this._finishEntityPointerDrag(), e.dataTransfer.setData("application/x-floorplan-entity", t), e.dataTransfer.setData("text/plain", t), e.dataTransfer.effectAllowed = "copy");
  }
  _onEntityPointerDown(t, e) {
    if (!this._editMode || !this._getCurrentPlan() || !e.isPrimary || e.button !== 0)
      return;
    this._finishEntityPointerDrag();
    const i = e.currentTarget, r = i.closest(".entity-palette");
    if (this._entityPointerDrag = {
      entityId: t,
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      target: i,
      palette: r,
      startX: e.clientX,
      startY: e.clientY,
      startScrollTop: (r == null ? void 0 : r.scrollTop) ?? 0,
      ready: e.pointerType !== "touch",
      scrolling: !1,
      holdTimer: null,
      active: !1
    }, e.pointerType === "touch") {
      const n = e.pointerId;
      this._entityPointerDrag.holdTimer = window.setTimeout(() => {
        const s = this._entityPointerDrag;
        (s == null ? void 0 : s.pointerId) === n && !s.scrolling && (s.ready = !0);
      }, pc);
    }
    try {
      i.setPointerCapture(e.pointerId);
    } catch {
    }
  }
  _onEntityPointerMove(t) {
    const e = this._entityPointerDrag;
    if (!e || e.pointerId !== t.pointerId) return;
    const i = t.clientX - e.startX, r = t.clientY - e.startY, n = Math.hypot(i, r);
    if (e.pointerType === "touch" && !e.ready) {
      t.preventDefault(), n >= Hn && (e.scrolling = !0, e.holdTimer !== null && (window.clearTimeout(e.holdTimer), e.holdTimer = null), e.palette && (e.palette.scrollTop = e.startScrollTop - r));
      return;
    }
    if (!e.active && n >= Hn && (e.active = !0), !e.active) return;
    t.preventDefault();
    const s = this._canvasContainer();
    s == null || s.classList.toggle(
      "drag-target",
      this._clientPointIsInside(s, t.clientX, t.clientY)
    );
  }
  _onEntityPointerUp(t) {
    const e = this._entityPointerDrag;
    if (!e || e.pointerId !== t.pointerId) return;
    const i = this._canvasContainer(), r = e.active && this._clientPointIsInside(i, t.clientX, t.clientY);
    this._finishEntityPointerDrag(), r && i && this._addMarkerAtClientPoint(e.entityId, t.clientX, t.clientY, i);
  }
  _onEntityPointerCancel(t) {
    var e;
    ((e = this._entityPointerDrag) == null ? void 0 : e.pointerId) === t.pointerId && this._finishEntityPointerDrag();
  }
  _canvasContainer() {
    return this.renderRoot.querySelector(".canvas-container");
  }
  _clientPointIsInside(t, e, i) {
    if (!t) return !1;
    const r = t.getBoundingClientRect();
    return e >= r.left && e <= r.right && i >= r.top && i <= r.bottom;
  }
  _finishEntityPointerDrag() {
    var e;
    (e = this._canvasContainer()) == null || e.classList.remove("drag-target");
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
  _addMarkerAtClientPoint(t, e, i, r) {
    if (!this._stage) return;
    const n = r.getBoundingClientRect(), s = this._stage.getAbsoluteTransform().copy().invert();
    this._addMarkerAt(
      t,
      s.point({ x: e - n.left, y: i - n.top })
    );
  }
  _updateMarker(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._getCurrentPlan();
    i && this._commitConfig(Ud(this._config, i.plan_id, t, e));
  }
  _onMarkerTagsChange(t) {
    const e = this._getSelectedMarker();
    if (!e) return;
    const i = t.target.value.split(",").map((r) => r.trim()).filter(Boolean);
    this._updateMarker(e.id, { tags: [...new Set(i)] }), this._renderMarkers(this._getCurrentPlan());
  }
  _onMarkerAreaChange(t) {
    const e = this._getSelectedMarker();
    e && (this._updateMarker(e.id, {
      area_id: t.target.value || null
    }), this._renderMarkers(this._getCurrentPlan()));
  }
  _onMarkerLabelModeChange(t) {
    const e = this._getSelectedMarker();
    if (!e) return;
    const i = t.target.value;
    this._updateMarker(e.id, { label_mode: i }), this._renderMarkers(this._getCurrentPlan());
  }
  _updateMarkerBinding(t, e, i) {
    const r = this._getSelectedMarker();
    if (!r) return;
    const n = i.target.value, s = r.bind[t] ?? { source: "state" }, o = {
      ...s,
      [e]: e === "source" ? n : n || void 0,
      ...e === "source" && n === "attr" && !s.attr ? { attr: "friendly_name" } : {},
      ...e === "attr" && s.source === "attr" && !n ? { attr: "friendly_name" } : {}
    };
    this._updateMarker(r.id, {
      bind: { ...r.bind, [t]: o }
    }), this._renderMarkers(this._getCurrentPlan());
  }
  _addMarkerSecondaryBinding() {
    const t = this._getSelectedMarker();
    !t || t.bind.secondary || (this._updateMarker(t.id, {
      bind: { ...t.bind, secondary: { source: "state" } }
    }), this._renderMarkers(this._getCurrentPlan()));
  }
  _removeMarkerSecondaryBinding() {
    const t = this._getSelectedMarker();
    if (!t) return;
    const e = { ...t.bind };
    delete e.secondary, this._updateMarker(t.id, { bind: e }), this._renderMarkers(this._getCurrentPlan());
  }
  async _deleteSelectedMarker() {
    if (!this._canEdit || !this._config || !this._selectedMarkerId) return;
    const t = this._getCurrentPlan();
    !t || !await this._askConfirm(
      this._t("dialog.deleteMarkerMessage"),
      this._t("editor.deleteMarker"),
      !0
    ) || (this._commitConfig(Bd(this._config, t.plan_id, this._selectedMarkerId)), this._selectedMarkerId = null, this._renderMarkers(this._getCurrentPlan()));
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
    !this._canEdit || !this._editMode || (this._selectedAreaId = t === "area" ? e : null, this._selectedMarkerId = t === "marker" ? e : null, this._renderAreas(this._getCurrentPlan()), this._syncCanvasInteractivity(), this.requestUpdate());
  }
  _onCanvasKeydown(t) {
    if (!(!this._canEdit || !this._editMode)) {
      if ((t.ctrlKey || t.metaKey) && t.key.toLowerCase() === "z") {
        t.preventDefault(), t.shiftKey ? this._redo() : this._undo();
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
    this._currentView = t;
  }
  async _addView() {
    var i;
    if (!this._canEdit || !this._config) return;
    const t = (i = await this._askText(this._t("dialog.newView"))) == null ? void 0 : i.trim();
    if (!t) return;
    const e = Nd(t, this._config.views);
    this._commitConfig({
      ...this._config,
      views: [...this._config.views, e]
    }), this._currentView = e.id;
  }
  async _renameCurrentView() {
    var i;
    if (!this._canEdit || !this._config) return;
    const t = this._getCurrentView();
    if (!t) return;
    const e = (i = await this._askText(this._t("dialog.renameView"), t.name)) == null ? void 0 : i.trim();
    !e || e === t.name || this._commitConfig(
      Je(this._config, t.id, (r) => ({ ...r, name: e }))
    );
  }
  _moveCurrentView(t) {
    if (!this._canEdit || !this._config) return;
    const e = Ld(this._config, this._currentView, t);
    e && this._commitConfig(e);
  }
  _setDefaultView() {
    var t;
    !this._canEdit || !this._config || (this._commitConfig({ ...this._config, default_view: this._currentView }), this._setNotice(
      this._t("panel.defaultView", { name: ((t = this._getCurrentView()) == null ? void 0 : t.name) ?? this._currentView })
    ));
  }
  async _deleteCurrentView() {
    if (!this._canEdit || !this._config || this._currentView === "all" || this._config.views.length <= 1 || !await this._askConfirm(
      this._t("dialog.deleteViewMessage"),
      this._t("editor.deleteView"),
      !0
    ))
      return;
    const t = Gd(this._config, this._currentView);
    t && (this._commitConfig(t.config), this._currentView = t.nextViewId);
  }
  _updateViewFilter(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = e.target.value.split(",").map((r) => r.trim()).filter(Boolean);
    this._commitConfig(
      Je(this._config, this._currentView, (r) => {
        const n = { ...r.filters };
        return n[t] = i.length ? [...new Set(i)] : void 0, { ...r, filters: n };
      })
    ), this._renderMarkers(this._getCurrentPlan()), this._renderAreas(this._getCurrentPlan());
  }
  _updateAreaOverlayValue(t, e, i) {
    if (!this._canEdit || !this._config) return;
    const r = i.target.value.trim();
    this._commitConfig(
      Je(this._config, this._currentView, (n) => {
        const s = { ...n.area_overlay };
        if (e === "entity_id" && !r)
          delete s[t];
        else {
          const o = s[t] ?? {
            mode: "entity",
            entity_id: r,
            source: "state"
          };
          if (e !== "entity_id" && !o.entity_id) return n;
          s[t] = {
            ...o,
            [e]: e === "source" ? r : r || void 0,
            ...e === "source" && r === "attr" && !o.attr ? { attr: "friendly_name" } : {},
            ...e === "attr" && o.source === "attr" && !r ? { attr: "friendly_name" } : {}
          };
        }
        return { ...n, area_overlay: s };
      })
    ), this._renderAreas(this._getCurrentPlan());
  }
  _updateAreaBadges(t) {
    if (!this._canEdit || !this._config) return;
    const i = t.target.value.split(",").map((r) => r.trim()).filter(Boolean).flatMap((r) => {
      const [n, s] = r.split(":", 2), [o, l] = n.split("=", 2).map((u) => u.trim());
      if (!o || !l) return [];
      const h = s == null ? void 0 : s.trim();
      return [
        {
          entity_id: o,
          when: { state_is: l },
          ...h ? { label: h } : {}
        }
      ];
    });
    this._commitConfig(
      Je(this._config, this._currentView, (r) => ({
        ...r,
        area_overlay: {
          ...r.area_overlay,
          badges: i.length ? i : void 0
        }
      }))
    ), this._renderAreas(this._getCurrentPlan());
  }
  _updateAreaStyle(t, e) {
    const i = this._getSelectedArea();
    if (!i) return;
    const r = e.target;
    let n = t === "fill" || t === "stroke" ? r.value : Number(r.value);
    if (typeof n == "number" && !Number.isFinite(n)) return;
    t === "fillOpacity" && typeof n == "number" && (n = Math.max(0, Math.min(1, n))), t === "strokeWidth" && typeof n == "number" && (n = Math.max(0, Math.min(50, n)));
    const s = this._getCurrentPlan();
    !this._config || !s || (this._commitConfig({
      ...this._config,
      plans: this._config.plans.map(
        (o) => o.plan_id === s.plan_id ? {
          ...o,
          areas: o.areas.map(
            (l) => l.id === i.id ? { ...l, style: { ...l.style, [t]: n } } : l
          )
        } : o
      )
    }), this._renderAreas(this._getCurrentPlan()));
  }
  async _exportConfig() {
    if (this._config)
      try {
        const t = await Md(this._config), e = new Blob([JSON.stringify(t, null, 2)], {
          type: "application/json"
        }), i = URL.createObjectURL(e), r = document.createElement("a");
        r.href = i, r.download = `floorplan-ui-config-v${this._config.version}.json`, r.click(), URL.revokeObjectURL(i), this._setNotice(this._t("panel.exported"));
      } catch (t) {
        const e = t instanceof Error ? t.message : this._t("panel.exportFailed");
        this._setError(e);
      }
  }
  _triggerConfigImport() {
    var t;
    this._canEdit && ((t = this.renderRoot.querySelector(".config-file-input")) == null || t.click());
  }
  async _handleConfigImport(t) {
    var r, n, s;
    if (!this._canEdit) return;
    const e = t.target, i = (r = e.files) == null ? void 0 : r[0];
    if (e.value = "", !!i) {
      if (i.size > bd) {
        this._setError(this._t("panel.configTooLarge"));
        return;
      }
      try {
        const o = JSON.parse(await i.text());
        if (!o || typeof o != "object" || Array.isArray(o))
          throw new Error("The JSON root must be an object.");
        const l = o, h = Array.isArray(l.plans) ? l.plans.length : 0, u = Array.isArray(l.views) ? l.views.length : 0;
        if (!await this._askConfirm(
          this._t("dialog.importMessage", { plans: h, views: u }),
          this._t("dialog.import")
        ))
          return;
        const f = await Td(this.hass, o), p = await Cd(this.hass, f);
        if (this._currentPlanId = ((n = p.plans[0]) == null ? void 0 : n.plan_id) ?? null, this._currentView = p.views.some((c) => c.id === p.default_view) ? p.default_view ?? "all" : ((s = p.views[0]) == null ? void 0 : s.id) ?? "all", this._selectedAreaId = null, this._selectedMarkerId = null, !await this._commitConfig(p)) return;
        this._renderFloorplan(), this._setNotice(this._t("panel.imported"));
      } catch (o) {
        const l = o instanceof Error ? o.message : this._t("panel.invalidConfig");
        this._setError(this._t("panel.importFailed", { message: l }));
      }
    }
  }
  async _handleFileUpload(t) {
    var n;
    if (!this._canEdit) return;
    const e = t.target, i = (n = e.files) == null ? void 0 : n[0];
    if (e.value = "", !i) return;
    if (!["image/png", "image/jpeg"].includes(i.type)) {
      this._setError(this._t("panel.imageTypeError"));
      return;
    }
    if (i.size > Na) {
      this._setError(this._t("panel.imageTooLarge"));
      return;
    }
    let r = null;
    try {
      r = await createImageBitmap(i);
      const s = await Ga(this.hass, i);
      this._createNewPlan(i.name, {
        type: "image",
        asset_id: s.asset_id,
        content_type: s.content_type,
        url: s.url,
        width: r.width,
        height: r.height
      });
    } catch (s) {
      const o = s instanceof Error ? s.message : this._t("panel.imageUploadFailed");
      this._setError(o);
    } finally {
      r == null || r.close();
    }
  }
  _createNewPlan(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._newId("plan");
    this._commitConfig(Hd(this._config, Vd(i, t, e))), this._currentPlanId = i, this._renderFloorplan();
  }
  _triggerFileUpload() {
    var t;
    (t = this.renderRoot.querySelector(".file-input")) == null || t.click();
  }
  _getVisibleCanvasCenter() {
    return this._stage ? Dd(this._stage) : { x: 0, y: 0 };
  }
  _newId(t) {
    return `${t}_${globalThis.crypto.randomUUID()}`;
  }
  _renderEditor(t, e, i, r) {
    const n = this._entitySearch.trim().toLowerCase(), s = [...new Set(this._haEntities.map((l) => l.domain))].sort(), o = this._haEntities.filter((l) => {
      var p;
      const h = !n || l.entity_id.toLowerCase().includes(n) || !!((p = l.name) != null && p.toLowerCase().includes(n)), u = !this._entityDomainFilter || l.domain === this._entityDomainFilter, f = !this._entityAreaFilter || l.area_id === this._entityAreaFilter;
      return h && u && f;
    }).slice(0, 250);
    return hc(
      {
        currentPlan: t,
        currentView: e,
        currentViewId: this._currentView,
        selectedArea: i,
        selectedMarker: r,
        areas: this._haAreas,
        entityCount: this._haEntities.length,
        entityOptions: o,
        entityDomains: s,
        entitySearch: this._entitySearch,
        entityDomainFilter: this._entityDomainFilter,
        entityAreaFilter: this._entityAreaFilter,
        entityToAdd: this._entityToAdd,
        canUndo: this._history.canUndo,
        canRedo: this._history.canRedo
      },
      {
        uploadImage: () => this._triggerFileUpload(),
        undo: () => this._undo(),
        redo: () => this._redo(),
        renamePlan: () => this._renameCurrentPlan(),
        deletePlan: () => this._deleteCurrentPlan(),
        addAreaRect: () => this._addAreaRect(),
        addAreaPolygon: () => this._addAreaPolygon(),
        addView: () => this._addView(),
        renameView: () => this._renameCurrentView(),
        moveView: (l) => this._moveCurrentView(l),
        setDefaultView: () => this._setDefaultView(),
        deleteView: () => this._deleteCurrentView(),
        exportConfig: () => this._exportConfig(),
        importConfig: () => this._triggerConfigImport(),
        setEntitySearch: (l) => {
          this._entitySearch = l;
        },
        setEntityDomainFilter: (l) => {
          this._entityDomainFilter = l;
        },
        setEntityAreaFilter: (l) => {
          this._entityAreaFilter = l;
        },
        setEntityToAdd: (l) => {
          this._entityToAdd = l;
        },
        addMarker: () => this._addMarker(),
        startEntityDrag: (l, h) => this._onEntityDragStart(l, h),
        startEntityPointerDrag: (l, h) => this._onEntityPointerDown(l, h),
        updateViewFilter: (l, h) => this._updateViewFilter(l, h),
        updateAreaOverlay: (l, h, u) => this._updateAreaOverlayValue(l, h, u),
        updateAreaBadges: (l) => this._updateAreaBadges(l),
        bindArea: (l) => this._onBindAreaChange(l),
        updateAreaTags: (l) => this._onAreaTagsChange(l),
        updateAreaStyle: (l, h) => this._updateAreaStyle(l, h),
        deleteArea: () => this._deleteSelectedArea(),
        updateMarkerTags: (l) => this._onMarkerTagsChange(l),
        updateMarkerArea: (l) => this._onMarkerAreaChange(l),
        updateMarkerLabelMode: (l) => this._onMarkerLabelModeChange(l),
        updateMarkerBinding: (l, h, u) => this._updateMarkerBinding(l, h, u),
        addMarkerSecondaryBinding: () => this._addMarkerSecondaryBinding(),
        removeMarkerSecondaryBinding: () => this._removeMarkerSecondaryBinding(),
        deleteMarker: () => this._deleteSelectedMarker()
      },
      this._t
    );
  }
  render() {
    var h, u;
    const t = [
      { id: "all", name: "All", filters: {} },
      { id: "heating", name: "Heating", filters: { tags: ["heating"] } },
      { id: "lights", name: "Lights", filters: { domains: ["light", "switch"] } },
      { id: "network", name: "Network", filters: { tags: ["network"] } },
      { id: "entertainment", name: "Entertainment", filters: { domains: ["media_player"] } }
    ], e = (h = this._config) != null && h.views.length ? this._config.views : t, i = ((u = this._config) == null ? void 0 : u.plans) ?? [], r = this._getCurrentPlan(), n = this._getCurrentView(), s = this._getSelectedArea(), o = this._getSelectedMarker(), l = this._t;
    return Y`
      <div class="container ${this.narrow ? "narrow" : ""}">
        <div class="toolbar">
          <div class="toolbar-left">
            <h1>${l("panel.title")}</h1>
            <label class="plan-select">
              <span>${l("panel.plan")}</span>
              <select @change=${this._selectPlan}>
                <option value="" ?selected=${!r}>${l("panel.selectPlan")}</option>
                ${i.map(
      (f) => Y`
                    <option
                      value=${f.plan_id}
                      ?selected=${(r == null ? void 0 : r.plan_id) === f.plan_id}
                    >
                      ${f.name}
                    </option>
                  `
    )}
              </select>
            </label>
            <div class="view-tabs" role="tablist">
              ${e.map(
      (f) => {
        var p;
        return Y`
                  <button
                    class="view-tab ${this._currentView === f.id ? "active" : ""}"
                    role="tab"
                    aria-selected=${this._currentView === f.id ? "true" : "false"}
                    @click=${() => this._setView(f.id)}
                  >
                    ${f.id === ((p = this._config) == null ? void 0 : p.default_view) ? "★ " : ""}${f.name}
                  </button>
                `;
      }
    )}
            </div>
          </div>
          <div class="toolbar-right">
            ${this._canEdit ? Y`
                  <button
                    class="edit-toggle ${this._editMode ? "active" : ""}"
                    aria-pressed=${this._editMode ? "true" : "false"}
                    @click=${this._toggleEditMode}
                  >
                    ${this._editMode ? l("panel.done") : l("panel.edit")}
                  </button>
                ` : Y`<span class="viewer-note">${l("panel.viewOnly")}</span>`}
          </div>
        </div>

        ${this._saveState === "pending" ? Y`<div class="status" role="status" aria-live="polite">${l("panel.pending")}</div>` : ""}
        ${this._saveState === "saving" ? Y`<div class="status" role="status" aria-live="polite">${l("panel.saving")}</div>` : ""}
        ${this._notice ? Y`<div class="status" role="status" aria-live="polite">${this._notice}</div>` : ""}
        ${this._error ? Y`
              <div class="status error" role="alert">
                ${this._error}
                ${this._saveState === "failed" ? this._saveConflict ? Y`
                        <button type="button" @click=${this._reloadAfterConflict}>
                          ${l("panel.reload")}
                        </button>
                      ` : Y`<button type="button" @click=${this._retrySave}>
                        ${l("panel.retry")}
                      </button>` : ""}
              </div>
            ` : ""}
        <div class="workspace ${this._editMode ? "editing" : ""}">
          ${this._editMode ? this._renderEditor(r, n, s, o) : ""}

          <input
            type="file"
            class="file-input"
            aria-label=${l("panel.upload")}
            accept="image/png,image/jpeg"
            @change=${this._handleFileUpload}
          />
          <input
            type="file"
            class="config-file-input"
            aria-label=${l("editor.import")}
            accept="application/json,.json"
            @change=${this._handleConfigImport}
          />

          <div
            class="canvas-container"
            role="application"
            tabindex="0"
            aria-label=${l("panel.canvas")}
            @keydown=${this._onCanvasKeydown}
            @dragover=${this._onCanvasDragOver}
            @dragleave=${this._onCanvasDragLeave}
            @drop=${this._onCanvasDrop}
          >
            ${this._loading ? Y`<div class="loading" role="status">${l("panel.loading")}</div>` : Y`<div class="canvas-wrapper"></div>`}
            <section class="canvas-accessibility" aria-label=${l("panel.objects")}>
              <ul>
                ${r == null ? void 0 : r.areas.map(
      (f) => Y`
                    <li>
                      ${this._editMode ? Y`<button
                            type="button"
                            aria-pressed=${this._selectedAreaId === f.id ? "true" : "false"}
                            @click=${() => this._selectCanvasObject("area", f.id)}
                          >
                            ${l("panel.areaObject", { id: f.id })}
                          </button>` : l("panel.areaObject", { id: f.id })}
                    </li>
                  `
    )}
                ${r == null ? void 0 : r.markers.map(
      (f) => Y`
                    <li>
                      <button
                        type="button"
                        aria-pressed=${this._editMode && this._selectedMarkerId === f.id ? "true" : "false"}
                        @click=${() => this._editMode ? this._selectCanvasObject("marker", f.id) : this._openMoreInfo(f.entity_id)}
                      >
                        ${l("panel.markerObject", { entity: f.entity_id })}
                      </button>
                    </li>
                  `
    )}
              </ul>
            </section>
          </div>
        </div>
        <floorplan-dialog
          .dialog=${this._dialog}
          .cancelLabel=${l("dialog.cancel")}
          @floorplan-dialog-resolve=${(f) => this._resolveDialog(f.detail)}
        ></floorplan-dialog>
      </div>
    `;
  }
};
Kr.styles = lc;
let et = Kr;
lt([
  we({ attribute: !1 })
], et.prototype, "hass");
lt([
  we({ type: Boolean })
], et.prototype, "narrow");
lt([
  we({ type: Object })
], et.prototype, "panel");
lt([
  ut()
], et.prototype, "_config");
lt([
  ut()
], et.prototype, "_loading");
lt([
  ut()
], et.prototype, "_editMode");
lt([
  ut()
], et.prototype, "_currentView");
lt([
  ut()
], et.prototype, "_currentPlanId");
lt([
  ut()
], et.prototype, "_selectedAreaId");
lt([
  ut()
], et.prototype, "_selectedMarkerId");
lt([
  ut()
], et.prototype, "_haAreas");
lt([
  ut()
], et.prototype, "_haEntities");
lt([
  ut()
], et.prototype, "_entityToAdd");
lt([
  ut()
], et.prototype, "_entitySearch");
lt([
  ut()
], et.prototype, "_entityDomainFilter");
lt([
  ut()
], et.prototype, "_entityAreaFilter");
lt([
  ut()
], et.prototype, "_notice");
lt([
  ut()
], et.prototype, "_error");
lt([
  ut()
], et.prototype, "_saveState");
lt([
  ut()
], et.prototype, "_saveDirty");
lt([
  ut()
], et.prototype, "_saveConflict");
lt([
  ut()
], et.prototype, "_dialog");
customElements.get("floorplan-ui-panel") || customElements.define("floorplan-ui-panel", et);

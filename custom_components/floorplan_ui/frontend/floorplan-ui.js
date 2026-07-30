/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Je = globalThis, xn = Je.ShadowRoot && (Je.ShadyCSS === void 0 || Je.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, An = Symbol(), jn = /* @__PURE__ */ new WeakMap();
let Ur = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== An) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (xn && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = jn.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && jn.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ps = (h) => new Ur(typeof h == "string" ? h : h + "", void 0, An), Es = (h, ...t) => {
  const e = h.length === 1 ? h[0] : t.reduce((i, n, r) => i + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + h[r + 1], h[0]);
  return new Ur(e, h, An);
}, Ts = (h, t) => {
  if (xn) h.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), n = Je.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = e.cssText, h.appendChild(i);
  }
}, Yn = xn ? (h) => h : (h) => h instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Ps(e);
})(h) : h;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ms, defineProperty: Rs, getOwnPropertyDescriptor: Fs, getOwnPropertyNames: Os, getOwnPropertySymbols: Ns, getPrototypeOf: Ls } = Object, It = globalThis, Xn = It.trustedTypes, Gs = Xn ? Xn.emptyScript : "", Zi = It.reactiveElementPolyfillSupport, Re = (h, t) => h, ti = { toAttribute(h, t) {
  switch (t) {
    case Boolean:
      h = h ? Gs : null;
      break;
    case Object:
    case Array:
      h = h == null ? h : JSON.stringify(h);
  }
  return h;
}, fromAttribute(h, t) {
  let e = h;
  switch (t) {
    case Boolean:
      e = h !== null;
      break;
    case Number:
      e = h === null ? null : Number(h);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(h);
      } catch {
        e = null;
      }
  }
  return e;
} }, kn = (h, t) => !Ms(h, t), Kn = { attribute: !0, type: String, converter: ti, reflect: !1, useDefault: !1, hasChanged: kn };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), It.litPropertyMetadata ?? (It.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let ge = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Kn) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(t, i, e);
      n !== void 0 && Rs(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: n, set: r } = Fs(this.prototype, t) ?? { get() {
      return this[e];
    }, set(s) {
      this[e] = s;
    } };
    return { get: n, set(s) {
      const a = n == null ? void 0 : n.call(this);
      r == null || r.call(this, s), this.requestUpdate(t, a, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Kn;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Re("elementProperties"))) return;
    const t = Ls(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Re("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Re("properties"))) {
      const e = this.properties, i = [...Os(e), ...Ns(e)];
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
      for (const n of i) e.unshift(Yn(n));
    } else t !== void 0 && e.push(Yn(t));
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
    return Ts(t, this.constructor.elementStyles), t;
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
      const s = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : ti).toAttribute(e, i.type);
      this._$Em = t, s == null ? this.removeAttribute(n) : this.setAttribute(n, s), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, s;
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const a = i.getPropertyOptions(n), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((r = a.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? a.converter : ti;
      this._$Em = n;
      const l = o.fromAttribute(e, a.type);
      this[n] = l ?? ((s = this._$Ej) == null ? void 0 : s.get(n)) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, n = !1, r) {
    var s;
    if (t !== void 0) {
      const a = this.constructor;
      if (n === !1 && (r = this[t]), i ?? (i = a.getPropertyOptions(t)), !((i.hasChanged ?? kn)(r, e) || i.useDefault && i.reflect && r === ((s = this._$Ej) == null ? void 0 : s.get(t)) && !this.hasAttribute(a._$Eu(t, i)))) return;
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
        const { wrapped: a } = s, o = this[r];
        a !== !0 || this._$AL.has(r) || o === void 0 || this.C(r, void 0, s, o);
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
ge.elementStyles = [], ge.shadowRootOptions = { mode: "open" }, ge[Re("elementProperties")] = /* @__PURE__ */ new Map(), ge[Re("finalized")] = /* @__PURE__ */ new Map(), Zi == null || Zi({ ReactiveElement: ge }), (It.reactiveElementVersions ?? (It.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = globalThis, qn = (h) => h, ei = Fe.trustedTypes, Jn = ei ? ei.createPolicy("lit-html", { createHTML: (h) => h }) : void 0, Br = "$lit$", Dt = `lit$${Math.random().toFixed(9).slice(2)}$`, Vr = "?" + Dt, $s = `<${Vr}>`, Qt = document, Ne = () => Qt.createComment(""), Le = (h) => h === null || typeof h != "object" && typeof h != "function", Pn = Array.isArray, Ds = (h) => Pn(h) || typeof (h == null ? void 0 : h[Symbol.iterator]) == "function", tn = `[ 	
\f\r]`, Pe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Qn = /-->/g, Zn = />/g, Yt = RegExp(`>|${tn}(?:([^\\s"'>=/]+)(${tn}*=${tn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), tr = /'/g, er = /"/g, Hr = /^(?:script|style|textarea|title)$/i, Is = (h) => (t, ...e) => ({ _$litType$: h, strings: t, values: e }), lt = Is(1), pe = Symbol.for("lit-noChange"), ft = Symbol.for("lit-nothing"), ir = /* @__PURE__ */ new WeakMap(), qt = Qt.createTreeWalker(Qt, 129);
function zr(h, t) {
  if (!Pn(h) || !h.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Jn !== void 0 ? Jn.createHTML(t) : t;
}
const Us = (h, t) => {
  const e = h.length - 1, i = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = Pe;
  for (let a = 0; a < e; a++) {
    const o = h[a];
    let l, u, _ = -1, p = 0;
    for (; p < o.length && (s.lastIndex = p, u = s.exec(o), u !== null); ) p = s.lastIndex, s === Pe ? u[1] === "!--" ? s = Qn : u[1] !== void 0 ? s = Zn : u[2] !== void 0 ? (Hr.test(u[2]) && (n = RegExp("</" + u[2], "g")), s = Yt) : u[3] !== void 0 && (s = Yt) : s === Yt ? u[0] === ">" ? (s = n ?? Pe, _ = -1) : u[1] === void 0 ? _ = -2 : (_ = s.lastIndex - u[2].length, l = u[1], s = u[3] === void 0 ? Yt : u[3] === '"' ? er : tr) : s === er || s === tr ? s = Yt : s === Qn || s === Zn ? s = Pe : (s = Yt, n = void 0);
    const g = s === Yt && h[a + 1].startsWith("/>") ? " " : "";
    r += s === Pe ? o + $s : _ >= 0 ? (i.push(l), o.slice(0, _) + Br + o.slice(_) + Dt + g) : o + Dt + (_ === -2 ? a : g);
  }
  return [zr(h, r + (h[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Ge {
  constructor({ strings: t, _$litType$: e }, i) {
    let n;
    this.parts = [];
    let r = 0, s = 0;
    const a = t.length - 1, o = this.parts, [l, u] = Us(t, e);
    if (this.el = Ge.createElement(l, i), qt.currentNode = this.el.content, e === 2 || e === 3) {
      const _ = this.el.content.firstChild;
      _.replaceWith(..._.childNodes);
    }
    for (; (n = qt.nextNode()) !== null && o.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const _ of n.getAttributeNames()) if (_.endsWith(Br)) {
          const p = u[s++], g = n.getAttribute(_).split(Dt), d = /([.?@])?(.*)/.exec(p);
          o.push({ type: 1, index: r, name: d[2], strings: g, ctor: d[1] === "." ? Vs : d[1] === "?" ? Hs : d[1] === "@" ? zs : ai }), n.removeAttribute(_);
        } else _.startsWith(Dt) && (o.push({ type: 6, index: r }), n.removeAttribute(_));
        if (Hr.test(n.tagName)) {
          const _ = n.textContent.split(Dt), p = _.length - 1;
          if (p > 0) {
            n.textContent = ei ? ei.emptyScript : "";
            for (let g = 0; g < p; g++) n.append(_[g], Ne()), qt.nextNode(), o.push({ type: 2, index: ++r });
            n.append(_[p], Ne());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Vr) o.push({ type: 2, index: r });
      else {
        let _ = -1;
        for (; (_ = n.data.indexOf(Dt, _ + 1)) !== -1; ) o.push({ type: 7, index: r }), _ += Dt.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = Qt.createElement("template");
    return i.innerHTML = t, i;
  }
}
function _e(h, t, e = h, i) {
  var s, a;
  if (t === pe) return t;
  let n = i !== void 0 ? (s = e._$Co) == null ? void 0 : s[i] : e._$Cl;
  const r = Le(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== r && ((a = n == null ? void 0 : n._$AO) == null || a.call(n, !1), r === void 0 ? n = void 0 : (n = new r(h), n._$AT(h, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = n : e._$Cl = n), n !== void 0 && (t = _e(h, n._$AS(h, t.values), n, i)), t;
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
    const { el: { content: e }, parts: i } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? Qt).importNode(e, !0);
    qt.currentNode = n;
    let r = qt.nextNode(), s = 0, a = 0, o = i[0];
    for (; o !== void 0; ) {
      if (s === o.index) {
        let l;
        o.type === 2 ? l = new Ie(r, r.nextSibling, this, t) : o.type === 1 ? l = new o.ctor(r, o.name, o.strings, this, t) : o.type === 6 && (l = new Ws(r, this, t)), this._$AV.push(l), o = i[++a];
      }
      s !== (o == null ? void 0 : o.index) && (r = qt.nextNode(), s++);
    }
    return qt.currentNode = Qt, n;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class Ie {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, n) {
    this.type = 2, this._$AH = ft, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
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
    t = _e(this, t, e), Le(t) ? t === ft || t == null || t === "" ? (this._$AH !== ft && this._$AR(), this._$AH = ft) : t !== this._$AH && t !== pe && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ds(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== ft && Le(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Qt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Ge.createElement(zr(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === n) this._$AH.p(e);
    else {
      const s = new Bs(n, this), a = s.u(this.options);
      s.p(e), this.T(a), this._$AH = s;
    }
  }
  _$AC(t) {
    let e = ir.get(t.strings);
    return e === void 0 && ir.set(t.strings, e = new Ge(t)), e;
  }
  k(t) {
    Pn(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, n = 0;
    for (const r of t) n === e.length ? e.push(i = new Ie(this.O(Ne()), this.O(Ne()), this, this.options)) : i = e[n], i._$AI(r), n++;
    n < e.length && (this._$AR(i && i._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const n = qn(t).nextSibling;
      qn(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class ai {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, n, r) {
    this.type = 1, this._$AH = ft, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = ft;
  }
  _$AI(t, e = this, i, n) {
    const r = this.strings;
    let s = !1;
    if (r === void 0) t = _e(this, t, e, 0), s = !Le(t) || t !== this._$AH && t !== pe, s && (this._$AH = t);
    else {
      const a = t;
      let o, l;
      for (t = r[0], o = 0; o < r.length - 1; o++) l = _e(this, a[i + o], e, o), l === pe && (l = this._$AH[o]), s || (s = !Le(l) || l !== this._$AH[o]), l === ft ? t = ft : t !== ft && (t += (l ?? "") + r[o + 1]), this._$AH[o] = l;
    }
    s && !n && this.j(t);
  }
  j(t) {
    t === ft ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Vs extends ai {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === ft ? void 0 : t;
  }
}
class Hs extends ai {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== ft);
  }
}
class zs extends ai {
  constructor(t, e, i, n, r) {
    super(t, e, i, n, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = _e(this, t, e, 0) ?? ft) === pe) return;
    const i = this._$AH, n = t === ft && i !== ft || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== ft && (i === ft || n);
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
    _e(this, t);
  }
}
const en = Fe.litHtmlPolyfillSupport;
en == null || en(Ge, Ie), (Fe.litHtmlVersions ?? (Fe.litHtmlVersions = [])).push("3.3.2");
const js = (h, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let n = i._$litPart$;
  if (n === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = n = new Ie(t.insertBefore(Ne(), r), r, void 0, e ?? {});
  }
  return n._$AI(h), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Jt = globalThis;
class Oe extends ge {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = js(e, this.renderRoot, this.renderOptions);
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
    return pe;
  }
}
var Ir;
Oe._$litElement$ = !0, Oe.finalized = !0, (Ir = Jt.litElementHydrateSupport) == null || Ir.call(Jt, { LitElement: Oe });
const nn = Jt.litElementPolyfillSupport;
nn == null || nn({ LitElement: Oe });
(Jt.litElementVersions ?? (Jt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ys = { attribute: !0, type: String, converter: ti, reflect: !1, hasChanged: kn }, Xs = (h = Ys, t, e) => {
  const { kind: i, metadata: n } = e;
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), i === "setter" && ((h = Object.create(h)).wrapped = !0), r.set(e.name, h), i === "accessor") {
    const { name: s } = e;
    return { set(a) {
      const o = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(s, o, h, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(s, void 0, h, a), a;
    } };
  }
  if (i === "setter") {
    const { name: s } = e;
    return function(a) {
      const o = this[s];
      t.call(this, a), this.requestUpdate(s, o, h, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function oi(h) {
  return (t, e) => typeof e == "object" ? Xs(h, t, e) : ((i, n, r) => {
    const s = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, i), s ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(h, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function _t(h) {
  return oi({ ...h, state: !0, attribute: !1 });
}
var nr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ks(h) {
  return h && h.__esModule && Object.prototype.hasOwnProperty.call(h, "default") ? h.default : h;
}
var En = { exports: {} }, hi = {}, Wr = {}, B = {};
(function(h) {
  Object.defineProperty(h, "__esModule", { value: !0 }), h._registerNode = h.Konva = h.glob = void 0;
  const t = Math.PI / 180;
  function e() {
    return typeof window < "u" && ({}.toString.call(window) === "[object Window]" || {}.toString.call(window) === "[object global]");
  }
  h.glob = typeof nr < "u" ? nr : typeof window < "u" ? window : typeof WorkerGlobalScope < "u" ? self : {}, h.Konva = {
    _global: h.glob,
    version: "9.3.22",
    isBrowser: e(),
    isUnminified: /param/.test((function(n) {
    }).toString()),
    dblClickWindow: 400,
    getAngle(n) {
      return h.Konva.angleDeg ? n * t : n;
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
      return h.Konva.DD.isDragging;
    },
    isTransforming() {
      var n;
      return (n = h.Konva.Transformer) === null || n === void 0 ? void 0 : n.isTransforming();
    },
    isDragReady() {
      return !!h.Konva.DD.node;
    },
    releaseCanvasOnDestroy: !0,
    document: h.glob.document,
    _injectGlobal(n) {
      h.glob.Konva = n;
    }
  };
  const i = (n) => {
    h.Konva[n.prototype.getClassName()] = n;
  };
  h._registerNode = i, h.Konva._injectGlobal(h.Konva);
})(B);
var nt = {};
(function(h) {
  Object.defineProperty(h, "__esModule", { value: !0 }), h.Util = h.Transform = void 0;
  const t = B;
  class e {
    constructor(f = [1, 0, 0, 1, 0, 0]) {
      this.dirty = !1, this.m = f && f.slice() || [1, 0, 0, 1, 0, 0];
    }
    reset() {
      this.m[0] = 1, this.m[1] = 0, this.m[2] = 0, this.m[3] = 1, this.m[4] = 0, this.m[5] = 0;
    }
    copy() {
      return new e(this.m);
    }
    copyInto(f) {
      f.m[0] = this.m[0], f.m[1] = this.m[1], f.m[2] = this.m[2], f.m[3] = this.m[3], f.m[4] = this.m[4], f.m[5] = this.m[5];
    }
    point(f) {
      const b = this.m;
      return {
        x: b[0] * f.x + b[2] * f.y + b[4],
        y: b[1] * f.x + b[3] * f.y + b[5]
      };
    }
    translate(f, b) {
      return this.m[4] += this.m[0] * f + this.m[2] * b, this.m[5] += this.m[1] * f + this.m[3] * b, this;
    }
    scale(f, b) {
      return this.m[0] *= f, this.m[1] *= f, this.m[2] *= b, this.m[3] *= b, this;
    }
    rotate(f) {
      const b = Math.cos(f), x = Math.sin(f), P = this.m[0] * b + this.m[2] * x, v = this.m[1] * b + this.m[3] * x, E = this.m[0] * -x + this.m[2] * b, A = this.m[1] * -x + this.m[3] * b;
      return this.m[0] = P, this.m[1] = v, this.m[2] = E, this.m[3] = A, this;
    }
    getTranslation() {
      return {
        x: this.m[4],
        y: this.m[5]
      };
    }
    skew(f, b) {
      const x = this.m[0] + this.m[2] * b, P = this.m[1] + this.m[3] * b, v = this.m[2] + this.m[0] * f, E = this.m[3] + this.m[1] * f;
      return this.m[0] = x, this.m[1] = P, this.m[2] = v, this.m[3] = E, this;
    }
    multiply(f) {
      const b = this.m[0] * f.m[0] + this.m[2] * f.m[1], x = this.m[1] * f.m[0] + this.m[3] * f.m[1], P = this.m[0] * f.m[2] + this.m[2] * f.m[3], v = this.m[1] * f.m[2] + this.m[3] * f.m[3], E = this.m[0] * f.m[4] + this.m[2] * f.m[5] + this.m[4], A = this.m[1] * f.m[4] + this.m[3] * f.m[5] + this.m[5];
      return this.m[0] = b, this.m[1] = x, this.m[2] = P, this.m[3] = v, this.m[4] = E, this.m[5] = A, this;
    }
    invert() {
      const f = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]), b = this.m[3] * f, x = -this.m[1] * f, P = -this.m[2] * f, v = this.m[0] * f, E = f * (this.m[2] * this.m[5] - this.m[3] * this.m[4]), A = f * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
      return this.m[0] = b, this.m[1] = x, this.m[2] = P, this.m[3] = v, this.m[4] = E, this.m[5] = A, this;
    }
    getMatrix() {
      return this.m;
    }
    decompose() {
      const f = this.m[0], b = this.m[1], x = this.m[2], P = this.m[3], v = this.m[4], E = this.m[5], A = f * P - b * x, T = {
        x: v,
        y: E,
        rotation: 0,
        scaleX: 0,
        scaleY: 0,
        skewX: 0,
        skewY: 0
      };
      if (f != 0 || b != 0) {
        const M = Math.sqrt(f * f + b * b);
        T.rotation = b > 0 ? Math.acos(f / M) : -Math.acos(f / M), T.scaleX = M, T.scaleY = A / M, T.skewX = (f * x + b * P) / A, T.skewY = 0;
      } else if (x != 0 || P != 0) {
        const M = Math.sqrt(x * x + P * P);
        T.rotation = Math.PI / 2 - (P > 0 ? Math.acos(-x / M) : -Math.acos(x / M)), T.scaleX = A / M, T.scaleY = M, T.skewX = 0, T.skewY = (f * x + b * P) / A;
      }
      return T.rotation = h.Util._getRotation(T.rotation), T;
    }
  }
  h.Transform = e;
  const i = "[object Array]", n = "[object Number]", r = "[object String]", s = "[object Boolean]", a = Math.PI / 180, o = 180 / Math.PI, l = "#", u = "", _ = "0", p = "Konva warning: ", g = "Konva error: ", d = "rgb(", m = {
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
  let S = [];
  const w = typeof requestAnimationFrame < "u" && requestAnimationFrame || function(c) {
    setTimeout(c, 60);
  };
  h.Util = {
    _isElement(c) {
      return !!(c && c.nodeType == 1);
    },
    _isFunction(c) {
      return !!(c && c.constructor && c.call && c.apply);
    },
    _isPlainObject(c) {
      return !!c && c.constructor === Object;
    },
    _isArray(c) {
      return Object.prototype.toString.call(c) === i;
    },
    _isNumber(c) {
      return Object.prototype.toString.call(c) === n && !isNaN(c) && isFinite(c);
    },
    _isString(c) {
      return Object.prototype.toString.call(c) === r;
    },
    _isBoolean(c) {
      return Object.prototype.toString.call(c) === s;
    },
    isObject(c) {
      return c instanceof Object;
    },
    isValidSelector(c) {
      if (typeof c != "string")
        return !1;
      const f = c[0];
      return f === "#" || f === "." || f === f.toUpperCase();
    },
    _sign(c) {
      return c === 0 || c > 0 ? 1 : -1;
    },
    requestAnimFrame(c) {
      S.push(c), S.length === 1 && w(function() {
        const f = S;
        S = [], f.forEach(function(b) {
          b();
        });
      });
    },
    createCanvasElement() {
      const c = document.createElement("canvas");
      try {
        c.style = c.style || {};
      } catch {
      }
      return c;
    },
    createImageElement() {
      return document.createElement("img");
    },
    _isInDocument(c) {
      for (; c = c.parentNode; )
        if (c == document)
          return !0;
      return !1;
    },
    _urlToImage(c, f) {
      const b = h.Util.createImageElement();
      b.onload = function() {
        f(b);
      }, b.src = c;
    },
    _rgbToHex(c, f, b) {
      return ((1 << 24) + (c << 16) + (f << 8) + b).toString(16).slice(1);
    },
    _hexToRgb(c) {
      c = c.replace(l, u);
      const f = parseInt(c, 16);
      return {
        r: f >> 16 & 255,
        g: f >> 8 & 255,
        b: f & 255
      };
    },
    getRandomColor() {
      let c = (Math.random() * 16777215 << 0).toString(16);
      for (; c.length < 6; )
        c = _ + c;
      return l + c;
    },
    getRGB(c) {
      let f;
      return c in m ? (f = m[c], {
        r: f[0],
        g: f[1],
        b: f[2]
      }) : c[0] === l ? this._hexToRgb(c.substring(1)) : c.substr(0, 4) === d ? (f = y.exec(c.replace(/ /g, "")), {
        r: parseInt(f[1], 10),
        g: parseInt(f[2], 10),
        b: parseInt(f[3], 10)
      }) : {
        r: 0,
        g: 0,
        b: 0
      };
    },
    colorToRGBA(c) {
      return c = c || "black", h.Util._namedColorToRBA(c) || h.Util._hex3ColorToRGBA(c) || h.Util._hex4ColorToRGBA(c) || h.Util._hex6ColorToRGBA(c) || h.Util._hex8ColorToRGBA(c) || h.Util._rgbColorToRGBA(c) || h.Util._rgbaColorToRGBA(c) || h.Util._hslColorToRGBA(c);
    },
    _namedColorToRBA(c) {
      const f = m[c.toLowerCase()];
      return f ? {
        r: f[0],
        g: f[1],
        b: f[2],
        a: 1
      } : null;
    },
    _rgbColorToRGBA(c) {
      if (c.indexOf("rgb(") === 0) {
        c = c.match(/rgb\(([^)]+)\)/)[1];
        const f = c.split(/ *, */).map(Number);
        return {
          r: f[0],
          g: f[1],
          b: f[2],
          a: 1
        };
      }
    },
    _rgbaColorToRGBA(c) {
      if (c.indexOf("rgba(") === 0) {
        c = c.match(/rgba\(([^)]+)\)/)[1];
        const f = c.split(/ *, */).map((b, x) => b.slice(-1) === "%" ? x === 3 ? parseInt(b) / 100 : parseInt(b) / 100 * 255 : Number(b));
        return {
          r: f[0],
          g: f[1],
          b: f[2],
          a: f[3]
        };
      }
    },
    _hex8ColorToRGBA(c) {
      if (c[0] === "#" && c.length === 9)
        return {
          r: parseInt(c.slice(1, 3), 16),
          g: parseInt(c.slice(3, 5), 16),
          b: parseInt(c.slice(5, 7), 16),
          a: parseInt(c.slice(7, 9), 16) / 255
        };
    },
    _hex6ColorToRGBA(c) {
      if (c[0] === "#" && c.length === 7)
        return {
          r: parseInt(c.slice(1, 3), 16),
          g: parseInt(c.slice(3, 5), 16),
          b: parseInt(c.slice(5, 7), 16),
          a: 1
        };
    },
    _hex4ColorToRGBA(c) {
      if (c[0] === "#" && c.length === 5)
        return {
          r: parseInt(c[1] + c[1], 16),
          g: parseInt(c[2] + c[2], 16),
          b: parseInt(c[3] + c[3], 16),
          a: parseInt(c[4] + c[4], 16) / 255
        };
    },
    _hex3ColorToRGBA(c) {
      if (c[0] === "#" && c.length === 4)
        return {
          r: parseInt(c[1] + c[1], 16),
          g: parseInt(c[2] + c[2], 16),
          b: parseInt(c[3] + c[3], 16),
          a: 1
        };
    },
    _hslColorToRGBA(c) {
      if (/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(c)) {
        const [f, ...b] = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(c), x = Number(b[0]) / 360, P = Number(b[1]) / 100, v = Number(b[2]) / 100;
        let E, A, T;
        if (P === 0)
          return T = v * 255, {
            r: Math.round(T),
            g: Math.round(T),
            b: Math.round(T),
            a: 1
          };
        v < 0.5 ? E = v * (1 + P) : E = v + P - v * P;
        const M = 2 * v - E, F = [0, 0, 0];
        for (let L = 0; L < 3; L++)
          A = x + 1 / 3 * -(L - 1), A < 0 && A++, A > 1 && A--, 6 * A < 1 ? T = M + (E - M) * 6 * A : 2 * A < 1 ? T = E : 3 * A < 2 ? T = M + (E - M) * (2 / 3 - A) * 6 : T = M, F[L] = T * 255;
        return {
          r: Math.round(F[0]),
          g: Math.round(F[1]),
          b: Math.round(F[2]),
          a: 1
        };
      }
    },
    haveIntersection(c, f) {
      return !(f.x > c.x + c.width || f.x + f.width < c.x || f.y > c.y + c.height || f.y + f.height < c.y);
    },
    cloneObject(c) {
      const f = {};
      for (const b in c)
        this._isPlainObject(c[b]) ? f[b] = this.cloneObject(c[b]) : this._isArray(c[b]) ? f[b] = this.cloneArray(c[b]) : f[b] = c[b];
      return f;
    },
    cloneArray(c) {
      return c.slice(0);
    },
    degToRad(c) {
      return c * a;
    },
    radToDeg(c) {
      return c * o;
    },
    _degToRad(c) {
      return h.Util.warn("Util._degToRad is removed. Please use public Util.degToRad instead."), h.Util.degToRad(c);
    },
    _radToDeg(c) {
      return h.Util.warn("Util._radToDeg is removed. Please use public Util.radToDeg instead."), h.Util.radToDeg(c);
    },
    _getRotation(c) {
      return t.Konva.angleDeg ? h.Util.radToDeg(c) : c;
    },
    _capitalize(c) {
      return c.charAt(0).toUpperCase() + c.slice(1);
    },
    throw(c) {
      throw new Error(g + c);
    },
    error(c) {
      console.error(g + c);
    },
    warn(c) {
      t.Konva.showWarnings && console.warn(p + c);
    },
    each(c, f) {
      for (const b in c)
        f(b, c[b]);
    },
    _inRange(c, f, b) {
      return f <= c && c < b;
    },
    _getProjectionToSegment(c, f, b, x, P, v) {
      let E, A, T;
      const M = (c - b) * (c - b) + (f - x) * (f - x);
      if (M == 0)
        E = c, A = f, T = (P - b) * (P - b) + (v - x) * (v - x);
      else {
        const F = ((P - c) * (b - c) + (v - f) * (x - f)) / M;
        F < 0 ? (E = c, A = f, T = (c - P) * (c - P) + (f - v) * (f - v)) : F > 1 ? (E = b, A = x, T = (b - P) * (b - P) + (x - v) * (x - v)) : (E = c + F * (b - c), A = f + F * (x - f), T = (E - P) * (E - P) + (A - v) * (A - v));
      }
      return [E, A, T];
    },
    _getProjectionToLine(c, f, b) {
      const x = h.Util.cloneObject(c);
      let P = Number.MAX_VALUE;
      return f.forEach(function(v, E) {
        if (!b && E === f.length - 1)
          return;
        const A = f[(E + 1) % f.length], T = h.Util._getProjectionToSegment(v.x, v.y, A.x, A.y, c.x, c.y), M = T[0], F = T[1], L = T[2];
        L < P && (x.x = M, x.y = F, P = L);
      }), x;
    },
    _prepareArrayForTween(c, f, b) {
      const x = [], P = [];
      if (c.length > f.length) {
        const E = f;
        f = c, c = E;
      }
      for (let E = 0; E < c.length; E += 2)
        x.push({
          x: c[E],
          y: c[E + 1]
        });
      for (let E = 0; E < f.length; E += 2)
        P.push({
          x: f[E],
          y: f[E + 1]
        });
      const v = [];
      return P.forEach(function(E) {
        const A = h.Util._getProjectionToLine(E, x, b);
        v.push(A.x), v.push(A.y);
      }), v;
    },
    _prepareToStringify(c) {
      let f;
      c.visitedByCircularReferenceRemoval = !0;
      for (const b in c)
        if (c.hasOwnProperty(b) && c[b] && typeof c[b] == "object") {
          if (f = Object.getOwnPropertyDescriptor(c, b), c[b].visitedByCircularReferenceRemoval || h.Util._isElement(c[b]))
            if (f.configurable)
              delete c[b];
            else
              return null;
          else if (h.Util._prepareToStringify(c[b]) === null)
            if (f.configurable)
              delete c[b];
            else
              return null;
        }
      return delete c.visitedByCircularReferenceRemoval, c;
    },
    _assign(c, f) {
      for (const b in f)
        c[b] = f[b];
      return c;
    },
    _getFirstPointerId(c) {
      return c.touches ? c.changedTouches[0].identifier : c.pointerId || 999;
    },
    releaseCanvas(...c) {
      t.Konva.releaseCanvasOnDestroy && c.forEach((f) => {
        f.width = 0, f.height = 0;
      });
    },
    drawRoundedRectPath(c, f, b, x) {
      let P = 0, v = 0, E = 0, A = 0;
      typeof x == "number" ? P = v = E = A = Math.min(x, f / 2, b / 2) : (P = Math.min(x[0] || 0, f / 2, b / 2), v = Math.min(x[1] || 0, f / 2, b / 2), A = Math.min(x[2] || 0, f / 2, b / 2), E = Math.min(x[3] || 0, f / 2, b / 2)), c.moveTo(P, 0), c.lineTo(f - v, 0), c.arc(f - v, v, v, Math.PI * 3 / 2, 0, !1), c.lineTo(f, b - A), c.arc(f - A, b - A, A, 0, Math.PI / 2, !1), c.lineTo(E, b), c.arc(E, b - E, E, Math.PI / 2, Math.PI, !1), c.lineTo(0, P), c.arc(P, P, P, Math.PI, Math.PI * 3 / 2, !1);
    }
  };
})(nt);
var et = {}, St = {}, Mt = {};
Object.defineProperty(Mt, "__esModule", { value: !0 });
Mt.HitContext = Mt.SceneContext = Mt.Context = void 0;
const jr = nt, qs = B;
function Js(h) {
  const t = [], e = h.length, i = jr.Util;
  for (let n = 0; n < e; n++) {
    let r = h[n];
    i._isNumber(r) ? r = Math.round(r * 1e3) / 1e3 : i._isString(r) || (r = r + ""), t.push(r);
  }
  return t;
}
const rr = ",", Qs = "(", Zs = ")", ta = "([", ea = "])", ia = ";", na = "()", ra = "=", sr = [
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
], sa = [
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
], aa = 100;
class li {
  constructor(t) {
    this.canvas = t, qs.Konva.enableTrace && (this.traceArr = [], this._enableTrace());
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
    let i = this.traceArr, n = i.length, r = "", s, a, o, l;
    for (s = 0; s < n; s++)
      a = i[s], o = a.method, o ? (l = a.args, r += o, t ? r += na : jr.Util._isArray(l[0]) ? r += ta + l.join(rr) + ea : (e && (l = l.map((u) => typeof u == "number" ? Math.floor(u) : u)), r += Qs + l.join(rr) + Zs)) : (r += a.property, t || (r += ra + a.val)), r += ia;
    return r;
  }
  clearTrace() {
    this.traceArr = [];
  }
  _trace(t) {
    let e = this.traceArr, i;
    e.push(t), i = e.length, i >= aa && e.shift();
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
  drawImage(t, e, i, n, r, s, a, o, l) {
    const u = arguments, _ = this._context;
    u.length === 3 ? _.drawImage(t, e, i) : u.length === 5 ? _.drawImage(t, e, i, n, r) : u.length === 9 && _.drawImage(t, e, i, n, r, s, a, o, l);
  }
  ellipse(t, e, i, n, r, s, a, o) {
    this._context.ellipse(t, e, i, n, r, s, a, o);
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
    let t = this, e = sr.length, i = this.setAttr, n, r;
    const s = function(a) {
      let o = t[a], l;
      t[a] = function() {
        return r = Js(Array.prototype.slice.call(arguments, 0)), l = o.apply(t, arguments), t._trace({
          method: a,
          args: r
        }), l;
      };
    };
    for (n = 0; n < e; n++)
      s(sr[n]);
    t.setAttr = function() {
      i.apply(t, arguments);
      const a = arguments[0];
      let o = arguments[1];
      (a === "shadowOffsetX" || a === "shadowOffsetY" || a === "shadowBlur") && (o = o / this.canvas.getPixelRatio()), t._trace({
        property: a,
        val: o
      });
    };
  }
  _applyGlobalCompositeOperation(t) {
    const e = t.attrs.globalCompositeOperation;
    !e || e === "source-over" || this.setAttr("globalCompositeOperation", e);
  }
}
Mt.Context = li;
sa.forEach(function(h) {
  Object.defineProperty(li.prototype, h, {
    get() {
      return this._context[h];
    },
    set(t) {
      this._context[h] = t;
    }
  });
});
class oa extends li {
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
    const r = (e = t.getShadowRGBA()) !== null && e !== void 0 ? e : "black", s = (i = t.getShadowBlur()) !== null && i !== void 0 ? i : 5, a = (n = t.getShadowOffset()) !== null && n !== void 0 ? n : {
      x: 0,
      y: 0
    }, o = t.getAbsoluteScale(), l = this.canvas.getPixelRatio(), u = o.x * l, _ = o.y * l;
    this.setAttr("shadowColor", r), this.setAttr("shadowBlur", s * Math.min(Math.abs(u), Math.abs(_))), this.setAttr("shadowOffsetX", a.x * u), this.setAttr("shadowOffsetY", a.y * _);
  }
}
Mt.SceneContext = oa;
class ha extends li {
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
Mt.HitContext = ha;
Object.defineProperty(St, "__esModule", { value: !0 });
St.HitCanvas = St.SceneCanvas = St.Canvas = void 0;
const ii = nt, Yr = Mt, Xr = B;
let We;
function la() {
  if (We)
    return We;
  const h = ii.Util.createCanvasElement(), t = h.getContext("2d");
  return We = function() {
    const e = Xr.Konva._global.devicePixelRatio || 1, i = t.webkitBackingStorePixelRatio || t.mozBackingStorePixelRatio || t.msBackingStorePixelRatio || t.oBackingStorePixelRatio || t.backingStorePixelRatio || 1;
    return e / i;
  }(), ii.Util.releaseCanvas(h), We;
}
class Tn {
  constructor(t) {
    this.pixelRatio = 1, this.width = 0, this.height = 0, this.isCache = !1;
    const i = (t || {}).pixelRatio || Xr.Konva.pixelRatio || la();
    this.pixelRatio = i, this._canvas = ii.Util.createCanvasElement(), this._canvas.style.padding = "0", this._canvas.style.margin = "0", this._canvas.style.border = "0", this._canvas.style.background = "transparent", this._canvas.style.position = "absolute", this._canvas.style.top = "0", this._canvas.style.left = "0";
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
        return ii.Util.error("Unable to get data URL. " + n.message + " For more info read https://konvajs.org/docs/posts/Tainted_Canvas.html."), "";
      }
    }
  }
}
St.Canvas = Tn;
class ca extends Tn {
  constructor(t = { width: 0, height: 0, willReadFrequently: !1 }) {
    super(t), this.context = new Yr.SceneContext(this, {
      willReadFrequently: t.willReadFrequently
    }), this.setSize(t.width, t.height);
  }
}
St.SceneCanvas = ca;
class da extends Tn {
  constructor(t = { width: 0, height: 0 }) {
    super(t), this.hitCanvas = !0, this.context = new Yr.HitContext(this), this.setSize(t.width, t.height);
  }
}
St.HitCanvas = da;
var ci = {};
(function(h) {
  Object.defineProperty(h, "__esModule", { value: !0 }), h.DD = void 0;
  const t = B, e = nt;
  h.DD = {
    get isDragging() {
      let i = !1;
      return h.DD._dragElements.forEach((n) => {
        n.dragStatus === "dragging" && (i = !0);
      }), i;
    },
    justDragged: !1,
    get node() {
      let i;
      return h.DD._dragElements.forEach((n) => {
        i = n.node;
      }), i;
    },
    _dragElements: /* @__PURE__ */ new Map(),
    _drag(i) {
      const n = [];
      h.DD._dragElements.forEach((r, s) => {
        const { node: a } = r, o = a.getStage();
        o.setPointersPositions(i), r.pointerId === void 0 && (r.pointerId = e.Util._getFirstPointerId(i));
        const l = o._changedPointerPositions.find((u) => u.id === r.pointerId);
        if (l) {
          if (r.dragStatus !== "dragging") {
            const u = a.dragDistance();
            if (Math.max(Math.abs(l.x - r.startPointerPos.x), Math.abs(l.y - r.startPointerPos.y)) < u || (a.startDrag({ evt: i }), !a.isDragging()))
              return;
          }
          a._setDragPosition(i, r), n.push(a);
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
      h.DD._dragElements.forEach((r) => {
        const { node: s } = r, a = s.getStage();
        if (i && a.setPointersPositions(i), !a._changedPointerPositions.find((u) => u.id === r.pointerId))
          return;
        (r.dragStatus === "dragging" || r.dragStatus === "stopped") && (h.DD.justDragged = !0, t.Konva._mouseListenClick = !1, t.Konva._touchListenClick = !1, t.Konva._pointerListenClick = !1, r.dragStatus = "stopped");
        const l = r.node.getLayer() || r.node instanceof t.Konva.Stage && r.node;
        l && n.indexOf(l) === -1 && n.push(l);
      }), n.forEach((r) => {
        r.draw();
      });
    },
    _endDragAfter(i) {
      h.DD._dragElements.forEach((n, r) => {
        n.dragStatus === "stopped" && n.node.fire("dragend", {
          type: "dragend",
          target: n.node,
          evt: i
        }, !0), n.dragStatus !== "dragging" && h.DD._dragElements.delete(r);
      });
    }
  }, t.Konva.isBrowser && (window.addEventListener("mouseup", h.DD._endDragBefore, !0), window.addEventListener("touchend", h.DD._endDragBefore, !0), window.addEventListener("touchcancel", h.DD._endDragBefore, !0), window.addEventListener("mousemove", h.DD._drag), window.addEventListener("touchmove", h.DD._drag), window.addEventListener("mouseup", h.DD._endDragAfter, !1), window.addEventListener("touchend", h.DD._endDragAfter, !1), window.addEventListener("touchcancel", h.DD._endDragAfter, !1));
})(ci);
var V = {}, $ = {};
Object.defineProperty($, "__esModule", { value: !0 });
$.RGBComponent = ua;
$.alphaComponent = fa;
$.getNumberValidator = ga;
$.getNumberOrArrayOfNumbersValidator = pa;
$.getNumberOrAutoValidator = _a;
$.getStringValidator = ma;
$.getStringOrGradientValidator = ya;
$.getFunctionValidator = ba;
$.getNumberArrayValidator = va;
$.getBooleanValidator = Sa;
$.getComponentValidator = Ca;
const Rt = B, rt = nt;
function Ft(h) {
  return rt.Util._isString(h) ? '"' + h + '"' : Object.prototype.toString.call(h) === "[object Number]" || rt.Util._isBoolean(h) ? h : Object.prototype.toString.call(h);
}
function ua(h) {
  return h > 255 ? 255 : h < 0 ? 0 : Math.round(h);
}
function fa(h) {
  return h > 1 ? 1 : h < 1e-4 ? 1e-4 : h;
}
function ga() {
  if (Rt.Konva.isUnminified)
    return function(h, t) {
      return rt.Util._isNumber(h) || rt.Util.warn(Ft(h) + ' is a not valid value for "' + t + '" attribute. The value should be a number.'), h;
    };
}
function pa(h) {
  if (Rt.Konva.isUnminified)
    return function(t, e) {
      let i = rt.Util._isNumber(t), n = rt.Util._isArray(t) && t.length == h;
      return !i && !n && rt.Util.warn(Ft(t) + ' is a not valid value for "' + e + '" attribute. The value should be a number or Array<number>(' + h + ")"), t;
    };
}
function _a() {
  if (Rt.Konva.isUnminified)
    return function(h, t) {
      return rt.Util._isNumber(h) || h === "auto" || rt.Util.warn(Ft(h) + ' is a not valid value for "' + t + '" attribute. The value should be a number or "auto".'), h;
    };
}
function ma() {
  if (Rt.Konva.isUnminified)
    return function(h, t) {
      return rt.Util._isString(h) || rt.Util.warn(Ft(h) + ' is a not valid value for "' + t + '" attribute. The value should be a string.'), h;
    };
}
function ya() {
  if (Rt.Konva.isUnminified)
    return function(h, t) {
      const e = rt.Util._isString(h), i = Object.prototype.toString.call(h) === "[object CanvasGradient]" || h && h.addColorStop;
      return e || i || rt.Util.warn(Ft(h) + ' is a not valid value for "' + t + '" attribute. The value should be a string or a native gradient.'), h;
    };
}
function ba() {
  if (Rt.Konva.isUnminified)
    return function(h, t) {
      return rt.Util._isFunction(h) || rt.Util.warn(Ft(h) + ' is a not valid value for "' + t + '" attribute. The value should be a function.'), h;
    };
}
function va() {
  if (Rt.Konva.isUnminified)
    return function(h, t) {
      const e = Int8Array ? Object.getPrototypeOf(Int8Array) : null;
      return e && h instanceof e || (rt.Util._isArray(h) ? h.forEach(function(i) {
        rt.Util._isNumber(i) || rt.Util.warn('"' + t + '" attribute has non numeric element ' + i + ". Make sure that all elements are numbers.");
      }) : rt.Util.warn(Ft(h) + ' is a not valid value for "' + t + '" attribute. The value should be a array of numbers.')), h;
    };
}
function Sa() {
  if (Rt.Konva.isUnminified)
    return function(h, t) {
      return h === !0 || h === !1 || rt.Util.warn(Ft(h) + ' is a not valid value for "' + t + '" attribute. The value should be a boolean.'), h;
    };
}
function Ca(h) {
  if (Rt.Konva.isUnminified)
    return function(t, e) {
      return t == null || rt.Util.isObject(t) || rt.Util.warn(Ft(t) + ' is a not valid value for "' + e + '" attribute. The value should be an object with properties ' + h), t;
    };
}
(function(h) {
  Object.defineProperty(h, "__esModule", { value: !0 }), h.Factory = void 0;
  const t = nt, e = $, i = "get", n = "set";
  h.Factory = {
    addGetterSetter(r, s, a, o, l) {
      h.Factory.addGetter(r, s, a), h.Factory.addSetter(r, s, o, l), h.Factory.addOverloadedGetterSetter(r, s);
    },
    addGetter(r, s, a) {
      const o = i + t.Util._capitalize(s);
      r.prototype[o] = r.prototype[o] || function() {
        const l = this.attrs[s];
        return l === void 0 ? a : l;
      };
    },
    addSetter(r, s, a, o) {
      const l = n + t.Util._capitalize(s);
      r.prototype[l] || h.Factory.overWriteSetter(r, s, a, o);
    },
    overWriteSetter(r, s, a, o) {
      const l = n + t.Util._capitalize(s);
      r.prototype[l] = function(u) {
        return a && u !== void 0 && u !== null && (u = a.call(this, u, s)), this._setAttr(s, u), o && o.call(this), this;
      };
    },
    addComponentsGetterSetter(r, s, a, o, l) {
      const u = a.length, _ = t.Util._capitalize, p = i + _(s), g = n + _(s);
      r.prototype[p] = function() {
        const m = {};
        for (let y = 0; y < u; y++) {
          const S = a[y];
          m[S] = this.getAttr(s + _(S));
        }
        return m;
      };
      const d = (0, e.getComponentValidator)(a);
      r.prototype[g] = function(m) {
        const y = this.attrs[s];
        o && (m = o.call(this, m, s)), d && d.call(this, m, s);
        for (const S in m)
          m.hasOwnProperty(S) && this._setAttr(s + _(S), m[S]);
        return m || a.forEach((S) => {
          this._setAttr(s + _(S), void 0);
        }), this._fireChangeEvent(s, y, m), l && l.call(this), this;
      }, h.Factory.addOverloadedGetterSetter(r, s);
    },
    addOverloadedGetterSetter(r, s) {
      const a = t.Util._capitalize(s), o = n + a, l = i + a;
      r.prototype[s] = function() {
        return arguments.length ? (this[o](arguments[0]), this) : this[l]();
      };
    },
    addDeprecatedGetterSetter(r, s, a, o) {
      t.Util.error("Adding deprecated " + s);
      const l = i + t.Util._capitalize(s), u = s + " property is deprecated and will be removed soon. Look at Konva change log for more information.";
      r.prototype[l] = function() {
        t.Util.error(u);
        const _ = this.attrs[s];
        return _ === void 0 ? a : _;
      }, h.Factory.addSetter(r, s, o, function() {
        t.Util.error(u);
      }), h.Factory.addOverloadedGetterSetter(r, s);
    },
    backCompat(r, s) {
      t.Util.each(s, function(a, o) {
        const l = r.prototype[o], u = i + t.Util._capitalize(a), _ = n + t.Util._capitalize(a);
        function p() {
          l.apply(this, arguments), t.Util.error('"' + a + '" method is deprecated and will be removed soon. Use ""' + o + '" instead.');
        }
        r.prototype[a] = p, r.prototype[u] = p, r.prototype[_] = p;
      });
    },
    afterSetFilter() {
      this._filterUpToDate = !1;
    }
  };
})(V);
Object.defineProperty(et, "__esModule", { value: !0 });
et.Node = void 0;
const ce = St, bt = ci, Ue = V, Gt = B, z = nt, ht = $, Qe = "absoluteOpacity", je = "allEventListeners", Tt = "absoluteTransform", ar = "absoluteScale", Xt = "canvas", wa = "Change", xa = "children", Aa = "konva", pn = "listening", ka = "mouseenter", Pa = "mouseleave", Ea = "pointerenter", Ta = "pointerleave", Ma = "touchenter", Ra = "touchleave", or = "set", hr = "Shape", Ze = " ", lr = "stage", $t = "transform", Fa = "Stage", _n = "visible", Oa = [
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
].join(Ze);
let Na = 1;
class D {
  constructor(t) {
    this._id = Na++, this.eventListeners = {}, this.attrs = {}, this.index = 0, this._allEventListeners = null, this.parent = null, this._cache = /* @__PURE__ */ new Map(), this._attachedDepsListeners = /* @__PURE__ */ new Map(), this._lastPos = null, this._batchingTransformChange = !1, this._needClearTransformCache = !1, this._filterUpToDate = !1, this._isUnderCache = !1, this._dragEventId = null, this._shouldFireChangeEvents = !1, this.setAttrs(t), this._shouldFireChangeEvents = !0;
  }
  hasChildren() {
    return !1;
  }
  _clearCache(t) {
    (t === $t || t === Tt) && this._cache.get(t) ? this._cache.get(t).dirty = !0 : t ? this._cache.delete(t) : this._cache.clear();
  }
  _getCache(t, e) {
    let i = this._cache.get(t);
    return (i === void 0 || (t === $t || t === Tt) && i.dirty === !0) && (i = e.call(this), this._cache.set(t, i)), i;
  }
  _calculate(t, e, i) {
    if (!this._attachedDepsListeners.get(t)) {
      const n = e.map((r) => r + "Change.konva").join(Ze);
      this.on(n, () => {
        this._clearCache(t);
      }), this._attachedDepsListeners.set(t, !0);
    }
    return this._getCache(t, i);
  }
  _getCanvasCache() {
    return this._cache.get(Xt);
  }
  _clearSelfAndDescendantCache(t) {
    this._clearCache(t), t === Tt && this.fire("absoluteTransformChange");
  }
  clearCache() {
    if (this._cache.has(Xt)) {
      const { scene: t, filter: e, hit: i, buffer: n } = this._cache.get(Xt);
      z.Util.releaseCanvas(t, e, i, n), this._cache.delete(Xt);
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
    let n = Math.ceil(e.width || i.width), r = Math.ceil(e.height || i.height), s = e.pixelRatio, a = e.x === void 0 ? Math.floor(i.x) : e.x, o = e.y === void 0 ? Math.floor(i.y) : e.y, l = e.offset || 0, u = e.drawBorder || !1, _ = e.hitCanvasPixelRatio || 1;
    if (!n || !r) {
      z.Util.error("Can not cache the node. Width or height of the node equals 0. Caching is skipped.");
      return;
    }
    const p = Math.abs(Math.round(i.x) - a) > 0.5 ? 1 : 0, g = Math.abs(Math.round(i.y) - o) > 0.5 ? 1 : 0;
    n += l * 2 + p, r += l * 2 + g, a -= l, o -= l;
    const d = new ce.SceneCanvas({
      pixelRatio: s,
      width: n,
      height: r
    }), m = new ce.SceneCanvas({
      pixelRatio: s,
      width: 0,
      height: 0,
      willReadFrequently: !0
    }), y = new ce.HitCanvas({
      pixelRatio: _,
      width: n,
      height: r
    }), S = d.getContext(), w = y.getContext(), c = new ce.SceneCanvas({
      width: d.width / d.pixelRatio + Math.abs(a),
      height: d.height / d.pixelRatio + Math.abs(o),
      pixelRatio: d.pixelRatio
    }), f = c.getContext();
    return y.isCache = !0, d.isCache = !0, this._cache.delete(Xt), this._filterUpToDate = !1, e.imageSmoothingEnabled === !1 && (d.getContext()._context.imageSmoothingEnabled = !1, m.getContext()._context.imageSmoothingEnabled = !1), S.save(), w.save(), f.save(), S.translate(-a, -o), w.translate(-a, -o), f.translate(-a, -o), c.x = a, c.y = o, this._isUnderCache = !0, this._clearSelfAndDescendantCache(Qe), this._clearSelfAndDescendantCache(ar), this.drawScene(d, this, c), this.drawHit(y, this), this._isUnderCache = !1, S.restore(), w.restore(), u && (S.save(), S.beginPath(), S.rect(0, 0, n, r), S.closePath(), S.setAttr("strokeStyle", "red"), S.setAttr("lineWidth", 5), S.stroke(), S.restore()), this._cache.set(Xt, {
      scene: d,
      filter: m,
      hit: y,
      buffer: c,
      x: a,
      y: o
    }), this._requestDraw(), this;
  }
  isCached() {
    return this._cache.has(Xt);
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
    let n = 1 / 0, r = 1 / 0, s = -1 / 0, a = -1 / 0;
    const o = this.getAbsoluteTransform(e);
    return i.forEach(function(l) {
      const u = o.point(l);
      n === void 0 && (n = s = u.x, r = a = u.y), n = Math.min(n, u.x), r = Math.min(r, u.y), s = Math.max(s, u.x), a = Math.max(a, u.y);
    }), {
      x: n,
      y: r,
      width: s - n,
      height: a - r
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
    let t = this.filters(), e = this._getCanvasCache(), i = e.scene, n = e.filter, r = n.getContext(), s, a, o, l;
    if (t) {
      if (!this._filterUpToDate) {
        const u = i.pixelRatio;
        n.setSize(i.width / i.pixelRatio, i.height / i.pixelRatio);
        try {
          for (s = t.length, r.clear(), r.drawImage(i._canvas, 0, 0, i.getWidth() / u, i.getHeight() / u), a = r.getImageData(0, 0, n.getWidth(), n.getHeight()), o = 0; o < s; o++) {
            if (l = t[o], typeof l != "function") {
              z.Util.error("Filter should be type of function, but got " + typeof l + " instead. Please check correct filters");
              continue;
            }
            l.call(this, a), r.putImageData(a, 0, 0);
          }
        } catch (_) {
          z.Util.error("Unable to apply filter. " + _.message + " This post my help you https://konvajs.org/docs/posts/Tainted_Canvas.html.");
        }
        this._filterUpToDate = !0;
      }
      return n;
    }
    return i;
  }
  on(t, e) {
    if (this._cache && this._cache.delete(je), arguments.length === 3)
      return this._delegate.apply(this, arguments);
    const i = t.split(Ze);
    for (let n = 0; n < i.length; n++) {
      const s = i[n].split("."), a = s[0], o = s[1] || "";
      this.eventListeners[a] || (this.eventListeners[a] = []), this.eventListeners[a].push({ name: o, handler: e });
    }
    return this;
  }
  off(t, e) {
    let i = (t || "").split(Ze), n = i.length, r, s, a, o, l, u;
    if (this._cache && this._cache.delete(je), !t)
      for (s in this.eventListeners)
        this._off(s);
    for (r = 0; r < n; r++)
      if (a = i[r], o = a.split("."), l = o[0], u = o[1], l)
        this.eventListeners[l] && this._off(l, u, e);
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
    const n = this;
    this.on(t, function(r) {
      const s = r.target.findAncestors(e, !0, n);
      for (let a = 0; a < s.length; a++)
        r = z.Util.cloneObject(r), r.currentTarget = s[a], i.call(s[a], r);
    });
  }
  remove() {
    return this.isDragging() && this.stopDrag(), bt.DD._dragElements.delete(this._id), this._remove(), this;
  }
  _clearCaches() {
    this._clearSelfAndDescendantCache(Tt), this._clearSelfAndDescendantCache(Qe), this._clearSelfAndDescendantCache(ar), this._clearSelfAndDescendantCache(lr), this._clearSelfAndDescendantCache(_n), this._clearSelfAndDescendantCache(pn);
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
        e !== xa && (i = or + z.Util._capitalize(e), z.Util._isFunction(this[i]) ? this[i](t[e]) : this._setAttr(e, t[e]));
    }), this;
  }
  isListening() {
    return this._getCache(pn, this._isListening);
  }
  _isListening(t) {
    if (!this.listening())
      return !1;
    const i = this.getParent();
    return i && i !== t && this !== t ? i._isListening(t) : !0;
  }
  isVisible() {
    return this._getCache(_n, this._isVisible);
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
    bt.DD._dragElements.forEach((s) => {
      s.dragStatus === "dragging" && (s.node.nodeType === "Stage" || s.node.getLayer() === i) && (n = !0);
    });
    const r = !e && !Gt.Konva.hitOnDragEnabled && (n || Gt.Konva.isTransforming());
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
    let t = this.getDepth(), e = this, i = 0, n, r, s, a;
    function o(u) {
      for (n = [], r = u.length, s = 0; s < r; s++)
        a = u[s], i++, a.nodeType !== hr && (n = n.concat(a.getChildren().slice())), a._id === e._id && (s = r);
      n.length > 0 && n[0].getDepth() <= t && o(n);
    }
    const l = this.getStage();
    return e.nodeType !== Fa && l && o(l.getChildren()), i;
  }
  getDepth() {
    let t = 0, e = this.parent;
    for (; e; )
      t++, e = e.parent;
    return t;
  }
  _batchTransformChanges(t) {
    this._batchingTransformChange = !0, t(), this._batchingTransformChange = !1, this._needClearTransformCache && (this._clearCache($t), this._clearSelfAndDescendantCache(Tt)), this._needClearTransformCache = !1;
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
    this.attrs.x = e, this.attrs.y = i, this._clearCache($t);
    const r = this._getAbsoluteTransform().copy();
    return r.invert(), r.translate(t.x, t.y), t = {
      x: this.attrs.x + r.getTranslation().x,
      y: this.attrs.y + r.getTranslation().y
    }, this._setTransform(n), this.setPosition({ x: t.x, y: t.y }), this._clearCache($t), this._clearSelfAndDescendantCache(Tt), this;
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
    return this._getCache(Qe, this._getAbsoluteOpacity);
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
    const a = {
      attrs: {},
      className: this.getClassName()
    };
    for (e in t)
      i = t[e], s = z.Util.isObject(i) && !z.Util._isPlainObject(i) && !z.Util._isArray(i), !s && (n = typeof this[e] == "function" && this[e], delete t[e], r = n ? n.call(this) : null, t[e] = i, r !== i && (a.attrs[e] = i));
    return z.Util._prepareToStringify(a);
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
    return this._getCache(lr, this._getStage);
  }
  _getStage() {
    const t = this.getParent();
    return t ? t.getStage() : null;
  }
  fire(t, e = {}, i) {
    return e.target = e.target || this, i ? this._fireAndBubble(t, e) : this._fire(t, e), this;
  }
  getAbsoluteTransform(t) {
    return t ? this._getAbsoluteTransform(t) : this._getCache(Tt, this._getAbsoluteTransform);
  }
  _getAbsoluteTransform(t) {
    let e;
    if (t)
      return e = new z.Transform(), this._eachAncestorReverse(function(i) {
        const n = i.transformsEnabled();
        n === "all" ? e.multiply(i.getTransform()) : n === "position" && e.translate(i.x() - i.offsetX(), i.y() - i.offsetY());
      }, t), e;
    {
      e = this._cache.get(Tt) || new z.Transform(), this.parent ? this.parent.getAbsoluteTransform().copyInto(e) : e.reset();
      const i = this.transformsEnabled();
      if (i === "all")
        e.multiply(this.getTransform());
      else if (i === "position") {
        const n = this.attrs.x || 0, r = this.attrs.y || 0, s = this.attrs.offsetX || 0, a = this.attrs.offsetY || 0;
        e.translate(n - s, r - a);
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
    return this._getCache($t, this._getTransform);
  }
  _getTransform() {
    var t, e;
    const i = this._cache.get($t) || new z.Transform();
    i.reset();
    const n = this.x(), r = this.y(), s = Gt.Konva.getAngle(this.rotation()), a = (t = this.attrs.scaleX) !== null && t !== void 0 ? t : 1, o = (e = this.attrs.scaleY) !== null && e !== void 0 ? e : 1, l = this.attrs.skewX || 0, u = this.attrs.skewY || 0, _ = this.attrs.offsetX || 0, p = this.attrs.offsetY || 0;
    return (n !== 0 || r !== 0) && i.translate(n, r), s !== 0 && i.rotate(s), (l !== 0 || u !== 0) && i.skew(l, u), (a !== 1 || o !== 1) && i.scale(a, o), (_ !== 0 || p !== 0) && i.translate(-1 * _, -1 * p), i.dirty = !1, i;
  }
  clone(t) {
    let e = z.Util.cloneObject(this.attrs), i, n, r, s, a;
    for (i in t)
      e[i] = t[i];
    const o = new this.constructor(e);
    for (i in this.eventListeners)
      for (n = this.eventListeners[i], r = n.length, s = 0; s < r; s++)
        a = n[s], a.name.indexOf(Aa) < 0 && (o.eventListeners[i] || (o.eventListeners[i] = []), o.eventListeners[i].push(a));
    return o;
  }
  _toKonvaCanvas(t) {
    t = t || {};
    const e = this.getClientRect(), i = this.getStage(), n = t.x !== void 0 ? t.x : Math.floor(e.x), r = t.y !== void 0 ? t.y : Math.floor(e.y), s = t.pixelRatio || 1, a = new ce.SceneCanvas({
      width: t.width || Math.ceil(e.width) || (i ? i.width() : 0),
      height: t.height || Math.ceil(e.height) || (i ? i.height() : 0),
      pixelRatio: s
    }), o = a.getContext(), l = new ce.SceneCanvas({
      width: a.width / a.pixelRatio + Math.abs(n),
      height: a.height / a.pixelRatio + Math.abs(r),
      pixelRatio: a.pixelRatio
    });
    return t.imageSmoothingEnabled === !1 && (o._context.imageSmoothingEnabled = !1), o.save(), (n || r) && o.translate(-1 * n, -1 * r), this.drawScene(a, void 0, l), o.restore(), a;
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
    return this.attrs.dragDistance !== void 0 ? this.attrs.dragDistance : this.parent ? this.parent.getDragDistance() : Gt.Konva.dragDistance;
  }
  _off(t, e, i) {
    let n = this.eventListeners[t], r, s, a;
    for (r = 0; r < n.length; r++)
      if (s = n[r].name, a = n[r].handler, (s !== "konva" || e === "konva") && (!e || s === e) && (!i || i === a)) {
        if (n.splice(r, 1), n.length === 0) {
          delete this.eventListeners[t];
          break;
        }
        r--;
      }
  }
  _fireChangeEvent(t, e, i) {
    this._fire(t + wa, {
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
    const i = this[or + z.Util._capitalize(t)];
    return z.Util._isFunction(i) ? i.call(this, e) : this._setAttr(t, e), this;
  }
  _requestDraw() {
    if (Gt.Konva.autoDrawEnabled) {
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
    e && this.nodeType === hr && (e.target = this);
    const n = [
      ka,
      Pa,
      Ea,
      Ta,
      Ma,
      Ra
    ];
    if (!(n.indexOf(t) !== -1 && (i && (this === i || this.isAncestorOf && this.isAncestorOf(i)) || this.nodeType === "Stage" && !i))) {
      this._fire(t, e);
      const s = n.indexOf(t) !== -1 && i && i.isAncestorOf && i.isAncestorOf(this) && !i.isAncestorOf(this.parent);
      (e && !e.cancelBubble || !e) && this.parent && this.parent.isListening() && !s && (i && i.parent ? this._fireAndBubble.call(this.parent, t, e, i) : this._fireAndBubble.call(this.parent, t, e));
    }
  }
  _getProtoListeners(t) {
    var e, i, n;
    const r = (e = this._cache.get(je)) !== null && e !== void 0 ? e : {};
    let s = r == null ? void 0 : r[t];
    if (s === void 0) {
      s = [];
      let a = Object.getPrototypeOf(this);
      for (; a; ) {
        const o = (n = (i = a.eventListeners) === null || i === void 0 ? void 0 : i[t]) !== null && n !== void 0 ? n : [];
        s.push(...o), a = Object.getPrototypeOf(a);
      }
      r[t] = s, this._cache.set(je, r);
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
    bt.DD._dragElements.set(this._id, {
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
      if (!(!(t.evt.button !== void 0) || Gt.Konva.dragButtons.indexOf(t.evt.button) >= 0) || this.isDragging())
        return;
      let n = !1;
      bt.DD._dragElements.forEach((r) => {
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
      const e = bt.DD._dragElements.get(this._id), i = e && e.dragStatus === "dragging", n = e && e.dragStatus === "ready";
      i ? this.stopDrag() : n && bt.DD._dragElements.delete(this._id);
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
    let i = D.prototype.getClassName.call(t), n = t.children, r, s, a;
    e && (t.attrs.container = e), Gt.Konva[i] || (z.Util.warn('Can not find a node with class name "' + i + '". Fallback to "Shape".'), i = "Shape");
    const o = Gt.Konva[i];
    if (r = new o(t.attrs), n)
      for (s = n.length, a = 0; a < s; a++)
        r.add(D._createNode(n[a]));
    return r;
  }
}
et.Node = D;
D.prototype.nodeType = "Node";
D.prototype._attrsAffectingSize = [];
D.prototype.eventListeners = {};
D.prototype.on.call(D.prototype, Oa, function() {
  if (this._batchingTransformChange) {
    this._needClearTransformCache = !0;
    return;
  }
  this._clearCache($t), this._clearSelfAndDescendantCache(Tt);
});
D.prototype.on.call(D.prototype, "visibleChange.konva", function() {
  this._clearSelfAndDescendantCache(_n);
});
D.prototype.on.call(D.prototype, "listeningChange.konva", function() {
  this._clearSelfAndDescendantCache(pn);
});
D.prototype.on.call(D.prototype, "opacityChange.konva", function() {
  this._clearSelfAndDescendantCache(Qe);
});
const J = Ue.Factory.addGetterSetter;
J(D, "zIndex");
J(D, "absolutePosition");
J(D, "position");
J(D, "x", 0, (0, ht.getNumberValidator)());
J(D, "y", 0, (0, ht.getNumberValidator)());
J(D, "globalCompositeOperation", "source-over", (0, ht.getStringValidator)());
J(D, "opacity", 1, (0, ht.getNumberValidator)());
J(D, "name", "", (0, ht.getStringValidator)());
J(D, "id", "", (0, ht.getStringValidator)());
J(D, "rotation", 0, (0, ht.getNumberValidator)());
Ue.Factory.addComponentsGetterSetter(D, "scale", ["x", "y"]);
J(D, "scaleX", 1, (0, ht.getNumberValidator)());
J(D, "scaleY", 1, (0, ht.getNumberValidator)());
Ue.Factory.addComponentsGetterSetter(D, "skew", ["x", "y"]);
J(D, "skewX", 0, (0, ht.getNumberValidator)());
J(D, "skewY", 0, (0, ht.getNumberValidator)());
Ue.Factory.addComponentsGetterSetter(D, "offset", ["x", "y"]);
J(D, "offsetX", 0, (0, ht.getNumberValidator)());
J(D, "offsetY", 0, (0, ht.getNumberValidator)());
J(D, "dragDistance", void 0, (0, ht.getNumberValidator)());
J(D, "width", 0, (0, ht.getNumberValidator)());
J(D, "height", 0, (0, ht.getNumberValidator)());
J(D, "listening", !0, (0, ht.getBooleanValidator)());
J(D, "preventDefault", !0, (0, ht.getBooleanValidator)());
J(D, "filters", void 0, function(h) {
  return this._filterUpToDate = !1, h;
});
J(D, "visible", !0, (0, ht.getBooleanValidator)());
J(D, "transformsEnabled", "all", (0, ht.getStringValidator)());
J(D, "size");
J(D, "dragBoundFunc");
J(D, "draggable", !1, (0, ht.getBooleanValidator)());
Ue.Factory.backCompat(D, {
  rotateDeg: "rotate",
  setRotationDeg: "setRotation",
  getRotationDeg: "getRotation"
});
var Zt = {};
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.Container = void 0;
const ve = V, rn = et, di = $;
class te extends rn.Node {
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
    const t = rn.Node.prototype.toObject.call(this);
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
    const e = rn.Node.prototype.clone.call(this, t);
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
    const n = this.getLayer(), r = t || n && n.getCanvas(), s = r && r.getContext(), a = this._getCanvasCache(), o = a && a.scene, l = r && r.isCache;
    if (!this.isVisible() && !l)
      return this;
    if (o) {
      s.save();
      const u = this.getAbsoluteTransform(e).getMatrix();
      s.transform(u[0], u[1], u[2], u[3], u[4], u[5]), this._drawCachedSceneCanvas(s), s.restore();
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
      const o = this.getAbsoluteTransform(e).getMatrix();
      r.transform(o[0], o[1], o[2], o[3], o[4], o[5]), this._drawCachedHitCanvas(r), r.restore();
    } else
      this._drawChildren("drawHit", n, e);
    return this;
  }
  _drawChildren(t, e, i, n) {
    var r;
    const s = e && e.getContext(), a = this.clipWidth(), o = this.clipHeight(), l = this.clipFunc(), u = typeof a == "number" && typeof o == "number" || l, _ = i === this;
    if (u) {
      s.save();
      const g = this.getAbsoluteTransform(i);
      let d = g.getMatrix();
      s.transform(d[0], d[1], d[2], d[3], d[4], d[5]), s.beginPath();
      let m;
      if (l)
        m = l.call(this, s, this);
      else {
        const y = this.clipX(), S = this.clipY();
        s.rect(y || 0, S || 0, a, o);
      }
      s.clip.apply(s, m), d = g.copy().invert().getMatrix(), s.transform(d[0], d[1], d[2], d[3], d[4], d[5]);
    }
    const p = !_ && this.globalCompositeOperation() !== "source-over" && t === "drawScene";
    p && (s.save(), s._applyGlobalCompositeOperation(this)), (r = this.children) === null || r === void 0 || r.forEach(function(g) {
      g[t](e, i, n);
    }), p && s.restore(), u && s.restore();
  }
  getClientRect(t = {}) {
    var e;
    const i = t.skipTransform, n = t.relativeTo;
    let r, s, a, o, l = {
      x: 1 / 0,
      y: 1 / 0,
      width: 0,
      height: 0
    };
    const u = this;
    (e = this.children) === null || e === void 0 || e.forEach(function(g) {
      if (!g.visible())
        return;
      const d = g.getClientRect({
        relativeTo: u,
        skipShadow: t.skipShadow,
        skipStroke: t.skipStroke
      });
      d.width === 0 && d.height === 0 || (r === void 0 ? (r = d.x, s = d.y, a = d.x + d.width, o = d.y + d.height) : (r = Math.min(r, d.x), s = Math.min(s, d.y), a = Math.max(a, d.x + d.width), o = Math.max(o, d.y + d.height)));
    });
    const _ = this.find("Shape");
    let p = !1;
    for (let g = 0; g < _.length; g++)
      if (_[g]._isVisible(this)) {
        p = !0;
        break;
      }
    return p && r !== void 0 ? l = {
      x: r,
      y: s,
      width: a - r,
      height: o - s
    } : l = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, i ? l : this._transformedRect(l, n);
  }
}
Zt.Container = te;
ve.Factory.addComponentsGetterSetter(te, "clip", [
  "x",
  "y",
  "width",
  "height"
]);
ve.Factory.addGetterSetter(te, "clipX", void 0, (0, di.getNumberValidator)());
ve.Factory.addGetterSetter(te, "clipY", void 0, (0, di.getNumberValidator)());
ve.Factory.addGetterSetter(te, "clipWidth", void 0, (0, di.getNumberValidator)());
ve.Factory.addGetterSetter(te, "clipHeight", void 0, (0, di.getNumberValidator)());
ve.Factory.addGetterSetter(te, "clipFunc");
var Kr = {}, Bt = {};
Object.defineProperty(Bt, "__esModule", { value: !0 });
Bt.getCapturedShape = Ga;
Bt.createEvent = Mn;
Bt.hasPointerCapture = $a;
Bt.setPointerCapture = Da;
Bt.releaseCapture = Jr;
const La = B, $e = /* @__PURE__ */ new Map(), qr = La.Konva._global.PointerEvent !== void 0;
function Ga(h) {
  return $e.get(h);
}
function Mn(h) {
  return {
    evt: h,
    pointerId: h.pointerId
  };
}
function $a(h, t) {
  return $e.get(h) === t;
}
function Da(h, t) {
  Jr(h), t.getStage() && ($e.set(h, t), qr && t._fire("gotpointercapture", Mn(new PointerEvent("gotpointercapture"))));
}
function Jr(h, t) {
  const e = $e.get(h);
  if (!e)
    return;
  const i = e.getStage();
  i && i.content, $e.delete(h), qr && e._fire("lostpointercapture", Mn(new PointerEvent("lostpointercapture")));
}
(function(h) {
  Object.defineProperty(h, "__esModule", { value: !0 }), h.Stage = h.stages = void 0;
  const t = nt, e = V, i = Zt, n = B, r = St, s = ci, a = B, o = Bt, l = "Stage", u = "string", _ = "px", p = "mouseout", g = "mouseleave", d = "mouseover", m = "mouseenter", y = "mousemove", S = "mousedown", w = "mouseup", c = "pointermove", f = "pointerdown", b = "pointerup", x = "pointercancel", P = "lostpointercapture", v = "pointerout", E = "pointerleave", A = "pointerover", T = "pointerenter", M = "contextmenu", F = "touchstart", L = "touchend", O = "touchmove", X = "touchcancel", j = "wheel", k = 5, U = [
    [m, "_pointerenter"],
    [S, "_pointerdown"],
    [y, "_pointermove"],
    [w, "_pointerup"],
    [g, "_pointerleave"],
    [F, "_pointerdown"],
    [O, "_pointermove"],
    [L, "_pointerup"],
    [X, "_pointercancel"],
    [d, "_pointerover"],
    [j, "_wheel"],
    [M, "_contextmenu"],
    [f, "_pointerdown"],
    [c, "_pointermove"],
    [b, "_pointerup"],
    [x, "_pointercancel"],
    [E, "_pointerleave"],
    [P, "_lostpointercapture"]
  ], I = {
    mouse: {
      [v]: p,
      [E]: g,
      [A]: d,
      [T]: m,
      [c]: y,
      [f]: S,
      [b]: w,
      [x]: "mousecancel",
      pointerclick: "click",
      pointerdblclick: "dblclick"
    },
    touch: {
      [v]: "touchout",
      [E]: "touchleave",
      [A]: "touchover",
      [T]: "touchenter",
      [c]: O,
      [f]: F,
      [b]: L,
      [x]: X,
      pointerclick: "tap",
      pointerdblclick: "dbltap"
    },
    pointer: {
      [v]: v,
      [E]: E,
      [A]: A,
      [T]: T,
      [c]: c,
      [f]: f,
      [b]: b,
      [x]: x,
      pointerclick: "pointerclick",
      pointerdblclick: "pointerdblclick"
    }
  }, N = (mt) => mt.indexOf("pointer") >= 0 ? "pointer" : mt.indexOf("touch") >= 0 ? "touch" : "mouse", H = (mt) => {
    const C = N(mt);
    if (C === "pointer")
      return n.Konva.pointerEventsEnabled && I.pointer;
    if (C === "touch")
      return I.touch;
    if (C === "mouse")
      return I.mouse;
  };
  function it(mt = {}) {
    return (mt.clipFunc || mt.clipWidth || mt.clipHeight) && t.Util.warn("Stage does not support clipping. Please use clip for Layers or Groups."), mt;
  }
  const oe = "Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);";
  h.stages = [];
  class kt extends i.Container {
    constructor(C) {
      super(it(C)), this._pointerPositions = [], this._changedPointerPositions = [], this._buildDOM(), this._bindContentEvents(), h.stages.push(this), this.on("widthChange.konva heightChange.konva", this._resizeDOM), this.on("visibleChange.konva", this._checkVisibility), this.on("clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva", () => {
        it(this.attrs);
      }), this._checkVisibility();
    }
    _validateAdd(C) {
      const R = C.getType() === "Layer", G = C.getType() === "FastLayer";
      R || G || t.Util.throw("You may only add layers to the stage.");
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
          const G = C.slice(1);
          C = document.getElementsByClassName(G)[0];
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
      for (let G = 0; G < R; G++)
        C[G].clear();
      return this;
    }
    clone(C) {
      return C || (C = {}), C.container = typeof document < "u" && document.createElement("div"), i.Container.prototype.clone.call(this, C);
    }
    destroy() {
      super.destroy();
      const C = this.content;
      C && t.Util._isInDocument(C) && this.container().removeChild(C);
      const R = h.stages.indexOf(this);
      return R > -1 && h.stages.splice(R, 1), t.Util.releaseCanvas(this.bufferCanvas._canvas, this.bufferHitCanvas._canvas), this;
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
      const R = new r.SceneCanvas({
        width: C.width,
        height: C.height,
        pixelRatio: C.pixelRatio || 1
      }), G = R.getContext()._context, tt = this.children;
      return (C.x || C.y) && G.translate(-1 * C.x, -1 * C.y), tt.forEach(function(q) {
        if (!q.isVisible())
          return;
        const at = q._toKonvaCanvas(C);
        G.drawImage(at._canvas, C.x, C.y, at.getWidth() / at.getPixelRatio(), at.getHeight() / at.getPixelRatio());
      }), R;
    }
    getIntersection(C) {
      if (!C)
        return null;
      const R = this.children, G = R.length, tt = G - 1;
      for (let q = tt; q >= 0; q--) {
        const at = R[q].getIntersection(C);
        if (at)
          return at;
      }
      return null;
    }
    _resizeDOM() {
      const C = this.width(), R = this.height();
      this.content && (this.content.style.width = C + _, this.content.style.height = R + _), this.bufferCanvas.setSize(C, R), this.bufferHitCanvas.setSize(C, R), this.children.forEach((G) => {
        G.setSize({ width: C, height: R }), G.draw();
      });
    }
    add(C, ...R) {
      if (arguments.length > 1) {
        for (let tt = 0; tt < arguments.length; tt++)
          this.add(arguments[tt]);
        return this;
      }
      super.add(C);
      const G = this.children.length;
      return G > k && t.Util.warn("The stage has " + G + " layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group."), C.setSize({ width: this.width(), height: this.height() }), C.draw(), n.Konva.isBrowser && this.content.appendChild(C.canvas._canvas), this;
    }
    getParent() {
      return null;
    }
    getLayer() {
      return null;
    }
    hasPointerCapture(C) {
      return o.hasPointerCapture(C, this);
    }
    setPointerCapture(C) {
      o.setPointerCapture(C, this);
    }
    releaseCapture(C) {
      o.releaseCapture(C, this);
    }
    getLayers() {
      return this.children;
    }
    _bindContentEvents() {
      n.Konva.isBrowser && U.forEach(([C, R]) => {
        this.content.addEventListener(C, (G) => {
          this[R](G);
        }, { passive: !1 });
      });
    }
    _pointerenter(C) {
      this.setPointersPositions(C);
      const R = H(C.type);
      R && this._fire(R.pointerenter, {
        evt: C,
        target: this,
        currentTarget: this
      });
    }
    _pointerover(C) {
      this.setPointersPositions(C);
      const R = H(C.type);
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
      const R = H(C.type), G = N(C.type);
      if (!R)
        return;
      this.setPointersPositions(C);
      const tt = this._getTargetShape(G), q = !(n.Konva.isDragging() || n.Konva.isTransforming()) || n.Konva.hitOnDragEnabled;
      tt && q ? (tt._fireAndBubble(R.pointerout, { evt: C }), tt._fireAndBubble(R.pointerleave, { evt: C }), this._fire(R.pointerleave, {
        evt: C,
        target: this,
        currentTarget: this
      }), this[G + "targetShape"] = null) : q && (this._fire(R.pointerleave, {
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
      const R = H(C.type), G = N(C.type);
      if (!R)
        return;
      this.setPointersPositions(C);
      let tt = !1;
      this._changedPointerPositions.forEach((q) => {
        const at = this.getIntersection(q);
        if (s.DD.justDragged = !1, n.Konva["_" + G + "ListenClick"] = !0, !at || !at.isListening()) {
          this[G + "ClickStartShape"] = void 0;
          return;
        }
        n.Konva.capturePointerEventsEnabled && at.setPointerCapture(q.id), this[G + "ClickStartShape"] = at, at._fireAndBubble(R.pointerdown, {
          evt: C,
          pointerId: q.id
        }), tt = !0;
        const yt = C.type.indexOf("touch") >= 0;
        at.preventDefault() && C.cancelable && yt && C.preventDefault();
      }), tt || this._fire(R.pointerdown, {
        evt: C,
        target: this,
        currentTarget: this,
        pointerId: this._pointerPositions[0].id
      });
    }
    _pointermove(C) {
      const R = H(C.type), G = N(C.type);
      if (!R || (n.Konva.isDragging() && s.DD.node.preventDefault() && C.cancelable && C.preventDefault(), this.setPointersPositions(C), !(!(n.Konva.isDragging() || n.Konva.isTransforming()) || n.Konva.hitOnDragEnabled)))
        return;
      const q = {};
      let at = !1;
      const yt = this._getTargetShape(G);
      this._changedPointerPositions.forEach((Lt) => {
        const Z = o.getCapturedShape(Lt.id) || this.getIntersection(Lt), he = Lt.id, Pt = { evt: C, pointerId: he }, le = yt !== Z;
        if (le && yt && (yt._fireAndBubble(R.pointerout, { ...Pt }, Z), yt._fireAndBubble(R.pointerleave, { ...Pt }, Z)), Z) {
          if (q[Z._id])
            return;
          q[Z._id] = !0;
        }
        Z && Z.isListening() ? (at = !0, le && (Z._fireAndBubble(R.pointerover, { ...Pt }, yt), Z._fireAndBubble(R.pointerenter, { ...Pt }, yt), this[G + "targetShape"] = Z), Z._fireAndBubble(R.pointermove, { ...Pt })) : yt && (this._fire(R.pointerover, {
          evt: C,
          target: this,
          currentTarget: this,
          pointerId: he
        }), this[G + "targetShape"] = null);
      }), at || this._fire(R.pointermove, {
        evt: C,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id
      });
    }
    _pointerup(C) {
      const R = H(C.type), G = N(C.type);
      if (!R)
        return;
      this.setPointersPositions(C);
      const tt = this[G + "ClickStartShape"], q = this[G + "ClickEndShape"], at = {};
      let yt = !1;
      this._changedPointerPositions.forEach((Lt) => {
        const Z = o.getCapturedShape(Lt.id) || this.getIntersection(Lt);
        if (Z) {
          if (Z.releaseCapture(Lt.id), at[Z._id])
            return;
          at[Z._id] = !0;
        }
        const he = Lt.id, Pt = { evt: C, pointerId: he };
        let le = !1;
        n.Konva["_" + G + "InDblClickWindow"] ? (le = !0, clearTimeout(this[G + "DblTimeout"])) : s.DD.justDragged || (n.Konva["_" + G + "InDblClickWindow"] = !0, clearTimeout(this[G + "DblTimeout"])), this[G + "DblTimeout"] = setTimeout(function() {
          n.Konva["_" + G + "InDblClickWindow"] = !1;
        }, n.Konva.dblClickWindow), Z && Z.isListening() ? (yt = !0, this[G + "ClickEndShape"] = Z, Z._fireAndBubble(R.pointerup, { ...Pt }), n.Konva["_" + G + "ListenClick"] && tt && tt === Z && (Z._fireAndBubble(R.pointerclick, { ...Pt }), le && q && q === Z && Z._fireAndBubble(R.pointerdblclick, { ...Pt }))) : (this[G + "ClickEndShape"] = null, n.Konva["_" + G + "ListenClick"] && this._fire(R.pointerclick, {
          evt: C,
          target: this,
          currentTarget: this,
          pointerId: he
        }), le && this._fire(R.pointerdblclick, {
          evt: C,
          target: this,
          currentTarget: this,
          pointerId: he
        }));
      }), yt || this._fire(R.pointerup, {
        evt: C,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id
      }), n.Konva["_" + G + "ListenClick"] = !1, C.cancelable && G !== "touch" && G !== "pointer" && C.preventDefault();
    }
    _contextmenu(C) {
      this.setPointersPositions(C);
      const R = this.getIntersection(this.getPointerPosition());
      R && R.isListening() ? R._fireAndBubble(M, { evt: C }) : this._fire(M, {
        evt: C,
        target: this,
        currentTarget: this
      });
    }
    _wheel(C) {
      this.setPointersPositions(C);
      const R = this.getIntersection(this.getPointerPosition());
      R && R.isListening() ? R._fireAndBubble(j, { evt: C }) : this._fire(j, {
        evt: C,
        target: this,
        currentTarget: this
      });
    }
    _pointercancel(C) {
      this.setPointersPositions(C);
      const R = o.getCapturedShape(C.pointerId) || this.getIntersection(this.getPointerPosition());
      R && R._fireAndBubble(b, o.createEvent(C)), o.releaseCapture(C.pointerId);
    }
    _lostpointercapture(C) {
      o.releaseCapture(C.pointerId);
    }
    setPointersPositions(C) {
      const R = this._getContentPosition();
      let G = null, tt = null;
      C = C || window.event, C.touches !== void 0 ? (this._pointerPositions = [], this._changedPointerPositions = [], Array.prototype.forEach.call(C.touches, (q) => {
        this._pointerPositions.push({
          id: q.identifier,
          x: (q.clientX - R.left) / R.scaleX,
          y: (q.clientY - R.top) / R.scaleY
        });
      }), Array.prototype.forEach.call(C.changedTouches || C.touches, (q) => {
        this._changedPointerPositions.push({
          id: q.identifier,
          x: (q.clientX - R.left) / R.scaleX,
          y: (q.clientY - R.top) / R.scaleY
        });
      })) : (G = (C.clientX - R.left) / R.scaleX, tt = (C.clientY - R.top) / R.scaleY, this.pointerPos = {
        x: G,
        y: tt
      }, this._pointerPositions = [{ x: G, y: tt, id: t.Util._getFirstPointerId(C) }], this._changedPointerPositions = [
        { x: G, y: tt, id: t.Util._getFirstPointerId(C) }
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
      if (this.bufferCanvas = new r.SceneCanvas({
        width: this.width(),
        height: this.height()
      }), this.bufferHitCanvas = new r.HitCanvas({
        pixelRatio: 1,
        width: this.width(),
        height: this.height()
      }), !n.Konva.isBrowser)
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
  h.Stage = kt, kt.prototype.nodeType = l, (0, a._registerNode)(kt), e.Factory.addGetterSetter(kt, "container"), n.Konva.isBrowser && document.addEventListener("visibilitychange", () => {
    h.stages.forEach((mt) => {
      mt.batchDraw();
    });
  });
})(Kr);
var Be = {}, dt = {};
(function(h) {
  Object.defineProperty(h, "__esModule", { value: !0 }), h.Shape = h.shapes = void 0;
  const t = B, e = nt, i = V, n = et, r = $, s = B, a = Bt, o = "hasShadow", l = "shadowRGBA", u = "patternImage", _ = "linearGradient", p = "radialGradient";
  let g;
  function d() {
    return g || (g = e.Util.createCanvasElement().getContext("2d"), g);
  }
  h.shapes = {};
  function m(E) {
    const A = this.attrs.fillRule;
    A ? E.fill(A) : E.fill();
  }
  function y(E) {
    E.stroke();
  }
  function S(E) {
    const A = this.attrs.fillRule;
    A ? E.fill(A) : E.fill();
  }
  function w(E) {
    E.stroke();
  }
  function c() {
    this._clearCache(o);
  }
  function f() {
    this._clearCache(l);
  }
  function b() {
    this._clearCache(u);
  }
  function x() {
    this._clearCache(_);
  }
  function P() {
    this._clearCache(p);
  }
  class v extends n.Node {
    constructor(A) {
      super(A);
      let T;
      for (; T = e.Util.getRandomColor(), !(T && !(T in h.shapes)); )
        ;
      this.colorKey = T, h.shapes[T] = this;
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
      return this._getCache(o, this._hasShadow);
    }
    _hasShadow() {
      return this.shadowEnabled() && this.shadowOpacity() !== 0 && !!(this.shadowColor() || this.shadowBlur() || this.shadowOffsetX() || this.shadowOffsetY());
    }
    _getFillPattern() {
      return this._getCache(u, this.__getFillPattern);
    }
    __getFillPattern() {
      if (this.fillPatternImage()) {
        const T = d().createPattern(this.fillPatternImage(), this.fillPatternRepeat() || "repeat");
        if (T && T.setTransform) {
          const M = new e.Transform();
          M.translate(this.fillPatternX(), this.fillPatternY()), M.rotate(t.Konva.getAngle(this.fillPatternRotation())), M.scale(this.fillPatternScaleX(), this.fillPatternScaleY()), M.translate(-1 * this.fillPatternOffsetX(), -1 * this.fillPatternOffsetY());
          const F = M.getMatrix(), L = typeof DOMMatrix > "u" ? {
            a: F[0],
            b: F[1],
            c: F[2],
            d: F[3],
            e: F[4],
            f: F[5]
          } : new DOMMatrix(F);
          T.setTransform(L);
        }
        return T;
      }
    }
    _getLinearGradient() {
      return this._getCache(_, this.__getLinearGradient);
    }
    __getLinearGradient() {
      const A = this.fillLinearGradientColorStops();
      if (A) {
        const T = d(), M = this.fillLinearGradientStartPoint(), F = this.fillLinearGradientEndPoint(), L = T.createLinearGradient(M.x, M.y, F.x, F.y);
        for (let O = 0; O < A.length; O += 2)
          L.addColorStop(A[O], A[O + 1]);
        return L;
      }
    }
    _getRadialGradient() {
      return this._getCache(p, this.__getRadialGradient);
    }
    __getRadialGradient() {
      const A = this.fillRadialGradientColorStops();
      if (A) {
        const T = d(), M = this.fillRadialGradientStartPoint(), F = this.fillRadialGradientEndPoint(), L = T.createRadialGradient(M.x, M.y, this.fillRadialGradientStartRadius(), F.x, F.y, this.fillRadialGradientEndRadius());
        for (let O = 0; O < A.length; O += 2)
          L.addColorStop(A[O], A[O + 1]);
        return L;
      }
    }
    getShadowRGBA() {
      return this._getCache(l, this._getShadowRGBA);
    }
    _getShadowRGBA() {
      if (!this.hasShadow())
        return;
      const A = e.Util.colorToRGBA(this.shadowColor());
      if (A)
        return "rgba(" + A.r + "," + A.g + "," + A.b + "," + A.a * (this.shadowOpacity() || 1) + ")";
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
      const A = this.hitStrokeWidth();
      return A === "auto" ? this.hasStroke() : this.strokeEnabled() && !!A;
    }
    intersects(A) {
      const T = this.getStage();
      if (!T)
        return !1;
      const M = T.bufferHitCanvas;
      return M.getContext().clear(), this.drawHit(M, void 0, !0), M.context.getImageData(Math.round(A.x), Math.round(A.y), 1, 1).data[3] > 0;
    }
    destroy() {
      return n.Node.prototype.destroy.call(this), delete h.shapes[this.colorKey], delete this.colorKey, this;
    }
    _useBufferCanvas(A) {
      var T;
      if (!((T = this.attrs.perfectDrawEnabled) !== null && T !== void 0 ? T : !0))
        return !1;
      const F = A || this.hasFill(), L = this.hasStroke(), O = this.getAbsoluteOpacity() !== 1;
      if (F && L && O)
        return !0;
      const X = this.hasShadow(), j = this.shadowForStrokeEnabled();
      return !!(F && L && X && j);
    }
    setStrokeHitEnabled(A) {
      e.Util.warn("strokeHitEnabled property is deprecated. Please use hitStrokeWidth instead."), A ? this.hitStrokeWidth("auto") : this.hitStrokeWidth(0);
    }
    getStrokeHitEnabled() {
      return this.hitStrokeWidth() !== 0;
    }
    getSelfRect() {
      const A = this.size();
      return {
        x: this._centroid ? -A.width / 2 : 0,
        y: this._centroid ? -A.height / 2 : 0,
        width: A.width,
        height: A.height
      };
    }
    getClientRect(A = {}) {
      let T = !1, M = this.getParent();
      for (; M; ) {
        if (M.isCached()) {
          T = !0;
          break;
        }
        M = M.getParent();
      }
      const F = A.skipTransform, L = A.relativeTo || T && this.getStage() || void 0, O = this.getSelfRect(), j = !A.skipStroke && this.hasStroke() && this.strokeWidth() || 0, k = O.width + j, U = O.height + j, I = !A.skipShadow && this.hasShadow(), N = I ? this.shadowOffsetX() : 0, H = I ? this.shadowOffsetY() : 0, it = k + Math.abs(N), oe = U + Math.abs(H), kt = I && this.shadowBlur() || 0, mt = it + kt * 2, C = oe + kt * 2, R = {
        width: mt,
        height: C,
        x: -(j / 2 + kt) + Math.min(N, 0) + O.x,
        y: -(j / 2 + kt) + Math.min(H, 0) + O.y
      };
      return F ? R : this._transformedRect(R, L);
    }
    drawScene(A, T, M) {
      const F = this.getLayer(), L = A || F.getCanvas(), O = L.getContext(), X = this._getCanvasCache(), j = this.getSceneFunc(), k = this.hasShadow();
      let U;
      const I = T === this;
      if (!this.isVisible() && !I)
        return this;
      if (X) {
        O.save();
        const N = this.getAbsoluteTransform(T).getMatrix();
        return O.transform(N[0], N[1], N[2], N[3], N[4], N[5]), this._drawCachedSceneCanvas(O), O.restore(), this;
      }
      if (!j)
        return this;
      if (O.save(), this._useBufferCanvas()) {
        U = this.getStage();
        const N = M || U.bufferCanvas, H = N.getContext();
        H.clear(), H.save(), H._applyLineJoin(this);
        const it = this.getAbsoluteTransform(T).getMatrix();
        H.transform(it[0], it[1], it[2], it[3], it[4], it[5]), j.call(this, H, this), H.restore();
        const oe = N.pixelRatio;
        k && O._applyShadow(this), O._applyOpacity(this), O._applyGlobalCompositeOperation(this), O.drawImage(N._canvas, N.x || 0, N.y || 0, N.width / oe, N.height / oe);
      } else {
        if (O._applyLineJoin(this), !I) {
          const N = this.getAbsoluteTransform(T).getMatrix();
          O.transform(N[0], N[1], N[2], N[3], N[4], N[5]), O._applyOpacity(this), O._applyGlobalCompositeOperation(this);
        }
        k && O._applyShadow(this), j.call(this, O, this);
      }
      return O.restore(), this;
    }
    drawHit(A, T, M = !1) {
      if (!this.shouldDrawHit(T, M))
        return this;
      const F = this.getLayer(), L = A || F.hitCanvas, O = L && L.getContext(), X = this.hitFunc() || this.sceneFunc(), j = this._getCanvasCache(), k = j && j.hit;
      if (this.colorKey || e.Util.warn("Looks like your canvas has a destroyed shape in it. Do not reuse shape after you destroyed it. If you want to reuse shape you should call remove() instead of destroy()"), k) {
        O.save();
        const I = this.getAbsoluteTransform(T).getMatrix();
        return O.transform(I[0], I[1], I[2], I[3], I[4], I[5]), this._drawCachedHitCanvas(O), O.restore(), this;
      }
      if (!X)
        return this;
      if (O.save(), O._applyLineJoin(this), !(this === T)) {
        const I = this.getAbsoluteTransform(T).getMatrix();
        O.transform(I[0], I[1], I[2], I[3], I[4], I[5]);
      }
      return X.call(this, O, this), O.restore(), this;
    }
    drawHitFromCache(A = 0) {
      const T = this._getCanvasCache(), M = this._getCachedSceneCanvas(), F = T.hit, L = F.getContext(), O = F.getWidth(), X = F.getHeight();
      L.clear(), L.drawImage(M._canvas, 0, 0, O, X);
      try {
        const j = L.getImageData(0, 0, O, X), k = j.data, U = k.length, I = e.Util._hexToRgb(this.colorKey);
        for (let N = 0; N < U; N += 4)
          k[N + 3] > A ? (k[N] = I.r, k[N + 1] = I.g, k[N + 2] = I.b, k[N + 3] = 255) : k[N + 3] = 0;
        L.putImageData(j, 0, 0);
      } catch (j) {
        e.Util.error("Unable to draw hit graph from cached scene canvas. " + j.message);
      }
      return this;
    }
    hasPointerCapture(A) {
      return a.hasPointerCapture(A, this);
    }
    setPointerCapture(A) {
      a.setPointerCapture(A, this);
    }
    releaseCapture(A) {
      a.releaseCapture(A, this);
    }
  }
  h.Shape = v, v.prototype._fillFunc = m, v.prototype._strokeFunc = y, v.prototype._fillFuncHit = S, v.prototype._strokeFuncHit = w, v.prototype._centroid = !1, v.prototype.nodeType = "Shape", (0, s._registerNode)(v), v.prototype.eventListeners = {}, v.prototype.on.call(v.prototype, "shadowColorChange.konva shadowBlurChange.konva shadowOffsetChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", c), v.prototype.on.call(v.prototype, "shadowColorChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", f), v.prototype.on.call(v.prototype, "fillPriorityChange.konva fillPatternImageChange.konva fillPatternRepeatChange.konva fillPatternScaleXChange.konva fillPatternScaleYChange.konva fillPatternOffsetXChange.konva fillPatternOffsetYChange.konva fillPatternXChange.konva fillPatternYChange.konva fillPatternRotationChange.konva", b), v.prototype.on.call(v.prototype, "fillPriorityChange.konva fillLinearGradientColorStopsChange.konva fillLinearGradientStartPointXChange.konva fillLinearGradientStartPointYChange.konva fillLinearGradientEndPointXChange.konva fillLinearGradientEndPointYChange.konva", x), v.prototype.on.call(v.prototype, "fillPriorityChange.konva fillRadialGradientColorStopsChange.konva fillRadialGradientStartPointXChange.konva fillRadialGradientStartPointYChange.konva fillRadialGradientEndPointXChange.konva fillRadialGradientEndPointYChange.konva fillRadialGradientStartRadiusChange.konva fillRadialGradientEndRadiusChange.konva", P), i.Factory.addGetterSetter(v, "stroke", void 0, (0, r.getStringOrGradientValidator)()), i.Factory.addGetterSetter(v, "strokeWidth", 2, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillAfterStrokeEnabled", !1), i.Factory.addGetterSetter(v, "hitStrokeWidth", "auto", (0, r.getNumberOrAutoValidator)()), i.Factory.addGetterSetter(v, "strokeHitEnabled", !0, (0, r.getBooleanValidator)()), i.Factory.addGetterSetter(v, "perfectDrawEnabled", !0, (0, r.getBooleanValidator)()), i.Factory.addGetterSetter(v, "shadowForStrokeEnabled", !0, (0, r.getBooleanValidator)()), i.Factory.addGetterSetter(v, "lineJoin"), i.Factory.addGetterSetter(v, "lineCap"), i.Factory.addGetterSetter(v, "sceneFunc"), i.Factory.addGetterSetter(v, "hitFunc"), i.Factory.addGetterSetter(v, "dash"), i.Factory.addGetterSetter(v, "dashOffset", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "shadowColor", void 0, (0, r.getStringValidator)()), i.Factory.addGetterSetter(v, "shadowBlur", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "shadowOpacity", 1, (0, r.getNumberValidator)()), i.Factory.addComponentsGetterSetter(v, "shadowOffset", ["x", "y"]), i.Factory.addGetterSetter(v, "shadowOffsetX", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "shadowOffsetY", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternImage"), i.Factory.addGetterSetter(v, "fill", void 0, (0, r.getStringOrGradientValidator)()), i.Factory.addGetterSetter(v, "fillPatternX", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternY", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillLinearGradientColorStops"), i.Factory.addGetterSetter(v, "strokeLinearGradientColorStops"), i.Factory.addGetterSetter(v, "fillRadialGradientStartRadius", 0), i.Factory.addGetterSetter(v, "fillRadialGradientEndRadius", 0), i.Factory.addGetterSetter(v, "fillRadialGradientColorStops"), i.Factory.addGetterSetter(v, "fillPatternRepeat", "repeat"), i.Factory.addGetterSetter(v, "fillEnabled", !0), i.Factory.addGetterSetter(v, "strokeEnabled", !0), i.Factory.addGetterSetter(v, "shadowEnabled", !0), i.Factory.addGetterSetter(v, "dashEnabled", !0), i.Factory.addGetterSetter(v, "strokeScaleEnabled", !0), i.Factory.addGetterSetter(v, "fillPriority", "color"), i.Factory.addComponentsGetterSetter(v, "fillPatternOffset", ["x", "y"]), i.Factory.addGetterSetter(v, "fillPatternOffsetX", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternOffsetY", 0, (0, r.getNumberValidator)()), i.Factory.addComponentsGetterSetter(v, "fillPatternScale", ["x", "y"]), i.Factory.addGetterSetter(v, "fillPatternScaleX", 1, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternScaleY", 1, (0, r.getNumberValidator)()), i.Factory.addComponentsGetterSetter(v, "fillLinearGradientStartPoint", [
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
  ]), i.Factory.addGetterSetter(v, "fillRadialGradientEndPointX", 0), i.Factory.addGetterSetter(v, "fillRadialGradientEndPointY", 0), i.Factory.addGetterSetter(v, "fillPatternRotation", 0), i.Factory.addGetterSetter(v, "fillRule", void 0, (0, r.getStringValidator)()), i.Factory.backCompat(v, {
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
})(dt);
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.Layer = void 0;
const Et = nt, sn = Zt, de = et, Rn = V, cr = St, Ia = $, Ua = dt, Ba = B, Va = "#", Ha = "beforeDraw", za = "draw", Qr = [
  { x: 0, y: 0 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 }
], Wa = Qr.length;
class Se extends sn.Container {
  constructor(t) {
    super(t), this.canvas = new cr.SceneCanvas(), this.hitCanvas = new cr.HitCanvas({
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
    de.Node.prototype.moveToTop.call(this);
    const t = this.getStage();
    return t && t.content && (t.content.removeChild(this.getNativeCanvasElement()), t.content.appendChild(this.getNativeCanvasElement())), !0;
  }
  moveUp() {
    if (!de.Node.prototype.moveUp.call(this))
      return !1;
    const e = this.getStage();
    return !e || !e.content ? !1 : (e.content.removeChild(this.getNativeCanvasElement()), this.index < e.children.length - 1 ? e.content.insertBefore(this.getNativeCanvasElement(), e.children[this.index + 1].getCanvas()._canvas) : e.content.appendChild(this.getNativeCanvasElement()), !0);
  }
  moveDown() {
    if (de.Node.prototype.moveDown.call(this)) {
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
    if (de.Node.prototype.moveToBottom.call(this)) {
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
    return de.Node.prototype.remove.call(this), t && t.parentNode && Et.Util._isInDocument(t) && t.parentNode.removeChild(t), this;
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
    return t = t || {}, t.width = t.width || this.getWidth(), t.height = t.height || this.getHeight(), t.x = t.x !== void 0 ? t.x : this.x(), t.y = t.y !== void 0 ? t.y : this.y(), de.Node.prototype._toKonvaCanvas.call(this, t);
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
      for (let n = 0; n < Wa; n++) {
        const r = Qr[n], s = this._getIntersection({
          x: t.x + r.x * e,
          y: t.y + r.y * e
        }), a = s.shape;
        if (a)
          return a;
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
      const r = Et.Util._rgbToHex(i[0], i[1], i[2]), s = Ua.shapes[Va + r];
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
    return this._fire(Ha, {
      node: this
    }), this.clearBeforeDraw() && r.getContext().clear(), sn.Container.prototype.drawScene.call(this, r, e, i), this._fire(za, {
      node: this
    }), this;
  }
  drawHit(t, e) {
    const i = this.getLayer(), n = t || i && i.hitCanvas;
    return i && i.clearBeforeDraw() && i.getHitCanvas().getContext().clear(), sn.Container.prototype.drawHit.call(this, n, e), this;
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
Be.Layer = Se;
Se.prototype.nodeType = "Layer";
(0, Ba._registerNode)(Se);
Rn.Factory.addGetterSetter(Se, "imageSmoothingEnabled", !0);
Rn.Factory.addGetterSetter(Se, "clearBeforeDraw", !0);
Rn.Factory.addGetterSetter(Se, "hitGraphEnabled", !0, (0, Ia.getBooleanValidator)());
var ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
ui.FastLayer = void 0;
const ja = nt, Ya = Be, Xa = B;
class Fn extends Ya.Layer {
  constructor(t) {
    super(t), this.listening(!1), ja.Util.warn('Konva.Fast layer is deprecated. Please use "new Konva.Layer({ listening: false })" instead.');
  }
}
ui.FastLayer = Fn;
Fn.prototype.nodeType = "FastLayer";
(0, Xa._registerNode)(Fn);
var Ce = {};
Object.defineProperty(Ce, "__esModule", { value: !0 });
Ce.Group = void 0;
const Ka = nt, qa = Zt, Ja = B;
class On extends qa.Container {
  _validateAdd(t) {
    const e = t.getType();
    e !== "Group" && e !== "Shape" && Ka.Util.throw("You may only add groups and shapes to groups.");
  }
}
Ce.Group = On;
On.prototype.nodeType = "Group";
(0, Ja._registerNode)(On);
var we = {};
Object.defineProperty(we, "__esModule", { value: !0 });
we.Animation = void 0;
const an = B, dr = nt, on = function() {
  return an.glob.performance && an.glob.performance.now ? function() {
    return an.glob.performance.now();
  } : function() {
    return (/* @__PURE__ */ new Date()).getTime();
  };
}();
class wt {
  constructor(t, e) {
    this.id = wt.animIdCounter++, this.frame = {
      time: 0,
      timeDiff: 0,
      lastTime: on(),
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
    const e = wt.animations, i = e.length;
    for (let n = 0; n < i; n++)
      if (e[n].id === this.id)
        return !0;
    return !1;
  }
  start() {
    return this.stop(), this.frame.timeDiff = 0, this.frame.lastTime = on(), wt._addAnimation(this), this;
  }
  stop() {
    return wt._removeAnimation(this), this;
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
      n._updateFrameObject(on());
      const a = r.length;
      let o;
      if (s ? o = s.call(n, n.frame) !== !1 : o = !0, !!o)
        for (let l = 0; l < a; l++) {
          const u = r[l];
          u._id !== void 0 && (t[u._id] = u);
        }
    }
    for (const i in t)
      t.hasOwnProperty(i) && t[i].batchDraw();
  }
  static _animationLoop() {
    const t = wt;
    t.animations.length ? (t._runFrames(), dr.Util.requestAnimFrame(t._animationLoop)) : t.animRunning = !1;
  }
  static _handleAnimation() {
    this.animRunning || (this.animRunning = !0, dr.Util.requestAnimFrame(this._animationLoop));
  }
}
we.Animation = wt;
wt.animations = [];
wt.animIdCounter = 0;
wt.animRunning = !1;
var Zr = {};
(function(h) {
  Object.defineProperty(h, "__esModule", { value: !0 }), h.Easings = h.Tween = void 0;
  const t = nt, e = we, i = et, n = B, r = {
    node: 1,
    duration: 1,
    easing: 1,
    onFinish: 1,
    yoyo: 1
  }, s = 1, a = 2, o = 3, l = ["fill", "stroke", "shadowColor"];
  let u = 0;
  class _ {
    constructor(d, m, y, S, w, c, f) {
      this.prop = d, this.propFunc = m, this.begin = S, this._pos = S, this.duration = c, this._change = 0, this.prevPos = 0, this.yoyo = f, this._time = 0, this._position = 0, this._startTime = 0, this._finish = 0, this.func = y, this._change = w - this.begin, this.pause();
    }
    fire(d) {
      const m = this[d];
      m && m();
    }
    setTime(d) {
      d > this.duration ? this.yoyo ? (this._time = this.duration, this.reverse()) : this.finish() : d < 0 ? this.yoyo ? (this._time = 0, this.play()) : this.reset() : (this._time = d, this.update());
    }
    getTime() {
      return this._time;
    }
    setPosition(d) {
      this.prevPos = this._pos, this.propFunc(d), this._pos = d;
    }
    getPosition(d) {
      return d === void 0 && (d = this._time), this.func(d, this.begin, this._change, this.duration);
    }
    play() {
      this.state = a, this._startTime = this.getTimer() - this._time, this.onEnterFrame(), this.fire("onPlay");
    }
    reverse() {
      this.state = o, this._time = this.duration - this._time, this._startTime = this.getTimer() - this._time, this.onEnterFrame(), this.fire("onReverse");
    }
    seek(d) {
      this.pause(), this._time = d, this.update(), this.fire("onSeek");
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
      const d = this.getTimer() - this._startTime;
      this.state === a ? this.setTime(d) : this.state === o && this.setTime(this.duration - d);
    }
    pause() {
      this.state = s, this.fire("onPause");
    }
    getTimer() {
      return (/* @__PURE__ */ new Date()).getTime();
    }
  }
  class p {
    constructor(d) {
      const m = this, y = d.node, S = y._id, w = d.easing || h.Easings.Linear, c = !!d.yoyo;
      let f, b;
      typeof d.duration > "u" ? f = 0.3 : d.duration === 0 ? f = 1e-3 : f = d.duration, this.node = y, this._id = u++;
      const x = y.getLayer() || (y instanceof n.Konva.Stage ? y.getLayers() : null);
      x || t.Util.error("Tween constructor have `node` that is not in a layer. Please add node into layer first."), this.anim = new e.Animation(function() {
        m.tween.onEnterFrame();
      }, x), this.tween = new _(b, function(P) {
        m._tweenFunc(P);
      }, w, 0, 1, f * 1e3, c), this._addListeners(), p.attrs[S] || (p.attrs[S] = {}), p.attrs[S][this._id] || (p.attrs[S][this._id] = {}), p.tweens[S] || (p.tweens[S] = {});
      for (b in d)
        r[b] === void 0 && this._addAttr(b, d[b]);
      this.reset(), this.onFinish = d.onFinish, this.onReset = d.onReset, this.onUpdate = d.onUpdate;
    }
    _addAttr(d, m) {
      const y = this.node, S = y._id;
      let w, c, f, b, x;
      const P = p.tweens[S][d];
      P && delete p.attrs[S][P][d];
      let v = y.getAttr(d);
      if (t.Util._isArray(m))
        if (w = [], c = Math.max(m.length, v.length), d === "points" && m.length !== v.length && (m.length > v.length ? (b = v, v = t.Util._prepareArrayForTween(v, m, y.closed())) : (f = m, m = t.Util._prepareArrayForTween(m, v, y.closed()))), d.indexOf("fill") === 0)
          for (let E = 0; E < c; E++)
            if (E % 2 === 0)
              w.push(m[E] - v[E]);
            else {
              const A = t.Util.colorToRGBA(v[E]);
              x = t.Util.colorToRGBA(m[E]), v[E] = A, w.push({
                r: x.r - A.r,
                g: x.g - A.g,
                b: x.b - A.b,
                a: x.a - A.a
              });
            }
        else
          for (let E = 0; E < c; E++)
            w.push(m[E] - v[E]);
      else l.indexOf(d) !== -1 ? (v = t.Util.colorToRGBA(v), x = t.Util.colorToRGBA(m), w = {
        r: x.r - v.r,
        g: x.g - v.g,
        b: x.b - v.b,
        a: x.a - v.a
      }) : w = m - v;
      p.attrs[S][this._id][d] = {
        start: v,
        diff: w,
        end: m,
        trueEnd: f,
        trueStart: b
      }, p.tweens[S][d] = this._id;
    }
    _tweenFunc(d) {
      const m = this.node, y = p.attrs[m._id][this._id];
      let S, w, c, f, b, x, P, v;
      for (S in y) {
        if (w = y[S], c = w.start, f = w.diff, v = w.end, t.Util._isArray(c))
          if (b = [], P = Math.max(c.length, v.length), S.indexOf("fill") === 0)
            for (x = 0; x < P; x++)
              x % 2 === 0 ? b.push((c[x] || 0) + f[x] * d) : b.push("rgba(" + Math.round(c[x].r + f[x].r * d) + "," + Math.round(c[x].g + f[x].g * d) + "," + Math.round(c[x].b + f[x].b * d) + "," + (c[x].a + f[x].a * d) + ")");
          else
            for (x = 0; x < P; x++)
              b.push((c[x] || 0) + f[x] * d);
        else l.indexOf(S) !== -1 ? b = "rgba(" + Math.round(c.r + f.r * d) + "," + Math.round(c.g + f.g * d) + "," + Math.round(c.b + f.b * d) + "," + (c.a + f.a * d) + ")" : b = c + f * d;
        m.setAttr(S, b);
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
        const d = this.node, m = p.attrs[d._id][this._id];
        m.points && m.points.trueEnd && d.setAttr("points", m.points.trueEnd), this.onFinish && this.onFinish.call(this);
      }, this.tween.onReset = () => {
        const d = this.node, m = p.attrs[d._id][this._id];
        m.points && m.points.trueStart && d.points(m.points.trueStart), this.onReset && this.onReset();
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
    seek(d) {
      return this.tween.seek(d * 1e3), this;
    }
    pause() {
      return this.tween.pause(), this;
    }
    finish() {
      return this.tween.finish(), this;
    }
    destroy() {
      const d = this.node._id, m = this._id, y = p.tweens[d];
      this.pause(), this.anim && this.anim.stop();
      for (const S in y)
        delete p.tweens[d][S];
      delete p.attrs[d][m], p.tweens[d] && (Object.keys(p.tweens[d]).length === 0 && delete p.tweens[d], Object.keys(p.attrs[d]).length === 0 && delete p.attrs[d]);
    }
  }
  h.Tween = p, p.attrs = {}, p.tweens = {}, i.Node.prototype.to = function(g) {
    const d = g.onFinish;
    g.node = this, g.onFinish = function() {
      this.destroy(), d && d();
    }, new p(g).play();
  }, h.Easings = {
    BackEaseIn(g, d, m, y) {
      return m * (g /= y) * g * ((1.70158 + 1) * g - 1.70158) + d;
    },
    BackEaseOut(g, d, m, y) {
      return m * ((g = g / y - 1) * g * ((1.70158 + 1) * g + 1.70158) + 1) + d;
    },
    BackEaseInOut(g, d, m, y) {
      let S = 1.70158;
      return (g /= y / 2) < 1 ? m / 2 * (g * g * (((S *= 1.525) + 1) * g - S)) + d : m / 2 * ((g -= 2) * g * (((S *= 1.525) + 1) * g + S) + 2) + d;
    },
    ElasticEaseIn(g, d, m, y, S, w) {
      let c = 0;
      return g === 0 ? d : (g /= y) === 1 ? d + m : (w || (w = y * 0.3), !S || S < Math.abs(m) ? (S = m, c = w / 4) : c = w / (2 * Math.PI) * Math.asin(m / S), -(S * Math.pow(2, 10 * (g -= 1)) * Math.sin((g * y - c) * (2 * Math.PI) / w)) + d);
    },
    ElasticEaseOut(g, d, m, y, S, w) {
      let c = 0;
      return g === 0 ? d : (g /= y) === 1 ? d + m : (w || (w = y * 0.3), !S || S < Math.abs(m) ? (S = m, c = w / 4) : c = w / (2 * Math.PI) * Math.asin(m / S), S * Math.pow(2, -10 * g) * Math.sin((g * y - c) * (2 * Math.PI) / w) + m + d);
    },
    ElasticEaseInOut(g, d, m, y, S, w) {
      let c = 0;
      return g === 0 ? d : (g /= y / 2) === 2 ? d + m : (w || (w = y * (0.3 * 1.5)), !S || S < Math.abs(m) ? (S = m, c = w / 4) : c = w / (2 * Math.PI) * Math.asin(m / S), g < 1 ? -0.5 * (S * Math.pow(2, 10 * (g -= 1)) * Math.sin((g * y - c) * (2 * Math.PI) / w)) + d : S * Math.pow(2, -10 * (g -= 1)) * Math.sin((g * y - c) * (2 * Math.PI) / w) * 0.5 + m + d);
    },
    BounceEaseOut(g, d, m, y) {
      return (g /= y) < 1 / 2.75 ? m * (7.5625 * g * g) + d : g < 2 / 2.75 ? m * (7.5625 * (g -= 1.5 / 2.75) * g + 0.75) + d : g < 2.5 / 2.75 ? m * (7.5625 * (g -= 2.25 / 2.75) * g + 0.9375) + d : m * (7.5625 * (g -= 2.625 / 2.75) * g + 0.984375) + d;
    },
    BounceEaseIn(g, d, m, y) {
      return m - h.Easings.BounceEaseOut(y - g, 0, m, y) + d;
    },
    BounceEaseInOut(g, d, m, y) {
      return g < y / 2 ? h.Easings.BounceEaseIn(g * 2, 0, m, y) * 0.5 + d : h.Easings.BounceEaseOut(g * 2 - y, 0, m, y) * 0.5 + m * 0.5 + d;
    },
    EaseIn(g, d, m, y) {
      return m * (g /= y) * g + d;
    },
    EaseOut(g, d, m, y) {
      return -m * (g /= y) * (g - 2) + d;
    },
    EaseInOut(g, d, m, y) {
      return (g /= y / 2) < 1 ? m / 2 * g * g + d : -m / 2 * (--g * (g - 2) - 1) + d;
    },
    StrongEaseIn(g, d, m, y) {
      return m * (g /= y) * g * g * g * g + d;
    },
    StrongEaseOut(g, d, m, y) {
      return m * ((g = g / y - 1) * g * g * g * g + 1) + d;
    },
    StrongEaseInOut(g, d, m, y) {
      return (g /= y / 2) < 1 ? m / 2 * g * g * g * g * g + d : m / 2 * ((g -= 2) * g * g * g * g + 2) + d;
    },
    Linear(g, d, m, y) {
      return m * g / y + d;
    }
  };
})(Zr);
(function(h) {
  Object.defineProperty(h, "__esModule", { value: !0 }), h.Konva = void 0;
  const t = B, e = nt, i = et, n = Zt, r = Kr, s = Be, a = ui, o = Ce, l = ci, u = dt, _ = we, p = Zr, g = Mt, d = St;
  h.Konva = e.Util._assign(t.Konva, {
    Util: e.Util,
    Transform: e.Transform,
    Node: i.Node,
    Container: n.Container,
    Stage: r.Stage,
    stages: r.stages,
    Layer: s.Layer,
    FastLayer: a.FastLayer,
    Group: o.Group,
    DD: l.DD,
    Shape: u.Shape,
    shapes: u.shapes,
    Animation: _.Animation,
    Tween: p.Tween,
    Easings: p.Easings,
    Context: g.Context,
    Canvas: d.Canvas
  }), h.default = h.Konva;
})(Wr);
var fi = {};
Object.defineProperty(fi, "__esModule", { value: !0 });
fi.Arc = void 0;
const gi = V, Qa = dt, ur = B, pi = $, Za = B;
class Ot extends Qa.Shape {
  _sceneFunc(t) {
    const e = ur.Konva.getAngle(this.angle()), i = this.clockwise();
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
    const t = this.innerRadius(), e = this.outerRadius(), i = this.clockwise(), n = ur.Konva.getAngle(i ? 360 - this.angle() : this.angle()), r = Math.cos(Math.min(n, Math.PI)), s = 1, a = Math.sin(Math.min(Math.max(Math.PI, n), 3 * Math.PI / 2)), o = Math.sin(Math.min(n, Math.PI / 2)), l = r * (r > 0 ? t : e), u = s * e, _ = a * (a > 0 ? t : e), p = o * (o > 0 ? e : t);
    return {
      x: l,
      y: i ? -1 * p : _,
      width: u - l,
      height: p - _
    };
  }
}
fi.Arc = Ot;
Ot.prototype._centroid = !0;
Ot.prototype.className = "Arc";
Ot.prototype._attrsAffectingSize = [
  "innerRadius",
  "outerRadius",
  "angle",
  "clockwise"
];
(0, Za._registerNode)(Ot);
gi.Factory.addGetterSetter(Ot, "innerRadius", 0, (0, pi.getNumberValidator)());
gi.Factory.addGetterSetter(Ot, "outerRadius", 0, (0, pi.getNumberValidator)());
gi.Factory.addGetterSetter(Ot, "angle", 0, (0, pi.getNumberValidator)());
gi.Factory.addGetterSetter(Ot, "clockwise", !1, (0, pi.getBooleanValidator)());
var _i = {}, Ve = {};
Object.defineProperty(Ve, "__esModule", { value: !0 });
Ve.Line = void 0;
const mi = V, to = B, eo = dt, ts = $;
function mn(h, t, e, i, n, r, s) {
  const a = Math.sqrt(Math.pow(e - h, 2) + Math.pow(i - t, 2)), o = Math.sqrt(Math.pow(n - e, 2) + Math.pow(r - i, 2)), l = s * a / (a + o), u = s * o / (a + o), _ = e - l * (n - h), p = i - l * (r - t), g = e + u * (n - h), d = i + u * (r - t);
  return [_, p, g, d];
}
function fr(h, t) {
  const e = h.length, i = [];
  for (let n = 2; n < e - 2; n += 2) {
    const r = mn(h[n - 2], h[n - 1], h[n], h[n + 1], h[n + 2], h[n + 3], t);
    isNaN(r[0]) || (i.push(r[0]), i.push(r[1]), i.push(h[n]), i.push(h[n + 1]), i.push(r[2]), i.push(r[3]));
  }
  return i;
}
class Vt extends eo.Shape {
  constructor(t) {
    super(t), this.on("pointsChange.konva tensionChange.konva closedChange.konva bezierChange.konva", function() {
      this._clearCache("tensionPoints");
    });
  }
  _sceneFunc(t) {
    const e = this.points(), i = e.length, n = this.tension(), r = this.closed(), s = this.bezier();
    if (!i)
      return;
    let a = 0;
    if (t.beginPath(), t.moveTo(e[0], e[1]), n !== 0 && i > 4) {
      const o = this.getTensionPoints(), l = o.length;
      for (a = r ? 0 : 4, r || t.quadraticCurveTo(o[0], o[1], o[2], o[3]); a < l - 2; )
        t.bezierCurveTo(o[a++], o[a++], o[a++], o[a++], o[a++], o[a++]);
      r || t.quadraticCurveTo(o[l - 2], o[l - 1], e[i - 2], e[i - 1]);
    } else if (s)
      for (a = 2; a < i; )
        t.bezierCurveTo(e[a++], e[a++], e[a++], e[a++], e[a++], e[a++]);
    else
      for (a = 2; a < i; a += 2)
        t.lineTo(e[a], e[a + 1]);
    r ? (t.closePath(), t.fillStrokeShape(this)) : t.strokeShape(this);
  }
  getTensionPoints() {
    return this._getCache("tensionPoints", this._getTensionPoints);
  }
  _getTensionPoints() {
    return this.closed() ? this._getTensionPointsClosed() : fr(this.points(), this.tension());
  }
  _getTensionPointsClosed() {
    const t = this.points(), e = t.length, i = this.tension(), n = mn(t[e - 2], t[e - 1], t[0], t[1], t[2], t[3], i), r = mn(t[e - 4], t[e - 3], t[e - 2], t[e - 1], t[0], t[1], i), s = fr(t, i);
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
    let e = t[0], i = t[0], n = t[1], r = t[1], s, a;
    for (let o = 0; o < t.length / 2; o++)
      s = t[o * 2], a = t[o * 2 + 1], e = Math.min(e, s), i = Math.max(i, s), n = Math.min(n, a), r = Math.max(r, a);
    return {
      x: e,
      y: n,
      width: i - e,
      height: r - n
    };
  }
}
Ve.Line = Vt;
Vt.prototype.className = "Line";
Vt.prototype._attrsAffectingSize = ["points", "bezier", "tension"];
(0, to._registerNode)(Vt);
mi.Factory.addGetterSetter(Vt, "closed", !1);
mi.Factory.addGetterSetter(Vt, "bezier", !1);
mi.Factory.addGetterSetter(Vt, "tension", 0, (0, ts.getNumberValidator)());
mi.Factory.addGetterSetter(Vt, "points", [], (0, ts.getNumberArrayValidator)());
var xe = {}, es = {};
(function(h) {
  Object.defineProperty(h, "__esModule", { value: !0 }), h.t2length = h.getQuadraticArcLength = h.getCubicArcLength = h.binomialCoefficients = h.cValues = h.tValues = void 0, h.tValues = [
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
  ], h.cValues = [
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
  ], h.binomialCoefficients = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]];
  const t = (s, a, o) => {
    let l, u;
    const p = o / 2;
    l = 0;
    for (let g = 0; g < 20; g++)
      u = p * h.tValues[20][g] + p, l += h.cValues[20][g] * i(s, a, u);
    return p * l;
  };
  h.getCubicArcLength = t;
  const e = (s, a, o) => {
    o === void 0 && (o = 1);
    const l = s[0] - 2 * s[1] + s[2], u = a[0] - 2 * a[1] + a[2], _ = 2 * s[1] - 2 * s[0], p = 2 * a[1] - 2 * a[0], g = 4 * (l * l + u * u), d = 4 * (l * _ + u * p), m = _ * _ + p * p;
    if (g === 0)
      return o * Math.sqrt(Math.pow(s[2] - s[0], 2) + Math.pow(a[2] - a[0], 2));
    const y = d / (2 * g), S = m / g, w = o + y, c = S - y * y, f = w * w + c > 0 ? Math.sqrt(w * w + c) : 0, b = y * y + c > 0 ? Math.sqrt(y * y + c) : 0, x = y + Math.sqrt(y * y + c) !== 0 ? c * Math.log(Math.abs((w + f) / (y + b))) : 0;
    return Math.sqrt(g) / 2 * (w * f - y * b + x);
  };
  h.getQuadraticArcLength = e;
  function i(s, a, o) {
    const l = n(1, o, s), u = n(1, o, a), _ = l * l + u * u;
    return Math.sqrt(_);
  }
  const n = (s, a, o) => {
    const l = o.length - 1;
    let u, _;
    if (l === 0)
      return 0;
    if (s === 0) {
      _ = 0;
      for (let p = 0; p <= l; p++)
        _ += h.binomialCoefficients[l][p] * Math.pow(1 - a, l - p) * Math.pow(a, p) * o[p];
      return _;
    } else {
      u = new Array(l);
      for (let p = 0; p < l; p++)
        u[p] = l * (o[p + 1] - o[p]);
      return n(s - 1, a, u);
    }
  }, r = (s, a, o) => {
    let l = 1, u = s / a, _ = (s - o(u)) / a, p = 0;
    for (; l > 1e-3; ) {
      const g = o(u + _), d = Math.abs(s - g) / a;
      if (d < l)
        l = d, u += _;
      else {
        const m = o(u - _), y = Math.abs(s - m) / a;
        y < l ? (l = y, u -= _) : _ /= 2;
      }
      if (p++, p > 500)
        break;
    }
    return u;
  };
  h.t2length = r;
})(es);
Object.defineProperty(xe, "__esModule", { value: !0 });
xe.Path = void 0;
const io = V, no = B, ro = dt, ue = es;
class ct extends ro.Shape {
  constructor(t) {
    super(t), this.dataArray = [], this.pathLength = 0, this._readDataAttribute(), this.on("dataChange.konva", function() {
      this._readDataAttribute();
    });
  }
  _readDataAttribute() {
    this.dataArray = ct.parsePathData(this.data()), this.pathLength = ct.getPathLength(this.dataArray);
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
          const a = s[0], o = s[1], l = s[2], u = s[3], _ = s[4], p = s[5], g = s[6], d = s[7], m = l > u ? l : u, y = l > u ? 1 : l / u, S = l > u ? u / l : 1;
          t.translate(a, o), t.rotate(g), t.scale(y, S), t.arc(0, 0, m, _, _ + p, 1 - d), t.scale(1 / y, 1 / S), t.rotate(-g), t.translate(-a, -o);
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
    this.dataArray.forEach(function(o) {
      if (o.command === "A") {
        const l = o.points[4], u = o.points[5], _ = o.points[4] + u;
        let p = Math.PI / 180;
        if (Math.abs(l - _) < p && (p = Math.abs(l - _)), u < 0)
          for (let g = l - p; g > _; g -= p) {
            const d = ct.getPointOnEllipticalArc(o.points[0], o.points[1], o.points[2], o.points[3], g, 0);
            t.push(d.x, d.y);
          }
        else
          for (let g = l + p; g < _; g += p) {
            const d = ct.getPointOnEllipticalArc(o.points[0], o.points[1], o.points[2], o.points[3], g, 0);
            t.push(d.x, d.y);
          }
      } else if (o.command === "C")
        for (let l = 0; l <= 1; l += 0.01) {
          const u = ct.getPointOnCubicBezier(l, o.start.x, o.start.y, o.points[0], o.points[1], o.points[2], o.points[3], o.points[4], o.points[5]);
          t.push(u.x, u.y);
        }
      else
        t = t.concat(o.points);
    });
    let e = t[0], i = t[0], n = t[1], r = t[1], s, a;
    for (let o = 0; o < t.length / 2; o++)
      s = t[o * 2], a = t[o * 2 + 1], isNaN(s) || (e = Math.min(e, s), i = Math.max(i, s)), isNaN(a) || (n = Math.min(n, a), r = Math.max(r, a));
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
    return ct.getPointAtLengthOfDataArray(t, this.dataArray);
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
    const s = e[n], a = s.points;
    switch (s.command) {
      case "L":
        return ct.getPointOnLine(t, s.start.x, s.start.y, a[0], a[1]);
      case "C":
        return ct.getPointOnCubicBezier((0, ue.t2length)(t, ct.getPathLength(e), (m) => (0, ue.getCubicArcLength)([s.start.x, a[0], a[2], a[4]], [s.start.y, a[1], a[3], a[5]], m)), s.start.x, s.start.y, a[0], a[1], a[2], a[3], a[4], a[5]);
      case "Q":
        return ct.getPointOnQuadraticBezier((0, ue.t2length)(t, ct.getPathLength(e), (m) => (0, ue.getQuadraticArcLength)([s.start.x, a[0], a[2]], [s.start.y, a[1], a[3]], m)), s.start.x, s.start.y, a[0], a[1], a[2], a[3]);
      case "A":
        const o = a[0], l = a[1], u = a[2], _ = a[3], p = a[5], g = a[6];
        let d = a[4];
        return d += p * t / s.pathLength, ct.getPointOnEllipticalArc(o, l, u, _, d, g);
    }
    return null;
  }
  static getPointOnLine(t, e, i, n, r, s, a) {
    s = s ?? e, a = a ?? i;
    const o = this.getLineLength(e, i, n, r);
    if (o < 1e-10)
      return { x: e, y: i };
    if (n === e)
      return { x: s, y: a + (r > i ? t : -t) };
    const l = (r - i) / (n - e), u = Math.sqrt(t * t / (1 + l * l)) * (n < e ? -1 : 1), _ = l * u;
    if (Math.abs(a - i - l * (s - e)) < 1e-10)
      return { x: s + u, y: a + _ };
    const p = ((s - e) * (n - e) + (a - i) * (r - i)) / (o * o), g = e + p * (n - e), d = i + p * (r - i), m = this.getLineLength(s, a, g, d), y = Math.sqrt(t * t - m * m), S = Math.sqrt(y * y / (1 + l * l)) * (n < e ? -1 : 1), w = l * S;
    return { x: g + S, y: d + w };
  }
  static getPointOnCubicBezier(t, e, i, n, r, s, a, o, l) {
    function u(y) {
      return y * y * y;
    }
    function _(y) {
      return 3 * y * y * (1 - y);
    }
    function p(y) {
      return 3 * y * (1 - y) * (1 - y);
    }
    function g(y) {
      return (1 - y) * (1 - y) * (1 - y);
    }
    const d = o * u(t) + s * _(t) + n * p(t) + e * g(t), m = l * u(t) + a * _(t) + r * p(t) + i * g(t);
    return { x: d, y: m };
  }
  static getPointOnQuadraticBezier(t, e, i, n, r, s, a) {
    function o(g) {
      return g * g;
    }
    function l(g) {
      return 2 * g * (1 - g);
    }
    function u(g) {
      return (1 - g) * (1 - g);
    }
    const _ = s * o(t) + n * l(t) + e * u(t), p = a * o(t) + r * l(t) + i * u(t);
    return { x: _, y: p };
  }
  static getPointOnEllipticalArc(t, e, i, n, r, s) {
    const a = Math.cos(s), o = Math.sin(s), l = {
      x: i * Math.cos(r),
      y: n * Math.sin(r)
    };
    return {
      x: t + (l.x * a - l.y * o),
      y: e + (l.x * o + l.y * a)
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
    for (let _ = 0; _ < i.length; _++)
      e = e.replace(new RegExp(i[_], "g"), "|" + i[_]);
    const n = e.split("|"), r = [], s = [];
    let a = 0, o = 0;
    const l = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
    let u;
    for (let _ = 1; _ < n.length; _++) {
      let p = n[_], g = p.charAt(0);
      for (p = p.slice(1), s.length = 0; u = l.exec(p); )
        s.push(u[0]);
      const d = [];
      for (let m = 0, y = s.length; m < y; m++) {
        if (s[m] === "00") {
          d.push(0, 0);
          continue;
        }
        const S = parseFloat(s[m]);
        isNaN(S) ? d.push(0) : d.push(S);
      }
      for (; d.length > 0 && !isNaN(d[0]); ) {
        let m = "", y = [];
        const S = a, w = o;
        let c, f, b, x, P, v, E, A, T, M;
        switch (g) {
          case "l":
            a += d.shift(), o += d.shift(), m = "L", y.push(a, o);
            break;
          case "L":
            a = d.shift(), o = d.shift(), y.push(a, o);
            break;
          case "m":
            const F = d.shift(), L = d.shift();
            if (a += F, o += L, m = "M", r.length > 2 && r[r.length - 1].command === "z") {
              for (let O = r.length - 2; O >= 0; O--)
                if (r[O].command === "M") {
                  a = r[O].points[0] + F, o = r[O].points[1] + L;
                  break;
                }
            }
            y.push(a, o), g = "l";
            break;
          case "M":
            a = d.shift(), o = d.shift(), m = "M", y.push(a, o), g = "L";
            break;
          case "h":
            a += d.shift(), m = "L", y.push(a, o);
            break;
          case "H":
            a = d.shift(), m = "L", y.push(a, o);
            break;
          case "v":
            o += d.shift(), m = "L", y.push(a, o);
            break;
          case "V":
            o = d.shift(), m = "L", y.push(a, o);
            break;
          case "C":
            y.push(d.shift(), d.shift(), d.shift(), d.shift()), a = d.shift(), o = d.shift(), y.push(a, o);
            break;
          case "c":
            y.push(a + d.shift(), o + d.shift(), a + d.shift(), o + d.shift()), a += d.shift(), o += d.shift(), m = "C", y.push(a, o);
            break;
          case "S":
            f = a, b = o, c = r[r.length - 1], c.command === "C" && (f = a + (a - c.points[2]), b = o + (o - c.points[3])), y.push(f, b, d.shift(), d.shift()), a = d.shift(), o = d.shift(), m = "C", y.push(a, o);
            break;
          case "s":
            f = a, b = o, c = r[r.length - 1], c.command === "C" && (f = a + (a - c.points[2]), b = o + (o - c.points[3])), y.push(f, b, a + d.shift(), o + d.shift()), a += d.shift(), o += d.shift(), m = "C", y.push(a, o);
            break;
          case "Q":
            y.push(d.shift(), d.shift()), a = d.shift(), o = d.shift(), y.push(a, o);
            break;
          case "q":
            y.push(a + d.shift(), o + d.shift()), a += d.shift(), o += d.shift(), m = "Q", y.push(a, o);
            break;
          case "T":
            f = a, b = o, c = r[r.length - 1], c.command === "Q" && (f = a + (a - c.points[0]), b = o + (o - c.points[1])), a = d.shift(), o = d.shift(), m = "Q", y.push(f, b, a, o);
            break;
          case "t":
            f = a, b = o, c = r[r.length - 1], c.command === "Q" && (f = a + (a - c.points[0]), b = o + (o - c.points[1])), a += d.shift(), o += d.shift(), m = "Q", y.push(f, b, a, o);
            break;
          case "A":
            x = d.shift(), P = d.shift(), v = d.shift(), E = d.shift(), A = d.shift(), T = a, M = o, a = d.shift(), o = d.shift(), m = "A", y = this.convertEndpointToCenterParameterization(T, M, a, o, E, A, x, P, v);
            break;
          case "a":
            x = d.shift(), P = d.shift(), v = d.shift(), E = d.shift(), A = d.shift(), T = a, M = o, a += d.shift(), o += d.shift(), m = "A", y = this.convertEndpointToCenterParameterization(T, M, a, o, E, A, x, P, v);
            break;
        }
        r.push({
          command: m || g,
          points: y,
          start: {
            x: S,
            y: w
          },
          pathLength: this.calcLength(S, w, m || g, y)
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
    let r, s, a, o;
    const l = ct;
    switch (i) {
      case "L":
        return l.getLineLength(t, e, n[0], n[1]);
      case "C":
        return (0, ue.getCubicArcLength)([t, n[0], n[2], n[4]], [e, n[1], n[3], n[5]], 1);
      case "Q":
        return (0, ue.getQuadraticArcLength)([t, n[0], n[2]], [e, n[1], n[3]], 1);
      case "A":
        r = 0;
        const u = n[4], _ = n[5], p = n[4] + _;
        let g = Math.PI / 180;
        if (Math.abs(u - p) < g && (g = Math.abs(u - p)), s = l.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], u, 0), _ < 0)
          for (o = u - g; o > p; o -= g)
            a = l.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], o, 0), r += l.getLineLength(s.x, s.y, a.x, a.y), s = a;
        else
          for (o = u + g; o < p; o += g)
            a = l.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], o, 0), r += l.getLineLength(s.x, s.y, a.x, a.y), s = a;
        return a = l.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], p, 0), r += l.getLineLength(s.x, s.y, a.x, a.y), r;
    }
    return 0;
  }
  static convertEndpointToCenterParameterization(t, e, i, n, r, s, a, o, l) {
    const u = l * (Math.PI / 180), _ = Math.cos(u) * (t - i) / 2 + Math.sin(u) * (e - n) / 2, p = -1 * Math.sin(u) * (t - i) / 2 + Math.cos(u) * (e - n) / 2, g = _ * _ / (a * a) + p * p / (o * o);
    g > 1 && (a *= Math.sqrt(g), o *= Math.sqrt(g));
    let d = Math.sqrt((a * a * (o * o) - a * a * (p * p) - o * o * (_ * _)) / (a * a * (p * p) + o * o * (_ * _)));
    r === s && (d *= -1), isNaN(d) && (d = 0);
    const m = d * a * p / o, y = d * -o * _ / a, S = (t + i) / 2 + Math.cos(u) * m - Math.sin(u) * y, w = (e + n) / 2 + Math.sin(u) * m + Math.cos(u) * y, c = function(A) {
      return Math.sqrt(A[0] * A[0] + A[1] * A[1]);
    }, f = function(A, T) {
      return (A[0] * T[0] + A[1] * T[1]) / (c(A) * c(T));
    }, b = function(A, T) {
      return (A[0] * T[1] < A[1] * T[0] ? -1 : 1) * Math.acos(f(A, T));
    }, x = b([1, 0], [(_ - m) / a, (p - y) / o]), P = [(_ - m) / a, (p - y) / o], v = [(-1 * _ - m) / a, (-1 * p - y) / o];
    let E = b(P, v);
    return f(P, v) <= -1 && (E = Math.PI), f(P, v) >= 1 && (E = 0), s === 0 && E > 0 && (E = E - 2 * Math.PI), s === 1 && E < 0 && (E = E + 2 * Math.PI), [S, w, a, o, x, E, u, s];
  }
}
xe.Path = ct;
ct.prototype.className = "Path";
ct.prototype._attrsAffectingSize = ["data"];
(0, no._registerNode)(ct);
io.Factory.addGetterSetter(ct, "data");
Object.defineProperty(_i, "__esModule", { value: !0 });
_i.Arrow = void 0;
const yi = V, so = Ve, is = $, ao = B, gr = xe;
class ee extends so.Line {
  _sceneFunc(t) {
    super._sceneFunc(t);
    const e = Math.PI * 2, i = this.points();
    let n = i;
    const r = this.tension() !== 0 && i.length > 4;
    r && (n = this.getTensionPoints());
    const s = this.pointerLength(), a = i.length;
    let o, l;
    if (r) {
      const p = [
        n[n.length - 4],
        n[n.length - 3],
        n[n.length - 2],
        n[n.length - 1],
        i[a - 2],
        i[a - 1]
      ], g = gr.Path.calcLength(n[n.length - 4], n[n.length - 3], "C", p), d = gr.Path.getPointOnQuadraticBezier(Math.min(1, 1 - s / g), p[0], p[1], p[2], p[3], p[4], p[5]);
      o = i[a - 2] - d.x, l = i[a - 1] - d.y;
    } else
      o = i[a - 2] - i[a - 4], l = i[a - 1] - i[a - 3];
    const u = (Math.atan2(l, o) + e) % e, _ = this.pointerWidth();
    this.pointerAtEnding() && (t.save(), t.beginPath(), t.translate(i[a - 2], i[a - 1]), t.rotate(u), t.moveTo(0, 0), t.lineTo(-s, _ / 2), t.lineTo(-s, -_ / 2), t.closePath(), t.restore(), this.__fillStroke(t)), this.pointerAtBeginning() && (t.save(), t.beginPath(), t.translate(i[0], i[1]), r ? (o = (n[0] + n[2]) / 2 - i[0], l = (n[1] + n[3]) / 2 - i[1]) : (o = i[2] - i[0], l = i[3] - i[1]), t.rotate((Math.atan2(-l, -o) + e) % e), t.moveTo(0, 0), t.lineTo(-s, _ / 2), t.lineTo(-s, -_ / 2), t.closePath(), t.restore(), this.__fillStroke(t));
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
_i.Arrow = ee;
ee.prototype.className = "Arrow";
(0, ao._registerNode)(ee);
yi.Factory.addGetterSetter(ee, "pointerLength", 10, (0, is.getNumberValidator)());
yi.Factory.addGetterSetter(ee, "pointerWidth", 10, (0, is.getNumberValidator)());
yi.Factory.addGetterSetter(ee, "pointerAtBeginning", !1);
yi.Factory.addGetterSetter(ee, "pointerAtEnding", !0);
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
bi.Circle = void 0;
const oo = V, ho = dt, lo = $, co = B;
class Ae extends ho.Shape {
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
bi.Circle = Ae;
Ae.prototype._centroid = !0;
Ae.prototype.className = "Circle";
Ae.prototype._attrsAffectingSize = ["radius"];
(0, co._registerNode)(Ae);
oo.Factory.addGetterSetter(Ae, "radius", 0, (0, lo.getNumberValidator)());
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
vi.Ellipse = void 0;
const Nn = V, uo = dt, ns = $, fo = B;
class Ht extends uo.Shape {
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
vi.Ellipse = Ht;
Ht.prototype.className = "Ellipse";
Ht.prototype._centroid = !0;
Ht.prototype._attrsAffectingSize = ["radiusX", "radiusY"];
(0, fo._registerNode)(Ht);
Nn.Factory.addComponentsGetterSetter(Ht, "radius", ["x", "y"]);
Nn.Factory.addGetterSetter(Ht, "radiusX", 0, (0, ns.getNumberValidator)());
Nn.Factory.addGetterSetter(Ht, "radiusY", 0, (0, ns.getNumberValidator)());
var Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.Image = void 0;
const hn = nt, ie = V, go = dt, po = B, He = $;
let xt = class rs extends go.Shape {
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
      const a = this.attrs.cropWidth, o = this.attrs.cropHeight;
      a && o ? s = [
        r,
        this.cropX(),
        this.cropY(),
        a,
        o,
        0,
        0,
        e,
        i
      ] : s = [r, 0, 0, e, i];
    }
    (this.hasFill() || this.hasStroke() || n) && (t.beginPath(), n ? hn.Util.drawRoundedRectPath(t, e, i, n) : t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this)), r && (n && t.clip(), t.drawImage.apply(t, s));
  }
  _hitFunc(t) {
    const e = this.width(), i = this.height(), n = this.cornerRadius();
    t.beginPath(), n ? hn.Util.drawRoundedRectPath(t, e, i, n) : t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this);
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
    const n = hn.Util.createImageElement();
    n.onload = function() {
      const r = new rs({
        image: n
      });
      e(r);
    }, n.onerror = i, n.crossOrigin = "Anonymous", n.src = t;
  }
};
Si.Image = xt;
xt.prototype.className = "Image";
(0, po._registerNode)(xt);
ie.Factory.addGetterSetter(xt, "cornerRadius", 0, (0, He.getNumberOrArrayOfNumbersValidator)(4));
ie.Factory.addGetterSetter(xt, "image");
ie.Factory.addComponentsGetterSetter(xt, "crop", ["x", "y", "width", "height"]);
ie.Factory.addGetterSetter(xt, "cropX", 0, (0, He.getNumberValidator)());
ie.Factory.addGetterSetter(xt, "cropY", 0, (0, He.getNumberValidator)());
ie.Factory.addGetterSetter(xt, "cropWidth", 0, (0, He.getNumberValidator)());
ie.Factory.addGetterSetter(xt, "cropHeight", 0, (0, He.getNumberValidator)());
var me = {};
Object.defineProperty(me, "__esModule", { value: !0 });
me.Tag = me.Label = void 0;
const Ci = V, _o = dt, mo = Ce, Ln = $, ss = B, as = [
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
], yo = "Change.konva", bo = "none", yn = "up", bn = "right", vn = "down", Sn = "left", vo = as.length;
class Gn extends mo.Group {
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
    for (i = 0; i < vo; i++)
      t.on(as[i] + yo, n);
  }
  getWidth() {
    return this.getText().width();
  }
  getHeight() {
    return this.getText().height();
  }
  _sync() {
    let t = this.getText(), e = this.getTag(), i, n, r, s, a, o, l;
    if (t && e) {
      switch (i = t.width(), n = t.height(), r = e.pointerDirection(), s = e.pointerWidth(), l = e.pointerHeight(), a = 0, o = 0, r) {
        case yn:
          a = i / 2, o = -1 * l;
          break;
        case bn:
          a = i + s, o = n / 2;
          break;
        case vn:
          a = i / 2, o = n + l;
          break;
        case Sn:
          a = -1 * s, o = n / 2;
          break;
      }
      e.setAttrs({
        x: -1 * a,
        y: -1 * o,
        width: i,
        height: n
      }), t.setAttrs({
        x: -1 * a,
        y: -1 * o
      });
    }
  }
}
me.Label = Gn;
Gn.prototype.className = "Label";
(0, ss._registerNode)(Gn);
class ne extends _o.Shape {
  _sceneFunc(t) {
    const e = this.width(), i = this.height(), n = this.pointerDirection(), r = this.pointerWidth(), s = this.pointerHeight(), a = this.cornerRadius();
    let o = 0, l = 0, u = 0, _ = 0;
    typeof a == "number" ? o = l = u = _ = Math.min(a, e / 2, i / 2) : (o = Math.min(a[0] || 0, e / 2, i / 2), l = Math.min(a[1] || 0, e / 2, i / 2), _ = Math.min(a[2] || 0, e / 2, i / 2), u = Math.min(a[3] || 0, e / 2, i / 2)), t.beginPath(), t.moveTo(o, 0), n === yn && (t.lineTo((e - r) / 2, 0), t.lineTo(e / 2, -1 * s), t.lineTo((e + r) / 2, 0)), t.lineTo(e - l, 0), t.arc(e - l, l, l, Math.PI * 3 / 2, 0, !1), n === bn && (t.lineTo(e, (i - s) / 2), t.lineTo(e + r, i / 2), t.lineTo(e, (i + s) / 2)), t.lineTo(e, i - _), t.arc(e - _, i - _, _, 0, Math.PI / 2, !1), n === vn && (t.lineTo((e + r) / 2, i), t.lineTo(e / 2, i + s), t.lineTo((e - r) / 2, i)), t.lineTo(u, i), t.arc(u, i - u, u, Math.PI / 2, Math.PI, !1), n === Sn && (t.lineTo(0, (i + s) / 2), t.lineTo(-1 * r, i / 2), t.lineTo(0, (i - s) / 2)), t.lineTo(0, o), t.arc(o, o, o, Math.PI, Math.PI * 3 / 2, !1), t.closePath(), t.fillStrokeShape(this);
  }
  getSelfRect() {
    let t = 0, e = 0, i = this.pointerWidth(), n = this.pointerHeight(), r = this.pointerDirection(), s = this.width(), a = this.height();
    return r === yn ? (e -= n, a += n) : r === vn ? a += n : r === Sn ? (t -= i * 1.5, s += i) : r === bn && (s += i * 1.5), {
      x: t,
      y: e,
      width: s,
      height: a
    };
  }
}
me.Tag = ne;
ne.prototype.className = "Tag";
(0, ss._registerNode)(ne);
Ci.Factory.addGetterSetter(ne, "pointerDirection", bo);
Ci.Factory.addGetterSetter(ne, "pointerWidth", 0, (0, Ln.getNumberValidator)());
Ci.Factory.addGetterSetter(ne, "pointerHeight", 0, (0, Ln.getNumberValidator)());
Ci.Factory.addGetterSetter(ne, "cornerRadius", 0, (0, Ln.getNumberOrArrayOfNumbersValidator)(4));
var ze = {};
Object.defineProperty(ze, "__esModule", { value: !0 });
ze.Rect = void 0;
const So = V, Co = dt, wo = B, xo = nt, Ao = $;
class wi extends Co.Shape {
  _sceneFunc(t) {
    const e = this.cornerRadius(), i = this.width(), n = this.height();
    t.beginPath(), e ? xo.Util.drawRoundedRectPath(t, i, n, e) : t.rect(0, 0, i, n), t.closePath(), t.fillStrokeShape(this);
  }
}
ze.Rect = wi;
wi.prototype.className = "Rect";
(0, wo._registerNode)(wi);
So.Factory.addGetterSetter(wi, "cornerRadius", 0, (0, Ao.getNumberOrArrayOfNumbersValidator)(4));
var xi = {};
Object.defineProperty(xi, "__esModule", { value: !0 });
xi.RegularPolygon = void 0;
const os = V, ko = dt, hs = $, Po = B;
class re extends ko.Shape {
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
xi.RegularPolygon = re;
re.prototype.className = "RegularPolygon";
re.prototype._centroid = !0;
re.prototype._attrsAffectingSize = ["radius"];
(0, Po._registerNode)(re);
os.Factory.addGetterSetter(re, "radius", 0, (0, hs.getNumberValidator)());
os.Factory.addGetterSetter(re, "sides", 0, (0, hs.getNumberValidator)());
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.Ring = void 0;
const ls = V, Eo = dt, cs = $, To = B, pr = Math.PI * 2;
class se extends Eo.Shape {
  _sceneFunc(t) {
    t.beginPath(), t.arc(0, 0, this.innerRadius(), 0, pr, !1), t.moveTo(this.outerRadius(), 0), t.arc(0, 0, this.outerRadius(), pr, 0, !0), t.closePath(), t.fillStrokeShape(this);
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
Ai.Ring = se;
se.prototype.className = "Ring";
se.prototype._centroid = !0;
se.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"];
(0, To._registerNode)(se);
ls.Factory.addGetterSetter(se, "innerRadius", 0, (0, cs.getNumberValidator)());
ls.Factory.addGetterSetter(se, "outerRadius", 0, (0, cs.getNumberValidator)());
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.Sprite = void 0;
const ae = V, Mo = dt, Ro = we, ds = $, Fo = B;
class At extends Mo.Shape {
  constructor(t) {
    super(t), this._updated = !0, this.anim = new Ro.Animation(() => {
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
    const e = this.animation(), i = this.frameIndex(), n = i * 4, r = this.animations()[e], s = this.frameOffsets(), a = r[n + 0], o = r[n + 1], l = r[n + 2], u = r[n + 3], _ = this.image();
    if ((this.hasFill() || this.hasStroke()) && (t.beginPath(), t.rect(0, 0, l, u), t.closePath(), t.fillStrokeShape(this)), _)
      if (s) {
        const p = s[e], g = i * 2;
        t.drawImage(_, a, o, l, u, p[g + 0], p[g + 1], l, u);
      } else
        t.drawImage(_, a, o, l, u, 0, 0, l, u);
  }
  _hitFunc(t) {
    const e = this.animation(), i = this.frameIndex(), n = i * 4, r = this.animations()[e], s = this.frameOffsets(), a = r[n + 2], o = r[n + 3];
    if (t.beginPath(), s) {
      const l = s[e], u = i * 2;
      t.rect(l[u + 0], l[u + 1], a, o);
    } else
      t.rect(0, 0, a, o);
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
ki.Sprite = At;
At.prototype.className = "Sprite";
(0, Fo._registerNode)(At);
ae.Factory.addGetterSetter(At, "animation");
ae.Factory.addGetterSetter(At, "animations");
ae.Factory.addGetterSetter(At, "frameOffsets");
ae.Factory.addGetterSetter(At, "image");
ae.Factory.addGetterSetter(At, "frameIndex", 0, (0, ds.getNumberValidator)());
ae.Factory.addGetterSetter(At, "frameRate", 17, (0, ds.getNumberValidator)());
ae.Factory.backCompat(At, {
  index: "frameIndex",
  getIndex: "getFrameIndex",
  setIndex: "setFrameIndex"
});
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.Star = void 0;
const $n = V, Oo = dt, Dn = $, No = B;
class zt extends Oo.Shape {
  _sceneFunc(t) {
    const e = this.innerRadius(), i = this.outerRadius(), n = this.numPoints();
    t.beginPath(), t.moveTo(0, 0 - i);
    for (let r = 1; r < n * 2; r++) {
      const s = r % 2 === 0 ? i : e, a = s * Math.sin(r * Math.PI / n), o = -1 * s * Math.cos(r * Math.PI / n);
      t.lineTo(a, o);
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
Pi.Star = zt;
zt.prototype.className = "Star";
zt.prototype._centroid = !0;
zt.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"];
(0, No._registerNode)(zt);
$n.Factory.addGetterSetter(zt, "numPoints", 5, (0, Dn.getNumberValidator)());
$n.Factory.addGetterSetter(zt, "innerRadius", 0, (0, Dn.getNumberValidator)());
$n.Factory.addGetterSetter(zt, "outerRadius", 0, (0, Dn.getNumberValidator)());
var ke = {};
Object.defineProperty(ke, "__esModule", { value: !0 });
ke.Text = void 0;
ke.stringToArray = Kt;
const Cn = nt, pt = V, Lo = dt, ln = B, Wt = $, Go = B;
function Kt(h) {
  return [...h].reduce((t, e, i, n) => {
    if (new RegExp("\\p{Emoji}", "u").test(e)) {
      const r = n[i + 1];
      r && new RegExp("\\p{Emoji_Modifier}|\\u200D", "u").test(r) ? (t.push(e + r), n[i + 1] = "") : t.push(e);
    } else new RegExp("\\p{Regional_Indicator}{2}", "u").test(e + (n[i + 1] || "")) ? t.push(e + n[i + 1]) : i > 0 && new RegExp("\\p{Mn}|\\p{Me}|\\p{Mc}", "u").test(e) ? t[t.length - 1] += e : e && t.push(e);
    return t;
  }, []);
}
const fe = "auto", $o = "center", us = "inherit", Ee = "justify", Do = "Change.konva", Io = "2d", _r = "-", fs = "left", Uo = "text", Bo = "Text", Vo = "top", Ho = "bottom", mr = "middle", gs = "normal", zo = "px ", Ye = " ", Wo = "right", yr = "rtl", jo = "word", Yo = "char", br = "none", cn = "…", ps = [
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
], Xo = ps.length;
function Ko(h) {
  return h.split(",").map((t) => {
    t = t.trim();
    const e = t.indexOf(" ") >= 0, i = t.indexOf('"') >= 0 || t.indexOf("'") >= 0;
    return e && !i && (t = `"${t}"`), t;
  }).join(", ");
}
let Xe;
function dn() {
  return Xe || (Xe = Cn.Util.createCanvasElement().getContext(Io), Xe);
}
function qo(h) {
  h.fillText(this._partialText, this._partialTextX, this._partialTextY);
}
function Jo(h) {
  h.setAttr("miterLimit", 2), h.strokeText(this._partialText, this._partialTextX, this._partialTextY);
}
function Qo(h) {
  return h = h || {}, !h.fillLinearGradientColorStops && !h.fillRadialGradientColorStops && !h.fillPatternImage && (h.fill = h.fill || "black"), h;
}
class st extends Lo.Shape {
  constructor(t) {
    super(Qo(t)), this._partialTextX = 0, this._partialTextY = 0;
    for (let e = 0; e < Xo; e++)
      this.on(ps[e] + Do, this._setTextData);
    this._setTextData();
  }
  _sceneFunc(t) {
    const e = this.textArr, i = e.length;
    if (!this.text())
      return;
    let n = this.padding(), r = this.fontSize(), s = this.lineHeight() * r, a = this.verticalAlign(), o = this.direction(), l = 0, u = this.align(), _ = this.getWidth(), p = this.letterSpacing(), g = this.fill(), d = this.textDecoration(), m = d.indexOf("underline") !== -1, y = d.indexOf("line-through") !== -1, S;
    o = o === us ? t.direction : o;
    let w = s / 2, c = mr;
    if (ln.Konva._fixTextRendering) {
      const f = this.measureSize("M");
      c = "alphabetic", w = (f.fontBoundingBoxAscent - f.fontBoundingBoxDescent) / 2 + s / 2;
    }
    for (o === yr && t.setAttr("direction", o), t.setAttr("font", this._getContextFont()), t.setAttr("textBaseline", c), t.setAttr("textAlign", fs), a === mr ? l = (this.getHeight() - i * s - n * 2) / 2 : a === Ho && (l = this.getHeight() - i * s - n * 2), t.translate(n, l + n), S = 0; S < i; S++) {
      let f = 0, b = 0;
      const x = e[S], P = x.text, v = x.width, E = x.lastInParagraph;
      if (t.save(), u === Wo ? f += _ - v - n * 2 : u === $o && (f += (_ - v - n * 2) / 2), m) {
        t.save(), t.beginPath();
        const A = ln.Konva._fixTextRendering ? Math.round(r / 4) : Math.round(r / 2), T = f, M = w + b + A;
        t.moveTo(T, M);
        const F = u === Ee && !E ? _ - n * 2 : v;
        t.lineTo(T + Math.round(F), M), t.lineWidth = r / 15;
        const L = this._getLinearGradient();
        t.strokeStyle = L || g, t.stroke(), t.restore();
      }
      if (y) {
        t.save(), t.beginPath();
        const A = ln.Konva._fixTextRendering ? -Math.round(r / 4) : 0;
        t.moveTo(f, w + b + A);
        const T = u === Ee && !E ? _ - n * 2 : v;
        t.lineTo(f + Math.round(T), w + b + A), t.lineWidth = r / 15;
        const M = this._getLinearGradient();
        t.strokeStyle = M || g, t.stroke(), t.restore();
      }
      if (o !== yr && (p !== 0 || u === Ee)) {
        const A = P.split(" ").length - 1, T = Kt(P);
        for (let M = 0; M < T.length; M++) {
          const F = T[M];
          F === " " && !E && u === Ee && (f += (_ - n * 2 - v) / A), this._partialTextX = f, this._partialTextY = w + b, this._partialText = F, t.fillStrokeShape(this), f += this.measureSize(F).width + p;
        }
      } else
        p !== 0 && t.setAttr("letterSpacing", `${p}px`), this._partialTextX = f, this._partialTextY = w + b, this._partialText = P, t.fillStrokeShape(this);
      t.restore(), i > 1 && (w += s);
    }
  }
  _hitFunc(t) {
    const e = this.getWidth(), i = this.getHeight();
    t.beginPath(), t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this);
  }
  setText(t) {
    const e = Cn.Util._isString(t) ? t : t == null ? "" : t + "";
    return this._setAttr(Uo, e), this;
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
    return Cn.Util.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height."), this.textHeight;
  }
  measureSize(t) {
    var e, i, n, r, s, a, o, l, u, _, p;
    let g = dn(), d = this.fontSize(), m;
    g.save(), g.font = this._getContextFont(), m = g.measureText(t), g.restore();
    const y = d / 100;
    return {
      actualBoundingBoxAscent: (e = m.actualBoundingBoxAscent) !== null && e !== void 0 ? e : 71.58203125 * y,
      actualBoundingBoxDescent: (i = m.actualBoundingBoxDescent) !== null && i !== void 0 ? i : 0,
      actualBoundingBoxLeft: (n = m.actualBoundingBoxLeft) !== null && n !== void 0 ? n : -7.421875 * y,
      actualBoundingBoxRight: (r = m.actualBoundingBoxRight) !== null && r !== void 0 ? r : 75.732421875 * y,
      alphabeticBaseline: (s = m.alphabeticBaseline) !== null && s !== void 0 ? s : 0,
      emHeightAscent: (a = m.emHeightAscent) !== null && a !== void 0 ? a : 100 * y,
      emHeightDescent: (o = m.emHeightDescent) !== null && o !== void 0 ? o : -20 * y,
      fontBoundingBoxAscent: (l = m.fontBoundingBoxAscent) !== null && l !== void 0 ? l : 91 * y,
      fontBoundingBoxDescent: (u = m.fontBoundingBoxDescent) !== null && u !== void 0 ? u : 21 * y,
      hangingBaseline: (_ = m.hangingBaseline) !== null && _ !== void 0 ? _ : 72.80000305175781 * y,
      ideographicBaseline: (p = m.ideographicBaseline) !== null && p !== void 0 ? p : -21 * y,
      width: m.width,
      height: d
    };
  }
  _getContextFont() {
    return this.fontStyle() + Ye + this.fontVariant() + Ye + (this.fontSize() + zo) + Ko(this.fontFamily());
  }
  _addTextLine(t) {
    this.align() === Ee && (t = t.trim());
    const i = this._getTextWidth(t);
    return this.textArr.push({
      text: t,
      width: i,
      lastInParagraph: !1
    });
  }
  _getTextWidth(t) {
    const e = this.letterSpacing(), i = t.length;
    return dn().measureText(t).width + e * i;
  }
  _setTextData() {
    let t = this.text().split(`
`), e = +this.fontSize(), i = 0, n = this.lineHeight() * e, r = this.attrs.width, s = this.attrs.height, a = r !== fe && r !== void 0, o = s !== fe && s !== void 0, l = this.padding(), u = r - l * 2, _ = s - l * 2, p = 0, g = this.wrap(), d = g !== br, m = g !== Yo && d, y = this.ellipsis();
    this.textArr = [], dn().font = this._getContextFont();
    const S = y ? this._getTextWidth(cn) : 0;
    for (let w = 0, c = t.length; w < c; ++w) {
      let f = t[w], b = this._getTextWidth(f);
      if (a && b > u)
        for (; f.length > 0; ) {
          let x = 0, P = Kt(f).length, v = "", E = 0;
          for (; x < P; ) {
            const A = x + P >>> 1, T = Kt(f), M = T.slice(0, A + 1).join(""), F = this._getTextWidth(M);
            (y && o && p + n > _ ? F + S : F) <= u ? (x = A + 1, v = M, E = F) : P = A;
          }
          if (v) {
            if (m) {
              const M = Kt(f), F = Kt(v), L = M[F.length], O = L === Ye || L === _r;
              let X;
              if (O && E <= u)
                X = F.length;
              else {
                const j = F.lastIndexOf(Ye), k = F.lastIndexOf(_r);
                X = Math.max(j, k) + 1;
              }
              X > 0 && (x = X, v = M.slice(0, x).join(""), E = this._getTextWidth(v));
            }
            if (v = v.trimRight(), this._addTextLine(v), i = Math.max(i, E), p += n, this._shouldHandleEllipsis(p)) {
              this._tryToAddEllipsisToLastLine();
              break;
            }
            if (f = Kt(f).slice(x).join("").trimLeft(), f.length > 0 && (b = this._getTextWidth(f), b <= u)) {
              this._addTextLine(f), p += n, i = Math.max(i, b);
              break;
            }
          } else
            break;
        }
      else
        this._addTextLine(f), p += n, i = Math.max(i, b), this._shouldHandleEllipsis(p) && w < c - 1 && this._tryToAddEllipsisToLastLine();
      if (this.textArr[this.textArr.length - 1] && (this.textArr[this.textArr.length - 1].lastInParagraph = !0), o && p + n > _)
        break;
    }
    this.textHeight = e, this.textWidth = i;
  }
  _shouldHandleEllipsis(t) {
    const e = +this.fontSize(), i = this.lineHeight() * e, n = this.attrs.height, r = n !== fe && n !== void 0, s = this.padding(), a = n - s * 2;
    return !(this.wrap() !== br) || r && t + i > a;
  }
  _tryToAddEllipsisToLastLine() {
    const t = this.attrs.width, e = t !== fe && t !== void 0, i = this.padding(), n = t - i * 2, r = this.ellipsis(), s = this.textArr[this.textArr.length - 1];
    !s || !r || (e && (this._getTextWidth(s.text + cn) < n || (s.text = s.text.slice(0, s.text.length - 3))), this.textArr.splice(this.textArr.length - 1, 1), this._addTextLine(s.text + cn));
  }
  getStrokeScaleEnabled() {
    return !0;
  }
  _useBufferCanvas() {
    const t = this.textDecoration().indexOf("underline") !== -1 || this.textDecoration().indexOf("line-through") !== -1, e = this.hasShadow();
    return t && e ? !0 : super._useBufferCanvas();
  }
}
ke.Text = st;
st.prototype._fillFunc = qo;
st.prototype._strokeFunc = Jo;
st.prototype.className = Bo;
st.prototype._attrsAffectingSize = [
  "text",
  "fontSize",
  "padding",
  "wrap",
  "lineHeight",
  "letterSpacing"
];
(0, Go._registerNode)(st);
pt.Factory.overWriteSetter(st, "width", (0, Wt.getNumberOrAutoValidator)());
pt.Factory.overWriteSetter(st, "height", (0, Wt.getNumberOrAutoValidator)());
pt.Factory.addGetterSetter(st, "direction", us);
pt.Factory.addGetterSetter(st, "fontFamily", "Arial");
pt.Factory.addGetterSetter(st, "fontSize", 12, (0, Wt.getNumberValidator)());
pt.Factory.addGetterSetter(st, "fontStyle", gs);
pt.Factory.addGetterSetter(st, "fontVariant", gs);
pt.Factory.addGetterSetter(st, "padding", 0, (0, Wt.getNumberValidator)());
pt.Factory.addGetterSetter(st, "align", fs);
pt.Factory.addGetterSetter(st, "verticalAlign", Vo);
pt.Factory.addGetterSetter(st, "lineHeight", 1, (0, Wt.getNumberValidator)());
pt.Factory.addGetterSetter(st, "wrap", jo);
pt.Factory.addGetterSetter(st, "ellipsis", !1, (0, Wt.getBooleanValidator)());
pt.Factory.addGetterSetter(st, "letterSpacing", 0, (0, Wt.getNumberValidator)());
pt.Factory.addGetterSetter(st, "text", "", (0, Wt.getStringValidator)());
pt.Factory.addGetterSetter(st, "textDecoration", "");
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.TextPath = void 0;
const un = nt, Ct = V, Zo = dt, Te = xe, fn = ke, _s = $, th = B, eh = "", ms = "normal";
function ys(h) {
  h.fillText(this.partialText, 0, 0);
}
function bs(h) {
  h.strokeText(this.partialText, 0, 0);
}
class ut extends Zo.Shape {
  constructor(t) {
    super(t), this.dummyCanvas = un.Util.createCanvasElement(), this.dataArray = [], this._readDataAttribute(), this.on("dataChange.konva", function() {
      this._readDataAttribute(), this._setTextData();
    }), this.on("textChange.konva alignChange.konva letterSpacingChange.konva kerningFuncChange.konva fontSizeChange.konva fontFamilyChange.konva", this._setTextData), this._setTextData();
  }
  _getTextPathLength() {
    return Te.Path.getPathLength(this.dataArray);
  }
  _getPointAtLength(t) {
    if (!this.attrs.data)
      return null;
    const e = this.pathLength;
    return t - 1 > e ? null : Te.Path.getPointAtLengthOfDataArray(t, this.dataArray);
  }
  _readDataAttribute() {
    this.dataArray = Te.Path.parsePathData(this.attrs.data), this.pathLength = this._getTextPathLength();
  }
  _sceneFunc(t) {
    t.setAttr("font", this._getContextFont()), t.setAttr("textBaseline", this.textBaseline()), t.setAttr("textAlign", "left"), t.save();
    const e = this.textDecoration(), i = this.fill(), n = this.fontSize(), r = this.glyphInfo;
    e === "underline" && t.beginPath();
    for (let s = 0; s < r.length; s++) {
      t.save();
      const a = r[s].p0;
      t.translate(a.x, a.y), t.rotate(r[s].rotation), this.partialText = r[s].text, t.fillStrokeShape(this), e === "underline" && (s === 0 && t.moveTo(0, n / 2 + 1), t.lineTo(n, n / 2 + 1)), t.restore();
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
    return un.Util.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height."), this.textHeight;
  }
  setText(t) {
    return fn.Text.prototype.setText.call(this, t);
  }
  _getContextFont() {
    return fn.Text.prototype._getContextFont.call(this);
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
    let a = 0;
    n === "center" && (a = Math.max(0, this.pathLength / 2 - s / 2)), n === "right" && (a = Math.max(0, this.pathLength - s));
    const o = (0, fn.stringToArray)(this.text());
    let l = a;
    for (let u = 0; u < o.length; u++) {
      const _ = this._getPointAtLength(l);
      if (!_)
        return;
      let p = this._getTextSize(o[u]).width + i;
      if (o[u] === " " && n === "justify") {
        const w = this.text().split(" ").length - 1;
        p += (this.pathLength - s) / w;
      }
      const g = this._getPointAtLength(l + p);
      if (!g)
        return;
      const d = Te.Path.getLineLength(_.x, _.y, g.x, g.y);
      let m = 0;
      if (r)
        try {
          m = r(o[u - 1], o[u]) * this.fontSize();
        } catch {
          m = 0;
        }
      _.x += m, g.x += m, this.textWidth += m;
      const y = Te.Path.getPointOnLine(m + d / 2, _.x, _.y, g.x, g.y), S = Math.atan2(g.y - _.y, g.x - _.x);
      this.glyphInfo.push({
        transposeX: y.x,
        transposeY: y.y,
        text: o[u],
        rotation: S,
        p0: _,
        p1: g
      }), l += p;
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
    this.glyphInfo.forEach(function(l) {
      t.push(l.p0.x), t.push(l.p0.y), t.push(l.p1.x), t.push(l.p1.y);
    });
    let e = t[0] || 0, i = t[0] || 0, n = t[1] || 0, r = t[1] || 0, s, a;
    for (let l = 0; l < t.length / 2; l++)
      s = t[l * 2], a = t[l * 2 + 1], e = Math.min(e, s), i = Math.max(i, s), n = Math.min(n, a), r = Math.max(r, a);
    const o = this.fontSize();
    return {
      x: e - o / 2,
      y: n - o / 2,
      width: i - e + o,
      height: r - n + o
    };
  }
  destroy() {
    return un.Util.releaseCanvas(this.dummyCanvas), super.destroy();
  }
}
Ei.TextPath = ut;
ut.prototype._fillFunc = ys;
ut.prototype._strokeFunc = bs;
ut.prototype._fillFuncHit = ys;
ut.prototype._strokeFuncHit = bs;
ut.prototype.className = "TextPath";
ut.prototype._attrsAffectingSize = ["text", "fontSize", "data"];
(0, th._registerNode)(ut);
Ct.Factory.addGetterSetter(ut, "data");
Ct.Factory.addGetterSetter(ut, "fontFamily", "Arial");
Ct.Factory.addGetterSetter(ut, "fontSize", 12, (0, _s.getNumberValidator)());
Ct.Factory.addGetterSetter(ut, "fontStyle", ms);
Ct.Factory.addGetterSetter(ut, "align", "left");
Ct.Factory.addGetterSetter(ut, "letterSpacing", 0, (0, _s.getNumberValidator)());
Ct.Factory.addGetterSetter(ut, "textBaseline", "middle");
Ct.Factory.addGetterSetter(ut, "fontVariant", ms);
Ct.Factory.addGetterSetter(ut, "text", eh);
Ct.Factory.addGetterSetter(ut, "textDecoration", "");
Ct.Factory.addGetterSetter(ut, "kerningFunc", void 0);
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.Transformer = void 0;
const K = nt, Y = V, vr = et, ih = dt, nh = ze, Sr = Ce, vt = B, jt = $, rh = B, vs = "tr-konva", sh = [
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
].map((h) => h + `.${vs}`).join(" "), Cr = "nodesRect", ah = [
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
], oh = {
  "top-left": -45,
  "top-center": 0,
  "top-right": 45,
  "middle-right": -90,
  "middle-left": 90,
  "bottom-left": -135,
  "bottom-center": 180,
  "bottom-right": 135
}, hh = "ontouchstart" in vt.Konva._global;
function lh(h, t, e) {
  if (h === "rotater")
    return e;
  t += K.Util.degToRad(oh[h] || 0);
  const i = (K.Util.radToDeg(t) % 360 + 360) % 360;
  return K.Util._inRange(i, 315 + 22.5, 360) || K.Util._inRange(i, 0, 22.5) ? "ns-resize" : K.Util._inRange(i, 45 - 22.5, 45 + 22.5) ? "nesw-resize" : K.Util._inRange(i, 90 - 22.5, 90 + 22.5) ? "ew-resize" : K.Util._inRange(i, 135 - 22.5, 135 + 22.5) ? "nwse-resize" : K.Util._inRange(i, 180 - 22.5, 180 + 22.5) ? "ns-resize" : K.Util._inRange(i, 225 - 22.5, 225 + 22.5) ? "nesw-resize" : K.Util._inRange(i, 270 - 22.5, 270 + 22.5) ? "ew-resize" : K.Util._inRange(i, 315 - 22.5, 315 + 22.5) ? "nwse-resize" : (K.Util.error("Transformer has unknown angle for cursor detection: " + i), "pointer");
}
const ni = [
  "top-left",
  "top-center",
  "top-right",
  "middle-right",
  "middle-left",
  "bottom-left",
  "bottom-center",
  "bottom-right"
];
function ch(h) {
  return {
    x: h.x + h.width / 2 * Math.cos(h.rotation) + h.height / 2 * Math.sin(-h.rotation),
    y: h.y + h.height / 2 * Math.cos(h.rotation) + h.width / 2 * Math.sin(h.rotation)
  };
}
function Ss(h, t, e) {
  const i = e.x + (h.x - e.x) * Math.cos(t) - (h.y - e.y) * Math.sin(t), n = e.y + (h.x - e.x) * Math.sin(t) + (h.y - e.y) * Math.cos(t);
  return {
    ...h,
    rotation: h.rotation + t,
    x: i,
    y: n
  };
}
function dh(h, t) {
  const e = ch(h);
  return Ss(h, t, e);
}
function uh(h, t, e) {
  let i = t;
  for (let n = 0; n < h.length; n++) {
    const r = vt.Konva.getAngle(h[n]), s = Math.abs(r - t) % (Math.PI * 2);
    Math.min(s, Math.PI * 2 - s) < e && (i = r);
  }
  return i;
}
let wn = 0;
class W extends Sr.Group {
  constructor(t) {
    super(t), this._movingAnchorName = null, this._transforming = !1, this._createElements(), this._handleMouseMove = this._handleMouseMove.bind(this), this._handleMouseUp = this._handleMouseUp.bind(this), this.update = this.update.bind(this), this.on(sh, this.update), this.getNode() && this.update();
  }
  attachTo(t) {
    return this.setNode(t), this;
  }
  setNode(t) {
    return K.Util.warn("tr.setNode(shape), tr.node(shape) and tr.attachTo(shape) methods are deprecated. Please use tr.nodes(nodesArray) instead."), this.setNodes([t]);
  }
  getNode() {
    return this._nodes && this._nodes[0];
  }
  _getEventNamespace() {
    return vs + this._id;
  }
  setNodes(t = []) {
    this._nodes && this._nodes.length && this.detach();
    const e = t.filter((n) => n.isAncestorOf(this) ? (K.Util.error("Konva.Transformer cannot be an a child of the node you are trying to attach"), !1) : !0);
    return this._nodes = t = e, t.length === 1 && this.useSingleNodeRotation() ? this.rotation(t[0].getAbsoluteRotation()) : this.rotation(0), this._nodes.forEach((n) => {
      const r = () => {
        this.nodes().length === 1 && this.useSingleNodeRotation() && this.rotation(this.nodes()[0].getAbsoluteRotation()), this._resetTransformCache(), !this._transforming && !this.isDragging() && this.update();
      };
      if (n._attrsAffectingSize.length) {
        const s = n._attrsAffectingSize.map((a) => a + "Change." + this._getEventNamespace()).join(" ");
        n.on(s, r);
      }
      n.on(ah.map((s) => s + `.${this._getEventNamespace()}`).join(" "), r), n.on(`absoluteTransformChange.${this._getEventNamespace()}`, r), this._proxyDrag(n);
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
      this.nodes().forEach((a) => {
        if (a === t || a.isDragging())
          return;
        const o = a.getAbsolutePosition();
        a.setAbsolutePosition({
          x: o.x + r,
          y: o.y + s
        }), a.startDrag(i);
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
    this._clearCache(Cr), this._clearCache("transform"), this._clearSelfAndDescendantCache("absoluteTransform");
  }
  _getNodeRect() {
    return this._getCache(Cr, this.__getNodeRect);
  }
  __getNodeShape(t, e = this.rotation(), i) {
    const n = t.getClientRect({
      skipTransform: !0,
      skipShadow: !0,
      skipStroke: this.ignoreStroke()
    }), r = t.getAbsoluteScale(i), s = t.getAbsolutePosition(i), a = n.x * r.x - t.offsetX() * r.x, o = n.y * r.y - t.offsetY() * r.y, l = (vt.Konva.getAngle(t.getAbsoluteRotation()) + Math.PI * 2) % (Math.PI * 2), u = {
      x: s.x + a * Math.cos(l) + o * Math.sin(-l),
      y: s.y + o * Math.cos(l) + a * Math.sin(l),
      width: n.width * r.x,
      height: n.height * r.y,
      rotation: l
    };
    return Ss(u, -vt.Konva.getAngle(e), {
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
    this.nodes().map((l) => {
      const u = l.getClientRect({
        skipTransform: !0,
        skipShadow: !0,
        skipStroke: this.ignoreStroke()
      }), _ = [
        { x: u.x, y: u.y },
        { x: u.x + u.width, y: u.y },
        { x: u.x + u.width, y: u.y + u.height },
        { x: u.x, y: u.y + u.height }
      ], p = l.getAbsoluteTransform();
      _.forEach(function(g) {
        const d = p.point(g);
        e.push(d);
      });
    });
    const i = new K.Transform();
    i.rotate(-vt.Konva.getAngle(this.rotation()));
    let n = 1 / 0, r = 1 / 0, s = -1 / 0, a = -1 / 0;
    e.forEach(function(l) {
      const u = i.point(l);
      n === void 0 && (n = s = u.x, r = a = u.y), n = Math.min(n, u.x), r = Math.min(r, u.y), s = Math.max(s, u.x), a = Math.max(a, u.y);
    }), i.invert();
    const o = i.point({ x: n, y: r });
    return {
      x: o.x,
      y: o.y,
      width: s - n,
      height: a - r,
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
    this._createBack(), ni.forEach((t) => {
      this._createAnchor(t);
    }), this._createAnchor("rotater");
  }
  _createAnchor(t) {
    const e = new nh.Rect({
      stroke: "rgb(0, 161, 255)",
      fill: "white",
      strokeWidth: 1,
      name: t + " _anchor",
      dragDistance: 0,
      draggable: !0,
      hitStrokeWidth: hh ? 10 : "auto"
    }), i = this;
    e.on("mousedown touchstart", function(n) {
      i._handleMouseDown(n);
    }), e.on("dragstart", (n) => {
      e.stopDrag(), n.cancelBubble = !0;
    }), e.on("dragend", (n) => {
      n.cancelBubble = !0;
    }), e.on("mouseenter", () => {
      const n = vt.Konva.getAngle(this.rotation()), r = this.rotateAnchorCursor(), s = lh(t, n, r);
      e.getStage().content && (e.getStage().content.style.cursor = s), this._cursorChange = !0;
    }), e.on("mouseout", () => {
      e.getStage().content && (e.getStage().content.style.cursor = ""), this._cursorChange = !1;
    }), this.add(e);
  }
  _createBack() {
    const t = new ih.Shape({
      name: "back",
      width: 0,
      height: 0,
      draggable: !0,
      sceneFunc(e, i) {
        const n = i.getParent(), r = n.padding();
        e.beginPath(), e.rect(-r, -r, i.width() + r * 2, i.height() + r * 2), e.moveTo(i.width() / 2, -r), n.rotateEnabled() && n.rotateLineVisible() && e.lineTo(i.width() / 2, -n.rotateAnchorOffset() * K.Util._sign(i.height()) - r), e.fillStrokeShape(i);
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
    const s = t.target.getAbsolutePosition(), a = t.target.getStage().getPointerPosition();
    this._anchorDragOffset = {
      x: a.x - s.x,
      y: a.y - s.y
    }, wn++, this._fire("transformstart", { evt: t.evt, target: this.getNode() }), this._nodes.forEach((o) => {
      o._fire("transformstart", { evt: t.evt, target: o });
    });
  }
  _handleMouseMove(t) {
    let e, i, n;
    const r = this.findOne("." + this._movingAnchorName), s = r.getStage();
    s.setPointersPositions(t);
    const a = s.getPointerPosition();
    let o = {
      x: a.x - this._anchorDragOffset.x,
      y: a.y - this._anchorDragOffset.y
    };
    const l = r.getAbsolutePosition();
    this.anchorDragBoundFunc() && (o = this.anchorDragBoundFunc()(l, o, t)), r.setAbsolutePosition(o);
    const u = r.getAbsolutePosition();
    if (l.x === u.x && l.y === u.y)
      return;
    if (this._movingAnchorName === "rotater") {
      const w = this._getNodeRect();
      e = r.x() - w.width / 2, i = -r.y() + w.height / 2;
      let c = Math.atan2(-i, e) + Math.PI / 2;
      w.height < 0 && (c -= Math.PI);
      const b = vt.Konva.getAngle(this.rotation()) + c, x = vt.Konva.getAngle(this.rotationSnapTolerance()), v = uh(this.rotationSnaps(), b, x) - w.rotation, E = dh(w, v);
      this._fitNodesInto(E, t);
      return;
    }
    const _ = this.shiftBehavior();
    let p;
    _ === "inverted" ? p = this.keepRatio() && !t.shiftKey : _ === "none" ? p = this.keepRatio() : p = this.keepRatio() || t.shiftKey;
    let g = this.centeredScaling() || t.altKey;
    if (this._movingAnchorName === "top-left") {
      if (p) {
        const w = g ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".bottom-right").x(),
          y: this.findOne(".bottom-right").y()
        };
        n = Math.sqrt(Math.pow(w.x - r.x(), 2) + Math.pow(w.y - r.y(), 2));
        const c = this.findOne(".top-left").x() > w.x ? -1 : 1, f = this.findOne(".top-left").y() > w.y ? -1 : 1;
        e = n * this.cos * c, i = n * this.sin * f, this.findOne(".top-left").x(w.x - e), this.findOne(".top-left").y(w.y - i);
      }
    } else if (this._movingAnchorName === "top-center")
      this.findOne(".top-left").y(r.y());
    else if (this._movingAnchorName === "top-right") {
      if (p) {
        const w = g ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".bottom-left").x(),
          y: this.findOne(".bottom-left").y()
        };
        n = Math.sqrt(Math.pow(r.x() - w.x, 2) + Math.pow(w.y - r.y(), 2));
        const c = this.findOne(".top-right").x() < w.x ? -1 : 1, f = this.findOne(".top-right").y() > w.y ? -1 : 1;
        e = n * this.cos * c, i = n * this.sin * f, this.findOne(".top-right").x(w.x + e), this.findOne(".top-right").y(w.y - i);
      }
      var d = r.position();
      this.findOne(".top-left").y(d.y), this.findOne(".bottom-right").x(d.x);
    } else if (this._movingAnchorName === "middle-left")
      this.findOne(".top-left").x(r.x());
    else if (this._movingAnchorName === "middle-right")
      this.findOne(".bottom-right").x(r.x());
    else if (this._movingAnchorName === "bottom-left") {
      if (p) {
        const w = g ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".top-right").x(),
          y: this.findOne(".top-right").y()
        };
        n = Math.sqrt(Math.pow(w.x - r.x(), 2) + Math.pow(r.y() - w.y, 2));
        const c = w.x < r.x() ? -1 : 1, f = r.y() < w.y ? -1 : 1;
        e = n * this.cos * c, i = n * this.sin * f, r.x(w.x - e), r.y(w.y + i);
      }
      d = r.position(), this.findOne(".top-left").x(d.x), this.findOne(".bottom-right").y(d.y);
    } else if (this._movingAnchorName === "bottom-center")
      this.findOne(".bottom-right").y(r.y());
    else if (this._movingAnchorName === "bottom-right") {
      if (p) {
        const w = g ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".top-left").x(),
          y: this.findOne(".top-left").y()
        };
        n = Math.sqrt(Math.pow(r.x() - w.x, 2) + Math.pow(r.y() - w.y, 2));
        const c = this.findOne(".bottom-right").x() < w.x ? -1 : 1, f = this.findOne(".bottom-right").y() < w.y ? -1 : 1;
        e = n * this.cos * c, i = n * this.sin * f, this.findOne(".bottom-right").x(w.x + e), this.findOne(".bottom-right").y(w.y + i);
      }
    } else
      console.error(new Error("Wrong position argument of selection resizer: " + this._movingAnchorName));
    if (g = this.centeredScaling() || t.altKey, g) {
      const w = this.findOne(".top-left"), c = this.findOne(".bottom-right"), f = w.x(), b = w.y(), x = this.getWidth() - c.x(), P = this.getHeight() - c.y();
      c.move({
        x: -f,
        y: -b
      }), w.move({
        x,
        y: P
      });
    }
    const m = this.findOne(".top-left").getAbsolutePosition();
    e = m.x, i = m.y;
    const y = this.findOne(".bottom-right").x() - this.findOne(".top-left").x(), S = this.findOne(".bottom-right").y() - this.findOne(".top-left").y();
    this._fitNodesInto({
      x: e,
      y: i,
      width: y,
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
      wn--, this._fire("transformend", { evt: t, target: i }), (e = this.getLayer()) === null || e === void 0 || e.batchDraw(), i && this._nodes.forEach((n) => {
        var r;
        n._fire("transformend", { evt: t, target: n }), (r = n.getLayer()) === null || r === void 0 || r.batchDraw();
      }), this._movingAnchorName = null;
    }
  }
  _fitNodesInto(t, e) {
    const i = this._getNodeRect(), n = 1;
    if (K.Util._inRange(t.width, -this.padding() * 2 - n, n)) {
      this.update();
      return;
    }
    if (K.Util._inRange(t.height, -this.padding() * 2 - n, n)) {
      this.update();
      return;
    }
    const r = new K.Transform();
    if (r.rotate(vt.Konva.getAngle(this.rotation())), this._movingAnchorName && t.width < 0 && this._movingAnchorName.indexOf("left") >= 0) {
      const p = r.point({
        x: -this.padding() * 2,
        y: 0
      });
      t.x += p.x, t.y += p.y, t.width += this.padding() * 2, this._movingAnchorName = this._movingAnchorName.replace("left", "right"), this._anchorDragOffset.x -= p.x, this._anchorDragOffset.y -= p.y;
    } else if (this._movingAnchorName && t.width < 0 && this._movingAnchorName.indexOf("right") >= 0) {
      const p = r.point({
        x: this.padding() * 2,
        y: 0
      });
      this._movingAnchorName = this._movingAnchorName.replace("right", "left"), this._anchorDragOffset.x -= p.x, this._anchorDragOffset.y -= p.y, t.width += this.padding() * 2;
    }
    if (this._movingAnchorName && t.height < 0 && this._movingAnchorName.indexOf("top") >= 0) {
      const p = r.point({
        x: 0,
        y: -this.padding() * 2
      });
      t.x += p.x, t.y += p.y, this._movingAnchorName = this._movingAnchorName.replace("top", "bottom"), this._anchorDragOffset.x -= p.x, this._anchorDragOffset.y -= p.y, t.height += this.padding() * 2;
    } else if (this._movingAnchorName && t.height < 0 && this._movingAnchorName.indexOf("bottom") >= 0) {
      const p = r.point({
        x: 0,
        y: this.padding() * 2
      });
      this._movingAnchorName = this._movingAnchorName.replace("bottom", "top"), this._anchorDragOffset.x -= p.x, this._anchorDragOffset.y -= p.y, t.height += this.padding() * 2;
    }
    if (this.boundBoxFunc()) {
      const p = this.boundBoxFunc()(i, t);
      p ? t = p : K.Util.warn("boundBoxFunc returned falsy. You should return new bound rect from it!");
    }
    const s = 1e7, a = new K.Transform();
    a.translate(i.x, i.y), a.rotate(i.rotation), a.scale(i.width / s, i.height / s);
    const o = new K.Transform(), l = t.width / s, u = t.height / s;
    this.flipEnabled() === !1 ? (o.translate(t.x, t.y), o.rotate(t.rotation), o.translate(t.width < 0 ? t.width : 0, t.height < 0 ? t.height : 0), o.scale(Math.abs(l), Math.abs(u))) : (o.translate(t.x, t.y), o.rotate(t.rotation), o.scale(l, u));
    const _ = o.multiply(a.invert());
    this._nodes.forEach((p) => {
      var g;
      const d = p.getParent().getAbsoluteTransform(), m = p.getTransform().copy();
      m.translate(p.offsetX(), p.offsetY());
      const y = new K.Transform();
      y.multiply(d.copy().invert()).multiply(_).multiply(d).multiply(m);
      const S = y.decompose();
      p.setAttrs(S), (g = p.getLayer()) === null || g === void 0 || g.batchDraw();
    }), this.rotation(K.Util._getRotation(t.rotation)), this._nodes.forEach((p) => {
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
    this.rotation(K.Util._getRotation(e.rotation));
    const i = e.width, n = e.height, r = this.enabledAnchors(), s = this.resizeEnabled(), a = this.padding(), o = this.anchorSize(), l = this.find("._anchor");
    l.forEach((_) => {
      _.setAttrs({
        width: o,
        height: o,
        offsetX: o / 2,
        offsetY: o / 2,
        stroke: this.anchorStroke(),
        strokeWidth: this.anchorStrokeWidth(),
        fill: this.anchorFill(),
        cornerRadius: this.anchorCornerRadius()
      });
    }), this._batchChangeChild(".top-left", {
      x: 0,
      y: 0,
      offsetX: o / 2 + a,
      offsetY: o / 2 + a,
      visible: s && r.indexOf("top-left") >= 0
    }), this._batchChangeChild(".top-center", {
      x: i / 2,
      y: 0,
      offsetY: o / 2 + a,
      visible: s && r.indexOf("top-center") >= 0
    }), this._batchChangeChild(".top-right", {
      x: i,
      y: 0,
      offsetX: o / 2 - a,
      offsetY: o / 2 + a,
      visible: s && r.indexOf("top-right") >= 0
    }), this._batchChangeChild(".middle-left", {
      x: 0,
      y: n / 2,
      offsetX: o / 2 + a,
      visible: s && r.indexOf("middle-left") >= 0
    }), this._batchChangeChild(".middle-right", {
      x: i,
      y: n / 2,
      offsetX: o / 2 - a,
      visible: s && r.indexOf("middle-right") >= 0
    }), this._batchChangeChild(".bottom-left", {
      x: 0,
      y: n,
      offsetX: o / 2 + a,
      offsetY: o / 2 - a,
      visible: s && r.indexOf("bottom-left") >= 0
    }), this._batchChangeChild(".bottom-center", {
      x: i / 2,
      y: n,
      offsetY: o / 2 - a,
      visible: s && r.indexOf("bottom-center") >= 0
    }), this._batchChangeChild(".bottom-right", {
      x: i,
      y: n,
      offsetX: o / 2 - a,
      offsetY: o / 2 - a,
      visible: s && r.indexOf("bottom-right") >= 0
    }), this._batchChangeChild(".rotater", {
      x: i / 2,
      y: -this.rotateAnchorOffset() * K.Util._sign(n) - a,
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
    const u = this.anchorStyleFunc();
    u && l.forEach((_) => {
      u(_);
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
    return this.getStage() && this._cursorChange && this.getStage().content && (this.getStage().content.style.cursor = ""), Sr.Group.prototype.destroy.call(this), this.detach(), this._removeEvents(), this;
  }
  toObject() {
    return vr.Node.prototype.toObject.call(this);
  }
  clone(t) {
    return vr.Node.prototype.clone.call(this, t);
  }
  getClientRect() {
    return this.nodes().length > 0 ? super.getClientRect() : { x: 0, y: 0, width: 0, height: 0 };
  }
}
Ti.Transformer = W;
W.isTransforming = () => wn > 0;
function fh(h) {
  return h instanceof Array || K.Util.warn("enabledAnchors value should be an array"), h instanceof Array && h.forEach(function(t) {
    ni.indexOf(t) === -1 && K.Util.warn("Unknown anchor name: " + t + ". Available names are: " + ni.join(", "));
  }), h || [];
}
W.prototype.className = "Transformer";
(0, rh._registerNode)(W);
Y.Factory.addGetterSetter(W, "enabledAnchors", ni, fh);
Y.Factory.addGetterSetter(W, "flipEnabled", !0, (0, jt.getBooleanValidator)());
Y.Factory.addGetterSetter(W, "resizeEnabled", !0);
Y.Factory.addGetterSetter(W, "anchorSize", 10, (0, jt.getNumberValidator)());
Y.Factory.addGetterSetter(W, "rotateEnabled", !0);
Y.Factory.addGetterSetter(W, "rotateLineVisible", !0);
Y.Factory.addGetterSetter(W, "rotationSnaps", []);
Y.Factory.addGetterSetter(W, "rotateAnchorOffset", 50, (0, jt.getNumberValidator)());
Y.Factory.addGetterSetter(W, "rotateAnchorCursor", "crosshair");
Y.Factory.addGetterSetter(W, "rotationSnapTolerance", 5, (0, jt.getNumberValidator)());
Y.Factory.addGetterSetter(W, "borderEnabled", !0);
Y.Factory.addGetterSetter(W, "anchorStroke", "rgb(0, 161, 255)");
Y.Factory.addGetterSetter(W, "anchorStrokeWidth", 1, (0, jt.getNumberValidator)());
Y.Factory.addGetterSetter(W, "anchorFill", "white");
Y.Factory.addGetterSetter(W, "anchorCornerRadius", 0, (0, jt.getNumberValidator)());
Y.Factory.addGetterSetter(W, "borderStroke", "rgb(0, 161, 255)");
Y.Factory.addGetterSetter(W, "borderStrokeWidth", 1, (0, jt.getNumberValidator)());
Y.Factory.addGetterSetter(W, "borderDash");
Y.Factory.addGetterSetter(W, "keepRatio", !0);
Y.Factory.addGetterSetter(W, "shiftBehavior", "default");
Y.Factory.addGetterSetter(W, "centeredScaling", !1);
Y.Factory.addGetterSetter(W, "ignoreStroke", !1);
Y.Factory.addGetterSetter(W, "padding", 0, (0, jt.getNumberValidator)());
Y.Factory.addGetterSetter(W, "nodes");
Y.Factory.addGetterSetter(W, "node");
Y.Factory.addGetterSetter(W, "boundBoxFunc");
Y.Factory.addGetterSetter(W, "anchorDragBoundFunc");
Y.Factory.addGetterSetter(W, "anchorStyleFunc");
Y.Factory.addGetterSetter(W, "shouldOverdrawWholeArea", !1);
Y.Factory.addGetterSetter(W, "useSingleNodeRotation", !0);
Y.Factory.backCompat(W, {
  lineEnabled: "borderEnabled",
  rotateHandlerOffset: "rotateAnchorOffset",
  enabledHandlers: "enabledAnchors"
});
var Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
Mi.Wedge = void 0;
const Ri = V, gh = dt, ph = B, Cs = $, _h = B;
class Nt extends gh.Shape {
  _sceneFunc(t) {
    t.beginPath(), t.arc(0, 0, this.radius(), 0, ph.Konva.getAngle(this.angle()), this.clockwise()), t.lineTo(0, 0), t.closePath(), t.fillStrokeShape(this);
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
Mi.Wedge = Nt;
Nt.prototype.className = "Wedge";
Nt.prototype._centroid = !0;
Nt.prototype._attrsAffectingSize = ["radius"];
(0, _h._registerNode)(Nt);
Ri.Factory.addGetterSetter(Nt, "radius", 0, (0, Cs.getNumberValidator)());
Ri.Factory.addGetterSetter(Nt, "angle", 0, (0, Cs.getNumberValidator)());
Ri.Factory.addGetterSetter(Nt, "clockwise", !1);
Ri.Factory.backCompat(Nt, {
  angleDeg: "angle",
  getAngleDeg: "getAngle",
  setAngleDeg: "setAngle"
});
var Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.Blur = void 0;
const wr = V, mh = et, yh = $;
function xr() {
  this.r = 0, this.g = 0, this.b = 0, this.a = 0, this.next = null;
}
const bh = [
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
], vh = [
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
function Sh(h, t) {
  const e = h.data, i = h.width, n = h.height;
  let r, s, a, o, l, u, _, p, g, d, m, y, S, w, c, f, b, x, P, v;
  const E = t + t + 1, A = i - 1, T = n - 1, M = t + 1, F = M * (M + 1) / 2, L = new xr(), O = bh[t], X = vh[t];
  let j = null, k = L, U = null, I = null;
  for (let N = 1; N < E; N++)
    k = k.next = new xr(), N === M && (j = k);
  k.next = L, a = s = 0;
  for (let N = 0; N < n; N++) {
    y = S = w = c = o = l = u = _ = 0, p = M * (f = e[s]), g = M * (b = e[s + 1]), d = M * (x = e[s + 2]), m = M * (P = e[s + 3]), o += F * f, l += F * b, u += F * x, _ += F * P, k = L;
    for (let H = 0; H < M; H++)
      k.r = f, k.g = b, k.b = x, k.a = P, k = k.next;
    for (let H = 1; H < M; H++)
      r = s + ((A < H ? A : H) << 2), o += (k.r = f = e[r]) * (v = M - H), l += (k.g = b = e[r + 1]) * v, u += (k.b = x = e[r + 2]) * v, _ += (k.a = P = e[r + 3]) * v, y += f, S += b, w += x, c += P, k = k.next;
    U = L, I = j;
    for (let H = 0; H < i; H++)
      e[s + 3] = P = _ * O >> X, P !== 0 ? (P = 255 / P, e[s] = (o * O >> X) * P, e[s + 1] = (l * O >> X) * P, e[s + 2] = (u * O >> X) * P) : e[s] = e[s + 1] = e[s + 2] = 0, o -= p, l -= g, u -= d, _ -= m, p -= U.r, g -= U.g, d -= U.b, m -= U.a, r = a + ((r = H + t + 1) < A ? r : A) << 2, y += U.r = e[r], S += U.g = e[r + 1], w += U.b = e[r + 2], c += U.a = e[r + 3], o += y, l += S, u += w, _ += c, U = U.next, p += f = I.r, g += b = I.g, d += x = I.b, m += P = I.a, y -= f, S -= b, w -= x, c -= P, I = I.next, s += 4;
    a += i;
  }
  for (let N = 0; N < i; N++) {
    S = w = c = y = l = u = _ = o = 0, s = N << 2, p = M * (f = e[s]), g = M * (b = e[s + 1]), d = M * (x = e[s + 2]), m = M * (P = e[s + 3]), o += F * f, l += F * b, u += F * x, _ += F * P, k = L;
    for (let it = 0; it < M; it++)
      k.r = f, k.g = b, k.b = x, k.a = P, k = k.next;
    let H = i;
    for (let it = 1; it <= t; it++)
      s = H + N << 2, o += (k.r = f = e[s]) * (v = M - it), l += (k.g = b = e[s + 1]) * v, u += (k.b = x = e[s + 2]) * v, _ += (k.a = P = e[s + 3]) * v, y += f, S += b, w += x, c += P, k = k.next, it < T && (H += i);
    s = N, U = L, I = j;
    for (let it = 0; it < n; it++)
      r = s << 2, e[r + 3] = P = _ * O >> X, P > 0 ? (P = 255 / P, e[r] = (o * O >> X) * P, e[r + 1] = (l * O >> X) * P, e[r + 2] = (u * O >> X) * P) : e[r] = e[r + 1] = e[r + 2] = 0, o -= p, l -= g, u -= d, _ -= m, p -= U.r, g -= U.g, d -= U.b, m -= U.a, r = N + ((r = it + M) < T ? r : T) * i << 2, o += y += U.r = e[r], l += S += U.g = e[r + 1], u += w += U.b = e[r + 2], _ += c += U.a = e[r + 3], U = U.next, p += f = I.r, g += b = I.g, d += x = I.b, m += P = I.a, y -= f, S -= b, w -= x, c -= P, I = I.next, s += i;
  }
}
const Ch = function(t) {
  const e = Math.round(this.blurRadius());
  e > 0 && Sh(t, e);
};
Fi.Blur = Ch;
wr.Factory.addGetterSetter(mh.Node, "blurRadius", 0, (0, yh.getNumberValidator)(), wr.Factory.afterSetFilter);
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.Brighten = void 0;
const Ar = V, wh = et, xh = $, Ah = function(h) {
  const t = this.brightness() * 255, e = h.data, i = e.length;
  for (let n = 0; n < i; n += 4)
    e[n] += t, e[n + 1] += t, e[n + 2] += t;
};
Oi.Brighten = Ah;
Ar.Factory.addGetterSetter(wh.Node, "brightness", 0, (0, xh.getNumberValidator)(), Ar.Factory.afterSetFilter);
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.Contrast = void 0;
const kr = V, kh = et, Ph = $, Eh = function(h) {
  const t = Math.pow((this.contrast() + 100) / 100, 2), e = h.data, i = e.length;
  let n = 150, r = 150, s = 150;
  for (let a = 0; a < i; a += 4)
    n = e[a], r = e[a + 1], s = e[a + 2], n /= 255, n -= 0.5, n *= t, n += 0.5, n *= 255, r /= 255, r -= 0.5, r *= t, r += 0.5, r *= 255, s /= 255, s -= 0.5, s *= t, s += 0.5, s *= 255, n = n < 0 ? 0 : n > 255 ? 255 : n, r = r < 0 ? 0 : r > 255 ? 255 : r, s = s < 0 ? 0 : s > 255 ? 255 : s, e[a] = n, e[a + 1] = r, e[a + 2] = s;
};
Ni.Contrast = Eh;
kr.Factory.addGetterSetter(kh.Node, "contrast", 0, (0, Ph.getNumberValidator)(), kr.Factory.afterSetFilter);
var Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
Li.Emboss = void 0;
const Ut = V, Gi = et, Th = nt, ws = $, Mh = function(h) {
  const t = this.embossStrength() * 10, e = this.embossWhiteLevel() * 255, i = this.embossDirection(), n = this.embossBlend(), r = h.data, s = h.width, a = h.height, o = s * 4;
  let l = 0, u = 0, _ = a;
  switch (i) {
    case "top-left":
      l = -1, u = -1;
      break;
    case "top":
      l = -1, u = 0;
      break;
    case "top-right":
      l = -1, u = 1;
      break;
    case "right":
      l = 0, u = 1;
      break;
    case "bottom-right":
      l = 1, u = 1;
      break;
    case "bottom":
      l = 1, u = 0;
      break;
    case "bottom-left":
      l = 1, u = -1;
      break;
    case "left":
      l = 0, u = -1;
      break;
    default:
      Th.Util.error("Unknown emboss direction: " + i);
  }
  do {
    const p = (_ - 1) * o;
    let g = l;
    _ + g < 1 && (g = 0), _ + g > a && (g = 0);
    const d = (_ - 1 + g) * s * 4;
    let m = s;
    do {
      const y = p + (m - 1) * 4;
      let S = u;
      m + S < 1 && (S = 0), m + S > s && (S = 0);
      const w = d + (m - 1 + S) * 4, c = r[y] - r[w], f = r[y + 1] - r[w + 1], b = r[y + 2] - r[w + 2];
      let x = c;
      const P = x > 0 ? x : -x, v = f > 0 ? f : -f, E = b > 0 ? b : -b;
      if (v > P && (x = f), E > P && (x = b), x *= t, n) {
        const A = r[y] + x, T = r[y + 1] + x, M = r[y + 2] + x;
        r[y] = A > 255 ? 255 : A < 0 ? 0 : A, r[y + 1] = T > 255 ? 255 : T < 0 ? 0 : T, r[y + 2] = M > 255 ? 255 : M < 0 ? 0 : M;
      } else {
        let A = e - x;
        A < 0 ? A = 0 : A > 255 && (A = 255), r[y] = r[y + 1] = r[y + 2] = A;
      }
    } while (--m);
  } while (--_);
};
Li.Emboss = Mh;
Ut.Factory.addGetterSetter(Gi.Node, "embossStrength", 0.5, (0, ws.getNumberValidator)(), Ut.Factory.afterSetFilter);
Ut.Factory.addGetterSetter(Gi.Node, "embossWhiteLevel", 0.5, (0, ws.getNumberValidator)(), Ut.Factory.afterSetFilter);
Ut.Factory.addGetterSetter(Gi.Node, "embossDirection", "top-left", void 0, Ut.Factory.afterSetFilter);
Ut.Factory.addGetterSetter(Gi.Node, "embossBlend", !1, void 0, Ut.Factory.afterSetFilter);
var $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
$i.Enhance = void 0;
const Pr = V, Rh = et, Fh = $;
function gn(h, t, e, i, n) {
  const r = e - t, s = n - i;
  if (r === 0)
    return i + s / 2;
  if (s === 0)
    return i;
  let a = (h - t) / r;
  return a = s * a + i, a;
}
const Oh = function(h) {
  const t = h.data, e = t.length;
  let i = t[0], n = i, r, s = t[1], a = s, o, l = t[2], u = l, _;
  const p = this.enhance();
  if (p === 0)
    return;
  for (let c = 0; c < e; c += 4)
    r = t[c + 0], r < i ? i = r : r > n && (n = r), o = t[c + 1], o < s ? s = o : o > a && (a = o), _ = t[c + 2], _ < l ? l = _ : _ > u && (u = _);
  n === i && (n = 255, i = 0), a === s && (a = 255, s = 0), u === l && (u = 255, l = 0);
  let g, d, m, y, S, w;
  if (p > 0)
    g = n + p * (255 - n), d = i - p * (i - 0), m = a + p * (255 - a), y = s - p * (s - 0), S = u + p * (255 - u), w = l - p * (l - 0);
  else {
    const c = (n + i) * 0.5;
    g = n + p * (n - c), d = i + p * (i - c);
    const f = (a + s) * 0.5;
    m = a + p * (a - f), y = s + p * (s - f);
    const b = (u + l) * 0.5;
    S = u + p * (u - b), w = l + p * (l - b);
  }
  for (let c = 0; c < e; c += 4)
    t[c + 0] = gn(t[c + 0], i, n, d, g), t[c + 1] = gn(t[c + 1], s, a, y, m), t[c + 2] = gn(t[c + 2], l, u, w, S);
};
$i.Enhance = Oh;
Pr.Factory.addGetterSetter(Rh.Node, "enhance", 0, (0, Fh.getNumberValidator)(), Pr.Factory.afterSetFilter);
var Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.Grayscale = void 0;
const Nh = function(h) {
  const t = h.data, e = t.length;
  for (let i = 0; i < e; i += 4) {
    const n = 0.34 * t[i] + 0.5 * t[i + 1] + 0.16 * t[i + 2];
    t[i] = n, t[i + 1] = n, t[i + 2] = n;
  }
};
Di.Grayscale = Nh;
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
Ii.HSL = void 0;
const ye = V, In = et, Un = $;
ye.Factory.addGetterSetter(In.Node, "hue", 0, (0, Un.getNumberValidator)(), ye.Factory.afterSetFilter);
ye.Factory.addGetterSetter(In.Node, "saturation", 0, (0, Un.getNumberValidator)(), ye.Factory.afterSetFilter);
ye.Factory.addGetterSetter(In.Node, "luminance", 0, (0, Un.getNumberValidator)(), ye.Factory.afterSetFilter);
const Lh = function(h) {
  const t = h.data, e = t.length, i = 1, n = Math.pow(2, this.saturation()), r = Math.abs(this.hue() + 360) % 360, s = this.luminance() * 127, a = i * n * Math.cos(r * Math.PI / 180), o = i * n * Math.sin(r * Math.PI / 180), l = 0.299 * i + 0.701 * a + 0.167 * o, u = 0.587 * i - 0.587 * a + 0.33 * o, _ = 0.114 * i - 0.114 * a - 0.497 * o, p = 0.299 * i - 0.299 * a - 0.328 * o, g = 0.587 * i + 0.413 * a + 0.035 * o, d = 0.114 * i - 0.114 * a + 0.293 * o, m = 0.299 * i - 0.3 * a + 1.25 * o, y = 0.587 * i - 0.586 * a - 1.05 * o, S = 0.114 * i + 0.886 * a - 0.2 * o;
  let w, c, f, b;
  for (let x = 0; x < e; x += 4)
    w = t[x + 0], c = t[x + 1], f = t[x + 2], b = t[x + 3], t[x + 0] = l * w + u * c + _ * f + s, t[x + 1] = p * w + g * c + d * f + s, t[x + 2] = m * w + y * c + S * f + s, t[x + 3] = b;
};
Ii.HSL = Lh;
var Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.HSV = void 0;
const be = V, Bn = et, Vn = $, Gh = function(h) {
  const t = h.data, e = t.length, i = Math.pow(2, this.value()), n = Math.pow(2, this.saturation()), r = Math.abs(this.hue() + 360) % 360, s = i * n * Math.cos(r * Math.PI / 180), a = i * n * Math.sin(r * Math.PI / 180), o = 0.299 * i + 0.701 * s + 0.167 * a, l = 0.587 * i - 0.587 * s + 0.33 * a, u = 0.114 * i - 0.114 * s - 0.497 * a, _ = 0.299 * i - 0.299 * s - 0.328 * a, p = 0.587 * i + 0.413 * s + 0.035 * a, g = 0.114 * i - 0.114 * s + 0.293 * a, d = 0.299 * i - 0.3 * s + 1.25 * a, m = 0.587 * i - 0.586 * s - 1.05 * a, y = 0.114 * i + 0.886 * s - 0.2 * a;
  for (let S = 0; S < e; S += 4) {
    const w = t[S + 0], c = t[S + 1], f = t[S + 2], b = t[S + 3];
    t[S + 0] = o * w + l * c + u * f, t[S + 1] = _ * w + p * c + g * f, t[S + 2] = d * w + m * c + y * f, t[S + 3] = b;
  }
};
Ui.HSV = Gh;
be.Factory.addGetterSetter(Bn.Node, "hue", 0, (0, Vn.getNumberValidator)(), be.Factory.afterSetFilter);
be.Factory.addGetterSetter(Bn.Node, "saturation", 0, (0, Vn.getNumberValidator)(), be.Factory.afterSetFilter);
be.Factory.addGetterSetter(Bn.Node, "value", 0, (0, Vn.getNumberValidator)(), be.Factory.afterSetFilter);
var Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.Invert = void 0;
const $h = function(h) {
  const t = h.data, e = t.length;
  for (let i = 0; i < e; i += 4)
    t[i] = 255 - t[i], t[i + 1] = 255 - t[i + 1], t[i + 2] = 255 - t[i + 2];
};
Bi.Invert = $h;
var Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
Vi.Kaleidoscope = void 0;
const ri = V, xs = et, Er = nt, As = $, Dh = function(h, t, e) {
  const i = h.data, n = t.data, r = h.width, s = h.height, a = e.polarCenterX || r / 2, o = e.polarCenterY || s / 2;
  let l = Math.sqrt(a * a + o * o), u = r - a, _ = s - o;
  const p = Math.sqrt(u * u + _ * _);
  l = p > l ? p : l;
  const g = s, d = r, m = 360 / d * Math.PI / 180;
  for (let y = 0; y < d; y += 1) {
    const S = Math.sin(y * m), w = Math.cos(y * m);
    for (let c = 0; c < g; c += 1) {
      u = Math.floor(a + l * c / g * w), _ = Math.floor(o + l * c / g * S);
      let f = (_ * r + u) * 4;
      const b = i[f + 0], x = i[f + 1], P = i[f + 2], v = i[f + 3];
      f = (y + c * r) * 4, n[f + 0] = b, n[f + 1] = x, n[f + 2] = P, n[f + 3] = v;
    }
  }
}, Ih = function(h, t, e) {
  const i = h.data, n = t.data, r = h.width, s = h.height, a = e.polarCenterX || r / 2, o = e.polarCenterY || s / 2;
  let l = Math.sqrt(a * a + o * o), u = r - a, _ = s - o;
  const p = Math.sqrt(u * u + _ * _);
  l = p > l ? p : l;
  const g = s, d = r, m = 0;
  let y, S;
  for (u = 0; u < r; u += 1)
    for (_ = 0; _ < s; _ += 1) {
      const w = u - a, c = _ - o, f = Math.sqrt(w * w + c * c) * g / l;
      let b = (Math.atan2(c, w) * 180 / Math.PI + 360 + m) % 360;
      b = b * d / 360, y = Math.floor(b), S = Math.floor(f);
      let x = (S * r + y) * 4;
      const P = i[x + 0], v = i[x + 1], E = i[x + 2], A = i[x + 3];
      x = (_ * r + u) * 4, n[x + 0] = P, n[x + 1] = v, n[x + 2] = E, n[x + 3] = A;
    }
}, Uh = function(h) {
  const t = h.width, e = h.height;
  let i, n, r, s, a, o, l, u, _, p, g = Math.round(this.kaleidoscopePower());
  const d = Math.round(this.kaleidoscopeAngle()), m = Math.floor(t * (d % 360) / 360);
  if (g < 1)
    return;
  const y = Er.Util.createCanvasElement();
  y.width = t, y.height = e;
  const S = y.getContext("2d").getImageData(0, 0, t, e);
  Er.Util.releaseCanvas(y), Dh(h, S, {
    polarCenterX: t / 2,
    polarCenterY: e / 2
  });
  let w = t / Math.pow(2, g);
  for (; w <= 8; )
    w = w * 2, g -= 1;
  w = Math.ceil(w);
  let c = w, f = 0, b = c, x = 1;
  for (m + w > t && (f = c, b = 0, x = -1), n = 0; n < e; n += 1)
    for (i = f; i !== b; i += x)
      r = Math.round(i + m) % t, _ = (t * n + r) * 4, a = S.data[_ + 0], o = S.data[_ + 1], l = S.data[_ + 2], u = S.data[_ + 3], p = (t * n + i) * 4, S.data[p + 0] = a, S.data[p + 1] = o, S.data[p + 2] = l, S.data[p + 3] = u;
  for (n = 0; n < e; n += 1)
    for (c = Math.floor(w), s = 0; s < g; s += 1) {
      for (i = 0; i < c + 1; i += 1)
        _ = (t * n + i) * 4, a = S.data[_ + 0], o = S.data[_ + 1], l = S.data[_ + 2], u = S.data[_ + 3], p = (t * n + c * 2 - i - 1) * 4, S.data[p + 0] = a, S.data[p + 1] = o, S.data[p + 2] = l, S.data[p + 3] = u;
      c *= 2;
    }
  Ih(S, h, {});
};
Vi.Kaleidoscope = Uh;
ri.Factory.addGetterSetter(xs.Node, "kaleidoscopePower", 2, (0, As.getNumberValidator)(), ri.Factory.afterSetFilter);
ri.Factory.addGetterSetter(xs.Node, "kaleidoscopeAngle", 0, (0, As.getNumberValidator)(), ri.Factory.afterSetFilter);
var Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.Mask = void 0;
const Tr = V, Bh = et, Vh = $;
function Ke(h, t, e) {
  let i = (e * h.width + t) * 4;
  const n = [];
  return n.push(h.data[i++], h.data[i++], h.data[i++], h.data[i++]), n;
}
function Me(h, t) {
  return Math.sqrt(Math.pow(h[0] - t[0], 2) + Math.pow(h[1] - t[1], 2) + Math.pow(h[2] - t[2], 2));
}
function Hh(h) {
  const t = [0, 0, 0];
  for (let e = 0; e < h.length; e++)
    t[0] += h[e][0], t[1] += h[e][1], t[2] += h[e][2];
  return t[0] /= h.length, t[1] /= h.length, t[2] /= h.length, t;
}
function zh(h, t) {
  const e = Ke(h, 0, 0), i = Ke(h, h.width - 1, 0), n = Ke(h, 0, h.height - 1), r = Ke(h, h.width - 1, h.height - 1), s = t || 10;
  if (Me(e, i) < s && Me(i, r) < s && Me(r, n) < s && Me(n, e) < s) {
    const a = Hh([i, e, r, n]), o = [];
    for (let l = 0; l < h.width * h.height; l++) {
      const u = Me(a, [
        h.data[l * 4],
        h.data[l * 4 + 1],
        h.data[l * 4 + 2]
      ]);
      o[l] = u < s ? 0 : 255;
    }
    return o;
  }
}
function Wh(h, t) {
  for (let e = 0; e < h.width * h.height; e++)
    h.data[4 * e + 3] = t[e];
}
function jh(h, t, e) {
  const i = [1, 1, 1, 1, 0, 1, 1, 1, 1], n = Math.round(Math.sqrt(i.length)), r = Math.floor(n / 2), s = [];
  for (let a = 0; a < e; a++)
    for (let o = 0; o < t; o++) {
      const l = a * t + o;
      let u = 0;
      for (let _ = 0; _ < n; _++)
        for (let p = 0; p < n; p++) {
          const g = a + _ - r, d = o + p - r;
          if (g >= 0 && g < e && d >= 0 && d < t) {
            const m = g * t + d, y = i[_ * n + p];
            u += h[m] * y;
          }
        }
      s[l] = u === 255 * 8 ? 255 : 0;
    }
  return s;
}
function Yh(h, t, e) {
  const i = [1, 1, 1, 1, 1, 1, 1, 1, 1], n = Math.round(Math.sqrt(i.length)), r = Math.floor(n / 2), s = [];
  for (let a = 0; a < e; a++)
    for (let o = 0; o < t; o++) {
      const l = a * t + o;
      let u = 0;
      for (let _ = 0; _ < n; _++)
        for (let p = 0; p < n; p++) {
          const g = a + _ - r, d = o + p - r;
          if (g >= 0 && g < e && d >= 0 && d < t) {
            const m = g * t + d, y = i[_ * n + p];
            u += h[m] * y;
          }
        }
      s[l] = u >= 255 * 4 ? 255 : 0;
    }
  return s;
}
function Xh(h, t, e) {
  const i = [0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111], n = Math.round(Math.sqrt(i.length)), r = Math.floor(n / 2), s = [];
  for (let a = 0; a < e; a++)
    for (let o = 0; o < t; o++) {
      const l = a * t + o;
      let u = 0;
      for (let _ = 0; _ < n; _++)
        for (let p = 0; p < n; p++) {
          const g = a + _ - r, d = o + p - r;
          if (g >= 0 && g < e && d >= 0 && d < t) {
            const m = g * t + d, y = i[_ * n + p];
            u += h[m] * y;
          }
        }
      s[l] = u;
    }
  return s;
}
const Kh = function(h) {
  const t = this.threshold();
  let e = zh(h, t);
  return e && (e = jh(e, h.width, h.height), e = Yh(e, h.width, h.height), e = Xh(e, h.width, h.height), Wh(h, e)), h;
};
Hi.Mask = Kh;
Tr.Factory.addGetterSetter(Bh.Node, "threshold", 0, (0, Vh.getNumberValidator)(), Tr.Factory.afterSetFilter);
var zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.Noise = void 0;
const Mr = V, qh = et, Jh = $, Qh = function(h) {
  const t = this.noise() * 255, e = h.data, i = e.length, n = t / 2;
  for (let r = 0; r < i; r += 4)
    e[r + 0] += n - 2 * n * Math.random(), e[r + 1] += n - 2 * n * Math.random(), e[r + 2] += n - 2 * n * Math.random();
};
zi.Noise = Qh;
Mr.Factory.addGetterSetter(qh.Node, "noise", 0.2, (0, Jh.getNumberValidator)(), Mr.Factory.afterSetFilter);
var Wi = {};
Object.defineProperty(Wi, "__esModule", { value: !0 });
Wi.Pixelate = void 0;
const Rr = V, Zh = nt, tl = et, el = $, il = function(h) {
  let t = Math.ceil(this.pixelSize()), e = h.width, i = h.height, n = Math.ceil(e / t), r = Math.ceil(i / t), s = h.data;
  if (t <= 0) {
    Zh.Util.error("pixelSize value can not be <= 0");
    return;
  }
  for (let a = 0; a < n; a += 1)
    for (let o = 0; o < r; o += 1) {
      let l = 0, u = 0, _ = 0, p = 0;
      const g = a * t, d = g + t, m = o * t, y = m + t;
      let S = 0;
      for (let w = g; w < d; w += 1)
        if (!(w >= e))
          for (let c = m; c < y; c += 1) {
            if (c >= i)
              continue;
            const f = (e * c + w) * 4;
            l += s[f + 0], u += s[f + 1], _ += s[f + 2], p += s[f + 3], S += 1;
          }
      l = l / S, u = u / S, _ = _ / S, p = p / S;
      for (let w = g; w < d; w += 1)
        if (!(w >= e))
          for (let c = m; c < y; c += 1) {
            if (c >= i)
              continue;
            const f = (e * c + w) * 4;
            s[f + 0] = l, s[f + 1] = u, s[f + 2] = _, s[f + 3] = p;
          }
    }
};
Wi.Pixelate = il;
Rr.Factory.addGetterSetter(tl.Node, "pixelSize", 8, (0, el.getNumberValidator)(), Rr.Factory.afterSetFilter);
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.Posterize = void 0;
const Fr = V, nl = et, rl = $, sl = function(h) {
  const t = Math.round(this.levels() * 254) + 1, e = h.data, i = e.length, n = 255 / t;
  for (let r = 0; r < i; r += 1)
    e[r] = Math.floor(e[r] / n) * n;
};
ji.Posterize = sl;
Fr.Factory.addGetterSetter(nl.Node, "levels", 0.5, (0, rl.getNumberValidator)(), Fr.Factory.afterSetFilter);
var Yi = {};
Object.defineProperty(Yi, "__esModule", { value: !0 });
Yi.RGB = void 0;
const si = V, Hn = et, al = $, ol = function(h) {
  const t = h.data, e = t.length, i = this.red(), n = this.green(), r = this.blue();
  for (let s = 0; s < e; s += 4) {
    const a = (0.34 * t[s] + 0.5 * t[s + 1] + 0.16 * t[s + 2]) / 255;
    t[s] = a * i, t[s + 1] = a * n, t[s + 2] = a * r, t[s + 3] = t[s + 3];
  }
};
Yi.RGB = ol;
si.Factory.addGetterSetter(Hn.Node, "red", 0, function(h) {
  return this._filterUpToDate = !1, h > 255 ? 255 : h < 0 ? 0 : Math.round(h);
});
si.Factory.addGetterSetter(Hn.Node, "green", 0, function(h) {
  return this._filterUpToDate = !1, h > 255 ? 255 : h < 0 ? 0 : Math.round(h);
});
si.Factory.addGetterSetter(Hn.Node, "blue", 0, al.RGBComponent, si.Factory.afterSetFilter);
var Xi = {};
Object.defineProperty(Xi, "__esModule", { value: !0 });
Xi.RGBA = void 0;
const De = V, Ki = et, hl = $, ll = function(h) {
  const t = h.data, e = t.length, i = this.red(), n = this.green(), r = this.blue(), s = this.alpha();
  for (let a = 0; a < e; a += 4) {
    const o = 1 - s;
    t[a] = i * s + t[a] * o, t[a + 1] = n * s + t[a + 1] * o, t[a + 2] = r * s + t[a + 2] * o;
  }
};
Xi.RGBA = ll;
De.Factory.addGetterSetter(Ki.Node, "red", 0, function(h) {
  return this._filterUpToDate = !1, h > 255 ? 255 : h < 0 ? 0 : Math.round(h);
});
De.Factory.addGetterSetter(Ki.Node, "green", 0, function(h) {
  return this._filterUpToDate = !1, h > 255 ? 255 : h < 0 ? 0 : Math.round(h);
});
De.Factory.addGetterSetter(Ki.Node, "blue", 0, hl.RGBComponent, De.Factory.afterSetFilter);
De.Factory.addGetterSetter(Ki.Node, "alpha", 1, function(h) {
  return this._filterUpToDate = !1, h > 1 ? 1 : h < 0 ? 0 : h;
});
var qi = {};
Object.defineProperty(qi, "__esModule", { value: !0 });
qi.Sepia = void 0;
const cl = function(h) {
  const t = h.data, e = t.length;
  for (let i = 0; i < e; i += 4) {
    const n = t[i + 0], r = t[i + 1], s = t[i + 2];
    t[i + 0] = Math.min(255, n * 0.393 + r * 0.769 + s * 0.189), t[i + 1] = Math.min(255, n * 0.349 + r * 0.686 + s * 0.168), t[i + 2] = Math.min(255, n * 0.272 + r * 0.534 + s * 0.131);
  }
};
qi.Sepia = cl;
var Ji = {};
Object.defineProperty(Ji, "__esModule", { value: !0 });
Ji.Solarize = void 0;
const dl = function(h) {
  const t = h.data, e = h.width, i = h.height, n = e * 4;
  let r = i;
  do {
    const s = (r - 1) * n;
    let a = e;
    do {
      const o = s + (a - 1) * 4;
      let l = t[o], u = t[o + 1], _ = t[o + 2];
      l > 127 && (l = 255 - l), u > 127 && (u = 255 - u), _ > 127 && (_ = 255 - _), t[o] = l, t[o + 1] = u, t[o + 2] = _;
    } while (--a);
  } while (--r);
};
Ji.Solarize = dl;
var Qi = {};
Object.defineProperty(Qi, "__esModule", { value: !0 });
Qi.Threshold = void 0;
const Or = V, ul = et, fl = $, gl = function(h) {
  const t = this.threshold() * 255, e = h.data, i = e.length;
  for (let n = 0; n < i; n += 1)
    e[n] = e[n] < t ? 0 : 255;
};
Qi.Threshold = gl;
Or.Factory.addGetterSetter(ul.Node, "threshold", 0.5, (0, fl.getNumberValidator)(), Or.Factory.afterSetFilter);
Object.defineProperty(hi, "__esModule", { value: !0 });
hi.Konva = void 0;
const Nr = Wr, pl = fi, _l = _i, ml = bi, yl = vi, bl = Si, Lr = me, vl = Ve, Sl = xe, Cl = ze, wl = xi, xl = Ai, Al = ki, kl = Pi, Pl = ke, El = Ei, Tl = Ti, Ml = Mi, Rl = Fi, Fl = Oi, Ol = Ni, Nl = Li, Ll = $i, Gl = Di, $l = Ii, Dl = Ui, Il = Bi, Ul = Vi, Bl = Hi, Vl = zi, Hl = Wi, zl = ji, Wl = Yi, jl = Xi, Yl = qi, Xl = Ji, Kl = Qi;
hi.Konva = Nr.Konva.Util._assign(Nr.Konva, {
  Arc: pl.Arc,
  Arrow: _l.Arrow,
  Circle: ml.Circle,
  Ellipse: yl.Ellipse,
  Image: bl.Image,
  Label: Lr.Label,
  Tag: Lr.Tag,
  Line: vl.Line,
  Path: Sl.Path,
  Rect: Cl.Rect,
  RegularPolygon: wl.RegularPolygon,
  Ring: xl.Ring,
  Sprite: Al.Sprite,
  Star: kl.Star,
  Text: Pl.Text,
  TextPath: El.TextPath,
  Transformer: Tl.Transformer,
  Wedge: Ml.Wedge,
  Filters: {
    Blur: Rl.Blur,
    Brighten: Fl.Brighten,
    Contrast: Ol.Contrast,
    Emboss: Nl.Emboss,
    Enhance: Ll.Enhance,
    Grayscale: Gl.Grayscale,
    HSL: $l.HSL,
    HSV: Dl.HSV,
    Invert: Il.Invert,
    Kaleidoscope: Ul.Kaleidoscope,
    Mask: Bl.Mask,
    Noise: Vl.Noise,
    Pixelate: Hl.Pixelate,
    Posterize: zl.Posterize,
    RGB: Wl.RGB,
    RGBA: jl.RGBA,
    Sepia: Yl.Sepia,
    Solarize: Xl.Solarize,
    Threshold: Kl.Threshold
  }
});
var ql = En.exports;
Object.defineProperty(ql, "__esModule", { value: !0 });
const Jl = hi;
En.exports = Jl.Konva;
var Ql = En.exports;
const Q = /* @__PURE__ */ Ks(Ql);
function zn(h) {
  return h.split(".", 1)[0] ?? "";
}
function Zl(h, t, e) {
  const i = t == null ? void 0 : t.attributes.friendly_name;
  return typeof i == "string" && i.trim() ? i : e != null && e.name ? e.name : h.entity_id;
}
function Gr(h, t, e) {
  return h.label_mode === "off" ? "" : h.label_mode === "short" ? h.entity_id.split(".").at(-1) ?? h.entity_id : Zl(h, t, e);
}
function ks(h, t) {
  var n;
  if (!h) return "";
  if (!t) return "Unavailable";
  const e = h.source === "attr" && h.attr ? t.attributes[h.attr] : t.state;
  if (e == null || e === "")
    return "Unavailable";
  const i = String(e);
  return (n = h.format) != null && n.includes("{value}") ? h.format.split("{value}").join(i) : i;
}
function qe(h, t, e = "primary") {
  return ks(h.bind[e], t);
}
function $r(h, t) {
  return h != null && h.entity_id ? ks(h, t[h.entity_id]) : "";
}
function tc(h, t) {
  return (h ?? []).filter((e) => {
    var i;
    return ((i = t[e.entity_id]) == null ? void 0 : i.state) === e.when.state_is;
  });
}
function ec(h, t) {
  if (!t) return !0;
  const { domains: e, tags: i, area_ids: n } = t.filters;
  return !(e != null && e.length && !e.includes(zn(h.entity_id)) || i != null && i.length && !i.some((r) => h.tags.includes(r)) || n != null && n.length && (!h.area_id || !n.includes(h.area_id)));
}
function Dr(h) {
  return !h || ["unavailable", "unknown"].includes(h.state) ? "#9e9e9e" : ["on", "open", "playing", "home", "heat"].includes(h.state) ? "#ffb300" : "#1976d2";
}
function ic(h) {
  const t = {
    binary_sensor: "B",
    climate: "T",
    device_tracker: "N",
    light: "L",
    media_player: "M",
    sensor: "S",
    switch: "P"
  }, e = zn(h);
  return t[e] ?? e.slice(0, 1).toUpperCase() ?? "?";
}
function nc(h) {
  const t = zn(h);
  return t === "climate" ? ["heating"] : t === "device_tracker" ? ["network"] : [];
}
var rc = Object.defineProperty, gt = (h, t, e, i) => {
  for (var n = void 0, r = h.length - 1, s; r >= 0; r--)
    (s = h[r]) && (n = s(t, e, n) || n);
  return n && rc(t, e, n), n;
};
const sc = 4e6, ac = 2e7, oc = 500, Wn = class Wn extends Oe {
  constructor() {
    super(...arguments), this.narrow = !1, this._config = null, this._loading = !0, this._editMode = !1, this._currentView = "all", this._currentPlanId = null, this._selectedAreaId = null, this._selectedMarkerId = null, this._haAreas = [], this._haEntities = [], this._entityToAdd = "", this._entitySearch = "", this._entityDomainFilter = "", this._entityAreaFilter = "", this._notice = "", this._error = "", this._stage = null, this._backgroundLayer = null, this._resizeObserver = null, this._areasLayer = null, this._markersLayer = null, this._areaShapes = /* @__PURE__ */ new Map(), this._markerGroups = /* @__PURE__ */ new Map(), this._renderGeneration = 0, this._initializeTimer = null, this._liveRefreshTimer = null;
  }
  get _canEdit() {
    var t, e;
    return ((e = (t = this.hass) == null ? void 0 : t.user) == null ? void 0 : e.is_admin) === !0;
  }
  async connectedCallback() {
    super.connectedCallback(), await this._loadConfig(), this._canEdit && await this._loadRegistry();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._initializeTimer !== null && (window.clearTimeout(this._initializeTimer), this._initializeTimer = null), this._liveRefreshTimer !== null && (window.clearTimeout(this._liveRefreshTimer), this._liveRefreshTimer = null), this._destroyStage();
  }
  async _loadConfig() {
    this._loading = !0;
    try {
      this._config = await this.hass.callWS({
        type: "floorplan_ui/get_config"
      }), this._config.plans.length > 0 && (this._currentPlanId = this._config.plans[0].plan_id), this._config.default_view && this._config.views.some((t) => {
        var e;
        return t.id === ((e = this._config) == null ? void 0 : e.default_view);
      }) && (this._currentView = this._config.default_view);
    } catch (t) {
      console.error("Failed to load floorplan config:", t), this._config = { version: 1, plans: [], views: [] }, this._setError("Floorplan configuration could not be loaded.");
    }
    this._loading = !1;
  }
  async saveConfig() {
    if (!this._config || !this._canEdit) return !1;
    try {
      return await this.hass.callWS({
        type: "floorplan_ui/save_config",
        config: this._config
      }), this._setNotice("Changes saved."), !0;
    } catch (t) {
      return console.error("Failed to save floorplan config:", t), this._setError("Changes could not be saved."), !1;
    }
  }
  async updated(t) {
    t.has("_loading") && !this._loading && !this._stage && (await this.updateComplete, this._initializeTimer = window.setTimeout(() => {
      this._initializeTimer = null, this._initializeStage();
    }, 100)), t.has("_currentPlanId") && this._stage && (this._selectedAreaId = null, this._selectedMarkerId = null, this._renderFloorplan()), t.has("_currentView") && this._stage && (this._renderAreas(this._getCurrentPlan()), this._renderMarkers(this._getCurrentPlan())), t.has("hass") && (!this._canEdit && this._editMode && (this._editMode = !1, this._selectedAreaId = null, this._selectedMarkerId = null, this._syncCanvasInteractivity()), this._scheduleLiveRefresh());
  }
  _scheduleLiveRefresh() {
    this._liveRefreshTimer === null && (this._liveRefreshTimer = window.setTimeout(() => {
      this._liveRefreshTimer = null, this._refreshMarkerLiveValues(), this._editMode || this._renderAreas(this._getCurrentPlan());
    }, oc));
  }
  _setNotice(t) {
    this._error = "", this._notice = t;
  }
  _setError(t) {
    this._notice = "", this._error = t;
  }
  _initializeStage() {
    const t = this.renderRoot.querySelector(".canvas-wrapper");
    if (!t) {
      console.warn("Canvas container not found");
      return;
    }
    const e = t.getBoundingClientRect(), i = Math.max(e.width, 400), n = Math.max(e.height, 300);
    console.info(`Initializing Konva stage: ${i}x${n}`), this._stage = new Q.Stage({
      container: t,
      width: i,
      height: n,
      draggable: !0
    }), this._backgroundLayer = new Q.Layer(), this._stage.add(this._backgroundLayer), this._areasLayer = new Q.Layer(), this._stage.add(this._areasLayer), this._markersLayer = new Q.Layer(), this._stage.add(this._markersLayer), this._stage.on("click", (r) => {
      this._editMode && r.target === this._stage && (this._selectedAreaId = null, this._selectedMarkerId = null, this._renderAreas(this._getCurrentPlan()), this._syncCanvasInteractivity());
    }), this._stage.on("wheel", (r) => {
      r.evt.preventDefault();
      const s = this._stage.scaleX(), a = this._stage.getPointerPosition();
      if (!a) return;
      const o = {
        x: (a.x - this._stage.x()) / s,
        y: (a.y - this._stage.y()) / s
      }, l = this._getCurrentPlan(), u = (l == null ? void 0 : l.view.minZoom) ?? 0.1, _ = (l == null ? void 0 : l.view.maxZoom) ?? 5, g = (r.evt.deltaY > 0 ? -1 : 1) > 0 ? s * 1.1 : s / 1.1, d = Math.max(u, Math.min(_, g));
      this._stage.scale({ x: d, y: d }), this._stage.position({
        x: a.x - o.x * d,
        y: a.y - o.y * d
      });
    }), this._resizeObserver = new ResizeObserver((r) => {
      for (const s of r) {
        const { width: a, height: o } = s.contentRect;
        a > 0 && o > 0 && this._stage && (this._stage.width(a), this._stage.height(o));
      }
    }), this._resizeObserver.observe(t), this._renderFloorplan();
  }
  _destroyStage() {
    var t, e;
    this._renderGeneration += 1, (t = this._resizeObserver) == null || t.disconnect(), (e = this._stage) == null || e.destroy(), this._stage = null, this._backgroundLayer = null, this._areasLayer = null, this._markersLayer = null, this._areaShapes.clear(), this._markerGroups.clear();
  }
  _getCurrentPlan() {
    if (!this._config || !this._currentPlanId) return null;
    const t = this._config.plans.find((e) => e.plan_id === this._currentPlanId) || null;
    return !t && this._config.plans.length > 0 ? (this._currentPlanId = this._config.plans[0].plan_id, this._config.plans[0]) : t;
  }
  _renderFloorplan() {
    var r, s, a, o, l;
    if (!this._stage || !this._backgroundLayer) return;
    const t = ++this._renderGeneration;
    this._backgroundLayer.destroyChildren(), (r = this._areasLayer) == null || r.destroyChildren(), (s = this._markersLayer) == null || s.destroyChildren(), this._areaShapes.clear(), this._markerGroups.clear();
    const e = this._getCurrentPlan(), i = this._stage.width(), n = this._stage.height();
    if (!e)
      this._drawEmptyState(i, n);
    else if ((a = e.background) != null && a.url) {
      this._renderAreas(e), this._renderMarkers(e);
      const u = new Image();
      u.onload = () => {
        if (t !== this._renderGeneration || e.plan_id !== this._currentPlanId)
          return;
        const _ = new Q.Image({
          x: 0,
          y: 0,
          image: u,
          width: e.background.width || u.width,
          height: e.background.height || u.height
        });
        this._backgroundLayer.add(_);
        try {
          this._backgroundLayer.batchDraw(), this._fitToScreen(_.width(), _.height());
        } catch (p) {
          console.error("Error rendering floorplan image:", p), this._backgroundLayer.destroyChildren(), this._drawImageErrorState(i, n);
        }
      }, u.onerror = () => {
        t === this._renderGeneration && (console.error("Failed to load floorplan image"), this._backgroundLayer.destroyChildren(), this._drawImageErrorState(i, n));
      }, u.src = e.background.url;
    } else e && (this._renderAreas(e), this._renderMarkers(e));
    this._backgroundLayer.batchDraw(), (o = this._areasLayer) == null || o.batchDraw(), (l = this._markersLayer) == null || l.batchDraw();
  }
  _fitToScreen(t, e) {
    if (!this._stage) return;
    const i = this._stage.width(), n = this._stage.height(), r = Math.min(i / t, n / e) * 0.9;
    this._stage.scale({ x: r, y: r }), this._stage.position({
      x: (i - t * r) / 2,
      y: (n - e * r) / 2
    });
  }
  _toggleEditMode() {
    this._canEdit && (this._editMode = !this._editMode, this._editMode || (this._selectedAreaId = null, this._selectedMarkerId = null), this._renderAreas(this._getCurrentPlan()), this._syncCanvasInteractivity());
  }
  _selectPlan(t) {
    if (!this._config) return;
    const i = t.target.value || null;
    this._currentPlanId = i;
  }
  _renameCurrentPlan() {
    if (!this._canEdit || !this._config || !this._currentPlanId) return;
    const t = this._config.plans.find((n) => n.plan_id === this._currentPlanId);
    if (!t) return;
    const e = window.prompt("Rename plan", t.name);
    if (!e) return;
    const i = e.trim();
    !i || i === t.name || (this._config = {
      ...this._config,
      plans: this._config.plans.map(
        (n) => n.plan_id === this._currentPlanId ? { ...n, name: i } : n
      )
    }, this.saveConfig());
  }
  _deleteCurrentPlan() {
    if (!this._canEdit || !this._config || !this._currentPlanId || !window.confirm("Delete current plan? This cannot be undone.")) return;
    const t = this._config.plans.filter((e) => e.plan_id !== this._currentPlanId);
    this._config = {
      ...this._config,
      plans: t
    }, t.length > 0 ? this._currentPlanId = t[0].plan_id : this._currentPlanId = null, this.saveConfig(), this._renderFloorplan();
  }
  _renderAreas(t) {
    var i;
    if (!this._areasLayer || !t) return;
    this._areasLayer.destroyChildren(), this._areaShapes.clear();
    const e = this._getCurrentView();
    for (const n of t.areas ?? []) {
      const r = e == null ? void 0 : e.filters.area_ids;
      if (r != null && r.length && (!n.area_id || !r.includes(n.area_id)))
        continue;
      const s = e == null ? void 0 : e.filters.tags;
      if (s != null && s.length && !s.some((u) => n.tags.includes(u)))
        continue;
      const { shape: a, style: o } = n;
      let l;
      if (a.type === "polygon" && (((i = a.points) == null ? void 0 : i.length) ?? 0) >= 6)
        l = new Q.Line({
          x: a.x ?? 0,
          y: a.y ?? 0,
          points: a.points,
          closed: !0,
          fill: o.fill ?? "#2196f3",
          stroke: o.stroke ?? "#1976d2",
          strokeWidth: o.strokeWidth ?? 2,
          opacity: o.fillOpacity ?? 0.4,
          draggable: this._editMode
        });
      else if (a.type === "rect")
        l = new Q.Rect({
          x: a.x ?? 0,
          y: a.y ?? 0,
          width: a.width ?? 100,
          height: a.height ?? 80,
          fill: o.fill ?? "#2196f3",
          stroke: o.stroke ?? "#1976d2",
          strokeWidth: o.strokeWidth ?? 2,
          opacity: o.fillOpacity ?? 0.4,
          draggable: this._editMode
        });
      else
        continue;
      l.on("click", (u) => {
        u.cancelBubble = !0, this._editMode && this._onAreaSelected(n.id);
      }), l.on("dragend", () => {
        if (!this._editMode) return;
        const u = l.position();
        this._updateAreaShape(n.id, {
          x: u.x,
          y: u.y
        }), this._renderAreas(this._getCurrentPlan());
      }), this._areasLayer.add(l), this._areaShapes.set(n.id, l), this._addAreaAnnotation(n, l, e), this._editMode && this._selectedAreaId === n.id && (a.type === "polygon" && l instanceof Q.Line ? this._addPolygonAnchors(n, l) : a.type === "rect" && l instanceof Q.Rect && this._addRectangleTransformer(n.id, l));
    }
    this._syncCanvasInteractivity();
  }
  _addAreaAnnotation(t, e, i) {
    var u, _, p, g;
    if (!this._areasLayer) return;
    const n = [], r = (u = this._haAreas.find((d) => d.id === t.area_id)) == null ? void 0 : u.name;
    t.area_id && n.push(r ?? t.area_id);
    const s = $r((_ = i == null ? void 0 : i.area_overlay) == null ? void 0 : _.primary, this.hass.states), a = $r((p = i == null ? void 0 : i.area_overlay) == null ? void 0 : p.secondary, this.hass.states);
    s && n.push(s), a && n.push(a);
    for (const d of tc((g = i == null ? void 0 : i.area_overlay) == null ? void 0 : g.badges, this.hass.states))
      n.push(`${d.icon ? `${d.icon} ` : ""}${d.label ?? d.entity_id}`);
    if (!n.length) return;
    const o = e.getClientRect({ relativeTo: this._areasLayer }), l = new Q.Label({
      x: o.x + 8,
      y: o.y + 8,
      listening: !1
    });
    l.add(
      new Q.Tag({
        fill: "rgba(255,255,255,0.88)",
        cornerRadius: 4,
        shadowColor: "rgba(0,0,0,0.25)",
        shadowBlur: 3
      }),
      new Q.Text({
        text: n.join(`
`),
        fontSize: 13,
        fontStyle: "bold",
        fill: "#0d47a1",
        padding: 5,
        lineHeight: 1.2
      })
    ), this._areasLayer.add(l);
  }
  _addPolygonAnchors(t, e) {
    if (!this._areasLayer || !t.shape.points) return;
    const i = [...t.shape.points], n = t.shape.x ?? 0, r = t.shape.y ?? 0;
    for (let s = 0; s < i.length; s += 2) {
      const a = new Q.Circle({
        x: n + i[s],
        y: r + i[s + 1],
        radius: 7,
        fill: "#ffffff",
        stroke: "#d32f2f",
        strokeWidth: 3,
        draggable: !0
      });
      a.on("dragmove", () => {
        var o;
        i[s] = a.x() - n, i[s + 1] = a.y() - r, e.points(i), (o = this._areasLayer) == null || o.batchDraw();
      }), a.on("dragend", () => {
        this._updateAreaShape(t.id, { points: [...i] }), this._renderAreas(this._getCurrentPlan());
      }), this._areasLayer.add(a);
    }
  }
  _addRectangleTransformer(t, e) {
    if (!this._areasLayer) return;
    const i = new Q.Transformer({
      nodes: [e],
      rotateEnabled: !1,
      keepRatio: !1,
      anchorSize: 9,
      boundBoxFunc: (n, r) => r.width < 20 || r.height < 20 ? n : r
    });
    e.on("transformend", () => {
      const n = Math.max(20, e.width() * e.scaleX()), r = Math.max(20, e.height() * e.scaleY());
      e.scale({ x: 1, y: 1 }), this._updateAreaShape(t, {
        x: e.x(),
        y: e.y(),
        width: n,
        height: r
      }), this._renderAreas(this._getCurrentPlan());
    }), this._areasLayer.add(i);
  }
  _syncCanvasInteractivity() {
    var e, i, n, r;
    const t = new Map(
      (((e = this._getCurrentPlan()) == null ? void 0 : e.areas) ?? []).map((s) => [s.id, s])
    );
    for (const [s, a] of this._areaShapes.entries()) {
      a.draggable(this._editMode);
      const o = ((i = t.get(s)) == null ? void 0 : i.style.strokeWidth) ?? 2;
      a.strokeWidth(o + (this._selectedAreaId === s ? 2 : 0));
    }
    for (const [s, a] of this._markerGroups.entries()) {
      a.draggable(this._editMode);
      const o = a.findOne(".marker-dot");
      o == null || o.strokeWidth(this._selectedMarkerId === s ? 4 : 2);
    }
    (n = this._areasLayer) == null || n.batchDraw(), (r = this._markersLayer) == null || r.batchDraw();
  }
  _drawEmptyState(t, e) {
    const i = new Q.Rect({
      x: 0,
      y: 0,
      width: t,
      height: e,
      fill: "#f5f5f5"
    });
    this._backgroundLayer.add(i);
    const n = new Q.Text({
      x: t / 2,
      y: e / 2 - 50,
      text: "🏠",
      fontSize: 48
    });
    n.offsetX(n.width() / 2), this._backgroundLayer.add(n);
    const r = new Q.Text({
      x: t / 2,
      y: e / 2 + 10,
      text: "No Floorplan Loaded",
      fontSize: 20,
      fontStyle: "bold",
      fill: "#333"
    });
    r.offsetX(r.width() / 2), this._backgroundLayer.add(r);
    const s = new Q.Text({
      x: t / 2,
      y: e / 2 + 40,
      text: 'Click "Edit" → "Upload Image" to get started',
      fontSize: 14,
      fill: "#666"
    });
    s.offsetX(s.width() / 2), this._backgroundLayer.add(s);
  }
  _drawImageErrorState(t, e) {
    const i = new Q.Rect({
      x: 0,
      y: 0,
      width: t,
      height: e,
      fill: "#fff3e0"
    });
    this._backgroundLayer.add(i);
    const n = new Q.Text({
      x: t / 2,
      y: e / 2 - 10,
      text: "Failed to load floorplan image",
      fontSize: 18,
      fontStyle: "bold",
      fill: "#e65100"
    });
    n.offsetX(n.width() / 2), this._backgroundLayer.add(n);
    const r = new Q.Text({
      x: t / 2,
      y: e / 2 + 20,
      text: "Try re-uploading the image in Edit mode.",
      fontSize: 14,
      fill: "#e65100"
    });
    r.offsetX(r.width() / 2), this._backgroundLayer.add(r);
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
    if (!this._canEdit || !this._config || !this._stage) return;
    const e = this._getCurrentPlan();
    if (!e) return;
    const i = this._getVisibleCanvasCenter(), n = this._newId("area"), r = {
      id: n,
      area_id: "",
      shape: t === "polygon" ? {
        type: "polygon",
        x: i.x,
        y: i.y,
        points: [-120, -70, 100, -90, 140, 60, -80, 90]
      } : {
        type: "rect",
        x: i.x - 120,
        y: i.y - 80,
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
    }, s = this._config.plans.map(
      (a) => a.plan_id === e.plan_id ? { ...a, areas: [...a.areas ?? [], r] } : a
    );
    this._config = {
      ...this._config,
      plans: s
    }, this._selectedAreaId = n, this._selectedMarkerId = null, this.saveConfig(), this._renderFloorplan();
  }
  _updateAreaShape(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._getCurrentPlan();
    if (!i) return;
    const n = this._config.plans.map((r) => r.plan_id !== i.plan_id ? r : {
      ...r,
      areas: (r.areas ?? []).map(
        (s) => s.id === t ? {
          ...s,
          shape: {
            ...s.shape,
            ...e
          }
        } : s
      )
    });
    this._config = {
      ...this._config,
      plans: n
    }, this.saveConfig();
  }
  async _loadRegistry() {
    if (this._canEdit)
      try {
        const t = await this.hass.callWS({
          type: "floorplan_ui/list_registry"
        });
        this._haAreas = t.areas, this._haEntities = t.entities.sort(
          (e, i) => e.entity_id.localeCompare(i.entity_id)
        );
      } catch (t) {
        console.error("Failed to load Home Assistant registry:", t), this._haAreas = [], this._haEntities = [], this._setError("Home Assistant areas and entities could not be loaded.");
      }
  }
  _getSelectedArea() {
    if (!this._config || !this._selectedAreaId) return null;
    const t = this._getCurrentPlan();
    return t ? (t.areas ?? []).find((e) => e.id === this._selectedAreaId) ?? null : null;
  }
  _onBindAreaChange(t) {
    if (!this._canEdit || !this._config || !this._selectedAreaId) return;
    const i = t.target.value, n = this._getCurrentPlan();
    if (!n) return;
    const r = this._config.plans.map((s) => s.plan_id !== n.plan_id ? s : {
      ...s,
      areas: (s.areas ?? []).map(
        (a) => a.id === this._selectedAreaId ? { ...a, area_id: i } : a
      )
    });
    this._config = {
      ...this._config,
      plans: r
    }, this.saveConfig(), this._renderAreas(this._getCurrentPlan());
  }
  _onAreaTagsChange(t) {
    const e = this._getSelectedArea(), i = this._getCurrentPlan();
    if (!e || !i || !this._config) return;
    const n = t.target.value.split(",").map((r) => r.trim()).filter(Boolean);
    this._config = {
      ...this._config,
      plans: this._config.plans.map(
        (r) => r.plan_id === i.plan_id ? {
          ...r,
          areas: r.areas.map(
            (s) => s.id === e.id ? { ...s, tags: [...new Set(n)] } : s
          )
        } : r
      )
    }, this.saveConfig(), this._renderAreas(this._getCurrentPlan());
  }
  _deleteSelectedArea() {
    if (!this._canEdit || !this._config || !this._selectedAreaId) return;
    const t = this._getCurrentPlan();
    if (!t || !window.confirm("Delete selected area? This cannot be undone.")) return;
    const e = this._config.plans.map((i) => i.plan_id !== t.plan_id ? i : {
      ...i,
      areas: (i.areas ?? []).filter((n) => n.id !== this._selectedAreaId)
    });
    this._config = {
      ...this._config,
      plans: e
    }, this._selectedAreaId = null, this.saveConfig(), this._renderFloorplan();
  }
  _renderMarkers(t) {
    if (!this._markersLayer || (this._markersLayer.destroyChildren(), this._markerGroups.clear(), !t)) return;
    const e = this._getCurrentView(), i = new Map(this._haEntities.map((n) => [n.entity_id, n]));
    for (const n of t.markers ?? []) {
      if (!ec(n, e)) continue;
      const r = this.hass.states[n.entity_id], s = i.get(n.entity_id), a = Gr(n, r, s), o = n.label_mode !== "off", l = new Q.Group({
        x: n.pos.x,
        y: n.pos.y,
        draggable: this._editMode
      }), u = new Q.Circle({
        name: "marker-dot",
        radius: 19,
        fill: Dr(r),
        stroke: "#ffffff",
        strokeWidth: this._selectedMarkerId === n.id ? 4 : 2,
        shadowColor: "#000000",
        shadowBlur: 5,
        shadowOpacity: 0.25
      }), _ = new Q.Text({
        x: -10,
        y: -10,
        width: 20,
        align: "center",
        text: ic(n.entity_id),
        fill: "#ffffff",
        fontSize: 16,
        fontStyle: "bold",
        listening: !1
      }), p = new Q.Text({
        name: "marker-label",
        x: 26,
        y: -17,
        text: o ? a : "",
        fill: "#212121",
        fontSize: 13,
        fontStyle: "bold",
        padding: 2,
        listening: !1
      }), g = new Q.Text({
        name: "marker-value",
        x: 26,
        y: 1,
        text: [qe(n, r), qe(n, r, "secondary")].filter(Boolean).join(" · "),
        fill: "#424242",
        fontSize: 12,
        padding: 2,
        listening: !1
      });
      l.add(u, _, p, g), l.on("click", (d) => {
        d.cancelBubble = !0, this._editMode ? (this._selectedMarkerId = n.id, this._selectedAreaId = null, this._syncCanvasInteractivity()) : this._openMoreInfo(n.entity_id);
      }), l.on("dragend", () => {
        this._editMode && this._updateMarker(n.id, { pos: l.position() });
      }), l.on("mouseenter", () => {
        this._stage && (this._stage.container().style.cursor = "pointer");
      }), l.on("mouseleave", () => {
        this._stage && (this._stage.container().style.cursor = "default");
      }), this._markersLayer.add(l), this._markerGroups.set(n.id, l);
    }
    this._markersLayer.batchDraw();
  }
  _refreshMarkerLiveValues() {
    const t = this._getCurrentPlan();
    if (!t || !this._markersLayer) return;
    const e = new Map(this._haEntities.map((i) => [i.entity_id, i]));
    for (const i of t.markers ?? []) {
      const n = this._markerGroups.get(i.id);
      if (!n) continue;
      const r = this.hass.states[i.entity_id], s = n.findOne(".marker-dot"), a = n.findOne(".marker-value"), o = n.findOne(".marker-label");
      s == null || s.fill(Dr(r)), a == null || a.text(
        [qe(i, r), qe(i, r, "secondary")].filter(Boolean).join(" · ")
      ), o == null || o.text(Gr(i, r, e.get(i.entity_id)));
    }
    this._markersLayer.batchDraw();
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
    const n = this._haEntities.find((s) => s.entity_id === t);
    if (!n && !this.hass.states[t]) {
      this._setError("Select an existing Home Assistant entity.");
      return;
    }
    const r = {
      id: this._newId("marker"),
      entity_id: t,
      area_id: (n == null ? void 0 : n.area_id) ?? null,
      pos: e,
      icon: (n == null ? void 0 : n.icon) ?? "mdi:circle",
      label_mode: "auto",
      tags: nc(t),
      bind: { primary: { source: "state" } }
    };
    this._config = {
      ...this._config,
      plans: this._config.plans.map(
        (s) => s.plan_id === i.plan_id ? { ...s, markers: [...s.markers, r] } : s
      )
    }, this._selectedMarkerId = r.id, this._selectedAreaId = null, this._entityToAdd = "", this.saveConfig(), this._renderMarkers(this._getCurrentPlan());
  }
  _onEntityDragStart(t, e) {
    var i, n;
    (i = e.dataTransfer) == null || i.setData("application/x-floorplan-entity", t), (n = e.dataTransfer) == null || n.setData("text/plain", t), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
  }
  _onCanvasDragOver(t) {
    !this._editMode || !this._getCurrentPlan() || (t.preventDefault(), t.dataTransfer && (t.dataTransfer.dropEffect = "copy"), t.currentTarget.classList.add("drag-target"));
  }
  _onCanvasDragLeave(t) {
    t.currentTarget.classList.remove("drag-target");
  }
  _onCanvasDrop(t) {
    var a, o;
    t.preventDefault();
    const e = t.currentTarget;
    if (e.classList.remove("drag-target"), !this._editMode || !this._stage) return;
    const i = ((a = t.dataTransfer) == null ? void 0 : a.getData("application/x-floorplan-entity")) || ((o = t.dataTransfer) == null ? void 0 : o.getData("text/plain"));
    if (!i) return;
    const n = e.getBoundingClientRect(), s = this._stage.getAbsoluteTransform().copy().invert().point({
      x: t.clientX - n.left,
      y: t.clientY - n.top
    });
    this._addMarkerAt(i, s);
  }
  _updateMarker(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._getCurrentPlan();
    i && (this._config = {
      ...this._config,
      plans: this._config.plans.map(
        (n) => n.plan_id === i.plan_id ? {
          ...n,
          markers: n.markers.map(
            (r) => r.id === t ? { ...r, ...e } : r
          )
        } : n
      )
    }, this.saveConfig());
  }
  _onMarkerTagsChange(t) {
    const e = this._getSelectedMarker();
    if (!e) return;
    const i = t.target.value.split(",").map((n) => n.trim()).filter(Boolean);
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
    const n = this._getSelectedMarker();
    if (!n) return;
    const r = i.target.value, s = n.bind[t] ?? { source: "state" }, a = {
      ...s,
      [e]: e === "source" ? r : r || void 0,
      ...e === "source" && r === "attr" && !s.attr ? { attr: "friendly_name" } : {},
      ...e === "attr" && s.source === "attr" && !r ? { attr: "friendly_name" } : {}
    };
    this._updateMarker(n.id, {
      bind: { ...n.bind, [t]: a }
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
  _deleteSelectedMarker() {
    if (!this._canEdit || !this._config || !this._selectedMarkerId) return;
    const t = this._getCurrentPlan();
    !t || !window.confirm("Delete selected marker?") || (this._config = {
      ...this._config,
      plans: this._config.plans.map(
        (e) => e.plan_id === t.plan_id ? {
          ...e,
          markers: e.markers.filter((i) => i.id !== this._selectedMarkerId)
        } : e
      )
    }, this._selectedMarkerId = null, this.saveConfig(), this._renderMarkers(this._getCurrentPlan()));
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
  _getCurrentView() {
    var t;
    return (t = this._config) == null ? void 0 : t.views.find((e) => e.id === this._currentView);
  }
  _setView(t) {
    this._currentView = t;
  }
  _addView() {
    var r;
    if (!this._canEdit || !this._config) return;
    const t = (r = window.prompt("New view name")) == null ? void 0 : r.trim();
    if (!t) return;
    const e = t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "view";
    let i = e, n = 2;
    for (; this._config.views.some((s) => s.id === i); )
      i = `${e}-${n++}`;
    this._config = {
      ...this._config,
      views: [...this._config.views, { id: i, name: t, filters: {} }]
    }, this._currentView = i, this.saveConfig();
  }
  _renameCurrentView() {
    var i;
    if (!this._canEdit || !this._config) return;
    const t = this._getCurrentView();
    if (!t) return;
    const e = (i = window.prompt("Rename view", t.name)) == null ? void 0 : i.trim();
    !e || e === t.name || (this._config = {
      ...this._config,
      views: this._config.views.map(
        (n) => n.id === t.id ? { ...n, name: e } : n
      )
    }, this.saveConfig());
  }
  _moveCurrentView(t) {
    if (!this._canEdit || !this._config) return;
    const e = this._config.views.findIndex((r) => r.id === this._currentView), i = e + t;
    if (e < 0 || i < 0 || i >= this._config.views.length) return;
    const n = [...this._config.views];
    [n[e], n[i]] = [n[i], n[e]], this._config = { ...this._config, views: n }, this.saveConfig();
  }
  _setDefaultView() {
    var t;
    !this._canEdit || !this._config || (this._config = { ...this._config, default_view: this._currentView }, this.saveConfig(), this._setNotice(`“${((t = this._getCurrentView()) == null ? void 0 : t.name) ?? this._currentView}” is the default view.`));
  }
  _deleteCurrentView() {
    var n;
    if (!this._canEdit || !this._config || this._currentView === "all" || this._config.views.length <= 1 || !window.confirm("Delete the current view?")) return;
    const t = this._currentView, e = this._config.views.filter((r) => r.id !== t), i = ((n = e.find((r) => r.id === "all")) == null ? void 0 : n.id) ?? e[0].id;
    this._config = {
      ...this._config,
      default_view: this._config.default_view === t ? i : this._config.default_view,
      views: e
    }, this._currentView = i, this.saveConfig();
  }
  _updateViewFilter(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = e.target.value.split(",").map((n) => n.trim()).filter(Boolean);
    this._config = {
      ...this._config,
      views: this._config.views.map((n) => {
        if (n.id !== this._currentView) return n;
        const r = { ...n.filters };
        return r[t] = i.length ? [...new Set(i)] : void 0, { ...n, filters: r };
      })
    }, this.saveConfig(), this._renderMarkers(this._getCurrentPlan()), this._renderAreas(this._getCurrentPlan());
  }
  _updateAreaOverlayValue(t, e, i) {
    if (!this._canEdit || !this._config) return;
    const n = i.target.value.trim();
    this._config = {
      ...this._config,
      views: this._config.views.map((r) => {
        if (r.id !== this._currentView) return r;
        const s = { ...r.area_overlay };
        if (e === "entity_id" && !n)
          delete s[t];
        else {
          const a = s[t] ?? {
            mode: "entity",
            entity_id: n,
            source: "state"
          };
          if (e !== "entity_id" && !a.entity_id) return r;
          s[t] = {
            ...a,
            [e]: e === "source" ? n : n || void 0,
            ...e === "source" && n === "attr" && !a.attr ? { attr: "friendly_name" } : {},
            ...e === "attr" && a.source === "attr" && !n ? { attr: "friendly_name" } : {}
          };
        }
        return { ...r, area_overlay: s };
      })
    }, this.saveConfig(), this._renderAreas(this._getCurrentPlan());
  }
  _updateAreaBadges(t) {
    if (!this._canEdit || !this._config) return;
    const i = t.target.value.split(",").map((n) => n.trim()).filter(Boolean).flatMap((n) => {
      const [r, s] = n.split(":", 2), [a, o] = r.split("=", 2).map((u) => u.trim());
      if (!a || !o) return [];
      const l = s == null ? void 0 : s.trim();
      return [
        {
          entity_id: a,
          when: { state_is: o },
          ...l ? { label: l } : {}
        }
      ];
    });
    this._config = {
      ...this._config,
      views: this._config.views.map(
        (n) => n.id === this._currentView ? {
          ...n,
          area_overlay: { ...n.area_overlay, badges: i.length ? i : void 0 }
        } : n
      )
    }, this.saveConfig(), this._renderAreas(this._getCurrentPlan());
  }
  _updateAreaStyle(t, e) {
    const i = this._getSelectedArea();
    if (!i) return;
    const n = e.target;
    let r = t === "fill" || t === "stroke" ? n.value : Number(n.value);
    if (typeof r == "number" && !Number.isFinite(r)) return;
    t === "fillOpacity" && typeof r == "number" && (r = Math.max(0, Math.min(1, r))), t === "strokeWidth" && typeof r == "number" && (r = Math.max(0, Math.min(50, r)));
    const s = this._getCurrentPlan();
    !this._config || !s || (this._config = {
      ...this._config,
      plans: this._config.plans.map(
        (a) => a.plan_id === s.plan_id ? {
          ...a,
          areas: a.areas.map(
            (o) => o.id === i.id ? { ...o, style: { ...o.style, [t]: r } } : o
          )
        } : a
      )
    }, this.saveConfig(), this._renderAreas(this._getCurrentPlan()));
  }
  _exportConfig() {
    if (!this._config) return;
    const t = new Blob([JSON.stringify(this._config, null, 2)], {
      type: "application/json"
    }), e = URL.createObjectURL(t), i = document.createElement("a");
    i.href = e, i.download = "floorplan-ui-0.1.1.json", i.click(), URL.revokeObjectURL(e), this._setNotice("Configuration exported.");
  }
  _triggerConfigImport() {
    var t;
    this._canEdit && ((t = this.renderRoot.querySelector(".config-file-input")) == null || t.click());
  }
  async _handleConfigImport(t) {
    var n, r, s;
    if (!this._canEdit) return;
    const e = t.target, i = (n = e.files) == null ? void 0 : n[0];
    if (e.value = "", !!i) {
      if (i.size > ac) {
        this._setError("The configuration file must not exceed 20 MB.");
        return;
      }
      try {
        const a = JSON.parse(await i.text());
        if (!a || typeof a != "object" || Array.isArray(a))
          throw new Error("The JSON root must be an object.");
        const o = await this.hass.callWS({
          type: "floorplan_ui/validate_config",
          config: a
        }), l = o.config.plans.length, u = o.config.views.length;
        if (!window.confirm(`Import ${l} plan(s) and ${u} view(s)?`) || (this._config = o.config, this._currentPlanId = ((r = o.config.plans[0]) == null ? void 0 : r.plan_id) ?? null, this._currentView = o.config.views.some((p) => p.id === o.config.default_view) ? o.config.default_view ?? "all" : ((s = o.config.views[0]) == null ? void 0 : s.id) ?? "all", this._selectedAreaId = null, this._selectedMarkerId = null, !await this.saveConfig())) return;
        this._renderFloorplan(), this._setNotice("Configuration imported and saved.");
      } catch (a) {
        console.error("Failed to import floorplan config:", a);
        const o = a instanceof Error ? a.message : "The file is not a valid configuration.";
        this._setError(`Import failed: ${o}`);
      }
    }
  }
  _handleFileUpload(t) {
    var r;
    if (!this._canEdit) return;
    const e = t.target, i = (r = e.files) == null ? void 0 : r[0];
    if (e.value = "", !i) return;
    if (!["image/png", "image/jpeg"].includes(i.type)) {
      this._setError("Only PNG and JPEG floorplans are supported.");
      return;
    }
    if (i.size > sc) {
      this._setError("The floorplan image must not exceed 4 MB.");
      return;
    }
    const n = new FileReader();
    n.onload = (s) => {
      var l;
      const a = (l = s.target) == null ? void 0 : l.result, o = new Image();
      o.onload = () => {
        this._createNewPlan(i.name, a, o.width, o.height);
      }, o.onerror = () => this._setError("The selected image could not be decoded."), o.src = a;
    }, n.onerror = () => this._setError("The selected image could not be read."), n.readAsDataURL(i);
  }
  _createNewPlan(t, e, i, n) {
    if (!this._canEdit || !this._config) return;
    const r = this._newId("plan"), s = {
      plan_id: r,
      name: t.replace(/\.[^.]+$/, ""),
      background: { type: "image", url: e, width: i, height: n },
      areas: [],
      markers: [],
      view: { minZoom: 0.1, maxZoom: 5 }
    };
    this._config = {
      ...this._config,
      plans: [...this._config.plans, s]
    }, this._currentPlanId = r, this.saveConfig(), this._renderFloorplan();
  }
  _triggerFileUpload() {
    var t;
    (t = this.renderRoot.querySelector(".file-input")) == null || t.click();
  }
  _getVisibleCanvasCenter() {
    return this._stage ? this._stage.getAbsoluteTransform().copy().invert().point({
      x: this._stage.width() / 2,
      y: this._stage.height() / 2
    }) : { x: 0, y: 0 };
  }
  _newId(t) {
    const e = Math.random().toString(36).slice(2, 9);
    return `${t}_${Date.now().toString(36)}_${e}`;
  }
  render() {
    var _, p, g, d, m, y, S, w, c, f, b, x, P, v, E, A, T, M, F, L, O, X, j;
    const t = [
      { id: "all", name: "All", filters: {} },
      { id: "heating", name: "Heating", filters: { tags: ["heating"] } },
      { id: "lights", name: "Lights", filters: { domains: ["light", "switch"] } },
      { id: "network", name: "Network", filters: { tags: ["network"] } },
      { id: "entertainment", name: "Entertainment", filters: { domains: ["media_player"] } }
    ], e = (_ = this._config) != null && _.views.length ? this._config.views : t, i = ((p = this._config) == null ? void 0 : p.plans) ?? [], n = this._getCurrentPlan(), r = this._getCurrentView(), s = this._getSelectedArea(), a = this._getSelectedMarker(), o = this._entitySearch.trim().toLowerCase(), l = [...new Set(this._haEntities.map((k) => k.domain))].sort(), u = this._haEntities.filter((k) => {
      var H;
      const U = !o || k.entity_id.toLowerCase().includes(o) || !!((H = k.name) != null && H.toLowerCase().includes(o)), I = !this._entityDomainFilter || k.domain === this._entityDomainFilter, N = !this._entityAreaFilter || k.area_id === this._entityAreaFilter;
      return U && I && N;
    }).slice(0, 250);
    return lt`
      <div class="container">
        <div class="toolbar">
          <div class="toolbar-left">
            <h1>Floorplan</h1>
            <div class="plan-select">
              <span>Plan:</span>
              <select @change=${this._selectPlan} .value=${(n == null ? void 0 : n.plan_id) ?? ""}>
                <option value="">${i.length === 0 ? "No plans" : "Select plan"}</option>
                ${i.map((k) => lt`<option value=${k.plan_id}>${k.name}</option>`)}
              </select>
            </div>
            <div class="view-tabs">
              ${e.map(
      (k) => {
        var U;
        return lt`
                  <button
                    class="view-tab ${this._currentView === k.id ? "active" : ""}"
                    @click=${() => this._setView(k.id)}
                  >
                    ${k.id === ((U = this._config) == null ? void 0 : U.default_view) ? "★ " : ""}${k.name}
                  </button>
                `;
      }
    )}
            </div>
          </div>
          <div class="toolbar-right">
            ${this._canEdit ? lt`
                  <button
                    class="edit-toggle ${this._editMode ? "active" : ""}"
                    @click=${this._toggleEditMode}
                  >
                    ${this._editMode ? "Done" : "Edit"}
                  </button>
                ` : lt`<span class="viewer-note">View only</span>`}
          </div>
        </div>

        ${this._notice ? lt`<div class="status">${this._notice}</div>` : ""}
        ${this._error ? lt`<div class="status error">${this._error}</div>` : ""}
        ${this._editMode ? lt`
              <div class="edit-toolbar">
                <button @click=${this._triggerFileUpload}>Upload Image</button>
                <button ?disabled=${!n} @click=${this._renameCurrentPlan}>
                  Rename Plan
                </button>
                <button ?disabled=${!n} @click=${this._deleteCurrentPlan}>
                  Delete Plan
                </button>
                <button ?disabled=${!n} @click=${this._addAreaRect}>+ Rectangle</button>
                <button ?disabled=${!n} @click=${this._addAreaPolygon}>+ Polygon</button>
                <button @click=${this._addView}>+ View</button>
                <button @click=${this._renameCurrentView}>Rename View</button>
                <button @click=${() => this._moveCurrentView(-1)}>← View</button>
                <button @click=${() => this._moveCurrentView(1)}>View →</button>
                <button @click=${this._setDefaultView}>Set Default</button>
                <button ?disabled=${this._currentView === "all"} @click=${this._deleteCurrentView}>
                  Delete View
                </button>
                <button @click=${this._exportConfig}>Export JSON</button>
                <button @click=${this._triggerConfigImport}>Import JSON</button>
              </div>
              <div class="edit-toolbar">
                <label>
                  Search entity:
                  <input
                    class="grow"
                    type="search"
                    .value=${this._entitySearch}
                    @input=${(k) => this._entitySearch = k.target.value}
                    placeholder="light.kitchen"
                  />
                </label>
                <label>
                  Domain:
                  <select
                    .value=${this._entityDomainFilter}
                    @change=${(k) => this._entityDomainFilter = k.target.value}
                  >
                    <option value="">All domains</option>
                    ${l.map(
      (k) => lt`<option value=${k}>${k}</option>`
    )}
                  </select>
                </label>
                <label>
                  HA Area:
                  <select
                    .value=${this._entityAreaFilter}
                    @change=${(k) => this._entityAreaFilter = k.target.value}
                  >
                    <option value="">All areas</option>
                    ${this._haAreas.map(
      (k) => lt`<option value=${k.id}>${k.name}</option>`
    )}
                  </select>
                </label>
                <select
                  class="grow"
                  .value=${this._entityToAdd}
                  @change=${(k) => this._entityToAdd = k.target.value}
                >
                  <option value="">Select entity (${this._haEntities.length})</option>
                  ${u.map(
      (k) => lt`
                      <option value=${k.entity_id}>
                        ${k.entity_id}${k.name ? ` — ${k.name}` : ""}
                      </option>
                    `
    )}
                </select>
                <button ?disabled=${!n || !this._entityToAdd} @click=${this._addMarker}>
                  + Marker
                </button>
              </div>
              <div class="edit-toolbar">
                <strong>Drag entity onto plan:</strong>
                <div class="entity-palette">
                  ${u.slice(0, 80).map(
      (k) => lt`
                      <div
                        class="entity-card"
                        draggable="true"
                        @dragstart=${(U) => this._onEntityDragStart(k.entity_id, U)}
                        title="Drag onto the floorplan"
                      >
                        <strong>${k.name ?? k.entity_id}</strong>
                        <span>${k.entity_id}</span>
                      </div>
                    `
    )}
                </div>
              </div>
              <div class="edit-toolbar">
                <strong>View “${(r == null ? void 0 : r.name) ?? this._currentView}” filters:</strong>
                <label>
                  Domains:
                  <input
                    .value=${((g = r == null ? void 0 : r.filters.domains) == null ? void 0 : g.join(", ")) ?? ""}
                    @change=${(k) => this._updateViewFilter("domains", k)}
                    placeholder="light, switch"
                  />
                </label>
                <label>
                  Tags:
                  <input
                    .value=${((d = r == null ? void 0 : r.filters.tags) == null ? void 0 : d.join(", ")) ?? ""}
                    @change=${(k) => this._updateViewFilter("tags", k)}
                    placeholder="heating"
                  />
                </label>
                <label>
                  Area IDs:
                  <input
                    .value=${((m = r == null ? void 0 : r.filters.area_ids) == null ? void 0 : m.join(", ")) ?? ""}
                    @change=${(k) => this._updateViewFilter("area_ids", k)}
                    placeholder="living_room"
                  />
                </label>
              </div>
              <div class="edit-toolbar">
                <strong>Area overlay:</strong>
                <label>
                  Primary entity:
                  <input
                    .value=${((S = (y = r == null ? void 0 : r.area_overlay) == null ? void 0 : y.primary) == null ? void 0 : S.entity_id) ?? ""}
                    @change=${(k) => this._updateAreaOverlayValue("primary", "entity_id", k)}
                    placeholder="sensor.living_room_temperature"
                  />
                </label>
                <label>
                  Source:
                  <select
                    .value=${((c = (w = r == null ? void 0 : r.area_overlay) == null ? void 0 : w.primary) == null ? void 0 : c.source) ?? "state"}
                    @change=${(k) => this._updateAreaOverlayValue("primary", "source", k)}
                  >
                    <option value="state">State</option>
                    <option value="attr">Attribute</option>
                  </select>
                </label>
                <label>
                  Attribute:
                  <input
                    .value=${((b = (f = r == null ? void 0 : r.area_overlay) == null ? void 0 : f.primary) == null ? void 0 : b.attr) ?? ""}
                    @change=${(k) => this._updateAreaOverlayValue("primary", "attr", k)}
                  />
                </label>
                <label>
                  Format:
                  <input
                    .value=${((P = (x = r == null ? void 0 : r.area_overlay) == null ? void 0 : x.primary) == null ? void 0 : P.format) ?? ""}
                    @change=${(k) => this._updateAreaOverlayValue("primary", "format", k)}
                    placeholder="{value} °C"
                  />
                </label>
              </div>
              <div class="edit-toolbar">
                <strong>Secondary / badges:</strong>
                <label>
                  Secondary entity:
                  <input
                    .value=${((E = (v = r == null ? void 0 : r.area_overlay) == null ? void 0 : v.secondary) == null ? void 0 : E.entity_id) ?? ""}
                    @change=${(k) => this._updateAreaOverlayValue("secondary", "entity_id", k)}
                  />
                </label>
                <label>
                  Source:
                  <select
                    .value=${((T = (A = r == null ? void 0 : r.area_overlay) == null ? void 0 : A.secondary) == null ? void 0 : T.source) ?? "state"}
                    @change=${(k) => this._updateAreaOverlayValue("secondary", "source", k)}
                  >
                    <option value="state">State</option>
                    <option value="attr">Attribute</option>
                  </select>
                </label>
                <label>
                  Attribute:
                  <input
                    .value=${((F = (M = r == null ? void 0 : r.area_overlay) == null ? void 0 : M.secondary) == null ? void 0 : F.attr) ?? ""}
                    @change=${(k) => this._updateAreaOverlayValue("secondary", "attr", k)}
                  />
                </label>
                <label>
                  Format:
                  <input
                    .value=${((O = (L = r == null ? void 0 : r.area_overlay) == null ? void 0 : L.secondary) == null ? void 0 : O.format) ?? ""}
                    @change=${(k) => this._updateAreaOverlayValue("secondary", "format", k)}
                  />
                </label>
                <label>
                  Badges:
                  <input
                    class="grow"
                    .value=${((j = (X = r == null ? void 0 : r.area_overlay) == null ? void 0 : X.badges) == null ? void 0 : j.map(
      (k) => `${k.entity_id}=${k.when.state_is}${k.label ? `:${k.label}` : ""}`
    ).join(", ")) ?? ""}
                    @change=${this._updateAreaBadges}
                    placeholder="binary_sensor.window=on:Window open"
                  />
                </label>
              </div>
              ${s ? lt`
                    <div class="edit-toolbar">
                      <span>Selected area:</span>
                      <strong>${s.id}</strong>
                      <label>
                        HA Area:
                        <select
                          @change=${this._onBindAreaChange}
                          .value=${s.area_id ?? ""}
                        >
                          <option value="">Unbound</option>
                          ${this._haAreas.map(
      (k) => lt`<option value=${k.id}>${k.name}</option>`
    )}
                        </select>
                      </label>
                      <label>
                        Tags:
                        <input
                          .value=${s.tags.join(", ")}
                          @change=${this._onAreaTagsChange}
                          placeholder="downstairs, heating"
                        />
                      </label>
                      <label>
                        Fill:
                        <input
                          type="color"
                          .value=${s.style.fill ?? "#2196f3"}
                          @change=${(k) => this._updateAreaStyle("fill", k)}
                        />
                      </label>
                      <label>
                        Stroke:
                        <input
                          type="color"
                          .value=${s.style.stroke ?? "#1976d2"}
                          @change=${(k) => this._updateAreaStyle("stroke", k)}
                        />
                      </label>
                      <label>
                        Opacity:
                        <input
                          type="number"
                          min="0"
                          max="1"
                          step="0.05"
                          .value=${String(s.style.fillOpacity)}
                          @change=${(k) => this._updateAreaStyle("fillOpacity", k)}
                        />
                      </label>
                      <label>
                        Stroke width:
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="1"
                          .value=${String(s.style.strokeWidth)}
                          @change=${(k) => this._updateAreaStyle("strokeWidth", k)}
                        />
                      </label>
                      <button @click=${this._deleteSelectedArea}>Delete Area</button>
                    </div>
                  ` : ""}
              ${a ? lt`
                    <div class="edit-toolbar">
                      <span>Selected marker:</span>
                      <strong>${a.entity_id}</strong>
                      <label>
                        Tags:
                        <input
                          .value=${a.tags.join(", ")}
                          @change=${this._onMarkerTagsChange}
                          placeholder="heating, downstairs"
                        />
                      </label>
                      <label>
                        HA Area:
                        <select
                          .value=${a.area_id ?? ""}
                          @change=${this._onMarkerAreaChange}
                        >
                          <option value="">Unbound</option>
                          ${this._haAreas.map(
      (k) => lt`<option value=${k.id}>${k.name}</option>`
    )}
                        </select>
                      </label>
                      <label>
                        Label:
                        <select
                          .value=${a.label_mode}
                          @change=${this._onMarkerLabelModeChange}
                        >
                          <option value="auto">Auto</option>
                          <option value="short">Short</option>
                          <option value="full">Full</option>
                          <option value="off">Off</option>
                        </select>
                      </label>
                      <label>
                        Primary:
                        <select
                          .value=${a.bind.primary.source}
                          @change=${(k) => this._updateMarkerBinding("primary", "source", k)}
                        >
                          <option value="state">State</option>
                          <option value="attr">Attribute</option>
                        </select>
                      </label>
                      <label>
                        Attribute:
                        <input
                          .value=${a.bind.primary.attr ?? ""}
                          @change=${(k) => this._updateMarkerBinding("primary", "attr", k)}
                        />
                      </label>
                      <label>
                        Format:
                        <input
                          .value=${a.bind.primary.format ?? ""}
                          @change=${(k) => this._updateMarkerBinding("primary", "format", k)}
                          placeholder="{value} °C"
                        />
                      </label>
                      ${a.bind.secondary ? lt`
                            <label>
                              Secondary:
                              <select
                                .value=${a.bind.secondary.source}
                                @change=${(k) => this._updateMarkerBinding("secondary", "source", k)}
                              >
                                <option value="state">State</option>
                                <option value="attr">Attribute</option>
                              </select>
                            </label>
                            <label>
                              Attribute:
                              <input
                                .value=${a.bind.secondary.attr ?? ""}
                                @change=${(k) => this._updateMarkerBinding("secondary", "attr", k)}
                              />
                            </label>
                            <label>
                              Format:
                              <input
                                .value=${a.bind.secondary.format ?? ""}
                                @change=${(k) => this._updateMarkerBinding("secondary", "format", k)}
                              />
                            </label>
                            <button @click=${this._removeMarkerSecondaryBinding}>
                              Remove Secondary
                            </button>
                          ` : lt`
                            <button @click=${this._addMarkerSecondaryBinding}>+ Secondary</button>
                          `}
                      <button @click=${this._deleteSelectedMarker}>Delete Marker</button>
                    </div>
                  ` : ""}
            ` : ""}

        <input
          type="file"
          class="file-input"
          accept="image/png,image/jpeg"
          @change=${this._handleFileUpload}
        />
        <input
          type="file"
          class="config-file-input"
          accept="application/json,.json"
          @change=${this._handleConfigImport}
        />

        <div
          class="canvas-container"
          @dragover=${this._onCanvasDragOver}
          @dragleave=${this._onCanvasDragLeave}
          @drop=${this._onCanvasDrop}
        >
          ${this._loading ? lt`<div class="loading">Loading...</div>` : lt`<div class="canvas-wrapper"></div>`}
        </div>
      </div>
    `;
  }
};
Wn.styles = Es`
    :host {
      display: block;
      height: 100%;
      background: var(--primary-background-color, #fafafa);
    }

    .container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: var(--app-header-background-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      min-height: 48px;
      box-sizing: border-box;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
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
      color: inherit;
      font-size: 14px;
    }

    .plan-select select {
      padding: 4px 8px;
      border-radius: 4px;
      border: none;
      font-size: 14px;
    }

    .view-tabs {
      display: flex;
      gap: 4px;
    }

    .view-tab {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.2);
      color: inherit;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
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

    .edit-toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #e8e8e8;
      border-bottom: 1px solid #ddd;
    }

    .edit-toolbar button {
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #fff;
      cursor: pointer;
      font-size: 14px;
    }

    .edit-toolbar button:hover {
      background: #f0f0f0;
    }

    .edit-toolbar input,
    .edit-toolbar select {
      min-width: 140px;
      padding: 6px 8px;
      border: 1px solid #bbb;
      border-radius: 4px;
      background: #fff;
    }

    .edit-toolbar .grow {
      flex: 1;
      min-width: 180px;
    }

    .entity-palette {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 4px 0;
      flex: 1;
      min-width: 240px;
    }

    .entity-card {
      display: flex;
      flex-direction: column;
      min-width: 180px;
      max-width: 240px;
      padding: 7px 10px;
      border: 1px solid #bbb;
      border-radius: 6px;
      background: #fff;
      cursor: grab;
      font-size: 12px;
      user-select: none;
    }

    .entity-card strong,
    .entity-card span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .entity-card span {
      color: #666;
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

    .viewer-note {
      font-size: 12px;
      opacity: 0.85;
    }

    @media (max-width: 900px) {
      .toolbar,
      .toolbar-left,
      .edit-toolbar {
        align-items: flex-start;
        flex-wrap: wrap;
      }

      .view-tabs {
        flex-wrap: wrap;
      }
    }
  `;
let ot = Wn;
gt([
  oi({ attribute: !1 })
], ot.prototype, "hass");
gt([
  oi({ type: Boolean })
], ot.prototype, "narrow");
gt([
  oi({ type: Object })
], ot.prototype, "panel");
gt([
  _t()
], ot.prototype, "_config");
gt([
  _t()
], ot.prototype, "_loading");
gt([
  _t()
], ot.prototype, "_editMode");
gt([
  _t()
], ot.prototype, "_currentView");
gt([
  _t()
], ot.prototype, "_currentPlanId");
gt([
  _t()
], ot.prototype, "_selectedAreaId");
gt([
  _t()
], ot.prototype, "_selectedMarkerId");
gt([
  _t()
], ot.prototype, "_haAreas");
gt([
  _t()
], ot.prototype, "_haEntities");
gt([
  _t()
], ot.prototype, "_entityToAdd");
gt([
  _t()
], ot.prototype, "_entitySearch");
gt([
  _t()
], ot.prototype, "_entityDomainFilter");
gt([
  _t()
], ot.prototype, "_entityAreaFilter");
gt([
  _t()
], ot.prototype, "_notice");
gt([
  _t()
], ot.prototype, "_error");
customElements.get("floorplan-ui-panel") || customElements.define("floorplan-ui-panel", ot);
console.info("%c FLOORPLAN-UI %c loaded ", "background: #3498db; color: white", "");

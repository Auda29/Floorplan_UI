/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qe = globalThis, wn = qe.ShadowRoot && (qe.ShadyCSS === void 0 || qe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, xn = Symbol(), Wn = /* @__PURE__ */ new WeakMap();
let $s = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== xn) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (wn && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Wn.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Wn.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Pr = (o) => new $s(typeof o == "string" ? o : o + "", void 0, xn), Ar = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((i, n, s) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + o[s + 1], o[0]);
  return new $s(e, o, xn);
}, kr = (o, t) => {
  if (wn) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), n = qe.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = e.cssText, o.appendChild(i);
  }
}, jn = wn ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Pr(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Er, defineProperty: Tr, getOwnPropertyDescriptor: Mr, getOwnPropertyNames: Rr, getOwnPropertySymbols: Fr, getPrototypeOf: Or } = Object, $t = globalThis, Yn = $t.trustedTypes, Nr = Yn ? Yn.emptyScript : "", Ji = $t.reactiveElementPolyfillSupport, Re = (o, t) => o, Ze = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? Nr : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, Pn = (o, t) => !Er(o, t), Xn = { attribute: !0, type: String, converter: Ze, reflect: !1, useDefault: !1, hasChanged: Pn };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), $t.litPropertyMetadata ?? ($t.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let ge = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Xn) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(t, i, e);
      n !== void 0 && Tr(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: n, set: s } = Mr(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: n, set(r) {
      const a = n == null ? void 0 : n.call(this);
      s == null || s.call(this, r), this.requestUpdate(t, a, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Xn;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Re("elementProperties"))) return;
    const t = Or(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Re("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Re("properties"))) {
      const e = this.properties, i = [...Rr(e), ...Fr(e)];
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
      for (const n of i) e.unshift(jn(n));
    } else t !== void 0 && e.push(jn(t));
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
    return kr(t, this.constructor.elementStyles), t;
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
    var s;
    const i = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, i);
    if (n !== void 0 && i.reflect === !0) {
      const r = (((s = i.converter) == null ? void 0 : s.toAttribute) !== void 0 ? i.converter : Ze).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var s, r;
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const a = i.getPropertyOptions(n), h = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((s = a.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? a.converter : Ze;
      this._$Em = n;
      const l = h.fromAttribute(e, a.type);
      this[n] = l ?? ((r = this._$Ej) == null ? void 0 : r.get(n)) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, n = !1, s) {
    var r;
    if (t !== void 0) {
      const a = this.constructor;
      if (n === !1 && (s = this[t]), i ?? (i = a.getPropertyOptions(t)), !((i.hasChanged ?? Pn)(s, e) || i.useDefault && i.reflect && s === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(a._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: n, wrapped: s }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), s !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [s, r] of this._$Ep) this[s] = r;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [s, r] of n) {
        const { wrapped: a } = r, h = this[s];
        a !== !0 || this._$AL.has(s) || h === void 0 || this.C(s, void 0, r, h);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((n) => {
        var s;
        return (s = n.hostUpdate) == null ? void 0 : s.call(n);
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
ge.elementStyles = [], ge.shadowRootOptions = { mode: "open" }, ge[Re("elementProperties")] = /* @__PURE__ */ new Map(), ge[Re("finalized")] = /* @__PURE__ */ new Map(), Ji == null || Ji({ ReactiveElement: ge }), ($t.reactiveElementVersions ?? ($t.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = globalThis, Kn = (o) => o, ti = Fe.trustedTypes, qn = ti ? ti.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, Us = "$lit$", It = `lit$${Math.random().toFixed(9).slice(2)}$`, Bs = "?" + It, Gr = `<${Bs}>`, Jt = document, Ne = () => Jt.createComment(""), Ge = (o) => o === null || typeof o != "object" && typeof o != "function", An = Array.isArray, Lr = (o) => An(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", Zi = `[ 	
\f\r]`, ke = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Qn = /-->/g, Jn = />/g, Yt = RegExp(`>|${Zi}(?:([^\\s"'>=/]+)(${Zi}*=${Zi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Zn = /'/g, ts = /"/g, Vs = /^(?:script|style|textarea|title)$/i, Dr = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), _t = Dr(1), pe = Symbol.for("lit-noChange"), ut = Symbol.for("lit-nothing"), es = /* @__PURE__ */ new WeakMap(), qt = Jt.createTreeWalker(Jt, 129);
function Hs(o, t) {
  if (!An(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return qn !== void 0 ? qn.createHTML(t) : t;
}
const Ir = (o, t) => {
  const e = o.length - 1, i = [];
  let n, s = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = ke;
  for (let a = 0; a < e; a++) {
    const h = o[a];
    let l, u, _ = -1, p = 0;
    for (; p < h.length && (r.lastIndex = p, u = r.exec(h), u !== null); ) p = r.lastIndex, r === ke ? u[1] === "!--" ? r = Qn : u[1] !== void 0 ? r = Jn : u[2] !== void 0 ? (Vs.test(u[2]) && (n = RegExp("</" + u[2], "g")), r = Yt) : u[3] !== void 0 && (r = Yt) : r === Yt ? u[0] === ">" ? (r = n ?? ke, _ = -1) : u[1] === void 0 ? _ = -2 : (_ = r.lastIndex - u[2].length, l = u[1], r = u[3] === void 0 ? Yt : u[3] === '"' ? ts : Zn) : r === ts || r === Zn ? r = Yt : r === Qn || r === Jn ? r = ke : (r = Yt, n = void 0);
    const g = r === Yt && o[a + 1].startsWith("/>") ? " " : "";
    s += r === ke ? h + Gr : _ >= 0 ? (i.push(l), h.slice(0, _) + Us + h.slice(_) + It + g) : h + It + (_ === -2 ? a : g);
  }
  return [Hs(o, s + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Le {
  constructor({ strings: t, _$litType$: e }, i) {
    let n;
    this.parts = [];
    let s = 0, r = 0;
    const a = t.length - 1, h = this.parts, [l, u] = Ir(t, e);
    if (this.el = Le.createElement(l, i), qt.currentNode = this.el.content, e === 2 || e === 3) {
      const _ = this.el.content.firstChild;
      _.replaceWith(..._.childNodes);
    }
    for (; (n = qt.nextNode()) !== null && h.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const _ of n.getAttributeNames()) if (_.endsWith(Us)) {
          const p = u[r++], g = n.getAttribute(_).split(It), d = /([.?@])?(.*)/.exec(p);
          h.push({ type: 1, index: s, name: d[2], strings: g, ctor: d[1] === "." ? Ur : d[1] === "?" ? Br : d[1] === "@" ? Vr : ri }), n.removeAttribute(_);
        } else _.startsWith(It) && (h.push({ type: 6, index: s }), n.removeAttribute(_));
        if (Vs.test(n.tagName)) {
          const _ = n.textContent.split(It), p = _.length - 1;
          if (p > 0) {
            n.textContent = ti ? ti.emptyScript : "";
            for (let g = 0; g < p; g++) n.append(_[g], Ne()), qt.nextNode(), h.push({ type: 2, index: ++s });
            n.append(_[p], Ne());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Bs) h.push({ type: 2, index: s });
      else {
        let _ = -1;
        for (; (_ = n.data.indexOf(It, _ + 1)) !== -1; ) h.push({ type: 7, index: s }), _ += It.length - 1;
      }
      s++;
    }
  }
  static createElement(t, e) {
    const i = Jt.createElement("template");
    return i.innerHTML = t, i;
  }
}
function _e(o, t, e = o, i) {
  var r, a;
  if (t === pe) return t;
  let n = i !== void 0 ? (r = e._$Co) == null ? void 0 : r[i] : e._$Cl;
  const s = Ge(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== s && ((a = n == null ? void 0 : n._$AO) == null || a.call(n, !1), s === void 0 ? n = void 0 : (n = new s(o), n._$AT(o, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = n : e._$Cl = n), n !== void 0 && (t = _e(o, n._$AS(o, t.values), n, i)), t;
}
class $r {
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
    const { el: { content: e }, parts: i } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? Jt).importNode(e, !0);
    qt.currentNode = n;
    let s = qt.nextNode(), r = 0, a = 0, h = i[0];
    for (; h !== void 0; ) {
      if (r === h.index) {
        let l;
        h.type === 2 ? l = new $e(s, s.nextSibling, this, t) : h.type === 1 ? l = new h.ctor(s, h.name, h.strings, this, t) : h.type === 6 && (l = new Hr(s, this, t)), this._$AV.push(l), h = i[++a];
      }
      r !== (h == null ? void 0 : h.index) && (s = qt.nextNode(), r++);
    }
    return qt.currentNode = Jt, n;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class $e {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, n) {
    this.type = 2, this._$AH = ut, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
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
    t = _e(this, t, e), Ge(t) ? t === ut || t == null || t === "" ? (this._$AH !== ut && this._$AR(), this._$AH = ut) : t !== this._$AH && t !== pe && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Lr(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== ut && Ge(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Jt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var s;
    const { values: e, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Le.createElement(Hs(i.h, i.h[0]), this.options)), i);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === n) this._$AH.p(e);
    else {
      const r = new $r(n, this), a = r.u(this.options);
      r.p(e), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = es.get(t.strings);
    return e === void 0 && es.set(t.strings, e = new Le(t)), e;
  }
  k(t) {
    An(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, n = 0;
    for (const s of t) n === e.length ? e.push(i = new $e(this.O(Ne()), this.O(Ne()), this, this.options)) : i = e[n], i._$AI(s), n++;
    n < e.length && (this._$AR(i && i._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const n = Kn(t).nextSibling;
      Kn(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class ri {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, n, s) {
    this.type = 1, this._$AH = ut, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = s, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = ut;
  }
  _$AI(t, e = this, i, n) {
    const s = this.strings;
    let r = !1;
    if (s === void 0) t = _e(this, t, e, 0), r = !Ge(t) || t !== this._$AH && t !== pe, r && (this._$AH = t);
    else {
      const a = t;
      let h, l;
      for (t = s[0], h = 0; h < s.length - 1; h++) l = _e(this, a[i + h], e, h), l === pe && (l = this._$AH[h]), r || (r = !Ge(l) || l !== this._$AH[h]), l === ut ? t = ut : t !== ut && (t += (l ?? "") + s[h + 1]), this._$AH[h] = l;
    }
    r && !n && this.j(t);
  }
  j(t) {
    t === ut ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ur extends ri {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === ut ? void 0 : t;
  }
}
class Br extends ri {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== ut);
  }
}
class Vr extends ri {
  constructor(t, e, i, n, s) {
    super(t, e, i, n, s), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = _e(this, t, e, 0) ?? ut) === pe) return;
    const i = this._$AH, n = t === ut && i !== ut || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, s = t !== ut && (i === ut || n);
    n && this.element.removeEventListener(this.name, this, i), s && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Hr {
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
const tn = Fe.litHtmlPolyfillSupport;
tn == null || tn(Le, $e), (Fe.litHtmlVersions ?? (Fe.litHtmlVersions = [])).push("3.3.2");
const zr = (o, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let n = i._$litPart$;
  if (n === void 0) {
    const s = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = n = new $e(t.insertBefore(Ne(), s), s, void 0, e ?? {});
  }
  return n._$AI(o), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = globalThis;
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = zr(e, this.renderRoot, this.renderOptions);
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
var Is;
Oe._$litElement$ = !0, Oe.finalized = !0, (Is = Qt.litElementHydrateSupport) == null || Is.call(Qt, { LitElement: Oe });
const en = Qt.litElementPolyfillSupport;
en == null || en({ LitElement: Oe });
(Qt.litElementVersions ?? (Qt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Wr = { attribute: !0, type: String, converter: Ze, reflect: !1, hasChanged: Pn }, jr = (o = Wr, t, e) => {
  const { kind: i, metadata: n } = e;
  let s = globalThis.litPropertyMetadata.get(n);
  if (s === void 0 && globalThis.litPropertyMetadata.set(n, s = /* @__PURE__ */ new Map()), i === "setter" && ((o = Object.create(o)).wrapped = !0), s.set(e.name, o), i === "accessor") {
    const { name: r } = e;
    return { set(a) {
      const h = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(r, h, o, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(r, void 0, o, a), a;
    } };
  }
  if (i === "setter") {
    const { name: r } = e;
    return function(a) {
      const h = this[r];
      t.call(this, a), this.requestUpdate(r, h, o, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function ai(o) {
  return (t, e) => typeof e == "object" ? jr(o, t, e) : ((i, n, s) => {
    const r = n.hasOwnProperty(s);
    return n.constructor.createProperty(s, i), r ? Object.getOwnPropertyDescriptor(n, s) : void 0;
  })(o, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function mt(o) {
  return ai({ ...o, state: !0, attribute: !1 });
}
var is = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Yr(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var kn = { exports: {} }, oi = {}, zs = {}, U = {};
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o._registerNode = o.Konva = o.glob = void 0;
  const t = Math.PI / 180;
  function e() {
    return typeof window < "u" && ({}.toString.call(window) === "[object Window]" || {}.toString.call(window) === "[object global]");
  }
  o.glob = typeof is < "u" ? is : typeof window < "u" ? window : typeof WorkerGlobalScope < "u" ? self : {}, o.Konva = {
    _global: o.glob,
    version: "9.3.22",
    isBrowser: e(),
    isUnminified: /param/.test((function(n) {
    }).toString()),
    dblClickWindow: 400,
    getAngle(n) {
      return o.Konva.angleDeg ? n * t : n;
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
      return o.Konva.DD.isDragging;
    },
    isTransforming() {
      var n;
      return (n = o.Konva.Transformer) === null || n === void 0 ? void 0 : n.isTransforming();
    },
    isDragReady() {
      return !!o.Konva.DD.node;
    },
    releaseCanvasOnDestroy: !0,
    document: o.glob.document,
    _injectGlobal(n) {
      o.glob.Konva = n;
    }
  };
  const i = (n) => {
    o.Konva[n.prototype.getClassName()] = n;
  };
  o._registerNode = i, o.Konva._injectGlobal(o.Konva);
})(U);
var it = {};
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.Util = o.Transform = void 0;
  const t = U;
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
      const b = Math.cos(f), x = Math.sin(f), A = this.m[0] * b + this.m[2] * x, v = this.m[1] * b + this.m[3] * x, k = this.m[0] * -x + this.m[2] * b, P = this.m[1] * -x + this.m[3] * b;
      return this.m[0] = A, this.m[1] = v, this.m[2] = k, this.m[3] = P, this;
    }
    getTranslation() {
      return {
        x: this.m[4],
        y: this.m[5]
      };
    }
    skew(f, b) {
      const x = this.m[0] + this.m[2] * b, A = this.m[1] + this.m[3] * b, v = this.m[2] + this.m[0] * f, k = this.m[3] + this.m[1] * f;
      return this.m[0] = x, this.m[1] = A, this.m[2] = v, this.m[3] = k, this;
    }
    multiply(f) {
      const b = this.m[0] * f.m[0] + this.m[2] * f.m[1], x = this.m[1] * f.m[0] + this.m[3] * f.m[1], A = this.m[0] * f.m[2] + this.m[2] * f.m[3], v = this.m[1] * f.m[2] + this.m[3] * f.m[3], k = this.m[0] * f.m[4] + this.m[2] * f.m[5] + this.m[4], P = this.m[1] * f.m[4] + this.m[3] * f.m[5] + this.m[5];
      return this.m[0] = b, this.m[1] = x, this.m[2] = A, this.m[3] = v, this.m[4] = k, this.m[5] = P, this;
    }
    invert() {
      const f = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]), b = this.m[3] * f, x = -this.m[1] * f, A = -this.m[2] * f, v = this.m[0] * f, k = f * (this.m[2] * this.m[5] - this.m[3] * this.m[4]), P = f * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
      return this.m[0] = b, this.m[1] = x, this.m[2] = A, this.m[3] = v, this.m[4] = k, this.m[5] = P, this;
    }
    getMatrix() {
      return this.m;
    }
    decompose() {
      const f = this.m[0], b = this.m[1], x = this.m[2], A = this.m[3], v = this.m[4], k = this.m[5], P = f * A - b * x, E = {
        x: v,
        y: k,
        rotation: 0,
        scaleX: 0,
        scaleY: 0,
        skewX: 0,
        skewY: 0
      };
      if (f != 0 || b != 0) {
        const T = Math.sqrt(f * f + b * b);
        E.rotation = b > 0 ? Math.acos(f / T) : -Math.acos(f / T), E.scaleX = T, E.scaleY = P / T, E.skewX = (f * x + b * A) / P, E.skewY = 0;
      } else if (x != 0 || A != 0) {
        const T = Math.sqrt(x * x + A * A);
        E.rotation = Math.PI / 2 - (A > 0 ? Math.acos(-x / T) : -Math.acos(x / T)), E.scaleX = P / T, E.scaleY = T, E.skewX = 0, E.skewY = (f * x + b * A) / P;
      }
      return E.rotation = o.Util._getRotation(E.rotation), E;
    }
  }
  o.Transform = e;
  const i = "[object Array]", n = "[object Number]", s = "[object String]", r = "[object Boolean]", a = Math.PI / 180, h = 180 / Math.PI, l = "#", u = "", _ = "0", p = "Konva warning: ", g = "Konva error: ", d = "rgb(", m = {
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
  o.Util = {
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
      return Object.prototype.toString.call(c) === s;
    },
    _isBoolean(c) {
      return Object.prototype.toString.call(c) === r;
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
      const b = o.Util.createImageElement();
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
      return c = c || "black", o.Util._namedColorToRBA(c) || o.Util._hex3ColorToRGBA(c) || o.Util._hex4ColorToRGBA(c) || o.Util._hex6ColorToRGBA(c) || o.Util._hex8ColorToRGBA(c) || o.Util._rgbColorToRGBA(c) || o.Util._rgbaColorToRGBA(c) || o.Util._hslColorToRGBA(c);
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
        const [f, ...b] = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(c), x = Number(b[0]) / 360, A = Number(b[1]) / 100, v = Number(b[2]) / 100;
        let k, P, E;
        if (A === 0)
          return E = v * 255, {
            r: Math.round(E),
            g: Math.round(E),
            b: Math.round(E),
            a: 1
          };
        v < 0.5 ? k = v * (1 + A) : k = v + A - v * A;
        const T = 2 * v - k, R = [0, 0, 0];
        for (let G = 0; G < 3; G++)
          P = x + 1 / 3 * -(G - 1), P < 0 && P++, P > 1 && P--, 6 * P < 1 ? E = T + (k - T) * 6 * P : 2 * P < 1 ? E = k : 3 * P < 2 ? E = T + (k - T) * (2 / 3 - P) * 6 : E = T, R[G] = E * 255;
        return {
          r: Math.round(R[0]),
          g: Math.round(R[1]),
          b: Math.round(R[2]),
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
      return c * h;
    },
    _degToRad(c) {
      return o.Util.warn("Util._degToRad is removed. Please use public Util.degToRad instead."), o.Util.degToRad(c);
    },
    _radToDeg(c) {
      return o.Util.warn("Util._radToDeg is removed. Please use public Util.radToDeg instead."), o.Util.radToDeg(c);
    },
    _getRotation(c) {
      return t.Konva.angleDeg ? o.Util.radToDeg(c) : c;
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
    _getProjectionToSegment(c, f, b, x, A, v) {
      let k, P, E;
      const T = (c - b) * (c - b) + (f - x) * (f - x);
      if (T == 0)
        k = c, P = f, E = (A - b) * (A - b) + (v - x) * (v - x);
      else {
        const R = ((A - c) * (b - c) + (v - f) * (x - f)) / T;
        R < 0 ? (k = c, P = f, E = (c - A) * (c - A) + (f - v) * (f - v)) : R > 1 ? (k = b, P = x, E = (b - A) * (b - A) + (x - v) * (x - v)) : (k = c + R * (b - c), P = f + R * (x - f), E = (k - A) * (k - A) + (P - v) * (P - v));
      }
      return [k, P, E];
    },
    _getProjectionToLine(c, f, b) {
      const x = o.Util.cloneObject(c);
      let A = Number.MAX_VALUE;
      return f.forEach(function(v, k) {
        if (!b && k === f.length - 1)
          return;
        const P = f[(k + 1) % f.length], E = o.Util._getProjectionToSegment(v.x, v.y, P.x, P.y, c.x, c.y), T = E[0], R = E[1], G = E[2];
        G < A && (x.x = T, x.y = R, A = G);
      }), x;
    },
    _prepareArrayForTween(c, f, b) {
      const x = [], A = [];
      if (c.length > f.length) {
        const k = f;
        f = c, c = k;
      }
      for (let k = 0; k < c.length; k += 2)
        x.push({
          x: c[k],
          y: c[k + 1]
        });
      for (let k = 0; k < f.length; k += 2)
        A.push({
          x: f[k],
          y: f[k + 1]
        });
      const v = [];
      return A.forEach(function(k) {
        const P = o.Util._getProjectionToLine(k, x, b);
        v.push(P.x), v.push(P.y);
      }), v;
    },
    _prepareToStringify(c) {
      let f;
      c.visitedByCircularReferenceRemoval = !0;
      for (const b in c)
        if (c.hasOwnProperty(b) && c[b] && typeof c[b] == "object") {
          if (f = Object.getOwnPropertyDescriptor(c, b), c[b].visitedByCircularReferenceRemoval || o.Util._isElement(c[b]))
            if (f.configurable)
              delete c[b];
            else
              return null;
          else if (o.Util._prepareToStringify(c[b]) === null)
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
      let A = 0, v = 0, k = 0, P = 0;
      typeof x == "number" ? A = v = k = P = Math.min(x, f / 2, b / 2) : (A = Math.min(x[0] || 0, f / 2, b / 2), v = Math.min(x[1] || 0, f / 2, b / 2), P = Math.min(x[2] || 0, f / 2, b / 2), k = Math.min(x[3] || 0, f / 2, b / 2)), c.moveTo(A, 0), c.lineTo(f - v, 0), c.arc(f - v, v, v, Math.PI * 3 / 2, 0, !1), c.lineTo(f, b - P), c.arc(f - P, b - P, P, 0, Math.PI / 2, !1), c.lineTo(k, b), c.arc(k, b - k, k, Math.PI / 2, Math.PI, !1), c.lineTo(0, A), c.arc(A, A, A, Math.PI, Math.PI * 3 / 2, !1);
    }
  };
})(it);
var tt = {}, St = {}, Mt = {};
Object.defineProperty(Mt, "__esModule", { value: !0 });
Mt.HitContext = Mt.SceneContext = Mt.Context = void 0;
const Ws = it, Xr = U;
function Kr(o) {
  const t = [], e = o.length, i = Ws.Util;
  for (let n = 0; n < e; n++) {
    let s = o[n];
    i._isNumber(s) ? s = Math.round(s * 1e3) / 1e3 : i._isString(s) || (s = s + ""), t.push(s);
  }
  return t;
}
const ns = ",", qr = "(", Qr = ")", Jr = "([", Zr = "])", ta = ";", ea = "()", ia = "=", ss = [
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
], na = [
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
], sa = 100;
class hi {
  constructor(t) {
    this.canvas = t, Xr.Konva.enableTrace && (this.traceArr = [], this._enableTrace());
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
    let i = this.traceArr, n = i.length, s = "", r, a, h, l;
    for (r = 0; r < n; r++)
      a = i[r], h = a.method, h ? (l = a.args, s += h, t ? s += ea : Ws.Util._isArray(l[0]) ? s += Jr + l.join(ns) + Zr : (e && (l = l.map((u) => typeof u == "number" ? Math.floor(u) : u)), s += qr + l.join(ns) + Qr)) : (s += a.property, t || (s += ia + a.val)), s += ta;
    return s;
  }
  clearTrace() {
    this.traceArr = [];
  }
  _trace(t) {
    let e = this.traceArr, i;
    e.push(t), i = e.length, i >= sa && e.shift();
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
  arc(t, e, i, n, s, r) {
    this._context.arc(t, e, i, n, s, r);
  }
  arcTo(t, e, i, n, s) {
    this._context.arcTo(t, e, i, n, s);
  }
  beginPath() {
    this._context.beginPath();
  }
  bezierCurveTo(t, e, i, n, s, r) {
    this._context.bezierCurveTo(t, e, i, n, s, r);
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
  createRadialGradient(t, e, i, n, s, r) {
    return this._context.createRadialGradient(t, e, i, n, s, r);
  }
  drawImage(t, e, i, n, s, r, a, h, l) {
    const u = arguments, _ = this._context;
    u.length === 3 ? _.drawImage(t, e, i) : u.length === 5 ? _.drawImage(t, e, i, n, s) : u.length === 9 && _.drawImage(t, e, i, n, s, r, a, h, l);
  }
  ellipse(t, e, i, n, s, r, a, h) {
    this._context.ellipse(t, e, i, n, s, r, a, h);
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
  roundRect(t, e, i, n, s) {
    this._context.roundRect(t, e, i, n, s);
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
  setTransform(t, e, i, n, s, r) {
    this._context.setTransform(t, e, i, n, s, r);
  }
  stroke(t) {
    t ? this._context.stroke(t) : this._context.stroke();
  }
  strokeText(t, e, i, n) {
    this._context.strokeText(t, e, i, n);
  }
  transform(t, e, i, n, s, r) {
    this._context.transform(t, e, i, n, s, r);
  }
  translate(t, e) {
    this._context.translate(t, e);
  }
  _enableTrace() {
    let t = this, e = ss.length, i = this.setAttr, n, s;
    const r = function(a) {
      let h = t[a], l;
      t[a] = function() {
        return s = Kr(Array.prototype.slice.call(arguments, 0)), l = h.apply(t, arguments), t._trace({
          method: a,
          args: s
        }), l;
      };
    };
    for (n = 0; n < e; n++)
      r(ss[n]);
    t.setAttr = function() {
      i.apply(t, arguments);
      const a = arguments[0];
      let h = arguments[1];
      (a === "shadowOffsetX" || a === "shadowOffsetY" || a === "shadowBlur") && (h = h / this.canvas.getPixelRatio()), t._trace({
        property: a,
        val: h
      });
    };
  }
  _applyGlobalCompositeOperation(t) {
    const e = t.attrs.globalCompositeOperation;
    !e || e === "source-over" || this.setAttr("globalCompositeOperation", e);
  }
}
Mt.Context = hi;
na.forEach(function(o) {
  Object.defineProperty(hi.prototype, o, {
    get() {
      return this._context[o];
    },
    set(t) {
      this._context[o] = t;
    }
  });
});
class ra extends hi {
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
    const s = t.getFillLinearGradientColorStops();
    if (s && i === "linear-gradient") {
      this._fillLinearGradient(t);
      return;
    }
    const r = t.getFillRadialGradientColorStops();
    if (r && i === "radial-gradient") {
      this._fillRadialGradient(t);
      return;
    }
    e ? this._fillColor(t) : n ? this._fillPattern(t) : s ? this._fillLinearGradient(t) : r && this._fillRadialGradient(t);
  }
  _strokeLinearGradient(t) {
    const e = t.getStrokeLinearGradientStartPoint(), i = t.getStrokeLinearGradientEndPoint(), n = t.getStrokeLinearGradientColorStops(), s = this.createLinearGradient(e.x, e.y, i.x, i.y);
    if (n) {
      for (let r = 0; r < n.length; r += 2)
        s.addColorStop(n[r], n[r + 1]);
      this.setAttr("strokeStyle", s);
    }
  }
  _stroke(t) {
    const e = t.dash(), i = t.getStrokeScaleEnabled();
    if (t.hasStroke()) {
      if (!i) {
        this.save();
        const s = this.getCanvas().getPixelRatio();
        this.setTransform(s, 0, 0, s, 0, 0);
      }
      this._applyLineCap(t), e && t.dashEnabled() && (this.setLineDash(e), this.setAttr("lineDashOffset", t.dashOffset())), this.setAttr("lineWidth", t.strokeWidth()), t.getShadowForStrokeEnabled() || this.setAttr("shadowColor", "rgba(0,0,0,0)"), t.getStrokeLinearGradientColorStops() ? this._strokeLinearGradient(t) : this.setAttr("strokeStyle", t.stroke()), t._strokeFunc(this), i || this.restore();
    }
  }
  _applyShadow(t) {
    var e, i, n;
    const s = (e = t.getShadowRGBA()) !== null && e !== void 0 ? e : "black", r = (i = t.getShadowBlur()) !== null && i !== void 0 ? i : 5, a = (n = t.getShadowOffset()) !== null && n !== void 0 ? n : {
      x: 0,
      y: 0
    }, h = t.getAbsoluteScale(), l = this.canvas.getPixelRatio(), u = h.x * l, _ = h.y * l;
    this.setAttr("shadowColor", s), this.setAttr("shadowBlur", r * Math.min(Math.abs(u), Math.abs(_))), this.setAttr("shadowOffsetX", a.x * u), this.setAttr("shadowOffsetY", a.y * _);
  }
}
Mt.SceneContext = ra;
class aa extends hi {
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
        const s = this.getCanvas().getPixelRatio();
        this.setTransform(s, 0, 0, s, 0, 0);
      }
      this._applyLineCap(t);
      const i = t.hitStrokeWidth(), n = i === "auto" ? t.strokeWidth() : i;
      this.setAttr("lineWidth", n), this.setAttr("strokeStyle", t.colorKey), t._strokeFuncHit(this), e || this.restore();
    }
  }
}
Mt.HitContext = aa;
Object.defineProperty(St, "__esModule", { value: !0 });
St.HitCanvas = St.SceneCanvas = St.Canvas = void 0;
const ei = it, js = Mt, Ys = U;
let We;
function oa() {
  if (We)
    return We;
  const o = ei.Util.createCanvasElement(), t = o.getContext("2d");
  return We = function() {
    const e = Ys.Konva._global.devicePixelRatio || 1, i = t.webkitBackingStorePixelRatio || t.mozBackingStorePixelRatio || t.msBackingStorePixelRatio || t.oBackingStorePixelRatio || t.backingStorePixelRatio || 1;
    return e / i;
  }(), ei.Util.releaseCanvas(o), We;
}
class En {
  constructor(t) {
    this.pixelRatio = 1, this.width = 0, this.height = 0, this.isCache = !1;
    const i = (t || {}).pixelRatio || Ys.Konva.pixelRatio || oa();
    this.pixelRatio = i, this._canvas = ei.Util.createCanvasElement(), this._canvas.style.padding = "0", this._canvas.style.margin = "0", this._canvas.style.border = "0", this._canvas.style.background = "transparent", this._canvas.style.position = "absolute", this._canvas.style.top = "0", this._canvas.style.left = "0";
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
        return ei.Util.error("Unable to get data URL. " + n.message + " For more info read https://konvajs.org/docs/posts/Tainted_Canvas.html."), "";
      }
    }
  }
}
St.Canvas = En;
class ha extends En {
  constructor(t = { width: 0, height: 0, willReadFrequently: !1 }) {
    super(t), this.context = new js.SceneContext(this, {
      willReadFrequently: t.willReadFrequently
    }), this.setSize(t.width, t.height);
  }
}
St.SceneCanvas = ha;
class la extends En {
  constructor(t = { width: 0, height: 0 }) {
    super(t), this.hitCanvas = !0, this.context = new js.HitContext(this), this.setSize(t.width, t.height);
  }
}
St.HitCanvas = la;
var li = {};
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.DD = void 0;
  const t = U, e = it;
  o.DD = {
    get isDragging() {
      let i = !1;
      return o.DD._dragElements.forEach((n) => {
        n.dragStatus === "dragging" && (i = !0);
      }), i;
    },
    justDragged: !1,
    get node() {
      let i;
      return o.DD._dragElements.forEach((n) => {
        i = n.node;
      }), i;
    },
    _dragElements: /* @__PURE__ */ new Map(),
    _drag(i) {
      const n = [];
      o.DD._dragElements.forEach((s, r) => {
        const { node: a } = s, h = a.getStage();
        h.setPointersPositions(i), s.pointerId === void 0 && (s.pointerId = e.Util._getFirstPointerId(i));
        const l = h._changedPointerPositions.find((u) => u.id === s.pointerId);
        if (l) {
          if (s.dragStatus !== "dragging") {
            const u = a.dragDistance();
            if (Math.max(Math.abs(l.x - s.startPointerPos.x), Math.abs(l.y - s.startPointerPos.y)) < u || (a.startDrag({ evt: i }), !a.isDragging()))
              return;
          }
          a._setDragPosition(i, s), n.push(a);
        }
      }), n.forEach((s) => {
        s.fire("dragmove", {
          type: "dragmove",
          target: s,
          evt: i
        }, !0);
      });
    },
    _endDragBefore(i) {
      const n = [];
      o.DD._dragElements.forEach((s) => {
        const { node: r } = s, a = r.getStage();
        if (i && a.setPointersPositions(i), !a._changedPointerPositions.find((u) => u.id === s.pointerId))
          return;
        (s.dragStatus === "dragging" || s.dragStatus === "stopped") && (o.DD.justDragged = !0, t.Konva._mouseListenClick = !1, t.Konva._touchListenClick = !1, t.Konva._pointerListenClick = !1, s.dragStatus = "stopped");
        const l = s.node.getLayer() || s.node instanceof t.Konva.Stage && s.node;
        l && n.indexOf(l) === -1 && n.push(l);
      }), n.forEach((s) => {
        s.draw();
      });
    },
    _endDragAfter(i) {
      o.DD._dragElements.forEach((n, s) => {
        n.dragStatus === "stopped" && n.node.fire("dragend", {
          type: "dragend",
          target: n.node,
          evt: i
        }, !0), n.dragStatus !== "dragging" && o.DD._dragElements.delete(s);
      });
    }
  }, t.Konva.isBrowser && (window.addEventListener("mouseup", o.DD._endDragBefore, !0), window.addEventListener("touchend", o.DD._endDragBefore, !0), window.addEventListener("touchcancel", o.DD._endDragBefore, !0), window.addEventListener("mousemove", o.DD._drag), window.addEventListener("touchmove", o.DD._drag), window.addEventListener("mouseup", o.DD._endDragAfter, !1), window.addEventListener("touchend", o.DD._endDragAfter, !1), window.addEventListener("touchcancel", o.DD._endDragAfter, !1));
})(li);
var B = {}, D = {};
Object.defineProperty(D, "__esModule", { value: !0 });
D.RGBComponent = ca;
D.alphaComponent = da;
D.getNumberValidator = ua;
D.getNumberOrArrayOfNumbersValidator = fa;
D.getNumberOrAutoValidator = ga;
D.getStringValidator = pa;
D.getStringOrGradientValidator = _a;
D.getFunctionValidator = ma;
D.getNumberArrayValidator = ya;
D.getBooleanValidator = ba;
D.getComponentValidator = va;
const Rt = U, nt = it;
function Ft(o) {
  return nt.Util._isString(o) ? '"' + o + '"' : Object.prototype.toString.call(o) === "[object Number]" || nt.Util._isBoolean(o) ? o : Object.prototype.toString.call(o);
}
function ca(o) {
  return o > 255 ? 255 : o < 0 ? 0 : Math.round(o);
}
function da(o) {
  return o > 1 ? 1 : o < 1e-4 ? 1e-4 : o;
}
function ua() {
  if (Rt.Konva.isUnminified)
    return function(o, t) {
      return nt.Util._isNumber(o) || nt.Util.warn(Ft(o) + ' is a not valid value for "' + t + '" attribute. The value should be a number.'), o;
    };
}
function fa(o) {
  if (Rt.Konva.isUnminified)
    return function(t, e) {
      let i = nt.Util._isNumber(t), n = nt.Util._isArray(t) && t.length == o;
      return !i && !n && nt.Util.warn(Ft(t) + ' is a not valid value for "' + e + '" attribute. The value should be a number or Array<number>(' + o + ")"), t;
    };
}
function ga() {
  if (Rt.Konva.isUnminified)
    return function(o, t) {
      return nt.Util._isNumber(o) || o === "auto" || nt.Util.warn(Ft(o) + ' is a not valid value for "' + t + '" attribute. The value should be a number or "auto".'), o;
    };
}
function pa() {
  if (Rt.Konva.isUnminified)
    return function(o, t) {
      return nt.Util._isString(o) || nt.Util.warn(Ft(o) + ' is a not valid value for "' + t + '" attribute. The value should be a string.'), o;
    };
}
function _a() {
  if (Rt.Konva.isUnminified)
    return function(o, t) {
      const e = nt.Util._isString(o), i = Object.prototype.toString.call(o) === "[object CanvasGradient]" || o && o.addColorStop;
      return e || i || nt.Util.warn(Ft(o) + ' is a not valid value for "' + t + '" attribute. The value should be a string or a native gradient.'), o;
    };
}
function ma() {
  if (Rt.Konva.isUnminified)
    return function(o, t) {
      return nt.Util._isFunction(o) || nt.Util.warn(Ft(o) + ' is a not valid value for "' + t + '" attribute. The value should be a function.'), o;
    };
}
function ya() {
  if (Rt.Konva.isUnminified)
    return function(o, t) {
      const e = Int8Array ? Object.getPrototypeOf(Int8Array) : null;
      return e && o instanceof e || (nt.Util._isArray(o) ? o.forEach(function(i) {
        nt.Util._isNumber(i) || nt.Util.warn('"' + t + '" attribute has non numeric element ' + i + ". Make sure that all elements are numbers.");
      }) : nt.Util.warn(Ft(o) + ' is a not valid value for "' + t + '" attribute. The value should be a array of numbers.')), o;
    };
}
function ba() {
  if (Rt.Konva.isUnminified)
    return function(o, t) {
      return o === !0 || o === !1 || nt.Util.warn(Ft(o) + ' is a not valid value for "' + t + '" attribute. The value should be a boolean.'), o;
    };
}
function va(o) {
  if (Rt.Konva.isUnminified)
    return function(t, e) {
      return t == null || nt.Util.isObject(t) || nt.Util.warn(Ft(t) + ' is a not valid value for "' + e + '" attribute. The value should be an object with properties ' + o), t;
    };
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.Factory = void 0;
  const t = it, e = D, i = "get", n = "set";
  o.Factory = {
    addGetterSetter(s, r, a, h, l) {
      o.Factory.addGetter(s, r, a), o.Factory.addSetter(s, r, h, l), o.Factory.addOverloadedGetterSetter(s, r);
    },
    addGetter(s, r, a) {
      const h = i + t.Util._capitalize(r);
      s.prototype[h] = s.prototype[h] || function() {
        const l = this.attrs[r];
        return l === void 0 ? a : l;
      };
    },
    addSetter(s, r, a, h) {
      const l = n + t.Util._capitalize(r);
      s.prototype[l] || o.Factory.overWriteSetter(s, r, a, h);
    },
    overWriteSetter(s, r, a, h) {
      const l = n + t.Util._capitalize(r);
      s.prototype[l] = function(u) {
        return a && u !== void 0 && u !== null && (u = a.call(this, u, r)), this._setAttr(r, u), h && h.call(this), this;
      };
    },
    addComponentsGetterSetter(s, r, a, h, l) {
      const u = a.length, _ = t.Util._capitalize, p = i + _(r), g = n + _(r);
      s.prototype[p] = function() {
        const m = {};
        for (let y = 0; y < u; y++) {
          const S = a[y];
          m[S] = this.getAttr(r + _(S));
        }
        return m;
      };
      const d = (0, e.getComponentValidator)(a);
      s.prototype[g] = function(m) {
        const y = this.attrs[r];
        h && (m = h.call(this, m, r)), d && d.call(this, m, r);
        for (const S in m)
          m.hasOwnProperty(S) && this._setAttr(r + _(S), m[S]);
        return m || a.forEach((S) => {
          this._setAttr(r + _(S), void 0);
        }), this._fireChangeEvent(r, y, m), l && l.call(this), this;
      }, o.Factory.addOverloadedGetterSetter(s, r);
    },
    addOverloadedGetterSetter(s, r) {
      const a = t.Util._capitalize(r), h = n + a, l = i + a;
      s.prototype[r] = function() {
        return arguments.length ? (this[h](arguments[0]), this) : this[l]();
      };
    },
    addDeprecatedGetterSetter(s, r, a, h) {
      t.Util.error("Adding deprecated " + r);
      const l = i + t.Util._capitalize(r), u = r + " property is deprecated and will be removed soon. Look at Konva change log for more information.";
      s.prototype[l] = function() {
        t.Util.error(u);
        const _ = this.attrs[r];
        return _ === void 0 ? a : _;
      }, o.Factory.addSetter(s, r, h, function() {
        t.Util.error(u);
      }), o.Factory.addOverloadedGetterSetter(s, r);
    },
    backCompat(s, r) {
      t.Util.each(r, function(a, h) {
        const l = s.prototype[h], u = i + t.Util._capitalize(a), _ = n + t.Util._capitalize(a);
        function p() {
          l.apply(this, arguments), t.Util.error('"' + a + '" method is deprecated and will be removed soon. Use ""' + h + '" instead.');
        }
        s.prototype[a] = p, s.prototype[u] = p, s.prototype[_] = p;
      });
    },
    afterSetFilter() {
      this._filterUpToDate = !1;
    }
  };
})(B);
Object.defineProperty(tt, "__esModule", { value: !0 });
tt.Node = void 0;
const ce = St, bt = li, Ue = B, Lt = U, V = it, at = D, Qe = "absoluteOpacity", je = "allEventListeners", Tt = "absoluteTransform", rs = "absoluteScale", Xt = "canvas", Sa = "Change", Ca = "children", wa = "konva", gn = "listening", xa = "mouseenter", Pa = "mouseleave", Aa = "pointerenter", ka = "pointerleave", Ea = "touchenter", Ta = "touchleave", as = "set", os = "Shape", Je = " ", hs = "stage", Dt = "transform", Ma = "Stage", pn = "visible", Ra = [
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
].join(Je);
let Fa = 1;
class I {
  constructor(t) {
    this._id = Fa++, this.eventListeners = {}, this.attrs = {}, this.index = 0, this._allEventListeners = null, this.parent = null, this._cache = /* @__PURE__ */ new Map(), this._attachedDepsListeners = /* @__PURE__ */ new Map(), this._lastPos = null, this._batchingTransformChange = !1, this._needClearTransformCache = !1, this._filterUpToDate = !1, this._isUnderCache = !1, this._dragEventId = null, this._shouldFireChangeEvents = !1, this.setAttrs(t), this._shouldFireChangeEvents = !0;
  }
  hasChildren() {
    return !1;
  }
  _clearCache(t) {
    (t === Dt || t === Tt) && this._cache.get(t) ? this._cache.get(t).dirty = !0 : t ? this._cache.delete(t) : this._cache.clear();
  }
  _getCache(t, e) {
    let i = this._cache.get(t);
    return (i === void 0 || (t === Dt || t === Tt) && i.dirty === !0) && (i = e.call(this), this._cache.set(t, i)), i;
  }
  _calculate(t, e, i) {
    if (!this._attachedDepsListeners.get(t)) {
      const n = e.map((s) => s + "Change.konva").join(Je);
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
      V.Util.releaseCanvas(t, e, i, n), this._cache.delete(Xt);
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
    let n = Math.ceil(e.width || i.width), s = Math.ceil(e.height || i.height), r = e.pixelRatio, a = e.x === void 0 ? Math.floor(i.x) : e.x, h = e.y === void 0 ? Math.floor(i.y) : e.y, l = e.offset || 0, u = e.drawBorder || !1, _ = e.hitCanvasPixelRatio || 1;
    if (!n || !s) {
      V.Util.error("Can not cache the node. Width or height of the node equals 0. Caching is skipped.");
      return;
    }
    const p = Math.abs(Math.round(i.x) - a) > 0.5 ? 1 : 0, g = Math.abs(Math.round(i.y) - h) > 0.5 ? 1 : 0;
    n += l * 2 + p, s += l * 2 + g, a -= l, h -= l;
    const d = new ce.SceneCanvas({
      pixelRatio: r,
      width: n,
      height: s
    }), m = new ce.SceneCanvas({
      pixelRatio: r,
      width: 0,
      height: 0,
      willReadFrequently: !0
    }), y = new ce.HitCanvas({
      pixelRatio: _,
      width: n,
      height: s
    }), S = d.getContext(), w = y.getContext(), c = new ce.SceneCanvas({
      width: d.width / d.pixelRatio + Math.abs(a),
      height: d.height / d.pixelRatio + Math.abs(h),
      pixelRatio: d.pixelRatio
    }), f = c.getContext();
    return y.isCache = !0, d.isCache = !0, this._cache.delete(Xt), this._filterUpToDate = !1, e.imageSmoothingEnabled === !1 && (d.getContext()._context.imageSmoothingEnabled = !1, m.getContext()._context.imageSmoothingEnabled = !1), S.save(), w.save(), f.save(), S.translate(-a, -h), w.translate(-a, -h), f.translate(-a, -h), c.x = a, c.y = h, this._isUnderCache = !0, this._clearSelfAndDescendantCache(Qe), this._clearSelfAndDescendantCache(rs), this.drawScene(d, this, c), this.drawHit(y, this), this._isUnderCache = !1, S.restore(), w.restore(), u && (S.save(), S.beginPath(), S.rect(0, 0, n, s), S.closePath(), S.setAttr("strokeStyle", "red"), S.setAttr("lineWidth", 5), S.stroke(), S.restore()), this._cache.set(Xt, {
      scene: d,
      filter: m,
      hit: y,
      buffer: c,
      x: a,
      y: h
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
    let n = 1 / 0, s = 1 / 0, r = -1 / 0, a = -1 / 0;
    const h = this.getAbsoluteTransform(e);
    return i.forEach(function(l) {
      const u = h.point(l);
      n === void 0 && (n = r = u.x, s = a = u.y), n = Math.min(n, u.x), s = Math.min(s, u.y), r = Math.max(r, u.x), a = Math.max(a, u.y);
    }), {
      x: n,
      y: s,
      width: r - n,
      height: a - s
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
    let t = this.filters(), e = this._getCanvasCache(), i = e.scene, n = e.filter, s = n.getContext(), r, a, h, l;
    if (t) {
      if (!this._filterUpToDate) {
        const u = i.pixelRatio;
        n.setSize(i.width / i.pixelRatio, i.height / i.pixelRatio);
        try {
          for (r = t.length, s.clear(), s.drawImage(i._canvas, 0, 0, i.getWidth() / u, i.getHeight() / u), a = s.getImageData(0, 0, n.getWidth(), n.getHeight()), h = 0; h < r; h++) {
            if (l = t[h], typeof l != "function") {
              V.Util.error("Filter should be type of function, but got " + typeof l + " instead. Please check correct filters");
              continue;
            }
            l.call(this, a), s.putImageData(a, 0, 0);
          }
        } catch (_) {
          V.Util.error("Unable to apply filter. " + _.message + " This post my help you https://konvajs.org/docs/posts/Tainted_Canvas.html.");
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
    const i = t.split(Je);
    for (let n = 0; n < i.length; n++) {
      const r = i[n].split("."), a = r[0], h = r[1] || "";
      this.eventListeners[a] || (this.eventListeners[a] = []), this.eventListeners[a].push({ name: h, handler: e });
    }
    return this;
  }
  off(t, e) {
    let i = (t || "").split(Je), n = i.length, s, r, a, h, l, u;
    if (this._cache && this._cache.delete(je), !t)
      for (r in this.eventListeners)
        this._off(r);
    for (s = 0; s < n; s++)
      if (a = i[s], h = a.split("."), l = h[0], u = h[1], l)
        this.eventListeners[l] && this._off(l, u, e);
      else
        for (r in this.eventListeners)
          this._off(r, u, e);
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
    this.on(t, function(s) {
      const r = s.target.findAncestors(e, !0, n);
      for (let a = 0; a < r.length; a++)
        s = V.Util.cloneObject(s), s.currentTarget = r[a], i.call(r[a], s);
    });
  }
  remove() {
    return this.isDragging() && this.stopDrag(), bt.DD._dragElements.delete(this._id), this._remove(), this;
  }
  _clearCaches() {
    this._clearSelfAndDescendantCache(Tt), this._clearSelfAndDescendantCache(Qe), this._clearSelfAndDescendantCache(rs), this._clearSelfAndDescendantCache(hs), this._clearSelfAndDescendantCache(pn), this._clearSelfAndDescendantCache(gn);
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
        e !== Ca && (i = as + V.Util._capitalize(e), V.Util._isFunction(this[i]) ? this[i](t[e]) : this._setAttr(e, t[e]));
    }), this;
  }
  isListening() {
    return this._getCache(gn, this._isListening);
  }
  _isListening(t) {
    if (!this.listening())
      return !1;
    const i = this.getParent();
    return i && i !== t && this !== t ? i._isListening(t) : !0;
  }
  isVisible() {
    return this._getCache(pn, this._isVisible);
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
    bt.DD._dragElements.forEach((r) => {
      r.dragStatus === "dragging" && (r.node.nodeType === "Stage" || r.node.getLayer() === i) && (n = !0);
    });
    const s = !e && !Lt.Konva.hitOnDragEnabled && (n || Lt.Konva.isTransforming());
    return this.isListening() && this.isVisible() && !s;
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
    let t = this.getDepth(), e = this, i = 0, n, s, r, a;
    function h(u) {
      for (n = [], s = u.length, r = 0; r < s; r++)
        a = u[r], i++, a.nodeType !== os && (n = n.concat(a.getChildren().slice())), a._id === e._id && (r = s);
      n.length > 0 && n[0].getDepth() <= t && h(n);
    }
    const l = this.getStage();
    return e.nodeType !== Ma && l && h(l.getChildren()), i;
  }
  getDepth() {
    let t = 0, e = this.parent;
    for (; e; )
      t++, e = e.parent;
    return t;
  }
  _batchTransformChanges(t) {
    this._batchingTransformChange = !0, t(), this._batchingTransformChange = !1, this._needClearTransformCache && (this._clearCache(Dt), this._clearSelfAndDescendantCache(Tt)), this._needClearTransformCache = !1;
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
    const n = this.getAbsoluteTransform(t).getMatrix(), s = new V.Transform(), r = this.offset();
    return s.m = n.slice(), s.translate(r.x, r.y), s.getTranslation();
  }
  setAbsolutePosition(t) {
    const { x: e, y: i, ...n } = this._clearTransform();
    this.attrs.x = e, this.attrs.y = i, this._clearCache(Dt);
    const s = this._getAbsoluteTransform().copy();
    return s.invert(), s.translate(t.x, t.y), t = {
      x: this.attrs.x + s.getTranslation().x,
      y: this.attrs.y + s.getTranslation().y
    }, this._setTransform(n), this.setPosition({ x: t.x, y: t.y }), this._clearCache(Dt), this._clearSelfAndDescendantCache(Tt), this;
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
    let e = t.x, i = t.y, n = this.x(), s = this.y();
    return e !== void 0 && (n += e), i !== void 0 && (s += i), this.setPosition({ x: n, y: s }), this;
  }
  _eachAncestorReverse(t, e) {
    let i = [], n = this.getParent(), s, r;
    if (!(e && e._id === this._id)) {
      for (i.unshift(this); n && (!e || n._id !== e._id); )
        i.unshift(n), n = n.parent;
      for (s = i.length, r = 0; r < s; r++)
        t(i[r]);
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
    let t = this.getAttrs(), e, i, n, s, r;
    const a = {
      attrs: {},
      className: this.getClassName()
    };
    for (e in t)
      i = t[e], r = V.Util.isObject(i) && !V.Util._isPlainObject(i) && !V.Util._isArray(i), !r && (n = typeof this[e] == "function" && this[e], delete t[e], s = n ? n.call(this) : null, t[e] = i, s !== i && (a.attrs[e] = i));
    return V.Util._prepareToStringify(a);
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
    let s = this.parent;
    for (; s; ) {
      if (s === i)
        return n;
      s._isMatch(t) && n.push(s), s = s.parent;
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
    let e = t.replace(/ /g, "").split(","), i = e.length, n, s;
    for (n = 0; n < i; n++)
      if (s = e[n], V.Util.isValidSelector(s) || (V.Util.warn('Selector "' + s + '" is invalid. Allowed selectors examples are "#foo", ".bar" or "Group".'), V.Util.warn('If you have a custom shape with such className, please change it to start with upper letter like "Triangle".'), V.Util.warn("Konva is awesome, right?")), s.charAt(0) === "#") {
        if (this.id() === s.slice(1))
          return !0;
      } else if (s.charAt(0) === ".") {
        if (this.hasName(s.slice(1)))
          return !0;
      } else if (this.className === s || this.nodeType === s)
        return !0;
    return !1;
  }
  getLayer() {
    const t = this.getParent();
    return t ? t.getLayer() : null;
  }
  getStage() {
    return this._getCache(hs, this._getStage);
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
      return e = new V.Transform(), this._eachAncestorReverse(function(i) {
        const n = i.transformsEnabled();
        n === "all" ? e.multiply(i.getTransform()) : n === "position" && e.translate(i.x() - i.offsetX(), i.y() - i.offsetY());
      }, t), e;
    {
      e = this._cache.get(Tt) || new V.Transform(), this.parent ? this.parent.getAbsoluteTransform().copyInto(e) : e.reset();
      const i = this.transformsEnabled();
      if (i === "all")
        e.multiply(this.getTransform());
      else if (i === "position") {
        const n = this.attrs.x || 0, s = this.attrs.y || 0, r = this.attrs.offsetX || 0, a = this.attrs.offsetY || 0;
        e.translate(n - r, s - a);
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
    return this._getCache(Dt, this._getTransform);
  }
  _getTransform() {
    var t, e;
    const i = this._cache.get(Dt) || new V.Transform();
    i.reset();
    const n = this.x(), s = this.y(), r = Lt.Konva.getAngle(this.rotation()), a = (t = this.attrs.scaleX) !== null && t !== void 0 ? t : 1, h = (e = this.attrs.scaleY) !== null && e !== void 0 ? e : 1, l = this.attrs.skewX || 0, u = this.attrs.skewY || 0, _ = this.attrs.offsetX || 0, p = this.attrs.offsetY || 0;
    return (n !== 0 || s !== 0) && i.translate(n, s), r !== 0 && i.rotate(r), (l !== 0 || u !== 0) && i.skew(l, u), (a !== 1 || h !== 1) && i.scale(a, h), (_ !== 0 || p !== 0) && i.translate(-1 * _, -1 * p), i.dirty = !1, i;
  }
  clone(t) {
    let e = V.Util.cloneObject(this.attrs), i, n, s, r, a;
    for (i in t)
      e[i] = t[i];
    const h = new this.constructor(e);
    for (i in this.eventListeners)
      for (n = this.eventListeners[i], s = n.length, r = 0; r < s; r++)
        a = n[r], a.name.indexOf(wa) < 0 && (h.eventListeners[i] || (h.eventListeners[i] = []), h.eventListeners[i].push(a));
    return h;
  }
  _toKonvaCanvas(t) {
    t = t || {};
    const e = this.getClientRect(), i = this.getStage(), n = t.x !== void 0 ? t.x : Math.floor(e.x), s = t.y !== void 0 ? t.y : Math.floor(e.y), r = t.pixelRatio || 1, a = new ce.SceneCanvas({
      width: t.width || Math.ceil(e.width) || (i ? i.width() : 0),
      height: t.height || Math.ceil(e.height) || (i ? i.height() : 0),
      pixelRatio: r
    }), h = a.getContext(), l = new ce.SceneCanvas({
      width: a.width / a.pixelRatio + Math.abs(n),
      height: a.height / a.pixelRatio + Math.abs(s),
      pixelRatio: a.pixelRatio
    });
    return t.imageSmoothingEnabled === !1 && (h._context.imageSmoothingEnabled = !1), h.save(), (n || s) && h.translate(-1 * n, -1 * s), this.drawScene(a, void 0, l), h.restore(), a;
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
        n && delete t.callback, V.Util._urlToImage(this.toDataURL(t), function(s) {
          e(s), n == null || n(s);
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
        n && delete t.callback, this.toCanvas(t).toBlob((s) => {
          e(s), n == null || n(s);
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
    return this.attrs.dragDistance !== void 0 ? this.attrs.dragDistance : this.parent ? this.parent.getDragDistance() : Lt.Konva.dragDistance;
  }
  _off(t, e, i) {
    let n = this.eventListeners[t], s, r, a;
    for (s = 0; s < n.length; s++)
      if (r = n[s].name, a = n[s].handler, (r !== "konva" || e === "konva") && (!e || r === e) && (!i || i === a)) {
        if (n.splice(s, 1), n.length === 0) {
          delete this.eventListeners[t];
          break;
        }
        s--;
      }
  }
  _fireChangeEvent(t, e, i) {
    this._fire(t + Sa, {
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
    const i = this[as + V.Util._capitalize(t)];
    return V.Util._isFunction(i) ? i.call(this, e) : this._setAttr(t, e), this;
  }
  _requestDraw() {
    if (Lt.Konva.autoDrawEnabled) {
      const t = this.getLayer() || this.getStage();
      t == null || t.batchDraw();
    }
  }
  _setAttr(t, e) {
    const i = this.attrs[t];
    i === e && !V.Util.isObject(e) || (e == null ? delete this.attrs[t] : this.attrs[t] = e, this._shouldFireChangeEvents && this._fireChangeEvent(t, i, e), this._requestDraw());
  }
  _setComponentAttr(t, e, i) {
    let n;
    i !== void 0 && (n = this.attrs[t], n || (this.attrs[t] = this.getAttr(t)), this.attrs[t][e] = i, this._fireChangeEvent(t, n, i));
  }
  _fireAndBubble(t, e, i) {
    e && this.nodeType === os && (e.target = this);
    const n = [
      xa,
      Pa,
      Aa,
      ka,
      Ea,
      Ta
    ];
    if (!(n.indexOf(t) !== -1 && (i && (this === i || this.isAncestorOf && this.isAncestorOf(i)) || this.nodeType === "Stage" && !i))) {
      this._fire(t, e);
      const r = n.indexOf(t) !== -1 && i && i.isAncestorOf && i.isAncestorOf(this) && !i.isAncestorOf(this.parent);
      (e && !e.cancelBubble || !e) && this.parent && this.parent.isListening() && !r && (i && i.parent ? this._fireAndBubble.call(this.parent, t, e, i) : this._fireAndBubble.call(this.parent, t, e));
    }
  }
  _getProtoListeners(t) {
    var e, i, n;
    const s = (e = this._cache.get(je)) !== null && e !== void 0 ? e : {};
    let r = s == null ? void 0 : s[t];
    if (r === void 0) {
      r = [];
      let a = Object.getPrototypeOf(this);
      for (; a; ) {
        const h = (n = (i = a.eventListeners) === null || i === void 0 ? void 0 : i[t]) !== null && n !== void 0 ? n : [];
        r.push(...h), a = Object.getPrototypeOf(a);
      }
      s[t] = r, this._cache.set(je, s);
    }
    return r;
  }
  _fire(t, e) {
    e = e || {}, e.currentTarget = this, e.type = t;
    const i = this._getProtoListeners(t);
    if (i)
      for (let s = 0; s < i.length; s++)
        i[s].handler.call(this, e);
    const n = this.eventListeners[t];
    if (n)
      for (let s = 0; s < n.length; s++)
        n[s].handler.call(this, e);
  }
  draw() {
    return this.drawScene(), this.drawHit(), this;
  }
  _createDragElement(t) {
    const e = t ? t.pointerId : void 0, i = this.getStage(), n = this.getAbsolutePosition();
    if (!i)
      return;
    const s = i._getPointerById(e) || i._changedPointerPositions[0] || n;
    bt.DD._dragElements.set(this._id, {
      node: this,
      startPointerPos: s,
      offset: {
        x: s.x - n.x,
        y: s.y - n.y
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
    const s = this.dragBoundFunc();
    if (s !== void 0) {
      const r = s.call(this, n, t);
      r ? n = r : V.Util.warn("dragBoundFunc did not return any value. That is unexpected behavior. You must return new absolute position from dragBoundFunc.");
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
      if (!(!(t.evt.button !== void 0) || Lt.Konva.dragButtons.indexOf(t.evt.button) >= 0) || this.isDragging())
        return;
      let n = !1;
      bt.DD._dragElements.forEach((s) => {
        this.isAncestorOf(s.node) && (n = !0);
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
    return V.Util.haveIntersection(i, this.getClientRect());
  }
  static create(t, e) {
    return V.Util._isString(t) && (t = JSON.parse(t)), this._createNode(t, e);
  }
  static _createNode(t, e) {
    let i = I.prototype.getClassName.call(t), n = t.children, s, r, a;
    e && (t.attrs.container = e), Lt.Konva[i] || (V.Util.warn('Can not find a node with class name "' + i + '". Fallback to "Shape".'), i = "Shape");
    const h = Lt.Konva[i];
    if (s = new h(t.attrs), n)
      for (r = n.length, a = 0; a < r; a++)
        s.add(I._createNode(n[a]));
    return s;
  }
}
tt.Node = I;
I.prototype.nodeType = "Node";
I.prototype._attrsAffectingSize = [];
I.prototype.eventListeners = {};
I.prototype.on.call(I.prototype, Ra, function() {
  if (this._batchingTransformChange) {
    this._needClearTransformCache = !0;
    return;
  }
  this._clearCache(Dt), this._clearSelfAndDescendantCache(Tt);
});
I.prototype.on.call(I.prototype, "visibleChange.konva", function() {
  this._clearSelfAndDescendantCache(pn);
});
I.prototype.on.call(I.prototype, "listeningChange.konva", function() {
  this._clearSelfAndDescendantCache(gn);
});
I.prototype.on.call(I.prototype, "opacityChange.konva", function() {
  this._clearSelfAndDescendantCache(Qe);
});
const Q = Ue.Factory.addGetterSetter;
Q(I, "zIndex");
Q(I, "absolutePosition");
Q(I, "position");
Q(I, "x", 0, (0, at.getNumberValidator)());
Q(I, "y", 0, (0, at.getNumberValidator)());
Q(I, "globalCompositeOperation", "source-over", (0, at.getStringValidator)());
Q(I, "opacity", 1, (0, at.getNumberValidator)());
Q(I, "name", "", (0, at.getStringValidator)());
Q(I, "id", "", (0, at.getStringValidator)());
Q(I, "rotation", 0, (0, at.getNumberValidator)());
Ue.Factory.addComponentsGetterSetter(I, "scale", ["x", "y"]);
Q(I, "scaleX", 1, (0, at.getNumberValidator)());
Q(I, "scaleY", 1, (0, at.getNumberValidator)());
Ue.Factory.addComponentsGetterSetter(I, "skew", ["x", "y"]);
Q(I, "skewX", 0, (0, at.getNumberValidator)());
Q(I, "skewY", 0, (0, at.getNumberValidator)());
Ue.Factory.addComponentsGetterSetter(I, "offset", ["x", "y"]);
Q(I, "offsetX", 0, (0, at.getNumberValidator)());
Q(I, "offsetY", 0, (0, at.getNumberValidator)());
Q(I, "dragDistance", void 0, (0, at.getNumberValidator)());
Q(I, "width", 0, (0, at.getNumberValidator)());
Q(I, "height", 0, (0, at.getNumberValidator)());
Q(I, "listening", !0, (0, at.getBooleanValidator)());
Q(I, "preventDefault", !0, (0, at.getBooleanValidator)());
Q(I, "filters", void 0, function(o) {
  return this._filterUpToDate = !1, o;
});
Q(I, "visible", !0, (0, at.getBooleanValidator)());
Q(I, "transformsEnabled", "all", (0, at.getStringValidator)());
Q(I, "size");
Q(I, "dragBoundFunc");
Q(I, "draggable", !1, (0, at.getBooleanValidator)());
Ue.Factory.backCompat(I, {
  rotateDeg: "rotate",
  setRotationDeg: "setRotation",
  getRotationDeg: "getRotation"
});
var Zt = {};
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.Container = void 0;
const ve = B, nn = tt, ci = D;
class te extends nn.Node {
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
      const s = n._isMatch(t);
      return s && i.push(n), !!(s && e);
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
    const t = nn.Node.prototype.toObject.call(this);
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
    const e = nn.Node.prototype.clone.call(this, t);
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
    const n = this.getLayer(), s = t || n && n.getCanvas(), r = s && s.getContext(), a = this._getCanvasCache(), h = a && a.scene, l = s && s.isCache;
    if (!this.isVisible() && !l)
      return this;
    if (h) {
      r.save();
      const u = this.getAbsoluteTransform(e).getMatrix();
      r.transform(u[0], u[1], u[2], u[3], u[4], u[5]), this._drawCachedSceneCanvas(r), r.restore();
    } else
      this._drawChildren("drawScene", s, e, i);
    return this;
  }
  drawHit(t, e) {
    if (!this.shouldDrawHit(e))
      return this;
    const i = this.getLayer(), n = t || i && i.hitCanvas, s = n && n.getContext(), r = this._getCanvasCache();
    if (r && r.hit) {
      s.save();
      const h = this.getAbsoluteTransform(e).getMatrix();
      s.transform(h[0], h[1], h[2], h[3], h[4], h[5]), this._drawCachedHitCanvas(s), s.restore();
    } else
      this._drawChildren("drawHit", n, e);
    return this;
  }
  _drawChildren(t, e, i, n) {
    var s;
    const r = e && e.getContext(), a = this.clipWidth(), h = this.clipHeight(), l = this.clipFunc(), u = typeof a == "number" && typeof h == "number" || l, _ = i === this;
    if (u) {
      r.save();
      const g = this.getAbsoluteTransform(i);
      let d = g.getMatrix();
      r.transform(d[0], d[1], d[2], d[3], d[4], d[5]), r.beginPath();
      let m;
      if (l)
        m = l.call(this, r, this);
      else {
        const y = this.clipX(), S = this.clipY();
        r.rect(y || 0, S || 0, a, h);
      }
      r.clip.apply(r, m), d = g.copy().invert().getMatrix(), r.transform(d[0], d[1], d[2], d[3], d[4], d[5]);
    }
    const p = !_ && this.globalCompositeOperation() !== "source-over" && t === "drawScene";
    p && (r.save(), r._applyGlobalCompositeOperation(this)), (s = this.children) === null || s === void 0 || s.forEach(function(g) {
      g[t](e, i, n);
    }), p && r.restore(), u && r.restore();
  }
  getClientRect(t = {}) {
    var e;
    const i = t.skipTransform, n = t.relativeTo;
    let s, r, a, h, l = {
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
      d.width === 0 && d.height === 0 || (s === void 0 ? (s = d.x, r = d.y, a = d.x + d.width, h = d.y + d.height) : (s = Math.min(s, d.x), r = Math.min(r, d.y), a = Math.max(a, d.x + d.width), h = Math.max(h, d.y + d.height)));
    });
    const _ = this.find("Shape");
    let p = !1;
    for (let g = 0; g < _.length; g++)
      if (_[g]._isVisible(this)) {
        p = !0;
        break;
      }
    return p && s !== void 0 ? l = {
      x: s,
      y: r,
      width: a - s,
      height: h - r
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
ve.Factory.addGetterSetter(te, "clipX", void 0, (0, ci.getNumberValidator)());
ve.Factory.addGetterSetter(te, "clipY", void 0, (0, ci.getNumberValidator)());
ve.Factory.addGetterSetter(te, "clipWidth", void 0, (0, ci.getNumberValidator)());
ve.Factory.addGetterSetter(te, "clipHeight", void 0, (0, ci.getNumberValidator)());
ve.Factory.addGetterSetter(te, "clipFunc");
var Xs = {}, Bt = {};
Object.defineProperty(Bt, "__esModule", { value: !0 });
Bt.getCapturedShape = Na;
Bt.createEvent = Tn;
Bt.hasPointerCapture = Ga;
Bt.setPointerCapture = La;
Bt.releaseCapture = qs;
const Oa = U, De = /* @__PURE__ */ new Map(), Ks = Oa.Konva._global.PointerEvent !== void 0;
function Na(o) {
  return De.get(o);
}
function Tn(o) {
  return {
    evt: o,
    pointerId: o.pointerId
  };
}
function Ga(o, t) {
  return De.get(o) === t;
}
function La(o, t) {
  qs(o), t.getStage() && (De.set(o, t), Ks && t._fire("gotpointercapture", Tn(new PointerEvent("gotpointercapture"))));
}
function qs(o, t) {
  const e = De.get(o);
  if (!e)
    return;
  const i = e.getStage();
  i && i.content, De.delete(o), Ks && e._fire("lostpointercapture", Tn(new PointerEvent("lostpointercapture")));
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.Stage = o.stages = void 0;
  const t = it, e = B, i = Zt, n = U, s = St, r = li, a = U, h = Bt, l = "Stage", u = "string", _ = "px", p = "mouseout", g = "mouseleave", d = "mouseover", m = "mouseenter", y = "mousemove", S = "mousedown", w = "mouseup", c = "pointermove", f = "pointerdown", b = "pointerup", x = "pointercancel", A = "lostpointercapture", v = "pointerout", k = "pointerleave", P = "pointerover", E = "pointerenter", T = "contextmenu", R = "touchstart", G = "touchend", F = "touchmove", K = "touchcancel", Y = "wheel", L = 5, W = [
    [m, "_pointerenter"],
    [S, "_pointerdown"],
    [y, "_pointermove"],
    [w, "_pointerup"],
    [g, "_pointerleave"],
    [R, "_pointerdown"],
    [F, "_pointermove"],
    [G, "_pointerup"],
    [K, "_pointercancel"],
    [d, "_pointerover"],
    [Y, "_wheel"],
    [T, "_contextmenu"],
    [f, "_pointerdown"],
    [c, "_pointermove"],
    [b, "_pointerup"],
    [x, "_pointercancel"],
    [k, "_pointerleave"],
    [A, "_lostpointercapture"]
  ], $ = {
    mouse: {
      [v]: p,
      [k]: g,
      [P]: d,
      [E]: m,
      [c]: y,
      [f]: S,
      [b]: w,
      [x]: "mousecancel",
      pointerclick: "click",
      pointerdblclick: "dblclick"
    },
    touch: {
      [v]: "touchout",
      [k]: "touchleave",
      [P]: "touchover",
      [E]: "touchenter",
      [c]: F,
      [f]: R,
      [b]: G,
      [x]: K,
      pointerclick: "tap",
      pointerdblclick: "dbltap"
    },
    pointer: {
      [v]: v,
      [k]: k,
      [P]: P,
      [E]: E,
      [c]: c,
      [f]: f,
      [b]: b,
      [x]: x,
      pointerclick: "pointerclick",
      pointerdblclick: "pointerdblclick"
    }
  }, O = (pt) => pt.indexOf("pointer") >= 0 ? "pointer" : pt.indexOf("touch") >= 0 ? "touch" : "mouse", z = (pt) => {
    const C = O(pt);
    if (C === "pointer")
      return n.Konva.pointerEventsEnabled && $.pointer;
    if (C === "touch")
      return $.touch;
    if (C === "mouse")
      return $.mouse;
  };
  function et(pt = {}) {
    return (pt.clipFunc || pt.clipWidth || pt.clipHeight) && t.Util.warn("Stage does not support clipping. Please use clip for Layers or Groups."), pt;
  }
  const oe = "Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);";
  o.stages = [];
  class At extends i.Container {
    constructor(C) {
      super(et(C)), this._pointerPositions = [], this._changedPointerPositions = [], this._buildDOM(), this._bindContentEvents(), o.stages.push(this), this.on("widthChange.konva heightChange.konva", this._resizeDOM), this.on("visibleChange.konva", this._checkVisibility), this.on("clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva", () => {
        et(this.attrs);
      }), this._checkVisibility();
    }
    _validateAdd(C) {
      const M = C.getType() === "Layer", N = C.getType() === "FastLayer";
      M || N || t.Util.throw("You may only add layers to the stage.");
    }
    _checkVisibility() {
      if (!this.content)
        return;
      const C = this.visible() ? "" : "none";
      this.content.style.display = C;
    }
    setContainer(C) {
      if (typeof C === u) {
        let M;
        if (C.charAt(0) === ".") {
          const N = C.slice(1);
          C = document.getElementsByClassName(N)[0];
        } else
          C.charAt(0) !== "#" ? M = C : M = C.slice(1), C = document.getElementById(M);
        if (!C)
          throw "Can not find container in document with id " + M;
      }
      return this._setAttr("container", C), this.content && (this.content.parentElement && this.content.parentElement.removeChild(this.content), C.appendChild(this.content)), this;
    }
    shouldDrawHit() {
      return !0;
    }
    clear() {
      const C = this.children, M = C.length;
      for (let N = 0; N < M; N++)
        C[N].clear();
      return this;
    }
    clone(C) {
      return C || (C = {}), C.container = typeof document < "u" && document.createElement("div"), i.Container.prototype.clone.call(this, C);
    }
    destroy() {
      super.destroy();
      const C = this.content;
      C && t.Util._isInDocument(C) && this.container().removeChild(C);
      const M = o.stages.indexOf(this);
      return M > -1 && o.stages.splice(M, 1), t.Util.releaseCanvas(this.bufferCanvas._canvas, this.bufferHitCanvas._canvas), this;
    }
    getPointerPosition() {
      const C = this._pointerPositions[0] || this._changedPointerPositions[0];
      return C ? {
        x: C.x,
        y: C.y
      } : (t.Util.warn(oe), null);
    }
    _getPointerById(C) {
      return this._pointerPositions.find((M) => M.id === C);
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
      const M = new s.SceneCanvas({
        width: C.width,
        height: C.height,
        pixelRatio: C.pixelRatio || 1
      }), N = M.getContext()._context, Z = this.children;
      return (C.x || C.y) && N.translate(-1 * C.x, -1 * C.y), Z.forEach(function(q) {
        if (!q.isVisible())
          return;
        const rt = q._toKonvaCanvas(C);
        N.drawImage(rt._canvas, C.x, C.y, rt.getWidth() / rt.getPixelRatio(), rt.getHeight() / rt.getPixelRatio());
      }), M;
    }
    getIntersection(C) {
      if (!C)
        return null;
      const M = this.children, N = M.length, Z = N - 1;
      for (let q = Z; q >= 0; q--) {
        const rt = M[q].getIntersection(C);
        if (rt)
          return rt;
      }
      return null;
    }
    _resizeDOM() {
      const C = this.width(), M = this.height();
      this.content && (this.content.style.width = C + _, this.content.style.height = M + _), this.bufferCanvas.setSize(C, M), this.bufferHitCanvas.setSize(C, M), this.children.forEach((N) => {
        N.setSize({ width: C, height: M }), N.draw();
      });
    }
    add(C, ...M) {
      if (arguments.length > 1) {
        for (let Z = 0; Z < arguments.length; Z++)
          this.add(arguments[Z]);
        return this;
      }
      super.add(C);
      const N = this.children.length;
      return N > L && t.Util.warn("The stage has " + N + " layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group."), C.setSize({ width: this.width(), height: this.height() }), C.draw(), n.Konva.isBrowser && this.content.appendChild(C.canvas._canvas), this;
    }
    getParent() {
      return null;
    }
    getLayer() {
      return null;
    }
    hasPointerCapture(C) {
      return h.hasPointerCapture(C, this);
    }
    setPointerCapture(C) {
      h.setPointerCapture(C, this);
    }
    releaseCapture(C) {
      h.releaseCapture(C, this);
    }
    getLayers() {
      return this.children;
    }
    _bindContentEvents() {
      n.Konva.isBrowser && W.forEach(([C, M]) => {
        this.content.addEventListener(C, (N) => {
          this[M](N);
        }, { passive: !1 });
      });
    }
    _pointerenter(C) {
      this.setPointersPositions(C);
      const M = z(C.type);
      M && this._fire(M.pointerenter, {
        evt: C,
        target: this,
        currentTarget: this
      });
    }
    _pointerover(C) {
      this.setPointersPositions(C);
      const M = z(C.type);
      M && this._fire(M.pointerover, {
        evt: C,
        target: this,
        currentTarget: this
      });
    }
    _getTargetShape(C) {
      let M = this[C + "targetShape"];
      return M && !M.getStage() && (M = null), M;
    }
    _pointerleave(C) {
      const M = z(C.type), N = O(C.type);
      if (!M)
        return;
      this.setPointersPositions(C);
      const Z = this._getTargetShape(N), q = !(n.Konva.isDragging() || n.Konva.isTransforming()) || n.Konva.hitOnDragEnabled;
      Z && q ? (Z._fireAndBubble(M.pointerout, { evt: C }), Z._fireAndBubble(M.pointerleave, { evt: C }), this._fire(M.pointerleave, {
        evt: C,
        target: this,
        currentTarget: this
      }), this[N + "targetShape"] = null) : q && (this._fire(M.pointerleave, {
        evt: C,
        target: this,
        currentTarget: this
      }), this._fire(M.pointerout, {
        evt: C,
        target: this,
        currentTarget: this
      })), this.pointerPos = null, this._pointerPositions = [];
    }
    _pointerdown(C) {
      const M = z(C.type), N = O(C.type);
      if (!M)
        return;
      this.setPointersPositions(C);
      let Z = !1;
      this._changedPointerPositions.forEach((q) => {
        const rt = this.getIntersection(q);
        if (r.DD.justDragged = !1, n.Konva["_" + N + "ListenClick"] = !0, !rt || !rt.isListening()) {
          this[N + "ClickStartShape"] = void 0;
          return;
        }
        n.Konva.capturePointerEventsEnabled && rt.setPointerCapture(q.id), this[N + "ClickStartShape"] = rt, rt._fireAndBubble(M.pointerdown, {
          evt: C,
          pointerId: q.id
        }), Z = !0;
        const yt = C.type.indexOf("touch") >= 0;
        rt.preventDefault() && C.cancelable && yt && C.preventDefault();
      }), Z || this._fire(M.pointerdown, {
        evt: C,
        target: this,
        currentTarget: this,
        pointerId: this._pointerPositions[0].id
      });
    }
    _pointermove(C) {
      const M = z(C.type), N = O(C.type);
      if (!M || (n.Konva.isDragging() && r.DD.node.preventDefault() && C.cancelable && C.preventDefault(), this.setPointersPositions(C), !(!(n.Konva.isDragging() || n.Konva.isTransforming()) || n.Konva.hitOnDragEnabled)))
        return;
      const q = {};
      let rt = !1;
      const yt = this._getTargetShape(N);
      this._changedPointerPositions.forEach((Gt) => {
        const J = h.getCapturedShape(Gt.id) || this.getIntersection(Gt), he = Gt.id, kt = { evt: C, pointerId: he }, le = yt !== J;
        if (le && yt && (yt._fireAndBubble(M.pointerout, { ...kt }, J), yt._fireAndBubble(M.pointerleave, { ...kt }, J)), J) {
          if (q[J._id])
            return;
          q[J._id] = !0;
        }
        J && J.isListening() ? (rt = !0, le && (J._fireAndBubble(M.pointerover, { ...kt }, yt), J._fireAndBubble(M.pointerenter, { ...kt }, yt), this[N + "targetShape"] = J), J._fireAndBubble(M.pointermove, { ...kt })) : yt && (this._fire(M.pointerover, {
          evt: C,
          target: this,
          currentTarget: this,
          pointerId: he
        }), this[N + "targetShape"] = null);
      }), rt || this._fire(M.pointermove, {
        evt: C,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id
      });
    }
    _pointerup(C) {
      const M = z(C.type), N = O(C.type);
      if (!M)
        return;
      this.setPointersPositions(C);
      const Z = this[N + "ClickStartShape"], q = this[N + "ClickEndShape"], rt = {};
      let yt = !1;
      this._changedPointerPositions.forEach((Gt) => {
        const J = h.getCapturedShape(Gt.id) || this.getIntersection(Gt);
        if (J) {
          if (J.releaseCapture(Gt.id), rt[J._id])
            return;
          rt[J._id] = !0;
        }
        const he = Gt.id, kt = { evt: C, pointerId: he };
        let le = !1;
        n.Konva["_" + N + "InDblClickWindow"] ? (le = !0, clearTimeout(this[N + "DblTimeout"])) : r.DD.justDragged || (n.Konva["_" + N + "InDblClickWindow"] = !0, clearTimeout(this[N + "DblTimeout"])), this[N + "DblTimeout"] = setTimeout(function() {
          n.Konva["_" + N + "InDblClickWindow"] = !1;
        }, n.Konva.dblClickWindow), J && J.isListening() ? (yt = !0, this[N + "ClickEndShape"] = J, J._fireAndBubble(M.pointerup, { ...kt }), n.Konva["_" + N + "ListenClick"] && Z && Z === J && (J._fireAndBubble(M.pointerclick, { ...kt }), le && q && q === J && J._fireAndBubble(M.pointerdblclick, { ...kt }))) : (this[N + "ClickEndShape"] = null, n.Konva["_" + N + "ListenClick"] && this._fire(M.pointerclick, {
          evt: C,
          target: this,
          currentTarget: this,
          pointerId: he
        }), le && this._fire(M.pointerdblclick, {
          evt: C,
          target: this,
          currentTarget: this,
          pointerId: he
        }));
      }), yt || this._fire(M.pointerup, {
        evt: C,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id
      }), n.Konva["_" + N + "ListenClick"] = !1, C.cancelable && N !== "touch" && N !== "pointer" && C.preventDefault();
    }
    _contextmenu(C) {
      this.setPointersPositions(C);
      const M = this.getIntersection(this.getPointerPosition());
      M && M.isListening() ? M._fireAndBubble(T, { evt: C }) : this._fire(T, {
        evt: C,
        target: this,
        currentTarget: this
      });
    }
    _wheel(C) {
      this.setPointersPositions(C);
      const M = this.getIntersection(this.getPointerPosition());
      M && M.isListening() ? M._fireAndBubble(Y, { evt: C }) : this._fire(Y, {
        evt: C,
        target: this,
        currentTarget: this
      });
    }
    _pointercancel(C) {
      this.setPointersPositions(C);
      const M = h.getCapturedShape(C.pointerId) || this.getIntersection(this.getPointerPosition());
      M && M._fireAndBubble(b, h.createEvent(C)), h.releaseCapture(C.pointerId);
    }
    _lostpointercapture(C) {
      h.releaseCapture(C.pointerId);
    }
    setPointersPositions(C) {
      const M = this._getContentPosition();
      let N = null, Z = null;
      C = C || window.event, C.touches !== void 0 ? (this._pointerPositions = [], this._changedPointerPositions = [], Array.prototype.forEach.call(C.touches, (q) => {
        this._pointerPositions.push({
          id: q.identifier,
          x: (q.clientX - M.left) / M.scaleX,
          y: (q.clientY - M.top) / M.scaleY
        });
      }), Array.prototype.forEach.call(C.changedTouches || C.touches, (q) => {
        this._changedPointerPositions.push({
          id: q.identifier,
          x: (q.clientX - M.left) / M.scaleX,
          y: (q.clientY - M.top) / M.scaleY
        });
      })) : (N = (C.clientX - M.left) / M.scaleX, Z = (C.clientY - M.top) / M.scaleY, this.pointerPos = {
        x: N,
        y: Z
      }, this._pointerPositions = [{ x: N, y: Z, id: t.Util._getFirstPointerId(C) }], this._changedPointerPositions = [
        { x: N, y: Z, id: t.Util._getFirstPointerId(C) }
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
      if (this.bufferCanvas = new s.SceneCanvas({
        width: this.width(),
        height: this.height()
      }), this.bufferHitCanvas = new s.HitCanvas({
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
  o.Stage = At, At.prototype.nodeType = l, (0, a._registerNode)(At), e.Factory.addGetterSetter(At, "container"), n.Konva.isBrowser && document.addEventListener("visibilitychange", () => {
    o.stages.forEach((pt) => {
      pt.batchDraw();
    });
  });
})(Xs);
var Be = {}, ct = {};
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.Shape = o.shapes = void 0;
  const t = U, e = it, i = B, n = tt, s = D, r = U, a = Bt, h = "hasShadow", l = "shadowRGBA", u = "patternImage", _ = "linearGradient", p = "radialGradient";
  let g;
  function d() {
    return g || (g = e.Util.createCanvasElement().getContext("2d"), g);
  }
  o.shapes = {};
  function m(k) {
    const P = this.attrs.fillRule;
    P ? k.fill(P) : k.fill();
  }
  function y(k) {
    k.stroke();
  }
  function S(k) {
    const P = this.attrs.fillRule;
    P ? k.fill(P) : k.fill();
  }
  function w(k) {
    k.stroke();
  }
  function c() {
    this._clearCache(h);
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
  function A() {
    this._clearCache(p);
  }
  class v extends n.Node {
    constructor(P) {
      super(P);
      let E;
      for (; E = e.Util.getRandomColor(), !(E && !(E in o.shapes)); )
        ;
      this.colorKey = E, o.shapes[E] = this;
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
      return this._getCache(h, this._hasShadow);
    }
    _hasShadow() {
      return this.shadowEnabled() && this.shadowOpacity() !== 0 && !!(this.shadowColor() || this.shadowBlur() || this.shadowOffsetX() || this.shadowOffsetY());
    }
    _getFillPattern() {
      return this._getCache(u, this.__getFillPattern);
    }
    __getFillPattern() {
      if (this.fillPatternImage()) {
        const E = d().createPattern(this.fillPatternImage(), this.fillPatternRepeat() || "repeat");
        if (E && E.setTransform) {
          const T = new e.Transform();
          T.translate(this.fillPatternX(), this.fillPatternY()), T.rotate(t.Konva.getAngle(this.fillPatternRotation())), T.scale(this.fillPatternScaleX(), this.fillPatternScaleY()), T.translate(-1 * this.fillPatternOffsetX(), -1 * this.fillPatternOffsetY());
          const R = T.getMatrix(), G = typeof DOMMatrix > "u" ? {
            a: R[0],
            b: R[1],
            c: R[2],
            d: R[3],
            e: R[4],
            f: R[5]
          } : new DOMMatrix(R);
          E.setTransform(G);
        }
        return E;
      }
    }
    _getLinearGradient() {
      return this._getCache(_, this.__getLinearGradient);
    }
    __getLinearGradient() {
      const P = this.fillLinearGradientColorStops();
      if (P) {
        const E = d(), T = this.fillLinearGradientStartPoint(), R = this.fillLinearGradientEndPoint(), G = E.createLinearGradient(T.x, T.y, R.x, R.y);
        for (let F = 0; F < P.length; F += 2)
          G.addColorStop(P[F], P[F + 1]);
        return G;
      }
    }
    _getRadialGradient() {
      return this._getCache(p, this.__getRadialGradient);
    }
    __getRadialGradient() {
      const P = this.fillRadialGradientColorStops();
      if (P) {
        const E = d(), T = this.fillRadialGradientStartPoint(), R = this.fillRadialGradientEndPoint(), G = E.createRadialGradient(T.x, T.y, this.fillRadialGradientStartRadius(), R.x, R.y, this.fillRadialGradientEndRadius());
        for (let F = 0; F < P.length; F += 2)
          G.addColorStop(P[F], P[F + 1]);
        return G;
      }
    }
    getShadowRGBA() {
      return this._getCache(l, this._getShadowRGBA);
    }
    _getShadowRGBA() {
      if (!this.hasShadow())
        return;
      const P = e.Util.colorToRGBA(this.shadowColor());
      if (P)
        return "rgba(" + P.r + "," + P.g + "," + P.b + "," + P.a * (this.shadowOpacity() || 1) + ")";
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
      const P = this.hitStrokeWidth();
      return P === "auto" ? this.hasStroke() : this.strokeEnabled() && !!P;
    }
    intersects(P) {
      const E = this.getStage();
      if (!E)
        return !1;
      const T = E.bufferHitCanvas;
      return T.getContext().clear(), this.drawHit(T, void 0, !0), T.context.getImageData(Math.round(P.x), Math.round(P.y), 1, 1).data[3] > 0;
    }
    destroy() {
      return n.Node.prototype.destroy.call(this), delete o.shapes[this.colorKey], delete this.colorKey, this;
    }
    _useBufferCanvas(P) {
      var E;
      if (!((E = this.attrs.perfectDrawEnabled) !== null && E !== void 0 ? E : !0))
        return !1;
      const R = P || this.hasFill(), G = this.hasStroke(), F = this.getAbsoluteOpacity() !== 1;
      if (R && G && F)
        return !0;
      const K = this.hasShadow(), Y = this.shadowForStrokeEnabled();
      return !!(R && G && K && Y);
    }
    setStrokeHitEnabled(P) {
      e.Util.warn("strokeHitEnabled property is deprecated. Please use hitStrokeWidth instead."), P ? this.hitStrokeWidth("auto") : this.hitStrokeWidth(0);
    }
    getStrokeHitEnabled() {
      return this.hitStrokeWidth() !== 0;
    }
    getSelfRect() {
      const P = this.size();
      return {
        x: this._centroid ? -P.width / 2 : 0,
        y: this._centroid ? -P.height / 2 : 0,
        width: P.width,
        height: P.height
      };
    }
    getClientRect(P = {}) {
      let E = !1, T = this.getParent();
      for (; T; ) {
        if (T.isCached()) {
          E = !0;
          break;
        }
        T = T.getParent();
      }
      const R = P.skipTransform, G = P.relativeTo || E && this.getStage() || void 0, F = this.getSelfRect(), Y = !P.skipStroke && this.hasStroke() && this.strokeWidth() || 0, L = F.width + Y, W = F.height + Y, $ = !P.skipShadow && this.hasShadow(), O = $ ? this.shadowOffsetX() : 0, z = $ ? this.shadowOffsetY() : 0, et = L + Math.abs(O), oe = W + Math.abs(z), At = $ && this.shadowBlur() || 0, pt = et + At * 2, C = oe + At * 2, M = {
        width: pt,
        height: C,
        x: -(Y / 2 + At) + Math.min(O, 0) + F.x,
        y: -(Y / 2 + At) + Math.min(z, 0) + F.y
      };
      return R ? M : this._transformedRect(M, G);
    }
    drawScene(P, E, T) {
      const R = this.getLayer(), G = P || R.getCanvas(), F = G.getContext(), K = this._getCanvasCache(), Y = this.getSceneFunc(), L = this.hasShadow();
      let W;
      const $ = E === this;
      if (!this.isVisible() && !$)
        return this;
      if (K) {
        F.save();
        const O = this.getAbsoluteTransform(E).getMatrix();
        return F.transform(O[0], O[1], O[2], O[3], O[4], O[5]), this._drawCachedSceneCanvas(F), F.restore(), this;
      }
      if (!Y)
        return this;
      if (F.save(), this._useBufferCanvas()) {
        W = this.getStage();
        const O = T || W.bufferCanvas, z = O.getContext();
        z.clear(), z.save(), z._applyLineJoin(this);
        const et = this.getAbsoluteTransform(E).getMatrix();
        z.transform(et[0], et[1], et[2], et[3], et[4], et[5]), Y.call(this, z, this), z.restore();
        const oe = O.pixelRatio;
        L && F._applyShadow(this), F._applyOpacity(this), F._applyGlobalCompositeOperation(this), F.drawImage(O._canvas, O.x || 0, O.y || 0, O.width / oe, O.height / oe);
      } else {
        if (F._applyLineJoin(this), !$) {
          const O = this.getAbsoluteTransform(E).getMatrix();
          F.transform(O[0], O[1], O[2], O[3], O[4], O[5]), F._applyOpacity(this), F._applyGlobalCompositeOperation(this);
        }
        L && F._applyShadow(this), Y.call(this, F, this);
      }
      return F.restore(), this;
    }
    drawHit(P, E, T = !1) {
      if (!this.shouldDrawHit(E, T))
        return this;
      const R = this.getLayer(), G = P || R.hitCanvas, F = G && G.getContext(), K = this.hitFunc() || this.sceneFunc(), Y = this._getCanvasCache(), L = Y && Y.hit;
      if (this.colorKey || e.Util.warn("Looks like your canvas has a destroyed shape in it. Do not reuse shape after you destroyed it. If you want to reuse shape you should call remove() instead of destroy()"), L) {
        F.save();
        const $ = this.getAbsoluteTransform(E).getMatrix();
        return F.transform($[0], $[1], $[2], $[3], $[4], $[5]), this._drawCachedHitCanvas(F), F.restore(), this;
      }
      if (!K)
        return this;
      if (F.save(), F._applyLineJoin(this), !(this === E)) {
        const $ = this.getAbsoluteTransform(E).getMatrix();
        F.transform($[0], $[1], $[2], $[3], $[4], $[5]);
      }
      return K.call(this, F, this), F.restore(), this;
    }
    drawHitFromCache(P = 0) {
      const E = this._getCanvasCache(), T = this._getCachedSceneCanvas(), R = E.hit, G = R.getContext(), F = R.getWidth(), K = R.getHeight();
      G.clear(), G.drawImage(T._canvas, 0, 0, F, K);
      try {
        const Y = G.getImageData(0, 0, F, K), L = Y.data, W = L.length, $ = e.Util._hexToRgb(this.colorKey);
        for (let O = 0; O < W; O += 4)
          L[O + 3] > P ? (L[O] = $.r, L[O + 1] = $.g, L[O + 2] = $.b, L[O + 3] = 255) : L[O + 3] = 0;
        G.putImageData(Y, 0, 0);
      } catch (Y) {
        e.Util.error("Unable to draw hit graph from cached scene canvas. " + Y.message);
      }
      return this;
    }
    hasPointerCapture(P) {
      return a.hasPointerCapture(P, this);
    }
    setPointerCapture(P) {
      a.setPointerCapture(P, this);
    }
    releaseCapture(P) {
      a.releaseCapture(P, this);
    }
  }
  o.Shape = v, v.prototype._fillFunc = m, v.prototype._strokeFunc = y, v.prototype._fillFuncHit = S, v.prototype._strokeFuncHit = w, v.prototype._centroid = !1, v.prototype.nodeType = "Shape", (0, r._registerNode)(v), v.prototype.eventListeners = {}, v.prototype.on.call(v.prototype, "shadowColorChange.konva shadowBlurChange.konva shadowOffsetChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", c), v.prototype.on.call(v.prototype, "shadowColorChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", f), v.prototype.on.call(v.prototype, "fillPriorityChange.konva fillPatternImageChange.konva fillPatternRepeatChange.konva fillPatternScaleXChange.konva fillPatternScaleYChange.konva fillPatternOffsetXChange.konva fillPatternOffsetYChange.konva fillPatternXChange.konva fillPatternYChange.konva fillPatternRotationChange.konva", b), v.prototype.on.call(v.prototype, "fillPriorityChange.konva fillLinearGradientColorStopsChange.konva fillLinearGradientStartPointXChange.konva fillLinearGradientStartPointYChange.konva fillLinearGradientEndPointXChange.konva fillLinearGradientEndPointYChange.konva", x), v.prototype.on.call(v.prototype, "fillPriorityChange.konva fillRadialGradientColorStopsChange.konva fillRadialGradientStartPointXChange.konva fillRadialGradientStartPointYChange.konva fillRadialGradientEndPointXChange.konva fillRadialGradientEndPointYChange.konva fillRadialGradientStartRadiusChange.konva fillRadialGradientEndRadiusChange.konva", A), i.Factory.addGetterSetter(v, "stroke", void 0, (0, s.getStringOrGradientValidator)()), i.Factory.addGetterSetter(v, "strokeWidth", 2, (0, s.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillAfterStrokeEnabled", !1), i.Factory.addGetterSetter(v, "hitStrokeWidth", "auto", (0, s.getNumberOrAutoValidator)()), i.Factory.addGetterSetter(v, "strokeHitEnabled", !0, (0, s.getBooleanValidator)()), i.Factory.addGetterSetter(v, "perfectDrawEnabled", !0, (0, s.getBooleanValidator)()), i.Factory.addGetterSetter(v, "shadowForStrokeEnabled", !0, (0, s.getBooleanValidator)()), i.Factory.addGetterSetter(v, "lineJoin"), i.Factory.addGetterSetter(v, "lineCap"), i.Factory.addGetterSetter(v, "sceneFunc"), i.Factory.addGetterSetter(v, "hitFunc"), i.Factory.addGetterSetter(v, "dash"), i.Factory.addGetterSetter(v, "dashOffset", 0, (0, s.getNumberValidator)()), i.Factory.addGetterSetter(v, "shadowColor", void 0, (0, s.getStringValidator)()), i.Factory.addGetterSetter(v, "shadowBlur", 0, (0, s.getNumberValidator)()), i.Factory.addGetterSetter(v, "shadowOpacity", 1, (0, s.getNumberValidator)()), i.Factory.addComponentsGetterSetter(v, "shadowOffset", ["x", "y"]), i.Factory.addGetterSetter(v, "shadowOffsetX", 0, (0, s.getNumberValidator)()), i.Factory.addGetterSetter(v, "shadowOffsetY", 0, (0, s.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternImage"), i.Factory.addGetterSetter(v, "fill", void 0, (0, s.getStringOrGradientValidator)()), i.Factory.addGetterSetter(v, "fillPatternX", 0, (0, s.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternY", 0, (0, s.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillLinearGradientColorStops"), i.Factory.addGetterSetter(v, "strokeLinearGradientColorStops"), i.Factory.addGetterSetter(v, "fillRadialGradientStartRadius", 0), i.Factory.addGetterSetter(v, "fillRadialGradientEndRadius", 0), i.Factory.addGetterSetter(v, "fillRadialGradientColorStops"), i.Factory.addGetterSetter(v, "fillPatternRepeat", "repeat"), i.Factory.addGetterSetter(v, "fillEnabled", !0), i.Factory.addGetterSetter(v, "strokeEnabled", !0), i.Factory.addGetterSetter(v, "shadowEnabled", !0), i.Factory.addGetterSetter(v, "dashEnabled", !0), i.Factory.addGetterSetter(v, "strokeScaleEnabled", !0), i.Factory.addGetterSetter(v, "fillPriority", "color"), i.Factory.addComponentsGetterSetter(v, "fillPatternOffset", ["x", "y"]), i.Factory.addGetterSetter(v, "fillPatternOffsetX", 0, (0, s.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternOffsetY", 0, (0, s.getNumberValidator)()), i.Factory.addComponentsGetterSetter(v, "fillPatternScale", ["x", "y"]), i.Factory.addGetterSetter(v, "fillPatternScaleX", 1, (0, s.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternScaleY", 1, (0, s.getNumberValidator)()), i.Factory.addComponentsGetterSetter(v, "fillLinearGradientStartPoint", [
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
  ]), i.Factory.addGetterSetter(v, "fillRadialGradientEndPointX", 0), i.Factory.addGetterSetter(v, "fillRadialGradientEndPointY", 0), i.Factory.addGetterSetter(v, "fillPatternRotation", 0), i.Factory.addGetterSetter(v, "fillRule", void 0, (0, s.getStringValidator)()), i.Factory.backCompat(v, {
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
})(ct);
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.Layer = void 0;
const Et = it, sn = Zt, de = tt, Mn = B, ls = St, Da = D, Ia = ct, $a = U, Ua = "#", Ba = "beforeDraw", Va = "draw", Qs = [
  { x: 0, y: 0 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 }
], Ha = Qs.length;
class Se extends sn.Container {
  constructor(t) {
    super(t), this.canvas = new ls.SceneCanvas(), this.hitCanvas = new ls.HitCanvas({
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
      for (let n = 0; n < Ha; n++) {
        const s = Qs[n], r = this._getIntersection({
          x: t.x + s.x * e,
          y: t.y + s.y * e
        }), a = r.shape;
        if (a)
          return a;
        if (i = !!r.antialiased, !r.antialiased)
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
      const s = Et.Util._rgbToHex(i[0], i[1], i[2]), r = Ia.shapes[Ua + s];
      return r ? {
        shape: r
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
    const n = this.getLayer(), s = t || n && n.getCanvas();
    return this._fire(Ba, {
      node: this
    }), this.clearBeforeDraw() && s.getContext().clear(), sn.Container.prototype.drawScene.call(this, s, e, i), this._fire(Va, {
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
(0, $a._registerNode)(Se);
Mn.Factory.addGetterSetter(Se, "imageSmoothingEnabled", !0);
Mn.Factory.addGetterSetter(Se, "clearBeforeDraw", !0);
Mn.Factory.addGetterSetter(Se, "hitGraphEnabled", !0, (0, Da.getBooleanValidator)());
var di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
di.FastLayer = void 0;
const za = it, Wa = Be, ja = U;
class Rn extends Wa.Layer {
  constructor(t) {
    super(t), this.listening(!1), za.Util.warn('Konva.Fast layer is deprecated. Please use "new Konva.Layer({ listening: false })" instead.');
  }
}
di.FastLayer = Rn;
Rn.prototype.nodeType = "FastLayer";
(0, ja._registerNode)(Rn);
var Ce = {};
Object.defineProperty(Ce, "__esModule", { value: !0 });
Ce.Group = void 0;
const Ya = it, Xa = Zt, Ka = U;
class Fn extends Xa.Container {
  _validateAdd(t) {
    const e = t.getType();
    e !== "Group" && e !== "Shape" && Ya.Util.throw("You may only add groups and shapes to groups.");
  }
}
Ce.Group = Fn;
Fn.prototype.nodeType = "Group";
(0, Ka._registerNode)(Fn);
var we = {};
Object.defineProperty(we, "__esModule", { value: !0 });
we.Animation = void 0;
const rn = U, cs = it, an = function() {
  return rn.glob.performance && rn.glob.performance.now ? function() {
    return rn.glob.performance.now();
  } : function() {
    return (/* @__PURE__ */ new Date()).getTime();
  };
}();
class wt {
  constructor(t, e) {
    this.id = wt.animIdCounter++, this.frame = {
      time: 0,
      timeDiff: 0,
      lastTime: an(),
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
    return this.stop(), this.frame.timeDiff = 0, this.frame.lastTime = an(), wt._addAnimation(this), this;
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
    for (let s = 0; s < n; s++)
      if (i[s].id === e) {
        this.animations.splice(s, 1);
        break;
      }
  }
  static _runFrames() {
    const t = {}, e = this.animations;
    for (let i = 0; i < e.length; i++) {
      const n = e[i], s = n.layers, r = n.func;
      n._updateFrameObject(an());
      const a = s.length;
      let h;
      if (r ? h = r.call(n, n.frame) !== !1 : h = !0, !!h)
        for (let l = 0; l < a; l++) {
          const u = s[l];
          u._id !== void 0 && (t[u._id] = u);
        }
    }
    for (const i in t)
      t.hasOwnProperty(i) && t[i].batchDraw();
  }
  static _animationLoop() {
    const t = wt;
    t.animations.length ? (t._runFrames(), cs.Util.requestAnimFrame(t._animationLoop)) : t.animRunning = !1;
  }
  static _handleAnimation() {
    this.animRunning || (this.animRunning = !0, cs.Util.requestAnimFrame(this._animationLoop));
  }
}
we.Animation = wt;
wt.animations = [];
wt.animIdCounter = 0;
wt.animRunning = !1;
var Js = {};
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.Easings = o.Tween = void 0;
  const t = it, e = we, i = tt, n = U, s = {
    node: 1,
    duration: 1,
    easing: 1,
    onFinish: 1,
    yoyo: 1
  }, r = 1, a = 2, h = 3, l = ["fill", "stroke", "shadowColor"];
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
      this.state = h, this._time = this.duration - this._time, this._startTime = this.getTimer() - this._time, this.onEnterFrame(), this.fire("onReverse");
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
      this.state === a ? this.setTime(d) : this.state === h && this.setTime(this.duration - d);
    }
    pause() {
      this.state = r, this.fire("onPause");
    }
    getTimer() {
      return (/* @__PURE__ */ new Date()).getTime();
    }
  }
  class p {
    constructor(d) {
      const m = this, y = d.node, S = y._id, w = d.easing || o.Easings.Linear, c = !!d.yoyo;
      let f, b;
      typeof d.duration > "u" ? f = 0.3 : d.duration === 0 ? f = 1e-3 : f = d.duration, this.node = y, this._id = u++;
      const x = y.getLayer() || (y instanceof n.Konva.Stage ? y.getLayers() : null);
      x || t.Util.error("Tween constructor have `node` that is not in a layer. Please add node into layer first."), this.anim = new e.Animation(function() {
        m.tween.onEnterFrame();
      }, x), this.tween = new _(b, function(A) {
        m._tweenFunc(A);
      }, w, 0, 1, f * 1e3, c), this._addListeners(), p.attrs[S] || (p.attrs[S] = {}), p.attrs[S][this._id] || (p.attrs[S][this._id] = {}), p.tweens[S] || (p.tweens[S] = {});
      for (b in d)
        s[b] === void 0 && this._addAttr(b, d[b]);
      this.reset(), this.onFinish = d.onFinish, this.onReset = d.onReset, this.onUpdate = d.onUpdate;
    }
    _addAttr(d, m) {
      const y = this.node, S = y._id;
      let w, c, f, b, x;
      const A = p.tweens[S][d];
      A && delete p.attrs[S][A][d];
      let v = y.getAttr(d);
      if (t.Util._isArray(m))
        if (w = [], c = Math.max(m.length, v.length), d === "points" && m.length !== v.length && (m.length > v.length ? (b = v, v = t.Util._prepareArrayForTween(v, m, y.closed())) : (f = m, m = t.Util._prepareArrayForTween(m, v, y.closed()))), d.indexOf("fill") === 0)
          for (let k = 0; k < c; k++)
            if (k % 2 === 0)
              w.push(m[k] - v[k]);
            else {
              const P = t.Util.colorToRGBA(v[k]);
              x = t.Util.colorToRGBA(m[k]), v[k] = P, w.push({
                r: x.r - P.r,
                g: x.g - P.g,
                b: x.b - P.b,
                a: x.a - P.a
              });
            }
        else
          for (let k = 0; k < c; k++)
            w.push(m[k] - v[k]);
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
      let S, w, c, f, b, x, A, v;
      for (S in y) {
        if (w = y[S], c = w.start, f = w.diff, v = w.end, t.Util._isArray(c))
          if (b = [], A = Math.max(c.length, v.length), S.indexOf("fill") === 0)
            for (x = 0; x < A; x++)
              x % 2 === 0 ? b.push((c[x] || 0) + f[x] * d) : b.push("rgba(" + Math.round(c[x].r + f[x].r * d) + "," + Math.round(c[x].g + f[x].g * d) + "," + Math.round(c[x].b + f[x].b * d) + "," + (c[x].a + f[x].a * d) + ")");
          else
            for (x = 0; x < A; x++)
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
  o.Tween = p, p.attrs = {}, p.tweens = {}, i.Node.prototype.to = function(g) {
    const d = g.onFinish;
    g.node = this, g.onFinish = function() {
      this.destroy(), d && d();
    }, new p(g).play();
  }, o.Easings = {
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
      return m - o.Easings.BounceEaseOut(y - g, 0, m, y) + d;
    },
    BounceEaseInOut(g, d, m, y) {
      return g < y / 2 ? o.Easings.BounceEaseIn(g * 2, 0, m, y) * 0.5 + d : o.Easings.BounceEaseOut(g * 2 - y, 0, m, y) * 0.5 + m * 0.5 + d;
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
})(Js);
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.Konva = void 0;
  const t = U, e = it, i = tt, n = Zt, s = Xs, r = Be, a = di, h = Ce, l = li, u = ct, _ = we, p = Js, g = Mt, d = St;
  o.Konva = e.Util._assign(t.Konva, {
    Util: e.Util,
    Transform: e.Transform,
    Node: i.Node,
    Container: n.Container,
    Stage: s.Stage,
    stages: s.stages,
    Layer: r.Layer,
    FastLayer: a.FastLayer,
    Group: h.Group,
    DD: l.DD,
    Shape: u.Shape,
    shapes: u.shapes,
    Animation: _.Animation,
    Tween: p.Tween,
    Easings: p.Easings,
    Context: g.Context,
    Canvas: d.Canvas
  }), o.default = o.Konva;
})(zs);
var ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
ui.Arc = void 0;
const fi = B, qa = ct, ds = U, gi = D, Qa = U;
class Ot extends qa.Shape {
  _sceneFunc(t) {
    const e = ds.Konva.getAngle(this.angle()), i = this.clockwise();
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
    const t = this.innerRadius(), e = this.outerRadius(), i = this.clockwise(), n = ds.Konva.getAngle(i ? 360 - this.angle() : this.angle()), s = Math.cos(Math.min(n, Math.PI)), r = 1, a = Math.sin(Math.min(Math.max(Math.PI, n), 3 * Math.PI / 2)), h = Math.sin(Math.min(n, Math.PI / 2)), l = s * (s > 0 ? t : e), u = r * e, _ = a * (a > 0 ? t : e), p = h * (h > 0 ? e : t);
    return {
      x: l,
      y: i ? -1 * p : _,
      width: u - l,
      height: p - _
    };
  }
}
ui.Arc = Ot;
Ot.prototype._centroid = !0;
Ot.prototype.className = "Arc";
Ot.prototype._attrsAffectingSize = [
  "innerRadius",
  "outerRadius",
  "angle",
  "clockwise"
];
(0, Qa._registerNode)(Ot);
fi.Factory.addGetterSetter(Ot, "innerRadius", 0, (0, gi.getNumberValidator)());
fi.Factory.addGetterSetter(Ot, "outerRadius", 0, (0, gi.getNumberValidator)());
fi.Factory.addGetterSetter(Ot, "angle", 0, (0, gi.getNumberValidator)());
fi.Factory.addGetterSetter(Ot, "clockwise", !1, (0, gi.getBooleanValidator)());
var pi = {}, Ve = {};
Object.defineProperty(Ve, "__esModule", { value: !0 });
Ve.Line = void 0;
const _i = B, Ja = U, Za = ct, Zs = D;
function _n(o, t, e, i, n, s, r) {
  const a = Math.sqrt(Math.pow(e - o, 2) + Math.pow(i - t, 2)), h = Math.sqrt(Math.pow(n - e, 2) + Math.pow(s - i, 2)), l = r * a / (a + h), u = r * h / (a + h), _ = e - l * (n - o), p = i - l * (s - t), g = e + u * (n - o), d = i + u * (s - t);
  return [_, p, g, d];
}
function us(o, t) {
  const e = o.length, i = [];
  for (let n = 2; n < e - 2; n += 2) {
    const s = _n(o[n - 2], o[n - 1], o[n], o[n + 1], o[n + 2], o[n + 3], t);
    isNaN(s[0]) || (i.push(s[0]), i.push(s[1]), i.push(o[n]), i.push(o[n + 1]), i.push(s[2]), i.push(s[3]));
  }
  return i;
}
class Vt extends Za.Shape {
  constructor(t) {
    super(t), this.on("pointsChange.konva tensionChange.konva closedChange.konva bezierChange.konva", function() {
      this._clearCache("tensionPoints");
    });
  }
  _sceneFunc(t) {
    const e = this.points(), i = e.length, n = this.tension(), s = this.closed(), r = this.bezier();
    if (!i)
      return;
    let a = 0;
    if (t.beginPath(), t.moveTo(e[0], e[1]), n !== 0 && i > 4) {
      const h = this.getTensionPoints(), l = h.length;
      for (a = s ? 0 : 4, s || t.quadraticCurveTo(h[0], h[1], h[2], h[3]); a < l - 2; )
        t.bezierCurveTo(h[a++], h[a++], h[a++], h[a++], h[a++], h[a++]);
      s || t.quadraticCurveTo(h[l - 2], h[l - 1], e[i - 2], e[i - 1]);
    } else if (r)
      for (a = 2; a < i; )
        t.bezierCurveTo(e[a++], e[a++], e[a++], e[a++], e[a++], e[a++]);
    else
      for (a = 2; a < i; a += 2)
        t.lineTo(e[a], e[a + 1]);
    s ? (t.closePath(), t.fillStrokeShape(this)) : t.strokeShape(this);
  }
  getTensionPoints() {
    return this._getCache("tensionPoints", this._getTensionPoints);
  }
  _getTensionPoints() {
    return this.closed() ? this._getTensionPointsClosed() : us(this.points(), this.tension());
  }
  _getTensionPointsClosed() {
    const t = this.points(), e = t.length, i = this.tension(), n = _n(t[e - 2], t[e - 1], t[0], t[1], t[2], t[3], i), s = _n(t[e - 4], t[e - 3], t[e - 2], t[e - 1], t[0], t[1], i), r = us(t, i);
    return [n[2], n[3]].concat(r).concat([
      s[0],
      s[1],
      t[e - 2],
      t[e - 1],
      s[2],
      s[3],
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
    let e = t[0], i = t[0], n = t[1], s = t[1], r, a;
    for (let h = 0; h < t.length / 2; h++)
      r = t[h * 2], a = t[h * 2 + 1], e = Math.min(e, r), i = Math.max(i, r), n = Math.min(n, a), s = Math.max(s, a);
    return {
      x: e,
      y: n,
      width: i - e,
      height: s - n
    };
  }
}
Ve.Line = Vt;
Vt.prototype.className = "Line";
Vt.prototype._attrsAffectingSize = ["points", "bezier", "tension"];
(0, Ja._registerNode)(Vt);
_i.Factory.addGetterSetter(Vt, "closed", !1);
_i.Factory.addGetterSetter(Vt, "bezier", !1);
_i.Factory.addGetterSetter(Vt, "tension", 0, (0, Zs.getNumberValidator)());
_i.Factory.addGetterSetter(Vt, "points", [], (0, Zs.getNumberArrayValidator)());
var xe = {}, tr = {};
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.t2length = o.getQuadraticArcLength = o.getCubicArcLength = o.binomialCoefficients = o.cValues = o.tValues = void 0, o.tValues = [
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
  ], o.cValues = [
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
  ], o.binomialCoefficients = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]];
  const t = (r, a, h) => {
    let l, u;
    const p = h / 2;
    l = 0;
    for (let g = 0; g < 20; g++)
      u = p * o.tValues[20][g] + p, l += o.cValues[20][g] * i(r, a, u);
    return p * l;
  };
  o.getCubicArcLength = t;
  const e = (r, a, h) => {
    h === void 0 && (h = 1);
    const l = r[0] - 2 * r[1] + r[2], u = a[0] - 2 * a[1] + a[2], _ = 2 * r[1] - 2 * r[0], p = 2 * a[1] - 2 * a[0], g = 4 * (l * l + u * u), d = 4 * (l * _ + u * p), m = _ * _ + p * p;
    if (g === 0)
      return h * Math.sqrt(Math.pow(r[2] - r[0], 2) + Math.pow(a[2] - a[0], 2));
    const y = d / (2 * g), S = m / g, w = h + y, c = S - y * y, f = w * w + c > 0 ? Math.sqrt(w * w + c) : 0, b = y * y + c > 0 ? Math.sqrt(y * y + c) : 0, x = y + Math.sqrt(y * y + c) !== 0 ? c * Math.log(Math.abs((w + f) / (y + b))) : 0;
    return Math.sqrt(g) / 2 * (w * f - y * b + x);
  };
  o.getQuadraticArcLength = e;
  function i(r, a, h) {
    const l = n(1, h, r), u = n(1, h, a), _ = l * l + u * u;
    return Math.sqrt(_);
  }
  const n = (r, a, h) => {
    const l = h.length - 1;
    let u, _;
    if (l === 0)
      return 0;
    if (r === 0) {
      _ = 0;
      for (let p = 0; p <= l; p++)
        _ += o.binomialCoefficients[l][p] * Math.pow(1 - a, l - p) * Math.pow(a, p) * h[p];
      return _;
    } else {
      u = new Array(l);
      for (let p = 0; p < l; p++)
        u[p] = l * (h[p + 1] - h[p]);
      return n(r - 1, a, u);
    }
  }, s = (r, a, h) => {
    let l = 1, u = r / a, _ = (r - h(u)) / a, p = 0;
    for (; l > 1e-3; ) {
      const g = h(u + _), d = Math.abs(r - g) / a;
      if (d < l)
        l = d, u += _;
      else {
        const m = h(u - _), y = Math.abs(r - m) / a;
        y < l ? (l = y, u -= _) : _ /= 2;
      }
      if (p++, p > 500)
        break;
    }
    return u;
  };
  o.t2length = s;
})(tr);
Object.defineProperty(xe, "__esModule", { value: !0 });
xe.Path = void 0;
const to = B, eo = U, io = ct, ue = tr;
class ht extends io.Shape {
  constructor(t) {
    super(t), this.dataArray = [], this.pathLength = 0, this._readDataAttribute(), this.on("dataChange.konva", function() {
      this._readDataAttribute();
    });
  }
  _readDataAttribute() {
    this.dataArray = ht.parsePathData(this.data()), this.pathLength = ht.getPathLength(this.dataArray);
  }
  _sceneFunc(t) {
    const e = this.dataArray;
    t.beginPath();
    let i = !1;
    for (let n = 0; n < e.length; n++) {
      const s = e[n].command, r = e[n].points;
      switch (s) {
        case "L":
          t.lineTo(r[0], r[1]);
          break;
        case "M":
          t.moveTo(r[0], r[1]);
          break;
        case "C":
          t.bezierCurveTo(r[0], r[1], r[2], r[3], r[4], r[5]);
          break;
        case "Q":
          t.quadraticCurveTo(r[0], r[1], r[2], r[3]);
          break;
        case "A":
          const a = r[0], h = r[1], l = r[2], u = r[3], _ = r[4], p = r[5], g = r[6], d = r[7], m = l > u ? l : u, y = l > u ? 1 : l / u, S = l > u ? u / l : 1;
          t.translate(a, h), t.rotate(g), t.scale(y, S), t.arc(0, 0, m, _, _ + p, 1 - d), t.scale(1 / y, 1 / S), t.rotate(-g), t.translate(-a, -h);
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
    this.dataArray.forEach(function(h) {
      if (h.command === "A") {
        const l = h.points[4], u = h.points[5], _ = h.points[4] + u;
        let p = Math.PI / 180;
        if (Math.abs(l - _) < p && (p = Math.abs(l - _)), u < 0)
          for (let g = l - p; g > _; g -= p) {
            const d = ht.getPointOnEllipticalArc(h.points[0], h.points[1], h.points[2], h.points[3], g, 0);
            t.push(d.x, d.y);
          }
        else
          for (let g = l + p; g < _; g += p) {
            const d = ht.getPointOnEllipticalArc(h.points[0], h.points[1], h.points[2], h.points[3], g, 0);
            t.push(d.x, d.y);
          }
      } else if (h.command === "C")
        for (let l = 0; l <= 1; l += 0.01) {
          const u = ht.getPointOnCubicBezier(l, h.start.x, h.start.y, h.points[0], h.points[1], h.points[2], h.points[3], h.points[4], h.points[5]);
          t.push(u.x, u.y);
        }
      else
        t = t.concat(h.points);
    });
    let e = t[0], i = t[0], n = t[1], s = t[1], r, a;
    for (let h = 0; h < t.length / 2; h++)
      r = t[h * 2], a = t[h * 2 + 1], isNaN(r) || (e = Math.min(e, r), i = Math.max(i, r)), isNaN(a) || (n = Math.min(n, a), s = Math.max(s, a));
    return {
      x: e,
      y: n,
      width: i - e,
      height: s - n
    };
  }
  getLength() {
    return this.pathLength;
  }
  getPointAtLength(t) {
    return ht.getPointAtLengthOfDataArray(t, this.dataArray);
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
    let i, n = 0, s = e.length;
    if (!s)
      return null;
    for (; n < s && t > e[n].pathLength; )
      t -= e[n].pathLength, ++n;
    if (n === s)
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
    const r = e[n], a = r.points;
    switch (r.command) {
      case "L":
        return ht.getPointOnLine(t, r.start.x, r.start.y, a[0], a[1]);
      case "C":
        return ht.getPointOnCubicBezier((0, ue.t2length)(t, ht.getPathLength(e), (m) => (0, ue.getCubicArcLength)([r.start.x, a[0], a[2], a[4]], [r.start.y, a[1], a[3], a[5]], m)), r.start.x, r.start.y, a[0], a[1], a[2], a[3], a[4], a[5]);
      case "Q":
        return ht.getPointOnQuadraticBezier((0, ue.t2length)(t, ht.getPathLength(e), (m) => (0, ue.getQuadraticArcLength)([r.start.x, a[0], a[2]], [r.start.y, a[1], a[3]], m)), r.start.x, r.start.y, a[0], a[1], a[2], a[3]);
      case "A":
        const h = a[0], l = a[1], u = a[2], _ = a[3], p = a[5], g = a[6];
        let d = a[4];
        return d += p * t / r.pathLength, ht.getPointOnEllipticalArc(h, l, u, _, d, g);
    }
    return null;
  }
  static getPointOnLine(t, e, i, n, s, r, a) {
    r = r ?? e, a = a ?? i;
    const h = this.getLineLength(e, i, n, s);
    if (h < 1e-10)
      return { x: e, y: i };
    if (n === e)
      return { x: r, y: a + (s > i ? t : -t) };
    const l = (s - i) / (n - e), u = Math.sqrt(t * t / (1 + l * l)) * (n < e ? -1 : 1), _ = l * u;
    if (Math.abs(a - i - l * (r - e)) < 1e-10)
      return { x: r + u, y: a + _ };
    const p = ((r - e) * (n - e) + (a - i) * (s - i)) / (h * h), g = e + p * (n - e), d = i + p * (s - i), m = this.getLineLength(r, a, g, d), y = Math.sqrt(t * t - m * m), S = Math.sqrt(y * y / (1 + l * l)) * (n < e ? -1 : 1), w = l * S;
    return { x: g + S, y: d + w };
  }
  static getPointOnCubicBezier(t, e, i, n, s, r, a, h, l) {
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
    const d = h * u(t) + r * _(t) + n * p(t) + e * g(t), m = l * u(t) + a * _(t) + s * p(t) + i * g(t);
    return { x: d, y: m };
  }
  static getPointOnQuadraticBezier(t, e, i, n, s, r, a) {
    function h(g) {
      return g * g;
    }
    function l(g) {
      return 2 * g * (1 - g);
    }
    function u(g) {
      return (1 - g) * (1 - g);
    }
    const _ = r * h(t) + n * l(t) + e * u(t), p = a * h(t) + s * l(t) + i * u(t);
    return { x: _, y: p };
  }
  static getPointOnEllipticalArc(t, e, i, n, s, r) {
    const a = Math.cos(r), h = Math.sin(r), l = {
      x: i * Math.cos(s),
      y: n * Math.sin(s)
    };
    return {
      x: t + (l.x * a - l.y * h),
      y: e + (l.x * h + l.y * a)
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
    const n = e.split("|"), s = [], r = [];
    let a = 0, h = 0;
    const l = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
    let u;
    for (let _ = 1; _ < n.length; _++) {
      let p = n[_], g = p.charAt(0);
      for (p = p.slice(1), r.length = 0; u = l.exec(p); )
        r.push(u[0]);
      const d = [];
      for (let m = 0, y = r.length; m < y; m++) {
        if (r[m] === "00") {
          d.push(0, 0);
          continue;
        }
        const S = parseFloat(r[m]);
        isNaN(S) ? d.push(0) : d.push(S);
      }
      for (; d.length > 0 && !isNaN(d[0]); ) {
        let m = "", y = [];
        const S = a, w = h;
        let c, f, b, x, A, v, k, P, E, T;
        switch (g) {
          case "l":
            a += d.shift(), h += d.shift(), m = "L", y.push(a, h);
            break;
          case "L":
            a = d.shift(), h = d.shift(), y.push(a, h);
            break;
          case "m":
            const R = d.shift(), G = d.shift();
            if (a += R, h += G, m = "M", s.length > 2 && s[s.length - 1].command === "z") {
              for (let F = s.length - 2; F >= 0; F--)
                if (s[F].command === "M") {
                  a = s[F].points[0] + R, h = s[F].points[1] + G;
                  break;
                }
            }
            y.push(a, h), g = "l";
            break;
          case "M":
            a = d.shift(), h = d.shift(), m = "M", y.push(a, h), g = "L";
            break;
          case "h":
            a += d.shift(), m = "L", y.push(a, h);
            break;
          case "H":
            a = d.shift(), m = "L", y.push(a, h);
            break;
          case "v":
            h += d.shift(), m = "L", y.push(a, h);
            break;
          case "V":
            h = d.shift(), m = "L", y.push(a, h);
            break;
          case "C":
            y.push(d.shift(), d.shift(), d.shift(), d.shift()), a = d.shift(), h = d.shift(), y.push(a, h);
            break;
          case "c":
            y.push(a + d.shift(), h + d.shift(), a + d.shift(), h + d.shift()), a += d.shift(), h += d.shift(), m = "C", y.push(a, h);
            break;
          case "S":
            f = a, b = h, c = s[s.length - 1], c.command === "C" && (f = a + (a - c.points[2]), b = h + (h - c.points[3])), y.push(f, b, d.shift(), d.shift()), a = d.shift(), h = d.shift(), m = "C", y.push(a, h);
            break;
          case "s":
            f = a, b = h, c = s[s.length - 1], c.command === "C" && (f = a + (a - c.points[2]), b = h + (h - c.points[3])), y.push(f, b, a + d.shift(), h + d.shift()), a += d.shift(), h += d.shift(), m = "C", y.push(a, h);
            break;
          case "Q":
            y.push(d.shift(), d.shift()), a = d.shift(), h = d.shift(), y.push(a, h);
            break;
          case "q":
            y.push(a + d.shift(), h + d.shift()), a += d.shift(), h += d.shift(), m = "Q", y.push(a, h);
            break;
          case "T":
            f = a, b = h, c = s[s.length - 1], c.command === "Q" && (f = a + (a - c.points[0]), b = h + (h - c.points[1])), a = d.shift(), h = d.shift(), m = "Q", y.push(f, b, a, h);
            break;
          case "t":
            f = a, b = h, c = s[s.length - 1], c.command === "Q" && (f = a + (a - c.points[0]), b = h + (h - c.points[1])), a += d.shift(), h += d.shift(), m = "Q", y.push(f, b, a, h);
            break;
          case "A":
            x = d.shift(), A = d.shift(), v = d.shift(), k = d.shift(), P = d.shift(), E = a, T = h, a = d.shift(), h = d.shift(), m = "A", y = this.convertEndpointToCenterParameterization(E, T, a, h, k, P, x, A, v);
            break;
          case "a":
            x = d.shift(), A = d.shift(), v = d.shift(), k = d.shift(), P = d.shift(), E = a, T = h, a += d.shift(), h += d.shift(), m = "A", y = this.convertEndpointToCenterParameterization(E, T, a, h, k, P, x, A, v);
            break;
        }
        s.push({
          command: m || g,
          points: y,
          start: {
            x: S,
            y: w
          },
          pathLength: this.calcLength(S, w, m || g, y)
        });
      }
      (g === "z" || g === "Z") && s.push({
        command: "z",
        points: [],
        start: void 0,
        pathLength: 0
      });
    }
    return s;
  }
  static calcLength(t, e, i, n) {
    let s, r, a, h;
    const l = ht;
    switch (i) {
      case "L":
        return l.getLineLength(t, e, n[0], n[1]);
      case "C":
        return (0, ue.getCubicArcLength)([t, n[0], n[2], n[4]], [e, n[1], n[3], n[5]], 1);
      case "Q":
        return (0, ue.getQuadraticArcLength)([t, n[0], n[2]], [e, n[1], n[3]], 1);
      case "A":
        s = 0;
        const u = n[4], _ = n[5], p = n[4] + _;
        let g = Math.PI / 180;
        if (Math.abs(u - p) < g && (g = Math.abs(u - p)), r = l.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], u, 0), _ < 0)
          for (h = u - g; h > p; h -= g)
            a = l.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], h, 0), s += l.getLineLength(r.x, r.y, a.x, a.y), r = a;
        else
          for (h = u + g; h < p; h += g)
            a = l.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], h, 0), s += l.getLineLength(r.x, r.y, a.x, a.y), r = a;
        return a = l.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], p, 0), s += l.getLineLength(r.x, r.y, a.x, a.y), s;
    }
    return 0;
  }
  static convertEndpointToCenterParameterization(t, e, i, n, s, r, a, h, l) {
    const u = l * (Math.PI / 180), _ = Math.cos(u) * (t - i) / 2 + Math.sin(u) * (e - n) / 2, p = -1 * Math.sin(u) * (t - i) / 2 + Math.cos(u) * (e - n) / 2, g = _ * _ / (a * a) + p * p / (h * h);
    g > 1 && (a *= Math.sqrt(g), h *= Math.sqrt(g));
    let d = Math.sqrt((a * a * (h * h) - a * a * (p * p) - h * h * (_ * _)) / (a * a * (p * p) + h * h * (_ * _)));
    s === r && (d *= -1), isNaN(d) && (d = 0);
    const m = d * a * p / h, y = d * -h * _ / a, S = (t + i) / 2 + Math.cos(u) * m - Math.sin(u) * y, w = (e + n) / 2 + Math.sin(u) * m + Math.cos(u) * y, c = function(P) {
      return Math.sqrt(P[0] * P[0] + P[1] * P[1]);
    }, f = function(P, E) {
      return (P[0] * E[0] + P[1] * E[1]) / (c(P) * c(E));
    }, b = function(P, E) {
      return (P[0] * E[1] < P[1] * E[0] ? -1 : 1) * Math.acos(f(P, E));
    }, x = b([1, 0], [(_ - m) / a, (p - y) / h]), A = [(_ - m) / a, (p - y) / h], v = [(-1 * _ - m) / a, (-1 * p - y) / h];
    let k = b(A, v);
    return f(A, v) <= -1 && (k = Math.PI), f(A, v) >= 1 && (k = 0), r === 0 && k > 0 && (k = k - 2 * Math.PI), r === 1 && k < 0 && (k = k + 2 * Math.PI), [S, w, a, h, x, k, u, r];
  }
}
xe.Path = ht;
ht.prototype.className = "Path";
ht.prototype._attrsAffectingSize = ["data"];
(0, eo._registerNode)(ht);
to.Factory.addGetterSetter(ht, "data");
Object.defineProperty(pi, "__esModule", { value: !0 });
pi.Arrow = void 0;
const mi = B, no = Ve, er = D, so = U, fs = xe;
class ee extends no.Line {
  _sceneFunc(t) {
    super._sceneFunc(t);
    const e = Math.PI * 2, i = this.points();
    let n = i;
    const s = this.tension() !== 0 && i.length > 4;
    s && (n = this.getTensionPoints());
    const r = this.pointerLength(), a = i.length;
    let h, l;
    if (s) {
      const p = [
        n[n.length - 4],
        n[n.length - 3],
        n[n.length - 2],
        n[n.length - 1],
        i[a - 2],
        i[a - 1]
      ], g = fs.Path.calcLength(n[n.length - 4], n[n.length - 3], "C", p), d = fs.Path.getPointOnQuadraticBezier(Math.min(1, 1 - r / g), p[0], p[1], p[2], p[3], p[4], p[5]);
      h = i[a - 2] - d.x, l = i[a - 1] - d.y;
    } else
      h = i[a - 2] - i[a - 4], l = i[a - 1] - i[a - 3];
    const u = (Math.atan2(l, h) + e) % e, _ = this.pointerWidth();
    this.pointerAtEnding() && (t.save(), t.beginPath(), t.translate(i[a - 2], i[a - 1]), t.rotate(u), t.moveTo(0, 0), t.lineTo(-r, _ / 2), t.lineTo(-r, -_ / 2), t.closePath(), t.restore(), this.__fillStroke(t)), this.pointerAtBeginning() && (t.save(), t.beginPath(), t.translate(i[0], i[1]), s ? (h = (n[0] + n[2]) / 2 - i[0], l = (n[1] + n[3]) / 2 - i[1]) : (h = i[2] - i[0], l = i[3] - i[1]), t.rotate((Math.atan2(-l, -h) + e) % e), t.moveTo(0, 0), t.lineTo(-r, _ / 2), t.lineTo(-r, -_ / 2), t.closePath(), t.restore(), this.__fillStroke(t));
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
pi.Arrow = ee;
ee.prototype.className = "Arrow";
(0, so._registerNode)(ee);
mi.Factory.addGetterSetter(ee, "pointerLength", 10, (0, er.getNumberValidator)());
mi.Factory.addGetterSetter(ee, "pointerWidth", 10, (0, er.getNumberValidator)());
mi.Factory.addGetterSetter(ee, "pointerAtBeginning", !1);
mi.Factory.addGetterSetter(ee, "pointerAtEnding", !0);
var yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
yi.Circle = void 0;
const ro = B, ao = ct, oo = D, ho = U;
class Pe extends ao.Shape {
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
yi.Circle = Pe;
Pe.prototype._centroid = !0;
Pe.prototype.className = "Circle";
Pe.prototype._attrsAffectingSize = ["radius"];
(0, ho._registerNode)(Pe);
ro.Factory.addGetterSetter(Pe, "radius", 0, (0, oo.getNumberValidator)());
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
bi.Ellipse = void 0;
const On = B, lo = ct, ir = D, co = U;
class Ht extends lo.Shape {
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
bi.Ellipse = Ht;
Ht.prototype.className = "Ellipse";
Ht.prototype._centroid = !0;
Ht.prototype._attrsAffectingSize = ["radiusX", "radiusY"];
(0, co._registerNode)(Ht);
On.Factory.addComponentsGetterSetter(Ht, "radius", ["x", "y"]);
On.Factory.addGetterSetter(Ht, "radiusX", 0, (0, ir.getNumberValidator)());
On.Factory.addGetterSetter(Ht, "radiusY", 0, (0, ir.getNumberValidator)());
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
vi.Image = void 0;
const on = it, ie = B, uo = ct, fo = U, He = D;
let xt = class nr extends uo.Shape {
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
    const e = this.getWidth(), i = this.getHeight(), n = this.cornerRadius(), s = this.attrs.image;
    let r;
    if (s) {
      const a = this.attrs.cropWidth, h = this.attrs.cropHeight;
      a && h ? r = [
        s,
        this.cropX(),
        this.cropY(),
        a,
        h,
        0,
        0,
        e,
        i
      ] : r = [s, 0, 0, e, i];
    }
    (this.hasFill() || this.hasStroke() || n) && (t.beginPath(), n ? on.Util.drawRoundedRectPath(t, e, i, n) : t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this)), s && (n && t.clip(), t.drawImage.apply(t, r));
  }
  _hitFunc(t) {
    const e = this.width(), i = this.height(), n = this.cornerRadius();
    t.beginPath(), n ? on.Util.drawRoundedRectPath(t, e, i, n) : t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this);
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
    const n = on.Util.createImageElement();
    n.onload = function() {
      const s = new nr({
        image: n
      });
      e(s);
    }, n.onerror = i, n.crossOrigin = "Anonymous", n.src = t;
  }
};
vi.Image = xt;
xt.prototype.className = "Image";
(0, fo._registerNode)(xt);
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
const Si = B, go = ct, po = Ce, Nn = D, sr = U, rr = [
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
], _o = "Change.konva", mo = "none", mn = "up", yn = "right", bn = "down", vn = "left", yo = rr.length;
class Gn extends po.Group {
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
    for (i = 0; i < yo; i++)
      t.on(rr[i] + _o, n);
  }
  getWidth() {
    return this.getText().width();
  }
  getHeight() {
    return this.getText().height();
  }
  _sync() {
    let t = this.getText(), e = this.getTag(), i, n, s, r, a, h, l;
    if (t && e) {
      switch (i = t.width(), n = t.height(), s = e.pointerDirection(), r = e.pointerWidth(), l = e.pointerHeight(), a = 0, h = 0, s) {
        case mn:
          a = i / 2, h = -1 * l;
          break;
        case yn:
          a = i + r, h = n / 2;
          break;
        case bn:
          a = i / 2, h = n + l;
          break;
        case vn:
          a = -1 * r, h = n / 2;
          break;
      }
      e.setAttrs({
        x: -1 * a,
        y: -1 * h,
        width: i,
        height: n
      }), t.setAttrs({
        x: -1 * a,
        y: -1 * h
      });
    }
  }
}
me.Label = Gn;
Gn.prototype.className = "Label";
(0, sr._registerNode)(Gn);
class ne extends go.Shape {
  _sceneFunc(t) {
    const e = this.width(), i = this.height(), n = this.pointerDirection(), s = this.pointerWidth(), r = this.pointerHeight(), a = this.cornerRadius();
    let h = 0, l = 0, u = 0, _ = 0;
    typeof a == "number" ? h = l = u = _ = Math.min(a, e / 2, i / 2) : (h = Math.min(a[0] || 0, e / 2, i / 2), l = Math.min(a[1] || 0, e / 2, i / 2), _ = Math.min(a[2] || 0, e / 2, i / 2), u = Math.min(a[3] || 0, e / 2, i / 2)), t.beginPath(), t.moveTo(h, 0), n === mn && (t.lineTo((e - s) / 2, 0), t.lineTo(e / 2, -1 * r), t.lineTo((e + s) / 2, 0)), t.lineTo(e - l, 0), t.arc(e - l, l, l, Math.PI * 3 / 2, 0, !1), n === yn && (t.lineTo(e, (i - r) / 2), t.lineTo(e + s, i / 2), t.lineTo(e, (i + r) / 2)), t.lineTo(e, i - _), t.arc(e - _, i - _, _, 0, Math.PI / 2, !1), n === bn && (t.lineTo((e + s) / 2, i), t.lineTo(e / 2, i + r), t.lineTo((e - s) / 2, i)), t.lineTo(u, i), t.arc(u, i - u, u, Math.PI / 2, Math.PI, !1), n === vn && (t.lineTo(0, (i + r) / 2), t.lineTo(-1 * s, i / 2), t.lineTo(0, (i - r) / 2)), t.lineTo(0, h), t.arc(h, h, h, Math.PI, Math.PI * 3 / 2, !1), t.closePath(), t.fillStrokeShape(this);
  }
  getSelfRect() {
    let t = 0, e = 0, i = this.pointerWidth(), n = this.pointerHeight(), s = this.pointerDirection(), r = this.width(), a = this.height();
    return s === mn ? (e -= n, a += n) : s === bn ? a += n : s === vn ? (t -= i * 1.5, r += i) : s === yn && (r += i * 1.5), {
      x: t,
      y: e,
      width: r,
      height: a
    };
  }
}
me.Tag = ne;
ne.prototype.className = "Tag";
(0, sr._registerNode)(ne);
Si.Factory.addGetterSetter(ne, "pointerDirection", mo);
Si.Factory.addGetterSetter(ne, "pointerWidth", 0, (0, Nn.getNumberValidator)());
Si.Factory.addGetterSetter(ne, "pointerHeight", 0, (0, Nn.getNumberValidator)());
Si.Factory.addGetterSetter(ne, "cornerRadius", 0, (0, Nn.getNumberOrArrayOfNumbersValidator)(4));
var ze = {};
Object.defineProperty(ze, "__esModule", { value: !0 });
ze.Rect = void 0;
const bo = B, vo = ct, So = U, Co = it, wo = D;
class Ci extends vo.Shape {
  _sceneFunc(t) {
    const e = this.cornerRadius(), i = this.width(), n = this.height();
    t.beginPath(), e ? Co.Util.drawRoundedRectPath(t, i, n, e) : t.rect(0, 0, i, n), t.closePath(), t.fillStrokeShape(this);
  }
}
ze.Rect = Ci;
Ci.prototype.className = "Rect";
(0, So._registerNode)(Ci);
bo.Factory.addGetterSetter(Ci, "cornerRadius", 0, (0, wo.getNumberOrArrayOfNumbersValidator)(4));
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
wi.RegularPolygon = void 0;
const ar = B, xo = ct, or = D, Po = U;
class se extends xo.Shape {
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
    let e = t[0].x, i = t[0].y, n = t[0].x, s = t[0].y;
    return t.forEach((r) => {
      e = Math.min(e, r.x), i = Math.max(i, r.x), n = Math.min(n, r.y), s = Math.max(s, r.y);
    }), {
      x: e,
      y: n,
      width: i - e,
      height: s - n
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
wi.RegularPolygon = se;
se.prototype.className = "RegularPolygon";
se.prototype._centroid = !0;
se.prototype._attrsAffectingSize = ["radius"];
(0, Po._registerNode)(se);
ar.Factory.addGetterSetter(se, "radius", 0, (0, or.getNumberValidator)());
ar.Factory.addGetterSetter(se, "sides", 0, (0, or.getNumberValidator)());
var xi = {};
Object.defineProperty(xi, "__esModule", { value: !0 });
xi.Ring = void 0;
const hr = B, Ao = ct, lr = D, ko = U, gs = Math.PI * 2;
class re extends Ao.Shape {
  _sceneFunc(t) {
    t.beginPath(), t.arc(0, 0, this.innerRadius(), 0, gs, !1), t.moveTo(this.outerRadius(), 0), t.arc(0, 0, this.outerRadius(), gs, 0, !0), t.closePath(), t.fillStrokeShape(this);
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
xi.Ring = re;
re.prototype.className = "Ring";
re.prototype._centroid = !0;
re.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"];
(0, ko._registerNode)(re);
hr.Factory.addGetterSetter(re, "innerRadius", 0, (0, lr.getNumberValidator)());
hr.Factory.addGetterSetter(re, "outerRadius", 0, (0, lr.getNumberValidator)());
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.Sprite = void 0;
const ae = B, Eo = ct, To = we, cr = D, Mo = U;
class Pt extends Eo.Shape {
  constructor(t) {
    super(t), this._updated = !0, this.anim = new To.Animation(() => {
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
    const e = this.animation(), i = this.frameIndex(), n = i * 4, s = this.animations()[e], r = this.frameOffsets(), a = s[n + 0], h = s[n + 1], l = s[n + 2], u = s[n + 3], _ = this.image();
    if ((this.hasFill() || this.hasStroke()) && (t.beginPath(), t.rect(0, 0, l, u), t.closePath(), t.fillStrokeShape(this)), _)
      if (r) {
        const p = r[e], g = i * 2;
        t.drawImage(_, a, h, l, u, p[g + 0], p[g + 1], l, u);
      } else
        t.drawImage(_, a, h, l, u, 0, 0, l, u);
  }
  _hitFunc(t) {
    const e = this.animation(), i = this.frameIndex(), n = i * 4, s = this.animations()[e], r = this.frameOffsets(), a = s[n + 2], h = s[n + 3];
    if (t.beginPath(), r) {
      const l = r[e], u = i * 2;
      t.rect(l[u + 0], l[u + 1], a, h);
    } else
      t.rect(0, 0, a, h);
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
    const t = this.frameIndex(), e = this.animation(), i = this.animations(), n = i[e], s = n.length / 4;
    t < s - 1 ? this.frameIndex(t + 1) : this.frameIndex(0);
  }
}
Pi.Sprite = Pt;
Pt.prototype.className = "Sprite";
(0, Mo._registerNode)(Pt);
ae.Factory.addGetterSetter(Pt, "animation");
ae.Factory.addGetterSetter(Pt, "animations");
ae.Factory.addGetterSetter(Pt, "frameOffsets");
ae.Factory.addGetterSetter(Pt, "image");
ae.Factory.addGetterSetter(Pt, "frameIndex", 0, (0, cr.getNumberValidator)());
ae.Factory.addGetterSetter(Pt, "frameRate", 17, (0, cr.getNumberValidator)());
ae.Factory.backCompat(Pt, {
  index: "frameIndex",
  getIndex: "getFrameIndex",
  setIndex: "setFrameIndex"
});
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.Star = void 0;
const Ln = B, Ro = ct, Dn = D, Fo = U;
class zt extends Ro.Shape {
  _sceneFunc(t) {
    const e = this.innerRadius(), i = this.outerRadius(), n = this.numPoints();
    t.beginPath(), t.moveTo(0, 0 - i);
    for (let s = 1; s < n * 2; s++) {
      const r = s % 2 === 0 ? i : e, a = r * Math.sin(s * Math.PI / n), h = -1 * r * Math.cos(s * Math.PI / n);
      t.lineTo(a, h);
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
Ai.Star = zt;
zt.prototype.className = "Star";
zt.prototype._centroid = !0;
zt.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"];
(0, Fo._registerNode)(zt);
Ln.Factory.addGetterSetter(zt, "numPoints", 5, (0, Dn.getNumberValidator)());
Ln.Factory.addGetterSetter(zt, "innerRadius", 0, (0, Dn.getNumberValidator)());
Ln.Factory.addGetterSetter(zt, "outerRadius", 0, (0, Dn.getNumberValidator)());
var Ae = {};
Object.defineProperty(Ae, "__esModule", { value: !0 });
Ae.Text = void 0;
Ae.stringToArray = Kt;
const Sn = it, ft = B, Oo = ct, hn = U, Wt = D, No = U;
function Kt(o) {
  return [...o].reduce((t, e, i, n) => {
    if (new RegExp("\\p{Emoji}", "u").test(e)) {
      const s = n[i + 1];
      s && new RegExp("\\p{Emoji_Modifier}|\\u200D", "u").test(s) ? (t.push(e + s), n[i + 1] = "") : t.push(e);
    } else new RegExp("\\p{Regional_Indicator}{2}", "u").test(e + (n[i + 1] || "")) ? t.push(e + n[i + 1]) : i > 0 && new RegExp("\\p{Mn}|\\p{Me}|\\p{Mc}", "u").test(e) ? t[t.length - 1] += e : e && t.push(e);
    return t;
  }, []);
}
const fe = "auto", Go = "center", dr = "inherit", Ee = "justify", Lo = "Change.konva", Do = "2d", ps = "-", ur = "left", Io = "text", $o = "Text", Uo = "top", Bo = "bottom", _s = "middle", fr = "normal", Vo = "px ", Ye = " ", Ho = "right", ms = "rtl", zo = "word", Wo = "char", ys = "none", ln = "…", gr = [
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
], jo = gr.length;
function Yo(o) {
  return o.split(",").map((t) => {
    t = t.trim();
    const e = t.indexOf(" ") >= 0, i = t.indexOf('"') >= 0 || t.indexOf("'") >= 0;
    return e && !i && (t = `"${t}"`), t;
  }).join(", ");
}
let Xe;
function cn() {
  return Xe || (Xe = Sn.Util.createCanvasElement().getContext(Do), Xe);
}
function Xo(o) {
  o.fillText(this._partialText, this._partialTextX, this._partialTextY);
}
function Ko(o) {
  o.setAttr("miterLimit", 2), o.strokeText(this._partialText, this._partialTextX, this._partialTextY);
}
function qo(o) {
  return o = o || {}, !o.fillLinearGradientColorStops && !o.fillRadialGradientColorStops && !o.fillPatternImage && (o.fill = o.fill || "black"), o;
}
class st extends Oo.Shape {
  constructor(t) {
    super(qo(t)), this._partialTextX = 0, this._partialTextY = 0;
    for (let e = 0; e < jo; e++)
      this.on(gr[e] + Lo, this._setTextData);
    this._setTextData();
  }
  _sceneFunc(t) {
    const e = this.textArr, i = e.length;
    if (!this.text())
      return;
    let n = this.padding(), s = this.fontSize(), r = this.lineHeight() * s, a = this.verticalAlign(), h = this.direction(), l = 0, u = this.align(), _ = this.getWidth(), p = this.letterSpacing(), g = this.fill(), d = this.textDecoration(), m = d.indexOf("underline") !== -1, y = d.indexOf("line-through") !== -1, S;
    h = h === dr ? t.direction : h;
    let w = r / 2, c = _s;
    if (hn.Konva._fixTextRendering) {
      const f = this.measureSize("M");
      c = "alphabetic", w = (f.fontBoundingBoxAscent - f.fontBoundingBoxDescent) / 2 + r / 2;
    }
    for (h === ms && t.setAttr("direction", h), t.setAttr("font", this._getContextFont()), t.setAttr("textBaseline", c), t.setAttr("textAlign", ur), a === _s ? l = (this.getHeight() - i * r - n * 2) / 2 : a === Bo && (l = this.getHeight() - i * r - n * 2), t.translate(n, l + n), S = 0; S < i; S++) {
      let f = 0, b = 0;
      const x = e[S], A = x.text, v = x.width, k = x.lastInParagraph;
      if (t.save(), u === Ho ? f += _ - v - n * 2 : u === Go && (f += (_ - v - n * 2) / 2), m) {
        t.save(), t.beginPath();
        const P = hn.Konva._fixTextRendering ? Math.round(s / 4) : Math.round(s / 2), E = f, T = w + b + P;
        t.moveTo(E, T);
        const R = u === Ee && !k ? _ - n * 2 : v;
        t.lineTo(E + Math.round(R), T), t.lineWidth = s / 15;
        const G = this._getLinearGradient();
        t.strokeStyle = G || g, t.stroke(), t.restore();
      }
      if (y) {
        t.save(), t.beginPath();
        const P = hn.Konva._fixTextRendering ? -Math.round(s / 4) : 0;
        t.moveTo(f, w + b + P);
        const E = u === Ee && !k ? _ - n * 2 : v;
        t.lineTo(f + Math.round(E), w + b + P), t.lineWidth = s / 15;
        const T = this._getLinearGradient();
        t.strokeStyle = T || g, t.stroke(), t.restore();
      }
      if (h !== ms && (p !== 0 || u === Ee)) {
        const P = A.split(" ").length - 1, E = Kt(A);
        for (let T = 0; T < E.length; T++) {
          const R = E[T];
          R === " " && !k && u === Ee && (f += (_ - n * 2 - v) / P), this._partialTextX = f, this._partialTextY = w + b, this._partialText = R, t.fillStrokeShape(this), f += this.measureSize(R).width + p;
        }
      } else
        p !== 0 && t.setAttr("letterSpacing", `${p}px`), this._partialTextX = f, this._partialTextY = w + b, this._partialText = A, t.fillStrokeShape(this);
      t.restore(), i > 1 && (w += r);
    }
  }
  _hitFunc(t) {
    const e = this.getWidth(), i = this.getHeight();
    t.beginPath(), t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this);
  }
  setText(t) {
    const e = Sn.Util._isString(t) ? t : t == null ? "" : t + "";
    return this._setAttr(Io, e), this;
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
    return Sn.Util.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height."), this.textHeight;
  }
  measureSize(t) {
    var e, i, n, s, r, a, h, l, u, _, p;
    let g = cn(), d = this.fontSize(), m;
    g.save(), g.font = this._getContextFont(), m = g.measureText(t), g.restore();
    const y = d / 100;
    return {
      actualBoundingBoxAscent: (e = m.actualBoundingBoxAscent) !== null && e !== void 0 ? e : 71.58203125 * y,
      actualBoundingBoxDescent: (i = m.actualBoundingBoxDescent) !== null && i !== void 0 ? i : 0,
      actualBoundingBoxLeft: (n = m.actualBoundingBoxLeft) !== null && n !== void 0 ? n : -7.421875 * y,
      actualBoundingBoxRight: (s = m.actualBoundingBoxRight) !== null && s !== void 0 ? s : 75.732421875 * y,
      alphabeticBaseline: (r = m.alphabeticBaseline) !== null && r !== void 0 ? r : 0,
      emHeightAscent: (a = m.emHeightAscent) !== null && a !== void 0 ? a : 100 * y,
      emHeightDescent: (h = m.emHeightDescent) !== null && h !== void 0 ? h : -20 * y,
      fontBoundingBoxAscent: (l = m.fontBoundingBoxAscent) !== null && l !== void 0 ? l : 91 * y,
      fontBoundingBoxDescent: (u = m.fontBoundingBoxDescent) !== null && u !== void 0 ? u : 21 * y,
      hangingBaseline: (_ = m.hangingBaseline) !== null && _ !== void 0 ? _ : 72.80000305175781 * y,
      ideographicBaseline: (p = m.ideographicBaseline) !== null && p !== void 0 ? p : -21 * y,
      width: m.width,
      height: d
    };
  }
  _getContextFont() {
    return this.fontStyle() + Ye + this.fontVariant() + Ye + (this.fontSize() + Vo) + Yo(this.fontFamily());
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
    return cn().measureText(t).width + e * i;
  }
  _setTextData() {
    let t = this.text().split(`
`), e = +this.fontSize(), i = 0, n = this.lineHeight() * e, s = this.attrs.width, r = this.attrs.height, a = s !== fe && s !== void 0, h = r !== fe && r !== void 0, l = this.padding(), u = s - l * 2, _ = r - l * 2, p = 0, g = this.wrap(), d = g !== ys, m = g !== Wo && d, y = this.ellipsis();
    this.textArr = [], cn().font = this._getContextFont();
    const S = y ? this._getTextWidth(ln) : 0;
    for (let w = 0, c = t.length; w < c; ++w) {
      let f = t[w], b = this._getTextWidth(f);
      if (a && b > u)
        for (; f.length > 0; ) {
          let x = 0, A = Kt(f).length, v = "", k = 0;
          for (; x < A; ) {
            const P = x + A >>> 1, E = Kt(f), T = E.slice(0, P + 1).join(""), R = this._getTextWidth(T);
            (y && h && p + n > _ ? R + S : R) <= u ? (x = P + 1, v = T, k = R) : A = P;
          }
          if (v) {
            if (m) {
              const T = Kt(f), R = Kt(v), G = T[R.length], F = G === Ye || G === ps;
              let K;
              if (F && k <= u)
                K = R.length;
              else {
                const Y = R.lastIndexOf(Ye), L = R.lastIndexOf(ps);
                K = Math.max(Y, L) + 1;
              }
              K > 0 && (x = K, v = T.slice(0, x).join(""), k = this._getTextWidth(v));
            }
            if (v = v.trimRight(), this._addTextLine(v), i = Math.max(i, k), p += n, this._shouldHandleEllipsis(p)) {
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
      if (this.textArr[this.textArr.length - 1] && (this.textArr[this.textArr.length - 1].lastInParagraph = !0), h && p + n > _)
        break;
    }
    this.textHeight = e, this.textWidth = i;
  }
  _shouldHandleEllipsis(t) {
    const e = +this.fontSize(), i = this.lineHeight() * e, n = this.attrs.height, s = n !== fe && n !== void 0, r = this.padding(), a = n - r * 2;
    return !(this.wrap() !== ys) || s && t + i > a;
  }
  _tryToAddEllipsisToLastLine() {
    const t = this.attrs.width, e = t !== fe && t !== void 0, i = this.padding(), n = t - i * 2, s = this.ellipsis(), r = this.textArr[this.textArr.length - 1];
    !r || !s || (e && (this._getTextWidth(r.text + ln) < n || (r.text = r.text.slice(0, r.text.length - 3))), this.textArr.splice(this.textArr.length - 1, 1), this._addTextLine(r.text + ln));
  }
  getStrokeScaleEnabled() {
    return !0;
  }
  _useBufferCanvas() {
    const t = this.textDecoration().indexOf("underline") !== -1 || this.textDecoration().indexOf("line-through") !== -1, e = this.hasShadow();
    return t && e ? !0 : super._useBufferCanvas();
  }
}
Ae.Text = st;
st.prototype._fillFunc = Xo;
st.prototype._strokeFunc = Ko;
st.prototype.className = $o;
st.prototype._attrsAffectingSize = [
  "text",
  "fontSize",
  "padding",
  "wrap",
  "lineHeight",
  "letterSpacing"
];
(0, No._registerNode)(st);
ft.Factory.overWriteSetter(st, "width", (0, Wt.getNumberOrAutoValidator)());
ft.Factory.overWriteSetter(st, "height", (0, Wt.getNumberOrAutoValidator)());
ft.Factory.addGetterSetter(st, "direction", dr);
ft.Factory.addGetterSetter(st, "fontFamily", "Arial");
ft.Factory.addGetterSetter(st, "fontSize", 12, (0, Wt.getNumberValidator)());
ft.Factory.addGetterSetter(st, "fontStyle", fr);
ft.Factory.addGetterSetter(st, "fontVariant", fr);
ft.Factory.addGetterSetter(st, "padding", 0, (0, Wt.getNumberValidator)());
ft.Factory.addGetterSetter(st, "align", ur);
ft.Factory.addGetterSetter(st, "verticalAlign", Uo);
ft.Factory.addGetterSetter(st, "lineHeight", 1, (0, Wt.getNumberValidator)());
ft.Factory.addGetterSetter(st, "wrap", zo);
ft.Factory.addGetterSetter(st, "ellipsis", !1, (0, Wt.getBooleanValidator)());
ft.Factory.addGetterSetter(st, "letterSpacing", 0, (0, Wt.getNumberValidator)());
ft.Factory.addGetterSetter(st, "text", "", (0, Wt.getStringValidator)());
ft.Factory.addGetterSetter(st, "textDecoration", "");
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.TextPath = void 0;
const dn = it, Ct = B, Qo = ct, Te = xe, un = Ae, pr = D, Jo = U, Zo = "", _r = "normal";
function mr(o) {
  o.fillText(this.partialText, 0, 0);
}
function yr(o) {
  o.strokeText(this.partialText, 0, 0);
}
class dt extends Qo.Shape {
  constructor(t) {
    super(t), this.dummyCanvas = dn.Util.createCanvasElement(), this.dataArray = [], this._readDataAttribute(), this.on("dataChange.konva", function() {
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
    const e = this.textDecoration(), i = this.fill(), n = this.fontSize(), s = this.glyphInfo;
    e === "underline" && t.beginPath();
    for (let r = 0; r < s.length; r++) {
      t.save();
      const a = s[r].p0;
      t.translate(a.x, a.y), t.rotate(s[r].rotation), this.partialText = s[r].text, t.fillStrokeShape(this), e === "underline" && (r === 0 && t.moveTo(0, n / 2 + 1), t.lineTo(n, n / 2 + 1)), t.restore();
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
    return dn.Util.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height."), this.textHeight;
  }
  setText(t) {
    return un.Text.prototype.setText.call(this, t);
  }
  _getContextFont() {
    return un.Text.prototype._getContextFont.call(this);
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
    const i = this.letterSpacing(), n = this.align(), s = this.kerningFunc(), r = Math.max(this.textWidth + ((this.attrs.text || "").length - 1) * i, 0);
    let a = 0;
    n === "center" && (a = Math.max(0, this.pathLength / 2 - r / 2)), n === "right" && (a = Math.max(0, this.pathLength - r));
    const h = (0, un.stringToArray)(this.text());
    let l = a;
    for (let u = 0; u < h.length; u++) {
      const _ = this._getPointAtLength(l);
      if (!_)
        return;
      let p = this._getTextSize(h[u]).width + i;
      if (h[u] === " " && n === "justify") {
        const w = this.text().split(" ").length - 1;
        p += (this.pathLength - r) / w;
      }
      const g = this._getPointAtLength(l + p);
      if (!g)
        return;
      const d = Te.Path.getLineLength(_.x, _.y, g.x, g.y);
      let m = 0;
      if (s)
        try {
          m = s(h[u - 1], h[u]) * this.fontSize();
        } catch {
          m = 0;
        }
      _.x += m, g.x += m, this.textWidth += m;
      const y = Te.Path.getPointOnLine(m + d / 2, _.x, _.y, g.x, g.y), S = Math.atan2(g.y - _.y, g.x - _.x);
      this.glyphInfo.push({
        transposeX: y.x,
        transposeY: y.y,
        text: h[u],
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
    let e = t[0] || 0, i = t[0] || 0, n = t[1] || 0, s = t[1] || 0, r, a;
    for (let l = 0; l < t.length / 2; l++)
      r = t[l * 2], a = t[l * 2 + 1], e = Math.min(e, r), i = Math.max(i, r), n = Math.min(n, a), s = Math.max(s, a);
    const h = this.fontSize();
    return {
      x: e - h / 2,
      y: n - h / 2,
      width: i - e + h,
      height: s - n + h
    };
  }
  destroy() {
    return dn.Util.releaseCanvas(this.dummyCanvas), super.destroy();
  }
}
ki.TextPath = dt;
dt.prototype._fillFunc = mr;
dt.prototype._strokeFunc = yr;
dt.prototype._fillFuncHit = mr;
dt.prototype._strokeFuncHit = yr;
dt.prototype.className = "TextPath";
dt.prototype._attrsAffectingSize = ["text", "fontSize", "data"];
(0, Jo._registerNode)(dt);
Ct.Factory.addGetterSetter(dt, "data");
Ct.Factory.addGetterSetter(dt, "fontFamily", "Arial");
Ct.Factory.addGetterSetter(dt, "fontSize", 12, (0, pr.getNumberValidator)());
Ct.Factory.addGetterSetter(dt, "fontStyle", _r);
Ct.Factory.addGetterSetter(dt, "align", "left");
Ct.Factory.addGetterSetter(dt, "letterSpacing", 0, (0, pr.getNumberValidator)());
Ct.Factory.addGetterSetter(dt, "textBaseline", "middle");
Ct.Factory.addGetterSetter(dt, "fontVariant", _r);
Ct.Factory.addGetterSetter(dt, "text", Zo);
Ct.Factory.addGetterSetter(dt, "textDecoration", "");
Ct.Factory.addGetterSetter(dt, "kerningFunc", void 0);
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.Transformer = void 0;
const X = it, j = B, bs = tt, th = ct, eh = ze, vs = Ce, vt = U, jt = D, ih = U, br = "tr-konva", nh = [
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
].map((o) => o + `.${br}`).join(" "), Ss = "nodesRect", sh = [
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
], rh = {
  "top-left": -45,
  "top-center": 0,
  "top-right": 45,
  "middle-right": -90,
  "middle-left": 90,
  "bottom-left": -135,
  "bottom-center": 180,
  "bottom-right": 135
}, ah = "ontouchstart" in vt.Konva._global;
function oh(o, t, e) {
  if (o === "rotater")
    return e;
  t += X.Util.degToRad(rh[o] || 0);
  const i = (X.Util.radToDeg(t) % 360 + 360) % 360;
  return X.Util._inRange(i, 315 + 22.5, 360) || X.Util._inRange(i, 0, 22.5) ? "ns-resize" : X.Util._inRange(i, 45 - 22.5, 45 + 22.5) ? "nesw-resize" : X.Util._inRange(i, 90 - 22.5, 90 + 22.5) ? "ew-resize" : X.Util._inRange(i, 135 - 22.5, 135 + 22.5) ? "nwse-resize" : X.Util._inRange(i, 180 - 22.5, 180 + 22.5) ? "ns-resize" : X.Util._inRange(i, 225 - 22.5, 225 + 22.5) ? "nesw-resize" : X.Util._inRange(i, 270 - 22.5, 270 + 22.5) ? "ew-resize" : X.Util._inRange(i, 315 - 22.5, 315 + 22.5) ? "nwse-resize" : (X.Util.error("Transformer has unknown angle for cursor detection: " + i), "pointer");
}
const ii = [
  "top-left",
  "top-center",
  "top-right",
  "middle-right",
  "middle-left",
  "bottom-left",
  "bottom-center",
  "bottom-right"
];
function hh(o) {
  return {
    x: o.x + o.width / 2 * Math.cos(o.rotation) + o.height / 2 * Math.sin(-o.rotation),
    y: o.y + o.height / 2 * Math.cos(o.rotation) + o.width / 2 * Math.sin(o.rotation)
  };
}
function vr(o, t, e) {
  const i = e.x + (o.x - e.x) * Math.cos(t) - (o.y - e.y) * Math.sin(t), n = e.y + (o.x - e.x) * Math.sin(t) + (o.y - e.y) * Math.cos(t);
  return {
    ...o,
    rotation: o.rotation + t,
    x: i,
    y: n
  };
}
function lh(o, t) {
  const e = hh(o);
  return vr(o, t, e);
}
function ch(o, t, e) {
  let i = t;
  for (let n = 0; n < o.length; n++) {
    const s = vt.Konva.getAngle(o[n]), r = Math.abs(s - t) % (Math.PI * 2);
    Math.min(r, Math.PI * 2 - r) < e && (i = s);
  }
  return i;
}
let Cn = 0;
class H extends vs.Group {
  constructor(t) {
    super(t), this._movingAnchorName = null, this._transforming = !1, this._createElements(), this._handleMouseMove = this._handleMouseMove.bind(this), this._handleMouseUp = this._handleMouseUp.bind(this), this.update = this.update.bind(this), this.on(nh, this.update), this.getNode() && this.update();
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
    return br + this._id;
  }
  setNodes(t = []) {
    this._nodes && this._nodes.length && this.detach();
    const e = t.filter((n) => n.isAncestorOf(this) ? (X.Util.error("Konva.Transformer cannot be an a child of the node you are trying to attach"), !1) : !0);
    return this._nodes = t = e, t.length === 1 && this.useSingleNodeRotation() ? this.rotation(t[0].getAbsoluteRotation()) : this.rotation(0), this._nodes.forEach((n) => {
      const s = () => {
        this.nodes().length === 1 && this.useSingleNodeRotation() && this.rotation(this.nodes()[0].getAbsoluteRotation()), this._resetTransformCache(), !this._transforming && !this.isDragging() && this.update();
      };
      if (n._attrsAffectingSize.length) {
        const r = n._attrsAffectingSize.map((a) => a + "Change." + this._getEventNamespace()).join(" ");
        n.on(r, s);
      }
      n.on(sh.map((r) => r + `.${this._getEventNamespace()}`).join(" "), s), n.on(`absoluteTransformChange.${this._getEventNamespace()}`, s), this._proxyDrag(n);
    }), this._resetTransformCache(), !!this.findOne(".top-left") && this.update(), this;
  }
  _proxyDrag(t) {
    let e;
    t.on(`dragstart.${this._getEventNamespace()}`, (i) => {
      e = t.getAbsolutePosition(), !this.isDragging() && t !== this.findOne(".back") && this.startDrag(i, !1);
    }), t.on(`dragmove.${this._getEventNamespace()}`, (i) => {
      if (!e)
        return;
      const n = t.getAbsolutePosition(), s = n.x - e.x, r = n.y - e.y;
      this.nodes().forEach((a) => {
        if (a === t || a.isDragging())
          return;
        const h = a.getAbsolutePosition();
        a.setAbsolutePosition({
          x: h.x + s,
          y: h.y + r
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
    this._clearCache(Ss), this._clearCache("transform"), this._clearSelfAndDescendantCache("absoluteTransform");
  }
  _getNodeRect() {
    return this._getCache(Ss, this.__getNodeRect);
  }
  __getNodeShape(t, e = this.rotation(), i) {
    const n = t.getClientRect({
      skipTransform: !0,
      skipShadow: !0,
      skipStroke: this.ignoreStroke()
    }), s = t.getAbsoluteScale(i), r = t.getAbsolutePosition(i), a = n.x * s.x - t.offsetX() * s.x, h = n.y * s.y - t.offsetY() * s.y, l = (vt.Konva.getAngle(t.getAbsoluteRotation()) + Math.PI * 2) % (Math.PI * 2), u = {
      x: r.x + a * Math.cos(l) + h * Math.sin(-l),
      y: r.y + h * Math.cos(l) + a * Math.sin(l),
      width: n.width * s.x,
      height: n.height * s.y,
      rotation: l
    };
    return vr(u, -vt.Konva.getAngle(e), {
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
    const i = new X.Transform();
    i.rotate(-vt.Konva.getAngle(this.rotation()));
    let n = 1 / 0, s = 1 / 0, r = -1 / 0, a = -1 / 0;
    e.forEach(function(l) {
      const u = i.point(l);
      n === void 0 && (n = r = u.x, s = a = u.y), n = Math.min(n, u.x), s = Math.min(s, u.y), r = Math.max(r, u.x), a = Math.max(a, u.y);
    }), i.invert();
    const h = i.point({ x: n, y: s });
    return {
      x: h.x,
      y: h.y,
      width: r - n,
      height: a - s,
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
    this._createBack(), ii.forEach((t) => {
      this._createAnchor(t);
    }), this._createAnchor("rotater");
  }
  _createAnchor(t) {
    const e = new eh.Rect({
      stroke: "rgb(0, 161, 255)",
      fill: "white",
      strokeWidth: 1,
      name: t + " _anchor",
      dragDistance: 0,
      draggable: !0,
      hitStrokeWidth: ah ? 10 : "auto"
    }), i = this;
    e.on("mousedown touchstart", function(n) {
      i._handleMouseDown(n);
    }), e.on("dragstart", (n) => {
      e.stopDrag(), n.cancelBubble = !0;
    }), e.on("dragend", (n) => {
      n.cancelBubble = !0;
    }), e.on("mouseenter", () => {
      const n = vt.Konva.getAngle(this.rotation()), s = this.rotateAnchorCursor(), r = oh(t, n, s);
      e.getStage().content && (e.getStage().content.style.cursor = r), this._cursorChange = !0;
    }), e.on("mouseout", () => {
      e.getStage().content && (e.getStage().content.style.cursor = ""), this._cursorChange = !1;
    }), this.add(e);
  }
  _createBack() {
    const t = new th.Shape({
      name: "back",
      width: 0,
      height: 0,
      draggable: !0,
      sceneFunc(e, i) {
        const n = i.getParent(), s = n.padding();
        e.beginPath(), e.rect(-s, -s, i.width() + s * 2, i.height() + s * 2), e.moveTo(i.width() / 2, -s), n.rotateEnabled() && n.rotateLineVisible() && e.lineTo(i.width() / 2, -n.rotateAnchorOffset() * X.Util._sign(i.height()) - s), e.fillStrokeShape(i);
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
    const e = this._getNodeRect(), i = e.width, n = e.height, s = Math.sqrt(Math.pow(i, 2) + Math.pow(n, 2));
    this.sin = Math.abs(n / s), this.cos = Math.abs(i / s), typeof window < "u" && (window.addEventListener("mousemove", this._handleMouseMove), window.addEventListener("touchmove", this._handleMouseMove), window.addEventListener("mouseup", this._handleMouseUp, !0), window.addEventListener("touchend", this._handleMouseUp, !0)), this._transforming = !0;
    const r = t.target.getAbsolutePosition(), a = t.target.getStage().getPointerPosition();
    this._anchorDragOffset = {
      x: a.x - r.x,
      y: a.y - r.y
    }, Cn++, this._fire("transformstart", { evt: t.evt, target: this.getNode() }), this._nodes.forEach((h) => {
      h._fire("transformstart", { evt: t.evt, target: h });
    });
  }
  _handleMouseMove(t) {
    let e, i, n;
    const s = this.findOne("." + this._movingAnchorName), r = s.getStage();
    r.setPointersPositions(t);
    const a = r.getPointerPosition();
    let h = {
      x: a.x - this._anchorDragOffset.x,
      y: a.y - this._anchorDragOffset.y
    };
    const l = s.getAbsolutePosition();
    this.anchorDragBoundFunc() && (h = this.anchorDragBoundFunc()(l, h, t)), s.setAbsolutePosition(h);
    const u = s.getAbsolutePosition();
    if (l.x === u.x && l.y === u.y)
      return;
    if (this._movingAnchorName === "rotater") {
      const w = this._getNodeRect();
      e = s.x() - w.width / 2, i = -s.y() + w.height / 2;
      let c = Math.atan2(-i, e) + Math.PI / 2;
      w.height < 0 && (c -= Math.PI);
      const b = vt.Konva.getAngle(this.rotation()) + c, x = vt.Konva.getAngle(this.rotationSnapTolerance()), v = ch(this.rotationSnaps(), b, x) - w.rotation, k = lh(w, v);
      this._fitNodesInto(k, t);
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
        n = Math.sqrt(Math.pow(w.x - s.x(), 2) + Math.pow(w.y - s.y(), 2));
        const c = this.findOne(".top-left").x() > w.x ? -1 : 1, f = this.findOne(".top-left").y() > w.y ? -1 : 1;
        e = n * this.cos * c, i = n * this.sin * f, this.findOne(".top-left").x(w.x - e), this.findOne(".top-left").y(w.y - i);
      }
    } else if (this._movingAnchorName === "top-center")
      this.findOne(".top-left").y(s.y());
    else if (this._movingAnchorName === "top-right") {
      if (p) {
        const w = g ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".bottom-left").x(),
          y: this.findOne(".bottom-left").y()
        };
        n = Math.sqrt(Math.pow(s.x() - w.x, 2) + Math.pow(w.y - s.y(), 2));
        const c = this.findOne(".top-right").x() < w.x ? -1 : 1, f = this.findOne(".top-right").y() > w.y ? -1 : 1;
        e = n * this.cos * c, i = n * this.sin * f, this.findOne(".top-right").x(w.x + e), this.findOne(".top-right").y(w.y - i);
      }
      var d = s.position();
      this.findOne(".top-left").y(d.y), this.findOne(".bottom-right").x(d.x);
    } else if (this._movingAnchorName === "middle-left")
      this.findOne(".top-left").x(s.x());
    else if (this._movingAnchorName === "middle-right")
      this.findOne(".bottom-right").x(s.x());
    else if (this._movingAnchorName === "bottom-left") {
      if (p) {
        const w = g ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".top-right").x(),
          y: this.findOne(".top-right").y()
        };
        n = Math.sqrt(Math.pow(w.x - s.x(), 2) + Math.pow(s.y() - w.y, 2));
        const c = w.x < s.x() ? -1 : 1, f = s.y() < w.y ? -1 : 1;
        e = n * this.cos * c, i = n * this.sin * f, s.x(w.x - e), s.y(w.y + i);
      }
      d = s.position(), this.findOne(".top-left").x(d.x), this.findOne(".bottom-right").y(d.y);
    } else if (this._movingAnchorName === "bottom-center")
      this.findOne(".bottom-right").y(s.y());
    else if (this._movingAnchorName === "bottom-right") {
      if (p) {
        const w = g ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".top-left").x(),
          y: this.findOne(".top-left").y()
        };
        n = Math.sqrt(Math.pow(s.x() - w.x, 2) + Math.pow(s.y() - w.y, 2));
        const c = this.findOne(".bottom-right").x() < w.x ? -1 : 1, f = this.findOne(".bottom-right").y() < w.y ? -1 : 1;
        e = n * this.cos * c, i = n * this.sin * f, this.findOne(".bottom-right").x(w.x + e), this.findOne(".bottom-right").y(w.y + i);
      }
    } else
      console.error(new Error("Wrong position argument of selection resizer: " + this._movingAnchorName));
    if (g = this.centeredScaling() || t.altKey, g) {
      const w = this.findOne(".top-left"), c = this.findOne(".bottom-right"), f = w.x(), b = w.y(), x = this.getWidth() - c.x(), A = this.getHeight() - c.y();
      c.move({
        x: -f,
        y: -b
      }), w.move({
        x,
        y: A
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
      Cn--, this._fire("transformend", { evt: t, target: i }), (e = this.getLayer()) === null || e === void 0 || e.batchDraw(), i && this._nodes.forEach((n) => {
        var s;
        n._fire("transformend", { evt: t, target: n }), (s = n.getLayer()) === null || s === void 0 || s.batchDraw();
      }), this._movingAnchorName = null;
    }
  }
  _fitNodesInto(t, e) {
    const i = this._getNodeRect(), n = 1;
    if (X.Util._inRange(t.width, -this.padding() * 2 - n, n)) {
      this.update();
      return;
    }
    if (X.Util._inRange(t.height, -this.padding() * 2 - n, n)) {
      this.update();
      return;
    }
    const s = new X.Transform();
    if (s.rotate(vt.Konva.getAngle(this.rotation())), this._movingAnchorName && t.width < 0 && this._movingAnchorName.indexOf("left") >= 0) {
      const p = s.point({
        x: -this.padding() * 2,
        y: 0
      });
      t.x += p.x, t.y += p.y, t.width += this.padding() * 2, this._movingAnchorName = this._movingAnchorName.replace("left", "right"), this._anchorDragOffset.x -= p.x, this._anchorDragOffset.y -= p.y;
    } else if (this._movingAnchorName && t.width < 0 && this._movingAnchorName.indexOf("right") >= 0) {
      const p = s.point({
        x: this.padding() * 2,
        y: 0
      });
      this._movingAnchorName = this._movingAnchorName.replace("right", "left"), this._anchorDragOffset.x -= p.x, this._anchorDragOffset.y -= p.y, t.width += this.padding() * 2;
    }
    if (this._movingAnchorName && t.height < 0 && this._movingAnchorName.indexOf("top") >= 0) {
      const p = s.point({
        x: 0,
        y: -this.padding() * 2
      });
      t.x += p.x, t.y += p.y, this._movingAnchorName = this._movingAnchorName.replace("top", "bottom"), this._anchorDragOffset.x -= p.x, this._anchorDragOffset.y -= p.y, t.height += this.padding() * 2;
    } else if (this._movingAnchorName && t.height < 0 && this._movingAnchorName.indexOf("bottom") >= 0) {
      const p = s.point({
        x: 0,
        y: this.padding() * 2
      });
      this._movingAnchorName = this._movingAnchorName.replace("bottom", "top"), this._anchorDragOffset.x -= p.x, this._anchorDragOffset.y -= p.y, t.height += this.padding() * 2;
    }
    if (this.boundBoxFunc()) {
      const p = this.boundBoxFunc()(i, t);
      p ? t = p : X.Util.warn("boundBoxFunc returned falsy. You should return new bound rect from it!");
    }
    const r = 1e7, a = new X.Transform();
    a.translate(i.x, i.y), a.rotate(i.rotation), a.scale(i.width / r, i.height / r);
    const h = new X.Transform(), l = t.width / r, u = t.height / r;
    this.flipEnabled() === !1 ? (h.translate(t.x, t.y), h.rotate(t.rotation), h.translate(t.width < 0 ? t.width : 0, t.height < 0 ? t.height : 0), h.scale(Math.abs(l), Math.abs(u))) : (h.translate(t.x, t.y), h.rotate(t.rotation), h.scale(l, u));
    const _ = h.multiply(a.invert());
    this._nodes.forEach((p) => {
      var g;
      const d = p.getParent().getAbsoluteTransform(), m = p.getTransform().copy();
      m.translate(p.offsetX(), p.offsetY());
      const y = new X.Transform();
      y.multiply(d.copy().invert()).multiply(_).multiply(d).multiply(m);
      const S = y.decompose();
      p.setAttrs(S), (g = p.getLayer()) === null || g === void 0 || g.batchDraw();
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
    const i = e.width, n = e.height, s = this.enabledAnchors(), r = this.resizeEnabled(), a = this.padding(), h = this.anchorSize(), l = this.find("._anchor");
    l.forEach((_) => {
      _.setAttrs({
        width: h,
        height: h,
        offsetX: h / 2,
        offsetY: h / 2,
        stroke: this.anchorStroke(),
        strokeWidth: this.anchorStrokeWidth(),
        fill: this.anchorFill(),
        cornerRadius: this.anchorCornerRadius()
      });
    }), this._batchChangeChild(".top-left", {
      x: 0,
      y: 0,
      offsetX: h / 2 + a,
      offsetY: h / 2 + a,
      visible: r && s.indexOf("top-left") >= 0
    }), this._batchChangeChild(".top-center", {
      x: i / 2,
      y: 0,
      offsetY: h / 2 + a,
      visible: r && s.indexOf("top-center") >= 0
    }), this._batchChangeChild(".top-right", {
      x: i,
      y: 0,
      offsetX: h / 2 - a,
      offsetY: h / 2 + a,
      visible: r && s.indexOf("top-right") >= 0
    }), this._batchChangeChild(".middle-left", {
      x: 0,
      y: n / 2,
      offsetX: h / 2 + a,
      visible: r && s.indexOf("middle-left") >= 0
    }), this._batchChangeChild(".middle-right", {
      x: i,
      y: n / 2,
      offsetX: h / 2 - a,
      visible: r && s.indexOf("middle-right") >= 0
    }), this._batchChangeChild(".bottom-left", {
      x: 0,
      y: n,
      offsetX: h / 2 + a,
      offsetY: h / 2 - a,
      visible: r && s.indexOf("bottom-left") >= 0
    }), this._batchChangeChild(".bottom-center", {
      x: i / 2,
      y: n,
      offsetY: h / 2 - a,
      visible: r && s.indexOf("bottom-center") >= 0
    }), this._batchChangeChild(".bottom-right", {
      x: i,
      y: n,
      offsetX: h / 2 - a,
      offsetY: h / 2 - a,
      visible: r && s.indexOf("bottom-right") >= 0
    }), this._batchChangeChild(".rotater", {
      x: i / 2,
      y: -this.rotateAnchorOffset() * X.Util._sign(n) - a,
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
    return this.getStage() && this._cursorChange && this.getStage().content && (this.getStage().content.style.cursor = ""), vs.Group.prototype.destroy.call(this), this.detach(), this._removeEvents(), this;
  }
  toObject() {
    return bs.Node.prototype.toObject.call(this);
  }
  clone(t) {
    return bs.Node.prototype.clone.call(this, t);
  }
  getClientRect() {
    return this.nodes().length > 0 ? super.getClientRect() : { x: 0, y: 0, width: 0, height: 0 };
  }
}
Ei.Transformer = H;
H.isTransforming = () => Cn > 0;
function dh(o) {
  return o instanceof Array || X.Util.warn("enabledAnchors value should be an array"), o instanceof Array && o.forEach(function(t) {
    ii.indexOf(t) === -1 && X.Util.warn("Unknown anchor name: " + t + ". Available names are: " + ii.join(", "));
  }), o || [];
}
H.prototype.className = "Transformer";
(0, ih._registerNode)(H);
j.Factory.addGetterSetter(H, "enabledAnchors", ii, dh);
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
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.Wedge = void 0;
const Mi = B, uh = ct, fh = U, Sr = D, gh = U;
class Nt extends uh.Shape {
  _sceneFunc(t) {
    t.beginPath(), t.arc(0, 0, this.radius(), 0, fh.Konva.getAngle(this.angle()), this.clockwise()), t.lineTo(0, 0), t.closePath(), t.fillStrokeShape(this);
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
Ti.Wedge = Nt;
Nt.prototype.className = "Wedge";
Nt.prototype._centroid = !0;
Nt.prototype._attrsAffectingSize = ["radius"];
(0, gh._registerNode)(Nt);
Mi.Factory.addGetterSetter(Nt, "radius", 0, (0, Sr.getNumberValidator)());
Mi.Factory.addGetterSetter(Nt, "angle", 0, (0, Sr.getNumberValidator)());
Mi.Factory.addGetterSetter(Nt, "clockwise", !1);
Mi.Factory.backCompat(Nt, {
  angleDeg: "angle",
  getAngleDeg: "getAngle",
  setAngleDeg: "setAngle"
});
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.Blur = void 0;
const Cs = B, ph = tt, _h = D;
function ws() {
  this.r = 0, this.g = 0, this.b = 0, this.a = 0, this.next = null;
}
const mh = [
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
], yh = [
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
function bh(o, t) {
  const e = o.data, i = o.width, n = o.height;
  let s, r, a, h, l, u, _, p, g, d, m, y, S, w, c, f, b, x, A, v;
  const k = t + t + 1, P = i - 1, E = n - 1, T = t + 1, R = T * (T + 1) / 2, G = new ws(), F = mh[t], K = yh[t];
  let Y = null, L = G, W = null, $ = null;
  for (let O = 1; O < k; O++)
    L = L.next = new ws(), O === T && (Y = L);
  L.next = G, a = r = 0;
  for (let O = 0; O < n; O++) {
    y = S = w = c = h = l = u = _ = 0, p = T * (f = e[r]), g = T * (b = e[r + 1]), d = T * (x = e[r + 2]), m = T * (A = e[r + 3]), h += R * f, l += R * b, u += R * x, _ += R * A, L = G;
    for (let z = 0; z < T; z++)
      L.r = f, L.g = b, L.b = x, L.a = A, L = L.next;
    for (let z = 1; z < T; z++)
      s = r + ((P < z ? P : z) << 2), h += (L.r = f = e[s]) * (v = T - z), l += (L.g = b = e[s + 1]) * v, u += (L.b = x = e[s + 2]) * v, _ += (L.a = A = e[s + 3]) * v, y += f, S += b, w += x, c += A, L = L.next;
    W = G, $ = Y;
    for (let z = 0; z < i; z++)
      e[r + 3] = A = _ * F >> K, A !== 0 ? (A = 255 / A, e[r] = (h * F >> K) * A, e[r + 1] = (l * F >> K) * A, e[r + 2] = (u * F >> K) * A) : e[r] = e[r + 1] = e[r + 2] = 0, h -= p, l -= g, u -= d, _ -= m, p -= W.r, g -= W.g, d -= W.b, m -= W.a, s = a + ((s = z + t + 1) < P ? s : P) << 2, y += W.r = e[s], S += W.g = e[s + 1], w += W.b = e[s + 2], c += W.a = e[s + 3], h += y, l += S, u += w, _ += c, W = W.next, p += f = $.r, g += b = $.g, d += x = $.b, m += A = $.a, y -= f, S -= b, w -= x, c -= A, $ = $.next, r += 4;
    a += i;
  }
  for (let O = 0; O < i; O++) {
    S = w = c = y = l = u = _ = h = 0, r = O << 2, p = T * (f = e[r]), g = T * (b = e[r + 1]), d = T * (x = e[r + 2]), m = T * (A = e[r + 3]), h += R * f, l += R * b, u += R * x, _ += R * A, L = G;
    for (let et = 0; et < T; et++)
      L.r = f, L.g = b, L.b = x, L.a = A, L = L.next;
    let z = i;
    for (let et = 1; et <= t; et++)
      r = z + O << 2, h += (L.r = f = e[r]) * (v = T - et), l += (L.g = b = e[r + 1]) * v, u += (L.b = x = e[r + 2]) * v, _ += (L.a = A = e[r + 3]) * v, y += f, S += b, w += x, c += A, L = L.next, et < E && (z += i);
    r = O, W = G, $ = Y;
    for (let et = 0; et < n; et++)
      s = r << 2, e[s + 3] = A = _ * F >> K, A > 0 ? (A = 255 / A, e[s] = (h * F >> K) * A, e[s + 1] = (l * F >> K) * A, e[s + 2] = (u * F >> K) * A) : e[s] = e[s + 1] = e[s + 2] = 0, h -= p, l -= g, u -= d, _ -= m, p -= W.r, g -= W.g, d -= W.b, m -= W.a, s = O + ((s = et + T) < E ? s : E) * i << 2, h += y += W.r = e[s], l += S += W.g = e[s + 1], u += w += W.b = e[s + 2], _ += c += W.a = e[s + 3], W = W.next, p += f = $.r, g += b = $.g, d += x = $.b, m += A = $.a, y -= f, S -= b, w -= x, c -= A, $ = $.next, r += i;
  }
}
const vh = function(t) {
  const e = Math.round(this.blurRadius());
  e > 0 && bh(t, e);
};
Ri.Blur = vh;
Cs.Factory.addGetterSetter(ph.Node, "blurRadius", 0, (0, _h.getNumberValidator)(), Cs.Factory.afterSetFilter);
var Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.Brighten = void 0;
const xs = B, Sh = tt, Ch = D, wh = function(o) {
  const t = this.brightness() * 255, e = o.data, i = e.length;
  for (let n = 0; n < i; n += 4)
    e[n] += t, e[n + 1] += t, e[n + 2] += t;
};
Fi.Brighten = wh;
xs.Factory.addGetterSetter(Sh.Node, "brightness", 0, (0, Ch.getNumberValidator)(), xs.Factory.afterSetFilter);
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.Contrast = void 0;
const Ps = B, xh = tt, Ph = D, Ah = function(o) {
  const t = Math.pow((this.contrast() + 100) / 100, 2), e = o.data, i = e.length;
  let n = 150, s = 150, r = 150;
  for (let a = 0; a < i; a += 4)
    n = e[a], s = e[a + 1], r = e[a + 2], n /= 255, n -= 0.5, n *= t, n += 0.5, n *= 255, s /= 255, s -= 0.5, s *= t, s += 0.5, s *= 255, r /= 255, r -= 0.5, r *= t, r += 0.5, r *= 255, n = n < 0 ? 0 : n > 255 ? 255 : n, s = s < 0 ? 0 : s > 255 ? 255 : s, r = r < 0 ? 0 : r > 255 ? 255 : r, e[a] = n, e[a + 1] = s, e[a + 2] = r;
};
Oi.Contrast = Ah;
Ps.Factory.addGetterSetter(xh.Node, "contrast", 0, (0, Ph.getNumberValidator)(), Ps.Factory.afterSetFilter);
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.Emboss = void 0;
const Ut = B, Gi = tt, kh = it, Cr = D, Eh = function(o) {
  const t = this.embossStrength() * 10, e = this.embossWhiteLevel() * 255, i = this.embossDirection(), n = this.embossBlend(), s = o.data, r = o.width, a = o.height, h = r * 4;
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
      kh.Util.error("Unknown emboss direction: " + i);
  }
  do {
    const p = (_ - 1) * h;
    let g = l;
    _ + g < 1 && (g = 0), _ + g > a && (g = 0);
    const d = (_ - 1 + g) * r * 4;
    let m = r;
    do {
      const y = p + (m - 1) * 4;
      let S = u;
      m + S < 1 && (S = 0), m + S > r && (S = 0);
      const w = d + (m - 1 + S) * 4, c = s[y] - s[w], f = s[y + 1] - s[w + 1], b = s[y + 2] - s[w + 2];
      let x = c;
      const A = x > 0 ? x : -x, v = f > 0 ? f : -f, k = b > 0 ? b : -b;
      if (v > A && (x = f), k > A && (x = b), x *= t, n) {
        const P = s[y] + x, E = s[y + 1] + x, T = s[y + 2] + x;
        s[y] = P > 255 ? 255 : P < 0 ? 0 : P, s[y + 1] = E > 255 ? 255 : E < 0 ? 0 : E, s[y + 2] = T > 255 ? 255 : T < 0 ? 0 : T;
      } else {
        let P = e - x;
        P < 0 ? P = 0 : P > 255 && (P = 255), s[y] = s[y + 1] = s[y + 2] = P;
      }
    } while (--m);
  } while (--_);
};
Ni.Emboss = Eh;
Ut.Factory.addGetterSetter(Gi.Node, "embossStrength", 0.5, (0, Cr.getNumberValidator)(), Ut.Factory.afterSetFilter);
Ut.Factory.addGetterSetter(Gi.Node, "embossWhiteLevel", 0.5, (0, Cr.getNumberValidator)(), Ut.Factory.afterSetFilter);
Ut.Factory.addGetterSetter(Gi.Node, "embossDirection", "top-left", void 0, Ut.Factory.afterSetFilter);
Ut.Factory.addGetterSetter(Gi.Node, "embossBlend", !1, void 0, Ut.Factory.afterSetFilter);
var Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
Li.Enhance = void 0;
const As = B, Th = tt, Mh = D;
function fn(o, t, e, i, n) {
  const s = e - t, r = n - i;
  if (s === 0)
    return i + r / 2;
  if (r === 0)
    return i;
  let a = (o - t) / s;
  return a = r * a + i, a;
}
const Rh = function(o) {
  const t = o.data, e = t.length;
  let i = t[0], n = i, s, r = t[1], a = r, h, l = t[2], u = l, _;
  const p = this.enhance();
  if (p === 0)
    return;
  for (let c = 0; c < e; c += 4)
    s = t[c + 0], s < i ? i = s : s > n && (n = s), h = t[c + 1], h < r ? r = h : h > a && (a = h), _ = t[c + 2], _ < l ? l = _ : _ > u && (u = _);
  n === i && (n = 255, i = 0), a === r && (a = 255, r = 0), u === l && (u = 255, l = 0);
  let g, d, m, y, S, w;
  if (p > 0)
    g = n + p * (255 - n), d = i - p * (i - 0), m = a + p * (255 - a), y = r - p * (r - 0), S = u + p * (255 - u), w = l - p * (l - 0);
  else {
    const c = (n + i) * 0.5;
    g = n + p * (n - c), d = i + p * (i - c);
    const f = (a + r) * 0.5;
    m = a + p * (a - f), y = r + p * (r - f);
    const b = (u + l) * 0.5;
    S = u + p * (u - b), w = l + p * (l - b);
  }
  for (let c = 0; c < e; c += 4)
    t[c + 0] = fn(t[c + 0], i, n, d, g), t[c + 1] = fn(t[c + 1], r, a, y, m), t[c + 2] = fn(t[c + 2], l, u, w, S);
};
Li.Enhance = Rh;
As.Factory.addGetterSetter(Th.Node, "enhance", 0, (0, Mh.getNumberValidator)(), As.Factory.afterSetFilter);
var Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.Grayscale = void 0;
const Fh = function(o) {
  const t = o.data, e = t.length;
  for (let i = 0; i < e; i += 4) {
    const n = 0.34 * t[i] + 0.5 * t[i + 1] + 0.16 * t[i + 2];
    t[i] = n, t[i + 1] = n, t[i + 2] = n;
  }
};
Di.Grayscale = Fh;
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
Ii.HSL = void 0;
const ye = B, In = tt, $n = D;
ye.Factory.addGetterSetter(In.Node, "hue", 0, (0, $n.getNumberValidator)(), ye.Factory.afterSetFilter);
ye.Factory.addGetterSetter(In.Node, "saturation", 0, (0, $n.getNumberValidator)(), ye.Factory.afterSetFilter);
ye.Factory.addGetterSetter(In.Node, "luminance", 0, (0, $n.getNumberValidator)(), ye.Factory.afterSetFilter);
const Oh = function(o) {
  const t = o.data, e = t.length, i = 1, n = Math.pow(2, this.saturation()), s = Math.abs(this.hue() + 360) % 360, r = this.luminance() * 127, a = i * n * Math.cos(s * Math.PI / 180), h = i * n * Math.sin(s * Math.PI / 180), l = 0.299 * i + 0.701 * a + 0.167 * h, u = 0.587 * i - 0.587 * a + 0.33 * h, _ = 0.114 * i - 0.114 * a - 0.497 * h, p = 0.299 * i - 0.299 * a - 0.328 * h, g = 0.587 * i + 0.413 * a + 0.035 * h, d = 0.114 * i - 0.114 * a + 0.293 * h, m = 0.299 * i - 0.3 * a + 1.25 * h, y = 0.587 * i - 0.586 * a - 1.05 * h, S = 0.114 * i + 0.886 * a - 0.2 * h;
  let w, c, f, b;
  for (let x = 0; x < e; x += 4)
    w = t[x + 0], c = t[x + 1], f = t[x + 2], b = t[x + 3], t[x + 0] = l * w + u * c + _ * f + r, t[x + 1] = p * w + g * c + d * f + r, t[x + 2] = m * w + y * c + S * f + r, t[x + 3] = b;
};
Ii.HSL = Oh;
var $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
$i.HSV = void 0;
const be = B, Un = tt, Bn = D, Nh = function(o) {
  const t = o.data, e = t.length, i = Math.pow(2, this.value()), n = Math.pow(2, this.saturation()), s = Math.abs(this.hue() + 360) % 360, r = i * n * Math.cos(s * Math.PI / 180), a = i * n * Math.sin(s * Math.PI / 180), h = 0.299 * i + 0.701 * r + 0.167 * a, l = 0.587 * i - 0.587 * r + 0.33 * a, u = 0.114 * i - 0.114 * r - 0.497 * a, _ = 0.299 * i - 0.299 * r - 0.328 * a, p = 0.587 * i + 0.413 * r + 0.035 * a, g = 0.114 * i - 0.114 * r + 0.293 * a, d = 0.299 * i - 0.3 * r + 1.25 * a, m = 0.587 * i - 0.586 * r - 1.05 * a, y = 0.114 * i + 0.886 * r - 0.2 * a;
  for (let S = 0; S < e; S += 4) {
    const w = t[S + 0], c = t[S + 1], f = t[S + 2], b = t[S + 3];
    t[S + 0] = h * w + l * c + u * f, t[S + 1] = _ * w + p * c + g * f, t[S + 2] = d * w + m * c + y * f, t[S + 3] = b;
  }
};
$i.HSV = Nh;
be.Factory.addGetterSetter(Un.Node, "hue", 0, (0, Bn.getNumberValidator)(), be.Factory.afterSetFilter);
be.Factory.addGetterSetter(Un.Node, "saturation", 0, (0, Bn.getNumberValidator)(), be.Factory.afterSetFilter);
be.Factory.addGetterSetter(Un.Node, "value", 0, (0, Bn.getNumberValidator)(), be.Factory.afterSetFilter);
var Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.Invert = void 0;
const Gh = function(o) {
  const t = o.data, e = t.length;
  for (let i = 0; i < e; i += 4)
    t[i] = 255 - t[i], t[i + 1] = 255 - t[i + 1], t[i + 2] = 255 - t[i + 2];
};
Ui.Invert = Gh;
var Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.Kaleidoscope = void 0;
const ni = B, wr = tt, ks = it, xr = D, Lh = function(o, t, e) {
  const i = o.data, n = t.data, s = o.width, r = o.height, a = e.polarCenterX || s / 2, h = e.polarCenterY || r / 2;
  let l = Math.sqrt(a * a + h * h), u = s - a, _ = r - h;
  const p = Math.sqrt(u * u + _ * _);
  l = p > l ? p : l;
  const g = r, d = s, m = 360 / d * Math.PI / 180;
  for (let y = 0; y < d; y += 1) {
    const S = Math.sin(y * m), w = Math.cos(y * m);
    for (let c = 0; c < g; c += 1) {
      u = Math.floor(a + l * c / g * w), _ = Math.floor(h + l * c / g * S);
      let f = (_ * s + u) * 4;
      const b = i[f + 0], x = i[f + 1], A = i[f + 2], v = i[f + 3];
      f = (y + c * s) * 4, n[f + 0] = b, n[f + 1] = x, n[f + 2] = A, n[f + 3] = v;
    }
  }
}, Dh = function(o, t, e) {
  const i = o.data, n = t.data, s = o.width, r = o.height, a = e.polarCenterX || s / 2, h = e.polarCenterY || r / 2;
  let l = Math.sqrt(a * a + h * h), u = s - a, _ = r - h;
  const p = Math.sqrt(u * u + _ * _);
  l = p > l ? p : l;
  const g = r, d = s, m = 0;
  let y, S;
  for (u = 0; u < s; u += 1)
    for (_ = 0; _ < r; _ += 1) {
      const w = u - a, c = _ - h, f = Math.sqrt(w * w + c * c) * g / l;
      let b = (Math.atan2(c, w) * 180 / Math.PI + 360 + m) % 360;
      b = b * d / 360, y = Math.floor(b), S = Math.floor(f);
      let x = (S * s + y) * 4;
      const A = i[x + 0], v = i[x + 1], k = i[x + 2], P = i[x + 3];
      x = (_ * s + u) * 4, n[x + 0] = A, n[x + 1] = v, n[x + 2] = k, n[x + 3] = P;
    }
}, Ih = function(o) {
  const t = o.width, e = o.height;
  let i, n, s, r, a, h, l, u, _, p, g = Math.round(this.kaleidoscopePower());
  const d = Math.round(this.kaleidoscopeAngle()), m = Math.floor(t * (d % 360) / 360);
  if (g < 1)
    return;
  const y = ks.Util.createCanvasElement();
  y.width = t, y.height = e;
  const S = y.getContext("2d").getImageData(0, 0, t, e);
  ks.Util.releaseCanvas(y), Lh(o, S, {
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
      s = Math.round(i + m) % t, _ = (t * n + s) * 4, a = S.data[_ + 0], h = S.data[_ + 1], l = S.data[_ + 2], u = S.data[_ + 3], p = (t * n + i) * 4, S.data[p + 0] = a, S.data[p + 1] = h, S.data[p + 2] = l, S.data[p + 3] = u;
  for (n = 0; n < e; n += 1)
    for (c = Math.floor(w), r = 0; r < g; r += 1) {
      for (i = 0; i < c + 1; i += 1)
        _ = (t * n + i) * 4, a = S.data[_ + 0], h = S.data[_ + 1], l = S.data[_ + 2], u = S.data[_ + 3], p = (t * n + c * 2 - i - 1) * 4, S.data[p + 0] = a, S.data[p + 1] = h, S.data[p + 2] = l, S.data[p + 3] = u;
      c *= 2;
    }
  Dh(S, o, {});
};
Bi.Kaleidoscope = Ih;
ni.Factory.addGetterSetter(wr.Node, "kaleidoscopePower", 2, (0, xr.getNumberValidator)(), ni.Factory.afterSetFilter);
ni.Factory.addGetterSetter(wr.Node, "kaleidoscopeAngle", 0, (0, xr.getNumberValidator)(), ni.Factory.afterSetFilter);
var Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
Vi.Mask = void 0;
const Es = B, $h = tt, Uh = D;
function Ke(o, t, e) {
  let i = (e * o.width + t) * 4;
  const n = [];
  return n.push(o.data[i++], o.data[i++], o.data[i++], o.data[i++]), n;
}
function Me(o, t) {
  return Math.sqrt(Math.pow(o[0] - t[0], 2) + Math.pow(o[1] - t[1], 2) + Math.pow(o[2] - t[2], 2));
}
function Bh(o) {
  const t = [0, 0, 0];
  for (let e = 0; e < o.length; e++)
    t[0] += o[e][0], t[1] += o[e][1], t[2] += o[e][2];
  return t[0] /= o.length, t[1] /= o.length, t[2] /= o.length, t;
}
function Vh(o, t) {
  const e = Ke(o, 0, 0), i = Ke(o, o.width - 1, 0), n = Ke(o, 0, o.height - 1), s = Ke(o, o.width - 1, o.height - 1), r = t || 10;
  if (Me(e, i) < r && Me(i, s) < r && Me(s, n) < r && Me(n, e) < r) {
    const a = Bh([i, e, s, n]), h = [];
    for (let l = 0; l < o.width * o.height; l++) {
      const u = Me(a, [
        o.data[l * 4],
        o.data[l * 4 + 1],
        o.data[l * 4 + 2]
      ]);
      h[l] = u < r ? 0 : 255;
    }
    return h;
  }
}
function Hh(o, t) {
  for (let e = 0; e < o.width * o.height; e++)
    o.data[4 * e + 3] = t[e];
}
function zh(o, t, e) {
  const i = [1, 1, 1, 1, 0, 1, 1, 1, 1], n = Math.round(Math.sqrt(i.length)), s = Math.floor(n / 2), r = [];
  for (let a = 0; a < e; a++)
    for (let h = 0; h < t; h++) {
      const l = a * t + h;
      let u = 0;
      for (let _ = 0; _ < n; _++)
        for (let p = 0; p < n; p++) {
          const g = a + _ - s, d = h + p - s;
          if (g >= 0 && g < e && d >= 0 && d < t) {
            const m = g * t + d, y = i[_ * n + p];
            u += o[m] * y;
          }
        }
      r[l] = u === 255 * 8 ? 255 : 0;
    }
  return r;
}
function Wh(o, t, e) {
  const i = [1, 1, 1, 1, 1, 1, 1, 1, 1], n = Math.round(Math.sqrt(i.length)), s = Math.floor(n / 2), r = [];
  for (let a = 0; a < e; a++)
    for (let h = 0; h < t; h++) {
      const l = a * t + h;
      let u = 0;
      for (let _ = 0; _ < n; _++)
        for (let p = 0; p < n; p++) {
          const g = a + _ - s, d = h + p - s;
          if (g >= 0 && g < e && d >= 0 && d < t) {
            const m = g * t + d, y = i[_ * n + p];
            u += o[m] * y;
          }
        }
      r[l] = u >= 255 * 4 ? 255 : 0;
    }
  return r;
}
function jh(o, t, e) {
  const i = [0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111], n = Math.round(Math.sqrt(i.length)), s = Math.floor(n / 2), r = [];
  for (let a = 0; a < e; a++)
    for (let h = 0; h < t; h++) {
      const l = a * t + h;
      let u = 0;
      for (let _ = 0; _ < n; _++)
        for (let p = 0; p < n; p++) {
          const g = a + _ - s, d = h + p - s;
          if (g >= 0 && g < e && d >= 0 && d < t) {
            const m = g * t + d, y = i[_ * n + p];
            u += o[m] * y;
          }
        }
      r[l] = u;
    }
  return r;
}
const Yh = function(o) {
  const t = this.threshold();
  let e = Vh(o, t);
  return e && (e = zh(e, o.width, o.height), e = Wh(e, o.width, o.height), e = jh(e, o.width, o.height), Hh(o, e)), o;
};
Vi.Mask = Yh;
Es.Factory.addGetterSetter($h.Node, "threshold", 0, (0, Uh.getNumberValidator)(), Es.Factory.afterSetFilter);
var Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.Noise = void 0;
const Ts = B, Xh = tt, Kh = D, qh = function(o) {
  const t = this.noise() * 255, e = o.data, i = e.length, n = t / 2;
  for (let s = 0; s < i; s += 4)
    e[s + 0] += n - 2 * n * Math.random(), e[s + 1] += n - 2 * n * Math.random(), e[s + 2] += n - 2 * n * Math.random();
};
Hi.Noise = qh;
Ts.Factory.addGetterSetter(Xh.Node, "noise", 0.2, (0, Kh.getNumberValidator)(), Ts.Factory.afterSetFilter);
var zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.Pixelate = void 0;
const Ms = B, Qh = it, Jh = tt, Zh = D, tl = function(o) {
  let t = Math.ceil(this.pixelSize()), e = o.width, i = o.height, n = Math.ceil(e / t), s = Math.ceil(i / t), r = o.data;
  if (t <= 0) {
    Qh.Util.error("pixelSize value can not be <= 0");
    return;
  }
  for (let a = 0; a < n; a += 1)
    for (let h = 0; h < s; h += 1) {
      let l = 0, u = 0, _ = 0, p = 0;
      const g = a * t, d = g + t, m = h * t, y = m + t;
      let S = 0;
      for (let w = g; w < d; w += 1)
        if (!(w >= e))
          for (let c = m; c < y; c += 1) {
            if (c >= i)
              continue;
            const f = (e * c + w) * 4;
            l += r[f + 0], u += r[f + 1], _ += r[f + 2], p += r[f + 3], S += 1;
          }
      l = l / S, u = u / S, _ = _ / S, p = p / S;
      for (let w = g; w < d; w += 1)
        if (!(w >= e))
          for (let c = m; c < y; c += 1) {
            if (c >= i)
              continue;
            const f = (e * c + w) * 4;
            r[f + 0] = l, r[f + 1] = u, r[f + 2] = _, r[f + 3] = p;
          }
    }
};
zi.Pixelate = tl;
Ms.Factory.addGetterSetter(Jh.Node, "pixelSize", 8, (0, Zh.getNumberValidator)(), Ms.Factory.afterSetFilter);
var Wi = {};
Object.defineProperty(Wi, "__esModule", { value: !0 });
Wi.Posterize = void 0;
const Rs = B, el = tt, il = D, nl = function(o) {
  const t = Math.round(this.levels() * 254) + 1, e = o.data, i = e.length, n = 255 / t;
  for (let s = 0; s < i; s += 1)
    e[s] = Math.floor(e[s] / n) * n;
};
Wi.Posterize = nl;
Rs.Factory.addGetterSetter(el.Node, "levels", 0.5, (0, il.getNumberValidator)(), Rs.Factory.afterSetFilter);
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.RGB = void 0;
const si = B, Vn = tt, sl = D, rl = function(o) {
  const t = o.data, e = t.length, i = this.red(), n = this.green(), s = this.blue();
  for (let r = 0; r < e; r += 4) {
    const a = (0.34 * t[r] + 0.5 * t[r + 1] + 0.16 * t[r + 2]) / 255;
    t[r] = a * i, t[r + 1] = a * n, t[r + 2] = a * s, t[r + 3] = t[r + 3];
  }
};
ji.RGB = rl;
si.Factory.addGetterSetter(Vn.Node, "red", 0, function(o) {
  return this._filterUpToDate = !1, o > 255 ? 255 : o < 0 ? 0 : Math.round(o);
});
si.Factory.addGetterSetter(Vn.Node, "green", 0, function(o) {
  return this._filterUpToDate = !1, o > 255 ? 255 : o < 0 ? 0 : Math.round(o);
});
si.Factory.addGetterSetter(Vn.Node, "blue", 0, sl.RGBComponent, si.Factory.afterSetFilter);
var Yi = {};
Object.defineProperty(Yi, "__esModule", { value: !0 });
Yi.RGBA = void 0;
const Ie = B, Xi = tt, al = D, ol = function(o) {
  const t = o.data, e = t.length, i = this.red(), n = this.green(), s = this.blue(), r = this.alpha();
  for (let a = 0; a < e; a += 4) {
    const h = 1 - r;
    t[a] = i * r + t[a] * h, t[a + 1] = n * r + t[a + 1] * h, t[a + 2] = s * r + t[a + 2] * h;
  }
};
Yi.RGBA = ol;
Ie.Factory.addGetterSetter(Xi.Node, "red", 0, function(o) {
  return this._filterUpToDate = !1, o > 255 ? 255 : o < 0 ? 0 : Math.round(o);
});
Ie.Factory.addGetterSetter(Xi.Node, "green", 0, function(o) {
  return this._filterUpToDate = !1, o > 255 ? 255 : o < 0 ? 0 : Math.round(o);
});
Ie.Factory.addGetterSetter(Xi.Node, "blue", 0, al.RGBComponent, Ie.Factory.afterSetFilter);
Ie.Factory.addGetterSetter(Xi.Node, "alpha", 1, function(o) {
  return this._filterUpToDate = !1, o > 1 ? 1 : o < 0 ? 0 : o;
});
var Ki = {};
Object.defineProperty(Ki, "__esModule", { value: !0 });
Ki.Sepia = void 0;
const hl = function(o) {
  const t = o.data, e = t.length;
  for (let i = 0; i < e; i += 4) {
    const n = t[i + 0], s = t[i + 1], r = t[i + 2];
    t[i + 0] = Math.min(255, n * 0.393 + s * 0.769 + r * 0.189), t[i + 1] = Math.min(255, n * 0.349 + s * 0.686 + r * 0.168), t[i + 2] = Math.min(255, n * 0.272 + s * 0.534 + r * 0.131);
  }
};
Ki.Sepia = hl;
var qi = {};
Object.defineProperty(qi, "__esModule", { value: !0 });
qi.Solarize = void 0;
const ll = function(o) {
  const t = o.data, e = o.width, i = o.height, n = e * 4;
  let s = i;
  do {
    const r = (s - 1) * n;
    let a = e;
    do {
      const h = r + (a - 1) * 4;
      let l = t[h], u = t[h + 1], _ = t[h + 2];
      l > 127 && (l = 255 - l), u > 127 && (u = 255 - u), _ > 127 && (_ = 255 - _), t[h] = l, t[h + 1] = u, t[h + 2] = _;
    } while (--a);
  } while (--s);
};
qi.Solarize = ll;
var Qi = {};
Object.defineProperty(Qi, "__esModule", { value: !0 });
Qi.Threshold = void 0;
const Fs = B, cl = tt, dl = D, ul = function(o) {
  const t = this.threshold() * 255, e = o.data, i = e.length;
  for (let n = 0; n < i; n += 1)
    e[n] = e[n] < t ? 0 : 255;
};
Qi.Threshold = ul;
Fs.Factory.addGetterSetter(cl.Node, "threshold", 0.5, (0, dl.getNumberValidator)(), Fs.Factory.afterSetFilter);
Object.defineProperty(oi, "__esModule", { value: !0 });
oi.Konva = void 0;
const Os = zs, fl = ui, gl = pi, pl = yi, _l = bi, ml = vi, Ns = me, yl = Ve, bl = xe, vl = ze, Sl = wi, Cl = xi, wl = Pi, xl = Ai, Pl = Ae, Al = ki, kl = Ei, El = Ti, Tl = Ri, Ml = Fi, Rl = Oi, Fl = Ni, Ol = Li, Nl = Di, Gl = Ii, Ll = $i, Dl = Ui, Il = Bi, $l = Vi, Ul = Hi, Bl = zi, Vl = Wi, Hl = ji, zl = Yi, Wl = Ki, jl = qi, Yl = Qi;
oi.Konva = Os.Konva.Util._assign(Os.Konva, {
  Arc: fl.Arc,
  Arrow: gl.Arrow,
  Circle: pl.Circle,
  Ellipse: _l.Ellipse,
  Image: ml.Image,
  Label: Ns.Label,
  Tag: Ns.Tag,
  Line: yl.Line,
  Path: bl.Path,
  Rect: vl.Rect,
  RegularPolygon: Sl.RegularPolygon,
  Ring: Cl.Ring,
  Sprite: wl.Sprite,
  Star: xl.Star,
  Text: Pl.Text,
  TextPath: Al.TextPath,
  Transformer: kl.Transformer,
  Wedge: El.Wedge,
  Filters: {
    Blur: Tl.Blur,
    Brighten: Ml.Brighten,
    Contrast: Rl.Contrast,
    Emboss: Fl.Emboss,
    Enhance: Ol.Enhance,
    Grayscale: Nl.Grayscale,
    HSL: Gl.HSL,
    HSV: Ll.HSV,
    Invert: Dl.Invert,
    Kaleidoscope: Il.Kaleidoscope,
    Mask: $l.Mask,
    Noise: Ul.Noise,
    Pixelate: Bl.Pixelate,
    Posterize: Vl.Posterize,
    RGB: Hl.RGB,
    RGBA: zl.RGBA,
    Sepia: Wl.Sepia,
    Solarize: jl.Solarize,
    Threshold: Yl.Threshold
  }
});
var Xl = kn.exports;
Object.defineProperty(Xl, "__esModule", { value: !0 });
const Kl = oi;
kn.exports = Kl.Konva;
var ql = kn.exports;
const ot = /* @__PURE__ */ Yr(ql);
function Hn(o) {
  return o.split(".", 1)[0] ?? "";
}
function Ql(o, t, e) {
  const i = t == null ? void 0 : t.attributes.friendly_name;
  return typeof i == "string" && i.trim() ? i : e != null && e.name ? e.name : o.entity_id;
}
function Gs(o, t, e) {
  return o.label_mode === "off" ? "" : o.label_mode === "short" ? o.entity_id.split(".").at(-1) ?? o.entity_id : Ql(o, t, e);
}
function Ls(o, t) {
  var s;
  if (!t) return "Unavailable";
  const e = o.bind.primary, i = e.source === "attr" && e.attr ? t.attributes[e.attr] : t.state;
  if (i == null || i === "")
    return "Unavailable";
  const n = String(i);
  return (s = e.format) != null && s.includes("{value}") ? e.format.split("{value}").join(n) : n;
}
function Jl(o, t) {
  if (!t) return !0;
  const { domains: e, tags: i, area_ids: n } = t.filters;
  return !(e != null && e.length && !e.includes(Hn(o.entity_id)) || i != null && i.length && !i.some((s) => o.tags.includes(s)) || n != null && n.length && (!o.area_id || !n.includes(o.area_id)));
}
function Ds(o) {
  return !o || ["unavailable", "unknown"].includes(o.state) ? "#9e9e9e" : ["on", "open", "playing", "home", "heat"].includes(o.state) ? "#ffb300" : "#1976d2";
}
function Zl(o) {
  const t = {
    binary_sensor: "B",
    climate: "T",
    device_tracker: "N",
    light: "L",
    media_player: "M",
    sensor: "S",
    switch: "P"
  }, e = Hn(o);
  return t[e] ?? e.slice(0, 1).toUpperCase() ?? "?";
}
function tc(o) {
  const t = Hn(o);
  return t === "climate" ? ["heating"] : t === "device_tracker" ? ["network"] : [];
}
var ec = Object.defineProperty, gt = (o, t, e, i) => {
  for (var n = void 0, s = o.length - 1, r; s >= 0; s--)
    (r = o[s]) && (n = r(t, e, n) || n);
  return n && ec(t, e, n), n;
};
const ic = 4e6, zn = class zn extends Oe {
  constructor() {
    super(...arguments), this.narrow = !1, this._config = null, this._loading = !0, this._editMode = !1, this._currentView = "all", this._currentPlanId = null, this._selectedAreaId = null, this._selectedMarkerId = null, this._haAreas = [], this._haEntities = [], this._entityToAdd = "", this._entitySearch = "", this._notice = "", this._error = "", this._stage = null, this._backgroundLayer = null, this._resizeObserver = null, this._areasLayer = null, this._markersLayer = null, this._areaShapes = /* @__PURE__ */ new Map(), this._markerGroups = /* @__PURE__ */ new Map(), this._renderGeneration = 0, this._initializeTimer = null;
  }
  get _canEdit() {
    var t, e;
    return ((e = (t = this.hass) == null ? void 0 : t.user) == null ? void 0 : e.is_admin) === !0;
  }
  async connectedCallback() {
    super.connectedCallback(), await this._loadConfig(), this._canEdit && await this._loadRegistry();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._initializeTimer !== null && (window.clearTimeout(this._initializeTimer), this._initializeTimer = null), this._destroyStage();
  }
  async _loadConfig() {
    this._loading = !0;
    try {
      this._config = await this.hass.callWS({
        type: "floorplan_ui/get_config"
      }), this._config.plans.length > 0 && (this._currentPlanId = this._config.plans[0].plan_id);
    } catch (t) {
      console.error("Failed to load floorplan config:", t), this._config = { version: 1, plans: [], views: [] }, this._setError("Floorplan configuration could not be loaded.");
    }
    this._loading = !1;
  }
  async saveConfig() {
    if (!(!this._config || !this._canEdit))
      try {
        await this.hass.callWS({
          type: "floorplan_ui/save_config",
          config: this._config
        }), this._setNotice("Changes saved.");
      } catch (t) {
        console.error("Failed to save floorplan config:", t), this._setError("Changes could not be saved.");
      }
  }
  async updated(t) {
    t.has("_loading") && !this._loading && !this._stage && (await this.updateComplete, this._initializeTimer = window.setTimeout(() => {
      this._initializeTimer = null, this._initializeStage();
    }, 100)), t.has("_currentPlanId") && this._stage && (this._selectedAreaId = null, this._selectedMarkerId = null, this._renderFloorplan()), t.has("_currentView") && this._stage && this._renderMarkers(this._getCurrentPlan()), t.has("hass") && (!this._canEdit && this._editMode && (this._editMode = !1, this._selectedAreaId = null, this._selectedMarkerId = null, this._syncCanvasInteractivity()), this._refreshMarkerLiveValues());
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
    console.info(`Initializing Konva stage: ${i}x${n}`), this._stage = new ot.Stage({
      container: t,
      width: i,
      height: n,
      draggable: !0
    }), this._backgroundLayer = new ot.Layer(), this._stage.add(this._backgroundLayer), this._areasLayer = new ot.Layer(), this._stage.add(this._areasLayer), this._markersLayer = new ot.Layer(), this._stage.add(this._markersLayer), this._stage.on("click", (s) => {
      this._editMode && s.target === this._stage && (this._selectedAreaId = null, this._selectedMarkerId = null, this._syncCanvasInteractivity());
    }), this._stage.on("wheel", (s) => {
      s.evt.preventDefault();
      const r = this._stage.scaleX(), a = this._stage.getPointerPosition();
      if (!a) return;
      const h = {
        x: (a.x - this._stage.x()) / r,
        y: (a.y - this._stage.y()) / r
      }, l = this._getCurrentPlan(), u = (l == null ? void 0 : l.view.minZoom) ?? 0.1, _ = (l == null ? void 0 : l.view.maxZoom) ?? 5, g = (s.evt.deltaY > 0 ? -1 : 1) > 0 ? r * 1.1 : r / 1.1, d = Math.max(u, Math.min(_, g));
      this._stage.scale({ x: d, y: d }), this._stage.position({
        x: a.x - h.x * d,
        y: a.y - h.y * d
      });
    }), this._resizeObserver = new ResizeObserver((s) => {
      for (const r of s) {
        const { width: a, height: h } = r.contentRect;
        a > 0 && h > 0 && this._stage && (this._stage.width(a), this._stage.height(h));
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
    var s, r, a, h, l;
    if (!this._stage || !this._backgroundLayer) return;
    const t = ++this._renderGeneration;
    this._backgroundLayer.destroyChildren(), (s = this._areasLayer) == null || s.destroyChildren(), (r = this._markersLayer) == null || r.destroyChildren(), this._areaShapes.clear(), this._markerGroups.clear();
    const e = this._getCurrentPlan(), i = this._stage.width(), n = this._stage.height();
    if (!e)
      this._drawEmptyState(i, n);
    else if ((a = e.background) != null && a.url) {
      this._renderAreas(e), this._renderMarkers(e);
      const u = new Image();
      u.onload = () => {
        if (t !== this._renderGeneration || e.plan_id !== this._currentPlanId)
          return;
        const _ = new ot.Image({
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
    this._backgroundLayer.batchDraw(), (h = this._areasLayer) == null || h.batchDraw(), (l = this._markersLayer) == null || l.batchDraw();
  }
  _fitToScreen(t, e) {
    if (!this._stage) return;
    const i = this._stage.width(), n = this._stage.height(), s = Math.min(i / t, n / e) * 0.9;
    this._stage.scale({ x: s, y: s }), this._stage.position({
      x: (i - t * s) / 2,
      y: (n - e * s) / 2
    });
  }
  _toggleEditMode() {
    this._canEdit && (this._editMode = !this._editMode, this._editMode || (this._selectedAreaId = null, this._selectedMarkerId = null), this._syncCanvasInteractivity());
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
    var e, i;
    if (!(!this._areasLayer || !t)) {
      this._areasLayer.destroyChildren(), this._areaShapes.clear();
      for (const n of t.areas ?? []) {
        const { shape: s, style: r } = n;
        let a;
        if (s.type === "polygon" && (((e = s.points) == null ? void 0 : e.length) ?? 0) >= 6)
          a = new ot.Line({
            x: s.x ?? 0,
            y: s.y ?? 0,
            points: s.points,
            closed: !0,
            fill: r.fill ?? "#2196f3",
            stroke: r.stroke ?? "#1976d2",
            strokeWidth: r.strokeWidth ?? 2,
            opacity: r.fillOpacity ?? 0.4,
            draggable: this._editMode
          });
        else if (s.type === "rect")
          a = new ot.Rect({
            x: s.x ?? 0,
            y: s.y ?? 0,
            width: s.width ?? 100,
            height: s.height ?? 80,
            fill: r.fill ?? "#2196f3",
            stroke: r.stroke ?? "#1976d2",
            strokeWidth: r.strokeWidth ?? 2,
            opacity: r.fillOpacity ?? 0.4,
            draggable: this._editMode
          });
        else
          continue;
        a.on("click", (l) => {
          l.cancelBubble = !0, this._editMode && this._onAreaSelected(n.id);
        }), a.on("dragend", () => {
          if (!this._editMode) return;
          const l = a.position();
          this._updateAreaShape(n.id, {
            x: l.x,
            y: l.y
          });
        }), this._areasLayer.add(a), this._areaShapes.set(n.id, a);
        const h = (i = this._haAreas.find((l) => l.id === n.area_id)) == null ? void 0 : i.name;
        if (n.area_id) {
          const l = a.getClientRect({ skipTransform: !1 });
          this._areasLayer.add(
            new ot.Text({
              x: l.x + 8,
              y: l.y + 8,
              text: h ?? n.area_id,
              fontSize: 14,
              fontStyle: "bold",
              fill: "#0d47a1",
              listening: !1
            })
          );
        }
      }
      this._syncCanvasInteractivity();
    }
  }
  _syncCanvasInteractivity() {
    var t, e;
    for (const [i, n] of this._areaShapes.entries())
      n.draggable(this._editMode), n.strokeWidth(this._selectedAreaId === i ? 4 : 2);
    for (const [i, n] of this._markerGroups.entries()) {
      n.draggable(this._editMode);
      const s = n.findOne(".marker-dot");
      s == null || s.strokeWidth(this._selectedMarkerId === i ? 4 : 2);
    }
    (t = this._areasLayer) == null || t.batchDraw(), (e = this._markersLayer) == null || e.batchDraw();
  }
  _drawEmptyState(t, e) {
    const i = new ot.Rect({
      x: 0,
      y: 0,
      width: t,
      height: e,
      fill: "#f5f5f5"
    });
    this._backgroundLayer.add(i);
    const n = new ot.Text({
      x: t / 2,
      y: e / 2 - 50,
      text: "🏠",
      fontSize: 48
    });
    n.offsetX(n.width() / 2), this._backgroundLayer.add(n);
    const s = new ot.Text({
      x: t / 2,
      y: e / 2 + 10,
      text: "No Floorplan Loaded",
      fontSize: 20,
      fontStyle: "bold",
      fill: "#333"
    });
    s.offsetX(s.width() / 2), this._backgroundLayer.add(s);
    const r = new ot.Text({
      x: t / 2,
      y: e / 2 + 40,
      text: 'Click "Edit" → "Upload Image" to get started',
      fontSize: 14,
      fill: "#666"
    });
    r.offsetX(r.width() / 2), this._backgroundLayer.add(r);
  }
  _drawImageErrorState(t, e) {
    const i = new ot.Rect({
      x: 0,
      y: 0,
      width: t,
      height: e,
      fill: "#fff3e0"
    });
    this._backgroundLayer.add(i);
    const n = new ot.Text({
      x: t / 2,
      y: e / 2 - 10,
      text: "Failed to load floorplan image",
      fontSize: 18,
      fontStyle: "bold",
      fill: "#e65100"
    });
    n.offsetX(n.width() / 2), this._backgroundLayer.add(n);
    const s = new ot.Text({
      x: t / 2,
      y: e / 2 + 20,
      text: "Try re-uploading the image in Edit mode.",
      fontSize: 14,
      fill: "#e65100"
    });
    s.offsetX(s.width() / 2), this._backgroundLayer.add(s);
  }
  _onAreaSelected(t) {
    this._selectedAreaId = t, this._selectedMarkerId = null, this._syncCanvasInteractivity();
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
    const i = this._getVisibleCanvasCenter(), n = this._newId("area"), s = {
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
    }, r = this._config.plans.map(
      (a) => a.plan_id === e.plan_id ? { ...a, areas: [...a.areas ?? [], s] } : a
    );
    this._config = {
      ...this._config,
      plans: r
    }, this._selectedAreaId = n, this._selectedMarkerId = null, this.saveConfig(), this._renderFloorplan();
  }
  _updateAreaShape(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._getCurrentPlan();
    if (!i) return;
    const n = this._config.plans.map((s) => s.plan_id !== i.plan_id ? s : {
      ...s,
      areas: (s.areas ?? []).map(
        (r) => r.id === t ? {
          ...r,
          shape: {
            ...r.shape,
            ...e
          }
        } : r
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
    const s = this._config.plans.map((r) => r.plan_id !== n.plan_id ? r : {
      ...r,
      areas: (r.areas ?? []).map(
        (a) => a.id === this._selectedAreaId ? { ...a, area_id: i } : a
      )
    });
    this._config = {
      ...this._config,
      plans: s
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
      if (!Jl(n, e)) continue;
      const s = this.hass.states[n.entity_id], r = i.get(n.entity_id), a = Gs(n, s, r), h = n.label_mode !== "off", l = new ot.Group({
        x: n.pos.x,
        y: n.pos.y,
        draggable: this._editMode
      }), u = new ot.Circle({
        name: "marker-dot",
        radius: 19,
        fill: Ds(s),
        stroke: "#ffffff",
        strokeWidth: this._selectedMarkerId === n.id ? 4 : 2,
        shadowColor: "#000000",
        shadowBlur: 5,
        shadowOpacity: 0.25
      }), _ = new ot.Text({
        x: -10,
        y: -10,
        width: 20,
        align: "center",
        text: Zl(n.entity_id),
        fill: "#ffffff",
        fontSize: 16,
        fontStyle: "bold",
        listening: !1
      }), p = new ot.Text({
        name: "marker-label",
        x: 26,
        y: -17,
        text: h ? a : "",
        fill: "#212121",
        fontSize: 13,
        fontStyle: "bold",
        padding: 2,
        listening: !1
      }), g = new ot.Text({
        name: "marker-value",
        x: 26,
        y: 1,
        text: h ? Ls(n, s) : "",
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
      const s = this.hass.states[i.entity_id], r = n.findOne(".marker-dot"), a = n.findOne(".marker-value"), h = n.findOne(".marker-label");
      r == null || r.fill(Ds(s)), a == null || a.text(i.label_mode === "off" ? "" : Ls(i, s)), h == null || h.text(Gs(i, s, e.get(i.entity_id)));
    }
    this._markersLayer.batchDraw();
  }
  _getSelectedMarker() {
    var t;
    return this._selectedMarkerId ? ((t = this._getCurrentPlan()) == null ? void 0 : t.markers.find((e) => e.id === this._selectedMarkerId)) ?? null : null;
  }
  _addMarker() {
    if (!this._canEdit || !this._config || !this._entityToAdd.trim()) return;
    const t = this._getCurrentPlan();
    if (!t) return;
    const e = this._entityToAdd.trim(), i = this._haEntities.find((s) => s.entity_id === e);
    if (!i && !this.hass.states[e]) {
      this._setError("Select an existing Home Assistant entity.");
      return;
    }
    const n = {
      id: this._newId("marker"),
      entity_id: e,
      area_id: (i == null ? void 0 : i.area_id) ?? null,
      pos: this._getVisibleCanvasCenter(),
      icon: (i == null ? void 0 : i.icon) ?? "mdi:circle",
      label_mode: "auto",
      tags: tc(e),
      bind: { primary: { source: "state" } }
    };
    this._config = {
      ...this._config,
      plans: this._config.plans.map(
        (s) => s.plan_id === t.plan_id ? { ...s, markers: [...s.markers, n] } : s
      )
    }, this._selectedMarkerId = n.id, this._selectedAreaId = null, this._entityToAdd = "", this.saveConfig(), this._renderMarkers(this._getCurrentPlan());
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
            (s) => s.id === t ? { ...s, ...e } : s
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
  _onMarkerLabelModeChange(t) {
    const e = this._getSelectedMarker();
    if (!e) return;
    const i = t.target.value;
    this._updateMarker(e.id, { label_mode: i }), this._renderMarkers(this._getCurrentPlan());
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
    var s;
    if (!this._canEdit || !this._config) return;
    const t = (s = window.prompt("New view name")) == null ? void 0 : s.trim();
    if (!t) return;
    const e = t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "view";
    let i = e, n = 2;
    for (; this._config.views.some((r) => r.id === i); )
      i = `${e}-${n++}`;
    this._config = {
      ...this._config,
      views: [...this._config.views, { id: i, name: t, filters: {} }]
    }, this._currentView = i, this.saveConfig();
  }
  _deleteCurrentView() {
    !this._canEdit || !this._config || this._currentView === "all" || window.confirm("Delete the current view?") && (this._config = {
      ...this._config,
      views: this._config.views.filter((t) => t.id !== this._currentView)
    }, this._currentView = "all", this.saveConfig());
  }
  _updateViewFilter(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = e.target.value.split(",").map((n) => n.trim()).filter(Boolean);
    this._config = {
      ...this._config,
      views: this._config.views.map((n) => {
        if (n.id !== this._currentView) return n;
        const s = { ...n.filters };
        return s[t] = i.length ? [...new Set(i)] : void 0, { ...n, filters: s };
      })
    }, this.saveConfig(), this._renderMarkers(this._getCurrentPlan());
  }
  _handleFileUpload(t) {
    var s;
    if (!this._canEdit) return;
    const e = t.target, i = (s = e.files) == null ? void 0 : s[0];
    if (e.value = "", !i) return;
    if (!["image/png", "image/jpeg"].includes(i.type)) {
      this._setError("Only PNG and JPEG floorplans are supported.");
      return;
    }
    if (i.size > ic) {
      this._setError("The floorplan image must not exceed 4 MB.");
      return;
    }
    const n = new FileReader();
    n.onload = (r) => {
      var l;
      const a = (l = r.target) == null ? void 0 : l.result, h = new Image();
      h.onload = () => {
        this._createNewPlan(i.name, a, h.width, h.height);
      }, h.onerror = () => this._setError("The selected image could not be decoded."), h.src = a;
    }, n.onerror = () => this._setError("The selected image could not be read."), n.readAsDataURL(i);
  }
  _createNewPlan(t, e, i, n) {
    if (!this._canEdit || !this._config) return;
    const s = this._newId("plan"), r = {
      plan_id: s,
      name: t.replace(/\.[^.]+$/, ""),
      background: { type: "image", url: e, width: i, height: n },
      areas: [],
      markers: [],
      view: { minZoom: 0.1, maxZoom: 5 }
    };
    this._config = {
      ...this._config,
      plans: [...this._config.plans, r]
    }, this._currentPlanId = s, this.saveConfig(), this._renderFloorplan();
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
    var u, _, p, g, d;
    const t = [
      { id: "all", name: "All", filters: {} },
      { id: "heating", name: "Heating", filters: { tags: ["heating"] } },
      { id: "lights", name: "Lights", filters: { domains: ["light", "switch"] } },
      { id: "network", name: "Network", filters: { tags: ["network"] } }
    ], e = (u = this._config) != null && u.views.length ? this._config.views : t, i = ((_ = this._config) == null ? void 0 : _.plans) ?? [], n = this._getCurrentPlan(), s = this._getCurrentView(), r = this._getSelectedArea(), a = this._getSelectedMarker(), h = this._entitySearch.trim().toLowerCase(), l = this._haEntities.filter((m) => {
      var y;
      return h ? m.entity_id.toLowerCase().includes(h) || ((y = m.name) == null ? void 0 : y.toLowerCase().includes(h)) : !0;
    }).slice(0, 250);
    return _t`
      <div class="container">
        <div class="toolbar">
          <div class="toolbar-left">
            <h1>Floorplan</h1>
            <div class="plan-select">
              <span>Plan:</span>
              <select @change=${this._selectPlan} .value=${(n == null ? void 0 : n.plan_id) ?? ""}>
                <option value="">${i.length === 0 ? "No plans" : "Select plan"}</option>
                ${i.map((m) => _t`<option value=${m.plan_id}>${m.name}</option>`)}
              </select>
            </div>
            <div class="view-tabs">
              ${e.map(
      (m) => _t`
                  <button
                    class="view-tab ${this._currentView === m.id ? "active" : ""}"
                    @click=${() => this._setView(m.id)}
                  >
                    ${m.name}
                  </button>
                `
    )}
            </div>
          </div>
          <div class="toolbar-right">
            ${this._canEdit ? _t`
                  <button
                    class="edit-toggle ${this._editMode ? "active" : ""}"
                    @click=${this._toggleEditMode}
                  >
                    ${this._editMode ? "Done" : "Edit"}
                  </button>
                ` : _t`<span class="viewer-note">View only</span>`}
          </div>
        </div>

        ${this._notice ? _t`<div class="status">${this._notice}</div>` : ""}
        ${this._error ? _t`<div class="status error">${this._error}</div>` : ""}
        ${this._editMode ? _t`
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
                <button ?disabled=${this._currentView === "all"} @click=${this._deleteCurrentView}>
                  Delete View
                </button>
              </div>
              <div class="edit-toolbar">
                <label>
                  Search entity:
                  <input
                    class="grow"
                    type="search"
                    .value=${this._entitySearch}
                    @input=${(m) => this._entitySearch = m.target.value}
                    placeholder="light.kitchen"
                  />
                </label>
                <select
                  class="grow"
                  .value=${this._entityToAdd}
                  @change=${(m) => this._entityToAdd = m.target.value}
                >
                  <option value="">Select entity (${this._haEntities.length})</option>
                  ${l.map(
      (m) => _t`
                      <option value=${m.entity_id}>
                        ${m.entity_id}${m.name ? ` — ${m.name}` : ""}
                      </option>
                    `
    )}
                </select>
                <button ?disabled=${!n || !this._entityToAdd} @click=${this._addMarker}>
                  + Marker
                </button>
              </div>
              <div class="edit-toolbar">
                <strong>View “${(s == null ? void 0 : s.name) ?? this._currentView}” filters:</strong>
                <label>
                  Domains:
                  <input
                    .value=${((p = s == null ? void 0 : s.filters.domains) == null ? void 0 : p.join(", ")) ?? ""}
                    @change=${(m) => this._updateViewFilter("domains", m)}
                    placeholder="light, switch"
                  />
                </label>
                <label>
                  Tags:
                  <input
                    .value=${((g = s == null ? void 0 : s.filters.tags) == null ? void 0 : g.join(", ")) ?? ""}
                    @change=${(m) => this._updateViewFilter("tags", m)}
                    placeholder="heating"
                  />
                </label>
                <label>
                  Area IDs:
                  <input
                    .value=${((d = s == null ? void 0 : s.filters.area_ids) == null ? void 0 : d.join(", ")) ?? ""}
                    @change=${(m) => this._updateViewFilter("area_ids", m)}
                    placeholder="living_room"
                  />
                </label>
              </div>
              ${r ? _t`
                    <div class="edit-toolbar">
                      <span>Selected area:</span>
                      <strong>${r.id}</strong>
                      <label>
                        HA Area:
                        <select
                          @change=${this._onBindAreaChange}
                          .value=${r.area_id ?? ""}
                        >
                          <option value="">Unbound</option>
                          ${this._haAreas.map(
      (m) => _t`<option value=${m.id}>${m.name}</option>`
    )}
                        </select>
                      </label>
                      <button @click=${this._deleteSelectedArea}>Delete Area</button>
                    </div>
                  ` : ""}
              ${a ? _t`
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

        <div class="canvas-container">
          ${this._loading ? _t`<div class="loading">Loading...</div>` : _t`<div class="canvas-wrapper"></div>`}
        </div>
      </div>
    `;
  }
};
zn.styles = Ar`
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

    .file-input {
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
let lt = zn;
gt([
  ai({ attribute: !1 })
], lt.prototype, "hass");
gt([
  ai({ type: Boolean })
], lt.prototype, "narrow");
gt([
  ai({ type: Object })
], lt.prototype, "panel");
gt([
  mt()
], lt.prototype, "_config");
gt([
  mt()
], lt.prototype, "_loading");
gt([
  mt()
], lt.prototype, "_editMode");
gt([
  mt()
], lt.prototype, "_currentView");
gt([
  mt()
], lt.prototype, "_currentPlanId");
gt([
  mt()
], lt.prototype, "_selectedAreaId");
gt([
  mt()
], lt.prototype, "_selectedMarkerId");
gt([
  mt()
], lt.prototype, "_haAreas");
gt([
  mt()
], lt.prototype, "_haEntities");
gt([
  mt()
], lt.prototype, "_entityToAdd");
gt([
  mt()
], lt.prototype, "_entitySearch");
gt([
  mt()
], lt.prototype, "_notice");
gt([
  mt()
], lt.prototype, "_error");
customElements.get("floorplan-ui-panel") || customElements.define("floorplan-ui-panel", lt);
console.info("%c FLOORPLAN-UI %c loaded ", "background: #3498db; color: white", "");

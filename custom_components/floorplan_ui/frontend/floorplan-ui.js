/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ze = globalThis, kn = Ze.ShadowRoot && (Ze.ShadyCSS === void 0 || Ze.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Pn = Symbol(), Kn = /* @__PURE__ */ new WeakMap();
let Vr = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Pn) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (kn && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Kn.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Kn.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ds = (s) => new Vr(typeof s == "string" ? s : s + "", void 0, Pn), Hr = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, n, r) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s[r + 1], s[0]);
  return new Vr(e, s, Pn);
}, Is = (s, t) => {
  if (kn) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), n = Ze.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = e.cssText, s.appendChild(i);
  }
}, qn = kn ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Ds(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Us, defineProperty: Bs, getOwnPropertyDescriptor: Vs, getOwnPropertyNames: Hs, getOwnPropertySymbols: zs, getPrototypeOf: Ws } = Object, It = globalThis, Qn = It.trustedTypes, js = Qn ? Qn.emptyScript : "", tn = It.reactiveElementPolyfillSupport, Fe = (s, t) => s, ii = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? js : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, En = (s, t) => !Us(s, t), Jn = { attribute: !0, type: String, converter: ii, reflect: !1, useDefault: !1, hasChanged: En };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), It.litPropertyMetadata ?? (It.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let ge = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Jn) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(t, i, e);
      n !== void 0 && Bs(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: n, set: r } = Vs(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: n, set(a) {
      const o = n == null ? void 0 : n.call(this);
      r == null || r.call(this, a), this.requestUpdate(t, o, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Jn;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Fe("elementProperties"))) return;
    const t = Ws(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Fe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Fe("properties"))) {
      const e = this.properties, i = [...Hs(e), ...zs(e)];
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
      for (const n of i) e.unshift(qn(n));
    } else t !== void 0 && e.push(qn(t));
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
    return Is(t, this.constructor.elementStyles), t;
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
      const a = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : ii).toAttribute(e, i.type);
      this._$Em = t, a == null ? this.removeAttribute(n) : this.setAttribute(n, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, a;
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = i.getPropertyOptions(n), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((r = o.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? o.converter : ii;
      this._$Em = n;
      const h = l.fromAttribute(e, o.type);
      this[n] = h ?? ((a = this._$Ej) == null ? void 0 : a.get(n)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, n = !1, r) {
    var a;
    if (t !== void 0) {
      const o = this.constructor;
      if (n === !1 && (r = this[t]), i ?? (i = o.getPropertyOptions(t)), !((i.hasChanged ?? En)(r, e) || i.useDefault && i.reflect && r === ((a = this._$Ej) == null ? void 0 : a.get(t)) && !this.hasAttribute(o._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: n, wrapped: r }, a) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), r !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [r, a] of this._$Ep) this[r] = a;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [r, a] of n) {
        const { wrapped: o } = a, l = this[r];
        o !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, a, l);
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
ge.elementStyles = [], ge.shadowRootOptions = { mode: "open" }, ge[Fe("elementProperties")] = /* @__PURE__ */ new Map(), ge[Fe("finalized")] = /* @__PURE__ */ new Map(), tn == null || tn({ ReactiveElement: ge }), (It.reactiveElementVersions ?? (It.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Oe = globalThis, Zn = (s) => s, ni = Oe.trustedTypes, tr = ni ? ni.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, zr = "$lit$", Dt = `lit$${Math.random().toFixed(9).slice(2)}$`, Wr = "?" + Dt, Ys = `<${Wr}>`, Jt = document, Ne = () => Jt.createComment(""), Le = (s) => s === null || typeof s != "object" && typeof s != "function", Mn = Array.isArray, Xs = (s) => Mn(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", en = `[ 	
\f\r]`, Ee = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, er = /-->/g, ir = />/g, Yt = RegExp(`>|${en}(?:([^\\s"'>=/]+)(${en}*=${en}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), nr = /'/g, rr = /"/g, jr = /^(?:script|style|textarea|title)$/i, Ks = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), Q = Ks(1), _e = Symbol.for("lit-noChange"), dt = Symbol.for("lit-nothing"), sr = /* @__PURE__ */ new WeakMap(), qt = Jt.createTreeWalker(Jt, 129);
function Yr(s, t) {
  if (!Mn(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return tr !== void 0 ? tr.createHTML(t) : t;
}
const qs = (s, t) => {
  const e = s.length - 1, i = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = Ee;
  for (let o = 0; o < e; o++) {
    const l = s[o];
    let h, c, _ = -1, p = 0;
    for (; p < l.length && (a.lastIndex = p, c = a.exec(l), c !== null); ) p = a.lastIndex, a === Ee ? c[1] === "!--" ? a = er : c[1] !== void 0 ? a = ir : c[2] !== void 0 ? (jr.test(c[2]) && (n = RegExp("</" + c[2], "g")), a = Yt) : c[3] !== void 0 && (a = Yt) : a === Yt ? c[0] === ">" ? (a = n ?? Ee, _ = -1) : c[1] === void 0 ? _ = -2 : (_ = a.lastIndex - c[2].length, h = c[1], a = c[3] === void 0 ? Yt : c[3] === '"' ? rr : nr) : a === rr || a === nr ? a = Yt : a === er || a === ir ? a = Ee : (a = Yt, n = void 0);
    const g = a === Yt && s[o + 1].startsWith("/>") ? " " : "";
    r += a === Ee ? l + Ys : _ >= 0 ? (i.push(h), l.slice(0, _) + zr + l.slice(_) + Dt + g) : l + Dt + (_ === -2 ? o : g);
  }
  return [Yr(s, r + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class $e {
  constructor({ strings: t, _$litType$: e }, i) {
    let n;
    this.parts = [];
    let r = 0, a = 0;
    const o = t.length - 1, l = this.parts, [h, c] = qs(t, e);
    if (this.el = $e.createElement(h, i), qt.currentNode = this.el.content, e === 2 || e === 3) {
      const _ = this.el.content.firstChild;
      _.replaceWith(..._.childNodes);
    }
    for (; (n = qt.nextNode()) !== null && l.length < o; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const _ of n.getAttributeNames()) if (_.endsWith(zr)) {
          const p = c[a++], g = n.getAttribute(_).split(Dt), u = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: r, name: u[2], strings: g, ctor: u[1] === "." ? Js : u[1] === "?" ? Zs : u[1] === "@" ? ta : li }), n.removeAttribute(_);
        } else _.startsWith(Dt) && (l.push({ type: 6, index: r }), n.removeAttribute(_));
        if (jr.test(n.tagName)) {
          const _ = n.textContent.split(Dt), p = _.length - 1;
          if (p > 0) {
            n.textContent = ni ? ni.emptyScript : "";
            for (let g = 0; g < p; g++) n.append(_[g], Ne()), qt.nextNode(), l.push({ type: 2, index: ++r });
            n.append(_[p], Ne());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Wr) l.push({ type: 2, index: r });
      else {
        let _ = -1;
        for (; (_ = n.data.indexOf(Dt, _ + 1)) !== -1; ) l.push({ type: 7, index: r }), _ += Dt.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = Jt.createElement("template");
    return i.innerHTML = t, i;
  }
}
function me(s, t, e = s, i) {
  var a, o;
  if (t === _e) return t;
  let n = i !== void 0 ? (a = e._$Co) == null ? void 0 : a[i] : e._$Cl;
  const r = Le(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== r && ((o = n == null ? void 0 : n._$AO) == null || o.call(n, !1), r === void 0 ? n = void 0 : (n = new r(s), n._$AT(s, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = n : e._$Cl = n), n !== void 0 && (t = me(s, n._$AS(s, t.values), n, i)), t;
}
class Qs {
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
    let r = qt.nextNode(), a = 0, o = 0, l = i[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let h;
        l.type === 2 ? h = new Ue(r, r.nextSibling, this, t) : l.type === 1 ? h = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (h = new ea(r, this, t)), this._$AV.push(h), l = i[++o];
      }
      a !== (l == null ? void 0 : l.index) && (r = qt.nextNode(), a++);
    }
    return qt.currentNode = Jt, n;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class Ue {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, n) {
    this.type = 2, this._$AH = dt, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
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
    t = me(this, t, e), Le(t) ? t === dt || t == null || t === "" ? (this._$AH !== dt && this._$AR(), this._$AH = dt) : t !== this._$AH && t !== _e && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Xs(t) ? this.k(t) : this._(t);
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
    var r;
    const { values: e, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = $e.createElement(Yr(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === n) this._$AH.p(e);
    else {
      const a = new Qs(n, this), o = a.u(this.options);
      a.p(e), this.T(o), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = sr.get(t.strings);
    return e === void 0 && sr.set(t.strings, e = new $e(t)), e;
  }
  k(t) {
    Mn(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, n = 0;
    for (const r of t) n === e.length ? e.push(i = new Ue(this.O(Ne()), this.O(Ne()), this, this.options)) : i = e[n], i._$AI(r), n++;
    n < e.length && (this._$AR(i && i._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const n = Zn(t).nextSibling;
      Zn(t).remove(), t = n;
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
  constructor(t, e, i, n, r) {
    this.type = 1, this._$AH = dt, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = dt;
  }
  _$AI(t, e = this, i, n) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) t = me(this, t, e, 0), a = !Le(t) || t !== this._$AH && t !== _e, a && (this._$AH = t);
    else {
      const o = t;
      let l, h;
      for (t = r[0], l = 0; l < r.length - 1; l++) h = me(this, o[i + l], e, l), h === _e && (h = this._$AH[l]), a || (a = !Le(h) || h !== this._$AH[l]), h === dt ? t = dt : t !== dt && (t += (h ?? "") + r[l + 1]), this._$AH[l] = h;
    }
    a && !n && this.j(t);
  }
  j(t) {
    t === dt ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Js extends li {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === dt ? void 0 : t;
  }
}
class Zs extends li {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== dt);
  }
}
class ta extends li {
  constructor(t, e, i, n, r) {
    super(t, e, i, n, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = me(this, t, e, 0) ?? dt) === _e) return;
    const i = this._$AH, n = t === dt && i !== dt || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== dt && (i === dt || n);
    n && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ea {
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
const nn = Oe.litHtmlPolyfillSupport;
nn == null || nn($e, Ue), (Oe.litHtmlVersions ?? (Oe.litHtmlVersions = [])).push("3.3.2");
const ia = (s, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let n = i._$litPart$;
  if (n === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = n = new Ue(t.insertBefore(Ne(), r), r, void 0, e ?? {});
  }
  return n._$AI(s), n;
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ia(e, this.renderRoot, this.renderOptions);
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
var Br;
pe._$litElement$ = !0, pe.finalized = !0, (Br = Qt.litElementHydrateSupport) == null || Br.call(Qt, { LitElement: pe });
const rn = Qt.litElementPolyfillSupport;
rn == null || rn({ LitElement: pe });
(Qt.litElementVersions ?? (Qt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const na = { attribute: !0, type: String, converter: ii, reflect: !1, hasChanged: En }, ra = (s = na, t, e) => {
  const { kind: i, metadata: n } = e;
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), r.set(e.name, s), i === "accessor") {
    const { name: a } = e;
    return { set(o) {
      const l = t.get.call(this);
      t.set.call(this, o), this.requestUpdate(a, l, s, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(a, void 0, s, o), o;
    } };
  }
  if (i === "setter") {
    const { name: a } = e;
    return function(o) {
      const l = this[a];
      t.call(this, o), this.requestUpdate(a, l, s, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Be(s) {
  return (t, e) => typeof e == "object" ? ra(s, t, e) : ((i, n, r) => {
    const a = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, i), a ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ut(s) {
  return Be({ ...s, state: !0, attribute: !1 });
}
var ar = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function sa(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var Tn = { exports: {} }, hi = {}, Xr = {}, U = {};
(function(s) {
  Object.defineProperty(s, "__esModule", { value: !0 }), s._registerNode = s.Konva = s.glob = void 0;
  const t = Math.PI / 180;
  function e() {
    return typeof window < "u" && ({}.toString.call(window) === "[object Window]" || {}.toString.call(window) === "[object global]");
  }
  s.glob = typeof ar < "u" ? ar : typeof window < "u" ? window : typeof WorkerGlobalScope < "u" ? self : {}, s.Konva = {
    _global: s.glob,
    version: "9.3.22",
    isBrowser: e(),
    isUnminified: /param/.test((function(n) {
    }).toString()),
    dblClickWindow: 400,
    getAngle(n) {
      return s.Konva.angleDeg ? n * t : n;
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
      return s.Konva.DD.isDragging;
    },
    isTransforming() {
      var n;
      return (n = s.Konva.Transformer) === null || n === void 0 ? void 0 : n.isTransforming();
    },
    isDragReady() {
      return !!s.Konva.DD.node;
    },
    releaseCanvasOnDestroy: !0,
    document: s.glob.document,
    _injectGlobal(n) {
      s.glob.Konva = n;
    }
  };
  const i = (n) => {
    s.Konva[n.prototype.getClassName()] = n;
  };
  s._registerNode = i, s.Konva._injectGlobal(s.Konva);
})(U);
var st = {};
(function(s) {
  Object.defineProperty(s, "__esModule", { value: !0 }), s.Util = s.Transform = void 0;
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
      const f = this.m[0], b = this.m[1], x = this.m[2], P = this.m[3], v = this.m[4], E = this.m[5], A = f * P - b * x, M = {
        x: v,
        y: E,
        rotation: 0,
        scaleX: 0,
        scaleY: 0,
        skewX: 0,
        skewY: 0
      };
      if (f != 0 || b != 0) {
        const k = Math.sqrt(f * f + b * b);
        M.rotation = b > 0 ? Math.acos(f / k) : -Math.acos(f / k), M.scaleX = k, M.scaleY = A / k, M.skewX = (f * x + b * P) / A, M.skewY = 0;
      } else if (x != 0 || P != 0) {
        const k = Math.sqrt(x * x + P * P);
        M.rotation = Math.PI / 2 - (P > 0 ? Math.acos(-x / k) : -Math.acos(x / k)), M.scaleX = A / k, M.scaleY = k, M.skewX = 0, M.skewY = (f * x + b * P) / A;
      }
      return M.rotation = s.Util._getRotation(M.rotation), M;
    }
  }
  s.Transform = e;
  const i = "[object Array]", n = "[object Number]", r = "[object String]", a = "[object Boolean]", o = Math.PI / 180, l = 180 / Math.PI, h = "#", c = "", _ = "0", p = "Konva warning: ", g = "Konva error: ", u = "rgb(", m = {
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
  const w = typeof requestAnimationFrame < "u" && requestAnimationFrame || function(d) {
    setTimeout(d, 60);
  };
  s.Util = {
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
      return Object.prototype.toString.call(d) === n && !isNaN(d) && isFinite(d);
    },
    _isString(d) {
      return Object.prototype.toString.call(d) === r;
    },
    _isBoolean(d) {
      return Object.prototype.toString.call(d) === a;
    },
    isObject(d) {
      return d instanceof Object;
    },
    isValidSelector(d) {
      if (typeof d != "string")
        return !1;
      const f = d[0];
      return f === "#" || f === "." || f === f.toUpperCase();
    },
    _sign(d) {
      return d === 0 || d > 0 ? 1 : -1;
    },
    requestAnimFrame(d) {
      S.push(d), S.length === 1 && w(function() {
        const f = S;
        S = [], f.forEach(function(b) {
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
    _urlToImage(d, f) {
      const b = s.Util.createImageElement();
      b.onload = function() {
        f(b);
      }, b.src = d;
    },
    _rgbToHex(d, f, b) {
      return ((1 << 24) + (d << 16) + (f << 8) + b).toString(16).slice(1);
    },
    _hexToRgb(d) {
      d = d.replace(h, c);
      const f = parseInt(d, 16);
      return {
        r: f >> 16 & 255,
        g: f >> 8 & 255,
        b: f & 255
      };
    },
    getRandomColor() {
      let d = (Math.random() * 16777215 << 0).toString(16);
      for (; d.length < 6; )
        d = _ + d;
      return h + d;
    },
    getRGB(d) {
      let f;
      return d in m ? (f = m[d], {
        r: f[0],
        g: f[1],
        b: f[2]
      }) : d[0] === h ? this._hexToRgb(d.substring(1)) : d.substr(0, 4) === u ? (f = y.exec(d.replace(/ /g, "")), {
        r: parseInt(f[1], 10),
        g: parseInt(f[2], 10),
        b: parseInt(f[3], 10)
      }) : {
        r: 0,
        g: 0,
        b: 0
      };
    },
    colorToRGBA(d) {
      return d = d || "black", s.Util._namedColorToRBA(d) || s.Util._hex3ColorToRGBA(d) || s.Util._hex4ColorToRGBA(d) || s.Util._hex6ColorToRGBA(d) || s.Util._hex8ColorToRGBA(d) || s.Util._rgbColorToRGBA(d) || s.Util._rgbaColorToRGBA(d) || s.Util._hslColorToRGBA(d);
    },
    _namedColorToRBA(d) {
      const f = m[d.toLowerCase()];
      return f ? {
        r: f[0],
        g: f[1],
        b: f[2],
        a: 1
      } : null;
    },
    _rgbColorToRGBA(d) {
      if (d.indexOf("rgb(") === 0) {
        d = d.match(/rgb\(([^)]+)\)/)[1];
        const f = d.split(/ *, */).map(Number);
        return {
          r: f[0],
          g: f[1],
          b: f[2],
          a: 1
        };
      }
    },
    _rgbaColorToRGBA(d) {
      if (d.indexOf("rgba(") === 0) {
        d = d.match(/rgba\(([^)]+)\)/)[1];
        const f = d.split(/ *, */).map((b, x) => b.slice(-1) === "%" ? x === 3 ? parseInt(b) / 100 : parseInt(b) / 100 * 255 : Number(b));
        return {
          r: f[0],
          g: f[1],
          b: f[2],
          a: f[3]
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
        const [f, ...b] = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(d), x = Number(b[0]) / 360, P = Number(b[1]) / 100, v = Number(b[2]) / 100;
        let E, A, M;
        if (P === 0)
          return M = v * 255, {
            r: Math.round(M),
            g: Math.round(M),
            b: Math.round(M),
            a: 1
          };
        v < 0.5 ? E = v * (1 + P) : E = v + P - v * P;
        const k = 2 * v - E, R = [0, 0, 0];
        for (let L = 0; L < 3; L++)
          A = x + 1 / 3 * -(L - 1), A < 0 && A++, A > 1 && A--, 6 * A < 1 ? M = k + (E - k) * 6 * A : 2 * A < 1 ? M = E : 3 * A < 2 ? M = k + (E - k) * (2 / 3 - A) * 6 : M = k, R[L] = M * 255;
        return {
          r: Math.round(R[0]),
          g: Math.round(R[1]),
          b: Math.round(R[2]),
          a: 1
        };
      }
    },
    haveIntersection(d, f) {
      return !(f.x > d.x + d.width || f.x + f.width < d.x || f.y > d.y + d.height || f.y + f.height < d.y);
    },
    cloneObject(d) {
      const f = {};
      for (const b in d)
        this._isPlainObject(d[b]) ? f[b] = this.cloneObject(d[b]) : this._isArray(d[b]) ? f[b] = this.cloneArray(d[b]) : f[b] = d[b];
      return f;
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
      return s.Util.warn("Util._degToRad is removed. Please use public Util.degToRad instead."), s.Util.degToRad(d);
    },
    _radToDeg(d) {
      return s.Util.warn("Util._radToDeg is removed. Please use public Util.radToDeg instead."), s.Util.radToDeg(d);
    },
    _getRotation(d) {
      return t.Konva.angleDeg ? s.Util.radToDeg(d) : d;
    },
    _capitalize(d) {
      return d.charAt(0).toUpperCase() + d.slice(1);
    },
    throw(d) {
      throw new Error(g + d);
    },
    error(d) {
    },
    warn(d) {
      t.Konva.showWarnings;
    },
    each(d, f) {
      for (const b in d)
        f(b, d[b]);
    },
    _inRange(d, f, b) {
      return f <= d && d < b;
    },
    _getProjectionToSegment(d, f, b, x, P, v) {
      let E, A, M;
      const k = (d - b) * (d - b) + (f - x) * (f - x);
      if (k == 0)
        E = d, A = f, M = (P - b) * (P - b) + (v - x) * (v - x);
      else {
        const R = ((P - d) * (b - d) + (v - f) * (x - f)) / k;
        R < 0 ? (E = d, A = f, M = (d - P) * (d - P) + (f - v) * (f - v)) : R > 1 ? (E = b, A = x, M = (b - P) * (b - P) + (x - v) * (x - v)) : (E = d + R * (b - d), A = f + R * (x - f), M = (E - P) * (E - P) + (A - v) * (A - v));
      }
      return [E, A, M];
    },
    _getProjectionToLine(d, f, b) {
      const x = s.Util.cloneObject(d);
      let P = Number.MAX_VALUE;
      return f.forEach(function(v, E) {
        if (!b && E === f.length - 1)
          return;
        const A = f[(E + 1) % f.length], M = s.Util._getProjectionToSegment(v.x, v.y, A.x, A.y, d.x, d.y), k = M[0], R = M[1], L = M[2];
        L < P && (x.x = k, x.y = R, P = L);
      }), x;
    },
    _prepareArrayForTween(d, f, b) {
      const x = [], P = [];
      if (d.length > f.length) {
        const E = f;
        f = d, d = E;
      }
      for (let E = 0; E < d.length; E += 2)
        x.push({
          x: d[E],
          y: d[E + 1]
        });
      for (let E = 0; E < f.length; E += 2)
        P.push({
          x: f[E],
          y: f[E + 1]
        });
      const v = [];
      return P.forEach(function(E) {
        const A = s.Util._getProjectionToLine(E, x, b);
        v.push(A.x), v.push(A.y);
      }), v;
    },
    _prepareToStringify(d) {
      let f;
      d.visitedByCircularReferenceRemoval = !0;
      for (const b in d)
        if (d.hasOwnProperty(b) && d[b] && typeof d[b] == "object") {
          if (f = Object.getOwnPropertyDescriptor(d, b), d[b].visitedByCircularReferenceRemoval || s.Util._isElement(d[b]))
            if (f.configurable)
              delete d[b];
            else
              return null;
          else if (s.Util._prepareToStringify(d[b]) === null)
            if (f.configurable)
              delete d[b];
            else
              return null;
        }
      return delete d.visitedByCircularReferenceRemoval, d;
    },
    _assign(d, f) {
      for (const b in f)
        d[b] = f[b];
      return d;
    },
    _getFirstPointerId(d) {
      return d.touches ? d.changedTouches[0].identifier : d.pointerId || 999;
    },
    releaseCanvas(...d) {
      t.Konva.releaseCanvasOnDestroy && d.forEach((f) => {
        f.width = 0, f.height = 0;
      });
    },
    drawRoundedRectPath(d, f, b, x) {
      let P = 0, v = 0, E = 0, A = 0;
      typeof x == "number" ? P = v = E = A = Math.min(x, f / 2, b / 2) : (P = Math.min(x[0] || 0, f / 2, b / 2), v = Math.min(x[1] || 0, f / 2, b / 2), A = Math.min(x[2] || 0, f / 2, b / 2), E = Math.min(x[3] || 0, f / 2, b / 2)), d.moveTo(P, 0), d.lineTo(f - v, 0), d.arc(f - v, v, v, Math.PI * 3 / 2, 0, !1), d.lineTo(f, b - A), d.arc(f - A, b - A, A, 0, Math.PI / 2, !1), d.lineTo(E, b), d.arc(E, b - E, E, Math.PI / 2, Math.PI, !1), d.lineTo(0, P), d.arc(P, P, P, Math.PI, Math.PI * 3 / 2, !1);
    }
  };
})(st);
var nt = {}, St = {}, Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.HitContext = Tt.SceneContext = Tt.Context = void 0;
const Kr = st, aa = U;
function oa(s) {
  const t = [], e = s.length, i = Kr.Util;
  for (let n = 0; n < e; n++) {
    let r = s[n];
    i._isNumber(r) ? r = Math.round(r * 1e3) / 1e3 : i._isString(r) || (r = r + ""), t.push(r);
  }
  return t;
}
const or = ",", la = "(", ha = ")", da = "([", ca = "])", ua = ";", fa = "()", ga = "=", lr = [
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
], pa = [
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
], _a = 100;
class di {
  constructor(t) {
    this.canvas = t, aa.Konva.enableTrace && (this.traceArr = [], this._enableTrace());
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
    let i = this.traceArr, n = i.length, r = "", a, o, l, h;
    for (a = 0; a < n; a++)
      o = i[a], l = o.method, l ? (h = o.args, r += l, t ? r += fa : Kr.Util._isArray(h[0]) ? r += da + h.join(or) + ca : (e && (h = h.map((c) => typeof c == "number" ? Math.floor(c) : c)), r += la + h.join(or) + ha)) : (r += o.property, t || (r += ga + o.val)), r += ua;
    return r;
  }
  clearTrace() {
    this.traceArr = [];
  }
  _trace(t) {
    let e = this.traceArr, i;
    e.push(t), i = e.length, i >= _a && e.shift();
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
  arc(t, e, i, n, r, a) {
    this._context.arc(t, e, i, n, r, a);
  }
  arcTo(t, e, i, n, r) {
    this._context.arcTo(t, e, i, n, r);
  }
  beginPath() {
    this._context.beginPath();
  }
  bezierCurveTo(t, e, i, n, r, a) {
    this._context.bezierCurveTo(t, e, i, n, r, a);
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
  createRadialGradient(t, e, i, n, r, a) {
    return this._context.createRadialGradient(t, e, i, n, r, a);
  }
  drawImage(t, e, i, n, r, a, o, l, h) {
    const c = arguments, _ = this._context;
    c.length === 3 ? _.drawImage(t, e, i) : c.length === 5 ? _.drawImage(t, e, i, n, r) : c.length === 9 && _.drawImage(t, e, i, n, r, a, o, l, h);
  }
  ellipse(t, e, i, n, r, a, o, l) {
    this._context.ellipse(t, e, i, n, r, a, o, l);
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
  setTransform(t, e, i, n, r, a) {
    this._context.setTransform(t, e, i, n, r, a);
  }
  stroke(t) {
    t ? this._context.stroke(t) : this._context.stroke();
  }
  strokeText(t, e, i, n) {
    this._context.strokeText(t, e, i, n);
  }
  transform(t, e, i, n, r, a) {
    this._context.transform(t, e, i, n, r, a);
  }
  translate(t, e) {
    this._context.translate(t, e);
  }
  _enableTrace() {
    let t = this, e = lr.length, i = this.setAttr, n, r;
    const a = function(o) {
      let l = t[o], h;
      t[o] = function() {
        return r = oa(Array.prototype.slice.call(arguments, 0)), h = l.apply(t, arguments), t._trace({
          method: o,
          args: r
        }), h;
      };
    };
    for (n = 0; n < e; n++)
      a(lr[n]);
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
pa.forEach(function(s) {
  Object.defineProperty(di.prototype, s, {
    get() {
      return this._context[s];
    },
    set(t) {
      this._context[s] = t;
    }
  });
});
class ma extends di {
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
    const a = t.getFillRadialGradientColorStops();
    if (a && i === "radial-gradient") {
      this._fillRadialGradient(t);
      return;
    }
    e ? this._fillColor(t) : n ? this._fillPattern(t) : r ? this._fillLinearGradient(t) : a && this._fillRadialGradient(t);
  }
  _strokeLinearGradient(t) {
    const e = t.getStrokeLinearGradientStartPoint(), i = t.getStrokeLinearGradientEndPoint(), n = t.getStrokeLinearGradientColorStops(), r = this.createLinearGradient(e.x, e.y, i.x, i.y);
    if (n) {
      for (let a = 0; a < n.length; a += 2)
        r.addColorStop(n[a], n[a + 1]);
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
    const r = (e = t.getShadowRGBA()) !== null && e !== void 0 ? e : "black", a = (i = t.getShadowBlur()) !== null && i !== void 0 ? i : 5, o = (n = t.getShadowOffset()) !== null && n !== void 0 ? n : {
      x: 0,
      y: 0
    }, l = t.getAbsoluteScale(), h = this.canvas.getPixelRatio(), c = l.x * h, _ = l.y * h;
    this.setAttr("shadowColor", r), this.setAttr("shadowBlur", a * Math.min(Math.abs(c), Math.abs(_))), this.setAttr("shadowOffsetX", o.x * c), this.setAttr("shadowOffsetY", o.y * _);
  }
}
Tt.SceneContext = ma;
class ya extends di {
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
Tt.HitContext = ya;
Object.defineProperty(St, "__esModule", { value: !0 });
St.HitCanvas = St.SceneCanvas = St.Canvas = void 0;
const ri = st, qr = Tt, Qr = U;
let Ye;
function ba() {
  if (Ye)
    return Ye;
  const s = ri.Util.createCanvasElement(), t = s.getContext("2d");
  return Ye = function() {
    const e = Qr.Konva._global.devicePixelRatio || 1, i = t.webkitBackingStorePixelRatio || t.mozBackingStorePixelRatio || t.msBackingStorePixelRatio || t.oBackingStorePixelRatio || t.backingStorePixelRatio || 1;
    return e / i;
  }(), ri.Util.releaseCanvas(s), Ye;
}
class Rn {
  constructor(t) {
    this.pixelRatio = 1, this.width = 0, this.height = 0, this.isCache = !1;
    const i = (t || {}).pixelRatio || Qr.Konva.pixelRatio || ba();
    this.pixelRatio = i, this._canvas = ri.Util.createCanvasElement(), this._canvas.style.padding = "0", this._canvas.style.margin = "0", this._canvas.style.border = "0", this._canvas.style.background = "transparent", this._canvas.style.position = "absolute", this._canvas.style.top = "0", this._canvas.style.left = "0";
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
        return ri.Util.error("Unable to get data URL. " + n.message + " For more info read https://konvajs.org/docs/posts/Tainted_Canvas.html."), "";
      }
    }
  }
}
St.Canvas = Rn;
class va extends Rn {
  constructor(t = { width: 0, height: 0, willReadFrequently: !1 }) {
    super(t), this.context = new qr.SceneContext(this, {
      willReadFrequently: t.willReadFrequently
    }), this.setSize(t.width, t.height);
  }
}
St.SceneCanvas = va;
class Sa extends Rn {
  constructor(t = { width: 0, height: 0 }) {
    super(t), this.hitCanvas = !0, this.context = new qr.HitContext(this), this.setSize(t.width, t.height);
  }
}
St.HitCanvas = Sa;
var ci = {};
(function(s) {
  Object.defineProperty(s, "__esModule", { value: !0 }), s.DD = void 0;
  const t = U, e = st;
  s.DD = {
    get isDragging() {
      let i = !1;
      return s.DD._dragElements.forEach((n) => {
        n.dragStatus === "dragging" && (i = !0);
      }), i;
    },
    justDragged: !1,
    get node() {
      let i;
      return s.DD._dragElements.forEach((n) => {
        i = n.node;
      }), i;
    },
    _dragElements: /* @__PURE__ */ new Map(),
    _drag(i) {
      const n = [];
      s.DD._dragElements.forEach((r, a) => {
        const { node: o } = r, l = o.getStage();
        l.setPointersPositions(i), r.pointerId === void 0 && (r.pointerId = e.Util._getFirstPointerId(i));
        const h = l._changedPointerPositions.find((c) => c.id === r.pointerId);
        if (h) {
          if (r.dragStatus !== "dragging") {
            const c = o.dragDistance();
            if (Math.max(Math.abs(h.x - r.startPointerPos.x), Math.abs(h.y - r.startPointerPos.y)) < c || (o.startDrag({ evt: i }), !o.isDragging()))
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
      s.DD._dragElements.forEach((r) => {
        const { node: a } = r, o = a.getStage();
        if (i && o.setPointersPositions(i), !o._changedPointerPositions.find((c) => c.id === r.pointerId))
          return;
        (r.dragStatus === "dragging" || r.dragStatus === "stopped") && (s.DD.justDragged = !0, t.Konva._mouseListenClick = !1, t.Konva._touchListenClick = !1, t.Konva._pointerListenClick = !1, r.dragStatus = "stopped");
        const h = r.node.getLayer() || r.node instanceof t.Konva.Stage && r.node;
        h && n.indexOf(h) === -1 && n.push(h);
      }), n.forEach((r) => {
        r.draw();
      });
    },
    _endDragAfter(i) {
      s.DD._dragElements.forEach((n, r) => {
        n.dragStatus === "stopped" && n.node.fire("dragend", {
          type: "dragend",
          target: n.node,
          evt: i
        }, !0), n.dragStatus !== "dragging" && s.DD._dragElements.delete(r);
      });
    }
  }, t.Konva.isBrowser && (window.addEventListener("mouseup", s.DD._endDragBefore, !0), window.addEventListener("touchend", s.DD._endDragBefore, !0), window.addEventListener("touchcancel", s.DD._endDragBefore, !0), window.addEventListener("mousemove", s.DD._drag), window.addEventListener("touchmove", s.DD._drag), window.addEventListener("mouseup", s.DD._endDragAfter, !1), window.addEventListener("touchend", s.DD._endDragAfter, !1), window.addEventListener("touchcancel", s.DD._endDragAfter, !1));
})(ci);
var B = {}, G = {};
Object.defineProperty(G, "__esModule", { value: !0 });
G.RGBComponent = Ca;
G.alphaComponent = wa;
G.getNumberValidator = xa;
G.getNumberOrArrayOfNumbersValidator = Aa;
G.getNumberOrAutoValidator = ka;
G.getStringValidator = Pa;
G.getStringOrGradientValidator = Ea;
G.getFunctionValidator = Ma;
G.getNumberArrayValidator = Ta;
G.getBooleanValidator = Ra;
G.getComponentValidator = Fa;
const Rt = U, at = st;
function Ft(s) {
  return at.Util._isString(s) ? '"' + s + '"' : Object.prototype.toString.call(s) === "[object Number]" || at.Util._isBoolean(s) ? s : Object.prototype.toString.call(s);
}
function Ca(s) {
  return s > 255 ? 255 : s < 0 ? 0 : Math.round(s);
}
function wa(s) {
  return s > 1 ? 1 : s < 1e-4 ? 1e-4 : s;
}
function xa() {
  if (Rt.Konva.isUnminified)
    return function(s, t) {
      return at.Util._isNumber(s) || at.Util.warn(Ft(s) + ' is a not valid value for "' + t + '" attribute. The value should be a number.'), s;
    };
}
function Aa(s) {
  if (Rt.Konva.isUnminified)
    return function(t, e) {
      let i = at.Util._isNumber(t), n = at.Util._isArray(t) && t.length == s;
      return !i && !n && at.Util.warn(Ft(t) + ' is a not valid value for "' + e + '" attribute. The value should be a number or Array<number>(' + s + ")"), t;
    };
}
function ka() {
  if (Rt.Konva.isUnminified)
    return function(s, t) {
      return at.Util._isNumber(s) || s === "auto" || at.Util.warn(Ft(s) + ' is a not valid value for "' + t + '" attribute. The value should be a number or "auto".'), s;
    };
}
function Pa() {
  if (Rt.Konva.isUnminified)
    return function(s, t) {
      return at.Util._isString(s) || at.Util.warn(Ft(s) + ' is a not valid value for "' + t + '" attribute. The value should be a string.'), s;
    };
}
function Ea() {
  if (Rt.Konva.isUnminified)
    return function(s, t) {
      const e = at.Util._isString(s), i = Object.prototype.toString.call(s) === "[object CanvasGradient]" || s && s.addColorStop;
      return e || i || at.Util.warn(Ft(s) + ' is a not valid value for "' + t + '" attribute. The value should be a string or a native gradient.'), s;
    };
}
function Ma() {
  if (Rt.Konva.isUnminified)
    return function(s, t) {
      return at.Util._isFunction(s) || at.Util.warn(Ft(s) + ' is a not valid value for "' + t + '" attribute. The value should be a function.'), s;
    };
}
function Ta() {
  if (Rt.Konva.isUnminified)
    return function(s, t) {
      const e = Int8Array ? Object.getPrototypeOf(Int8Array) : null;
      return e && s instanceof e || (at.Util._isArray(s) ? s.forEach(function(i) {
        at.Util._isNumber(i) || at.Util.warn('"' + t + '" attribute has non numeric element ' + i + ". Make sure that all elements are numbers.");
      }) : at.Util.warn(Ft(s) + ' is a not valid value for "' + t + '" attribute. The value should be a array of numbers.')), s;
    };
}
function Ra() {
  if (Rt.Konva.isUnminified)
    return function(s, t) {
      return s === !0 || s === !1 || at.Util.warn(Ft(s) + ' is a not valid value for "' + t + '" attribute. The value should be a boolean.'), s;
    };
}
function Fa(s) {
  if (Rt.Konva.isUnminified)
    return function(t, e) {
      return t == null || at.Util.isObject(t) || at.Util.warn(Ft(t) + ' is a not valid value for "' + e + '" attribute. The value should be an object with properties ' + s), t;
    };
}
(function(s) {
  Object.defineProperty(s, "__esModule", { value: !0 }), s.Factory = void 0;
  const t = st, e = G, i = "get", n = "set";
  s.Factory = {
    addGetterSetter(r, a, o, l, h) {
      s.Factory.addGetter(r, a, o), s.Factory.addSetter(r, a, l, h), s.Factory.addOverloadedGetterSetter(r, a);
    },
    addGetter(r, a, o) {
      const l = i + t.Util._capitalize(a);
      r.prototype[l] = r.prototype[l] || function() {
        const h = this.attrs[a];
        return h === void 0 ? o : h;
      };
    },
    addSetter(r, a, o, l) {
      const h = n + t.Util._capitalize(a);
      r.prototype[h] || s.Factory.overWriteSetter(r, a, o, l);
    },
    overWriteSetter(r, a, o, l) {
      const h = n + t.Util._capitalize(a);
      r.prototype[h] = function(c) {
        return o && c !== void 0 && c !== null && (c = o.call(this, c, a)), this._setAttr(a, c), l && l.call(this), this;
      };
    },
    addComponentsGetterSetter(r, a, o, l, h) {
      const c = o.length, _ = t.Util._capitalize, p = i + _(a), g = n + _(a);
      r.prototype[p] = function() {
        const m = {};
        for (let y = 0; y < c; y++) {
          const S = o[y];
          m[S] = this.getAttr(a + _(S));
        }
        return m;
      };
      const u = (0, e.getComponentValidator)(o);
      r.prototype[g] = function(m) {
        const y = this.attrs[a];
        l && (m = l.call(this, m, a)), u && u.call(this, m, a);
        for (const S in m)
          m.hasOwnProperty(S) && this._setAttr(a + _(S), m[S]);
        return m || o.forEach((S) => {
          this._setAttr(a + _(S), void 0);
        }), this._fireChangeEvent(a, y, m), h && h.call(this), this;
      }, s.Factory.addOverloadedGetterSetter(r, a);
    },
    addOverloadedGetterSetter(r, a) {
      const o = t.Util._capitalize(a), l = n + o, h = i + o;
      r.prototype[a] = function() {
        return arguments.length ? (this[l](arguments[0]), this) : this[h]();
      };
    },
    addDeprecatedGetterSetter(r, a, o, l) {
      t.Util.error("Adding deprecated " + a);
      const h = i + t.Util._capitalize(a), c = a + " property is deprecated and will be removed soon. Look at Konva change log for more information.";
      r.prototype[h] = function() {
        t.Util.error(c);
        const _ = this.attrs[a];
        return _ === void 0 ? o : _;
      }, s.Factory.addSetter(r, a, l, function() {
        t.Util.error(c);
      }), s.Factory.addOverloadedGetterSetter(r, a);
    },
    backCompat(r, a) {
      t.Util.each(a, function(o, l) {
        const h = r.prototype[l], c = i + t.Util._capitalize(o), _ = n + t.Util._capitalize(o);
        function p() {
          h.apply(this, arguments), t.Util.error('"' + o + '" method is deprecated and will be removed soon. Use ""' + l + '" instead.');
        }
        r.prototype[o] = p, r.prototype[c] = p, r.prototype[_] = p;
      });
    },
    afterSetFilter() {
      this._filterUpToDate = !1;
    }
  };
})(B);
Object.defineProperty(nt, "__esModule", { value: !0 });
nt.Node = void 0;
const de = St, bt = ci, Ve = B, $t = U, V = st, ct = G, ti = "absoluteOpacity", Xe = "allEventListeners", Mt = "absoluteTransform", hr = "absoluteScale", Xt = "canvas", Oa = "Change", Na = "children", La = "konva", _n = "listening", $a = "mouseenter", Ga = "mouseleave", Da = "pointerenter", Ia = "pointerleave", Ua = "touchenter", Ba = "touchleave", dr = "set", cr = "Shape", ei = " ", ur = "stage", Gt = "transform", Va = "Stage", mn = "visible", Ha = [
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
let za = 1;
class D {
  constructor(t) {
    this._id = za++, this.eventListeners = {}, this.attrs = {}, this.index = 0, this._allEventListeners = null, this.parent = null, this._cache = /* @__PURE__ */ new Map(), this._attachedDepsListeners = /* @__PURE__ */ new Map(), this._lastPos = null, this._batchingTransformChange = !1, this._needClearTransformCache = !1, this._filterUpToDate = !1, this._isUnderCache = !1, this._dragEventId = null, this._shouldFireChangeEvents = !1, this.setAttrs(t), this._shouldFireChangeEvents = !0;
  }
  hasChildren() {
    return !1;
  }
  _clearCache(t) {
    (t === Gt || t === Mt) && this._cache.get(t) ? this._cache.get(t).dirty = !0 : t ? this._cache.delete(t) : this._cache.clear();
  }
  _getCache(t, e) {
    let i = this._cache.get(t);
    return (i === void 0 || (t === Gt || t === Mt) && i.dirty === !0) && (i = e.call(this), this._cache.set(t, i)), i;
  }
  _calculate(t, e, i) {
    if (!this._attachedDepsListeners.get(t)) {
      const n = e.map((r) => r + "Change.konva").join(ei);
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
    this._clearCache(t), t === Mt && this.fire("absoluteTransformChange");
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
    let n = Math.ceil(e.width || i.width), r = Math.ceil(e.height || i.height), a = e.pixelRatio, o = e.x === void 0 ? Math.floor(i.x) : e.x, l = e.y === void 0 ? Math.floor(i.y) : e.y, h = e.offset || 0, c = e.drawBorder || !1, _ = e.hitCanvasPixelRatio || 1;
    if (!n || !r) {
      V.Util.error("Can not cache the node. Width or height of the node equals 0. Caching is skipped.");
      return;
    }
    const p = Math.abs(Math.round(i.x) - o) > 0.5 ? 1 : 0, g = Math.abs(Math.round(i.y) - l) > 0.5 ? 1 : 0;
    n += h * 2 + p, r += h * 2 + g, o -= h, l -= h;
    const u = new de.SceneCanvas({
      pixelRatio: a,
      width: n,
      height: r
    }), m = new de.SceneCanvas({
      pixelRatio: a,
      width: 0,
      height: 0,
      willReadFrequently: !0
    }), y = new de.HitCanvas({
      pixelRatio: _,
      width: n,
      height: r
    }), S = u.getContext(), w = y.getContext(), d = new de.SceneCanvas({
      width: u.width / u.pixelRatio + Math.abs(o),
      height: u.height / u.pixelRatio + Math.abs(l),
      pixelRatio: u.pixelRatio
    }), f = d.getContext();
    return y.isCache = !0, u.isCache = !0, this._cache.delete(Xt), this._filterUpToDate = !1, e.imageSmoothingEnabled === !1 && (u.getContext()._context.imageSmoothingEnabled = !1, m.getContext()._context.imageSmoothingEnabled = !1), S.save(), w.save(), f.save(), S.translate(-o, -l), w.translate(-o, -l), f.translate(-o, -l), d.x = o, d.y = l, this._isUnderCache = !0, this._clearSelfAndDescendantCache(ti), this._clearSelfAndDescendantCache(hr), this.drawScene(u, this, d), this.drawHit(y, this), this._isUnderCache = !1, S.restore(), w.restore(), c && (S.save(), S.beginPath(), S.rect(0, 0, n, r), S.closePath(), S.setAttr("strokeStyle", "red"), S.setAttr("lineWidth", 5), S.stroke(), S.restore()), this._cache.set(Xt, {
      scene: u,
      filter: m,
      hit: y,
      buffer: d,
      x: o,
      y: l
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
    let n = 1 / 0, r = 1 / 0, a = -1 / 0, o = -1 / 0;
    const l = this.getAbsoluteTransform(e);
    return i.forEach(function(h) {
      const c = l.point(h);
      n === void 0 && (n = a = c.x, r = o = c.y), n = Math.min(n, c.x), r = Math.min(r, c.y), a = Math.max(a, c.x), o = Math.max(o, c.y);
    }), {
      x: n,
      y: r,
      width: a - n,
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
    let t = this.filters(), e = this._getCanvasCache(), i = e.scene, n = e.filter, r = n.getContext(), a, o, l, h;
    if (t) {
      if (!this._filterUpToDate) {
        const c = i.pixelRatio;
        n.setSize(i.width / i.pixelRatio, i.height / i.pixelRatio);
        try {
          for (a = t.length, r.clear(), r.drawImage(i._canvas, 0, 0, i.getWidth() / c, i.getHeight() / c), o = r.getImageData(0, 0, n.getWidth(), n.getHeight()), l = 0; l < a; l++) {
            if (h = t[l], typeof h != "function") {
              V.Util.error("Filter should be type of function, but got " + typeof h + " instead. Please check correct filters");
              continue;
            }
            h.call(this, o), r.putImageData(o, 0, 0);
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
    if (this._cache && this._cache.delete(Xe), arguments.length === 3)
      return this._delegate.apply(this, arguments);
    const i = t.split(ei);
    for (let n = 0; n < i.length; n++) {
      const a = i[n].split("."), o = a[0], l = a[1] || "";
      this.eventListeners[o] || (this.eventListeners[o] = []), this.eventListeners[o].push({ name: l, handler: e });
    }
    return this;
  }
  off(t, e) {
    let i = (t || "").split(ei), n = i.length, r, a, o, l, h, c;
    if (this._cache && this._cache.delete(Xe), !t)
      for (a in this.eventListeners)
        this._off(a);
    for (r = 0; r < n; r++)
      if (o = i[r], l = o.split("."), h = l[0], c = l[1], h)
        this.eventListeners[h] && this._off(h, c, e);
      else
        for (a in this.eventListeners)
          this._off(a, c, e);
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
      const a = r.target.findAncestors(e, !0, n);
      for (let o = 0; o < a.length; o++)
        r = V.Util.cloneObject(r), r.currentTarget = a[o], i.call(a[o], r);
    });
  }
  remove() {
    return this.isDragging() && this.stopDrag(), bt.DD._dragElements.delete(this._id), this._remove(), this;
  }
  _clearCaches() {
    this._clearSelfAndDescendantCache(Mt), this._clearSelfAndDescendantCache(ti), this._clearSelfAndDescendantCache(hr), this._clearSelfAndDescendantCache(ur), this._clearSelfAndDescendantCache(mn), this._clearSelfAndDescendantCache(_n);
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
        e !== Na && (i = dr + V.Util._capitalize(e), V.Util._isFunction(this[i]) ? this[i](t[e]) : this._setAttr(e, t[e]));
    }), this;
  }
  isListening() {
    return this._getCache(_n, this._isListening);
  }
  _isListening(t) {
    if (!this.listening())
      return !1;
    const i = this.getParent();
    return i && i !== t && this !== t ? i._isListening(t) : !0;
  }
  isVisible() {
    return this._getCache(mn, this._isVisible);
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
    bt.DD._dragElements.forEach((a) => {
      a.dragStatus === "dragging" && (a.node.nodeType === "Stage" || a.node.getLayer() === i) && (n = !0);
    });
    const r = !e && !$t.Konva.hitOnDragEnabled && (n || $t.Konva.isTransforming());
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
    let t = this.getDepth(), e = this, i = 0, n, r, a, o;
    function l(c) {
      for (n = [], r = c.length, a = 0; a < r; a++)
        o = c[a], i++, o.nodeType !== cr && (n = n.concat(o.getChildren().slice())), o._id === e._id && (a = r);
      n.length > 0 && n[0].getDepth() <= t && l(n);
    }
    const h = this.getStage();
    return e.nodeType !== Va && h && l(h.getChildren()), i;
  }
  getDepth() {
    let t = 0, e = this.parent;
    for (; e; )
      t++, e = e.parent;
    return t;
  }
  _batchTransformChanges(t) {
    this._batchingTransformChange = !0, t(), this._batchingTransformChange = !1, this._needClearTransformCache && (this._clearCache(Gt), this._clearSelfAndDescendantCache(Mt)), this._needClearTransformCache = !1;
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
    const n = this.getAbsoluteTransform(t).getMatrix(), r = new V.Transform(), a = this.offset();
    return r.m = n.slice(), r.translate(a.x, a.y), r.getTranslation();
  }
  setAbsolutePosition(t) {
    const { x: e, y: i, ...n } = this._clearTransform();
    this.attrs.x = e, this.attrs.y = i, this._clearCache(Gt);
    const r = this._getAbsoluteTransform().copy();
    return r.invert(), r.translate(t.x, t.y), t = {
      x: this.attrs.x + r.getTranslation().x,
      y: this.attrs.y + r.getTranslation().y
    }, this._setTransform(n), this.setPosition({ x: t.x, y: t.y }), this._clearCache(Gt), this._clearSelfAndDescendantCache(Mt), this;
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
    let i = [], n = this.getParent(), r, a;
    if (!(e && e._id === this._id)) {
      for (i.unshift(this); n && (!e || n._id !== e._id); )
        i.unshift(n), n = n.parent;
      for (r = i.length, a = 0; a < r; a++)
        t(i[a]);
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
    let t = this.getAttrs(), e, i, n, r, a;
    const o = {
      attrs: {},
      className: this.getClassName()
    };
    for (e in t)
      i = t[e], a = V.Util.isObject(i) && !V.Util._isPlainObject(i) && !V.Util._isArray(i), !a && (n = typeof this[e] == "function" && this[e], delete t[e], r = n ? n.call(this) : null, t[e] = i, r !== i && (o.attrs[e] = i));
    return V.Util._prepareToStringify(o);
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
      if (r = e[n], V.Util.isValidSelector(r) || (V.Util.warn('Selector "' + r + '" is invalid. Allowed selectors examples are "#foo", ".bar" or "Group".'), V.Util.warn('If you have a custom shape with such className, please change it to start with upper letter like "Triangle".'), V.Util.warn("Konva is awesome, right?")), r.charAt(0) === "#") {
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
    return this._getCache(ur, this._getStage);
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
        const n = i.transformsEnabled();
        n === "all" ? e.multiply(i.getTransform()) : n === "position" && e.translate(i.x() - i.offsetX(), i.y() - i.offsetY());
      }, t), e;
    {
      e = this._cache.get(Mt) || new V.Transform(), this.parent ? this.parent.getAbsoluteTransform().copyInto(e) : e.reset();
      const i = this.transformsEnabled();
      if (i === "all")
        e.multiply(this.getTransform());
      else if (i === "position") {
        const n = this.attrs.x || 0, r = this.attrs.y || 0, a = this.attrs.offsetX || 0, o = this.attrs.offsetY || 0;
        e.translate(n - a, r - o);
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
    return this._getCache(Gt, this._getTransform);
  }
  _getTransform() {
    var t, e;
    const i = this._cache.get(Gt) || new V.Transform();
    i.reset();
    const n = this.x(), r = this.y(), a = $t.Konva.getAngle(this.rotation()), o = (t = this.attrs.scaleX) !== null && t !== void 0 ? t : 1, l = (e = this.attrs.scaleY) !== null && e !== void 0 ? e : 1, h = this.attrs.skewX || 0, c = this.attrs.skewY || 0, _ = this.attrs.offsetX || 0, p = this.attrs.offsetY || 0;
    return (n !== 0 || r !== 0) && i.translate(n, r), a !== 0 && i.rotate(a), (h !== 0 || c !== 0) && i.skew(h, c), (o !== 1 || l !== 1) && i.scale(o, l), (_ !== 0 || p !== 0) && i.translate(-1 * _, -1 * p), i.dirty = !1, i;
  }
  clone(t) {
    let e = V.Util.cloneObject(this.attrs), i, n, r, a, o;
    for (i in t)
      e[i] = t[i];
    const l = new this.constructor(e);
    for (i in this.eventListeners)
      for (n = this.eventListeners[i], r = n.length, a = 0; a < r; a++)
        o = n[a], o.name.indexOf(La) < 0 && (l.eventListeners[i] || (l.eventListeners[i] = []), l.eventListeners[i].push(o));
    return l;
  }
  _toKonvaCanvas(t) {
    t = t || {};
    const e = this.getClientRect(), i = this.getStage(), n = t.x !== void 0 ? t.x : Math.floor(e.x), r = t.y !== void 0 ? t.y : Math.floor(e.y), a = t.pixelRatio || 1, o = new de.SceneCanvas({
      width: t.width || Math.ceil(e.width) || (i ? i.width() : 0),
      height: t.height || Math.ceil(e.height) || (i ? i.height() : 0),
      pixelRatio: a
    }), l = o.getContext(), h = new de.SceneCanvas({
      width: o.width / o.pixelRatio + Math.abs(n),
      height: o.height / o.pixelRatio + Math.abs(r),
      pixelRatio: o.pixelRatio
    });
    return t.imageSmoothingEnabled === !1 && (l._context.imageSmoothingEnabled = !1), l.save(), (n || r) && l.translate(-1 * n, -1 * r), this.drawScene(o, void 0, h), l.restore(), o;
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
        n && delete t.callback, V.Util._urlToImage(this.toDataURL(t), function(r) {
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
    return this.attrs.dragDistance !== void 0 ? this.attrs.dragDistance : this.parent ? this.parent.getDragDistance() : $t.Konva.dragDistance;
  }
  _off(t, e, i) {
    let n = this.eventListeners[t], r, a, o;
    for (r = 0; r < n.length; r++)
      if (a = n[r].name, o = n[r].handler, (a !== "konva" || e === "konva") && (!e || a === e) && (!i || i === o)) {
        if (n.splice(r, 1), n.length === 0) {
          delete this.eventListeners[t];
          break;
        }
        r--;
      }
  }
  _fireChangeEvent(t, e, i) {
    this._fire(t + Oa, {
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
    const i = this[dr + V.Util._capitalize(t)];
    return V.Util._isFunction(i) ? i.call(this, e) : this._setAttr(t, e), this;
  }
  _requestDraw() {
    if ($t.Konva.autoDrawEnabled) {
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
    e && this.nodeType === cr && (e.target = this);
    const n = [
      $a,
      Ga,
      Da,
      Ia,
      Ua,
      Ba
    ];
    if (!(n.indexOf(t) !== -1 && (i && (this === i || this.isAncestorOf && this.isAncestorOf(i)) || this.nodeType === "Stage" && !i))) {
      this._fire(t, e);
      const a = n.indexOf(t) !== -1 && i && i.isAncestorOf && i.isAncestorOf(this) && !i.isAncestorOf(this.parent);
      (e && !e.cancelBubble || !e) && this.parent && this.parent.isListening() && !a && (i && i.parent ? this._fireAndBubble.call(this.parent, t, e, i) : this._fireAndBubble.call(this.parent, t, e));
    }
  }
  _getProtoListeners(t) {
    var e, i, n;
    const r = (e = this._cache.get(Xe)) !== null && e !== void 0 ? e : {};
    let a = r == null ? void 0 : r[t];
    if (a === void 0) {
      a = [];
      let o = Object.getPrototypeOf(this);
      for (; o; ) {
        const l = (n = (i = o.eventListeners) === null || i === void 0 ? void 0 : i[t]) !== null && n !== void 0 ? n : [];
        a.push(...l), o = Object.getPrototypeOf(o);
      }
      r[t] = a, this._cache.set(Xe, r);
    }
    return a;
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
      const a = r.call(this, n, t);
      a ? n = a : V.Util.warn("dragBoundFunc did not return any value. That is unexpected behavior. You must return new absolute position from dragBoundFunc.");
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
      if (!(!(t.evt.button !== void 0) || $t.Konva.dragButtons.indexOf(t.evt.button) >= 0) || this.isDragging())
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
    return V.Util.haveIntersection(i, this.getClientRect());
  }
  static create(t, e) {
    return V.Util._isString(t) && (t = JSON.parse(t)), this._createNode(t, e);
  }
  static _createNode(t, e) {
    let i = D.prototype.getClassName.call(t), n = t.children, r, a, o;
    e && (t.attrs.container = e), $t.Konva[i] || (V.Util.warn('Can not find a node with class name "' + i + '". Fallback to "Shape".'), i = "Shape");
    const l = $t.Konva[i];
    if (r = new l(t.attrs), n)
      for (a = n.length, o = 0; o < a; o++)
        r.add(D._createNode(n[o]));
    return r;
  }
}
nt.Node = D;
D.prototype.nodeType = "Node";
D.prototype._attrsAffectingSize = [];
D.prototype.eventListeners = {};
D.prototype.on.call(D.prototype, Ha, function() {
  if (this._batchingTransformChange) {
    this._needClearTransformCache = !0;
    return;
  }
  this._clearCache(Gt), this._clearSelfAndDescendantCache(Mt);
});
D.prototype.on.call(D.prototype, "visibleChange.konva", function() {
  this._clearSelfAndDescendantCache(mn);
});
D.prototype.on.call(D.prototype, "listeningChange.konva", function() {
  this._clearSelfAndDescendantCache(_n);
});
D.prototype.on.call(D.prototype, "opacityChange.konva", function() {
  this._clearSelfAndDescendantCache(ti);
});
const J = Ve.Factory.addGetterSetter;
J(D, "zIndex");
J(D, "absolutePosition");
J(D, "position");
J(D, "x", 0, (0, ct.getNumberValidator)());
J(D, "y", 0, (0, ct.getNumberValidator)());
J(D, "globalCompositeOperation", "source-over", (0, ct.getStringValidator)());
J(D, "opacity", 1, (0, ct.getNumberValidator)());
J(D, "name", "", (0, ct.getStringValidator)());
J(D, "id", "", (0, ct.getStringValidator)());
J(D, "rotation", 0, (0, ct.getNumberValidator)());
Ve.Factory.addComponentsGetterSetter(D, "scale", ["x", "y"]);
J(D, "scaleX", 1, (0, ct.getNumberValidator)());
J(D, "scaleY", 1, (0, ct.getNumberValidator)());
Ve.Factory.addComponentsGetterSetter(D, "skew", ["x", "y"]);
J(D, "skewX", 0, (0, ct.getNumberValidator)());
J(D, "skewY", 0, (0, ct.getNumberValidator)());
Ve.Factory.addComponentsGetterSetter(D, "offset", ["x", "y"]);
J(D, "offsetX", 0, (0, ct.getNumberValidator)());
J(D, "offsetY", 0, (0, ct.getNumberValidator)());
J(D, "dragDistance", void 0, (0, ct.getNumberValidator)());
J(D, "width", 0, (0, ct.getNumberValidator)());
J(D, "height", 0, (0, ct.getNumberValidator)());
J(D, "listening", !0, (0, ct.getBooleanValidator)());
J(D, "preventDefault", !0, (0, ct.getBooleanValidator)());
J(D, "filters", void 0, function(s) {
  return this._filterUpToDate = !1, s;
});
J(D, "visible", !0, (0, ct.getBooleanValidator)());
J(D, "transformsEnabled", "all", (0, ct.getStringValidator)());
J(D, "size");
J(D, "dragBoundFunc");
J(D, "draggable", !1, (0, ct.getBooleanValidator)());
Ve.Factory.backCompat(D, {
  rotateDeg: "rotate",
  setRotationDeg: "setRotation",
  getRotationDeg: "getRotation"
});
var Zt = {};
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.Container = void 0;
const Se = B, sn = nt, ui = G;
class te extends sn.Node {
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
    const t = sn.Node.prototype.toObject.call(this);
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
    const e = sn.Node.prototype.clone.call(this, t);
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
    const n = this.getLayer(), r = t || n && n.getCanvas(), a = r && r.getContext(), o = this._getCanvasCache(), l = o && o.scene, h = r && r.isCache;
    if (!this.isVisible() && !h)
      return this;
    if (l) {
      a.save();
      const c = this.getAbsoluteTransform(e).getMatrix();
      a.transform(c[0], c[1], c[2], c[3], c[4], c[5]), this._drawCachedSceneCanvas(a), a.restore();
    } else
      this._drawChildren("drawScene", r, e, i);
    return this;
  }
  drawHit(t, e) {
    if (!this.shouldDrawHit(e))
      return this;
    const i = this.getLayer(), n = t || i && i.hitCanvas, r = n && n.getContext(), a = this._getCanvasCache();
    if (a && a.hit) {
      r.save();
      const l = this.getAbsoluteTransform(e).getMatrix();
      r.transform(l[0], l[1], l[2], l[3], l[4], l[5]), this._drawCachedHitCanvas(r), r.restore();
    } else
      this._drawChildren("drawHit", n, e);
    return this;
  }
  _drawChildren(t, e, i, n) {
    var r;
    const a = e && e.getContext(), o = this.clipWidth(), l = this.clipHeight(), h = this.clipFunc(), c = typeof o == "number" && typeof l == "number" || h, _ = i === this;
    if (c) {
      a.save();
      const g = this.getAbsoluteTransform(i);
      let u = g.getMatrix();
      a.transform(u[0], u[1], u[2], u[3], u[4], u[5]), a.beginPath();
      let m;
      if (h)
        m = h.call(this, a, this);
      else {
        const y = this.clipX(), S = this.clipY();
        a.rect(y || 0, S || 0, o, l);
      }
      a.clip.apply(a, m), u = g.copy().invert().getMatrix(), a.transform(u[0], u[1], u[2], u[3], u[4], u[5]);
    }
    const p = !_ && this.globalCompositeOperation() !== "source-over" && t === "drawScene";
    p && (a.save(), a._applyGlobalCompositeOperation(this)), (r = this.children) === null || r === void 0 || r.forEach(function(g) {
      g[t](e, i, n);
    }), p && a.restore(), c && a.restore();
  }
  getClientRect(t = {}) {
    var e;
    const i = t.skipTransform, n = t.relativeTo;
    let r, a, o, l, h = {
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
      u.width === 0 && u.height === 0 || (r === void 0 ? (r = u.x, a = u.y, o = u.x + u.width, l = u.y + u.height) : (r = Math.min(r, u.x), a = Math.min(a, u.y), o = Math.max(o, u.x + u.width), l = Math.max(l, u.y + u.height)));
    });
    const _ = this.find("Shape");
    let p = !1;
    for (let g = 0; g < _.length; g++)
      if (_[g]._isVisible(this)) {
        p = !0;
        break;
      }
    return p && r !== void 0 ? h = {
      x: r,
      y: a,
      width: o - r,
      height: l - a
    } : h = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, i ? h : this._transformedRect(h, n);
  }
}
Zt.Container = te;
Se.Factory.addComponentsGetterSetter(te, "clip", [
  "x",
  "y",
  "width",
  "height"
]);
Se.Factory.addGetterSetter(te, "clipX", void 0, (0, ui.getNumberValidator)());
Se.Factory.addGetterSetter(te, "clipY", void 0, (0, ui.getNumberValidator)());
Se.Factory.addGetterSetter(te, "clipWidth", void 0, (0, ui.getNumberValidator)());
Se.Factory.addGetterSetter(te, "clipHeight", void 0, (0, ui.getNumberValidator)());
Se.Factory.addGetterSetter(te, "clipFunc");
var Jr = {}, Bt = {};
Object.defineProperty(Bt, "__esModule", { value: !0 });
Bt.getCapturedShape = ja;
Bt.createEvent = Fn;
Bt.hasPointerCapture = Ya;
Bt.setPointerCapture = Xa;
Bt.releaseCapture = ts;
const Wa = U, Ge = /* @__PURE__ */ new Map(), Zr = Wa.Konva._global.PointerEvent !== void 0;
function ja(s) {
  return Ge.get(s);
}
function Fn(s) {
  return {
    evt: s,
    pointerId: s.pointerId
  };
}
function Ya(s, t) {
  return Ge.get(s) === t;
}
function Xa(s, t) {
  ts(s), t.getStage() && (Ge.set(s, t), Zr && t._fire("gotpointercapture", Fn(new PointerEvent("gotpointercapture"))));
}
function ts(s, t) {
  const e = Ge.get(s);
  if (!e)
    return;
  const i = e.getStage();
  i && i.content, Ge.delete(s), Zr && e._fire("lostpointercapture", Fn(new PointerEvent("lostpointercapture")));
}
(function(s) {
  Object.defineProperty(s, "__esModule", { value: !0 }), s.Stage = s.stages = void 0;
  const t = st, e = B, i = Zt, n = U, r = St, a = ci, o = U, l = Bt, h = "Stage", c = "string", _ = "px", p = "mouseout", g = "mouseleave", u = "mouseover", m = "mouseenter", y = "mousemove", S = "mousedown", w = "mouseup", d = "pointermove", f = "pointerdown", b = "pointerup", x = "pointercancel", P = "lostpointercapture", v = "pointerout", E = "pointerleave", A = "pointerover", M = "pointerenter", k = "contextmenu", R = "touchstart", L = "touchend", F = "touchmove", K = "touchcancel", Y = "wheel", $ = 5, W = [
    [m, "_pointerenter"],
    [S, "_pointerdown"],
    [y, "_pointermove"],
    [w, "_pointerup"],
    [g, "_pointerleave"],
    [R, "_pointerdown"],
    [F, "_pointermove"],
    [L, "_pointerup"],
    [K, "_pointercancel"],
    [u, "_pointerover"],
    [Y, "_wheel"],
    [k, "_contextmenu"],
    [f, "_pointerdown"],
    [d, "_pointermove"],
    [b, "_pointerup"],
    [x, "_pointercancel"],
    [E, "_pointerleave"],
    [P, "_lostpointercapture"]
  ], I = {
    mouse: {
      [v]: p,
      [E]: g,
      [A]: u,
      [M]: m,
      [d]: y,
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
      [M]: "touchenter",
      [d]: F,
      [f]: R,
      [b]: L,
      [x]: K,
      pointerclick: "tap",
      pointerdblclick: "dbltap"
    },
    pointer: {
      [v]: v,
      [E]: E,
      [A]: A,
      [M]: M,
      [d]: d,
      [f]: f,
      [b]: b,
      [x]: x,
      pointerclick: "pointerclick",
      pointerdblclick: "pointerdblclick"
    }
  }, O = (mt) => mt.indexOf("pointer") >= 0 ? "pointer" : mt.indexOf("touch") >= 0 ? "touch" : "mouse", z = (mt) => {
    const C = O(mt);
    if (C === "pointer")
      return n.Konva.pointerEventsEnabled && I.pointer;
    if (C === "touch")
      return I.touch;
    if (C === "mouse")
      return I.mouse;
  };
  function rt(mt = {}) {
    return (mt.clipFunc || mt.clipWidth || mt.clipHeight) && t.Util.warn("Stage does not support clipping. Please use clip for Layers or Groups."), mt;
  }
  const oe = "Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);";
  s.stages = [];
  class kt extends i.Container {
    constructor(C) {
      super(rt(C)), this._pointerPositions = [], this._changedPointerPositions = [], this._buildDOM(), this._bindContentEvents(), s.stages.push(this), this.on("widthChange.konva heightChange.konva", this._resizeDOM), this.on("visibleChange.konva", this._checkVisibility), this.on("clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva", () => {
        rt(this.attrs);
      }), this._checkVisibility();
    }
    _validateAdd(C) {
      const T = C.getType() === "Layer", N = C.getType() === "FastLayer";
      T || N || t.Util.throw("You may only add layers to the stage.");
    }
    _checkVisibility() {
      if (!this.content)
        return;
      const C = this.visible() ? "" : "none";
      this.content.style.display = C;
    }
    setContainer(C) {
      if (typeof C === c) {
        let T;
        if (C.charAt(0) === ".") {
          const N = C.slice(1);
          C = document.getElementsByClassName(N)[0];
        } else
          C.charAt(0) !== "#" ? T = C : T = C.slice(1), C = document.getElementById(T);
        if (!C)
          throw "Can not find container in document with id " + T;
      }
      return this._setAttr("container", C), this.content && (this.content.parentElement && this.content.parentElement.removeChild(this.content), C.appendChild(this.content)), this;
    }
    shouldDrawHit() {
      return !0;
    }
    clear() {
      const C = this.children, T = C.length;
      for (let N = 0; N < T; N++)
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
      const T = s.stages.indexOf(this);
      return T > -1 && s.stages.splice(T, 1), t.Util.releaseCanvas(this.bufferCanvas._canvas, this.bufferHitCanvas._canvas), this;
    }
    getPointerPosition() {
      const C = this._pointerPositions[0] || this._changedPointerPositions[0];
      return C ? {
        x: C.x,
        y: C.y
      } : (t.Util.warn(oe), null);
    }
    _getPointerById(C) {
      return this._pointerPositions.find((T) => T.id === C);
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
      const T = new r.SceneCanvas({
        width: C.width,
        height: C.height,
        pixelRatio: C.pixelRatio || 1
      }), N = T.getContext()._context, it = this.children;
      return (C.x || C.y) && N.translate(-1 * C.x, -1 * C.y), it.forEach(function(q) {
        if (!q.isVisible())
          return;
        const ht = q._toKonvaCanvas(C);
        N.drawImage(ht._canvas, C.x, C.y, ht.getWidth() / ht.getPixelRatio(), ht.getHeight() / ht.getPixelRatio());
      }), T;
    }
    getIntersection(C) {
      if (!C)
        return null;
      const T = this.children, N = T.length, it = N - 1;
      for (let q = it; q >= 0; q--) {
        const ht = T[q].getIntersection(C);
        if (ht)
          return ht;
      }
      return null;
    }
    _resizeDOM() {
      const C = this.width(), T = this.height();
      this.content && (this.content.style.width = C + _, this.content.style.height = T + _), this.bufferCanvas.setSize(C, T), this.bufferHitCanvas.setSize(C, T), this.children.forEach((N) => {
        N.setSize({ width: C, height: T }), N.draw();
      });
    }
    add(C, ...T) {
      if (arguments.length > 1) {
        for (let it = 0; it < arguments.length; it++)
          this.add(arguments[it]);
        return this;
      }
      super.add(C);
      const N = this.children.length;
      return N > $ && t.Util.warn("The stage has " + N + " layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group."), C.setSize({ width: this.width(), height: this.height() }), C.draw(), n.Konva.isBrowser && this.content.appendChild(C.canvas._canvas), this;
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
      n.Konva.isBrowser && W.forEach(([C, T]) => {
        this.content.addEventListener(C, (N) => {
          this[T](N);
        }, { passive: !1 });
      });
    }
    _pointerenter(C) {
      this.setPointersPositions(C);
      const T = z(C.type);
      T && this._fire(T.pointerenter, {
        evt: C,
        target: this,
        currentTarget: this
      });
    }
    _pointerover(C) {
      this.setPointersPositions(C);
      const T = z(C.type);
      T && this._fire(T.pointerover, {
        evt: C,
        target: this,
        currentTarget: this
      });
    }
    _getTargetShape(C) {
      let T = this[C + "targetShape"];
      return T && !T.getStage() && (T = null), T;
    }
    _pointerleave(C) {
      const T = z(C.type), N = O(C.type);
      if (!T)
        return;
      this.setPointersPositions(C);
      const it = this._getTargetShape(N), q = !(n.Konva.isDragging() || n.Konva.isTransforming()) || n.Konva.hitOnDragEnabled;
      it && q ? (it._fireAndBubble(T.pointerout, { evt: C }), it._fireAndBubble(T.pointerleave, { evt: C }), this._fire(T.pointerleave, {
        evt: C,
        target: this,
        currentTarget: this
      }), this[N + "targetShape"] = null) : q && (this._fire(T.pointerleave, {
        evt: C,
        target: this,
        currentTarget: this
      }), this._fire(T.pointerout, {
        evt: C,
        target: this,
        currentTarget: this
      })), this.pointerPos = null, this._pointerPositions = [];
    }
    _pointerdown(C) {
      const T = z(C.type), N = O(C.type);
      if (!T)
        return;
      this.setPointersPositions(C);
      let it = !1;
      this._changedPointerPositions.forEach((q) => {
        const ht = this.getIntersection(q);
        if (a.DD.justDragged = !1, n.Konva["_" + N + "ListenClick"] = !0, !ht || !ht.isListening()) {
          this[N + "ClickStartShape"] = void 0;
          return;
        }
        n.Konva.capturePointerEventsEnabled && ht.setPointerCapture(q.id), this[N + "ClickStartShape"] = ht, ht._fireAndBubble(T.pointerdown, {
          evt: C,
          pointerId: q.id
        }), it = !0;
        const yt = C.type.indexOf("touch") >= 0;
        ht.preventDefault() && C.cancelable && yt && C.preventDefault();
      }), it || this._fire(T.pointerdown, {
        evt: C,
        target: this,
        currentTarget: this,
        pointerId: this._pointerPositions[0].id
      });
    }
    _pointermove(C) {
      const T = z(C.type), N = O(C.type);
      if (!T || (n.Konva.isDragging() && a.DD.node.preventDefault() && C.cancelable && C.preventDefault(), this.setPointersPositions(C), !(!(n.Konva.isDragging() || n.Konva.isTransforming()) || n.Konva.hitOnDragEnabled)))
        return;
      const q = {};
      let ht = !1;
      const yt = this._getTargetShape(N);
      this._changedPointerPositions.forEach((Lt) => {
        const tt = l.getCapturedShape(Lt.id) || this.getIntersection(Lt), le = Lt.id, Pt = { evt: C, pointerId: le }, he = yt !== tt;
        if (he && yt && (yt._fireAndBubble(T.pointerout, { ...Pt }, tt), yt._fireAndBubble(T.pointerleave, { ...Pt }, tt)), tt) {
          if (q[tt._id])
            return;
          q[tt._id] = !0;
        }
        tt && tt.isListening() ? (ht = !0, he && (tt._fireAndBubble(T.pointerover, { ...Pt }, yt), tt._fireAndBubble(T.pointerenter, { ...Pt }, yt), this[N + "targetShape"] = tt), tt._fireAndBubble(T.pointermove, { ...Pt })) : yt && (this._fire(T.pointerover, {
          evt: C,
          target: this,
          currentTarget: this,
          pointerId: le
        }), this[N + "targetShape"] = null);
      }), ht || this._fire(T.pointermove, {
        evt: C,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id
      });
    }
    _pointerup(C) {
      const T = z(C.type), N = O(C.type);
      if (!T)
        return;
      this.setPointersPositions(C);
      const it = this[N + "ClickStartShape"], q = this[N + "ClickEndShape"], ht = {};
      let yt = !1;
      this._changedPointerPositions.forEach((Lt) => {
        const tt = l.getCapturedShape(Lt.id) || this.getIntersection(Lt);
        if (tt) {
          if (tt.releaseCapture(Lt.id), ht[tt._id])
            return;
          ht[tt._id] = !0;
        }
        const le = Lt.id, Pt = { evt: C, pointerId: le };
        let he = !1;
        n.Konva["_" + N + "InDblClickWindow"] ? (he = !0, clearTimeout(this[N + "DblTimeout"])) : a.DD.justDragged || (n.Konva["_" + N + "InDblClickWindow"] = !0, clearTimeout(this[N + "DblTimeout"])), this[N + "DblTimeout"] = setTimeout(function() {
          n.Konva["_" + N + "InDblClickWindow"] = !1;
        }, n.Konva.dblClickWindow), tt && tt.isListening() ? (yt = !0, this[N + "ClickEndShape"] = tt, tt._fireAndBubble(T.pointerup, { ...Pt }), n.Konva["_" + N + "ListenClick"] && it && it === tt && (tt._fireAndBubble(T.pointerclick, { ...Pt }), he && q && q === tt && tt._fireAndBubble(T.pointerdblclick, { ...Pt }))) : (this[N + "ClickEndShape"] = null, n.Konva["_" + N + "ListenClick"] && this._fire(T.pointerclick, {
          evt: C,
          target: this,
          currentTarget: this,
          pointerId: le
        }), he && this._fire(T.pointerdblclick, {
          evt: C,
          target: this,
          currentTarget: this,
          pointerId: le
        }));
      }), yt || this._fire(T.pointerup, {
        evt: C,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id
      }), n.Konva["_" + N + "ListenClick"] = !1, C.cancelable && N !== "touch" && N !== "pointer" && C.preventDefault();
    }
    _contextmenu(C) {
      this.setPointersPositions(C);
      const T = this.getIntersection(this.getPointerPosition());
      T && T.isListening() ? T._fireAndBubble(k, { evt: C }) : this._fire(k, {
        evt: C,
        target: this,
        currentTarget: this
      });
    }
    _wheel(C) {
      this.setPointersPositions(C);
      const T = this.getIntersection(this.getPointerPosition());
      T && T.isListening() ? T._fireAndBubble(Y, { evt: C }) : this._fire(Y, {
        evt: C,
        target: this,
        currentTarget: this
      });
    }
    _pointercancel(C) {
      this.setPointersPositions(C);
      const T = l.getCapturedShape(C.pointerId) || this.getIntersection(this.getPointerPosition());
      T && T._fireAndBubble(b, l.createEvent(C)), l.releaseCapture(C.pointerId);
    }
    _lostpointercapture(C) {
      l.releaseCapture(C.pointerId);
    }
    setPointersPositions(C) {
      const T = this._getContentPosition();
      let N = null, it = null;
      C = C || window.event, C.touches !== void 0 ? (this._pointerPositions = [], this._changedPointerPositions = [], Array.prototype.forEach.call(C.touches, (q) => {
        this._pointerPositions.push({
          id: q.identifier,
          x: (q.clientX - T.left) / T.scaleX,
          y: (q.clientY - T.top) / T.scaleY
        });
      }), Array.prototype.forEach.call(C.changedTouches || C.touches, (q) => {
        this._changedPointerPositions.push({
          id: q.identifier,
          x: (q.clientX - T.left) / T.scaleX,
          y: (q.clientY - T.top) / T.scaleY
        });
      })) : (N = (C.clientX - T.left) / T.scaleX, it = (C.clientY - T.top) / T.scaleY, this.pointerPos = {
        x: N,
        y: it
      }, this._pointerPositions = [{ x: N, y: it, id: t.Util._getFirstPointerId(C) }], this._changedPointerPositions = [
        { x: N, y: it, id: t.Util._getFirstPointerId(C) }
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
  s.Stage = kt, kt.prototype.nodeType = h, (0, o._registerNode)(kt), e.Factory.addGetterSetter(kt, "container"), n.Konva.isBrowser && document.addEventListener("visibilitychange", () => {
    s.stages.forEach((mt) => {
      mt.batchDraw();
    });
  });
})(Jr);
var He = {}, gt = {};
(function(s) {
  Object.defineProperty(s, "__esModule", { value: !0 }), s.Shape = s.shapes = void 0;
  const t = U, e = st, i = B, n = nt, r = G, a = U, o = Bt, l = "hasShadow", h = "shadowRGBA", c = "patternImage", _ = "linearGradient", p = "radialGradient";
  let g;
  function u() {
    return g || (g = e.Util.createCanvasElement().getContext("2d"), g);
  }
  s.shapes = {};
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
  function d() {
    this._clearCache(l);
  }
  function f() {
    this._clearCache(h);
  }
  function b() {
    this._clearCache(c);
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
      let M;
      for (; M = e.Util.getRandomColor(), !(M && !(M in s.shapes)); )
        ;
      this.colorKey = M, s.shapes[M] = this;
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
        const M = u().createPattern(this.fillPatternImage(), this.fillPatternRepeat() || "repeat");
        if (M && M.setTransform) {
          const k = new e.Transform();
          k.translate(this.fillPatternX(), this.fillPatternY()), k.rotate(t.Konva.getAngle(this.fillPatternRotation())), k.scale(this.fillPatternScaleX(), this.fillPatternScaleY()), k.translate(-1 * this.fillPatternOffsetX(), -1 * this.fillPatternOffsetY());
          const R = k.getMatrix(), L = typeof DOMMatrix > "u" ? {
            a: R[0],
            b: R[1],
            c: R[2],
            d: R[3],
            e: R[4],
            f: R[5]
          } : new DOMMatrix(R);
          M.setTransform(L);
        }
        return M;
      }
    }
    _getLinearGradient() {
      return this._getCache(_, this.__getLinearGradient);
    }
    __getLinearGradient() {
      const A = this.fillLinearGradientColorStops();
      if (A) {
        const M = u(), k = this.fillLinearGradientStartPoint(), R = this.fillLinearGradientEndPoint(), L = M.createLinearGradient(k.x, k.y, R.x, R.y);
        for (let F = 0; F < A.length; F += 2)
          L.addColorStop(A[F], A[F + 1]);
        return L;
      }
    }
    _getRadialGradient() {
      return this._getCache(p, this.__getRadialGradient);
    }
    __getRadialGradient() {
      const A = this.fillRadialGradientColorStops();
      if (A) {
        const M = u(), k = this.fillRadialGradientStartPoint(), R = this.fillRadialGradientEndPoint(), L = M.createRadialGradient(k.x, k.y, this.fillRadialGradientStartRadius(), R.x, R.y, this.fillRadialGradientEndRadius());
        for (let F = 0; F < A.length; F += 2)
          L.addColorStop(A[F], A[F + 1]);
        return L;
      }
    }
    getShadowRGBA() {
      return this._getCache(h, this._getShadowRGBA);
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
      const M = this.getStage();
      if (!M)
        return !1;
      const k = M.bufferHitCanvas;
      return k.getContext().clear(), this.drawHit(k, void 0, !0), k.context.getImageData(Math.round(A.x), Math.round(A.y), 1, 1).data[3] > 0;
    }
    destroy() {
      return n.Node.prototype.destroy.call(this), delete s.shapes[this.colorKey], delete this.colorKey, this;
    }
    _useBufferCanvas(A) {
      var M;
      if (!((M = this.attrs.perfectDrawEnabled) !== null && M !== void 0 ? M : !0))
        return !1;
      const R = A || this.hasFill(), L = this.hasStroke(), F = this.getAbsoluteOpacity() !== 1;
      if (R && L && F)
        return !0;
      const K = this.hasShadow(), Y = this.shadowForStrokeEnabled();
      return !!(R && L && K && Y);
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
      let M = !1, k = this.getParent();
      for (; k; ) {
        if (k.isCached()) {
          M = !0;
          break;
        }
        k = k.getParent();
      }
      const R = A.skipTransform, L = A.relativeTo || M && this.getStage() || void 0, F = this.getSelfRect(), Y = !A.skipStroke && this.hasStroke() && this.strokeWidth() || 0, $ = F.width + Y, W = F.height + Y, I = !A.skipShadow && this.hasShadow(), O = I ? this.shadowOffsetX() : 0, z = I ? this.shadowOffsetY() : 0, rt = $ + Math.abs(O), oe = W + Math.abs(z), kt = I && this.shadowBlur() || 0, mt = rt + kt * 2, C = oe + kt * 2, T = {
        width: mt,
        height: C,
        x: -(Y / 2 + kt) + Math.min(O, 0) + F.x,
        y: -(Y / 2 + kt) + Math.min(z, 0) + F.y
      };
      return R ? T : this._transformedRect(T, L);
    }
    drawScene(A, M, k) {
      const R = this.getLayer(), L = A || R.getCanvas(), F = L.getContext(), K = this._getCanvasCache(), Y = this.getSceneFunc(), $ = this.hasShadow();
      let W;
      const I = M === this;
      if (!this.isVisible() && !I)
        return this;
      if (K) {
        F.save();
        const O = this.getAbsoluteTransform(M).getMatrix();
        return F.transform(O[0], O[1], O[2], O[3], O[4], O[5]), this._drawCachedSceneCanvas(F), F.restore(), this;
      }
      if (!Y)
        return this;
      if (F.save(), this._useBufferCanvas()) {
        W = this.getStage();
        const O = k || W.bufferCanvas, z = O.getContext();
        z.clear(), z.save(), z._applyLineJoin(this);
        const rt = this.getAbsoluteTransform(M).getMatrix();
        z.transform(rt[0], rt[1], rt[2], rt[3], rt[4], rt[5]), Y.call(this, z, this), z.restore();
        const oe = O.pixelRatio;
        $ && F._applyShadow(this), F._applyOpacity(this), F._applyGlobalCompositeOperation(this), F.drawImage(O._canvas, O.x || 0, O.y || 0, O.width / oe, O.height / oe);
      } else {
        if (F._applyLineJoin(this), !I) {
          const O = this.getAbsoluteTransform(M).getMatrix();
          F.transform(O[0], O[1], O[2], O[3], O[4], O[5]), F._applyOpacity(this), F._applyGlobalCompositeOperation(this);
        }
        $ && F._applyShadow(this), Y.call(this, F, this);
      }
      return F.restore(), this;
    }
    drawHit(A, M, k = !1) {
      if (!this.shouldDrawHit(M, k))
        return this;
      const R = this.getLayer(), L = A || R.hitCanvas, F = L && L.getContext(), K = this.hitFunc() || this.sceneFunc(), Y = this._getCanvasCache(), $ = Y && Y.hit;
      if (this.colorKey || e.Util.warn("Looks like your canvas has a destroyed shape in it. Do not reuse shape after you destroyed it. If you want to reuse shape you should call remove() instead of destroy()"), $) {
        F.save();
        const I = this.getAbsoluteTransform(M).getMatrix();
        return F.transform(I[0], I[1], I[2], I[3], I[4], I[5]), this._drawCachedHitCanvas(F), F.restore(), this;
      }
      if (!K)
        return this;
      if (F.save(), F._applyLineJoin(this), !(this === M)) {
        const I = this.getAbsoluteTransform(M).getMatrix();
        F.transform(I[0], I[1], I[2], I[3], I[4], I[5]);
      }
      return K.call(this, F, this), F.restore(), this;
    }
    drawHitFromCache(A = 0) {
      const M = this._getCanvasCache(), k = this._getCachedSceneCanvas(), R = M.hit, L = R.getContext(), F = R.getWidth(), K = R.getHeight();
      L.clear(), L.drawImage(k._canvas, 0, 0, F, K);
      try {
        const Y = L.getImageData(0, 0, F, K), $ = Y.data, W = $.length, I = e.Util._hexToRgb(this.colorKey);
        for (let O = 0; O < W; O += 4)
          $[O + 3] > A ? ($[O] = I.r, $[O + 1] = I.g, $[O + 2] = I.b, $[O + 3] = 255) : $[O + 3] = 0;
        L.putImageData(Y, 0, 0);
      } catch (Y) {
        e.Util.error("Unable to draw hit graph from cached scene canvas. " + Y.message);
      }
      return this;
    }
    hasPointerCapture(A) {
      return o.hasPointerCapture(A, this);
    }
    setPointerCapture(A) {
      o.setPointerCapture(A, this);
    }
    releaseCapture(A) {
      o.releaseCapture(A, this);
    }
  }
  s.Shape = v, v.prototype._fillFunc = m, v.prototype._strokeFunc = y, v.prototype._fillFuncHit = S, v.prototype._strokeFuncHit = w, v.prototype._centroid = !1, v.prototype.nodeType = "Shape", (0, a._registerNode)(v), v.prototype.eventListeners = {}, v.prototype.on.call(v.prototype, "shadowColorChange.konva shadowBlurChange.konva shadowOffsetChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", d), v.prototype.on.call(v.prototype, "shadowColorChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", f), v.prototype.on.call(v.prototype, "fillPriorityChange.konva fillPatternImageChange.konva fillPatternRepeatChange.konva fillPatternScaleXChange.konva fillPatternScaleYChange.konva fillPatternOffsetXChange.konva fillPatternOffsetYChange.konva fillPatternXChange.konva fillPatternYChange.konva fillPatternRotationChange.konva", b), v.prototype.on.call(v.prototype, "fillPriorityChange.konva fillLinearGradientColorStopsChange.konva fillLinearGradientStartPointXChange.konva fillLinearGradientStartPointYChange.konva fillLinearGradientEndPointXChange.konva fillLinearGradientEndPointYChange.konva", x), v.prototype.on.call(v.prototype, "fillPriorityChange.konva fillRadialGradientColorStopsChange.konva fillRadialGradientStartPointXChange.konva fillRadialGradientStartPointYChange.konva fillRadialGradientEndPointXChange.konva fillRadialGradientEndPointYChange.konva fillRadialGradientStartRadiusChange.konva fillRadialGradientEndRadiusChange.konva", P), i.Factory.addGetterSetter(v, "stroke", void 0, (0, r.getStringOrGradientValidator)()), i.Factory.addGetterSetter(v, "strokeWidth", 2, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillAfterStrokeEnabled", !1), i.Factory.addGetterSetter(v, "hitStrokeWidth", "auto", (0, r.getNumberOrAutoValidator)()), i.Factory.addGetterSetter(v, "strokeHitEnabled", !0, (0, r.getBooleanValidator)()), i.Factory.addGetterSetter(v, "perfectDrawEnabled", !0, (0, r.getBooleanValidator)()), i.Factory.addGetterSetter(v, "shadowForStrokeEnabled", !0, (0, r.getBooleanValidator)()), i.Factory.addGetterSetter(v, "lineJoin"), i.Factory.addGetterSetter(v, "lineCap"), i.Factory.addGetterSetter(v, "sceneFunc"), i.Factory.addGetterSetter(v, "hitFunc"), i.Factory.addGetterSetter(v, "dash"), i.Factory.addGetterSetter(v, "dashOffset", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "shadowColor", void 0, (0, r.getStringValidator)()), i.Factory.addGetterSetter(v, "shadowBlur", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "shadowOpacity", 1, (0, r.getNumberValidator)()), i.Factory.addComponentsGetterSetter(v, "shadowOffset", ["x", "y"]), i.Factory.addGetterSetter(v, "shadowOffsetX", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "shadowOffsetY", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternImage"), i.Factory.addGetterSetter(v, "fill", void 0, (0, r.getStringOrGradientValidator)()), i.Factory.addGetterSetter(v, "fillPatternX", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternY", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillLinearGradientColorStops"), i.Factory.addGetterSetter(v, "strokeLinearGradientColorStops"), i.Factory.addGetterSetter(v, "fillRadialGradientStartRadius", 0), i.Factory.addGetterSetter(v, "fillRadialGradientEndRadius", 0), i.Factory.addGetterSetter(v, "fillRadialGradientColorStops"), i.Factory.addGetterSetter(v, "fillPatternRepeat", "repeat"), i.Factory.addGetterSetter(v, "fillEnabled", !0), i.Factory.addGetterSetter(v, "strokeEnabled", !0), i.Factory.addGetterSetter(v, "shadowEnabled", !0), i.Factory.addGetterSetter(v, "dashEnabled", !0), i.Factory.addGetterSetter(v, "strokeScaleEnabled", !0), i.Factory.addGetterSetter(v, "fillPriority", "color"), i.Factory.addComponentsGetterSetter(v, "fillPatternOffset", ["x", "y"]), i.Factory.addGetterSetter(v, "fillPatternOffsetX", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternOffsetY", 0, (0, r.getNumberValidator)()), i.Factory.addComponentsGetterSetter(v, "fillPatternScale", ["x", "y"]), i.Factory.addGetterSetter(v, "fillPatternScaleX", 1, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternScaleY", 1, (0, r.getNumberValidator)()), i.Factory.addComponentsGetterSetter(v, "fillLinearGradientStartPoint", [
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
})(gt);
Object.defineProperty(He, "__esModule", { value: !0 });
He.Layer = void 0;
const Et = st, an = Zt, ce = nt, On = B, fr = St, Ka = G, qa = gt, Qa = U, Ja = "#", Za = "beforeDraw", to = "draw", es = [
  { x: 0, y: 0 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 }
], eo = es.length;
class Ce extends an.Container {
  constructor(t) {
    super(t), this.canvas = new fr.SceneCanvas(), this.hitCanvas = new fr.HitCanvas({
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
      for (let n = 0; n < eo; n++) {
        const r = es[n], a = this._getIntersection({
          x: t.x + r.x * e,
          y: t.y + r.y * e
        }), o = a.shape;
        if (o)
          return o;
        if (i = !!a.antialiased, !a.antialiased)
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
      const r = Et.Util._rgbToHex(i[0], i[1], i[2]), a = qa.shapes[Ja + r];
      return a ? {
        shape: a
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
    return this._fire(Za, {
      node: this
    }), this.clearBeforeDraw() && r.getContext().clear(), an.Container.prototype.drawScene.call(this, r, e, i), this._fire(to, {
      node: this
    }), this;
  }
  drawHit(t, e) {
    const i = this.getLayer(), n = t || i && i.hitCanvas;
    return i && i.clearBeforeDraw() && i.getHitCanvas().getContext().clear(), an.Container.prototype.drawHit.call(this, n, e), this;
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
He.Layer = Ce;
Ce.prototype.nodeType = "Layer";
(0, Qa._registerNode)(Ce);
On.Factory.addGetterSetter(Ce, "imageSmoothingEnabled", !0);
On.Factory.addGetterSetter(Ce, "clearBeforeDraw", !0);
On.Factory.addGetterSetter(Ce, "hitGraphEnabled", !0, (0, Ka.getBooleanValidator)());
var fi = {};
Object.defineProperty(fi, "__esModule", { value: !0 });
fi.FastLayer = void 0;
const io = st, no = He, ro = U;
class Nn extends no.Layer {
  constructor(t) {
    super(t), this.listening(!1), io.Util.warn('Konva.Fast layer is deprecated. Please use "new Konva.Layer({ listening: false })" instead.');
  }
}
fi.FastLayer = Nn;
Nn.prototype.nodeType = "FastLayer";
(0, ro._registerNode)(Nn);
var we = {};
Object.defineProperty(we, "__esModule", { value: !0 });
we.Group = void 0;
const so = st, ao = Zt, oo = U;
class Ln extends ao.Container {
  _validateAdd(t) {
    const e = t.getType();
    e !== "Group" && e !== "Shape" && so.Util.throw("You may only add groups and shapes to groups.");
  }
}
we.Group = Ln;
Ln.prototype.nodeType = "Group";
(0, oo._registerNode)(Ln);
var xe = {};
Object.defineProperty(xe, "__esModule", { value: !0 });
xe.Animation = void 0;
const on = U, gr = st, ln = function() {
  return on.glob.performance && on.glob.performance.now ? function() {
    return on.glob.performance.now();
  } : function() {
    return (/* @__PURE__ */ new Date()).getTime();
  };
}();
class wt {
  constructor(t, e) {
    this.id = wt.animIdCounter++, this.frame = {
      time: 0,
      timeDiff: 0,
      lastTime: ln(),
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
    return this.stop(), this.frame.timeDiff = 0, this.frame.lastTime = ln(), wt._addAnimation(this), this;
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
      const n = e[i], r = n.layers, a = n.func;
      n._updateFrameObject(ln());
      const o = r.length;
      let l;
      if (a ? l = a.call(n, n.frame) !== !1 : l = !0, !!l)
        for (let h = 0; h < o; h++) {
          const c = r[h];
          c._id !== void 0 && (t[c._id] = c);
        }
    }
    for (const i in t)
      t.hasOwnProperty(i) && t[i].batchDraw();
  }
  static _animationLoop() {
    const t = wt;
    t.animations.length ? (t._runFrames(), gr.Util.requestAnimFrame(t._animationLoop)) : t.animRunning = !1;
  }
  static _handleAnimation() {
    this.animRunning || (this.animRunning = !0, gr.Util.requestAnimFrame(this._animationLoop));
  }
}
xe.Animation = wt;
wt.animations = [];
wt.animIdCounter = 0;
wt.animRunning = !1;
var is = {};
(function(s) {
  Object.defineProperty(s, "__esModule", { value: !0 }), s.Easings = s.Tween = void 0;
  const t = st, e = xe, i = nt, n = U, r = {
    node: 1,
    duration: 1,
    easing: 1,
    onFinish: 1,
    yoyo: 1
  }, a = 1, o = 2, l = 3, h = ["fill", "stroke", "shadowColor"];
  let c = 0;
  class _ {
    constructor(u, m, y, S, w, d, f) {
      this.prop = u, this.propFunc = m, this.begin = S, this._pos = S, this.duration = d, this._change = 0, this.prevPos = 0, this.yoyo = f, this._time = 0, this._position = 0, this._startTime = 0, this._finish = 0, this.func = y, this._change = w - this.begin, this.pause();
    }
    fire(u) {
      const m = this[u];
      m && m();
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
      this.state = a, this.fire("onPause");
    }
    getTimer() {
      return (/* @__PURE__ */ new Date()).getTime();
    }
  }
  class p {
    constructor(u) {
      const m = this, y = u.node, S = y._id, w = u.easing || s.Easings.Linear, d = !!u.yoyo;
      let f, b;
      typeof u.duration > "u" ? f = 0.3 : u.duration === 0 ? f = 1e-3 : f = u.duration, this.node = y, this._id = c++;
      const x = y.getLayer() || (y instanceof n.Konva.Stage ? y.getLayers() : null);
      x || t.Util.error("Tween constructor have `node` that is not in a layer. Please add node into layer first."), this.anim = new e.Animation(function() {
        m.tween.onEnterFrame();
      }, x), this.tween = new _(b, function(P) {
        m._tweenFunc(P);
      }, w, 0, 1, f * 1e3, d), this._addListeners(), p.attrs[S] || (p.attrs[S] = {}), p.attrs[S][this._id] || (p.attrs[S][this._id] = {}), p.tweens[S] || (p.tweens[S] = {});
      for (b in u)
        r[b] === void 0 && this._addAttr(b, u[b]);
      this.reset(), this.onFinish = u.onFinish, this.onReset = u.onReset, this.onUpdate = u.onUpdate;
    }
    _addAttr(u, m) {
      const y = this.node, S = y._id;
      let w, d, f, b, x;
      const P = p.tweens[S][u];
      P && delete p.attrs[S][P][u];
      let v = y.getAttr(u);
      if (t.Util._isArray(m))
        if (w = [], d = Math.max(m.length, v.length), u === "points" && m.length !== v.length && (m.length > v.length ? (b = v, v = t.Util._prepareArrayForTween(v, m, y.closed())) : (f = m, m = t.Util._prepareArrayForTween(m, v, y.closed()))), u.indexOf("fill") === 0)
          for (let E = 0; E < d; E++)
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
          for (let E = 0; E < d; E++)
            w.push(m[E] - v[E]);
      else h.indexOf(u) !== -1 ? (v = t.Util.colorToRGBA(v), x = t.Util.colorToRGBA(m), w = {
        r: x.r - v.r,
        g: x.g - v.g,
        b: x.b - v.b,
        a: x.a - v.a
      }) : w = m - v;
      p.attrs[S][this._id][u] = {
        start: v,
        diff: w,
        end: m,
        trueEnd: f,
        trueStart: b
      }, p.tweens[S][u] = this._id;
    }
    _tweenFunc(u) {
      const m = this.node, y = p.attrs[m._id][this._id];
      let S, w, d, f, b, x, P, v;
      for (S in y) {
        if (w = y[S], d = w.start, f = w.diff, v = w.end, t.Util._isArray(d))
          if (b = [], P = Math.max(d.length, v.length), S.indexOf("fill") === 0)
            for (x = 0; x < P; x++)
              x % 2 === 0 ? b.push((d[x] || 0) + f[x] * u) : b.push("rgba(" + Math.round(d[x].r + f[x].r * u) + "," + Math.round(d[x].g + f[x].g * u) + "," + Math.round(d[x].b + f[x].b * u) + "," + (d[x].a + f[x].a * u) + ")");
          else
            for (x = 0; x < P; x++)
              b.push((d[x] || 0) + f[x] * u);
        else h.indexOf(S) !== -1 ? b = "rgba(" + Math.round(d.r + f.r * u) + "," + Math.round(d.g + f.g * u) + "," + Math.round(d.b + f.b * u) + "," + (d.a + f.a * u) + ")" : b = d + f * u;
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
        const u = this.node, m = p.attrs[u._id][this._id];
        m.points && m.points.trueEnd && u.setAttr("points", m.points.trueEnd), this.onFinish && this.onFinish.call(this);
      }, this.tween.onReset = () => {
        const u = this.node, m = p.attrs[u._id][this._id];
        m.points && m.points.trueStart && u.points(m.points.trueStart), this.onReset && this.onReset();
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
      const u = this.node._id, m = this._id, y = p.tweens[u];
      this.pause(), this.anim && this.anim.stop();
      for (const S in y)
        delete p.tweens[u][S];
      delete p.attrs[u][m], p.tweens[u] && (Object.keys(p.tweens[u]).length === 0 && delete p.tweens[u], Object.keys(p.attrs[u]).length === 0 && delete p.attrs[u]);
    }
  }
  s.Tween = p, p.attrs = {}, p.tweens = {}, i.Node.prototype.to = function(g) {
    const u = g.onFinish;
    g.node = this, g.onFinish = function() {
      this.destroy(), u && u();
    }, new p(g).play();
  }, s.Easings = {
    BackEaseIn(g, u, m, y) {
      return m * (g /= y) * g * ((1.70158 + 1) * g - 1.70158) + u;
    },
    BackEaseOut(g, u, m, y) {
      return m * ((g = g / y - 1) * g * ((1.70158 + 1) * g + 1.70158) + 1) + u;
    },
    BackEaseInOut(g, u, m, y) {
      let S = 1.70158;
      return (g /= y / 2) < 1 ? m / 2 * (g * g * (((S *= 1.525) + 1) * g - S)) + u : m / 2 * ((g -= 2) * g * (((S *= 1.525) + 1) * g + S) + 2) + u;
    },
    ElasticEaseIn(g, u, m, y, S, w) {
      let d = 0;
      return g === 0 ? u : (g /= y) === 1 ? u + m : (w || (w = y * 0.3), !S || S < Math.abs(m) ? (S = m, d = w / 4) : d = w / (2 * Math.PI) * Math.asin(m / S), -(S * Math.pow(2, 10 * (g -= 1)) * Math.sin((g * y - d) * (2 * Math.PI) / w)) + u);
    },
    ElasticEaseOut(g, u, m, y, S, w) {
      let d = 0;
      return g === 0 ? u : (g /= y) === 1 ? u + m : (w || (w = y * 0.3), !S || S < Math.abs(m) ? (S = m, d = w / 4) : d = w / (2 * Math.PI) * Math.asin(m / S), S * Math.pow(2, -10 * g) * Math.sin((g * y - d) * (2 * Math.PI) / w) + m + u);
    },
    ElasticEaseInOut(g, u, m, y, S, w) {
      let d = 0;
      return g === 0 ? u : (g /= y / 2) === 2 ? u + m : (w || (w = y * (0.3 * 1.5)), !S || S < Math.abs(m) ? (S = m, d = w / 4) : d = w / (2 * Math.PI) * Math.asin(m / S), g < 1 ? -0.5 * (S * Math.pow(2, 10 * (g -= 1)) * Math.sin((g * y - d) * (2 * Math.PI) / w)) + u : S * Math.pow(2, -10 * (g -= 1)) * Math.sin((g * y - d) * (2 * Math.PI) / w) * 0.5 + m + u);
    },
    BounceEaseOut(g, u, m, y) {
      return (g /= y) < 1 / 2.75 ? m * (7.5625 * g * g) + u : g < 2 / 2.75 ? m * (7.5625 * (g -= 1.5 / 2.75) * g + 0.75) + u : g < 2.5 / 2.75 ? m * (7.5625 * (g -= 2.25 / 2.75) * g + 0.9375) + u : m * (7.5625 * (g -= 2.625 / 2.75) * g + 0.984375) + u;
    },
    BounceEaseIn(g, u, m, y) {
      return m - s.Easings.BounceEaseOut(y - g, 0, m, y) + u;
    },
    BounceEaseInOut(g, u, m, y) {
      return g < y / 2 ? s.Easings.BounceEaseIn(g * 2, 0, m, y) * 0.5 + u : s.Easings.BounceEaseOut(g * 2 - y, 0, m, y) * 0.5 + m * 0.5 + u;
    },
    EaseIn(g, u, m, y) {
      return m * (g /= y) * g + u;
    },
    EaseOut(g, u, m, y) {
      return -m * (g /= y) * (g - 2) + u;
    },
    EaseInOut(g, u, m, y) {
      return (g /= y / 2) < 1 ? m / 2 * g * g + u : -m / 2 * (--g * (g - 2) - 1) + u;
    },
    StrongEaseIn(g, u, m, y) {
      return m * (g /= y) * g * g * g * g + u;
    },
    StrongEaseOut(g, u, m, y) {
      return m * ((g = g / y - 1) * g * g * g * g + 1) + u;
    },
    StrongEaseInOut(g, u, m, y) {
      return (g /= y / 2) < 1 ? m / 2 * g * g * g * g * g + u : m / 2 * ((g -= 2) * g * g * g * g + 2) + u;
    },
    Linear(g, u, m, y) {
      return m * g / y + u;
    }
  };
})(is);
(function(s) {
  Object.defineProperty(s, "__esModule", { value: !0 }), s.Konva = void 0;
  const t = U, e = st, i = nt, n = Zt, r = Jr, a = He, o = fi, l = we, h = ci, c = gt, _ = xe, p = is, g = Tt, u = St;
  s.Konva = e.Util._assign(t.Konva, {
    Util: e.Util,
    Transform: e.Transform,
    Node: i.Node,
    Container: n.Container,
    Stage: r.Stage,
    stages: r.stages,
    Layer: a.Layer,
    FastLayer: o.FastLayer,
    Group: l.Group,
    DD: h.DD,
    Shape: c.Shape,
    shapes: c.shapes,
    Animation: _.Animation,
    Tween: p.Tween,
    Easings: p.Easings,
    Context: g.Context,
    Canvas: u.Canvas
  }), s.default = s.Konva;
})(Xr);
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
gi.Arc = void 0;
const pi = B, lo = gt, pr = U, _i = G, ho = U;
class Ot extends lo.Shape {
  _sceneFunc(t) {
    const e = pr.Konva.getAngle(this.angle()), i = this.clockwise();
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
    const t = this.innerRadius(), e = this.outerRadius(), i = this.clockwise(), n = pr.Konva.getAngle(i ? 360 - this.angle() : this.angle()), r = Math.cos(Math.min(n, Math.PI)), a = 1, o = Math.sin(Math.min(Math.max(Math.PI, n), 3 * Math.PI / 2)), l = Math.sin(Math.min(n, Math.PI / 2)), h = r * (r > 0 ? t : e), c = a * e, _ = o * (o > 0 ? t : e), p = l * (l > 0 ? e : t);
    return {
      x: h,
      y: i ? -1 * p : _,
      width: c - h,
      height: p - _
    };
  }
}
gi.Arc = Ot;
Ot.prototype._centroid = !0;
Ot.prototype.className = "Arc";
Ot.prototype._attrsAffectingSize = [
  "innerRadius",
  "outerRadius",
  "angle",
  "clockwise"
];
(0, ho._registerNode)(Ot);
pi.Factory.addGetterSetter(Ot, "innerRadius", 0, (0, _i.getNumberValidator)());
pi.Factory.addGetterSetter(Ot, "outerRadius", 0, (0, _i.getNumberValidator)());
pi.Factory.addGetterSetter(Ot, "angle", 0, (0, _i.getNumberValidator)());
pi.Factory.addGetterSetter(Ot, "clockwise", !1, (0, _i.getBooleanValidator)());
var mi = {}, ze = {};
Object.defineProperty(ze, "__esModule", { value: !0 });
ze.Line = void 0;
const yi = B, co = U, uo = gt, ns = G;
function yn(s, t, e, i, n, r, a) {
  const o = Math.sqrt(Math.pow(e - s, 2) + Math.pow(i - t, 2)), l = Math.sqrt(Math.pow(n - e, 2) + Math.pow(r - i, 2)), h = a * o / (o + l), c = a * l / (o + l), _ = e - h * (n - s), p = i - h * (r - t), g = e + c * (n - s), u = i + c * (r - t);
  return [_, p, g, u];
}
function _r(s, t) {
  const e = s.length, i = [];
  for (let n = 2; n < e - 2; n += 2) {
    const r = yn(s[n - 2], s[n - 1], s[n], s[n + 1], s[n + 2], s[n + 3], t);
    isNaN(r[0]) || (i.push(r[0]), i.push(r[1]), i.push(s[n]), i.push(s[n + 1]), i.push(r[2]), i.push(r[3]));
  }
  return i;
}
class Vt extends uo.Shape {
  constructor(t) {
    super(t), this.on("pointsChange.konva tensionChange.konva closedChange.konva bezierChange.konva", function() {
      this._clearCache("tensionPoints");
    });
  }
  _sceneFunc(t) {
    const e = this.points(), i = e.length, n = this.tension(), r = this.closed(), a = this.bezier();
    if (!i)
      return;
    let o = 0;
    if (t.beginPath(), t.moveTo(e[0], e[1]), n !== 0 && i > 4) {
      const l = this.getTensionPoints(), h = l.length;
      for (o = r ? 0 : 4, r || t.quadraticCurveTo(l[0], l[1], l[2], l[3]); o < h - 2; )
        t.bezierCurveTo(l[o++], l[o++], l[o++], l[o++], l[o++], l[o++]);
      r || t.quadraticCurveTo(l[h - 2], l[h - 1], e[i - 2], e[i - 1]);
    } else if (a)
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
    return this.closed() ? this._getTensionPointsClosed() : _r(this.points(), this.tension());
  }
  _getTensionPointsClosed() {
    const t = this.points(), e = t.length, i = this.tension(), n = yn(t[e - 2], t[e - 1], t[0], t[1], t[2], t[3], i), r = yn(t[e - 4], t[e - 3], t[e - 2], t[e - 1], t[0], t[1], i), a = _r(t, i);
    return [n[2], n[3]].concat(a).concat([
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
    let e = t[0], i = t[0], n = t[1], r = t[1], a, o;
    for (let l = 0; l < t.length / 2; l++)
      a = t[l * 2], o = t[l * 2 + 1], e = Math.min(e, a), i = Math.max(i, a), n = Math.min(n, o), r = Math.max(r, o);
    return {
      x: e,
      y: n,
      width: i - e,
      height: r - n
    };
  }
}
ze.Line = Vt;
Vt.prototype.className = "Line";
Vt.prototype._attrsAffectingSize = ["points", "bezier", "tension"];
(0, co._registerNode)(Vt);
yi.Factory.addGetterSetter(Vt, "closed", !1);
yi.Factory.addGetterSetter(Vt, "bezier", !1);
yi.Factory.addGetterSetter(Vt, "tension", 0, (0, ns.getNumberValidator)());
yi.Factory.addGetterSetter(Vt, "points", [], (0, ns.getNumberArrayValidator)());
var Ae = {}, rs = {};
(function(s) {
  Object.defineProperty(s, "__esModule", { value: !0 }), s.t2length = s.getQuadraticArcLength = s.getCubicArcLength = s.binomialCoefficients = s.cValues = s.tValues = void 0, s.tValues = [
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
  ], s.cValues = [
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
  ], s.binomialCoefficients = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]];
  const t = (a, o, l) => {
    let h, c;
    const p = l / 2;
    h = 0;
    for (let g = 0; g < 20; g++)
      c = p * s.tValues[20][g] + p, h += s.cValues[20][g] * i(a, o, c);
    return p * h;
  };
  s.getCubicArcLength = t;
  const e = (a, o, l) => {
    l === void 0 && (l = 1);
    const h = a[0] - 2 * a[1] + a[2], c = o[0] - 2 * o[1] + o[2], _ = 2 * a[1] - 2 * a[0], p = 2 * o[1] - 2 * o[0], g = 4 * (h * h + c * c), u = 4 * (h * _ + c * p), m = _ * _ + p * p;
    if (g === 0)
      return l * Math.sqrt(Math.pow(a[2] - a[0], 2) + Math.pow(o[2] - o[0], 2));
    const y = u / (2 * g), S = m / g, w = l + y, d = S - y * y, f = w * w + d > 0 ? Math.sqrt(w * w + d) : 0, b = y * y + d > 0 ? Math.sqrt(y * y + d) : 0, x = y + Math.sqrt(y * y + d) !== 0 ? d * Math.log(Math.abs((w + f) / (y + b))) : 0;
    return Math.sqrt(g) / 2 * (w * f - y * b + x);
  };
  s.getQuadraticArcLength = e;
  function i(a, o, l) {
    const h = n(1, l, a), c = n(1, l, o), _ = h * h + c * c;
    return Math.sqrt(_);
  }
  const n = (a, o, l) => {
    const h = l.length - 1;
    let c, _;
    if (h === 0)
      return 0;
    if (a === 0) {
      _ = 0;
      for (let p = 0; p <= h; p++)
        _ += s.binomialCoefficients[h][p] * Math.pow(1 - o, h - p) * Math.pow(o, p) * l[p];
      return _;
    } else {
      c = new Array(h);
      for (let p = 0; p < h; p++)
        c[p] = h * (l[p + 1] - l[p]);
      return n(a - 1, o, c);
    }
  }, r = (a, o, l) => {
    let h = 1, c = a / o, _ = (a - l(c)) / o, p = 0;
    for (; h > 1e-3; ) {
      const g = l(c + _), u = Math.abs(a - g) / o;
      if (u < h)
        h = u, c += _;
      else {
        const m = l(c - _), y = Math.abs(a - m) / o;
        y < h ? (h = y, c -= _) : _ /= 2;
      }
      if (p++, p > 500)
        break;
    }
    return c;
  };
  s.t2length = r;
})(rs);
Object.defineProperty(Ae, "__esModule", { value: !0 });
Ae.Path = void 0;
const fo = B, go = U, po = gt, ue = rs;
class ft extends po.Shape {
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
    for (let n = 0; n < e.length; n++) {
      const r = e[n].command, a = e[n].points;
      switch (r) {
        case "L":
          t.lineTo(a[0], a[1]);
          break;
        case "M":
          t.moveTo(a[0], a[1]);
          break;
        case "C":
          t.bezierCurveTo(a[0], a[1], a[2], a[3], a[4], a[5]);
          break;
        case "Q":
          t.quadraticCurveTo(a[0], a[1], a[2], a[3]);
          break;
        case "A":
          const o = a[0], l = a[1], h = a[2], c = a[3], _ = a[4], p = a[5], g = a[6], u = a[7], m = h > c ? h : c, y = h > c ? 1 : h / c, S = h > c ? c / h : 1;
          t.translate(o, l), t.rotate(g), t.scale(y, S), t.arc(0, 0, m, _, _ + p, 1 - u), t.scale(1 / y, 1 / S), t.rotate(-g), t.translate(-o, -l);
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
        const h = l.points[4], c = l.points[5], _ = l.points[4] + c;
        let p = Math.PI / 180;
        if (Math.abs(h - _) < p && (p = Math.abs(h - _)), c < 0)
          for (let g = h - p; g > _; g -= p) {
            const u = ft.getPointOnEllipticalArc(l.points[0], l.points[1], l.points[2], l.points[3], g, 0);
            t.push(u.x, u.y);
          }
        else
          for (let g = h + p; g < _; g += p) {
            const u = ft.getPointOnEllipticalArc(l.points[0], l.points[1], l.points[2], l.points[3], g, 0);
            t.push(u.x, u.y);
          }
      } else if (l.command === "C")
        for (let h = 0; h <= 1; h += 0.01) {
          const c = ft.getPointOnCubicBezier(h, l.start.x, l.start.y, l.points[0], l.points[1], l.points[2], l.points[3], l.points[4], l.points[5]);
          t.push(c.x, c.y);
        }
      else
        t = t.concat(l.points);
    });
    let e = t[0], i = t[0], n = t[1], r = t[1], a, o;
    for (let l = 0; l < t.length / 2; l++)
      a = t[l * 2], o = t[l * 2 + 1], isNaN(a) || (e = Math.min(e, a), i = Math.max(i, a)), isNaN(o) || (n = Math.min(n, o), r = Math.max(r, o));
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
    return ft.getPointAtLengthOfDataArray(t, this.dataArray);
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
    const a = e[n], o = a.points;
    switch (a.command) {
      case "L":
        return ft.getPointOnLine(t, a.start.x, a.start.y, o[0], o[1]);
      case "C":
        return ft.getPointOnCubicBezier((0, ue.t2length)(t, ft.getPathLength(e), (m) => (0, ue.getCubicArcLength)([a.start.x, o[0], o[2], o[4]], [a.start.y, o[1], o[3], o[5]], m)), a.start.x, a.start.y, o[0], o[1], o[2], o[3], o[4], o[5]);
      case "Q":
        return ft.getPointOnQuadraticBezier((0, ue.t2length)(t, ft.getPathLength(e), (m) => (0, ue.getQuadraticArcLength)([a.start.x, o[0], o[2]], [a.start.y, o[1], o[3]], m)), a.start.x, a.start.y, o[0], o[1], o[2], o[3]);
      case "A":
        const l = o[0], h = o[1], c = o[2], _ = o[3], p = o[5], g = o[6];
        let u = o[4];
        return u += p * t / a.pathLength, ft.getPointOnEllipticalArc(l, h, c, _, u, g);
    }
    return null;
  }
  static getPointOnLine(t, e, i, n, r, a, o) {
    a = a ?? e, o = o ?? i;
    const l = this.getLineLength(e, i, n, r);
    if (l < 1e-10)
      return { x: e, y: i };
    if (n === e)
      return { x: a, y: o + (r > i ? t : -t) };
    const h = (r - i) / (n - e), c = Math.sqrt(t * t / (1 + h * h)) * (n < e ? -1 : 1), _ = h * c;
    if (Math.abs(o - i - h * (a - e)) < 1e-10)
      return { x: a + c, y: o + _ };
    const p = ((a - e) * (n - e) + (o - i) * (r - i)) / (l * l), g = e + p * (n - e), u = i + p * (r - i), m = this.getLineLength(a, o, g, u), y = Math.sqrt(t * t - m * m), S = Math.sqrt(y * y / (1 + h * h)) * (n < e ? -1 : 1), w = h * S;
    return { x: g + S, y: u + w };
  }
  static getPointOnCubicBezier(t, e, i, n, r, a, o, l, h) {
    function c(y) {
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
    const u = l * c(t) + a * _(t) + n * p(t) + e * g(t), m = h * c(t) + o * _(t) + r * p(t) + i * g(t);
    return { x: u, y: m };
  }
  static getPointOnQuadraticBezier(t, e, i, n, r, a, o) {
    function l(g) {
      return g * g;
    }
    function h(g) {
      return 2 * g * (1 - g);
    }
    function c(g) {
      return (1 - g) * (1 - g);
    }
    const _ = a * l(t) + n * h(t) + e * c(t), p = o * l(t) + r * h(t) + i * c(t);
    return { x: _, y: p };
  }
  static getPointOnEllipticalArc(t, e, i, n, r, a) {
    const o = Math.cos(a), l = Math.sin(a), h = {
      x: i * Math.cos(r),
      y: n * Math.sin(r)
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
    for (let _ = 0; _ < i.length; _++)
      e = e.replace(new RegExp(i[_], "g"), "|" + i[_]);
    const n = e.split("|"), r = [], a = [];
    let o = 0, l = 0;
    const h = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
    let c;
    for (let _ = 1; _ < n.length; _++) {
      let p = n[_], g = p.charAt(0);
      for (p = p.slice(1), a.length = 0; c = h.exec(p); )
        a.push(c[0]);
      const u = [];
      for (let m = 0, y = a.length; m < y; m++) {
        if (a[m] === "00") {
          u.push(0, 0);
          continue;
        }
        const S = parseFloat(a[m]);
        isNaN(S) ? u.push(0) : u.push(S);
      }
      for (; u.length > 0 && !isNaN(u[0]); ) {
        let m = "", y = [];
        const S = o, w = l;
        let d, f, b, x, P, v, E, A, M, k;
        switch (g) {
          case "l":
            o += u.shift(), l += u.shift(), m = "L", y.push(o, l);
            break;
          case "L":
            o = u.shift(), l = u.shift(), y.push(o, l);
            break;
          case "m":
            const R = u.shift(), L = u.shift();
            if (o += R, l += L, m = "M", r.length > 2 && r[r.length - 1].command === "z") {
              for (let F = r.length - 2; F >= 0; F--)
                if (r[F].command === "M") {
                  o = r[F].points[0] + R, l = r[F].points[1] + L;
                  break;
                }
            }
            y.push(o, l), g = "l";
            break;
          case "M":
            o = u.shift(), l = u.shift(), m = "M", y.push(o, l), g = "L";
            break;
          case "h":
            o += u.shift(), m = "L", y.push(o, l);
            break;
          case "H":
            o = u.shift(), m = "L", y.push(o, l);
            break;
          case "v":
            l += u.shift(), m = "L", y.push(o, l);
            break;
          case "V":
            l = u.shift(), m = "L", y.push(o, l);
            break;
          case "C":
            y.push(u.shift(), u.shift(), u.shift(), u.shift()), o = u.shift(), l = u.shift(), y.push(o, l);
            break;
          case "c":
            y.push(o + u.shift(), l + u.shift(), o + u.shift(), l + u.shift()), o += u.shift(), l += u.shift(), m = "C", y.push(o, l);
            break;
          case "S":
            f = o, b = l, d = r[r.length - 1], d.command === "C" && (f = o + (o - d.points[2]), b = l + (l - d.points[3])), y.push(f, b, u.shift(), u.shift()), o = u.shift(), l = u.shift(), m = "C", y.push(o, l);
            break;
          case "s":
            f = o, b = l, d = r[r.length - 1], d.command === "C" && (f = o + (o - d.points[2]), b = l + (l - d.points[3])), y.push(f, b, o + u.shift(), l + u.shift()), o += u.shift(), l += u.shift(), m = "C", y.push(o, l);
            break;
          case "Q":
            y.push(u.shift(), u.shift()), o = u.shift(), l = u.shift(), y.push(o, l);
            break;
          case "q":
            y.push(o + u.shift(), l + u.shift()), o += u.shift(), l += u.shift(), m = "Q", y.push(o, l);
            break;
          case "T":
            f = o, b = l, d = r[r.length - 1], d.command === "Q" && (f = o + (o - d.points[0]), b = l + (l - d.points[1])), o = u.shift(), l = u.shift(), m = "Q", y.push(f, b, o, l);
            break;
          case "t":
            f = o, b = l, d = r[r.length - 1], d.command === "Q" && (f = o + (o - d.points[0]), b = l + (l - d.points[1])), o += u.shift(), l += u.shift(), m = "Q", y.push(f, b, o, l);
            break;
          case "A":
            x = u.shift(), P = u.shift(), v = u.shift(), E = u.shift(), A = u.shift(), M = o, k = l, o = u.shift(), l = u.shift(), m = "A", y = this.convertEndpointToCenterParameterization(M, k, o, l, E, A, x, P, v);
            break;
          case "a":
            x = u.shift(), P = u.shift(), v = u.shift(), E = u.shift(), A = u.shift(), M = o, k = l, o += u.shift(), l += u.shift(), m = "A", y = this.convertEndpointToCenterParameterization(M, k, o, l, E, A, x, P, v);
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
    let r, a, o, l;
    const h = ft;
    switch (i) {
      case "L":
        return h.getLineLength(t, e, n[0], n[1]);
      case "C":
        return (0, ue.getCubicArcLength)([t, n[0], n[2], n[4]], [e, n[1], n[3], n[5]], 1);
      case "Q":
        return (0, ue.getQuadraticArcLength)([t, n[0], n[2]], [e, n[1], n[3]], 1);
      case "A":
        r = 0;
        const c = n[4], _ = n[5], p = n[4] + _;
        let g = Math.PI / 180;
        if (Math.abs(c - p) < g && (g = Math.abs(c - p)), a = h.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], c, 0), _ < 0)
          for (l = c - g; l > p; l -= g)
            o = h.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], l, 0), r += h.getLineLength(a.x, a.y, o.x, o.y), a = o;
        else
          for (l = c + g; l < p; l += g)
            o = h.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], l, 0), r += h.getLineLength(a.x, a.y, o.x, o.y), a = o;
        return o = h.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], p, 0), r += h.getLineLength(a.x, a.y, o.x, o.y), r;
    }
    return 0;
  }
  static convertEndpointToCenterParameterization(t, e, i, n, r, a, o, l, h) {
    const c = h * (Math.PI / 180), _ = Math.cos(c) * (t - i) / 2 + Math.sin(c) * (e - n) / 2, p = -1 * Math.sin(c) * (t - i) / 2 + Math.cos(c) * (e - n) / 2, g = _ * _ / (o * o) + p * p / (l * l);
    g > 1 && (o *= Math.sqrt(g), l *= Math.sqrt(g));
    let u = Math.sqrt((o * o * (l * l) - o * o * (p * p) - l * l * (_ * _)) / (o * o * (p * p) + l * l * (_ * _)));
    r === a && (u *= -1), isNaN(u) && (u = 0);
    const m = u * o * p / l, y = u * -l * _ / o, S = (t + i) / 2 + Math.cos(c) * m - Math.sin(c) * y, w = (e + n) / 2 + Math.sin(c) * m + Math.cos(c) * y, d = function(A) {
      return Math.sqrt(A[0] * A[0] + A[1] * A[1]);
    }, f = function(A, M) {
      return (A[0] * M[0] + A[1] * M[1]) / (d(A) * d(M));
    }, b = function(A, M) {
      return (A[0] * M[1] < A[1] * M[0] ? -1 : 1) * Math.acos(f(A, M));
    }, x = b([1, 0], [(_ - m) / o, (p - y) / l]), P = [(_ - m) / o, (p - y) / l], v = [(-1 * _ - m) / o, (-1 * p - y) / l];
    let E = b(P, v);
    return f(P, v) <= -1 && (E = Math.PI), f(P, v) >= 1 && (E = 0), a === 0 && E > 0 && (E = E - 2 * Math.PI), a === 1 && E < 0 && (E = E + 2 * Math.PI), [S, w, o, l, x, E, c, a];
  }
}
Ae.Path = ft;
ft.prototype.className = "Path";
ft.prototype._attrsAffectingSize = ["data"];
(0, go._registerNode)(ft);
fo.Factory.addGetterSetter(ft, "data");
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.Arrow = void 0;
const bi = B, _o = ze, ss = G, mo = U, mr = Ae;
class ee extends _o.Line {
  _sceneFunc(t) {
    super._sceneFunc(t);
    const e = Math.PI * 2, i = this.points();
    let n = i;
    const r = this.tension() !== 0 && i.length > 4;
    r && (n = this.getTensionPoints());
    const a = this.pointerLength(), o = i.length;
    let l, h;
    if (r) {
      const p = [
        n[n.length - 4],
        n[n.length - 3],
        n[n.length - 2],
        n[n.length - 1],
        i[o - 2],
        i[o - 1]
      ], g = mr.Path.calcLength(n[n.length - 4], n[n.length - 3], "C", p), u = mr.Path.getPointOnQuadraticBezier(Math.min(1, 1 - a / g), p[0], p[1], p[2], p[3], p[4], p[5]);
      l = i[o - 2] - u.x, h = i[o - 1] - u.y;
    } else
      l = i[o - 2] - i[o - 4], h = i[o - 1] - i[o - 3];
    const c = (Math.atan2(h, l) + e) % e, _ = this.pointerWidth();
    this.pointerAtEnding() && (t.save(), t.beginPath(), t.translate(i[o - 2], i[o - 1]), t.rotate(c), t.moveTo(0, 0), t.lineTo(-a, _ / 2), t.lineTo(-a, -_ / 2), t.closePath(), t.restore(), this.__fillStroke(t)), this.pointerAtBeginning() && (t.save(), t.beginPath(), t.translate(i[0], i[1]), r ? (l = (n[0] + n[2]) / 2 - i[0], h = (n[1] + n[3]) / 2 - i[1]) : (l = i[2] - i[0], h = i[3] - i[1]), t.rotate((Math.atan2(-h, -l) + e) % e), t.moveTo(0, 0), t.lineTo(-a, _ / 2), t.lineTo(-a, -_ / 2), t.closePath(), t.restore(), this.__fillStroke(t));
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
(0, mo._registerNode)(ee);
bi.Factory.addGetterSetter(ee, "pointerLength", 10, (0, ss.getNumberValidator)());
bi.Factory.addGetterSetter(ee, "pointerWidth", 10, (0, ss.getNumberValidator)());
bi.Factory.addGetterSetter(ee, "pointerAtBeginning", !1);
bi.Factory.addGetterSetter(ee, "pointerAtEnding", !0);
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
vi.Circle = void 0;
const yo = B, bo = gt, vo = G, So = U;
class ke extends bo.Shape {
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
vi.Circle = ke;
ke.prototype._centroid = !0;
ke.prototype.className = "Circle";
ke.prototype._attrsAffectingSize = ["radius"];
(0, So._registerNode)(ke);
yo.Factory.addGetterSetter(ke, "radius", 0, (0, vo.getNumberValidator)());
var Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.Ellipse = void 0;
const $n = B, Co = gt, as = G, wo = U;
class Ht extends Co.Shape {
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
(0, wo._registerNode)(Ht);
$n.Factory.addComponentsGetterSetter(Ht, "radius", ["x", "y"]);
$n.Factory.addGetterSetter(Ht, "radiusX", 0, (0, as.getNumberValidator)());
$n.Factory.addGetterSetter(Ht, "radiusY", 0, (0, as.getNumberValidator)());
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.Image = void 0;
const hn = st, ie = B, xo = gt, Ao = U, We = G;
let xt = class os extends xo.Shape {
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
    let a;
    if (r) {
      const o = this.attrs.cropWidth, l = this.attrs.cropHeight;
      o && l ? a = [
        r,
        this.cropX(),
        this.cropY(),
        o,
        l,
        0,
        0,
        e,
        i
      ] : a = [r, 0, 0, e, i];
    }
    (this.hasFill() || this.hasStroke() || n) && (t.beginPath(), n ? hn.Util.drawRoundedRectPath(t, e, i, n) : t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this)), r && (n && t.clip(), t.drawImage.apply(t, a));
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
      const r = new os({
        image: n
      });
      e(r);
    }, n.onerror = i, n.crossOrigin = "Anonymous", n.src = t;
  }
};
Ci.Image = xt;
xt.prototype.className = "Image";
(0, Ao._registerNode)(xt);
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
const wi = B, ko = gt, Po = we, Gn = G, ls = U, hs = [
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
], Eo = "Change.konva", Mo = "none", bn = "up", vn = "right", Sn = "down", Cn = "left", To = hs.length;
class Dn extends Po.Group {
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
    for (i = 0; i < To; i++)
      t.on(hs[i] + Eo, n);
  }
  getWidth() {
    return this.getText().width();
  }
  getHeight() {
    return this.getText().height();
  }
  _sync() {
    let t = this.getText(), e = this.getTag(), i, n, r, a, o, l, h;
    if (t && e) {
      switch (i = t.width(), n = t.height(), r = e.pointerDirection(), a = e.pointerWidth(), h = e.pointerHeight(), o = 0, l = 0, r) {
        case bn:
          o = i / 2, l = -1 * h;
          break;
        case vn:
          o = i + a, l = n / 2;
          break;
        case Sn:
          o = i / 2, l = n + h;
          break;
        case Cn:
          o = -1 * a, l = n / 2;
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
ye.Label = Dn;
Dn.prototype.className = "Label";
(0, ls._registerNode)(Dn);
class ne extends ko.Shape {
  _sceneFunc(t) {
    const e = this.width(), i = this.height(), n = this.pointerDirection(), r = this.pointerWidth(), a = this.pointerHeight(), o = this.cornerRadius();
    let l = 0, h = 0, c = 0, _ = 0;
    typeof o == "number" ? l = h = c = _ = Math.min(o, e / 2, i / 2) : (l = Math.min(o[0] || 0, e / 2, i / 2), h = Math.min(o[1] || 0, e / 2, i / 2), _ = Math.min(o[2] || 0, e / 2, i / 2), c = Math.min(o[3] || 0, e / 2, i / 2)), t.beginPath(), t.moveTo(l, 0), n === bn && (t.lineTo((e - r) / 2, 0), t.lineTo(e / 2, -1 * a), t.lineTo((e + r) / 2, 0)), t.lineTo(e - h, 0), t.arc(e - h, h, h, Math.PI * 3 / 2, 0, !1), n === vn && (t.lineTo(e, (i - a) / 2), t.lineTo(e + r, i / 2), t.lineTo(e, (i + a) / 2)), t.lineTo(e, i - _), t.arc(e - _, i - _, _, 0, Math.PI / 2, !1), n === Sn && (t.lineTo((e + r) / 2, i), t.lineTo(e / 2, i + a), t.lineTo((e - r) / 2, i)), t.lineTo(c, i), t.arc(c, i - c, c, Math.PI / 2, Math.PI, !1), n === Cn && (t.lineTo(0, (i + a) / 2), t.lineTo(-1 * r, i / 2), t.lineTo(0, (i - a) / 2)), t.lineTo(0, l), t.arc(l, l, l, Math.PI, Math.PI * 3 / 2, !1), t.closePath(), t.fillStrokeShape(this);
  }
  getSelfRect() {
    let t = 0, e = 0, i = this.pointerWidth(), n = this.pointerHeight(), r = this.pointerDirection(), a = this.width(), o = this.height();
    return r === bn ? (e -= n, o += n) : r === Sn ? o += n : r === Cn ? (t -= i * 1.5, a += i) : r === vn && (a += i * 1.5), {
      x: t,
      y: e,
      width: a,
      height: o
    };
  }
}
ye.Tag = ne;
ne.prototype.className = "Tag";
(0, ls._registerNode)(ne);
wi.Factory.addGetterSetter(ne, "pointerDirection", Mo);
wi.Factory.addGetterSetter(ne, "pointerWidth", 0, (0, Gn.getNumberValidator)());
wi.Factory.addGetterSetter(ne, "pointerHeight", 0, (0, Gn.getNumberValidator)());
wi.Factory.addGetterSetter(ne, "cornerRadius", 0, (0, Gn.getNumberOrArrayOfNumbersValidator)(4));
var je = {};
Object.defineProperty(je, "__esModule", { value: !0 });
je.Rect = void 0;
const Ro = B, Fo = gt, Oo = U, No = st, Lo = G;
class xi extends Fo.Shape {
  _sceneFunc(t) {
    const e = this.cornerRadius(), i = this.width(), n = this.height();
    t.beginPath(), e ? No.Util.drawRoundedRectPath(t, i, n, e) : t.rect(0, 0, i, n), t.closePath(), t.fillStrokeShape(this);
  }
}
je.Rect = xi;
xi.prototype.className = "Rect";
(0, Oo._registerNode)(xi);
Ro.Factory.addGetterSetter(xi, "cornerRadius", 0, (0, Lo.getNumberOrArrayOfNumbersValidator)(4));
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.RegularPolygon = void 0;
const ds = B, $o = gt, cs = G, Go = U;
class re extends $o.Shape {
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
    return t.forEach((a) => {
      e = Math.min(e, a.x), i = Math.max(i, a.x), n = Math.min(n, a.y), r = Math.max(r, a.y);
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
Ai.RegularPolygon = re;
re.prototype.className = "RegularPolygon";
re.prototype._centroid = !0;
re.prototype._attrsAffectingSize = ["radius"];
(0, Go._registerNode)(re);
ds.Factory.addGetterSetter(re, "radius", 0, (0, cs.getNumberValidator)());
ds.Factory.addGetterSetter(re, "sides", 0, (0, cs.getNumberValidator)());
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.Ring = void 0;
const us = B, Do = gt, fs = G, Io = U, yr = Math.PI * 2;
class se extends Do.Shape {
  _sceneFunc(t) {
    t.beginPath(), t.arc(0, 0, this.innerRadius(), 0, yr, !1), t.moveTo(this.outerRadius(), 0), t.arc(0, 0, this.outerRadius(), yr, 0, !0), t.closePath(), t.fillStrokeShape(this);
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
ki.Ring = se;
se.prototype.className = "Ring";
se.prototype._centroid = !0;
se.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"];
(0, Io._registerNode)(se);
us.Factory.addGetterSetter(se, "innerRadius", 0, (0, fs.getNumberValidator)());
us.Factory.addGetterSetter(se, "outerRadius", 0, (0, fs.getNumberValidator)());
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.Sprite = void 0;
const ae = B, Uo = gt, Bo = xe, gs = G, Vo = U;
class At extends Uo.Shape {
  constructor(t) {
    super(t), this._updated = !0, this.anim = new Bo.Animation(() => {
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
    const e = this.animation(), i = this.frameIndex(), n = i * 4, r = this.animations()[e], a = this.frameOffsets(), o = r[n + 0], l = r[n + 1], h = r[n + 2], c = r[n + 3], _ = this.image();
    if ((this.hasFill() || this.hasStroke()) && (t.beginPath(), t.rect(0, 0, h, c), t.closePath(), t.fillStrokeShape(this)), _)
      if (a) {
        const p = a[e], g = i * 2;
        t.drawImage(_, o, l, h, c, p[g + 0], p[g + 1], h, c);
      } else
        t.drawImage(_, o, l, h, c, 0, 0, h, c);
  }
  _hitFunc(t) {
    const e = this.animation(), i = this.frameIndex(), n = i * 4, r = this.animations()[e], a = this.frameOffsets(), o = r[n + 2], l = r[n + 3];
    if (t.beginPath(), a) {
      const h = a[e], c = i * 2;
      t.rect(h[c + 0], h[c + 1], o, l);
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
Pi.Sprite = At;
At.prototype.className = "Sprite";
(0, Vo._registerNode)(At);
ae.Factory.addGetterSetter(At, "animation");
ae.Factory.addGetterSetter(At, "animations");
ae.Factory.addGetterSetter(At, "frameOffsets");
ae.Factory.addGetterSetter(At, "image");
ae.Factory.addGetterSetter(At, "frameIndex", 0, (0, gs.getNumberValidator)());
ae.Factory.addGetterSetter(At, "frameRate", 17, (0, gs.getNumberValidator)());
ae.Factory.backCompat(At, {
  index: "frameIndex",
  getIndex: "getFrameIndex",
  setIndex: "setFrameIndex"
});
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.Star = void 0;
const In = B, Ho = gt, Un = G, zo = U;
class zt extends Ho.Shape {
  _sceneFunc(t) {
    const e = this.innerRadius(), i = this.outerRadius(), n = this.numPoints();
    t.beginPath(), t.moveTo(0, 0 - i);
    for (let r = 1; r < n * 2; r++) {
      const a = r % 2 === 0 ? i : e, o = a * Math.sin(r * Math.PI / n), l = -1 * a * Math.cos(r * Math.PI / n);
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
(0, zo._registerNode)(zt);
In.Factory.addGetterSetter(zt, "numPoints", 5, (0, Un.getNumberValidator)());
In.Factory.addGetterSetter(zt, "innerRadius", 0, (0, Un.getNumberValidator)());
In.Factory.addGetterSetter(zt, "outerRadius", 0, (0, Un.getNumberValidator)());
var Pe = {};
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.Text = void 0;
Pe.stringToArray = Kt;
const wn = st, _t = B, Wo = gt, dn = U, Wt = G, jo = U;
function Kt(s) {
  return [...s].reduce((t, e, i, n) => {
    if (new RegExp("\\p{Emoji}", "u").test(e)) {
      const r = n[i + 1];
      r && new RegExp("\\p{Emoji_Modifier}|\\u200D", "u").test(r) ? (t.push(e + r), n[i + 1] = "") : t.push(e);
    } else new RegExp("\\p{Regional_Indicator}{2}", "u").test(e + (n[i + 1] || "")) ? t.push(e + n[i + 1]) : i > 0 && new RegExp("\\p{Mn}|\\p{Me}|\\p{Mc}", "u").test(e) ? t[t.length - 1] += e : e && t.push(e);
    return t;
  }, []);
}
const fe = "auto", Yo = "center", ps = "inherit", Me = "justify", Xo = "Change.konva", Ko = "2d", br = "-", _s = "left", qo = "text", Qo = "Text", Jo = "top", Zo = "bottom", vr = "middle", ms = "normal", tl = "px ", Ke = " ", el = "right", Sr = "rtl", il = "word", nl = "char", Cr = "none", cn = "…", ys = [
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
], rl = ys.length;
function sl(s) {
  return s.split(",").map((t) => {
    t = t.trim();
    const e = t.indexOf(" ") >= 0, i = t.indexOf('"') >= 0 || t.indexOf("'") >= 0;
    return e && !i && (t = `"${t}"`), t;
  }).join(", ");
}
let qe;
function un() {
  return qe || (qe = wn.Util.createCanvasElement().getContext(Ko), qe);
}
function al(s) {
  s.fillText(this._partialText, this._partialTextX, this._partialTextY);
}
function ol(s) {
  s.setAttr("miterLimit", 2), s.strokeText(this._partialText, this._partialTextX, this._partialTextY);
}
function ll(s) {
  return s = s || {}, !s.fillLinearGradientColorStops && !s.fillRadialGradientColorStops && !s.fillPatternImage && (s.fill = s.fill || "black"), s;
}
class ot extends Wo.Shape {
  constructor(t) {
    super(ll(t)), this._partialTextX = 0, this._partialTextY = 0;
    for (let e = 0; e < rl; e++)
      this.on(ys[e] + Xo, this._setTextData);
    this._setTextData();
  }
  _sceneFunc(t) {
    const e = this.textArr, i = e.length;
    if (!this.text())
      return;
    let n = this.padding(), r = this.fontSize(), a = this.lineHeight() * r, o = this.verticalAlign(), l = this.direction(), h = 0, c = this.align(), _ = this.getWidth(), p = this.letterSpacing(), g = this.fill(), u = this.textDecoration(), m = u.indexOf("underline") !== -1, y = u.indexOf("line-through") !== -1, S;
    l = l === ps ? t.direction : l;
    let w = a / 2, d = vr;
    if (dn.Konva._fixTextRendering) {
      const f = this.measureSize("M");
      d = "alphabetic", w = (f.fontBoundingBoxAscent - f.fontBoundingBoxDescent) / 2 + a / 2;
    }
    for (l === Sr && t.setAttr("direction", l), t.setAttr("font", this._getContextFont()), t.setAttr("textBaseline", d), t.setAttr("textAlign", _s), o === vr ? h = (this.getHeight() - i * a - n * 2) / 2 : o === Zo && (h = this.getHeight() - i * a - n * 2), t.translate(n, h + n), S = 0; S < i; S++) {
      let f = 0, b = 0;
      const x = e[S], P = x.text, v = x.width, E = x.lastInParagraph;
      if (t.save(), c === el ? f += _ - v - n * 2 : c === Yo && (f += (_ - v - n * 2) / 2), m) {
        t.save(), t.beginPath();
        const A = dn.Konva._fixTextRendering ? Math.round(r / 4) : Math.round(r / 2), M = f, k = w + b + A;
        t.moveTo(M, k);
        const R = c === Me && !E ? _ - n * 2 : v;
        t.lineTo(M + Math.round(R), k), t.lineWidth = r / 15;
        const L = this._getLinearGradient();
        t.strokeStyle = L || g, t.stroke(), t.restore();
      }
      if (y) {
        t.save(), t.beginPath();
        const A = dn.Konva._fixTextRendering ? -Math.round(r / 4) : 0;
        t.moveTo(f, w + b + A);
        const M = c === Me && !E ? _ - n * 2 : v;
        t.lineTo(f + Math.round(M), w + b + A), t.lineWidth = r / 15;
        const k = this._getLinearGradient();
        t.strokeStyle = k || g, t.stroke(), t.restore();
      }
      if (l !== Sr && (p !== 0 || c === Me)) {
        const A = P.split(" ").length - 1, M = Kt(P);
        for (let k = 0; k < M.length; k++) {
          const R = M[k];
          R === " " && !E && c === Me && (f += (_ - n * 2 - v) / A), this._partialTextX = f, this._partialTextY = w + b, this._partialText = R, t.fillStrokeShape(this), f += this.measureSize(R).width + p;
        }
      } else
        p !== 0 && t.setAttr("letterSpacing", `${p}px`), this._partialTextX = f, this._partialTextY = w + b, this._partialText = P, t.fillStrokeShape(this);
      t.restore(), i > 1 && (w += a);
    }
  }
  _hitFunc(t) {
    const e = this.getWidth(), i = this.getHeight();
    t.beginPath(), t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this);
  }
  setText(t) {
    const e = wn.Util._isString(t) ? t : t == null ? "" : t + "";
    return this._setAttr(qo, e), this;
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
    return wn.Util.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height."), this.textHeight;
  }
  measureSize(t) {
    var e, i, n, r, a, o, l, h, c, _, p;
    let g = un(), u = this.fontSize(), m;
    g.save(), g.font = this._getContextFont(), m = g.measureText(t), g.restore();
    const y = u / 100;
    return {
      actualBoundingBoxAscent: (e = m.actualBoundingBoxAscent) !== null && e !== void 0 ? e : 71.58203125 * y,
      actualBoundingBoxDescent: (i = m.actualBoundingBoxDescent) !== null && i !== void 0 ? i : 0,
      actualBoundingBoxLeft: (n = m.actualBoundingBoxLeft) !== null && n !== void 0 ? n : -7.421875 * y,
      actualBoundingBoxRight: (r = m.actualBoundingBoxRight) !== null && r !== void 0 ? r : 75.732421875 * y,
      alphabeticBaseline: (a = m.alphabeticBaseline) !== null && a !== void 0 ? a : 0,
      emHeightAscent: (o = m.emHeightAscent) !== null && o !== void 0 ? o : 100 * y,
      emHeightDescent: (l = m.emHeightDescent) !== null && l !== void 0 ? l : -20 * y,
      fontBoundingBoxAscent: (h = m.fontBoundingBoxAscent) !== null && h !== void 0 ? h : 91 * y,
      fontBoundingBoxDescent: (c = m.fontBoundingBoxDescent) !== null && c !== void 0 ? c : 21 * y,
      hangingBaseline: (_ = m.hangingBaseline) !== null && _ !== void 0 ? _ : 72.80000305175781 * y,
      ideographicBaseline: (p = m.ideographicBaseline) !== null && p !== void 0 ? p : -21 * y,
      width: m.width,
      height: u
    };
  }
  _getContextFont() {
    return this.fontStyle() + Ke + this.fontVariant() + Ke + (this.fontSize() + tl) + sl(this.fontFamily());
  }
  _addTextLine(t) {
    this.align() === Me && (t = t.trim());
    const i = this._getTextWidth(t);
    return this.textArr.push({
      text: t,
      width: i,
      lastInParagraph: !1
    });
  }
  _getTextWidth(t) {
    const e = this.letterSpacing(), i = t.length;
    return un().measureText(t).width + e * i;
  }
  _setTextData() {
    let t = this.text().split(`
`), e = +this.fontSize(), i = 0, n = this.lineHeight() * e, r = this.attrs.width, a = this.attrs.height, o = r !== fe && r !== void 0, l = a !== fe && a !== void 0, h = this.padding(), c = r - h * 2, _ = a - h * 2, p = 0, g = this.wrap(), u = g !== Cr, m = g !== nl && u, y = this.ellipsis();
    this.textArr = [], un().font = this._getContextFont();
    const S = y ? this._getTextWidth(cn) : 0;
    for (let w = 0, d = t.length; w < d; ++w) {
      let f = t[w], b = this._getTextWidth(f);
      if (o && b > c)
        for (; f.length > 0; ) {
          let x = 0, P = Kt(f).length, v = "", E = 0;
          for (; x < P; ) {
            const A = x + P >>> 1, M = Kt(f), k = M.slice(0, A + 1).join(""), R = this._getTextWidth(k);
            (y && l && p + n > _ ? R + S : R) <= c ? (x = A + 1, v = k, E = R) : P = A;
          }
          if (v) {
            if (m) {
              const k = Kt(f), R = Kt(v), L = k[R.length], F = L === Ke || L === br;
              let K;
              if (F && E <= c)
                K = R.length;
              else {
                const Y = R.lastIndexOf(Ke), $ = R.lastIndexOf(br);
                K = Math.max(Y, $) + 1;
              }
              K > 0 && (x = K, v = k.slice(0, x).join(""), E = this._getTextWidth(v));
            }
            if (v = v.trimRight(), this._addTextLine(v), i = Math.max(i, E), p += n, this._shouldHandleEllipsis(p)) {
              this._tryToAddEllipsisToLastLine();
              break;
            }
            if (f = Kt(f).slice(x).join("").trimLeft(), f.length > 0 && (b = this._getTextWidth(f), b <= c)) {
              this._addTextLine(f), p += n, i = Math.max(i, b);
              break;
            }
          } else
            break;
        }
      else
        this._addTextLine(f), p += n, i = Math.max(i, b), this._shouldHandleEllipsis(p) && w < d - 1 && this._tryToAddEllipsisToLastLine();
      if (this.textArr[this.textArr.length - 1] && (this.textArr[this.textArr.length - 1].lastInParagraph = !0), l && p + n > _)
        break;
    }
    this.textHeight = e, this.textWidth = i;
  }
  _shouldHandleEllipsis(t) {
    const e = +this.fontSize(), i = this.lineHeight() * e, n = this.attrs.height, r = n !== fe && n !== void 0, a = this.padding(), o = n - a * 2;
    return !(this.wrap() !== Cr) || r && t + i > o;
  }
  _tryToAddEllipsisToLastLine() {
    const t = this.attrs.width, e = t !== fe && t !== void 0, i = this.padding(), n = t - i * 2, r = this.ellipsis(), a = this.textArr[this.textArr.length - 1];
    !a || !r || (e && (this._getTextWidth(a.text + cn) < n || (a.text = a.text.slice(0, a.text.length - 3))), this.textArr.splice(this.textArr.length - 1, 1), this._addTextLine(a.text + cn));
  }
  getStrokeScaleEnabled() {
    return !0;
  }
  _useBufferCanvas() {
    const t = this.textDecoration().indexOf("underline") !== -1 || this.textDecoration().indexOf("line-through") !== -1, e = this.hasShadow();
    return t && e ? !0 : super._useBufferCanvas();
  }
}
Pe.Text = ot;
ot.prototype._fillFunc = al;
ot.prototype._strokeFunc = ol;
ot.prototype.className = Qo;
ot.prototype._attrsAffectingSize = [
  "text",
  "fontSize",
  "padding",
  "wrap",
  "lineHeight",
  "letterSpacing"
];
(0, jo._registerNode)(ot);
_t.Factory.overWriteSetter(ot, "width", (0, Wt.getNumberOrAutoValidator)());
_t.Factory.overWriteSetter(ot, "height", (0, Wt.getNumberOrAutoValidator)());
_t.Factory.addGetterSetter(ot, "direction", ps);
_t.Factory.addGetterSetter(ot, "fontFamily", "Arial");
_t.Factory.addGetterSetter(ot, "fontSize", 12, (0, Wt.getNumberValidator)());
_t.Factory.addGetterSetter(ot, "fontStyle", ms);
_t.Factory.addGetterSetter(ot, "fontVariant", ms);
_t.Factory.addGetterSetter(ot, "padding", 0, (0, Wt.getNumberValidator)());
_t.Factory.addGetterSetter(ot, "align", _s);
_t.Factory.addGetterSetter(ot, "verticalAlign", Jo);
_t.Factory.addGetterSetter(ot, "lineHeight", 1, (0, Wt.getNumberValidator)());
_t.Factory.addGetterSetter(ot, "wrap", il);
_t.Factory.addGetterSetter(ot, "ellipsis", !1, (0, Wt.getBooleanValidator)());
_t.Factory.addGetterSetter(ot, "letterSpacing", 0, (0, Wt.getNumberValidator)());
_t.Factory.addGetterSetter(ot, "text", "", (0, Wt.getStringValidator)());
_t.Factory.addGetterSetter(ot, "textDecoration", "");
var Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
Mi.TextPath = void 0;
const fn = st, Ct = B, hl = gt, Te = Ae, gn = Pe, bs = G, dl = U, cl = "", vs = "normal";
function Ss(s) {
  s.fillText(this.partialText, 0, 0);
}
function Cs(s) {
  s.strokeText(this.partialText, 0, 0);
}
class pt extends hl.Shape {
  constructor(t) {
    super(t), this.dummyCanvas = fn.Util.createCanvasElement(), this.dataArray = [], this._readDataAttribute(), this.on("dataChange.konva", function() {
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
    for (let a = 0; a < r.length; a++) {
      t.save();
      const o = r[a].p0;
      t.translate(o.x, o.y), t.rotate(r[a].rotation), this.partialText = r[a].text, t.fillStrokeShape(this), e === "underline" && (a === 0 && t.moveTo(0, n / 2 + 1), t.lineTo(n, n / 2 + 1)), t.restore();
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
    return fn.Util.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height."), this.textHeight;
  }
  setText(t) {
    return gn.Text.prototype.setText.call(this, t);
  }
  _getContextFont() {
    return gn.Text.prototype._getContextFont.call(this);
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
    const i = this.letterSpacing(), n = this.align(), r = this.kerningFunc(), a = Math.max(this.textWidth + ((this.attrs.text || "").length - 1) * i, 0);
    let o = 0;
    n === "center" && (o = Math.max(0, this.pathLength / 2 - a / 2)), n === "right" && (o = Math.max(0, this.pathLength - a));
    const l = (0, gn.stringToArray)(this.text());
    let h = o;
    for (let c = 0; c < l.length; c++) {
      const _ = this._getPointAtLength(h);
      if (!_)
        return;
      let p = this._getTextSize(l[c]).width + i;
      if (l[c] === " " && n === "justify") {
        const w = this.text().split(" ").length - 1;
        p += (this.pathLength - a) / w;
      }
      const g = this._getPointAtLength(h + p);
      if (!g)
        return;
      const u = Te.Path.getLineLength(_.x, _.y, g.x, g.y);
      let m = 0;
      if (r)
        try {
          m = r(l[c - 1], l[c]) * this.fontSize();
        } catch {
          m = 0;
        }
      _.x += m, g.x += m, this.textWidth += m;
      const y = Te.Path.getPointOnLine(m + u / 2, _.x, _.y, g.x, g.y), S = Math.atan2(g.y - _.y, g.x - _.x);
      this.glyphInfo.push({
        transposeX: y.x,
        transposeY: y.y,
        text: l[c],
        rotation: S,
        p0: _,
        p1: g
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
    let e = t[0] || 0, i = t[0] || 0, n = t[1] || 0, r = t[1] || 0, a, o;
    for (let h = 0; h < t.length / 2; h++)
      a = t[h * 2], o = t[h * 2 + 1], e = Math.min(e, a), i = Math.max(i, a), n = Math.min(n, o), r = Math.max(r, o);
    const l = this.fontSize();
    return {
      x: e - l / 2,
      y: n - l / 2,
      width: i - e + l,
      height: r - n + l
    };
  }
  destroy() {
    return fn.Util.releaseCanvas(this.dummyCanvas), super.destroy();
  }
}
Mi.TextPath = pt;
pt.prototype._fillFunc = Ss;
pt.prototype._strokeFunc = Cs;
pt.prototype._fillFuncHit = Ss;
pt.prototype._strokeFuncHit = Cs;
pt.prototype.className = "TextPath";
pt.prototype._attrsAffectingSize = ["text", "fontSize", "data"];
(0, dl._registerNode)(pt);
Ct.Factory.addGetterSetter(pt, "data");
Ct.Factory.addGetterSetter(pt, "fontFamily", "Arial");
Ct.Factory.addGetterSetter(pt, "fontSize", 12, (0, bs.getNumberValidator)());
Ct.Factory.addGetterSetter(pt, "fontStyle", vs);
Ct.Factory.addGetterSetter(pt, "align", "left");
Ct.Factory.addGetterSetter(pt, "letterSpacing", 0, (0, bs.getNumberValidator)());
Ct.Factory.addGetterSetter(pt, "textBaseline", "middle");
Ct.Factory.addGetterSetter(pt, "fontVariant", vs);
Ct.Factory.addGetterSetter(pt, "text", cl);
Ct.Factory.addGetterSetter(pt, "textDecoration", "");
Ct.Factory.addGetterSetter(pt, "kerningFunc", void 0);
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.Transformer = void 0;
const X = st, j = B, wr = nt, ul = gt, fl = je, xr = we, vt = U, jt = G, gl = U, ws = "tr-konva", pl = [
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
].map((s) => s + `.${ws}`).join(" "), Ar = "nodesRect", _l = [
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
], ml = {
  "top-left": -45,
  "top-center": 0,
  "top-right": 45,
  "middle-right": -90,
  "middle-left": 90,
  "bottom-left": -135,
  "bottom-center": 180,
  "bottom-right": 135
}, yl = "ontouchstart" in vt.Konva._global;
function bl(s, t, e) {
  if (s === "rotater")
    return e;
  t += X.Util.degToRad(ml[s] || 0);
  const i = (X.Util.radToDeg(t) % 360 + 360) % 360;
  return X.Util._inRange(i, 315 + 22.5, 360) || X.Util._inRange(i, 0, 22.5) ? "ns-resize" : X.Util._inRange(i, 45 - 22.5, 45 + 22.5) ? "nesw-resize" : X.Util._inRange(i, 90 - 22.5, 90 + 22.5) ? "ew-resize" : X.Util._inRange(i, 135 - 22.5, 135 + 22.5) ? "nwse-resize" : X.Util._inRange(i, 180 - 22.5, 180 + 22.5) ? "ns-resize" : X.Util._inRange(i, 225 - 22.5, 225 + 22.5) ? "nesw-resize" : X.Util._inRange(i, 270 - 22.5, 270 + 22.5) ? "ew-resize" : X.Util._inRange(i, 315 - 22.5, 315 + 22.5) ? "nwse-resize" : (X.Util.error("Transformer has unknown angle for cursor detection: " + i), "pointer");
}
const si = [
  "top-left",
  "top-center",
  "top-right",
  "middle-right",
  "middle-left",
  "bottom-left",
  "bottom-center",
  "bottom-right"
];
function vl(s) {
  return {
    x: s.x + s.width / 2 * Math.cos(s.rotation) + s.height / 2 * Math.sin(-s.rotation),
    y: s.y + s.height / 2 * Math.cos(s.rotation) + s.width / 2 * Math.sin(s.rotation)
  };
}
function xs(s, t, e) {
  const i = e.x + (s.x - e.x) * Math.cos(t) - (s.y - e.y) * Math.sin(t), n = e.y + (s.x - e.x) * Math.sin(t) + (s.y - e.y) * Math.cos(t);
  return {
    ...s,
    rotation: s.rotation + t,
    x: i,
    y: n
  };
}
function Sl(s, t) {
  const e = vl(s);
  return xs(s, t, e);
}
function Cl(s, t, e) {
  let i = t;
  for (let n = 0; n < s.length; n++) {
    const r = vt.Konva.getAngle(s[n]), a = Math.abs(r - t) % (Math.PI * 2);
    Math.min(a, Math.PI * 2 - a) < e && (i = r);
  }
  return i;
}
let xn = 0;
class H extends xr.Group {
  constructor(t) {
    super(t), this._movingAnchorName = null, this._transforming = !1, this._createElements(), this._handleMouseMove = this._handleMouseMove.bind(this), this._handleMouseUp = this._handleMouseUp.bind(this), this.update = this.update.bind(this), this.on(pl, this.update), this.getNode() && this.update();
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
    return ws + this._id;
  }
  setNodes(t = []) {
    this._nodes && this._nodes.length && this.detach();
    const e = t.filter((n) => n.isAncestorOf(this) ? (X.Util.error("Konva.Transformer cannot be an a child of the node you are trying to attach"), !1) : !0);
    return this._nodes = t = e, t.length === 1 && this.useSingleNodeRotation() ? this.rotation(t[0].getAbsoluteRotation()) : this.rotation(0), this._nodes.forEach((n) => {
      const r = () => {
        this.nodes().length === 1 && this.useSingleNodeRotation() && this.rotation(this.nodes()[0].getAbsoluteRotation()), this._resetTransformCache(), !this._transforming && !this.isDragging() && this.update();
      };
      if (n._attrsAffectingSize.length) {
        const a = n._attrsAffectingSize.map((o) => o + "Change." + this._getEventNamespace()).join(" ");
        n.on(a, r);
      }
      n.on(_l.map((a) => a + `.${this._getEventNamespace()}`).join(" "), r), n.on(`absoluteTransformChange.${this._getEventNamespace()}`, r), this._proxyDrag(n);
    }), this._resetTransformCache(), !!this.findOne(".top-left") && this.update(), this;
  }
  _proxyDrag(t) {
    let e;
    t.on(`dragstart.${this._getEventNamespace()}`, (i) => {
      e = t.getAbsolutePosition(), !this.isDragging() && t !== this.findOne(".back") && this.startDrag(i, !1);
    }), t.on(`dragmove.${this._getEventNamespace()}`, (i) => {
      if (!e)
        return;
      const n = t.getAbsolutePosition(), r = n.x - e.x, a = n.y - e.y;
      this.nodes().forEach((o) => {
        if (o === t || o.isDragging())
          return;
        const l = o.getAbsolutePosition();
        o.setAbsolutePosition({
          x: l.x + r,
          y: l.y + a
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
    this._clearCache(Ar), this._clearCache("transform"), this._clearSelfAndDescendantCache("absoluteTransform");
  }
  _getNodeRect() {
    return this._getCache(Ar, this.__getNodeRect);
  }
  __getNodeShape(t, e = this.rotation(), i) {
    const n = t.getClientRect({
      skipTransform: !0,
      skipShadow: !0,
      skipStroke: this.ignoreStroke()
    }), r = t.getAbsoluteScale(i), a = t.getAbsolutePosition(i), o = n.x * r.x - t.offsetX() * r.x, l = n.y * r.y - t.offsetY() * r.y, h = (vt.Konva.getAngle(t.getAbsoluteRotation()) + Math.PI * 2) % (Math.PI * 2), c = {
      x: a.x + o * Math.cos(h) + l * Math.sin(-h),
      y: a.y + l * Math.cos(h) + o * Math.sin(h),
      width: n.width * r.x,
      height: n.height * r.y,
      rotation: h
    };
    return xs(c, -vt.Konva.getAngle(e), {
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
      const c = h.getClientRect({
        skipTransform: !0,
        skipShadow: !0,
        skipStroke: this.ignoreStroke()
      }), _ = [
        { x: c.x, y: c.y },
        { x: c.x + c.width, y: c.y },
        { x: c.x + c.width, y: c.y + c.height },
        { x: c.x, y: c.y + c.height }
      ], p = h.getAbsoluteTransform();
      _.forEach(function(g) {
        const u = p.point(g);
        e.push(u);
      });
    });
    const i = new X.Transform();
    i.rotate(-vt.Konva.getAngle(this.rotation()));
    let n = 1 / 0, r = 1 / 0, a = -1 / 0, o = -1 / 0;
    e.forEach(function(h) {
      const c = i.point(h);
      n === void 0 && (n = a = c.x, r = o = c.y), n = Math.min(n, c.x), r = Math.min(r, c.y), a = Math.max(a, c.x), o = Math.max(o, c.y);
    }), i.invert();
    const l = i.point({ x: n, y: r });
    return {
      x: l.x,
      y: l.y,
      width: a - n,
      height: o - r,
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
    this._createBack(), si.forEach((t) => {
      this._createAnchor(t);
    }), this._createAnchor("rotater");
  }
  _createAnchor(t) {
    const e = new fl.Rect({
      stroke: "rgb(0, 161, 255)",
      fill: "white",
      strokeWidth: 1,
      name: t + " _anchor",
      dragDistance: 0,
      draggable: !0,
      hitStrokeWidth: yl ? 10 : "auto"
    }), i = this;
    e.on("mousedown touchstart", function(n) {
      i._handleMouseDown(n);
    }), e.on("dragstart", (n) => {
      e.stopDrag(), n.cancelBubble = !0;
    }), e.on("dragend", (n) => {
      n.cancelBubble = !0;
    }), e.on("mouseenter", () => {
      const n = vt.Konva.getAngle(this.rotation()), r = this.rotateAnchorCursor(), a = bl(t, n, r);
      e.getStage().content && (e.getStage().content.style.cursor = a), this._cursorChange = !0;
    }), e.on("mouseout", () => {
      e.getStage().content && (e.getStage().content.style.cursor = ""), this._cursorChange = !1;
    }), this.add(e);
  }
  _createBack() {
    const t = new ul.Shape({
      name: "back",
      width: 0,
      height: 0,
      draggable: !0,
      sceneFunc(e, i) {
        const n = i.getParent(), r = n.padding();
        e.beginPath(), e.rect(-r, -r, i.width() + r * 2, i.height() + r * 2), e.moveTo(i.width() / 2, -r), n.rotateEnabled() && n.rotateLineVisible() && e.lineTo(i.width() / 2, -n.rotateAnchorOffset() * X.Util._sign(i.height()) - r), e.fillStrokeShape(i);
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
    const a = t.target.getAbsolutePosition(), o = t.target.getStage().getPointerPosition();
    this._anchorDragOffset = {
      x: o.x - a.x,
      y: o.y - a.y
    }, xn++, this._fire("transformstart", { evt: t.evt, target: this.getNode() }), this._nodes.forEach((l) => {
      l._fire("transformstart", { evt: t.evt, target: l });
    });
  }
  _handleMouseMove(t) {
    let e, i, n;
    const r = this.findOne("." + this._movingAnchorName), a = r.getStage();
    a.setPointersPositions(t);
    const o = a.getPointerPosition();
    let l = {
      x: o.x - this._anchorDragOffset.x,
      y: o.y - this._anchorDragOffset.y
    };
    const h = r.getAbsolutePosition();
    this.anchorDragBoundFunc() && (l = this.anchorDragBoundFunc()(h, l, t)), r.setAbsolutePosition(l);
    const c = r.getAbsolutePosition();
    if (h.x === c.x && h.y === c.y)
      return;
    if (this._movingAnchorName === "rotater") {
      const w = this._getNodeRect();
      e = r.x() - w.width / 2, i = -r.y() + w.height / 2;
      let d = Math.atan2(-i, e) + Math.PI / 2;
      w.height < 0 && (d -= Math.PI);
      const b = vt.Konva.getAngle(this.rotation()) + d, x = vt.Konva.getAngle(this.rotationSnapTolerance()), v = Cl(this.rotationSnaps(), b, x) - w.rotation, E = Sl(w, v);
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
        const d = this.findOne(".top-left").x() > w.x ? -1 : 1, f = this.findOne(".top-left").y() > w.y ? -1 : 1;
        e = n * this.cos * d, i = n * this.sin * f, this.findOne(".top-left").x(w.x - e), this.findOne(".top-left").y(w.y - i);
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
        const d = this.findOne(".top-right").x() < w.x ? -1 : 1, f = this.findOne(".top-right").y() > w.y ? -1 : 1;
        e = n * this.cos * d, i = n * this.sin * f, this.findOne(".top-right").x(w.x + e), this.findOne(".top-right").y(w.y - i);
      }
      var u = r.position();
      this.findOne(".top-left").y(u.y), this.findOne(".bottom-right").x(u.x);
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
        const d = w.x < r.x() ? -1 : 1, f = r.y() < w.y ? -1 : 1;
        e = n * this.cos * d, i = n * this.sin * f, r.x(w.x - e), r.y(w.y + i);
      }
      u = r.position(), this.findOne(".top-left").x(u.x), this.findOne(".bottom-right").y(u.y);
    } else if (this._movingAnchorName === "bottom-center")
      this.findOne(".bottom-right").y(r.y());
    else if (this._movingAnchorName === "bottom-right" && p) {
      const w = g ? {
        x: this.width() / 2,
        y: this.height() / 2
      } : {
        x: this.findOne(".top-left").x(),
        y: this.findOne(".top-left").y()
      };
      n = Math.sqrt(Math.pow(r.x() - w.x, 2) + Math.pow(r.y() - w.y, 2));
      const d = this.findOne(".bottom-right").x() < w.x ? -1 : 1, f = this.findOne(".bottom-right").y() < w.y ? -1 : 1;
      e = n * this.cos * d, i = n * this.sin * f, this.findOne(".bottom-right").x(w.x + e), this.findOne(".bottom-right").y(w.y + i);
    }
    if (g = this.centeredScaling() || t.altKey, g) {
      const w = this.findOne(".top-left"), d = this.findOne(".bottom-right"), f = w.x(), b = w.y(), x = this.getWidth() - d.x(), P = this.getHeight() - d.y();
      d.move({
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
      xn--, this._fire("transformend", { evt: t, target: i }), (e = this.getLayer()) === null || e === void 0 || e.batchDraw(), i && this._nodes.forEach((n) => {
        var r;
        n._fire("transformend", { evt: t, target: n }), (r = n.getLayer()) === null || r === void 0 || r.batchDraw();
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
    const r = new X.Transform();
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
      p ? t = p : X.Util.warn("boundBoxFunc returned falsy. You should return new bound rect from it!");
    }
    const a = 1e7, o = new X.Transform();
    o.translate(i.x, i.y), o.rotate(i.rotation), o.scale(i.width / a, i.height / a);
    const l = new X.Transform(), h = t.width / a, c = t.height / a;
    this.flipEnabled() === !1 ? (l.translate(t.x, t.y), l.rotate(t.rotation), l.translate(t.width < 0 ? t.width : 0, t.height < 0 ? t.height : 0), l.scale(Math.abs(h), Math.abs(c))) : (l.translate(t.x, t.y), l.rotate(t.rotation), l.scale(h, c));
    const _ = l.multiply(o.invert());
    this._nodes.forEach((p) => {
      var g;
      const u = p.getParent().getAbsoluteTransform(), m = p.getTransform().copy();
      m.translate(p.offsetX(), p.offsetY());
      const y = new X.Transform();
      y.multiply(u.copy().invert()).multiply(_).multiply(u).multiply(m);
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
    const i = e.width, n = e.height, r = this.enabledAnchors(), a = this.resizeEnabled(), o = this.padding(), l = this.anchorSize(), h = this.find("._anchor");
    h.forEach((_) => {
      _.setAttrs({
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
      visible: a && r.indexOf("top-left") >= 0
    }), this._batchChangeChild(".top-center", {
      x: i / 2,
      y: 0,
      offsetY: l / 2 + o,
      visible: a && r.indexOf("top-center") >= 0
    }), this._batchChangeChild(".top-right", {
      x: i,
      y: 0,
      offsetX: l / 2 - o,
      offsetY: l / 2 + o,
      visible: a && r.indexOf("top-right") >= 0
    }), this._batchChangeChild(".middle-left", {
      x: 0,
      y: n / 2,
      offsetX: l / 2 + o,
      visible: a && r.indexOf("middle-left") >= 0
    }), this._batchChangeChild(".middle-right", {
      x: i,
      y: n / 2,
      offsetX: l / 2 - o,
      visible: a && r.indexOf("middle-right") >= 0
    }), this._batchChangeChild(".bottom-left", {
      x: 0,
      y: n,
      offsetX: l / 2 + o,
      offsetY: l / 2 - o,
      visible: a && r.indexOf("bottom-left") >= 0
    }), this._batchChangeChild(".bottom-center", {
      x: i / 2,
      y: n,
      offsetY: l / 2 - o,
      visible: a && r.indexOf("bottom-center") >= 0
    }), this._batchChangeChild(".bottom-right", {
      x: i,
      y: n,
      offsetX: l / 2 - o,
      offsetY: l / 2 - o,
      visible: a && r.indexOf("bottom-right") >= 0
    }), this._batchChangeChild(".rotater", {
      x: i / 2,
      y: -this.rotateAnchorOffset() * X.Util._sign(n) - o,
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
    c && h.forEach((_) => {
      c(_);
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
    return this.getStage() && this._cursorChange && this.getStage().content && (this.getStage().content.style.cursor = ""), xr.Group.prototype.destroy.call(this), this.detach(), this._removeEvents(), this;
  }
  toObject() {
    return wr.Node.prototype.toObject.call(this);
  }
  clone(t) {
    return wr.Node.prototype.clone.call(this, t);
  }
  getClientRect() {
    return this.nodes().length > 0 ? super.getClientRect() : { x: 0, y: 0, width: 0, height: 0 };
  }
}
Ti.Transformer = H;
H.isTransforming = () => xn > 0;
function wl(s) {
  return s instanceof Array || X.Util.warn("enabledAnchors value should be an array"), s instanceof Array && s.forEach(function(t) {
    si.indexOf(t) === -1 && X.Util.warn("Unknown anchor name: " + t + ". Available names are: " + si.join(", "));
  }), s || [];
}
H.prototype.className = "Transformer";
(0, gl._registerNode)(H);
j.Factory.addGetterSetter(H, "enabledAnchors", si, wl);
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
const Fi = B, xl = gt, Al = U, As = G, kl = U;
class Nt extends xl.Shape {
  _sceneFunc(t) {
    t.beginPath(), t.arc(0, 0, this.radius(), 0, Al.Konva.getAngle(this.angle()), this.clockwise()), t.lineTo(0, 0), t.closePath(), t.fillStrokeShape(this);
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
Ri.Wedge = Nt;
Nt.prototype.className = "Wedge";
Nt.prototype._centroid = !0;
Nt.prototype._attrsAffectingSize = ["radius"];
(0, kl._registerNode)(Nt);
Fi.Factory.addGetterSetter(Nt, "radius", 0, (0, As.getNumberValidator)());
Fi.Factory.addGetterSetter(Nt, "angle", 0, (0, As.getNumberValidator)());
Fi.Factory.addGetterSetter(Nt, "clockwise", !1);
Fi.Factory.backCompat(Nt, {
  angleDeg: "angle",
  getAngleDeg: "getAngle",
  setAngleDeg: "setAngle"
});
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.Blur = void 0;
const kr = B, Pl = nt, El = G;
function Pr() {
  this.r = 0, this.g = 0, this.b = 0, this.a = 0, this.next = null;
}
const Ml = [
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
], Tl = [
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
function Rl(s, t) {
  const e = s.data, i = s.width, n = s.height;
  let r, a, o, l, h, c, _, p, g, u, m, y, S, w, d, f, b, x, P, v;
  const E = t + t + 1, A = i - 1, M = n - 1, k = t + 1, R = k * (k + 1) / 2, L = new Pr(), F = Ml[t], K = Tl[t];
  let Y = null, $ = L, W = null, I = null;
  for (let O = 1; O < E; O++)
    $ = $.next = new Pr(), O === k && (Y = $);
  $.next = L, o = a = 0;
  for (let O = 0; O < n; O++) {
    y = S = w = d = l = h = c = _ = 0, p = k * (f = e[a]), g = k * (b = e[a + 1]), u = k * (x = e[a + 2]), m = k * (P = e[a + 3]), l += R * f, h += R * b, c += R * x, _ += R * P, $ = L;
    for (let z = 0; z < k; z++)
      $.r = f, $.g = b, $.b = x, $.a = P, $ = $.next;
    for (let z = 1; z < k; z++)
      r = a + ((A < z ? A : z) << 2), l += ($.r = f = e[r]) * (v = k - z), h += ($.g = b = e[r + 1]) * v, c += ($.b = x = e[r + 2]) * v, _ += ($.a = P = e[r + 3]) * v, y += f, S += b, w += x, d += P, $ = $.next;
    W = L, I = Y;
    for (let z = 0; z < i; z++)
      e[a + 3] = P = _ * F >> K, P !== 0 ? (P = 255 / P, e[a] = (l * F >> K) * P, e[a + 1] = (h * F >> K) * P, e[a + 2] = (c * F >> K) * P) : e[a] = e[a + 1] = e[a + 2] = 0, l -= p, h -= g, c -= u, _ -= m, p -= W.r, g -= W.g, u -= W.b, m -= W.a, r = o + ((r = z + t + 1) < A ? r : A) << 2, y += W.r = e[r], S += W.g = e[r + 1], w += W.b = e[r + 2], d += W.a = e[r + 3], l += y, h += S, c += w, _ += d, W = W.next, p += f = I.r, g += b = I.g, u += x = I.b, m += P = I.a, y -= f, S -= b, w -= x, d -= P, I = I.next, a += 4;
    o += i;
  }
  for (let O = 0; O < i; O++) {
    S = w = d = y = h = c = _ = l = 0, a = O << 2, p = k * (f = e[a]), g = k * (b = e[a + 1]), u = k * (x = e[a + 2]), m = k * (P = e[a + 3]), l += R * f, h += R * b, c += R * x, _ += R * P, $ = L;
    for (let rt = 0; rt < k; rt++)
      $.r = f, $.g = b, $.b = x, $.a = P, $ = $.next;
    let z = i;
    for (let rt = 1; rt <= t; rt++)
      a = z + O << 2, l += ($.r = f = e[a]) * (v = k - rt), h += ($.g = b = e[a + 1]) * v, c += ($.b = x = e[a + 2]) * v, _ += ($.a = P = e[a + 3]) * v, y += f, S += b, w += x, d += P, $ = $.next, rt < M && (z += i);
    a = O, W = L, I = Y;
    for (let rt = 0; rt < n; rt++)
      r = a << 2, e[r + 3] = P = _ * F >> K, P > 0 ? (P = 255 / P, e[r] = (l * F >> K) * P, e[r + 1] = (h * F >> K) * P, e[r + 2] = (c * F >> K) * P) : e[r] = e[r + 1] = e[r + 2] = 0, l -= p, h -= g, c -= u, _ -= m, p -= W.r, g -= W.g, u -= W.b, m -= W.a, r = O + ((r = rt + k) < M ? r : M) * i << 2, l += y += W.r = e[r], h += S += W.g = e[r + 1], c += w += W.b = e[r + 2], _ += d += W.a = e[r + 3], W = W.next, p += f = I.r, g += b = I.g, u += x = I.b, m += P = I.a, y -= f, S -= b, w -= x, d -= P, I = I.next, a += i;
  }
}
const Fl = function(t) {
  const e = Math.round(this.blurRadius());
  e > 0 && Rl(t, e);
};
Oi.Blur = Fl;
kr.Factory.addGetterSetter(Pl.Node, "blurRadius", 0, (0, El.getNumberValidator)(), kr.Factory.afterSetFilter);
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.Brighten = void 0;
const Er = B, Ol = nt, Nl = G, Ll = function(s) {
  const t = this.brightness() * 255, e = s.data, i = e.length;
  for (let n = 0; n < i; n += 4)
    e[n] += t, e[n + 1] += t, e[n + 2] += t;
};
Ni.Brighten = Ll;
Er.Factory.addGetterSetter(Ol.Node, "brightness", 0, (0, Nl.getNumberValidator)(), Er.Factory.afterSetFilter);
var Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
Li.Contrast = void 0;
const Mr = B, $l = nt, Gl = G, Dl = function(s) {
  const t = Math.pow((this.contrast() + 100) / 100, 2), e = s.data, i = e.length;
  let n = 150, r = 150, a = 150;
  for (let o = 0; o < i; o += 4)
    n = e[o], r = e[o + 1], a = e[o + 2], n /= 255, n -= 0.5, n *= t, n += 0.5, n *= 255, r /= 255, r -= 0.5, r *= t, r += 0.5, r *= 255, a /= 255, a -= 0.5, a *= t, a += 0.5, a *= 255, n = n < 0 ? 0 : n > 255 ? 255 : n, r = r < 0 ? 0 : r > 255 ? 255 : r, a = a < 0 ? 0 : a > 255 ? 255 : a, e[o] = n, e[o + 1] = r, e[o + 2] = a;
};
Li.Contrast = Dl;
Mr.Factory.addGetterSetter($l.Node, "contrast", 0, (0, Gl.getNumberValidator)(), Mr.Factory.afterSetFilter);
var $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
$i.Emboss = void 0;
const Ut = B, Gi = nt, Il = st, ks = G, Ul = function(s) {
  const t = this.embossStrength() * 10, e = this.embossWhiteLevel() * 255, i = this.embossDirection(), n = this.embossBlend(), r = s.data, a = s.width, o = s.height, l = a * 4;
  let h = 0, c = 0, _ = o;
  switch (i) {
    case "top-left":
      h = -1, c = -1;
      break;
    case "top":
      h = -1, c = 0;
      break;
    case "top-right":
      h = -1, c = 1;
      break;
    case "right":
      h = 0, c = 1;
      break;
    case "bottom-right":
      h = 1, c = 1;
      break;
    case "bottom":
      h = 1, c = 0;
      break;
    case "bottom-left":
      h = 1, c = -1;
      break;
    case "left":
      h = 0, c = -1;
      break;
    default:
      Il.Util.error("Unknown emboss direction: " + i);
  }
  do {
    const p = (_ - 1) * l;
    let g = h;
    _ + g < 1 && (g = 0), _ + g > o && (g = 0);
    const u = (_ - 1 + g) * a * 4;
    let m = a;
    do {
      const y = p + (m - 1) * 4;
      let S = c;
      m + S < 1 && (S = 0), m + S > a && (S = 0);
      const w = u + (m - 1 + S) * 4, d = r[y] - r[w], f = r[y + 1] - r[w + 1], b = r[y + 2] - r[w + 2];
      let x = d;
      const P = x > 0 ? x : -x, v = f > 0 ? f : -f, E = b > 0 ? b : -b;
      if (v > P && (x = f), E > P && (x = b), x *= t, n) {
        const A = r[y] + x, M = r[y + 1] + x, k = r[y + 2] + x;
        r[y] = A > 255 ? 255 : A < 0 ? 0 : A, r[y + 1] = M > 255 ? 255 : M < 0 ? 0 : M, r[y + 2] = k > 255 ? 255 : k < 0 ? 0 : k;
      } else {
        let A = e - x;
        A < 0 ? A = 0 : A > 255 && (A = 255), r[y] = r[y + 1] = r[y + 2] = A;
      }
    } while (--m);
  } while (--_);
};
$i.Emboss = Ul;
Ut.Factory.addGetterSetter(Gi.Node, "embossStrength", 0.5, (0, ks.getNumberValidator)(), Ut.Factory.afterSetFilter);
Ut.Factory.addGetterSetter(Gi.Node, "embossWhiteLevel", 0.5, (0, ks.getNumberValidator)(), Ut.Factory.afterSetFilter);
Ut.Factory.addGetterSetter(Gi.Node, "embossDirection", "top-left", void 0, Ut.Factory.afterSetFilter);
Ut.Factory.addGetterSetter(Gi.Node, "embossBlend", !1, void 0, Ut.Factory.afterSetFilter);
var Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.Enhance = void 0;
const Tr = B, Bl = nt, Vl = G;
function pn(s, t, e, i, n) {
  const r = e - t, a = n - i;
  if (r === 0)
    return i + a / 2;
  if (a === 0)
    return i;
  let o = (s - t) / r;
  return o = a * o + i, o;
}
const Hl = function(s) {
  const t = s.data, e = t.length;
  let i = t[0], n = i, r, a = t[1], o = a, l, h = t[2], c = h, _;
  const p = this.enhance();
  if (p === 0)
    return;
  for (let d = 0; d < e; d += 4)
    r = t[d + 0], r < i ? i = r : r > n && (n = r), l = t[d + 1], l < a ? a = l : l > o && (o = l), _ = t[d + 2], _ < h ? h = _ : _ > c && (c = _);
  n === i && (n = 255, i = 0), o === a && (o = 255, a = 0), c === h && (c = 255, h = 0);
  let g, u, m, y, S, w;
  if (p > 0)
    g = n + p * (255 - n), u = i - p * (i - 0), m = o + p * (255 - o), y = a - p * (a - 0), S = c + p * (255 - c), w = h - p * (h - 0);
  else {
    const d = (n + i) * 0.5;
    g = n + p * (n - d), u = i + p * (i - d);
    const f = (o + a) * 0.5;
    m = o + p * (o - f), y = a + p * (a - f);
    const b = (c + h) * 0.5;
    S = c + p * (c - b), w = h + p * (h - b);
  }
  for (let d = 0; d < e; d += 4)
    t[d + 0] = pn(t[d + 0], i, n, u, g), t[d + 1] = pn(t[d + 1], a, o, y, m), t[d + 2] = pn(t[d + 2], h, c, w, S);
};
Di.Enhance = Hl;
Tr.Factory.addGetterSetter(Bl.Node, "enhance", 0, (0, Vl.getNumberValidator)(), Tr.Factory.afterSetFilter);
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
Ii.Grayscale = void 0;
const zl = function(s) {
  const t = s.data, e = t.length;
  for (let i = 0; i < e; i += 4) {
    const n = 0.34 * t[i] + 0.5 * t[i + 1] + 0.16 * t[i + 2];
    t[i] = n, t[i + 1] = n, t[i + 2] = n;
  }
};
Ii.Grayscale = zl;
var Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.HSL = void 0;
const be = B, Bn = nt, Vn = G;
be.Factory.addGetterSetter(Bn.Node, "hue", 0, (0, Vn.getNumberValidator)(), be.Factory.afterSetFilter);
be.Factory.addGetterSetter(Bn.Node, "saturation", 0, (0, Vn.getNumberValidator)(), be.Factory.afterSetFilter);
be.Factory.addGetterSetter(Bn.Node, "luminance", 0, (0, Vn.getNumberValidator)(), be.Factory.afterSetFilter);
const Wl = function(s) {
  const t = s.data, e = t.length, i = 1, n = Math.pow(2, this.saturation()), r = Math.abs(this.hue() + 360) % 360, a = this.luminance() * 127, o = i * n * Math.cos(r * Math.PI / 180), l = i * n * Math.sin(r * Math.PI / 180), h = 0.299 * i + 0.701 * o + 0.167 * l, c = 0.587 * i - 0.587 * o + 0.33 * l, _ = 0.114 * i - 0.114 * o - 0.497 * l, p = 0.299 * i - 0.299 * o - 0.328 * l, g = 0.587 * i + 0.413 * o + 0.035 * l, u = 0.114 * i - 0.114 * o + 0.293 * l, m = 0.299 * i - 0.3 * o + 1.25 * l, y = 0.587 * i - 0.586 * o - 1.05 * l, S = 0.114 * i + 0.886 * o - 0.2 * l;
  let w, d, f, b;
  for (let x = 0; x < e; x += 4)
    w = t[x + 0], d = t[x + 1], f = t[x + 2], b = t[x + 3], t[x + 0] = h * w + c * d + _ * f + a, t[x + 1] = p * w + g * d + u * f + a, t[x + 2] = m * w + y * d + S * f + a, t[x + 3] = b;
};
Ui.HSL = Wl;
var Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.HSV = void 0;
const ve = B, Hn = nt, zn = G, jl = function(s) {
  const t = s.data, e = t.length, i = Math.pow(2, this.value()), n = Math.pow(2, this.saturation()), r = Math.abs(this.hue() + 360) % 360, a = i * n * Math.cos(r * Math.PI / 180), o = i * n * Math.sin(r * Math.PI / 180), l = 0.299 * i + 0.701 * a + 0.167 * o, h = 0.587 * i - 0.587 * a + 0.33 * o, c = 0.114 * i - 0.114 * a - 0.497 * o, _ = 0.299 * i - 0.299 * a - 0.328 * o, p = 0.587 * i + 0.413 * a + 0.035 * o, g = 0.114 * i - 0.114 * a + 0.293 * o, u = 0.299 * i - 0.3 * a + 1.25 * o, m = 0.587 * i - 0.586 * a - 1.05 * o, y = 0.114 * i + 0.886 * a - 0.2 * o;
  for (let S = 0; S < e; S += 4) {
    const w = t[S + 0], d = t[S + 1], f = t[S + 2], b = t[S + 3];
    t[S + 0] = l * w + h * d + c * f, t[S + 1] = _ * w + p * d + g * f, t[S + 2] = u * w + m * d + y * f, t[S + 3] = b;
  }
};
Bi.HSV = jl;
ve.Factory.addGetterSetter(Hn.Node, "hue", 0, (0, zn.getNumberValidator)(), ve.Factory.afterSetFilter);
ve.Factory.addGetterSetter(Hn.Node, "saturation", 0, (0, zn.getNumberValidator)(), ve.Factory.afterSetFilter);
ve.Factory.addGetterSetter(Hn.Node, "value", 0, (0, zn.getNumberValidator)(), ve.Factory.afterSetFilter);
var Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
Vi.Invert = void 0;
const Yl = function(s) {
  const t = s.data, e = t.length;
  for (let i = 0; i < e; i += 4)
    t[i] = 255 - t[i], t[i + 1] = 255 - t[i + 1], t[i + 2] = 255 - t[i + 2];
};
Vi.Invert = Yl;
var Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.Kaleidoscope = void 0;
const ai = B, Ps = nt, Rr = st, Es = G, Xl = function(s, t, e) {
  const i = s.data, n = t.data, r = s.width, a = s.height, o = e.polarCenterX || r / 2, l = e.polarCenterY || a / 2;
  let h = Math.sqrt(o * o + l * l), c = r - o, _ = a - l;
  const p = Math.sqrt(c * c + _ * _);
  h = p > h ? p : h;
  const g = a, u = r, m = 360 / u * Math.PI / 180;
  for (let y = 0; y < u; y += 1) {
    const S = Math.sin(y * m), w = Math.cos(y * m);
    for (let d = 0; d < g; d += 1) {
      c = Math.floor(o + h * d / g * w), _ = Math.floor(l + h * d / g * S);
      let f = (_ * r + c) * 4;
      const b = i[f + 0], x = i[f + 1], P = i[f + 2], v = i[f + 3];
      f = (y + d * r) * 4, n[f + 0] = b, n[f + 1] = x, n[f + 2] = P, n[f + 3] = v;
    }
  }
}, Kl = function(s, t, e) {
  const i = s.data, n = t.data, r = s.width, a = s.height, o = e.polarCenterX || r / 2, l = e.polarCenterY || a / 2;
  let h = Math.sqrt(o * o + l * l), c = r - o, _ = a - l;
  const p = Math.sqrt(c * c + _ * _);
  h = p > h ? p : h;
  const g = a, u = r, m = 0;
  let y, S;
  for (c = 0; c < r; c += 1)
    for (_ = 0; _ < a; _ += 1) {
      const w = c - o, d = _ - l, f = Math.sqrt(w * w + d * d) * g / h;
      let b = (Math.atan2(d, w) * 180 / Math.PI + 360 + m) % 360;
      b = b * u / 360, y = Math.floor(b), S = Math.floor(f);
      let x = (S * r + y) * 4;
      const P = i[x + 0], v = i[x + 1], E = i[x + 2], A = i[x + 3];
      x = (_ * r + c) * 4, n[x + 0] = P, n[x + 1] = v, n[x + 2] = E, n[x + 3] = A;
    }
}, ql = function(s) {
  const t = s.width, e = s.height;
  let i, n, r, a, o, l, h, c, _, p, g = Math.round(this.kaleidoscopePower());
  const u = Math.round(this.kaleidoscopeAngle()), m = Math.floor(t * (u % 360) / 360);
  if (g < 1)
    return;
  const y = Rr.Util.createCanvasElement();
  y.width = t, y.height = e;
  const S = y.getContext("2d").getImageData(0, 0, t, e);
  Rr.Util.releaseCanvas(y), Xl(s, S, {
    polarCenterX: t / 2,
    polarCenterY: e / 2
  });
  let w = t / Math.pow(2, g);
  for (; w <= 8; )
    w = w * 2, g -= 1;
  w = Math.ceil(w);
  let d = w, f = 0, b = d, x = 1;
  for (m + w > t && (f = d, b = 0, x = -1), n = 0; n < e; n += 1)
    for (i = f; i !== b; i += x)
      r = Math.round(i + m) % t, _ = (t * n + r) * 4, o = S.data[_ + 0], l = S.data[_ + 1], h = S.data[_ + 2], c = S.data[_ + 3], p = (t * n + i) * 4, S.data[p + 0] = o, S.data[p + 1] = l, S.data[p + 2] = h, S.data[p + 3] = c;
  for (n = 0; n < e; n += 1)
    for (d = Math.floor(w), a = 0; a < g; a += 1) {
      for (i = 0; i < d + 1; i += 1)
        _ = (t * n + i) * 4, o = S.data[_ + 0], l = S.data[_ + 1], h = S.data[_ + 2], c = S.data[_ + 3], p = (t * n + d * 2 - i - 1) * 4, S.data[p + 0] = o, S.data[p + 1] = l, S.data[p + 2] = h, S.data[p + 3] = c;
      d *= 2;
    }
  Kl(S, s, {});
};
Hi.Kaleidoscope = ql;
ai.Factory.addGetterSetter(Ps.Node, "kaleidoscopePower", 2, (0, Es.getNumberValidator)(), ai.Factory.afterSetFilter);
ai.Factory.addGetterSetter(Ps.Node, "kaleidoscopeAngle", 0, (0, Es.getNumberValidator)(), ai.Factory.afterSetFilter);
var zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.Mask = void 0;
const Fr = B, Ql = nt, Jl = G;
function Qe(s, t, e) {
  let i = (e * s.width + t) * 4;
  const n = [];
  return n.push(s.data[i++], s.data[i++], s.data[i++], s.data[i++]), n;
}
function Re(s, t) {
  return Math.sqrt(Math.pow(s[0] - t[0], 2) + Math.pow(s[1] - t[1], 2) + Math.pow(s[2] - t[2], 2));
}
function Zl(s) {
  const t = [0, 0, 0];
  for (let e = 0; e < s.length; e++)
    t[0] += s[e][0], t[1] += s[e][1], t[2] += s[e][2];
  return t[0] /= s.length, t[1] /= s.length, t[2] /= s.length, t;
}
function th(s, t) {
  const e = Qe(s, 0, 0), i = Qe(s, s.width - 1, 0), n = Qe(s, 0, s.height - 1), r = Qe(s, s.width - 1, s.height - 1), a = t || 10;
  if (Re(e, i) < a && Re(i, r) < a && Re(r, n) < a && Re(n, e) < a) {
    const o = Zl([i, e, r, n]), l = [];
    for (let h = 0; h < s.width * s.height; h++) {
      const c = Re(o, [
        s.data[h * 4],
        s.data[h * 4 + 1],
        s.data[h * 4 + 2]
      ]);
      l[h] = c < a ? 0 : 255;
    }
    return l;
  }
}
function eh(s, t) {
  for (let e = 0; e < s.width * s.height; e++)
    s.data[4 * e + 3] = t[e];
}
function ih(s, t, e) {
  const i = [1, 1, 1, 1, 0, 1, 1, 1, 1], n = Math.round(Math.sqrt(i.length)), r = Math.floor(n / 2), a = [];
  for (let o = 0; o < e; o++)
    for (let l = 0; l < t; l++) {
      const h = o * t + l;
      let c = 0;
      for (let _ = 0; _ < n; _++)
        for (let p = 0; p < n; p++) {
          const g = o + _ - r, u = l + p - r;
          if (g >= 0 && g < e && u >= 0 && u < t) {
            const m = g * t + u, y = i[_ * n + p];
            c += s[m] * y;
          }
        }
      a[h] = c === 255 * 8 ? 255 : 0;
    }
  return a;
}
function nh(s, t, e) {
  const i = [1, 1, 1, 1, 1, 1, 1, 1, 1], n = Math.round(Math.sqrt(i.length)), r = Math.floor(n / 2), a = [];
  for (let o = 0; o < e; o++)
    for (let l = 0; l < t; l++) {
      const h = o * t + l;
      let c = 0;
      for (let _ = 0; _ < n; _++)
        for (let p = 0; p < n; p++) {
          const g = o + _ - r, u = l + p - r;
          if (g >= 0 && g < e && u >= 0 && u < t) {
            const m = g * t + u, y = i[_ * n + p];
            c += s[m] * y;
          }
        }
      a[h] = c >= 255 * 4 ? 255 : 0;
    }
  return a;
}
function rh(s, t, e) {
  const i = [0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111], n = Math.round(Math.sqrt(i.length)), r = Math.floor(n / 2), a = [];
  for (let o = 0; o < e; o++)
    for (let l = 0; l < t; l++) {
      const h = o * t + l;
      let c = 0;
      for (let _ = 0; _ < n; _++)
        for (let p = 0; p < n; p++) {
          const g = o + _ - r, u = l + p - r;
          if (g >= 0 && g < e && u >= 0 && u < t) {
            const m = g * t + u, y = i[_ * n + p];
            c += s[m] * y;
          }
        }
      a[h] = c;
    }
  return a;
}
const sh = function(s) {
  const t = this.threshold();
  let e = th(s, t);
  return e && (e = ih(e, s.width, s.height), e = nh(e, s.width, s.height), e = rh(e, s.width, s.height), eh(s, e)), s;
};
zi.Mask = sh;
Fr.Factory.addGetterSetter(Ql.Node, "threshold", 0, (0, Jl.getNumberValidator)(), Fr.Factory.afterSetFilter);
var Wi = {};
Object.defineProperty(Wi, "__esModule", { value: !0 });
Wi.Noise = void 0;
const Or = B, ah = nt, oh = G, lh = function(s) {
  const t = this.noise() * 255, e = s.data, i = e.length, n = t / 2;
  for (let r = 0; r < i; r += 4)
    e[r + 0] += n - 2 * n * Math.random(), e[r + 1] += n - 2 * n * Math.random(), e[r + 2] += n - 2 * n * Math.random();
};
Wi.Noise = lh;
Or.Factory.addGetterSetter(ah.Node, "noise", 0.2, (0, oh.getNumberValidator)(), Or.Factory.afterSetFilter);
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.Pixelate = void 0;
const Nr = B, hh = st, dh = nt, ch = G, uh = function(s) {
  let t = Math.ceil(this.pixelSize()), e = s.width, i = s.height, n = Math.ceil(e / t), r = Math.ceil(i / t), a = s.data;
  if (t <= 0) {
    hh.Util.error("pixelSize value can not be <= 0");
    return;
  }
  for (let o = 0; o < n; o += 1)
    for (let l = 0; l < r; l += 1) {
      let h = 0, c = 0, _ = 0, p = 0;
      const g = o * t, u = g + t, m = l * t, y = m + t;
      let S = 0;
      for (let w = g; w < u; w += 1)
        if (!(w >= e))
          for (let d = m; d < y; d += 1) {
            if (d >= i)
              continue;
            const f = (e * d + w) * 4;
            h += a[f + 0], c += a[f + 1], _ += a[f + 2], p += a[f + 3], S += 1;
          }
      h = h / S, c = c / S, _ = _ / S, p = p / S;
      for (let w = g; w < u; w += 1)
        if (!(w >= e))
          for (let d = m; d < y; d += 1) {
            if (d >= i)
              continue;
            const f = (e * d + w) * 4;
            a[f + 0] = h, a[f + 1] = c, a[f + 2] = _, a[f + 3] = p;
          }
    }
};
ji.Pixelate = uh;
Nr.Factory.addGetterSetter(dh.Node, "pixelSize", 8, (0, ch.getNumberValidator)(), Nr.Factory.afterSetFilter);
var Yi = {};
Object.defineProperty(Yi, "__esModule", { value: !0 });
Yi.Posterize = void 0;
const Lr = B, fh = nt, gh = G, ph = function(s) {
  const t = Math.round(this.levels() * 254) + 1, e = s.data, i = e.length, n = 255 / t;
  for (let r = 0; r < i; r += 1)
    e[r] = Math.floor(e[r] / n) * n;
};
Yi.Posterize = ph;
Lr.Factory.addGetterSetter(fh.Node, "levels", 0.5, (0, gh.getNumberValidator)(), Lr.Factory.afterSetFilter);
var Xi = {};
Object.defineProperty(Xi, "__esModule", { value: !0 });
Xi.RGB = void 0;
const oi = B, Wn = nt, _h = G, mh = function(s) {
  const t = s.data, e = t.length, i = this.red(), n = this.green(), r = this.blue();
  for (let a = 0; a < e; a += 4) {
    const o = (0.34 * t[a] + 0.5 * t[a + 1] + 0.16 * t[a + 2]) / 255;
    t[a] = o * i, t[a + 1] = o * n, t[a + 2] = o * r, t[a + 3] = t[a + 3];
  }
};
Xi.RGB = mh;
oi.Factory.addGetterSetter(Wn.Node, "red", 0, function(s) {
  return this._filterUpToDate = !1, s > 255 ? 255 : s < 0 ? 0 : Math.round(s);
});
oi.Factory.addGetterSetter(Wn.Node, "green", 0, function(s) {
  return this._filterUpToDate = !1, s > 255 ? 255 : s < 0 ? 0 : Math.round(s);
});
oi.Factory.addGetterSetter(Wn.Node, "blue", 0, _h.RGBComponent, oi.Factory.afterSetFilter);
var Ki = {};
Object.defineProperty(Ki, "__esModule", { value: !0 });
Ki.RGBA = void 0;
const De = B, qi = nt, yh = G, bh = function(s) {
  const t = s.data, e = t.length, i = this.red(), n = this.green(), r = this.blue(), a = this.alpha();
  for (let o = 0; o < e; o += 4) {
    const l = 1 - a;
    t[o] = i * a + t[o] * l, t[o + 1] = n * a + t[o + 1] * l, t[o + 2] = r * a + t[o + 2] * l;
  }
};
Ki.RGBA = bh;
De.Factory.addGetterSetter(qi.Node, "red", 0, function(s) {
  return this._filterUpToDate = !1, s > 255 ? 255 : s < 0 ? 0 : Math.round(s);
});
De.Factory.addGetterSetter(qi.Node, "green", 0, function(s) {
  return this._filterUpToDate = !1, s > 255 ? 255 : s < 0 ? 0 : Math.round(s);
});
De.Factory.addGetterSetter(qi.Node, "blue", 0, yh.RGBComponent, De.Factory.afterSetFilter);
De.Factory.addGetterSetter(qi.Node, "alpha", 1, function(s) {
  return this._filterUpToDate = !1, s > 1 ? 1 : s < 0 ? 0 : s;
});
var Qi = {};
Object.defineProperty(Qi, "__esModule", { value: !0 });
Qi.Sepia = void 0;
const vh = function(s) {
  const t = s.data, e = t.length;
  for (let i = 0; i < e; i += 4) {
    const n = t[i + 0], r = t[i + 1], a = t[i + 2];
    t[i + 0] = Math.min(255, n * 0.393 + r * 0.769 + a * 0.189), t[i + 1] = Math.min(255, n * 0.349 + r * 0.686 + a * 0.168), t[i + 2] = Math.min(255, n * 0.272 + r * 0.534 + a * 0.131);
  }
};
Qi.Sepia = vh;
var Ji = {};
Object.defineProperty(Ji, "__esModule", { value: !0 });
Ji.Solarize = void 0;
const Sh = function(s) {
  const t = s.data, e = s.width, i = s.height, n = e * 4;
  let r = i;
  do {
    const a = (r - 1) * n;
    let o = e;
    do {
      const l = a + (o - 1) * 4;
      let h = t[l], c = t[l + 1], _ = t[l + 2];
      h > 127 && (h = 255 - h), c > 127 && (c = 255 - c), _ > 127 && (_ = 255 - _), t[l] = h, t[l + 1] = c, t[l + 2] = _;
    } while (--o);
  } while (--r);
};
Ji.Solarize = Sh;
var Zi = {};
Object.defineProperty(Zi, "__esModule", { value: !0 });
Zi.Threshold = void 0;
const $r = B, Ch = nt, wh = G, xh = function(s) {
  const t = this.threshold() * 255, e = s.data, i = e.length;
  for (let n = 0; n < i; n += 1)
    e[n] = e[n] < t ? 0 : 255;
};
Zi.Threshold = xh;
$r.Factory.addGetterSetter(Ch.Node, "threshold", 0.5, (0, wh.getNumberValidator)(), $r.Factory.afterSetFilter);
Object.defineProperty(hi, "__esModule", { value: !0 });
hi.Konva = void 0;
const Gr = Xr, Ah = gi, kh = mi, Ph = vi, Eh = Si, Mh = Ci, Dr = ye, Th = ze, Rh = Ae, Fh = je, Oh = Ai, Nh = ki, Lh = Pi, $h = Ei, Gh = Pe, Dh = Mi, Ih = Ti, Uh = Ri, Bh = Oi, Vh = Ni, Hh = Li, zh = $i, Wh = Di, jh = Ii, Yh = Ui, Xh = Bi, Kh = Vi, qh = Hi, Qh = zi, Jh = Wi, Zh = ji, td = Yi, ed = Xi, id = Ki, nd = Qi, rd = Ji, sd = Zi;
hi.Konva = Gr.Konva.Util._assign(Gr.Konva, {
  Arc: Ah.Arc,
  Arrow: kh.Arrow,
  Circle: Ph.Circle,
  Ellipse: Eh.Ellipse,
  Image: Mh.Image,
  Label: Dr.Label,
  Tag: Dr.Tag,
  Line: Th.Line,
  Path: Rh.Path,
  Rect: Fh.Rect,
  RegularPolygon: Oh.RegularPolygon,
  Ring: Nh.Ring,
  Sprite: Lh.Sprite,
  Star: $h.Star,
  Text: Gh.Text,
  TextPath: Dh.TextPath,
  Transformer: Ih.Transformer,
  Wedge: Uh.Wedge,
  Filters: {
    Blur: Bh.Blur,
    Brighten: Vh.Brighten,
    Contrast: Hh.Contrast,
    Emboss: zh.Emboss,
    Enhance: Wh.Enhance,
    Grayscale: jh.Grayscale,
    HSL: Yh.HSL,
    HSV: Xh.HSV,
    Invert: Kh.Invert,
    Kaleidoscope: qh.Kaleidoscope,
    Mask: Qh.Mask,
    Noise: Jh.Noise,
    Pixelate: Zh.Pixelate,
    Posterize: td.Posterize,
    RGB: ed.RGB,
    RGBA: id.RGBA,
    Sepia: nd.Sepia,
    Solarize: rd.Solarize,
    Threshold: sd.Threshold
  }
});
var ad = Tn.exports;
Object.defineProperty(ad, "__esModule", { value: !0 });
const od = hi;
Tn.exports = od.Konva;
var ld = Tn.exports;
const Z = /* @__PURE__ */ sa(ld);
function jn(s) {
  return s.split(".", 1)[0] ?? "";
}
function hd(s, t, e) {
  const i = t == null ? void 0 : t.attributes.friendly_name;
  return typeof i == "string" && i.trim() ? i : e != null && e.name ? e.name : s.entity_id;
}
function Ms(s, t, e) {
  return s.label_mode === "off" ? "" : s.label_mode === "short" ? s.entity_id.split(".").at(-1) ?? s.entity_id : hd(s, t, e);
}
function Ts(s, t) {
  var n;
  if (!s) return "";
  if (!t) return "Unavailable";
  const e = s.source === "attr" && s.attr ? t.attributes[s.attr] : t.state;
  if (e == null || e === "")
    return "Unavailable";
  const i = String(e);
  return (n = s.format) != null && n.includes("{value}") ? s.format.split("{value}").join(i) : i;
}
function Ir(s, t, e = "primary") {
  return Ts(s.bind[e], t);
}
function Ur(s, t) {
  return s != null && s.entity_id ? Ts(s, t[s.entity_id]) : "";
}
function dd(s, t) {
  return (s ?? []).filter((e) => {
    var i;
    return ((i = t[e.entity_id]) == null ? void 0 : i.state) === e.when.state_is;
  });
}
function cd(s, t) {
  if (!t) return !0;
  const { domains: e, tags: i, area_ids: n } = t.filters;
  return !(e != null && e.length && !e.includes(jn(s.entity_id)) || i != null && i.length && !i.some((r) => s.tags.includes(r)) || n != null && n.length && (!s.area_id || !n.includes(s.area_id)));
}
function Rs(s) {
  return !s || ["unavailable", "unknown"].includes(s.state) ? "#9e9e9e" : ["on", "open", "playing", "home", "heat"].includes(s.state) ? "#ffb300" : "#1976d2";
}
function ud(s) {
  const t = {
    binary_sensor: "B",
    climate: "T",
    device_tracker: "N",
    light: "L",
    media_player: "M",
    sensor: "S",
    switch: "P"
  }, e = jn(s);
  return t[e] ?? e.slice(0, 1).toUpperCase() ?? "?";
}
function fd(s) {
  const t = jn(s);
  return t === "climate" ? ["heating"] : t === "device_tracker" ? ["network"] : [];
}
const gd = 3, pd = 2e7;
function _d(s) {
  return structuredClone(s);
}
function Fs(s) {
  const t = _d(s);
  for (const e of t.plans)
    e.background.asset_id && delete e.background.url;
  return t;
}
async function md(s) {
  return s.callWS({
    type: "floorplan_ui/get_config"
  });
}
async function yd(s, t, e) {
  return (await s.callWS({
    type: "floorplan_ui/save_config",
    base_revision: e,
    config: Fs(t)
  })).revision;
}
async function bd(s, t) {
  return (await s.callWS({
    type: "floorplan_ui/validate_config",
    config: Fs(t)
  })).config;
}
async function vd(s) {
  return s.callWS({
    type: "floorplan_ui/list_registry"
  });
}
function Sd(s) {
  var e;
  if (!s || typeof s != "object")
    return;
  const t = s;
  return typeof t.code == "string" ? t.code : typeof ((e = t.error) == null ? void 0 : e.code) == "string" ? t.error.code : void 0;
}
const Os = 4e6, Cd = "/api/floorplan_ui/assets";
function Ns(s) {
  return structuredClone(s);
}
function wd(s) {
  return new Promise((t, e) => {
    const i = new FileReader();
    i.onload = () => t(String(i.result)), i.onerror = () => e(i.error ?? new Error("The image could not be read.")), i.readAsDataURL(s);
  });
}
function xd(s) {
  return fetch(s).then((t) => {
    if (!t.ok)
      throw new Error("An embedded image could not be decoded.");
    return t.blob();
  });
}
async function Ls(s, t) {
  if (!["image/png", "image/jpeg"].includes(t.type))
    throw new Error("Only PNG and JPEG floorplans are supported.");
  if (t.size > Os)
    throw new Error("The floorplan image must not exceed 4 MB.");
  const e = await s.fetchWithAuth(Cd, {
    method: "POST",
    headers: { "Content-Type": t.type },
    body: t
  }), i = await e.json();
  if (!e.ok || !("asset_id" in i))
    throw new Error("error" in i && i.error ? i.error : "Image upload failed.");
  return i;
}
async function Ad(s) {
  const t = Ns(s);
  for (const e of t.plans) {
    const i = e.background;
    if (!i.asset_id || !i.url)
      continue;
    const n = await fetch(i.url);
    if (!n.ok)
      throw new Error(`The image for "${e.name}" could not be exported.`);
    const r = await n.blob();
    i.url = await wd(r), delete i.asset_id, delete i.content_type;
  }
  return t;
}
async function kd(s, t) {
  var i;
  const e = Ns(t);
  for (const n of e.plans ?? []) {
    const r = n.background;
    if (!((i = r == null ? void 0 : r.url) != null && i.startsWith("data:")))
      continue;
    const a = await Ls(s, await xd(r.url));
    n.background = {
      type: "image",
      asset_id: a.asset_id,
      content_type: a.content_type,
      url: a.url,
      width: r.width,
      height: r.height
    };
  }
  return e;
}
class Pd {
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
          const t = this._pending;
          this._pending = null, this._callbacks.onStatus({ state: "saving", dirty: !0 });
          try {
            this._revision = await this._save(t.config, this._revision), this._callbacks.onSaved(this._revision);
            for (const e of t.waiters)
              e(!0);
          } catch (e) {
            const i = this._pending;
            this._failed = (i == null ? void 0 : i.config) ?? t.config;
            const n = (i == null ? void 0 : i.waiters) ?? [];
            this._pending = null;
            for (const r of [...t.waiters, ...n])
              r(!1);
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
class Ed {
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
function Md(s, t) {
  const e = s.getBoundingClientRect(), i = new Z.Stage({
    container: s,
    width: Math.max(e.width, 400),
    height: Math.max(e.height, 300),
    draggable: !0
  }), n = new Z.Layer(), r = new Z.Layer(), a = new Z.Layer();
  i.add(n), i.add(r), i.add(a), i.on("click", (l) => {
    t.isEditing() && l.target === i && t.onEmptyCanvasClick();
  }), i.on("wheel", (l) => {
    l.evt.preventDefault();
    const h = i.getPointerPosition();
    if (!h) return;
    const c = i.scaleX(), _ = {
      x: (h.x - i.x()) / c,
      y: (h.y - i.y()) / c
    }, { minZoom: p, maxZoom: g } = t.getZoomLimits(), u = l.evt.deltaY > 0 ? c / 1.1 : c * 1.1, m = Math.max(p, Math.min(g, u));
    i.scale({ x: m, y: m }), i.position({
      x: h.x - _.x * m,
      y: h.y - _.y * m
    });
  });
  const o = new ResizeObserver(([l]) => {
    if (!l) return;
    const { width: h, height: c } = l.contentRect;
    h > 0 && c > 0 && i.size({ width: h, height: c });
  });
  return o.observe(s), {
    stage: i,
    backgroundLayer: n,
    areasLayer: r,
    markersLayer: a,
    destroy: () => {
      o.disconnect(), i.destroy();
    }
  };
}
function Td(s, t, e) {
  const i = Math.min(s.width() / t, s.height() / e) * 0.9;
  s.scale({ x: i, y: i }), s.position({
    x: (s.width() - t * i) / 2,
    y: (s.height() - e * i) / 2
  });
}
function Rd(s) {
  return s.getAbsoluteTransform().copy().invert().point({
    x: s.width() / 2,
    y: s.height() / 2
  });
}
function Fd(s, t) {
  const e = s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "view";
  let i = e, n = 2;
  for (; t.some((r) => r.id === i); )
    i = `${e}-${n++}`;
  return { id: i, name: s, filters: {} };
}
function Je(s, t, e) {
  return {
    ...s,
    views: s.views.map((i) => i.id === t ? e(i) : i)
  };
}
function Od(s, t, e) {
  const i = s.views.findIndex((a) => a.id === t), n = i + e;
  if (i < 0 || n < 0 || n >= s.views.length)
    return null;
  const r = [...s.views];
  return [r[i], r[n]] = [r[n], r[i]], { ...s, views: r };
}
function Nd(s, t) {
  var n;
  const e = s.views.filter((r) => r.id !== t);
  if (e.length === s.views.length || e.length === 0)
    return null;
  const i = ((n = e.find((r) => r.id === "all")) == null ? void 0 : n.id) ?? e[0].id;
  return {
    nextViewId: i,
    config: {
      ...s,
      default_view: s.default_view === t ? i : s.default_view,
      views: e
    }
  };
}
function Ld(s, t, e) {
  return {
    ...s,
    plans: s.plans.map(
      (i) => i.plan_id === t ? { ...i, markers: [...i.markers, e] } : i
    )
  };
}
function $d(s, t, e, i) {
  return {
    ...s,
    plans: s.plans.map(
      (n) => n.plan_id === t ? {
        ...n,
        markers: n.markers.map(
          (r) => r.id === e ? { ...r, ...i } : r
        )
      } : n
    )
  };
}
function Gd(s, t, e) {
  return {
    ...s,
    plans: s.plans.map(
      (i) => i.plan_id === t ? {
        ...i,
        markers: i.markers.filter((n) => n.id !== e)
      } : i
    )
  };
}
function Dd(s, t, e) {
  return {
    plan_id: s,
    name: t.replace(/\.[^.]+$/, ""),
    background: e,
    areas: [],
    markers: [],
    view: { minZoom: 0.1, maxZoom: 5 }
  };
}
function Id(s, t) {
  return {
    ...s,
    plans: [...s.plans, t]
  };
}
function Ud(s, t, e) {
  return {
    ...s,
    plans: s.plans.map((i) => i.plan_id === t ? { ...i, name: e } : i)
  };
}
function Bd(s, t) {
  var i;
  const e = s.plans.filter((n) => n.plan_id !== t);
  return e.length === s.plans.length ? null : {
    config: { ...s, plans: e },
    nextPlanId: ((i = e[0]) == null ? void 0 : i.plan_id) ?? null
  };
}
function Vd(s, t, e) {
  return {
    id: s,
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
function Hd(s, t, e) {
  return {
    ...s,
    plans: s.plans.map(
      (i) => i.plan_id === t ? { ...i, areas: [...i.areas, e] } : i
    )
  };
}
function An(s, t, e, i) {
  return {
    ...s,
    plans: s.plans.map(
      (n) => n.plan_id === t ? {
        ...n,
        areas: n.areas.map((r) => r.id === e ? i(r) : r)
      } : n
    )
  };
}
function zd(s, t, e, i) {
  return An(s, t, e, (n) => ({
    ...n,
    shape: { ...n.shape, ...i }
  }));
}
function Wd(s, t, e) {
  return {
    ...s,
    plans: s.plans.map(
      (i) => i.plan_id === t ? { ...i, areas: i.areas.filter((n) => n.id !== e) } : i
    )
  };
}
function jd(s) {
  const { layer: t, plan: e, shapes: i } = s;
  if (t.destroyChildren(), i.clear(), !!e)
    for (const n of e.areas ?? []) {
      if (!Yd(n, s.view)) continue;
      const r = Xd(n, s.editMode);
      r && (r.on("click", (a) => {
        a.cancelBubble = !0, s.editMode && s.onSelect(n.id);
      }), r.on("dragend", () => {
        if (!s.editMode) return;
        const a = r.position();
        s.onUpdateShape(n.id, { x: a.x, y: a.y }), s.onRerender();
      }), t.add(r), i.set(n.id, r), Kd(t, n, r, s.view, s.states, s.areas), s.editMode && s.selectedAreaId === n.id && (n.shape.type === "polygon" && r instanceof Z.Line ? qd(t, n, r, s) : n.shape.type === "rect" && r instanceof Z.Rect && Qd(t, n.id, r, s)));
    }
}
function Yd(s, t) {
  const e = t == null ? void 0 : t.filters.area_ids;
  if (e != null && e.length && (!s.area_id || !e.includes(s.area_id)))
    return !1;
  const i = t == null ? void 0 : t.filters.tags;
  return !(i != null && i.length) || i.some((n) => s.tags.includes(n));
}
function Xd(s, t) {
  var n;
  const { shape: e, style: i } = s;
  return e.type === "polygon" && (((n = e.points) == null ? void 0 : n.length) ?? 0) >= 6 ? new Z.Line({
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
function Kd(s, t, e, i, n, r) {
  var p, g, u, m;
  const a = [], o = (p = r.find((y) => y.id === t.area_id)) == null ? void 0 : p.name;
  t.area_id && a.push(o ?? t.area_id);
  const l = Ur((g = i == null ? void 0 : i.area_overlay) == null ? void 0 : g.primary, n), h = Ur((u = i == null ? void 0 : i.area_overlay) == null ? void 0 : u.secondary, n);
  l && a.push(l), h && a.push(h);
  for (const y of dd((m = i == null ? void 0 : i.area_overlay) == null ? void 0 : m.badges, n))
    a.push(`${y.icon ? `${y.icon} ` : ""}${y.label ?? y.entity_id}`);
  if (!a.length) return;
  const c = e.getClientRect({ relativeTo: s }), _ = new Z.Label({
    x: c.x + 8,
    y: c.y + 8,
    listening: !1
  });
  _.add(
    new Z.Tag({
      fill: "rgba(255,255,255,0.88)",
      cornerRadius: 4,
      shadowColor: "rgba(0,0,0,0.25)",
      shadowBlur: 3
    }),
    new Z.Text({
      text: a.join(`
`),
      fontSize: 13,
      fontStyle: "bold",
      fill: "#0d47a1",
      padding: 5,
      lineHeight: 1.2
    })
  ), s.add(_);
}
function qd(s, t, e, i) {
  if (!t.shape.points) return;
  const n = [...t.shape.points], r = t.shape.x ?? 0, a = t.shape.y ?? 0;
  for (let o = 0; o < n.length; o += 2) {
    const l = new Z.Circle({
      x: r + n[o],
      y: a + n[o + 1],
      radius: 7,
      fill: "#ffffff",
      stroke: "#d32f2f",
      strokeWidth: 3,
      draggable: !0
    });
    l.on("dragmove", () => {
      n[o] = l.x() - r, n[o + 1] = l.y() - a, e.points(n), s.batchDraw();
    }), l.on("dragend", () => {
      i.onUpdateShape(t.id, { points: [...n] }), i.onRerender();
    }), s.add(l);
  }
}
function Qd(s, t, e, i) {
  const n = new Z.Transformer({
    nodes: [e],
    rotateEnabled: !1,
    keepRatio: !1,
    anchorSize: 9,
    boundBoxFunc: (r, a) => a.width < 20 || a.height < 20 ? r : a
  });
  e.on("transformend", () => {
    const r = Math.max(20, e.width() * e.scaleX()), a = Math.max(20, e.height() * e.scaleY());
    e.scale({ x: 1, y: 1 }), i.onUpdateShape(t, {
      x: e.x(),
      y: e.y(),
      width: r,
      height: a
    }), i.onRerender();
  }), s.add(n);
}
function Jd(s) {
  var e, i, n, r;
  const t = new Map((((e = s.plan) == null ? void 0 : e.areas) ?? []).map((a) => [a.id, a]));
  for (const [a, o] of s.areaShapes.entries()) {
    o.draggable(s.editMode);
    const l = ((i = t.get(a)) == null ? void 0 : i.style.strokeWidth) ?? 2;
    o.strokeWidth(l + (s.selectedAreaId === a ? 2 : 0));
  }
  for (const [a, o] of s.markerGroups.entries()) {
    o.draggable(s.editMode);
    const l = o.findOne(".marker-dot");
    l == null || l.strokeWidth(s.selectedMarkerId === a ? 4 : 2);
  }
  (n = s.areasLayer) == null || n.batchDraw(), (r = s.markersLayer) == null || r.batchDraw();
}
function Zd(s) {
  const { layer: t, plan: e, groups: i } = s;
  if (t.destroyChildren(), i.clear(), !e) return;
  const n = new Map(s.entities.map((r) => [r.entity_id, r]));
  for (const r of e.markers ?? []) {
    if (!cd(r, s.view)) continue;
    const a = s.states[r.entity_id], o = n.get(r.entity_id), l = tc(r, a, o, s);
    l.on("click", (h) => {
      h.cancelBubble = !0, s.editMode ? s.onSelect(r.id) : s.onOpenMoreInfo(r.entity_id);
    }), l.on("dragend", () => {
      s.editMode && s.onMove(r.id, l.position());
    }), l.on("mouseenter", () => {
      s.stage && (s.stage.container().style.cursor = "pointer");
    }), l.on("mouseleave", () => {
      s.stage && (s.stage.container().style.cursor = "default");
    }), t.add(l), i.set(r.id, l);
  }
  t.batchDraw();
}
function tc(s, t, e, i) {
  const n = new Z.Group({
    x: s.pos.x,
    y: s.pos.y,
    draggable: i.editMode
  });
  return n.add(
    new Z.Circle({
      name: "marker-dot",
      radius: 19,
      fill: Rs(t),
      stroke: "#ffffff",
      strokeWidth: i.selectedMarkerId === s.id ? 4 : 2,
      shadowColor: "#000000",
      shadowBlur: 5,
      shadowOpacity: 0.25
    }),
    new Z.Text({
      x: -10,
      y: -10,
      width: 20,
      align: "center",
      text: ud(s.entity_id),
      fill: "#ffffff",
      fontSize: 16,
      fontStyle: "bold",
      listening: !1
    }),
    new Z.Text({
      name: "marker-label",
      x: 26,
      y: -17,
      text: s.label_mode === "off" ? "" : Ms(s, t, e),
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
      text: $s(s, t),
      fill: "#424242",
      fontSize: 12,
      padding: 2,
      listening: !1
    })
  ), n;
}
function ec(s) {
  const t = new Map(s.entities.map((e) => [e.entity_id, e]));
  for (const e of s.plan.markers ?? []) {
    const i = s.groups.get(e.id);
    if (!i) continue;
    const n = s.states[e.entity_id], r = i.findOne(".marker-dot"), a = i.findOne(".marker-value"), o = i.findOne(".marker-label");
    r == null || r.fill(Rs(n)), a == null || a.text($s(e, n)), o == null || o.text(
      e.label_mode === "off" ? "" : Ms(e, n, t.get(e.entity_id))
    );
  }
  s.layer.batchDraw();
}
function $s(s, t) {
  return [Ir(s, t), Ir(s, t, "secondary")].filter(Boolean).join(" · ");
}
function ic(s, t, e) {
  s.add(
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
  i.offsetX(i.width() / 2), s.add(i);
  const n = new Z.Text({
    x: t / 2,
    y: e / 2 + 10,
    text: "No Floorplan Loaded",
    fontSize: 20,
    fontStyle: "bold",
    fill: "#333"
  });
  n.offsetX(n.width() / 2), s.add(n);
  const r = new Z.Text({
    x: t / 2,
    y: e / 2 + 40,
    text: 'Click "Edit" → "Upload Image" to get started',
    fontSize: 14,
    fill: "#666"
  });
  r.offsetX(r.width() / 2), s.add(r);
}
function nc(s, t, e) {
  s.add(
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
  i.offsetX(i.width() / 2), s.add(i);
  const n = new Z.Text({
    x: t / 2,
    y: e / 2 + 20,
    text: "Try re-uploading the image in Edit mode.",
    fontSize: 14,
    fill: "#e65100"
  });
  n.offsetX(n.width() / 2), s.add(n);
}
const rc = Hr`
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

  .status button {
    margin-left: 12px;
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
function sc(s, t) {
  var o, l, h, c, _, p, g, u, m, y, S, w, d, f, b, x, P, v, E, A, M;
  const { currentPlan: e, currentView: i, currentViewId: n, selectedArea: r, selectedMarker: a } = s;
  return Q`
    <div class="edit-toolbar">
      <button @click=${t.uploadImage}>Upload Image</button>
      <button ?disabled=${!s.canUndo} @click=${t.undo}>Undo</button>
      <button ?disabled=${!s.canRedo} @click=${t.redo}>Redo</button>
      <button ?disabled=${!e} @click=${t.renamePlan}>Rename Plan</button>
      <button ?disabled=${!e} @click=${t.deletePlan}>Delete Plan</button>
      <button ?disabled=${!e} @click=${t.addAreaRect}>+ Rectangle</button>
      <button ?disabled=${!e} @click=${t.addAreaPolygon}>+ Polygon</button>
      <button @click=${t.addView}>+ View</button>
      <button @click=${t.renameView}>Rename View</button>
      <button @click=${() => t.moveView(-1)}>← View</button>
      <button @click=${() => t.moveView(1)}>View →</button>
      <button @click=${t.setDefaultView}>Set Default</button>
      <button ?disabled=${n === "all"} @click=${t.deleteView}>Delete View</button>
      <button @click=${t.exportConfig}>Export JSON</button>
      <button @click=${t.importConfig}>Import JSON</button>
    </div>
    <div class="edit-toolbar">
      <label>
        Search entity:
        <input
          class="grow"
          type="search"
          .value=${s.entitySearch}
          @input=${(k) => t.setEntitySearch(k.target.value)}
          placeholder="light.kitchen"
        />
      </label>
      <label>
        Domain:
        <select
          .value=${s.entityDomainFilter}
          @change=${(k) => t.setEntityDomainFilter(k.target.value)}
        >
          <option value="">All domains</option>
          ${s.entityDomains.map((k) => Q`<option value=${k}>${k}</option>`)}
        </select>
      </label>
      <label>
        HA Area:
        <select
          .value=${s.entityAreaFilter}
          @change=${(k) => t.setEntityAreaFilter(k.target.value)}
        >
          <option value="">All areas</option>
          ${s.areas.map((k) => Q`<option value=${k.id}>${k.name}</option>`)}
        </select>
      </label>
      <select
        class="grow"
        .value=${s.entityToAdd}
        @change=${(k) => t.setEntityToAdd(k.target.value)}
      >
        <option value="">Select entity (${s.entityCount})</option>
        ${s.entityOptions.map(
    (k) => Q`
            <option value=${k.entity_id}>
              ${k.entity_id}${k.name ? ` — ${k.name}` : ""}
            </option>
          `
  )}
      </select>
      <button ?disabled=${!e || !s.entityToAdd} @click=${t.addMarker}>
        + Marker
      </button>
    </div>
    <div class="edit-toolbar">
      <strong>Drag entity onto plan:</strong>
      <div class="entity-palette">
        ${s.entityOptions.slice(0, 80).map(
    (k) => Q`
            <div
              class="entity-card"
              draggable="true"
              @dragstart=${(R) => t.startEntityDrag(k.entity_id, R)}
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
      <strong>View “${(i == null ? void 0 : i.name) ?? n}” filters:</strong>
      <label>
        Domains:
        <input
          .value=${((o = i == null ? void 0 : i.filters.domains) == null ? void 0 : o.join(", ")) ?? ""}
          @change=${(k) => t.updateViewFilter("domains", k)}
          placeholder="light, switch"
        />
      </label>
      <label>
        Tags:
        <input
          .value=${((l = i == null ? void 0 : i.filters.tags) == null ? void 0 : l.join(", ")) ?? ""}
          @change=${(k) => t.updateViewFilter("tags", k)}
          placeholder="heating"
        />
      </label>
      <label>
        Area IDs:
        <input
          .value=${((h = i == null ? void 0 : i.filters.area_ids) == null ? void 0 : h.join(", ")) ?? ""}
          @change=${(k) => t.updateViewFilter("area_ids", k)}
          placeholder="living_room"
        />
      </label>
    </div>
    <div class="edit-toolbar">
      <strong>Area overlay:</strong>
      <label>
        Primary entity:
        <input
          .value=${((_ = (c = i == null ? void 0 : i.area_overlay) == null ? void 0 : c.primary) == null ? void 0 : _.entity_id) ?? ""}
          @change=${(k) => t.updateAreaOverlay("primary", "entity_id", k)}
          placeholder="sensor.living_room_temperature"
        />
      </label>
      <label>
        Source:
        <select
          .value=${((g = (p = i == null ? void 0 : i.area_overlay) == null ? void 0 : p.primary) == null ? void 0 : g.source) ?? "state"}
          @change=${(k) => t.updateAreaOverlay("primary", "source", k)}
        >
          <option value="state">State</option>
          <option value="attr">Attribute</option>
        </select>
      </label>
      <label>
        Attribute:
        <input
          .value=${((m = (u = i == null ? void 0 : i.area_overlay) == null ? void 0 : u.primary) == null ? void 0 : m.attr) ?? ""}
          @change=${(k) => t.updateAreaOverlay("primary", "attr", k)}
        />
      </label>
      <label>
        Format:
        <input
          .value=${((S = (y = i == null ? void 0 : i.area_overlay) == null ? void 0 : y.primary) == null ? void 0 : S.format) ?? ""}
          @change=${(k) => t.updateAreaOverlay("primary", "format", k)}
          placeholder="{value} °C"
        />
      </label>
    </div>
    <div class="edit-toolbar">
      <strong>Secondary / badges:</strong>
      <label>
        Secondary entity:
        <input
          .value=${((d = (w = i == null ? void 0 : i.area_overlay) == null ? void 0 : w.secondary) == null ? void 0 : d.entity_id) ?? ""}
          @change=${(k) => t.updateAreaOverlay("secondary", "entity_id", k)}
        />
      </label>
      <label>
        Source:
        <select
          .value=${((b = (f = i == null ? void 0 : i.area_overlay) == null ? void 0 : f.secondary) == null ? void 0 : b.source) ?? "state"}
          @change=${(k) => t.updateAreaOverlay("secondary", "source", k)}
        >
          <option value="state">State</option>
          <option value="attr">Attribute</option>
        </select>
      </label>
      <label>
        Attribute:
        <input
          .value=${((P = (x = i == null ? void 0 : i.area_overlay) == null ? void 0 : x.secondary) == null ? void 0 : P.attr) ?? ""}
          @change=${(k) => t.updateAreaOverlay("secondary", "attr", k)}
        />
      </label>
      <label>
        Format:
        <input
          .value=${((E = (v = i == null ? void 0 : i.area_overlay) == null ? void 0 : v.secondary) == null ? void 0 : E.format) ?? ""}
          @change=${(k) => t.updateAreaOverlay("secondary", "format", k)}
        />
      </label>
      <label>
        Badges:
        <input
          class="grow"
          .value=${((M = (A = i == null ? void 0 : i.area_overlay) == null ? void 0 : A.badges) == null ? void 0 : M.map(
    (k) => `${k.entity_id}=${k.when.state_is}${k.label ? `:${k.label}` : ""}`
  ).join(", ")) ?? ""}
          @change=${t.updateAreaBadges}
          placeholder="binary_sensor.window=on:Window open"
        />
      </label>
    </div>
    ${r ? ac(r, s.areas, t) : ""}
    ${a ? oc(a, s.areas, t) : ""}
  `;
}
function ac(s, t, e) {
  return Q`
    <div class="edit-toolbar">
      <span>Selected area:</span>
      <strong>${s.id}</strong>
      <label>
        HA Area:
        <select @change=${e.bindArea} .value=${s.area_id ?? ""}>
          <option value="">Unbound</option>
          ${t.map(
    (i) => Q`<option value=${i.id}>${i.name}</option>`
  )}
        </select>
      </label>
      <label>
        Tags:
        <input
          .value=${s.tags.join(", ")}
          @change=${e.updateAreaTags}
          placeholder="downstairs, heating"
        />
      </label>
      <label>
        Fill:
        <input
          type="color"
          .value=${s.style.fill ?? "#2196f3"}
          @change=${(i) => e.updateAreaStyle("fill", i)}
        />
      </label>
      <label>
        Stroke:
        <input
          type="color"
          .value=${s.style.stroke ?? "#1976d2"}
          @change=${(i) => e.updateAreaStyle("stroke", i)}
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
          @change=${(i) => e.updateAreaStyle("fillOpacity", i)}
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
          @change=${(i) => e.updateAreaStyle("strokeWidth", i)}
        />
      </label>
      <button @click=${e.deleteArea}>Delete Area</button>
    </div>
  `;
}
function oc(s, t, e) {
  return Q`
    <div class="edit-toolbar">
      <span>Selected marker:</span>
      <strong>${s.entity_id}</strong>
      <label>
        Tags:
        <input
          .value=${s.tags.join(", ")}
          @change=${e.updateMarkerTags}
          placeholder="heating, downstairs"
        />
      </label>
      <label>
        HA Area:
        <select .value=${s.area_id ?? ""} @change=${e.updateMarkerArea}>
          <option value="">Unbound</option>
          ${t.map((i) => Q`<option value=${i.id}>${i.name}</option>`)}
        </select>
      </label>
      <label>
        Label:
        <select .value=${s.label_mode} @change=${e.updateMarkerLabelMode}>
          <option value="auto">Auto</option>
          <option value="short">Short</option>
          <option value="full">Full</option>
          <option value="off">Off</option>
        </select>
      </label>
      <label>
        Primary:
        <select
          .value=${s.bind.primary.source}
          @change=${(i) => e.updateMarkerBinding("primary", "source", i)}
        >
          <option value="state">State</option>
          <option value="attr">Attribute</option>
        </select>
      </label>
      <label>
        Attribute:
        <input
          .value=${s.bind.primary.attr ?? ""}
          @change=${(i) => e.updateMarkerBinding("primary", "attr", i)}
        />
      </label>
      <label>
        Format:
        <input
          .value=${s.bind.primary.format ?? ""}
          @change=${(i) => e.updateMarkerBinding("primary", "format", i)}
          placeholder="{value} °C"
        />
      </label>
      ${s.bind.secondary ? Q`
            <label>
              Secondary:
              <select
                .value=${s.bind.secondary.source}
                @change=${(i) => e.updateMarkerBinding("secondary", "source", i)}
              >
                <option value="state">State</option>
                <option value="attr">Attribute</option>
              </select>
            </label>
            <label>
              Attribute:
              <input
                .value=${s.bind.secondary.attr ?? ""}
                @change=${(i) => e.updateMarkerBinding("secondary", "attr", i)}
              />
            </label>
            <label>
              Format:
              <input
                .value=${s.bind.secondary.format ?? ""}
                @change=${(i) => e.updateMarkerBinding("secondary", "format", i)}
              />
            </label>
            <button @click=${e.removeMarkerSecondaryBinding}>Remove Secondary</button>
          ` : Q` <button @click=${e.addMarkerSecondaryBinding}>+ Secondary</button> `}
      <button @click=${e.deleteMarker}>Delete Marker</button>
    </div>
  `;
}
var lc = Object.defineProperty, Gs = (s, t, e, i) => {
  for (var n = void 0, r = s.length - 1, a; r >= 0; r--)
    (a = s[r]) && (n = a(t, e, n) || n);
  return n && lc(t, e, n), n;
};
const Yn = class Yn extends pe {
  constructor() {
    super(...arguments), this.dialog = null, this._value = "";
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
    return t ? Q`
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
          ${t.message ? Q`<p>${t.message}</p>` : dt}
          ${t.kind === "text" ? Q`
                <input
                  .value=${this._value}
                  @input=${(e) => {
      this._value = e.target.value;
    }}
                />
              ` : dt}
          <div class="actions">
            <button type="button" @click=${() => this._resolve(null)}>Cancel</button>
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
Yn.styles = Hr`
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
let Ie = Yn;
Gs([
  Be({ attribute: !1 })
], Ie.prototype, "dialog");
Gs([
  ut()
], Ie.prototype, "_value");
customElements.get("floorplan-dialog") || customElements.define("floorplan-dialog", Ie);
var hc = Object.defineProperty, lt = (s, t, e, i) => {
  for (var n = void 0, r = s.length - 1, a; r >= 0; r--)
    (a = s[r]) && (n = a(t, e, n) || n);
  return n && hc(t, e, n), n;
};
const dc = 500, Xn = class Xn extends pe {
  constructor() {
    super(...arguments), this.narrow = !1, this._config = null, this._loading = !0, this._editMode = !1, this._currentView = "all", this._currentPlanId = null, this._selectedAreaId = null, this._selectedMarkerId = null, this._haAreas = [], this._haEntities = [], this._entityToAdd = "", this._entitySearch = "", this._entityDomainFilter = "", this._entityAreaFilter = "", this._notice = "", this._error = "", this._saveState = "idle", this._saveDirty = !1, this._saveConflict = !1, this._dialog = null, this._stage = null, this._backgroundLayer = null, this._areasLayer = null, this._markersLayer = null, this._stageController = null, this._areaShapes = /* @__PURE__ */ new Map(), this._markerGroups = /* @__PURE__ */ new Map(), this._renderGeneration = 0, this._liveRefreshTimer = null, this._history = new Ed(), this._dialogResolver = null, this._saveQueue = new Pd(
      (t, e) => yd(this.hass, t, e),
      {
        onStatus: (t) => this._onSaveStatus(t),
        onSaved: (t) => {
          this._config && (this._config = { ...this._config, revision: t }), this._setNotice("Changes saved.");
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
  async connectedCallback() {
    super.connectedCallback(), window.addEventListener("beforeunload", this._beforeUnload), await this._loadConfig(), this._canEdit && await this._loadRegistry();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("beforeunload", this._beforeUnload), this._resolveDialog(null), this._liveRefreshTimer !== null && (window.clearTimeout(this._liveRefreshTimer), this._liveRefreshTimer = null), this._destroyStage();
  }
  async _loadConfig() {
    var t;
    this._loading = !0;
    try {
      this._config = await md(this.hass), this._saveQueue.reset(this._config.revision), this._history.reset(), this._currentPlanId = ((t = this._config.plans[0]) == null ? void 0 : t.plan_id) ?? null, this._config.default_view && this._config.views.some((e) => {
        var i;
        return e.id === ((i = this._config) == null ? void 0 : i.default_view);
      }) && (this._currentView = this._config.default_view);
    } catch {
      this._config = {
        version: gd,
        revision: 0,
        plans: [],
        views: []
      }, this._saveQueue.reset(0), this._history.reset(), this._setError("Floorplan configuration could not be loaded.");
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
      if (Sd(t.error) === "config_conflict") {
        this._saveConflict = !0, this._setError(
          "Save conflict: this floorplan changed in another session. Reload to continue; local unsaved changes will be replaced."
        );
        return;
      }
      this._saveConflict = !1, this._setError("Changes could not be saved. Your local changes are still available.");
    }
  }
  updated(t) {
    t.has("_loading") && !this._loading && !this._stage && this._initializeStage(), t.has("_currentPlanId") && this._stage && (this._selectedAreaId = null, this._selectedMarkerId = null, this._renderFloorplan()), t.has("_currentView") && this._stage && (this._renderAreas(this._getCurrentPlan()), this._renderMarkers(this._getCurrentPlan())), t.has("hass") && (!this._canEdit && this._editMode && (this._editMode = !1, this._selectedAreaId = null, this._selectedMarkerId = null, this._syncCanvasInteractivity()), this._scheduleLiveRefresh());
  }
  _scheduleLiveRefresh() {
    this._liveRefreshTimer === null && (this._liveRefreshTimer = window.setTimeout(() => {
      this._liveRefreshTimer = null, this._refreshMarkerLiveValues(), this._editMode || this._renderAreas(this._getCurrentPlan());
    }, dc));
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
      confirmLabel: "Save",
      destructive: !1
    }, this.updateComplete.then(() => {
      var n;
      (n = this.renderRoot.querySelector(".dialog input")) == null || n.focus();
    }), new Promise((n) => {
      this._dialogResolver = (r) => n(typeof r == "string" ? r : null);
    });
  }
  _askConfirm(t, e = "Confirm", i = !1) {
    var n;
    return (n = this._dialogResolver) == null || n.call(this, null), this._dialog = {
      kind: "confirm",
      title: "Please confirm",
      message: t,
      value: "",
      confirmLabel: e,
      destructive: i
    }, new Promise((r) => {
      this._dialogResolver = (a) => r(a === !0);
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
    await this._askConfirm(
      "Reload the server version and replace your local unsaved changes?",
      "Reload",
      !0
    ) && (await this._loadConfig(), this._renderFloorplan());
  }
  _initializeStage() {
    const t = this.renderRoot.querySelector(".canvas-wrapper");
    if (!t) {
      this._setError("The floorplan canvas could not be initialized.");
      return;
    }
    this._stageController = Md(t, {
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
    var r, a, o, l, h;
    if (!this._stage || !this._backgroundLayer) return;
    const t = ++this._renderGeneration;
    this._backgroundLayer.destroyChildren(), (r = this._areasLayer) == null || r.destroyChildren(), (a = this._markersLayer) == null || a.destroyChildren(), this._areaShapes.clear(), this._markerGroups.clear();
    const e = this._getCurrentPlan(), i = this._stage.width(), n = this._stage.height();
    if (!e)
      this._drawEmptyState(i, n);
    else if ((o = e.background) != null && o.url) {
      this._renderAreas(e), this._renderMarkers(e);
      const c = new Image();
      c.onload = () => {
        if (t !== this._renderGeneration || e.plan_id !== this._currentPlanId)
          return;
        const _ = new Z.Image({
          x: 0,
          y: 0,
          image: c,
          width: e.background.width || c.width,
          height: e.background.height || c.height
        });
        this._backgroundLayer.add(_);
        try {
          this._backgroundLayer.batchDraw(), this._fitToScreen(_.width(), _.height());
        } catch {
          this._backgroundLayer.destroyChildren(), this._drawImageErrorState(i, n), this._setError("The floorplan image could not be rendered.");
        }
      }, c.onerror = () => {
        t === this._renderGeneration && (this._backgroundLayer.destroyChildren(), this._drawImageErrorState(i, n), this._setError("The floorplan image could not be loaded."));
      }, c.src = e.background.url;
    } else e && (this._renderAreas(e), this._renderMarkers(e));
    this._backgroundLayer.batchDraw(), (l = this._areasLayer) == null || l.batchDraw(), (h = this._markersLayer) == null || h.batchDraw();
  }
  _fitToScreen(t, e) {
    this._stage && Td(this._stage, t, e);
  }
  _toggleEditMode() {
    this._canEdit && (this._editMode = !this._editMode, this._editMode || (this._selectedAreaId = null, this._selectedMarkerId = null), this._renderAreas(this._getCurrentPlan()), this._syncCanvasInteractivity());
  }
  _selectPlan(t) {
    if (!this._config) return;
    const i = t.target.value || null;
    this._currentPlanId = i;
  }
  async _renameCurrentPlan() {
    if (!this._canEdit || !this._config || !this._currentPlanId) return;
    const t = this._currentPlanId, e = this._config.plans.find((r) => r.plan_id === t);
    if (!e) return;
    const i = await this._askText("Rename plan", e.name);
    if (!i) return;
    const n = i.trim();
    !n || n === e.name || this._commitConfig(Ud(this._config, t, n));
  }
  async _deleteCurrentPlan() {
    if (!this._canEdit || !this._config || !this._currentPlanId) return;
    const t = this._currentPlanId;
    if (!await this._askConfirm("Delete current plan? This cannot be undone.", "Delete plan", !0))
      return;
    const e = Bd(this._config, t);
    e && (this._commitConfig(e.config), this._currentPlanId = e.nextPlanId, this._renderFloorplan());
  }
  _renderAreas(t) {
    this._areasLayer && (jd({
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
    Jd({
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
    this._backgroundLayer && ic(this._backgroundLayer, t, e);
  }
  _drawImageErrorState(t, e) {
    this._backgroundLayer && nc(this._backgroundLayer, t, e);
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
    const i = this._newId("area"), n = Vd(i, t, this._getVisibleCanvasCenter());
    this._commitConfig(Hd(this._config, e.plan_id, n)), this._selectedAreaId = i, this._selectedMarkerId = null, this._renderFloorplan();
  }
  _updateAreaShape(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._getCurrentPlan();
    i && this._commitConfig(zd(this._config, i.plan_id, t, e));
  }
  async _loadRegistry() {
    if (this._canEdit)
      try {
        const t = await vd(this.hass);
        this._haAreas = t.areas, this._haEntities = t.entities.sort(
          (e, i) => e.entity_id.localeCompare(i.entity_id)
        );
      } catch {
        this._haAreas = [], this._haEntities = [], this._setError("Home Assistant areas and entities could not be loaded.");
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
      An(this._config, i.plan_id, this._selectedAreaId, (n) => ({
        ...n,
        area_id: e.value
      }))
    ), this._renderAreas(this._getCurrentPlan()));
  }
  _onAreaTagsChange(t) {
    const e = this._getSelectedArea(), i = this._getCurrentPlan();
    if (!e || !i || !this._config) return;
    const n = t.target.value.split(",").map((r) => r.trim()).filter(Boolean);
    this._commitConfig(
      An(this._config, i.plan_id, e.id, (r) => ({
        ...r,
        tags: [...new Set(n)]
      }))
    ), this._renderAreas(this._getCurrentPlan());
  }
  async _deleteSelectedArea() {
    if (!this._canEdit || !this._config || !this._selectedAreaId) return;
    const t = this._getCurrentPlan();
    t && await this._askConfirm("Delete selected area? This cannot be undone.", "Delete area", !0) && (this._commitConfig(Wd(this._config, t.plan_id, this._selectedAreaId)), this._selectedAreaId = null, this._renderFloorplan());
  }
  _renderMarkers(t) {
    this._markersLayer && Zd({
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
    !t || !this._markersLayer || ec({
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
    const n = this._haEntities.find((a) => a.entity_id === t);
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
      tags: fd(t),
      bind: { primary: { source: "state" } }
    };
    this._commitConfig(Ld(this._config, i.plan_id, r)), this._selectedMarkerId = r.id, this._selectedAreaId = null, this._entityToAdd = "", this._renderMarkers(this._getCurrentPlan());
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
    var o, l;
    t.preventDefault();
    const e = t.currentTarget;
    if (e.classList.remove("drag-target"), !this._editMode || !this._stage) return;
    const i = ((o = t.dataTransfer) == null ? void 0 : o.getData("application/x-floorplan-entity")) || ((l = t.dataTransfer) == null ? void 0 : l.getData("text/plain"));
    if (!i) return;
    const n = e.getBoundingClientRect(), a = this._stage.getAbsoluteTransform().copy().invert().point({
      x: t.clientX - n.left,
      y: t.clientY - n.top
    });
    this._addMarkerAt(i, a);
  }
  _updateMarker(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._getCurrentPlan();
    i && this._commitConfig($d(this._config, i.plan_id, t, e));
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
    const r = i.target.value, a = n.bind[t] ?? { source: "state" }, o = {
      ...a,
      [e]: e === "source" ? r : r || void 0,
      ...e === "source" && r === "attr" && !a.attr ? { attr: "friendly_name" } : {},
      ...e === "attr" && a.source === "attr" && !r ? { attr: "friendly_name" } : {}
    };
    this._updateMarker(n.id, {
      bind: { ...n.bind, [t]: o }
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
    !t || !await this._askConfirm("Delete selected marker?", "Delete marker", !0) || (this._commitConfig(Gd(this._config, t.plan_id, this._selectedMarkerId)), this._selectedMarkerId = null, this._renderMarkers(this._getCurrentPlan()));
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
  async _addView() {
    var i;
    if (!this._canEdit || !this._config) return;
    const t = (i = await this._askText("New view name")) == null ? void 0 : i.trim();
    if (!t) return;
    const e = Fd(t, this._config.views);
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
    const e = (i = await this._askText("Rename view", t.name)) == null ? void 0 : i.trim();
    !e || e === t.name || this._commitConfig(
      Je(this._config, t.id, (n) => ({ ...n, name: e }))
    );
  }
  _moveCurrentView(t) {
    if (!this._canEdit || !this._config) return;
    const e = Od(this._config, this._currentView, t);
    e && this._commitConfig(e);
  }
  _setDefaultView() {
    var t;
    !this._canEdit || !this._config || (this._commitConfig({ ...this._config, default_view: this._currentView }), this._setNotice(`“${((t = this._getCurrentView()) == null ? void 0 : t.name) ?? this._currentView}” is the default view.`));
  }
  async _deleteCurrentView() {
    if (!this._canEdit || !this._config || this._currentView === "all" || this._config.views.length <= 1 || !await this._askConfirm("Delete the current view?", "Delete view", !0)) return;
    const t = Nd(this._config, this._currentView);
    t && (this._commitConfig(t.config), this._currentView = t.nextViewId);
  }
  _updateViewFilter(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = e.target.value.split(",").map((n) => n.trim()).filter(Boolean);
    this._commitConfig(
      Je(this._config, this._currentView, (n) => {
        const r = { ...n.filters };
        return r[t] = i.length ? [...new Set(i)] : void 0, { ...n, filters: r };
      })
    ), this._renderMarkers(this._getCurrentPlan()), this._renderAreas(this._getCurrentPlan());
  }
  _updateAreaOverlayValue(t, e, i) {
    if (!this._canEdit || !this._config) return;
    const n = i.target.value.trim();
    this._commitConfig(
      Je(this._config, this._currentView, (r) => {
        const a = { ...r.area_overlay };
        if (e === "entity_id" && !n)
          delete a[t];
        else {
          const o = a[t] ?? {
            mode: "entity",
            entity_id: n,
            source: "state"
          };
          if (e !== "entity_id" && !o.entity_id) return r;
          a[t] = {
            ...o,
            [e]: e === "source" ? n : n || void 0,
            ...e === "source" && n === "attr" && !o.attr ? { attr: "friendly_name" } : {},
            ...e === "attr" && o.source === "attr" && !n ? { attr: "friendly_name" } : {}
          };
        }
        return { ...r, area_overlay: a };
      })
    ), this._renderAreas(this._getCurrentPlan());
  }
  _updateAreaBadges(t) {
    if (!this._canEdit || !this._config) return;
    const i = t.target.value.split(",").map((n) => n.trim()).filter(Boolean).flatMap((n) => {
      const [r, a] = n.split(":", 2), [o, l] = r.split("=", 2).map((c) => c.trim());
      if (!o || !l) return [];
      const h = a == null ? void 0 : a.trim();
      return [
        {
          entity_id: o,
          when: { state_is: l },
          ...h ? { label: h } : {}
        }
      ];
    });
    this._commitConfig(
      Je(this._config, this._currentView, (n) => ({
        ...n,
        area_overlay: {
          ...n.area_overlay,
          badges: i.length ? i : void 0
        }
      }))
    ), this._renderAreas(this._getCurrentPlan());
  }
  _updateAreaStyle(t, e) {
    const i = this._getSelectedArea();
    if (!i) return;
    const n = e.target;
    let r = t === "fill" || t === "stroke" ? n.value : Number(n.value);
    if (typeof r == "number" && !Number.isFinite(r)) return;
    t === "fillOpacity" && typeof r == "number" && (r = Math.max(0, Math.min(1, r))), t === "strokeWidth" && typeof r == "number" && (r = Math.max(0, Math.min(50, r)));
    const a = this._getCurrentPlan();
    !this._config || !a || (this._commitConfig({
      ...this._config,
      plans: this._config.plans.map(
        (o) => o.plan_id === a.plan_id ? {
          ...o,
          areas: o.areas.map(
            (l) => l.id === i.id ? { ...l, style: { ...l.style, [t]: r } } : l
          )
        } : o
      )
    }), this._renderAreas(this._getCurrentPlan()));
  }
  async _exportConfig() {
    if (this._config)
      try {
        const t = await Ad(this._config), e = new Blob([JSON.stringify(t, null, 2)], {
          type: "application/json"
        }), i = URL.createObjectURL(e), n = document.createElement("a");
        n.href = i, n.download = `floorplan-ui-config-v${this._config.version}.json`, n.click(), URL.revokeObjectURL(i), this._setNotice("Configuration and images exported.");
      } catch (t) {
        const e = t instanceof Error ? t.message : "Export failed.";
        this._setError(e);
      }
  }
  _triggerConfigImport() {
    var t;
    this._canEdit && ((t = this.renderRoot.querySelector(".config-file-input")) == null || t.click());
  }
  async _handleConfigImport(t) {
    var n, r, a;
    if (!this._canEdit) return;
    const e = t.target, i = (n = e.files) == null ? void 0 : n[0];
    if (e.value = "", !!i) {
      if (i.size > pd) {
        this._setError("The configuration file must not exceed 20 MB.");
        return;
      }
      try {
        const o = JSON.parse(await i.text());
        if (!o || typeof o != "object" || Array.isArray(o))
          throw new Error("The JSON root must be an object.");
        const l = o, h = Array.isArray(l.plans) ? l.plans.length : 0, c = Array.isArray(l.views) ? l.views.length : 0;
        if (!await this._askConfirm(`Import ${h} plan(s) and ${c} view(s)?`, "Import"))
          return;
        const _ = await kd(this.hass, o), p = await bd(this.hass, _);
        if (this._currentPlanId = ((r = p.plans[0]) == null ? void 0 : r.plan_id) ?? null, this._currentView = p.views.some((u) => u.id === p.default_view) ? p.default_view ?? "all" : ((a = p.views[0]) == null ? void 0 : a.id) ?? "all", this._selectedAreaId = null, this._selectedMarkerId = null, !await this._commitConfig(p)) return;
        this._renderFloorplan(), this._setNotice("Configuration imported and saved.");
      } catch (o) {
        const l = o instanceof Error ? o.message : "The file is not a valid configuration.";
        this._setError(`Import failed: ${l}`);
      }
    }
  }
  async _handleFileUpload(t) {
    var r;
    if (!this._canEdit) return;
    const e = t.target, i = (r = e.files) == null ? void 0 : r[0];
    if (e.value = "", !i) return;
    if (!["image/png", "image/jpeg"].includes(i.type)) {
      this._setError("Only PNG and JPEG floorplans are supported.");
      return;
    }
    if (i.size > Os) {
      this._setError("The floorplan image must not exceed 4 MB.");
      return;
    }
    let n = null;
    try {
      n = await createImageBitmap(i);
      const a = await Ls(this.hass, i);
      this._createNewPlan(i.name, {
        type: "image",
        asset_id: a.asset_id,
        content_type: a.content_type,
        url: a.url,
        width: n.width,
        height: n.height
      });
    } catch (a) {
      const o = a instanceof Error ? a.message : "The selected image could not be uploaded.";
      this._setError(o);
    } finally {
      n == null || n.close();
    }
  }
  _createNewPlan(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._newId("plan");
    this._commitConfig(Id(this._config, Dd(i, t, e))), this._currentPlanId = i, this._renderFloorplan();
  }
  _triggerFileUpload() {
    var t;
    (t = this.renderRoot.querySelector(".file-input")) == null || t.click();
  }
  _getVisibleCanvasCenter() {
    return this._stage ? Rd(this._stage) : { x: 0, y: 0 };
  }
  _newId(t) {
    return `${t}_${globalThis.crypto.randomUUID()}`;
  }
  _renderEditor(t, e, i, n) {
    const r = this._entitySearch.trim().toLowerCase(), a = [...new Set(this._haEntities.map((l) => l.domain))].sort(), o = this._haEntities.filter((l) => {
      var p;
      const h = !r || l.entity_id.toLowerCase().includes(r) || !!((p = l.name) != null && p.toLowerCase().includes(r)), c = !this._entityDomainFilter || l.domain === this._entityDomainFilter, _ = !this._entityAreaFilter || l.area_id === this._entityAreaFilter;
      return h && c && _;
    }).slice(0, 250);
    return sc(
      {
        currentPlan: t,
        currentView: e,
        currentViewId: this._currentView,
        selectedArea: i,
        selectedMarker: n,
        areas: this._haAreas,
        entityCount: this._haEntities.length,
        entityOptions: o,
        entityDomains: a,
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
        updateViewFilter: (l, h) => this._updateViewFilter(l, h),
        updateAreaOverlay: (l, h, c) => this._updateAreaOverlayValue(l, h, c),
        updateAreaBadges: (l) => this._updateAreaBadges(l),
        bindArea: (l) => this._onBindAreaChange(l),
        updateAreaTags: (l) => this._onAreaTagsChange(l),
        updateAreaStyle: (l, h) => this._updateAreaStyle(l, h),
        deleteArea: () => this._deleteSelectedArea(),
        updateMarkerTags: (l) => this._onMarkerTagsChange(l),
        updateMarkerArea: (l) => this._onMarkerAreaChange(l),
        updateMarkerLabelMode: (l) => this._onMarkerLabelModeChange(l),
        updateMarkerBinding: (l, h, c) => this._updateMarkerBinding(l, h, c),
        addMarkerSecondaryBinding: () => this._addMarkerSecondaryBinding(),
        removeMarkerSecondaryBinding: () => this._removeMarkerSecondaryBinding(),
        deleteMarker: () => this._deleteSelectedMarker()
      }
    );
  }
  render() {
    var l, h;
    const t = [
      { id: "all", name: "All", filters: {} },
      { id: "heating", name: "Heating", filters: { tags: ["heating"] } },
      { id: "lights", name: "Lights", filters: { domains: ["light", "switch"] } },
      { id: "network", name: "Network", filters: { tags: ["network"] } },
      { id: "entertainment", name: "Entertainment", filters: { domains: ["media_player"] } }
    ], e = (l = this._config) != null && l.views.length ? this._config.views : t, i = ((h = this._config) == null ? void 0 : h.plans) ?? [], n = this._getCurrentPlan(), r = this._getCurrentView(), a = this._getSelectedArea(), o = this._getSelectedMarker();
    return Q`
      <div class="container">
        <div class="toolbar">
          <div class="toolbar-left">
            <h1>Floorplan</h1>
            <div class="plan-select">
              <span>Plan:</span>
              <select @change=${this._selectPlan} .value=${(n == null ? void 0 : n.plan_id) ?? ""}>
                <option value="">${i.length === 0 ? "No plans" : "Select plan"}</option>
                ${i.map((c) => Q`<option value=${c.plan_id}>${c.name}</option>`)}
              </select>
            </div>
            <div class="view-tabs">
              ${e.map(
      (c) => {
        var _;
        return Q`
                  <button
                    class="view-tab ${this._currentView === c.id ? "active" : ""}"
                    @click=${() => this._setView(c.id)}
                  >
                    ${c.id === ((_ = this._config) == null ? void 0 : _.default_view) ? "★ " : ""}${c.name}
                  </button>
                `;
      }
    )}
            </div>
          </div>
          <div class="toolbar-right">
            ${this._canEdit ? Q`
                  <button
                    class="edit-toggle ${this._editMode ? "active" : ""}"
                    @click=${this._toggleEditMode}
                  >
                    ${this._editMode ? "Done" : "Edit"}
                  </button>
                ` : Q`<span class="viewer-note">View only</span>`}
          </div>
        </div>

        ${this._saveState === "pending" ? Q`<div class="status">Changes pending…</div>` : ""}
        ${this._saveState === "saving" ? Q`<div class="status">Saving changes…</div>` : ""}
        ${this._notice ? Q`<div class="status">${this._notice}</div>` : ""}
        ${this._error ? Q`
              <div class="status error">
                ${this._error}
                ${this._saveState === "failed" ? this._saveConflict ? Q`
                        <button type="button" @click=${this._reloadAfterConflict}>Reload</button>
                      ` : Q`<button type="button" @click=${this._retrySave}>Retry</button>` : ""}
              </div>
            ` : ""}
        ${this._editMode ? this._renderEditor(n, r, a, o) : ""}

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
          ${this._loading ? Q`<div class="loading">Loading...</div>` : Q`<div class="canvas-wrapper"></div>`}
        </div>
        <floorplan-dialog
          .dialog=${this._dialog}
          @floorplan-dialog-resolve=${(c) => this._resolveDialog(c.detail)}
        ></floorplan-dialog>
      </div>
    `;
  }
};
Xn.styles = rc;
let et = Xn;
lt([
  Be({ attribute: !1 })
], et.prototype, "hass");
lt([
  Be({ type: Boolean })
], et.prototype, "narrow");
lt([
  Be({ type: Object })
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

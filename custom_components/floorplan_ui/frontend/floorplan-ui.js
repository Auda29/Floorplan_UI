/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ze = globalThis, Pn = Ze.ShadowRoot && (Ze.ShadyCSS === void 0 || Ze.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, En = Symbol(), Qn = /* @__PURE__ */ new WeakMap();
let Wr = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== En) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Pn && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Qn.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Qn.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Wa = (a) => new Wr(typeof a == "string" ? a : a + "", void 0, En), jr = (a, ...t) => {
  const e = a.length === 1 ? a[0] : t.reduce((i, n, r) => i + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + a[r + 1], a[0]);
  return new Wr(e, a, En);
}, ja = (a, t) => {
  if (Pn) a.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), n = Ze.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = e.cssText, a.appendChild(i);
  }
}, Jn = Pn ? (a) => a : (a) => a instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Wa(e);
})(a) : a;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ya, defineProperty: Ka, getOwnPropertyDescriptor: Xa, getOwnPropertyNames: qa, getOwnPropertySymbols: Qa, getPrototypeOf: Ja } = Object, Gt = globalThis, Zn = Gt.trustedTypes, Za = Zn ? Zn.emptyScript : "", en = Gt.reactiveElementPolyfillSupport, Oe = (a, t) => a, ii = { toAttribute(a, t) {
  switch (t) {
    case Boolean:
      a = a ? Za : null;
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
} }, Mn = (a, t) => !Ya(a, t), tr = { attribute: !0, type: String, converter: ii, reflect: !1, useDefault: !1, hasChanged: Mn };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Gt.litPropertyMetadata ?? (Gt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let ge = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = tr) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(t, i, e);
      n !== void 0 && Ka(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: n, set: r } = Xa(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? tr;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Oe("elementProperties"))) return;
    const t = Ja(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Oe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Oe("properties"))) {
      const e = this.properties, i = [...qa(e), ...Qa(e)];
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
      for (const n of i) e.unshift(Jn(n));
    } else t !== void 0 && e.push(Jn(t));
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
    return ja(t, this.constructor.elementStyles), t;
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
      const s = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : ii).toAttribute(e, i.type);
      this._$Em = t, s == null ? this.removeAttribute(n) : this.setAttribute(n, s), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, s;
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = i.getPropertyOptions(n), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((r = o.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? o.converter : ii;
      this._$Em = n;
      const h = l.fromAttribute(e, o.type);
      this[n] = h ?? ((s = this._$Ej) == null ? void 0 : s.get(n)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, n = !1, r) {
    var s;
    if (t !== void 0) {
      const o = this.constructor;
      if (n === !1 && (r = this[t]), i ?? (i = o.getPropertyOptions(t)), !((i.hasChanged ?? Mn)(r, e) || i.useDefault && i.reflect && r === ((s = this._$Ej) == null ? void 0 : s.get(t)) && !this.hasAttribute(o._$Eu(t, i)))) return;
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
ge.elementStyles = [], ge.shadowRootOptions = { mode: "open" }, ge[Oe("elementProperties")] = /* @__PURE__ */ new Map(), ge[Oe("finalized")] = /* @__PURE__ */ new Map(), en == null || en({ ReactiveElement: ge }), (Gt.reactiveElementVersions ?? (Gt.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const De = globalThis, er = (a) => a, ni = De.trustedTypes, ir = ni ? ni.createPolicy("lit-html", { createHTML: (a) => a }) : void 0, Yr = "$lit$", It = `lit$${Math.random().toFixed(9).slice(2)}$`, Kr = "?" + It, ts = `<${Kr}>`, Jt = document, Le = () => Jt.createComment(""), Ne = (a) => a === null || typeof a != "object" && typeof a != "function", Tn = Array.isArray, es = (a) => Tn(a) || typeof (a == null ? void 0 : a[Symbol.iterator]) == "function", nn = `[ 	
\f\r]`, Te = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, nr = /-->/g, rr = />/g, Yt = RegExp(`>|${nn}(?:([^\\s"'>=/]+)(${nn}*=${nn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ar = /'/g, sr = /"/g, Xr = /^(?:script|style|textarea|title)$/i, is = (a) => (t, ...e) => ({ _$litType$: a, strings: t, values: e }), V = is(1), _e = Symbol.for("lit-noChange"), dt = Symbol.for("lit-nothing"), or = /* @__PURE__ */ new WeakMap(), qt = Jt.createTreeWalker(Jt, 129);
function qr(a, t) {
  if (!Tn(a) || !a.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ir !== void 0 ? ir.createHTML(t) : t;
}
const ns = (a, t) => {
  const e = a.length - 1, i = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = Te;
  for (let o = 0; o < e; o++) {
    const l = a[o];
    let h, u, p = -1, g = 0;
    for (; g < l.length && (s.lastIndex = g, u = s.exec(l), u !== null); ) g = s.lastIndex, s === Te ? u[1] === "!--" ? s = nr : u[1] !== void 0 ? s = rr : u[2] !== void 0 ? (Xr.test(u[2]) && (n = RegExp("</" + u[2], "g")), s = Yt) : u[3] !== void 0 && (s = Yt) : s === Yt ? u[0] === ">" ? (s = n ?? Te, p = -1) : u[1] === void 0 ? p = -2 : (p = s.lastIndex - u[2].length, h = u[1], s = u[3] === void 0 ? Yt : u[3] === '"' ? sr : ar) : s === sr || s === ar ? s = Yt : s === nr || s === rr ? s = Te : (s = Yt, n = void 0);
    const _ = s === Yt && a[o + 1].startsWith("/>") ? " " : "";
    r += s === Te ? l + ts : p >= 0 ? (i.push(h), l.slice(0, p) + Yr + l.slice(p) + It + _) : l + It + (p === -2 ? o : _);
  }
  return [qr(a, r + (a[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Ie {
  constructor({ strings: t, _$litType$: e }, i) {
    let n;
    this.parts = [];
    let r = 0, s = 0;
    const o = t.length - 1, l = this.parts, [h, u] = ns(t, e);
    if (this.el = Ie.createElement(h, i), qt.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = qt.nextNode()) !== null && l.length < o; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(Yr)) {
          const g = u[s++], _ = n.getAttribute(p).split(It), c = /([.?@])?(.*)/.exec(g);
          l.push({ type: 1, index: r, name: c[2], strings: _, ctor: c[1] === "." ? as : c[1] === "?" ? ss : c[1] === "@" ? os : hi }), n.removeAttribute(p);
        } else p.startsWith(It) && (l.push({ type: 6, index: r }), n.removeAttribute(p));
        if (Xr.test(n.tagName)) {
          const p = n.textContent.split(It), g = p.length - 1;
          if (g > 0) {
            n.textContent = ni ? ni.emptyScript : "";
            for (let _ = 0; _ < g; _++) n.append(p[_], Le()), qt.nextNode(), l.push({ type: 2, index: ++r });
            n.append(p[g], Le());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Kr) l.push({ type: 2, index: r });
      else {
        let p = -1;
        for (; (p = n.data.indexOf(It, p + 1)) !== -1; ) l.push({ type: 7, index: r }), p += It.length - 1;
      }
      r++;
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
  let n = i !== void 0 ? (s = e._$Co) == null ? void 0 : s[i] : e._$Cl;
  const r = Ne(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== r && ((o = n == null ? void 0 : n._$AO) == null || o.call(n, !1), r === void 0 ? n = void 0 : (n = new r(a), n._$AT(a, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = n : e._$Cl = n), n !== void 0 && (t = me(a, n._$AS(a, t.values), n, i)), t;
}
class rs {
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
    let r = qt.nextNode(), s = 0, o = 0, l = i[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let h;
        l.type === 2 ? h = new Be(r, r.nextSibling, this, t) : l.type === 1 ? h = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (h = new ls(r, this, t)), this._$AV.push(h), l = i[++o];
      }
      s !== (l == null ? void 0 : l.index) && (r = qt.nextNode(), s++);
    }
    return qt.currentNode = Jt, n;
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
    t = me(this, t, e), Ne(t) ? t === dt || t == null || t === "" ? (this._$AH !== dt && this._$AR(), this._$AH = dt) : t !== this._$AH && t !== _e && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : es(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== dt && Ne(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Jt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Ie.createElement(qr(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === n) this._$AH.p(e);
    else {
      const s = new rs(n, this), o = s.u(this.options);
      s.p(e), this.T(o), this._$AH = s;
    }
  }
  _$AC(t) {
    let e = or.get(t.strings);
    return e === void 0 && or.set(t.strings, e = new Ie(t)), e;
  }
  k(t) {
    Tn(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, n = 0;
    for (const r of t) n === e.length ? e.push(i = new Be(this.O(Le()), this.O(Le()), this, this.options)) : i = e[n], i._$AI(r), n++;
    n < e.length && (this._$AR(i && i._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const n = er(t).nextSibling;
      er(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class hi {
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
    let s = !1;
    if (r === void 0) t = me(this, t, e, 0), s = !Ne(t) || t !== this._$AH && t !== _e, s && (this._$AH = t);
    else {
      const o = t;
      let l, h;
      for (t = r[0], l = 0; l < r.length - 1; l++) h = me(this, o[i + l], e, l), h === _e && (h = this._$AH[l]), s || (s = !Ne(h) || h !== this._$AH[l]), h === dt ? t = dt : t !== dt && (t += (h ?? "") + r[l + 1]), this._$AH[l] = h;
    }
    s && !n && this.j(t);
  }
  j(t) {
    t === dt ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class as extends hi {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === dt ? void 0 : t;
  }
}
class ss extends hi {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== dt);
  }
}
class os extends hi {
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
class ls {
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
const rn = De.litHtmlPolyfillSupport;
rn == null || rn(Ie, Be), (De.litHtmlVersions ?? (De.litHtmlVersions = [])).push("3.3.2");
const hs = (a, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let n = i._$litPart$;
  if (n === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = n = new Be(t.insertBefore(Le(), r), r, void 0, e ?? {});
  }
  return n._$AI(a), n;
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = hs(e, this.renderRoot, this.renderOptions);
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
var zr;
pe._$litElement$ = !0, pe.finalized = !0, (zr = Qt.litElementHydrateSupport) == null || zr.call(Qt, { LitElement: pe });
const an = Qt.litElementPolyfillSupport;
an == null || an({ LitElement: pe });
(Qt.litElementVersions ?? (Qt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ds = { attribute: !0, type: String, converter: ii, reflect: !1, hasChanged: Mn }, cs = (a = ds, t, e) => {
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
function we(a) {
  return (t, e) => typeof e == "object" ? cs(a, t, e) : ((i, n, r) => {
    const s = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, i), s ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(a, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ct(a) {
  return we({ ...a, state: !0, attribute: !1 });
}
var lr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function us(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var Rn = { exports: {} }, di = {}, Qr = {}, U = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a._registerNode = a.Konva = a.glob = void 0;
  const t = Math.PI / 180;
  function e() {
    return typeof window < "u" && ({}.toString.call(window) === "[object Window]" || {}.toString.call(window) === "[object global]");
  }
  a.glob = typeof lr < "u" ? lr : typeof window < "u" ? window : typeof WorkerGlobalScope < "u" ? self : {}, a.Konva = {
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
})(U);
var rt = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Util = a.Transform = void 0;
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
      const b = Math.cos(f), C = Math.sin(f), P = this.m[0] * b + this.m[2] * C, v = this.m[1] * b + this.m[3] * C, E = this.m[0] * -C + this.m[2] * b, k = this.m[1] * -C + this.m[3] * b;
      return this.m[0] = P, this.m[1] = v, this.m[2] = E, this.m[3] = k, this;
    }
    getTranslation() {
      return {
        x: this.m[4],
        y: this.m[5]
      };
    }
    skew(f, b) {
      const C = this.m[0] + this.m[2] * b, P = this.m[1] + this.m[3] * b, v = this.m[2] + this.m[0] * f, E = this.m[3] + this.m[1] * f;
      return this.m[0] = C, this.m[1] = P, this.m[2] = v, this.m[3] = E, this;
    }
    multiply(f) {
      const b = this.m[0] * f.m[0] + this.m[2] * f.m[1], C = this.m[1] * f.m[0] + this.m[3] * f.m[1], P = this.m[0] * f.m[2] + this.m[2] * f.m[3], v = this.m[1] * f.m[2] + this.m[3] * f.m[3], E = this.m[0] * f.m[4] + this.m[2] * f.m[5] + this.m[4], k = this.m[1] * f.m[4] + this.m[3] * f.m[5] + this.m[5];
      return this.m[0] = b, this.m[1] = C, this.m[2] = P, this.m[3] = v, this.m[4] = E, this.m[5] = k, this;
    }
    invert() {
      const f = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]), b = this.m[3] * f, C = -this.m[1] * f, P = -this.m[2] * f, v = this.m[0] * f, E = f * (this.m[2] * this.m[5] - this.m[3] * this.m[4]), k = f * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
      return this.m[0] = b, this.m[1] = C, this.m[2] = P, this.m[3] = v, this.m[4] = E, this.m[5] = k, this;
    }
    getMatrix() {
      return this.m;
    }
    decompose() {
      const f = this.m[0], b = this.m[1], C = this.m[2], P = this.m[3], v = this.m[4], E = this.m[5], k = f * P - b * C, M = {
        x: v,
        y: E,
        rotation: 0,
        scaleX: 0,
        scaleY: 0,
        skewX: 0,
        skewY: 0
      };
      if (f != 0 || b != 0) {
        const T = Math.sqrt(f * f + b * b);
        M.rotation = b > 0 ? Math.acos(f / T) : -Math.acos(f / T), M.scaleX = T, M.scaleY = k / T, M.skewX = (f * C + b * P) / k, M.skewY = 0;
      } else if (C != 0 || P != 0) {
        const T = Math.sqrt(C * C + P * P);
        M.rotation = Math.PI / 2 - (P > 0 ? Math.acos(-C / T) : -Math.acos(C / T)), M.scaleX = k / T, M.scaleY = T, M.skewX = 0, M.skewY = (f * C + b * P) / k;
      }
      return M.rotation = a.Util._getRotation(M.rotation), M;
    }
  }
  a.Transform = e;
  const i = "[object Array]", n = "[object Number]", r = "[object String]", s = "[object Boolean]", o = Math.PI / 180, l = 180 / Math.PI, h = "#", u = "", p = "0", g = "Konva warning: ", _ = "Konva error: ", c = "rgb(", m = {
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
      return Object.prototype.toString.call(d) === n && !isNaN(d) && isFinite(d);
    },
    _isString(d) {
      return Object.prototype.toString.call(d) === r;
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
      const b = a.Util.createImageElement();
      b.onload = function() {
        f(b);
      }, b.src = d;
    },
    _rgbToHex(d, f, b) {
      return ((1 << 24) + (d << 16) + (f << 8) + b).toString(16).slice(1);
    },
    _hexToRgb(d) {
      d = d.replace(h, u);
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
        d = p + d;
      return h + d;
    },
    getRGB(d) {
      let f;
      return d in m ? (f = m[d], {
        r: f[0],
        g: f[1],
        b: f[2]
      }) : d[0] === h ? this._hexToRgb(d.substring(1)) : d.substr(0, 4) === c ? (f = y.exec(d.replace(/ /g, "")), {
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
      return d = d || "black", a.Util._namedColorToRBA(d) || a.Util._hex3ColorToRGBA(d) || a.Util._hex4ColorToRGBA(d) || a.Util._hex6ColorToRGBA(d) || a.Util._hex8ColorToRGBA(d) || a.Util._rgbColorToRGBA(d) || a.Util._rgbaColorToRGBA(d) || a.Util._hslColorToRGBA(d);
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
        const f = d.split(/ *, */).map((b, C) => b.slice(-1) === "%" ? C === 3 ? parseInt(b) / 100 : parseInt(b) / 100 * 255 : Number(b));
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
        const [f, ...b] = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(d), C = Number(b[0]) / 360, P = Number(b[1]) / 100, v = Number(b[2]) / 100;
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
          k = C + 1 / 3 * -(F - 1), k < 0 && k++, k > 1 && k--, 6 * k < 1 ? M = T + (E - T) * 6 * k : 2 * k < 1 ? M = E : 3 * k < 2 ? M = T + (E - T) * (2 / 3 - k) * 6 : M = T, A[F] = M * 255;
        return {
          r: Math.round(A[0]),
          g: Math.round(A[1]),
          b: Math.round(A[2]),
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
    each(d, f) {
      for (const b in d)
        f(b, d[b]);
    },
    _inRange(d, f, b) {
      return f <= d && d < b;
    },
    _getProjectionToSegment(d, f, b, C, P, v) {
      let E, k, M;
      const T = (d - b) * (d - b) + (f - C) * (f - C);
      if (T == 0)
        E = d, k = f, M = (P - b) * (P - b) + (v - C) * (v - C);
      else {
        const A = ((P - d) * (b - d) + (v - f) * (C - f)) / T;
        A < 0 ? (E = d, k = f, M = (d - P) * (d - P) + (f - v) * (f - v)) : A > 1 ? (E = b, k = C, M = (b - P) * (b - P) + (C - v) * (C - v)) : (E = d + A * (b - d), k = f + A * (C - f), M = (E - P) * (E - P) + (k - v) * (k - v));
      }
      return [E, k, M];
    },
    _getProjectionToLine(d, f, b) {
      const C = a.Util.cloneObject(d);
      let P = Number.MAX_VALUE;
      return f.forEach(function(v, E) {
        if (!b && E === f.length - 1)
          return;
        const k = f[(E + 1) % f.length], M = a.Util._getProjectionToSegment(v.x, v.y, k.x, k.y, d.x, d.y), T = M[0], A = M[1], F = M[2];
        F < P && (C.x = T, C.y = A, P = F);
      }), C;
    },
    _prepareArrayForTween(d, f, b) {
      const C = [], P = [];
      if (d.length > f.length) {
        const E = f;
        f = d, d = E;
      }
      for (let E = 0; E < d.length; E += 2)
        C.push({
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
        const k = a.Util._getProjectionToLine(E, C, b);
        v.push(k.x), v.push(k.y);
      }), v;
    },
    _prepareToStringify(d) {
      let f;
      d.visitedByCircularReferenceRemoval = !0;
      for (const b in d)
        if (d.hasOwnProperty(b) && d[b] && typeof d[b] == "object") {
          if (f = Object.getOwnPropertyDescriptor(d, b), d[b].visitedByCircularReferenceRemoval || a.Util._isElement(d[b]))
            if (f.configurable)
              delete d[b];
            else
              return null;
          else if (a.Util._prepareToStringify(d[b]) === null)
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
    drawRoundedRectPath(d, f, b, C) {
      let P = 0, v = 0, E = 0, k = 0;
      typeof C == "number" ? P = v = E = k = Math.min(C, f / 2, b / 2) : (P = Math.min(C[0] || 0, f / 2, b / 2), v = Math.min(C[1] || 0, f / 2, b / 2), k = Math.min(C[2] || 0, f / 2, b / 2), E = Math.min(C[3] || 0, f / 2, b / 2)), d.moveTo(P, 0), d.lineTo(f - v, 0), d.arc(f - v, v, v, Math.PI * 3 / 2, 0, !1), d.lineTo(f, b - k), d.arc(f - k, b - k, k, 0, Math.PI / 2, !1), d.lineTo(E, b), d.arc(E, b - E, E, Math.PI / 2, Math.PI, !1), d.lineTo(0, P), d.arc(P, P, P, Math.PI, Math.PI * 3 / 2, !1);
    }
  };
})(rt);
var it = {}, St = {}, Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.HitContext = Tt.SceneContext = Tt.Context = void 0;
const Jr = rt, fs = U;
function gs(a) {
  const t = [], e = a.length, i = Jr.Util;
  for (let n = 0; n < e; n++) {
    let r = a[n];
    i._isNumber(r) ? r = Math.round(r * 1e3) / 1e3 : i._isString(r) || (r = r + ""), t.push(r);
  }
  return t;
}
const hr = ",", ps = "(", _s = ")", ms = "([", ys = "])", bs = ";", vs = "()", Ss = "=", dr = [
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
], ws = [
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
], Cs = 100;
class ci {
  constructor(t) {
    this.canvas = t, fs.Konva.enableTrace && (this.traceArr = [], this._enableTrace());
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
    let i = this.traceArr, n = i.length, r = "", s, o, l, h;
    for (s = 0; s < n; s++)
      o = i[s], l = o.method, l ? (h = o.args, r += l, t ? r += vs : Jr.Util._isArray(h[0]) ? r += ms + h.join(hr) + ys : (e && (h = h.map((u) => typeof u == "number" ? Math.floor(u) : u)), r += ps + h.join(hr) + _s)) : (r += o.property, t || (r += Ss + o.val)), r += bs;
    return r;
  }
  clearTrace() {
    this.traceArr = [];
  }
  _trace(t) {
    let e = this.traceArr, i;
    e.push(t), i = e.length, i >= Cs && e.shift();
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
  drawImage(t, e, i, n, r, s, o, l, h) {
    const u = arguments, p = this._context;
    u.length === 3 ? p.drawImage(t, e, i) : u.length === 5 ? p.drawImage(t, e, i, n, r) : u.length === 9 && p.drawImage(t, e, i, n, r, s, o, l, h);
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
    let t = this, e = dr.length, i = this.setAttr, n, r;
    const s = function(o) {
      let l = t[o], h;
      t[o] = function() {
        return r = gs(Array.prototype.slice.call(arguments, 0)), h = l.apply(t, arguments), t._trace({
          method: o,
          args: r
        }), h;
      };
    };
    for (n = 0; n < e; n++)
      s(dr[n]);
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
Tt.Context = ci;
ws.forEach(function(a) {
  Object.defineProperty(ci.prototype, a, {
    get() {
      return this._context[a];
    },
    set(t) {
      this._context[a] = t;
    }
  });
});
class xs extends ci {
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
    }, l = t.getAbsoluteScale(), h = this.canvas.getPixelRatio(), u = l.x * h, p = l.y * h;
    this.setAttr("shadowColor", r), this.setAttr("shadowBlur", s * Math.min(Math.abs(u), Math.abs(p))), this.setAttr("shadowOffsetX", o.x * u), this.setAttr("shadowOffsetY", o.y * p);
  }
}
Tt.SceneContext = xs;
class ks extends ci {
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
Tt.HitContext = ks;
Object.defineProperty(St, "__esModule", { value: !0 });
St.HitCanvas = St.SceneCanvas = St.Canvas = void 0;
const ri = rt, Zr = Tt, ta = U;
let Ye;
function As() {
  if (Ye)
    return Ye;
  const a = ri.Util.createCanvasElement(), t = a.getContext("2d");
  return Ye = function() {
    const e = ta.Konva._global.devicePixelRatio || 1, i = t.webkitBackingStorePixelRatio || t.mozBackingStorePixelRatio || t.msBackingStorePixelRatio || t.oBackingStorePixelRatio || t.backingStorePixelRatio || 1;
    return e / i;
  }(), ri.Util.releaseCanvas(a), Ye;
}
class $n {
  constructor(t) {
    this.pixelRatio = 1, this.width = 0, this.height = 0, this.isCache = !1;
    const i = (t || {}).pixelRatio || ta.Konva.pixelRatio || As();
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
St.Canvas = $n;
class Ps extends $n {
  constructor(t = { width: 0, height: 0, willReadFrequently: !1 }) {
    super(t), this.context = new Zr.SceneContext(this, {
      willReadFrequently: t.willReadFrequently
    }), this.setSize(t.width, t.height);
  }
}
St.SceneCanvas = Ps;
class Es extends $n {
  constructor(t = { width: 0, height: 0 }) {
    super(t), this.hitCanvas = !0, this.context = new Zr.HitContext(this), this.setSize(t.width, t.height);
  }
}
St.HitCanvas = Es;
var ui = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.DD = void 0;
  const t = U, e = rt;
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
        const h = l._changedPointerPositions.find((u) => u.id === r.pointerId);
        if (h) {
          if (r.dragStatus !== "dragging") {
            const u = o.dragDistance();
            if (Math.max(Math.abs(h.x - r.startPointerPos.x), Math.abs(h.y - r.startPointerPos.y)) < u || (o.startDrag({ evt: i }), !o.isDragging()))
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
        if (i && o.setPointersPositions(i), !o._changedPointerPositions.find((u) => u.id === r.pointerId))
          return;
        (r.dragStatus === "dragging" || r.dragStatus === "stopped") && (a.DD.justDragged = !0, t.Konva._mouseListenClick = !1, t.Konva._touchListenClick = !1, t.Konva._pointerListenClick = !1, r.dragStatus = "stopped");
        const h = r.node.getLayer() || r.node instanceof t.Konva.Stage && r.node;
        h && n.indexOf(h) === -1 && n.push(h);
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
})(ui);
var B = {}, N = {};
Object.defineProperty(N, "__esModule", { value: !0 });
N.RGBComponent = Ms;
N.alphaComponent = Ts;
N.getNumberValidator = Rs;
N.getNumberOrArrayOfNumbersValidator = $s;
N.getNumberOrAutoValidator = Fs;
N.getStringValidator = Os;
N.getStringOrGradientValidator = Ds;
N.getFunctionValidator = Ls;
N.getNumberArrayValidator = Ns;
N.getBooleanValidator = Is;
N.getComponentValidator = Gs;
const Rt = U, ot = rt;
function $t(a) {
  return ot.Util._isString(a) ? '"' + a + '"' : Object.prototype.toString.call(a) === "[object Number]" || ot.Util._isBoolean(a) ? a : Object.prototype.toString.call(a);
}
function Ms(a) {
  return a > 255 ? 255 : a < 0 ? 0 : Math.round(a);
}
function Ts(a) {
  return a > 1 ? 1 : a < 1e-4 ? 1e-4 : a;
}
function Rs() {
  if (Rt.Konva.isUnminified)
    return function(a, t) {
      return ot.Util._isNumber(a) || ot.Util.warn($t(a) + ' is a not valid value for "' + t + '" attribute. The value should be a number.'), a;
    };
}
function $s(a) {
  if (Rt.Konva.isUnminified)
    return function(t, e) {
      let i = ot.Util._isNumber(t), n = ot.Util._isArray(t) && t.length == a;
      return !i && !n && ot.Util.warn($t(t) + ' is a not valid value for "' + e + '" attribute. The value should be a number or Array<number>(' + a + ")"), t;
    };
}
function Fs() {
  if (Rt.Konva.isUnminified)
    return function(a, t) {
      return ot.Util._isNumber(a) || a === "auto" || ot.Util.warn($t(a) + ' is a not valid value for "' + t + '" attribute. The value should be a number or "auto".'), a;
    };
}
function Os() {
  if (Rt.Konva.isUnminified)
    return function(a, t) {
      return ot.Util._isString(a) || ot.Util.warn($t(a) + ' is a not valid value for "' + t + '" attribute. The value should be a string.'), a;
    };
}
function Ds() {
  if (Rt.Konva.isUnminified)
    return function(a, t) {
      const e = ot.Util._isString(a), i = Object.prototype.toString.call(a) === "[object CanvasGradient]" || a && a.addColorStop;
      return e || i || ot.Util.warn($t(a) + ' is a not valid value for "' + t + '" attribute. The value should be a string or a native gradient.'), a;
    };
}
function Ls() {
  if (Rt.Konva.isUnminified)
    return function(a, t) {
      return ot.Util._isFunction(a) || ot.Util.warn($t(a) + ' is a not valid value for "' + t + '" attribute. The value should be a function.'), a;
    };
}
function Ns() {
  if (Rt.Konva.isUnminified)
    return function(a, t) {
      const e = Int8Array ? Object.getPrototypeOf(Int8Array) : null;
      return e && a instanceof e || (ot.Util._isArray(a) ? a.forEach(function(i) {
        ot.Util._isNumber(i) || ot.Util.warn('"' + t + '" attribute has non numeric element ' + i + ". Make sure that all elements are numbers.");
      }) : ot.Util.warn($t(a) + ' is a not valid value for "' + t + '" attribute. The value should be a array of numbers.')), a;
    };
}
function Is() {
  if (Rt.Konva.isUnminified)
    return function(a, t) {
      return a === !0 || a === !1 || ot.Util.warn($t(a) + ' is a not valid value for "' + t + '" attribute. The value should be a boolean.'), a;
    };
}
function Gs(a) {
  if (Rt.Konva.isUnminified)
    return function(t, e) {
      return t == null || ot.Util.isObject(t) || ot.Util.warn($t(t) + ' is a not valid value for "' + e + '" attribute. The value should be an object with properties ' + a), t;
    };
}
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Factory = void 0;
  const t = rt, e = N, i = "get", n = "set";
  a.Factory = {
    addGetterSetter(r, s, o, l, h) {
      a.Factory.addGetter(r, s, o), a.Factory.addSetter(r, s, l, h), a.Factory.addOverloadedGetterSetter(r, s);
    },
    addGetter(r, s, o) {
      const l = i + t.Util._capitalize(s);
      r.prototype[l] = r.prototype[l] || function() {
        const h = this.attrs[s];
        return h === void 0 ? o : h;
      };
    },
    addSetter(r, s, o, l) {
      const h = n + t.Util._capitalize(s);
      r.prototype[h] || a.Factory.overWriteSetter(r, s, o, l);
    },
    overWriteSetter(r, s, o, l) {
      const h = n + t.Util._capitalize(s);
      r.prototype[h] = function(u) {
        return o && u !== void 0 && u !== null && (u = o.call(this, u, s)), this._setAttr(s, u), l && l.call(this), this;
      };
    },
    addComponentsGetterSetter(r, s, o, l, h) {
      const u = o.length, p = t.Util._capitalize, g = i + p(s), _ = n + p(s);
      r.prototype[g] = function() {
        const m = {};
        for (let y = 0; y < u; y++) {
          const S = o[y];
          m[S] = this.getAttr(s + p(S));
        }
        return m;
      };
      const c = (0, e.getComponentValidator)(o);
      r.prototype[_] = function(m) {
        const y = this.attrs[s];
        l && (m = l.call(this, m, s)), c && c.call(this, m, s);
        for (const S in m)
          m.hasOwnProperty(S) && this._setAttr(s + p(S), m[S]);
        return m || o.forEach((S) => {
          this._setAttr(s + p(S), void 0);
        }), this._fireChangeEvent(s, y, m), h && h.call(this), this;
      }, a.Factory.addOverloadedGetterSetter(r, s);
    },
    addOverloadedGetterSetter(r, s) {
      const o = t.Util._capitalize(s), l = n + o, h = i + o;
      r.prototype[s] = function() {
        return arguments.length ? (this[l](arguments[0]), this) : this[h]();
      };
    },
    addDeprecatedGetterSetter(r, s, o, l) {
      t.Util.error("Adding deprecated " + s);
      const h = i + t.Util._capitalize(s), u = s + " property is deprecated and will be removed soon. Look at Konva change log for more information.";
      r.prototype[h] = function() {
        t.Util.error(u);
        const p = this.attrs[s];
        return p === void 0 ? o : p;
      }, a.Factory.addSetter(r, s, l, function() {
        t.Util.error(u);
      }), a.Factory.addOverloadedGetterSetter(r, s);
    },
    backCompat(r, s) {
      t.Util.each(s, function(o, l) {
        const h = r.prototype[l], u = i + t.Util._capitalize(o), p = n + t.Util._capitalize(o);
        function g() {
          h.apply(this, arguments), t.Util.error('"' + o + '" method is deprecated and will be removed soon. Use ""' + l + '" instead.');
        }
        r.prototype[o] = g, r.prototype[u] = g, r.prototype[p] = g;
      });
    },
    afterSetFilter() {
      this._filterUpToDate = !1;
    }
  };
})(B);
Object.defineProperty(it, "__esModule", { value: !0 });
it.Node = void 0;
const de = St, bt = ui, Ve = B, Lt = U, H = rt, ut = N, ti = "absoluteOpacity", Ke = "allEventListeners", Mt = "absoluteTransform", cr = "absoluteScale", Kt = "canvas", Us = "Change", Bs = "children", Vs = "konva", mn = "listening", Hs = "mouseenter", zs = "mouseleave", Ws = "pointerenter", js = "pointerleave", Ys = "touchenter", Ks = "touchleave", ur = "set", fr = "Shape", ei = " ", gr = "stage", Nt = "transform", Xs = "Stage", yn = "visible", qs = [
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
let Qs = 1;
class I {
  constructor(t) {
    this._id = Qs++, this.eventListeners = {}, this.attrs = {}, this.index = 0, this._allEventListeners = null, this.parent = null, this._cache = /* @__PURE__ */ new Map(), this._attachedDepsListeners = /* @__PURE__ */ new Map(), this._lastPos = null, this._batchingTransformChange = !1, this._needClearTransformCache = !1, this._filterUpToDate = !1, this._isUnderCache = !1, this._dragEventId = null, this._shouldFireChangeEvents = !1, this.setAttrs(t), this._shouldFireChangeEvents = !0;
  }
  hasChildren() {
    return !1;
  }
  _clearCache(t) {
    (t === Nt || t === Mt) && this._cache.get(t) ? this._cache.get(t).dirty = !0 : t ? this._cache.delete(t) : this._cache.clear();
  }
  _getCache(t, e) {
    let i = this._cache.get(t);
    return (i === void 0 || (t === Nt || t === Mt) && i.dirty === !0) && (i = e.call(this), this._cache.set(t, i)), i;
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
    return this._cache.get(Kt);
  }
  _clearSelfAndDescendantCache(t) {
    this._clearCache(t), t === Mt && this.fire("absoluteTransformChange");
  }
  clearCache() {
    if (this._cache.has(Kt)) {
      const { scene: t, filter: e, hit: i, buffer: n } = this._cache.get(Kt);
      H.Util.releaseCanvas(t, e, i, n), this._cache.delete(Kt);
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
    let n = Math.ceil(e.width || i.width), r = Math.ceil(e.height || i.height), s = e.pixelRatio, o = e.x === void 0 ? Math.floor(i.x) : e.x, l = e.y === void 0 ? Math.floor(i.y) : e.y, h = e.offset || 0, u = e.drawBorder || !1, p = e.hitCanvasPixelRatio || 1;
    if (!n || !r) {
      H.Util.error("Can not cache the node. Width or height of the node equals 0. Caching is skipped.");
      return;
    }
    const g = Math.abs(Math.round(i.x) - o) > 0.5 ? 1 : 0, _ = Math.abs(Math.round(i.y) - l) > 0.5 ? 1 : 0;
    n += h * 2 + g, r += h * 2 + _, o -= h, l -= h;
    const c = new de.SceneCanvas({
      pixelRatio: s,
      width: n,
      height: r
    }), m = new de.SceneCanvas({
      pixelRatio: s,
      width: 0,
      height: 0,
      willReadFrequently: !0
    }), y = new de.HitCanvas({
      pixelRatio: p,
      width: n,
      height: r
    }), S = c.getContext(), w = y.getContext(), d = new de.SceneCanvas({
      width: c.width / c.pixelRatio + Math.abs(o),
      height: c.height / c.pixelRatio + Math.abs(l),
      pixelRatio: c.pixelRatio
    }), f = d.getContext();
    return y.isCache = !0, c.isCache = !0, this._cache.delete(Kt), this._filterUpToDate = !1, e.imageSmoothingEnabled === !1 && (c.getContext()._context.imageSmoothingEnabled = !1, m.getContext()._context.imageSmoothingEnabled = !1), S.save(), w.save(), f.save(), S.translate(-o, -l), w.translate(-o, -l), f.translate(-o, -l), d.x = o, d.y = l, this._isUnderCache = !0, this._clearSelfAndDescendantCache(ti), this._clearSelfAndDescendantCache(cr), this.drawScene(c, this, d), this.drawHit(y, this), this._isUnderCache = !1, S.restore(), w.restore(), u && (S.save(), S.beginPath(), S.rect(0, 0, n, r), S.closePath(), S.setAttr("strokeStyle", "red"), S.setAttr("lineWidth", 5), S.stroke(), S.restore()), this._cache.set(Kt, {
      scene: c,
      filter: m,
      hit: y,
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
    let n = 1 / 0, r = 1 / 0, s = -1 / 0, o = -1 / 0;
    const l = this.getAbsoluteTransform(e);
    return i.forEach(function(h) {
      const u = l.point(h);
      n === void 0 && (n = s = u.x, r = o = u.y), n = Math.min(n, u.x), r = Math.min(r, u.y), s = Math.max(s, u.x), o = Math.max(o, u.y);
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
    let t = this.filters(), e = this._getCanvasCache(), i = e.scene, n = e.filter, r = n.getContext(), s, o, l, h;
    if (t) {
      if (!this._filterUpToDate) {
        const u = i.pixelRatio;
        n.setSize(i.width / i.pixelRatio, i.height / i.pixelRatio);
        try {
          for (s = t.length, r.clear(), r.drawImage(i._canvas, 0, 0, i.getWidth() / u, i.getHeight() / u), o = r.getImageData(0, 0, n.getWidth(), n.getHeight()), l = 0; l < s; l++) {
            if (h = t[l], typeof h != "function") {
              H.Util.error("Filter should be type of function, but got " + typeof h + " instead. Please check correct filters");
              continue;
            }
            h.call(this, o), r.putImageData(o, 0, 0);
          }
        } catch (p) {
          H.Util.error("Unable to apply filter. " + p.message + " This post my help you https://konvajs.org/docs/posts/Tainted_Canvas.html.");
        }
        this._filterUpToDate = !0;
      }
      return n;
    }
    return i;
  }
  on(t, e) {
    if (this._cache && this._cache.delete(Ke), arguments.length === 3)
      return this._delegate.apply(this, arguments);
    const i = t.split(ei);
    for (let n = 0; n < i.length; n++) {
      const s = i[n].split("."), o = s[0], l = s[1] || "";
      this.eventListeners[o] || (this.eventListeners[o] = []), this.eventListeners[o].push({ name: l, handler: e });
    }
    return this;
  }
  off(t, e) {
    let i = (t || "").split(ei), n = i.length, r, s, o, l, h, u;
    if (this._cache && this._cache.delete(Ke), !t)
      for (s in this.eventListeners)
        this._off(s);
    for (r = 0; r < n; r++)
      if (o = i[r], l = o.split("."), h = l[0], u = l[1], h)
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
    const n = this;
    this.on(t, function(r) {
      const s = r.target.findAncestors(e, !0, n);
      for (let o = 0; o < s.length; o++)
        r = H.Util.cloneObject(r), r.currentTarget = s[o], i.call(s[o], r);
    });
  }
  remove() {
    return this.isDragging() && this.stopDrag(), bt.DD._dragElements.delete(this._id), this._remove(), this;
  }
  _clearCaches() {
    this._clearSelfAndDescendantCache(Mt), this._clearSelfAndDescendantCache(ti), this._clearSelfAndDescendantCache(cr), this._clearSelfAndDescendantCache(gr), this._clearSelfAndDescendantCache(yn), this._clearSelfAndDescendantCache(mn);
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
    const e = "get" + H.Util._capitalize(t);
    return H.Util._isFunction(this[e]) ? this[e]() : this.attrs[t];
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
        e !== Bs && (i = ur + H.Util._capitalize(e), H.Util._isFunction(this[i]) ? this[i](t[e]) : this._setAttr(e, t[e]));
    }), this;
  }
  isListening() {
    return this._getCache(mn, this._isListening);
  }
  _isListening(t) {
    if (!this.listening())
      return !1;
    const i = this.getParent();
    return i && i !== t && this !== t ? i._isListening(t) : !0;
  }
  isVisible() {
    return this._getCache(yn, this._isVisible);
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
    const r = !e && !Lt.Konva.hitOnDragEnabled && (n || Lt.Konva.isTransforming());
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
    function l(u) {
      for (n = [], r = u.length, s = 0; s < r; s++)
        o = u[s], i++, o.nodeType !== fr && (n = n.concat(o.getChildren().slice())), o._id === e._id && (s = r);
      n.length > 0 && n[0].getDepth() <= t && l(n);
    }
    const h = this.getStage();
    return e.nodeType !== Xs && h && l(h.getChildren()), i;
  }
  getDepth() {
    let t = 0, e = this.parent;
    for (; e; )
      t++, e = e.parent;
    return t;
  }
  _batchTransformChanges(t) {
    this._batchingTransformChange = !0, t(), this._batchingTransformChange = !1, this._needClearTransformCache && (this._clearCache(Nt), this._clearSelfAndDescendantCache(Mt)), this._needClearTransformCache = !1;
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
    const n = this.getAbsoluteTransform(t).getMatrix(), r = new H.Transform(), s = this.offset();
    return r.m = n.slice(), r.translate(s.x, s.y), r.getTranslation();
  }
  setAbsolutePosition(t) {
    const { x: e, y: i, ...n } = this._clearTransform();
    this.attrs.x = e, this.attrs.y = i, this._clearCache(Nt);
    const r = this._getAbsoluteTransform().copy();
    return r.invert(), r.translate(t.x, t.y), t = {
      x: this.attrs.x + r.getTranslation().x,
      y: this.attrs.y + r.getTranslation().y
    }, this._setTransform(n), this.setPosition({ x: t.x, y: t.y }), this._clearCache(Nt), this._clearSelfAndDescendantCache(Mt), this;
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
      return H.Util.warn("Node has no parent. moveToTop function is ignored."), !1;
    const t = this.index, e = this.parent.getChildren().length;
    return t < e - 1 ? (this.parent.children.splice(t, 1), this.parent.children.push(this), this.parent._setChildrenIndices(), !0) : !1;
  }
  moveUp() {
    if (!this.parent)
      return H.Util.warn("Node has no parent. moveUp function is ignored."), !1;
    const t = this.index, e = this.parent.getChildren().length;
    return t < e - 1 ? (this.parent.children.splice(t, 1), this.parent.children.splice(t + 1, 0, this), this.parent._setChildrenIndices(), !0) : !1;
  }
  moveDown() {
    if (!this.parent)
      return H.Util.warn("Node has no parent. moveDown function is ignored."), !1;
    const t = this.index;
    return t > 0 ? (this.parent.children.splice(t, 1), this.parent.children.splice(t - 1, 0, this), this.parent._setChildrenIndices(), !0) : !1;
  }
  moveToBottom() {
    if (!this.parent)
      return H.Util.warn("Node has no parent. moveToBottom function is ignored."), !1;
    const t = this.index;
    return t > 0 ? (this.parent.children.splice(t, 1), this.parent.children.unshift(this), this.parent._setChildrenIndices(), !0) : !1;
  }
  setZIndex(t) {
    if (!this.parent)
      return H.Util.warn("Node has no parent. zIndex parameter is ignored."), this;
    (t < 0 || t >= this.parent.children.length) && H.Util.warn("Unexpected value " + t + " for zIndex property. zIndex is just index of a node in children of its parent. Expected value is from 0 to " + (this.parent.children.length - 1) + ".");
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
    let t = this.getAttrs(), e, i, n, r, s;
    const o = {
      attrs: {},
      className: this.getClassName()
    };
    for (e in t)
      i = t[e], s = H.Util.isObject(i) && !H.Util._isPlainObject(i) && !H.Util._isArray(i), !s && (n = typeof this[e] == "function" && this[e], delete t[e], r = n ? n.call(this) : null, t[e] = i, r !== i && (o.attrs[e] = i));
    return H.Util._prepareToStringify(o);
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
      if (r = e[n], H.Util.isValidSelector(r) || (H.Util.warn('Selector "' + r + '" is invalid. Allowed selectors examples are "#foo", ".bar" or "Group".'), H.Util.warn('If you have a custom shape with such className, please change it to start with upper letter like "Triangle".'), H.Util.warn("Konva is awesome, right?")), r.charAt(0) === "#") {
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
    return this._getCache(gr, this._getStage);
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
      return e = new H.Transform(), this._eachAncestorReverse(function(i) {
        const n = i.transformsEnabled();
        n === "all" ? e.multiply(i.getTransform()) : n === "position" && e.translate(i.x() - i.offsetX(), i.y() - i.offsetY());
      }, t), e;
    {
      e = this._cache.get(Mt) || new H.Transform(), this.parent ? this.parent.getAbsoluteTransform().copyInto(e) : e.reset();
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
    const i = this._cache.get(Nt) || new H.Transform();
    i.reset();
    const n = this.x(), r = this.y(), s = Lt.Konva.getAngle(this.rotation()), o = (t = this.attrs.scaleX) !== null && t !== void 0 ? t : 1, l = (e = this.attrs.scaleY) !== null && e !== void 0 ? e : 1, h = this.attrs.skewX || 0, u = this.attrs.skewY || 0, p = this.attrs.offsetX || 0, g = this.attrs.offsetY || 0;
    return (n !== 0 || r !== 0) && i.translate(n, r), s !== 0 && i.rotate(s), (h !== 0 || u !== 0) && i.skew(h, u), (o !== 1 || l !== 1) && i.scale(o, l), (p !== 0 || g !== 0) && i.translate(-1 * p, -1 * g), i.dirty = !1, i;
  }
  clone(t) {
    let e = H.Util.cloneObject(this.attrs), i, n, r, s, o;
    for (i in t)
      e[i] = t[i];
    const l = new this.constructor(e);
    for (i in this.eventListeners)
      for (n = this.eventListeners[i], r = n.length, s = 0; s < r; s++)
        o = n[s], o.name.indexOf(Vs) < 0 && (l.eventListeners[i] || (l.eventListeners[i] = []), l.eventListeners[i].push(o));
    return l;
  }
  _toKonvaCanvas(t) {
    t = t || {};
    const e = this.getClientRect(), i = this.getStage(), n = t.x !== void 0 ? t.x : Math.floor(e.x), r = t.y !== void 0 ? t.y : Math.floor(e.y), s = t.pixelRatio || 1, o = new de.SceneCanvas({
      width: t.width || Math.ceil(e.width) || (i ? i.width() : 0),
      height: t.height || Math.ceil(e.height) || (i ? i.height() : 0),
      pixelRatio: s
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
        n && delete t.callback, H.Util._urlToImage(this.toDataURL(t), function(r) {
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
    return this.attrs.dragDistance !== void 0 ? this.attrs.dragDistance : this.parent ? this.parent.getDragDistance() : Lt.Konva.dragDistance;
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
    this._fire(t + Us, {
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
    const i = this[ur + H.Util._capitalize(t)];
    return H.Util._isFunction(i) ? i.call(this, e) : this._setAttr(t, e), this;
  }
  _requestDraw() {
    if (Lt.Konva.autoDrawEnabled) {
      const t = this.getLayer() || this.getStage();
      t == null || t.batchDraw();
    }
  }
  _setAttr(t, e) {
    const i = this.attrs[t];
    i === e && !H.Util.isObject(e) || (e == null ? delete this.attrs[t] : this.attrs[t] = e, this._shouldFireChangeEvents && this._fireChangeEvent(t, i, e), this._requestDraw());
  }
  _setComponentAttr(t, e, i) {
    let n;
    i !== void 0 && (n = this.attrs[t], n || (this.attrs[t] = this.getAttr(t)), this.attrs[t][e] = i, this._fireChangeEvent(t, n, i));
  }
  _fireAndBubble(t, e, i) {
    e && this.nodeType === fr && (e.target = this);
    const n = [
      Hs,
      zs,
      Ws,
      js,
      Ys,
      Ks
    ];
    if (!(n.indexOf(t) !== -1 && (i && (this === i || this.isAncestorOf && this.isAncestorOf(i)) || this.nodeType === "Stage" && !i))) {
      this._fire(t, e);
      const s = n.indexOf(t) !== -1 && i && i.isAncestorOf && i.isAncestorOf(this) && !i.isAncestorOf(this.parent);
      (e && !e.cancelBubble || !e) && this.parent && this.parent.isListening() && !s && (i && i.parent ? this._fireAndBubble.call(this.parent, t, e, i) : this._fireAndBubble.call(this.parent, t, e));
    }
  }
  _getProtoListeners(t) {
    var e, i, n;
    const r = (e = this._cache.get(Ke)) !== null && e !== void 0 ? e : {};
    let s = r == null ? void 0 : r[t];
    if (s === void 0) {
      s = [];
      let o = Object.getPrototypeOf(this);
      for (; o; ) {
        const l = (n = (i = o.eventListeners) === null || i === void 0 ? void 0 : i[t]) !== null && n !== void 0 ? n : [];
        s.push(...l), o = Object.getPrototypeOf(o);
      }
      r[t] = s, this._cache.set(Ke, r);
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
      s ? n = s : H.Util.warn("dragBoundFunc did not return any value. That is unexpected behavior. You must return new absolute position from dragBoundFunc.");
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
    return H.Util.haveIntersection(i, this.getClientRect());
  }
  static create(t, e) {
    return H.Util._isString(t) && (t = JSON.parse(t)), this._createNode(t, e);
  }
  static _createNode(t, e) {
    let i = I.prototype.getClassName.call(t), n = t.children, r, s, o;
    e && (t.attrs.container = e), Lt.Konva[i] || (H.Util.warn('Can not find a node with class name "' + i + '". Fallback to "Shape".'), i = "Shape");
    const l = Lt.Konva[i];
    if (r = new l(t.attrs), n)
      for (s = n.length, o = 0; o < s; o++)
        r.add(I._createNode(n[o]));
    return r;
  }
}
it.Node = I;
I.prototype.nodeType = "Node";
I.prototype._attrsAffectingSize = [];
I.prototype.eventListeners = {};
I.prototype.on.call(I.prototype, qs, function() {
  if (this._batchingTransformChange) {
    this._needClearTransformCache = !0;
    return;
  }
  this._clearCache(Nt), this._clearSelfAndDescendantCache(Mt);
});
I.prototype.on.call(I.prototype, "visibleChange.konva", function() {
  this._clearSelfAndDescendantCache(yn);
});
I.prototype.on.call(I.prototype, "listeningChange.konva", function() {
  this._clearSelfAndDescendantCache(mn);
});
I.prototype.on.call(I.prototype, "opacityChange.konva", function() {
  this._clearSelfAndDescendantCache(ti);
});
const J = Ve.Factory.addGetterSetter;
J(I, "zIndex");
J(I, "absolutePosition");
J(I, "position");
J(I, "x", 0, (0, ut.getNumberValidator)());
J(I, "y", 0, (0, ut.getNumberValidator)());
J(I, "globalCompositeOperation", "source-over", (0, ut.getStringValidator)());
J(I, "opacity", 1, (0, ut.getNumberValidator)());
J(I, "name", "", (0, ut.getStringValidator)());
J(I, "id", "", (0, ut.getStringValidator)());
J(I, "rotation", 0, (0, ut.getNumberValidator)());
Ve.Factory.addComponentsGetterSetter(I, "scale", ["x", "y"]);
J(I, "scaleX", 1, (0, ut.getNumberValidator)());
J(I, "scaleY", 1, (0, ut.getNumberValidator)());
Ve.Factory.addComponentsGetterSetter(I, "skew", ["x", "y"]);
J(I, "skewX", 0, (0, ut.getNumberValidator)());
J(I, "skewY", 0, (0, ut.getNumberValidator)());
Ve.Factory.addComponentsGetterSetter(I, "offset", ["x", "y"]);
J(I, "offsetX", 0, (0, ut.getNumberValidator)());
J(I, "offsetY", 0, (0, ut.getNumberValidator)());
J(I, "dragDistance", void 0, (0, ut.getNumberValidator)());
J(I, "width", 0, (0, ut.getNumberValidator)());
J(I, "height", 0, (0, ut.getNumberValidator)());
J(I, "listening", !0, (0, ut.getBooleanValidator)());
J(I, "preventDefault", !0, (0, ut.getBooleanValidator)());
J(I, "filters", void 0, function(a) {
  return this._filterUpToDate = !1, a;
});
J(I, "visible", !0, (0, ut.getBooleanValidator)());
J(I, "transformsEnabled", "all", (0, ut.getStringValidator)());
J(I, "size");
J(I, "dragBoundFunc");
J(I, "draggable", !1, (0, ut.getBooleanValidator)());
Ve.Factory.backCompat(I, {
  rotateDeg: "rotate",
  setRotationDeg: "setRotation",
  getRotationDeg: "getRotation"
});
var Zt = {};
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.Container = void 0;
const Ce = B, sn = it, fi = N;
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
    const n = this.getLayer(), r = t || n && n.getCanvas(), s = r && r.getContext(), o = this._getCanvasCache(), l = o && o.scene, h = r && r.isCache;
    if (!this.isVisible() && !h)
      return this;
    if (l) {
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
      const l = this.getAbsoluteTransform(e).getMatrix();
      r.transform(l[0], l[1], l[2], l[3], l[4], l[5]), this._drawCachedHitCanvas(r), r.restore();
    } else
      this._drawChildren("drawHit", n, e);
    return this;
  }
  _drawChildren(t, e, i, n) {
    var r;
    const s = e && e.getContext(), o = this.clipWidth(), l = this.clipHeight(), h = this.clipFunc(), u = typeof o == "number" && typeof l == "number" || h, p = i === this;
    if (u) {
      s.save();
      const _ = this.getAbsoluteTransform(i);
      let c = _.getMatrix();
      s.transform(c[0], c[1], c[2], c[3], c[4], c[5]), s.beginPath();
      let m;
      if (h)
        m = h.call(this, s, this);
      else {
        const y = this.clipX(), S = this.clipY();
        s.rect(y || 0, S || 0, o, l);
      }
      s.clip.apply(s, m), c = _.copy().invert().getMatrix(), s.transform(c[0], c[1], c[2], c[3], c[4], c[5]);
    }
    const g = !p && this.globalCompositeOperation() !== "source-over" && t === "drawScene";
    g && (s.save(), s._applyGlobalCompositeOperation(this)), (r = this.children) === null || r === void 0 || r.forEach(function(_) {
      _[t](e, i, n);
    }), g && s.restore(), u && s.restore();
  }
  getClientRect(t = {}) {
    var e;
    const i = t.skipTransform, n = t.relativeTo;
    let r, s, o, l, h = {
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
      c.width === 0 && c.height === 0 || (r === void 0 ? (r = c.x, s = c.y, o = c.x + c.width, l = c.y + c.height) : (r = Math.min(r, c.x), s = Math.min(s, c.y), o = Math.max(o, c.x + c.width), l = Math.max(l, c.y + c.height)));
    });
    const p = this.find("Shape");
    let g = !1;
    for (let _ = 0; _ < p.length; _++)
      if (p[_]._isVisible(this)) {
        g = !0;
        break;
      }
    return g && r !== void 0 ? h = {
      x: r,
      y: s,
      width: o - r,
      height: l - s
    } : h = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, i ? h : this._transformedRect(h, n);
  }
}
Zt.Container = te;
Ce.Factory.addComponentsGetterSetter(te, "clip", [
  "x",
  "y",
  "width",
  "height"
]);
Ce.Factory.addGetterSetter(te, "clipX", void 0, (0, fi.getNumberValidator)());
Ce.Factory.addGetterSetter(te, "clipY", void 0, (0, fi.getNumberValidator)());
Ce.Factory.addGetterSetter(te, "clipWidth", void 0, (0, fi.getNumberValidator)());
Ce.Factory.addGetterSetter(te, "clipHeight", void 0, (0, fi.getNumberValidator)());
Ce.Factory.addGetterSetter(te, "clipFunc");
var ea = {}, Bt = {};
Object.defineProperty(Bt, "__esModule", { value: !0 });
Bt.getCapturedShape = Zs;
Bt.createEvent = Fn;
Bt.hasPointerCapture = to;
Bt.setPointerCapture = eo;
Bt.releaseCapture = na;
const Js = U, Ge = /* @__PURE__ */ new Map(), ia = Js.Konva._global.PointerEvent !== void 0;
function Zs(a) {
  return Ge.get(a);
}
function Fn(a) {
  return {
    evt: a,
    pointerId: a.pointerId
  };
}
function to(a, t) {
  return Ge.get(a) === t;
}
function eo(a, t) {
  na(a), t.getStage() && (Ge.set(a, t), ia && t._fire("gotpointercapture", Fn(new PointerEvent("gotpointercapture"))));
}
function na(a, t) {
  const e = Ge.get(a);
  if (!e)
    return;
  const i = e.getStage();
  i && i.content, Ge.delete(a), ia && e._fire("lostpointercapture", Fn(new PointerEvent("lostpointercapture")));
}
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Stage = a.stages = void 0;
  const t = rt, e = B, i = Zt, n = U, r = St, s = ui, o = U, l = Bt, h = "Stage", u = "string", p = "px", g = "mouseout", _ = "mouseleave", c = "mouseover", m = "mouseenter", y = "mousemove", S = "mousedown", w = "mouseup", d = "pointermove", f = "pointerdown", b = "pointerup", C = "pointercancel", P = "lostpointercapture", v = "pointerout", E = "pointerleave", k = "pointerover", M = "pointerenter", T = "contextmenu", A = "touchstart", F = "touchend", $ = "touchmove", q = "touchcancel", K = "wheel", L = 5, j = [
    [m, "_pointerenter"],
    [S, "_pointerdown"],
    [y, "_pointermove"],
    [w, "_pointerup"],
    [_, "_pointerleave"],
    [A, "_pointerdown"],
    [$, "_pointermove"],
    [F, "_pointerup"],
    [q, "_pointercancel"],
    [c, "_pointerover"],
    [K, "_wheel"],
    [T, "_contextmenu"],
    [f, "_pointerdown"],
    [d, "_pointermove"],
    [b, "_pointerup"],
    [C, "_pointercancel"],
    [E, "_pointerleave"],
    [P, "_lostpointercapture"]
  ], G = {
    mouse: {
      [v]: g,
      [E]: _,
      [k]: c,
      [M]: m,
      [d]: y,
      [f]: S,
      [b]: w,
      [C]: "mousecancel",
      pointerclick: "click",
      pointerdblclick: "dblclick"
    },
    touch: {
      [v]: "touchout",
      [E]: "touchleave",
      [k]: "touchover",
      [M]: "touchenter",
      [d]: $,
      [f]: A,
      [b]: F,
      [C]: q,
      pointerclick: "tap",
      pointerdblclick: "dbltap"
    },
    pointer: {
      [v]: v,
      [E]: E,
      [k]: k,
      [M]: M,
      [d]: d,
      [f]: f,
      [b]: b,
      [C]: C,
      pointerclick: "pointerclick",
      pointerdblclick: "pointerdblclick"
    }
  }, O = (mt) => mt.indexOf("pointer") >= 0 ? "pointer" : mt.indexOf("touch") >= 0 ? "touch" : "mouse", W = (mt) => {
    const x = O(mt);
    if (x === "pointer")
      return n.Konva.pointerEventsEnabled && G.pointer;
    if (x === "touch")
      return G.touch;
    if (x === "mouse")
      return G.mouse;
  };
  function nt(mt = {}) {
    return (mt.clipFunc || mt.clipWidth || mt.clipHeight) && t.Util.warn("Stage does not support clipping. Please use clip for Layers or Groups."), mt;
  }
  const oe = "Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);";
  a.stages = [];
  class At extends i.Container {
    constructor(x) {
      super(nt(x)), this._pointerPositions = [], this._changedPointerPositions = [], this._buildDOM(), this._bindContentEvents(), a.stages.push(this), this.on("widthChange.konva heightChange.konva", this._resizeDOM), this.on("visibleChange.konva", this._checkVisibility), this.on("clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva", () => {
        nt(this.attrs);
      }), this._checkVisibility();
    }
    _validateAdd(x) {
      const R = x.getType() === "Layer", D = x.getType() === "FastLayer";
      R || D || t.Util.throw("You may only add layers to the stage.");
    }
    _checkVisibility() {
      if (!this.content)
        return;
      const x = this.visible() ? "" : "none";
      this.content.style.display = x;
    }
    setContainer(x) {
      if (typeof x === u) {
        let R;
        if (x.charAt(0) === ".") {
          const D = x.slice(1);
          x = document.getElementsByClassName(D)[0];
        } else
          x.charAt(0) !== "#" ? R = x : R = x.slice(1), x = document.getElementById(R);
        if (!x)
          throw "Can not find container in document with id " + R;
      }
      return this._setAttr("container", x), this.content && (this.content.parentElement && this.content.parentElement.removeChild(this.content), x.appendChild(this.content)), this;
    }
    shouldDrawHit() {
      return !0;
    }
    clear() {
      const x = this.children, R = x.length;
      for (let D = 0; D < R; D++)
        x[D].clear();
      return this;
    }
    clone(x) {
      return x || (x = {}), x.container = typeof document < "u" && document.createElement("div"), i.Container.prototype.clone.call(this, x);
    }
    destroy() {
      super.destroy();
      const x = this.content;
      x && t.Util._isInDocument(x) && this.container().removeChild(x);
      const R = a.stages.indexOf(this);
      return R > -1 && a.stages.splice(R, 1), t.Util.releaseCanvas(this.bufferCanvas._canvas, this.bufferHitCanvas._canvas), this;
    }
    getPointerPosition() {
      const x = this._pointerPositions[0] || this._changedPointerPositions[0];
      return x ? {
        x: x.x,
        y: x.y
      } : (t.Util.warn(oe), null);
    }
    _getPointerById(x) {
      return this._pointerPositions.find((R) => R.id === x);
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
    _toKonvaCanvas(x) {
      x = x || {}, x.x = x.x || 0, x.y = x.y || 0, x.width = x.width || this.width(), x.height = x.height || this.height();
      const R = new r.SceneCanvas({
        width: x.width,
        height: x.height,
        pixelRatio: x.pixelRatio || 1
      }), D = R.getContext()._context, et = this.children;
      return (x.x || x.y) && D.translate(-1 * x.x, -1 * x.y), et.forEach(function(Q) {
        if (!Q.isVisible())
          return;
        const ht = Q._toKonvaCanvas(x);
        D.drawImage(ht._canvas, x.x, x.y, ht.getWidth() / ht.getPixelRatio(), ht.getHeight() / ht.getPixelRatio());
      }), R;
    }
    getIntersection(x) {
      if (!x)
        return null;
      const R = this.children, D = R.length, et = D - 1;
      for (let Q = et; Q >= 0; Q--) {
        const ht = R[Q].getIntersection(x);
        if (ht)
          return ht;
      }
      return null;
    }
    _resizeDOM() {
      const x = this.width(), R = this.height();
      this.content && (this.content.style.width = x + p, this.content.style.height = R + p), this.bufferCanvas.setSize(x, R), this.bufferHitCanvas.setSize(x, R), this.children.forEach((D) => {
        D.setSize({ width: x, height: R }), D.draw();
      });
    }
    add(x, ...R) {
      if (arguments.length > 1) {
        for (let et = 0; et < arguments.length; et++)
          this.add(arguments[et]);
        return this;
      }
      super.add(x);
      const D = this.children.length;
      return D > L && t.Util.warn("The stage has " + D + " layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group."), x.setSize({ width: this.width(), height: this.height() }), x.draw(), n.Konva.isBrowser && this.content.appendChild(x.canvas._canvas), this;
    }
    getParent() {
      return null;
    }
    getLayer() {
      return null;
    }
    hasPointerCapture(x) {
      return l.hasPointerCapture(x, this);
    }
    setPointerCapture(x) {
      l.setPointerCapture(x, this);
    }
    releaseCapture(x) {
      l.releaseCapture(x, this);
    }
    getLayers() {
      return this.children;
    }
    _bindContentEvents() {
      n.Konva.isBrowser && j.forEach(([x, R]) => {
        this.content.addEventListener(x, (D) => {
          this[R](D);
        }, { passive: !1 });
      });
    }
    _pointerenter(x) {
      this.setPointersPositions(x);
      const R = W(x.type);
      R && this._fire(R.pointerenter, {
        evt: x,
        target: this,
        currentTarget: this
      });
    }
    _pointerover(x) {
      this.setPointersPositions(x);
      const R = W(x.type);
      R && this._fire(R.pointerover, {
        evt: x,
        target: this,
        currentTarget: this
      });
    }
    _getTargetShape(x) {
      let R = this[x + "targetShape"];
      return R && !R.getStage() && (R = null), R;
    }
    _pointerleave(x) {
      const R = W(x.type), D = O(x.type);
      if (!R)
        return;
      this.setPointersPositions(x);
      const et = this._getTargetShape(D), Q = !(n.Konva.isDragging() || n.Konva.isTransforming()) || n.Konva.hitOnDragEnabled;
      et && Q ? (et._fireAndBubble(R.pointerout, { evt: x }), et._fireAndBubble(R.pointerleave, { evt: x }), this._fire(R.pointerleave, {
        evt: x,
        target: this,
        currentTarget: this
      }), this[D + "targetShape"] = null) : Q && (this._fire(R.pointerleave, {
        evt: x,
        target: this,
        currentTarget: this
      }), this._fire(R.pointerout, {
        evt: x,
        target: this,
        currentTarget: this
      })), this.pointerPos = null, this._pointerPositions = [];
    }
    _pointerdown(x) {
      const R = W(x.type), D = O(x.type);
      if (!R)
        return;
      this.setPointersPositions(x);
      let et = !1;
      this._changedPointerPositions.forEach((Q) => {
        const ht = this.getIntersection(Q);
        if (s.DD.justDragged = !1, n.Konva["_" + D + "ListenClick"] = !0, !ht || !ht.isListening()) {
          this[D + "ClickStartShape"] = void 0;
          return;
        }
        n.Konva.capturePointerEventsEnabled && ht.setPointerCapture(Q.id), this[D + "ClickStartShape"] = ht, ht._fireAndBubble(R.pointerdown, {
          evt: x,
          pointerId: Q.id
        }), et = !0;
        const yt = x.type.indexOf("touch") >= 0;
        ht.preventDefault() && x.cancelable && yt && x.preventDefault();
      }), et || this._fire(R.pointerdown, {
        evt: x,
        target: this,
        currentTarget: this,
        pointerId: this._pointerPositions[0].id
      });
    }
    _pointermove(x) {
      const R = W(x.type), D = O(x.type);
      if (!R || (n.Konva.isDragging() && s.DD.node.preventDefault() && x.cancelable && x.preventDefault(), this.setPointersPositions(x), !(!(n.Konva.isDragging() || n.Konva.isTransforming()) || n.Konva.hitOnDragEnabled)))
        return;
      const Q = {};
      let ht = !1;
      const yt = this._getTargetShape(D);
      this._changedPointerPositions.forEach((Dt) => {
        const tt = l.getCapturedShape(Dt.id) || this.getIntersection(Dt), le = Dt.id, Pt = { evt: x, pointerId: le }, he = yt !== tt;
        if (he && yt && (yt._fireAndBubble(R.pointerout, { ...Pt }, tt), yt._fireAndBubble(R.pointerleave, { ...Pt }, tt)), tt) {
          if (Q[tt._id])
            return;
          Q[tt._id] = !0;
        }
        tt && tt.isListening() ? (ht = !0, he && (tt._fireAndBubble(R.pointerover, { ...Pt }, yt), tt._fireAndBubble(R.pointerenter, { ...Pt }, yt), this[D + "targetShape"] = tt), tt._fireAndBubble(R.pointermove, { ...Pt })) : yt && (this._fire(R.pointerover, {
          evt: x,
          target: this,
          currentTarget: this,
          pointerId: le
        }), this[D + "targetShape"] = null);
      }), ht || this._fire(R.pointermove, {
        evt: x,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id
      });
    }
    _pointerup(x) {
      const R = W(x.type), D = O(x.type);
      if (!R)
        return;
      this.setPointersPositions(x);
      const et = this[D + "ClickStartShape"], Q = this[D + "ClickEndShape"], ht = {};
      let yt = !1;
      this._changedPointerPositions.forEach((Dt) => {
        const tt = l.getCapturedShape(Dt.id) || this.getIntersection(Dt);
        if (tt) {
          if (tt.releaseCapture(Dt.id), ht[tt._id])
            return;
          ht[tt._id] = !0;
        }
        const le = Dt.id, Pt = { evt: x, pointerId: le };
        let he = !1;
        n.Konva["_" + D + "InDblClickWindow"] ? (he = !0, clearTimeout(this[D + "DblTimeout"])) : s.DD.justDragged || (n.Konva["_" + D + "InDblClickWindow"] = !0, clearTimeout(this[D + "DblTimeout"])), this[D + "DblTimeout"] = setTimeout(function() {
          n.Konva["_" + D + "InDblClickWindow"] = !1;
        }, n.Konva.dblClickWindow), tt && tt.isListening() ? (yt = !0, this[D + "ClickEndShape"] = tt, tt._fireAndBubble(R.pointerup, { ...Pt }), n.Konva["_" + D + "ListenClick"] && et && et === tt && (tt._fireAndBubble(R.pointerclick, { ...Pt }), he && Q && Q === tt && tt._fireAndBubble(R.pointerdblclick, { ...Pt }))) : (this[D + "ClickEndShape"] = null, n.Konva["_" + D + "ListenClick"] && this._fire(R.pointerclick, {
          evt: x,
          target: this,
          currentTarget: this,
          pointerId: le
        }), he && this._fire(R.pointerdblclick, {
          evt: x,
          target: this,
          currentTarget: this,
          pointerId: le
        }));
      }), yt || this._fire(R.pointerup, {
        evt: x,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id
      }), n.Konva["_" + D + "ListenClick"] = !1, x.cancelable && D !== "touch" && D !== "pointer" && x.preventDefault();
    }
    _contextmenu(x) {
      this.setPointersPositions(x);
      const R = this.getIntersection(this.getPointerPosition());
      R && R.isListening() ? R._fireAndBubble(T, { evt: x }) : this._fire(T, {
        evt: x,
        target: this,
        currentTarget: this
      });
    }
    _wheel(x) {
      this.setPointersPositions(x);
      const R = this.getIntersection(this.getPointerPosition());
      R && R.isListening() ? R._fireAndBubble(K, { evt: x }) : this._fire(K, {
        evt: x,
        target: this,
        currentTarget: this
      });
    }
    _pointercancel(x) {
      this.setPointersPositions(x);
      const R = l.getCapturedShape(x.pointerId) || this.getIntersection(this.getPointerPosition());
      R && R._fireAndBubble(b, l.createEvent(x)), l.releaseCapture(x.pointerId);
    }
    _lostpointercapture(x) {
      l.releaseCapture(x.pointerId);
    }
    setPointersPositions(x) {
      const R = this._getContentPosition();
      let D = null, et = null;
      x = x || window.event, x.touches !== void 0 ? (this._pointerPositions = [], this._changedPointerPositions = [], Array.prototype.forEach.call(x.touches, (Q) => {
        this._pointerPositions.push({
          id: Q.identifier,
          x: (Q.clientX - R.left) / R.scaleX,
          y: (Q.clientY - R.top) / R.scaleY
        });
      }), Array.prototype.forEach.call(x.changedTouches || x.touches, (Q) => {
        this._changedPointerPositions.push({
          id: Q.identifier,
          x: (Q.clientX - R.left) / R.scaleX,
          y: (Q.clientY - R.top) / R.scaleY
        });
      })) : (D = (x.clientX - R.left) / R.scaleX, et = (x.clientY - R.top) / R.scaleY, this.pointerPos = {
        x: D,
        y: et
      }, this._pointerPositions = [{ x: D, y: et, id: t.Util._getFirstPointerId(x) }], this._changedPointerPositions = [
        { x: D, y: et, id: t.Util._getFirstPointerId(x) }
      ]);
    }
    _setPointerPosition(x) {
      t.Util.warn('Method _setPointerPosition is deprecated. Use "stage.setPointersPositions(event)" instead.'), this.setPointersPositions(x);
    }
    _getContentPosition() {
      if (!this.content || !this.content.getBoundingClientRect)
        return {
          top: 0,
          left: 0,
          scaleX: 1,
          scaleY: 1
        };
      const x = this.content.getBoundingClientRect();
      return {
        top: x.top,
        left: x.left,
        scaleX: x.width / this.content.clientWidth || 1,
        scaleY: x.height / this.content.clientHeight || 1
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
      const x = this.container();
      if (!x)
        throw "Stage has no container. A container is required.";
      x.innerHTML = "", this.content = document.createElement("div"), this.content.style.position = "relative", this.content.style.userSelect = "none", this.content.className = "konvajs-content", this.content.setAttribute("role", "presentation"), x.appendChild(this.content), this._resizeDOM();
    }
    cache() {
      return t.Util.warn("Cache function is not allowed for stage. You may use cache only for layers, groups and shapes."), this;
    }
    clearCache() {
      return this;
    }
    batchDraw() {
      return this.getChildren().forEach(function(x) {
        x.batchDraw();
      }), this;
    }
  }
  a.Stage = At, At.prototype.nodeType = h, (0, o._registerNode)(At), e.Factory.addGetterSetter(At, "container"), n.Konva.isBrowser && document.addEventListener("visibilitychange", () => {
    a.stages.forEach((mt) => {
      mt.batchDraw();
    });
  });
})(ea);
var He = {}, gt = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Shape = a.shapes = void 0;
  const t = U, e = rt, i = B, n = it, r = N, s = U, o = Bt, l = "hasShadow", h = "shadowRGBA", u = "patternImage", p = "linearGradient", g = "radialGradient";
  let _;
  function c() {
    return _ || (_ = e.Util.createCanvasElement().getContext("2d"), _);
  }
  a.shapes = {};
  function m(E) {
    const k = this.attrs.fillRule;
    k ? E.fill(k) : E.fill();
  }
  function y(E) {
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
  function f() {
    this._clearCache(h);
  }
  function b() {
    this._clearCache(u);
  }
  function C() {
    this._clearCache(p);
  }
  function P() {
    this._clearCache(g);
  }
  class v extends n.Node {
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
      return this._getCache(p, this.__getLinearGradient);
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
      return this._getCache(g, this.__getRadialGradient);
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
      return n.Node.prototype.destroy.call(this), delete a.shapes[this.colorKey], delete this.colorKey, this;
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
      const A = k.skipTransform, F = k.relativeTo || M && this.getStage() || void 0, $ = this.getSelfRect(), K = !k.skipStroke && this.hasStroke() && this.strokeWidth() || 0, L = $.width + K, j = $.height + K, G = !k.skipShadow && this.hasShadow(), O = G ? this.shadowOffsetX() : 0, W = G ? this.shadowOffsetY() : 0, nt = L + Math.abs(O), oe = j + Math.abs(W), At = G && this.shadowBlur() || 0, mt = nt + At * 2, x = oe + At * 2, R = {
        width: mt,
        height: x,
        x: -(K / 2 + At) + Math.min(O, 0) + $.x,
        y: -(K / 2 + At) + Math.min(W, 0) + $.y
      };
      return A ? R : this._transformedRect(R, F);
    }
    drawScene(k, M, T) {
      const A = this.getLayer(), F = k || A.getCanvas(), $ = F.getContext(), q = this._getCanvasCache(), K = this.getSceneFunc(), L = this.hasShadow();
      let j;
      const G = M === this;
      if (!this.isVisible() && !G)
        return this;
      if (q) {
        $.save();
        const O = this.getAbsoluteTransform(M).getMatrix();
        return $.transform(O[0], O[1], O[2], O[3], O[4], O[5]), this._drawCachedSceneCanvas($), $.restore(), this;
      }
      if (!K)
        return this;
      if ($.save(), this._useBufferCanvas()) {
        j = this.getStage();
        const O = T || j.bufferCanvas, W = O.getContext();
        W.clear(), W.save(), W._applyLineJoin(this);
        const nt = this.getAbsoluteTransform(M).getMatrix();
        W.transform(nt[0], nt[1], nt[2], nt[3], nt[4], nt[5]), K.call(this, W, this), W.restore();
        const oe = O.pixelRatio;
        L && $._applyShadow(this), $._applyOpacity(this), $._applyGlobalCompositeOperation(this), $.drawImage(O._canvas, O.x || 0, O.y || 0, O.width / oe, O.height / oe);
      } else {
        if ($._applyLineJoin(this), !G) {
          const O = this.getAbsoluteTransform(M).getMatrix();
          $.transform(O[0], O[1], O[2], O[3], O[4], O[5]), $._applyOpacity(this), $._applyGlobalCompositeOperation(this);
        }
        L && $._applyShadow(this), K.call(this, $, this);
      }
      return $.restore(), this;
    }
    drawHit(k, M, T = !1) {
      if (!this.shouldDrawHit(M, T))
        return this;
      const A = this.getLayer(), F = k || A.hitCanvas, $ = F && F.getContext(), q = this.hitFunc() || this.sceneFunc(), K = this._getCanvasCache(), L = K && K.hit;
      if (this.colorKey || e.Util.warn("Looks like your canvas has a destroyed shape in it. Do not reuse shape after you destroyed it. If you want to reuse shape you should call remove() instead of destroy()"), L) {
        $.save();
        const G = this.getAbsoluteTransform(M).getMatrix();
        return $.transform(G[0], G[1], G[2], G[3], G[4], G[5]), this._drawCachedHitCanvas($), $.restore(), this;
      }
      if (!q)
        return this;
      if ($.save(), $._applyLineJoin(this), !(this === M)) {
        const G = this.getAbsoluteTransform(M).getMatrix();
        $.transform(G[0], G[1], G[2], G[3], G[4], G[5]);
      }
      return q.call(this, $, this), $.restore(), this;
    }
    drawHitFromCache(k = 0) {
      const M = this._getCanvasCache(), T = this._getCachedSceneCanvas(), A = M.hit, F = A.getContext(), $ = A.getWidth(), q = A.getHeight();
      F.clear(), F.drawImage(T._canvas, 0, 0, $, q);
      try {
        const K = F.getImageData(0, 0, $, q), L = K.data, j = L.length, G = e.Util._hexToRgb(this.colorKey);
        for (let O = 0; O < j; O += 4)
          L[O + 3] > k ? (L[O] = G.r, L[O + 1] = G.g, L[O + 2] = G.b, L[O + 3] = 255) : L[O + 3] = 0;
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
  a.Shape = v, v.prototype._fillFunc = m, v.prototype._strokeFunc = y, v.prototype._fillFuncHit = S, v.prototype._strokeFuncHit = w, v.prototype._centroid = !1, v.prototype.nodeType = "Shape", (0, s._registerNode)(v), v.prototype.eventListeners = {}, v.prototype.on.call(v.prototype, "shadowColorChange.konva shadowBlurChange.konva shadowOffsetChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", d), v.prototype.on.call(v.prototype, "shadowColorChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", f), v.prototype.on.call(v.prototype, "fillPriorityChange.konva fillPatternImageChange.konva fillPatternRepeatChange.konva fillPatternScaleXChange.konva fillPatternScaleYChange.konva fillPatternOffsetXChange.konva fillPatternOffsetYChange.konva fillPatternXChange.konva fillPatternYChange.konva fillPatternRotationChange.konva", b), v.prototype.on.call(v.prototype, "fillPriorityChange.konva fillLinearGradientColorStopsChange.konva fillLinearGradientStartPointXChange.konva fillLinearGradientStartPointYChange.konva fillLinearGradientEndPointXChange.konva fillLinearGradientEndPointYChange.konva", C), v.prototype.on.call(v.prototype, "fillPriorityChange.konva fillRadialGradientColorStopsChange.konva fillRadialGradientStartPointXChange.konva fillRadialGradientStartPointYChange.konva fillRadialGradientEndPointXChange.konva fillRadialGradientEndPointYChange.konva fillRadialGradientStartRadiusChange.konva fillRadialGradientEndRadiusChange.konva", P), i.Factory.addGetterSetter(v, "stroke", void 0, (0, r.getStringOrGradientValidator)()), i.Factory.addGetterSetter(v, "strokeWidth", 2, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillAfterStrokeEnabled", !1), i.Factory.addGetterSetter(v, "hitStrokeWidth", "auto", (0, r.getNumberOrAutoValidator)()), i.Factory.addGetterSetter(v, "strokeHitEnabled", !0, (0, r.getBooleanValidator)()), i.Factory.addGetterSetter(v, "perfectDrawEnabled", !0, (0, r.getBooleanValidator)()), i.Factory.addGetterSetter(v, "shadowForStrokeEnabled", !0, (0, r.getBooleanValidator)()), i.Factory.addGetterSetter(v, "lineJoin"), i.Factory.addGetterSetter(v, "lineCap"), i.Factory.addGetterSetter(v, "sceneFunc"), i.Factory.addGetterSetter(v, "hitFunc"), i.Factory.addGetterSetter(v, "dash"), i.Factory.addGetterSetter(v, "dashOffset", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "shadowColor", void 0, (0, r.getStringValidator)()), i.Factory.addGetterSetter(v, "shadowBlur", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "shadowOpacity", 1, (0, r.getNumberValidator)()), i.Factory.addComponentsGetterSetter(v, "shadowOffset", ["x", "y"]), i.Factory.addGetterSetter(v, "shadowOffsetX", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "shadowOffsetY", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternImage"), i.Factory.addGetterSetter(v, "fill", void 0, (0, r.getStringOrGradientValidator)()), i.Factory.addGetterSetter(v, "fillPatternX", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternY", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillLinearGradientColorStops"), i.Factory.addGetterSetter(v, "strokeLinearGradientColorStops"), i.Factory.addGetterSetter(v, "fillRadialGradientStartRadius", 0), i.Factory.addGetterSetter(v, "fillRadialGradientEndRadius", 0), i.Factory.addGetterSetter(v, "fillRadialGradientColorStops"), i.Factory.addGetterSetter(v, "fillPatternRepeat", "repeat"), i.Factory.addGetterSetter(v, "fillEnabled", !0), i.Factory.addGetterSetter(v, "strokeEnabled", !0), i.Factory.addGetterSetter(v, "shadowEnabled", !0), i.Factory.addGetterSetter(v, "dashEnabled", !0), i.Factory.addGetterSetter(v, "strokeScaleEnabled", !0), i.Factory.addGetterSetter(v, "fillPriority", "color"), i.Factory.addComponentsGetterSetter(v, "fillPatternOffset", ["x", "y"]), i.Factory.addGetterSetter(v, "fillPatternOffsetX", 0, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternOffsetY", 0, (0, r.getNumberValidator)()), i.Factory.addComponentsGetterSetter(v, "fillPatternScale", ["x", "y"]), i.Factory.addGetterSetter(v, "fillPatternScaleX", 1, (0, r.getNumberValidator)()), i.Factory.addGetterSetter(v, "fillPatternScaleY", 1, (0, r.getNumberValidator)()), i.Factory.addComponentsGetterSetter(v, "fillLinearGradientStartPoint", [
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
const Et = rt, on = Zt, ce = it, On = B, pr = St, io = N, no = gt, ro = U, ao = "#", so = "beforeDraw", oo = "draw", ra = [
  { x: 0, y: 0 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 }
], lo = ra.length;
class xe extends on.Container {
  constructor(t) {
    super(t), this.canvas = new pr.SceneCanvas(), this.hitCanvas = new pr.HitCanvas({
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
      for (let n = 0; n < lo; n++) {
        const r = ra[n], s = this._getIntersection({
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
      const r = Et.Util._rgbToHex(i[0], i[1], i[2]), s = no.shapes[ao + r];
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
    return this._fire(so, {
      node: this
    }), this.clearBeforeDraw() && r.getContext().clear(), on.Container.prototype.drawScene.call(this, r, e, i), this._fire(oo, {
      node: this
    }), this;
  }
  drawHit(t, e) {
    const i = this.getLayer(), n = t || i && i.hitCanvas;
    return i && i.clearBeforeDraw() && i.getHitCanvas().getContext().clear(), on.Container.prototype.drawHit.call(this, n, e), this;
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
(0, ro._registerNode)(xe);
On.Factory.addGetterSetter(xe, "imageSmoothingEnabled", !0);
On.Factory.addGetterSetter(xe, "clearBeforeDraw", !0);
On.Factory.addGetterSetter(xe, "hitGraphEnabled", !0, (0, io.getBooleanValidator)());
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
gi.FastLayer = void 0;
const ho = rt, co = He, uo = U;
class Dn extends co.Layer {
  constructor(t) {
    super(t), this.listening(!1), ho.Util.warn('Konva.Fast layer is deprecated. Please use "new Konva.Layer({ listening: false })" instead.');
  }
}
gi.FastLayer = Dn;
Dn.prototype.nodeType = "FastLayer";
(0, uo._registerNode)(Dn);
var ke = {};
Object.defineProperty(ke, "__esModule", { value: !0 });
ke.Group = void 0;
const fo = rt, go = Zt, po = U;
class Ln extends go.Container {
  _validateAdd(t) {
    const e = t.getType();
    e !== "Group" && e !== "Shape" && fo.Util.throw("You may only add groups and shapes to groups.");
  }
}
ke.Group = Ln;
Ln.prototype.nodeType = "Group";
(0, po._registerNode)(Ln);
var Ae = {};
Object.defineProperty(Ae, "__esModule", { value: !0 });
Ae.Animation = void 0;
const ln = U, _r = rt, hn = function() {
  return ln.glob.performance && ln.glob.performance.now ? function() {
    return ln.glob.performance.now();
  } : function() {
    return (/* @__PURE__ */ new Date()).getTime();
  };
}();
class Ct {
  constructor(t, e) {
    this.id = Ct.animIdCounter++, this.frame = {
      time: 0,
      timeDiff: 0,
      lastTime: hn(),
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
    const e = Ct.animations, i = e.length;
    for (let n = 0; n < i; n++)
      if (e[n].id === this.id)
        return !0;
    return !1;
  }
  start() {
    return this.stop(), this.frame.timeDiff = 0, this.frame.lastTime = hn(), Ct._addAnimation(this), this;
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
      n._updateFrameObject(hn());
      const o = r.length;
      let l;
      if (s ? l = s.call(n, n.frame) !== !1 : l = !0, !!l)
        for (let h = 0; h < o; h++) {
          const u = r[h];
          u._id !== void 0 && (t[u._id] = u);
        }
    }
    for (const i in t)
      t.hasOwnProperty(i) && t[i].batchDraw();
  }
  static _animationLoop() {
    const t = Ct;
    t.animations.length ? (t._runFrames(), _r.Util.requestAnimFrame(t._animationLoop)) : t.animRunning = !1;
  }
  static _handleAnimation() {
    this.animRunning || (this.animRunning = !0, _r.Util.requestAnimFrame(this._animationLoop));
  }
}
Ae.Animation = Ct;
Ct.animations = [];
Ct.animIdCounter = 0;
Ct.animRunning = !1;
var aa = {};
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Easings = a.Tween = void 0;
  const t = rt, e = Ae, i = it, n = U, r = {
    node: 1,
    duration: 1,
    easing: 1,
    onFinish: 1,
    yoyo: 1
  }, s = 1, o = 2, l = 3, h = ["fill", "stroke", "shadowColor"];
  let u = 0;
  class p {
    constructor(c, m, y, S, w, d, f) {
      this.prop = c, this.propFunc = m, this.begin = S, this._pos = S, this.duration = d, this._change = 0, this.prevPos = 0, this.yoyo = f, this._time = 0, this._position = 0, this._startTime = 0, this._finish = 0, this.func = y, this._change = w - this.begin, this.pause();
    }
    fire(c) {
      const m = this[c];
      m && m();
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
  class g {
    constructor(c) {
      const m = this, y = c.node, S = y._id, w = c.easing || a.Easings.Linear, d = !!c.yoyo;
      let f, b;
      typeof c.duration > "u" ? f = 0.3 : c.duration === 0 ? f = 1e-3 : f = c.duration, this.node = y, this._id = u++;
      const C = y.getLayer() || (y instanceof n.Konva.Stage ? y.getLayers() : null);
      C || t.Util.error("Tween constructor have `node` that is not in a layer. Please add node into layer first."), this.anim = new e.Animation(function() {
        m.tween.onEnterFrame();
      }, C), this.tween = new p(b, function(P) {
        m._tweenFunc(P);
      }, w, 0, 1, f * 1e3, d), this._addListeners(), g.attrs[S] || (g.attrs[S] = {}), g.attrs[S][this._id] || (g.attrs[S][this._id] = {}), g.tweens[S] || (g.tweens[S] = {});
      for (b in c)
        r[b] === void 0 && this._addAttr(b, c[b]);
      this.reset(), this.onFinish = c.onFinish, this.onReset = c.onReset, this.onUpdate = c.onUpdate;
    }
    _addAttr(c, m) {
      const y = this.node, S = y._id;
      let w, d, f, b, C;
      const P = g.tweens[S][c];
      P && delete g.attrs[S][P][c];
      let v = y.getAttr(c);
      if (t.Util._isArray(m))
        if (w = [], d = Math.max(m.length, v.length), c === "points" && m.length !== v.length && (m.length > v.length ? (b = v, v = t.Util._prepareArrayForTween(v, m, y.closed())) : (f = m, m = t.Util._prepareArrayForTween(m, v, y.closed()))), c.indexOf("fill") === 0)
          for (let E = 0; E < d; E++)
            if (E % 2 === 0)
              w.push(m[E] - v[E]);
            else {
              const k = t.Util.colorToRGBA(v[E]);
              C = t.Util.colorToRGBA(m[E]), v[E] = k, w.push({
                r: C.r - k.r,
                g: C.g - k.g,
                b: C.b - k.b,
                a: C.a - k.a
              });
            }
        else
          for (let E = 0; E < d; E++)
            w.push(m[E] - v[E]);
      else h.indexOf(c) !== -1 ? (v = t.Util.colorToRGBA(v), C = t.Util.colorToRGBA(m), w = {
        r: C.r - v.r,
        g: C.g - v.g,
        b: C.b - v.b,
        a: C.a - v.a
      }) : w = m - v;
      g.attrs[S][this._id][c] = {
        start: v,
        diff: w,
        end: m,
        trueEnd: f,
        trueStart: b
      }, g.tweens[S][c] = this._id;
    }
    _tweenFunc(c) {
      const m = this.node, y = g.attrs[m._id][this._id];
      let S, w, d, f, b, C, P, v;
      for (S in y) {
        if (w = y[S], d = w.start, f = w.diff, v = w.end, t.Util._isArray(d))
          if (b = [], P = Math.max(d.length, v.length), S.indexOf("fill") === 0)
            for (C = 0; C < P; C++)
              C % 2 === 0 ? b.push((d[C] || 0) + f[C] * c) : b.push("rgba(" + Math.round(d[C].r + f[C].r * c) + "," + Math.round(d[C].g + f[C].g * c) + "," + Math.round(d[C].b + f[C].b * c) + "," + (d[C].a + f[C].a * c) + ")");
          else
            for (C = 0; C < P; C++)
              b.push((d[C] || 0) + f[C] * c);
        else h.indexOf(S) !== -1 ? b = "rgba(" + Math.round(d.r + f.r * c) + "," + Math.round(d.g + f.g * c) + "," + Math.round(d.b + f.b * c) + "," + (d.a + f.a * c) + ")" : b = d + f * c;
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
        const c = this.node, m = g.attrs[c._id][this._id];
        m.points && m.points.trueEnd && c.setAttr("points", m.points.trueEnd), this.onFinish && this.onFinish.call(this);
      }, this.tween.onReset = () => {
        const c = this.node, m = g.attrs[c._id][this._id];
        m.points && m.points.trueStart && c.points(m.points.trueStart), this.onReset && this.onReset();
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
      const c = this.node._id, m = this._id, y = g.tweens[c];
      this.pause(), this.anim && this.anim.stop();
      for (const S in y)
        delete g.tweens[c][S];
      delete g.attrs[c][m], g.tweens[c] && (Object.keys(g.tweens[c]).length === 0 && delete g.tweens[c], Object.keys(g.attrs[c]).length === 0 && delete g.attrs[c]);
    }
  }
  a.Tween = g, g.attrs = {}, g.tweens = {}, i.Node.prototype.to = function(_) {
    const c = _.onFinish;
    _.node = this, _.onFinish = function() {
      this.destroy(), c && c();
    }, new g(_).play();
  }, a.Easings = {
    BackEaseIn(_, c, m, y) {
      return m * (_ /= y) * _ * ((1.70158 + 1) * _ - 1.70158) + c;
    },
    BackEaseOut(_, c, m, y) {
      return m * ((_ = _ / y - 1) * _ * ((1.70158 + 1) * _ + 1.70158) + 1) + c;
    },
    BackEaseInOut(_, c, m, y) {
      let S = 1.70158;
      return (_ /= y / 2) < 1 ? m / 2 * (_ * _ * (((S *= 1.525) + 1) * _ - S)) + c : m / 2 * ((_ -= 2) * _ * (((S *= 1.525) + 1) * _ + S) + 2) + c;
    },
    ElasticEaseIn(_, c, m, y, S, w) {
      let d = 0;
      return _ === 0 ? c : (_ /= y) === 1 ? c + m : (w || (w = y * 0.3), !S || S < Math.abs(m) ? (S = m, d = w / 4) : d = w / (2 * Math.PI) * Math.asin(m / S), -(S * Math.pow(2, 10 * (_ -= 1)) * Math.sin((_ * y - d) * (2 * Math.PI) / w)) + c);
    },
    ElasticEaseOut(_, c, m, y, S, w) {
      let d = 0;
      return _ === 0 ? c : (_ /= y) === 1 ? c + m : (w || (w = y * 0.3), !S || S < Math.abs(m) ? (S = m, d = w / 4) : d = w / (2 * Math.PI) * Math.asin(m / S), S * Math.pow(2, -10 * _) * Math.sin((_ * y - d) * (2 * Math.PI) / w) + m + c);
    },
    ElasticEaseInOut(_, c, m, y, S, w) {
      let d = 0;
      return _ === 0 ? c : (_ /= y / 2) === 2 ? c + m : (w || (w = y * (0.3 * 1.5)), !S || S < Math.abs(m) ? (S = m, d = w / 4) : d = w / (2 * Math.PI) * Math.asin(m / S), _ < 1 ? -0.5 * (S * Math.pow(2, 10 * (_ -= 1)) * Math.sin((_ * y - d) * (2 * Math.PI) / w)) + c : S * Math.pow(2, -10 * (_ -= 1)) * Math.sin((_ * y - d) * (2 * Math.PI) / w) * 0.5 + m + c);
    },
    BounceEaseOut(_, c, m, y) {
      return (_ /= y) < 1 / 2.75 ? m * (7.5625 * _ * _) + c : _ < 2 / 2.75 ? m * (7.5625 * (_ -= 1.5 / 2.75) * _ + 0.75) + c : _ < 2.5 / 2.75 ? m * (7.5625 * (_ -= 2.25 / 2.75) * _ + 0.9375) + c : m * (7.5625 * (_ -= 2.625 / 2.75) * _ + 0.984375) + c;
    },
    BounceEaseIn(_, c, m, y) {
      return m - a.Easings.BounceEaseOut(y - _, 0, m, y) + c;
    },
    BounceEaseInOut(_, c, m, y) {
      return _ < y / 2 ? a.Easings.BounceEaseIn(_ * 2, 0, m, y) * 0.5 + c : a.Easings.BounceEaseOut(_ * 2 - y, 0, m, y) * 0.5 + m * 0.5 + c;
    },
    EaseIn(_, c, m, y) {
      return m * (_ /= y) * _ + c;
    },
    EaseOut(_, c, m, y) {
      return -m * (_ /= y) * (_ - 2) + c;
    },
    EaseInOut(_, c, m, y) {
      return (_ /= y / 2) < 1 ? m / 2 * _ * _ + c : -m / 2 * (--_ * (_ - 2) - 1) + c;
    },
    StrongEaseIn(_, c, m, y) {
      return m * (_ /= y) * _ * _ * _ * _ + c;
    },
    StrongEaseOut(_, c, m, y) {
      return m * ((_ = _ / y - 1) * _ * _ * _ * _ + 1) + c;
    },
    StrongEaseInOut(_, c, m, y) {
      return (_ /= y / 2) < 1 ? m / 2 * _ * _ * _ * _ * _ + c : m / 2 * ((_ -= 2) * _ * _ * _ * _ + 2) + c;
    },
    Linear(_, c, m, y) {
      return m * _ / y + c;
    }
  };
})(aa);
(function(a) {
  Object.defineProperty(a, "__esModule", { value: !0 }), a.Konva = void 0;
  const t = U, e = rt, i = it, n = Zt, r = ea, s = He, o = gi, l = ke, h = ui, u = gt, p = Ae, g = aa, _ = Tt, c = St;
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
    DD: h.DD,
    Shape: u.Shape,
    shapes: u.shapes,
    Animation: p.Animation,
    Tween: g.Tween,
    Easings: g.Easings,
    Context: _.Context,
    Canvas: c.Canvas
  }), a.default = a.Konva;
})(Qr);
var pi = {};
Object.defineProperty(pi, "__esModule", { value: !0 });
pi.Arc = void 0;
const _i = B, _o = gt, mr = U, mi = N, mo = U;
class Ft extends _o.Shape {
  _sceneFunc(t) {
    const e = mr.Konva.getAngle(this.angle()), i = this.clockwise();
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
    const t = this.innerRadius(), e = this.outerRadius(), i = this.clockwise(), n = mr.Konva.getAngle(i ? 360 - this.angle() : this.angle()), r = Math.cos(Math.min(n, Math.PI)), s = 1, o = Math.sin(Math.min(Math.max(Math.PI, n), 3 * Math.PI / 2)), l = Math.sin(Math.min(n, Math.PI / 2)), h = r * (r > 0 ? t : e), u = s * e, p = o * (o > 0 ? t : e), g = l * (l > 0 ? e : t);
    return {
      x: h,
      y: i ? -1 * g : p,
      width: u - h,
      height: g - p
    };
  }
}
pi.Arc = Ft;
Ft.prototype._centroid = !0;
Ft.prototype.className = "Arc";
Ft.prototype._attrsAffectingSize = [
  "innerRadius",
  "outerRadius",
  "angle",
  "clockwise"
];
(0, mo._registerNode)(Ft);
_i.Factory.addGetterSetter(Ft, "innerRadius", 0, (0, mi.getNumberValidator)());
_i.Factory.addGetterSetter(Ft, "outerRadius", 0, (0, mi.getNumberValidator)());
_i.Factory.addGetterSetter(Ft, "angle", 0, (0, mi.getNumberValidator)());
_i.Factory.addGetterSetter(Ft, "clockwise", !1, (0, mi.getBooleanValidator)());
var yi = {}, ze = {};
Object.defineProperty(ze, "__esModule", { value: !0 });
ze.Line = void 0;
const bi = B, yo = U, bo = gt, sa = N;
function bn(a, t, e, i, n, r, s) {
  const o = Math.sqrt(Math.pow(e - a, 2) + Math.pow(i - t, 2)), l = Math.sqrt(Math.pow(n - e, 2) + Math.pow(r - i, 2)), h = s * o / (o + l), u = s * l / (o + l), p = e - h * (n - a), g = i - h * (r - t), _ = e + u * (n - a), c = i + u * (r - t);
  return [p, g, _, c];
}
function yr(a, t) {
  const e = a.length, i = [];
  for (let n = 2; n < e - 2; n += 2) {
    const r = bn(a[n - 2], a[n - 1], a[n], a[n + 1], a[n + 2], a[n + 3], t);
    isNaN(r[0]) || (i.push(r[0]), i.push(r[1]), i.push(a[n]), i.push(a[n + 1]), i.push(r[2]), i.push(r[3]));
  }
  return i;
}
class Vt extends bo.Shape {
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
      const l = this.getTensionPoints(), h = l.length;
      for (o = r ? 0 : 4, r || t.quadraticCurveTo(l[0], l[1], l[2], l[3]); o < h - 2; )
        t.bezierCurveTo(l[o++], l[o++], l[o++], l[o++], l[o++], l[o++]);
      r || t.quadraticCurveTo(l[h - 2], l[h - 1], e[i - 2], e[i - 1]);
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
    return this.closed() ? this._getTensionPointsClosed() : yr(this.points(), this.tension());
  }
  _getTensionPointsClosed() {
    const t = this.points(), e = t.length, i = this.tension(), n = bn(t[e - 2], t[e - 1], t[0], t[1], t[2], t[3], i), r = bn(t[e - 4], t[e - 3], t[e - 2], t[e - 1], t[0], t[1], i), s = yr(t, i);
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
ze.Line = Vt;
Vt.prototype.className = "Line";
Vt.prototype._attrsAffectingSize = ["points", "bezier", "tension"];
(0, yo._registerNode)(Vt);
bi.Factory.addGetterSetter(Vt, "closed", !1);
bi.Factory.addGetterSetter(Vt, "bezier", !1);
bi.Factory.addGetterSetter(Vt, "tension", 0, (0, sa.getNumberValidator)());
bi.Factory.addGetterSetter(Vt, "points", [], (0, sa.getNumberArrayValidator)());
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
    const g = l / 2;
    h = 0;
    for (let _ = 0; _ < 20; _++)
      u = g * a.tValues[20][_] + g, h += a.cValues[20][_] * i(s, o, u);
    return g * h;
  };
  a.getCubicArcLength = t;
  const e = (s, o, l) => {
    l === void 0 && (l = 1);
    const h = s[0] - 2 * s[1] + s[2], u = o[0] - 2 * o[1] + o[2], p = 2 * s[1] - 2 * s[0], g = 2 * o[1] - 2 * o[0], _ = 4 * (h * h + u * u), c = 4 * (h * p + u * g), m = p * p + g * g;
    if (_ === 0)
      return l * Math.sqrt(Math.pow(s[2] - s[0], 2) + Math.pow(o[2] - o[0], 2));
    const y = c / (2 * _), S = m / _, w = l + y, d = S - y * y, f = w * w + d > 0 ? Math.sqrt(w * w + d) : 0, b = y * y + d > 0 ? Math.sqrt(y * y + d) : 0, C = y + Math.sqrt(y * y + d) !== 0 ? d * Math.log(Math.abs((w + f) / (y + b))) : 0;
    return Math.sqrt(_) / 2 * (w * f - y * b + C);
  };
  a.getQuadraticArcLength = e;
  function i(s, o, l) {
    const h = n(1, l, s), u = n(1, l, o), p = h * h + u * u;
    return Math.sqrt(p);
  }
  const n = (s, o, l) => {
    const h = l.length - 1;
    let u, p;
    if (h === 0)
      return 0;
    if (s === 0) {
      p = 0;
      for (let g = 0; g <= h; g++)
        p += a.binomialCoefficients[h][g] * Math.pow(1 - o, h - g) * Math.pow(o, g) * l[g];
      return p;
    } else {
      u = new Array(h);
      for (let g = 0; g < h; g++)
        u[g] = h * (l[g + 1] - l[g]);
      return n(s - 1, o, u);
    }
  }, r = (s, o, l) => {
    let h = 1, u = s / o, p = (s - l(u)) / o, g = 0;
    for (; h > 1e-3; ) {
      const _ = l(u + p), c = Math.abs(s - _) / o;
      if (c < h)
        h = c, u += p;
      else {
        const m = l(u - p), y = Math.abs(s - m) / o;
        y < h ? (h = y, u -= p) : p /= 2;
      }
      if (g++, g > 500)
        break;
    }
    return u;
  };
  a.t2length = r;
})(oa);
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.Path = void 0;
const vo = B, So = U, wo = gt, ue = oa;
class ft extends wo.Shape {
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
          const o = s[0], l = s[1], h = s[2], u = s[3], p = s[4], g = s[5], _ = s[6], c = s[7], m = h > u ? h : u, y = h > u ? 1 : h / u, S = h > u ? u / h : 1;
          t.translate(o, l), t.rotate(_), t.scale(y, S), t.arc(0, 0, m, p, p + g, 1 - c), t.scale(1 / y, 1 / S), t.rotate(-_), t.translate(-o, -l);
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
        const h = l.points[4], u = l.points[5], p = l.points[4] + u;
        let g = Math.PI / 180;
        if (Math.abs(h - p) < g && (g = Math.abs(h - p)), u < 0)
          for (let _ = h - g; _ > p; _ -= g) {
            const c = ft.getPointOnEllipticalArc(l.points[0], l.points[1], l.points[2], l.points[3], _, 0);
            t.push(c.x, c.y);
          }
        else
          for (let _ = h + g; _ < p; _ += g) {
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
    const s = e[n], o = s.points;
    switch (s.command) {
      case "L":
        return ft.getPointOnLine(t, s.start.x, s.start.y, o[0], o[1]);
      case "C":
        return ft.getPointOnCubicBezier((0, ue.t2length)(t, ft.getPathLength(e), (m) => (0, ue.getCubicArcLength)([s.start.x, o[0], o[2], o[4]], [s.start.y, o[1], o[3], o[5]], m)), s.start.x, s.start.y, o[0], o[1], o[2], o[3], o[4], o[5]);
      case "Q":
        return ft.getPointOnQuadraticBezier((0, ue.t2length)(t, ft.getPathLength(e), (m) => (0, ue.getQuadraticArcLength)([s.start.x, o[0], o[2]], [s.start.y, o[1], o[3]], m)), s.start.x, s.start.y, o[0], o[1], o[2], o[3]);
      case "A":
        const l = o[0], h = o[1], u = o[2], p = o[3], g = o[5], _ = o[6];
        let c = o[4];
        return c += g * t / s.pathLength, ft.getPointOnEllipticalArc(l, h, u, p, c, _);
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
    const h = (r - i) / (n - e), u = Math.sqrt(t * t / (1 + h * h)) * (n < e ? -1 : 1), p = h * u;
    if (Math.abs(o - i - h * (s - e)) < 1e-10)
      return { x: s + u, y: o + p };
    const g = ((s - e) * (n - e) + (o - i) * (r - i)) / (l * l), _ = e + g * (n - e), c = i + g * (r - i), m = this.getLineLength(s, o, _, c), y = Math.sqrt(t * t - m * m), S = Math.sqrt(y * y / (1 + h * h)) * (n < e ? -1 : 1), w = h * S;
    return { x: _ + S, y: c + w };
  }
  static getPointOnCubicBezier(t, e, i, n, r, s, o, l, h) {
    function u(y) {
      return y * y * y;
    }
    function p(y) {
      return 3 * y * y * (1 - y);
    }
    function g(y) {
      return 3 * y * (1 - y) * (1 - y);
    }
    function _(y) {
      return (1 - y) * (1 - y) * (1 - y);
    }
    const c = l * u(t) + s * p(t) + n * g(t) + e * _(t), m = h * u(t) + o * p(t) + r * g(t) + i * _(t);
    return { x: c, y: m };
  }
  static getPointOnQuadraticBezier(t, e, i, n, r, s, o) {
    function l(_) {
      return _ * _;
    }
    function h(_) {
      return 2 * _ * (1 - _);
    }
    function u(_) {
      return (1 - _) * (1 - _);
    }
    const p = s * l(t) + n * h(t) + e * u(t), g = o * l(t) + r * h(t) + i * u(t);
    return { x: p, y: g };
  }
  static getPointOnEllipticalArc(t, e, i, n, r, s) {
    const o = Math.cos(s), l = Math.sin(s), h = {
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
    for (let p = 0; p < i.length; p++)
      e = e.replace(new RegExp(i[p], "g"), "|" + i[p]);
    const n = e.split("|"), r = [], s = [];
    let o = 0, l = 0;
    const h = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
    let u;
    for (let p = 1; p < n.length; p++) {
      let g = n[p], _ = g.charAt(0);
      for (g = g.slice(1), s.length = 0; u = h.exec(g); )
        s.push(u[0]);
      const c = [];
      for (let m = 0, y = s.length; m < y; m++) {
        if (s[m] === "00") {
          c.push(0, 0);
          continue;
        }
        const S = parseFloat(s[m]);
        isNaN(S) ? c.push(0) : c.push(S);
      }
      for (; c.length > 0 && !isNaN(c[0]); ) {
        let m = "", y = [];
        const S = o, w = l;
        let d, f, b, C, P, v, E, k, M, T;
        switch (_) {
          case "l":
            o += c.shift(), l += c.shift(), m = "L", y.push(o, l);
            break;
          case "L":
            o = c.shift(), l = c.shift(), y.push(o, l);
            break;
          case "m":
            const A = c.shift(), F = c.shift();
            if (o += A, l += F, m = "M", r.length > 2 && r[r.length - 1].command === "z") {
              for (let $ = r.length - 2; $ >= 0; $--)
                if (r[$].command === "M") {
                  o = r[$].points[0] + A, l = r[$].points[1] + F;
                  break;
                }
            }
            y.push(o, l), _ = "l";
            break;
          case "M":
            o = c.shift(), l = c.shift(), m = "M", y.push(o, l), _ = "L";
            break;
          case "h":
            o += c.shift(), m = "L", y.push(o, l);
            break;
          case "H":
            o = c.shift(), m = "L", y.push(o, l);
            break;
          case "v":
            l += c.shift(), m = "L", y.push(o, l);
            break;
          case "V":
            l = c.shift(), m = "L", y.push(o, l);
            break;
          case "C":
            y.push(c.shift(), c.shift(), c.shift(), c.shift()), o = c.shift(), l = c.shift(), y.push(o, l);
            break;
          case "c":
            y.push(o + c.shift(), l + c.shift(), o + c.shift(), l + c.shift()), o += c.shift(), l += c.shift(), m = "C", y.push(o, l);
            break;
          case "S":
            f = o, b = l, d = r[r.length - 1], d.command === "C" && (f = o + (o - d.points[2]), b = l + (l - d.points[3])), y.push(f, b, c.shift(), c.shift()), o = c.shift(), l = c.shift(), m = "C", y.push(o, l);
            break;
          case "s":
            f = o, b = l, d = r[r.length - 1], d.command === "C" && (f = o + (o - d.points[2]), b = l + (l - d.points[3])), y.push(f, b, o + c.shift(), l + c.shift()), o += c.shift(), l += c.shift(), m = "C", y.push(o, l);
            break;
          case "Q":
            y.push(c.shift(), c.shift()), o = c.shift(), l = c.shift(), y.push(o, l);
            break;
          case "q":
            y.push(o + c.shift(), l + c.shift()), o += c.shift(), l += c.shift(), m = "Q", y.push(o, l);
            break;
          case "T":
            f = o, b = l, d = r[r.length - 1], d.command === "Q" && (f = o + (o - d.points[0]), b = l + (l - d.points[1])), o = c.shift(), l = c.shift(), m = "Q", y.push(f, b, o, l);
            break;
          case "t":
            f = o, b = l, d = r[r.length - 1], d.command === "Q" && (f = o + (o - d.points[0]), b = l + (l - d.points[1])), o += c.shift(), l += c.shift(), m = "Q", y.push(f, b, o, l);
            break;
          case "A":
            C = c.shift(), P = c.shift(), v = c.shift(), E = c.shift(), k = c.shift(), M = o, T = l, o = c.shift(), l = c.shift(), m = "A", y = this.convertEndpointToCenterParameterization(M, T, o, l, E, k, C, P, v);
            break;
          case "a":
            C = c.shift(), P = c.shift(), v = c.shift(), E = c.shift(), k = c.shift(), M = o, T = l, o += c.shift(), l += c.shift(), m = "A", y = this.convertEndpointToCenterParameterization(M, T, o, l, E, k, C, P, v);
            break;
        }
        r.push({
          command: m || _,
          points: y,
          start: {
            x: S,
            y: w
          },
          pathLength: this.calcLength(S, w, m || _, y)
        });
      }
      (_ === "z" || _ === "Z") && r.push({
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
        const u = n[4], p = n[5], g = n[4] + p;
        let _ = Math.PI / 180;
        if (Math.abs(u - g) < _ && (_ = Math.abs(u - g)), s = h.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], u, 0), p < 0)
          for (l = u - _; l > g; l -= _)
            o = h.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], l, 0), r += h.getLineLength(s.x, s.y, o.x, o.y), s = o;
        else
          for (l = u + _; l < g; l += _)
            o = h.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], l, 0), r += h.getLineLength(s.x, s.y, o.x, o.y), s = o;
        return o = h.getPointOnEllipticalArc(n[0], n[1], n[2], n[3], g, 0), r += h.getLineLength(s.x, s.y, o.x, o.y), r;
    }
    return 0;
  }
  static convertEndpointToCenterParameterization(t, e, i, n, r, s, o, l, h) {
    const u = h * (Math.PI / 180), p = Math.cos(u) * (t - i) / 2 + Math.sin(u) * (e - n) / 2, g = -1 * Math.sin(u) * (t - i) / 2 + Math.cos(u) * (e - n) / 2, _ = p * p / (o * o) + g * g / (l * l);
    _ > 1 && (o *= Math.sqrt(_), l *= Math.sqrt(_));
    let c = Math.sqrt((o * o * (l * l) - o * o * (g * g) - l * l * (p * p)) / (o * o * (g * g) + l * l * (p * p)));
    r === s && (c *= -1), isNaN(c) && (c = 0);
    const m = c * o * g / l, y = c * -l * p / o, S = (t + i) / 2 + Math.cos(u) * m - Math.sin(u) * y, w = (e + n) / 2 + Math.sin(u) * m + Math.cos(u) * y, d = function(k) {
      return Math.sqrt(k[0] * k[0] + k[1] * k[1]);
    }, f = function(k, M) {
      return (k[0] * M[0] + k[1] * M[1]) / (d(k) * d(M));
    }, b = function(k, M) {
      return (k[0] * M[1] < k[1] * M[0] ? -1 : 1) * Math.acos(f(k, M));
    }, C = b([1, 0], [(p - m) / o, (g - y) / l]), P = [(p - m) / o, (g - y) / l], v = [(-1 * p - m) / o, (-1 * g - y) / l];
    let E = b(P, v);
    return f(P, v) <= -1 && (E = Math.PI), f(P, v) >= 1 && (E = 0), s === 0 && E > 0 && (E = E - 2 * Math.PI), s === 1 && E < 0 && (E = E + 2 * Math.PI), [S, w, o, l, C, E, u, s];
  }
}
Pe.Path = ft;
ft.prototype.className = "Path";
ft.prototype._attrsAffectingSize = ["data"];
(0, So._registerNode)(ft);
vo.Factory.addGetterSetter(ft, "data");
Object.defineProperty(yi, "__esModule", { value: !0 });
yi.Arrow = void 0;
const vi = B, Co = ze, la = N, xo = U, br = Pe;
class ee extends Co.Line {
  _sceneFunc(t) {
    super._sceneFunc(t);
    const e = Math.PI * 2, i = this.points();
    let n = i;
    const r = this.tension() !== 0 && i.length > 4;
    r && (n = this.getTensionPoints());
    const s = this.pointerLength(), o = i.length;
    let l, h;
    if (r) {
      const g = [
        n[n.length - 4],
        n[n.length - 3],
        n[n.length - 2],
        n[n.length - 1],
        i[o - 2],
        i[o - 1]
      ], _ = br.Path.calcLength(n[n.length - 4], n[n.length - 3], "C", g), c = br.Path.getPointOnQuadraticBezier(Math.min(1, 1 - s / _), g[0], g[1], g[2], g[3], g[4], g[5]);
      l = i[o - 2] - c.x, h = i[o - 1] - c.y;
    } else
      l = i[o - 2] - i[o - 4], h = i[o - 1] - i[o - 3];
    const u = (Math.atan2(h, l) + e) % e, p = this.pointerWidth();
    this.pointerAtEnding() && (t.save(), t.beginPath(), t.translate(i[o - 2], i[o - 1]), t.rotate(u), t.moveTo(0, 0), t.lineTo(-s, p / 2), t.lineTo(-s, -p / 2), t.closePath(), t.restore(), this.__fillStroke(t)), this.pointerAtBeginning() && (t.save(), t.beginPath(), t.translate(i[0], i[1]), r ? (l = (n[0] + n[2]) / 2 - i[0], h = (n[1] + n[3]) / 2 - i[1]) : (l = i[2] - i[0], h = i[3] - i[1]), t.rotate((Math.atan2(-h, -l) + e) % e), t.moveTo(0, 0), t.lineTo(-s, p / 2), t.lineTo(-s, -p / 2), t.closePath(), t.restore(), this.__fillStroke(t));
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
yi.Arrow = ee;
ee.prototype.className = "Arrow";
(0, xo._registerNode)(ee);
vi.Factory.addGetterSetter(ee, "pointerLength", 10, (0, la.getNumberValidator)());
vi.Factory.addGetterSetter(ee, "pointerWidth", 10, (0, la.getNumberValidator)());
vi.Factory.addGetterSetter(ee, "pointerAtBeginning", !1);
vi.Factory.addGetterSetter(ee, "pointerAtEnding", !0);
var Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.Circle = void 0;
const ko = B, Ao = gt, Po = N, Eo = U;
class Ee extends Ao.Shape {
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
Si.Circle = Ee;
Ee.prototype._centroid = !0;
Ee.prototype.className = "Circle";
Ee.prototype._attrsAffectingSize = ["radius"];
(0, Eo._registerNode)(Ee);
ko.Factory.addGetterSetter(Ee, "radius", 0, (0, Po.getNumberValidator)());
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
wi.Ellipse = void 0;
const Nn = B, Mo = gt, ha = N, To = U;
class Ht extends Mo.Shape {
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
wi.Ellipse = Ht;
Ht.prototype.className = "Ellipse";
Ht.prototype._centroid = !0;
Ht.prototype._attrsAffectingSize = ["radiusX", "radiusY"];
(0, To._registerNode)(Ht);
Nn.Factory.addComponentsGetterSetter(Ht, "radius", ["x", "y"]);
Nn.Factory.addGetterSetter(Ht, "radiusX", 0, (0, ha.getNumberValidator)());
Nn.Factory.addGetterSetter(Ht, "radiusY", 0, (0, ha.getNumberValidator)());
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.Image = void 0;
const dn = rt, ie = B, Ro = gt, $o = U, We = N;
let xt = class da extends Ro.Shape {
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
    (this.hasFill() || this.hasStroke() || n) && (t.beginPath(), n ? dn.Util.drawRoundedRectPath(t, e, i, n) : t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this)), r && (n && t.clip(), t.drawImage.apply(t, s));
  }
  _hitFunc(t) {
    const e = this.width(), i = this.height(), n = this.cornerRadius();
    t.beginPath(), n ? dn.Util.drawRoundedRectPath(t, e, i, n) : t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this);
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
    const n = dn.Util.createImageElement();
    n.onload = function() {
      const r = new da({
        image: n
      });
      e(r);
    }, n.onerror = i, n.crossOrigin = "Anonymous", n.src = t;
  }
};
Ci.Image = xt;
xt.prototype.className = "Image";
(0, $o._registerNode)(xt);
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
const xi = B, Fo = gt, Oo = ke, In = N, ca = U, ua = [
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
], Do = "Change.konva", Lo = "none", vn = "up", Sn = "right", wn = "down", Cn = "left", No = ua.length;
class Gn extends Oo.Group {
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
    for (i = 0; i < No; i++)
      t.on(ua[i] + Do, n);
  }
  getWidth() {
    return this.getText().width();
  }
  getHeight() {
    return this.getText().height();
  }
  _sync() {
    let t = this.getText(), e = this.getTag(), i, n, r, s, o, l, h;
    if (t && e) {
      switch (i = t.width(), n = t.height(), r = e.pointerDirection(), s = e.pointerWidth(), h = e.pointerHeight(), o = 0, l = 0, r) {
        case vn:
          o = i / 2, l = -1 * h;
          break;
        case Sn:
          o = i + s, l = n / 2;
          break;
        case wn:
          o = i / 2, l = n + h;
          break;
        case Cn:
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
ye.Label = Gn;
Gn.prototype.className = "Label";
(0, ca._registerNode)(Gn);
class ne extends Fo.Shape {
  _sceneFunc(t) {
    const e = this.width(), i = this.height(), n = this.pointerDirection(), r = this.pointerWidth(), s = this.pointerHeight(), o = this.cornerRadius();
    let l = 0, h = 0, u = 0, p = 0;
    typeof o == "number" ? l = h = u = p = Math.min(o, e / 2, i / 2) : (l = Math.min(o[0] || 0, e / 2, i / 2), h = Math.min(o[1] || 0, e / 2, i / 2), p = Math.min(o[2] || 0, e / 2, i / 2), u = Math.min(o[3] || 0, e / 2, i / 2)), t.beginPath(), t.moveTo(l, 0), n === vn && (t.lineTo((e - r) / 2, 0), t.lineTo(e / 2, -1 * s), t.lineTo((e + r) / 2, 0)), t.lineTo(e - h, 0), t.arc(e - h, h, h, Math.PI * 3 / 2, 0, !1), n === Sn && (t.lineTo(e, (i - s) / 2), t.lineTo(e + r, i / 2), t.lineTo(e, (i + s) / 2)), t.lineTo(e, i - p), t.arc(e - p, i - p, p, 0, Math.PI / 2, !1), n === wn && (t.lineTo((e + r) / 2, i), t.lineTo(e / 2, i + s), t.lineTo((e - r) / 2, i)), t.lineTo(u, i), t.arc(u, i - u, u, Math.PI / 2, Math.PI, !1), n === Cn && (t.lineTo(0, (i + s) / 2), t.lineTo(-1 * r, i / 2), t.lineTo(0, (i - s) / 2)), t.lineTo(0, l), t.arc(l, l, l, Math.PI, Math.PI * 3 / 2, !1), t.closePath(), t.fillStrokeShape(this);
  }
  getSelfRect() {
    let t = 0, e = 0, i = this.pointerWidth(), n = this.pointerHeight(), r = this.pointerDirection(), s = this.width(), o = this.height();
    return r === vn ? (e -= n, o += n) : r === wn ? o += n : r === Cn ? (t -= i * 1.5, s += i) : r === Sn && (s += i * 1.5), {
      x: t,
      y: e,
      width: s,
      height: o
    };
  }
}
ye.Tag = ne;
ne.prototype.className = "Tag";
(0, ca._registerNode)(ne);
xi.Factory.addGetterSetter(ne, "pointerDirection", Lo);
xi.Factory.addGetterSetter(ne, "pointerWidth", 0, (0, In.getNumberValidator)());
xi.Factory.addGetterSetter(ne, "pointerHeight", 0, (0, In.getNumberValidator)());
xi.Factory.addGetterSetter(ne, "cornerRadius", 0, (0, In.getNumberOrArrayOfNumbersValidator)(4));
var je = {};
Object.defineProperty(je, "__esModule", { value: !0 });
je.Rect = void 0;
const Io = B, Go = gt, Uo = U, Bo = rt, Vo = N;
class ki extends Go.Shape {
  _sceneFunc(t) {
    const e = this.cornerRadius(), i = this.width(), n = this.height();
    t.beginPath(), e ? Bo.Util.drawRoundedRectPath(t, i, n, e) : t.rect(0, 0, i, n), t.closePath(), t.fillStrokeShape(this);
  }
}
je.Rect = ki;
ki.prototype.className = "Rect";
(0, Uo._registerNode)(ki);
Io.Factory.addGetterSetter(ki, "cornerRadius", 0, (0, Vo.getNumberOrArrayOfNumbersValidator)(4));
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.RegularPolygon = void 0;
const fa = B, Ho = gt, ga = N, zo = U;
class re extends Ho.Shape {
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
Ai.RegularPolygon = re;
re.prototype.className = "RegularPolygon";
re.prototype._centroid = !0;
re.prototype._attrsAffectingSize = ["radius"];
(0, zo._registerNode)(re);
fa.Factory.addGetterSetter(re, "radius", 0, (0, ga.getNumberValidator)());
fa.Factory.addGetterSetter(re, "sides", 0, (0, ga.getNumberValidator)());
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.Ring = void 0;
const pa = B, Wo = gt, _a = N, jo = U, vr = Math.PI * 2;
class ae extends Wo.Shape {
  _sceneFunc(t) {
    t.beginPath(), t.arc(0, 0, this.innerRadius(), 0, vr, !1), t.moveTo(this.outerRadius(), 0), t.arc(0, 0, this.outerRadius(), vr, 0, !0), t.closePath(), t.fillStrokeShape(this);
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
Pi.Ring = ae;
ae.prototype.className = "Ring";
ae.prototype._centroid = !0;
ae.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"];
(0, jo._registerNode)(ae);
pa.Factory.addGetterSetter(ae, "innerRadius", 0, (0, _a.getNumberValidator)());
pa.Factory.addGetterSetter(ae, "outerRadius", 0, (0, _a.getNumberValidator)());
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.Sprite = void 0;
const se = B, Yo = gt, Ko = Ae, ma = N, Xo = U;
class kt extends Yo.Shape {
  constructor(t) {
    super(t), this._updated = !0, this.anim = new Ko.Animation(() => {
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
    const e = this.animation(), i = this.frameIndex(), n = i * 4, r = this.animations()[e], s = this.frameOffsets(), o = r[n + 0], l = r[n + 1], h = r[n + 2], u = r[n + 3], p = this.image();
    if ((this.hasFill() || this.hasStroke()) && (t.beginPath(), t.rect(0, 0, h, u), t.closePath(), t.fillStrokeShape(this)), p)
      if (s) {
        const g = s[e], _ = i * 2;
        t.drawImage(p, o, l, h, u, g[_ + 0], g[_ + 1], h, u);
      } else
        t.drawImage(p, o, l, h, u, 0, 0, h, u);
  }
  _hitFunc(t) {
    const e = this.animation(), i = this.frameIndex(), n = i * 4, r = this.animations()[e], s = this.frameOffsets(), o = r[n + 2], l = r[n + 3];
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
    const t = this.frameIndex(), e = this.animation(), i = this.animations(), n = i[e], r = n.length / 4;
    t < r - 1 ? this.frameIndex(t + 1) : this.frameIndex(0);
  }
}
Ei.Sprite = kt;
kt.prototype.className = "Sprite";
(0, Xo._registerNode)(kt);
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
var Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
Mi.Star = void 0;
const Un = B, qo = gt, Bn = N, Qo = U;
class zt extends qo.Shape {
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
Mi.Star = zt;
zt.prototype.className = "Star";
zt.prototype._centroid = !0;
zt.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"];
(0, Qo._registerNode)(zt);
Un.Factory.addGetterSetter(zt, "numPoints", 5, (0, Bn.getNumberValidator)());
Un.Factory.addGetterSetter(zt, "innerRadius", 0, (0, Bn.getNumberValidator)());
Un.Factory.addGetterSetter(zt, "outerRadius", 0, (0, Bn.getNumberValidator)());
var Me = {};
Object.defineProperty(Me, "__esModule", { value: !0 });
Me.Text = void 0;
Me.stringToArray = Xt;
const xn = rt, _t = B, Jo = gt, cn = U, Wt = N, Zo = U;
function Xt(a) {
  return [...a].reduce((t, e, i, n) => {
    if (new RegExp("\\p{Emoji}", "u").test(e)) {
      const r = n[i + 1];
      r && new RegExp("\\p{Emoji_Modifier}|\\u200D", "u").test(r) ? (t.push(e + r), n[i + 1] = "") : t.push(e);
    } else new RegExp("\\p{Regional_Indicator}{2}", "u").test(e + (n[i + 1] || "")) ? t.push(e + n[i + 1]) : i > 0 && new RegExp("\\p{Mn}|\\p{Me}|\\p{Mc}", "u").test(e) ? t[t.length - 1] += e : e && t.push(e);
    return t;
  }, []);
}
const fe = "auto", tl = "center", ya = "inherit", Re = "justify", el = "Change.konva", il = "2d", Sr = "-", ba = "left", nl = "text", rl = "Text", al = "top", sl = "bottom", wr = "middle", va = "normal", ol = "px ", Xe = " ", ll = "right", Cr = "rtl", hl = "word", dl = "char", xr = "none", un = "…", Sa = [
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
], cl = Sa.length;
function ul(a) {
  return a.split(",").map((t) => {
    t = t.trim();
    const e = t.indexOf(" ") >= 0, i = t.indexOf('"') >= 0 || t.indexOf("'") >= 0;
    return e && !i && (t = `"${t}"`), t;
  }).join(", ");
}
let qe;
function fn() {
  return qe || (qe = xn.Util.createCanvasElement().getContext(il), qe);
}
function fl(a) {
  a.fillText(this._partialText, this._partialTextX, this._partialTextY);
}
function gl(a) {
  a.setAttr("miterLimit", 2), a.strokeText(this._partialText, this._partialTextX, this._partialTextY);
}
function pl(a) {
  return a = a || {}, !a.fillLinearGradientColorStops && !a.fillRadialGradientColorStops && !a.fillPatternImage && (a.fill = a.fill || "black"), a;
}
class lt extends Jo.Shape {
  constructor(t) {
    super(pl(t)), this._partialTextX = 0, this._partialTextY = 0;
    for (let e = 0; e < cl; e++)
      this.on(Sa[e] + el, this._setTextData);
    this._setTextData();
  }
  _sceneFunc(t) {
    const e = this.textArr, i = e.length;
    if (!this.text())
      return;
    let n = this.padding(), r = this.fontSize(), s = this.lineHeight() * r, o = this.verticalAlign(), l = this.direction(), h = 0, u = this.align(), p = this.getWidth(), g = this.letterSpacing(), _ = this.fill(), c = this.textDecoration(), m = c.indexOf("underline") !== -1, y = c.indexOf("line-through") !== -1, S;
    l = l === ya ? t.direction : l;
    let w = s / 2, d = wr;
    if (cn.Konva._fixTextRendering) {
      const f = this.measureSize("M");
      d = "alphabetic", w = (f.fontBoundingBoxAscent - f.fontBoundingBoxDescent) / 2 + s / 2;
    }
    for (l === Cr && t.setAttr("direction", l), t.setAttr("font", this._getContextFont()), t.setAttr("textBaseline", d), t.setAttr("textAlign", ba), o === wr ? h = (this.getHeight() - i * s - n * 2) / 2 : o === sl && (h = this.getHeight() - i * s - n * 2), t.translate(n, h + n), S = 0; S < i; S++) {
      let f = 0, b = 0;
      const C = e[S], P = C.text, v = C.width, E = C.lastInParagraph;
      if (t.save(), u === ll ? f += p - v - n * 2 : u === tl && (f += (p - v - n * 2) / 2), m) {
        t.save(), t.beginPath();
        const k = cn.Konva._fixTextRendering ? Math.round(r / 4) : Math.round(r / 2), M = f, T = w + b + k;
        t.moveTo(M, T);
        const A = u === Re && !E ? p - n * 2 : v;
        t.lineTo(M + Math.round(A), T), t.lineWidth = r / 15;
        const F = this._getLinearGradient();
        t.strokeStyle = F || _, t.stroke(), t.restore();
      }
      if (y) {
        t.save(), t.beginPath();
        const k = cn.Konva._fixTextRendering ? -Math.round(r / 4) : 0;
        t.moveTo(f, w + b + k);
        const M = u === Re && !E ? p - n * 2 : v;
        t.lineTo(f + Math.round(M), w + b + k), t.lineWidth = r / 15;
        const T = this._getLinearGradient();
        t.strokeStyle = T || _, t.stroke(), t.restore();
      }
      if (l !== Cr && (g !== 0 || u === Re)) {
        const k = P.split(" ").length - 1, M = Xt(P);
        for (let T = 0; T < M.length; T++) {
          const A = M[T];
          A === " " && !E && u === Re && (f += (p - n * 2 - v) / k), this._partialTextX = f, this._partialTextY = w + b, this._partialText = A, t.fillStrokeShape(this), f += this.measureSize(A).width + g;
        }
      } else
        g !== 0 && t.setAttr("letterSpacing", `${g}px`), this._partialTextX = f, this._partialTextY = w + b, this._partialText = P, t.fillStrokeShape(this);
      t.restore(), i > 1 && (w += s);
    }
  }
  _hitFunc(t) {
    const e = this.getWidth(), i = this.getHeight();
    t.beginPath(), t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this);
  }
  setText(t) {
    const e = xn.Util._isString(t) ? t : t == null ? "" : t + "";
    return this._setAttr(nl, e), this;
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
    return xn.Util.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height."), this.textHeight;
  }
  measureSize(t) {
    var e, i, n, r, s, o, l, h, u, p, g;
    let _ = fn(), c = this.fontSize(), m;
    _.save(), _.font = this._getContextFont(), m = _.measureText(t), _.restore();
    const y = c / 100;
    return {
      actualBoundingBoxAscent: (e = m.actualBoundingBoxAscent) !== null && e !== void 0 ? e : 71.58203125 * y,
      actualBoundingBoxDescent: (i = m.actualBoundingBoxDescent) !== null && i !== void 0 ? i : 0,
      actualBoundingBoxLeft: (n = m.actualBoundingBoxLeft) !== null && n !== void 0 ? n : -7.421875 * y,
      actualBoundingBoxRight: (r = m.actualBoundingBoxRight) !== null && r !== void 0 ? r : 75.732421875 * y,
      alphabeticBaseline: (s = m.alphabeticBaseline) !== null && s !== void 0 ? s : 0,
      emHeightAscent: (o = m.emHeightAscent) !== null && o !== void 0 ? o : 100 * y,
      emHeightDescent: (l = m.emHeightDescent) !== null && l !== void 0 ? l : -20 * y,
      fontBoundingBoxAscent: (h = m.fontBoundingBoxAscent) !== null && h !== void 0 ? h : 91 * y,
      fontBoundingBoxDescent: (u = m.fontBoundingBoxDescent) !== null && u !== void 0 ? u : 21 * y,
      hangingBaseline: (p = m.hangingBaseline) !== null && p !== void 0 ? p : 72.80000305175781 * y,
      ideographicBaseline: (g = m.ideographicBaseline) !== null && g !== void 0 ? g : -21 * y,
      width: m.width,
      height: c
    };
  }
  _getContextFont() {
    return this.fontStyle() + Xe + this.fontVariant() + Xe + (this.fontSize() + ol) + ul(this.fontFamily());
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
    return fn().measureText(t).width + e * i;
  }
  _setTextData() {
    let t = this.text().split(`
`), e = +this.fontSize(), i = 0, n = this.lineHeight() * e, r = this.attrs.width, s = this.attrs.height, o = r !== fe && r !== void 0, l = s !== fe && s !== void 0, h = this.padding(), u = r - h * 2, p = s - h * 2, g = 0, _ = this.wrap(), c = _ !== xr, m = _ !== dl && c, y = this.ellipsis();
    this.textArr = [], fn().font = this._getContextFont();
    const S = y ? this._getTextWidth(un) : 0;
    for (let w = 0, d = t.length; w < d; ++w) {
      let f = t[w], b = this._getTextWidth(f);
      if (o && b > u)
        for (; f.length > 0; ) {
          let C = 0, P = Xt(f).length, v = "", E = 0;
          for (; C < P; ) {
            const k = C + P >>> 1, M = Xt(f), T = M.slice(0, k + 1).join(""), A = this._getTextWidth(T);
            (y && l && g + n > p ? A + S : A) <= u ? (C = k + 1, v = T, E = A) : P = k;
          }
          if (v) {
            if (m) {
              const T = Xt(f), A = Xt(v), F = T[A.length], $ = F === Xe || F === Sr;
              let q;
              if ($ && E <= u)
                q = A.length;
              else {
                const K = A.lastIndexOf(Xe), L = A.lastIndexOf(Sr);
                q = Math.max(K, L) + 1;
              }
              q > 0 && (C = q, v = T.slice(0, C).join(""), E = this._getTextWidth(v));
            }
            if (v = v.trimRight(), this._addTextLine(v), i = Math.max(i, E), g += n, this._shouldHandleEllipsis(g)) {
              this._tryToAddEllipsisToLastLine();
              break;
            }
            if (f = Xt(f).slice(C).join("").trimLeft(), f.length > 0 && (b = this._getTextWidth(f), b <= u)) {
              this._addTextLine(f), g += n, i = Math.max(i, b);
              break;
            }
          } else
            break;
        }
      else
        this._addTextLine(f), g += n, i = Math.max(i, b), this._shouldHandleEllipsis(g) && w < d - 1 && this._tryToAddEllipsisToLastLine();
      if (this.textArr[this.textArr.length - 1] && (this.textArr[this.textArr.length - 1].lastInParagraph = !0), l && g + n > p)
        break;
    }
    this.textHeight = e, this.textWidth = i;
  }
  _shouldHandleEllipsis(t) {
    const e = +this.fontSize(), i = this.lineHeight() * e, n = this.attrs.height, r = n !== fe && n !== void 0, s = this.padding(), o = n - s * 2;
    return !(this.wrap() !== xr) || r && t + i > o;
  }
  _tryToAddEllipsisToLastLine() {
    const t = this.attrs.width, e = t !== fe && t !== void 0, i = this.padding(), n = t - i * 2, r = this.ellipsis(), s = this.textArr[this.textArr.length - 1];
    !s || !r || (e && (this._getTextWidth(s.text + un) < n || (s.text = s.text.slice(0, s.text.length - 3))), this.textArr.splice(this.textArr.length - 1, 1), this._addTextLine(s.text + un));
  }
  getStrokeScaleEnabled() {
    return !0;
  }
  _useBufferCanvas() {
    const t = this.textDecoration().indexOf("underline") !== -1 || this.textDecoration().indexOf("line-through") !== -1, e = this.hasShadow();
    return t && e ? !0 : super._useBufferCanvas();
  }
}
Me.Text = lt;
lt.prototype._fillFunc = fl;
lt.prototype._strokeFunc = gl;
lt.prototype.className = rl;
lt.prototype._attrsAffectingSize = [
  "text",
  "fontSize",
  "padding",
  "wrap",
  "lineHeight",
  "letterSpacing"
];
(0, Zo._registerNode)(lt);
_t.Factory.overWriteSetter(lt, "width", (0, Wt.getNumberOrAutoValidator)());
_t.Factory.overWriteSetter(lt, "height", (0, Wt.getNumberOrAutoValidator)());
_t.Factory.addGetterSetter(lt, "direction", ya);
_t.Factory.addGetterSetter(lt, "fontFamily", "Arial");
_t.Factory.addGetterSetter(lt, "fontSize", 12, (0, Wt.getNumberValidator)());
_t.Factory.addGetterSetter(lt, "fontStyle", va);
_t.Factory.addGetterSetter(lt, "fontVariant", va);
_t.Factory.addGetterSetter(lt, "padding", 0, (0, Wt.getNumberValidator)());
_t.Factory.addGetterSetter(lt, "align", ba);
_t.Factory.addGetterSetter(lt, "verticalAlign", al);
_t.Factory.addGetterSetter(lt, "lineHeight", 1, (0, Wt.getNumberValidator)());
_t.Factory.addGetterSetter(lt, "wrap", hl);
_t.Factory.addGetterSetter(lt, "ellipsis", !1, (0, Wt.getBooleanValidator)());
_t.Factory.addGetterSetter(lt, "letterSpacing", 0, (0, Wt.getNumberValidator)());
_t.Factory.addGetterSetter(lt, "text", "", (0, Wt.getStringValidator)());
_t.Factory.addGetterSetter(lt, "textDecoration", "");
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.TextPath = void 0;
const gn = rt, wt = B, _l = gt, $e = Pe, pn = Me, wa = N, ml = U, yl = "", Ca = "normal";
function xa(a) {
  a.fillText(this.partialText, 0, 0);
}
function ka(a) {
  a.strokeText(this.partialText, 0, 0);
}
class pt extends _l.Shape {
  constructor(t) {
    super(t), this.dummyCanvas = gn.Util.createCanvasElement(), this.dataArray = [], this._readDataAttribute(), this.on("dataChange.konva", function() {
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
    return gn.Util.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height."), this.textHeight;
  }
  setText(t) {
    return pn.Text.prototype.setText.call(this, t);
  }
  _getContextFont() {
    return pn.Text.prototype._getContextFont.call(this);
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
    const l = (0, pn.stringToArray)(this.text());
    let h = o;
    for (let u = 0; u < l.length; u++) {
      const p = this._getPointAtLength(h);
      if (!p)
        return;
      let g = this._getTextSize(l[u]).width + i;
      if (l[u] === " " && n === "justify") {
        const w = this.text().split(" ").length - 1;
        g += (this.pathLength - s) / w;
      }
      const _ = this._getPointAtLength(h + g);
      if (!_)
        return;
      const c = $e.Path.getLineLength(p.x, p.y, _.x, _.y);
      let m = 0;
      if (r)
        try {
          m = r(l[u - 1], l[u]) * this.fontSize();
        } catch {
          m = 0;
        }
      p.x += m, _.x += m, this.textWidth += m;
      const y = $e.Path.getPointOnLine(m + c / 2, p.x, p.y, _.x, _.y), S = Math.atan2(_.y - p.y, _.x - p.x);
      this.glyphInfo.push({
        transposeX: y.x,
        transposeY: y.y,
        text: l[u],
        rotation: S,
        p0: p,
        p1: _
      }), h += g;
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
    let e = t[0] || 0, i = t[0] || 0, n = t[1] || 0, r = t[1] || 0, s, o;
    for (let h = 0; h < t.length / 2; h++)
      s = t[h * 2], o = t[h * 2 + 1], e = Math.min(e, s), i = Math.max(i, s), n = Math.min(n, o), r = Math.max(r, o);
    const l = this.fontSize();
    return {
      x: e - l / 2,
      y: n - l / 2,
      width: i - e + l,
      height: r - n + l
    };
  }
  destroy() {
    return gn.Util.releaseCanvas(this.dummyCanvas), super.destroy();
  }
}
Ti.TextPath = pt;
pt.prototype._fillFunc = xa;
pt.prototype._strokeFunc = ka;
pt.prototype._fillFuncHit = xa;
pt.prototype._strokeFuncHit = ka;
pt.prototype.className = "TextPath";
pt.prototype._attrsAffectingSize = ["text", "fontSize", "data"];
(0, ml._registerNode)(pt);
wt.Factory.addGetterSetter(pt, "data");
wt.Factory.addGetterSetter(pt, "fontFamily", "Arial");
wt.Factory.addGetterSetter(pt, "fontSize", 12, (0, wa.getNumberValidator)());
wt.Factory.addGetterSetter(pt, "fontStyle", Ca);
wt.Factory.addGetterSetter(pt, "align", "left");
wt.Factory.addGetterSetter(pt, "letterSpacing", 0, (0, wa.getNumberValidator)());
wt.Factory.addGetterSetter(pt, "textBaseline", "middle");
wt.Factory.addGetterSetter(pt, "fontVariant", Ca);
wt.Factory.addGetterSetter(pt, "text", yl);
wt.Factory.addGetterSetter(pt, "textDecoration", "");
wt.Factory.addGetterSetter(pt, "kerningFunc", void 0);
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.Transformer = void 0;
const X = rt, Y = B, kr = it, bl = gt, vl = je, Ar = ke, vt = U, jt = N, Sl = U, Aa = "tr-konva", wl = [
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
].map((a) => a + `.${Aa}`).join(" "), Pr = "nodesRect", Cl = [
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
], xl = {
  "top-left": -45,
  "top-center": 0,
  "top-right": 45,
  "middle-right": -90,
  "middle-left": 90,
  "bottom-left": -135,
  "bottom-center": 180,
  "bottom-right": 135
}, kl = "ontouchstart" in vt.Konva._global;
function Al(a, t, e) {
  if (a === "rotater")
    return e;
  t += X.Util.degToRad(xl[a] || 0);
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
function Pl(a) {
  return {
    x: a.x + a.width / 2 * Math.cos(a.rotation) + a.height / 2 * Math.sin(-a.rotation),
    y: a.y + a.height / 2 * Math.cos(a.rotation) + a.width / 2 * Math.sin(a.rotation)
  };
}
function Pa(a, t, e) {
  const i = e.x + (a.x - e.x) * Math.cos(t) - (a.y - e.y) * Math.sin(t), n = e.y + (a.x - e.x) * Math.sin(t) + (a.y - e.y) * Math.cos(t);
  return {
    ...a,
    rotation: a.rotation + t,
    x: i,
    y: n
  };
}
function El(a, t) {
  const e = Pl(a);
  return Pa(a, t, e);
}
function Ml(a, t, e) {
  let i = t;
  for (let n = 0; n < a.length; n++) {
    const r = vt.Konva.getAngle(a[n]), s = Math.abs(r - t) % (Math.PI * 2);
    Math.min(s, Math.PI * 2 - s) < e && (i = r);
  }
  return i;
}
let kn = 0;
class z extends Ar.Group {
  constructor(t) {
    super(t), this._movingAnchorName = null, this._transforming = !1, this._createElements(), this._handleMouseMove = this._handleMouseMove.bind(this), this._handleMouseUp = this._handleMouseUp.bind(this), this.update = this.update.bind(this), this.on(wl, this.update), this.getNode() && this.update();
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
    const e = t.filter((n) => n.isAncestorOf(this) ? (X.Util.error("Konva.Transformer cannot be an a child of the node you are trying to attach"), !1) : !0);
    return this._nodes = t = e, t.length === 1 && this.useSingleNodeRotation() ? this.rotation(t[0].getAbsoluteRotation()) : this.rotation(0), this._nodes.forEach((n) => {
      const r = () => {
        this.nodes().length === 1 && this.useSingleNodeRotation() && this.rotation(this.nodes()[0].getAbsoluteRotation()), this._resetTransformCache(), !this._transforming && !this.isDragging() && this.update();
      };
      if (n._attrsAffectingSize.length) {
        const s = n._attrsAffectingSize.map((o) => o + "Change." + this._getEventNamespace()).join(" ");
        n.on(s, r);
      }
      n.on(Cl.map((s) => s + `.${this._getEventNamespace()}`).join(" "), r), n.on(`absoluteTransformChange.${this._getEventNamespace()}`, r), this._proxyDrag(n);
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
    this._clearCache(Pr), this._clearCache("transform"), this._clearSelfAndDescendantCache("absoluteTransform");
  }
  _getNodeRect() {
    return this._getCache(Pr, this.__getNodeRect);
  }
  __getNodeShape(t, e = this.rotation(), i) {
    const n = t.getClientRect({
      skipTransform: !0,
      skipShadow: !0,
      skipStroke: this.ignoreStroke()
    }), r = t.getAbsoluteScale(i), s = t.getAbsolutePosition(i), o = n.x * r.x - t.offsetX() * r.x, l = n.y * r.y - t.offsetY() * r.y, h = (vt.Konva.getAngle(t.getAbsoluteRotation()) + Math.PI * 2) % (Math.PI * 2), u = {
      x: s.x + o * Math.cos(h) + l * Math.sin(-h),
      y: s.y + l * Math.cos(h) + o * Math.sin(h),
      width: n.width * r.x,
      height: n.height * r.y,
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
      }), p = [
        { x: u.x, y: u.y },
        { x: u.x + u.width, y: u.y },
        { x: u.x + u.width, y: u.y + u.height },
        { x: u.x, y: u.y + u.height }
      ], g = h.getAbsoluteTransform();
      p.forEach(function(_) {
        const c = g.point(_);
        e.push(c);
      });
    });
    const i = new X.Transform();
    i.rotate(-vt.Konva.getAngle(this.rotation()));
    let n = 1 / 0, r = 1 / 0, s = -1 / 0, o = -1 / 0;
    e.forEach(function(h) {
      const u = i.point(h);
      n === void 0 && (n = s = u.x, r = o = u.y), n = Math.min(n, u.x), r = Math.min(r, u.y), s = Math.max(s, u.x), o = Math.max(o, u.y);
    }), i.invert();
    const l = i.point({ x: n, y: r });
    return {
      x: l.x,
      y: l.y,
      width: s - n,
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
    this._createBack(), ai.forEach((t) => {
      this._createAnchor(t);
    }), this._createAnchor("rotater");
  }
  _createAnchor(t) {
    const e = new vl.Rect({
      stroke: "rgb(0, 161, 255)",
      fill: "white",
      strokeWidth: 1,
      name: t + " _anchor",
      dragDistance: 0,
      draggable: !0,
      hitStrokeWidth: kl ? 10 : "auto"
    }), i = this;
    e.on("mousedown touchstart", function(n) {
      i._handleMouseDown(n);
    }), e.on("dragstart", (n) => {
      e.stopDrag(), n.cancelBubble = !0;
    }), e.on("dragend", (n) => {
      n.cancelBubble = !0;
    }), e.on("mouseenter", () => {
      const n = vt.Konva.getAngle(this.rotation()), r = this.rotateAnchorCursor(), s = Al(t, n, r);
      e.getStage().content && (e.getStage().content.style.cursor = s), this._cursorChange = !0;
    }), e.on("mouseout", () => {
      e.getStage().content && (e.getStage().content.style.cursor = ""), this._cursorChange = !1;
    }), this.add(e);
  }
  _createBack() {
    const t = new bl.Shape({
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
    const s = t.target.getAbsolutePosition(), o = t.target.getStage().getPointerPosition();
    this._anchorDragOffset = {
      x: o.x - s.x,
      y: o.y - s.y
    }, kn++, this._fire("transformstart", { evt: t.evt, target: this.getNode() }), this._nodes.forEach((l) => {
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
    const h = r.getAbsolutePosition();
    this.anchorDragBoundFunc() && (l = this.anchorDragBoundFunc()(h, l, t)), r.setAbsolutePosition(l);
    const u = r.getAbsolutePosition();
    if (h.x === u.x && h.y === u.y)
      return;
    if (this._movingAnchorName === "rotater") {
      const w = this._getNodeRect();
      e = r.x() - w.width / 2, i = -r.y() + w.height / 2;
      let d = Math.atan2(-i, e) + Math.PI / 2;
      w.height < 0 && (d -= Math.PI);
      const b = vt.Konva.getAngle(this.rotation()) + d, C = vt.Konva.getAngle(this.rotationSnapTolerance()), v = Ml(this.rotationSnaps(), b, C) - w.rotation, E = El(w, v);
      this._fitNodesInto(E, t);
      return;
    }
    const p = this.shiftBehavior();
    let g;
    p === "inverted" ? g = this.keepRatio() && !t.shiftKey : p === "none" ? g = this.keepRatio() : g = this.keepRatio() || t.shiftKey;
    let _ = this.centeredScaling() || t.altKey;
    if (this._movingAnchorName === "top-left") {
      if (g) {
        const w = _ ? {
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
      if (g) {
        const w = _ ? {
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
      var c = r.position();
      this.findOne(".top-left").y(c.y), this.findOne(".bottom-right").x(c.x);
    } else if (this._movingAnchorName === "middle-left")
      this.findOne(".top-left").x(r.x());
    else if (this._movingAnchorName === "middle-right")
      this.findOne(".bottom-right").x(r.x());
    else if (this._movingAnchorName === "bottom-left") {
      if (g) {
        const w = _ ? {
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
      c = r.position(), this.findOne(".top-left").x(c.x), this.findOne(".bottom-right").y(c.y);
    } else if (this._movingAnchorName === "bottom-center")
      this.findOne(".bottom-right").y(r.y());
    else if (this._movingAnchorName === "bottom-right" && g) {
      const w = _ ? {
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
    if (_ = this.centeredScaling() || t.altKey, _) {
      const w = this.findOne(".top-left"), d = this.findOne(".bottom-right"), f = w.x(), b = w.y(), C = this.getWidth() - d.x(), P = this.getHeight() - d.y();
      d.move({
        x: -f,
        y: -b
      }), w.move({
        x: C,
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
      kn--, this._fire("transformend", { evt: t, target: i }), (e = this.getLayer()) === null || e === void 0 || e.batchDraw(), i && this._nodes.forEach((n) => {
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
      const g = r.point({
        x: -this.padding() * 2,
        y: 0
      });
      t.x += g.x, t.y += g.y, t.width += this.padding() * 2, this._movingAnchorName = this._movingAnchorName.replace("left", "right"), this._anchorDragOffset.x -= g.x, this._anchorDragOffset.y -= g.y;
    } else if (this._movingAnchorName && t.width < 0 && this._movingAnchorName.indexOf("right") >= 0) {
      const g = r.point({
        x: this.padding() * 2,
        y: 0
      });
      this._movingAnchorName = this._movingAnchorName.replace("right", "left"), this._anchorDragOffset.x -= g.x, this._anchorDragOffset.y -= g.y, t.width += this.padding() * 2;
    }
    if (this._movingAnchorName && t.height < 0 && this._movingAnchorName.indexOf("top") >= 0) {
      const g = r.point({
        x: 0,
        y: -this.padding() * 2
      });
      t.x += g.x, t.y += g.y, this._movingAnchorName = this._movingAnchorName.replace("top", "bottom"), this._anchorDragOffset.x -= g.x, this._anchorDragOffset.y -= g.y, t.height += this.padding() * 2;
    } else if (this._movingAnchorName && t.height < 0 && this._movingAnchorName.indexOf("bottom") >= 0) {
      const g = r.point({
        x: 0,
        y: this.padding() * 2
      });
      this._movingAnchorName = this._movingAnchorName.replace("bottom", "top"), this._anchorDragOffset.x -= g.x, this._anchorDragOffset.y -= g.y, t.height += this.padding() * 2;
    }
    if (this.boundBoxFunc()) {
      const g = this.boundBoxFunc()(i, t);
      g ? t = g : X.Util.warn("boundBoxFunc returned falsy. You should return new bound rect from it!");
    }
    const s = 1e7, o = new X.Transform();
    o.translate(i.x, i.y), o.rotate(i.rotation), o.scale(i.width / s, i.height / s);
    const l = new X.Transform(), h = t.width / s, u = t.height / s;
    this.flipEnabled() === !1 ? (l.translate(t.x, t.y), l.rotate(t.rotation), l.translate(t.width < 0 ? t.width : 0, t.height < 0 ? t.height : 0), l.scale(Math.abs(h), Math.abs(u))) : (l.translate(t.x, t.y), l.rotate(t.rotation), l.scale(h, u));
    const p = l.multiply(o.invert());
    this._nodes.forEach((g) => {
      var _;
      const c = g.getParent().getAbsoluteTransform(), m = g.getTransform().copy();
      m.translate(g.offsetX(), g.offsetY());
      const y = new X.Transform();
      y.multiply(c.copy().invert()).multiply(p).multiply(c).multiply(m);
      const S = y.decompose();
      g.setAttrs(S), (_ = g.getLayer()) === null || _ === void 0 || _.batchDraw();
    }), this.rotation(X.Util._getRotation(t.rotation)), this._nodes.forEach((g) => {
      this._fire("transform", { evt: e, target: g }), g._fire("transform", { evt: e, target: g });
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
    const i = e.width, n = e.height, r = this.enabledAnchors(), s = this.resizeEnabled(), o = this.padding(), l = this.anchorSize(), h = this.find("._anchor");
    h.forEach((p) => {
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
    const u = this.anchorStyleFunc();
    u && h.forEach((p) => {
      u(p);
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
    return this.getStage() && this._cursorChange && this.getStage().content && (this.getStage().content.style.cursor = ""), Ar.Group.prototype.destroy.call(this), this.detach(), this._removeEvents(), this;
  }
  toObject() {
    return kr.Node.prototype.toObject.call(this);
  }
  clone(t) {
    return kr.Node.prototype.clone.call(this, t);
  }
  getClientRect() {
    return this.nodes().length > 0 ? super.getClientRect() : { x: 0, y: 0, width: 0, height: 0 };
  }
}
Ri.Transformer = z;
z.isTransforming = () => kn > 0;
function Tl(a) {
  return a instanceof Array || X.Util.warn("enabledAnchors value should be an array"), a instanceof Array && a.forEach(function(t) {
    ai.indexOf(t) === -1 && X.Util.warn("Unknown anchor name: " + t + ". Available names are: " + ai.join(", "));
  }), a || [];
}
z.prototype.className = "Transformer";
(0, Sl._registerNode)(z);
Y.Factory.addGetterSetter(z, "enabledAnchors", ai, Tl);
Y.Factory.addGetterSetter(z, "flipEnabled", !0, (0, jt.getBooleanValidator)());
Y.Factory.addGetterSetter(z, "resizeEnabled", !0);
Y.Factory.addGetterSetter(z, "anchorSize", 10, (0, jt.getNumberValidator)());
Y.Factory.addGetterSetter(z, "rotateEnabled", !0);
Y.Factory.addGetterSetter(z, "rotateLineVisible", !0);
Y.Factory.addGetterSetter(z, "rotationSnaps", []);
Y.Factory.addGetterSetter(z, "rotateAnchorOffset", 50, (0, jt.getNumberValidator)());
Y.Factory.addGetterSetter(z, "rotateAnchorCursor", "crosshair");
Y.Factory.addGetterSetter(z, "rotationSnapTolerance", 5, (0, jt.getNumberValidator)());
Y.Factory.addGetterSetter(z, "borderEnabled", !0);
Y.Factory.addGetterSetter(z, "anchorStroke", "rgb(0, 161, 255)");
Y.Factory.addGetterSetter(z, "anchorStrokeWidth", 1, (0, jt.getNumberValidator)());
Y.Factory.addGetterSetter(z, "anchorFill", "white");
Y.Factory.addGetterSetter(z, "anchorCornerRadius", 0, (0, jt.getNumberValidator)());
Y.Factory.addGetterSetter(z, "borderStroke", "rgb(0, 161, 255)");
Y.Factory.addGetterSetter(z, "borderStrokeWidth", 1, (0, jt.getNumberValidator)());
Y.Factory.addGetterSetter(z, "borderDash");
Y.Factory.addGetterSetter(z, "keepRatio", !0);
Y.Factory.addGetterSetter(z, "shiftBehavior", "default");
Y.Factory.addGetterSetter(z, "centeredScaling", !1);
Y.Factory.addGetterSetter(z, "ignoreStroke", !1);
Y.Factory.addGetterSetter(z, "padding", 0, (0, jt.getNumberValidator)());
Y.Factory.addGetterSetter(z, "nodes");
Y.Factory.addGetterSetter(z, "node");
Y.Factory.addGetterSetter(z, "boundBoxFunc");
Y.Factory.addGetterSetter(z, "anchorDragBoundFunc");
Y.Factory.addGetterSetter(z, "anchorStyleFunc");
Y.Factory.addGetterSetter(z, "shouldOverdrawWholeArea", !1);
Y.Factory.addGetterSetter(z, "useSingleNodeRotation", !0);
Y.Factory.backCompat(z, {
  lineEnabled: "borderEnabled",
  rotateHandlerOffset: "rotateAnchorOffset",
  enabledHandlers: "enabledAnchors"
});
var $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
$i.Wedge = void 0;
const Fi = B, Rl = gt, $l = U, Ea = N, Fl = U;
class Ot extends Rl.Shape {
  _sceneFunc(t) {
    t.beginPath(), t.arc(0, 0, this.radius(), 0, $l.Konva.getAngle(this.angle()), this.clockwise()), t.lineTo(0, 0), t.closePath(), t.fillStrokeShape(this);
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
$i.Wedge = Ot;
Ot.prototype.className = "Wedge";
Ot.prototype._centroid = !0;
Ot.prototype._attrsAffectingSize = ["radius"];
(0, Fl._registerNode)(Ot);
Fi.Factory.addGetterSetter(Ot, "radius", 0, (0, Ea.getNumberValidator)());
Fi.Factory.addGetterSetter(Ot, "angle", 0, (0, Ea.getNumberValidator)());
Fi.Factory.addGetterSetter(Ot, "clockwise", !1);
Fi.Factory.backCompat(Ot, {
  angleDeg: "angle",
  getAngleDeg: "getAngle",
  setAngleDeg: "setAngle"
});
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.Blur = void 0;
const Er = B, Ol = it, Dl = N;
function Mr() {
  this.r = 0, this.g = 0, this.b = 0, this.a = 0, this.next = null;
}
const Ll = [
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
], Nl = [
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
function Il(a, t) {
  const e = a.data, i = a.width, n = a.height;
  let r, s, o, l, h, u, p, g, _, c, m, y, S, w, d, f, b, C, P, v;
  const E = t + t + 1, k = i - 1, M = n - 1, T = t + 1, A = T * (T + 1) / 2, F = new Mr(), $ = Ll[t], q = Nl[t];
  let K = null, L = F, j = null, G = null;
  for (let O = 1; O < E; O++)
    L = L.next = new Mr(), O === T && (K = L);
  L.next = F, o = s = 0;
  for (let O = 0; O < n; O++) {
    y = S = w = d = l = h = u = p = 0, g = T * (f = e[s]), _ = T * (b = e[s + 1]), c = T * (C = e[s + 2]), m = T * (P = e[s + 3]), l += A * f, h += A * b, u += A * C, p += A * P, L = F;
    for (let W = 0; W < T; W++)
      L.r = f, L.g = b, L.b = C, L.a = P, L = L.next;
    for (let W = 1; W < T; W++)
      r = s + ((k < W ? k : W) << 2), l += (L.r = f = e[r]) * (v = T - W), h += (L.g = b = e[r + 1]) * v, u += (L.b = C = e[r + 2]) * v, p += (L.a = P = e[r + 3]) * v, y += f, S += b, w += C, d += P, L = L.next;
    j = F, G = K;
    for (let W = 0; W < i; W++)
      e[s + 3] = P = p * $ >> q, P !== 0 ? (P = 255 / P, e[s] = (l * $ >> q) * P, e[s + 1] = (h * $ >> q) * P, e[s + 2] = (u * $ >> q) * P) : e[s] = e[s + 1] = e[s + 2] = 0, l -= g, h -= _, u -= c, p -= m, g -= j.r, _ -= j.g, c -= j.b, m -= j.a, r = o + ((r = W + t + 1) < k ? r : k) << 2, y += j.r = e[r], S += j.g = e[r + 1], w += j.b = e[r + 2], d += j.a = e[r + 3], l += y, h += S, u += w, p += d, j = j.next, g += f = G.r, _ += b = G.g, c += C = G.b, m += P = G.a, y -= f, S -= b, w -= C, d -= P, G = G.next, s += 4;
    o += i;
  }
  for (let O = 0; O < i; O++) {
    S = w = d = y = h = u = p = l = 0, s = O << 2, g = T * (f = e[s]), _ = T * (b = e[s + 1]), c = T * (C = e[s + 2]), m = T * (P = e[s + 3]), l += A * f, h += A * b, u += A * C, p += A * P, L = F;
    for (let nt = 0; nt < T; nt++)
      L.r = f, L.g = b, L.b = C, L.a = P, L = L.next;
    let W = i;
    for (let nt = 1; nt <= t; nt++)
      s = W + O << 2, l += (L.r = f = e[s]) * (v = T - nt), h += (L.g = b = e[s + 1]) * v, u += (L.b = C = e[s + 2]) * v, p += (L.a = P = e[s + 3]) * v, y += f, S += b, w += C, d += P, L = L.next, nt < M && (W += i);
    s = O, j = F, G = K;
    for (let nt = 0; nt < n; nt++)
      r = s << 2, e[r + 3] = P = p * $ >> q, P > 0 ? (P = 255 / P, e[r] = (l * $ >> q) * P, e[r + 1] = (h * $ >> q) * P, e[r + 2] = (u * $ >> q) * P) : e[r] = e[r + 1] = e[r + 2] = 0, l -= g, h -= _, u -= c, p -= m, g -= j.r, _ -= j.g, c -= j.b, m -= j.a, r = O + ((r = nt + T) < M ? r : M) * i << 2, l += y += j.r = e[r], h += S += j.g = e[r + 1], u += w += j.b = e[r + 2], p += d += j.a = e[r + 3], j = j.next, g += f = G.r, _ += b = G.g, c += C = G.b, m += P = G.a, y -= f, S -= b, w -= C, d -= P, G = G.next, s += i;
  }
}
const Gl = function(t) {
  const e = Math.round(this.blurRadius());
  e > 0 && Il(t, e);
};
Oi.Blur = Gl;
Er.Factory.addGetterSetter(Ol.Node, "blurRadius", 0, (0, Dl.getNumberValidator)(), Er.Factory.afterSetFilter);
var Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.Brighten = void 0;
const Tr = B, Ul = it, Bl = N, Vl = function(a) {
  const t = this.brightness() * 255, e = a.data, i = e.length;
  for (let n = 0; n < i; n += 4)
    e[n] += t, e[n + 1] += t, e[n + 2] += t;
};
Di.Brighten = Vl;
Tr.Factory.addGetterSetter(Ul.Node, "brightness", 0, (0, Bl.getNumberValidator)(), Tr.Factory.afterSetFilter);
var Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
Li.Contrast = void 0;
const Rr = B, Hl = it, zl = N, Wl = function(a) {
  const t = Math.pow((this.contrast() + 100) / 100, 2), e = a.data, i = e.length;
  let n = 150, r = 150, s = 150;
  for (let o = 0; o < i; o += 4)
    n = e[o], r = e[o + 1], s = e[o + 2], n /= 255, n -= 0.5, n *= t, n += 0.5, n *= 255, r /= 255, r -= 0.5, r *= t, r += 0.5, r *= 255, s /= 255, s -= 0.5, s *= t, s += 0.5, s *= 255, n = n < 0 ? 0 : n > 255 ? 255 : n, r = r < 0 ? 0 : r > 255 ? 255 : r, s = s < 0 ? 0 : s > 255 ? 255 : s, e[o] = n, e[o + 1] = r, e[o + 2] = s;
};
Li.Contrast = Wl;
Rr.Factory.addGetterSetter(Hl.Node, "contrast", 0, (0, zl.getNumberValidator)(), Rr.Factory.afterSetFilter);
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.Emboss = void 0;
const Ut = B, Ii = it, jl = rt, Ma = N, Yl = function(a) {
  const t = this.embossStrength() * 10, e = this.embossWhiteLevel() * 255, i = this.embossDirection(), n = this.embossBlend(), r = a.data, s = a.width, o = a.height, l = s * 4;
  let h = 0, u = 0, p = o;
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
      jl.Util.error("Unknown emboss direction: " + i);
  }
  do {
    const g = (p - 1) * l;
    let _ = h;
    p + _ < 1 && (_ = 0), p + _ > o && (_ = 0);
    const c = (p - 1 + _) * s * 4;
    let m = s;
    do {
      const y = g + (m - 1) * 4;
      let S = u;
      m + S < 1 && (S = 0), m + S > s && (S = 0);
      const w = c + (m - 1 + S) * 4, d = r[y] - r[w], f = r[y + 1] - r[w + 1], b = r[y + 2] - r[w + 2];
      let C = d;
      const P = C > 0 ? C : -C, v = f > 0 ? f : -f, E = b > 0 ? b : -b;
      if (v > P && (C = f), E > P && (C = b), C *= t, n) {
        const k = r[y] + C, M = r[y + 1] + C, T = r[y + 2] + C;
        r[y] = k > 255 ? 255 : k < 0 ? 0 : k, r[y + 1] = M > 255 ? 255 : M < 0 ? 0 : M, r[y + 2] = T > 255 ? 255 : T < 0 ? 0 : T;
      } else {
        let k = e - C;
        k < 0 ? k = 0 : k > 255 && (k = 255), r[y] = r[y + 1] = r[y + 2] = k;
      }
    } while (--m);
  } while (--p);
};
Ni.Emboss = Yl;
Ut.Factory.addGetterSetter(Ii.Node, "embossStrength", 0.5, (0, Ma.getNumberValidator)(), Ut.Factory.afterSetFilter);
Ut.Factory.addGetterSetter(Ii.Node, "embossWhiteLevel", 0.5, (0, Ma.getNumberValidator)(), Ut.Factory.afterSetFilter);
Ut.Factory.addGetterSetter(Ii.Node, "embossDirection", "top-left", void 0, Ut.Factory.afterSetFilter);
Ut.Factory.addGetterSetter(Ii.Node, "embossBlend", !1, void 0, Ut.Factory.afterSetFilter);
var Gi = {};
Object.defineProperty(Gi, "__esModule", { value: !0 });
Gi.Enhance = void 0;
const $r = B, Kl = it, Xl = N;
function _n(a, t, e, i, n) {
  const r = e - t, s = n - i;
  if (r === 0)
    return i + s / 2;
  if (s === 0)
    return i;
  let o = (a - t) / r;
  return o = s * o + i, o;
}
const ql = function(a) {
  const t = a.data, e = t.length;
  let i = t[0], n = i, r, s = t[1], o = s, l, h = t[2], u = h, p;
  const g = this.enhance();
  if (g === 0)
    return;
  for (let d = 0; d < e; d += 4)
    r = t[d + 0], r < i ? i = r : r > n && (n = r), l = t[d + 1], l < s ? s = l : l > o && (o = l), p = t[d + 2], p < h ? h = p : p > u && (u = p);
  n === i && (n = 255, i = 0), o === s && (o = 255, s = 0), u === h && (u = 255, h = 0);
  let _, c, m, y, S, w;
  if (g > 0)
    _ = n + g * (255 - n), c = i - g * (i - 0), m = o + g * (255 - o), y = s - g * (s - 0), S = u + g * (255 - u), w = h - g * (h - 0);
  else {
    const d = (n + i) * 0.5;
    _ = n + g * (n - d), c = i + g * (i - d);
    const f = (o + s) * 0.5;
    m = o + g * (o - f), y = s + g * (s - f);
    const b = (u + h) * 0.5;
    S = u + g * (u - b), w = h + g * (h - b);
  }
  for (let d = 0; d < e; d += 4)
    t[d + 0] = _n(t[d + 0], i, n, c, _), t[d + 1] = _n(t[d + 1], s, o, y, m), t[d + 2] = _n(t[d + 2], h, u, w, S);
};
Gi.Enhance = ql;
$r.Factory.addGetterSetter(Kl.Node, "enhance", 0, (0, Xl.getNumberValidator)(), $r.Factory.afterSetFilter);
var Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.Grayscale = void 0;
const Ql = function(a) {
  const t = a.data, e = t.length;
  for (let i = 0; i < e; i += 4) {
    const n = 0.34 * t[i] + 0.5 * t[i + 1] + 0.16 * t[i + 2];
    t[i] = n, t[i + 1] = n, t[i + 2] = n;
  }
};
Ui.Grayscale = Ql;
var Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.HSL = void 0;
const be = B, Vn = it, Hn = N;
be.Factory.addGetterSetter(Vn.Node, "hue", 0, (0, Hn.getNumberValidator)(), be.Factory.afterSetFilter);
be.Factory.addGetterSetter(Vn.Node, "saturation", 0, (0, Hn.getNumberValidator)(), be.Factory.afterSetFilter);
be.Factory.addGetterSetter(Vn.Node, "luminance", 0, (0, Hn.getNumberValidator)(), be.Factory.afterSetFilter);
const Jl = function(a) {
  const t = a.data, e = t.length, i = 1, n = Math.pow(2, this.saturation()), r = Math.abs(this.hue() + 360) % 360, s = this.luminance() * 127, o = i * n * Math.cos(r * Math.PI / 180), l = i * n * Math.sin(r * Math.PI / 180), h = 0.299 * i + 0.701 * o + 0.167 * l, u = 0.587 * i - 0.587 * o + 0.33 * l, p = 0.114 * i - 0.114 * o - 0.497 * l, g = 0.299 * i - 0.299 * o - 0.328 * l, _ = 0.587 * i + 0.413 * o + 0.035 * l, c = 0.114 * i - 0.114 * o + 0.293 * l, m = 0.299 * i - 0.3 * o + 1.25 * l, y = 0.587 * i - 0.586 * o - 1.05 * l, S = 0.114 * i + 0.886 * o - 0.2 * l;
  let w, d, f, b;
  for (let C = 0; C < e; C += 4)
    w = t[C + 0], d = t[C + 1], f = t[C + 2], b = t[C + 3], t[C + 0] = h * w + u * d + p * f + s, t[C + 1] = g * w + _ * d + c * f + s, t[C + 2] = m * w + y * d + S * f + s, t[C + 3] = b;
};
Bi.HSL = Jl;
var Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
Vi.HSV = void 0;
const ve = B, zn = it, Wn = N, Zl = function(a) {
  const t = a.data, e = t.length, i = Math.pow(2, this.value()), n = Math.pow(2, this.saturation()), r = Math.abs(this.hue() + 360) % 360, s = i * n * Math.cos(r * Math.PI / 180), o = i * n * Math.sin(r * Math.PI / 180), l = 0.299 * i + 0.701 * s + 0.167 * o, h = 0.587 * i - 0.587 * s + 0.33 * o, u = 0.114 * i - 0.114 * s - 0.497 * o, p = 0.299 * i - 0.299 * s - 0.328 * o, g = 0.587 * i + 0.413 * s + 0.035 * o, _ = 0.114 * i - 0.114 * s + 0.293 * o, c = 0.299 * i - 0.3 * s + 1.25 * o, m = 0.587 * i - 0.586 * s - 1.05 * o, y = 0.114 * i + 0.886 * s - 0.2 * o;
  for (let S = 0; S < e; S += 4) {
    const w = t[S + 0], d = t[S + 1], f = t[S + 2], b = t[S + 3];
    t[S + 0] = l * w + h * d + u * f, t[S + 1] = p * w + g * d + _ * f, t[S + 2] = c * w + m * d + y * f, t[S + 3] = b;
  }
};
Vi.HSV = Zl;
ve.Factory.addGetterSetter(zn.Node, "hue", 0, (0, Wn.getNumberValidator)(), ve.Factory.afterSetFilter);
ve.Factory.addGetterSetter(zn.Node, "saturation", 0, (0, Wn.getNumberValidator)(), ve.Factory.afterSetFilter);
ve.Factory.addGetterSetter(zn.Node, "value", 0, (0, Wn.getNumberValidator)(), ve.Factory.afterSetFilter);
var Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.Invert = void 0;
const th = function(a) {
  const t = a.data, e = t.length;
  for (let i = 0; i < e; i += 4)
    t[i] = 255 - t[i], t[i + 1] = 255 - t[i + 1], t[i + 2] = 255 - t[i + 2];
};
Hi.Invert = th;
var zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.Kaleidoscope = void 0;
const si = B, Ta = it, Fr = rt, Ra = N, eh = function(a, t, e) {
  const i = a.data, n = t.data, r = a.width, s = a.height, o = e.polarCenterX || r / 2, l = e.polarCenterY || s / 2;
  let h = Math.sqrt(o * o + l * l), u = r - o, p = s - l;
  const g = Math.sqrt(u * u + p * p);
  h = g > h ? g : h;
  const _ = s, c = r, m = 360 / c * Math.PI / 180;
  for (let y = 0; y < c; y += 1) {
    const S = Math.sin(y * m), w = Math.cos(y * m);
    for (let d = 0; d < _; d += 1) {
      u = Math.floor(o + h * d / _ * w), p = Math.floor(l + h * d / _ * S);
      let f = (p * r + u) * 4;
      const b = i[f + 0], C = i[f + 1], P = i[f + 2], v = i[f + 3];
      f = (y + d * r) * 4, n[f + 0] = b, n[f + 1] = C, n[f + 2] = P, n[f + 3] = v;
    }
  }
}, ih = function(a, t, e) {
  const i = a.data, n = t.data, r = a.width, s = a.height, o = e.polarCenterX || r / 2, l = e.polarCenterY || s / 2;
  let h = Math.sqrt(o * o + l * l), u = r - o, p = s - l;
  const g = Math.sqrt(u * u + p * p);
  h = g > h ? g : h;
  const _ = s, c = r, m = 0;
  let y, S;
  for (u = 0; u < r; u += 1)
    for (p = 0; p < s; p += 1) {
      const w = u - o, d = p - l, f = Math.sqrt(w * w + d * d) * _ / h;
      let b = (Math.atan2(d, w) * 180 / Math.PI + 360 + m) % 360;
      b = b * c / 360, y = Math.floor(b), S = Math.floor(f);
      let C = (S * r + y) * 4;
      const P = i[C + 0], v = i[C + 1], E = i[C + 2], k = i[C + 3];
      C = (p * r + u) * 4, n[C + 0] = P, n[C + 1] = v, n[C + 2] = E, n[C + 3] = k;
    }
}, nh = function(a) {
  const t = a.width, e = a.height;
  let i, n, r, s, o, l, h, u, p, g, _ = Math.round(this.kaleidoscopePower());
  const c = Math.round(this.kaleidoscopeAngle()), m = Math.floor(t * (c % 360) / 360);
  if (_ < 1)
    return;
  const y = Fr.Util.createCanvasElement();
  y.width = t, y.height = e;
  const S = y.getContext("2d").getImageData(0, 0, t, e);
  Fr.Util.releaseCanvas(y), eh(a, S, {
    polarCenterX: t / 2,
    polarCenterY: e / 2
  });
  let w = t / Math.pow(2, _);
  for (; w <= 8; )
    w = w * 2, _ -= 1;
  w = Math.ceil(w);
  let d = w, f = 0, b = d, C = 1;
  for (m + w > t && (f = d, b = 0, C = -1), n = 0; n < e; n += 1)
    for (i = f; i !== b; i += C)
      r = Math.round(i + m) % t, p = (t * n + r) * 4, o = S.data[p + 0], l = S.data[p + 1], h = S.data[p + 2], u = S.data[p + 3], g = (t * n + i) * 4, S.data[g + 0] = o, S.data[g + 1] = l, S.data[g + 2] = h, S.data[g + 3] = u;
  for (n = 0; n < e; n += 1)
    for (d = Math.floor(w), s = 0; s < _; s += 1) {
      for (i = 0; i < d + 1; i += 1)
        p = (t * n + i) * 4, o = S.data[p + 0], l = S.data[p + 1], h = S.data[p + 2], u = S.data[p + 3], g = (t * n + d * 2 - i - 1) * 4, S.data[g + 0] = o, S.data[g + 1] = l, S.data[g + 2] = h, S.data[g + 3] = u;
      d *= 2;
    }
  ih(S, a, {});
};
zi.Kaleidoscope = nh;
si.Factory.addGetterSetter(Ta.Node, "kaleidoscopePower", 2, (0, Ra.getNumberValidator)(), si.Factory.afterSetFilter);
si.Factory.addGetterSetter(Ta.Node, "kaleidoscopeAngle", 0, (0, Ra.getNumberValidator)(), si.Factory.afterSetFilter);
var Wi = {};
Object.defineProperty(Wi, "__esModule", { value: !0 });
Wi.Mask = void 0;
const Or = B, rh = it, ah = N;
function Qe(a, t, e) {
  let i = (e * a.width + t) * 4;
  const n = [];
  return n.push(a.data[i++], a.data[i++], a.data[i++], a.data[i++]), n;
}
function Fe(a, t) {
  return Math.sqrt(Math.pow(a[0] - t[0], 2) + Math.pow(a[1] - t[1], 2) + Math.pow(a[2] - t[2], 2));
}
function sh(a) {
  const t = [0, 0, 0];
  for (let e = 0; e < a.length; e++)
    t[0] += a[e][0], t[1] += a[e][1], t[2] += a[e][2];
  return t[0] /= a.length, t[1] /= a.length, t[2] /= a.length, t;
}
function oh(a, t) {
  const e = Qe(a, 0, 0), i = Qe(a, a.width - 1, 0), n = Qe(a, 0, a.height - 1), r = Qe(a, a.width - 1, a.height - 1), s = t || 10;
  if (Fe(e, i) < s && Fe(i, r) < s && Fe(r, n) < s && Fe(n, e) < s) {
    const o = sh([i, e, r, n]), l = [];
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
function lh(a, t) {
  for (let e = 0; e < a.width * a.height; e++)
    a.data[4 * e + 3] = t[e];
}
function hh(a, t, e) {
  const i = [1, 1, 1, 1, 0, 1, 1, 1, 1], n = Math.round(Math.sqrt(i.length)), r = Math.floor(n / 2), s = [];
  for (let o = 0; o < e; o++)
    for (let l = 0; l < t; l++) {
      const h = o * t + l;
      let u = 0;
      for (let p = 0; p < n; p++)
        for (let g = 0; g < n; g++) {
          const _ = o + p - r, c = l + g - r;
          if (_ >= 0 && _ < e && c >= 0 && c < t) {
            const m = _ * t + c, y = i[p * n + g];
            u += a[m] * y;
          }
        }
      s[h] = u === 255 * 8 ? 255 : 0;
    }
  return s;
}
function dh(a, t, e) {
  const i = [1, 1, 1, 1, 1, 1, 1, 1, 1], n = Math.round(Math.sqrt(i.length)), r = Math.floor(n / 2), s = [];
  for (let o = 0; o < e; o++)
    for (let l = 0; l < t; l++) {
      const h = o * t + l;
      let u = 0;
      for (let p = 0; p < n; p++)
        for (let g = 0; g < n; g++) {
          const _ = o + p - r, c = l + g - r;
          if (_ >= 0 && _ < e && c >= 0 && c < t) {
            const m = _ * t + c, y = i[p * n + g];
            u += a[m] * y;
          }
        }
      s[h] = u >= 255 * 4 ? 255 : 0;
    }
  return s;
}
function ch(a, t, e) {
  const i = [0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111], n = Math.round(Math.sqrt(i.length)), r = Math.floor(n / 2), s = [];
  for (let o = 0; o < e; o++)
    for (let l = 0; l < t; l++) {
      const h = o * t + l;
      let u = 0;
      for (let p = 0; p < n; p++)
        for (let g = 0; g < n; g++) {
          const _ = o + p - r, c = l + g - r;
          if (_ >= 0 && _ < e && c >= 0 && c < t) {
            const m = _ * t + c, y = i[p * n + g];
            u += a[m] * y;
          }
        }
      s[h] = u;
    }
  return s;
}
const uh = function(a) {
  const t = this.threshold();
  let e = oh(a, t);
  return e && (e = hh(e, a.width, a.height), e = dh(e, a.width, a.height), e = ch(e, a.width, a.height), lh(a, e)), a;
};
Wi.Mask = uh;
Or.Factory.addGetterSetter(rh.Node, "threshold", 0, (0, ah.getNumberValidator)(), Or.Factory.afterSetFilter);
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.Noise = void 0;
const Dr = B, fh = it, gh = N, ph = function(a) {
  const t = this.noise() * 255, e = a.data, i = e.length, n = t / 2;
  for (let r = 0; r < i; r += 4)
    e[r + 0] += n - 2 * n * Math.random(), e[r + 1] += n - 2 * n * Math.random(), e[r + 2] += n - 2 * n * Math.random();
};
ji.Noise = ph;
Dr.Factory.addGetterSetter(fh.Node, "noise", 0.2, (0, gh.getNumberValidator)(), Dr.Factory.afterSetFilter);
var Yi = {};
Object.defineProperty(Yi, "__esModule", { value: !0 });
Yi.Pixelate = void 0;
const Lr = B, _h = rt, mh = it, yh = N, bh = function(a) {
  let t = Math.ceil(this.pixelSize()), e = a.width, i = a.height, n = Math.ceil(e / t), r = Math.ceil(i / t), s = a.data;
  if (t <= 0) {
    _h.Util.error("pixelSize value can not be <= 0");
    return;
  }
  for (let o = 0; o < n; o += 1)
    for (let l = 0; l < r; l += 1) {
      let h = 0, u = 0, p = 0, g = 0;
      const _ = o * t, c = _ + t, m = l * t, y = m + t;
      let S = 0;
      for (let w = _; w < c; w += 1)
        if (!(w >= e))
          for (let d = m; d < y; d += 1) {
            if (d >= i)
              continue;
            const f = (e * d + w) * 4;
            h += s[f + 0], u += s[f + 1], p += s[f + 2], g += s[f + 3], S += 1;
          }
      h = h / S, u = u / S, p = p / S, g = g / S;
      for (let w = _; w < c; w += 1)
        if (!(w >= e))
          for (let d = m; d < y; d += 1) {
            if (d >= i)
              continue;
            const f = (e * d + w) * 4;
            s[f + 0] = h, s[f + 1] = u, s[f + 2] = p, s[f + 3] = g;
          }
    }
};
Yi.Pixelate = bh;
Lr.Factory.addGetterSetter(mh.Node, "pixelSize", 8, (0, yh.getNumberValidator)(), Lr.Factory.afterSetFilter);
var Ki = {};
Object.defineProperty(Ki, "__esModule", { value: !0 });
Ki.Posterize = void 0;
const Nr = B, vh = it, Sh = N, wh = function(a) {
  const t = Math.round(this.levels() * 254) + 1, e = a.data, i = e.length, n = 255 / t;
  for (let r = 0; r < i; r += 1)
    e[r] = Math.floor(e[r] / n) * n;
};
Ki.Posterize = wh;
Nr.Factory.addGetterSetter(vh.Node, "levels", 0.5, (0, Sh.getNumberValidator)(), Nr.Factory.afterSetFilter);
var Xi = {};
Object.defineProperty(Xi, "__esModule", { value: !0 });
Xi.RGB = void 0;
const oi = B, jn = it, Ch = N, xh = function(a) {
  const t = a.data, e = t.length, i = this.red(), n = this.green(), r = this.blue();
  for (let s = 0; s < e; s += 4) {
    const o = (0.34 * t[s] + 0.5 * t[s + 1] + 0.16 * t[s + 2]) / 255;
    t[s] = o * i, t[s + 1] = o * n, t[s + 2] = o * r, t[s + 3] = t[s + 3];
  }
};
Xi.RGB = xh;
oi.Factory.addGetterSetter(jn.Node, "red", 0, function(a) {
  return this._filterUpToDate = !1, a > 255 ? 255 : a < 0 ? 0 : Math.round(a);
});
oi.Factory.addGetterSetter(jn.Node, "green", 0, function(a) {
  return this._filterUpToDate = !1, a > 255 ? 255 : a < 0 ? 0 : Math.round(a);
});
oi.Factory.addGetterSetter(jn.Node, "blue", 0, Ch.RGBComponent, oi.Factory.afterSetFilter);
var qi = {};
Object.defineProperty(qi, "__esModule", { value: !0 });
qi.RGBA = void 0;
const Ue = B, Qi = it, kh = N, Ah = function(a) {
  const t = a.data, e = t.length, i = this.red(), n = this.green(), r = this.blue(), s = this.alpha();
  for (let o = 0; o < e; o += 4) {
    const l = 1 - s;
    t[o] = i * s + t[o] * l, t[o + 1] = n * s + t[o + 1] * l, t[o + 2] = r * s + t[o + 2] * l;
  }
};
qi.RGBA = Ah;
Ue.Factory.addGetterSetter(Qi.Node, "red", 0, function(a) {
  return this._filterUpToDate = !1, a > 255 ? 255 : a < 0 ? 0 : Math.round(a);
});
Ue.Factory.addGetterSetter(Qi.Node, "green", 0, function(a) {
  return this._filterUpToDate = !1, a > 255 ? 255 : a < 0 ? 0 : Math.round(a);
});
Ue.Factory.addGetterSetter(Qi.Node, "blue", 0, kh.RGBComponent, Ue.Factory.afterSetFilter);
Ue.Factory.addGetterSetter(Qi.Node, "alpha", 1, function(a) {
  return this._filterUpToDate = !1, a > 1 ? 1 : a < 0 ? 0 : a;
});
var Ji = {};
Object.defineProperty(Ji, "__esModule", { value: !0 });
Ji.Sepia = void 0;
const Ph = function(a) {
  const t = a.data, e = t.length;
  for (let i = 0; i < e; i += 4) {
    const n = t[i + 0], r = t[i + 1], s = t[i + 2];
    t[i + 0] = Math.min(255, n * 0.393 + r * 0.769 + s * 0.189), t[i + 1] = Math.min(255, n * 0.349 + r * 0.686 + s * 0.168), t[i + 2] = Math.min(255, n * 0.272 + r * 0.534 + s * 0.131);
  }
};
Ji.Sepia = Ph;
var Zi = {};
Object.defineProperty(Zi, "__esModule", { value: !0 });
Zi.Solarize = void 0;
const Eh = function(a) {
  const t = a.data, e = a.width, i = a.height, n = e * 4;
  let r = i;
  do {
    const s = (r - 1) * n;
    let o = e;
    do {
      const l = s + (o - 1) * 4;
      let h = t[l], u = t[l + 1], p = t[l + 2];
      h > 127 && (h = 255 - h), u > 127 && (u = 255 - u), p > 127 && (p = 255 - p), t[l] = h, t[l + 1] = u, t[l + 2] = p;
    } while (--o);
  } while (--r);
};
Zi.Solarize = Eh;
var tn = {};
Object.defineProperty(tn, "__esModule", { value: !0 });
tn.Threshold = void 0;
const Ir = B, Mh = it, Th = N, Rh = function(a) {
  const t = this.threshold() * 255, e = a.data, i = e.length;
  for (let n = 0; n < i; n += 1)
    e[n] = e[n] < t ? 0 : 255;
};
tn.Threshold = Rh;
Ir.Factory.addGetterSetter(Mh.Node, "threshold", 0.5, (0, Th.getNumberValidator)(), Ir.Factory.afterSetFilter);
Object.defineProperty(di, "__esModule", { value: !0 });
di.Konva = void 0;
const Gr = Qr, $h = pi, Fh = yi, Oh = Si, Dh = wi, Lh = Ci, Ur = ye, Nh = ze, Ih = Pe, Gh = je, Uh = Ai, Bh = Pi, Vh = Ei, Hh = Mi, zh = Me, Wh = Ti, jh = Ri, Yh = $i, Kh = Oi, Xh = Di, qh = Li, Qh = Ni, Jh = Gi, Zh = Ui, td = Bi, ed = Vi, id = Hi, nd = zi, rd = Wi, ad = ji, sd = Yi, od = Ki, ld = Xi, hd = qi, dd = Ji, cd = Zi, ud = tn;
di.Konva = Gr.Konva.Util._assign(Gr.Konva, {
  Arc: $h.Arc,
  Arrow: Fh.Arrow,
  Circle: Oh.Circle,
  Ellipse: Dh.Ellipse,
  Image: Lh.Image,
  Label: Ur.Label,
  Tag: Ur.Tag,
  Line: Nh.Line,
  Path: Ih.Path,
  Rect: Gh.Rect,
  RegularPolygon: Uh.RegularPolygon,
  Ring: Bh.Ring,
  Sprite: Vh.Sprite,
  Star: Hh.Star,
  Text: zh.Text,
  TextPath: Wh.TextPath,
  Transformer: jh.Transformer,
  Wedge: Yh.Wedge,
  Filters: {
    Blur: Kh.Blur,
    Brighten: Xh.Brighten,
    Contrast: qh.Contrast,
    Emboss: Qh.Emboss,
    Enhance: Jh.Enhance,
    Grayscale: Zh.Grayscale,
    HSL: td.HSL,
    HSV: ed.HSV,
    Invert: id.Invert,
    Kaleidoscope: nd.Kaleidoscope,
    Mask: rd.Mask,
    Noise: ad.Noise,
    Pixelate: sd.Pixelate,
    Posterize: od.Posterize,
    RGB: ld.RGB,
    RGBA: hd.RGBA,
    Sepia: dd.Sepia,
    Solarize: cd.Solarize,
    Threshold: ud.Threshold
  }
});
var fd = Rn.exports;
Object.defineProperty(fd, "__esModule", { value: !0 });
const gd = di;
Rn.exports = gd.Konva;
var pd = Rn.exports;
const st = /* @__PURE__ */ us(pd), $a = ["unavailable", "unknown"];
function Yn(a) {
  return a.split(".", 1)[0] ?? "";
}
function _d(a, t, e) {
  const i = t == null ? void 0 : t.attributes.friendly_name;
  return typeof i == "string" && i.trim() ? i : e != null && e.name ? e.name : a.entity_id;
}
function Fa(a, t, e) {
  return a.label_mode === "off" ? "" : a.label_mode === "short" ? a.entity_id.split(".").at(-1) ?? a.entity_id : _d(a, t, e);
}
function Oa(a, t) {
  var n;
  if (!a) return "";
  if (!t || $a.includes(t.state)) return "Unavailable";
  const e = a.source === "attr" && a.attr ? t.attributes[a.attr] : t.state;
  if (e == null || e === "")
    return "Unavailable";
  const i = String(e);
  return (n = a.format) != null && n.includes("{value}") ? a.format.split("{value}").join(i) : i;
}
function Br(a, t, e = "primary") {
  return Oa(a.bind[e], t);
}
function li(a, t) {
  return a != null && a.entity_id ? Oa(a, t[a.entity_id]) : "";
}
function Da(a, t) {
  return (a ?? []).filter((e) => {
    var i;
    return ((i = t[e.entity_id]) == null ? void 0 : i.state) === e.when.state_is;
  });
}
function md(a, t) {
  if (!t) return !0;
  const { domains: e, tags: i, area_ids: n } = t.filters ?? {};
  return !(e != null && e.length && !e.includes(Yn(a.entity_id)) || i != null && i.length && !i.some((r) => a.tags.includes(r)) || n != null && n.length && (!a.area_id || !n.includes(a.area_id)));
}
function La(a) {
  return !a || $a.includes(a.state) ? "#9e9e9e" : ["on", "open", "playing", "home", "heat"].includes(a.state) ? "#ffb300" : "#1976d2";
}
function yd(a) {
  const t = {
    binary_sensor: "B",
    climate: "T",
    device_tracker: "N",
    light: "L",
    media_player: "M",
    sensor: "S",
    switch: "P"
  }, e = Yn(a);
  return t[e] ?? e.slice(0, 1).toUpperCase() ?? "?";
}
function bd(a) {
  const t = Yn(a);
  return t === "climate" ? ["heating"] : t === "device_tracker" ? ["network"] : [];
}
const Vr = {
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
  "dialog.importMessage": "Import {plans} plan(s) and {views} view(s)?",
  "dialog.import": "Import"
}, vd = {
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
  "editor.title": "Grundriss bearbeiten",
  "editor.quickActions": "Zum Plan hinzufügen",
  "editor.selectHint": "Wähle einen Bereich oder Marker im Plan, um seine Eigenschaften zu bearbeiten.",
  "editor.filters": "Entitäten filtern",
  "editor.entities": "Entitäten",
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
  "dialog.importMessage": "{plans} Plan/Pläne und {views} Ansicht(en) importieren?",
  "dialog.import": "Importieren"
};
function Sd(a) {
  const t = a != null && a.toLowerCase().startsWith("de") ? vd : Vr;
  return (e, i = {}) => {
    let n = t[e] ?? Vr[e] ?? String(e);
    for (const [r, s] of Object.entries(i))
      n = n.split(`{${r}}`).join(String(s));
    return n;
  };
}
function wd(a) {
  return structuredClone(a);
}
function Na(a) {
  var e;
  const t = wd(a);
  for (const i of Array.isArray(t.plans) ? t.plans : [])
    (e = i == null ? void 0 : i.background) != null && e.asset_id && delete i.background.url;
  return t;
}
async function Cd(a) {
  return a.callWS({
    type: "floorplan_ui/get_config"
  });
}
async function xd(a, t, e) {
  return (await a.callWS({
    type: "floorplan_ui/save_config",
    base_revision: e,
    config: Na(t)
  })).revision;
}
async function Ia(a, t) {
  try {
    return (await a.callWS({
      type: "floorplan_ui/validate_config",
      config: Na(t)
    })).config;
  } catch (e) {
    throw e && typeof e == "object" && "message" in e && typeof e.message == "string" ? e instanceof Error ? e : Object.assign(new Error(e.message), e) : e;
  }
}
async function kd(a) {
  return a.callWS({
    type: "floorplan_ui/list_registry"
  });
}
function Ad(a) {
  var e;
  if (!a || typeof a != "object")
    return;
  const t = a;
  return typeof t.code == "string" ? t.code : typeof ((e = t.error) == null ? void 0 : e.code) == "string" ? t.error.code : void 0;
}
const Ga = 4e6, Pd = 128e6, Ua = "/api/floorplan_ui/assets";
function Ba(a) {
  return structuredClone(a);
}
function Ed(a) {
  return new Promise((t, e) => {
    const i = new FileReader();
    i.onload = () => t(String(i.result)), i.onerror = () => e(i.error ?? new Error("The image could not be read.")), i.readAsDataURL(a);
  });
}
function Md(a) {
  return fetch(a).then((t) => {
    if (!t.ok)
      throw new Error("An embedded image could not be decoded.");
    return t.blob();
  });
}
async function Va(a, t) {
  if (!["image/png", "image/jpeg"].includes(t.type))
    throw new Error("Only PNG and JPEG floorplans are supported.");
  if (t.size > Ga)
    throw new Error("The floorplan image must not exceed 4 MB.");
  const e = await a.fetchWithAuth(Ua, {
    method: "POST",
    headers: { "Content-Type": t.type },
    body: t
  });
  let i;
  try {
    i = await e.json();
  } catch {
    throw new Error("Image upload failed. The server returned an invalid response.");
  }
  if (!i || typeof i != "object" || Array.isArray(i))
    throw new Error("Image upload failed. The server returned an invalid response.");
  if (!e.ok)
    throw new Error(
      "error" in i && typeof i.error == "string" && i.error ? i.error : "Image upload failed."
    );
  if (!("asset_id" in i) || typeof i.asset_id != "string" || !/^[0-9a-f]{64}$/.test(i.asset_id) || !("content_type" in i) || i.content_type !== "image/png" && i.content_type !== "image/jpeg" || !("url" in i) || typeof i.url != "string" || !i.url)
    throw new Error("Image upload failed. The server returned an invalid response.");
  return { asset_id: i.asset_id, content_type: i.content_type, url: i.url };
}
async function Ha(a, t) {
  const e = t.asset_id ? await a.fetchWithAuth(`${Ua}/${encodeURIComponent(t.asset_id)}`) : await fetch(t.url ?? "");
  if (!e.ok) throw new Error("The floorplan image could not be loaded.");
  return e.blob();
}
async function Td(a, t) {
  const e = Ba(t), i = /* @__PURE__ */ new Map();
  for (const n of e.plans) {
    const r = n.background;
    if (!r.asset_id)
      continue;
    let s = i.get(r.asset_id);
    s || (s = await Ed(await Ha(a, r)), i.set(r.asset_id, s)), r.url = s, delete r.asset_id, delete r.content_type;
  }
  return e;
}
async function Rd(a, t) {
  const e = Ba(t), i = /* @__PURE__ */ new Map();
  for (const s of Array.isArray(e.plans) ? e.plans : []) {
    const o = s == null ? void 0 : s.background;
    typeof (o == null ? void 0 : o.url) == "string" && o.url.startsWith("data:") && (i.set(s.plan_id, o.url), delete o.url, delete o.asset_id, delete o.content_type);
  }
  const n = await Ia(a, e), r = /* @__PURE__ */ new Map();
  for (const s of n.plans) {
    const o = s.background, l = i.get(s.plan_id);
    if (!o || !l)
      continue;
    let h = r.get(l);
    h || (h = await Va(a, await Md(l)), r.set(l, h)), s.background = {
      type: "image",
      asset_id: h.asset_id,
      content_type: h.content_type,
      url: h.url,
      width: o.width,
      height: o.height
    };
  }
  return n;
}
class $d {
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
class Fd {
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
function Od(a, t) {
  const e = a.getBoundingClientRect(), i = new st.Stage({
    container: a,
    width: e.width || 400,
    height: e.height || 300,
    draggable: !0
  }), n = new st.Layer({ listening: !1 }), r = new st.Layer(), s = new st.Layer();
  i.add(n), i.add(r), i.add(s), i.on("click tap", (c) => {
    var m;
    t.isEditing() && c.target === i && !((m = c.evt) != null && m.defaultPrevented) && t.onEmptyCanvasClick();
  }), i.on("wheel", (c) => {
    c.evt.preventDefault();
    const m = i.getPointerPosition();
    if (!m || c.evt.deltaY === 0) return;
    const y = i.scaleX(), S = {
      x: (m.x - i.x()) / y,
      y: (m.y - i.y()) / y
    }, { minZoom: w, maxZoom: d } = t.getZoomLimits(), f = c.evt.deltaY > 0 ? y / 1.1 : y * 1.1, b = Math.max(w, Math.min(d, f));
    i.scale({ x: b, y: b }), i.position({
      x: m.x - S.x * b,
      y: m.y - S.y * b
    });
  });
  let o = !1, l = null, h = 0;
  const u = (c) => {
    const m = c.touches[0], y = c.touches[1];
    if (!o && !y) return;
    if (c.preventDefault(), c.stopPropagation(), !m || !y) {
      l = null;
      return;
    }
    o || (o = !0, i.draggable(!1));
    const S = i.getContent().getBoundingClientRect(), w = { x: m.clientX - S.left, y: m.clientY - S.top }, d = { x: y.clientX - S.left, y: y.clientY - S.top }, f = {
      x: (w.x + d.x) / 2,
      y: (w.y + d.y) / 2
    }, b = Math.hypot(d.x - w.x, d.y - w.y);
    if (!l || h === 0) {
      l = f, h = b;
      return;
    }
    const C = i.scaleX(), P = {
      x: (l.x - i.x()) / C,
      y: (l.y - i.y()) / C
    }, { minZoom: v, maxZoom: E } = t.getZoomLimits(), k = C * (b / h), M = Math.max(v, Math.min(E, k));
    i.scale({ x: M, y: M }), i.position({
      x: f.x - P.x * M,
      y: f.y - P.y * M
    }), l = f, h = b;
  }, p = (c) => {
    o && (c.preventDefault(), l = null, c.touches.length === 0 && (o = !1, i.draggable(!0)));
  }, g = { capture: !0, passive: !1 };
  a.addEventListener("touchstart", u, g), a.addEventListener("touchmove", u, g), a.addEventListener("touchend", p, g), a.addEventListener("touchcancel", p, g);
  const _ = new ResizeObserver(([c]) => {
    if (!c) return;
    const { width: m, height: y } = c.contentRect;
    m > 0 && y > 0 && (i.position({
      x: i.x() + (m - i.width()) / 2,
      y: i.y() + (y - i.height()) / 2
    }), i.size({ width: m, height: y }));
  });
  return _.observe(a), {
    stage: i,
    backgroundLayer: n,
    areasLayer: r,
    markersLayer: s,
    destroy: () => {
      a.removeEventListener("touchstart", u, g), a.removeEventListener("touchmove", u, g), a.removeEventListener("touchend", p, g), a.removeEventListener("touchcancel", p, g), _.disconnect(), i.destroy();
    }
  };
}
function Dd(a, t, e, i = { minZoom: 0.1, maxZoom: 5 }) {
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
function Ld(a) {
  return a.getAbsoluteTransform().copy().invert().point({
    x: a.width() / 2,
    y: a.height() / 2
  });
}
function Nd(a, t) {
  const e = a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "view";
  let i = e, n = 2;
  for (; t.some((r) => r.id === i); )
    i = `${e}-${n++}`;
  return { id: i, name: a, filters: {} };
}
function Je(a, t, e) {
  return {
    ...a,
    views: a.views.map((i) => i.id === t ? e(i) : i)
  };
}
function Id(a, t, e) {
  const i = a.views.findIndex((s) => s.id === t), n = i + e;
  if (i < 0 || n < 0 || n >= a.views.length)
    return null;
  const r = [...a.views];
  return [r[i], r[n]] = [r[n], r[i]], { ...a, views: r };
}
function Gd(a, t) {
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
function Ud(a, t, e) {
  return {
    ...a,
    plans: a.plans.map(
      (i) => i.plan_id === t ? { ...i, markers: [...i.markers, e] } : i
    )
  };
}
function Bd(a, t, e, i) {
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
function Vd(a, t, e) {
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
function Hd(a, t, e) {
  return {
    plan_id: a,
    name: t.replace(/\.[^.]+$/, ""),
    background: e,
    areas: [],
    markers: [],
    view: { minZoom: 0.1, maxZoom: 5 }
  };
}
function zd(a, t) {
  return {
    ...a,
    plans: [...a.plans, t]
  };
}
function Wd(a, t, e) {
  return {
    ...a,
    plans: a.plans.map((i) => i.plan_id === t ? { ...i, name: e } : i)
  };
}
function jd(a, t, e) {
  const i = e.width / t.background.width, n = e.height / t.background.height, r = {
    ...t,
    background: e,
    markers: t.markers.map((s) => ({
      ...s,
      pos: { x: s.pos.x * i, y: s.pos.y * n }
    })),
    areas: t.areas.map((s) => {
      const o = s.shape;
      return {
        ...s,
        shape: o.type === "rect" ? {
          ...o,
          x: o.x * i,
          y: o.y * n,
          width: o.width * i,
          height: o.height * n
        } : {
          ...o,
          x: (o.x ?? 0) * i,
          y: (o.y ?? 0) * n,
          points: o.points.map((l, h) => l * (h % 2 ? n : i))
        }
      };
    })
  };
  return {
    ...a,
    plans: a.plans.map(
      (s) => s.plan_id === t.plan_id ? r : s
    )
  };
}
function Yd(a, t) {
  var i;
  const e = a.plans.filter((n) => n.plan_id !== t);
  return e.length === a.plans.length ? null : {
    config: { ...a, plans: e },
    nextPlanId: ((i = e[0]) == null ? void 0 : i.plan_id) ?? null
  };
}
function Kd(a, t, e) {
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
function Xd(a, t, e) {
  return {
    ...a,
    plans: a.plans.map(
      (i) => i.plan_id === t ? { ...i, areas: [...i.areas, e] } : i
    )
  };
}
function An(a, t, e, i) {
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
function qd(a, t, e, i) {
  return An(a, t, e, (n) => {
    if (n.shape.type === "rect") {
      const { x: l, y: h, width: u, height: p } = i;
      return {
        ...n,
        shape: {
          ...n.shape,
          ...l === void 0 ? {} : { x: l },
          ...h === void 0 ? {} : { y: h },
          ...u === void 0 ? {} : { width: u },
          ...p === void 0 ? {} : { height: p }
        }
      };
    }
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
function Qd(a, t, e) {
  return {
    ...a,
    plans: a.plans.map(
      (i) => i.plan_id === t ? { ...i, areas: i.areas.filter((n) => n.id !== e) } : i
    )
  };
}
function Jd(a) {
  var s;
  const { layer: t, plan: e, shapes: i } = a;
  if (t.destroyChildren(), i.clear(), !e) return;
  for (const o of e.areas ?? []) {
    if (!Zd(o, a.view)) continue;
    const l = tc(o, a.editMode);
    l && (l.on("click tap", (h) => {
      var u;
      h.cancelBubble = !0, a.editMode && !((u = h.evt) != null && u.defaultPrevented) && a.onSelect(o.id);
    }), l.on("dragend", () => {
      if (!a.editMode) return;
      const h = l.position();
      a.onUpdateShape(o.id, { x: h.x, y: h.y }), a.onRerender();
    }), t.add(l), i.set(o.id, l), ec(t, o, l, a.view, a.states, a.areas));
  }
  if (!a.editMode || !a.selectedAreaId) return;
  const n = i.get(a.selectedAreaId), r = (s = e.areas) == null ? void 0 : s.find((o) => o.id === a.selectedAreaId);
  (r == null ? void 0 : r.shape.type) === "polygon" && n instanceof st.Line ? ic(t, r, n, a) : (r == null ? void 0 : r.shape.type) === "rect" && n instanceof st.Rect && nc(t, r.id, n, a);
}
function Zd(a, t) {
  var n, r;
  const e = (n = t == null ? void 0 : t.filters) == null ? void 0 : n.area_ids;
  if (e != null && e.length && (!a.area_id || !e.includes(a.area_id)))
    return !1;
  const i = (r = t == null ? void 0 : t.filters) == null ? void 0 : r.tags;
  return !(i != null && i.length) || i.some((s) => a.tags.includes(s));
}
function tc(a, t) {
  var n;
  const { shape: e, style: i } = a;
  return e.type === "polygon" && (((n = e.points) == null ? void 0 : n.length) ?? 0) >= 6 ? new st.Line({
    x: e.x ?? 0,
    y: e.y ?? 0,
    points: e.points,
    closed: !0,
    fill: i.fill ?? "#2196f3",
    stroke: i.stroke ?? "#1976d2",
    strokeWidth: i.strokeWidth ?? 2,
    opacity: i.fillOpacity ?? 0.4,
    draggable: t
  }) : e.type === "rect" ? new st.Rect({
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
function ec(a, t, e, i, n, r) {
  var g, _, c, m;
  const s = [], o = (g = r.find((y) => y.id === t.area_id)) == null ? void 0 : g.name;
  t.area_id && s.push(o ?? t.area_id);
  const l = li((_ = i == null ? void 0 : i.area_overlay) == null ? void 0 : _.primary, n), h = li((c = i == null ? void 0 : i.area_overlay) == null ? void 0 : c.secondary, n);
  l && s.push(l), h && s.push(h);
  for (const y of Da((m = i == null ? void 0 : i.area_overlay) == null ? void 0 : m.badges, n))
    s.push(`${y.icon ? `${y.icon} ` : ""}${y.label ?? y.entity_id}`);
  if (!s.length) return;
  const u = e.getClientRect({ relativeTo: a }), p = new st.Label({
    x: u.x + 8,
    y: u.y + 8,
    listening: !1
  });
  p.add(
    new st.Tag({
      fill: "rgba(255,255,255,0.88)",
      cornerRadius: 4,
      shadowColor: "rgba(0,0,0,0.25)",
      shadowBlur: 3
    }),
    new st.Text({
      text: s.join(`
`),
      fontSize: 13,
      fontStyle: "bold",
      fill: "#0d47a1",
      padding: 5,
      lineHeight: 1.2
    })
  ), a.add(p);
}
function ic(a, t, e, i) {
  if (t.shape.type !== "polygon") return;
  const n = [...t.shape.points], r = t.shape.x ?? 0, s = t.shape.y ?? 0;
  for (let o = 0; o < n.length; o += 2) {
    const l = new st.Circle({
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
function nc(a, t, e, i) {
  const n = Math.min(20, e.width()), r = Math.min(20, e.height()), s = new st.Transformer({
    nodes: [e],
    rotateEnabled: !1,
    keepRatio: !1,
    flipEnabled: !1,
    ignoreStroke: !0,
    anchorSize: 9,
    boundBoxFunc: (o, l) => {
      const h = a.getAbsoluteScale();
      return l.width < n * h.x || l.height < r * h.y ? o : l;
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
function rc(a) {
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
function ac(a) {
  const { layer: t, plan: e, groups: i } = a;
  if (t.destroyChildren(), i.clear(), !e) return;
  const n = new Map(a.entities.map((r) => [r.entity_id, r]));
  for (const r of e.markers ?? []) {
    if (!md(r, a.view)) continue;
    const s = a.states[r.entity_id], o = n.get(r.entity_id), l = sc(r, s, o, a);
    l.on("click tap", (h) => {
      var u;
      h.cancelBubble = !0, !((u = h.evt) != null && u.defaultPrevented) && (a.editMode ? a.onSelect(r.id) : a.onActivate(r));
    }), l.on("dragend", () => {
      a.editMode && a.onMove(r.id, l.position());
    }), l.on("mouseenter", () => {
      a.stage && (a.stage.container().style.cursor = "pointer");
    }), l.on("mouseleave", () => {
      a.stage && (a.stage.container().style.cursor = "default");
    }), t.add(l), i.set(r.id, l);
  }
  t.batchDraw();
}
function sc(a, t, e, i) {
  const n = new st.Group({
    x: a.pos.x,
    y: a.pos.y,
    draggable: i.editMode
  });
  return n.add(
    new st.Circle({
      name: "marker-dot",
      radius: 19,
      fill: La(t),
      stroke: "#ffffff",
      strokeWidth: i.selectedMarkerId === a.id ? 4 : 2,
      shadowColor: "#000000",
      shadowBlur: 5,
      shadowOpacity: 0.25
    }),
    new st.Text({
      x: -10,
      y: -10,
      width: 20,
      align: "center",
      text: yd(a.entity_id),
      fill: "#ffffff",
      fontSize: 16,
      fontStyle: "bold",
      listening: !1
    }),
    new st.Text({
      name: "marker-label",
      x: 26,
      y: -17,
      text: a.label_mode === "off" ? "" : Fa(a, t, e),
      fill: "#212121",
      fontSize: 13,
      fontStyle: "bold",
      padding: 2,
      listening: !1
    }),
    new st.Text({
      name: "marker-value",
      x: 26,
      y: 1,
      text: za(a, t, i.view, i.states),
      fill: "#424242",
      fontSize: 12,
      padding: 2,
      listening: !1
    })
  ), n;
}
function oc(a) {
  const t = new Map(a.entities.map((e) => [e.entity_id, e]));
  for (const e of a.plan.markers ?? []) {
    const i = a.groups.get(e.id);
    if (!i) continue;
    const n = a.states[e.entity_id], r = i.findOne(".marker-dot"), s = i.findOne(".marker-value"), o = i.findOne(".marker-label");
    r == null || r.fill(La(n)), s == null || s.text(za(e, n, a.view, a.states)), o == null || o.text(
      e.label_mode === "off" ? "" : Fa(e, n, t.get(e.entity_id))
    );
  }
  a.layer.batchDraw();
}
function za(a, t, e, i) {
  const n = e == null ? void 0 : e.marker_overlay, r = [
    n != null && n.primary ? li(n.primary, i) : Br(a, t),
    n != null && n.secondary ? li(n.secondary, i) : Br(a, t, "secondary")
  ].filter(Boolean).join(" · "), s = Da(n == null ? void 0 : n.badges, i).map(
    (o) => `${o.icon ? `${o.icon} ` : ""}${o.label ?? o.entity_id}`
  );
  return [r, ...s].filter(Boolean).join(`
`);
}
function lc(a, t, e) {
  a.add(
    new st.Rect({
      x: 0,
      y: 0,
      width: t,
      height: e,
      fill: "#fff3e0"
    })
  );
  const i = new st.Text({
    x: t / 2,
    y: e / 2 - 10,
    text: "Failed to load floorplan image",
    fontSize: 18,
    fontStyle: "bold",
    fill: "#e65100"
  });
  i.offsetX(i.width() / 2), a.add(i);
  const n = new st.Text({
    x: t / 2,
    y: e / 2 + 20,
    text: "Try re-uploading the image in Edit mode.",
    fontSize: 14,
    fill: "#e65100"
  });
  n.offsetX(n.width() / 2), a.add(n);
}
const hc = jr`
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

  .narrow .workspace.editing {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(300px, 50svh) minmax(260px, 45svh);
    align-content: start;
    overflow-y: auto;
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
    .workspace.editing {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: minmax(300px, 50svh) minmax(260px, 45svh);
      align-content: start;
      overflow-y: auto;
    }

    .editor-panel {
      border-inline-start: 0;
      border-top: 1px solid var(--divider-color, #d7d7d7);
    }

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

    .editor-add-row {
      grid-template-columns: minmax(0, 1fr);
    }
  }
`;
function dc(a, t, e) {
  var l, h, u, p, g, _, c, m, y, S, w, d, f, b, C, P, v, E, k, M, T;
  const { currentPlan: i, currentView: n, currentViewId: r, selectedArea: s, selectedMarker: o } = a;
  return V`
    <aside class="editor-panel" aria-label=${e("editor.title")}>
      <header class="editor-panel-header">
        <span>${e("editor.title")}</span>
        <strong>${(i == null ? void 0 : i.name) ?? e("panel.selectPlan")}</strong>
      </header>

      ${s ? cc(s, a.areas, t, e) : ""}
      ${o ? uc(o, a.areas, t, e) : ""}
      ${!s && !o && i ? V`<p class="editor-selection-hint">${e("editor.selectHint")}</p>` : ""}

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
        </div>
        <details class="entity-filters">
          <summary>${e("editor.filters")}</summary>
          <div class="editor-fields">
            <label>
              ${e("editor.domain")}
              <select
                .value=${a.entityDomainFilter}
                @change=${(A) => t.setEntityDomainFilter(A.target.value)}
              >
                <option value="">${e("editor.allDomains")}</option>
                ${a.entityDomains.map(
    (A) => V`<option value=${A}>${A}</option>`
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
                ${a.areas.map((A) => V`<option value=${A.id}>${A.name}</option>`)}
              </select>
            </label>
          </div>
        </details>
        <div class="editor-add-row">
          <select
            aria-label=${e("editor.selectEntity", { count: a.entityCount })}
            .value=${a.entityToAdd}
            @change=${(A) => t.setEntityToAdd(A.target.value)}
          >
            <option value="">${e("editor.selectEntity", { count: a.entityCount })}</option>
            ${a.entityOptions.map(
    (A) => V`
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
    (A) => V`
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
          <button type="button" @click=${() => t.moveView(1)}>
            ${e("editor.nextView")} →
          </button>
          <button type="button" @click=${t.setDefaultView}>${e("editor.setDefault")}</button>
          <button type="button" ?disabled=${r === "all"} @click=${t.deleteView}>
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
            <h3>${e("editor.viewFilters", { name: (n == null ? void 0 : n.name) ?? r })}</h3>
            <div class="editor-fields">
              <label>
                ${e("editor.domains")}
                <input
                  .value=${((l = n == null ? void 0 : n.filters.domains) == null ? void 0 : l.join(", ")) ?? ""}
                  @change=${(A) => t.updateViewFilter("domains", A)}
                  placeholder="light, switch"
                />
              </label>
              <label>
                ${e("editor.tags")}
                <input
                  .value=${((h = n == null ? void 0 : n.filters.tags) == null ? void 0 : h.join(", ")) ?? ""}
                  @change=${(A) => t.updateViewFilter("tags", A)}
                  placeholder="heating"
                />
              </label>
              <label>
                ${e("editor.areaIds")}
                <input
                  .value=${((u = n == null ? void 0 : n.filters.area_ids) == null ? void 0 : u.join(", ")) ?? ""}
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
                  .value=${((g = (p = n == null ? void 0 : n.area_overlay) == null ? void 0 : p.primary) == null ? void 0 : g.entity_id) ?? ""}
                  @change=${(A) => t.updateAreaOverlay("primary", "entity_id", A)}
                  placeholder="sensor.living_room_temperature"
                />
              </label>
              <label>
                ${e("editor.source")}
                <select
                  .value=${((c = (_ = n == null ? void 0 : n.area_overlay) == null ? void 0 : _.primary) == null ? void 0 : c.source) ?? "state"}
                  @change=${(A) => t.updateAreaOverlay("primary", "source", A)}
                >
                  <option value="state">${e("editor.state")}</option>
                  <option value="attr">${e("editor.attributeOption")}</option>
                </select>
              </label>
              <label>
                ${e("editor.attribute")}
                <input
                  .value=${((y = (m = n == null ? void 0 : n.area_overlay) == null ? void 0 : m.primary) == null ? void 0 : y.attr) ?? ""}
                  @change=${(A) => t.updateAreaOverlay("primary", "attr", A)}
                />
              </label>
              <label>
                ${e("editor.format")}
                <input
                  .value=${((w = (S = n == null ? void 0 : n.area_overlay) == null ? void 0 : S.primary) == null ? void 0 : w.format) ?? ""}
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
                  .value=${((f = (d = n == null ? void 0 : n.area_overlay) == null ? void 0 : d.secondary) == null ? void 0 : f.entity_id) ?? ""}
                  @change=${(A) => t.updateAreaOverlay("secondary", "entity_id", A)}
                />
              </label>
              <label>
                ${e("editor.source")}
                <select
                  .value=${((C = (b = n == null ? void 0 : n.area_overlay) == null ? void 0 : b.secondary) == null ? void 0 : C.source) ?? "state"}
                  @change=${(A) => t.updateAreaOverlay("secondary", "source", A)}
                >
                  <option value="state">${e("editor.state")}</option>
                  <option value="attr">${e("editor.attributeOption")}</option>
                </select>
              </label>
              <label>
                ${e("editor.attribute")}
                <input
                  .value=${((v = (P = n == null ? void 0 : n.area_overlay) == null ? void 0 : P.secondary) == null ? void 0 : v.attr) ?? ""}
                  @change=${(A) => t.updateAreaOverlay("secondary", "attr", A)}
                />
              </label>
              <label>
                ${e("editor.format")}
                <input
                  .value=${((k = (E = n == null ? void 0 : n.area_overlay) == null ? void 0 : E.secondary) == null ? void 0 : k.format) ?? ""}
                  @change=${(A) => t.updateAreaOverlay("secondary", "format", A)}
                />
              </label>
              <label class="editor-field-wide">
                ${e("editor.badges")}
                <input
                  class="grow"
                  .value=${((T = (M = n == null ? void 0 : n.area_overlay) == null ? void 0 : M.badges) == null ? void 0 : T.map(
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
function cc(a, t, e, i) {
  return V`
    <section class="editor-card editor-selection">
      <h2>${i("editor.selectedArea")}</h2>
      <strong class="editor-selection-name">${a.id}</strong>
      <div class="editor-fields">
        <label>
          ${i("editor.haArea")}
          <select @change=${e.bindArea} .value=${a.area_id ?? ""}>
            <option value="">${i("editor.unbound")}</option>
            ${t.map(
    (n) => V`<option value=${n.id}>${n.name}</option>`
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
            @change=${(n) => e.updateAreaStyle("fill", n)}
          />
        </label>
        <label>
          ${i("editor.stroke")}
          <input
            type="color"
            .value=${a.style.stroke ?? "#1976d2"}
            @change=${(n) => e.updateAreaStyle("stroke", n)}
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
            @change=${(n) => e.updateAreaStyle("fillOpacity", n)}
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
            @change=${(n) => e.updateAreaStyle("strokeWidth", n)}
          />
        </label>
        <button class="editor-danger editor-field-wide" type="button" @click=${e.deleteArea}>
          ${i("editor.deleteArea")}
        </button>
      </div>
    </section>
  `;
}
function uc(a, t, e, i) {
  var n;
  return V`
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
            ${t.map((r) => V`<option value=${r.id}>${r.name}</option>`)}
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
          ${i("editor.markerAction")}
          <select .value=${((n = a.action) == null ? void 0 : n.tap) ?? "more-info"} @change=${e.updateMarkerAction}>
            <option value="more-info">${i("editor.actionDetails")}</option>
            <option value="toggle">${i("editor.actionToggle")}</option>
            <option value="none">${i("editor.actionNone")}</option>
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
        ${a.bind.secondary ? V`
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
            ` : V`
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
var fc = Object.defineProperty, Kn = (a, t, e, i) => {
  for (var n = void 0, r = a.length - 1, s; r >= 0; r--)
    (s = a[r]) && (n = s(t, e, n) || n);
  return n && fc(t, e, n), n;
};
const Xn = class Xn extends pe {
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
        ${t.message ? V`<p>${t.message}</p>` : dt}
        ${t.kind === "text" ? V`
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
      </dialog>
    ` : dt;
  }
};
Xn.styles = jr`
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
let Se = Xn;
Kn([
  we({ attribute: !1 })
], Se.prototype, "dialog");
Kn([
  we()
], Se.prototype, "cancelLabel");
Kn([
  ct()
], Se.prototype, "_value");
customElements.get("floorplan-dialog") || customElements.define("floorplan-dialog", Se);
var gc = Object.defineProperty, at = (a, t, e, i) => {
  for (var n = void 0, r = a.length - 1, s; r >= 0; r--)
    (s = a[r]) && (n = s(t, e, n) || n);
  return n && gc(t, e, n), n;
};
const pc = 500, Hr = 6, _c = 250, qn = class qn extends pe {
  constructor() {
    super(...arguments), this.narrow = !1, this._config = null, this._loading = !0, this._loadFailed = !1, this._editMode = !1, this._currentView = "all", this._currentPlanId = null, this._selectedAreaId = null, this._selectedMarkerId = null, this._haAreas = [], this._haEntities = [], this._entityToAdd = "", this._entitySearch = "", this._entityDomainFilter = "", this._entityAreaFilter = "", this._notice = "", this._error = "", this._saveState = "idle", this._saveDirty = !1, this._saveConflict = !1, this._dialog = null, this._stage = null, this._backgroundLayer = null, this._areasLayer = null, this._markersLayer = null, this._stageController = null, this._areaShapes = /* @__PURE__ */ new Map(), this._markerGroups = /* @__PURE__ */ new Map(), this._renderGeneration = 0, this._liveRefreshTimer = null, this._entityPointerDrag = null, this._replacePlanId = null, this._history = new Fd(), this._dialogResolver = null, this._saveQueue = new $d(
      (t, e) => xd(this.hass, t, e),
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
    return Sd((t = this.hass) == null ? void 0 : t.language);
  }
  async connectedCallback() {
    super.connectedCallback(), window.addEventListener("beforeunload", this._beforeUnload), window.addEventListener("pointermove", this._entityPointerMove, { passive: !1 }), window.addEventListener("pointerup", this._entityPointerUp), window.addEventListener("pointercancel", this._entityPointerCancel), await this._loadConfig(), this._canEdit && await this._loadRegistry();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("beforeunload", this._beforeUnload), window.removeEventListener("pointermove", this._entityPointerMove), window.removeEventListener("pointerup", this._entityPointerUp), window.removeEventListener("pointercancel", this._entityPointerCancel), this._finishEntityPointerDrag(), this._resolveDialog(null), this._liveRefreshTimer !== null && (window.clearTimeout(this._liveRefreshTimer), this._liveRefreshTimer = null), this._destroyStage();
  }
  async _loadConfig() {
    var t;
    this._destroyStage(), this._loading = !0, this._loadFailed = !1;
    try {
      this._config = await Cd(this.hass), this._saveQueue.reset(this._config.revision), this._history.reset(), this._saveConflict = !1, this._error = "", this._notice = "", this._selectedAreaId = null, this._selectedMarkerId = null, this._currentPlanId = ((t = this._config.plans[0]) == null ? void 0 : t.plan_id) ?? null, this._config.default_view && this._config.views.some((e) => {
        var i;
        return e.id === ((i = this._config) == null ? void 0 : i.default_view);
      }) && (this._currentView = this._config.default_view), this._reconcileSelection();
    } catch {
      this._config = null, this._loadFailed = !0, this._saveQueue.reset(0), this._history.reset(), this._setError(this._t("panel.loadError"));
    }
    this._loading = !1;
  }
  async saveConfig() {
    return !this._config || !this._canEdit ? !1 : this._saveQueue.enqueue(this._config);
  }
  _commitConfig(t, e = !0) {
    return this._canEdit ? (e && this._config && this._history.record(this._config), this._config = t, this._reconcileSelection(), this._saveQueue.enqueue(t)) : Promise.resolve(!1);
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
      if (Ad(t.error) === "config_conflict") {
        this._saveConflict = !0, this._setError(this._t("panel.conflict"));
        return;
      }
      this._saveConflict = !1, this._setError(this._t("panel.saveFailed"));
    }
  }
  updated(t) {
    t.has("_loading") && !this._loading && !this._stage && this.isConnected && this._initializeStage(), t.has("_currentPlanId") && this._stage && (this._selectedAreaId = null, this._selectedMarkerId = null, this._renderFloorplan()), t.has("_currentView") && this._stage && (this._renderAreas(this._getCurrentPlan()), this._renderMarkers(this._getCurrentPlan())), t.has("hass") && (!this._canEdit && this._editMode && (this._editMode = !1, this._selectedAreaId = null, this._selectedMarkerId = null, this._renderAreas(this._getCurrentPlan()), this._renderMarkers(this._getCurrentPlan()), this._syncCanvasInteractivity()), this._scheduleLiveRefresh());
  }
  _scheduleLiveRefresh() {
    this._liveRefreshTimer === null && (this._liveRefreshTimer = window.setTimeout(() => {
      this._liveRefreshTimer = null, this._refreshMarkerLiveValues(), this._editMode || this._renderAreas(this._getCurrentPlan());
    }, pc));
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
      var n;
      (n = this.renderRoot.querySelector(".dialog input")) == null || n.focus();
    }), new Promise((n) => {
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
    await this._askConfirm(this._t("dialog.reloadMessage"), this._t("dialog.reload"), !0) && (await this._loadConfig(), this._renderFloorplan());
  }
  _initializeStage() {
    const t = this.renderRoot.querySelector(".canvas-wrapper");
    if (!t) {
      this._setError(this._t("panel.canvasInitError"));
      return;
    }
    this._stageController = Od(t, {
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
    var t;
    return ((t = this._config) == null ? void 0 : t.plans.find((e) => e.plan_id === this._currentPlanId)) ?? null;
  }
  _reconcileSelection() {
    var t, e;
    this._config && (this._config.plans.some((i) => i.plan_id === this._currentPlanId) || (this._currentPlanId = ((t = this._config.plans[0]) == null ? void 0 : t.plan_id) ?? null, this._selectedAreaId = null, this._selectedMarkerId = null), this._config.views.some((i) => i.id === this._currentView) || (this._currentView = this._config.default_view ?? ((e = this._config.views[0]) == null ? void 0 : e.id) ?? "all"));
  }
  _renderFloorplan() {
    var r, s, o, l, h, u;
    if (!this._stage || !this._backgroundLayer) return;
    const t = ++this._renderGeneration;
    this._backgroundLayer.destroyChildren(), (r = this._areasLayer) == null || r.destroyChildren(), (s = this._markersLayer) == null || s.destroyChildren(), this._areaShapes.clear(), this._markerGroups.clear();
    const e = this._getCurrentPlan(), i = this._stage.width(), n = this._stage.height();
    if (e && ((o = e.background) != null && o.asset_id || (l = e.background) != null && l.url)) {
      this._renderAreas(e), this._renderMarkers(e);
      const p = new Image();
      let g;
      p.onload = () => {
        if (g && URL.revokeObjectURL(g), t !== this._renderGeneration || e.plan_id !== this._currentPlanId)
          return;
        const c = new st.Image({
          x: 0,
          y: 0,
          image: p,
          width: e.background.width || p.width,
          height: e.background.height || p.height
        });
        this._backgroundLayer.add(c);
        try {
          this._backgroundLayer.batchDraw(), this._fitToScreen(c.width(), c.height());
        } catch {
          this._backgroundLayer.destroyChildren(), this._drawImageErrorState(i, n), this._setError(this._t("panel.imageRenderError"));
        }
      };
      const _ = () => {
        g && URL.revokeObjectURL(g), t === this._renderGeneration && (this._backgroundLayer.destroyChildren(), this._drawImageErrorState(i, n), this._setError(this._t("panel.imageLoadError")));
      };
      p.onerror = _, Ha(this.hass, e.background).then((c) => {
        t === this._renderGeneration && (g = URL.createObjectURL(c), p.src = g);
      }).catch(_);
    } else e && (this._renderAreas(e), this._renderMarkers(e));
    this._backgroundLayer.batchDraw(), (h = this._areasLayer) == null || h.batchDraw(), (u = this._markersLayer) == null || u.batchDraw();
  }
  _fitToScreen(t, e) {
    var i;
    this._stage && Dd(this._stage, t, e, (i = this._getCurrentPlan()) == null ? void 0 : i.view);
  }
  _fitCurrentPlan() {
    const t = this._getCurrentPlan();
    t && this._fitToScreen(t.background.width, t.background.height);
  }
  _toggleEditMode() {
    this._canEdit && (this._editMode = !this._editMode, this._editMode || (this._finishEntityPointerDrag(), this._selectedAreaId = null, this._selectedMarkerId = null), this._renderAreas(this._getCurrentPlan()), this._renderMarkers(this._getCurrentPlan()), this._syncCanvasInteractivity());
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
    const i = await this._askText(this._t("dialog.renamePlan"), e.name);
    if (!i) return;
    const n = i.trim();
    !n || n === e.name || this._commitConfig(Wd(this._config, t, n));
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
    const e = Yd(this._config, t);
    e && (this._commitConfig(e.config), this._currentPlanId = e.nextPlanId, this._renderFloorplan());
  }
  _renderAreas(t) {
    this._areasLayer && (Jd({
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
    rc({
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
  _drawImageErrorState(t, e) {
    this._backgroundLayer && lc(this._backgroundLayer, t, e);
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
    const i = this._newId("area"), n = Kd(i, t, this._getVisibleCanvasCenter());
    this._commitConfig(Xd(this._config, e.plan_id, n)), this._selectedAreaId = i, this._selectedMarkerId = null, this._renderAreas(this._getCurrentPlan());
  }
  _updateAreaShape(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._getCurrentPlan();
    i && this._commitConfig(qd(this._config, i.plan_id, t, e));
  }
  async _loadRegistry() {
    if (!this._canEdit) return;
    const t = /* @__PURE__ */ new Map();
    for (const e of Object.values(this.hass.states)) {
      const { friendly_name: i, icon: n } = e.attributes;
      t.set(e.entity_id, {
        entity_id: e.entity_id,
        name: typeof i == "string" ? i : null,
        icon: typeof n == "string" ? n : null,
        domain: e.entity_id.split(".", 1)[0],
        area_id: null,
        device_id: null
      });
    }
    try {
      const e = await kd(this.hass);
      this._haAreas = e.areas;
      for (const i of e.entities) {
        const n = t.get(i.entity_id);
        t.set(i.entity_id, {
          ...i,
          name: i.name ?? (n == null ? void 0 : n.name) ?? null,
          icon: i.icon ?? (n == null ? void 0 : n.icon) ?? null
        });
      }
    } catch {
      this._haAreas = [], this._setError(this._t("panel.registryLoadError"));
    }
    this._haEntities = [...t.values()].sort(
      (e, i) => e.entity_id.localeCompare(i.entity_id)
    );
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
    const t = this._selectedAreaId, e = this._getCurrentPlan();
    e && await this._askConfirm(
      this._t("dialog.deleteAreaMessage"),
      this._t("editor.deleteArea"),
      !0
    ) && (this._commitConfig(Qd(this._config, e.plan_id, t)), this._selectedAreaId = null, this._renderFloorplan());
  }
  _renderMarkers(t) {
    this._markersLayer && ac({
      layer: this._markersLayer,
      stage: this._stage,
      plan: t,
      view: this._getCurrentView(),
      states: this.hass.states,
      entities: this._haEntities,
      editMode: this._editMode,
      selectedMarkerId: this._selectedMarkerId,
      groups: this._markerGroups,
      onSelect: (e) => this._selectCanvasObject("marker", e),
      onActivate: (e) => void this._activateMarker(e),
      onMove: (e, i) => this._updateMarker(e, { pos: i })
    });
  }
  _refreshMarkerLiveValues() {
    const t = this._getCurrentPlan();
    !t || !this._markersLayer || oc({
      layer: this._markersLayer,
      plan: t,
      view: this._getCurrentView(),
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
      icon: (n == null ? void 0 : n.icon) ?? "mdi:circle",
      label_mode: "auto",
      tags: bd(t),
      bind: { primary: { source: "state" } }
    };
    this._commitConfig(Ud(this._config, i.plan_id, r)), this._selectedMarkerId = r.id, this._selectedAreaId = null, this._entityToAdd = "", this._renderMarkers(this._getCurrentPlan());
  }
  _onCanvasDragOver(t) {
    !this._editMode || !this._getCurrentPlan() || (t.preventDefault(), t.dataTransfer && (t.dataTransfer.dropEffect = "copy"), t.currentTarget.classList.add("drag-target"));
  }
  _onCanvasDragLeave(t) {
    t.currentTarget.classList.remove("drag-target");
  }
  _onCanvasDrop(t) {
    var n, r;
    t.preventDefault();
    const e = t.currentTarget;
    if (e.classList.remove("drag-target"), !this._editMode || !this._stage) return;
    const i = ((n = t.dataTransfer) == null ? void 0 : n.getData("application/x-floorplan-entity")) || ((r = t.dataTransfer) == null ? void 0 : r.getData("text/plain"));
    i && this._addMarkerAtClientPoint(i, t.clientX, t.clientY, e);
  }
  _onEntityDragStart(t, e) {
    e.dataTransfer && (this._finishEntityPointerDrag(), e.dataTransfer.setData("application/x-floorplan-entity", t), e.dataTransfer.setData("text/plain", t), e.dataTransfer.effectAllowed = "copy");
  }
  _onEntityPointerDown(t, e) {
    if (!this._editMode || !this._getCurrentPlan() || !e.isPrimary || e.button !== 0)
      return;
    this._finishEntityPointerDrag();
    const i = e.currentTarget, n = i.closest(".entity-palette");
    if (this._entityPointerDrag = {
      entityId: t,
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      target: i,
      palette: n,
      startX: e.clientX,
      startY: e.clientY,
      startScrollTop: (n == null ? void 0 : n.scrollTop) ?? 0,
      ready: e.pointerType !== "touch",
      scrolling: !1,
      holdTimer: null,
      active: !1
    }, e.pointerType === "touch") {
      const r = e.pointerId;
      this._entityPointerDrag.holdTimer = window.setTimeout(() => {
        const s = this._entityPointerDrag;
        (s == null ? void 0 : s.pointerId) === r && !s.scrolling && (s.ready = !0);
      }, _c);
    }
    try {
      i.setPointerCapture(e.pointerId);
    } catch {
    }
  }
  _onEntityPointerMove(t) {
    const e = this._entityPointerDrag;
    if (!e || e.pointerId !== t.pointerId) return;
    const i = t.clientX - e.startX, n = t.clientY - e.startY, r = Math.hypot(i, n);
    if (e.pointerType === "touch" && !e.ready) {
      t.preventDefault(), r >= Hr && (e.scrolling = !0, e.holdTimer !== null && (window.clearTimeout(e.holdTimer), e.holdTimer = null), e.palette && (e.palette.scrollTop = e.startScrollTop - n));
      return;
    }
    if (!e.active && r >= Hr && (e.active = !0), !e.active) return;
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
    const i = this._canvasContainer(), n = e.active && this._clientPointIsInside(i, t.clientX, t.clientY);
    this._finishEntityPointerDrag(), n && i && this._addMarkerAtClientPoint(e.entityId, t.clientX, t.clientY, i);
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
    const n = t.getBoundingClientRect();
    return e >= n.left && e <= n.right && i >= n.top && i <= n.bottom;
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
  _addMarkerAtClientPoint(t, e, i, n) {
    if (!this._stage) return;
    const r = n.getBoundingClientRect(), s = this._stage.getAbsoluteTransform().copy().invert();
    this._addMarkerAt(
      t,
      s.point({ x: e - r.left, y: i - r.top })
    );
  }
  _updateMarker(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._getCurrentPlan();
    i && this._commitConfig(Bd(this._config, i.plan_id, t, e));
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
  _onMarkerActionChange(t) {
    const e = this._getSelectedMarker(), i = t.target.value;
    !e || i !== "more-info" && i !== "toggle" && i !== "none" || this._updateMarker(e.id, { action: { ...e.action, tap: i } });
  }
  _updateMarkerBinding(t, e, i) {
    const n = this._getSelectedMarker();
    if (!n) return;
    const r = i.target.value, s = n.bind[t] ?? { source: "state" }, o = {
      ...s,
      [e]: e === "source" ? r : r || void 0,
      ...e === "source" && r === "attr" && !s.attr ? { attr: "friendly_name" } : {},
      ...e === "attr" && s.source === "attr" && !r ? { attr: "friendly_name" } : {}
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
    const t = this._selectedMarkerId, e = this._getCurrentPlan();
    !e || !await this._askConfirm(
      this._t("dialog.deleteMarkerMessage"),
      this._t("editor.deleteMarker"),
      !0
    ) || (this._commitConfig(Vd(this._config, e.plan_id, t)), this._selectedMarkerId = null, this._renderMarkers(this._getCurrentPlan()));
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
      Je(this._config, t.id, (n) => ({ ...n, name: e }))
    );
  }
  _moveCurrentView(t) {
    if (!this._canEdit || !this._config) return;
    const e = Id(this._config, this._currentView, t);
    e && this._commitConfig(e);
  }
  _setDefaultView() {
    var t;
    !this._canEdit || !this._config || (this._commitConfig({ ...this._config, default_view: this._currentView }), this._setNotice(
      this._t("panel.defaultView", { name: ((t = this._getCurrentView()) == null ? void 0 : t.name) ?? this._currentView })
    ));
  }
  async _deleteCurrentView() {
    if (!this._canEdit || !this._config || this._currentView === "all" || this._config.views.length <= 1)
      return;
    const t = this._currentView;
    if (!await this._askConfirm(
      this._t("dialog.deleteViewMessage"),
      this._t("editor.deleteView"),
      !0
    ))
      return;
    const e = Gd(this._config, t);
    e && (this._commitConfig(e.config), this._currentView = e.nextViewId);
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
        const s = { ...r.area_overlay };
        if (e === "entity_id" && !n)
          delete s[t];
        else {
          const o = s[t] ?? {
            mode: "entity",
            entity_id: n,
            source: "state"
          };
          if (e !== "entity_id" && !o.entity_id) return r;
          s[t] = {
            ...o,
            [e]: e === "source" ? n : n || void 0,
            ...e === "source" && n === "attr" && !o.attr ? { attr: "friendly_name" } : {},
            ...e === "attr" && o.source === "attr" && !n ? { attr: "friendly_name" } : {}
          };
        }
        return { ...r, area_overlay: s };
      })
    ), this._renderAreas(this._getCurrentPlan());
  }
  _updateAreaBadges(t) {
    if (!this._canEdit || !this._config) return;
    const i = t.target.value.split(",").map((n) => n.trim()).filter(Boolean).flatMap((n) => {
      const [r, s] = n.split(":", 2), [o, l] = r.split("=", 2).map((u) => u.trim());
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
    const s = this._getCurrentPlan();
    !this._config || !s || (this._commitConfig({
      ...this._config,
      plans: this._config.plans.map(
        (o) => o.plan_id === s.plan_id ? {
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
        const t = await Td(this.hass, this._config), e = new Blob([JSON.stringify(t)], {
          type: "application/json"
        }), i = URL.createObjectURL(e), n = document.createElement("a");
        n.href = i, n.download = `floorplan-ui-config-v${this._config.version}.json`, n.click(), URL.revokeObjectURL(i), this._setNotice(this._t("panel.exported"));
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
    var n, r, s;
    if (!this._canEdit) return;
    const e = t.target, i = (n = e.files) == null ? void 0 : n[0];
    if (e.value = "", !!i) {
      if (i.size > Pd) {
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
        const p = await Rd(this.hass, o), g = await Ia(this.hass, p);
        if (this._currentPlanId = ((r = g.plans[0]) == null ? void 0 : r.plan_id) ?? null, this._currentView = g.views.some((c) => c.id === g.default_view) ? g.default_view ?? "all" : ((s = g.views[0]) == null ? void 0 : s.id) ?? "all", this._selectedAreaId = null, this._selectedMarkerId = null, !await this._commitConfig(g)) return;
        this._renderFloorplan(), this._setNotice(this._t("panel.imported"));
      } catch (o) {
        const l = o instanceof Error ? o.message : this._t("panel.invalidConfig");
        this._setError(this._t("panel.importFailed", { message: l }));
      }
    }
  }
  async _handleFileUpload(t) {
    var s;
    if (!this._canEdit) return;
    const e = this._replacePlanId;
    this._replacePlanId = null;
    const i = t.target, n = (s = i.files) == null ? void 0 : s[0];
    if (i.value = "", !n) return;
    if (!["image/png", "image/jpeg"].includes(n.type)) {
      this._setError(this._t("panel.imageTypeError"));
      return;
    }
    if (n.size > Ga) {
      this._setError(this._t("panel.imageTooLarge"));
      return;
    }
    let r = null;
    try {
      const o = await Va(this.hass, n);
      r = await createImageBitmap(n);
      const l = {
        type: "image",
        asset_id: o.asset_id,
        content_type: o.content_type,
        url: o.url,
        width: r.width,
        height: r.height
      };
      if (e) {
        const h = this._config, u = h == null ? void 0 : h.plans.find((g) => g.plan_id === e);
        if (!h || !u || !this._canEdit) return;
        const p = this._commitConfig(jd(h, u, l));
        this._currentPlanId === e && this._renderFloorplan(), await p;
      } else
        this._createNewPlan(n.name, l);
    } catch (o) {
      const l = o instanceof Error ? o.message : this._t("panel.imageUploadFailed");
      this._setError(l);
    } finally {
      r == null || r.close();
    }
  }
  _createNewPlan(t, e) {
    if (!this._canEdit || !this._config) return;
    const i = this._newId("plan");
    this._commitConfig(zd(this._config, Hd(i, t, e))), this._currentPlanId = i, this._renderFloorplan();
  }
  _triggerFileUpload(t = null) {
    var e;
    this._canEdit && (this._replacePlanId = t, (e = this.renderRoot.querySelector(".file-input")) == null || e.click());
  }
  _getVisibleCanvasCenter() {
    return this._stage ? Ld(this._stage) : { x: 0, y: 0 };
  }
  _newId(t) {
    const e = crypto.getRandomValues(new Uint32Array(4)), i = Array.from(e, (n) => n.toString(16).padStart(8, "0")).join("");
    return `${t}_${i}`;
  }
  _renderEditor(t, e, i, n) {
    const r = this._entitySearch.trim().toLowerCase(), s = [...new Set(this._haEntities.map((l) => l.domain))].sort(), o = this._haEntities.filter((l) => {
      var g;
      const h = !r || l.entity_id.toLowerCase().includes(r) || !!((g = l.name) != null && g.toLowerCase().includes(r)), u = !this._entityDomainFilter || l.domain === this._entityDomainFilter, p = !this._entityAreaFilter || l.area_id === this._entityAreaFilter;
      return h && u && p;
    }).slice(0, 250);
    return dc(
      {
        currentPlan: t,
        currentView: e,
        currentViewId: this._currentView,
        selectedArea: i,
        selectedMarker: n,
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
        replaceImage: () => this._triggerFileUpload(t == null ? void 0 : t.plan_id),
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
        updateMarkerAction: (l) => this._onMarkerActionChange(l),
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
    ], e = (h = this._config) != null && h.views.length ? this._config.views : t, i = ((u = this._config) == null ? void 0 : u.plans) ?? [], n = this._getCurrentPlan(), r = this._getCurrentView(), s = this._getSelectedArea(), o = this._getSelectedMarker(), l = this._t;
    return V`
      <div class="container ${this.narrow ? "narrow" : ""}">
        <div class="toolbar">
          <div class="toolbar-left">
            <h1>${l("panel.title")}</h1>
            ${n ? V`<label class="plan-select">
                  <span>${l("panel.plan")}</span>
                  <select @change=${this._selectPlan}>
                    ${i.map(
      (p) => V`
                        <option
                          value=${p.plan_id}
                          ?selected=${(n == null ? void 0 : n.plan_id) === p.plan_id}
                        >
                          ${p.name}
                        </option>
                      `
    )}
                  </select>
                </label>` : ""}
          </div>
          <div class="toolbar-right">
            ${this._canEdit && this._config ? V`
                  <button
                    class="edit-toggle ${this._editMode ? "active" : ""}"
                    aria-pressed=${this._editMode ? "true" : "false"}
                    @click=${this._toggleEditMode}
                  >
                    ${this._editMode ? l("panel.done") : l("panel.edit")}
                  </button>
                ` : this._canEdit ? "" : V`<span class="viewer-note">${l("panel.viewOnly")}</span>`}
          </div>
        </div>
        ${n ? V`<nav class="views-bar" aria-label=${l("panel.views")}>
              <div class="view-tabs">
                ${e.map(
      (p) => {
        var g;
        return V`
                    <button
                      class="view-tab ${this._currentView === p.id ? "active" : ""}"
                      type="button"
                      aria-pressed=${this._currentView === p.id ? "true" : "false"}
                      @click=${() => this._setView(p.id)}
                    >
                      ${p.id === ((g = this._config) == null ? void 0 : g.default_view) ? "★ " : ""}${p.name}
                    </button>
                  `;
      }
    )}
              </div>
            </nav>` : ""}
        <div class="workspace ${this._editMode ? "editing" : ""}">
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
            ${this._loading ? V`<div class="loading" role="status">${l("panel.loading")}</div>` : V`<div class="canvas-wrapper"></div>`}
            <div class="panel-feedback">
              ${this._saveState === "pending" ? V`<div class="status" role="status" aria-live="polite">
                    ${l("panel.pending")}
                  </div>` : ""}
              ${this._saveState === "saving" ? V`<div class="status" role="status" aria-live="polite">
                    ${l("panel.saving")}
                  </div>` : ""}
              ${this._notice ? V`<div class="status" role="status" aria-live="polite">${this._notice}</div>` : ""}
              ${this._error ? V`
                    <div class="status error" role="alert">
                      ${this._error}
                      ${this._loadFailed ? V`<button type="button" @click=${this._loadConfig}>
                            ${l("panel.retry")}
                          </button>` : this._saveState === "failed" ? this._saveConflict ? V`
                                <button type="button" @click=${this._reloadAfterConflict}>
                                  ${l("panel.reload")}
                                </button>
                              ` : V`<button type="button" @click=${this._retrySave}>
                                ${l("panel.retry")}
                              </button>` : ""}
                    </div>
                  ` : ""}
            </div>
            ${n && !this._loading ? V`<button class="canvas-fit" type="button" @click=${this._fitCurrentPlan}>
                  ${l("panel.fit")}
                </button>` : ""}
            ${!this._loading && !this._loadFailed && !n ? V`<div class="empty-state">
                  <h2>${l("panel.emptyTitle")}</h2>
                  <p>${this._canEdit ? l("panel.emptyDescription") : l("panel.emptyViewer")}</p>
                  ${this._canEdit ? V`<button
                          class="upload-btn"
                          type="button"
                          @click=${() => this._triggerFileUpload()}
                        >
                          ${l("panel.upload")}
                        </button>
                        <button
                          class="import-btn"
                          type="button"
                          @click=${this._triggerConfigImport}
                        >
                          ${l("editor.import")}
                        </button>` : ""}
                </div>` : ""}
            <section class="canvas-accessibility" aria-label=${l("panel.objects")}>
              <ul>
                ${n == null ? void 0 : n.areas.map(
      (p) => V`
                    <li>
                      ${this._editMode ? V`<button
                            type="button"
                            aria-pressed=${this._selectedAreaId === p.id ? "true" : "false"}
                            @click=${() => this._selectCanvasObject("area", p.id)}
                          >
                            ${l("panel.areaObject", { id: p.id })}
                          </button>` : l("panel.areaObject", { id: p.id })}
                    </li>
                  `
    )}
                ${n == null ? void 0 : n.markers.map(
      (p) => V`
                    <li>
                      <button
                        type="button"
                        aria-pressed=${this._editMode && this._selectedMarkerId === p.id ? "true" : "false"}
                        @click=${() => this._editMode ? this._selectCanvasObject("marker", p.id) : this._activateMarker(p)}
                      >
                        ${l("panel.markerObject", { entity: p.entity_id })}
                      </button>
                    </li>
                  `
    )}
              </ul>
            </section>
          </div>
          ${this._editMode && this._config ? this._renderEditor(n, r, s, o) : ""}
        </div>
        <floorplan-dialog
          .dialog=${this._dialog}
          .cancelLabel=${l("dialog.cancel")}
          @floorplan-dialog-resolve=${(p) => this._resolveDialog(p.detail)}
        ></floorplan-dialog>
      </div>
    `;
  }
};
qn.styles = hc;
let Z = qn;
at([
  we({ attribute: !1 })
], Z.prototype, "hass");
at([
  we({ type: Boolean })
], Z.prototype, "narrow");
at([
  we({ type: Object })
], Z.prototype, "panel");
at([
  ct()
], Z.prototype, "_config");
at([
  ct()
], Z.prototype, "_loading");
at([
  ct()
], Z.prototype, "_loadFailed");
at([
  ct()
], Z.prototype, "_editMode");
at([
  ct()
], Z.prototype, "_currentView");
at([
  ct()
], Z.prototype, "_currentPlanId");
at([
  ct()
], Z.prototype, "_selectedAreaId");
at([
  ct()
], Z.prototype, "_selectedMarkerId");
at([
  ct()
], Z.prototype, "_haAreas");
at([
  ct()
], Z.prototype, "_haEntities");
at([
  ct()
], Z.prototype, "_entityToAdd");
at([
  ct()
], Z.prototype, "_entitySearch");
at([
  ct()
], Z.prototype, "_entityDomainFilter");
at([
  ct()
], Z.prototype, "_entityAreaFilter");
at([
  ct()
], Z.prototype, "_notice");
at([
  ct()
], Z.prototype, "_error");
at([
  ct()
], Z.prototype, "_saveState");
at([
  ct()
], Z.prototype, "_saveDirty");
at([
  ct()
], Z.prototype, "_saveConflict");
at([
  ct()
], Z.prototype, "_dialog");
customElements.get("floorplan-ui-panel") || customElements.define("floorplan-ui-panel", Z);

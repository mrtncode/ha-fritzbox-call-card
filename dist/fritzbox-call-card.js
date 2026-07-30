//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, p = f.trustedTypes, re = p ? p.emptyScript : "", ie = f.reactiveElementPolyfillSupport, m = (e, t) => e, h = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? re : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, g = (e, t) => !l(e, t), _ = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	useDefault: !1,
	hasChanged: g
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var v = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = _) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? _;
	}
	static _$Ei() {
		if (this.hasOwnProperty(m("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(m("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(m("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(Infinity).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? h : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? h : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? g)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[m("elementProperties")] = /* @__PURE__ */ new Map(), v[m("finalized")] = /* @__PURE__ */ new Map(), ie?.({ ReactiveElement: v }), (f.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var y = globalThis, b = (e) => e, x = y.trustedTypes, S = x ? x.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, C = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, T = "?" + w, ae = `<${T}>`, E = document, D = () => E.createComment(""), O = (e) => e === null || typeof e != "object" && typeof e != "function", k = Array.isArray, oe = (e) => k(e) || typeof e?.[Symbol.iterator] == "function", A = "[ 	\n\f\r]", j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, M = /-->/g, N = />/g, P = RegExp(`>|${A}(?:([^\\s"'>=/]+)(${A}*=${A}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), F = /'/g, I = /"/g, L = /^(?:script|style|textarea|title)$/i, R = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), z = Symbol.for("lit-noChange"), B = Symbol.for("lit-nothing"), V = /* @__PURE__ */ new WeakMap(), H = E.createTreeWalker(E, 129);
function U(e, t) {
	if (!k(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return S === void 0 ? t : S.createHTML(t);
}
var se = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = j;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === j ? c[1] === "!--" ? o = M : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = P) : (L.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = P) : o = N : o === P ? c[0] === ">" ? (o = i ?? j, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? P : c[3] === "\"" ? I : F) : o === I || o === F ? o = P : o === M || o === N ? o = j : (o = P, i = void 0);
		let d = o === P && e[t + 1].startsWith("/>") ? " " : "";
		a += o === j ? n + ae : l >= 0 ? (r.push(s), n.slice(0, l) + C + n.slice(l) + w + d) : n + w + (l === -2 ? t : d);
	}
	return [U(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, W = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = se(t, n);
		if (this.el = e.createElement(l, r), H.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = H.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(C)) {
					let t = u[o++], n = i.getAttribute(e).split(w), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? le : r[1] === "?" ? ue : r[1] === "@" ? de : q
					}), i.removeAttribute(e);
				} else e.startsWith(w) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (L.test(i.tagName)) {
					let e = i.textContent.split(w), t = e.length - 1;
					if (t > 0) {
						i.textContent = x ? x.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], D()), H.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], D());
					}
				}
			} else if (i.nodeType === 8) if (i.data === T) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(w, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += w.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = E.createElement("template");
		return n.innerHTML = e, n;
	}
};
function G(e, t, n = e, r) {
	if (t === z) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = O(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = G(e, i._$AS(e, t.values), i, r)), t;
}
var ce = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? E).importNode(t, !0);
		H.currentNode = r;
		let i = H.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new K(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new fe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = H.nextNode(), a++);
		}
		return H.currentNode = E, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, K = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = B, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = G(this, e, t), O(e) ? e === B || e == null || e === "" ? (this._$AH !== B && this._$AR(), this._$AH = B) : e !== this._$AH && e !== z && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? oe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== B && O(this._$AH) ? this._$AA.nextSibling.data = e : this.T(E.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = W.createElement(U(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new ce(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = V.get(e.strings);
		return t === void 0 && V.set(e.strings, t = new W(e)), t;
	}
	k(t) {
		k(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(D()), this.O(D()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = b(e).nextSibling;
			b(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, q = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = B, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = B;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = G(this, e, t, 0), a = !O(e) || e !== this._$AH && e !== z, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = G(this, r[n + o], t, o), s === z && (s = this._$AH[o]), a ||= !O(s) || s !== this._$AH[o], s === B ? e = B : e !== B && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === B ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, le = class extends q {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === B ? void 0 : e;
	}
}, ue = class extends q {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== B);
	}
}, de = class extends q {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = G(this, e, t, 0) ?? B) === z) return;
		let n = this._$AH, r = e === B && n !== B || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== B && (n === B || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, fe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		G(this, e);
	}
}, pe = y.litHtmlPolyfillSupport;
pe?.(W, K), (y.litHtmlVersions ??= []).push("3.3.2");
var me = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new K(t.insertBefore(D(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, J = globalThis, Y = class extends v {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = me(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return z;
	}
};
Y._$litElement$ = !0, Y.finalized = !0, J.litElementHydrateSupport?.({ LitElement: Y });
var he = J.litElementPolyfillSupport;
he?.({ LitElement: Y }), (J.litElementVersions ??= []).push("4.2.2");
var X = {
	common: {
		call_history: "Fritz!Box Calls",
		loading: "Loading call history...",
		no_calls: "No calls yet",
		unknown: "Unknown",
		all: "All"
	},
	call: {
		incoming_from: "Incoming call from {name}",
		outgoing_to: "Outgoing call to {name}",
		missed_from: "Missed call from {name}",
		missed_call: "Missed call",
		missed: "Missed",
		outgoing: "Outgoing",
		incoming: "Incoming"
	},
	state: {
		talking: "Talking",
		dialing: "Dialing",
		ringing: "Ringing",
		unknown: "Unknown"
	},
	editor: {
		title: "Title",
		call_entities: "Call log entities",
		voicemail_entity: "Voicemail entity (optional)",
		language: "Language",
		max_calls: "Max calls",
		font_size: "Font size (optional)",
		max_hours: "Max hours",
		info: {
			header: "Required Integrations:",
			call_entities: "<strong>Call Entities:</strong> <a href=\"https://www.home-assistant.io/integrations/fritzbox_callmonitor/\" target=\"_blank\" rel=\"noreferrer\">FRITZ!Box Call Monitor (Core)</a>",
			voicemail_entity: "<strong>Voicemail Entity:</strong> <a href=\"https://github.com/mrtncode/ha-fritzbox-voicemail\" target=\"_blank\" rel=\"noreferrer\">FRITZ!Box Voicemail (GitHub)</a> — or directly <a href=\"https://my.home-assistant.io/redirect/hacs_repository/?repository=ha-fritzbox-voicemail&owner=mrtncode&category=integration\" target=\"_blank\" rel=\"noreferrer\">open in HACS</a>"
		}
	}
}, Z = {
	common: {
		call_history: "Fritz!Box Anrufe",
		loading: "Anrufverlauf wird geladen...",
		no_calls: "Noch keine Anrufe",
		unknown: "Unbekannt",
		all: "Alle"
	},
	call: {
		incoming_from: "Eingehender Anruf von {name}",
		outgoing_to: "Ausgehender Anruf an {name}",
		missed_from: "Verpasster Anruf von {name}",
		missed_call: "Verpasster Anruf",
		missed: "Verpasst",
		outgoing: "Ausgehend",
		incoming: "Eingehend"
	},
	state: {
		talking: "Im Gespräch",
		dialing: "Wählt",
		ringing: "Klingelt",
		unknown: "Unbekannt"
	},
	editor: {
		title: "Titel",
		call_entities: "Telefonbuch-Entitäten",
		voicemail_entity: "Voicemail Entität (optional)",
		language: "Sprache",
		max_calls: "Max. Anrufe",
		font_size: "Schriftgröße (optional)",
		max_hours: "Max. Stunden",
		info: {
			header: "Benötigte Integrationen:",
			call_entities: "<strong>Anruf-Entitäten:</strong> <a href=\"https://www.home-assistant.io/integrations/fritzbox_callmonitor/\" target=\"_blank\" rel=\"noreferrer\">FRITZ!Box Call Monitor (Core)</a>",
			voicemail_entity: "<strong>Voicemail-Entität:</strong> <a href=\"https://github.com/mrtncode/ha-fritzbox-voicemail\" target=\"_blank\" rel=\"noreferrer\">FRITZ!Box Voicemail (GitHub)</a> — oder direkt <a href=\"https://my.home-assistant.io/redirect/hacs_repository/?repository=ha-fritzbox-voicemail&owner=mrtncode&category=integration\" target=\"_blank\" rel=\"noreferrer\">in HACS öffnen</a>"
		}
	}
}, ge = class e extends Y {
	static properties = {
		hass: {},
		_config: {}
	};
	static langs = {
		en: X,
		de: Z
	};
	static styles = o`
    .integration-info {
      background: var(--secondary-background-color, #f5f5f5);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
      font-size: 13px;
      line-height: 1.4;
      border-left: 4px solid var(--primary-color, #03a9f4);
    }
    .integration-info a {
      color: var(--primary-color, #03a9f4);
      font-weight: 500;
      text-decoration: none;
    }
    .integration-info a:hover {
      text-decoration: underline;
    }
  `;
	setConfig(e) {
		this._config = {
			title: "",
			call_entities: [],
			voicemail_entity: "",
			font_size: null,
			max_calls: 10,
			max_hours: 24,
			...e
		};
	}
	static _localize(e, t = this._hass?.locale?.language || "en") {
		let n = String(t || "en").split("-")[0], r = e.split("."), i = this.langs[n] || this.langs.en;
		for (let e of r) {
			if (i[e] === void 0) return this.langs.en?.[r[0]]?.[r[1]] || "";
			i = i[e];
		}
		return i;
	}
	static getConfigForm() {
		return { schema: [
			{
				name: "title",
				selector: { text: {} }
			},
			{
				name: "call_entities",
				selector: { entity: {
					multiple: !0,
					filter: [{
						domain: ["sensor"],
						integration: "fritzbox_callmonitor"
					}]
				} }
			},
			{
				name: "voicemail_entity",
				selector: { entity: {
					multiple: !1,
					filter: [{
						domain: ["sensor"],
						integration: "fritzbox_voicemail"
					}]
				} }
			},
			{
				name: "max_calls",
				selector: { number: {
					min: 1,
					max: 50,
					step: 1
				} }
			},
			{
				name: "font_size",
				selector: { number: {
					min: 10,
					max: 24,
					step: 1
				} }
			},
			{
				name: "max_hours",
				selector: { number: {
					min: 1,
					max: 72,
					step: 1
				} }
			}
		] };
	}
	_computeLabel(t) {
		let n = this._config?.language || this.hass?.locale?.language || "en", r = {
			title: "editor.title",
			call_entities: "editor.call_entities",
			voicemail_entity: "editor.voicemail_entity",
			device: "editor.device",
			language: "editor.language",
			max_calls: "editor.max_calls",
			font_size: "editor.font_size",
			max_hours: "editor.max_hours"
		};
		return r[t.name] ? e._localize(r[t.name], n) : void 0;
	}
	render() {
		if (!this.hass || !this._config) return R``;
		let t = this._config?.language || this.hass?.locale?.language || "en", n = (n) => e._localize(n, t);
		return R`
    <!-- Custom HTML to show integration infos -->
      <div class="integration-info">
        <strong>${n("editor.info.header")}</strong>
        <ul>
          <li .innerHTML=${n("editor.info.call_entities")}></li>
          <li .innerHTML=${n("editor.info.voicemail_entity")}></li>
        </ul>
      </div>

      <!-- HA native form -->
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${e.getConfigForm().schema}
        .computeLabel=${this._computeLabel.bind(this)}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
	}
	_valueChanged(e) {
		let t = e.detail.value;
		this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: t },
			bubbles: !0,
			composed: !0
		}));
	}
};
customElements.define("fritzbox-call-card-editor", ge), window.customCards = window.customCards || [], window.customCards.push({
	type: "fritzbox-call-card",
	name: "FRITZ!Box Call Card",
	preview: !0,
	description: "Fritzbox call card editor",
	documentationURL: "https://github.com/mrtncode/ha-fritzbox-call-card"
});
//#endregion
//#region src/utils.js
function _e(e) {
	if (!Number.isFinite(e) || e < 0) return "unknown";
	let t = Math.floor(e / 1e3), n = Math.floor(t / 60), r = t % 60;
	return n > 0 ? `${n}m ${r.toString().padStart(2, "0")}s` : `${r}s`;
}
function ve(e, t) {
	for (let n = t + 1; n < e.length; n += 1) {
		if (e[n].state === "talking") return !0;
		if (e[n].state === "ringing" || e[n].state === "dialing") return !1;
	}
	return !1;
}
//#endregion
//#region src/voicemail.js
var ye = class {
	constructor(e) {
		this.card = e, this.audio = null, this.currentlyPlayingIndex = null, this.root = null;
	}
	get entity() {
		return this.card.config?.voicemail_entity && this.card._hass && this.card._hass.states[this.card.config.voicemail_entity] || null;
	}
	get messages() {
		return this.entity?.attributes?.messages || [];
	}
	async deleteMessage(e) {
		if (confirm("Are you sure you want to delete this voicemail?")) try {
			this.stopCurrentAudio(), await this.card._hass.callService("fritzbox_voicemail", "delete_voicemail_message", {
				delete_mode: "specific",
				message_index: Number(e)
			});
		} catch (e) {
			console.error(e);
		}
	}
	async deleteAll() {
		if (confirm("Are you sure you want to delete ALL voicemails?")) try {
			this.stopCurrentAudio(), await this.card._hass.callService("fritzbox_voicemail", "delete_voicemail_message", { delete_mode: "all" });
		} catch (e) {
			console.error(e);
		}
	}
	render(e = 13) {
		let t = Number.isFinite(e) ? e : 13, n = (e, n = 9) => `${Math.max(n, Math.round(t * e))}px`;
		return this.messages.length ? `
      <div class="fbc-voicemail-container" style="display:flex; flex-direction:column; gap:4px; margin-bottom:4px;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--divider-color, #eee); padding-bottom:4px;">
          <span style="font-size:${n(.92)}; font-weight:bold; color:var(--secondary-text-color);">Voicemails</span>
          <button class="fbc-voicemail-delete-all" style="border:none; background:none; cursor:pointer; color:var(--error-color, #e53935); display:flex; align-items:center; padding:2px; font-size:${n(.85)}; font-weight:500;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:2px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>Clear All
          </button>
        </div>
        <ul style="list-style:none; padding:0; margin:0; max-height:180px; overflow-y:auto;">
          ${this.messages.map((e) => {
			let t = String(e.Index) === String(this.currentlyPlayingIndex);
			return `
              <li style="padding:6px 0; border-bottom:1px solid var(--divider-color, #eee); display:flex; flex-direction:column; gap:4px;">
                <div style="display:flex; align-items:center; justify-content:space-between; width:100%; min-width:0;">
                  <div style="min-width:0; flex-grow:1;">
                    <strong style="font-size:${n(.92)}; color:var(--primary-text-color); display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${e.Name || e.Number || "Unknown"}</strong>
                    <small style="font-size:${n(.77)}; color:var(--secondary-text-color); display:block;">${e.Date || ""}</small>
                  </div>
                  <button class="fbc-voicemail-delete" data-index="${e.Index}" style="border:none; background:none; cursor:pointer; color:var(--secondary-text-color); padding:4px; display:flex; align-items:center;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
                ${e.Index === void 0 ? "" : `
                  <div class="fbc-audio-player-row" data-index="${e.Index}" style="display:flex; align-items:center; gap:8px; width:100%;">
                    <button class="fbc-voicemail-toggle" data-index="${e.Index}" style="border:none; background:var(--primary-color, #1e88e5); color:#fff; border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; cursor:pointer; padding:0; flex-shrink:0;">
                      ${t && !this.audio?.paused ? "<svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><rect x=\"4\" y=\"4\" width=\"4\" height=\"16\"/><rect x=\"16\" y=\"4\" width=\"4\" height=\"16\"/></svg>" : "<svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"currentColor\" style=\"margin-left:1px;\"><polygon points=\"5 3 19 12 5 21\"/></svg>"}
                    </button>
                    <div style="flex-grow:1; display:flex; flex-direction:column;">
                      <input type="range" class="fbc-audio-slider" data-index="${e.Index}" min="0" max="100" value="0" step="0.1" ${t ? "" : "disabled"} style="width:100%; accent-color:var(--primary-color); cursor:pointer; margin:0; height:14px;">
                      <div style="display:flex; justify-content:space-between; font-size:${n(.69)}; color:var(--secondary-text-color); font-family:monospace; line-height:1;">
                        <span class="fbc-audio-current-time" data-index="${e.Index}">0:00</span>
                        <span class="fbc-audio-duration" data-index="${e.Index}" data-initial=""></span>
                      </div>
                    </div>
                  </div>
                `}
              </li>
            `;
		}).join("")}
        </ul>
      </div>
    ` : `<div style="padding:4px 0; font-size:${n(1)}; color:var(--secondary-text-color);">No messages</div>`;
	}
	attachEvents(e) {
		this.root = e, e.querySelectorAll(".fbc-voicemail-delete").forEach((e) => e.onclick = () => this.deleteMessage(e.dataset.index));
		let t = e.querySelector(".fbc-voicemail-delete-all");
		t && (t.onclick = () => this.deleteAll()), e.querySelectorAll(".fbc-voicemail-toggle").forEach((e) => e.onclick = () => this.handlePlayPause(e.dataset.index)), e.querySelectorAll(".fbc-audio-slider").forEach((e) => e.oninput = (t) => this.handleSeek(t, e.dataset.index));
	}
	stopCurrentAudio() {
		this.audio &&= (this.audio.pause(), this.audio.ontimeupdate = this.audio.onloadedmetadata = this.audio.onended = null, null);
	}
	async handlePlayPause(e) {
		if (String(this.currentlyPlayingIndex) === String(e) && this.audio) {
			this.audio.paused ? (await this.audio.play(), this.updateButtonUI(e, "playing")) : (this.audio.pause(), this.updateButtonUI(e, "paused"));
			return;
		}
		this.currentlyPlayingIndex !== null && this.resetTrackVisuals(this.currentlyPlayingIndex), this.stopCurrentAudio(), this.currentlyPlayingIndex = e, this.updateButtonUI(e, "loading");
		try {
			let t = `media-source://fritzbox_voicemail/${e}`, n = await this.card._hass.callWS({
				type: "media_source/resolve_media",
				media_content_id: t
			});
			if (!n?.url) throw Error("No playback URL resolved");
			let r = window.location.origin + n.url;
			this.audio = new Audio(r), this.audio.type = n.mime_type || "audio/wav", this.audio.onloadedmetadata = () => {
				let t = this.root.querySelector(`.fbc-audio-duration[data-index="${e}"]`);
				t && (t.textContent = this.formatTime(this.audio.duration));
			}, this.audio.ontimeupdate = () => {
				if (!this.audio) return;
				let t = this.audio.currentTime / this.audio.duration * 100, n = this.root.querySelector(`.fbc-audio-slider[data-index="${e}"]`), r = this.root.querySelector(`.fbc-audio-current-time[data-index="${e}"]`);
				n && (n.value = t || 0), r && (r.textContent = this.formatTime(this.audio.currentTime));
			}, this.audio.onended = () => {
				this.resetTrackVisuals(e), this.stopCurrentAudio(), this.currentlyPlayingIndex = null;
			};
			let i = this.root.querySelector(`.fbc-audio-slider[data-index="${e}"]`);
			i && (i.disabled = !1), await this.audio.play(), this.updateButtonUI(e, "playing");
		} catch (t) {
			console.error("Audio engine failed:", t), this.resetTrackVisuals(e), this.currentlyPlayingIndex = null;
		}
	}
	handleSeek(e, t) {
		if (String(this.currentlyPlayingIndex) === String(t) && this.audio && this.audio.duration) {
			let t = parseFloat(e.target.value);
			this.audio.currentTime = t / 100 * this.audio.duration;
		}
	}
	updateButtonUI(e, t) {
		let n = this.root.querySelector(`.fbc-voicemail-toggle[data-index="${e}"]`);
		n && (t === "playing" ? n.innerHTML = "<svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><rect x=\"4\" y=\"4\" width=\"4\" height=\"16\"/><rect x=\"16\" y=\"4\" width=\"4\" height=\"16\"/></svg>" : t === "loading" ? n.innerHTML = "\n          <svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" \n            style=\"animation: fbc-spin 1s linear infinite; transform-origin: center;\">\n            <circle cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" stroke-opacity=\"0.25\"></circle>\n            <path d=\"M12 2a10 10 0 0 1 10 10\" stroke=\"currentColor\" stroke-linecap=\"round\"></path>\n            <style>\n              @keyframes fbc-spin {\n                0% { transform: rotate(0deg); }\n                100% { transform: rotate(360deg); }\n              }\n            </style>\n          </svg>" : n.innerHTML = "<svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"currentColor\" style=\"margin-left:1px;\"><polygon points=\"5 3 19 12 5 21\"/></svg>");
	}
	resetTrackVisuals(e) {
		this.updateButtonUI(e, "paused");
		let t = this.root.querySelector(`.fbc-audio-slider[data-index="${e}"]`), n = this.root.querySelector(`.fbc-audio-current-time[data-index="${e}"]`), r = this.root.querySelector(`.fbc-audio-duration[data-index="${e}"]`);
		t && (t.value = 0, t.disabled = !0), n && (n.textContent = "0:00"), r && (r.textContent = r.dataset.initial || "0:00");
	}
	formatTime(e) {
		if (isNaN(e)) return "0:00";
		let t = Math.floor(e / 60), n = Math.floor(e % 60);
		return `${t}:${n < 10 ? "0" : ""}${n}`;
	}
}, Q = "Fritz!Box Calls", be = 10, xe = 24, Se = 13, Ce = 10, we = 24, $ = new Set([
	"talking",
	"dialing",
	"ringing"
]), Te = class extends HTMLElement {
	langs = {
		en: X,
		de: Z
	};
	static getConfigElement() {
		return document.createElement("fritzbox-call-card-editor");
	}
	static getStubConfig() {
		return {
			call_entities: [],
			voicemail_entity: null,
			max_calls: be,
			max_hours: xe,
			font_size: null,
			title: Q
		};
	}
	setConfig(e) {
		if (!e || !Array.isArray(e.call_entities)) throw Error("Invalid configuration: 'call_entities' must be an array.");
		let t = this._parseInteger(e.max_calls, be), n = this._parseInteger(e.max_hours, xe), r = this._parseOptionalFontSize(e.font_size);
		this.config = {
			...e,
			title: e.title || Q,
			voicemail_entity: e.voicemail_entity || null,
			max_calls: t,
			max_hours: n,
			font_size: r
		}, this.calls = [], this._lastEntityStates = {}, this._loading = !1, this._initialized = !1, this._filter = "all", this.voicemail = new ye(this);
	}
	set hass(e) {
		if (this._hass = e, !this.config || !Array.isArray(this.config.call_entities)) return;
		let t = !1;
		for (let n of this.config.call_entities) {
			let r = this._resolveEntityId(n), i = e.states[r];
			if (!i) continue;
			let a = this._lastEntityStates[r];
			(!a || a.state !== i.state || a.last_changed !== i.last_changed) && (t = !0, this._lastEntityStates[r] = {
				state: i.state,
				last_changed: i.last_changed
			});
		}
		!this._initialized || t ? (this._initialized = !0, this._loading = !0, this.render(), this._updateHistory()) : this.render();
	}
	connectedCallback() {
		this._hass && this.render();
	}
	async _updateHistory() {
		if (!this._hass || !Array.isArray(this.config.call_entities)) return;
		let e = /* @__PURE__ */ new Date(), t = this.config.max_hours * 60 * 60 * 1e3, n = new Date(e.getTime() - t), r = (await Promise.all(this.config.call_entities.map((t) => this._fetchEntityHistory(t, n, e)))).flatMap((e, t) => this._buildCallEntries(e, this.config.call_entities[t]));
		this.calls = this._mergeCallEntries(r), this._loading = !1, this.render();
	}
	async _fetchEntityHistory(e, t, n) {
		let r = this._resolveEntityId(e);
		if (!this._hass || !r) return [];
		try {
			let e = await this._hass.callApi("GET", `history/period/${t.toISOString()}?filter_entity_id=${r}&end_time=${n.toISOString()}`);
			return Array.isArray(e) && Array.isArray(e[0]) ? e[0] : [];
		} catch {
			return [];
		}
	}
	_buildCallEntries(e, t) {
		if (!Array.isArray(e)) return [];
		let n = this._resolveEntityId(t), r = [...e].sort((e, t) => new Date(e.last_changed) - new Date(t.last_changed)), i = [];
		for (let e = 0; e < r.length; e++) {
			let a = r[e];
			if (!$.has(a.state) || a.state === "ringing" && ve(r, e)) continue;
			let o = new Date(a.last_changed), s = this._getHistoryEndTime(r, e, n);
			i.push({
				id: `${n}-${a.state}-${a.last_changed || a.last_updated || ""}`,
				number: this._extractNumber(a),
				headline: this._extractNumber(a),
				label: this._extractLabel(a, t),
				state: a.state,
				type: a.attributes?.type || "",
				time: this._resolveCallTime(a, o),
				duration: _e(Math.max(0, s - o))
			});
		}
		return i;
	}
	_mergeCallEntries(e) {
		let t = {};
		return [...e].sort((e, t) => t.time - e.time).forEach((e) => {
			t[e.id] || (t[e.id] = e);
		}), Object.values(t).slice(0, this.config.max_calls);
	}
	_getHistoryEndTime(e, t, n) {
		let r = e[t];
		for (let n = t + 1; n < e.length; n++) if (e[n].state !== r.state) return new Date(e[n].last_changed || e[n].last_updated || Date.now());
		let i = this._hass?.states?.[n];
		return i && !$.has(i.state) ? new Date(i.last_changed || i.last_updated || Date.now()) : /* @__PURE__ */ new Date();
	}
	_resolveCallTime(e, t) {
		return e.state === "talking" && e.attributes?.accepted ? new Date(e.attributes.accepted) : e.state === "dialing" && e.attributes?.initiated ? new Date(e.attributes.initiated) : t;
	}
	_extractNumber(e) {
		let t = e.attributes || {}, n = e.state === "ringing" ? [
			"from_name",
			"from",
			"with_name",
			"to",
			"from",
			"caller_id",
			"called_number",
			"number",
			"from_number",
			"to_number"
		] : [
			"to_name",
			"with_name",
			"with",
			"to",
			"from",
			"caller_id",
			"called_number",
			"number",
			"from_number",
			"to_number"
		];
		for (let e of n) {
			if (!e) continue;
			let n = t[e];
			if (typeof n == "string" && n.trim() && n.trim().toLowerCase() !== "unknown") return n.trim();
		}
		return e.entity_id;
	}
	_extractLabel(e, t) {
		let { attributes: n = {}, state: r } = e || {}, i = String(n.type || "").toLowerCase(), a = (e) => typeof e == "string" && e.trim() !== "" && e.toLowerCase() !== "unknown", o = a(n.from_name) ? n.from_name : a(n.with_name) ? n.with_name : n.from || n.with, s = n.to_name && n.to_name.toLowerCase() !== "unknown" ? n.to_name : n.to, c = i === "outgoing" || !!s, l = this._localize(`state.${r}`) ?? r;
		return e.state === "dialing" ? l = this._formatTranslation(this._localize(c ? "call.outgoing_to" : "call.incoming_from"), { name: s || n.from || this._localize("common.unknown") }) : e.state === "ringing" ? l = o ? this._formatTranslation(this._localize("call.missed_from"), { name: o }) : this._localize("call.missed_call") : e.state === "talking" && (l = this._formatTranslation(this._localize(c ? "call.outgoing_to" : "call.incoming_from"), { name: c ? s || o : o || n.from || this._localize("common.unknown") })), (l || t?.label || n.call_type || n.direction || n.source || n.destination || e.state).trim();
	}
	_formatTranslation(e, t = {}) {
		return typeof e == "string" ? e.replace(/\{(\w+)\}/g, (e, n) => t[n] === void 0 ? `{${n}}` : t[n]) : e;
	}
	_iconForCall(e) {
		let t = e.state === "ringing", n = e.type === "outgoing" || e.state === "dialing";
		return `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${t ? "var(--error-color, #e53935)" : n ? "var(--primary-color, #1e88e5)" : "var(--success-color, #43a047)"}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:12px; flex-shrink:0;">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12 1.05.37 2.07.73 3.03a2 2 0 0 1-.45 2.11L8.91 10.91a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.96.36 1.98.61 3.03.73A2 2 0 0 1 22 16.92z"/>
      </svg>
    `;
	}
	_setFilter(e) {
		this._filter !== e && (this._filter = e, this.render());
	}
	_resolveEntityId(e) {
		return e?.entity || e;
	}
	_parseInteger(e, t) {
		let n = Number.isInteger(e) ? e : parseInt(e, 10);
		return Number.isFinite(n) ? n : t;
	}
	_parseOptionalFontSize(e) {
		if (e == null || e === "") return null;
		let t = this._parseInteger(e, null);
		return Number.isFinite(t) ? Math.min(we, Math.max(Ce, t)) : null;
	}
	_getBaseFontSize() {
		return this._parseOptionalFontSize(this.config?.font_size) ?? Se;
	}
	_isToday(e) {
		let t = /* @__PURE__ */ new Date();
		return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
	}
	_formatCallTimestamp(e) {
		let t = this._hass?.locale?.language, n = e.toLocaleTimeString(t, {
			hour: "2-digit",
			minute: "2-digit"
		});
		return this._isToday(e) ? n : `${e.toLocaleDateString(t, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit"
		})} ${n}`;
	}
	_getFilteredCalls() {
		return this._filter === "all" ? this.calls : this.calls.filter((e) => this._filter === "missed" ? e.state === "ringing" : this._filter === "outgoing" ? e.type === "outgoing" || e.state === "dialing" : this._filter === "incoming" ? !(e.type === "outgoing" || e.state === "dialing") && e.state !== "ringing" : !0);
	}
	_localize(e, t = this._hass?.locale?.language || "en") {
		let n = t.split("-")[0], r = this.langs[n] || this.langs.en;
		for (let t of e.split(".")) {
			if (!r || r[t] === void 0) return e.split(".")[0] === "weather_state" ? e.split(".")[1] : this.langs.en?.[e.split(".")[0]]?.[e.split(".")[1]] || e;
			r = r[t];
		}
		return r;
	}
	render() {
		let e = this.config?.title || this._localize("common.call_history"), t = this._getFilteredCalls(), n = this._getBaseFontSize(), r = `font-size:${n}px;`, i = "padding:0.3em 0.8em; border-radius:12px; border:1px solid var(--divider-color, #ddd); background:var(--card-background-color, #fff); color:var(--primary-text-color); cursor:pointer; font-size:0.85em; font-weight:500; transition: all 0.2s;", a = "background:var(--primary-color, #1e88e5); color:#fff; border-color:var(--primary-color, #1e88e5);";
		if (this._loading) {
			this.innerHTML = `<ha-card header="${e}"><div style="padding:16px; min-height:80px; color:var(--secondary-text-color); ${r}">${this._localize("common.loading") || "Loading..."}</div></ha-card>`;
			return;
		}
		this.innerHTML = `
      <ha-card header="${e}">
        <div style="padding:0 16px 12px 16px; display:flex; flex-direction:column; gap:8px; ${r}">
          ${this.config?.voicemail_entity ? `<div>${this.voicemail.render(n)}</div>` : ""}
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="fbc-chip" data-filter="all" style="${i} ${this._filter === "all" ? a : ""}">${this._localize("common.all") || "All"}</button>
            <button class="fbc-chip" data-filter="missed" style="${i} ${this._filter === "missed" ? a : ""}">${this._localize("call.missed") || "Missed"}</button>
            <button class="fbc-chip" data-filter="outgoing" style="${i} ${this._filter === "outgoing" ? a : ""}">${this._localize("call.outgoing") || "Outgoing"}</button>
            <button class="fbc-chip" data-filter="incoming" style="${i} ${this._filter === "incoming" ? a : ""}">${this._localize("call.incoming") || "Incoming"}</button>
          </div>
          ${t.length === 0 ? `<div style="padding:8px 0; color:var(--secondary-text-color);">${this._localize("common.no_calls")}</div>` : ""}
          <ul style="list-style:none; padding:0; margin:0;">
            ${t.map((e) => `
              <li style="padding:6px 0; border-bottom:1px solid var(--divider-color, #eee); display:flex; align-items:center;">
                ${this._iconForCall(e)}
                <div style="flex-grow:1; min-width:0;">
                  <strong style="display:block; color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${e.headline || this._localize("common.unknown")}</strong>
                  <small style="display:block; font-size:0.85em; color:var(--secondary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${e.label} · ${this._formatCallTimestamp(e.time)} · ${e.duration}</small>
                </div>
              </li>
            `).join("")}
          </ul>
        </div>
      </ha-card>
    `, this.querySelectorAll(".fbc-chip").forEach((e) => {
			e.onclick = (e) => this._setFilter(e.currentTarget.dataset.filter);
		}), this.voicemail && this.voicemail.attachEvents(this);
	}
};
customElements.define("fritzbox-call-card", Te);
//#endregion

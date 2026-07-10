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
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, s = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: c, defineProperty: l, getOwnPropertyDescriptor: u, getOwnPropertyNames: d, getOwnPropertySymbols: f, getPrototypeOf: ee } = Object, p = globalThis, m = p.trustedTypes, te = m ? m.emptyScript : "", ne = p.reactiveElementPolyfillSupport, h = (e, t) => e, g = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? te : null;
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
}, _ = (e, t) => !c(e, t), v = {
	attribute: !0,
	type: String,
	converter: g,
	reflect: !1,
	useDefault: !1,
	hasChanged: _
};
Symbol.metadata ??= Symbol("metadata"), p.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var y = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = v) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && l(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = u(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? v;
	}
	static _$Ei() {
		if (this.hasOwnProperty(h("elementProperties"))) return;
		let e = ee(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(h("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(h("properties"))) {
			let e = this.properties, t = [...d(e), ...f(e)];
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
			for (let e of n) t.unshift(s(e));
		} else e !== void 0 && t.push(s(e));
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
		return o(e, this.constructor.elementStyles), e;
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
			let i = (n.converter?.toAttribute === void 0 ? g : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? g : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? _)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[h("elementProperties")] = /* @__PURE__ */ new Map(), y[h("finalized")] = /* @__PURE__ */ new Map(), ne?.({ ReactiveElement: y }), (p.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var b = globalThis, x = (e) => e, S = b.trustedTypes, C = S ? S.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, w = "$lit$", T = `lit$${Math.random().toFixed(9).slice(2)}$`, E = "?" + T, re = `<${E}>`, D = document, O = () => D.createComment(""), k = (e) => e === null || typeof e != "object" && typeof e != "function", A = Array.isArray, ie = (e) => A(e) || typeof e?.[Symbol.iterator] == "function", j = "[ 	\n\f\r]", M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, N = /-->/g, P = />/g, F = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), I = /'/g, L = /"/g, R = /^(?:script|style|textarea|title)$/i, z = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), B = Symbol.for("lit-noChange"), V = Symbol.for("lit-nothing"), H = /* @__PURE__ */ new WeakMap(), U = D.createTreeWalker(D, 129);
function W(e, t) {
	if (!A(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return C === void 0 ? t : C.createHTML(t);
}
var ae = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = M;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === M ? c[1] === "!--" ? o = N : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = F) : (R.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = F) : o = P : o === F ? c[0] === ">" ? (o = i ?? M, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? F : c[3] === "\"" ? L : I) : o === L || o === I ? o = F : o === N || o === P ? o = M : (o = F, i = void 0);
		let d = o === F && e[t + 1].startsWith("/>") ? " " : "";
		a += o === M ? n + re : l >= 0 ? (r.push(s), n.slice(0, l) + w + n.slice(l) + T + d) : n + T + (l === -2 ? t : d);
	}
	return [W(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, G = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ae(t, n);
		if (this.el = e.createElement(l, r), U.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = U.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(w)) {
					let t = u[o++], n = i.getAttribute(e).split(T), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? oe : r[1] === "?" ? se : r[1] === "@" ? ce : Y
					}), i.removeAttribute(e);
				} else e.startsWith(T) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (R.test(i.tagName)) {
					let e = i.textContent.split(T), t = e.length - 1;
					if (t > 0) {
						i.textContent = S ? S.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], O()), U.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], O());
					}
				}
			} else if (i.nodeType === 8) if (i.data === E) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(T, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += T.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = D.createElement("template");
		return n.innerHTML = e, n;
	}
};
function K(e, t, n = e, r) {
	if (t === B) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = k(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = K(e, i._$AS(e, t.values), i, r)), t;
}
var q = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? D).importNode(t, !0);
		U.currentNode = r;
		let i = U.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new J(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new le(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = U.nextNode(), a++);
		}
		return U.currentNode = D, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, J = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = V, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = K(this, e, t), k(e) ? e === V || e == null || e === "" ? (this._$AH !== V && this._$AR(), this._$AH = V) : e !== this._$AH && e !== B && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ie(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== V && k(this._$AH) ? this._$AA.nextSibling.data = e : this.T(D.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = G.createElement(W(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new q(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = H.get(e.strings);
		return t === void 0 && H.set(e.strings, t = new G(e)), t;
	}
	k(t) {
		A(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(O()), this.O(O()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = x(e).nextSibling;
			x(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Y = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = V, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = V;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = K(this, e, t, 0), a = !k(e) || e !== this._$AH && e !== B, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = K(this, r[n + o], t, o), s === B && (s = this._$AH[o]), a ||= !k(s) || s !== this._$AH[o], s === V ? e = V : e !== V && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === V ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, oe = class extends Y {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === V ? void 0 : e;
	}
}, se = class extends Y {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== V);
	}
}, ce = class extends Y {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = K(this, e, t, 0) ?? V) === B) return;
		let n = this._$AH, r = e === V && n !== V || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== V && (n === V || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, le = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		K(this, e);
	}
}, ue = b.litHtmlPolyfillSupport;
ue?.(G, J), (b.litHtmlVersions ??= []).push("3.3.2");
var de = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new J(t.insertBefore(O(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, X = globalThis, Z = class extends y {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = de(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return B;
	}
};
Z._$litElement$ = !0, Z.finalized = !0, X.litElementHydrateSupport?.({ LitElement: Z });
var Q = X.litElementPolyfillSupport;
Q?.({ LitElement: Z }), (X.litElementVersions ??= []).push("4.2.2");
var $ = {
	common: {
		call_history: "📞 Call History",
		loading: "Loading call history...",
		no_calls: "No calls yet",
		unknown: "Unknown"
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
		max_hours: "Max hours"
	}
}, fe = class e extends Z {
	static properties = {
		hass: {},
		_config: {}
	};
	static langs = { en: $ };
	setConfig(e) {
		this._config = {
			title: "",
			call_entities: [],
			voicemail_entity: "",
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
			max_hours: "editor.max_hours"
		};
		return r[t.name] ? e._localize(r[t.name], n) : void 0;
	}
	render() {
		return !this.hass || !this._config ? z`` : z`
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
customElements.define("fritzbox-call-card-editor", fe), window.customCards = window.customCards || [], window.customCards.push({
	type: "fritzbox-call-card",
	name: "Fritzbox Call Card",
	preview: !1,
	description: "Fritzbox call card editor",
	documentationURL: "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card"
});
//#endregion
//#region src/utils.js
function pe(e) {
	if (!Number.isFinite(e) || e < 0) return "unknown";
	let t = Math.floor(e / 1e3), n = Math.floor(t / 60), r = t % 60;
	return n > 0 ? `${n}m ${r.toString().padStart(2, "0")}s` : `${r}s`;
}
function me(e, t) {
	for (let n = t + 1; n < e.length; n += 1) {
		if (e[n].state === "talking") return !0;
		if (e[n].state === "ringing" || e[n].state === "dialing") return !1;
	}
	return !1;
}
var he = {
	common: {
		call_history: "📞 Anrufverlauf",
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
		max_hours: "Max. Stunden"
	}
}, ge = class {
	constructor(e) {
		this.card = e, this.audio = null, this.currentlyPlayingIndex = null, this.root = null;
	}
	get entity() {
		let e = this.card.config?.voicemail_entity;
		return !e || !this.card._hass ? null : this.card._hass.states[e] || null;
	}
	get messages() {
		return this.entity?.attributes?.messages || [];
	}
	async deleteMessage(e) {
		try {
			this.stopCurrentAudio(), await this.card._hass.callService("fritzbox_voicemail", "delete_voicemail_message", {
				delete_mode: "specific",
				message_index: Number(e)
			});
		} catch (e) {
			console.error("Failed to delete voicemail message", e);
		}
	}
	async deleteAll() {
		try {
			this.stopCurrentAudio(), await this.card._hass.callService("fritzbox_voicemail", "delete_voicemail_message", { delete_mode: "all" });
		} catch (e) {
			console.error("Failed to delete all voicemail messages", e);
		}
	}
	render() {
		return this.messages.length ? `
      <div class="fbc-voicemail-container">
        <div style="display:flex; justify-content:flex-end; margin-bottom:8px;">
          <button class="fbc-voicemail-delete-all" style="border:none; background:none; cursor:pointer; color: var(--primary-text-color);">
            🗑 All
          </button>
        </div>

        <ul style="list-style:none; padding:0; margin:0;">
          ${this.messages.map((e) => {
			let t = String(e.Index) === String(this.currentlyPlayingIndex);
			return `
            <li style="padding:12px 0; border-bottom:1px solid var(--divider-color); display:flex; flex-direction:column; gap:8px;">
              <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                <div>
                  <strong style="color: var(--primary-text-color);">
                    ${e.Name || e.Number || "Unknown"}
                  </strong>
                  <br>
                  <small style="color: var(--secondary-text-color);">
                    ${e.Date || ""}
                  </small>
                </div>

                <button class="fbc-voicemail-delete" data-index="${e.Index}" style="border:none; background:none; cursor:pointer; color: var(--error-color); font-size: 1.1em;">
                  🗑
                </button>
              </div>

              ${e.Index === void 0 ? "" : `
                <div class="fbc-audio-player-row" data-index="${e.Index}" style="display:flex; align-items:center; gap:10px; width:100%; margin-top:4px;">
                  <button class="fbc-voicemail-toggle" data-index="${e.Index}" style="border:none; background: var(--primary-color); color: var(--text-primary-color, #fff); border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:0.9em; box-shadow: var(--ha-card-box-shadow, none);">
                    ${t && !this.audio?.paused ? "⏸" : "▶️"}
                  </button>
                  
                  <div style="flex-grow:1; display:flex; flex-direction:column; gap:2px;">
                    <input type="range" class="fbc-audio-slider" data-index="${e.Index}" min="0" max="100" value="0" step="0.1" ${t ? "" : "disabled"} style="width:100%; accent-color: var(--primary-color); cursor: pointer; margin:0;">
                    <div style="display:flex; justify-content:space-between; font-size:0.75em; color: var(--secondary-text-color); font-family: monospace;">
                      <span class="fbc-audio-current-time" data-index="${e.Index}">0:00</span>
                      <!-- Displaying pre-loaded message attribute directly before playback starts -->
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
    ` : "\n        <div style=\"padding:8px 0; color: var(--secondary-text-color);\">\n          No messages\n        </div>\n      ";
	}
	attachEvents(e) {
		this.root = e, e.querySelectorAll(".fbc-voicemail-delete").forEach((e) => {
			e.onclick = () => this.deleteMessage(e.dataset.index);
		});
		let t = e.querySelector(".fbc-voicemail-delete-all");
		t && (t.onclick = () => this.deleteAll()), e.querySelectorAll(".fbc-voicemail-toggle").forEach((e) => {
			e.onclick = () => this.handlePlayPause(e.dataset.index);
		}), e.querySelectorAll(".fbc-audio-slider").forEach((e) => {
			e.oninput = (t) => this.handleSeek(t, e.dataset.index);
		});
	}
	stopCurrentAudio() {
		this.audio &&= (this.audio.pause(), this.audio.ontimeupdate = null, this.audio.onloadedmetadata = null, this.audio.onended = null, null);
	}
	async handlePlayPause(e) {
		if (String(this.currentlyPlayingIndex) === String(e) && this.audio) {
			this.audio.paused ? (await this.audio.play(), this.updateButtonUI(e, "⏸")) : (this.audio.pause(), this.updateButtonUI(e, "▶️"));
			return;
		}
		this.currentlyPlayingIndex !== null && this.resetTrackVisuals(this.currentlyPlayingIndex), this.stopCurrentAudio(), this.currentlyPlayingIndex = e, this.updateButtonUI(e, "⏳");
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
			i && (i.disabled = !1), await this.audio.play(), this.updateButtonUI(e, "⏸");
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
		n && (n.textContent = t);
	}
	resetTrackVisuals(e) {
		this.updateButtonUI(e, "▶️");
		let t = this.root.querySelector(`.fbc-audio-slider[data-index="${e}"]`), n = this.root.querySelector(`.fbc-audio-current-time[data-index="${e}"]`), r = this.root.querySelector(`.fbc-audio-duration[data-index="${e}"]`);
		t && (t.value = 0, t.disabled = !0), n && (n.textContent = "0:00"), r && (r.textContent = r.dataset.initial || "0:00");
	}
	formatTime(e) {
		if (isNaN(e)) return "0:00";
		let t = Math.floor(e / 60), n = Math.floor(e % 60);
		return `${t}:${n < 10 ? "0" : ""}${n}`;
	}
}, _e = class extends HTMLElement {
	langs = {
		en: $,
		de: he
	};
	static getConfigElement() {
		return document.createElement("fritzbox-call-card-editor");
	}
	static getStubConfig() {
		return {
			call_entities: [],
			voicemail_entity: null,
			max_calls: 10,
			max_hours: 24,
			title: "📞 Call History"
		};
	}
	setConfig(e) {
		if (!e || !Array.isArray(e.call_entities)) throw Error("Invalid configuration: 'call_entities' must be an array.");
		this.config = {
			title: e.title || "📞 Call History",
			voicemail_entity: e.voicemail_entity || null,
			max_calls: Number.isInteger(e.max_calls) ? e.max_calls : parseInt(e.max_calls, 10) || 10,
			max_hours: Number.isFinite(e.max_hours) ? e.max_hours : parseInt(e.max_hours, 10) || 24,
			...e
		}, this.calls = [], this._lastEntityStates = {}, this._loading = !1, this._initialized = !1, this._filter = "all", this.voicemail = new ge(this);
	}
	set hass(e) {
		if (this._hass = e, !this.config || !Array.isArray(this.config.call_entities)) return;
		let t = !1;
		this.config.call_entities.forEach((n) => {
			let r = n?.entity || n, i = e.states[r];
			if (!i) {
				console.warn("Entity not found in HA:", r);
				return;
			}
			let a = this._lastEntityStates[r];
			(!a || a.state !== i.state || a.last_changed !== i.last_changed) && (t = !0, this._lastEntityStates[r] = {
				state: i.state,
				last_changed: i.last_changed
			});
		}), !this._initialized || t ? (this._initialized = !0, this._loading = !0, this.render(), this._updateHistory()) : this.render();
	}
	connectedCallback() {
		this._hass && this.render();
	}
	async _updateHistory() {
		if (!this._hass || !Array.isArray(this.config.call_entities)) return;
		let e = /* @__PURE__ */ new Date(), t = /* @__PURE__ */ new Date(e.getTime() - this.config.max_hours * 36e5), n = this.config.call_entities.map((n) => this._fetchEntityHistory(n, t, e)), r = (await Promise.all(n)).flatMap((e, t) => this._buildCallEntries(e, this.config.call_entities[t]));
		this.calls = this._mergeCallEntries(r), this._loading = !1, this.render();
	}
	async _fetchEntityHistory(e, t, n) {
		let r = e?.entity || e;
		if (!this._hass || !r) return [];
		try {
			let e = `history/period/${t.toISOString()}?filter_entity_id=${r}`;
			e += `&end_time=${n.toISOString()}`;
			let i = await this._hass.callApi("GET", e);
			return Array.isArray(i) && Array.isArray(i[0]) ? i[0] : [];
		} catch (t) {
			let n = e?.entity || e;
			return console.warn("Failed to fetch history for", n, t), [];
		}
	}
	_buildCallEntries(e, t) {
		if (!Array.isArray(e)) return [];
		let n = t?.entity || t, r = [...e].sort((e, t) => new Date(e.last_changed) - new Date(t.last_changed)), i = [];
		for (let e = 0; e < r.length; e += 1) {
			let a = r[e];
			if (![
				"talking",
				"dialing",
				"ringing"
			].includes(a.state) || a.state === "ringing" && me(r, e)) continue;
			let o = new Date(a.last_changed), s = this._getHistoryEndTime(r, e, n), c = Math.max(0, s - o);
			i.push({
				id: `${n}-${a.state}-${a.last_changed || a.last_updated || ""}`,
				number: this._extractNumber(a, t),
				headline: this._extractNumber(a, t),
				label: this._extractLabel(a, t),
				state: a.state,
				type: a.attributes?.type || "",
				time: a.state === "talking" ? a.attributes?.accepted ? new Date(a.attributes.accepted) : o : a.state === "dialing" && a.attributes?.initiated ? new Date(a.attributes.initiated) : o,
				duration: pe(c)
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
		for (let n = t + 1; n < e.length; n += 1) if (e[n].state !== r.state) return new Date(e[n].last_changed || e[n].last_updated || Date.now());
		let i = this._hass?.states?.[n];
		return i && ![
			"talking",
			"dialing",
			"ringing"
		].includes(i.state) ? new Date(i.last_changed || i.last_updated || Date.now()) : /* @__PURE__ */ new Date();
	}
	_extractNumber(e, t) {
		let n = e.attributes || {}, r = [
			t?.number_attribute,
			"with_name",
			"to_name",
			"with",
			"to",
			"from",
			"caller_id",
			"called_number",
			"number",
			"from_number",
			"to_number"
		];
		for (let t of r) {
			if (!t) continue;
			let r = t === "friendly_name" ? e.attributes?.friendly_name : n[t];
			if (typeof r == "string" && r.trim()) {
				let e = r.trim();
				if (e.toLowerCase() === "unknown") continue;
				return e;
			}
		}
		return e.entity_id;
	}
	_extractLabel(e, t) {
		let n = e.attributes || {}, r = n.with_name, i = n.with, a = n.to_name, o = n.to, s = n.from, c = (n.type || "").toLowerCase(), l = r && r.toLowerCase() !== "unknown" ? r : i, u = a && a.toLowerCase() !== "unknown" ? a : o, d = this._localize(`state.${e.state}`) || e.state;
		return e.state === "dialing" ? d = c === "outgoing" || u ? this._formatTranslation(this._localize("call.outgoing_to"), { name: u || s || this._localize("common.unknown") }) : this._formatTranslation(this._localize("call.incoming_from"), { name: s || this._localize("common.unknown") }) : e.state === "ringing" ? d = l ? this._formatTranslation(this._localize("call.missed_from"), { name: l }) : this._localize("call.missed_call") : e.state === "talking" && (d = c === "outgoing" || u ? this._formatTranslation(this._localize("call.outgoing_to"), { name: u || l || this._localize("common.unknown") }) : this._formatTranslation(this._localize("call.incoming_from"), { name: l || s || this._localize("common.unknown") })), (!d || typeof d != "string" || !d.trim()) && (d = t?.label || n.call_type || n.direction || n.source || n.destination || this._localize(`state.${e.state}`) || e.state), d.trim();
	}
	_formatTranslation(e, t = {}) {
		return typeof e == "string" ? e.replace(/\{(\w+)\}/g, (e, n) => t[n] === void 0 ? `{${n}}` : t[n]) : e;
	}
	_iconForCall(e) {
		let t = e.state === "ringing", n = e.type === "outgoing" || e.state === "dialing", r = t ? "#e53935" : n ? "#1e88e5" : "#43a047";
		return `
      <svg width="21" height="21" viewBox="0 0 24 24" aria-label="${t ? this._localize("call.missed") || "Missed" : n ? this._localize("call.outgoing") || "Outgoing" : this._localize("call.incoming") || "Incoming"}" role="img" style="vertical-align:middle; margin-right:8px;">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12 1.05.37 2.07.73 3.03a2 2 0 0 1-.45 2.11L8.91 10.91a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.96.36 1.98.61 3.03.73A2 2 0 0 1 22 16.92z" fill="none" stroke="${r}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
	}
	_setFilter(e) {
		this._filter !== e && (this._filter = e, this.render());
	}
	_localize(e, t = this._hass?.locale?.language || "en") {
		console.log("hass lang", this._hass?.locale?.language);
		let n = t.split("-")[0], r = e.split("."), i = this.langs[n];
		i ||= this.langs.en;
		for (let e of r) {
			if (i[e] === void 0) return r[0] === "weather_state" ? r[1] : this.langs.en[r[0]][r[1]];
			i = i[e];
		}
		return i;
	}
	render() {
		let e = this.config?.title || this._localize("common.call_history");
		console.log("voicemail", this.config?.voicemail_entity);
		let t = this.config?.voicemail_entity ? `
          <div style="">
            ${this.voicemail.render()}
          </div>
        ` : "", n = this._filter === "all" ? this.calls : this.calls.filter((e) => this._filter === "missed" ? e.state === "ringing" : this._filter === "outgoing" ? e.type === "outgoing" || e.state === "dialing" : this._filter === "incoming" ? !(e.type === "outgoing" || e.state === "dialing") && e.state !== "ringing" : !0), r = "padding:6px 10px; border-radius:16px; border:2px solid #ddd; background:#fff; cursor:pointer; font-size:12px;", i = "box-shadow:inset 0 0 0 2px rgba(0,0,0,0.04);", a = r + (this._filter === "all" ? i : ""), o = r + (this._filter === "missed" ? "border-color:#e0b4b4;" + i : ""), s = r + (this._filter === "outgoing" ? "border-color:#9fc8f8;" + i : ""), c = r + (this._filter === "incoming" ? "border-color:#bfe8c7;" + i : ""), l = `
      <div style="display:flex; gap:8px; margin-bottom:10px; align-items:center;">
        <button class="fbc-chip" data-filter="all" style="${a}">${this._localize("common.all") || "All"}</button>
        <button class="fbc-chip" data-filter="missed" style="${o}">${this._localize("call.missed") || "Missed"}</button>
        <button class="fbc-chip" data-filter="outgoing" style="${s}">${this._localize("call.outgoing") || "Outgoing"}</button>
        <button class="fbc-chip" data-filter="incoming" style="${c}">${this._localize("call.incoming") || "Incoming"}</button>
      </div>
    `;
		if (this._loading) {
			this.innerHTML = `
        <ha-card header="${e}">
          <div style="padding: 12px; padding-top: 0px; min-height: 120px;">
            <div>${this._localize("common.loading") || "Loading..."}</div>
          </div>
        </ha-card>
      `;
			return;
		}
		let u = `
      ${t}

      ${l}

          ${n.length === 0 ? `<div>${this._localize("common.no_calls")}</div>` : ""}
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${n.map((e) => `
              <li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                ${this._iconForCall(e)}
                <div style="">
                  <strong style="display: block; margin-bottom: 4px;">${e.headline || this._localize("common.unknown")}</strong>
                  <small style="display:block;">${e.label} · ${e.time.toLocaleTimeString()} · ${e.duration}</small>
                </div>
              </li>
            `).join("")}
          </ul>`;
		this.innerHTML = `
      <ha-card header="${e}">
        <div style="padding: 12px; padding-top: 0px; min-height: 120px;">
          ${u}
        </div>
      </ha-card>
    `, this.querySelectorAll(".fbc-chip").forEach((e) => {
			e.removeEventListener("click", e._fbcClick), e._fbcClick = (e) => this._setFilter(e.currentTarget.dataset.filter), e.addEventListener("click", e._fbcClick);
		}), this.voicemail && this.voicemail.attachEvents(this);
	}
};
customElements.define("fritzbox-call-card", _e);
//#endregion

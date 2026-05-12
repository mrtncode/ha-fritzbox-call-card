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
})(e) : e, { is: c, defineProperty: l, getOwnPropertyDescriptor: u, getOwnPropertyNames: d, getOwnPropertySymbols: f, getPrototypeOf: p } = Object, m = globalThis, h = m.trustedTypes, ee = h ? h.emptyScript : "", te = m.reactiveElementPolyfillSupport, g = (e, t) => e, _ = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ee : null;
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
}, v = (e, t) => !c(e, t), y = {
	attribute: !0,
	type: String,
	converter: _,
	reflect: !1,
	useDefault: !1,
	hasChanged: v
};
Symbol.metadata ??= Symbol("metadata"), m.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var b = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = y) {
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
		return this.elementProperties.get(e) ?? y;
	}
	static _$Ei() {
		if (this.hasOwnProperty(g("elementProperties"))) return;
		let e = p(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(g("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(g("properties"))) {
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
			let i = (n.converter?.toAttribute === void 0 ? _ : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? _ : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? v)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[g("elementProperties")] = /* @__PURE__ */ new Map(), b[g("finalized")] = /* @__PURE__ */ new Map(), te?.({ ReactiveElement: b }), (m.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var x = globalThis, S = (e) => e, C = x.trustedTypes, w = C ? C.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, T = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, D = "?" + E, ne = `<${D}>`, O = document, k = () => O.createComment(""), A = (e) => e === null || typeof e != "object" && typeof e != "function", j = Array.isArray, re = (e) => j(e) || typeof e?.[Symbol.iterator] == "function", M = "[ 	\n\f\r]", N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, P = /-->/g, F = />/g, I = RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), L = /'/g, R = /"/g, z = /^(?:script|style|textarea|title)$/i, B = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), V = Symbol.for("lit-noChange"), H = Symbol.for("lit-nothing"), U = /* @__PURE__ */ new WeakMap(), W = O.createTreeWalker(O, 129);
function G(e, t) {
	if (!j(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return w === void 0 ? t : w.createHTML(t);
}
var ie = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = N;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === N ? c[1] === "!--" ? o = P : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = I) : (z.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = I) : o = F : o === I ? c[0] === ">" ? (o = i ?? N, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? I : c[3] === "\"" ? R : L) : o === R || o === L ? o = I : o === P || o === F ? o = N : (o = I, i = void 0);
		let d = o === I && e[t + 1].startsWith("/>") ? " " : "";
		a += o === N ? n + ne : l >= 0 ? (r.push(s), n.slice(0, l) + T + n.slice(l) + E + d) : n + E + (l === -2 ? t : d);
	}
	return [G(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, K = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ie(t, n);
		if (this.el = e.createElement(l, r), W.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = W.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(T)) {
					let t = u[o++], n = i.getAttribute(e).split(E), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ae : r[1] === "?" ? oe : r[1] === "@" ? se : X
					}), i.removeAttribute(e);
				} else e.startsWith(E) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (z.test(i.tagName)) {
					let e = i.textContent.split(E), t = e.length - 1;
					if (t > 0) {
						i.textContent = C ? C.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], k()), W.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], k());
					}
				}
			} else if (i.nodeType === 8) if (i.data === D) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(E, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += E.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = O.createElement("template");
		return n.innerHTML = e, n;
	}
};
function q(e, t, n = e, r) {
	if (t === V) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = A(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = q(e, i._$AS(e, t.values), i, r)), t;
}
var J = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? O).importNode(t, !0);
		W.currentNode = r;
		let i = W.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Y(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ce(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = W.nextNode(), a++);
		}
		return W.currentNode = O, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Y = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = H, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = q(this, e, t), A(e) ? e === H || e == null || e === "" ? (this._$AH !== H && this._$AR(), this._$AH = H) : e !== this._$AH && e !== V && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? re(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== H && A(this._$AH) ? this._$AA.nextSibling.data = e : this.T(O.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = K.createElement(G(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new J(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = U.get(e.strings);
		return t === void 0 && U.set(e.strings, t = new K(e)), t;
	}
	k(t) {
		j(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(k()), this.O(k()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = S(e).nextSibling;
			S(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, X = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = H, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = H;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = q(this, e, t, 0), a = !A(e) || e !== this._$AH && e !== V, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = q(this, r[n + o], t, o), s === V && (s = this._$AH[o]), a ||= !A(s) || s !== this._$AH[o], s === H ? e = H : e !== H && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === H ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ae = class extends X {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === H ? void 0 : e;
	}
}, oe = class extends X {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== H);
	}
}, se = class extends X {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = q(this, e, t, 0) ?? H) === V) return;
		let n = this._$AH, r = e === H && n !== H || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== H && (n === H || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ce = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		q(this, e);
	}
}, le = x.litHtmlPolyfillSupport;
le?.(K, Y), (x.litHtmlVersions ??= []).push("3.3.2");
var ue = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Y(t.insertBefore(k(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Z = globalThis, Q = class extends b {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ue(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return V;
	}
};
Q._$litElement$ = !0, Q.finalized = !0, Z.litElementHydrateSupport?.({ LitElement: Q });
var $ = Z.litElementPolyfillSupport;
$?.({ LitElement: Q }), (Z.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region src/editor.js
var de = class e extends Q {
	static properties = {
		hass: {},
		_config: {}
	};
	setConfig(e) {
		this._config = {
			title: "",
			entities: [],
			max_calls: 10,
			max_hours: 24,
			...e
		};
	}
	static getConfigForm() {
		return { schema: [
			{
				name: "title",
				selector: { text: {} }
			},
			{
				name: "entities",
				selector: { entity: { multiple: !0 } }
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
	render() {
		return !this.hass || !this._config ? B`` : B`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${e.getConfigForm().schema}
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
customElements.define("fritzbox-call-card-editor", de), window.customCards = window.customCards || [], window.customCards.push({
	type: "fritzbox-call-card",
	name: "Fritzbox Call Card",
	preview: !1,
	description: "Fritzbox call card editor",
	documentationURL: "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card"
});
//#endregion
//#region src/utils.js
function fe(e) {
	if (!Number.isFinite(e) || e < 0) return "unknown";
	let t = Math.floor(e / 1e3), n = Math.floor(t / 60), r = t % 60;
	return n > 0 ? `${n}m ${r.toString().padStart(2, "0")}s` : `${r}s`;
}
function pe(e, t) {
	for (let n = t + 1; n < e.length; n += 1) {
		if (e[n].state === "talking") return !0;
		if (e[n].state === "ringing" || e[n].state === "dialing") return !1;
	}
	return !1;
}
//#endregion
//#region src/main.js
var me = class extends HTMLElement {
	static getConfigElement() {
		return document.createElement("fritzbox-call-card-editor");
	}
	static getStubConfig() {
		return {
			entities: [],
			max_calls: 10,
			max_hours: 24,
			title: "📞 Call History"
		};
	}
	setConfig(e) {
		if (!e || !Array.isArray(e.entities)) throw Error("Invalid configuration: 'entities' must be an array.");
		this.config = {
			title: e.title || "📞 Call History",
			max_calls: Number.isInteger(e.max_calls) ? e.max_calls : parseInt(e.max_calls, 10) || 10,
			max_hours: Number.isFinite(e.max_hours) ? e.max_hours : parseInt(e.max_hours, 10) || 24,
			...e
		}, this.calls = [], this._lastEntityStates = {}, this._loading = !1, this._initialized = !1;
	}
	set hass(e) {
		if (this._hass = e, !this.config || !Array.isArray(this.config.entities)) return;
		let t = !1;
		this.config.entities.forEach((n) => {
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
		if (!this._hass || !Array.isArray(this.config.entities)) return;
		let e = /* @__PURE__ */ new Date(), t = /* @__PURE__ */ new Date(e.getTime() - this.config.max_hours * 36e5), n = this.config.entities.map((n) => this._fetchEntityHistory(n, t, e)), r = (await Promise.all(n)).flatMap((e, t) => this._buildCallEntries(e, this.config.entities[t]));
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
			].includes(a.state) || a.state === "ringing" && pe(r, e)) continue;
			let o = new Date(a.last_changed), s = r[e + 1], c = s ? new Date(s.last_changed) : /* @__PURE__ */ new Date(), l = Math.max(0, c - o);
			i.push({
				id: `${n}-${a.state}-${a.last_changed || a.last_updated || ""}`,
				number: this._extractNumber(a, t),
				headline: this._extractNumber(a, t),
				label: this._extractLabel(a, t),
				state: a.state,
				time: a.state === "talking" ? a.attributes?.accepted ? new Date(a.attributes.accepted) : o : a.state === "dialing" && a.attributes?.initiated ? new Date(a.attributes.initiated) : o,
				duration: fe(l)
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
		let n = e.attributes || {}, r = n.with_name, i = n.with, a = n.to_name, o = n.to, s = n.from, c = (n.type || "").toLowerCase(), l = r && r.toLowerCase() !== "unknown" ? r : i, u = a && a.toLowerCase() !== "unknown" ? a : o, d = e.state;
		return e.state === "dialing" ? d = c === "outgoing" || u ? `Outgoing call to ${u || s || "unknown"}` : `Incoming call from ${s || "unknown"}` : e.state === "ringing" ? d = l ? `Missed call from ${l}` : "Missed call" : e.state === "talking" && (d = c === "outgoing" || u ? `Outgoing call to ${u || l || "unknown"}` : `Incoming call from ${l || s || "unknown"}`), (!d || typeof d != "string" || !d.trim()) && (d = t?.label || n.call_type || n.direction || n.source || n.destination || e.state), d.trim();
	}
	render() {
		let e = this.config?.title || "📞 Call History", t = this._loading ? "<div>Loading call history...</div>" : this.calls.length === 0 ? "<div>No calls yet</div>" : `<ul style="list-style: none; padding: 0; margin: 0;">
            ${this.calls.map((e) => `
              <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <strong style="display: block; margin-bottom: 4px;">${e.headline || "Unknown"}</strong>
                <small>${e.label} · ${e.time.toLocaleTimeString()} · ${e.duration}</small>
              </li>
            `).join("")}
          </ul>`;
		this.innerHTML = `
      <ha-card header="${e}">
        <div style="padding: 12px; min-height: 120px;">
          ${t}
        </div>
      </ha-card>
    `;
	}
};
customElements.define("fritzbox-call-card", me);
//#endregion

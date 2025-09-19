var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './Footer.css';
var Footer = function () {
    return (_jsx("footer", { children: _jsxs("p", { children: ["Desenvolvido de \u2665 por ", _jsx("a", __assign({ href: "https://orodrigobraz.github.io/", target: "_blank", rel: "noopener noreferrer" }, { children: "Rodrigo Braz" }))] }) }));
};
export default Footer;

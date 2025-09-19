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
import { useTimer } from '../contexts/TimerContext';
import './Header.css';
var Header = function () {
    var currentMode = useTimer().currentMode;
    return (_jsx("header", __assign({ className: "header" }, { children: _jsxs("div", __assign({ className: "header-content" }, { children: [_jsx("div", __assign({ className: "header-icon ".concat(currentMode) }, { children: _jsx("i", { className: "fas fa-check-circle" }) })), _jsx("h1", __assign({ className: "header-title" }, { children: _jsx("a", __assign({ href: "https://pomofocus.io/", target: "_blank", rel: "noopener noreferrer", className: "header-link" }, { children: "Pomofocus Clone" })) }))] })) })));
};
export default Header;

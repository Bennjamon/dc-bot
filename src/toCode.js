const { Collection } = require("discord.js");

function toCode(obj, ident = "\t", idents = 1, i = 0) {
    console.log(i);
    if (i > 4300) {
        throw "el objeto tiene demasiados atributos"
    }
    switch (typeof obj) {
        case "number":
            return `${obj}`;
            break;
        case "string":
            return `"${obj}"`;
            break;
        case "undefined":
            return `undefined`
            break;
        case "object":
            if (obj == null) {
                return "null";
            }
            if (Array.isArray(obj)) {
                return `[\n${ident.repeat(idents)}${obj.map(e => `${toCode(e, ident, idents + 1, ++i)}`).join(`,\n${ident.repeat(idents)}`)}\n${ident.repeat(idents - 1)}]`;
            } else if (obj.constructor == RegExp) {
                return obj.toString()
            } else if (Object.keys(obj).length || obj.constructor == Object) {
                const array = [];
                for (const key in obj) {
                    const value = toCode(obj[key], ident, idents + 1, ++i);
                    
                    if (value != "" && value.replace(/(\n|\t|\r)/g, "") != "{}" && value.replace(/(\n|\t|\r)/g, "") != "[]") {
                        array.push(`${key}: ${value}`);
                    }
                }
                return `${obj.constructor.name} {\n${ident.repeat(idents)}${array.join(`,\n${ident.repeat(idents)}`)}\n${ident.repeat(idents - 1)}}`;
            } else if (obj.constructor == Map) {
                const values = Array.from(obj.keys()).map(v => `${toCode(v, '', 0, ++i)} => ${toCode(obj.get(v), ident, idents + 1, ++i)}`)
                return `Map (${obj.size}) {
${ident.repeat(idents)}${values.join(`,
${ident.repeat(idents)}`)}
${ident.repeat(idents - 1)}}`
            } else if (obj.constructor == Collection) {
                const values = Array.from(obj.keys()).map(v => `${toCode(v, '', 0, ++i)}: ${toCode(obj.get(v), ident, idents + 1, ++i)}`)
                return `Collection (${obj.size}) {
${ident.repeat(idents)}${values.join(`,
${ident.repeat(idents)}`)}
${ident.repeat(idents - 1)}}`
            } else {
                return `[Object ${obj.constructor.name}]`;
            }
            break;
            case "function":
                if (`${obj}`.length > 30 && idents > 1) {
                    switch (obj.constructor.name) {
                        case "Function":
                            return "Function"
                        case "AsyncFunction": 
                            return "[AsyncFunction]"
                    }
                } else {
                    return `${obj}`.indexOf(obj.name) < `${obj}`.indexOf("(") ? `${obj}`.replace(obj.name, "") : `${obj}`
                }
                break;
            case "boolean":
                return `${obj}`
        }
}
module.exports = toCode
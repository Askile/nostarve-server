"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const acorn = __importStar(require("acorn"));
class NoscriptInterpreter {
    server;
    stack;
    constructor(server) {
        this.server = server;
        this.stack = [];
    }
    handleNode(node) {
        switch (node.type) {
            case "Program":
                {
                    for (const statement of node.body) {
                        this.handleNode(statement);
                    }
                }
                break;
            case "ExpressionStatement":
                {
                    this.handleNode(node.expression);
                }
                break;
            case "FunctionDeclaration":
                {
                    this.handleNode(node.body);
                }
                break;
            case "BlockStatement":
                {
                    for (const statement of node.body) {
                        this.handleNode(statement);
                    }
                }
                break;
            case "VariableDeclaration":
                {
                    for (const declaration of node.declarations) {
                        this.handleNode(declaration.init);
                    }
                }
                break;
            case "VariableDeclarator":
                {
                    this.handleNode(node.init);
                }
                break;
            case "AssignmentExpression":
                {
                    this.handleNode(node.right);
                }
                break;
            case "MemberExpression":
                {
                    this.handleNode(node.object);
                    this.handleNode(node.property);
                }
                break;
            case "CallExpression":
                {
                    const matches = node.callee?.name?.match(/\brequire\b|\bimport\b|\beval\b|\bFunction\b|\bglobal\b/g);
                    if (matches?.length > 0) {
                        this.server.logger.error(`[Noscript] Call ${node.callee.name} not allowed`);
                    }
                    this.handleNode(node.callee);
                    for (const argument of node.arguments) {
                        this.handleNode(argument);
                    }
                }
                break;
            case "Identifier":
                {
                    const matches = node.name.match(/\brequire\b|\bimport\b|\beval\b|\bFunction\b|\bglobal\b/g);
                    if (matches?.length > 0) {
                        this.server.logger.error(`[Noscript] Call ${node.name} not allowed`);
                    }
                }
                break;
        }
    }
    interpret(script) {
        const parsed = acorn.parse(script, { ecmaVersion: "latest" });
        this.handleNode(parsed);
    }
}
exports.default = NoscriptInterpreter;

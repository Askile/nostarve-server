import {Server} from "../server";
import * as acorn from "acorn";
export default class NoscriptInterpreter {
    private server: Server;
    private stack: any;
    constructor(server: Server) {
        this.server = server;
        this.stack = [];
    }

    public handleNode(node: any) {
        switch (node.type) {
            case "Program": {
                for (const statement of node.body) {
                    this.handleNode(statement);
                }
            } break;
            case "ExpressionStatement": {
                this.handleNode(node.expression);
            } break;
            case "FunctionDeclaration": {
                this.handleNode(node.body);
            } break;
            case "BlockStatement": {
                for (const statement of node.body) {
                    this.handleNode(statement);
                }
            } break;
            case "VariableDeclaration": {
                for (const declaration of node.declarations) {
                    this.handleNode(declaration.init);
                }
            } break;
            case "VariableDeclarator": {
                this.handleNode(node.init);
            } break;
            case "AssignmentExpression": {
                this.handleNode(node.right);
            } break;
            case "MemberExpression": {
                this.handleNode(node.object);
                this.handleNode(node.property);
            } break;
            case "CallExpression": {
                const matches = node.callee?.name?.match(/\brequire\b|\bimport\b|\beval\b|\bFunction\b|\bglobal\b/g);
                if(matches?.length > 0) {
                    this.server.logger.error(`[Noscript] Call ${node.callee.name} not allowed`);
                }
                this.handleNode(node.callee);
                for (const argument of node.arguments) {
                    this.handleNode(argument);
                }
            } break;
            case "Identifier": {
                const matches = node.name.match(/\brequire\b|\bimport\b|\beval\b|\bFunction\b|\bglobal\b/g);

                if(matches?.length > 0) {
                    this.server.logger.error(`[Noscript] Call ${node.name} not allowed`);
                }
            } break;
        }
    }

    public interpret(script: string) {

        const parsed = acorn.parse(script, {ecmaVersion: "latest"});
        this.handleNode(parsed);
    }

}
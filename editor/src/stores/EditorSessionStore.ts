/**
 * Editor session
 */

import { observable, action, computed } from 'mobx';
// tslint:disable-next-line:no-require-imports no-var-requires no-require-imports
const recast = require('recast');
import ComponentsKit from './ComponentsKit';
import ComponentMeta, { IComponentExport, IComponentProp } from './ComponentMeta';
import startSnippet from './startSnippet';
import {
    getAllImportDeclarations,
    findNodeInEditorPosition,
    addImportStatementForComponent,
    findImportDeclartionOfComponent,
    extractPropsFromComponent
} from '../services/astHelper';
import componentPropsTypes from '../services/componentPropType';

export interface IEditorSessionComponentProps extends IComponentProp {
    model: any;
}

import { Model as TextModel } from './../knobs/text';
import { Model as BooleanModel } from './../knobs/boolean';

export class EditorSession {
    @observable public code: string;
    public ast: any;
    @observable public highlightedNode: any;
    @observable public highlightedNodeParent: any;
    @observable public componentKit: ComponentsKit;
    public importDeclarations: any[];
    @observable public componentsMeta: ComponentMeta;
    @observable public componentNode: any;
    @observable public cursorPosion: any;
    @observable public props: IEditorSessionComponentProps[];
    @observable public componentSearchText: string;

    constructor() {
        this.componentKit = new ComponentsKit();
        this.code = startSnippet;
        this.importDeclarations = [];
        this.highlightedNode = null;
        this.componentsMeta = null;
        this.props = [];
        this.cursorPosion = null;
        this.componentSearchText = '';
    }

    @action
    public updateCode = (code: string) => {
        this.code = code;
        this.generateAst();
    }

    @action
    public setCode = (code: string, position: { row: number, column: number }) => {
        this.cursorPosion = position;
        this.code = code;
        this.generateAst();
        this.updatePropsModelWithNewValues();
        //this.findNode(this.cursorPosion);
    }

    @action
    public addComponent = (id: string) => {
        const component = this.componentKit.getComponentById(id);
        this.addImport(component.exported);
    }

    @action
    public addImport = (componentExport: IComponentExport) => {
        this.generateAst();
        addImportStatementForComponent(componentExport, componentExport.moduleName, this.ast);
        this.regenerateCode();
    }

    public getComponentSnippet = (componentMeta: ComponentMeta) => {
        return `<${componentMeta.name} />`;
    }

    @action
    public findNode = (position: { row: number, column: number }) => {
        this.generateAst();
        const nodeInPositionWithParent = findNodeInEditorPosition(position, this.ast);
        this.highlightedNode = nodeInPositionWithParent.node;
        this.highlightedNodeParent = nodeInPositionWithParent.parentNode;
        this.componentNode = nodeInPositionWithParent.componentNode;
        this.importDeclarations = getAllImportDeclarations(this.ast);
        const declaration = findImportDeclartionOfComponent(
            this.highlightedNode,
            this.highlightedNodeParent,
            this.importDeclarations
        );

        if (declaration) {
            const componentMeta = this.componentKit.getComponentMeta(declaration);
            this.componentsMeta = componentMeta;
        }

        this.buildMetaPropsWithModel();
        this.updatePropsModelWithNewValues();
    }

    @action
    public buildMetaPropsWithModel = () => {
        if (!this.componentsMeta) {
            return;
        }

        this.props = [];
        for (const prop of this.componentsMeta.props) {
            let model = null;

            if (prop.propType === componentPropsTypes.string) {
                model = new TextModel(prop.name, this.componentNode);
            } else if (prop.propType === componentPropsTypes.boolean) {
                model = new BooleanModel(prop.name, this.componentNode);
            }

            const propWithModel = {
                name: prop.name,
                propType: prop.propType,
                defaultValue: prop.defaultValue,
                required: prop.required,
                model
            };

            this.props.push(propWithModel);
        }
    }

    @action
    public updatePropsModelWithNewValues = () => {
        const updatedProps = extractPropsFromComponent(this.componentNode);
        Object.keys(updatedProps).forEach((key) => {
            for (const modelProps of this.props) {
                if (modelProps.name === key) {
                    modelProps.model.setValue(updatedProps[key]);
                }
            }
        });
    }

    @action
    public regenerateCode = () => {
        this.code = recast.prettyPrint(this.ast, { tabWidth: 2 }).code;
    }

    @action
    public generateAst = () => {
        this.ast = recast.parse(this.code, {
            tolerant: false, jsx: true, range: true
        });
    }

    @computed
    public get filteredComponent() {
        const myRegExp = new RegExp(this.componentSearchText, 'i');
        return this.componentKit.components.filter((component) => {
            return myRegExp.test(component.name);
        });
    }

    @action
    public setFitlerText = (text: string) => {
        this.componentSearchText = text;
    }
}

export default new EditorSession();

/**
 * Property panel row
 */

import * as React from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@blueprintjs/core';
import { IEditorSessionComponentProps } from '../../stores/EditorSessionStore';
import {Component as TextKnob} from '../../knobs/text';
import {Component as BooleanKnob} from '../../knobs/boolean';
import {Component as NumberKnob} from '../../knobs/number';
import {Component as DropdownKnob} from '../../knobs/dropdown';
import componentPropTypes from '../../services/componentPropType';


interface IRowProps {
    componentProps: IEditorSessionComponentProps;
    componentNode: any;
    onChange: () => void;
}

@observer
export default class Row extends React.Component<IRowProps, {}> {
    public render() {
        let knob = null;

        if (this.props.componentProps.propType === componentPropTypes.string) {
            knob = <TextKnob model={this.props.componentProps.model} onChange={this.props.onChange} />;
        } else if (this.props.componentProps.propType === componentPropTypes.boolean) {
            knob = <BooleanKnob model={this.props.componentProps.model} onChange={this.props.onChange} />;
        } else if (this.props.componentProps.propType === componentPropTypes.number) {
            knob = <NumberKnob model={this.props.componentProps.model} onChange={this.props.onChange} />;
        } else if (this.props.componentProps.propType === componentPropTypes.options) {
            knob = <DropdownKnob model={this.props.componentProps.model} onChange={this.props.onChange} />
        }

        return (
            <tr>
                <td style={{width: '200px'}}>
                    <h6>
                        <Tooltip
                            className='pt-tooltip-indicator'
                            content={<p className='property-description'>{this.props.componentProps.description}</p>}
                        >
                            {this.props.componentProps.name}
                        </Tooltip>
                        {
                            this.props.componentProps.required
                            && <span className='pt-tag pt-minimal pt-intent-success'>Required</span>
                        }
                    </h6>
                </td>
                <td>
                    {knob}
                </td>
            </tr>
        );
    }
}
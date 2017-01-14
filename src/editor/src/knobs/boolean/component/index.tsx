/**
 * Boolean component
 */

import * as React from 'react';
import { Checkbox } from '@blueprintjs/core';
import { observer } from 'mobx-react';
import Model from '../model';

interface IBooleanComponentProps {
    model: Model;
    onChange: (model: Model) =>  void;
}

@observer
export default class BooleanComponent extends React.Component<IBooleanComponentProps, {}> {
    public onChange = (value) => {
        this.props.model.setValue(value.target.checked);
        this.props.onChange(this.props.model);
    }

    public render() {
        return (
            <Checkbox checked={this.props.model.isTrue} onChange={this.onChange}/>
        );
    }
} 
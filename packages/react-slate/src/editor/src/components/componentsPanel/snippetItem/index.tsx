/**
 * Component panel item
 */

import * as React from 'react';
import ComponentMeta from '../../../stores/ComponentMeta';
// tslint:disable-next-line:no-require-imports no-var-requires no-require-imports
const { DragSource } = require('react-dnd');
import { ISnippet } from '../../../services/snippetService';

const knightSource = {
    beginDrag(props) {
        return {
            detail: props.detail
        };
    },

    endDrag(props, monitor) {
        const item = monitor.getItem();
        props.onDropped(item.detail);
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

interface IActionMiniProps {
    detail: ISnippet;
    connectDragSource?: any;
    isDragging?: boolean;
    onDropped?: (detail: any) => void;
}

@DragSource('ACTION', knightSource, collect)
export default class ComponentItem extends React.Component<IActionMiniProps, {}> {
    public render() {
        const { connectDragSource } = this.props;
        return connectDragSource(
            <div
                className='pt-card pt-elevation-0 pt-interactive slate-component-item'
                style={{height: '65px', padding: '11px', marginBottom: '5px', marginRight: '5px', marginLeft: '5px'}}
            >
                <h6>
                    <span className='pt-icon pt-icon-code' />{' '}
                    {this.props.detail.name}
                </h6>
                <p>{this.props.detail.description}</p>
            </div>
        );
    }
}

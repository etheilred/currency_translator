import React from 'react';

const SymbolSelector = (props) => (
    <select onChange={props.onChange}>
        {props.symbols.map(x => {
            if (x === props.default) return <option key={x} selected='selected'>{x}</option>
            else return <option key={x}>{x}</option>
        })}
    </select>
);

export default SymbolSelector;
import React from 'react'
import Select, { components } from 'react-select';

const MenuList = props => {
    return (
        <components.MenuList {...props} style={{}} >
            <div className='imageSelection'>
                {props.children}
            </div>
        </components.MenuList>
    );
}

const dot = (color = '#ccc') => ({
    alignItems: 'center',
    display: 'flex',
    padding: 1,

    ':before': {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: 'block',
        marginRight: 8,
        height: 10,
        width: 10,
    },
});

const colourStyles = {
    control: (base, state) => ({
        ...base,
        height: '34px',
        minHeight: '34px',
    }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
};

export default class extends React.PureComponent {

    render() {                      
        return (
            <Select
                style={{ fontSize: 25, backgroundColor: 'blue' }}
                classNamePrefix="selectImages"
                styles={colourStyles}
                isSearchable                
                closeOnSelect={false}
                components={{ MenuList }}                
                {...this.props}
                closeMenuOnSelect={false}
            />
        )
    }
}

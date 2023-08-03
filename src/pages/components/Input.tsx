import React, {useState} from 'react';

interface Props {
    placeholder: string;
    height: string;
    width: string;
    indent?: string;
    onChange: (value: string) => void;
    onEnterPress: (value: string) => void;
}

const Input: React.FC<Props> = ({onChange, onEnterPress, placeholder, height, width, indent}) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        onChange(value);
    };

    const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onEnterPress(inputValue);
        }
    }

    return (
        <input
            type="text"
            value={inputValue}
            placeholder={placeholder}
            onChange={handleInputChange}
            onKeyDown={handleEnterPress}
            className="shadow-sm focus:border-amber-600 focus:border-2"
            style={{
                height: height,
                width: width,
                display: 'flex',
                fontSize: '16px',
                textIndent: indent ? indent : '10px',
                color: '#212529',
                border: '1px solid #9ca3af',
                borderRadius: '6px',
            }}
        />
    );
};

export default Input;
import './TextArea.scss'

import React, {useRef} from 'react';
import useAutosize from "./useAutosize.ts";


interface TextAreaProps {
    className?: string,
    value: string;
    onChange: (value : string) => void;
    placeholder?: string;
}


export default ({className = "", value, onChange, placeholder = ""}: TextAreaProps) => {

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useAutosize(textAreaRef.current, value);

    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target?.value;
        onChange(val);
    };

    return (
        <textarea
            className={`text-area ${className}`}
            spellCheck={false}
            onChange={handleChange}
            placeholder={placeholder}
            ref={textAreaRef}
            rows={1}
            value={value}
        />
    );
}


//
//     return <textarea
//         className={"text-area"}
//         value = {props.value}
//         onChange={(event) => resize(event, 20)}
//         onCut={delayedResize}
//         onPaste={delayedResize}
//         onDrop={delayedResize}
//         onKeyDown={delayedResize}
//         {...props}
//     />;
//
//
// }
//
//
//
//
//
//
//
//
//

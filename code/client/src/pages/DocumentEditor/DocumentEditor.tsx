import React from "react";
import './DocumentEditor.scss'
import Textarea from "../../core/components/TextArea/TextArea.tsx";
import Container from "../../core/components/Container/Container.tsx";

export default function DocumentEditor() {
    const [text, setText] = React.useState("");

    const handleChange = (value :string) => {
        setText(value);
    }

    return (
        <Container className = 'editor-content-container'>
            <h1 style={{color:"black"}}>Document Editor</h1>
            <Container className = 'editor-page-container'>
                <Textarea
                    className={"editor-text-area"}
                    value={text}
                    onChange={handleChange}
                />
            </Container>
        </Container>
    );
}

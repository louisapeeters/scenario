import React from 'react';
import SharedEditor from '../components/SharedEditor';

export default function AddScenarioPage({ addScenario }) {
    async function handleSave(title, text, formatSegments) {
        await addScenario(title, text, formatSegments);
    }

    return (
        <SharedEditor
            initialTitle=""
            initialText=""
            initialFormatSegments={[]}
            onSave={handleSave}
            saveButtonText="Save"
        />
    );
}
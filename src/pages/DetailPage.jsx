import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SharedEditor from '../components/SharedEditor';

function buildFormatSegmentsFromText(text, defaultFormat = 'narration') {
    if (!text) return [];
    return [{
        start: 0,
        end: text.length,
        format: defaultFormat
    }];
}

export default function DetailPage({ scenarios, updateScenario }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const scenario = useMemo(() => {
        return scenarios.find((s) => s.id === Number(id)) || {};
    }, [scenarios, id]);

    async function handleSave(title, text, formatSegments) {
        await updateScenario(Number(id), title, text, formatSegments);
    }

    if (!scenario.id) {
        return (
            <div className="editor-layout">
                <div className="editor-sidebar">
                    <div className="sidebar-header">
                        <h2 className="sidebar-title">Scenario not found</h2>
                        <div className="sidebar-actions">
                            <button className="back-button" onClick={() => navigate('/')}>
                                ← Back
                            </button>
                        </div>
                    </div>
                </div>
                <div className="editor-main">
                    <div className="editor-workspace">
                        <p>The requested scenario could not be found.</p>
                    </div>
                </div>
            </div>
        );
    }

    const formatSegments = scenario.formatsegments && Array.isArray(scenario.formatsegments) && scenario.formatsegments.length > 0
        ? scenario.formatsegments
        : buildFormatSegmentsFromText(scenario.text || '');

    return (
        <SharedEditor
            initialTitle={scenario.title || ''}
            initialText={scenario.text || ''}
            initialFormatSegments={formatSegments}
            onSave={handleSave}
            saveButtonText="Update"
        />
    );
}
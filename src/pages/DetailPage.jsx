import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef } from 'react';
import EditorToolbar from '../components/EditorToolbar';
import '../styles/editor.css';
import '../styles/buttons.css';

// Helper to build format segments from text
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
    const textAreaRef = useRef(null);
    const displayRef = useRef(null);

    const scenario = useMemo(() => {
        return scenarios.find((s) => s.id === Number(id)) || {};
    }, [scenarios, id]);

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [currentFormat, setCurrentFormat] = useState('narration');
    const [formatSegments, setFormatSegments] = useState([]);

    useEffect(() => {
        setTitle(scenario.title || '');
        setText(scenario.text || '');

        if (scenario.formatsegments && Array.isArray(scenario.formatsegments) && scenario.formatsegments.length > 0) {
            setFormatSegments(scenario.formatsegments);
        } else {
            setFormatSegments(buildFormatSegmentsFromText(scenario.text || ''));
        }
    }, [scenario]);

    const syncCursor = () => {
        if (textAreaRef.current && displayRef.current) {
            // Placeholder for cursor syncing logic if needed
        }
    };

    async function handleSave() {
        setIsSaving(true);
        try {
            const updatedSegments = buildFormatSegmentsFromText(text, currentFormat);
            await updateScenario(Number(id), title, text, updatedSegments);
            navigate('/');
        } catch (error) {
            console.error('Save error:', error);
        } finally {
            setIsSaving(false);
        }
    }

    function handleTextChange(e) {
        const newText = e.target.value;
        setText(newText);
        setFormatSegments(buildFormatSegmentsFromText(newText, currentFormat));
        setTimeout(syncCursor, 0);
    }

    function getFormattedTextDisplay() {
        if (!text || formatSegments.length === 0) {
            return <span style={{ fontFamily: "'Times New Roman', serif", fontSize: '12pt' }}>{text}</span>;
        }

        const elements = [];
        let lastEnd = 0;
        const sortedSegments = [...formatSegments].sort((a, b) => a.start - b.start);

        sortedSegments.forEach((segment, index) => {
            if (segment.start > lastEnd) {
                elements.push(
                    <span key={`unformatted-${index}`} style={getFormatStyle('narration')}>
                        {text.substring(lastEnd, segment.start)}
                    </span>
                );
            }

            elements.push(
                <span key={`segment-${index}`} style={getFormatStyle(segment.format)}>
                    {text.substring(segment.start, segment.end)}
                </span>
            );

            lastEnd = segment.end;
        });

        if (lastEnd < text.length) {
            elements.push(
                <span key="final-unformatted" style={getFormatStyle('narration')}>
                    {text.substring(lastEnd)}
                </span>
            );
        }

        return <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{elements}</div>;
    }

    function getFormatStyle(format) {
        const baseStyle = {
            fontFamily: "'Times New Roman', serif",
            fontSize: '12pt',
            lineHeight: 1.6,
            color: '#000'
        };

        switch (format) {
            case 'location':
                return {
                    ...baseStyle,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    display: 'block',
                    textAlign: 'left'
                };
            case 'character':
                return {
                    ...baseStyle,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    display: 'block',
                    textAlign: 'center'
                };
            case 'dialogue':
                return {
                    ...baseStyle,
                    display: 'block',
                    textAlign: 'center',
                    maxWidth: '20rem',
                    margin: '0 auto'
                };
            case 'emotion':
                return {
                    ...baseStyle,
                    fontStyle: 'italic',
                    display: 'block',
                    textAlign: 'center',
                    maxWidth: '20rem',
                    margin: '0 auto'
                };
            case 'narration':
            default:
                return {
                    ...baseStyle,
                    display: 'block',
                    textAlign: 'left'
                };
        }
    }

    function handleDisplayClick() {
        if (textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }

    const handleKeyDown = () => {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.classList.contains('toolbar-title-input') || activeElement.classList.contains('title-input'))) {
            return;
        }

        if (textAreaRef.current && document.activeElement !== textAreaRef.current) {
            textAreaRef.current.focus();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

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

    function getTextAlign(format) {
        switch (format) {
            case 'character':
            case 'dialogue':
            case 'emotion':
                return 'center';
            case 'location':
            case 'narration':
            default:
                return 'left';
        }
    }

     return (
            <div className="editor-layout">
                <div className="editor-sidebar">
                    <div className="tools">
                     <div className="toolbar-input-wrapper">
                         <input
                             type="text"
                             className="toolbar-title-input"
                             placeholder="Document Title"
                             value={title}
                             onChange={(e) => setTitle(e.target.value)}
                         />
                     </div>
                    </div>
    
                    <div className="sidebar-header">
                        <div className="sidebar-actions">
                            <button className="back-button" onClick={() => navigate('/')}>← Back</button>
                            <button
                                className="save-button"
                                onClick={handleSave}
                                disabled={isSaving || !title.trim() || !text.trim()}
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
    
                    <EditorToolbar
                        currentFormat={currentFormat}
                        setCurrentFormat={setCurrentFormat}
                        textAreaRef={textAreaRef}
                        text={text}
                        title={title}
                        setTitle={setTitle}
                        formatSegments={formatSegments}
                        contentExportId="content-to-export"
                    />
                    <div className="sidebar-spacer"></div>
                </div>
    
                <div className="editor-main">
                    <div className="editor-workspace">
                        <div className="document-page">
                            <div className="format-indicator">
                                {currentFormat.charAt(0).toUpperCase() + currentFormat.slice(1)}
                            </div>
                            <div style={{ position: 'relative', minHeight: '600px' }}>
                                <div
                                    ref={displayRef}
                                    className="document-display"
                                    onClick={handleDisplayClick}
                                    style={{
                                        minHeight: '600px',
                                        cursor: 'text',
                                        padding: '1rem',
                                        border: '2px solid #ddd',
                                        borderRadius: '4px',
                                        backgroundColor: 'white',
                                        position: 'relative',
                                        zIndex: 1
                                    }}
                                >
                                    {text ? getFormattedTextDisplay() : (
                                        <span style={{ color: '#999', fontStyle: 'italic' }}>
                                            Start typing your scenario here...
                                        </span>
                                    )}
                                </div>
    
                                <textarea
                                    ref={textAreaRef}
                                    value={text}
                                    onChange={handleTextChange}
                                    onSelect={syncCursor}
                                    placeholder="Start typing your scenario here..."
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        padding: '1rem',
                                        border: '2px solid transparent',
                                        borderRadius: '4px',
                                        backgroundColor: 'transparent',
                                        color: 'transparent',
                                        caretColor: 'black',
                                        fontSize: '12pt',
                                        fontFamily: "'Times New Roman', serif",
                                        lineHeight: 1.6,
                                        resize: 'none',
                                        outline: 'none',
                                        zIndex: 2,
                                        overflow: 'hidden',
                                        textAlign: getTextAlign(currentFormat),
                                        textTransform: ['character', 'location'].includes(currentFormat) ? 'uppercase' : 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
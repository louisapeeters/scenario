import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditorToolbar from './EditorToolbar';
import '../styles/editor.css';
import '../styles/buttons.css';

export default function SharedEditor({
    initialTitle = '',
    initialText = '',
    initialFormatSegments = [],
    onSave,
    saveButtonText = 'Save'
}) {
    const [title, setTitle] = useState(initialTitle);
    const [text, setText] = useState(initialText);
    const [isSaving, setIsSaving] = useState(false);
    const [currentFormat, setCurrentFormat] = useState('location');
    const [formatSegments, setFormatSegments] = useState(initialFormatSegments);
    const [previousFormat, setPreviousFormat] = useState('location');
    const navigate = useNavigate();
    const textAreaRef = useRef(null);
    const displayRef = useRef(null);

    useEffect(() => {
        setTitle(initialTitle);
        setText(initialText);
        setFormatSegments(initialFormatSegments);
    }, [initialTitle, initialText, initialFormatSegments]);

    const syncCursor = () => {
        if (textAreaRef.current && displayRef.current) {
        }
    };

    async function handleSave() {
        if (title.trim() && text.trim()) {
            setIsSaving(true);
            try {
                await onSave(title, text, formatSegments);
                navigate('/');
            } catch (error) {
                console.error('Save error:', error);
            } finally {
                setIsSaving(false);
            }
        }
    }

    function handleTextChange(e) {
        const newText = e.target.value;
        const cursorPos = e.target.selectionStart;
        const oldTextLength = text.length;
        const newTextLength = newText.length;

        if (newTextLength > oldTextLength) {
            const addedLength = newTextLength - oldTextLength;
            const insertPos = cursorPos - addedLength;

            const updatedSegments = formatSegments.map(segment => {
                if (segment.end <= insertPos) return segment;
                if (segment.start >= insertPos) {
                    return {
                        ...segment,
                        start: segment.start + addedLength,
                        end: segment.end + addedLength
                    };
                }
                return {
                    ...segment,
                    end: segment.end + addedLength
                };
            });

            const newSegment = {
                start: insertPos,
                end: insertPos + addedLength,
                format: currentFormat
            };

            const mergedSegments = mergeAdjacentSegments([...updatedSegments, newSegment]);
            setFormatSegments(mergedSegments);
        } else if (newTextLength < oldTextLength) {
            const deletedLength = oldTextLength - newTextLength;
            const deletePos = cursorPos;

            const updatedSegments = formatSegments
                .map(segment => {
                    if (segment.end <= deletePos) return segment;
                    if (segment.start >= deletePos + deletedLength) {
                        return {
                            ...segment,
                            start: segment.start - deletedLength,
                            end: segment.end - deletedLength
                        };
                    }
                    if (segment.start >= deletePos && segment.end <= deletePos + deletedLength) return null;
                    if (segment.start < deletePos && segment.end > deletePos + deletedLength) {
                        return {
                            ...segment,
                            end: segment.end - deletedLength
                        };
                    }
                    if (segment.start < deletePos) {
                        return {
                            ...segment,
                            end: deletePos
                        };
                    }
                    return {
                        ...segment,
                        start: deletePos,
                        end: segment.end - deletedLength
                    };
                })
                .filter(segment => segment && segment.start < segment.end);

            setFormatSegments(updatedSegments);
        }

        setText(newText);
        setTimeout(syncCursor, 0);
    }

    function mergeAdjacentSegments(segments) {
        if (segments.length <= 1) return segments;
        const sorted = segments.sort((a, b) => a.start - b.start);
        const merged = [sorted[0]];

        for (let i = 1; i < sorted.length; i++) {
            const current = sorted[i];
            const last = merged[merged.length - 1];

            if (last.end === current.start && last.format === current.format) {
                last.end = current.end;
            } else {
                merged.push(current);
            }
        }

        return merged;
    }

    // Custom format change handler
    function handleFormatChange(newFormat) {
        if (textAreaRef.current) {
            const cursorPos = textAreaRef.current.selectionStart;
            let newText = text;
            let newCursorPos = cursorPos;

            // Handle description (narration) formatting with extra lines
            if (newFormat === 'narration') {
                // Add extra line above description (unless previous format was location)
                if (previousFormat !== 'location' && newCursorPos > 0 && newText[newCursorPos - 1] !== '\n') {
                    newText = newText.slice(0, newCursorPos) + '\n' + newText.slice(newCursorPos);
                    newCursorPos = newCursorPos + 1;
                }
            }

            // Handle switching away from description (narration) - add extra line below
            if (previousFormat === 'narration' && newFormat !== 'narration') {
                if (newCursorPos > 0 && newText[newCursorPos - 1] !== '\n') {
                    newText = newText.slice(0, newCursorPos) + '\n' + newText.slice(newCursorPos);
                    newCursorPos = newCursorPos + 1;
                }
            }

            // Update text and format segments if changes were made
            if (newText !== text) {
                setText(newText);

                // Update format segments for the added line break(s)
                const updatedSegments = formatSegments.map(segment => {
                    const addedLength = newText.length - text.length;
                    if (segment.start >= cursorPos) {
                        return {
                            ...segment,
                            start: segment.start + addedLength,
                            end: segment.end + addedLength
                        };
                    } else if (segment.end > cursorPos) {
                        return {
                            ...segment,
                            end: segment.end + addedLength
                        };
                    }
                    return segment;
                });

                const addedLength = newText.length - text.length;
                if (addedLength > 0) {
                    const newSegment = {
                        start: cursorPos,
                        end: cursorPos + addedLength,
                        format: 'narration'
                    };
                    setFormatSegments(mergeAdjacentSegments([...updatedSegments, newSegment]));
                }

                // Set cursor position after the added line break(s)
                setTimeout(() => {
                    if (textAreaRef.current) {
                        textAreaRef.current.selectionStart = newCursorPos;
                        textAreaRef.current.selectionEnd = newCursorPos;
                    }
                }, 0);
            }

            // Update previous format AFTER handling the current format change
            setPreviousFormat(currentFormat);
        }

        setCurrentFormat(newFormat);
    }



    // Handle key press for special formatting
    function handleKeyDown() {
        // Regular Enter key handling - no special emotion logic needed

        // Existing key handling
        const active = document.activeElement;
        if (active?.classList.contains('toolbar-title-input') || active?.classList.contains('title-input')) return;

        if (textAreaRef.current && active !== textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }

    useEffect(() => {
        const textarea = textAreaRef.current;
        if (textarea) {
            textarea.addEventListener('keydown', handleKeyDown);
            return () => textarea.removeEventListener('keydown', handleKeyDown);
        }
    }, [currentFormat, text, formatSegments]);

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
                return { ...baseStyle, fontWeight: 'bold', textTransform: 'uppercase', display: 'block', textAlign: 'left' };
            case 'character':
                return { ...baseStyle, fontWeight: 'bold', textTransform: 'uppercase', display: 'block', textAlign: 'center' };
            case 'dialogue':
                return { ...baseStyle, display: 'block', textAlign: 'center', maxWidth: '20rem', margin: '0 auto' };
            case 'emotion':
                return { ...baseStyle, fontStyle: 'italic', display: 'block', textAlign: 'center', maxWidth: '20rem', margin: '0 auto' };
            default:
                return { ...baseStyle, display: 'block', textAlign: 'left' };
        }
    }

    function handleDisplayClick() {
        if (textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }

    function getTextAlign(format) {
        return ['character', 'dialogue', 'emotion'].includes(format) ? 'center' : 'left';
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
                            {isSaving ? 'Saving...' : saveButtonText}
                        </button>
                    </div>
                </div>

                <EditorToolbar
                    currentFormat={currentFormat}
                    setCurrentFormat={handleFormatChange}
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
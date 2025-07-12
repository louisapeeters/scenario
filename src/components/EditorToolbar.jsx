import React, { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function EditorToolbar({
    currentFormat,
    setCurrentFormat,
    editorRef,
    text,
    title,
    formatSegments,
}) {
    const [isCapitalMode, setIsCapitalMode] = useState(false);

    useEffect(() => {
        setIsCapitalMode(currentFormat === 'location' || currentFormat === 'character');
    }, [currentFormat]);

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.metaKey || e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'l':
                        e.preventDefault();
                        setLocationFormat();
                        break;
                    case 'n':
                        e.preventDefault();
                        setNarrationFormat();
                        break;
                    case 'c':
                        e.preventDefault();
                        setCharacterFormat();
                        break;
                    case 'd':
                        e.preventDefault();
                        setDialogueFormat();
                        break;
                    case 'e':
                        e.preventDefault();
                        setEmotionFormat();
                        break;
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    function setLocationFormat() {
        setCurrentFormat('location');
        focusEditor();
    }

    function setNarrationFormat() {
        setCurrentFormat('narration');
        focusEditor();
    }

    function setCharacterFormat() {
        setCurrentFormat('character');
        focusEditor();
    }

    function setDialogueFormat() {
        setCurrentFormat('dialogue');
        focusEditor();
    }

    function setEmotionFormat() {
        setCurrentFormat('emotion');
        focusEditor();
    }

    function focusEditor() {
        if (editorRef.current) {
            editorRef.current.focus();
        }
    }

    function generateFormattedHtmlForPDF() {
        if (!formatSegments || !formatSegments.length) {
            return `<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; text-align: left;">${text.replace(/\n/g, '<br/>')}</div>`;
        }

        const elements = [];
        let lastEnd = 0;
        const sortedSegments = [...formatSegments].sort((a, b) => a.start - b.start);

        sortedSegments.forEach((segment) => {
            // Add unformatted text before this segment
            if (segment.start > lastEnd) {
                const unformattedText = text.substring(lastEnd, segment.start).replace(/\n/g, '<br/>');
                if (unformattedText.trim()) {
                    elements.push(`<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; text-align: left; margin-bottom: 1em;">${unformattedText}</div>`);
                }
            }

            // Add formatted segment
            let segmentText = text.substring(segment.start, segment.end).replace(/\n/g, '<br/>');
            if (segmentText.trim()) {
                // Add parentheses around emotion text
                if (segment.format === 'emotion') {
                    segmentText = `(${segmentText})`;
                }

                const style = getPDFFormatStyle(segment.format);
                elements.push(`<div style="${style}">${segmentText}</div>`);
            }

            lastEnd = segment.end;
        });

        // Add remaining unformatted text
        if (lastEnd < text.length) {
            const remainingText = text.substring(lastEnd).replace(/\n/g, '<br/>');
            if (remainingText.trim()) {
                elements.push(`<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; text-align: left; margin-bottom: 1em;">${remainingText}</div>`);
            }
        }

        return elements.join('');
    }

    function getPDFFormatStyle(format) {
        const baseStyle = "font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin-bottom: 1em; color: #000;";

        switch (format) {
            case 'location':
                return `${baseStyle} font-weight: bold; text-transform: uppercase; text-align: left;`;
            case 'character':
                return `${baseStyle} font-weight: bold; text-transform: uppercase; text-align: center;`;
            case 'dialogue':
                return `${baseStyle} text-align: center; max-width: 20rem; margin-left: auto; margin-right: auto;`;
            case 'emotion':
                return `${baseStyle} font-style: italic; text-align: center; max-width: 20rem; margin-left: auto; margin-right: auto;`;
            case 'narration':
            default:
                return `${baseStyle} text-align: left;`;
        }
    }

    function handleDownloadAsPDF() {
        const documentTitle = title || 'Untitled Scenario';
        const formattedContent = generateFormattedHtmlForPDF();

        const element = document.createElement('div');
        element.innerHTML = `
            <div style="padding: 20px;">
                <h1 style="text-align: center; font-family: 'Times New Roman', serif; font-size: 16pt; margin-bottom: 2em; font-weight: bold;">${documentTitle}</h1>
                <div>${formattedContent}</div>
            </div>
        `;

        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `${documentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: {
                unit: 'in',
                format: 'letter',
                orientation: 'portrait'
            }
        };

        html2pdf().set(opt).from(element).save();
    }

    return (
        <div className="sidebar-tools">
            <div className="tools-section">
                <span className="tools-label">Text Formatting</span>
                <div className="tools-group">
                    <button
                        className={`tool-btn ${currentFormat === 'location' ? 'active' : ''}`}
                        onClick={setLocationFormat}
                        title="Location (Cmd+L) - Left aligned, uppercase"
                    >
                        📍
                    </button>
                    <button
                        className={`tool-btn ${currentFormat === 'narration' ? 'active' : ''}`}
                        onClick={setNarrationFormat}
                        title="Narration (Cmd+N) - Left aligned, normal case"
                    >
                        📖
                    </button>
                    <button
                        className={`tool-btn ${currentFormat === 'character' ? 'active' : ''}`}
                        onClick={setCharacterFormat}
                        title="Character (Cmd+C) - Center aligned, uppercase"
                    >
                        👤
                    </button>
                    <button
                        className={`tool-btn ${currentFormat === 'dialogue' ? 'active' : ''}`}
                        onClick={setDialogueFormat}
                        title="Dialogue (Cmd+D) - Center aligned, normal case, max width 20rem"
                    >
                        💬
                    </button>
                    <button
                        className={`tool-btn ${currentFormat === 'emotion' ? 'active' : ''}`}
                        onClick={setEmotionFormat}
                        title="Emotion (Cmd+E) - Center aligned, italic, max width 20rem, wrapped in parentheses"
                    >
                        😊
                    </button>
                </div>
            </div>

            <div className="tools-section current-format-line">
                <span className="tools-label">
                    Current Format: <span className="current-format-inline">{currentFormat.charAt(0).toUpperCase() + currentFormat.slice(1)}{isCapitalMode && ' (CAPS)'}</span>
                </span>
            </div>

            <div className="tools-section">
                <span className="tools-label">Export Options</span>
                <div className="tools-group center">
                    <button
                        className="tool-btn download"
                        onClick={handleDownloadAsPDF}
                        title="Download as PDF"
                    >
                        download as PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
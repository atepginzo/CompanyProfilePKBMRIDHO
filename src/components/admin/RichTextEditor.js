'use client';

import { useRef } from 'react';

const COMMANDS = [
  { key: 'bold', label: 'B', command: 'bold' },
  { key: 'italic', label: 'I', command: 'italic' },
  { key: 'underline', label: 'U', command: 'underline' },
  { key: 'ul', label: '• List', command: 'insertUnorderedList' },
  { key: 'ol', label: '1. List', command: 'insertOrderedList' },
  { key: 'h2', label: 'H2', command: 'formatBlock', value: 'h2' },
  { key: 'h3', label: 'H3', command: 'formatBlock', value: 'h3' },
];

export default function RichTextEditor({
  id,
  label,
  required,
  error,
  hint,
  value,
  onChange,
  placeholder,
}) {
  const editorRef = useRef(null);

  const applyCommand = (command, cmdValue) => {
    editorRef.current?.focus();
    document.execCommand(command, false, cmdValue);
    onChange?.(editorRef.current?.innerHTML || '');
  };

  const insertLink = () => {
    const url = window.prompt('Masukkan URL link');
    if (!url) return;
    applyCommand('createLink', url);
  };

  const clearFormatting = () => {
    editorRef.current?.focus();
    document.execCommand('removeFormat', false);
    onChange?.(editorRef.current?.innerHTML || '');
  };

  return (
    <div className="form-group">
      {label ? (
        <label className="form-label" htmlFor={id}>
          {label}
          {required ? <span className="required">*</span> : null}
        </label>
      ) : null}

      <div className={`rich-editor ${error ? 'error' : ''}`}>
        <div className="rich-editor-toolbar">
          {COMMANDS.map((item) => (
            <button
              key={item.key}
              type="button"
              className="rich-editor-btn"
              onClick={() => applyCommand(item.command, item.value)}
              title={item.label}
            >
              {item.label}
            </button>
          ))}
          <button type="button" className="rich-editor-btn" onClick={insertLink} title="Insert Link">
            Link
          </button>
          <button type="button" className="rich-editor-btn" onClick={clearFormatting} title="Clear Format">
            Clear
          </button>
        </div>

        <div
          id={id}
          ref={editorRef}
          className="rich-editor-content"
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder || 'Tulis konten di sini...'}
          onInput={(event) => onChange?.(event.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: value || '' }}
        />
      </div>

      {error ? <p className="form-error">{error}</p> : null}
      {!error && hint ? <p className="form-hint">{hint}</p> : null}
    </div>
  );
}

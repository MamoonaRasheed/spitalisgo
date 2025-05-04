// example: app/editor/page.tsx or pages/editor.tsx (depending on your Next.js setup)

'use client'; // if you're using Next.js 13+ and app/ folder

import { useEffect } from 'react';
import $ from 'jquery';
import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function EditorPage() {
  useEffect(() => {
    // Initialize Summernote after the page loads
    ($('#summernote') as any).summernote({
      placeholder: 'Write something cool...',
      height: 300,
      toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['font', ['strikethrough', 'superscript', 'subscript']],
        ['insert', ['link', 'picture', 'video']],
        ['view', ['codeview', 'help']]
      ]
    });
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Summernote Editor</h1>
      <textarea id="summernote"></textarea>
    </div>
  );
}

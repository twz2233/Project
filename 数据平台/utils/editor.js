// Rich text editor
// Create editor and toolbar functions
const { createEditor, createToolbar } = window.wangEditor

// editor config
const editorConfig = {
  placeholder: 'Content for publish...',
  onChange(editor) {
    // get tich text
    const html = editor.getHtml()
    // sync to <textarea> for quickly collecting form data
    document.querySelector('.publish-content').value = html
  }
}

// create editor
const editor = createEditor({
  // set selector
  selector: '#editor-container',
  // default content
  html: '<p><br></p>',
  config: editorConfig,
  mode: 'default', // or 'simple'
})

// toolbar config
const toolbarConfig = {}

// create toolbar
const toolbar = createToolbar({
  // create toolbar for desired editor
  editor,
  // location of toolbar
  selector: '#toolbar-container',
  config: toolbarConfig,
  mode: 'default', // or 'simple'
})

import 'quill/dist/quill.snow.css';

async function initQuill() {
    const { default: QuillClass } = await import('quill');
    const Quill = QuillClass as any;

    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: false

        },
    });
    quill.disable();

    function setContent(content: string) {
        quill.root.innerHTML = content;
    }

    window.addEventListener('message', (event) => {
        if (event.data.type === 'setContent') {
            setContent(event.data.content);
        }
    });
}

initQuill();

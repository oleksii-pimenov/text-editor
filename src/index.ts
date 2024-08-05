import 'quill/dist/quill.snow.css';

async function initQuill() {
    const { default: QuillClass } = await import('quill');
    const QuillResizeImage = await import('quill-resize-image');

    const Quill = QuillClass as any;
    Quill.register("modules/resize", QuillResizeImage.default);

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', /* 'code-block' */],
        ['link', 'image', 'video', /* 'formula' */],

        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],

        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']
    ];

    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: {
                container: toolbarOptions,
                handlers: {
                    image: imageHandler
                }
            },
            resize: {
                locale: {
                    altTip: "Hold down the alt key to zoom",
                    floatLeft: "Left",
                    floatRight: "Right",
                    center: "Center",
                    restore: "Restore",
                },
            },
        },
    });

    function imageHandler() {
        var range = this.quill.getSelection();
        var value = prompt('Посилання на зображення');
        if (value) {
            this.quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
        }
    }

    function setContent(content: string) {
        quill.root.innerHTML = content;
    }

    window.addEventListener('message', (event) => {
        if (event.data.type === 'setContent') {
            setContent(event.data.content);
        }
    });

    quill.on('text-change', () => {
        const content = quill.root.innerHTML;
        window.parent.postMessage({ type: 'contentChanged', content }, '*');
    });
}

initQuill();

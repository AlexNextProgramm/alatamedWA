

export function drag_and_drop(dropArea:HTMLElement, uploadFile:Function){

    const Event = ['dragenter', 'dragover', 'dragleave', 'drop']
    Event.forEach((eventName) => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults (e:any) {
        e.preventDefault()
        e.stopPropagation()
    }

    dropArea.addEventListener('drop', handleDrop, false)

    function handleDrop(e:any) {
        ([...e.dataTransfer.files]).forEach((file:any)=>uploadFile(file))
    }

}
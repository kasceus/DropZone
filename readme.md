##  Using DropZone

This is a JavaScript library to create a simple drag-and-drop feture for front-end use. This will only work on input elements that have type=file.
If this is used on a form, then it will apply the drop zone to all input fields that accept files.

This plugin extends the HTMLInput and HTMLForm elements.  You can call it directly on one of these elements.

###  Configurable Options

    defaults = {
			displayText: "Click here or drag and drop an image to upload it here",
			allowMultiple: false,
			allowedFileTypes: ['gif', 'png', 'jpeg', 'jpg'],
			clickToUpload: true,
			initClass: 'da-applied',
			imagesOnly: true,
			maxFiles: 5,
			resetOnUpload: false
		}


## Example

    
    document.queryselector('.someForm').dropZonify();//Use default options

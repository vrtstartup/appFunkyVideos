export default class CanvasUtil {

    constructor($q) {
        this.$q = $q;
    }

    /** util.toImage(canvas, 'image/jpeg')
            .then(image => {
            }
     **/
    toImage(canvas, contentType) {
        return this.$q(resolve => {
            if (canvas.toBlob) {
                canvas.toBlob(data => {
                    resolve(data);
                }, contentType);
            }

            // no support for toBlob
            resolve(this._dataURItoBlob(canvas.toDataURL(contentType, 1.0), contentType));
        });
    }

    /** util.fromHtml(element)
            .then(canvas => {
            }
     **/
    fromHtml(element) {
        return this.$q(resolve => {
            html2canvas(element, {
                onrendered: (canvas) => {
                    resolve(canvas);
                }
            });
        });
    }

    _dataURItoBlob(dataURI, contentType) {

        const binary = atob(dataURI.split(',')[1]);
        const array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {
            type: contentType
        });
    };
}

CanvasUtil.$inject = ['$q'];
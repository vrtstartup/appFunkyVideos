export default class SubtitlesController {
    constructor($log, srt, FileSaver, $sce) {
        this.$log = $log;
        this.srt = srt;
        this.FileSaver = FileSaver;
        this.srtObj = {};
        this.form = {
            start: '1',
            end: '10',
            text: 'test text'
        };
    }




    onPlayerReady(API) {
        this.API = API;
        console.log(API);
    };


    createSRT(srtObj) {
        return this.srt.stringify(srtObj);
    }


    downloadSRTFile(srtObj) {
        var srtString = this.createSRT(srtObj);
        var data = new Blob([srtString], {
            type: 'srt'
        });

        this.FileSaver.saveAs(data, 'sub.srt');
    }


    addLine(obj) {
        var id = Object.keys(this.srtObj).length++;
        this.srtObj[id] = { id: id, start: obj.start, end: obj.end, text: obj.text };

    }


    onPlayerReady(API) {
        this.API = API;
        console.log(this.API);
    }



    getTime() {
        return this.API.currentTime;
    }


    setIn(t) {
        this.form.start = t / 1000.0;
    }



    setOut(t) {
        this.form.end = t / 1000.0;
    }



    // hotkeys.add({
    //     combo: 'ctrl+i',
    //     description: 'getInTime',
    //     callback: function() {
    //         setIn(getTime());
    //     }
    // });

    // hotkeys.add({
    //     combo: 'ctrl+o',
    //     description: 'getOutTime',
    //     callback: function() {
    //         setOut(getTime());
    //     }
    // });




}

SubtitlesController.$inject = ['$log', 'srt', 'FileSaver', '$sce'];

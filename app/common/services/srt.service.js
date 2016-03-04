// TODO: refactoring that=this bullshit

export default class srtService {
    constructor($log) {

        this.$log = $log;

        this.parse = function(text) {
            var el, key, obj, srt, sub, subtitles, time, _i, _len;
            subtitles = [];
            text = text.replace(/\r\n|\r|\n/g, "\n");
            text = text.replace(/\n{3,}/g, "\n\n");
            text = text.replace(/^\s+|\s+$/g, "");
            srt = text.split("\n\n");
            for (key = _i = 0, _len = srt.length; _i < _len; key = ++_i) {
                el = srt[key];
                obj = {};
                sub = el.split("\n");
                if (sub.length > 3) {
                    sub[2] = sub.slice(2).join("\n");
                }
                if (sub.length === 3) {
                    obj.id = parseInt(sub[0]) - 1;
                    time = sub[1].split(" --> ");
                    obj.start = $scope.toSeconds(time[0]);
                    obj.end = $scope.toSeconds(time[1]);
                    obj.text = sub[2];
                    subtitles.push(obj);
                }
            }
            return subtitles;
        };
        this.toSeconds = function(time) {
            var els, i, s;
            s = 0.0;
            if (time) {
                els = time.split(":");
                i = 0;
                while (i < els.length) {
                    s = s * 60 + parseFloat(els[i].replace(",", "."));
                    i++;
                }
            }
            return s;
        };
        this.toTimestamp = function(time) {
            var heures, minutes, scd, secondes;
            heures = Math.floor(time / 3600);
            minutes = Math.floor((time - (heures * 3600)) / 60);
            secondes = time - (heures * 3600) - (minutes * 60);
            if (heures < 10) {
                heures = '0' + heures;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            scd = secondes.toFixed(3).replace('.', ',').replace(',000', '');
            if (secondes < 10) {
                scd = '0' + scd;
            }
            return heures + ':' + minutes + ':' + scd;
        };
        this.stringify = function(json) {
            var el, key, string, _i, _len;
            string = "";
            var key, count = 0;
            for (key in json) {
                if (json.hasOwnProperty(key)) {
                    count++;
                }
            }

            for (key = _i = 0, _len = count; _i < _len; key = ++_i) {
                el = json[key];
                string += key + 1 + '\n';
                string += this.toTimestamp(el.start) + ' --> ' + this.toTimestamp(el.end) + '\n';
                string += el.text + '\n';
                string += '\n';
            }

            return string;
        };



    }
}

srtService.$inject = ['$log'];

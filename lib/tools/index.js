//只能转换 dd/MM/yyyy 或者 dd/MM/yyyy hh:mm:ss格式的时间字符串
function changeStringToDate(strDate, hasTime = false, datePrefix = '/') {
    let res = null;
    if (strDate.indexOf(datePrefix) == -1) {
        if (strDate.indexOf('-') != -1) {
            datePrefix = '-';
        }
    }
    if (strDate.indexOf(':') != -1) {
        hasTime = true;
    }
    if (strDate.indexOf('T') != -1) {
        strDate = strDate.replace('T', ' ');
    }
    if (strDate) {
        try {
            if (hasTime) {
                if (datePrefix == '/') {
                    let dateTimeArr = strDate.split(' ');
                    let dateArr = dateTimeArr[0].split(datePrefix);
                    let d = dateArr[0] * 1;
                    let m = dateArr[1] * 1;
                    let y = dateArr[2] * 1;
                    let timeArr = dateTimeArr[1].split(':');
                    let h = timeArr[0] * 1;
                    let mm = timeArr[1] * 1;
                    let s = timeArr[2] ? timeArr[2] * 1 : '00';
                    res = new Date(y, m - 1, d, h, mm, s);
                } else {
                    let dateTimeArr = strDate.split(' ');
                    let dateArr = dateTimeArr[0].split(datePrefix);
                    let d = dateArr[2] * 1;
                    let m = dateArr[1] * 1;
                    let y = dateArr[0] * 1;
                    let timeArr = dateTimeArr[1].split(':');
                    let h = timeArr[0] * 1;
                    let mm = timeArr[1] * 1;
                    let s = timeArr[2] ? timeArr[2] * 1 : '00';
                    res = new Date(y, m - 1, d, h, mm, s);
                }
            } else {
                if (datePrefix == '/') {
                    let dateArr = strDate.split(datePrefix);
                    let d = dateArr[0] * 1;
                    let m = dateArr[1] * 1;
                    let y = dateArr[2] * 1;
                    res = new Date(y, m - 1, d);
                } else {
                    let dateArr = strDate.split(datePrefix);
                    let d = dateArr[2] * 1;
                    let m = dateArr[1] * 1;
                    let y = dateArr[0] * 1;
                    res = new Date(y, m - 1, d);
                }

            }
        } catch (e) {
            console.log(e);
        }
    }
    return res;
}

function objectToQueryString(obj) {
    let res = [];
    if (obj) {
        Object.keys(obj).forEach(item => {
            let temp = [];
            temp.push(item);
            temp.push(obj[item] || '');
            res.push(temp.join('='));
        });
    }
    return res.join('&')
}
/**
 * let sou = [{ id: 'test1', value: 'test1' }, { id: 'test2', value: 'test2' }];
 * let tar = [{ id: 'test1' }, { id: 'test2' }]
 * mapValueToTargetByKey(tar, sou, [{ target: 'id', source: 'id' }], ['value']);
 * console.log('mapValueToTargetByKey', tar);
 * 
 * @param {Array} targets 
 * @param {Array} sources 
 * @param {Array} equeKeys 
 *  @param {Array} keys 
 */
let mapValueToTargetByKey = function(targets, sources, equeKeys, keys) {
    targets.forEach(tItem => {
        sources.forEach((sItem, sIndex) => {
            let flag = true;
            equeKeys.forEach((kItem) => {
                if (tItem && tItem[kItem.target] === undefined && sItem[kItem.source] === undefined) {
                    flag = false;
                    return true;
                }
                if (tItem[kItem.target] != sItem[kItem.source]) {
                    flag = false;
                    return true;
                }
            });
            if (flag == true) {
                if (typeof keys === 'string') {
                    tItem[keys] = sItem[keys];
                } else if (Object.prototype.toString.call(keys) == '[object Array]') {
                    keys.forEach(item => {
                        tItem[item] = sItem[item];
                    });
                } else if (typeof keys === 'function') {
                    keys(tItem, sItem);
                }

            }
        });
    });
};

// let objects1 = [{ name: 'alice', id: 1, sex: 'm', classId: '1', courseId: '1' }, { name: 'alex', id: 2, sex: 'f', classId: '3', courseId: '1' }, { name: 'abe', id: 3, sex: 's', classId: '2', courseId: '1' }, { name: 'a-ke', id: 4, sex: 'f', classId: '1', courseId: '2' }, { name: 'ben', id: 5, sex: 's', classId: '3', courseId: '2' }, { name: 'jey', id: 6, sex: 's', classId: '2', courseId: '3' }];
// let objects2 = [{ className: '1班', id: 1, studentCount: 20 }, { className: '2班', id: 2, studentCount: 30 }, { className: '3班', id: 3, studentCount: 20 }];
// let objects3 = [{ id: 1, name: '语文', teacherId: '1' }, { id: 2, name: '数学', teacherId: '2' }, { id: 3, name: '英语', teacherId: '2' }];
// let objects4 = [{ id: 1, name: '老师1' }, { id: 2, name: '老师2' }]
let mapRelativeObjects = function(opts, isCopy) {
    let res = [];
    if (!opts || !opts.linkEntitys || !opts.datas) return res;
    if (opts.linkEntitys && opts.datas) {
        let obj = [];
        if (isCopy) {
            obj = _.cloneDeep(opts.datas);
        } else {
            obj = opts.datas;
        }

        opts.linkEntitys.forEach(lItem => {

            if (lItem.linkEntitys) {
                mapRelativeObjects(lItem, false);
            }
            mapValueToTargetByKey(obj, lItem.datas, [{ target: lItem.fromKey, source: lItem.toKey }], function(tItem, sItem) {
                Object.keys(sItem).forEach(item => {
                    let key = lItem.aliasName + item;
                    tItem[key] = sItem[item];
                });
            });
            res = obj;
        });
    }
    return res;
};


const utils = {
    mapValueToTargetByKey,
    mapRelativeObjects,
    changeStringToDate,
    objectToQueryString,
    //permissionAll,
    queryByKeyValue(arr, key, value) {
        let res = [];
        arr.filter((item, index) => {
            return item[key] == value;
        });
        return res;
    },
    deboundsEvent: function(timeout) {
        var isRun = false;
        return function(callback) {
            if (isRun == true) return false;
            isRun = true;
            callback && callback();
            setTimeout(function() {
                isRun = false;
            }, timeout);
        }
    }
};

const _Guid = function (g) {
    var arr = new Array(); //存放32位数值的数组

    if (typeof (g) == "string") { //如果构造函数的参数为字符串
        InitByString(arr, g);
    }

    else {
        InitByOther(arr);
    }
    //返回一个值，该值指示 Guid 的两个实例是否表示同一个值。

    this.Equals = function (o) {
        if (o && o.IsGuid) {
            return this.ToString() == o.ToString();
        }

        else {
            return false;
        }
    };

    //Guid对象的标记

    this.IsGuid = function () { };

    //返回 Guid 类的此实例值的 String 表示形式。

    this.ToString = function (format) {
        if (typeof (format) == "string") {
            if (format == "N" || format == "D" || format == "B" || format == "P") {
                return ToStringWithFormat(arr, format);
            }

            else {
                return ToStringWithFormat(arr, "D");
            }
        }

        else {
            return ToStringWithFormat(arr, "D");
        }
    };

    //由字符串加载

    function InitByString(arr, g) {
        g = g.replace(/\{|\(|\)|\}|-/g, "");

        g = g.toLowerCase();

        if (g.length != 32 || g.search(/[^0-9,a-f]/i) != -1) {
            InitByOther(arr);
        }

        else {
            for (var i = 0; i < g.length; i++) {
                arr.push(g[i]);
            }
        }
    }

    //由其他类型加载

    function InitByOther(arr) {
        var i = 32;

        while (i--) {
            arr.push("0");
        }
    }

    /*

    根据所提供的格式说明符，返回此 Guid 实例值的 String 表示形式。

    N  32 位： xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

    D  由连字符分隔的 32 位数字 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

    B  括在大括号中、由连字符分隔的 32 位数字：{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}

    P  括在圆括号中、由连字符分隔的 32 位数字：(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

    */

    function ToStringWithFormat(arr, format) {
        switch (format) {
            case "N":

                return arr.toString().replace(/,/g, "");

            case "D":

                var str = arr.slice(0, 8) + "-" + arr.slice(8, 12) + "-" + arr.slice(12, 16) + "-" + arr.slice(16, 20) + "-" + arr.slice(20, 32);

                str = str.replace(/,/g, "");

                return str;

            case "B":

                var str = ToStringWithFormat(arr, "D");

                str = "{" + str + "}";

                return str;

            case "P":

                var str = ToStringWithFormat(arr, "D");

                str = "(" + str + ")";

                return str;

            default:

                return new Guid();
        }
    }
};

const Guid = {
    NewGuid(){
        var g = "";
        var i = 32;
        while (i--) {
            g += Math.floor(Math.random() * 16.0).toString(16);
        }
        return new _Guid(g);
    },
    EmptyGuid(){
        new _Guid().toString();
    }
};

class BWLocalStorage {
    constructor(name){
        this.name = name || (Math.random()*1000000).toString(16);
        this.data = {};
    }
    setItem(key,value){
        this.data[key] = value;
        this.setToLocalStorage();
    }
    setToLocalStorage(){
        localStorage.setItem(this.name,JSON.stringify(this.data));
    }
    getByLocalStorage(){
        return localStorage.getItem(this.name);
    }
    getItem(key){
        const data = this.getByLocalStorage(key);
        try{
            if(data){
                return JSON.parse(data)[key];
            }
        }catch(e){
            console.error(e);
        }
    }
}

const mimeTypes = {
    'doc': 'application/msword',
    'dot': 'application/msword',

    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'dotx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    'docm': 'application/vnd.ms-word.document.macroEnabled.12',
    'dotm': 'application/vnd.ms-word.template.macroEnabled.12',

    'xls': 'application/vnd.ms-excel',
    'xlt': 'application/vnd.ms-excel',
    'xla': 'application/vnd.ms-excel',

    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xltx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    'xlsm': 'application/vnd.ms-excel.sheet.macroEnabled.12',
    'xltm': 'application/vnd.ms-excel.template.macroEnabled.12',
    'xlam': 'application/vnd.ms-excel.addin.macroEnabled.12',
    'xlsb': 'application/vnd.ms-excel.sheet.binary.macroEnabled.12',

    'ppt': 'application/vnd.ms-powerpoint',
    'pot': 'application/vnd.ms-powerpoint',
    'pps': 'application/vnd.ms-powerpoint',
    'ppa': 'application/vnd.ms-powerpoint',

    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'potx': 'application/vnd.openxmlformats-officedocument.presentationml.template',
    'ppsx': 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
    'ppam': 'application/vnd.ms-powerpoint.addin.macroEnabled.12',
    'pptm': 'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
    'potm': 'application/vnd.ms-powerpoint.template.macroEnabled.12',
    'ppsm': 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',

    'mdb': 'application/vnd.ms-access',

    'pdf': 'application/pdf',
    'gif': 'image/gif',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png'
};

export { Guid as guid, BWLocalStorage as localstorage, mimeTypes as mimes, utils };

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
                    })
                } else if (typeof keys === 'function') {
                    keys(tItem, sItem)
                }

            }
        })
    })
}

// let objects1 = [{ name: 'alice', id: 1, sex: 'm', classId: '1', courseId: '1' }, { name: 'alex', id: 2, sex: 'f', classId: '3', courseId: '1' }, { name: 'abe', id: 3, sex: 's', classId: '2', courseId: '1' }, { name: 'a-ke', id: 4, sex: 'f', classId: '1', courseId: '2' }, { name: 'ben', id: 5, sex: 's', classId: '3', courseId: '2' }, { name: 'jey', id: 6, sex: 's', classId: '2', courseId: '3' }];
// let objects2 = [{ className: '1班', id: 1, studentCount: 20 }, { className: '2班', id: 2, studentCount: 30 }, { className: '3班', id: 3, studentCount: 20 }];
// let objects3 = [{ id: 1, name: '语文', teacherId: '1' }, { id: 2, name: '数学', teacherId: '2' }, { id: 3, name: '英语', teacherId: '2' }];
// let objects4 = [{ id: 1, name: '老师1' }, { id: 2, name: '老师2' }]
let mapRelativeObjects = function(opts, isCopy) {
    let res = []
    if (!opts || !opts.linkEntitys || !opts.datas) return res;
    if (opts.linkEntitys && opts.datas) {
        let obj = []
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
        })
    }
    return res;
}


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
}

export const isEmpty = (keys) => {
    if (typeof keys === "string") {
        keys = keys.replace(/\"|&nbsp;|\\/g, '').replace(/(^\s*)|(\s*$)/g, "");
        if (keys == "" || keys == null || keys == "null" || keys === "undefined") {
            return true;
        } else {
            return false;
        }
    } else if (typeof keys === "undefined") { // 未定义
        return true;
    } else if (typeof keys === "number") {
        return false;
    } else if (typeof keys === "boolean") {
        return false;
    } else if (typeof keys == "object") {
        if (JSON.stringify(keys) == "{}") {
            return true;
        } else if (keys == null) { // null
            return true;
        } else {
            return false;
        }
    }

    if (keys instanceof Array && keys.length == 0) { // 数组
        return true;
    }

}
export default utils
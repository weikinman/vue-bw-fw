import { utils } from "@vue-bw-fw/tools";

let components = [];

let plugins = [];

const install = (app, opt) => {
    const option = Object.assign(defaultInstallOpt, opt)
    app.config.globalProperties.$ELEMENT = option;
    'test';
    components.forEach(component => {
        app.component(component.name, component)
    });
    'ffff'
    '125125125';
    'ddddd'
    plugins.forEach(plugin => {
        app.use(plugin)
    });
}

export {
    utils,
    install
}

export default {
    install
}
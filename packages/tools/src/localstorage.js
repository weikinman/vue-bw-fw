export default class BWLocalStorage {
    constructor(name){
        this.name = name || (Math.random()*1000000).toString(16);
        this.data = {}
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
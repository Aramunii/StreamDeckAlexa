class Animal{
    constructor(name){
        this.nick = name;
    }

    getName(){
        return `o nome do animal é ${this.nick}`;
    }

    setName(newName){
        this.nick = newName;
    }
}

class Bird extends Animal{
    constructor(name,color) {
        super(name);
        this.color = color;
    }

    show(){
        return `O ${this.nick} é da cor ${this.color} `
    }

    static hello(){
        return 'Olá, como vai você'
    }
}
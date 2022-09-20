class Byte {

    constructor(page)
    {
        this.page = page;
    }

    async happy()
    {
        console.log("Happy Path");
        console.log("Sad Path");
    }

    async sad()
    {
        console.log("Happy Path");
        console.log("Sad Path");
    }
}

module.exports = {Byte}
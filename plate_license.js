const MOCK_LICENSE_OBJECT = {
    "license": "6LZD666",           //string
    "registered": 1622953087393,    //UTC timestamp
    "status": "REGISTERED"          //string
}

class PlateLicense {
    //构建class的时候run的method
    constructor() {
        this.licenses = [MOCK_LICENSE_OBJECT];
    }

    getAllLicenses() {
        return this.licenses;
    }

    generateNewLicense() {
        const numbers = Array(10).fill().map((_, i) => i.toString());
        const letterCodes = Array(26).fill().map((_, i) => i);
        //ascii conversion => 'A', 'B' ... 'Z'
        const letters = letterCodes.map(code => {
            return String.fromCharCode(code + 65)  //lowercase: + 97
        })
        const licenseNumber =
            this._getRandomItemFromArray(numbers) +
            this._getRandomItemFromArray(letters) +
            this._getRandomItemFromArray(letters) +
            this._getRandomItemFromArray(letters) +
            this._getRandomItemFromArray(numbers) +
            this._getRandomItemFromArray(numbers) +
            this._getRandomItemFromArray(numbers);

        const licenseObject = {
            license: licenseNumber,
            registered: new Date().getTime(),
            status: 'REGISTERED',
        };
        console.log(licenseObject.license)
        this.licenses.push(licenseObject);
        return licenseObject;
    }

    _getRandomItemFromArray(arr) {   //private function, no need test
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }
}


module.exports = PlateLicense;
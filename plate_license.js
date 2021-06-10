const MOCK_LICENSE_OBJECT = {
    "license": "6LZD666",           //string
    "registered": 1622953087393,    //UTC timestamp
    "status": "REGISTERED"          //string
}

class PlateLicense {
    //构建class的时候run的method
    constructor() {
        this.licenses = [MOCK_LICENSE_OBJECT];
        this.licenseSet = new Set();
        this.licenseSet.add(MOCK_LICENSE_OBJECT.license);
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

        //generator helper
        const buildLicenseNumber = () =>
            this._getRandomItemFromArray(numbers) +
            this._getRandomItemFromArray(letters) +
            this._getRandomItemFromArray(letters) +
            this._getRandomItemFromArray(letters) +
            this._getRandomItemFromArray(numbers) +
            this._getRandomItemFromArray(numbers) +
            this._getRandomItemFromArray(numbers);
        // make sure the generated license number be unique
        let licenseNumber = buildLicenseNumber();
        while (this.hasLicenseNumber(licenseNumber)) {
            licenseNumber = buildLicenseNumber();
        }
        this.licenseSet.add(licenseNumber)  // add licenseNumber to set

        const licenseObject = {
            license: licenseNumber,
            registered: new Date().getTime(),
            status: 'REGISTERED',
        };

        this.licenses.push(licenseObject);  // add licenseObject to array
        return licenseObject;
    }

    hasLicenseNumber(license) {
        return this.licenseSet.has(license);
    }

    batchGenerateLicenses(n) {
        const newLicenseObjects = [];
        while (n > 0) {
            newLicenseObjects.push(this.generateNewLicense());
            n--;
        }
        return newLicenseObjects;
    }

    _getRandomItemFromArray(arr) {   //private function, no need test
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }
}


module.exports = PlateLicense;
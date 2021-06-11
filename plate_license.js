const fs = require('fs');
const LICENSES_FILE = './licenses.json';

const MOCK_LICENSE_OBJECT = {
    license: "6LZD666",           //string
    registered: 1622953087393,    //UTC timestamp
    status: "REGISTERED"          //string
}

class PlateLicense {
    //构建class的时候run的method
    constructor() {
        this.licenses = [MOCK_LICENSE_OBJECT];
        this.licenseSet = new Set();
        this.licenseSet.add(MOCK_LICENSE_OBJECT.license);
    }

    getLicenses() {
        return this.licenses;
    }

    generateLicense() {
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

    _getRandomItemFromArray(arr) {   //private function, no need test
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    batchGenerateLicenses(n) {
        const newLicenseObjects = [];
        while (n-- > 0) {
            newLicenseObjects.push(this.generateLicense());
        }
        return newLicenseObjects;
    }

    backupLicenses() {
        // fs.writeFile(<store_file_path>, <data>, <callback>)
        return fs.writeFileSync(
            LICENSES_FILE,
            JSON.stringify(this.licenses, null, 2), //(data, null, 2) 排版显示格式，由一行变成缩进
        );
    }

    restoreLicenses() {
        return fs.readFile(LICENSES_FILE, 'utf8', (_, fileData) => {
            this.licenses = JSON.parse(fileData);
        });
    }

    removeLicensesFile() {
        return fs.unlink(LICENSES_FILE, () => { });
    }

    getLicense(licenseNum) {
        for (const licenseObj of this.licenses) {
            if (licenseObj.license === licenseNum) {
                return licenseObj;
            }
        }
        return null;
    }

    // i.e. this.updateLicenseStatus('6LZD666', 'SUSPENDED')
    updateLicenseStatus(licenseNum, updateStatue) {
        const licenseObj = this.getLicense(licenseNum);
        if (licenseObj) {
            licenseObj.status = updateStatue;
        }
    }

    unRegisterLicense(licenseNum) {
        // update licenes object array
        this.licenses = this.licenses.filter(licenseObj => licenseObj.license !== licenseNum);
        // update license set
        this.licenseSet.delete(licenseNum);
    }

    searchSuspiciousLicenses() {
        return this.licenses.filter(licenseObj => {
            let countX = 0, count7 = 0;
            for (let i = 0; i < licenseObj.license.length; i++) {
                const letter = licenseObj.license[i];   //'6XXX123'
                if (letter === 'X') countX++
                if (letter === '7' && i >= 4) count7++
            }
            return countX === 2 && count7 === 1;
        })
    }
}


module.exports = PlateLicense;
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

    // 拿到一个array里的所有的licenses
    getLicenses() {
        return this.licenses;
    }

    // 生成一个含有新的license号码的object，并更新到this.licenses的array里
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
    // help function: input一个数字or字母的array，random返回一个数字or字母
    _getRandomItemFromArray(arr) {   //private function, no need test
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    // 判断现有的licenses里是否存在某个特定号码
    hasLicenseNumber(license) {
        return this.licenseSet.has(license);
    }

    // 生成n个新license号码的object
    batchGenerateLicenses(n) {
        const newLicenseObjects = [];
        while (n-- > 0) {
            newLicenseObjects.push(this.generateLicense());
        }
        return newLicenseObjects;
    }

    // 把this.licenses的array写到file里
    backupLicenses() {
        // fs.writeFile(<store_file_path>, <data>, <callback>)
        return fs.writeFileSync(
            LICENSES_FILE,
            JSON.stringify(this.licenses, null, 2), //(data, null, 2) 排版显示格式，由一行变成缩进
        );
    }

    // 从file里读取data更新this.licenses
    restoreLicenses() {
        return fs.readFile(LICENSES_FILE, 'utf8', (_, fileData) => {
            this.licenses = JSON.parse(fileData);
        });
    }

    removeLicensesFile() {
        return fs.unlink(LICENSES_FILE, () => { });
    }

    // input一个license号码，返回该license object
    getLicense(licenseNum) {
        for (const licenseObj of this.licenses) {
            if (licenseObj.license === licenseNum) {
                return licenseObj;
            }
        }
        return null;
    }

    // input一个licenes号码，更新该号码车牌的status
    // i.e. this.updateLicenseStatus('6LZD666', 'SUSPENDED')
    updateLicenseStatus(licenseNum, updateStatue) {
        const licenseObj = this.getLicense(licenseNum);
        if (licenseObj) {
            licenseObj.status = updateStatue;
        }
    }

    // 从this.licenses的array里删除一个特定号码的object，从this.licenseSet里删除一个特定号码
    unRegisterLicense(licenseNum) {
        // update licenes object array
        this.licenses = this.licenses.filter(licenseObj => licenseObj.license !== licenseNum);
        // update license set
        this.licenseSet.delete(licenseNum);
    }

    // 搜索并返回所有含有两个‘X'和尾数含有1个7的license object
    searchSuspiciousLicenses() {
        return this.licenses.filter(licenseObj => {
            let countX = 0, count7 = 0;
            for (let i = 0; i < licenseObj.license.length; i++) {
                const letter = licenseObj.license[i];   //'6XXX123'
                if (letter === 'X') countX++
                if (letter === '7' && i >= 4) count7++
            }
            return countX === 2 && count7 === 1;
        }).sort((a, b) => a.registered > b.registered ? -1 : 1)
        // .sort((a,b)=>b.registered-a.registered)
    }

    // 返回一个含有所有数字总数是21的车牌号码的array，升序排列
    getMagicLicenses() {
        /** Method 1 */
        // const licenseArray = [];
        // for (let licenseNum of this.licenseSet) {
        //     if (Number(licenseNum[0]) + Number(licenseNum[4]) + Number(licenseNum[5]) + Number(licenseNum[6]) === 21) {
        //         licenseArray.push(licenseNum)
        //     }
        // }
        // return licenseArray.sort();

        /** Method 2 */
        // Step1: convert set to array
        return [...this.licenseSet].filter(licenseNum => {
            // Step2: extract the numbers part from license number. i.e. '6LXD666' => '6666
            // !isNaN => isNumber
            const numbers = licenseNum.split("").filter(el => !isNaN(el));
            const sum = numbers.reduce((acc, num) => acc += Number(num));
            // Step3: calculate the sum from the numbers array. i.e. '6666' => 24
            // const sum = numbers.reduce((acc, num) => {
            //     acc += Number(num);
            //     return acc;
            // }, 0);
            return sum === 21;
        })
    }

    // 返回有两个相同字母的车牌号array
    getDoubleLicenses() {
        const licenseArray = [];
        for (let licenseNum of this.licenseSet) {
            const letters = licenseNum.slice(1, 4);
            if (letters[0] === letters[1] || letters[1] === letters[2] || letters[0] === letters[2]) licenseArray.push(licenseNum)
        }
        return licenseArray;
    }

    // 返回三个字母都相同的车牌号array
    getLuckyLicenses() {
        const licenseArray = [];
        for (let licenseNum of this.licenseSet) {
            const letters = licenseNum.slice(1, 4);
            if (letters[0] === letters[1] && letters[1] === letters[2]) licenseArray.push(licenseNum)
        }
        return licenseArray;
    }

    // 返回三个字母都相同&至少两个数字相同的车牌号array
    getRoyalLicenses() {
        const licenseArray = [];
        for (let licenseNum of this.licenseSet) {
            const letters = licenseNum.slice(1, 4);
            const nums = licenseNum[0] + licenseNum.slice(-3);
            const numMap = {};
            for (let i of nums) {
                numMap[i] = numMap[i] ? numMap[i]++ : 1
            }

            if (letters[0] === letters[1] && letters[1] === letters[2] && Object.values(numMap).sort().slice(-1) >= 2) licenseArray.push(licenseNum)
        }
        return licenseArray;
    }
    getRoyalLicenses() {
        const licenseArray = this.getLuckyLicenses();
        for (let licenseNum of licenseArray) {
            const nums = licenseNum[0] + licenseNum.slice(-3);
            const numMap = {};
            for (let i of nums) {
                numMap[i] = numMap[i] ? numMap[i]++ : 1
            }
            if (Object.values(numMap).sort().slice(-1) >= 2) licenseArray.push(licenseNum)
        }
        return licenseArray;
    }
}


module.exports = PlateLicense;
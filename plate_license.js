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
        this.licenseTree = {};
        // this.addLicenseToTree(MOCK_LICENSE_OBJECT.license);
        // this.printLicenseTree();
    }

    // 拿到一个array里的所有的licenses
    getLicenses() {
        return this.licenses;
    }

    // i.e. '6LZD666' converts to '6'->'L'->'Z'->'D'->'6'->'6'->'6'
    addLicenseToTree(licenseNum) {
        let node = this.licenseTree;    // tree root(get the point of the tree object)
        for (const letter of licenseNum) {
            if (!node[letter]) node[letter] = {} // 为了继续往下加东西
            node = node[letter];    //切换指针到下一级
        }
    }

    printLicenseTree() {
        const treeInJSON = JSON.stringify(this.licenseTree, null, 2);
        console.log(treeInJSON);
        fs.writeFileSync('./tree.json', treeInJSON);
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
        this.addLicenseToTree(licenseNumber)    //add licenseNumber into the tree;

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
        }).sort((a, b) => b.registered - a.registered)

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
            // Step3: calculate the sum from the numbers array. i.e. '6666' => 24
            const sum = numbers.reduce((acc, num) => acc += Number(num), 0);
            // const sum = numbers.reduce((acc, num) => {
            //     acc += Number(num);
            //     return acc;
            // }, 0);
            return sum === 21;
        }).sort();
    }

    // 返回有且只有两个相同字母的车牌号array
    getDoubleLicenses() {
        /** Method 1 */
        // const licenseArray = [];
        // for (let licenseNum of this.licenseSet) {
        //     const letterPart = licenseNum.slice(1, 4).split("");
        //     const letterMap = letterPart.reduce((acc, letter) => {
        //         acc[letter] = acc[letter] + 1 || 1;
        //         return acc;
        //     }, {})
        //     licenseArray.push(Object.values(letterMap).some(count => count === 2));
        // }
        // return licenseArray;

        /** Method 2 */
        return [...this.licenseSet].filter(licenesNum => {
            // Step 1: get the list of letters from each license
            // i.e. ['6LXD666'] => ['LZD']
            const letterPart = licenesNum.slice(1, 4).split("");
            // Step 2: build the letter-count map
            // i.e. 'LZZ' => {'L':1, 'Z':2}
            const letterMap = letterPart.reduce((acc, letter) => {
                acc[letter] = acc[letter] + 1 || 1;
                return acc;
            }, {})

            // Step 3: check if any val (the  'count') equals to 2
            // i.e. Object.values({'L':1, 'Z':2}) => [1,2]
            // [1,2].some(((count)=>count===2)) gets true
            return Object.values(letterMap).some(count => count === 2);
        })

        /** Method 3 */
        // return [...this.licenseSet].filter(letterNumber => {
        //     return new Set(letterNumber.slice(1, 4)).size === 2
        // })
    }

    // 返回三个字母都相同的车牌号array
    // getLuckyLicenses() {
    //     const licenseArray = [];
    //     for (let licenseNum of this.licenseSet) {
    //         const letters = licenseNum.slice(1, 4);
    //         if (letters[0] === letters[1] && letters[1] === letters[2]) licenseArray.push(licenseNum)
    //     }
    //     return licenseArray;
    // }
    getLuckyLicenses() {
        return [...this.licenseSet].filter(licenseNum => {
            const letterPart = licenseNum.slice(1, 4).split("");
            return new Set(letterPart).size === 1;
        })
    }

    // 返回三个字母都相同&至少两个数字相同的车牌号array
    /** Method 1 */
    // getRoyalLicenses() {
    //     const luckyLicenses = this.getLuckyLicenses();
    //     const royalLicenses = [];
    //     for (let licenseNum of luckyLicenses) {
    //         const nums = licenseNum[0] + licenseNum.slice(-3);
    //         const numMap = {};
    //         for (let num of nums) {
    //             numMap[num] = numMap[num] + 1 || 1

    //         }
    //         const royalLicensesArray = Object.values(numMap).sort();
    //         if (royalLicensesArray[royalLicensesArray.length - 1] >= 2) {
    //             // if (Object.values(numMap).sort().slice(-1)[0] >= 2) {
    //             royalLicenses.push(licenseNum)
    //         }
    //     }
    //     return royalLicenses;
    // }

    /** Method 2 */
    getRoyalLicenses() {
        // Step 1: get Lucky licenses and filter from them
        const licenseNumbers = this.getLuckyLicenses();
        // Step 2: get all the number parts (4 numbers)
        // Step 3: new Set(numbers).size <= 3
        return licenseNumbers.filter(licenseNum => {
            const numberParts = licenseNum.split("").filter((letter) => { return !isNaN(letter) });
            return new Set(numberParts).size <= 3;
        })
    }

}


module.exports = PlateLicense;
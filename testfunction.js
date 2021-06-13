    getLicense(license) {   //'6LZD666'
        return this.licenses.filter(item => item.license === license)[0]     // filter
    }

    updateLicenseStatus(licenseNumber, status) {
        // const license = this.getLicense(licenseNumber);
        // license.registered = status;
        this.licenses.forEach(license => {
            if (license.license === licenseNumber) return license.status = status;
        })
    }

    unRegisterLicense(licenseNum) {
        this.licenses = this.licenses.filter(license => {
            return license.license !== licenseNum
        })

        if(this.licenseSet.has(licenseNum)) this.licenseSet.delete(licenseNum)
    }

    // 返回一个含有所有数字总数是21的车牌号码的array，升序排列
    getMagicLicenses() {
        const licenseArray = [];
        for (let licenseNum of this.licenseSet) {
            if (Number(licenseNum[0]) + Number(licenseNum[4]) + Number(licenseNum[5]) + Number(licenseNum[6]) === 21) licenseArray.push(licenseNum)
        }
        return licenseArray.sort();
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


// describe("#6 Get LicenseObj with license number", () => {
//     it("return License information", () => {
//         const obj = pl.getLicense("6LZD666");
//         expect(obj).toEqual({
//             "license": "6LZD666",           //string
//             "registered": 1622953087393,    //UTC timestamp
//             "status": "REGISTERED"          //string
//         })
//     });

//     it("update registered information", () => {
//         pl.updateLicenseStatus("6LZD666", "SUSPENDED");
//         const newLicenseStatus = pl.getLicense("6LZD666");
//         expect(newLicenseStatus.status).toBe("SUSPENDED");
//     })
// })

// describe("#7 Removed License from records", () => {
//     it("", () => {
//         pl.unRegisterLicense("6LZD666");
//         pl.licenses.map(item => {
//             expect(item.license).not("6LZD666");
//         })
//     })
// })
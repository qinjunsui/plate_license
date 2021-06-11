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
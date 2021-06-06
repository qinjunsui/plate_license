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
}


module.exports = PlateLicense;
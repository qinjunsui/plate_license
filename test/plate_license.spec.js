const PlateLicense = require("../plate_license");
let pl = new PlateLicense();

beforeEach(()=>{
    pl = new PlateLicense();
})

describe("#1 Generate PlateLicense class", () => {
    it("successfully generate the instance", () => {
        const pl = new PlateLicense();
        expect(pl).toBeDefined();
    });
});

describe("#2 Track records", () => {
    it("successfully get all plate licenses", () => {
        const pl = new PlateLicense();
        expect(pl.getAllLicenses().length).toBe(1);
    });
});
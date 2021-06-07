const PlateLicense = require("../plate_license");
let pl = new PlateLicense();

beforeEach(() => {
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

describe("#3 Generate Plate Licensee", () => {
    // const licenseObject = pl.generateNewLicense();
    // const licenseNumber = licenseObject.license;
    

    describe("For license number", () => {
        const { license } = pl.generateNewLicense();
        it("it has 7 digits", () => {
            expect(license.length).toBe(7)
        });

        it("should have 4 numbers", () => {
            const numbers = license.split("").filter(item => {
                return !isNaN(item)
            }); // i.e. '6LZD123' => ['6','1','2','3']
            expect(numbers.length).toBe(4);
        });

        it("should have 3 letters in uppercase", () => {
            // i.e. '6LZD123'.match(/[A-Z]/g); => ['L','Z','D']
            const letters = license.match(/[A-Z]/g);
            expect(letters.length).toBe(3)
        })
    });

    it("have register time defined", () => {
        const { registered } = pl.generateNewLicense();
        expect(registered).toBeDefined();
    });

    it("have status is REGISTERED", () => {
        const { status } = pl.generateNewLicense();
        expect(status).toBe("REGISTERED");
    });

    it("updates the licenses variables in class", () => {
        pl.generateNewLicense();
        expect(pl.getAllLicenses().length).toBe(2)
    })
});


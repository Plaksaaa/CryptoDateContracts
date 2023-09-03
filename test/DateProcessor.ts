import { loadFixture, ethers, expect, upgrades, anyValue, SignerWithAddress } from "./setup";
import { DateProcessor, DateProcessor__factory, } from "../typechain-types";

import usdcJson from "./IERC20.json";
import { usdcAddress } from "../constants";

// constants
function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const generateProfiles = async function generateProfiles(dateProcessor: DateProcessor): Promise<any[]> {
    let tgLinks = [];

    for (let i = 0; i < 7; i++) {
        let tgLink = ethers.utils.randomBytes(32);
        tgLinks.push(tgLink);

        await dateProcessor.createProfile(
            makeid(4),
            18,
            tgLink
        );
    }

    return tgLinks;
}
// Tests
describe("DateProcessor", function () {
    async function deployFixture() {
        const [
            owner,
            man,
            girl,
            feeReceiver,
        ] = await ethers.getSigners();

        const usdcContract = new ethers.Contract(
            usdcAddress,
            usdcJson.abi,
            ethers.provider,
        );

        await (
            await usdcContract
                .connect(owner)
                .approve(owner.address, 100000000 * 10 ** 6)
        ).wait();

        const DateProcessor = await ethers.getContractFactory("DateProcessor");
        const dateProcessor: DateProcessor = await DateProcessor.deploy();
        await dateProcessor.deployed();

        return {
            dateProcessor,
            usdcContract,
            owner,
            man,
            girl,
            feeReceiver,
        };
    }

    describe("deployment", function () {
    });

    describe("createProfile", function () {
        it("Should work", async function () {
            const { dateProcessor, man } = await loadFixture(deployFixture);

            const tgLink = ethers.utils.randomBytes(32);

            await expect(dateProcessor.connect(man).createProfile("max", 20, tgLink)
            ).to.emit(dateProcessor, "ProfileCreated")
                .withArgs(man.address);

            expect(
                (await dateProcessor.profiles(man.address)).name
            ).to.eq("max");
        });

        it("Should revert if profile already exist", async function () {
            const { dateProcessor, man } = await loadFixture(deployFixture);

            const tgLink = ethers.utils.randomBytes(32);

            await expect(dateProcessor.connect(man).createProfile("max", 20, tgLink)
            ).to.emit(dateProcessor, "ProfileCreated")
                .withArgs(man.address);

            await expect(
                dateProcessor.connect(man).createProfile("max", 20, tgLink)
            ).to.be.revertedWith("Profile already registered");
        });
    });

    describe("like", function () {
        it("Should work", async function () {
            const { dateProcessor, man, girl } = await loadFixture(deployFixture);

            const tgLink = ethers.utils.randomBytes(32);

            await expect(dateProcessor.connect(man).createProfile("max", 20, tgLink)
            ).to.emit(dateProcessor, "ProfileCreated")
                .withArgs(man.address);

            await dateProcessor.connect(man).like(girl.address);

            expect(await dateProcessor.likes(man.address, 0)
            ).to.eq(girl.address);
        });

        it("Should revert if profile already liked", async function () {
            const { dateProcessor, man } = await loadFixture(deployFixture);

            const tgLink = ethers.utils.randomBytes(32);

            await expect(dateProcessor.connect(man).createProfile("max", 20, tgLink)
            ).to.emit(dateProcessor, "ProfileCreated")
                .withArgs(man.address);

            await expect(
                dateProcessor.connect(man).createProfile("max", 20, tgLink)
            ).to.be.revertedWith("Profile already registered");
        });
    });

    describe("findCouple", function () {
        it("Should work", async function () {
            const { dateProcessor, man, girl } = await loadFixture(deployFixture);

            await generateProfiles(dateProcessor);

            console.log(await dateProcessor.connect(man).findCouple());
        });

        it("createCouple", async function () {
            const { dateProcessor, man, girl } = await loadFixture(deployFixture);

            const tgMan = ethers.utils.randomBytes(32);
            const tgGirl = ethers.utils.randomBytes(32);

            await expect(dateProcessor.connect(man).createProfile("max", 20, tgMan)
            ).to.emit(dateProcessor, "ProfileCreated")
                .withArgs(man.address);

            await expect(dateProcessor.connect(girl).createProfile("ast", 20, tgGirl)
            ).to.emit(dateProcessor, "ProfileCreated")
                .withArgs(girl.address);

            await dateProcessor.connect(girl).like(man.address);

            await dateProcessor.connect(man).like(girl.address);

            expect(await dateProcessor.couples(man.address, 0)).to.eq(girl.address);
            expect(await dateProcessor.couples(girl.address, 0)).to.eq(man.address);
        });
    });
});

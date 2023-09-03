/* eslint-disable no-console */
import { config } from "dotenv";
import { ethers, upgrades } from "hardhat";

import { DateProcessor } from "../typechain-types";
import { deploy } from "@openzeppelin/hardhat-upgrades/dist/utils";

config();

async function main() {
    const [owner] = await ethers.getSigners();

    const DateProcessor = await ethers.getContractFactory("DateProcessor");
    const dateProcessor = await DateProcessor.deploy();
    await dateProcessor.deployed();
    console.log(dateProcessor.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

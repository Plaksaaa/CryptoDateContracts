const { run } = require("hardhat");

async function main() {
    const contractAddress = "0x463023AAa724036E1906209c89244Df385CFca55";

    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: [],
            contract: "contracts/DateProcessor.sol:DateProcessor",
        });
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!");
        } else {
            console.log(error);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
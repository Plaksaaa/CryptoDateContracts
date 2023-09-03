// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

/**
 * @title IDateProcessor
 *
 */
interface IDateProcessor {
    event CoupleCreated(address, address);
    event ProfileCreated(address user);

    struct Profile {
        string name;
        uint8 age;
        bytes32 telegramLink;
    }

    function createProfile(string memory name, uint256 age, bytes32 ) external;

    function like(address profile_) external;

    function findCouple() external returns (Profile[] memory couples_);

    // function findCoupleRightNow() external view returns (Profile memory);
}

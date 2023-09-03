// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {IERC165, ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {Context, Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IDateProcessor} from "./interfaces/IDateProcessor.sol";

import "hardhat/console.sol";

/**
 * @title Date Processor
 *
 */
contract DateProcessor is IDateProcessor, ERC165, Ownable, AccessControl {
    mapping(address => address[]) public couples;

    mapping(address => address[]) public likes;

    mapping(address => Profile) public profiles;

    Profile[] profilesArray;

    address private feeReceiver;

    modifier onlyNotLiked(address profile) {
        _isAlreadyLiked(profile);
        _;
    }

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createProfile(string memory name, uint256 age, bytes32 telegramLink) external {
        require(profiles[msg.sender].telegramLink != telegramLink, "Profile already registered");

        profiles[msg.sender] = Profile(name, uint8(age), telegramLink);
        profilesArray.push(Profile(name, uint8(age), telegramLink));

        emit ProfileCreated(msg.sender);
    }

    function like(address profile_) external {
        likes[msg.sender].push(profile_);

        if (_checkLike(profile_)) {
            couples[msg.sender].push(profile_);
            couples[profile_].push(msg.sender);

            emit CoupleCreated(msg.sender, profile_);
        }
    }

    function findCouple() external view returns (Profile[] memory couples_) {
        return _getRandomProfiles();
    }

    function _isAlreadyLiked(address lol) internal view {
        for (uint256 i = 0; i < likes[msg.sender].length; ) {
            require(likes[msg.sender][i] != lol, "Already liked");

            unchecked {
                ++i;
            }
        }
    }

    function _getRandomProfiles() internal view returns (Profile[] memory) {
        require(profilesArray.length >= 3, "Array length must be at least 3");

        uint256[] memory randomIndexes = new uint256[](3);
        Profile[] memory result = new Profile[](3);

        for (uint256 i = 0; i < 3; i++) {
            uint256 randIndex;
            bool exists;

            do {
                randIndex =
                    uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, i))) %
                    profilesArray.length;
                exists = false;

                for (uint256 j = 0; j < i; j++) {
                    if (randomIndexes[j] == randIndex) {
                        exists = true;
                        break;
                    }
                }
            } while (exists);

            randomIndexes[i] = randIndex;
        }

        for (uint256 i = 0; i < 3; i++) {
            result[i] = profilesArray[randomIndexes[i]];
        }

        return result;
    }

    function _checkLike(address profile_) internal view returns (bool) {
        for (uint256 i = 0; i < likes[profile_].length; i++) {
            if (likes[profile_][i] == msg.sender) return true;
        }
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC165) returns (bool) {
        return interfaceId == type(IDateProcessor).interfaceId || super.supportsInterface(interfaceId);
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

contract Obscurity {
    mapping(address user => bool hasFlag) public flag;

    function buyFlag(bytes calldata password) external payable {
        uint8 char;
        uint8 key = uint8(uint160(msg.sender) & 0xFF);
        require(password.length == 30, "Invalid Password");
        char = uint8(password[0]);
        require(char ^ key == 84, "Invalid Password");
        char = uint8(password[1]);
        require(char ^ key == 82, "Invalid Password");
        char = uint8(password[2]);
        require(char ^ key == 65, "Invalid Password");
        char = uint8(password[3]);
        require(char ^ key == 78, "Invalid Password");
        char = uint8(password[4]);
        require(char ^ key == 83, "Invalid Password");
        char = uint8(password[5]);
        require(char ^ key == 80, "Invalid Password");
        char = uint8(password[6]);
        require(char ^ key == 65, "Invalid Password");
        char = uint8(password[7]);
        require(char ^ key == 82, "Invalid Password");
        char = uint8(password[8]);
        require(char ^ key == 69, "Invalid Password");
        char = uint8(password[9]);
        require(char ^ key == 78, "Invalid Password");
        char = uint8(password[10]);
        require(char ^ key == 67, "Invalid Password");
        char = uint8(password[11]);
        require(char ^ key == 89, "Invalid Password");
        char = uint8(password[12]);
        require(char ^ key == 95, "Invalid Password");
        char = uint8(password[13]);
        require(char ^ key == 80, "Invalid Password");
        char = uint8(password[14]);
        require(char ^ key == 82, "Invalid Password");
        char = uint8(password[15]);
        require(char ^ key == 69, "Invalid Password");
        char = uint8(password[16]);
        require(char ^ key == 86, "Invalid Password");
        char = uint8(password[17]);
        require(char ^ key == 69, "Invalid Password");
        char = uint8(password[18]);
        require(char ^ key == 78, "Invalid Password");
        char = uint8(password[19]);
        require(char ^ key == 84, "Invalid Password");
        char = uint8(password[20]);
        require(char ^ key == 83, "Invalid Password");
        char = uint8(password[21]);
        require(char ^ key == 95, "Invalid Password");
        char = uint8(password[22]);
        require(char ^ key == 69, "Invalid Password");
        char = uint8(password[23]);
        require(char ^ key == 88, "Invalid Password");
        char = uint8(password[24]);
        require(char ^ key == 80, "Invalid Password");
        char = uint8(password[25]);
        require(char ^ key == 76, "Invalid Password");
        char = uint8(password[26]);
        require(char ^ key == 79, "Invalid Password");
        char = uint8(password[27]);
        require(char ^ key == 73, "Invalid Password");
        char = uint8(password[28]);
        require(char ^ key == 84, "Invalid Password");
        char = uint8(password[29]);
        require(char ^ key == 83, "Invalid Password");
        flag[msg.sender] = true;
    }
}

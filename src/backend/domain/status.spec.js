import * as tokens from "./tokens.js";
import * as status from "./status.js";


const mockDbTokens = [
    'client123456789', '17522f', '07351a',          'cbf63d',
    'e9a89a',          '0f4f7a', '29a8aa',          '187fc2',
    'df60ae',          'fc9c09', 'client123456789', '3efefb',
    '656745',          'aecd91', 'b12b0d',          '56049d',
    '5191c9',          '4bb7e6', 'db9cad',          '53c227',
    'client123456789', 'de9b21', 'd6894c',          '9ced38',
    'bb8a94',          'aa8c32', '9a71a9',          'c5555e',
    '3da2bd',          '003fc4', 'client123456789', 'b1f791',
    '7af63a',          '1afa6c', '3a51dc',          '6c2482',
    'fb65bc',          '76fee9', '5baa80',          '956cfd',
    'client123456789', 'a0ebe9', '901133',          'bd6103',
    '2caa7c',          'c67ee0', '8fac8c',          '25a52d',
    'bf0ce6',          '03a975', 'client123456789', '91a358',
    '88c9eb',          '379b17', 'f0491c',          '188e39',
    '006c29',          'a34bba', '123c89',          'bdbe4d',
    'client123456789', 'ffab04', '48acb9',          '62c334',
    '9b7731',          'c64923', 'c36413',          '0574e8',
    '60243e',          '451262', 'client123456789', 'a23c42',
    '1a046d',          '9de93d', 'a7215d',          '89a077',
    '2bed5d',          '4b2ed2', '964310',          '03f52f',
    'client123456789', 'b8fd53', 'ebb1dc',          'dec434',
    'd6a475',          'e57c1c', '857b34',          '6ad50b',
    '9d0f93',          'ce62ac', 'client123456789', '2877d2',
    'fd6e32',          '35c3c1', '60282b',          'b1c196',
    '4f8e8b',          'aa3a30', '156a96',          '87ace3'
];

describe("Status", () => {
    it("should validate to true", async () => {
        const reqTokens = mockDbTokens.slice(5, 15);
        
        const result = status.checkTokensMatchInDb("client123456789", reqTokens, mockDbTokens);
        
        expect(result).toEqual(true);
    });
    
    it("should validate to true when client id is first in list", async () => {
        const reqTokens = mockDbTokens.slice(0, 15);
        
        const result = status.checkTokensMatchInDb("client123456789", reqTokens, mockDbTokens);
        
        expect(result).toEqual(true);
    });
    
    it("should validate to true when client id is 10th", async () => {
        const reqTokens = mockDbTokens.slice(10, 15);
        
        const result = status.checkTokensMatchInDb("client123456789", reqTokens, mockDbTokens);
        
        expect(result).toEqual(true);
    });
    
    it("should validate to false if order is not correct", async () => {
        const reqTokens = ["rogue"].concat(mockDbTokens.slice(5, 15));
        
        const result = status.checkTokensMatchInDb("client123456789", reqTokens, mockDbTokens);
        
        expect(result).toEqual(false);
    });
});

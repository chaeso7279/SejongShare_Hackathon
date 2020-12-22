import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { iteratee } from 'lodash';
import { async } from 'regenerator-runtime';
chai.use(chaiAsPromised)
const { expect, assert } = chai

const MyNFT = artifacts.require("MyNFT");

contract('Test MyNFT contract', function(accounts) {

    let token;
    const name = "AvarCat";
    const symbol = "ACat";

    const account1 = accounts[1];
    const tokenId1 = 1111;
    const tokenUri1 = "This is data for the token 1";

    const account2 = accounts[2];
    const tokenId2 = 2222;
    const tokenUri2 = "This is data for the token 2";

    const account3 = accounts[3];

    // ERC721 토큰으로 발행이 잘 되는지 확인
    it(' deploy and mint ERC721 token', async () => {
        token = await MyNFT.new(name, symbol); // 위에서 정의한 이름, 심벌로 생성자 만듦

        // 인자로 계정1의 계정, tokenID, URI를 넣음, 컨트랙트 소유자 계정에서 이를 호출(from ~ )
        await token.registerUniqueToken(account1, tokenId1, tokenUri1, {from: accounts[0]});

        // expect(값).to.equal(테스트값): 테스트 결과 값이 기대값과 일치하는지 확인
        expect(await token.symbol()).to.equal(symbol); 
        expect(await token.name()).to.equal(name);
    })

    // 계정2로 이미 등록했던 toeknID1을 다시 등록하는 테스트 =>
    // 토큰이 고유한지를 판단하기 위함임: 재등록 되지 않고 rejectedWith 메세지 반환되어야함
    it(' check unique id', async () => {
        const duplicateTokenID = token.registerUniqueToken(account2, tokenId1, tokenUri2, {from: accounts[0]});
        expect(duplicateTokenID).to.be.rejectedWith(/VM Exception while processing transaction: revert/);
    })


    it(' create multiple unique tokens and manage ownership', async () => {
        // 계정2 등록 후, 전체 토큰 발행량이 2와 같은지 확인
        const additionalToken = await token.
                        registerUniqueToken(account2, tokenId2, tokenUri2, {from: accounts[0]});
        expect(Number(await token.totalSupply())).to.equal(2);

        // 발행한 토큰이 tokenId1과 tokenId2를 가지는지 확인
        expect(await token.exists(tokenId1)).to.be.true;
        expect(await token.exists(tokenId2)).to.be.true;

        // tokenId1 소유자 == 계정1, tokenId2 소유자 == 계정2 맞는지 확인
        expect(await token.ownerOf(tokenId1)).to.equal(account1);
        expect(await token.ownerOf(tokenId2)).to.equal(account2);
    })

    // 다른 계정으로 소유권을 변경
    it(' safe transfer', async () => {
        // 계정2 -> 계정3 으로 tokenId1을 전송: tokenId1은 계정2 소유X => 에러
        const unownedTokenId = token.safeTransferFrom(account2, account3, tokenId1, {from: accounts[2]});
        expect(unownedTokenId).to.be.rejectedWith(/VM Exception while processing transaction: revert/);

        // 계정1 -> 계정3 으로 tokenId2을 전송: tokenId2은 계정1 소유X => 에러
        const wrongOwner = token.safeTransferFrom(account1, account3, tokenId2, {from:accounts[1]});
        expect(wrongOwner).to.be.rejectedWith(/VM Exception while processing transaction: revert/);

        // 계정2 -> 계정3 으로 tokenId2을 전송: but, 해당 컨트랙트를 계정1이 호출 => 에러.
        // 토큰 전달하고자 하는 계정(계정2)만이 호출 가능
        const wrongFromGas = token.safeTransferFrom(account2, account3, tokenId2, {from:accounts[1]});
        expect(wrongFromGas).to.be.rejectedWith(/VM Exception while processing transaction: revert/);
        
        // 계정2 -> 계정3 으로 tokenId2 전송 
        await token.safeTransferFrom(account2, account3, tokenId2, {from: accounts[2]});
        // tokenId2의 소유권 계정3으로 바뀌었는지 확인함
        expect(await token.ownerOf(tokenId2)).to.equal(account3);
    })
})
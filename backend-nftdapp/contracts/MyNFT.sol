pragma solidity ^0.4.24;

import "../../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract MyNFT is ERC721Token { // ERC721Token 상속받음
    // 등록하려고 하는 토큰이름, 심벌이 기본 값
    constructor (string _name, string _symbol) public ERC721Token(_name, _symbol) {}

    // 토큰 등록 시 
    function registerUniqueToken(
        address _to,        // 소유권의 어드레스
        uint256 _tokenId,   // 토큰의 고유 ID
        string _tokenURI    // 세부 정보 포함하는 URI 가 인자
    ) public {
        super._mint(_to, _tokenId);  // _mint: 새 토큰 생성
        super._setTokenURI(_tokenId, _tokenURI);
        emit TokenRegistered(_to, _tokenId);    // 토큰 등록 시 다음과 같이 호출
    }
    
    event TokenRegistered(address _by, uint256 _tokenId);   // 토큰 등록에 대한 이벤트 
}
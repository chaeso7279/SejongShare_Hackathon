pragma solidity ^0.4.24;

import "./MyNFT.sol";

contract Auctions {             // 등록된 구매 및 판매 물품들
    struct Auction {            // 물품
        string name;            // 물품 이름
        string metadata;        // 메타데이터: ipfs hash
        uint256 price;          // 가격
        uint256 tokenId;        // 토큰 아이디
        address owner;          // 소유자
        address repoAddress;    // nft 컨트랙트 어드레스
        bool active;            // 판매 활성화 여부
        bool finalized;         // 판매 종료 여부
    }

    // 구조체 Auction을 저장하는 전체 배열
    Auction[] public auctions; 
    // 각 소유자 어드레스가 갖고있는 tokenId의 배열에 대한 맵핑
    mapping(address => uint[]) public auctionOwner; 

    // 컨트랙트에 직접 송금하지 못하도록 함
    function() public {
        revert(); 
    }

    // 해당 컨트랙트가 특정 NFT 소유권을 갖고 있는지 확인
    modifier constractIsNFTOwner(address _repoAddress, uint256 _tokenId) {
        // MyNFT()에 어드레스 넣고, ownerOf로 해당 토큰의 소유자 어드레스를 가져옴
        address nftOwner = MyNFT(_repoAddress).ownerOf(_tokenId);
        // 해당 토큰의 소유자 어드레스 == Auctions의 컨트랙트 어드레스 => 일치하면 다음으로
        require(nftOwner == address(this));
        _;
    }

    // 새 옥션 생성
    function createAuction(address _repoAddress, uint256 _tokenId, 
    string _auctionTitle, string _metadata, uint256 _price) public
    constractIsNFTOwner(_repoAddress, _tokenId) returns(bool) { 
        // 토큰이 Auctions 컨트랙트 어드레스의 소유인지 확인 => 아니면 못들어옴
        
        uint auctionId = auctions.length;
        
        Auction memory newAuction;
        newAuction.name = _auctionTitle;
        newAuction.price = _price;
        
        newAuction.metadata = _metadata;
        newAuction.tokenId = _tokenId;
        newAuction.repoAddress = _repoAddress;
        
        newAuction.owner = msg.sender;
        
        newAuction.active = true;
        newAuction.finalized = false;

        // 새 옥션을 배열에 추가하고, Owner맵에 새 auctionId도 추가함
        auctions.push(newAuction);
        auctionOwner[msg.sender].push(auctionId);

        // AuctionCreated 이벤트 송출
        emit AuctionCreated(msg.sender, auctionId);
        return true;
    }

    // 옥션을 소유자에게 전달
    function finalizeAution(uint _auctionId, address _to) public {
        // memory: 휘발성, 잠시 메모리에 저장됨
        Auction memory myAuction = auctions[_auctionId];

        // 옥션의 NFT컨트랙트 어드레스(_repoAddress), _tokenId, 
        // 현재 컨트랙트 어드레스(address(this)), 받는 어드레스(_to)
        // 받는 어드레스에 소유권이 승인되고 전달되는 함수
        if(approveAndTransfer(address(this), _to, myAuction.repoAddress, myAuction.tokenId)) {
            auctions[_auctionId].active = false;    // 액티브 완료
            auctions[_auctionId].finalized = true; // 해당 옥션의 상태는 종료

            // AuctionFinalized 이벤트 전달
            emit AuctionFinalized(msg.sender, _auctionId);
        }
    }

    // 옥션 취소 
    function cancleAuction(uint _auctionId, address _to) public {
        // to: 기존 판매자, address(this): 구매자
        Auction memory refundAuction = auctions[_auctionId];

        if(approveAndTransfer(address(this), _to, refundAuction.repoAddress, refundAuction.tokenId)) {
            // 환불이 완료된 시점(owner = 판매자)
            auctions[_auctionId].active = true; // 판매 활성화
            auctions[_auctionId].finalized = false; // 해당 옥션 상태 종료 X

            // 기존 판매자에게 구매 취소 이벤트 전달
            emit AuctionCancled(_to, _auctionId);
        }
    }

    function approveAndTransfer(address _from, address _to, address _repoAddress, uint256 _tokenId) 
    internal returns (bool) {   // internal: 컨트랙트 내부에서만 호출 가능
        // MyNFT 컨트랙트에 컨트랙트 어드레스 넣고 인스턴스 가져옴
        MyNFT remoteContract = MyNFT(_repoAddress);
       
        // approve(_to, _tokenId): 해당 토큰(_tokenId)을 받는 어드레스(_to)를 승인
        remoteContract.approve(_to, _tokenId);
        // transferFrom(_from, _to, _tokenId): 해당 어드레스(_to)로 전송
        remoteContract.transferFrom(_from, _to, _tokenId);
        return true;
    }

    // 옥션 전체 개수 반환
    function getCount() public constant returns(uint) {
        return auctions.length;
    }

    // 소유자의 옥션 리스트 반환
    function getAuctionsOf(address _owner) public constant returns(uint[]) {
        uint[] memory ownedAuctions = auctionOwner[_owner];
        return ownedAuctions;
    }

    // 소유자 옥션 리스트의 개수 반환
    function getAuctionsCountOfOwner(address _owner) public constant returns(uint) {
        return auctionOwner[_owner].length;
    }

    // 특정 id에 대한 옥션을 반환
    function getAuctionById(uint _auctionId) public constant 
    returns(string name, uint256 price, string metadata, uint256 tokenId, address repoAddress, address owner, bool active, bool finalized) {
        Auction memory auc = auctions[_auctionId];
        return (
            auc.name,
            auc.price,
            auc.metadata,
            auc.tokenId,
            auc.repoAddress,
            auc.owner,
            auc.active,
            auc.finalized
        );
    }

    // 이벤트 정의
    event AuctionCreated(address _owner, uint _auctionId);
    event AuctionFinalized(address _owner, uint _auctionId);
    event AuctionCancled(address _owner, uint _auctionId);
}
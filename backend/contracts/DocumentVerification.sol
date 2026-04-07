// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentVerification {
    struct Document {
        string documentHash;
        address issuer;
        uint256 timestamp;
        bool isValid;
    }

    mapping(string => Document) public documents;

    event DocumentIssued(string indexed documentHash, address indexed issuer, uint256 timestamp);

    function issueDocument(string memory _documentHash) public {
        require(!documents[_documentHash].isValid, "Document already exists");
        
        documents[_documentHash] = Document({
            documentHash: _documentHash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            isValid: true
        });

        emit DocumentIssued(_documentHash, msg.sender, block.timestamp);
    }

    function verifyDocument(string memory _documentHash) public view returns (bool, address, uint256) {
        Document memory doc = documents[_documentHash];
        return (doc.isValid, doc.issuer, doc.timestamp);
    }
}

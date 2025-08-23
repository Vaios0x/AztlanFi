// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract RemittanceToken is ERC20, ERC20Burnable, Ownable, Pausable {
    // Token de recompensas para el sistema de remesas
    // Permite minting desde contratos autorizados
    // Incluye funcionalidad de pausado para emergencias
    
    mapping(address => bool) public authorizedMinters;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event TokensMinted(address indexed to, uint256 amount, string reason);
    
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }
    
    constructor() ERC20("AztlanFi Token", "AZTLAN") Ownable(msg.sender) {
        // Mint tokens iniciales al deployer
        _mint(msg.sender, 1000000 * 10**decimals()); // 1M tokens
    }
    
    function addMinter(address _minter) external onlyOwner {
        require(_minter != address(0), "Invalid address");
        authorizedMinters[_minter] = true;
        emit MinterAdded(_minter);
    }
    
    function removeMinter(address _minter) external onlyOwner {
        authorizedMinters[_minter] = false;
        emit MinterRemoved(_minter);
    }
    
    function mint(address _to, uint256 _amount, string calldata _reason) external onlyAuthorizedMinter whenNotPaused {
        require(_to != address(0), "Cannot mint to zero address");
        require(_amount > 0, "Amount must be greater than 0");
        
        _mint(_to, _amount);
        emit TokensMinted(_to, _amount, _reason);
    }
    
    function mintBatch(
        address[] calldata _recipients,
        uint256[] calldata _amounts,
        string calldata _reason
    ) external onlyAuthorizedMinter whenNotPaused {
        require(_recipients.length == _amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0), "Cannot mint to zero address");
            require(_amounts[i] > 0, "Amount must be greater than 0");
            
            _mint(_recipients[i], _amounts[i]);
            emit TokensMinted(_recipients[i], _amounts[i], _reason);
        }
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._update(from, to, amount);
    }
    
    // Función para verificar si una dirección puede mintear
    function canMint(address _address) external view returns (bool) {
        return authorizedMinters[_address] || _address == owner();
    }
}

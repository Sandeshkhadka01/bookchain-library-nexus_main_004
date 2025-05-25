// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BookLibrary {
    struct Book {
        uint256 id;
        string metadataURI; // IPFS URL
        uint256 quantity;
        uint256 available;
        address[] borrowers;
    }

    struct BorrowRecord {
        uint256 bookId;
        address borrower;
        uint256 timestamp;
        bool returned;
    }

    address public superAdmin;
    mapping(address => bool) public admins;
    mapping(address => bool) public users;

    modifier onlySuperAdmin() {
        require(msg.sender == superAdmin, "Not super admin");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Not admin");
        _;
    }

    modifier onlyAdminOrSuperAdmin() {
        require(admins[msg.sender] || msg.sender == superAdmin, "Not admin or super admin");
        _;
    }

    uint256 public nextBookId;
    mapping(uint256 => Book) public books;
    mapping(address => BorrowRecord[]) public userBorrowHistory;
    BorrowRecord[] public borrowHistory;

    address[] private adminList;
    address[] private userList;

    event BookAdded(uint256 indexed id, string metadataURI, uint256 quantity);
    event BookUpdated(uint256 indexed id, string metadataURI, uint256 quantity);
    event BookBorrowed(uint256 indexed id, address indexed borrower);
    event BookReturned(uint256 indexed id, address indexed borrower);
    event BookDeleted(uint256 indexed id);
    event AdminAdded(address indexed user);
    event AdminRemoved(address indexed user);
    event UserAdded(address indexed user);

    constructor(address _superAdmin) {
        superAdmin = _superAdmin;
        admins[_superAdmin] = true;
        users[_superAdmin] = true;
        adminList.push(_superAdmin);
        userList.push(_superAdmin);
    }

    function makeAdmin(address user) public onlySuperAdmin {
        if (!admins[user]) {
            admins[user] = true;
            adminList.push(user);
            emit AdminAdded(user);
        }
    }

    function removeAdmin(address user) public onlySuperAdmin {
        require(user != superAdmin, "Cannot remove super admin");
        if (admins[user]) {
            admins[user] = false;
            // Remove from adminList
            for (uint i = 0; i < adminList.length; i++) {
                if (adminList[i] == user) {
                    adminList[i] = adminList[adminList.length - 1];
                    adminList.pop();
                    break;
                }
            }
            emit AdminRemoved(user);
        }
    }

    function getAllAdmins() public view returns (address[] memory) {
        return adminList;
    }

    function isAdmin(address user) public view returns (bool) {
        return admins[user];
    }

    function addUser(address user) public onlyAdminOrSuperAdmin {
        if (!users[user]) {
            users[user] = true;
            userList.push(user);
            emit UserAdded(user);
        }
    }

    function removeUser(address user) public onlyAdminOrSuperAdmin {
        if (users[user]) {
            users[user] = false;
            // Remove from userList
            for (uint i = 0; i < userList.length; i++) {
                if (userList[i] == user) {
                    userList[i] = userList[userList.length - 1];
                    userList.pop();
                    break;
                }
            }
        }
    }

    function getAllUsers() public view returns (address[] memory) {
        return userList;
    }

    function isUser(address user) public view returns (bool) {
        return users[user];
    }

    function addBook(string memory metadataURI, uint256 quantity) external onlyAdmin {
        require(quantity > 0, "Quantity must be positive");
        books[nextBookId] = Book({
            id: nextBookId,
            metadataURI: metadataURI,
            quantity: quantity,
            available: quantity,
            borrowers: new address[](0)
        });
        emit BookAdded(nextBookId, metadataURI, quantity);
        nextBookId++;
    }

    function updateBook(uint256 id, string memory metadataURI, uint256 quantity) external onlyAdmin {
        require(quantity > 0, "Quantity must be positive");
        Book storage book = books[id];
        require(book.quantity > 0, "Book does not exist");
        book.metadataURI = metadataURI;
        book.quantity = quantity;
        // Adjust available if needed
        if (book.available > quantity) {
            book.available = quantity;
        }
        emit BookUpdated(id, metadataURI, quantity);
    }

    function deleteBook(uint256 id) external onlyAdmin {
        Book storage book = books[id];
        require(book.quantity > 0, "Book does not exist");
        require(book.available == book.quantity, "Cannot delete book while copies are borrowed");
        delete books[id];
        emit BookDeleted(id);
    }

    function borrowBook(uint256 id) external {
        Book storage book = books[id];
        require(book.quantity > 0, "Book does not exist");
        require(book.available > 0, "No copies available");
        // Check if user already borrowed
        for (uint i = 0; i < book.borrowers.length; i++) {
            require(book.borrowers[i] != msg.sender, "Already borrowed");
        }
        book.available--;
        book.borrowers.push(msg.sender);
        BorrowRecord memory record = BorrowRecord({
            bookId: id,
            borrower: msg.sender,
            timestamp: block.timestamp,
            returned: false
        });
        userBorrowHistory[msg.sender].push(record);
        borrowHistory.push(record);
        emit BookBorrowed(id, msg.sender);
    }

    function returnBook(uint256 id) external {
        Book storage book = books[id];
        require(book.quantity > 0, "Book does not exist");
        bool found = false;
        for (uint i = 0; i < book.borrowers.length; i++) {
            if (book.borrowers[i] == msg.sender) {
                found = true;
                // Remove borrower
                book.borrowers[i] = book.borrowers[book.borrowers.length - 1];
                book.borrowers.pop();
                break;
            }
        }
        require(found, "Not a borrower");
        book.available++;
        // Update borrow record
        BorrowRecord[] storage records = userBorrowHistory[msg.sender];
        for (uint i = 0; i < records.length; i++) {
            if (records[i].bookId == id && !records[i].returned) {
                records[i].returned = true;
                break;
            }
        }
        for (uint i = 0; i < borrowHistory.length; i++) {
            if (borrowHistory[i].bookId == id && borrowHistory[i].borrower == msg.sender && !borrowHistory[i].returned) {
                borrowHistory[i].returned = true;
                break;
            }
        }
        emit BookReturned(id, msg.sender);
    }

    function getBooks() external view returns (Book[] memory) {
        uint count = 0;
        for (uint i = 0; i < nextBookId; i++) {
            if (books[i].quantity > 0) {
                count++;
            }
        }
        Book[] memory result = new Book[](count);
        uint idx = 0;
        for (uint i = 0; i < nextBookId; i++) {
            if (books[i].quantity > 0) {
                result[idx] = books[i];
                idx++;
            }
        }
        return result;
    }

    function getBook(uint256 id) external view returns (Book memory) {
        require(books[id].quantity > 0, "Book does not exist");
        return books[id];
    }

    function getBorrowHistory() external view returns (BorrowRecord[] memory) {
        return borrowHistory;
    }

    function getUserBorrowHistory(address user) external view returns (BorrowRecord[] memory) {
        return userBorrowHistory[user];
    }

    function register() public {
        if (!users[msg.sender]) {
            users[msg.sender] = true;
            userList.push(msg.sender);
            emit UserAdded(msg.sender);
        }
    }
}
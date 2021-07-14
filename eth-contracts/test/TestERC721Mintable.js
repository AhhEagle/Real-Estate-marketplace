var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await contract.mint(account_one, 1, { from: account_one });
            await contract.mint(account_one, 2, { from: account_one });
            await contract.mint(account_two, 3, { from: account_one });
            await contract.mint(account_two, 4, { from: account_one });

        })

        it('should return total supply', async function () { 
            let totalSupply = await contract.totalSupply.call();
            assert.equal(4, totalSupply, "Total token minted should be four");
        })

        it('should get token balance', async function () { 
            let balanceOne = await contract.balanceOf.call(account_one);
            assert.equal(2, balanceOne, "account_one should have two tokens on its own.");
            let balanceTwo = await contract.balanceOf.call(account_two);
            assert.equal(2, balanceTwo, "account_two should have two token on its own.");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenUriOne = await contract.tokenURI.call(1);
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", tokenUriOne, "Invalid token URI");
        })

        it('should transfer token from one owner to another', async function () { 
            try 
            {
                await contract.transferFrom(account_one, account_two, 2, { from: account_one });
            }
            catch(e) {
                console.log('TransferFrom failed.', e);
            }
            let ownerOfOne = await contract.ownerOf.call(1);
            assert.equal(account_one, ownerOfOne, "Not the owner of token.");
            })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let denied = false;
            try  {
                await contract.mint(account_one, 4, { from: account_two });
            } catch(e) {
                denied = true;
            }
            assert.equal(true, denied, "Unable to mint");
        })

        it('should return contract owner', async function () { 
            let owner = await contract.getOwner.call();
            assert.equal(account_one, owner, "You are not the owner of this token");
        })

    });
})
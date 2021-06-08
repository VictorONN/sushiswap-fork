const {expectRevert, time} = require('@openzeppelin/test-helpers');
const { inTransaction } = require('@openzeppelin/test-helpers/src/expectEvent');
const { expect } = require('chai');
const ethers = require('ethers');
const SushiToken = artifacts.require('SushiToken');
const MasterChef = artifacts.require('MasterChef');
const MockERC20 = artifacts.require('MockERC20');
const Timelock = artifacts.require('Timelock');

function encodeParameters(types, values) {
    const abi = new ethers.utils.AbiCoder();
    return abi.encode(types, values);
}

contract('Timelock', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async()=> {
        this.sushi = await SushiToken.new({from: alice});
        this.timelock = await Timelock.new(bob, '259200', {from: alice});
    });

    it('should not allow non-owner to do operation', async ()=> {
        await this.sushi.transferOwnership(this.timelock.address, {from: alice});
        await expectRevert(
            this.sushi.transferOwnership(this.timelock.address, {from: alice}),
            'Ownable: caller is not the owner',
            );
        await expectRevert(
            this.sushi.transferOwnership(carol, {from: bob}),
            'Ownable: caller is not the owner',
        );
        await expectRevert(
            this.timelock.queueTransaction(
                this.sushi.address, '0', 'transferOwnership(address)',
                encodeParameters(['address'], [carol]),
                (await time.latest()).add(time.duration.days(4)),
                {from: alice},
            ),
            'Timelock:: queueTransaction: Call must come from admin.',
        );          
    })
})
Uniswap V2 Area

Code from Uniswap V2 with the following modifications.

    Change contract version to 0.6.12 and do the necessary patching.
    Add migrator member in UniswapV2Factory which can be set by feeToSetter.
    Allow migrator to specify the amount of liquidity during the first mint. Disallow first mint if migrator is set.

To see all diffs:

$ git diff 4c4bf551417e3df09a25aa0dbb6941cccbbac11a .

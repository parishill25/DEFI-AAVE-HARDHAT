const { ethers } = require("hardhat")
const { getWeth,Amount} = require("../scripts/getWeth.js")


async function main() {
    await getWeth()

    const { deployer } = await getNamedAccounts()
    //0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    const iWeth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        deployer
    )
    const LendingPool = await getLendingPool(deployer)
    console.log(`Lending Pool ${LendingPool.address}`)
    const WethTokenAddress= "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    await approveERC20(WethTokenAddress,LendingPool.address,Amount,deployer)
    console.log("depositing .....")
    await LendingPool.deposit(WethTokenAddress,Amount,deployer,0)
    console.log("Deposed!")
    let {totalDebtETH,availableBorrowsETH}= await getUserData(LendingPool,deployer)
    const daiprice =await getDaiPrice()
    const daipriceNumber=await daiprice.toNumber()
    console.log(daipriceNumber)
    const amountDaiToBorrow= availableBorrowsETH.toString()*0.95*(1/daipriceNumber)
    const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString())
    console.log(`The amount of Dai we can borrow is ${amountDaiToBorrow} Dai`)
   const  daiAddress= "0x6b175474e89094c44da98b954eedeac495271d0f"
    await borrowDai(daiAddress,LendingPool,amountDaiToBorrowWei,deployer)
     await getUserData(LendingPool,deployer)
     await repay(amountDaiToBorrowWei,daiAddress,LendingPool,deployer)
     await getUserData(LendingPool,deployer)
}


async function getLendingPool(account) {
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        account
    )
    const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)
    return lendingPool
    
}

async function approveERC20(erc20Address,spenderAddress,amountTospend,account){
    const ERCtoken= await ethers.getContractAt("IERC20",erc20Address,account)
     const tx =await ERCtoken.approve(spenderAddress,amountTospend)
    const txResponse= await tx.wait(1)

}

async function getUserData(LendingPool,account){
    const {totalCollateralETH,totalDebtETH,availableBorrowsETH}= await LendingPool.getUserAccountData(account)
    console.log(`You have ${totalCollateralETH} worth of ETH `)
    console.log(`You have Debt ${totalDebtETH} of ETH `)
    console.log(`You can borrow ${availableBorrowsETH} of ETH `)
    return {totalDebtETH,availableBorrowsETH}
}

async function getDaiPrice(){
    const DaiPriceContract= await ethers.getContractAt("AggregatorV3Interface","0x773616E4d11A78F511299002da57A0a94577F1f4")
    const daipriceETH= (await DaiPriceContract.latestRoundData())[1]
    console.log(`The Dai price is ${daipriceETH.toString()}`)
    return daipriceETH
}

async function borrowDai(daiAddress,lendingPool,amountDaiToBorrow,account){
    const borrowtx= await lendingPool.borrow(daiAddress,amountDaiToBorrow,1,0,account)
    const borrowtxResponse= await borrowtx.wait(1)
    console.log("You borrowed DAI")

}

async function repay(amount,daiAddress,lendingPool,account){
    await approveERC20(daiAddress,lendingPool.address,amount,account)
    const repaytx = await lendingPool.repay(daiAddress,amount,1,account)
    const txResponse= await repaytx.wait(1)
    console.log("You repay the debt")
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })


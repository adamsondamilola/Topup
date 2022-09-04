import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import CreatePin from "./components/auth-components/createPin";
import BuyData from "./components/recharge/buyData";
import BuySMEData from "./components/recharge/buySmeData";
import BuyAirtime from "./components/recharge/buy_airtime";
import ElectricityBill from "./components/recharge/electricityBill";
import TopHeader from "./components/top_header";
import ComingSoon from "./components/user-components/comingSoon";
import Dashbaord from "./components/user-components/dashboard";
import FundWallet from "./components/wallet-components/fundWallet";
import LoadVoucher from "./components/wallet-components/loadVoucher";
import Transactions from "./components/wallet-components/transactions";
import UserTemplateLayout from "./components/user-components/userTemplateLayout";
import Wallet from "./components/wallet-components/wallet";
import API from "./pages/api";
import ForgotPassword from "./pages/auth/forgotPassword";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ContactUs from "./pages/contact";
import FAQ from "./pages/faq";
import Home from './pages/home';
import Layout from "./pages/layout";
import PageNotFound from "./pages/pageNotFound";
import UpgradePackage from "./components/user-components/upgrade";
import VerifyTransaction from "./components/wallet-components/verityTransaction";
import Referrals from "./components/networking-components/referrals";
import ReferralLink from "./components/networking-components/referralLink";
import Commission from "./components/networking-components/commission";
import Points from "./components/networking-components/points";
import UserProfile from "./components/user-components/profile";
import UpdateProfile from "./components/user-components/updateProfile";
import UpdatePassword from "./components/auth-components/updatePassword";
import UpdatePIN from "./components/auth-components/updatePin";
import Settings from "./components/user-components/settings";
import Transfer from "./components/wallet-components/transfer";
import PrintAirtime from "./components/recharge/print_airtime";
import ViewGeneratedAirtime from "./components/recharge/viewGeneratedAirtime";
import CableSubscription from "./components/recharge/cableSubsription";
import CashbackTransactions from "./components/wallet-components/cashback_transactions";
import Packages from "./pages/packages";
import Incentives from "./pages/incentives";
import UnderMaintenance from "./pages/underMaintenance";
import PayElectricityBill from "./components/recharge/payElectricityBill";
import ElectricityGeneratedToken from "./components/recharge/viewElectricityGeneratedToken";
import BrowserNotSupported from "./components/user-components/BrowserNotSupported";
import ResetPin from "./components/auth-components/resetPin";
import Withdraw from "./components/wallet-components/withdraw";
import AddBankAccount from "./components/user-components/addBankAccount";
import BankAccount from "./components/user-components/bankAccount";
import UserPackageCoupons from "./components/coupon-components/userPackageCoupons";
import UserWalletCoupons from "./components/coupon-components/userWalletCoupon";
import NavPages from "./components/NavPages";
//import Presentation from "./components/topupearn-components/presentation";
import ViewTransactions from "./components/wallet-components/viewTransaction";
import Api from "./components/api-components/Api";
import ManageAirtime from "./components/recharge/ManageAirtime";
import AddAirtimePin from "./components/recharge/AddAirtimePin";
import ViewGeneratedAirtimePublic from "./components/recharge/viewGeneratedAirtimePublic";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}> 
          <Route index element={<Home />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/incentives" element={<Incentives />} />
          <Route path="/api" element={<API />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:referrer/invite" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/maintenance" element={<UnderMaintenance />} />
          <Route path="/navpages" element={<NavPages />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        
        <Route path="/user" element={<UserTemplateLayout />}>
        <Route path="/user/dashboard" element={<Dashbaord />} />
        <Route path="/user/wallet" element={<Wallet />} />
        <Route path="/user/fund_wallet" element={<FundWallet />} />
        <Route path="/user/load_voucher" element={<LoadVoucher />} />
        <Route path="/user/transactions" element={<Transactions />} />
        <Route path="/user/:id/view_transactions" element={<ViewTransactions />} />
        <Route path="/user/cashback/transactions" element={<CashbackTransactions />} />
        <Route path="/user/buy_airtime" element={<BuyAirtime />} />
        <Route path="/user/print_airtime" element={<PrintAirtime />} />
        <Route path="/user/create_pin" element={<CreatePin />} />
        <Route path="/user/cable_tv" element={<CableSubscription />} />
        <Route path="/user/none_sme_data" element={<BuyData />} />
        <Route path="/user/mtn_special" element={<BuySMEData />} />
        <Route path="/user/electricity" element={<ElectricityBill />} />
        <Route path="/user/:path/pay" element={<PayElectricityBill />} />
        <Route path="/user/:id/view_electricity_token" element={<ElectricityGeneratedToken />} />
        <Route path="/user/upgrade" element={<UpgradePackage />} />
        <Route path="/user/:id/verify_transaction" element={<VerifyTransaction />} />
        <Route path="/user/referrals" element={<Referrals />} />
        <Route path="/user/referral_link" element={<ReferralLink />} />
        <Route path="/user/commission" element={<Commission />} />
        <Route path="/user/points" element={<Points />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/update_profile" element={<UpdateProfile />} />
        <Route path="/user/update_password" element={<UpdatePassword />} />
        <Route path="/user/update_pin" element={<UpdatePIN />} />
        <Route path="/user/forgotpin" element={<ResetPin />} />
         <Route path="/user/settings" element={<Settings />} />
         <Route path="/user/add_account" element={<AddBankAccount />} />
         <Route path="/user/bank_account" element={<BankAccount />} />
         <Route path="/user/transfer" element={<Transfer />} />
         <Route path="/user/withdraw" element={<Withdraw />} />
         <Route path="/user/package_coupons" element={<UserPackageCoupons />} />
         <Route path="/user/wallet_coupons" element={<UserWalletCoupons />} />
         <Route path="/user/:id/view_airtime" element={<ViewGeneratedAirtime />} />
         <Route path="/user/:id/:token/airtime/print" element={<ViewGeneratedAirtimePublic />} />
         <Route path="/user/api" element={<Api />} />
         <Route path="/user/manage_airtime" element={<ManageAirtime />} />
         <Route path="/user/add_airtime" element={<AddAirtimePin />} />
        {/*<Route path="/user/presentation" element={<Presentation />} />*/}
        <Route path="/user/browser_not_supported" element={<BrowserNotSupported />} />
        <Route path="*" element={<ComingSoon />} />
          </Route>

                  

      </Routes>
      
        
    </BrowserRouter>
  );
}

export default App;

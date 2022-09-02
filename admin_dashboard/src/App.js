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
import PackageCoupons from "./components/admin-components/packageCoupons";
import WalletCoupons from "./components/admin-components/walletCoupons";
import CashbackTransactions from "./components/wallet-components/cashback_transactions";
import Packages from "./pages/packages";
import Incentives from "./pages/incentives";
import UnderMaintenance from "./pages/underMaintenance";
import WebsiteSettings from "./components/admin-components/websiteSettings";
import RegisteredUsers from "./components/admin-components/registeredUsers";
import ViewUserDetails from "./components/admin-components/viewUserDetails";
import EditUserDetails from "./components/admin-components/editUserDetails";
import Statistics from "./components/admin-components/statistics";
import PayElectricityBill from "./components/recharge/payElectricityBill";
import ElectricityGeneratedToken from "./components/recharge/viewElectricityGeneratedToken";
import BrowserNotSupported from "./components/user-components/BrowserNotSupported";
import ResetPin from "./components/auth-components/resetPin";
import Withdraw from "./components/wallet-components/withdraw";
import AddBankAccount from "./components/user-components/addBankAccount";
import BankAccount from "./components/user-components/bankAccount";
import UserPackageCoupons from "./components/coupon-components/userPackageCoupons";
import UserWalletCoupons from "./components/coupon-components/userWalletCoupon";
import ActiveUsers from "./components/user-components/activeUsers";
import InactiveUsers from "./components/user-components/InactiveUsers";
import EditWallet from "./components/user-components/updateWallet";
import UserTransactions from "./components/wallet-components/userTransactions";
import UpgradeDowngradePackage from "./components/user-components/upgradeDowngrade";
import ResetUserPassword from "./components/user-components/resetPassword";
import ResetUserPIN from "./components/user-components/resetPin";
import UserTransfers from "./components/wallet-components/userTransfers";
import WithdrawalTransactions from "./components/wallet-components/withdrawalTransactions";
import AdminAccounts from "./components/admin-components/AdminAccounts";
import ApiKeys from "./components/admin-components/ApiKeys";
import EditApi from "./components/admin-components/EditApi";
import AddApi from "./components/admin-components/AddApi";
import NetworkCommissions from "./components/admin-components/commission-settings/NetworkCommissions";
import CableCommissions from "./components/admin-components/commission-settings/CableCommissions";
import AirtimePrintCommissions from "./components/admin-components/commission-settings/AirtimePrintCommissions";
import ElectricityCommissions from "./components/admin-components/commission-settings/ElectricityCommissions";
import DataPrices from "./components/admin-components/DataPrices";
import AddDataPrices from "./components/admin-components/AddDataPrice";
import CablePrices from "./components/admin-components/CablePrices";
import AddCablePrices from "./components/admin-components/AddCablePrice";
import ElectricityPrices from "./components/admin-components/ElectricityPrices";
import AddElectricityPrices from "./components/admin-components/AddElectricityPrice";
import Faqs from "./components/admin-components/Faq";
import AddFaq from "./components/admin-components/AddFaq";
import FreeUsersNetworkCommissions from "./components/admin-components/commission-settings/FreeUsersNetworkCommissions";
import FreeUsersCableCommissions from "./components/admin-components/commission-settings/FreeUsersCableCommissions";
import FreeUsersAirtimePrintCommissions from "./components/admin-components/commission-settings/FreeUsersAirtimePrintCommissions";
import FreeUsersElectricityCommissions from "./components/admin-components/commission-settings/FreeUsersElectricityCommissions";
import PrintAirtimeStats from "./components/recharge/PrintAirtimeStats";
import ManageAirtime from "./components/recharge/ManageAirtime";
import AddAirtimePin from "./components/recharge/AddAirtimePin";

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
          <Route path="*" element={<PageNotFound />} />
        </Route>
        
        <Route path="/user" element={<UserTemplateLayout />}>
        <Route path="/user/dashboard" element={<Dashbaord />} />
        <Route path="/user/wallet" element={<Wallet />} />
        <Route path="/user/fund_wallet" element={<FundWallet />} />
        <Route path="/user/load_voucher" element={<LoadVoucher />} />
        <Route path="/user/transactions" element={<Transactions />} />
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
        <Route path="/user/browser_not_supported" element={<BrowserNotSupported />} />
        <Route path="*" element={<ComingSoon />} />
          </Route>

          
        <Route path="/admin" element={<UserTemplateLayout />}>
        <Route path="/admin/package_coupons" element={<PackageCoupons />} />
        <Route path="/admin/stats" element={<Statistics />} />
        <Route path="/admin/print_airtime_stats" element={<PrintAirtimeStats />} />
        <Route path="/admin/manage_airtime" element={<ManageAirtime />} />
         <Route path="/admin/add_airtime" element={<AddAirtimePin />} />
        <Route path="/admin/wallet_coupons" element={<WalletCoupons />} />
        <Route path="/admin/website_settings" element={<WebsiteSettings />} />
        <Route path="/admin/registered_users" element={<RegisteredUsers />} />
        <Route path="/admin/active_users" element={<ActiveUsers />} />
        <Route path="/admin/inactive_users" element={<InactiveUsers />} />
        <Route path="/admin/withdrawal_transactions" element={<WithdrawalTransactions />} />
        <Route path="/admin/:username/user_details" element={<ViewUserDetails />} />
        <Route path="/admin/:username/networks" element={<Referrals />} />
        <Route path="/admin/:username/edit_account" element={<EditUserDetails />} />
        <Route path="/admin/:username/user_transactions" element={<UserTransactions />} />
        <Route path="/admin/:username/transfer" element={<Transfer />} />
        <Route path="/admin/:username/transfers" element={<UserTransfers />} />
        <Route path="/admin/:username/upgrade_downgrade" element={<UpgradeDowngradePackage />} />
        <Route path="/admin/:username/user_reset_password" element={<ResetUserPassword />} />
        <Route path="/admin/:username/user_reset_pin" element={<ResetUserPIN />} />
        <Route path="/admin/:username/edit_wallet" element={<EditWallet />} />
        <Route path="/admin/admin_accounts" element={<AdminAccounts />} />
        <Route path="/admin/api_keys" element={<ApiKeys />} />
        <Route path="/admin/add_api" element={<AddApi />} />
        <Route path="/admin/:id/edit_api" element={<EditApi />} />

        <Route path="/admin/network_commissions_settings" element={<NetworkCommissions />} />
        <Route path="/admin/cable_commission_settings" element={<CableCommissions />} />
        <Route path="/admin/print_airtime_commissions_settings" element={<AirtimePrintCommissions />} />
        <Route path="/admin/electricitiy_commission_settings" element={<ElectricityCommissions />} />
       
        <Route path="/admin/free_users_network_commissions_settings" element={<FreeUsersNetworkCommissions />} />
        <Route path="/admin/free_users_cable_commission_settings" element={<FreeUsersCableCommissions />} />
        <Route path="/admin/free_users_print_airtime_commissions_settings" element={<FreeUsersAirtimePrintCommissions />} />
        <Route path="/admin/free_users_electricitiy_commission_settings" element={<FreeUsersElectricityCommissions />} />

        <Route path="/admin/data_prices_settings" element={<DataPrices />} />
        <Route path="/admin/add_data_price" element={<AddDataPrices />} />
        <Route path="/admin/cable_prices_settings" element={<CablePrices />} />
        <Route path="/admin/add_cable_price" element={<AddCablePrices />} />
        <Route path="/admin/electricity_prices_settings" element={<ElectricityPrices />} />
        <Route path="/admin/add_electricity_price" element={<AddElectricityPrices />} />

        <Route path="/admin/faq" element={<Faqs />} />
        <Route path="/admin/add_faq" element={<AddFaq />} />
        <Route path="*" element={<ComingSoon />} />
        </Route>
        

      </Routes>
      
        
    </BrowserRouter>
  );
}

export default App;

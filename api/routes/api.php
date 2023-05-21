<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\TransactionsController;
use App\Http\Controllers\AirtimeRechargeController;
use App\Http\Controllers\DataRechargeController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\CableController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ElectricityBillController;
use App\Http\Controllers\MonnifyController;
use App\Http\Controllers\AdminSettingsController;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\FlutterwaveController;

use App\Http\Controllers\WhatsAppCloudController;

use App\Http\Controllers\Api\V1\UsersApiController;
use App\Http\Controllers\Api\V1\AirtimeRechargeApiController;
use App\Http\Controllers\Api\V1\DataRechargeApiController;
use App\Http\Controllers\Api\V1\ElectricityBillApiController;
use App\Http\Controllers\Api\V1\CableApiController;
use App\Http\Controllers\Api\V1\RemLoanLendSquareController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('login', function () {
    return "Login";
});

Route::group([
    'prefix' => 'auth'
    ],
    function()
    {
        Route::post('register', [AuthController::class, 'signup']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('password_reset', [AuthController::class, 'password_reset']);
        Route::post('confirm_password_reset', [AuthController::class, 'confirm_password_reset']);
        Route::post('confirm_pin_reset', [AuthController::class, 'confirm_pin_reset']);
        Route::post('update_password', [AuthController::class, 'update_password']);
        Route::post('update_pin', [AuthController::class, 'update_pin']);
        Route::post('create_pin', [AuthController::class, 'create_pin']);
        Route::get('{login_token}/verify_login_token', [AuthController::class, 'verify_login_token']);
        Route::get('test', [AuthController::class, 'testText']);
    }
    );

    Route::group([
        'prefix' => 'user'
        ],
        function()
        {
          Route::post('update_user_account', [UsersController::class, 'update_user_account']);
          Route::post('upgrade', [UsersController::class, 'upgrade']);
          Route::get('{login_token}/user_details', [UsersController::class, 'get_user_details']);
          Route::get('{login_token}/virtual_account_details', [UsersController::class, 'virtual_account_details']);
          Route::get('{login_token}/check_pending_package', [UsersController::class, 'check_pending_package']);
          Route::get('{login_token}/{num}/referral_list', [UsersController::class, 'referral_list']);
          Route::post('add_bank_account', [UsersController::class, 'add_bank_account']);
          Route::get('{login_token}/{account_number}/{bank_code}/verify_bank_account', [UsersController::class, 'verify_bank_account']);

//API
Route::get('{login_token}/user_api', [ApiController::class, 'getUserApi']);
Route::post('create_api', [ApiController::class, 'CreateNewApiToken']);
        }
        );

        Route::group([
            'prefix' => 'transaction'
            ],
            function()
            {
                Route::post('transfer', [TransactionsController::class, 'transfer']);
                Route::post('withdraw', [TransactionsController::class, 'withdraw']);
                Route::post('verify_withdrawal_input', [TransactionsController::class, 'verify_withdrawal_input']);
                Route::get('{login_token}/{num}/transactions', [TransactionsController::class, 'transactions']);
                Route::get('{login_token}/{search}/search_transactions', [TransactionsController::class, 'search_transactions']);
                Route::get('{login_token}/{id}/view_transactions', [TransactionsController::class, 'view_transactions']);
                Route::get('{login_token}/{num}/cashback_transactions', [TransactionsController::class, 'cashback_transactions']);
                Route::get('{login_token}/activate_package_from_wallet', [TransactionsController::class, 'activate_package_from_wallet']);
                Route::get('{login_token}/{transaction_id}/verify_transaction', [TransactionsController::class, 'verify_transaction']);
            }
            );

            Route::group([
                'prefix' => 'coupon'
                ],
                function()
                {
                    Route::post('activate_with_coupon', [CouponController::class, 'activate_with_coupon']);
                    Route::post('fund_with_coupon', [CouponController::class, 'fund_with_coupon']);
                    Route::post('create_package_pin', [CouponController::class, 'create_package_pin']);
                    Route::get('{login_token}/package_coupons', [CouponController::class, 'package_coupons']);
                    Route::get('{login_token}/wallet_coupons', [CouponController::class, 'wallet_coupons']);
                    Route::get('{login_token}/{coupon}/search_coupon', [CouponController::class, 'search_coupon']);
                    Route::post('create_wallet_pin', [CouponController::class, 'create_wallet_pin']);

                }
                );

                Route::group([
                    'prefix' => 'recharge'
                    ],
                    function()
                    {
                      Route::post('verify_input', [AirtimeRechargeController::class, 'verify_input']);
                      Route::post('verify_airtime_input', [AirtimeRechargeController::class, 'verify_airtime_input']);
                      Route::post('buy_airtime', [AirtimeRechargeController::class, 'buy_airtime']);
                      Route::post('print_airtime', [AirtimeRechargeController::class, 'print_airtime']);
                      Route::post('buy_data', [AirtimeRechargeController::class, 'buy_none_sme_data']);
                        Route::post('mtn_sme_data', [AirtimeRechargeController::class, 'mtn_sme_data']);
                        Route::get('get_data_billing', [AirtimeRechargeController::class, 'getDataBillingList']);
                        Route::get('{login_token}/{id}/get_airtime_details', [AirtimeRechargeController::class, 'get_airtime_details']);
                        Route::get('{token}/{id}/get_airtime_details_public', [AirtimeRechargeController::class, 'get_airtime_details_public']);
                        Route::get('{login_token}/get_airtime_list', [AirtimeRechargeController::class, 'get_airtime_list']);

                        Route::post('verify_cable_data', [CableController::class, 'verify_cable_data']);
                        Route::post('cable_subscription', [CableController::class, 'cable_subscription']);
                        Route::get('get_cable_billing', [CableController::class, 'getCableBillingList']);

                        Route::post('verify_electricity_data', [ElectricityBillController::class, 'verify_electricity_data']);
                        Route::post('electricity_subscription', [ElectricityBillController::class, 'electricity_subscription']);
                        Route::get('get_electricity_billing', [ElectricityBillController::class, 'getElectricityBillingList']);
                        Route::get('{login_token}/{id}/get_electricity_details', [ElectricityBillController::class, 'get_electricity_details']);
                        Route::get('{login_token}/get_token_list', [ElectricityBillController::class, 'get_token_list']);

                    }
                    );

                    Route::group([
                        'prefix' => 'apis'
                        ],
                        function()
                        {
                            Route::get('api_keys', [SettingsController::class, 'api_keys']);
                        }
                        );

                        Route::group([
                            'prefix' => 'admin'
                            ],
                            function()
                            {
                              Route::get('website_settings', [AdminController::class, 'website_setting']);
                              Route::post('create_package_pin', [AdminController::class, 'create_package_pin']);
                              Route::get('{login_token}/package_coupons', [AdminController::class, 'package_coupons']);
                              Route::get('{login_token}/wallet_coupons', [AdminController::class, 'wallet_coupons']);
                              Route::get('{login_token}/{coupon}/search_coupon', [AdminController::class, 'search_coupon']);
                              Route::post('create_wallet_pin', [AdminController::class, 'create_wallet_pin']);
                              Route::post('update_user_profile', [AdminController::class, 'update_user_profile']);
                              Route::post('update_user_wallet', [AdminController::class, 'update_user_wallet']);
                              Route::get('{login_token}/{username}/user_details', [AdminController::class, 'user_details']);
                              Route::get('{login_token}/{username}/search_user', [AdminController::class, 'search_user']);
                              Route::get('{login_token}/{username}/{num}/transactions', [AdminController::class, 'transactions']);
                              Route::post('{username}/transfer', [AdminController::class, 'transfer']);
                              Route::get('{login_token}/{username}/deactivate_activate_account', [AdminController::class, 'deactivate_activate_account']);
                              Route::get('{login_token}/{username}/delete_account', [AdminController::class, 'delete_account']);
                              Route::post('{login_token}/{username}/upgrade_downgrade', [AdminController::class, 'upgrade_downgrade']);
                              Route::post('{login_token}/{username}/reset_password', [AdminController::class, 'reset_password']);
                              Route::post('{login_token}/{username}/reset_pin', [AdminController::class, 'reset_pin']);
                              Route::get('{login_token}/list_users', [AdminController::class, 'list_users']);

                              Route::get('{login_token}/site_stats', [AdminController::class, 'site_stats']);
                              Route::get('{login_token}/airtime_print_amount_stats', [AdminController::class, 'airtimePrintAmountStats']);
                              Route::get('{login_token}/{network}/available_airtime_stats', [AdminController::class, 'availableAirtimeStats']);
                              Route::get('{login_token}/{network}/used_airtime_stats', [AdminController::class, 'usedAirtimeStats']);

                              Route::get('{login_token}/{username}/{num}/transfer_transactions', [AdminController::class, 'transfer_transactions']);
                              Route::get('{login_token}/{num}/bank_withdrawal_transactions', [AdminController::class, 'bank_withdrawal_transactions']);
                              Route::get('{login_token}/{id}/{status}/payment_approval', [AdminController::class, 'payment_approval']);

                              Route::get('{login_token}/{chat_type}/chats', [AdminController::class, 'chats']);
                              Route::get('{login_token}/{phone}/open_chats', [AdminController::class, 'open_chats']);
                              Route::get('{login_token}/{messageId}/open_chats_by_message_id', [AdminController::class, 'open_chats_by_message_id']);
                              Route::get('{login_token}/{messageId}/opened_chat_details', [AdminController::class, 'opened_chat_details']);
                              Route::post('{login_token}/replyChat', [AdminController::class, 'replyChat']);


                              Route::post('add_airtime_pin', [AdminSettingsController::class, 'addAirtimePin']);
                              Route::get('{login_token}/{num}/airtime_pins', [AdminSettingsController::class, 'airtime_pins']);
                              Route::get('{login_token}/{search}/search_airtime_pins', [AdminSettingsController::class, 'search_airtime_pins']);
                              Route::get('{login_token}/{num}/admin_airtime_pins', [AdminSettingsController::class, 'admin_airtime_pins']);
                              Route::get('{login_token}/{search}/admin_search_airtime_pins', [AdminSettingsController::class, 'admin_search_airtime_pins']);

                            Route::post('update_website_settings', [AdminSettingsController::class, 'update_website_settings']);

                            Route::post('{id}/update-api', [AdminSettingsController::class, 'updateApi']);
                            Route::post('add-api', [AdminSettingsController::class, 'addApi']);
                            Route::get('{login_token}/list-api', [AdminSettingsController::class, 'listApi']);
                            Route::get('{login_token}/{id}/api-details', [AdminSettingsController::class, 'ApiDetails']);
                            Route::get('{login_token}/{id}/delete-api-details', [AdminSettingsController::class, 'deleteApi']);

                            Route::get('{login_token}/list-admin', [AdminSettingsController::class, 'listAdmin']);
                            Route::get('{login_token}/{username}/make-admin', [AdminSettingsController::class, 'makeAdmin']);

                            Route::get('{login_token}/commission-details', [AdminSettingsController::class, 'CommissionDetails']);
                            Route::post('update-network-commission', [AdminSettingsController::class, 'updateNetworkCommission']);
                            Route::post('update-airtime-print-commission', [AdminSettingsController::class, 'updateAirtimePrintCommission']);
                            Route::post('update-cable-commission', [AdminSettingsController::class, 'updateCableCommission']);
                            Route::post('update-electricity-commission', [AdminSettingsController::class, 'updateElectricityCommission']);

                            Route::get('{login_token}/free-users-commission-details', [AdminSettingsController::class, 'FreeUsersCommissionDetails']);
                            Route::post('free-users-update-network-commission', [AdminSettingsController::class, 'FreeUsersUpdateNetworkCommission']);
                            Route::post('free-users-update-airtime-print-commission', [AdminSettingsController::class, 'FreeUsersUpdateAirtimePrintCommission']);
                            Route::post('free-users-update-cable-commission', [AdminSettingsController::class, 'FreeUsersUpdateCableCommission']);
                            Route::post('free-users-update-electricity-commission', [AdminSettingsController::class, 'FreeUsersUpdateElectricityCommission']);

                            // Route::post('update-network-data-commission', [AdminSettingsController::class, 'updateNetworkDataCommission']);
                           Route::get('{login_token}/services-details', [AdminSettingsController::class, 'ServicesDetails']);
                           Route::post('add-data-price', [AdminSettingsController::class, 'addDataPrice']);
                           Route::post('add-electricity-price', [AdminSettingsController::class, 'addElectricityPrice']);
                           Route::post('add-cable-price', [AdminSettingsController::class, 'addCablePrice']);
                           Route::get('{login_token}/{id}/delete-data-service', [AdminSettingsController::class, 'deleteDataService']);
                           Route::get('{login_token}/{id}/delete-electricity-service', [AdminSettingsController::class, 'deleteElectricityService']);
                           Route::get('{login_token}/{id}/delete-cable-service', [AdminSettingsController::class, 'deleteCableService']);

                           Route::post('add-question', [AdminSettingsController::class, 'addQuestion']);
                           Route::get('{login_token}/{id}/delete-question', [AdminSettingsController::class, 'deleteQuestion']);
                           Route::get('{login_token}/list-questions', [AdminSettingsController::class, 'listQuestions']);

                            }
                          );

                          Route::group([
                            'prefix' => 'monnify'
                            ],
                            function()
                            {
                                Route::get('login', [MonnifyController::class, 'login']);
                                Route::post('check_pending_transfer', [MonnifyController::class, 'check_pending_transfer']);
                                Route::post('reserveAccount', [MonnifyController::class, 'reserveAccount']);
                                Route::post('successful_transfer_webhook/e3dr334-v1298-98jh-eh6hbfdg7902-edhgg', [MonnifyController::class, 'successful_transfer_webhook']);
                            }
                            );

                            Route::group([
                              'prefix' => 'flutterwave'
                              ],
                              function()
                              {
                                  Route::post('reserveFlutterwaveAccount', [FlutterwaveController::class, 'reserveFlutterwaveAccount']);
                                  Route::post('flutter_successful_transfer_webhook/e3dr334-v1298-98jh-eh6hbfdg7902-edhgg', [FlutterwaveController::class, 'FlutterwaveSuccessfulTransferWebhook']);
                              }
                              );

                            Route::group([
                                'prefix' => 'general'
                                ],
                                function()
                                {
                                  Route::get('packages', [GeneralController::class, 'packages']);
                                  Route::get('faq', [GeneralController::class, 'faqs']);
                                }
                                );


                                Route::group([
                                    'prefix' => 'meta'
                                    ],
                                    function()
                                    {
                                      Route::post('messages/webhook', [WhatsAppCloudController::class, 'MessagesWebhook']);
                                      Route::get('messages/webhook', [WhatsAppCloudController::class, 'MessagesWebhook']);
                                    }
                                    );


//Users API
                                Route::group([
                                    'prefix' => 'v1/recharge'
                                    ],
                                    function()
                                    {
                                        Route::post('buy_airtime', [AirtimeRechargeApiController::class, 'buy_airtime']);
                                        Route::post('print_airtime', [AirtimeRechargeApiController::class, 'print_airtime']);
                                        Route::post('clubkonnect_print_airtime', [AirtimeRechargeApiController::class, 'clubkonnect_print_airtime']);
                                        Route::post('buy_data', [AirtimeRechargeApiController::class, 'buy_none_sme_data']);
                                        Route::post('mtn_sme_data', [AirtimeRechargeApiController::class, 'mtn_sme_data']);
                                        Route::post('sme_data', [AirtimeRechargeApiController::class, 'mtn_sme_data']);
                                        Route::get('get_data_billing', [AirtimeRechargeApiController::class, 'getDataBillingList']);
                                        Route::get('data_codes', [AirtimeRechargeApiController::class, 'getDataBillingList']);
                                        Route::get('{login_token}/{id}/get_airtime_details', [AirtimeRechargeApiController::class, 'get_airtime_details']);
                                        Route::get('{login_token}/get_airtime_list', [AirtimeRechargeApiController::class, 'get_airtime_list']);

                                        Route::post('verify_cable', [CableApiController::class, 'verify_cable_data']);
                                        Route::post('cable_subscription', [CableApiController::class, 'cable_subscription']);
                                        Route::get('get_cable_billing', [CableApiController::class, 'getCableBillingList']);
                                        Route::get('cable_codes', [CableApiController::class, 'getCableBillingList']);

                                        Route::post('verify_meter', [ElectricityBillApiController::class, 'verify_electricity_data']);
                                        Route::post('electricity_subscription', [ElectricityBillApiController::class, 'electricity_subscription']);
                                        Route::get('get_electricity_billing', [ElectricityBillApiController::class, 'getElectricityBillingList']);
                                        Route::get('electricity_codes', [ElectricityBillApiController::class, 'getElectricityBillingList']);
                                        Route::get('{login_token}/{id}/get_electricity_details', [ElectricityBillApiController::class, 'get_electricity_details']);
                                        Route::get('{login_token}/get_token_list', [ElectricityBillApiController::class, 'get_token_list']);


                                    }
                                    );

                                    Route::group([
                                        'prefix' => 'v1/user'
                                        ],
                                        function()
                                        {
                                          Route::get('{login_token}/user_details', [UsersApiController::class, 'get_user_details']);
                                          Route::get('{login_token}/virtual_account_details', [UsersApiController::class, 'virtual_account_details']);
                                        }
                                        );

                                        Route::group([
                                            'prefix' => 'v1/remloan'
                                            ],
                                            function()
                                            {

                                                Route::post('onboard_new_user', [RemLoanLendSquareController::class, 'onboardNewUser']);
                                                Route::post('verify_new_user', [RemLoanLendSquareController::class, 'verifyPhoneNumber']);
                                                Route::post('save_new_user_location', [RemLoanLendSquareController::class, 'saveNewUserLocation']);
                                                Route::post('save_new_user_contacts', [RemLoanLendSquareController::class, 'saveNewUserContacts']);
                                                Route::post('error_logs', [RemLoanLendSquareController::class, 'remErrorLogs']);

                                            }
                                            );

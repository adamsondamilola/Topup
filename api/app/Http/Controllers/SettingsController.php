<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class SettingsController extends Controller
{
  public function api_keys(Request $request)
  {
    $apis = DB::table('api_keys')
    ->get();
    return response()->json(['status' => 1,
    'message' => 'API Keys',
    'result' => []], 200);
  }
}

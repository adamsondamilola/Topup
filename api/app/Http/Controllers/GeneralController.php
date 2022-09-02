<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class GeneralController extends Controller
{
    public function packages(Request $request)
    {
        $web_settings = DB::table('website_settings')
        ->Where('id', 1)
        ->first();
    $pks = DB::table('packages')->orderBy('amount', 'asc');
    if($web_settings->package_type == "affiliate")
    {
        $pks = $pks->Where('type', 'affiliate')->get();
    }
    else
    {
        $pks = $pks->Where('type', 'multi_level')->get();
    }

    return response()->json(['status' => 1,
        'message' => 'Pks',
        'result' => $pks], 200);
    }

    public function faqs(Request $request)
    {
    $faq = DB::table('faq')->get()->all();
    return response()->json(['status' => 1,
        'message' => 'faq',
        'result' => $faq], 200);
    }

}

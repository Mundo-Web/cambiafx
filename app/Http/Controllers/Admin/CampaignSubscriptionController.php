<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\CampaignSubscription;
use Illuminate\Http\Request;

class CampaignSubscriptionController extends BasicController
{
    public $model = CampaignSubscription::class;
    public $reactView = 'Admin/CampaignSubscriptions';

    public function setReactViewProperties(Request $request)
    {
        return [
            'PROGRAMER' => env('PROGRAMER')
        ];
    }
}

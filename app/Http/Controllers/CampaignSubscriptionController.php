<?php

namespace App\Http\Controllers;

use App\Models\CampaignSubscription;
use App\Models\TransactionalLanding;
use Illuminate\Http\Request;

class CampaignSubscriptionController extends BasicController
{
    public $model = CampaignSubscription::class;

    public function beforeSave(Request $request): array
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:25',
            'transactional_landing_id' => 'nullable|exists:transactional_landings,id',
            'campaign_name' => 'nullable|string|max:255',
            'utm_source' => 'nullable|string|max:255',
            'utm_medium' => 'nullable|string|max:255',
            'utm_campaign' => 'nullable|string|max:255',
        ]);

        if (empty($validated['campaign_name']) && !empty($validated['transactional_landing_id'])) {
            $landing = TransactionalLanding::find($validated['transactional_landing_id']);
            if ($landing) {
                $validated['campaign_name'] = $landing->campaign_name ?? $landing->name;
            }
        }

        return $validated;
    }
}

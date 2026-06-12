<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'transactional_landing_id',
        'campaign_name',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'name',
        'email',
        'phone',
        'status'
    ];

    public function landing()
    {
        return $this->belongsTo(TransactionalLanding::class, 'transactional_landing_id');
    }
}

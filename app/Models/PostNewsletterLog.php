<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostNewsletterLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'post_id',
        'subscription_id',
        'email',
        'status',
        'error_message',
        'sent_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    public function campaign()
    {
        return $this->belongsTo(PostNewsletterCampaign::class, 'campaign_id');
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}

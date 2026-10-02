<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostNewsletterCampaign extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'post_id',
        'total_subscribers',
        'sent_count',
        'failed_count',
        'daily_limit',
        'target_order',
        'status',
        'last_processed_subscription_id',
        'last_sent_at',
        'next_batch_at',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'total_subscribers' => 'integer',
        'sent_count' => 'integer',
        'failed_count' => 'integer',
        'daily_limit' => 'integer',
        'last_sent_at' => 'datetime',
        'next_batch_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function logs()
    {
        return $this->hasMany(PostNewsletterLog::class, 'campaign_id');
    }
}

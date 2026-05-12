<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionalLanding extends Model
{
    use HasFactory;

    protected $fillable = [
        'url',
        'name',
        'h1',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'hero_eyebrow',
        'hero_title',
        'hero_subtitle',
        'stats',
        'comparison_data',
        'comparison_title',
        'comparison_subtitle',
        'comparison_cta',
        'steps_title',
        'steps_subtitle',
        'cta_title',
        'cta_subtitle',
        'cta_button_text',
        'cta_button_link',
        'cta_image',
        'schema_service_name',
        'schema_service_description',
        'schema_service_phone',
        'schema_service_address_locality',
        'schema_service_address_region',
        'schema_service_address_country',
        'schema_service_opening_hours',
        'schema_service_payments_accepted',
        'schema_faq',
        'steps',
        'company_types',
        'benefit_cards',
        'status',
        'lang_id'
    ];

    protected $casts = [
        'stats' => 'array',
        'comparison_data' => 'array',
        'schema_faq' => 'array',
        'steps' => 'array',
        'company_types' => 'array',
        'benefit_cards' => 'array',
        'status' => 'boolean'
    ];

    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }
}
